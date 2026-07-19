var __defProp = Object.defineProperty;
var __name = (target, value) => __defProp(target, "name", { value, configurable: true });

// src/index.js
var corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  // Fixed: wildcard to prevent CORS blocks
  "Access-Control-Allow-Methods": "GET,HEAD,POST,OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
  "Access-Control-Max-Age": "86400"
};
var ipRateLimits = /* @__PURE__ */ new Map();
var RATE_LIMIT_WINDOW_MS = 6e4;
var MAX_REQUESTS_PER_WINDOW = 30;
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
__name(checkRateLimit, "checkRateLimit");
async function callGitHubModels(modelId, payload, env) {
  const ghPayload = {
    max_tokens: 4096,
    top_p: 1,
    ...payload,
    model: modelId
  };
  const ghResponse = await fetch("https://models.github.ai/inference/chat/completions", {
    method: "POST",
    headers: {
      "Accept": "application/vnd.github+json",
      "X-GitHub-Api-Version": "2022-11-28",
      "Content-Type": "application/json",
      "Authorization": `Bearer ${env.GITHUB_MODELS_TOKEN}`,
      "Accept-Encoding": "identity"
    },
    body: JSON.stringify(ghPayload)
  });
  if (!ghResponse.ok) {
    return { ok: false, response: ghResponse };
  }
  const responseHeaders = new Headers(ghResponse.headers);
  responseHeaders.delete("content-encoding");
  responseHeaders.delete("content-length");
  responseHeaders.delete("transfer-encoding");
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
__name(callGitHubModels, "callGitHubModels");
var src_default = {
  async fetch(request, env, ctx) {
    if (request.method === "OPTIONS") {
      return new Response("OK", {
        status: 200,
        headers: corsHeaders
      });
    }
    if (request.method !== "POST") {
      return new Response("Method Not Allowed", { status: 405, headers: corsHeaders });
    }
    const clientIp = request.headers.get("cf-connecting-ip") || "unknown";
    if (!checkRateLimit(clientIp)) {
      return new Response("Too Many Requests. Please slow down.", { status: 429, headers: corsHeaders });
    }
    let body;
    try {
      body = await request.json();
    } catch (e) {
      return new Response("Bad Request: Invalid JSON", { status: 400, headers: corsHeaders });
    }
    if (body.type === "search") {
      const tavilyKey = env.TAVILY_API_KEY;
      if (!tavilyKey) {
        return new Response(JSON.stringify({ error: "Search is not configured." }), { status: 503, headers: { ...corsHeaders, "Content-Type": "application/json" } });
      }
      try {
        const tavilyResponse = await fetch("https://api.tavily.com/search", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            api_key: tavilyKey,
            query: body.query,
            search_depth: "basic",
            include_answer: true,
            max_results: 5
          })
        });
        const tavilyData = await tavilyResponse.text();
        return new Response(tavilyData, { status: tavilyResponse.status, headers: { ...corsHeaders, "Content-Type": "application/json" } });
      } catch (e) {
        return new Response(JSON.stringify({ error: "Search service unavailable." }), { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } });
      }
    }
    const { messages, model, temperature, stream, response_format } = body;
    if (!messages || !Array.isArray(messages)) {
      return new Response('Bad Request: Missing or invalid "messages" array.', { status: 400, headers: corsHeaders });
    }
    let targetModel = model;
    if (targetModel === "llama3-70b-8192" || targetModel === "llama-3.1-70b-versatile" || targetModel === "llama-3.3-70b-versatile" || !targetModel) {
      targetModel = "llama-3.3-70b-versatile";
    }
    if (targetModel === "llama3-8b-8192" || targetModel === "llama-3.1-8b-instant") {
      targetModel = "llama-3.1-8b-instant";
    }
    const isCompoundModel = targetModel === "groq/compound" || targetModel === "groq/compound-mini";
    const payload = {
      model: targetModel,
      messages,
      temperature: typeof temperature === "number" ? temperature : 0.7,
      stream: isCompoundModel ? false : !!stream
    };
    if (response_format) {
      payload.response_format = response_format;
    }
    const apiKey = env.GROQ_API_KEY;
    if (!apiKey) {
      return new Response("Internal Server Error: GROQ_API_KEY secret is not set.", { status: 500, headers: corsHeaders });
    }
    if (targetModel === "gpt-4o-mini" && env.GITHUB_MODELS_TOKEN) {
      try {
        const ghRes = await callGitHubModels("openai/gpt-4o-mini", payload, env);
        if (ghRes.ok)
          return ghRes.response;
        const errorText = await ghRes.response.text();
        return new Response("GitHub Models Error: " + errorText, { status: 500, headers: corsHeaders });
      } catch (e) {
        return new Response("Internal Server Error: GitHub Models unreachable", { status: 500, headers: corsHeaders });
      }
    }
    let groqResponse;
    let groqNetworkFailed = false;
    try {
      groqResponse = await fetch("https://api.groq.com/openai/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${apiKey}`,
          "Accept-Encoding": "identity"
        },
        body: JSON.stringify(payload)
      });
    } catch (e) {
      console.error("Fetch error to Groq:", e);
      groqNetworkFailed = true;
    }
    const groqFailed = groqNetworkFailed || !groqResponse.ok;
    if (groqFailed) {
      if (targetModel === "llama-3.3-70b-versatile" && env.GITHUB_MODELS_TOKEN) {
        console.log("Groq failed, attempting GitHub Models fallback (meta-llama/Llama-3.3-70B-Instruct)...");
        try {
          const ghRes1 = await callGitHubModels("meta-llama/Llama-3.3-70B-Instruct", payload, env);
          if (ghRes1.ok) {
            console.log("Served by: github-models (meta-llama/Llama-3.3-70B-Instruct) after Groq failure");
            return ghRes1.response;
          }
          console.log("GitHub Models (meta-llama/Llama-3.3-70B-Instruct) failed, attempting secondary fallback (openai/gpt-4o-mini)...");
          const ghRes2 = await callGitHubModels("openai/gpt-4o-mini", payload, env);
          if (ghRes2.ok) {
            console.log("Served by: github-models (openai/gpt-4o-mini) after Groq failure");
            return ghRes2.response;
          }
        } catch (fallbackErr) {
          console.error("Fallback chain threw an error:", fallbackErr);
        }
      }
      if (groqNetworkFailed) {
        return new Response("Internal Server Error: Unable to connect to AI provider.", { status: 500, headers: corsHeaders });
      } else {
        const responseHeaders = new Headers(groqResponse.headers);
        responseHeaders.delete("content-encoding");
        responseHeaders.delete("content-length");
        responseHeaders.delete("transfer-encoding");
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
      if (isCompoundModel && !!stream) {
        const data = await groqResponse.json();
        const content = data.choices && data.choices[0] && data.choices[0].message ? data.choices[0].message.content || "" : "";
        const fakeChunk = JSON.stringify({ choices: [{ delta: { content } }] });
        const sseBody = `data: ${fakeChunk}

data: [DONE]

`;
        const responseHeaders2 = new Headers();
        for (const [key, value] of Object.entries(corsHeaders)) {
          responseHeaders2.set(key, value);
        }
        responseHeaders2.set("Content-Type", "text/event-stream");
        return new Response(sseBody, {
          status: 200,
          headers: responseHeaders2
        });
      }
      const responseHeaders = new Headers(groqResponse.headers);
      responseHeaders.delete("content-encoding");
      responseHeaders.delete("content-length");
      responseHeaders.delete("transfer-encoding");
      for (const [key, value] of Object.entries(corsHeaders)) {
        responseHeaders.set(key, value);
      }
      return new Response(groqResponse.body, {
        status: groqResponse.status,
        headers: responseHeaders
      });
    } catch (e) {
      console.error("Error processing successful Groq response:", e);
      return new Response("Internal Server Error: Error processing AI response.", { status: 500, headers: corsHeaders });
    }
  }
};
export {
  src_default as default
};
//# sourceMappingURL=index.js.map
