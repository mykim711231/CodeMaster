import { getRecentSessions, getWrongAnswers } from '../storage/db';
import type { SessionRecord, WrongAnswerRecord } from '../storage/db';
import { PACKS } from '../content';

function findSnippetTitle(snippetId: string): string {
  for (const pack of Object.values(PACKS)) {
    for (const level of pack.levels) {
      for (const snippet of level.snippets) {
        if (snippet.id === snippetId) return snippet.title;
      }
    }
  }
  return snippetId;
}

function formatTimeAgo(ts: number): string {
  const diff = Date.now() - ts;
  const min = Math.floor(diff / 60000);
  if (min < 1) return '방금';
  if (min < 60) return `${min}분 전`;
  const hours = Math.floor(min / 60);
  if (hours < 24) return `${hours}시간 전`;
  const days = Math.floor(hours / 24);
  return `${days}일 전`;
}

function renderSummary(sessions: SessionRecord[]): void {
  const el = document.getElementById('statsSummary');
  if (!el) return;

  if (sessions.length === 0) {
    el.innerHTML = `
      <div class="rp-title"><i data-lucide="pie-chart"></i>요약</div>
      <p class="explain-concept">아직 연습 기록이 없습니다</p>
    `;
    return;
  }

  const totalSessions = sessions.length;
  const bestWpm = Math.max(...sessions.map((s) => s.wpm));
  const avgAccuracy = Math.round(
    sessions.reduce((sum, s) => sum + s.accuracy, 0) / sessions.length,
  );
  const totalTimeMin = Math.round(
    sessions.reduce((sum, s) => sum + s.durationMs, 0) / 60000,
  );

  el.innerHTML = `
    <div class="rp-title"><i data-lucide="pie-chart"></i>요약</div>
    <div class="skill-row">
      <span class="skill-label">총 연습</span>
      <span class="skill-pct" style="min-width:60px;text-align:left">${totalSessions}회</span>
    </div>
    <div class="skill-row">
      <span class="skill-label">최고 WPM</span>
      <span class="skill-pct" style="min-width:60px;text-align:left">${bestWpm}</span>
    </div>
    <div class="skill-row">
      <span class="skill-label">평균 정확도</span>
      <span class="skill-pct" style="min-width:60px;text-align:left">${avgAccuracy}%</span>
    </div>
    <div class="skill-row">
      <span class="skill-label">총 타이핑</span>
      <span class="skill-pct" style="min-width:60px;text-align:left">${totalTimeMin}분</span>
    </div>
  `;
}

function renderRecentSessions(sessions: SessionRecord[]): void {
  const el = document.getElementById('statsRecent');
  if (!el) return;

  const recent = sessions.slice(0, 20);

  if (recent.length === 0) {
    el.innerHTML = `
      <div class="rp-title"><i data-lucide="history"></i>최근 세션</div>
      <p class="explain-concept">기록 없음</p>
    `;
    return;
  }

  const items = recent
    .map((s) => {
      const sAny = s as SessionRecord & { snippetId?: string };
      const title = sAny.snippetId ? findSnippetTitle(sAny.snippetId) : '연습';
      const timeAgo = formatTimeAgo(s.ts);
      return `
      <div class="skill-row">
        <span class="skill-label" style="width:auto;flex:1">${title}</span>
        <span class="skill-pct" style="min-width:45px">${s.wpm}wpm</span>
        <span class="skill-pct" style="min-width:35px">${Math.round(s.accuracy)}%</span>
        <span class="skill-pct" style="min-width:55px;font-size:9px">${timeAgo}</span>
      </div>
    `;
    })
    .join('');

  el.innerHTML = `
    <div class="rp-title"><i data-lucide="history"></i>최근 세션</div>
    ${items}
  `;
}

function renderWrongAnswers(wrongAnswers: WrongAnswerRecord[]): void {
  const el = document.getElementById('statsWrong');
  if (!el) return;

  if (wrongAnswers.length === 0) {
    el.innerHTML = `
      <div class="rp-title"><i data-lucide="alert-triangle"></i>오답 목록</div>
      <p class="explain-concept">오답 없음</p>
    `;
    return;
  }

  const items = wrongAnswers
    .map((w) => {
      const title = findSnippetTitle(w.id);
      return `
      <div class="error-item">
        <div class="error-dot"></div>
        <div>
          <div class="error-code">${title}</div>
          <div class="error-desc">정확도 ${Math.round(w.accuracy)}%</div>
        </div>
      </div>
    `;
    })
    .join('');

  el.innerHTML = `
    <div class="rp-title"><i data-lucide="alert-triangle"></i>오답 목록</div>
    ${items}
  `;
}

async function loadStats(): Promise<void> {
  try {
    const sessions = await getRecentSessions(200);
    const wrongAnswers = await getWrongAnswers(50);

    renderSummary(sessions);
    renderRecentSessions(sessions);
    renderWrongAnswers(wrongAnswers);
  } catch (err) {
    console.error('stats load failed:', err);
    const el = document.getElementById('statsSummary');
    if (el) el.innerHTML =
      '<div class="rp-title">요약</div><p class="explain-concept">통계를 불러올 수 없습니다</p>';
  }
}

export function initStats(): void {
  const modal = document.getElementById('statsModal');
  if (!modal) return;
  const openBtn = document.getElementById('statsMenuItem');
  const closeBtn = document.getElementById('statsClose');

  const open = (): void => {
    modal.classList.add('open');
    void loadStats();
  };
  const close = (): void => modal.classList.remove('open');

  openBtn?.addEventListener('click', open);
  closeBtn?.addEventListener('click', close);
  modal.addEventListener('click', (e) => {
    const target = e.target as HTMLElement | null;
    if (target?.closest('[data-close]')) close();
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') close();
  });
}
