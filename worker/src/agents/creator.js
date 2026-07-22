/**
 * Agent 4: The Visual Creator
 * Generates images natively using Cloudflare Workers AI (Stable Diffusion).
 */

function uint8ArrayToBase64(uint8Array) {
  let binary = '';
  let len = uint8Array.byteLength;
  for (let i = 0; i < len; i++) {
    binary += String.fromCharCode(uint8Array[i]);
  }
  return btoa(binary);
}

export async function runCreatorAgent(messages, env) {
  // Extract the latest user prompt
  const userMessage = messages.filter(m => m.role === 'user').pop()?.content || '';

  // Cloudflare Workers AI Stable Diffusion model
  const modelId = '@cf/stabilityai/stable-diffusion-xl-base-1.0';

  try {
    const response = await env.AI.run(modelId, {
      prompt: userMessage
    });
    
    // Cloudflare AI text-to-image returns a Uint8Array representation of a PNG
    const base64String = uint8ArrayToBase64(new Uint8Array(response));
    
    // Construct markdown that the frontend will natively parse into an image
    const markdownImage = `Here is your generated image:\n\n![Generated Image](data:image/png;base64,${base64String})`;
    
    // Wrap it in a single synthetic Server-Sent Event (SSE) chunk so the frontend streaming parser doesn't break
    const chunk = JSON.stringify({
      choices: [{ delta: { content: markdownImage } }]
    });
    const sseBody = `data: ${chunk}\n\ndata: [DONE]\n\n`;

    return new Response(sseBody, {
      status: 200,
      headers: { "content-type": "text/event-stream" }
    });
  } catch (e) {
    console.error("Creator Agent Failed:", e);
    const chunk = JSON.stringify({
      choices: [{ delta: { content: "> ⚠️ **Agent 4 Failed:** Unable to generate image. " + e.message } }]
    });
    const sseBody = `data: ${chunk}\n\ndata: [DONE]\n\n`;
    
    return new Response(sseBody, {
      status: 200, 
      headers: { "content-type": "text/event-stream" }
    });
  }
}
