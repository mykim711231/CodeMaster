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
      concept:
        'Spring Boot Actuator는 애플리케이션의 건강 상태와 각종 정보를 외부에서 확인할 수 있게 해주는 모니터링 도구예요. ' +
        '여기서 include에 health, info, metrics를 지정해서 /actuator/health, /actuator/info, /actuator/metrics 세 개의 URL을 외부에 공개했어요. ' +
        'show-details: always는 health 엔드포인트에서 DB 연결 상태, 디스크 용량 같은 세부 정보까지 모두 보여주도록 설정한 거예요. ' +
        '운영 중인 서비스가 정상인지 확인하려고 매번 SSH로 접속할 필요 없이 HTTP 요청 하나로 상태를 파악할 수 있어서, 로드밸런서의 헬스체크나 모니터링 시스템과 연동하기에 아주 유용해요.',
      terms: [
        { t: 'management', d: 'Actuator의 모든 설정을 담는 최상위 YAML 블록이에요. Spring Boot가 이 경로 아래의 설정을 읽어요.' },
        { t: 'endpoints.web.exposure.include', d: '외부에 공개할 Actuator 엔드포인트 목록이에요. 여기에 없는 엔드포인트는 HTTP로 접근할 수 없어요.' },
        { t: 'health', d: '앱이 정상 동작 중인지 DB·디스크 등 각종 지표를 종합해 알려주는 엔드포인트예요. 로드밸런서가 이걸 보고 트래픽을 보낼지 결정해요.' },
        { t: 'info', d: '앱 버전·빌드 시간·Git 커밋 해시 같은 기본 정보를 보여주는 엔드포인트예요. 배포된 버전 확인에 써요.' },
        { t: 'show-details: always', d: 'health 응답에 상세 정보를 항상 포함해요. 어떤 구성 요소가 왜 DOWN인지 진단할 때 꼭 필요해요.' },
      ],
      expectedOutput:
        'GET /actuator/health 응답:\n' +
        '{\n' +
        '  "status": "UP",\n' +
        '  "components": {\n' +
        '    "db": {"status": "UP", "details": {"database": "PostgreSQL"}},\n' +
        '    "diskSpace": {"status": "UP", "details": {"free": 123456789}}\n' +
        '  }\n' +
        '}',
      realWorldUsage:
        '실제 프로젝트에서 Kubernetes의 livenessProbe와 readinessProbe가 /actuator/health를 주기적으로 호출해요. health가 DOWN을 반환하면 K8s가 자동으로 해당 파드를 재시작하거나 트래픽을 중단해서 장애를 빠르게 복구해요.',
      why: '운영 중인 앱의 상태를 외부에서 HTTP로 확인하고, 로드밸런서·모니터링 시스템과 연동해 자동 장애 대응을 하려고요.',
      pitfall: 'show-details: always는 DB 연결 문자열이나 외부 API 키 같은 민감 정보까지 노출할 수 있어요. 운영 환경에서는 show-details: when-authorized로 제한하고, 인증을 함께 설정하세요.',
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
      concept:
        '/actuator/health는 앱의 생존 여부를 가장 간단하게 알려주는 URL이에요. ' +
        'show-details를 when-authorized로 바꾸면 인증된 사용자에게만 상세 정보를 보여주고, 인증되지 않은 사용자는 {"status":"UP"} 같은 간략한 응답만 받아요. ' +
        'DOWN 상태일 때 HTTP 200이 아니라 503(Service Unavailable)을 반환하도록 매핑한 건, 로드밸런서가 이 서버가 죽었다고 판단하게 하려는 의도예요. ' +
        '로드밸런서는 200이 아닌 상태 코드를 받으면 해당 서버로 트래픽을 보내지 않고 정상 서버로 우회해요.',
      terms: [
        { t: 'show-details: when-authorized', d: '인증된 사용자에게만 health 상세 정보를 공개해요. 일반 사용자는 UP/DOWN만 볼 수 있어요.' },
        { t: 'status.http-mapping', d: '각 health 상태를 어떤 HTTP 상태 코드로 매핑할지 정의해요. 로드밸런서가 이걸 보고 판단해요.' },
        { t: 'DOWN: 503', d: '앱이 비정상 상태(DOWN)일 때 HTTP 503 Service Unavailable을 반환해요. 로드밸런서가 자동으로 우회해줘요.' },
        { t: '503 Service Unavailable', d: '서버가 일시적으로 요청을 처리할 수 없을 때 사용하는 HTTP 상태 코드예요.' },
      ],
      expectedOutput:
        'GET /actuator/health (앱 정상 시):\n' +
        '{"status": "UP"} (200 OK)\n\n' +
        'GET /actuator/health (DB 연결 실패 시):\n' +
        '{"status": "DOWN"} (503 Service Unavailable)',
      realWorldUsage:
        '실제 프로젝트에서 AWS ALB나 Nginx의 헬스체크가 /actuator/health를 호출해요. DB 연결이 끊기면 health가 DOWN(503)을 반환하고, 로드밸런서가 이 서버를 대상 그룹에서 제외해서 사용자 요청이 다른 정상 서버로 전달돼요. DB가 복구돼서 health가 다시 UP이 되면 자동으로 대상 그룹에 복귀해요.',
      why: '로드밸런서가 비정상 서버로 트래픽을 보내지 않도록, health 상태에 따라 적절한 HTTP 상태 코드를 반환하려고요.',
      pitfall: 'DOWN을 200으로 매핑하면 로드밸런서가 장애 서버를 정상으로 오인해서 트래픽을 계속 보내게 돼요. 장애가 사용자에게 그대로 노출되니 주의하세요.',
    },
  },
  {
    id: 'mon-custom-endpoint',
    lang: 'java',
    title: '@Endpoint 커스텀 엔드포인트',
    file: 'FeatureToggleEndpoint.java',
    code: `import org.springframework.boot.actuate.endpoint.annotation.Endpoint;
import org.springframework.boot.actuate.endpoint.annotation.ReadOperation;
import org.springframework.stereotype.Component;

import java.util.Map;

@Component
@Endpoint(id = "features")
public class FeatureToggleEndpoint {
  @ReadOperation
  public Map<String, Boolean> features() {
    System.out.println("[실행] 기능 플래그 조회 요청");
    Map<String, Boolean> flags = Map.of("new-ui", true, "beta-api", false);
    System.out.println("[결과] 플래그 반환: " + flags);
    return flags;
  }
}`,
    explain: {
      concept:
        '@Endpoint는 Actuator에 나만의 URL을 추가하는 확장 포인트예요. ' +
        '기능 플래그(feature toggle)란 새 UI나 베타 API처럼 아직 완전히 오픈되지 않은 기능을 켜고 끄는 스위치인데, 이걸 /actuator/features로 조회할 수 있게 만든 거예요. ' +
        '@ReadOperation은 GET 요청을 처리하는 메서드에 붙이는 표시로, 이 메서드가 반환하는 값이 JSON으로 응답돼요. ' +
        '재배포 없이 기능의 ON/OFF 상태를 확인할 수 있어서, 운영팀이 "지금 베타 API가 켜져 있나?"를 바로 확인할 수 있어요.',
      terms: [
        { t: '@Endpoint(id = "features")', d: 'Actuator에 커스텀 엔드포인트를 등록해요. /actuator/features URL이 만들어져요.' },
        { t: '@ReadOperation', d: 'HTTP GET 요청을 처리하는 메서드임을 표시해요. 반환값이 JSON으로 직렬화돼요.' },
        { t: '@Component', d: '이 클래스를 스프링 빈으로 등록해요. Actuator가 자동으로 이 빈을 찾아 엔드포인트로 노출해요.' },
        { t: 'Map.of("new-ui", true, ...)', d: '기능 이름과 ON/OFF 상태를 키-값 쌍으로 반환해요. 불변 Map이라 의도치 않은 수정을 막아요.' },
        { t: 'System.out.println', d: '콘솔에 디버깅 정보를 출력해요. 누가 언제 기능 플래그를 조회했는지 로그로 남겨요.' },
      ],
      expectedOutput:
        'GET /actuator/features:\n' +
        '[실행] 기능 플래그 조회 요청\n' +
        '[결과] 플래그 반환: {new-ui=true, beta-api=false}\n' +
        '응답 JSON:\n' +
        '{"new-ui": true, "beta-api": false}',
      realWorldUsage:
        '실제 프로젝트에서 카나리 배포나 A/B 테스트를 할 때 이 패턴을 써요. 새 결제 UI를 10% 사용자에게만 노출하고 싶다면, /actuator/features의 new-payment-ui 값을 true/false로 바꾸면서 점진적으로 오픈할 수 있어요. @WriteOperation을 함께 구현하면 HTTP POST로 값을 변경할 수도 있어요.',
      why: '앱이 가진 고유한 상태(기능 플래그, 캐시 통계, 배치 작업 현황 등)를 표준 Actuator URL로 노출해 모니터링하려고요.',
      pitfall: 'id는 반드시 소문자와 하이픈(kebab-case) 규칙을 따라야 URL이 올바르게 만들어져요. 대문자나 언더스코어를 쓰면 예상과 다른 URL이 생성될 수 있어요.',
    },
  },
  {
    id: 'mon-endpoint-write-op',
    lang: 'java',
    title: '@WriteOperation으로 상태 변경',
    file: 'FeatureToggleEndpoint.java',
    code: `import org.springframework.boot.actuate.endpoint.annotation.Endpoint;
import org.springframework.boot.actuate.endpoint.annotation.WriteOperation;
import org.springframework.stereotype.Component;

import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@Component
@Endpoint(id = "features")
public class FeatureToggleEndpoint {
  private final Map<String, Boolean> flags = new ConcurrentHashMap<>();

  @WriteOperation
  public void setFlag(String name, boolean enabled) {
    System.out.println("[실행] 기능 플래그 변경 — name: " + name + ", enabled: " + enabled);
    flags.put(name, enabled);
    System.out.println("[결과] 플래그 저장 완료 — 현재: " + flags);
  }
}`,
    explain: {
      concept:
        '@WriteOperation은 HTTP POST로 값을 받아 애플리케이션 상태를 변경하는 작업을 처리해요. ' +
        'ConcurrentHashMap은 여러 스레드가 동시에 플래그를 읽고 써도 안전하게 동작하는 맵이에요. ' +
        '/actuator/features에 POST로 name=beta-api&enabled=true 같은 파라미터를 보내면, 서버 재시작 없이 즉시 플래그가 바뀌어요. ' +
        '이걸 활용하면 긴급하게 기능을 끄거나 켜야 할 때 배포 파이프라인을 거치지 않고 몇 초 만에 대응할 수 있어요.',
      terms: [
        { t: '@WriteOperation', d: 'HTTP POST 요청을 처리해 애플리케이션 상태를 변경하는 메서드에 붙여요. Read와 Write를 분리한 설계예요.' },
        { t: 'ConcurrentHashMap', d: '멀티스레드 환경에서 안전하게 동작하는 HashMap이에요. 여러 요청이 동시에 와도 데이터가 깨지지 않아요.' },
        { t: 'flags.put(name, enabled)', d: '주어진 이름의 플래그를 지정된 값으로 저장해요. 기존 값이 있으면 덮어써요.' },
        { t: 'System.out.println', d: '언제 어떤 플래그가 누구에 의해 변경됐는지 콘솔에 감사 로그를 남겨요.' },
      ],
      expectedOutput:
        'POST /actuator/features (name=beta-api, enabled=true):\n' +
        '[실행] 기능 플래그 변경 — name: beta-api, enabled: true\n' +
        '[결과] 플래그 저장 완료 — 현재: {new-ui=true, beta-api=true}',
      realWorldUsage:
        '실제 프로젝트에서 긴급 장애 대응용 킬 스위치(kill switch)로 이 패턴을 써요. 외부 결제 API에 장애가 발생하면 POST로 payment.enabled=false를 호출해서 결제 기능을 즉시 차단하고, 사용자에게 "점검 중" 메시지를 보여줘요. 외부 API가 복구되면 다시 true로 바꾸는 식이에요.',
      why: '재배포 없이 런타임에 애플리케이션의 동작을 동적으로 변경하려고요. 기능 플래그·설정값 등을 코드 배포 주기와 분리할 수 있어요.',
      pitfall: '인증 없이 @WriteOperation을 공개하면 누구나 기능을 끄거나 켤 수 있어서 보안에 취약해요. Actuator 엔드포인트에는 반드시 Spring Security로 ADMIN 권한을 요구하도록 설정하세요.',
    },
  },
  {
    id: 'mon-micrometer-counter',
    lang: 'java',
    title: 'Micrometer Counter',
    file: 'OrderMetrics.java',
    code: `import io.micrometer.core.instrument.Counter;
import io.micrometer.core.instrument.MeterRegistry;
import org.springframework.stereotype.Component;

@Component
public class OrderMetrics {
  private final Counter orderCounter;

  public OrderMetrics(MeterRegistry registry) {
    System.out.println("[실행] 메트릭 등록 시작");
    this.orderCounter = Counter.builder("orders.created")
      .description("생성된 주문 수")
      .register(registry);
    System.out.println("[결과] Counter 등록 완료 — 이름: orders.created");
  }

  public void incrementOrder() {
    orderCounter.increment();
    System.out.println("[실행] 주문 카운터 증가 — 현재: " + orderCounter.count());
  }
}`,
    explain: {
      concept:
        'Counter는 "몇 번 일어났는지"를 세는 증가 전용 숫자 카운터예요. ' +
        'Micrometer는 다양한 모니터링 시스템(Prometheus, Datadog, CloudWatch 등)에 통일된 방식으로 메트릭을 보내주는 추상화 계층이에요. ' +
        '주문이 생성될 때마다 increment()를 호출해서 카운터를 1씩 올리면, 1분 동안 몇 건의 주문이 들어왔는지 추적할 수 있어요. ' +
        'MeterRegistry는 모든 메트릭을 등록하는 중앙 창고로, 여기에 등록된 메트릭만 외부 모니터링 시스템이 수집할 수 있어요.',
      terms: [
        { t: 'Counter', d: '증가만 가능한 단방향 계수기예요. 감소는 안 되고 리셋은 앱 재시작 시에만 일어나요.' },
        { t: 'Counter.builder("orders.created")', d: '"orders.created"라는 이름으로 카운터를 생성하는 빌더예요. description으로 설명을 추가할 수 있어요.' },
        { t: 'MeterRegistry', d: '모든 메트릭이 등록되는 중앙 창고예요. Counter, Timer, Gauge 모두 여기를 통해 관리돼요.' },
        { t: 'increment()', d: '카운터를 1 증가시켜요. 주문이 한 건 발생할 때마다 이 메서드를 호출하면 돼요.' },
        { t: 'count()', d: '현재까지 누적된 카운터 값을 반환해요. 디버깅용으로 콘솔에 출력하고 있어요.' },
      ],
      expectedOutput:
        '앱 시작 시:\n' +
        '[실행] 메트릭 등록 시작\n' +
        '[결과] Counter 등록 완료 — 이름: orders.created\n' +
        'incrementOrder() 호출 시:\n' +
        '[실행] 주문 카운터 증가 — 현재: 1.0',
      realWorldUsage:
        '실제 전자상거래 프로젝트에서 주문 생성 API가 호출될 때마다 orderCounter.increment()를 호출해요. Prometheus가 /actuator/prometheus에서 orders.created_total 값을 수집하고, Grafana 대시보드에서 "분당 주문 수" 그래프로 시각화해요. 갑자기 주문이 0건으로 떨어지면 알람이 울리도록 설정해둬요.',
      why: '비즈니스 이벤트의 발생 횟수를 추적해 서비스 이용량을 파악하고, 이상 징후를 조기에 감지하려고요.',
      pitfall: 'Counter는 증가만 가능하고 감소는 안 돼요. 현재값이나 증감이 필요한 메트릭은 Gauge를 써야 해요. 용도를 혼동하지 마세요.',
    },
  },
  {
    id: 'mon-micrometer-timer',
    lang: 'java',
    title: 'Micrometer Timer',
    file: 'PaymentMetrics.java',
    code: `import io.micrometer.core.instrument.MeterRegistry;
import io.micrometer.core.instrument.Timer;
import org.springframework.stereotype.Component;

import java.time.Duration;

@Component
public class PaymentMetrics {
  private final Timer paymentTimer;

  public PaymentMetrics(MeterRegistry registry) {
    System.out.println("[실행] Timer 등록 시작");
    this.paymentTimer = Timer.builder("payment.duration")
      .description("결제 처리 시간")
      .register(registry);
    System.out.println("[결과] Timer 등록 완료 — 이름: payment.duration");
  }

  public void record(long millis) {
    System.out.println("[실행] 결제 소요 시간 기록 — " + millis + "ms");
    paymentTimer.record(Duration.ofMillis(millis));
  }
}`,
    explain: {
      concept:
        'Timer는 "얼마나 걸렸는지"를 측정하는 도구예요. ' +
        '각 작업의 소요 시간을 기록하면, Micrometer가 자동으로 총 호출 횟수·평균 시간·최대 시간·분위수(백분위) 등을 계산해줘요. ' +
        '결제처럼 중요한 작업은 성능 저하를 바로 감지해야 하므로 Timer로 추적하는 게 일반적이에요. ' +
        'Duration.ofMillis()로 밀리초 단위 시간을 생성해서 record()에 전달하면, Micrometer가 내부적으로 통계를 누적해요.',
      terms: [
        { t: 'Timer', d: '작업 소요 시간을 기록하고 통계를 자동 계산하는 측정 도구예요. 평균·최대·분위수를 한 번에 얻을 수 있어요.' },
        { t: 'Timer.builder("payment.duration")', d: '"payment.duration"이라는 이름으로 타이머를 생성해요. 단위는 자동으로 초(seconds)예요.' },
        { t: 'record(Duration)', d: '측정된 소요 시간을 기록해요. java.time.Duration 객체로 정확한 시간 단위를 전달해요.' },
        { t: 'Duration.ofMillis(millis)', d: '밀리초 단위 값을 Duration 객체로 변환해요. 단위 혼동을 막기 위해 항상 Duration을 쓰는 게 좋아요.' },
      ],
      expectedOutput:
        '앱 시작 시:\n' +
        '[실행] Timer 등록 시작\n' +
        '[결과] Timer 등록 완료 — 이름: payment.duration\n' +
        'record(235) 호출 시:\n' +
        '[실행] 결제 소요 시간 기록 — 235ms',
      realWorldUsage:
        '실제 결제 시스템에서 모든 결제 API 호출의 전후 시간을 측정해서 Timer에 기록해요. Prometheus가 payment.duration_seconds_sum과 payment.duration_seconds_count를 수집하고, Grafana에서 "결제 API P95 응답 시간" 그래프를 그려요. P95가 평소 500ms에서 갑자기 3초로 늘어나면 결제 대행사 장애를 의심하고 알람을 보내요.',
      why: '느린 작업을 찾아내 성능 병목을 개선하고, 사용자 체감 성능이 악화되기 전에 선제적으로 감지하려고요.',
      pitfall: 'record()에 밀리초 단위 정수를 그대로 전달하면, Micrometer가 기본 단위를 나노초로 간주해서 엄청나게 큰 값으로 기록돼요. 반드시 Duration 객체로 감싸서 전달하세요.',
    },
  },
  {
    id: 'mon-micrometer-gauge',
    lang: 'java',
    title: 'Micrometer Gauge',
    file: 'QueueMetrics.java',
    code: `import io.micrometer.core.instrument.Gauge;
import io.micrometer.core.instrument.MeterRegistry;
import org.springframework.stereotype.Component;

import java.util.concurrent.atomic.AtomicInteger;

@Component
public class QueueMetrics {
  private final AtomicInteger queueSize = new AtomicInteger(0);

  public QueueMetrics(MeterRegistry registry) {
    System.out.println("[실행] Gauge 등록 시작");
    Gauge.builder("queue.size", queueSize, AtomicInteger::get)
      .description("작업 대기열 크기")
      .register(registry);
    System.out.println("[결과] Gauge 등록 완료 — 이름: queue.size, 초기값: 0");
  }

  public void setSize(int size) {
    System.out.println("[실행] 큐 크기 변경 — " + queueSize.get() + " -> " + size);
    queueSize.set(size);
  }
}`,
    explain: {
      concept:
        'Gauge는 "지금 이 순간의 값"을 보여주는 속도계 같은 측정 도구예요. ' +
        'Counter가 누적 증가만 하는 반면, Gauge는 올라갔다 내려갔다 하는 현재 상태값을 추적해요. ' +
        '작업 큐에 쌓인 개수, 현재 접속자 수, 메모리 사용량처럼 시시각각 변하는 값을 나타낼 때 써요. ' +
        'Gauge는 직접 값을 설정하지 않고, 관찰 대상 객체(queueSize)의 현재값을 콜백(AtomicInteger::get)으로 읽어오는 방식이에요. 이 콜백이 주기적으로 호출돼서 항상 최신 값을 반영해요.',
      terms: [
        { t: 'Gauge', d: '현재값을 관찰하는 측정 도구예요. 대상 객체의 값이 변하면 다음 수집 주기에 자동 반영돼요.' },
        { t: 'AtomicInteger', d: '멀티스레드에서 안전하게 증감할 수 있는 정수 래퍼예요. Gauge의 관찰 대상으로 자주 써요.' },
        { t: 'AtomicInteger::get', d: 'Gauge가 현재값을 읽을 때 호출할 메서드 참조예요. get()이 AtomicInteger의 현재값을 반환해요.' },
        { t: 'Gauge.builder(name, obj, func)', d: '이름·관찰 대상 객체·값을 읽는 함수를 지정해 Gauge를 생성해요.' },
      ],
      expectedOutput:
        '앱 시작 시:\n' +
        '[실행] Gauge 등록 시작\n' +
        '[결과] Gauge 등록 완료 — 이름: queue.size, 초기값: 0\n' +
        'setSize(42) 호출 시:\n' +
        '[실행] 큐 크기 변경 — 0 -> 42',
      realWorldUsage:
        '실제 프로젝트에서 스레드 풀의 활성 스레드 수, Redis 커넥션 풀의 사용 중인 커넥션 수, Kafka 컨슈머 랙(lag) 등을 Gauge로 추적해요. 대시보드에서 "작업 큐가 1000개를 넘으면 빨간색" 같은 시각적 경고를 설정하고, 실제로 임계치를 넘으면 담당자에게 알람을 보내요.',
      why: '증감이 아니라 현재 상태가 중요한 메트릭(큐 길이, 메모리, 접속자 수 등)을 실시간으로 추적하려고요.',
      pitfall: 'Gauge는 값을 직접 올리거나 내리는 메서드가 없어요. 대상 객체(queueSize)의 값을 바꾸기만 하면 자동 반영돼요. setSize()를 호출하지 않고 queueSize.set()만 호출해도 동일하게 동작해요.',
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
      concept:
        'Prometheus는 일정 주기로 앱의 /actuator/prometheus 엔드포인트를 방문해서 메트릭을 긁어가는(pull) 모니터링 시스템이에요. ' +
        'include에 prometheus를 추가하면 Micrometer가 수집한 모든 메트릭을 Prometheus가 이해할 수 있는 포맷으로 노출해줘요. ' +
        'tags.application으로 모든 메트릭에 app="codemaster" 라벨을 자동으로 붙여서, Prometheus가 여러 앱의 메트릭을 구분할 수 있게 해요. ' +
        'percentiles-histogram을 켜면 HTTP 요청 응답 시간의 분포를 히스토그램으로 기록해서, P50·P95·P99 같은 정확한 분위수를 계산할 수 있어요.',
      terms: [
        { t: 'include: prometheus,health', d: 'Prometheus 포맷 엔드포인트와 health 엔드포인트를 외부에 공개해요.' },
        { t: 'tags.application: codemaster', d: '모든 메트릭에 application=codemaster 라벨을 붙여요. 여러 앱을 운영할 때 필수예요.' },
        { t: 'percentiles-histogram', d: '응답 시간 분포를 히스토그램으로 기록해 정확한 분위수 계산을 가능하게 해요.' },
        { t: 'http.server.requests', d: 'Spring MVC가 자동 생성하는 HTTP 요청 메트릭이에요. 모든 컨트롤러의 호출 정보를 담고 있어요.' },
      ],
      expectedOutput:
        'GET /actuator/prometheus 일부:\n' +
        'http_server_requests_seconds_count{application="codemaster",method="GET",uri="/api/users",status="200"} 1523\n' +
        'http_server_requests_seconds_sum{application="codemaster",method="GET",uri="/api/users",status="200"} 45.237\n' +
        '...',
      realWorldUsage:
        '실제 프로젝트에서 Prometheus가 15초마다 /actuator/prometheus를 호출해서 메트릭을 수집하고, Grafana가 이 데이터로 대시보드를 그려요. "지난 5분간 500 에러 비율이 1% 넘으면 알람" 같은 규칙을 Prometheus AlertManager에 설정해서 장애를 실시간 감지해요.',
      why: 'Prometheus + Grafana 조합으로 메트릭을 수집·시각화하고, 이상 징후 발생 시 자동 알람을 받으려고요.',
      pitfall: 'percentiles-histogram을 활성화하면 각 버킷마다 추가 메트릭 시계열이 생성돼서 Prometheus 저장소 사용량과 메모리가 증가해요. 필요한 HTTP 엔드포인트에만 선별적으로 활성화하는 게 좋아요.',
    },
  },
  {
    id: 'mon-timed-annotation',
    lang: 'java',
    title: '@Timed로 메서드 측정',
    file: 'PaymentController.java',
    code: `import io.micrometer.core.annotation.Timed;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class PaymentController {
  @Timed(value = "payment.process", description = "결제 처리 시간")
  @PostMapping("/pay")
  public ResponseEntity<String> pay(@RequestBody PayRequest req) {
    System.out.println("[실행] 결제 요청 수신 — amount: " + req.amount());
    ResponseEntity<String> response = ResponseEntity.ok("ok");
    System.out.println("[결과] 결제 응답 반환");
    return response;
  }
}

record PayRequest(long amount) {}`,
    explain: {
      concept:
        '@Timed는 메서드 위에 붙이기만 하면 실행 시간을 자동으로 측정해주는 어노테이션이에요. ' +
        '별도로 시작 시간과 종료 시간을 기록하는 코드를 작성하지 않아도, Micrometer가 AOP를 통해 메서드 실행 전후를 감싸서 소요 시간을 Timer에 자동 기록해요. ' +
        '값은 payment.process라는 이름으로 Micrometer에 등록되고, description은 메트릭에 대한 설명으로 저장돼서 Grafana에서 확인할 수 있어요. ' +
        '컨트롤러뿐 아니라 @Service 메서드에도 붙일 수 있어서, 특정 비즈니스 로직의 성능을 추적할 때도 유용해요.',
      terms: [
        { t: '@Timed', d: '메서드 실행 시간을 자동 측정하는 Micrometer 어노테이션이에요. 코드 한 줄 추가 없이 성능 측정을 시작할 수 있어요.' },
        { t: 'value = "payment.process"', d: '측정 결과가 저장될 메트릭 이름이에요. /actuator/metrics/payment.process에서 확인할 수 있어요.' },
        { t: 'description', d: '메트릭에 대한 설명이에요. 대시보드에서 메트릭 이름만으로 의미를 파악하기 어려울 때 도움이 돼요.' },
        { t: '@RestController', d: 'REST API 컨트롤러임을 표시해요. 각 메서드의 반환값이 JSON으로 직렬화돼요.' },
      ],
      expectedOutput:
        'POST /pay {amount: 5000}:\n' +
        '[실행] 결제 요청 수신 — amount: 5000\n' +
        '[결과] 결제 응답 반환',
      realWorldUsage:
        '실제 프로젝트에서 핵심 API마다 @Timed를 붙여서 성능을 추적해요. 결제·주문·인증 API의 P95 응답 시간을 Grafana 대시보드에서 실시간으로 보고, 특정 API가 느려지면 담당 팀에 슬랙 알람이 가도록 설정해요. 장애 발생 시 어떤 API부터 문제가 시작됐는지 추적하는 데도 유용해요.',
      why: '컨트롤러나 서비스 메서드의 성능을 코드 수정 없이 자동으로 추적하고, 느린 API를 빠르게 식별하려고요.',
      pitfall: 'TimedAspect 빈을 별도로 등록해야 @Timed가 동작해요. Spring Boot AutoConfiguration이 이 빈을 자동 등록하지 않으니, @Configuration 클래스에 @Bean으로 등록해야 해요.',
    },
  },
  {
    id: 'mon-timed-aspect-bean',
    lang: 'java',
    title: '@Timed 활성화 빈',
    file: 'MetricsConfig.java',
    code: `import io.micrometer.core.aop.TimedAspect;
import io.micrometer.core.instrument.MeterRegistry;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class MetricsConfig {
  @Bean
  public TimedAspect timedAspect(MeterRegistry registry) {
    System.out.println("[실행] TimedAspect 등록 — @Timed 활성화");
    return new TimedAspect(registry);
  }
}`,
    explain: {
      concept:
        '@Timed 어노테이션이 실제로 동작하려면 TimedAspect라는 AOP 도우미 빈이 반드시 필요해요. ' +
        '이 도우미는 @Timed가 붙은 메서드를 찾아서, 메서드 실행 전후를 가로채는 프록시를 만들어줘요. ' +
        '안타깝게도 Spring Boot가 Micrometer 의존성만 추가한다고 해서 이 빈이 자동 등록되지는 않아요 — 개발자가 명시적으로 @Bean으로 등록해야 해요. ' +
        '이 빈을 등록하지 않으면 @Timed 어노테이션은 아무 효과도 없이 조용히 무시되니, 꼭 확인하는 습관을 들이세요.',
      terms: [
        { t: 'TimedAspect', d: '@Timed 어노테이션을 처리하는 AOP Aspect예요. 이 빈이 있어야 @Timed가 동작해요.' },
        { t: 'MeterRegistry', d: '측정 결과를 등록할 메트릭 창고예요. TimedAspect가 이 창고에 시간 측정 결과를 저장해요.' },
        { t: '@Configuration', d: '스프링 설정 클래스임을 표시해요. 이 안의 @Bean 메서드가 빈으로 등록돼요.' },
        { t: '@Bean', d: 'TimedAspect 인스턴스를 스프링 빈으로 등록해요. 생성자에 MeterRegistry를 주입하고 있어요.' },
      ],
      expectedOutput:
        '앱 시작 시:\n' +
        '[실행] TimedAspect 등록 — @Timed 활성화',
      realWorldUsage:
        '실제 프로젝트의 공통 설정 모듈에 이 클래스를 만들어 두고 모든 마이크로서비스가 공유해요. 신규 서비스를 만들 때 이 설정을 깜빡하고 추가하지 않으면 @Timed가 동작하지 않아서, "배포했는데 메트릭이 안 나와요"라는 장애 문의가 올 수 있어요. 팀에서는 템플릿 프로젝트에 이 설정을 기본 포함해서 실수를 방지해요.',
      why: 'AOP를 통해 @Timed 어노테이션이 붙은 메서드의 실행을 가로채고, 소요 시간을 자동 측정하기 위해 필수적으로 등록해야 해요.',
      pitfall: '이 빈을 등록하지 않으면 @Timed 어노테이션은 아무런 에러도 내지 않고 조용히 무시돼요. "왜 메트릭이 안 나오지?"라고 헤매지 않도록 팀 내 체크리스트에 포함하세요.',
    },
  },
  {
    id: 'mon-health-indicator',
    lang: 'java',
    title: 'HealthIndicator 구현',
    file: 'ApiKeyHealthIndicator.java',
    code: `import org.springframework.boot.actuate.health.Health;
import org.springframework.boot.actuate.health.HealthIndicator;
import org.springframework.stereotype.Component;

@Component
public class ApiKeyHealthIndicator implements HealthIndicator {
  private final ApiKeyService apiKeyService;

  public ApiKeyHealthIndicator(ApiKeyService apiKeyService) {
    this.apiKeyService = apiKeyService;
  }

  @Override
  public Health health() {
    System.out.println("[실행] API 키 건강 점검 시작");
    if (apiKeyService.isValid()) {
      System.out.println("[결과] API 키 유효 — UP");
      return Health.up().withDetail("key", "valid").build();
    }
    System.out.println("[결과] API 키 만료 — DOWN");
    return Health.down().withDetail("error", "API 키 만료").build();
  }
}`,
    explain: {
      concept:
        'HealthIndicator는 Actuator의 건강 점검 항목을 확장하는 인터페이스예요. ' +
        '스프링이 기본으로 제공하는 DB·디스크 점검 외에, 외부 API 키 유효성처럼 우리 서비스만의 고유한 점검 항목을 추가할 수 있어요. ' +
        '여기서는 ApiKeyService의 isValid() 결과에 따라 UP 또는 DOWN을 반환해서, 외부 API 키가 만료되면 전체 앱 상태가 DOWN으로 표시되게 해요. ' +
        'health() 메서드가 반환한 Health 객체들은 Actuator가 취합해서 /actuator/health 응답의 components 항목에 포함돼요.',
      terms: [
        { t: 'HealthIndicator', d: '커스텀 건강 점검 항목을 정의하는 인터페이스예요. health() 메서드 하나만 구현하면 돼요.' },
        { t: 'Health.up()', d: '정상 상태를 나타내는 Health 빌더예요. .build()로 최종 Health 객체를 만들어 반환해요.' },
        { t: 'Health.down()', d: '비정상 상태를 나타내는 Health 빌더예요. 어떤 이유로 비정상인지 withDetail로 설명을 추가할 수 있어요.' },
        { t: 'withDetail("key", "valid")', d: '건강 상태에 부가 정보를 추가해요. 응답 JSON의 details 필드에 포함돼서 진단에 도움이 돼요.' },
        { t: 'ApiKeyService', d: '생성자 주입으로 받은 외부 API 키 검증 서비스예요. 실제 API 호출 결과를 바탕으로 유효성을 판단해요.' },
      ],
      expectedOutput:
        'API 키 유효할 때 health() 호출:\n' +
        '[실행] API 키 건강 점검 시작\n' +
        '[결과] API 키 유효 — UP\n\n' +
        'API 키 만료됐을 때 health() 호출:\n' +
        '[실행] API 키 건강 점검 시작\n' +
        '[결과] API 키 만료 — DOWN',
      realWorldUsage:
        '실제 프로젝트에서 외부 SMS·결제·지도 API의 키 상태를 HealthIndicator로 점검해요. API 키가 실수로 재발급되거나 만료되면 /actuator/health가 DOWN으로 떨어져서 Kubernetes가 새 배포를 막고, 담당자에게 알람이 가요. 배포 전에 외부 의존성도 함께 확인할 수 있어서 "배포했는데 API가 안 돼요" 상황을 방지해요.',
      why: '외부 API·메시지 큐·파일 시스템 등 모든 외부 의존성을 포함한 전체 건강 상태를 한눈에 파악하려고요.',
      pitfall: 'health() 메서드 안에서 예외가 발생하면 Actuator가 자동으로 DOWN 처리하지만, 예외 스택 트레이스가 응답에 노출될 수 있어요. 민감 정보 노출을 막으려면 내부에서 try-catch로 감싸고 명시적인 DOWN 상태를 반환하는 게 안전해요.',
    },
  },
  {
    id: 'mon-metrics-registry',
    lang: 'java',
    title: 'MeterRegistry 주입',
    file: 'LoginMetrics.java',
    code: `import io.micrometer.core.instrument.Counter;
import io.micrometer.core.instrument.MeterRegistry;
import org.springframework.stereotype.Service;

@Service
public class LoginMetrics {
  private final Counter successCounter;
  private final Counter failCounter;

  public LoginMetrics(MeterRegistry registry) {
    System.out.println("[실행] 로그인 메트릭 등록 시작");
    this.successCounter = Counter.builder("login.success")
      .description("로그인 성공 횟수")
      .register(registry);
    this.failCounter = Counter.builder("login.fail")
      .description("로그인 실패 횟수")
      .register(registry);
    System.out.println("[결과] 등록 완료 — success: 0, fail: 0");
  }
}`,
    explain: {
      concept:
        'MeterRegistry는 모든 측정 도구(Counter, Timer, Gauge 등)를 등록하는 중앙 창고예요. ' +
        '생성자에서 MeterRegistry를 주입받고, Counter.builder()로 생성한 카운터를 register()로 창고에 등록하고 있어요. ' +
        '같은 MeterRegistry에 여러 개의 메트릭을 등록할 수 있어서, 로그인 성공과 실패를 각각 다른 카운터로 추적할 수 있어요. ' +
        '이렇게 등록된 메트릭은 /actuator/metrics/login.success와 /actuator/metrics/login.fail에서 확인할 수 있고, Prometheus가 수집해갈 수 있어요.',
      terms: [
        { t: 'MeterRegistry', d: '모든 메트릭의 등록·조회·관리를 담당하는 중앙 창고예요. 스프링이 자동으로 빈을 제공해줘요.' },
        { t: 'Counter.builder(...).register(registry)', d: '카운터를 생성과 동시에 MeterRegistry에 등록하는 체이닝 패턴이에요.' },
        { t: 'login.success / login.fail', d: '로그인 성공과 실패를 각각 추적하는 두 개의 독립된 카운터예요.' },
        { t: 'description(...)', d: '메트릭에 대한 사람이 읽을 수 있는 설명을 추가해요. 대시보드 구성 시 참고할 수 있어요.' },
      ],
      expectedOutput:
        '앱 시작 시:\n' +
        '[실행] 로그인 메트릭 등록 시작\n' +
        '[결과] 등록 완료 — success: 0, fail: 0',
      realWorldUsage:
        '실제 프로젝트에서 로그인 API에 이 클래스를 주입해서, 인증 성공/실패 횟수를 추적해요. 실패 카운터가 급증하면 무차별 대입 공격(brute force)을 의심하고 보안팀에 알람을 보내요. 또한 Grafana에서 로그인 성공률(성공/(성공+실패)*100)을 계산해 대시보드에 표시해요.',
      why: '한 MeterRegistry에 모든 메트릭을 등록해 중앙에서 관리하고, 다양한 지표를 조합해 의미 있는 정보를 도출하려고요.',
      pitfall: '이미 등록된 이름으로 다시 register()를 호출하면 IllegalArgumentException이 발생해요. 앱 시작 시 한 번만 등록되도록 생성자에서 초기화하는 게 안전해요.',
    },
  },
  {
    id: 'mon-tags-metrics',
    lang: 'java',
    title: '메트릭 태그 추가',
    file: 'OrderMetrics.java',
    code: `import io.micrometer.core.instrument.Counter;
import io.micrometer.core.instrument.MeterRegistry;
import org.springframework.stereotype.Component;

@Component
public class OrderMetrics {
  private final Counter asiaMobileCounter;

  public OrderMetrics(MeterRegistry registry) {
    System.out.println("[실행] 태그 기반 메트릭 등록");
    this.asiaMobileCounter = Counter.builder("orders.created")
      .tag("region", "asia")
      .tag("channel", "mobile")
      .description("아시아 모바일 채널 주문 수")
      .register(registry);
    System.out.println("[결과] 등록 완료 — region=asia, channel=mobile");
  }

  public void increment() {
    asiaMobileCounter.increment();
    System.out.println("[실행] 주문 카운터 증가 — region=asia, channel=mobile");
  }
}`,
    explain: {
      concept:
        'tag는 메트릭에 차원(dimension)을 추가하는 라벨이에요. ' +
        '단순히 "orders.created"라고만 추적하면 전체 주문 수밖에 알 수 없지만, region과 channel 태그를 붙이면 "아시아에서 모바일로 들어온 주문" 같이 세분화된 분석이 가능해져요. ' +
        'Prometheus에서는 tag 값별로 시계열이 분리돼서, "지역별 주문 추이"나 "채널별 주문 비율" 같은 다차원 쿼리를 날릴 수 있어요. ' +
        '다만 태그 값의 종류가 너무 많아지면 카디널리티 폭발이 일어나서 Prometheus 성능이 급격히 저하되니, 제한된 값 집합(예: 대륙명)으로 태그를 설계해야 해요.',
      terms: [
        { t: 'tag("region", "asia")', d: '메트릭에 region=asia라는 라벨을 붙여요. query에서 이 라벨로 필터링할 수 있어요.' },
        { t: 'tag("channel", "mobile")', d: '메트릭에 channel=mobile 라벨을 추가해요. 태그는 여러 개 중첩해서 쓸 수 있어요.' },
        { t: 'Counter.builder("orders.created")', d: '같은 이름이지만 태그 조합이 다르면 별도 시계열로 관리돼요. 충돌하지 않아요.' },
        { t: '카디널리티 (cardinality)', d: '태그 값 조합의 개수를 의미해요. 100개 지역 * 5개 채널이면 500개 시계열이 생성돼요.' },
      ],
      expectedOutput:
        '앱 시작 시:\n' +
        '[실행] 태그 기반 메트릭 등록\n' +
        '[결과] 등록 완료 — region=asia, channel=mobile\n' +
        'increment() 호출 시:\n' +
        '[실행] 주문 카운터 증가 — region=asia, channel=mobile',
      realWorldUsage:
        '실제 글로벌 전자상거래 프로젝트에서 region(asia, europe, americas)과 channel(mobile, web, app) 태그로 주문 메트릭을 구분해요. 마케팅팀이 "유럽 모바일 사용자의 주문량이 지난주 대비 20% 감소" 같은 인사이트를 Grafana에서 직접 확인할 수 있고, 특정 지역·채널에 장애가 발생하면 알람을 세분화해서 보낼 수 있어요.',
      why: '같은 메트릭을 여러 차원으로 나눠서 분석해, 지역별·채널별·버전별로 세밀한 인사이트를 얻으려고요.',
      pitfall: '태그 값에 userId나 requestId 같은 무한히 늘어나는 값을 넣으면 카디널리티가 폭발해요. Prometheus가 수십만 개의 시계열을 처리하다가 메모리가 터질 수 있어요. 태그 값은 열거 가능한 소수 집합으로 제한하세요.',
    },
  },
  {
    id: 'mon-logback-metrics',
    lang: 'java',
    title: 'Logback 메트릭 (자동 등록)',
    file: 'LogbackMetricsDemo.java',
    code: `import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;

@Component
public class LogbackMetricsDemo {
  private static final Logger log =
      LoggerFactory.getLogger(LogbackMetricsDemo.class);

  public void doWork() {
    System.out.println("[실행] 작업 시작");
    log.info("작업 시작");
    log.warn("경고 발생");
    System.out.println("[결과] 로그 2건 출력 — logback.events 카운터 +2");
  }
}`,
    explain: {
      concept:
        'Spring Boot 3.x에서는 classpath에 logback-classic이 있으면 LogbackMetrics가 자동으로 등록돼요. ' +
        '이 메트릭은 로그 레벨(info, warn, error)별로 로그가 몇 번 찍혔는지 logback.events라는 카운터로 추적해줘요. ' +
        '이 코드에서 log.info()와 log.warn()이 한 번씩 호출되면, logback.events 태그 level=info 카운터와 level=warn 카운터가 각각 1씩 증가해요. ' +
        '에러 로그가 급증하면 Prometheus에서 알람을 받을 수 있어서, 사용자가 문의하기 전에 장애를 먼저 감지할 수 있어요.',
      terms: [
        { t: 'LogbackMetrics', d: 'Logback 로그 횟수를 Micrometer 메트릭으로 자동 변환해주는 스프링 내장 클래스예요.' },
        { t: 'logback.events', d: '레벨별 로그 발생 횟수를 나타내는 메트릭 이름이에요. 태그 level로 info·warn·error를 구분해요.' },
        { t: 'LoggerFactory.getLogger', d: 'SLF4J Logger 인스턴스를 생성하는 팩터리 메서드예요. 클래스 이름이 로그에 표시돼요.' },
        { t: 'log.info / log.warn', d: '각각 INFO와 WARN 레벨로 로그를 출력해요. 이 호출마다 logback.events 카운터가 증가해요.' },
      ],
      expectedOutput:
        'doWork() 호출 시:\n' +
        '[실행] 작업 시작\n' +
        '2025-XX-XX ... INFO ... LogbackMetricsDemo - 작업 시작\n' +
        '2025-XX-XX ... WARN ... LogbackMetricsDemo - 경고 발생\n' +
        '[결과] 로그 2건 출력 — logback.events 카운터 +2',
      realWorldUsage:
        '실제 프로젝트에서 ERROR 로그의 logback.events 카운터를 Prometheus 알람 규칙과 연동해요. "5분간 ERROR 로그가 10건 이상이면 슬랙 알람" 같은 규칙을 설정해서, 무증상 장애(사용자는 정상 응답을 받지만 내부에서 예외가 발생하는 경우)도 빠르게 감지해요.',
      why: '에러 로그 급증을 실시간으로 감지해 사용자보다 먼저 장애를 인지하고 대응하려고요.',
      pitfall: 'Spring Boot 2.x의 management.metrics.binders.logback.enabled 속성은 3.x에서 제거됐어요. 3.x에서 비활성화하려면 management.metrics.enable.logback.events: false로 설정해야 해요. 2.x 문법을 그대로 쓰면 설정이 무시돼요.',
    },
  },
  {
    id: 'mon-heap-memory',
    lang: 'java',
    title: 'SLO 구간 설정',
    file: 'SloMetricsDemo.java',
    code: `import io.micrometer.core.instrument.MeterRegistry;
import io.micrometer.core.instrument.config.MeterFilter;
import org.springframework.boot.actuate.autoconfigure.metrics.MeterRegistryCustomizer;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.time.Duration;

@Configuration
public class SloMetricsDemo {
  @Bean
  public MeterRegistryCustomizer<MeterRegistry> sloCustomizer() {
    System.out.println("[실행] SLO 구간 설정 시작");
    MeterRegistryCustomizer<MeterRegistry> customizer = registry -> registry.config()
      .meterFilter(MeterFilter.maxExpected(
        "http.server.requests",
        Duration.ofMillis(200)));
    System.out.println("[결과] SLO 설정 완료 — 최대 예상 응답 200ms");
    return customizer;
  }
}`,
    explain: {
      concept:
        'SLO(Service Level Objective, 서비스 수준 목표)는 "99%의 요청이 200ms 안에 응답해야 한다" 같은 성능 목표예요. ' +
        'MeterFilter.maxExpected로 최대 예상 응답 시간을 200ms로 설정하면, Micrometer가 이 값을 기준으로 히스토그램 버킷을 자동 구성해요. ' +
        '평균 응답 시간만 보면 일부 느린 요청이 숨어버리는데, SLO 기반 분위수(P95, P99)를 추적하면 "100명 중 1명은 3초를 기다렸다" 같은 숨은 문제를 발견할 수 있어요. ' +
        'MeterRegistryCustomizer는 MeterRegistry의 전역 설정을 커스터마이징하는 함수형 인터페이스예요.',
      terms: [
        { t: 'SLO (Service Level Objective)', d: '서비스 성능 목표예요. "P99 응답 시간이 200ms 이하" 같은 측정 가능한 목표를 정의해요.' },
        { t: 'MeterRegistryCustomizer', d: 'MeterRegistry의 전역 설정을 람다로 커스터마이징하는 인터페이스예요. 빈으로 등록하면 자동 적용돼요.' },
        { t: 'MeterFilter.maxExpected', d: '히스토그램의 최대 예상값을 설정해요. 버킷 범위가 이 값에 맞춰 최적화돼요.' },
        { t: 'Duration.ofMillis(200)', d: '200밀리초를 나타내요. 이 값이 히스토그램의 상한선이 돼서 불필요한 버킷을 줄여줘요.' },
      ],
      expectedOutput:
        '앱 시작 시:\n' +
        '[실행] SLO 구간 설정 시작\n' +
        '[결과] SLO 설정 완료 — 최대 예상 응답 200ms',
      realWorldUsage:
        '실제 프로젝트에서 API 게이트웨이나 프록시 서버들은 대부분 SLO를 엄격하게 관리해요. "P99 응답 시간이 200ms를 넘으면 장애로 간주" 같은 SLA(Service Level Agreement)가 있고, 이를 위반하면 고객사에 환불 패널티가 발생해요. SLO 메트릭을 Grafana에서 실시간 모니터링하고, 위반 임박 시 온콜 담당자에게 즉시 알람이 가요.',
      why: '평균이 아닌 상위 분위수로 실제 사용자 체감 성능을 추적하고, SLA 위반을 조기에 감지하려고요.',
      pitfall: 'maxExpected 값을 너무 낮게 잡으면 정상 요청도 버킷 범위를 벗어나서 분위수 계산이 부정확해져요. 너무 높게 잡으면 불필요한 버킷이 많아져 메모리 낭비예요. P99 응답 시간의 2~3배로 설정하는 게 일반적이에요.',
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
      concept:
        '/actuator/info는 애플리케이션의 기본 정보를 보여주는 읽기 전용 게시판이에요. ' +
        'env를 켜면 Java 버전·OS 정보·환경 변수 등을, java를 켜면 JVM 벤더·버전·런타임 정보를 응답에 포함해줘요. ' +
        '운영자가 "지금 배포된 앱이 Java 21인가 17인가?" 같은 기본 정보를 빠르게 확인할 수 있어서, 장애 분석 시 첫 진단 포인트로 활용해요. ' +
        'health가 생존 여부라면 info는 신원 확인에 가까워요.',
      terms: [
        { t: 'info', d: '앱 기본 정보를 제공하는 Actuator 엔드포인트예요. /actuator/info URL로 접근할 수 있어요.' },
        { t: 'env.enabled: true', d: '환경 변수와 시스템 프로퍼티 정보를 info 응답에 포함해요.' },
        { t: 'java.enabled: true', d: 'JVM 버전·벤더 등 Java 런타임 정보를 info 응답에 포함해요.' },
        { t: 'exposure.include: info', d: 'info 엔드포인트를 HTTP로 공개해요. include에 없는 엔드포인트는 접근할 수 없어요.' },
      ],
      expectedOutput:
        'GET /actuator/info:\n' +
        '{\n' +
        '  "java": {"version": "21.0.1", "vendor": "Eclipse Adoptium"},\n' +
        '  "env": {"os.name": "Linux", "java.runtime.version": "21.0.1+12"}\n' +
        '}',
      realWorldUsage:
        '실제 프로젝트에서 배포 파이프라인이 완료된 직후 운영팀이 /actuator/info를 호출해서 "의도한 버전이 실제로 배포됐는지" 확인해요. Git 커밋 해시를 info에 포함시키는 커스텀 InfoContributor를 만들어서 "현재 운영에 배포된 정확한 커밋이 무엇인지" 한눈에 파악할 수 있어요.',
      why: '배포된 앱의 버전과 환경 정보를 빠르게 확인하고, 장애 발생 시 현재 배포 상태를 진단하려고요.',
      pitfall: 'env.enabled를 켜면 환경 변수에 저장된 비밀 키(DB 비밀번호, API 키 등)가 info 응답에 노출될 위험이 있어요. 운영 환경에서는 env.enabled: false로 두거나, 민감 정보는 sanitize 처리를 하세요.',
    },
  },
  {
    id: 'mon-actuator-security',
    lang: 'java',
    title: 'Actuator 보안 제한',
    file: 'SecurityConfig.java',
    code: `import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
public class SecurityConfig {
  @Bean
  public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
    System.out.println("[실행] Actuator 보안 설정 적용");
    http.authorizeHttpRequests(auth -> auth
      .requestMatchers("/actuator/health").permitAll()
      .requestMatchers("/actuator/**").hasRole("ADMIN")
      .anyRequest().authenticated()
    );
    SecurityFilterChain chain = http.build();
    System.out.println("[결과] 보안 설정 완료 — health: all, actuator: ADMIN, others: authenticated");
    return chain;
  }
}`,
    explain: {
      concept:
        'Actuator 엔드포인트는 내부 정보를 많이 노출하기 때문에 반드시 접근 제어가 필요해요. ' +
        '이 코드는 세 가지 수준의 접근 제어를 설정하고 있어요 — health는 로드밸런서가 인증 없이 접근해야 하므로 permitAll, 나머지 actuator 엔드포인트는 ADMIN 역할만 접근 가능, 그 외 모든 요청은 인증된 사용자만 허용해요. ' +
        'requestMatchers는 URL 패턴과 HTTP 메서드를 기준으로 접근 규칙을 정의하고, 위에서 아래로 순서대로 평가돼요. 더 구체적인 패턴(/actuator/health)을 먼저 배치해야 해요.',
      terms: [
        { t: 'requestMatchers("/actuator/health")', d: '/actuator/health 경로에 대한 접근 규칙을 정의해요. 첫 번째로 평가되는 규칙이에요.' },
        { t: 'permitAll()', d: '인증 없이 누구나 접근 가능하게 해요. 로드밸런서 헬스체크에 필요해서 health에만 적용해요.' },
        { t: 'hasRole("ADMIN")', d: 'ADMIN 권한을 가진 사용자만 접근 가능하게 해요. ROLE_ 접두사 없이 "ADMIN"이라고만 써요.' },
        { t: 'anyRequest().authenticated()', d: '위의 어떤 규칙에도 해당하지 않는 모든 요청은 인증을 요구해요. 마지막에 배치하는 폴백 규칙이에요.' },
      ],
      expectedOutput:
        '앱 시작 시:\n' +
        '[실행] Actuator 보안 설정 적용\n' +
        '[결과] 보안 설정 완료 — health: all, actuator: ADMIN, others: authenticated',
      realWorldUsage:
        '실제 프로젝트에서 Actuator 경로 보호는 보안 감사에서 가장 먼저 확인하는 항목이에요. 모든 actuator 엔드포인트가 permitAll로 열려 있으면 심각한 보안 취약점으로 분류돼요. audit 팀이 침투 테스트(pentest)에서 actuator 엔드포인트를 스캔하고, 인증 없이 접근되면 즉시 티켓이 발행돼요.',
      why: '애플리케이션 내부 정보·설정·메트릭이 외부에 노출되는 것을 막고, 운영자만 접근할 수 있도록 제어하려고요.',
      pitfall: '기본 경로 /actuator는 공격자도 쉽게 추측할 수 있어요. management.endpoints.web.base-path=/internal 같은 비표준 경로로 변경해서 보안을 강화하는 게 권장돼요. 단, 로드밸런서 헬스체크 경로도 함께 업데이트해야 해요.',
    },
  },
  {
    id: 'mon-micrometer-long-task',
    lang: 'java',
    title: 'LongTaskTimer',
    file: 'BatchMetrics.java',
    code: `import io.micrometer.core.instrument.LongTaskTimer;
import io.micrometer.core.instrument.MeterRegistry;
import org.springframework.stereotype.Component;

@Component
public class BatchMetrics {
  private final LongTaskTimer batchTimer;

  public BatchMetrics(MeterRegistry registry) {
    System.out.println("[실행] LongTaskTimer 등록 시작");
    this.batchTimer = LongTaskTimer.builder("batch.export")
      .description("배치 내보내기 진행 시간")
      .register(registry);
    System.out.println("[결과] LongTaskTimer 등록 완료 — 이름: batch.export");
  }

  public void start(Runnable task) {
    System.out.println("[실행] 배치 작업 시작 — LongTaskTimer 측정 중");
    batchTimer.record(task);
    System.out.println("[결과] 배치 작업 완료");
  }
}`,
    explain: {
      concept:
        'LongTaskTimer는 오래 걸리는 작업을 측정하는 특별한 타이머예요. ' +
        '일반 Timer는 작업이 끝나야 소요 시간을 알 수 있지만, LongTaskTimer는 "현재 진행 중인 작업이 몇 개이고, 지금까지 얼마나 걸렸는지"를 실시간으로 보여줘요. ' +
        'record(task)는 Runnable을 받아서 작업을 실행하면서 시간을 측정하고, 작업 중에도 /actuator/metrics에서 진행 시간을 조회할 수 있어요. ' +
        '배치 작업·파일 업로드·대량 데이터 처리처럼 수 초 이상 걸리는 작업을 추적할 때 적합해요.',
      terms: [
        { t: 'LongTaskTimer', d: '장시간 작업의 진행 시간을 실시간으로 보여주는 타이머예요. 작업 중인 상태도 조회할 수 있어요.' },
        { t: 'LongTaskTimer.builder(...).register(registry)', d: 'LongTaskTimer를 생성하고 MeterRegistry에 등록하는 체이닝 패턴이에요.' },
        { t: 'record(task)', d: 'Runnable 작업을 실행하면서 시간을 측정해요. 작업 시작·종료 시각, 활성 작업 수를 추적해요.' },
        { t: 'Runnable', d: '인자 없이 실행만 하는 함수형 인터페이스예요. 람다로 간단하게 전달할 수 있어요.' },
      ],
      expectedOutput:
        '앱 시작 시:\n' +
        '[실행] LongTaskTimer 등록 시작\n' +
        '[결과] LongTaskTimer 등록 완료 — 이름: batch.export\n' +
        'start(task) 호출 시:\n' +
        '[실행] 배치 작업 시작 — LongTaskTimer 측정 중\n' +
        '[결과] 배치 작업 완료',
      realWorldUsage:
        '실제 프로젝트의 야간 배치 작업(정산·통계 집계·대량 메일 발송)을 LongTaskTimer로 추적해요. Grafana에서 "현재 진행 중인 배치 작업 수"와 "가장 오래 실행 중인 작업의 경과 시간"을 대시보드에 표시하고, 특정 배치가 30분 이상 실행되면 알람을 보내요. 작업이 너무 오래 걸려서 다음 배치 시간과 겹치는 걸 방지해요.',
      why: '수 초에서 수 시간까지 걸리는 장기 작업의 진행 상태를 실시간으로 추적하고, 비정상적으로 오래 걸리는 작업을 감지하려고요.',
      pitfall: '짧은 작업(수 ms 이내)에 LongTaskTimer를 쓰면 오버헤드가 커져서 성능이 저하돼요. 일반적인 API 응답 시간 측정은 Timer, 배치·파일 처리 같은 장기 작업은 LongTaskTimer로 구분해서 써야 해요.',
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
      concept:
        'Health Group은 여러 건강 점검 항목을 목적별로 묶어서 별도 URL로 제공하는 기능이에요. ' +
        '/actuator/health는 모든 항목의 종합 결과를 보여주지만, /actuator/health/readiness는 DB와 Redis만 확인해요. ' +
        'readiness(준비도)와 liveness(생존도)를 분리하는 것은 Kubernetes의 핵심 개념이에요 — liveness는 "앱이 살아 있는가"를, readiness는 "트래픽을 받을 준비가 됐는가"를 판단해요. ' +
        'readiness 그룹에 DB와 Redis만 포함시켜서, 두 외부 의존성이 모두 정상일 때만 트래픽을 받도록 할 수 있어요.',
      terms: [
        { t: 'health.group', d: '건강 점검 항목을 논리적 그룹으로 묶는 설정이에요. 각 그룹은 독립된 URL을 가져요.' },
        { t: 'readiness', d: '트래픽을 받을 준비가 되었는지 판단하는 그룹이에요. 의존 서비스 상태를 점검해요.' },
        { t: 'include: db,redis', d: 'readiness 그룹이 DB 커넥션과 Redis 연결 두 가지만 점검하도록 설정해요.' },
        { t: 'show-details: always', d: '그룹별로 세부 정보 공개 설정을 따로 적용할 수 있어요. readiness는 항상 상세 정보를 보여줘요.' },
      ],
      expectedOutput:
        'GET /actuator/health/readiness (정상):\n' +
        '{"status": "UP", "components": {"db": {"status": "UP"}, "redis": {"status": "UP"}}}\n\n' +
        'GET /actuator/health/readiness (Redis 장애):\n' +
        '{"status": "DOWN", "components": {"db": {"status": "UP"}, "redis": {"status": "DOWN"}}}',
      realWorldUsage:
        '실제 Kubernetes 환경에서 startupProbe는 /actuator/health, livenessProbe는 /actuator/health/liveness, readinessProbe는 /actuator/health/readiness를 바라보도록 설정해요. Redis가 잠시 장애를 일으키면 readiness만 DOWN이 되어서 서비스 디스커버리에서 해당 파드가 제외되고, liveness는 UP이라서 파드가 재시작되지 않아요. Redis가 복구되면 readiness가 다시 UP으로 돌아와 자동으로 트래픽이 재개돼요.',
      why: '애플리케이션의 생존(liveness)과 트래픽 수용 준비(readiness)를 분리해서, Kubernetes가 더 정교하게 파드 생명주기를 관리할 수 있게 하려고요.',
      pitfall: 'readiness에 느린 검사(외부 API 호출, 복잡한 쿼리 등)를 포함하면 헬스체크가 느려지고, 그만큼 트래픽 전환에 지연이 생겨요. readiness 점검은 1초 이내에 완료되는 가벼운 검사로 구성하는 게 좋아요.',
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
      concept:
        'Percentile(백분위)은 "상위 몇 %의 요청이 얼마나 빠른가"를 측정하는 통계 지표예요. ' +
        '0.5(P50)는 중간값, 0.95(P95)는 상위 5%, 0.99(P99)는 상위 1% 요청의 응답 시간을 의미해요. ' +
        '평균은 극단적으로 느린 소수 요청에 크게 영향받아서 실제 사용자 체감을 왜곡할 수 있는데, 분위수는 이 문제를 해결해줘요. ' +
        'percentiles-histogram을 true로 켜면 Micrometer가 응답 시간 분포를 히스토그램 버킷으로 기록해서 더 정확한 분위수를 계산할 수 있어요.',
      terms: [
        { t: 'percentiles', d: '계산할 분위수 목록이에요. 0.5는 중간값(P50), 0.99는 상위 1% 지점(P99)을 의미해요.' },
        { t: '0.5,0.95,0.99', d: 'P50·P95·P99 세 가지 분위수를 계산해요. 대부분의 SLA는 P95나 P99를 기준으로 삼아요.' },
        { t: 'percentiles-histogram: true', d: '히스토그램 기반으로 분위수를 계산해요. 버킷이 있어야 정확한 값이 나와요.' },
        { t: 'http.server.requests', d: 'Spring MVC가 자동으로 생성하는 HTTP 요청 메트릭이에요. 모든 컨트롤러 호출이 포함돼요.' },
      ],
      expectedOutput:
        'GET /actuator/metrics/http.server.requests:\n' +
        '{\n' +
        '  "name": "http.server.requests",\n' +
        '  "measurements": [\n' +
        '    {"statistic": "COUNT", "value": 15234},\n' +
        '    {"statistic": "TOTAL_TIME", "value": 234.5},\n' +
        '    {"statistic": "MAX", "value": 2.345}\n' +
        '  ],\n' +
        '  "availableTags": [{"tag": "uri", "values": ["/api/users", "/api/orders"]}]\n' +
        '}',
      realWorldUsage:
        '실제 프로젝트에서 "P99 응답 시간이 500ms 이하"라는 SLA를 설정하고, Grafana에서 P99 그래프를 실시간으로 모니터링해요. P95는 대부분의 사용자가 경험하는 응답 시간을, P99는 최악의 경우를 나타내요. 예를 들어 P99가 갑자기 3초로 치솟으면 DB 슬로우 쿼리나 GC pause를 의심하고 원인 분석에 들어가요.',
      why: '평균이 숨기는 극단값을 포착해 실제 사용자 체감 성능을 정확하게 파악하고, SLA 준수 여부를 검증하려고요.',
      pitfall: '히스토그램 없이 percentiles만 설정하면 Micrometer가 단순 누적 통계로 근사치를 계산해서 부정확해요. 정확한 분위수가 필요하면 반드시 percentiles-histogram: true를 함께 설정하세요.',
    },
  },
];
