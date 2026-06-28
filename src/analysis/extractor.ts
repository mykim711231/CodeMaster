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
}

interface QueryDef {
  type: ExtractedPattern['type'];
  pattern: string;
}

const JAVA_QUERIES: QueryDef[] = [
  { type: 'class', pattern: '(class_declaration name: (identifier) @name) @def' },
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
];

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
          node.text?.split(/\s+/m)[1]?.replace(/[^a-zA-Z0-9_]/g, '') ??
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
        });
      }
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
    });
  };

  if (lang === 'java') {
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();
      const classM = line.match(
        /(?:(?:public|private|protected|abstract|final|static)\s+)*class\s+(\w+)/,
      );
      const ifaceM = line.match(
        /(?:(?:public|private|protected)\s+)*interface\s+(\w+)/,
      );
      const methodM = line.match(
        /(?:(?:public|private|protected|static|final|abstract|synchronized|native|\s)+)(?:[\w<>[\]\s]+\s+)?(\w+)\s*\([^)]*\)/,
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
