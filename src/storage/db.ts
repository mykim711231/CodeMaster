import { openDB, type DBSchema, type IDBPDatabase } from 'idb';
import { createIcons, Flame, Zap } from 'lucide';

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
  snippetId?: string;
}

// 패턴 숙련도 (학습 엔진 §15 연계) — 후속 단계에서 사용
export interface PatternRecord {
  patternId: string;
  mastery: number; // 0–100 (EWMA)
  box: 1 | 2 | 3; // Leitner
  lastPracticed: number;
  sessionCount: number;
}

export interface WrongAnswerRecord {
  id: string;
  accuracy: number;
  ts: number;
}

export interface TypoPatternRecord {
  pattern: string;
  count: number;
}

interface CodeMasterDB extends DBSchema {
  settings: { key: string; value: unknown };
  sessions: { key: number; value: SessionRecord; indexes: { 'by-ts': number } };
  patterns: { key: string; value: PatternRecord };
  wrongAnswers: { key: string; value: WrongAnswerRecord };
  typoPatterns: { key: string; value: TypoPatternRecord };
}

let dbPromise: Promise<IDBPDatabase<CodeMasterDB>> | null = null;

function getDb(): Promise<IDBPDatabase<CodeMasterDB>> {
  if (!dbPromise) {
    dbPromise = openDB<CodeMasterDB>('codemaster', 2, {
      upgrade(db, oldVersion) {
        if (oldVersion < 1) {
          db.createObjectStore('settings');
          const sessions = db.createObjectStore('sessions', {
            keyPath: 'id',
            autoIncrement: true,
          });
          sessions.createIndex('by-ts', 'ts');
          db.createObjectStore('patterns', { keyPath: 'patternId' });
        }
        if (oldVersion < 2) {
          if (!db.objectStoreNames.contains('wrongAnswers')) {
            db.createObjectStore('wrongAnswers', { keyPath: 'id' });
          }
          if (!db.objectStoreNames.contains('typoPatterns')) {
            db.createObjectStore('typoPatterns', { keyPath: 'pattern' });
          }
        }
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

export async function addWrongAnswer(snippetId: string, accuracy: number): Promise<void> {
  const db = await getDb();
  await db.put('wrongAnswers', { id: snippetId, accuracy, ts: Date.now() });
  const all = await db.getAll('wrongAnswers');
  if (all.length > 50) {
    const oldest = all.sort((a, b) => a.ts - b.ts).slice(0, all.length - 50);
    for (const o of oldest) await db.delete('wrongAnswers', o.id);
  }
}

export async function getWrongAnswers(limit = 20): Promise<WrongAnswerRecord[]> {
  const db = await getDb();
  const all = await db.getAll('wrongAnswers');
  return all.sort((a, b) => b.ts - a.ts).slice(0, limit);
}

export async function clearWrongAnswers(): Promise<void> {
  const db = await getDb();
  await db.clear('wrongAnswers');
}

export async function addTypoPattern(pattern: string, count: number): Promise<void> {
  const db = await getDb();
  const existing = await db.get('typoPatterns', pattern);
  if (existing) {
    existing.count += count;
    await db.put('typoPatterns', existing);
  } else {
    await db.put('typoPatterns', { pattern, count });
  }
}

export async function getWeakPatterns(limit = 10): Promise<TypoPatternRecord[]> {
  const db = await getDb();
  const all = await db.getAll('typoPatterns');
  return all.sort((a, b) => b.count - a.count).slice(0, limit);
}

export async function getStreak(): Promise<number> {
  const sessions = await getRecentSessions(365);
  if (sessions.length === 0) return 0;

  const days = new Set<string>();
  for (const s of sessions) {
    days.add(new Date(s.ts).toISOString().slice(0, 10));
  }

  let streak = 0;
  const today = new Date();
  for (let i = 0; i < 365; i++) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    const key = d.toISOString().slice(0, 10);
    if (days.has(key)) streak++;
    else break;
  }
  return streak;
}

export async function getTotalXP(): Promise<number> {
  const sessions = await getRecentSessions(1000);
  let xp = 0;
  for (const s of sessions) {
    xp += Math.round(s.wpm * (s.accuracy / 100) * (s.chars / 100));
  }
  return xp;
}

export async function updateTopbar(): Promise<void> {
  const [streak, xp] = await Promise.all([getStreak(), getTotalXP()]);

  const streakEl = document.querySelector('.streak-badge');
  const xpEl = document.querySelector('.xp-badge');
  if (streakEl) streakEl.innerHTML = `<i data-lucide="flame"></i> ${streak}일 연속`;
  if (xpEl) xpEl.innerHTML = `<i data-lucide="zap"></i> ${xp.toLocaleString()} XP`;

  createIcons({ icons: { Flame, Zap } });
}
