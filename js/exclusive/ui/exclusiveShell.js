/* ============================================
   TOOLSHUB EXCLUSIVE — SHELL INIT
   Top-level module for the Exclusive environment.
   Called from app.js.
   ============================================ */

import { ExclusiveAccess } from '../state/exclusiveAccess.js';
import { ExclusiveHomeScreen } from './exclusiveHomeScreen.js';
import { ExclusiveChatEngine } from './exclusiveChatEngine.js';
import { Router } from '../../core/router.js';
import { Toast } from '../../ui/toast.js';

export const ExclusiveShell = (() => {

  function init() {
    // Wire the sidebar button in Lite
    const btn = document.getElementById('exclusiveSwitchBtn');
    if (btn) {
      btn.addEventListener('click', () => {
        if (!ExclusiveAccess.isUnlocked()) {
          Toast.show('ToolsHub Exclusive is coming soon — stay tuned! 🚀', 3000);
          return;
        }
        // When unlocked, navigate to exclusive-home
        Router.navigate('exclusive-home');
      });
    }

    // Wire the back button in Exclusive sidebar
    const backBtn = document.getElementById('exclusiveBackBtn');
    if (backBtn) {
      backBtn.addEventListener('click', () => {
        Router.navigate('home'); // Back to Lite
      });
    }

    // Wire Exclusive Mobile Sidebar
    const closeBtn = document.getElementById('exclusiveSidebarCloseBtn');
    const overlay = document.getElementById('exclusiveSidebarOverlay');
    const shell = document.getElementById('exclusiveShell');

    function closeSidebar() {
      shell?.removeAttribute('data-sidebar');
      if (overlay) overlay.style.display = 'none';
    }

    closeBtn?.addEventListener('click', closeSidebar);
    overlay?.addEventListener('click', closeSidebar);

    // Unconditionally init sub-modules so they are ready if user unlocks later
    // (Auth state might not be loaded when this init() is called at startup)
    ExclusiveHomeScreen.init();
    ExclusiveChatEngine.init();

    // Wire the New Exclusive Chat button in the sidebar
    const newChatBtn = document.getElementById('exclusiveNewChatBtn');
    if (newChatBtn) {
      newChatBtn.addEventListener('click', () => ExclusiveChatEngine.newChat());
    }
  }

  return { init };
})();
