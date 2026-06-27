import type { Pack } from '../types';

// Python 3.12 (안정) 기준 — PRD §8.1
export const pythonAiPack: Pack = {
  id: 'python-ai',
  name: 'Python AI',
  lang: 'python',
  snippets: [
    {
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
    },
    {
      id: 'type-hints',
      lang: 'python',
      title: 'Type Hints',
      file: 'scores.py',
      code: `def average(scores: list[float]) -> float:
    if not scores:
        return 0.0
    return sum(scores) / len(scores)`,
    },
    {
      id: 'pydantic',
      lang: 'python',
      title: 'Pydantic Model',
      file: 'schema.py',
      code: `from pydantic import BaseModel, Field


class UserCreate(BaseModel):
    username: str = Field(min_length=3, max_length=32)
    email: str
    age: int | None = None`,
    },
    {
      id: 'async',
      lang: 'python',
      title: 'Async',
      file: 'client.py',
      code: `import asyncio


async def fetch_all(urls: list[str]) -> list[str]:
    async with asyncio.TaskGroup() as tg:
        tasks = [tg.create_task(fetch(u)) for u in urls]
    return [t.result() for t in tasks]`,
    },
  ],
};
