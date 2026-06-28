import type { LangAdapter, TokenType } from '../registry';

const KW = new Set([
  'fun', 'val', 'var', 'class', 'object', 'interface', 'enum', 'data', 'sealed',
  'when', 'if', 'else', 'for', 'while', 'do', 'return', 'throw', 'try', 'catch', 'finally',
  'import', 'package', 'override', 'open', 'abstract', 'companion', 'suspend',
  'private', 'protected', 'internal', 'constructor', 'init', 'lateinit',
  'by', 'as', 'is', 'in', 'out', 'where', 'typealias', 'tailrec', 'inline', 'noinline',
  'crossinline', 'reified', 'const', 'annotation', 'expect', 'actual',
  'true', 'false', 'null',
]);

const RE =
  /(\/\/[^\n]*)|(\/\*[\s\S]*?\*\/)|("(?:[^"\\]|\\.)*")|(@\w+)|(\d+(?:\.\d+)?)|([A-Za-z_]\w*)|([{}()[\];,.=+\-*/<>!&|:?%])/g;

const DRE = /\$[A-Za-z_]\w*/g;

export const kotlinAdapter: LangAdapter = (src) => {
  const cls: (TokenType | null)[] = new Array(src.length).fill(null);
  let m: RegExpExecArray | null;
  RE.lastIndex = 0;
  while ((m = RE.exec(src))) {
    const t = m[0];
    let c: TokenType | null = null;
    if (m[1]) c = 'cm';
    else if (m[2]) c = 'cm';
    else if (m[3]) c = 'str';
    else if (m[4]) c = 'ann';
    else if (m[5]) c = 'num';
    else if (m[6]) c = KW.has(t) ? 'kw' : /^[A-Z]/.test(t) ? 'tp' : 'id';
    else if (m[7]) c = 'op';
    if (c !== null) {
      for (let k = 0; k < t.length; k++) cls[m.index + k] = c;
    }
    if (m[3]) {
      DRE.lastIndex = 0;
      let dm: RegExpExecArray | null;
      while ((dm = DRE.exec(t))) {
        for (let k = 0; k < dm[0].length; k++) cls[m.index + dm.index + k] = 'ann';
      }
    }
  }
  return cls;
};
