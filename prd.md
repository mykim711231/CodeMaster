# CodeMaster — PRD v3.1

> **부제:** Enterprise Backend & AI Developer Training Platform
> **문서 상태:** 정비본 (v3.0 → v3.1, 구조 정리 + 기술 스택 적대적 검토 반영)

---

## 1. 제품 비전

CodeMaster는 **단순 타이핑 연습기가 아니다.** 실제 프로젝트 소스코드와 오픈소스를 기반으로 다음을 목표로 하는 개발자 학습 플랫폼이다.

- Spring Boot 개발 생산성 향상
- Python AI 개발 생산성 향상
- 실무 패턴 숙련
- 코드 근육 기억(Muscle Memory) 형성

**장기 비전:** *Duolingo for Enterprise Developers* — 실제 프로젝트 코드 기반으로 Spring Boot · Python AI · TypeScript · Go · Rust를 빠르게 습득하는 개발자 훈련 플랫폼.

---

## 2. 목표 사용자

| 구분 | 대상 |
|------|------|
| **Primary** | Spring Boot 개발자 · 금융권 SI 개발자 · 공공기관 프로젝트 개발자 · 백엔드 취업 준비생 |
| **Secondary** | Python AI 개발자 · RAG 개발자 · AI Agent 개발자 |

---

## 3. 핵심 목표

1. Spring Boot 3 실무 생산성 향상
2. 금융권 FMS 구축에 필요한 패턴 학습
3. Python AI 개발 역량 확보
4. 실제 프로젝트 기반 반복 학습

---

## 4. MVP 범위

- **지원 언어 (MVP):** Java, Python
- **향후 지원:** TypeScript, Go, Rust

---

## 5. 학습 방식

1. **코드 따라치기** — 실제 코드를 보고 따라 입력 (근육 기억)
2. **프로젝트 소스코드 업로드** — 로컬 프로젝트 분석 후 학습 데이터 생성
3. **카테고리별 학습** — 주제/패턴 단위 집중
4. **오답 반복 학습** — 자주 틀리는 패턴 재출제
5. **숙련도 기반 자동 출제** — 취약 영역 우선

---

## 6. 프로젝트 분석 파이프라인

> **플랫폼: 데스크톱(PC) 전용.** 폴더 선택·소스 분석·패턴 추출은 **PC에서만** 제공한다. 모바일(iOS/Android)은 큐레이션·다운로드된 학습팩 타이핑만 지원하며, 프로젝트 분석 기능은 제공하지 않는다.
> → 이 범위 결정으로 모바일 관련 다수 리스크(iOS File System Access 핸들 영속화, Tree-Sitter WASM iPhone 8 성능, 모바일 1000파일 NFR)가 **해소**된다. (§13.3 참조)

```
[PC] 사용자 → 프로젝트 폴더 선택 → 소스코드 분석 → 패턴 추출 → 학습 데이터 생성
```

- **분석 대상 언어:** Java, Python (이후 TS/Go/Rust)

### 6.1 분석 엔진 — Tree-Sitter

- **지원 언어:** Java, Python, TypeScript, Go, Rust
- **추출 단위:** Class · Method · Interface · Annotation · Import · Package

---

## 7. 학습팩 — Spring Boot

| Level | 주제 | 세부 패턴 |
|:-----:|------|-----------|
| 1 | Java Core | Class, Interface, Enum, Record, Generic, Collection, Exception / *(Modern)* Lambda, Stream, Optional, CompletableFuture |
| 2 | Spring Core | DI(Component, Service, Repository, Controller), Configuration(Bean, Properties, Profile), AOP(Aspect, Advice, Pointcut) |
| 3 | Spring Boot MVC | Controller, RequestMapping, Validation, ExceptionHandler / *(API)* REST, Swagger, OpenAPI, FeignClient |
| 4 | Database | *(JPA)* Entity, Repository, JPQL, Specification, Transaction / *(MyBatis)* Mapper, ResultMap, Dynamic SQL, TypeHandler, XML Mapper |
| 5 | Concurrency | Thread, Runnable, Callable, Future, CompletableFuture / *(Pool)* ExecutorService, ThreadPoolExecutor, ForkJoinPool, ScheduledExecutor / *(Concurrent)* ConcurrentHashMap, BlockingQueue, AtomicInteger, Lock, Semaphore |
| 6 | Network | Socket, TCP, UDP, NIO, Netty |
| 7 | Gateway | Spring Cloud Gateway, Route, Filter, LoadBalancer, CircuitBreaker |
| 8 | Messaging | Kafka, RabbitMQ, JMS, Event Driven |
| 9 | Batch | Spring Batch, Job, Step, Reader, Processor, Writer |
| 10 | Security | Spring Security, JWT, OAuth2, RBAC, SecurityFilterChain |
| 11 | Cache | Redis, Caffeine, EhCache |
| 12 | Monitoring | Actuator, Micrometer, Prometheus, Grafana |
| 13 | Testing | JUnit5, Mockito, TestContainers |
| 14 | Architecture | MVC, Layered, Hexagonal, DDD, CQRS, Event Sourcing |
| 15 | Design Pattern | Singleton, Factory, Builder, Strategy, Observer, Template Method, Decorator, Adapter |

---

## 8. 학습팩 — Python AI

| Level | 주제 | 세부 패턴 |
|:-----:|------|-----------|
| 1 | Python Core | Function, Class, Module, Package, Dataclass, Typing |
| 2 | Async | Asyncio, Threading, Multiprocessing, Queue |
| 3 | Data | NumPy, Pandas, Matplotlib, Polars |
| 4 | Machine Learning | Scikit-Learn, XGBoost, LightGBM |
| 5 | Deep Learning | PyTorch, TensorFlow, Dataset, Training Loop |
| 6 | LLM | Transformers, Tokenizer, Embedding, SentenceTransformer |
| 7 | RAG | Chunking, Embedding, Vector Database, Retriever, Reranker, Hybrid Search |
| 8 | AI Agent | Tool Calling, Memory, Planning, Reflection, Multi Agent |
| 9 | Framework | LangChain, LlamaIndex, CrewAI, AutoGen, DSPy |
| 10 | Production AI | FastAPI, Pydantic, SQLAlchemy, Celery, Redis |

---

## 9. 핵심 기능

| 기능 | 설명 |
|------|------|
| **Code Typing** | 실제 코드 따라치기 (구문 강조, 오타 물결 표시, 자동 들여쓰기, 실시간 WPM·정확도) |
| **Pattern Practice** | 특정 패턴 집중 연습 |
| **Project Import** *(PC 전용)* | 로컬 프로젝트 폴더 분석 → 학습 데이터화 — **데스크톱에서만 제공** |
| **Category Learning** | 카테고리별 학습 |
| **Weak Point Learning** | 취약 영역 반복 학습 |
| **Statistics (인라인)** | 속도 · 정확도 · 숙련도 · 학습 시간 — 별도 대시보드가 아니라 **학습 화면에 인라인 표시**(실시간 지표 + 패턴 숙련도 + 오타 패턴) |

---

## 10. 데이터 저장

- **저장소:** IndexedDB (클라이언트 로컬, 오프라인)
- **저장 항목:** 사용자 설정 · 학습 기록 · 숙련도 · 프로젝트 분석 결과

### 10.1 학습팩 온디맨드 저장 전략

학습팩(레벨별 코드 데이터셋)이 커지면 단말 저장 공간을 압박할 수 있으므로, 전체를 한 번에 받지 않고 **필요한 단위만 받고 비우는** 방식으로 관리한다.

- **온디맨드 다운로드** — 진행하는 **팩/레벨 단위로 그때그때 다운로드** (초기 설치 용량 최소화)
- **삭제·회수** — 완료했거나 사용하지 않는 팩은 **삭제 가능** → 저장 공간 즉시 회수
- **공간 관리 UI** — 현재 받은 팩 목록·용량 표시, 미사용 팩 자동 정리(옵션)
- **오프라인 보장** — 한 번 받은 팩은 캐시되어 오프라인 학습 가능. 다운로드 시점에만 네트워크 필요 (이후 완전 오프라인)
- **무결성** — 다운로드 팩 버전·체크섬 관리로 손상/구버전 감지 후 재다운로드

> 저장 매체(IndexedDB vs Cache Storage)·용량 한도·iOS 데이터 만료 정책은 **§13 기술 스택** 적대적 검토 결과를 따른다.

---

## 11. 비기능 요구사항 (NFR)

> 적대적 검토 결과, 단일 수치는 모바일(iOS Safari/iPhone 8)에서 비현실적이므로 **플랫폼별로 분리** 정의한다. (근거: §13.4 NFR 현실성 평가)

| 항목 | 데스크톱 / iOS 16+ | 모바일 (iOS Safari, iPhone 8) |
|------|--------------------|-------------------------------|
| **앱 시작 (TTI, WASM 제외)** | 3초 이내 | 3초 이내 (LTE 첫 방문 기준 ≈ 1초, SW 재방문 <0.3초) |
| **파일 분석** *(PC 전용)* | 1000파일 10초 이내 | **해당 없음** — 프로젝트 분석은 데스크톱 전용 (§6) |
| **메모리 (브라우저 탭)** | 1.5GB 이하 | **700MB 이하** (iPhone 8 Safari 실질 상한) |
| **오프라인 학습** | 지원 | 지원 |

**공통 달성 조건:** 외부 CDN 0개(폰트·아이콘 self-host), WASM 초기 번들 제외(lazy-load), Transferable ArrayBuffer 파일 전달, Worker당 WASM 인스턴스 1개, span 가상화, 분석 결과 즉시 IndexedDB flush.

---

## 12. 제외 항목 (Non-Goals)

- AI 코드 생성
- 자동 프로젝트 생성
- 클라우드 동기화
- 온라인 랭킹
- 실시간 협업

---

## 13. 기술 스택 (적대적 검토 완료)

> **검토 기준**: iOS Safari / iPhone 8 호환성, NFR 정량 달성 가능성, MVP ROI, 보안·프라이버시 4개 렌즈 적대적 검토(6 에이전트) 반영. High 심각도 결함 12개 전원 권장안에 반영.
>
> **플랫폼 범위 결정 (§6)**: **프로젝트 폴더 분석은 데스크톱(PC) 전용**, 모바일은 학습팩 타이핑 전용. 이에 따라 아래 표의 *폴더 선택·코드 파싱* 레이어는 **PC 환경 기준**으로만 적용되며, 관련 모바일 리스크(FSAA 핸들 영속화, Tree-Sitter iPhone 8 성능, 모바일 1000파일 NFR)는 **해소**된 것으로 표기한다.

### 13.1 권장 스택 (레이어별)

| 레이어 | 선택 | 근거 | iOS Safari 주의 |
|---|---|---|---|
| **앱 프레임워크 / 빌드** | **Phase 1**: 단일 HTML + `<script type="module">` + importmap / **Phase 2**: Vite 5.x + Vanilla TypeScript | 현 프로토타입 엔진이 이미 작동 중. Vite 전환은 Tree-Sitter WASM lazy-import가 실제로 필요한 시점(폴더 분석 착수 직전)으로 지연. JSDoc 타입 힌트로 Phase 1 IDE 지원 | 인라인 스크립트 분리 후 `script-src 'self'` CSP 적용. 테마 깜빡임 방지 인라인 1줄은 nonce/hash 허용 |
| **타이핑 엔진** | 현 Vanilla JS 엔진 모듈화(`initTypingEngine`) + rAF dirty-flag throttle + span 가상화(화면 ±5줄) | 글자별 span 오버레이·덮어쓰기·스크롤 동기화 구현됨. 대형 파일 대응 시 update() O(n)→O(n_visible). `pos` 미정의 버그 수정 포함 | textarea에 `autocorrect/autocapitalize/autocomplete=off spellcheck=false` 명시. `compositionstart/end`로 IME 가드, 조합 중 update() 억제 |
| **코드 파싱 / 분석** | **기본(모바일·MVP)**: 자체 regex 경량 파서(Class/Method/Annotation 80% 커버) / **점진(데스크톱·Phase 2)**: `web-tree-sitter 0.22.x` + java/python `.wasm` lazy-import | iPhone 8 단일스레드 WASM 1000파일 ≈ 29초로 NFR 3배 초과. WASM은 '프로젝트 분석' 클릭 시 `dynamic import()`. 실제 gzip: java ≈ 1.75 MB, python ≈ 1.4 MB(제안 300~500 KB는 오기) | iOS 15↓: WASM 비활성, regex 전용. iOS 16+: `crossOriginIsolated` 감지 후 Worker Pool 분기 |
| **폴더 선택 / 파일 접근** | **기본**: `<input type="file" webkitdirectory>` (iOS 11.3+) / **점진**: `showDirectoryPicker` (iOS 16+) | handle 세션 간 영속화 불가(탭 재실행 시 권한 무효) → webkitdirectory 기본, FSAA는 progressive enhancement. FileList 50개씩 순차 처리 | iOS 16 미만 `showDirectoryPicker` 미지원. handle 영속화 의존 UX 설계 금지 |
| **저장** | **Phase 1**: `localStorage`(설정) + `sessionStorage`(세션) / **Phase 2**: `idb 8.x` + IndexedDB | 학습 기록 누적 필요 시점에 IndexedDB. 스키마: `settings/sessions/patterns(patternId,contentHash)/projects`. **소스코드 원문 저장 금지** — 추출 패턴(타입·라인·식별자)만 | iOS ITP: 비 PWA 탭 **7일 비활성 → IndexedDB 삭제**. 최초 실행 `navigator.storage.persist()` 필수. `storage.estimate()` 모니터링 |
| **학습팩 배포·저장** | 정적 호스팅(Cloudflare Pages/R2)에서 팩 번들 제공 + **Cache Storage API**(팩 코드 묶음) / IndexedDB(기록·숙련도)와 **분리** / `fetch` + 매니페스트 버전·sha256 | 온디맨드 다운로드·삭제(§10.1). 팩은 **불변 정적 자산**이라 Cache Storage가 적합(blob 캐시·일괄 삭제 용이). 팩 매니페스트 JSON(`id·version·sha256·lang·level·size`) + 코드 스니펫. 삭제는 `caches.delete(packCache)`로 공간 즉시 회수 | Cache Storage도 iOS ITP 7일 만료 대상 → **온디맨드 재다운로드가 곧 완화책**. 다운로드 시점에만 네트워크, 이후 오프라인. sha256 불일치 시 자동 재다운로드 |
| **PWA / 오프라인** | **Phase 1**: 수동 Service Worker(~30줄) + `manifest.json` / **Phase 2**: `Workbox 7.x` + `vite-plugin-pwa`(prompt 모드, skipWaiting 비활성) | WASM precache 시 파일명 contenthash 포함. SW 업데이트는 타이핑 완료 후 수동 승인 | Background Sync 미지원 → `BackgroundSyncPlugin` 금지. 7일 만료 대응: 재실행 시 WASM 캐시 확인·재다운로드. Push는 iOS 16.4+ |
| **구문 강조** | 현 regex SYN 엔진 TS 재작성 + Python 키워드 확장 | 글자별 span 인라인 color 방식 → Shiki(HTML 생성)와 통합 불가. Python: `def/class/import/from/return/...` 추가, 데코레이터 `@\w+` 동일, f-string `f'` 감지 | Shiki는 '레슨 미리보기' 정적 영역만 선택 도입(Phase 3) |
| **상태 관리** | **Phase 1**: module-level singleton(`state` + `CustomEvent`) / **Phase 2 선택**: Zustand 5.x vanilla store | rAF 루프 내 직접 구독 금지 — `getState()` 폴링 또는 생명주기 단위 subscribe/unsubscribe. 컴포넌트 10개+ 시 도입 | Proxy 기반(iOS 10+) 호환 이상 없음 |
| **폰트 / 아이콘** | JetBrains Mono + Inter **self-host woff2** / lucide **npm ESM named import** | Google Fonts CDN: 오프라인 위반 + COEP 충돌 + 3초 NFR 위협. unpkg: SLA 없음·공급망 위험. 두 외부 CDN 완전 제거 필수. `font-display: swap` + `system-ui, Menlo, monospace` fallback | COEP `require-corp` 시 외부 CDN 자동 차단 → CDN 제거가 COEP 전제 |
| **테스트** | **Phase 1**: iPhone 8 실기기 수동 스모크(체크리스트) / **Phase 2**: `Vitest 2.x` 단위 / **Phase 3**: `Playwright 1.x` WebKit E2E + BrowserStack | Playwright WebKit ≠ Apple Safari(가상키보드·selectionchange·FSAA 재현 불가). 보안 회귀(XSS·CSP·소스 미저장 단언) 병행 | WebKit 통과가 iPhone 8 호환 보장 아님. Xcode Simulator(iOS 16.7) Safari WebDriver가 실기기 최근접 |
| **배포** | Cloudflare Pages (정적 / 단일 HTML 직접 업로드) | `_headers`로 COEP/COOP/CSP 설정 가능. GitHub Pages는 커스텀 헤더 불가 → SharedArrayBuffer 미지원. COEP 순서: 외부 리소스 로컬화 → CSP → SharedArrayBuffer | COEP `require-corp` + `Cross-Origin-Resource-Policy: same-origin`. COOP는 향후 OAuth2 팝업 영향 고려. Lighthouse CI(Phase 2) |

### 13.2 MVP vs 향후

**MVP에 꼭 필요한 것 (Phase 1 — 단일 HTML 유지)**

| 항목 | 구체 작업 |
|---|---|
| 버그 수정 | `pos` 미정의 변수(`val.length` 의도) |
| 타이핑 엔진 안정화 | textarea `autocorrect/autocapitalize/autocomplete=off spellcheck=false`, `isComposing` IME 가드, rAF dirty-flag throttle |
| Python 지원 | SYN 엔진 Python 키워드·데코레이터·f-string |
| 외부 CDN 제거 | Google Fonts→self-host woff2, unpkg/lucide→SVG 인라인/정적 번들 |
| Service Worker | 직접 ~30줄 (install/fetch, HTML·폰트·아이콘 precache) |
| manifest.json | PWA installability (icon, name, start_url, display: standalone) |
| 데이터 보호 | `navigator.storage.persist()` + 홈 화면 추가 안내 배너 |
| 배포 | Cloudflare Pages 단일 HTML 직접 배포 |

**단계적으로 미룰 것**

| 항목 | 미루는 이유 | 도입 시점 |
|---|---|---|
| Vite + TypeScript 전환 | 현재 ROI 0. WASM lazy-import가 전환 트리거 | Phase 2 (폴더 분석 착수 직전) |
| web-tree-sitter WASM | MVP에 폴더 분석 없음. regex로 80% 커버 | Phase 2 |
| idb + IndexedDB 스키마 | 학습 기록 누적 필요 시점까지 localStorage로 충분 | Phase 2 |
| Workbox + vite-plugin-pwa | Vite 전환 후 WASM precache 필요 시 | Phase 2 |
| Zustand | singleton으로 Phase 1~2 충분 | Phase 3 (컴포넌트 10개+) |
| Vitest / Playwright | Vite 전환 전 실행 불가 / 인프라 비용 > 구현 비용 | Phase 2 / Phase 3 |
| COEP/COOP·CSP(strict) | 외부 CDN 제거·인라인 분리 후 가능 | Phase 2 |
| OPFS 캐싱 | 분석 결과 재활용 최적화 | Phase 2 |

### 13.3 리스크 레지스터 (High/Medium 우선)

| 리스크 | 심각도 | 영향 | 완화책 |
|---|---|---|---|
| File System Access handle 영속화 불가(iOS) | ~~High~~ → **해소** | (PC 전용 기능) 데스크톱 Chromium은 IndexedDB 핸들 영속화 지원. 모바일은 폴더 분석 미제공 | PC: `showDirectoryPicker` + 핸들 IndexedDB 저장. 모바일은 해당 없음 |
| Tree-Sitter WASM iPhone 8 성능(단일스레드 ~29초) | ~~High~~ → **해소** | (PC 전용) 모바일에서 분석을 실행하지 않으므로 영향 없음 | PC(데스크톱) Worker Pool 4개로 처리. 모바일 해당 없음 |
| IndexedDB 7일 ITP 만료(iOS 비 PWA) | High | 학습 이력 초기화 → 핵심 가치 훼손 | `storage.persist()` 필수, 홈 화면 추가 유도, JSON export, 만료 감지 '재분석 필요' 안내 |
| Google Fonts + unpkg COEP 충돌·오프라인 위반 | High | COEP 시 폰트·아이콘 차단, 오프라인 UI 깨짐 | 폰트 self-host, lucide npm ESM. 외부 CDN 0개 달성 후 COEP |
| CSP 미선언 + 인라인 스크립트 노출 | High | XSS 시 IndexedDB 학습·분석 데이터 유출 | 인라인 분리 후 `script-src 'self'`. `nosniff/DENY/no-referrer` `_headers` 명시 |
| 소스코드 원문 IndexedDB 저장 | High | 기업 소스(연결문자열·시크릿) 평문 영속화 | 추출 결과만 저장. 시크릿 스캔(엔트로피≥3.5 또는 키워드) 후 [REDACTED] |
| SW 업데이트 중 세션 강제 리로드 | High | 학습 세션 손실 | `skipWaiting` 비활성, prompt 모드, '완료 후 업데이트' 배너 |
| 메인스레드 블로킹(파싱+타이핑 충돌) | High | 파싱 중 입력 블로킹 → iOS 탭 크래시 | 파싱 전담 Worker, update() rAF 단일 패턴, Transferable ArrayBuffer |
| span 모바일 확장성(5000+ span) | High | 300줄+ 파일 update() 40~80ms → 프레임 예산 초과 | span 가상화(화면 ±5줄), 50줄 섹션 분할, requestIdleCallback |
| WASM 번들 크기 과소 추정 | Medium | 설계 예산 오류 | 실측: java ≈ 1.75 MB, python ≈ 1.4 MB. runtime cache(CacheFirst) lazy-load |
| COEP ↔ Google Fonts 동시 불가 | Medium | COEP 시 폰트 차단 | 외부 CDN 제거 후 COEP(순서 의존) |
| SharedArrayBuffer iOS 15.x 불완전 | Medium | `crossOriginIsolated` 불보장 | 감지 분기: true→SAB Pool, false→독립 Worker postMessage |
| IndexedDB 50 MB 팝업 | Medium | UX 마찰 | 대용량은 OPFS(quota 분리), `storage.estimate()` 80% 경고 |
| 학습팩 Cache Storage iOS 7일 만료 | Medium | 오프라인 학습팩 소실 | 온디맨드 재다운로드(전략상 자연 완화) + `storage.persist()` + 매니페스트 버전/sha256 검증 + 받은 팩·용량 표시 UI |
| unpkg 공급망 공격(현 프로토타입) | Medium | lucide 탈취 시 XSS | npm ESM 교체, MVP는 SVG 인라인 |

### 13.4 NFR 현실성 평가 (요약)

- **앱 시작 <3초** — 달성 가능. 외부 CDN 제거 + WASM 초기 번들 제외 시 iPhone 8 LTE TTI ≈ 0.8~1.2초, 재방문(SW) <300ms. → "타이핑 기능 TTI <3초 (WASM 제외)"로 정의 명확화.
- **1000파일 <10초 (PC 전용)** — 프로젝트 분석은 데스크톱에서만 실행. 데스크톱 Chrome + Worker Pool 4개 ≈ 2~4초로 달성 가능(`.java/.py` 필터링 + OPFS 캐시 전제). 모바일은 분석을 실행하지 않으므로 이 NFR 대상이 아님 → iPhone 8 ~29초 문제 소멸.
- **메모리 <2GB** — 모바일 기준 무의미. iPhone 8 Safari 탭 실질 상한 ≈ **700 MB**(초과 시 탭 리로드). 제안 구성 피크 ≈ 285~295 MB로 안전하나, Transferable ArrayBuffer·Worker당 WASM 1개·span 가상화 전제.

### 13.5 핵심 결정 사항

1. **폴더 선택 기본을 webkitdirectory로** — `showDirectoryPicker`는 progressive enhancement. 분석 결과 JSON 저장으로 핸들 없이 학습 지속. 핸들 영속화 의존 금지.
2. **Tree-Sitter는 점진적 향상으로 채택** — 기본 경로는 regex 경량 파서. WASM은 '프로젝트 분석' 클릭 시 lazy-load. iOS `crossOriginIsolated` 분기.
3. **소스코드 원문 저장 금지** — 추출 패턴만 저장 + 시크릿 마스킹(엔트로피/키워드). 예상 저장 ≈ 4 MB(1000파일×20패턴×200B).
4. **iOS 데이터 수명 보호** — `storage.persist()` 온보딩 필수, 홈 화면 추가 배너, `storage.estimate()` 모니터링, JSON export, 7일 만료 감지 안내.
5. **외부 CDN 전면 제거 = COEP 전제** — 폰트 self-host + lucide npm/SVG. 제거 완료 후에만 `_headers` COEP/COOP 활성.
6. **NFR 플랫폼별 분리** — §11 참조(아래 반영 완료).
7. **Phase 순서 잠금** — Vite 전환 1개가 Workbox·Vitest·Zustand·WASM·CSP를 연쇄 해제. 전환 시점 = 폴더 분석 착수 직전. Phase 1 → 2 → 3 시퀀스 엄수.
8. **보안 최소 요건** — Phase 1: 외부 CDN 0, `innerHTML` 금지(`textContent`/`createTextNode`), `.env/*.key/*.pem/*secret*` 분석 제외+경고. Phase 2: CSP `script-src 'self'` + `nosniff/DENY/no-referrer`.
9. **학습팩 = Cache Storage / 사용자 데이터 = IndexedDB 분리** (§10.1 연계) — 팩(불변 정적 코드 묶음)은 Cache Storage API로 온디맨드 다운로드·캐시·일괄 삭제(`caches.delete`로 공간 회수), 학습 기록·숙련도는 IndexedDB. 팩 매니페스트(`id·version·sha256·lang·level·size`)로 버전·무결성 관리. iOS 7일 만료는 재다운로드로 흡수. 받은 팩 목록·용량 표시 + 미사용 자동 정리(옵션).

---

## 14. 성공 지표

| 지표 | 목표 |
|------|------|
| Spring Boot 패턴 정확도 | 95% 이상 |
| Java 타이핑 속도 향상 | 20% 이상 |
| Python AI 패턴 숙련도 | 90% 이상 |
| 주간 학습 지속률 | 70% 이상 |

---

## 부록 A. 현재 구현 현황 (프로토타입)

`codemaster.html` (단일 HTML PWA 프로토타입) 기준:

- **타이핑 트레이너** — 목표 코드 위 투명 입력 오버레이, 글자별 정/오 판정, 정타 시 **언어 구문 강조**, 오타는 **IDE식 물결 밑줄**(빨강=오타 / 황색=대소문자), 깜빡이는 세로 캐럿, 실시간 WPM·정확도·진행률
- **편집성** — 캐럿 이동(화살표·클릭)으로 이전 줄 수정, 중간 입력 **덮어쓰기** 처리, **Enter 자동 들여쓰기**, Tab 4칸
- **레이아웃** — 좌측 사이드 패널(학습팩 토글 · 로드맵 · 빠른학습 · 프로젝트, 아코디언), 우측 패널(패턴 숙련도 · 오타 패턴), 버거 메뉴 드롭다운
- **반응형** — 모바일(iPhone) 대응: 오프캔버스 드로어, 폭 고정·확대 방지, 터치 타깃 확대
- **테마** — 라이트/다크 토글(localStorage 유지), 코드 구문색 테마별 대비 확보
