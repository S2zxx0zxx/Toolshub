const { execSync } = require('child_process');
const https = require('https');

function getToken() {
  return execSync('gcloud auth print-access-token', { encoding: 'utf8' }).trim();
}

async function fetchJson(url, options) {
  return new Promise((resolve, reject) => {
    const req = https.request(url, options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        if (res.statusCode >= 200 && res.statusCode < 300) {
          resolve(JSON.parse(data));
        } else {
          reject(new Error(`HTTP ${res.statusCode}: ${data}`));
        }
      });
    });
    req.on('error', reject);
    if (options.body) req.write(options.body);
    req.end();
  });
}

async function main() {
  try {
    console.log("Getting token...");
    const token = getToken();
    console.log("Token obtained.");

    const projectId = "toolshub-87859"; // Project for 77238460546

    // 1. Get existing web apps
    console.log(`Fetching existing web apps for project ${projectId}...`);
    let apps;
    try {
      apps = await fetchJson(`https://firebase.googleapis.com/v1beta1/projects/${projectId}/webApps`, {
        method: 'GET',
        headers: { 
          Authorization: `Bearer ${token}`,
          'x-goog-user-project': projectId
        }
      });
    } catch (e) {
      console.warn("Could not fetch apps (might be 0 apps):", e.message);
    }

    let appId;
    if (apps && apps.apps && apps.apps.find(a => a.displayName === 'toolshub')) {
      appId = apps.apps.find(a => a.displayName === 'toolshub').appId;
      console.log("App 'toolshub' already exists. AppId:", appId);
    } else {
      // 2. Create web app
      console.log("Creating new web app 'toolshub'...");
      const createRes = await fetchJson(`https://firebase.googleapis.com/v1beta1/projects/${projectId}/webApps`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
          'x-goog-user-project': projectId
        },
        body: JSON.stringify({ displayName: "toolshub" })
      });
      console.log("Create operation started:", createRes.name);
      
      await new Promise(r => setTimeout(r, 5000));
      apps = await fetchJson(`https://firebase.googleapis.com/v1beta1/projects/${projectId}/webApps`, {
        method: 'GET',
        headers: { 
          Authorization: `Bearer ${token}`,
          'x-goog-user-project': projectId
        }
      });
      appId = apps.apps.find(a => a.displayName === 'toolshub').appId;
      console.log("App created. AppId:", appId);
    }

    // 3. Get config
    console.log("Fetching config for AppId:", appId);
    const config = await fetchJson(`https://firebase.googleapis.com/v1beta1/projects/${projectId}/webApps/${appId}/config`, {
      method: 'GET',
      headers: { 
        Authorization: `Bearer ${token}`,
        'x-goog-user-project': projectId
      }
    });
    
    console.log("================ CONFIG ================");
    console.log(JSON.stringify(config, null, 2));
    console.log("========================================");
  } catch (err) {
    console.error("Error:", err);
  }
}

main();
