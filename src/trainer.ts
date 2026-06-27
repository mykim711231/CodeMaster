import { initTypingEngine } from './engine/typing';
import { PACKS, type Pack } from './content';
import { saveSession } from './storage/db';
import { appStore } from './store';

// 학습팩 ↔ 타이핑 엔진 연결.
// 사이드바: 학습팩 목록(트리) → 팩 클릭 시 문제 목록 펼침 → 문제 클릭 시 이동.
// 이전/다음은 팩 경계를 넘어 이어짐.
export function initTrainer(): void {
  const titleEl = document.getElementById('practiceTitle');
  const fileEl = document.getElementById('fileTabName');
  const treeEl = document.getElementById('packTree');

  const PACK_KEYS = Object.keys(PACKS);
  let packKey = PACK_KEYS[0];
  let index = 0;
  const expanded = new Set<string>([packKey]); // 펼쳐진 팩

  const curPack = (): Pack => PACKS[packKey];

  const engine = initTypingEngine({
    onComplete: (result) => {
      void saveSession({ ts: Date.now(), ...result });
      appStore.getState().recordCompletion(result.wpm);
    },
  });

  function renderTree(): void {
    if (!treeEl) return;
    treeEl.innerHTML = '';
    for (const key of PACK_KEYS) {
      const p = PACKS[key];
      const isOpen = expanded.has(key);

      const row = document.createElement('button');
      row.type = 'button';
      row.className = 'pack-row' + (key === packKey ? ' current' : '') + (isOpen ? ' open' : '');
      const chev = document.createElement('span');
      chev.className = 'pack-chev';
      chev.textContent = '▸';
      const name = document.createElement('span');
      name.className = 'pack-name';
      name.textContent = p.name;
      const cnt = document.createElement('span');
      cnt.className = 'pack-cnt';
      cnt.textContent = String(p.snippets.length);
      row.append(chev, name, cnt);
      row.addEventListener('click', () => toggleExpand(key));
      treeEl.append(row);

      if (isOpen) {
        const sub = document.createElement('div');
        sub.className = 'pack-snips';
        p.snippets.forEach((snip, i) => {
          const btn = document.createElement('button');
          btn.type = 'button';
          btn.className = 'snip-item' + (key === packKey && i === index ? ' active' : '');
          const t = document.createElement('span');
          t.className = 'snip-title';
          t.textContent = snip.title;
          const f = document.createElement('span');
          f.className = 'snip-file';
          f.textContent = snip.file;
          btn.append(t, f);
          btn.addEventListener('click', () => goTo(key, i));
          sub.append(btn);
        });
        treeEl.append(sub);
      }
    }
  }

  function show(): void {
    const p = curPack();
    const snip = p.snippets[index];
    engine.load(snip.code, snip.lang);
    if (titleEl) titleEl.textContent = `${p.name} · ${snip.title}`;
    if (fileEl) fileEl.textContent = snip.file;
    appStore.getState().setLang(p.lang);
    renderTree();
  }

  function toggleExpand(key: string): void {
    if (expanded.has(key)) expanded.delete(key);
    else expanded.add(key);
    renderTree();
  }

  function goTo(key: string, i: number): void {
    packKey = key;
    index = i;
    expanded.add(key);
    show();
  }

  // 이전/다음 — 팩 경계를 넘어 이어짐
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
    expanded.add(packKey);
    show();
  }

  document.getElementById('prevBtn')?.addEventListener('click', () => step(-1));
  document.getElementById('nextBtn')?.addEventListener('click', () => step(1));

  show();
}
