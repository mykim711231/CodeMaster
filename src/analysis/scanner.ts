export interface ScannedFile {
  path: string;
  name: string;
  content: string;
  lang: 'java' | 'python' | 'unknown';
  size: number;
}

function extLang(ext: string): 'java' | 'python' | 'unknown' {
  if (ext === '.java' || ext === '.kt' || ext === '.groovy') return 'java';
  if (ext === '.xml' || ext === '.yml' || ext === '.yaml' ||
      ext === '.gradle' || ext === '.properties' || ext === '.sql' || ext === '.json') return 'java';
  if (ext === '.py' || ext === '.cfg' || ext === '.toml') return 'python';
  return 'unknown';
}

export async function selectFiles(
  onProgress?: (current: number, total: number, name: string) => void,
): Promise<{ name: string; lang: 'java' | 'python' | 'unknown'; files: ScannedFile[] }> {
  // Common folder name 추출을 위한 핸들
  const handles = await window.showOpenFilePicker({
    multiple: true,
    types: [
      {
        description: 'Code files',
        accept: {
          'text/*': ['.java', '.py', '.xml', '.yml', '.yaml', '.sql',
                     '.gradle', '.properties', '.json', '.kt', '.groovy', '.toml', '.cfg'],
        },
      },
    ],
  });

  if (handles.length === 0) throw new Error('파일이 선택되지 않았습니다.');

  const files: ScannedFile[] = [];
  let javaCount = 0;
  let pythonCount = 0;

  for (let i = 0; i < handles.length; i++) {
    const h = handles[i];
    const file = await h.getFile();
    const name = file.name;
    const ext = name.lastIndexOf('.') >= 0 ? name.slice(name.lastIndexOf('.')) : '';
    const lang = extLang(ext);

    if (lang === 'java') javaCount++;
    else if (lang === 'python') pythonCount++;

    onProgress?.(i + 1, handles.length, name);

    files.push({
      path: name,
      name,
      content: await file.text(),
      lang,
      size: file.size,
    });
  }

  const lang: 'java' | 'python' | 'unknown' =
    javaCount > 0 && pythonCount === 0 ? 'java'
    : pythonCount > 0 && javaCount === 0 ? 'python'
    : javaCount > 0 || pythonCount > 0 ? (javaCount >= pythonCount ? 'java' : 'python')
    : 'unknown';

  // 프로젝트명은 첫 파일명에서 확장자 뺀 것
  const projName = handles[0].name.replace(/\.[^.]+$/, '');

  return { name: projName, lang, files };
}
