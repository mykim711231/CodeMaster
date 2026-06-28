import type { LangAdapter, TokenType } from '../registry';

const RE =
  /(#[^\n]*)|("(?:[^"\\]|\\.)*")|('(?:[^'\\]|\\.)*')|([\w][\w.-]*(?=\s*:))|(\d+(?:\.\d+)?)|(-)(?=\s)|(&\w+)|(\*\w+)/g;

export const yamlAdapter: LangAdapter = (src) => {
  const cls: (TokenType | null)[] = new Array(src.length).fill(null);
  let m: RegExpExecArray | null;
  RE.lastIndex = 0;
  while ((m = RE.exec(src))) {
    const t = m[0];
    let c: TokenType | null = null;
    if (m[1]) c = 'cm';
    else if (m[2] || m[3]) c = 'str';
    else if (m[4]) c = 'kw';
    else if (m[5]) c = 'num';
    else if (m[6]) c = 'op';
    else if (m[7] || m[8]) c = 'ann';
    if (c) {
      for (let k = 0; k < t.length; k++) cls[m.index + k] = c;
    }
  }
  return cls;
};
