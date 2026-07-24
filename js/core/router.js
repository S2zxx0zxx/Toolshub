import { Events } from './events.js';
import { Sidebar } from '../ui/sidebar.js';

export const Router = (() => {
  let currentScreen = 'home';
  let previousScreen = 'home';
  let activeSubScreens = new Set();

  function navigate(screen) {
    previousScreen = currentScreen;
    currentScreen = screen;
    sessionStorage.setItem('toolshub_active_screen', screen);
    const app = document.getElementById('app');
    if (app) app.dataset.screen = screen;

    // Push to browser history so the native back button works within the app
    history.pushState({ screen }, '', location.href);

    const isExclusive = screen.startsWith('exclusive-');
    const exclusiveShell = document.getElementById('exclusiveShell');
    const mainCol = document.querySelector('.main-col');

    if (exclusiveShell) exclusiveShell.style.display = isExclusive ? 'flex' : 'none';
    if (mainCol) mainCol.style.display = isExclusive ? 'none' : '';

    if ((screen === 'settings' || screen === 'status') && window.matchMedia('(max-width: 860px)').matches) {
      Sidebar.close();
    }
    Events.publish('NAVIGATED', screen);
  }

  function openSubScreen(id) {
    activeSubScreens.add(id);
    document.getElementById(id)?.classList.add('is-open');
    Events.publish('SUBSCREEN_OPENED', id);
  }

  function closeSubScreen(id) {
    activeSubScreens.delete(id);
    document.getElementById(id)?.classList.remove('is-open');
    Events.publish('SUBSCREEN_CLOSED', id);
  }

  function closeAllSubScreens() {
    activeSubScreens.forEach(id => {
      document.getElementById(id)?.classList.remove('is-open');
    });
    activeSubScreens.clear();
    Events.publish('ALL_SUBSCREENS_CLOSED');
  }

  function init() {
    const saved = sessionStorage.getItem('toolshub_active_screen');
    if (saved) {
      navigate(saved);
    } else {
      // Push initial state so popstate has something to pop back to
      history.replaceState({ screen: 'home' }, '', location.href);
    }

    // Handle native browser/phone back button — route within the app
    window.addEventListener('popstate', (e) => {
      const targetScreen = e.state?.screen || previousScreen || 'home';
      // Don't push state again on popstate — just update internal state
      currentScreen = targetScreen;
      sessionStorage.setItem('toolshub_active_screen', targetScreen);
      const app = document.getElementById('app');
      if (app) app.dataset.screen = targetScreen;
      const isExclusive = targetScreen.startsWith('exclusive-');
      const exclusiveShell = document.getElementById('exclusiveShell');
      const mainCol = document.querySelector('.main-col');
      if (exclusiveShell) exclusiveShell.style.display = isExclusive ? 'flex' : 'none';
      if (mainCol) mainCol.style.display = isExclusive ? 'none' : '';
      Events.publish('NAVIGATED', targetScreen);
    });
  }

  return {
    init,
    navigate,
    openSubScreen,
    closeSubScreen,
    closeAllSubScreens,
    getCurrentScreen: () => currentScreen
  };
})();
