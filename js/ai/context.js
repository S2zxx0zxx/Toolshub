import { PromptManager } from './prompt.js';
import { Auth } from '../services/auth.js';

export const ContextManager = (() => {
  
  const MAX_HISTORY_MESSAGES = 20;

  /**
   * Build the AI context window.
   * Combine System Prompt + Tool Results + Chat History
   */
  function buildContext(messages, toolResults = []) {
    const context = [];
    
    // 1. System Prompt
    context.push({ role: 'system', content: PromptManager.getSystemPrompt() });

    // 2. User Context (Profile)
    const user = Auth.getCurrentUser();
    if (user) {
      const userMeta = `User Info:\nName: ${user.displayName || 'Unknown'}\nEmail: ${user.email}`;
      context.push({ role: 'system', content: userMeta });
    }

    // 2b. Time Context — lets the assistant naturally reflect time-of-day
    const now = new Date();
    const hour = now.getHours();
    let timeOfDay = 'night';
    if (hour >= 5 && hour < 12) timeOfDay = 'morning';
    else if (hour >= 12 && hour < 17) timeOfDay = 'afternoon';
    else if (hour >= 17 && hour < 21) timeOfDay = 'evening';
    context.push({
      role: 'system',
      content: `Time Context:\nCurrent time: ${now.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}\nTime of day: ${timeOfDay}`
    });

    // 3. Conversation History (Pruned)
    // Filter out error messages from context to avoid AI confusion, limit to MAX
    let history = messages.filter(m => !m.isError);
    if (history.length > MAX_HISTORY_MESSAGES) {
      history = history.slice(-MAX_HISTORY_MESSAGES);
    }
    
    history.forEach(m => {
      // Map to standard Groq roles (user, assistant, tool)
      context.push({
        role: m.role,
        content: m.text || m.content || ''
      });
    });

    // 4. Pending Tool Results (if we are in a multi-step execution)
    if (toolResults && toolResults.length > 0) {
      toolResults.forEach(res => {
        context.push({
          role: 'system',
          content: `[TOOL RESULT: ${res.toolId}]\nSuccess: ${res.success}\nData: ${JSON.stringify(res.data)}\nError: ${res.error || 'None'}`
        });
      });
    }

    return context;
  }

  return {
    buildContext
  };
})();