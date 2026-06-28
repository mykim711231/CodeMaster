import type { Pack } from '../content/types';
import { selectAndScanFolder } from './scanner';
import { generateFileSnippets, generatePack } from './generator';

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
