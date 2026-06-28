import { analyzeProject } from '../analysis/index';
import { appStore } from '../store';
import { getTrainerAPI } from '../trainer';

const isFileSystemAccessSupported = 'showDirectoryPicker' in window;
const isMobile = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);

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

  // "프로젝트 가져오기" 메뉴 항목
  const importLink = Array.from(menuWrap.querySelectorAll('.menu-link')).find(
    (el) => el.textContent?.includes('프로젝트 가져오기'),
  );
  if (importLink) {
    importLink.addEventListener('click', async (e) => {
      e.stopPropagation();

      if (!isFileSystemAccessSupported || isMobile) {
        alert('이 기능은 데스크톱 Chromium 브라우저에서만 지원됩니다.');
        return;
      }

      if (appStore.getState().isAnalyzing) return;

      const originalHTML = importLink.innerHTML;
      const icon = importLink.querySelector('i');
      if (icon) icon.setAttribute('data-lucide', 'loader');

      appStore.getState().setIsAnalyzing(true);

      try {
        const result = await analyzeProject((msg) => {
          appStore.getState().setAnalysisProgress(msg);
        });

        const trainer = getTrainerAPI();
        if (trainer) {
          trainer.loadProjectPack(result.pack);
        } else {
          appStore.getState().setProjectPack(result.pack);
        }

        setOpen(false);
      } catch (err) {
        alert(err instanceof Error ? err.message : '프로젝트 분석에 실패했습니다.');
      } finally {
        appStore.getState().setIsAnalyzing(false);
        importLink.innerHTML = originalHTML;
      }
    });
  }
}
