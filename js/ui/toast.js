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

  function show(message, opts = {}) {
    // backwards compatibility for Toast.show('msg', 2800)
    if (typeof opts === 'number') {
      opts = { duration: opts };
    }
    const duration = opts.duration !== undefined ? opts.duration : 2800;
    
    const el = _ensure();
    if (!el) return;

    // cancel any previous auto-dismiss
    if (_timer) {
      clearTimeout(_timer);
      _timer = null;
    }

    el.textContent = message;
    
    // Clear previous onclick if any
    el.onclick = null;
    if (typeof opts.onClick === 'function') {
      el.style.cursor = 'pointer';
      el.onclick = () => {
        opts.onClick();
        el.classList.remove('toast-visible');
      };
    } else {
      el.style.cursor = 'default';
    }

    el.classList.add('toast-visible');

    if (duration > 0 && duration !== Infinity) {
      _timer = setTimeout(() => {
        el.classList.remove('toast-visible');
        _timer = null;
      }, duration);
    }
  }

  return { show };
})();
