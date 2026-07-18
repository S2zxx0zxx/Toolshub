const functions = require('firebase-functions');
const cors = require('cors')({ origin: true });

// Fallback pool of Groq API keys from environment variables
const GROQ_API_KEYS = (process.env.GROQ_API_KEYS || "").split(",").map(k => k.trim()).filter(k => k);

let currentKeyIndex = 0;

function getNextKey() {
  return GROQ_API_KEYS[currentKeyIndex];
}

function rotateKey() {
  currentKeyIndex = (currentKeyIndex + 1) % GROQ_API_KEYS.length;
  console.log("Rate limit hit: Switched to fallback API key, index:", currentKeyIndex);
}

exports.chatCompletion = functions.https.onRequest((req, res) => {
  cors(req, res, async () => {
    if (req.method !== 'POST') {
      return res.status(405).send('Method Not Allowed');
    }

    const { messages, model, temperature, stream, response_format } = req.body;
    if (!messages) {
      return res.status(400).send('Missing messages in request body');
    }

    const payload = {
      model: model || 'groq/compound',
      messages,
      temperature: temperature || 0.7,
      stream: !!stream
    };
    if (response_format) {
      payload.response_format = response_format;
    }

    let attempts = 0;
    while (attempts < GROQ_API_KEYS.length) {
      const apiKey = getNextKey();
      try {
        const groqResponse = await fetch('https://api.groq.com/openai/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${apiKey}`
          },
          body: JSON.stringify(payload)
        });

        if (!groqResponse.ok) {
          if (groqResponse.status === 429 && GROQ_API_KEYS.length > 1) {
            rotateKey();
            attempts++;
            continue; // Retry with next key
          }
          const errorText = await groqResponse.text();
          console.error(`Groq API Error (${groqResponse.status}):`, errorText);
          return res.status(groqResponse.status).send(errorText);
        }

        // Successfully authenticated and rate limit not hit
        if (stream) {
          res.setHeader('Content-Type', 'text/event-stream');
          res.setHeader('Cache-Control', 'no-cache');
          res.setHeader('Connection', 'keep-alive');
          
          if (groqResponse.body && groqResponse.body.getReader) {
             const reader = groqResponse.body.getReader();
             const decoder = new TextDecoder('utf-8');
             
             while(true) {
               const { done, value } = await reader.read();
               if (done) {
                 res.end();
                 break;
               }
               res.write(decoder.decode(value, { stream: true }));
             }
             return;
          } else {
             // Fallback
             const text = await groqResponse.text();
             return res.send(text);
          }
        } else {
          // JSON Response
          const data = await groqResponse.json();
          return res.json(data);
        }
      } catch (e) {
        console.error("Fetch error:", e);
        return res.status(500).send('Internal Server Error: ' + e.message);
      }
    }

    return res.status(429).send("All API keys rate limited. Please try again later.");
  });
});
