import { callModelWithFallback } from '../modelFallback.js';

/**
 * Agent 3: The Deep Coder
 * Specializes in complex architecture, coding, and mathematical reasoning.
 */
export async function runCoderAgent(messages, env, userPlanId, payloadOpts) {
  // We use gpt-4o-mini (via GitHub Models) as the default reasoner since it handles complex logic well.
  const model = 'gpt-4o-mini';
  
  const systemPrompt = `You are Agent 3 (The Deep Coder) of the MAS.
Your role is to solve complex software engineering, architectural, and mathematical problems.
Before providing the final code or answer, you MUST think step-by-step.
Output your thought process inside <thought> ... </thought> tags, and then provide the final, highly optimized code block or solution.
Always consider edge cases, performance (Big O), and security vulnerabilities.`;

  // Prepend system prompt to the messages
  const newMessages = [
    { role: 'system', content: systemPrompt },
    ...messages.filter(m => m.role !== 'system')
  ];

  const payload = {
    ...payloadOpts,
    messages: newMessages,
    model: model
  };

  return await callModelWithFallback(model, payload, env, userPlanId);
}
