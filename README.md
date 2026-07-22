# 🌌 ToolsHub: Architectural Codex v4.0 (Production Hardened)

> **MISSION DIRECTIVE:** This document is the ultimate source of truth for ToolsHub. It is specifically engineered to be ingested by AI agents and Senior Engineers. By reading this file, an AI must perfectly understand the entire architectural state, security boundaries, component responsibilities, data flows, and future roadmap without needing to scan individual source files. **Read carefully before executing any code changes.**

![Architecture Version](https://img.shields.io/badge/Architecture-v4.0-6c63ff?style=flat-square)
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
            FailsafeCircuit[github/llama-3.3-70b]
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
- **External Uptime Monitoring:** Bound to UptimeRobot targeting `/api/health`. Completely decoupled from Firebase status dependencies.
- **Aggregated Analytics:** Zero PII usage tracking. We know *what* is used (Tools/Models) and *how much*, but never *by who*, maintaining strict privacy bounds.

---

## 🔮 6. Future Roadmap (For AI Agents)

If you are an AI tasked with upgrading this system, you must know what has already been built vs what is upcoming.

### A. Advanced Agentic Workflows (Agent Mode)
- **Current State:** ReAct (Reason-Act) workflow stability achieved.
- **Future Plan:** Allow agents to parallelize tool calls natively and handle asynchronous sub-agent spawning.

### B. Connectors Architecture (External Data)
- **Current State:** Connectors registry (`connectorsRegistry.js`) built and shipped as honest empty-states pending backend implementations.
- **Future Plan:** Implement OAuth flows in the Cloudflare Worker to fetch private data from Notion, Slack, and Google Drive securely.

### C. RAG (Retrieval-Augmented Generation)
- **Current State:** A complete RAG pipeline is implemented with chunking, duplicate detection, and Hinglish intent parsing.
- **Future Plan:** Expand vector storage scale and add visual/multimodal document parsing.

### D. File Uploads & Vision
- **Future Plan:** Integrate LLaVA/Vision models via Groq. Update `chatEngine.js` to accept Image inputs (Base64), routing to a Vision-capable endpoint (`llama-3.2-11b-vision-preview`).

---

## 🛠 7. Deployment Playbook

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

---
*End of Codex. You are now initialized with absolute knowledge of the current state of ToolsHub.*
