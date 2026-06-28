import { appStore } from '../store';

export function initSettings(): void {
  const modal = document.getElementById('settingsModal');
  const closeBtn = document.getElementById('settingsModalClose');
  const tabSelect = document.getElementById('settingsTabSize') as HTMLSelectElement | null;
  const fontSelect = document.getElementById('settingsFontSize') as HTMLSelectElement | null;

  if (!modal) return;

  const open = () => {
    const state = appStore.getState();
    if (tabSelect) tabSelect.value = String(state.tabSize);
    if (fontSelect) fontSelect.value = String(state.fontSize);
    modal.style.display = 'flex';
  };
  const close = () => { modal.style.display = 'none'; };

  closeBtn?.addEventListener('click', close);
  modal.querySelector('.settings-modal-bg')?.addEventListener('click', close);

  tabSelect?.addEventListener('change', () => {
    appStore.getState().setTabSize(Number(tabSelect.value));
    applyTabSize(Number(tabSelect.value));
  });
  fontSelect?.addEventListener('change', () => {
    appStore.getState().setFontSize(Number(fontSelect.value));
    applyFontSize(Number(fontSelect.value));
  });

  // 버거 메뉴 "설정" 연결
  const settingsLink = Array.from(document.querySelectorAll('.menu-link')).find(
    (el) => el.textContent?.includes('설정'),
  );
  settingsLink?.addEventListener('click', (e) => {
    e.preventDefault();
    e.stopPropagation();
    open();
  });

  // 초기 적용
  applyTabSize(appStore.getState().tabSize);
  applyFontSize(appStore.getState().fontSize);
}

export function applyTabSize(n: number): void {
  document.documentElement.style.setProperty('--tab-size', String(n));
}

export function applyFontSize(n: number): void {
  document.documentElement.style.setProperty('--code-font-size', `${n}px`);
}
