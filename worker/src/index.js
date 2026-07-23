import { withSentry } from '@sentry/cloudflare';
import * as Sentry from '@sentry/cloudflare';
import { handlePaymentRequest } from './payments.js';
import { resolvePlan } from './planResolver.js';
import { checkAndIncrementDailyUsage } from './usageTracker.js';
import { recordUsageStat } from './usageStats.js';
import { FirebaseAdmin } from './firebaseAdmin.js';
import { MODEL_CATALOG_TIERS, rankOf } from './modelAccess.js';
import { callModelWithFallback } from './modelFallback.js';
import * as statusMonitor from './statusMonitor.js';
import { routeRequest } from './agents/orchestrator.js';
import { runCoderAgent } from './agents/coder.js';
import { runCreatorAgent } from './agents/creator.js';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*', // Fixed: wildcard to prevent CORS blocks
  'Access-Control-Allow-Methods': 'GET,HEAD,POST,OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  'Access-Control-Max-Age': '86400',
};

import { checkRateLimit, checkPaymentRateLimit } from './rateLimiter.js';



export default withSentry((env) => {
  if (!env.SENTRY_DSN) {
    console.warn("SENTRY_DSN is not set. Sentry error tracking is disabled.");
  }
  return {
    dsn: env.SENTRY_DSN,
    beforeSend(event) {
      // Privacy: Redact request bodies which may contain chat histories, PII, or tokens
      if (event.request && event.request.data) {
        event.request.data = '[REDACTED FOR PRIVACY]';
      }
      return event;
    }
  };
}, {
  async fetch(request, env, ctx) {
    env.ctx = ctx;
    try {

    // 1. Handle CORS Preflight (OPTIONS)
    if (request.method === 'OPTIONS') {
      return new Response('OK', {
        status: 200,
        headers: corsHeaders
      });
    }

    const url = new URL(request.url);

    // 1.5 Public Health Check Endpoint (For UptimeRobot)
    if (request.method === 'GET' && (url.pathname === '/health' || url.pathname === '/api/health')) {
      return new Response('OK', { status: 200, headers: corsHeaders });
    }

    // 1.6 Admin Usage Stats Endpoint (Internal View)
    if (request.method === 'GET' && url.pathname === '/api/admin/usage-stats') {
      const { handleAdminUsageStats } = await import('./adminStats.js');
      return await handleAdminUsageStats(request, env, corsHeaders);
    }

    // 1.7 Agent 2 (Ops Maintainer) Health Report Endpoint
    if (request.method === 'GET' && url.pathname === '/api/admin/agent-health') {
      // Basic security check
      if (env.ADMIN_UID && request.headers.get('Authorization') !== `Bearer ${env.ADMIN_UID}`) {
        return new Response('Unauthorized', { status: 401, headers: corsHeaders });
      }
      const { runOpsAgent } = await import('./agents/ops.js');
      const report = await runOpsAgent(env);
      return new Response(report, { status: 200, headers: { ...corsHeaders, 'Content-Type': 'text/plain' } });
    }

    // 2. Enforce HTTP Method
    if (request.method !== 'POST') {
      return new Response('Method Not Allowed', { status: 405, headers: corsHeaders });
    }

    // 3. Rate Limiting
    const clientIp = request.headers.get('cf-connecting-ip') || 'unknown';
    
    // Check if it's a payment request

    if (url.pathname.startsWith('/api/payment/')) {
      Sentry.addBreadcrumb({ category: 'payment', message: 'Processing payment webhook', level: 'info' });
      if (!(await checkPaymentRateLimit(clientIp, env))) {
        return new Response('Too Many Requests. Please slow down.', { status: 429, headers: corsHeaders });
      }
      return await handlePaymentRequest(request, env, corsHeaders);
    }

    if (!(await checkRateLimit(clientIp, env))) {
      return new Response('Too Many Requests. Please slow down.', { status: 429, headers: corsHeaders });
    }

    if (url.pathname === '/api/dev-access/redeem') {
      const { handleDevAccessRedeem } = await import('./devAccess.js');
      return await handleDevAccessRedeem(request, env, corsHeaders);
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

    let fbAdmin = null;
    if (env.FIREBASE_SERVICE_ACCOUNT) {
      try {
        fbAdmin = new FirebaseAdmin(env.FIREBASE_SERVICE_ACCOUNT);
        const usageCheck = await checkAndIncrementDailyUsage(fbAdmin, callerPlan.uid, callerPlan.dailyLimit, env);
        if (!usageCheck.allowed) {
          return new Response(JSON.stringify({ error: 'daily_limit_reached', limit: callerPlan.dailyLimit }), {
            status: 429,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
          });
        }
      } catch (e) {
        console.warn("Firebase usage check failed:", e);
      }
    } else {
      console.warn("FIREBASE_SERVICE_ACCOUNT not set. Skipping daily usage enforcement.");
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

    // Agent 1: Orchestrator Hook
    // Skip for: mode='agent' (tool-calling loop) and mode='classify' (internal intent/fan-out classification calls).
    // 'classify' calls are short, non-conversational JSON prompts from intent.js / modelDecisionEngine.js;
    // running them through the Orchestrator risks silent misrouting to the creator/coder agent.
    let targetAgent = 'chat';
    if (mode !== 'agent' && mode !== 'classify') {
      targetAgent = await routeRequest(messages, env, callerPlan.planId);
      Sentry.addBreadcrumb({ category: 'orchestrator', message: `Orchestrator routed request to: ${targetAgent}`, level: 'info' });
      
      // Phase B Branching
      if (targetAgent === 'creator') {
        const creatorResponse = await runCreatorAgent(messages, env);
        // Inject CORS headers into the response
        const newHeaders = new Headers(creatorResponse.headers);
        for (const [key, value] of Object.entries(corsHeaders)) {
          newHeaders.set(key, value);
        }
        return new Response(creatorResponse.body, { status: creatorResponse.status, headers: newHeaders });
      }

      if (targetAgent === 'coder') {
        const payloadOpts = { temperature: 0.2, stream: !!stream };
        const coderResult = await runCoderAgent(messages, env, callerPlan.planId, payloadOpts);
        
        // Let it fall through to the standard response formatter below by overriding variables
        if (!coderResult.ok) {
           return new Response('Internal Server Error: Coder Agent Failed.', { status: 500, headers: corsHeaders });
        }
        targetModel = 'gpt-4o-mini'; // Override for logging/formatting
        // We will skip the normal model call and jump straight to formatting
        const responseHeaders = new Headers(coderResult.response.headers);
        responseHeaders.delete('content-encoding');
        responseHeaders.delete('content-length');
        responseHeaders.delete('transfer-encoding');
        for (const [key, value] of Object.entries(corsHeaders)) {
          responseHeaders.set(key, value);
        }
        if (!stream) {
          const data = await coderResult.response.json();
          return new Response(JSON.stringify(data), { status: 200, headers: responseHeaders });
        }
        return new Response(coderResult.response.body, { status: 200, headers: responseHeaders });
      }
    }

    // Enforce model access tier
    const requiredTier = MODEL_CATALOG_TIERS[targetModel] || 'free';
    if (rankOf(requiredTier) > rankOf(callerPlan.planId)) {
      return new Response(JSON.stringify({ 
        error: 'model_tier_required', 
        requiredTier: requiredTier, 
        yourTier: callerPlan.planId 
      }), {
        status: 403,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    // Record non-identifying aggregate usage stat (errors are swallowed inside)
    const toolCategory = body.toolCategory || (mode === 'agent' ? 'agent' : 'chat');
    if (fbAdmin) {
      env.ctx.waitUntil(recordUsageStat(fbAdmin, targetModel, toolCategory, env));
    }

    Sentry.addBreadcrumb({ category: 'model', message: `Routing request for model ${targetModel}`, level: 'info' });

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

    // 6. Execute Model Call with Tier-Aware Fallback
    const fallbackResult = await callModelWithFallback(targetModel, payload, env, callerPlan.planId);

    if (!fallbackResult.ok) {
      // Total failure case: return the last error from the chain
      // If we got an HTTP response back, forward it so the client knows it was an upstream error.
      // Otherwise, return a generic 500.
      if (fallbackResult.response) {
        const responseHeaders = new Headers(fallbackResult.response.headers);
        responseHeaders.delete('content-encoding');
        responseHeaders.delete('content-length');
        responseHeaders.delete('transfer-encoding');
        for (const [key, value] of Object.entries(corsHeaders)) {
          responseHeaders.set(key, value);
        }
        return new Response(fallbackResult.response.body, {
          status: fallbackResult.response.status,
          headers: responseHeaders
        });
      } else {
        return new Response('Internal Server Error: All eligible AI providers are unreachable.', { status: 500, headers: corsHeaders });
      }
    }

    const groqResponse = fallbackResult.response;
    const servedByModel = fallbackResult.servedByModel;
    console.log(`Served by: ${servedByModel}`);

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
    } catch (unhandledException) {
      console.error("Unhandled Exception in fetch:", unhandledException);
      return new Response(JSON.stringify({ error: unhandledException.message, stack: unhandledException.stack }), { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
    }
  },
  
  async scheduled(event, env, ctx) {
    Sentry.addBreadcrumb({ category: 'cron', message: 'Running statusMonitor cron', level: 'info' });
    await statusMonitor.scheduled(event, env, ctx);
  }
});
