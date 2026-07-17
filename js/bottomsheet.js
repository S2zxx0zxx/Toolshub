/* ============================================
   TOOLSHUB — BOTTOM SHEETS
   Open/close logic for "+" sheet and Tool Selector sheet.
   Also wires: Add-to-project, Tool-access, Connectors rows.
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

    const projects    = Storage.getProjects();
    const activeId    = Storage.getActiveProject();
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
        Storage.setActiveProject(p.id);
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
      const proj = { id: 'p_' + Date.now().toString(36), name };
      Storage.saveProject(proj);
      Storage.setActiveProject(proj.id);
      if (trailEl) trailEl.childNodes[0].textContent = proj.name + ' ';
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

    const current = Storage.getToolAccess();

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
        Storage.setToolAccess(val);
        const opt = ACCESS_OPTIONS.find(o => o.id === val);
        if (trailEl && opt) {
          trailEl.childNodes[0].textContent = opt.label + ' ';
        }
        closeToolAccessSheet();
      });
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
    document.getElementById('webSearchToggle')?.addEventListener('click', function () {
      this.classList.toggle('is-on');
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

    // Restore tool-access trail text on load
    const trailEl = document.getElementById('toolAccessTrail');
    if (trailEl) {
      const current = Storage.getToolAccess();
      const opt = ACCESS_OPTIONS.find(o => o.id === current);
      if (opt) trailEl.childNodes[0].textContent = opt.label + ' ';
    }

    // Restore active project trail text on load
    const projTrailEl = document.getElementById('addToProjectTrail');
    if (projTrailEl) {
      const activeId = Storage.getActiveProject();
      const proj = activeId ? Storage.getProjects().find(p => p.id === activeId) : null;
      if (proj) projTrailEl.childNodes[0].textContent = proj.name + ' ';
    }
  }

  return { init, openAddSheet, closeAddSheet, openToolSheet, closeToolSheet };
})();

window.BottomSheet = BottomSheet;
