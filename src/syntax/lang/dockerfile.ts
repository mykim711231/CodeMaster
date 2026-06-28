import type { LangAdapter, TokenType } from '../registry';

const KW = new Set([
  'FROM', 'RUN', 'CMD', 'ENTRYPOINT', 'COPY', 'ADD', 'WORKDIR', 'EXPOSE',
  'ENV', 'ARG', 'LABEL', 'VOLUME', 'USER', 'HEALTHCHECK', 'ONBUILD', 'STOPSIGNAL',
  'SHELL', 'MAINTAINER',
]);

const RE =
  /(#[^\n]*)|("(?:[^"\\]|\\.)*")|([A-Za-z_]\w*)|([{}()[\];,.=+\-*/<>!&|:?%])/g;

export const dockerfileAdapter: LangAdapter = (src) => {
  const cls: (TokenType | null)[] = new Array(src.length).fill(null);
  let m: RegExpExecArray | null;
  RE.lastIndex = 0;
  while ((m = RE.exec(src))) {
    const t = m[0];
    let c: TokenType | null = null;
    if (m[1]) c = 'cm';
    else if (m[2]) c = 'str';
    else if (m[3]) c = KW.has(t) ? 'kw' : 'id';
    else if (m[4]) c = 'op';
    if (c !== null) {
      for (let k = 0; k < t.length; k++) cls[m.index + k] = c;
    }
  }
  return cls;
};
