import { Parser, Language } from 'web-tree-sitter';
import type { Tree } from 'web-tree-sitter';

type LangName = 'java' | 'python';

let _ready = false;
let _initPromise: Promise<void> | null = null;
let _javaLang: Language | null = null;
let _pythonLang: Language | null = null;
const _pool: Parser[] = [];
const MAX_POOL = 4;

const WASM_BASE = import.meta.env.BASE_URL.endsWith('/')
  ? `${import.meta.env.BASE_URL}wasm/`
  : `${import.meta.env.BASE_URL}/wasm/`;
const TREE_SITTER_CORE = `${WASM_BASE}tree-sitter.wasm`;
const JAVA_WASM = `${WASM_BASE}tree-sitter-java.wasm`;
const PYTHON_WASM = `${WASM_BASE}tree-sitter-python.wasm`;

export interface ParserResult {
  tree: Tree;
  text: string;
}

export async function initTreeSitter(): Promise<void> {
  if (_ready) return;
  if (_initPromise) return _initPromise;

  _initPromise = (async () => {
    try {
      await Parser.init({
        locateFile() {
          return TREE_SITTER_CORE;
        },
      });

      const results = await Promise.allSettled([
        Language.load(JAVA_WASM),
        Language.load(PYTHON_WASM),
      ]);
      if (results[0].status === 'fulfilled') _javaLang = results[0].value;
      else console.warn('Java WASM 로드 실패, regex 폴백 사용');
      if (results[1].status === 'fulfilled') _pythonLang = results[1].value;
      else console.warn('Python WASM 로드 실패, regex 폴백 사용');

      _ready = _javaLang !== null || _pythonLang !== null;
    } catch (err) {
      console.warn('Tree-sitter 초기화 실패, regex 폴백 사용:', err);
      _ready = false;
      _initPromise = null;
    }
  })();

  return _initPromise;
}

function getParser(): Parser {
  return _pool.pop() ?? new Parser();
}

function returnParser(p: Parser): void {
  if (_pool.length < MAX_POOL) {
    _pool.push(p);
  } else {
    p.delete();
  }
}

export async function parseSource(
  lang: LangName,
  source: string,
): Promise<ParserResult> {
  if (!_ready) await initTreeSitter();
  if (!_ready) throw new Error('Tree-sitter not available');

  const language = lang === 'java' ? _javaLang : _pythonLang;
  if (!language) throw new Error(`Language ${lang} not loaded`);

  const parser = getParser();
  parser.setLanguage(language);

  const tree = parser.parse(source);
  returnParser(parser);

  if (!tree) throw new Error(`Parse failed for ${lang}`);

  return { tree, text: source };
}

export function isTreeSitterReady(): boolean {
  return _ready;
}

export function getLanguage(lang: LangName): Language | null {
  return lang === 'java' ? _javaLang : _pythonLang;
}
