/* ============================================
   TOOLSHUB EXCLUSIVE — MASTER TOOL
   Orchestrates the multi-model fan-out logic.
   ============================================ */

import { aiApi } from '../../services/aiApi.js';
import { ModelDecisionEngine } from './modelDecisionEngine.js';
import { Synthesizer } from './synthesizer.js';
import { LocalSettings } from '../../services/localSettings.js';

export const MasterTool = (() => {

  // Two genuinely distinct models for the fan-out.
  // IMPORTANT: Both IDs must survive the worker's model-normalization pass in index.js unchanged.
  // 'llama-3.1-70b-versatile' was previously the second model but the worker normalizes it to
  // 'llama-3.3-70b-versatile', making both calls identical. 'gpt-4o-mini' routes to GitHub Models
  // (a real second provider) and is tier '6month' — Exclusive users are 'yearly', so they qualify.
  const FANOUT_MODELS = [
    'llama-3.3-70b-versatile', // Groq
    'gpt-4o-mini'              // GitHub Models (via callProvider in modelFallback.js)
  ];

  let isEnabled = true;

  function setEnabled(enabled) {
    isEnabled = !!enabled;
  }

  function getEnabled() {
    return isEnabled;
  }

  // Non-streaming wrapper for the fan-out calls
  async function fetchFullCompletion(messages, modelId) {
    // Temporarily swap the selected model to trick aiApi, 
    // since aiApi reads from LocalSettings internally.
    const originalModel = LocalSettings.getSelectedChatModel();
    LocalSettings.setSelectedChatModel(modelId);
    
    let text = '';
    try {
      const stream = aiApi.chatStream(messages);
      for await (const chunk of stream) {
        text += chunk;
      }
    } catch (e) {
      console.warn(`Model ${modelId} failed during fan-out`, e);
    } finally {
      LocalSettings.setSelectedChatModel(originalModel);
    }
    
    return text;
  }

  async function* processStream(messages, callbacks = {}) {
    const { onFanOutStart, onFanOutEnd } = callbacks;
    const lastMsg = messages[messages.length - 1].content;

    // 1. If Master Tool is OFF, bypass completely
    if (!isEnabled) {
      yield* aiApi.chatStream(messages);
      return;
    }

    // 2. Decide if this message warrants fan-out
    const fanOut = await ModelDecisionEngine.shouldFanOut(lastMsg, messages);
    if (!fanOut) {
      yield* aiApi.chatStream(messages);
      return;
    }

    // 3. Trigger FUSING UI state
    if (onFanOutStart) onFanOutStart();

    // 4. Fire parallel calls
    const promises = FANOUT_MODELS.map(model => fetchFullCompletion(messages, model));
    const results = await Promise.allSettled(promises);
    
    const validResponses = results
      .filter(r => r.status === 'fulfilled' && r.value.trim().length > 0)
      .map(r => r.value);

    // 5. Synthesize
    if (validResponses.length === 0) {
      yield "I'm sorry, I encountered an error while consulting the models. Please try again.";
    } else {
      yield* Synthesizer.synthesizeStream(messages, validResponses);
    }

    // 6. End FUSING UI state
    if (onFanOutEnd) onFanOutEnd();
  }

  return { processStream, setEnabled, getEnabled };
})();
