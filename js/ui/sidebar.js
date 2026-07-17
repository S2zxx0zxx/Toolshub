/* ============================================
   TOOLSHUB — SIDEBAR
   Drawer open/close (mobile) + chat history list
   ============================================ */

import { LocalSettings } from '../services/localSettings.js';
import { Chat } from './chatEngine.js';

export const Sidebar = (() => {

  function open() {
    document.getElementById('app').setAttribute('data-sidebar', 'open');
  }
  function close() {
    document.getElementById('app').removeAttribute('data-sidebar');
  }
  function toggle() {
    const app = document.getElementById('app');
    if (app.getAttribute('data-sidebar') === 'open') close();
    else open();
  }

  // ---------- CHAT HISTORY GROUPING ----------
  function groupLabel(ts) {
    const now = new Date();
    const d = new Date(ts);
    const isToday = d.toDateString() === now.toDateString();
    const yesterday = new Date(now);
    yesterday.setDate(now.getDate() - 1);
    const isYesterday = d.toDateString() === yesterday.toDateString();
    if (isToday) return 'Today';
    if (isYesterday) return 'Yesterday';
    return 'Older';
  }

  function renderProjects() {
    const container = document.getElementById('sidebarProjectsList');
    if (!container) return;

    const projects = LocalSettings.getProjects();
    if (projects.length === 0) {
      container.innerHTML = '';
      return;
    }

    const activeId = LocalSettings.getActiveProject();
    let html = `<div class="sidebar-group-label">Projects</div>`;
    projects.forEach(p => {
      html += `<div class="chat-item ${p.id === activeId ? 'is-active' : ''}" data-project-id="${p.id}">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="width:16px;height:16px;margin-right:8px;flex-shrink:0;"><path d="M22 19a2 2 0 01-2 2H4a2 2 0 01-2-2V5a2 2 0 012-2h5l2 3h9a2 2 0 012 2z"/></svg>
        ${escapeHtml(p.name)}
      </div>`;
    });
    container.innerHTML = html;

    container.querySelectorAll('.chat-item').forEach(node => {
      node.addEventListener('click', () => {
        LocalSettings.setActiveProject(node.dataset.projectId);
        renderProjects();
        renderHistory();
      });
    });
  }

  let currentChats = [];

  function setChats(chats) {
    currentChats = chats;
    renderHistory();
  }

  function renderHistory() {
    const container = document.getElementById('chatHistoryGroups');
    if (!container) return;

    let chats = [...currentChats].sort((a, b) => {
      const tsA = a.updatedAt?.toMillis ? a.updatedAt.toMillis() : a.updatedAt;
      const tsB = b.updatedAt?.toMillis ? b.updatedAt.toMillis() : b.updatedAt;
      return (tsB || 0) - (tsA || 0);
    });
    const activeProject = LocalSettings.getActiveProject();
    
    if (activeProject) {
      chats = chats.filter(c => c.projectId === activeProject);
    }
    if (chats.length === 0) {
      container.innerHTML = '';
      return;
    }

    const groups = { Today: [], Yesterday: [], Older: [] };
    chats.forEach(c => {
      const ts = c.updatedAt?.toMillis ? c.updatedAt.toMillis() : c.updatedAt;
      groups[groupLabel(ts || Date.now())].push(c);
    });

    const activeId = LocalSettings.getActiveChatId();
    let html = '';
    
    if (activeProject) {
      html += `
        <div class="chat-item" id="backToAllChats" style="color:var(--text-secondary); font-weight:500; margin-bottom:var(--sp-2);">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="width:16px;height:16px;margin-right:8px;"><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/></svg>
          Back to all chats
        </div>`;
    }

    ['Today', 'Yesterday', 'Older'].forEach(label => {
      if (groups[label].length === 0) return;
      html += `<div class="sidebar-group-label">${label}</div>`;
      groups[label].forEach(c => {
        html += `<div class="chat-item ${c.id === activeId ? 'is-active' : ''}" data-chat-id="${c.id}">${escapeHtml(c.title || 'New chat')}</div>`;
      });
    });
    container.innerHTML = html;

    container.querySelectorAll('.chat-item').forEach(node => {
      if (node.id === 'backToAllChats') {
        node.addEventListener('click', () => {
          LocalSettings.setActiveProject(null);
          renderProjects();
          renderHistory();
        });
        return;
      }
      node.addEventListener('click', () => {
        const chatData = chats.find(c => c.id === node.dataset.chatId);
        if (Chat) Chat.loadChat(node.dataset.chatId, chatData);
        if (window.matchMedia('(max-width: 860px)').matches) close();
      });
    });
  }

  function escapeHtml(str) {
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
  }

  function init() {
    document.getElementById('sidebarOverlay')?.addEventListener('click', close);
    document.getElementById('sidebarCloseBtn')?.addEventListener('click', close);
    document.getElementById('hamburgerBtn')?.addEventListener('click', open);
    renderProjects();
    renderHistory();
  }

  return { init, open, close, toggle, renderHistory, renderProjects, setChats };
})();
