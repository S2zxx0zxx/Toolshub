/* ============================================
   TOOLSHUB — MAIN
   Settings screen nav, theme toggle, sub-screens,
   upgrade sheet, logout confirm, manage tools,
   profile, billing — app bootstrap.
   ============================================ */
import { Storage } from '../services/storage.js';
import { Toast } from '../ui/toast.js';
import { Sidebar } from '../ui/sidebar.js';
import { BottomSheet } from '../ui/bottomsheet.js';
import { Chat } from '../ui/chatEngine.js';
import { ToolSelector } from '../tools/registry.js';
import { Router } from './router.js';

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
    document.documentElement.setAttribute('data-theme', theme);
    document.getElementById('themeLabel').textContent = theme === 'dark' ? 'Dark' : 'Light';
    Storage.setTheme(theme);
  }

  function toggleTheme() {
    const current = document.documentElement.getAttribute('data-theme');
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
    const profile = Storage.getProfile();
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

    Storage.setProfile({ name, email });

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
  // MANAGE TOOLS SCREEN
  // =========================================================
  function updateManageToolsSubtitle() {
    const sub = document.querySelector('#manageToolsRow .list-row-subtitle');
    if (!sub) return;
    const enabledIds = Storage.getEnabledCategories();
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

    const enabledIds = Storage.getEnabledCategories();
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
      toggleEl.addEventListener('click', (e) => {
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
      });
    });
  }

  // =========================================================
  // LOGOUT CONFIRM SHEET
  // =========================================================
  function openLogoutSheet() {
    openOverlay(document.getElementById('logoutSheetOverlay'));
  }
  function closeLogoutSheet() {
    closeOverlay(document.getElementById('logoutSheetOverlay'));
  }

  function confirmLogout() {
    Storage.clearAll();
    closeLogoutSheet();
    // Reset theme to dark (default)
    document.documentElement.setAttribute('data-theme', 'dark');
    // Brief toast then reload
    Toast.show('Logged out. See you soon!');
    setTimeout(() => location.reload(), 1400);
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
    applyTheme(Storage.getTheme());

    // Restore profile display name in sidebar
    const profile = Storage.getProfile();
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

    // ---- Upgrade button (both in upgrade-card and billing screen — Pattern B/A) ----
    document.getElementById('upgradeBtn')?.addEventListener('click', openUpgradeSheet);
    document.getElementById('billingUpgradeBtn')?.addEventListener('click', openUpgradeSheet);
    document.getElementById('upgradeSheetCloseBtn')?.addEventListener('click', closeUpgradeSheet);
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
    document.getElementById('logoutBtn')?.addEventListener('click', openLogoutSheet);
    document.getElementById('logoutCancelBtn')?.addEventListener('click', closeLogoutSheet);
    document.getElementById('logoutConfirmBtn')?.addEventListener('click', confirmLogout);
    document.getElementById('logoutSheetOverlay')?.addEventListener('click', e => {
      if (e.target.id === 'logoutSheetOverlay') closeLogoutSheet();
    });

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
document.addEventListener('DOMContentLoaded', () => {
  PWA.init();
  ToolSelector.init();
  Sidebar.init();
  BottomSheet.init();
  Chat.init();
  Settings.init();

  // always show empty state with no tool selected on fresh load
  Chat.newChat();
});
