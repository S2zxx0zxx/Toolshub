// js/config/planVocabulary.js
// Single source of truth for plan id ordering, shared by client gating logic.
// Keep in sync with worker/src/planResolver.js PLAN_MAX_STEPS keys.
// Vocabulary MUST match server — do not introduce aliases (starter/pro/max) here.

export const PLAN_RANK = {
  free:    0,
  monthly: 1,  // label: "Starter"
  '6month': 2, // label: "Pro"
  yearly:  3   // label: "Max"
};

/**
 * Returns the numeric rank of a plan id.
 * Unknown ids (e.g. old alias "starter") fall back to 0 (free).
 * @param {string} planId
 * @returns {number}
 */
export function rankOf(planId) {
  return PLAN_RANK[planId] ?? 0;
}
