import { springBootPack } from './packs/spring-boot';
import { pythonAiPack } from './packs/python-ai';
import type { Pack } from './types';

// 학습팩 레지스트리 (현재는 번들 내장 — 추후 Cache Storage 온디맨드 로딩으로 대체, PRD §10.1)
export const PACKS: Record<string, Pack> = {
  java: springBootPack,
  python: pythonAiPack,
};

export { springBootPack, pythonAiPack };
export type { Pack, Level, Snippet, Lang } from './types';
