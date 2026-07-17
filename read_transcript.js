const fs = require('fs');
const path = require('path');
const p = 'C:/Users/SATYAM KUMAR/.gemini/antigravity-ide/brain/7e93ac60-2ce0-498a-9867-d39e2fb3175a/.system_generated/logs/transcript_full.jsonl';
try {
  const lines = fs.readFileSync(p, 'utf8').split('\n');
  const userInputs = lines.filter(l => l.includes('"type":"USER_INPUT"'));
  console.log(userInputs.slice(-10).join('\n'));
} catch (e) { console.log(e.message); }
