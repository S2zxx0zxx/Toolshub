import { FirebaseAdmin } from './firebaseAdmin.js';

const PLAN_MAX_STEPS = { free: 8, monthly: 12, '6month': 12, yearly: 12 };
const PLAN_DAILY_MESSAGE_LIMIT = { free: 15, monthly: Infinity, '6month': Infinity, yearly: Infinity };

/**
 * Resolves the caller's plan server-side from a Firebase ID token.
 * Returns { uid, planId, maxSteps, dailyLimit } — never trusts client-sent plan values.
 * Throws if the token is missing/invalid — caller must handle as 401.
 */
export async function resolvePlan(request, env) {
  const authHeader = request.headers.get('Authorization') || '';
  const idToken = authHeader.replace('Bearer ', '').trim();

  if (!idToken) {
    // Anonymous / unauthenticated caller = free tier, hard-capped.
    return { uid: null, planId: 'free', maxSteps: PLAN_MAX_STEPS.free, dailyLimit: PLAN_DAILY_MESSAGE_LIMIT.free };
  }

  const fbAdmin = new FirebaseAdmin(env.FIREBASE_SERVICE_ACCOUNT);
  const uid = await fbAdmin.verifyIdToken(idToken); // throws on invalid token

  const userDoc = await fbAdmin.getUserDoc(uid);
  const subscription = userDoc?.subscription;
  const now = Date.now();

  let planId = 'free';
  if (subscription && subscription.status === 'active' && subscription.expiresAt > now) {
    planId = subscription.planId || 'free';
  } else if (userDoc?.plan) {
    // Fallback to legacy top-level `plan` field written at signup.
    planId = userDoc.plan;
  }

  if (userDoc?.devAccessExpiresAt && userDoc.devAccessExpiresAt > now) {
    planId = 'yearly';
  }

  if (!PLAN_MAX_STEPS.hasOwnProperty(planId)) planId = 'free';

  return {
    uid,
    planId,
    maxSteps: PLAN_MAX_STEPS[planId],
    dailyLimit: PLAN_DAILY_MESSAGE_LIMIT[planId]
  };
}
