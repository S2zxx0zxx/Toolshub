/* ============================================
   TOOLSHUB EXCLUSIVE — ACCESS GATE
   Single source of truth for whether this user
   has the ₹299 Exclusive add-on unlocked.
   Phase 1: always returns false (Coming Soon).
   Future: wired to billing webhook result.
   ============================================ */

const EXCLUSIVE_KEY = 'toolshub_exclusive_addon';

import { Auth } from '../../services/auth.js';

export const ExclusiveAccess = (() => {

  function isUnlocked() {
    const user = Auth.getCurrentUser();
    if (user && (user.email === 'Satyamk82476@gmail.com' || user.email === 'satyamk82476@gmail.com' || user.email === 'Styamk82476@gmail.com' || user.email === 'styamk82476@gmail.com')) {
      return true;
    }
    // Phase 1: Coming Soon — always false for regular users
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
