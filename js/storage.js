/* ============================================
   TOOLSHUB — STORAGE
   Wraps localStorage for chats, settings, theme.
   Every read/write in the app goes through here.
   ============================================ */

const Storage = (() => {
  const KEYS = {
    CHATS: 'toolshub_chats',
    THEME: 'toolshub_theme',
    ACTIVE_CHAT: 'toolshub_active_chat',
  };

  function _safeGet(key, fallback) {
    try {
      const raw = localStorage.getItem(key);
      return raw ? JSON.parse(raw) : fallback;
    } catch (e) {
      console.warn('Storage read failed for', key, e);
      return fallback;
    }
  }

  function _safeSet(key, value) {
    try {
      localStorage.setItem(key, JSON.stringify(value));
      return true;
    } catch (e) {
      console.warn('Storage write failed for', key, e);
      return false;
    }
  }

  return {
    // ---------- CHATS ----------
    // chat shape: { id, title, toolId, messages: [{role, text, ts}], createdAt, updatedAt }
    getAllChats() {
      return _safeGet(KEYS.CHATS, []);
    },
    saveChat(chat) {
      const chats = this.getAllChats();
      const idx = chats.findIndex(c => c.id === chat.id);
      if (idx >= 0) chats[idx] = chat;
      else chats.unshift(chat);
      _safeSet(KEYS.CHATS, chats);
    },
    deleteChat(chatId) {
      const chats = this.getAllChats().filter(c => c.id !== chatId);
      _safeSet(KEYS.CHATS, chats);
    },
    getChat(chatId) {
      return this.getAllChats().find(c => c.id === chatId) || null;
    },

    // ---------- ACTIVE CHAT POINTER ----------
    getActiveChatId() {
      return _safeGet(KEYS.ACTIVE_CHAT, null);
    },
    setActiveChatId(chatId) {
      _safeSet(KEYS.ACTIVE_CHAT, chatId);
    },

    // ---------- THEME ----------
    getTheme() {
      return _safeGet(KEYS.THEME, 'dark');
    },
    setTheme(theme) {
      _safeSet(KEYS.THEME, theme);
    },
  };
})();

window.Storage = Storage;
