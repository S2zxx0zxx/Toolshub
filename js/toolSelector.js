/* ============================================
   TOOLSHUB — TOOL SELECTOR
   Category -> Tool data model + 2-level sheet logic
   + pinned sidebar shortcuts + prompt cards
   ============================================ */

const ToolSelector = (() => {

  // ---------- ICON LIBRARY (inline SVG paths, stroke-based) ----------
  const ICONS = {
    social:     '<path d="M17 2H7a5 5 0 00-5 5v10a5 5 0 005 5h10a5 5 0 005-5V7a5 5 0 00-5-5z"/><path d="M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>',
    web:        '<circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 010 20 15.3 15.3 0 010-20z"/>',
    edu:        '<path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c0 1.66 2.69 3 6 3s6-1.34 6-3v-5"/>',
    instagram:  '<rect x="2" y="2" width="20" height="20" rx="5"/><path d="M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>',
    facebook:   '<path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z"/>',
    youtube:    '<path d="M22.54 6.42a2.78 2.78 0 00-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 00-1.94 2A29 29 0 001 11.75a29 29 0 00.46 5.33A2.78 2.78 0 003.4 19a29 29 0 008.6.46s6.88 0 8.6-.46a2.78 2.78 0 001.94-2 29 29 0 00.46-5.25 29 29 0 00-.46-5.33z"/><polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02"/>',
    twitter:    '<path d="M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2c9 5 20 0 20-11.5a4.5 4.5 0 00-.08-.83A7.72 7.72 0 0023 3z"/>',
    blog:       '<path d="M4 19.5A2.5 2.5 0 016.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 014 19.5v-15A2.5 2.5 0 016.5 2z"/>',
    insights:   '<line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/>',
    audit:      '<path d="M9 11l3 3L22 4"/><path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11"/>',
    bug:        '<rect x="8" y="6" width="8" height="14" rx="4"/><path d="M19 7l-3 2M5 7l3 2M19 19l-3-2M5 19l3-2M12 20v-9M9 9V7a3 3 0 016 0v2"/>',
    score:      '<circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>',
    humanize:   '<circle cx="12" cy="8" r="5"/><path d="M20 21a8 8 0 00-16 0"/>',
    email:      '<path d="M4 4h16a2 2 0 012 2v12a2 2 0 01-2 2H4a2 2 0 01-2-2V6a2 2 0 012-2z"/><polyline points="22 6 12 13 2 6"/>',
  };

  function icon(name, cls) {
    return `<svg class="${cls || ''}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">${ICONS[name] || ICONS.web}</svg>`;
  }

  // ---------- DATA MODEL ----------
  const DATA = [
    {
      id: 'social',
      title: 'Social Media',
      sub: 'Platform tools for growth',
      icon: 'social',
      tools: [
        { id: 'ig-caption',   title: 'Instagram Caption Writer', sub: 'Captions, hashtags, reel ideas', icon: 'instagram', placeholder: 'Paste your reel topic or photo description...', pinned: true },
        { id: 'ig-growth',    title: 'Instagram Growth Tips',    sub: 'Engagement & growth strategy',    icon: 'instagram', placeholder: 'Describe your Instagram account...' },
        { id: 'fb-post',      title: 'Facebook Post Writer',     sub: 'Posts & ad copy',                 icon: 'facebook',  placeholder: 'What do you want to post about?' },
        { id: 'yt-meta',      title: 'YouTube Title & Tags',     sub: 'Titles, descriptions, tags',      icon: 'youtube',   placeholder: 'Paste your video topic...' },
        { id: 'yt-script',    title: 'YouTube Script Writer',    sub: 'Full video scripts',              icon: 'youtube',   placeholder: 'What is your video about?' },
        { id: 'x-thread',     title: 'X Thread Writer',          sub: 'Threads & tweet generator',       icon: 'twitter',   placeholder: 'What topic should the thread cover?' },
        { id: 'blog-post',    title: 'Blog Post Writer',         sub: 'SEO-structured blog posts',       icon: 'blog',      placeholder: 'What should the blog post be about?' },
      ],
    },
    {
      id: 'web',
      title: 'Web & App',
      sub: 'Diagnostics & audit reports',
      icon: 'web',
      tools: [
        { id: 'page-insights', title: 'Website Page Insights',    sub: 'Speed & SEO snapshot',      icon: 'insights', placeholder: 'Paste a website URL to analyze...', pinned: true },
        { id: 'full-audit',    title: 'Audit & Report',           sub: 'Full site audit generator', icon: 'audit',    placeholder: 'Paste a website URL for a full audit...' },
        { id: 'bug-report',    title: 'Bug & Issue Report',       sub: 'Structured bug reporting',  icon: 'bug',      placeholder: 'Describe the bug or issue...' },
        { id: 'score-meter',   title: 'Score & Improvement Meter', sub: 'Performance/SEO scoring',  icon: 'score',    placeholder: 'Paste a website URL to score...' },
      ],
    },
    {
      id: 'edu',
      title: 'Education & Skills',
      sub: 'Personal writing assist',
      icon: 'edu',
      tools: [
        { id: 'humanize', title: 'AI to Humanize', sub: 'Make AI text sound natural', icon: 'humanize', placeholder: 'Paste the AI-generated text...' },
        { id: 'email-write', title: 'Email Writing', sub: 'Professional email generator', icon: 'email', placeholder: 'What is this email about?' },
      ],
    },
  ];

  let activeToolId = null;

  function findTool(toolId) {
    for (const cat of DATA) {
      const t = cat.tools.find(t => t.id === toolId);
      if (t) return { tool: t, category: cat };
    }
    return null;
  }

  function getPinned() {
    const pinned = [];
    DATA.forEach(cat => cat.tools.forEach(t => { if (t.pinned) pinned.push({ ...t, categoryId: cat.id }); }));
    return pinned;
  }

  // ---------- RENDER: sidebar pinned shortcuts ----------
  function renderPins() {
    const el = document.getElementById('sidebarPins');
    if (!el) return;
    el.innerHTML = getPinned().map(t => `
      <div class="sidebar-pin-item" data-tool-id="${t.id}">
        ${icon(t.icon)}
        <span>${t.title}</span>
      </div>
    `).join('');
    el.querySelectorAll('.sidebar-pin-item').forEach(node => {
      node.addEventListener('click', () => selectTool(node.dataset.toolId));
    });
  }

  // ---------- RENDER: level 1 (categories) ----------
  function renderCategoryLevel() {
    const el = document.getElementById('categoryLevel');
    el.innerHTML = DATA.map(cat => `
      <div class="category-card" data-cat-id="${cat.id}">
        <div class="category-icon">${icon(cat.icon)}</div>
        <div class="category-body">
          <div class="category-title">${cat.title}</div>
          <div class="category-sub">${cat.sub}</div>
        </div>
        <svg class="tool-check" style="color:var(--text-muted);width:16px;height:16px;" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><polyline points="9 18 15 12 9 6"/></svg>
      </div>
    `).join('');
    el.querySelectorAll('.category-card').forEach(node => {
      node.addEventListener('click', () => renderToolLevel(node.dataset.catId));
    });
  }

  // ---------- RENDER: level 2 (tools within category) ----------
  function renderToolLevel(catId) {
    const cat = DATA.find(c => c.id === catId);
    if (!cat) return;

    const el = document.getElementById('toolLevel');
    el.innerHTML = cat.tools.map(t => `
      <div class="tool-card ${t.id === activeToolId ? 'is-selected' : ''}" data-tool-id="${t.id}">
        <div class="tool-icon">${icon(t.icon)}</div>
        <div class="tool-body">
          <div class="tool-title">${t.title}</div>
          <div class="tool-sub">${t.sub}</div>
        </div>
        ${t.id === activeToolId ? `<svg class="tool-check" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>` : ''}
      </div>
    `).join('');
    el.querySelectorAll('.tool-card').forEach(node => {
      node.addEventListener('click', () => selectTool(node.dataset.toolId));
    });

    // slide to level 2
    const levels = document.getElementById('toolLevels');
    const sheet = document.getElementById('toolSheet');
    const title = document.getElementById('toolSheetTitle');
    levels.classList.add('level-2');
    sheet.classList.add('has-back');
    title.textContent = cat.title;
  }

  function backToCategoryLevel() {
    const levels = document.getElementById('toolLevels');
    const sheet = document.getElementById('toolSheet');
    const title = document.getElementById('toolSheetTitle');
    levels.classList.remove('level-2');
    sheet.classList.remove('has-back');
    title.textContent = 'Choose a category';
  }

  // ---------- SELECT TOOL: updates chip, placeholder, prompt cards ----------
  function selectTool(toolId, opts) {
    const found = findTool(toolId);
    if (!found) return;
    activeToolId = toolId;

    const chipLabel = document.getElementById('toolChipLabel');
    const chipIcon = document.querySelector('#toolChip .chip-icon');
    if (chipLabel) chipLabel.textContent = found.tool.title;
    if (chipIcon) chipIcon.outerHTML = icon(found.tool.icon, 'chip-icon');

    const textarea = document.getElementById('inputTextarea');
    if (textarea) textarea.placeholder = found.tool.placeholder;

    renderPromptCards(found.tool);

    if (!(opts && opts.silent) && window.BottomSheet) {
      window.BottomSheet.closeToolSheet();
    }
  }

  function getActiveTool() {
    return activeToolId ? findTool(activeToolId) : null;
  }

  // ---------- RENDER: suggested prompt cards on empty state ----------
  function renderPromptCards(tool) {
    const el = document.getElementById('promptCards');
    if (!el) return;
    if (!tool) { el.innerHTML = ''; return; }

    // simple generic quick-actions per tool; kept short and tool-flavored
    const suggestions = [
      { title: `Start with ${tool.title}`, sub: tool.sub },
      { title: 'See an example output', sub: 'Quick sample to get a feel' },
    ];
    el.innerHTML = suggestions.map(s => `
      <button class="prompt-card">
        <div class="prompt-card-title">${s.title}</div>
        <div class="prompt-card-sub">${s.sub}</div>
      </button>
    `).join('');
  }

  function init() {
    renderPins();
    renderCategoryLevel();
    // default: no tool selected, level 2 empty until a category is tapped
  }

  return {
    DATA,
    icon,
    init,
    selectTool,
    getActiveTool,
    renderCategoryLevel,
    renderToolLevel,
    backToCategoryLevel,
    renderPromptCards,
  };
})();

window.ToolSelector = ToolSelector;
