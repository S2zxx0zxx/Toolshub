import { LocalSettings } from '../services/localSettings.js';
import { PERSONAS } from '../config/personas.js';
import { ToolSelector } from '../tools/registry.js';
import { Toast } from './toast.js';

export const PersonaPicker = (() => {
  let modalOverlay = null;

  function init() {
    // 1. Create HTML structure
    modalOverlay = document.createElement('div');
    modalOverlay.className = 'persona-overlay';
    modalOverlay.id = 'personaPickerOverlay';
    
    // Close on background click
    modalOverlay.addEventListener('click', (e) => {
      if (e.target === modalOverlay) close();
    });

    const modal = document.createElement('div');
    modal.className = 'persona-modal';

    const header = document.createElement('div');
    header.className = 'persona-header';
    
    const closeBtn = document.createElement('button');
    closeBtn.className = 'persona-close-btn';
    closeBtn.innerHTML = '<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>';
    closeBtn.addEventListener('click', close);
    
    const title = document.createElement('div');
    title.className = 'persona-title';
    title.textContent = 'How will you use ToolsHub?';
    
    const subtitle = document.createElement('div');
    subtitle.className = 'persona-subtitle';
    subtitle.textContent = 'Pick a persona to personalize your tools and AI assistant.';
    
    header.appendChild(closeBtn);
    header.appendChild(title);
    header.appendChild(subtitle);
    
    const grid = document.createElement('div');
    grid.className = 'persona-grid';
    
    // Separate general from regular personas
    const regularPersonas = PERSONAS.filter(p => p.id !== 'general');
    const generalPersona = PERSONAS.find(p => p.id === 'general');
    
    // Populate cards
    regularPersonas.forEach(p => {
      const card = document.createElement('div');
      card.className = 'persona-card';
      card.dataset.id = p.id;
      
      const iconWrap = document.createElement('div');
      iconWrap.className = 'persona-icon';
      iconWrap.innerHTML = ToolSelector.icon ? ToolSelector.icon(p.icon) : '';
      
      const labelWrap = document.createElement('div');
      labelWrap.className = 'persona-label';
      labelWrap.textContent = p.label;
      
      const taglineWrap = document.createElement('div');
      taglineWrap.className = 'persona-tagline';
      taglineWrap.textContent = p.tagline;
      
      card.appendChild(iconWrap);
      card.appendChild(labelWrap);
      card.appendChild(taglineWrap);
      
      card.addEventListener('click', () => {
        selectPersona(p);
      });
      
      grid.appendChild(card);
    });
    
    modal.appendChild(header);
    modal.appendChild(grid);
    
    if (generalPersona) {
      const skipWrap = document.createElement('div');
      skipWrap.className = 'persona-skip-wrap';
      
      const skipBtn = document.createElement('button');
      skipBtn.className = 'persona-skip-btn';
      skipBtn.textContent = 'Skip for now';
      skipBtn.addEventListener('click', () => {
        selectPersona(generalPersona);
      });
      
      skipWrap.appendChild(skipBtn);
      modal.appendChild(skipWrap);
    }
    
    modalOverlay.appendChild(modal);
    
    document.body.appendChild(modalOverlay);
    
    // 2. Auto-open if no persona set (first run)
    if (LocalSettings && LocalSettings.getPersona() === null) {
      // Small delay to ensure CSS applies
      setTimeout(() => open(), 100);
    }
  }
  
  function selectPersona(persona) {
    if (LocalSettings) {
      LocalSettings.setPersona(persona.id);
    }
    
    // Set categories using the existing ToolSelector mechanism
    if (ToolSelector && ToolSelector.setEnabledCategories) {
      ToolSelector.setEnabledCategories(persona.relevantCategoryIds);
    }
    
    close();
    
    // Show optional toast for specific personas
    if (persona.id !== 'general' && Toast) {
      Toast.show(`Set up for ${persona.label}`);
    }
    
    // Update active state in UI
    updateActiveCard(persona.id);
    
    // Dispatch event so Settings UI can update immediately if it's open
    window.dispatchEvent(new CustomEvent('persona-changed', { detail: persona }));
  }
  
  function updateActiveCard(activeId) {
    if (!modalOverlay) return;
    const cards = modalOverlay.querySelectorAll('.persona-card');
    cards.forEach(card => {
      if (card.dataset.id === activeId) {
        card.classList.add('is-active');
      } else {
        card.classList.remove('is-active');
      }
    });
  }

  function open() {
    if (!modalOverlay) return;
    const currentPersona = LocalSettings ? LocalSettings.getPersona() : null;
    updateActiveCard(currentPersona || 'general');
    
    modalOverlay.style.display = 'flex';
    // Small timeout for CSS transition
    setTimeout(() => {
      modalOverlay.classList.add('is-open');
    }, 10);
  }

  function close() {
    if (!modalOverlay) return;
    modalOverlay.classList.remove('is-open');
    setTimeout(() => {
      modalOverlay.style.display = 'none';
    }, 220); // match var(--dur-base)
  }

  return { init, open, close };
})();
