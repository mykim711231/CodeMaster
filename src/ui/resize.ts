const STORAGE_KEY = 'cm-sidebar-width';
const MIN_WIDTH = 180;
const MAX_WIDTH = 500;

let handle: HTMLDivElement | null = null;
let sidebar: HTMLElement | null = null;
let startX = 0;
let startWidth = 248;

function isDesktop(): boolean {
  return window.innerWidth > 1024;
}

function saveWidth(w: number): void {
  try { localStorage.setItem(STORAGE_KEY, String(w)); } catch (_) { /* ignore */ }
}

function loadWidth(): number {
  try {
    const v = localStorage.getItem(STORAGE_KEY);
    if (v) {
      const n = parseInt(v, 10);
      if (n >= MIN_WIDTH && n <= MAX_WIDTH) return n;
    }
  } catch (_) { /* ignore */ }
  return 248;
}

function applyWidth(w: number): void {
  document.documentElement.style.setProperty('--sidebar-width', `${w}px`);
}

function onMouseMove(e: MouseEvent): void {
  if (!sidebar) return;
  const dx = e.clientX - startX;
  const newWidth = Math.min(MAX_WIDTH, Math.max(MIN_WIDTH, startWidth + dx));
  applyWidth(newWidth);
  sidebar.classList.add('resizing');
  document.body.style.cursor = 'col-resize';
  document.body.style.userSelect = 'none';
}

function onMouseUp(_e: MouseEvent): void {
  document.removeEventListener('mousemove', onMouseMove);
  document.removeEventListener('mouseup', onMouseUp);
  if (sidebar) {
    const w = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--sidebar-width'), 10);
    saveWidth(w);
    sidebar.classList.remove('resizing');
  }
  document.body.style.cursor = '';
  document.body.style.userSelect = '';
}

function onMouseDown(e: MouseEvent): void {
  if (!isDesktop() || !sidebar) return;
  e.preventDefault();
  startX = e.clientX;
  startWidth = sidebar.offsetWidth;
  document.addEventListener('mousemove', onMouseMove);
  document.addEventListener('mouseup', onMouseUp);
}

export function initResize(): void {
  sidebar = document.querySelector('.sidebar');
  if (!sidebar) return;

  handle = document.createElement('div');
  handle.className = 'sidebar-resize-handle';
  handle.addEventListener('mousedown', onMouseDown);
  sidebar.appendChild(handle);

  applyWidth(loadWidth());
}
