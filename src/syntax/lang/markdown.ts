import type { LangAdapter, TokenType } from '../registry';

export const markdownAdapter: LangAdapter = (src) => {
  const cls: (TokenType | null)[] = new Array(src.length).fill(null);

  // 코드블록 ``` ... ``` (전체 소스에서 먼저 처리)
  let m: RegExpExecArray | null;
  const fencedRE = /```[\s\S]*?```/g;
  fencedRE.lastIndex = 0;
  while ((m = fencedRE.exec(src))) {
    for (let k = 0; k < m[0].length; k++) cls[m.index + k] = 'cm';
  }

  const lines = src.split('\n');
  let globalIdx = 0;
  for (const line of lines) {
    if (globalIdx < src.length && cls[globalIdx] === 'cm') {
      globalIdx += line.length + 1;
      continue;
    }

    const trimmed = line.trimStart();
    const indent = line.length - trimmed.length;

    // 구분선 --- (헤더보다 먼저 체크)
    if (/^---+\s*$/.test(trimmed)) {
      const start = globalIdx + indent;
      for (let k = 0; k < trimmed.length; k++) cls[start + k] = 'op';
      globalIdx += line.length + 1;
      continue;
    }

    // 헤더 (# ## ### ...)
    const hdrMatch = /^(#{1,6})\s/.exec(trimmed);
    if (hdrMatch) {
      const start = globalIdx + indent;
      for (let k = 0; k < hdrMatch[1].length; k++) cls[start + k] = 'kw';
    }

    // 리스트 마커 (- * 1.)
    const listMatch = /^(\s*)(- |\* |\d+\. )/.exec(line);
    if (listMatch) {
      const start = globalIdx + listMatch[1].length;
      const marker = listMatch[2];
      for (let k = 0; k < marker.length; k++) cls[start + k] = 'op';
    }

    // 인용 >
    const quoteMatch = /^(\s*)(>\s?)/.exec(line);
    if (quoteMatch) {
      const start = globalIdx + quoteMatch[1].length;
      for (let k = 0; k < quoteMatch[2].length; k++) cls[start + k] = 'cm';
    }

    // **볼드** *이탤릭* `코드` [링크](url)
    const inlineRE = /(\*\*[^*]+\*\*)|(\*(?!\s)[^*]+\*(?!\*))|(`[^`\n]+`)|(\[[^\]]+\]\([^)]+\))/g;
    inlineRE.lastIndex = 0;
    let im: RegExpExecArray | null;
    while ((im = inlineRE.exec(line))) {
      const t = im[0];
      const idx = globalIdx + im.index;
      let c: TokenType | null = null;
      if (im[1] || im[2]) c = 'str';
      else if (im[3]) c = 'str';
      else if (im[4]) c = 'ann';
      for (let k = 0; k < t.length; k++) cls[idx + k] = c;
    }

    globalIdx += line.length + 1;
  }

  return cls;
};
