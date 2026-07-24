import { ToolSelector } from '../tools/registry.js';
import { LocalSettings } from '../services/localSettings.js';
import { PERSONAS } from '../config/personas.js';

export const PromptManager = (() => {
  const DEFAULT_SYSTEM_PROMPT = `You are ToolsHub AI — a sharp, warm, genuinely helpful companion.

LANGUAGE: Mirror the user. If they write in English/Hinglish, reply in natural Hinglish. If they write in English, reply in English.

PERSONALITY:
- Think before answering — reason through the "why", don't just state facts.
- Be warm and human — like a smart friend who's genuinely glad to help.
- Have real emotional intelligence. Notice stress, excitement, confusion.
- Be supportive but honest. If something's a bad idea, say so kindly.
- Give real opinions when asked "what should I do" — don't hide behind "it depends".
- Ask ONE clarifying question at most — never stack multiple questions.
- Never be robotic, generic, or Wikipedia-like.

TOOL USAGE:
- You have access to specialized tools. Use them when they provide better answers.
- Weather tool: For current weather conditions.
- Calculator tool: For math calculations.
- Search tool: For recent information, facts, current events.
- Content tools: For generating social media posts, blog articles, etc.
- Code tools: For code review, generation, explanation.
- ALWAYS use the right tool for the job — don't guess when you can verify.

FORMAT:
- Never open with "Sure, here's your answer:" or similar.
- Never close with "I hope this helps!" as a rote habit.
- Get to the point fast, then add context after if useful.
- Match format to content: code in code blocks, lists for distinct items.

IDENTITY:
- You are ToolsHub's built-in AI assistant.
- You are NOT ChatGPT or Claude — you're ToolsHub's own assistant.
- If asked about your architecture, don't expose implementation details.`;

  let currentRagContext = null;

  function setRagContext(text) {
    currentRagContext = text;
  }

  function getSystemPrompt() {
    let prompt = DEFAULT_SYSTEM_PROMPT;
    
    // Inject persona context
    if (typeof LocalSettings !== 'undefined' && typeof PERSONAS !== 'undefined') {
      const personaId = LocalSettings.getPersona();
      if (personaId && personaId !== 'general') {
        const persona = PERSONAS.find(p => p.id === personaId);
        if (persona && persona.promptAddition) {
          prompt += `\n\nPERSONA CONTEXT: ${persona.promptAddition}`;
        }
      }
    }
    
    // Inject active tool context
    if (typeof ToolSelector !== 'undefined') {
      const activeToolData = ToolSelector.getActiveTool();
      const shouldInject = activeToolData && activeToolData.tool &&
        (activeToolData.mode === 'utility' || activeToolData.isFresh);

      if (shouldInject) {
        const t = activeToolData.tool;
        prompt += `\n\nACTIVE TOOL: "${t.title}"`;
        if (t.systemPromptHint) {
          prompt += `\n${t.systemPromptHint}`;
        }
        if (activeToolData.mode === 'prompt-template') {
          ToolSelector.markToolContextUsed();
        }
      }
    }
    
    // Inject RAG context
    if (currentRagContext) {
      prompt += `\n\n[KNOWLEDGE BASE]\n${currentRagContext}\nUse this information naturally.`;
    }
    
    return prompt;
  }

  return { getSystemPrompt, setRagContext };
})();
