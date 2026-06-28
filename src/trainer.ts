import { initTypingEngine } from './engine/typing';
import { PACKS, type Level, type Snippet, type Pack } from './content';
import { saveSession } from './storage/db';
import { appStore } from './store';

interface Pos {
  packKey: string;
  levelNo: number;
  snipIndex: number;
}

interface TrainerAPI {
  loadProjectPack: (pack: Pack) => void;
  loadBuiltinPack: (packId: string) => void;
  clearProjectPack: () => void;
}

const PROJECT_PACK_KEY = '__project__';
let _projectPack: Pack | null = null;
let _trainerAPI: TrainerAPI | null = null;

export function getTrainerAPI(): TrainerAPI | null {
  return _trainerAPI;
}

// 학습팩 ↔ 엔진. 사이드바 팝업 서브메뉴: 학습팩 → 레벨 → 문제(3단).
// 버튼 클릭 시 팝업이 뜨고, 팩/레벨을 펼쳐 문제를 클릭하면 이동. 이전/다음은 전체를 가로질러 이어짐.
export function initTrainer(): void {
  const titleEl = document.getElementById('practiceTitle');
  const fileEl = document.getElementById('fileTabName');
  const curEl = document.getElementById('packMenuCur');
  const exConceptEl = document.getElementById('explainConcept');
  const exTermsEl = document.getElementById('explainTerms');
  const exTermsWrap = document.getElementById('explainTermsWrap');
  const exWhyEl = document.getElementById('explainWhy');
  const exWhyWrap = document.getElementById('explainWhyWrap');
  const exPitfallEl = document.getElementById('explainPitfall');
  const menuWrap = document.getElementById('packMenu');
  const menuBtn = document.getElementById('packMenuBtn');
  const pop = document.getElementById('packMenuPop');

  const PACK_KEYS = Object.keys(PACKS);

  // 모든 문제를 순서대로 펼친 평면 목록 (이전/다음 네비)
  const FLAT: Pos[] = [];

  function rebuildFlat(): void {
    FLAT.length = 0;
    if (_projectPack) {
      const lvl = _projectPack.levels[0];
      if (lvl) {
        lvl.snippets.forEach((_, i) =>
          FLAT.push({ packKey: PROJECT_PACK_KEY, levelNo: lvl.no, snipIndex: i }),
        );
      }
    }
    for (const packKey of PACK_KEYS) {
      for (const lvl of PACKS[packKey].levels) {
        lvl.snippets.forEach((_, snipIndex) =>
          FLAT.push({ packKey, levelNo: lvl.no, snipIndex }),
        );
      }
    }
  }
  rebuildFlat();

  let cur = 0;

  // 단일 펼침 — 한 번에 팩 하나, 레벨 하나만 펼쳐짐
  let openPack: string | null = null;
  let openLevel: string | null = null; // `${packKey}:${levelNo}`
  const lvlKey = (packKey: string, levelNo: number): string => `${packKey}:${levelNo}`;

  const pos = (): Pos => FLAT.length > 0 ? FLAT[cur] : FLAT[0];
  const levelOf = (p: Pos): Level => {
    if (p.packKey === PROJECT_PACK_KEY && _projectPack) {
      return _projectPack.levels[0] ?? _projectPack.levels[0];
    }
    return (
      PACKS[p.packKey]?.levels.find((l) => l.no === p.levelNo) ??
      PACKS[p.packKey]?.levels[0]
    );
  };
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

    // --- 내장 학습팩 ---
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

  function renderExplain(snip: Snippet): void {
    const ex = snip.explain;
    if (exConceptEl) exConceptEl.textContent = ex?.concept ?? '이 문제의 설명은 준비 중입니다.';
    if (exTermsEl && exTermsWrap) {
      exTermsEl.innerHTML = '';
      const terms = ex?.terms ?? [];
      for (const term of terms) {
        const li = document.createElement('li');
        const t = document.createElement('span');
        t.className = 't';
        t.textContent = term.t;
        const d = document.createElement('span');
        d.className = 'd';
        d.textContent = term.d;
        li.append(t, d);
        exTermsEl.append(li);
      }
      exTermsWrap.style.display = terms.length ? '' : 'none';
    }
    if (exWhyEl && exWhyWrap) {
      exWhyEl.textContent = ex?.why ?? '';
      exWhyWrap.style.display = ex?.why ? '' : 'none';
    }
    if (exPitfallEl) {
      if (ex?.pitfall) {
        exPitfallEl.textContent = '⚠ ' + ex.pitfall;
        exPitfallEl.style.display = '';
      } else {
        exPitfallEl.style.display = 'none';
      }
    }
  }

  function show(): void {
    if (FLAT.length === 0) return;
    const p = pos();
    const pack =
      p.packKey === PROJECT_PACK_KEY && _projectPack ? _projectPack : PACKS[p.packKey];
    const lvl = levelOf(p);
    const snip = snippetOf(p);
    engine.load(snip.code, snip.lang);
    if (titleEl) titleEl.textContent = `${lvl.name} · ${snip.title}`;
    if (fileEl) fileEl.textContent = snip.file;
    if (curEl) curEl.textContent = `${pack.name} · ${snip.title}`;
    renderExplain(snip);
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

  function renderProjectSidebar(): void {
    const acc = document.getElementById('projectAccordion');
    const body = document.getElementById('projectAccBody');
    if (!acc || !body) return;

    if (!_projectPack) {
      acc.style.display = 'none';
      return;
    }

    acc.style.display = '';
    acc.classList.add('open');
    body.innerHTML = '';

    // 제목 업데이트
    const titleEl = document.getElementById('projectAccTitle');
    if (titleEl) titleEl.textContent = _projectPack.name;

    const lvl = _projectPack.levels[0];
    if (!lvl) return;

    const nameRow = document.createElement('div');
    nameRow.className = 'sidebar-item';
    nameRow.style.display = 'flex';
    nameRow.style.justifyContent = 'space-between';
    nameRow.style.alignItems = 'center';
    nameRow.innerHTML =
      `<span><i data-lucide="package" style="color:var(--gold)"></i> ${_projectPack.name} (${lvl.snippets.length}파일)</span>` +
      `<button class="proj-del-btn" title="프로젝트 제거" style="background:none;border:none;cursor:pointer;color:var(--muted);padding:2px">` +
      `<i data-lucide="x" style="width:14px;height:14px"></i></button>`;

    const delBtn = nameRow.querySelector('.proj-del-btn') as HTMLButtonElement;
    if (delBtn) {
      delBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        clearProjectPack();
      });
    }
    body.append(nameRow);

    // 파일별로 그룹화해서 트리처럼 표시
    const fileMap = new Map<string, Snippet[]>();
    for (const snip of lvl.snippets) {
      const f = snip.file;
      if (!fileMap.has(f)) fileMap.set(f, []);
      fileMap.get(f)!.push(snip);
    }

    for (const [file, snips] of fileMap) {
      const folder = file.includes('/') ? file.split('/').slice(0, -1).join('/') + '/' : '';
      const fileName = file.includes('/') ? file.split('/').pop()! : file;

      if (folder) {
        const folderRow = document.createElement('div');
        folderRow.className = 'sidebar-item';
        folderRow.style.paddingLeft = '0.5rem';
        folderRow.style.fontSize = '0.7rem';
        folderRow.style.color = 'var(--muted)';
        folderRow.style.opacity = '0.7';
        folderRow.innerHTML = `<i data-lucide="folder" style="width:12px;height:12px"></i> ${folder}`;
        body.append(folderRow);
      }

      // 파일 버튼 (원본 전체 연습)
      if (snips.length === 1) {
        const btn = document.createElement('button');
        btn.className = 'sidebar-item snip-sidebar-item';
        btn.style.paddingLeft = '1.5rem';
        btn.innerHTML =
          `<i data-lucide="file" style="width:12px;height:12px;color:var(--muted)"></i>` +
          `<span style="font-size:0.75rem;margin-left:4px">${fileName}</span>`;
        btn.addEventListener('click', () => {
          const target = FLAT.findIndex(
            (q) => q.packKey === PROJECT_PACK_KEY && q.snipIndex === lvl.snippets.indexOf(snips[0]),
          );
          if (target >= 0) {
            cur = target;
            setMenuOpen(false);
            show();
          }
        });
        body.append(btn);
      } else {
        // 여러 조각으로 나뉜 파일은 폴더처럼
        for (const snip of snips) {
          const btn = document.createElement('button');
          btn.className = 'sidebar-item snip-sidebar-item';
          btn.style.paddingLeft = '1.5rem';
          btn.innerHTML =
            `<i data-lucide="file-code" style="width:12px;height:12px;color:var(--muted)"></i>` +
            `<span style="font-size:0.7rem;margin-left:4px">${snip.title}</span>`;
          btn.addEventListener('click', () => {
            const target = FLAT.findIndex(
              (q) => q.packKey === PROJECT_PACK_KEY && q.snipIndex === lvl.snippets.indexOf(snip),
            );
            if (target >= 0) {
              cur = target;
              setMenuOpen(false);
              show();
            }
          });
          body.append(btn);
        }
      }
    }
  }

  function loadProjectPack(pack: Pack): void {
    _projectPack = pack;
    appStore.getState().setProjectPack(pack);
    rebuildFlat();
    cur = 0;
    show();
    renderProjectSidebar();
  }

  function loadBuiltinPack(packId: string): void {
    rebuildFlat();
    const idx = FLAT.findIndex((q) => q.packKey === packId);
    if (idx >= 0) cur = idx;
    show();
  }

  function clearProjectPack(): void {
    _projectPack = null;
    appStore.getState().clearProjectPack();
    rebuildFlat();
    if (cur >= FLAT.length) cur = Math.max(0, FLAT.length - 1);
    show();
    renderProjectSidebar();
  }

  // 스토어 구독 — 외부에서 projectPack 변경 시 트레이너에 반영
  appStore.subscribe((state, prev) => {
    if (state.projectPack === prev.projectPack) return;
    _projectPack = state.projectPack;
    rebuildFlat();
    cur = state.projectPack ? 0 : Math.max(0, Math.min(cur, FLAT.length - 1));
    if (FLAT.length > 0) show();
  });

  _trainerAPI = { loadProjectPack, loadBuiltinPack, clearProjectPack };

  show();
}
