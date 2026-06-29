import type { Pack } from '../content/types';
import { selectAndScanFolder } from './scanner';
import { generateFileSnippets, generateSnippets, generatePack } from './generator';
import { initTreeSitter, parseSource, isTreeSitterReady } from './parser';
import { extractPatterns } from './extractor';
import type { ExtractedPattern } from './extractor';

function simpleSimilarity(a: string, b: string): number {
  const setA = new Set(a.toLowerCase().split(/\s+/).filter(w => w.length > 2));
  const setB = new Set(b.toLowerCase().split(/\s+/).filter(w => w.length > 2));
  let intersection = 0;
  for (const w of setA) if (setB.has(w)) intersection++;
  const union = setA.size + setB.size - intersection;
  return union === 0 ? 0 : intersection / union;
}

function signatureSim(a: ExtractedPattern, b: ExtractedPattern): number {
  if (a.type !== b.type) return 0;
  // 메서드 시그니처 유사도 (이름 + 파라미터)
  const nameA = a.name;
  const nameB = b.name;
  if (nameA === nameB) return 1;
  // 레벤슈타인 유사도 근사
  const maxLen = Math.max(nameA.length, nameB.length);
  if (maxLen === 0) return 0;
  let dist = 0;
  for (let i = 0; i < maxLen; i++) {
    if (nameA[i] !== nameB[i]) dist++;
  }
  return 1 - dist / maxLen;
}

function deduplicatePatterns(patterns: ExtractedPattern[]): ExtractedPattern[] {
  const result: ExtractedPattern[] = [];
  for (const p of patterns) {
    let isDuplicate = false;
    for (const existing of result) {
      const sigSim = signatureSim(p, existing);
      const bodySim = simpleSimilarity(p.code, existing.code);
      // 시그니처 0.8 이상 AND 본문 0.7 이상이면 중복으로 판단
      if (sigSim >= 0.8 && bodySim >= 0.7) {
        isDuplicate = true;
        // 더 긴/상세한 코드 유지
        if (p.code.length > existing.code.length) {
          const idx = result.indexOf(existing);
          result[idx] = p;
        }
        break;
      }
    }
    if (!isDuplicate) result.push(p);
  }
  return result;
}

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

  const allPatterns: ExtractedPattern[] = [];

  let done = 0;
  for (const f of scan.files) {
    if (f.lang !== 'java' && f.lang !== 'python') continue;
    done++;
    onProgress?.(`분석 중... (${done}/${scan.files.length}) ${f.path}`);

    try {
      const parsed = await parseSource(f.lang, f.content);
      const patterns = extractPatterns(f.lang, parsed.tree, parsed.text, f.path);
      parsed.tree.delete();
      allPatterns.push(...patterns);
    } catch {
      // skip unparseable files
    }
  }

  onProgress?.('패턴 생성 중...');
  if (allPatterns.length === 0) {
    throw new Error('추출된 패턴이 없습니다. 다른 프로젝트를 선택해보세요.');
  }

  // 중복/유사 패턴 제거
  const uniquePatterns = deduplicatePatterns(allPatterns);

  // 구문 검증: 파싱이 성공하는 패턴만 남김
  const validPatterns: ExtractedPattern[] = [];
  for (const p of uniquePatterns) {
    try {
      const parsed = await parseSource(p.lang, p.code);
      // 에러 노드가 있으면 버림
      const hasError = parsed.tree.rootNode.hasError;
      parsed.tree.delete();
      if (!hasError) validPatterns.push(p);
    } catch {
      // 파싱 실패 시 버림
    }
  }

  if (validPatterns.length === 0) {
    throw new Error('유효한 패턴이 없습니다(구문 오류).');
  }

  const snippets = generateSnippets(validPatterns);
  return generatePack(scan.name + '-patterns', scan.lang, snippets);
}
