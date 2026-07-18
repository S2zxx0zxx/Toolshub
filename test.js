const API = 'https://toolshub-worker.theliquidlounge-co.workers.dev';

async function test() {
  console.log("Testing stream...");
  const res = await fetch(API, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model: 'llama-3.3-70b-versatile',
      messages: [{ role: 'user', content: 'Hi' }],
      stream: true
    })
  });
  console.log("Status:", res.status);
  
  const reader = res.body.getReader();
  const decoder = new TextDecoder();
  let text = '';
  
  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    const chunk = decoder.decode(value, { stream: true });
    console.log("CHUNK:", chunk);
    text += chunk;
  }
  console.log("DONE. Total length:", text.length);
}

test().catch(console.error);
