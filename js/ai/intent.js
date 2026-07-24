import { aiApi } from '../services/aiApi.js';
import { PromptManager } from './prompt.js';

export const IntentEngine = (() => {
  
  // Fast rule-based detection
  const rules = [
    {
      id: 'calculator_rule',
      tool: 'calculator',
      test: (text) => {
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
        const m = text.trim().match(/\bweather\b(?:\s+in)?\s+([a-zA-Z\s]{2,30})\s*\??$/i);
        if (m) return { city: m[1].trim() };
        return null;
      }
    },
    {
      id: 'search_rule',
      tool: 'search',
      test: (text) => {
        const m = text.trim().match(/^(?:search(?:\s+for)?|google|look\s+up)\s+(.+)$/i);
        if (m) return { query: m[1].trim() };
        return null;
      }
    },
    {
      id: 'general_chat_rule',
      tool: null,
      test: (text) => {
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

    // Phase 2: AI Classification (only for ambiguous queries)
    const intentPrompt = `Classify this user message. Return JSON only:
{
  "intent": "general_chat" or tool name,
  "requiresTool": true/false,
  "tool": tool name or null,
  "confidence": 0-1
}
Tools: calculator, weather, search, generate_website, github_list_files, github_read_file`;

    const aiContext = [
      { role: 'system', content: intentPrompt },
      { role: 'user', content: text }
    ];

    try {
      const response = await Promise.race([
        aiApi.chatCompletionJson(aiContext),
        new Promise((_, reject) => setTimeout(() => reject(new Error('Intent timeout')), 3000))
      ]);
      if (response && response.intent) {
        return response;
      }
    } catch (e) {
      console.warn('Intent parsing failed:', e);
    }

    // Default to general chat
    return {
      intent: 'general_chat',
      requiresTool: false,
      tool: null,
      confidence: 0.0,
      parameters: {}
    };
  }

  return { detectIntent };
})();
