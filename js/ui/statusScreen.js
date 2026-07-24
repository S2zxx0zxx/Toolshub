import { db, fbFirestoreModule } from '../services/firebase.js';
import { MODEL_CATALOG } from './bottomsheet.js';
import { Router } from '../core/router.js';

export const StatusScreen = (() => {

  const models = MODEL_CATALOG.flatMap(c => c.models);

  let statusUnsubscribe = null;
  let incidentsUnsubscribe = null;

  function init() {
    const container = document.getElementById('screenStatus');
    if (!container) return;

    // Build base HTML
    container.innerHTML = `
      <div class="settings-topbar">
        <button id="statusBackBtn" aria-label="Back" class="btn-icon">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="15 18 9 12 15 6"/></svg>
        </button>
        <span class="settings-topbar-title">System Status</span>
        <span></span>
      </div>
      <div class="status-container">
        <header class="status-header">
          <h1 class="status-title">ToolsHub System Status</h1>
          <div id="globalStatusBanner" class="status-banner status-operational">
            <span class="status-icon"></span>
            <span class="status-text" id="globalStatusText">Checking systems...</span>
          </div>
        </header>

        <section class="status-services" id="servicesList">
          <!-- Services rendered here -->
        </section>

        <section class="status-incidents">
          <h2 class="incidents-heading">Past Incidents</h2>
          <div id="incidentsList">
            <div style="color: var(--color-text-tertiary); padding: 16px 0;">No incidents to report.</div>
          </div>
        </section>
      </div>
    `;

    // Wire back button
    document.getElementById('statusBackBtn')?.addEventListener('click', () => {
      Router.navigate('settings');
    });

    subscribeToStatus();
    subscribeToIncidents();
  }

  function renderServices(statusMap) {
    const container = document.getElementById('servicesList');
    if (!container) return;
    
    let html = '';
    let globalState = 'operational';

    models.forEach(model => {
      const safeId = model.id.replace(/\//g, '-');
      const doc = statusMap[safeId] || { state: 'nodata', uptimeDay: {} };
      
      if (doc.state === 'outage') globalState = 'outage';
      else if (doc.state === 'degraded' && globalState !== 'outage') globalState = 'degraded';

      const days = generate30Days();
      let uptimeCount = 0;
      let dataCount = 0;

      const barsHtml = days.map(d => {
        let dState = (doc.uptimeDay && doc.uptimeDay[d]) ? doc.uptimeDay[d] : null;
        
        // Visual backfill for empty past days to simulate history
        if (!dState) {
          dState = 'nodata'; // Do not fabricate synthetic data (P2-8)
        }

        if (dState !== 'nodata') dataCount++;
        if (dState === 'operational') uptimeCount++;
        
        return `<div class="status-bar bar-${dState}" title="${d}: ${dState}"></div>`;
      }).join('');

      const uptimePercent = dataCount > 0 ? ((uptimeCount / dataCount) * 100).toFixed(1) + '%' : '--%';

      html += `
        <div class="service-card">
          <div class="service-header">
            <h3 class="service-name">${model.label} <span class="service-tag">${model.tag}</span></h3>
            <span class="service-state text-${doc.state}">${doc.state === 'nodata' ? 'Pending data' : capitalize(doc.state)}</span>
          </div>
          <div class="service-uptime-strip">
            ${barsHtml}
          </div>
          <div class="service-uptime-footer">
            <span>30 days ago</span>
            <span>${uptimePercent} uptime</span>
            <span>Today</span>
          </div>
        </div>
      `;
    });

    container.innerHTML = html;
    updateGlobalBanner(globalState);
    updateSidebarDot(globalState);
  }

  function updateGlobalBanner(state) {
    const banner = document.getElementById('globalStatusBanner');
    const text = document.getElementById('globalStatusText');
    if (!banner || !text) return;

    banner.className = `status-banner status-${state}`;
    if (state === 'operational') text.textContent = 'All Systems Operational';
    else if (state === 'degraded') text.textContent = 'Degraded Performance';
    else if (state === 'outage') text.textContent = 'Service Disruption';
    else text.textContent = 'Checking systems...';
  }

  function updateSidebarDot(state) {
    const dot = document.getElementById('sidebarStatusDot');
    if (!dot) return;
    if (state === 'operational') {
      dot.style.background = 'var(--success)';
      dot.style.boxShadow = '0 0 8px rgba(34, 197, 94, 0.4)';
    } else if (state === 'degraded') {
      dot.style.background = 'var(--warning)';
      dot.style.boxShadow = '0 0 8px rgba(245, 158, 11, 0.4)';
    } else if (state === 'outage') {
      dot.style.background = 'var(--danger)';
      dot.style.boxShadow = '0 0 8px rgba(239, 68, 68, 0.4)';
    } else {
      dot.style.background = 'var(--text-muted)';
      dot.style.boxShadow = 'none';
    }
  }

  function renderIncidents(incidents) {
    const container = document.getElementById('incidentsList');
    if (!container) return;

    if (incidents.length === 0) {
      container.innerHTML = '<div style="color: var(--text-muted); padding: 16px 0;">No incidents to report.</div>';
      return;
    }

    let html = '';
    // Group by date
    const grouped = {};
    incidents.forEach(inc => {
      const d = new Date(inc.createdAt.toMillis());
      const dateStr = d.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' });
      if (!grouped[dateStr]) grouped[dateStr] = [];
      grouped[dateStr].push(inc);
    });

    for (const [dateStr, list] of Object.entries(grouped)) {
      html += `
        <div class="incident-group">
          <div class="incident-date">${dateStr}</div>
      `;
      list.forEach(inc => {
        let updatesHtml = '';
        const updates = inc.updates || [];
        // Sort updates newest first
        const sortedUpdates = [...updates].sort((a, b) => b.timestamp.toMillis() - a.timestamp.toMillis());
        
        sortedUpdates.forEach(upd => {
          const ud = new Date(upd.timestamp.toMillis());
          const timeStr = ud.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' });
          updatesHtml += `
            <div class="incident-update">
              <span class="update-status text-${upd.status}">${capitalize(upd.status)}</span> - 
              <span class="update-message">${upd.message}</span>
              <span class="update-time">${timeStr} UTC</span>
            </div>
          `;
        });

        html += `
          <div class="incident-card">
            <h4 class="incident-title">${inc.title}</h4>
            <div class="incident-updates">
              ${updatesHtml}
            </div>
          </div>
        `;
      });
      html += `</div>`;
    }

    container.innerHTML = html;
  }

  function subscribeToStatus() {
    if (!db || !fbFirestoreModule) return;
    
    if (statusUnsubscribe) statusUnsubscribe();
    
    const q = fbFirestoreModule.collection(db, 'systemStatus');
    statusUnsubscribe = fbFirestoreModule.onSnapshot(q, (snapshot) => {
      const statusMap = {};
      snapshot.forEach(doc => {
        statusMap[doc.id] = doc.data();
      });
      renderServices(statusMap);
    }, (err) => {
      console.warn("Status subscription failed:", err);
    });
  }

  function subscribeToIncidents() {
    if (!db || !fbFirestoreModule) return;
    
    if (incidentsUnsubscribe) incidentsUnsubscribe();
    
    const q = fbFirestoreModule.query(
      fbFirestoreModule.collection(db, 'statusIncidents'),
      fbFirestoreModule.orderBy('createdAt', 'desc'),
      fbFirestoreModule.limit(20)
    );
    
    incidentsUnsubscribe = fbFirestoreModule.onSnapshot(q, (snapshot) => {
      const incidents = [];
      snapshot.forEach(doc => {
        incidents.push({ id: doc.id, ...doc.data() });
      });
      renderIncidents(incidents);
    }, (err) => {
      console.warn("Incidents subscription failed:", err);
    });
  }

  function generate30Days() {
    const days = [];
    const now = new Date();
    for (let i = 29; i >= 0; i--) {
      const d = new Date(now);
      d.setDate(now.getDate() - i);
      days.push(d.toISOString().split('T')[0]);
    }
    return days;
  }

  function capitalize(str) {
    if (!str) return '';
    return str.charAt(0).toUpperCase() + str.slice(1);
  }

  return { init };
})();
