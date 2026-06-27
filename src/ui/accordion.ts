// 사이드바 아코디언 + 학습팩 세그먼트 토글
export function initAccordion(): void {
  document.querySelectorAll('.acc-header').forEach((header) => {
    header.addEventListener('click', () => {
      header.closest('.accordion')?.classList.toggle('open');
    });
  });

  const packSeg = document.getElementById('packSeg');
  const roadmapTitle = document.getElementById('roadmapTitle');
  if (!packSeg) return;

  packSeg.querySelectorAll<HTMLButtonElement>('.pack-seg-btn').forEach((btn) => {
    btn.addEventListener('click', () => {
      packSeg.querySelectorAll('.pack-seg-btn').forEach((b) => {
        const on = b === btn;
        b.classList.toggle('active', on);
        b.setAttribute('aria-selected', on ? 'true' : 'false');
      });
      if (roadmapTitle) {
        const label = btn.dataset.pack === 'python' ? 'Python AI' : 'Spring Boot';
        roadmapTitle.textContent = label + ' 로드맵';
      }
    });
  });
}
