const CACHE_NAME = 'toolshub-cache-v2';
const urlsToCache = [
  '/',
  '/index.html',
  '/css/core/variables.css',
  '/css/layout/layout.css',
  '/css/components/components.css',
  '/css/layout/sidebar.css',
  '/css/layout/chat.css',
  '/css/components/bottomsheet.css',
  '/css/components/tools.css',
  '/css/layout/screens-extra.css',
  '/js/core/app.js',
  '/js/core/events.js',
  '/js/core/router.js',
  '/js/services/localSettings.js',
  '/js/services/firebase.js',
  '/js/services/auth.js',
  '/js/services/cloudDb.js',
  '/js/tools/registry.js',
  '/js/tools/utilityTools.js',
  '/js/tools/fileTools.js',
  '/js/ui/sidebar.js',
  '/js/ui/bottomsheet.js',
  '/js/ui/chatEngine.js',
  '/js/ui/toast.js',
  '/js/ai/prompt.js',
  '/js/ai/context.js',
  '/js/ai/intent.js',
  '/js/ai/router.js',
  '/js/services/aiApi.js',
  '/js/tools/permissions.js',
  '/js/tools/executor.js',
  '/js/services/tools/calculatorService.js',
  '/js/services/tools/weatherService.js',
  '/js/services/tools/searchService.js'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        return cache.addAll(urlsToCache);
      })
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    fetch(event.request)
      .then(networkResponse => {
        // Network-first strategy: always fetch latest from network if online
        return caches.open(CACHE_NAME).then(cache => {
          cache.put(event.request, networkResponse.clone());
          return networkResponse;
        });
      })
      .catch(() => {
        // If offline, fallback to cache
        return caches.match(event.request);
      })
  );
});

self.addEventListener('activate', event => {
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
