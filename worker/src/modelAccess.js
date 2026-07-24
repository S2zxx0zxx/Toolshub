// MUST stay in sync — model list + tier mapping is duplicated client and server side for enforcement.
export const MODEL_CATALOG_TIERS = {
  'digilite': 'free',
  'digipro': 'monthly',
  'maya': '6month',
  'mayaPro': 'yearly',
  'intentClassifier': 'free',
  // Keep legacy IDs for safety during rollout
  'llama-3.3-70b-versatile': 'free',
  'llama-3.1-8b-instant': 'free',     
  'gpt-4o-mini': '6month',
  'groq/compound': 'yearly',
  'groq/compound-mini': 'monthly'
};

export const MODEL_BACKUP_PAIRS = {
  digilite: { layer1: 'llama-3.3-70b-versatile', layer2: 'meta/Llama-3.3-70B-Instruct' },
  digipro:  { layer1: 'groq/compound-mini',       layer2: 'openai/gpt-5-mini' },
  maya:     { layer1: 'groq/compound',            layer2: 'deepseek/DeepSeek-V3-0324' },
  mayaPro:  { layer1: 'groq/compound',            layer2: 'openai/gpt-5-chat' },
  intentClassifier: { layer1: 'llama-3.1-8b-instant', layer2: 'microsoft/Phi-4-mini-instruct' }
};

export function rankOf(tier) {
  const ranks = { 'free': 0, 'monthly': 1, '6month': 2, 'yearly': 3 };
  return ranks[tier] || 0;
}

export const ENDPOINTS = {
  GITHUB_MODELS: 'https://models.github.ai/inference/chat/completions',
  GROQ: 'https://api.groq.com/openai/v1/chat/completions'
};
