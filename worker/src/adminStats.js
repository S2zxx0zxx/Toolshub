import { FirebaseAdmin } from './firebaseAdmin.js';

export async function handleAdminUsageStats(request, env, corsHeaders) {
  // Require Bearer token auth (not query param)
  const authHeader = request.headers.get('Authorization') || '';
  if (!authHeader.startsWith('Bearer ') || !env.ADMIN_UID || authHeader.split(' ')[1] !== env.ADMIN_UID) {
    return new Response('Unauthorized', { status: 401, headers: corsHeaders });
  }

  try {
    const fbAdmin = new FirebaseAdmin(env.FIREBASE_SERVICE_ACCOUNT);
    
    // We use the REST API runQuery to get the last 30 daily usage docs
    const queryPayload = {
      structuredQuery: {
        from: [{ collectionId: 'dailyUsageStats', allDescendants: false }],
        orderBy: [{ field: { fieldPath: 'date' }, direction: 'DESCENDING' }],
        limit: 30
      }
    };
    
    const token = await fbAdmin.getAccessToken();
    const res = await fetch(`https://firestore.googleapis.com/v1/projects/${fbAdmin.projectId}/databases/(default)/documents:runQuery`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(queryPayload)
    });

    if (!res.ok) {
      const err = await res.text();
      return new Response('Failed to query usage stats: ' + err, { status: 500 });
    }

    const data = await res.json();
    
    // Parse the results
    const records = [];
    for (const item of data) {
      if (item.document && item.document.fields) {
        const fields = item.document.fields;
        records.push({
          date: fields.date?.stringValue || 'Unknown',
          totalRequests: parseInt(fields.totalRequests?.integerValue || '0', 10),
          modelUsage: parseMap(fields.modelUsage),
          toolUsage: parseMap(fields.toolUsage)
        });
      }
    }

    // Generate simple HTML
    const html = generateAdminHtml(records);

    return new Response(html, {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'text/html; charset=utf-8' }
    });

  } catch (error) {
    return new Response('Error: ' + error.message, { status: 500, headers: corsHeaders });
  }
}

function escapeHtml(str) {
  return String(str).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');
}

function parseMap(mapValueObj) {
  const result = {};
  if (mapValueObj && mapValueObj.mapValue && mapValueObj.mapValue.fields) {
    for (const [k, v] of Object.entries(mapValueObj.mapValue.fields)) {
      result[k] = parseInt(v.integerValue || '0', 10);
    }
  }
  return result;
}

function generateAdminHtml(records) {
  // A clean, simple view matching basic design tokens
  let rowsHtml = records.map(r => `
    <tr style="border-bottom: 1px solid #333;">
      <td style="padding: 12px; font-weight: 500;">${escapeHtml(r.date)}</td>
      <td style="padding: 12px; color: #10b981;">${escapeHtml(r.totalRequests)}</td>
      <td style="padding: 12px;">
        ${Object.entries(r.modelUsage).map(([m, c]) => `<div style="font-size: 0.9em"><span style="color:#a1a1aa">${escapeHtml(m)}:</span> ${escapeHtml(c)}</div>`).join('')}
      </td>
      <td style="padding: 12px;">
        ${Object.entries(r.toolUsage).map(([t, c]) => `<div style="font-size: 0.9em"><span style="color:#a1a1aa">${escapeHtml(t)}:</span> ${escapeHtml(c)}</div>`).join('')}
      </td>
    </tr>
  `).join('');

  if (records.length === 0) {
    rowsHtml = `<tr><td colspan="4" style="padding: 20px; text-align: center; color: #a1a1aa;">No data available yet.</td></tr>`;
  }

  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>ToolsHub Internal Analytics</title>
  <style>
    body {
      background-color: #09090b;
      color: #fafafa;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
      margin: 0; padding: 40px;
    }
    .container {
      max-width: 1000px;
      margin: 0 auto;
      background: #18181b;
      border: 1px solid #27272a;
      border-radius: 12px;
      overflow: hidden;
    }
    .header {
      padding: 24px;
      border-bottom: 1px solid #27272a;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    h1 { margin: 0; font-size: 20px; font-weight: 600; letter-spacing: -0.02em; }
    table {
      width: 100%;
      border-collapse: collapse;
      text-align: left;
    }
    th {
      padding: 16px 12px;
      background: #09090b;
      color: #a1a1aa;
      font-weight: 500;
      font-size: 13px;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      border-bottom: 1px solid #27272a;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>Internal Usage Stats (Last 30 Days)</h1>
      <div style="color: #a1a1aa; font-size: 14px;">Aggregate Data Only</div>
    </div>
    <table>
      <thead>
        <tr>
          <th style="width: 15%">Date</th>
          <th style="width: 15%">Total Requests</th>
          <th style="width: 35%">By Model</th>
          <th style="width: 35%">By Tool Category</th>
        </tr>
      </thead>
      <tbody>
        ${rowsHtml}
      </tbody>
    </table>
  </div>
</body>
</html>
  `;
}
