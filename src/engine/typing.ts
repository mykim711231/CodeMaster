import { getAdapter, type TokenType } from '../syntax/registry';
import { appStore } from '../store';

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
  snippetId: string;
  inputLines: string[];
  targetLines: string[];
}

export interface TypingOptions {
  /** 모든 위치를 입력 완료했을 때 1회 호출 */
  onComplete?: (result: CompletionResult) => void;
}

export interface TypingController {
  load(code: string, lang: string, snippetId?: string): void;
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
  let curSnippetId = '';
  let inputs: HTMLTextAreaElement[] = [];
  let spansByLine: HTMLSpanElement[][] = [];
  let synByLine: (TokenType | null)[][] = [];
  let startTime: number | null = null;
  let completed = false;

  const continueBtn = document.getElementById('continueBtn');

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
    if (startTime === null) {
      startTime = Date.now();
      if (continueBtn) continueBtn.style.display = 'none';
    }
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
        snippetId: curSnippetId,
        inputLines: inputs.map((inp) => inp.value),
        targetLines: LINES,
      });
    }
  }

  function onKeydown(e: KeyboardEvent, li: number): void {
    const input = inputs[li];
    const s = input.selectionStart ?? 0;
    const en = input.selectionEnd ?? 0;
    const len = input.value.length;

    // ── Insert: OVR 모드 토글 ──
    if (e.key === 'Insert') {
      e.preventDefault();
      const cur = appStore.getState().overwriteMode;
      appStore.getState().setOverwriteMode(!cur);
      return;
    }

    // ── Enter: 자동 들여쓰기 ──
    if (e.key === 'Enter' && appStore.getState().autoIndent) {
      e.preventDefault();
      const next = li + 1;
      if (next >= inputs.length) return;

      // 현재 줄의 실제 입력값 기준 들여쓰기 (VS Code와 동일)
      const curVal = input.value;
      const curLead = (curVal.match(/^[ \t]+/) || [''])[0];
      let indent = curLead;

      // 블록 열기 감지 (언어별)
      const targetLine = LINES[li];
      const opensBlock =
        targetLine.trimEnd().endsWith('{') ||
        (curLang === 'python' &&
         /^\s*(def |class |if |elif |else|for |while |try |except |finally |with |match |case ).*:\s*$/.test(targetLine));

      if (opensBlock) {
        const ts = appStore.getState().tabSize;
        indent += ' '.repeat(ts);
      }

      // 닫는 중괄호 감지 → 아웃덴트
      const nextTarget = LINES[next];
      if (/^\s*\}/.test(nextTarget)) {
        const ts = appStore.getState().tabSize;
        indent = indent.slice(0, Math.max(0, indent.length - ts));
      }

      // 기존 입력이 있으면 덮어쓰지 않음
      const existing = inputs[next].value;
      if (existing === '' || existing.startsWith(indent)) {
        inputs[next].value = indent;
      }
      focusLine(next, indent.length);
      renderLine(next);
      return;
    }

    // ── Tab: 들여쓰기 / Shift+Tab: 언인덴트 ──
    if (e.key === 'Tab') {
      e.preventDefault();
      const ts = appStore.getState().tabSize;
      if (e.shiftKey) {
        // 언인덴트: 선행 공백을 tabSize만큼 제거
        const val = input.value;
        const leadMatch = val.match(/^ */);
        const leadLen = leadMatch ? leadMatch[0].length : 0;
        if (leadLen > 0) {
          const remove = Math.min(ts, leadLen);
          input.value = ' '.repeat(leadLen - remove) + val.slice(leadLen);
          const newPos = Math.max(0, s - remove);
          input.selectionStart = input.selectionEnd = newPos;
          onInput(li);
        }
      } else {
        const tabChar = appStore.getState().tabChar ? '\t' : ' '.repeat(ts);
        input.value = input.value.slice(0, s) + tabChar + input.value.slice(en);
        input.selectionStart = input.selectionEnd = s + tabChar.length;
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
    // 괄호 자동 닫기
    if (appStore.getState().autoClose) {
      const brackets: Record<string, string> = { '{': '}', '(': ')', '[': ']' };
    if (e.key in brackets && !e.ctrlKey && !e.metaKey && !e.altKey) {
      const tgt = LINES[li];
      const closeChar = brackets[e.key];
      if (s === en && s < tgt.length && tgt[s] === e.key && tgt[s + 1] === closeChar) {
        e.preventDefault();
        input.value = input.value.slice(0, s) + e.key + closeChar + input.value.slice(s + 2);
        input.selectionStart = input.selectionEnd = s + 2;
        onInput(li);
        return;
      }
    }
    // 따옴표 자동 닫기
    const quotes: Record<string, string> = { '"': '"', "'": "'", '`': '`' };
    if (e.key in quotes && !e.ctrlKey && !e.metaKey && !e.altKey) {
      const tgt = LINES[li];
      const q = e.key;
      if (s + 2 < tgt.length && tgt[s] === q && tgt[s + 1] === q && tgt[s + 2] === q) {
        // triple quote — 직접 처리
      } else if (s === en && s < tgt.length && tgt[s] === q && tgt[s + 1] === q) {
        e.preventDefault();
        input.value = input.value.slice(0, s) + q + q + input.value.slice(s + 2);
        input.selectionStart = input.selectionEnd = s + 2;
        onInput(li);
        return;
      }
    }
    }
    // 줄 안 중간 입력은 '삽입'이 아닌 '덮어쓰기' → 뒤 글자 밀림 방지
    if (e.key.length === 1 && !e.ctrlKey && !e.metaKey && !e.altKey) {
      const isOverwrite = appStore.getState().overwriteMode;
      if (isOverwrite && s === en && s < len) {
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
    if (continueBtn) continueBtn.style.display = '';
    updateStats();
    focusLine(0, 0);
  }

  function load(code: string, lang: string, snippetId = ''): void {
    curLang = lang;
    curSnippetId = snippetId;
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
    if (continueBtn) continueBtn.style.display = '';

    wrap!.innerHTML = '';
    let offset = 0;
    LINES.forEach((lineText, li) => {
      const row = document.createElement('div');
      row.className = 'tt-line';

      const num = document.createElement('div');
      num.className = 'tt-gutter-num';
      num.textContent = String(li + 1);
      num.style.display = appStore.getState().lineNum ? '' : 'none';

      const body = document.createElement('div');
      body.className = 'tt-line-body';

      const render = document.createElement('div');
      render.className = 'tt-render';
      render.setAttribute('aria-hidden', 'true');

      const leadingSpaces = (lineText.match(/^ +/)?.[0]?.length ?? 0);
      if (leadingSpaces > 0) {
        render.style.setProperty('--indent', String(leadingSpaces));
        render.classList.add('has-indent-guide');
      }

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
  for (const id of ['continueBtn']) {
    document.getElementById(id)?.addEventListener('click', () => {
      if (inputs.length) focusLine(0, inputs[0].value.length);
    });
  }
  document.getElementById('restartBtn')?.addEventListener('click', reset);

  return { load };
}
