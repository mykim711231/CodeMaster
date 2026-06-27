import { getAdapter, type TokenType } from '../syntax/registry';

const SYN_VAR: Record<TokenType, string> = {
  kw: 'var(--syn-kw)',
  fn: 'var(--syn-fn)',
  str: 'var(--syn-str)',
  ann: 'var(--syn-ann)',
  tp: 'var(--syn-tp)',
  num: 'var(--syn-num)',
  op: 'var(--syn-op)',
  cm: 'var(--syn-cm)',
  id: 'var(--typed)',
};

const DEFAULT_TARGET = [
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
  '}',
].join('\n');

export interface TypingOptions {
  /** 구문 강조 언어 (registerLanguage 로 등록된 키) */
  lang: string;
  /** 따라칠 목표 코드 (미지정 시 기본 JPA 예시) */
  target?: string;
}

export function initTypingEngine(opts: TypingOptions): void {
  const TARGET = opts.target ?? DEFAULT_TARGET;

  const render = document.getElementById('ttRender');
  const input = document.getElementById('ttInput') as HTMLTextAreaElement | null;
  const gutter = document.getElementById('ttGutter');
  const wrap = document.getElementById('ttWrap');
  if (!render || !input || !gutter || !wrap) return;

  const wpmVal = document.getElementById('wpmVal');
  const accVal = document.getElementById('accVal');
  const progPct = document.getElementById('progPct');
  const progFill = document.getElementById('progFill');

  // 줄번호
  const LINES = TARGET.split('\n');
  gutter.innerHTML = '';
  for (let i = 1; i <= LINES.length; i++) {
    const d = document.createElement('div');
    d.textContent = String(i);
    gutter.appendChild(d);
  }
  const gutterLines = gutter.children;

  // 구문 토큰화 → 글자별 토큰 클래스 (정타 시 색 적용)
  const adapter = getAdapter(opts.lang);
  const SYN: (TokenType | null)[] = adapter
    ? adapter(TARGET)
    : new Array<TokenType | null>(TARGET.length).fill(null);

  // 글자별 span
  render.innerHTML = '';
  const spans: HTMLSpanElement[] = [];
  for (let i = 0; i < TARGET.length; i++) {
    const s = document.createElement('span');
    s.textContent = TARGET[i];
    render.appendChild(s);
    spans.push(s);
  }

  let startTime: number | null = null;

  function lineOfIndex(idx: number): number {
    let line = 0;
    for (let i = 0; i < idx && i < TARGET.length; i++) {
      if (TARGET[i] === '\n') line++;
    }
    return line;
  }

  function update(): void {
    const val = input!.value;
    if (val.length && startTime === null) startTime = Date.now();

    // 캐럿(현재 위치) = 실제 커서 → 화살표·클릭으로 되돌아가 수정 가능
    const caret = input!.selectionStart ?? 0;

    let correct = 0;
    for (let i = 0; i < spans.length; i++) {
      const s = spans[i];
      s.className = '';
      const tc = TARGET[i];
      if (i < val.length) {
        const v = val[i];
        const glyph = tc === '\n' ? '\n' : v === '\n' ? tc : v;
        if (s.textContent !== glyph) s.textContent = glyph;
        const t = SYN[i];
        s.style.color = t ? SYN_VAR[t] : 'var(--typed)';
        if (v === tc) {
          s.classList.add('ok');
          correct++;
        } else if (v.toLowerCase() === tc.toLowerCase()) {
          s.classList.add('case'); // 대소문자만 틀림 → 황색 물결
        } else {
          s.classList.add('bad'); // 완전 오타 → 빨강 물결
        }
      } else {
        if (s.textContent !== tc) s.textContent = tc; // 미입력 → 고스트
        s.style.color = '';
      }
      if (i === caret) s.classList.add('cur');
    }

    // 현재 줄 강조
    const curLine = lineOfIndex(caret);
    for (let i = 0; i < gutterLines.length; i++) {
      gutterLines[i].classList.toggle('cur', i === curLine);
    }

    // 통계
    const pct = Math.round((val.length / TARGET.length) * 100);
    const acc = val.length ? Math.round((correct / val.length) * 100) : 100;
    if (progPct) progPct.textContent = pct + '%';
    if (progFill) progFill.style.width = pct + '%';
    if (accVal) accVal.textContent = acc + '%';
    if (wpmVal) {
      let wpm = 0;
      if (startTime !== null) {
        const min = (Date.now() - startTime) / 60000;
        if (min > 0) wpm = Math.round(correct / 5 / min);
      }
      wpmVal.textContent = String(wpm);
    }

    // 스크롤 동기화
    render!.scrollLeft = input!.scrollLeft;
    render!.scrollTop = input!.scrollTop;
  }

  function reset(): void {
    input!.value = '';
    startTime = null;
    update();
    input!.focus();
  }

  input.addEventListener('input', update);
  (['keyup', 'click', 'select', 'focus'] as const).forEach((ev) =>
    input.addEventListener(ev, update),
  );
  document.addEventListener('selectionchange', () => {
    if (document.activeElement === input) update();
  });
  input.addEventListener('scroll', () => {
    render.scrollLeft = input.scrollLeft;
    render.scrollTop = input.scrollTop;
  });

  input.addEventListener('keydown', (e: KeyboardEvent) => {
    // Tab → 4칸 들여쓰기
    if (e.key === 'Tab') {
      e.preventDefault();
      const s = input.selectionStart ?? 0;
      const en = input.selectionEnd ?? 0;
      input.value = input.value.slice(0, s) + '    ' + input.value.slice(en);
      input.selectionStart = input.selectionEnd = s + 4;
      update();
      return;
    }
    // Enter → 자동 들여쓰기 (끝에서 줄바꿈 시 다음 줄 들여쓰기 채움)
    if (e.key === 'Enter') {
      const s = input.selectionStart ?? 0;
      const en = input.selectionEnd ?? 0;
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
    // 중간 입력은 '삽입'이 아닌 '덮어쓰기' → 뒤 글자 밀림으로 오타 표시되는 현상 방지
    if (e.key.length === 1 && !e.ctrlKey && !e.metaKey && !e.altKey) {
      const s = input.selectionStart ?? 0;
      const en = input.selectionEnd ?? 0;
      if (s === en && s < input.value.length) {
        e.preventDefault();
        input.value = input.value.slice(0, s) + e.key + input.value.slice(s + 1);
        input.selectionStart = input.selectionEnd = s + 1;
        update();
      }
    }
  });

  wrap.addEventListener('click', () => input.focus());
  for (const id of ['focusBtn', 'continueBtn']) {
    document.getElementById(id)?.addEventListener('click', () => input.focus());
  }
  for (const id of ['restartBtn', 'restartBtn2']) {
    document.getElementById(id)?.addEventListener('click', reset);
  }

  update();
}
