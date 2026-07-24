/* ============================================
   TOOLSHUB EXCLUSIVE — SYNTHESIZER
   Takes N raw model responses and streams a final
   merged answer to the user.
   ============================================ */

import { aiApi } from '../../services/aiApi.js';

export const Synthesizer = (() => {

  async function* synthesizeStream(originalMessages, rawResponses) {
    // If only one response came back (or fan-out failed), just yield it as is
    if (rawResponses.length === 1) {
      // Simulate streaming it back
      const chars = rawResponses[0].split('');
      for (const c of chars) {
        yield c;
        await new Promise(r => setTimeout(r, 2));
      }
      return;
    }

    // Build the synthesis prompt
    let contextStr = rawResponses.map((r, i) => `--- Model ${i+1} ---\n${r}\n`).join('\n');
    
    const synthesisPrompt = `
      You are the Master Synthesizer.
      The user asked a question. We consulted multiple top-tier AI models.
      Below are their independent answers.
      
      Your task: Combine their strongest insights into a single, cohesive, definitive answer.
      - Do not mention "Model 1 says" or "Model 2 says".
      - Present a unified, direct response to the user.
      - Adopt a highly professional, expert tone.

      ${contextStr}
    `;

    const messages = [
      ...originalMessages,
      { role: 'system', content: synthesisPrompt }
    ];

    // Stream the synthesis pass
    yield* aiApi.chatStream(messages);
  }

  return { synthesizeStream };
})();
