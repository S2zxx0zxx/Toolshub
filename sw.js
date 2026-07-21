const CACHE_NAME = 'toolshub-cache-v35';
const urlsToCache = [
  './',
  './index.html',
  './terms.html',
  './privacy.html',
  './refund-policy.html',
  './manifest.json',
  // === CSS ===
  './css/core/variables.css',
  './css/layout/layout.css',
  './css/components/components.css',
  './css/components/personaPicker.css',
  './css/components/changePlan.css',
  './css/layout/sidebar.css',
  './css/layout/chat.css',
  './css/components/bottomsheet.css',
  './css/components/tools.css',
  './css/layout/screens-extra.css',
  './css/components/inline-extracted.css',
  './css/components/chatHistory.css',
  './css/components/bugReport.css',
  './css/components/advancedControls.css',
  // === JS CORE ===
  './js/core/app.js',
  './js/core/events.js',
  './js/core/router.js',
  // === JS SERVICES ===
  './js/services/localSettings.js',
  './js/services/firebase.js',
  './js/services/auth.js',
  './js/services/cloudDb.js',
  './js/services/aiApi.js',
  './js/services/ragService.js',
  './js/services/overlayManager.js',
  // === JS TOOLS ===
  './js/tools/registry.js',
  './js/tools/utilityTools.js',
  './js/tools/fileTools.js',
  './js/tools/permissions.js',
  './js/tools/executor.js',
  // === JS UI ===
  './js/ui/sidebar.js',
  './js/ui/bottomsheet.js',
  './js/ui/chatEngine.js',
  './js/ui/toast.js',
  './js/ui/changePlanModal.js',
  './js/ui/personaPicker.js',
  './js/ui/advancedControls.js',
  './js/ui/connectorsSheet.js',
  // === JS AI ===
  './js/ai/prompt.js',
  './js/ai/context.js',
  './js/ai/intent.js',
  './js/ai/router.js',
  './js/ai/agentEngine.js',
  './js/ai/toolSchemas.js',
  // === JS SERVICES/TOOLS ===
  './js/services/tools/calculatorService.js',
  './js/services/tools/weatherService.js',
  './js/services/tools/searchService.js',
  // === JS CONFIG ===
  './js/config/plans.js',
  './js/config/personas.js',
  './js/config/planVocabulary.js',
  './js/config/suggestionPool.js',
  './js/env.js',
  // === JS TOOLS EXTRA ===
  './js/tools/connectorsRegistry.js',
  // === JS AI EXTRA ===
  './js/ai/agentToolBridge.js'
];

self.addEventListener('install', event => {
  // Force this new SW to take over immediately — no waiting
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME).then(async cache => {
      const requests = urlsToCache.map(url => {
        const fetchUrl = new URL(url, self.registration.scope);
        fetchUrl.search = '?cb=' + Date.now(); // Cache-bust HTTP cache
        return fetch(fetchUrl.href).then(response => {
          if (!response.ok) throw new Error(`Status ${response.status}`);
          return cache.put(url, response);
        }).catch(err => console.warn(`[SW] Failed to cache ${url}:`, err));
      });
      await Promise.allSettled(requests);
      console.log(`[SW] Cache ${CACHE_NAME} installed.`);
    })
  );
});

self.addEventListener('activate', event => {
  // Take control of all open pages immediately
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    Promise.all([
      clients.claim(),
      caches.keys().then(cacheNames => {
        return Promise.all(
          cacheNames.map(cacheName => {
            if (!cacheWhitelist.includes(cacheName)) {
              console.log('[SW] Deleting old cache:', cacheName);
              return caches.delete(cacheName);
            }
          })
        );
      })
    ])
  );
});

self.addEventListener('fetch', event => {
  // Never intercept non-GET requests (POST for API calls)
  if (event.request.method !== 'GET') return;

  // Never cache cross-origin API calls (Firebase, Groq, etc.)
  const url = new URL(event.request.url);
  if (url.origin !== self.location.origin) return;

  event.respondWith(
    // Network-first strategy: try fresh from network, fallback to cache on failure
    fetch(event.request).then(response => {
      // Cache the fresh response for offline use
      if (response.ok) {
        const resClone = response.clone();
        caches.open(CACHE_NAME).then(cache => cache.put(event.request, resClone));
      }
      return response;
    }).catch(() => {
      // Network failed (offline): serve from cache
      return caches.match(event.request).then(cachedResponse => {
        return cachedResponse || new Response('Resource unavailable offline', { status: 503, statusText: 'Service Unavailable' });
      });
    })
  );
});
