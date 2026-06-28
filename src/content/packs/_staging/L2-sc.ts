import type { Snippet } from '../../types';

export const springCore: Snippet[] = [
  {
    id: 'sc-component',
    lang: 'java',
    title: '@Component 기본 등록',
    file: 'EmailValidator.java',
    code: `import org.springframework.stereotype.Component;

@Component
public class EmailValidator {

  public boolean isValid(String email) {
    boolean result = email != null && email.contains("@");
    System.out.println("[실행] 이메일 검사 — 입력: " + email + ", 결과: " + result);
    return result;
  }
}`,
    explain: {
      concept:
        '@Component는 클래스에 "나 스프링이 관리해 줘"라는 스티커를 붙이는 거예요. 스프링이 시작할 때 이 어노테이션이 붙은 클래스를 모두 찾아서 객체(빈)로 만들어 컨테이너에 보관해줘요. ' +
        '다른 클래스에서 이 EmailValidator가 필요하다고 하면, 스프링이 알아서 꺼내서 주입해줘요 — new EmailValidator()를 직접 호출할 필요가 전혀 없어져요. ' +
        '식당으로 치면 "이 요리사는 우리 가게 소속이에요"라는 명찰을 달아주는 거예요 — 주방장이 필요할 때 명찰을 보고 바로 찾을 수 있죠. ' +
        '실무에서는 @Service, @Repository, @Controller도 내부적으로 @Component를 포함하고 있어서 모두 같은 원리로 동작해요.',
      terms: [
        { t: '@Component', d: '스프링이 이 클래스의 객체를 자동으로 만들어 관리하게 하는 어노테이션이에요' },
        { t: 'class EmailValidator', d: '이메일 형식을 검증하는 역할을 가진 클래스예요 — 이름만 봐도 무슨 일을 하는지 알 수 있어요' },
        { t: 'isValid', d: '이메일이 null이 아니고 @를 포함하는지 검사하는 메서드예요 — boolean으로 결과를 반환해요' },
        { t: 'System.out.println', d: '디버깅을 위해 입력값과 검사 결과를 콘솔에 출력해요' },
      ],
      why:
        '객체 생성과 의존성 관리라는 반복 작업을 스프링에게 맡겨서, 개발자는 비즈니스 로직에만 집중하려고 써요. ' +
        '직접 new로 객체를 만들면 의존성이 코드에 단단히 박혀서 나중에 바꾸기 어려워져요.',
      expectedOutput:
        'isValid("test@example.com") 호출 시:\n' +
        '[실행] 이메일 검사 — 입력: test@example.com, 결과: true',
      realWorldUsage:
        '실제 프로젝트에서 EmailValidator 같은 검증 클래스는 회원가입·비밀번호 찾기 화면에서 사용자 입력을 검사할 때 호출돼요. ' +
        '컨트롤러에서 @Autowired로 주입받아서 쓰는 패턴이에요.',
      pitfall: '@ComponentScan이 기본 패키지 범위 밖을 스캔하지 않으면 빈으로 등록되지 않아요. 메인 클래스가 있는 패키지 아래에 컴포넌트를 두세요.',
    },
  },
  {
    id: 'sc-service',
    lang: 'java',
    title: '@Service 계층 표시',
    file: 'UserService.java',
    code: `import org.springframework.stereotype.Service;

@Service
public class UserService {

  private final UserRepository repo;

  public UserService(UserRepository repo) {
    this.repo = repo;
    System.out.println("[실행] UserService 생성 — repo 주입됨");
  }

  public User find(Long id) {
    System.out.println("[실행] 사용자 조회 — id: " + id);
    User user = repo.findById(id);
    System.out.println("[결과] 조회된 사용자: " + user);
    return user;
  }
}`,
    explain: {
      concept:
        '@Service는 @Component와 기능이 완전히 똑같지만, "이 클래스는 비즈니스 로직을 담당하는 서비스 계층이에요"라고 코드 읽는 사람에게 의미를 전달해줘요. ' +
        '식당의 주방장이 요리사와 같은 직원이지만 "주방장"이라는 역할이 다른 것처럼, @Service는 "이 클래스는 핵심 업무 규칙을 처리해요"라는 역할 표시예요. ' +
        '생성자에 UserRepository를 매개변수로 받고 있는데, 스프링이 UserService를 만들 때 UserRepository 빈을 찾아서 자동으로 넣어줘요(생성자 주입). ' +
        '실무에서는 Controller → Service → Repository의 3계층 구조에서 중간 허리 역할을 맡아서, 컨트롤러의 요청을 받아 리포지토리에 위임하고 결과를 가공해 반환해요.',
      terms: [
        { t: '@Service', d: '비즈니스 로직을 처리하는 서비스 계층임을 나타내요 — @Component와 동작은 같지만 역할을 명확히 해줘요' },
        { t: 'private final UserRepository repo', d: '데이터 접근을 담당하는 리포지토리를 final로 선언해 생성 후 변경을 막아요' },
        { t: 'public UserService(UserRepository repo)', d: '생성자에서 의존성을 주입받아요 — 스프링이 자동으로 repo를 넣어줘요' },
        { t: 'find(Long id)', d: 'id로 사용자를 조회하는 비즈니스 메서드예요 — 실제 DB 조회는 repo에 위임해요' },
      ],
      why:
        '코드를 역할별로 나눠서(Controller는 요청 처리, Service는 비즈니스 규칙, Repository는 데이터 접근) 변경이 필요할 때 한 계층만 고치면 되게 하려고 써요. ' +
        '실무에서 "회원가입 시 이름이 2글자 이상" 같은 규칙은 Service에 작성해요.',
      expectedOutput:
        'find(1L) 호출 시 콘솔:\n' +
        '[실행] UserService 생성 — repo 주입됨\n' +
        '[실행] 사용자 조회 — id: 1\n' +
        '[결과] 조회된 사용자: User{id=1, name=\'kim\'}',
      realWorldUsage:
        '실제로 회원가입 API에서 POST /users 요청이 오면 UserController.join()이 UserService.join()을 호출하고, ' +
        '여기서 "이미 가입된 이메일인지 검사 → 비밀번호 암호화 → DB 저장"이라는 비즈니스 흐름이 실행돼요.',
      pitfall: '생성자가 1개면 @Autowired 생략이 가능하지만, 생성자가 2개 이상이면 반드시 @Autowired를 붙여야 스프링이 어떤 생성자로 주입할지 알 수 있어요.',
    },
  },
  {
    id: 'sc-repository',
    lang: 'java',
    title: '@Repository 데이터 계층',
    file: 'UserRepository.java',
    code: `import java.util.HashMap;
import java.util.Map;
import org.springframework.stereotype.Repository;

@Repository
public class UserRepository {

  private final Map<Long, User> store = new HashMap<>();

  public User findById(Long id) {
    User user = store.get(id);
    System.out.println("[실행] DB 조회 — id: " + id + ", 결과: " + user);
    return user;
  }

  public void save(User user) {
    store.put(user.getId(), user);
    System.out.println("[실행] DB 저장 — user: " + user);
  }
}`,
    explain: {
      concept:
        '@Repository는 데이터를 저장·조회·수정·삭제하는 "창고" 역할을 담당하는 계층 표시예요. @Component와 동작은 같지만, "데이터 접근 전담 클래스"라는 의미를 전달해요. ' +
        'DB 접근 중 발생하는 예외(예: SQLException)를 스프링이 이해하기 쉬운 DataAccessException이라는 통일된 예외로 자동 변환해주는 특별한 기능도 있어요. ' +
        '여기서는 진짜 DB 대신 HashMap을 메모리 저장소로 써서 간단한 예제를 만들고 있어요 — 실무에서는 JpaRepository나 MyBatis Mapper가 이 역할을 대신해요.',
      terms: [
        { t: '@Repository', d: '데이터 접근 계층을 나타내는 어노테이션이에요 — DB 예외를 스프링 예외로 자동 변환해줘요' },
        { t: 'Map<Long, User> store', d: '메모리 기반 저장소예요 — 키는 사용자 ID, 값은 User 객체를 담아요' },
        { t: 'findById(Long id)', d: 'ID로 사용자를 찾는 조회 메서드예요 — 없으면 null을 반환해요' },
        { t: 'save(User user)', d: '사용자 객체를 저장소에 넣는 메서드예요 — ID가 키 역할을 해요' },
      ],
      why:
        '데이터 저장 기술(JDBC → JPA → MyBatis)이 바뀌어도 서비스 계층 코드는 변경하지 않고 리포지토리만 교체하려고 써요. ' +
        '서비스는 "findById"라는 인터페이스만 바라보고, 구현체가 HashMap이든 Oracle이든 상관하지 않아요.',
      expectedOutput:
        'save(new User(1L, "kim")) 후 findById(1L) 호출:\n' +
        '[실행] DB 저장 — user: User{id=1, name=\'kim\'}\n' +
        '[실행] DB 조회 — id: 1, 결과: User{id=1, name=\'kim\'}',
      realWorldUsage:
        '실제로 스프링 데이터 JPA에서는 @Repository 인터페이스에 JpaRepository<User, Long>만 상속받으면 findById, save, delete 같은 기본 메서드가 자동 생성돼요.',
      pitfall: 'DB 기술 전용 예외(SQLException, HibernateException 등)가 서비스 계층으로 새어 나가는 걸 막으려면 반드시 @Repository를 붙여야 해요. @Component만 붙이면 예외 변환 기능이 동작하지 않아요.',
    },
  },
  {
    id: 'sc-bean-config',
    lang: 'java',
    title: '@Bean 메서드 빈 등록',
    file: 'AppConfig.java',
    code: `import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;

@Configuration
public class AppConfig {

  @Bean
  public PasswordEncoder passwordEncoder() {
    System.out.println("[실행] PasswordEncoder 빈 생성");
    return new BCryptPasswordEncoder();
  }
}`,
    explain: {
      concept:
        '@Bean은 "이 메서드가 반환하는 객체를 스프링 컨테이너에 등록해 줘"라는 표시예요. ' +
        '@Component는 내가 직접 만든 클래스에 붙일 수 있지만, 외부 라이브러리 클래스(BCryptPasswordEncoder 같은)에는 직접 붙일 수 없잖아요? ' +
        '그럴 때 @Configuration 클래스 안에 @Bean 메서드를 만들어서 외부 라이브러리 객체도 스프링 빈으로 등록할 수 있어요. ' +
        '레시피대로 요리를 만들어 스프링 찬장에 넣어두는 것과 같아요 — 필요할 때 찬장에서 꺼내 쓰면 돼요.',
      terms: [
        { t: '@Configuration', d: '이 클래스가 빈 설정 정보를 담고 있다고 스프링에게 알려줘요 — 없으면 @Bean이 제대로 동작하지 않아요' },
        { t: '@Bean', d: '메서드가 반환하는 객체를 스프링 빈으로 등록해요 — 메서드 이름이 기본 빈 이름이 돼요' },
        { t: 'PasswordEncoder', d: '비밀번호 암호화 전략을 정의하는 인터페이스예요' },
        { t: 'BCryptPasswordEncoder', d: 'BCrypt 해시 알고리즘으로 비밀번호를 암호화하는 구현체예요 — 실무에서 가장 많이 써요' },
      ],
      why:
        '외부 라이브러리 객체를 스프링 빈으로 등록하려고 @Bean을 써요. ' +
        'BCryptPasswordEncoder도 new로 직접 만들 수 있지만, 빈으로 등록해두면 모든 서비스가 같은 인스턴스를 공유해서 메모리도 아끼고 설정도 한 곳에서 관리할 수 있어요.',
      expectedOutput:
        '스프링 부트 시작 시:\n' +
        '[실행] PasswordEncoder 빈 생성',
      realWorldUsage:
        '실제로 SecurityConfig 클래스에서 PasswordEncoder, SecurityFilterChain 같은 스프링 시큐리티 객체들을 @Bean으로 등록해요. ' +
        'RestTemplate, RestClient, ModelMapper 같은 유틸리티 객체도 모두 @Bean으로 등록해서 프로젝트 전역에서 재사용해요.',
      pitfall: '@Configuration 없이 일반 @Component 클래스에 @Bean을 붙이면 "Lite 모드"로 동작해서, 같은 @Bean 메서드를 여러 번 호출하면 매번 새 객체가 만들어질 수 있어요.',
    },
  },
  {
    id: 'sc-configuration',
    lang: 'java',
    title: '@Configuration 다중 빈',
    file: 'DataSourceConfig.java',
    code: `import javax.sql.DataSource;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.jdbc.core.JdbcTemplate;
import com.zaxxer.hikari.HikariDataSource;

@Configuration
public class DataSourceConfig {

  @Bean
  public DataSource dataSource() {
    System.out.println("[실행] DataSource 빈 생성");
    return new HikariDataSource();
  }

  @Bean
  public JdbcTemplate jdbcTemplate(DataSource ds) {
    System.out.println("[실행] JdbcTemplate 빈 생성 — DataSource 주입됨");
    return new JdbcTemplate(ds);
  }
}`,
    explain: {
      concept:
        '@Configuration 클래스 안에서는 여러 @Bean 메서드가 서로를 참조할 수 있어요. ' +
        'jdbcTemplate() 메서드가 DataSource를 매개변수로 받고 있는데, 스프링이 같은 클래스의 dataSource() 메서드가 반환한 빈을 자동으로 넣어줘요. ' +
        '여기서 중요한 건 @Configuration의 특별한 기능인데, dataSource()를 여러 번 호출해도 실제로는 한 번만 생성된 싱글톤 빈을 돌려줘요 — 스프링이 @Configuration 클래스를 CGLIB 프록시로 감싸서 이 마법을 구현해요.',
      terms: [
        { t: '@Configuration', d: '스프링이 CGLIB 프록시로 감싸서 @Bean 메서드가 싱글톤을 보장하게 해요' },
        { t: 'dataSource()', d: 'DB 연결 풀(HikariCP)을 생성하는 @Bean 메서드예요 — 커넥션을 효율적으로 관리해요' },
        { t: 'jdbcTemplate(DataSource ds)', d: 'DataSource를 주입받아 JdbcTemplate을 생성해요 — 스프링이 ds를 자동으로 넣어줘요' },
        { t: 'JdbcTemplate', d: 'JDBC 작업(쿼리 실행 등)을 간편하게 해주는 스프링의 템플릿 클래스예요' },
      ],
      why:
        '관련 빈들을 한 클래스에 모아서 설정을 체계적으로 관리하려고 써요. ' +
        'DataSource → JdbcTemplate → TransactionManager처럼 의존성 체인이 있는 빈들을 한눈에 볼 수 있어요.',
      expectedOutput:
        '스프링 부트 시작 시:\n' +
        '[실행] DataSource 빈 생성\n' +
        '[실행] JdbcTemplate 빈 생성 — DataSource 주입됨',
      realWorldUsage:
        '실제로 DataSourceConfig, SecurityConfig, WebMvcConfig처럼 관심사별로 @Configuration 클래스를 나눠서 관리해요. ' +
        '운영 환경과 테스트 환경에서 다른 DataSource를 주입할 때 이 구조 덕분에 설정만 바꾸면 돼요.',
      pitfall: '@Configuration이 아닌 @Component에서 @Bean을 쓰면 프록시가 적용되지 않아서, jdbcTemplate(dataSource()) 호출 시 매번 새 DataSource가 생성돼요.',
    },
  },
  {
    id: 'sc-configprops',
    lang: 'java',
    title: '@ConfigurationProperties 바인딩',
    file: 'MailProperties.java',
    code: `import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.stereotype.Component;

@Component
@ConfigurationProperties(prefix = "mail")
public class MailProperties {

  private String host;
  private int port;

  public String getHost() { return host; }
  public void setHost(String host) {
    this.host = host;
    System.out.println("[실행] host 설정됨: " + host);
  }

  public int getPort() { return port; }
  public void setPort(int port) {
    this.port = port;
    System.out.println("[실행] port 설정됨: " + port);
  }
}`,
    explain: {
      concept:
        '@ConfigurationProperties는 application.properties 파일에 적은 설정값을 자바 객체의 필드에 자동으로 채워주는 도구예요. ' +
        'prefix="mail"로 지정했으니까 mail.host와 mail.port 값을 찾아서 host와 port 필드에 넣어줘요. ' +
        '예전에는 @Value("${mail.host}")를 필드마다 하나씩 붙여야 했는데, 이제는 클래스 하나로 같은 prefix의 모든 설정을 한 번에 묶을 수 있어요. ' +
        '타입 안전하게 int port에 문자열이 들어오면 시작 시점에 바로 에러를 내줘서, 런타임에 이상한 값이 들어가는 걸 막아줘요.',
      terms: [
        { t: '@ConfigurationProperties(prefix = "mail")', d: 'mail로 시작하는 설정값들을 이 클래스 필드에 자동으로 매핑해요' },
        { t: '@Component', d: '이 클래스를 스프링 빈으로 등록해야 바인딩이 동작해요 — 없으면 값이 채워지지 않아요' },
        { t: 'setHost(String host)', d: '세터를 통해 mail.host 값이 주입돼요 — 자바빈 규약(getter/setter)을 따라야 해요' },
        { t: 'private int port', d: '설정값의 타입(int)을 명확히 지정해서 잘못된 값이 들어오면 시작 시점에 감지해요' },
      ],
      why:
        '설정 파일의 값을 타입 안전하게 자바 코드에서 쓰려고 써요. ' +
        '@Value로 10군데 흩어진 설정을 한 클래스로 모으면, "이 프로젝트의 메일 설정이 뭐지?"를 한눈에 파악할 수 있어요.',
      expectedOutput:
        'application.properties에 mail.host=smtp.example.com, mail.port=587 설정 시:\n' +
        '[실행] host 설정됨: smtp.example.com\n' +
        '[실행] port 설정됨: 587',
      realWorldUsage:
        '실제로 mail 설정, payment 설정, aws 설정 등 기능별로 Properties 클래스를 만들어서 관리해요. ' +
        'IntelliJ의 spring-boot-configuration-processor 의존성을 추가하면 설정 파일에서 자동완성도 지원돼요.',
      pitfall: '@Component 없이 @ConfigurationProperties만 붙이면 빈 등록이 안 돼서 값이 주입되지 않아요. 또는 @EnableConfigurationProperties(MailProperties.class)로 별도 등록하는 방법도 있어요.',
    },
  },
  {
    id: 'sc-profile',
    lang: 'java',
    title: '@Profile 환경 분기',
    file: 'PaymentConfig.java',
    code: `import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Profile;

@Configuration
public class PaymentConfig {

  @Bean
  @Profile("dev")
  public PaymentGateway mockGateway() {
    System.out.println("[실행] 개발용 가짜 결제 빈 등록");
    return new MockGateway();
  }

  @Bean
  @Profile("prod")
  public PaymentGateway realGateway() {
    System.out.println("[실행] 운영용 진짜 결제 빈 등록");
    return new RealGateway();
  }
}`,
    explain: {
      concept:
        '@Profile은 환경에 따라 어떤 빈을 생성할지 말지를 결정하는 스위치예요. ' +
        '개발(dev) 환경에서는 진짜 결제 대신 가짜 결제 모듈(MockGateway)을 등록해서 실제 돈이 빠져나가지 않게 하고, 운영(prod) 환경에서만 진짜 결제(RealGateway)를 등록해요. ' +
        'application.properties에서 spring.profiles.active=dev라고 설정하면 @Profile("dev")가 붙은 빈만 생성되고, @Profile("prod")가 붙은 빈은 무시돼요. ' +
        '실무에서는 로컬/dev/staging/prod 환경마다 다른 DB 설정, 다른 API 키, 다른 로깅 레벨을 적용할 때 @Profile을 써서 코드 변경 없이 환경만 바꿔요.',
      terms: [
        { t: '@Profile("dev")', d: 'spring.profiles.active에 "dev"가 포함됐을 때만 이 빈을 생성해요' },
        { t: 'dev / prod', d: '개발과 운영 환경을 구분하는 프로파일 이름이에요 — 관례적으로 dev/prod를 많이 써요' },
        { t: 'MockGateway', d: '실제 결제 대신 가짜로 동작하는 테스트용 구현체예요 — 돈이 실제로 빠져나가지 않아요' },
        { t: 'RealGateway', d: '실제 PG사 연동을 수행하는 운영용 구현체예요' },
      ],
      why:
        '환경마다 다른 구현체를 코드 변경 없이 안전하게 교체하려고 써요. ' +
        '개발자가 실수로 운영 서버에서 가짜 결제를 쓰는 사고를 방지할 수 있어요.',
      expectedOutput:
        'spring.profiles.active=dev 일 때:\n' +
        '[실행] 개발용 가짜 결제 빈 등록\n\n' +
        'spring.profiles.active=prod 일 때:\n' +
        '[실행] 운영용 진짜 결제 빈 등록',
      realWorldUsage:
        '실제로 로컬 개발 시에는 내장 H2 DB를, 운영에서는 AWS RDS MySQL을 사용하도록 DataSource 빈을 @Profile로 분기해요. ' +
        '이메일 발송도 로컬에서는 콘솔 출력으로, 운영에서는 AWS SES로 발송하도록 프로파일로 나눠요.',
      pitfall: 'spring.profiles.active를 설정하지 않으면 dev도 prod도 아닌 상태가 돼서 두 빈 모두 생성되지 않아요. 기본값을 설정하거나 @Profile이 없는 기본 빈을 하나 만들어두세요.',
    },
  },
  {
    id: 'sc-aspect',
    lang: 'java',
    title: '@Aspect + @Around 로깅',
    file: 'LoggingAspect.java',
    code: `import org.aspectj.lang.ProceedingJoinPoint;
import org.aspectj.lang.annotation.Around;
import org.aspectj.lang.annotation.Aspect;
import org.springframework.stereotype.Component;

@Aspect
@Component
public class LoggingAspect {

  @Around("execution(* com.example.service.*.*(..))")
  public Object log(ProceedingJoinPoint pjp) throws Throwable {
    long start = System.currentTimeMillis();
    System.out.println("[실행] 메서드 시작: " + pjp.getSignature());
    Object result = pjp.proceed();
    long elapsed = System.currentTimeMillis() - start;
    System.out.println("[결과] 메서드 종료: " + pjp.getSignature() + " (" + elapsed + "ms)");
    return result;
  }
}`,
    explain: {
      concept:
        'AOP(Aspect Oriented Programming)는 여러 클래스에 흩어져 있는 공통 코드를 한 곳에 모아서, 원하는 지점에 자동으로 끼워 넣는 기술이에요. ' +
        '@Aspect는 "나는 공통 코드를 끼워 넣는 모듈이에요"라고 표시하고, @Around는 대상 메서드 실행 전후를 완전히 감싸는 방식이에요. ' +
        'execution(* com.example.service.*.*(..))는 "com.example.service 패키지의 모든 클래스, 모든 메서드"를 대상으로 지정하는 표현식이에요 — 이걸 포인트컷(Pointcut)이라고 해요. ' +
        'proceed()를 호출하면 원래 실행하려던 메서드가 실제로 실행되고, 그 앞뒤로 시간 측정과 로깅을 끼워 넣을 수 있어요.',
      terms: [
        { t: '@Aspect', d: '이 클래스가 AOP 공통 관심사(횡단 관심사)를 담당한다고 표시해요 — @Component와 함께 써야 빈으로 등록돼요' },
        { t: '@Around', d: '대상 메서드 실행의 전·후를 감싸는 가장 강력한 어드바이스예요 — proceed() 호출 시점을 직접 제어할 수 있어요' },
        { t: 'execution(* com.example.service.*.*(..))', d: '서비스 패키지의 모든 클래스·모든 메서드에 적용하라는 포인트컷 표현식이에요' },
        { t: 'proceed()', d: '원래 메서드를 실제로 실행해요 — 호출 전이면 before 로직, 호출 후면 after 로직을 넣을 수 있어요' },
        { t: 'getSignature()', d: '실행 중인 메서드의 이름, 반환 타입 등 메타정보를 담은 객체를 반환해요' },
      ],
      why:
        '로깅·트랜잭션·보안 검사 같은 공통 코드를 비즈니스 로직에서 완전히 분리하려고 써요. ' +
        '100개 서비스 클래스에 일일이 로깅 코드를 넣지 않고, Aspect 하나로 모든 곳에 적용할 수 있어요.',
      expectedOutput:
        'UserService.find() 호출 시:\n' +
        '[실행] 메서드 시작: User com.example.service.UserService.find(Long)\n' +
        '[결과] 메서드 종료: User com.example.service.UserService.find(Long) (12ms)',
      realWorldUsage:
        '실제로 모든 컨트롤러의 요청/응답을 로깅하는 ApiLoggingAspect, 모든 서비스 메서드의 실행 시간을 측정하는 PerformanceAspect, ' +
        '특정 관리자 메서드에만 권한 검사를 끼워 넣는 SecurityAspect 등이 AOP로 구현돼요.',
      pitfall: '포인트컷 표현식에 오타가 있어도 스프링은 아무 에러도 내지 않아요. 조용히 적용되지 않아서, 로그가 안 찍히는 걸 보고 나서야 눈치채게 돼요. 시작 시 로그로 적용 확인하는 게 중요해요.',
    },
  },
  {
    id: 'sc-pointcut',
    lang: 'java',
    title: '@Pointcut 재사용',
    file: 'CommonPointcuts.java',
    code: `import org.aspectj.lang.annotation.Aspect;
import org.aspectj.lang.annotation.Pointcut;
import org.springframework.stereotype.Component;

@Aspect
@Component
public class CommonPointcuts {

  @Pointcut("execution(* com.example.service..*(..))")
  public void serviceLayer() {}

  @Pointcut("@annotation(org.springframework.transaction.annotation.Transactional)")
  public void transactionalMethods() {}

  public static void main(String[] args) {
    System.out.println("[실행] CommonPointcuts — 서비스 계층과 트랜잭션 메서드 포인트컷 정의됨");
  }
}`,
    explain: {
      concept:
        '@Pointcut은 "어디에 적용할지"라는 위치 정보를 재사용 가능한 이름으로 정의하는 도구예요. ' +
        'serviceLayer()라는 빈 메서드는 "서비스 계층 전체"에 적용한다는 뜻이고, transactionalMethods()는 "@Transactional이 붙은 메서드"에 적용한다는 뜻이에요. ' +
        '이렇게 이름을 붙여두면 다른 @Aspect 클래스에서 @Around("com.example.CommonPointcuts.serviceLayer()")처럼 깔끔하게 재사용할 수 있어요. ' +
        '메서드 본문이 비어 있는 게 정상이에요 — 이 메서드는 "이름표" 역할만 하고 실제 로직은 없어요.',
      terms: [
        { t: '@Pointcut', d: 'AOP를 적용할 지점(포인트컷)을 이름 붙여 정의해요 — 메서드 본문은 비워둬요' },
        { t: 'serviceLayer()', d: '서비스 계층 전체를 가리키는 포인트컷 이름이에요 — 여러 Aspect에서 재사용할 수 있어요' },
        { t: 'transactionalMethods()', d: '@Transactional이 붙은 메서드만 가리키는 포인트컷이에요' },
        { t: '..', d: '현재 패키지와 모든 하위 패키지를 포함하는 와일드카드예요' },
      ],
      why:
        '똑같은 포인트컷 표현식을 여러 Aspect에 복사-붙여넣기 하지 않으려고 써요. ' +
        '포인트컷을 바꿔야 할 때 한 곳만 수정하면 연결된 모든 Aspect에 반영돼요.',
      expectedOutput:
        'java CommonPointcuts\n' +
        '[실행] CommonPointcuts — 서비스 계층과 트랜잭션 메서드 포인트컷 정의됨',
      realWorldUsage:
        '실제로 프로젝트에서 포인트컷을 한 클래스에 모아두고, LoggingAspect, TransactionAspect, AuditAspect 등에서 공유해서 써요. ' +
        '"서비스 계층"의 범위가 바뀌어도 CommonPointcuts.serviceLayer()만 수정하면 돼요.',
      pitfall: '포인트컷 메서드의 본문은 반드시 비워둬야 해요. 로직을 넣으면 실행되지도 않고 의미도 없어요. 메서드 이름만이 의미를 가져요.',
    },
  },
  {
    id: 'sc-qualifier',
    lang: 'java',
    title: '@Qualifier 빈 선택',
    file: 'NotificationService.java',
    code: `import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.stereotype.Service;

@Service
public class NotificationService {

  private final Sender sender;

  public NotificationService(@Qualifier("emailSender") Sender sender) {
    this.sender = sender;
    System.out.println("[실행] NotificationService 생성 — " + sender.getClass().getSimpleName() + " 주입됨");
  }

  public void notify(String msg) {
    System.out.println("[실행] 알림 발송: " + msg);
    sender.send(msg);
  }
}`,
    explain: {
      concept:
        '@Qualifier는 같은 타입의 빈이 여러 개 있을 때 "이 이름의 빈을 주세요"라고 정확히 지정하는 도구예요. ' +
        'Sender 인터페이스를 구현한 EmailSender와 SmsSender가 둘 다 스프링 컨테이너에 등록돼 있을 때, 스프링은 어떤 걸 넣어야 할지 몰라서 NoUniqueBeanDefinitionException을 던져요. ' +
        '이때 @Qualifier("emailSender")로 빈의 이름을 콕 찍어주면 충돌이 해결돼요. 자판기에서 콜라가 두 종류일 때 "제로콜라 주세요"라고 말하는 거랑 같아요.',
      terms: [
        { t: '@Qualifier("emailSender")', d: '주입할 빈의 이름을 명시적으로 지정해요 — 같은 타입의 빈이 여러 개일 때 충돌을 해결해요' },
        { t: 'emailSender', d: '빈의 이름이에요 — @Component가 붙은 클래스는 기본적으로 소문자로 시작하는 클래스명이 빈 이름이 돼요' },
        { t: 'Sender', d: '메시지 발송을 추상화한 인터페이스예요 — EmailSender와 SmsSender가 이 타입을 구현해요' },
        { t: 'sender.getClass().getSimpleName()', d: '주입된 객체의 실제 클래스명을 출력해서 어떤 구현체가 들어왔는지 확인해요' },
      ],
      why:
        '같은 타입의 구현체가 여러 개일 때, 스프링이 헷갈리지 않도록 명확히 지정하려고 써요. ' +
        '실무에서는 DataSource가 메인/리드전용 두 개일 때, Sender가 이메일/SMS/카카오톡 여러 개일 때 @Qualifier로 구분해요.',
      expectedOutput:
        'EmailSender가 주입된 경우:\n' +
        '[실행] NotificationService 생성 — EmailSender 주입됨\n' +
        'notify("hello") 호출 시:\n' +
        '[실행] 알림 발송: hello',
      realWorldUsage:
        '실제로 메인 DB(쓰기용)와 리플리카 DB(읽기용)를 구분할 때 @Qualifier("masterDataSource")와 @Qualifier("slaveDataSource")로 구분해서 주입해요.',
      pitfall: '빈 이름은 기본적으로 클래스명의 첫 글자를 소문자로 바꾼 값이에요 (EmailSender → emailSender). 명시적으로 이름을 지정하려면 @Component("myName")처럼 써요.',
    },
  },
  {
    id: 'sc-primary',
    lang: 'java',
    title: '@Primary 기본 빈',
    file: 'PrimaryDataSourceConfig.java',
    code: `import javax.sql.DataSource;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Primary;
import com.zaxxer.hikari.HikariDataSource;

@Configuration
public class PrimaryDataSourceConfig {

  @Bean
  @Primary
  public DataSource mainDataSource() {
    System.out.println("[실행] 주 DB DataSource 빈 등록 (Primary)");
    return new HikariDataSource();
  }

  @Bean
  public DataSource replicaDataSource() {
    System.out.println("[실행] 복제 DB DataSource 빈 등록");
    return new HikariDataSource();
  }
}`,
    explain: {
      concept:
        '@Primary는 같은 타입의 빈이 여러 개일 때 "특별한 지정이 없으면 이걸 기본으로 줘"라고 마킹하는 어노테이션이에요. ' +
        'Qualifier 없이 DataSource를 주입받는 코드가 있다면, @Primary가 붙은 mainDataSource가 선택돼요. ' +
        '메뉴판의 "셰프 추천" 표시와 같아요 — 손님이 특별히 지정하지 않으면 추천 메뉴가 나가지만, "복제 DB"라고 지정하면 replicaDataSource를 받을 수 있어요. ' +
        '@Primary와 @Qualifier를 함께 쓰면, 대부분의 코드는 편하게 기본값을 쓰고 특별한 곳만 이름으로 지정하는 전략이 가능해져요.',
      terms: [
        { t: '@Primary', d: '같은 타입의 빈이 여러 개일 때, 지정이 없으면 이 빈을 기본으로 선택해요' },
        { t: 'mainDataSource', d: '주 데이터베이스 연결 풀이에요 — 쓰기/읽기 작업이 모두 여기로 들어와요' },
        { t: 'replicaDataSource', d: '읽기 전용 복제 데이터베이스 연결 풀이에요 — 읽기 부하를 분산할 때 써요' },
      ],
      why:
        '대부분의 코드에서 @Qualifier 없이도 주입이 자동으로 선택되게 하려고 써요. ' +
        '"기본은 메인 DB, 특별한 곳만 리플리카 DB" 같은 전략을 깔끔하게 구현할 수 있어요.',
      expectedOutput:
        '스프링 부트 시작 시:\n' +
        '[실행] 주 DB DataSource 빈 등록 (Primary)\n' +
        '[실행] 복제 DB DataSource 빈 등록',
      realWorldUsage:
        '실제로 메인 DataSource에 @Primary를 붙여서 대부분의 Repository가 자동으로 메인 DB를 바라보게 하고, ' +
        '읽기 성능이 중요한 특정 조회 서비스만 @Qualifier("replicaDataSource")로 복제 DB를 보게 해요.',
      pitfall: '@Primary를 같은 타입에 두 개 이상 붙이면 스프링이 또 충돌을 일으켜요. @Primary는 타입당 딱 하나만 유효해요.',
    },
  },
  {
    id: 'sc-constructor-injection',
    lang: 'java',
    title: '생성자 주입 권장 패턴',
    file: 'OrderService.java',
    code: `import org.springframework.stereotype.Service;

@Service
public class OrderService {

  private final OrderRepository repo;
  private final PaymentClient client;

  public OrderService(OrderRepository repo, PaymentClient client) {
    this.repo = repo;
    this.client = client;
    System.out.println("[실행] OrderService 생성 — OrderRepository, PaymentClient 주입 완료");
  }

  public void place(Order order) {
    System.out.println("[실행] 주문 처리: " + order);
    repo.save(order);
    client.charge(order.getAmount());
  }
}`,
    explain: {
      concept:
        '생성자 주입은 객체를 만들 때 필요한 모든 의존성을 생성자의 매개변수로 한꺼번에 받는 방식이에요. ' +
        '스프링 공식 문서에서 가장 권장하는 주입 방식인데, 의존성이 final로 선언 가능해서 객체가 만들어진 후에는 의존성이 절대 바뀌지 않는다는 걸 보장할 수 있어요. ' +
        '필드 주입(@Autowired)은 리플렉션으로 값을 꽂아서 final을 쓸 수 없고, 테스트할 때 목(mock)을 주입하기도 까다로운 반면, 생성자 주입은 테스트 생성자에 그냥 목을 넘기면 돼서 테스트가 쉬워져요. ' +
        '순환 참조(A가 B를, B가 A를 의존)가 생겼을 때도 생성자 주입은 애플리케이션 시작 시점에 바로 에러를 내줘서, 런타임에 조용히 무한 루프에 빠지는 걸 막아줘요.',
      terms: [
        { t: 'private final OrderRepository repo', d: '의존성을 final로 선언해 생성 후 변경을 완전히 막아요 — 불변성 보장' },
        { t: 'public OrderService(OrderRepository repo, PaymentClient client)', d: '생성자로 두 의존성을 동시에 주입받아요 — 빠진 의존성은 컴파일 에러로 알려줘요' },
        { t: 'this.repo = repo', d: '생성자 매개변수를 필드에 저장해요 — 이 시점 이후로 의존성은 절대 바뀌지 않아요' },
        { t: 'place(Order order)', d: '주문 처리 비즈니스 로직이에요 — DB 저장과 결제를 순서대로 실행해요' },
      ],
      why:
        '의존성의 불변성을 보장하고, 순환 참조를 시작 시점에 발견하고, 테스트를 쉽게 만들려고 생성자 주입을 써요. ' +
        '생성자가 1개일 때는 @Autowired조차 생략할 수 있어서 코드가 가장 깔끔해요.',
      expectedOutput:
        '스프링 부트 시작 시:\n' +
        '[실행] OrderService 생성 — OrderRepository, PaymentClient 주입 완료\n' +
        'place(order) 호출 시:\n' +
        '[실행] 주문 처리: Order{id=1, amount=15000}',
      realWorldUsage:
        '실제로 스프링 공식 가이드라인에서는 생성자 주입을 기본값으로 삼고 있어요. ' +
        'IntelliJ에서 @RequiredArgsConstructor가 붙은 롬복 클래스를 제외하면, 모든 서비스 클래스가 이 생성자 주입 패턴을 따라요.',
      pitfall: '생성자가 너무 많은 의존성(보통 5개 이상)을 받고 있다면, 그 클래스가 너무 많은 책임을 지고 있다는 신호예요. 클래스 분할을 고려하세요.',
    },
  },
  {
    id: 'sc-autowired-field',
    lang: 'java',
    title: '@Autowired 필드 주입',
    file: 'LegacyService.java',
    code: `import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class LegacyService {

  @Autowired
  private UserRepository repo;

  public User find(Long id) {
    System.out.println("[실행] 사용자 조회 (필드 주입) — id: " + id);
    return repo.findById(id);
  }
}`,
    explain: {
      concept:
        '@Autowired 필드 주입은 필드에 직접 어노테이션을 붙여서 스프링이 의존성을 주입하게 하는 방식이에요. 코드가 짧고 간단해 보이지만, 스프링 공식 문서에서 지양하라고 명시한 방식이에요. ' +
        '가장 큰 문제는 필드에 final을 붙일 수 없다는 점이에요 — 객체가 만들어진 후에도 의존성이 바뀔 수 있다는 뜻이고, 이건 불변성을 깨뜨려 예상치 못한 버그를 만들 수 있어요. ' +
        '또한 순환 참조가 있어도 애플리케이션이 정상적으로 시작해버리고, 나중에 런타임에서야 문제가 드러나요. ' +
        '테스트할 때도 리플렉션 없이는 목 객체를 주입할 수 없어서 테스트 코드가 복잡해져요.',
      terms: [
        { t: '@Autowired', d: '스프링이 해당 타입에 맞는 빈을 찾아 필드에 직접 꽂아줘요 — 리플렉션으로 동작해요' },
        { t: 'private UserRepository repo', d: 'private인데도 스프링이 접근할 수 있는 건 리플렉션 때문이에요 — final은 붙일 수 없어요' },
        { t: '필드 주입의 문제점', d: 'final 불가, 순환 참조 지연 발견, 테스트 어려움 등 여러 단점이 있어요' },
      ],
      why:
        '원래는 코드가 짧아서 간편해 보여서 썼지만, 스프링 4.x 이후로는 생성자 주입이 모든 면에서 더 나아요. ' +
        '레거시 프로젝트에 남아 있는 코드를 읽을 수 있어야 하니까 알아두는 용도예요.',
      expectedOutput:
        'find(1L) 호출 시:\n' +
        '[실행] 사용자 조회 (필드 주입) — id: 1',
      realWorldUsage:
        '실제로 오래된 레거시 프로젝트나 스프링을 처음 배울 때 작성한 코드에서 자주 보이는 패턴이에요. ' +
        '새로 만드는 코드에서는 생성자 주입이 절대적으로 권장돼요.',
      pitfall: '필드 주입을 쓰면 필드가 private인데도 스프링이 접근할 수 있어서 캡슐화가 깨진 것처럼 느껴져요. 생성자 주입으로 바꾸면 final로 만들 수 있고 테스트도 쉬워져요.',
    },
  },
  {
    id: 'sc-before-after',
    lang: 'java',
    title: '@Before / @After 어드바이스',
    file: 'SecurityAspect.java',
    code: `import org.aspectj.lang.JoinPoint;
import org.aspectj.lang.annotation.After;
import org.aspectj.lang.annotation.Aspect;
import org.aspectj.lang.annotation.Before;
import org.springframework.stereotype.Component;

@Aspect
@Component
public class SecurityAspect {

  @Before("execution(* com.example.service.*.*(..))")
  public void checkLogin(JoinPoint jp) {
    System.out.println("[실행] 권한 확인: " + jp.getSignature().getName());
  }

  @After("execution(* com.example.service.*.*(..))")
  public void audit(JoinPoint jp) {
    System.out.println("[실행] 감사 로그: " + jp.getSignature().getName());
  }
}`,
    explain: {
      concept:
        '@Before는 대상 메서드 실행 직전에, @After는 실행 직후에(정상 종료든 예외 발생이든 무조건) 호출되는 어드바이스예요. ' +
        '@Around와 달리 proceed()를 호출하지 않기 때문에 원래 메서드의 실행 흐름을 막을 수 없어요 — 단순히 "전에 이거 하고, 후에 저거 해"라는 보조 작업이에요. ' +
        '여기서는 서비스 계층의 모든 메서드에 대해, 실행 전에 권한 확인을 하고 실행 후에 감사 로그를 남기고 있어요. ' +
        '실무에서는 권한 검사, 입력값 검증, 감사 기록처럼 비즈니스 로직과 완전히 분리된 부가 작업에 이 패턴을 써요.',
      terms: [
        { t: '@Before', d: '대상 메서드가 실행되기 직전에 호출되는 어드바이스예요 — proceed() 호출 없이 자동으로 넘어가요' },
        { t: '@After', d: '대상 메서드가 끝난 직후에 호출돼요 — 정상이든 예외든 무조건 실행돼요' },
        { t: 'JoinPoint', d: '실행 중인 대상 메서드의 정보(이름, 인자, 대상 객체 등)를 담고 있는 객체예요' },
        { t: 'getSignature().getName()', d: '실행된 메서드의 이름만 문자열로 꺼내요 — 로그에 찍기 좋아요' },
      ],
      why:
        '권한 확인이나 감사 로그처럼 실행 결과와 무관하게 항상 실행돼야 하는 공통 작업을 분리하려고 써요. ' +
        '@Around보다 단순하고, proceed()를 빼먹어서 원래 메서드가 실행되지 않는 실수를 할 일이 없어요.',
      expectedOutput:
        'UserService.find() 호출 시:\n' +
        '[실행] 권한 확인: find\n' +
        '[실행] 감사 로그: find',
      realWorldUsage:
        '실제로 관리자 페이지에 접근할 때 @Before로 세션의 관리자 권한을 확인하고, ' +
        '모든 API 호출 후에 @After로 접근 로그를 DB에 기록하는 식으로 써요.',
      pitfall: '@After는 예외가 발생해도 항상 실행돼요. 예외 발생 시에만 실행하려면 @AfterThrowing을, 정상 반환 시에만 실행하려면 @AfterReturning을 쓰세요.',
    },
  },
  {
    id: 'sc-enable-aspect',
    lang: 'java',
    title: '@EnableAspectJAutoProxy AOP 활성화',
    file: 'AopConfig.java',
    code: `import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.EnableAspectJAutoProxy;

@Configuration
@EnableAspectJAutoProxy
public class AopConfig {

  @Bean
  public LoggingAspect loggingAspect() {
    System.out.println("[실행] AOP 활성화 — LoggingAspect 빈 등록");
    return new LoggingAspect();
  }
}`,
    explain: {
      concept:
        '@EnableAspectJAutoProxy는 스프링에게 "AOP 프록시 기능을 켜줘"라고 알려주는 스위치예요. ' +
        '이 설정이 있어야 @Aspect가 붙은 클래스가 실제로 동작해요 — 없으면 @Aspect를 붙여도 스프링이 무시하고 지나가요. ' +
        'Spring Boot 환경에서는 spring-boot-starter-aop 의존성만 추가하면 이 설정이 자동으로 활성화돼서 신경 쓸 일이 거의 없지만, ' +
        '순수 Spring Framework를 직접 설정할 때는 반드시 명시해야 해요.',
      terms: [
        { t: '@EnableAspectJAutoProxy', d: 'AspectJ 기반 AOP 프록시 생성을 활성화하는 어노테이션이에요' },
        { t: 'proxyTargetClass = true', d: '인터페이스가 없는 클래스도 CGLIB 프록시로 감싸도록 강제해요 (기본값은 false)' },
        { t: 'LoggingAspect', d: '@Aspect가 붙은 어드바이스 클래스를 수동으로 @Bean으로 등록하고 있어요' },
      ],
      why:
        '순수 Spring 환경에서 AOP를 활성화하려면 이 설정이 필수예요. ' +
        'Spring Boot에서는 Auto Configuration이 대신해 주지만, 왜 동작하는지 원리를 이해하는 게 중요해요.',
      expectedOutput:
        '스프링 부트 시작 시:\n' +
        '[실행] AOP 활성화 — LoggingAspect 빈 등록',
      realWorldUsage:
        '실제로 스프링 부트가 아닌 레거시 Spring MVC 프로젝트나 배치 애플리케이션에서 AOP를 쓰려면 이 어노테이션을 직접 설정해야 해요. ' +
        'Spring Boot 프로젝트에서도 명시적으로 선언해서 AOP가 활성화됐음을 문서화하는 용도로 쓰기도 해요.',
      pitfall: 'Spring Boot에서는 @EnableAspectJAutoProxy가 자동 설정되지만, spring-boot-starter-aop 의존성이 없으면 @Aspect 자체가 클래스패스에 없어서 에러가 나요.',
    },
  },
  {
    id: 'sc-qualifier-custom',
    lang: 'java',
    title: '커스텀 @Qualifier 어노테이션',
    file: 'SmsSender.java',
    code: `import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.stereotype.Component;
import org.springframework.stereotype.Service;

@Qualifier
@Target({ElementType.FIELD, ElementType.PARAMETER, ElementType.TYPE})
@Retention(RetentionPolicy.RUNTIME)
public @interface Sms {}

@Component
@Sms
class SmsSenderImpl implements Sender {
  public void send(String msg) {
    System.out.println("[실행] SMS 발송: " + msg);
  }
}

@Service
class AlertService {
  private final Sender sender;
  public AlertService(@Sms Sender sender) {
    this.sender = sender;
    System.out.println("[실행] AlertService 생성 — SmsSender 주입됨");
  }
}`,
    explain: {
      concept:
        '커스텀 @Qualifier는 "@Qualifier(\"smsSender\")"처럼 문자열 이름 대신, 직접 만든 어노테이션 타입으로 빈을 선택하는 방법이에요. ' +
        '문자열은 오타가 나도 컴파일러가 잡지 못하지만, 어노테이션 타입이면 @SmS처럼 오타가 나면 바로 빨간 줄이 떠서 실수를 원천 차단할 수 있어요. ' +
        '만드는 방법은 @Qualifier를 새 어노테이션에 붙이기만 하면 돼요 — 스프링이 이 어노테이션을 Qualifier처럼 인식하게 되는 거예요. ' +
        '실무에서는 이메일/카카오톡/푸시 알림처럼 발송 채널이 여러 개일 때, 문자열보다 타입으로 구분해서 안전하게 관리해요.',
      terms: [
        { t: '@Qualifier (메타 어노테이션)', d: '새 어노테이션을 Qualifier로 동작하게 하는 메타 어노테이션이에요' },
        { t: '@Retention(RUNTIME)', d: '어노테이션 정보를 런타임까지 유지해서 스프링이 읽을 수 있게 해요' },
        { t: '@Target({FIELD, PARAMETER, TYPE})', d: '이 어노테이션을 붙일 수 있는 위치를 지정해요 — 필드·파라미터·타입에 모두 붙일 수 있어요' },
        { t: '@Sms', d: '직접 만든 Qualifier예요 — 타입 안전하게 SmsSenderImpl을 선택해줘요' },
      ],
      why:
        '문자열 빈 이름(@Qualifier("smsSender"))은 오타가 나도 컴파일 시점에 알 수 없지만, 어노테이션 타입(@Sms)은 컴파일러가 검증해줘서 안전해요. ' +
        '빈 선택 로직에 의미를 담을 수 있어서 코드를 읽는 사람이 "아, SMS 전송기를 쓰는구나"라고 바로 이해할 수 있어요.',
      expectedOutput:
        '스프링 부트 시작 시:\n' +
        '[실행] AlertService 생성 — SmsSender 주입됨\n' +
        'send("hello") 호출 시:\n' +
        '[실행] SMS 발송: hello',
      realWorldUsage:
        '실제로 알림 발송 시스템에서 @Email, @Sms, @Kakao, @Push 같은 커스텀 Qualifier를 만들어서, ' +
        '서비스에서 필요한 발송 채널을 타입 안전하게 주입받아 써요.',
      pitfall: '@Target에 FIELD와 PARAMETER를 모두 포함하지 않으면, 필드 주입과 생성자 주입 중 한쪽에서만 쓸 수 있게 돼요. 양쪽 다 포함하는 게 안전해요.',
    },
  },
  {
    id: 'sc-profile-active',
    lang: 'java',
    title: 'SpringApplication으로 프로파일 활성화',
    file: 'AppLauncher.java',
    code: `import org.springframework.boot.builder.SpringApplicationBuilder;

public class AppLauncher {

  public static void main(String[] args) {
    System.out.println("[실행] dev 프로파일로 애플리케이션 시작");
    new SpringApplicationBuilder(AppLauncher.class)
        .profiles("dev")
        .run(args);
  }
}`,
    explain: {
      concept:
        'SpringApplicationBuilder는 코드에서 직접 프로파일을 지정해서 애플리케이션을 시작할 수 있는 빌더 클래스예요. ' +
        '보통은 application.properties에 spring.profiles.active=dev로 설정하지만, 테스트 코드나 CI/CD 파이프라인에서 동적으로 프로파일을 바꾸고 싶을 때 프로그래밍 방식이 필요해요. ' +
        '.profiles("dev")는 기존 프로파일 설정에 dev를 추가하는 방식이에요 — 이미 설정된 프로파일을 덮어쓰는 게 아니라 덧붙이는 거예요. ' +
        '통합 테스트에서 @ActiveProfiles("test") 대신 이 방식으로 테스트 환경을 구성하는 경우도 있어요.',
      terms: [
        { t: 'SpringApplicationBuilder', d: 'Spring Boot 앱을 빌더 패턴으로 세밀하게 구성하고 실행하는 클래스예요' },
        { t: '.profiles("dev")', d: '활성 프로파일에 dev를 추가해요 — 기존 프로파일이 있으면 덧붙여요' },
        { t: '.run(args)', d: '모든 설정을 적용한 후 애플리케이션을 시작해요' },
      ],
      why:
        '환경 변수나 설정 파일 없이 코드에서 프로파일을 동적으로 지정하려고 써요. ' +
        'CI 서버에서 테스트할 때 프로파일을 다르게 주고 싶을 때 유용해요.',
      expectedOutput:
        '[실행] dev 프로파일로 애플리케이션 시작\n' +
        '(이후 Spring Boot 시작 로그...)',
      realWorldUsage:
        '실제로 통합 테스트에서 @SpringBootTest와 함께 SpringApplicationBuilder로 특정 프로파일을 지정해 실행해요. ' +
        'CI/CD 파이프라인에서 단계별로 다른 프로파일(integration, staging)로 테스트할 때도 써요.',
      pitfall: 'Spring Boot 3.0부터 SpringApplication.setAdditionalProfiles()는 제거됐어요. SpringApplicationBuilder.profiles()를 대신 사용하세요.',
    },
  },
  {
    id: 'sc-after-returning',
    lang: 'java',
    title: '@AfterReturning 반환값 활용',
    file: 'AuditAspect.java',
    code: `import org.aspectj.lang.JoinPoint;
import org.aspectj.lang.annotation.AfterReturning;
import org.aspectj.lang.annotation.Aspect;
import org.springframework.stereotype.Component;

@Aspect
@Component
public class AuditAspect {

  @AfterReturning(
    pointcut = "execution(* com.example.service.UserService.find(..))",
    returning = "result"
  )
  public void afterFind(JoinPoint jp, Object result) {
    System.out.println("[실행] 조회 메서드: " + jp.getSignature().getName());
    if (result != null) {
      System.out.println("[결과] 조회된 데이터: " + result);
    } else {
      System.out.println("[결과] 조회 결과 없음 (null)");
    }
  }
}`,
    explain: {
      concept:
        '@AfterReturning은 대상 메서드가 예외 없이 정상적으로 값을 반환한 후에만 실행되는 어드바이스예요. ' +
        'returning 속성으로 반환값의 이름을 지정하면, 그 이름으로 어드바이스 메서드의 매개변수로 반환값을 받을 수 있어요. ' +
        '@After는 예외가 나도 실행되지만, @AfterReturning은 성공했을 때만 실행돼서 "정상 결과에 대한 후처리"에 딱 맞아요. ' +
        '실무에서는 사용자가 조회한 데이터를 감사 로그로 기록하거나, 반환값을 캐시에 저장하는 용도로 써요.',
      terms: [
        { t: '@AfterReturning', d: '메서드가 예외 없이 정상 반환한 뒤에만 실행되는 어드바이스예요' },
        { t: 'returning = "result"', d: '반환값을 "result"라는 이름으로 어드바이스 파라미터에 바인딩해요' },
        { t: 'Object result', d: '대상 메서드의 실제 반환값이 이 파라미터로 들어와요 — 타입은 대상 메서드에 맞춰 Object 대신 구체 타입을 써도 돼요' },
        { t: 'pointcut', d: '어드바이스를 적용할 대상 메서드를 지정하는 표현식이에요 — execution(...)으로 정확한 메서드를 찍어요' },
      ],
      why:
        '비즈니스 로직의 반환값을 로깅하거나 캐시하는 부가 작업을, 원래 코드는 한 줄도 건드리지 않고 수행하려고 써요. ' +
        '서비스 메서드 안에 로그 코드가 섞이면 핵심 로직이 잘 안 보이니까 분리하는 거예요.',
      expectedOutput:
        'UserService.find(1L) 호출 시:\n' +
        '[실행] 조회 메서드: find\n' +
        '[결과] 조회된 데이터: User{id=1, name=\'kim\'}',
      realWorldUsage:
        '실제로 모든 조회 메서드의 결과를 캐시(Redis)에 저장하는 CacheAspect에서 @AfterReturning으로 받은 반환값을 캐시에 put()해요. ' +
        '다음에 같은 요청이 오면 캐시에서 바로 꺼내서 DB 부하를 줄이는 구조예요.',
      pitfall: 'returning 속성값("result")과 어드바이스 메서드의 파라미터명(result)이 정확히 일치해야 해요. 다르면 IllegalArgumentException이 발생해요.',
    },
  },
  {
    id: 'sc-ioc-container',
    lang: 'java',
    title: 'ApplicationContext로 빈 직접 조회',
    file: 'ContextDemo.java',
    code: `import org.springframework.context.ApplicationContext;
import org.springframework.context.ApplicationContextAware;
import org.springframework.stereotype.Component;

@Component
public class ContextDemo implements ApplicationContextAware {

  private ApplicationContext ctx;

  @Override
  public void setApplicationContext(ApplicationContext ctx) {
    this.ctx = ctx;
    System.out.println("[실행] ApplicationContext 주입됨");
  }

  public void showBeans() {
    EmailValidator validator = ctx.getBean(EmailValidator.class);
    System.out.println("[결과] 빈 조회 성공: " + validator);
  }
}`,
    explain: {
      concept:
        'ApplicationContext는 스프링의 "빈 창고"예요. 이 창고 안에 @Component, @Service 등으로 등록된 모든 빈이 보관돼 있어요. ' +
        '평소에는 생성자 주입이나 @Autowired로 필요한 빈을 받지만, 아주 드물게 창고에서 직접 빈을 꺼내야 할 때가 있어요. ' +
        'ApplicationContextAware 인터페이스를 구현하면, 스프링이 빈을 만드는 시점에 setApplicationContext()를 자동으로 호출해서 창고 객체를 넘겨줘요. ' +
        '이후 ctx.getBean()으로 필요한 빈을 타입이나 이름으로 직접 찾을 수 있어요.',
      terms: [
        { t: 'ApplicationContext', d: '스프링의 IoC 컨테이너예요 — 모든 빈의 생성, 보관, 제공을 담당하는 핵심 객체예요' },
        { t: 'ApplicationContextAware', d: 'ApplicationContext를 주입받기 위한 콜백 인터페이스예요 — 구현하면 스프링이 자동으로 호출해줘요' },
        { t: 'ctx.getBean(Class)', d: '지정한 타입의 빈을 컨테이너에서 꺼내요 — 해당 타입 빈이 없으면 예외가 발생해요' },
        { t: 'setApplicationContext', d: '스프링이 빈을 초기화할 때 ApplicationContext를 주입해주는 콜백 메서드예요' },
      ],
      why:
        '레거시 코드나 static 유틸리티 클래스처럼 DI(의존성 주입)를 쓸 수 없는 상황에서 직접 빈을 가져오려고 써요. ' +
        '일반적인 상황에서는 생성자 주입을 쓰는 게 훨씬 좋아요.',
      expectedOutput:
        '스프링 부트 시작 시:\n' +
        '[실행] ApplicationContext 주입됨\n' +
        'showBeans() 호출 시:\n' +
        '[결과] 빈 조회 성공: com.example.EmailValidator@1234abcd',
      realWorldUsage:
        '실제로 ApplicationContext를 직접 쓰는 경우는 드물지만, 스프링 배치나 서블릿 필터 등 스프링이 직접 관리하지 않는 객체에서 빈이 필요할 때 써요.',
      pitfall: 'getBean()을 남용하면 DI의 장점(테스트 용이성, 느슨한 결합)이 모두 사라져요. "빈이 필요하면 생성자에 넣어라"가 기본 원칙이에요.',
    },
  },
  {
    id: 'sc-bean-lifecycle',
    lang: 'java',
    title: '빈 생명주기 콜백',
    file: 'ConnectionPool.java',
    code: `import jakarta.annotation.PostConstruct;
import jakarta.annotation.PreDestroy;
import org.springframework.stereotype.Component;

@Component
public class ConnectionPool {

  @PostConstruct
  public void init() {
    System.out.println("[실행] 커넥션 풀 초기화 — DB 연결 준비");
  }

  @PreDestroy
  public void close() {
    System.out.println("[실행] 커넥션 풀 종료 — DB 연결 해제");
  }

  public void getConnection() {
    System.out.println("[실행] 커넥션 획득");
  }
}`,
    explain: {
      concept:
        '@PostConstruct와 @PreDestroy는 빈의 생명주기(탄생→사용→소멸)의 특정 시점에 자동으로 호출되는 콜백 메서드예요. ' +
        '@PostConstruct는 빈이 생성되고 의존성 주입이 모두 완료된 직후에 한 번 실행돼서, DB 커넥션 풀 초기화나 리소스 할당 같은 시작 작업에 쓰여요. ' +
        '@PreDestroy는 스프링 컨테이너가 종료되기 직전에 실행돼서, 열었던 커넥션을 닫거나 임시 파일을 정리하는 정리 작업에 딱이에요. ' +
        'try-finally로 수동 관리할 필요 없이 스프링에게 "열고 닫는 타이밍"을 맡길 수 있어서 리소스 누수를 예방할 수 있어요.',
      terms: [
        { t: '@PostConstruct', d: '빈 생성 및 의존성 주입이 완료된 직후에 한 번 실행되는 초기화 메서드예요' },
        { t: '@PreDestroy', d: '스프링 컨테이너가 빈을 소멸시키기 직전에 실행되는 정리 메서드예요' },
        { t: 'init()', d: '커넥션 풀을 초기화하는 콜백이에요 — DB 연결을 미리 맺어두는 작업 등을 여기서 해요' },
        { t: 'close()', d: '애플리케이션 종료 시 열린 커넥션을 모두 반납하는 정리 작업이에요' },
      ],
      why:
        'DB 커넥션, 파일 핸들, 네트워크 소켓처럼 "열고 반드시 닫아야 하는 자원"의 생명주기를 스프링에게 맡기려고 써요. ' +
        '개발자가 직접 close()를 부르는 걸 깜빡해도 스프링이 알아서 닫아줘서 리소스 누수를 막을 수 있어요.',
      expectedOutput:
        '스프링 부트 시작 시:\n' +
        '[실행] 커넥션 풀 초기화 — DB 연결 준비\n' +
        '(애플리케이션 사용 중...)\n' +
        'getConnection() 호출 시:\n' +
        '[실행] 커넥션 획득\n' +
        '스프링 부트 종료 시:\n' +
        '[실행] 커넥션 풀 종료 — DB 연결 해제',
      realWorldUsage:
        '실제로 HikariCP 같은 DB 커넥션 풀이 @PostConstruct에서 초기화되고 @PreDestroy에서 풀을 닫아요. ' +
        '@Scheduled로 시작된 스레드 풀을 @PreDestroy에서 안전하게 종료하는 패턴도 흔해요.',
      pitfall: 'prototype 스코프 빈은 스프링이 생명주기를 완전히 관리하지 않아서 @PreDestroy가 호출되지 않아요. 직접 정리 메서드를 호출해야 해요.',
    },
  },
];
