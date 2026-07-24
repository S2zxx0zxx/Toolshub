// HOME ANIMATIONS - Next-Gen Interactions
export const HomeAnimations = (() => {

  // Initialize all animations
  function init() {
    initScrollReveal();
    initParticles();
    initStatsCounter();
    initTypewriter();
    initHoverEffects();
    initSmoothScroll();
  }

  // Scroll Reveal Animation
  function initScrollReveal() {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('active');
          // Stagger children
          const children = entry.target.querySelectorAll('.home-cap-cell, .home-feature-card, .home-stat');
          children.forEach((child, index) => {
            child.style.animationDelay = `${index * 0.1}s`;
          });
        }
      });
    }, { threshold: 0.1 });

    document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
  }

  // Floating Particles
  function initParticles() {
    const hero = document.querySelector('.home-hero');
    if (!hero) return;

    const particlesContainer = document.createElement('div');
    particlesContainer.className = 'home-hero-particles';
    hero.appendChild(particlesContainer);

    for (let i = 0; i < 15; i++) {
      const particle = document.createElement('div');
      particle.className = 'particle';
      particle.style.left = `${Math.random() * 100}%`;
      particle.style.top = `${Math.random() * 100}%`;
      particle.style.animationDelay = `${Math.random() * 6}s`;
      particle.style.animationDuration = `${4 + Math.random() * 4}s`;
      particlesContainer.appendChild(particle);
    }
  }

  // Stats Counter Animation
  function initStatsCounter() {
    const stats = document.querySelectorAll('.home-stat-number');
    if (stats.length === 0) return;

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const target = parseInt(entry.target.dataset.target);
          animateCounter(entry.target, target);
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });

    stats.forEach(stat => observer.observe(stat));
  }

  function animateCounter(element, target) {
    let current = 0;
    const increment = target / 50;
    const timer = setInterval(() => {
      current += increment;
      if (current >= target) {
        element.textContent = target.toLocaleString();
        clearInterval(timer);
      } else {
        element.textContent = Math.floor(current).toLocaleString();
      }
    }, 30);
  }

  // Typewriter Effect for Hero
  function initTypewriter() {
    const headline = document.querySelector('.home-hero-headline');
    if (!headline) return;

    const text = headline.innerHTML;
    headline.style.opacity = '1';
  }

  // Hover Effects
  function initHoverEffects() {
    // Capability cards glow effect
    document.querySelectorAll('.home-cap-cell').forEach(card => {
      card.addEventListener('mouseenter', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        card.style.setProperty('--mouse-x', `${x}px`);
        card.style.setProperty('--mouse-y', `${y}px`);
      });
    });

    // Feature cards magnetic effect
    document.querySelectorAll('.home-feature-card').forEach(card => {
      card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;
        card.style.transform = `perspective(1000px) rotateX(${-y / 20}deg) rotateY(${x / 20}deg)`;
      });

      card.addEventListener('mouseleave', () => {
        card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0)';
      });
    });
  }

  // Smooth Scroll
  function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', function(e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
          target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      });
    });
  }

  // Public API
  return {
    init
  };
})();
