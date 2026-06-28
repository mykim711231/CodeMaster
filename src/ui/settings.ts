import { appStore } from '../store';

function syncCheckbox(id: string, value: boolean): void {
  const cb = document.getElementById(id) as HTMLInputElement | null;
  if (cb) cb.checked = value;
}

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
    syncCheckbox('settingsAutoIndent', state.autoIndent);
    syncCheckbox('settingsAutoClose', state.autoClose);
    syncCheckbox('settingsOverwrite', state.overwriteMode);
    syncCheckbox('settingsAutoNext', state.autoNext);
    modal.style.display = 'flex';
  };

  const bindCheckbox = (id: string, setter: (v: boolean) => void) => {
    const cb = document.getElementById(id) as HTMLInputElement | null;
    cb?.addEventListener('change', () => setter(cb.checked));
  };
  bindCheckbox('settingsAutoIndent', appStore.getState().setAutoIndent);
  bindCheckbox('settingsAutoClose', appStore.getState().setAutoClose);
  bindCheckbox('settingsOverwrite', appStore.getState().setOverwriteMode);
  bindCheckbox('settingsAutoNext', appStore.getState().setAutoNext);
  const close = () => { modal.style.display = 'none'; };

  closeBtn?.addEventListener('click', close);
  modal.querySelector('.settings-modal-bg')?.addEventListener('click', close);

  tabSelect?.addEventListener('change', () => {
    appStore.getState().setTabSize(Number(tabSelect.value));
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
  applyFontSize(appStore.getState().fontSize);
}

export function applyFontSize(n: number): void {
  document.documentElement.style.setProperty('--code-font-size', `${n}px`);
}
