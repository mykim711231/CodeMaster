import type { Level, Pack, Snippet } from '../types';

// Spring Boot 3.4.x · Java 21 (LTS) — PRD §7 / §8.1
// 짧은(5~15줄) 실무 패턴 + 문제 설명(언어 습득). 문법 검증은 추후 §13.6 CI 파이프라인.

// ── L1 Java Core (20문제) ──
const javaCore: Snippet[] = [
  {
    id: 'jc-class',
    lang: 'java',
    title: 'Class',
    file: 'Point.java',
    code: `public class Point {
    private final int x;
    private final int y;

    public Point(int x, int y) {
        this.x = x;
        this.y = y;
    }
}`,
    explain: {
      concept: '필드와 생성자로 객체의 상태를 캡슐화하는 기본 단위.',
      points: [
        'private 필드로 외부 접근 차단',
        'final 로 불변(immutable) 보장',
        '생성자에서 모든 필드 초기화',
      ],
    },
  },
  {
    id: 'jc-interface',
    lang: 'java',
    title: 'Interface',
    file: 'Shape.java',
    code: `public interface Shape {

    double area();

    default String describe() {
        return "area = " + area();
    }
}`,
    explain: {
      concept: '구현체가 지켜야 할 동작 계약. default 로 공통 동작 제공.',
      points: [
        '추상 메서드는 구현 클래스가 제공',
        'default 메서드로 공통 로직 공유',
        '다중 구현 가능',
      ],
    },
  },
  {
    id: 'jc-enum',
    lang: 'java',
    title: 'Enum',
    file: 'Status.java',
    code: `public enum Status {
    ACTIVE,
    INACTIVE,
    DELETED
}`,
    explain: {
      concept: '정해진 상수 집합을 타입으로 표현.',
      points: ['오타·잘못된 값을 컴파일 시점에 차단', 'switch 와 함께 안전하게 분기'],
    },
  },
  {
    id: 'jc-record',
    lang: 'java',
    title: 'Record',
    file: 'Money.java',
    code: `public record Money(long amount, String currency) {

    public Money {
        if (amount < 0) throw new IllegalArgumentException("negative");
    }
}`,
    explain: {
      concept: '불변 데이터를 담는 객체(DTO/VO)를 한 줄로.',
      points: ['생성자·접근자·equals·hashCode 자동 생성', 'compact 생성자로 값 검증'],
      pitfall: 'record 는 불변 — 생성 후 필드를 바꿀 수 없다.',
    },
  },
  {
    id: 'jc-generic-class',
    lang: 'java',
    title: 'Generic Class',
    file: 'Box.java',
    code: `public class Box<T> {
    private T value;

    public T get() {
        return value;
    }

    public void set(T value) {
        this.value = value;
    }
}`,
    explain: {
      concept: '타입 파라미터 T 로 어떤 타입이든 안전하게 보관.',
      points: ['캐스팅 없이 꺼냄 → 타입 안전', 'Box<String>, Box<Integer> 재사용'],
    },
  },
  {
    id: 'jc-generic-method',
    lang: 'java',
    title: 'Generic Method',
    file: 'Util.java',
    code: `public class Util {

    public static <T> T firstOrNull(List<T> list) {
        return list.isEmpty() ? null : list.get(0);
    }
}`,
    explain: {
      concept: '메서드 단위로 타입 파라미터를 선언.',
      points: ['<T> 위치는 반환형 바로 앞', '호출 시 타입 추론'],
    },
  },
  {
    id: 'jc-sealed',
    lang: 'java',
    title: 'Sealed Interface',
    file: 'Result.java',
    code: `public sealed interface Result permits Ok, Err {
}

record Ok(String value) implements Result {}

record Err(String message) implements Result {}`,
    explain: {
      concept: '허용된 구현만 갖는 봉인 계층(Java 17+).',
      points: ['permits 로 하위 타입을 제한', 'switch 패턴 매칭과 함께 완전성 검사'],
    },
  },
  {
    id: 'jc-list',
    lang: 'java',
    title: 'List + Stream',
    file: 'Lists.java',
    code: `List<String> names = List.of("kim", "lee", "park");
List<String> upper = names.stream()
    .map(String::toUpperCase)
    .toList();`,
    explain: {
      concept: '불변 리스트를 스트림으로 변환.',
      points: ['List.of 는 불변(수정 시 예외)', 'map → toList 로 새 리스트'],
      pitfall: 'List.of 결과에 add/remove 하면 UnsupportedOperationException.',
    },
  },
  {
    id: 'jc-map',
    lang: 'java',
    title: 'Map',
    file: 'Maps.java',
    code: `Map<String, Integer> scores = new HashMap<>();
scores.put("math", 90);
scores.merge("math", 5, Integer::sum);
scores.forEach((k, v) -> System.out.println(k + "=" + v));`,
    explain: {
      concept: '키-값 저장과 누적 갱신.',
      points: ['merge(key, delta, fn) 로 있으면 합치고 없으면 추가', 'forEach (k, v) 순회'],
    },
  },
  {
    id: 'jc-try',
    lang: 'java',
    title: 'Try-with-resources',
    file: 'Io.java',
    code: `try (var reader = Files.newBufferedReader(path)) {
    return reader.readLine();
} catch (IOException e) {
    throw new UncheckedIOException(e);
}`,
    explain: {
      concept: '자원을 자동으로 닫는 예외 처리.',
      points: ['try(...) 안에서 선언한 자원은 자동 close', 'AutoCloseable 구현 대상'],
    },
  },
  {
    id: 'jc-exception',
    lang: 'java',
    title: 'Custom Exception',
    file: 'NotFoundException.java',
    code: `public class NotFoundException extends RuntimeException {

    public NotFoundException(String message) {
        super(message);
    }
}`,
    explain: {
      concept: '도메인 의미를 가진 예외 정의.',
      points: ['RuntimeException 상속 = unchecked(throws 불필요)', 'super(message) 로 메시지 전달'],
    },
  },
  {
    id: 'jc-lambda',
    lang: 'java',
    title: 'Lambda',
    file: 'Lambdas.java',
    code: `Function<Integer, Integer> square = n -> n * n;
Supplier<String> hello = () -> "hello";
Runnable task = () -> System.out.println("run");`,
    explain: {
      concept: '함수형 인터페이스를 간결한 식으로.',
      points: [
        'Function 입력→출력, Supplier 출력만, Runnable 인자·반환 없음',
        '타입 추론으로 생략',
      ],
    },
  },
  {
    id: 'jc-stream-filter',
    lang: 'java',
    title: 'Stream Filter',
    file: 'Streams.java',
    code: `List<Integer> evens = numbers.stream()
    .filter(n -> n % 2 == 0)
    .sorted()
    .toList();`,
    explain: {
      concept: '조건 필터 → 정렬 → 수집 파이프라인.',
      points: ['filter 로 조건 통과만 남김', '원본은 변경되지 않음'],
    },
  },
  {
    id: 'jc-stream-collect',
    lang: 'java',
    title: 'Collectors',
    file: 'Grouping.java',
    code: `Map<Boolean, List<Integer>> parts = numbers.stream()
    .collect(Collectors.partitioningBy(n -> n > 0));`,
    explain: {
      concept: '스트림을 수집·분할·그룹화.',
      points: ['partitioningBy 로 참/거짓 두 그룹', 'groupingBy 로 키별 그룹화'],
    },
  },
  {
    id: 'jc-optional',
    lang: 'java',
    title: 'Optional',
    file: 'Optionals.java',
    code: `String name = Optional.ofNullable(user)
    .map(User::name)
    .orElse("guest");`,
    explain: {
      concept: 'null 대신 "값의 부재"를 타입으로 표현.',
      points: ['map 으로 null 안전 변환', 'orElse 로 기본값'],
      pitfall: 'Optional 을 필드·파라미터로 남용하지 말 것(반환용 권장).',
    },
  },
  {
    id: 'jc-future',
    lang: 'java',
    title: 'CompletableFuture',
    file: 'Async.java',
    code: `CompletableFuture
    .supplyAsync(() -> fetch())
    .thenApply(String::trim)
    .thenAccept(System.out::println);`,
    explain: {
      concept: '비동기 작업을 파이프라인으로 연결.',
      points: ['supplyAsync 결과 → thenApply 변환 → thenAccept 소비', '논블로킹'],
    },
  },
  {
    id: 'jc-switch-expr',
    lang: 'java',
    title: 'Switch Expression',
    file: 'Days.java',
    code: `int days = switch (month) {
    case FEB -> 28;
    case APR, JUN, SEP, NOV -> 30;
    default -> 31;
};`,
    explain: {
      concept: '값을 반환하는 switch(Java 14+).',
      points: ['-> 화살표 사용 → break 불필요', 'case 여러 값 콤마로'],
      pitfall: '표현식 switch 는 모든 경우를 다뤄야(default 또는 완전성).',
    },
  },
  {
    id: 'jc-pattern-switch',
    lang: 'java',
    title: 'Pattern Matching',
    file: 'Shapes.java',
    code: `String desc = switch (shape) {
    case Circle c -> "circle " + c.radius();
    case Square s -> "square " + s.side();
    default -> "unknown";
};`,
    explain: {
      concept: '타입으로 분기하며 변수에 바인딩(Java 21).',
      points: ['case Type t 로 캐스팅 없이 사용', 'instanceof + 캐스팅 체인을 대체'],
    },
  },
  {
    id: 'jc-text-block',
    lang: 'java',
    title: 'Text Block',
    file: 'Json.java',
    code: `String json = """
    {
      "name": "kim",
      "age": 30
    }
    """;`,
    explain: {
      concept: '여러 줄 문자열을 이스케이프 없이(Java 15+).',
      points: ['""" 로 감쌈', '공통 들여쓰기는 자동 제거'],
    },
  },
  {
    id: 'jc-enhanced-for',
    lang: 'java',
    title: 'Enhanced For',
    file: 'Loop.java',
    code: `var total = 0;
for (var n : numbers) {
    total += n;
}`,
    explain: {
      concept: '컬렉션·배열을 인덱스 없이 순회.',
      points: ['for (var x : coll) 형태', 'var 로 타입 추론'],
    },
  },
];

const service: Snippet = {
  id: 'service',
  lang: 'java',
  title: '@Service DI',
  file: 'UserService.java',
  code: `@Service
public class UserService {

    private final UserRepository repository;

    public UserService(UserRepository repository) {
        this.repository = repository;
    }

    @Transactional(readOnly = true)
    public UserEntity findById(Long id) {
        return repository.findById(id)
            .orElseThrow(() -> new EntityNotFoundException("user not found"));
    }
}`,
  explain: {
    concept: '비즈니스 로직 + 트랜잭션 경계를 담는 계층.',
    points: ['생성자 주입 + final 로 불변 의존성', '@Transactional 로 트랜잭션 관리'],
    pitfall: '필드 주입(@Autowired) 대신 생성자 주입을 권장.',
  },
};

const controller: Snippet = {
  id: 'controller',
  lang: 'java',
  title: 'REST Controller',
  file: 'UserController.java',
  code: `@RestController
@RequestMapping("/api/users")
public class UserController {

    private final UserService service;

    public UserController(UserService service) {
        this.service = service;
    }

    @GetMapping("/{id}")
    public UserResponse getUser(@PathVariable Long id) {
        return UserResponse.from(service.findById(id));
    }
}`,
  explain: {
    concept: 'HTTP 요청을 받는 REST 엔드포인트.',
    points: ['@RestController = @Controller + @ResponseBody', '@PathVariable 로 URL 변수 바인딩'],
  },
};

const entity: Snippet = {
  id: 'jpa-entity',
  lang: 'java',
  title: 'JPA Entity',
  file: 'UserEntity.java',
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
    concept: 'DB 테이블과 매핑되는 영속 객체.',
    points: ['@Entity + @Table 로 테이블 매핑', '@Id + @GeneratedValue 로 PK 전략'],
    pitfall: 'JPA 는 기본(no-arg) 생성자가 필요하다.',
  },
};

const repository: Snippet = {
  id: 'jpa-repository',
  lang: 'java',
  title: 'JPA Repository',
  file: 'UserRepository.java',
  code: `public interface UserRepository extends JpaRepository<UserEntity, Long> {

    Optional<UserEntity> findByUsername(String username);

    boolean existsByUsername(String username);
}`,
  explain: {
    concept: '인터페이스만 선언하면 CRUD 자동 구현.',
    points: ['JpaRepository<엔티티, ID> 상속', '메서드 이름(findByX)으로 쿼리 자동 생성'],
  },
};

const L = (no: number, name: string, snippets: Snippet[] = []): Level => ({ no, name, snippets });

export const springBootPack: Pack = {
  id: 'spring-boot',
  name: 'Spring Boot',
  lang: 'java',
  levels: [
    L(1, 'Java Core', javaCore),
    L(2, 'Spring Core', [service]),
    L(3, 'Spring Boot MVC', [controller]),
    L(4, 'Database — JPA', [entity, repository]),
    L(5, 'Concurrency'),
    L(6, 'Network'),
    L(7, 'Gateway'),
    L(8, 'Messaging'),
    L(9, 'Batch'),
    L(10, 'Security'),
    L(11, 'Cache'),
    L(12, 'Monitoring'),
    L(13, 'Testing'),
    L(14, 'Architecture'),
    L(15, 'Design Pattern'),
    L(16, 'Build & DevOps'),
    L(17, 'Observability'),
    L(18, 'Data 심화'),
    L(19, 'Resilience & Cloud-Native'),
    L(20, 'Reactive'),
  ],
};
