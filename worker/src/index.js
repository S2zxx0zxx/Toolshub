import { handlePaymentRequest } from './payments.js';
import { resolvePlan } from './planResolver.js';
import { checkAndIncrementDailyUsage } from './usageTracker.js';
import { FirebaseAdmin } from './firebaseAdmin.js';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*', // Fixed: wildcard to prevent CORS blocks
  'Access-Control-Allow-Methods': 'GET,HEAD,POST,OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  'Access-Control-Max-Age': '86400',
};

// Simple rate limiter implementation using Map is NOT fully reliable across Cloudflare edge nodes,
// but works as a basic deterrent within a single isolate.
// Deterrent only — durable per-user quota is enforced via Firestore in planResolver.js/usageTracker.js.
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

const paymentRateLimits = new Map();
const PAYMENT_RATE_LIMIT_WINDOW_MS = 60000;
const PAYMENT_MAX_REQUESTS_PER_WINDOW = 100; // Looser limit for payments

function checkPaymentRateLimit(ip) {
  const now = Date.now();
  if (!paymentRateLimits.has(ip)) {
    paymentRateLimits.set(ip, { count: 1, resetTime: now + PAYMENT_RATE_LIMIT_WINDOW_MS });
    return true;
  }
  const record = paymentRateLimits.get(ip);
  if (now > record.resetTime) {
    paymentRateLimits.set(ip, { count: 1, resetTime: now + PAYMENT_RATE_LIMIT_WINDOW_MS });
    return true;
  }
  if (record.count >= PAYMENT_MAX_REQUESTS_PER_WINDOW) {
    return false;
  }
  record.count++;
  return true;
}

async function callGitHubModels(modelId, payload, env) {
  const ghPayload = { 
    max_tokens: 4096,
    top_p: 1,
    ...payload, 
    model: modelId 
  };
  const ghResponse = await fetch('https://models.github.ai/inference/chat/completions', {
    method: 'POST',
    headers: {
      'Accept': 'application/vnd.github+json',
      'X-GitHub-Api-Version': '2022-11-28',
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${env.GITHUB_MODELS_TOKEN}`,
      'Accept-Encoding': 'identity'
    },
    body: JSON.stringify(ghPayload)
  });

  if (!ghResponse.ok) {
    return { ok: false, response: ghResponse };
  }

  const responseHeaders = new Headers(ghResponse.headers);
  responseHeaders.delete('content-encoding');
  responseHeaders.delete('content-length');
  responseHeaders.delete('transfer-encoding');
  // corsHeaders is defined globally
  for (const [key, value] of Object.entries(corsHeaders)) {
    responseHeaders.set(key, value);
  }

  return { 
    ok: true, 
    response: new Response(ghResponse.body, {
      status: ghResponse.status,
      headers: responseHeaders
    })
  };
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
    
    // Check if it's a payment request
    const url = new URL(request.url);
    if (url.pathname.startsWith('/api/payment/')) {
      if (!checkPaymentRateLimit(clientIp)) {
        return new Response('Too Many Requests. Please slow down.', { status: 429, headers: corsHeaders });
      }
      return await handlePaymentRequest(request, env, corsHeaders);
    }

    if (!checkRateLimit(clientIp)) {
      return new Response('Too Many Requests. Please slow down.', { status: 429, headers: corsHeaders });
    }

    let callerPlan;
    try {
      callerPlan = await resolvePlan(request, env);
    } catch (e) {
      return new Response(JSON.stringify({ error: 'Invalid or expired authentication token.' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
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

    // 4.2 RAG Ingest Branch
    if (body.type === 'rag_ingest') {
      try {
        if (!body.text) {
          return new Response(JSON.stringify({ error: 'Text is required for ingestion.' }), { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
        }
        
        // Generate embedding
        const aiResponse = await env.AI.run('@cf/baai/bge-base-en-v1.5', {
          text: [body.text]
        });
        const vector = aiResponse.data[0];

        // Insert into Vectorize (generating a random ID or using provided)
        const recordId = body.metadata?.id || crypto.randomUUID();
        const record = {
          id: recordId,
          values: vector,
          metadata: { text: body.text, ...body.metadata }
        };

        const insertResponse = await env.VECTORIZE.insert([record]);
        return new Response(JSON.stringify({ success: true, insertResponse, id: recordId }), { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
      } catch (e) {
        return new Response(JSON.stringify({ error: 'RAG ingestion failed.', details: e.message }), { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
      }
    }

    // 4.3 RAG Query Branch
    if (body.type === 'rag_query') {
      try {
        if (!body.query) {
          return new Response(JSON.stringify({ error: 'Query is required.' }), { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
        }

        // Embed the query
        const aiResponse = await env.AI.run('@cf/baai/bge-base-en-v1.5', {
          text: [body.query]
        });
        const queryVector = aiResponse.data[0];

        // Query Vectorize
        const searchResults = await env.VECTORIZE.query(queryVector, {
          topK: 5,
          returnMetadata: 'all'
        });

        // Map matches to a clean format
        const matches = searchResults.matches.map(m => ({
          score: m.score,
          text: m.metadata?.text,
          ...m.metadata
        }));

        return new Response(JSON.stringify({ results: matches }), { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
      } catch (e) {
        return new Response(JSON.stringify({ error: 'RAG query failed.', details: e.message }), { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
      }
    }

    const fbAdmin = new FirebaseAdmin(env.FIREBASE_SERVICE_ACCOUNT);
    const usageCheck = await checkAndIncrementDailyUsage(fbAdmin, callerPlan.uid, callerPlan.dailyLimit, env);
    if (!usageCheck.allowed) {
      return new Response(JSON.stringify({ error: 'daily_limit_reached', limit: callerPlan.dailyLimit }), {
        status: 429,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    const { messages, model, temperature, stream, response_format, mode, tools } = body;
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

    if (mode === 'agent' && tools) {
      payload.tools = tools;
    }

    // 5. Secret Key Verification
    const apiKey = env.GROQ_API_KEY;
    if (!apiKey) {
      return new Response("Internal Server Error: GROQ_API_KEY secret is not set.", { status: 500, headers: corsHeaders });
    }

    // 5.5 Bypass Groq for explicit GitHub Models
    if (targetModel === 'gpt-4o-mini' && env.GITHUB_MODELS_TOKEN) {
      try {
        const ghRes = await callGitHubModels('openai/gpt-4o-mini', payload, env);
        if (ghRes.ok) return ghRes.response;
        
        const errorText = await ghRes.response.text();
        return new Response('GitHub Models Error: ' + errorText, { status: 500, headers: corsHeaders });
      } catch (e) {
        return new Response('Internal Server Error: GitHub Models unreachable', { status: 500, headers: corsHeaders });
      }
    }

    // 6. Proxy Request to Groq API
    let groqResponse;
    let groqNetworkFailed = false;

    try {
      groqResponse = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`,
          'Accept-Encoding': 'identity'
        },
        body: JSON.stringify(payload)
      });
    } catch (e) {
      console.error("Fetch error to Groq:", e);
      groqNetworkFailed = true;
    }

    const groqFailed = groqNetworkFailed || !groqResponse.ok;

    if (groqFailed) {
      if (targetModel === 'llama-3.3-70b-versatile' && env.GITHUB_MODELS_TOKEN) {
        console.log("Groq failed, attempting GitHub Models fallback (meta-llama/Llama-3.3-70B-Instruct)...");
        try {
          const ghRes1 = await callGitHubModels('meta-llama/Llama-3.3-70B-Instruct', payload, env);
          if (ghRes1.ok) {
            console.log("Served by: github-models (meta-llama/Llama-3.3-70B-Instruct) after Groq failure");
            return ghRes1.response;
          }
          
          console.log("GitHub Models (meta-llama/Llama-3.3-70B-Instruct) failed, attempting secondary fallback (openai/gpt-4o-mini)...");
          const ghRes2 = await callGitHubModels('openai/gpt-4o-mini', payload, env);
          if (ghRes2.ok) {
            console.log("Served by: github-models (openai/gpt-4o-mini) after Groq failure");
            return ghRes2.response;
          }
        } catch (fallbackErr) {
          console.error("Fallback chain threw an error:", fallbackErr);
        }
      }

      // If fallback wasn't eligible or all fallbacks failed, return the real Groq error
      if (groqNetworkFailed) {
        return new Response('Internal Server Error: Unable to connect to AI provider.', { status: 500, headers: corsHeaders });
      } else {
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
    }

    console.log("Served by: groq");

    try {
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
      responseHeaders.delete('content-encoding');
      responseHeaders.delete('content-length');
      responseHeaders.delete('transfer-encoding');
      
      for (const [key, value] of Object.entries(corsHeaders)) {
        responseHeaders.set(key, value);
      }

      if (!stream && !isCompoundModel) {
        const data = await groqResponse.json();
        if (mode === 'agent') {
          data.meta = { planId: callerPlan.planId, maxSteps: callerPlan.maxSteps };
        }
        return new Response(JSON.stringify(data), {
          status: groqResponse.status,
          headers: responseHeaders
        });
      }

      // If streaming, return the readable stream directly.
      return new Response(groqResponse.body, {
        status: groqResponse.status,
        headers: responseHeaders
      });

    } catch (e) {
      console.error("Error processing successful Groq response:", e);
      return new Response('Internal Server Error: Error processing AI response.', { status: 500, headers: corsHeaders });
    }
  },
};
