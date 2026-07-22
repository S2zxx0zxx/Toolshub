/* ============================================
   TOOLSHUB EXCLUSIVE — DECISION ENGINE
   Decides if a message requires Master Tool fan-out
   or if a single model is sufficient.
   Mirrors the Lite intent.js pattern.
   ============================================ */

import { aiApi } from '../../services/aiApi.js';

export const ModelDecisionEngine = (() => {

  function isSimpleFactual(text) {
    const clean = text.trim().toLowerCase();
    // Short greetings or utility asks
    if (clean.split(/\s+/).length < 8) {
      if (/^(hi|hello|hey|thanks|bye|ok)/.test(clean)) return true;
      if (/^(what is|who is|where is|when did)/.test(clean)) return true;
    }
    return false;
  }

  async function shouldFanOut(text, context) {
    // 1. Rule-based fast check
    if (isSimpleFactual(text)) {
      return false; // Fast path: don't fan out for simple queries
    }
    
    if (text.trim().split(/\s+/).length > 100) {
      return true; // Large prompts naturally benefit from fan-out
    }

    // 2. AI Fallback check
    const prompt = `
      You are an orchestration router.
      Does the user's request require deep reasoning, creative exploration, complex synthesis, or multiple perspectives?
      Respond with ONLY valid JSON: {"requires_fanout": true/false}
    `;

    const aiContext = [
      { role: 'system', content: prompt },
      { role: 'user', content: text }
    ];

    try {
      const response = await Promise.race([
        aiApi.chatCompletionJson(aiContext),
        new Promise((_, reject) => setTimeout(() => reject(new Error('Timeout')), 3000))
      ]);
      if (response && typeof response.requires_fanout === 'boolean') {
        return response.requires_fanout;
      }
    } catch (e) {
      console.warn('Decision engine timeout/fail, defaulting to fanout');
    }
    
    // Default to true for Exclusive users to guarantee premium experience
    return true;
  }

  return { shouldFanOut };
})();
