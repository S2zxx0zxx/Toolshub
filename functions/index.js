const { setGlobalOptions } = require("firebase-functions/v2");
const { onRequest } = require("firebase-functions/v2/https");
const { defineSecret } = require('firebase-functions/params');

const allowedOrigins = [
  'http://localhost:5000',
  'http://127.0.0.1:5500',
  'http://localhost:5500',
  'https://toolshub-87859.web.app',
  'https://toolshub-87859.firebaseapp.com',
  'https://s2zxx0zxx.github.io'
];

// Set global options, such as region and max instances
setGlobalOptions({ 
  region: 'us-central1',
  maxInstances: 10
});

// Define the secret using Google Cloud Secret Manager
const groqApiKey = defineSecret('GROQ_API_KEY');

// In-memory rate limiting map
// This is isolated per instance, but sufficient for simple abuse protection
const ipRateLimits = new Map();
const RATE_LIMIT_WINDOW_MS = 60000; // 1 minute
const MAX_REQUESTS_PER_WINDOW = 30; // 30 requests per minute

function checkRateLimit(ip) {
  const now = Date.now();
  if (!ipRateLimits.has(ip)) {
    ipRateLimits.set(ip, { count: 1, resetTime: now + RATE_LIMIT_WINDOW_MS });
    return true;
  }
  const record = ipRateLimits.get(ip);
  if (now > record.resetTime) {
    ipRateLimits.set(ip, { count: 1, resetTime: now + RATE_LIMIT_WINDOW_MS });
    return true;
  }
  if (record.count >= MAX_REQUESTS_PER_WINDOW) {
    return false;
  }
  record.count++;
  return true;
}

exports.chatCompletion = onRequest(
  { 
    secrets: [groqApiKey],
    cors: allowedOrigins // Use native v2 cors option for tight security
  }, 
  async (req, res) => {
    // 1. Enforce HTTP Method
    if (req.method !== 'POST') {
      return res.status(405).send('Method Not Allowed. Only POST requests are accepted.');
    }

    // 2. Enforce Rate Limiting
    const clientIp = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
    if (!checkRateLimit(clientIp)) {
      console.warn(`Rate limit exceeded for IP: ${clientIp}`);
      return res.status(429).send("Too Many Requests. Please slow down and try again later.");
    }

    // 3. Request Validation
    const { messages, model, temperature, stream, response_format } = req.body;
    if (!messages || !Array.isArray(messages)) {
      return res.status(400).send('Bad Request: Missing or invalid "messages" array in request body.');
    }

    const payload = {
      model: model || 'compound-beta',
      messages,
      temperature: typeof temperature === 'number' ? temperature : 0.7,
      stream: !!stream
    };
    
    if (response_format) {
      payload.response_format = response_format;
    }

    // Retrieve the secret safely
    const apiKey = groqApiKey.value();
    if (!apiKey) {
      console.error("GROQ_API_KEY secret is not set in Firebase Secret Manager.");
      return res.status(500).send("Internal Server Error: AI Provider not configured.");
    }

    // 4. API Request to AI Provider
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
        const errorText = await groqResponse.text();
        console.error(`Groq API Error (${groqResponse.status}):`, errorText);
        return res.status(groqResponse.status).send(`AI Provider Error: ${errorText}`);
      }

      // 5. Handle Streaming Response
      if (payload.stream) {
        res.setHeader('Content-Type', 'text/event-stream');
        res.setHeader('Cache-Control', 'no-cache');
        res.setHeader('Connection', 'keep-alive');
        
        if (groqResponse.body) {
           try {
             for await (const chunk of groqResponse.body) {
               res.write(chunk);
             }
             res.end();
           } catch (streamErr) {
             console.error("Stream reading error:", streamErr);
             if (!res.writableEnded) {
                res.end();
             }
           }
           return;
        } else {
           const text = await groqResponse.text();
           return res.send(text);
        }
      } 
      
      // 6. Handle JSON Response
      const data = await groqResponse.json();
      return res.json(data);

    } catch (e) {
      console.error("Fetch error to AI Provider:", e);
      return res.status(500).send('Internal Server Error: Unable to connect to AI provider.');
    }
  }
);
