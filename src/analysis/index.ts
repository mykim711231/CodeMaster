import { selectFiles } from './scanner';
import { generateFileSnippets, generatePack } from './generator';
import type { Pack } from '../content/types';

export async function importProject(
  onProgress?: (msg: string) => void,
): Promise<Pack | null> {
  onProgress?.('연습할 파일을 선택해주세요 (여러 개 가능)...');

  const { name, lang, files } = await selectFiles((current, total, fname) => {
    onProgress?.(`파일 읽는 중... (${current}/${total}) ${fname}`);
  });

  if (lang === 'unknown' || files.length === 0) {
    throw new Error('지원하는 파일(.java, .py, .xml, .yml, .sql 등)을 선택해주세요.');
  }

  onProgress?.('완료!');
  const snippets = generateFileSnippets(files);
  return generatePack(name, lang, snippets);
}
