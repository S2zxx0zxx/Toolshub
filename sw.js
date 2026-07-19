const CACHE_NAME = 'toolshub-cache-v12';
const urlsToCache = [
  './',
  './index.html',
  './css/core/variables.css',
  './css/layout/layout.css',
  './css/components/components.css',
  './css/layout/sidebar.css',
  './css/layout/chat.css',
  './css/components/bottomsheet.css',
  './css/components/tools.css',
  './css/layout/screens-extra.css',
  './css/components/inline-extracted.css',
  './js/core/app.js',
  './js/core/events.js',
  './js/core/router.js',
  './js/services/localSettings.js',
  './js/services/firebase.js',
  './js/services/auth.js',
  './js/services/cloudDb.js',
  './js/tools/registry.js',
  './js/tools/utilityTools.js',
  './js/tools/fileTools.js',
  './js/ui/sidebar.js',
  './js/ui/bottomsheet.js',
  './js/ui/chatEngine.js',
  './js/ui/toast.js',
  './js/ai/prompt.js',
  './js/ai/context.js',
  './js/ai/intent.js',
  './js/ai/router.js',
  './js/services/aiApi.js',
  './js/tools/permissions.js',
  './js/tools/executor.js',
  './js/services/tools/calculatorService.js',
  './js/services/tools/weatherService.js',
  './js/services/tools/searchService.js'
];

self.addEventListener('install', event => {
  // Force this new SW to take over immediately — no waiting
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME).then(async cache => {
      const requests = urlsToCache.map(url => {
        return fetch(new URL(url, self.registration.scope).href).then(response => {
          if (!response.ok) throw new Error(`Status ${response.status}`);
          return cache.put(url, response);
        }).catch(err => console.warn(`[SW] Failed to cache ${url}:`, err));
      });
      await Promise.allSettled(requests);
      console.log('[SW] Cache v12 installed.');
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
