import type { LangAdapter, TokenType } from '../registry';

const KW = new Set([
  'fn', 'let', 'mut', 'const', 'static', 'struct', 'enum', 'trait', 'impl',
  'mod', 'use', 'pub', 'crate', 'self', 'super', 'ref', 'match', 'if', 'else',
  'loop', 'while', 'for', 'in', 'continue', 'break', 'return', 'where', 'as',
  'move', 'async', 'await', 'dyn', 'unsafe', 'extern', 'type', 'true', 'false',
  'Some', 'None', 'Ok', 'Err', 'String', 'Vec', 'Option', 'Result',
]);

export const rustAdapter: LangAdapter = (src) => {
  const cls: (TokenType | null)[] = new Array(src.length).fill(null);

  let m: RegExpExecArray | null;

  // /* */ 주석
  const blockCmRE = /\/\*[\s\S]*?\*\//g;
  blockCmRE.lastIndex = 0;
  while ((m = blockCmRE.exec(src))) {
    for (let k = 0; k < m[0].length; k++) cls[m.index + k] = 'cm';
  }

  // // /// 주석
  const lineCmRE = /\/\/\/?[^\n]*/g;
  lineCmRE.lastIndex = 0;
  while ((m = lineCmRE.exec(src))) {
    if (cls[m.index]) continue;
    for (let k = 0; k < m[0].length; k++) cls[m.index + k] = 'cm';
  }

  // "문자열"
  const strRE = /"(?:[^"\\]|\\.)*"/g;
  strRE.lastIndex = 0;
  while ((m = strRE.exec(src))) {
    for (let k = 0; k < m[0].length; k++) cls[m.index + k] = 'str';
  }

  // 'c' 문자
  const charRE = /'(?:[^'\\]|\\.)'/g;
  charRE.lastIndex = 0;
  while ((m = charRE.exec(src))) {
    if (cls[m.index]) continue;
    for (let k = 0; k < m[0].length; k++) cls[m.index + k] = 'str';
  }

  // #![...] #[...] 애트리뷰트
  const attrRE = /#!?\[[^\]]*\]/g;
  attrRE.lastIndex = 0;
  while ((m = attrRE.exec(src))) {
    for (let k = 0; k < m[0].length; k++) cls[m.index + k] = 'ann';
  }

  // & * :: -> => 연산자
  const opRE = /&|\*|::|->|=>/g;
  opRE.lastIndex = 0;
  while ((m = opRE.exec(src))) {
    if (cls[m.index]) continue;
    for (let k = 0; k < m[0].length; k++) cls[m.index + k] = 'op';
  }

  // 숫자
  const numRE = /\b\d+(?:\.\d+)?(?:[eE][+-]?\d+)?(?:_?\w+)?\b/g;
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
