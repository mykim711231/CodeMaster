import { openDB, type DBSchema, type IDBPDatabase } from 'idb';

// 학습 기록(타이핑 세션). 소스코드 원문은 저장하지 않는다(PRD §13.5).
export interface SessionRecord {
  id?: number;
  ts: number;
  lang: string;
  wpm: number;
  accuracy: number;
  chars: number;
  correct: number;
  durationMs: number;
}

// 패턴 숙련도 (학습 엔진 §15 연계) — 후속 단계에서 사용
export interface PatternRecord {
  patternId: string;
  mastery: number; // 0–100 (EWMA)
  box: 1 | 2 | 3; // Leitner
  lastPracticed: number;
  sessionCount: number;
}

interface CodeMasterDB extends DBSchema {
  settings: { key: string; value: unknown };
  sessions: { key: number; value: SessionRecord; indexes: { 'by-ts': number } };
  patterns: { key: string; value: PatternRecord };
}

let dbPromise: Promise<IDBPDatabase<CodeMasterDB>> | null = null;

function getDb(): Promise<IDBPDatabase<CodeMasterDB>> {
  if (!dbPromise) {
    dbPromise = openDB<CodeMasterDB>('codemaster', 1, {
      upgrade(db) {
        db.createObjectStore('settings');
        const sessions = db.createObjectStore('sessions', {
          keyPath: 'id',
          autoIncrement: true,
        });
        sessions.createIndex('by-ts', 'ts');
        db.createObjectStore('patterns', { keyPath: 'patternId' });
      },
    });
  }
  return dbPromise;
}

export async function saveSession(rec: SessionRecord): Promise<void> {
  const db = await getDb();
  await db.put('sessions', rec);
}

export async function getRecentSessions(limit = 20): Promise<SessionRecord[]> {
  const db = await getDb();
  const all = await db.getAllFromIndex('sessions', 'by-ts');
  return all.reverse().slice(0, limit);
}

export async function getSetting<T>(key: string): Promise<T | undefined> {
  const db = await getDb();
  return (await db.get('settings', key)) as T | undefined;
}

export async function setSetting(key: string, value: unknown): Promise<void> {
  const db = await getDb();
  await db.put('settings', value, key);
}

export async function saveDirectoryHandle(
  name: string,
  handle: FileSystemDirectoryHandle,
): Promise<void> {
  const db = await getDb();
  await db.put('settings', handle, `dirHandle:${name}`);
}

export async function getDirectoryHandle(
  name: string,
): Promise<FileSystemDirectoryHandle | null> {
  const db = await getDb();
  try {
    const handle = await db.get('settings', `dirHandle:${name}`);
    return (handle as FileSystemDirectoryHandle) ?? null;
  } catch {
    return null;
  }
}
