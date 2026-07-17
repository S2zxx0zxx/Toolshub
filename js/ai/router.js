import { ContextManager } from './context.js';
import { IntentEngine } from './intent.js';
import { ToolExecutor } from '../tools/executor.js';
import { aiApi } from '../services/aiApi.js';
import { CloudDB } from '../services/cloudDb.js';

export const AIRouter = (() => {

  /**
   * Main entry point for the AI engine.
   * Process user input, route through tools if needed, and generate final response.
   * 
   * @param {string} text User input
   * @param {Array} chatHistory Previous chat messages array
   * @param {Function} onToolStart Callback to update UI when a tool is executing
   * @returns {AsyncGenerator} The final text stream generator
   */
  async function* processInput(text, chatHistory, onToolStart) {
    
    // 1. Build Base Context
    let context = ContextManager.buildContext(chatHistory);

    // 2. Detect Intent
    const intentData = await IntentEngine.detectIntent(text, context);
    
    let toolResults = [];

    // 3. Tool Routing & Execution
    if (intentData && intentData.requiresTool && intentData.tool) {
      if (onToolStart) onToolStart(intentData.tool);
      
      const result = await ToolExecutor.execute(intentData.tool, intentData.parameters || {});
      toolResults.push(result);

      // Async log tool execution to Firebase
      CloudDB.logToolExecution(result.metadata).catch(console.error);
    }

    // 4. Re-build context with tool results
    context = ContextManager.buildContext(chatHistory, toolResults);
    
    // Append the current user text as the final message
    context.push({ role: 'user', content: text });

    // 5. Generate Final Response Stream via Groq
    yield* aiApi.chatStream(context);
  }

  return {
    processInput
  };
})();
