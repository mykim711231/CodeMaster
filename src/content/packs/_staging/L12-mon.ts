import type { Snippet } from '../../types';

export const monitoring: Snippet[] = [
  {
    id: 'mon-actuator-dependency',
    lang: 'java',
    title: 'Actuator 기본 엔드포인트',
    file: 'application.yml',
    code: `management:
  endpoints:
    web:
      exposure:
        include: health,info,metrics
  endpoint:
    health:
      show-details: always`,
    explain: {
      concept: 'Actuator는 앱의 "건강 상태 게시판"이에요. /actuator/health 같은 URL로 상태를 확인할 수 있어요.',
      terms: [
        { t: 'management', d: '모니터링 설정 블록' },
        { t: 'endpoints.web.exposure', d: '웹에 공개할 엔드포인트 목록' },
        { t: 'include', d: '공개할 항목들' },
        { t: 'show-details', d: '건강 세부 정보 표시 여부' },
      ],
      why: '운영 중인 앱의 상태를 외부에서 확인하려고요.',
      pitfall: 'show-details: always는 민감 정보 노출 위험이 있어요. 운영 환경에서는 주의하세요.',
    },
  },
  {
    id: 'mon-health-endpoint',
    lang: 'java',
    title: 'Health 엔드포인트',
    file: 'application.yml',
    code: `management:
  endpoint:
    health:
      show-details: when-authorized
      status:
        http-mapping:
          DOWN: 503`,
    explain: {
      concept: '/actuator/health는 앱이 살아있는지 알려주는 URL이에요. DB가 죽으면 DOWN 상태로 503 응답을 보내요.',
      terms: [
        { t: 'show-details', d: '세부 정보 공개 범위' },
        { t: 'when-authorized', d: '권한 있을 때만 표시' },
        { t: 'http-mapping', d: '상태-HTTP 코드 매핑' },
        { t: '503', d: '서비스 불가 상태 코드' },
      ],
      why: '로드밸런서가 살아있는 서버로만 요청을 보내려고요.',
      pitfall: 'DOWN을 200으로 두면 일반 사용자도 오류를 못 느껴요.',
    },
  },
  {
    id: 'mon-custom-endpoint',
    lang: 'java',
    title: '@Endpoint 커스텀 엔드포인트',
    file: 'FeatureToggleEndpoint.java',
    code: `@Component
@Endpoint(id = "features")
public class FeatureToggleEndpoint {
  @ReadOperation
  public Map<String, Boolean> features() {
    return Map.of("new-ui", true, "beta-api", false);
  }
}`,
    explain: {
      concept: '@Endpoint는 나만의 게시판을 만드는 도구예요. /actuator/features로 기능 ON/OFF 상태를 볼 수 있어요.',
      terms: [
        { t: '@Endpoint', d: '커스텀 엔드포인트 선언' },
        { t: 'id', d: 'URL에 쓰일 이름' },
        { t: '@ReadOperation', d: 'GET 요청에 응답하는 메서드' },
        { t: 'Map.of', d: '불변 맵 생성' },
      ],
      why: '앱 고유의 상태를 외부에 노출하려고요.',
      pitfall: 'id는 반드시 소문자-하이픈 규칙을 지켜야 URL이 만들어져요.',
    },
  },
  {
    id: 'mon-endpoint-write-op',
    lang: 'java',
    title: '@WriteOperation으로 상태 변경',
    file: 'FeatureToggleEndpoint.java',
    code: `@Component
@Endpoint(id = "features")
public class FeatureToggleEndpoint {
  private final Map<String, Boolean> flags = new ConcurrentHashMap<>();

  @WriteOperation
  public void setFlag(String name, boolean enabled) {
    flags.put(name, enabled);
  }
}`,
    explain: {
      concept: '@WriteOperation은 POST로 값을 받아 상태를 바꾸는 작업이에요. 기능 플래그를 켜고 끌 수 있어요.',
      terms: [
        { t: '@WriteOperation', d: 'POST로 값을 쓰는 작업' },
        { t: 'ConcurrentHashMap', d: '스레드 안전한 맵' },
        { t: 'flags.put', d: '플래그 저장' },
      ],
      why: '재배포 없이 런타임에 상태를 바꾸려고요.',
      pitfall: '누구나 바꿀 수 있으면 위험해요. 보안 설정을 함께 쓰세요.',
    },
  },
  {
    id: 'mon-micrometer-counter',
    lang: 'java',
    title: 'Micrometer Counter',
    file: 'OrderMetrics.java',
    code: `@Component
public class OrderMetrics {
  private final Counter orderCounter;

  public OrderMetrics(MeterRegistry registry) {
    this.orderCounter = Counter.builder("orders.created")
      .description("생성된 주문 수")
      .register(registry);
  }
  public void incrementOrder() { orderCounter.increment(); }
}`,
    explain: {
      concept: 'Counter는 "몇 번 일어났는지" 세는 계수기예요. 주문이 들어올 때마다 1씩 올라요.',
      terms: [
        { t: 'Counter', d: '증가만 가능한 계수기' },
        { t: 'MeterRegistry', d: '측정 도구 등록소' },
        { t: 'Counter.builder', d: '카운터 생성 빌더' },
        { t: 'increment', d: '1 증가' },
        { t: '"orders.created"', d: '메트릭 이름' },
      ],
      why: '이벤트 발생 횟수를 추적하려고요.',
      pitfall: '감소는 안 돼요. 현재값을 재려면 Gauge를 쓰세요.',
    },
  },
  {
    id: 'mon-micrometer-timer',
    lang: 'java',
    title: 'Micrometer Timer',
    file: 'PaymentMetrics.java',
    code: `@Component
public class PaymentMetrics {
  private final Timer paymentTimer;

  public PaymentMetrics(MeterRegistry registry) {
    this.paymentTimer = Timer.builder("payment.duration")
      .description("결제 처리 시간")
      .register(registry);
  }
  public void record(long millis) { paymentTimer.record(Duration.ofMillis(millis)); }
}`,
    explain: {
      concept: 'Timer는 "얼마나 걸렸는지" 재는 초시계예요. 결제가 끝날 때마다 걸린 시간을 기록해요.',
      terms: [
        { t: 'Timer', d: '실행 시간 측정기' },
        { t: 'Timer.builder', d: '타이머 생성 빌더' },
        { t: 'record', d: '시간 기록' },
        { t: 'Duration.ofMillis', d: '밀리초 단위 시간' },
      ],
      why: '느린 작업을 찾아 성능을 개선하려고요.',
      pitfall: '단위를 잘못 넣으면 평균이 이상하게 나와요. Duration을 쓰세요.',
    },
  },
  {
    id: 'mon-micrometer-gauge',
    lang: 'java',
    title: 'Micrometer Gauge',
    file: 'QueueMetrics.java',
    code: `@Component
public class QueueMetrics {
  private final AtomicInteger queueSize = new AtomicInteger(0);

  public QueueMetrics(MeterRegistry registry) {
    Gauge.builder("queue.size", queueSize, AtomicInteger::get)
      .register(registry);
  }
  public void setSize(int size) { queueSize.set(size); }
}`,
    explain: {
      concept: 'Gauge는 "지금 이 순간의 값"을 보여주는 속도계예요. 큐에 대기 중인 작업 수처럼 올라갔다 내려가는 값을 나타내요.',
      terms: [
        { t: 'Gauge', d: '현재 값을 읽는 측정기' },
        { t: 'AtomicInteger', d: '스레드 안전 정수' },
        { t: 'AtomicInteger::get', d: '값을 읽어오는 함수 참조' },
        { t: 'Gauge.builder', d: '게이지 빌더' },
      ],
      why: '현재 상태(대기 수, 메모리 사용량 등)를 추적하려고요.',
      pitfall: '게이지는 값을 직접 올리지 않아요. 소스 객체의 값이 바뀌면 자동 반영돼요.',
    },
  },
  {
    id: 'mon-prometheus-config',
    lang: 'java',
    title: 'Prometheus 메트릭 노출',
    file: 'application.yml',
    code: `management:
  endpoints:
    web:
      exposure:
        include: prometheus,health
  metrics:
    tags:
      application: codemaster
    distribution:
      percentiles-histogram:
        http.server.requests: true`,
    explain: {
      concept: 'Prometheus는 메트릭을 주기적으로 긁어가는 수집기예요. /actuator/prometheus URL로 데이터를 제공해요.',
      terms: [
        { t: 'prometheus', d: 'Prometheus 포맷 엔드포인트' },
        { t: 'tags.application', d: '모든 메트릭에 붙는 앱 이름' },
        { t: 'percentiles-histogram', d: '분위수 히스토그램 활성화' },
        { t: 'http.server.requests', d: 'HTTP 요청 메트릭 이름' },
      ],
      why: 'Prometheus가 수집해 Grafana에서 시각화하려고요.',
      pitfall: '분위수 히스토그램을 켜면 메모리 사용량이 늘어요.',
    },
  },
  {
    id: 'mon-timed-annotation',
    lang: 'java',
    title: '@Timed로 메서드 측정',
    file: 'PaymentController.java',
    code: `@RestController
public class PaymentController {
  @Timed(value = "payment.process", description = "결제 처리 시간")
  @PostMapping("/pay")
  public ResponseEntity<String> pay(@RequestBody PayRequest req) {
    return ResponseEntity.ok("ok");
  }
}`,
    explain: {
      concept: '@Timed는 메서드 실행 시간을 자동으로 재주는 도구예요. 코드 한 줄 없이 초시계를 달아요.',
      terms: [
        { t: '@Timed', d: '실행 시간 자동 측정' },
        { t: 'value', d: '메트릭 이름' },
        { t: 'description', d: '메트릭 설명' },
        { t: '@PostMapping', d: 'POST 매핑' },
      ],
      why: '컨트롤러 성능을 자동 추적하려고요.',
      pitfall: 'TimedAspect 빈을 등록해야 동작해요.',
    },
  },
  {
    id: 'mon-timed-aspect-bean',
    lang: 'java',
    title: '@Timed 활성화 빈',
    file: 'MetricsConfig.java',
    code: `@Configuration
public class MetricsConfig {
  @Bean
  public TimedAspect timedAspect(MeterRegistry registry) {
    return new TimedAspect(registry);
  }
}`,
    explain: {
      concept: '@Timed 어노테이션이 동작하려면 TimedAspect라는 도우미 빈이 필요해요. 안 만들면 어노테이션이 무시돼요.',
      terms: [
        { t: '@Configuration', d: '설정 클래스' },
        { t: 'TimedAspect', d: '@Timed 처리 도우미' },
        { t: 'MeterRegistry', d: '측정 도구 등록소' },
        { t: '@Bean', d: '스프링 빈 등록' },
      ],
      why: 'AOP로 어노테이션을 가로채기 위해요.',
      pitfall: '이 빈이 없으면 @Timed가 조용히 무시돼요.',
    },
  },
  {
    id: 'mon-health-indicator',
    lang: 'java',
    title: 'HealthIndicator 구현',
    file: 'ApiKeyHealthIndicator.java',
    code: `@Component
public class ApiKeyHealthIndicator implements HealthIndicator {
  private final ApiKeyService apiKeyService;

  public ApiKeyHealthIndicator(ApiKeyService apiKeyService) {
    this.apiKeyService = apiKeyService;
  }

  @Override
  public Health health() {
    if (apiKeyService.isValid())
      return Health.up().withDetail("key", "valid").build();
    return Health.down().withDetail("error", "API 키 만료").build();
  }
}`,
    explain: {
      concept: 'HealthIndicator는 나만의 건강 점검 항목을 추가하는 거예요. 외부 API 키가 유효한지 검사해서 /actuator/health에 결과를 반영해요.',
      terms: [
        { t: 'HealthIndicator', d: '커스텀 건강 점검 인터페이스' },
        { t: 'health()', d: '건강 상태를 반환하는 필수 메서드' },
        { t: 'Health.up', d: '정상 상태 빌더' },
        { t: 'Health.down', d: '비정상 상태 빌더' },
        { t: 'withDetail', d: '응답에 추가 정보를 포함' },
        { t: 'ApiKeyService', d: '생성자 주입으로 받은 외부 API 키 검증 서비스' },
      ],
      why: '외부 의존성까지 포함해 전체 건강 상태를 한눈에 보려고요.',
      pitfall: 'health()에서 예외를 던지면 status가 자동으로 DOWN으로 떨어져요. 내부에서 try-catch로 감싸는 것이 안전해요.',
    },
  },
  {
    id: 'mon-metrics-registry',
    lang: 'java',
    title: 'MeterRegistry 주입',
    file: 'LoginMetrics.java',
    code: `@Service
public class LoginMetrics {
  private final Counter successCounter;
  private final Counter failCounter;

  public LoginMetrics(MeterRegistry registry) {
    this.successCounter = Counter.builder("login.success").register(registry);
    this.failCounter = Counter.builder("login.fail").register(registry);
  }
}`,
    explain: {
      concept: 'MeterRegistry는 모든 측정 도구를 등록하는 창고예요. 카운터를 만들 때마다 여기 등록해요.',
      terms: [
        { t: 'MeterRegistry', d: '메트릭 도구 등록 창고' },
        { t: 'Counter.builder', d: '카운터 생성' },
        { t: 'register', d: '레지스트리에 등록' },
      ],
      why: '한 곳에서 모든 메트릭을 관리·수집하려고요.',
      pitfall: '같은 이름으로 두 번 등록하면 경고가 떠요.',
    },
  },
  {
    id: 'mon-tags-metrics',
    lang: 'java',
    title: '메트릭 태그 추가',
    file: 'OrderMetrics.java',
    code: `@Component
public class OrderMetrics {
  public OrderMetrics(MeterRegistry registry) {
    Counter.builder("orders.created")
      .tag("region", "asia")
      .tag("channel", "mobile")
      .register(registry);
  }
}`,
    explain: {
      concept: 'tag는 메트릭에 라벨을 붙이는 거예요. 지역/채널별로 나눠서 볼 수 있어요.',
      terms: [
        { t: 'tag', d: '메트릭 라벨' },
        { t: '"region"', d: '지역 라벨 이름' },
        { t: '"channel"', d: '채널 라벨 이름' },
        { t: 'Counter.builder', d: '카운터 빌더' },
      ],
      why: '같은 메트릭을 세분해 분석하려고요.',
      pitfall: '태그 값 종류가 너무 많으면 카디널리티 폭발이 나요.',
    },
  },
  {
    id: 'mon-logback-metrics',
    lang: 'java',
    title: 'Logback 메트릭 (자동 등록)',
    file: 'LogbackMetricsDemo.java',
    code: `// Spring Boot 3.x: logback-classic이 classpath에 있으면
// LogbackMetrics가 자동으로 등록됩니다. 별도 설정 불필요.
// 비활성화가 필요할 때만 아래처럼 설정하세요.
//
// application.yml:
//   management:
//     metrics:
//       enable:
//         logback.events: false

@Component
public class LogbackMetricsDemo {
  private static final Logger log =
      LoggerFactory.getLogger(LogbackMetricsDemo.class);

  // 이 메서드가 호출될 때마다 logback.events{level="info"} 카운터가 +1
  public void doWork() {
    log.info("작업 시작");
    log.warn("경고 발생");
  }
}`,
    explain: {
      concept: 'Spring Boot 3.x에서는 logback-classic이 의존성에 있으면 LogbackMetrics가 자동으로 등록돼요. 로그 레벨(info·warn·error)별로 몇 번 찍혔는지 logback.events 메트릭으로 볼 수 있어요.',
      terms: [
        { t: 'LogbackMetrics', d: 'Logback 로그 발생 횟수를 메트릭으로 변환하는 자동 등록 클래스' },
        { t: 'logback.events', d: '레벨별 로그 발생 횟수 메트릭 이름' },
        { t: 'management.metrics.enable', d: '특정 메트릭을 끄는 Spring Boot 3.x 설정 경로' },
        { t: 'logback.events: false', d: 'Logback 메트릭을 비활성화하는 설정 값' },
      ],
      why: '에러 로그가 급증하면 Prometheus/Grafana 알람으로 즉시 감지하려고요.',
      pitfall: 'Spring Boot 2.x의 management.metrics.binders.logback.enabled 속성은 3.x에서 제거됐어요. 3.x에서 쓰면 아무 효과가 없거나 바인딩 오류가 나요.',
    },
  },
  {
    id: 'mon-heap-memory',
    lang: 'java',
    title: 'SLO 구간 설정',
    file: 'SloMetricsDemo.java',
    code: `// application.yml SLO 설정 (등가 Java 코드 아래 참고):
//   management:
//     endpoints.web.exposure.include: health,metrics
//     metrics.distribution.slo:
//       http.server.requests: 50ms,100ms,200ms

@Configuration
public class SloMetricsDemo {
  // SLO 구간을 Java 코드로 직접 등록하는 방법
  @Bean
  public MeterRegistryCustomizer<MeterRegistry> sloCustomizer() {
    return registry -> registry.config()
        .meterFilter(MeterFilter.maxExpected(
            "http.server.requests",
            Duration.ofMillis(200)));
  }
}`,
    explain: {
      concept: 'SLO(서비스 수준 목표)는 "응답이 100ms 안에 와야 한다" 같은 목표 구간이에요. Actuator가 자동으로 HTTP 요청 시간을 재고, SLO 구간 안에 드는 비율을 보여줘요.',
      terms: [
        { t: 'slo', d: '서비스 수준 목표 — 응답 시간 구간 경계값' },
        { t: 'http.server.requests', d: 'Spring이 자동 생성하는 HTTP 요청 타이머 메트릭 이름' },
        { t: 'MeterRegistryCustomizer', d: '메트릭 레지스트리를 전역으로 커스터마이징하는 빈' },
        { t: 'MeterFilter.maxExpected', d: '히스토그램 최대 예상값을 설정해 버킷 낭비를 줄이는 필터' },
      ],
      why: '평균이 아닌 "99%가 200ms 안에 응답했는가"처럼 실제 사용자 체감 성능을 추적하려고요.',
      pitfall: 'SLO 구간이 너무 촘촘하거나 많으면 히스토그램 버킷 수가 늘어 메모리 사용량이 커져요.',
    },
  },
  {
    id: 'mon-info-endpoint',
    lang: 'java',
    title: 'Info 엔드포인트',
    file: 'application.yml',
    code: `management:
  info:
    env:
      enabled: true
    java:
      enabled: true
  endpoints:
    web:
      exposure:
        include: info`,
    explain: {
      concept: '/actuator/info는 앱 정보를 보여주는 게시판이에요. 빌드 버전, 자바 버전 등을 확인할 수 있어요.',
      terms: [
        { t: 'info', d: '앱 정보 게시판' },
        { t: 'env.enabled', d: '환경 정보 포함' },
        { t: 'java.enabled', d: '자바 정보 포함' },
      ],
      why: '배포된 버전을 빠르게 확인하려고요.',
      pitfall: 'env를 켜면 비밀 정보 노출 위험이 있어요.',
    },
  },
  {
    id: 'mon-actuator-security',
    lang: 'java',
    title: 'Actuator 보안 제한',
    file: 'SecurityConfig.java',
    code: `@Bean
public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
  http.authorizeHttpRequests(auth -> auth
    .requestMatchers("/actuator/health").permitAll()
    .requestMatchers("/actuator/**").hasRole("ADMIN")
    .anyRequest().authenticated()
  );
  return http.build();
}`,
    explain: {
      concept: 'Actuator URL은 민감해요. health만 공개하고 나머지는 ADMIN 권한만 보게 해요.',
      terms: [
        { t: 'requestMatchers', d: 'URL 패턴 매칭' },
        { t: 'permitAll', d: '모두 허용' },
        { t: 'hasRole', d: '특정 역할만 허용' },
        { t: 'anyRequest', d: '나머지 모든 요청' },
      ],
      why: '운영 정보가 외부에 노출되지 않게 하려고요.',
      pitfall: 'Actuator 경로를 기본 /actuator로 두면 추측이 쉬워요. base-path 변경을 권장해요.',
    },
  },
  {
    id: 'mon-micrometer-long-task',
    lang: 'java',
    title: 'LongTaskTimer',
    file: 'BatchMetrics.java',
    code: `@Component
public class BatchMetrics {
  private final LongTaskTimer batchTimer;

  public BatchMetrics(MeterRegistry registry) {
    this.batchTimer = LongTaskTimer.builder("batch.export")
      .description("배치 내보내기 진행 시간")
      .register(registry);
  }
  public void start(Runnable task) { batchTimer.record(task); }
}`,
    explain: {
      concept: 'LongTaskTimer는 오래 걸리는 작업을 재는 초시계예요. 아직 진행 중인 작업도 시간을 보여줘요.',
      terms: [
        { t: 'LongTaskTimer', d: '긴 작업 시간 측정기' },
        { t: 'LongTaskTimer.builder', d: '빌더' },
        { t: 'record(task)', d: '작업을 실행하며 시간 측정' },
        { t: 'Runnable', d: '실행 가능한 작업' },
      ],
      why: '배치 작업처럼 오래 걸리는 작업의 진행 상태를 보려고요.',
      pitfall: '짧은 작업에 쓰면 오버헤드만 커져요.',
    },
  },
  {
    id: 'mon-custom-health-group',
    lang: 'java',
    title: 'Health Group',
    file: 'application.yml',
    code: `management:
  endpoint:
    health:
      group:
        readiness:
          include: db,redis
          show-details: always`,
    explain: {
      concept: 'Health Group은 건강 점검 항목을 묶는 거예요. "준비도(readiness)" 그룹엔 DB와 Redis만 넣어요.',
      terms: [
        { t: 'health.group', d: '건강 항목 묶음' },
        { t: 'readiness', d: '트래픽 받을 준비 상태' },
        { t: 'include', d: '포함할 인디케이터' },
        { t: 'show-details', d: '세부 정보 표시' },
      ],
      why: '준비 상태와 생존 상태를 분리하려고요.',
      pitfall: 'readiness에 느린 검사를 넣으면 부하가 커져요.',
    },
  },
  {
    id: 'mon-distribution-percentiles',
    lang: 'java',
    title: 'Percentile 설정',
    file: 'application.yml',
    code: `management:
  metrics:
    distribution:
      percentiles:
        http.server.requests: 0.5,0.95,0.99
      percentiles-histogram:
        http.server.requests: true`,
    explain: {
      concept: 'percentile은 "상위 5%는 얼마나 느린가"를 보는 거예요. p50, p95, p99 같은 분위수를 계산해요.',
      terms: [
        { t: 'percentiles', d: '분위수 설정' },
        { t: '0.5,0.95,0.99', d: 'p50, p95, p99 분위수' },
        { t: 'percentiles-histogram', d: '히스토그램 활성화' },
      ],
      why: '평균이 아닌 극단값을 추적하려고요.',
      pitfall: '히스토그램 없이 분위수만 쓰면 부정확해요.',
    },
  },
];
