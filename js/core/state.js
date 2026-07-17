import { Events } from './events.js';

export const State = (() => {
  let state = {
    activeChatId: null,
    activeProjectId: null,
    theme: 'dark',
    userProfile: { name: 'Satyam', email: 'satyam@digiriseindia.tech' },
    enabledCategories: null, // null means all enabled
  };

  return {
    get: () => ({ ...state }),
    set: (updates) => {
      state = { ...state, ...updates };
      Events.publish('STATE_UPDATED', state);
    }
  };
})();
