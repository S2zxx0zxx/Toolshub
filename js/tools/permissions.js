import { Auth } from '../services/auth.js';
import { LocalSettings } from '../services/localSettings.js';

export const PermissionLayer = (() => {
  /**
   * UI-LAYER GATING ONLY. This determines what the UI shows/enables so users
   * aren't shown tools they can't use. It is NOT a security boundary — the
   * worker (worker/src/index.js + planResolver.js) independently verifies
   * plan and identity server-side on every request. Do not add security-
   * critical logic here; a client can always bypass this function.
   */
  function canExecute(tool) {
    if (!tool) return false;
    if (!tool.permissions || tool.permissions.length === 0) return true;

    const user = Auth.getCurrentUser();
    if (tool.requiresAuth && !user) return false;

    const planId = LocalSettings.getCurrentPlan();
    const userPermissions = planId === 'free' ? ['basic'] : ['basic', 'premium'];

    for (const requiredPerm of tool.permissions) {
      if (!userPermissions.includes(requiredPerm)) return false;
    }
    return true;
  }

  return { canExecute };
})();
