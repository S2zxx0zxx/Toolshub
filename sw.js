const CACHE_NAME = 'toolshub-cache-v1';

const urlsToCache = [
  './',
  './index.html',
  './css/core/variables.css',
  './css/layout/layout.css',
  './css/components/components.css',
  './css/layout/home.css',
  './css/layout/chat.css',
  './css/layout/sidebar.css',
  './js/core/app.js',
  './js/core/router.js',
  './js/core/events.js',
  './js/ai/agentEngine.js',
  './js/ai/router.js',
  './js/ai/intent.js',
  './js/ai/prompt.js',
  './js/ai/context.js',
  './js/ai/toolSchemas.js',
  './js/ai/smartRouter.js',
  './js/tools/registry.js',
  './js/tools/executor.js',
  './js/tools/utilityTools.js',
  './js/tools/fileTools.js',
  './js/tools/githubTools.js',
  './js/tools/realtimeTools.js',
  './js/ui/chatEngine.js',
  './js/ui/sidebar.js',
  './js/ui/toast.js',
  './js/services/aiApi.js',
  './js/services/auth.js',
  './js/services/cloudDb.js',
  './js/services/firebase.js',
  './js/services/localSettings.js',
  './js/config/api.js',
  './js/config/plans.js',
  './js/config/personas.js',
  './manifest.json'
];

self.addEventListener('install', event => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return cache.addAll(urlsToCache).catch(err => {
        console.warn('[SW] Some files failed to cache:', err);
      });
    })
  );
});

self.addEventListener('activate', event => {
  event.waitUntil(
    Promise.all([
      self.clients.claim(),
      caches.keys().then(cacheNames => {
        return Promise.all(
          cacheNames.filter(name => name !== CACHE_NAME)
            .map(name => caches.delete(name))
        );
      })
    ])
  );
});

self.addEventListener('fetch', event => {
  if (event.request.method !== 'GET') return;
  
  const url = new URL(event.request.url);
  if (url.origin !== self.location.origin) return;
  
  event.respondWith(
    caches.match(event.request).then(response => {
      if (response) return response;
      
      return fetch(event.request).then(fetchResponse => {
        if (!fetchResponse || fetchResponse.status !== 200) return fetchResponse;
        
        const responseToCache = fetchResponse.clone();
        caches.open(CACHE_NAME).then(cache => {
          cache.put(event.request, responseToCache);
        });
        
        return fetchResponse;
      }).catch(() => {
        if (event.request.destination === 'document') {
          return caches.match('./index.html');
        }
      });
    })
  );
});
