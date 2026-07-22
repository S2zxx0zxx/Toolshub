import { CONNECTORS } from '../tools/connectorsRegistry.js';
import { OverlayManager } from '../services/overlayManager.js';
import { LocalSettings } from '../services/localSettings.js';
export const ConnectorsSheet = (() => {

  function openOverlay(overlayEl) {
    OverlayManager.open(overlayEl);
  }

  function closeOverlay(overlayEl) {
    OverlayManager.close(overlayEl);
  }

  function render() {
    const body = document.getElementById('connectorsSheetBody');
    if (!body) return;

    if (CONNECTORS.length === 0) {
      body.innerHTML = `
        <div style="text-align: center; padding: var(--sp-6) var(--sp-4);">
          <div style="color: var(--text-muted); font-size: var(--fs-sm); font-family: var(--font-body);">
            More connectors are coming soon.
          </div>
        </div>
      `;
      return;
    }

    // Future logic when CONNECTORS array has items
    body.innerHTML = '';
    
    CONNECTORS.forEach(connector => {
      const isGithub = connector.id === 'github';
      const token = isGithub ? LocalSettings.getGithubToken() : null;
      const repo = isGithub ? LocalSettings.getGithubRepo() : null;
      const isConnected = !!token;
      
      const el = document.createElement('div');
      el.className = 'list-row';
      el.style.flexDirection = 'column';
      el.style.alignItems = 'stretch';
      el.style.padding = 'var(--sp-4)';
      el.style.borderBottom = '1px solid var(--border-subtle)';
      
      let extraHtml = '';
      if (isGithub) {
        if (isConnected) {
          extraHtml = `
            <div style="margin-top: var(--sp-3); font-size: var(--fs-xs);">
              <div style="color: var(--success); margin-bottom: var(--sp-2);">✓ Connected</div>
              <input type="text" id="githubRepoInput" value="${repo || ''}" placeholder="owner/repo (e.g. facebook/react)" class="project-new-input" style="width: 100%; margin-bottom: var(--sp-2);">
              <button id="githubSaveRepoBtn" class="btn btn-primary" style="padding: 4px 12px; font-size: var(--fs-xs);">Set Active Repo</button>
              <button id="githubDisconnectBtn" class="btn" style="padding: 4px 12px; font-size: var(--fs-xs); margin-left: var(--sp-2);">Disconnect</button>
            </div>
          `;
        } else {
          extraHtml = `
            <div style="margin-top: var(--sp-3); font-size: var(--fs-xs);">
              <input type="password" id="githubTokenInput" placeholder="Personal Access Token (classic or fine-grained)" class="project-new-input" style="width: 100%; margin-bottom: var(--sp-2);">
              <button id="githubConnectBtn" class="btn btn-primary" style="padding: 4px 12px; font-size: var(--fs-xs);">Connect GitHub</button>
            </div>
          `;
        }
      }
      
      el.innerHTML = `
        <div style="display: flex; align-items: center; width: 100%;">
          <div class="list-row-icon">${connector.icon}</div>
          <div class="list-row-body" style="flex: 1;">
            <div class="list-row-title">${connector.name}</div>
            <div class="list-row-subtitle">${connector.description}</div>
          </div>
        </div>
        ${extraHtml}
      `;
      body.appendChild(el);
      
      if (isGithub) {
        if (isConnected) {
          el.querySelector('#githubSaveRepoBtn').addEventListener('click', () => {
            const val = el.querySelector('#githubRepoInput').value.trim();
            if (val) {
              LocalSettings.setGithubRepo(val);
              alert('Active repository set to ' + val);
            }
          });
          el.querySelector('#githubDisconnectBtn').addEventListener('click', () => {
            LocalSettings.setGithubToken(null);
            LocalSettings.setGithubRepo(null);
            render();
          });
        } else {
          el.querySelector('#githubConnectBtn').addEventListener('click', () => {
            const val = el.querySelector('#githubTokenInput').value.trim();
            if (val) {
              LocalSettings.setGithubToken(val);
              render();
            }
          });
        }
      }
    });
  }

  function open() {
    render();
    openOverlay(document.getElementById('connectorsSheetOverlay'));
  }

  function close() {
    closeOverlay(document.getElementById('connectorsSheetOverlay'));
  }

  function init() {
    const overlay = document.getElementById('connectorsSheetOverlay');
    if (overlay) {
      overlay.addEventListener('click', (e) => {
        if (e.target.id === 'connectorsSheetOverlay') close();
      });
    }
    const closeBtn = document.getElementById('connectorsSheetCloseBtn');
    if (closeBtn) {
      closeBtn.addEventListener('click', close);
    }
  }

  return { init, open, close };
})();
