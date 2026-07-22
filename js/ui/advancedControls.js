import { BottomSheet } from './bottomsheet.js';
import { ConnectorsSheet } from './connectorsSheet.js';
import { PersonaPicker } from './personaPicker.js';
import { Chat } from './chatEngine.js';
import { LocalSettings } from '../services/localSettings.js';
import { PERSONAS } from '../config/personas.js';
import { OverlayManager } from '../services/overlayManager.js';

export const AdvancedControls = (() => {

  function openOverlay(overlayEl) {
    OverlayManager.open(overlayEl);
  }

  function closeOverlay(overlayEl) {
    OverlayManager.close(overlayEl);
  }

  function render() {
    try {
      // Update Persona trail text
      const currentPersonaId = LocalSettings.getPersona();
      const persona = PERSONAS.find(p => p.id === currentPersonaId) || PERSONAS[0];
      const personaTrail = document.getElementById('advancedControlsPersonaTrail');
      if (personaTrail && personaTrail.childNodes[0]) {
        personaTrail.childNodes[0].textContent = persona.label;
      }

      // Agent Mode toggle state
      const agentToggle = document.getElementById('advancedControlsAgentToggle');
      if (agentToggle && typeof Chat !== 'undefined' && Chat && Chat.isAgentModeOn) {
        if (Chat.isAgentModeOn()) {
          agentToggle.classList.add('is-active');
        } else {
          agentToggle.classList.remove('is-active');
        }
      }
    } catch (err) {
      console.error("AdvancedControls render error:", err);
      throw err;
    }
  }

  function open() {
    try {
      render();
      const el = document.getElementById('advancedControlsOverlay');
      if (!el) throw new Error("Overlay element not found in DOM.");
      openOverlay(el);
    } catch (err) {
      console.error("AdvancedControls open error:", err);
      if (window.Toast) window.Toast.show("Error opening Advanced Controls: " + err.message);
      else alert("Error: " + err.message);
    }
  }

  function close() {
    closeOverlay(document.getElementById('advancedControlsOverlay'));
  }

  function init() {
    const overlay = document.getElementById('advancedControlsOverlay');
    if (overlay) {
      overlay.addEventListener('click', (e) => {
        if (e.target.id === 'advancedControlsOverlay') close();
      });
    }
    const closeBtn = document.getElementById('advancedControlsCloseBtn');
    if (closeBtn) {
      closeBtn.addEventListener('click', close);
    }

    // Connectors Row
    const connectorsRow = document.getElementById('advancedControlsConnectorsRow');
    if (connectorsRow) {
      connectorsRow.addEventListener('click', () => {
        close();
        setTimeout(() => ConnectorsSheet.open(), 120);
      });
    }

    // Persona/Template Row
    const personaRow = document.getElementById('advancedControlsPersonaRow');
    if (personaRow) {
      personaRow.addEventListener('click', () => {
        close();
        setTimeout(() => {
          if (PersonaPicker && PersonaPicker.open) {
            PersonaPicker.open();
          }
        }, 120);
      });
    }

    // Agent Mode Row
    const agentModeRow = document.getElementById('advancedControlsAgentModeRow');
    if (agentModeRow) {
      agentModeRow.addEventListener('click', () => {
        // reuse existing agentModeBtn handler
        const btn = document.getElementById('agentModeBtn');
        if (btn) btn.click();
        
        // update toggle locally based on actual state, not blindly
        setTimeout(() => {
          const toggle = document.getElementById('advancedControlsAgentToggle');
          if (toggle && Chat && Chat.isAgentModeOn) {
            if (Chat.isAgentModeOn()) {
              toggle.classList.add('is-active');
            } else {
              toggle.classList.remove('is-active');
            }
          }
        }, 50);
      });
    }

    // Select Model Row
    const selectModelRow = document.getElementById('advancedControlsSelectModelRow');
    if (selectModelRow) {
      selectModelRow.addEventListener('click', () => {
        close();
        setTimeout(() => {
          if (BottomSheet && BottomSheet.openModelSheet) {
            BottomSheet.openModelSheet();
          }
        }, 120);
      });
    }
  }

  return { init, open, close, render };
})();
