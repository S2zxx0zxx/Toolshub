import { PromptManager } from './prompt.js';
import { Auth } from '../services/auth.js';

export const ContextManager = (() => {
  
  const MAX_HISTORY_MESSAGES = 40;

  function buildContext(messages, toolResults = []) {
    const context = [];
    
    // 1. System Prompt
    context.push({ role: 'system', content: PromptManager.getSystemPrompt() });

    // 2. User Context
    const user = Auth.getCurrentUser();
    if (user) {
      const userMeta = `User Info:\nName: ${user.displayName || 'Unknown'}\nEmail: ${user.email}`;
      context.push({ role: 'system', content: userMeta });
    }

    // 2b. Time Context
    const now = new Date();
    const hour = now.getHours();
    let timeOfDay = 'night';
    if (hour >= 5 && hour < 12) timeOfDay = 'morning';
    else if (hour >= 12 && hour < 17) timeOfDay = 'afternoon';
    else if (hour >= 17 && hour < 21) timeOfDay = 'evening';
    context.push({
      role: 'system',
      content: `[Background reference — do not mention unless relevant]\nCurrent time: ${now.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })} (${timeOfDay}).`
    });

    // 3. Conversation History (Pruned)
    let history = messages.filter(m => !m.isError);
    if (history.length > MAX_HISTORY_MESSAGES) {
      context.push({ role: 'system', content: '[Earlier context truncated. Maintain established persona/context.]' });
      history = history.slice(-MAX_HISTORY_MESSAGES);
    }
    
    history.forEach(m => {
      context.push({
        role: m.role,
        content: m.text || m.content || ''
      });
    });

    // 3b. Session-memory nudge
    if (history.length > 0) {
      context.push({
        role: 'system',
        content: `[Memory] If the user corrected you earlier, keep applying that correction.`
      });
    }

    // 4. Pending Tool Results
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

  return { buildContext };
})();
