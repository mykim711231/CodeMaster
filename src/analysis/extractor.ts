import { Query } from 'web-tree-sitter';
import type { Tree, Language, Node } from 'web-tree-sitter';
import { getLanguage, isTreeSitterReady } from './parser';

export interface ExtractedPattern {
  type: 'class' | 'method' | 'interface' | 'annotation' | 'import' | 'package';
  name: string;
  code: string;
  file: string;
  lang: 'java' | 'python';
  lineCount: number;
  category: string;
  comment: string;
}

interface QueryDef {
  type: ExtractedPattern['type'];
  pattern: string;
}

const JAVA_QUERIES: QueryDef[] = [
  { type: 'class', pattern: '(class_declaration name: (identifier) @name) @def' },
  { type: 'class', pattern: '(record_declaration name: (identifier) @name) @def' },
  { type: 'class', pattern: '(enum_declaration name: (identifier) @name) @def' },
  { type: 'method', pattern: '(method_declaration name: (identifier) @name) @def' },
  { type: 'interface', pattern: '(interface_declaration name: (identifier) @name) @def' },
  { type: 'annotation', pattern: '(annotation_type_declaration name: (identifier) @name) @def' },
  { type: 'import', pattern: '(import_declaration) @def' },
  { type: 'package', pattern: '(package_declaration) @def' },
];

const PYTHON_QUERIES: QueryDef[] = [
  { type: 'class', pattern: '(class_definition name: (identifier) @name) @def' },
  { type: 'method', pattern: '(function_definition name: (identifier) @name) @def' },
  { type: 'import', pattern: '(import_statement) @def' },
  { type: 'import', pattern: '(import_from_statement) @def' },
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
  let code = source.slice(startIndex, endIndex);
  const lines = code.split('\n');
  if (lines.length > 15) {
    code = lines.slice(0, 15).join('\n') + '\n// ...';
  }
  return code.trim();
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

        if (lineCount < 5 && qd.type !== 'import' && qd.type !== 'package' && qd.type !== 'annotation')
          continue;

        patterns.push({
          type: qd.type,
          name,
          code,
          file: fileName,
          lang,
          lineCount,
          category: inferCategory(fileName, qd.type, name),
          comment: extractComment(source, node.startPosition.row, lang),
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
    const code = lines.slice(startLine, Math.min(endLine, startLine + 15)).join('\n');
    const lineCount = Math.min(endLine - startLine, 15);
    if (lineCount < 3 && type !== 'import' && type !== 'package') return;

    patterns.push({
      type,
      name,
      code: code.trim(),
      file: fileName,
      lang,
      lineCount,
      category: inferCategory(fileName, type, name),
      comment: extractComment(source, startLine, lang),
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
