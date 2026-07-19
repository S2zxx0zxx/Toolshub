# ToolsHub RAG Ingestion Pipeline

This directory contains the scripts for intelligently chunking and ingesting knowledge base documents into Cloudflare Vectorize via the ToolsHub Edge Proxy.

## 1. Environment Setup
Before running the ingestion pipeline, you must configure the backend API endpoint.
1. Copy `.env.example` to `.env` in the root of the project.
2. Edit `.env` and set `WORKER_URL` to your deployed Cloudflare Worker URL.
   ```env
   WORKER_URL=https://toolshub-api-worker.<your-subdomain>.workers.dev
   ```

## 2. Data Format
Place your knowledge data in `data/knowledge-base.json`. The file must contain a JSON array of objects with the following schema:
```json
[
  {
    "id": "unique-slug-1",
    "category": "services",
    "text": "The full text content goes here..."
  }
]
```
Valid categories typically include `"services"`, `"pricing"`, `"faq"`, and `"general"`.

## 3. How Chunking Works
If a single entry's `text` exceeds 500 words, `scripts/chunker.js` will automatically split it at natural paragraph boundaries (or sentences if paragraphs are too large). The resulting chunks will be ingested with suffixed IDs (e.g., `unique-slug-1-chunk-1`). Short entries (like FAQs) are preserved as a single chunk.

## 4. Cache & Duplicate Detection
To prevent flooding the Vector Database and unnecessarily consuming AI embeddings on unchanged text, the script maintains a cache in `data/.ingest-cache.json`.
- The script computes a SHA-256 hash of each chunk's text.
- If the hash already exists in `.ingest-cache.json`, the chunk is skipped.
- **Force Re-ingest:** If you want to force re-ingestion of an entry (even if the text hasn't changed), simply open `data/.ingest-cache.json`, delete the specific entry's ID key, and re-run the script.

## 5. Execution

### Dry-Run Mode (Preview)
Always preview your changes before firing requests to the Cloudflare Worker. This mode validates the data, chunks the text, and checks the cache without making any HTTP requests.
```bash
npm run ingest:dry
```

### Live Ingestion
Run the actual pipeline. This will read the data, skip duplicates, send rate-limited (250ms) POST requests to the worker, and automatically retry on transient network failures.
```bash
npm run ingest
```
