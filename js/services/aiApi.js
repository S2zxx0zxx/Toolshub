export const aiApi = (() => {
  const isLocal = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
  const API_ENDPOINT = isLocal 
    ? 'http://127.0.0.1:5001/toolshub-87859/us-central1/chatCompletion' 
    : 'https://us-central1-toolshub-87859.cloudfunctions.net/chatCompletion';

  // Valid Groq model IDs — must match Groq API exactly
  const CHAT_MODEL = 'compound-beta';         // Best for general chat (Groq Compound)
  const INTENT_MODEL = 'llama-3.1-8b-instant'; // Fast, cheap for intent classification

  async function* fetchGroqStream(messages) {
    const payload = {
      model: CHAT_MODEL,
      messages: messages,
      temperature: 0.7,
      stream: true
    };
    
    let response;
    try {
      response = await fetch(API_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
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
    
    try {
      const response = await fetch(API_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
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

  return {
    chatStream,
    chatCompletionJson
  };
})();
