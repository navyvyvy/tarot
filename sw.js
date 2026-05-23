/* ═══════════════════════════════════════════════
   NORU — Service Worker v2
   전략:
   - 앱 셸 및 에셋(로컬 이미지): Cache First (오프라인 완벽 지원)
   - 외부 리소스(폰트 등): Cache First
   ═══════════════════════════════════════════════ */

const CACHE_NAME = 'noru-v2'; // ★ 업데이트 시 이 숫자(v2 -> v3)를 올리세요!

const APP_SHELL = [
  './',
  './index.html',
  './css/',
  './app.js',
  './cards.js',
  './assets/',
  './manifest.json',
  './icon-192.svg',
  './locale/ko.js'
];

/* ── Install: 앱 셸 사전 캐싱 및 즉시 대기열 통과 ── */
self.addEventListener('install', function(e) {
  self.skipWaiting(); // 새 버전이 발견되면 즉시 설치
  e.waitUntil(
    caches.open(CACHE_NAME).then(function(cache) {
      return cache.addAll(APP_SHELL);
    })
  );
});

/* ── Activate: 구버전 캐시 완벽 삭제 ── */
self.addEventListener('activate', function(e) {
  e.waitUntil(
    caches.keys().then(function(cacheNames) {
      return Promise.all(
        cacheNames.map(function(cache) {
          if (cache !== CACHE_NAME) {
            console.log('[SW] 구버전 캐시 삭제:', cache);
            return caches.delete(cache);
          }
        })
      );
    }).then(function() {
      return self.clients.claim(); // 즉시 모든 탭에 제어권 행사
    })
  );
});

/* ── Fetch: 오프라인 캐시 서빙 ── */
self.addEventListener('fetch', function(e) {
  // GET 요청만 가로챕니다.
  if (e.request.method !== 'GET') return;

  const url = new URL(e.request.url);

  // 🚨 [핵심] HTML 문서(페이지 진입점)는 무조건 Network First 전략!
  // 사용자가 F5를 누르면 무조건 서버에서 최신 코드를 가져오게 합니다.
  if (e.request.mode === 'navigate' || url.pathname === '/' || url.pathname.endsWith('index.html')) {
    e.respondWith(
      fetch(e.request)
        .then(function(networkResponse) {
          // 네트워크가 성공하면 캐시도 최신본으로 덮어씌움
          const responseToCache = networkResponse.clone();
          caches.open(CACHE_NAME).then(function(cache) {
            cache.put(e.request, responseToCache);
          });
          return networkResponse;
        })
        .catch(function() {
          // 인터넷이 끊겼을 때만 캐시에서 예전 HTML을 보여줌
          return caches.match(e.request);
        })
    );
    return;
  }

  // 📦 나머지(이미지, CSS, JS)는 Cache First 전략
  // 이미 주머니에 있으면 바로 보여줘서 로딩 속도를 폭발적으로 높임
  e.respondWith(
    caches.match(e.request).then(function(cachedResponse) {
      if (cachedResponse) {
        return cachedResponse;
      }
      return fetch(e.request).then(function(networkResponse) {
        if (!networkResponse || networkResponse.status !== 200 || networkResponse.type !== 'basic') {
          return networkResponse;
        }
        const responseToCache = networkResponse.clone();
        caches.open(CACHE_NAME).then(function(cache) {
          cache.put(e.request, responseToCache);
        });
        return networkResponse;
      });
    })
  );
});