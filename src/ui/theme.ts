// 라이트/다크 테마 토글 (localStorage 유지). FOUC 방지 초기 적용은 index.html head 인라인.
function syncDocTheme(t: string): void {
  const mDark = document.getElementById('md-dark-css') as HTMLLinkElement | null;
  const mLight = document.getElementById('md-light-css') as HTMLLinkElement | null;
  const hDark = document.getElementById('hljs-dark-css') as HTMLLinkElement | null;
  const hLight = document.getElementById('hljs-light-css') as HTMLLinkElement | null;
  const isDark = t !== 'light';
  if (mDark) mDark.disabled = !isDark;
  if (mLight) mLight.disabled = isDark;
  if (hDark) hDark.disabled = !isDark;
  if (hLight) hLight.disabled = isDark;
}

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
    syncDocTheme(t);
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
