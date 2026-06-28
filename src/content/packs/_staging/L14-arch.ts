import type { Snippet } from '../../types';

export const architecture: Snippet[] = [
  {
    id: 'arch-layered-controller',
    lang: 'java',
    title: 'Layered Architecture - Controller',
    file: 'UserController.java',
    code: `import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/users")
public class UserController {
  private final UserService userService;

  public UserController(UserService userService) {
    this.userService = userService;
  }

  @PostMapping
  public ResponseEntity<UserResponse> create(@RequestBody UserRequest req) {
    System.out.println("[실행] POST /api/users — name: " + req.name());
    UserResponse response = userService.create(req);
    System.out.println("[결과] 사용자 생성 완료 — id: " + response.id());
    return ResponseEntity.ok(response);
  }
}`,
    explain: {
      concept:
        '컨트롤러는 식당의 웨이터와 같은 역할이에요. 손님(클라이언트)의 주문(HTTP 요청)을 받아서 주방(Service)으로 전달하고, 완성된 요리(응답)를 다시 손님에게 가져다줘요. ' +
        '컨트롤러는 "무엇이 들어왔고 무엇을 내보내는지"만 신경 쓰고, 비즈니스 로직은 절대 직접 처리하지 않는 게 핵심 원칙이에요. ' +
        '@RestController는 이 클래스의 모든 메서드 반환값을 JSON으로 자동 변환해주고, @RequestMapping은 이 컨트롤러의 기본 URL을 /api/users로 고정해줘요. ' +
        '계층 구조(Controller → Service → Repository)의 가장 바깥쪽 담당자로서, 요청 데이터를 깔끔하게 정리해서 다음 계층으로 넘기는 일을 해요.',
      terms: [
        { t: '@RestController', d: '이 컨트롤러가 REST API임을 표시해요. 모든 메서드의 반환값이 JSON으로 직렬화돼요.' },
        { t: '@RequestMapping("/api/users")', d: '이 컨트롤러의 모든 엔드포인트 URL 앞에 /api/users가 붙어요. 공통 경로를 한 번에 관리할 수 있어요.' },
        { t: '@PostMapping', d: 'HTTP POST 요청을 처리하는 메서드임을 표시해요. create()가 POST /api/users에 매핑돼요.' },
        { t: '@RequestBody', d: '요청 본문의 JSON을 자바 객체(UserRequest)로 자동 변환해줘요. Jackson 라이브러리가 담당해요.' },
        { t: 'ResponseEntity.ok(response)', d: 'HTTP 200 OK 상태 코드와 함께 응답 본문을 반환해요. 상태 코드를 직접 제어할 수 있어요.' },
      ],
      expectedOutput:
        'POST /api/users {"name":"kim", "email":"kim@test.com"}:\n' +
        '[실행] POST /api/users — name: kim\n' +
        '[결과] 사용자 생성 완료 — id: 1',
      realWorldUsage:
        '실제 프로젝트에서 모든 API의 진입점이 컨트롤러예요. 모바일 앱·웹 프론트엔드·외부 연동 시스템이 보내는 HTTP 요청이 가장 먼저 도착하는 곳이에요. 컨트롤러가 요청 데이터의 유효성을 먼저 검증하고(@Valid), 인증 정보를 확인한 뒤(@PreAuthorize) 서비스 계층에 넘기는 식으로 구성돼요.',
      why: 'HTTP 요청/응답 처리라는 외부 통신 책임을 분리해서, 비즈니스 로직이 HTTP에 오염되지 않게 하려고요.',
      pitfall: '컨트롤러에 비즈니스 로직을 넣으면, 다른 채널(메시지 큐·배치 작업)에서 같은 로직을 재사용할 수 없어져요. 컨트롤러는 전달자 역할만 하고, 판단·계산·저장은 모두 서비스로 위임하세요.',
    },
  },
  {
    id: 'arch-layered-service',
    lang: 'java',
    title: 'Layered Architecture - Service',
    file: 'UserService.java',
    code: `import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class UserService {
  private final UserRepository userRepository;

  public UserService(UserRepository userRepository) {
    this.userRepository = userRepository;
  }

  @Transactional
  public UserResponse create(UserRequest req) {
    System.out.println("[실행] UserService.create() — name: " + req.name());
    User user = User.create(req.name(), req.email());
    User saved = userRepository.save(user);
    System.out.println("[결과] DB 저장 완료 — id: " + saved.getId());
    return UserResponse.from(saved);
  }
}`,
    explain: {
      concept:
        '서비스(Service)는 식당의 주방장과 같은 역할이에요. 웨이터(Controller)가 전달한 주문을 받아서, 재료(Entity)를 다듬고, 창고(Repository)에 저장하는 모든 과정을 총괄해요. ' +
        '@Transactional은 이 메서드 안의 모든 DB 작업을 하나의 논리적 단위로 묶어서, 중간에 문제가 생기면 모든 변경을 자동으로 되돌려줘요. ' +
        '서비스 계층은 "회원가입 시 이름이 2글자 이상이어야 한다" 같은 비즈니스 규칙을 담는 곳이에요. 컨트롤러가 "어떻게 받고 응답할지"라면, 서비스는 "무엇을 해야 하는지"를 정의해요. ' +
        '계층 구조의 핵심인 서비스는, 위로는 컨트롤러와 아래로는 리포지토리와 소통하면서 도메인 로직을 조립하는 중간 관리자예요.',
      terms: [
        { t: '@Service', d: '비즈니스 로직을 담는 서비스 계층임을 표시해요. @Component와 기능은 같지만 역할을 명확히 해줘요.' },
        { t: '@Transactional', d: '메서드의 모든 DB 작업을 하나의 트랜잭션으로 묶어요. 예외 발생 시 자동 롤백돼요.' },
        { t: 'User.create(name, email)', d: '도메인 객체를 생성하는 팩터리 메서드예요. 생성 로직이 User 클래스 안에 캡슐화돼 있어요.' },
        { t: 'userRepository.save(user)', d: '도메인 객체를 DB에 저장해요. JPA가 INSERT SQL을 자동 생성해 실행해요.' },
        { t: 'UserResponse.from(saved)', d: '저장된 엔티티를 응답용 DTO로 변환해요. 엔티티를 외부에 직접 노출하지 않아요.' },
      ],
      expectedOutput:
        'UserService.create() 호출 시:\n' +
        '[실행] UserService.create() — name: kim\n' +
        '[결과] DB 저장 완료 — id: 1',
      realWorldUsage:
        '실제 프로젝트에서 서비스 계층은 가장 두꺼운 계층이에요. 회원가입·주문·결제·배송 같은 모든 비즈니스 유스케이스가 이 계층에 구현돼요. 서비스 하나가 다른 서비스를 호출하는 식으로 복잡한 비즈니스 흐름을 조립하고, @Transactional로 데이터 정합성을 보장해요. 테스트도 이 계층에 가장 많이 작성돼요.',
      why: '비즈니스 규칙을 한 곳에 모아서 재사용과 테스트를 쉽게 하고, 트랜잭션으로 데이터 정합성을 보장하려고요.',
      pitfall: '@Transactional을 붙이지 않은 쓰기 작업은 save() 후 예외가 발생해도 DB 변경이 롤백되지 않아요. 쓰기 작업에는 반드시 @Transactional을 붙이는 게 실무 관행이에요.',
    },
  },
  {
    id: 'arch-layered-repository',
    lang: 'java',
    title: 'Layered Architecture - Repository',
    file: 'UserRepository.java',
    code: `import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {
  Optional<User> findByEmail(String email);

  boolean existsByEmail(String email);

  List<User> findByNameContainingIgnoreCase(String keyword);
}`,
    explain: {
      concept:
        '리포지토리(Repository)는 창고 관리자와 같은 역할이에요. 데이터를 넣고, 빼고, 찾는 일만 담당하고, 비즈니스 로직에는 관여하지 않아요. ' +
        'JpaRepository를 extends하면 save(), findById(), deleteById() 같은 기본 CRUD 메서드가 자동으로 제공돼요. ' +
        '가장 강력한 점은 메서드 이름만으로 쿼리를 자동 생성해준다는 거예요 — findByEmail은 "email로 찾아줘"라는 의미 그대로 SELECT 쿼리가 생성돼요. ' +
        '리포지토리는 인터페이스만 정의하면 실제 구현체는 스프링이 런타임에 자동 생성해줘서, 개발자는 SQL 대신 자바 메서드로 데이터 접근을 표현할 수 있어요.',
      terms: [
        { t: 'JpaRepository<User, Long>', d: 'User 엔티티와 Long 타입 ID에 대한 기본 CRUD를 제공하는 스프링 데이터 인터페이스예요.' },
        { t: 'Optional<User>', d: '조회 결과가 없을 수도 있음을 표현하는 컨테이너예요. null 체크 대신 Optional로 안전하게 처리해요.' },
        { t: 'findByEmail(String email)', d: 'email 필드로 사용자를 조회하는 쿼리 메서드예요. 메서드 이름이 그대로 JPQL로 변환돼요.' },
        { t: 'existsByEmail(String email)', d: 'email 존재 여부를 boolean으로 반환해요. 카운트 쿼리 대신 효율적인 EXISTS 쿼리가 생성돼요.' },
        { t: 'ContainingIgnoreCase', d: '대소문자를 무시하고 부분 일치 검색을 해요. LIKE %keyword% 쿼리로 변환돼요.' },
      ],
      expectedOutput:
        '리포지토리는 인터페이스라 직접 실행되지 않아요. 스프링이 런타임에 구현체를 자동 생성해요:\n' +
        '[실행] findByEmail("kim@test.com")\n' +
        '→ SELECT u FROM User u WHERE u.email = ?\n' +
        '[결과] Optional[User[id=1, name=kim]]',
      realWorldUsage:
        '실제 프로젝트에서 리포지토리는 데이터 접근의 단일 창구예요. "DB가 MySQL에서 PostgreSQL로 바뀌어도 서비스 코드는 한 줄도 안 고친다"는 게 리포지토리 패턴의 목표예요. 서비스는 리포지토리 인터페이스만 바라보고, 실제 DB 기술은 구현체가 감춰줘요.',
      why: '데이터 접근 로직을 한 곳에 모아서, DB 기술 변경 시 영향 범위를 리포지토리 계층으로 제한하려고요.',
      pitfall: '메서드 이름이 JPA 쿼리 생성 규칙에 맞지 않으면 컴파일은 되지만 런타임에 쿼리 생성 실패로 예외가 발생해요. 쿼리 메서드 이름은 JPA 문서의 규칙을 정확히 따라야 해요.',
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

record UserResponse(
    Long id,
    String name,
    String email
) {
  public static UserResponse from(User user) {
    System.out.println("[변환] User 엔티티 → UserResponse DTO");
    return new UserResponse(user.getId(), user.getName(), user.getEmail().value());
  }
}`,
    explain: {
      concept:
        'DTO(Data Transfer Object)는 계층 간에 데이터를 배달하는 포장지 같은 존재예요. ' +
        'UserRequest는 클라이언트가 서버에 보내는 요청 데이터를 담고, UserResponse는 서버가 클라이언트에게 반환하는 응답 데이터를 담아요. ' +
        '입력과 출력에 서로 다른 DTO를 쓰는 이유는, 요청 시 필요 없는 필드(ID, 생성일 등)를 응답에 포함하지 않고, 응답 시 내부 구현(비밀번호 해시 등)이 외부로 새지 않게 하기 위해서예요. ' +
        'record 키워드는 불변 데이터 객체를 단 몇 줄로 만들 수 있는 Java 14+ 문법이에요. 필드가 자동으로 private final로 선언되고 생성자·getter·equals·hashCode가 자동 생성돼요.',
      terms: [
        { t: 'record', d: '불변 데이터 객체를 간결하게 만드는 Java 문법이에요. 모든 필드가 final이고 getter가 자동 생성돼요.' },
        { t: 'UserRequest', d: '클라이언트가 서버에 보내는 데이터를 담는 DTO예요. name, email만 받고 ID는 클라이언트가 모르는 정보예요.' },
        { t: 'UserResponse', d: '서버가 클라이언트에게 반환하는 DTO예요. DB 저장 후 생성된 id를 포함해서 돌려줘요.' },
        { t: 'from(User user)', d: '엔티티를 DTO로 변환하는 정적 팩터리 메서드예요. 변환 로직이 DTO 안에 캡슐화돼 있어요.' },
      ],
      expectedOutput:
        'UserResponse.from(user) 호출 시:\n' +
        '[변환] User 엔티티 → UserResponse DTO\n' +
        '→ UserResponse[id=1, name=kim, email=kim@test.com]',
      realWorldUsage:
        '실제 프로젝트에서 API 스펙이 변경될 때 DTO가 방어벽 역할을 해줘요. 클라이언트에게 age 필드를 추가로 내려줘야 한다면 UserResponse에 필드만 추가하면 되고, 내부 User 엔티티는 전혀 건드리지 않아요. 반대로 엔티티의 내부 필드가 변경돼도 DTO 변환 로직만 수정하면 외부 API 스펙은 유지할 수 있어요.',
      why: '외부 API 스펙과 내부 도메인 모델을 분리해서, 한쪽 변경이 다른 쪽으로 전파되는 걸 막으려고요.',
      pitfall: '엔티티를 DTO 없이 그대로 API 응답으로 반환하면, 양방향 연관관계가 JSON 직렬화 무한 루프를 일으키거나, 비밀번호 같은 민감 필드가 노출될 수 있어요. 항상 DTO로 변환해서 반환하세요.',
    },
  },
  {
    id: 'arch-hexagonal-port',
    lang: 'java',
    title: 'Hexagonal - Port (인터페이스)',
    file: 'LoadUserPort.java',
    code: `import java.util.List;
import java.util.Optional;

public interface LoadUserPort {
  Optional<User> findById(Long id);

  List<User> findAllActive();
}

interface SaveUserPort {
  Long save(User user);

  void update(User user);
}`,
    explain: {
      concept:
        '포트(Port)는 헥사고날 아키텍처에서 도메인(성)과 외부 세계를 연결하는 성문이에요. ' +
        'LoadUserPort는 "사용자를 조회하겠다"는 약속만 정의하고, 실제로 JPA로 할지 REST API로 할지는 이 인터페이스를 구현하는 어댑터가 결정해요. ' +
        '도메인 안에서는 LoadUserPort 인터페이스만 보고 코드를 작성해서, "데이터가 어떻게 저장되는지"에 대한 의존성을 완전히 제거해요. ' +
        '포트를 조회용(LoadUserPort)과 저장용(SaveUserPort)으로 나누는 건 ISP(인터페이스 분리 원칙)를 적용한 거예요 — 클라이언트는 자신이 사용하지 않는 메서드에 의존하지 않아야 해요.',
      terms: [
        { t: 'LoadUserPort', d: '사용자 조회를 위한 아웃바운드 포트예요. 도메인이 외부 저장소에 "데이터를 달라"고 요청할 때 쓰는 약속이에요.' },
        { t: 'SaveUserPort', d: '사용자 저장을 위한 아웃바운드 포트예요. 도메인이 외부 저장소에 "데이터를 저장해줘"라고 요청할 때 쓰는 약속이에요.' },
        { t: 'Optional<User>', d: '조회 결과가 없을 가능성을 표현해요. 포트 수준에서도 null-safe 함을 명시해요.' },
        { t: '포트 (Port)', d: '도메인과 외부 세계 사이의 계약서예요. 인터페이스로만 존재하고 기술 의존성이 전혀 없어요.' },
      ],
      expectedOutput:
        '포트는 인터페이스라 직접 실행되지 않아요. 구현체(어댑터)가 실제 동작을 제공해요:\n' +
        'LoadUserPort.findById(1L)\n' +
        '→ JPA 어댑터가 SELECT 쿼리 실행\n' +
        '→ Optional[User[id=1]]',
      realWorldUsage:
        '실제 프로젝트에서 포트 기반 설계를 하면 "JPA를 MyBatis로, 다시 MongoDB로" 바꾸는 기술 교체가 도메인 코드 수정 없이 가능해져요. LoadUserPort의 구현체만 갈아끼우면 서비스·도메인 코드는 한 줄도 안 고쳐도 돼요. 마이크로서비스 간 통신에도 같은 포트를 써서, REST 호출을 gRPC로 교체할 때도 서비스 코드가 변하지 않아요.',
      why: '도메인이 특정 기술(JPA, REST, Kafka)에 의존하지 않게 해서, 기술 변경의 영향을 도메인에서 완전히 격리하려고요.',
      pitfall: '포트 이름에 기술 힌트(JPA, HTTP, SQL)가 들어가면 아키텍처가 새요. LoadUserPort처럼 순수한 비즈니스 의도로 이름 짓고, 구현체에만 JpaUserAdapter처럼 기술명을 포함하세요.',
    },
  },
  {
    id: 'arch-hexagonal-adapter',
    lang: 'java',
    title: 'Hexagonal - Adapter (구현체)',
    file: 'JpaUserAdapter.java',
    code: `import org.springframework.stereotype.Component;

import java.util.List;
import java.util.Optional;

@Component
public class JpaUserAdapter implements LoadUserPort, SaveUserPort {
  private final UserJpaRepository repo;

  public JpaUserAdapter(UserJpaRepository repo) {
    this.repo = repo;
  }

  @Override
  public Optional<User> findById(Long id) {
    System.out.println("[실행] JPA 어댑터 — findById: " + id);
    Optional<User> user = repo.findById(id).map(UserJpaEntity::toDomain);
    System.out.println("[결과] 조회 완료 — " + (user.isPresent() ? "찾음" : "없음"));
    return user;
  }

  @Override
  public List<User> findAllActive() {
    System.out.println("[실행] JPA 어댑터 — findAllActive");
    return repo.findAll().stream()
        .map(UserJpaEntity::toDomain)
        .toList();
  }

  @Override
  public Long save(User user) {
    System.out.println("[실행] JPA 어댑터 — save: " + user.getName());
    UserJpaEntity entity = UserJpaEntity.from(user);
    Long id = repo.save(entity).getId();
    System.out.println("[결과] 저장 완료 — id: " + id);
    return id;
  }

  @Override
  public void update(User user) {
    System.out.println("[실행] JPA 어댑터 — update: " + user.getId());
    repo.save(UserJpaEntity.from(user));
  }
}`,
    explain: {
      concept:
        '어댑터(Adapter)는 포트라는 성문을 실제로 통과하는 다리예요. JpaUserAdapter는 LoadUserPort와 SaveUserPort를 구현해서, 포트가 정의한 약속을 JPA라는 기술로 실제 수행해요. ' +
        '도메인 객체(User)와 JPA 엔티티(UserJpaEntity) 사이의 변환(toDomain/from)은 어댑터의 책임이에요 — 도메인은 JPA의 @Entity 같은 어노테이션을 전혀 몰라요. ' +
        '포팅하려면 LoadUserPort의 모든 추상 메서드를 빠짐없이 @Override 해야 컴파일이 통과해요. 하나라도 누락되면 컴파일 에러로 즉시 알려줘요. ' +
        '@Component로 스프링 빈에 등록해서, 생성자 주입으로 UserJpaRepository를 받아 실제 DB 작업을 수행해요.',
      terms: [
        { t: 'implements LoadUserPort, SaveUserPort', d: '두 개의 포트 인터페이스를 동시에 구현해요. 조회와 저장을 한 어댑터에서 처리해요.' },
        { t: '@Override', d: '포트 인터페이스에 선언된 메서드를 구현하고 있음을 표시해요. 컴파일러가 시그니처 일치 여부를 검증해줘요.' },
        { t: 'UserJpaEntity.toDomain()', d: 'JPA 엔티티를 순수 도메인 객체로 변환해요. 어댑터가 변환 책임을 전담해요.' },
        { t: 'UserJpaEntity.from(user)', d: '도메인 객체를 JPA 엔티티로 변환해요. 도메인에는 JPA 어노테이션이 전혀 없어요.' },
        { t: '@Component', d: '어댑터를 스프링 빈으로 등록해요. 서비스에서 포트 타입으로 주입받으면 스프링이 이 어댑터를 자동으로 찾아줘요.' },
      ],
      expectedOutput:
        'findById(1L) 호출 시:\n' +
        '[실행] JPA 어댑터 — findById: 1\n' +
        '[결과] 조회 완료 — 찾음\n' +
        'save(user) 호출 시:\n' +
        '[실행] JPA 어댑터 — save: kim\n' +
        '[결과] 저장 완료 — id: 1',
      realWorldUsage:
        '실제 프로젝트에서 PostgreSQL에서 MongoDB로 DB 마이그레이션할 때, JpaUserAdapter만 MongoUserAdapter로 교체하고 모든 서비스·도메인 코드는 그대로 사용할 수 있어요. 어댑터 교체만으로 DB가 바뀌고, 나머지 코드는 포트 인터페이스만 바라보므로 전혀 영향을 받지 않아요.',
      why: '포트 인터페이스와 기술 구현체를 분리해서, 기술 변경 시 교체가 쉽고 테스트에서 가짜(Mock) 어댑터로 빠르게 대체하려고요.',
      pitfall: '어댑터 안에 비즈니스 규칙을 넣으면 도메인이 새어 나가요. 어댑터는 순수하게 기술적 변환과 위임만 수행하고, 판단·검증은 도메인·서비스에서 처리하세요.',
    },
  },
  {
    id: 'arch-hexagonal-usecase',
    lang: 'java',
    title: 'Hexagonal - UseCase',
    file: 'RegisterUserUseCase.java',
    code: `import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class RegisterUserUseCase {
  private final SaveUserPort saveUserPort;
  private final PasswordEncoder encoder;

  public RegisterUserUseCase(SaveUserPort port, PasswordEncoder encoder) {
    this.saveUserPort = port;
    this.encoder = encoder;
  }

  public Long execute(String name, String email, String rawPassword) {
    System.out.println("[실행] RegisterUserUseCase — name: " + name);
    String hashed = encoder.encode(rawPassword);
    User user = User.create(name, email, hashed);
    Long id = saveUserPort.save(user);
    System.out.println("[결과] 회원가입 완료 — id: " + id);
    return id;
  }
}`,
    explain: {
      concept:
        '유스케이스(UseCase)는 사용자의 한 가지 행동(회원가입·주문·결제)을 담당하는 시나리오 작가예요. ' +
        '기존의 뚱뚱한 Service 클래스가 여러 책임을 한꺼번에 맡는 것과 달리, RegisterUserUseCase는 오직 "사용자 등록"이라는 한 가지 흐름만 집중해서 처리해요. ' +
        '포트(SaveUserPort)를 통해 외부 저장소와 소통해서, 저장 기술이 JPA인지 REST인지 전혀 몰라요. ' +
        'PasswordEncoder도 인터페이스라, 암호화 방식이 BCrypt에서 Argon2로 바뀌어도 이 코드는 변하지 않아요. 이게 포트-어댑터 아키텍처의 힘이에요.',
      terms: [
        { t: 'RegisterUserUseCase', d: '회원가입이라는 단일 유스케이스를 구현한 클래스예요. "하나의 클래스 = 하나의 시나리오" 원칙을 따라요.' },
        { t: 'SaveUserPort', d: '저장을 담당하는 포트 인터페이스예요. 실제 구현체가 JPA인지 Mongo인지는 이 클래스가 몰라요.' },
        { t: 'PasswordEncoder', d: '비밀번호 암호화를 담당하는 인터페이스예요. 구체적인 암호화 알고리즘은 구현체가 결정해요.' },
        { t: 'execute(name, email, rawPassword)', d: '유스케이스를 실행하는 진입점이에요. 필요한 데이터를 모두 파라미터로 받아요.' },
        { t: 'User.create()', d: '도메인 객체 생성 팩터리 메서드예요. 생성 규칙은 User 클래스 안에 캡슐화돼 있어요.' },
      ],
      expectedOutput:
        'execute("kim", "kim@test.com", "pass123") 호출 시:\n' +
        '[실행] RegisterUserUseCase — name: kim\n' +
        '[결과] 회원가입 완료 — id: 1',
      realWorldUsage:
        '실제 프로젝트에서 마이크로서비스의 각 API 엔드포인트가 하나의 유스케이스 클래스로 구현돼요. POST /users → RegisterUserUseCase, PATCH /users/{id}/email → ChangeEmailUseCase, DELETE /users/{id} → WithdrawUserUseCase. 각 유스케이스는 독립적이라 병렬 개발이 쉽고, 테스트도 유스케이스 하나만 Mocking하면 완료돼요.',
      why: '하나의 유스케이스가 하나의 비즈니스 흐름만 담당하게 해서, 코드 응집도는 높이고 변경 영향 범위는 최소화하려고요.',
      pitfall: '유스케이스 하나에 여러 흐름(등록+수정+삭제)을 몰아넣으면 다시 전통적인 뚱뚱한 Service가 되어버려요. 유스케이스 클래스는 단일 책임을 엄격하게 지켜야 의미가 있어요.',
    },
  },
  {
    id: 'arch-ddd-value-object',
    lang: 'java',
    title: 'DDD - Value Object',
    file: 'Email.java',
    code: `import java.util.Objects;

public record Email(String value) {
  public Email {
    System.out.println("[검증] Email 생성 — value: " + value);
    Objects.requireNonNull(value, "이메일은 필수예요");
    if (!value.contains('@')) {
      throw new IllegalArgumentException("잘못된 이메일 형식이에요: " + value);
    }
    value = value.toLowerCase().trim();
    System.out.println("[결과] Email 정규화 — " + value);
  }

  public String domain() {
    return value.substring(value.indexOf('@') + 1);
  }
}`,
    explain: {
      concept:
        '값 객체(Value Object)는 "값 그 자체"가 신원인 불변 객체예요. 주민등록증처럼, 값이 같으면 같은 객체로 취급해요. ' +
        'record의 compact constructor(중괄호만 있는 생성자)에서 값의 유효성을 검증하고 정규화(소문자 변환·공백 제거)를 수행해요. ' +
        '가장 큰 특징은 "잘못된 값이 아예 태어날 수 없다"는 점이에요 — new Email("not-an-email")은 생성 단계에서 즉시 예외가 발생해요. ' +
        '이렇게 도메인 경계에서 값의 무결성을 보장하면, 나머지 코드에서는 Email이 항상 유효하다고 신뢰하고 쓸 수 있어요.',
      terms: [
        { t: 'record Email(String value)', d: '값 객체를 record로 정의해요. 필드는 자동 final이고 equals/hashCode가 값 기준으로 생성돼요.' },
        { t: 'compact constructor', d: 'record의 중괄호만 있는 생성자예요. 값 검증과 정규화 로직을 여기에 넣어요.' },
        { t: 'Objects.requireNonNull', d: '인자가 null이면 NullPointerException을 던져요. 값 객체는 null이 될 수 없어요.' },
        { t: 'toLowerCase().trim()', d: '이메일을 소문자로 만들고 공백을 제거해요. KIM@test.com과 kim@test.com을 같은 값으로 취급하게 해요.' },
        { t: 'domain()', d: '이메일 주소에서 @ 뒤의 도메인 부분만 추출해요. 행동이 풍부한 값 객체의 예시예요.' },
      ],
      expectedOutput:
        'new Email("KIM@Test.com  ") 호출 시:\n' +
        '[검증] Email 생성 — value: KIM@Test.com  \n' +
        '[결과] Email 정규화 — kim@test.com\n\n' +
        'new Email("not-valid") 호출 시:\n' +
        '[검증] Email 생성 — value: not-valid\n' +
        '→ IllegalArgumentException: 잘못된 이메일 형식이에요: not-valid',
      realWorldUsage:
        '실제 프로젝트에서 Email, Money, PhoneNumber, Address 같은 도메인 개념을 모두 값 객체로 만들어요. new Email(invalidString)이 생성자에서 바로 터지기 때문에, 잘못된 이메일이 서비스 레이어까지 도달하는 일이 절대 없어요. 결제 금액을 나타내는 Money 값 객체는 통화 단위와 금액을 함께 담아서, "100원 + 5달러" 같은 실수를 컴파일 타임에 막아줘요.',
      why: '도메인 규칙을 값 생성 시점에 강제해서, 잘못된 값이 시스템 내부로 진입하는 걸 원천 차단하려고요.',
      pitfall: '값 객체는 불변이기 때문에 setter가 없어요. 값을 바꾸려면 새 객체를 생성해야 해요. Email changed = new Email(newValue)처럼요. 불변성이 오히려 안전함의 핵심이에요.',
    },
  },
  {
    id: 'arch-ddd-aggregate-root',
    lang: 'java',
    title: 'DDD - Aggregate Root',
    file: 'Order.java',
    code: `import java.util.ArrayList;
import java.util.List;

public class Order {
  private final OrderId id;
  private final List<OrderLine> lines = new ArrayList<>();
  private OrderStatus status = OrderStatus.DRAFT;

  public void addLine(ProductId productId, int qty, Money price) {
    System.out.println("[실행] 주문 라인 추가 — product: " + productId + ", qty: " + qty);
    if (status != OrderStatus.DRAFT) {
      throw new IllegalStateException("확정된 주문은 수정할 수 없어요");
    }
    lines.add(new OrderLine(productId, qty, price));
    System.out.println("[결과] 라인 추가 완료 — 총 라인 수: " + lines.size());
  }

  public void confirm() {
    System.out.println("[실행] 주문 확정 — 현재 라인: " + lines.size());
    if (lines.isEmpty()) {
      throw new IllegalStateException("주문이 비었어요");
    }
    this.status = OrderStatus.CONFIRMED;
    System.out.println("[결과] 주문 확정 완료");
  }
}`,
    explain: {
      concept:
        '애그리거트 루트(Aggregate Root)는 한 가족의 가장 같은 역할이에요. OrderLine 같은 가족 구성원에 접근하려면 반드시 가장(Order)을 통해서만 가능해요. ' +
        'addLine()은 외부에서 OrderLine을 직접 추가하지 못하게 막고, confirm()으로 주문 상태 변경 시 빈 주문을 거절하는 비즈니스 규칙을 지켜요. ' +
        '이렇게 모든 변경이 애그리거트 루트를 통과하게 하면, "확정된 주문에 라인 추가" 같은 일관성 위반이 원천적으로 불가능해져요. ' +
        '애그리거트 경계 안의 모든 객체는 하나의 트랜잭션으로 묶여서 저장·삭제돼요.',
      terms: [
        { t: 'Order (Aggregate Root)', d: '애그리거트의 진입점이에요. OrderLine에 대한 모든 변경은 Order를 거쳐야 해요.' },
        { t: 'OrderLine', d: '애그리거트 내부 구성원이에요. 외부에서 직접 참조하면 안 되고, Order를 통해서만 접근 가능해요.' },
        { t: 'OrderStatus', d: '주문의 상태를 나타내는 enum이에요. DRAFT → CONFIRMED → SHIPPED 순으로만 변경 가능해요.' },
        { t: 'addLine()', d: '구성원을 추가하는 유일한 통로예요. 상태 검증 후에만 추가를 허용해 일관성을 지켜요.' },
        { t: 'confirm()', d: '주문을 확정 상태로 전환하는 메서드예요. 비즈니스 규칙(빈 주문 금지)을 강제해요.' },
      ],
      expectedOutput:
        'addLine(pid, 2, price) 호출 시 (DRAFT 상태):\n' +
        '[실행] 주문 라인 추가 — product: pid-1, qty: 2\n' +
        '[결과] 라인 추가 완료 — 총 라인 수: 1\n' +
        'confirm() 호출 시:\n' +
        '[실행] 주문 확정 — 현재 라인: 1\n' +
        '[결과] 주문 확정 완료',
      realWorldUsage:
        '실제 전자상거래 프로젝트에서 Order 애그리거트가 대표적인 예예요. Order는 OrderLine, ShippingInfo, PaymentInfo를 자식으로 거느리고, 모든 변경은 Order.addLine(), Order.confirm(), Order.cancel()을 통해서만 일어나요. "배송 중인 주문은 취소할 수 없다" 같은 규칙도 Order 안에서 한 번에 강제할 수 있어요.',
      why: '애그리거트 경계 안의 모든 객체에 대해 일관성 규칙을 한 곳에서 지키고, 외부에서의 무분별한 접근을 차단하려고요.',
      pitfall: '외부에서 Order.getLines().add(new OrderLine(...))처럼 직접 리스트를 조작하면, 애그리거트 루트의 규칙이 모두 우회돼요. 컬렉션을 노출할 때는 Collections.unmodifiableList()로 읽기 전용으로 반환하는 게 안전해요.',
    },
  },
  {
    id: 'arch-ddd-domain-service',
    lang: 'java',
    title: 'DDD - Domain Service',
    file: 'DiscountCalculator.java',
    code: `import java.util.List;

public class DiscountCalculator {
  private final CouponPolicy policy;

  public DiscountCalculator(CouponPolicy policy) {
    this.policy = policy;
  }

  public Money apply(Order order, List<Coupon> coupons) {
    System.out.println("[실행] 할인 계산 시작 — 쿠폰 수: " + coupons.size());
    Money total = order.subtotal();
    for (Coupon c : coupons) {
      total = policy.discount(total, c);
    }
    System.out.println("[결과] 할인 후 금액: " + total);
    return total;
  }
}`,
    explain: {
      concept:
        '도메인 서비스(Domain Service)는 특정 Entity나 Value Object에 자연스럽게 속하지 않는 비즈니스 로직을 담당하는 독립 작업자예요. ' +
        '"할인 적용"은 Order에도, Coupon에도 100% 속하지 않는 애매한 로직이에요. 이런 걸 억지로 Order에 넣으면 Order가 뚱뚱해지고 응집도가 떨어져요. ' +
        '도메인 서비스는 상태를 가지지 않고(stateless), 도메인 객체들(Order, Coupon)을 받아서 순수한 계산만 수행해요. ' +
        'CouponPolicy는 인터페이스라서, 정률 할인·정액 할인·조건부 할인 같은 다양한 전략을 교체할 수 있어요.',
      terms: [
        { t: 'DiscountCalculator', d: '할인 계산이라는 도메인 로직을 전담하는 도메인 서비스예요. Entity가 아니고 상태를 갖지 않아요.' },
        { t: 'CouponPolicy', d: '할인 정책을 나타내는 인터페이스예요. 구체적인 할인 방식은 구현체가 결정해요 (전략 패턴).' },
        { t: 'order.subtotal()', d: '주문의 할인 전 총액을 가져와요. Order가 자신의 금액을 계산하는 책임을 갖고 있어요.' },
        { t: 'apply(order, coupons)', d: '주문과 쿠폰 목록을 받아 할인을 적용해요. 도메인 서비스의 진입점이에요.' },
      ],
      expectedOutput:
        'apply(order, [coupon1, coupon2]) 호출 시:\n' +
        '[실행] 할인 계산 시작 — 쿠폰 수: 2\n' +
        '[결과] 할인 후 금액: 8500원',
      realWorldUsage:
        '실제 프로젝트에서 할인·배송비·마일리지 적립 같은 정책이 도메인 서비스로 구현돼요. 특히 여러 애그리거트가 얽힌 로직(주문과 쿠폰, 회원 등급을 동시에 고려하는 할인 계산)은 어느 한 애그리거트에 넣기 어려워서 도메인 서비스가 최적의 선택이에요.',
      why: '여러 도메인 객체가 얽힌 복잡한 규칙을, 특정 Entity를 비대하게 만들지 않고 별도 서비스로 분리하려고요.',
      pitfall: '도메인 서비스를 남발하면 핵심 비즈니스 로직이 Entity에서 도메인 서비스로 전부 빠져나가서, 빈혈 도메인 모델(Anemic Domain Model)이 돼요. Entity에 넣어도 자연스러운 로직은 Entity에 두세요.',
    },
  },
  {
    id: 'arch-ddd-repository-domain',
    lang: 'java',
    title: 'DDD - Repository (도메인)',
    file: 'OrderRepository.java',
    code: `import java.util.List;
import java.util.Optional;

public interface OrderRepository {
  OrderId save(Order order);
  Optional<Order> findById(OrderId id);
  List<Order> findByCustomer(CustomerId customerId);

  default Order getById(OrderId id) {
    System.out.println("[실행] OrderRepository.getById — id: " + id);
    Order order = findById(id)
        .orElseThrow(() -> new OrderNotFoundException(id));
    System.out.println("[결과] 주문 조회 완료");
    return order;
  }
}`,
    explain: {
      concept:
        'DDD의 리포지토리(Repository)는 도메인이 아는 유일한 창고 접근 방식이에요. ' +
        'JpaRepository와 달리, 이 리포지토리 인터페이스는 JPA나 SQL에 대한 어떤 힌트도 없어요 — 그냥 "저장하고 찾는다"는 약속만 있을 뿐이에요. ' +
        '애그리거트 루트(Order) 단위로 저장·조회하는 게 핵심이에요. OrderLine을 따로 저장하는 메서드는 없어요 — 애그리거트가 항상 통째로 저장돼야 해요. ' +
        'default 메서드로 getById() 같은 편의 메서드를 인터페이스에 바로 정의할 수 있어요. findById() 결과가 없으면 예외를 던지는 공통 패턴을 캡슐화했어요.',
      terms: [
        { t: 'OrderRepository (인터페이스)', d: '도메인 모델에 정의된 순수한 저장소 약속이에요. 어떤 기술(JPA, Mongo)에도 의존하지 않아요.' },
        { t: 'OrderId / CustomerId', d: '기본 타입 Long 대신 도메인 식별자 값 객체를 써요. 타입 안전성을 높여줘요.' },
        { t: 'save(Order)', d: '애그리거트 루트 전체를 저장해요. OrderLine도 함께 저장되는 건 구현체의 책임이에요.' },
        { t: 'default getById(OrderId)', d: '찾은 결과가 없으면 예외를 던지는 편의 메서드예요. Java 8+의 인터페이스 default 메서드로 구현했어요.' },
        { t: 'OrderNotFoundException', d: '도메인에 특화된 커스텀 예외예요. 기술 예외(JPA EntityNotFoundException)를 도메인 예외로 감싸요.' },
      ],
      expectedOutput:
        'getById(orderId) — 존재하는 경우:\n' +
        '[실행] OrderRepository.getById — id: OrderId[123]\n' +
        '[결과] 주문 조회 완료\n\n' +
        'getById(orderId) — 없는 경우:\n' +
        '→ OrderNotFoundException: 주문을 찾을 수 없어요: OrderId[999]',
      realWorldUsage:
        '실제 프로젝트에서 도메인 리포지토리 인터페이스는 domain/ 패키지에, JPA 구현체는 adapter/out/persistence/ 패키지에 위치해요. 도메인 패키지에는 JPA 관련 import가 하나도 없어서, 도메인을 다른 프로젝트에서 재사용하거나 DB 기술을 교체할 때 완벽한 격리가 보장돼요.',
      why: '도메인이 저장 기술(JPA·JDBC·MongoDB)을 모르게 해서, 기술 변경이 도메인에 전혀 영향을 주지 않게 하려고요.',
      pitfall: '리포지토리가 DTO를 반환하거나, 엔티티 그래프의 일부만 반환하면 도메인 경계가 깨져요. 리포지토리는 항상 완전한 애그리거트를 반환해야 해요.',
    },
  },
  {
    id: 'arch-ddd-domain-event',
    lang: 'java',
    title: 'DDD - Domain Event',
    file: 'OrderConfirmed.java',
    code: `import java.time.Instant;

public record OrderConfirmed(
    OrderId orderId,
    CustomerId customerId,
    Money totalAmount,
    Instant occurredAt
) {
  public static OrderConfirmed of(Order order) {
    System.out.println("[이벤트] OrderConfirmed 생성 — orderId: " + order.getId());
    return new OrderConfirmed(
        order.getId(),
        order.getCustomerId(),
        order.subtotal(),
        Instant.now()
    );
  }
}`,
    explain: {
      concept:
        '도메인 이벤트(Domain Event)는 "주문이 확정됐다" 같은 과거에 발생한 사건을 기록하는 불변 알림장이에요. ' +
        '이벤트는 항상 과거형(OrderConfirmed, UserRegistered)으로 이름 지어요 — 이미 일어난 일이니까요. ' +
        '이벤트를 발행하는 쪽(Order.confirm)은 누가 이벤트를 받을지 전혀 몰라요 — 이메일 발송·포인트 적립·통계 업데이트 같은 부수 효과가 이벤트 구독자에게 완전히 분리돼요. ' +
        'occurredAt 같은 메타데이터는 이벤트가 언제 발생했는지 기록해서, 감사(audit)와 추적(tracing)을 가능하게 해줘요.',
      terms: [
        { t: 'record OrderConfirmed', d: '불변 이벤트 객체를 record로 정의해요. 이벤트는 절대 수정되지 않아요.' },
        { t: 'of(Order order)', d: 'Order 엔티티에서 이벤트를 생성하는 팩터리 메서드예요. 이벤트 생성 로직을 캡슐화해요.' },
        { t: 'occurredAt', d: '이벤트가 발생한 시각을 기록해요. Instant.now()로 현재 UTC 시간을 저장해요.' },
        { t: 'OrderId / CustomerId / Money', d: '이벤트도 기본 타입 대신 도메인 값 객체를 사용해요. 풍부한 타입 정보를 유지해요.' },
        { t: '과거형 이름 (Confirmed)', d: '이벤트는 항상 과거형으로 이름 지어요. 이미 발생한 사실이기 때문이에요.' },
      ],
      expectedOutput:
        'OrderConfirmed.of(order) 호출 시:\n' +
        '[이벤트] OrderConfirmed 생성 — orderId: OrderId[123]\n' +
        '→ OrderConfirmed[orderId=123, customerId=456, totalAmount=10000원, occurredAt=2025-06-29T...]',
      realWorldUsage:
        '실제 프로젝트에서 주문 확정 이벤트가 발생하면, 이메일 서비스가 구독해서 구매 확인 메일을 보내고, 포인트 서비스가 구독해서 마일리지를 적립하고, 통계 서비스가 구독해서 실시간 매출 대시보드를 업데이트해요. 주문 서비스 코드는 이메일·포인트·통계에 대해 단 한 줄도 몰라요 — 완전한 느슨한 결합이에요.',
      why: '핵심 비즈니스 로직(주문 확정)과 부수 효과(메일·알림·통계)를 분리해서, 시스템 간 결합도를 낮추고 확장성을 높이려고요.',
      pitfall: '이벤트 이름을 현재형(ConfirmOrder)이나 명령형으로 지으면, 이벤트인지 명령(Command)인지 혼동돼요. 이벤트는 항상 과거형이에요.',
    },
  },
  {
    id: 'arch-cqrs-separate-model',
    lang: 'java',
    title: 'CQRS - 읽기/쓰기 분리',
    file: 'UserQueryService.java',
    code: `import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class UserQueryService {
  private final UserQueryRepository repo;

  public UserQueryService(UserQueryRepository repo) {
    this.repo = repo;
  }

  @Transactional(readOnly = true)
  public List<UserSummary> search(String keyword, Pageable pageable) {
    System.out.println("[실행] 사용자 검색 (읽기) — keyword: " + keyword);
    List<UserSummary> results = repo.searchSummaries(keyword, pageable);
    System.out.println("[결과] 검색 결과: " + results.size() + "건");
    return results;
  }

  public UserDetail detail(Long id) {
    System.out.println("[실행] 사용자 상세 (읽기) — id: " + id);
    return repo.findDetail(id);
  }
}`,
    explain: {
      concept:
        'CQRS(Command Query Responsibility Segregation)는 도서관처럼 "책 읽는 코너"와 "책 등록하는 코너"를 완전히 나누는 아키텍처예요. ' +
        'UserQueryService는 읽기 전용으로, @Transactional(readOnly=true)로 DB에 쓰기 락을 걸지 않고 빠르게 조회만 해요. ' +
        'UserSummary(목록용 요약)와 UserDetail(상세용)처럼 읽기 목적에 맞는 전용 모델을 따로 만들어서, 쓰기 모델의 복잡한 연관관계나 검증 로직에 영향받지 않아요. ' +
        '쓰기 쪽(UserCommandService)이 아무리 복잡한 비즈니스 규칙을 추가해도, 읽기 쪽은 전혀 변경되지 않고 쿼리 성능만 최적화할 수 있어요.',
      terms: [
        { t: 'CQRS', d: '명령(쓰기)과 조회(읽기)의 책임을 분리하는 아키텍처 패턴이에요. 읽기와 쓰기가 서로 다른 모델을 사용해요.' },
        { t: '@Transactional(readOnly = true)', d: '읽기 전용 트랜잭션을 선언해요. DB가 최적화(락 미획득, 리플리케이션 읽기)를 적용할 수 있어요.' },
        { t: 'UserQueryRepository', d: '읽기 전용 Repository예요. 쓰기 Repository와 완전히 다른 인터페이스를 가져요.' },
        { t: 'UserSummary', d: '목록 조회용 요약 모델이에요. 전체 필드 대신 목록에 필요한 필드만 포함해서 가벼워요.' },
        { t: 'Pageable', d: '페이징 정보(page, size, sort)를 담는 스프링 인터페이스예요. 대량 조회 시 필수예요.' },
      ],
      expectedOutput:
        'search("kim", pageable) 호출 시:\n' +
        '[실행] 사용자 검색 (읽기) — keyword: kim\n' +
        '[결과] 검색 결과: 5건\n' +
        'detail(1L) 호출 시:\n' +
        '[실행] 사용자 상세 (읽기) — id: 1',
      realWorldUsage:
        '실제 대규모 프로젝트에서 읽기와 쓰기가 아예 다른 DB를 바라보는 경우도 있어요. 쓰기는 정규화된 PostgreSQL, 읽기는 비정규화된 Elasticsearch를 쓰는 식이에요. 쓰기 쪽에서 도메인 이벤트를 발행하면, 읽기 쪽이 그 이벤트를 구독해서 자신의 읽기 전용 DB를 업데이트해요. 이렇게 하면 복잡한 JOIN 쿼리 없이도 검색이 초고속으로 동작해요.',
      why: '읽기와 쓰기의 요구사항이 근본적으로 다르기 때문에, 각각에 최적화된 모델과 DB 전략을 독립적으로 선택하려고요.',
      pitfall: '읽기 모델과 쓰기 모델 사이에 동기화 지연이 생기면, 방금 저장한 데이터가 조회에서 바로 안 보일 수 있어요. 최종적 일관성(Eventual Consistency)을 가정하고 시스템을 설계해야 해요.',
    },
  },
  {
    id: 'arch-cqrs-write-side',
    lang: 'java',
    title: 'CQRS - 쓰기 모델',
    file: 'UserCommandService.java',
    code: `import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class UserCommandService {
  private final UserRepository repo;
  private final EventPublisher publisher;

  public UserCommandService(UserRepository repo, EventPublisher publisher) {
    this.repo = repo;
    this.publisher = publisher;
  }

  @Transactional
  public Long register(RegisterUserCommand cmd) {
    System.out.println("[실행] 사용자 등록 (쓰기) — name: " + cmd.name());
    User user = User.register(cmd);
    User saved = repo.save(user);
    publisher.publish(UserRegistered.of(saved));
    System.out.println("[결과] 등록 완료 + 이벤트 발행 — id: " + saved.getId());
    return saved.getId();
  }
}`,
    explain: {
      concept:
        '쓰기 모델(Command Service)은 도메인 규칙을 엄격하게 지키는 보좌관이에요. ' +
        'RegisterUserCommand라는 명령(Command) DTO를 받아서, User.register()로 도메인 객체를 생성하고, 저장 후 UserRegistered 이벤트를 발행해서 읽기 쪽에 변경을 알려줘요. ' +
        '쓰기 모델은 데이터 정합성이 가장 중요해서, @Transactional로 모든 작업을 하나의 원자적 단위로 묶어요 — 이벤트 발행도 트랜잭션 안에서 이뤄져서, 저장 실패 시 이벤트도 발행되지 않아요. ' +
        'Command는 "무엇을 해줘"라는 요청을 담은 DTO로, Request DTO와 비슷하지만 명령 의도를 명시적으로 표현해요.',
      terms: [
        { t: 'RegisterUserCommand', d: '사용자 등록을 위한 명령 DTO예요. Command는 "해줘"라는 의도를 담은 객체예요.' },
        { t: 'User.register(cmd)', d: 'Command로부터 도메인 객체를 생성하는 팩터리 메서드예요. 생성 규칙은 User 안에 캡슐화돼요.' },
        { t: 'EventPublisher', d: '도메인 이벤트를 발행하는 인터페이스예요. 구체적인 발행 방식(Spring Event, Kafka)을 감춰줘요.' },
        { t: 'UserRegistered', d: '사용자 등록 완료를 알리는 도메인 이벤트예요. 읽기 모델이 이 이벤트를 구독해서 읽기 DB를 업데이트해요.' },
        { t: '@Transactional', d: 'save와 이벤트 발행을 하나의 트랜잭션으로 묶어요. 둘 다 성공하거나 둘 다 실패하는 게 보장돼요.' },
      ],
      expectedOutput:
        'register(cmd) 호출 시:\n' +
        '[실행] 사용자 등록 (쓰기) — name: kim\n' +
        '[결과] 등록 완료 + 이벤트 발행 — id: 1',
      realWorldUsage:
        '실제 프로젝트에서 회원가입 API가 UserCommandService.register()를 호출해요. 쓰기 쪽은 엄격한 도메인 규칙(중복 이메일 검사, 비밀번호 복잡도, 이름 길이 제한)을 모두 검증하고 저장한 뒤, UserRegistered 이벤트를 발행해요. 읽기 쪽이 이 이벤트를 받아서 Elasticsearch 인덱스를 업데이트하고, 검색 API는 읽기 전용 Elasticsearch를 조회해서 10ms 안에 응답해요.',
      why: '쓰기에는 도메인 규칙·검증·트랜잭션을 집중하고, 읽기에는 성능 최적화를 집중해서 상충하는 요구사항을 분리하려고요.',
      pitfall: '명령이 실패했을 때 이벤트가 발행되면, 실제로는 저장되지 않은 데이터가 읽기 모델에 반영되는 참사가 일어나요. 트랜잭션이 커밋된 후에만 이벤트를 발행하거나, Outbox 패턴으로 이벤트를 신뢰성 있게 발행하세요.',
    },
  },
  {
    id: 'arch-cqrs-read-projection',
    lang: 'java',
    title: 'CQRS - 읽기 모델 투영',
    file: 'UserSummaryProjection.java',
    code: `import org.springframework.context.event.EventListener;
import org.springframework.stereotype.Component;

@Component
public class UserSummaryProjection {
  private final UserSummaryRepository repo;

  public UserSummaryProjection(UserSummaryRepository repo) {
    this.repo = repo;
  }

  @EventListener
  public void on(UserRegistered event) {
    System.out.println("[투영] UserRegistered 수신 — userId: " + event.userId());
    UserSummary summary = new UserSummary(event.userId(), event.name(), event.email());
    repo.save(summary);
    System.out.println("[결과] 읽기 모델 갱신 완료");
  }

  @EventListener
  public void on(UserRenamed event) {
    System.out.println("[투영] UserRenamed 수신 — userId: " + event.userId());
    repo.updateName(event.userId(), event.name());
  }
}`,
    explain: {
      concept:
        '투영(Projection)은 도메인 이벤트를 구독해서 읽기 전용 데이터를 최신 상태로 유지하는 비서예요. ' +
        '쓰기 쪽에서 UserRegistered 이벤트가 발행되면, UserSummaryProjection이 @EventListener로 자동 감지해서 읽기 전용 DB에 요약 데이터를 저장해요. ' +
        'UserRenamed 이벤트가 오면 updateName()으로 기존 데이터를 갱신만 하고, UserRegistered 이벤트는 save()로 새로 저장해요. ' +
        '투영 덕분에 읽기 쪽 DB는 쓰기 쪽과 완전히 다른 스키마를 가질 수 있어서, 검색·목록 조회에 최적화된 구조로 설계할 수 있어요.',
      terms: [
        { t: 'Projection', d: '이벤트를 구독해서 읽기 전용 모델을 생성·갱신하는 컴포넌트예요. 쓰기와 읽기를 연결하는 다리 역할이에요.' },
        { t: '@EventListener', d: '스프링 이벤트 리스너예요. 메서드 파라미터 타입과 일치하는 이벤트가 발행되면 자동 호출돼요.' },
        { t: 'UserSummary', d: '읽기 전용 요약 데이터 모델이에요. 목록 화면에 필요한 필드만 담아서 가벼워요.' },
        { t: 'repo.save(summary)', d: '읽기 전용 Repository에 요약 데이터를 저장해요. 쓰기 Repository와 완전히 별개예요.' },
        { t: 'updateName(event)', d: '이름 변경 이벤트를 받아 읽기 모델의 name 필드만 부분 갱신해요. 전체 재저장이 필요 없어요.' },
      ],
      expectedOutput:
        'UserRegistered 이벤트 발행 시:\n' +
        '[투영] UserRegistered 수신 — userId: 1\n' +
        '[결과] 읽기 모델 갱신 완료\n' +
        'UserRenamed 이벤트 발행 시:\n' +
        '[투영] UserRenamed 수신 — userId: 1',
      realWorldUsage:
        '실제 프로젝트에서 사용자 검색 화면이 느리다는 불만을 해결하기 위해 CQRS + Projection을 도입해요. 쓰기 쪽은 정규화된 PostgreSQL을 그대로 쓰고, 읽기 쪽은 UserRegistered 이벤트를 받아 Elasticsearch에 비정규화된 검색용 문서를 저장해요. "사용자 100만 명을 10ms 안에 검색" 같은 요구사항이 CQRS 없이는 거의 불가능해요.',
      why: '쓰기 트랜잭션과 분리된 비동기 방식으로 읽기 모델을 갱신해서, 쓰기 성능 저하 없이 읽기 성능을 극대화하려고요.',
      pitfall: '이벤트 누락(리스너 장애·네트워크 오류) 시 읽기 모델이 과거 상태로 굳어져요. 이벤트 재처리(replay)나 스냅숏 복원 같은 복구 전략을 반드시 설계해야 해요.',
    },
  },
  {
    id: 'arch-event-sourcing-store',
    lang: 'java',
    title: 'Event Sourcing - 이벤트 저장',
    file: 'EventStore.java',
    code: `import java.util.List;

public interface EventStore {
  void append(OrderId id, List<DomainEvent> events, long expectedVersion);
  List<DomainEvent> load(OrderId id);
  List<DomainEvent> loadFrom(OrderId id, long version);
}

class JpaEventStore implements EventStore {
  private final EventRepository eventRepository;

  JpaEventStore(EventRepository eventRepository) {
    this.eventRepository = eventRepository;
  }

  @Override
  public void append(OrderId id, List<DomainEvent> events, long expectedVersion) {
    System.out.println("[실행] 이벤트 저장 — orderId: " + id + ", eventCount: " + events.size());
    long current = eventRepository.countByOrderId(id);
    if (current != expectedVersion) {
      throw new ConcurrencyException("동시 수정 충돌이 발생했어요");
    }
    eventRepository.saveAll(toEntities(id, events));
    System.out.println("[결과] 이벤트 저장 완료 — newVersion: " + (current + events.size()));
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
    return List.of();
  }
}`,
    explain: {
      concept:
        '이벤트 소싱(Event Sourcing)은 데이터의 최종 상태 대신 "상태를 변화시킨 모든 사건"을 저장하는 방식이에요. ' +
        '전통적인 방식이 "현재 잔고 10만원"만 저장한다면, 이벤트 소싱은 "입금 100만원 → 출금 90만원"이라는 모든 거래 내역을 저장해요. ' +
        'append()는 낙관적 동시성 제어(optimistic concurrency)를 적용해서, expectedVersion과 현재 버전이 일치할 때만 저장을 허용해요 — 만약 다른 요청이 먼저 저장했으면 ConcurrencyException을 던져 충돌을 알려줘요. ' +
        '상태를 직접 UPDATE/DELETE 하지 않고 INSERT만 하기 때문에, 데이터가 절대 소실되지 않는 감사 추적(audit trail)이 완성돼요.',
      terms: [
        { t: 'EventStore', d: '이벤트를 추가(append)하고 조회(load)하는 창고 인터페이스예요. UPDATE/DELETE 없이 INSERT만 수행해요.' },
        { t: 'append()', d: '새 이벤트들을 이벤트 스트림에 덧붙여요. expectedVersion으로 동시성 충돌을 감지해요.' },
        { t: 'expectedVersion', d: '클라이언트가 알고 있는 현재 버전이에요. 실제 버전과 다르면 충돌로 판단해 거절해요.' },
        { t: 'ConcurrencyException', d: '낙관적 락 충돌이 발생했을 때 던지는 예외예요. 재시도 로직을 유도해요.' },
        { t: 'load(OrderId id)', d: '애그리거트의 모든 이벤트를 버전 순서대로 조회해요. 이걸 replay해서 현재 상태를 복원해요.' },
      ],
      expectedOutput:
        'append(orderId, [LineAdded, OrderConfirmed], expectedVersion=3):\n' +
        '[실행] 이벤트 저장 — orderId: OrderId[123], eventCount: 2\n' +
        '[결과] 이벤트 저장 완료 — newVersion: 5\n\n' +
        '다른 요청이 먼저 저장해서 expectedVersion 불일치 시:\n' +
        '→ ConcurrencyException: 동시 수정 충돌이 발생했어요',
      realWorldUsage:
        '실제 금융·회계 시스템에서 이벤트 소싱이 널리 쓰여요. 은행 계좌의 모든 입출금 내역을 이벤트로 저장해서, 감사 시점에 "작년 3월 15일 잔고가 왜 이 금액인가"를 이벤트를 replay하며 완전히 재구성할 수 있어요. 암호화폐 거래소도 모든 거래를 이벤트로 저장해서, 해킹으로 상태가 조작되더라도 이벤트를 replay하면 원래 상태를 복원할 수 있어요.',
      why: '모든 변경 이력을 영구 보존해서 감사·디버깅·시간 여행(time travel)을 가능하게 하고, 데이터 조작을 원천 차단하려고요.',
      pitfall: '저장된 이벤트는 절대 수정하거나 삭제하면 안 돼요. 이벤트는 "일어난 사실"이기 때문에, 수정하면 전체 이력의 신뢰성이 깨져요. 보정이 필요하면 보상 이벤트를 추가로 append하세요.',
    },
  },
  {
    id: 'arch-event-sourcing-replay',
    lang: 'java',
    title: 'Event Sourcing - 상태 복원(replay)',
    file: 'OrderFactory.java',
    code: `class OrderFactory {
  private final EventStore store;

  OrderFactory(EventStore store) {
    this.store = store;
  }

  public Order fromHistory(OrderId id) {
    System.out.println("[실행] 이벤트 replay 시작 — orderId: " + id);
    Order order = Order.createEmpty(id);
    for (DomainEvent e : store.load(id)) {
      order = order.apply(e);
    }
    System.out.println("[결과] replay 완료 — 이벤트 수: ???");
    return order;
  }
}

// Order.java 관련 부분
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
      concept:
        '리플레이(replay)는 녹음테이프를 처음부터 다시 틀듯, 저장된 모든 이벤트를 순서대로 재적용해서 현재 상태를 재구성하는 방식이에요. ' +
        'fromHistory()는 EventStore에서 모든 이벤트를 조회한 뒤, 빈 Order(createEmpty)에 apply()로 하나씩 이벤트를 적용해가며 현재 상태를 만들어내요. ' +
        'apply()는 각 도메인 이벤트 타입을 instanceof로 확인하고, 이벤트가 담고 있는 데이터로 상태를 변경해요 — OrderConfirmed 이벤트면 status를 CONFIRMED로, LineAdded 이벤트면 lines에 OrderLine을 추가해요. ' +
        '이 방식의 놀라운 점은, 롤백이나 시간 여행도 가능하다는 거예요. 특정 시점의 이벤트까지만 replay하면 그 시점의 스냅숏을 얻을 수 있어요.',
      terms: [
        { t: 'fromHistory()', d: '이벤트 이력을 replay해서 애그리거트의 현재 상태를 복원하는 팩터리 메서드예요.' },
        { t: 'createEmpty(id)', d: '빈 상태의 애그리거트를 생성해요. 여기에 이벤트를 하나씩 적용하면서 상태를 채워요.' },
        { t: 'apply(e)', d: '이벤트를 애그리거트 상태에 반영하는 메서드예요. 부작용 없이 순수하게 상태만 변경해야 해요.' },
        { t: 'instanceof OrderConfirmed c', d: 'Java 16+의 패턴 매칭으로 이벤트 타입을 확인하고 즉시 변수에 할당해요.' },
        { t: 'LineAdded l', d: '패턴 매칭 변수예요. instanceof가 true면 l 변수로 바로 쓸 수 있어서 별도 캐스팅이 필요 없어요.' },
      ],
      expectedOutput:
        'fromHistory(orderId) 호출 시:\n' +
        '[실행] 이벤트 replay 시작 — orderId: OrderId[123]\n' +
        '[결과] replay 완료 — 이벤트 수: 5\n' +
        '(5개 이벤트: Created → LineAdded → LineAdded → OrderConfirmed → Shipped 순 적용)',
      realWorldUsage:
        '실제 이벤트 소싱 시스템에서 버그 수정 후 "버그 발생 직전 시점까지 replay하면 어떻게 됐을까"를 검증할 때 이 replay 메커니즘을 써요. 과거 시점의 스냅숏을 떠서 별도 DB에 재구성해보고, 버그가 수정됐는지 확인한 뒤에야 운영 DB 마이그레이션을 진행해요. 금융권 감사에서도 "2024년 1월 1일 자정의 모든 계좌 잔고를 재구성해 보세요" 같은 요청을 replay로 처리해요.',
      why: '저장된 이벤트만으로 언제든지 과거·현재·미래(가정)의 상태를 완벽하게 재구성할 수 있게 하려고요.',
      pitfall: 'apply() 메서드 안에서 외부 API 호출·DB 쓰기·이메일 발송 같은 부작용을 넣으면 replay 때마다 부작용이 다시 발생해요. apply()는 순수 함수처럼 부작용 없이 상태만 변경해야 해요. apply()는 반드시 애그리거트(Order) 클래스 내부에 선언해야 해요.',
    },
  },
  {
    id: 'arch-mapper-dto',
    lang: 'java',
    title: 'DTO 변환 - Mapper 클래스',
    file: 'UserMapper.java',
    code: `public class UserMapper {
  public static UserResponse toResponse(User user) {
    System.out.println("[매핑] User → UserResponse");
    return new UserResponse(
        user.getId(),
        user.getName(),
        user.getEmail().value(),
        user.getCreatedAt()
    );
  }

  public static User toDomain(UserRequest req) {
    System.out.println("[매핑] UserRequest → User");
    return User.create(req.name(), new Email(req.email()));
  }
}`,
    explain: {
      concept:
        '매퍼(Mapper)는 도메인 언어와 외부 JSON 언어를 서로 번역해주는 전문 번역가예요. ' +
        '앞서 본 DTO 내장 팩터리(UserResponse.from) 방식은 변환 로직이 DTO 안에 있는데, Mapper는 변환 로직을 별도 클래스로 완전히 분리해요. ' +
        'DTO 안에 from/to를 두는 방식은 간단할 때 좋고, Mapper 방식은 변환 규칙이 많아지거나 여러 DTO를 조합해야 할 때 더 깔끔해요. ' +
        'static 메서드라 인스턴스 생성 없이 UserMapper.toResponse(user)처럼 바로 호출할 수 있어서 가벼워요. 매핑 로직을 한 곳에 모아두면, 필드 추가 시 매퍼만 수정하면 돼서 누락을 방지할 수 있어요.',
      terms: [
        { t: 'toResponse(user)', d: '도메인 Entity를 응답 DTO로 변환해요. 불필요한 내부 필드(비밀번호 등)를 제외할 수 있어요.' },
        { t: 'toDomain(req)', d: '요청 DTO를 도메인 Entity로 변환해요. 요청 데이터를 값 객체(Email 등)로 감싸서 타입 안전성을 높여요.' },
        { t: 'user.getEmail().value()', d: 'Email 값 객체에서 실제 문자열을 꺼내요. DTO는 값 객체보다 원시 타입을 쓰는 게 일반적이에요.' },
        { t: 'new Email(req.email())', d: '문자열을 Email 값 객체로 감싸요. 도메인은 원시 문자열 대신 값 객체를 써서 유효성을 보장해요.' },
        { t: 'static', d: '인스턴스 생성 없이 클래스 이름으로 직접 호출할 수 있어요. 상태가 없는 유틸리티임을 나타내요.' },
      ],
      expectedOutput:
        'toResponse(user) 호출 시:\n' +
        '[매핑] User → UserResponse\n' +
        '→ UserResponse[id=1, name=kim, email=kim@test.com]\n' +
        'toDomain(req) 호출 시:\n' +
        '[매핑] UserRequest → User',
      realWorldUsage:
        '실제 프로젝트에서 API 버저닝 시 Mapper가 큰 역할을 해요. v1 API는 UserMapperV1.toResponse(), v2 API는 UserMapperV2.toResponse()로 서로 다른 DTO로 변환할 수 있어요. 도메인 로직은 그대로 두고 매퍼만 추가하면 API 버전이 늘어나도 도메인이 오염되지 않아요. MapStruct 같은 코드 생성 라이브러리로 Mapper 인터페이스만 정의하면 구현체를 자동 생성하기도 해요.',
      why: '변환 로직을 한 곳에 모아서 중복을 제거하고, 필드 추가·변경 시 누락을 방지하려고요.',
      pitfall: '매핑 로직이 여러 군데(컨트롤러·서비스·DTO)에 흩어지면 필드 하나 추가할 때 수정할 곳을 빼먹기 쉬워요. 매핑은 한 곳(매퍼 또는 DTO 팩터리)에서만 집중 관리하세요.',
    },
  },
  {
    id: 'arch-anti-corruption-layer',
    lang: 'java',
    title: 'Anti-Corruption Layer (ACL)',
    file: 'LegacyUserAdapter.java',
    code: `import org.springframework.stereotype.Component;
import java.util.List;
import java.util.Optional;

@Component
public class LegacyUserAdapter implements LoadUserPort {
  private final LegacyUserClient client;

  public LegacyUserAdapter(LegacyUserClient client) {
    this.client = client;
  }

  @Override
  public Optional<User> findById(Long id) {
    System.out.println("[실행] 레거시 시스템 조회 — id: " + id);
    LegacyUserDto dto = client.get(id);
    if (dto == null) {
      System.out.println("[결과] 레거시 데이터 없음");
      return Optional.empty();
    }
    User user = new User(
        new UserId(dto.getId()),
        dto.getFullName(),
        new Email(dto.getEmailAddr())
    );
    System.out.println("[변환] LegacyUserDto → User — 이름: " + user.getName());
    return Optional.of(user);
  }

  @Override
  public List<User> findAllActive() {
    System.out.println("[실행] 레거시 활성 사용자 조회");
    return client.listActive().stream()
        .map(dto -> new User(
            new UserId(dto.getId()),
            dto.getFullName(),
            new Email(dto.getEmailAddr())
        ))
        .toList();
  }
}`,
    explain: {
      concept:
        'ACL(Anti-Corruption Layer, 오염 방지 계층)은 낡은 외부 시스템의 용어와 데이터 모양을 우리 도메인 언어로 번역해주는 방호복이에요. ' +
        '레거시 시스템이 full_name, email_addr 같은 자기만의 용어를 쓰고 있다면, ACL이 그걸 name, email이라는 우리 도메인 용어로 변환해줘요. ' +
        'ACL이 없으면 레거시 시스템의 모델이 도메인 전체로 스며들어서, "왜 우리 코드에 full_name이 있는 거지?" 같은 혼란이 발생해요. ' +
        '여기서 LegacyUserAdapter는 LoadUserPort를 구현해서, 외부에서는 우리 도메인의 포트로 보이지만 내부에서는 레거시 시스템과 통신해요.',
      terms: [
        { t: 'ACL (Anti-Corruption Layer)', d: '외부 시스템의 모델이 내부 도메인을 오염시키지 않도록 번역해주는 경계 계층이에요.' },
        { t: 'LoadUserPort', d: '우리 도메인이 정의한 순수한 조회 포트예요. ACL은 이 포트를 구현해서 도메인과 호환돼요.' },
        { t: 'LegacyUserClient', d: '낡은 외부 시스템과 통신하는 클라이언트예요. REST API·SOAP·gRPC 등 어떤 기술이든 될 수 있어요.' },
        { t: 'LegacyUserDto', d: '외부 시스템이 반환하는 데이터 모양이에요. 이걸 도메인에 그대로 노출하지 않고 ACL이 User로 변환해요.' },
        { t: 'UserId / Email', d: '우리 도메인의 값 객체예요. 레거시 시스템의 원시 필드를 풍부한 도메인 타입으로 감싸줘요.' },
      ],
      expectedOutput:
        'findById(1L) — 데이터 존재 시:\n' +
        '[실행] 레거시 시스템 조회 — id: 1\n' +
        '[변환] LegacyUserDto → User — 이름: kim\n\n' +
        'findById(999L) — 데이터 없음:\n' +
        '[실행] 레거시 시스템 조회 — id: 999\n' +
        '[결과] 레거시 데이터 없음',
      realWorldUsage:
        '실제 프로젝트에서 메인프레임·레거시 ERP·구버전 API와 연동해야 할 때 ACL을 써요. "사용자"를 레거시는 CUST_MST 테이블에 CUST_NM 컬럼으로 관리하고, 우리는 users 테이블에 name 컬럼으로 관리한다면, ACL이 CUST_NM → name으로 맵핑해줘요. 레거시 시스템이 교체될 때 ACL 구현체만 바꾸면 되고, 도메인 코드는 영향을 받지 않아요.',
      why: '외부 시스템의 용어·모델·기술이 내부 도메인을 오염시키는 걸 방어하고, 외부 시스템 교체 시 영향을 최소화하려고요.',
      pitfall: 'ACL 없이 레거시 DTO를 서비스 레이어까지 그대로 전달하면, 레거시 용어가 도메인 전체에 퍼져나가서 나중에 수정할 곳이 수백 군데가 돼요. ACL은 경계에서 확실히 변환을 완료하고 도메인 모델만 통과시키세요.',
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
 *
 * Java 규칙: 파일 하나에 package 선언은 반드시 하나만 허용돼요.
 */
package com.shop.user;`,
    explain: {
      concept:
        '기능별 패키지(Feature-based Package)는 도메인 개념 중심으로 코드를 묶는 구성 방식이에요. ' +
        '전통적인 계층별 패키지(controller·service·repository)가 기술 관심사로 나누는 반면, 기능별 패키지는 "사용자에 관한 모든 것"을 user/ 폴더 아래에 모아둬요. ' +
        'user/domain에는 순수 도메인 모델, user/application에는 유스케이스, user/adapter/in에는 웹 컨트롤러, user/adapter/out에는 영속성·이벤트·외부 API 어댑터를 둬요. ' +
        '이 방식의 가장 큰 장점은 "사용자 관련 변경이 생기면 user/ 폴더만 보면 된다"는 거예요 — 관련 코드가 한 곳에 모여 있어서 찾기 쉽고 응집도가 높아요.',
      terms: [
        { t: 'com.shop.user', d: '사용자 기능의 루트 패키지예요. 사용자와 관련된 모든 코드가 이 아래에 위치해요.' },
        { t: 'domain/', d: '도메인 모델(Entity, Value Object, Domain Service, Repository 인터페이스)을 모아둔 곳이에요.' },
        { t: 'application/', d: '유스케이스(Application Service)를 모아둔 곳이에요. 비즈니스 흐름을 조립하는 코드가 있어요.' },
        { t: 'adapter/in/web/', d: '외부 요청이 들어오는 인바운드 어댑터예요. REST 컨트롤러·메시지 리스너 등이 위치해요.' },
        { t: 'adapter/out/persistence/', d: '외부로 나가는 아웃바운드 어댑터예요. JPA·Redis·Kafka 구현체가 위치해요.' },
      ],
      expectedOutput:
        '패키지 구조는 콘솔 출력이 없어요. 대신 IDE에서 패키지 탐색기가 이렇게 보여요:\n' +
        'com.shop.user/\n' +
        '  domain/ → User.java, Email.java, UserId.java\n' +
        '  application/ → RegisterUserUseCase.java\n' +
        '  adapter/in/web/ → UserController.java\n' +
        '  adapter/out/persistence/ → JpaUserAdapter.java',
      realWorldUsage:
        '실제 마이크로서비스 프로젝트에서 각 서비스별로 기능 패키지 구조를 써요. user-service/는 com.shop.user 아래에, order-service/는 com.shop.order 아래에 모든 코드를 모아요. 새 개발자가 "주문 취소 로직을 고쳐주세요"라는 티켓을 받으면 order/ 폴더만 탐색하면 되고, 실수로 user/ 폴더를 건드릴 일이 없어서 변경 영향 범위가 명확해져요.',
      why: '도메인 기능 단위로 코드를 응집시켜서, 관련 코드 탐색이 쉽고 변경 영향 범위가 예측 가능하게 하려고요.',
      pitfall: '도메인 패키지(domain/)가 웹(JPA, Controller) 패키지를 참조하면 의존성 방향이 거꾸로 흘러요. 의존성은 항상 바깥(adapter) → 안쪽(application) → 가장 안쪽(domain)으로만 향해야 해요.',
    },
  },
];
