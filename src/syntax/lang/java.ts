import type { LangAdapter, TokenType } from '../registry';

const KW = new Set([
  'public',
  'private',
  'protected',
  'class',
  'interface',
  'enum',
  'record',
  'implements',
  'extends',
  'static',
  'final',
  'abstract',
  'void',
  'return',
  'new',
  'true',
  'false',
  'null',
  'this',
  'super',
  'package',
  'import',
  'if',
  'else',
  'for',
  'while',
  'do',
  'switch',
  'case',
  'break',
  'continue',
  'try',
  'catch',
  'finally',
  'throw',
  'throws',
  'synchronized',
  'volatile',
  'transient',
  'native',
  'int',
  'long',
  'boolean',
  'double',
  'float',
  'char',
  'byte',
  'short',
]);

// 토큰: 주석 / 문자열 / 애너테이션 / 숫자 / 식별자 / 연산자
const RE =
  /(\/\/[^\n]*)|("(?:[^"\\]|\\.)*")|(@\w+)|(\d+(?:\.\d+)?)|([A-Za-z_$][\w$]*)|([{}()[\];,.=+\-*/<>!&|:?%])/g;

export const javaAdapter: LangAdapter = (src) => {
  const cls: (TokenType | null)[] = new Array(src.length).fill(null);
  let m: RegExpExecArray | null;
  RE.lastIndex = 0;
  while ((m = RE.exec(src))) {
    const t = m[0];
    let c: TokenType | null = null;
    if (m[1]) c = 'cm';
    else if (m[2]) c = 'str';
    else if (m[3]) c = 'ann';
    else if (m[4]) c = 'num';
    else if (m[5]) c = KW.has(t) ? 'kw' : /^[A-Z]/.test(t) ? 'tp' : 'id';
    else if (m[6]) c = 'op';
    for (let k = 0; k < t.length; k++) cls[m.index + k] = c;
  }
  return cls;
};
