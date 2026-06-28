# 위임 콘텐츠 적대적 검토 — 종합 리포트

## 요약

| 구분 | 수치 |
|---|---|
| 검토 파일 수 | 34개 |
| 총 문제 수 | **약 190건** |
| High 이슈 | **74건** |
| Medium 이슈 | **77건** |
| Low 이슈 | **39건** |
| 바로 통합 가능(pass/minor) | **7개** |
| 수정 후 통합(minor) | **7개** |
| 재작업 필요(rework) | **27개** |

> **전체 판정: 부분 통합 가능 / 대부분 재작업**
> 34개 중 27개(79%)가 rework 판정으로, 빌드·실행 깨짐 수준의 high 이슈가 광범위하게 분포한다. 바로 통합 가능한 파일은 없으며, minor 판정 7개도 코드 또는 설명 수정이 선행되어야 한다.

---

## 파일별 판정 표

| 파일 | 레벨 | 문제 수 | 판정 | High | Medium | 핵심 이슈 |
|---|---|---|---|---|---|---|
| L2-sc.ts | L2 | 20 | minor | 1 | 7 | @ConfigurationProperties 단독 사용 시 빈 등록 안 됨 |
| L3-mvc.ts | L3 | 20 | rework | 1 | 2 | ProblemDetail.forStatusAndDetail(int) 오버로드 없어 컴파일 에러 |
| L4-db.ts | L4 | 20 | rework | 4 | 4 | @Modifying에 @Transactional 누락, MyBatis XML에 lang:'java' 오기 3건 |
| L5-conc.ts | L5 | 20 | rework | 3 | 2 | InterruptedException 미처리로 Runnable 람다 컴파일 에러 2건, ForkJoin 미정의 메서드 |
| L6-net.ts | L6 | 20 | rework | 1 | 2 | LineDecoder 존재하지 않는 클래스, ClassNotFoundException 발생 |
| L7-gw.ts | L7 | 20 | rework | 3 | 6 | .uri() 누락, statuses(int) 오버로드 없어 컴파일 에러, terms 1개짜리 스니펫 다수 |
| L8-msg.ts | L8 | 20 | rework | 2 | 2 | finally ACK로 실패 메시지 영구 손실, @Header 누락 시 null 아닌 예외 발생 |
| L9-batch.ts | L9 | 20 | rework | 3 | 3 | .build().build() 이중 호출 컴파일 에러 2건, @StepScope 누락으로 BeanCreationException |
| L10-sec.ts | L10 | 20 | rework | 2 | 3 | UserDetails 미구현으로 컴파일 에러, RSA ID에 HMAC 코드 혼재 |
| L11-cache.ts | L11 | 20 | rework | 3 | 1 | StringRedisTemplate에 int 전달 런타임 에러, EhCache 타이틀에 Caffeine 코드 |
| L12-mon.ts | L12 | 20 | rework | 2 | 1 | apiKeyValid() 미정의 컴파일 에러, Boot 2.x 전용 YAML 속성 사용 |
| L13-test.ts | L13 | 20 | rework | 3 | 2 | 텍스트 블록 문법 위반 컴파일 에러, externalApi 미정의 컴파일 에러 |
| L14-arch.ts | L14 | 20 | rework | 4 | 1 | 추상 메서드 미구현 2건 컴파일 에러, Hexagonal Port 인바운드/아웃바운드 설명 역전 |
| L15-dp.ts | L15 | 20 | rework | 6 | 9 | 미정의 타입 6종 컴파일 에러, 주제 이탈 패턴 8개 |
| L16-devops.ts | L16 | 20 | rework | 5 | 1 | Dockerfile 작은따옴표 exec form 실패, service_healthy healthcheck 미정의 |
| L17-obs.ts | L17 | 20 | rework | 3 | 2 | Sentry 시그니처 없어 컴파일 에러, GCS 업로드 없는 GCS 스니펫, 중복 ID |
| L18-data.ts | L18 | 20 | rework | 3 | 5 | 자기 참조 레포지토리 구조, lang 불일치, 오타 다수 |
| L19-resil.ts | L19 | 20 | rework | 4 | 3 | Mojibake 깨진 문자, Orchestrator/Choreography 번역 전면 역전 |
| L20-rx.ts | L20 | 20 | minor | 0 | 0 | concat 오류 격리 설명 오류, 오타 다수 |
| P1-pc.ts | Python | 24 | rework | 0 | 7 | 명세 20개 초과 4개, 주제 이탈 예외처리 스니펫 5개 |
| P2-pasync.ts | Python | 20 | rework | 2 | 3 | import asyncio 전체 누락, maxsize 큐 데드락 코드 |
| P3-pdata.ts | Python | 23 | minor | 1 | 4 | 브로드캐스트 shape 사실 오류, 스니펫 23개(명세 20개 초과) |
| P4-pml.ts | Python ML | 20 | minor | 2 | 2 | XGBoost eval_set 데이터 누수 경고 역전, LightGBM dtype 불일치 |
| P5-pdl.ts | Python DL | 20 | minor | 1 | 3 | 사용하지 않는 import F, optimizer zero_grad 순서 역전 |
| P6-pllm.ts | Python | 20 | rework | 2 | 2 | 요약 pipeline max_length<min_length ValueError, 코사인 유사도 범위 오기 |
| P7-prag.ts | Python | 20 | rework | 1 | 3 | Top-K 검색이 알파벳 정렬로 구현(벡터 연산 전혀 없음) |
| P8-pagent.ts | Python | 20 | rework | 1 | 2 | call_tool NameError, '해칠 수 있어요'(harm) 의미 역전 |
| P9-pframe.ts | Python | 20 | rework | 3 | 8 | SimpleNodeParser 제거됨 ImportError, LLMChain deprecated, 깨진 문자 |
| P10-pprod.ts | Python | 20 | rework | 3 | 3 | engine/User 미정의 NameError, mlflow.log_model 잘못된 API |
| P11-pvec.ts | Python | 20 | rework | 4 | 4 | recreate_collection 제거됨 AttributeError 2건, Weaviate vector 필드 오기 |
| P12-pserve.ts | Python | 20 | rework | 3 | 3 | AsyncLLMEngine.generate sampling_params 누락 TypeError, AWQ calib_data 타입 오류 |
| P13-pprompt.ts | Python | 20 | minor | 0 | 1 | 주제 이탈 스니펫 4개(low), 함수 호출 API 구조 단순화 미명시 |
| P14-pft.ts | Python | 20 | rework | 2 | 2 | model.is_peft_model 미존재 AttributeError, mlflow.log_model 잘못된 API |
| P15-pqual.ts | Python | 20 | rework | 8 | 3 | RAGAS v0.2 필드명 전면 변경 4건, Langfuse 컨텍스트 매니저 미지원, guardrails import 경로 제거 |

---

## High 이슈 목록

### Spring 계열 (L2~L20)

| 파일 | snippetId | 문제 | 수정 방향 |
|---|---|---|---|
| L3-mvc.ts | mvc-problem-detail | `ProblemDetail.forStatusAndDetail(int, ...)` 오버로드 없음 — 컴파일 에러 | `HttpStatus.NOT_FOUND` 전달로 교체 |
| L4-db.ts | db-modifying | `@Modifying` 메서드에 `@Transactional` 누락 — `TransactionRequiredException` 발생 | `@Transactional` 추가 |
| L4-db.ts | db-resultmap | `lang: 'java'` 인데 code는 MyBatis XML | `lang: 'xml'` 로 수정 |
| L4-db.ts | db-dynamic-if | 동일 — lang/code 불일치 | `lang: 'xml'` 로 수정 |
| L4-db.ts | db-dynamic-foreach | 동일 — lang/code 불일치 | `lang: 'xml'` 로 수정 |
| L5-conc.ts | conc-blocking-queue | `queue.put()/take()` checked 예외 미처리 — Runnable 람다 컴파일 에러 | try-catch + `Thread.currentThread().interrupt()` 추가 |
| L5-conc.ts | conc-count-down-latch | `latch.await()` checked 예외 미처리 — 컴파일 에러 | 동일 처리 |
| L5-conc.ts | conc-fork-join | `final` 필드에 생성자 없음 + `sum()/half()` 미정의 메서드 — 컴파일 불가 | 생성자 추가, 헬퍼 메서드 명시 |
| L6-net.ts | net-netty-decoder | `LineDecoder` Netty에 존재하지 않음 — `ClassNotFoundException` | `LineBasedFrameDecoder(8192)` 로 교체 |
| L7-gw.ts | gw-custom-predicate | route에 `.uri()` 누락 — 기동 시 `IllegalArgumentException` | `.uri("lb://some-service")` 추가 |
| L7-gw.ts | gw-retry-filter | `statuses(int, int)` 오버로드 없음 — 컴파일 에러 | `HttpStatus.INTERNAL_SERVER_ERROR` 등 enum 전달 |
| L7-gw.ts | gw-filter-rewrite-path | terms 정규식 `/api/(.*)` vs 코드 `(?<seg>.*)` 불일치 | terms를 실제 코드 패턴으로 통일 |
| L8-msg.ts | msg-kafka-manual-ack | `finally`에서 ACK — 처리 실패해도 항상 커밋되어 메시지 영구 손실 | `ack.acknowledge()`를 try 블록 내 성공 경로로 이동 |
| L8-msg.ts | msg-kafka-listener-header | `@Header` 누락 시 null 주입한다는 설명 — 실제로는 예외 발생 | pitfall 내용 수정 |
| L9-batch.ts | batch-flow-decision | `.build().build()` 이중 호출 — `Job`에 `build()` 없어 컴파일 에러 | `.build()` 하나 제거 |
| L9-batch.ts | batch-decider | 동일 이중 호출 + `next(JobExecutionDecider)` 미지원 API | 체인 방식 수정 |
| L9-batch.ts | batch-job-parameters | `@JobScope` 없이 `#{jobParameters}` 참조 — `BeanCreationException` | `@StepScope` 추가 |
| L10-sec.ts | sec-authority-list | `UserDetails` 추상 메서드 6개 미구현 — 컴파일 에러 | 나머지 메서드 stub 추가 |
| L10-sec.ts | sec-rsa-key-jwt | ID `rsa-key-jwt`인데 코드는 HMAC — 개념 역전 오해 유발 | ID 또는 코드 방향 통일 |
| L11-cache.ts | cache-redis-ops-hash | `StringRedisTemplate`에 `int` 전달 — 런타임 `IllegalArgumentException` | `String.valueOf(qty)` 변환 |
| L11-cache.ts | cache-ehcache-config | 타이틀 EhCache인데 코드는 `CaffeineCacheManager` + Caffeine 디스크 지원 허위 설명 | EhCache 실제 코드로 재작성 또는 타이틀/concept 전면 수정 |
| L11-cache.ts | cache-ehcache-config | concept "Caffeine 디스크 확장 예시" — Caffeine은 디스크 미지원 | 서술 삭제 필수 |
| L12-mon.ts | mon-health-indicator | `apiKeyValid()` 미정의 — 컴파일 불가 | 메서드 추가 또는 의존성 주입 |
| L12-mon.ts | mon-logback-metrics | `management.metrics.binders.*` — Spring Boot 2.x 전용, 3.x 무효 | 해당 YAML 제거 또는 3.x 방식 안내 |
| L13-test.ts | test-mock-mvc-json | 텍스트 블록 `"""` 이후 같은 줄에 내용 — Java 컴파일 에러 | 일반 문자열 또는 올바른 텍스트 블록으로 교체 |
| L13-test.ts | test-disabled | `externalApi` 미선언 — 컴파일 에러 | 필드 선언 추가 |
| L13-test.ts | test-assert-all | 제목 'AssertJ assertAll' — 실제 코드는 `SoftAssertions.assertSoftly` | 제목 수정 |
| L14-arch.ts | arch-hexagonal-adapter | `findAllActive()` 미구현 — 컴파일 에러 | 메서드 구현 추가 |
| L14-arch.ts | arch-event-sourcing-replay | `apply()` 메서드가 클래스 블록 바깥 선언 — 문법 에러 | `Order` 클래스 내부로 이동 |
| L14-arch.ts | arch-package-structure | `package` 선언 2개 — 컴파일 에러 | 하나 제거, 별도 파일로 분리 |
| L14-arch.ts | arch-hexagonal-port | LoadUserPort를 '인바운드'로 설명 — 실제로는 Outbound Port | 설명 수정 |
| L16-devops.ts | devops-dockerfile-multistage | `ENTRYPOINT ['java',...]` 작은따옴표 — exec form 아님, 컨테이너 시작 실패 | 큰따옴표 JSON 배열로 수정 |
| L16-devops.ts | devops-dockerfile-args | 동일 + CMD ARG 변수 불일치 | 큰따옴표 + `${JAR_FILE}` 통일 |
| L16-devops.ts | devops-compose-spring-db | `service_healthy` 조건인데 `healthcheck` 미정의 — 영원히 대기 | db 서비스에 healthcheck 블록 추가 |
| L16-devops.ts | devops-gradle-module-deps | `project(':persistence')` — 경로 `:persistence-jpa`와 불일치, 빌드 에러 | 경로 통일 |
| L16-devops.ts | devops-k8s-configmap-secret | `stringData`에 base64 값 — 이중 인코딩으로 앱이 원문 못 받음 | 평문 사용 또는 `data:` 필드로 변경 |
| L17-obs.ts | obs-sentry-manual-capture | `captureException(Throwable, ScopeCallback)` 오버로드 없음 — 컴파일 에러 | `withScope()` 패턴으로 교체 |
| L17-obs.ts | obs-json-logging | `customFields`에 단일 따옴표 JSON — 파싱 실패 | 이중 따옴표로 수정 |
| L17-obs.ts | obs-log-backup-gcs | 제목 'GCS 업로드'인데 GCS 코드 전혀 없음 | GCS 실제 코드 또는 id/title 수정 |

### Python 계열 (P1~P15)

| 파일 | snippetId | 문제 | 수정 방향 |
|---|---|---|---|
| P2-pasync.ts | 전체 asyncio 스니펫 | `import asyncio` 전체 누락 — `NameError` | 각 스니펫 첫 줄에 추가 |
| P2-pasync.ts | pasync-queue-maxsize | 소비자 없이 가득 찬 큐 `put` — 데드락 | 소비자 추가 또는 items 수 감소 |
| P3-pdata.ts | pdata-numpy-broadcast-column | `[10,20].shape`를 `(3,)`라고 서술 — 실제 `(2,)` | 수치 수정 |
| P4-pml.ts | pml-xgboost-early-stopping | pitfall 내용이 사실과 역전 + X_test를 eval_set 사용(데이터 누수) | pitfall 교체 + X_val 분리 |
| P4-pml.ts | pml-lightgbm-categorical | X_test `astype('category')` 누락 — dtype 불일치 예측 오류 | X_test 동일 변환 추가 |
| P5-pdl.ts | pdl-activation | `import torch.nn.functional as F` 사용하지 않음 | import 제거 또는 `F.relu()` 사용 |
| P6-pllm.ts | pllm-pipeline-summarize | `max_length=15 < min_length=56` — 실행 즉시 `ValueError` | max_length 상향 및 긴 예시 텍스트로 교체 |
| P6-pllm.ts | pllm-cosine-sim | 코사인 유사도 범위를 '0~1'로 오기 — 실제 -1~1 | concept/terms 수정 |
| P7-prag.ts | prag-retriever-topk | `Store.search`가 벡터 연산 없이 알파벳 정렬만 수행 — Top-K 완전 오구현 | 내적(dot product) 기반 유사도 검색으로 교체 |
| P8-pagent.ts | pagent-react-loop | `call_tool()` 미정의 — `NameError` | 인라인 정의 또는 직접 호출로 교체 |
| P8-pagent.ts | pagent-plan-decompose | '하나씩 해칠 수 있어요' — '해치다'(harm)로 의미 역전 | '해낼 수 있어요'로 수정 |
| P9-pframe.ts | pframe-llamaindex-nodes | `SimpleNodeParser` 0.10에서 제거됨 — `ImportError` | `SentenceSplitter`로 교체 |
| P9-pframe.ts | pframe-chain-basic | `LLMChain` deprecated + `llm` 미정의 `NameError` | LCEL `prompt \| llm \| StrOutputParser()` 로 교체 |
| P9-pframe.ts | pframe-dspy-module | `explain.why`에 U+FFFD 대체 문자(깨진 바이트) | 원문 복원 |
| P10-pprod.ts | pprod-sqlalchemy-session | `engine`/`User` 미정의 — `NameError` + `bind=` deprecated | 정의 추가 + `sessionmaker(engine)` 수정 |
| P10-pprod.ts | pprod-sqlalchemy-query | `session`/`User` 미정의 — `NameError` | 정의 추가 |
| P10-pprod.ts | pprod-ruff-lint | `def f(x)` 를 ruff가 지적한다는 허위 설명(E741 대상 아님) | 실제 E741 대상 예시로 교체 |
| P11-pvec.ts | pvec-qdrant-upsert | `recreate_collection()` 1.9+ 제거됨 — `AttributeError` | `create_collection()` + `VectorParams`로 교체 |
| P11-pvec.ts | pvec-qdrant-filter | 동일 | 동일 |
| P11-pvec.ts | pvec-weaviate | `vector`를 properties dict 안에 삽입 — 임베딩 저장 안 됨 | 별도 `vector=` 키워드 인자로 전달 |
| P11-pvec.ts | pvec-chroma | `chromadb.Client()` 0.5+ 제거됨 — `AttributeError` | `EphemeralClient()`로 교체 |
| P12-pserve.ts | pserve-vllm-async | `sampling_params` 누락 — `TypeError` | `SamplingParams` 두 번째 인자 추가 |
| P12-pserve.ts | pserve-awq-config | `calib_data`에 파일명 문자열 전달 — 타입 오류 | `List[str]` 문장 목록으로 교체 |
| P12-pserve.ts | pserve-kvcache-enable | `model.dummy_input_ids` 존재하지 않는 속성 — 무의미 코드 | 해당 줄 삭제, 실질 예시로 교체 |
| P15-pqual.ts | pqual-ragas-faithfulness | RAGAS v0.2 필드명 변경 — `ValidationError` | `user_input`, `response`, `retrieved_contexts`로 수정 |
| P15-pqual.ts | pqual-ragas-context-precision | 동일 | 동일 |
| P15-pqual.ts | pqual-ragas-answer-relevancy | 동일 | 동일 |
| P15-pqual.ts | pqual-ragas-evaluate-multi | 동일 | 동일 |
| P15-pqual.ts | pqual-llmeval-pairwise | `evaluate_pairs()` 미존재 — `AttributeError` | `evaluate_string_pairs()`로 수정 |
| P15-pqual.ts | pqual-langfuse-span | `StatefulSpanClient`에 `__enter__` 없음 — `with` 사용 불가 | `span.end()` 명시 방식으로 교체 |
| P15-pqual.ts | pqual-guardrails-validators | `guardrails.validators` import 경로 제거됨 — `ImportError` | guardrails-hub 방식으로 교체 |
| P15-pqual.ts | pqual-pii-presidio | Presidio 기본 엔진 한국어 미지원 — 에러 또는 빈 결과 | `language='en'` 변경 또는 한국어 엔진 설정 추가 |

---

## 유형별 패턴

### 1. 존재하지 않는 API·메서드 참조 (high, 전 파일 반복)

가장 빈번한 유형. `LineDecoder`, `statuses(int)`, `evaluate_pairs()`, `model.is_peft_model`, `mlflow.log_model(model, path)`, `chromadb.Client()`, `recreate_collection()` 등 라이브러리에 없는 클래스·메서드를 코드에 직접 호출한다. 컴파일 또는 런타임에서 즉시 실패하며 학습자가 따라 치면 에러만 마주친다.

**근본 원인 추정:** AI 생성 코드가 실제 API 문서 대신 패턴 추론으로 메서드명을 만들어낸 것으로 보인다.

### 2. 버전 구식화 (high/medium, Python 팩 집중)

P9~P15에서 LangChain·RAGAS·guardrails·qdrant_client·autoawq·PEFT 등 빠르게 변하는 라이브러리의 deprecated·제거된 API를 기준 없이 혼용한다. RAGAS v0.2 필드명 변경(4개 스니펫 동시 실패)처럼 단일 라이브러리 업데이트가 여러 스니펫을 동시에 무력화한다.

**공통 패턴:** import 경로 변경(`langchain.schema.runnable` → `langchain_core.runnables`), 메서드명 변경(`from_pydantic` → `for_pydantic`), 클래스 제거(`LLMChain`, `ConversationBufferMemory`, `SimpleNodeParser`).

### 3. checked 예외 미처리 (high, L5)

Java Runnable 람다 안에서 `InterruptedException`을 던지는 코드가 여러 스니펫에 반복된다. Java 기초 제약(Runnable.run()은 checked 예외 불가)을 코드 생성 시 고려하지 않은 패턴이다.

### 4. 필수 어노테이션 누락 (high, L4·L9·L10)

`@Transactional`, `@StepScope`, `@Component` 등 Spring 동작에 필수인 어노테이션이 빠져 있다. 코드 구조는 맞지만 실행하면 런타임 예외가 발생한다. pitfall에서 필요성을 언급하면서도 코드 자체는 그 상태를 방치한 모순이 다수 발견된다.

### 5. 개념·설명 역전 (high/medium, 다수 파일)

- L19: Orchestrator와 Choreography 번역이 서로 뒤바뀜
- L14: Outbound Port를 '인바운드'로 설명
- L8: `@Header` 없으면 null이 아닌 예외 발생
- L11: Caffeine 디스크 지원 허위 서술
- P4: XGBoost 조기 종료 pitfall이 사실과 정반대
- P7: Top-K 벡터 검색이 알파벳 정렬로 구현

입문자에게 잘못된 개념을 심는 가장 위험한 유형이다.

### 6. 주제 이탈 스니펫 (medium, L2·L15·P1·P13 집중)

팩 선언 주제 목록에 없는 스니펫이 각 팩에 2~8개씩 섞여 있다. L15-dp.ts가 가장 심각하여 10개 선언 패턴 외에 State·Command·CoR·Composite·Flyweight·Iterator·Mediator·Memento·Visitor 9개 추가 패턴이 무선언으로 포함됐다.

### 7. 오타·한글 문장 파손 (low, P 계열 전반)

'해칠'(해내야 할), '병럴'(병렬), '꼬꼬되는'(꼬이는), '바꿔니다'(바꿉니다), '토그'(토글), '시동호'(진입점) 등 비표준 표현이 P 계열 전체에 산재한다. 단독으로는 low이지만 밀도가 높아 콘텐츠 품질 전반을 낮춘다.

### 8. 스키마 미달 (medium, L7 집중)

L7-gw.ts에서 `terms` 배열이 1개짜리 스니펫이 6개 연속 등장한다. 검증 기준(2개 이상)을 반복적으로 위반하며 일괄 수정이 필요하다.

---

## 권고

### 바로 통합 가능한 파일 — 없음

minor 판정 파일도 모두 최소 1건 이상의 코드 또는 설명 수정이 필요하므로 즉시 통합은 불가하다.

### 수정 후 통합 가능 (minor 7개)

다음 파일은 high 이슈가 0~2건으로 수정 범위가 좁다. 지정 수정 후 통합한다.

| 파일 | 필수 수정 사항 |
|---|---|
| L2-sc.ts | `@Component` 추가(sc-configprops), 주제 이탈 스니펫 정리 |
| L20-rx.ts | pitfall 2건(concat 오류 격리, retrieve/bodyToMono) 수정, 오타 정리 |
| P3-pdata.ts | shape 오기(3→2) 수정, 스니펫 수 23→20 조정 |
| P4-pml.ts | XGBoost pitfall 역전 수정, LightGBM X_test dtype 통일 |
| P5-pdl.ts | 미사용 import 제거 또는 활용, optimizer 순서 수정 |
| P13-pprompt.ts | 주제 이탈 스니펫 정리, API 구조 단순화 명시 |
| P14-pft.ts (부분) | `model.is_peft_model` → `isinstance` 수정, `mlflow.pytorch.log_model` 수정 |

### 재작업 필요 (rework 27개)

다음 기준으로 우선순위를 나눈다.

**즉시 재작업 (high 이슈 3건 이상):**
L4, L5, L7, L9, L11, L14, L15, L16, P2, P9, P11, P15

특히 **L15-dp.ts**는 6건 컴파일 에러 + 8개 주제 이탈로 사실상 전면 재작성이 효율적이다. **P15-pqual.ts**는 RAGAS 4건 + guardrails 2건 + Langfuse 1건으로 라이브러리 버전 기준을 먼저 확정해야 작업이 가능하다.

### 다음 액션

1. **버전 기준표 확정 (1순위):** P 계열 라이브러리(LangChain, RAGAS, guardrails, qdrant_client, llama_index)의 대상 버전을 문서로 고정한다. 버전 미확정 상태에서 재작업하면 동일 문제가 반복된다.

2. **컴파일 에러 일괄 수정 (2순위):** high 이슈 중 코드 실행 불가 항목을 파일별로 일괄 수정한다. Java 계열은 `@Transactional`/`@StepScope`/생성자/메서드 누락 패턴이 반복되므로 체크리스트화하여 처리한다.

3. **개념 역전 검토 (3순위):** L14 Port 방향, L19 Saga 번역, L11 Caffeine 설명, P4 XGBoost pitfall처럼 사실과 역전된 설명은 별도 내용 전문가 검수를 받는다.

4. **주제 이탈 정리 (4순위):** 각 팩의 선언 주제 목록을 기준으로 이탈 스니펫을 삭제하거나, 팩 정의 자체를 확장하는 방향을 결정한다. L15처럼 이탈 비율이 높은 파일은 팩 재설계를 고려한다.

5. **오타 일괄 처리 (5순위):** P 계열의 한글 오타는 파일별 grep 검수로 일괄 수정한다. 깨진 문자(U+FFFD, Mojibake)는 에디터 인코딩 문제이므로 파일 저장 방식도 확인한다.

---

## 부록 — 파일별 전체 이슈 (원본)

### D:\_Git_PWA\CodeMaster\src\content\packs\_staging\L2-sc.ts (minor, 20개)
- [high/code] sc-configprops: @ConfigurationProperties(prefix = "mail") 어노테이션만 있고 @Component가 없어 빈으로 등록되지 않는 코드다. Spring Boot 3.x에서는 @Component, @EnableConfigurationProperties(MailProperties.class), 또는 @ConfigurationPropertiesScan 중 하나가 없으면 바인딩이 전혀 발생하지 않는다. pitfall에서 언급만 할 뿐 코드 자체가 단독으로는 동작하지 않는다.  →  수정: 클래스에 @Component를 추가하거나, @Bean + @EnableConfigurationProperties(MailProperties.class) 등록 방식을 코드에 포함해 완전한 동작 예시로 수정하라.
- [medium/topic] sc-controller: 팩 주제는 'DI·@Bean·@Configuration·@Profile·AOP·@Qualifier'인데 @Controller·@GetMapping은 Spring MVC 계층이며 선언된 주제 범위에 없다.  →  수정: @Controller 스니펫을 제거하거나, 팩 주제에 MVC를 명시적으로 추가하라.
- [medium/topic] sc-event-listener: @EventListener는 Spring 이벤트 발행·구독 메커니즘으로 선언된 주제(DI·@Bean·@Configuration·@Profile·AOP·@Qualifier) 어느 것에도 해당하지 않는다.  →  수정: 스니펫을 제거하거나 팩 주제에 '이벤트' 항목을 추가하라.
- [medium/topic] sc-lazy: @Lazy(지연 초기화)는 빈 생명주기 옵션으로, 선언된 주제 목록에 없다.  →  수정: 스니펫을 제거하거나 팩 주제에 '빈 생명주기/@Scope/@Lazy' 항목을 추가하라.
- [medium/topic] sc-scope-prototype: @Scope("prototype")은 빈 스코프 관리로 선언된 주제에 없다.  →  수정: 스니펫을 제거하거나 팩 주제에 '@Scope' 항목을 추가하라.
- [medium/topic] sc-dependson: @DependsOn은 빈 초기화 순서 제어로 선언된 주제에 없다. 또한 terms의 '@DependsOn' d 설명 '특정 빈보다 나중에 생성'은 어노테이션이 붙은 빈(cacheLoader)의 결과를 서술한 것으로, 입문자에게 '지정한 빈이 먼저 만들어지도록 보장'이라는 의도를 역방향으로 전달해 오해를 유발한다.  →  수정: 주제 외 스니펫이면 제거. 유지 시 term d를 '지정된 빈(cacheManager)이 이 빈보다 먼저 생성되도록 순서를 강제'로 수정하라.
- [medium/topic] sc-conditional: @Conditional은 조건부 빈 등록으로 선언된 주제 범위에 없다.  →  수정: 스니펫을 제거하거나 팩 주제에 '@Conditional' 항목을 추가하라.
- [medium/topic] sc-value: @Value는 프로퍼티 값 주입으로 선언된 주제 목록에 없다. sc-configprops와 유사한 영역이어서 범위 확장이 일관성 없이 산발적이다.  →  수정: 스니펫을 제거하거나 팩 주제에 '@Value/@ConfigurationProperties' 항목을 추가하라.
- [medium/topic] sc-configprops: @ConfigurationProperties는 선언된 주제 목록(DI·@Bean·@Configuration·@Profile·AOP·@Qualifier)에 없다.  →  수정: 팩 주제에 명시적으로 추가하거나 스니펫을 제거하라.
- [low/schema] sc-primary: file 필드가 'DataSourceConfig.java'로 sc-configuration 스니펫과 중복된다. 두 스니펫 모두 file='DataSourceConfig.java'를 사용해 학습 UI에서 충돌하거나 혼동을 줄 수 있다.  →  수정: sc-primary의 file을 'DataSourceConfig2.java' 또는 'PrimaryDataSourceConfig.java'로 변경하라.
- [low/explain] sc-autowired-field: terms가 @Autowired와 private 두 개뿐이다. 최소 2개 기준은 충족하나 @Autowired 필드 주입의 핵심 리스크(final 불가, 테스트 어려움, 순환 참조 런타임 탐지)를 설명하는 term이 없어 pitfall 내용과 용어 설명 사이에 단절이 있다.  →  수정: terms에 'UnsatisfiedDependencyException' 또는 '필드 주입의 단점' 관련 항목을 1개 추가하라.

### D:\_Git_PWA\CodeMaster\src\content\packs\_staging\L3-mvc.ts (rework, 20개)
- [high/code] mvc-problem-detail: ProblemDetail.forStatusAndDetail(404, e.getMessage()) — Spring Framework 6의 실제 시그니처는 forStatusAndDetail(HttpStatusCode status, String detail)이며 int를 받는 오버로드가 없다. int 리터럴 404를 넘기면 컴파일 에러 발생.  →  수정: ProblemDetail.forStatusAndDetail(HttpStatus.NOT_FOUND, e.getMessage()) 또는 ProblemDetail.forStatusAndDetail(HttpStatusCode.valueOf(404), e.getMessage())로 수정.
- [medium/topic] mvc-feign-client: @FeignClient는 spring-cloud-openfeign(Spring Cloud) 컴포넌트로, 선언된 주제(@RestController·매핑·@Valid·@ExceptionHandler·ProblemDetail·ResponseEntity)와 무관한 외부 API 호출 클라이언트 패턴이다. Spring Boot 3.x 기본 의존성에 포함되지 않으며 별도 Spring Cloud BOM이 필요하다.  →  수정: WebClient나 RestClient(Spring Boot 3.2+)를 이용한 외부 호출 예제로 교체하거나, 해당 스니펫을 Spring Cloud 전용 팩으로 이동.
- [medium/topic] mvc-openapi-schema: @Schema는 springdoc-openapi 라이브러리(io.swagger.v3.oas.annotations.media.Schema) 어노테이션으로, Spring Boot MVC 핵심 주제 범위(@RestController·매핑·@Valid·@ExceptionHandler·ProblemDetail·ResponseEntity)에 해당하지 않는다. 별도 라이브러리 의존성이 필요하다.  →  수정: OpenAPI/Swagger 전용 팩으로 이동하거나, 같은 record DTO에 @NotBlank/@Min 등 Bean Validation 어노테이션을 결합한 @Valid 심화 예제로 대체.

### D:\_Git_PWA\CodeMaster\src\content\packs\_staging\L4-db.ts (rework, 20개)
- [high/code] db-modifying: @Modifying 쿼리 메서드에 @Transactional이 없다. Spring Data JPA는 @Modifying이 붙은 메서드를 트랜잭션 없이 호출하면 런타임에 TransactionRequiredException을 던진다. 코드가 실행 불가 상태다.  →  수정: 메서드에 @Transactional을 추가하라: @Modifying @Transactional @Query(...) int raiseAllPrices();
- [high/schema] db-resultmap: lang이 'java'인데 code는 MyBatis XML이다. file도 UserMapper.xml로 선언돼 있어 lang 값과 명백히 불일치한다. lang: 'xml'이어야 한다.  →  수정: lang: 'java' → lang: 'xml' 로 수정하라.
- [high/schema] db-dynamic-if: lang이 'java'인데 code는 MyBatis XML이다. file도 UserMapper.xml로 선언돼 있어 lang 값과 명백히 불일치한다.  →  수정: lang: 'java' → lang: 'xml' 로 수정하라.
- [high/schema] db-dynamic-foreach: lang이 'java'인데 code는 MyBatis XML이다. file도 UserMapper.xml로 선언돼 있어 lang 값과 명백히 불일치한다.  →  수정: lang: 'java' → lang: 'xml' 로 수정하라.
- [medium/explain] db-mapper: why가 'SQL을 자바 코드와 깔끔하게 분리하려고요'인데 이 스니펫은 @Select 어노테이션으로 SQL을 자바 코드에 인라인으로 박아 넣는 패턴이다. SQL 분리는 XML 매퍼 방식의 장점이고 어노테이션 방식은 오히려 반대다. 설명이 코드와 정반대 방향이다.  →  수정: why를 '간단한 SQL을 별도 XML 파일 없이 인터페이스에서 바로 실행하려고요' 등으로 수정하라.
- [medium/code] db-spec-where: default 메서드 내에서 nameContains(name)·ageOver(age)·where(...)를 static import 없이 호출하고 있다. 인터페이스 파일에 'import static ... UserSpecs.*'와 'import static org.springframework.data.jpa.domain.Specification.where'가 없으면 컴파일 오류가 난다. 스니펫이 독립 실행 가능하지 않은 불완전한 코드다.  →  수정: 코드 상단에 필요한 static import 두 줄을 추가하거나, 호출을 UserSpecs.nameContains(name) 형태로 명시적으로 바꿔라.
- [medium/explain] db-spec-where: pitfall이 'null 조건은 무시되지 않아 미리 걸러야 해요'인데 사실과 다르다. Spring Data JPA의 Specification.where(null)은 no-op(항상 true)으로 처리되고, and(null)/or(null)도 상대 스펙 그대로 반환된다. 실제 문제는 파라미터 자체가 null일 때 nameContains 내부 cb.like에 null이 들어가는 경우로, 설명이 부정확하다.  →  수정: pitfall을 '조건 메서드 내부에서 keyword가 null이면 cb.like에 null이 전달돼 오류가 나요. Specification 조합 전에 null 여부를 확인하거나 메서드 안에서 null이면 cb.conjunction()을 반환하도록 처리하세요'로 수정하라.
- [medium/duplicate] db-fetch-lazy: db-many-to-one(id 4번)과 db-fetch-lazy(id 6번)가 @ManyToOne(fetch = FetchType.LAZY) 패턴을 사실상 동일하게 보여준다. db-many-to-one도 이미 LAZY를 핵심으로 쓰고 있어 db-fetch-lazy는 독립 가치가 낮다.  →  수정: db-fetch-lazy를 @OneToMany LAZY나 LazyInitializationException 해결 예제 등 차별화된 내용으로 교체하거나 제거하라.
- [low/topic] db-query-by-example: QueryByExample은 선언된 주제(JPQL·@Query·연관관계·@Transactional·Specification·MyBatis) 어디에도 속하지 않는다. Specification 확장 주제로 볼 수도 있으나 별개 API다.  →  수정: 팩 주제와 맞지 않으면 제거하고 Specification 예제(예: or 조합, 복합 조건)나 @NamedQuery 등으로 교체하라.
- [low/explain] db-modifying: pitfall에서 'clearAutomatically을 같이 써야'라고 하는데, @Modifying의 속성명은 clearAutomatically(boolean)이 맞다. 그러나 pitfall 설명이 'clearAutomatically'가 무엇인지 설명 없이 언급해 입문자에게 불충분하다.  →  수정: @Modifying(clearAutomatically = true)로 구체적인 코드 예시를 포함해 설명하라.

### D:\_Git_PWA\CodeMaster\src\content\packs\_staging\L5-conc.ts (rework, 20개)
- [high/code] conc-blocking-queue: queue.put()와 queue.take() 모두 checked InterruptedException을 던지지만, Runnable.run()은 checked 예외를 선언하지 않아 람다 본문에서 전파할 수 없다. 'new Thread(() -> queue.put("작업")).start()'와 'new Thread(() -> queue.take()).start()' 모두 컴파일 에러 발생.  →  수정: 각 람다 본문을 try { queue.put("작업"); } catch (InterruptedException e) { Thread.currentThread().interrupt(); } 로 감싸야 한다.
- [high/code] conc-count-down-latch: latch.await()가 checked InterruptedException을 던지는데 Runnable 람다 안에서 처리하지 않아 컴파일 에러. Runnable.run()은 checked 예외를 선언하지 않는다.  →  수정: 람다 안에서 try { latch.await(); } catch (InterruptedException e) { Thread.currentThread().interrupt(); } 로 감싸야 한다.
- [high/code] conc-fork-join: 'private final long[] arr' 필드가 final로 선언됐지만 생성자가 없어 컴파일 불가. 또한 sum(arr), half(arr, 0), half(arr, 1)은 Java 표준 API에 존재하지 않는 미정의 메서드이며 스니펫에 선언도 없다.  →  수정: 생성자 'SumTask(long[] arr) { this.arr = arr; }' 를 추가하고, sum/half는 헬퍼 메서드임을 주석으로 표시하거나 인라인 구현을 보여줘야 한다.
- [medium/explain] conc-callable-future: why가 "작업 결과를 받을 때까지 기다리며 다른 일을 하려고요"라고 하지만 future.get()은 블로킹 호출이므로 get()이 대기하는 동안 다른 일을 할 수 없다. 개념 설명이 Future의 사용 의도를 역설적으로 서술하고 있다.  →  수정: "작업을 미리 제출(submit)해 두고, 결과가 필요한 시점에 get()으로 받으려고요. 제출 이후 get() 호출 전까지 다른 일을 할 수 있어요."
- [medium/explain] conc-blocking-queue: pitfall이 "크기를 정하지 않으면 put이 무한 대기할 수 있어요"라고 하지만, ArrayBlockingQueue는 생성자에 반드시 용량을 지정해야 하므로 크기를 정하지 않고 생성하는 것 자체가 불가능하다. 이 경고는 LinkedBlockingQueue(무한 용량) 사용 시에 해당하는 내용이다.  →  수정: "생산자가 소비자보다 훨씬 빠르면 큐가 꽉 차 put이 블로킹돼요. 소비자 스레드가 종료되면 생산자가 영원히 대기할 수 있어요."
- [low/code] conc-blocking-queue: 'new Thread(() -> queue.take()).start()'에서 take()의 반환값을 사용하지 않아 소비자가 실제로 아무것도 하지 않는다. 입문자에게 생산-소비 패턴을 설명하는 예제로 불완전하다.  →  수정: 람다 안에서 String item = queue.take(); System.out.println(item); 처럼 결과를 실제로 사용해야 한다.

### D:\_Git_PWA\CodeMaster\src\content\packs\_staging\L6-net.ts (rework, 20개)
- [high/code] net-netty-decoder: LineDecoder는 Netty(4.x)에 존재하지 않는 클래스다. Netty가 실제로 제공하는 줄 분리 디코더는 io.netty.handler.codec.LineBasedFrameDecoder이며, 그 다음 단계에서 String으로 변환하려면 StringDecoder를 추가로 파이프라인에 등록해야 한다. 현재 코드는 ClassNotFoundException으로 런타임 즉시 실패한다.  →  수정: LineDecoder()를 new LineBasedFrameDecoder(8192)로 교체하고, 필요하다면 뒤에 new StringDecoder()를 addLast로 추가한다.
- [medium/code] net-nio-filechannel: 출력 파일을 열 때 StandardOpenOption.CREATE와 WRITE만 지정하고 TRUNCATE_EXISTING을 누락했다. b.txt가 이미 존재하고 a.txt보다 클 경우 transferTo 범위 이후의 기존 바이트가 그대로 남아 불완전한 복사본이 된다. 입문자에게 파일 복사 코드로 제시하기에 잘못된 동작이다.  →  수정: StandardOpenOption에 TRUNCATE_EXISTING을 추가한다: FileChannel.open(Path.of("b.txt"), StandardOpenOption.CREATE, StandardOpenOption.WRITE, StandardOpenOption.TRUNCATE_EXISTING)
- [medium/schema] net-socket-send-urgent: id가 'net-socket-send-urgent'로 긴급 데이터(OOB / sendUrgentData)를 암시하지만, 실제 제목은 '소켓 연결 상태 검사'이고 코드도 isClosed(), isConnected(), setKeepAlive(), write(1)로 헬스체크를 다룬다. id와 콘텐츠 간 명백한 불일치로, 원래 긴급 데이터 스니펫이었다가 내용만 교체되고 id가 갱신되지 않은 것으로 보인다.  →  수정: id를 'net-socket-health-check' 등 내용에 맞는 이름으로 변경하거나, 반대로 Socket.sendUrgentData() 예제로 코드를 교체한다.
- [low/explain] net-socket-send-urgent: terms 항목 setKeepAlive 설명에 '운영체체가'라는 오타가 있다. '운영체제가'가 올바른 표기다.  →  수정: '운영체체' → '운영체제'로 수정한다.
- [low/code] net-netty-serverbootstrap: .group(new NioEventLoopGroup())으로 단일 EventLoopGroup을 acceptor와 worker 양쪽에 동시 지정하고 있다. Netty 공식 예제와 권장 패턴은 .group(bossGroup, workerGroup)처럼 두 개의 그룹을 분리해 사용한다. 동작은 하지만 입문자에게 비표준 패턴을 가르치게 된다.  →  수정: NioEventLoopGroup bossGroup = new NioEventLoopGroup(1), workerGroup = new NioEventLoopGroup()을 따로 생성하고 .group(bossGroup, workerGroup)으로 설정한다. shutdown 처리도 함께 보여주면 좋다.

### D:\_Git_PWA\CodeMaster\src\content\packs\_staging\L7-gw.ts (rework, 20개)
- [high/code] gw-custom-predicate: .uri() 호출이 없다. Spring Cloud Gateway는 모든 route에 URI가 필수이며, 없으면 애플리케이션 기동 시 IllegalArgumentException(uri is required)을 던진다. route 람다가 predicate(...)에서 끝나 URI 목적지가 전혀 없다.  →  수정: .and().predicate(exchange -> { ... }) 뒤에 .uri("lb://some-service") 를 추가해야 한다.
- [high/code] gw-retry-filter: .statuses(500, 502) 는 컴파일 불가. RetryGatewayFilterFactory.RetryConfig의 statuses() 메서드 시그니처는 statuses(HttpStatus... statuses) 이며 int 오버로드가 없다. 500, 502 는 int 리터럴이므로 컴파일러가 HttpStatus[]로 변환할 수 없다.  →  수정: .statuses(HttpStatus.INTERNAL_SERVER_ERROR, HttpStatus.BAD_GATEWAY) 로 교체해야 한다. import org.springframework.http.HttpStatus 추가 필요.
- [high/explain] gw-filter-rewrite-path: terms에서 정규식을 /api/(.*)로 설명하지만, 실제 코드에는 이름 있는 그룹 /api/(?<seg>.*)가 사용된다. 또한 '/$1'는 인덱스 역참조이므로 이름 그룹 치환이 아님에도 terms에서 이름 그룹(seg)에 대한 설명이 없어 코드와 설명이 불일치한다. 입문자가 코드와 설명을 비교하면 혼란을 겪는다.  →  수정: terms의 정규식 설명을 /api/(?<seg>.*) 로 수정하고, seg 이름 그룹에 대한 설명을 추가하라. 또는 코드를 /api/(.*)와 $\\{seg\\} 대신 $1 방식으로 통일하라.
- [medium/schema] gw-filter-prefix-path: terms 배열에 항목이 1개뿐이다. 검증 기준(입문자용)은 terms 2개 이상을 요구한다.  →  수정: prefixPath가 동작하는 방식(경로를 어떻게 합치는지)이나 관련 개념(GatewayFilter 체인 등)을 설명하는 term을 1개 이상 추가하라.
- [medium/schema] gw-filter-stripprefix: terms 배열에 항목이 1개뿐이다. terms 2개 이상 기준 미달.  →  수정: 경로 세그먼트 개수 계산 방법 또는 filters(f -> ...) term을 추가하라.
- [medium/schema] gw-direct-uri: terms 배열에 항목이 1개뿐이다. terms 2개 이상 기준 미달.  →  수정: lb:// 방식과 https:// 직접 URI의 차이, 또는 path() 술어 term을 추가하라.
- [medium/schema] gw-between-predicate: terms 배열에 항목이 1개뿐이다. terms 2개 이상 기준 미달.  →  수정: ZonedDateTime, parse() 사용법 또는 and() 조합 term을 1개 이상 추가하라.
- [medium/schema] gw-header-predicate: terms 배열에 항목이 1개뿐이다. terms 2개 이상 기준 미달.  →  수정: and().path(...) 조합 또는 정규식 값 매칭 방식에 대한 term을 추가하라.
- [medium/schema] gw-remoteaddr-predicate: terms 배열에 항목이 1개뿐이다. terms 2개 이상 기준 미달.  →  수정: CIDR 표기(/8 등) 또는 and().path() 조합 term을 추가하라.
- [medium/explain] gw-route-multi: terms가 2개이나 두 항목 모두 lb:// 관련 설명으로 사실상 중복이다. lb://user-service 와 lb:// 를 별개 항목으로 쪼갰지만, 두 번째 항목은 첫 번째의 부분집합 설명이라 새로운 정보가 없다.  →  수정: .route("user", ...) 메서드 체이닝 구조 또는 .build() 의 역할 같은 독립적인 term으로 대체하라.
- [low/explain] gw-loadbalancer: terms의 두 번째 항목 설명에 오타: '프토토콜' → '프로토콜'.  →  수정: 'lb:// 로드밸런싱 프로토콜 표시'로 수정하라.
- [low/explain] gw-global-filter-ordered: pitfall에 오타: '기본값이 들가' → '기본값이 들어가'.  →  수정: '순서를 안 정하면 기본값이 들어가 예측이 안 돼요.'로 수정하라.

### D:\_Git_PWA\CodeMaster\src\content\packs\_staging\L8-msg.ts (rework, 20개)
- [high/code] msg-kafka-manual-ack: ack.acknowledge()가 finally 블록 안에 있어 process(record.value())가 예외를 던져도 항상 ACK가 전송된다. 개념 설명 '처리가 끝난 뒤에만 커밋해 안전해요'와 실제 코드가 정반대로 동작하며, 실패한 메시지가 영구 손실될 수 있다. 안전한 수동 커밋 패턴은 process() 성공 후 try 블록 안에서 ack.acknowledge()를 호출하고, catch에서 예외를 처리(재시도·DLQ 전송)해야 한다.  →  수정: finally 블록을 제거하고 process(record.value()) 바로 아래(try 블록 안)에 ack.acknowledge()를 이동시켜라. catch 블록을 추가해 실패 시 재시도 또는 DLQ 처리를 명시하라.
- [high/explain] msg-kafka-listener-header: pitfall '헤더 이름이 다르면 null이 들어와요'가 사실과 다르다. Spring의 @Header(required=true, 기본값)는 헤더가 없으면 null을 주입하지 않고 MessageConversionException / MethodArgumentResolutionException을 던진다. null이 들어오는 경우는 @Header(required = false)를 명시했을 때뿐이다. 잘못된 pitfall이 입문자를 오도한다.  →  수정: pitfall을 '헤더가 없으면 예외가 발생해요. null을 허용하려면 @Header(required = false)를 붙이세요.'로 수정하라.
- [medium/explain] msg-jms-listener: pitfall '@EnableJms를 안 붙이면 동작하지 않아요'는 Spring Boot 환경에서 부정확하다. spring-boot-starter-activemq 또는 spring-boot-starter-artemis가 클래스패스에 있으면 JmsAutoConfiguration이 @EnableJms를 자동 적용한다. 이 팩의 나머지 스니펫은 모두 Spring Boot 관례를 따르므로 pitfall이 맥락과 충돌한다.  →  수정: pitfall을 'Spring Boot 없이 순수 Spring을 쓸 때는 @EnableJms를 직접 붙여야 해요. Spring Boot에서는 JMS 스타터가 자동 설정해줘요.'로 수정하라.
- [medium/explain] msg-rabbit-reply: pitfall '리턴 타입이 안 맞으면 역직렬화가 안 돼요'에서 '역직렬화(deserialization)'라는 용어를 잘못 사용했다. 역직렬화는 수신 메시지를 객체로 변환하는 것이고, 반환값 처리는 직렬화(serialization) 문제다. 또한 실제 주의점은 int 파라미터 변환 실패(입력 역직렬화) 또는 응답 직렬화 불일치인데 둘을 혼동해 기술했다.  →  수정: pitfall을 '입력 메시지를 int로 변환할 수 없거나 응답을 직렬화할 수 없으면 에러가 발생해요. RPC 양쪽의 타입과 MessageConverter 설정이 일치해야 해요.'로 수정하라.
- [low/explain] msg-kafka-template: terms 항목이 2개(KafkaTemplate, template.send)뿐으로 지나치게 sparse하다. Spring Kafka 3.x에서 template.send()는 CompletableFuture<SendResult<K,V>>를 반환하는데, pitfall에서 '동기 전송이 필요하면 .get()을 붙여야 해요'라고 언급하면서 terms에는 이 반환 타입이 없어 설명이 불완전하다.  →  수정: terms에 { t: 'CompletableFuture<SendResult>', d: 'send() 반환값 — 비동기 전송 결과' }를 추가하라.

### D:\_Git_PWA\CodeMaster\src\content\packs\_staging\L9-batch.ts (rework, 20개)
- [high/code] batch-flow-decision: 코드 끝에 `.build().build()`가 두 번 호출됩니다. `FlowJobBuilder.build()`는 `Job`을 반환하며 `Job` 인터페이스에는 `build()` 메서드가 없으므로 컴파일 오류입니다.  →  수정: 마지막 `.build()`를 하나만 남겨야 합니다: `...from(ok).on("*").end().build();`
- [high/code] batch-decider: 두 가지 오류가 있습니다. (1) `.build().build()` 이중 호출 — `Job`에는 `.build()`가 없으므로 컴파일 오류. (2) `SimpleJobBuilder.next(JobExecutionDecider)`는 Spring Batch 5에 존재하지 않습니다. `next()`는 `Step`만 받으며 Decider를 넘기려면 `on()`으로 전환한 뒤 `.next(decider)` 체인을 써야 합니다.  →  수정: `.start(work).next(decider).on("CONTINUE").end().on("SKIP").to(skip).end().build()` 형태로 수정하고 `.build()`는 한 번만 호출해야 합니다.
- [high/code] batch-job-parameters: `@Value("#{jobParameters['date']}")`를 `@Bean` 메서드 파라미터에 사용하면서 `@JobScope` 또는 `@StepScope` 어노테이션이 없습니다. Job Scope 없이는 애플리케이션 시작 시점에 `jobParameters`가 존재하지 않아 `BeanCreationException`이 발생합니다. pitfall에서 언급하지만 코드 자체가 실행 불가능한 상태입니다.  →  수정: `@Bean` 위에 `@StepScope` (또는 `@JobScope`)를 추가해야 합니다.
- [medium/version] batch-job-basic: title이 "JobBuilderFactory로 Job 만들기"이지만 `JobBuilderFactory`는 Spring Batch 5(Spring Boot 3.x)에서 제거된 클래스입니다. 코드는 올바르게 `new JobBuilder(...)`를 쓰고 있어 title과 코드가 불일치합니다.  →  수정: title을 "JobBuilder로 Job 만들기"로 수정해야 합니다.
- [medium/version] batch-step-tasklet: title이 "StepBuilderFactory로 Tasklet Step 만들기"이지만 `StepBuilderFactory`도 Spring Batch 5에서 제거된 클래스입니다. 코드는 올바르게 `new StepBuilder(...)`를 씁니다.  →  수정: title을 "StepBuilder로 Tasklet Step 만들기"로 수정해야 합니다.
- [medium/code] batch-jdbc-cursor-reader: Bean 메서드 이름이 `userReader`인데 `batch-jpa-paging-reader` 스니펫도 동일하게 `userReader`라는 `@Bean`을 정의합니다. 같은 ApplicationContext에 등록되면 bean 이름 충돌이 발생합니다.  →  수정: 두 Bean 중 하나를 `jdbcUserReader`, 다른 하나를 `jpaUserReader` 등으로 구별되는 이름으로 변경해야 합니다.

### D:\_Git_PWA\CodeMaster\src\content\packs\_staging\L10-sec.ts (rework, 20개)
- [high/code] sec-authority-list: CustomUserDetails implements UserDetails 이지만 getAuthorities() 하나만 구현했다. UserDetails 인터페이스는 getPassword(), getUsername(), isAccountNonExpired(), isAccountNonLocked(), isCredentialsNonExpired(), isEnabled() 등 총 7개 추상 메서드를 요구한다. public class로 선언한 채 나머지 메서드가 없으면 컴파일 오류(non-abstract class does not implement abstract methods)가 발생해 코드 자체가 실행 불가하다.  →  수정: 클래스를 abstract class로 바꾸거나, 나머지 필수 메서드(최소 getPassword, getUsername, isAccountNonExpired, isAccountNonLocked, isCredentialsNonExpired, isEnabled)를 stub 형태라도 추가한다. 학습 예제라면 @Override public String getPassword() { return password; } 등 필드 기반 구현을 간략히 포함시켜야 컴파일 가능 코드가 된다.
- [high/code] sec-rsa-key-jwt: 스니펫 ID가 'sec-rsa-key-jwt'이고 title도 'HMAC 키로 JWT 서명'인데 두 이름이 정반대로 충돌한다. RSA는 비대칭(공개키/개인키) 알고리즘이지만 코드는 Keys.hmacShaKeyFor를 사용하는 대칭(HMAC-SHA) 방식이다. ID에 'rsa'가 들어가 있어 입문자가 이 코드가 RSA 방식이라고 오해할 수 있다.  →  수정: ID를 'sec-hmac-key-jwt'로 수정하거나 title을 ID와 일치시켜 혼동을 제거한다. RSA 방식을 가르치려면 Keys.keyPairFor(SignatureAlgorithm.RS256) 기반 코드로 교체해야 한다.
- [medium/code] sec-exception-handling: Content-Type을 'application/json'으로 선언하고서 응답 본문에 순수 한국어 문자열('인증이 필요해요')을 그대로 쓴다. 이는 유효한 JSON이 아니라 파싱 에러를 일으킬 수 있으며, 입문자가 이 패턴을 복사하면 API 클라이언트에서 JSON 파싱 실패가 발생한다.  →  수정: 응답 본문을 JSON 형식으로 수정한다. 예: res.getWriter().write("{\"message\":\"인증이 필요해요\"}").
- [medium/code] sec-jwt-auth-filter: doFilterInternal 시그니처가 'throws IOException'만 선언하고 'throws ServletException'을 빠뜨렸다. OncePerRequestFilter의 abstract 메서드는 'throws ServletException, IOException'으로 선언되어 있다. Java에서 오버라이드 시 좁은 예외를 선언하는 것은 문법상 합법이지만, 내부 체인 호출(chain.doFilter)에서 발생하는 ServletException을 잡거나 다시 던질 수 없어 런타임에 예외가 필터 밖으로 누출된다.  →  수정: 시그니처를 'throws ServletException, IOException'으로 수정한다.
- [medium/explain] sec-security-ignored-paths: pitfall 설명에서 'WebSecurity.ignoring()은 최신 버전에서 deprecated되었다'고 명시하지만 Spring Security 6.x(Spring Boot 3.x)에서 WebSecurityCustomizer와 web.ignoring()은 공식 deprecated 상태가 아니다. deprecated가 아닌 API를 deprecated라고 설명하면 학습자에게 잘못된 정보를 주고 불필요한 리팩터링을 유도한다.  →  수정: 'deprecated'라는 표현을 제거하고, Spring Security 팀이 권고하는 이유(필터 체인을 완전히 우회하여 로깅·보안 헤더 적용 안 됨)를 설명하는 방향으로 수정한다.
- [low/schema] sec-oauth2-login: terms 배열이 3개로 다른 스니펫 대비 현저히 적다. oauth2Login 설정에는 clientId, clientSecret, redirectUri, authorization-code flow 등 입문자가 이해해야 할 핵심 요소가 더 있다.  →  수정: terms에 'authorization-code flow', 'clientId/clientSecret', 'redirect-uri' 등 최소 1-2개 항목을 추가한다.
- [low/explain] sec-access-denied: terms 배열에 'authenticationEntryPoint'를 '미인증 처리 (구분)'으로 포함했는데 이 스니펫의 실제 코드에는 authenticationEntryPoint가 등장하지 않는다. 코드에 없는 요소를 terms에서 설명하면 입문자가 코드와 설명을 매칭할 때 혼란을 겪는다.  →  수정: 해당 terms 항목을 제거하거나, 코드에 실제로 나타나는 요소만 terms에 포함한다. 비교 설명이 필요하다면 pitfall 또는 concept으로 이동한다.

### D:\_Git_PWA\CodeMaster\src\content\packs\_staging\L11-cache.ts (rework, 20개)
- [high/code] cache-redis-ops-hash: StringRedisTemplate.opsForHash().put()의 세 번째 인자로 int qty를 전달한다. StringRedisTemplate의 hashValueSerializer는 StringRedisSerializer이므로, Integer로 오토박싱된 qty를 직렬화할 때 런타임에 'IllegalArgumentException: Only String objects are supported'가 발생한다. 코드는 컴파일은 되지만 실행하면 반드시 실패한다.  →  수정: qty를 String으로 변환해서 전달해야 한다: redis.opsForHash().put("cart:" + userId, itemId, String.valueOf(qty)); 또는 RedisTemplate<String, Object>를 사용하고 GenericJackson2JsonRedisSerializer를 hashValueSerializer로 설정해야 한다.
- [high/code] cache-ehcache-config: 타이틀이 'EhCache 백업 캐시'이고 concept에서 'EhCache는 디스크까지 쓸 수 있는 캐시'라고 설명하지만, 실제 코드는 CaffeineCacheManager를 사용하며 EhCache 관련 클래스가 하나도 없다. 더 심각한 오류는 concept 본문에 '비슷한 Caffeine 디스크 확장 예시'라고 명시했는데, Caffeine은 디스크 티어를 전혀 지원하지 않는다(Caffeine의 공식 설계 원칙상 on-heap 인메모리 전용). 'diskCache'는 단순한 캐시 이름 문자열일 뿐이며 실제 디스크 저장소가 아니다. 이 스니펫은 EhCache도 아니고 Caffeine 디스크 기능도 아닌, 사실과 다른 내용을 가르친다.  →  수정: 두 가지 방향 중 하나를 선택해야 한다. (1) EhCache 스니펫으로 재작성: EhcacheCacheManager + org.ehcache:ehcache 의존성을 사용하는 실제 Spring Boot EhCache 통합 코드를 보여준다. (2) CaffeineCacheManager.registerCustomCache() 스니펫으로 재작성: 타이틀과 concept에서 EhCache 언급을 제거하고 Caffeine 커스텀 캐시 등록 예시임을 정확히 명시한다. Caffeine 디스크 기능이 있다는 서술은 반드시 삭제해야 한다.
- [high/explain] cache-ehcache-config: concept에서 'Caffeine 디스크 확장 예시를 보여줘요'라고 서술했는데 이는 사실이 아니다. Caffeine은 디스크 확장 기능이 없다. 입문자가 이 설명을 읽으면 Caffeine이 디스크 캐시를 지원한다는 잘못된 지식을 갖게 된다.  →  수정: Caffeine 디스크 확장 관련 서술을 모두 삭제하고, 해당 스니펫을 EhCache 실제 설정 코드 또는 Caffeine registerCustomCache 설명으로 대체해야 한다.
- [medium/topic] cache-ehcache-config: 학습팩 주제 중 'EhCache'가 포함되어 있으나, 이 스니펫의 코드는 EhCache API를 전혀 사용하지 않는다. EhcacheCacheManager, EhcacheManagerFactoryBean, ehcache.xml, org.ehcache 패키지 등 EhCache 고유 요소가 없다. 스니펫이 EhCache 주제를 실질적으로 커버하지 못하므로 팩 전체에서 EhCache가 사실상 누락된 상태다.  →  수정: EhCache 3.x + spring-boot-starter-cache + ehcache 의존성을 사용하는 실제 스프링 통합 예시 스니펫으로 교체해야 한다.
- [low/explain] cache-cacheable: pitfall에서 'unless="#result == null"로 처리하세요'라고 조언하는데, 이 스니펫의 코드는 orElseThrow()를 사용하므로 반환값이 null이 될 수 없다. pitfall 조언이 현재 코드 예시와 무관한 시나리오에 대한 것이어서 입문자에게 혼란을 줄 수 있다.  →  수정: orElse(null)을 사용하는 별도 스니펫에 unless 설명을 두거나(실제로 cache-conditional-unless 스니펫이 이를 다루고 있음), 현재 pitfall을 'null을 반환하는 메서드에 @Cacheable을 쓸 경우 unless를 활용하세요'라고 맥락을 명확히 해야 한다.

### D:\_Git_PWA\CodeMaster\src\content\packs\_staging\L12-mon.ts (rework, 20개)
- [high/code] mon-health-indicator: apiKeyValid() 메서드가 코드 스니펫 내에 정의되지 않아 컴파일 오류가 발생합니다. HealthIndicator 인터페이스를 구현하는 클래스에 apiKeyValid()가 없고, 외부 의존성 주입도 없어 독립적으로 컴파일 불가입니다.  →  수정: 클래스 내에 private boolean apiKeyValid() { ... } 메서드를 추가하거나, 외부 서비스(예: ApiKeyService)를 필드로 주입받아 호출하는 형태로 수정하세요. 예: private final ApiKeyService apiKeyService; ... if (apiKeyService.isValid()) ...
- [high/version] mon-logback-metrics: management.metrics.binders.logback.enabled: true 는 Spring Boot 2.x 전용 속성입니다. Spring Boot 3.x에서는 management.metrics.binders.* 네임스페이스가 제거되었습니다. Spring Boot 3.x에서는 logback-classic이 classpath에 있으면 LogbackMetrics가 자동 등록되며, 이 YAML 설정은 아무 효과가 없거나 바인딩 오류를 낼 수 있습니다.  →  수정: 해당 YAML 블록을 제거하거나, Spring Boot 3.x 방식으로 설명을 수정하세요. 비활성화가 필요한 경우에는 management.metrics.enable.logback.events=false 처럼 management.metrics.enable.* 방식을 사용하고, 기본 활성화(자동 구성)를 설명하는 스니펫으로 교체하세요.
- [medium/explain] mon-heap-memory: title이 'JVM 메모리 메트릭'이고 concept 설명도 'JVM 메모리, 스레드, GC 같은 시스템 메트릭을 자동 수집'이라고 하지만, 실제 code는 SLO(http.server.requests) 설정만 보여줍니다. JVM 메모리 관련 설정은 코드에 전혀 없습니다. 입문자는 이 코드를 보고 JVM 메모리 메트릭 설정 방법을 배웠다고 오해합니다.  →  수정: title을 'SLO 구간 설정'으로 바꾸고 concept도 SLO 설명으로 통일하거나, code를 JVM 메모리 메트릭 관련 실제 설정(예: management.endpoints.web.exposure.include에 metrics를 추가하고 /actuator/metrics/jvm.memory.used 접근)으로 교체하세요.

### D:\_Git_PWA\CodeMaster\src\content\packs\_staging\L13-test.ts (rework, 20개)
- [high/code] test-mock-mvc-json: .content("""{ \"name\":\"kim\"}""") 는 Java 15+ 텍스트 블록 문법 위반이다. 텍스트 블록의 여는 '"""' 뒤에는 반드시 줄 바꿈(line terminator)이 와야 하며, 같은 줄에 내용을 쓰면 컴파일 오류가 발생한다. 학습자가 그대로 복사하면 빌드가 깨진다.  →  수정: .content 인자를 일반 문자열 리터럴로 교체하거나, 텍스트 블록을 올바르게 사용한다: .content("""
        {\"name\":\"kim\"}
        """) 또는 .content("{\\\"name\\\":\\\"kim\\\"}")
- [high/code] test-disabled: assertThat(externalApi.status()) 에서 externalApi 가 FlakyTest 클래스의 어디에도 선언되지 않았다. @Disabled 는 실행을 건너뛸 뿐 컴파일은 수행되므로 'cannot find symbol: externalApi' 컴파일 오류가 발생한다.  →  수정: FlakyTest 클래스에 ExternalApi externalApi; 필드를 선언하거나 (예: @Mock 또는 @Autowired 주입), 코드 예시 자체를 컴파일 가능하게 수정한다.
- [high/explain] test-assert-all: title이 'AssertJ assertAll'이지만 코드는 SoftAssertions.assertSoftly를 사용한다. assertAll은 JUnit5의 Assertions.assertAll(Executable...) API이고, assertSoftly는 AssertJ의 SoftAssertions API다. 두 개는 별개의 클래스·메서드이므로 제목이 틀렸다. 입문자가 두 API를 혼동하게 된다.  →  수정: title을 'AssertJ SoftAssertions' 또는 'SoftAssertions.assertSoftly'로 정정한다.
- [medium/code] test-testcontainers: ContainerTest 클래스에 @Test 메서드가 없다. 설정 코드(@DynamicPropertySource)만 있어 테스트 실행 시 '테스트 메서드 없음' 경고가 나오고, 실제 검증 예시를 보여주지 못해 학습 효과가 떨어진다.  →  수정: 컨테이너가 정상 기동됐는지 확인하는 간단한 @Test 메서드를 추가한다. 예: @Test void containerIsRunning() { assertThat(postgres.isRunning()).isTrue(); }
- [medium/code] test-web-mvc-test: UserController가 의존하는 서비스(@Service 빈)에 대한 @MockBean이 없다. @WebMvcTest는 서비스 빈을 로드하지 않으므로, UserController 생성자에 서비스 의존이 있으면 컨텍스트 로딩에 실패한다. pitfall에서 @MockBean 필요성을 언급하면서도 코드 예시에는 없어 모순된다.  →  수정: 코드 예시에 @MockBean UserService service; 를 추가해 완전한 실행 가능 예시로 만들거나, pitfall 설명을 '이 예시는 UserController에 의존성이 없다고 가정한다'고 보완한다.

### D:\_Git_PWA\CodeMaster\src\content\packs\_staging\L14-arch.ts (rework, 20개)
- [high/code] arch-hexagonal-adapter: JpaUserAdapter가 LoadUserPort와 SaveUserPort를 둘 다 implements하지만, LoadUserPort에 선언된 findAllActive() 메서드 구현이 없다. 모든 추상 메서드를 구현하지 않으면 Java 컴파일러가 'JpaUserAdapter is not abstract and does not override abstract method findAllActive()' 오류를 낸다.  →  수정: JpaUserAdapter에 @Override public List<User> findAllActive() { return repo.findAll().stream().map(UserJpaEntity::toDomain).toList(); } 구현을 추가하거나, 예제 목적이라면 LoadUserPort에서 findAllActive()를 제거하거나 별도 포트로 분리한다.
- [high/code] arch-event-sourcing-replay: apply(DomainEvent e) 메서드가 OrderFactory 클래스 닫는 중괄호 '}'  밖에 선언되어 있다. 클래스 블록 외부에 메서드를 선언하는 것은 Java 문법 오류로 컴파일 불가다. 이 메서드는 Order 클래스의 멤버여야 한다.  →  수정: apply() 메서드를 Order 클래스 내부로 이동시키고, 파일명을 Order.java로 표시하거나 코드 스니펫에 Order 클래스 블록을 추가해 메서드가 그 안에 들어가게 수정한다.
- [high/code] arch-package-structure: 단일 코드 블록에 'package com.shop.user;'와 'package com.shop.user.domain;' 두 개의 package 선언이 있다. Java는 파일당 package 선언이 하나여야 하며 위반 시 컴파일 오류다. 또한 package-info.java는 패키지 수준 주석용 특수 파일로 일반 record/class 선언을 함께 넣을 수 없다.  →  수정: 두 번째 package 선언과 record User를 제거하고 package-info.java를 패키지 주석 형태(/** ... */ package com.shop.user;)로만 구성하거나, 별도 파일(User.java)로 분리해 표현한다.
- [high/explain] arch-hexagonal-port: terms에서 LoadUserPort를 '조회용 들어오는 문 (인바운드)'로 설명하지만 틀렸다. Hexagonal Architecture에서 LoadUserPort·SaveUserPort는 UseCase가 외부 영속성을 호출하기 위한 Outbound(Driven/Secondary) Port다. Inbound Port는 외부가 애플리케이션을 구동하기 위해 UseCase를 노출하는 인터페이스(예: RegisterUserUseCase 인터페이스)다.  →  수정: LoadUserPort 설명을 '조회용 나가는 문 (아웃바운드 / Driven Port)'으로, SaveUserPort는 '저장용 나가는 문 (아웃바운드 / Driven Port)'으로 수정한다.
- [medium/explain] arch-layered-service: pitfall이 'this.userService 에 할당하면 컴파일 에러가 나요. 항상 this.userRepository 에 할당하세요.'인데, 이 스니펫은 UserService 클래스 안에서 UserRepository를 생성자 주입하는 코드다. userService를 언급하는 pitfall은 이 스니펫과 무관하며, 다른 스니펫의 설명이 잘못 삽입된 것으로 보인다.  →  수정: pitfall을 이 스니펫에 실제로 적합한 내용, 예: '@Transactional이 없으면 save 후 예외 발생 시 롤백이 안 돼요.' 등으로 교체한다.
- [low/topic] arch-mapper-dto: arch-dto-request-response 스니펫(UserResponse.from(User) 정적 메서드)과 arch-mapper-dto 스니펫(UserMapper.toResponse/toDomain)은 모두 'Entity↔DTO 변환'이라는 같은 학습 목표를 다룬다. 패턴 차이(레코드 내부 팩터리 vs 별도 Mapper 클래스)가 있지만 초급자 관점에서 개념 중복이 크다.  →  수정: 두 스니펫의 차이점을 각 concept에서 명시적으로 대비시키거나, 하나를 제거하고 팩어주는 내용을 통합한다.

### D:\_Git_PWA\CodeMaster\src\content\packs\_staging\L15-dp.ts (rework, 20개)
- [high/code] dp-factory-method: switch 분기에서 'new SmsSender()'를 반환하지만 SmsSender 클래스가 코드 어디에도 정의되어 있지 않다. 컴파일 오류 발생.  →  수정: SmsSender 클래스를 EmailSender와 동일한 방식으로 코드 내에 추가하거나, switch에서 해당 케이스를 제거해야 한다.
- [medium/explain] dp-factory-method: 패턴 이름이 'Factory Method'이지만 코드는 GoF Factory Method 패턴이 아니다. 서브클래스가 생성 메서드를 오버라이드하는 것이 Factory Method인데, 이 코드는 static 메서드 하나로 타입에 따라 분기하는 Simple Factory(정적 팩터리)다. 입문자가 두 패턴을 혼동하게 된다.  →  수정: 제목·concept를 'Simple Factory(정적 팩터리)'로 수정하거나, Creator 추상 클래스와 ConcreteCreator 서브클래스를 이용한 진짜 Factory Method 구조로 코드를 교체해야 한다.
- [high/code] dp-abstract-factory: Button, TextField, LightButton, LightTextField, DarkButton, DarkTextField 총 6개 타입이 코드에서 참조되지만 어디에도 정의되어 있지 않다. 컴파일 오류 발생.  →  수정: Button/TextField 인터페이스와 LightButton/DarkButton/LightTextField/DarkTextField 구현체를 코드 스니펫에 추가해야 한다.
- [high/code] dp-strategy: Money 클래스와 그 메서드 minus(), times()가 사용되지만 코드에 정의되어 있지 않다. 컴파일 오류 발생.  →  수정: 간단한 Money 레코드(예: record Money(long value) { ... })를 스니펫에 추가하거나, Money를 int/double 등 기본 타입으로 교체해야 한다.
- [high/code] dp-chain-of-responsibility: handle(Request req), canHandle(Request req), doHandle(Request req)에서 Request 타입이 사용되지만 코드에 정의되어 있지 않다. 컴파일 오류 발생.  →  수정: Request 클래스/인터페이스를 스니펫에 추가하거나, String 등 표준 타입으로 대체해야 한다.
- [high/code] dp-iterator: for (Book b : shelf) 루프가 클래스 블록 바깥 최상위 레벨에 작성되어 있다. Java에서 실행 가능 코드는 반드시 메서드 내에 있어야 하므로 컴파일 오류 발생. 또한 Book 타입과 shelf 변수도 정의되지 않았다.  →  수정: for-each 루프를 main() 메서드나 사용 예시 클래스 내부에 배치하고, Book 클래스(또는 레코드)와 shelf 변수 선언을 추가해야 한다.
- [high/code] dp-mediator: ChatMediator 인터페이스와 ChatRoom이 User 타입을 사용하고 u.receive(msg)를 호출하지만, User 클래스와 receive() 메서드가 코드에 정의되어 있지 않다. 컴파일 오류 발생.  →  수정: User 클래스(이름 필드 + receive(String) 메서드 포함)를 스니펫에 추가해야 한다.
- [medium/explain] dp-chain-of-responsibility: pitfall이 '체인 끝에서 처리 못 하면 아무 일도 안 일어날 수 있어요'라고 설명하지만, 실제 코드는 else 브랜치에서 UnsupportedOperationException을 던진다. 설명과 코드 동작이 불일치한다.  →  수정: pitfall을 '이 코드는 체인 끝에서 예외를 던지지만, 예외 대신 조용히 무시하도록 작성하면 요청이 처리되지 않아도 알 수 없어요.'로 수정해야 한다.
- [low/explain] dp-composite: pitfall이 '안전 모드에서는 add()를 잎에서 예외로 막아요'라고 설명하지만, 코드는 잎(MenuItem)의 add()가 부모의 throw를 그대로 상속하는 투명(transparent) 방식이다. 안전(safe) 방식과 투명 방식의 구분이 코드와 설명에서 혼재한다.  →  수정: pitfall을 '이 코드는 투명 합성 방식이라 잎(MenuItem)에서 add()를 호출하면 런타임 예외가 발생해요. 컴파일 시점에 막으려면 MenuItem에 add()를 두지 않는 안전 합성 방식을 쓰세요.'로 수정해야 한다.
- [medium/topic] dp-state: State 패턴은 요구 주제(Singleton·Factory·Builder·Strategy·Observer·Template·Decorator·Adapter·Proxy·Facade) 10개에 포함되지 않는다.  →  수정: 주제 범위를 확인해 State 스니펫을 제거하거나, 팩 정의에 State를 추가해야 한다.
- [medium/topic] dp-command: Command 패턴은 요구 주제 10개에 포함되지 않는다.  →  수정: 주제 범위를 확인해 Command 스니펫을 제거하거나, 팩 정의에 Command를 추가해야 한다.
- [medium/topic] dp-chain-of-responsibility: Chain of Responsibility 패턴은 요구 주제 10개에 포함되지 않는다.  →  수정: 주제 범위를 확인해 해당 스니펫을 제거하거나, 팩 정의에 CoR을 추가해야 한다.
- [medium/topic] dp-composite: Composite 패턴은 요구 주제 10개에 포함되지 않는다.  →  수정: 주제 범위를 확인해 해당 스니펫을 제거하거나, 팩 정의에 Composite을 추가해야 한다.
- [medium/topic] dp-flyweight: Flyweight 패턴은 요구 주제 10개에 포함되지 않는다.  →  수정: 주제 범위를 확인해 해당 스니펫을 제거하거나, 팩 정의에 Flyweight를 추가해야 한다.
- [medium/topic] dp-iterator: Iterator 패턴은 요구 주제 10개에 포함되지 않는다.  →  수정: 주제 범위를 확인해 해당 스니펫을 제거하거나, 팩 정의에 Iterator를 추가해야 한다.
- [medium/topic] dp-mediator: Mediator 패턴은 요구 주제 10개에 포함되지 않는다.  →  수정: 주제 범위를 확인해 해당 스니펫을 제거하거나, 팩 정의에 Mediator를 추가해야 한다.
- [medium/topic] dp-memento: Memento 패턴은 요구 주제 10개에 포함되지 않는다.  →  수정: 주제 범위를 확인해 해당 스니펫을 제거하거나, 팩 정의에 Memento를 추가해야 한다.
- [medium/topic] dp-visitor: Visitor 패턴은 요구 주제 10개에 포함되지 않는다.  →  수정: 주제 범위를 확인해 해당 스니펫을 제거하거나, 팩 정의에 Visitor를 추가해야 한다.

### D:\_Git_PWA\CodeMaster\src\content\packs\_staging\L16-devops.ts (rework, 20개)
- [high/code] devops-dockerfile-multistage: ENTRYPOINT ['java', '-jar', 'app.jar'] 는 유효하지 않은 exec form이다. Dockerfile에서 exec form은 JSON 배열(큰따옴표)만 인식한다. 작은따옴표 배열은 셸 문자열로 파싱되어 Docker가 /bin/sh -c "['java', '-jar', 'app.jar']" 를 실행 → 컨테이너 시작 실패.  →  수정: ENTRYPOINT ["java", "-jar", "app.jar"] 로 큰따옴표 JSON 배열로 수정
- [high/code] devops-dockerfile-args: 두 가지 버그: (1) CMD ['sh', '-c', 'java $JAVA_OPTS -jar /app/app.jar'] 도 ENTRYPOINT와 같은 이유로 exec form이 아니어서 실행 실패. (2) COPY 는 /app/${JAR_FILE}(기본 app.jar)로 복사하지만 CMD는 /app/app.jar를 하드코딩 → ARG JAR_FILE을 빌드 시 오버라이드하면 파일명 불일치로 실행 불가.  →  수정: CMD ["sh", "-c", "java $JAVA_OPTS -jar /app/${JAR_FILE}"] 로 큰따옴표 exec form + ARG 변수 참조 통일
- [high/code] devops-compose-spring-db: db 서비스에 healthcheck 블록이 없는데 app 서비스가 depends_on.db.condition: service_healthy를 사용한다. healthcheck가 정의되지 않은 서비스는 service_healthy 조건을 절대 만족하지 못해 app 컨테이너가 영원히 대기하거나 시작에 실패한다.  →  수정: db 서비스에 healthcheck 블록 추가: healthcheck: { test: ["CMD-SHELL", "pg_isready -U cm -d codemaster"], interval: 10s, timeout: 5s, retries: 5 }
- [high/code] devops-gradle-module-deps: settings.gradle에서 include 'persistence-jpa'로 선언하면 Gradle 프로젝트 경로는 :persistence-jpa 다. project(':persistence-jpa').name = 'persistence'는 표시 이름만 바꿀 뿐 경로는 변경되지 않는다. 따라서 module deps에서 project(':persistence') 는 '프로젝트를 찾을 수 없음' 빌드 오류를 낸다.  →  수정: implementation project(':persistence-jpa') 로 수정하거나, settings.gradle에서 include 'persistence'(디렉터리명)로 통일
- [high/code] devops-k8s-configmap-secret: stringData 필드는 평문(plain text)을 받는 필드다. 그런데 코드에 c2VjcmV0, bXlzdXBlcnNlY3JldA== 같이 base64로 인코딩된 문자열을 값으로 넣었다. 이 경우 k8s는 해당 문자열을 평문으로 그대로 저장·재인코딩하여 앱이 디코딩된 'secret'이 아닌 리터럴 'c2VjcmV0'를 받게 된다. 게다가 pitfall 설명에서 'base64 인코딩일 뿐'이라고 서술해 data: 필드의 동작을 설명하므로 코드와 설명이 모순된다.  →  수정: stringData: DB_PASSWORD: secret / JWT_SECRET: mysupersecret 으로 평문 사용, 또는 stringData를 data:로 변경하고 base64 값 유지. pitfall도 stringData는 평문, data는 base64라는 구분으로 수정
- [medium/code] devops-helm-chart: dependencies[].version: '15.x.x' 는 Helm(masterminds/semver)이 인식하는 유효한 semver 범위 표현이 아니다. Helm semver 범위는 ^15.0.0, ~15.0.0, >=15.0.0 <16.0.0, 또는 정확한 버전(예: 15.5.6) 형식을 써야 한다.  →  수정: version: '>=15.0.0 <16.0.0' 또는 version: '^15.0.0' 으로 수정
- [low/code] devops-gh-actions-build: Gradle의 build 태스크는 check → test 태스크에 의존한다. 따라서 ./gradlew build 실행 시 테스트가 이미 포함되어 실행된다. 이후 별도의 ./gradlew test 스텝은 테스트를 두 번 실행하는 중복 단계다.  →  수정: ./gradlew test 스텝을 제거하거나, ./gradlew build를 ./gradlew assemble 로 변경하고 테스트 스텝을 분리하여 의도를 명확히 표현

### D:\_Git_PWA\CodeMaster\src\content\packs\_staging\L17-obs.ts (rework, 20개) 중복:obs-log-backup-gcs
- [high/code] obs-sentry-manual-capture: Sentry.captureException(e, scope -> { ... }) 는 Sentry Java SDK(6.x/7.x)에 존재하지 않는 메서드 시그니처다. captureException의 공개 오버로드는 captureException(Throwable) 와 captureException(Throwable, Hint) 두 가지뿐이며 ScopeCallback을 두 번째 인자로 받는 오버로드가 없어 컴파일 에러가 발생한다.  →  수정: Sentry.withScope(scope -> { scope.setTag("orderId", String.valueOf(orderId)); scope.setExtra("retryCount", 3); Sentry.captureException(e); }); 패턴으로 교체한다.
- [high/code] obs-json-logging: <customFields>{'app':'codemaster'}</customFields> 에서 JSON 값이 단일 따옴표(single-quote)로 작성됐다. LogstashEncoder의 CustomFieldsJsonProvider는 RFC 8259 엄격 JSON 파서를 사용하므로 단일 따옴표는 파싱 실패 → 런타임 초기화 오류를 유발한다. code 블록이 백틱 템플릿 리터럴로 감싸져 있으므로 내부에서 이중 따옴표를 그대로 쓸 수 있다.  →  수정: <customFields>{"app":"codemaster"}</customFields> 로 이중 따옴표로 교체한다.
- [high/code] obs-log-backup-gcs: id가 'obs-log-backup-gcs'이고 title이 '로그 백업 업로드'이나 code에는 표준 RollingFileAppender XML만 있고 GCS(Google Cloud Storage) 업로드 로직이 전혀 없다. 이 코드는 obs-logback-rolling과 SizeAndTimeBasedRollingPolicy 패턴이 사실상 동일하며(숫자 파라미터만 다름), 제목이 약속하는 내용을 전혀 구현하지 않는다.  →  수정: GCS 업로드를 실제로 보여주는 코드(예: GcsAppender 또는 post-roll script 연동)를 작성하거나, 단순 롤링 변형이라면 id/title을 'obs-logback-rolling-advanced'처럼 정확히 수정하고 obs-logback-rolling과 차별화되는 개념(cleanHistoryOnStart 등)에 집중한다.
- [medium/code] obs-micrometer-tracing-deps: file 필드가 'build.gradle'이지만 code 블록에 Gradle 의존성 블록(dependencies { ... })과 YAML 설정(management: tracing: ...)이 하나의 스니펫에 혼재한다. 두 파일은 완전히 다른 형식으로, 학습자가 하나의 파일로 오해하거나 YAML을 build.gradle에 붙여 넣을 수 있다.  →  수정: 두 스니펫으로 분리한다: (1) file='build.gradle' — 의존성만, (2) file='application.yml' — management.tracing 설정만. 또는 file을 'build.gradle + application.yml'로 표기하고 code에 명확한 구분 주석을 추가한다.
- [medium/duplicate] obs-log-backup-gcs: obs-logback-rolling과 obs-log-backup-gcs 모두 ch.qos.logback.core.rolling.RollingFileAppender + SizeAndTimeBasedRollingPolicy 패턴을 보여준다. 차이는 maxFileSize(50MB vs 100MB), maxHistory(30 vs 14), totalSizeCap 유무, cleanHistoryOnStart 유무뿐이다. 같은 XML 골격이 반복되어 학습 효과가 낮다.  →  수정: obs-log-backup-gcs를 진정한 GCS 업로드나 다른 주제(예: 비동기 appender AsyncAppender)로 교체한다.
- [low/code] obs-opentelemetry-sdk: YAML 내 'sampler.arg: 0.2' 키는 점(.)이 포함된 리터럴 키로 파싱된다. Spring Boot 프로퍼티 바인딩에서 otel.traces.sampler.arg에 매핑되려면 같은 레벨에서 단일 들여쓰기 키가 아닌 상위-하위 계층이 필요하다. 현재 작성 방식은 의도한 otel.traces.sampler.arg 바인딩이 아니라 otel.traces.'sampler.arg'(리터럴 맵 키)로 해석될 수 있다.  →  수정: otel.traces.sampler.arg를 최상위 플랫 키 형식(otel.traces.sampler.arg: 0.2)으로 분리하거나, Spring Boot가 실제로 지원하는 OTEL 환경 변수 형식(OTEL_TRACES_SAMPLER_ARG=0.2)을 주석으로 병기한다.

### D:\_Git_PWA\CodeMaster\src\content\packs\_staging\L18-data.ts (rework, 20개)
- [high/code] data-slice-cursor: 코드 내에서 `FeedRepository` 클래스 안에 `feedRepository` 필드를 참조하고 있다. 즉 자기 자신을 다시 필드로 주입받아 호출하는 자기 참조 구조다. 이 패턴은 컴파일은 되더라도 학습자에게 명백히 잘못된 아키텍처를 보여준다. 커서 페이징 로직은 Service 계층(FeedService)이나 Custom Repository Impl 에 있어야 한다.  →  수정: 클래스 이름을 `FeedService`(또는 `FeedQueryService`)로 변경하고 `private final FeedRepository feedRepository;` 필드를 명시적으로 선언해 주입받는 구조로 수정한다.
- [high/schema] data-hikari-config: `lang: 'java'` 이지만 code 내용은 `application.properties` 형식(key=value)이다. 파일명도 `application.properties`로 명시돼 있어 lang 값이 실제 코드 언어와 불일치한다. 렌더러가 lang 값으로 syntax highlighting을 결정한다면 Java 하이라이터가 properties 파일에 적용돼 잘못 표시된다.  →  수정: `lang` 필드를 `'properties'` 로 변경하거나, 팩 전체가 'java' 고정이라면 최소한 설명에 'properties 파일 설정' 임을 명확히 표기하고 스키마 허용 여부를 확인한다.
- [high/explain] data-explain: `concept` 문자열이 '설계도만 보여줘요. 는 쿼리가 인덱스를 타는지 한눈에 알 수 있어요.' 로 주어 없이 문장이 잘렸다. '설계도만 보여줘요.' 뒤에서 원래 문장이 분리되면서 ' 는 쿼리가...' 가 고아 문장이 됐다. 또한 `why` 필드에 '풀 스캔인인지' 라는 이중 표현 오타가 있다.  →  수정: concept를 '설계도만 보여줘요. 이 정보로 쿼리가 인덱스를 타는지 한눈에 알 수 있어요.' 로 수정하고, why의 '풀 스캔인인지' → '풀 스캔인지' 로 수정한다.
- [medium/code] data-querydsl-order: `OrderSpecifier spec = asc ? user.name.asc() : user.name.desc();` 에서 `OrderSpecifier`를 raw type(제네릭 미지정)으로 선언한다. Java 21 + QueryDSL 5.x 환경에서 unchecked warning이 발생하고, `orderBy()`에 전달할 때 `@SuppressWarnings` 없이는 경고가 남는다.  →  수정: `OrderSpecifier<String> spec = ...` 으로 제네릭을 명시한다.
- [medium/explain] data-querydsl-order: `concept` 에 '정렬 토그를 레고 스위치처럼' 이라고 적혀 있다. '토그' 는 '토글(toggle)' 의 오타다. 입문자가 잘못된 한글 외래어를 학습할 수 있다.  →  수정: '토그를' → '토글을' 로 수정한다.
- [medium/explain] data-hikari-config: `max-lifetime` term 설명이 '연결 한 개의 최수 수명' 이다. '최수' 는 '최대' 의 오타다.  →  수정: '최수 수명' → '최대 수명' 으로 수정한다.
- [medium/explain] data-flyway-sql: `UNIQUE` term 설명이 '갑은 값이 두 번 들어가지 못함' 이다. '갑은' 은 '같은' 의 오타다. 입문자가 의미를 잘못 이해할 수 있다.  →  수정: '갑은 값이' → '같은 값이' 로 수정한다.
- [medium/explain] data-index-create: `UNIQUE INDEX` term 설명이 '갑은 값이 하나만 — 고유 강제' 이다. 위와 동일하게 '갑은' → '같은' 오타다.  →  수정: '갑은 값이' → '같은 값이' 로 수정한다.
- [low/code] data-querydsl-subquery: 외부 쿼리와 서브쿼리에서 동일한 `order` 별칭(QOrderEntity 인스턴스)을 재사용한다. QueryDSL 공식 best practice 는 서브쿼리용 별칭을 `new QOrderEntity("orderSub")` 처럼 분리하도록 권장한다. 일부 JPA 구현체에서 예상치 못한 별칭 충돌이 발생할 수 있다.  →  수정: 서브쿼리 내 별칭을 `QOrderEntity orderSub = new QOrderEntity("orderSub");` 로 분리하고 `from(orderSub)` · `orderSub.amount.avg()` 로 변경한다.
- [low/explain] data-n-plus-one: `프록시` term 설명이 '실제 대신 둥근 가짜 객체' 다. '둥근' 은 JPA 프록시와 전혀 무관한 수식어로 입문자에게 혼란을 준다.  →  수정: '실제 대신 둥근 가짜 객체' → '실제 엔티티 대신 참조를 대리하는 가짜 객체' 로 수정한다.

### D:\_Git_PWA\CodeMaster\src\content\packs\_staging\L19-resil.ts (rework, 20개)
- [high/explain] resil-saga-orchestrator: concept 문자열 안에 깨진 문자(Mojibake)가 있어요. '지�자가 있어요'와 '단계를 지�하고'는 '지휘자'·'지휘하고'가 UTF-8 저장 오류로 깨진 것이에요. 런타임에 렌더링 시 두꺼비(?)로 표시되거나 JSON 직렬화 에러를 유발해요.  →  수정: concept: '안무자(Orchestrator) 사가는 지휘자가 있어요. 결제→재고→배송 순으로 단계를 지휘하고, 어느 단계가 터지면 거꾸로 되돌아가는 보상(compensate) 을 실행해요.'로 교체하세요.
- [high/explain] resil-saga-choreography: title과 concept에서 Choreography를 '안무 없음'으로 번역해 개념이 정반대로 뒤집혔어요. Choreography는 '안무(무용 동작처럼 서비스가 자율적으로 동작)'이지, '안무 없음'이 아니에요. concept 첫 줄도 '안무 없는(Choreography) 사가'라고 써 있어 모순이에요. 입문자가 두 패턴을 완전히 반대로 학습하게 돼요.  →  수정: title을 'Saga (이벤트 기반 — Choreography)'로 바꾸고, concept도 '안무(Choreography) 방식 사가는 중앙 지휘자 없이 서비스들이 이벤트를 통해 스스로 연쇄 동작해요.'로 수정하세요.
- [high/explain] resil-saga-orchestrator: title이 'Saga (안무자)'인데, Orchestrator는 '지휘자'이고 Choreographer가 '안무자'예요. resil-saga-choreography가 '안무 없음'이고 이 스니펫이 '안무자'로 써 있어 두 스니펫의 번역이 모두 틀려 패턴 이름이 교환된 상태예요.  →  수정: title을 'Saga (지휘자 — Orchestrator)'로 수정하세요.
- [high/code] resil-actuator-health: HealthIndicator 구현 클래스 코드에서 externalClient 필드가 선언·주입되지 않은 채 health() 메서드에서 바로 참조돼요. 컴파일 불가(cannot find symbol) 에러가 발생해요.  →  수정: 클래스 본문에 'private final ExternalClient externalClient;'와 생성자 주입(또는 @Autowired)을 추가하거나, 예시 간소화를 위해 externalClient.ping()를 별도 주석 또는 인라인 boolean 리터럴로 표현하세요.
- [medium/explain] resil-eureka-client: pitfall: '@EnableDiscoveryClient 와 @EnableEurekaClient 를 동시에 쓰면 충돌이 나요'는 사실이 아니에요. 두 어노테이션을 동시에 써도 충돌하지 않아요. 또한 Spring Cloud 2022+ (Spring Boot 3.x)에서는 @EnableEurekaClient 자체가 spring-cloud-starter-netflix-eureka-client 의존성만 있으면 자동 구성되어 deprecated 되어 있어요. 잘못된 pitfall이 입문자에게 혼란을 줘요.  →  수정: pitfall을 '스프링 클라우드 2022+ (Spring Boot 3.x) 에서는 @EnableDiscoveryClient 어노테이션 없이도 의존성만 추가하면 자동 등록돼요. 구버전 @EnableEurekaClient 는 사용하지 마세요.'로 교체하세요.
- [medium/explain] resil-discovery-rest: pitfall에서 'Ribbon/WebClient 로 여러 개를 나누어 쓰세요'라고 안내하는데, Ribbon은 Spring Cloud 2020.0 (Ilford) 부터 제거된 라이브러리예요. Spring Boot 3.x에서는 Spring Cloud LoadBalancer를 써야 해요. 더 이상 존재하지 않는 라이브러리를 입문자에게 추천하면 빌드 에러를 유발해요.  →  수정: pitfall을 'get(0) 은 로드밸런싱 없이 첫 인스턴스만 써요. 실전에서는 @LoadBalanced RestTemplate 또는 WebClient + Spring Cloud LoadBalancer 를 쓰세요.'로 수정하세요.
- [medium/code] resil-bulkhead-threadpool: THREADPOOL 형 Bulkhead와 내부의 CompletableFuture.supplyAsync()가 중첩되어 있어요. Resilience4j THREADPOOL Bulkhead는 프레임워크가 자체 스레드 풀에서 메서드를 실행시켜야 하는데, 메서드 안에서 다시 supplyAsync()를 호출하면 ForkJoinPool을 추가로 사용하게 돼 Bulkhead의 스레드 풀이 실제로 제어하는 스레드가 아닌 submit 스레드만 차지해요. 예시가 의도한 격리 효과를 제대로 보여주지 못해요.  →  수정: 메서드 내부를 동기 코드로 바꾸거나('return exporter.run(range);' 형태로), 반환 타입만 CompletableFuture로 두고 내부는 동기 실행 후 CompletableFuture.completedFuture(result)로 반환하는 방식으로 수정하세요.
- [low/explain] resil-config-server-native: terms 항목 중 { t: 'cloud.config.server', d: 'Config Server 설정 루' }의 설명이 '루'로 끝나 '루트'에서 글자가 잘렸어요. 입문자에게 불완전한 설명이에요.  →  수정: d 값을 'Config Server 설정 루트'로 수정하세요.
- [low/topic] resil-actuator-health: 이 스니펫의 주제(Actuator HealthIndicator)는 레벨 명세(Resilience4j·Eureka·Config Server·Saga)에 명시되지 않은 주변 주제예요. 연관성은 있으나 레벨 커버리지 범위에서 벗어나요.  →  수정: 이 스니펫을 유지하려면 레벨 명세에 'Actuator Health'를 추가하거나, 제거 후 주제 범위 내 스니펫(예: RateLimiter YAML 설정 또는 Config Server git 백엔드)으로 교체하세요.

### D:\_Git_PWA\CodeMaster\src\content\packs\_staging\L20-rx.ts (minor, 20개)
- [high/explain] rx-merge-interleave: pitfall이 '오류에 강하려면 concat을 써요'라고 설명하지만 이는 사실과 다릅니다. Flux.concat도 업스트림 중 하나에서 오류가 발생하면 동일하게 전체 흐름이 종료됩니다. concat은 순서 보장을 위한 연산자이지, 오류 격리 연산자가 아닙니다. 오류를 격리하려면 Flux.mergeDelayError 또는 개별 소스에 onErrorResume을 붙여야 합니다.  →  수정: pitfall을 '한쪽이 오류가 나면 merge 전체가 끝나요. 오류를 격리하려면 각 소스에 onErrorResume을 붙이거나 Flux.mergeDelayError를 써요.'로 수정하세요.
- [high/explain] rx-webclient-get: pitfall이 'retrieve() 없이 바로 bodyToMono를 부르면 응답 상태 검사를 안 해요'라고 설명하지만, WebClient API에서 bodyToMono()는 retrieve()가 반환하는 ResponseSpec의 메서드입니다. retrieve() 없이 bodyToMono()를 직접 호출하는 것 자체가 컴파일 불가능하므로, 이 pitfall은 존재하지 않는 사용 패턴을 경고하는 것입니다. 실제 pitfall은 retrieve() 대신 exchangeToMono()를 쓸 때 응답 바디를 직접 소비해야 리소스 누수를 막을 수 있다는 점입니다.  →  수정: pitfall을 'exchangeToMono()로 바꾸면 응답 바디를 반드시 소비해야 해요. 소비하지 않으면 메모리 누수가 생겨요. 단순 상태 코드 처리는 retrieve()가 더 안전해요.'로 수정하세요.
- [medium/explain] rx-r2dbc-save: pitfall에 '주입 위험(objection)'이라고 적혀 있습니다. 'objection'은 '이의(법적 반박)'이라는 뜻이며, 여기서 의도한 단어는 'injection'(SQL 인젝션)입니다. 입문자에게 잘못된 영어 용어를 전달합니다.  →  수정: '주입 위험(objection)'을 '주입 위험(SQL Injection)'으로 수정하세요.
- [low/explain] rx-r2dbc-save: concept에 '영받은 줄 수'라는 표현이 있습니다. '영향받은 줄 수'의 오타입니다.  →  수정: '영받은 줄 수'를 '영향받은 줄 수'로 수정하세요.
- [low/explain] rx-backpressure-limit: terms 첫 번째 항목 d에 '매우 빧 호스'라고 적혀 있습니다. '빧'은 '빠른'의 오타입니다.  →  수정: '매우 빧 호스'를 '매우 빠른 호스'로 수정하세요.
- [low/explain] rx-zip-pair: concept에 '다음으로 넘가요'라는 표현이 있습니다. '넘어가요'의 오타입니다.  →  수정: '넘가요'를 '넘어가요'로 수정하세요.
- [low/explain] rx-collect-list: concept에 '한 건으로 바꿔니다'라는 표현이 있습니다. '바꿉니다'의 오타입니다. 동일한 오타가 rx-delay-elements의 terms에도 반복됩니다('바꿔니다').  →  수정: '바꿔니다'를 '바꿉니다'로 수정하세요. (rx-collect-list concept, rx-delay-elements terms 두 곳)
- [low/explain] rx-doonnext-log: pitfall에 '블록이 생가요'라는 표현이 있습니다. '생겨요'의 오타입니다.  →  수정: '생가요'를 '생겨요'로 수정하세요.
- [low/explain] rx-retry-backoff: terms 두 번째 항목 d에 '점점 늘아요'라는 표현이 있습니다. '늘어나요'의 오타입니다.  →  수정: '늘아요'를 '늘어나요'로 수정하세요.
- [low/explain] rx-reduce-sum: terms 세 번째 항목의 t 값이 '(acc, n) -> acc + n)'으로 닫는 괄호가 하나 더 붙어 있습니다. 코드 레이블 표기상 오타입니다.  →  수정: '(acc, n) -> acc + n)'을 '(acc, n) -> acc + n'으로 수정하세요.

### D:\_Git_PWA\CodeMaster\src\content\packs\_staging\P1-pc.ts (rework, 24개)
- [medium/version] PACK: 총 스니펫 수가 24개로, 명세된 20개를 초과합니다. 주제 목록(def·args/kwargs·class·dataclass·typing·comprehension·with·decorator)에 없는 5개 주제(module-import, try-except, finally, raise, custom-exception)가 포함되어 있습니다.  →  수정: pc-module-import, pc-try-except, pc-finally, pc-raise, pc-custom-exception 중 4개를 제거하거나 별도 팩으로 분리하여 총 20개로 맞추세요. 해당 5개 스니펫은 예외 처리/import 주제로 이 팩의 커리큘럼 범위를 벗어납니다.
- [medium/topic] pc-module-import: 이 스니펫의 주제는 'import'이며, 팩 선언 주제(def·args/kwargs·class·dataclass·typing·comprehension·with·decorator)에 포함되지 않습니다.  →  수정: 별도의 'Python Standard Library' 팩으로 이동하거나 삭제하세요.
- [medium/topic] pc-try-except: try/except 예외 처리는 선언된 팩 주제(def·args/kwargs·class·dataclass·typing·comprehension·with·decorator)에 포함되지 않습니다.  →  수정: 별도의 'Python Exception Handling' 팩으로 이동하거나 삭제하세요.
- [medium/topic] pc-finally: finally 절 예외 처리는 선언된 팩 주제에 포함되지 않습니다.  →  수정: 별도의 예외 처리 팩으로 이동하거나 삭제하세요.
- [medium/topic] pc-raise: raise 예외 발생은 선언된 팩 주제에 포함되지 않습니다.  →  수정: 별도의 예외 처리 팩으로 이동하거나 삭제하세요.
- [medium/topic] pc-custom-exception: 커스텀 예외 정의(Exception 상속)는 선언된 팩 주제에 포함되지 않습니다.  →  수정: 별도의 예외 처리 팩으로 이동하거나 삭제하세요.
- [medium/code] pc-with-open: 코드 마지막 줄 `print(count_lines('note.txt'))` 가 실제 실행 시 FileNotFoundError를 발생시킵니다. note.txt 파일이 존재하지 않기 때문입니다. 문법 오류는 아니지만 학습자가 그대로 실행하면 즉시 에러가 납니다.  →  수정: 실행 가능한 예시로 교체하세요. 예: 임시 파일을 생성 후 읽거나, 주석으로 '# note.txt 파일이 있어야 해요'를 추가하거나, 파일 존재 시에만 호출하는 패턴으로 바꾸세요. 또는 `io.StringIO`를 사용한 인메모리 파일 예시로 변경하세요.
- [low/explain] pc-kwargs: terms 항목 중 `{ t: 'role=dev', d: '키=값 형태로 인수를 넘기는 호출이에요.' }` 에서 t 키가 'role=dev'로 따옴표 없이 표기되어 있습니다. 실제 Python 코드에서는 `role='dev'`처럼 값에 따옴표가 필요합니다. 또한 pitfall '키는 반드시 문자열이어야 해요'는 kwargs 키가 항상 식별자(str)이기 때문에 자명한 사실이며, 실질적인 함정이 아닙니다. 진짜 함정은 딕셔너리 언패킹(`**d`)으로 비문자열 키를 넘기려 하면 TypeError가 발생한다는 점입니다.  →  수정: t 값을 `"role='dev'"`로 수정해 Python 문법을 정확히 보여주세요. pitfall은 '딕셔너리를 **d로 넘길 때 키가 문자열이 아니면 TypeError가 나요'로 구체화하세요.
- [low/duplicate] pc-class-basic: pc-class-basic과 pc-init-init 모두 `__init__` 패턴을 핵심으로 다룹니다. pc-class-basic은 `__init__ + 인스턴스 메서드`를, pc-init-init은 `__init__ + 기본값 매개변수`를 다루며 개념 중복이 있습니다. 두 스니펫이 terms에서 `__init__` 설명을 거의 동일하게 반복합니다.  →  수정: pc-class-basic에서는 __init__을 최소한으로 소개하고 인스턴스 메서드(bark)에 집중하세요. pc-init-init에서는 기본값 매개변수와 속성 접근에 집중하여 역할을 명확히 분리하세요.

### D:\_Git_PWA\CodeMaster\src\content\packs\_staging\P2-pasync.ts (rework, 20개)
- [high/code] pasync-await-basic: asyncio를 사용하는 17개 스니펫(pasync-await-basic, pasync-run-entry, pasync-gather-concurrent, pasync-taskgroup-structured, pasync-queue-producer-consumer, pasync-queue-maxsize, pasync-lock-critical, pasync-event-signal, pasync-sleep-yield, pasync-create-task-bg, pasync-timeout-guard, pasync-to-thread-blocking, pasync-as-completed, pasync-cancel-task, pasync-sleep-0-yield, pasync-future-explicit, pasync-semaphore-limit) 모두 import asyncio 누락. 타 팩(P3-pdata.ts)은 import numpy as np를 코드 내에 명시함. 실행 시 NameError: name 'asyncio' is not defined 발생.  →  수정: 각 코드 스니펫 첫 줄에 import asyncio 추가. pasync-to-thread-blocking은 이미 import time이 있으므로 그 위에 추가.
- [high/code] pasync-queue-maxsize: maxsize=2인 큐에 소비자 없이 생산자가 5개(range(5))를 put한다. put(0), put(1) 후 큐가 가득 차고 세 번째 await q.put(2)에서 영원히 블록(데드락). 코드가 끝까지 실행되지 않아 학습 예제로 동작 불가. pitfall에서 이 상황을 경고하지만 코드 자체가 그 버그를 재현하는 구조.  →  수정: 소비자 코루틴을 추가하거나 소비자와 함께 asyncio.gather로 실행하는 형태로 수정해 정상 동작하는 예제로 교체. 또는 items를 2개(range(2))로 줄여 데드락을 피하고 별도 pitfall 예제로 분리.
- [medium/explain] pasync-threading-cpu: concept에 '커널을 열어 한꺼번에 돌려요'라는 부정확한 설명 포함. threading은 커널을 여는 것이 아니라 OS가 관리하는 스레드를 생성해 동시 실행하는 방식임.  →  수정: '커널을 열어 한꺼번에 돌려요' → 'OS 스레드를 여러 개 만들어 동시에 실행하는 것처럼 보이게 해요'로 수정.
- [medium/explain] pasync-threading-cpu: explain.why가 '입출력이 많은 일을 동시에 돌리는 데 써요'라고 하지만 코드는 I/O가 없는 단순 print+range 루프. 학습자가 코드와 설명 간 불일치를 겪음.  →  수정: 코드를 time.sleep이나 파일 읽기 등 실제 I/O가 있는 예제로 교체하거나, why를 '순서 없이 여러 작업을 번갈아 실행하는 방식을 보여줘요' 처럼 코드에 맞게 수정.
- [medium/explain] pasync-future-explicit: asyncio.Future term 설명이 '결과 자리를 미리 만들어 두는 저예요' — '저예요'는 오타로 문장이 의미 불명. '것이에요' 또는 '객체예요'가 맞음.  →  수정: '저예요' → '것이에요' 또는 '객체예요'로 수정.
- [low/explain] pasync-as-completed: pitfall에 '차이가 크아요' 오타. 자연스러운 한국어는 '커요'.  →  수정: '크아요' → '커요'로 수정.
- [low/code] pasync-multiprocessing-cpu: title이 'Multiprocessing CPU 병럴' — '병럴'은 오타. '병렬(竝列)'이 맞음.  →  수정: '병럴' → '병렬'로 수정.
- [low/explain] pasync-await-basic: asyncio.run term 설명이 '비동기 프로그램을 시작점에서 출발시켜 주는 시동호예요' — '시동호'는 의미 불명 오타. '시동기' 또는 '진입점'이 맞음.  →  수정: '시동호예요' → '진입점이에요' 또는 '시동 장치예요'로 수정.
- [low/explain] pasync-lock-critical: concept에 '공유한 자원을 동시에 만지면 꼬꼬되는 걸 막아요' — '꼬꼬되는'은 오타. '꼬이는'이 맞음.  →  수정: '꼬꼬되는' → '꼬이는'으로 수정.

### D:\_Git_PWA\CodeMaster\src\content\packs\_staging\P3-pdata.ts (minor, 23개)
- [high/explain] pdata-numpy-broadcast-column: pitfall에 'b를 [10, 20]으로 쓰면 (3,)이 돼서'라고 적혀 있으나, np.array([10, 20]).shape은 (2,)이지 (3,)이 아님. 사실과 다른 shape 값을 학습자에게 제공함.  →  수정: '(3,)이 돼서'를 '(2,)이 돼서'로 수정. 정확한 오류 원인도 추가: shape (2,3) + (2,) → 끝 차원 3 vs 2 불일치로 브로드캐스트 실패.
- [low/explain] pdata-numpy-broadcast-column: terms에서 b (2x1) 항목 설명이 '2행 1열짜기 세로 벡터'로 오타가 있음. '짜기'는 '짜리'의 오타.  →  수정: '2행 1열짜기'를 '2행 1열짜리'로 수정.
- [medium/version] ALL: 파일에 스니펫이 총 23개 존재하나, 과제 명세는 '약 20문제'로 기술함. 초과 3개: pdata-numpy-broadcast-column, pdata-read-csv, pdata-read-excel.  →  수정: 목표 개수(20개)에 맞게 중복·유사 패턴 스니펫 3개를 제거하거나 명세를 23개로 갱신할 것.
- [medium/duplicate] pdata-numpy-broadcast-scalar,pdata-numpy-broadcast-column: pdata-numpy-broadcast-scalar(스칼라 덧셈)와 pdata-numpy-broadcast-column(열 벡터 덧셈)이 동일 개념(브로드캐스트)을 다루며, 브로드캐스트 규칙 설명도 거의 같음. 학습 단계 차별화가 부족함.  →  수정: 두 스니펫을 하나로 통합하거나 한쪽은 고급 2D 브로드캐스트(행+열 동시 확장)로 차별화.
- [medium/duplicate] pdata-pandas-merge-inner,pdata-pandas-merge-how: merge-inner와 merge-how가 거의 동일한 코드 구조(left/right DataFrame 생성 후 pd.merge 호출)로, how= 파라미터 하나만 다름. 패턴 중복.  →  수정: 두 스니펫을 하나로 통합하고 how 옵션을 한 코드 안에서 비교 설명하거나, merge-inner를 삭제하고 merge-how 설명에 inner 동작을 포함.
- [medium/duplicate] pdata-read-csv,pdata-read-excel: read-csv와 read-excel이 '파일 읽기 → head() 확인' 동일 패턴이며 사용 API만 다름. 두 항목 모두 포함하면 학습팩 구성 비용 대비 중복 가치가 낮음.  →  수정: read-csv를 유지하고 read-excel은 제거하거나, 하나의 스니펫에서 두 API를 비교 설명.
- [medium/explain] pdata-pandas-loc-iloc: pitfall이 '슬라이싱 시 끝 라벨 포함 여부'를 설명하나, 코드는 df.loc['lee'] / df.iloc[1] 같은 스칼라 접근만 보여줌. 코드에서 시연하지 않은 개념을 pitfall에서 갑자기 언급해 입문자에게 혼란을 줄 수 있음.  →  수정: 코드에 슬라이싱 예시(df.loc['kim':'park'] vs df.iloc[0:2])를 추가하거나, pitfall을 스칼라 접근 시 흔한 실수(라벨 오타, 정수 인덱스와 혼동 등)로 교체.

### D:\_Git_PWA\CodeMaster\src\content\packs\_staging\P4-pml.ts (minor, 20개)
- [high/explain] pml-xgboost-early-stopping: pitfall 설명이 사실과 반대다. '학습 데이터를 eval_set에 넣으면 자기 점수만 보고 일찍 멈출 수 있다'고 쓰여 있으나, 학습 데이터를 eval_set에 넣으면 점수가 계속 오르기 때문에 오히려 일찍 멈추지 않는다. 진짜 함정은 코드 자체가 X_test를 eval_set으로 쓰는 것(테스트 데이터를 훈련 결정에 사용하는 데이터 누수)인데 pitfall이 이를 경고하지 않고 엉뚱한 내용을 적고 있다.  →  수정: pitfall을 '학습 종료 시점을 결정하는 eval_set에 최종 테스트 데이터를 넣으면 테스트 정보가 학습에 새어 들어가는 데이터 누수가 발생해요. 별도의 검증 세트(X_val)를 eval_set에 써야 해요.'로 교체하고, 코드도 X_test 대신 별도 X_val을 사용하도록 수정.
- [high/code] pml-lightgbm-categorical: X_train만 astype('category')로 변환하고 X_test는 변환하지 않은 채 model.score(X_test, y_test)를 호출한다. LightGBM은 학습 시 category dtype을 기준으로 범주를 내부 인코딩하므로, 예측 시 X_test가 다른 dtype이면 잘못된 예측 또는 경고/오류가 발생한다. 코드가 pitfall에서 경고하는 바로 그 실수를 저지르고 있다.  →  수정: model.fit() 호출 전 또는 score() 호출 전에 X_test[cat_cols] = X_test[cat_cols].astype('category') 를 추가해 학습/테스트 dtype을 일치시킨다.
- [medium/topic] pml-svm-classifier: 이 팩의 명시 주제는 Scikit-Learn·Pipeline·train_test_split·XGBoost·LightGBM이다. SVC(Support Vector Machine) 자체는 명시된 주제 목록에 없으며, 다른 19개 스니펫과 달리 Pipeline·부스팅 계열과 직접 연관이 없다. 주제 범위를 벗어난 스니펫이다.  →  수정: SVC 스니펫을 제거하거나, Pipeline 안에서 SVC를 쓰는 예시로 재구성해 Pipeline 주제와 연결시킨다.
- [medium/topic] pml-joblib-save-load: joblib 모델 저장/불러오기는 선언된 주제(Scikit-Learn·Pipeline·train_test_split·XGBoost·LightGBM)에 포함되지 않는 유틸리티 주제다. 학습팩 주제 범위와 직접 연관이 낮다.  →  수정: 주제 목록에 'joblib / model persistence'를 추가하거나, 해당 스니펫을 별도 팩으로 이동한다.
- [low/explain] pml-fit-predict: terms 중 predict의 설명이 '새 데이터의 정답을 guessing'으로, 한국어 문장 안에 영어 단어 'guessing'이 혼용되어 있다. 입문자에게 일관성 없는 표현이다.  →  수정: '새 데이터에 학습한 규칙을 적용해 정답을 추정함'과 같이 한국어로 통일한다.

### D:\_Git_PWA\CodeMaster\src\content\packs\_staging\P5-pdl.ts (minor, 20개)
- [high/code] pdl-activation: `import torch.nn.functional as F` is declared at the top of the code block but `F` is never referenced anywhere. All three activations are called as `torch.relu`, `torch.sigmoid`, `torch.tanh` — making the import dead code. For a beginner this is actively confusing: they see an import that looks essential but does nothing, and they cannot infer when or why to use `F.relu()` vs `torch.relu()`.  →  수정: Either (a) remove the unused import and keep `torch.relu / torch.sigmoid / torch.tanh`, or (b) replace the three calls with `F.relu(x)`, `F.sigmoid(x)`, `F.tanh(x)` to justify the import and demonstrate the `torch.nn.functional` usage pattern.
- [medium/code] pdl-eval: The `terms` array includes `{ t: 'train', d: '다시 학습 모드로 돌아가요.' }` but `model.train()` never appears anywhere in the snippet's code. The term describes a call that is invisible to the reader — a phantom term with no code anchor.  →  수정: Either add `model.train()` as a commented-out line at the end of the snippet (e.g., `# model.train()  # 학습 모드로 복귀`) so learners can see the paired API, or remove the `train` term entry from `terms` and add a `pitfall` note mentioning that `eval()` must be paired with `train()` when switching back.
- [medium/code] pdl-optimizer: The zero_grad/forward/loss order in the code is: `loss = nn.functional.mse_loss(model(x), y)` → `opt.zero_grad()` → `loss.backward()` → `opt.step()`. This places `zero_grad()` *after* the forward pass and loss computation. The canonical and universally taught PyTorch order is `zero_grad → forward → loss → backward → step`. The sibling snippet `pdl-training-loop` correctly uses the standard order, creating a direct contradiction that will confuse beginners.  →  수정: Reorder to: `opt.zero_grad()` first, then `pred = model(x)`, then `loss = nn.functional.mse_loss(pred, y)`, then `loss.backward()`, then `opt.step()`. This matches both PyTorch documentation and the `pdl-training-loop` snippet.
- [medium/version] pdl-save-load: `torch.load("model.pt")` without `weights_only=True` triggers a `FutureWarning` in PyTorch ≥ 2.0. In PyTorch ≥ 2.6 the default flips to `weights_only=True` (which is safe for `state_dict` but breaks pickled non-tensor objects). A learner running PyTorch 2.x will see a warning that the snippet does not explain, and on PyTorch 2.6+ the behavior silently changes.  →  수정: Change to `torch.load("model.pt", weights_only=True)` and add a pitfall note explaining that `weights_only=True` is the safe default for loading `state_dict` files in PyTorch 2.x.
- [medium/schema] pdl-optimizer: The `explain` object is missing the `why` field. The schema requires `concept + terms(2개 이상) + why`. The `pdl-optimizer` snippet only has `concept`, `terms`, and `pitfall` — no `why`. Four other snippets (`pdl-eval`, `pdl-dataloader`, `pdl-save-load`, `pdl-device`) also omit `why`, but `pdl-optimizer` is the most impactful omission as it introduces the core training API.  →  수정: Add a `why` field, e.g., `why: '손실을 줄이는 방향으로 가중치를 자동으로 조금씩 고쳐줘서 사람이 직접 계산할 필요가 없어요.'`
- [low/explain] pdl-activation: Korean grammar error in `concept`: `배울게 해줘요` should be `배울 수 있게 해줘요`. The contracted form `배울게` is not standard written Korean and reads unnaturally to a native speaker.  →  수정: Change `복잡한 패턴을 배울게 해줘요` → `복잡한 패턴을 배울 수 있게 해줘요`.

### D:\_Git_PWA\CodeMaster\src\content\packs\_staging\P6-pllm.ts (rework, 20개)
- [high/code] pllm-pipeline-summarize: runtime ValueError: HuggingFace summarization pipeline의 기본 min_length(56)가 max_length=15보다 크기 때문에 실행하면 'Your min_length=56 must be inferior to your max_length=15' 에러가 발생한다. 예시 입력 텍스트(약 20 토큰)도 기본 요약 모델(facebook/bart-large-cnn)이 요구하는 최소 입력 길이보다 짧아 두 번째 에러 원인이 된다.  →  수정: max_length를 60 이상(예: max_length=60, min_length=10)으로 늘리거나, summ(text, max_length=60, min_length=10)처럼 min_length를 명시적으로 지정하고, 예시 텍스트도 3~4문장 이상의 충분히 긴 문장으로 교체해야 한다.
- [high/explain] pllm-cosine-sim: terms의 util.cos_sim 설명에서 '0~1로 재는 함수'라고 설명하나, 코사인 유사도의 수학적 범위는 -1~1이다. concept에도 '0~1로 재는 척도'라 표기되어 있어 입문자에게 잘못된 개념을 심어준다. sentence-transformers의 util.cos_sim도 -1~1 범위 텐서를 반환한다.  →  수정: concept와 terms 모두 '-1~1로 재는 척도'로 수정하고, 임베딩 벡터의 경우 보통 양수여서 실제로는 0~1 사이에 가까운 경우가 많지만 정확한 범위는 -1~1임을 pitfall에 명시한다.
- [medium/explain] pllm-pipeline-ner: pipeline('ner') 기본 호출은 aggregation_strategy=None이어서 서브워드 토큰(예: '##nia', '##for')이 개별 엔티티로 쪼개져 반환된다. 입문자에게 가장 혼란스러운 함정인데 pitfall은 문맥 의존성만 언급하고 이 핵심 함정을 누락했다.  →  수정: pitfall을 '기본 설정에서는 서브워드 토큰이 따로 분리돼 결과가 지저분하게 나와요. aggregation_strategy="simple"을 추가하면 같은 단어를 합쳐서 깔끔하게 볼 수 있어요.'로 교체하거나 코드에 aggregation_strategy='simple'을 추가한다.
- [medium/explain] pllm-mean-pooling: pitfall에서 '패딩 칸까지 평균에 포함하면 결과가 흐려진다'고 언급하지만, 코드는 실제로 패딩 마스크를 적용하지 않고 단순 .mean(dim=1)을 사용한다. 코드 자체가 pitfall에서 경고하는 잘못된 방식을 그대로 보여주는 모순이 있다.  →  수정: 코드를 단일 문장('hello world')으로 유지하면서 pitfall을 '단일 문장엔 패딩이 없지만, 여러 문장을 배치로 처리할 때는 패딩된 위치를 attention_mask로 제외하고 평균 내야 올바른 임베딩이 나와요.'로 수정하거나, 코드에 attention_mask 마스킹을 적용한 올바른 mean pooling을 보여준다.
- [low/version] pllm-automodel-load: AutoModel만 로드하는 코드는 분류·생성 등 태스크에 쓸 수 없음에도 단순히 model.config.hidden_size를 출력하는 것에 그쳐 학습팩의 다른 스니펫들과 연결성이 떨어진다. AutoModel과 AutoModelForXxx의 구분이 pitfall('분류용 머리(head)는 없어요')에만 언급되어 입문자에게 혼란을 줄 수 있다.  →  수정: pitfall에 'AutoModelForSequenceClassification처럼 태스크 전용 클래스를 쓰면 바로 분류에 쓸 수 있어요.'를 추가해 입문자가 다음 단계로 나아가도록 안내한다.

### D:\_Git_PWA\CodeMaster\src\content\packs\_staging\P7-prag.ts (rework, 20개)
- [high/code] prag-retriever-topk: Store.search가 쿼리 벡터 q와 self.vecs를 완전히 무시하고, 문자열의 첫 글자(d[0])로 알파벳 정렬만 수행한다. 즉 `sorted(self.docs, key=lambda d: d[0])[:k]`는 벡터 유사도와 무관하다. 이 코드는 실행은 되지만 Top-K 벡터 검색을 전혀 시연하지 않으며, 어떤 쿼리를 넣어도 항상 같은 알파벳 순 결과를 반환한다. 학습자에게 완전히 잘못된 개념을 주입한다.  →  수정: Store.search에서 q 벡터와 self.vecs 간의 내적(dot product)으로 점수를 산출해야 한다. 예: `pairs = sorted(zip(self.docs, self.vecs), key=lambda dv: sum(a*b for a,b in zip(q, dv[1])), reverse=True); return [d for d,_ in pairs[:k]]`
- [medium/code] prag-mmrrerank: MMR div 계산이 `doc_vecs[picked[-1]]`(마지막으로 고른 문서)와의 유사도만 사용한다. 표준 MMR은 `max(sim(d_i, d_j) for d_j in picked)` — 이미 선택한 모든 문서 중 가장 유사한 것과 비교한다. k>=3일 때, 2번째 이후 선택 순서에 따라 결과가 표준 MMR과 달라질 수 있다. explain의 `div` 설명이 '이미 고른 결과와 얼마나 겹치는지'라고 하지만 코드는 마지막 하나만 본다.  →  수정: `div = 0 if not picked else max(sum(a*b for a,b in zip(doc_vecs[i], doc_vecs[j])) for j in picked)` 로 수정해 표준 MMR 공식과 일치시킨다.
- [medium/topic] prag-prompt-tmpl: 팩 주제 범위(Chunking·Embedding·VectorStore·Retriever·Reranker·Hybrid Search)에 프롬프트 템플릿은 포함되지 않는다. 이 스니펫은 RAG의 'G(Generation)' 단계 프롬프트 조립을 다루며, 6개 명시 토픽 어디에도 해당하지 않는다.  →  수정: 해당 스니펫을 삭제하거나, 팩 주제 정의에 'Prompt Assembly' 또는 'RAG Pipeline'을 명시적으로 추가한다.
- [medium/topic] prag-prompt-strict: prag-prompt-tmpl과 동일한 이유로 주제 이탈. '자료에 없으면 모른다고 해' 규칙을 삽입하는 프롬프트 엔지니어링 기법으로, 6개 RAG 토픽(Chunking·Embedding·VectorStore·Retriever·Reranker·Hybrid Search) 범위 밖이다.  →  수정: prag-prompt-tmpl과 함께 삭제하거나 팩 주제 범위를 확장한다. 남길 경우 두 스니펫이 사실상 '프롬프트 조립' 변형으로 서로 유사한 패턴임도 검토 필요.
- [low/code] prag-rrf: enumerate(ranking)의 pos는 0-based(0,1,2,...)이므로 1등 문서 점수가 `1/(60+0)=1/60`이 된다. 표준 RRF 공식은 rank가 1-based여서 1등 = `1/(c+1)=1/61`이다. 상대 순위는 바뀌지 않지만 공식과 차이가 있고, pitfall 설명(`c값이 너무 작면`)에서 '작으면'이 더 자연스러운 한국어이다.  →  수정: enumerate 호출을 `enumerate(ranking, start=1)`로 변경해 `1/(c + pos)` 공식이 표준과 일치하도록 수정한다.

### D:\_Git_PWA\CodeMaster\src\content\packs\_staging\P8-pagent.ts (rework, 20개)
- [high/code] pagent-react-loop: 코드 내에서 call_tool()을 호출하지만 이 스니펫 파일(react_loop.py)에는 해당 함수가 정의되어 있지 않습니다. pagent-toolcall-basic에서 정의되지만 각 스니펫은 독립 파일이므로 실행 시 NameError가 발생합니다.  →  수정: 스니펫 상단에 call_tool 함수 정의를 인라인으로 추가하거나, call_tool 호출 대신 직접 get_weather('서울') 을 호출하도록 변경하세요.
- [high/explain] pagent-plan-decompose: why 필드에 '하나씩 해칠 수 있어요'라고 쓰여 있는데, '해치다'는 '해를 끼치다(to harm/damage)'라는 뜻입니다. 입문자에게 의미가 정반대로 전달됩니다. 의도한 단어는 '해내다(to accomplish)'입니다.  →  수정: '하나씩 해칠 수 있어요'를 '하나씩 해낼 수 있어요'로 수정하세요.
- [medium/code] pagent-parallel: concept에서 '여러 에이전트가 동시에 일해서'라고 설명하지만, 실제 코드는 단순 for 루프로 순차 실행합니다. threading이나 asyncio 없이는 병렬이 아닙니다. 입문자가 이 코드를 보고 병렬 실행이라고 오해할 수 있습니다.  →  수정: concept/why 설명에서 '동시에'를 제거하고 '각 에이전트를 순서대로 호출해 결과를 모으는' 방식임을 명확히 하거나, 실제 asyncio.gather() 기반 병렬 예시로 교체하세요.
- [medium/code] pagent-llm-decide: TS 템플릿 리터럴에서 줄 끝 백슬래시(\)는 줄 연결로 처리되어, 렌더링된 Python 코드의 f-string prompt가 '질문: {question}도구 선택:'가 됩니다(공백·줄바꿈 없음). 또한 reply = "search"는 콜론이 없으므로 split(":")[-1].strip() 로직이 아무 의미 없이 동일한 값을 반환해 입문자에게 혼란을 줍니다.  →  수정: f-string을 한 줄로 작성하고(f"질문: {question}\n도구 선택:"), 또는 prompt를 별도 변수로 분리하세요. split 파싱 로직은 reply = "도구: search" 형태의 예시 응답과 함께 제시해 로직이 실제로 작동하는 것을 보이세요.
- [low/explain] pagent-self-critique: concept 유추 문구에 '초고정을 읽으며'라고 쓰여 있는데, '초고정'은 표준 한국어 단어가 아닙니다. '초고(를)'의 오타로 보입니다.  →  수정: '작가가 초고정을 읽으며'를 '작가가 초고를 읽으며'로 수정하세요.

### D:\_Git_PWA\CodeMaster\src\content\packs\_staging\P9-pframe.ts (rework, 20개)
- [high/code] pframe-llamaindex-nodes: from llama_index.core import Document, SimpleNodeParser — SimpleNodeParser가 LlamaIndex 0.10.0(2024-02)에서 llama_index.core에서 완전 제거됐다. 해당 import는 ImportError를 일으킨다. 현재 대체 클래스는 llama_index.core.node_parser의 SentenceSplitter 또는 TokenTextSplitter다.  →  수정: import를 `from llama_index.core.node_parser import SentenceSplitter`로 변경하고 `parser = SentenceSplitter(chunk_size=100)` / `nodes = parser.get_nodes_from_documents([doc])`로 수정한다.
- [high/code] pframe-chain-basic: LLMChain과 chain.run()은 LangChain 0.2.0(2024-05)에서 공식 deprecated됐으며 향후 버전에서 제거 예정이다. 교육 콘텐츠 주제가 LCEL임에도 구형 Chain API를 보여주는 것은 방향이 어긋난다. 또한 `llm` 변수가 정의 없이 참조되어 코드 단독 실행 시 NameError가 발생한다(다른 snippets도 같은 문제이나 이 snippet이 첫 번째로 llm을 도입).  →  수정: LCEL 방식으로 대체: `chain = prompt | llm | StrOutputParser()` / `result = chain.invoke({'topic': '파이썬'})`. 또는 파일 상단에 `from langchain_openai import ChatOpenAI; llm = ChatOpenAI()` 같은 최소 초기화 코드를 추가한다.
- [high/code] pframe-dspy-module: explain.why 필드 값 '복�잡한 흐름을...' — '복잡' 사이에 U+FFFD 대체 문자(깨진 바이트)가 포함되어 있다. 빌드 도구나 런타임 JSON 파싱에서 인코딩 오류를 유발할 수 있다.  →  수정: '복잡한 흐름을 한 단위로 재사용하고 최적화할 수 있어요.'로 교체한다(깨진 문자 제거).
- [medium/version] pframe-lcel-pipe: `from langchain.schema.output_parser import StrOutputParser` — langchain 0.1.0 이후 StrOutputParser의 canonical 위치는 langchain_core.output_parsers이며, langchain.schema.output_parser는 deprecated shim이다. 학습 콘텐츠로 현재 권장 경로를 가르쳐야 한다.  →  수정: `from langchain_core.output_parsers import StrOutputParser`로 변경한다.
- [medium/version] pframe-runnable-passthrough: `from langchain.schema.runnable import RunnablePassthrough` — canonical 위치는 langchain_core.runnables이며, langchain.schema.runnable은 deprecated shim이다.  →  수정: `from langchain_core.runnables import RunnablePassthrough`로 변경한다.
- [medium/version] pframe-runnable-parallel: `from langchain.schema.runnable import RunnableParallel, RunnablePassthrough` — 동일하게 deprecated shim 경로다.  →  수정: `from langchain_core.runnables import RunnableParallel, RunnablePassthrough`로 변경한다.
- [medium/version] pframe-memory-buffer: `from langchain.memory import ConversationBufferMemory` — ConversationBufferMemory는 langchain 0.2.x에서 langchain_community.memory로 이동됐으며 langchain.memory에서의 import는 deprecated다. langchain-community 패키지가 별도 설치 필요하다.  →  수정: `from langchain_community.memory import ConversationBufferMemory`로 변경하고, 설치 주석 `# pip install langchain-community`를 추가한다.
- [medium/code] pframe-autogen-groupchat: `GroupChatManager(groupchat=group, llm_config={})` — llm_config에 빈 딕셔너리를 넘기면 GroupChatManager가 발언 순서 결정에 LLM을 사용하려 할 때 런타임 오류가 발생한다. 예제가 실행 불가 상태다.  →  수정: `llm_config={"config_list": [{"model": "gpt-4o", "api_key": "..."}]}`처럼 실제 설정을 넣거나, 발언 순서 결정에 LLM이 필요 없는 `speaker_selection_method='round_robin'`을 GroupChat에 추가한다.
- [medium/code] pframe-streaming: 코드가 `prompt`, `llm`, `StrOutputParser`를 import 없이 사용한다. 다른 snippet에서는 import를 생략해도 맥락상 이해 가능하지만, 이 snippet은 독립 파일(streaming.py)이므로 필요한 import를 명시해야 한다.  →  수정: 파일 상단에 `from langchain_core.output_parsers import StrOutputParser`, prompt와 llm 정의를 추가하거나, 코드 앞에 `# (앞 예제에서 정의된 prompt, llm, StrOutputParser 사용)` 주석을 달아 의존성을 명시한다.
- [medium/code] pframe-llamaindex-chat: 코드가 `index` 변수를 정의 없이 사용한다. 독립 파일(llama_chat.py)이므로 앞 snippet의 index 객체에 의존하면 실행 불가다.  →  수정: 파일 상단에 `from llama_index.core import VectorStoreIndex, Document; index = VectorStoreIndex.from_documents([Document(text='...')])` 등 최소 초기화 코드를 추가한다.
- [medium/code] pframe-crew-task: 코드가 `researcher` 변수를 정의 없이 사용한다. 독립 파일(crew_task.py)이므로 앞 snippet에 암묵적으로 의존한다.  →  수정: 파일 상단에 앞 예제(pframe-crew-role)의 `researcher` 정의 코드를 포함하거나, `# (앞 예제에서 정의된 researcher 사용)` 주석을 추가한다.
- [medium/code] pframe-crew-flow: `researcher`, `writer`, `task1`, `task2` 변수가 모두 정의 없이 참조된다. 독립 실행 시 NameError 발생.  →  수정: 위 변수들의 최소 정의를 포함하거나, 이 snippet이 앞 예제들에 의존함을 명시하는 주석을 추가한다.
- [medium/code] pframe-dspy-teleprompter: `dspy.Example`을 import 없이 사용(`import dspy`가 없고 `from dspy.teleprompt import BootstrapFewShot`만 있다). 또한 `Summarizer` 클래스도 앞 snippet에 의존하며 미정의다.  →  수정: 파일 상단에 `import dspy`를 추가하고 `Summarizer` 클래스 정의 또는 참조 주석을 포함한다.
- [low/explain] pframe-runnable-passthrough: explain.why가 '여러 입력을 한꺼번에 묶어 전달할 때 빈 자리를 채워줘요'라고 설명하는데, 이는 RunnableParallel과 함께 쓸 때의 용도에 가깝다. RunnablePassthrough 단독의 핵심 용도(값을 그대로 통과)를 설명하는 why가 약하다.  →  수정: why를 '파이프 중간에 값을 가공하지 않고 그대로 전달해야 할 때 자리를 지켜줘요. RunnableParallel과 함께 원본 값을 보존할 때 자주 써요.'로 보강한다.

### D:\_Git_PWA\CodeMaster\src\content\packs\_staging\P10-pprod.ts (rework, 20개)
- [high/code] pprod-sqlalchemy-session: 코드가 engine과 User를 사용하지만 해당 스니펫 안에서 전혀 import하거나 정의하지 않아요. 단독 실행 시 NameError: name 'engine' is not defined 로 즉시 깨져요. 또한 sessionmaker(bind=engine) 의 bind= 키워드 인자는 SQLAlchemy 2.0에서 deprecated되어 DeprecationWarning이 발생하고, SA 2.1에서는 제거될 예정이에요.  →  수정: 스니펫 상단에 from sqlalchemy import create_engine, from sqlalchemy.orm import declarative_base, Column, Integer, String 과 User 클래스 정의를 추가하거나, 이전 스니펫을 참조한다는 주석을 달아야 해요. sessionmaker(bind=engine) 은 Session = sessionmaker(engine) 으로 수정해야 해요.
- [high/code] pprod-sqlalchemy-query: 코드가 session과 User를 사용하지만 스니펫 안에서 전혀 정의하거나 import하지 않아요. 단독 실행 시 NameError: name 'session' is not defined 로 즉시 깨져요.  →  수정: 스니펫 상단에 필요한 import와 session/User 정의를 추가하거나, 앞 스니펫에서 이어지는 코드임을 명확히 표시해야 해요.
- [high/explain] pprod-ruff-lint: terms에서 def f(x) 항목의 설명이 '짧은 함수 이름도 알아보기 힘들다고 지적해요'라고 되어 있는데 이는 사실과 달라요. ruff는 기본 규칙에서 짧은 함수 이름을 지적하지 않아요. E741은 l, O, I 처럼 시각적으로 혼동되는 이름만 플래그 하며, f 는 해당 없어요. 잘못된 설명이 입문자에게 존재하지 않는 ruff 규칙을 학습시켜요.  →  수정: def f(x) 항목을 E741 규칙 설명으로 교체하거나(예: x = l 같은 예시), 아예 해당 terms 항목을 삭제하고 E401(다중 import)과 E225(연산자 공백) 두 가지 실제 발생 규칙만 설명해야 해요.
- [medium/version] pprod-sqlalchemy-session: sessionmaker(bind=engine) 의 bind= 파라미터는 SQLAlchemy 2.0에서 deprecated 되었어요. 현재 권장 방식은 Session = sessionmaker(engine) 이에요. 스니펫이 2025년 이후 환경에서 경고를 발생시켜요.  →  수정: Session = sessionmaker(engine) 으로 수정하고, explain의 terms에서 bind 파라미터 설명을 제거해요.
- [medium/code] pprod-mypy-type-check: greet(123) 이 모듈 최상위에서 실행되는데, 런타임에서 TypeError: can only concatenate str (not 'int') to str 로 즉시 크래시가 나요. mypy 데모 목적의 의도적인 오류 코드이지만, concept나 pitfall에서 전혀 이를 언급하지 않아 입문자가 실행하면 당황해요.  →  수정: pitfall 또는 concept에 '이 코드를 그대로 실행하면 런타임에서도 오류가 발생해요. mypy는 실행 전에 이 문제를 미리 잡아준다는 점이 핵심이에요'라는 설명을 추가해야 해요.
- [medium/duplicate] pprod-pydantic-validate: pprod-pydantic-basemodel에서 이미 동일한 User(BaseModel) 클래스(name: str, age: int)를 정의했는데, pprod-pydantic-validate에서 그 클래스 정의를 그대로 반복한 후 인스턴스화만 추가해요. 클래스 정의 패턴이 사실상 중복이에요.  →  수정: pprod-pydantic-validate의 코드에서 User 클래스 재정의 없이 인스턴스 생성·속성 접근·자동 검증(예: ValidationError 예시) 등 차별화된 내용에 집중하거나, 클래스 정의 없이 from models import User 형태로 이전 스니펫 참조를 명시해야 해요.
- [low/explain] pprod-redis-set-get: redis-py의 r.get()은 기본적으로 bytes를 반환해요 (예: b'1'). print(r.get('count')) 는 b'1'을 출력하는데, 설명에서 이를 전혀 언급하지 않아 입문자가 문자열을 기대하다 혼동할 수 있어요.  →  수정: pitfall에 'r.get()은 문자열이 아닌 bytes를 반환해요. 문자열로 쓰려면 r.get("count").decode() 또는 Redis(decode_responses=True) 옵션을 사용해요'를 추가해요.

### D:\_Git_PWA\CodeMaster\src\content\packs\_staging\P11-pvec.ts (rework, 20개)
- [high/code] pvec-qdrant-upsert: recreate_collection()은 qdrant_client>=1.7에서 deprecated, >=1.9에서 완전히 제거됨. 현재 최신 qdrant_client 설치 시 AttributeError로 실행 불가.  →  수정: from qdrant_client import models 추가 후 client.create_collection('docs', vectors_config=models.VectorParams(size=4, distance=models.Distance.COSINE))으로 교체
- [high/code] pvec-qdrant-filter: pvec-qdrant-upsert와 동일하게 recreate_collection()을 사용. qdrant_client>=1.9에서 AttributeError 발생하여 실행 불가.  →  수정: create_collection() + VectorParams 형식으로 교체
- [high/code] pvec-weaviate: weaviate-client v4(connect_to_local()은 v4 API)에서 col.data.insert()의 vector는 반드시 별도 키워드 인자로 전달해야 함. 현재 코드는 'vector'를 properties dict 안에 넣어 일반 메타데이터 필드로 저장되고 임베딩 벡터는 저장되지 않음. 이후 near_vector 검색 결과가 의미 없거나 오류 발생.  →  수정: col.data.insert(properties={'text': 'hello world', 'tag': 'news'}, vector=[0.1, 0.2, 0.3]) 형태로 수정
- [high/code] pvec-chroma: chromadb.Client()는 chromadb>=0.4.0에서 deprecated, >=0.5.0에서 제거됨. 현재 버전에서 실행 시 AttributeError 또는 ImportError 발생.  →  수정: chromadb.Client() → chromadb.EphemeralClient() (인메모리 용도)로 교체
- [medium/explain] pvec-l2: concept 필드에 한글 문장 내 중국어 한자 '地点'이 그대로 삽입됨: '지도에서 두地点 사이를 자로 잰 것과 같아요.' 입문자 콘텐츠에 부적절한 오기.  →  수정: '두地点' → '두 지점' 또는 '두 장소'로 수정
- [medium/topic] pvec-chroma: Chroma는 선언된 주제 목록(pgvector·Qdrant·Weaviate·Milvus·FAISS·HNSW·메타데이터 필터)에 포함되지 않음. 주제 이탈 스니펫.  →  수정: 팩 주제 목록에 Chroma를 추가하거나, 해당 스니펫을 삭제하고 주제에 맞는 스니펫(예: Qdrant 컬렉션 설정 등)으로 대체
- [medium/code] pvec-milvus: MilvusClient.insert()의 두 번째 인자는 공식적으로 List[dict]를 요구함. 단일 dict를 전달하면 pymilvus 버전에 따라 동작이 다르며 일부 버전에서는 오류 발생. pvec-milvus-filter도 동일 패턴.  →  수정: client.insert('docs', [{'id': 1, 'vector': [0.1]*8, 'text': 'hello'}]) 형태로 리스트로 감싸기
- [medium/code] pvec-milvus-filter: pvec-milvus와 동일하게 insert()에 단일 dict 전달. 리스트로 감싸야 공식 pymilvus API에 부합.  →  수정: client.insert('docs', [{'id': 1, 'vector': [0.1]*8, 'tag': 'news'}]) 형태로 수정

### D:\_Git_PWA\CodeMaster\src\content\packs\_staging\P12-pserve.ts (rework, 20개)
- [high/code] pserve-vllm-async: AsyncLLMEngine.generate() 의 두 번째 위치 인자 sampling_params가 누락됐다. vLLM 소스에서 시그니처는 generate(inputs, sampling_params: SamplingParams, request_id: str, ...) 이며 sampling_params에 기본값이 없다. 현재 코드 engine.generate('안녕', request_id='1') 는 실행 시 TypeError를 발생시킨다.  →  수정: from vllm import AsyncEngineArgs, AsyncLLMEngine, SamplingParams 로 import를 수정하고, engine.generate('안녕', SamplingParams(max_tokens=64), request_id='1') 처럼 sampling_params를 두 번째 인자로 전달해야 한다.
- [high/code] pserve-awq-config: model.quantize('data.txt', quant_config=qcfg) 에서 첫 번째 인자 calib_data는 List[str] (캘리브레이션 문장 목록)이어야 한다. 'data.txt' 라는 파일명 문자열 하나를 넘기면 라이브러리가 단일 문자열을 단어 단위로 쪼개거나 오류를 낸다. autoawq API 시그니처: quantize(calib_data: List[str], quant_config: dict, ...).  →  수정: model.quantize(calib_data=['문장1', '문장2', ...], quant_config=qcfg) 형태로 캘리브레이션 문장 리스트를 직접 전달해야 한다. 파일에서 읽으려면 lines = open('data.txt').read().splitlines() 후 calib_data=lines 로 넘겨야 한다.
- [high/code] pserve-kvcache-enable: ids = model.dummy_input_ids = None 에서 dummy_input_ids는 HuggingFace transformers AutoModelForCausalLM의 실제 속성이 아니다. 이 체인 할당은 모델 객체에 임의 속성을 None으로 붙이고 ids 변수에도 None을 할당하는 무의미한 코드다. 변수 ids는 이후 어디에도 사용되지 않으며, 입문자에게 잘못된 API 인상을 준다.  →  수정: 해당 줄을 삭제하고 use_cache 동작을 보여주는 실질적인 코드(예: 짧은 generate 호출로 past_key_values 존재 확인)로 대체하거나, 단순히 model = AutoModelForCausalLM.from_pretrained('gpt2', use_cache=True); print(model.config.use_cache) 만 남겨야 한다.
- [medium/explain] pserve-gguf-load: terms에서 키가 'choices[0].text' (점 표기법)인데 실제 코드는 out['choices'][0]['text'] (딕셔너리 접근)를 사용한다. llama_cpp의 반환값은 dict이므로 점 표기법은 틀린 설명이다. 입문자가 .text로 접근하면 AttributeError가 발생한다.  →  수정: { t: "choices[0]['text']", d: '첫 번째 답의 글자 부분이에요. 딕셔너리로 접근해요.' } 로 키와 설명을 수정해야 한다.
- [medium/topic] pserve-sse-fastapi: FastAPI + StreamingResponse를 이용한 일반 SSE 서버 패턴은 LLM 서빙 특화 주제(vLLM·Ollama·TGI·양자화·KV Cache)가 아니라 범용 웹 스트리밍 패턴이다. 팩 주제와 직접 연결되지 않는다.  →  수정: LLM 출력을 StreamingResponse로 감싸는 실제 vLLM/Ollama 연동 SSE 예제로 교체하거나, 주제 범위 명세에 '스트리밍 서빙 서버'를 명시적으로 추가해야 한다.
- [medium/topic] pserve-sse-client: requests 라이브러리로 SSE를 수신하는 일반 HTTP 클라이언트 코드로, LLM 서빙 특화 개념을 다루지 않는다. 팩 주제(vLLM·Ollama·TGI·양자화·스트리밍·배치추론·KV Cache)와 약하게 연결된다.  →  수정: OpenAI 호환 스트리밍 클라이언트(openai 패키지로 vLLM 서버 호출) 또는 httpx AsyncClient를 이용한 LLM SSE 수신 예제로 교체하는 것이 주제 적합성을 높인다.

### D:\_Git_PWA\CodeMaster\src\content\packs\_staging\P13-pprompt.ts (minor, 20개)
- [low/code] pprompt-cot-self-consistency: import 문(from collections import Counter)이 변수 선언(answers = [...]) 뒤에 위치해 있어 PEP8 위반입니다. Python은 이를 허용하나 입문자에게 잘못된 습관을 심어줄 수 있습니다.  →  수정: import 문을 코드 맨 위로 이동하세요: 'from collections import Counter'를 첫 줄에 배치하고 그 다음에 answers = [...] 를 두세요.
- [medium/explain] pprompt-function-args: 코드에서 response 딕셔너리를 {'name': 'get_weather', 'arguments': '...'} 형태의 단순 모형으로 표현했는데, 실제 OpenAI API 응답 구조(response.choices[0].message.tool_calls[0].function.name / .arguments)와 다릅니다. 또한 Anthropic API와도 다릅니다(response.content[0].name, response.content[0].input). 학습자가 실제 API를 쓸 때 혼란을 일으킬 수 있습니다.  →  수정: concept 또는 pitfall에 '이 코드는 실제 API 응답 구조를 단순화한 예시입니다. 실제 OpenAI 응답은 tool_calls[0].function.name 형태로 접근합니다'라고 명시하거나, 실제 API 구조를 반영한 mock으로 교체하세요.
- [medium/topic] pprompt-temperature: 이 스니펫(temperature/max_tokens 설정값 딕셔너리)은 팩의 지정 주제(Few-shot, CoT, Function Calling, JSON Schema, Pydantic 구조화 출력) 어디에도 해당하지 않습니다. 모델 파라미터 튜닝은 별개의 주제입니다.  →  수정: 주제에 맞는 스니펫(예: Pydantic model_json_schema()로 JSON Schema 자동 생성, 또는 Few-shot 예시 동적 선택)으로 교체하거나 팩 주제 목록에 '온도/파라미터'를 명시적으로 추가하세요.
- [low/topic] pprompt-system-role: system 역할 부여는 일반적인 채팅 API 사용법이며, 명시된 5개 주제(Few-shot·CoT·Function Calling·JSON Schema·Pydantic) 범위에 포함되지 않습니다.  →  수정: 팩 주제 목록에 '시스템 프롬프트'를 추가하거나, 주제 외 내용임을 인지하고 Function Calling의 system 역할 활용 예시로 맥락을 보강해 연결성을 높이세요.
- [low/topic] pprompt-message-history: 대화 맥락(messages 배열) 관리 패턴은 명시된 5개 주제에 포함되지 않는 일반 채팅 API 패턴입니다. 코드도 len(messages)만 출력하여 실질적 학습 가치가 낮습니다.  →  수정: 주제 목록에 '대화 맥락 관리'를 추가하거나, Few-shot의 messages 형식 활용 예시(system + few-shot examples as messages)로 내용을 재구성하여 주제와 연결하세요.
- [low/topic] pprompt-delimiter: 구분자(delimiter)를 이용한 입력 구역 분리는 일반 프롬프트 엔지니어링 기법으로, 명시된 5개 핵심 주제 범위 밖입니다.  →  수정: 팩 주제 목록에 '프롬프트 구조화'를 명시적으로 추가하거나, Function Calling이나 JSON Schema와 연결되는 예시로 교체하세요.
- [low/topic] pprompt-instruction-format: 지시문+형식+입력을 묶는 패턴은 일반 프롬프트 구성 기법으로, 명시된 5개 핵심 주제에 해당하지 않습니다.  →  수정: 팩 주제 목록에 '프롬프트 구조화'를 추가하거나, JSON Schema 또는 Pydantic 출력과 결합된 예시로 교체하여 주제 연관성을 강화하세요.

### D:\_Git_PWA\CodeMaster\src\content\packs\_staging\P14-pft.ts (rework, 20개)
- [high/code] pft-lora-load: `model.is_peft_model` 속성이 PEFT 라이브러리에 존재하지 않아요. PeftModel 인스턴스에는 `is_peft_model`이라는 공개 속성이 없으며, 실행 시 AttributeError가 발생해요.  →  수정: `print(model.is_peft_model)` 대신 `print(isinstance(model, PeftModel))` 또는 `print(model.peft_config)`를 사용하세요.
- [high/code] pft-mlflow-log-model: `mlflow.log_model(model, "model")`은 잘못된 API 호출이에요. MLflow 2.12 미만에서는 최상위 `mlflow.log_model()`이 존재하지 않고, MLflow 2.12+에서도 이 시그니처(positional args: model, artifact_path)는 지원되지 않아요. 프레임워크별 함수(`mlflow.pytorch.log_model`, `mlflow.sklearn.log_model` 등)를 사용해야 해요.  →  수정: `mlflow.log_model(model, "model")` → `mlflow.pytorch.log_model(model, "model")` (PyTorch 모델 기준). sklearn 모델이면 `mlflow.sklearn.log_model(model, "model")`로 교체하세요.
- [medium/code] pft-mlflow-autolog: 코드에서 `model.fit(x_train, y_train)`를 사용하는데, 이는 sklearn 스타일이에요. 이 팩의 주제인 LoRA/PEFT/Transformers 문맥에서는 `autolog()`가 `model.fit()`을 자동 기록하지 않아요. Transformers/TRL 기반 학습에서는 `mlflow.autolog()`보다 Trainer의 callback 방식이 적합해요. 개념과 코드 맥락이 주제에서 벗어나 있어요.  →  수정: Transformers Trainer를 예시로 교체하거나, autolog 예시를 sklearn 맥락(별도 팩)으로 한정하고 PEFT 맥락에서는 주석으로 제한사항을 명시하세요.
- [low/explain] pft-mlflow-autolog: terms에 `fit`과 `model.fit` 두 항목이 사실상 동일한 내용을 설명하고 있어요. 중복 term이에요.  →  수정: `fit`과 `model.fit` 중 하나를 제거하거나, 하나를 다른 핵심 개념(예: `autolog`가 기록하는 구체적 값)으로 교체하세요.
- [medium/duplicate] pft-qlora-4bit: `pft-qlora-4bit`와 `pft-qlora-compute-dtype` 두 스니펫이 거의 동일한 `BitsAndBytesConfig` 패턴을 사용해요. 차이가 `bnb_4bit_compute_dtype` 파라미터 하나뿐이라 별개의 학습 단위로 보기 어려워요.  →  수정: 두 스니펫을 하나로 합치거나(`BitsAndBytesConfig` 전체 설정 예시), `pft-qlora-compute-dtype`를 compute_dtype의 영향을 실제로 보여주는 코드(예: 모델 로드 후 dtype 확인)로 차별화하세요.

### D:\_Git_PWA\CodeMaster\src\content\packs\_staging\P15-pqual.ts (rework, 20개)
- [high/code] pqual-ragas-faithfulness: RAGAS v0.2+에서 Dataset 필드명이 변경됨. 'question'→'user_input', 'answer'→'response', 'contexts'→'retrieved_contexts'. 현재 PyPI 기준 RAGAS 최신 버전은 v0.2.x이며, 구 필드명으로 evaluate() 호출 시 ValidationError 또는 KeyError 발생.  →  수정: Dataset.from_dict 키를 'user_input', 'response', 'retrieved_contexts'로 변경. 또는 파일 상단에 '# ragas==0.1.x 기준' 버전 주석 명시.
- [high/code] pqual-ragas-context-precision: RAGAS v0.2+에서 'question'→'user_input', 'contexts'→'retrieved_contexts', 'ground_truth'→'reference'로 필드명이 변경됨. 현재 코드는 v0.1 필드명을 사용해 실행 시 ValidationError 발생.  →  수정: Dataset 키를 user_input, retrieved_contexts, reference로 수정하고 result['context_precision'] 출력 키도 v0.2 기준으로 확인.
- [high/code] pqual-ragas-answer-relevancy: RAGAS v0.2+에서 'question'→'user_input', 'answer'→'response', 'contexts'→'retrieved_contexts'로 필드명 변경. 실행 시 ValidationError 발생. 추가로 why 필드에 '딴관이면'이라는 비표준 한국어 표현이 포함되어 있음(버전 문제가 더 심각함).  →  수정: Dataset 키를 user_input, response, retrieved_contexts로 수정. why 문구 '질문과 딴관이면'을 '질문과 관련이 없으면'으로 수정.
- [high/code] pqual-ragas-evaluate-multi: RAGAS v0.2+에서 'question'→'user_input', 'answer'→'response', 'contexts'→'retrieved_contexts', 'ground_truth'→'reference'로 필드명 변경. 4개 RAGAS 스니펫 중 마지막으로, 실행 시 ValidationError 발생.  →  수정: Dataset 키를 RAGAS v0.2 기준(user_input, response, retrieved_contexts, reference)으로 수정하거나, 파일 맨 위에 대상 버전(ragas==0.1.x)을 명시.
- [high/code] pqual-llmeval-pairwise: PairwiseStringEvalChain에 존재하지 않는 메서드 evaluate_pairs()를 호출. 실제 메서드명은 evaluate_string_pairs()임. 실행 시 AttributeError 발생.  →  수정: chain.evaluate_pairs(...) → chain.evaluate_string_pairs(predictions=[...], predictions_b=[...], inputs=[...]) 로 수정.
- [high/code] pqual-langfuse-span: Langfuse Python SDK v2에서 trace.span()이 반환하는 StatefulSpanClient는 컨텍스트 매니저(__enter__/__exit__)를 구현하지 않음. 'with trace.span(...) as span:' 구문은 AttributeError를 일으킴. terms에서 'with'를 '시작과 끝을 자동으로 처리하는 구문'으로 설명한 것도 사실과 다름.  →  수정: span = trace.span(name='검색단계') / docs = [...] / span.end(output=docs) 형태로 수정. terms에서 'with' 항목도 제거 또는 수정.
- [high/code] pqual-guardrails-validators: guardrails v0.5+에서 'from guardrails.validators import ValidChoices, ValidLength' 임포트 경로가 제거되고 guardrails-hub 방식으로 변경됨. 실행 시 ImportError 발생. 또한 explain.terms의 on_fail 설명에 한자 '时'(U+6642)가 포함되어 있어 '검사 실패时'처럼 한국어·한자 혼용 오타가 있음.  →  수정: 임포트를 guardrails-hub 방식(from guardrails.hub import ValidChoices, ValidLength 또는 pip install guardrails-hub 후 hub 경로)으로 교체. on_fail 설명의 '时'를 '시'로 수정.
- [high/code] pqual-pii-presidio: AnalyzerEngine().analyze(text=text, language='ko')에서 Presidio 기본 NLP 엔진(spaCy en_core_web_lg)은 한국어('ko')를 지원하지 않음. 한국어 모델 없이 실행하면 ConfigurationError 또는 빈 결과(아무것도 감지 안 함) 발생. 실제 예시 데이터에 한국어 텍스트가 포함되어 있어 학습자가 그대로 실행 시 오류 발생.  →  수정: language='en'으로 변경하거나, 한국어 NLP 엔진 설정 코드(NlpEngineProvider + spacy ko 모델 로드)를 포함시키고, 예시 텍스트도 영어로 변경하거나 pitfall에 명시.
- [medium/version] pqual-langsmith-run: Client.run_on_dataset()는 langsmith v0.1+에서 deprecated되었고, 최신 SDK에서는 langsmith.evaluate() 함수로 대체됨. 일부 버전에서는 완전히 제거되어 AttributeError가 날 수 있음.  →  수정: from langsmith import evaluate 를 사용하고, evaluate(target=..., data='날씨QA', evaluators=[...]) 방식으로 변경하거나 # langsmith<0.1 기준 버전 주석을 추가.
- [medium/version] pqual-guardrails-spec: guardrails v0.5+에서 Guard.from_pydantic()이 deprecated되어 Guard.for_pydantic()으로 이름이 변경됨. guard(llm_api=..., prompt=...) 직접 호출 패턴도 v0.5에서 guard.parse(llm_output=...) 또는 guard.validate(llm_output=...) 방식으로 변경됨.  →  수정: Guard.from_pydantic() → Guard.for_pydantic()으로 수정하고, guard(...) 직접 호출 대신 guard.parse() 또는 guard.validate()로 변경.
- [medium/version] pqual-guardrails-retry: Guard.from_pydantic()이 guardrails v0.5+에서 deprecated. guard(..., num_reasks=2) 직접 호출 패턴도 v0.5 API에서 변경됨.  →  수정: Guard.from_pydantic() → Guard.for_pydantic()으로 수정. 직접 호출 방식도 최신 API(guard.validate 또는 guard.parse)에 맞게 수정.
- [low/explain] pqual-ragas-answer-relevancy: explain.why 필드에 '질문과 딴관이면'이라는 비표준 한국어 표현 사용. '딴관'은 표준어가 아니며 입문자가 이해하기 어려움.  →  수정: '질문과 딴관이면'을 '질문과 관련이 없으면' 또는 '엉뚱한 답을 하면'으로 수정.
