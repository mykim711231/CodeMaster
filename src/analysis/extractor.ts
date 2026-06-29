import { Query } from 'web-tree-sitter';
import type { Tree, Language, Node } from 'web-tree-sitter';
import { getLanguage, isTreeSitterReady } from './parser';

export interface ExtractedPattern {
  type: 'class' | 'method' | 'interface' | 'annotation';
  name: string;
  code: string;
  file: string;
  lang: 'java' | 'python';
  lineCount: number;
  category: string;
  comment: string;
  difficulty: 1 | 2 | 3;
  tags: string[];
}

interface QueryDef {
  type: ExtractedPattern['type'];
  pattern: string;
}

const JAVA_QUERIES: QueryDef[] = [
  // 클래스/레코드/열거형/어노테이션
  { type: 'class', pattern: '(class_declaration name: (identifier) @name) @def' },
  { type: 'class', pattern: '(record_declaration name: (identifier) @name) @def' },
  { type: 'class', pattern: '(enum_declaration name: (identifier) @name) @def' },
  { type: 'method', pattern: '(method_declaration name: (identifier) @name) @def' },
  { type: 'interface', pattern: '(interface_declaration name: (identifier) @name) @def' },
  { type: 'annotation', pattern: '(annotation_type_declaration name: (identifier) @name) @def' },

  // 제네릭 클래스/메서드
  { type: 'class', pattern: '(class_declaration name: (identifier) @name type_parameters: (type_parameters) @generics) @def' },
  { type: 'method', pattern: '(method_declaration name: (identifier) @name type_parameters: (type_parameters) @generics) @def' },

  // 스트림/옵셔널 체이닝 패턴
  { type: 'method', pattern: '(method_invocation name: (identifier) @name (#match? @name "^(stream|parallelStream|filter|map|flatMap|collect|reduce|forEach|findFirst|orElse|orElseGet|orElseThrow|ifPresent|mapMulti)$")) @def' },

  // 어노테이션 프로세서 관련 (@Builder, @Data, @Value, @AllArgsConstructor 등)
  { type: 'annotation', pattern: '(marker_annotation name: (type_identifier) @name (#match? @name "^(@Builder|@Data|@Value|@AllArgsConstructor|@NoArgsConstructor|@RequiredArgsConstructor|@Getter|@Setter|@ToString|@EqualsAndHashCode|@SuperBuilder)$")) @def' },

  // 디자인 패턴: Builder, Factory, Singleton, Strategy, Observer
  { type: 'method', pattern: '(method_declaration name: (identifier) @name (#match? @name "^(build|create|getInstance|of|newBuilder|with|apply|execute|handle|process|accept|visit)$")) @def' },

  // 트랜잭션 경계 (@Transactional)
  { type: 'method', pattern: '(method_declaration name: (identifier) @name annotation: (annotation argument_list: (value_argument) @args) #match? @args "^@Transactional") @def' },

  // JPA 리포지토리 메서드 (findBy, save, delete, existsBy, countBy)
  { type: 'method', pattern: '(method_declaration name: (identifier) @name (#match? @name "^(findBy|findAllBy|findTop|findFirst|existsBy|countBy|deleteBy|save|saveAll|flush)$")) @def' },

  // 설정 클래스 (@Configuration, @Bean)
  { type: 'method', pattern: '(method_declaration name: (identifier) @name annotation: (annotation) @ann (#match? @ann "^@Bean")) @def' },
];

const PYTHON_QUERIES: QueryDef[] = [
  { type: 'class', pattern: '(class_definition name: (identifier) @name) @def' },
  { type: 'method', pattern: '(function_definition name: (identifier) @name) @def' },

  // 데코레이터가 있는 메서드 (property, classmethod, staticmethod 등)
  { type: 'method', pattern: '(decorated_definition definition: (function_definition name: (identifier) @name)) @def' },

  // 비동기 함수
  { type: 'method', pattern: '(function_definition name: (identifier) @name) @def' },

  // 디자인 패턴 관련 함수 (build, create, get_instance, factory, singleton)
  { type: 'method', pattern: '(function_definition name: (identifier) @name (#match? @name "^(build|create|get_instance|factory|singleton|with|apply|execute|handle|process|__call__)$")) @def' },

  // Pydantic 모델 / 데이터 클래스
  { type: 'class', pattern: '(class_definition name: (identifier) @name bases: (argument_list) @bases (#match? @bases "(BaseModel|dataclass|NamedTuple|TypedDict|Protocol)")) @def' },

  // 트랜잭션/데코레이터 (@transactional, @atomic, @db_session)
  { type: 'method', pattern: '(decorated_definition definition: (function_definition name: (identifier) @name) decorators: (decorator) @dec (#match? @dec "^@(transactional|atomic|db_session|commit_on_success)")) @def' },

  // FastAPI/Flask 라우트 핸들러
  { type: 'method', pattern: '(decorated_definition definition: (function_definition name: (identifier) @name) decorators: (decorator) @dec (#match? @dec "^@(app|router|api|bp)\\.(get|post|put|patch|delete|head|options)")) @def' },
];

function extractComment(
  source: string,
  startLine: number,
  lang: 'java' | 'python',
): string {
  const lines = source.split('\n');
  const comments: string[] = [];

  let i = startLine - 1;
  while (i >= 0) {
    const line = lines[i].trim();
    if (lang === 'java') {
      if (line.startsWith('*/') || line === '*/') {
        while (i >= 0) {
          const l = lines[i].trim();
          if (l.startsWith('* ')) comments.unshift(l.replace(/^\*\s?/, ''));
          else if (l.startsWith('*')) comments.unshift(l.replace(/^\*/, ''));
          else if (l.startsWith('/**') || l.startsWith('/*')) break;
          else if (l) break;
          i--;
        }
        break;
      } else if (line.startsWith('//')) {
        comments.unshift(line.replace(/^\/\/\s?/, ''));
        i--;
        while (i >= 0) {
          const l = lines[i].trim();
          if (l.startsWith('//')) comments.unshift(l.replace(/^\/\/\s?/, ''));
          else break;
          i--;
        }
        break;
      } else if (line) {
        break;
      }
    } else {
      if (line.startsWith('"""') || line.startsWith("'''")) {
        const quote = line.slice(0, 3);
        i--;
        while (i >= 0) {
          const l = lines[i];
          if (l.trim().endsWith(quote)) break;
          if (l.trim().startsWith(quote)) {
            comments.unshift(l.trim().replace(new RegExp(`^${quote}\\s?`), '').replace(new RegExp(`\\s?${quote}$`), '').replace(/^"?""?/, '').replace(/"?"?"?$/, ''));
          } else {
            comments.unshift(l.trim());
          }
          i--;
        }
        break;
      } else if (line.startsWith('# ')) {
        comments.unshift(line.replace(/^#\s?/, ''));
        i--;
        while (i >= 0) {
          const l = lines[i].trim();
          if (l.startsWith('# ')) comments.unshift(l.replace(/^#\s?/, ''));
          else break;
          i--;
        }
        break;
      } else if (line) {
        break;
      }
    }
    i--;
  }

  // 주석 정리: Javadoc 태그 제거, 앞쪽 설명만 남김
  let text = comments.join(' ').replace(/\s+/g, ' ').trim();

  // Javadoc @태그 기준으로 자르기 (첫 번째 @태그부터는 무시)
  const tagIdx = text.search(/(?:\s|^)@(?:param|return|throws|see|since|deprecated|author|version|exception|serial|serialField|serialData)\s/);
  if (tagIdx > 0) {
    text = text.slice(0, tagIdx).trim();
  }

  // Python docstring :param, :type, :return, :rtype, :raises 태그 제거
  const pyTagIdx = text.search(/(?:\s|^):(?:param|type|return|rtype|raises|ivar|cvar|var)\s/);
  if (pyTagIdx > 0) {
    text = text.slice(0, pyTagIdx).trim();
  }

  return text;
}

function trimCode(source: string, startIndex: number, endIndex: number): string {
  return source.slice(startIndex, endIndex).trim();
}

function inferCategory(
  fileName: string,
  _type: ExtractedPattern['type'],
  name: string,
): string {
  const lower = (fileName + name).toLowerCase();
  if (lower.includes('entity') || lower.includes('model') || lower.includes('dto')) return 'entity';
  if (lower.includes('controller') || lower.includes('resource') || lower.includes('endpoint'))
    return 'controller';
  if (lower.includes('service')) return 'service';
  if (lower.includes('repository') || lower.includes('dao') || lower.includes('mapper'))
    return 'repository';
  if (lower.includes('util') || lower.includes('helper') || lower.includes('common')) return 'util';
  if (lower.includes('config') || lower.includes('property')) return 'config';
  return 'general';
}

function inferDifficulty(
  type: ExtractedPattern['type'],
  code: string,
): 1 | 2 | 3 {
  // 클래스/인터페이스: 기본 1, 복잡도 높은 경우 2
  if (type === 'class' || type === 'interface') {
    const hasGenerics = /<.*>/.test(code);
    const hasManyFields = (code.match(/private\s+\w+\s+\w+;/g) ?? []).length > 5;
    const hasManyMethods = (code.match(/public|private|protected/g) ?? []).length > 8;
    if (hasGenerics && (hasManyFields || hasManyMethods)) return 3;
    if (hasGenerics || hasManyFields || hasManyMethods) return 2;
    return 1;
  }
  // 메서드: 라인 수, 중첩 깊이, 복잡도 키워드
  if (type === 'method') {
    const lines = code.split('\n').length;
    const hasStream = /\.stream\(\)|\.parallelStream\(\)|\.filter\(|\.map\(|\.flatMap\(|\.collect\(|\.reduce\(/.test(code);
    const hasOptional = /Optional<|optional\.|orElse|orElseGet|orElseThrow|ifPresent/.test(code);
    const hasTransaction = /@Transactional/.test(code);
    const hasTryCatch = /try\s*\{|catch\s*\(/.test(code);
    const hasGenerics = /<.*>/.test(code);
    const nestedDepth = (code.match(/\{/g) ?? []).length;

    if (lines > 30 || hasStream && hasOptional || hasTransaction && hasTryCatch) return 3;
    if (lines > 15 || hasStream || hasOptional || hasTransaction || hasGenerics || nestedDepth > 3) return 2;
    return 1;
  }
  // 어노테이션
  return 1;
}

function inferTags(
  code: string,
  category: string,
  fileName: string,
): string[] {
  const tags: string[] = [category];
  const lower = (fileName + code).toLowerCase();

  // 공통 태그
  if (lower.includes('test') || lower.includes('spec')) tags.push('test');
  if (lower.includes('async') || lower.includes('completablefuture') || lower.includes('await') || lower.includes('async def')) tags.push('async');
  if (lower.includes('transaction') || lower.includes('@transactional') || lower.includes('@atomic') || lower.includes('@db_session')) tags.push('transaction');
  if (lower.includes('stream') || lower.includes('.map(') || lower.includes('.filter(') || lower.includes('.collect(')) tags.push('stream');
  if (lower.includes('optional') || lower.includes('optional<') || lower.includes('orelse') || lower.includes('ifpresent')) tags.push('optional');
  if (lower.includes('builder') || lower.includes('@builder') || lower.includes('.build()')) tags.push('builder');
  if (lower.includes('factory') || lower.includes('create') || lower.includes('getinstance') || lower.includes('of(')) tags.push('factory');
  if (lower.includes('singleton') || lower.includes('getinstance')) tags.push('singleton');
  if (lower.includes('strategy') || lower.includes('visitor') || lower.includes('observer')) tags.push('pattern');
  if (lower.includes('jpa') || lower.includes('repository') || lower.includes('entitymanager') || lower.includes('findby') || lower.includes('save')) tags.push('jpa');
  if (lower.includes('redis') || lower.includes('cache') || lower.includes('@cacheable')) tags.push('cache');
  if (lower.includes('security') || lower.includes('auth') || lower.includes('preauthorize') || lower.includes('authentication')) tags.push('security');
  if (lower.includes('config') || lower.includes('@configuration') || lower.includes('@bean')) tags.push('config');
  if (lower.includes('dto') || lower.includes('request') || lower.includes('response')) tags.push('dto');
  if (lower.includes('exception') || lower.includes('error') || lower.includes('handler')) tags.push('error-handling');
  if (lower.includes('event') || lower.includes('listener') || lower.includes('publish') || lower.includes('kafka') || lower.includes('rabbit') || lower.includes('message')) tags.push('event');

  // 중복 제거
  return [...new Set(tags)];
}

function buildPatterns(
  lang: 'java' | 'python',
  queries: QueryDef[],
  language: Language,
  rootNode: Node,
  source: string,
  fileName: string,
): ExtractedPattern[] {
  const patterns: ExtractedPattern[] = [];

  for (const qd of queries) {
    try {
      const query = new Query(language, qd.pattern);
      const matches = query.matches(rootNode);

      for (const match of matches) {
        const defCap = match.captures.find((c) => c.name === 'def');
        const nameCap = match.captures.find((c) => c.name === 'name');
        if (!defCap) continue;

        const node = defCap.node;
        const name =
          nameCap?.node.text ??
          node.text?.match(/(?:class|interface|record|enum|@interface|def)\s+(\w+)/)?.[1] ??
          `${qd.type}_${patterns.length}`;

        const code = trimCode(source, node.startIndex, node.endIndex);
        const lineCount = node.endPosition.row - node.startPosition.row + 1;

        // getter/setter 메서드 필터링 (3줄 이하의 단순 메서드)
        if (qd.type === 'method' && lineCount <= 3 && lang === 'java') {
          const body = source.slice(node.startIndex, node.endIndex).trim();
          if (/return\s+\w+;?\s*$/.test(body) || /this\.\w+\s*=\s*\w+;?\s*$/.test(body)) {
            continue;
          }
        }

        patterns.push({
          type: qd.type,
          name,
          code,
          file: fileName,
          lang,
          lineCount,
          category: inferCategory(fileName, qd.type, name),
          comment: extractComment(source, node.startPosition.row, lang),
          difficulty: inferDifficulty(qd.type, code),
          tags: inferTags(code, inferCategory(fileName, qd.type, name), fileName),
        });
      }
      query.delete();
    } catch {
      // skip failed query
    }
  }

  return patterns;
}

function extractPatternsRegex(
  lang: 'java' | 'python',
  source: string,
  fileName: string,
): ExtractedPattern[] {
  const patterns: ExtractedPattern[] = [];
  const lines = source.split('\n');

  const extractBlock = (startLine: number, name: string, type: ExtractedPattern['type']): void => {
    let endLine = Math.min(startLine + 14, lines.length);
    let braceCount = 0;
    for (let i = startLine; i < endLine && i < lines.length; i++) {
      braceCount += (lines[i].match(/\{/g) ?? []).length;
      braceCount -= (lines[i].match(/\}/g) ?? []).length;
      if (braceCount > 0 && i + 1 < lines.length) endLine = Math.min(i + 2, lines.length);
    }
    const code = lines.slice(startLine, endLine).join('\n');
    const lineCount = endLine - startLine;
    if (code.trim().length < 5) return; // 빈 블록 제외

    patterns.push({
      type,
      name,
      code: code.trim(),
      file: fileName,
      lang,
      lineCount,
      category: inferCategory(fileName, type, name),
      comment: extractComment(source, startLine, lang),
      difficulty: inferDifficulty(type, code.trim()),
      tags: inferTags(code.trim(), inferCategory(fileName, type, name), fileName),
    });
  };

  if (lang === 'java') {
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();
      const classM = line.match(
        /(?:(?:public|private|protected|abstract|final|static)\s+)*(?:class|record|enum)\s+(\w+)/,
      );
      const ifaceM = line.match(
        /(?:(?:public|private|protected)\s+)*interface\s+(\w+)/,
      );
      const methodM = line.match(
        /(?:(?:public|private|protected|static|final|abstract|synchronized|native)\s+)*(?:[\w<>[\]\s]+\s+)?(\w+)\s*\([^)]*\)/,
      );
      const annotM = line.match(/@interface\s+(\w+)/);

      if (classM) extractBlock(i, classM[1], 'class');
      else if (ifaceM) extractBlock(i, ifaceM[1], 'interface');
      else if (annotM) extractBlock(i, annotM[1], 'annotation');
      else if (methodM) extractBlock(i, methodM[1], 'method');
    }
  } else {
    const classRe = /^class\s+(\w+)/;
    const funcRe = /^def\s+(\w+)/;
    const decoratorRe = /^\s*@\w+/;
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      const classM = classRe.exec(line);
      const funcM = funcRe.exec(line);
      if (classM) extractBlock(i, classM[1], 'class');
      else if (funcM) {
        if (i > 0 && decoratorRe.test(lines[i - 1])) {
          extractBlock(i - 1, funcM[1], 'method');
        } else {
          extractBlock(i, funcM[1], 'method');
        }
      }
    }
  }

  return patterns;
}

export function extractPatterns(
  lang: 'java' | 'python',
  tree: Tree | null,
  source: string,
  fileName: string,
): ExtractedPattern[] {
  if (!isTreeSitterReady()) {
    return extractPatternsRegex(lang, source, fileName);
  }

  const language = getLanguage(lang);
  if (!language || !tree) {
    return extractPatternsRegex(lang, source, fileName);
  }

  try {
    const queries = lang === 'java' ? JAVA_QUERIES : PYTHON_QUERIES;
    return buildPatterns(lang, queries, language, tree.rootNode, source, fileName);
  } catch {
    return extractPatternsRegex(lang, source, fileName);
  }
}
