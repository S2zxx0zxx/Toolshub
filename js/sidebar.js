/* ============================================
   TOOLSHUB — SIDEBAR
   Drawer open/close (mobile) + chat history list
   ============================================ */

const Sidebar = (() => {

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

  function renderHistory() {
    const container = document.getElementById('chatHistoryGroups');
    if (!container) return;

    const chats = Storage.getAllChats().sort((a, b) => b.updatedAt - a.updatedAt);
    if (chats.length === 0) {
      container.innerHTML = '';
      return;
    }

    const groups = { Today: [], Yesterday: [], Older: [] };
    chats.forEach(c => groups[groupLabel(c.updatedAt)].push(c));

    const activeId = Storage.getActiveChatId();
    let html = '';
    ['Today', 'Yesterday', 'Older'].forEach(label => {
      if (groups[label].length === 0) return;
      html += `<div class="sidebar-group-label">${label}</div>`;
      groups[label].forEach(c => {
        html += `<div class="chat-item ${c.id === activeId ? 'is-active' : ''}" data-chat-id="${c.id}">${escapeHtml(c.title || 'New chat')}</div>`;
      });
    });
    container.innerHTML = html;

    container.querySelectorAll('.chat-item').forEach(node => {
      node.addEventListener('click', () => {
        if (window.Chat) window.Chat.loadChat(node.dataset.chatId);
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
    document.getElementById('hamburgerBtn')?.addEventListener('click', open);
    document.getElementById('sidebarCloseBtn')?.addEventListener('click', close);
    document.getElementById('sidebarOverlay')?.addEventListener('click', close);
    renderHistory();
  }

  return { init, open, close, toggle, renderHistory };
})();

window.Sidebar = Sidebar;
