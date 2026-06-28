import { openDB } from 'idb';

export interface ScanResult {
  name: string;
  lang: 'java' | 'python' | 'unknown';
  files: ScannedFile[];
  totalFiles: number;
  analyzedFiles: number;
  skippedFiles: number;
}

export interface ScannedFile {
  path: string;
  name: string;
  content: string;
  lang: 'java' | 'python' | 'unknown';
  size: number;
}

const EXCLUDE_DIRS = new Set([
  'test',
  'tests',
  'node_modules',
  'build',
  'target',
  '.git',
  '__pycache__',
  'dist',
  '.idea',
  'venv',
  '.venv',
  'env',
  'out',
  '.svn',
]);

const MAX_FILES = 1000;

function extLang(ext: string): 'java' | 'python' | 'unknown' {
  if (ext === '.java') return 'java';
  if (ext === '.py') return 'python';
  return 'unknown';
}

interface FileEntry {
  path: string;
  name: string;
  handle: FileSystemFileHandle;
}

async function scanDirectory(
  dirHandle: FileSystemDirectoryHandle,
  basePath: string,
  files: FileEntry[],
): Promise<void> {
  for await (const [name, handle] of dirHandle.entries()) {
    if (handle.kind === 'directory') {
      if (EXCLUDE_DIRS.has(name)) continue;
      await scanDirectory(
        handle as FileSystemDirectoryHandle,
        basePath ? `${basePath}/${name}` : name,
        files,
      );
    } else if (handle.kind === 'file') {
      const ext = name.lastIndexOf('.') >= 0 ? name.slice(name.lastIndexOf('.')) : '';
      if (ext === '.java' || ext === '.py') {
        files.push({
          path: basePath ? `${basePath}/${name}` : name,
          name,
          handle: handle as FileSystemFileHandle,
        });
      }
    }
    if (files.length >= MAX_FILES) break;
  }
}

async function readFileContent(handle: FileSystemFileHandle): Promise<string> {
  const file = await handle.getFile();
  return file.text();
}

export async function selectAndScanProject(
  onProgress?: (current: number, total: number, currentFile: string) => void,
): Promise<ScanResult> {
  let dirHandle: FileSystemDirectoryHandle;
  try {
    dirHandle = await window.showDirectoryPicker();
  } catch {
    throw new Error('폴더 선택이 취소되었습니다.');
  }

  const db = await openDB('codemaster');
  try {
    await db.put('settings', dirHandle, 'projectDirHandle');
  } catch {
    // handle 저장 실패는 무시
  }

  const fileEntries: FileEntry[] = [];
  await scanDirectory(dirHandle, '', fileEntries);

  let javaCount = 0;
  let pythonCount = 0;
  const scannedFiles: ScannedFile[] = [];
  let skipped = 0;

  for (let i = 0; i < fileEntries.length; i++) {
    const entry = fileEntries[i];
    onProgress?.(i + 1, fileEntries.length, entry.path);

    let content: string;
    try {
      content = await readFileContent(entry.handle);
    } catch {
      skipped++;
      continue;
    }

    const ext = entry.name.lastIndexOf('.') >= 0 ? entry.name.slice(entry.name.lastIndexOf('.')) : '';
    const lang = extLang(ext);

    if (lang === 'java') javaCount++;
    else if (lang === 'python') pythonCount++;

    scannedFiles.push({
      path: entry.path,
      name: entry.name,
      content,
      lang,
      size: new Blob([content]).size,
    });
  }

  const projectLang: 'java' | 'python' | 'unknown' =
    javaCount > 0 && pythonCount === 0 ? 'java'
    : pythonCount > 0 && javaCount === 0 ? 'python'
    : javaCount > 0 || pythonCount > 0 ? (javaCount >= pythonCount ? 'java' : 'python')
    : 'unknown';

  return {
    name: dirHandle.name,
    lang: projectLang,
    files: scannedFiles,
    totalFiles: fileEntries.length,
    analyzedFiles: scannedFiles.length,
    skippedFiles: skipped + (fileEntries.length - scannedFiles.length),
  };
}
