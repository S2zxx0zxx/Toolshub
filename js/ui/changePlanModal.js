import { LocalSettings } from '../services/localSettings.js';
import { PLANS } from '../config/plans.js';
import { Toast } from './toast.js';
import { Auth } from '../services/auth.js';
import { CloudDB } from '../services/cloudDb.js';
import { OverlayManager } from '../services/overlayManager.js';

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
      const isFlagship = p.badge === 'Popular';
      const card = document.createElement('div');
      card.className = `plan-card ${isFlagship ? 'is-flagship' : ''} ${selectedPlanId === p.id ? 'is-selected' : ''}`;
      
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
      
      if (p.originalPriceLabel) {
        const origPrice = document.createElement('span');
        origPrice.style.textDecoration = 'line-through';
        origPrice.style.color = 'var(--text-muted)';
        origPrice.style.fontSize = 'var(--fs-xs)';
        origPrice.style.marginRight = 'var(--sp-2)';
        origPrice.textContent = p.originalPriceLabel;
        priceRow.appendChild(origPrice);
      }

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
      p.bullets.forEach((b, idx) => {
        if (idx < 3) {
          const li = document.createElement('li');
          li.textContent = b;
          bulletsList.appendChild(li);
        } else if (idx === 3) {
          // create a wrapper for expandable list
          const expandBtn = document.createElement('div');
          expandBtn.className = 'plan-feature-expand-trigger';
          expandBtn.style.fontSize = 'var(--fs-xs)';
          expandBtn.style.color = 'var(--accent)';
          expandBtn.style.cursor = 'pointer';
          expandBtn.style.marginTop = 'var(--sp-2)';
          expandBtn.style.fontWeight = '500';
          expandBtn.textContent = 'Show all features';
          
          const expandedDiv = document.createElement('div');
          expandedDiv.className = 'plan-feature-expanded';
          expandedDiv.style.maxHeight = '0';
          expandedDiv.style.overflow = 'hidden';
          expandedDiv.style.transition = 'max-height var(--dur-base) var(--ease)';
          
          expandBtn.addEventListener('click', (e) => {
            e.stopPropagation(); // prevent card selection trigger
            expandedDiv.classList.toggle('is-expanded');
            expandBtn.textContent = expandedDiv.classList.contains('is-expanded') ? 'Show less' : 'Show all features';
          });
          
          const li = document.createElement('li');
          li.textContent = b;
          expandedDiv.appendChild(li);
          
          bulletsList.appendChild(expandBtn);
          bulletsList.appendChild(expandedDiv);
        } else {
          // Append to existing expanded div
          const expandedDiv = bulletsList.querySelector('.plan-feature-expanded');
          const li = document.createElement('li');
          li.textContent = b;
          expandedDiv.appendChild(li);
        }
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

  async function initiatePayment(planId) {
    console.log('initiatePayment called for plan:', planId);
    
    // 1. Confirm user is signed in
    const currentUser = Auth.getCurrentUser();
    if (!currentUser) {
      if (Toast) Toast.show('Please sign in to upgrade your plan.');
      close();
      const authOverlay = document.getElementById('authOverlay');
      if (authOverlay) authOverlay.style.display = 'flex';
      return;
    }

    const confirmBtn = modalOverlay.querySelector('.btn-confirm');
    if (confirmBtn) {
      confirmBtn.disabled = true;
      confirmBtn.textContent = 'Processing...';
    }

    if (currentUser.email === 'Satyamk82476@gmail.com' || currentUser.email === 'satyamk82476@gmail.com') {
      localStorage.setItem('dev_mock_plan', planId);
      import('../../services/localSettings.js').then(module => {
        module.LocalSettings.setCurrentPlan(planId);
        window.dispatchEvent(new CustomEvent('plan-changed'));
        if (typeof Toast !== 'undefined') Toast.show(`Developer Access: Plan updated to ${planId} for testing.`);
        close();
      });
      return;
    }

    try {
      // 2. Get the user's Firebase ID token
      const idToken = await currentUser.getIdToken();
      
      // 3. Call POST {WORKER_URL}/api/payment/create-order
      const API_ENDPOINT = 'https://toolshub-api-worker.theliquidlounge-co.workers.dev/api/payment/create-order';
      const orderRes = await fetch(API_ENDPOINT, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${idToken}`
        },
        body: JSON.stringify({ planId })
      });

      const orderData = await orderRes.json();
      if (!orderRes.ok || orderData.error) {
        throw new Error(orderData.error || 'Failed to create order');
      }

      // Find plan details for Razorpay UI
      const planDetails = PLANS.find(p => p.id === planId) || PLANS[1];

      // 4. Open Razorpay's checkout
      const options = {
        key: orderData.keyId,
        amount: orderData.amount,
        currency: orderData.currency,
        name: 'ToolsHub',
        description: `${planDetails.label} Plan`,
        order_id: orderData.orderId,
        theme: {
          color: getComputedStyle(document.body).getPropertyValue('--accent').trim() || '#4f46e5'
        },
        handler: async function (response) {
          // 5. Verify Payment
          try {
            if (Toast) Toast.show('Verifying payment...', 'info');
            const VERIFY_ENDPOINT = 'https://toolshub-api-worker.theliquidlounge-co.workers.dev/api/payment/verify';
            const verifyRes = await fetch(VERIFY_ENDPOINT, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${idToken}`
              },
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                planId: planId
              })
            });
            
            const verifyData = await verifyRes.json();
            if (!verifyRes.ok || verifyData.error) {
              throw new Error(verifyData.error || 'Failed to verify payment');
            }

            // 6. On verify success
            await CloudDB.syncPlanFromServer(); // update local cache from source of truth
            if (Toast) Toast.show(`You're now on the ${planDetails.label} plan!`, 'success');
            
            // Refresh UI if needed (Pill, etc.)
            window.dispatchEvent(new CustomEvent('plan-changed'));
            close();

          } catch (verifyErr) {
            console.error('Verify error:', verifyErr);
            if (Toast) Toast.show('Payment verify failed. Contact support if charged.', 'error');
            close();
          }
        },
        modal: {
          ondismiss: function() {
            if (Toast) Toast.show('Payment cancelled', 'info');
            if (confirmBtn) {
              confirmBtn.disabled = false;
              confirmBtn.textContent = 'Confirm';
            }
          }
        }
      };
      
      const rzp = new Razorpay(options);
      rzp.on('payment.failed', function (response){
        console.error('Payment Failed:', response.error);
        if (Toast) Toast.show('Payment failed: ' + response.error.description, 'error');
        if (confirmBtn) {
          confirmBtn.disabled = false;
          confirmBtn.textContent = 'Confirm';
        }
      });
      rzp.open();

    } catch (e) {
      console.error('Payment initiation error:', e);
      if (Toast) Toast.show('Could not start payment. Please try again.', 'error');
      if (confirmBtn) {
        confirmBtn.disabled = false;
        confirmBtn.textContent = 'Confirm';
      }
    }
  }

  let _closeTimer = null;

  function open() {
    if (!modalOverlay) return;
    if (_closeTimer) { clearTimeout(_closeTimer); _closeTimer = null; }
    selectedPlanId = null; // reset selection state on open
    renderModal();
    modalOverlay.style.display = 'flex';
    OverlayManager.open(modalOverlay);
  }

  function close() {
    if (!modalOverlay) return;
    OverlayManager.close(modalOverlay);
    if (_closeTimer) clearTimeout(_closeTimer);
    _closeTimer = setTimeout(() => {
      // Only hide if it wasn't re-opened in the meantime
      if (!modalOverlay.classList.contains('is-open')) {
        modalOverlay.style.display = 'none';
      }
      _closeTimer = null;
    }, 220); // match var(--dur-base)
  }

  return { init, open, close };
})();
