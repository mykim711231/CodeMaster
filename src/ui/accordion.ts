// 사이드바 아코디언 (펼침/접힘). 학습팩 세그먼트 토글은 trainer 가 담당.
export function initAccordion(): void {
  document.querySelectorAll('.acc-header').forEach((header) => {
    header.addEventListener('click', () => {
      header.closest('.accordion')?.classList.toggle('open');
    });
  });
}
