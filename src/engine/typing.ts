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

export interface CompletionResult {
  lang: string;
  wpm: number;
  accuracy: number;
  chars: number;
  correct: number;
  durationMs: number;
}

export interface TypingOptions {
  /** 모든 위치를 입력 완료했을 때 1회 호출 */
  onComplete?: (result: CompletionResult) => void;
}

export interface TypingController {
  /** 새 스니펫 로드 (코드 + 구문강조 언어) */
  load(code: string, lang: string): void;
}

/**
 * 라인 단위 타이핑 트레이너.
 * 각 줄이 독립 textarea → 중간 수정이 다른 줄에 영향 없음(연쇄 오타 방지),
 * 클릭·방향키로 줄 사이 자유 이동. load()로 스니펫 교체.
 */
export function initTypingEngine(opts: TypingOptions = {}): TypingController {
  const wrap = document.getElementById('ttWrap');
  if (!wrap) return { load: () => {} };

  const wpmVal = document.getElementById('wpmVal');
  const accVal = document.getElementById('accVal');
  const progPct = document.getElementById('progPct');
  const progFill = document.getElementById('progFill');

  // 스니펫마다 갱신되는 상태
  let LINES: string[] = [];
  let totalChars = 0;
  let curLang = 'java';
  let inputs: HTMLTextAreaElement[] = [];
  let spansByLine: HTMLSpanElement[][] = [];
  let synByLine: (TokenType | null)[][] = [];
  let startTime: number | null = null;
  let completed = false;

  function setActive(li: number): void {
    const rows = wrap!.children;
    for (let i = 0; i < rows.length; i++) rows[i].classList.toggle('active', i === li);
  }

  function focusLine(li: number, col: number): void {
    if (li < 0 || li >= inputs.length) return;
    const input = inputs[li];
    input.focus();
    const pos = Math.min(col, input.value.length);
    input.selectionStart = input.selectionEnd = pos;
    setActive(li);
  }

  function onInput(li: number): void {
    if (startTime === null) startTime = Date.now();
    renderLine(li);
    updateStats();
  }

  function renderLine(li: number): void {
    const val = inputs[li].value;
    const target = LINES[li];
    const spans = spansByLine[li];
    const syn = synByLine[li];
    for (let i = 0; i < spans.length; i++) {
      const s = spans[i];
      s.className = '';
      const tc = target[i];
      if (i < val.length) {
        const v = val[i];
        if (s.textContent !== v) s.textContent = v;
        const t = syn[i];
        s.style.color = t ? SYN_VAR[t] : 'var(--typed)';
        if (v === tc) s.classList.add('ok');
        else if (v.toLowerCase() === tc.toLowerCase()) s.classList.add('case');
        else s.classList.add('bad');
      } else {
        if (s.textContent !== tc) s.textContent = tc;
        s.style.color = '';
      }
    }
  }

  function updateStats(): void {
    let typed = 0;
    let attempts = 0;
    let correct = 0;
    for (let li = 0; li < LINES.length; li++) {
      const val = inputs[li].value;
      const target = LINES[li];
      attempts += val.length;
      const cap = Math.min(val.length, target.length);
      typed += cap;
      for (let i = 0; i < cap; i++) if (val[i] === target[i]) correct++;
    }
    const pct = totalChars ? Math.round((typed / totalChars) * 100) : 0;
    const acc = attempts ? Math.round((correct / attempts) * 100) : 100;
    let wpm = 0;
    if (startTime !== null) {
      const min = (Date.now() - startTime) / 60000;
      if (min > 0) wpm = Math.round(correct / 5 / min);
    }
    if (progPct) progPct.textContent = pct + '%';
    if (progFill) progFill.style.width = pct + '%';
    if (accVal) accVal.textContent = acc + '%';
    if (wpmVal) wpmVal.textContent = String(wpm);

    if (!completed && totalChars > 0 && typed === totalChars) {
      completed = true;
      const durationMs = startTime !== null ? Date.now() - startTime : 0;
      opts.onComplete?.({
        lang: curLang,
        wpm,
        accuracy: acc,
        chars: totalChars,
        correct,
        durationMs,
      });
    }
  }

  function onKeydown(e: KeyboardEvent, li: number): void {
    const input = inputs[li];
    const s = input.selectionStart ?? 0;
    const en = input.selectionEnd ?? 0;
    const len = input.value.length;

    if (e.key === 'Enter') {
      e.preventDefault();
      const next = li + 1;
      if (next >= inputs.length) return;

      // 다음 줄의 선행 공백 자동 채우기 (에디터 자동 들여쓰기)
      const nextTarget = LINES[next];
      const lead = (nextTarget.match(/^[ \t]+/) || [''])[0];

      // 현재 줄이 블록 열기면 한 단계 추가 들여쓰기
      const curLine = LINES[li].trimEnd();
      const opensBlock =
        curLine.endsWith('{') ||
        /:\s*$/.test(curLine) ||
        /\($/.test(curLine);

      let indent = lead;
      if (opensBlock) {
        indent += '    ';
      }

      inputs[next].value = indent;
      const cursorPos = indent.length;
      focusLine(next, cursorPos);
      renderLine(next);
      return;
    }
    if (e.key === 'Tab') {
      e.preventDefault();
      if (e.shiftKey) {
        focusLine(li - 1, inputs[li - 1]?.value.length ?? 0);
      } else {
        input.value = input.value.slice(0, s) + '    ' + input.value.slice(en);
        input.selectionStart = input.selectionEnd = s + 4;
        onInput(li);
      }
      return;
    }
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      focusLine(li + 1, s);
      return;
    }
    if (e.key === 'ArrowUp') {
      e.preventDefault();
      focusLine(li - 1, s);
      return;
    }
    if (e.key === 'ArrowLeft' && s === 0 && en === 0 && li > 0) {
      e.preventDefault();
      focusLine(li - 1, inputs[li - 1].value.length);
      return;
    }
    if (e.key === 'ArrowRight' && s === len && en === len && li < inputs.length - 1) {
      e.preventDefault();
      focusLine(li + 1, 0);
      return;
    }
    if (e.key === 'Backspace' && s === 0 && en === 0 && li > 0) {
      e.preventDefault();
      focusLine(li - 1, inputs[li - 1].value.length);
      return;
    }
    // 줄 안 중간 입력은 '삽입'이 아닌 '덮어쓰기' → 뒤 글자 밀림 방지
    if (e.key.length === 1 && !e.ctrlKey && !e.metaKey && !e.altKey) {
      if (s === en && s < len) {
        e.preventDefault();
        input.value = input.value.slice(0, s) + e.key + input.value.slice(s + 1);
        input.selectionStart = input.selectionEnd = s + 1;
        onInput(li);
      }
    }
  }

  function reset(): void {
    for (let li = 0; li < inputs.length; li++) {
      inputs[li].value = '';
      renderLine(li);
    }
    startTime = null;
    completed = false;
    updateStats();
    focusLine(0, 0);
  }

  function load(code: string, lang: string): void {
    curLang = lang;
    LINES = code.split('\n');
    totalChars = LINES.reduce((a, l) => a + l.length, 0);
    const adapter = getAdapter(lang);
    const wholeSyn: (TokenType | null)[] = adapter
      ? adapter(code)
      : new Array<TokenType | null>(code.length).fill(null);

    inputs = [];
    spansByLine = [];
    synByLine = [];
    startTime = null;
    completed = false;

    wrap!.innerHTML = '';
    let offset = 0;
    LINES.forEach((lineText, li) => {
      const row = document.createElement('div');
      row.className = 'tt-line';

      const num = document.createElement('div');
      num.className = 'tt-gutter-num';
      num.textContent = String(li + 1);

      const body = document.createElement('div');
      body.className = 'tt-line-body';

      const render = document.createElement('div');
      render.className = 'tt-render';
      render.setAttribute('aria-hidden', 'true');

      const spans: HTMLSpanElement[] = [];
      for (let i = 0; i < lineText.length; i++) {
        const sp = document.createElement('span');
        sp.textContent = lineText[i];
        render.appendChild(sp);
        spans.push(sp);
      }

      const input = document.createElement('textarea');
      input.className = 'tt-line-input';
      input.rows = 1;
      input.spellcheck = false;
      input.autocapitalize = 'off';
      input.autocomplete = 'off';
      input.setAttribute('wrap', 'off');
      input.setAttribute('autocorrect', 'off');
      input.setAttribute('aria-label', `${li + 1}번째 줄`);

      body.append(render, input);
      row.append(num, body);
      wrap!.append(row);

      inputs.push(input);
      spansByLine.push(spans);
      synByLine.push(wholeSyn.slice(offset, offset + lineText.length));
      offset += lineText.length + 1;

      input.addEventListener('input', () => onInput(li));
      input.addEventListener('focus', () => setActive(li));
      input.addEventListener('keydown', (e: KeyboardEvent) => onKeydown(e, li));
    });

    for (let li = 0; li < inputs.length; li++) renderLine(li);
    updateStats();
    focusLine(0, 0);
  }

  // 액션 버튼은 1회만 연결 (현재 상태를 클로저로 참조)
  for (const id of ['focusBtn', 'continueBtn']) {
    document.getElementById(id)?.addEventListener('click', () => {
      if (inputs.length) focusLine(0, inputs[0].value.length);
    });
  }
  for (const id of ['restartBtn', 'restartBtn2']) {
    document.getElementById(id)?.addEventListener('click', reset);
  }

  return { load };
}
