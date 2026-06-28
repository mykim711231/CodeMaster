import type { LangAdapter, TokenType } from '../registry';

const KW = new Set([
  'def', 'class', 'module', 'end', 'if', 'else', 'elsif', 'unless', 'while',
  'until', 'for', 'do', 'begin', 'rescue', 'ensure', 'case', 'when', 'return',
  'yield', 'self', 'super', 'nil', 'true', 'false', 'and', 'or', 'not',
  'require', 'include', 'extend', 'attr_accessor', 'attr_reader', 'attr_writer',
  'private', 'public', 'protected',
]);

export const rubyAdapter: LangAdapter = (src) => {
  const cls: (TokenType | null)[] = new Array(src.length).fill(null);

  let m: RegExpExecArray | null;

  // # 주석
  const cmRE = /#[^\n]*/g;
  cmRE.lastIndex = 0;
  while ((m = cmRE.exec(src))) {
    for (let k = 0; k < m[0].length; k++) cls[m.index + k] = 'cm';
  }

  // "문자열" '문자열'
  const strRE = /"(?:[^"\\]|\\.)*"|'(?:[^'\\]|\\.)*'/g;
  strRE.lastIndex = 0;
  while ((m = strRE.exec(src))) {
    for (let k = 0; k < m[0].length; k++) cls[m.index + k] = 'str';
  }

  // :심볼
  const symRE = /:[A-Za-z_]\w*/g;
  symRE.lastIndex = 0;
  while ((m = symRE.exec(src))) {
    if (cls[m.index]) continue;
    for (let k = 0; k < m[0].length; k++) cls[m.index + k] = 'ann';
  }

  // @변수 @@변수 $변수
  const varRE = /@@?\w+|\$\w+/g;
  varRE.lastIndex = 0;
  while ((m = varRE.exec(src))) {
    if (cls[m.index]) continue;
    for (let k = 0; k < m[0].length; k++) cls[m.index + k] = 'ann';
  }

  // 숫자
  const numRE = /\b\d+(?:\.\d+)?(?:[eE][+-]?\d+)?\b/g;
  numRE.lastIndex = 0;
  while ((m = numRE.exec(src))) {
    if (cls[m.index]) continue;
    for (let k = 0; k < m[0].length; k++) cls[m.index + k] = 'num';
  }

  // 식별자 & 키워드
  const idRE = /[A-Za-z_]\w*[?!]?/g;
  idRE.lastIndex = 0;
  while ((m = idRE.exec(src))) {
    if (cls[m.index]) continue;
    const t = m[0];
    const c: TokenType = KW.has(t) ? 'kw' : /^[A-Z]/.test(t) ? 'tp' : 'id';
    for (let k = 0; k < t.length; k++) cls[m.index + k] = c;
  }

  return cls;
};
