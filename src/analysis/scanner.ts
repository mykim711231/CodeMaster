export interface ScannedFile {
  path: string;
  name: string;
  content: string;
  lang: 'java' | 'python' | 'unknown';
  size: number;
}

function extLang(name: string): 'java' | 'python' | 'unknown' {
  if (name === 'Dockerfile') return 'java';
  const ext = name.lastIndexOf('.') >= 0 ? name.slice(name.lastIndexOf('.')) : '';
  if (ext === '.java' || ext === '.kt' || ext === '.groovy') return 'java';
  if (ext === '.xml' || ext === '.yml' || ext === '.yaml' ||
      ext === '.gradle' || ext === '.properties' || ext === '.sql' || ext === '.json') return 'java';
  if (ext === '.py' || ext === '.cfg' || ext === '.toml') return 'python';
  return 'unknown';
}

const EXCLUDE_DIRS = new Set([
  'test', 'tests', 'node_modules', 'build', 'target', '.git',
  '__pycache__', 'dist', '.idea', 'venv', '.venv', 'env', 'out', '.svn', '.gradle',
]);

const MAX_FILES = 500;

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
      const valid =
        ext === '.java' || ext === '.py' || ext === '.xml' || ext === '.yml' ||
        ext === '.yaml' || ext === '.sql' || ext === '.gradle' || ext === '.properties' ||
        ext === '.json' || ext === '.kt' || ext === '.groovy' || ext === '.toml' || ext === '.cfg' ||
        ext === '.js' || ext === '.ts' || ext === '.go' || ext === '.sh' || name === 'Dockerfile' ||
        ext === '.md' || ext === '.css' || ext === '.html' || ext === '.htm' ||
        ext === '.rs' || ext === '.c' || ext === '.cpp' || ext === '.h' || ext === '.rb';
      if (valid) {
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

export async function selectAndScanFolder(
  onProgress?: (current: number, total: number, name: string) => void,
): Promise<{
  name: string;
  lang: 'java' | 'python' | 'unknown';
  files: ScannedFile[];
}> {
  const dirHandle = await window.showDirectoryPicker();
  if (!dirHandle) throw new Error('폴더 선택이 취소되었습니다.');

  const entries: FileEntry[] = [];
  await scanDirectory(dirHandle, '', entries);

  let javaCount = 0;
  let pythonCount = 0;
  const files: ScannedFile[] = [];

  for (let i = 0; i < entries.length; i++) {
    const e = entries[i];
    onProgress?.(i + 1, entries.length, e.path);

    const file = await e.handle.getFile();
    const content = await file.text();
    const lang = extLang(e.name);

    if (lang === 'java') javaCount++;
    else if (lang === 'python') pythonCount++;

    files.push({
      path: e.path,
      name: e.name,
      content,
      lang,
      size: file.size,
    });
  }

  const lang: 'java' | 'python' | 'unknown' =
    javaCount > 0 && pythonCount === 0 ? 'java'
    : pythonCount > 0 && javaCount === 0 ? 'python'
    : javaCount > 0 || pythonCount > 0 ? (javaCount >= pythonCount ? 'java' : 'python')
    : 'unknown';

  return { name: dirHandle.name, lang, files };
}
