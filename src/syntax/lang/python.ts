import type { LangAdapter, TokenType } from '../registry';

const KW = new Set([
  'def',
  'class',
  'return',
  'if',
  'elif',
  'else',
  'for',
  'while',
  'try',
  'except',
  'finally',
  'with',
  'as',
  'import',
  'from',
  'pass',
  'break',
  'continue',
  'lambda',
  'yield',
  'async',
  'await',
  'global',
  'nonlocal',
  'raise',
  'del',
  'assert',
  'and',
  'or',
  'not',
  'in',
  'is',
  'True',
  'False',
  'None',
  'match',
  'case',
]);

// 토큰: 주석(#) / 문자열("",'') / 데코레이터(@) / 숫자 / 식별자 / 연산자
const RE =
  /(#[^\n]*)|("(?:[^"\\]|\\.)*"|'(?:[^'\\]|\\.)*')|(@\w+)|(\d+(?:\.\d+)?)|([A-Za-z_]\w*)|([{}()[\];,.:=+\-*/<>!&|%])/g;

export const pythonAdapter: LangAdapter = (src) => {
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
