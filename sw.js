const CACHE_PREFIX = 'noru-';
const CACHE_NAME = 'noru-v28';
const APP_SHELL = [
  './',
  './index.html',
  './css/style.css?v=28',
  './core.js?v=28',
  './card.js?v=28',
  './locale/ko.js?v=28',
  './app.js?v=28',
  './detail.js?v=28',
  './dictionary.js?v=28',
  './summary.js?v=28',
  './manifest.json',
  './icon-192.svg',
  './icon-512.svg'
];
self.addEventListener('install', function(event) {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(function(cache) { return cache.addAll(APP_SHELL); })
      .then(function() { return self.skipWaiting(); })
  );
});

self.addEventListener('activate', function(event) {
  event.waitUntil(
    caches.keys()
      .then(function(names) {
        return Promise.all(names.map(function(name) {
          return name.startsWith(CACHE_PREFIX) && name !== CACHE_NAME
            ? caches.delete(name)
            : Promise.resolve(false);
        }));
      })
      .then(function() { return self.clients.claim(); })
  );
});

self.addEventListener('fetch', function(event) {
  if (event.request.method !== 'GET') return;

  var url = new URL(event.request.url);
  if (url.origin !== self.location.origin) return;

  if (event.request.mode === 'navigate') {
    event.respondWith(
      fetch(event.request)
        .then(function(response) {
          if (!response.ok) return response;
          return caches.open(CACHE_NAME).then(function(cache) {
            return cache.put('./index.html', response.clone()).then(function() { return response; });
          });
        })
        .catch(function() { return caches.match('./index.html'); })
    );
    return;
  }

  event.respondWith(
    caches.match(event.request).then(function(cached) {
      if (cached) return cached;
      return fetch(event.request).then(function(response) {
        if (!response.ok) return response;
        return caches.open(CACHE_NAME).then(function(cache) {
          return cache.put(event.request, response.clone()).then(function() { return response; });
        });
      });
    })
  );
});
