importScripts('./card.js');

const CACHE_PREFIX = 'noru-';
const CACHE_NAME = 'noru-v18';
const APP_SHELL = [
  './',
  './index.html',
  './css/style.css?v=18',
  './core.js',
  './card.js',
  './locale/ko.js?v=18',
  './app.js?v=18',
  './manifest.json',
  './icon-192.svg',
  './icon-512.svg'
];
const CARD_ASSETS = Object.values(self.CARD_CONFIG).map(function(filename) {
  return './assets/' + filename;
});

self.addEventListener('install', function(event) {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(function(cache) { return cache.addAll(APP_SHELL.concat(CARD_ASSETS)); })
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
