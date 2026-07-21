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
import { PersonaPicker } from '../ui/personaPicker.js';
import { ChangePlanModal } from '../ui/changePlanModal.js';
import { PERSONAS } from '../config/personas.js';
import { PLANS } from '../config/plans.js';
import { Router } from './router.js';
import { Auth } from '../services/auth.js';
import { CloudDB } from '../services/cloudDb.js';
import { initFirebase, auth, db, fbAuthModule, fbFirestoreModule } from '../services/firebase.js';
import { aiApi } from '../services/aiApi.js';
import { OverlayManager } from '../services/overlayManager.js';

// Pre-load Agent Mode modules (Phase 1)
import { getToolCategoryMap } from '../ai/toolSchemas.js';
import '../ai/agentToolBridge.js';
// Pre-load Agent Mode engine (Phase 2)
import '../ai/agentEngine.js';
// Dynamic suggestion chips (Issue 7)
import { getSuggestionChips } from '../config/suggestionPool.js';
// Advanced Controls & Connectors (v2)
import { AdvancedControls } from '../ui/advancedControls.js';
import { ConnectorsSheet } from '../ui/connectorsSheet.js';

const APP_VERSION = '1.0.0';
const APP_VERSION_DATE = '20 July 2026';

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
  function getEffectiveProfile() {
    const localProfile = LocalSettings.getProfile();
    const user = Auth.getCurrentUser();
    
    if (user) {
      const authName = user.displayName || (user.email ? user.email.split('@')[0] : 'User');
      const authEmail = user.email || '';
      
      let effectiveName = authName;
      if (localProfile.name !== 'Your Name' && localProfile.name !== authName) {
        effectiveName = localProfile.name;
      }
      
      return { name: effectiveName, email: authEmail };
    }
    
    return localProfile;
  }

  function openProfile() {
    const profile = getEffectiveProfile();
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
    const nameDisplayEl = document.getElementById('profileNameDisplay');
    if (nameDisplayEl) nameDisplayEl.textContent = name;
    
    // Update Firebase Auth & Firestore profile if logged in
    const currentUser = Auth.getCurrentUser();
    if (currentUser && fbAuthModule && auth && fbFirestoreModule && db) {
      fbAuthModule.updateProfile(currentUser, { displayName: name }).catch(console.error);
      fbFirestoreModule.updateDoc(fbFirestoreModule.doc(db, 'users', currentUser.uid), { displayName: name }).catch(console.error);
    }

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
    OverlayManager.open(el);
  }
  function closeOverlay(el) {
    OverlayManager.close(el);
  }

  // =========================================================
  // API KEYS SCREEN
  // =========================================================
  function openApiKeys() {
    const groqInput = document.getElementById('groqApiKeyInput');
    if (groqInput) {
      groqInput.value = localStorage.getItem('GROQ_API_KEY') || '';
    }
    const tavilyInput = document.getElementById('tavilyApiKeyInput');
    if (tavilyInput) {
      tavilyInput.value = localStorage.getItem('TAVILY_API_KEY') || '';
    }
    openSubScreen('screenApiKeys');
  }
  function saveApiKeys() {
    const groqInput = document.getElementById('groqApiKeyInput');
    if (groqInput) {
      const val = groqInput.value.trim();
      if (val) localStorage.setItem('GROQ_API_KEY', val);
      else localStorage.removeItem('GROQ_API_KEY');
    }
    
    const tavilyInput = document.getElementById('tavilyApiKeyInput');
    if (tavilyInput) {
      const val = tavilyInput.value.trim();
      if (val) localStorage.setItem('TAVILY_API_KEY', val);
      else localStorage.removeItem('TAVILY_API_KEY');
    }
    Toast.show('✅ Settings saved.');
    
    // Check connection status immediately
    if (aiApi && aiApi.pingBackend) {
      aiApi.pingBackend();
    }
    closeSubScreen('screenApiKeys');
  }

  function updateAiStatusIndicator(status = 'connected') {
    const indicator = document.getElementById('aiStatusIndicator');
    if (!indicator) return;
    
    if (status === 'disconnected') {
      indicator.classList.remove('is-online');
      indicator.classList.add('is-offline');
      indicator.title = 'Backend API is currently unreachable.';
      indicator.style.color = ''; // Reset old inline style if present
    } else {
      indicator.classList.remove('is-offline');
      indicator.classList.add('is-online');
      indicator.title = 'AI Backend Connected — real AI responses active.';
      indicator.style.color = ''; // Reset old inline style if present
    }
  }

  // Listen for real-time backend status changes from aiApi
  window.addEventListener('backend-status', (e) => {
    updateAiStatusIndicator(e.detail);
  });

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
  function confirmLogout() {
    OverlayManager.open(document.getElementById('logoutConfirmOverlay'));
  }

  function closeLogoutConfirm() {
    OverlayManager.close(document.getElementById('logoutConfirmOverlay'));
  }

  async function executeLogout() {
    closeLogoutConfirm();
    try {
      await Auth.logout();
      LocalSettings.clearAll();
      document.documentElement.dataset.theme = 'dark';
      Toast.show('Logged out. See you soon!');
      setTimeout(() => location.reload(), 1400);
    } catch (err) {
      console.error('Logout error:', err);
      Toast.show('Failed to log out.');
    }
  }

  // =========================================================
  // GENERIC CONFIRM SHEET
  // =========================================================
  let _pendingConfirmAction = null;

  function openGenericConfirm({ title, message, showPassword = false, onConfirm }) {
    document.getElementById('genericConfirmTitle').textContent = title;
    document.getElementById('genericConfirmMessage').textContent = message;
    const pwWrap = document.getElementById('genericConfirmPasswordWrap');
    if (pwWrap) pwWrap.style.display = showPassword ? 'block' : 'none';
    const pwInput = document.getElementById('genericConfirmPasswordInput');
    if (pwInput) pwInput.value = '';
    
    _pendingConfirmAction = onConfirm;
    OverlayManager.open(document.getElementById('genericConfirmOverlay'));
  }
  
  function closeGenericConfirm() {
    OverlayManager.close(document.getElementById('genericConfirmOverlay'));
    _pendingConfirmAction = null;
  }
  
  document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('genericConfirmCloseBtn')?.addEventListener('click', closeGenericConfirm);
    document.getElementById('genericConfirmCancelBtn')?.addEventListener('click', closeGenericConfirm);
    document.getElementById('genericConfirmOverlay')?.addEventListener('click', e => {
      if (e.target.id === 'genericConfirmOverlay') closeGenericConfirm();
    });
    document.getElementById('genericConfirmConfirmBtn')?.addEventListener('click', async () => {
      if (_pendingConfirmAction) await _pendingConfirmAction();
    });
  });

  // =========================================================
  // PULL TO REFRESH (PWA)
  // =========================================================
  function initPullToRefresh() {
    let startY = 0;
    let startX = 0;
    let currentY = 0;
    let isPulling = false;
    let ptrCoolingDown = false; // debounce: ignore rapid repeat gestures
    const TRIGGER_THRESHOLD = 200; // px — raised from 160 to require deliberate gesture
    const pwaContainer = document.querySelector('.main-col');
    const indicator = document.getElementById('ptr-indicator');
    if (!pwaContainer || !indicator) return;

    function resetState() {
      isPulling = false;
      startY = 0;
      startX = 0;
      currentY = 0;
      indicator.style.transform = '';
      indicator.classList.remove('is-visible', 'is-refreshing');
    }

    pwaContainer.addEventListener('touchstart', e => {
      // Only begin tracking if we're at scroll top AND not cooling down from a previous gesture
      if (pwaContainer.scrollTop <= 5 && !ptrCoolingDown) {
        // If content is short (no scrollbar), require strict 0 to avoid false triggers from normal upward swipes
        const isShortContent = pwaContainer.scrollHeight <= pwaContainer.clientHeight;
        if (isShortContent && pwaContainer.scrollTop > 0) return;

        startY = e.touches[0].clientY;
        startX = e.touches[0].clientX;
        isPulling = true;
        currentY = startY;
      }
    }, { passive: true });

    pwaContainer.addEventListener('touchmove', e => {
      if (!isPulling) return;
      currentY = e.touches[0].clientY;
      const pullDistance = currentY - startY;
      const horizDistance = Math.abs(e.touches[0].clientX - startX);

      // Bug 3 fix: require vertical intent to be at least 2x horizontal movement
      // This prevents diagonal scrolls from triggering PTR
      if (horizDistance > pullDistance * 0.5 && pullDistance < 30) {
        // Looks like a horizontal swipe — abort PTR tracking
        resetState();
        return;
      }

      if (pullDistance > 0 && pwaContainer.scrollTop <= 5) {
        indicator.classList.add('is-visible');
        const transformY = Math.min(pullDistance * 0.4, 70);
        indicator.style.transform = `translateY(${transformY}px)`;
        // Visual cue: show "release to refresh" only past threshold
        if (pullDistance > TRIGGER_THRESHOLD) {
          indicator.classList.add('is-refreshing');
        } else {
          indicator.classList.remove('is-refreshing');
        }
      }
    }, { passive: true });

    pwaContainer.addEventListener('touchend', () => {
      if (!isPulling) return;
      const pullDistance = currentY - startY;
      
      if (pullDistance > TRIGGER_THRESHOLD) {
        indicator.classList.add('is-refreshing');
        // Give a tiny visual delay for the spinner, then hard reload
        setTimeout(() => {
          window.location.reload(true);
        }, 300);
      } else {
        resetState();
      }
    }, { passive: true });

    // Second-pull confirmation: if user pulls again within the cooldown window, reload
    // We implement this by checking a flag set by the "tap to reload" toast path instead.
    // The actual reload is only triggered by the explicit "Update available" toast action
    // OR a second pull-down gesture while ptrCoolingDown is still true.
    pwaContainer.addEventListener('touchstart', e => {
      if (ptrCoolingDown && pwaContainer.scrollTop <= 5) {
        const y = e.touches[0].clientY;
        // Store for second-pull detection
        pwaContainer._ptrConfirmY = y;
      }
    }, { passive: true });
    pwaContainer.addEventListener('touchend', e => {
      if (ptrCoolingDown && pwaContainer._ptrConfirmY) {
        const dist = (e.changedTouches[0]?.clientY || 0) - pwaContainer._ptrConfirmY;
        if (dist > 80) {
          ptrCoolingDown = false;
          pwaContainer._ptrConfirmY = null;
          indicator.classList.add('is-refreshing');
          setTimeout(() => location.reload(), 400);
        } else {
          pwaContainer._ptrConfirmY = null;
        }
      }
    }, { passive: true });
  }

  // =========================================================
  // INIT — wire all settings listeners
  // =========================================================
  function init() {
    initPullToRefresh();
    // Settings open/close
    document.getElementById('openSettingsBtn')?.addEventListener('click', open);
    document.getElementById('settingsBackBtn')?.addEventListener('click', close);
    document.getElementById('themeToggleRow')?.addEventListener('click', toggleTheme);

    // Restore saved theme
    applyTheme(LocalSettings.getTheme());

    // Set AI status indicator on load
    updateAiStatusIndicator();

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
    document.getElementById('apiKeysRow')?.addEventListener('click', () => Toast.show('Coming soon'));
    document.getElementById('apiKeysBackBtn')?.addEventListener('click', () => closeSubScreen('screenApiKeys'));
    document.getElementById('apiKeysSaveBtn')?.addEventListener('click', saveApiKeys);

    // ---- Subscription & Upgrade ----
    document.getElementById('changePlanBtn')?.addEventListener('click', () => {
      if (ChangePlanModal) ChangePlanModal.open();
    });
    
    // All upgrade entry points route to the real Razorpay-integrated ChangePlanModal
    document.getElementById('billingUpgradeBtn')?.addEventListener('click', () => ChangePlanModal.open());
    document.getElementById('upgradeSheetCloseBtn')?.addEventListener('click', closeUpgradeSheet);

    // ---- Sidebar Enhancements ----
    // BUG-09 FIX: sidebarUpgradeBtn element does not exist in HTML.
    // Upgrade Plan button uses id="billingUpgradeBtn" (wired above on the previous line).
    // Dead listener removed.
    document.getElementById('quicknavChatBtn')?.addEventListener('click', () => {
      Router.navigate('chat');
      if (window.matchMedia('(max-width: 860px)').matches) {
        Sidebar.close();
      }
    });
    document.getElementById('quicknavToolsBtn')?.addEventListener('click', () => {
      // BottomSheet is an ES module import — never use window.BottomSheet
      if (BottomSheet?.openToolSheet) BottomSheet.openToolSheet();
    });
    document.getElementById('quicknavHistoryBtn')?.addEventListener('click', () => {
      const sidebarScroll = document.querySelector('.sidebar-scroll');
      const historyEl = document.getElementById('chatHistoryGroups');
      if (sidebarScroll && historyEl) {
        sidebarScroll.scrollTo({ top: historyEl.offsetTop, behavior: 'smooth' });
      }
    });
    document.getElementById('quicknavSettingsBtn')?.addEventListener('click', open);

    document.getElementById('sidebarSearchChats')?.addEventListener('input', (e) => {
      const val = e.target.value.toLowerCase();
      document.querySelectorAll('#chatHistoryGroups .chat-item').forEach(item => {
        item.style.display = item.textContent.toLowerCase().includes(val) ? '' : 'none';
      });
    });

    // ---- Topbar Mode ----
    function handleAgentModeToggle() {
      if (Chat && Chat.isAgentModeOn) {
        const isAgent = Chat.isAgentModeOn();
        if (isAgent) {
          Chat.setAgentMode(false);
          document.querySelectorAll('.mode-pill-btn[data-mode="chat"]').forEach(b => b.classList.add('is-active'));
          document.querySelectorAll('.mode-pill-btn[data-mode="agent"]').forEach(b => b.classList.remove('is-active'));
        } else {
          Chat.setAgentMode(true);
          document.querySelectorAll('.mode-pill-btn[data-mode="chat"]').forEach(b => b.classList.remove('is-active'));
          document.querySelectorAll('.mode-pill-btn[data-mode="agent"]').forEach(b => b.classList.add('is-active'));
        }
      }
    }
    document.getElementById('agentModeBtn')?.addEventListener('click', handleAgentModeToggle);
    
    document.getElementById('agentIntroStartBtn')?.addEventListener('click', function() {
      LocalSettings.setHasSeenAgentIntro(true);
      document.getElementById('agentIntroState').style.display = 'none';
      document.getElementById('emptyState').style.display = 'none';
      document.getElementById('msgList').style.display = 'none';
      
      // Show the dedicated Agent Mode ready screen
      const agentReadyEl = document.getElementById('agentReadyState');
      if (agentReadyEl) {
        agentReadyEl.style.display = 'flex';
        
        // Render dynamic suggestion chips (Issue 7)
        const chipsContainer = document.getElementById('agentReadyChips');
        if (chipsContainer) {
          const chips = getSuggestionChips(3);
          chipsContainer.innerHTML = chips.map(prompt => `
            <div class="chip chip-sm" style="background:var(--bg-surface-2); border:1px solid var(--border-med); color:var(--text-1); cursor:pointer;" 
                 data-prompt="${prompt.replace(/"/g, '&quot;')}">
              ${prompt}
            </div>
          `).join('');
          
          chipsContainer.querySelectorAll('.chip').forEach(chip => {
            chip.addEventListener('click', () => {
              document.dispatchEvent(new CustomEvent('suggestion-click', { detail: { prompt: chip.dataset.prompt } }));
            });
          });
        }
        
      } else {
        // Fallback: show normal empty state but with agent-mode class
        document.getElementById('emptyState').style.display = 'flex';
      }
      
      // Mark chatBody as agent-active for CSS styling
      document.getElementById('chatBody')?.classList.add('agent-active');
      
      // Focus the input so user can start typing immediately
      document.getElementById('chatInput')?.focus();
    });

    document.getElementById('deepResearchBtn')?.addEventListener('click', () => ChangePlanModal.open());

    // Listen for prompt card / suggestion chip clicks (Issues 7 & 9)
    document.addEventListener('suggestion-click', (e) => {
      const prompt = e.detail?.prompt;
      if (!prompt) return;
      const chatInput = document.getElementById('chatInput');
      if (chatInput) {
        chatInput.value = prompt;
        chatInput.dispatchEvent(new Event('input'));
        chatInput.focus();
      }
    });
    document.querySelector('.mode-pill-btn[data-mode="chat"]')?.addEventListener('click', function() {
      // It's the default behavior, just ensure it's visually active
      document.querySelectorAll('.mode-pill-btn').forEach(b => {
        b.classList.remove('is-active');
        b.setAttribute('aria-pressed', 'false');
      });
      this.classList.add('is-active');
      this.setAttribute('aria-pressed', 'true');
      Chat.setAgentMode(false);
      
      const introState = document.getElementById('agentIntroState');
      if (introState) introState.style.display = 'none';
      const agentReady = document.getElementById('agentReadyState');
      if (agentReady) agentReady.style.display = 'none';
      document.getElementById('chatBody')?.classList.remove('agent-active');
      
      const list = document.getElementById('msgList');
      if (list && list.children.length === 0) {
        list.style.display = 'none';
        document.getElementById('emptyState').style.display = 'flex';
      } else if (list) {
        list.style.display = 'block';
      }
    });

    // ---- Logout button ----
    document.getElementById('logoutRow')?.addEventListener('click', confirmLogout);
    document.getElementById('upgradeSheetOverlay')?.addEventListener('click', e => {
      if (e.target.id === 'upgradeSheetOverlay') closeUpgradeSheet();
    });
    document.getElementById('upgradeNotifyBtn')?.addEventListener('click', async () => {
      try {
        const btn = document.getElementById('upgradeNotifyBtn');
        const originalText = btn.textContent;
        btn.textContent = 'Saving...';
        btn.disabled = true;
        
        await CloudDB.joinProWaitlist();
        Toast.show("You're on the list!");
        closeUpgradeSheet();
        
        btn.textContent = originalText;
        btn.disabled = false;
      } catch (err) {
        const btn = document.getElementById('upgradeNotifyBtn');
        btn.textContent = 'Notify me when Pro launches';
        btn.disabled = false;
        if (err.message === 'Please sign in first to join the waitlist.') {
          Toast.show(err.message);
        } else {
          Toast.show("Something went wrong — please try again");
          console.error(err);
        }
      }
    });

    // ---- Manage Tools row (Pattern B — real functional depth) ----
    document.getElementById('manageToolsRow')?.addEventListener('click', openManageTools);
    document.getElementById('manageToolsBackBtn')?.addEventListener('click', () => closeSubScreen('screenManageTools'));

    // ---- Log out row (Pattern A — real clear + reload) ----
    document.getElementById('logoutConfirmCloseBtn')?.addEventListener('click', closeLogoutConfirm);
    document.getElementById('logoutConfirmCancelBtn')?.addEventListener('click', closeLogoutConfirm);
    document.getElementById('logoutConfirmConfirmBtn')?.addEventListener('click', executeLogout);
    document.getElementById('logoutConfirmOverlay')?.addEventListener('click', e => {
      if (e.target.id === 'logoutConfirmOverlay') closeLogoutConfirm();
    });

    // ---- Persona mode row ----
    document.getElementById('personaRow')?.addEventListener('click', () => {
      if (PersonaPicker) PersonaPicker.open();
    });
    
    // Listen for persona changes to update the subtitle
    window.addEventListener('persona-changed', (e) => {
      const p = e.detail;
      const sub = document.getElementById('personaSubText');
      if (sub) sub.textContent = p ? p.label : 'General';
    });

    // ---- About row ----
    document.getElementById('aboutRow')?.addEventListener('click', () => openSubScreen('screenAbout'));
    document.getElementById('aboutBackBtn')?.addEventListener('click', () => closeSubScreen('screenAbout'));
    const versionEl = document.getElementById('aboutVersionText');
    if (versionEl) versionEl.textContent = `v${APP_VERSION} · ${APP_VERSION_DATE}`;

    // ---- Data Controls row ----
    document.getElementById('dataControlsRow')?.addEventListener('click', () => openSubScreen('screenDataControls'));
    document.getElementById('dataControlsBackBtn')?.addEventListener('click', () => closeSubScreen('screenDataControls'));

    const deleteAccountRow = document.getElementById('deleteAccountRow');
    if (deleteAccountRow) deleteAccountRow.style.display = Auth.getCurrentUser() ? 'flex' : 'none';

    document.getElementById('exportDataRow')?.addEventListener('click', async () => {
      const row = document.getElementById('exportDataRow');
      const subtext = document.getElementById('exportDataSubtext');
      const originalText = subtext.textContent;
      try {
        subtext.textContent = 'Preparing export…';
        const data = await CloudDB.exportUserData();
        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `toolshub-export-${Date.now()}.json`;
        document.body.appendChild(a);
        a.click();
        a.remove();
        URL.revokeObjectURL(url);
        Toast.show('Export downloaded.');
      } catch (e) {
        console.error('Export failed:', e);
        Toast.show('Failed to export data.');
      } finally {
        subtext.textContent = originalText;
      }
    });

    document.getElementById('clearChatHistoryRow')?.addEventListener('click', () => {
      openGenericConfirm({
        title: 'Clear chat history?',
        message: 'This will permanently delete all your conversations. This cannot be undone.',
        showPassword: false,
        onConfirm: async () => {
          const btn = document.getElementById('genericConfirmConfirmBtn');
          btn.disabled = true; btn.textContent = 'Clearing…';
          try {
            await CloudDB.clearAllConversations();
            Toast.show('Chat history cleared.');
            closeGenericConfirm();
          } catch (e) {
            console.error('Clear history failed:', e);
            Toast.show('Failed to clear chat history.');
          } finally {
            btn.disabled = false; btn.textContent = 'Confirm';
          }
        }
      });
    });

    document.getElementById('deleteAccountRow')?.addEventListener('click', () => {
      const user = Auth.getCurrentUser();
      const isPasswordUser = user?.providerData?.[0]?.providerId === 'password';
      openGenericConfirm({
        title: 'Delete your account?',
        message: 'This permanently deletes your account and all chat data. This cannot be undone.',
        showPassword: isPasswordUser,
        onConfirm: async () => {
          const btn = document.getElementById('genericConfirmConfirmBtn');
          btn.disabled = true; btn.textContent = 'Deleting…';
          try {
            if (isPasswordUser) {
              const pw = document.getElementById('genericConfirmPasswordInput').value;
              if (!pw) { Toast.show('Enter your password to continue.'); btn.disabled = false; btn.textContent = 'Confirm'; return; }
              await Auth.reauthenticate(pw);
            } else {
              if (Auth.reauthenticateWithGooglePopup) {
                await Auth.reauthenticateWithGooglePopup();
              }
            }
            await CloudDB.deleteUserAccount();
            await Auth.deleteAccount();
            closeGenericConfirm();
            Toast.show('Account deleted.');
            setTimeout(() => location.reload(), 1200);
          } catch (e) {
            console.error('Delete account failed:', e);
            if (e.code === 'auth/wrong-password' || e.code === 'auth/invalid-credential') {
              Toast.show('Incorrect password.');
            } else if (e.code === 'auth/requires-recent-login') {
              Toast.show('Please sign in again and retry.');
            } else {
              Toast.show('Failed to delete account.');
            }
          } finally {
            btn.disabled = false; btn.textContent = 'Confirm';
          }
        }
      });
    });

    // ---- Report Bug row ----
    document.getElementById('reportBugRow')?.addEventListener('click', () => BottomSheet.openReportBugSheet());
    document.getElementById('reportBugCloseBtn')?.addEventListener('click', () => BottomSheet.closeReportBugSheet());
    document.getElementById('reportBugSheetOverlay')?.addEventListener('click', e => {
      if (e.target.id === 'reportBugSheetOverlay') BottomSheet.closeReportBugSheet();
    });
    document.getElementById('reportBugTextarea')?.addEventListener('input', () => BottomSheet.updateReportBugCounter());

    document.getElementById('reportBugSendBtn')?.addEventListener('click', () => {
      const textarea = document.getElementById('reportBugTextarea');
      const text = textarea?.value.trim();
      if (!text) return;

      const subject = encodeURIComponent('ToolsHub Bug Report');
      const body = encodeURIComponent(
        `Bug description:\n${text}\n\n---\nApp: ToolsHub\nUser agent: ${navigator.userAgent}`
      );
      window.location.href = `mailto:digiriseindia@gmail.com?subject=${subject}&body=${body}`;

      Toast.show('Opening your email app…');
      BottomSheet.closeReportBugSheet();
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
              Toast.show('Update available — tap to refresh', { 
                duration: 0, 
                onClick: () => window.location.reload()
              });
            }
          });
        });
      }).catch(err => console.log('SW ref failed', err));
    }

    // 2. Handle Install Prompt
    const isIosSafari = /iP(ad|hone|od).+Version\/[\d\.]+.*Safari/i.test(navigator.userAgent);
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches || navigator.standalone;

    window.addEventListener('beforeinstallprompt', (e) => {
      e.preventDefault();
      deferredPrompt = e;
      
      const installRow = document.getElementById('installAppRow');
      if (installRow) {
        installRow.style.display = 'flex';
      }
    });

    if (isIosSafari && !isStandalone) {
      const installRow = document.getElementById('installAppRow');
      if (installRow) {
        installRow.style.display = 'flex';
      }
    }

    document.getElementById('installAppRow')?.addEventListener('click', () => {
      if (isIosSafari && !isStandalone) {
        // Native share icon SVG fallback
        const shareIcon = `<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="display:inline; vertical-align:middle; margin:0 4px;"><path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"/><polyline points="16 6 12 2 8 6"/><line x1="12" y1="2" x2="12" y2="15"/></svg>`;
        Toast.show(`Tap the Share icon ${shareIcon}, then "Add to Home Screen"`, 5000);
        return;
      }
      
      document.getElementById('installSheetOverlay').style.display = 'flex';
      // tiny delay to allow display:flex to apply before adding is-open
      setTimeout(() => {
        document.querySelector('#installSheetOverlay .sheet')?.classList.add('is-open');
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
  OverlayManager.init();
  PWA.init();
  ToolSelector.init();
  Sidebar.init();
  BottomSheet.init();
  ChangePlanModal.init();
  ConnectorsSheet.init();
  AdvancedControls.init();
  Router.init();
  Chat.init();
  Settings.init();
  PersonaPicker.init();

  async function renderUsageBlock() {
    const valueEl = document.getElementById('settingsUsageValue');
    const fillEl = document.getElementById('settingsUsageBarFill');
    if (!valueEl || !fillEl) return;

    const planId = LocalSettings.getCurrentPlan();
    const plan = PLANS.find(p => p.id === planId);
    const cap = plan ? plan.dailyMessageCap : 15;

    const usage = await CloudDB.getTodayUsage();
    if (!usage) {
      valueEl.textContent = '-- / --';
      fillEl.style.width = '0%';
      return;
    }

    if (cap === Infinity) {
      valueEl.textContent = `${usage.count} / Unlimited`;
      fillEl.style.width = '100%';
    } else {
      valueEl.textContent = `${usage.count} / ${cap}`;
      fillEl.style.width = `${Math.min(100, (usage.count / cap) * 100)}%`;
    }
  }

  // Function to update the plan UI
  function updatePlanUI() {
    const currentPlanId = LocalSettings.getCurrentPlan() || 'free';
    const planObj = PLANS.find(p => p.id === currentPlanId) || PLANS[0];
    
    // Update Topbar Pill
    const topbarPlanPill = document.getElementById('topbarPlanPill');
    const aiStatusIndicator = document.getElementById('aiStatusIndicator');
    if (topbarPlanPill && aiStatusIndicator) {
      if (currentPlanId === 'free') {
        topbarPlanPill.style.display = 'none';
        aiStatusIndicator.style.display = 'inline-flex';
      } else {
        topbarPlanPill.style.display = 'inline-block';
        topbarPlanPill.textContent = planObj.label.toUpperCase();
        aiStatusIndicator.style.display = 'none';
        topbarPlanPill.onclick = () => { if (ChangePlanModal) ChangePlanModal.open(); };
      }
    }
    const subName = document.getElementById('subPlanName');
    const subStatus = document.getElementById('subPlanStatus');
    const subPeriod = document.getElementById('subPlanPeriod');
    
    if (subName) subName.textContent = planObj.label;
    if (subStatus) {
      subStatus.textContent = 'active';
      subStatus.className = 'settings-sub-status-text is-active';
    }
    if (subPeriod) {
      subPeriod.textContent = currentPlanId === 'free' ? 'Forever free' : `Renews: ${planObj.priceLabel}${planObj.periodLabel}`;
    }

    renderUsageBlock();
  }

  // Initial update and event listener
  updatePlanUI();
  window.addEventListener('plan-changed', updatePlanUI);

  // Set initial persona subtitle in Settings
  const initialPersonaId = LocalSettings.getPersona();
  const sub = document.getElementById('personaSubText');
  if (sub) {
    if (!initialPersonaId || initialPersonaId === 'general') {
      sub.textContent = 'General';
    } else {
      const p = PERSONAS.find(p => p.id === initialPersonaId);
      sub.textContent = p ? p.label : 'General';
    }
  }

  // Check for deep link or default to new chat
  if (window.location.hash && window.location.hash.startsWith('#chat=')) {
    const chatId = window.location.hash.replace('#chat=', '');
    Chat.loadChat(chatId);
  } else {
    // always show empty state with no tool selected on fresh load
    Chat.newChat();
  }

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

  // Initialize Firebase dynamically to avoid network-blocking module crashes
  await initFirebase();

  function updateGreeting(user) {
    const greetingEl = document.getElementById('greetingText');
    if (!greetingEl) return;
    
    const hour = new Date().getHours();
    let timeGreeting = 'Evening';
    if (hour >= 5 && hour < 12) timeGreeting = 'Morning';
    else if (hour >= 12 && hour < 17) timeGreeting = 'Afternoon';
    else if (hour >= 17 && hour < 21) timeGreeting = 'Evening';
    else timeGreeting = 'Night';

    let name = '';
    if (user) {
      name = user.displayName || user.email.split('@')[0];
    } else {
      const genericNames = ["Explorer", "Warrior", "Wanderer", "Creator", "Builder"];
      name = genericNames[Math.floor(Math.random() * genericNames.length)];
    }
    greetingEl.textContent = `${timeGreeting}, ${name}`;
  }

  window.addEventListener('refresh-greeting', () => {
    updateGreeting(Auth.getCurrentUser());
  });

  Auth.onAuthStateChanged(user => {
    updateGreeting(user);
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
      
      Toast.show(`Welcome, ${name}!`);

      // Sync plan from Firestore source of truth
      CloudDB.syncPlanFromServer().then(() => {
        window.dispatchEvent(new CustomEvent('plan-changed'));
      });

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
      
      // Guest mode always gets free plan
      CloudDB.syncPlanFromServer().then(() => {
        window.dispatchEvent(new CustomEvent('plan-changed'));
      });

      // Load Guest chats
      CloudDB.subscribeConversations((chats) => {
        Sidebar.setChats(chats);
      });
    }
  });

  // Bug 2: Handle Google redirect sign-in result (fires after user returns from Google OAuth page)
  // This is safe to call on every page load; it's a no-op when no redirect happened.
  Auth.handleRedirectResult().catch(e => console.warn('Redirect result error:', e));
});
