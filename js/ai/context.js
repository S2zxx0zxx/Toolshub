import { PromptManager } from './prompt.js';
import { Auth } from '../services/auth.js';

export const ContextManager = (() => {
  
  const MAX_HISTORY_MESSAGES = 100;

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

    // 2b. Time Context
    const now = new Date();
    const hour = now.getHours();
    let timeOfDay = 'night';
    if (hour >= 5 && hour < 12) timeOfDay = 'morning';
    else if (hour >= 12 && hour < 17) timeOfDay = 'afternoon';
    else if (hour >= 17 && hour < 21) timeOfDay = 'evening';
    
    const dateStr = now.toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
    const timeStr = now.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });
    
    context.push({
      role: 'system',
      content: `[Background reference — do not mention unless relevant]\nCurrent date: ${dateStr}, time: ${timeStr} (${timeOfDay}).`
    });

    // 3. Conversation History with Smart Summarization
    let history = messages.filter(m => !m.isError);
    
    if (history.length > MAX_HISTORY_MESSAGES) {
      // Smart summarization: keep first 10 messages as context, summarize middle, keep last 50
      const firstMessages = history.slice(0, 10);
      const middleMessages = history.slice(10, -50);
      const recentMessages = history.slice(-50);
      
      // Create a summary of middle messages
      const summaryParts = [];
      for (const msg of middleMessages) {
        if (msg.role === 'user') {
          const text = (msg.text || msg.content || '').substring(0, 100);
          if (text) summaryParts.push(`User asked about: ${text}...`);
        } else if (msg.role === 'assistant') {
          const text = (msg.text || msg.content || '').substring(0, 100);
          if (text) summaryParts.push(`AI responded about: ${text}...`);
        }
      }
      
      const summary = summaryParts.length > 0 
        ? `[Conversation Summary - ${middleMessages.length} earlier messages]\n${summaryParts.slice(-20).join('\n')}`
        : '[Earlier context truncated]';
      
      context.push({ role: 'system', content: summary });
      
      // Add first messages for initial context
      firstMessages.forEach(m => {
        context.push({
          role: m.role,
          content: m.text || m.content || ''
        });
      });
      
      // Add recent messages
      recentMessages.forEach(m => {
        context.push({
          role: m.role,
          content: m.text || m.content || ''
        });
      });
    } else {
      history.forEach(m => {
        context.push({
          role: m.role,
          content: m.text || m.content || ''
        });
      });
    }

    // 3b. Session-memory nudge
    if (history.length > 0) {
      context.push({
        role: 'system',
        content: `[Memory] If the user corrected you earlier, keep applying that correction. Stay consistent with previous responses in this conversation.`
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
