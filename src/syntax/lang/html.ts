import type { LangAdapter, TokenType } from '../registry';

export const htmlAdapter: LangAdapter = (src) => {
  const cls: (TokenType | null)[] = new Array(src.length).fill(null);

  let m: RegExpExecArray | null;

  // <!-- 주석 -->
  const cmRE = /<!--[\s\S]*?-->/g;
  cmRE.lastIndex = 0;
  while ((m = cmRE.exec(src))) {
    for (let k = 0; k < m[0].length; k++) cls[m.index + k] = 'cm';
  }

  // 태그명 <tag
  const tagRE = /<\/?([\w-]+)/g;
  tagRE.lastIndex = 0;
  while ((m = tagRE.exec(src))) {
    const idx = m.index;
    if (cls[idx + 1]) continue; // </ already colored
    for (let k = 0; k < m[0].length; k++) {
      if (cls[idx + k]) break;
      cls[idx + k] = k === 0 ? 'op' : 'kw'; // < = op, 태그명 = kw
    }
  }

  // 속성값 key="value"
  const attrRE = /([\w-]+)\s*=\s*("(?:[^"\\]|\\.)*"|'(?:[^'\\]|\\.)*')/g;
  attrRE.lastIndex = 0;
  while ((m = attrRE.exec(src))) {
    const attrIdx = m.index;
    for (let k = 0; k < m[1].length; k++) cls[attrIdx + k] = 'kw';
    for (let k = 0; k < m[2].length; k++) cls[attrIdx + m[0].indexOf(m[2]) + k] = 'str';
  }

  // &엔티티;
  const entRE = /&[a-zA-Z]+;/g;
  entRE.lastIndex = 0;
  while ((m = entRE.exec(src))) {
    if (cls[m.index]) continue;
    for (let k = 0; k < m[0].length; k++) cls[m.index + k] = 'num';
  }

  return cls;
};
