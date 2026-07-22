/* ============================================
   TOOLSHUB EXCLUSIVE — ACCESS GATE
   Single source of truth for whether this user
   has the ₹299 Exclusive add-on unlocked.
   Phase 1: always returns false (Coming Soon).
   Future: wired to billing webhook result.
   ============================================ */

const EXCLUSIVE_KEY = 'toolshub_exclusive_addon';

export const ExclusiveAccess = (() => {

  function isUnlocked() {
    // Temporarily returning true so you can preview the UI
    return true;
  }

  function unlock() {
    try { localStorage.setItem(EXCLUSIVE_KEY, 'true'); } catch (e) {}
  }

  function lock() {
    try { localStorage.removeItem(EXCLUSIVE_KEY); } catch (e) {}
  }

  return { isUnlocked, unlock, lock };
})();
