import type { Level, Pack, Snippet } from '../types';
import { pythonCore } from './_staging/P1-pc';
import { pythonAsync } from './_staging/P2-pasync';
import { pythonData } from './_staging/P3-pdata';
import { pythonML } from './_staging/P4-pml';
import { pythonDL } from './_staging/P5-pdl';
import { pythonLLM } from './_staging/P6-pllm';
import { pythonRAG } from './_staging/P7-prag';
import { pythonAgent } from './_staging/P8-pagent';
import { pythonFramework } from './_staging/P9-pframe';
import { pythonProduction } from './_staging/P10-pprod';
import { pythonVector } from './_staging/P11-pvec';
import { pythonServing } from './_staging/P12-pserve';
import { pythonPrompt } from './_staging/P13-pprompt';
import { pythonFineTuning } from './_staging/P14-pft';
import { pythonQuality } from './_staging/P15-pqual';

// Python 3.12 (안정) 기준 - PRD §8 / §8.1

const L = (no: number, name: string, snippets: Snippet[] = []): Level => ({ no, name, snippets });

export const pythonAiPack: Pack = {
  id: 'python-ai',
  name: 'Python AI',
  lang: 'python',
  levels: [
    L(1, 'Python Core', pythonCore),
    L(2, 'Async', pythonAsync),
    L(3, 'Data', pythonData),
    L(4, 'Machine Learning', pythonML),
    L(5, 'Deep Learning', pythonDL),
    L(6, 'LLM', pythonLLM),
    L(7, 'RAG', pythonRAG),
    L(8, 'AI Agent', pythonAgent),
    L(9, 'Framework', pythonFramework),
    L(10, 'Production AI', pythonProduction),
    L(11, 'Vector Store', pythonVector),
    L(12, 'LLM 서빙·최적화', pythonServing),
    L(13, '프롬프트·구조화 출력', pythonPrompt),
    L(14, 'Fine-tuning & MLOps', pythonFineTuning),
    L(15, 'AI 품질·관측·보안', pythonQuality),
  ],
};
