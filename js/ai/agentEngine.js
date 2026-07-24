import { LocalSettings } from '../services/localSettings.js';
import { ContextManager } from './context.js';
import { aiApi } from '../services/aiApi.js';
import { getAllToolSchemas } from './toolSchemas.js';
import { executeAgentTool } from './agentToolBridge.js';
import { PLANS } from '../config/plans.js';

const AGENT_INSTRUCTIONS = `
--- AGENT INSTRUCTIONS ---
You have access to a set of specialized tools to assist the user.

REASONING MODE (Chain-of-Thought):
Before calling any tool, think through the approach in a <thinking> block:
1. What is the user actually asking for?
2. What tools do I need?
3. What order should I use them?
4. What could go wrong?
5. What's the best approach?

PLANNING MODE (for complex tasks):
For tasks requiring 3+ steps, first create a plan:
1. Break the task into sub-tasks
2. Identify which tools solve each sub-task
3. Execute step by step
4. Verify each result before moving on

TOOL USAGE RULES:
- Do not guess or hallucinate answers that tools can provide
- If multiple tools are needed, call them sequentially (one at a time)
- After each tool call, analyze the result before deciding next step
- If a tool fails, try an alternative approach before giving up
- When you have enough information, provide a final answer with NO tool_calls

ERROR RECOVERY:
- If a tool returns an error, don't stop — try a different approach
- If weather fails, try web search for weather data
- If search fails, use your knowledge and note the limitation
- Always give the user a useful response, even if tools fail

RESPONSE FORMAT:
- Use markdown formatting for clarity
- Include code blocks for code
- Use tables for structured data
- Use bullet points for lists
- Keep responses focused and actionable

generate_website CRITICAL RULE:
Step 1: Write a <thinking> block to plan the website structure
Step 2: Emit the generate_website tool call with the planned content
`;

const MAX_STEPS = { free: 8, monthly: 12, '6month': 15, yearly: 20 };

function getStepsForPlan(planId) {
  return MAX_STEPS[planId] || MAX_STEPS.free;
}

function formatDataResult(toolId, result) {
  if (!result) return 'No data returned.';
  
  if (toolId === 'weather' && result) {
    const location = result.location || 'the requested location';
    const temp = result.temperature ?? '?';
    const wind = result.windspeed ?? '?';
    const desc = result.description || '';
    return `**Weather in ${location}:** ${temp}°C${desc ? ` — ${desc}` : ''}, wind ${wind} km/h.`;
  }
  
  if (toolId === 'calculator' && result) {
    return `**${result.original_expression} = ${result.result}**`;
  }
  
  if (toolId === 'search' && result) {
    const answer = result.answer ? `**Summary:** ${result.answer}\n\n` : '';
    const results = (result.results || []).slice(0, 5);
    if (results.length === 0) return answer || 'No search results found.';
    const list = results.map((r, i) => `${i + 1}. **${r.title}**\n   ${r.url}\n   ${r.snippet || ''}`).join('\n\n');
    return `${answer}**Sources:**\n${list}`;
  }
  
  if (toolId === 'github_list_files' && result) {
    const files = typeof result === 'string' ? result.split('\n') : [];
    if (files.length === 0) return 'No files found in repository.';
    return `**Repository Files (${files.length} total):**\n\`\`\`\n${files.slice(0, 50).join('\n')}${files.length > 50 ? '\n... and ' + (files.length - 50) + ' more' : ''}\n\`\`\``;
  }
  
  if (toolId === 'github_read_file' && result) {
    const content = typeof result === 'string' ? result : JSON.stringify(result, null, 2);
    return `\`\`\`\n${content}\n\`\`\``;
  }
  
  return typeof result === 'string' ? result : JSON.stringify(result, null, 2);
}

function estimateTaskComplexity(userMessage) {
  const msg = userMessage.toLowerCase();
  const complexKeywords = ['build', 'create', 'design', 'develop', 'implement', 'full', 'complete', 'entire', 'website', 'app', 'application', 'project', 'system', 'architecture'];
  const mediumKeywords = ['analyze', 'compare', 'research', 'write', 'generate', 'list', 'find', 'search', 'review', 'explain'];
  
  const complexCount = complexKeywords.filter(k => msg.includes(k)).length;
  const mediumCount = mediumKeywords.filter(k => msg.includes(k)).length;
  
  if (complexCount >= 2) return 'complex';
  if (complexCount >= 1 || mediumCount >= 2) return 'medium';
  return 'simple';
}

export async function executeAgentTask(userMessage, conversationHistory, options = {}) {
  try {
    const currentPlanId = LocalSettings.getCurrentPlan ? LocalSettings.getCurrentPlan() : 'free';
    const maxSteps = getStepsForPlan(currentPlanId);
    const complexity = estimateTaskComplexity(userMessage);
    
    const builtContext = ContextManager.buildContext(conversationHistory || [], options.toolResults || []);
    const messages = [
      ...builtContext,
      { role: "system", content: AGENT_INSTRUCTIONS },
      { role: "user", content: userMessage }
    ];

    const schemas = getAllToolSchemas();
    
    let step = 0;
    let lastPartialText = null;
    let toolCallCount = 0;
    let errorCount = 0;
    
    while (step < maxSteps) {
      step++;
      
      const response = await aiApi.chatAgentRound(messages, schemas);

      if (step === 1 && response.meta && response.meta.maxSteps) {
        // Allow server to override max steps
      }
      
      const responseMessage = response.choices?.[0]?.message;
      if (!responseMessage) {
        throw new Error("Invalid response format from AI provider.");
      }

      if (responseMessage.tool_calls && responseMessage.tool_calls.length > 0) {
        if (responseMessage.content) {
          lastPartialText = responseMessage.content;
        }

        messages.push(responseMessage);
        
        for (const toolCall of responseMessage.tool_calls) {
          const toolId = toolCall.function.name;
          toolCallCount++;

          if (options.onStep) {
            options.onStep({ 
              stepNumber: step, 
              toolId, 
              status: 'running',
              thinking: responseMessage.content || null
            });
          }

          let parsedParams = {};
          try {
            parsedParams = JSON.parse(toolCall.function.arguments || '{}');
          } catch (e) {
            console.warn(`Failed to parse arguments for tool ${toolId}`);
          }

          if (toolId === 'generate_website') {
            return {
              success: true,
              message: "Website generated successfully!",
              artifact: {
                type: 'artifact',
                kind: 'website',
                title: parsedParams.title || 'Generated Website',
                content: parsedParams.html_content || ''
              }
            };
          }
          
          let toolResponseText = "";
          let stepStatus = 'complete';
          
          const toolResult = await executeAgentTool(toolId, parsedParams);
          
          if (!toolResult.success) {
            errorCount++;
            toolResponseText = `Tool error: ${toolResult.error}. Trying alternative approach...`;
            stepStatus = 'error';
            
            if (errorCount > 3) {
              toolResponseText = `Multiple tool failures encountered. Providing best answer with available information.`;
            }
          } else {
            if (toolResult.kind === 'ui-trigger') {
              toolResponseText = `The ${toolId} tool panel has been opened for you.`;
            } else if (toolResult.kind === 'content') {
              const CONTENT_GEN_TIMEOUT_MS = 25000;
              try {
                const contentGenPromise = aiApi.chatAgentRound([
                  { role: "system", content: toolResult.result.systemPromptHint },
                  { role: "user", content: toolResult.result.userInput }
                ], undefined);
                
                const timeoutPromise = new Promise((_, reject) =>
                  setTimeout(() => reject(new Error('Content generation timed out.')), CONTENT_GEN_TIMEOUT_MS)
                );

                const contentGenResponse = await Promise.race([contentGenPromise, timeoutPromise]);
                const choice = contentGenResponse?.choices?.[0]?.message?.content;
                toolResponseText = choice || "Content generation returned empty.";
              } catch (err) {
                toolResponseText = `Content generation failed: ${err.message}`;
                stepStatus = 'error';
                errorCount++;
              }
            } else {
              toolResponseText = formatDataResult(toolId, toolResult.result);
            }
          }
          
          messages.push({
            role: "tool",
            tool_call_id: toolCall.id,
            content: toolResponseText
          });
          
          if (options.onStep) {
            options.onStep({
              stepNumber: step,
              toolId: toolId,
              status: stepStatus,
              result: toolResponseText
            });
          }
        }
      } else {
        return {
          success: true,
          message: responseMessage.content,
          stats: { stepsUsed: step, toolsCalled: toolCallCount, errors: errorCount }
        };
      }
    }
    
    const partialMessage = lastPartialText
      || "Task completed partially. Could you narrow the request or ask me to continue?";
    
    return {
      success: true,
      truncated: true,
      message: partialMessage,
      stats: { stepsUsed: step, toolsCalled: toolCallCount, errors: errorCount }
    };

  } catch (error) {
    console.error("Agent Loop Error:", error);
    return {
      success: false,
      error: 'agent-error',
      message: "An error occurred while processing your task. Please try again.",
      technicalError: error.message
    };
  }
}
