import type { Snippet, Pack } from '../content/types';
import type { ExtractedPattern } from './extractor';

function detectAnnotations(code: string): string[] {
  const found: string[] = [];
  const patterns = [
    'RestController', 'Controller', 'Service', 'Repository', 'Component',
    'Configuration', 'Bean', 'Autowired', 'Value', 'Transactional',
    'RequestMapping', 'GetMapping', 'PostMapping', 'PutMapping', 'DeleteMapping',
    'Entity', 'Table', 'Id', 'Column', 'Override',
  ];
  for (const a of patterns) {
    if (code.includes('@' + a)) {
      found.push('@' + a);
    }
  }
  return found;
}

function detectPythonKws(code: string): string[] {
  const found: string[] = [];
  const patterns = ['@dataclass', '@staticmethod', '@classmethod', '@property',
    '@abstractmethod', 'async def', 'await', 'yield', 'with'];
  for (const p of patterns) {
    if (code.includes(p)) {
      found.push(p);
    }
  }
  return found;
}

function extractTerms(code: string, lang: 'java' | 'python'): Array<{ t: string; d: string }> {
  const termDescs: Record<string, string> = {
    // Java keywords
    class: '객체의 설계도를 정의하는 키워드예요.',
    public: '어디서든 접근할 수 있게 공개해요.',
    private: '클래스 내부에서만 접근할 수 있어요.',
    protected: '같은 패키지·상속 관계에서만 접근해요.',
    static: '인스턴스 없이 클래스 자체에 속해요.',
    void: '반환값이 없는 메서드에 붙여요.',
    return: '메서드의 결과값을 호출자에게 돌려줘요.',
    new: '새로운 객체(인스턴스)를 생성해요.',
    extends: '부모 클래스의 기능을 물려받아요.',
    implements: '인터페이스의 규칙을 구현해요.',
    final: '변경·상속·오버라이드를 막아요.',
    throws: '발생할 수 있는 예외를 선언해요.',
    import: '다른 패키지의 클래스를 가져와요.',
    package: '클래스가 속한 논리적 폴더(패키지)예요.',
    this: '현재 객체 자신을 가리켜요.',
    // Python keywords
    def: '함수(메서드)를 정의하는 시작이에요.',
    self: '객체 자신을 참조하는 첫 번째 매개변수예요.',
    lambda: '이름 없는 한 줄짜리 함수예요.',
    async: '비동기 실행을 정의해요.',
    await: '비동기 작업이 끝날 때까지 기다려요.',
    yield: '값을 하나씩 생성(제너레이터)해요.',
    with: '자원을 안전하게 열고 자동으로 닫아줘요.',
    // Spring annotations
    '@RestController': '웹 요청을 받아 데이터(JSON)로 응답하는 컨트롤러예요.',
    '@Controller': '웹 요청을 받아 뷰를 반환하는 컨트롤러예요.',
    '@Service': '비즈니스 로직을 담당하는 서비스 계층이에요.',
    '@Repository': '데이터 접근(DB)을 담당하는 계층이에요.',
    '@Component': '스프링이 관리하는 빈으로 등록돼요.',
    '@Configuration': '스프링 설정 클래스예요.',
    '@Bean': '이 메서드가 반환하는 객체를 빈으로 등록해요.',
    '@Autowired': '스프링이 의존 객체를 자동 주입해줘요.',
    '@Value': '설정 파일의 값을 읽어와 주입해요.',
    '@Transactional': '이 범위를 하나의 트랜잭션으로 묶어요.',
    '@RequestMapping': '요청 주소(URL)와 메서드를 연결해요.',
    '@GetMapping': 'HTTP GET 요청을 처리해요(조회).',
    '@PostMapping': 'HTTP POST 요청을 처리해요(생성).',
    '@PutMapping': 'HTTP PUT 요청을 처리해요(전체 수정).',
    '@DeleteMapping': 'HTTP DELETE 요청을 처리해요(삭제).',
    '@Entity': 'DB 테이블과 연결되는 엔티티 클래스예요.',
    '@Table': '매핑할 DB 테이블 이름을 지정해요.',
    '@Id': 'DB 테이블의 기본키(고유 식별자)예요.',
    '@Column': 'DB 칼럼의 세부 속성을 지정해요.',
    '@Override': '부모 클래스의 메서드를 다시 정의해요.',
    // Python decorators
    '@dataclass': '데이터만 담는 클래스를 자동으로 만들어줘요.',
    '@staticmethod': '인스턴스 없이 호출하는 메서드예요.',
    '@classmethod': '클래스 자체를 첫 인자로 받는 메서드예요.',
    '@property': '메서드를 필드처럼 접근하게 해줘요.',
    '@abstractmethod': '자식 클래스가 반드시 구현해야 하는 메서드예요.',
  };

  const found: Array<{ t: string; d: string }> = [];
  const used = new Set<string>();

  // 1. 먼저 어노테이션/데코레이터 찾기
  if (lang === 'java') {
    for (const a of detectAnnotations(code)) {
      const desc = termDescs[a];
      if (desc) { found.push({ t: a, d: desc }); used.add(a); }
    }
  } else {
    for (const d of detectPythonKws(code)) {
      const desc = termDescs[d];
      if (desc) { found.push({ t: d, d: desc }); used.add(d); }
    }
  }

  // 2. 키워드 찾기
  const keywords = lang === 'java'
    ? ['class', 'public', 'private', 'protected', 'static', 'void', 'return', 'new',
       'extends', 'implements', 'final', 'throws', 'import', 'package', 'interface']
    : ['class', 'def', 'self', 'return', 'import', 'async', 'await', 'yield', 'with', 'lambda'];

  for (const kw of keywords) {
    if (found.length >= 5) break;
    const re = new RegExp(`\\b${kw}\\b`, 'm');
    if (!used.has(kw) && re.test(code)) {
      const desc = termDescs[kw] ?? `${kw} 키워드예요.`;
      found.push({ t: kw, d: desc });
      used.add(kw);
    }
  }

  return found;
}

function buildConcept(p: ExtractedPattern): string {
  const lowerName = p.name.toLowerCase();
  const annotations = p.lang === 'java' ? detectAnnotations(p.code) : [];

  // 패턴 타입 + 이름 기반 설명
  const typeLabel: Record<ExtractedPattern['type'], string> = {
    class: '클래스(class)',
    method: '메서드(method)',
    interface: '인터페이스(interface)',
    annotation: '어노테이션(annotation)',
    import: 'import 선언',
    package: 'package 선언',
  };

  let concept = '';

  // 주석이 있으면 가장 먼저 사용 (가장 신뢰도 높은 설명)
  if (p.comment && p.comment.length > 5) {
    concept += p.comment + ' ';
  } else {
    concept += `${typeLabel[p.type]}예요. `;
  }

  // 어노테이션 기반 설명 보강
  if (annotations.includes('@RestController')) {
    concept += '웹 요청을 받아 JSON 응답을 돌려주는 컨트롤러 역할을 해요. ';
  } else if (annotations.includes('@Controller')) {
    concept += '웹 요청을 받아 화면(뷰)을 보여주는 컨트롤러 역할을 해요. ';
  } else if (annotations.includes('@Service')) {
    concept += '핵심 비즈니스 로직을 처리하는 서비스 계층이에요. 주방에서 요리를 담당하는 셰프와 같아요. ';
  } else if (annotations.includes('@Repository')) {
    concept += '데이터베이스에 접근해 저장·조회를 담당하는 계층이에요. 창고 관리자와 같아요. ';
  } else if (annotations.includes('@Entity')) {
    concept += '데이터베이스 테이블의 한 행(레코드)과 짝을 이루는 객체예요. ';
  } else if (annotations.includes('@Configuration') || annotations.includes('@Bean')) {
    concept += '스프링의 설정을 담당해요. 레고 조립 설명서처럼 "이 부품은 이렇게 만들어"라고 적어둔 거예요. ';
  }

  // 이름 기반 설명 보강
  if (lowerName.includes('service')) {
    concept += '이름에서 알 수 있듯 비즈니스 로직을 담당해요. ';
  } else if (lowerName.includes('controller') || lowerName.includes('resource')) {
    concept += '웹 요청의 진입점(접수 창구) 역할을 해요. ';
  } else if (lowerName.includes('repository') || lowerName.includes('dao') || lowerName.includes('mapper')) {
    concept += '데이터 저장·조회를 책임져요. ';
  } else if (lowerName.includes('entity') || lowerName.includes('model') || lowerName.includes('dto')) {
    concept += '데이터를 담아 옮기는 그릇 역할을 해요. ';
  } else if (lowerName.includes('config') || lowerName.includes('property')) {
    concept += '앱의 설정을 담당해요. ';
  } else if (lowerName.includes('util') || lowerName.includes('helper')) {
    concept += '공통으로 쓰이는 도구(유틸리티)를 제공해요. ';
  } else if (lowerName.includes('test')) {
    concept += '코드가 올바르게 동작하는지 검증하는 테스트예요. ';
  }

  concept += '프로젝트 소스에서 추출된 실제 코드예요.';
  return concept;
}

function buildWhy(p: ExtractedPattern): string {
  const annotations = p.lang === 'java' ? detectAnnotations(p.code) : [];
  const lowerName = p.name.toLowerCase();

  if (annotations.includes('@RestController') || annotations.includes('@Controller') ||
      lowerName.includes('controller')) {
    return '웹 요청을 받아 적절한 응답을 반환하려고 써요.';
  }
  if (annotations.includes('@Service') || lowerName.includes('service')) {
    return '비즈니스 규칙을 한 곳에 모아 관리하려고 써요.';
  }
  if (annotations.includes('@Repository') || lowerName.includes('repository') ||
      lowerName.includes('dao')) {
    return 'DB 접근을 캡슐화하고 재사용하려고 써요.';
  }
  if (annotations.includes('@Entity') || lowerName.includes('entity')) {
    return 'DB 데이터를 객체로 다루려고(ORM) 써요.';
  }
  if (annotations.includes('@Configuration') || lowerName.includes('config')) {
    return '앱의 설정을 한 곳에 모아 관리하려고 써요.';
  }
  if (p.type === 'interface') {
    return '여러 클래스가 같은 방식으로 동작하게 공통 규격을 정하려고 써요.';
  }
  if (p.type === 'class') {
    return '관련된 데이터와 동작을 하나로 묶어 관리하려고 써요.';
  }
  return '실제 프로젝트에서 필요한 기능을 구현한 패턴이에요.';
}

function buildPitfall(p: ExtractedPattern): string | undefined {
  const annotations = p.lang === 'java' ? detectAnnotations(p.code) : [];

  if (annotations.includes('@Service') && !p.code.includes('private final')) {
    return '서비스는 생성자 주입을 권장해요. @Autowired 필드 주입보다 안전해요.';
  }
  if (annotations.includes('@Entity') && !p.code.includes('@Id')) {
    return '엔티티에는 @Id(기본키)가 반드시 필요해요.';
  }
  if (annotations.includes('@Transactional') && p.code.includes('try')) {
    return '트랜잭션 안에서 예외를 삼키면 롤백이 안 돼요.';
  }
  if (p.type === 'class' && annotations.length === 0 && p.lang === 'java') {
    return '이 클래스에 @Component가 없으면 스프링이 관리하지 않아요.';
  }
  return undefined;
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
      annotation: '@interface',
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
        concept: buildConcept(p),
        terms: extractTerms(p.code, p.lang),
        why: buildWhy(p),
        pitfall: buildPitfall(p),
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
