/* ============================================
   TOOLSHUB EXCLUSIVE — ROUTER
   Internal sub-router for Exclusive screens.
   Mirrors the core router but scoped to the
   exclusive environment.
   ============================================ */

import { Events } from '../../core/events.js';

export const ExclusiveRouter = (() => {
  let currentScreen = 'exclusive-home';

  function navigate(screenId) {
    currentScreen = screenId;
    
    // Hide all exclusive screens
    const screens = document.querySelectorAll('.exclusive-screen');
    screens.forEach(s => s.classList.remove('is-active'));
    
    // Show the target screen
    const target = document.getElementById(screenId === 'exclusive-home' ? 'screenExclusiveHome' : 
                                           screenId === 'exclusive-chat' ? 'screenExclusiveChat' : 
                                           screenId === 'exclusive-dashboard' ? 'screenExclusiveDashboard' : null);
    if (target) {
      target.classList.add('is-active');
    }

    // On mobile, navigating should close the sidebar
    if (window.matchMedia('(max-width: 860px)').matches) {
      document.getElementById('exclusiveShell')?.removeAttribute('data-sidebar');
      document.getElementById('exclusiveSidebarOverlay').style.display = 'none';
    }

    Events.publish('EXCLUSIVE_NAVIGATED', screenId);
  }

  return { navigate, getCurrentScreen: () => currentScreen };
})();
