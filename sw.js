const CACHE_NAME = 'toolshub-cache-v1';
const urlsToCache = [
  '/',
  '/index.html',
  '/css/fonts.css',
  '/css/reset.css',
  '/css/variables.css',
  '/css/layout.css',
  '/css/components.css',
  '/css/chat.css',
  '/css/screens-extra.css',
  '/js/data.js',
  '/js/storage.js',
  '/js/toolSelector.js',
  '/js/sidebar.js',
  '/js/bottomsheet.js',
  '/js/chat.js',
  '/js/settings.js',
  '/js/main.js'
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
