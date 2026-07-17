import { aiApi } from '../services/aiApi.js';
import { PromptManager } from './prompt.js';

export const IntentEngine = (() => {
  
  // 1. Rule-Based Fallbacks for fast routing without AI API calls
  const rules = [
    {
      id: 'calculator_rule',
      tool: 'calculator',
      test: (text) => {
        // Arithmetic expressions: numbers and operators only
        const clean = text.trim();
        const isMath = /^[0-9]+(\s*[\+\-\*\/]\s*[0-9]+)+$/.test(clean);
        if (isMath) return { expression: clean };
        return null;
      }
    },
    {
      id: 'weather_rule',
      tool: 'weather',
      test: (text) => {
        // "weather in X", "what's the weather in X", "weather X"
        const m = text.trim().match(/\bweather\b(?:\s+in)?\s+([a-zA-Z\s]{2,30})\s*\??$/i);
        if (m) return { city: m[1].trim() };
        return null;
      }
    },
    {
      id: 'search_rule',
      tool: 'search',
      test: (text) => {
        // "search for X", "google X", "look up X", "search X"
        const m = text.trim().match(/^(?:search(?:\s+for)?|google|look\s+up)\s+(.+)$/i);
        if (m) return { query: m[1].trim() };
        return null;
      }
    },
    {
      id: 'general_chat_rule',
      tool: null,
      test: (text) => {
        // Pure conversational / greeting — safely skip AI classification
        const clean = text.trim().toLowerCase();
        const greetings = /^(hi|hello|hey|howdy|greetings|good\s+(morning|afternoon|evening|night)|what'?s\s+up|how\s+are\s+you|thanks?|thank\s+you|ok|okay|yes|no|sure|bye|goodbye|see\s+you)[\s!?.]*$/;
        if (greetings.test(clean)) {
          return '__general_chat__';
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
        // Special sentinel for "definitely general chat, no tool needed"
        if (match === '__general_chat__') {
          return {
            intent: 'general_chat',
            requiresTool: false,
            tool: null,
            confidence: 1.0,
            parameters: {},
            isRuleBased: true
          };
        }
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
