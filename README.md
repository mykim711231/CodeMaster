# CodeMaster

> 실제 코드를 따라치며 개발 **근육 기억(Muscle Memory)** 을 키우는 개발자 학습 PWA.
> Spring Boot · Python AI 실무 패턴을 타이핑으로 숙련한다.

**🔗 Live:** https://mykim711231.github.io/CodeMaster/

---

## 현재 상태 (Phase 1 — 단일 HTML PWA)

`index.html` 하나로 동작하는 프로토타입.

- **타이핑 트레이너** — 목표 코드 위 투명 입력 오버레이, 글자별 정/오 판정, 정타 시 **언어 구문 강조**, 오타는 **IDE식 물결 밑줄**(빨강=오타 / 황색=대소문자), 실시간 WPM·정확도·진행률
- **편집** — 캐럿 이동(화살표·클릭)으로 이전 줄 수정, 중간 입력 덮어쓰기, Enter 자동 들여쓰기, Tab 4칸
- **레이아웃** — 좌측 사이드 패널(학습팩 토글·로드맵·빠른학습·프로젝트, 아코디언) / 우측 패널(패턴 숙련도·오타 패턴) / 버거 메뉴 드롭다운
- **반응형** — 모바일(iPhone) 오프캔버스 드로어, 폭 고정·확대 방지, 터치 타깃 확대
- **테마** — 라이트/다크 토글(localStorage 유지)
- **PWA** — `manifest.json` + `sw.js`(오프라인 앱 셸 캐시)

## 파일 구조

```
index.html      # 앱 본체 (단일 HTML)
manifest.json   # PWA 매니페스트
sw.js           # Service Worker (오프라인 캐시)
icon.svg        # 앱 아이콘
prd.md          # 제품 요구사항 정의서 (기술 스택 적대적 검토 포함)
```

## 로컬 실행

정적 파일이라 빌드가 없습니다. 정적 서버로 열기만 하면 됩니다 (Service Worker는 `http(s)` 필요):

```bash
# 예: Python
python -m http.server 8080
# → http://localhost:8080
```

## 배포

`main` 브랜치에 push하면 **GitHub Pages** 가 자동 재배포합니다.

```bash
git add -A
git commit -m "변경 내용"
git push
```

## 로드맵

- **Phase 1 (현재)**: 단일 HTML · Python 구문강조 · 외부 CDN 제거 · SW · GitHub Pages
- **Phase 2**: Vite + Vanilla TS · Tree-Sitter(폴더 분석, **PC 전용**) · IndexedDB · Cloudflare Pages(COEP)
- **Phase 3**: Vitest · Playwright · 상태관리 체계화

자세한 기술 스택·NFR·리스크는 [`prd.md` §13](prd.md) 참조.
