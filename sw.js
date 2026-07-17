const CACHE_NAME = 'toolshub-cache-v1';
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
  '/js/core/state.js',
  '/js/core/router.js',
  '/js/services/storage.js',
  '/js/tools/registry.js',
  '/js/tools/utilityTools.js',
  '/js/tools/fileTools.js',
  '/js/ui/sidebar.js',
  '/js/ui/bottomsheet.js',
  '/js/ui/chatEngine.js',
  '/js/ui/toast.js'
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
    caches.match(event.request)
      .then(response => {
        if (response) {
          // cache-first: return cache but update network in background
          fetch(event.request).then(res => {
            caches.open(CACHE_NAME).then(cache => {
              cache.put(event.request, res);
            });
          }).catch(() => {});
          return response;
        }
        return fetch(event.request);
      })
  );
});

self.addEventListener('activate', event => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});
