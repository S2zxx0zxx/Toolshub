/* ============================================
   TOOLSHUB — BOTTOM SHEETS
   Open/close logic for "+" sheet and Tool Selector sheet.
   Also wires: Add-to-project, Tool-access, Connectors rows.
   ============================================ */

import { LocalSettings } from '../services/localSettings.js';
import { ToolSelector } from '../tools/registry.js';
import { UtilityTools } from '../tools/utilityTools.js';
import { FileTools } from '../tools/fileTools.js';
import { Toast } from './toast.js';
import { Chat } from './chatEngine.js';
import { Sidebar } from './sidebar.js';

export const BottomSheet = (() => {

  const MODEL_CATALOG = [
    { id: 'llama-3.3-70b-versatile', label: 'Llama 3.3 70B', sub: 'Best for general chat', dailyLimit: 100000 },
    { id: 'llama-3.1-8b-instant', label: 'Llama 3.1 8B', sub: 'Fastest responses', dailyLimit: 500000 },
    { id: 'groq/compound', label: 'Compound', sub: "Groq's agentic model", dailyLimit: 70000 },
    { id: 'groq/compound-mini', label: 'Compound Mini', sub: 'Lightweight agentic model', dailyLimit: 70000 }
  ];

  const exhaustedModels = new Set(); // In-memory, resets on page reload

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

  // ---------- PROJECT SHEET ----------
  function openProjectSheet() {
    renderProjectSheet();
    openOverlay(document.getElementById('projectSheetOverlay'));
  }
  function closeProjectSheet() {
    closeOverlay(document.getElementById('projectSheetOverlay'));
  }

  function renderProjectSheet() {
    const list   = document.getElementById('projectSheetList');
    const trailEl = document.getElementById('addToProjectTrail');
    if (!list) return;

    const projects    = LocalSettings.getProjects();
    const activeId    = LocalSettings.getActiveProject();
    const activeProj  = projects.find(p => p.id === activeId) || null;

    list.innerHTML = '';

    // Existing projects
    projects.forEach(p => {
      const row = document.createElement('button');
      row.className = 'project-item';
      row.style.width = '100%';
      row.style.textAlign = 'left';
      row.innerHTML = `
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
          style="width:18px;height:18px;color:var(--accent);flex-shrink:0;">
          <path d="M22 19a2 2 0 01-2 2H4a2 2 0 01-2-2V5a2 2 0 012-2h5l2 3h9a2 2 0 012 2z"/>
        </svg>
        <span class="project-item-name"></span>
        ${p.id === activeId ? `<svg class="project-item-check" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><polyline points="20 6 9 17 4 12"/></svg>` : ''}
      `;
      row.querySelector('.project-item-name').textContent = p.name;
      row.addEventListener('click', () => {
        LocalSettings.setActiveProject(p.id);
        if (Chat) Chat.assignProject(p.id);
        if (Sidebar) Sidebar.renderProjects();
        if (trailEl) {
          trailEl.childNodes[0].textContent = p.name + ' ';
        }
        closeProjectSheet();
      });
      list.appendChild(row);
    });

    // Divider + "New project" input area
    if (projects.length > 0) {
      const div = document.createElement('div');
      div.style.cssText = 'height:1px;background:var(--border-subtle);margin:var(--sp-2) 0;';
      list.appendChild(div);
    }

    const newWrap = document.createElement('div');
    newWrap.innerHTML = `
      <div class="project-new-input-wrap">
        <input class="project-new-input" id="projectNameInput" type="text" placeholder="New project name…" maxlength="48">
        <button class="btn btn-primary" id="projectCreateBtn" style="flex-shrink:0;height:40px;padding:0 var(--sp-4);">Create</button>
      </div>
    `;
    list.appendChild(newWrap);

    document.getElementById('projectCreateBtn')?.addEventListener('click', () => {
      const input = document.getElementById('projectNameInput');
      const name = input ? input.value.trim() : '';
      if (!name) return;
      const newProj = { id: 'p_' + Date.now().toString(36), name };
      LocalSettings.saveProject(newProj);
      LocalSettings.setActiveProject(newProj.id);
      if (Chat) Chat.assignProject(newProj.id);
      if (Sidebar) Sidebar.renderProjects();

      if (trailEl) {
        trailEl.childNodes[0].textContent = name + ' ';
      }
      closeProjectSheet();
    });

    document.getElementById('projectNameInput')?.addEventListener('keydown', e => {
      if (e.key === 'Enter') document.getElementById('projectCreateBtn')?.click();
    });
  }

  // ---------- TOOL ACCESS SHEET ----------
  const ACCESS_OPTIONS = [
    { id: 'auto',        label: 'Auto',        sub: 'ToolsHub decides when to use tools' },
    { id: 'always-ask',  label: 'Always ask',  sub: 'Confirm before running any tool' },
    { id: 'off',         label: 'Off',          sub: 'Never use tools automatically' },
  ];

  function openToolAccessSheet() {
    renderToolAccessSheet();
    openOverlay(document.getElementById('toolAccessSheetOverlay'));
  }
  function closeToolAccessSheet() {
    closeOverlay(document.getElementById('toolAccessSheetOverlay'));
  }

  function renderToolAccessSheet() {
    const list    = document.getElementById('toolAccessList');
    const trailEl = document.getElementById('toolAccessTrail');
    if (!list) return;

    const current = LocalSettings.getToolAccess();

    list.innerHTML = ACCESS_OPTIONS.map(o => `
      <button class="list-row ${o.id === current ? 'is-selected' : ''}"
           data-access="${o.id}">
        <div class="list-row-body">
          <div class="list-row-title">${o.label}</div>
          ${o.sub ? `<div class="list-row-subtitle">${o.sub}</div>` : ''}
        </div>
        <div class="list-row-trail">
          <svg class="access-check" viewBox="0 0 24 24" fill="none" stroke="currentColor"
            stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <polyline points="20 6 9 17 4 12"/>
          </svg>
        </div>
      </button>
    `).join('');

    list.querySelectorAll('[data-access]').forEach(row => {
      row.addEventListener('click', () => {
        const val = row.dataset.access;
        LocalSettings.setToolAccess(val);
        const opt = ACCESS_OPTIONS.find(o => o.id === val);
        if (trailEl && opt) {
          trailEl.childNodes[0].textContent = opt.label + ' ';
        }
        closeToolAccessSheet();
      });
    });
  }

  // ---------- MODEL SELECTOR SHEET ----------

  function setupExhaustionListener() {
    window.addEventListener('model-exhausted', (e) => {
      const { modelId } = e.detail;
      if (modelId) {
        exhaustedModels.add(modelId);
        
        // Re-render the model sheet if it's currently open to show ⚠️
        const sheetOverlay = document.getElementById('modelSheetOverlay');
        if (sheetOverlay && sheetOverlay.classList.contains('is-open')) {
          renderModelSheet();
        }
      }
    });
  }

  function updateModelChip(modelId) {
    const chip = document.querySelector('#modelChip span');
    const model = MODEL_CATALOG.find(m => m.id === modelId);
    if (chip && model) {
      chip.textContent = model.label;
    }
  }

  function restoreModelChip() {
    const selectedId = LocalSettings.getSelectedChatModel();
    if (selectedId) {
      updateModelChip(selectedId);
    } else {
      // Show default
      const chip = document.querySelector('#modelChip span');
      const defaultModel = MODEL_CATALOG[0];
      if (chip && defaultModel) chip.textContent = defaultModel.label;
    }
  }

  function openModelSheet() {
    renderModelSheet();
    openOverlay(document.getElementById('modelSheetOverlay'));
  }
  
  function closeModelSheet() {
    closeOverlay(document.getElementById('modelSheetOverlay'));
  }

  function renderModelSheet() {
    const list = document.getElementById('modelSheetList');
    if (!list) return;

    let current = LocalSettings.getSelectedChatModel() || 'llama-3.3-70b-versatile';

    list.innerHTML = '';
    
    MODEL_CATALOG.forEach(model => {
      const row = document.createElement('button');
      row.className = `list-row ${model.id === current ? 'is-selected' : ''}`;
      row.dataset.modelId = model.id;
      
      const isExhausted = exhaustedModels.has(model.id);
      const label = isExhausted ? `⚠️ ${model.label}` : model.label;
      
      row.innerHTML = `
        <div class="list-row-body">
          <div class="list-row-title">${label}</div>
          <div class="list-row-subtitle">${model.sub}</div>
        </div>
        <div class="list-row-trail">
          <svg class="access-check" viewBox="0 0 24 24" fill="none" stroke="currentColor"
            stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <polyline points="20 6 9 17 4 12"/>
          </svg>
        </div>
      `;
      
      row.addEventListener('click', () => {
        const modelId = row.dataset.modelId;
        LocalSettings.setSelectedChatModel(modelId);
        updateModelChip(modelId);
        closeModelSheet();
      });
      
      list.appendChild(row);
    });
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
    document.getElementById('webSearchRow')?.addEventListener('click', function () {
      const toggle = document.getElementById('webSearchToggle');
      if (toggle) {
        toggle.classList.toggle('is-on');
        const isOn = toggle.classList.contains('is-on');
        this.setAttribute('aria-pressed', isOn);
        LocalSettings.setWebSearchEnabled(isOn);
      }
    });

    // ---- Add to project row (Pattern B) ----
    document.getElementById('addToProjectRow')?.addEventListener('click', () => {
      closeAddSheet();
      setTimeout(openProjectSheet, 120); // brief delay so add sheet can close cleanly
    });

    // Project sheet close
    document.getElementById('projectSheetCloseBtn')?.addEventListener('click', closeProjectSheet);
    document.getElementById('projectSheetOverlay')?.addEventListener('click', e => {
      if (e.target.id === 'projectSheetOverlay') closeProjectSheet();
    });

    // ---- Tool access row (Pattern B) ----
    document.getElementById('toolAccessRow')?.addEventListener('click', () => {
      closeAddSheet();
      setTimeout(openToolAccessSheet, 120);
    });

    // Tool access sheet close
    document.getElementById('toolAccessSheetCloseBtn')?.addEventListener('click', closeToolAccessSheet);
    document.getElementById('toolAccessSheetOverlay')?.addEventListener('click', e => {
      if (e.target.id === 'toolAccessSheetOverlay') closeToolAccessSheet();
    });

    // ---- Connectors row (Pattern C: honest "coming soon" toast) ----
    document.getElementById('connectorsRow')?.addEventListener('click', () => {
      closeAddSheet();
      setTimeout(() => Toast.show('Connectors are coming soon.'), 120);
    });

    // tool selector sheet triggers
    document.getElementById('toolChip')?.addEventListener('click', openToolSheet);
    document.getElementById('toolSheetCloseBtn')?.addEventListener('click', closeToolSheet);
    document.getElementById('toolSheetBackBtn')?.addEventListener('click', ToolSelector.backToCategoryLevel);
    document.getElementById('toolSheetOverlay')?.addEventListener('click', (e) => {
      if (e.target.id === 'toolSheetOverlay') closeToolSheet();
    });

    // model selector sheet triggers
    document.getElementById('modelChip')?.addEventListener('click', openModelSheet);
    document.getElementById('modelSheetCloseBtn')?.addEventListener('click', closeModelSheet);
    document.getElementById('modelSheetOverlay')?.addEventListener('click', (e) => {
      if (e.target.id === 'modelSheetOverlay') closeModelSheet();
    });

    // Restore tool-access trail text on load
    const trailEl = document.getElementById('toolAccessTrail');
    if (trailEl) {
      const current = LocalSettings.getToolAccess();
      const opt = ACCESS_OPTIONS.find(o => o.id === current);
      if (opt) trailEl.childNodes[0].textContent = opt.label + ' ';
    }

    // Restore active project trail text on load
    const projTrailEl = document.getElementById('addToProjectTrail');
    if (projTrailEl) {
      const activeId = LocalSettings.getActiveProject();
      const proj = activeId ? LocalSettings.getProjects().find(p => p.id === activeId) : null;
      if (proj) projTrailEl.childNodes[0].textContent = proj.name + ' ';
    }

    // Restore web search toggle state
    const webSearchToggle = document.getElementById('webSearchToggle');
    if (webSearchToggle) {
      const isEnabled = LocalSettings.getWebSearchEnabled();
      if (isEnabled) {
        webSearchToggle.classList.add('is-on');
        document.getElementById('webSearchRow')?.setAttribute('aria-pressed', 'true');
      }
    }

    setupExhaustionListener();
    restoreModelChip();
  }

  return { init, openAddSheet, closeAddSheet, openToolSheet, closeToolSheet };
})();
