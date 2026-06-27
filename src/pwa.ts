// Service Worker 등록 (오프라인 PWA). 등록 경로는 문서 기준 → /CodeMaster/sw.js
export function registerServiceWorker(): void {
  if (!('serviceWorker' in navigator)) return;
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('./sw.js').catch(() => {
      /* 등록 실패는 치명적이지 않음 */
    });
  });
}
