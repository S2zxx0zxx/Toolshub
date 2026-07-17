/* ============================================
   TOOLSHUB — TOAST
   Shared, reusable lightweight toast notification.
   Uses only existing design tokens.
   One instance at a time — auto-dismisses in 2.8s.
   ============================================ */

export const Toast = (() => {
  let _container = null;
  let _timer = null;

  function _ensure() {
    if (!_container) {
      _container = document.getElementById('toastContainer');
    }
    return _container;
  }

  function show(message, duration = 2800) {
    const el = _ensure();
    if (!el) return;

    // cancel any previous auto-dismiss
    if (_timer) clearTimeout(_timer);

    el.textContent = message;
    el.classList.add('toast-visible');

    _timer = setTimeout(() => {
      el.classList.remove('toast-visible');
      _timer = null;
    }, duration);
  }

  return { show };
})();
