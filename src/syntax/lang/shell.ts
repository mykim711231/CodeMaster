import type { LangAdapter, TokenType } from '../registry';

const KW = new Set([
  'if', 'then', 'else', 'elif', 'fi', 'for', 'while', 'do', 'done', 'case', 'esac',
  'function', 'return', 'exit', 'echo', 'export', 'source', 'local', 'readonly',
]);

const RE =
  /(#[^\n]*)|("(?:[^"\\]|\\.)*")|('(?:[^'\\]|\\.)*')|(\$\{[^}]*\})|(\$[A-Za-z_]\w*)|(\d+(?:\.\d+)?)|([A-Za-z_]\w*)|([{}()[\];,.=+\-*/<>!&|:?%])/g;

export const shellAdapter: LangAdapter = (src) => {
  const cls: (TokenType | null)[] = new Array(src.length).fill(null);
  let m: RegExpExecArray | null;
  RE.lastIndex = 0;
  while ((m = RE.exec(src))) {
    const t = m[0];
    let c: TokenType | null = null;
    if (m[1]) c = 'cm';
    else if (m[2]) c = 'str';
    else if (m[3]) c = 'str';
    else if (m[4] || m[5]) c = 'ann';
    else if (m[6]) c = 'num';
    else if (m[7]) c = KW.has(t) ? 'kw' : 'id';
    else if (m[8]) c = 'op';
    if (c !== null) {
      for (let k = 0; k < t.length; k++) cls[m.index + k] = c;
    }
  }
  return cls;
};
