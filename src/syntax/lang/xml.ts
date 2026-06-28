import type { LangAdapter, TokenType } from '../registry';

const RE = /(<!--[\s\S]*?-->)|(<)(\/?[\w][\w.-]*)|(="(?:[^"\\]|\\.)*")|(='(?:[^'\\]|\\.)*')|(@[\w.]+)/g;

export const xmlAdapter: LangAdapter = (src) => {
  const cls: (TokenType | null)[] = new Array(src.length).fill(null);
  let m: RegExpExecArray | null;
  RE.lastIndex = 0;
  while ((m = RE.exec(src))) {
    if (m[1]) {
      for (let k = 0; k < m[0].length; k++) cls[m.index + k] = 'cm';
    } else if (m[3]) {
      const t = m[0];
      const nameStart = t.startsWith('</') ? 2 : 1;
      for (let k = nameStart; k < t.length; k++) cls[m.index + k] = 'kw';
    } else if (m[4]) {
      for (let k = 2; k < m[0].length; k++) cls[m.index + k] = 'str';
    } else if (m[5]) {
      for (let k = 2; k < m[0].length; k++) cls[m.index + k] = 'str';
    } else if (m[6]) {
      for (let k = 0; k < m[0].length; k++) cls[m.index + k] = 'ann';
    }
  }
  return cls;
};
