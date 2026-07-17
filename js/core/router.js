import { Events } from './events.js';
import { Sidebar } from '../ui/sidebar.js';

export const Router = (() => {
  let currentScreen = 'chat';
  let activeSubScreens = new Set();

  function navigate(screen) {
    currentScreen = screen;
    document.getElementById('app').dataset.screen = screen;
    if (screen === 'settings' && window.matchMedia('(max-width: 860px)').matches) {
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

  return {
    navigate,
    openSubScreen,
    closeSubScreen,
    closeAllSubScreens,
    getCurrentScreen: () => currentScreen
  };
})();
