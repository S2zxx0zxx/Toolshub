import { PromptManager } from './prompt.js';
import { Auth } from '../services/auth.js';

export const ContextManager = (() => {
  
  const MAX_HISTORY_MESSAGES = 40;

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

    // 2b. Time Context — background info only, NOT something to mention by default.
    // Framed as a reference fact, not an instruction, to stop the model from
    // greeting/commenting on time-of-day in every single reply.
    const now = new Date();
    const hour = now.getHours();
    let timeOfDay = 'night';
    if (hour >= 5 && hour < 12) timeOfDay = 'morning';
    else if (hour >= 12 && hour < 17) timeOfDay = 'afternoon';
    else if (hour >= 17 && hour < 21) timeOfDay = 'evening';
    context.push({
      role: 'system',
      content: `[Background reference — do not mention unless directly relevant]\nCurrent time: ${now.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })} (${timeOfDay}). Only bring this up if the user asks about time/date, or if their message has a greeting that clearly mismatches the time (e.g. "good morning" at 11 PM). Do not reference the time of day in ordinary replies.`
    });

    // 3. Conversation History (Pruned)
    // Filter out error messages from context to avoid AI confusion, limit to MAX
    let history = messages.filter(m => !m.isError);
    if (history.length > MAX_HISTORY_MESSAGES) {
      // TODO: Proper rolling-summarization should replace this hard cutoff in a future pass
      // so we don't lose context from the dropped messages abruptly.
      context.push({ role: 'system', content: '[Earlier context truncated: older messages were dropped. Maintain the established persona/context.]' });
      history = history.slice(-MAX_HISTORY_MESSAGES);
    }
    
    history.forEach(m => {
      // Map to standard Groq roles (user, assistant, tool)
      context.push({
        role: m.role,
        content: m.text || m.content || ''
      });
    });

    // 3b. Session-memory nudge — reinforces carrying forward any correction the
    // user already made earlier in this conversation (fact, preference, naming,
    // etc.), so the same mistake doesn't repeat later in the same session.
    if (history.length > 0) {
      context.push({
        role: 'system',
        content: `[Reminder] If the user corrected you on anything earlier in this conversation above (a fact, a preference, a name, a convention), keep applying that correction — don't repeat the original mistake later in this session.`
      });
    }

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