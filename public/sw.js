const cacheName = 'metanoia-v1';
const urlsToCache = [
  './',
  'index.html',
  'manifest.json',
  'pwa-setup.js',
  'icon_192.png',
  'icon_512.png'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(cacheName)
      .then(cache => cache.addAll(urlsToCache))
  );
  self.skipWaiting();
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(name => {
          if (name !== cacheName) {
            return caches.delete(name);
          }
        })
      );
    })
  );
  self.clients.claim();
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        if (response) {
          return response;
        }
        return fetch(event.request).catch(() => {
          // Fallback to offline page usually, but here we fallback to index.html for SPA routing
          if (event.request.mode === 'navigate') {
            return caches.match('./');
          }
        });
      })
  );
});
