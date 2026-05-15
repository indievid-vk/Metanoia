const cacheName = 'metanoia-v2';
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
  if (event.request.method !== 'GET') return;

  // For HTML navigation requests, go Network First, fallback to cache
  if (event.request.mode === 'navigate' || event.request.headers.get('accept').includes('text/html')) {
    event.respondWith(
      fetch(event.request)
        .then(response => {
          const responseToCache = response.clone();
          caches.open(cacheName).then(cache => {
            cache.put(event.request, responseToCache);
          });
          return response;
        })
        .catch(() => {
          return caches.match(event.request).then(response => {
            return response || caches.match('./') || caches.match('index.html');
          });
        })
    );
    return;
  }

  // For everything else, go Cache First
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        if (response) return response;
        
        return fetch(event.request).then(networkResponse => {
          if (!networkResponse || networkResponse.status !== 200 || networkResponse.type !== 'basic') {
            return networkResponse;
          }
          const responseToCache = networkResponse.clone();
          caches.open(cacheName).then(cache => {
            if(event.request.url.startsWith('http')) {
              cache.put(event.request, responseToCache);
            }
          });
          return networkResponse;
        });
      })
  );
});
