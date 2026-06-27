// 학습 통계 모달 — 버거 메뉴 "학습 통계"로 열기 (우패널은 문제 설명 전용으로 비움)
export function initStats(): void {
  const modal = document.getElementById('statsModal');
  if (!modal) return;
  const openBtn = document.getElementById('statsMenuItem');
  const closeBtn = document.getElementById('statsClose');

  const open = (): void => modal.classList.add('open');
  const close = (): void => modal.classList.remove('open');

  openBtn?.addEventListener('click', open);
  closeBtn?.addEventListener('click', close);
  modal.addEventListener('click', (e) => {
    const target = e.target as HTMLElement | null;
    if (target?.closest('[data-close]')) close();
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') close();
  });
}
