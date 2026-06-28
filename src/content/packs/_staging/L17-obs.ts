import type { Snippet } from '../../types';

export const observability: Snippet[] = [
  {
    id: 'obs-logback-basic',
    lang: 'java',
    title: 'Logback - 기본 console 출력',
    file: 'logback-spring.xml',
    code: `<?xml version='1.0' encoding='UTF-8'?>
<configuration>
  <appender name='CONSOLE' class='ch.qos.logback.core.ConsoleAppender'>
    <encoder>
      <pattern>%d{yyyy-MM-dd HH:mm:ss.SSS} [%thread] %-5level %logger{36} - %msg%n</pattern>
    </encoder>
  </appender>

  <root level='INFO'>
    <appender-ref ref='CONSOLE' />
  </root>
</configuration>`,
    explain: {
      concept: 'logback-spring.xml은 스프링 부트의 로그 출력 설정 파일이에요. 어디에, 어떤 모양으로 로그를 찍을지 정해요.',
      terms: [
        { t: 'appender', d: '로그를 어디로 보낼지 정하는 출력구' },
        { t: 'ConsoleAppender', d: '콘솔로 출력하는 appender' },
        { t: 'encoder', d: '로그의 형식을 정하는 도구' },
        { t: 'pattern', d: '로그 한 줄의 양식' },
        { t: 'level', d: '최소 로그 레벨' },
      ],
      why: '로그 모양을 한 곳에서 정해 일관되게 보려고요.',
      pitfall: 'logback.xml은 스프링 프로파일을 못 써요. -spring.xml을 쓰세요.',
    },
  },
  {
    id: 'obs-logback-rolling',
    lang: 'java',
    title: 'Logback - 롤링 파일',
    file: 'logback-spring.xml',
    code: `<appender name='FILE' class='ch.qos.logback.core.rolling.RollingFileAppender'>
  <file>logs/app.log</file>
  <rollingPolicy class='ch.qos.logback.core.rolling.SizeAndTimeBasedRollingPolicy'>
    <fileNamePattern>logs/app.%d{yyyy-MM-dd}.%i.log.gz</fileNamePattern>
    <maxFileSize>50MB</maxFileSize>
    <maxHistory>30</maxHistory>
    <totalSizeCap>2GB</totalSizeCap>
  </rollingPolicy>
  <encoder>
    <pattern>%d{ISO8601} [%thread] %-5level %logger{40} - %msg%n</pattern>
  </encoder>
</appender>`,
    explain: {
      concept: 'RollingFileAppender는 일기장이 꽉 차면 새 장으로 넘기듯, 파일이 커지거나 날짜가 바뀌면 새 파일로 넘겨요.',
      terms: [
        { t: 'RollingFileAppender', d: '파일을 돌려가며 쓰는 appender' },
        { t: 'fileNamePattern', d: '넘어간 파일의 이름 패턴' },
        { t: 'maxFileSize', d: '한 파일 최대 크기' },
        { t: 'maxHistory', d: '보관할 일수' },
        { t: 'totalSizeCap', d: '전체 로그 용량 한도' },
      ],
      why: '로그가 무한히 커지지 않게 자동으로 잘라 저장하려고요.',
      pitfall: '보관량 캡이 없으면 디스크가 꽉 차요.',
    },
  },
  {
    id: 'obs-logback-profile',
    lang: 'java',
    title: 'Logback - 프로파일별 설정',
    file: 'logback-spring.xml',
    code: `<springProfile name='dev'>
  <root level='DEBUG'>
    <appender-ref ref='CONSOLE' />
  </root>
</springProfile>

<springProfile name='prod'>
  <root level='INFO'>
    <appender-ref ref='CONSOLE' />
    <appender-ref ref='FILE' />
  </root>
</springProfile>`,
    explain: {
      concept: 'springProfile 태그로 환경(dev/prod)마다 다른 로그 설정을 적용할 수 있어요. 옷장에서 계절별 옷을 갈아입는 것과 같아요.',
      terms: [
        { t: 'springProfile', d: '활성 프로파일별 블록' },
        { t: "name='dev'", d: 'dev 프로파일에서만 적용' },
        { t: 'level=DEBUG', d: '디버그까지 출력' },
        { t: 'appender-ref', d: '사용할 appender 참조' },
        { t: 'root', d: '전체 로거의 기본 설정' },
      ],
      why: '개발에선 자세히, 운영에선 필수만 출력하려고요.',
      pitfall: 'logback.xml(스프링 아님)은 springProfile을 못 써요.',
    },
  },
  {
    id: 'obs-slf4j-logger',
    lang: 'java',
    title: 'SLF4J - Logger 사용',
    file: 'OrderService.java',
    code: `import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

public class OrderService {
  private static final Logger log = LoggerFactory.getLogger(OrderService.class);

  public void placeOrder(Long orderId) {
    log.info("주문 생성 orderId={}", orderId);
    try {
      doCharge(orderId);
    } catch (Exception e) {
      log.error("결제 실패 orderId={}", orderId, e);
    }
  }
}`,
    explain: {
      concept: 'SLF4J는 로그를 찍는 표준 인터페이스예요. 구현체(Logback)를 바꿔도 코드는 그대로 사용할 수 있어요.',
      terms: [
        { t: 'Logger', d: '로그를 찍는 객체' },
        { t: 'LoggerFactory.getLogger()', d: '클래스별 로거 생성' },
        { t: 'log.info()', d: 'INFO 레벨 로그' },
        { t: '{}', d: '값을 끼워 넣는 자리표시자' },
        { t: 'log.error(msg, e)', d: '예외와 함께 에러 로그' },
      ],
      why: '구현체와 코드를 분리해 유연하게 로그를 남기려고요.',
      pitfall: '문자열 결합(+) 대신 {} 자리표시자를 쓰면 성능이 좋아요.',
    },
  },
  {
    id: 'obs-slf4j-lombok',
    lang: 'java',
    title: 'SLF4J - Lombok @Slf4j',
    file: 'PaymentService.java',
    code: `import lombok.extern.slf4j.Slf4j;

@Slf4j
public class PaymentService {
  public void charge(Long orderId, int amount) {
    log.debug("결제 시작 orderId={} amount={}", orderId, amount);
    log.info("결제 완료 orderId={}", orderId);
  }
}`,
    explain: {
      concept: '@Slf4j는 롬복이 알아서 log 필드를 만들어주는 단축키예요. 매번 LoggerFactory를 적지 않아도 돼요.',
      terms: [
        { t: '@Slf4j', d: '롬복이 log 필드를 주입' },
        { t: 'log', d: '자동 생성된 로거' },
        { t: 'log.debug()', d: '디버그 레벨 로그' },
        { t: 'lombok.extern.slf4j', d: 'Slf4j 어노테이션 패키지' },
        { t: '{}', d: '자리표시자' },
      ],
      why: '보일러플레이트를 줄여 코드를 깔끔하게 하려고요.',
      pitfall: '롬복 미설정 시 log를 못 찾아 컴파일 에러가 나요.',
    },
  },
  {
    id: 'obs-log-levels',
    lang: 'java',
    title: '로그 레벨 - TRACE~ERROR',
    file: 'UserService.java',
    code: `@Slf4j
public class UserService {
  public void login(String userId) {
    log.trace("login 진입 userId={}", userId);
    log.debug("조회 쿼리 실행 userId={}", userId);
    log.info("로그인 성공 userId={}", userId);
    log.warn("비밀번호 3회 실패 userId={}", userId);
    log.error("인증 서비스 응답 없음 userId={}", userId);
  }
}`,
    explain: {
      concept: '로그 레벨은 소리 크기 조절 같아요. TRACE(아주 작은 소리)부터 ERROR(큰 비상벨)까지 상황에 따라 다르게 남겨요.',
      terms: [
        { t: 'trace', d: '가장 상세한 진단용 로그' },
        { t: 'debug', d: '개발 중 디버깅 로그' },
        { t: 'info', d: '정상 동작 요약' },
        { t: 'warn', d: '주의 필요 상황' },
        { t: 'error', d: '오류/예외' },
      ],
      why: '중요도별로 로그를 걸러 보려고요.',
      pitfall: '운영에서 DEBUG 이하를 켜두면 로그 폭주해요.',
    },
  },
  {
    id: 'obs-mdc-context',
    lang: 'java',
    title: 'MDC - 요청 컨텍스트 주입',
    file: 'RequestLoggingFilter.java',
    code: `import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.UUID;
import org.slf4j.MDC;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

@Component
public class RequestLoggingFilter extends OncePerRequestFilter {
  @Override
  protected void doFilterInternal(HttpServletRequest req, HttpServletResponse res, FilterChain chain)
      throws ServletException, IOException {
    String traceId = req.getHeader("X-Trace-Id");
    if (traceId == null) traceId = UUID.randomUUID().toString();
    MDC.put("traceId", traceId);
    MDC.put("userId", req.getHeader("X-User-Id"));
    try {
      chain.doFilter(req, res);
    } finally {
      MDC.clear();
    }
  }
}`,
    explain: {
      concept: 'MDC는 로그에 자동으로 붙는 손목밴드 같아요. 요청마다 traceId, userId를 넣어두면 같은 요청의 로그가 한 줄로 추적돼요.',
      terms: [
        { t: 'MDC', d: 'Mapped Diagnostic Context' },
        { t: 'MDC.put()', d: '현재 스레드에 값 저장' },
        { t: 'traceId', d: '요청 추적 ID' },
        { t: 'OncePerRequestFilter', d: '요청당 1회 실행 보장' },
        { t: 'MDC.clear()', d: '스레드 풀 재사용 전 정리' },
      ],
      why: '요청마다 격리된 추적 정보를 로그에 묻어내려고요.',
      pitfall: 'finally에서 clear 안 하면 스레드 풀에서 값이 새어요.',
    },
  },
  {
    id: 'obs-mdc-log-pattern',
    lang: 'java',
    title: 'MDC - 로그 패턴에 출력',
    file: 'logback-spring.xml',
    code: `<configuration>
  <appender name='CONSOLE' class='ch.qos.logback.core.ConsoleAppender'>
    <encoder>
      <pattern>%d{HH:mm:ss.SSS} [%X{traceId}] [%X{userId}] %-5level %logger - %msg%n</pattern>
    </encoder>
  </appender>
  <root level='INFO'>
    <appender-ref ref='CONSOLE' />
  </root>
</configuration>`,
    explain: {
      concept: '%X{키} 패턴은 MDC에 넣어둔 값을 로그에 꽂아 줘요. 추적 ID가 자동으로 매 줄에 찍혀요.',
      terms: [
        { t: '%X{traceId}', d: 'MDC의 traceId 값을 출력' },
        { t: '%X{userId}', d: 'MDC의 userId 출력' },
        { t: '[]', d: '값을 감싸는 괄호(가독성)' },
        { t: 'pattern', d: '로그 양식' },
        { t: 'encoder', d: '패턴 적용 도구' },
      ],
      why: '모든 로그에 추적 정보를 자동으로 묻어내려고요.',
      pitfall: '값이 없으면 빈 괄호로 나와요. 기본값은 %X{키:-기본값}으로 지정하세요.',
    },
  },
  {
    id: 'obs-json-logging',
    lang: 'java',
    title: '구조화 로깅 - JSON',
    file: 'logback-spring.xml',
    code: `<appender name='JSON' class='ch.qos.logback.core.ConsoleAppender'>
  <encoder class='net.logstash.logback.encoder.LogstashEncoder'>
    <includeMdc>true</includeMdc>
    <customFields>{"app":"codemaster"}</customFields>
    <fieldNames>
      <timestamp>@timestamp</timestamp>
      <message>message</message>
    </fieldNames>
  </encoder>
</appender>
<root level='INFO'>
  <appender-ref ref='JSON' />
</root>`,
    explain: {
      concept: 'JSON 로깅은 로그를 기계가 읽기 좋은 JSON으로 내보내는 거예요. Elasticsearch 같은 도구가 색인하기 쉬워요.',
      terms: [
        { t: 'LogstashEncoder', d: 'JSON 형식 로그 인코더' },
        { t: 'includeMdc', d: 'MDC 값을 JSON에 포함' },
        { t: 'customFields', d: '매 로그에 들어갈 고정 필드 — 반드시 큰따옴표 JSON' },
        { t: '@timestamp', d: '시각 필드 이름' },
        { t: 'message', d: '메시지 필드 이름' },
      ],
      why: '로그 수집 시스템이 구조화된 데이터로 검색·집계하게 하려고요.',
      pitfall: 'customFields 값을 작은따옴표 JSON으로 쓰면 파싱 실패로 앱이 뜨지 않아요. 반드시 큰따옴표를 써야 해요.',
    },
  },
  {
    id: 'obs-spring-actuator-loggers',
    lang: 'java',
    title: 'Actuator - 런타임 로그 레벨 변경',
    file: 'application.yml',
    code: `management:
  endpoints:
    web:
      exposure:
        include: health,info,loggers,metrics
  endpoint:
    loggers:
      enabled: true

logging:
  level:
    com.codemaster: INFO
    org.hibernate.SQL: OFF`,
    explain: {
      concept: 'Actuator의 loggers 엔드포인트는 실행 중인 앱의 로그 레벨을 외부에서 바꿔요. 재시작 없이 INFO→DEBUG로 띄울 수 있어요.',
      terms: [
        { t: 'management.endpoints', d: 'Actuator 엔드포인트 설정' },
        { t: 'exposure.include', d: '노출할 엔드포인트 목록' },
        { t: 'endpoint.loggers', d: '로그 레벨 관리 엔드포인트' },
        { t: 'logging.level', d: '패키지별 로그 레벨' },
        { t: 'org.hibernate.SQL', d: 'Hibernate SQL 로그' },
      ],
      why: '장애 시 재배포 없이 상세 로그를 급하게 켜려고요.',
      pitfall: 'loggers 엔드포인트가 노출되면 외부에서 로그를 조작할 수 있어요. 보안을 잠가요.',
    },
  },
  {
    id: 'obs-micrometer-tracing-deps',
    lang: 'java',
    title: 'Micrometer Tracing - 의존성',
    file: 'build.gradle + application.yml',
    code: `// -- build.gradle --
dependencies {
  implementation 'org.springframework.boot:spring-boot-starter-actuator'
  implementation 'io.micrometer:micrometer-tracing-bridge-brave'
  implementation 'io.zipkin.reporter2:zipkin-reporter-brave'
  runtimeOnly 'io.micrometer:micrometer-registry-prometheus'
}

// -- application.yml --
// management:
//   tracing:
//     sampling:
//       probability: 1.0
//   zipkin:
//     tracing:
//       endpoint: http://zipkin:9411/api/v2/spans`,
    explain: {
      concept: 'Micrometer Tracing은 요청이 여러 서비스를 거치는 동안 발자취(trace)를 묶어주는 도구예요. Brave 브리지로 Zipkin에 보내요.',
      terms: [
        { t: 'micrometer-tracing-bridge-brave', d: 'Brave 트레이서 연결 브리지' },
        { t: 'zipkin-reporter-brave', d: 'Zipkin으로 전송' },
        { t: 'sampling.probability', d: '샘플링 비율(1.0=전체)' },
        { t: 'zipkin.endpoint', d: 'Zipkin 수신 주소' },
        { t: 'actuator', d: '관리 엔드포인트 제공' },
      ],
      why: '분산 환경에서 요청 흐름을 한 줄로 추적하려고요.',
      pitfall: '운영에선 probability를 0.1 정도로 줄여 부하를 빼요.',
    },
  },
  {
    id: 'obs-trace-ids-propagate',
    lang: 'java',
    title: 'Micrometer - traceId 자동 전파',
    file: 'OrderClient.java',
    code: `@Service
public class OrderClient {
  private final RestClient restClient;

  public OrderClient(RestClient.Builder b) {
    this.restClient = b.baseUrl("http://payment/api").build();
  }

  public void pay(Long orderId) {
    restClient.post()
      .uri("/charge/" + orderId)
      .retrieve()
      .toBodilessEntity();
  }
}`,
    explain: {
      concept: 'Micrometer가 RestClient/WebClient에 자동으로 trace 헤더를 붙여줘요. 코드를 손대지 않아도 다음 서비스로 발자취가 이어져요.',
      terms: [
        { t: 'RestClient', d: '스프링 6.1 동기 HTTP 클라이언트' },
        { t: 'RestClient.Builder', d: '빌더로 클라이언트 생성' },
        { t: '.retrieve()', d: '요청 실행' },
        { t: 'toBodilessEntity()', d: '본문 없는 응답' },
        { t: 'trace 헤더', d: 'traceparent 등 자동 주입' },
      ],
      why: '분산 추적 헤더를 매번 수동으로 안 넣으려고요.',
      pitfall: '직접 만든 HttpClient는 헤더 전파가 안 될 수 있어요.',
    },
  },
  {
    id: 'obs-zipkin-query',
    lang: 'java',
    title: 'Zipkin - 트레이스 조회',
    file: 'zipkin-trace.json',
    code: `// Zipkin UI에서 traceId 검색 -> 호출 흐름(span) 시각화
// {
//   "traceId": "5b8aa5a2d3c91e83",
//   "spans": [
//     { "name": "post /orders", "serviceName": "api", "duration": 142 },
//     { "name": "charge", "serviceName": "payment", "duration": 87 },
//     { "name": "select * from payment", "serviceName": "payment-db", "duration": 12 }
//   ]
// }
// 위 데이터를 Zipkin UI(http://localhost:9411)에서 traceId로 검색하면
// 각 span을 타임라인으로 시각화해줘요.`,
    explain: {
      concept: 'Zipkin은 모아둔 span을 한 화면에 타임라인으로 그려줘요. 어느 구간이 느린지, 어디서 실패했는지 한눈에 봐요.',
      terms: [
        { t: 'traceId', d: '요청 하나를 묶는 ID' },
        { t: 'span', d: '한 단계 작업 단위' },
        { t: 'serviceName', d: '서비스 이름' },
        { t: 'duration', d: '구간 소요 시간(ms)' },
        { t: 'Zipkin UI', d: '조회 화면(기본 포트 9411)' },
      ],
      why: '분산 시스템의 병목/실패 구간을 시각적으로 찾으려고요.',
      pitfall: '샘플링 중엔 모든 요청이 안 보여요. 장애 케이스는 별도 보관하세요.',
    },
  },
  {
    id: 'obs-sentry-spring-boot',
    lang: 'java',
    title: 'Sentry - 스프링 부트 연동',
    file: 'application.yml',
    code: `sentry:
  dsn: https://abc@sentry.io/123
  environment: prod
  release: codemaster@1.0.0
  traces-sample-rate: 0.2
  send-default-pii: false
  logging:
    minimum-event-level: error
    minimum-breadcrumb-level: info`,
    explain: {
      concept: 'Sentry는 앱에서 터진 에러를 클라우드로 모아주는 비서예요. 에러 발생 시 자동으로 보고하고, 발생 위치까지 추적해줘요.',
      terms: [
        { t: 'dsn', d: 'Sentry 프로젝트 주소' },
        { t: 'environment', d: '환경 이름(dev/prod)' },
        { t: 'release', d: '버전 태그' },
        { t: 'traces-sample-rate', d: '성능 트레이스 샘플링 비율' },
        { t: 'minimum-event-level', d: '이벤트로 보낼 최소 레벨' },
      ],
      why: '운영 에러를 한곳에 모아 빠르게 원인을 찾으려고요.',
      pitfall: 'send-default-pii를 true로 두면 개인정보가 새어나가요.',
    },
  },
  {
    id: 'obs-sentry-manual-capture',
    lang: 'java',
    title: 'Sentry - 수동 예외 보내기',
    file: 'PaymentService.java',
    code: `import io.sentry.Sentry;

@Slf4j
public class PaymentService {
  public void charge(Long orderId) {
    try {
      doRemoteCharge(orderId);
    } catch (Exception e) {
      log.error("결제 실패 orderId={}", orderId, e);
      Sentry.withScope(scope -> {
        scope.setTag("orderId", String.valueOf(orderId));
        scope.setExtra("retryCount", 3);
        Sentry.captureException(e);
      });
    }
  }
}`,
    explain: {
      concept: 'withScope 블록 안에서 태그와 부가 정보를 설정한 뒤 captureException으로 Sentry에 에러를 보낼 수 있어요.',
      terms: [
        { t: 'Sentry.withScope()', d: '임시 범위 내에서 태그·extra 설정 후 전송' },
        { t: 'scope.setTag()', d: '검색 가능한 태그 추가' },
        { t: 'scope.setExtra()', d: '참고용 부가 정보 추가' },
        { t: 'Sentry.captureException()', d: '예외를 Sentry로 전송' },
        { t: 'orderId', d: '주문 식별자 — 태그로 검색 가능' },
      ],
      why: '에러 메시지만으로는 부족한 문맥을 함께 보내려고요.',
      pitfall: 'captureException(e, scopeCallback) 오버로드는 존재하지 않아요. 반드시 withScope() 패턴을 써야 해요.',
    },
  },
  {
    id: 'obs-structured-log-fields',
    lang: 'java',
    title: '구조화 로깅 - Key=Value',
    file: 'OrderService.java',
    code: `@Slf4j
public class OrderService {
  public void placeOrder(Long orderId, String userId, int amount) {
    log.info("event=order_placed order_id={} user_id={} amount={}",
        orderId, userId, amount);

    if (amount > 1_000_000) {
      log.warn("event=large_order amount={} order_id={}", amount, orderId);
    }
  }
}`,
    explain: {
      concept: 'key=value 형식은 사람과 기계 모두가 읽기 좋은 형태예요. 한 줄에 이벤트 이름과 값을 묶어두면 검색이 쉬워요.',
      terms: [
        { t: 'event=order_placed', d: '이벤트 이름 태그' },
        { t: 'order_id={}', d: '주문 ID 자리표시자' },
        { t: 'user_id', d: '사용자 ID 키' },
        { t: 'amount', d: '금액 키' },
        { t: 'log.warn', d: '주의 로그 레벨' },
      ],
      why: '로그 검색/집계를 일관된 키로 쉽게 하려고요.',
      pitfall: '키 이름을 매번 다르게 적으면 검색이 안 돼요. 명명 규칙을 정하세요.',
    },
  },
  {
    id: 'obs-actuator-health',
    lang: 'java',
    title: 'Actuator - Health 그룹',
    file: 'application.yml',
    code: `management:
  endpoint:
    health:
      show-details: when-authorized
      group:
        readiness:
          include: db,redis
        liveness:
          include: ping
      probes:
        enabled: true
  health:
    defaults:
      enabled: false
    db:
      enabled: true`,
    explain: {
      concept: 'Health 그룹은 헬스체크를 용도별로 나눠요. liveness는 살아있는지, readiness는 트래픽 받을 준비가 됐는지 검사해요.',
      terms: [
        { t: 'show-details', d: '세부 항목 노출 정책' },
        { t: 'group.readiness', d: '준비 상태 검사 그룹' },
        { t: 'group.liveness', d: '생존 상태 검사 그룹' },
        { t: 'include', d: '포함할 검사 항목' },
        { t: 'probes.enabled', d: 'k8s 프로브 자동 구성' },
      ],
      why: 'k8s의 liveness/readiness 프로브와 맞춰 안전한 배포를 하려고요.',
      pitfall: 'show-details: always는 DB 연결 정보가 노출될 수 있어요.',
    },
  },
  {
    id: 'obs-metrics-custom',
    lang: 'java',
    title: 'Micrometer - 커스텀 메트릭',
    file: 'OrderMetrics.java',
    code: `import io.micrometer.core.instrument.Counter;
import io.micrometer.core.instrument.MeterRegistry;
import org.springframework.stereotype.Component;

@Component
public class OrderMetrics {
  private final Counter ordersPlaced;

  public OrderMetrics(MeterRegistry registry) {
    this.ordersPlaced = Counter.builder("codemaster.orders.placed")
        .description("생성된 주문 수")
        .tag("type", "normal")
        .register(registry);
  }

  public void onOrderPlaced() {
    ordersPlaced.increment();
  }
}`,
    explain: {
      concept: 'Micrometer로 우리 앱만의 메트릭(예: 주문 수)을 만들어요. Counter는 오직 증가만 하는 숫자를 측정해요.',
      terms: [
        { t: 'MeterRegistry', d: '메트릭 등록 객체' },
        { t: 'Counter', d: '증가 전용 메트릭' },
        { t: 'Counter.builder', d: '카운터 생성 빌더' },
        { t: 'tag', d: '메트릭 차원(레이블)' },
        { t: 'increment()', d: '1 증가' },
      ],
      why: '비즈니스 지표를 모니터링 시스템으로 내보내려고요.',
      pitfall: '태그 값을 무한정 늘리면 카디널리티 폭발이 나요.',
    },
  },
  {
    id: 'obs-opentelemetry-sdk',
    lang: 'java',
    title: 'OpenTelemetry - OTLP 내보내기',
    file: 'application.yml',
    code: `otel:
  exporter:
    otlp:
      endpoint: http://collector:4317
      protocol: grpc
  service:
    name: codemaster-api
  traces:
    sampler: parentbased_traceidratio
  resource:
    attributes:
      deployment.environment: prod

# 샘플링 비율은 환경변수로 지정하세요:
# OTEL_TRACES_SAMPLER_ARG=0.2`,
    explain: {
      concept: 'OpenTelemetry는 표준 우편 봉투 같아요. 로그·메트릭·트레이스를 같은 양식으로 담아 수집기(collector)로 보내요.',
      terms: [
        { t: 'otlp', d: 'OTel 데이터 전송 프로토콜' },
        { t: 'endpoint', d: '수집기 주소' },
        { t: 'service.name', d: '서비스 이름 속성' },
        { t: 'sampler', d: '트레이스 샘플링 방식' },
        { t: 'OTEL_TRACES_SAMPLER_ARG', d: '샘플링 비율 환경변수(0.0~1.0)' },
      ],
      why: '벤더에 얽매이지 않고 관측 데이터를 한 곳으로 모으려고요.',
      pitfall: '수집기가 죽으면 데이터가 유실돼요. 큐/재시도를 켜세요.',
    },
  },
  {
    id: 'obs-async-appender',
    lang: 'java',
    title: 'Logback - AsyncAppender 비동기 로깅',
    file: 'logback-spring.xml',
    code: `<appender name='ASYNC_FILE' class='ch.qos.logback.classic.AsyncAppender'>
  <!-- 큐에 담아 별도 스레드로 파일에 써요 -->
  <queueSize>512</queueSize>
  <discardingThreshold>0</discardingThreshold>
  <includeCallerData>false</includeCallerData>
  <appender-ref ref='FILE' />
</appender>

<root level='INFO'>
  <appender-ref ref='ASYNC_FILE' />
</root>`,
    explain: {
      concept: 'AsyncAppender는 로그를 즉시 파일에 쓰지 않고 큐에 담았다가 별도 스레드가 비동기로 써요. 요청 처리 스레드가 로그 I/O 때문에 느려지는 것을 막아요.',
      terms: [
        { t: 'AsyncAppender', d: '비동기 방식으로 감싸는 래퍼 appender' },
        { t: 'queueSize', d: '대기열 크기 — 가득 차면 블로킹' },
        { t: 'discardingThreshold', d: '큐가 이 % 이하면 TRACE/DEBUG 버림(0=버리지 않음)' },
        { t: 'includeCallerData', d: '호출자 파일·줄번호 포함 여부(false=빠름)' },
        { t: 'appender-ref', d: '실제로 쓸 하위 appender 지정' },
      ],
      why: '로그 I/O가 요청 처리 지연으로 이어지지 않게 비동기로 분리하려고요.',
      pitfall: 'queueSize를 너무 작게 두면 큐가 꽉 찰 때 블로킹이 생겨요. 앱 종료 시 큐가 비워지기 전에 프로세스가 죽으면 로그가 유실돼요.',
    },
  },
];
