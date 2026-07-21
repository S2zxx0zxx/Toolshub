/* ============================================
   TOOLSHUB — STORAGE
   Wraps localStorage for chats, settings, theme.
   Every read/write in the app goes through here.
   ============================================ */



export const LocalSettings = (() => {
  const KEYS = {
    CHATS:              'toolshub_chats',
    THEME:              'toolshub_theme',
    ACTIVE_CHAT:        'toolshub_active_chat',
    ENABLED_CATEGORIES: 'toolshub_enabled_categories', // array of enabled category ids, null = all enabled
    PROJECTS:           'toolshub_projects',            // array of { id, name }
    TOOL_ACCESS:        'toolshub_tool_access',         // 'auto' | 'always-ask' | 'off'
    PROFILE:            'toolshub_profile',             // { name, email }
    WEB_SEARCH:         'toolshub_web_search',          // boolean
    SELECTED_CHAT_MODEL: 'toolshub_selected_chat_model', // string model id
    PERSONA:            'toolshub_persona',             // string persona id or null
    CURRENT_PLAN:       'toolshub_current_plan',        // string plan id
    AGENT_INTRO:        'toolshub_agent_intro',         // boolean
    TOOL_USAGE:         'th_tool_usage',                // { [toolId]: count }
  };

  function _safeGet(key, fallback) {
    try {
      const raw = localStorage.getItem(key);
      return raw ? JSON.parse(raw) : fallback;
    } catch (e) {
      console.warn('LocalSettings read failed for', key, e);
      return fallback;
    }
  }

  function _safeSet(key, value) {
    try {
      localStorage.setItem(key, JSON.stringify(value));
      return true;
    } catch (e) {
      console.warn('LocalSettings write failed for', key, e);
      return false;
    }
  }

  return {
    // ---------- SELECTED CHAT MODEL ----------
    getSelectedChatModel() {
      return _safeGet(KEYS.SELECTED_CHAT_MODEL, null);
    },
    setSelectedChatModel(modelId) {
      _safeSet(KEYS.SELECTED_CHAT_MODEL, modelId);
    },

    // ---------- CURRENT PLAN ----------
    getCurrentPlan() {
      return _safeGet(KEYS.CURRENT_PLAN, 'free');
    },
    setCurrentPlan(planId) {
      _safeSet(KEYS.CURRENT_PLAN, planId);
    },

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
    clearAllChats() {
      _safeSet(KEYS.CHATS, []);
      _safeSet(KEYS.ACTIVE_CHAT, null);
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

    // ---------- ENABLED CATEGORIES ----------
    // null means "all enabled" (default, first-run state)
    getEnabledCategories() {
      return _safeGet(KEYS.ENABLED_CATEGORIES, null);
    },
    setEnabledCategories(ids) {
      _safeSet(KEYS.ENABLED_CATEGORIES, ids);
    },

    // ---------- PROJECTS ----------
    getProjects() {
      return _safeGet(KEYS.PROJECTS, []);
    },
    saveProject(project) {
      const list = this.getProjects();
      const idx = list.findIndex(p => p.id === project.id);
      if (idx >= 0) list[idx] = project;
      else list.push(project);
      _safeSet(KEYS.PROJECTS, list);
    },
    getActiveProject() {
      // active project id is stored as first item convention — read from projects
      return _safeGet(KEYS.PROJECTS + '_active', null);
    },
    setActiveProject(projectId) {
      _safeSet(KEYS.PROJECTS + '_active', projectId);
    },

    // ---------- TOOL ACCESS ----------
    getToolAccess() {
      return _safeGet(KEYS.TOOL_ACCESS, 'auto');
    },
    setToolAccess(value) {
      _safeSet(KEYS.TOOL_ACCESS, value);
    },

    // ---------- PROFILE ----------
    getProfile() {
      return _safeGet(KEYS.PROFILE, { name: 'Your Name', email: 'you@example.com' });
    },
    setProfile(profile) {
      _safeSet(KEYS.PROFILE, profile);
    },

    // ---------- WEB SEARCH ----------
    getWebSearchEnabled() {
      const val = _safeGet(KEYS.WEB_SEARCH, false);
      return val === true;
    },
    setWebSearchEnabled(value) {
      _safeSet(KEYS.WEB_SEARCH, !!value);
    },

    // ---------- PERSONA ----------
    getPersona() {
      return _safeGet(KEYS.PERSONA, null);
    },
    setPersona(personaId) {
      _safeSet(KEYS.PERSONA, personaId);
    },

    // ---------- AGENT INTRO ----------
    getHasSeenAgentIntro() {
      return _safeGet(KEYS.AGENT_INTRO, false);
    },
    setHasSeenAgentIntro(value) {
      _safeSet(KEYS.AGENT_INTRO, !!value);
    },

    // ---------- TOOL USAGE TRACKING ----------
    // Increments tool open count for dynamic pinning.
    recordToolUsage(toolId) {
      if (!toolId) return;
      const usage = _safeGet(KEYS.TOOL_USAGE, {});
      usage[toolId] = (usage[toolId] || 0) + 1;
      _safeSet(KEYS.TOOL_USAGE, usage);
    },
    getTopUsedTools(limit = 3) {
      const usage = _safeGet(KEYS.TOOL_USAGE, {});
      return Object.entries(usage)
        .sort((a, b) => b[1] - a[1])
        .slice(0, limit)
        .map(([id]) => id);
    },

    // ---------- CLEAR ALL (logout) ----------
    clearAll() {
      Object.values(KEYS).forEach(k => {
        try { localStorage.removeItem(k); } catch (e) { console.warn('Clear failed', e); }
      });
      // also clear derived active-project key
      try { localStorage.removeItem(KEYS.PROJECTS + '_active'); } catch (e) { console.warn('Clear failed', e); }
    },
  };
})();
