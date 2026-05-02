/* ═══════════════════════════════════════════════
   NORU — Service Worker
   전략:
   - 앱 셸 (index.html, manifest, 아이콘): Cache First
   - Wikimedia 카드 이미지: Network First + 캐시 폴백
   - Google Fonts / jsDelivr: Cache First (외부 리소스)

   캐시 버전 관리:
   index.html의 <meta name="app-version"> 값을 읽어 사용.
   버전 업데이트 시 index.html 한 곳만 수정하면 됩니다.
   ═══════════════════════════════════════════════ */

/* 버전을 fetch로 index.html에서 읽어 캐시 키 구성
   fetch 불가 시(오프라인 설치) fallback 버전 사용 */
var CACHE_VER  = 'v1'; /* fallback — index.html meta와 동기화 필요 */
var CACHE_NAME = 'noru-' + CACHE_VER;
var IMG_CACHE  = 'noru-img-' + CACHE_VER;

/* 앱 셸 — 오프라인에서도 반드시 동작해야 하는 파일들 */
var APP_SHELL = [
  './',
  './index.html',
  './manifest.json',
  './sw.js',
  './icon-192.svg',
  './icon-512.svg',
  './locale/ko.js'
];

/* ── message: 버전 업데이트 수신 ── */
self.addEventListener('message', function(e) {
  if(e.data && e.data.type === 'SET_VERSION') {
    var newVer = 'noru-' + e.data.version;
    if(newVer !== CACHE_NAME) {
      /* 버전이 바뀌면 이전 캐시 삭제 후 새 버전으로 교체 */
      caches.keys().then(function(keys){
        return Promise.all(
          keys.filter(function(k){
            return k !== newVer && k !== newVer.replace('noru-','noru-img-');
          }).map(function(k){ return caches.delete(k); })
        );
      });
      CACHE_NAME = newVer;
      IMG_CACHE  = 'noru-img-' + e.data.version;
    }
  }
});


self.addEventListener('install', function(e) {
  e.waitUntil(
    caches.open(CACHE_NAME)
      .then(function(cache) {
        return cache.addAll(APP_SHELL);
      })
      .then(function() {
        /* 새 SW를 즉시 활성화 (기존 페이지 대기 없이) */
        return self.skipWaiting();
      })
  );
});

/* ── activate: 오래된 캐시 정리 ── */
self.addEventListener('activate', function(e) {
  e.waitUntil(
    caches.keys().then(function(keys) {
      return Promise.all(
        keys
          .filter(function(k) {
            return k !== CACHE_NAME && k !== IMG_CACHE;
          })
          .map(function(k) {
            return caches.delete(k);
          })
      );
    }).then(function() {
      /* 모든 열린 탭에 즉시 적용 */
      return self.clients.claim();
    })
  );
});

/* ── fetch: 요청 가로채기 ── */
self.addEventListener('fetch', function(e) {
  var url = e.request.url;

  /* Wikimedia 카드 이미지 — Network First + 캐시 폴백 */
  if (url.includes('upload.wikimedia.org')) {
    e.respondWith(networkFirstImg(e.request));
    return;
  }

  /* Google Fonts / jsDelivr — Cache First */
  if (url.includes('fonts.googleapis.com') ||
      url.includes('fonts.gstatic.com') ||
      url.includes('cdn.jsdelivr.net')) {
    e.respondWith(cacheFirst(e.request, CACHE_NAME));
    return;
  }

  /* 앱 셸 및 기타 — Cache First */
  if (e.request.method === 'GET') {
    e.respondWith(cacheFirst(e.request, CACHE_NAME));
  }
});

/* ── 전략 함수들 ── */

/* Cache First: 캐시에 있으면 캐시, 없으면 네트워크 후 캐시 저장 */
function cacheFirst(request, cacheName) {
  return caches.match(request).then(function(cached) {
    if (cached) return cached;
    return fetch(request).then(function(response) {
      if (!response || response.status !== 200) return response;
      var clone = response.clone();
      caches.open(cacheName).then(function(cache) {
        cache.put(request, clone);
      });
      return response;
    });
  });
}

/* Network First: 네트워크 우선, 실패 시 캐시 폴백 (카드 이미지용) */
function networkFirstImg(request) {
  return fetch(request)
    .then(function(response) {
      if (!response || response.status !== 200) throw new Error('fetch failed');
      var clone = response.clone();
      caches.open(IMG_CACHE).then(function(cache) {
        cache.put(request, clone);
      });
      return response;
    })
    .catch(function() {
      /* 오프라인 시 캐시된 이미지 반환 */
      return caches.match(request).then(function(cached) {
        return cached || new Response('', { status: 404 });
      });
    });
}
