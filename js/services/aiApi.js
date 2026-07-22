import { LocalSettings } from './localSettings.js';
import { Auth } from './auth.js';
import { API_ENDPOINT } from '../config/api.js';

export const aiApi = (() => {

  // Valid Groq model IDs — must match Groq API exactly
  const CHAT_MODEL = 'llama-3.3-70b-versatile';         // Best for general chat
  const INTENT_MODEL = 'llama-3.1-8b-instant';          // Fast categorization

  // Check if Developer Mode key is set
  function getLocalKey() {
    return localStorage.getItem('GROQ_API_KEY');
  }

  async function getAuthHeader() {
    const user = Auth.getCurrentUser();
    if (!user) return {};
    try {
      const token = await user.getIdToken();
      return { 'Authorization': `Bearer ${token}` };
    } catch (e) {
      console.warn('Failed to get ID token:', e);
      return {};
    }
  }

  async function pingBackend() {
    if (getLocalKey()) {
      window.dispatchEvent(new CustomEvent('backend-status', { detail: 'connected' }));
      return true;
    }
    try {
      // Just a lightweight check
      const res = await fetch(API_ENDPOINT, { method: 'OPTIONS' });
      if (res.ok || res.status === 405 || res.status === 400) {
        window.dispatchEvent(new CustomEvent('backend-status', { detail: 'connected' }));
        return true;
      }
    } catch(e) {
      window.dispatchEvent(new CustomEvent('backend-status', { detail: 'disconnected' }));
      return false;
    }
  }

  // Initialize ping on load
  setTimeout(pingBackend, 1000);

  async function* fetchGroqStream(messages) {
    const payload = {
      model: LocalSettings.getSelectedChatModel() || CHAT_MODEL,
      messages: messages,
      temperature: 0.7,
      stream: true
    };
    
    let response;
    const localKey = getLocalKey();
    
    try {
      if (localKey) {
        console.warn("Direct API key usage is deprecated for security. Routing request via Cloudflare Worker.");
      }
      const authHeader = await getAuthHeader();
      response = await fetch(API_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...authHeader },
        body: JSON.stringify(payload)
      });
    } catch (e) {
      window.dispatchEvent(new CustomEvent('backend-status', { detail: 'disconnected' }));
      throw new Error("Network failure. Backend API temporarily unavailable.");
    }

    if (!response.ok) {
      window.dispatchEvent(new CustomEvent('backend-status', { detail: 'disconnected' }));
      
      const errorText = await response.text();
      
      // NEW: Detect 429 rate-limit error and dispatch exhaustion event
      if (response.status === 429 || (errorText && errorText.toLowerCase().includes('rate_limit'))) {
        const currentModel = LocalSettings.getSelectedChatModel() || 'llama-3.3-70b-versatile';
        window.dispatchEvent(new CustomEvent('model-exhausted', { 
          detail: { modelId: currentModel, timestamp: Date.now() } 
        }));
      }
      
      console.error(`Backend Error (${response.status}): ${errorText}`);
      throw new Error("This feature is still warming up — please try again in a moment, or try a different tool.");
    }
    
    // Connected successfully
    window.dispatchEvent(new CustomEvent('backend-status', { detail: 'connected' }));

    const reader = response.body.getReader();
    const decoder = new TextDecoder('utf-8');
    let buffer = '';

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      
      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split('\n');
      buffer = lines.pop(); // Keep the last incomplete line in buffer
      
      for (const line of lines) {
        const trimmed = line.trim();
        if (!trimmed || trimmed === 'data: [DONE]') continue;
        if (trimmed.startsWith('data: ')) {
          try {
            const data = JSON.parse(trimmed.slice(6));
            const delta = data.choices && data.choices[0]?.delta?.content;
            if (delta) {
              yield delta;
            }
          } catch (e) {
            console.warn("Parse error in stream line:", trimmed, e);
          }
        }
      }
    }
  }

  async function* chatStream(messages) {
    yield* fetchGroqStream(messages);
  }

  async function chatCompletionJson(messages) {
    const payload = {
      model: INTENT_MODEL, // Use fast model for intent classification
      mode: 'classify',    // Instructs worker to skip Orchestrator routing for this internal call
      messages: messages,
      temperature: 0.1,
      response_format: { type: "json_object" }
    };
    
    let response;
    const localKey = getLocalKey();
    
    try {
      if (localKey) {
        console.warn("Direct API key usage is deprecated for security. Routing request via Cloudflare Worker.");
      }
      const authHeader = await getAuthHeader();
      response = await fetch(API_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...authHeader },
        body: JSON.stringify(payload)
      });
      
      if (!response.ok) {
        window.dispatchEvent(new CustomEvent('backend-status', { detail: 'disconnected' }));
        return null;
      }
      
      window.dispatchEvent(new CustomEvent('backend-status', { detail: 'connected' }));
      const data = await response.json();
      return JSON.parse(data.choices[0].message.content);
    } catch (e) {
      window.dispatchEvent(new CustomEvent('backend-status', { detail: 'disconnected' }));
      console.error("AI JSON completion failed:", e);
      return null;
    }
  }

  async function chatAgentRound(messages, tools) {
    const payload = {
      mode: 'agent',
      model: LocalSettings.getSelectedChatModel() || CHAT_MODEL,
      messages: messages,
      tools: tools,
      temperature: 0.7,
      stream: false
    };
    
    let response;
    const localKey = getLocalKey();
    
    try {
      if (localKey) {
        console.warn("Direct API key usage is deprecated for security. Routing request via Cloudflare Worker.");
      }
      const authHeader = await getAuthHeader();
      response = await fetch(API_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...authHeader },
        body: JSON.stringify(payload)
      });
      
      if (!response.ok) {
        window.dispatchEvent(new CustomEvent('backend-status', { detail: 'disconnected' }));
        const errorText = await response.text();
        throw new Error(`Agent request failed (${response.status}): ${errorText}`);
      }
      
      window.dispatchEvent(new CustomEvent('backend-status', { detail: 'connected' }));
      const data = await response.json();
      return data;
    } catch (e) {
      window.dispatchEvent(new CustomEvent('backend-status', { detail: 'disconnected' }));
      console.error("Agent round failed:", e);
      throw e;
    }
  }

  return {
    chatStream,
    chatCompletionJson,
    chatAgentRound,
    pingBackend
  };
})();
