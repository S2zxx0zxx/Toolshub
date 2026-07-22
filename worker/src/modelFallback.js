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

async function callGroq(modelId, payload, env) {
  const apiKey = env.GROQ_API_KEY;
  if (!apiKey) {
    throw new Error("GROQ_API_KEY secret is not set.");
  }
  
  const groqResponse = await fetch('https://api.groq.com/openai/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`,
      'Accept-Encoding': 'identity'
    },
    body: JSON.stringify({ ...payload, model: modelId })
  });
  
  return groqResponse;
}

async function callProvider(modelId, payload, env) {
  // Define which provider handles which model
  if (modelId === 'gpt-4o-mini') {
    if (!env.GITHUB_MODELS_TOKEN) throw new Error("GitHub Models token missing.");
    return await callGitHubModels('openai/gpt-4o-mini', payload, env);
  }
  
  // Note: If falling back to 70B from github models, its model id there is meta-llama/Llama-3.3-70B-Instruct.
  // But since we are mapping strictly through MODEL_CATALOG_TIERS, we stick to Groq's IDs where applicable.
  return await callGroq(modelId, payload, env);
}

async function callWithRetry(modelId, payload, env) {
  const MAX_RETRIES = 2;
  const RETRY_DELAY_MS = 1000;
  
  let lastResponse = null;
  let lastError = null;

  for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
    try {
      const response = await callProvider(modelId, payload, env);
      if (response.ok) {
        return { ok: true, response };
      }
      // If it's a 4xx error (like invalid request), retrying probably won't help, but we'll stick to a simple strategy for now
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

export async function callModelWithFallback(requestedModelId, payload, env, userPlanId) {
  // Generate an ordered list of models from highest to lowest tier
  // Sort models based on their rank
  const orderedModels = Object.keys(MODEL_CATALOG_TIERS).sort((a, b) => {
    return rankOf(MODEL_CATALOG_TIERS[b]) - rankOf(MODEL_CATALOG_TIERS[a]);
  });

  // Find where our requested model is in the fallback chain
  const startIndex = orderedModels.indexOf(requestedModelId);
  const userRank = rankOf(userPlanId);

  let lastResult = null;

  for (let i = startIndex; i < orderedModels.length; i++) {
    const currentModelId = orderedModels[i];
    const currentTier = MODEL_CATALOG_TIERS[currentModelId];
    
    // Only attempt if the user is entitled to this tier
    if (rankOf(currentTier) > userRank) {
      continue;
    }

    const result = await callWithRetry(currentModelId, payload, env);
    
    if (result.ok) {
      if (currentModelId !== requestedModelId) {
        // Fallback occurred
        if (env.SENTRY_DSN) {
          Sentry.addBreadcrumb({
            category: 'model-fallback',
            message: `Model fallback triggered: ${requestedModelId} failed, served by ${currentModelId}`,
            level: 'warning'
          });
        } else {
          console.warn(`Model fallback triggered: ${requestedModelId} failed, served by ${currentModelId}`);
        }
      }
      return { ok: true, response: result.response, servedByModel: currentModelId };
    }
    
    lastResult = result;
    
    // Log the failure of this specific model in the chain
    if (env.SENTRY_DSN) {
      Sentry.addBreadcrumb({
         category: 'model-fallback-failure',
         message: `Model ${currentModelId} failed during fallback chain.`,
         level: 'warning'
      });
    }
  }

  // If we exhaust the fallback chain, AGENT 5 (Ultimate Fallback) takes over.
  // We use Cloudflare's native edge AI, which bypasses all external network calls.
  try {
    if (env.SENTRY_DSN) {
      Sentry.addBreadcrumb({
         category: 'model-fallback-agent5',
         message: `All external APIs exhausted. Engaging Agent 5 (Cloudflare Native AI) for ${requestedModelId}.`,
         level: 'warning'
      });
    }
    
    const cfResponse = await callCloudflareAI(payload, env);
    return { ok: true, response: cfResponse, servedByModel: '@cf/meta/llama-3.1-8b-instruct' };
  } catch (agent5Error) {
    if (env.SENTRY_DSN) {
      Sentry.addBreadcrumb({
         category: 'model-fallback-exhausted',
         message: `Agent 5 completely failed. System is down.`,
         level: 'error'
      });
    }
    return { ok: false, response: lastResult?.response, error: agent5Error, servedByModel: null };
  }
}
