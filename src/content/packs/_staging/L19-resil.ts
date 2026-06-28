import type { Snippet } from '../../types';

export const resilience: Snippet[] = [
  {
    id: 'resil-retry-basic',
    lang: 'java',
    title: '@Retry 기본',
    file: 'PaymentService.java',
    code: `@Retry(name = "paymentRetry")
public String pay(String orderId) {
  return paymentClient.charge(orderId);
}`,
    explain: {
      concept: '@Retry는 전화를 걸었는데 안 받았을 때 다시 걸어주는 비서예요. 결제가 일시적으로 실패하면 정해진 횟수만큼 다시 시도해요.',
      terms: [
        { t: '@Retry', d: '실패 시 재시도를 붙여주는 어노테이션' },
        { t: 'name', d: '설정(YAML)에 등록된 재시도 인스턴스 이름' },
        { t: 'paymentClient.charge', d: '실제 외부 결제를 부르는 호출' },
      ],
      why: '잠깐 네트워크 흔들림 때문에 실패한 요청을 자동으로 살려요.',
      pitfall: 'name 에 해당하는 인스턴스가 YAML 에 없으면 런타임 에러가 나요.',
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
      concept: '재시도 규칙을 YAML 에 적어요. 최대 3번, 매번 0.5초 쉬고, 오직 IOException 일 때만 다시 시도해요.',
      terms: [
        { t: 'maxAttempts', d: '최대 시도 횟수 (처음 포함)' },
        { t: 'waitDuration', d: '재시도 사이 대기 시간' },
        { t: 'retryExceptions', d: '재시도할 예외 목록' },
        { t: 'configs.default', d: '모든 인스턴스가 물려받는 기본 설정' },
      ],
      why: '재시도 규칙을 코드 대신 설정에서 바꿀 수 있게 하려고요.',
      pitfall: '비즈니스 예외까지 재시도하면 중복 결제가 날 수 있어요. 네트워크 예외만 넣으세요.',
    },
  },
  {
    id: 'resil-circuit-breaker',
    lang: 'java',
    title: '@CircuitBreaker + fallback',
    file: 'OrderService.java',
    code: `@CircuitBreaker(name = "orderCb", fallbackMethod = "cachedOrder")
public Order getOrder(Long id) {
  return orderClient.fetch(id);
}

public Order cachedOrder(Long id, Throwable t) {
  return orderCache.get(id);
}`,
    explain: {
      concept: 'CircuitBreaker는 집 안의 두꺼비 스위치처럼 요청이 계속 터지면 회로를 끊어요. 끊긴 동안엔 대신 캐시된 주문(보험)을 돌려줘요.',
      terms: [
        { t: '@CircuitBreaker', d: '장애 감지해 회로를 열고 닫는 어노테이션' },
        { t: 'fallbackMethod', d: '회로가 열렸을 때 대신 부를 메서드 이름' },
        { t: 'cachedOrder', d: '캐시에서 꺼내는 보조 메서드' },
        { t: 'Throwable t', d: '실패 원인을 받는 인자' },
      ],
      why: '외부 서비스가 죽었을 때 내 서비스까지 줄줄이 쓰러지는 걸 막으려고요.',
      pitfall: 'fallback 메서드는 원본과 같은 인자 + 마지막 Throwable 을 받아야 해요.',
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
      concept: '회로는 CLOSED(평상)→OPEN(차단)→HALF_OPEN(점검) 세 상태를 돌아요. 최근 10번 중 절반 이상 실패하면 10초 동안 OPEN 으로 문을 닫아요.',
      terms: [
        { t: 'slidingWindowSize', d: '최근 N개 호출을 세는 창 크기' },
        { t: 'failureRateThreshold', d: '실패율(%) 이 커지면 회로 오픈' },
        { t: 'waitDurationInOpenState', d: 'OPEN 에 머무는 시간' },
        { t: 'permittedNumberOfCallsInHalfOpenState', d: 'HALF_OPEN 에서 시도 허용 수' },
      ],
      why: '장애가 난 서비스에 계속 요청을 쏟아붓지 않고 잠시 쉬어주려고요.',
      pitfall: 'slidingWindowSize 가 너무 작으면 한두 번 실패에 회로가 열려요.',
    },
  },
  {
    id: 'resil-bulkhead-semaphore',
    lang: 'java',
    title: '@Bulkhead (세마포어)',
    file: 'ReportService.java',
    code: `@Bulkhead(name = "reportBh")
public Report generate(String region) {
  return reportBuilder.build(region);
}`,
    explain: {
      concept: 'Bulkhead 는 배의 구획 벽이에요. 한 칸이 물 새어도 다른 칸은 안 젖어요. 동시에 N 개만 들여보내어 한 서비스가 자원을 다 먹지 못하게 해요.',
      terms: [
        { t: '@Bulkhead', d: '동시 호출 수를 제한하는 어노테이션' },
        { t: 'name', d: 'YAML 에 등록된 bulkhead 인스턴스' },
        { t: 'generate', d: '보호 대상 메서드' },
      ],
      why: '느린 서비스 하나가 스레드를 다 잡아먹어 다른 API 가 멈추는 걸 막으려고요.',
      pitfall: '기본 type 은 SEMAPHORE 로, 같은 스레드 안에서 돌아요. 별도 스레드가 필요하면 THREADPOOL 을 쓰세요.',
    },
  },
  {
    id: 'resil-bulkhead-threadpool',
    lang: 'java',
    title: 'Bulkhead (스레드풀)',
    file: 'ExportService.java',
    code: `@Bulkhead(name = "exportBh", type = Bulkhead.Type.THREADPOOL)
public CompletableFuture<File> export(String range) {
  File result = exporter.run(range);
  return CompletableFuture.completedFuture(result);
}`,
    explain: {
      concept: 'THREADPOOL 형은 전용 스레드 수영장을 파요. Resilience4j 가 자체 스레드 풀에서 메서드를 실행하므로 다른 서비스와 풀이 분리돼 한쪽이 꽉 차도 나머지는 건재해요.',
      terms: [
        { t: 'Bulkhead.Type.THREADPOOL', d: '별도 스레드 풀을 쓰는 형' },
        { t: 'CompletableFuture', d: '비동기 결과를 담는 박스 — THREADPOOL 형 필수 반환 타입' },
        { t: 'exporter.run', d: '실제 엑스포트 작업 (동기 실행)' },
        { t: 'completedFuture', d: '이미 완료된 결과를 CompletableFuture 로 감싸는 메서드' },
      ],
      why: '오래 걸리는 작업이 호출 스레드를 붙잡지 않도록 별도 풀로 격리하려고요.',
      pitfall: '메서드 안에서 다시 supplyAsync() 를 쓰면 ForkJoinPool 이 추가로 생겨 Bulkhead 풀 제어가 빗나가요. 내부는 동기 코드로 쓰세요.',
    },
  },
  {
    id: 'resil-rate-limiter',
    lang: 'java',
    title: '@RateLimiter',
    file: 'SignupService.java',
    code: `@RateLimiter(name = "signupRl", fallbackMethod = "busy")
public String signup(String email) {
  return userService.create(email);
}

public String busy(String email, Throwable t) {
  return "잠시 후 다시 가입해 주세요";
}`,
    explain: {
      concept: 'RateLimiter 는 식당 줄 세는 안내원이에요. 1초에 N 명까지만 들여보내고 넘으면 잠시 기다려달라고 해요.',
      terms: [
        { t: '@RateLimiter', d: '초당 요청 수를 제한하는 어노테이션' },
        { t: 'fallbackMethod', d: '제한 초과시 부를 보조 메서드' },
        { t: 'busy', d: '사용자에게 안내하는 보조 메서드' },
      ],
      why: '가입 폭주나 악성 반복 요청이 서버를 뭉개는 걸 막으려고요.',
      pitfall: 'limitForPeriod 와 limitRefreshPeriod 를 같이 안 맞추면 의도한 속도가 안 나와요.',
    },
  },
  {
    id: 'resil-time-limiter',
    lang: 'java',
    title: '@TimeLimiter',
    file: 'SearchService.java',
    code: `@TimeLimiter(name = "searchTl")
public CompletableFuture<List<Item>> search(String q) {
  return CompletableFuture.supplyAsync(() -> searchClient.query(q));
}`,
    explain: {
      concept: 'TimeLimiter 는 모래시계예요. 정해진 시간이 지나면 아직 안 온 결과를 포기하고 예외를 던져요.',
      terms: [
        { t: '@TimeLimiter', d: '실행 시간 상한을 정하는 어노테이션' },
        { t: 'CompletableFuture', d: '비동기 결과 박스' },
        { t: 'supplyAsync', d: '별도 스레드에서 실행' },
        { t: 'searchClient.query', d: '외부 검색 호출' },
      ],
      why: '외부 응답이 무한 대기하는 걸 끊어내어 스레드가 새어나가는 걸 막으려고요.',
      pitfall: '@TimeLimiter 는 반환 타입이 CompletableFuture 여야 해요. 동기 반환엔 쓸 수 없어요.',
    },
  },
  {
    id: 'resil-combo',
    lang: 'java',
    title: 'Retry + CircuitBreaker + Bulkhead 조합',
    file: 'ProductClient.java',
    code: `@Retry(name = "pR")
@CircuitBreaker(name = "pCb", fallbackMethod = "fallback")
@Bulkhead(name = "pBh")
public String call(String id) {
  return productClient.invoke(id);
}

public String fallback(String id, Throwable t) {
  return "cached:" + id;
}`,
    explain: {
      concept: '보호 장치 세 개를 겹쳐 입혀요. 가장 바깥에서 재시도(Retry) 를 수행하고, 장애가 지속하면 회로(CircuitBreaker) 를 열어 캐시로 빠져나가며, 가장 안쪽에서 동시 수를 제한(Bulkhead) 해요.',
      terms: [
        { t: '@Retry', d: '재시도 — 가장 바깥(outermost)' },
        { t: '@CircuitBreaker', d: '장애 회로 — 중간' },
        { t: '@Bulkhead', d: '동시 제한 — 가장 안쪽(innermost)' },
        { t: 'fallback', d: '모두 실패시 부르는 보조' },
      ],
      why: '한 가지 보호만으론 부족해요. 과부하+일시 장애+지속 장애를 층층으로 막으려고요.',
      pitfall: '기본 순서는 Retry → CircuitBreaker → Bulkhead 예요(Retry 가 가장 바깥). 순서를 바꾸려면 각 aspect 의 aspectOrder 프로퍼티를 명시적으로 설정하세요.',
    },
  },
  {
    id: 'resil-eureka-server',
    lang: 'java',
    title: 'Eureka 서버',
    file: 'EurekaServerApplication.java',
    code: `@SpringBootApplication
@EnableEurekaServer
public class EurekaServerApplication {
  public static void main(String[] args) {
    SpringApplication.run(EurekaServerApplication.class, args);
  }
}`,
    explain: {
      concept: 'Eureka 서버는 서비스들의 전화번호부예요. 각 서비스가 "나 여기 있어요" 라고 등록하면 서버가 목록을 유지해요.',
      terms: [
        { t: '@SpringBootApplication', d: '스프링 부트 진입점' },
        { t: '@EnableEurekaServer', d: '이 앱을 레지스트리 서버로 켬' },
        { t: 'SpringApplication.run', d: '부트 앱을 시작하는 정적 메서드' },
      ],
      why: '서비스 주소( IP/포트)를 고정하지 않고 실행마다 유연하게 찾으려고요.',
      pitfall: '서버 자신도 기본으로 클라이언트로 등록되려 해요. eureka.client.register-with-eureka=false 로 꺼주세요.',
    },
  },
  {
    id: 'resil-eureka-client',
    lang: 'java',
    title: 'Eureka 클라이언트',
    file: 'OrderServiceApplication.java',
    code: `@SpringBootApplication
@EnableDiscoveryClient
public class OrderServiceApplication {
  public static void main(String[] args) {
    SpringApplication.run(OrderServiceApplication.class, args);
  }
}`,
    explain: {
      concept: '클라이언트 앱은 시작할 때 전화번호부에 자기 이름과 주소를 등록해요. 다른 서비스를 찾을 때도 이 전화번호부를 먼저 뒤져요.',
      terms: [
        { t: '@EnableDiscoveryClient', d: '이 앱을 레지스트리에 등록·조회' },
        { t: '@SpringBootApplication', d: '부트 진입점' },
        { t: 'SpringApplication.run', d: '부트 앱 시작' },
      ],
      why: '주소를 하드코딩하지 않고 런타임에 서비스를 발견하려고요.',
      pitfall: '스프링 클라우드 2022+ (Spring Boot 3.x) 에서는 @EnableDiscoveryClient 어노테이션 없이도 의존성만 추가하면 자동 등록돼요. 구버전 @EnableEurekaClient 는 사용하지 마세요.',
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
      concept: '앱 이름과 레지스트리 주소를 적어요. "내 이름은 order-service, 전화번호부는 localhost:8761 이에요." 라고 알려주는 셈이에요.',
      terms: [
        { t: 'spring.application.name', d: '서비스 등록 이름' },
        { t: 'serviceUrl.defaultZone', d: 'Eureka 서버 주소' },
        { t: 'preferIpAddress', d: '호스트명 대신 IP 로 등록' },
      ],
      why: '한 개 레지스트리에 여러 앱이 각자 이름표를 붙이려고요.',
      pitfall: 'spring.application.name 이 빠지면 UNKNOWN 으로 등록돼요. 이름은 반드시 정하세요.',
    },
  },
  {
    id: 'resil-discovery-rest',
    lang: 'java',
    title: 'DiscoveryClient 로 호출',
    file: 'OrderClient.java',
    code: `public Order fetch(String serviceId, Long id) {
  ServiceInstance inst = discoveryClient.getInstances(serviceId).get(0);
  String url = inst.getUri().toString() + "/orders/" + id;
  return restTemplate.getForObject(url, Order.class);
}`,
    explain: {
      concept: '전화번호부에서 상대 주소를 얻어와요. 서비스 이름으로 인스턴스 하나를 골라 URL 을 만들고, 그 자리로 요청을 쏘아요.',
      terms: [
        { t: 'discoveryClient', d: '레지스트리에서 인스턴스를 찾는 클라이언트' },
        { t: 'ServiceInstance', d: '서비스 복제본 하나의 주소' },
        { t: 'getUri', d: '인스턴스의 http 주소' },
        { t: 'restTemplate.getForObject', d: '주소로 GET 호출해 변환' },
      ],
      why: 'IP 가 바뀌어도 코드를 고치지 않고 상대를 찾으려고요.',
      pitfall: 'get(0) 은 로드밸런싱 없이 첫 인스턴스만 써요. 실전에서는 @LoadBalanced RestTemplate 또는 WebClient + Spring Cloud LoadBalancer 를 쓰세요.',
    },
  },
  {
    id: 'resil-config-server',
    lang: 'java',
    title: 'Config Server',
    file: 'ConfigServerApplication.java',
    code: `@SpringBootApplication
@EnableConfigServer
public class ConfigServerApplication {
  public static void main(String[] args) {
    SpringApplication.run(ConfigServerApplication.class, args);
  }
}`,
    explain: {
      concept: 'Config Server 는 설정 파일을 한 곳에 모아둔 보관실이에요. 여러 앱이 각자 필요한 설정을 여기서 빌려가요.',
      terms: [
        { t: '@EnableConfigServer', d: '이 앱을 설정 배포 서버로 켬' },
        { t: '@SpringBootApplication', d: '부트 진입점' },
        { t: 'SpringApplication.run', d: '부트 앱 시작' },
      ],
      why: '배포마다 설정 파일을 여러 곳에 흩뿌리지 않고 한 곳에서 관리하려고요.',
      pitfall: '기본으로 Git 백엔드를 써요. git.uri 없이 시작하면 에러가 나요. native 프로파일로 파일 백엔드도 가능해요.',
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
      concept: 'native 프로파일은 Git 없이 클래스패스 폴더에서 설정 파일을 읽어요. 연습이나 단일 서버에서 쓰기 편해요.',
      terms: [
        { t: 'profiles.active: native', d: 'native 백엔드 프로파일 켬' },
        { t: 'cloud.config.server', d: 'Config Server 설정 루트' },
        { t: 'native', d: '파일 기반 백엔드' },
        { t: 'search-locations', d: '설정 파일을 찾을 경로' },
      ],
      why: 'Git 없이 단순하게 설정 파일을 제공하려고요.',
      pitfall: 'native 는 프로덕션에 권하지 않아요. 여러 인스턴스면 각자 파일을 가져야 해요.',
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
      concept: '클라이언트는 부팅 때 Config Server 에 "나는 order-service, prod 환경이에요" 라고 요청해 설정을 당겨와요.',
      terms: [
        { t: 'spring.config.import', d: '외부 설정 소스를 가져오는 지시' },
        { t: 'configserver:', d: 'Config Server 프로토콜 접두' },
        { t: 'cloud.config.name', d: '당겨올 애플리케이션 이름' },
        { t: 'profile', d: '환경 프로파일' },
      ],
      why: '설정을 바꿀 때마다 앱을 다시 빌드하지 않고 서버에서만 고치려고요.',
      pitfall: 'spring.config.import 는 부트 2.4+ 방식이에요. 구 bootstrap.yml 방식과 섞지 마세요.',
    },
  },
  {
    id: 'resil-saga-choreography',
    lang: 'java',
    title: 'Saga (이벤트 기반 — Choreography)',
    file: 'StockListener.java',
    code: `@KafkaListener(topics = "order-created", groupId = "stock")
public void onOrderCreated(OrderCreatedEvent evt) {
  stockService.reserve(evt.getOrderId(), evt.getItems());
  kafkaTemplate.send("stock-reserved", evt.getOrderId());
}`,
    explain: {
      concept: '안무(Choreography) 방식 사가는 중앙 지휘자 없이 서비스들이 이벤트를 통해 스스로 연쇄 동작해요. 주문 서비스가 "주문 만들었어" 라고 외치면 재고 서비스가 듣고 재고를 확보한 뒤 다시 "재고 확보했어" 라고 외쳐요.',
      terms: [
        { t: '@KafkaListener', d: '카프카 토픽을 듣는 리스너' },
        { t: 'topics', d: '구독할 메시지 채널' },
        { t: 'groupId', d: '같은 그룹은 한 번만 받아요' },
        { t: 'kafkaTemplate.send', d: '다시 이벤트를 발행' },
      ],
      why: '중앙 지휘자 없이 서비스들이 이벤트로 연쇄 동작하게 하려고요.',
      pitfall: '이벤트가 많이 쌓이면 흐름 추적이 어려워요. 분산 트레이싱이 필수예요.',
    },
  },
  {
    id: 'resil-saga-orchestrator',
    lang: 'java',
    title: 'Saga (지휘자 — Orchestrator)',
    file: 'OrderSaga.java',
    code: `public class OrderSaga {
  public void execute(Order order) {
    paymentClient.charge(order.getId());
    inventoryClient.reserve(order.getItems());
    shippingClient.schedule(order.getId());
  }

  public void compensate(Order order) {
    shippingClient.cancel(order.getId());
    inventoryClient.release(order.getItems());
    paymentClient.refund(order.getId());
  }
}`,
    explain: {
      concept: '지휘자(Orchestrator) 사가는 중앙 지휘자가 있어요. 결제→재고→배송 순으로 단계를 지휘하고, 어느 단계가 터지면 거꾸로 되돌아가는 보상(compensate) 을 실행해요.',
      terms: [
        { t: 'execute', d: '앞으로 단계를 진행하는 메서드' },
        { t: 'paymentClient.charge', d: '결제 단계' },
        { t: 'inventoryClient.reserve', d: '재고 확보 단계' },
        { t: 'compensate', d: '되돌아가는 보상 메서드' },
        { t: 'refund', d: '결제를 취소하는 보상' },
      ],
      why: '단계 순서와 보상을 한 곳에서 통제하려고요.',
      pitfall: '보상은 실행 순서의 역순이어야 해요. 여기선 배송 취소→재고 해제→결제 환불 순으로 돌려야 해요.',
    },
  },
  {
    id: 'resil-saga-compensate-listen',
    lang: 'java',
    title: 'Saga 보상 이벤트 수신',
    file: 'OrderCompensateListener.java',
    code: `@KafkaListener(topics = "payment-failed", groupId = "order")
public void onPaymentFailed(Long orderId) {
  orderService.cancel(orderId);
  kafkaTemplate.send("order-cancelled", orderId);
}`,
    explain: {
      concept: '결제가 실패했다는 소식을 들으면 주문을 취소하고 다른 서비스에게도 "주문 취소했어" 라고 알려요. 사가의 뒤걸음질 단계예요.',
      terms: [
        { t: '@KafkaListener', d: '카프카 토픽 리스너' },
        { t: 'payment-failed', d: '결제 실패 이벤트 토픽' },
        { t: 'orderService.cancel', d: '주문 취소 보상' },
        { t: 'kafkaTemplate.send', d: '취소 이벤트 재발행' },
      ],
      why: '앞 단계가 실패하면 뒷 단계를 취소하고 전체를 일관된 상태로 돌려요.',
      pitfall: '리스너는 멱등(같은 요청 여러 번해도 같은 결과) 이어야 해요. 카프카는 재전송할 수 있어요.',
    },
  },
  {
    id: 'resil-actuator-health',
    lang: 'java',
    title: 'Health Indicator 커스텀',
    file: 'ExternalApiHealthIndicator.java',
    code: `@Component
public class ExternalApiHealthIndicator implements HealthIndicator {
  private final ExternalClient externalClient;

  public ExternalApiHealthIndicator(ExternalClient externalClient) {
    this.externalClient = externalClient;
  }

  @Override
  public Health health() {
    if (externalClient.ping()) return Health.up().build();
    return Health.down().withDetail("error", "external unreachable").build();
  }
}`,
    explain: {
      concept: 'Actuator 의 /actuator/health 는 우리 앱의 건강 진단서예요. 외부 API 가 답하는지 직접 확인해 UP/DOWN 을 붙여요.',
      terms: [
        { t: 'HealthIndicator', d: '건강 체크를 담당하는 인터페이스' },
        { t: '@Component', d: '스프링이 관리하는 빈' },
        { t: 'Health.up', d: '건강함 표시' },
        { t: 'Health.down', d: '비정상 표시' },
        { t: 'withDetail', d: '추가 진단 정보' },
      ],
      why: '로드밸런서나 레지스트리가 건강 체크로 살아있는 인스턴스에만 트래픽을 보내려고요.',
      pitfall: 'health() 안에서 무거운 작업을 하면 체크 자체가 느려져요. 빠른 ping 만 넣으세요.',
    },
  },
];
