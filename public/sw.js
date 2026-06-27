/* CodeMaster Service Worker — 비활성화(킬 스위치)
 * 그동안의 SW 캐시 staleness 로 인한 멈춤(무한 로딩)을 해소.
 * fetch 핸들러가 없어 네트워크를 가로채지 않으며, 활성화 시 모든 캐시 삭제 +
 * 자기 자신 등록 해제 + 열린 탭 새로고침으로 깨끗한 상태로 복구한다.
 * (오프라인 PWA 는 추후 vite-plugin-pwa(Workbox)로 정식 재도입)
 */
self.addEventListener('install', () => self.skipWaiting());

self.addEventListener('activate', (event) => {
  event.waitUntil(
    (async () => {
      try {
        const keys = await caches.keys();
        await Promise.all(keys.map((k) => caches.delete(k)));
      } catch (e) {
        /* ignore */
      }
      try {
        await self.registration.unregister();
      } catch (e) {
        /* ignore */
      }
      const clients = await self.clients.matchAll({ type: 'window' });
      for (const client of clients) client.navigate(client.url);
    })(),
  );
});
