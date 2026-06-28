import { analyzeProject } from '../analysis/index';
import { appStore } from '../store';
import { getTrainerAPI } from '../trainer';

const isFileSystemAccessSupported = 'showDirectoryPicker' in window;
const isMobile = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);

async function doImport(btn: HTMLButtonElement): Promise<void> {
  if (!isFileSystemAccessSupported || isMobile) {
    alert('이 기능은 데스크톱 Chromium 브라우저에서만 지원됩니다.');
    return;
  }
  if (appStore.getState().isAnalyzing) return;

  btn.disabled = true;
  const originalHTML = btn.innerHTML;
  btn.innerHTML = '<i data-lucide="loader"></i> 분석 중...';
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

    alert(
      `분석 완료! ${result.stats.generatedSnippets}개 문제 추출됨 ` +
        `(${(result.stats.durationMs / 1000).toFixed(1)}초)`,
    );
  } catch (err) {
    console.error('프로젝트 분석 실패:', err);
    alert(err instanceof Error ? err.message : '프로젝트 분석에 실패했습니다.');
  } finally {
    appStore.getState().setIsAnalyzing(false);
    btn.innerHTML = originalHTML;
    btn.disabled = false;
  }
}

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

  // 버거 메뉴 "프로젝트 가져오기"
  const importLink = Array.from(menuWrap.querySelectorAll('.menu-link')).find(
    (el) => el.textContent?.includes('프로젝트 가져오기'),
  ) as HTMLButtonElement | undefined;

  menuWrap.querySelectorAll('.menu-link').forEach((link) => {
    if (link === importLink) {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        setOpen(false);
        void doImport(link as HTMLButtonElement);
      });
    } else {
      link.addEventListener('click', () => setOpen(false));
    }
  });

  // 문서 클릭·ESC로 메뉴 닫기
  document.addEventListener('click', (e: Event) => {
    const target = e.target as Node | null;
    if (target && !menuWrap.contains(target)) setOpen(false);
  });
  document.addEventListener('keydown', (e: KeyboardEvent) => {
    if (e.key === 'Escape') setOpen(false);
  });
}
