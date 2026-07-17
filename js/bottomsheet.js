/* ============================================
   TOOLSHUB — BOTTOM SHEETS
   Open/close logic for "+" sheet and Tool Selector sheet
   ============================================ */

const BottomSheet = (() => {

  function openOverlay(overlayEl) {
    overlayEl.classList.add('is-open');
    document.body.style.overflow = 'hidden';
  }
  function closeOverlay(overlayEl) {
    overlayEl.classList.remove('is-open');
    document.body.style.overflow = '';
  }

  // ---------- "+" ADD-TO-CHAT SHEET ----------
  function openAddSheet() {
    openOverlay(document.getElementById('addSheetOverlay'));
  }
  function closeAddSheet() {
    closeOverlay(document.getElementById('addSheetOverlay'));
  }

  // ---------- TOOL SELECTOR SHEET ----------
  function openToolSheet() {
    // always reset to category level on open
    ToolSelector.backToCategoryLevel();
    openOverlay(document.getElementById('toolSheetOverlay'));
  }
  function closeToolSheet() {
    closeOverlay(document.getElementById('toolSheetOverlay'));
  }

  function init() {
    // "+" sheet triggers
    document.getElementById('addBtn')?.addEventListener('click', openAddSheet);
    document.getElementById('addSheetCloseBtn')?.addEventListener('click', closeAddSheet);
    document.getElementById('addSheetOverlay')?.addEventListener('click', (e) => {
      if (e.target.id === 'addSheetOverlay') closeAddSheet();
    });

    // file upload row triggers hidden input
    document.getElementById('uploadFileRow')?.addEventListener('click', () => {
      document.getElementById('hiddenFileInput')?.click();
    });

    // web search toggle
    document.getElementById('webSearchToggle')?.addEventListener('click', function () {
      this.classList.toggle('is-on');
    });

    // tool selector sheet triggers
    document.getElementById('toolChip')?.addEventListener('click', openToolSheet);
    document.getElementById('toolSheetCloseBtn')?.addEventListener('click', closeToolSheet);
    document.getElementById('toolSheetBackBtn')?.addEventListener('click', ToolSelector.backToCategoryLevel);
    document.getElementById('toolSheetOverlay')?.addEventListener('click', (e) => {
      if (e.target.id === 'toolSheetOverlay') closeToolSheet();
    });
  }

  return { init, openAddSheet, closeAddSheet, openToolSheet, closeToolSheet };
})();

window.BottomSheet = BottomSheet;
