import { initTypingEngine } from './engine/typing';
import { PACKS, type Pack } from './content';
import { saveSession } from './storage/db';
import { appStore } from './store';

// 학습팩 ↔ 타이핑 엔진 연결. 이전/다음(팩 경계 넘김)·목록 선택·팩 토글·제목 갱신.
export function initTrainer(): void {
  const titleEl = document.getElementById('practiceTitle');
  const fileEl = document.getElementById('fileTabName');
  const countEl = document.getElementById('roadmapCount');
  const listEl = document.getElementById('snippetList');
  const roadmapTitleEl = document.getElementById('roadmapTitle');
  const segBtns = document.querySelectorAll<HTMLButtonElement>('.pack-seg-btn');

  const PACK_KEYS = Object.keys(PACKS);
  let packKey = PACK_KEYS[0];
  let index = 0;

  const curPack = (): Pack => PACKS[packKey];

  const engine = initTypingEngine({
    onComplete: (result) => {
      void saveSession({ ts: Date.now(), ...result });
      appStore.getState().recordCompletion(result.wpm);
    },
  });

  function syncPackUI(): void {
    const p = curPack();
    segBtns.forEach((b) => {
      const on = b.dataset.pack === packKey;
      b.classList.toggle('active', on);
      b.setAttribute('aria-selected', on ? 'true' : 'false');
    });
    if (roadmapTitleEl) roadmapTitleEl.textContent = `${p.name} 로드맵`;
    appStore.getState().setLang(p.lang);
  }

  function renderList(): void {
    if (!listEl) return;
    listEl.innerHTML = '';
    curPack().snippets.forEach((snip, i) => {
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
      btn.addEventListener('click', () => goTo(i));
      listEl.append(btn);
    });
  }

  function show(): void {
    const p = curPack();
    const snip = p.snippets[index];
    engine.load(snip.code, snip.lang);
    if (titleEl) titleEl.textContent = `${p.name} · ${snip.title}`;
    if (fileEl) fileEl.textContent = snip.file;
    if (countEl) countEl.textContent = `${index + 1}/${p.snippets.length}`;
    syncPackUI();
    renderList();
  }

  // 현재 팩 안에서 특정 문제로 (목록 클릭)
  function goTo(i: number): void {
    index = i;
    show();
  }

  // 다음/이전 — 팩 경계를 넘어 이어짐
  function step(dir: 1 | -1): void {
    const len = curPack().snippets.length;
    let next = index + dir;
    if (next >= len) {
      const pi = (PACK_KEYS.indexOf(packKey) + 1) % PACK_KEYS.length;
      packKey = PACK_KEYS[pi];
      next = 0;
    } else if (next < 0) {
      const pi = (PACK_KEYS.indexOf(packKey) - 1 + PACK_KEYS.length) % PACK_KEYS.length;
      packKey = PACK_KEYS[pi];
      next = PACKS[packKey].snippets.length - 1;
    }
    index = next;
    show();
  }

  // 팩 직접 선택 (세그먼트 토글)
  function switchPack(key: string): void {
    if (!PACKS[key] || key === packKey) return;
    packKey = key;
    index = 0;
    show();
  }

  document.getElementById('prevBtn')?.addEventListener('click', () => step(-1));
  document.getElementById('nextBtn')?.addEventListener('click', () => step(1));
  segBtns.forEach((btn) => {
    btn.addEventListener('click', () => switchPack(btn.dataset.pack ?? PACK_KEYS[0]));
  });

  show();
}
