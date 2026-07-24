import { MODEL_CATALOG_TIERS, rankOf, ENDPOINTS } from './modelAccess.js';
import * as Sentry from '@sentry/cloudflare';

// Helper to delay
const delay = ms => new Promise(res => setTimeout(res, ms));

async function callCloudflareAI(payload, env) {
  // Use Cloudflare's native AI as the ultimate Agent 5 fallback.
  // It runs on the edge and is almost never down.
  const response = await env.AI.run('@cf/meta/llama-3.1-8b-instruct', {
    messages: payload.messages,
    stream: payload.stream
  });

  if (payload.stream) {
    // Cloudflare AI stream matches standard Server-Sent Events
    return new Response(response, {
      status: 200,
      headers: { "content-type": "text/event-stream" }
    });
  } else {
    // Wrap the response in an OpenAI-like format so the frontend doesn't break
    const jsonBody = JSON.stringify({
      choices: [{ message: { content: response.response || "" } }]
    });
    return new Response(jsonBody, {
      status: 200,
      headers: { "content-type": "application/json" }
    });
  }
}

async function callGitHubModels(modelId, payload, env) {
  const ghPayload = { 
    max_tokens: 4096,
    top_p: 1,
    ...payload, 
    model: modelId 
  };
  const ghResponse = await fetch(ENDPOINTS.GITHUB_MODELS, {
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

  return ghResponse;
}

async function callGroq(modelId, payload, env, timeoutMs) {
  const apiKey = env.GROQ_API_KEY;
  if (!apiKey) {
    throw new Error("GROQ_API_KEY secret is not set.");
  }
  
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);
  
  try {
    const groqResponse = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
        'Accept-Encoding': 'identity'
      },
      body: JSON.stringify({ ...payload, model: modelId }),
      signal: controller.signal
    });
    return groqResponse;
  } finally {
    clearTimeout(timeoutId);
  }
}

async function callWithRetry(modelId, payload, env, isLayer2, timeoutMs) {
  const MAX_RETRIES = 2;
  const RETRY_DELAY_MS = 1000;
  
  let lastResponse = null;
  let lastError = null;

  for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
    try {
      const response = isLayer2
        ? await callGitHubModels(modelId, payload, env)
        : await callGroq(modelId, payload, env, timeoutMs);
        
      if (response.ok) {
        return { ok: true, response };
      }
      lastResponse = response;
    } catch (e) {
      lastError = e;
    }
    
    if (attempt < MAX_RETRIES) {
      await delay(RETRY_DELAY_MS);
    }
  }

  return { ok: false, response: lastResponse, error: lastError };
}

export async function callModelWithFallback(requestedModelId, payload, env, userPlanId, persona) {
  const pair = MODEL_BACKUP_PAIRS[persona];
  const isIntent = persona === 'intentClassifier';
  
  // 1. Layer 1 (Groq)
  const layer1ModelId = pair ? pair.layer1 : requestedModelId;
  const l1Timeout = isIntent ? 5000 : 18000; // tighter timeout for intent
  
  const l1Result = await callWithRetry(layer1ModelId, payload, env, false, l1Timeout);
  if (l1Result.ok) {
    return { ok: true, response: l1Result.response, servedByModel: layer1ModelId };
  }

  // Layer 1 failed.
  if (env.SENTRY_DSN) {
    Sentry.addBreadcrumb({
      category: 'model-fallback',
      message: `Layer 1 (${layer1ModelId}) failed for ${persona || requestedModelId}. Reason: ${l1Result.error?.message || l1Result.response?.status}`,
      level: 'warning'
    });
  } else {
    console.warn(`Layer 1 (${layer1ModelId}) failed for ${persona || requestedModelId}. Reason: ${l1Result.error?.message || l1Result.response?.status}`);
  }

  // 2. Layer 2 (GitHub Models)
  const layer2ModelId = pair ? pair.layer2 : null;
  let l2Result = { ok: false };
  if (layer2ModelId) {
    if (!env.GITHUB_MODELS_TOKEN) {
      console.warn("GitHub Models token missing, skipping Layer 2.");
    } else {
      l2Result = await callWithRetry(layer2ModelId, payload, env, true, l1Timeout);
      if (l2Result.ok) {
        if (env.SENTRY_DSN) {
          Sentry.addBreadcrumb({
            category: 'model-fallback-success',
            message: `Layer 2 (${layer2ModelId}) served request for ${persona || requestedModelId}.`,
            level: 'info'
          });
        }
        return { ok: true, response: l2Result.response, servedByModel: layer2ModelId };
      }
      
      // Layer 2 failed.
      if (env.SENTRY_DSN) {
        Sentry.addBreadcrumb({
          category: 'model-fallback-failure',
          message: `Layer 2 (${layer2ModelId}) also failed for ${persona || requestedModelId}. Reason: ${l2Result.error?.message || l2Result.response?.status}`,
          level: 'warning'
        });
      } else {
        console.warn(`Layer 2 (${layer2ModelId}) failed for ${persona || requestedModelId}. Reason: ${l2Result.error?.message || l2Result.response?.status}`);
      }
    }
  }

  // 3. Layer 3 (Cloudflare Native AI) - Skip for intent classifier
  if (isIntent) {
    return { 
      ok: false, 
      response: l2Result.response || l1Result.response, 
      error: l2Result.error || l1Result.error, 
      servedByModel: null 
    };
  }
  
  try {
    if (env.SENTRY_DSN) {
      Sentry.addBreadcrumb({
         category: 'model-fallback-agent5',
         message: `All external APIs exhausted. Engaging Layer 3 (Cloudflare Native AI) for ${persona || requestedModelId}.`,
         level: 'warning'
      });
    }
    
    const cfResponse = await callCloudflareAI(payload, env);
    return { ok: true, response: cfResponse, servedByModel: '@cf/meta/llama-3.1-8b-instruct' };
  } catch (agent5Error) {
    if (env.SENTRY_DSN) {
      Sentry.addBreadcrumb({
         category: 'model-fallback-exhausted',
         message: `Layer 3 completely failed. System is down.`,
         level: 'error'
      });
    }
    return { 
      ok: false, 
      response: l2Result.response || l1Result.response, 
      error: agent5Error, 
      servedByModel: null 
    };
  }
}
