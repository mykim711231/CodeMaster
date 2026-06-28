import type { ScannedFile } from './scanner';
import { selectAndScanFolder } from './scanner';
import { generateFileSnippets, generatePack } from './generator';
import type { Pack } from '../content/types';

export type { ScannedFile };

let _scanResult: { name: string; lang: 'java' | 'python' | 'unknown'; files: ScannedFile[] } | null = null;

export function getScannedFiles() {
  return _scanResult;
}

export function clearScannedFiles() {
  _scanResult = null;
}

export async function scanFolder(
  onProgress?: (msg: string) => void,
): Promise<{ name: string; lang: string; files: ScannedFile[] }> {
  onProgress?.('프로젝트 폴더를 선택해주세요...');
  _scanResult = await selectAndScanFolder((current, total, name) => {
    onProgress?.(`스캔 중... (${current}/${total}) ${name}`);
  });
  return _scanResult;
}

export function buildPackFromFiles(name: string, lang: 'java' | 'python', files: ScannedFile[]): Pack {
  const selected = files.filter((f) => f.selected);
  const snippets = generateFileSnippets(selected);
  return generatePack(name, lang, snippets);
}
