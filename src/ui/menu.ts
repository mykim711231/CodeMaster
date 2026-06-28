import { importProject } from '../analysis/index';
import { appStore } from '../store';
import { getTrainerAPI } from '../trainer';

const isSupported = 'showDirectoryPicker' in window;
const isMobile = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);

async function doImport(btn: HTMLButtonElement): Promise<void> {
  if (!isSupported || isMobile) {
    alert('이 기능은 데스크톱 Chromium 브라우저에서만 지원됩니다.');
    return;
  }
  if (appStore.getState().isAnalyzing) return;

  btn.disabled = true;
  const orig = btn.innerHTML;
  btn.innerHTML = '<i data-lucide="loader"></i> 불러오는 중...';
  appStore.getState().setIsAnalyzing(true);

  try {
    const pack = await importProject((msg) => appStore.getState().setAnalysisProgress(msg));
    const trainer = getTrainerAPI();
    if (trainer) trainer.loadProjectPack(pack);
  } catch (err) {
    if ((err as Error).name !== 'AbortError') {
      console.error('import failed:', err);
      alert(err instanceof Error ? err.message : '불러오기에 실패했습니다.');
    }
  } finally {
    appStore.getState().setIsAnalyzing(false);
    btn.innerHTML = orig;
    btn.disabled = false;
  }
}

export function initMenu(): void {
  const menuWrap = document.querySelector('.menu-wrap');
  const menuToggle = document.getElementById('menuToggle');
  if (!menuWrap || !menuToggle) return;

  const setOpen = (open: boolean): void => {
    menuWrap.classList.toggle('open', open);
    menuToggle.classList.toggle('active', open);
  };

  menuToggle.addEventListener('click', (e) => { e.stopPropagation(); setOpen(!menuWrap.classList.contains('open')); });

  const importLink = Array.from(menuWrap.querySelectorAll('.menu-link')).find(
    (el) => el.textContent?.includes('프로젝트 가져오기'),
  ) as HTMLButtonElement | undefined;

  menuWrap.querySelectorAll('.menu-link').forEach((link) => {
    if (link === importLink) {
      link.addEventListener('click', (e) => { e.preventDefault(); e.stopPropagation(); setOpen(false); void doImport(link as HTMLButtonElement); });
    } else {
      link.addEventListener('click', () => setOpen(false));
    }
  });

  document.addEventListener('click', (e) => { if (e.target && !menuWrap.contains(e.target as Node)) setOpen(false); });
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') setOpen(false); });
}
