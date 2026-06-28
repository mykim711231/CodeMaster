import type { LangAdapter, TokenType } from '../registry';

const KW = new Set([
  'int', 'char', 'float', 'double', 'void', 'long', 'short', 'unsigned',
  'signed', 'const', 'static', 'extern', 'volatile', 'register', 'auto',
  'enum', 'struct', 'union', 'typedef', 'sizeof', 'return', 'if', 'else',
  'for', 'while', 'do', 'switch', 'case', 'break', 'continue', 'goto',
  'default', 'NULL', 'true', 'false', 'class', 'public', 'private', 'protected',
  'virtual', 'override', 'final', 'new', 'delete', 'this', 'template',
  'typename', 'namespace', 'using', 'include', 'define', 'ifdef', 'ifndef',
  'endif', 'pragma',
]);

export const cAdapter: LangAdapter = (src) => {
  const cls: (TokenType | null)[] = new Array(src.length).fill(null);

  let m: RegExpExecArray | null;

  // /* */ 주석
  const blockCmRE = /\/\*[\s\S]*?\*\//g;
  blockCmRE.lastIndex = 0;
  while ((m = blockCmRE.exec(src))) {
    for (let k = 0; k < m[0].length; k++) cls[m.index + k] = 'cm';
  }

  // // 주석
  const lineCmRE = /\/\/[^\n]*/g;
  lineCmRE.lastIndex = 0;
  while ((m = lineCmRE.exec(src))) {
    if (cls[m.index]) continue;
    for (let k = 0; k < m[0].length; k++) cls[m.index + k] = 'cm';
  }

  // "문자열" '문자'
  const strRE = /"(?:[^"\\]|\\.)*"|'(?:[^'\\]|\\.)'/g;
  strRE.lastIndex = 0;
  while ((m = strRE.exec(src))) {
    for (let k = 0; k < m[0].length; k++) cls[m.index + k] = 'str';
  }

  // #include #define 전처리기
  const ppRE = /^[ \t]*#\s*(include|define|ifdef|ifndef|if|else|elif|endif|pragma|error|warning|undef|line)\b/gm;
  ppRE.lastIndex = 0;
  while ((m = ppRE.exec(src))) {
    for (let k = 0; k < m[0].length; k++) cls[m.index + k] = 'ann';
  }

  // 숫자 (0x, 0b, f, L 접미사 포함)
  const numRE = /\b(?:0[xX][0-9a-fA-F]+|0[bB][01]+|\d+(?:\.\d+)?(?:[eE][+-]?\d+)?(?:[fFLlUu]+)?)\b/g;
  numRE.lastIndex = 0;
  while ((m = numRE.exec(src))) {
    if (cls[m.index]) continue;
    for (let k = 0; k < m[0].length; k++) cls[m.index + k] = 'num';
  }

  // 식별자 & 키워드
  const idRE = /[A-Za-z_]\w*/g;
  idRE.lastIndex = 0;
  while ((m = idRE.exec(src))) {
    if (cls[m.index]) continue;
    const t = m[0];
    const c: TokenType = KW.has(t) ? 'kw' : /^[A-Z]/.test(t) ? 'tp' : 'id';
    for (let k = 0; k < t.length; k++) cls[m.index + k] = c;
  }

  return cls;
};
