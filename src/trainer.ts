import { initTypingEngine } from './engine/typing';
import { PACKS, type Pack } from './content';
import { saveSession } from './storage/db';
import { appStore } from './store';

// 학습팩 ↔ 타이핑 엔진 연결. "다음 문제"·팩 전환·제목/파일탭 갱신.
export function initTrainer(): void {
  const titleEl = document.getElementById('practiceTitle');
  const fileEl = document.getElementById('fileTabName');

  let pack: Pack = PACKS.java;
  let index = 0;

  const engine = initTypingEngine({
    onComplete: (result) => {
      void saveSession({ ts: Date.now(), ...result });
      appStore.getState().recordCompletion(result.wpm);
    },
  });

  function show(): void {
    const snip = pack.snippets[index];
    engine.load(snip.code, snip.lang);
    if (titleEl) titleEl.textContent = `${pack.name} · ${snip.title}`;
    if (fileEl) fileEl.textContent = snip.file;
  }

  function next(): void {
    index = (index + 1) % pack.snippets.length;
    show();
  }

  function switchPack(key: string): void {
    const target = PACKS[key];
    if (!target || target === pack) return;
    pack = target;
    index = 0;
    appStore.getState().setLang(pack.lang);
    show();
  }

  document.getElementById('nextBtn')?.addEventListener('click', next);
  document.querySelectorAll<HTMLButtonElement>('.pack-seg-btn').forEach((btn) => {
    btn.addEventListener('click', () => switchPack(btn.dataset.pack ?? 'java'));
  });

  show();
}
