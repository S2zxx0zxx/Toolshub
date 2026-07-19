const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const { chunkText } = require('./chunker');

// 1. Load .env manually to avoid heavy frameworks / dependencies
function loadEnv() {
  try {
    const envPath = path.resolve(process.cwd(), '.env');
    const envContent = fs.readFileSync(envPath, 'utf-8');
    envContent.split('\n').forEach(line => {
      const match = line.match(/^\s*([\w.-]+)\s*=\s*(.*)?\s*$/);
      if (match) {
        process.env[match[1]] = match[2].replace(/(^['"]|['"]$)/g, ''); // remove quotes if any
      }
    });
  } catch (e) {
    // .env might not exist, ignore
  }
}
loadEnv();

const WORKER_URL = process.env.WORKER_URL;
const IS_DRY_RUN = process.argv.includes('--dry-run');

const DATA_FILE = path.resolve(process.cwd(), 'data/knowledge-base.json');
const CACHE_FILE = path.resolve(process.cwd(), 'data/.ingest-cache.json');

function getSha256(text) {
  return crypto.createHash('sha256').update(text).digest('hex');
}

const sleep = (ms) => new Promise(r => setTimeout(r, ms));

async function fetchWithRetry(url, options, maxRetries = 3) {
  const delays = [500, 1000, 2000];
  for (let i = 0; i < maxRetries; i++) {
    try {
      const res = await fetch(url, options);
      if (!res.ok) {
        throw new Error(`HTTP ${res.status}`);
      }
      return await res.json();
    } catch (e) {
      if (i === maxRetries - 1) throw e;
      await sleep(delays[i]);
    }
  }
}

async function runIngest() {
  console.log(`Starting RAG Ingestion Pipeline ${IS_DRY_RUN ? '[DRY RUN MODE]' : ''}`);

  if (!IS_DRY_RUN && !WORKER_URL) {
    console.error("❌ ERROR: WORKER_URL environment variable is missing.");
    process.exit(1);
  }

  // Read data
  let rawData = [];
  try {
    rawData = JSON.parse(fs.readFileSync(DATA_FILE, 'utf-8'));
  } catch (e) {
    console.error(`❌ ERROR: Could not read ${DATA_FILE}.`, e.message);
    process.exit(1);
  }

  // Read cache
  let cache = {};
  try {
    cache = JSON.parse(fs.readFileSync(CACHE_FILE, 'utf-8'));
  } catch (e) {
    // Cache doesn't exist, which is fine
  }

  // Chunking
  const allChunks = [];
  for (const entry of rawData) {
    const chunks = chunkText(entry);
    allChunks.push(...chunks);
  }

  let successCount = 0;
  let skipCount = 0;
  let failCount = 0;

  for (let i = 0; i < allChunks.length; i++) {
    const chunk = allChunks[i];
    const hash = getSha256(chunk.text);
    
    if (cache[chunk.id] === hash) {
      skipCount++;
      console.log(`[${i + 1}/${allChunks.length}] ⏭️  Skipping "${chunk.id}" (Unchanged)`);
      continue;
    }

    if (IS_DRY_RUN) {
      successCount++;
      console.log(`[${i + 1}/${allChunks.length}] 🔍 Dry-run: Would ingest "${chunk.id}" (${chunk.text.length} chars)`);
      continue;
    }

    try {
      await fetchWithRetry(WORKER_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'rag_ingest',
          text: chunk.text,
          metadata: {
            id: chunk.id,
            category: chunk.category,
            ...(chunk.keywords && { keywords: chunk.keywords })
          }
        })
      });

      cache[chunk.id] = hash;
      successCount++;
      console.log(`[${i + 1}/${allChunks.length}] ✅ Ingested "${chunk.id}"`);
    } catch (e) {
      failCount++;
      console.log(`[${i + 1}/${allChunks.length}] ❌ Failed "${chunk.id}" (${e.message})`);
    }

    // Rate limiting: 250ms between requests
    await sleep(250);
  }

  if (!IS_DRY_RUN) {
    fs.writeFileSync(CACHE_FILE, JSON.stringify(cache, null, 2));
  }

  console.log("\n--- INGESTION SUMMARY ---");
  console.log(`Total Chunks Processed: ${allChunks.length}`);
  console.log(`✅ Successfully Ingested: ${successCount}`);
  console.log(`⏭️  Skipped (Duplicates)  : ${skipCount}`);
  console.log(`❌ Failed              : ${failCount}`);
}

runIngest();
