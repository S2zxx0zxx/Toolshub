// js/config/suggestionPool.js
// Curated pool of agent suggestion prompts shown on the agent ready screen.
// Rotates randomly per session — no external API call, no failure modes.
// Phase 2: blend live trending topics from searchService.js (future opt-in).

export const SUGGESTION_POOL = [
  'Calculate 15% of 8500',
  'What is the weather in Mumbai right now?',
  'Write a LinkedIn post about productivity tips',
  'Write an Instagram caption for a travel photo',
  'Help me write a professional follow-up email',
  'Search the web: latest AI news today',
  'How much is 20% GST on ₹4500?',
  'Write a YouTube video description for a cooking tutorial',
  'What is the weather in Delhi today?',
  'Help me write a cover letter for a marketing job',
  'Write a Twitter thread about starting a business in India',
  'Search: top productivity apps 2025',
  'Calculate: compound interest on ₹50000 at 8% for 3 years',
  'Write a Facebook post announcing a product launch',
  'What is the weather in Bangalore?',
];

/**
 * Returns `count` randomly selected, non-repeating prompts from the pool.
 * @param {number} count
 * @returns {string[]}
 */
export function getSuggestionChips(count = 3) {
  const shuffled = [...SUGGESTION_POOL].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
}
