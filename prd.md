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

> **목표 수준: 실무 즉시 투입.** 입문부터 심화·운영까지 망라하여, 완주 시 금융권·엔터프라이즈 백엔드 프로젝트에 바로 투입 가능한 패턴을 모두 포함한다.

| Level | 주제 | 세부 패턴 |
|:-----:|------|-----------|
| 1 | Java Core | Class, Interface, Enum, Record, Generic, Collection, Exception / *(Modern)* Lambda, Stream, Optional, CompletableFuture |
| 2 | Spring Core | DI(Component, Service, Repository, Controller), Configuration(Bean, Properties, Profile), AOP(Aspect, Advice, Pointcut) |
| 3 | Spring Boot MVC | Controller, RequestMapping, Validation, ExceptionHandler / *(API)* REST, Swagger, OpenAPI, FeignClient, ProblemDetail(RFC 7807), API 버저닝, HATEOAS |
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
| 16 | Build & DevOps | Gradle Multi-Module, Dockerfile, Docker Compose, Kubernetes, Helm, CI/CD(GitHub Actions·Jenkins) |
| 17 | Observability | Logback·SLF4J·MDC 구조화 로깅, Distributed Tracing(Micrometer Tracing·Zipkin), ELK, Sentry |
| 18 | Data 심화 | QueryDSL, HikariCP 튜닝, Flyway·Liquibase 마이그레이션, 인덱스·실행계획(EXPLAIN), N+1 해결, 페이징 |
| 19 | Resilience & Cloud-Native | Resilience4j(Retry·CircuitBreaker·Bulkhead·RateLimiter), Service Discovery(Eureka), Config Server, Saga·분산 트랜잭션 |
| 20 | Reactive | WebFlux, Reactor(Mono·Flux), R2DBC, SSE·Streaming, Backpressure |

---

## 8. 학습팩 — Python AI

> **목표 수준: 실무 즉시 투입.** 완주 시 RAG·AI Agent·LLM 서빙을 포함한 프로덕션 AI 프로젝트에 바로 투입 가능한 패턴을 모두 포함한다.

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
| 10 | Production AI | FastAPI, Pydantic, SQLAlchemy, Celery, Redis, Docker, pytest, mypy, ruff |
| 11 | Vector Store 실무 | pgvector, Qdrant, Weaviate, Milvus, FAISS, HNSW·양자화, 메타데이터 필터링 |
| 12 | LLM 서빙·최적화 | vLLM, Ollama, TGI, 양자화(GGUF·AWQ·GPTQ), 스트리밍(SSE), 배치 추론, KV Cache |
| 13 | 프롬프트·구조화 출력 | Few-shot, Chain-of-Thought, Tool/Function Calling, JSON Schema, Pydantic 구조화 출력, 출력 검증 |
| 14 | Fine-tuning & MLOps | LoRA, QLoRA, PEFT, MLflow, 실험 추적, 모델 레지스트리, DVC, W&B |
| 15 | AI 품질·관측·보안 | RAGAS·LLM Eval, Langfuse·LangSmith, Guardrails, Prompt Injection 방어, PII 마스킹, Hallucination 측정 |

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

> **검토 기준**: iOS Safari / iPhone 8 호환성, NFR 정량 달성 가능성, 구현·유지보수 ROI, 보안·프라이버시 4개 렌즈 적대적 검토(6 에이전트) 반영. High 심각도 결함 12개 전원 권장안에 반영.
>
> **채택 방침 — Phase 3 풀스택.** 단일 HTML 유지(Phase 1) 단계를 두지 않고, 처음부터 **Vite + TypeScript 기반 완성 아키텍처**로 구성한다. 적대적 검토에서 도출된 모든 제약·완화책은 이 풀스택 위에서 적용한다.
>
> **플랫폼 범위 결정 (§6)**: **프로젝트 폴더 분석은 데스크톱(PC) 전용**, 모바일은 학습팩 타이핑 전용. 이에 따라 아래 표의 *폴더 선택·코드 파싱* 레이어는 **PC 환경 기준**으로만 적용되며, 관련 모바일 리스크(FSAA 핸들 영속화, Tree-Sitter iPhone 8 성능, 모바일 1000파일 NFR)는 **해소**된 것으로 표기한다.

### 13.1 권장 스택 (레이어별 — Phase 3 풀스택)

| 레이어 | 선택 | 근거 | iOS Safari 주의 |
|---|---|---|---|
| **앱 프레임워크 / 빌드** | **Vite 5.x + Vanilla TypeScript** | VDOM 오버헤드 없이 타이핑 루프 성능 유리. ESM 분할·`vite-plugin-wasm`·Tree-Sitter lazy-import·인라인 분리(CSP) 네이티브 지원 | 인라인 스크립트 외부 모듈 분리 → `script-src 'self'`. 테마 깜빡임 방지 1줄만 nonce/hash 허용 |
| **타이핑 엔진** | **Vanilla TS 모듈**(`initTypingEngine`) + rAF dirty-flag throttle + span 가상화(화면 ±5줄) | 글자별 span 오버레이·덮어쓰기·스크롤 동기화. 대형 파일 update() O(n)→O(n_visible). `pos` 버그 수정 포함 | textarea `autocorrect/autocapitalize/autocomplete=off spellcheck=false`. `compositionstart/end` IME 가드, 조합 중 update() 억제 |
| **코드 파싱 / 분석** *(PC 전용)* | **web-tree-sitter 0.22.x** + java/python `.wasm` + **Worker Pool 4개** / regex 경량 파서 폴백 | PC에서 병렬 파싱, 추출은 `.scm` 쿼리(Class/Method/Interface/Annotation/Import/Package). 실제 gzip: java ≈ 1.75 MB, python ≈ 1.4 MB → `dynamic import()` lazy-load | 모바일 미실행(분석 PC 전용). 데스크톱 `crossOriginIsolated` 시 SharedArrayBuffer Pool, 아니면 독립 Worker postMessage |
| **폴더 선택 / 파일 접근** *(PC 전용)* | **`showDirectoryPicker`** + `<input webkitdirectory>` 폴백 | 데스크톱 Chromium은 핸들 IndexedDB 영속화 지원 → 재선택 불필요. FileList 50개씩 순차 처리(메모리 spike 방지) | (PC 전용) 모바일 해당 없음 |
| **저장** | **idb 8.x + IndexedDB** + 대용량 **OPFS** | 스키마: `settings/sessions/patterns(patternId,contentHash)/projects`. **소스코드 원문 저장 금지** — 추출 패턴(타입·라인·식별자)만 | ITP: 비 PWA 탭 **7일 비활성 → 삭제**. 최초 실행 `navigator.storage.persist()` 필수, `storage.estimate()` 모니터링 |
| **학습팩 배포·저장** | **Cache Storage API**(팩 코드 묶음) + 정적 호스팅 + 매니페스트 sha256 / IndexedDB(기록·숙련도)와 **분리** | 온디맨드 다운로드·삭제(§10.1). 팩은 불변 정적 자산 → Cache Storage 적합. `caches.delete(packCache)`로 공간 즉시 회수 | Cache Storage도 7일 만료 → **온디맨드 재다운로드가 완화책**. sha256 불일치 시 자동 재다운로드 |
| **PWA / 오프라인** | **Workbox 7.x + vite-plugin-pwa**(prompt 모드, skipWaiting 비활성) + `manifest.json` | WASM 파일명 contenthash 포함. SW 업데이트는 타이핑 완료 후 사용자 승인 | Background Sync 미지원 → `BackgroundSyncPlugin` 금지. 7일 만료: 재실행 시 캐시 확인·재다운로드. Push iOS 16.4+ |
| **구문 강조** | **regex SYN 엔진(TS)** + Python 키워드·데코레이터·f-string 확장 | 글자별 span 인라인 color 방식 → Shiki(HTML 생성)와 통합 불가 | Shiki는 '레슨 미리보기' 정적 영역만 선택 도입 |
| **상태 관리** | **Zustand 5.x vanilla store**(`createStore`, gzip ≈ 1 KB) | 앱 상태(레벨·세션·숙련도·설정) 일원화. React 없이 vanilla 사용 | rAF 루프 내 직접 구독 금지 — `getState()` 폴링 또는 생명주기 단위 subscribe/unsubscribe |
| **폰트 / 아이콘** | JetBrains Mono + Inter **self-host woff2** / lucide **npm ESM named import** | 외부 CDN 0개(오프라인·COEP·공급망·tree-shaking). `font-display: swap` + `system-ui, Menlo, monospace` fallback | COEP `require-corp` 시 외부 CDN 자동 차단 → CDN 제거가 COEP 전제 |
| **테스트** | **Vitest 2.x**(단위) + **Playwright 1.x WebKit**(E2E) + **BrowserStack 실기기** | 타이핑 정확도·WPM·IndexedDB 단위. 보안 회귀(XSS·CSP·소스 미저장 단언) 병행 | Playwright WebKit ≠ Apple Safari → BrowserStack/Xcode Simulator(iOS 16.7) Safari WebDriver 실기기 병행 |
| **배포** | **Cloudflare Pages** (`_headers` COEP/COOP/CSP) + Lighthouse CI | 엣지·HTTPS·커스텀 응답 헤더로 SharedArrayBuffer 지원. COEP 순서: 외부 리소스 로컬화 → CSP → SharedArrayBuffer | COEP `require-corp` + `CORP: same-origin`. COOP는 향후 OAuth2 팝업 영향 고려 |

> **현재 부트스트랩 배포**는 GitHub Pages(`https://mykim711231.github.io/CodeMaster/`)이며, COEP/COOP가 필요한 분석(SharedArrayBuffer Worker Pool) 도입 시 **Cloudflare Pages로 이전**한다. (GitHub Pages는 커스텀 헤더 불가)

### 13.2 구현 범위 및 권장 빌드 순서

전 레이어를 **풀스택으로 채택**한다(단계적 보류 없음). 단, 안정적 구성을 위한 **권장 빌드 순서**:

1. **스캐폴드** — Vite + TypeScript + ESLint/Prettier 초기화, 외부 CDN 제거(폰트 self-host · lucide npm ESM)
2. **타이핑 엔진 이식** — 현 엔진 TS 모듈화(`initTypingEngine`), `pos` 버그 수정, rAF dirty-flag throttle, span 가상화, IME 가드, Python 구문강조 확장
3. **상태·저장** — Zustand store + idb(IndexedDB) 스키마 + 학습팩 Cache Storage 로더(온디맨드 다운로드·삭제)
4. **PWA** — vite-plugin-pwa(Workbox) + `manifest.json` + `storage.persist()` 온보딩 + 홈 화면 추가 배너
5. **분석 (PC 전용)** — web-tree-sitter Worker Pool + `.scm` 쿼리 + regex 폴백 + 시크릿 마스킹 + `showDirectoryPicker`
6. **테스트** — Vitest 단위(타이핑 정확도·WPM·저장) + Playwright WebKit E2E + BrowserStack 실기기 + 보안 회귀
7. **배포·보안** — Cloudflare Pages `_headers`(COEP/COOP/CSP) + Lighthouse CI

> **채택하지 않는 것:** React/Vue(VDOM 오버헤드 → 타이핑 루프 성능), Monaco/CodeMirror(번들·모바일 IME 충돌), Dexie(idb 대비 과중), Shiki 전역 적용(글자별 인라인 color 구조와 불일치).

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
7. **풀스택 즉시 채택 (Phase 3)** — 단일 HTML 유지 단계 없이 처음부터 Vite + TypeScript 기반으로 Tree-Sitter·Workbox·Zustand·Vitest·CSP를 **하나의 아키텍처로 통합**. §13.2 빌드 순서로 진행.
8. **보안 요건 (전 구간 적용)** — 외부 CDN 0개, `innerHTML` 금지(`textContent`/`createTextNode` 전용), `.env/*.key/*.pem/*secret*/*credential*` 분석 제외+경고, CSP `script-src 'self'` + `X-Content-Type-Options: nosniff`·`X-Frame-Options: DENY`·`Referrer-Policy: no-referrer`, 소스 원문 미저장.
9. **학습팩 = Cache Storage / 사용자 데이터 = IndexedDB 분리** (§10.1 연계) — 팩(불변 정적 코드 묶음)은 Cache Storage API로 온디맨드 다운로드·캐시·일괄 삭제(`caches.delete`로 공간 회수), 학습 기록·숙련도는 IndexedDB. 팩 매니페스트(`id·version·sha256·lang·level·size`)로 버전·무결성 관리. iOS 7일 만료는 재다운로드로 흡수. 받은 팩 목록·용량 표시 + 미사용 자동 정리(옵션).

### 13.6 커리큘럼 확장 영향 (다중 언어 · 콘텐츠 파이프라인)

#### 추가로 필요한 언어/포맷 — 표(언어·용도 레벨·구문강조 처리 방식)

| 언어/포맷 | 주요 용도 레벨 | 구문강조 처리 방식 | 비고 |
|---|---|---|---|
| Java | L1~L20 전체 | **Lezer 어댑터** (`@lezer/java` gzip ~12 KB) | 기존 regex → Lezer로 교체 |
| Python | L1~L15 전체 | **Lezer 어댑터** (`@lezer/python` gzip ~10 KB) | 중첩 f-string 깊이 1까지만 |
| XML | L4 MyBatis XML Mapper, Dynamic SQL | **Lezer 어댑터** (`@lezer/xml` gzip ~8 KB) | CDATA·중첩 태그 정확 처리 |
| SQL | L4 JPQL·Native, L18 QueryDSL·EXPLAIN·Flyway, L11 pgvector | **최소 regex** (공통 DML 키워드 + 문자열 + 라인 주석) | 방언별 확장 토큰은 미강조 |
| YAML | L16 Docker Compose·K8s·Helm, L17 Logback·CI, L14 MLflow/DVC | **최소 regex** (키·값·숫자·불리언·앵커 5종) | Helm `{{ }}` 보간은 미강조 |
| Dockerfile | L16 멀티스테이지 빌드, L10·L12 서빙 이미지 | **최소 regex** (지시어 키워드 9종) | `RUN` 이후 인라인 Shell은 미강조 |
| Bash/Shell | L16 Helm·kubectl 스크립트, CI inline shell | **최소 regex** (키워드·`$VAR`·주석·문자열 4종) | 복합 보간·`[[ ]]`은 미강조 |
| JSON | L13 JSON Schema·Function Calling 페이로드·구조화 출력 | **Prism.js JSON grammar 어댑터** (gzip ~1.5 KB) | 스니펫 최대 50줄 제한 |
| TOML | pyproject.toml (Python 전 레벨) | **최소 regex** (키·값·섹션·주석 4종) | 위험도 낮음 |
| Properties | L2·L19 Spring application.properties, Config Server | **최소 regex** (키·값·`#`·`!` 주석 4종) | `\\` 멀티라인은 미강조 |
| Kotlin | 향후 Spring Boot 스니펫 일부 | **MVP 35레벨 범위 제외** — 언어 추가 기준 프로세스로 관리 | Lezer grammar 존재 확인 후 결정 |

> **언어 추가 기준 (§4 장기 로드맵 TypeScript·Go·Rust·Kotlin 공통 적용):** 해당 언어 학습팩 레벨이 3개 이상 확정되고, `@lezer/<lang>` grammar 패키지가 존재하며, 담당자 승인 PR이 CI를 통과한 경우에 한해 추가한다.

---

#### 구문 강조 레이어 결정 — regex SYN 확장 vs 언어별 grammar 도입, 글자별 토큰 배열 변환 방식, 최종 권장

**핵심 제약 재확인**

타이핑 엔진은 목표 코드의 각 글자에 대해 개별 `<span>`을 생성하고 입력 이벤트마다 해당 span의 클래스(`correct·incorrect·cursor`)를 갱신하는 구조다. Shiki는 전체 소스를 `<pre><code>` HTML 문자열로 일괄 출력하므로 글자 단위 span과 위치 인덱스가 맞지 않는다. CodeMirror 6는 자체 DOM을 관리하므로 외부 글자 단위 span 삽입이 불가하다. Monaco는 번들 크기(~5 MB)와 모바일 IME 충돌로 기각(§13.5 결정)되어 있다. **따라서 글자별 span 구조를 변경하지 않고 토큰 소스만 교체하는 경로가 유일하다.**

**언어 복잡도 3단 분류 및 처리 방식**

| 분류 | 대상 언어 | 처리 방식 | 이유 |
|---|---|---|---|
| **Tier 1 — Lezer 어댑터** | Java, Python, XML | `parser.parse(source)` → `Tree.cursor()` 순회 → `{from, to, tokenType}[]` → span 인덱스 매핑 | 중첩·문맥 의존 문법을 regex로 처리 불가. 중첩 CDATA, f-string 중첩 보간, 제네릭 포함 |
| **Tier 2 — 최소 regex + 범위 축소** | SQL, YAML, Bash, Dockerfile, TOML, Properties | 언어별 5~8개 토큰 클래스만 처리. 복잡한 보간·방언·멀티라인은 의도적으로 미강조 | 타이핑 판정 오류 방지 우선. 색 누락 허용 |
| **Tier 3 — Prism.js 어댑터** | JSON | `Prism.tokenize(source, Prism.languages.json)` → 토큰 배열 → span 인덱스 매핑 | Prism.js JSON grammar gzip ~1.5 KB로 경제적. 단 스니펫 50줄 이하 제한 |

**Lezer 어댑터 글자별 토큰 배열 변환 방식**

```
@lezer/java (또는 /python, /xml) — CodeMirror DOM 없이 독립 사용
  ↓ parser.parse(source)
  ↓ Tree.cursor() 순회
  ↓ { from: number, to: number, type: string }[]
  ↓ TokenAdapter.toSpanIndex(tokens, source)
  → charTokenMap: Array<string>  // 글자 인덱스 → 토큰 타입
  → 타이핑 엔진 span 생성 시 charTokenMap[i]로 CSS 클래스 결정
```

Lezer 스트림 파서는 글자 단위 증분 재파싱(`parser.parse(source, [tree], ranges)`)이 가능하여 타이핑 루프 성능 영향이 최소화된다. 단 YAML·Dockerfile·Properties·TOML의 공식 `@lezer/<lang>` grammar가 2025년 기준 미존재하므로 해당 언어는 Tier 2 최소 regex로 유지하는 하이브리드가 불가피하다.

**동적 등록 인터페이스 (`registerLanguage`)**

언어별 규칙을 단일 파일에 모으면 초기 TTI 증가, 언어 간 regex 충돌(Python·Properties·Bash 공통 `#` 주석 패턴), 유지보수 복잡도가 발생한다. 다음 인터페이스를 SYN 엔진에 추가한다.

```typescript
// src/engine/syn/registry.ts
type LangAdapter = (source: string) => Array<{from: number; to: number; type: string}>;

const registry = new Map<string, LangAdapter>();

export function registerLanguage(lang: string, adapter: LangAdapter): void {
  registry.set(lang, adapter);
}

export function getAdapter(lang: string): LangAdapter {
  return registry.get(lang) ?? fallbackRegexAdapter;
}
```

학습팩 로드 시 해당 언어 모듈만 `dynamic import()`로 로드한다.

```typescript
// 팩 로드 시점 (예: java 팩)
const { javaAdapter } = await import('./lang/java');  // Lezer 어댑터
registerLanguage('java', javaAdapter);

// yaml 팩 로드 시점
const { yamlAdapter } = await import('./lang/yaml');  // 최소 regex
registerLanguage('yaml', yamlAdapter);
```

Vite 코드 분할이 언어 모듈을 자동으로 별도 청크로 분리하므로 초기 TTI 영향이 없다. Lezer 어댑터도 `registerLanguage('xml', lezerXmlAdapter)` 형태로 동일 인터페이스로 등록하여 Tier 1·2·3을 단일 인터페이스로 수용한다.

**언어별 강조 범위 및 명시적 제한**

| 언어 | 처리 클래스 | 의도적 미강조 범위 |
|---|---|---|
| Java | 식별자·어노테이션·제네릭·리터럴·키워드·주석 | — (Lezer 전담) |
| Python | 키워드·데코레이터·f-string 깊이 1·리터럴·주석 | 중첩 함수 호출 `f'{func(a,b)}'` → 문자열 색 유지 |
| XML | 태그명·속성명·속성값·CDATA | MyBatis `#{param}` 보간은 속성값 색 유지 |
| SQL | `SELECT·FROM·WHERE·JOIN·ON·GROUP BY·ORDER BY·LIMIT·INSERT·UPDATE·DELETE·CREATE·ALTER·INDEX` + 문자열 + `--` 주석 | PostgreSQL `::`·`<->`·`$`, JPQL `:param`, Flyway 메타 주석, H2 전용 함수 |
| YAML | 키·문자열·숫자·불리언·앵커(`&·*`) | 블록 스칼라(`\|`·`>`), Helm `{{ .Values.xxx }}`, Jinja2 보간 |
| Dockerfile | `FROM·RUN·COPY·ENV·ARG·EXPOSE·ENTRYPOINT·CMD·LABEL·WORKDIR·USER·VOLUME·ONBUILD` | `RUN` 이후 인라인 Shell 전체 |
| Bash | `if·for·while·do·done·fi·case·esac·function` + `$VAR·${VAR}` + `#` 주석 + `''·""` 문자열 | `${{ }}` CI 이중 보간, `[[ ]]` 복합 조건, `\\` 라인 연속 |
| JSON | 키·문자열·숫자·불리언·null (Prism.js) | 스니펫 50줄 초과 시 전체 미강조 fallback |
| TOML | 키·값·`[section]`·`[[array]]`·`#` 주석 | 날짜 리터럴·인라인 테이블 |
| Properties | `key=value·key: value`·`#·!` 주석 | `\\` 멀티라인 연속 값 |

**미리보기 전용 Shiki 확대:** 타이핑 루프 밖 정적 미리보기 영역에서는 기존 Shiki 허용 범위를 11개 언어/포맷 전체로 확대 적용한다. 타이핑 루프 인라인 color 구조와의 분리는 현행 §13 레이어 설계를 그대로 유지한다.

**QueryDSL 혼재 언어 스니펫 분할 원칙:** L18 QueryDSL처럼 Java 코드(`QUser.user`) + JPQL 문자열 리터럴 + EXPLAIN 플랜 출력이 단일 스니펫에 혼재하는 경우, 저작 단계에서 **언어 단위 분할(별도 스니펫)**을 의무화한다. 단일 스니펫 내 다중 언어 embedded 강조는 지원하지 않는다.

**최종 권장:** Lezer 독립 어댑터(Tier 1) + 최소 regex(Tier 2) + Prism.js JSON 어댑터(Tier 3)의 하이브리드 전략을 `registerLanguage` 동적 등록 인터페이스로 통합 관리한다. 단일 regex 엔진 전면 확장은 YAML 문맥 의존 문법·XML 중첩·SQL 방언 다중성·문자열 내 중첩 보간의 구조적 한계로 인해 채택하지 않는다.

---

#### 콘텐츠 파이프라인 — 팩 JSON 스키마, 빌드타임 검증(컴파일/린트), 버전·sha256, 출처(OSS 추출)

**팩 JSON 소스 스키마**

```jsonc
// packages/packs/src/java/l04_mybatis.json (예시)
{
  "id": "java_l04_mybatis",
  "lang": "java",
  "level": 4,
  "topic": "MyBatis XML Mapper",
  "schemaVersion": "1.0",
  "frameworkVersion": {
    "springBoot": "3.3.x",
    "dependencyVersions": {
      "mybatis-spring-boot-starter": "3.0.x"
    }
  },
  "snippets": [
    {
      "id": "snip_001",
      "code": "...",
      "lang": "xml",
      "dialect": null,
      "tags": ["resultMap", "association"],
      "expectedWpm": 40,
      "runnable": true,
      "source": {
        "repo": "mybatis/mybatis-3",
        "sha": "abc1234",
        "path": "src/test/java/org/apache/ibatis/..."
      }
    },
    {
      "id": "snip_002",
      "code": "...",
      "lang": "sql",
      "dialect": "postgresql",
      "tags": ["pgvector", "metadata-filter"],
      "expectedWpm": 35,
      "runnable": false,
      "source": {
        "repo": "pgvector/pgvector",
        "sha": "def5678",
        "path": "README.md#examples"
      }
    }
  ]
}
```

주요 필드 설명:

- `dialect`: SQL 스니펫에서 `mysql·postgresql·h2·jpql·ansi` 중 하나. CI가 이 값으로 올바른 린터를 자동 선택한다.
- `runnable: false`: GPU 의존 스니펫(L12 vLLM·L14 LoRA) 등 실행 불가 컨텍스트를 학습자에게 명시. 해당 스니펫은 `import` 문과 타입 구문만 lite 게이트로 검사한다.
- `source`: OSS 출처 메타데이터. 버전 추적과 저작권 명시를 동시에 달성한다.
- `frameworkVersion`: 스니펫이 대상으로 삼는 프레임워크·라이브러리 버전. Dependabot/Renovate 연동으로 버전 변경 PR 자동 생성의 기준이 된다.

**빌드타임 검증 — 언어/포맷별 CI 게이트**

| 언어/포맷 | 검증 도구 | 게이트 조건 |
|---|---|---|
| Java | `google-java-format 1.22.x --dry-run --set-exit-if-changed` | 포맷 불일치 시 차단 |
| Python (`runnable: true`) | `ruff check 0.4.x` + `python -m py_compile` | 린트 오류·문법 오류 시 차단 |
| Python (`runnable: false`) | `ruff check --select=E9,F` (문법·import만) | GPU 의존 코드 lite 게이트 |
| SQL | `sqlfluff 3.x lint --dialect ${snip.dialect}` | dialect 메타데이터로 자동 분기 |
| XML | `xmllint --noout` | 파싱 오류 시 차단 |
| YAML (일반) | `yamllint 1.35.x -c .yamllint` | 들여쓰기·탭 오류 시 차단 |
| YAML (Helm values) | `yamllint` + `helm lint 3.x` | Helm 구조 오류 시 추가 차단 |
| Dockerfile | `hadolint 2.12.x` | `DL` 레벨 경고 시 차단 |
| Bash/Shell | `shellcheck 0.10.x -S error` | error 레벨 시 차단 |
| JSON | `jq . /dev/null` 파싱 검증 | 파싱 오류 시 차단 |
| TOML | `taplo 0.9.x lint` | 형식 오류 시 차단 |
| Properties | key=value regex 형식 검증 | 구분자 오류 시 차단 |

검증 실패 시 팩 빌드를 차단하여 오류 스니펫이 Cache Storage에 배포되는 경로를 원천 차단한다. GitHub Actions CI에서 PR 단위로 파이프라인을 실행하고 실패 시 머지를 차단한다.

**팩 빌드 스크립트 (`pnpm build:packs`)**

```
packages/packs/src/**/*.json
  ↓ 1. 팩 JSON 스키마 유효성 검증 (ajv 8.x)
  ↓ 2. 언어별 린터 병렬 실행 (위 CI 게이트 표)
  ↓ 3. minify (JSON.stringify)
  ↓ 4. crypto.createHash('sha256') 계산
  ↓ 5. public/packs/{id}_{version}.json 출력
  ↓ 6. packs-manifest.json 자동 갱신
```

Vite 커스텀 플러그인 또는 독립 Node.js 스크립트로 구현하며, §13.2 권장 빌드 순서 3번(상태·저장 레이어) 직후에 위치시킨다. **sha256은 빌드 스크립트가 자동 계산**하여 수동 편집에 의한 불일치를 제거한다.

**버전 채번 전략 (semver)**

| 범프 | 조건 |
|---|---|
| `patch` (예: 1.0.0 → 1.0.1) | 스니펫 내용 수정 (오류 수정·문구 변경) |
| `minor` (예: 1.0.0 → 1.1.0) | 스니펫 신규 추가 또는 레벨 신설 |
| `major` (예: 1.0.0 → 2.0.0) | 대상 프레임워크 major 버전 변경 (예: Spring Boot 3.x → 4.x) |

팩은 `lang × level` 단위로 분리(`java_l16_v1.2.0.json`)하여 단일 스니펫 수정이 다른 레벨 팩의 sha256에 영향을 주지 않도록 격리한다.

**OSS 검증 코드 추출 전략**

수동 저작 700~1400개 스니펫 전량을 사람이 검토하는 방식은 문법 오류와 버전 드리프트를 구조적으로 예방하지 못한다. Spring PetClinic, spring-boot-examples, fastapi, langchain, mybatis-3 등 검증된 OSS에서 Tree-Sitter(§13.1 도입, Java·Python `.scm` 쿼리 활용) 스크립트로 Class/Method/Interface 단위로 실제 컴파일된 코드를 잘라내어 팩 소스로 사용한다. 이 방식은 문법 오류 리스크를 원천 제거한다. `source.repo·sha·path` 메타데이터로 버전 추적과 저작권 명시를 동시에 달성한다.

Dependabot 또는 Renovate를 `packages/packs/` 리포지토리(또는 디렉터리)에 적용하여 라이브러리 버전 변경 PR이 자동 생성되도록 하고, 해당 PR이 CI 검증을 통과해야만 팩 버전을 semver bump하여 배포한다.

**점진적 레벨 출시 전략:** L1~L5를 먼저 배포하고, 각 레벨 팩이 CI를 통과한 후에만 `packs-manifest.json`에 등록되어 학습자에게 노출되도록 한다. 불완전한 레벨 팩이 Cache Storage에 배포되는 경로를 차단한다.

---

#### 저장·전송 영향 — 총 볼륨 추정, 온디맨드 Cache Storage 전략 보강

**총 볼륨 추정**

| 측정 기준 | 수치 |
|---|---|
| 레벨당 평균 스니펫 수 | 20개 |
| 스니펫당 평균 크기 (비압축) | 300 B |
| 전체 레벨 수 | 35 |
| 총 볼륨 (비압축) | 35 × 20 × 300 B ≈ **210 KB** |
| 총 볼륨 (gzip) | ≈ **50~70 KB** |
| 레벨팩 1개 평균 (gzip) | ≈ **1.5~2 KB** |
| 전 레벨 동시 캐시 시 | 35 × 평균 30 KB(gzip) ≈ **1.05 MB** |

iOS Cache Storage 총량 제한을 초과하지 않으나 모니터링 공백이 존재한다 (아래 보강 참조).

**온디맨드 Cache Storage 전략 보강**

1. **팩 단위 분리:** `lang × level` 단위로 팩 파일을 분리하여 단일 팩 파일 크기를 gzip 50 KB 이하로 제한한다. 사용자가 Spring Boot L16만 학습 중이면 YAML·Dockerfile 스니펫 팩 1개만 캐시, 나머지 34레벨 팩은 미다운로드.

2. **`storage.estimate()` 경보 범위 확대 (현행 공백 수정):** 현행 §13.1 저장 레이어의 `storage.estimate()` 경보는 IndexedDB+OPFS 대상으로만 기술되어 있다. Cache Storage 사용량도 합산하여 80% 임계값 경보 대상에 포함시킨다.

```typescript
// 수정 전: IndexedDB + OPFS만 합산
// 수정 후: Cache Storage 포함
async function checkStorageQuota(): Promise<void> {
  const estimate = await navigator.storage.estimate();
  // estimate.usage에는 Cache Storage가 이미 포함됨
  // (브라우저 구현에 따라 다를 수 있으므로 Cache API usage도 별도 집계)
  const cacheUsage = await getCacheStorageUsage(); // 모든 캐시 키 합산
  const totalUsage = (estimate.usage ?? 0);
  const quota = estimate.quota ?? Infinity;
  if (totalUsage / quota > 0.8) {
    dispatchStorageWarning({ usage: totalUsage, quota, cacheUsage });
  }
}
```

3. **iOS 7일 만료 대응:** 팩을 `lang × level` 단위로 분리했으므로 iOS 7일 만료 후 학습 중인 레벨의 팩만 선택적으로 재다운로드한다. 전 레벨 일괄 재다운로드를 방지한다.

4. **sha256 기반 재다운로드 트리거:** 스니펫 오류 수정(`patch` 버전 bump) 시 해당 레벨 팩의 sha256이 변경되고, 클라이언트가 `packs-manifest.json`을 주기적으로 폴링하여 sha256 불일치를 감지하면 해당 팩만 재다운로드한다. 다른 레벨 팩의 sha256에 영향을 주지 않는다.

5. **WASM 추가 영향 없음 (현 35레벨 범위):** 커리큘럼 확장으로 구문강조 언어가 늘어도 타이핑 루프는 Lezer 어댑터(JS 번들) + 최소 regex 엔진을 사용하므로 추가 WASM은 없다. §4 장기 로드맵(TypeScript·Go·Rust)의 Tree-Sitter `.wasm` 파일(각 ~1~2 MB)은 해당 시점에 lazy-load 항목으로 추가한다.

6. **Cloudflare Pages Free 전송 비용:** 무제한 대역폭이므로 팩 용량 자체는 문제가 없다. 단 수동 큐레이션 방식에서 스니펫 오류 수정 빈도가 높을수록 sha256 불일치로 인한 재다운로드가 누적된다. 위의 semver patch 버전 채번 전략과 `lang × level` 팩 분리로 재다운로드 범위를 최소화한다.

---

#### 리스크 추가 — 표(리스크·심각도·완화책)

| # | 리스크 | 심각도 | 완화책 |
|---|---|---|---|
| R-1 | YAML 문맥 의존 문법(들여쓰기·멀티라인 블록·Helm `{{ }}` 보간)으로 인한 타이핑 판정 오류 — 토큰 경계 오인식 시 잘못된 위치에 오타 판정 | **High** | YAML 타이핑 루프 강조를 키·값·숫자·불리언·앵커 5종만 처리하는 최소 모드로 의도적 축소. Helm `{{ }}` 보간은 미강조 처리. 이 결정을 §13 언어별 강조 범위 표에 명시 |
| R-2 | SQL 방언 다중성(MySQL·PostgreSQL·H2·JPQL) — 방언별 토큰 차이로 단일 regex 커버 불가. QueryDSL 혼재 스니펫(Java+SQL+EXPLAIN)은 단일 토크나이저 처리 자체 불가 | **High** | SQL은 공통 DML 키워드 + 문자열 + 라인 주석만 인식하는 최소 집합으로 제한. QueryDSL 혼재 스니펫은 저작 단계에서 언어 단위 분할 저작 의무화. `dialect` 메타데이터로 CI 린터 자동 분기 |
| R-3 | XML 중첩 구조(MyBatis `<foreach>`·CDATA·`#{param}` 보간) — 단일 라인 regex로 태그 경계 추적 불가, 글자별 span 색 밀림으로 타이핑 판정 위치 불일치 | **High** | `@lezer/xml` (gzip ~8 KB)을 CodeMirror DOM 없이 독립 사용하는 Lezer 어댑터로 처리. `parser.parse()` → `Tree.cursor()` → `{from, to, tokenType}[]` → span 인덱스 매핑 어댑터 구현 |
| R-4 | 문자열 내 중첩 보간(Python f-string·CI YAML `${{ }}`·MyBatis XML `#{}`) — 단일 라인 regex가 중첩 `{}` 균형 검증 불가 | **High** | f-string은 깊이 1까지만 regex 처리, 중첩 함수 호출은 문자열 색 유지 fallback. CI YAML `${{ }}`는 YAML 최소 모드 미처리 텍스트로 안전하게 방치. 제한 범위를 §13에 명시 |
| R-5 | 구문강조 레이어에 동적 등록 인터페이스 부재 — 11개 언어를 단일 regex 모듈에 추가 시 초기 번들 크기 증가, 언어 간 패턴 충돌, 유지보수 복잡도 | **High** | `registerLanguage(lang, adapter)` 인터페이스 구현 + 언어별 모듈 TS 파일 분리(`lang/java.ts` 등) + 팩 로드 시 `dynamic import()`. Vite 코드 분할로 초기 TTI 영향 없음 |
| R-6 | 수동 저작 스니펫의 문법 오류·컴파일 불가 코드 배포 — 타이핑 트레이너 핵심 가치('실무 즉시 투입') 위반. 700~1400개 스니펫 전량 수동 검토는 인지 오류 불가피 | **High** | 언어별 빌드타임 CI 게이트 의무화(`javac`·`google-java-format 1.22.x`·`ruff 0.4.x`·`sqlfluff 3.x`·`yamllint 1.35.x`·`hadolint 2.12.x`·`shellcheck 0.10.x`·`xmllint`·`jq`·`taplo 0.9.x`). OSS 검증 코드 Tree-Sitter 추출로 문법 오류 원천 제거 |
| R-7 | 라이브러리 버전 드리프트 — Spring Boot 3.x minor 6개월 주기, Python AI 에코시스템(LangChain·Pydantic v1→v2) breaking change로 스니펫과 실제 API 불일치 | **High** | 팩 JSON 스키마에 `frameworkVersion·dependencyVersions` 블록 추가. Dependabot/Renovate 자동 버전 변경 PR 생성. CI 통과 후에만 semver minor bump 배포. `source.sha` 메타데이터로 버전 추적 |
| R-8 | 빌드 파이프라인 부재로 인한 sha256 수동 계산 오류 — 잘못된 sha256이 기록되면 손상된 팩이 캐시된 채로 남고 재다운로드 트리거 미발동 | **High** | `pnpm build:packs` 스크립트 또는 Vite 커스텀 플러그인이 `crypto.createHash('sha256')`로 sha256 자동 계산 및 `packs-manifest.json` 자동 갱신. 수동 편집 경로 제거 |
| R-9 | `storage.estimate()` 모니터링에서 Cache Storage 누락 — iOS 저장 한도 경보 부정확, 35레벨 전체 캐시 시 누락된 ~1.05 MB가 경보 임계값 계산에서 제외됨 | **Medium** | `storage.estimate()` 경보 로직을 수정하여 Cache Storage 사용량 합산. 80% 임계값 경보 대상에 Cache Storage 포함 |
| R-10 | 스니펫 오류 수정 빈도가 높을 시 sha256 불일치로 인한 전 레벨 팩 재다운로드 누적 — 오프라인 학습 신뢰도 훼손 | **Medium** | `lang × level` 단위 팩 분리로 수정 영향 범위 격리. semver patch = 스니펫 내용 수정, minor = 신규 추가, major = 프레임워크 major 버전 변경 채번 정책을 §13.5 결정 9항에 명시 |
| R-11 | Dockerfile `RUN` 이후 인라인 Shell의 멀티라인 헤어핀·파이프·변수 확장 — 오인식 시 색 누락 (타이핑 판정 오류는 아니나 학습 경험 저하) | **Medium** | Dockerfile 지시어 키워드 9종만 강조하고 `RUN` 이후 인라인 Shell은 기본 텍스트 색 처리. 의도적 축소 결정을 §13 언어별 강조 범위 표에 명시 |
| R-12 | JSON Schema 페이로드 50줄 초과 스니펫에서 라인별 regex O(n) 재계산 누적 — 타이핑 루프 성능 저하 | **Medium** | 스니펫 저작 정책에서 단일 스니펫 최대 50줄 제한. Prism.js JSON grammar 어댑터 사용으로 완화 |
| R-13 | GPU 의존 스니펫(L12 vLLM·L14 LoRA·QLoRA·PEFT)의 실행 가능성 오해 — 학습자가 실행 불가 코드를 실행 가능 코드로 인식 | **Medium** | 스니펫 메타데이터 `runnable: false` 플래그 추가. 타이핑 화면에 실행 불가 컨텍스트 명시 표기. CI에서 import 문과 타입 구문만 lite 게이트 적용 |
| R-14 | 불완전한 레벨 팩이 학습자에게 조기 노출 — CI 미통과 팩이 `packs-manifest.json`에 등록되어 배포됨 | **Medium** | 점진적 레벨 출시: CI 통과 후에만 `packs-manifest.json`에 등록. L1~L5 선배포 후 순차 확장 |
| R-15 | Kotlin MVP 35레벨 범위 내 포함 시 Java regex 패턴 충돌 — 문자열 템플릿·코루틴·null 안전성 연산자가 Java regex와 충돌 | **Low** | Kotlin을 MVP 35레벨 범위에서 제외. §4 장기 로드맵(TypeScript·Go·Rust)과 동일한 '언어 추가 기준 및 승인 프로세스'로 관리. 추가 조건: 해당 언어 팩 레벨 3개 이상 확정 + `@lezer/kotlin` grammar 존재 확인 후 결정 |

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

`index.html` (단일 HTML 프로토타입) 기준 — **Phase 3 풀스택(Vite+TS)으로 이식 예정**:

- **타이핑 트레이너** — 목표 코드 위 투명 입력 오버레이, 글자별 정/오 판정, 정타 시 **언어 구문 강조**, 오타는 **IDE식 물결 밑줄**(빨강=오타 / 황색=대소문자), 깜빡이는 세로 캐럿, 실시간 WPM·정확도·진행률
- **편집성** — 캐럿 이동(화살표·클릭)으로 이전 줄 수정, 중간 입력 **덮어쓰기** 처리, **Enter 자동 들여쓰기**, Tab 4칸
- **레이아웃** — 좌측 사이드 패널(학습팩 토글 · 로드맵 · 빠른학습 · 프로젝트, 아코디언), 우측 패널(패턴 숙련도 · 오타 패턴), 버거 메뉴 드롭다운
- **반응형** — 모바일(iPhone) 대응: 오프캔버스 드로어, 폭 고정·확대 방지, 터치 타깃 확대
- **테마** — 라이트/다크 토글(localStorage 유지), 코드 구문색 테마별 대비 확보
