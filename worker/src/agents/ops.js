import { callModelWithFallback } from '../modelFallback.js';
import { FirebaseAdmin } from '../firebaseAdmin.js';

/**
 * Agent 2: The Backend Ops Maintainer
 * Analyzes system health, usage stats, and error rates.
 */
export async function runOpsAgent(env) {
  // We use a fast and analytical model
  const model = 'llama-3.1-8b-instant';
  
  // Gather usage stats from Firestore
  let statsText = "Usage Stats:\n";
  try {
    if (env.FIREBASE_SERVICE_ACCOUNT) {
      const fbAdmin = new FirebaseAdmin(env.FIREBASE_SERVICE_ACCOUNT);
      const today = new Date().toISOString().split('T')[0];
      const statsDoc = await fbAdmin.getDocument(`dailyUsageStats/${today}`);
      if (statsDoc) {
        statsText += JSON.stringify(statsDoc, null, 2);
      } else {
        statsText += "No stats for today yet.";
      }
    }
  } catch (e) {
    statsText += `Failed to fetch stats: ${e.message}`;
  }

  const systemPrompt = `You are Agent 2 (The Ops Maintainer) of the MAS.
Your role is to analyze the daily system metrics and provide a brief, actionable health report for the engineering team.
Look for any anomalies like unusually high rate limits hit, heavy usage of fallback models, or missing metrics.
Keep the report concise, use bullet points, and highlight critical warnings if any.`;

  const userMessage = `Here is the current system data:\n\n${statsText}\n\nPlease generate the health report.`;

  const payload = {
    messages: [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: userMessage }
    ],
    temperature: 0.1,
    max_tokens: 500,
    stream: false
  };

  const result = await callModelWithFallback(model, payload, env, 'yearly', 'opsAgent'); // Treat internal Ops as highest tier
  
  if (result.ok) {
    const data = await result.response.json();
    return data.choices?.[0]?.message?.content || "No report generated.";
  } else {
    return "Ops Agent failed to generate report. Reason: " + (result.error?.message || "Unknown error");
  }
}
