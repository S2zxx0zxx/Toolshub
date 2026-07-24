/* ============================================
   TOOLSHUB EXCLUSIVE — ACCESS GATE
   Single source of truth for whether this user
   has the ₹299 Exclusive add-on unlocked.
   Phase 1: always returns false (Coming Soon).
   Future: wired to billing webhook result.
   ============================================ */

const EXCLUSIVE_KEY = 'toolshub_exclusive_addon';

import { Auth } from '../../services/auth.js';
import { isDevAccount } from '../../config/devAccounts.js';

export const ExclusiveAccess = (() => {

  function isUnlocked() {
    const user = Auth.getCurrentUser();
    if (user && isDevAccount(user.email)) {
      return true;
    }
    // Check localStorage for paid unlock
    try {
      if (localStorage.getItem(EXCLUSIVE_KEY) === 'true') return true;
    } catch (e) {}
    // Phase 1: Coming Soon — false for regular users without paid unlock
    return false;
  }

  function unlock() {
    try { localStorage.setItem(EXCLUSIVE_KEY, 'true'); } catch (e) {}
  }

  function lock() {
    try { localStorage.removeItem(EXCLUSIVE_KEY); } catch (e) {}
  }

  return { isUnlocked, unlock, lock };
})();
