import type { Level, Pack, Snippet } from '../types';

// Python 3.12 (안정) 기준 — PRD §8 / §8.1
const dataclass: Snippet = {
  id: 'dataclass',
  lang: 'python',
  title: 'Dataclass',
  file: 'user.py',
  code: `from dataclasses import dataclass


@dataclass
class User:
    id: int
    username: str
    active: bool = True`,
};

const typeHints: Snippet = {
  id: 'type-hints',
  lang: 'python',
  title: 'Type Hints',
  file: 'scores.py',
  code: `def average(scores: list[float]) -> float:
    if not scores:
        return 0.0
    return sum(scores) / len(scores)`,
};

const asyncSnippet: Snippet = {
  id: 'async',
  lang: 'python',
  title: 'Async TaskGroup',
  file: 'client.py',
  code: `import asyncio


async def fetch_all(urls: list[str]) -> list[str]:
    async with asyncio.TaskGroup() as tg:
        tasks = [tg.create_task(fetch(u)) for u in urls]
    return [t.result() for t in tasks]`,
};

const pydantic: Snippet = {
  id: 'pydantic',
  lang: 'python',
  title: 'Pydantic Model',
  file: 'schema.py',
  code: `from pydantic import BaseModel, Field


class UserCreate(BaseModel):
    username: str = Field(min_length=3, max_length=32)
    email: str
    age: int | None = None`,
};

const L = (no: number, name: string, snippets: Snippet[] = []): Level => ({ no, name, snippets });

export const pythonAiPack: Pack = {
  id: 'python-ai',
  name: 'Python AI',
  lang: 'python',
  levels: [
    L(1, 'Python Core', [dataclass, typeHints]),
    L(2, 'Async', [asyncSnippet]),
    L(3, 'Data'),
    L(4, 'Machine Learning'),
    L(5, 'Deep Learning'),
    L(6, 'LLM'),
    L(7, 'RAG'),
    L(8, 'AI Agent'),
    L(9, 'Framework'),
    L(10, 'Production AI', [pydantic]),
    L(11, 'Vector Store'),
    L(12, 'LLM 서빙·최적화'),
    L(13, '프롬프트·구조화 출력'),
    L(14, 'Fine-tuning & MLOps'),
    L(15, 'AI 품질·관측·보안'),
  ],
};
