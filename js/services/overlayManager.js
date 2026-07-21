/* ============================================
   TOOLSHUB — OVERLAY MANAGER
   Single source of truth for "how many overlays are open".
   Fixes the body-scroll-lock getting stuck when two overlays
   open/close out of order (e.g. Model sheet -> Change Plan modal).

   Every sheet/modal in the app MUST open/close through this
   module instead of touching document.body.style.overflow itself.
   ============================================ */

export const OverlayManager = (() => {
  const openStack = new Set();

  function lockScroll() {
    document.body.style.overflow = 'hidden';
  }
  function unlockScroll() {
    document.body.style.overflow = '';
  }

  // el: the overlay DOM element (must have a stable id)
  function open(el) {
    if (!el) return;
    el.classList.add('is-open');
    openStack.add(el);
    lockScroll();
  }

  function close(el) {
    if (!el) return;
    el.classList.remove('is-open');
    openStack.delete(el);
    // Only release the scroll lock once NOTHING else is open.
    if (openStack.size === 0) unlockScroll();
  }

  // Safety net: force-clear everything. Used by the Escape-key
  // handler and can be called from the console if something
  // ever gets stuck again.
  function closeAll() {
    openStack.forEach(el => el.classList.remove('is-open'));
    openStack.clear();
    unlockScroll();
  }

  function isAnyOpen() {
    return openStack.size > 0;
  }

  function init() {
    // Global safety net #1: Escape key always clears every overlay.
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && openStack.size > 0) closeAll();
    });

    // Global safety net #2: if for any reason the scroll lock is
    // left on with nothing actually open (stale state from a
    // race condition), self-heal on the next user interaction.
    document.addEventListener('click', () => {
      if (openStack.size === 0 && document.body.style.overflow === 'hidden') {
        unlockScroll();
      }
    }, { capture: true });
  }

  return { open, close, closeAll, isAnyOpen, init };
})();
