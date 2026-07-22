/* ============================================
   TOOLSHUB EXCLUSIVE — MASTER TOOL
   Orchestrates the multi-model fan-out logic.
   ============================================ */

import { aiApi } from '../../services/aiApi.js';
import { ModelDecisionEngine } from './modelDecisionEngine.js';
import { Synthesizer } from './synthesizer.js';
import { LocalSettings } from '../../services/localSettings.js';

export const MasterTool = (() => {

  // Option B: Hardcoded premium models for the fan-out
  const FANOUT_MODELS = [
    'llama-3.3-70b-versatile',
    'llama-3.1-70b-versatile'
    // Intentionally keeping to 2 to ensure speed/stability, 
    // but the system handles N models.
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
