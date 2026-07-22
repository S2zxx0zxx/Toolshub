/* ============================================
   TOOLSHUB — BOTTOM SHEETS
   Open/close logic for "+" sheet and Tool Selector sheet.
   Also wires: Add-to-project, Tool-access, Connectors rows.
   ============================================ */

import { LocalSettings } from '../services/localSettings.js';
import { rankOf } from '../config/planVocabulary.js';
import { ToolSelector } from '../tools/registry.js';
import { UtilityTools } from '../tools/utilityTools.js';
import { FileTools } from '../tools/fileTools.js';
import { Toast } from './toast.js';
import { Chat } from './chatEngine.js';
import { Sidebar } from './sidebar.js';
import { ChangePlanModal } from './changePlanModal.js';
import { OverlayManager } from '../services/overlayManager.js';

export const MODEL_CATALOG = [
  {
    category: 'MINI',
    models: [
      { id: 'llama-3.3-70b-versatile', label: 'Digilite', tag: '(medium)', sub: 'General Chats', dailyLimit: 100000, requiredTier: 'free' }
    ]
  },
  {
    category: 'FULL',
    models: [
      { id: 'llama-3.1-8b-instant', label: 'DigiPro', tag: '(High)', sub: 'Fastest Ever You Think', dailyLimit: 500000, requiredTier: 'monthly' },
      { id: 'gpt-4o-mini', label: 'Maya', tag: '(</> Max)', sub: 'You Think I code', dailyLimit: 50000, requiredTier: '6month' }
    ]
  },
  {
    category: 'FLAGSHIP',
    models: [
      { id: 'groq/compound', label: 'Maya Pro', tag: '(Stay Tuned)', sub: 'Premium features coming', dailyLimit: 70000, requiredTier: 'yearly' }
    ]
  }
];

export const BottomSheet = (() => {

  // Vocabulary MUST match worker/src/planResolver.js PLAN_MAX_STEPS keys — do not introduce aliases here.
  function tierRank(tier) {
    return rankOf(tier);
  }
  
  function userCanAccess(requiredTier) {
    const currentPlan = LocalSettings.getCurrentPlan();
    return rankOf(currentPlan) >= rankOf(requiredTier);
  }
  
  function findModel(id) {
    return MODEL_CATALOG.flatMap(c => c.models).find(m => m.id === id);
  }

  const exhaustedModels = new Set(); // In-memory, resets on page reload

  function openOverlay(overlayEl) {
    OverlayManager.open(overlayEl);
  }
  function closeOverlay(overlayEl) {
    OverlayManager.close(overlayEl);
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
    const model = findModel(modelId);
    if (chip && model) {
      chip.textContent = model.label + (model.tag ? ' ' + model.tag : '');
    }
  }

  function restoreModelChip() {
    const selectedId = LocalSettings.getSelectedChatModel();
    if (selectedId) {
      updateModelChip(selectedId);
    } else {
      // Show default
      const chip = document.querySelector('#modelChip span');
      const defaultModel = MODEL_CATALOG[0]?.models?.[0];
      if (chip && defaultModel) chip.textContent = defaultModel.label + (defaultModel.tag ? ' ' + defaultModel.tag : '');
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
    
    MODEL_CATALOG.forEach(group => {
      const header = document.createElement('div');
      header.className = 'sheet-group-pill';
      header.textContent = group.category === 'FLAGSHIP' ? 'FLAGSHIP </>' : group.category;
      list.appendChild(header);

      group.models.forEach(model => {
        const row = document.createElement('button');
        const canAccess = userCanAccess(model.requiredTier);
        
        row.className = `list-row ${model.id === current ? 'is-selected' : ''} ${!canAccess ? 'is-disabled' : ''}`;
        row.dataset.modelId = model.id;
        
        const isExhausted = exhaustedModels.has(model.id);
        const label = isExhausted ? `⚠️ ${model.label}` : model.label;
        
        let tierUI = '';
        if (!canAccess) {
            tierUI = `<span class="mode-pill-lock"><span class="mode-pill-lock-text">${model.requiredTier.toUpperCase()}</span><svg viewBox="0 0 24 24" width="11" height="11" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg></span>`;
        } else {
            let tierName = 'Free';
            if (model.requiredTier === 'monthly') tierName = 'Starter';
            else if (model.requiredTier === '6month') tierName = 'Pro';
            else if (model.requiredTier === 'yearly') tierName = 'Max';
            tierUI = `<span class="mode-pill-tier">${tierName}</span>`;
        }
        
        row.innerHTML = `
          <div class="list-row-body">
            <div class="list-row-title">${label} ${model.tag ? `<span class="model-tag-inline">${model.tag}</span>` : ''}</div>
            <div class="list-row-subtitle-pro">${model.sub}</div>
          </div>
          <div class="list-row-trail">
            ${tierUI}
            ${canAccess ? `<svg class="access-check" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>` : ''}
          </div>
        `;
        
        row.addEventListener('click', () => {
          if (!canAccess) {
            closeModelSheet();
            setTimeout(() => {
              if (ChangePlanModal) ChangePlanModal.open();
            }, 120);
            return;
          }
          
          const modelId = row.dataset.modelId;
          LocalSettings.setSelectedChatModel(modelId);
          updateModelChip(modelId);
          closeModelSheet();
        });
        
        list.appendChild(row);
      });
    });

    // --- Image Generation Section ---
    const imgHeader = document.createElement('div');
    imgHeader.className = 'sheet-group-pill';
    imgHeader.innerHTML = `
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="width:14px;height:14px;">
        <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
        <circle cx="8.5" cy="8.5" r="1.5"/>
        <polyline points="21 15 16 10 5 21"/>
      </svg>
      IMAGE GENERATION
      <span style="color:var(--text-muted); text-transform:none; font-weight:400;">· Up to 2</span>
    `;
    list.appendChild(imgHeader);

    const imgModels = [
      { label: 'Image — Fast', sub: 'Standard generation', badge: 'PRO' },
      { label: 'Image — Ultra', sub: 'High fidelity details', badge: 'MAX' }
    ];

    imgModels.forEach(m => {
      const row = document.createElement('button');
      row.className = 'list-row is-disabled';
      const badgeClass = m.badge === 'MAX' ? 'badge-max' : 'badge-pro';
      row.innerHTML = `
        <div class="list-row-body">
          <div class="list-row-title">${m.label}</div>
          <div class="list-row-subtitle-pro" style="color:var(--text-muted); font-weight:normal;">${m.sub}</div>
        </div>
        <div class="list-row-trail">
          <div class="mode-pill-lock ${badgeClass}">${m.badge}</div>
        </div>
      `;
      row.addEventListener('click', () => {
        Toast.show('Image generation is coming soon!');
      });
      list.appendChild(row);
    });

    // --- Video Generation Section ---
    const vidHeader = document.createElement('div');
    vidHeader.className = 'sheet-group-pill';
    vidHeader.innerHTML = `
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="width:14px;height:14px;">
        <polygon points="23 7 16 12 23 17 23 7"/>
        <rect x="1" y="5" width="15" height="14" rx="2" ry="2"/>
      </svg>
      VIDEO GENERATION
      <span class="pill-soon">COMING SOON</span>
    `;
    list.appendChild(vidHeader);

    const vidDesc = document.createElement('div');
    vidDesc.style.color = 'var(--text-muted)';
    vidDesc.style.fontSize = 'var(--fs-xs)';
    vidDesc.style.padding = '0 var(--sp-4) var(--sp-2)';
    vidDesc.textContent = "Video models aren't available yet — they'll unlock in an upcoming release.";
    list.appendChild(vidDesc);

    const vidModels = [
      { label: 'Video — Standard', sub: 'Fast motion clips' },
      { label: 'Video — Pro', sub: 'Cinematic quality' }
    ];

    vidModels.forEach(m => {
      const row = document.createElement('button');
      row.className = 'list-row is-disabled';
      row.innerHTML = `
        <div class="list-row-body">
          <div class="list-row-title">${m.label}</div>
          <div class="list-row-subtitle-pro" style="color:var(--text-muted); font-weight:normal;">${m.sub}</div>
        </div>
        <div class="list-row-trail">
          <div class="pill-muted">SOON</div>
        </div>
      `;
      row.addEventListener('click', () => {
        Toast.show("Video generation isn't available yet — coming in a future update!");
      });
      list.appendChild(row);
    });
  }
  // ---------- REPORT BUG SHEET ----------
  function openReportBugSheet() {
    const textarea = document.getElementById('reportBugTextarea');
    if (textarea) textarea.value = '';
    updateReportBugCounter();
    openOverlay(document.getElementById('reportBugSheetOverlay'));
  }
  function closeReportBugSheet() {
    closeOverlay(document.getElementById('reportBugSheetOverlay'));
  }
  function updateReportBugCounter() {
    const textarea = document.getElementById('reportBugTextarea');
    const counter = document.getElementById('reportBugCounter');
    const sendBtn = document.getElementById('reportBugSendBtn');
    if (!textarea || !counter || !sendBtn) return;
    const len = textarea.value.length;
    counter.textContent = `${len} / 2000`;
    sendBtn.disabled = len === 0;
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

    // ---- Connectors row ----
    document.getElementById('connectorsRow')?.addEventListener('click', () => {
      closeAddSheet();
      setTimeout(() => {
        document.dispatchEvent(new Event('open-connectors-sheet'));
      }, 120);
    });

    // ---- Advanced Controls row ----
    document.getElementById('advancedControlsBtnRow')?.addEventListener('click', () => {
      closeAddSheet();
      setTimeout(() => {
        document.dispatchEvent(new Event('open-advanced-controls'));
      }, 120);
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

  return { init, openAddSheet, closeAddSheet, openToolSheet, closeToolSheet, openModelSheet, closeModelSheet, openReportBugSheet, closeReportBugSheet, updateReportBugCounter, userCanAccess, MODEL_CATALOG };
})();
