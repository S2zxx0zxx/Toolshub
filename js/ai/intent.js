import { aiApi } from '../services/aiApi.js';
import { PromptManager } from './prompt.js';

export const IntentEngine = (() => {
  
  // 1. Rule-Based Fallbacks for fast routing without AI API calls
  const rules = [
    {
      id: 'calculator_rule',
      tool: 'calculator',
      test: (text) => {
        // Very basic test for math expressions: starts/ends with numbers and has operators
        const clean = text.trim();
        const isMath = /^[0-9]+(\s*[\+\-\*\/]\s*[0-9]+)+$/.test(clean);
        if (isMath) {
          return { expression: clean };
        }
        return null;
      }
    }
  ];

  async function detectIntent(text, context) {
    // Phase 1: Fast Rule-Based Detection
    for (const rule of rules) {
      const match = rule.test(text);
      if (match) {
        return {
          intent: rule.tool,
          requiresTool: true,
          tool: rule.tool,
          confidence: 1.0,
          parameters: match,
          isRuleBased: true
        };
      }
    }

    // Phase 2: AI Classification (Fallback)
    // We construct a specific prompt asking Groq to classify the intent as JSON.
    const intentPrompt = `
You are an Intent Classification engine.
Analyze the user's input and determine if they require a tool execution.
Available Tools:
- "weather": Fetch current weather for a city. Requires param: { "city": string }
- "search": Search the web for recent info. Requires param: { "query": string }
- "calculator": Perform math. Requires param: { "expression": string }

Output STRICTLY valid JSON only, no markdown formatting.
Format:
{
  "intent": "general_chat" | "weather" | "search" | "calculator",
  "requiresTool": boolean,
  "tool": string | null,
  "confidence": number (0.0 to 1.0),
  "parameters": {}
}
`;
    
    // We only send the last few messages plus the intent prompt to keep it fast and cheap
    const aiContext = [
      { role: 'system', content: intentPrompt },
      ...context.slice(-4), // keep last 4 context messages for reference
      { role: 'user', content: text }
    ];

    try {
      const response = await aiApi.chatCompletionJson(aiContext);
      if (response && response.intent) {
        return response;
      }
    } catch (e) {
      console.warn('Intent parsing failed, falling back to general chat:', e);
    }

    // Fallback if AI fails or returns weird output
    return {
      intent: 'general_chat',
      requiresTool: false,
      tool: null,
      confidence: 0.0,
      parameters: {}
    };
  }

  return {
    detectIntent
  };
})();
