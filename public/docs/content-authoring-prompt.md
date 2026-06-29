# CodeMaster 학습 콘텐츠 위임 가이드

다른 모델(GLM-5.2 / DeepSeek V4 Pro 등)에게 **학습팩 문제 + 입문자 설명** 작성을 위임할 때 사용하는 문서.

- 한 번에 **한 레벨(20문제)** 씩 요청한다 (검토·통합 단위).
- 아래 **§1 프롬프트**를 복사해, `[[대상]]` 자리에 **§2 리스트의 한 줄**(레벨 + 접두 + 주제)을 넣어 요청한다.
- 받은 결과는 메인테이너(Claude)가 검토 → `src/content/packs/*.ts` 통합 → 빌드·배포.

---

## 1. 위임용 프롬프트 (복사)

`````text
# 역할
너는 Java/Spring Boot · Python 시니어 개발자이자, 프로그래밍 입문자를 가르치는 교육 전문가다.
"CodeMaster"라는 학습 앱에 넣을 **코드 따라치기 문제 + 입문자용 설명**을 만든다.

# 제품 맥락 (반드시 이해)
CodeMaster는 코드를 따라 치며 "언어를 습득"하는 학습 PWA다. 목적은 단순 타이핑 속도가 아니라
**실제 언어 습득**이다. 그래서 각 문제는 (1) 짧은 실무 코드 + (2) 입문자가 코드를 뜯어 이해할 수 있는
친절한 한국어 설명으로 구성된다. 사용자는 프로그래밍을 막 시작한 입문자라고 가정한다.

# 출력 데이터 구조 (TypeScript — 정확히 이 형태로)
interface Term { t: string; d: string; }            // t=코드 요소, d=쉬운 설명
interface Explain {
  concept: string;        // 쉬운 말/비유로 개념 (전문용어 금지 또는 괄호 풀이)
  terms?: Term[];         // "코드 뜯어보기" — 키워드/기호별 풀이
  why?: string;           // 왜/언제 쓰나
  pitfall?: string;       // 입문자가 자주 틀리는 점 (선택)
}
interface Snippet {
  id: string;             // "{접두}-{패턴}" 예: "sc-bean"
  lang: 'java' | 'python';
  title: string;          // 패턴 이름 예: "@Bean 등록"
  file: string;           // 파일명 예: "AppConfig.java"
  code: string;           // 따라칠 목표 코드 (5~15줄)
  explain: Explain;
}

# 작성 대상  ★여기만 채워서 요청★
[[대상]] 예) 학습팩: Spring Boot / 레벨: L2 Spring Core / 접두: sc / 주제: DI(@Component·@Service·@Repository·@Controller) · @Bean·@Configuration·@ConfigurationProperties·@Profile · AOP(@Aspect·@Around·Pointcut) · @Qualifier·@Primary·@Value
문제 수: 20개

# 코드 규칙
- 버전: Java 21 (LTS) · Spring Boot 3.4.x · Gradle 8   (Python이면 Python 3.12)
- 길이: 5~15줄. 한 문제 = 한 패턴에 집중. 너무 길게 쓰지 말 것.
- **문법적으로 반드시 올바른 코드**. (import 문은 생략 가능하나, 코드 자체는 컴파일/실행 가능한 형태여야 함)
- 실무에서 실제로 쓰는 관용적 코드. 억지 예제 금지.
- 코드 안에 **백틱(`) 과 ${ } 를 절대 넣지 말 것** (TS 템플릿 리터럴과 충돌).
- 20개는 서로 다른 패턴이어야 하며 중복 금지.

# 설명 규칙 (가장 중요 — 입문자 기준)
- 모든 설명은 **한국어 존댓말**("~예요/~해요").
- concept: 전문용어 없이 2~3문장. 비유를 적극 사용. 용어가 불가피하면 괄호로 즉시 풀이.
- terms: 코드에 등장하는 키워드·어노테이션·기호 중 **입문자가 모를 만한 것 3~6개**를
  { t: "코드요소", d: "쉬운 설명" } 로. (예: @Bean, final, ->, <T>, ::, var, @Transactional)
- why: 왜/언제 쓰는지 1문장.
- pitfall: 입문자가 흔히 틀리는 점 1문장 (해당 시).

# 스타일/품질 예시 (이 수준을 정확히 따를 것)
{
  id: 'jc-record', lang: 'java', title: 'Record', file: 'Money.java',
  code: `public record Money(long amount, String currency) {

    public Money {
        if (amount < 0) throw new IllegalArgumentException("negative");
    }
}`,
  explain: {
    concept: '레코드(record)는 데이터만 담는 "간단한 상자"를 한 줄로 만들어 줘요. 한 번 만들면 값을 못 바꾸는(불변) 게 특징이에요.',
    terms: [
      { t: 'record', d: '불변 데이터 객체를 자동으로 만들어 줌' },
      { t: '(long amount, String currency)', d: '상자에 담을 데이터 목록' },
      { t: 'public Money { ... }', d: 'compact 생성자 — 값이 올바른지 검사' },
    ],
    why: 'DTO·값 객체를 짧고 안전하게 만들 때 써요(equals·toString 자동 생성).',
    pitfall: 'record 의 필드는 생성 후 바꿀 수 없어요.',
  },
}
{
  id: 'jpa-entity', lang: 'java', title: 'JPA Entity', file: 'UserEntity.java',
  code: `@Entity
@Table(name = "users")
public class UserEntity implements Serializable {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String username;
}`,
  explain: {
    concept: '엔티티는 DB의 한 줄(레코드)과 짝을 이루는 객체예요. 이 클래스가 곧 users 테이블이 됩니다.',
    terms: [
      { t: '@Entity', d: '이 클래스를 DB 테이블과 연결' },
      { t: '@Id', d: '기본키(고유 식별자)' },
      { t: '@GeneratedValue(IDENTITY)', d: 'DB가 id를 자동 증가시킴' },
      { t: '@Column(nullable=false, unique=true)', d: '빈 값 금지 + 중복 금지' },
    ],
    why: 'SQL을 직접 쓰지 않고 객체로 DB를 다루려고요(ORM).',
    pitfall: 'JPA 엔티티는 기본(매개변수 없는) 생성자가 필요해요.',
  },
}

# 출력 형식
- **TypeScript `Snippet[]` 배열만** 출력. 앞뒤 설명·마크다운·코드펜스 없이 배열 그 자체만.
- 들여쓰기 2칸, 작은따옴표 문자열, code 값은 백틱 템플릿 리터럴.

# 제출 전 자체 검토 (반드시 통과)
- [ ] 정확히 20개, 패턴 중복 없음
- [ ] 모든 코드가 Java 21 / Python 3.12 문법으로 올바름
- [ ] code 안에 백틱·${ } 없음
- [ ] 각 문제에 concept·terms(3개 이상)·why 존재
- [ ] 용어를 입문자가 이해할 수 있게 풀이했는가
- [ ] 레벨 주제에 부합하는 실무 패턴인가
`````

---

## 2. 위임 대상 리스트

`[[대상]]`에 아래 한 줄(레벨 + 접두 + 주제)을 넣어 요청한다. **L1 Java Core는 완료(20문제)** 이므로 제외.

### Spring Boot 학습팩 (L2~L20 · 19개 레벨 · 380문제)

| 레벨 | 접두(id) | 주제(20문제로 다룰 패턴) |
|---|---|---|
| **L2 Spring Core** | `sc` | DI(@Component·@Service·@Repository·@Controller) · @Bean·@Configuration·@ConfigurationProperties·@Profile · AOP(@Aspect·@Around·Pointcut) · @Qualifier·@Primary·@Value |
| **L3 Spring Boot MVC** | `mvc` | @RestController·@RequestMapping·@Get/Post/Put/DeleteMapping · @RequestBody·@PathVariable·@RequestParam · @Valid·BindingResult · @ExceptionHandler·@RestControllerAdvice · ProblemDetail(RFC7807)·ResponseEntity · OpenAPI·FeignClient |
| **L4 Database — JPA/MyBatis** | `db` | *(Entity·Repository 일부 존재 — 중복 피하고 확장)* JPQL·@Query·Native Query · @ManyToOne·@OneToMany·fetch · @Transactional(전파·격리) · Specification·QueryByExample · MyBatis(@Mapper·ResultMap·Dynamic SQL·@Select) |
| **L5 Concurrency** | `conc` | Thread·Runnable·Callable·Future · CompletableFuture(thenCompose·allOf) · ExecutorService·ThreadPoolExecutor·ForkJoinPool·ScheduledExecutor · ConcurrentHashMap·BlockingQueue·AtomicInteger·ReentrantLock·Semaphore·CountDownLatch |
| **L6 Network** | `net` | Socket·ServerSocket·TCP·UDP(DatagramSocket)·NIO(Channel·Buffer·Selector)·Netty 기초 |
| **L7 Gateway** | `gw` | Spring Cloud Gateway·RouteLocator·Predicate·GatewayFilter·GlobalFilter·LoadBalancer·CircuitBreaker(Resilience4j 연동) |
| **L8 Messaging** | `msg` | Kafka(Producer·Consumer·@KafkaListener)·RabbitMQ(@RabbitListener)·JMS·Spring Events(@EventListener·ApplicationEventPublisher) |
| **L9 Batch** | `batch` | Spring Batch·Job·Step·ItemReader·ItemProcessor·ItemWriter·Chunk·JobParameters·Tasklet |
| **L10 Security** | `sec` | SecurityFilterChain·@EnableWebSecurity·UserDetailsService·PasswordEncoder·JWT 생성/검증·OAuth2·@PreAuthorize(RBAC)·CORS |
| **L11 Cache** | `cache` | @EnableCaching·@Cacheable·@CacheEvict·@CachePut·Redis(RedisTemplate)·Caffeine·EhCache·TTL |
| **L12 Monitoring** | `mon` | Actuator·@Endpoint·Micrometer(Counter·Timer·Gauge)·Prometheus·@Timed·HealthIndicator |
| **L13 Testing** | `test` | JUnit5(@Test·@BeforeEach·assertThat)·Mockito(@Mock·when·verify)·@SpringBootTest·@WebMvcTest·@DataJpaTest·TestContainers·MockMvc |
| **L14 Architecture** | `arch` | Layered·Hexagonal(Port·Adapter)·DDD(Aggregate·ValueObject·Repository)·CQRS·Event Sourcing·DTO 변환 |
| **L15 Design Pattern** | `dp` | Singleton·Factory·Builder·Strategy·Observer·Template Method·Decorator·Adapter·Proxy·Facade |
| **L16 Build & DevOps** | `devops` | Gradle(build.gradle·dependencies·plugins·멀티모듈)·Dockerfile(멀티스테이지)·docker-compose.yml·k8s Deployment/Service·Helm·GitHub Actions yml |
| **L17 Observability** | `obs` | Logback(logback-spring.xml)·SLF4J·MDC·Micrometer Tracing·Zipkin·구조화 로깅(JSON)·Sentry |
| **L18 Data 심화** | `data` | QueryDSL(BooleanBuilder·Q클래스)·HikariCP 설정·Flyway 마이그레이션·Liquibase·인덱스·EXPLAIN·N+1(fetch join)·Pageable |
| **L19 Resilience & Cloud-Native** | `resil` | Resilience4j(@Retry·@CircuitBreaker·@Bulkhead·@RateLimiter)·Eureka(서비스 디스커버리)·Config Server·Saga |
| **L20 Reactive** | `rx` | WebFlux(@GetMapping Mono/Flux)·Reactor(map·flatMap·zip)·R2DBC·SSE(ServerSentEvent)·Backpressure·WebClient |

### Python AI 학습팩 (L1~L15 · 15개 레벨 · 300문제)

*(L1은 샘플 3개만 있으니 20개로 채우며 중복 제거)*

| 레벨 | 접두 | 주제 |
|---|---|---|
| **L1 Python Core** | `pc` | def·*args/**kwargs·class·__init__·@dataclass·typing(list/dict/Optional)·comprehension·with·decorator·module |
| **L2 Async** | `pasync` | async/await·asyncio.run·gather·TaskGroup·Queue·Threading·Multiprocessing·Lock |
| **L3 Data** | `pdata` | NumPy(ndarray·broadcast)·Pandas(DataFrame·groupby·merge)·Matplotlib·Polars |
| **L4 Machine Learning** | `pml` | Scikit-Learn(fit/predict·Pipeline·train_test_split)·XGBoost·LightGBM·교차검증 |
| **L5 Deep Learning** | `pdl` | PyTorch(Tensor·nn.Module·forward·optimizer·training loop)·Dataset·DataLoader·TensorFlow/Keras |
| **L6 LLM** | `pllm` | Transformers(AutoModel·AutoTokenizer·pipeline)·Embedding·SentenceTransformer·토큰화 |
| **L7 RAG** | `prag` | Chunking·Embedding·VectorStore 검색·Retriever·Reranker·Hybrid Search·프롬프트 조립 |
| **L8 AI Agent** | `pagent` | Tool/Function Calling·Memory·Planning·ReAct·Reflection·Multi-Agent |
| **L9 Framework** | `pframe` | LangChain(Chain·Runnable·LCEL)·LlamaIndex·CrewAI·AutoGen·DSPy |
| **L10 Production AI** | `pprod` | FastAPI(@app.get·async)·Pydantic(BaseModel·Field)·SQLAlchemy·Celery·Redis·pytest·mypy·ruff |
| **L11 Vector Store** | `pvec` | pgvector·Qdrant·Weaviate·Milvus·FAISS·HNSW·메타데이터 필터 |
| **L12 LLM 서빙·최적화** | `pserve` | vLLM·Ollama·TGI·양자화(GGUF·AWQ)·SSE 스트리밍·배치 추론·KV Cache |
| **L13 프롬프트·구조화 출력** | `pprompt` | Few-shot·Chain-of-Thought·Function Calling·JSON Schema·Pydantic 구조화 출력·출력 검증 |
| **L14 Fine-tuning & MLOps** | `pft` | LoRA·QLoRA·PEFT·MLflow(log_metric·log_model)·DVC·W&B·experiment tracking |
| **L15 AI 품질·관측·보안** | `pqual` | RAGAS·LLM Eval·Langfuse·LangSmith·Guardrails·Prompt Injection 방어·PII 마스킹 |

---

## 3. 운영 팁

- **한 메시지 = 한 레벨(20문제)**. 위 표의 `레벨 + 접두 + 주제`를 프롬프트의 `[[대상]]`에 그대로 붙인다.
- **우선순위**(입문자 기준): ① Python L1 → ② Spring L2 → L3 → L4 → L5 … 앞쪽 기초부터.
- 총 규모: **34레벨 × 20 ≈ 680문제** (PRD §13.6의 ~700 추산과 일치).
- `id` 접두를 표대로 쓰면 **중복 충돌 없이** 그대로 통합 가능.

## 4. 검토 기준 (받은 뒤 메인테이너가 확인)

- **코드 정확성** — Java 21 / Python 3.12 문법, 버전 적합성(Spring Boot 3.4)
- **스키마 일치** — Snippet/Explain 형태, 코드 내 백틱·`${}` 오염 여부(빌드 깨짐 방지)
- **입문자 설명 품질** — 용어 풀이 충분한지, concept가 쉬운지
- **중복·주제 적합성** — 20개가 레벨 주제를 잘 덮는지
- 통과 시 `src/content/packs/*.ts` 통합 → 빌드·배포

> 참고: 데이터 구조 정의는 [`src/content/types.ts`](../src/content/types.ts), 통합 예시는
> [`src/content/packs/spring-boot.ts`](../src/content/packs/spring-boot.ts) 의 L1 Java Core(20문제) 참조.
