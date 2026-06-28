import type { LangAdapter, TokenType } from '../registry';

const RE =
  /(#[^\n]*)|(\/\/[^\n]*)|(\/\*[\s\S]*?\*\/)|([\w.]+(?=\s*=))|("(?:[^"\\]|\\.)*")|('(?:[^'\\]|\\.)*')/g;

export const propertiesAdapter: LangAdapter = (src) => {
  const cls: (TokenType | null)[] = new Array(src.length).fill(null);
  let m: RegExpExecArray | null;
  RE.lastIndex = 0;
  while ((m = RE.exec(src))) {
    const t = m[0];
    let c: TokenType | null = null;
    if (m[1] || m[2] || m[3]) c = 'cm';
    else if (m[4]) c = 'kw';
    else if (m[5] || m[6]) c = 'str';
    if (c) {
      for (let k = 0; k < t.length; k++) cls[m.index + k] = c;
    }
  }
  return cls;
};
