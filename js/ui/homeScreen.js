import { Router } from '../core/router.js';
import { SUGGESTION_POOL } from '../config/suggestionPool.js';

export const HomeScreen = (() => {

  let placeholderInterval = null;
  let currentPromptIndex = 0;
  const shuffledPool = [...SUGGESTION_POOL].sort(() => Math.random() - 0.5);

  // ---- Navigate to chat, optionally prefill textarea ----
  function goToChat(text = '') {
    if (text) {
      const textarea = document.getElementById('inputTextarea');
      if (textarea) {
        textarea.value = text;
        textarea.dispatchEvent(new Event('input', { bubbles: true }));
      }
    }
    Router.navigate('chat');
  }

  // ---- Open billing (Settings module is initialized in app.js, exposed via event) ----
  function openBillingPanel() {
    Router.navigate('settings');
    // Defer slightly so the settings screen finishes transitioning in
    setTimeout(() => {
      window.dispatchEvent(new CustomEvent('toolshub:open-billing'));
    }, 120);
  }

  // ---- Rotating placeholder ----
  function startPlaceholderRotation(textarea) {
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reducedMotion) {
      textarea.placeholder = shuffledPool[0];
      return;
    }

    function updatePlaceholder() {
      textarea.placeholder = shuffledPool[currentPromptIndex % shuffledPool.length];
      currentPromptIndex++;
    }

    updatePlaceholder();
    placeholderInterval = setInterval(updatePlaceholder, 3000);
  }

  function stopPlaceholderRotation() {
    if (placeholderInterval) {
      clearInterval(placeholderInterval);
      placeholderInterval = null;
    }
  }

  // ---- Scroll-reveal via IntersectionObserver ----
  function initScrollReveal() {
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reducedMotion) return; // Elements already visible (CSS handles it)

    const revealEls = document.querySelectorAll('#screenHome .reveal');
    if (!revealEls.length) return;

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.12,
      rootMargin: '0px 0px -40px 0px'
    });

    revealEls.forEach(el => observer.observe(el));
  }

  // ---- Wire ghost CTA "See what's inside" smooth scroll ----
  function initGhostScroll() {
    const ghostBtn = document.getElementById('homeGhostCta');
    const target = document.getElementById('homeSection4');
    if (ghostBtn && target) {
      ghostBtn.addEventListener('click', () => {
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      });
    }
  }

  // ---- Wire category cards ----
  function initCategoryCards() {
    document.querySelectorAll('.home-cat-card[data-nav-chat]').forEach(card => {
      card.addEventListener('click', () => {
        goToChat();
      });
    });
  }

  // ---- Main init ----
  function init() {
    const screen = document.getElementById('screenHome');
    if (!screen) return;

    // --- Primary CTAs: Open ToolsHub / Final CTA ---
    document.querySelectorAll('[data-home-cta="chat"]').forEach(btn => {
      btn.addEventListener('click', () => goToChat());
    });

    // --- "See Plans" ---
    document.querySelectorAll('[data-home-cta="plans"]').forEach(btn => {
      btn.addEventListener('click', () => openBillingPanel());
    });

    // --- Home topbar logo → stay on home (or re-init) ---
    document.getElementById('homeTopbarLogo')?.addEventListener('click', () => {
      Router.navigate('home');
      screen.scrollTop = 0;
    });

    // --- Home topbar hamburger → open sidebar ---
    document.getElementById('hamburgerBtnHome')?.addEventListener('click', () => {
      document.getElementById('app')?.setAttribute('data-sidebar', 'open');
    });

    // --- Live Input Mockup ---
    const mockInput = document.getElementById('homeMockInput');
    const mockSubmit = document.getElementById('homeMockSubmit');
    const mockForm = document.getElementById('homeMockForm');

    if (mockInput) startPlaceholderRotation(mockInput);

    function submitMockInput() {
      const text = mockInput ? mockInput.value.trim() : '';
      stopPlaceholderRotation();
      goToChat(text);
    }

    if (mockSubmit) mockSubmit.addEventListener('click', (e) => { e.preventDefault(); submitMockInput(); });
    if (mockForm) {
      mockForm.addEventListener('submit', (e) => { e.preventDefault(); submitMockInput(); });
      if (mockInput) {
        mockInput.addEventListener('keydown', (e) => {
          if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); submitMockInput(); }
        });
      }
    }

    // --- Ghost CTA scroll ---
    initGhostScroll();

    // --- Category cards ---
    initCategoryCards();

    // --- Scroll reveal ---
    requestAnimationFrame(() => {
      setTimeout(initScrollReveal, 100);
    });

    // --- Restart placeholder when Home screen becomes active ---
    const appEl = document.getElementById('app');
    if (appEl) {
      const screenObserver = new MutationObserver(() => {
        const isHome = appEl.dataset.screen === 'home';
        if (isHome && !placeholderInterval && mockInput) {
          startPlaceholderRotation(mockInput);
        } else if (!isHome) {
          stopPlaceholderRotation();
        }
      });
      screenObserver.observe(appEl, { attributes: true, attributeFilter: ['data-screen'] });
    }
  }

  return { init };
})();
