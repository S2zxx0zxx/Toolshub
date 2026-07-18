var __defProp = Object.defineProperty;
var __name = (target, value) => __defProp(target, "name", { value, configurable: true });

// src/index.js
var corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  // Adjust to specific origins in production if needed
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
    const { messages, model, temperature, stream, response_format } = body;
    if (!messages || !Array.isArray(messages)) {
      return new Response('Bad Request: Missing or invalid "messages" array.', { status: 400, headers: corsHeaders });
    }
    let targetModel = model;
    if (targetModel === "llama-3.3-70b-versatile" || targetModel === "llama-3.1-70b-versatile" || !targetModel) {
      targetModel = "llama3-70b-8192";
    }
    if (targetModel === "llama-3.1-8b-instant") {
      targetModel = "llama3-8b-8192";
    }
    const payload = {
      model: targetModel,
      messages,
      temperature: typeof temperature === "number" ? temperature : 0.7,
      stream: !!stream
    };
    if (response_format) {
      payload.response_format = response_format;
    }
    const apiKey = env.GROQ_API_KEY;
    if (!apiKey) {
      return new Response("Internal Server Error: GROQ_API_KEY secret is not set.", { status: 500, headers: corsHeaders });
    }
    try {
      const groqResponse = await fetch("https://api.groq.com/openai/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${apiKey}`,
          "Accept-Encoding": "identity"
        },
        body: JSON.stringify(payload)
      });
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
      console.error("Fetch error to AI Provider:", e);
      return new Response("Internal Server Error: Unable to connect to AI provider.", { status: 500, headers: corsHeaders });
    }
  }
};
export {
  src_default as default
};
//# sourceMappingURL=index.js.map
