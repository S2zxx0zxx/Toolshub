# ToolsHub — Frontend Shell

Pure HTML/CSS/JS chat interface, Claude-style UI, backend-ready.

## Structure
```
index.html
css/
  variables.css    → design tokens (colors, spacing, radius, shadows, motion, fonts)
  layout.css       → app shell, screen states, settings screen
  components.css   → buttons, chips, toggles, list-rows, skeleton, typing dots
  sidebar.css      → drawer nav
  chat.css         → top bar, messages, empty state, input bar
  bottomsheet.css  → "+" sheet & 2-level tool selector sheet
js/
  storage.js       → localStorage wrapper (chats, theme, active chat)
  toolSelector.js  → Category → Tool data model + render logic
  sidebar.js       → drawer open/close + chat history list
  bottomsheet.js   → "+" sheet and tool selector sheet controllers
  chat.js          → message rendering, fake streaming, send flow
  main.js          → settings nav, theme toggle, app bootstrap
```

## Where to plug in your backend

**1. Real AI responses** — `js/chat.js`, function `sendMessage()`:
Currently uses a `setTimeout` + placeholder text, then calls `streamAssistantReply()`.
Replace the `setTimeout` block with your actual API call (fetch/EventSource for real streaming),
then call `streamAssistantReply(realText)` or adapt `streamAssistantReply` to append
real streamed chunks as they arrive instead of slicing a known full string.

**2. Tool definitions** — `js/toolSelector.js`, the `DATA` array:
Each tool has `id`, `title`, `sub`, `icon`, `placeholder`, optional `pinned`.
Add a `promptTemplate` or `apiEndpoint` field per tool if different tools hit different backend routes.

**3. Auth / user identity** — currently hardcoded "Satyam" / "S" avatar in `index.html`
(`.sidebar-footer`, `.settings-account-card`). Wire these to your auth system.

**4. File upload** — `#hiddenFileInput` in `index.html` is wired to open on "Upload File" row click
(`js/bottomsheet.js`). Add a `change` listener to actually upload/attach the file.

## Design tokens
All colors/spacing/radius/motion values are centralized in `css/variables.css`.
Light theme override is under `[data-theme="light"]` in the same file.
Change `--accent` there to re-brand the whole app in one place.

## Tested
- Mobile (390px) and desktop (1440px) layouts
- Dark/light theme toggle with persistence
- 2-level tool selector (category → tool) with back navigation
- localStorage persistence across page refresh
- Keyboard shortcuts: Enter to send, Shift+Enter for newline
- "+" sheet toggles, chat history grouping (Today/Yesterday/Older)
