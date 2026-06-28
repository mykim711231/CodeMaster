import type { Pack } from '../content/types';
import { selectAndScanFolder } from './scanner';
import { generateFileSnippets, generateSnippets, generatePack } from './generator';
import { initTreeSitter, parseSource, isTreeSitterReady } from './parser';
import { extractPatterns } from './extractor';

export async function importProject(
  onProgress?: (msg: string) => void,
): Promise<Pack> {
  onProgress?.('프로젝트 폴더를 선택해주세요...');

  const { name, lang, files } = await selectAndScanFolder((current, total, fname) => {
    onProgress?.(`파일 읽는 중... (${current}/${total}) ${fname}`);
  });

  if (lang === 'unknown' || files.length === 0) {
    throw new Error('분석 가능한 파일(.java .py .xml .yml .sql 등)이 없습니다.');
  }

  onProgress?.('완료!');
  const snippets = generateFileSnippets(files);
  return generatePack(name, lang, snippets);
}

export async function importPatterns(
  onProgress?: (msg: string) => void,
): Promise<Pack> {
  onProgress?.('프로젝트 폴더를 선택해주세요...');

  const scan = await selectAndScanFolder((current, total, fname) => {
    onProgress?.(`파일 스캔 중... (${current}/${total}) ${fname}`);
  });

  if (scan.lang === 'unknown') {
    throw new Error('분석 가능한 파일이 없습니다.');
  }

  onProgress?.('Tree-Sitter 초기화 중...');
  await initTreeSitter();

  const tsReady = isTreeSitterReady();
  if (!tsReady) {
    console.warn('Tree-sitter를 초기화할 수 없어 regex 폴백으로 진행합니다.');
  }

  const allPatterns: Array<{
    type: 'class' | 'method' | 'interface' | 'annotation' | 'import' | 'package';
    name: string;
    code: string;
    file: string;
    lang: 'java' | 'python';
    lineCount: number;
    category: string;
    comment: string;
  }> = [];

  let done = 0;
  for (const f of scan.files) {
    if (f.lang !== 'java' && f.lang !== 'python') continue;
    done++;
    onProgress?.(`분석 중... (${done}/${scan.files.length}) ${f.path}`);

    try {
      const parsed = await parseSource(f.lang, f.content);
      const patterns = extractPatterns(f.lang, parsed.tree, parsed.text, f.path);
      allPatterns.push(...patterns);
    } catch {
      // skip unparseable files
    }
  }

  onProgress?.('패턴 생성 중...');
  if (allPatterns.length === 0) {
    throw new Error('추출된 패턴이 없습니다. 다른 프로젝트를 선택해보세요.');
  }
  const snippets = generateSnippets(allPatterns);
  return generatePack(scan.name + '-patterns', scan.lang, snippets);
}
