// MUST stay in sync — model list + tier mapping is duplicated client and server side for enforcement.
export const MODEL_CATALOG_TIERS = {
  'llama-3.3-70b-versatile': 'free',
  'llama-3.1-8b-instant': 'free',     // Used for internal intent classification — must be free-tier
  'gpt-4o-mini': '6month',
  'groq/compound': 'yearly',
  'groq/compound-mini': 'monthly'
};

export function rankOf(tier) {
  const ranks = { 'free': 0, 'monthly': 1, '6month': 2, 'yearly': 3 };
  return ranks[tier] || 0;
}

export const ENDPOINTS = {
  GITHUB_MODELS: 'https://models.github.ai/inference/chat/completions',
  GROQ: 'https://api.groq.com/openai/v1/chat/completions'
};
