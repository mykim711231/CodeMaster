/* CodeMaster Service Worker — Phase 1 (오프라인 앱 셸 캐시)
 * 전략: 앱 셸 precache + GET 요청 cache-first(런타임 캐시).
 * 주의: skipWaiting 미사용 — 타이핑 중 강제 리로드 방지(다음 방문에 새 버전 적용).
 */
const CACHE = 'codemaster-v1';
const SHELL = ['./', './index.html', './manifest.json', './icon.svg'];

self.addEventListener('install', (event) => {
  event.waitUntil(caches.open(CACHE).then((c) => c.addAll(SHELL)));
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  const { request } = event;
  if (request.method !== 'GET') return;
  event.respondWith(
    caches.match(request).then((cached) => {
      if (cached) return cached;
      return fetch(request)
        .then((resp) => {
          const copy = resp.clone();
          caches.open(CACHE).then((c) => c.put(request, copy)).catch(() => {});
          return resp;
        })
        .catch(() => cached);
    })
  );
});
