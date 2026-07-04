# CodeMaster — PRD v3.1

> **부제:** Enterprise Backend & AI Developer Training Platform
> **문서 상태:** 정비본 (v3.0 -> v3.1, 구조 정리 + 기술 스택 적대적 검토 반영)

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

| 구분          | 대상                                                                                  |
| ------------- | ------------------------------------------------------------------------------------- |
| **Primary**   | Spring Boot 개발자 · 금융권 SI 개발자 · 공공기관 프로젝트 개발자 · 백엔드 취업 준비생 |
| **Secondary** | Python AI 개발자 · RAG 개발자 · AI Agent 개발자                                       |

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

> **플랫폼: 데스크톱(PC) 전용.** 폴더 선택·파일 스캔은 **PC에서만** 제공한다. 모바일(iOS/Android)은 큐레이션·다운로드된 학습팩 타이핑만 지원하며, 프로젝트 분석 기능은 제공하지 않는다.
> -> 이 범위 결정으로 모바일 관련 다수 리스크(iOS File System Access 미지원, 모바일 성능)가 **해소**된다. (§13.3 참조)

```
[PC] 사용자 -> 버거메뉴 '프로젝트 가져오기' -> 폴더 선택 -> 전체 파일 재귀 스캔 -> 사이드바에 프로젝트 등록 -> 파일 클릭 시 원본 타이핑 연습
```

### 6.1 분석 방식 — 파일 원본 모드

- **폴더 스캔**: `showDirectoryPicker()` API로 로컬 폴더 선택 -> `.java`, `.py`, `.xml`, `.yml`, `.yaml`, `.sql`, `.gradle`, `.properties`, `.json`, `.kt`, `.groovy`, `.toml`, `.cfg`, `.js`, `.ts`, `.go`, `.md`, `.css`, `.html`, `.rs`, `.c`, `.cpp`, `.h`, `.rb`, `Dockerfile`, `.sh` 파일 재귀 수집
- **제외 디렉토리**: `test`, `tests`, `node_modules`, `build`, `target`, `.git`, `__pycache__`, `dist`, `.idea`, `venv`, `.venv`, `env`, `out`, `.svn`, `.gradle`
- **최대 파일 수**: 500개
- **파일 원본 모드**: 각 파일을 하나의 타이핑 문제로 등록 (파일 전체 코드 그대로 연습, 패턴 추출 없음)
- **설명**: 프로젝트 파일은 설명(concept·terms·why·pitfall) 생략 — 코드 자체에 집중

### 6.2 언어 자동 감지

- `.java`, `.kt`, `.groovy`, `.xml`, `.yml`, `.yaml`, `.gradle`, `.properties`, `.sql`, `.json`, `.js`, `.ts`, `.go`, `.md`, `.css`, `.html`, `.rs`, `.c`, `.cpp`, `.h`, `Dockerfile`, `.sh` -> Java 팩으로 분류
- `.py`, `.cfg`, `.toml`, `.rb` -> Python 팩으로 분류
- 다수 확장자 기준으로 프로젝트 언어 결정

### 6.3 사이드바 프로젝트 트리

- 분석 완료 후 사이드바에 **폴더 트리**로 파일 목록 표시
- 폴더 접기/펴기(▸/▾) 지원, 모두 펼침(+)/모두 접기(−) 버튼
- 현재 타이핑 중인 파일 **하이라이트** (파란색 왼쪽 테두리 + 배경)
- 다음/이전 문제 이동 시 트리에서 활성 파일로 자동 스크롤
- ✕ 버튼으로 프로젝트 제거

### 6.4 구문 강조 지원 언어 (18종)

| 카테고리 | 언어                                   |
| -------- | -------------------------------------- |
| JVM      | Java, Kotlin                           |
| 웹       | JavaScript/TypeScript, HTML, CSS, JSON |
| 백엔드   | Python, Go, Ruby, Rust                 |
| 시스템   | C/C++, Shell/Bash                      |
| 데이터   | SQL                                    |
| 설정     | YAML, XML, Properties/Gradle           |
| 문서     | Markdown, Dockerfile                   |

### 6.5 타이핑 에디터 기능

| 기능                 | 설명                                                              |
| -------------------- | ----------------------------------------------------------------- |
| **Tab 크기**         | 2/4/8칸 설정 가능 (기본 4)                                        |
| **자동 들여쓰기**    | Enter 시 현재 줄 들여쓰기 복사, `{`·`:` 블록 열기 시 한 단계 추가 |
| **덮어쓰기 모드**    | 중간 입력 시 삽입이 아닌 덮어쓰기 (항상 적용)                     |
| **괄호 자동 닫기**   | `{`·`(`·`[` 입력 시 바로 다음 닫는 괄호 자동 완성                 |
| **따옴표 자동 닫기** | `"`·`'` 입력 시 다음 따옴표 자동 완성 (3중 따옴표 예외)           |
| **들여쓰기 가이드**  | 세로 점선으로 들여쓰기 레벨 시각화                                |
| **글자 크기**        | 12/14/16/18px 설정 가능                                           |

---

## 7. 학습팩 — Spring Boot

> **목표 수준: 실무 즉시 투입.** 입문부터 심화·운영까지 망라하여, 완주 시 금융권·엔터프라이즈 백엔드 프로젝트에 바로 투입 가능한 패턴을 모두 포함한다.

| Level | 주제                      | 세부 패턴                                                                                                                                                                                                               |
| :---: | ------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
|   1   | Java Core                 | Class, Interface, Enum, Record, Generic, Collection, Exception / *(Modern)* Lambda, Stream, Optional, CompletableFuture                                                                                                 |
|   2   | Spring Core               | DI(Component, Service, Repository, Controller), Configuration(Bean, Properties, Profile), AOP(Aspect, Advice, Pointcut)                                                                                                 |
|   3   | Spring Boot MVC           | Controller, RequestMapping, Validation, ExceptionHandler / *(API)* REST, Swagger, OpenAPI, FeignClient, ProblemDetail(RFC 7807), API 버저닝, HATEOAS                                                                    |
|   4   | Database                  | *(JPA)* Entity, Repository, JPQL, Specification, Transaction / *(MyBatis)* Mapper, ResultMap, Dynamic SQL, TypeHandler, XML Mapper                                                                                      |
|   5   | Concurrency               | Thread, Runnable, Callable, Future, CompletableFuture / *(Pool)* ExecutorService, ThreadPoolExecutor, ForkJoinPool, ScheduledExecutor / *(Concurrent)* ConcurrentHashMap, BlockingQueue, AtomicInteger, Lock, Semaphore |
|   6   | Network                   | Socket, TCP, UDP, NIO, Netty                                                                                                                                                                                            |
|   7   | Gateway                   | Spring Cloud Gateway, Route, Filter, LoadBalancer, CircuitBreaker                                                                                                                                                       |
|   8   | Messaging                 | Kafka, RabbitMQ, JMS, Event Driven                                                                                                                                                                                      |
|   9   | Batch                     | Spring Batch, Job, Step, Reader, Processor, Writer                                                                                                                                                                      |
|  10   | Security                  | Spring Security, JWT, OAuth2, RBAC, SecurityFilterChain                                                                                                                                                                 |
|  11   | Cache                     | Redis, Caffeine, EhCache                                                                                                                                                                                                |
|  12   | Monitoring                | Actuator, Micrometer, Prometheus, Grafana                                                                                                                                                                               |
|  13   | Testing                   | JUnit5, Mockito, TestContainers                                                                                                                                                                                         |
|  14   | Architecture              | MVC, Layered, Hexagonal, DDD, CQRS, Event Sourcing                                                                                                                                                                      |
|  15   | Design Pattern            | Singleton, Factory, Builder, Strategy, Observer, Template Method, Decorator, Adapter                                                                                                                                    |
|  16   | Build & DevOps            | Gradle Multi-Module, Dockerfile, Docker Compose, Kubernetes, Helm, CI/CD(GitHub Actions·Jenkins)                                                                                                                        |
|  17   | Observability             | Logback·SLF4J·MDC 구조화 로깅, Distributed Tracing(Micrometer Tracing·Zipkin), ELK, Sentry                                                                                                                              |
|  18   | Data 심화                 | QueryDSL, HikariCP 튜닝, Flyway·Liquibase 마이그레이션, 인덱스·실행계획(EXPLAIN), N+1 해결, 페이징                                                                                                                      |
|  19   | Resilience & Cloud-Native | Resilience4j(Retry·CircuitBreaker·Bulkhead·RateLimiter), Service Discovery(Eureka), Config Server, Saga·분산 트랜잭션                                                                                                   |
|  20   | Reactive                  | WebFlux, Reactor(Mono·Flux), R2DBC, SSE·Streaming, Backpressure                                                                                                                                                         |

---

## 8. 학습팩 — Python AI

> **목표 수준: 실무 즉시 투입.** 완주 시 RAG·AI Agent·LLM 서빙을 포함한 프로덕션 AI 프로젝트에 바로 투입 가능한 패턴을 모두 포함한다.

| Level | 주제                 | 세부 패턴                                                                                             |
| :---: | -------------------- | ----------------------------------------------------------------------------------------------------- |
|   1   | Python Core          | Function, Class, Module, Package, Dataclass, Typing                                                   |
|   2   | Async                | Asyncio, Threading, Multiprocessing, Queue                                                            |
|   3   | Data                 | NumPy, Pandas, Matplotlib, Polars                                                                     |
|   4   | Machine Learning     | Scikit-Learn, XGBoost, LightGBM                                                                       |
|   5   | Deep Learning        | PyTorch, TensorFlow, Dataset, Training Loop                                                           |
|   6   | LLM                  | Transformers, Tokenizer, Embedding, SentenceTransformer                                               |
|   7   | RAG                  | Chunking, Embedding, Vector Database, Retriever, Reranker, Hybrid Search                              |
|   8   | AI Agent             | Tool Calling, Memory, Planning, Reflection, Multi Agent                                               |
|   9   | Framework            | LangChain, LlamaIndex, CrewAI, AutoGen, DSPy                                                          |
|  10   | Production AI        | FastAPI, Pydantic, SQLAlchemy, Celery, Redis, Docker, pytest, mypy, ruff                              |
|  11   | Vector Store 실무    | pgvector, Qdrant, Weaviate, Milvus, FAISS, HNSW·양자화, 메타데이터 필터링                             |
|  12   | LLM 서빙·최적화      | vLLM, Ollama, TGI, 양자화(GGUF·AWQ·GPTQ), 스트리밍(SSE), 배치 추론, KV Cache                          |
|  13   | 프롬프트·구조화 출력 | Few-shot, Chain-of-Thought, Tool/Function Calling, JSON Schema, Pydantic 구조화 출력, 출력 검증       |
|  14   | Fine-tuning & MLOps  | LoRA, QLoRA, PEFT, MLflow, 실험 추적, 모델 레지스트리, DVC, W&B                                       |
|  15   | AI 품질·관측·보안    | RAGAS·LLM Eval, Langfuse·LangSmith, Guardrails, Prompt Injection 방어, PII 마스킹, Hallucination 측정 |

### 8.1 학습팩 콘텐츠 버전 기준 (§7·§8 공통 — LTS/안정화)

스니펫은 **LTS·안정 GA 버전**을 기준으로 작성한다. 버전이 흔들리는 라이브러리는 팩별 `frameworkVersion`에 고정(pin)하고 Dependabot/Renovate로 추적한다(§13.6).

| 대상              | 기준 버전                    | 비고                                                                     |
| ----------------- | ---------------------------- | ------------------------------------------------------------------------ |
| **Java**          | **21 (LTS)**                 | Spring Boot 3.x 요구 17+, 21이 현 엔터프라이즈 표준 LTS                  |
| **Spring Boot**   | **3.4.x (최신 GA, Java 21)** | 3.x 안정 라인. 팩별 의존성 버전 pin                                      |
| **빌드**          | Gradle 8.x                   | 멀티모듈(L16)                                                            |
| **Python**        | **3.12 (안정)**              | AI/ML 라이브러리 광범위 지원. 3.13은 호환 확인 후                        |
| **AI 라이브러리** | 팩별 pin                     | LangChain·Pydantic v2 등 breaking 잦음 -> `frameworkVersion` + 자동 추적 |

> 신규 LTS 출시 시(예: Java 25, Spring Boot 차기 GA) 검증 후 팩 `major` 버전 bump으로 일괄 갱신한다(§13.6 semver).

---

## 9. 핵심 기능

| 기능                           | 설명                                                                                                                           |
| ------------------------------ | ------------------------------------------------------------------------------------------------------------------------------ |
| **Code Typing**                | 실제 코드 따라치기 (구문 강조, 오타 물결 표시, 자동 들여쓰기, 실시간 WPM·정확도)                                               |
| **Pattern Practice**           | 특정 패턴 집중 연습                                                                                                            |
| **Project Import** *(PC 전용)* | 로컬 프로젝트 폴더 분석 -> 학습 데이터화 — **데스크톱에서만 제공**                                                             |
| **Category Learning**          | 카테고리별 학습                                                                                                                |
| **Weak Point Learning**        | 취약 영역 반복 학습                                                                                                            |
| **Statistics (인라인)**        | 속도 · 정확도 · 숙련도 · 학습 시간 — 별도 대시보드가 아니라 **학습 화면에 인라인 표시**(실시간 지표 + 패턴 숙련도 + 오타 패턴) |

---

## 10. 데이터 저장

- **저장소:** IndexedDB (클라이언트 로컬, 오프라인)
- **저장 항목:** 사용자 설정 · 학습 기록 · 숙련도 · 프로젝트 분석 결과

### 10.1 학습팩 온디맨드 저장 전략

학습팩(레벨별 코드 데이터셋)이 커지면 단말 저장 공간을 압박할 수 있으므로, 전체를 한 번에 받지 않고 **필요한 단위만 받고 비우는** 방식으로 관리한다.

- **온디맨드 다운로드** — 진행하는 **팩/레벨 단위로 그때그때 다운로드** (초기 설치 용량 최소화)
- **삭제·회수** — 완료했거나 사용하지 않는 팩은 **삭제 가능** -> 저장 공간 즉시 회수
- **공간 관리 UI** — 현재 받은 팩 목록·용량 표시, 미사용 팩 자동 정리(옵션)
- **오프라인 보장** — 한 번 받은 팩은 캐시되어 오프라인 학습 가능. 다운로드 시점에만 네트워크 필요 (이후 완전 오프라인)
- **무결성** — 다운로드 팩 버전·체크섬 관리로 손상/구버전 감지 후 재다운로드

> 저장 매체(IndexedDB vs Cache Storage)·용량 한도·iOS 데이터 만료 정책은 **§13 기술 스택** 적대적 검토 결과를 따른다.

---

## 11. 비기능 요구사항 (NFR)

> 적대적 검토 결과, 단일 수치는 모바일(iOS Safari/iPhone 8)에서 비현실적이므로 **플랫폼별로 분리** 정의한다. (근거: §13.4 NFR 현실성 평가)

| 항목                      | 데스크톱 / iOS 16+ | 모바일 (iOS Safari, iPhone 8)                      |
| ------------------------- | ------------------ | -------------------------------------------------- |
| **앱 시작 (TTI)**         | 3초 이내           | 3초 이내 (LTE 첫 방문 기준 ≈ 1초)                  |
| **파일 분석** *(PC 전용)* | 500파일 10초 이내  | **해당 없음** — 프로젝트 분석은 데스크톱 전용 (§6) |
| **메모리 (브라우저 탭)**  | 1.5GB 이하         | **700MB 이하** (iPhone 8 Safari 실질 상한)         |
| **오프라인 학습**         | 지원               | 지원                                               |

**공통 달성 조건:** 외부 CDN 0개(폰트·아이콘 self-host), span 가상화, 분석 결과 즉시 IndexedDB flush.

---

## 12. 제외 항목 (Non-Goals)

- AI 코드 생성
- 자동 프로젝트 생성
- 클라우드 동기화
- 온라인 랭킹
- 실시간 협업

---

## 13. 기술 스택 (현재 구현 기준)

> **플랫폼 범위 결정 (§6)**: **프로젝트 폴더 분석은 데스크톱(PC) 전용**, 모바일은 학습팩 타이핑 전용. 이에 따라 *폴더 선택·코드 파싱* 레이어는 **PC 환경 기준**으로만 적용되며, 관련 모바일 리스크(FSAA 핸들 영속화 등)는 **해소**된 것으로 표기한다.

### 13.1 권장 스택 (레이어별 — 현재 구현 기준)

| 레이어                                | 선택                                                                                        | 비고                                                                                                                                               |
| ------------------------------------- | ------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------- |
| **앱 프레임워크 / 빌드**              | **Vite 5.x + Vanilla TypeScript**                                                           | VDOM 오버헤드 없이 타이핑 루프 성능 유리.                                                                                                          |
| **타이핑 엔진**                       | **Vanilla TS 모듈**(`initTypingEngine`) + rAF dirty-flag throttle + span 가상화(화면 ±5줄)  | 글자별 span 오버레이·덮어쓰기·스크롤 동기화.                                                                                                       |
| **코드 파싱 / 분석** *(PC 전용)*      | **regex 경량 파서**                                                                         | Tree-Sitter/WASM/Worker Pool **미사용**. 파일 원본 모드 (패턴 추출 없음, 전체 원문 저장). `showDirectoryPicker()` -> 재귀 파일 스캔. 최대 500파일. |
| **폴더 선택 / 파일 접근** *(PC 전용)* | **`showDirectoryPicker`** + `<input webkitdirectory>` 폴백                                  | (PC 전용) 모바일 해당 없음                                                                                                                         |
| **저장**                              | **IndexedDB**                                                                               | 소스코드 **전체 원문 저장**. 설정·학습 기록·숙련도·프로젝트 분석 결과.                                                                             |
| **학습팩 배포·저장**                  | **Cache Storage API** + 정적 호스팅 + 매니페스트 sha256 / IndexedDB(기록·숙련도)와 **분리** | 온디맨드 다운로드·삭제(§10.1).                                                                                                                     |
| **PWA / 오프라인**                    | **Service Worker 비활성 (킬 스위치)**                                                       | 현재 SW 미사용. manifest.json만 유지.                                                                                                              |
| **구문 강조**                         | **regex SYN 엔진(TS)** — 18개 언어 지원                                                     | Java, Python, Kotlin, JS/TS, HTML, CSS, JSON, Go, Ruby, Rust, C/C++, Shell, SQL, YAML, XML, Properties/Gradle, Markdown, Dockerfile                |
| **상태 관리**                         | **Zustand 5.x vanilla store**(`createStore`, gzip ≈ 1 KB)                                   | 앱 상태 일원화.                                                                                                                                    |
| **폰트 / 아이콘**                     | JetBrains Mono + Inter **self-host woff2** / lucide **npm ESM named import**                | 외부 CDN 0개.                                                                                                                                      |
| **테스트**                            | **Vitest 2.x**(단위) + **Playwright 1.x WebKit**(E2E)                                       | 타이핑 정확도·WPM·IndexedDB 단위.                                                                                                                  |
| **배포**                              | **GitHub Pages** (`https://mykim711231.github.io/CodeMaster/`)                              | 현재 배포 환경.                                                                                                                                    |

### 13.2 구현 범위 및 권장 빌드 순서

전 레이어를 **풀스택으로 채택**한다(단계적 보류 없음). 단, 안정적 구성을 위한 **권장 빌드 순서**:

1. **스캐폴드** — Vite + TypeScript + ESLint/Prettier 초기화, 외부 CDN 제거(폰트 self-host · lucide npm ESM)
2. **타이핑 엔진 이식** — 현 엔진 TS 모듈화(`initTypingEngine`), `pos` 버그 수정, rAF dirty-flag throttle, span 가상화, IME 가드, Python 구문강조 확장
3. **상태·저장** — Zustand store + IndexedDB 스키마 + 학습팩 Cache Storage 로더(온디맨드 다운로드·삭제)
4. **PWA** — Service Worker **비활성(킬 스위치)**, `manifest.json` 유지, `storage.persist()` 온보딩
5. **분석 (PC 전용)** — regex 경량 파서 (Tree-Sitter/WASM/Worker Pool 미사용), 파일 원본 모드, `showDirectoryPicker`
6. **테스트** — Vitest 단위(타이핑 정확도·WPM·저장) + Playwright WebKit E2E + 보안 회귀
7. **배포·보안** — GitHub Pages + CSP/Lighthouse CI

> **채택하지 않는 것:** React/Vue(VDOM 오버헤드 -> 타이핑 루프 성능), Monaco/CodeMirror(번들·모바일 IME 충돌), Shiki 전역 적용(글자별 인라인 color 구조와 불일치), Tree-Sitter/WASM/Worker Pool(현재 regex 경량 파서로 충분).

### 13.3 리스크 레지스터 (High/Medium 우선)

| 리스크                                       | 심각도               | 영향                                                                                     | 완화책                                                                                                           |
| -------------------------------------------- | -------------------- | ---------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------- |
| File System Access handle 영속화 불가(iOS)   | ~~High~~ -> **해소** | (PC 전용 기능) 데스크톱 Chromium은 IndexedDB 핸들 영속화 지원. 모바일은 폴더 분석 미제공 | PC: `showDirectoryPicker` + 핸들 IndexedDB 저장. 모바일은 해당 없음                                              |
| IndexedDB 7일 ITP 만료(iOS 비 PWA)           | High                 | 학습 이력 초기화 -> 핵심 가치 훼손                                                       | `storage.persist()` 필수, 홈 화면 추가 유도, JSON export, 만료 감지 '재분석 필요' 안내                           |
| Google Fonts + unpkg COEP 충돌·오프라인 위반 | High                 | COEP 시 폰트·아이콘 차단, 오프라인 UI 깨짐                                               | 폰트 self-host, lucide npm ESM. 외부 CDN 0개 달성 후 COEP                                                        |
| CSP 미선언 + 인라인 스크립트 노출            | High                 | XSS 시 IndexedDB 학습·분석 데이터 유출                                                   | 인라인 분리 후 `script-src 'self'`. `nosniff/DENY/no-referrer` `_headers` 명시                                   |
| SW 업데이트 중 세션 강제 리로드              | —                    | **해당 없음** — Service Worker 비활성(킬 스위치)                                         | SW 미사용                                                                                                        |
| 메인스레드 블로킹(파싱+타이핑 충돌)          | Medium               | 대용량 파일 분석 중 입력 블로킹                                                          | 분석 시 파일 50개씩 순차 처리, rAF 단일 패턴                                                                     |
| span 모바일 확장성(5000+ span)               | High                 | 300줄+ 파일 update() 40~80ms -> 프레임 예산 초과                                         | span 가상화(화면 ±5줄), 50줄 섹션 분할, requestIdleCallback                                                      |
| COEP ↔ Google Fonts 동시 불가                | Medium               | COEP 시 폰트 차단                                                                        | 외부 CDN 제거 후 COEP(순서 의존)                                                                                 |
| IndexedDB 50 MB 팝업                         | Medium               | UX 마찰                                                                                  | `storage.estimate()` 80% 경고                                                                                    |
| 학습팩 Cache Storage iOS 7일 만료            | Medium               | 오프라인 학습팩 소실                                                                     | 온디맨드 재다운로드(전략상 자연 완화) + `storage.persist()` + 매니페스트 버전/sha256 검증 + 받은 팩·용량 표시 UI |
| unpkg 공급망 공격(현 프로토타입)             | Medium               | lucide 탈취 시 XSS                                                                       | npm ESM 교체, MVP는 SVG 인라인                                                                                   |

### 13.4 NFR 현실성 평가 (요약)

- **앱 시작 <3초** — 달성 가능. 외부 CDN 제거 + 초기 번들 최소화 시 iPhone 8 LTE TTI ≈ 0.8~1.2초. Tree-Sitter/WASM 미사용으로 초기 로드 부담 없음.
- **500파일 <10초 (PC 전용)** — 프로젝트 분석은 데스크톱에서만 실행. regex 경량 파서로 충분히 달성 가능. 모바일은 분석을 실행하지 않으므로 이 NFR 대상이 아님.
- **메모리 <2GB** — 모바일 기준 무의미. iPhone 8 Safari 탭 실질 상한 ≈ **700 MB**(초과 시 탭 리로드). WASM 미사용으로 메모리 부담 감소, span 가상화 전제.

### 13.5 핵심 결정 사항

1. **폴더 선택 기본을 webkitdirectory로** — `showDirectoryPicker`는 progressive enhancement. 분석 결과 IndexedDB 저장으로 핸들 없이 학습 지속. 핸들 영속화 의존 금지.
2. **regex 경량 파서 사용** — Tree-Sitter/WASM 미사용. 파일 원본 모드로 각 파일을 하나의 타이핑 문제로 등록 (패턴 추출 없음, 전체 원문 저장).
3. **소스코드 전체 원문 저장** — 각 파일의 전체 코드를 IndexedDB에 저장. 시크릿 마스킹(엔트로피/키워드) 적용, `.env·*.key·*.pem` 파일 분석 제외.
4. **iOS 데이터 수명 보호** — `storage.persist()` 온보딩 필수, 홈 화면 추가 배너, `storage.estimate()` 모니터링, JSON export, 7일 만료 감지 안내.
5. **외부 CDN 전면 제거 = COEP 전제** — 폰트 self-host + lucide npm/SVG. 제거 완료 후에만 `_headers` COEP/COOP 활성.
6. **NFR 플랫폼별 분리** — §11 참조.
7. **풀스택 즉시 채택** — Vite + TypeScript 기반으로 Zustand·Vitest·CSP를 **하나의 아키텍처로 통합**. §13.2 빌드 순서로 진행.
8. **보안 요건 (전 구간 적용)** — 외부 CDN 0개, `innerHTML` 금지(`textContent`/`createTextNode` 전용), `.env/*.key/*.pem/*secret*/*credential*` 분석 제외+경고, CSP `script-src 'self'` + `X-Content-Type-Options: nosniff`·`X-Frame-Options: DENY`·`Referrer-Policy: no-referrer`.
9. **학습팩 = Cache Storage / 사용자 데이터 = IndexedDB 분리** (§10.1 연계) — 팩(불변 정적 코드 묶음)은 Cache Storage API로 온디맨드 다운로드·캐시·일괄 삭제(`caches.delete`로 공간 회수), 학습 기록·숙련도는 IndexedDB. 팩 매니페스트(`id·version·sha256·lang·level·size`)로 버전·무결성 관리. iOS 7일 만료는 재다운로드로 흡수. 받은 팩 목록·용량 표시 + 미사용 자동 정리(옵션).
10. **Service Worker 비활성 (킬 스위치)** — 현재 SW 미사용. 향후 필요 시 재검토.

### 13.6 커리큘럼 확장 영향 (다중 언어 · 콘텐츠 파이프라인)

#### 추가로 필요한 언어/포맷 — 표(언어·용도 레벨·구문강조 처리 방식)

| 언어/포맷  | 주요 용도 레벨                                              | 구문강조 처리 방식                                        | 비고                             |
| ---------- | ----------------------------------------------------------- | --------------------------------------------------------- | -------------------------------- |
| Java       | L1~L20 전체                                                 | **Lezer 어댑터** (`@lezer/java` gzip ~12 KB)              | 기존 regex -> Lezer로 교체       |
| Python     | L1~L15 전체                                                 | **Lezer 어댑터** (`@lezer/python` gzip ~10 KB)            | 중첩 f-string 깊이 1까지만       |
| XML        | L4 MyBatis XML Mapper, Dynamic SQL                          | **Lezer 어댑터** (`@lezer/xml` gzip ~8 KB)                | CDATA·중첩 태그 정확 처리        |
| SQL        | L4 JPQL·Native, L18 QueryDSL·EXPLAIN·Flyway, L11 pgvector   | **최소 regex** (공통 DML 키워드 + 문자열 + 라인 주석)     | 방언별 확장 토큰은 미강조        |
| YAML       | L16 Docker Compose·K8s·Helm, L17 Logback·CI, L14 MLflow/DVC | **최소 regex** (키·값·숫자·불리언·앵커 5종)               | Helm `{{ }}` 보간은 미강조       |
| Dockerfile | L16 멀티스테이지 빌드, L10·L12 서빙 이미지                  | **최소 regex** (지시어 키워드 9종)                        | `RUN` 이후 인라인 Shell은 미강조 |
| Bash/Shell | L16 Helm·kubectl 스크립트, CI inline shell                  | **최소 regex** (키워드·`$VAR`·주석·문자열 4종)            | 복합 보간·`[[ ]]`은 미강조       |
| JSON       | L13 JSON Schema·Function Calling 페이로드·구조화 출력       | **Prism.js JSON grammar 어댑터** (gzip ~1.5 KB)           | 스니펫 최대 50줄 제한            |
| TOML       | pyproject.toml (Python 전 레벨)                             | **최소 regex** (키·값·섹션·주석 4종)                      | 위험도 낮음                      |
| Properties | L2·L19 Spring application.properties, Config Server         | **최소 regex** (키·값·`#`·`!` 주석 4종)                   | `\\` 멀티라인은 미강조           |
| Kotlin     | 향후 Spring Boot 스니펫 일부                                | **MVP 35레벨 범위 제외** — 언어 추가 기준 프로세스로 관리 | Lezer grammar 존재 확인 후 결정  |

> **언어 추가 기준 (§4 장기 로드맵 TypeScript·Go·Rust·Kotlin 공통 적용):** 해당 언어 학습팩 레벨이 3개 이상 확정되고, `@lezer/<lang>` grammar 패키지가 존재하며, 담당자 승인 PR이 CI를 통과한 경우에 한해 추가한다.

---

#### 구문 강조 레이어 결정 — regex SYN 확장 vs 언어별 grammar 도입, 글자별 토큰 배열 변환 방식, 최종 권장

**핵심 제약 재확인**

타이핑 엔진은 목표 코드의 각 글자에 대해 개별 `<span>`을 생성하고 입력 이벤트마다 해당 span의 클래스(`correct·incorrect·cursor`)를 갱신하는 구조다. Shiki는 전체 소스를 `<pre><code>` HTML 문자열로 일괄 출력하므로 글자 단위 span과 위치 인덱스가 맞지 않는다. CodeMirror 6는 자체 DOM을 관리하므로 외부 글자 단위 span 삽입이 불가하다. Monaco는 번들 크기(~5 MB)와 모바일 IME 충돌로 기각(§13.5 결정)되어 있다. **따라서 글자별 span 구조를 변경하지 않고 토큰 소스만 교체하는 경로가 유일하다.**

**언어 복잡도 3단 분류 및 처리 방식**

| 분류                                | 대상 언어                                     | 처리 방식                                                                                       | 이유                                                                                 |
| ----------------------------------- | --------------------------------------------- | ----------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------ |
| **Tier 1 — Lezer 어댑터**           | Java, Python, XML                             | `parser.parse(source)` -> `Tree.cursor()` 순회 -> `{from, to, tokenType}[]` -> span 인덱스 매핑 | 중첩·문맥 의존 문법을 regex로 처리 불가. 중첩 CDATA, f-string 중첩 보간, 제네릭 포함 |
| **Tier 2 — 최소 regex + 범위 축소** | SQL, YAML, Bash, Dockerfile, TOML, Properties | 언어별 5~8개 토큰 클래스만 처리. 복잡한 보간·방언·멀티라인은 의도적으로 미강조                  | 타이핑 판정 오류 방지 우선. 색 누락 허용                                             |
| **Tier 3 — Prism.js 어댑터**        | JSON                                          | `Prism.tokenize(source, Prism.languages.json)` -> 토큰 배열 -> span 인덱스 매핑                 | Prism.js JSON grammar gzip ~1.5 KB로 경제적. 단 스니펫 50줄 이하 제한                |

**Lezer 어댑터 글자별 토큰 배열 변환 방식**

```
@lezer/java (또는 /python, /xml) — CodeMirror DOM 없이 독립 사용
  ↓ parser.parse(source)
  ↓ Tree.cursor() 순회
  ↓ { from: number, to: number, type: string }[]
  ↓ TokenAdapter.toSpanIndex(tokens, source)
  -> charTokenMap: Array<string>  // 글자 인덱스 -> 토큰 타입
  -> 타이핑 엔진 span 생성 시 charTokenMap[i]로 CSS 클래스 결정
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

| 언어       | 처리 클래스                                                                                                      | 의도적 미강조 범위                                                       |
| ---------- | ---------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------ |
| Java       | 식별자·어노테이션·제네릭·리터럴·키워드·주석                                                                      | — (Lezer 전담)                                                           |
| Python     | 키워드·데코레이터·f-string 깊이 1·리터럴·주석                                                                    | 중첩 함수 호출 `f'{func(a,b)}'` -> 문자열 색 유지                        |
| XML        | 태그명·속성명·속성값·CDATA                                                                                       | MyBatis `#{param}` 보간은 속성값 색 유지                                 |
| SQL        | `SELECT·FROM·WHERE·JOIN·ON·GROUP BY·ORDER BY·LIMIT·INSERT·UPDATE·DELETE·CREATE·ALTER·INDEX` + 문자열 + `--` 주석 | PostgreSQL `::`·`<->`·`$`, JPQL `:param`, Flyway 메타 주석, H2 전용 함수 |
| YAML       | 키·문자열·숫자·불리언·앵커(`&·*`)                                                                                | 블록 스칼라(`\|`·`>`), Helm `{{ .Values.xxx }}`, Jinja2 보간             |
| Dockerfile | `FROM·RUN·COPY·ENV·ARG·EXPOSE·ENTRYPOINT·CMD·LABEL·WORKDIR·USER·VOLUME·ONBUILD`                                  | `RUN` 이후 인라인 Shell 전체                                             |
| Bash       | `if·for·while·do·done·fi·case·esac·function` + `$VAR·${VAR}` + `#` 주석 + `''·""` 문자열                         | `${{ }}` CI 이중 보간, `[[ ]]` 복합 조건, `\\` 라인 연속                 |
| JSON       | 키·문자열·숫자·불리언·null (Prism.js)                                                                            | 스니펫 50줄 초과 시 전체 미강조 fallback                                 |
| TOML       | 키·값·`[section]`·`[[array]]`·`#` 주석                                                                           | 날짜 리터럴·인라인 테이블                                                |
| Properties | `key=value·key: value`·`#·!` 주석                                                                                | `\\` 멀티라인 연속 값                                                    |

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
    "java": "21",
    "springBoot": "3.4.x",
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

| 언어/포맷                  | 검증 도구                                                   | 게이트 조건                    |
| -------------------------- | ----------------------------------------------------------- | ------------------------------ |
| Java                       | `google-java-format 1.22.x --dry-run --set-exit-if-changed` | 포맷 불일치 시 차단            |
| Python (`runnable: true`)  | `ruff check 0.4.x` + `python -m py_compile`                 | 린트 오류·문법 오류 시 차단    |
| Python (`runnable: false`) | `ruff check --select=E9,F` (문법·import만)                  | GPU 의존 코드 lite 게이트      |
| SQL                        | `sqlfluff 3.x lint --dialect ${snip.dialect}`               | dialect 메타데이터로 자동 분기 |
| XML                        | `xmllint --noout`                                           | 파싱 오류 시 차단              |
| YAML (일반)                | `yamllint 1.35.x -c .yamllint`                              | 들여쓰기·탭 오류 시 차단       |
| YAML (Helm values)         | `yamllint` + `helm lint 3.x`                                | Helm 구조 오류 시 추가 차단    |
| Dockerfile                 | `hadolint 2.12.x`                                           | `DL` 레벨 경고 시 차단         |
| Bash/Shell                 | `shellcheck 0.10.x -S error`                                | error 레벨 시 차단             |
| JSON                       | `jq . /dev/null` 파싱 검증                                  | 파싱 오류 시 차단              |
| TOML                       | `taplo 0.9.x lint`                                          | 형식 오류 시 차단              |
| Properties                 | key=value regex 형식 검증                                   | 구분자 오류 시 차단            |

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

| 범프                         | 조건                                                         |
| ---------------------------- | ------------------------------------------------------------ |
| `patch` (예: 1.0.0 -> 1.0.1) | 스니펫 내용 수정 (오류 수정·문구 변경)                       |
| `minor` (예: 1.0.0 -> 1.1.0) | 스니펫 신규 추가 또는 레벨 신설                              |
| `major` (예: 1.0.0 -> 2.0.0) | 대상 프레임워크 major 버전 변경 (예: Spring Boot 3.x -> 4.x) |

팩은 `lang × level` 단위로 분리(`java_l16_v1.2.0.json`)하여 단일 스니펫 수정이 다른 레벨 팩의 sha256에 영향을 주지 않도록 격리한다.

**OSS 검증 코드 추출 전략**

수동 저작 700~1400개 스니펫 전량을 사람이 검토하는 방식은 문법 오류와 버전 드리프트를 구조적으로 예방하지 못한다. Spring PetClinic, spring-boot-examples, fastapi, langchain, mybatis-3 등 검증된 OSS에서 실제 컴파일된 코드를 Class/Method/Interface 단위로 잘라내어 팩 소스로 사용한다. 이 방식은 문법 오류 리스크를 원천 제거한다. `source.repo·sha·path` 메타데이터로 버전 추적과 저작권 명시를 동시에 달성한다.

Dependabot 또는 Renovate를 `packages/packs/` 리포지토리(또는 디렉터리)에 적용하여 라이브러리 버전 변경 PR이 자동 생성되도록 하고, 해당 PR이 CI 검증을 통과해야만 팩 버전을 semver bump하여 배포한다.

**점진적 레벨 출시 전략:** L1~L5를 먼저 배포하고, 각 레벨 팩이 CI를 통과한 후에만 `packs-manifest.json`에 등록되어 학습자에게 노출되도록 한다. 불완전한 레벨 팩이 Cache Storage에 배포되는 경로를 차단한다.

---

#### 저장·전송 영향 — 총 볼륨 추정, 온디맨드 Cache Storage 전략 보강

**총 볼륨 추정**

| 측정 기준                   | 수치                                |
| --------------------------- | ----------------------------------- |
| 레벨당 평균 스니펫 수       | 20개                                |
| 스니펫당 평균 크기 (비압축) | 300 B                               |
| 전체 레벨 수                | 35                                  |
| 총 볼륨 (비압축)            | 35 × 20 × 300 B ≈ **210 KB**        |
| 총 볼륨 (gzip)              | ≈ **50~70 KB**                      |
| 레벨팩 1개 평균 (gzip)      | ≈ **1.5~2 KB**                      |
| 전 레벨 동시 캐시 시        | 35 × 평균 30 KB(gzip) ≈ **1.05 MB** |

iOS Cache Storage 총량 제한을 초과하지 않으나 모니터링 공백이 존재한다 (아래 보강 참조).

**온디맨드 Cache Storage 전략 보강**

1. **팩 단위 분리:** `lang × level` 단위로 팩 파일을 분리하여 단일 팩 파일 크기를 gzip 50 KB 이하로 제한한다. 사용자가 Spring Boot L16만 학습 중이면 YAML·Dockerfile 스니펫 팩 1개만 캐시, 나머지 34레벨 팩은 미다운로드.

2. **`storage.estimate()` 경보 범위 확대 (현행 공백 수정):** 현행 저장 레이어의 `storage.estimate()` 경보는 IndexedDB 대상으로만 기술되어 있다. Cache Storage 사용량도 합산하여 80% 임계값 경보 대상에 포함시킨다.

```typescript
// 수정 전: IndexedDB만 합산
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

5. **Cloudflare Pages Free 전송 비용:** 무제한 대역폭이므로 팩 용량 자체는 문제가 없다. 단 수동 큐레이션 방식에서 스니펫 오류 수정 빈도가 높을수록 sha256 불일치로 인한 재다운로드가 누적된다. 위의 semver patch 버전 채번 전략과 `lang × level` 팩 분리로 재다운로드 범위를 최소화한다.

---

#### 리스크 추가 — 표(리스크·심각도·완화책)

| #    | 리스크                                                                                                                                                       | 심각도     | 완화책                                                                                                                                                                                                                           |
| ---- | ------------------------------------------------------------------------------------------------------------------------------------------------------------ | ---------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| R-1  | YAML 문맥 의존 문법(들여쓰기·멀티라인 블록·Helm `{{ }}` 보간)으로 인한 타이핑 판정 오류 — 토큰 경계 오인식 시 잘못된 위치에 오타 판정                        | **High**   | YAML 타이핑 루프 강조를 키·값·숫자·불리언·앵커 5종만 처리하는 최소 모드로 의도적 축소. Helm `{{ }}` 보간은 미강조 처리. 이 결정을 §13 언어별 강조 범위 표에 명시                                                                 |
| R-2  | SQL 방언 다중성(MySQL·PostgreSQL·H2·JPQL) — 방언별 토큰 차이로 단일 regex 커버 불가. QueryDSL 혼재 스니펫(Java+SQL+EXPLAIN)은 단일 토크나이저 처리 자체 불가 | **High**   | SQL은 공통 DML 키워드 + 문자열 + 라인 주석만 인식하는 최소 집합으로 제한. QueryDSL 혼재 스니펫은 저작 단계에서 언어 단위 분할 저작 의무화. `dialect` 메타데이터로 CI 린터 자동 분기                                              |
| R-3  | XML 중첩 구조(MyBatis `<foreach>`·CDATA·`#{param}` 보간) — 단일 라인 regex로 태그 경계 추적 불가, 글자별 span 색 밀림으로 타이핑 판정 위치 불일치            | **High**   | `@lezer/xml` (gzip ~8 KB)을 CodeMirror DOM 없이 독립 사용하는 Lezer 어댑터로 처리. `parser.parse()` -> `Tree.cursor()` -> `{from, to, tokenType}[]` -> span 인덱스 매핑 어댑터 구현                                              |
| R-4  | 문자열 내 중첩 보간(Python f-string·CI YAML `${{ }}`·MyBatis XML `#{}`) — 단일 라인 regex가 중첩 `{}` 균형 검증 불가                                         | **High**   | f-string은 깊이 1까지만 regex 처리, 중첩 함수 호출은 문자열 색 유지 fallback. CI YAML `${{ }}`는 YAML 최소 모드 미처리 텍스트로 안전하게 방치. 제한 범위를 §13에 명시                                                            |
| R-5  | 구문강조 레이어에 동적 등록 인터페이스 부재 — 11개 언어를 단일 regex 모듈에 추가 시 초기 번들 크기 증가, 언어 간 패턴 충돌, 유지보수 복잡도                  | **High**   | `registerLanguage(lang, adapter)` 인터페이스 구현 + 언어별 모듈 TS 파일 분리(`lang/java.ts` 등) + 팩 로드 시 `dynamic import()`. Vite 코드 분할로 초기 TTI 영향 없음                                                             |
| R-6  | 수동 저작 스니펫의 문법 오류·컴파일 불가 코드 배포 — 타이핑 트레이너 핵심 가치('실무 즉시 투입') 위반. 700~1400개 스니펫 전량 수동 검토는 인지 오류 불가피   | **High**   | 언어별 빌드타임 CI 게이트 의무화(`javac`·`google-java-format 1.22.x`·`ruff 0.4.x`·`sqlfluff 3.x`·`yamllint 1.35.x`·`hadolint 2.12.x`·`shellcheck 0.10.x`·`xmllint`·`jq`·`taplo 0.9.x`). OSS 검증 코드 추출로 문법 오류 원천 제거 |
| R-7  | 라이브러리 버전 드리프트 — Spring Boot 3.x minor 6개월 주기, Python AI 에코시스템(LangChain·Pydantic v1->v2) breaking change로 스니펫과 실제 API 불일치      | **High**   | 팩 JSON 스키마에 `frameworkVersion·dependencyVersions` 블록 추가. Dependabot/Renovate 자동 버전 변경 PR 생성. CI 통과 후에만 semver minor bump 배포. `source.sha` 메타데이터로 버전 추적                                         |
| R-8  | 빌드 파이프라인 부재로 인한 sha256 수동 계산 오류 — 잘못된 sha256이 기록되면 손상된 팩이 캐시된 채로 남고 재다운로드 트리거 미발동                           | **High**   | `pnpm build:packs` 스크립트 또는 Vite 커스텀 플러그인이 `crypto.createHash('sha256')`로 sha256 자동 계산 및 `packs-manifest.json` 자동 갱신. 수동 편집 경로 제거                                                                 |
| R-9  | `storage.estimate()` 모니터링에서 Cache Storage 누락 — iOS 저장 한도 경보 부정확, 35레벨 전체 캐시 시 누락된 ~1.05 MB가 경보 임계값 계산에서 제외됨          | **Medium** | `storage.estimate()` 경보 로직을 수정하여 Cache Storage 사용량 합산. 80% 임계값 경보 대상에 Cache Storage 포함                                                                                                                   |
| R-10 | 스니펫 오류 수정 빈도가 높을 시 sha256 불일치로 인한 전 레벨 팩 재다운로드 누적 — 오프라인 학습 신뢰도 훼손                                                  | **Medium** | `lang × level` 단위 팩 분리로 수정 영향 범위 격리. semver patch = 스니펫 내용 수정, minor = 신규 추가, major = 프레임워크 major 버전 변경 채번 정책을 §13.5 결정 9항에 명시                                                      |
| R-11 | Dockerfile `RUN` 이후 인라인 Shell의 멀티라인 헤어핀·파이프·변수 확장 — 오인식 시 색 누락 (타이핑 판정 오류는 아니나 학습 경험 저하)                         | **Medium** | Dockerfile 지시어 키워드 9종만 강조하고 `RUN` 이후 인라인 Shell은 기본 텍스트 색 처리. 의도적 축소 결정을 §13 언어별 강조 범위 표에 명시                                                                                         |
| R-12 | JSON Schema 페이로드 50줄 초과 스니펫에서 라인별 regex O(n) 재계산 누적 — 타이핑 루프 성능 저하                                                              | **Medium** | 스니펫 저작 정책에서 단일 스니펫 최대 50줄 제한. Prism.js JSON grammar 어댑터 사용으로 완화                                                                                                                                      |
| R-13 | GPU 의존 스니펫(L12 vLLM·L14 LoRA·QLoRA·PEFT)의 실행 가능성 오해 — 학습자가 실행 불가 코드를 실행 가능 코드로 인식                                           | **Medium** | 스니펫 메타데이터 `runnable: false` 플래그 추가. 타이핑 화면에 실행 불가 컨텍스트 명시 표기. CI에서 import 문과 타입 구문만 lite 게이트 적용                                                                                     |
| R-14 | 불완전한 레벨 팩이 학습자에게 조기 노출 — CI 미통과 팩이 `packs-manifest.json`에 등록되어 배포됨                                                             | **Medium** | 점진적 레벨 출시: CI 통과 후에만 `packs-manifest.json`에 등록. L1~L5 선배포 후 순차 확장                                                                                                                                         |
| R-15 | Kotlin MVP 35레벨 범위 내 포함 시 Java regex 패턴 충돌 — 문자열 템플릿·코루틴·null 안전성 연산자가 Java regex와 충돌                                         | **Low**    | Kotlin을 MVP 35레벨 범위에서 제외. §4 장기 로드맵(TypeScript·Go·Rust)과 동일한 '언어 추가 기준 및 승인 프로세스'로 관리. 추가 조건: 해당 언어 팩 레벨 3개 이상 확정 + `@lezer/kotlin` grammar 존재 확인 후 결정                  |

### 13.7 버전 업그레이드·유지보수 정책

LTS·안정 GA를 기준으로 하되, 새 LTS/안정 버전이 나오면 **자동 추적 -> 검증 -> 일괄 갱신** 절차로 부채 없이 유지보수한다.

| 영역                                      | 현 기준                    | 상향 시 절차                                                                                                                                |
| ----------------------------------------- | -------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------- |
| **Node.js**                               | 24 LTS                     | 새 Active LTS GA + 1 마이너 안정화 대기 -> `.nvmrc`·`engines`·CI matrix 갱신 -> CI 통과 시 채택                                             |
| **빌드/툴체인** (Vite·TS·ESLint·Prettier) | 최신 stable pin            | Renovate 주간 PR -> CI(빌드·lint·테스트) 통과 시 머지. **major는 별도 브랜치 검증**                                                         |
| **의존성 라이브러리**                     | lock 고정                  | Renovate 그룹화 — patch/minor 자동, **major 수동 검토**                                                                                     |
| **학습팩 콘텐츠** (Java/Spring/Python)    | Java 21 · SB 3.4 · Py 3.12 | 새 LTS(예: Java 25, SB 차기 GA, Py 3.13) 출시 -> 회귀 스니펫 CI(컴파일/린트) -> 통과 시 팩 `major` bump 일괄 갱신 + `frameworkVersion` 갱신 |

- **자동화**: Renovate(또는 Dependabot)가 `package.json`·팩 `frameworkVersion` 변경 PR 자동 생성. CI 게이트(빌드·테스트·lint·라이선스·스니펫 검증) 통과가 머지 조건.
- **지원 범위**: 직전 LTS까지 N-1 호환(`engines.node >=22.12`). 그 이하는 드롭.
- **버전 단일 출처(SSOT)**: `.nvmrc` · `package.json engines` · CI `node-version` · README 버전표 · 팩 `frameworkVersion`을 동기화해 불일치를 막는다.

---

## 14. 성공 지표

| 지표                    | 목표     |
| ----------------------- | -------- |
| Spring Boot 패턴 정확도 | 95% 이상 |
| Java 타이핑 속도 향상   | 20% 이상 |
| Python AI 패턴 숙련도   | 90% 이상 |
| 주간 학습 지속률        | 70% 이상 |

## 15. 학습 엔진 (간결한 적응형 반복)

### 15.1 숙련도 점수 (Pattern Mastery Score)

**저장 스키마** — IndexedDB `patterns` 스토어

```typescript
interface PatternRecord {
  patternId: string;       // "{packId}_{snippetId}" 예: "java_l04_snip_001"
  mastery: number;         // 0–100, EWMA
  box: 1 | 2 | 3;
  lastPracticed: number;   // timestamp
  sessionCount: number;
  expectedWpm: number;     // 최초 세션 시 팩에서 읽어 저장 (팩 삭제 대비)
  globalRound: number;     // 출제 사이클 카운터 — IndexedDB 영속
  charErrorMap: Record<string, number>; // EWMA 이동평균
}
```

`patternId`는 `{packId}_{snippetId}` 조합으로 전역 고유성을 보장한다.

**점수 공식**

```
완료 세션 (val.length === TARGET.length):
  S = (정확도 × 0.6) + (속도점수 × 0.4)
  속도점수 = min(100, round(실제WPM / record.expectedWpm × 100))
  정확도   = round(correct / TARGET.length × 100)   ← 분모는 항상 TARGET.length

중단 세션 (val.length < TARGET.length):
  mastery 업데이트 건너뜀 — collectErrors()도 호출하지 않음
```

첫 세션 성적 S ≥ 80이면 `mastery` 초기값을 0 대신 **50**으로 부스트한다(콜드스타트 박스1 장기 묶임 방지).

**EWMA 갱신**

```typescript
// α = 0.3 (3–4세션 수렴)
M_new = 0.3 × S + 0.7 × M_old
```

| 범위   | 상태       | 색   |
| ------ | ---------- | ---- |
| 0–39   | Weak       | 빨강 |
| 40–69  | Learning   | 노랑 |
| 70–89  | Proficient | 파랑 |
| 90–100 | Master     | 초록 |

---

### 15.2 취약 패턴 탐지 (Weak Pattern Detection)

```typescript
// 완료 세션 종료 시에만 호출
function collectErrors(target: string, typed: string): void {
  for (let i = 0; i < typed.length; i++) {
    if (typed[i] === target[i]) continue;
    const token = extractToken(target, i) ?? target[i];
    const weight = typed[i].toLowerCase() === target[i].toLowerCase() ? 1 : 2;
    charErrorMap[token] = (charErrorMap[token] ?? 0) + weight;
  }
}

// 토큰 경계: 공백 + 코드 구분자 모두 사용
const DELIMITERS = /[ (){};,=\[\].@<>]/;
function extractToken(src: string, i: number): string | null {
  // src를 DELIMITERS로 분할한 tokenRanges 배열에서
  // i를 포함하는 범위를 이진탐색으로 찾아 반환
  // 토큰 길이 1이면 null 반환
}
```

`charErrorMap`은 EWMA 방식으로 갱신한다 (`α = 0.3`, 동일 세션 내 반복 등장은 1회 카운트).

**WeakToken 스토어** (`errorRate` 내림차순 정렬):

```typescript
interface WeakToken {
  token: string;
  errorScore: number;
  sessionsSeen: number;   // seenCount 대신 — 동일 세션 내 중복 1로 카운트
  errorRate: number;      // errorScore / sessionsSeen
}
```

임계값: `minSessionsSeen = 3`, `weakThreshold = 0.3`, `topN = 10`

---

### 15.3 반복 출제 — Leitner 3박스

| 박스  | 진급 조건             | 강등 조건             | 출제 조건       |
| ----- | --------------------- | --------------------- | --------------- |
| Box 1 | mastery ≥ 70 -> Box 2 | —                     | 매 라운드       |
| Box 2 | mastery ≥ 85 -> Box 3 | mastery < 60 -> Box 1 | round % 2 === 0 |
| Box 3 | —                     | mastery < 70 -> Box 2 | round % 5 === 0 |

Box 2 강등 기준을 50이 아닌 **60**으로 설정해 mastery 50–69 구간의 장기 체류를 방지한다.

**출제 선택 — 가중 카테고리 샘플링** (객체 복제 없음)

```typescript
// 신규 : Box1 : Box2 : Box3 = 2 : 5 : 2 : 1
function pickNextSnippet(all, records, round): Snippet {
  const candidates = buildCandidates(all, records, round);

  // pool 복제 대신: 카테고리를 가중 확률로 선택 후 해당 카테고리에서 무작위 1개
  const category = weightedPickCategory(RATIO, candidates);
  if (category) return randomFrom(candidates[category]);

  // 폴백: pool이 비어있으면 Box3 전체에서 출제(라운드 무관)
  const box3All = all.filter(s => records.get(s.id)?.box === 3);
  return randomFrom(box3All.length ? box3All : all);
}
```

`round`는 `PatternRecord.globalRound`에 영속 저장한다. ITP 만료로 IndexedDB가 소멸되면 round=0에서 재시작되는데, 이때 Box2/Box3 조건 미충족으로 발생하는 단기 공백은 허용 가능한 트레이드오프로 수용한다.

**세션 종료 훅 — 완료/중단 구분**

```typescript
// update() 내에서 완료 감지
if (val.length >= TARGET.length && correctCount === TARGET.length) {
  emitSessionEnd({ completed: true });
}

// 스킵 버튼에서
emitSessionEnd({ completed: false });

// 세션 종료 핸들러
function onSessionEnd({ completed }: { completed: boolean }): void {
  if (!completed) return; // 중단: mastery 업데이트, collectErrors 모두 건너뜀
  collectErrors(TARGET, val);
  const S = calcSessionScore();
  updateMastery(S);
  updateBox(record);
  // IndexedDB 먼저 저장 -> 완료 콜백에서 Zustand 갱신 (단방향)
  saveToIndexedDB(record).then(() => store.setState({ weakTokens, currentBox }));
}
```

**Zustand 역할**: UI 렌더링 캐시 전용. 진실의 출처는 IndexedDB.

---

### 15.4 콜드스타트

```typescript
function getStartSnippet(levelSnippets, records, currentRound): Snippet {
  if (records.size === 0) return levelSnippets[0]; // 완전 신규 -> L1 첫 번째
  return pickNextSnippet(levelSnippets, records, currentRound);
}
```

배치 테스트(선택사항): "이미 알아요" 버튼 -> 조건 `정확도 ≥ 85% AND 실제WPM ≥ expectedWpm × 0.8`이면 `mastery = 60, box = 2`, 미달이면 기본값.

`expectedWpm`은 최초 세션 시 팩에서 읽어 `PatternRecord.expectedWpm`에 저장. 팩 미존재 시 fallback `40`.

---

### 15.5 구현 체크리스트

| 단계 | 작업                                                              | 파일 위치                    |
| ---- | ----------------------------------------------------------------- | ---------------------------- |
| 1    | `PatternRecord` / `WeakToken` IndexedDB 스키마                    | `src/store/db.ts`            |
| 2    | `patternId` 헬퍼 `buildPatternId(packId, snippetId)`              | `src/store/db.ts`            |
| 3    | `collectErrors()` — DELIMITERS 기반 토큰 추출                     | `src/engine/scoring.ts`      |
| 4    | `updateMastery()` + `updateBox()`                                 | `src/engine/scoring.ts`      |
| 5    | `pickNextSnippet()` — 가중 카테고리 샘플링                        | `src/engine/scheduler.ts`    |
| 6    | 완료/중단 이벤트 분기 (`emitSessionEnd`)                          | `src/engine/typingEngine.ts` |
| 7    | Zustand `weakTokens` / `currentBox` 슬라이스 (IDB 동기화 후 갱신) | `src/store/learningStore.ts` |
| 8    | 우측 패널 실데이터 연결 (하드코딩 제거)                           | `src/ui/WeakPanel.ts`        |
| 9    | IndexedDB 만료 감지 + JSON export 배너                            | `src/storage/integrity.ts`   |
| 10   | Vitest: EWMA 수렴·박스 진급/강등·비율 샘플링·중단 세션 skip       | `src/engine/__tests__/`      |

**미결 항목**
- extractToken() 이진탐색 구현 — 현 엔진 tokenRanges 재사용 여부 확인 필요
- Box2/Box3 라운드 조건이 ITP 만료 후 round=0 재시작으로 일시 중단되는 허용 범위 확정

---

## 16. UX · 정보구조 · 사용자 흐름

### 16.1 화면 인벤토리

| ID    | 화면명                           | 진입                          | 이탈                              |
| ----- | -------------------------------- | ----------------------------- | --------------------------------- |
| S-100 | 타이핑 연습 (메인)               | 앱 진입·레벨 선택·이어서 연습 | S-110·S-200·S-300·S-500           |
| S-110 | 스니펫 완료 결과                 | S-100 완료                    | S-100(다음)·S-120(오답복습)·S-200 |
| S-120 | 오답 복습                        | S-110·사이드바 오답 반복      | S-100·S-110                       |
| S-200 | 레벨 선택 / 로드맵               | 사이드바 로드맵 아코디언·메뉴 | S-100·S-210                       |
| S-210 | 팩 다운로드 확인+진행            | S-200 미다운로드 레벨 탭      | S-200(취소)·S-100(완료)           |
| S-300 | 빠른 학습 (사이드바 인라인 패널) | 사이드바 빠른 학습 아코디언   | S-100(모드 선택 즉시)             |
| S-400 | 프로젝트 분석 — PC 전용          | 버거 메뉴                     | S-420·S-100                       |
| S-420 | 분석 결과 요약 — PC 전용         | S-400 분석 완료               | S-100·S-400                       |
| S-500 | 설정                             | 버거 메뉴                     | 이전 화면 복귀                    |

> S-300은 독립 전환 화면이 아닌 **사이드바 확장 패널**이다. 별도 URL 없음.
> S-410(분석 진행)은 S-400 인라인 진행률 + 사이드바 배지로 표시하고 독립 화면을 두지 않는다. 분석 중 타이핑 연습은 백그라운드 Worker 덕분에 S-100에서 동시에 가능하다.
> S-210은 다운로드 확인과 진행률을 단일 화면 내 인라인으로 통합한다(S-411 별도 번호 없음).

---

### 16.2 핵심 사용자 흐름

**흐름 A — 첫 진입 -> 연습 -> 결과**

```
앱 진입 -> S-100 (Spring Boot L1 자동 선택, 첫 키 입력으로 즉시 연습)
  -> [스니펫 완료] S-110 (WPM·정확도·숙련도 Δ 표시)
  -> [다음 스니펫] S-100  /  [오답 복습] S-120  /  [레벨 선택] S-200
```

**흐름 B — 오답 복습**

S-120은 오타가 발생한 **스니펫 전체**를 재출제한다(줄 단위 발췌는 MVP 제외 — 엔진 변경 불필요).
3회 반복 후 미해결 패턴 -> WeakToken 등급 격상 + S-300 취약 패턴 모드 우선 출제 대상 등록.

**흐름 C — 프로젝트 분석 (PC 전용)**

```
S-400 폴더 선택 -> 백그라운드 Worker 분석 시작
  -> 사이드바 배지 + 상단 배너에 진행률 표시 (S-100 타이핑 동시 가능)
  -> 완료 토스트 -> S-420 결과 요약 -> [바로 연습] S-100
```

폴더 선택 취소(`showDirectoryPicker` 거절): 조용히 무시.

---

### 16.3 온보딩

**원칙: 5초 안에 타이핑 시작, 강제 튜토리얼 없음.**

| 단계 | 발동 조건                       | 표시 내용                                    | 비고                                           |
| ---- | ------------------------------- | -------------------------------------------- | ---------------------------------------------- |
| 1    | IndexedDB 이력 없음             | 상단 배너 "Level 1부터 시작하세요" 1회       | `cm-onboarded` localStorage 플래그로 중복 차단 |
| 2    | 첫 키 입력 전                   | 에디터 포커스 힌트 "여기를 눌러 바로 타이핑" | 첫 키 입력 즉시 소멸                           |
| 3    | **첫 스니펫 완료 직후** (S-110) | `storage.persist()` 요청 배너                | 타이핑 중 팝업 금지                            |
| 4    | iOS 감지 + persist 미승인       | "홈 화면에 추가하면 데이터가 보호됩니다"     | persist 배너 직후 순차 표시, 동시 2개 금지     |

온보딩 질문(1문항) 제거. 학습 목표는 현재 레벨에서 자동 추론("현재 레벨: Java L1").

---

### 16.4 상태 디자인

**빈 상태**

| 조건                   | 표시                                                      |
| ---------------------- | --------------------------------------------------------- |
| 오타 패턴 없음         | "아직 오타가 없습니다. 계속 연습하면 패턴이 쌓입니다."    |
| 오답 반복 큐 비어있음  | 배지 숨김, 클릭 시 토스트                                 |
| 취약 패턴 없음 (S-300) | "모든 패턴 숙련도 70% 이상. 더 어려운 레벨에 도전하세요." |
| 첫 방문 숙련도 블록    | "첫 연습을 시작하면 숙련도가 기록됩니다."                 |

**에러 상태**

| 에러                | 처리                                                                                       |
| ------------------- | ------------------------------------------------------------------------------------------ |
| sha256 불일치       | 백그라운드 자동 재다운로드(메시지 없음). 재다운로드 전 접근 시도: "팩 업데이트 중..." 배너 |
| 팩 다운로드 실패    | 인라인 "다운로드 실패 · 네트워크를 확인하세요" + [재시도]                                  |
| IndexedDB 쓰기 실패 | 하단 토스트 + [설정 열기]                                                                  |
| 저장 공간 80% 초과  | 상단 배너 + [팩 관리]                                                                      |

**오프라인 상태**

| 상황                                  | 동작                                                                                    |
| ------------------------------------- | --------------------------------------------------------------------------------------- |
| 팩 있음                               | "오프라인 모드 · 다운로드된 팩으로 학습 가능" 배너                                      |
| 팩 없음                               | 에디터 비어있음 + "온라인에서 팩을 다운로드하세요"                                      |
| ITP 만료 감지 (IndexedDB 소멸)        | "학습 기록이 초기화되었습니다. 백업 파일이 있다면 설정 > 데이터 가져오기로 복원하세요." |
| ITP 만료 감지 (Cache Storage 팩 소멸) | "팩을 다시 받아야 합니다" + [다운로드] (별도 감지, 독립 안내)                           |

---

### 16.5 플랫폼별 차이

| 기능              | 데스크톱                    | 모바일 (iOS)                 |
| ----------------- | --------------------------- | ---------------------------- |
| 프로젝트 분석     | S-400 전체 제공             | 메뉴 항목 숨김               |
| 사이드바          | 좌측 인라인 (> 1024px)      | 오프캔버스 드로어 (≤ 1024px) |
| 우패널            | 우측 인라인                 | 오른쪽 드로어                |
| storage.persist() | 호출(자동 승인)             | 호출(PWA 설치 후 승인)       |
| XP/연속 배지 탑바 | **없음** — PRD 미정의, 제거 |                              |

드로어는 좌우 중 하나만 동시에 열린다. 사이드바 항목 선택 시 드로어 자동 닫힘 + 메인 포커스 복귀.

모바일에서 `#sidebar-nav` 스킵링크는 `@media (max-width: 1024px) { display: none }`으로 숨긴다(드로어 닫힌 상태에서 포커스만 이동하는 SC 2.4.3 위반 방지).

**미결 항목**
- S-120 오답 복습에서 스니펫 전체 재출제 외 줄 단위 발췌 필요성 — 사용자 피드백 후 결정

---

## 17. 접근성 (WCAG 2.2)

### 17.1 색각이상 — 비색상 단서

| 상태           | 색        | 비색상 단서                                                              | 스크린리더                      |
| -------------- | --------- | ------------------------------------------------------------------------ | ------------------------------- |
| 정타           | 구문강조  | 밑줄 없음                                                                | aria-live polite (1초 throttle) |
| 오타(bad)      | `--red`   | `underline wavy` + `font-weight: 700` + `text-decoration-thickness: 2px` | polite 요약                     |
| 대소문자(case) | `--gold`  | `underline dashed` + `text-decoration-thickness: 2px`                    | polite 요약                     |
| 캐럿(cur)      | `--blue`  | 2px 세로 막대 + `background: rgba(59,130,246,.18)`                       | —                               |
| 미입력(ghost)  | `--ghost` | 불투명도 0.45                                                            | —                               |

```css
.tt-render .bad {
  text-decoration: underline wavy var(--red);
  text-decoration-thickness: 2px;
  text-decoration-skip-ink: none;
  text-underline-offset: 3px;
  font-weight: 700;
}
.tt-render .case {
  text-decoration: underline dashed var(--gold);
  text-decoration-thickness: 2px;
  text-decoration-skip-ink: none;
  text-underline-offset: 3px;
}
```

범례 기호: `—` (정타), `‐‐` (대소문자), `✕` (오타) — `aria-hidden="true"`로 스크린리더 중복 방지.

---

### 17.2 명도 대비 수정 (AA 4.5:1)

```css
:root {
  --ghost:  #9BACC8;   /* 다크: 3.7:1 -> 5.1:1 */
  --syn-cm: #6B8CB5;   /* 다크: 주석 4.5:1 이상 (AA 필수 — 타이핑 대상 콘텐츠) */
}
[data-theme="light"] {
  --ghost:  #64748B;   /* 라이트: 2.5:1 -> 4.6:1 */
  --syn-cm: #607080;   /* 라이트: 4.5:1 */
  --gold:   #92580A;   /* 라이트: 4.6:1 -> 6.2:1 */
}
```

> 주석(`syn-cm`)은 타이핑 연습에서 실제 입력해야 할 콘텐츠이므로 AA Large(3:1) 예외 미적용, 일반 AA(4.5:1) 기준 적용.

`.tt-input`과 `.tt-render`의 font-size 불일치 수정: 전역 `textarea { font-size: 16px }` override가 `.tt-input`에 적용되므로 `.tt-input { font-size: 13.5px !important }`를 명시적으로 재정의하여 두 레이어의 픽셀 일치를 유지한다.

---

### 17.3 `prefers-reduced-motion`

```css
@media (prefers-reduced-motion: reduce) {
  .tt-render .cur {
    animation: none !important;
    box-shadow: inset 2px 0 0 var(--blue) !important;
    background-color: rgba(59,130,246,.18) !important;
  }
  .cursor { animation: none !important; opacity: 1 !important; }
  .sidebar, .right-panel, .overlay { transition: none !important; }
  .tt-render .bad  { text-decoration: underline solid var(--red) 2px; font-weight: 700; }
  .tt-render .case { text-decoration: underline dashed var(--gold) 2px; }
  .progress-bar-fill, .resume-fill { transition: none !important; }
  .level-card:hover:not(.locked), .btn-primary:hover { transform: none !important; }
}
```

CSS만으로 처리한다. JS `reducedMotion` 연동 코드는 Phase 3 이식 후 필요 시 추가.

reduced-motion 환경에서 `.bad`에 `font-weight: 700`을 유지하여 비색상 단서 체계가 일반 모드와 동일하게 동작한다.

---

### 17.4 키보드 · 포커스 · ARIA

**스킵링크**

```html
<a href="#tt-main" class="skip-link">타이핑 연습 영역으로 건너뛰기</a>
<!-- #sidebar-nav 링크는 모바일(≤1024px)에서 숨김 -->
```

```css
.skip-link { position: absolute; top: -100%; left: 0; z-index: 9999; }
.skip-link:focus { top: 0; }
@media (max-width: 1024px) {
  .skip-link[href="#sidebar-nav"] { display: none; }
}
```

**포커스 링** — `overflow:hidden`을 가진 `.tt-wrap`에는 `box-shadow`로 처리:

```css
:focus-visible { outline: 3px solid var(--blue); outline-offset: 2px; border-radius: 4px; }
.tt-wrap:focus-within { box-shadow: 0 0 0 3px var(--blue); }  /* outline 대신 box-shadow */
.tt-input:focus-visible { outline: none; }
[data-theme="dark"] :focus-visible { outline-color: #60A5FA; }
```

**Tab 트랩 해제 (SC 2.1.2)**

```typescript
if (e.key === 'Tab') {
  if (e.shiftKey) return; // Shift+Tab: 브라우저 기본 동작 허용
  e.preventDefault();
  // 4칸 삽입 (기존 로직)
}
if (e.key === 'Escape') {
  e.stopPropagation(); // 드롭다운 핸들러와 충돌 방지
  input.blur();        // 타이핑 영역 포커스 해제 (continueBtn 강제 이동 금지)
}
```

**aria-expanded 갱신**

```typescript
// 드롭다운
menuToggle.setAttribute('aria-expanded', open ? 'true' : 'false');
// 아코디언 — 정적 ID 사용 (Math.random() 금지)
header.setAttribute('aria-controls', 'acc-body-roadmap'); // HTML에 고정 ID
header.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
// display:none 대신 hidden 속성 사용 (일부 스크린리더 aria-controls 인식 보장)
```

**aria-live 전략**

```html
<div id="srLive" aria-live="polite" aria-atomic="false" class="sr-only"></div>
<!-- assertive 영역 제거 — 글자별 즉각 알림은 스크린리더를 실질적으로 사용 불가 상태로 만듦 -->
```

```typescript
// 1초 throttle로 정확도·WPM 요약만 전달
if (now - lastSrUpdate > 1000 && srLive) {
  const errorCount = /* bad+case span 수 */;
  srLive.textContent = `정확도 ${acc}%, WPM ${wpm}, 오류 ${errorCount}자`;
  lastSrUpdate = now;
}
// 오타 알림은 3자 연속 오타 또는 Enter(줄 완성) 시에만 polite로 전달
```

**textarea ARIA**

```html
<textarea
  aria-label="코드 따라치기 입력. Shift+Tab 또는 Escape로 영역 탈출."
  aria-describedby="tt-instructions">
</textarea>
<!-- aria-multiline 제거 — 네이티브 textarea는 암묵적 multiline textbox -->
```

---

### 17.5 `user-scalable=no` 및 터치 타깃

`user-scalable=no`는 WCAG SC 1.4.4(AA) 위반이나 iOS 10+ Safari는 이미 핀치줌을 강제 허용한다. Android에서는 타이핑 중 실수 줌 방지 필요. **P3 검토 보류** — iOS/Android 실기기 테스트 후 결정.

```css
/* .icon-btn: 34×34px -> 44×44px (SC 2.5.5 AAA — SC 2.5.8 AA 24×24px는 이미 충족) */
.icon-btn { width: 44px; height: 44px; }
/* .pack-seg-btn: 최소 높이 44px 보장 */
.pack-seg-btn { min-height: 44px; }
```

---

### 17.6 이행 우선순위

| 우선순위 | 항목                                        | WCAG         |
| :------: | ------------------------------------------- | ------------ |
|    P0    | Tab 트랩 해제 (Shift+Tab·Escape)            | SC 2.1.2 A   |
|    P0    | 라이트 테마 ghost·syn-cm 대비 상향          | SC 1.4.3 AA  |
|    P0    | `.tt-input` font-size 13.5px 명시 재정의    | 렌더 일치    |
|    P1    | 스킵링크 추가 (모바일 sidebar 링크 숨김)    | SC 2.4.1 A   |
|    P1    | `prefers-reduced-motion` CSS 블록           | SC 2.3.3 AAA |
|    P1    | `aria-expanded` 드롭다운·아코디언 (정적 ID) | SC 4.1.2 A   |
|    P2    | `aria-live` polite 1초 throttle             | SC 4.1.3 AA  |
|    P2    | 비색상 단서(밑줄 형태·굵기)                 | SC 1.4.1 A   |
|    P2    | 포커스 링 `box-shadow` (tt-wrap)            | SC 2.4.7 AA  |
|    P3    | `.icon-btn` / `.pack-seg-btn` 44px          | SC 2.5.5 AAA |
|    P3    | axe-core Playwright (Phase 3 이식 후)       | 자동화       |
|   보류   | `user-scalable=no` 제거                     | SC 1.4.4 AA  |

**미결 항목**
- `user-scalable=no` 제거 여부 — Android 타이핑 중 실수 줌 발생 시나리오 실기기 검증 후 결정
- `.tt-render`/`.tt-input` font-size 실측 픽셀 일치 확인 (13.5px vs 16px override)

---

## 18. 콘텐츠·라이선스 정책

### 18.1 라이선스 분류

본 정책은 **한국 저작권법 제28조(공표된 저작물의 인용)** 및 Apache-2.0·MIT 라이선스 자체 허락 조항에 근거한다. 미국 Fair Use 법리(30%, 50줄 수치)는 법적 근거로 인용하지 않으며, 아래 수치는 사내 운영 정책 기준이다.

| 라이선스             | 등급     | 의무사항                                                                  |
| -------------------- | -------- | ------------------------------------------------------------------------- |
| Apache-2.0           | 허용     | NOTICE 포함, 변형 명시                                                    |
| MIT / ISC            | 허용     | 저작권 고지·라이선스 본문 유지                                            |
| BSD-2/3-Clause       | 허용     | 저작권 고지, BSD-3 프로모션 금지                                          |
| CC-BY-4.0            | 허용     | 저자 귀속 표기                                                            |
| CC-BY-SA-4.0         | **배제** | ShareAlike 전파 — 팩 JSON 내 격리 구현 불가                               |
| CC0 / Unlicense      | 허용     | 의무 없음                                                                 |
| LGPL-2.1/3.0         | 조건부   | 추출·전시 목적 허용, 팩에 정적 번들링 금지                                |
| GPL-2.0/3.0          | **배제** | Copyleft 전파                                                             |
| AGPL-3.0             | **배제** | 정적 자산으로 배포 시 소스 공개 의무 불확실성 — SaaS 여부와 무관하게 배제 |
| SSPL                 | **배제** |                                                                           |
| Proprietary / 미표기 | **배제** |                                                                           |

**허용 OSS 화이트리스트** (`packages/packs/config/oss-allowlist.json`):

```json
{
  "allowedRepos": [
    { "repo": "spring-projects/spring-petclinic", "license": "Apache-2.0" },
    { "repo": "mybatis/mybatis-3",                "license": "Apache-2.0" },
    { "repo": "langchain-ai/langchain",            "license": "MIT" },
    { "repo": "tiangolo/fastapi",                  "license": "MIT" },
    { "repo": "spring-projects/spring-boot",       "license": "Apache-2.0" }
  ],
  "blockedLicenses": ["GPL-2.0", "GPL-3.0", "AGPL-3.0", "SSPL-1.0", "unlicensed"]
}
```

---

### 18.2 스니펫 source 필드 스키마

```jsonc
{
  "id": "snip_001",
  "source": {
    "repo": "mybatis/mybatis-3",
    "sha": "abc1234def5678",
    "path": "src/test/.../CreateDB.xml",
    "license": "Apache-2.0",
    "copyright": "Copyright 2009-2024 the original author or authors.",
    "modified": false,
    "extractedAt": "2025-01-15T00:00:00Z"
  }
}
```

자체 창작 스니펫: `"source": { "license": "original" }` — source 필드 생략 방식은 CI에서 MISSING으로 처리되므로 **반드시 명시**한다.

**NOTICE 파일** — SW precache에 `/notices` 포함(오프라인 접근 보장). Apache-2.0 NOTICE 법적 의무는 팩 JSON `source.copyright` 필드가 충족하며, `/notices` 페이지는 사용자 편의 UI다.

---

### 18.3 분량·변형 정책 (사내 운영 기준)

- 단일 스니펫 최대 **50줄**
- 단일 파일 추출 **30% 이하**
- 변형 시 `source.modified: true`
- 원본 저작권 고지(`source.copyright`) 제거 금지

자체 창작 비중 목표 수치(30% 이상 등)는 측정 절차 부재로 삭제한다. 자체 창작 스니펫을 늘리는 것은 운영 방향이며 KPI로 관리하지 않는다.

---

### 18.4 CI 라이선스 게이트

```yaml
# .github/workflows/pack-compliance.yml
jobs:
  license-check:
    steps:
      - run: node scripts/block-excluded-licenses.mjs   # GPL/AGPL/SSPL/unlicensed/MISSING 차단
      - run: node scripts/check-allowlist.mjs           # 화이트리스트 미등재 repo -> 경고
      - run: pnpm build:packs --notice-only             # NOTICE.md 초안 생성
      # SHA 원격 검증 제거 — 추출 스크립트가 SHA+내용을 동시 기록하는 신뢰 모델로 대체
      # license-checker(npm 의존성 스캔) 제거 — 과설계, 스니펫 컴플라이언스와 무관
```

```javascript
// scripts/block-excluded-licenses.mjs
const BLOCKED = ['GPL-2.0','GPL-2.0-only','GPL-3.0','GPL-3.0-only',
                 'AGPL-3.0','AGPL-3.0-only','SSPL-1.0'];

for (const snip of pack.snippets ?? []) {
  const lic = snip.source?.license;
  if (!snip.source)              violations.push({ ...snip, license: 'MISSING' });
  else if (!lic)                 violations.push({ ...snip, license: 'MISSING' });
  else if (BLOCKED.includes(lic)) violations.push({ ...snip, license: lic });
}
```

---

### 18.5 사용자 업로드 코드 (§6 PC 전용)

> 이 섹션은 **데스크톱(PC) 전용 기능**에만 적용된다. iOS Safari에서는 프로젝트 분석 기능 자체가 없으므로 해당 없음.

| 원칙               | 구현                                                                                                          |
| ------------------ | ------------------------------------------------------------------------------------------------------------- |
| **파일 원본 모드** | 각 파일 전체 코드를 IndexedDB에 저장 (타이핑 문제로 등록). 패턴 추출 없음.                                    |
| 미배포             | 서버 전송 없음                                                                                                |
| 시크릿 마스킹      | 엔트로피 ≥ 3.5 또는 `password·secret·token·api_key` 키워드 -> `[REDACTED]`. `.env·*.key·*.pem` 파일 분석 제외 |
| 동의 고지          | 분석 시작 전 "이 분석은 로컬에서만 실행되며 코드 원문은 전송되지 않습니다" 확인                               |

---

### 18.6 사전 검토 체크리스트

```
[ ] 1. 저장소 루트 LICENSE 파일 확인, SPDX 식별자 매핑
[ ] 2. oss-allowlist.json 등재 확인 (없으면 PR 선행)
[ ] 3. source.copyright 필드에 저작권 고지 원문 복사
[ ] 4. 분량 확인: 파일 30% 이하, 스니펫 50줄 이하
[ ] 5. 변형 시 source.modified: true 표기
[ ] 6. 자체 창작 스니펫: source.license = "original" 명시 (source 생략 금지)
[ ] 7. CI 라이선스 게이트 green 확인
[ ] 8. NOTICE.md 빌드 후 갱신 확인
```

**미결 항목**
- CodeMaster 상업·비상업 여부 PRD §1에 확정 필요 (한국 저작권법 제28조 적용 범위 영향)
- LGPL 추출 스니펫의 "정적 번들링 없음" 검증 절차 구체화

---

## 19. 게이미피케이션 · 데이터 내구성 · 테스트 계획

### 19.1 게이미피케이션

**채택 원칙:** 연습량을 정직하게 보여주는 최소 동기부여. 허구적 XP·스트릭 없음.

| 지표             | 채택         | 비고                                                                            |
| ---------------- | ------------ | ------------------------------------------------------------------------------- |
| 일별 활동 히트맵 | 채택         | "연속 N일" 표시 없음, 어떤 날에 했는가만 표시                                   |
| 완료 스니펫 수   | 채택         | `completedAt` 타임스탬프 집계                                                   |
| 패턴별 숙련도 %  | 채택         | §15와 연동                                                                      |
| XP 수치          | **제외**     | 조작 가능, 의미 없음                                                            |
| 스트릭           | **제외**     | ITP/기기분실 리셋 -> 사용자 실망 원인                                           |
| 뱃지 시스템      | **MVP 제외** | 개발자 반감 위험, 별도 UI 컴포넌트 수반 — 첫 버전 사용자 반응 확인 후 도입 결정 |

**일별 활동 저장 구조**

```typescript
interface DailyActivity {
  date: string;          // 'YYYY-MM-DD', new Date().toLocaleDateString('en-CA')
  typingMinutes: number; // 5초 idle 분할 + Page Visibility API 연동
  snippetCount: number;
  langs: string[];
}
```

```typescript
// Page Visibility 연동 — "창만 열어두기" 누적 방지
document.addEventListener('visibilitychange', () => {
  if (document.hidden) flushCurrentSegment(); // 현재 idle 타이머 즉시 flush
});
```

자정 경계 처리: idle 분할 시 날짜 변경 감지 -> 이전 날짜 레코드 저장 후 새 날짜로 전환.

---

### 19.2 데이터 내구성

**유실 시나리오 및 대응**

| 시나리오                | 대응                                                           |
| ----------------------- | -------------------------------------------------------------- |
| iOS 비-PWA 7일 ITP      | `storage.persist()` + 홈 화면 추가 유도 (§16.3 온보딩 3·4단계) |
| 기기분실·교체           | JSON export -> import                                          |
| 브라우저 캐시 수동 삭제 | 백업 리마인드 + export 권장                                    |

**ITP 만료 감지** — localStorage가 아닌 Cache Storage sentinel 활용:

```typescript
// src/storage/integrity.ts
export async function checkDataIntegrity(): Promise<void> {
  const db = await openDB();
  const sessionCount = await db.count('sessions');
  // sentinel: IndexedDB settings store의 'firstRunAt' 필드
  const firstRunAt = await db.get('settings', 'firstRunAt');

  if (firstRunAt && sessionCount === 0) {
    // IndexedDB 소멸 감지 (ITP 만료 또는 수동 삭제)
    showDataLossWarning({
      message: '학습 기록이 초기화되었습니다. 백업 파일이 있다면 설정 > 데이터 가져오기로 복원하세요.',
      action: '백업 파일 복원하기',
    });
  }
  if (!firstRunAt) {
    await db.put('settings', new Date().toISOString(), 'firstRunAt');
  }
}
```

> `lastSessionCount`를 localStorage에 저장하는 방식 불채택 — localStorage도 동일 7일 만료 정책 하에 있어 감지 루프가 자기모순이 됨.

**JSON Export / Import**

```typescript
// export — iOS Safari 대응
export async function exportBackup(): Promise<void> {
  const payload = buildPayload();
  const file = new File(
    [JSON.stringify(payload)],
    `codemaster-backup-${new Date().toLocaleDateString('en-CA')}.json`,
    { type: 'application/json' }
  );
  // iOS Safari: navigator.share 우선 시도
  if (navigator.canShare?.({ files: [file] })) {
    await navigator.share({ files: [file] });
  } else {
    // 데스크톱 fallback: anchor download
    const url = URL.createObjectURL(file);
    const a = document.createElement('a');
    a.href = url; a.download = file.name; a.click();
    URL.revokeObjectURL(url);
  }
}
```

Import는 단일 IndexedDB 트랜잭션으로 원자성 보장 (500번째 실패 시 0–499 자동 롤백):

```typescript
// 버전 호환: major 버전만 비교
if (semver.major(payload.exportVersion) !== semver.major('1.0')) {
  return { ok: false, error: '지원하지 않는 백업 버전' };
}
// 단일 트랜잭션
const tx = db.transaction(['sessions','patterns','dailyActivity'], 'readwrite');
for (const session of payload.sessions) {
  if (!(await tx.objectStore('sessions').get(session.id))) {
    await tx.objectStore('sessions').put(session); // 중복 skip
  }
}
await tx.done; // 실패 시 전체 롤백
```

Export에 프로젝트 분석 데이터를 선택적으로 포함하는 옵션 제공.

**백업 리마인드**

| 트리거   | 조건                                          | 위치             |
| -------- | --------------------------------------------- | ---------------- |
| 앱 시작  | 마지막 export 14일 초과 AND 세션 10개 이상    | 상단 배너        |
| iOS 감지 | `storage.persisted() === false`               | 온보딩 단계      |
| 용량     | `storage.estimate() > 80%` (경고 하드 임계값) | 설정 화면 인라인 |

임계값 상수: `STORAGE_WARN_THRESHOLD = 0.6` (소프트), `STORAGE_CRITICAL_THRESHOLD = 0.8` (하드 — export 권장).  
`lastExportAt`은 IndexedDB `settings` store에 저장. ITP 만료로 삭제되면 리마인드가 즉시 표시되는 것은 의도된 동작(데이터 사라짐 -> 백업 촉구).  
`lastReminderShownAt` 빈도 제한: 동일 트리거 3일 이내 재표시 금지.

---

### 19.3 테스트 계획

**커버리지 목표** — Vitest 파일 패턴별 임계값 (`vitest.config.ts coverage.thresholds`):

```typescript
thresholds: {
  'src/engine/**':          { branches: 90, functions: 90 },
  'src/engine/metrics.ts':  { branches: 100, functions: 100 },
  'src/store/achievements.ts': { branches: 100 },
  'src/backup/**':          { branches: 85 },
  'src/store/db.ts':        { branches: 85 },
}
```

전역 단일 임계값만 사용 시 핵심 모듈 60%도 통과되는 구조를 방지한다.

**Vitest 핵심 케이스**

| 영역          | 핵심 케이스                                                                                         |
| ------------- | --------------------------------------------------------------------------------------------------- |
| 타이핑 판정   | 정타·오타·대소문자·Enter 들여쓰기·Tab 4칸·IME 억제·끝 초과 입력·300줄 처리 < 16ms                   |
| WPM·정확도    | 기본 WPM(60자/60초=12WPM), duration=0->0 반환, 정확도 100%·95%, **중단 세션 mastery 업데이트 skip** |
| EWMA·박스     | 수렴 검증, 진급·강등, `mastery=50` 부스트(첫 세션 S≥80), 분모 `TARGET.length` 고정                  |
| 취약 패턴     | 오타->패턴 매핑(DELIMITERS 기반), errorRate 내림차순, minSessionsSeen 임계값, 빈 입력               |
| IndexedDB     | 저장·조회, 스키마 마이그레이션 v1->v2, 소스코드 원문 필드 포함 시 에러, 용량 80% 경고               |
| Backup        | export 구조 검증, import 병합·중복 skip, 트랜잭션 원자성, 손상 JSON, 버전 불일치, AJV 스키마 위반   |
| 히트맵        | 5초 idle 분할, `document.hidden` 가드, **자정 경계(vi.setSystemTime 활용)**                         |
| computeBadges | 세션 슬라이싱 실제 요소 수 분모(`last10.length`), 세션 0개 엣지 케이스                              |

IME 테스트(E2E-10): Playwright 자동화 제외. (1) Vitest에서 `compositionstart/end` 이벤트를 엔진에 직접 전달하여 `update()` 억제 단위 검증. (2) BrowserStack iOS 실기기 수동 체크리스트.

**Playwright E2E 시나리오**

| ID     | 설명                                                            |
| ------ | --------------------------------------------------------------- |
| E2E-01 | 기본 타이핑 완주 -> 결과 화면                                   |
| E2E-02 | 오타 발생 -> 물결 표시 -> 수정                                  |
| E2E-03 | 오프라인 타이핑 (`setOffline(true)`)                            |
| E2E-04 | 데이터 영속성 (새로고침 후 이전 세션 기록)                      |
| E2E-05 | 취약 패턴 3회 오타 -> 목록 노출                                 |
| E2E-06 | JSON export -> **AJV 스키마 전체 검증** (키 존재만 확인 불충분) |
| E2E-07 | export -> import -> 세션 수 일치 + 트랜잭션 원자성              |
| E2E-08 | 팩 온디맨드 다운로드 -> Cache Storage 저장 -> 오프라인 타이핑   |

**BrowserStack 실기기 대상:** iOS 16.7 Safari — E2E-01~E2E-07 (`ios-specific` 태그 포함). E2E-06·07의 `navigator.share` 동작 확인 필수 게이트에 포함. 비용 절감 시 E2E-06·07은 weekly schedule 분리.

**보안 회귀**

| 항목                                         | 방식                                                                     |
| -------------------------------------------- | ------------------------------------------------------------------------ |
| CSP `script-src 'self'`                      | Playwright 응답 헤더 파싱                                                |
| `X-Content-Type-Options` / `X-Frame-Options` | 응답 헤더 단언                                                           |
| innerHTML 미사용                             | ESLint `no-restricted-syntax` 빌드타임 차단 (Vitest 런타임 감지 제거)    |
| 소스코드 저장 검증                           | Vitest: `putSession()` 호출 시 IndexedDB에 파일 원본 코드 정상 저장 확인 |
| XSS `<script>alert(1)</script>` 스니펫 주입  | Playwright: DOM 실행 안 됨 (`textContent` 렌더링)                        |

**CI 구성 요약**

```yaml
jobs:
  unit:
    - run: pnpm vitest run --coverage
    # 파일별 임계값 미달 시 PR 머지 차단

  e2e:
    - run: pnpm playwright install webkit
    - run: pnpm playwright test --grep-invert "@ios-specific"

  e2e-ios:
    # BrowserStack, main 머지 후 1회 + weekly schedule
    - run: pnpm playwright test --grep "@ios-specific"

  security:
    - run: eslint --rule 'no-restricted-syntax: error' src/
    - run: pnpm playwright test src/**/*.security.spec.ts
```

**미결 항목**
- 뱃지 시스템(first-snippet 등) — MVP 이후 사용자 반응 확인 후 도입 결정
- BrowserStack 비용 예산 확정에 따라 E2E-06·07 실기기 게이트 포함 여부 결정
- `exportVersion` semver 라이브러리 채택 여부 (semver 패키지 vs 단순 major 비교 직접 구현)

---

## 부록 A. 현재 구현 현황 (프로토타입)

`index.html` (단일 HTML 프로토타입) 기준 — **Phase 3 풀스택(Vite+TS)으로 이식 예정**:

- **타이핑 트레이너** — 목표 코드 위 투명 입력 오버레이, 글자별 정/오 판정, 정타 시 **언어 구문 강조**, 오타는 **IDE식 물결 밑줄**(빨강=오타 / 황색=대소문자), 깜빡이는 세로 캐럿, 실시간 WPM·정확도·진행률
- **편집성** — 캐럿 이동(화살표·클릭)으로 이전 줄 수정, 중간 입력 **덮어쓰기** 처리, **Enter 자동 들여쓰기**, Tab 4칸
- **레이아웃** — 좌측 사이드 패널(학습팩 토글 · 로드맵 · 빠른학습 · 프로젝트, 아코디언), 우측 패널(패턴 숙련도 · 오타 패턴), 버거 메뉴 드롭다운
- **반응형** — 모바일(iPhone) 대응: 오프캔버스 드로어, 폭 고정·확대 방지, 터치 타깃 확대
- **테마** — 라이트/다크 토글(localStorage 유지), 코드 구문색 테마별 대비 확보
