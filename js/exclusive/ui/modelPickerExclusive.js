/* ============================================
   TOOLSHUB EXCLUSIVE — MODEL PICKER
   Manages the manual model selection chip in
   the Exclusive Chat input bar.
   ============================================ */

export const ModelPickerExclusive = (() => {

  // Option B: Hardcoded premium models for Exclusive
  // Option A for names: Branded labels
  const MODELS = [
    { id: 'llama-3.3-70b-versatile', label: 'Swift (Recommended)', icon: 'zap' },
    { id: 'llama-3.1-70b-versatile', label: 'Deep', icon: 'layers' },
    { id: 'gpt-4o-mini', label: 'Precise', icon: 'target' }
  ];

  let selectedId = MODELS[0].id;
  let onChangeCallback = null;

  function init(containerSelector, onChange) {
    const container = document.querySelector(containerSelector);
    if (!container) return;
    
    onChangeCallback = onChange;

    // We'll create a simple chip that cycles on click for now, 
    // or opens a mini menu. Let's do a cycle for simplicity 
    // to avoid needing a complex bottom sheet like Lite.
    
    container.innerHTML = `
      <button class="ex-model-picker" id="exModelPickerChip" title="Click to change model">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/></svg>
        <span id="exModelPickerLabel">${MODELS[0].label}</span>
      </button>
    `;

    document.getElementById('exModelPickerChip')?.addEventListener('click', (e) => {
      e.preventDefault();
      cycleModel();
    });
  }

  function cycleModel() {
    const currentIndex = MODELS.findIndex(m => m.id === selectedId);
    const nextIndex = (currentIndex + 1) % MODELS.length;
    selectedId = MODELS[nextIndex].id;
    
    const labelEl = document.getElementById('exModelPickerLabel');
    if (labelEl) labelEl.textContent = MODELS[nextIndex].label;

    if (onChangeCallback) onChangeCallback(selectedId);
  }

  function getSelectedModel() {
    return selectedId;
  }

  function getAllModels() {
    return MODELS;
  }

  function setDisabled(disabled) {
    const chip = document.getElementById('exModelPickerChip');
    if (chip) {
      if (disabled) chip.classList.add('is-disabled');
      else chip.classList.remove('is-disabled');
    }
  }

  return { init, getSelectedModel, getAllModels, setDisabled };
})();
