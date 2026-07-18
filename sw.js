const CACHE_NAME = 'toolshub-cache-v8';
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
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME).then(async cache => {
      // Use allSettled so one failing URL doesn't abort the whole cache process
      const requests = urlsToCache.map(url => {
        return fetch(new URL(url, self.registration.scope).href).then(response => {
          if (!response.ok) throw new Error(`Status ${response.status}`);
          return cache.put(url, response);
        }).catch(err => console.warn(`Failed to cache ${url}:`, err));
      });
      await Promise.allSettled(requests);
    })
  );
});

self.addEventListener('fetch', event => {
  if (event.request.method !== 'GET') return;
  event.respondWith(
    // Prefer network, but timeout after 3.5s so we don't fall back to cache just because it's slow
    new Promise((resolve, reject) => {
      const timeoutId = setTimeout(() => {
        reject(new Error('Network timeout'));
      }, 3500);
      
      fetch(event.request).then(response => {
        clearTimeout(timeoutId);
        // Cache the fresh response
        const resClone = response.clone();
        caches.open(CACHE_NAME).then(cache => cache.put(event.request, resClone));
        resolve(response);
      }).catch(err => {
        clearTimeout(timeoutId);
        reject(err);
      });
    }).catch(() => {
      // If network fails or times out, fallback to cache
      return caches.match(event.request);
    })
  );
});

self.addEventListener('activate', event => {
  event.waitUntil(clients.claim());
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (!cacheWhitelist.includes(cacheName)) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});
