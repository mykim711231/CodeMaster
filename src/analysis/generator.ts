import type { Snippet, Pack } from '../content/types';
import type { ExtractedPattern } from './extractor';

function extractTerms(code: string, lang: 'java' | 'python'): Array<{ t: string; d: string }> {
  const termDescs: Record<string, string> = {
    class: '객체의 설계도(틀)입니다.',
    public: '어디서든 접근할 수 있도록 공개합니다.',
    private: '클래스 내부에서만 접근할 수 있습니다.',
    static: '인스턴스 없이 클래스 자체에 속합니다.',
    void: '반환값이 없는 메서드입니다.',
    return: '메서드의 실행 결과를 반환합니다.',
    new: '새로운 객체(인스턴스)를 생성합니다.',
    extends: '다른 클래스의 기능을 상속받습니다.',
    implements: '인터페이스의 구현을 약속합니다.',
    final: '변경·상속·오버라이드를 금지합니다.',
    throws: '메서드가 발생시킬 수 있는 예외를 선언합니다.',
    import: '다른 패키지의 클래스를 가져옵니다.',
    package: '클래스들이 속한 논리적 그룹입니다.',
    def: '함수(메서드)의 시작을 정의합니다.',
    self: '자신의 인스턴스를 참조합니다.',
    lambda: '이름 없이 사용하는 익명 함수입니다.',
    async: '비동기 실행을 정의합니다.',
    await: '비동기 작업이 끝날 때까지 기다립니다.',
  };

  const keywords = lang === 'java'
    ? ['class', 'public', 'private', 'static', 'void', 'return', 'new', 'extends', 'implements', 'final', 'throws', 'import', 'package']
    : ['class', 'def', 'self', 'return', 'import', 'lambda', 'async', 'await'];

  const found: Array<{ t: string; d: string }> = [];
  for (const kw of keywords) {
    if (code.includes(kw)) {
      found.push({ t: kw, d: termDescs[kw] ?? `${kw} 키워드입니다.` });
    }
  }
  return found.slice(0, 3);
}

export function generateSnippets(patterns: ExtractedPattern[]): Snippet[] {
  const seen = new Set<string>();
  const snippets: Snippet[] = [];

  for (const p of patterns) {
    if (snippets.length >= 100) break;

    const codeKey = p.code.slice(0, 80);
    if (seen.has(codeKey)) continue;
    seen.add(codeKey);

    const id = `proj-${p.type}-${p.name.replace(/[^a-zA-Z0-9_-]/g, '_')}`;
    const titleMap: Record<ExtractedPattern['type'], string> = {
      class: 'class',
      method: 'method',
      interface: 'interface',
      annotation: 'annotation',
      import: 'import',
      package: 'package',
    };

    snippets.push({
      id,
      lang: p.lang,
      title: `${titleMap[p.type]}: ${p.name}`,
      file: p.file,
      code: p.code,
      explain: {
        concept: `${titleMap[p.type]} 패턴입니다. 프로젝트에서 추출된 실제 코드예요.`,
        terms: extractTerms(p.code, p.lang),
        why: '실제 프로젝트에서 사용된 패턴이에요.',
      },
    });
  }

  return snippets;
}

export function generatePack(name: string, lang: 'java' | 'python', snippets: Snippet[]): Pack {
  return {
    id: `proj-${name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')}`,
    name,
    lang,
    levels: [
      {
        no: 1,
        name: '프로젝트 분석',
        snippets,
      },
    ],
  };
}
