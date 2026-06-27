/* CodeMaster Service Worker — Phase 1
 * - 내비게이션(HTML): 네트워크 우선 → 항상 최신 index.html(새 자산 해시) 수신, 오프라인 시 캐시
 * - 그 외 GET(해시 자산·폰트 등): 캐시 우선(불변)
 * - 캐시명 버전업 + skipWaiting/claim 으로 새 배포 즉시 반영 (옛 캐시 누적 방지)
 */
const CACHE = 'codemaster-v2';
const SHELL = ['./', './index.html', './manifest.json', './icon.svg'];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches
      .open(CACHE)
      .then((c) => c.addAll(SHELL))
      .then(() => self.skipWaiting()),
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) => Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k))))
      .then(() => self.clients.claim()),
  );
});

self.addEventListener('fetch', (event) => {
  const { request } = event;
  if (request.method !== 'GET') return;

  // 내비게이션(문서) → 네트워크 우선
  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request)
        .then((resp) => {
          const copy = resp.clone();
          caches.open(CACHE).then((c) => c.put('./index.html', copy)).catch(() => {});
          return resp;
        })
        .catch(() => caches.match(request).then((r) => r || caches.match('./index.html'))),
    );
    return;
  }

  // 그 외 GET → 캐시 우선 (해시 자산은 불변이라 안전)
  event.respondWith(
    caches.match(request).then((cached) => {
      if (cached) return cached;
      return fetch(request)
        .then((resp) => {
          if (new URL(request.url).origin === location.origin) {
            const copy = resp.clone();
            caches.open(CACHE).then((c) => c.put(request, copy)).catch(() => {});
          }
          return resp;
        })
        .catch(() => cached);
    }),
  );
});
