import { createStore } from 'zustand/vanilla';

// 앱 전역 상태 (rAF 루프 내 직접 구독 금지 — getState() 또는 생명주기 단위 구독, PRD §13.1)
export interface AppState {
  lang: string;
  completedCount: number;
  bestWpm: number;
  setLang: (lang: string) => void;
  recordCompletion: (wpm: number) => void;
}

export const appStore = createStore<AppState>((set) => ({
  lang: 'java',
  completedCount: 0,
  bestWpm: 0,
  setLang: (lang) => set({ lang }),
  recordCompletion: (wpm) =>
    set((s) => ({ completedCount: s.completedCount + 1, bestWpm: Math.max(s.bestWpm, wpm) })),
}));
