import { FirebaseAdmin } from './firebaseAdmin.js';
import { MODEL_CATALOG_TIERS, ENDPOINTS } from './modelAccess.js';

async function probeModel(modelId, env) {
  const isGithubModel = modelId === 'gpt-4o-mini';
  const url = isGithubModel 
    ? ENDPOINTS.GITHUB_MODELS
    : ENDPOINTS.GROQ;
    
  const token = isGithubModel ? env.GITHUB_MODELS_TOKEN : env.GROQ_API_KEY;
  if (!token) return { success: false, reason: 'missing_token' };

  const payload = {
    model: isGithubModel ? 'openai/gpt-4o-mini' : modelId,
    messages: [{ role: 'user', content: 'hello' }],
    max_tokens: 5
  };

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 8000); // 8s timeout
    
    const start = Date.now();
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(payload),
      signal: controller.signal
    });
    
    clearTimeout(timeoutId);

    if (response.ok) {
      return { success: true, latency: Date.now() - start };
    } else {
      return { success: false, reason: `http_${response.status}` };
    }
  } catch (e) {
    return { success: false, reason: e.name === 'AbortError' ? 'timeout' : 'network_error' };
  }
}

export async function scheduled(event, env, ctx) {
  const admin = new FirebaseAdmin(env.FIREBASE_SERVICE_ACCOUNT);
  const now = new Date();
  const today = now.toISOString().split('T')[0];
  
  for (const modelId of Object.keys(MODEL_CATALOG_TIERS)) {
    const result = await probeModel(modelId, env);
    const newState = result.success ? 'operational' : 'outage';
    
    const statusRef = `systemStatus/${modelId}`;
    
    // Read current status
    let currentStatus = null;
    try {
      currentStatus = await admin.getDocument(statusRef);
    } catch (e) {
      // Document might not exist yet
    }
    
    const prevUptimeDay = currentStatus?.fields?.uptimeDay?.mapValue?.fields || {};
    const oldState = currentStatus?.fields?.state?.stringValue || 'nodata';
    
    // Determine new today's status based on existing rules
    const todayStateStr = prevUptimeDay[today]?.stringValue;
    let newTodayState = todayStateStr;
    
    if (!todayStateStr) {
      newTodayState = newState;
    } else if (newState === 'outage') {
      newTodayState = 'outage';
    } else if (newState === 'operational' && todayStateStr === 'nodata') {
      newTodayState = 'operational';
    }
    
    // Truncate to 60 days
    const allDays = Object.keys(prevUptimeDay).concat(today);
    const sortedDays = Array.from(new Set(allDays)).sort();
    const daysToKeep = sortedDays.slice(-60);
    
    const newUptimeDayFields = {};
    for (const d of daysToKeep) {
      newUptimeDayFields[d] = { stringValue: d === today ? newTodayState : prevUptimeDay[d]?.stringValue };
    }
    
    const updatedDoc = {
      fields: {
        modelId: { stringValue: modelId },
        state: { stringValue: newState },
        uptimeDay: { mapValue: { fields: newUptimeDayFields } },
        lastCheckedAt: { timestampValue: now.toISOString() },
        updatedAt: { timestampValue: now.toISOString() }
      }
    };
    
    await admin.updateDocument(statusRef, updatedDoc);
    
    // Handle Incident
    if (newState === 'outage' && (oldState === 'operational' || oldState === 'nodata')) {
      const incidentId = `${modelId.replace(/[^a-zA-Z0-9]/g, '_')}_${Date.now()}`;
      await admin.updateDocument(`statusIncidents/${incidentId}`, {
        fields: {
          modelId: { stringValue: modelId },
          title: { stringValue: `Outage detected for ${modelId}` },
          severity: { stringValue: 'investigating' },
          createdAt: { timestampValue: now.toISOString() },
          resolvedAt: { nullValue: null },
          updates: {
            arrayValue: {
              values: [
                {
                  mapValue: {
                    fields: {
                      status: { stringValue: 'investigating' },
                      message: { stringValue: 'We are currently investigating an issue affecting this model.' },
                      timestamp: { timestampValue: now.toISOString() }
                    }
                  }
                }
              ]
            }
          }
        }
      });
    } else if (newState === 'operational' && (oldState === 'outage' || oldState === 'degraded')) {
      try {
        const query = {
          structuredQuery: {
            from: [{ collectionId: 'statusIncidents' }],
            where: {
              compositeFilter: {
                op: 'AND',
                filters: [
                  { fieldFilter: { field: { fieldPath: 'modelId' }, op: 'EQUAL', value: { stringValue: modelId } } },
                  { unaryFilter: { field: { fieldPath: 'resolvedAt' }, op: 'IS_NULL' } }
                ]
              }
            },
            orderBy: [{ field: { fieldPath: 'createdAt' }, direction: 'DESCENDING' }],
            limit: 1
          }
        };
        const results = await admin.runQuery(query);
        if (results && results.length > 0 && results[0].document) {
          const doc = results[0].document;
          const incidentId = doc.name.split('/').pop();
          
          const updates = doc.fields.updates?.arrayValue?.values || [];
          updates.push({
            mapValue: {
              fields: {
                status: { stringValue: 'resolved' },
                message: { stringValue: 'The issue has been resolved and the service is fully operational.' },
                timestamp: { timestampValue: now.toISOString() }
              }
            }
          });
          
          doc.fields.severity = { stringValue: 'resolved' };
          doc.fields.resolvedAt = { timestampValue: now.toISOString() };
          doc.fields.updates = { arrayValue: { values: updates } };
          
          await admin.updateDocument(`statusIncidents/${incidentId}`, { fields: doc.fields });
        }
      } catch (e) {
        console.error('Error resolving incident:', e);
      }
    }
  }
}
