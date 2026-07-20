import { LocalSettings } from '../services/localSettings.js';
import { PLANS } from '../config/plans.js';
import { Toast } from './toast.js';

export const ChangePlanModal = (() => {
  let modalOverlay = null;
  let selectedPlanId = null;

  function init() {
    modalOverlay = document.createElement('div');
    modalOverlay.className = 'change-plan-overlay';
    modalOverlay.id = 'changePlanOverlay';
    
    // Close on background click
    modalOverlay.addEventListener('click', (e) => {
      if (e.target === modalOverlay) close();
    });

    // Close on Escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && modalOverlay.classList.contains('is-open')) {
        close();
      }
    });

    document.body.appendChild(modalOverlay);
  }

  function renderModal() {
    if (!modalOverlay) return;
    
    const currentPlanId = LocalSettings ? LocalSettings.getCurrentPlan() : 'free';
    
    // Default selection to 'popular' if nothing selected yet
    if (!selectedPlanId) {
      const popularPlan = PLANS.find(p => p.badge === 'Popular') || PLANS[1]; // fallback to Starter
      selectedPlanId = popularPlan.id;
    }

    modalOverlay.innerHTML = '';

    const modal = document.createElement('div');
    modal.className = 'change-plan-modal';

    // HEADER
    const header = document.createElement('div');
    header.className = 'change-plan-header';
    
    const headerContent = document.createElement('div');
    headerContent.className = 'change-plan-header-content';
    const title = document.createElement('div');
    title.className = 'change-plan-title';
    title.textContent = 'Change plan';
    const subtitle = document.createElement('div');
    subtitle.className = 'change-plan-subtitle';
    subtitle.textContent = 'Select a plan to continue.';
    headerContent.appendChild(title);
    headerContent.appendChild(subtitle);
    
    const closeBtn = document.createElement('button');
    closeBtn.className = 'change-plan-close-btn';
    closeBtn.innerHTML = '<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>';
    closeBtn.addEventListener('click', close);
    
    header.appendChild(headerContent);
    header.appendChild(closeBtn);
    
    // BODY
    const body = document.createElement('div');
    body.className = 'change-plan-body';
    
    const grid = document.createElement('div');
    grid.className = 'change-plan-grid';
    
    // Filter out 'free' from the selection grid, display only the upgrade plans (usually 3 cards)
    const upgradePlans = PLANS.filter(p => p.id !== 'free');
    
    upgradePlans.forEach(p => {
      const card = document.createElement('div');
      card.className = `plan-card ${p.badge === 'Popular' ? 'is-popular' : ''} ${selectedPlanId === p.id ? 'is-selected' : ''}`;
      
      const cardHeader = document.createElement('div');
      cardHeader.className = 'plan-card-header';
      
      const cardName = document.createElement('div');
      cardName.className = 'plan-card-name';
      cardName.textContent = p.label;
      
      cardHeader.appendChild(cardName);
      
      if (p.id === currentPlanId) {
        const currentBadge = document.createElement('div');
        currentBadge.className = 'plan-card-badge plan-card-badge-current';
        currentBadge.textContent = 'Current';
        cardHeader.appendChild(currentBadge);
      } else if (p.badge) {
        const badge = document.createElement('div');
        badge.className = 'plan-card-badge plan-card-badge-popular';
        badge.textContent = p.badge;
        cardHeader.appendChild(badge);
      }
      
      const desc = document.createElement('div');
      desc.className = 'plan-card-desc';
      desc.textContent = p.description;
      
      const priceRow = document.createElement('div');
      priceRow.className = 'plan-card-price-row';
      const price = document.createElement('div');
      price.className = 'plan-card-price';
      price.textContent = p.priceLabel;
      const period = document.createElement('div');
      period.className = 'plan-card-period';
      period.textContent = p.periodLabel;
      priceRow.appendChild(price);
      priceRow.appendChild(period);
      
      const bulletsList = document.createElement('ul');
      bulletsList.className = 'plan-card-bullets';
      p.bullets.forEach(b => {
        const li = document.createElement('li');
        li.textContent = b;
        bulletsList.appendChild(li);
      });
      
      card.appendChild(cardHeader);
      card.appendChild(desc);
      card.appendChild(priceRow);
      card.appendChild(bulletsList);
      
      card.addEventListener('click', () => {
        selectedPlanId = p.id;
        renderModal(); // re-render to update selected styling
      });
      
      grid.appendChild(card);
    });
    
    body.appendChild(grid);
    
    // FOOTER
    const footer = document.createElement('div');
    footer.className = 'change-plan-footer';
    
    const cancelBtn = document.createElement('button');
    cancelBtn.className = 'btn-cancel';
    cancelBtn.textContent = 'Cancel';
    cancelBtn.addEventListener('click', close);
    
    const confirmBtn = document.createElement('button');
    confirmBtn.className = 'btn-confirm';
    confirmBtn.textContent = 'Confirm';
    confirmBtn.addEventListener('click', () => {
      initiatePayment(selectedPlanId);
    });
    
    footer.appendChild(cancelBtn);
    footer.appendChild(confirmBtn);
    
    modal.appendChild(header);
    modal.appendChild(body);
    modal.appendChild(footer);
    
    modalOverlay.appendChild(modal);
  }

  function initiatePayment(planId) {
    console.log('initiatePayment called for plan:', planId);
    // TODO: Wire up actual payment gateway
    if (Toast) {
      Toast.show('Payment integration coming soon!');
    }
    close();
  }

  function open() {
    if (!modalOverlay) return;
    selectedPlanId = null; // reset selection state on open
    renderModal();
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
