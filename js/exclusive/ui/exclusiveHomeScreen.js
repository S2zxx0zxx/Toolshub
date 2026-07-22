/* ============================================
   TOOLSHUB EXCLUSIVE — HOME SCREEN
   Populates and wires the Exclusive Home screen.
   ============================================ */

import { ExclusiveRouter } from '../core/exclusiveRouter.js';

export const ExclusiveHomeScreen = (() => {

  const html = `
    <!-- Topbar -->
    <div class="ex-topbar">
      <div class="ex-topbar-logo">
        <img src="./assets/icon-48x48.png" alt="ToolsHub Exclusive">
        ToolsHub Exclusive
      </div>
      <div class="ex-topbar-actions">
        <button id="exHamburgerBtn" class="btn-icon ex-topbar-hamburger" aria-label="Open menu">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="18" x2="21" y2="18"/></svg>
        </button>
      </div>
    </div>

    <!-- Content -->
    <div class="ex-home-content">
      
      <!-- HERO -->
      <section class="ex-hero ex-reveal">
        <div class="ex-hero-blob"></div>
        <div class="ex-hero-eyebrow">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="width:14px;height:14px;"><path d="M12 2L14.5 9.5L22 12L14.5 14.5L12 22L9.5 14.5L2 12L9.5 9.5Z"/></svg>
          Exclusive Access
        </div>
        <h1 class="ex-hero-headline">The ultimate AI workspace.<br><em>Built for power.</em></h1>
        <p class="ex-hero-sub">Experience uncompromised intelligence. ToolsHub Exclusive unlocks parallel reasoning, deeper context, and our most advanced models in a distraction-free environment.</p>
        <div class="ex-hero-ctas">
          <button class="ex-btn-primary" id="exHeroStartBtn">Enter Workspace</button>
        </div>
      </section>

      <!-- MASTER TOOL EXPLAINER -->
      <section class="ex-section ex-reveal">
        <div class="ex-mastertool-card">
          <div class="ex-mt-eyebrow">The Master Tool</div>
          <h2 class="ex-mt-title">Ask once. <em>Every model weighs in.</em> One answer.</h2>
          <p class="ex-mt-sub">Why settle for one perspective? When enabled, the Master Tool automatically consults three top-tier models in parallel, synthesizes their best insights, and delivers one perfect answer.</p>
          
          <div class="ex-mt-diagram">
            <div class="ex-mt-nodes">
              <div class="ex-mt-node">A1</div>
              <div class="ex-mt-node">B2</div>
              <div class="ex-mt-node">C3</div>
            </div>
            <div class="ex-mt-arrows">
              <div class="ex-mt-arrow-line"></div>
              <div class="ex-mt-arrow-line"></div>
              <div class="ex-mt-arrow-line"></div>
            </div>
            <div class="ex-mt-result">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path><polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline><line x1="12" y1="22.08" x2="12" y2="12"></line></svg>
            </div>
          </div>
        </div>
      </section>

      <!-- FEATURES -->
      <section class="ex-section ex-reveal">
        <div class="ex-section-header">
          <div class="ex-section-eyebrow">Capabilities</div>
          <h2 class="ex-section-title">Beyond everyday limits.</h2>
        </div>
        <div class="ex-feature-grid">
          <div class="ex-feature-card">
            <h3 class="ex-feature-title">Maximized Context</h3>
            <p class="ex-feature-desc">Drop in entire codebases, massive PDFs, or long chat histories. Exclusive ensures memory and reasoning stay sharp, even at maximum scale.</p>
          </div>
          <div class="ex-feature-card">
            <h3 class="ex-feature-title">Zero Compromise Models</h3>
            <p class="ex-feature-desc">Switch seamlessly between the most powerful Llama 3 70B variants and GPT-4o architecture, directly at your fingertips.</p>
          </div>
        </div>
      </section>

      <!-- CTA -->
      <section class="ex-section ex-reveal">
        <div class="ex-cta-band">
          <h2 class="ex-cta-band-title">Ready to push boundaries?</h2>
          <p class="ex-cta-band-sub">Your exclusive workspace is waiting.</p>
          <button class="ex-btn-primary" id="exFooterStartBtn" style="min-width:200px;">Open Dashboard</button>
        </div>
      </section>

      <!-- FOOTER -->
      <footer class="ex-footer ex-reveal">
        <span class="ex-footer-brand">ToolsHub Exclusive &mdash; DigiRise India</span>
      </footer>

    </div>
  `;

  function init() {
    const container = document.getElementById('screenExclusiveHome');
    if (!container) return;
    
    container.innerHTML = html;

    // Routing
    const openChat = () => ExclusiveRouter.navigate('exclusive-chat');
    document.getElementById('exHeroStartBtn')?.addEventListener('click', openChat);
    document.getElementById('exFooterStartBtn')?.addEventListener('click', openChat);

    // Mobile Hamburger
    document.getElementById('exHamburgerBtn')?.addEventListener('click', () => {
      document.getElementById('exclusiveShell').setAttribute('data-sidebar', 'open');
      document.getElementById('exclusiveSidebarOverlay').style.display = 'block';
    });

    // Intersection Observer for animations
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
        }
      });
    }, { threshold: 0.1 });

    container.querySelectorAll('.ex-reveal').forEach(el => observer.observe(el));
    
    // Trigger first section immediately
    setTimeout(() => {
      container.querySelector('.ex-hero')?.classList.add('is-visible');
    }, 100);
  }

  return { init };
})();
