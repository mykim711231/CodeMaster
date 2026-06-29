import { createStore } from 'zustand/vanilla';
import type { Snippet, Pack } from './content/types';

// 앱 전역 상태 (rAF 루프 내 직접 구독 금지 — getState() 또는 생명주기 단위 구독, PRD §13.1)
export interface AppState {
  lang: string;
  completedCount: number;
  bestWpm: number;
  setLang: (lang: string) => void;
  recordCompletion: (wpm: number) => void;

  // 프로젝트 분석 상태
  projectPack: Pack | null;
  projectPackSnippets: Snippet[];
  isAnalyzing: boolean;
  analysisProgress: string;
  setProjectPack: (pack: Pack) => void;
  setIsAnalyzing: (v: boolean) => void;
  setAnalysisProgress: (msg: string) => void;
  clearProjectPack: () => void;

  // 에디터 설정
  tabSize: number;
  fontSize: number;
  setTabSize: (n: number) => void;
  setFontSize: (n: number) => void;

  // 에디터 동작
  overwriteMode: boolean;
  setOverwriteMode: (v: boolean) => void;

  autoIndent: boolean;
  setAutoIndent: (v: boolean) => void;
  autoNext: boolean;
  setAutoNext: (v: boolean) => void;

  lineNum: boolean;
  setLineNum: (v: boolean) => void;
  indentGuide: boolean;
  setIndentGuide: (v: boolean) => void;
  tabChar: boolean;
  setTabChar: (v: boolean) => void;
}

export const appStore = createStore<AppState>((set) => ({
  lang: 'java',
  completedCount: 0,
  bestWpm: 0,
  setLang: (lang) => set({ lang }),
  recordCompletion: (wpm) =>
    set((s) => ({ completedCount: s.completedCount + 1, bestWpm: Math.max(s.bestWpm, wpm) })),

  projectPack: null,
  projectPackSnippets: [],
  isAnalyzing: false,
  analysisProgress: '',
  setProjectPack: (pack) => {
    const snippets: Snippet[] = [];
    for (const level of pack.levels) {
      snippets.push(...level.snippets);
    }
    set({ projectPack: pack, projectPackSnippets: snippets });
  },
  setIsAnalyzing: (v) => set({ isAnalyzing: v }),
  setAnalysisProgress: (msg) => set({ analysisProgress: msg }),
  clearProjectPack: () => set({ projectPack: null, projectPackSnippets: [] }),

  tabSize: 4,
  fontSize: 14,
  setTabSize: (n) => set({ tabSize: n }),
  setFontSize: (n) => set({ fontSize: n }),

  overwriteMode: true,
  setOverwriteMode: (v) => set({ overwriteMode: v }),

  autoIndent: true,
  setAutoIndent: (v) => set({ autoIndent: v }),
  autoNext: false,
  setAutoNext: (v) => set({ autoNext: v }),

  lineNum: true,
  setLineNum: (v) => set({ lineNum: v }),
  indentGuide: false,
  setIndentGuide: (v) => set({ indentGuide: v }),
  tabChar: false,
  setTabChar: (v) => set({ tabChar: v }),
}));
