import type { Pack } from '../content/types';
import { selectAndScanProject } from './scanner';
import { generateFileSnippets, generatePack } from './generator';

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

  onProgress?.('파일 목록 생성 중...');
  const snippets = generateFileSnippets(scanResult.files);

  const pack = generatePack(scanResult.name, scanResult.lang, snippets);
  const durationMs = Date.now() - startTime;

  onProgress?.('완료!');

  return {
    pack,
    stats: {
      totalFiles: scanResult.totalFiles,
      analyzedFiles: scanResult.files.length,
      extractedPatterns: scanResult.files.length,
      generatedSnippets: snippets.length,
      durationMs,
    },
  };
}
