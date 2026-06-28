import type { LangAdapter, TokenType } from '../registry';

export const cssAdapter: LangAdapter = (src) => {
  const cls: (TokenType | null)[] = new Array(src.length).fill(null);

  // /* 주석 */
  let m: RegExpExecArray | null;
  const cmRE = /\/\*[\s\S]*?\*\//g;
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

  // @media @import @keyframes
  const annRE = /@(?:media|import|keyframes|supports|font-face|charset)\b/g;
  annRE.lastIndex = 0;
  while ((m = annRE.exec(src))) {
    for (let k = 0; k < m[0].length; k++) cls[m.index + k] = 'ann';
  }

  // #id .class
  const idClassRE = /[#.]\w[\w-]*/g;
  idClassRE.lastIndex = 0;
  while ((m = idClassRE.exec(src))) {
    let skip = false;
    if (cls[m.index]) skip = true; // already colored
    if (!skip) {
      for (let k = 0; k < m[0].length; k++) cls[m.index + k] = 'ann';
    }
  }

  // 숫자 (px, em, rem, %, vh, vw 포함)
  const numRE = /\b\d+(?:\.\d+)?(?:px|em|rem|%|vh|vw|vmin|vmax|ch|ex|cm|mm|in|pt|pc|s|ms|deg|rad|turn)?\b/g;
  numRE.lastIndex = 0;
  while ((m = numRE.exec(src))) {
    if (cls[m.index]) continue;
    for (let k = 0; k < m[0].length; k++) cls[m.index + k] = 'num';
  }

  // 속성명 (콜론 앞 식별자)
  const propRE = /([\w-]+)(?=\s*:)/g;
  propRE.lastIndex = 0;
  while ((m = propRE.exec(src))) {
    const idx = m.index;
    if (cls[idx]) continue;
    for (let k = 0; k < m[1].length; k++) cls[idx + k] = 'kw';
  }

  return cls;
};
