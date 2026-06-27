// @ts-nocheck
// 전환기 임시 — 레거시 엔진을 그대로 이식. 단계적으로 타입을 붙이며 @ts-nocheck 제거.

// 폰트 self-host (@fontsource — 외부 CDN 제거)
import '@fontsource/inter/300.css';
import '@fontsource/inter/400.css';
import '@fontsource/inter/500.css';
import '@fontsource/inter/600.css';
import '@fontsource/inter/700.css';
import '@fontsource/jetbrains-mono/300.css';
import '@fontsource/jetbrains-mono/400.css';
import '@fontsource/jetbrains-mono/500.css';
import '@fontsource/jetbrains-mono/600.css';
import '@fontsource/jetbrains-mono/700.css';

import './styles.css';

// 아이콘 — 사용분만 가져와 트리셰이킹
import {
  createIcons,
  Menu,
  Search,
  Keyboard,
  FolderOpen,
  BookOpen,
  Settings,
  PanelLeft,
  Terminal,
  Flame,
  Zap,
  Sun,
  Moon,
  PanelRight,
  Coffee,
  Brain,
  Play,
  Map as MapIcon,
  ChevronDown,
  CheckCircle2,
  PlayCircle,
  Lock,
  Repeat2,
  Target,
  Shuffle,
  Folder,
  Plus,
  MousePointerClick,
  Code2,
  Database,
  RotateCcw,
  SkipForward,
  PieChart,
  AlertTriangle,
} from 'lucide';

createIcons({
  icons: {
    Menu,
    Search,
    Keyboard,
    FolderOpen,
    BookOpen,
    Settings,
    PanelLeft,
    Terminal,
    Flame,
    Zap,
    Sun,
    Moon,
    PanelRight,
    Coffee,
    Brain,
    Play,
    Map: MapIcon,
    ChevronDown,
    CheckCircle2,
    PlayCircle,
    Lock,
    Repeat2,
    Target,
    Shuffle,
    Folder,
    Plus,
    MousePointerClick,
    Code2,
    Database,
    RotateCcw,
    SkipForward,
    PieChart,
    AlertTriangle,
  },
});


/* ── 라이트/다크 테마 토글 ── */
  (function () {
    const root = document.documentElement;
    const btn  = document.getElementById('themeToggle');
    let theme = 'dark';
    try { theme = localStorage.getItem('cm-theme') || 'dark'; } catch (e) {}
    function apply(t) {
      if (t === 'light') root.setAttribute('data-theme', 'light');
      else root.removeAttribute('data-theme');
    }
    apply(theme);
    if (btn) {
      btn.addEventListener('click', () => {
        theme = (root.getAttribute('data-theme') === 'light') ? 'dark' : 'light';
        apply(theme);
        try { localStorage.setItem('cm-theme', theme); } catch (e) {}
      });
    }
  })();

  /* ── 패널 토글 (데스크톱=접기 / 모바일=드로어) ── */
  (function () {
    const app           = document.querySelector('.app');
    const sidebarToggle = document.getElementById('sidebarToggle'); // 왼쪽 패널
    const panelToggle   = document.getElementById('panelToggle');   // 오른쪽 패널
    const sidebar       = document.querySelector('.sidebar');
    const overlay       = document.getElementById('overlay');

    const isMobile = () => window.innerWidth <= 1024;

    function syncButtons() {
      // 버튼 활성 표시: 모바일=열림 상태, 데스크톱=펼쳐진(접히지 않은) 상태
      const leftActive  = isMobile() ? app.classList.contains('left-open')
                                     : !app.classList.contains('left-collapsed');
      const rightActive = isMobile() ? app.classList.contains('right-open')
                                     : !app.classList.contains('right-collapsed');
      sidebarToggle.classList.toggle('active', leftActive);
      panelToggle.classList.toggle('active', rightActive);
    }

    function toggleLeft() {
      if (isMobile()) {
        const open = !app.classList.contains('left-open');
        app.classList.remove('left-open', 'right-open');   // 한 번에 하나만
        if (open) app.classList.add('left-open');
      } else {
        app.classList.toggle('left-collapsed');            // 데스크톱: 접기
      }
      syncButtons();
    }

    function toggleRight() {
      if (isMobile()) {
        const open = !app.classList.contains('right-open');
        app.classList.remove('left-open', 'right-open');
        if (open) app.classList.add('right-open');
      } else {
        app.classList.toggle('right-collapsed');
      }
      syncButtons();
    }

    function closeDrawers() {
      app.classList.remove('left-open', 'right-open');
      syncButtons();
    }

    sidebarToggle.addEventListener('click', toggleLeft);
    panelToggle.addEventListener('click', toggleRight);
    overlay.addEventListener('click', closeDrawers);

    // 드로어 안에서 항목 선택 시 자동 닫기 (모바일) — 팩 토글 제외
    sidebar.addEventListener('click', (e) => {
      if (isMobile() && e.target.closest('.sidebar-item, .lvl-item:not(.locked), .resume-btn')) closeDrawers();
    });

    // 브레이크포인트 넘나들 때 상태 초기화
    let wasMobile = isMobile();
    window.addEventListener('resize', () => {
      const now = isMobile();
      if (now !== wasMobile) {
        app.classList.remove('left-open', 'right-open', 'left-collapsed', 'right-collapsed');
        wasMobile = now;
      }
      syncButtons();
    });

    syncButtons();
  })();

  /* ── 버거 메뉴 드롭다운 ── */
  (function () {
    const menuWrap   = document.querySelector('.menu-wrap');
    const menuToggle = document.getElementById('menuToggle');
    if (!menuWrap || !menuToggle) return;

    function setOpen(open) {
      menuWrap.classList.toggle('open', open);
      menuToggle.classList.toggle('active', open);
    }

    menuToggle.addEventListener('click', (e) => {
      e.stopPropagation();
      setOpen(!menuWrap.classList.contains('open'));
    });
    // 메뉴 항목 클릭 시 닫기
    menuWrap.querySelectorAll('.menu-link').forEach((link) => {
      link.addEventListener('click', () => setOpen(false));
    });
    // 바깥 클릭 / ESC 로 닫기
    document.addEventListener('click', (e) => {
      if (!menuWrap.contains(e.target)) setOpen(false);
    });
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') setOpen(false);
    });
  })();

  /* ── 사이드바 아코디언 ── */
  (function () {
    document.querySelectorAll('.acc-header').forEach((header) => {
      header.addEventListener('click', () => {
        header.closest('.accordion').classList.toggle('open');
      });
    });

    /* 학습팩 세그먼트 토글 → 로드맵 제목 갱신 */
    const packSeg      = document.getElementById('packSeg');
    const roadmapTitle = document.getElementById('roadmapTitle');
    if (packSeg) {
      packSeg.querySelectorAll('.pack-seg-btn').forEach((btn) => {
        btn.addEventListener('click', () => {
          packSeg.querySelectorAll('.pack-seg-btn').forEach((b) => {
            const on = b === btn;
            b.classList.toggle('active', on);
            b.setAttribute('aria-selected', on ? 'true' : 'false');
          });
          if (roadmapTitle) {
            const label = btn.dataset.pack === 'python' ? 'Python AI' : 'Spring Boot';
            roadmapTitle.textContent = label + ' 로드맵';
          }
        });
      });
    }
  })();

  /* ── Service Worker 등록 (오프라인 PWA) ── */
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('./sw.js').catch(() => {});
    });
  }

  /* ── 따라치기 트레이너 엔진 ── */
  (function () {
    const TARGET = [
      '@Entity',
      '@Table(name = "users")',
      'public class UserEntity implements Serializable {',
      '',
      '    @Id',
      '    @GeneratedValue(strategy = GenerationType.IDENTITY)',
      '    private Long id;',
      '',
      '    @Column(nullable = false, unique = true)',
      '    private String username;',
      '}'
    ].join('\n');

    const render = document.getElementById('ttRender');
    const input  = document.getElementById('ttInput');
    const gutter = document.getElementById('ttGutter');
    const wrap   = document.getElementById('ttWrap');
    if (!render || !input) return;

    const wpmVal  = document.getElementById('wpmVal');
    const accVal  = document.getElementById('accVal');
    const progPct = document.getElementById('progPct');
    const progFill= document.getElementById('progFill');

    // 줄번호
    const lineCount = TARGET.split('\n').length;
    gutter.innerHTML = '';
    for (let i = 1; i <= lineCount; i++) {
      const d = document.createElement('div');
      d.textContent = i;
      gutter.appendChild(d);
    }
    const gutterLines = gutter.children;

    // 문법 토큰화 → 글자별 문법 클래스 배열 (정타 시 색 적용)
    const SYN = (function () {
      const KW = new Set(['public','private','protected','class','interface','enum','record',
        'implements','extends','static','final','abstract','void','return','new','true','false',
        'null','this','super','package','import','if','else','for','while','do','switch','case',
        'break','continue','try','catch','finally','throw','throws','synchronized','volatile',
        'transient','native','int','long','boolean','double','float','char','byte','short']);
      const cls = new Array(TARGET.length).fill(null);
      const re = /(\/\/[^\n]*)|("(?:[^"\\]|\\.)*")|(@\w+)|(\d+(?:\.\d+)?)|([A-Za-z_$][\w$]*)|([{}()\[\];,.=+\-*/<>!&|:?%])/g;
      let m;
      while ((m = re.exec(TARGET))) {
        const t = m[0]; let c = null;
        if (m[1]) c = 'cm';
        else if (m[2]) c = 'str';
        else if (m[3]) c = 'ann';
        else if (m[4]) c = 'num';
        else if (m[5]) c = KW.has(t) ? 'kw' : (/^[A-Z]/.test(t) ? 'tp' : 'id');
        else if (m[6]) c = 'op';
        for (let k = 0; k < t.length; k++) cls[m.index + k] = c;
      }
      return cls;
    })();
    const SYN_VAR = {
      kw:'var(--syn-kw)', fn:'var(--syn-fn)', str:'var(--syn-str)', ann:'var(--syn-ann)',
      tp:'var(--syn-tp)', num:'var(--syn-num)', op:'var(--syn-op)', cm:'var(--syn-cm)'
    };

    // 글자별 span
    render.innerHTML = '';
    const spans = [];
    for (let i = 0; i < TARGET.length; i++) {
      const s = document.createElement('span');
      s.textContent = TARGET[i];
      render.appendChild(s);
      spans.push(s);
    }

    let startTime = null;

    function lineOfIndex(idx) {
      let line = 0;
      for (let i = 0; i < idx && i < TARGET.length; i++) {
        if (TARGET[i] === '\n') line++;
      }
      return line;
    }

    function update() {
      const val = input.value;
      if (val.length && !startTime) startTime = Date.now();

      // 캐럿(현재 위치)은 실제 커서 위치 기준 → 화살표·클릭으로 되돌아가 수정 가능
      const caret = input.selectionStart;

      let correct = 0;
      for (let i = 0; i < spans.length; i++) {
        const s = spans[i];
        s.className = '';
        const tc = TARGET[i];
        if (i < val.length) {
          // 실제 입력한 글자를 표시 (개행 위치는 구조 유지 → 레이아웃 안정)
          const v = val[i];
          const glyph = (tc === '\n') ? '\n' : (v === '\n' ? tc : v);
          if (s.textContent !== glyph) s.textContent = glyph;
          // 입력된 글자 → 문법색으로 "살아남" (식별자/공백은 기본 정타색)
          s.style.color = SYN_VAR[SYN[i]] || 'var(--typed)';
          if (v === tc) {
            s.classList.add('ok'); correct++;            // 완전 일치 (대소문자 포함)
          } else if (v.toLowerCase() === tc.toLowerCase()) {
            s.classList.add('case');                     // 대소문자만 틀림 → 황색 물결
          } else {
            s.classList.add('bad');                      // 완전 오타 → 빨강 물결
          }
        } else {
          if (s.textContent !== tc) s.textContent = tc;  // 미입력 → 고스트(모델 글자)
          s.style.color = '';                            // 고스트(CSS 기본)
        }
        if (i === caret) s.classList.add('cur');         // 실제 캐럿 위치 표시
      }

      // 현재 줄 강조
      const curLine = lineOfIndex(caret);
      for (let i = 0; i < gutterLines.length; i++) {
        gutterLines[i].classList.toggle('cur', i === curLine);
      }

      // 통계 (입력 글자 수 = val.length)
      const pct = Math.round(val.length / TARGET.length * 100);
      const acc = val.length ? Math.round(correct / val.length * 100) : 100;
      if (progPct)  progPct.textContent = pct + '%';
      if (progFill) progFill.style.width = pct + '%';
      if (accVal)   accVal.textContent = acc + '%';
      if (wpmVal) {
        let wpm = 0;
        if (startTime) {
          const min = (Date.now() - startTime) / 60000;
          if (min > 0) wpm = Math.round((correct / 5) / min);
        }
        wpmVal.textContent = wpm;
      }

      // 가로/세로 스크롤 동기화
      render.scrollLeft = input.scrollLeft;
      render.scrollTop  = input.scrollTop;
    }

    function reset() {
      input.value = '';
      startTime = null;
      update();
      input.focus();
    }

    input.addEventListener('input', update);
    // 캐럿 이동(화살표·클릭·선택)에도 현재 위치 갱신 → 이전 줄로 돌아가 수정 가능
    ['keyup', 'click', 'select', 'focus'].forEach((ev) => input.addEventListener(ev, update));
    document.addEventListener('selectionchange', () => {
      if (document.activeElement === input) update();
    });
    input.addEventListener('scroll', () => {
      render.scrollLeft = input.scrollLeft;
      render.scrollTop  = input.scrollTop;
    });
    const LINES = TARGET.split('\n');

    input.addEventListener('keydown', (e) => {
      // Tab → 4칸 들여쓰기
      if (e.key === 'Tab') {
        e.preventDefault();
        const s = input.selectionStart, en = input.selectionEnd;
        input.value = input.value.slice(0, s) + '    ' + input.value.slice(en);
        input.selectionStart = input.selectionEnd = s + 4;
        update();
        return;
      }
      // Enter → 자동 들여쓰기 (끝에서 줄바꿈 시 다음 줄 들여쓰기 자동 채움)
      if (e.key === 'Enter') {
        const s = input.selectionStart, en = input.selectionEnd;
        if (s === en && s === input.value.length) {
          e.preventDefault();
          const typedNewlines = (input.value.match(/\n/g) || []).length;
          const nextLine = LINES[typedNewlines + 1] || '';
          const indent = (nextLine.match(/^[ \t]*/) || [''])[0];
          input.value += '\n' + indent;
          input.selectionStart = input.selectionEnd = input.value.length;
          update();
        }
        return;
      }
      // 중간에서 글자 입력 시 '삽입'이 아닌 '덮어쓰기' → 뒤 글자가 밀려 오류로 표시되는 현상 방지
      if (e.key.length === 1 && !e.ctrlKey && !e.metaKey && !e.altKey) {
        const s = input.selectionStart, en = input.selectionEnd;
        if (s === en && s < input.value.length) {   // 선택 없음 + 끝이 아님 → 덮어쓰기
          e.preventDefault();
          input.value = input.value.slice(0, s) + e.key + input.value.slice(s + 1);
          input.selectionStart = input.selectionEnd = s + 1;
          update();
        }
      }
    });

    wrap.addEventListener('click', () => input.focus());
    const focusBtn   = document.getElementById('focusBtn');
    const continueBtn= document.getElementById('continueBtn');
    [focusBtn, continueBtn].forEach((b) => b && b.addEventListener('click', () => input.focus()));
    ['restartBtn', 'restartBtn2'].forEach((id) => {
      const b = document.getElementById(id);
      if (b) b.addEventListener('click', reset);
    });

    update();
  })();
