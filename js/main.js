/* ============================================
   TOOLSHUB — MAIN
   Settings screen nav, theme toggle, app bootstrap
   ============================================ */

const Settings = (() => {
  function open() {
    document.getElementById('app').setAttribute('data-screen', 'settings');
    if (window.matchMedia('(max-width: 860px)').matches) Sidebar.close();
  }
  function close() {
    document.getElementById('app').setAttribute('data-screen', 'chat');
  }

  function applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    document.getElementById('themeLabel').textContent = theme === 'dark' ? 'Dark' : 'Light';
    Storage.setTheme(theme);
  }

  function toggleTheme() {
    const current = document.documentElement.getAttribute('data-theme');
    applyTheme(current === 'dark' ? 'light' : 'dark');
  }

  function init() {
    document.getElementById('openSettingsBtn')?.addEventListener('click', open);
    document.getElementById('settingsBackBtn')?.addEventListener('click', close);
    document.getElementById('themeToggleRow')?.addEventListener('click', toggleTheme);

    // restore saved theme
    applyTheme(Storage.getTheme());
  }

  return { init, open, close, toggleTheme };
})();

/* ---------- APP BOOTSTRAP ---------- */
document.addEventListener('DOMContentLoaded', () => {
  ToolSelector.init();
  Sidebar.init();
  BottomSheet.init();
  Chat.init();
  Settings.init();

  // restore last active chat, or show empty state with no tool selected
  const lastChatId = Storage.getActiveChatId();
  const lastChat = lastChatId ? Storage.getChat(lastChatId) : null;
  if (lastChat) {
    Chat.loadChat(lastChat.id);
  } else {
    Chat.newChat();
  }
});
