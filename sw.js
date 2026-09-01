importScripts('./card.js');

const APP_CACHE_PREFIX = 'noru-app-';
const CACHE_NAME = 'noru-app-v62';
const CARD_CACHE_NAME = 'noru-cards-v1';
const CARD_ASSETS = Object.values(self.CARD_CONFIG).map(function(filename) { return './assets/' + filename; });
const APP_SHELL = [
  './',
  './index.html',
  './css/style.css?v=62',
  './core.js?v=58',
  './card.js?v=58',
  './locale/ko.js?v=58',
  './app.js?v=62',
  './detail.js?v=58',
  './dictionary.js?v=58',
  './summary.js?v=62',
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
          return (name.startsWith(APP_CACHE_PREFIX) || /^noru-v\d+$/.test(name)) && name !== CACHE_NAME
            ? caches.delete(name)
            : Promise.resolve(false);
        }));
      })
      .then(function() { return self.clients.claim(); })
  );
});

self.addEventListener('message', function(event) {
  if (!event.data || event.data.type !== 'CACHE_ALL_CARDS') return;
  var port=event.ports&&event.ports[0];
  var caching=caches.open(CARD_CACHE_NAME).then(function(cache) {
      return Promise.all(CARD_ASSETS.map(function(url) {
        return cache.match(url).then(function(cached) {
          if(cached)return true;
          return cache.add(url).then(function(){return true;});
        }).catch(function() { return false; });
      }));
    }).then(function(results){
      var cached=results.filter(Boolean).length;
      return {type:'CACHE_ALL_CARDS_RESULT',total:CARD_ASSETS.length,cached:cached,failed:CARD_ASSETS.length-cached};
    }).catch(function(){
      return {type:'CACHE_ALL_CARDS_RESULT',total:CARD_ASSETS.length,cached:0,failed:CARD_ASSETS.length};
    }).then(function(result){
      if(port)port.postMessage(result);
    });
  event.waitUntil(caching);
});

self.addEventListener('fetch', function(event) {
  if (event.request.method !== 'GET') return;

  var url = new URL(event.request.url);
  if (url.origin !== self.location.origin) return;

  if (url.pathname.endsWith('.webp')) {
    event.respondWith(
      caches.open(CARD_CACHE_NAME).then(function(cache) {
        return cache.match(event.request).then(function(cached) {
          if (cached) return cached;
          return fetch(event.request).then(function(response) {
            if (response.ok) cache.put(event.request, response.clone());
            return response;
          });
        });
      })
    );
    return;
  }

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
