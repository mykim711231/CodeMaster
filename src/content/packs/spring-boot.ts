import type { Level, Pack, Snippet } from '../types';

// Spring Boot 3.4.x · Java 21 (LTS) 기준 — PRD §7 / §8.1
// 짧은(5~15줄) 실무 패턴 위주. 문법 검증은 추후 §13.6 CI 파이프라인.

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
  },
  {
    id: 'jc-lambda',
    lang: 'java',
    title: 'Lambda',
    file: 'Lambdas.java',
    code: `Function<Integer, Integer> square = n -> n * n;
Supplier<String> hello = () -> "hello";
Runnable task = () -> System.out.println("run");`,
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
  },
  {
    id: 'jc-stream-collect',
    lang: 'java',
    title: 'Collectors',
    file: 'Grouping.java',
    code: `Map<Boolean, List<Integer>> parts = numbers.stream()
    .collect(Collectors.partitioningBy(n -> n > 0));`,
  },
  {
    id: 'jc-optional',
    lang: 'java',
    title: 'Optional',
    file: 'Optionals.java',
    code: `String name = Optional.ofNullable(user)
    .map(User::name)
    .orElse("guest");`,
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
