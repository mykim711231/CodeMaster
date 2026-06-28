import type { Snippet } from '../../types';

export const resilience: Snippet[] = [
  {
    id: 'resil-retry-basic',
    lang: 'java',
    title: '@Retry 기본',
    file: 'PaymentService.java',
    code: `import io.github.resilience4j.retry.annotation.Retry;
import org.springframework.stereotype.Service;

@Service
public class PaymentService {

  private final PaymentClient paymentClient;

  public PaymentService(PaymentClient paymentClient) {
    this.paymentClient = paymentClient;
  }

  @Retry(name = "paymentRetry")
  public String pay(String orderId) {
    System.out.println("[실행] pay 호출 — orderId: " + orderId);
    return paymentClient.charge(orderId);
  }
}`,
    explain: {
      concept:
        '@Retry는 "전화를 걸었는데 받지 않으면 자동으로 다시 걸어주는 비서" 같은 역할을 해요. ' +
        '외부 결제 서비스(paymentClient)를 호출할 때 일시적인 네트워크 오류로 실패하면, 설정된 횟수만큼 자동으로 재시도해줘요. ' +
        'name 속성은 application.yml에 정의된 retry 설정 인스턴스 이름과 연결돼요. 해당 이름이 YAML에 없으면 런타임 예외가 발생해요. ' +
        '실무에서는 결제·문자 발송·푸시 알림 같은 외부 API 호출에 거의 항상 @Retry를 걸어 일시 장애를 흘려보내요.',
      terms: [
        { t: '@Retry(name = "paymentRetry")', d: 'paymentRetry 설정을 사용해 실패 시 재시도하는 어노테이션이에요' },
        { t: 'name = "paymentRetry"', d: 'application.yml의 resilience4j.retry.instances.paymentRetry 설정을 참조해요' },
        { t: 'paymentClient.charge(orderId)', d: '외부 결제 PG사를 호출해 결제를 실행하는 핵심 비즈니스 메서드예요' },
        { t: '@Service', d: '이 클래스가 스프링이 관리하는 서비스 빈이라고 알려주는 어노테이션이에요' },
        { t: 'String pay(String orderId)', d: '주문 ID를 받아 결제 결과를 문자열로 반환하는 메서드예요' },
      ],
      why:
        '잠깐의 네트워크 흔들림이나 외부 서비스의 순간적인 부하 때문에 ' +
        '사용자에게 실패를 보여주지 않고, 자동 재시도로 성공률을 높이려고요.',
      expectedOutput:
        '[실행] pay 호출 — orderId: 1001\n' +
        '(첫 호출 실패 → 500ms 후 재시도 → 성공)\n' +
        '"payment_success"',
      realWorldUsage:
        '실제 PG사 결제 API는 순간적인 타임아웃이 흔해요. @Retry를 걸어두면 ' +
        '"결제 실패"라고 사용자에게 보여주기 전에 3번까지 재시도해 대부분 성공으로 돌아와요.',
      pitfall:
        'name에 해당하는 retry 설정이 YAML에 없으면 IllegalArgumentException이 발생해 앱이 시작되지 않아요. ' +
        '반드시 YAML에 paymentRetry 인스턴스를 정의하거나, default 설정을 만들어 모든 인스턴스가 물려받게 하세요.',
    },
  },
  {
    id: 'resil-retry-config',
    lang: 'java',
    title: 'Retry 설정 (YAML)',
    file: 'application.yml',
    code: `resilience4j.retry:
  configs:
    default:
      maxAttempts: 3
      waitDuration: 500ms
      retryExceptions:
        - java.io.IOException`,
    explain: {
      concept:
        'resilience4j.retry.configs는 재시도 규칙의 "기본값 공장"이에요. ' +
        'maxAttempts: 3은 첫 시도를 포함해 최대 3회까지 시도한다는 뜻이고, waitDuration: 500ms는 각 재시도 사이에 0.5초 쉰다는 뜻이에요. ' +
        'retryExceptions는 "이 예외가 발생했을 때만 재시도한다"는 화이트리스트예요. IOException은 네트워크 오류니까 재시도하고, NullPointerException은 버그니까 재시도하지 않는 게 핵심이에요. ' +
        '실무에서는 timeout 하나만 retryExceptions에 넣고, 비즈니스 로직 예외(잔액부족 등)는 절대 재시도하지 않게 구분해요.',
      terms: [
        { t: 'maxAttempts: 3', d: '첫 시도 + 재시도 최대 횟수를 포함한 총 시도 횟수예요. 3으로 설정하면 최대 2번 재시도해요' },
        { t: 'waitDuration: 500ms', d: '재시도 사이의 대기 시간이에요. 500ms는 0.5초를 뜻해요' },
        { t: 'retryExceptions', d: '재시도할 예외 타입의 목록이에요. 여기에 명시된 예외만 재시도돼요' },
        { t: 'java.io.IOException', d: '네트워크 I/O 오류 클래스예요. 연결 끊김·타임아웃 등이 여기에 포함돼요' },
        { t: 'configs.default', d: '별도 인스턴스가 없을 때 모든 @Retry(name="xxx")가 물려받는 기본값이에요' },
      ],
      why:
        '재시도 규칙을 코드 대신 설정 파일에 분리해, 재시도 횟수·대기 시간을 ' +
        '재배포 없이 환경별(dev는 1회, prod는 3회)로 다르게 가져가려고요.',
      expectedOutput:
        '(설정만으로는 콘솔 출력 없음) @Retry 적용된 메서드가 IOException으로 실패:\n' +
        '첫 시도 실패 → 500ms 후 재시도 → 실패 → 500ms 후 재시도 → 성공 or 예외',
      realWorldUsage:
        '실제 MSA 환경에서 전체 서비스의 retry 기본값을 configs.default에 정의하고, ' +
        '중요 결제 서비스만 instances.paymentRetry로 maxAttempts를 5로 올려서 예외적으로 더 많이 재시도해요.',
      pitfall:
        '비즈니스 예외{"잔액부족", "재고없음"}까지 retryExceptions에 포함시키면 ' +
        '같은 PG사 결제가 3번 실행돼 중복 결제가 발생할 수 있어요. 네트워크 계열 예외만 화이트리스트로 지정하세요.',
    },
  },
  {
    id: 'resil-circuit-breaker',
    lang: 'java',
    title: '@CircuitBreaker + fallback',
    file: 'OrderService.java',
    code: `import io.github.resilience4j.circuitbreaker.annotation.CircuitBreaker;
import org.springframework.stereotype.Service;

@Service
public class OrderService {

  private final OrderClient orderClient;
  private final OrderCache orderCache;

  public OrderService(OrderClient orderClient, OrderCache orderCache) {
    this.orderClient = orderClient;
    this.orderCache = orderCache;
  }

  @CircuitBreaker(name = "orderCb", fallbackMethod = "cachedOrder")
  public Order getOrder(Long id) {
    System.out.println("[실행] getOrder 호출 — id: " + id);
    return orderClient.fetch(id);
  }

  public Order cachedOrder(Long id, Throwable t) {
    System.out.println("[폴백] 캐시 조회 — id: " + id + ", cause: " + t.getMessage());
    return orderCache.get(id);
  }
}`,
    explain: {
      concept:
        'CircuitBreaker는 집 안의 "두꺼비 스위치(서킷 브레이커)"예요. ' +
        'orderClient.fetch() 호출이 계속 실패하면 스위치가 올라가(OPEN) 외부 호출을 아예 차단하고, 대신 cachedOrder()라는 보험 메서드가 캐시된 데이터를 돌려줘요. ' +
        '회로가 OPEN 상태로 일정 시간이 지나면 HALF_OPEN(반쯤 열림) 상태로 전환돼 일부 요청만 시험 통과시키고, 성공하면 다시 CLOSED로 완전 회복돼요. ' +
        'fallback 메서드는 원본 메서드와 같은 파라미터 시그니처에 마지막에 Throwable을 추가로 받아야 해요.',
      terms: [
        { t: '@CircuitBreaker(name = "orderCb")', d: 'orderCb 설정으로 회로 차단 규칙을 적용하는 어노테이션이에요' },
        { t: 'fallbackMethod = "cachedOrder"', d: '회로가 OPEN 상태일 때 대신 호출할 보조 메서드의 이름이에요' },
        { t: 'cachedOrder(Long id, Throwable t)', d: '원본과 같은 파라미터 + Throwable을 받는 폴백 메서드예요. 반환 타입도 동일해야 해요' },
        { t: 'orderClient.fetch(id)', d: '외부 주문 서비스를 호출하는 원격 클라이언트예요. 실패가 누적되면 회로가 열려요' },
        { t: 'orderCache.get(id)', d: '로컬 캐시에서 저장된 주문을 꺼내는 메서드예요. 최신성은 떨어져도 서비스 가용성을 지켜요' },
      ],
      why:
        '외부 서비스가 완전히 죽었을 때, 계속 요청을 보내서 내 서비스까지 쓰레드가 소진되는 연쇄 장애를 막고, ' +
        '캐시 데이터라도 반환해 부분적인 서비스를 유지하려고요.',
      expectedOutput:
        '[실행] getOrder 호출 — id: 5001\n' +
        '(orderClient.fetch 실패 → 회로 OPEN)\n' +
        '[폴백] 캐시 조회 — id: 5001, cause: ConnectException: Connection refused',
      realWorldUsage:
        '실제 대규모 쇼핑몰에서 "상품 상세" API가 상품 서비스 장애로 응답 불가일 때, ' +
        'CircuitBreaker가 OPEN되면 CDN 캐시의 상품 정보로 폴백해 빈 화면 대신 최소한의 정보라도 보여줘요.',
      pitfall:
        'fallback 메서드는 원본과 같은 인자 + 마지막 Throwable이 정확히 일치해야 해요. ' +
        '파라미터 개수나 타입이 하나라도 다르면 NoSuchMethodException이 발생해 런타임에 폴백이 실행 안 돼요.',
    },
  },
  {
    id: 'resil-circuit-breaker-states',
    lang: 'java',
    title: 'CircuitBreaker 상태 설정',
    file: 'application.yml',
    code: `resilience4j.circuitbreaker:
  instances:
    orderCb:
      slidingWindowSize: 10
      failureRateThreshold: 50
      waitDurationInOpenState: 10s
      permittedNumberOfCallsInHalfOpenState: 3`,
    explain: {
      concept:
        '회로 차단기 상태는 CLOSED(정상 통과) → OPEN(전면 차단) → HALF_OPEN(일부 시험) 순서로 돌아요. ' +
        'slidingWindowSize: 10은 최근 10번의 호출을 창(window)에 기록하고, failureRateThreshold: 50은 그 중 50% 이상이 실패하면 회로를 OPEN으로 열어요. ' +
        'waitDurationInOpenState: 10s는 OPEN에서 10초 머문 뒤 HALF_OPEN으로 전환해 점검을 시작해요. ' +
        'permittedNumberOfCallsInHalfOpenState: 3은 HALF_OPEN 상태에서 3건만 시험 통과시키고, 모두 성공하면 CLOSED로 복구, 하나라도 실패하면 다시 OPEN으로 돌아가요.',
      terms: [
        { t: 'slidingWindowSize: 10', d: '실패율 판단에 사용할 최근 호출 횟수예요. 너무 작으면 한두 번 실패에 회로가 열려요' },
        { t: 'failureRateThreshold: 50', d: '이 % 이상 실패하면 회로를 OPEN으로 전환해요. 50은 절반 이상 실패의 의미예요' },
        { t: 'waitDurationInOpenState: 10s', d: 'OPEN 상태에서 HALF_OPEN으로 넘어가기까지의 대기 시간이에요' },
        { t: 'permittedNumberOfCallsInHalfOpenState: 3', d: 'HALF_OPEN 상태에서 회복 확인용으로 허용할 시험 호출 수예요' },
        { t: 'instances.orderCb', d: '@CircuitBreaker(name="orderCb")가 참조할 인스턴스 설정이에요' },
      ],
      why:
        '장애가 난 서비스에 계속 호출을 쏟아붓지 않고, ' +
        '회로를 열어 일정 시간 쉬었다가 점진적으로 복구를 시도하게 하려고요.',
      expectedOutput:
        '(호출 10회 중 6회 실패):\n' +
        'CircuitBreaker "orderCb" changed state from CLOSED to OPEN\n' +
        '(10초 후):\n' +
        'CircuitBreaker "orderCb" changed state from OPEN to HALF_OPEN',
      realWorldUsage:
        '실제 트래픽이 초당 수천 건인 서비스에서 slidingWindowSize를 100으로 크게 잡고, ' +
        'waitDurationInOpenState는 짧게 5초로 설정해 빠른 복구와 안정성 사이의 균형을 맞춰요.',
      pitfall:
        'slidingWindowSize를 너무 작게(예: 2) 설정하면 한두 번의 운 나쁜 실패에도 회로가 바로 OPEN돼 정상 요청까지 차단될 수 있어요. ' +
        '일반적으로 최소 10 이상으로 두는 게 안전해요.',
    },
  },
  {
    id: 'resil-bulkhead-semaphore',
    lang: 'java',
    title: '@Bulkhead (세마포어)',
    file: 'ReportService.java',
    code: `import io.github.resilience4j.bulkhead.annotation.Bulkhead;
import org.springframework.stereotype.Service;

@Service
public class ReportService {

  private final ReportBuilder reportBuilder;

  public ReportService(ReportBuilder reportBuilder) {
    this.reportBuilder = reportBuilder;
  }

  @Bulkhead(name = "reportBh")
  public Report generate(String region) {
    System.out.println("[실행] generate — region: " + region);
    return reportBuilder.build(region);
  }
}`,
    explain: {
      concept:
        'Bulkhead(방수 벽)는 배의 구획 나누기와 같아요. 한 구역에 물이 새도 다른 구역은 안전하게 막아주는 원리예요. ' +
        'SEMAPHORE 타입 Bulkhead는 동시에 이 메서드를 실행할 수 있는 스레드 수를 제한해요. ' +
        'reportBuilder.build()가 느리다고 다른 API까지 스레드를 뺏기지 않도록, "이 메서드에 동시에 5개까지만 들어올 수 있어요"라고 제한을 걸어요. ' +
        '실무에서는 PDF 생성·대용량 엑셀 다운로드 같은 무거운 작업에 걸어 자원 독점을 막아요.',
      terms: [
        { t: '@Bulkhead(name = "reportBh")', d: 'reportBh 설정으로 동시 실행 수를 제한하는 어노테이션이에요' },
        { t: 'name = "reportBh"', d: 'application.yml의 resilience4j.bulkhead.instances.reportBh 설정을 참조해요' },
        { t: 'reportBuilder.build(region)', d: '보호 대상인 실제 무거운 작업이에요. 이 메서드가 동시 실행 수 제한을 받아요' },
        { t: 'SEMAPHORE', d: '기본 타입이에요. 요청을 받는 스레드가 직접 메서드를 실행하고, 동시 실행 제한만 걸어요' },
        { t: 'region', d: '지역 파라미터예요. 폴백이 필요하면 fallbackMethod에 동일 시그니처의 메서드를 지정할 수 있어요' },
      ],
      why:
        '느린 작업 하나가 스레드 풀 전체를 점유해 다른 API가 응답 불능이 되는 것을 막으려고요. ' +
        'CPU·메모리가 여유 있어도 스레드를 특정 작업이 독점하면 서비스 전체가 멈춘 것처럼 보여요.',
      expectedOutput:
        '[실행] generate — region: asia\n' +
        '(동시 5개까지만 실행, 6번째는 제한초과로 예외 발생 or 대기)',
      realWorldUsage:
        '실제 엑셀 다운로드 API에 Bulkhead(최대 5)를 걸어두면, ' +
        '5명이 동시에 엑셀을 다운로드해도 나머지 API(주문·조회)는 정상 속도로 응답할 수 있어요.',
      pitfall:
        '기본 타입 SEMAPHORE는 비동기 반환 타입(CompletableFuture)을 쓸 필요가 없어요. ' +
        '별도 스레드 풀에서 격리 실행하려면 type = Bulkhead.Type.THREADPOOL을 지정하고 반환 타입을 CompletableFuture로 변경해야 해요.',
    },
  },
  {
    id: 'resil-bulkhead-threadpool',
    lang: 'java',
    title: 'Bulkhead (스레드풀)',
    file: 'ExportService.java',
    code: `import io.github.resilience4j.bulkhead.annotation.Bulkhead;
import java.util.concurrent.CompletableFuture;
import java.io.File;
import org.springframework.stereotype.Service;

@Service
public class ExportService {

  private final Exporter exporter;

  public ExportService(Exporter exporter) {
    this.exporter = exporter;
  }

  @Bulkhead(name = "exportBh", type = Bulkhead.Type.THREADPOOL)
  public CompletableFuture<File> export(String range) {
    System.out.println("[실행] export — range: " + range);
    File result = exporter.run(range);
    return CompletableFuture.completedFuture(result);
  }
}`,
    explain: {
      concept:
        'THREADPOOL 타입 Bulkhead는 "전용 스레드 풀을 하나 만들어서 거기서만 이 메서드를 실행"하는 격리 전략이에요. ' +
        'SEMAPHORE와 달리 호출 스레드가 직접 메서드를 실행하지 않고, Bulkhead의 독립된 스레드 풀에 작업을 위임해요. ' +
        '이렇게 하면 export()가 오래 걸려도 호출 스레드는 금방 해방돼서 다른 요청을 받을 수 있어요. ' +
        '반환 타입은 반드시 CompletableFuture여야 하고, 내부에서는 동기 코드를 써야 해요. 또 supplyAsync를 쓰면 ForkJoinPool이 새로 생겨 Bulkhead 풀 관리가 망가져요.',
      terms: [
        { t: 'Bulkhead.Type.THREADPOOL', d: '별도 스레드 풀에서 메서드를 실행하는 격리 방식이에요. 스레드 자체를 분리해요' },
        { t: 'CompletableFuture<File>', d: 'THREADPOOL 타입의 필수 반환 타입이에요. 비동기 결과를 담는 박스예요' },
        { t: 'exporter.run(range)', d: '실제 엑스포트 작업이에요. 동기 코드로 작성해 Bulkhead 스레드 풀에서 실행돼요' },
        { t: 'CompletableFuture.completedFuture(result)', d: '이미 계산된 결과를 CompletableFuture로 감싸서 반환하는 정적 팩토리예요' },
        { t: 'export(String range)', d: '지정된 범위(range)의 데이터를 파일로 내보내는 메서드예요' },
      ],
      why:
        '오래 걸리는 작업이 HTTP 요청을 처리하는 주요 스레드 풀을 붙잡지 않게 ' +
        '별도 풀로 완전히 격리해, 무거운 작업 중에도 나머지 API가 정상 응답하게 하려고요.',
      expectedOutput:
        '[실행] export — range: 2026-Q2\n' +
        '(별도 스레드 풀에서 실행, 호출 스레드는 즉시 반환. 결과는 CompletableFuture를 통해 비동기 전달)',
      realWorldUsage:
        '실제 주간 리포트 이메일 발송 시스템에서 Bulkhead.THREADPOOL로 export 풀을 격리해두면, ' +
        '대용량 엑스포트 작업 10개가 동시에 돌아도 사용자 API의 응답 속도가 전혀 영향을 받지 않아요.',
      pitfall:
        '메서드 내부에서 CompletableFuture.supplyAsync()를 재호출하면 ForkJoinPool이 추가로 생성돼 ' +
        'Bulkhead의 스레드 풀 제어가 전혀 동작하지 않아요. 내부는 반드시 동기 코드로 작성하세요.',
    },
  },
  {
    id: 'resil-rate-limiter',
    lang: 'java',
    title: '@RateLimiter',
    file: 'SignupService.java',
    code: `import io.github.resilience4j.ratelimiter.annotation.RateLimiter;
import org.springframework.stereotype.Service;

@Service
public class SignupService {

  private final UserService userService;

  public SignupService(UserService userService) {
    this.userService = userService;
  }

  @RateLimiter(name = "signupRl", fallbackMethod = "busy")
  public String signup(String email) {
    System.out.println("[실행] signup — email: " + email);
    return userService.create(email);
  }

  public String busy(String email, Throwable t) {
    System.out.println("[폴백] 요청 초과 — email: " + email);
    return "잠시 후 다시 가입해 주세요";
  }
}`,
    explain: {
      concept:
        'RateLimiter는 "식당 입구의 안내 직원"처럼 초당/분당 처리 가능한 요청 수를 넘으면 기다리게 하는 장치예요. ' +
        '가입 폭주나 악의적인 봇이 초당 수백 건의 가입 요청을 보내도, RateLimiter가 정해진 속도까지만 userService.create()를 통과시켜요. ' +
        '제한을 초과한 요청은 fallbackMethod인 busy()가 대신 호출돼 "잠시 후 다시 시도하세요"라고 응답해요. ' +
        '실무에서는 로그인·회원가입·SMS 발송 같은 비용 발생 API나 DB 부하가 큰 API에 필수로 걸어요.',
      terms: [
        { t: '@RateLimiter(name = "signupRl")', d: 'signupRl 설정으로 초당 처리량을 제한하는 어노테이션이에요' },
        { t: 'fallbackMethod = "busy"', d: '속도 제한에 걸렸을 때 대신 실행할 메서드예요. 원본 인자 + Throwable을 그대로 받아요' },
        { t: 'userService.create(email)', d: '실제 회원가입 처리를 하는 서비스 호출이에요. RateLimiter가 호출 빈도를 제한해요' },
        { t: 'busy(String email, Throwable t)', d: '제한 초과 시 실행되는 폴백이에요. 사용자에게 친절한 안내 메시지를 돌려줘요' },
        { t: '"잠시 후 다시 가입해 주세요"', d: '폴백이 반환하는 사용자 메시지예요. 실무에서는 HTTP 429 Too Many Requests로 응답해요' },
      ],
      why:
        '회원가입 API에 초당 5건 제한을 걸어, 악성 봇이 1초에 1000개 계정을 생성하는 걸 막고 ' +
        'SMS 발송 API의 과도한 호출로 인증 비용이 폭증하는 걸 방지하려고요.',
      expectedOutput:
        '[실행] signup — email: alice@test.com\n' +
        '(초당 5건 제한 내: 정상 처리)\n' +
        '[폴백] 요청 초과 — email: bob@test.com\n' +
        '(제한 초과: "잠시 후 다시 가입해 주세요" 반환)',
      realWorldUsage:
        '실제 SMS 인증 API에 RateLimiter(초당 10건)를 걸면, 한 번에 1000건 문자 발송을 시도하는 공격을 받아도 ' +
        '10건만 발송되고 나머지는 429 응답으로 막혀 몇천만 원의 문자 비용을 절약할 수 있어요.',
      pitfall:
        'limitForPeriod(처리량)와 limitRefreshPeriod(주기)를 따로 설정하지 않으면 기본값이 예상과 다르게 동작해요. ' +
        '예: 10/s를 기대했는데 기본값이 50건/500ns라 훨씬 많은 요청이 통과할 수 있어요. 두 설정을 항상 같이 맞추세요.',
    },
  },
  {
    id: 'resil-time-limiter',
    lang: 'java',
    title: '@TimeLimiter',
    file: 'SearchService.java',
    code: `import io.github.resilience4j.timelimiter.annotation.TimeLimiter;
import java.util.List;
import java.util.concurrent.CompletableFuture;
import org.springframework.stereotype.Service;

@Service
public class SearchService {

  private final SearchClient searchClient;

  public SearchService(SearchClient searchClient) {
    this.searchClient = searchClient;
  }

  @TimeLimiter(name = "searchTl")
  public CompletableFuture<List<Item>> search(String q) {
    System.out.println("[실행] search — query: " + q);
    return CompletableFuture.supplyAsync(() -> searchClient.query(q));
  }
}`,
    explain: {
      concept:
        'TimeLimiter는 "모래시계"예요. 정해진 시간이 지나면 아직 결과가 오지 않은 작업을 포기하고 TimeoutException을 던져요. ' +
        '반환 타입이 반드시 CompletableFuture여야 해서, supplyAsync로 별도 스레드에서 searchClient.query()를 실행하고 CompletableFuture로 감싸 반환해요. ' +
        'TimeLimiter는 이 CompletableFuture에 지정된 시간 제한을 걸고, 그 시간 내에 완료되지 않으면 예외로 스레드를 해방해요. ' +
        '실무에서는 외부 검색 엔진·추천 API·이미지 처리처럼 응답 시간이 불확실한 외부 호출에 TimeLimiter를 걸어 스레드 누수를 막아요.',
      terms: [
        { t: '@TimeLimiter(name = "searchTl")', d: 'searchTl 설정으로 시간 제한을 거는 어노테이션이에요' },
        { t: 'CompletableFuture<List<Item>>', d: 'TimeLimiter의 필수 반환 타입이에요. 비동기 결과를 CompletableFuture로 감싸야 해요' },
        { t: 'supplyAsync(() -> searchClient.query(q))', d: 'ForkJoinPool의 별도 스레드에서 검색 쿼리를 비동기 실행해요' },
        { t: 'searchClient.query(q)', d: '외부 검색 엔진(Elasticsearch, Solr 등)을 호출하는 원격 API예요' },
        { t: 'TimeLimiter', d: '비동기 작업의 최대 실행 시간을 제한하는 Resilience4j 모듈이에요' },
      ],
      why:
        '외부 검색 엔진이 몇 초 동안 응답이 없을 때 무한정 기다리는 걸 끊어내서, ' +
        '호출 스레드가 계속 점유되는 걸 막으려고요.',
      expectedOutput:
        '[실행] search — query: Spring Boot\n' +
        '(searchClient 응답이 2초 이내 도착 → 정상 CompletableFuture 반환)\n' +
        '(2초 초과 → TimeoutException 발생)',
      realWorldUsage:
        '실제 검색 API에서 타임아웃을 3초로 설정하고, 초과하면 빈 결과([])를 반환하는 폴백을 조합해 ' +
        '"검색 결과 없음"으로 정상 처리해 사용자 경험을 유지하는 패턴이 흔해요.',
      pitfall:
        '@TimeLimiter는 동기 반환 타입(String, List)에는 적용할 수 없고, 반드시 CompletableFuture(또는 CompletionStage)여야 해요. ' +
        '동기 코드에 시간 제한이 필요하면 @CircuitBreaker + slowCallDurationThreshold 조합을 대신 쓰세요.',
    },
  },
  {
    id: 'resil-combo',
    lang: 'java',
    title: 'Retry + CircuitBreaker + Bulkhead 조합',
    file: 'ProductClient.java',
    code: `import io.github.resilience4j.bulkhead.annotation.Bulkhead;
import io.github.resilience4j.circuitbreaker.annotation.CircuitBreaker;
import io.github.resilience4j.retry.annotation.Retry;
import org.springframework.stereotype.Component;

@Component
public class ProductClient {

  private final ProductService productService;

  public ProductClient(ProductService productService) {
    this.productService = productService;
  }

  @Retry(name = "pR")
  @CircuitBreaker(name = "pCb", fallbackMethod = "fallback")
  @Bulkhead(name = "pBh")
  public String call(String id) {
    System.out.println("[실행] call — id: " + id);
    return productService.invoke(id);
  }

  public String fallback(String id, Throwable t) {
    System.out.println("[폴백] 모두 실패 — id: " + id + ", cause: " + t.getMessage());
    return "cached:" + id;
  }
}`,
    explain: {
      concept:
        '세 가지 보호 장치를 "양파 껍질"처럼 중첩해서 감싸는 패턴이에요. ' +
        '가장 바깥층 @Retry가 일시 실패를 몇 번 재시도하고, 그래도 실패하면 중간층 @CircuitBreaker가 실패율을 센 뒤 회로를 열어 폴백(fallback)으로 빠져나가고, ' +
        '가장 안쪽 @Bulkhead가 동시 실행 수를 제한해 자원 독점을 막아요. ' +
        '실무에서는 외부 API 호출에 이 삼중 보호를 거의 기본으로 걸어두는데, 한 가지만으로는 완전한 보호가 안 돼요.',
      terms: [
        { t: '@Retry(name = "pR")', d: '가장 바깥층이에요. 일시 실패를 먼저 재시도해 단순 네트워크 흔들림을 흡수해요' },
        { t: '@CircuitBreaker(name = "pCb")', d: '중간층이에요. 재시도로도 안 되는 지속 장애를 감지해 회로를 열어요' },
        { t: '@Bulkhead(name = "pBh")', d: '가장 안쪽이에요. 동시 실행 수를 제한해 리소스 독점을 막아요' },
        { t: 'fallback(String id, Throwable t)', d: '모든 보호를 뚫고 실패했을 때의 최종 방어선이에요' },
        { t: '"cached:" + id', d: '최악의 상황에서도 부분 응답을 반환해 우아한 실패(graceful degradation)를 구현해요' },
      ],
      why:
        '네트워크 장애(Retry), 지속 장애(CircuitBreaker), 자원 고갈(Bulkhead)이라는 ' +
        '서로 다른 유형의 위협을 한 번의 호출에 모두 대비하려고요.',
      expectedOutput:
        '[실행] call — id: P001\n' +
        '(1차: productService.invoke 실패 → Retry 재시도)\n' +
        '(2차: 재시도도 실패 → CircuitBreaker 폴백)\n' +
        '[폴백] 모두 실패 — id: P001, cause: SocketTimeoutException',
      realWorldUsage:
        '실제 은행 API를 호출하는 서비스에서 Retry(3회, 네트워크 대비) + CircuitBreaker(10회 중 50% 실패 시 OPEN, 서비스 장애 대비) + Bulkhead(동시 10건 제한, 스레드 소진 대비) 조합이 표준이에요.',
      pitfall:
        '기본 순서는 Retry → CircuitBreaker → Bulkhead 순이에요(Retry가 가장 바깥). ' +
        '순서를 바꾸려면 각 aspect의 aspectOrder 프로퍼티를 명시적으로 설정해야 하고, 잘못된 순서는 재시도보다 회로가 먼저 열려 모든 요청이 실패할 수 있어요.',
    },
  },
  {
    id: 'resil-eureka-server',
    lang: 'java',
    title: 'Eureka 서버',
    file: 'EurekaServerApplication.java',
    code: `import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.netflix.eureka.server.EnableEurekaServer;

@SpringBootApplication
@EnableEurekaServer
public class EurekaServerApplication {

  public static void main(String[] args) {
    System.out.println("[실행] Eureka Server 시작");
    SpringApplication.run(EurekaServerApplication.class, args);
  }
}`,
    explain: {
      concept:
        'Eureka 서버는 마이크로서비스들의 "공용 전화번호부"예요. ' +
        '@EnableEurekaServer로 이 앱이 서비스 레지스트리 서버 역할을 한다고 선언하고, 이후 다른 서비스들은 시작할 때 자기 이름과 IP/포트를 여기에 등록해요. ' +
        '서비스 A가 서비스 B를 호출해야 할 때, "B의 IP가 뭐지?"라고 이 전화번호부에 먼저 물어봐서 실제 주소를 알아내요. ' +
        '실무에서는 Eureka 서버를 2~3개 띄워 서로 복제(Peer-to-Peer)하며 고가용성을 유지해요.',
      terms: [
        { t: '@SpringBootApplication', d: '스프링 부트 앱의 진입점임을 나타내는 복합 어노테이션이에요' },
        { t: '@EnableEurekaServer', d: '이 앱을 Eureka 서비스 레지스트리 서버로 활성화하는 어노테이션이에요' },
        { t: 'SpringApplication.run(...)', d: '스프링 부트 애플리케이션을 구동하는 정적 메서드예요' },
        { t: 'EurekaServerApplication', d: '유레카 서버의 메인 클래스예요. 이 클래스 하나로 전화번호부 서버가 완성돼요' },
        { t: 'main(String[] args)', d: '자바 앱의 시작점이에요. SpringApplication.run으로 스프링 컨테이너를 초기화해요' },
      ],
      why:
        '마이크로서비스가 서로의 IP를 하드코딩하지 않고, ' +
        '서비스 이름만으로 동적으로 상대 서비스의 위치를 찾으려고요.',
      expectedOutput:
        '[실행] Eureka Server 시작\n' +
        'Started EurekaServerApplication in 3.5s\n' +
        '(http://localhost:8761 → Eureka 대시보드 접속 가능)',
      realWorldUsage:
        '실제 넷플릭스에서 시작된 Eureka는 현재 Spring Cloud의 표준 서비스 디스커버리로, ' +
        'Docker/K8s 환경에서 Pod IP가 수시로 바뀌어도 서비스 이름(order-service)으로 안정적인 호출을 보장해요.',
      pitfall:
        'Eureka 서버 자신도 기본적으로 클라이언트로 등록되려 해요. ' +
        '서버가 자기 자신을 등록하는 불필요한 동작을 막으려면 eureka.client.register-with-eureka=false와 fetch-registry=false를 추가해야 해요.',
    },
  },
  {
    id: 'resil-eureka-client',
    lang: 'java',
    title: 'Eureka 클라이언트',
    file: 'OrderServiceApplication.java',
    code: `import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.client.discovery.EnableDiscoveryClient;

@SpringBootApplication
@EnableDiscoveryClient
public class OrderServiceApplication {

  public static void main(String[] args) {
    System.out.println("[실행] OrderService 클라이언트 시작");
    SpringApplication.run(OrderServiceApplication.class, args);
  }
}`,
    explain: {
      concept:
        'Eureka 클라이언트는 앱이 시작할 때 "안녕하세요, 저는 order-service이고 주소는 192.168.1.10:8080이에요"라고 전화번호부에 등록하는 역할을 해요. ' +
        '@EnableDiscoveryClient를 붙이면 앱이 부팅 시 자동으로 Eureka 서버에 등록되고, 주기적으로 하트비트(heartbeat)를 보내 "저 살아있어요"라고 알려줘요. ' +
        '스프링 클라우드 2022+ (Spring Boot 3.x)부터는 @EnableDiscoveryClient 없이도 의존성만 클래스패스에 있으면 자동으로 등록돼요.',
      terms: [
        { t: '@EnableDiscoveryClient', d: '이 앱을 서비스 디스커버리 클라이언트로 활성화하는 어노테이션이에요. Spring Boot 3.x에서는 생략 가능해요' },
        { t: '@SpringBootApplication', d: '부트 앱의 메인 클래스임을 나타내는 복합 어노테이션이에요' },
        { t: 'SpringApplication.run(...)', d: '내장 톰캣을 띄우고 스프링 컨테이너를 초기화하는 정적 메서드예요' },
        { t: 'OrderServiceApplication', d: '주문 서비스의 메인 클래스예요. 시작과 동시에 Eureka에 등록돼요' },
        { t: '하트비트', d: '클라이언트가 30초마다 Eureka에 보내는 생존 신호예요. 연속 실패하면 서버가 인스턴스를 제거해요' },
      ],
      why:
        '서비스의 IP가 배포 때마다 바뀌어도 서비스 이름(order-service)으로 ' +
        '항상 같은 식별자를 유지해, 호출 측 코드를 수정하지 않고 통신하려고요.',
      expectedOutput:
        '[실행] OrderService 클라이언트 시작\n' +
        'DiscoveryClient_ORDER-SERVICE - registering service...\n' +
        'Started OrderServiceApplication in 4s',
      realWorldUsage:
        '실제 K8s 환경에서는 Eureka 대신 K8s Service Discovery를 쓰는 추세지만, ' +
        '레거시 하이브리드 클라우드(온프레미스+AWS)에서는 여전히 Eureka가 서비스 디스커버리의 중심이에요.',
      pitfall:
        'Spring Boot 3.x + Spring Cloud 2022+에서는 @EnableDiscoveryClient를 생략해도 자동으로 동작해요. ' +
        '구버전인 @EnableEurekaClient는 Deprecated됐으니 반드시 @EnableDiscoveryClient로 써야 해요.',
    },
  },
  {
    id: 'resil-eureka-client-config',
    lang: 'java',
    title: 'Eureka 클라이언트 설정',
    file: 'application.yml',
    code: `spring:
  application:
    name: order-service
eureka:
  client:
    serviceUrl:
      defaultZone: http://localhost:8761/eureka/
  instance:
    preferIpAddress: true`,
    explain: {
      concept:
        '이 설정은 Eureka 클라이언트의 "신분증"과 "전화번호부 위치"를 알려주는 구성이에요. ' +
        'spring.application.name: order-service는 "내 서비스 이름은 이거예요"라고 등록하는 이름으로, 다른 서비스가 이 이름으로 우리를 찾아요. ' +
        'eureka.client.serviceUrl.defaultZone은 Eureka 서버의 주소이고, preferIpAddress: true는 호스트명 대신 IP 주소로 등록하라는 뜻이에요. ' +
        '실무에서는 DNS 문제를 피하기 위해 IP 등록을 선호하는 경우가 많아요.',
      terms: [
        { t: 'spring.application.name', d: '서비스의 고유 등록 이름이에요. 이 이름이 Eureka 대시보드에 표시되고 다른 서비스가 참조해요' },
        { t: 'serviceUrl.defaultZone', d: '연결할 Eureka 서버의 URL이에요. 여러 대면 쉼표로 복수 지정할 수 있어요' },
        { t: 'preferIpAddress: true', d: '호스트명 대신 IP 주소로 등록해요. DNS 설정이 불안정한 환경에서 유용해요' },
        { t: 'eureka.client', d: 'Eureka 클라이언트로서의 동작 설정 그룹이에요' },
        { t: 'eureka.instance', d: '등록되는 인스턴스 자체의 속성을 설정하는 그룹이에요' },
      ],
      why:
        '여러 서비스가 같은 전화번호부를 공유하면서도 각자 자기만의 이름을 갖고, ' +
        'IP·호스트명 등록 방식을 환경에 맞게 선택하려고요.',
      expectedOutput:
        '앱 시작 로그:\n' +
        'DiscoveryClient_ORDER-SERVICE - registration status: 204\n' +
        '(http://localhost:8761/eureka/apps/ORDER-SERVICE 등록 완료)',
      realWorldUsage:
        '실제 애플리케이션에서 defaultZone을 Eureka Server의 K8s Service DNS(http://eureka-server:8761/eureka)로 설정해, ' +
        'Pod가 재시작돼도 같은 DNS로 Eureka를 찾을 수 있게 해요.',
      pitfall:
        'spring.application.name을 빼먹으면 UNKNOWN으로 등록돼요. ' +
        '서로 다른 서비스가 모두 UNKNOWN으로 등록되면 서비스 디스커버리가 완전히 망가져요. 반드시 이름을 정하세요.',
    },
  },
  {
    id: 'resil-discovery-rest',
    lang: 'java',
    title: 'DiscoveryClient 로 호출',
    file: 'OrderClient.java',
    code: `import org.springframework.cloud.client.ServiceInstance;
import org.springframework.cloud.client.discovery.DiscoveryClient;
import org.springframework.web.client.RestTemplate;

public class OrderFetcher {

  private final DiscoveryClient discoveryClient;
  private final RestTemplate restTemplate;

  public OrderFetcher(DiscoveryClient discoveryClient, RestTemplate restTemplate) {
    this.discoveryClient = discoveryClient;
    this.restTemplate = restTemplate;
  }

  public Order fetch(String serviceId, Long id) {
    ServiceInstance inst = discoveryClient.getInstances(serviceId).get(0);
    String url = inst.getUri().toString() + "/orders/" + id;
    System.out.println("[실행] fetch — service: " + serviceId + ", url: " + url);
    return restTemplate.getForObject(url, Order.class);
  }
}`,
    explain: {
      concept:
        'DiscoveryClient는 "전화번호부를 뒤져서 상대 서비스의 실제 주소를 알아내는" 도구예요. ' +
        'getInstances(serviceId)로 "order-service"를 검색하면 등록된 복제본(인스턴스) 목록이 나오고, 그중 첫 번째 주소에 RestTemplate으로 HTTP 요청을 보내요. ' +
        '이렇게 하면 상대 서비스의 IP가 배포 때마다 바뀌어도 코드에는 "order-service"라는 논리적 이름만 남아 있어요. ' +
        '실무에서는 get(0) 대신 Spring Cloud LoadBalancer + @LoadBalanced RestTemplate을 써서 부하 분산과 장애 인스턴스 우회를 함께 해결해요.',
      terms: [
        { t: 'discoveryClient', d: '서비스 레지스트리에서 등록된 인스턴스를 조회하는 클라이언트 인터페이스예요' },
        { t: 'ServiceInstance', d: '등록된 인스턴스 하나의 정보(호스트, 포트, URI)를 담는 객체예요' },
        { t: 'getInstances(serviceId).get(0)', d: 'serviceId에 해당하는 인스턴스 중 첫 번째를 선택해요. 로드밸런싱 없이 첫 것만 써요' },
        { t: 'inst.getUri().toString()', d: '인스턴스의 기본 URI를 얻어와 URL 문자열을 조립해요' },
        { t: 'restTemplate.getForObject(url, Order.class)', d: '조립된 URL로 GET 호출을 보내고 JSON 응답을 Order 클래스로 매핑해요' },
      ],
      why:
        '서비스의 물리적 위치(IP:Port)를 모르는 상태에서, ' +
        '논리적 이름만으로 실제 호출 주소를 런타임에 동적으로 찾으려고요.',
      expectedOutput:
        '[실행] fetch — service: order-service, url: http://192.168.1.10:8080/orders/1001\n' +
        '(Order 객체 반환 성공)',
      realWorldUsage:
        '실제 MSA 환경에서 주문 서비스가 배송 서비스를 호출할 때 DiscoveryClient로 인스턴스를 찾고, ' +
        '@LoadBalanced WebClient로 라운드로빈 부하 분산을 적용하는 게 표준 패턴이에요.',
      pitfall:
        'get(0)은 첫 번째 인스턴스만 계속 호출해 로드밸런싱이 전혀 안 되고, 그 인스턴스가 죽으면 장애로 이어져요. ' +
        '실전에서는 반드시 @LoadBalanced RestTemplate 또는 Spring Cloud LoadBalancer를 쓰세요.',
    },
  },
  {
    id: 'resil-config-server',
    lang: 'java',
    title: 'Config Server',
    file: 'ConfigServerApplication.java',
    code: `import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.config.server.EnableConfigServer;

@SpringBootApplication
@EnableConfigServer
public class ConfigServerApplication {

  public static void main(String[] args) {
    System.out.println("[실행] Config Server 시작");
    SpringApplication.run(ConfigServerApplication.class, args);
  }
}`,
    explain: {
      concept:
        'Config Server는 모든 마이크로서비스의 설정 파일을 "중앙 창고"에 모아두고 필요한 서비스에 나눠주는 설정 배포 허브예요. ' +
        '@EnableConfigServer로 이 앱이 설정 서버임을 선언하고, 이후 클라이언트 서비스들은 부팅할 때 이 서버에서 자신의 application.yml을 가져와요. ' +
        '기본 백엔드는 Git 저장소인데, 설정 변경 내역을 Git 커밋 히스토리로 추적하고 변경 시 Spring Cloud Bus로 모든 클라이언트에 실시간 전파할 수 있어요.',
      terms: [
        { t: '@EnableConfigServer', d: '이 앱을 설정 중앙 배포 서버로 활성화하는 어노테이션이에요' },
        { t: '@SpringBootApplication', d: '스프링 부트 진입점이에요' },
        { t: 'SpringApplication.run(...)', d: '내장 톰캣을 띄우고 설정 서버를 구동하는 정적 메서드예요' },
        { t: 'ConfigServerApplication', d: '설정 서버의 메인 클래스예요. 기본 포트는 8888이에요' },
        { t: 'Git 백엔드', d: '기본으로 설정 파일을 Git 저장소에서 읽어와요. git.uri 설정이 필수예요' },
      ],
      why:
        '수십 개 마이크로서비스의 설정을 각자 관리하면 변경 추적이 불가능하고, ' +
        '한 곳에서 통합 관리해 환경별(dev/qa/prod) 설정을 일관되게 적용하려고요.',
      expectedOutput:
        '[실행] Config Server 시작\n' +
        'Started ConfigServerApplication in 3s\n' +
        '(http://localhost:8888/order-service/prod → 설정 파일 서빙)',
      realWorldUsage:
        '실제 대기업 MSA 환경에서 Config Server + Git + Spring Cloud Bus + RabbitMQ 조합으로 ' +
        '설정 파일 하나만 커밋해도 모든 서비스가 재시작 없이 설정을 갱신하는 Refresh Scope를 구현해요.',
      pitfall:
        '기본으로 Git 백엔드를 사용해요. git.uri나 spring.cloud.config.server.git.uri 설정 없이 시작하면 ' +
        '"No repository found" 에러로 서버가 뜨지 않아요. 학습용으로는 native 프로파일을 먼저 써보세요.',
    },
  },
  {
    id: 'resil-config-server-native',
    lang: 'java',
    title: 'Config Server (native)',
    file: 'application.yml',
    code: `spring:
  profiles:
    active: native
  cloud:
    config:
      server:
        native:
          search-locations: classpath:/config-repo`,
    explain: {
      concept:
        'Native 프로파일은 "Git 없이 클래스패스의 폴더에서 설정 파일을 읽는" 간이 백엔드예요. ' +
        'search-locations에 classpath:/config-repo를 지정하면 src/main/resources/config-repo/ 아래의 yml/properties 파일들을 읽어 설정으로 제공해요. ' +
        '개인 학습이나 단일 서버 PoC에서 Git 설정 없이도 Config Server의 동작을 빠르게 확인할 수 있어요. ' +
        '실무에서는 주로 개발 환경에서 Native를 쓰고, 운영 환경에서는 Git을 쓰는 하이브리드 전략이 흔해요.',
      terms: [
        { t: 'profiles.active: native', d: 'Git 백엔드 대신 파일 시스템 기반의 native 백엔드를 활성화해요' },
        { t: 'cloud.config.server', d: 'Config Server 전용 설정의 루트 노드예요' },
        { t: 'native', d: '파일 시스템에서 설정을 읽는 백엔드 유형이에요' },
        { t: 'search-locations', d: '설정 파일을 검색할 경로예요. classpath: 접두사는 리소스 폴더를 의미해요' },
        { t: 'classpath:/config-repo', d: 'src/main/resources/config-repo/ 디렉터리를 가리켜요. 여기에 yml 파일을 두면 돼요' },
      ],
      why:
        '학습·개발 환경에서 Git 서버 설정 없이도 Config Server를 빠르게 체험하기 위해, ' +
        '파일 시스템 기반의 가벼운 백엔드가 필요해요.',
      expectedOutput:
        '앱 시작 로그:\n' +
        'Config Server - Adding native repository at classpath:/config-repo\n' +
        'Started ConfigServerApplication in 2s',
      realWorldUsage:
        '실제 로컬 개발 환경에서는 Native 백엔드로 src/main/resources/config-repo/를 읽고, ' +
        '스테이징/프로덕션에서는 spring.profiles.active=git으로 전환해 동일한 Config Server 코드로 모든 환경을 커버해요.',
      pitfall:
        'Native 프로파일은 프로덕션 사용이 권장되지 않아요. ' +
        'Config Server 인스턴스가 여러 대면 각자 로컬 파일을 읽어 설정 불일치가 발생할 수 있어요.',
    },
  },
  {
    id: 'resil-config-client',
    lang: 'java',
    title: 'Config Client 설정',
    file: 'application.yml',
    code: `spring:
  config:
    import: configserver:http://localhost:8888
  cloud:
    config:
      name: order-service
      profile: prod`,
    explain: {
      concept:
        'Config Client 설정은 "나는 누구고, 어떤 환경이고, 어디서 설정을 가져올 거야"를 선언하는 구성이에요. ' +
        'spring.config.import: configserver:http://localhost:8888은 "내 설정 파일을 Config Server에서 가져오겠다"는 선언이고, ' +
        'cloud.config.name: order-service, profile: prod는 "order-service-prod.yml 파일을 주세요"라고 요청하는 파라미터예요. ' +
        '실무에서는 configserver를 K8s Service DNS로 적어두고, profile을 환경변수 SPRING_PROFILES_ACTIVE로 주입받아요.',
      terms: [
        { t: 'spring.config.import: configserver:http://localhost:8888', d: '외부 설정 소스로 Config Server를 지정하는 Spring Boot 2.4+ 문법이에요' },
        { t: 'configserver:', d: 'Config Server 프로토콜을 나타내는 접두사예요. vault:, consul:도 같은 방식으로 써요' },
        { t: 'cloud.config.name', d: 'Config Server에 요청할 애플리케이션 이름이에요. 여러 앱이 같은 서버를 공유할 때 구분해요' },
        { t: 'profile: prod', d: 'prod 프로파일의 설정을 요청해요. 서버에서 order-service-prod.yml을 반환해요' },
        { t: 'localhost:8888', d: 'Config Server의 주소예요. 실무에서는 config-server.default.svc.cluster.local 같은 K8s DNS로 대체돼요' },
      ],
      why:
        '설정을 바꿀 때마다 앱을 재빌드·재배포하지 않고, ' +
        'Config Server의 파일만 수정하면 모든 인스턴스에 변경 사항이 반영되게 하려고요.',
      expectedOutput:
        '앱 시작 로그:\n' +
        'Fetching config from server at http://localhost:8888\n' +
        'Located environment: order-service-prod\n' +
        '(Config Server에서 받아온 설정으로 앱 시작)',
      realWorldUsage:
        '실제 프로덕션 환경에서 DB 접속 정보가 변경되면 Config Server의 yml 파일만 수정하고 ' +
        'Spring Cloud Bus + RabbitMQ 트리거로 모든 서비스에 RefreshScope 이벤트를 보내 재시작 없이 적용해요.',
      pitfall:
        'spring.config.import는 Spring Boot 2.4+ 방식이에요. ' +
        '구 버전의 bootstrap.yml + spring.cloud.config.uri 방식과 섞어 쓰면 충돌이 발생할 수 있어요.',
    },
  },
  {
    id: 'resil-saga-choreography',
    lang: 'java',
    title: 'Saga (이벤트 기반 — Choreography)',
    file: 'StockListener.java',
    code: `import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Component;

@Component
public class StockListener {

  private final StockService stockService;
  private final KafkaTemplate<String, Object> kafkaTemplate;

  public StockListener(StockService stockService, KafkaTemplate<String, Object> kafkaTemplate) {
    this.stockService = stockService;
    this.kafkaTemplate = kafkaTemplate;
  }

  @KafkaListener(topics = "order-created", groupId = "stock")
  public void onOrderCreated(OrderCreatedEvent evt) {
    System.out.println("[이벤트] order-created 수신 — orderId: " + evt.getOrderId());
    stockService.reserve(evt.getOrderId(), evt.getItems());
    kafkaTemplate.send("stock-reserved", evt.getOrderId());
    System.out.println("[이벤트] stock-reserved 발행 — orderId: " + evt.getOrderId());
  }
}`,
    explain: {
      concept:
        '안무(Choreography) 방식 Saga는 "중앙 지휘자 없이 서비스들이 이벤트를 통해 스스로 연쇄 동작"하는 분산 트랜잭션 전략이에요. ' +
        '주문 서비스가 "order-created" 이벤트를 발행하면 재고 서비스의 StockListener가 이걸 수신해 재고를 확보(reserve)하고, 다시 "stock-reserved" 이벤트를 발행해요. ' +
        '마치 댄서들이 음악(이벤트)에 맞춰 각자 춤을 추듯, 각 서비스는 자기 할 일만 하고 다음 이벤트를 발행하는 방식이에요. ' +
        '실무에서는 서비스 개수가 적고 이벤트 흐름이 단순할 때 Choreography를, 복잡한 흐름과 보상 로직이 많을 때 Orchestrator 방식을 선택해요.',
      terms: [
        { t: '@KafkaListener(topics = "order-created")', d: 'order-created 토픽에 메시지가 도착하면 이 메서드를 호출해요' },
        { t: 'groupId = "stock"', d: '같은 groupId를 가진 컨슈머끼리 메시지를 나눠 받아요. stock 그룹의 인스턴스 중 하나만 처리해요' },
        { t: 'stockService.reserve(...)', d: '재고를 확보하는 비즈니스 로직이에요. 실패하면 보상 이벤트를 발행해야 해요' },
        { t: 'kafkaTemplate.send("stock-reserved", orderId)', d: '재고 확보 완료 후 다음 서비스를 위한 이벤트를 발행해요' },
        { t: 'OrderCreatedEvent', d: '주문 생성 이벤트를 담는 DTO 클래스예요. orderId와 items 정보를 포함해요' },
      ],
      why:
        '중앙 지휘자 서비스에 모든 Saga 로직이 집중되는 병목을 방지하고, ' +
        '서비스들이 이벤트라는 계약만 공유한 채 느슨하게 결합되게 하려고요.',
      expectedOutput:
        '[이벤트] order-created 수신 — orderId: 5001\n' +
        '(stockService.reserve 실행)\n' +
        '[이벤트] stock-reserved 발행 — orderId: 5001',
      realWorldUsage:
        '실제 Uber의 주문 생성 Saga에서 주문 생성 → 결제 → 매칭 → 운행 완료까지의 흐름을 ' +
        'Choreography 방식의 이벤트 체인으로 구현하고, 각 단계 실패 시 보상 이벤트로 롤백해요.',
      pitfall:
        '이벤트 수가 많아지면 전체 흐름을 한눈에 파악하기 어려워져 디버깅이 힘들어져요. ' +
        '분산 트레이싱(Zipkin, Jaeger)을 반드시 함께 도입해 이벤트 흐름을 시각화해야 해요.',
    },
  },
  {
    id: 'resil-saga-orchestrator',
    lang: 'java',
    title: 'Saga (지휘자 — Orchestrator)',
    file: 'OrderSaga.java',
    code: `import org.springframework.stereotype.Component;

@Component
public class OrderSaga {

  private final PaymentClient paymentClient;
  private final InventoryClient inventoryClient;
  private final ShippingClient shippingClient;

  public OrderSaga(PaymentClient paymentClient, InventoryClient inventoryClient, ShippingClient shippingClient) {
    this.paymentClient = paymentClient;
    this.inventoryClient = inventoryClient;
    this.shippingClient = shippingClient;
  }

  public void execute(Order order) {
    System.out.println("[실행] Saga 시작 — orderId: " + order.getId());
    paymentClient.charge(order.getId());
    inventoryClient.reserve(order.getItems());
    shippingClient.schedule(order.getId());
    System.out.println("[완료] Saga 성공 — orderId: " + order.getId());
  }

  public void compensate(Order order) {
    System.out.println("[보상] Saga 롤백 — orderId: " + order.getId());
    shippingClient.cancel(order.getId());
    inventoryClient.release(order.getItems());
    paymentClient.refund(order.getId());
  }
}`,
    explain: {
      concept:
        '지휘자(Orchestrator) 방식 Saga는 "한 명의 지휘자가 모든 악장에게 차례로 신호를 보내는" 오케스트라 같아요. ' +
        'OrderSaga가 중앙에서 결제→재고확보→배송예약 순으로 각 서비스를 순차 호출(execute)하고, ' +
        '어느 단계에서 실패하면 역순으로 보상(compensate)을 실행해 데이터를 원상복구해요. 배송 취소→재고 해제→결제 환불 순서가 이에 해당해요. ' +
        '실무에서는 흐름이 복잡하고 보상 순서가 중요한 비즈니스(항공 예약, 호텔 예약)에 Orchestrator를 주로 써요.',
      terms: [
        { t: 'execute(Order order)', d: '정방향 Saga 단계를 순서대로 실행하는 메서드예요. 결제→재고→배송 순으로 진행해요' },
        { t: 'paymentClient.charge(order.getId())', d: '결제 단계예요. PG사를 호출해 실제 결제를 실행해요' },
        { t: 'inventoryClient.reserve(order.getItems())', d: '재고 확보 단계예요. 결제 성공 후 상품 재고를 잠가요' },
        { t: 'compensate(Order order)', d: '역방향 보상 메서드예요. execute의 역순으로 롤백을 실행해요' },
        { t: 'refund', d: '결제 단계의 보상이에요. charge의 반대 동작으로 결제를 취소해요' },
      ],
      why:
        '복잡한 비즈니스 흐름의 단계 순서와 보상 로직을 한 곳에서 명시적으로 통제해, ' +
        '분산되어 있으면 알기 어려운 전체 흐름을 코드 한 곳에서 파악하려고요.',
      expectedOutput:
        '[실행] Saga 시작 — orderId: 5001\n' +
        '(charge 성공 → reserve 성공 → schedule 성공)\n' +
        '[완료] Saga 성공 — orderId: 5001\n' +
        '// 만약 reserve에서 실패:\n' +
        '[보상] Saga 롤백 — orderId: 5001\n' +
        '(cancel → release → refund 순으로 역실행)',
      realWorldUsage:
        '실제 여행 예약 시스템에서 "호텔 예약 → 렌터카 예약 → 결제" Saga를 Orchestrator로 구현하고, ' +
        '렌터카 예약 실패 시 호텔을 취소하고 결제를 환불하는 보상 로직을 중앙에서 관리해요.',
      pitfall:
        '보상 순서는 반드시 실행 순서의 역순이어야 해요. cancel→release→refund 순서가 아니라 refund→release→cancel처럼 실행 순서를 그대로 따라가면, ' +
        '먼저 환불했는데 배송은 이미 시작돼 재고가 없어지는 불일치가 발생할 수 있어요.',
    },
  },
  {
    id: 'resil-saga-compensate-listen',
    lang: 'java',
    title: 'Saga 보상 이벤트 수신',
    file: 'OrderCompensateListener.java',
    code: `import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Component;

@Component
public class OrderCompensateListener {

  private final OrderService orderService;
  private final KafkaTemplate<String, Long> kafkaTemplate;

  public OrderCompensateListener(OrderService orderService, KafkaTemplate<String, Long> kafkaTemplate) {
    this.orderService = orderService;
    this.kafkaTemplate = kafkaTemplate;
  }

  @KafkaListener(topics = "payment-failed", groupId = "order")
  public void onPaymentFailed(Long orderId) {
    System.out.println("[보상] payment-failed 수신 — orderId: " + orderId);
    orderService.cancel(orderId);
    kafkaTemplate.send("order-cancelled", orderId);
    System.out.println("[이벤트] order-cancelled 발행 — orderId: " + orderId);
  }
}`,
    explain: {
      concept:
        '보상 이벤트 리스너는 Saga에서 어떤 단계가 실패했을 때 "뒤걸음질"을 시작하는 첫 관문이에요. ' +
        '"payment-failed" 토픽에서 결제 실패 이벤트를 수신하면, orderService.cancel(orderId)로 이미 생성된 주문을 취소하고, ' +
        '이어서 "order-cancelled" 이벤트를 발행해 재고·배송 같은 다음 단계도 보상이 전파되도록 연쇄해요. ' +
        '실무에서는 모든 Saga 리스너를 멱등하게 만들어, 카프카가 재전송해도 중복으로 취소되지 않도록 설계해요.',
      terms: [
        { t: '@KafkaListener(topics = "payment-failed")', d: 'payment-failed 토픽을 구독해 결제 실패 이벤트를 기다리는 리스너예요' },
        { t: 'payment-failed', d: '결제 서비스가 결제 실패 시 발행하는 이벤트 토픽이에요' },
        { t: 'orderService.cancel(orderId)', d: '주문을 취소 상태로 변경하는 보상 로직이에요' },
        { t: 'kafkaTemplate.send("order-cancelled", orderId)', d: '주문 취소 완료 후 다음 보상 단계를 위한 이벤트를 발행해요' },
        { t: 'groupId = "order"', d: 'order 그룹의 컨슈머가 이 토픽을 처리해요. 동일 그룹 내 중복 수신을 막아요' },
      ],
      why:
        '분산 환경에서 앞 단계가 실패했을 때 뒷 단계의 데이터를 정리해 ' +
        '전체 시스템을 일관된 상태로 되돌리려고요.',
      expectedOutput:
        '[보상] payment-failed 수신 — orderId: 5001\n' +
        '(orderService.cancel 실행 → 주문 상태 CANCELED로 변경)\n' +
        '[이벤트] order-cancelled 발행 — orderId: 5001',
      realWorldUsage:
        '실제 이커머스 Saga에서 결제 실패 후 payment-failed → order-cancelled → stock-released → coupon-restored 순서로 ' +
        '각 보상 이벤트가 연쇄 발행되며, 결제 한 건 실패가 전체 Saga를 안전하게 롤백시켜요.',
      pitfall:
        '리스너는 멱등해야 해요. 카프카는 네트워크 문제나 리밸런싱 시 동일 메시지를 여러 번 전달할 수 있어서, ' +
        '주문이 이미 취소된 상태에서 다시 cancel()을 불러도 문제가 없도록 방어 코드를 넣어야 해요.',
    },
  },
  {
    id: 'resil-actuator-health',
    lang: 'java',
    title: 'Health Indicator 커스텀',
    file: 'ExternalApiHealthIndicator.java',
    code: `import org.springframework.boot.actuate.health.Health;
import org.springframework.boot.actuate.health.HealthIndicator;
import org.springframework.stereotype.Component;

@Component
public class ExternalApiHealthIndicator implements HealthIndicator {

  private final ExternalClient externalClient;

  public ExternalApiHealthIndicator(ExternalClient externalClient) {
    this.externalClient = externalClient;
  }

  @Override
  public Health health() {
    System.out.println("[체크] External API Health Check");
    if (externalClient.ping()) {
      return Health.up().build();
    }
    return Health.down().withDetail("error", "external unreachable").build();
  }
}`,
    explain: {
      concept:
        'HealthIndicator는 Actuator의 /actuator/health에 "나만의 건강 검진 항목"을 추가하는 확장 포인트예요. ' +
        '이 코드는 외부 API가 살아있는지 ping()으로 찔러보고, 응답이 오면 Health.up(), 안 오면 Health.down()으로 상태를 보고해요. ' +
        'down 시 withDetail로 부가 정보를 함께 보내면, 모니터링 도구가 "어떤 API가 왜 죽었는지" 상세 원인도 확인할 수 있어요. ' +
        '실무에서는 DB, Redis, Kafka, 외부 PG사 등 앱이 의존하는 모든 외부 시스템마다 커스텀 HealthIndicator를 추가해 전체 건강을 진단해요.',
      terms: [
        { t: 'HealthIndicator', d: '헬스체크 로직을 정의하는 인터페이스예요. health() 메서드만 구현하면 돼요' },
        { t: '@Component', d: '이 클래스를 스프링 빈으로 등록하면 Actuator가 자동으로 수집해 /health에 포함해요' },
        { t: 'Health.up().build()', d: '상태가 정상임을 나타내는 Health 객체를 빌드해요' },
        { t: 'Health.down()', d: '비정상 상태를 나타내는 Health 객체예요. withDetail로 원인 정보를 추가할 수 있어요' },
        { t: 'externalClient.ping()', d: '외부 API의 생존 여부를 빠르게 확인하는 경량 메서드예요. 무거운 작업은 넣지 말아야 해요' },
      ],
      why:
        'K8s의 liveness/readiness probe나 로드밸런서가 /actuator/health로 우리 앱의 건강 상태를 판단할 때, ' +
        '우리 앱만 멀쩡한 게 아니라 의존하는 외부 시스템까지 정상인지 한 번에 확인하려고요.',
      expectedOutput:
        '[체크] External API Health Check\n' +
        'GET /actuator/health → {"status":"UP","components":{"externalApi":{"status":"UP"}}}\n' +
        '(외부 API 다운 시: "status":"DOWN", "error":"external unreachable")',
      realWorldUsage:
        '실제 운영 환경에서 AWS ALB가 /actuator/health의 DOWN 응답을 감지하면 새 인스턴스 교체 없이 트래픽을 다른 정상 인스턴스로만 보내 ' +
        '외부 API 장애가 내 서비스 전체로 번지는 걸 조기에 차단해요.',
      pitfall:
        'health() 메서드 안에 무거운 작업(대용량 쿼리, 헤비 HTTP 호출)을 넣으면, ' +
        'K8s probe가 타임아웃돼 Pod가 비정상으로 분류되고 계속 재시작되는 악순환에 빠져요. 빠른 ping만 넣으세요.',
    },
  },
];
