import { LocalSettings } from '../services/localSettings.js';
import { PromptManager } from './prompt.js';
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
`;

const MAX_STEPS_DEFAULT = 8;
const MAX_STEPS_MAX_TIER = 12;

export async function executeAgentTask(userMessage, conversationHistory, options = {}) {
  try {
    // 1. Determine tier and model
    const currentPlanId = LocalSettings.getCurrentPlan ? LocalSettings.getCurrentPlan() : 'free';
    const activePlan = PLANS.find(p => p.id === currentPlanId) || PLANS[0];
    
    if (activePlan.id === 'free') {
      return { 
        success: false, 
        error: 'agent-locked', 
        message: 'Agent Mode requires Starter plan or higher.' 
      };
    }

    // 2. Set maxSteps using named constants and plan label
    const maxSteps = (activePlan.label === 'Max') ? MAX_STEPS_MAX_TIER : MAX_STEPS_DEFAULT;
    
    // 3. Build initial messages array
    const baseSystemPrompt = PromptManager.getSystemPrompt();
    const fullSystemPrompt = baseSystemPrompt + AGENT_INSTRUCTIONS;
    
    const messages = [
      { role: "system", content: fullSystemPrompt },
      ...(conversationHistory || []),
      { role: "user", content: userMessage }
    ];

    const schemas = getAllToolSchemas();
    
    let step = 0;
    
    // 4. Loop
    while (step < maxSteps) {
      step++;
      
      // a. Call worker in agent mode
      const response = await aiApi.chatAgentRound(messages, schemas);
      
      const responseMessage = response.choices && response.choices[0] && response.choices[0].message;
      if (!responseMessage) {
        throw new Error("Invalid response format from AI provider.");
      }

      // b. If tool calls exist
      if (responseMessage.tool_calls && responseMessage.tool_calls.length > 0) {
        // Append the assistant's tool call message exactly as returned
        messages.push(responseMessage);
        
        // Process each tool call
        for (const toolCall of responseMessage.tool_calls) {
          const toolId = toolCall.function.name;
          let parsedParams = {};
          try {
            parsedParams = JSON.parse(toolCall.function.arguments || '{}');
          } catch (e) {
            console.warn(`Failed to parse arguments for tool ${toolId}`);
          }
          
          let toolResponseText = "";
          
          // Call the tool bridge
          const toolResult = await executeAgentTool(toolId, parsedParams);
          
          if (!toolResult.success) {
            toolResponseText = `Error calling tool: ${toolResult.error}`;
          } else {
            // d. kind: "ui-trigger"
            if (toolResult.kind === 'ui-trigger') {
              toolResponseText = `The ${toolId} panel has been opened for the user.`;
            } 
            // e. kind: "content"
            else if (toolResult.kind === 'content') {
              try {
                // Secondary generation using the prompt hint
                const contentGenResponse = await aiApi.chatAgentRound([
                  { role: "system", content: toolResult.result.systemPromptHint },
                  { role: "user", content: toolResult.result.userInput }
                ], undefined); // no tools
                
                toolResponseText = contentGenResponse.choices[0].message.content;
              } catch (err) {
                toolResponseText = `Content generation failed: ${err.message}`;
              }
            } 
            // kind: "data"
            else {
              toolResponseText = JSON.stringify(toolResult.result);
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
              status: 'complete',
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
    let partialMessage = "Task incomplete after maximum steps reached.";
    // Try to find the last assistant message that had some text content
    for (let i = messages.length - 1; i >= 0; i--) {
      if (messages[i].role === 'assistant' && messages[i].content) {
        partialMessage = messages[i].content;
        break;
      }
    }
    
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
