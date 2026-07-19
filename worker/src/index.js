const corsHeaders = {
  'Access-Control-Allow-Origin': '*', // Fixed: wildcard to prevent CORS blocks
  'Access-Control-Allow-Methods': 'GET,HEAD,POST,OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  'Access-Control-Max-Age': '86400',
};

// Simple rate limiter implementation using Map is NOT fully reliable across Cloudflare edge nodes,
// but works as a basic deterrent within a single isolate.
const ipRateLimits = new Map();
const RATE_LIMIT_WINDOW_MS = 60000;
const MAX_REQUESTS_PER_WINDOW = 30;

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

export default {
  async fetch(request, env, ctx) {


    // 1. Handle CORS Preflight (OPTIONS)
    if (request.method === 'OPTIONS') {
      return new Response('OK', {
        status: 200,
        headers: corsHeaders
      });
    }

    // 2. Enforce HTTP Method
    if (request.method !== 'POST') {
      return new Response('Method Not Allowed', { status: 405, headers: corsHeaders });
    }

    // 3. Rate Limiting
    const clientIp = request.headers.get('cf-connecting-ip') || 'unknown';
    if (!checkRateLimit(clientIp)) {
      return new Response('Too Many Requests. Please slow down.', { status: 429, headers: corsHeaders });
    }

    // 4. Request Validation
    let body;
    try {
      body = await request.json();
    } catch (e) {
      return new Response('Bad Request: Invalid JSON', { status: 400, headers: corsHeaders });
    }

    // 4.1 Search Proxy Branch
    if (body.type === 'search') {
      const tavilyKey = env.TAVILY_API_KEY;
      if (!tavilyKey) {
        return new Response(JSON.stringify({ error: 'Search is not configured.' }), { status: 503, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
      }
      try {
        const tavilyResponse = await fetch('https://api.tavily.com/search', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            api_key: tavilyKey,
            query: body.query,
            search_depth: 'basic',
            include_answer: true,
            max_results: 5
          })
        });
        const tavilyData = await tavilyResponse.text();
        return new Response(tavilyData, { status: tavilyResponse.status, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
      } catch (e) {
        return new Response(JSON.stringify({ error: 'Search service unavailable.' }), { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
      }
    }

    const { messages, model, temperature, stream, response_format } = body;
    if (!messages || !Array.isArray(messages)) {
      return new Response('Bad Request: Missing or invalid "messages" array.', { status: 400, headers: corsHeaders });
    }

    let targetModel = model;
    // Note: llama3-70b-8192 and llama3-8b-8192 are decommissioned by Groq.
    if (targetModel === 'llama3-70b-8192' || targetModel === 'llama-3.1-70b-versatile' || targetModel === 'llama-3.3-70b-versatile' || !targetModel) {
      targetModel = 'llama-3.3-70b-versatile';
    }
    if (targetModel === 'llama3-8b-8192' || targetModel === 'llama-3.1-8b-instant') {
      targetModel = 'llama-3.1-8b-instant';
    }

    const isCompoundModel = targetModel === 'groq/compound' || targetModel === 'groq/compound-mini';

    const payload = {
      model: targetModel,
      messages,
      temperature: typeof temperature === 'number' ? temperature : 0.7,
      stream: isCompoundModel ? false : !!stream
    };
    
    if (response_format) {
      payload.response_format = response_format;
    }

    // 5. Secret Key Verification
    const apiKey = env.GROQ_API_KEY;
    if (!apiKey) {
      return new Response("Internal Server Error: GROQ_API_KEY secret is not set.", { status: 500, headers: corsHeaders });
    }

    // 6. Proxy Request to Groq API
    try {
      const groqResponse = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`,
          'Accept-Encoding': 'identity'
        },
        body: JSON.stringify(payload)
      });

      // 6.1 Handle non-200 Error Passthrough
      if (!groqResponse.ok) {
        const responseHeaders = new Headers(groqResponse.headers);
        responseHeaders.delete('content-encoding');
        responseHeaders.delete('content-length');
        responseHeaders.delete('transfer-encoding');
        for (const [key, value] of Object.entries(corsHeaders)) {
          responseHeaders.set(key, value);
        }
        return new Response(groqResponse.body, {
          status: groqResponse.status,
          headers: responseHeaders
        });
      }

      // 6.2 Handle Synthetic SSE for Compound Models
      if (isCompoundModel && !!stream) {
        const data = await groqResponse.json();
        const content = data.choices && data.choices[0] && data.choices[0].message ? data.choices[0].message.content || '' : '';
        
        // Wrap the full response in a single synthetic chunk
        const fakeChunk = JSON.stringify({ choices: [{ delta: { content: content } }] });
        const sseBody = `data: ${fakeChunk}\n\ndata: [DONE]\n\n`;

        const responseHeaders = new Headers();
        for (const [key, value] of Object.entries(corsHeaders)) {
          responseHeaders.set(key, value);
        }
        responseHeaders.set('Content-Type', 'text/event-stream');
        
        return new Response(sseBody, {
          status: 200,
          headers: responseHeaders
        });
      }

      // 6.3 Handle Standard Streaming Models
      // Construct a new Response to ensure CORS headers are injected
      const responseHeaders = new Headers(groqResponse.headers);
      // IMPORTANT: Remove encoding headers because Cloudflare's fetch() decompresses the body automatically.
      // If we leave them, the browser expects gzipped data but gets raw text, causing a blank response!
      responseHeaders.delete('content-encoding');
      responseHeaders.delete('content-length');
      responseHeaders.delete('transfer-encoding');
      
      for (const [key, value] of Object.entries(corsHeaders)) {
        responseHeaders.set(key, value);
      }

      // If streaming, return the readable stream directly.
      // Cloudflare Workers natively supports streaming responses!
      return new Response(groqResponse.body, {
        status: groqResponse.status,
        headers: responseHeaders
      });

    } catch (e) {
      console.error("Fetch error to AI Provider:", e);
      return new Response('Internal Server Error: Unable to connect to AI provider.', { status: 500, headers: corsHeaders });
    }
  },
};
