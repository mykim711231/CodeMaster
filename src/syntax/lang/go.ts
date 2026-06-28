import type { LangAdapter, TokenType } from '../registry';

const KW = new Set([
  'func', 'package', 'import', 'var', 'const', 'type', 'struct', 'interface', 'map', 'chan',
  'go', 'select', 'defer', 'return', 'if', 'else', 'for', 'range', 'break', 'continue',
  'switch', 'case', 'default', 'fallthrough', 'goto',
  'true', 'false', 'nil',
]);

const RE =
  /(\/\/[^\n]*)|(\/\*[\s\S]*?\*\/)|("(?:[^"\\]|\\.)*")|(\d+(?:\.\d+)?)|([A-Za-z_]\w*)|([{}()[\];,.=+\-*/<>!&|:?%])/g;

export const goAdapter: LangAdapter = (src) => {
  const cls: (TokenType | null)[] = new Array(src.length).fill(null);
  let m: RegExpExecArray | null;
  RE.lastIndex = 0;
  while ((m = RE.exec(src))) {
    const t = m[0];
    let c: TokenType | null = null;
    if (m[1]) c = 'cm';
    else if (m[2]) c = 'cm';
    else if (m[3]) c = 'str';
    else if (m[4]) c = 'num';
    else if (m[5]) c = KW.has(t) ? 'kw' : /^[A-Z]/.test(t) ? 'tp' : 'id';
    else if (m[6]) c = 'op';
    if (c !== null) {
      for (let k = 0; k < t.length; k++) cls[m.index + k] = c;
    }
  }
  return cls;
};
