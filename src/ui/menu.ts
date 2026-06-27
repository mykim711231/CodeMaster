// 버거 메뉴 드롭다운
export function initMenu(): void {
  const menuWrap = document.querySelector('.menu-wrap');
  const menuToggle = document.getElementById('menuToggle');
  if (!menuWrap || !menuToggle) return;

  const setOpen = (open: boolean): void => {
    menuWrap.classList.toggle('open', open);
    menuToggle.classList.toggle('active', open);
  };

  menuToggle.addEventListener('click', (e: Event) => {
    e.stopPropagation();
    setOpen(!menuWrap.classList.contains('open'));
  });
  menuWrap.querySelectorAll('.menu-link').forEach((link) => {
    link.addEventListener('click', () => setOpen(false));
  });
  document.addEventListener('click', (e: Event) => {
    const target = e.target as Node | null;
    if (target && !menuWrap.contains(target)) setOpen(false);
  });
  document.addEventListener('keydown', (e: KeyboardEvent) => {
    if (e.key === 'Escape') setOpen(false);
  });
}
