# ToolsHub

A powerful AI-driven application featuring a modern chat interface, robust tool execution architecture, and Firebase Backend integration.

## Features

- **Modern Chat Interface**: Responsive UI with dynamic chat bubbles, typing indicators, and markdown support.
- **AI Agent Framework**: Intelligent tool routing system that intercepts intents and executes local/remote tools dynamically via Groq AI.
- **Tool Architecture**: Supports utility tools (Time, Weather, Calculator, Search, Web Fetching) and custom functions.
- **Firebase Backend**: Fully integrated with Firebase Authentication (Email/Password + Google Sign-In) and Firestore for persistent user profiles and chats.
- **PWA Ready**: Works completely offline via robust Service Worker caching and LocalStorage fallbacks.

## Architecture & Structure

```
c:/toolshub/
├── index.html            → Core Application Shell (UI and Templates)
├── css/                  → Modular Design System
│   ├── core/variables.css→ Design tokens (colors, fonts, radius)
│   ├── layout/           → Core layout structural files (chat, sidebar, layout)
│   └── components/       → Reusable UI components (bottomsheet, tools, etc)
└── js/                   → Application Logic
    ├── core/             → Core wiring (app.js, events.js, router.js)
    ├── services/         → External integrations (firebase.js, aiApi.js, auth.js)
    │   └── tools/        → Implementations of specific tools
    ├── tools/            → AI Tooling Framework (registry, permissions, executor)
    └── ui/               → View logic (chatEngine, bottomsheet, sidebar)
```

## Setup & Deployment

1. **Firebase**:
   - Application is wired to Firebase project `toolshub-87859`.
   - Update `firebase.js` if migrating to a new environment.
   - Run `npx firebase-tools deploy --only auth` to deploy authentication configuration based on `firebase.json`.

2. **AI Backend**:
   - Powered by `llama-3.3-70b-versatile` via Groq.
   - `aiApi.js` handles streaming and JSON mode extraction.

## Extending the App (Adding New Tools)

To add a new tool to the AI Agent:
1. Define the tool schema in `js/tools/registry.js`.
2. Map the implementation in the `TOOL_EXECUTORS` object inside `registry.js`.
3. The AI will automatically become aware of the tool and can invoke it in response to user queries.
