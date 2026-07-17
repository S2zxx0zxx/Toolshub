/* ============================================
   TOOLSHUB — MAIN
   Settings screen nav, theme toggle, sub-screens,
   upgrade sheet, logout confirm, manage tools,
   profile, billing — app bootstrap.
   ============================================ */
import { LocalSettings } from '../services/localSettings.js';
import { Toast } from '../ui/toast.js';
import { Sidebar } from '../ui/sidebar.js';
import { BottomSheet } from '../ui/bottomsheet.js';
import { Chat } from '../ui/chatEngine.js';
import { ToolSelector } from '../tools/registry.js';
import { Router } from './router.js';
import { Auth } from '../services/auth.js';
import { CloudDB } from '../services/cloudDb.js';
import { initFirebase } from '../services/firebase.js';

const Settings = (() => {

  // ---------- SETTINGS SCREEN OPEN/CLOSE ----------
  function open() {
    Router.navigate('settings');
    updateManageToolsSubtitle();
  }
  function close() {
    Router.navigate('chat');
    Router.closeAllSubScreens();
  }

  // ---------- THEME ----------
  function applyTheme(theme) {
    document.documentElement.dataset.theme = theme;
    document.getElementById('themeLabel').textContent = theme === 'dark' ? 'Dark' : 'Light';
    LocalSettings.setTheme(theme);
  }

  function toggleTheme() {
    const current = document.documentElement.dataset.theme;
    applyTheme(current === 'dark' ? 'light' : 'dark');
  }

  // ---------- SUB-SCREEN HELPERS ----------
  function openSubScreen(id) {
    Router.openSubScreen(id);
  }
  function closeSubScreen(id) {
    Router.closeSubScreen(id);
  }

  // =========================================================
  // PROFILE SCREEN
  // =========================================================
  function openProfile() {
    const profile = LocalSettings.getProfile();
    // Populate fields
    const nameInput  = document.getElementById('profileNameInput');
    const emailInput = document.getElementById('profileEmailInput');
    const nameDisplay  = document.getElementById('profileNameDisplay');
    const emailDisplay = document.getElementById('profileEmailDisplay');

    if (nameInput)    nameInput.value    = profile.name;
    if (emailInput)   emailInput.value   = profile.email;
    if (nameDisplay)  nameDisplay.textContent  = profile.name;
    if (emailDisplay) emailDisplay.textContent = profile.email;

    openSubScreen('screenProfile');
  }

  function saveProfile() {
    const nameInput = document.getElementById('profileNameInput');
    const emailInput = document.getElementById('profileEmailInput');

    if (emailInput && !emailInput.checkValidity()) {
      emailInput.reportValidity();
      return;
    }

    const name  = nameInput?.value.trim()  || '';
    const email = emailInput?.value.trim() || '';
    if (!name) return;

    LocalSettings.setProfile({ name, email });

    // Live-update sidebar and settings email
    const sidebarName = document.querySelector('.sidebar-user-name');
    if (sidebarName) sidebarName.textContent = name;
    const settingsEmail = document.querySelector('.settings-account-email');
    if (settingsEmail) settingsEmail.textContent = email;

    // Update profile display
    document.getElementById('profileNameDisplay')?.textContent && (
      document.getElementById('profileNameDisplay').textContent = name
    );

    Toast.show('Profile saved.');
    closeSubScreen('screenProfile');
  }

  // =========================================================
  // BILLING SCREEN
  // =========================================================
  function openBilling() {
    openSubScreen('screenBilling');
  }

  // =========================================================
  // UPGRADE SHEET
  // =========================================================
  function openUpgradeSheet() {
    openOverlay(document.getElementById('upgradeSheetOverlay'));
  }
  function closeUpgradeSheet() {
    closeOverlay(document.getElementById('upgradeSheetOverlay'));
  }
  function openOverlay(el) {
    if (!el) return;
    el.classList.add('is-open');
    document.body.style.overflow = 'hidden';
  }
  function closeOverlay(el) {
    if (!el) return;
    el.classList.remove('is-open');
    document.body.style.overflow = '';
  }

  // =========================================================
  // API KEYS SCREEN
  // =========================================================
  function openApiKeys() {
    const input = document.getElementById('groqApiKeyInput');
    if (input) {
      input.value = localStorage.getItem('GROQ_API_KEY') || '';
    }
    openSubScreen('screenApiKeys');
  }
  function saveApiKeys() {
    const input = document.getElementById('groqApiKeyInput');
    if (input) {
      const val = input.value.trim();
      if (val) {
        localStorage.setItem('GROQ_API_KEY', val);
        Toast.show('API Key saved to your browser.');
      } else {
        localStorage.removeItem('GROQ_API_KEY');
        Toast.show('API Key removed.');
      }
    }
    closeSubScreen('screenApiKeys');
  }

  // =========================================================
  // MANAGE TOOLS SCREEN
  // =========================================================
  function updateManageToolsSubtitle() {
    const sub = document.querySelector('#manageToolsRow .list-row-subtitle');
    if (!sub) return;
    const enabledIds = LocalSettings.getEnabledCategories();
    const count = enabledIds === null ? ToolSelector.DATA.length : enabledIds.length;
    sub.textContent = `${count} ${count === 1 ? 'category' : 'categories'} enabled`;
  }

  function openManageTools() {
    renderManageToolsScreen();
    openSubScreen('screenManageTools');
  }

  function renderManageToolsScreen() {
    const container = document.getElementById('manageToolsList');
    if (!container) return;

    const enabledIds = LocalSettings.getEnabledCategories();
    // null = all enabled
    const enabledSet = enabledIds ? new Set(enabledIds) : new Set(ToolSelector.DATA.map(c => c.id));

    container.innerHTML = ToolSelector.DATA.map(cat => {
      const isEnabled = enabledSet.has(cat.id);
      return `
        <div class="manage-tools-row" data-cat-id="${cat.id}">
          <div class="manage-tools-meta">
            <div class="manage-tools-title">${cat.title}</div>
            <div class="manage-tools-sub">${cat.sub}</div>
          </div>
          <button class="toggle ${isEnabled ? 'is-on' : ''}" data-cat-id="${cat.id}" aria-pressed="${isEnabled}"></button>
        </div>
      `;
    }).join('');

    // Wire toggles
    container.querySelectorAll('.toggle').forEach(toggleEl => {
      toggleEl.addEventListener('click', (e) => handleCategoryToggle(e, toggleEl, container));
    });
  }

  function handleCategoryToggle(e, toggleEl, container) {
    e.stopPropagation();
    const catId = toggleEl.dataset.catId;

    // Re-read current state from DOM
    const currentEnabled = new Set(
      [...container.querySelectorAll('.toggle.is-on')].map(t => t.dataset.catId)
    );
    if (currentEnabled.has(catId)) {
      // Don't allow disabling the last enabled category
      if (currentEnabled.size === 1) {
        Toast.show("Can't disable all categories.");
        return;
      }
      currentEnabled.delete(catId);
      toggleEl.classList.remove('is-on');
      toggleEl.setAttribute('aria-pressed', 'false');
    } else {
      currentEnabled.add(catId);
      toggleEl.classList.add('is-on');
      toggleEl.setAttribute('aria-pressed', 'true');
    }

    const newIds = [...currentEnabled];
    // If all categories are enabled, store null (default) to keep it clean
    const allIds = ToolSelector.DATA.map(c => c.id);
    const allEnabled = allIds.every(id => newIds.includes(id));
    ToolSelector.setEnabledCategories(allEnabled ? null : newIds);
    updateManageToolsSubtitle();
  }

  // =========================================================
  // LOGOUT CONFIRM SHEET
  // =========================================================
  async function confirmLogout() {
    if (!confirm("Are you sure you want to log out?")) return;
    try {
      await Auth.logout();
      LocalSettings.clearAll();
      document.documentElement.dataset.theme = 'dark';
      Toast.show('Logged out. See you soon!');
      setTimeout(() => location.reload(), 1400);
    } catch (err) {
      Toast.show('Failed to log out.');
    }
  }

  // =========================================================
  // INIT — wire all settings listeners
  // =========================================================
  function init() {
    // Settings open/close
    document.getElementById('openSettingsBtn')?.addEventListener('click', open);
    document.getElementById('settingsBackBtn')?.addEventListener('click', close);
    document.getElementById('themeToggleRow')?.addEventListener('click', toggleTheme);

    // Restore saved theme
    applyTheme(LocalSettings.getTheme());

    // Restore profile display name in sidebar
    const profile = LocalSettings.getProfile();
    const sidebarName = document.querySelector('.sidebar-user-name');
    if (sidebarName) sidebarName.textContent = profile.name;
    const settingsEmail = document.querySelector('.settings-account-email');
    if (settingsEmail) settingsEmail.textContent = profile.email;

    // ---- Profile row (Pattern B) ----
    document.getElementById('profileRow')?.addEventListener('click', openProfile);
    document.getElementById('profileBackBtn')?.addEventListener('click', () => closeSubScreen('screenProfile'));
    document.getElementById('profileSaveBtn')?.addEventListener('click', saveProfile);

    // ---- Billing row (Pattern B) ----
    document.getElementById('billingRow')?.addEventListener('click', openBilling);
    document.getElementById('billingBackBtn')?.addEventListener('click', () => closeSubScreen('screenBilling'));

    // ---- API Keys row (Pattern B) ----
    document.getElementById('apiKeysRow')?.addEventListener('click', openApiKeys);
    document.getElementById('apiKeysBackBtn')?.addEventListener('click', () => closeSubScreen('screenApiKeys'));
    document.getElementById('apiKeysSaveBtn')?.addEventListener('click', saveApiKeys);

    // ---- Upgrade button (both in upgrade-card and billing screen — Pattern B/A) ----
    document.getElementById('upgradeBtn')?.addEventListener('click', openUpgradeSheet);
    document.getElementById('billingUpgradeBtn')?.addEventListener('click', openUpgradeSheet);
    document.getElementById('upgradeSheetCloseBtn')?.addEventListener('click', closeUpgradeSheet);

    // ---- Logout button ----
    document.getElementById('logoutRow')?.addEventListener('click', confirmLogout);
    document.getElementById('upgradeSheetOverlay')?.addEventListener('click', e => {
      if (e.target.id === 'upgradeSheetOverlay') closeUpgradeSheet();
    });
    document.getElementById('upgradeNotifyBtn')?.addEventListener('click', () => {
      Toast.show("You're on the list!");
      closeUpgradeSheet();
    });

    // ---- Manage Tools row (Pattern B — real functional depth) ----
    document.getElementById('manageToolsRow')?.addEventListener('click', openManageTools);
    document.getElementById('manageToolsBackBtn')?.addEventListener('click', () => closeSubScreen('screenManageTools'));

    // ---- Log out row (Pattern A — real clear + reload) ----
    document.getElementById('logoutBtn')?.addEventListener('click', confirmLogout);

    // Initial manage-tools subtitle sync
    updateManageToolsSubtitle();
  }

  return { init, open, close, toggleTheme };
})();

/* ---------- PWA LOGIC ---------- */
const PWA = (() => {
  let deferredPrompt = null;

  function init() {
    // 1. Register Service Worker
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('./sw.js').then(reg => {
        reg.addEventListener('updatefound', () => {
          const newWorker = reg.installing;
          newWorker.addEventListener('statechange', () => {
            if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
              // new update available
              Toast.show('Update available — tap to refresh', { duration: 0 }); // keep showing
              const toastEl = document.querySelector('.toast');
              if (toastEl) {
                toastEl.style.cursor = 'pointer';
                toastEl.addEventListener('click', () => window.location.reload());
              }
            }
          });
        });
      }).catch(err => console.log('SW ref failed', err));
    }

    // 2. Handle Install Prompt
    window.addEventListener('beforeinstallprompt', (e) => {
      e.preventDefault();
      deferredPrompt = e;
      
      const installRow = document.getElementById('installAppRow');
      if (installRow) {
        installRow.style.display = 'flex';
      }
    });

    document.getElementById('installAppRow')?.addEventListener('click', () => {
      document.getElementById('installSheetOverlay').style.display = 'flex';
      // tiny delay to allow display:flex to apply before adding is-open
      setTimeout(() => {
        document.querySelector('#installSheetOverlay .sheet').classList.add('is-open');
      }, 10);
    });

    document.getElementById('installSheetCloseBtn')?.addEventListener('click', closeInstallSheet);
    document.getElementById('installCancelBtn')?.addEventListener('click', closeInstallSheet);
    document.getElementById('installSheetOverlay')?.addEventListener('click', (e) => {
      if (e.target.id === 'installSheetOverlay') closeInstallSheet();
    });

    document.getElementById('installConfirmBtn')?.addEventListener('click', async () => {
      closeInstallSheet();
      if (deferredPrompt) {
        deferredPrompt.prompt();
        const { outcome } = await deferredPrompt.userChoice;
        if (outcome === 'accepted') {
          document.getElementById('installAppRow').style.display = 'none';
        }
        deferredPrompt = null;
      }
    });
  }

  function closeInstallSheet() {
    const sheet = document.querySelector('#installSheetOverlay .sheet');
    if (sheet) sheet.classList.remove('is-open');
    setTimeout(() => {
      document.getElementById('installSheetOverlay').style.display = 'none';
    }, 300); // match animation duration
  }

  return { init };
})();

/* ---------- APP BOOTSTRAP ---------- */
document.addEventListener('DOMContentLoaded', async () => {
  PWA.init();
  ToolSelector.init();
  Sidebar.init();
  BottomSheet.init();
  Chat.init();
  Settings.init();

  // always show empty state with no tool selected on fresh load
  Chat.newChat();

  // Initialize Firebase dynamically to avoid network-blocking module crashes
  await initFirebase();

  // ---------- AUTHENTICATION UI ----------
  let isSignupMode = false;
  const authOverlay = document.getElementById('authOverlay');
  const authEmail = document.getElementById('authEmail');
  const authPassword = document.getElementById('authPassword');
  const authName = document.getElementById('authName');
  const authSubmitBtn = document.getElementById('authSubmitBtn');
  const authToggleBtn = document.getElementById('authToggleBtn');
  const authToggleText = document.getElementById('authToggleText');

  authToggleBtn.addEventListener('click', (e) => {
    e.preventDefault();
    isSignupMode = !isSignupMode;
    authName.style.display = isSignupMode ? 'block' : 'none';
    authSubmitBtn.textContent = isSignupMode ? 'Sign Up' : 'Sign In';
    authToggleText.textContent = isSignupMode ? 'Already have an account?' : "Don't have an account?";
    authToggleBtn.textContent = isSignupMode ? 'Sign in' : 'Sign up';
  });

  authSubmitBtn.addEventListener('click', async () => {
    const email = authEmail.value.trim();
    const pass = authPassword.value;
    const name = authName.value.trim();

    if (!email || !pass || (isSignupMode && !name)) {
      Toast.show('Please fill in all fields.');
      return;
    }

    try {
      authSubmitBtn.disabled = true;
      authSubmitBtn.textContent = 'Processing...';
      if (isSignupMode) {
        await Auth.signup(email, pass, name);
      } else {
        await Auth.login(email, pass);
      }
    } catch (err) {
      Toast.show(err.message || 'Authentication failed.');
      authSubmitBtn.disabled = false;
      authSubmitBtn.textContent = isSignupMode ? 'Sign Up' : 'Sign In';
    }
  });

  const authGoogleBtn = document.getElementById('authGoogleBtn');
  if (authGoogleBtn) {
    authGoogleBtn.addEventListener('click', async (e) => {
      e.preventDefault();
      try {
        authGoogleBtn.disabled = true;
        authGoogleBtn.innerHTML = 'Connecting...';
        await Auth.signInWithGoogle();
      } catch (err) {
        Toast.show(err.message || 'Google Sign-In failed.');
        authGoogleBtn.disabled = false;
        authGoogleBtn.innerHTML = `
          <svg viewBox="0 0 24 24" width="18" height="18" xmlns="http://www.w3.org/2000/svg"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/><path d="M1 1h22v22H1z" fill="none"/></svg>
          Continue with Google
        `;
      }
    });
  }

  document.getElementById('authSkipBtn')?.addEventListener('click', () => {
    document.getElementById('authOverlay').style.display = 'none';
  });

  document.getElementById('sidebarLoginBtn')?.addEventListener('click', () => {
    document.getElementById('authOverlay').style.display = 'flex';
  });

  Auth.onAuthStateChanged(user => {
    const avatarEl = document.querySelector('.sidebar-avatar');
    const nameEl = document.querySelector('.sidebar-user-name');
    const settingsAvatarEl = document.querySelector('.settings-avatar-lg');
    const settingsEmailEl = document.querySelector('.settings-account-email');
    const sidebarLoginBtn = document.getElementById('sidebarLoginBtn');

    if (user) {
      // User is logged in
      authOverlay.style.display = 'none';
      const name = user.displayName || user.email.split('@')[0];
      const initial = name.charAt(0).toUpperCase();
      
      if (avatarEl) avatarEl.textContent = initial;
      if (nameEl) nameEl.textContent = name;
      if (settingsAvatarEl) settingsAvatarEl.textContent = initial;
      if (settingsEmailEl) settingsEmailEl.textContent = user.email;
      if (sidebarLoginBtn) sidebarLoginBtn.style.display = 'none';
      const logoutRow = document.getElementById('logoutRow');
      if (logoutRow) logoutRow.style.display = 'flex';
      const logoutBtn = document.getElementById('logoutBtn');
      if (logoutBtn) logoutBtn.parentElement.style.display = 'block';
      
      Toast.show(`Welcome, ${name}!`);

      // Migrate local chats if any
      CloudDB.migrateLocalChats().then(() => {
        // Subscribe to real-time chats for sidebar
        CloudDB.subscribeConversations((chats) => {
          Sidebar.setChats(chats);
        });
      });
      
    } else {
      // User logged out or guest default
      authOverlay.style.display = 'none'; // Default to guest mode
      authSubmitBtn.disabled = false;
      authSubmitBtn.textContent = isSignupMode ? 'Sign Up' : 'Sign In';
      
      if (avatarEl) avatarEl.textContent = 'G';
      if (nameEl) nameEl.textContent = 'Guest';
      if (sidebarLoginBtn) sidebarLoginBtn.style.display = 'inline-block';
      if (settingsAvatarEl) settingsAvatarEl.textContent = 'G';
      if (settingsEmailEl) settingsEmailEl.textContent = 'Guest User';

      const logoutRow = document.getElementById('logoutRow');
      if (logoutRow) logoutRow.style.display = 'none';
      const logoutBtn = document.getElementById('logoutBtn');
      if (logoutBtn) logoutBtn.parentElement.style.display = 'none';

      // Load Guest chats
      CloudDB.subscribeConversations((chats) => {
        Sidebar.setChats(chats);
      });
    }
  });
});
