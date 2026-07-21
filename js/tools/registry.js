/* ============================================
   TOOLSHUB — TOOL SELECTOR
   Category -> Tool data model + 2-level sheet logic
   + pinned sidebar shortcuts + prompt cards
   ============================================ */

import { LocalSettings } from '../services/localSettings.js';
import { CalculatorService } from '../services/tools/calculatorService.js';
import { WeatherService } from '../services/tools/weatherService.js';
import { SearchService } from '../services/tools/searchService.js';
import { FileTools } from './fileTools.js';
import { UtilityTools } from './utilityTools.js';
import { BottomSheet } from '../ui/bottomsheet.js';

export const ToolSelector = (() => {

  // ---------- ICON LIBRARY (inline SVG paths, stroke-based) ----------
  const ICONS = {
    // ---- existing icons (do not modify) ----
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
    // ---- new icons for Quick Utilities ----
    utilities:  '<path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/>',
    wordcount:  '<line x1="21" y1="6" x2="3" y2="6"/><line x1="17" y1="12" x2="3" y2="12"/><line x1="13" y1="18" x2="3" y2="18"/>',
    qrcode:     '<rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="3" height="3"/><rect x="18" y="14" width="3" height="3"/><rect x="14" y="18" width="3" height="3"/><rect x="18" y="18" width="3" height="3"/>',
    password:   '<rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0110 0v4"/>',
    casetext:   '<polyline points="4 7 4 4 20 4 20 7"/><line x1="9" y1="20" x2="15" y2="20"/><line x1="12" y1="4" x2="12" y2="20"/>',
    calendar:   '<rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>',
    unitconv:   '<path d="M8 3L4 7l4 4"/><line x1="4" y1="7" x2="20" y2="7"/><path d="M16 21l4-4-4-4"/><line x1="20" y1="17" x2="4" y2="17"/>',
    // ---- new icons for File & Image Tools ----
    files:         '<path d="M13 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V9z"/><polyline points="13 2 13 9 20 9"/>',
    imagecompress: '<rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/>',
    imgpdf:        '<path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="8" y1="13" x2="16" y2="13"/><line x1="8" y1="17" x2="16" y2="17"/>',
    pdfmerge:      '<path d="M9 3H5a2 2 0 00-2 2v14a2 2 0 002 2h6"/><path d="M15 3h4a2 2 0 012 2v14a2 2 0 01-2 2h-6"/><line x1="12" y1="8" x2="12" y2="16"/><polyline points="9 11 12 8 15 11"/><polyline points="9 16 12 19 15 16"/>',
    pdfsplit:      '<circle cx="6" cy="6" r="3"/><circle cx="6" cy="18" r="3"/><line x1="20" y1="4" x2="8.12" y2="15.88"/><line x1="14.47" y1="14.48" x2="20" y2="20"/><line x1="8.12" y1="8.12" x2="12" y2="12"/>',
    imgconvert:    '<path d="M7 16V4m0 0L3 8m4-4l4 4"/><path d="M17 8v12m0 0l4-4m-4 4l-4-4"/>',
    // ---- new icons for Student & Career ----
    career:        '<rect x="2" y="7" width="20" height="14" rx="2" ry="2"/><path d="M16 21V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v16"/>',
    resume:        '<path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="8" y1="13" x2="16" y2="13"/><line x1="8" y1="17" x2="16" y2="17"/><line x1="8" y1="9" x2="10" y2="9"/>',
    coverletter:   '<path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/>',
    gpacalc:       '<rect x="4" y="2" width="16" height="20" rx="2"/><line x1="8" y1="6" x2="16" y2="6"/><line x1="8" y1="10" x2="16" y2="10"/><line x1="8" y1="14" x2="12" y2="14"/>',
    citation:      '<path d="M3 21c3 0 7-1 7-8V5c0-1.25-.756-2.017-2-2H4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2 1 0 1 0 1 1v1c0 1-1 2-2 2s-1 .008-1 1.031V20c0 1 0 1 1 1z"/><path d="M15 21c3 0 7-1 7-8V5c0-1.25-.757-2.017-2-2h-4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2h.75c0 2.25.25 4-2.75 4v3c0 1 0 1 1 1z"/>',
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
        { id: 'ig-caption',   title: 'Instagram Caption Writer', sub: 'Captions, hashtags, reel ideas', icon: 'instagram', placeholder: 'Paste your reel topic or photo description...', pinned: true, systemPromptHint: 'You are an Instagram content expert specializing in growth and engagement. Given a topic, photo description, or content idea, provide: 3 caption variations (emotional/story-driven, educational/value-focused, action-oriented with a CTA); a hashtag strategy of 15-30 hashtags mixing high-volume, niche, and location-based tags; best posting day/time with a brief reason; 3-5 Reel ideas with hook concepts; and specific engagement tactics (comment prompts, CTA suggestions). Structure your response with clear headers for each section.' },
        { id: 'ig-growth',    title: 'Instagram Growth Tips',    sub: 'Engagement & growth strategy',    icon: 'instagram', placeholder: 'Describe your Instagram account...', systemPromptHint: 'You are an Instagram growth strategist for Indian creators. Given the user\'s niche, follower count, or engagement details, provide: specific growth strategies (reels cadence, hashtag approach, collaboration ideas); 3-5 content pillars tailored to their niche; a concrete hashtag strategy; actionable engagement tactics; a 30-day growth roadmap with weekly milestones; and practical tool suggestions (e.g. Canva, scheduling apps, analytics). Be specific and actionable, not generic.' },
        { id: 'fb-post',      title: 'Facebook Post Writer',     sub: 'Posts & ad copy',                 icon: 'facebook',  placeholder: 'What do you want to post about?', systemPromptHint: 'You are a Facebook copywriter specialist. Given a topic, offer, or announcement, provide: post copy with a hook, short story/context, and a clear call-to-action; the best time to post; ad copy if the post is promotional; 2-3 comment-response starters to drive engagement; and 3-5 targeted hashtags. Keep the tone matched to what the user describes (casual, professional, promotional, etc.).' },
        { id: 'yt-meta',      title: 'YouTube Title & Tags',     sub: 'Titles, descriptions, tags',      icon: 'youtube',   placeholder: 'Paste your video topic...', systemPromptHint: 'You are a YouTube SEO expert. Given a video topic, description, or target audience, provide: 5 SEO-optimized title options ranked by estimated CTR potential, varying in length and hook style; 25-30 relevant tags mixing high-search primary keywords, long-tail low-competition keywords, and niche-specific tags; a full video description with a strong hook in the first two lines, key info, and a CTA; 2-3 thumbnail text suggestions; and 3-5 related video/topic ideas to create next.' },
        { id: 'yt-script',    title: 'YouTube Script Writer',    sub: 'Full video scripts',              icon: 'youtube',   placeholder: 'What is your video about?', systemPromptHint: 'You are a YouTube scriptwriter. Given a topic and target video length, write a full script with clear timing markers (hook in first 15 seconds, main content sections, CTA at the end); scene/visual suggestions alongside the spoken script; suggested B-roll notes; a strong call-to-action script; and note any trending formats or elements worth incorporating. Adjust pacing and depth to the requested video length.' },
        { id: 'x-thread',     title: 'X Thread Writer',          sub: 'Threads & tweet generator',       icon: 'twitter',   placeholder: 'What topic should the thread cover?', systemPromptHint: 'You are a viral X/Twitter thread writer. Given a topic or angle, write: a hook tweet designed for maximum engagement; 8-12 follow-up tweets that progress the story or argument logically; a closing CTA tweet (follow/retweet/link); relevant hashtag suggestions mixing trending and niche tags; and 2-3 engagement-starter replies the user could post themselves. Format each tweet clearly numbered on its own line, each under 280 characters.' },
        { id: 'blog-post',    title: 'Blog Post Writer',         sub: 'SEO-structured blog posts',       icon: 'blog',      placeholder: 'What should the blog post be about?', systemPromptHint: 'You are an SEO content strategist and blog writer. Given a topic, write a complete, well-structured blog post with: an SEO-friendly title; a compelling introduction; clear H2/H3-style section headers; a natural target-keyword presence throughout (don\'t keyword-stuff); a strong conclusion with a CTA; and a suggested meta description under 160 characters. Write in clean markdown.' },
      ],
    },
    {
      id: 'web',
      title: 'Web & App',
      sub: 'Diagnostics & audit reports',
      icon: 'web',
      tools: [
        { id: 'page-insights', title: 'Website Page Insights',    sub: 'Speed & SEO snapshot',      icon: 'insights', placeholder: 'Paste a website URL to analyze...', pinned: true, systemPromptHint: 'You are a website performance and SEO advisor. You cannot fetch or access live URLs — if the user pastes a URL, explicitly tell them you can\'t browse to it and ask them to describe the page\'s purpose, current traffic level (if known), and main call-to-action instead. Once you have that context, provide: Core Web Vitals-style speed optimization tips; quick-win SEO suggestions (meta tags, headers, image alt text); mobile UX improvements; a basic security checklist (HTTPS, CSP headers, common XSS risks); and a rough estimated performance score out of 100 with reasoning. Be explicit that this is an advisory estimate, not a live scan.' },
        { id: 'full-audit',    title: 'Audit & Report',           sub: 'Full site audit generator', icon: 'audit',    placeholder: 'Paste a website URL for a full audit...', systemPromptHint: 'You are a comprehensive website auditor. You cannot fetch or access live URLs — ask the user to describe the site\'s purpose, niche, and any known metrics if they paste a URL. Structure a full audit report covering: SEO (on-page and technical basics); performance (Core Web Vitals-style considerations); security (SSL, headers, common vulnerabilities); UX/accessibility (WCAG basics, mobile-friendliness); conversion (CTA placement, forms); and if a niche is given, brief competitive context. End with a prioritized action list from critical to nice-to-have. Be explicit this is an advisory report based on the description given, not a live scan.' },
        { id: 'bug-report',    title: 'Bug & Issue Report',       sub: 'Structured bug reporting',  icon: 'bug',      placeholder: 'Describe the bug or issue...', systemPromptHint: 'You are a bug-report formatter. Given a description of a bug or unexpected behavior, structure it into a clean, professional report with these exact sections: Issue Title (short, descriptive); Severity (Critical/High/Medium/Low, with brief justification); Environment (browser/device/OS if mentioned, or \'not specified\'); Steps to Reproduce (numbered list); Expected Behavior; Actual Behavior; and a Suggested Fix section only if the cause seems reasonably clear from the description — otherwise state that root cause analysis would require more investigation.' },
        { id: 'score-meter',   title: 'Score & Improvement Meter', sub: 'Performance/SEO scoring',  icon: 'score',    placeholder: 'Paste a website URL to score...', systemPromptHint: 'You are a website scoring advisor. You cannot fetch live URLs — ask for a description if one is pasted. Score the site (based on the user\'s description) across five categories out of 100 each: SEO Performance, Load Speed, Mobile Friendliness, Conversion Optimization, and Security — plus an overall weighted average. For each category give the score, the specific reasoning behind it, the top 3 concrete actions to improve it, and a realistic expected score after those fixes. Be clear these are advisory estimates based on the information given, not a technical scan.' },
      ],
    },
    {
      id: 'edu',
      title: 'Education & Skills',
      sub: 'Personal writing assist',
      icon: 'edu',
      tools: [
        { id: 'humanize',   title: 'AI to Humanize', sub: 'Make AI text sound natural',        icon: 'humanize', placeholder: 'Paste the AI-generated text...', systemPromptHint: 'You are an AI-text humanizer. Given AI-generated or stiff-sounding text, rewrite it to sound naturally human: use contractions and conversational phrasing; vary sentence length and structure; add a touch of personality or a rhetorical question where it fits naturally; remove corporate jargon and generic filler; keep the original meaning and key facts fully intact. Output only the rewritten text unless the user asks for an explanation of the changes.' },
        { id: 'email-write', title: 'Email Writing', sub: 'Professional email generator',       icon: 'email',    placeholder: 'What is this email about?', systemPromptHint: 'You are a professional email-writing assistant. Given the purpose of the email (proposal, apology, follow-up, pitch, introduction, etc.) and any context provided, generate: a compelling, specific subject line; a full email body with a clear opening hook, the main message, and an explicit call-to-action; and, if useful, note 1-2 tone alternatives (e.g. more formal vs more casual) the user could ask for. Keep the email concise and skimmable unless the user asks for a longer, more detailed version.' },
      ],
    },

    // ----------------------------------------------------------------
    // NEW CATEGORY: Quick Utilities — 100% client-side inline tools
    //   mode:'utility' signals that these bypass the chat flow and
    //   render a dedicated UI panel in #utilityPanel.
    // ----------------------------------------------------------------
    {
      id: 'utilities',
      title: 'Quick Utilities',
      sub: 'Everyday tools, instant results',
      icon: 'utilities',
      tools: [
        { id: 'word-counter',   title: 'Word & Character Counter', sub: 'Words, characters, reading time',    icon: 'wordcount', placeholder: '', mode: 'utility' },
        { id: 'qr-generator',   title: 'QR Code Generator',        sub: 'Text or link to QR code',           icon: 'qrcode',   placeholder: '', mode: 'utility' },
        { id: 'password-gen',   title: 'Password Generator',       sub: 'Strong random passwords',           icon: 'password', placeholder: '', mode: 'utility' },
        { id: 'case-converter', title: 'Case Converter',           sub: 'UPPER, lower, Title Case',          icon: 'casetext', placeholder: '', mode: 'utility' },
        { id: 'age-calculator', title: 'Age Calculator',           sub: 'Exact age from date of birth',      icon: 'calendar', placeholder: '', mode: 'utility' },
        { id: 'unit-converter', title: 'Unit Converter',           sub: 'Length, weight, temperature',       icon: 'unitconv', placeholder: '', mode: 'utility' },
      ],
    },

    // ----------------------------------------------------------------
    // NEW CATEGORY: File & Image Tools — Canvas API + jsPDF + pdf-lib
    // ----------------------------------------------------------------
    {
      id: 'files',
      title: 'File & Image Tools',
      sub: 'Compress, convert, merge',
      icon: 'files',
      tools: [
        { id: 'image-compressor', title: 'Image Compressor',      sub: 'Shrink JPG, PNG, WebP',          icon: 'imagecompress', placeholder: '', mode: 'utility' },
        { id: 'image-to-pdf',     title: 'Image to PDF',          sub: 'Combine photos into one PDF',    icon: 'imgpdf',        placeholder: '', mode: 'utility' },
        { id: 'pdf-merge',        title: 'Merge PDF',             sub: 'Combine multiple PDFs',          icon: 'pdfmerge',      placeholder: '', mode: 'utility' },
        { id: 'pdf-split',        title: 'Split PDF',             sub: 'Extract pages from a PDF',       icon: 'pdfsplit',      placeholder: '', mode: 'utility' },
        { id: 'image-converter',  title: 'Image Format Converter', sub: 'PNG, JPG, WebP conversion',     icon: 'imgconvert',    placeholder: '', mode: 'utility' },
      ],
    },

    // ----------------------------------------------------------------
    // NEW CATEGORY: Student & Career — mix of AI-chat + one utility tool
    //   resume-builder is pinned (highest-value tool in this category).
    //   gpa-calc is mode:'utility' — rendered by utilityTools.js.
    //   TODO (backend): resume-builder, cover-letter, citation-gen
    //     need a real AI endpoint. For now they use the chat stub.
    // ----------------------------------------------------------------
    {
      id: 'career',
      title: 'Student & Career',
      sub: 'Resume, letters, and study help',
      icon: 'career',
      tools: [
        { id: 'resume-builder', title: 'Resume Builder',            sub: 'AI-assisted resume content',    icon: 'resume',      placeholder: 'Paste your work history or target role...', pinned: true, systemPromptHint: 'You are an ATS (Applicant Tracking System) resume-writing expert. Given the user\'s target job/role and their background (or ask for their background if not given), produce: ATS-friendly resume content in simple formatting (no tables); a short list of 10-15 relevant keywords pulled from the target role and how to naturally work them in; achievement bullet points written using the STAR method (Situation, Task, Action, Result) with quantified impact wherever possible; a skills section ranked by relevance to the target role; and 2-3 formatting/ATS-compatibility tips. Ask clarifying questions if the background given is too thin to work with.' },
        { id: 'cover-letter',   title: 'Cover Letter Generator',    sub: 'Tailored cover letters',        icon: 'coverletter', placeholder: 'Paste the job description...', systemPromptHint: 'You are a cover-letter writing expert. Given a job posting/description and the user\'s background, write a complete, personalized cover letter: an opening hook explaining genuine interest in this specific role/company; 2-3 relevant achievement highlights matched to the job\'s requirements; a paragraph connecting the user\'s skills to what the role needs; and a confident closing call-to-action requesting an interview. Keep it to roughly 250-350 words, professional tone, ATS-friendly plain text.' },
        { id: 'gpa-calc',       title: 'GPA / Percentage Calculator', sub: 'Grade calculations',          icon: 'gpacalc',     placeholder: '', mode: 'utility' },
        { id: 'citation-gen',   title: 'Citation Generator',        sub: 'APA / MLA format',              icon: 'citation',    placeholder: 'Paste the source details (title, author, year, URL)...', systemPromptHint: 'You are a citation formatting expert. Given source details (title, author, year, publisher/URL, and any other info provided), generate correctly formatted citations in APA, MLA, Chicago, and Harvard styles, clearly labeled. If any required field is missing for a given style, note what\'s missing rather than inventing placeholder information.' },
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
    const enabledIds = LocalSettings ? LocalSettings.getEnabledCategories() : null;
    DATA.forEach(cat => {
      if (enabledIds !== null && !enabledIds.includes(cat.id)) return;
      cat.tools.forEach(t => { if (t.pinned) pinned.push({ ...t, categoryId: cat.id }); });
    });
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

  // ---------- RENDER: level 1 (categories) — respects enabled-category filter ----------
  function renderCategoryLevel() {
    const el = document.getElementById('categoryLevel');
    if (!el) return;

    // null means all enabled (default); otherwise filter to the saved id list
    const enabledIds = LocalSettings ? LocalSettings.getEnabledCategories() : null;
    const visible = enabledIds === null ? DATA : DATA.filter(c => enabledIds.includes(c.id));

    el.innerHTML = visible.map(cat => `
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

  // ---------- SELECT TOOL: updates chip, placeholder, and routes to correct UI ----------
  function selectTool(toolId, opts) {
    const found = findTool(toolId);
    if (!found) return;
    activeToolId = toolId;

    // Update chip label and icon
    const chipLabel = document.getElementById('toolChipLabel');
    const chipIcon  = document.querySelector('#toolChip .chip-icon');
    if (chipLabel) chipLabel.textContent = found.tool.title;
    if (chipIcon)  chipIcon.outerHTML = icon(found.tool.icon, 'chip-icon');

    // Update textarea placeholder (fallback to empty string for utility tools)
    const textarea = document.getElementById('inputTextarea');
    if (textarea) textarea.placeholder = found.tool.placeholder || '';

    // ---------- MODE ROUTING ----------
    const utilityPanel = document.getElementById('utilityPanel');
    const inputZone    = document.querySelector('.input-zone');
    const emptyState   = document.getElementById('emptyState');
    const msgList      = document.getElementById('msgList');

    if (found.tool.mode === 'utility') {
      // ---- UTILITY / FILE TOOL: show inline panel, hide chat chrome ----
      if (emptyState)    emptyState.style.display    = 'none';
      if (msgList)       msgList.style.display       = 'none';
      if (utilityPanel)  utilityPanel.style.display  = 'flex';
      if (inputZone)     inputZone.style.display     = 'none';

      // Route to correct renderer
      if (found.category.id === 'files') {
        if (FileTools)   FileTools.render(found.tool);
      } else {
        if (UtilityTools) UtilityTools.render(found.tool);
      }

      // Defer: override any renderEmptyState() called immediately after
      // this (e.g. from chat.js's loadChat() which runs right after selectTool)
      setTimeout(() => {
        const p = document.getElementById('utilityPanel');
        if (p && p.style.display !== 'none') {
          const es = document.getElementById('emptyState');
          if (es) es.style.display = 'none';
        }
      }, 0);

    } else {
      // ---- CHAT / AI TOOL: restore normal chat chrome ----
      if (utilityPanel) utilityPanel.style.display = 'none';
      if (inputZone)    inputZone.style.display    = '';

      // Show emptyState only if msgList has no rendered messages
      if (emptyState && msgList && msgList.innerHTML.trim() === '') {
        emptyState.style.display = 'flex';
      }

      renderPromptCards(found.tool);
    }

    if (!(opts && opts.silent) && BottomSheet) {
      BottomSheet.closeToolSheet();
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

  function getToolMetaById(toolId) {
    const found = findTool(toolId);
    if (!found) return null;
    return { ...found.tool, category: found.category.id };
  }

  return {
    DATA,
    icon,
    init,
    selectTool,
    getActiveTool,
    findTool,
    getToolMetaById,
    renderCategoryLevel,
    renderToolLevel,
    backToCategoryLevel,
    renderPromptCards,
    // called by Manage Tools screen to persist + refresh selector
    setEnabledCategories(ids) {
      if (LocalSettings) LocalSettings.setEnabledCategories(ids);
      renderCategoryLevel();
      renderPins();
    },
  };
})();

// =========================================================
// AI EXECUTION REGISTRY (Phase 3 Backend Engine)
// =========================================================
export const ExecutionRegistry = (() => {
  const TOOLS = new Map();

  function registerTool(schema) {
    TOOLS.set(schema.id, schema);
  }

  function getTool(id) {
    return TOOLS.get(id);
  }

  function getAllTools() {
    return Array.from(TOOLS.values());
  }

  // Register built-in tools
  registerTool({
    id: 'calculator',
    name: 'Calculator',
    description: 'Perform mathematical calculations safely.',
    category: 'utility',
    version: '1.0',
    inputSchema: { required: ['expression'] },
    permissions: ['basic'],
    requiresAuth: false,
    execute: async (params) => {
      return await CalculatorService.evaluate(params.expression);
    }
  });

  registerTool({
    id: 'weather',
    name: 'Weather',
    description: 'Fetch current weather information for a specific city.',
    category: 'utility',
    version: '1.0',
    inputSchema: { required: ['city'] },
    permissions: ['basic'],
    requiresAuth: false,
    execute: async (params) => {
      return await WeatherService.getWeather(params.city);
    }
  });

  registerTool({
    id: 'search',
    name: 'Search Web',
    description: 'Search the internet for real-time information or news.',
    category: 'utility',
    version: '1.0',
    inputSchema: { required: ['query'] },
    permissions: ['basic'],
    requiresAuth: false,
    execute: async (params) => {
      return await SearchService.searchWeb(params.query);
    }
  });

  return {
    registerTool,
    getTool,
    getAllTools
  };
})();
