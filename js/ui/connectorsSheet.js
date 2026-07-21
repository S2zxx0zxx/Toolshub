import { CONNECTORS } from '../tools/connectorsRegistry.js';

export const ConnectorsSheet = (() => {

  function openOverlay(overlayEl) {
    if (!overlayEl) return;
    overlayEl.style.display = 'flex';
    // Trigger reflow
    void overlayEl.offsetWidth;
    const sheet = overlayEl.querySelector('.sheet');
    if (sheet) sheet.classList.add('open');
  }

  function closeOverlay(overlayEl) {
    if (!overlayEl) return;
    const sheet = overlayEl.querySelector('.sheet');
    if (sheet) {
      sheet.classList.remove('open');
      setTimeout(() => {
        overlayEl.style.display = 'none';
      }, 300);
    } else {
      overlayEl.style.display = 'none';
    }
  }

  function render() {
    const body = document.getElementById('connectorsSheetBody');
    if (!body) return;

    if (CONNECTORS.length === 0) {
      body.innerHTML = `
        <div style="text-align: center; padding: var(--sp-6) var(--sp-4);">
          <div style="color: var(--text-muted); font-size: var(--fs-sm); font-family: var(--font-body);">
            More connectors are coming soon.
          </div>
        </div>
      `;
      return;
    }

    // Future logic when CONNECTORS array has items
    body.innerHTML = '';
  }

  function open() {
    render();
    openOverlay(document.getElementById('connectorsSheetOverlay'));
  }

  function close() {
    closeOverlay(document.getElementById('connectorsSheetOverlay'));
  }

  function init() {
    const overlay = document.getElementById('connectorsSheetOverlay');
    if (overlay) {
      overlay.addEventListener('click', (e) => {
        if (e.target.id === 'connectorsSheetOverlay') close();
      });
    }
    const closeBtn = document.getElementById('connectorsSheetCloseBtn');
    if (closeBtn) {
      closeBtn.addEventListener('click', close);
    }
  }

  return { init, open, close };
})();
