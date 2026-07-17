export const aiApi = (() => {
  const API_ENDPOINT = 'https://api.groq.com/openai/v1/chat/completions';
  const DEFAULT_MODEL = 'llama-3.3-70b-versatile';

  async function* mockStreamResponse(messages) {
    const text = "This is a simulated AI response from the mock API layer. To enable real AI responses, set your Groq API key in the browser console using `localStorage.setItem('GROQ_API_KEY', 'your_key')`.";
    const chunks = text.split(' ');
    
    // Simulate initial network latency
    await new Promise(r => setTimeout(r, 600));

    for (const chunk of chunks) {
      await new Promise(r => setTimeout(r, 40)); // typing delay
      yield chunk + ' ';
    }
  }

  async function* fetchGroqStream(messages, apiKey) {
    const payload = {
      model: DEFAULT_MODEL,
      messages: messages,
      temperature: 0.7,
      stream: true
    };
    
    let response;
    try {
      response = await fetch(API_ENDPOINT, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`
        },
        body: JSON.stringify(payload)
      });
    } catch (e) {
      throw new Error("Network failure. AI service temporarily unavailable.");
    }

    if (!response.ok) {
      if (response.status === 401) throw new Error("Invalid API Key.");
      if (response.status === 429) throw new Error("Rate limit exceeded. Please try again later.");
      throw new Error("AI service temporarily unavailable.");
    }

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
            const delta = data.choices[0]?.delta?.content;
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

  function getApiKey() {
    return localStorage.getItem('GROQ_API_KEY') || null;
  }

  async function* chatStream(messages) {
    const apiKey = getApiKey();
    if (apiKey) {
      yield* fetchGroqStream(messages, apiKey);
    } else {
      yield* mockStreamResponse(messages);
    }
  }

  async function chatCompletionJson(messages) {
    const apiKey = getApiKey();
    if (!apiKey) return null; // cannot do AI classification without real API
    
    const payload = {
      model: DEFAULT_MODEL,
      messages: messages,
      temperature: 0.1,
      response_format: { type: "json_object" }
    };
    
    try {
      const response = await fetch(API_ENDPOINT, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`
        },
        body: JSON.stringify(payload)
      });
      if (!response.ok) return null;
      const data = await response.json();
      return JSON.parse(data.choices[0].message.content);
    } catch (e) {
      console.error("AI JSON completion failed:", e);
      return null;
    }
  }

  return {
    chatStream,
    chatCompletionJson
  };
})();
