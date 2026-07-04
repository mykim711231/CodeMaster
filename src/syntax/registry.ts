// 구문 강조 — 언어별 어댑터 동적 등록 (PRD §13.6)
// 어댑터는 소스를 받아 '글자별 토큰 클래스 배열'을 반환한다.
// 타이핑 엔진이 글자별 span 에 인라인 color 를 적용하는 구조에 맞춘 형태.

export type TokenType = 'kw' | 'fn' | 'str' | 'ann' | 'tp' | 'num' | 'op' | 'cm' | 'id';

/** 소스 문자열 -> 각 글자(index)의 토큰 클래스(null = 공백/미분류) */
export type LangAdapter = (source: string) => (TokenType | null)[];

const registry = new Map<string, LangAdapter>();

export function registerLanguage(lang: string, adapter: LangAdapter): void {
  registry.set(lang, adapter);
}

export function getAdapter(lang: string): LangAdapter | undefined {
  return registry.get(lang);
}
