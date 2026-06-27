// 라이트/다크 테마 토글 (localStorage 유지). FOUC 방지 초기 적용은 index.html head 인라인.
export function initTheme(): void {
  const root = document.documentElement;
  const btn = document.getElementById('themeToggle');
  let theme = 'dark';
  try {
    theme = localStorage.getItem('cm-theme') || 'dark';
  } catch {
    /* localStorage 차단 환경 무시 */
  }
  const apply = (t: string): void => {
    if (t === 'light') root.setAttribute('data-theme', 'light');
    else root.removeAttribute('data-theme');
  };
  apply(theme);
  btn?.addEventListener('click', () => {
    theme = root.getAttribute('data-theme') === 'light' ? 'dark' : 'light';
    apply(theme);
    try {
      localStorage.setItem('cm-theme', theme);
    } catch {
      /* ignore */
    }
  });
}
