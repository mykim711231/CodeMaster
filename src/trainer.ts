import { initTypingEngine } from './engine/typing';
import { PACKS, type Level, type Snippet, type Pack } from './content';
import { saveSession, addWrongAnswer, getWrongAnswers, addTypoPattern, getWeakPatterns, updateTopbar, updatePatternMastery, getPatternMasteries } from './storage/db';
import { initIcons } from './icons';
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

let _patternMasteries: Record<string, number> = {};

async function loadPatternMasteries(): Promise<void> {
  const patterns = await getPatternMasteries();
  _patternMasteries = {};
  for (const p of patterns) {
    _patternMasteries[p.patternId] = p.mastery;
  }
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
      updateTopbar();
      syncBadges();
      if (result.snippetId) {
        void updatePatternMastery(result.snippetId, result.accuracy);
      }
      if (appStore.getState().autoNext && !document.getElementById('nextBtn')?.matches(':disabled')) {
        setTimeout(() => step(1), 500);
      }
      if (result.accuracy < 80 && result.snippetId) {
        void addWrongAnswer(result.snippetId, result.accuracy);
        detectTypoPatterns(result);
      }
    },
  });

  function detectTypoPatterns(result: { inputLines: string[]; targetLines: string[] }): void {
    for (let i = 0; i < result.targetLines.length; i++) {
      const target = result.targetLines[i];
      const input = result.inputLines[i] ?? '';
      const len = Math.min(target.length, input.length);
      for (let j = 0; j < len; j++) {
        if (target[j] !== input[j]) {
          const ctx = target.slice(Math.max(0, j - 3), j + 4);
          void addTypoPattern(ctx, 1);
        }
      }
    }
  }

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
    if (exConceptEl) {
      const concept = ex?.concept ?? '이 문제의 설명은 준비 중입니다.';
      exConceptEl.textContent = concept.replace(/\.\s+(?=[가-힣A-Z@])/g, '.\n');
    }
    // expectedOutput
    const exOutEl = document.getElementById('explainExpectedOutput');
    const exOutWrap = document.getElementById('explainExpectedOutputWrap');
    if (exOutEl && exOutWrap) {
      exOutEl.textContent = ex?.expectedOutput ?? '';
      exOutWrap.style.display = ex?.expectedOutput ? '' : 'none';
    }
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
    // realWorldUsage
    const exRwEl = document.getElementById('explainRealWorld');
    const exRwWrap = document.getElementById('explainRealWorldWrap');
    if (exRwEl && exRwWrap) {
      exRwEl.textContent = ex?.realWorldUsage ?? '';
      exRwWrap.style.display = ex?.realWorldUsage ? '' : 'none';
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

  function updateMetaChips(pack: Pack, isProject: boolean): void {
    const metaWrap = document.getElementById('practiceMeta');
    if (!metaWrap) return;
    if (isProject) {
      metaWrap.innerHTML = '<div class="meta-chip blue"><i data-lucide="folder"></i>내 프로젝트</div>';
    } else if (pack.lang === 'java') {
      metaWrap.innerHTML = `
        <div class="meta-chip blue"><i data-lucide="code-2"></i>Java 21</div>
        <div class="meta-chip green"><i data-lucide="database"></i>JPA</div>
        <div class="meta-chip gold">Spring Boot 3.4</div>
      `;
    } else {
      metaWrap.innerHTML = `
        <div class="meta-chip blue"><i data-lucide="code-2"></i>Python 3.12</div>
        <div class="meta-chip green"><i data-lucide="brain"></i>AI/ML</div>
      `;
    }
    initIcons();
  }

  function saveResumePos(pos: Pos): void {
    try {
      localStorage.setItem('cm-resume', JSON.stringify(pos));
    } catch { /* ignore */ }
  }

  function loadResumePos(): Pos | null {
    try {
      const raw = localStorage.getItem('cm-resume');
      if (!raw) return null;
      const p: Pos = JSON.parse(raw);
      if (p.packKey && typeof p.levelNo === 'number' && typeof p.snipIndex === 'number') return p;
    } catch { /* ignore */ }
    return null;
  }

  function updateResumeCard(_pack: Pack, lvl: Level, snip: Snippet): void {
    const nameEl = document.getElementById('resumeName');
    const pctEl = document.getElementById('resumePct');
    if (nameEl) nameEl.textContent = `${lvl.name} · ${snip.title}`;
    if (pctEl) {
      // 레벨 내 진행률: 현재 스니펫 인덱스 기준
      const total = lvl.snippets.length;
      const idx = pos().snipIndex;
      const pct = total > 0 ? Math.round(((idx + 1) / total) * 100) : 0;
      pctEl.textContent = `${pct}%`;
      const fill = document.querySelector('.resume-fill') as HTMLElement;
      if (fill) fill.style.width = `${pct}%`;
    }
  }

  function syncBadges(): void {
    void getWrongAnswers(50).then((list) => {
      const el = document.getElementById('wrongAnswerBadge');
      if (el) {
        el.textContent = String(list.length);
        el.style.display = list.length > 0 ? '' : 'none';
      }
    });
    void getWeakPatterns(50).then((list) => {
      const el = document.getElementById('weakPatternBadge');
      if (el) {
        el.textContent = String(list.length);
        el.style.display = list.length > 0 ? '' : 'none';
      }
    });
  }

  function show(): void {
    if (FLAT.length === 0) return;
    if (cur >= FLAT.length) cur = 0;
    const p = pos();
    const pack =
      p.packKey === PROJECT_PACK_KEY && _projectPack ? _projectPack : PACKS[p.packKey];
    const lvl = levelOf(p);
    const snip = snippetOf(p);
    engine.load(snip.code, snip.lang, snip.id);
    if (titleEl) titleEl.textContent = `${lvl.name} · ${snip.title}`;
    if (fileEl) fileEl.textContent = snip.file;
    if (curEl) curEl.textContent = `${pack.name} · ${snip.title}`;
    renderExplain(snip);
    updateMetaChips(pack, p.packKey === PROJECT_PACK_KEY);
    appStore.getState().setLang(pack.lang);
    openPack = p.packKey;
    openLevel = lvlKey(p.packKey, p.levelNo);
    renderTree();
    if (p.packKey === PROJECT_PACK_KEY) renderProjectSidebar();
    saveResumePos(p);
    updateResumeCard(pack, lvl, snip);
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

  document.getElementById('wrongAnswerBtn')?.addEventListener('click', async () => {
    const wrong = await getWrongAnswers(20);
    if (wrong.length === 0) {
      void alert('오답 큐가 비었습니다.');
      return;
    }
    const ids = new Set(wrong.map((w) => w.id));
    const indices: number[] = [];
    FLAT.forEach((p, i) => { if (ids.has(snippetOf(p).id)) indices.push(i); });
    if (indices.length === 0) {
      void alert('오답 스니펫을 찾을 수 없습니다.');
      return;
    }
    cur = indices[0];
    show();
  });

  document.getElementById('weakPatternBtn')?.addEventListener('click', async () => {
    const patterns = await getWeakPatterns(5);
    if (patterns.length === 0) {
      void alert('아직 취약 패턴이 수집되지 않았습니다. 타이핑 연습을 더 진행하세요.');
      return;
    }
    const lines = patterns.map((p) => `"${p.pattern}" · ${p.count}회`);
    void alert(`취약 패턴 목록:\n${lines.join('\n')}`);
  });

  document.getElementById('randomQuizBtn')?.addEventListener('click', () => {
    if (FLAT.length === 0) return;
    cur = Math.floor(Math.random() * FLAT.length);
    show();
  });

  function inferCategory(snip: Snippet): string {
    const key = (snip.title + snip.file).toLowerCase();
    if (key.includes('entity') || key.includes('model')) return 'entity';
    if (key.includes('controller') || key.includes('resource')) return 'controller';
    if (key.includes('service')) return 'service';
    if (key.includes('repository') || key.includes('dao') || key.includes('mapper')) return 'repository';
    if (key.includes('config') || key.includes('property')) return 'config';
    if (key.includes('util') || key.includes('helper')) return 'util';
    return 'general';
  }

  const categoryListEl = document.getElementById('categoryList');

  document.getElementById('categoryLearnBtn')?.addEventListener('click', () => {
    if (!categoryListEl) return;
    const visible = categoryListEl.style.display !== 'none';
    if (visible) {
      categoryListEl.style.display = 'none';
      return;
    }

    const p = pos();
    const pack = p.packKey === PROJECT_PACK_KEY && _projectPack ? _projectPack : PACKS[p.packKey];
    if (!pack) return;

    const groups: Record<string, { index: number; snip: Snippet }[]> = {};

    for (const lvl of pack.levels) {
      for (let i = 0; i < lvl.snippets.length; i++) {
        const snip = lvl.snippets[i];
        const cat = inferCategory(snip);
        if (!groups[cat]) groups[cat] = [];
        groups[cat].push({ index: i, snip });
      }
    }

    const allSnips: { packKey: string; levelNo: number; snipIndex: number; cat: string }[] = [];
    for (const lvl of pack.levels) {
      for (let i = 0; i < lvl.snippets.length; i++) {
        const snip = lvl.snippets[i];
        allSnips.push({ packKey: p.packKey, levelNo: lvl.no, snipIndex: i, cat: inferCategory(snip) });
      }
    }

    const entries = Object.entries(groups).sort((a, b) => b[1].length - a[1].length);

    categoryListEl.innerHTML = '';
    for (const [cat, snips] of entries) {
      const btn = document.createElement('button');
      btn.className = 'sidebar-item';
      btn.style.paddingLeft = '20px';
      btn.style.fontSize = '0.73rem';
      btn.innerHTML = `<span>${cat}</span><span class="badge">${snips.length}</span>`;
      btn.addEventListener('click', () => {
        const first = allSnips.find((s) => s.cat === cat);
        if (first) select(first.packKey, first.levelNo, first.snipIndex);
      });
      categoryListEl.append(btn);
    }
    categoryListEl.style.display = '';
  });

  document.querySelector('.resume-btn')?.addEventListener('click', () => {
    if (FLAT.length === 0) return;
    const saved = loadResumePos();
    if (!saved) return;
    const i = FLAT.findIndex(
      (q) => q.packKey === saved.packKey && q.levelNo === saved.levelNo && q.snipIndex === saved.snipIndex,
    );
    if (i >= 0) { cur = i; show(); }
  });

  function initResumeCard(): void {
    const saved = loadResumePos();
    const nameEl = document.getElementById('resumeName');
    const pctEl = document.getElementById('resumePct');
    const btn = document.querySelector('.resume-btn') as HTMLElement | null;

    if (!saved) {
      if (nameEl) nameEl.textContent = '연습을 시작하면 이어서 할 수 있어요';
      if (pctEl) pctEl.textContent = '0%';
      if (btn) btn.style.opacity = '0.5';
      return;
    }
    const pack = saved.packKey === PROJECT_PACK_KEY && _projectPack
      ? _projectPack : PACKS[saved.packKey];
    if (!pack) return;
    const lvl = pack.levels.find((l) => l.no === saved.levelNo);
    if (!lvl || saved.snipIndex >= lvl.snippets.length) return;
    const snip = lvl.snippets[saved.snipIndex];
    if (btn) btn.style.opacity = '1';
    updateResumeCard(pack, lvl, snip);
  }

  initResumeCard();

  function renderProjectSidebar(): void {
    const acc = document.getElementById('projectAccordion');
    const body = document.getElementById('projectAccBody');
    if (!acc || !body) return;

    if (!_projectPack) {
      acc.style.display = 'none';
      return;
    }

    const lvl = _projectPack.levels[0];
    if (!lvl) return;

    acc.style.display = '';
    acc.classList.add('open');
    body.innerHTML = '';

    const titleEl = document.getElementById('projectAccTitle');
    if (titleEl) titleEl.textContent = _projectPack.name;

    const nameRow = document.createElement('div');
    nameRow.className = 'sidebar-item';
    nameRow.style.display = 'flex';
    nameRow.style.justifyContent = 'space-between';
    nameRow.style.alignItems = 'center';
    nameRow.innerHTML =
      `<span><i data-lucide="package" style="color:var(--gold)"></i> ${_projectPack.name} (${lvl.snippets.length}파일)</span>` +
      `<span style="display:flex;gap:2px">` +
      `<button class="tree-expand-btn" title="모두 펼침" style="background:none;border:none;cursor:pointer;font-size:.7rem;padding:0 2px">&plus;</button>` +
      `<button class="tree-collapse-btn" title="모두 접기" style="background:none;border:none;cursor:pointer;font-size:.7rem;padding:0 2px">&minus;</button>` +
      `<button class="proj-del-btn" title="프로젝트 제거" style="background:none;border:none;cursor:pointer;color:var(--muted);font-size:1rem;padding:0 4px">&times;</button>` +
      `</span>`;

    const delBtn = nameRow.querySelector('.proj-del-btn') as HTMLButtonElement;
    if (delBtn) delBtn.addEventListener('click', (e) => { e.stopPropagation(); clearProjectPack(); });

    nameRow.querySelector('.tree-expand-btn')?.addEventListener('click', (e) => {
      e.stopPropagation();
      body.querySelectorAll('.tree-sub').forEach((d) => { (d as HTMLElement).style.display = 'block'; });
      body.querySelectorAll('.tree-folder').forEach((b) => {
        if (b.textContent?.startsWith('▸')) b.textContent = b.textContent.replace('▸', '▾');
      });
    });
    nameRow.querySelector('.tree-collapse-btn')?.addEventListener('click', (e) => {
      e.stopPropagation();
      body.querySelectorAll('.tree-sub').forEach((d) => { (d as HTMLElement).style.display = 'none'; });
      body.querySelectorAll('.tree-folder').forEach((b) => {
        if (b.textContent?.startsWith('▾')) b.textContent = b.textContent.replace('▾', '▸');
      });
    });
    body.append(nameRow);

    // --- 폴더 트리 빌드 ---
    interface TNode {
      name: string;
      children: Map<string, TNode>;
      snippets: { snip: Snippet; index: number }[];
    }
    const root: TNode = { name: '', children: new Map(), snippets: [] };

    for (let i = 0; i < lvl.snippets.length; i++) {
      const snip = lvl.snippets[i];
      const parts = snip.title.split('/');
      let node = root;
      for (let j = 0; j < parts.length - 1; j++) {
        const p = parts[j];
        if (!node.children.has(p)) node.children.set(p, { name: p, children: new Map(), snippets: [] });
        node = node.children.get(p)!;
      }
      node.snippets.push({ snip, index: i });
    }

    function renderTree(node: TNode, depth: number, container: HTMLElement): void {
      // 현재 활성 파일 인덱스
      const activeSnipIdx = FLAT.length > 0 && FLAT[cur]?.packKey === PROJECT_PACK_KEY
        ? FLAT[cur].snipIndex : -1;

      // 파일 목록
      for (const { snip, index } of node.snippets) {
        const name = snip.title.split('/').pop()!;
        const active = index === activeSnipIdx;
        const icon = name.endsWith('.java') ? '☕' : name.endsWith('.py') ? '🐍' :
                     name.endsWith('.xml') ? '📄' : name.endsWith('.yml') ? '⚙' :
                     name.endsWith('.sql') ? '🗄' : '📋';
        const row = document.createElement('button');
        row.className = 'sidebar-item snip-sidebar-item' + (active ? ' active' : '');
        row.style.paddingLeft = `${depth * 10 + 8}px`;
        row.style.fontSize = '0.72rem';
        row.textContent = `${icon} ${name}`;
        if (active) {
          row.style.background = 'var(--bg3)';
          row.style.borderLeft = '2px solid var(--accent, #3b82f6)';
        }
        row.addEventListener('click', () => {
          const target = FLAT.findIndex((q) => q.packKey === PROJECT_PACK_KEY && q.snipIndex === index);
          if (target >= 0) { cur = target; setMenuOpen(false); show(); }
        });
        container.append(row);
        if (active) {
          setTimeout(() => row.scrollIntoView({ block: 'nearest' }), 50);
        }
      }
      // 폴더 — 항상 열린 상태
      for (const [, child] of node.children) {
        const wrap = document.createElement('div');
        const toggle = document.createElement('button');
        toggle.className = 'sidebar-item tree-folder';
        toggle.style.paddingLeft = `${depth * 10 + 4}px`;
        toggle.style.fontSize = '0.73rem';
        toggle.style.fontWeight = '600';
        toggle.style.display = 'block';
        toggle.style.width = '100%';
        toggle.style.textAlign = 'left';
        toggle.style.background = 'none';
        toggle.style.border = 'none';
        toggle.style.cursor = 'pointer';
        toggle.style.color = 'var(--fg)';
        const sub = document.createElement('div');
        sub.className = 'tree-sub';
        sub.style.display = 'block';
        renderTree(child, depth + 1, sub);
        toggle.textContent = '▾ ' + child.name;
        toggle.addEventListener('click', () => {
          const open = sub.style.display !== 'none';
          sub.style.display = open ? 'none' : 'block';
          toggle.textContent = (open ? '▸ ' : '▾ ') + child.name;
        });
        wrap.append(toggle, sub);
        container.append(wrap);
      }
    }

    renderTree(root, 0, body);
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

  void loadPatternMasteries().then(() => {
    show();
    syncBadges();
  });
}
