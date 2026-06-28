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
      concept:
        'logback-spring.xml은 스프링 부트의 "로그 디자인 설계도"예요. ' +
        'appender는 로그를 어디로 보낼지(콘솔, 파일, 소켓 등) 정하는 출력구이고, encoder는 한 줄 한 줄의 형식을 정해요. ' +
        'pattern 속성의 %d는 날짜, %-5level은 로그 레벨, %logger{36}은 클래스 이름을 36자로 자른 값이에요. ' +
        'root level="INFO"는 "INFO 이상의 로그만 출력하겠다"는 최소 기준을 정하는 부분이에요. ' +
        '실무에서는 모든 스프링 부트 앱이 이 파일 하나로 로그 출력 통일성을 갖춰요.',
      terms: [
        { t: 'appender name="CONSOLE"', d: '로그를 콘솔로 보내는 출력구예요. name은 다른 곳에서 ref로 참조할 때 써요' },
        { t: 'ConsoleAppender', d: 'System.out(또는 System.err)으로 로그를 출력하는 Logback 기본 appender예요' },
        { t: 'encoder.pattern', d: '로그 한 줄에 들어갈 요소(시간, 스레드, 레벨, 메시지)의 배치 양식을 정의해요' },
        { t: '%-5level', d: '로그 레벨을 5자리로 고정하고 왼쪽 정렬(-)해 출력해요. INFO 앞에 공백 하나가 붙어요' },
        { t: 'root level="INFO"', d: '모든 로거의 기본 최소 레벨을 INFO로 설정해요. DEBUG·TRACE는 무시돼요' },
      ],
      why:
        '로그 출력 양식을 한곳에서 관리해 모든 로그가 일관된 형식을 갖추게 하고, ' +
        '레벨 필터링으로 필요 없는 상세 로그를 차단하려고요.',
      expectedOutput:
        '앱 실행 시 콘솔:\n' +
        '2026-06-29 10:00:00.123 [main]  INFO com.codemaster.App - Started App in 2.5s',
      realWorldUsage:
        '실제 스프링 부트 앱은 이 XML 설정을 src/main/resources/logback-spring.xml에 두고, ' +
        '운영 환경에서는 FILE appender를 추가해 컨테이너 로그 드라이버와 연동해요.',
      pitfall:
        '파일명을 logback.xml로 지으면 springProfile 태그를 인식하지 못해요. ' +
        '스프링 부트 환경 프로파일을 쓰려면 반드시 logback-spring.xml로 이름을 지어야 해요.',
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
      concept:
        'RollingFileAppender는 일기장이 다 찼을 때 새 장으로 넘기듯, 로그 파일이 일정 크기나 기간을 넘으면 새 파일로 전환해요. ' +
        'SizeAndTimeBasedRollingPolicy는 날짜가 바뀌거나 파일 크기가 50MB를 넘으면 다음 파일로 넘기는 규칙이에요. ' +
        'fileNamePattern의 %d는 날짜, %i는 같은 날짜 내에서 파일이 여러 개일 때 붙는 일련번호예요. .gz가 붙으면 오래된 파일은 자동 압축돼요. ' +
        'maxHistory 30은 30일 지난 파일을 자동 삭제하고, totalSizeCap 2GB는 전체 로그 용량을 2GB 이내로 제한해요.',
      terms: [
        { t: 'RollingFileAppender', d: '로그 파일이 커지면 자동으로 새 파일로 돌려가며 쓰는 appender예요' },
        { t: 'fileNamePattern', d: '넘어간 파일의 이름을 어떻게 지을지 정의해요. 날짜와 일련번호가 들어가요' },
        { t: 'maxFileSize: 50MB', d: '한 파일당 최대 50MB까지 쓸 수 있어요. 초과하면 .%i가 올라간 새 파일이 생겨요' },
        { t: 'maxHistory: 30', d: '30일이 지난 오래된 로그 파일을 자동으로 삭제해요' },
        { t: 'totalSizeCap: 2GB', d: '전체 로그 파일 크기의 상한이에요. 이 용량을 넘으면 가장 오래된 파일부터 지워요' },
      ],
      why:
        '로그 파일이 무한정 커져서 디스크가 가득 차는 사고를 막고, ' +
        '필요한 기간만큼만 자동 보관해 스토리지 비용을 관리하려고요.',
      expectedOutput:
        'logs/ 디렉터리:\n' +
        'logs/app.log              (현재)\n' +
        'logs/app.2026-06-28.0.log.gz (어제, 압축됨)\n' +
        'logs/app.2026-06-28.1.log.gz (어제, 50MB 초과로 분할)',
      realWorldUsage:
        '실제 운영 서버에서 로그 수집 에이전트(Filebeat 등)가 이 롤링 파일을 읽어 Elasticsearch로 보내요. ' +
        '압축된 .gz 파일도 에이전트가 투명하게 읽을 수 있어요.',
      pitfall:
        'totalSizeCap을 설정하지 않으면 maxHistory가 있어도 아주 오래된 파일이 영원히 남을 수 있어요. ' +
        '두 설정을 함께 쓰는 게 디스크 보호의 안전벨트예요.',
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
      concept:
        'springProfile 태그는 "옷장에서 계절별 옷을 갈아입듯" 환경마다 다른 로그 설정을 적용할 수 있는 구분 칸막이예요. ' +
        'dev 프로파일이 활성화되면 DEBUG 레벨로 상세한 로그를 콘솔에만 찍고, prod에서는 INFO 이상만 콘솔과 파일에 동시에 남겨요. ' +
        '실무에서는 로컬 개발은 DEBUG, QA/스테이징은 INFO, 운영은 WARN으로 레벨을 단계적으로 올려요.',
      terms: [
        { t: 'springProfile', d: '스프링의 active profile에 따라 내부 설정을 선택적으로 활성화하는 태그예요' },
        { t: "name='dev'", d: 'spring.profiles.active=dev일 때만 이 블록의 설정이 적용돼요' },
        { t: 'level="DEBUG"', d: 'TRACE를 제외한 DEBUG 이상의 모든 로그를 출력해요. 개발 중에 상세 디버깅이 필요할 때 써요' },
        { t: 'appender-ref ref="FILE"', d: 'prod에서만 파일 appender를 추가로 참조해 로그를 영구 저장해요' },
        { t: 'root', d: '모든 로거에 적용되는 기본 설정의 루트 노드예요. 개별 패키지별로 덮어쓸 수 있어요' },
      ],
      why:
        '개발 중에는 자세하게, 운영에서는 필수 항목만 보기 위해 ' +
        '한 파일 안에서 환경별로 로그 설정을 분기하려고요.',
      expectedOutput:
        'dev 프로파일(sprint-boot:run --spring.profiles.active=dev):\n' +
        'DEBUG o.s.w.s.DispatcherServlet - GET "/api/health"\n' +
        'prod 프로파일: (DEBUG 로그는 보이지 않고 INFO 이상만 출력)',
      realWorldUsage:
        '실제 프로젝트에서 application-dev.yml에 debug: true를 켜고, 해당 프로파일로 개발 서버를 띄우면 ' +
        'SQL 바인딩 값까지 로그로 확인할 수 있어 디버깅이 훨씬 빨라져요.',
      pitfall:
        'logback.xml(스프링 지원 없이 순수 Logback) 파일에서는 springProfile 태그를 쓸 수 없어요. ' +
        '반드시 파일명을 logback-spring.xml로 해야 springProfile이 동작해요.',
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
    System.out.println("[실행] placeOrder 호출 - orderId: " + orderId);
    log.info("주문 생성 orderId={}", orderId);
    try {
      doCharge(orderId);
    } catch (Exception e) {
      log.error("결제 실패 orderId={}", orderId, e);
    }
  }

  private void doCharge(Long orderId) {
    throw new RuntimeException("PG timeout");
  }
}`,
    explain: {
      concept:
        'SLF4J(Simple Logging Facade for Java)는 로그를 찍는 "표준 리모컨"이에요. ' +
        '실제 로그 엔진(Logback, Log4j2 등)이 뒤에 무엇이든, 코드는 똑같은 Logger 인터페이스로 로그를 찍어요. ' +
        'LoggerFactory.getLogger(클래스명.class)로 클래스마다 전용 로거를 만들고, {} 자리표시자(placeholder)를 써서 값 끼워 넣기를 해요. ' +
        '실무에서는 SLF4J를 통해 코드는 그대로 두고 로그 엔진만 교체할 수 있어서, 벤더 종속을 피할 수 있어요.',
      terms: [
        { t: 'Logger', d: '로그를 남기는 표준 인터페이스예요. info(), debug(), error() 같은 메서드를 제공해요' },
        { t: 'LoggerFactory.getLogger(OrderService.class)', d: 'OrderService 전용 로거를 생성해요. 로그에 클래스명이 자동으로 찍혀요' },
        { t: 'log.info("주문 생성 orderId={}", orderId)', d: '{} 자리에 orderId 값을 끼워 넣어 INFO 레벨 로그를 남겨요' },
        { t: '{}', d: '문자열 연결(+) 대신 써서 성능을 높이는 자리표시자예요. 로그 레벨이 꺼져 있으면 값 계산 자체를 건너뛰어요' },
        { t: 'log.error(msg, e)', d: '마지막 인자로 예외 객체를 넘기면 스택 트레이스를 함께 출력해줘요' },
      ],
      why:
        '로그 구현체(Logback, Log4j2)와 코드를 분리해 언제든 교체할 수 있게 하고, ' +
        '{} 자리표시자로 문자열 결합 비용을 없애 성능을 최적화하려고요.',
      expectedOutput:
        '[실행] placeOrder 호출 - orderId: 1001\n' +
        'INFO  OrderService - 주문 생성 orderId=1001\n' +
        'ERROR OrderService - 결제 실패 orderId=1001\n' +
        'java.lang.RuntimeException: PG timeout\n' +
        '  at OrderService.doCharge(OrderService.java:...))',
      realWorldUsage:
        '실제 서비스에서 주문·결제·배송 같은 핵심 비즈니스 로직마다 Logger를 선언하고, ' +
        '장애 발생 시 log.error의 스택 트레이스로 어느 줄에서 문제가 생겼는지 바로 추적해요.',
      pitfall:
        '문자열 + 로 연결하면 로그 레벨이 꺼져 있어도 문자열 생성 비용이 발생해요. ' +
        '항상 {} 자리표시자를 쓰면 불필요한 문자열 연산을 건너뛰어 성능 손실이 없어요.',
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
    System.out.println("[실행] charge 호출 - orderId: " + orderId + ", amount: " + amount);
    log.debug("결제 시작 orderId={} amount={}", orderId, amount);
    log.info("결제 완료 orderId={}", orderId);
  }
}`,
    explain: {
      concept:
        '@Slf4j는 롬복이 "log"라는 Logger 변수를 자동으로 만들어주는 마법 주문이에요. ' +
        '매번 LoggerFactory.getLogger(...)를 타이핑하지 않아도 클래스 단 한 줄의 어노테이션으로 Logger를 주입받아요. ' +
        '컴파일 시점에 롬복이 이 코드를 바이트코드로 풀어서 일반 LoggerFactory 호출로 변환해주기 때문에 런타임 오버헤드도 전혀 없어요. ' +
        '실무에서는 거의 모든 서비스 클래스 첫 줄에 @Slf4j를 붙이는 게 일상이 됐어요.',
      terms: [
        { t: '@Slf4j', d: '롬복이 컴파일 시점에 private static final Logger log = LoggerFactory.getLogger(현재클래스.class)를 자동 생성해요' },
        { t: 'log', d: '롬복이 주입한 Logger 인스턴스예요. 직접 선언한 적 없어도 info(), debug() 등을 바로 쓸 수 있어요' },
        { t: 'log.debug()', d: 'DEBUG 레벨 로그를 남겨요. 운영 환경에서는 보통 INFO 이상으로 설정해 보이지 않게 해요' },
        { t: 'lombok.extern.slf4j', d: 'Slf4j 어노테이션이 있는 패키지 경로예요. import 시 이 경로를 써요' },
        { t: 'amount={}', d: '정수 금액도 {} 자리표시자로 자동 변환되어 문자열에 끼워져요' },
      ],
      why:
        'Logger 선언 보일러플레이트 코드를 없애서 생산성을 높이고, ' +
        '코드 리뷰 시 핵심 비즈니스 로직에 집중할 수 있게 하려고요.',
      expectedOutput:
        '[실행] charge 호출 - orderId: 1002, amount: 50000\n' +
        'DEBUG PaymentService - 결제 시작 orderId=1002 amount=50000\n' +
        'INFO  PaymentService - 결제 완료 orderId=1002',
      realWorldUsage:
        '실제 스프링 부트 프로젝트의 Service, Controller, Component 클래스 대부분 첫 줄에 @Slf4j를 붙여 ' +
        '모든 계층에서 일관된 방식으로 로그를 남기는 게 표준 패턴이에요.',
      pitfall:
        '롬복 의존성과 annotationProcessor가 build.gradle에 둘 다 설정되지 않으면 ' +
        '컴파일 시점에 "log 변수를 찾을 수 없습니다" 에러가 나요. IDE에서도 빨간 줄이 떠요.',
    },
  },
  {
    id: 'obs-log-levels',
    lang: 'java',
    title: '로그 레벨 - TRACE~ERROR',
    file: 'UserService.java',
    code: `import lombok.extern.slf4j.Slf4j;

@Slf4j
public class UserService {

  public void login(String userId) {
    System.out.println("[실행] login 호출 - userId: " + userId);
    log.trace("login 진입 userId={}", userId);
    log.debug("조회 쿼리 실행 userId={}", userId);
    log.info("로그인 성공 userId={}", userId);
    log.warn("비밀번호 3회 실패 userId={}", userId);
    log.error("인증 서비스 응답 없음 userId={}", userId);
  }
}`,
    explain: {
      concept:
        '로그 레벨은 "소리 크기 조절 다이얼" 같아요. TRACE(속삭임), DEBUG(대화), INFO(보고), WARN(주의), ERROR(비상벨) 순으로 심각도가 올라가요. ' +
        '실무에서는 이 레벨을 기준으로 로그 필터링을 해서, 운영에선 INFO 이상만 보이게 하면 TRACE/DEBUG 로그는 무시돼요. ' +
        'TRACE는 메서드 진입·루프 내부까지 극도로 상세히 기록할 때 쓰고, WARN은 당장 문제는 아니지만 방치하면 위험한 상황을 알릴 때 써요.',
      terms: [
        { t: 'trace', d: '가장 상세한 수준이에요. 메서드 진입, 루프 내부 변수 값 등 극소 단위 진단에 써요' },
        { t: 'debug', d: '개발 중 SQL 바인딩 값, 중간 결과 등 디버깅용 정보예요. 운영에선 보통 꺼둬요' },
        { t: 'info', d: '로그인 성공, 주문 완료 같은 정상 동작의 요약 정보예요. 운영에서도 항상 켜둬요' },
        { t: 'warn', d: '당장 실패는 아니지만 주의가 필요한 상황이에요. 임계치 근접, 재시도 등에 써요' },
        { t: 'error', d: '예외 발생, 결제 실패 같은 실제 오류 상황이에요. 알람과 연동되는 경우가 많아요' },
      ],
      why:
        '심각도별로 로그를 단계적으로 남겨, 운영 중에는 핵심만 빠르게 보고 ' +
        '문제 발생 시에만 DEBUG 이하를 동적으로 켜서 상세 원인을 추적하려고요.',
      expectedOutput:
        '(INFO 이상만 출력하도록 설정된 경우):\n' +
        '[실행] login 호출 - userId: user001\n' +
        'INFO  UserService - 로그인 성공 userId=user001\n' +
        'WARN  UserService - 비밀번호 3회 실패 userId=user001\n' +
        'ERROR UserService - 인증 서비스 응답 없음 userId=user001',
      realWorldUsage:
        '실제 서비스 운영 중 "로그인이 안 돼요" 문의가 오면, 운영자는 Actuator loggers 엔드포인트로 ' +
        '해당 패키지 레벨을 DEBUG로 올려 SQL 쿼리까지 확인한 뒤 INFO로 되돌려요.',
      pitfall:
        '운영 환경에서 DEBUG나 TRACE를 켜둔 채 방치하면 초당 수천 건의 로그가 쌓여 ' +
        '디스크가 꽉 차거나 로그 수집 비용이 폭증해요. 반드시 INFO 이상으로 기본 설정하세요.',
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
    if (traceId == null) {
      traceId = UUID.randomUUID().toString();
    }
    System.out.println("[실행] MDC.put traceId: " + traceId);
    MDC.put("traceId", traceId);
    MDC.put("userId", req.getHeader("X-User-Id"));
    try {
      chain.doFilter(req, res);
    } finally {
      System.out.println("[정리] MDC.clear()");
      MDC.clear();
    }
  }
}`,
    explain: {
      concept:
        'MDC(Mapped Diagnostic Context)는 "로그에 자동으로 따라붙는 손목밴드"예요. ' +
        '각 HTTP 요청이 시작될 때 traceId와 userId를 MDC에 담아두면, 이후 모든 로그 줄에 이 값들이 자동으로 찍혀요. ' +
        'OncePerRequestFilter를 상속하면 필터가 여러 번 등록돼도 요청당 딱 한 번만 실행되는 게 보장돼요. ' +
        'finally 블록의 MDC.clear()는 스레드 풀에 반납되기 전에 손목밴드를 반납하는 필수 정리 과정이에요.',
      terms: [
        { t: 'MDC', d: '현재 스레드에 키-값 쌍을 보관하는 맵이에요. put()으로 넣고 로그 패턴의 %X{키}로 출력해요' },
        { t: 'MDC.put("traceId", traceId)', d: 'traceId를 현재 스레드의 MDC 맵에 저장해 이후 모든 로그에 포함시켜요' },
        { t: 'UUID.randomUUID().toString()', d: '고유한 임의의 추적 ID를 생성해요. 전 세계적으로 겹치지 않아요' },
        { t: 'OncePerRequestFilter', d: '요청 한 건당 단 한 번만 실행되는 필터 베이스 클래스예요' },
        { t: 'MDC.clear()', d: '스레드에 저장된 모든 MDC 값을 삭제해요. finally로 감싸야 스레드 풀 재사용 시 값이 새지 않아요' },
      ],
      why:
        '요청마다 고유 ID를 로그에 묻혀서, 여러 스레드가 동시에 남긴 로그에서도 ' +
        '같은 요청의 로그를 한 줄로 추적하려고요.',
      expectedOutput:
        '[실행] MDC.put traceId: a1b2c3d4-e5f6-...\n' +
        '(이후 모든 로그에 [a1b2c3d4-e5f6-...]가 자동 포함)\n' +
        '[정리] MDC.clear()',
      realWorldUsage:
        '실제 마이크로서비스에서 들어온 traceparent 헤더를 MDC에 담아 ' +
        'API Gateway → Order Service → Payment Service까지 동일 traceId로 모든 로그를 연결해요.',
      pitfall:
        'finally에서 MDC.clear()를 호출하지 않으면 A 요청의 traceId가 B 요청의 로그에 묻어나올 수 있어요. ' +
        '스레드 풀 환경에서는 항상 try-finally로 감싸서 반드시 청소해야 해요.',
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
      concept:
        '%X{키} 패턴은 MDC에 저장된 값을 로그에 자동으로 박아넣는 특수 문법이에요. ' +
        'RequestLoggingFilter에서 MDC.put("traceId", ...)로 값을 넣어두면, 이 패턴 덕분에 매 로그 줄 앞에 [traceId]가 자동으로 찍혀요. ' +
        'userId도 마찬가지로 모든 로그 라인에 함께 인쇄돼서 "누가, 어떤 요청에서" 로그를 남겼는지 바로 알 수 있어요. ' +
        '실무에서는 %X{키:-기본값} 형식으로 값이 없을 때 기본값을 지정해 빈 괄호가 찍히는 걸 방지해요.',
      terms: [
        { t: '%X{traceId}', d: 'MDC에 저장된 traceId 키의 값을 가져와 로그에 출력해요. 값이 없으면 빈 문자열이 찍혀요' },
        { t: '%X{userId}', d: 'MDC에서 userId 값을 꺼내 출력해요. 로그인 사용자 ID를 매 줄에 함께 남겨요' },
        { t: '[]', d: '추적 ID를 대괄호로 감싸 가독성을 높여요. 패턴의 일부일 뿐 특별한 문법은 아니에요' },
        { t: '%d{HH:mm:ss.SSS}', d: '시:분:초.밀리초 형식으로 시간을 출력해요. 초 단위까지 보여줘 시간 순서를 추적할 수 있어요' },
        { t: '%msg%n', d: '실제 로그 메시지와 줄바꿈을 출력해요. %n은 OS에 맞는 줄바꿈 문자로 변환돼요' },
      ],
      why:
        '모든 로그 줄에 추적 정보를 자동으로 태그처럼 붙여서 ' +
        '별도의 로그 문맥 전달 코드 없이도 요청별 로그를 한눈에 필터링하려고요.',
      expectedOutput:
        '10:00:00.123 [a1b2c3d4] [user001] INFO  OrderService - 주문 생성 orderId=1001\n' +
        '10:00:00.456 [a1b2c3d4] [user001] INFO  PaymentService - 결제 완료 orderId=1001',
      realWorldUsage:
        '실제 로그 분석 도구(Splunk, ELK)에서 traceId=* 검색 한 번으로 특정 사용자의 요청이 ' +
        '어떤 서비스들을 거쳤는지 전체 타임라인을 복원할 수 있어요.',
      pitfall:
        'MDC에 해당 키를 put하지 않으면 그냥 빈 []로 출력돼요. ' +
        '기본값을 주려면 %X{traceId:-N/A}처럼 :- 뒤에 기본값을 붙이는 문법을 쓰세요.',
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
      concept:
        '구조화 로깅(JSON)은 로그를 사람 눈이 아닌 "기계가 읽기 쉬운" JSON 형식으로 내보내는 방법이에요. ' +
        'LogstashEncoder가 로그 한 줄을 JSON 객체로 변환해주고, includeMdc: true로 MDC 값들을 JSON의 추가 필드로 포함시켜요. ' +
        'customFields로 매 로그마다 고정 필드("app":"codemaster")를 주입해 여러 앱의 로그가 섞여도 출처를 구분할 수 있어요. ' +
        '실무에서는 이 JSON을 Logstash/Filebeat로 수집해 Elasticsearch에 색인하고 Kibana로 대시보드를 만들어요.',
      terms: [
        { t: 'LogstashEncoder', d: '로그 한 줄을 Logstash 호환 JSON으로 변환하는 인코더예요. net.logstash.logback 의존성이 필요해요' },
        { t: 'includeMdc: true', d: 'MDC에 저장된 traceId, userId 같은 모든 키-값을 JSON에 추가 필드로 포함시켜요' },
        { t: 'customFields', d: '모든 로그에 공통으로 들어갈 고정 필드예요. 앱 이름, 환경 값을 여기에 넣어요' },
        { t: '@timestamp', d: 'Elasticsearch가 시간 기반 색인에 사용하는 표준 필드명이에요' },
        { t: 'message', d: '실제 로그 메시지가 들어가는 JSON 필드 이름이에요' },
      ],
      why:
        '로그 수집·검색·집계를 자동화된 파이프라인으로 처리하려면 ' +
        '사람이 파싱하기 좋은 텍스트보다 기계가 바로 해석 가능한 JSON 형식이 필요해요.',
      expectedOutput:
        '{"@timestamp":"2026-06-29T10:00:00.123Z","message":"결제 완료 orderId=1001","level":"INFO","app":"codemaster","traceId":"a1b2c3d4"}',
      realWorldUsage:
        '실제 대규모 분산 시스템에서는 모든 서비스가 JSON 로그를 중앙 수집기(Logstash, Fluentd)로 보내고, ' +
        'Kibana에서 "app:codemaster AND level:ERROR" 쿼리로 장애 로그를 실시간 검색해요.',
      pitfall:
        'customFields 값에 작은따옴표({\'app\':\'codemaster\'})를 쓰면 JSON 파서가 무효하다고 판단해 앱이 아예 시작되지 않을 수 있어요. ' +
        '반드시 큰따옴표 JSON을 사용하세요.',
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
      concept:
        'Actuator의 loggers 엔드포인트는 "비행 중 조종석 계기판"을 만지는 것과 같아요. ' +
        '앱이 이미 실행 중인 상태에서 POST /actuator/loggers/com.codemaster로 HTTP 요청을 보내면 ' +
        '로그 레벨을 INFO에서 DEBUG로 재시작 없이 즉시 변경할 수 있어요. ' +
        'logging.level 설정은 앱 시작 시의 기본값을 정하는 부분이고, org.hibernate.SQL: OFF는 하이버네이트 SQL 로그를 의도적으로 감춘 예예요. ' +
        '실무에서는 장애 의심 패키지만 일시적으로 DEBUG로 올려 로그를 수집하고, 확인이 끝나면 다시 INFO로 되돌려요.',
      terms: [
        { t: 'exposure.include: health,info,loggers,metrics', d: '외부에 노출할 Actuator 엔드포인트를 화이트리스트로 지정해요' },
        { t: 'endpoint.loggers.enabled: true', d: 'loggers 엔드포인트를 활성화해 런타임 레벨 변경 기능을 켜요' },
        { t: 'logging.level.com.codemaster: INFO', d: 'com.codemaster 패키지와 그 하위 클래스의 기본 로그 레벨을 INFO로 설정해요' },
        { t: 'org.hibernate.SQL: OFF', d: 'Hibernate가 생성하는 실행 SQL 로그를 완전히 끄는 설정이에요' },
        { t: 'management.endpoints', d: 'Actuator의 모든 엔드포인트 설정을 담는 상위 노드예요' },
      ],
      why:
        '장애 상황에서 상세 로그를 급하게 켜야 할 때 ' +
        '재배포(CI/CD + k8s rollout)를 기다리지 않고 즉시 로그 레벨만 조작해 원인을 추적하려고요.',
      expectedOutput:
        'curl -X POST http://localhost:8080/actuator/loggers/com.codemaster -H "Content-Type: application/json" -d \'{"configuredLevel":"DEBUG"}\'\n' +
        '(이후 com.codemaster 패키지의 DEBUG 레벨 로그가 콘솔에 출력되기 시작)',
      realWorldUsage:
        '실제 운영팀은 Grafana 대시보드에서 에러율 급증을 감지하면 ' +
        'Actuator API로 해당 서비스의 로그 레벨을 DEBUG로 올려 5분간 상세 추적 로그를 수집한 뒤 다시 INFO로 낮춰요.',
      pitfall:
        'loggers 엔드포인트를 외부에 그대로 노출하면 공격자가 로그 레벨을 OFF로 만들어 ' +
        '모든 감사 로그를 지워버릴 수 있어요. 반드시 Spring Security로 보호하거나 internal 네트워크로만 노출하세요.',
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
      concept:
        'Micrometer Tracing은 분산된 여러 서비스를 거치는 요청의 "발자취(trace)"를 하나로 엮어주는 도구예요. ' +
        'micrometer-tracing-bridge-brave는 Micrometer의 추상화 계층과 Brave(구 Zipkin Brave)를 연결하는 징검다리예요. ' +
        'sampling.probability: 1.0은 모든 요청을 빠짐없이 추적하겠다는 뜻인데, 운영 환경에서는 보통 0.1(10%) 정도로 낮춰 부하를 줄여요. ' +
        '실무에서는 이 의존성 세트만 추가하면 RestClient, WebClient, Kafka 등에서 자동으로 trace 헤더가 전파돼요.',
      terms: [
        { t: 'micrometer-tracing-bridge-brave', d: 'Micrometer 추적 API와 Brave 트레이서 구현체를 연결하는 브리지 라이브러리예요' },
        { t: 'zipkin-reporter-brave', d: '수집된 span을 Zipkin 서버로 전송하는 리포터예요. HTTP로 /api/v2/spans에 보내요' },
        { t: 'sampling.probability: 1.0', d: '추적할 요청의 비율이에요. 1.0은 100% 추적, 0.1은 10%만 표본 추적해요' },
        { t: 'zipkin.endpoint', d: '수집된 span 데이터를 보낼 Zipkin 서버의 주소예요' },
        { t: 'spring-boot-starter-actuator', d: '/actuator/health, /actuator/metrics 등 관리 엔드포인트를 제공하는 스타터예요' },
      ],
      why:
        '분산 환경에서 한 사용자의 요청이 A→B→C 서비스를 거칠 때, ' +
        '각 서비스의 로그를 traceId 하나로 묶어 전체 흐름을 한 번에 추적하려고요.',
      expectedOutput:
        '앱 시작 로그 중:\n' +
        'INFO  TracingAutoConfiguration - Tracing is ENABLED\n' +
        '(이후 HTTP 요청 시 b3 / traceparent 헤더 자동 포함)',
      realWorldUsage:
        '실제 마이크로서비스 환경에서 "주문 API가 느리다"는 신고가 들어오면, ' +
        'Zipkin에서 traceId로 검색해 payment 서비스 호출에서 3초 지연이 발생한 걸 간트 차트로 바로 확인해요.',
      pitfall:
        '운영에서 sampling.probability: 1.0으로 두면 모든 요청의 span 데이터를 Zipkin에 보내면서 ' +
        '네트워크와 Zipkin 스토리지에 심각한 부하가 걸려요. 0.1 이하로 낮추는 게 실전 기본값이에요.',
    },
  },
  {
    id: 'obs-trace-ids-propagate',
    lang: 'java',
    title: 'Micrometer - traceId 자동 전파',
    file: 'OrderClient.java',
    code: `import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;

@Service
public class OrderClient {

  private final RestClient restClient;

  public OrderClient(RestClient.Builder builder) {
    System.out.println("[생성] OrderClient 빈 생성 - baseUrl: http://payment/api");
    this.restClient = builder.baseUrl("http://payment/api").build();
  }

  public void pay(Long orderId) {
    System.out.println("[실행] pay 호출 - orderId: " + orderId);
    restClient.post()
      .uri("/charge/" + orderId)
      .retrieve()
      .toBodilessEntity();
  }
}`,
    explain: {
      concept:
        'Micrometer Tracing이 의존성에 추가되면 RestClient와 WebClient에 "자동으로" trace 헤더(b3, traceparent)가 주입돼요. ' +
        '개발자가 헤더를 수동으로 복사하거나 전달하는 코드를 전혀 작성하지 않아도, API 호출 한 번으로 다음 서비스까지 traceId가 이어져요. ' +
        'RestClient.Builder로 baseUrl을 미리 설정해두면 pay() 호출 시마다 URL을 완전히 조립하지 않아 코드가 간결해져요. ' +
        '실무에서는 RestClient, WebClient, KafkaTemplate, RabbitTemplate 등 Spring 생태계 주요 클라이언트가 모두 자동 전파를 지원해요.',
      terms: [
        { t: 'RestClient', d: '스프링 6.1에서 도입된 동기 HTTP 클라이언트예요. RestTemplate의 후속으로 fluent API를 제공해요' },
        { t: 'RestClient.Builder', d: 'baseUrl, defaultHeader, 인터셉터 등을 설정해 RestClient를 만드는 빌더예요' },
        { t: '.retrieve()', d: '요청을 서버로 보내고 응답을 받아오는 실행 메서드예요' },
        { t: 'toBodilessEntity()', d: '응답 본문을 읽지 않고 상태 코드만 확인해요. POST만 보내고 받을 데이터가 없을 때 써요' },
        { t: 'trace 헤더 자동 주입', d: 'Micrometer가 자동으로 b3/traceparent 헤더를 추가해 tracing context를 전파해요' },
      ],
      why:
        '분산 추적 헤더를 매 서비스, 매 호출마다 수동으로 복사하는 번거로움을 없애고, ' +
        '실수로 헤더를 빼먹어 추적이 끊기는 상황을 원천 차단하려고요.',
      expectedOutput:
        '[생성] OrderClient 빈 생성 - baseUrl: http://payment/api\n' +
        '[실행] pay 호출 - orderId: 1001\n' +
        'POST http://payment/api/charge/1001 (헤더에 b3: a1b2c3d4... 자동 포함)',
      realWorldUsage:
        '실제 스프링 클라우드 환경에서 Order Service → Payment Service → Notification Service 순서로 호출이 연쇄될 때, ' +
        '개발자는 코드에 trace 관련 로직을 한 줄도 쓰지 않아도 Zipkin에 완전한 트레이스 트리가 그려져요.',
      pitfall:
        '직접 만든 HTTP 클라이언트(java.net.HttpURLConnection, Apache HC)는 Micrometer 자동 전파 대상이 아니에요. ' +
        '수동으로 RestTemplate/WebClient/RestClient로 바꾸거나 인터셉터를 등록해 헤더를 직접 심어야 해요.',
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
      concept:
        'Zipkin은 모아둔 span들을 "타임라인 간트 차트"로 그려주는 시각화 도구예요. ' +
        '위 JSON 예시에서는 post /orders(142ms)가 charge(87ms)를 호출했고, charge가 다시 DB 쿼리(12ms)를 실행했어요. ' +
        'Zipkin UI에 traceId를 검색하면 이 계층 관계를 타임라인으로 그려줘서 "어느 구간이 느린지" 한눈에 파악할 수 있어요. ' +
        '실무에서는 Zipkin UI에서 느린 trace를 자동 탐지하는 기능으로 성능 병목을 먼저 찾아내요.',
      terms: [
        { t: 'traceId', d: '한 사용자 요청이 여러 서비스를 거쳐도 같은 ID로 묶이는 식별자예요' },
        { t: 'span', d: 'trace를 구성하는 한 단위 작업이에요. 서비스 경계를 넘을 때마다 새 span이 생겨요' },
        { t: 'serviceName', d: '이 span이 실행된 서비스 이름이에요. spring.application.name이 이 값으로 전달돼요' },
        { t: 'duration', d: '해당 span의 소요 시간(밀리초)이에요. 87은 0.087초를 의미해요' },
        { t: 'Zipkin UI', d: '웹 브라우저로 localhost:9411에 접속하면 볼 수 있는 Zipkin의 내장 대시보드예요' },
      ],
      why:
        '분산 시스템에서 "어디서 느려졌는지"를 추측하지 않고 ' +
        '실제 측정 데이터를 기반으로 정확한 병목 구간을 찾으려고요.',
      expectedOutput:
        'Zipkin UI 타임라인 뷰:\n' +
        'post /orders      [api]     |===================================|  142ms\n' +
        '  charge          [payment] |===================|               87ms\n' +
        '    select ...     [p-db]    |=====|                           12ms',
      realWorldUsage:
        '실제 온라인 쇼핑몰에서 "주문 완료가 느려요"라는 VOC가 들어오면, ' +
        'Slack 알람으로 받은 traceId를 Zipkin에 검색해 결제 PG사 응답이 3초 걸렸음을 객관적 데이터로 증명해요.',
      pitfall:
        'sampling.probability가 0.1 미만이면 장애 발생 순간의 trace가 표본에 안 잡혀서 ' +
        'Zipkin에 검색해도 안 나올 수 있어요. 장애 디버깅 용도로는 별도로 100% 추적하는 인스턴스를 하나 띄워두는 전략을 쓰기도 해요.',
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
      concept:
        'Sentry는 앱에서 발생한 오류를 "클라우드로 자동 보고하는 경보 장치"예요. ' +
        'dsn(Data Source Name)은 Sentry 프로젝트의 고유 주소로, 이 주소로 에러 이벤트가 전송돼요. ' +
        'environment 태그로 dev/prod를 구분하고, release 값으로 어느 버전에서 발생한 에러인지 추적해요. ' +
        'send-default-pii: false는 사용자 IP·쿠키 등 개인 식별 정보를 Sentry로 보내지 않도록 막는 안전장치예요.',
      terms: [
        { t: 'dsn', d: 'Sentry 프로젝트의 수집 주소예요. 이 URL로 에러 이벤트가 HTTPS를 통해 전송돼요' },
        { t: 'environment: prod', d: '이 에러가 어떤 환경에서 발생했는지 태그로 구분해 Sentry 대시보드에서 필터링할 수 있어요' },
        { t: 'release: codemaster@1.0.0', d: '에러 발생 시점의 앱 버전이에요. Sentry가 어떤 커밋에서 버그가 처음 나타났는지 추적해줘요' },
        { t: 'traces-sample-rate: 0.2', d: '성능 트레이스를 20%만 수집해요. 1.0으로 두면 모든 요청의 상세 프로파일을 보내 부하가 커요' },
        { t: 'minimum-event-level: error', d: 'ERROR 레벨 이상의 로그만 Sentry 이벤트로 전송해요. WARN 이하는 이벤트로 보내지 않아요' },
      ],
      why:
        '운영 중인 앱의 오류를 한곳에 모아서 실시간으로 확인하고, ' +
        '에러 발생 빈도·영향 받은 사용자 수 같은 집계 정보도 함께 분석하려고요.',
      expectedOutput:
        'Sentry 대시보드:\n' +
        'Project: codemaster | Env: prod | Release: 1.0.0\n' +
        'Last event: NullPointerException at PaymentService.charge:32 (2 minutes ago)',
      realWorldUsage:
        '실제 스타트업에서 Sentry Slack 연동을 켜두면, 프로덕션에서 새 예외가 발생할 때마다 ' +
        'Slack 채널로 즉시 알림이 와서 온콜 엔지니어가 바로 대응할 수 있어요.',
      pitfall:
        'send-default-pii를 true로 설정하면 사용자 이메일, IP 주소, 세션 쿠키까지 Sentry로 전송돼요. ' +
        'GDPR/개인정보보호법 위반이 될 수 있으니 반드시 false로 두고, 필요한 정보만 scope.setTag로 명시적으로 보내세요.',
    },
  },
  {
    id: 'obs-sentry-manual-capture',
    lang: 'java',
    title: 'Sentry - 수동 예외 보내기',
    file: 'PaymentService.java',
    code: `import io.sentry.Sentry;
import lombok.extern.slf4j.Slf4j;

@Slf4j
public class PaymentService {

  public void charge(Long orderId) {
    try {
      doRemoteCharge(orderId);
    } catch (Exception e) {
      System.out.println("[에러] 결제 실패 - orderId: " + orderId);
      log.error("결제 실패 orderId={}", orderId, e);
      Sentry.withScope(scope -> {
        scope.setTag("orderId", String.valueOf(orderId));
        scope.setExtra("retryCount", 3);
        Sentry.captureException(e);
      });
    }
  }

  private void doRemoteCharge(Long orderId) {
    throw new RuntimeException("PG server unavailable");
  }
}`,
    explain: {
      concept:
        'withScope 블록은 "에러 보고서에 추가 첨부물을 붙이는" 임시 공간이에요. ' +
        'scope.setTag("orderId", ...)로 붙인 태그는 Sentry 대시보드에서 검색용 키로 쓸 수 있어 "orderId:1001"로 검색하면 이 에러만 딱 나와요. ' +
        'scope.setExtra는 검색은 안 되지만 상세 보기 화면에서 확인 가능한 부가 정보(재시도 횟수, 장바구니 크기 등)를 함께 보내요. ' +
        'Sentry.captureException(e)로 예외 객체와 스택 트레이스를 Sentry 서버로 전송해요.',
      terms: [
        { t: 'Sentry.withScope()', d: '이벤트 전송용 임시 Scope를 생성하는 정적 메서드예요. 블록이 끝나면 Scope는 자동 폐기돼요' },
        { t: 'scope.setTag("orderId", ...)', d: '태그를 설정해요. 태그는 Sentry 검색·집계가 가능한 인덱싱된 키예요' },
        { t: 'scope.setExtra("retryCount", 3)', d: '검색은 안 되지만 상세 화면에서 볼 수 있는 부가 정보를 추가해요' },
        { t: 'Sentry.captureException(e)', d: '예외 객체를 Sentry로 직접 전송해요. 수동 보고의 핵심 메서드예요' },
        { t: 'String.valueOf(orderId)', d: 'Long 값을 String으로 변환해요. Sentry 태그는 문자열만 허용해요' },
      ],
      why:
        '에러 메시지 한 줄만으로는 원인 파악이 어려울 때, ' +
        '에러 발생 당시의 주문 번호·사용자 ID·재시도 횟수 같은 문맥 정보를 함께 보내려고요.',
      expectedOutput:
        '[에러] 결제 실패 - orderId: 1003\n' +
        'ERROR PaymentService - 결제 실패 orderId=1003\n' +
        'java.lang.RuntimeException: PG server unavailable\n' +
        '(Sentry 대시보드에 orderId=1003 태그와 함께 이벤트 등록됨)',
      realWorldUsage:
        '실제 결제 서비스에서 PG사 타임아웃이 발생하면, Sentry에 "어느 주문건인지" ' +
        'orderId를 태그로 함께 보내서 상담원이 고객 문의 시 바로 확인할 수 있게 해요.',
      pitfall:
        'Sentry.captureException(e, scopeCallback) 같은 오버로드는 존재하지 않아요. ' +
        '반드시 Sentry.withScope(scope -> { ... }) 패턴으로 Scope를 먼저 만들고 그 안에서 captureException을 호출해야 해요.',
    },
  },
  {
    id: 'obs-structured-log-fields',
    lang: 'java',
    title: '구조화 로깅 - Key=Value',
    file: 'OrderService.java',
    code: `import lombok.extern.slf4j.Slf4j;

@Slf4j
public class OrderService {

  public void placeOrder(Long orderId, String userId, int amount) {
    System.out.println("[실행] placeOrder - orderId: " + orderId + ", userId: " + userId + ", amount: " + amount);
    log.info("event=order_placed order_id={} user_id={} amount={}",
        orderId, userId, amount);

    if (amount > 1_000_000) {
      log.warn("event=large_order amount={} order_id={}", amount, orderId);
    }
  }
}`,
    explain: {
      concept:
        'key=value 형식은 "사람과 기계 모두 읽기 쉬운" 로깅 관례예요. ' +
        'event=order_placed 같은 이벤트 이름을 첫 키로 고정해두면, 로그 검색 도구에서 "event=order_placed" 한 단어로 모든 주문 생성 로그를 한 번에 필터링할 수 있어요. ' +
        'order_id, user_id, amount 같은 키 이름을 일관되게 쓰면 ELK/Splunk 같은 로그 분석 도구에서 자동으로 필드로 파싱해 대시보드를 만들어줘요. ' +
        '실무에서는 모든 서비스에서 동일한 키 네이밍 규칙(snake_case)을 정해두고 신규 서비스도 그걸 따르게 해요.',
      terms: [
        { t: 'event=order_placed', d: '이 로그의 이벤트 이름이에요. 로그 검색의 프라이머리 키 역할을 해요' },
        { t: 'order_id={}', d: '주문 ID를 자리표시자로 끼워 넣어요. snake_case 키 이름은 로그 파서가 자동 인식하기 쉬워요' },
        { t: 'user_id', d: '사용자 ID 키예요. 같은 키로 모든 서비스가 로그를 남기면 사용자별 로그 추적이 쉬워져요' },
        { t: 'amount', d: '금액 키예요. 1_000_000은 언더스코어로 자릿수를 구분한 Java 리터럴이에요(100만)' },
        { t: 'log.warn', d: '고액 주문을 주의 로그로 남기는 코드예요. 이상 거래 탐지용 알람과 연동할 수 있어요' },
      ],
      why:
        '로그 검색 시 "event=order_placed amount>100000" 같은 구조화된 쿼리로 ' +
        '비정형 텍스트 검색보다 훨씬 빠르게 원하는 로그만 골라내려고요.',
      expectedOutput:
        '[실행] placeOrder - orderId: 2001, userId: userA, amount: 2000000\n' +
        'INFO  OrderService - event=order_placed order_id=2001 user_id=userA amount=2000000\n' +
        'WARN  OrderService - event=large_order amount=2000000 order_id=2001',
      realWorldUsage:
        '실제 이커머스 프로젝트에서는 모든 서비스가 event=xxx로 로그를 시작하고, ' +
        'Kibana에서 "event=payment_failed AND amount>500000" 같은 쿼리로 고액 결제 실패만 모아 모니터링해요.',
      pitfall:
        '키 이름을 서비스마다 다르게 짓거나(orderId, order_id, ordId 혼용) 매번 철자가 달라지면 ' +
        '로그 파서가 동일 필드로 인식하지 못해 검색·집계가 불가능해져요. 팀 차원의 명명 규칙을 꼭 정하세요.',
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
      concept:
        'Health 그룹은 "건강 검진 항목을 용도별로 나누는 분류 체계"예요. ' +
        'liveness 그룹은 "이 앱이 살아만 있는가?"를 최소 검사(ping만)로 빠르게 판정하고, ' +
        'readiness 그룹은 "이 앱이 지금 트래픽을 받아도 되는가?"를 DB·Redis 같은 의존 서비스의 연결 상태까지 검사해 판정해요. ' +
        'probes.enabled: true는 k8s의 livenessProbe와 readinessProbe 경로(/actuator/health/liveness, /actuator/health/readiness)를 자동으로 활성화해요.',
      terms: [
        { t: 'show-details: when-authorized', d: '인증된 사용자에게만 상세 건강 정보를 보여줘요. always는 누구에게나 DB 연결 정보를 노출해요' },
        { t: 'group.readiness.include: db,redis', d: 'DB와 Redis 연결 확인을 readiness 검사에 포함시켜요' },
        { t: 'group.liveness.include: ping', d: '최소 생존 확인만 liveness 검사에 포함시켜요' },
        { t: 'probes.enabled: true', d: 'k8s Probe용 전용 경로를 자동으로 생성해요' },
        { t: 'health.defaults.enabled: false', d: '기본 제공 HealthIndicator(dikSpaceInfo 등)를 끄고 필요한 것만 명시적으로 켜요' },
      ],
      why:
        'k8s의 liveness/readiness 프로브 의미 그대로 Spring Boot 레벨에서도 ' +
        '생존 여부와 트래픽 수용 가능 여부를 구분해 안전한 롤링 배포를 하려고요.',
      expectedOutput:
        'curl http://localhost:8080/actuator/health  → {"status":"UP"}\n' +
        'curl http://localhost:8080/actuator/health/readiness → {"status":"UP","components":{"db":{"status":"UP"},"redis":{"status":"UP"}}}',
      realWorldUsage:
        '실제 프로덕션 k8s Deployment의 livenessProbe는 /actuator/health/liveness를, ' +
        'readinessProbe는 /actuator/health/readiness를 바라보게 설정해 새 Pod가 DB 연결을 맺기 전까지 트래픽을 받지 않게 해요.',
      pitfall:
        'show-details: always로 설정하면 /actuator/health에 DB IP:PORT, Redis 비밀번호까지 노출될 수 있어요. ' +
        '반드시 when-authorized나 never로 설정하고 Spring Security로 보호하세요.',
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
    System.out.println("[등록] 커스텀 메트릭 codemaster.orders.placed 등록");
    this.ordersPlaced = Counter.builder("codemaster.orders.placed")
        .description("생성된 주문 수")
        .tag("type", "normal")
        .register(registry);
  }

  public void onOrderPlaced() {
    ordersPlaced.increment();
    System.out.println("[실행] 주문 카운터 증가 - 현재 근사값: " + ordersPlaced.count());
  }
}`,
    explain: {
      concept:
        'Micrometer는 "측정 도구(Meter) 공장"이에요. Counter.builder로 우리만의 메트릭을 만들어 MeterRegistry에 등록하면, ' +
        '이후 onOrderPlaced()가 호출될 때마다 increment()로 카운터가 1씩 올라가요. ' +
        'Micrometer가 Prometheus, Datadog, CloudWatch 같은 백엔드로 이 메트릭을 투명하게 내보내줘서, 모니터링 도구와 코드 사이의 번역기가 돼요. ' +
        '실무에서는 주문 수, 결제 성공/실패 수, 로그인 횟수 같이 비즈니스 KPI를 코드에 메트릭으로 심어 실시간 대시보드를 만들어요.',
      terms: [
        { t: 'MeterRegistry', d: '모든 Meter(카운터, 게이지, 타이머 등)를 등록하고 관리하는 중앙 저장소예요' },
        { t: 'Counter.builder', d: '증가만 가능한 카운터 메트릭을 생성하는 빌더 패턴이에요' },
        { t: 'tag("type", "normal")', d: '이 메트릭에 차원(dimension)을 추가해요. type=normal과 type=vip를 구분해 집계할 수 있어요' },
        { t: 'increment()', d: '카운터를 1 증가시켜요. 쓰레드에 안전해 동시에 여러 요청이 불러도 정확히 증가해요' },
        { t: 'count()', d: '현재까지 누적된 카운터 값을 double로 반환해요. 근사값일 수 있어 디버깅 용도로만 써요' },
      ],
      why:
        '비즈니스 지표를 애플리케이션 코드에서 직접 측정해, ' +
        '모니터링 시스템에서 주문량·결제율을 실시간으로 추적하고 이상 급감 시 알람을 받으려고요.',
      expectedOutput:
        '[등록] 커스텀 메트릭 codemaster.orders.placed 등록\n' +
        '[실행] 주문 카운터 증가 - 현재 근사값: 3.0\n' +
        'GET /actuator/metrics/codemaster.orders.placed → {"measurements":[{"statistic":"COUNT","value":3.0}]}',
      realWorldUsage:
        '실제 서비스에서 주문 카운터를 Prometheus+Grafana로 시각화하면, ' +
        '하루 중 주문량 추이를 시간대별로 볼 수 있고 전일 대비 급감 시 Slack 알람을 보내 대응할 수 있어요.',
      pitfall:
        '태그 값(vip, normal, guest)을 무한정 동적으로 생성하면 카디널리티 폭발이 일어나요. ' +
        '예: orderId=1001, orderId=1002...를 태그로 매번 만들면 메모리·스토리지가 급증해요. 제한된 값만 태그로 쓰세요.',
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
      concept:
        'OpenTelemetry(OTel)는 로그·메트릭·트레이스를 "표준 봉투"에 담아 중앙 수집기로 보내는 개방형 관측 프레임워크예요. ' +
        'otlp(OpenTelemetry Protocol)는 gRPC 기반의 고성능 데이터 전송 프로토콜로, collector:4317 엔드포인트로 span 데이터를 내보내요. ' +
        'parentbased_traceidratio 샘플러는 부모 span이 있으면 그 결정을 따르고, 부모가 없으면 설정된 비율로 샘플링해요. ' +
        '실무에서는 OTel Collector를 사이드카로 띄워 앱이 직접 Zipkin/Jaeger를 몰라도 되게 중간에서 프로토콜을 변환해줘요.',
      terms: [
        { t: 'otel.exporter.otlp', d: 'OTLP 프로토콜로 span 데이터를 전송하는 Exporter 설정이에요' },
        { t: 'endpoint: http://collector:4317', d: 'OTel Collector의 gRPC 수신 주소예요. collector는 k8s Service DNS 이름이에요' },
        { t: 'service.name', d: '추적 데이터에 기록될 서비스 이름이에요. Zipkin에서 서비스 구분용으로 보여요' },
        { t: 'sampler: parentbased_traceidratio', d: '상위 span의 샘플링 결정을 따르는 전략이에요. 분산 추적의 일관성을 유지해요' },
        { t: 'OTEL_TRACES_SAMPLER_ARG', d: 'traceidratio 샘플러가 쓸 비율(0.0~1.0)을 환경변수로 주입해요' },
      ],
      why:
        '특정 벤더(Zipkin, Jaeger, Datadog)에 종속되지 않는 표준 프로토콜로 ' +
        '관측 데이터를 수집하고, Collector에서 원하는 백엔드로 변환해 보내려고요.',
      expectedOutput:
        '앱 시작 로그:\n' +
        'INFO  OtlpGrpcSpanExporter - OTLP exporter connected to http://collector:4317\n' +
        '(이후 trace 데이터가 gRPC 스트림으로 collector에 전송)',
      realWorldUsage:
        '실제 대기업 MSA 환경에서는 모든 서비스가 OTel Agent로 span을 동일한 Collector에 보내고, ' +
        'Collector에서 trace는 Jaeger로, metric은 Prometheus로, log는 Loki로 분기 처리하는 구조를 써요.',
      pitfall:
        'OTel Collector가 다운되면 span을 전송하지 못해 데이터가 유실돼요. ' +
        '앱 메모리에 잠시 버퍼링하는 batch processor나 retry 설정을 OTel SDK에서 켜두는 게 안전해요.',
    },
  },
  {
    id: 'obs-async-appender',
    lang: 'java',
    title: 'Logback - AsyncAppender 비동기 로깅',
    file: 'logback-spring.xml',
    code: `<appender name='ASYNC_FILE' class='ch.qos.logback.classic.AsyncAppender'>
  <queueSize>512</queueSize>
  <discardingThreshold>0</discardingThreshold>
  <includeCallerData>false</includeCallerData>
  <appender-ref ref='FILE' />
</appender>

<root level='INFO'>
  <appender-ref ref='ASYNC_FILE' />
</root>`,
    explain: {
      concept:
        'AsyncAppender는 로그를 "즉시" 파일에 쓰지 않고 큐에 담았다가 별도 백그라운드 스레드가 천천히 파일로 쓰는 비동기 래퍼예요. ' +
        '이렇게 하면 요청 처리 스레드가 디스크 I/O를 기다리느라 멈추는 블로킹 현상이 사라져 API 응답 속도가 빨라져요. ' +
        'discardingThreshold: 0은 큐가 아무리 꽉 차도 로그를 버리지 않겠다는 설정이고, 20으로 하면 큐가 80% 찼을 때부터 TRACE/DEBUG 로그를 버려요. ' +
        '실무에서는 고트래픽 API 서버에 이 설정을 적용해 로그 때문에 p99 응답 시간이 튀는 걸 방지해요.',
      terms: [
        { t: 'AsyncAppender', d: '실제 appender(FILE 등)를 감싸서 비동기로 전환하는 Logback 래퍼 appender예요' },
        { t: 'queueSize: 512', d: '내부 대기열 크기예요. 이 개수만큼 로그 이벤트를 큐에 쌓을 수 있어요. 가득 차면 블로킹해요' },
        { t: 'discardingThreshold: 0', d: '0으로 설정하면 큐가 가득 차도 로그를 절대 버리지 않아요. 20이면 큐가 80% 찼을 때 낮은 레벨 로그를 버려요' },
        { t: 'includeCallerData: false', d: '로그 호출자의 파일명·줄번호 정보를 생략해 성능을 높여요. true면 매번 스택 추적이 발생해 느려져요' },
        { t: 'appender-ref ref="FILE"', d: '실제로 로그를 파일에 쓸 원본 appender를 참조해요. ASYNC_FILE이 FILE을 감싸는 구조예요' },
      ],
      why:
        '로그 I/O가 API 응답 시간에 영향을 주는 것을 막으려고요. ' +
        '고트래픽 상황에서 로그 쓰기 지연 때문에 전체 서비스가 느려지는 걸 방지해요.',
      expectedOutput:
        '앱 시작 로그:\n' +
        'INFO  AsyncAppender - Worker thread will flush on shutdown\n' +
        '(이후 API 처리 스레드는 즉시 응답, FILE 쓰기는 백그라운드 스레드가 처리)',
      realWorldUsage:
        '실제 초당 10,000건 요청을 처리하는 API 서버에서 AsyncAppender를 적용해 ' +
        '로그 디스크 쓰기 때문에 p99 응답시간이 50ms나 튀던 문제를 2ms 이내로 낮춘 사례가 많아요.',
      pitfall:
        'queueSize를 너무 작게(예: 10) 두면 피크 트래픽에 큐가 금방 가득 차 블로킹이 발생해요. ' +
        '앱 종료 시 큐에 남은 로그가 디스크에 다 써지기 전에 프로세스가 종료되면 남은 로그는 유실돼요.',
    },
  },
];
