import type { LangAdapter, TokenType } from '../registry';

const KW = new Set([
  'function', 'const', 'let', 'var', 'class', 'extends', 'return',
  'if', 'else', 'for', 'while', 'do', 'switch', 'case', 'break', 'continue',
  'try', 'catch', 'finally', 'throw', 'new', 'this', 'super',
  'import', 'export', 'default', 'from', 'async', 'await', 'yield',
  'typeof', 'instanceof', 'void', 'delete', 'in', 'of',
  'true', 'false', 'null', 'undefined',
]);

const RE =
  /(\/\/[^\n]*)|(\/\*[\s\S]*?\*\/)|('(?:[^'\\]|\\.)*')|("(?:[^"\\]|\\.)*")|(`(?:[^`\\]|\\.)*`)|(\d+(?:\.\d+)?)|([A-Za-z_$][\w$]*)|([{}()[\];,.=+\-*/<>!&|:?%])/g;

export const jsAdapter: LangAdapter = (src) => {
  const cls: (TokenType | null)[] = new Array(src.length).fill(null);
  let m: RegExpExecArray | null;
  RE.lastIndex = 0;
  while ((m = RE.exec(src))) {
    const t = m[0];
    let c: TokenType | null = null;
    if (m[1]) c = 'cm';
    else if (m[2]) c = 'cm';
    else if (m[3]) c = 'str';
    else if (m[4]) c = 'str';
    else if (m[5]) c = 'str';
    else if (m[6]) c = 'num';
    else if (m[7]) c = KW.has(t) ? 'kw' : /^[A-Z]/.test(t) ? 'tp' : 'id';
    else if (m[8]) c = 'op';
    if (c !== null) {
      for (let k = 0; k < t.length; k++) cls[m.index + k] = c;
    }
  }
  return cls;
};
