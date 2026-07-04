import type { Snippet } from '../../types';

export const reactive: Snippet[] = [
  {
    id: 'rx-mono-hello',
    lang: 'java',
    title: 'WebFlux Mono 한 건 반환',
    file: 'HelloController.java',
    code: `import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;
import reactor.core.publisher.Mono;

@RestController
public class HelloController {

  @GetMapping(path = "/hi")
  public Mono<String> hi() {
    System.out.println("[실행] hi 호출 - 구독 시점에 Hello Reactor 반환");
    return Mono.just("Hello Reactor");
  }
}`,
    explain: {
      concept:
        'Mono는 "0개 또는 1개의 결과를 약속하는 리액티브 상자"예요. ' +
        'HTTP GET /hi 요청이 들어오면 Mono.just("Hello Reactor")로 문자열 하나를 상자에 담아 반환해요. ' +
        '중요한 점은 이 시점에 실제 값이 전송되는 게 아니라 "구독(subscribe)할 때 비로소 값이 흘러간다"는 거예요. ' +
        '실무에서는 회원 조회, 주문 상세 처럼 "한 건의 결과"를 반환하는 모든 WebFlux API의 반환 타입을 Mono로 써요.',
      terms: [
        { t: '@GetMapping(path = "/hi")', d: 'GET /hi 요청을 이 메서드로 연결하는 스프링 WebFlux 어노테이션이에요' },
        { t: 'Mono<String>', d: '0~1개의 문자열을 비동기로 생성하는 리액티브 스트림 타입이에요' },
        { t: 'Mono.just("Hello Reactor")', d: '이미 준비된 값을 Mono 상자에 담아 반환하는 정적 팩토리 메서드예요' },
        { t: '@RestController', d: '이 클래스가 JSON을 반환하는 WebFlux 컨트롤러라고 선언하는 어노테이션이에요' },
        { t: 'System.out.println', d: '구독 시점에 호출되는 디버깅 출력이에요. Mono는 구독 전에는 아무 일도 안 일어나요' },
      ],
      why:
        '한 건의 결과를 블로킹 없이 비동기로 반환하고 싶을 때 써요. ' +
        '내장 Netty 서버가 스레드 하나로 수천 개의 동시 연결을 처리할 수 있어요.',
      expectedOutput:
        'curl http://localhost:8080/hi 실행 시:\n' +
        '[실행] hi 호출 - 구독 시점에 Hello Reactor 반환\n' +
        'HTTP/1.1 200 OK\n' +
        'Hello Reactor',
      realWorldUsage:
        '실제 WebFlux 기반 API 서버에서 모든 컨트롤러 메서드의 반환 타입을 Mono로 선언해 ' +
        '적은 수의 스레드로 대규모 동시 접속을 처리하는 논블로킹 아키텍처를 구현해요.',
      pitfall:
        'Mono를 반환만 하고 구독(subscribe)하지 않으면 아무 일도 일어나지 않아요. ' +
        '스프링 WebFlux가 컨트롤러 반환값은 자동 구독해주지만, 수동으로 쓸 때는 반드시 subscribe()를 호출해야 해요.',
    },
  },
  {
    id: 'rx-flux-stream',
    lang: 'java',
    title: 'Flux 여러 건 흘려보내기',
    file: 'CountController.java',
    code: `import java.time.Duration;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;
import reactor.core.publisher.Flux;

@RestController
public class CountController {

  @GetMapping(path = "/nums", produces = "text/event-stream")
  public Flux<Long> nums() {
    System.out.println("[실행] nums 호출 - 0~4까지 1초 간격");
    return Flux.interval(Duration.ofSeconds(1)).take(5);
  }
}`,
    explain: {
      concept:
        'Flux는 "0~N개의 데이터를 한 줄로 흘려보내는 리액티브 호스"예요. ' +
        'Flux.interval로 1초마다 숫자(0, 1, 2...)를 생성하고, take(5)로 처음 5개만 받고 호스를 닫아요. ' +
        'produces = "text/event-stream"은 브라우저가 SSE(Server-Sent Events) 스트리밍으로 받아들일 수 있게 응답 형식을 지정한 거예요. ' +
        '실무에서는 실시간 주식 가격, 로그 스트리밍, 채팅 메시지처럼 여러 건을 시간을 두고 계속 보내야 하는 API에 Flux를 써요.',
      terms: [
        { t: 'Flux<Long>', d: '0~N개의 Long 타입 데이터를 흘려보내는 리액티브 스트림 타입이에요' },
        { t: 'Flux.interval(Duration.ofSeconds(1))', d: '1초마다 0L, 1L, 2L... 를 방출하는 타이머 Flux를 생성해요' },
        { t: 'take(5)', d: '앞에서부터 5개의 데이터만 수신하고 나머지는 무시하며 스트림을 종료해요' },
        { t: 'produces = "text/event-stream"', d: 'SSE(Server-Sent Events) 형식으로 응답을 보내도록 지정하는 속성이에요' },
        { t: 'Duration.ofSeconds(1)', d: '1초를 나타내는 java.time.Duration 객체예요' },
      ],
      why:
        '여러 건의 데이터를 한 번에 모아 보내는 대신 시간을 두고 실시간으로 스트리밍하려고요. ' +
        '브라우저가 한 번 연결을 맺으면 계속 데이터를 받아볼 수 있어요.',
      expectedOutput:
        'curl http://localhost:8080/nums 실행 시:\n' +
        '[실행] nums 호출 - 0~4까지 1초 간격\n' +
        'data: 0 (1초 후)\n' +
        'data: 1 (1초 후)\n' +
        'data: 2 (1초 후)\n' +
        'data: 3 (1초 후)\n' +
        'data: 4 (스트림 종료)',
      realWorldUsage:
        '실제 실시간 대시보드에서 주문량·CPU 사용률 같은 지표를 1초마다 SSE로 브라우저에 푸시해, ' +
        '사용자가 새로고침 없이도 실시간 그래프를 볼 수 있게 해요.',
      pitfall:
        'take() 없이 interval을 무한 Flux로 반환하면 스트림이 절대 종료되지 않아 커넥션이 영원히 살아있어요. ' +
        '브라우저 탭을 닫아도 서버에서는 리소스가 계속 소비될 수 있어요.',
    },
  },
  {
    id: 'rx-map-upper',
    lang: 'java',
    title: 'map 값 변환',
    file: 'NameService.java',
    code: `import reactor.core.publisher.Mono;
import org.springframework.stereotype.Service;

@Service
public class NameService {

  public Mono<String> shout(String name) {
    System.out.println("[실행] shout - input: " + name);
    return Mono.just(name)
      .map(s -> {
        String result = s.toUpperCase();
        System.out.println("[변환] map - " + s + " -> " + result);
        return result;
      });
  }
}`,
    explain: {
      concept:
        'map은 "상자 안의 값만 꺼내서 새 값으로 바꾸고 다시 상자에 담는" 변환 연산자예요. ' +
        'Mono.just(name)으로 값을 상자에 넣은 후, .map(s -> s.toUpperCase())로 소문자를 대문자로 변환해도 상자 자체(Mono)는 그대로예요. ' +
        '리액티브 스트림에서 map은 동기적으로 즉시 실행되는 변환이라서, 변환 자체에 I/O나 지연은 없어요. ' +
        '실무에서는 API 응답에 필드명 변환, 단위 변환, 민감 정보 마스킹 같은 단순 변환에 map을 써요.',
      terms: [
        { t: 'map(s -> ...)', d: '상자 속 값을 함수로 변환해 새 값을 담은 같은 타입의 상자를 반환해요' },
        { t: 's.toUpperCase()', d: '람다 파라미터 s를 대문자 문자열로 변환하는 String 메서드예요' },
        { t: 'Mono.just(name)', d: 'name 값을 Mono 상자에 담는 시작점이에요. 값이 null이면 NullPointerException이 발생해요' },
        { t: 'result 변수', d: '변환 결과를 잠시 담았다가 반환해요. 디버깅을 위한 중간 변수예요' },
        { t: '@Service', d: '이 클래스가 비즈니스 로직을 담당하는 스프링 빈이에요' },
      ],
      why:
        '상자(Mono/Flux)의 구조를 유지한 채 값만 변환하려고요. ' +
        'map은 1:1 변환이라서 결과 타입도 여전히 Mono<String>으로 유지돼요.',
      expectedOutput:
        '[실행] shout - input: hello\n' +
        '[변환] map - hello -> HELLO\n' +
        '(구독 시 "HELLO" 반환)',
      realWorldUsage:
        '실제 API에서 DB에서 조회한 Entity를 DTO로 변환하거나, ' +
        '외부 API 응답의 필드명을 카멜케이스로 바꾸는 변환 파이프라인에서 map이 가장 많이 쓰여요.',
      pitfall:
        'map 안에서 또 다른 Mono를 반환하면 상자가 이중으로 겹쳐 Mono<Mono<String>>이 돼요. ' +
        '예: .map(s -> findById(s)) - 이렇게 비동기 호출을 중첩하려면 flatMap을 써야 해요.',
    },
  },
  {
    id: 'rx-flatmap-chain',
    lang: 'java',
    title: 'flatMap 비동기 줄 잇기',
    file: 'UserService.java',
    code: `import reactor.core.publisher.Mono;
import org.springframework.stereotype.Service;

@Service
public class UserService {

  public Mono<String> greeting(Long id) {
    System.out.println("[실행] greeting - id: " + id);
    return findById(id)
      .flatMap(u -> {
        String msg = "hi " + u.getName();
        System.out.println("[비동기] flatMap - " + msg);
        return Mono.just(msg);
      });
  }

  private Mono<User> findById(Long id) {
    System.out.println("[조희] findById - id: " + id);
    return Mono.just(new User(id, "Alice"));
  }

  static class User {
    private final Long id;
    private final String name;

    User(Long id, String name) { this.id = id; this.name = name; }
    String getName() { return name; }
    Long getId() { return id; }
  }
}`,
    explain: {
      concept:
        'flatMap은 "앞 상자를 열고 그 값을 받아서 다음 비동기 상자로 이어주는" 연결 도구예요. ' +
        'findById(id)가 User를 담은 Mono를 반환하고, flatMap이 이 User를 꺼내서 "hi Alice"라는 인사말을 새 Mono에 담아줘요. ' +
        'map과의 차이는, flatMap은 람다 안에서 반환하는 타입이 Mono(또는 Flux)인 경우를 처리해준다는 점이에요. ' +
        '실무에서는 DB 조회 -> API 호출 -> 변환 같은 비동기 체인 연결에 flatMap이 핵심이에요.',
      terms: [
        { t: 'flatMap(u -> ...)', d: '앞 Mono의 값(u)을 받아 새 Mono(또는 Flux)로 변환하고 상자를 평탄화해요' },
        { t: 'findById(id)', d: '비동기로 사용자 정보를 조회해 Mono<User>로 반환하는 메서드예요' },
        { t: 'Mono.just(msg)', d: '인사말을 새 Mono 상자에 담아 반환해요. flatMap이 이 Mono를 평탄화해 Mono<String>으로 만들어줘요' },
        { t: 'Mono<User>', d: '사용자 정보를 0~1건 담는 비동기 상자예요. DB 조회 결과를 표현해요' },
        { t: 'u.getName()', d: 'flatMap이 풀어준 User 객체에서 이름을 뽑아내는 게터 호출이에요' },
      ],
      why:
        '비동기 작업(DB 조회 -> HTTP 호출 -> 결과 변환)을 순서대로 이어서 하나의 흐름으로 만들려고요. ' +
        'flatMap 덕분에 콜백 지옥 없이 깔끔한 체이닝이 돼요.',
      expectedOutput:
        '[실행] greeting - id: 1\n' +
        '[조희] findById - id: 1\n' +
        '[비동기] flatMap - hi Alice\n' +
        '(구독 시 "hi Alice" 반환)',
      realWorldUsage:
        '실제 WebFlux 서비스에서 "회원 조회(findById) -> 권한 확인(checkPermission, 외부 API) -> 응답 변환(toDto)"처럼 ' +
        '여러 비동기 단계를 flatMap 체인으로 순차 실행하는 게 표준 패턴이에요.',
      pitfall:
        'map을 쓰면 Mono 안에 Mono가 겹쳐 Mono<Mono<String>>이 돼요. ' +
        '비동기 연쇄(앞 결과 -> 다음 비동기 호출)는 항상 flatMap을 쓰세요. IDE 타입 힌트를 보면 실수를 방지할 수 있어요.',
    },
  },
  {
    id: 'rx-zip-pair',
    lang: 'java',
    title: 'zip 두 흐름 합치기',
    file: 'PairService.java',
    code: `import reactor.core.publisher.Mono;
import org.springframework.stereotype.Service;

@Service
public class PairService {

  public Mono<String> label(Long id) {
    System.out.println("[실행] label - id: " + id);
    return Mono.zip(
      findById(id),
      findStatus(id)
    ).map(t -> {
      String result = t.getT1().getName() + ":" + t.getT2();
      System.out.println("[결과] zip - " + result);
      return result;
    });
  }

  private Mono<User> findById(Long id) {
    return Mono.just(new User(id, "Alice"));
  }

  private Mono<String> findStatus(Long id) {
    return Mono.just("ACTIVE");
  }

  static class User {
    private final Long id;
    private final String name;
    User(Long id, String name) { this.id = id; this.name = name; }
    String getName() { return name; }
  }
}`,
    explain: {
      concept:
        'Mono.zip은 "두 개의 비동기 작업이 모두 완료되면 그 결과를 하나로 합쳐주는" 코디네이터예요. ' +
        'findById와 findStatus를 동시에(병렬로) 실행하고, 두 결과가 모두 도착하면 Tuple로 묶어서 전달해요. ' +
        't.getT1()이 첫 번째 Mono(User), t.getT2()가 두 번째 Mono(String status)의 결과예요. ' +
        '실무에서는 "회원 정보 + 권한 정보"처럼 서로 독립적인 정보를 동시에 조회하고 조합할 때 zip을 써 지연 시간을 단축해요.',
      terms: [
        { t: 'Mono.zip(Mono, Mono)', d: '두 Mono를 병렬로 실행하고 둘 다 완료되면 Tuple로 결과를 묶어줘요' },
        { t: 't.getT1()', d: 'Tuple에서 첫 번째 Mono의 결과를 꺼내요. 여기선 User 객체예요' },
        { t: 't.getT2()', d: 'Tuple에서 두 번째 Mono의 결과를 꺼내요. 여기선 상태 문자열 "ACTIVE"예요' },
        { t: '.map(t -> ...)', d: 'zip 결과 Tuple을 원하는 형태로 변환해요. 여기선 "Alice:ACTIVE" 같은 문자열을 만들어요' },
        { t: 'findById + findStatus 병렬', d: '두 Mono가 동시에 실행돼 직렬보다 빠르게 완료돼요' },
      ],
      why:
        '두 개의 독립적인 비동기 조회를 순차가 아니라 동시에 날려서 전체 지연 시간을 더 긴 쪽 하나로 줄이려고요. ' +
        'findById가 100ms, findStatus가 80ms면 순차는 180ms, zip은 100ms로 끝나요.',
      expectedOutput:
        '[실행] label - id: 1\n' +
        '[결과] zip - Alice:ACTIVE\n' +
        '(구독 시 "Alice:ACTIVE" 반환)',
      realWorldUsage:
        '실제 API에서 상품 정보(ProductService, 50ms)와 리뷰 평점(ReviewService, 80ms)을 Mono.zip으로 병렬 조회해 ' +
        '순차 130ms -> 병렬 80ms로 응답 속도를 개선하는 패턴이 흔해요.',
      pitfall:
        'zip에 참여한 Mono 중 하나라도 빈 Mono(Mono.empty())면 zip 결과 전체가 빈 Mono가 돼요. ' +
        '한쪽은 없을 수 있으면 zip 대신 defaultIfEmpty 같은 대체값을 먼저 붙이고 zip을 쓰세요.',
    },
  },
  {
    id: 'rx-r2dbc-find',
    lang: 'java',
    title: 'R2DBC 반응형 조회',
    file: 'UserR2dbcDao.java',
    code: `import io.r2dbc.spi.Row;
import io.r2dbc.spi.RowMetadata;
import org.springframework.r2dbc.core.DatabaseClient;
import reactor.core.publisher.Flux;
import org.springframework.stereotype.Component;

@Component
public class UserR2dbcDao {

  private final DatabaseClient databaseClient;

  public UserR2dbcDao(DatabaseClient databaseClient) {
    this.databaseClient = databaseClient;
  }

  public Flux<UserEntity> findAll() {
    System.out.println("[실행] findAll - R2DBC 조회");
    return databaseClient
      .sql("select id, name from users")
      .map((row, meta) -> {
        UserEntity user = new UserEntity(row.get("id", Long.class), row.get("name", String.class));
        System.out.println("[매핑] row -> " + user);
        return user;
      })
      .all();
  }

  static class UserEntity {
    Long id;
    String name;
    UserEntity(Long id, String name) { this.id = id; this.name = name; }
    @Override
    public String toString() { return "UserEntity(id=" + id + ", name=" + name + ")"; }
  }
}`,
    explain: {
      concept:
        'R2DBC는 "블로킹 없는 반응형 데이터베이스 드라이버"예요. JPA의 EntityManager와 달리 모든 결과가 Mono/Flux로 반환돼요. ' +
        'DatabaseClient.sql(...)로 쿼리를 정의하고, .map((row, meta) -> ...)으로 DB의 각 행(row)을 자바 객체로 변환하는 매핑 함수를 등록해요. ' +
        '.all()은 모든 행을 Flux<UserEntity>로 흘려보내는 최종 연산자예요. 한 행이 도착할 때마다 즉시 자바 객체로 변환돼 스트리밍돼요. ' +
        '실무에서는 WebFlux + R2DBC + PostgreSQL 조합으로 완전한 논블로킹 DB 액세스를 구현해요.',
      terms: [
        { t: 'DatabaseClient', d: 'R2DBC를 스프링 방식으로 쉽게 사용하게 해주는 헬퍼 클래스예요. JDBC의 JdbcTemplate 같은 위치예요' },
        { t: '.sql("select id, name from users")', d: '실행할 SQL 쿼리를 설정해요. 아직 실행되지는 않고 스펙만 정의해요' },
        { t: '.map((row, meta) -> ...)', d: 'DB 결과 행 하나를 자바 객체로 변환하는 매핑 함수예요. row.get(컬럼명, 타입)으로 값에 접근해요' },
        { t: '.all()', d: '쿼리를 실행하고 모든 결과 행을 Flux로 흘려보내는 트리거 연산자예요' },
        { t: 'row.get("id", Long.class)', d: 'DB 컬럼 id의 값을 Long 타입으로 읽어와요. 타입 명시가 없으면 추론 실패로 컴파일 에러가 날 수 있어요' },
      ],
      why:
        'JDBC/JPA처럼 쿼리 결과를 기다리며 스레드가 블로킹되는 대신, ' +
        '논블로킹으로 DB 결과를 Flux 스트림으로 받아 리액티브 파이프라인과 자연스럽게 연결하려고요.',
      expectedOutput:
        '[실행] findAll - R2DBC 조회\n' +
        '[매핑] row -> UserEntity(id=1, name=Alice)\n' +
        '[매핑] row -> UserEntity(id=2, name=Bob)\n' +
        '(Flux<UserEntity>로 Alice, Bob 순차 방출)',
      realWorldUsage:
        '실제 실시간 모니터링 시스템에서 수백만 건의 로그를 R2DBC Flux로 스트리밍해, ' +
        '전체를 메모리에 한 번에 올리지 않고 한 건씩 변환·전송하는 파이프라인을 구현해요.',
      pitfall:
        'row.get()에 타입 클래스(Long.class)를 명시하지 않으면 컴파일러가 타입 추론에 실패해 컴파일 에러가 나요. ' +
        '타입 인자는 반드시 명시하세요.',
    },
  },
  {
    id: 'rx-r2dbc-save',
    lang: 'java',
    title: 'R2DBC 반응형 삽입',
    file: 'UserR2dbcDao.java',
    code: `import org.springframework.r2dbc.core.DatabaseClient;
import reactor.core.publisher.Mono;
import org.springframework.stereotype.Component;

@Component
public class UserR2dbcDao {

  private final DatabaseClient databaseClient;

  public UserR2dbcDao(DatabaseClient databaseClient) {
    this.databaseClient = databaseClient;
  }

  public Mono<Long> save(String name) {
    System.out.println("[실행] save - name: " + name);
    return databaseClient
      .sql("insert into users(name) values(:n)")
      .bind("n", name)
      .fetch()
      .rowsUpdated();
  }
}`,
    explain: {
      concept:
        '반응형 INSERT는 SQL의 ":n" 같은 이름표(네임드 파라미터)로 값을 안전하게 바인딩하는 방식이에요. ' +
        '.bind("n", name)이 :n 자리에 name 값을 SQL 인젝션 없이 끼워 넣고, .fetch()로 실행을 시작해요. ' +
        '반환값 Mono<Long>은 영향받은 행 수(rowsUpdated)를 1건 상자에 담아 돌려줘요. 1건 INSERT면 보통 1L이 반환돼요. ' +
        '실무에서는 INSERT, UPDATE, DELETE 모두 이 패턴으로 작성하고, 반환된 행 수로 성공 여부를 판단해요.',
      terms: [
        { t: '.sql("insert into users(name) values(:n)")', d: ':n은 이름표 파라미터예요. bind로 나중에 값을 채워 넣어요' },
        { t: '.bind("n", name)', d: ':n 자리에 name 변수 값을 안전하게 바인딩해요. SQL 인젝션을 원천 차단해요' },
        { t: '.fetch()', d: 'INSERT 실행을 시작하는 트리거예요. 아직 결과를 받지는 않아요' },
        { t: '.rowsUpdated()', d: 'INSERT로 영향받은 행 수를 Mono<Long>으로 반환해요. 1건 삽입이면 1이 나와요' },
        { t: ':n 네임드 파라미터', d: 'SQL 안의 플레이스홀더예요. ? 와 달리 의미 있는 이름을 붙여 가독성을 높여요' },
      ],
      why:
        '블로킹 없이 데이터를 삽입하면서 SQL 인젝션을 방지하고, ' +
        '영향받은 행 수를 Mono로 받아 후속 비동기 체인에서 성공 여부를 처리하려고요.',
      expectedOutput:
        '[실행] save - name: Charlie\n' +
        '(구독 시 Mono<Long>으로 1L 반환 - 1건 삽입 성공)',
      realWorldUsage:
        '실제 회원가입 API에서 R2DBC save로 DB에 INSERT하고, rowsUpdated() 결과가 1이면 성공, 0이면 실패로 판단해 ' +
        '성공 시 onSuccess 이벤트로 환영 이메일 발송을 트리거하는 패턴이 흔해요.',
      pitfall:
        '문자열 합치기("INSERT INTO users VALUES(\'" + name + "\')")로 SQL을 만들면 SQL 인젝션에 노출돼요. ' +
        '값은 반드시 bind()로 전달해야 해요. name에 "admin\'); DROP TABLE users; --" 같은 값이 들어올 수도 있어요.',
    },
  },
  {
    id: 'rx-sse-event',
    lang: 'java',
    title: 'SSE ServerSentEvent 보내기',
    file: 'SseController.java',
    code: `import java.time.Duration;
import org.springframework.http.codec.ServerSentEvent;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;
import reactor.core.publisher.Flux;

@RestController
public class SseController {

  @GetMapping(path = "/tick", produces = "text/event-stream")
  public Flux<ServerSentEvent<String>> tick() {
    System.out.println("[실행] tick - 2초마다 tick 이벤트");
    return Flux.interval(Duration.ofSeconds(2))
      .map(i -> {
        ServerSentEvent<String> evt = ServerSentEvent.<String>builder()
            .event("tick")
            .data("n=" + i)
            .build();
        System.out.println("[이벤트] tick - n=" + i);
        return evt;
      });
  }
}`,
    explain: {
      concept:
        'SSE(Server-Sent Events)는 서버가 클라이언트에게 "일방향으로 계속 데이터를 밀어넣는" HTTP 표준 기술이에요. ' +
        'Flux.interval로 2초마다 값을 생성하고, .map으로 각 값을 ServerSentEvent 봉투에 담아 이벤트 이름("tick")과 데이터("n=0")를 붙여 보내요. ' +
        'ServerSentEvent.builder()로 이벤트 이름(event), 데이터(data), ID(id) 등을 유연하게 구성할 수 있어요. ' +
        '실무에서는 실시간 알림, 주가 업데이트, 로그 스트리밍 등에 SSE를 써요(WebSocket보다 가볍고 방화벽 친화적이에요).',
      terms: [
        { t: 'ServerSentEvent<String>', d: 'SSE 이벤트의 이름·데이터·ID를 캡슐화한 스프링 타입이에요' },
        { t: '.event("tick")', d: '이 이벤트에 "tick"이라는 이름을 붙여요. JS에서는 addEventListener("tick", ...)로 받아요' },
        { t: '.data("n=" + i)', d: '클라이언트에 전달할 데이터 본문이에요. "n=0", "n=1" 순서로 보내져요' },
        { t: 'builder()', d: 'ServerSentEvent를 생성하는 빌더 패턴 진입점이에요. .build()로 최종 객체를 만들어요' },
        { t: 'produces = "text/event-stream"', d: '응답 Content-Type을 SSE 전용 MIME으로 설정해요. 없으면 일반 JSON으로 처리돼요' },
      ],
      why:
        '서버 푸시 알림을 WebSocket보다 가볍게 구현하고, HTTP 인프라(프록시, 방화벽)와의 호환성을 높이려고요.',
      expectedOutput:
        'curl http://localhost:8080/tick 실행 시:\n' +
        '[실행] tick - 2초마다 tick 이벤트\n' +
        'event:tick\ndata:n=0\n' +
        'event:tick\ndata:n=1\n' +
        '(계속 2초 간격으로 이어짐)',
      realWorldUsage:
        '실제 배포 진행 상황을 SSE로 클라이언트에 실시간 전송하는 CI/CD 대시보드에서, ' +
        '각 빌드 단계마다 event:"build", event:"test", event:"deploy"로 서로 다른 이벤트명을 붙여 구분해요.',
      pitfall:
        'produces = "text/event-stream"을 빼먹으면 응답이 일반 JSON이나 Flux.toString()이 돼 브라우저가 SSE로 인식하지 못해요. ' +
        'SSE를 쓸 때는 반드시 produces를 명시해야 해요.',
    },
  },
  {
    id: 'rx-backpressure-limit',
    lang: 'java',
    title: 'Backpressure limitRate',
    file: 'FastSourceService.java',
    code: `import reactor.core.publisher.Flux;
import org.springframework.stereotype.Service;

@Service
public class FastSourceService {

  public Flux<Integer> throttled() {
    System.out.println("[실행] throttled - limitRate 100 적용");
    return fastSource()
      .limitRate(100)
      .doOnNext(n -> System.out.println("[수신] " + n));
  }

  private Flux<Integer> fastSource() {
    return Flux.range(1, 500);
  }
}`,
    explain: {
      concept:
        '배압(Backpressure)은 "생산자가 소비자보다 훨씬 빠를 때 소비자가 생산 속도를 제어하는" 리액티브 스트림의 핵심 개념이에요. ' +
        'fastSource()가 500개의 숫자를 한 번에 쏟아내도, limitRate(100)이 "한 번에 100개까지만 요청해"라고 제한을 걸어요. ' +
        '소비자가 첫 100개를 다 처리하면 "다음 100개 주세요"라고 재요청(request)을 보내서 점진적으로 데이터를 소비해요. ' +
        '실무에서는 DB에서 대량 데이터를 Flux로 읽을 때 limitRate로 메모리 사용을 제한하고 청크 단위로 처리해요.',
      terms: [
        { t: 'fastSource()', d: '500개의 숫자를 빠르게 생성하는 생산자 Flux예요. 제한 없으면 한 번에 쏟아져요' },
        { t: 'limitRate(100)', d: '상위 생산자에게 "한 번에 100개까지만 달라"고 prefetch 요청을 보내는 배압 연산자예요' },
        { t: 'doOnNext(n -> ...)', d: '각 숫자가 도착할 때 콘솔에 출력해요. limitRate 덕분에 100개씩 끊어서 출력돼요' },
        { t: 'Flux.range(1, 500)', d: '1부터 500까지 정수를 방출하는 정적 팩토리예요' },
        { t: 'prefetch', d: '소비자가 생산자에게 한 번에 요청하는 데이터 개수예요. limitRate가 이 값을 조정해요' },
      ],
      why:
        '생산 속도가 소비자 처리 속도를 압도할 때, 소비자 쪽 메모리가 Overflow되는 걸 막고 ' +
        '생산자-소비자 간 처리 속도 차이를 조절하려고요.',
      expectedOutput:
        '[실행] throttled - limitRate 100 적용\n' +
        '[수신] 1 ... [수신] 100 (첫 청크)\n' +
        '[수신] 101 ... [수신] 200 (두 번째 청크)\n' +
        '...\n' +
        '[수신] 401 ... [수신] 500 (다섯 번째 청크)',
      realWorldUsage:
        '실제 파일 업로드 시스템에서 1GB 파일을 1MB 청크 단위로 Flux로 읽고, ' +
        'limitRate(10)으로 DB INSERT 부하를 제어하며 청크 단위로 저장해 OutOfMemory를 방지해요.',
      pitfall:
        '생산자가 차단 없이 무제한으로 데이터를 방출하고 소비자가 limitRate를 안 걸면, ' +
        '소비자의 메모리가 Overflow돼 OutOfMemoryError가 발생할 수 있어요.',
    },
  },
  {
    id: 'rx-webclient-get',
    lang: 'java',
    title: 'WebClient 비동기 HTTP GET',
    file: 'ApiService.java',
    code: `import org.springframework.web.reactive.function.client.WebClient;
import reactor.core.publisher.Mono;
import org.springframework.stereotype.Service;

@Service
public class ApiService {

  private final WebClient webClient;

  public ApiService(WebClient.Builder builder) {
    this.webClient = builder.baseUrl("http://localhost:8081").build();
    System.out.println("[생성] WebClient 생성 - baseUrl: http://localhost:8081");
  }

  public Mono<String> fetchName(Long id) {
    System.out.println("[실행] fetchName - id: " + id);
    return webClient
      .get()
      .uri("/users/{id}", id)
      .retrieve()
      .bodyToMono(String.class)
      .doOnNext(body -> System.out.println("[응답] " + body));
  }
}`,
    explain: {
      concept:
        'WebClient는 RestTemplate의 "논블로킹 후계자"예요. HTTP 요청을 보내고 응답을 Mono/Flux로 받아서 리액티브 파이프라인에 자연스럽게 연결할 수 있어요. ' +
        '.uri("/users/{id}", id)로 URI 템플릿에 id 값을 안전하게 끼워 넣고, .retrieve()로 요청을 시작해요. ' +
        '.bodyToMono(String.class)로 응답 본문을 단일 Mono로 변환하는데, 이때까지도 요청을 보내지 않고 구독 시점에 실제 HTTP 요청이 발생해요. ' +
        '실무에서는 WebClient + Reactor 조합으로 외부 API를 호출할 때 리액티브 체인의 중간 단계로 자연스럽게 통합해요.',
      terms: [
        { t: 'WebClient.Builder', d: 'baseUrl, defaultHeader, codec 등을 미리 설정해 WebClient 인스턴스를 만드는 빌더예요' },
        { t: '.get()', d: 'HTTP GET 요청 스펙을 정의하기 시작하는 메서드예요. post(), put(), delete()도 있어요' },
        { t: '.uri("/users/{id}", id)', d: 'URI 템플릿 {id}에 변수값을 채워 URL 경로를 완성해요. 자동 URL 인코딩을 해줘요' },
        { t: '.bodyToMono(String.class)', d: '응답 본문 전체를 읽어 Mono<String>으로 반환해요. 응답이 비어 있으면 빈 Mono예요' },
        { t: '.doOnNext(body -> ...)', d: '응답 본문이 도착할 때 콘솔에 출력하는 부수 효과 연산자예요' },
      ],
      why:
        '블로킹 없이 외부 HTTP API를 호출해 리액티브 파이프라인에서 중간 결과로 사용하려고요. ' +
        'RestTemplate은 호출 스레드를 블로킹하지만, WebClient는 이벤트 루프 스레드를 물고 있지 않아요.',
      expectedOutput:
        '[생성] WebClient 생성 - baseUrl: http://localhost:8081\n' +
        '[실행] fetchName - id: 1\n' +
        '[응답] {"name":"Alice"}\n' +
        '(Mono<String>로 JSON 본문 반환)',
      realWorldUsage:
        '실제 WebFlux 기반 마이크로서비스에서 OrderService가 PaymentService를 호출할 때 ' +
        'WebClient + bodyToMono로 논블로킹 HTTP 호출을 하고, flatMap으로 다음 처리 단계와 자연스럽게 연결해요.',
      pitfall:
        'exchangeToMono()로 바꾸면 응답 객체(ClientResponse)를 직접 다룰 수 있지만, ' +
        '응답 본문을 반드시 소비(releaseBody)해야 해요. 소비하지 않으면 메모리·커넥션 누수가 발생해요. 단순 상태 코드 처리엔 retrieve()가 더 안전해요.',
    },
  },
  {
    id: 'rx-onerror-resume',
    lang: 'java',
    title: 'onErrorResume 대체값',
    file: 'SafeService.java',
    code: `import reactor.core.publisher.Mono;
import org.springframework.stereotype.Service;

@Service
public class SafeService {

  public Mono<String> safeName(Long id) {
    System.out.println("[실행] safeName - id: " + id);
    return findById(id)
      .onErrorResume(e -> {
        System.out.println("[폴백] 에러 발생 - " + e.getMessage() + ", guest로 대체");
        return Mono.just("guest");
      });
  }

  private Mono<String> findById(Long id) {
    return Mono.error(new RuntimeException("user not found: " + id));
  }
}`,
    explain: {
      concept:
        'onErrorResume은 "앞 상자에서 에러가 터지면 대체 상자를 제공하는 안전망"이에요. ' +
        'findById가 Mono.error로 의도적으로 예외를 던져도, onErrorResume이 그 예외를 가로채서 대신 "guest"라는 기본값을 담은 Mono를 반환해요. ' +
        '이렇게 하면 에러가 하류로 전파돼 전체 스트림이 중단되는 대신, 우회 경로를 통해 정상적인 흐름으로 이어져요. ' +
        '실무에서는 외부 API 타임아웃, DB 조회 실패 시 기본값·캐시값으로 대체하는 graceful degradation 패턴에 써요.',
      terms: [
        { t: 'onErrorResume(e -> ...)', d: '상위에서 발생한 예외(e)를 받아 대체 Mono(또는 Flux)를 반환하는 에러 복구 연산자예요' },
        { t: 'e -> Mono.just("guest")', d: '예외가 발생하면 에러 메시지를 로깅하고 "guest"라는 기본값으로 대체해요' },
        { t: 'Mono.error(...)', d: '의도적으로 예외를 발생시키는 Mono 생성자예요. 실제로는 DB not found 등의 예외가 발생해요' },
        { t: 'findById(id)', d: '사용자 조회 메서드예요. 여기선 데모용으로 항상 예외를 던져요' },
        { t: '"guest"', d: '기본 대체값이에요. 로그인하지 않은 사용자에게 보여주는 표시 이름으로 자주 써요' },
      ],
      why:
        '예외를 숨기거나 로그만 남기지 않고, 대체값(기본 프로필 이미지, 캐시 데이터)으로 정상 흐름을 유지해 ' +
        '사용자에게 "오류가 발생했습니다" 대신 부분적으로라도 서비스를 계속 제공하려고요.',
      expectedOutput:
        '[실행] safeName - id: 999\n' +
        '[폴백] 에러 발생 - user not found: 999, guest로 대체\n' +
        '(구독 시 "guest" 반환)',
      realWorldUsage:
        '실제 상품 추천 API에서 추천 엔진이 타임아웃되면 onErrorResume으로 "지난주 인기 상품" 캐시를 대신 반환해 ' +
        '빈 추천 목록보다 나은 사용자 경험을 유지하는 패턴이 흔해요.',
      pitfall:
        'onErrorResume 안에서 다시 Mono.error를 반환하면 에러가 대체되지 않고 그대로 하류로 전파돼요. ' +
        '대체값은 반드시 정상 Mono(just, justOrEmpty 등)나 캐시에서 가져온 값이어야 해요.',
    },
  },
  {
    id: 'rx-filter-even',
    lang: 'java',
    title: 'Flux filter 걸러내기',
    file: 'NumberService.java',
    code: `import reactor.core.publisher.Flux;
import org.springframework.stereotype.Service;

@Service
public class NumberService {

  public Flux<Integer> onlyEven() {
    System.out.println("[실행] onlyEven - 1~10 중 짝수만");
    return Flux.range(1, 10)
      .filter(n -> n % 2 == 0)
      .doOnNext(n -> System.out.println("[통과] " + n));
  }
}`,
    explain: {
      concept:
        'filter는 "호스의 각 값에 조건을 물어보고 참인 값만 통과시키는" 검문소예요. ' +
        'Flux.range(1, 10)이 1부터 10까지 숫자를 차례로 흘려보내면, filter(n -> n % 2 == 0)이 "짝수냐?"고 물어보고 true인 2, 4, 6, 8, 10만 하류로 보내요. ' +
        '조건에 맞지 않는 값은 조용히 건너뛰고, 에러도 발생하지 않고 그냥 생략돼요. ' +
        '실무에서는 목록에서 활성 사용자만, 재고 있는 상품만, 에러 로그 중에서도 특정 레벨만 걸러낼 때 filter를 써요.',
      terms: [
        { t: 'Flux.range(1, 10)', d: '1부터 10까지 정수를 순차적으로 방출하는 정적 팩토리 메서드예요' },
        { t: 'filter(n -> n % 2 == 0)', d: '값 n을 받아 짝수면 true를 반환하는 predicate예요. true인 값만 하류로 전달돼요' },
        { t: 'n % 2', d: '모듈로 연산자예요. 2로 나눈 나머지를 구해 짝수 판별에 써요' },
        { t: 'doOnNext(n -> ...)', d: 'filter를 통과한 값만 출력돼요. 여기서 "1, 3, 5..." 는 출력되지 않아요' },
        { t: 'predicate', d: '값을 받아 boolean을 반환하는 함수형 인터페이스예요. filter에 전달하는 람다가 predicate이에요' },
      ],
      why:
        '방대한 데이터 스트림에서 조건에 맞는 일부만 추려서 ' +
        '불필요한 처리 비용과 메모리 사용을 줄이려고요.',
      expectedOutput:
        '[실행] onlyEven - 1~10 중 짝수만\n' +
        '[통과] 2\n' +
        '[통과] 4\n' +
        '[통과] 6\n' +
        '[통과] 8\n' +
        '[통과] 10',
      realWorldUsage:
        '실제 이벤트 로그 스트림에서 "level=ERROR"인 이벤트만 filter로 걸러내고, ' +
        'WARN 이하는 통과시키지 않는 식으로 알람 대상 로그만 추려서 처리해요.',
      pitfall:
        'filter 안에서 복잡한 연산(DB 조회, 외부 API 호출)을 하면 매 값마다 지연이 발생해 ' +
        '전체 파이프라인이 느려져요. filter는 가벼운 조건 판별만 넣고 무거운 작업은 flatMap 등으로 분리하세요.',
    },
  },
  {
    id: 'rx-reduce-sum',
    lang: 'java',
    title: 'Flux reduce 합치기',
    file: 'SumService.java',
    code: `import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;
import org.springframework.stereotype.Service;

@Service
public class SumService {

  public Mono<Integer> total() {
    System.out.println("[실행] total - 1부터 100까지 합");
    return Flux.range(1, 100)
      .reduce(0, (acc, n) -> acc + n)
      .doOnNext(result -> System.out.println("[결과] 합계: " + result));
  }
}`,
    explain: {
      concept:
        'reduce는 여러 값을 하나의 값으로 "접어주는" 집계 연산자예요. ' +
        '시작값 0에서 출발해, Flux의 1이 도착하면 0+1=1이 누적값(acc)이 되고, 다음 2가 도착하면 1+2=3, ... 이런 식으로 100까지 모두 더해 5050 하나만 남겨요. ' +
        '결과 타입이 Mono<Integer>인 이유는 여러 개의 Flux를 하나로 접었기 때문이에요. ' +
        '실무에서는 합계, 평균, 최댓값, 문자열 연결, 컬렉션 병합 같은 모든 "축약" 연산에 reduce가 쓰여요.',
      terms: [
        { t: 'reduce(0, (acc, n) -> acc + n)', d: '0부터 시작해 acc(누적값)에 n(새 값)을 더해가며 모든 값을 하나로 접어요' },
        { t: '0', d: '시작값(seed)이에요. 비어 있는 Flux면 이 시작값이 결과로 반환돼요' },
        { t: 'acc', d: 'accumulator(누산기). 지금까지 접힌 결과를 담는 변수예요' },
        { t: 'n', d: 'Flux에서 새로 도착한 값이에요. acc와 합쳐져 새 acc가 돼요' },
        { t: 'Mono<Integer>', d: 'reduce 결과는 언제나 Mono예요. Flux의 모든 값을 하나로 접었기 때문이에요' },
      ],
      why:
        '여러 건의 데이터에서 합계·평균·통계 같은 하나의 대푯값을 추출하려고요. ' +
        'reduce는 마지막 값이 나올 때까지 하류로 값을 방출하지 않고 기다렸다 한 번에 반환해요.',
      expectedOutput:
        '[실행] total - 1부터 100까지 합\n' +
        '[결과] 합계: 5050',
      realWorldUsage:
        '실제 주문 분석 시스템에서 "일일 총 매출"을 계산할 때, 오늘의 모든 주문 Flux를 reduce로 합산해 Mono<BigDecimal>로 반환해요. ' +
        'scan과의 차이는 scan이 중간 결과도 방출하는 반면, reduce는 최종 결과만 방출한다는 점이에요.',
      pitfall:
        '시작값(seed)을 생략하면 Flux의 첫 번째 값이 시작값이 돼서, 비어 있는 Flux에서 빈 Mono가 반환돼요. ' +
        '항상 기본값을 제공하려면 seed를 0이나 빈 컬렉션 등으로 명시적으로 지정하세요.',
    },
  },
  {
    id: 'rx-collect-list',
    lang: 'java',
    title: 'Flux collectList 한 상자로',
    file: 'BatchService.java',
    code: `import java.util.List;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;
import org.springframework.stereotype.Service;

@Service
public class BatchService {

  public Mono<List<String>> allNames() {
    System.out.println("[실행] allNames - Flux -> List");
    return findAllNames()
      .collectList()
      .doOnNext(list -> System.out.println("[결과] 수집된 개수: " + list.size()));
  }

  private Flux<String> findAllNames() {
    return Flux.just("Alice", "Bob", "Charlie");
  }
}`,
    explain: {
      concept:
        'collectList는 "흐르는 여러 개의 값을 전부 모아서 하나의 List 상자에 담는" 수집 연산자예요. ' +
        'findAllNames()가 Alice, Bob, Charlie를 순차로 Flux에 흘려보내면, collectList()가 이 3개를 전부 모아 List<String> 하나로 만들어 Mono<List<String>>에 담아 반환해요. ' +
        '반환 타입이 Flux가 아니라 Mono인 점이 핵심이에요 - "여러 건이 흐르는 Flux"가 "리스트 한 건을 담은 Mono"로 바뀌는 거예요. ' +
        '실무에서는 여러 건을 한 번에 모아서 처리해야 할 때, 예를 들어 배치 저장이나 일괄 이메일 발송에 collectList를 써요.',
      terms: [
        { t: 'findAllNames()', d: '여러 이름을 Flux로 흘려보내는 소스 메서드예요' },
        { t: 'collectList()', d: 'Flux의 모든 값을 모아 List 하나를 Mono로 감싸 반환하는 연산자예요' },
        { t: 'Mono<List<String>>', d: 'List<String> 하나를 담은 Mono예요. Flux의 여러 데이터가 List 하나로 축약됐어요' },
        { t: 'list.size()', d: '수집된 데이터 개수를 확인해요. 여기선 3이 출력돼요' },
        { t: 'Flux.just("Alice", "Bob", "Charlie")', d: '고정된 3개의 문자열을 순서대로 방출하는 Flux 생성자예요' },
      ],
      why:
        '개별 항목을 스트리밍하다가 특정 시점에 전체를 모아서 일괄 처리하려고요. ' +
        '예: 100개씩 청크로 모아서 DB batch INSERT를 실행하거나, 전체를 모아서 JSON 배열로 한 번에 응답할 때 써요.',
      expectedOutput:
        '[실행] allNames - Flux -> List\n' +
        '[결과] 수집된 개수: 3',
      realWorldUsage:
        '실제 WebFlux API에서 DB에서 Flux로 읽은 결과를 컨트롤러 반환 직전 collectList()로 모아 ' +
        'JSON 응답을 한 번에 직렬화해 클라이언트에 내보내는 게 가장 흔한 패턴이에요.',
      pitfall:
        '무한 Flux에 collectList()를 호출하면 모든 값이 도착할 때까지 영원히 기다려서 절대 완료되지 않아요. ' +
        '반드시 take()로 먼저 제한을 걸거나, 무한하지 않은 소스에만 collectList를 쓰세요.',
    },
  },
  {
    id: 'rx-delay-elements',
    lang: 'java',
    title: 'delayElements 시간 지연',
    file: 'SlowController.java',
    code: `import java.time.Duration;
import java.util.List;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;
import reactor.core.publisher.Flux;

@RestController
public class SlowController {

  @GetMapping(path = "/drip", produces = "text/event-stream")
  public Flux<String> drip() {
    System.out.println("[실행] drip - a,b,c를 500ms 간격으로");
    return Flux.fromIterable(List.of("a", "b", "c"))
      .delayElements(Duration.ofMillis(500))
      .doOnNext(s -> System.out.println("[방출] " + s));
  }
}`,
    explain: {
      concept:
        'delayElements는 "호스의 각 값마다 정해진 시간만큼 지연을 주는" 속도 조절기예요. ' +
        'Flux.fromIterable로 리스트를 Flux로 변환한 뒤 delayElements(500ms)를 붙이면, a가 방출되고 0.5초 후에 b가, 또 0.5초 후에 c가 방출돼요. ' +
        '중요한 점은 delayElements가 내부적으로 publishOn을 사용해 다른 스레드에서 지연을 적용한다는 거예요. ' +
        '실무에서는 API 속도 제한 준수(rate limit), UI에서 타이핑 효과, 부하 테스트 트래픽 생성에 써요.',
      terms: [
        { t: 'Flux.fromIterable(List.of("a", "b", "c"))', d: 'List를 Flux로 변환하는 정적 팩토리예요. 리스트의 각 요소가 순서대로 Flux 아이템이 돼요' },
        { t: 'delayElements(Duration.ofMillis(500))', d: '각 요소 사이에 500ms(0.5초)의 지연을 추가해요. 첫 요소도 지연 후 방출돼요' },
        { t: 'Duration.ofMillis(500)', d: '0.5초의 시간 간격을 나타내는 Duration 객체예요' },
        { t: 'doOnNext(s -> ...)', d: '지연 후 방출되는 각 값을 콘솔에 출력해요' },
        { t: 'publishOn', d: 'delayElements가 내부에서 사용하는 스케줄러 전환 연산자예요. 소비 스레드가 분리돼요' },
      ],
      why:
        '값을 일정한 간격으로 나눠 보내야 할 때 써요. ' +
        'API 호출 속도 제한을 맞추거나, 스트리밍 응답을 사람이 읽을 수 있는 속도로 조절할 때 유용해요.',
      expectedOutput:
        '[실행] drip - a,b,c를 500ms 간격으로\n' +
        '[방출] a (0.5초 후)\n' +
        '[방출] b (0.5초 후)\n' +
        '[방출] c (0.5초 후)',
      realWorldUsage:
        '실제 부하 테스트 스크립트에서 target API의 rate limit(초당 10건)을 준수하기 위해 ' +
        '100개의 요청 Flux에 delayElements(100ms)를 걸어 정확히 초당 10건씩 호출해요.',
      pitfall:
        'delayElements는 내부적으로 publishOn을 써서 별도 스케줄러 스레드에서 동작해요. ' +
        'ThreadLocal에 의존하는 코드(Spring Security Context, MDC 등)는 delayElements 이후 스레드가 바뀌어 값이 유실될 수 있어요.',
    },
  },
  {
    id: 'rx-merge-interleave',
    lang: 'java',
    title: 'Flux.merge 두 호스 섞기',
    file: 'FanInService.java',
    code: `import reactor.core.publisher.Flux;
import org.springframework.stereotype.Service;

@Service
public class FanInService {

  public Flux<String> both() {
    System.out.println("[실행] both - 두 소스를 merge");
    return Flux.merge(
      sourceA().doOnNext(s -> System.out.println("[A] " + s)),
      sourceB().doOnNext(s -> System.out.println("[B] " + s))
    );
  }

  private Flux<String> sourceA() {
    return Flux.just("A1", "A2", "A3");
  }

  private Flux<String> sourceB() {
    return Flux.just("B1", "B2", "B3");
  }
}`,
    explain: {
      concept:
        'Flux.merge는 "두 개의 호스를 하나의 합수관(T자 연결관)으로 섞어주는" 연산자예요. ' +
        'sourceA와 sourceB를 동시에 구독하고, 어느 쪽에서든 데이터가 도착하는 즉시 하류로 흘려보내요. ' +
        '순서는 보장되지 않아서 A1, B1, A2, B2... 순서로 올 수도 있고 B1, A1, A2, B2... 순서로 올 수도 있어요. ' +
        '실무에서는 여러 Kafka 토픽의 메시지를 하나의 Flux로 병합하거나, 여러 API의 응답을 단일 스트림으로 모을 때 merge를 써요.',
      terms: [
        { t: 'Flux.merge(flux1, flux2)', d: '두 개 이상의 Flux를 하나로 병합하는 정적 메서드예요. 도착 순서대로 인터리빙해요' },
        { t: 'sourceA().doOnNext(...)', d: 'sourceA의 각 값을 방출할 때 [A] 태그를 붙여 콘솔에 출력해요' },
        { t: 'sourceB()', d: '두 번째 소스 Flux예요. sourceA와 독립적으로 병렬 구독돼요' },
        { t: 'Flux.just("A1", "A2", "A3")', d: '고정된 3개 문자열을 순서대로 방출하는 Flux 예시예요' },
        { t: '인터리빙', d: '두 스트림의 데이터가 도착 순서대로 섞여서 방출되는 현상이에요' },
      ],
      why:
        '여러 독립적인 데이터 소스를 하나의 통합 스트림으로 모아서 일관된 방식으로 처리하려고요. ' +
        '소스 간 순서 의존성이 없을 때 사용해요.',
      expectedOutput:
        '[실행] both - 두 소스를 merge\n' +
        '[A] A1\n' +
        '[B] B1\n' +
        '[A] A2\n' +
        '[B] B2\n' +
        '[A] A3\n' +
        '[B] B3\n' +
        '(A와 B의 순서는 실행마다 달라질 수 있음)',
      realWorldUsage:
        '실제 채팅 앱에서 여러 대화방의 메시지 Flux를 merge로 하나의 통합 메시지 스트림으로 병합해 ' +
        '클라이언트가 모든 대화방 메시지를 단일 SSE 스트림으로 받아보게 해요.',
      pitfall:
        'merge에 참여한 Flux 중 하나라도 에러를 방출하면 merge 전체가 즉시 종료돼요. ' +
        '에러를 격리하려면 각 소스에 onErrorResume을 붙이거나 Flux.mergeDelayError를 써서 지연된 에러 처리를 하세요.',
    },
  },
  {
    id: 'rx-switchifempty',
    lang: 'java',
    title: 'switchIfEmpty 기본값',
    file: 'FallbackService.java',
    code: `import reactor.core.publisher.Mono;
import org.springframework.stereotype.Service;

@Service
public class FallbackService {

  public Mono<String> display(Long id) {
    System.out.println("[실행] display - id: " + id);
    return findById(id)
      .switchIfEmpty(Mono.defer(() -> {
        System.out.println("[대체] 데이터 없음 - 기본값 사용");
        return Mono.just("default");
      }));
  }

  private Mono<String> findById(Long id) {
    System.out.println("[조회] findById - 결과 없음(Mono.empty)");
    return Mono.empty();
  }
}`,
    explain: {
      concept:
        'switchIfEmpty는 "앞 상자가 비어 있으면 다른 상자로 바꿔주는" 예비 창고예요. ' +
        'findById(id)가 Mono.empty()를 반환하면(데이터 없음), switchIfEmpty가 그 빈 상자를 버리고 Mono.just("default")로 대체해요. ' +
        '여기서 Mono.defer를 쓴 이유는, switchIfEmpty에 넘기는 Mono는 "즉시 생성"되는데 defer로 감싸면 실제 필요할 때만(빈 상자일 때만) 생성돼서 불필요한 연산을 피할 수 있어요. ' +
        '실무에서는 DB 조회 결과가 없을 때 기본값·기본 이미지 URL을 반환하는 용도로 흔히 써요.',
      terms: [
        { t: 'switchIfEmpty', d: '앞 Mono가 비어 있으면(empty) 대체 Mono로 전환하는 연산자예요' },
        { t: 'Mono.defer(() -> ...)', d: '구독 시점에 지연 생성되는 Mono를 만드는 팩토리예요. 필요할 때만 람다가 실행돼요' },
        { t: 'Mono.empty()', d: '값이 없음을 나타내는 빈 Mono예요. DB 조회 결과가 없을 때 반환돼요' },
        { t: 'Mono.just("default")', d: '기본값을 담은 대체 Mono예요. "default" 문자열이 반환돼요' },
        { t: 'findById(id)', d: '사용자 조회 메서드예요. 데모용으로 항상 empty를 반환해요' },
      ],
      why:
        '데이터가 없을 때 오류를 내지 않고 기본값으로 우아하게 대응하려고요. ' +
        '"Not Found" 404 대신 "guest"나 빈 리스트로 정상 응답을 보내 사용자 경험을 저해하지 않아요.',
      expectedOutput:
        '[실행] display - id: 999\n' +
        '[조회] findById - 결과 없음(Mono.empty)\n' +
        '[대체] 데이터 없음 - 기본값 사용\n' +
        '(구독 시 "default" 반환)',
      realWorldUsage:
        '실제 상품 상세 API에서 해당 상품이 없으면 switchIfEmpty로 "판매 종료된 상품입니다" 페이지 데이터를 반환해 ' +
        '커스텀 404 화면을 자연스럽게 보여주는 패턴이 흔해요.',
      pitfall:
        'switchIfEmpty에 Mono.empty()를 주면 "빈 상자를 다른 빈 상자로 교체"하게 돼서 결과도 빈 Mono가 돼요. ' +
        '대체값은 반드시 실제 값을 가진 Mono여야 해요. 또한 just 대신 defer를 쓰면 대체값이 필요할 때만 생성돼 성능상 유리해요.',
    },
  },
  {
    id: 'rx-doonnext-log',
    lang: 'java',
    title: 'doOnNext 흐름에 끼어들기',
    file: 'LoggingService.java',
    code: `import lombok.extern.slf4j.Slf4j;
import reactor.core.publisher.Mono;
import org.springframework.stereotype.Service;

@Slf4j
@Service
public class LoggingService {

  public Mono<String> load(Long id) {
    System.out.println("[실행] load - id: " + id);
    return findById(id)
      .doOnNext(u -> {
        System.out.println("[부수효과] doOnNext - loaded " + u);
        log.info("loaded {}", u);
      });
  }

  private Mono<String> findById(Long id) {
    return Mono.just("User-" + id);
  }
}`,
    explain: {
      concept:
        'doOnNext는 "값이 흘러갈 때 잠깐 끼어들어 구경만 하고 지나가는" 부수 효과 연산자예요. ' +
        '값 자체를 변경하지 않고, 로그 찍기·메트릭 기록·캐시 업데이트 같은 감시 작업만 수행해요. ' +
        'findById가 반환한 "User-1"이라는 값은 doOnNext 안에서 콘솔 출력과 SLF4J 로그로 기록되지만, 값 자체는 그대로 "User-1"로 하류에 전달돼요. ' +
        '실무에서는 디버깅용 로깅, 성능 측정(start-stop 타이머), 트레이싱 태그 추가 같은 투명한 관찰 작업에 doOnNext를 써요.',
      terms: [
        { t: 'doOnNext(u -> ...)', d: '값이 통과할 때 람다를 실행하지만, 원본 값은 그대로 하류로 전달하는 연산자예요' },
        { t: 'System.out.println(...)', d: 'doOnNext 안의 디버깅 출력이에요. 값은 그대로 다음 단계로 흘러가요' },
        { t: 'log.info("loaded {}", u)', d: 'SLF4J 로깅이에요. 프로덕션에선 System.out 대신 이걸 써요' },
        { t: 'findById(id)', d: '사용자 ID로 이름을 반환하는 Mono 소스예요' },
        { t: '부수 효과', d: '값의 본질을 바꾸지 않고 관찰·기록만 하는 작업을 뜻해요' },
      ],
      why:
        '리액티브 체인의 핵심 로직을 변경하지 않고, 로깅이나 모니터링 같은 관찰 코드를 파이프라인에 투명하게 끼워넣으려고요. ' +
        'doOnNext 없이 로깅을 하려면 map 안에 로그+return을 섞어야 해서 코드가 지저분해져요.',
      expectedOutput:
        '[실행] load - id: 1\n' +
        '[부수효과] doOnNext - loaded User-1\n' +
        'INFO LoggingService - loaded User-1\n' +
        '(구독 시 "User-1" 반환 - 값은 변경되지 않음)',
      realWorldUsage:
        '실제 리액티브 API에서 doOnNext로 응답 전에 Prometheus Counter를 증가시키거나, ' +
        'doOnError로 예외 발생 횟수를 기록해 모니터링 대시보드에 반영하는 패턴이 흔해요.',
      pitfall:
        'doOnNext 안에서 무거운 I/O 작업(DB 저장, HTTP 재호출)을 하면 ' +
        '원래 흐름의 지연 시간에 그대로 더해져서 성능이 저하돼요. 가벼운 로깅·메트릭 기록만 넣으세요.',
    },
  },
  {
    id: 'rx-buffer-timeout',
    lang: 'java',
    title: 'Flux.buffer Timed 묶음',
    file: 'WindowService.java',
    code: `import java.time.Duration;
import java.util.List;
import reactor.core.publisher.Flux;
import org.springframework.stereotype.Service;

@Service
public class WindowService {

  public Flux<List<String>> windows() {
    System.out.println("[실행] windows - 3초마다 묶어서 방출");
    return events()
      .buffer(Duration.ofSeconds(3))
      .doOnNext(batch -> System.out.println("[버퍼] 묶음 크기: " + batch.size()));
  }

  private Flux<String> events() {
    return Flux.just("e1", "e2", "e3", "e4", "e5")
      .delayElements(Duration.ofMillis(800));
  }
}`,
    explain: {
      concept:
        'buffer는 "일정 시간 동안 흘러온 값들을 한 봉투에 모아서 한꺼번에 보내는" 묶음 연산자예요. ' +
        'events()가 0.8초마다 이벤트를 방출하면, buffer(3초)는 3초 동안 도착한 3~4개의 이벤트를 List<String> 하나로 묶어서 방출해요. ' +
        '반환 타입이 Flux<List<String>>로 바뀌는데, 개별 String이 흐르던 게 List<String> 묶음이 흐르는 걸로 변한 거예요. ' +
        '실무에서는 실시간 트래픽을 모아서 배치 처리(DB batch insert, Elasticsearch bulk indexing) 할 때 buffer를 써요.',
      terms: [
        { t: 'buffer(Duration.ofSeconds(3))', d: '3초 간격으로 데이터를 수집해 List로 묶어 방출하는 시간 기반 버퍼 연산자예요' },
        { t: 'Duration.ofSeconds(3)', d: '버퍼링 기간을 3초로 지정하는 Duration 값이에요' },
        { t: 'Flux<List<String>>', d: 'List 묶음이 흐르는 Flux예요. 내부 요소 타입이 String에서 List<String>으로 변경됐어요' },
        { t: 'events()', d: '800ms 간격으로 이벤트를 방출하는 Flux 소스예요. 데모용으로 5개만 생성해요' },
        { t: 'batch.size()', d: '한 묶음에 포함된 이벤트 개수를 콘솔에 출력해요' },
      ],
      why:
        '작은 데이터를 낱개로 처리하는 대신 일정량을 모아서 한 번에 처리해 ' +
        'DB 커밋 횟수, 네트워크 왕복 횟수를 줄이고 처리 효율을 높이려고요.',
      expectedOutput:
        '[실행] windows - 3초마다 묶어서 방출\n' +
        '[버퍼] 묶음 크기: 3 (e1, e2, e3)\n' +
        '[버퍼] 묶음 크기: 2 (e4, e5)',
      realWorldUsage:
        '실제 로그 수집 시스템에서 1초에 수천 건의 로그를 개별로 Elasticsearch에 보내는 대신, ' +
        'buffer(5s)로 5초치 로그를 List에 모아 Bulk API로 한 번에 색인해 처리량을 100배 향상시켜요.',
      pitfall:
        '버퍼 시간을 너무 길게(예: 60초) 잡으면 첫 묶음이 1분 후에나 방출돼서 실시간성이 크게 떨어져요. ' +
        '실시간성과 배치 효율 사이의 균형을 3~10초 정도로 잡는 게 일반적이에요.',
    },
  },
  {
    id: 'rx-retry-backoff',
    lang: 'java',
    title: 'retryWhen 지수 백오프',
    file: 'ResilientService.java',
    code: `import java.time.Duration;
import reactor.core.publisher.Mono;
import reactor.util.retry.Retry;
import org.springframework.stereotype.Service;

@Service
public class ResilientService {

  public Mono<String> callApi(Long id) {
    System.out.println("[실행] callApi - id: " + id + ", 최대 3회 재시도");
    return fetch(id)
      .retryWhen(Retry.backoff(3, Duration.ofSeconds(1))
        .doBeforeRetry(signal ->
          System.out.println("[재시도] " + signal.totalRetries() + "회차 - 대기 1초~")
        )
        .onRetryExhaustedThrow((builder, signal) ->
          new RuntimeException("3회 재시도 모두 실패: " + signal.failure().getMessage())
        )
      );
  }

  private Mono<String> fetch(Long id) {
    return Mono.error(new RuntimeException("일시적 네트워크 오류: " + id));
  }
}`,
    explain: {
      concept:
        'retryWhen은 "실패하면 점점 더 길게 쉬었다가 다시 시도하는" 지수 백오프(Exponential Backoff) 재시도 장치예요. ' +
        'Retry.backoff(3, 1초)는 최대 3회까지 재시도하고, 첫 재시도는 1초, 두 번째는 2초, 세 번째는 4초로 대기 시간이 점점 길어져요. ' +
        'doBeforeRetry로 매 재시도 전에 로그를 남기고, onRetryExhaustedThrow로 재시도 전부 실패 시 사용자 정의 예외를 던져요. ' +
        '실무에서는 외부 API 타임아웃, DB 일시 장애 같은 "잠깐 기다리면 복구될" 오류에 이 패턴을 써요.',
      terms: [
        { t: 'Retry.backoff(3, Duration.ofSeconds(1))', d: '최대 3회 재시도, 첫 대기 1초 후부터 지수적으로(2^N) 대기 시간이 증가해요' },
        { t: 'doBeforeRetry(signal -> ...)', d: '각 재시도 직전에 실행되는 콜백이에요. signal.totalRetries()로 현재 몇 번째 재시도인지 알 수 있어요' },
        { t: 'onRetryExhaustedThrow', d: '모든 재시도가 실패했을 때 던질 최종 예외를 생성하는 콜백이에요' },
        { t: 'fetch(id)', d: '외부 API를 호출하는 Mono예요. 데모용으로 항상 예외를 던져요' },
        { t: 'signal.failure().getMessage()', d: '마지막으로 실패한 원인 예외의 메시지를 가져와 최종 예외에 포함시켜요' },
      ],
      why:
        '잠깐 네트워크가 불안정하거나 외부 서비스가 순간적으로 과부하 걸렸을 때, ' +
        '바로 실패를 반환하지 않고 시간을 두고 재시도해 회복 기회를 주려고요.',
      expectedOutput:
        '[실행] callApi - id: 1001, 최대 3회 재시도\n' +
        '[재시도] 1회차 - 대기 1초~\n' +
        '[재시도] 2회차 - 대기 2초~\n' +
        '[재시도] 3회차 - 대기 4초~\n' +
        '(에러) RuntimeException: 3회 재시도 모두 실패: 일시적 네트워크 오류: 1001',
      realWorldUsage:
        '실제 PG사 결제 API에서 Retry.backoff(3, 500ms)를 걸어 네트워크 일시 장애를 자동 복구하고, ' +
        '3회 실패 시에만 CircuitBreaker로 회로를 열어 관리자에게 알림을 보내는 이중 안전장치를 구축해요.',
      pitfall:
        '재시도 최대 횟수를 지정하지 않으면 무한히 재시도해 서버가 공격으로 오인할 수 있어요. ' +
        '항상 최대 횟수를 제한하세요. 또한 retryWhen은 onErrorResume과 조합 시 순서에 주의해야 해요.',
    },
  },
];
