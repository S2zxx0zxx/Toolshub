import { callModelWithFallback } from './src/modelFallback.js';

// Mock fetch globally
globalThis.fetch = async (url, options) => {
  const body = JSON.parse(options.body);
  console.log(`[fetch] URL: ${url} | Model: ${body.model}`);
  return {
    ok: true,
    json: async () => ({ choices: [{ message: { content: "mocked" } }] }),
    headers: new Map(),
    status: 200,
    body: "mocked_stream"
  };
};

async function run() {
  const env = {
    GROQ_API_KEY: 'test',
    GITHUB_MODELS_TOKEN: 'test',
    AI: {
      run: async () => ({ response: "cloudflare_mock" })
    }
  };

  const personas = ['digilite', 'digipro', 'maya', 'mayaPro', 'intentClassifier', 'orchestratorAgent', 'coderAgent', 'opsAgent'];

  for (const persona of personas) {
    console.log(`\n--- Testing persona: ${persona} ---`);
    const payload = { messages: [{ role: 'user', content: 'hi' }] };
    try {
      const result = await callModelWithFallback('defaultModel', payload, env, 'free', persona);
      console.log(`Result OK: ${result.ok}, Served By: ${result.servedByModel}`);
    } catch (e) {
      console.error(`ERROR for ${persona}:`, e);
    }
  }
}

run();
