# ToolsHub: The Ultimate Developer & AI Agent Codex

> **MISSION DIRECTIVE:** This document is the ultimate source of truth for ToolsHub. It is specifically engineered to be ingested by AI agents and Senior Engineers. By reading this file, an AI must perfectly understand the entire architectural state, security boundaries, component responsibilities, data flows, and future roadmap without needing to scan individual source files. **Read carefully before executing any code changes.**

---

## 🛑 1. Core Architectural Laws (Zero Compromise)

ToolsHub operates on a strictly decoupled **Frontend (Vanilla JS SPA) + Edge Backend (Cloudflare Workers)** model. If you break these laws, you break the system.

1. **NO FRONTEND API KEYS:** The frontend (`/js/*`, `index.html`) is public. Never hardcode, fetch, or store provider API keys (Groq, Tavily, etc.) in the frontend source code. 
2. **EDGE PROXY MANDATE:** All LLM and 3rd-party tool requests **must** route through the Cloudflare Worker (`/worker/src/index.js`). The worker holds the secrets (`env.GROQ_API_KEY`, `env.TAVILY_API_KEY`) and securely forwards the requests.
3. **CORS FAIL-CLOSED:** The worker must enforce strict CORS. Currently set to wildcard `*` as a fail-safe, but production deployments must strictly allowlist `https://s2zxx0zxx.github.io`, `http://localhost:5000`, etc.
4. **STREAMING BY DEFAULT:** ToolsHub is built for real-time UX. All LLM responses stream natively from Groq → Cloudflare Worker (passthrough) → Frontend (`chatEngine.js`), parsing markdown on the fly.
5. **VANILLA JS MODULARITY:** No React, No Vue. The frontend uses ES6 Modules (IIFE Pattern) for state encapsulation. Do not introduce massive frontend frameworks.

---

## 🧠 2. Deep Dive: Component Topology & File Manifest

### Frontend Application (`/js/`)
The frontend uses the Immediately Invoked Function Expression (IIFE) pattern to create pseudo-classes and singletons.

#### A. Core & Bootstrap (`js/core/`)
- **`app.js`**: The main entry point. Binds UI event listeners (Sidebar, Settings, API Key Modals). It initializes the application state, checks local storage for user preferences, and handles the "Demo Mode" toggle. 
  - *Note:* The API Keys UI is currently disabled/hidden ("Coming soon" toast) to enforce backend-only key management for normal users.

#### B. AI & Routing (`js/ai/`)
- **`intent.js`**: The Brain. Takes user input and decides if a tool is needed. 
  - **Phase 1 (Regex):** Ultra-fast regex matching for calculator, weather, and general greetings. 
  - **Phase 2 (LLM Fallback):** If Regex fails, it builds a specific JSON-mode prompt and sends it to Groq to classify the intent. Protected by a `Promise.race` 4-second timeout. If it stalls, it defaults to `general_chat`.
- **`router.js`**: Orchestrates the flow. Once `intent.js` decides the action, `router.js` invokes the specific tool (e.g., `SearchService`) or routes to the standard chat completion pipeline.
- **`prompt.js`**: Manages the System Prompt. Injects dynamic context (current time, date, user preferences) before sending to the LLM.

#### C. Tool Implementations (`js/services/tools/` & `js/tools/`)
- **`registry.js`**: The central dictionary of available tools. Defines metadata (ID, title, icon, schema).
- **`searchService.js`**: Executes Web Searches. It POSTs `{ type: 'search', query: '...' }` to the Cloudflare Worker. It maps the Tavily API response into a standardized format for the LLM to read.

#### D. State & Storage (`js/services/`)
- **`cloudDb.js`**: Handles Firebase Firestore integration. Saves chat histories, messages, and tracks token usage. Detects if the user is a guest (LocalStorage fallback) or authenticated.
- **`localSettings.js`**: Manages local browser state (Active Chat ID, Theme, Guest history).
- **`aiApi.js`**: The HTTP client connecting the frontend to the Cloudflare Worker. Handles both JSON endpoints (for intent) and EventStream readers (for live typing).

#### E. View Layer (`js/ui/`)
- **`chatEngine.js`**: The heaviest frontend component. Manages the message DOM, auto-scrolling, Markdown parsing (via `marked.js` and `DOMPurify`), and renders the "fake typewriter" effect while consuming the EventStream from `aiApi.js`.
- **`sidebar.js`**: Renders chat history, handles grouping (Today, Last 7 Days), and allows switching between conversations.

### Edge Backend (`/worker/`)
- **`src/index.js`**: A singular Cloudflare Worker script.
  - **Rate Limiting:** Basic in-memory Map to throttle IPs (30 requests/min).
  - **Preflight & CORS:** Intercepts `OPTIONS` requests.
  - **Tool Proxying:** Branches logic. If `body.type === 'search'`, it calls Tavily using `env.TAVILY_API_KEY`. Returns JSON.
  - **Groq Proxying:** If normal chat payload, it validates the model, patches deprecated models (e.g., forces `llama3-70b-8192` to `llama-3.3-70b-versatile`), injects `env.GROQ_API_KEY`, and pipes the Groq API response directly back to the client.

---

## 🔄 3. Exact Data Flow: "A Message's Journey"

When a user types "What is the weather in London?" and hits enter:
1. **Input:** `chatEngine.js` captures the text, saves the user message to Firestore (`cloudDb.js`), and calls `AIRouter.processInput()`.
2. **Intent Detection:** `router.js` passes the text to `intent.js`. 
   - `intent.js` matches the regex `/weather in ([a-zA-Z\s]+)/`.
   - Returns `{ intent: 'weather', parameters: { city: 'London' } }`.
3. **Tool Execution:** `router.js` sees the `weather` intent, invokes the weather tool (simulated or proxy API), and gets the result (e.g., "22°C, Rainy").
4. **Context Injection:** `router.js` builds a new hidden prompt: *"The user asked about weather. The tool returned: 22°C, Rainy. Answer the user."*
5. **LLM Call:** `aiApi.js` sends this prompt to the Cloudflare Worker (`worker/src/index.js`).
6. **Worker Proxy:** The worker attaches `env.GROQ_API_KEY` and forwards the stream request to `api.groq.com`.
7. **Streaming Response:** The worker streams chunks back. `chatEngine.js` reads the chunks, sanitizes with `DOMPurify`, parses with `marked.js`, and injects into the DOM in real-time.

---

## 🔮 4. Future Roadmap & "Smart Work" Plans (For AI Agents)

If you are an AI tasked with upgrading this system, here is the immediate strategic roadmap. **Do not reinvent the wheel; build upon these established pillars.**

### A. Advanced Agentic Workflows (Multi-Turn Tooling)
- **Current State:** Single-turn routing (Regex/LLM -> Tool -> Final Answer).
- **Future Plan:** Implement ReAct (Reasoning and Acting). Update `intent.js` to allow the LLM to return `tool_calls` iteratively. The frontend should execute the tool, append the result to `messages`, and recursively call the worker until the LLM says `status: "complete"`.

### B. Vector Database & RAG (Retrieval-Augmented Generation)
- **Future Plan:** Integrate Pinecone or Cloudflare Vectorize. 
- **Implementation:** Add a new branch in the Worker (`body.type === 'rag_query'`). The worker will embed the user's query, search the Vector DB, and return relevant document snippets to the frontend. `prompt.js` will inject these snippets into the system context.

### C. Authentication & Multi-Tenancy Lockdown
- **Current State:** Firebase Auth exists but backend worker rate-limiting relies on IPs.
- **Future Plan:** Pass the Firebase ID Token (`user.getIdToken()`) in the `Authorization: Bearer` header from `aiApi.js`. The Cloudflare Worker must verify this JWT using Firebase Admin SDK (or lightweight JWKS validation) before allowing the Groq proxy request, preventing unauthorized public abuse of the API keys.

### D. File Uploads & Vision
- **Future Plan:** Groq supports LLaVA/Vision models.
- **Implementation:** Update `chatEngine.js` to accept Image inputs (Base64). Pass them through `aiApi.js` to the worker. Ensure the worker payload parser handles `image_url` content blocks and routes to a Vision-capable model (`llama-3.2-11b-vision-preview`).

---

## 🛡 5. Security Hardening & Fallback Providers

ToolsHub implements automatic zero-frontend-change fallback mechanisms to ensure high availability when primary AI providers fail.

### GitHub Models Fallback
If the primary Groq API fails (network error, timeout, or non-2xx status), the Cloudflare Worker can automatically failover to GitHub Models.
- **Supported Models**: Currently only maps `llama-3.3-70b-versatile` to `Llama-3.3-70B-Instruct` (and `gpt-4o-mini` as a secondary fallback). Other models degrade gracefully and return the original error.
- **Required Secret**: A new Cloudflare secret `GITHUB_MODELS_TOKEN` is required for the fallback to activate. Generate this via a GitHub Personal Access Token with `Models: read` permission, or a GitHub Models playground token.
- **Command to set**: 
  ```bash
  npx wrangler secret put GITHUB_MODELS_TOKEN
  ```
- **Graceful Degradation**: If this secret is missing or not configured, the fallback is safely skipped and the app continues to work exactly as it does today (Groq-only, no fallback). This is a purely additive, non-breaking dependency.

---

## 🛠 6. Deployment Playbook

If a deployment is requested, execute exactly this sequence:

**1. Syntax & Sanity Check:**
```bash
node -c worker/src/index.js
node -c js/core/app.js
node -c js/ai/intent.js
```

**2. Backend Deployment:**
```bash
cd worker
# Ensure keys are set if new environment:
# npx wrangler secret put GROQ_API_KEY
# npx wrangler secret put TAVILY_API_KEY
npx wrangler deploy
```

**3. Frontend Deployment:**
```bash
# To GitHub Pages (Push to main)
git add .
git commit -m "deploy: update frontend"
git push origin main

# To Firebase Hosting
firebase deploy --only hosting
```

---
*End of Codex. You are now initialized with absolute knowledge of ToolsHub.*
