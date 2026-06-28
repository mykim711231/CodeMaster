import type { LangAdapter, TokenType } from '../registry';

const RE = /("(?:[^"\\]|\\.)*")\s*:|("(?:[^"\\]|\\.)*")|(\b(?:true|false|null)\b)|(-?\d+(?:\.\d+)?(?:[eE][+-]?\d+)?)/g;

export const jsonAdapter: LangAdapter = (src) => {
  const cls: (TokenType | null)[] = new Array(src.length).fill(null);
  let m: RegExpExecArray | null;
  RE.lastIndex = 0;
  while ((m = RE.exec(src))) {
    const t = m[0];
    if (m[1]) {
      for (let k = 0; k < t.length; k++) cls[m.index + k] = 'kw';
    } else if (m[2]) {
      for (let k = 0; k < t.length; k++) cls[m.index + k] = 'str';
    } else if (m[3]) {
      for (let k = 0; k < t.length; k++) cls[m.index + k] = 'kw';
    } else if (m[4]) {
      for (let k = 0; k < t.length; k++) cls[m.index + k] = 'num';
    }
  }
  return cls;
};
