import { LocalSettings } from '../services/localSettings.js';
import { ContextManager } from './context.js';
import { aiApi } from '../services/aiApi.js';
import { getAllToolSchemas } from './toolSchemas.js';
import { executeAgentTool } from './agentToolBridge.js';
import { PLANS } from '../config/plans.js';
import { SmartRouter } from './smartRouter.js';
import { RealtimeTools } from '../tools/realtimeTools.js';

const AGENT_INSTRUCTIONS = `You are ToolsHub AI Agent. You can:
1. Use tools to help the user (calculator, weather, search, code tools)
2. Generate websites with the generate_website tool
3. Answer questions using your knowledge
4. Write code, explain code, analyze code

Rules:
- Use tools when they provide better answers
- For websites: use generate_website tool with complete HTML
- For code: provide complete, working code
- For calculations: use calculator tool
- For weather: use weather tool
- For search: use search tool
- Always give helpful, accurate responses`;

const MAX_STEPS_DEFAULT = 8;
const MAX_STEPS_MAX_TIER = 12;

function formatDataResult(toolId, result) {
  if (!result) return 'No data returned.';
  
  if (toolId === 'weather' && result) {
    return `Weather in ${result.location || 'location'}: ${result.temperature ?? '?'}°C, wind ${result.windspeed ?? '?'} km/h.`;
  }
  if (toolId === 'calculator' && result) {
    return `${result.original_expression} = ${result.result}`;
  }
  if (toolId === 'search' && result) {
    const answer = result.answer ? `Summary: ${result.answer}\n` : '';
    const top = (result.results || []).slice(0, 3).map(r => `- ${r.title}: ${r.url}`).join('\n');
    return `${answer}${top}`.trim() || JSON.stringify(result);
  }
  return JSON.stringify(result);
}

// Pre-process with Smart Router
function preProcessMessage(userMessage) {
  // Check for direct tool execution
  const routerResult = SmartRouter.route(userMessage);
  return routerResult;
}

export async function executeAgentTask(userMessage, conversationHistory, options = {}) {
  try {
    const currentPlanId = LocalSettings.getCurrentPlan ? LocalSettings.getCurrentPlan() : 'free';
    const activePlan = PLANS.find(p => p.id === currentPlanId) || PLANS[0];
    let maxSteps = (activePlan.label === 'Max') ? MAX_STEPS_MAX_TIER : MAX_STEPS_DEFAULT;
    
    // Pre-process with Smart Router
    const routerResult = await preProcessMessage(userMessage);
    
    // If direct tool execution, return immediately
    if (routerResult.type === 'direct') {
      return {
        success: true,
        message: formatDataResult(routerResult.tool, routerResult.result),
        toolUsed: routerResult.tool
      };
    }
    
    const builtContext = ContextManager.buildContext(conversationHistory || [], options.toolResults || []);
    const messages = [
      ...builtContext,
      { role: "system", content: AGENT_INSTRUCTIONS },
      { role: "user", content: userMessage }
    ];

    const schemas = getAllToolSchemas();
    
    let step = 0;
    let lastPartialText = null;
    
    while (step < maxSteps) {
      step++;
      
      const response = await aiApi.chatAgentRound(messages, schemas);

      if (step === 1 && response.meta && response.meta.maxSteps) {
        maxSteps = response.meta.maxSteps;
      }
      
      const responseMessage = response.choices && response.choices[0] && response.choices[0].message;
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

          if (options.onStep) {
            options.onStep({ stepNumber: step, toolId, status: 'running' });
          }

          let parsedParams = {};
          try {
            parsedParams = JSON.parse(toolCall.function.arguments || '{}');
          } catch (e) {
            console.warn(`Failed to parse arguments for tool ${toolId}`);
          }

          // Handle generate_website - return HTML artifact
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
          
          // Handle realtime tools
          if (toolId === 'calculator') {
            const result = RealtimeTools.calculate(parsedParams.expression);
            return {
              success: true,
              message: `**${result.original} = ${result.formatted}**`,
              toolUsed: 'calculator'
            };
          }
          
          if (toolId === 'weather') {
            const result = await RealtimeTools.getWeather ? RealtimeTools.getWeather(parsedParams.city) : null;
            if (result) {
              return {
                success: true,
                message: `Weather in ${parsedParams.city}: ${result.temperature}°C`,
                toolUsed: 'weather'
              };
            }
          }
          
          let toolResponseText = "";
          let stepStatus = 'complete';
          
          const toolResult = await executeAgentTool(toolId, parsedParams);
          
          if (!toolResult.success) {
            toolResponseText = `Error: ${toolResult.error}`;
            stepStatus = 'error';
          } else {
            if (toolResult.kind === 'ui-trigger') {
              toolResponseText = `The ${toolId} tool has been opened for you.`;
            } else if (toolResult.kind === 'content') {
              const CONTENT_GEN_TIMEOUT_MS = 20000;
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
                toolResponseText = choice ? choice : "Content generation returned empty.";
              } catch (err) {
                toolResponseText = `Content generation failed: ${err.message}`;
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
          message: responseMessage.content
        };
      }
    }
    
    const partialMessage = lastPartialText
      || "I made progress but couldn't finish. Could you narrow the request?";
    
    return {
      success: true,
      truncated: true,
      message: partialMessage
    };

  } catch (error) {
    console.error("Agent Loop Error:", error);
    return {
      success: false,
      error: 'agent-error',
      message: "An error occurred. Please try again.",
      technicalError: error.message
    };
  }
}
