# 🌌 ToolsHub: Architectural Codex v5.0 (Audit-Hardened)

> **MISSION DIRECTIVE:** This document is the ultimate source of truth for ToolsHub. It is specifically engineered to be ingested by AI agents and Senior Engineers. By reading this file, an AI must perfectly understand the entire architectural state, security boundaries, component responsibilities, data flows, and future roadmap without needing to scan individual source files. **Read carefully before executing any code changes.**

![Architecture Version](https://img.shields.io/badge/Architecture-v5.0-6c63ff?style=flat-square)
![Status](https://img.shields.io/badge/Status-Production_Ready-34a853?style=flat-square)
![Frontend](https://img.shields.io/badge/Frontend-Vanilla_JS_SPA-fbbc05?style=flat-square)
![Backend](https://img.shields.io/badge/Backend-Cloudflare_Workers-f38020?style=flat-square)
![Database](https://img.shields.io/badge/Database-Firebase_Firestore-ffca28?style=flat-square)

---

## 🛑 1. Core Architectural Laws (Zero Compromise)

ToolsHub operates on a strictly decoupled **Frontend (Vanilla HTML/CSS/JS SPA) + Edge Backend (Cloudflare Workers) + Database (Firebase Firestore)** model.

1. **NO FRONTEND API KEYS:** The frontend (`/js/*`, `index.html`) is public. Never hardcode, fetch, or store provider API keys (Groq, Tavily, Sentry DSNs etc.) in the frontend source code.
2. **EDGE PROXY MANDATE:** All LLM and 3rd-party tool requests **must** route through the Cloudflare Worker (`/worker/src/index.js`). The worker holds the secrets (`env.GROQ_API_KEY`, `env.TAVILY_API_KEY`) and securely forwards the requests.
3. **ATOMIC DATA MUTATION:** All aggregate usage metrics and counts must be updated via Firestore's atomic `increment()` via the Worker's Admin SDK to prevent race conditions.
4. **STREAMING BY DEFAULT:** All LLM responses stream natively from Groq → Cloudflare Worker (passthrough) → Frontend (`chatEngine.js`), parsing markdown on the fly.
5. **VANILLA JS MODULARITY:** No React, No Vue. The frontend uses ES6 Modules (IIFE Pattern) for state encapsulation.
6. **SINGLE-SOURCE CONFIG:** The Cloudflare Worker URL lives **only** in `js/config/api.js`. Never hardcode it in individual service files.
7. **USAGE TRACKING IS SERVER-ONLY:** Client-side code must never attempt to write to `users/{uid}/usage/*` in Firestore. Those paths are `allow write: if false` by design. The worker's `usageTracker.js` (Firebase Admin SDK) is the sole writer.

---

## 🏗️ 2. High-Level System Architecture (Wireframe Topology)

```mermaid
graph TD
    %% ==========================================
    %% 🖥️ CLIENT-SIDE: VANILLA JS SPA ARCHITECTURE
    %% ==========================================
    subgraph Client_Tier [📱 Layer 1: Client Browser & UI]
        direction TB

        subgraph UI_Components [Dom & Rendering]
            ChatDOM[💬 Chat DOM & Markdown]
            Sidebar[🗂️ Sidebar & History]
            Overlays[⚙️ Modals & Controls]
        end

        subgraph Core_Engines [Client-Side Logic]
            AppCore{app.js - State Manager}
            ChatEngine((chatEngine.js))
            Router((router.js))
        end

        subgraph Services [Local Services & API]
            AuthClient[🔐 auth.js]
            CloudDB[☁️ cloudDb.js]
            Settings[⚙️ localSettings.js]
            ApiConfig[🔗 config/api.js]
        end

        subgraph AI_Intelligence [AI / Agent Pre-Processing]
            IntentEngine[🧠 intent.js]
            AgentEngine[🤖 agentEngine.js]
            ToolReg[🛠️ registry.js]
            ToolSchemas[📋 toolSchemas.js]
        end

        subgraph Exclusive_AI [✨ Exclusive AI Subsystem]
            MasterTool[🧬 masterTool.js]
            ModelDecision[🎯 modelDecisionEngine.js]
            Synthesizer[⚗️ synthesizer.js]
        end

        SentryFE((🐞 Sentry SDK))

        %% Internal Wiring Client
        AppCore --> UI_Components
        UI_Components --> ChatEngine
        ChatEngine <--> Router
        Router --> IntentEngine
        IntentEngine --> ToolReg
        AgentEngine --> ToolReg
        AppCore --> AuthClient
        AuthClient --> CloudDB
        MasterTool --> ModelDecision
        MasterTool --> Synthesizer
        ApiConfig -.-> ChatEngine
        ApiConfig -.-> AgentEngine
    end

    %% ==========================================
    %% ⚡ EDGE-SIDE: CLOUDFLARE WORKERS + AGENTS
    %% ==========================================
    subgraph Edge_Tier [⚡ Layer 2: Cloudflare Edge Network]
        direction TB

        subgraph Security_Perimeter [WAF & Security]
            CF_WAF{Cloudflare WAF}
            RateLimit[(KV: RATE_LIMIT_KV)]
        end

        subgraph Worker_Core [/worker/src/index.js/]
            ReqRouter{API Router}
            AuthVerifier[JWT Verifier]
            UsageMiddleware[Quota & Plan Check]
            ModelAccess[Tier Enforcer]
            ModeGate{Mode Gate}
        end

        subgraph Multi_Agent [Multi-Agent Orchestration]
            Orchestrator[🎼 orchestrator.js]
            CoderAgent[👨‍💻 coder.js]
            CreatorAgent[🎨 creator.js]
            OpsAgent[🔧 ops.js]
        end

        subgraph AI_Routing [Model Fallback Engine]
            PrimaryCircuit[groq/llama-3.3-70b]
            SecondaryCircuit[groq/llama-3.1-8b]
            FailsafeCircuit[github/gpt-4o-mini]
        end

        SentryBE((🐞 Sentry Backend))

        %% Internal Wiring Edge
        CF_WAF --> ReqRouter
        ReqRouter --> RateLimit
        ReqRouter --> AuthVerifier
        AuthVerifier --> UsageMiddleware
        UsageMiddleware --> ModelAccess
        ModelAccess --> ModeGate
        ModeGate -->|mode=agent or classify| PrimaryCircuit
        ModeGate -->|mode=chat| Orchestrator
        Orchestrator -->|route=creator| CreatorAgent
        Orchestrator -->|route=coder| CoderAgent
        ModelAccess --> PrimaryCircuit
        ModelAccess -.->|429 / 503 Fallback| SecondaryCircuit
        SecondaryCircuit -.->|Critical Failover| FailsafeCircuit
    end

    %% ==========================================
    %% 🗄️ DATABASE & STORAGE: FIREBASE
    %% ==========================================
    subgraph Data_Tier [🗄️ Layer 3: Firebase Cloud]
        direction LR

        subgraph Auth_Identity [Identity]
            FB_Auth[Google Auth / Email]
        end

        subgraph Firestore_Nodes [NoSQL Collections]
            UsersCol[(users/{uid})]
            UsageCol[(users/{uid}/usage — ADMIN WRITE ONLY)]
            ConvCol[(users/{uid}/conversations)]
            GlobalStats[(dailyUsageStats)]
        end

        %% Internal Data Wiring
        FB_Auth --> UsersCol
        UsersCol --> UsageCol
        UsersCol --> ConvCol
    end

    %% ==========================================
    %% 🌐 EXTERNAL PROVIDERS & MONITORING
    %% ==========================================
    subgraph External_Tier [🌐 Layer 4: Third-Party APIs]
        GroqAPI[⚡ Groq Inference]
        GithubAPI[🐙 GitHub Models API]
        TavilyAPI[🔍 Tavily Search API]
        Razorpay[💸 Razorpay Gateway]
    end

    subgraph Monitor_Tier [🩺 Reliability]
        UptimeRobot((UptimeRobot))
    end

    %% ==========================================
    %% 🔗 INTER-LAYER CONNECTIONS (THE WIRING)
    %% ==========================================

    %% Client to Edge
    Router ==>|REST /chat payload| CF_WAF
    AgentEngine ==>|Tool Execution| CF_WAF
    CloudDB <==>|Firebase SDK| Firestore_Nodes
    SentryFE -.-> |Exception Data| External_Tier
    SentryBE -.-> |Exception Data| External_Tier

    %% Edge to DB
    AuthVerifier <==>|Admin SDK Token Check| FB_Auth
    UsageMiddleware ==>|Atomic Increment| UsageCol
    ReqRouter ==>|Background Task| GlobalStats

    %% Edge to APIs
    PrimaryCircuit ==>|Streaming HTTP| GroqAPI
    SecondaryCircuit ==>|Streaming HTTP| GroqAPI
    FailsafeCircuit ==>|Streaming HTTP| GithubAPI
    ReqRouter ==>|Search Query| TavilyAPI

    %% External to Client
    Razorpay -.-> |Webhook/Client-side| AppCore

    %% Monitoring
    UptimeRobot -.->|Pings /api/health| CF_WAF

    %% Styling
    classDef client fill:#1e1e24,stroke:#3b82f6,stroke-width:2px,color:#fff;
    classDef edge fill:#1e1e24,stroke:#f59e0b,stroke-width:2px,color:#fff;
    classDef data fill:#1e1e24,stroke:#10b981,stroke-width:2px,color:#fff;
    classDef external fill:#1e1e24,stroke:#ec4899,stroke-width:2px,color:#fff;

    class UI_Components,Core_Engines,Services,AI_Intelligence,Exclusive_AI client;
    class Security_Perimeter,Worker_Core,Multi_Agent,AI_Routing edge;
    class Auth_Identity,Firestore_Nodes data;
    class External_Tier,Monitor_Tier external;
```

---

## 🧩 3. Component Deep Dive: The 3D Matrix

### 🖥️ Layer 1: Frontend Application (`/js/`)
The frontend uses the Immediately Invoked Function Expression (IIFE) pattern to create pseudo-classes and singletons.

| Component | Path | Responsibility |
| :--- | :--- | :--- |
| **App Core** | `js/core/app.js` | Bootstrap, event listeners, Auth overlays, `hideAppLoaders()` teardown helper. |
| **API Config** | `js/config/api.js` *(new)* | **Single source of truth** for the worker URL (`API_ENDPOINT`). All service files import from here. |
| **AI Router** | `js/ai/router.js` | Directs inputs to Tools (Search, Calculator) vs Chat vs Agents. |
| **Intent Engine** | `js/ai/intent.js` | Regex & LLM-backed fast intent categorization (with Hinglish support). Uses `chatCompletionJson` with `mode:'classify'`. |
| **Tool Schemas** | `js/ai/toolSchemas.js` | Canonical OpenAI-format tool schemas for `getAllToolSchemas()` and `getToolCategoryMap()`. Includes GitHub connector tools. |
| **Chat View** | `js/ui/chatEngine.js` | DOM mutation, auto-scroll, Markdown parsing (`marked.js`), typewriter stream rendering. |
| **Personas** | `js/ui/personaPicker.js` | Filters available tools/categories based on selected user roles. |
| **Cloud DB** | `js/services/cloudDb.js` | Firebase queries (chat history, plan sync). `trackUsage()` is deprecated no-op — usage writes are server-only. |
| **AI API** | `js/services/aiApi.js` | Fetch wrapper for worker. `chatCompletionJson` sends `mode:'classify'` to bypass Orchestrator. |
| **RAG Service** | `js/services/ragService.js` | Ingest and query Cloudflare Vectorize via the worker proxy. |
| **Search Service** | `js/services/tools/searchService.js` | Tavily search via worker proxy. |
| **Home Screen** | `js/ui/homeScreen.js` | Home/landing screen UI module. |
| **Sentry (FE)** | `js/core/app.js` | Captures client-side exceptions with privacy filters (stripping PII/Chat content). |

### ✨ Exclusive AI Subsystem (`/js/exclusive/`)
Premium multi-model fan-out synthesis. Gated by `ExclusiveAccess.isUnlocked()`.

| Component | Path | Responsibility |
| :--- | :--- | :--- |
| **Master Tool** | `js/exclusive/ai/masterTool.js` | Orchestrates fan-out to `FANOUT_MODELS` (Groq + GitHub Models — two genuinely distinct providers). |
| **Decision Engine** | `js/exclusive/ai/modelDecisionEngine.js` | Decides if a prompt warrants fan-out. Calls `chatCompletionJson` with `mode:'classify'`. |
| **Synthesizer** | `js/exclusive/ai/synthesizer.js` | Merges N model outputs into a single coherent streamed response. |
| **Chat Engine** | `js/exclusive/ui/exclusiveChatEngine.js` | Exclusive chat UI with persistence (`CloudDB.saveConversation`) and history sidebar. |
| **Shell** | `js/exclusive/ui/exclusiveShell.js` | Exclusive shell — `#exclusiveNewChatBtn` wired to `newChat()`. |
| **Access Gate** | `js/exclusive/state/exclusiveAccess.js` | `isUnlocked()` gate — dev email bypass + future billing webhook. |

### ⚡ Layer 2: Cloudflare Edge Backend (`/worker/`)
The absolute gateway. All traffic must pass through this proxy.

| Sub-system | Path | Mechanism |
| :--- | :--- | :--- |
| **API Gateway** | `src/index.js` | Main router. Handles chat, search, RAG, health, admin, and payment branches. |
| **Mode Gate** | `src/index.js` line ~240 | Orchestrator is skipped for `mode='agent'` AND `mode='classify'`. Only real user chat messages are routed. |
| **Orchestrator** | `src/agents/orchestrator.js` | Routes real chat messages to `chat` / `coder` / `creator` agents based on intent. |
| **Coder Agent** | `src/agents/coder.js` | Specialized coding assistant. Returns same shape as standard chat. |
| **Creator Agent** | `src/agents/creator.js` | Image/visual generation agent — returns SSE stream, not JSON. |
| **Ops Agent** | `src/agents/ops.js` | Admin-only health report endpoint. `yearly` tier by design. |
| **Global Rate Limiter** | `src/rateLimiter.js` | Cloudflare KV (`RATE_LIMIT_KV`) — serverless-restart-safe. |
| **Tier Validation** | `src/modelAccess.js` | Validates `callerPlan` rank vs model's required tier. `llama-3.1-8b-instant` is `free` tier. |
| **Fallback Engine** | `src/modelFallback.js` | Auto-retries 429/500. Falls back: Groq primary → Groq secondary → GitHub Models. |
| **Usage Tracker** | `src/usageTracker.js` | **Sole writer** for `users/{uid}/usage/{date}` via Admin SDK. Client-side writes are forbidden by Firestore rules. |
| **Atomic Usage** | `src/usageStats.js` | Silently increments `dailyUsageStats/{date}` for global analytics. |
| **Payments** | `src/payments.js` | Razorpay order creation + webhook verification. Prices match `js/config/plans.js` exactly. |
| **Admin Stats** | `src/adminStats.js` | 30-day internal HTML dashboard. |

---

## 🔄 4. Exact Data Flow: "A Message's Journey" (Hardened)

### Standard Chat Flow
1. **Client Action:** User types and sends.
2. **Mode Assignment:** `chatStream()` in `aiApi.js` sends no `mode` field (defaults to chat routing through Orchestrator).
3. **Edge Ingestion:** Payload hits Worker `/worker/src/index.js`.
4. **Security Check (KV):** Worker checks `RATE_LIMIT_KV`. Denies if abusive.
5. **Auth & Limit Validation:** Worker checks plan via Admin SDK; `checkAndIncrementDailyUsage()` runs.
6. **Mode Gate:** Since `mode` is not `'agent'` or `'classify'`, Orchestrator runs and routes to `chat` / `coder` / `creator`.
7. **Analytics Logging:** Non-blocking `recordUsageStat()` fires in background.
8. **Model Routing:** `callModelWithFallback` attempts primary Groq model → secondary → GitHub Models.
9. **Streaming Delivery:** Stream chunked back to client.
10. **UI Render:** `chatEngine.js` parses chunked Markdown on the fly.

### Internal Classification Flow (intent.js / modelDecisionEngine.js)
1. `chatCompletionJson(messages)` is called with `mode: 'classify'` in the payload.
2. Worker sees `mode === 'classify'` → **Orchestrator is skipped entirely**.
3. Worker goes directly to tier-check → model call → returns JSON.
4. Caller parses `data.choices[0].message.content` as JSON.

### Exclusive Fan-Out Flow
1. `MasterTool.processStream()` is called.
2. `ModelDecisionEngine.shouldFanOut()` calls `chatCompletionJson` with `mode:'classify'` — safely bypasses Orchestrator.
3. If fan-out warranted: two parallel calls fire — one to `llama-3.3-70b-versatile` (Groq), one to `gpt-4o-mini` (GitHub Models).
4. Both are **genuinely different providers** — results are distinct.
5. `Synthesizer.synthesizeStream()` merges both into a single streamed response.

---

## 🛡 5. Security & Infrastructure Hardening

- **Global Rate Limiting:** Cloudflare KV-backed. Serverless restarts don't reset limits.
- **Orchestrator Mode Gate:** Internal `classify` calls and agent tool calls explicitly bypass the Orchestrator — prevents classification prompts from being silently misrouted to image-generation or code agents.
- **Firestore Write Isolation:** `users/{uid}/usage/*` is `allow write: if false` in `firestore.rules`. Only the Worker's Admin SDK (via `usageTracker.js`) can write usage stats. Client attempts are blocked at the rules level.
- **Strict Endpoint Authorization:** Dev-access unlock requires both a verified Firebase ID token and an explicitly allowlisted developer email (`satyamk82476@gmail.com`).
- **Sentry Error Tracking:** Frontend + Edge Worker. Privacy filter strips request bodies before transmission.
- **External Uptime Monitoring:** UptimeRobot → `/api/health` endpoint.
- **Aggregated Analytics:** Zero PII. Tracks model/tool usage counts only, never user identity.
- **Payment Integrity:** Razorpay prices (`PRICES` object in `payments.js`) verified to match `js/config/plans.js` exactly. Webhook signature verified via `RAZORPAY_WEBHOOK_SECRET`.

---

## 📁 6. Key File Map (New & Changed Files — v5.0)

### New Files Added
| File | Purpose |
| :--- | :--- |
| `js/config/api.js` | Centralized `API_ENDPOINT` export. The only place the worker URL should ever appear. |
| `worker/.env.example` | Documents all 9 required `wrangler secret put` secrets with descriptions. |

### Deleted Files
| File | Reason |
| :--- | :--- |
| `js/env.js` | Contained only `window.ENV = {}`. Never imported anywhere. Removed from SW cache and disk. |

### Modified Files (Audit Batches 1 - 4 Completed)
| File | What Changed |
| :--- | :--- |
| `worker/src/devAccess.js` | Added ID token verification + email allowlist check (fixed P1-4 privilege escalation). |
| `worker/src/statusMonitor.js` | Status health probe for `gpt-4o-mini` now hits actual `models.github.ai` endpoint instead of legacy Azure one. |
| `worker/src/modelFallback.js` | GitHub Models endpoint centralized via `ENDPOINTS` exported from `modelAccess.js`. |
| `worker/src/modelAccess.js` | `llama-3.1-8b-instant` tier corrected: `'monthly'` → `'free'`. Now also exports `ENDPOINTS` constant. |
| `js/ai/toolSchemas.js` | Added `github_list_files`, `github_read_file`, `github_search_code` schemas + registered in `getToolCategoryMap()`. |
| `js/exclusive/ui/exclusiveShell.js` | `#exclusiveNewChatBtn` wired to `ExclusiveChatEngine.newChat()`. |
| `js/exclusive/ui/exclusiveChatEngine.js` | `CloudDB.saveConversation()` enabled. `renderExclusiveChatHistory()` added — populates history sidebar from Firestore on init and after each save. |
| `js/core/app.js` | `hideAppLoaders()` helper extracted (was 28-line block duplicated in both auth branches). `groqKeyToggle` inline onclick moved to `addEventListener`. |
| `sw.js` | Added `homeScreen.js`, `home.css`, `api.js` to precache. Removed `env.js`. Bumped to `v55`. |
| `index.html` | Removed 6 dead `id=` attributes (`sidebarAvatar`, `sidebarUserName`, `usageBlock`, `settingsUsageBlock`, `settingsUsageValue`, `settingsUsageBarFill`). Removed inline `onclick` from `#groqKeyToggle`. |
| `js/services/aiApi.js` | `chatCompletionJson` now sends `mode:'classify'`. Imports `API_ENDPOINT` from `js/config/api.js`. |
| `worker/src/index.js` | Orchestrator gate updated: skips for `mode='agent'` AND `mode='classify'`. |
| `js/ui/chatEngine.js` | Removed `CloudDB.trackUsage()` call — was being rejected by Firestore rules silently on every message. |
| `js/services/cloudDb.js` | `getTodayUsage()` now correctly reads `data.count` from server (fixing UI showing 0 usage). `trackUsage()` deprecated. |
| `js/exclusive/ai/masterTool.js` | `FANOUT_MODELS` fixed: `['llama-3.3-70b-versatile', 'gpt-4o-mini']` — two distinct providers. Previously both normalized to same Groq model. |
| `js/services/ragService.js` | Imports `API_ENDPOINT` from `js/config/api.js` instead of inline literal. |
| `js/services/tools/searchService.js` | Imports `API_ENDPOINT` from `js/config/api.js` instead of inline literal. |
| `js/ui/sidebar.js` | Imports `API_ENDPOINT` from `js/config/api.js`. Dev-access URL uses template literal. |
| `js/ui/changePlanModal.js` | Imports `API_ENDPOINT` from `js/config/api.js`. Payment + verify endpoints use template literals. |
| `.env.example` | Clarified that `WORKER_URL` is used ONLY by offline `scripts/ingest.js`, not the frontend bundle. |

---

## 🔮 7. Future Roadmap (For AI Agents)

### A. Advanced Agentic Workflows (Agent Mode)
- **Current State:** ReAct (Reason-Act) workflow stability achieved. GitHub tools registered and visible to AI model.
- **Future Plan:** Allow agents to parallelize tool calls natively and handle asynchronous sub-agent spawning.

### B. Connectors Architecture (External Data)
- **Current State:** Connectors registry (`connectorsRegistry.js`) built and shipped as honest empty-states pending backend implementations.
- **Future Plan:** Implement OAuth flows in the Cloudflare Worker to fetch private data from Notion, Slack, and Google Drive securely.

### C. RAG (Retrieval-Augmented Generation)
- **Current State:** A complete RAG pipeline is implemented with chunking, duplicate detection, and Hinglish intent parsing.
- **Future Plan:** Expand vector storage scale and add visual/multimodal document parsing.

### D. File Uploads & Vision
- **Future Plan:** Integrate LLaVA/Vision models via Groq. Update `chatEngine.js` to accept Image inputs (Base64), routing to a Vision-capable endpoint.

### E. Exclusive AI — Production Rollout
- **Current State:** Gated to dev email. `MasterTool` fan-out works with two genuinely distinct providers.
- **Future Plan:** Wire `ExclusiveAccess.isUnlocked()` to billing webhook result from Razorpay. Roll out to all `yearly` plan subscribers.

---

## 🔑 8. Required Secrets Reference (Cloudflare Worker)

> All secrets are set via `npx wrangler secret put <NAME>`. See `worker/.env.example` for full details.

| Secret | Required | Provider | Purpose |
| :--- | :--- | :--- | :--- |
| `GROQ_API_KEY` | **YES** | Groq | All LLM calls — chat, classification, agents |
| `GITHUB_MODELS_TOKEN` | **YES** | GitHub | `gpt-4o-mini` fallback + Master Tool fan-out second model |
| `TAVILY_API_KEY` | **YES** | Tavily | Web search proxy |
| `FIREBASE_SERVICE_ACCOUNT` | **YES** | Firebase | Usage tracking, plan enforcement (Admin SDK) |
| `RAZORPAY_KEY_ID` | **YES** | Razorpay | Payment order creation |
| `RAZORPAY_KEY_SECRET` | **YES** | Razorpay | Payment signing |
| `RAZORPAY_WEBHOOK_SECRET` | **YES** | Razorpay | Webhook verification |
| `SENTRY_DSN` | NO | Sentry | Error tracking (worker warns if absent) |
| `ADMIN_UID` | NO | Internal | Guards `/api/admin/agent-health` endpoint |

> **Cloudflare Bindings** (in `wrangler.toml`, not secrets): `AI`, `VECTORIZE`, `RATE_LIMIT_KV`

---

## 🛠 9. Deployment Playbook

If a deployment is requested, execute exactly this sequence:

**1. Syntax & Sanity Check:**
```bash
node -c worker/src/index.js
node -c js/core/app.js
```

**2. Backend Deployment:**
```bash
cd worker
npx wrangler deploy
```

**3. Frontend Deployment:**
```bash
git add .
git commit -m "deploy: update frontend"
git push origin main
firebase deploy --only hosting
```

**4. Post-Deploy Verification:**
- Confirm `/api/health` returns `200 OK`
- Send a chat message as a free/guest user — confirm no `403 model_tier_required` in console
- Send a classification-heavy prompt (e.g. "create a picture of a sunset") — confirm `detectIntent` still returns valid JSON (not an SSE stream)
- Check Settings screen usage bar still displays correct numbers

---
*End of Codex v5.0. You are now initialized with absolute knowledge of the current state of ToolsHub.*


> **MISSION DIRECTIVE:** This document is the ultimate source of truth for ToolsHub. It is specifically engineered to be ingested by AI agents and Senior Engineers. By reading this file, an AI must perfectly understand the entire architectural state, security boundaries, component responsibilities, data flows, and future roadmap without needing to scan individual source files. **Read carefully before executing any code changes.**

![Architecture Version](https://img.shields.io/badge/Architecture-v5.1-6c63ff?style=flat-square)
![Status](https://img.shields.io/badge/Status-Production_Ready-34a853?style=flat-square)
![Frontend](https://img.shields.io/badge/Frontend-Vanilla_JS_SPA-fbbc05?style=flat-square)
![Backend](https://img.shields.io/badge/Backend-Cloudflare_Workers-f38020?style=flat-square)
![Database](https://img.shields.io/badge/Database-Firebase_Firestore-ffca28?style=flat-square)

---

## 🛑 1. Core Architectural Laws (Zero Compromise)

ToolsHub operates on a strictly decoupled **Frontend (Vanilla HTML/CSS/JS SPA) + Edge Backend (Cloudflare Workers) + Database (Firebase Firestore)** model. 

1. **NO FRONTEND API KEYS:** The frontend (`/js/*`, `index.html`) is public. Never hardcode, fetch, or store provider API keys (Groq, Tavily, Sentry DSNs etc.) in the frontend source code. 
2. **EDGE PROXY MANDATE:** All LLM and 3rd-party tool requests **must** route through the Cloudflare Worker (`/worker/src/index.js`). The worker holds the secrets (`env.GROQ_API_KEY`, `env.TAVILY_API_KEY`) and securely forwards the requests.
3. **ATOMIC DATA MUTATION:** All aggregate usage metrics and counts must be updated via Firestore's atomic `increment()` via the Worker's Admin SDK to prevent race conditions.
4. **STREAMING BY DEFAULT:** All LLM responses stream natively from Groq → Cloudflare Worker (passthrough) → Frontend (`chatEngine.js`), parsing markdown on the fly.
5. **VANILLA JS MODULARITY:** No React, No Vue. The frontend uses ES6 Modules (IIFE Pattern) for state encapsulation.

---

## 🏗️ 2. High-Level System Architecture (Wireframe Topology)

```mermaid
graph TD
    %% ==========================================
    %% 🖥️ CLIENT-SIDE: VANILLA JS SPA ARCHITECTURE
    %% ==========================================
    subgraph Client_Tier [📱 Layer 1: Client Browser & UI]
        direction TB
        
        subgraph UI_Components [Dom & Rendering]
            ChatDOM[💬 Chat DOM & Markdown]
            Sidebar[🗂️ Sidebar & History]
            Overlays[⚙️ Modals & Controls]
        end
        
        subgraph Core_Engines [Client-Side Logic]
            AppCore{app.js - State Manager}
            ChatEngine((chatEngine.js))
            Router((router.js))
        end
        
        subgraph Services [Local Services & API]
            AuthClient[🔐 auth.js]
            CloudDB[☁️ cloudDb.js]
            Settings[⚙️ localSettings.js]
        end
        
        subgraph AI_Intelligence [AI / Agent Pre-Processing]
            IntentEngine[🧠 intent.js]
            AgentEngine[🤖 agentEngine.js]
            ToolReg[🛠️ registry.js]
        end
        
        SentryFE((🐞 Sentry SDK))
        
        %% Internal Wiring Client
        AppCore --> UI_Components
        UI_Components --> ChatEngine
        ChatEngine <--> Router
        Router --> IntentEngine
        IntentEngine --> ToolReg
        AgentEngine --> ToolReg
        AppCore --> AuthClient
        AuthClient --> CloudDB
    end

    %% ==========================================
    %% ⚡ EDGE-SIDE: CLOUDFLARE WORKERS
    %% ==========================================
    subgraph Edge_Tier [⚡ Layer 2: Cloudflare Edge Network]
        direction TB
        
        subgraph Security_Perimeter [WAF & Security]
            CF_WAF{Cloudflare WAF}
            RateLimit[(KV: RATE_LIMIT_KV)]
        end
        
        subgraph Worker_Core [/worker/src/index.js/]
            ReqRouter{API Router}
            AuthVerifier[JWT Verifier]
            UsageMiddleware[Quota & Plan Check]
            ModelAccess[Tier Enforcer]
        end
        
        subgraph AI_Routing [Model Fallback Engine]
            PrimaryCircuit[groq/llama-3.3-70b]
            SecondaryCircuit[groq/llama-3.1-8b]
            FailsafeCircuit[github/gpt-4o-mini]
        end
        
        SentryBE((🐞 Sentry Backend))
        
        %% Internal Wiring Edge
        CF_WAF --> ReqRouter
        ReqRouter --> RateLimit
        ReqRouter --> AuthVerifier
        AuthVerifier --> UsageMiddleware
        UsageMiddleware --> ModelAccess
        ModelAccess --> PrimaryCircuit
        ModelAccess -.-> |429 / 503 Fallback| SecondaryCircuit
        SecondaryCircuit -.-> |Critical Failover| FailsafeCircuit
    end

    %% ==========================================
    %% 🗄️ DATABASE & STORAGE: FIREBASE
    %% ==========================================
    subgraph Data_Tier [🗄️ Layer 3: Firebase Cloud]
        direction LR
        
        subgraph Auth_Identity [Identity]
            FB_Auth[Google Auth / Email]
        end
        
        subgraph Firestore_Nodes [NoSQL Collections]
            UsersCol[(users/{uid})]
            UsageCol[(users/{uid}/usage)]
            GlobalStats[(dailyUsageStats)]
        end
        
        %% Internal Data Wiring
        FB_Auth --> UsersCol
        UsersCol --> UsageCol
    end

    %% ==========================================
    %% 🌐 EXTERNAL PROVIDERS & MONITORING
    %% ==========================================
    subgraph External_Tier [🌐 Layer 4: Third-Party APIs]
        GroqAPI[⚡ Groq Inference]
        GithubAPI[🐙 GitHub Models API]
        TavilyAPI[🔍 Tavily Search API]
        Razorpay[💸 Razorpay Gateway]
    end
    
    subgraph Monitor_Tier [🩺 Reliability]
        UptimeRobot((UptimeRobot))
    end

    %% ==========================================
    %% 🔗 INTER-LAYER CONNECTIONS (THE WIRING)
    %% ==========================================
    
    %% Client to Edge
    Router ==>|REST /chat payload| CF_WAF
    AgentEngine ==>|Tool Execution| CF_WAF
    CloudDB <==>|Firebase SDK| Firestore_Nodes
    SentryFE -.-> |Exception Data| External_Tier
    SentryBE -.-> |Exception Data| External_Tier
    
    %% Edge to DB
    AuthVerifier <==>|Admin SDK Token Check| FB_Auth
    UsageMiddleware ==>|Atomic Increment| UsageCol
    ReqRouter ==>|Background Task| GlobalStats
    
    %% Edge to APIs
    PrimaryCircuit ==>|Streaming HTTP| GroqAPI
    SecondaryCircuit ==>|Streaming HTTP| GroqAPI
    FailsafeCircuit ==>|Streaming HTTP| GithubAPI
    ReqRouter ==>|Search Query| TavilyAPI
    
    %% External to Client
    Razorpay -.-> |Webhook/Client-side| AppCore
    
    %% Monitoring
    UptimeRobot -.->|Pings /api/health| CF_WAF
    
    %% Styling
    classDef client fill:#1e1e24,stroke:#3b82f6,stroke-width:2px,color:#fff;
    classDef edge fill:#1e1e24,stroke:#f59e0b,stroke-width:2px,color:#fff;
    classDef data fill:#1e1e24,stroke:#10b981,stroke-width:2px,color:#fff;
    classDef external fill:#1e1e24,stroke:#ec4899,stroke-width:2px,color:#fff;
    
    class UI_Components,Core_Engines,Services,AI_Intelligence client;
    class Security_Perimeter,Worker_Core,AI_Routing edge;
    class Auth_Identity,Firestore_Nodes data;
    class External_Tier,Monitor_Tier external;
```

---

## 🧩 3. Component Deep Dive: The 3D Matrix

### 🖥️ Layer 1: Frontend Application (`/js/`)
The frontend uses the Immediately Invoked Function Expression (IIFE) pattern to create pseudo-classes and singletons.

| Component | Path | Responsibility / Wireframe Blueprint |
| :--- | :--- | :--- |
| **App Core** | `js/core/app.js` | Bootstrap, event listeners, Auth overlays, initialization state. |
| **AI Router** | `js/ai/router.js` | Directs inputs to Tools (Search, Calculator) vs Chat vs Agents. |
| **Intent Engine** | `js/ai/intent.js` | Regex & LLM-backed fast intent categorization (with Hinglish support). |
| **Chat View** | `js/ui/chatEngine.js` | DOM mutation, auto-scroll, Markdown parsing (`marked.js`), typewriter stream rendering. |
| **Personas** | `js/ui/personaPicker.js` | Filters available tools/categories based on selected user roles (Coding, Education, etc.). |
| **Cloud DB** | `js/services/cloudDb.js` | Handles direct Firebase queries (User state, chat history). |
| **Sentry (FE)** | `js/core/app.js` | Captures client-side exceptions with privacy filters (stripping PII/Chat content). |

### ⚡ Layer 2: Cloudflare Edge Backend (`/worker/`)
The absolute gateway. All traffic must pass through this proxy.

| Sub-system | Path | Mechanism |
| :--- | :--- | :--- |
| **API Gateway** | `src/index.js` | The main router. Handles `/chat`, `/search`, `/health`, and `/api/admin/usage-stats`. |
| **Global Rate Limiter** | `src/index.js` | Uses **Cloudflare KV (`RATE_LIMIT_KV`)** to prevent IP abuse and DDoS globally. |
| **Tier Validation** | `src/modelAccess.js` | Validates if the `callerPlan` has the rank required to access premium models. |
| **Fallback Engine** | `src/modelFallback.js` | **Resilience Core:** Auto-retries 429/500 errors. Seamlessly falls back to secondary tiers (e.g. `llama-3.1-8b`) or GitHub Models if Groq fails. |
| **Atomic Usage** | `src/usageStats.js` | Silently increments `dailyUsageStats/{date}` via Admin SDK for global analytics without blocking the request. |
| **Admin Stats** | `src/adminStats.js` | Generates a 30-day internal HTML dashboard for aggregate usage monitoring. |

---

## 🔄 4. Exact Data Flow: "A Message's Journey" (Hardened)

1. **Client Action:** User types "Search latest news on AI" and sends.
2. **Client Validation:** Frontend checks subscription caps locally.
3. **Edge Ingestion:** Payload hits Cloudflare Worker `/worker/src/index.js`.
4. **Security Check (KV):** Worker checks `RATE_LIMIT_KV` for the user's IP. Denies if abusive.
5. **Auth & Limit Validation:** Worker checks `users/{uid}` in Firestore via Admin SDK.
6. **Analytics Logging:** Worker fires a non-blocking background task to increment `dailyUsageStats` via atomic transforms.
7. **Model Routing:** `modelFallback.js` attempts primary Groq model.
   - *If Groq 429s/503s:* Engine catches the error, logs to Sentry, and routes to GitHub Models fallback seamlessly.
8. **Streaming Delivery:** Stream is chunked back to the client.
9. **UI Render:** `chatEngine.js` parses the chunked Markdown on the fly.

---

## 🛡 5. Security & Infrastructure Hardening

Over the last evolution cycles, ToolsHub has graduated to a **Production-Ready** posture:

- **Global Rate Limiting:** Migrated from in-memory Maps to durable **Cloudflare KV**. Serverless instance restarts no longer reset rate limits.
- **Sentry Error Tracking:** Integrated heavily across both Frontend & Edge Worker. Failures alert instantly with exact stack traces, significantly reducing debug cycles.
- **External Uptime Monitoring:** Bound to UptimeRobot targeting `/api/health`. Completely decoupled from Firebase status dependencies. Fixed 405 error by allowing `HEAD` requests.
- **Aggregated Analytics:** Zero PII usage tracking. We know *what* is used (Tools/Models) and *how much*, but never *by who*, maintaining strict privacy bounds.
- **Data-Accuracy Wiring:** Landing page UI features perfectly cropped and aligned images. Billing panel now uses real `CloudDB` usage tracking and `LocalSettings` subscription data. Chat history UI refreshes instantly without reload.
- **Native Routing:** Added `history.pushState` and `popstate` to support physical back buttons app-wide (e.g. from System Status page).

---

## 🔮 6. New Features & Capabilities (v6.0)

### 🧠 AI Agent Engine (Upgraded)
- **Chain-of-Thought Reasoning:** AI thinks before acting with `<thinking>` blocks
- **Dynamic Task Complexity:** 8-20 steps based on plan tier and task complexity
- **Smart Error Recovery:** Auto-retry and alternative approaches on tool failures
- **Context Window:** Expanded to 100 messages with smart summarization
- **Task Decomposition:** Complex tasks broken into manageable sub-tasks

### 🔧 Tool Intelligence System
- **Tool Chaining:** Auto-chain tools (Research → Write → Post)
- **Smart Selection:** AI suggests best tools based on user intent
- **Result Formatting:** Rich cards, tables, and interactive elements
- **Usage Tracking:** Learn user preferences over time

### 💻 Code Assistant (Claude Code Killer)
- **Code Analysis:** Quality scoring, security audit, performance review
- **Code Generation:** Production-ready code from descriptions
- **Code Review:** Detailed PR-style feedback
- **Code Explanation:** Step-by-step walkthrough with analogies
- **Multi-Language:** 15+ languages supported

### 📁 Project Workspace (Notion Killer)
- **Projects:** Organize work by project
- **Tasks:** Kanban-style task management
- **Notes:** Rich text notes with tags
- **Stats:** Progress tracking and analytics

### 🔬 Research Engine (Perplexity Killer)
- **Deep Research:** Multi-source analysis with citations
- **Trend Analysis:** Market trends and insights
- **Comparisons:** Side-by-side option analysis
- **Fact Checking:** Claim verification with sources

### 📝 Content Suite (Jasper Killer)
- **Blog Writer:** SEO-optimized full articles
- **Social Media:** All platforms (Instagram, Twitter, LinkedIn, YouTube, Facebook)
- **Email Writer:** Professional emails for any purpose
- **Ad Copy:** High-converting marketing copy

### 🛠 Developer Tools
- **Git Integration:** Commit messages, PR descriptions
- **API Builder:** Generate complete endpoints
- **Test Generator:** Unit tests for any code
- **Documentation:** Auto-generate docs
- **Docker:** Production-ready Dockerfiles

---

## 🔮 7. Future Roadmap (For AI Agents)

If you are an AI tasked with upgrading this system, you must know what has already been built vs what is upcoming.

### A. Advanced Agentic Workflows (Agent Mode)
- **Current State:** Chain-of-Thought reasoning with dynamic steps achieved.
- **Future Plan:** Multi-agent collaboration, parallel tool execution, sub-agent spawning.

### B. Connectors Architecture (External Data)
- **Current State:** Connectors registry built with GitHub integration.
- **Future Plan:** OAuth flows for Notion, Slack, Google Drive, Twitter, LinkedIn.

### C. RAG (Retrieval-Augmented Generation)
- **Current State:** Complete RAG pipeline with chunking and vector search.
- **Future Plan:** Multimodal RAG (images, PDFs), cross-document reasoning.

### D. Vision & File Processing
- **Current State:** Basic image/PDF tools.
- **Future Plan:** Vision models for image understanding, OCR, document analysis.

### E. Real-time Collaboration
- **Future Plan:** Shared workspaces, real-time editing, team features.

### F. Offline Intelligence
- **Future Plan:** On-device AI models for offline capabilities.

---

## 🛠 8. Deployment Playbook

If a deployment is requested, execute exactly this sequence:

**1. Syntax & Sanity Check:**
```bash
node -c worker/src/index.js
node -c js/core/app.js
```

**2. Backend Deployment:**
```bash
cd worker
npm run deploy
```

**3. Frontend Deployment:**
```bash
git add .
git commit -m "deploy: update frontend"
git push origin main
firebase deploy --only hosting
```

---

## 📊 9. Architecture Stats

| Component | Count | Status |
|-----------|-------|--------|
| Total Tools | 40+ | Active |
| AI Agents | 5 | Active |
| Code Languages | 15+ | Supported |
| Content Formats | 10+ | Active |
| Research Sources | 5+ | Integrated |
| Project Features | 8 | Active |

---
*End of Codex. You are now initialized with absolute knowledge of the current state of ToolsHub v6.0.*
