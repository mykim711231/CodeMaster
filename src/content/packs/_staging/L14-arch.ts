import type { Snippet } from '../../types';

export const architecture: Snippet[] = [
  {
    id: 'arch-layered-controller',
    lang: 'java',
    title: 'Layered Architecture - Controller',
    file: 'UserController.java',
    code: `@RestController
@RequestMapping("/api/users")
public class UserController {
  private final UserService userService;

  public UserController(UserService userService) {
    this.userService = userService;
  }

  @PostMapping
  public ResponseEntity<UserResponse> create(@RequestBody UserRequest req) {
    return ResponseEntity.ok(userService.create(req));
  }
}`,
    explain: {
      concept: '컨트롤러는 식당의 웨이터 같아요. 주문을 받아 주방(Service)으로 넘기고, 완성된 음식을 손님에게 돌려줘요. 비즈니스 로직은 직접 하지 않아요.',
      terms: [
        { t: '@RestController', d: 'JSON 응답을 주는 컨트롤러' },
        { t: '@RequestMapping', d: '기본 URL 경로 지정' },
        { t: '@PostMapping', d: 'POST 요청을 처리하는 메서드' },
        { t: '@RequestBody', d: '요청 본문 JSON을 객체로 변환' },
        { t: 'ResponseEntity', d: 'HTTP 상태 코드와 본문을 함께 반환' },
      ],
      why: '역할을 나눠 변경이 한 곳에 몰리지 않게 하려고요.',
      pitfall: '컨트롤러에 비즈니스 로직을 넣으면 테스트와 변경이 어려워져요.',
    },
  },
  {
    id: 'arch-layered-service',
    lang: 'java',
    title: 'Layered Architecture - Service',
    file: 'UserService.java',
    code: `@Service
public class UserService {
  private final UserRepository userRepository;

  public UserService(UserRepository userRepository) {
    this.userRepository = userRepository;
  }

  @Transactional
  public UserResponse create(UserRequest req) {
    User user = User.create(req.name(), req.email());
    User saved = userRepository.save(user);
    return UserResponse.from(saved);
  }
}`,
    explain: {
      concept: '서비스는 주방장이에요. 재료(Entity)를 다듬고 창고(Repository)에 저장해요. 트랜잭션 안에서 안전하게 처리해요.',
      terms: [
        { t: '@Service', d: '비즈니스 로직을 담은 서비스 빈' },
        { t: '@Transactional', d: '메서드를 하나의 트랜잭션으로 묶음' },
        { t: 'userRepository', d: '저장소 역할 객체' },
        { t: 'User.create()', d: '도메인 객체 생성 메서드' },
      ],
      why: '비즈니스 규칙을 한 곳에 모아 재사용하려고요.',
      pitfall: '@Transactional이 없으면 save 후 예외가 발생해도 롤백이 안 돼요. 쓰기 작업에는 반드시 붙이세요.',
    },
  },
  {
    id: 'arch-layered-repository',
    lang: 'java',
    title: 'Layered Architecture - Repository',
    file: 'UserRepository.java',
    code: `public interface UserRepository extends JpaRepository<User, Long> {
  Optional<User> findByEmail(String email);

  boolean existsByEmail(String email);

  List<User> findByNameContainingIgnoreCase(String keyword);
}`,
    explain: {
      concept: '리포지토리는 창고 관리자예요. 데이터를 넣고 빼고 찾는 일만 해요. 어떤 DB인지는 몰라도 돼요.',
      terms: [
        { t: 'JpaRepository', d: 'JPA가 주는 기본 CRUD 기능' },
        { t: 'Optional<User>', d: '값이 있을 수도 없을 수도 있는 컨테이너' },
        { t: 'findByEmail', d: '이메일로 조회하는 메서드 이름 규칙' },
        { t: 'existsByEmail', d: '이메일 존재 여부를 true/false로 반환' },
        { t: 'ContainingIgnoreCase', d: '대소문자 무시하고 포함 검색' },
      ],
      why: '데이터 접근을 한 곳에 모아 DB 교체를 쉽게 하려고요.',
      pitfall: '메서드 이름이 규칙에 안 맞으면 쿼리가 생성되지 않아요.',
    },
  },
  {
    id: 'arch-dto-request-response',
    lang: 'java',
    title: 'DTO - Request/Response 분리',
    file: 'UserDto.java',
    code: `public record UserRequest(
    String name,
    String email
) {}

// File: UserResponse.java
record UserResponse(
    Long id,
    String name,
    String email
) {
  public static UserResponse from(User user) {
    return new UserResponse(user.getId(), user.getName(), user.getEmail().value());
  }
}`,
    explain: {
      concept: 'DTO는 배달용 포장지예요. 손님에게는 깔끔하게 보이게 포장하고, 주방의 내부 사정(Entity)은 드러내지 않아요. 이 방식은 변환 메서드를 DTO 안에 두는 "내장 팩터리" 스타일이에요.',
      terms: [
        { t: 'record', d: '불변 데이터 객체를 짧게 만드는 자바 문법' },
        { t: 'UserRequest', d: '요청 본문을 담는 DTO' },
        { t: 'UserResponse', d: '응답 본문을 담는 DTO' },
        { t: 'from(User)', d: 'Entity를 Response DTO로 변환하는 정적 메서드' },
      ],
      why: '외부 스펙과 내부 도메인을 분리해 변경 영향을 줄이려고요.',
      pitfall: 'Entity를 그대로 응답하면 필드가 노출되고 양방향 연관관계가 무한 루프를 일으킬 수 있어요.',
    },
  },
  {
    id: 'arch-hexagonal-port',
    lang: 'java',
    title: 'Hexagonal - Port (인터페이스)',
    file: 'LoadUserPort.java',
    code: `public interface LoadUserPort {
  Optional<User> findById(Long id);

  List<User> findAllActive();
}

// File: SaveUserPort.java
interface SaveUserPort {
  Long save(User user);

  void update(User user);
}`,
    explain: {
      concept: '포트는 성벽의 문이에요. 외부 세계가 도메인(성)에 들어오려면 반드시 이 문을 통과해요. 문은 인터페이스라 약속만 정해요.',
      terms: [
        { t: 'LoadUserPort', d: '조회용 나가는 문 (아웃바운드 / Driven Port) — 도메인이 영속성을 호출하기 위한 포트' },
        { t: 'SaveUserPort', d: '저장용 나가는 문 (아웃바운드 / Driven Port) — 도메인이 외부 저장소를 사용하기 위한 포트' },
        { t: 'Optional<User>', d: '결과가 없을 수도 있는 값' },
        { t: 'Port', d: '도메인과 외부를 잇는 인터페이스' },
      ],
      why: '도메인이 외부 기술(JPA, REST 등)에 오염되지 않게 하려고요.',
      pitfall: '포트에 기술(HTTP, SQL) 이름이 들어가면 아키텍처가 새어요. Inbound Port(UseCase 인터페이스)와 Outbound Port(LoadUserPort 등)를 혼동하지 마세요.',
    },
  },
  {
    id: 'arch-hexagonal-adapter',
    lang: 'java',
    title: 'Hexagonal - Adapter (구현체)',
    file: 'JpaUserAdapter.java',
    code: `@Component
public class JpaUserAdapter implements LoadUserPort, SaveUserPort {
  private final UserJpaRepository repo;

  public JpaUserAdapter(UserJpaRepository repo) {
    this.repo = repo;
  }

  @Override
  public Optional<User> findById(Long id) {
    return repo.findById(id).map(UserJpaEntity::toDomain);
  }

  @Override
  public List<User> findAllActive() {
    return repo.findAll().stream()
        .map(UserJpaEntity::toDomain)
        .toList();
  }

  @Override
  public Long save(User user) {
    return repo.save(UserJpaEntity.from(user)).getId();
  }

  @Override
  public void update(User user) {
    repo.save(UserJpaEntity.from(user));
  }
}`,
    explain: {
      concept: '어댑터는 성문 밖의 다리예요. 포트(문) 규칙에 맞춰 JPA, REST, Mongo 등 어떤 기술이든 붙일 수 있어요. 포트에 선언된 모든 메서드를 빠짐없이 구현해야 컴파일돼요.',
      terms: [
        { t: 'implements', d: '인터페이스를 구현한다는 키워드' },
        { t: '@Override', d: '인터페이스 메서드를 재정의' },
        { t: 'UserJpaRepository', d: 'JPA용 저장소 (실제 기술)' },
        { t: 'toDomain()', d: '엔티티를 도메인 객체로 변환' },
        { t: 'from(user)', d: '도메인 객체를 엔티티로 변환' },
      ],
      why: '기술을 쉽게 갈아끼울 수 있게 하려고요.',
      pitfall: '인터페이스의 모든 추상 메서드를 구현하지 않으면 컴파일 에러가 나요. 어댑터 안에 비즈니스 규칙을 넣으면 도메인이 새어 나가요.',
    },
  },
  {
    id: 'arch-hexagonal-usecase',
    lang: 'java',
    title: 'Hexagonal - UseCase',
    file: 'RegisterUserUseCase.java',
    code: `@Service
public class RegisterUserUseCase {
  private final SaveUserPort saveUserPort;
  private final PasswordEncoder encoder;

  public RegisterUserUseCase(SaveUserPort port, PasswordEncoder encoder) {
    this.saveUserPort = port;
    this.encoder = encoder;
  }

  public Long execute(String name, String email, String rawPassword) {
    String hashed = encoder.encode(rawPassword);
    User user = User.create(name, email, hashed);
    return saveUserPort.save(user);
  }
}`,
    explain: {
      concept: '유스케이스는 사용자의 한 가지 행동(예: 회원가입)을 담당하는 시나리오 작가예요. 포트를 통해 외부와 소통하고 도메인을 조립해요.',
      terms: [
        { t: 'SaveUserPort', d: '저장용 포트 인터페이스' },
        { t: 'PasswordEncoder', d: '비밀번호 암호화 담당' },
        { t: 'execute()', d: '유스케이스의 실행 메서드' },
        { t: 'User.create()', d: '도메인 객체 생성 팩터리' },
      ],
      why: '한 유스케이스가 한 흐름만 담당해 변경과 테스트가 쉬워요.',
      pitfall: '한 유스케이스에 여러 흐름을 넣으면 다시 Service가 뚱뚱해져요.',
    },
  },
  {
    id: 'arch-ddd-value-object',
    lang: 'java',
    title: 'DDD - Value Object',
    file: 'Email.java',
    code: `public record Email(String value) {
  public Email {
    Objects.requireNonNull(value, "이메일은 필수예요");
    if (!value.contains('@')) {
      throw new IllegalArgumentException("잘못된 이메일 형식이에요");
    }
    value = value.toLowerCase().trim();
  }

  public String domain() {
    return value.substring(value.indexOf('@') + 1);
  }
}`,
    explain: {
      concept: '값 객체는 주민등록증처럼 값 자체가 신원인 작은 객체예요. 생성할 때 규칙을 검증해 잘못된 값이 태어날 수 없어요.',
      terms: [
        { t: 'record', d: '불변 값 객체를 만드는 자바 문법' },
        { t: 'compact constructor', d: '생성 시 검증·정규화를 담당' },
        { t: 'requireNonNull', d: 'null이면 예외 발생' },
        { t: 'toLowerCase()', d: '소문자로 정규화' },
        { t: 'domain()', d: '@ 뒤의 도메인 부분 반환' },
      ],
      why: '잘못된 값이 시스템에 들어오는 것을 태생부터 막으려고요.',
      pitfall: '값 객체는 setter가 없어요. 바꾸려면 새 객체를 만드세요.',
    },
  },
  {
    id: 'arch-ddd-aggregate-root',
    lang: 'java',
    title: 'DDD - Aggregate Root',
    file: 'Order.java',
    code: `public class Order {
  private final OrderId id;
  private final List<OrderLine> lines = new ArrayList<>();
  private OrderStatus status = OrderStatus.DRAFT;

  public void addLine(ProductId productId, int qty, Money price) {
    if (status != OrderStatus.DRAFT) {
      throw new IllegalStateException("확정된 주문은 수정할 수 없어요");
    }
    lines.add(new OrderLine(productId, qty, price));
  }

  public void confirm() {
    if (lines.isEmpty()) throw new IllegalStateException("주문이 비었어요");
    this.status = OrderStatus.CONFIRMED;
  }
}`,
    explain: {
      concept: '애그리거트 루트는 한 가족의 가장 같아요. 가족 구성원(OrderLine)에 접근하려면 반드시 가장(Order)을 거쳐야 해요. 규칙을 한 곳에서 지켜요.',
      terms: [
        { t: 'OrderId', d: '주문 식별자 값 객체' },
        { t: 'OrderLine', d: '주문에 속한 상품 한 줄' },
        { t: 'OrderStatus', d: '주문 상태(초안/확정 등)' },
        { t: 'addLine()', d: '구성원을 추가하는 유일한 통로' },
        { t: 'confirm()', d: '주문을 확정 상태로 전환' },
      ],
      why: '일관성 규칙을 한 객체에서 지켜 데이터가 꼬이지 않게 하려고요.',
      pitfall: '외부에서 OrderLine을 직접 추가/삭제하면 규칙이 깨져요.',
    },
  },
  {
    id: 'arch-ddd-domain-service',
    lang: 'java',
    title: 'DDD - Domain Service',
    file: 'DiscountCalculator.java',
    code: `public class DiscountCalculator {
  private final CouponPolicy policy;

  public DiscountCalculator(CouponPolicy policy) {
    this.policy = policy;
  }

  public Money apply(Order order, List<Coupon> coupons) {
    Money total = order.subtotal();
    for (Coupon c : coupons) {
      total = policy.discount(total, c);
    }
    return total;
  }
}`,
    explain: {
      concept: '도메인 서비스는 한 Entity에 자연스럽게 들어가지 않는 규칙을 담당하는 독립 작업자예요. 여러 객체가 얽힌 할인 계산 같은 일을 해요.',
      terms: [
        { t: 'CouponPolicy', d: '할인 정책을 담은 인터페이스' },
        { t: 'subtotal()', d: '주문 총액' },
        { t: 'Money', d: '금액 값 객체' },
        { t: 'apply()', d: '할인을 차례로 적용하는 메서드' },
      ],
      why: '한 객체에 몰기 어려운 규칙을 분리해 응집도를 높이려고요.',
      pitfall: '도메인 서비스를 남발하면 행동이 Entity에서 떨어져 나가요.',
    },
  },
  {
    id: 'arch-ddd-repository-domain',
    lang: 'java',
    title: 'DDD - Repository (도메인)',
    file: 'OrderRepository.java',
    code: `public interface OrderRepository {
  OrderId save(Order order);
  Optional<Order> findById(OrderId id);
  List<Order> findByCustomer(CustomerId customerId);

  default Order getById(OrderId id) {
    return findById(id)
        .orElseThrow(() -> new OrderNotFoundException(id));
  }
}`,
    explain: {
      concept: 'DDD의 리포지토리는 도메인이 아는 창고예요. Aggregate를 통째로 저장하고 찾아요. 기술(JPA)을 도메인이 모르게 해요.',
      terms: [
        { t: 'OrderId', d: '주문 식별자 값 객체' },
        { t: 'save(Order)', d: '애그리거트 전체를 저장' },
        { t: 'findById()', d: '식별자로 애그리거트 조회' },
        { t: 'getById()', d: '없으면 예외를 던지는 편의 메서드' },
        { t: 'default', d: '인터페이스에 제공되는 기본 구현' },
      ],
      why: '도메인이 저장 기술에 의존하지 않게 하려고요.',
      pitfall: '리포지토리가 DTO를 반환하면 도메인 경계가 깨져요.',
    },
  },
  {
    id: 'arch-ddd-domain-event',
    lang: 'java',
    title: 'DDD - Domain Event',
    file: 'OrderConfirmed.java',
    code: `public record OrderConfirmed(
    OrderId orderId,
    CustomerId customerId,
    Money totalAmount,
    Instant occurredAt
) {
  public static OrderConfirmed of(Order order) {
    return new OrderConfirmed(
        order.getId(),
        order.getCustomerId(),
        order.subtotal(),
        Instant.now()
    );
  }
}`,
    explain: {
      concept: '도메인 이벤트는 "주문이 확정됐다" 같은 과거 사건의 알림장이에요. 누가 언제 들어도 같은 의미를 전해요.',
      terms: [
        { t: 'record', d: '불변 이벤트 객체' },
        { t: 'OrderId', d: '주문 식별자' },
        { t: 'occurredAt', d: '이벤트 발생 시각' },
        { t: 'of(Order)', d: '주문으로 이벤트를 만드는 팩터리' },
        { t: 'Instant.now()', d: '현재 시각' },
      ],
      why: '핵심 로직과 부수 효과(메일, 알림)를 떼어내어 느슨하게 만들려고요.',
      pitfall: '이벤트는 과거형으로 이름 지어요(Confirmed, Placed).',
    },
  },
  {
    id: 'arch-cqrs-separate-model',
    lang: 'java',
    title: 'CQRS - 읽기/쓰기 분리',
    file: 'UserQueryService.java',
    code: `@Service
public class UserQueryService {
  private final UserQueryRepository repo;

  public UserQueryService(UserQueryRepository repo) {
    this.repo = repo;
  }

  @Transactional(readOnly = true)
  public List<UserSummary> search(String keyword, Pageable pageable) {
    return repo.searchSummaries(keyword, pageable);
  }

  public UserDetail detail(Long id) {
    return repo.findDetail(id);
  }
}`,
    explain: {
      concept: 'CQRS는 도서관처럼 "책을 읽는 코너"와 "책을 등록하는 코너"를 나눠요. 읽기는 빠르고 다양하게, 쓰기는 엄격하게 처리해요.',
      terms: [
        { t: '@Transactional(readOnly=true)', d: '읽기 전용 트랜잭션' },
        { t: 'UserQueryRepository', d: '읽기 전용 저장소' },
        { t: 'UserSummary', d: '목록용 요약 모델' },
        { t: 'UserDetail', d: '상세 보기용 모델' },
        { t: 'Pageable', d: '페이징 정보' },
      ],
      why: '읽기 패턴과 쓰기 규칙이 달라 각각 최적화하려고요.',
      pitfall: '읽기 모델과 쓰기 모델이 어긋나면 데이터가 안 맞아요. 동기화를 설계하세요.',
    },
  },
  {
    id: 'arch-cqrs-write-side',
    lang: 'java',
    title: 'CQRS - 쓰기 모델',
    file: 'UserCommandService.java',
    code: `@Service
public class UserCommandService {
  private final UserRepository repo;
  private final EventPublisher publisher;

  public UserCommandService(UserRepository repo, EventPublisher publisher) {
    this.repo = repo;
    this.publisher = publisher;
  }

  @Transactional
  public Long register(RegisterUserCommand cmd) {
    User user = User.register(cmd);
    User saved = repo.save(user);
    publisher.publish(UserRegistered.of(saved));
    return saved.getId();
  }
}`,
    explain: {
      concept: '쓰기 모델은 도메인 규칙을 엄격하게 지키는 보좌관이에요. 명령(Command)을 받아 도메인을 변경하고 이벤트를 발행해요.',
      terms: [
        { t: 'RegisterUserCommand', d: '사용자 등록 명령 DTO' },
        { t: 'User.register()', d: '도메인 팩터리 메서드' },
        { t: 'EventPublisher', d: '이벤트 발행 객체' },
        { t: 'UserRegistered', d: '사용자 등록 도메인 이벤트' },
        { t: '@Transactional', d: '쓰기 트랜잭션' },
      ],
      why: '쓰기에는 규칙과 검증을, 읽기에는 속도를 집중하려고요.',
      pitfall: '명령이 실패하면 이벤트도 발행되면 안 돼요. 트랜잭션 안에서 발행하세요.',
    },
  },
  {
    id: 'arch-cqrs-read-projection',
    lang: 'java',
    title: 'CQRS - 읽기 모델 투영',
    file: 'UserSummaryProjection.java',
    code: `@Component
public class UserSummaryProjection {
  private final UserSummaryRepository repo;

  public UserSummaryProjection(UserSummaryRepository repo) {
    this.repo = repo;
  }

  @EventListener
  public void on(UserRegistered event) {
    UserSummary summary = new UserSummary(event.userId(), event.name(), event.email());
    repo.save(summary);
  }

  @EventListener
  public void on(UserRenamed event) {
    repo.updateName(event.userId(), event.name());
  }
}`,
    explain: {
      concept: '투영은 사건을 듣고 읽기 전용 코너를 최신으로 유지하는 비서예요. 이벤트가 올 때마다 요약 테이블을 고쳐요.',
      terms: [
        { t: '@EventListener', d: '이벤트를 수신하는 메서드 표시' },
        { t: 'UserRegistered', d: '사용자 등록 이벤트' },
        { t: 'UserSummary', d: '읽기 전용 요약 모델' },
        { t: 'repo.save()', d: '요약 데이터 저장' },
        { t: 'updateName()', d: '이름 변경 반영' },
      ],
      why: '쓰기 모델과 분리된 빠른 읽기 테이블을 유지하려고요.',
      pitfall: '이벤트 누락 시 읽기 테이블이 과거 상태로 남아요. 재생(replay)이 가능하게 설계하세요.',
    },
  },
  {
    id: 'arch-event-sourcing-store',
    lang: 'java',
    title: 'Event Sourcing - 이벤트 저장',
    file: 'EventStore.java',
    code: `public interface EventStore {
  void append(OrderId id, List<DomainEvent> events, long expectedVersion);
  List<DomainEvent> load(OrderId id);
  List<DomainEvent> loadFrom(OrderId id, long version);
}

// File: JpaEventStore.java
class JpaEventStore implements EventStore {
  private final EventRepository eventRepository;

  JpaEventStore(EventRepository eventRepository) {
    this.eventRepository = eventRepository;
  }

  private long loadVersion(OrderId id) {
    return eventRepository.countByOrderId(id);
  }

  @Override
  public void append(OrderId id, List<DomainEvent> events, long expectedVersion) {
    long current = loadVersion(id);
    if (current != expectedVersion) {
      throw new ConcurrencyException("동시 수정 충돌이 발생했어요");
    }
    eventRepository.saveAll(toEntities(id, events));
  }

  @Override
  public List<DomainEvent> load(OrderId id) {
    return eventRepository.findByOrderIdOrderByVersionAsc(id);
  }

  @Override
  public List<DomainEvent> loadFrom(OrderId id, long version) {
    return eventRepository.findByOrderIdAndVersionGreaterThanEqualOrderByVersionAsc(id, version);
  }

  private List<EventEntity> toEntities(OrderId id, List<DomainEvent> events) {
    // ... 직렬화 생략
    return List.of();
  }
}`,
    explain: {
      concept: '이벤트 소싱은 가계부처럼 모든 사건을 그대로 저장해요. 현재 상태는 사건들을 처음부터 순서대로 더해 만들어요.',
      terms: [
        { t: 'EventStore', d: '이벤트를 저장하는 창고 인터페이스' },
        { t: 'append()', d: '새 이벤트를 덧붙이는 메서드' },
        { t: 'expectedVersion', d: '낙관적 동시성 검증용 버전' },
        { t: 'load()', d: '모든 이벤트를 순서대로 로드' },
        { t: 'ConcurrencyException', d: '동시 수정 충돌 예외' },
      ],
      why: '완전한 과거 이력을 보존해 감사·복원·시간 여행이 가능하게 하려고요.',
      pitfall: '저장은 적용(append)만 해요. 이벤트를 수정하면 진실이 깨져요.',
    },
  },
  {
    id: 'arch-event-sourcing-replay',
    lang: 'java',
    title: 'Event Sourcing - 상태 복원(replay)',
    file: 'Order.java',
    code: `// File: OrderFactory.java
// OrderFactory: 이벤트 이력으로 Order 복원
class OrderFactory {
  private final EventStore store;

  OrderFactory(EventStore store) {
    this.store = store;
  }

  public Order fromHistory(OrderId id) {
    Order order = Order.createEmpty(id);
    for (DomainEvent e : store.load(id)) {
      order = order.apply(e);
    }
    return order;
  }
}

// File: Order.java
// Order: apply()는 Order 클래스 내부 메서드
public class Order {
  private OrderStatus status;
  private final List<OrderLine> lines = new ArrayList<>();

  public static Order createEmpty(OrderId id) {
    return new Order();
  }

  public Order apply(DomainEvent e) {
    if (e instanceof OrderConfirmed c) this.status = OrderStatus.CONFIRMED;
    if (e instanceof LineAdded l) lines.add(l.toLine());
    return this;
  }
}`,
    explain: {
      concept: '리플레이는 녹음테이프를 처음부터 다시 틀듯, 이벤트를 순서대로 다시 적용해 현재 상태를 만들어요.',
      terms: [
        { t: 'fromHistory()', d: '이벤트 이력으로 상태 복원' },
        { t: 'Order.createEmpty()', d: '빈 상태로 시작' },
        { t: 'apply(e)', d: '이벤트를 상태에 반영하는 Order 클래스 내부 메서드' },
        { t: 'instanceof', d: '이벤트 타입 확인' },
        { t: 'OrderConfirmed', d: '주문 확정 이벤트' },
      ],
      why: '저장된 이벤트만으로 언제든 상태를 재구성할 수 있어요.',
      pitfall: 'apply는 부작용이 없어야 해요. 외부 호출을 넣으면 재생이 깨져요. apply()는 반드시 Order 클래스 안에 선언해야 해요.',
    },
  },
  {
    id: 'arch-mapper-dto',
    lang: 'java',
    title: 'DTO 변환 - Mapper 클래스',
    file: 'UserMapper.java',
    code: `public class UserMapper {
  public static UserResponse toResponse(User user) {
    return new UserResponse(
        user.getId(),
        user.getName(),
        user.getEmail().value(),
        user.getCreatedAt()
    );
  }

  public static User toDomain(UserRequest req) {
    return User.create(req.name(), new Email(req.email()));
  }
}`,
    explain: {
      concept: '매퍼는 번역가예요. 도메인 언어와 외부 JSON 언어를 서로 바꿔줘요. 앞서 본 DTO 내장 팩터리(UserResponse.from)와 달리, Mapper는 변환 로직을 별도 클래스로 모아요. 다수의 DTO 변환 규칙이 늘어날 때 유리해요.',
      terms: [
        { t: 'toResponse()', d: '도메인 → 응답 DTO 변환' },
        { t: 'toDomain()', d: '요청 DTO → 도메인 객체 변환' },
        { t: 'Email(req.email())', d: '문자열을 값 객체로 감쌈' },
        { t: 'user.getEmail().value()', d: '값 객체에서 문자열 꺼냄' },
        { t: 'static', d: '인스턴스 없이 호출 가능' },
      ],
      why: '변환 규칙을 한 곳에 두어 중복과 실수를 없애려고요.',
      pitfall: '매핑 로직이 여러 군데 흩어지면 필드 누락이 발생해요.',
    },
  },
  {
    id: 'arch-anti-corruption-layer',
    lang: 'java',
    title: 'Anti-Corruption Layer (ACL)',
    file: 'LegacyUserAdapter.java',
    code: `@Component
public class LegacyUserAdapter implements LoadUserPort {
  private final LegacyUserClient client;

  public LegacyUserAdapter(LegacyUserClient client) {
    this.client = client;
  }

  @Override
  public Optional<User> findById(Long id) {
    LegacyUserDto dto = client.get(id);
    if (dto == null) return Optional.empty();
    return Optional.of(new User(
        new UserId(dto.id()),
        dto.fullName(),
        new Email(dto.emailAddr())
    ));
  }

  @Override
  public List<User> findAllActive() {
    return client.listActive().stream()
        .map(dto -> new User(
            new UserId(dto.id()),
            dto.fullName(),
            new Email(dto.emailAddr())
        ))
        .toList();
  }
}`,
    explain: {
      concept: 'ACL은 방호복이에요. 낡은 외부 시스템의 용어를 내 도메인 용어로 번역해 들어와서, 오염이 퍼지지 않게 해요.',
      terms: [
        { t: 'LoadUserPort', d: '내 도메인의 아웃바운드 포트' },
        { t: 'LegacyUserClient', d: '낡은 시스템 클라이언트' },
        { t: 'LegacyUserDto', d: '외부 시스템의 데이터 모양' },
        { t: 'UserId', d: '내 도메인 식별자' },
        { t: 'Email', d: '내 도메인 값 객체' },
      ],
      why: '외부 모델이 내 도메인을 오염시키지 않게 보호하려고요.',
      pitfall: '외부 DTO를 그대로 도메인에 노출하면 ACL의 의미가 사라져요.',
    },
  },
  {
    id: 'arch-package-structure',
    lang: 'java',
    title: 'Package Structure - Feature-based',
    file: 'package-info.java',
    code: `/**
 * user/ 기능 패키지 — 사용자 도메인의 모든 코드를 기능별로 모아요.
 *
 *   com.shop.user.domain/
 *     User.java, Email.java, UserId.java  (도메인 모델)
 *   com.shop.user.application/
 *     RegisterUserUseCase.java            (유스케이스)
 *   com.shop.user.adapter.in.web/
 *     UserController.java                 (인바운드 어댑터)
 *   com.shop.user.adapter.out.persistence/
 *     JpaUserAdapter.java                 (아웃바운드 어댑터)
 *   com.shop.user.adapter.out.event/
 *     UserEventPublisher.java
 */
package com.shop.user;`,
    explain: {
      concept: '기능별 패키지는 한 집에 부엌·거실·침실을 모아둔 것 같아요. User에 관한 모든 것을 user/ 폴더 안에 두어 찾기 쉬워요. Java에서 파일 하나에 package 선언은 반드시 하나여야 해요.',
      terms: [
        { t: 'com.shop.user', d: '사용자 기능 루트 패키지' },
        { t: 'domain/', d: '도메인 모델 모음' },
        { t: 'application/', d: '유스케이스 모음' },
        { t: 'adapter/in/web/', d: '웹(인바운드) 어댑터' },
        { t: 'adapter/out/persistence/', d: '영속성(아웃바운드) 어댑터' },
      ],
      why: '기능 단위로 응집시켜 변경이 한 폴더에서 끝나게 하려고요.',
      pitfall: '도메인 패키지가 웹이나 JPA 패키지를 참조하면 의존성이 거꾸로 흘러요. 한 파일에 package 선언을 두 개 넣으면 컴파일 에러가 나요.',
    },
  },
];
