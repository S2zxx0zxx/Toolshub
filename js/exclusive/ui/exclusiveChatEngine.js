/* ============================================
   TOOLSHUB EXCLUSIVE — CHAT ENGINE
   Mirrors Lite's chatEngine.js but heavily
   customized for Master Tool orchestration.
   ============================================ */

import { MasterTool } from '../ai/masterTool.js';
import { ModelPickerExclusive } from './modelPickerExclusive.js';
import { CloudDB } from '../../services/cloudDb.js';
import { LocalSettings } from '../../services/localSettings.js';
import { Toast } from '../../ui/toast.js';

export const ExclusiveChatEngine = (() => {

  let currentChat = null;
  let isSending = false;
  let isFusing = false; // Tracks if Master Tool is actively fan-out merging

  function genId() {
    return 'exc_' + Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
  }

  function setSendLocked(locked) {
    const sendBtn = document.getElementById('exSendBtn');
    const textarea = document.getElementById('exInputTextarea');
    if (sendBtn) sendBtn.disabled = locked;
    if (textarea) textarea.disabled = locked;
  }

  function renderEmptyState() {
    const emptyState = document.getElementById('exEmptyState');
    const msgList = document.getElementById('exMsgList');
    if (emptyState) emptyState.style.display = 'flex';
    if (msgList) {
      msgList.style.display = 'none';
      msgList.innerHTML = '';
    }
  }

  function newChat() {
    currentChat = {
      id: genId(),
      title: 'New Exclusive Chat',
      messages: [],
      createdAt: Date.now(),
      updatedAt: Date.now()
    };
    const chatTitle = document.getElementById('exChatTitle');
    if (chatTitle) chatTitle.textContent = 'New Exclusive Chat';
    renderEmptyState();
  }

  // Renders the saved exclusive chat history into #exclusiveChatHistory
  function renderExclusiveChatHistory(chats) {
    const historyEl = document.getElementById('exclusiveChatHistory');
    if (!historyEl) return;
    if (!chats || chats.length === 0) {
      historyEl.innerHTML = '<p class="exclusive-history-empty">No past chats yet.</p>';
      return;
    }
    historyEl.innerHTML = chats.map(chat => `
      <div class="exclusive-history-item" data-id="${chat.id}">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="width:14px;height:14px;flex-shrink:0;opacity:0.6">
          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
        </svg>
        <span class="exclusive-history-title">${chat.title || 'Exclusive Chat'}</span>
      </div>
    `).join('');
    // Wire click listeners to reload a past chat's messages
    historyEl.querySelectorAll('.exclusive-history-item').forEach(item => {
      item.addEventListener('click', () => {
        const chatId = item.dataset.id;
        const found = chats.find(c => c.id === chatId);
        if (found) {
          currentChat = found;
          document.getElementById('exChatTitle').textContent = found.title || 'Exclusive Chat';
          const list = document.getElementById('exMsgList');
          document.getElementById('exEmptyState').style.display = 'none';
          list.style.display = 'block';
          list.innerHTML = (found.messages || []).map(m => `
            <div class="ex-msg ex-msg-${m.role === 'user' ? 'user' : 'ai'}">
              <div class="ex-msg-bubble">${m.role === 'user'
                ? escapeHtml(m.text)
                : formatMarkdown(m.text)}</div>
            </div>
          `).join('');
        }
      });
    });
  }

  // --- Master Tool Toggle UI ---
  function updateMasterToolUI() {
    const toggle = document.getElementById('exMasterToolToggle');
    if (!toggle) return;
    
    if (isFusing) {
      toggle.className = 'ex-mt-toggle is-fusing';
      document.getElementById('exMtLabel').textContent = 'Fusing Models...';
      ModelPickerExclusive.setDisabled(true);
    } else if (MasterTool.getEnabled()) {
      toggle.className = 'ex-mt-toggle is-on';
      document.getElementById('exMtLabel').textContent = 'Master Tool: ON';
      ModelPickerExclusive.setDisabled(true);
    } else {
      toggle.className = 'ex-mt-toggle is-off';
      document.getElementById('exMtLabel').textContent = 'Master Tool: OFF';
      ModelPickerExclusive.setDisabled(false);
    }

    // Also update Topbar Pill
    const pill = document.getElementById('exAiStatusPill');
    if (pill) {
      if (isFusing) {
        pill.classList.add('is-fusing');
        pill.innerHTML = '<div class="ex-ai-status-dot"></div> FUSING';
      } else {
        pill.classList.remove('is-fusing');
        pill.innerHTML = '<div class="ex-ai-status-dot"></div> CONNECTED';
      }
    }
  }

  function toggleMasterTool() {
    if (isFusing) return; // Prevent toggle mid-generation
    MasterTool.setEnabled(!MasterTool.getEnabled());
    updateMasterToolUI();
  }

  // --- Messaging ---
  async function sendMessage() {
    if (isSending) return;
    const textarea = document.getElementById('exInputTextarea');
    const text = textarea.value.trim();
    if (!text) return;

    if (!currentChat) newChat();

    // Reset textarea
    textarea.value = '';
    textarea.style.height = 'auto';
    setSendLocked(true);
    isSending = true;

    // Remove empty state
    document.getElementById('exEmptyState').style.display = 'none';
    const list = document.getElementById('exMsgList');
    list.style.display = 'block';

    // Add User Message
    const userMsg = { role: 'user', text, ts: Date.now() };
    currentChat.messages.push(userMsg);
    
    // Determine title if first msg
    if (currentChat.messages.length === 1) {
      currentChat.title = text.slice(0, 40) + (text.length > 40 ? '...' : '');
      document.getElementById('exChatTitle').textContent = currentChat.title;
    }

    // Render User Msg
    list.insertAdjacentHTML('beforeend', `
      <div class="ex-msg ex-msg-user">
        <div class="ex-msg-bubble">${escapeHtml(text)}</div>
      </div>
    `);
    scrollToBottom();

    // Prepare AI Msg Placeholder
    const usedMasterTool = MasterTool.getEnabled();
    const aiMsgId = 'exc_ai_' + Date.now();
    const aiBubbleHtml = `
      <div class="ex-msg ex-msg-ai ${usedMasterTool ? 'is-merged' : ''}" id="${aiMsgId}">
        ${usedMasterTool ? `<div class="ex-msg-merged-badge"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path><polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline><line x1="12" y1="22.08" x2="12" y2="12"></line></svg> Master Tool Synthesis</div>` : ''}
        <div class="ex-msg-bubble"><span class="typing-cursor"></span></div>
      </div>
    `;
    list.insertAdjacentHTML('beforeend', aiBubbleHtml);
    scrollToBottom();

    const bubbleEl = document.getElementById(aiMsgId).querySelector('.ex-msg-bubble');
    
    // Format messages for API
    const apiMessages = currentChat.messages.map(m => ({ role: m.role, content: m.text }));

    let fullAiResponse = '';

    try {
      if (!MasterTool.getEnabled()) {
        // If OFF, ensure LocalSettings uses the selected picker model just for this request
        LocalSettings.setSelectedChatModel(ModelPickerExclusive.getSelectedModel());
      }

      const stream = MasterTool.processStream(apiMessages, {
        onFanOutStart: () => {
          isFusing = true;
          updateMasterToolUI();
        },
        onFanOutEnd: () => {
          isFusing = false;
          updateMasterToolUI();
        }
      });

      for await (const chunk of stream) {
        fullAiResponse += chunk;
        bubbleEl.innerHTML = formatMarkdown(fullAiResponse) + '<span class="typing-cursor"></span>';
        scrollToBottom();
      }

      // Done
      bubbleEl.innerHTML = formatMarkdown(fullAiResponse);

      // Save to chat
      currentChat.messages.push({ role: 'assistant', text: fullAiResponse, ts: Date.now() });
      currentChat.updatedAt = Date.now();
      // Persist to Firestore / local storage and refresh the history sidebar
      CloudDB.saveConversation(currentChat).then(() => {
        CloudDB.subscribeConversations(renderExclusiveChatHistory);
      }).catch(e => console.warn('Exclusive chat save failed:', e));
      
    } catch (e) {
      console.error(e);
      bubbleEl.innerHTML = `<span style="color:var(--danger);">Error: ${e.message}</span>`;
      isFusing = false;
      updateMasterToolUI();
    }

    setSendLocked(false);
    isSending = false;
    setTimeout(() => document.getElementById('exInputTextarea')?.focus(), 50);
  }

  // --- Utils ---
  function scrollToBottom() {
    const list = document.getElementById('exChatScroll');
    if (list) list.scrollTop = list.scrollHeight;
  }

  function escapeHtml(str) {
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
  }

  function formatMarkdown(text) {
    // Ultra basic markdown for safety. In real app, import marked.js
    let html = escapeHtml(text);
    html = html.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    html = html.replace(/\*(.*?)\*/g, '<em>$1</em>');
    html = html.replace(/```([\s\S]*?)```/g, '<pre><code>$1</code></pre>');
    html = html.replace(/`(.*?)`/g, '<code>$1</code>');
    return html.replace(/\n/g, '<br>');
  }

  const html = `
    <!-- Topbar -->
    <div class="ex-chat-topbar">
      <div class="ex-chat-topbar-left">
        <button id="exChatHamburger" class="btn-icon ex-chat-hamburger">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="18" x2="21" y2="18"/></svg>
        </button>
        <div class="ex-chat-title-group">
          <div class="ex-chat-title" id="exChatTitle">New Exclusive Chat</div>
          <div class="ex-chat-subtitle">Uncompromised Power</div>
        </div>
      </div>
      <div class="ex-chat-topbar-right">
        <div id="exAiStatusPill" class="ex-ai-status-pill">
          <div class="ex-ai-status-dot"></div> CONNECTED
        </div>
      </div>
    </div>

    <!-- Scroll Area -->
    <div class="ex-chat-scroll" id="exChatScroll">
      <div id="exEmptyState" class="ex-chat-empty">
        <div class="ex-chat-empty-icon">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/></svg>
        </div>
        <h3>How can I help you?</h3>
        <p>You are in the Exclusive workspace. All limits removed.</p>
      </div>
      <div id="exMsgList" style="display:none; padding-bottom: 20px;"></div>
    </div>

    <!-- Input Bar -->
    <div class="ex-input-wrapper">
      <div class="ex-input-card">
        <textarea id="exInputTextarea" class="ex-textarea" placeholder="Ask anything..."></textarea>
        <div class="ex-input-actions">
          <div class="ex-input-models-row">
            <!-- Master Tool Toggle -->
            <button id="exMasterToolToggle" class="ex-mt-toggle is-on">
              <svg class="ex-mt-icon-off" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/><path d="M9 12l2 2 4-4"/></svg>
              <svg class="ex-mt-icon-on" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/></svg>
              <svg class="ex-mt-icon-fusing" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>
              <span id="exMtLabel">Master Tool: ON</span>
            </button>
            <!-- Model Picker Injected Here -->
            <div id="exModelPickerContainer"></div>
          </div>
          <button id="exSendBtn" class="ex-send-btn">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>
          </button>
        </div>
      </div>
    </div>
  `;

  function init() {
    const container = document.getElementById('screenExclusiveChat');
    if (!container) return;
    container.innerHTML = html;

    ModelPickerExclusive.init('#exModelPickerContainer', () => {
      // If user manually picks a model, turn Master Tool off automatically
      if (MasterTool.getEnabled()) {
        toggleMasterTool();
      }
    });

    document.getElementById('exMasterToolToggle')?.addEventListener('click', toggleMasterTool);
    document.getElementById('exSendBtn')?.addEventListener('click', sendMessage);
    
    const textarea = document.getElementById('exInputTextarea');
    textarea?.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        sendMessage();
      }
    });
    textarea?.addEventListener('input', () => {
      textarea.style.height = 'auto';
      textarea.style.height = Math.min(textarea.scrollHeight, 200) + 'px';
    });

    document.getElementById('exChatHamburger')?.addEventListener('click', () => {
      document.getElementById('exclusiveShell').setAttribute('data-sidebar', 'open');
      document.getElementById('exclusiveSidebarOverlay').style.display = 'block';
    });

    newChat();
    updateMasterToolUI();
    // Populate history sidebar with any previously saved Exclusive chats
    CloudDB.subscribeConversations(renderExclusiveChatHistory);
  }

  return { init, newChat };
})();
