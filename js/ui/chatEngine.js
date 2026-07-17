/* ============================================
   TOOLSHUB — CHAT
   Message rendering, fake typewriter streaming,
   send flow, chat lifecycle (new/load/save)
   ============================================ */

import { Storage } from '../services/storage.js';
import { ToolSelector } from '../tools/registry.js';
import { Sidebar } from './sidebar.js';
import { Toast } from './toast.js';

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
      projectId: Storage.getActiveProject() || null,
    };
    Storage.setActiveChatId(currentChat.id);
    renderEmptyState();
    document.getElementById('chatTitle').textContent = 'New chat';
    Sidebar.renderHistory();
  }

  function loadChat(chatId) {
    const chat = Storage.getChat(chatId);
    if (!chat) return;
    currentChat = chat;
    Storage.setActiveChatId(chatId);
    document.getElementById('chatTitle').textContent = chat.title;

    if (chat.toolId) ToolSelector.selectTool(chat.toolId, { silent: true });

    if (chat.messages.length === 0) {
      renderEmptyState();
    } else {
      renderMessages();
    }
    Sidebar.renderHistory();
  }

  function assignProject(projectId) {
    if (!currentChat) return;
    currentChat.projectId = projectId;
    currentChat.updatedAt = Date.now();
    persist();
    Sidebar.renderHistory();
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
    const title = found ? found.tool.title : 'ToolsHub';
    const svgIcon = found ? ToolSelector.icon(found.tool.icon) : '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/></svg>';

    return `
      <div class="msg msg-assistant">
        <div style="flex: 1;">
          <div style="display:flex; align-items:center; gap:var(--sp-2); margin-bottom:var(--sp-2); color:var(--text-muted); font-size:var(--fs-xs);">
            <div style="width:16px; height:16px; color:var(--text-secondary);">${svgIcon}</div>
            <div><strong>${escapeHtml(title)} Agent</strong></div>
          </div>
          <div class="msg-bubble">${escapeHtml(m.text)}</div>
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
      };
    });
  }

  function escapeHtml(str) {
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
  }

  function scrollToBottom() {
    const body = document.getElementById('chatBody');
    body.scrollTop = body.scrollHeight;
  }

  // ---------- SEND FLOW ----------
  function sendMessage(text) {
    if (!text.trim()) return;
    if (!currentChat) newChat();

    // auto-title from first message
    if (currentChat.messages.length === 0) {
      currentChat.title = text.slice(0, 48) + (text.length > 48 ? '…' : '');
      document.getElementById('chatTitle').textContent = currentChat.title;
    }

    currentChat.messages.push({ role: 'user', text, ts: Date.now() });
    currentChat.updatedAt = Date.now();
    renderMessages();
    persist();

    showTypingIndicator();
    // placeholder fake response — replace with real API call later
    setTimeout(() => {
      hideTypingIndicator();
      const activeTool = ToolSelector.getActiveTool();
      const toolName = activeTool ? activeTool.tool.title : 'this tool';
      const reply = `This is a placeholder response from ${toolName}. Connect your backend API here to generate real output.`;
      streamAssistantReply(reply);
    }, 900);
  }

  function showTypingIndicator() {
    const list = document.getElementById('msgList');
    const el = document.createElement('div');
    el.className = 'msg msg-assistant';
    el.id = 'typingIndicator';
    
    const activeTool = ToolSelector.getActiveTool();
    const title = activeTool ? activeTool.tool.title : 'ToolsHub';
    const svgIcon = activeTool ? ToolSelector.icon(activeTool.tool.icon) : '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/></svg>';

    el.innerHTML = `
      <div style="flex: 1;">
        <div style="display:flex; align-items:center; gap:var(--sp-2); margin-bottom:var(--sp-2); color:var(--text-muted); font-size:var(--fs-xs);">
          <div style="width:16px; height:16px; color:var(--text-secondary);">${svgIcon}</div>
          <div><strong>${escapeHtml(title)} Agent</strong> is typing…</div>
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

  // fake typewriter streaming effect (real streaming plugs in here later)
  function streamAssistantReply(fullText) {
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

    let i = 0;
    const speed = 14; // ms per character
    function tick() {
      if (i <= fullText.length) {
        bubble.textContent = fullText.slice(0, i);
        currentChat.messages[msgIndex].text = fullText.slice(0, i);
        scrollToBottom();
        i += 2;
        setTimeout(tick, speed);
      } else {
        bubble.textContent = fullText;
        currentChat.messages[msgIndex].text = fullText;
        currentChat.updatedAt = Date.now();
        persist();
        renderMessages(); // re-render to attach action buttons on final state
      }
    }
    tick();
  }

  function persist() {
    if (currentChat) Storage.saveChat(currentChat);
    Sidebar.renderHistory();
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
