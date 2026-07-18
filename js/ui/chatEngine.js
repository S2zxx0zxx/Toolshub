/* ============================================
   TOOLSHUB — CHAT
   Message rendering, fake typewriter streaming,
   send flow, chat lifecycle (new/load/save)
   ============================================ */

import { LocalSettings } from '../services/localSettings.js';
import { CloudDB } from '../services/cloudDb.js';
import { ToolSelector } from '../tools/registry.js';
import { Sidebar } from './sidebar.js';
import { Toast } from './toast.js';
import { AIRouter } from '../ai/router.js';

export const Chat = (() => {
  let currentChat = null; // { id, title, toolId, messages, createdAt, updatedAt }

  function genId() {
    return 'c_' + Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
  }

  function newChat() {
    currentChat = {
      id: genId(),
      title: 'New chat',
      toolId: ToolSelector.getActiveTool() ? ToolSelector.getActiveTool().tool.id : null,
      messages: [],
      createdAt: Date.now(),
      updatedAt: Date.now(),
      projectId: LocalSettings.getActiveProject() || null,
    };
    LocalSettings.setActiveChatId(currentChat.id);
    renderEmptyState();
    document.getElementById('chatTitle').textContent = 'New chat';
  }

  async function loadChat(chatId, chatMetadata = null) {
    // metadata is optional, used to populate title immediately
    currentChat = {
      id: chatId,
      title: chatMetadata ? chatMetadata.title : 'Loading...',
      toolId: chatMetadata ? chatMetadata.toolId : null,
      messages: [],
      createdAt: chatMetadata ? chatMetadata.createdAt : Date.now(),
      updatedAt: chatMetadata ? chatMetadata.updatedAt : Date.now(),
      projectId: chatMetadata ? chatMetadata.projectId : null,
    };
    LocalSettings.setActiveChatId(chatId);
    document.getElementById('chatTitle').textContent = currentChat.title;

    if (currentChat.toolId) ToolSelector.selectTool(currentChat.toolId, { silent: true });

    renderEmptyState();
    
    const messages = await CloudDB.loadChatMessages(chatId);
    currentChat.messages = messages;

    if (currentChat.messages.length === 0) {
      renderEmptyState();
    } else {
      renderMessages();
    }
  }

  async function assignProject(projectId) {
    if (!currentChat) return;
    currentChat.projectId = projectId;
    currentChat.updatedAt = Date.now();
    await CloudDB.saveConversation(currentChat);
  }

  function renderEmptyState() {
    document.getElementById('emptyState').style.display = 'flex';
    document.getElementById('msgList').style.display = 'none';
    document.getElementById('msgList').innerHTML = '';
  }

  function renderMessages() {
    document.getElementById('emptyState').style.display = 'none';
    const list = document.getElementById('msgList');
    list.style.display = 'block';
    list.innerHTML = currentChat.messages.map(m => messageHtml(m)).join('');
    attachMsgActionHandlers();
    scrollToBottom();
  }

  function messageHtml(m) {
    if (m.role === 'user') {
      return `
        <div class="msg msg-user">
          <div class="msg-bubble">${escapeHtml(m.text)}</div>
        </div>`;
    }
    const found = m.toolId ? ToolSelector.findTool(m.toolId) : null;
    const title = m.isError ? 'System Error' : (found ? found.tool.title : 'ToolsHub');
    
    let svgIcon = found ? ToolSelector.icon(found.tool.icon) : '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/></svg>';
    if (m.isError) {
      svgIcon = '<svg viewBox="0 0 24 24" fill="none" stroke="var(--danger, #ff4d4f)" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>';
    }
    
    const bubbleStyle = m.isError ? 'color: var(--danger, #ff4d4f); background: rgba(255,77,79,0.1); border: 1px solid rgba(255,77,79,0.2);' : '';

    // isMock flag for Demo Mode badge
    if (m.isMock) {
      return `
        <div class="msg msg-assistant">
          <div style="flex: 1;">
            <div style="display:flex; align-items:center; gap:var(--sp-2); margin-bottom:var(--sp-1); color:var(--text-muted); font-size:var(--fs-xs);">
              <div style="width:16px; height:16px; color:var(--text-secondary);">${svgIcon}</div>
              <div><strong>${escapeHtml(title)} Agent</strong></div>
              <span style="margin-left:4px; padding:2px 7px; border-radius:99px; font-size:10px; font-weight:600; background:var(--bg-surface-2); color:var(--text-muted); border:1px dashed var(--border-med); letter-spacing:0.5px;">DEMO</span>
            </div>
            <div class="msg-bubble markdown-body" style="border:1px dashed var(--border-med); ${bubbleStyle}">${renderMarkdown(m.text)}</div>
            <div class="msg-actions">
              <button class="msg-action-btn" data-action="copy" title="Copy">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1"/></svg>
              </button>
            </div>
          </div>
        </div>`;
    }

    return `
      <div class="msg msg-assistant">
        <div style="flex: 1;">
          <div style="display:flex; align-items:center; gap:var(--sp-2); margin-bottom:var(--sp-2); color:var(--text-muted); font-size:var(--fs-xs);">
            <div style="width:16px; height:16px; color:var(--text-secondary);">${svgIcon}</div>
            <div style="${m.isError ? 'color: var(--danger, #ff4d4f);' : ''}"><strong>${escapeHtml(title)} Agent</strong></div>
          </div>
          <div class="msg-bubble markdown-body" style="${bubbleStyle}">${renderMarkdown(m.text)}</div>
          <div class="msg-actions">
            <button class="msg-action-btn" data-action="copy" title="Copy">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1"/></svg>
            </button>
            <button class="msg-action-btn" data-action="regen" title="Regenerate">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="23 4 23 10 17 10"/><polyline points="1 20 1 14 7 14"/><path d="M3.51 9a9 9 0 0114.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0020.49 15"/></svg>
            </button>
            <button class="msg-action-btn" data-action="up" title="Good response">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 9V5a3 3 0 00-3-3l-4 9v11h11.28a2 2 0 002-1.7l1.38-9a2 2 0 00-2-2.3z"/><path d="M7 22H4a2 2 0 01-2-2v-7a2 2 0 012-2h3"/></svg>
            </button>
            <button class="msg-action-btn" data-action="down" title="Bad response">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10 15v4a3 3 0 003 3l4-9V2H5.72a2 2 0 00-2 1.7l-1.38 9a2 2 0 002 2.3z"/><path d="M17 2h3a2 2 0 012 2v7a2 2 0 01-2 2h-3"/></svg>
            </button>
          </div>
        </div>
      </div>`;
  }

  function attachMsgActionHandlers() {
    document.querySelectorAll('.msg-action-btn[data-action="copy"]').forEach(btn => {
      btn.onclick = () => {
        const text = btn.closest('.msg').querySelector('.msg-bubble').textContent;
        navigator.clipboard?.writeText(text);
        Toast.show('Copied!');
      };
    });

    // Fix #3 — Regenerate button
    document.querySelectorAll('.msg-action-btn[data-action="regen"]').forEach(btn => {
      btn.onclick = async () => {
        if (!currentChat) return;
        // Find the user message just before this assistant message
        const msgEl = btn.closest('.msg');
        const allMsgs = [...document.querySelectorAll('#msgList .msg')];
        const myIndex = allMsgs.indexOf(msgEl);
        if (myIndex <= 0) return;
        // Walk backwards to find the previous user message
        const userMsg = currentChat.messages
          .slice(0, myIndex)
          .reverse()
          .find(m => m.role === 'user');
        if (!userMsg) return;
        // Remove the current assistant message from the array and UI, then resend
        const assistantMsgIndex = currentChat.messages.findLastIndex((m, i) => m.role === 'assistant' && i >= myIndex);
        if (assistantMsgIndex !== -1) currentChat.messages.splice(assistantMsgIndex, 1);
        renderMessages();
        try {
          showTypingIndicator();
          const chatHistory = currentChat.messages.filter(m => m.role === 'user' || m.role === 'assistant');
          const streamGenerator = AIRouter.processInput(userMsg.text, chatHistory, (toolId) => {
            hideTypingIndicator();
            showTypingIndicator(toolId);
          });
          await consumeStream(streamGenerator);
        } catch (err) {
          appendErrorMessage(err.message || 'Regeneration failed.');
        }
      };
    });

    // Fix #3 — Thumbs up / down feedback
    document.querySelectorAll('.msg-action-btn[data-action="up"], .msg-action-btn[data-action="down"]').forEach(btn => {
      btn.onclick = () => {
        const action = btn.dataset.action;
        const msgEl = btn.closest('.msg');
        // Clear sibling feedback buttons first
        msgEl.querySelectorAll('.msg-action-btn[data-action="up"], .msg-action-btn[data-action="down"]').forEach(b => b.classList.remove('is-active'));
        btn.classList.toggle('is-active');
        // Best-effort: store feedback on the message object
        if (currentChat) {
          const allMsgs = [...document.querySelectorAll('#msgList .msg')];
          const idx = allMsgs.indexOf(msgEl);
          if (idx !== -1 && currentChat.messages[idx]) {
            currentChat.messages[idx].feedback = btn.classList.contains('is-active') ? action : null;
          }
        }
      };
    });
  }

  function escapeHtml(str) {
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
  }

  function renderMarkdown(str) {
    if (!str) return '';
    try {
      if (window.marked && window.DOMPurify) {
        // Ensure links open in a new tab safely
        window.DOMPurify.addHook('afterSanitizeAttributes', function(node) {
          if ('target' in node) {
            node.setAttribute('target', '_blank');
            node.setAttribute('rel', 'noopener noreferrer');
          }
        });
        const rawHtml = window.marked.parse(str);
        return window.DOMPurify.sanitize(rawHtml, { ADD_ATTR: ['target'] });
      }
      return escapeHtml(str); // fallback
    } catch (e) {
      return escapeHtml(str);
    }
  }

  let isAutoScrollPaused = false;

  function scrollToBottom(force = false) {
    const body = document.getElementById('chatBody');
    if (!body) return;
    if (force || !isAutoScrollPaused) {
      body.scrollTop = body.scrollHeight;
    }
  }

  // ---------- SEND FLOW ----------
  async function sendMessage(text) {
    if (!text.trim()) return;
    if (!currentChat) newChat();

    // auto-title from first message
    if (currentChat.messages.length === 0) {
      currentChat.title = text.slice(0, 48) + (text.length > 48 ? '…' : '');
      document.getElementById('chatTitle').textContent = currentChat.title;
      await CloudDB.saveConversation(currentChat);
    }

    const userMsg = { id: 'msg_' + Date.now(), role: 'user', text, ts: Date.now() };
    currentChat.messages.push(userMsg);
    currentChat.updatedAt = Date.now();
    renderMessages();
    
    // Save to Firestore/LocalStorage (CloudDB handles routing)
    await CloudDB.saveMessage(currentChat.id, userMsg);

    // Fix #2 — For guest mode (no Firestore subscription), force sidebar to re-render.
    // Firestore onSnapshot handles logged-in users automatically.
    if (!CloudDB.isSubscribed()) {
      Sidebar.setChats(LocalSettings.getAllChats());
    }

    try {
      showTypingIndicator();
      const chatHistory = currentChat.messages.slice(0, -1);
      const streamGenerator = AIRouter.processInput(text, chatHistory, (toolId) => {
        // Update typing indicator when tool starts
        hideTypingIndicator();
        showTypingIndicator(toolId);
      });
      await consumeStream(streamGenerator);
    } catch (err) {
      appendErrorMessage(err.message || "AI service temporarily unavailable.");
    }
  }

  async function appendErrorMessage(errorText) {
    const errMsg = { id: 'msg_' + Date.now(), role: 'assistant', text: `[Error] ${errorText}`, ts: Date.now(), isError: true };
    currentChat.messages.push(errMsg);
    currentChat.updatedAt = Date.now();
    renderMessages();
    await CloudDB.saveMessage(currentChat.id, errMsg);
  }

  function showTypingIndicator(toolId = null) {
    const list = document.getElementById('msgList');
    const el = document.createElement('div');
    el.className = 'msg msg-assistant';
    el.id = 'typingIndicator';
    
    // Determine active tool UI state
    let activeTool = ToolSelector.getActiveTool();
    if (!activeTool && toolId) {
      // It's a backend AI execution tool, grab its UI metadata if it exists in UI registry
      activeTool = ToolSelector.findTool(toolId);
    }

    let title = activeTool ? activeTool.tool.title : 'ToolsHub';
    let svgIcon = activeTool ? ToolSelector.icon(activeTool.tool.icon) : '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/></svg>';

    // If it's a backend tool like calculator/weather
    if (toolId === 'calculator' || toolId === 'weather' || toolId === 'search') {
      title = toolId.charAt(0).toUpperCase() + toolId.slice(1);
    }

    el.innerHTML = `
      <div style="flex: 1;">
        <div style="display:flex; align-items:center; gap:var(--sp-2); margin-bottom:var(--sp-2); color:var(--text-muted); font-size:var(--fs-xs);">
          <div style="width:16px; height:16px; color:var(--text-secondary);">${svgIcon}</div>
          <div><strong>${escapeHtml(title)} Agent</strong> is ${toolId ? 'using a tool' : 'typing'}…</div>
        </div>
        <div class="typing-dots"><span></span><span></span><span></span></div>
      </div>
    `;
    list.appendChild(el);
    scrollToBottom();
  }
  function hideTypingIndicator() {
    document.getElementById('typingIndicator')?.remove();
  }

  async function consumeStream(streamGenerator) {
    hideTypingIndicator();

    const activeTool = ToolSelector.getActiveTool();
    const toolId = activeTool ? activeTool.tool.id : null;
    
    currentChat.messages.push({ role: 'assistant', text: '', ts: Date.now(), toolId });
    const msgIndex = currentChat.messages.length - 1;

    const list = document.getElementById('msgList');
    const el = document.createElement('div');
    el.className = 'msg msg-assistant';
    
    const title = activeTool ? activeTool.tool.title : 'ToolsHub';
    const svgIcon = activeTool ? ToolSelector.icon(activeTool.tool.icon) : '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/></svg>';

    el.innerHTML = `
      <div style="flex: 1;">
        <div style="display:flex; align-items:center; gap:var(--sp-2); margin-bottom:var(--sp-2); color:var(--text-muted); font-size:var(--fs-xs);">
          <div style="width:16px; height:16px; color:var(--text-secondary);">${svgIcon}</div>
          <div><strong>${escapeHtml(title)} Agent</strong></div>
        </div>
        <div class="msg-bubble"></div>
      </div>
    `;
    list.appendChild(el);
    const bubble = el.querySelector('.msg-bubble');

    let fullText = '';
    let isMock = false;
    
    try {
      for await (const chunk of streamGenerator) {
        // __isMock sentinel from aiApi — don't render, just flag
        if (chunk && typeof chunk === 'object' && chunk.__isMock) {
          isMock = true;
          continue;
        }
        fullText += chunk;
        // Efficiently render markdown while streaming (can be heavy, but DOMPurify is fast)
        bubble.innerHTML = renderMarkdown(fullText);
        scrollToBottom();
      }
    } catch (err) {
      fullText += `\n\n[Error: ${err.message}]`;
      bubble.textContent = fullText;
      currentChat.messages[msgIndex].isError = true;
    }

    // Finalize UI
    currentChat.messages[msgIndex].text = fullText;
    if (isMock) currentChat.messages[msgIndex].isMock = true;
    currentChat.updatedAt = Date.now();
    
    // Save generated message to Firestore/LocalStorage
    await CloudDB.saveMessage(currentChat.id, currentChat.messages[msgIndex]);
    
    // Track usage (approximation for now, as tokenizer is backend-only typically)
    const tokensCount = Math.floor(fullText.length / 4);
    await CloudDB.trackUsage(tokensCount);
    renderMessages(); // re-render to attach action buttons on final state
  }

  async function persist() {
    if (currentChat) await CloudDB.saveConversation(currentChat);
    await Sidebar.renderHistory();
  }


  function init() {
    const textarea = document.getElementById('inputTextarea');
    const sendBtn = document.getElementById('sendBtn');

    function updateSendState() {
      const hasText = textarea.value.trim().length > 0;
      sendBtn.classList.toggle('is-ready', hasText);
    }
    function autoExpand() {
      textarea.style.height = 'auto';
      textarea.style.height = Math.min(textarea.scrollHeight, 160) + 'px';
    }

    textarea.addEventListener('input', () => { updateSendState(); autoExpand(); });
    textarea.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        doSend();
      }
    });
    sendBtn.addEventListener('click', doSend);

    function doSend() {
      const text = textarea.value;
      if (!text.trim()) return;
      sendMessage(text);
      textarea.value = '';
      textarea.style.height = 'auto';
      updateSendState();
    }

    document.getElementById('newChatBtn')?.addEventListener('click', () => {
      newChat();
      if (window.matchMedia('(max-width: 860px)').matches) Sidebar.close();
    });

    document.getElementById('homeLogoBtn')?.addEventListener('click', () => {
      newChat();
      if (window.matchMedia('(max-width: 860px)').matches) Sidebar.close();
    });

    const chatBody = document.getElementById('chatBody');
    const scrollBtn = document.getElementById('scrollToBottomBtn');
    if (chatBody && scrollBtn) {
      chatBody.addEventListener('scroll', () => {
        const isNearBottom = chatBody.scrollHeight - chatBody.scrollTop - chatBody.clientHeight < 50;
        if (isNearBottom) {
          isAutoScrollPaused = false;
          scrollBtn.classList.remove('is-visible');
        } else {
          isAutoScrollPaused = true;
          scrollBtn.classList.add('is-visible');
        }
      });
      scrollBtn.addEventListener('click', () => {
        scrollToBottom(true);
      });
    }

    // prompt card clicks feed the input
    document.getElementById('promptCards')?.addEventListener('click', (e) => {
      const card = e.target.closest('.prompt-card');
      if (!card) return;
      const title = card.querySelector('.prompt-card-title').textContent;
      textarea.value = title;
      textarea.focus();
      updateSendState();
      autoExpand();
    });

    // Share button — Pattern A: real Web Share API with clipboard fallback + toast
    document.getElementById('shareBtn')?.addEventListener('click', async () => {
      const title = currentChat ? currentChat.title : 'ToolsHub';
      const url   = currentChat
        ? location.origin + location.pathname + '#chat=' + currentChat.id
        : location.href;
      const text  = currentChat
        ? `Check out my ToolsHub chat: "${title}"`
        : 'Check out ToolsHub';

      if (navigator.share) {
        try {
          await navigator.share({ title, text, url });
          return; // native sheet handled it
        } catch (err) {
          if (err.name === 'AbortError') return; // user cancelled, no toast needed
        }
      }
      // fallback: copy to clipboard
      try {
        await navigator.clipboard.writeText(url);
        Toast.show('Link copied.');
      } catch (_) {
        Toast.show('Could not copy link.');
      }
    });
  }

  return { init, newChat, loadChat, sendMessage, assignProject };
})();
