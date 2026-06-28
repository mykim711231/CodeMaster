import type { LangAdapter, TokenType } from '../registry';

const KW = new Set([
  'select', 'from', 'where', 'insert', 'into', 'values', 'update', 'set',
  'delete', 'create', 'table', 'alter', 'drop', 'primary', 'key', 'foreign',
  'references', 'index', 'join', 'left', 'right', 'inner', 'on', 'and', 'or',
  'not', 'null', 'as', 'order', 'by', 'group', 'having', 'limit', 'offset',
  'distinct', 'count', 'sum', 'avg', 'max', 'min', 'like', 'in', 'between',
  'is', 'exists', 'case', 'when', 'then', 'else', 'end', 'union', 'all',
  'commit', 'rollback', 'constraint', 'default', 'unique', 'check', 'cascade',
  'varchar', 'integer', 'bigint', 'boolean', 'timestamp', 'serial', 'identity',
  'sequence', 'grant', 'revoke', 'begin', 'declare', 'if', 'return',
]);

const RE =
  /('(?:[^'\\]|\\.)*')|(--[^\n]*)|(\/\*[\s\S]*?\*\/)|(\d+(?:\.\d+)?)|([A-Za-z_]\w*)/g;

export const sqlAdapter: LangAdapter = (src) => {
  const cls: (TokenType | null)[] = new Array(src.length).fill(null);
  let m: RegExpExecArray | null;
  RE.lastIndex = 0;
  while ((m = RE.exec(src))) {
    const t = m[0];
    let c: TokenType | null = null;
    if (m[1]) c = 'str';
    else if (m[2] || m[3]) c = 'cm';
    else if (m[4]) c = 'num';
    else if (m[5]) c = KW.has(t.toLowerCase()) ? 'kw' : null;
    if (c) {
      for (let k = 0; k < t.length; k++) cls[m.index + k] = c;
    }
  }
  return cls;
};
