import { callModelWithFallback } from '../modelFallback.js';

/**
 * Agent 1: The Orchestrator
 * Evaluates the user's input and decides which agent should handle the request.
 * Returns a JSON object with the target agent.
 */
export async function routeRequest(messages, env, userPlanId) {
  // Extract the latest user message
  const userMessage = messages.filter(m => m.role === 'user').pop()?.content || '';

  // Extremely fast, lightweight model for orchestration to minimize latency
  const orchestratorModel = 'llama-3.1-8b-instant';

  const systemPrompt = `You are Agent 1 (The Orchestrator) of a Multi-Agent System.
Your job is to analyze the user's latest input and route it to the appropriate specialist agent.
You must return a raw JSON object and nothing else.

Available Agents:
- "chat": For general conversation, questions, standard coding help, or greetings.
- "coder": For extremely complex architecture, deep reasoning, or math problems.
- "creator": For generating visual content, images, UI mockups, or pictures.

Evaluate the following user message and return:
{"target": "<agent_name>", "reason": "<brief_reason>"}
`;

  const payload = {
    messages: [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: userMessage }
    ],
    temperature: 0.1,
    max_tokens: 100,
    response_format: { type: "json_object" }
  };

  try {
    const result = await callModelWithFallback(orchestratorModel, payload, env, userPlanId, 'orchestratorAgent');
    if (!result.ok) {
      throw new Error("Orchestrator failed to decide.");
    }
    
    // Read the JSON response from the orchestration call
    // Since stream is false, we can read the JSON response body
    const bodyText = await result.response.text();
    const body = JSON.parse(bodyText);
    const orchestratorDecision = JSON.parse(body.choices[0].message.content);
    
    return orchestratorDecision.target || 'chat';
  } catch (e) {
    console.warn("Orchestration failed, defaulting to 'chat':", e.message);
    return 'chat'; // Failsafe
  }
}
