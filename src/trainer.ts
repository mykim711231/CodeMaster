import { initTypingEngine } from './engine/typing';
import { PACKS, type Level, type Snippet } from './content';
import { saveSession } from './storage/db';
import { appStore } from './store';

interface Pos {
  packKey: string;
  levelNo: number;
  snipIndex: number;
}

// 학습팩 ↔ 엔진. 사이드바 팝업 서브메뉴: 학습팩 → 레벨 → 문제(3단).
// 버튼 클릭 시 팝업이 뜨고, 팩/레벨을 펼쳐 문제를 클릭하면 이동. 이전/다음은 전체를 가로질러 이어짐.
export function initTrainer(): void {
  const titleEl = document.getElementById('practiceTitle');
  const fileEl = document.getElementById('fileTabName');
  const curEl = document.getElementById('packMenuCur');
  const menuWrap = document.getElementById('packMenu');
  const menuBtn = document.getElementById('packMenuBtn');
  const pop = document.getElementById('packMenuPop');

  const PACK_KEYS = Object.keys(PACKS);

  // 모든 문제를 순서대로 펼친 평면 목록 (이전/다음 네비)
  const FLAT: Pos[] = [];
  for (const packKey of PACK_KEYS) {
    for (const lvl of PACKS[packKey].levels) {
      lvl.snippets.forEach((_, snipIndex) => FLAT.push({ packKey, levelNo: lvl.no, snipIndex }));
    }
  }
  let cur = 0;

  // 단일 펼침 — 한 번에 팩 하나, 레벨 하나만 펼쳐짐
  let openPack: string | null = null;
  let openLevel: string | null = null; // `${packKey}:${levelNo}`
  const lvlKey = (packKey: string, levelNo: number): string => `${packKey}:${levelNo}`;

  const pos = (): Pos => FLAT[cur];
  const levelOf = (p: Pos): Level =>
    PACKS[p.packKey].levels.find((l) => l.no === p.levelNo) ?? PACKS[p.packKey].levels[0];
  const snippetOf = (p: Pos): Snippet => levelOf(p).snippets[p.snipIndex];

  const engine = initTypingEngine({
    onComplete: (result) => {
      void saveSession({ ts: Date.now(), ...result });
      appStore.getState().recordCompletion(result.wpm);
    },
  });

  function setMenuOpen(open: boolean): void {
    menuWrap?.classList.toggle('open', open);
    menuBtn?.setAttribute('aria-expanded', open ? 'true' : 'false');
  }

  function renderTree(): void {
    if (!pop) return;
    const p = pos();
    pop.innerHTML = '';

    for (const packKey of PACK_KEYS) {
      const pack = PACKS[packKey];
      const packOpen = openPack === packKey;

      const prow = document.createElement('button');
      prow.type = 'button';
      prow.className =
        'pack-row' + (packKey === p.packKey ? ' current' : '') + (packOpen ? ' open' : '');
      const pchev = document.createElement('span');
      pchev.className = 'pack-chev';
      pchev.textContent = '▸';
      const pname = document.createElement('span');
      pname.className = 'pack-name';
      pname.textContent = pack.name;
      const pcnt = document.createElement('span');
      pcnt.className = 'pack-cnt';
      pcnt.textContent = String(pack.levels.length);
      prow.append(pchev, pname, pcnt);
      prow.addEventListener('click', (e) => {
        e.stopPropagation();
        if (openPack === packKey) {
          openPack = null;
        } else {
          openPack = packKey;
        }
        openLevel = null; // 팩 바뀌면(또는 닫으면) 레벨 펼침 초기화
        renderTree();
      });
      pop.append(prow);

      if (!packOpen) continue;

      const levelsWrap = document.createElement('div');
      levelsWrap.className = 'pack-levels';
      for (const lvl of pack.levels) {
        const has = lvl.snippets.length > 0;
        const key = lvlKey(packKey, lvl.no);
        const lvlOpen = openLevel === key;
        const isCurLevel = packKey === p.packKey && lvl.no === p.levelNo;

        const lrow = document.createElement('button');
        lrow.type = 'button';
        lrow.className =
          'level-row' +
          (isCurLevel ? ' current' : '') +
          (lvlOpen ? ' open' : '') +
          (has ? '' : ' empty');
        if (!has) lrow.disabled = true;
        const lchev = document.createElement('span');
        lchev.className = 'pack-chev';
        lchev.textContent = has ? '▸' : '·';
        const lno = document.createElement('span');
        lno.className = 'level-no';
        lno.textContent = `L${lvl.no}`;
        const lname = document.createElement('span');
        lname.className = 'level-name';
        lname.textContent = lvl.name;
        const lcnt = document.createElement('span');
        lcnt.className = 'pack-cnt';
        lcnt.textContent = has ? String(lvl.snippets.length) : '준비중';
        lrow.append(lchev, lno, lname, lcnt);
        lrow.addEventListener('click', (e) => {
          e.stopPropagation();
          openLevel = openLevel === key ? null : key;
          renderTree();
        });
        levelsWrap.append(lrow);

        if (lvlOpen && has) {
          const snips = document.createElement('div');
          snips.className = 'level-snips';
          lvl.snippets.forEach((snip, i) => {
            const btn = document.createElement('button');
            btn.type = 'button';
            btn.className = 'snip-item' + (isCurLevel && i === p.snipIndex ? ' active' : '');
            const t = document.createElement('span');
            t.className = 'snip-title';
            t.textContent = snip.title;
            const f = document.createElement('span');
            f.className = 'snip-file';
            f.textContent = snip.file;
            btn.append(t, f);
            btn.addEventListener('click', () => select(packKey, lvl.no, i));
            snips.append(btn);
          });
          levelsWrap.append(snips);
        }
      }
      pop.append(levelsWrap);
    }
  }

  function show(): void {
    const p = pos();
    const pack = PACKS[p.packKey];
    const lvl = levelOf(p);
    const snip = snippetOf(p);
    engine.load(snip.code, snip.lang);
    if (titleEl) titleEl.textContent = `${lvl.name} · ${snip.title}`;
    if (fileEl) fileEl.textContent = snip.file;
    if (curEl) curEl.textContent = `${pack.name} · ${snip.title}`;
    appStore.getState().setLang(pack.lang);
    // 현재 위치만 펼쳐 보이게
    openPack = p.packKey;
    openLevel = lvlKey(p.packKey, p.levelNo);
    renderTree();
  }

  function select(packKey: string, levelNo: number, snipIndex: number): void {
    const i = FLAT.findIndex(
      (q) => q.packKey === packKey && q.levelNo === levelNo && q.snipIndex === snipIndex,
    );
    if (i >= 0) cur = i;
    setMenuOpen(false);
    show();
  }

  function step(dir: 1 | -1): void {
    if (FLAT.length === 0) return;
    cur = (cur + dir + FLAT.length) % FLAT.length;
    show();
  }

  menuBtn?.addEventListener('click', (e) => {
    e.stopPropagation();
    setMenuOpen(!menuWrap?.classList.contains('open'));
  });
  document.addEventListener('click', (e) => {
    const target = e.target as Node | null;
    if (menuWrap && target && !menuWrap.contains(target)) setMenuOpen(false);
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') setMenuOpen(false);
  });
  document.getElementById('prevBtn')?.addEventListener('click', () => step(-1));
  document.getElementById('nextBtn')?.addEventListener('click', () => step(1));

  show();
}
