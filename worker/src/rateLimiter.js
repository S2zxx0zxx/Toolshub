// Simple rate limiter implementation using Map is NOT fully reliable across Cloudflare edge nodes,
// but works as a basic deterrent within a single isolate if KV is not bound.
const ipRateLimits = new Map();
const RATE_LIMIT_WINDOW_MS = 60000;
const MAX_REQUESTS_PER_WINDOW = 30;

function checkRateLimitMap(ip) {
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
const PAYMENT_MAX_REQUESTS_PER_WINDOW = 20;

function checkPaymentRateLimitMap(ip) {
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

export async function checkRateLimit(ip, env) {
  if (!env.RATE_LIMIT_KV) {
    console.warn("RATE_LIMIT_KV is not bound. Falling back to in-memory Map rate limiter.");
    return checkRateLimitMap(ip);
  }

  // Soft rate limit: Cloudflare KV is eventually consistent.
  // Under high concurrent load from the same IP, some requests might slip through the limit,
  // which is an acceptable tradeoff for a durable, shared rate limiter on the free tier.
  const key = `ratelimit:${ip}`;
  
  // KV .get() returns a string. Parse as integer or default to 0.
  const currentCountStr = await env.RATE_LIMIT_KV.get(key);
  const currentCount = currentCountStr ? parseInt(currentCountStr, 10) : 0;
  
  if (currentCount >= MAX_REQUESTS_PER_WINDOW) {
    return false;
  }
  
  await env.RATE_LIMIT_KV.put(key, (currentCount + 1).toString(), { expirationTtl: 60 });
  return true;
}

export async function checkPaymentRateLimit(ip, env) {
  if (!env.RATE_LIMIT_KV) {
    console.warn("RATE_LIMIT_KV is not bound. Falling back to in-memory Map payment rate limiter.");
    return checkPaymentRateLimitMap(ip);
  }

  const key = `ratelimit:payment:${ip}`;
  
  const currentCountStr = await env.RATE_LIMIT_KV.get(key);
  const currentCount = currentCountStr ? parseInt(currentCountStr, 10) : 0;
  
  if (currentCount >= PAYMENT_MAX_REQUESTS_PER_WINDOW) {
    return false;
  }
  
  await env.RATE_LIMIT_KV.put(key, (currentCount + 1).toString(), { expirationTtl: 60 });
  return true;
}
