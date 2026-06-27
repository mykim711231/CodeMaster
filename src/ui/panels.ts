// 좌/우 사이드 패널 토글 — 데스크톱=접기 / 모바일=오프캔버스 드로어
export function initPanels(): void {
  const app = document.querySelector('.app');
  const sidebarToggle = document.getElementById('sidebarToggle');
  const panelToggle = document.getElementById('panelToggle');
  const sidebar = document.querySelector('.sidebar');
  const overlay = document.getElementById('overlay');
  if (!app || !sidebarToggle || !panelToggle || !sidebar || !overlay) return;

  const isMobile = (): boolean => window.innerWidth <= 1024;

  const syncButtons = (): void => {
    const leftActive = isMobile()
      ? app.classList.contains('left-open')
      : !app.classList.contains('left-collapsed');
    const rightActive = isMobile()
      ? app.classList.contains('right-open')
      : !app.classList.contains('right-collapsed');
    sidebarToggle.classList.toggle('active', leftActive);
    panelToggle.classList.toggle('active', rightActive);
  };

  const toggleLeft = (): void => {
    if (isMobile()) {
      const open = !app.classList.contains('left-open');
      app.classList.remove('left-open', 'right-open');
      if (open) app.classList.add('left-open');
    } else {
      app.classList.toggle('left-collapsed');
    }
    syncButtons();
  };

  const toggleRight = (): void => {
    if (isMobile()) {
      const open = !app.classList.contains('right-open');
      app.classList.remove('left-open', 'right-open');
      if (open) app.classList.add('right-open');
    } else {
      app.classList.toggle('right-collapsed');
    }
    syncButtons();
  };

  const closeDrawers = (): void => {
    app.classList.remove('left-open', 'right-open');
    syncButtons();
  };

  sidebarToggle.addEventListener('click', toggleLeft);
  panelToggle.addEventListener('click', toggleRight);
  overlay.addEventListener('click', closeDrawers);

  // 드로어 안에서 항목 선택 시 자동 닫기 (모바일) — 팩 토글 제외
  sidebar.addEventListener('click', (e: Event) => {
    const target = e.target as HTMLElement | null;
    if (isMobile() && target?.closest('.sidebar-item, .lvl-item:not(.locked), .resume-btn')) {
      closeDrawers();
    }
  });

  let wasMobile = isMobile();
  window.addEventListener('resize', () => {
    const now = isMobile();
    if (now !== wasMobile) {
      app.classList.remove('left-open', 'right-open', 'left-collapsed', 'right-collapsed');
      wasMobile = now;
    }
    syncButtons();
  });

  syncButtons();
}
