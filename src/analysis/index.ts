import type { Pack } from '../content/types';
import type { ExtractedPattern } from './extractor';
import { initTreeSitter, parseSource, isTreeSitterReady } from './parser';
import { extractPatterns } from './extractor';
import { selectAndScanProject } from './scanner';
import { generateSnippets, generatePack } from './generator';

export interface AnalysisResult {
  pack: Pack;
  stats: {
    totalFiles: number;
    analyzedFiles: number;
    extractedPatterns: number;
    generatedSnippets: number;
    durationMs: number;
  };
}

export async function analyzeProject(
  onProgress?: (msg: string) => void
): Promise<AnalysisResult> {
  const startTime = Date.now();

  onProgress?.('프로젝트 폴더를 선택해주세요...');
  const scanResult = await selectAndScanProject((current, total, currentFile) => {
    onProgress?.(`파일 스캔 중... (${current}/${total}) ${currentFile}`);
  });

  if (scanResult.lang === 'unknown') {
    throw new Error('분석 가능한 언어(Java/Python) 파일을 찾을 수 없습니다.');
  }

  onProgress?.('Tree-sitter 초기화 중...');
  await initTreeSitter();

  if (!isTreeSitterReady()) {
    onProgress?.('Tree-sitter를 사용할 수 없어 정규식 폴백 모드로 진행합니다.');
  }

  const allPatterns: ExtractedPattern[] = [];
  let analyzedFiles = 0;

  for (const file of scanResult.files) {
    if (file.lang !== 'java' && file.lang !== 'python') {
      continue;
    }

    onProgress?.(`분석 중... (${analyzedFiles + 1}/${scanResult.analyzedFiles}) ${file.path}`);

    try {
      const parseResult = await parseSource(file.lang, file.content);
      const patterns = extractPatterns(
        file.lang,
        parseResult.tree,
        parseResult.text,
        file.path,
      );
      allPatterns.push(...patterns);
    } catch {
      // skip files that can't be parsed
    }

    analyzedFiles++;
  }

  onProgress?.('스니펫 생성 중...');
  const snippets = generateSnippets(allPatterns);

  const pack = generatePack(scanResult.name, scanResult.lang, snippets);
  const durationMs = Date.now() - startTime;

  onProgress?.('분석 완료!');

  return {
    pack,
    stats: {
      totalFiles: scanResult.totalFiles,
      analyzedFiles,
      extractedPatterns: allPatterns.length,
      generatedSnippets: snippets.length,
      durationMs,
    },
  };
}
