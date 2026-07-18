export const aiApi = (() => {
  // Always route to live Cloudflare Worker
  const API_ENDPOINT = 'https://toolshub-worker.theliquidlounge-co.workers.dev?v=2';

  // Valid Groq model IDs — must match Groq API exactly
  const CHAT_MODEL = 'llama-3.1-70b-versatile';         // Best for general chat (Groq Compound)
  const INTENT_MODEL = 'llama-3.1-8b-instant'; // Fast, cheap for intent classification

  // Check if Developer Mode key is set
  function getLocalKey() {
    return localStorage.getItem('GROQ_API_KEY');
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
      model: CHAT_MODEL,
      messages: messages,
      temperature: 0.7,
      stream: true
    };
    
    let response;
    const localKey = getLocalKey();
    
    try {
      if (localKey) {
        response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
          method: 'POST',
          headers: { 
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localKey}`
          },
          body: JSON.stringify(payload)
        });
      } else {
        response = await fetch(API_ENDPOINT, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
      }
    } catch (e) {
      window.dispatchEvent(new CustomEvent('backend-status', { detail: 'disconnected' }));
      throw new Error("Network failure. Backend API temporarily unavailable.");
    }

    if (!response.ok) {
      window.dispatchEvent(new CustomEvent('backend-status', { detail: 'disconnected' }));
      const errorText = await response.text();
      throw new Error(`Backend Error (${response.status}): ${errorText}`);
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
      messages: messages,
      temperature: 0.1,
      response_format: { type: "json_object" }
    };
    
    let response;
    const localKey = getLocalKey();
    
    try {
      if (localKey) {
        response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
          method: 'POST',
          headers: { 
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localKey}`
          },
          body: JSON.stringify(payload)
        });
      } else {
        response = await fetch(API_ENDPOINT, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
      }
      
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

  return {
    chatStream,
    chatCompletionJson,
    pingBackend
  };
})();
