# CodeMaster

> 실제 코드를 따라치며 개발 **근육 기억(Muscle Memory)** 을 키우는 개발자 학습 PWA.
> Spring Boot · Python AI 실무 패턴을 타이핑으로 숙련한다.

[![License](https://img.shields.io/badge/license-Apache--2.0-blue.svg)](LICENSE)
![PWA](https://img.shields.io/badge/PWA-offline-success.svg)
![Platform](https://img.shields.io/badge/platform-Web%20(Desktop%20%7C%20iOS%2FAndroid)-lightgrey.svg)

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
LICENSE         # Apache License 2.0
NOTICE          # 저작권·서드파티 귀속
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

## 기술 스택 (목표 아키텍처 — Phase 3 풀스택)

단일 HTML 유지 단계 없이 처음부터 **Vite + TypeScript 풀스택**으로 구성한다. (적대적 검토 완료 — [`prd.md` §13](prd.md))

| 레이어 | 선택 |
|--------|------|
| **언어/빌드** | TypeScript · Vite 5 · ESLint/Prettier |
| **프레임워크** | Vanilla TS (No-VDOM, 타이핑 루프 성능 우선) |
| **타이핑 엔진** | 자체 엔진 (글자별 span 오버레이 · rAF throttle · span 가상화) |
| **구문 강조** | 3-Tier 하이브리드 — Lezer 어댑터(Java·Python·XML) · 최소 regex(SQL·YAML·Bash·Dockerfile·TOML·Properties) · Prism.js(JSON) |
| **코드 분석** *(PC 전용)* | web-tree-sitter (Worker Pool) + regex 경량 폴백 |
| **상태 관리** | Zustand (vanilla store) |
| **저장** | idb · IndexedDB · OPFS · **학습팩 Cache Storage**(온디맨드) |
| **PWA/오프라인** | vite-plugin-pwa (Workbox) · Web App Manifest |
| **폰트/아이콘** | self-host woff2(JetBrains Mono·Inter) · lucide(npm ESM) |
| **테스트** | Vitest(단위) · Playwright WebKit(E2E) · BrowserStack(실기기) |
| **콘텐츠 파이프라인** | 팩 JSON 스키마 · 언어별 CI 린트 게이트 · OSS 추출(Tree-Sitter) · sha256/semver |
| **배포** | Cloudflare Pages(COEP/COOP/CSP) · Lighthouse CI — *현재는 GitHub Pages 부트스트랩* |

> 현 `index.html` 프로토타입을 위 풀스택으로 이식한다. 권장 빌드 순서·NFR·리스크는 [`prd.md` §13](prd.md) 참조.

## 라이선스

[Apache License 2.0](LICENSE) — Copyright 2026 mykim711231.

오픈소스에서 추출한 학습팩 스니펫의 출처·라이선스는 [`NOTICE`](NOTICE)에 누적 기재하며, 라이선스 정책은 [`prd.md` §18](prd.md)을 따른다.
