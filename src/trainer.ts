import { initTypingEngine } from './engine/typing';
import { PACKS, type Pack } from './content';
import { saveSession } from './storage/db';
import { appStore } from './store';

// 학습팩 ↔ 타이핑 엔진 연결. 이전/다음·목록 선택·팩 전환·제목/파일탭 갱신.
export function initTrainer(): void {
  const titleEl = document.getElementById('practiceTitle');
  const fileEl = document.getElementById('fileTabName');
  const countEl = document.getElementById('roadmapCount');
  const listEl = document.getElementById('snippetList');

  let pack: Pack = PACKS.java;
  let index = 0;

  const engine = initTypingEngine({
    onComplete: (result) => {
      void saveSession({ ts: Date.now(), ...result });
      appStore.getState().recordCompletion(result.wpm);
    },
  });

  function renderList(): void {
    if (!listEl) return;
    listEl.innerHTML = '';
    pack.snippets.forEach((snip, i) => {
      const btn = document.createElement('button');
      btn.className = 'lvl-item' + (i === index ? ' active' : '');
      btn.type = 'button';

      const body = document.createElement('div');
      body.className = 'lvl-body';
      const line = document.createElement('div');
      line.className = 'lvl-line';
      const title = document.createElement('span');
      title.className = 'lvl-title';
      title.textContent = snip.title;
      const file = document.createElement('span');
      file.className = 'lvl-num2';
      file.textContent = snip.file;
      line.append(title, file);
      body.append(line);
      btn.append(body);

      btn.addEventListener('click', () => go(i));
      listEl.append(btn);
    });
  }

  function show(): void {
    const snip = pack.snippets[index];
    engine.load(snip.code, snip.lang);
    if (titleEl) titleEl.textContent = `${pack.name} · ${snip.title}`;
    if (fileEl) fileEl.textContent = snip.file;
    if (countEl) countEl.textContent = `${index + 1}/${pack.snippets.length}`;
    renderList();
  }

  function go(i: number): void {
    const n = pack.snippets.length;
    index = ((i % n) + n) % n; // 순환 (이전/다음 양방향)
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

  document.getElementById('prevBtn')?.addEventListener('click', () => go(index - 1));
  document.getElementById('nextBtn')?.addEventListener('click', () => go(index + 1));
  document.querySelectorAll<HTMLButtonElement>('.pack-seg-btn').forEach((btn) => {
    btn.addEventListener('click', () => switchPack(btn.dataset.pack ?? 'java'));
  });

  show();
}
