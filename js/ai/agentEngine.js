import { LocalSettings } from '../services/localSettings.js';
import { ContextManager } from './context.js';
import { aiApi } from '../services/aiApi.js';
import { getAllToolSchemas } from './toolSchemas.js';
import { executeAgentTool } from './agentToolBridge.js';

import { PLANS } from '../config/plans.js';

const AGENT_INSTRUCTIONS = `
\n\n--- AGENT INSTRUCTIONS ---
You have access to a set of specialized tools to assist the user. 
When the user asks you to perform a task, use the provided tools to gather data, generate content, or trigger UI panels.
- Do not guess or hallucinate answers that tools can provide (like current weather, math calculations, or content generation).
- If multiple tools are needed to fulfill a complex request, you may call them sequentially or in parallel.
- Once you have successfully fulfilled the user's request using the tools, provide a final, direct answer in plain text with NO tool_calls.
- If a tool triggers a UI panel, just acknowledge it to the user.
- Remember to answer naturally and follow your persona guidelines in the final response.

CRITICAL REQUIREMENT for generate_website tool:
You must NOT write a complex website in one giant shot. You MUST use a 2-step process:
Step 1: Write a <thinking> block to plan the website structure, colors, layout, and functionality. Do not call the tool in this step.
Step 2: Emit the generate_website tool call with the planned content.
`;

const MAX_STEPS_DEFAULT = 8;
const MAX_STEPS_MAX_TIER = 12;

function formatDataResult(toolId, result) {
  if (toolId === 'weather' && result) {
    return `Weather in ${result.location || 'the requested location'}: ${result.temperature ?? '?'}°C, wind ${result.windspeed ?? '?'} km/h.`;
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

export async function executeAgentTask(userMessage, conversationHistory, options = {}) {
  try {
    // 1. Determine tier and model
    // 1. Determine maxSteps based on plan
    const currentPlanId = LocalSettings.getCurrentPlan ? LocalSettings.getCurrentPlan() : 'free';
    const activePlan = PLANS.find(p => p.id === currentPlanId) || PLANS[0];
    let maxSteps = (activePlan.label === 'Max') ? MAX_STEPS_MAX_TIER : MAX_STEPS_DEFAULT;
    
    const builtContext = ContextManager.buildContext(conversationHistory || [], options.toolResults || []);
    const messages = [
      ...builtContext,
      { role: "system", content: AGENT_INSTRUCTIONS },
      { role: "user", content: userMessage }
    ];

    const schemas = getAllToolSchemas();
    
    let step = 0;
    let lastPartialText = null;
    
    // 4. Loop
    while (step < maxSteps) {
      step++;
      
      // a. Call worker in agent mode
      const response = await aiApi.chatAgentRound(messages, schemas);

      if (step === 1 && response.meta && response.meta.maxSteps) {
        maxSteps = response.meta.maxSteps;
      }
      
      const responseMessage = response.choices && response.choices[0] && response.choices[0].message;
      if (!responseMessage) {
        throw new Error("Invalid response format from AI provider.");
      }

      // b. If tool calls exist
      if (responseMessage.tool_calls && responseMessage.tool_calls.length > 0) {
        if (responseMessage.content) {
          lastPartialText = responseMessage.content;
        }

        // Append the assistant's tool call message exactly as returned
        messages.push(responseMessage);
        
        // Process each tool call
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

          if (toolId === 'generate_website') {
            return {
              success: true,
              message: "I have generated the website for you.",
              artifact: {
                type: 'artifact',
                kind: 'website',
                title: parsedParams.title || 'Generated Website',
                content: parsedParams.html_content || ''
              }
            };
          }
          
          let toolResponseText = "";
          
          // Call the tool bridge
          const toolResult = await executeAgentTool(toolId, parsedParams);
          let stepStatus = 'complete';
          
          if (!toolResult.success) {
            toolResponseText = `Error calling tool: ${toolResult.error}`;
            stepStatus = 'error';
          } else {
            // d. kind: "ui-trigger"
            if (toolResult.kind === 'ui-trigger') {
              toolResponseText = `The ${toolId} panel has been opened for the user.`;
            } 
            // e. kind: "content"
            else if (toolResult.kind === 'content') {
              const CONTENT_GEN_TIMEOUT_MS = 20000;
              try {
                // Secondary generation using the prompt hint
                const contentGenPromise = aiApi.chatAgentRound([
                  { role: "system", content: toolResult.result.systemPromptHint },
                  { role: "user", content: toolResult.result.userInput }
                ], undefined); // no tools
                
                const timeoutPromise = new Promise((_, reject) =>
                  setTimeout(() => reject(new Error('Content generation timed out.')), CONTENT_GEN_TIMEOUT_MS)
                );

                const contentGenResponse = await Promise.race([contentGenPromise, timeoutPromise]);
                const choice = contentGenResponse?.choices?.[0]?.message?.content;
                toolResponseText = choice ? choice : "Content generation returned an empty response.";
              } catch (err) {
                toolResponseText = `Content generation failed: ${err.message}`;
              }
            } 
            // kind: "data"
            else {
              toolResponseText = formatDataResult(toolId, toolResult.result);
            }
          }
          
          // Append tool result message
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
      } 
      // c. No tool calls -> Final answer
      else {
        return {
          success: true,
          message: responseMessage.content
        };
      }
    }
    
    // f. Max steps reached without final text answer
    const partialMessage = lastPartialText
      || "I made progress on this task but couldn't finish within the step limit. Could you narrow the request or ask me to continue?";
    
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
      message: "An unexpected error occurred while processing your task. Please try again.",
      technicalError: error.message
    };
  }
}
