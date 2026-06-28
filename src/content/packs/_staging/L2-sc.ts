import type { Snippet } from '../../types';

export const springCore: Snippet[] = [
  {
    id: 'sc-component',
    lang: 'java',
    title: '@Component 기본 등록',
    file: 'EmailValidator.java',
    code: `@Component
public class EmailValidator {

  public boolean isValid(String email) {
    return email != null && email.contains("@");
  }
}`,
    explain: {
      concept: '@Component는 클래스에 "나 스프링이 관리해 줘"라는 스티커를 붙이는 거예요. 스프링이 시작할 때 이 클래스를 찾아 객체를 만들어 보관하고, 필요한 곳에 나눠줘요.',
      terms: [
        { t: '@Component', d: '스프링이 관리할 컴포넌트로 표시' },
        { t: 'class', d: '객체를 찍어내는 틀 (설계도)' },
        { t: 'isValid', d: '이메일이 올바른지 검사하는 메서드' },
      ],
      why: '객체 생성을 스프링에 맡겨 필요한 곳에 재사용하려고요.',
      pitfall: '컴포넌트 스캔 범위 밖에 두면 빈으로 등록되지 않아요.',
    },
  },
  {
    id: 'sc-service',
    lang: 'java',
    title: '@Service 계층 표시',
    file: 'UserService.java',
    code: `@Service
public class UserService {

  private final UserRepository repo;

  public UserService(UserRepository repo) {
    this.repo = repo;
  }

  public User find(Long id) {
    return repo.findById(id);
  }
}`,
    explain: {
      concept: '@Service는 @Component와 똑같이 동작하지만 "비즈니스 로직을 담당하는 층"이라는 표시를 추가해요. 음식점의 주방장 모자 같은 역할이에요.',
      terms: [
        { t: '@Service', d: '서비스 계층 전용 컴포넌트 표시' },
        { t: 'final', d: '한 번 정해지면 바꿀 수 없음을 나타내는 키워드' },
        { t: 'UserRepository', d: '데이터를 다루는 저장소' },
        { t: '생성자', d: '객체가 만들어질 때 의존성을 주입받음' },
      ],
      why: '코드를 역할별로 나눠 가독성과 테스트를 쉽게 하려고요.',
      pitfall: '생성자가 1개면 @Autowired 생략 가능하지만 2개 이상이면 명시해야 해요.',
    },
  },
  {
    id: 'sc-repository',
    lang: 'java',
    title: '@Repository 데이터 계층',
    file: 'UserRepository.java',
    code: `@Repository
public class UserRepository {

  private final Map<Long, User> store = new HashMap<>();

  public User findById(Long id) {
    return store.get(id);
  }

  public void save(User user) {
    store.put(user.getId(), user);
  }
}`,
    explain: {
      concept: '@Repository는 데이터를 저장·조회하는 창고 담당 표시예요. 창고 관리자가 물건을 넣고 빼듯 데이터를 다뤄요.',
      terms: [
        { t: '@Repository', d: '데이터 접근 계층 컴포넌트' },
        { t: 'HashMap', d: '키-값으로 저장하는 메모리 저장소. 사전처럼 키로 값을 찾아요.' },
        { t: 'findById', d: 'id로 데이터 찾는 메서드' },
        { t: 'save', d: '데이터를 저장소에 넣는 메서드' },
      ],
      why: '데이터 저장 기술이 바뀌어도 서비스 코드는 그대로 쓰려고요.',
      pitfall: 'DB에서 발생하는 SQLException 같은 기술 전용 에러를 스프링이 이해하기 쉬운 통일된 에러(DataAccessException)로 자동으로 바꿔줘요.',
    },
  },
  {
    id: 'sc-bean-config',
    lang: 'java',
    title: '@Bean 메서드 빈 등록',
    file: 'AppConfig.java',
    code: `@Configuration
public class AppConfig {

  @Bean
  public PasswordEncoder passwordEncoder() {
    return new BCryptPasswordEncoder();
  }
}`,
    explain: {
      concept: '@Bean은 "이 메서드가 만든 객체를 스프링이 관리해 줘"라는 표시예요. 레시피대로 요리를 만들어 스프링 찬장에 넣어요.',
      terms: [
        { t: '@Configuration', d: '빈 설정 클래스 표시' },
        { t: '@Bean', d: '메서드 반환값을 빈으로 등록' },
        { t: 'PasswordEncoder', d: '비밀번호 암호화 담당' },
        { t: 'BCryptPasswordEncoder', d: 'BCrypt 방식 암호화 구현체' },
      ],
      why: '외부 라이브러리 객체는 @Component를 못 붙이니 설정으로 등록하려고요.',
      pitfall: '@Configuration 없이 @Bean만 쓰면 매번 새 객체가 만들어질 수 있어요.',
    },
  },
  {
    id: 'sc-configuration',
    lang: 'java',
    title: '@Configuration 다중 빈',
    file: 'DataSourceConfig.java',
    code: `@Configuration
public class DataSourceConfig {

  @Bean
  public DataSource dataSource() {
    return new HikariDataSource();
  }

  @Bean
  public JdbcTemplate jdbcTemplate(DataSource ds) {
    return new JdbcTemplate(ds);
  }
}`,
    explain: {
      concept: '@Configuration 클래스 안에서는 빈들끼리 서로 주입할 수 있어요. 한 주방에서 여러 요리를 만들어 재료를 공유하는 것과 같아요.',
      terms: [
        { t: '@Configuration', d: '설정 클래스. 스프링이 이 클래스를 가로채(CGLIB 프록시) 빈이 한 번만 만들어지게 보장해요.' },
        { t: 'dataSource()', d: '데이터베이스 연결 빈' },
        { t: 'jdbcTemplate(DataSource)', d: 'DataSource를 주입받아 생성' },
      ],
      why: '관련 빈들을 한 곳에서 묶어 설정하려고요.',
      pitfall: '같은 빈을 메서드로 여러 번 호출해도 싱글톤으로 한 번만 만들어요.',
    },
  },
  {
    id: 'sc-configprops',
    lang: 'java',
    title: '@ConfigurationProperties 바인딩',
    file: 'MailProperties.java',
    code: `@Component
@ConfigurationProperties(prefix = "mail")
public class MailProperties {

  private String host;
  private int port;

  public String getHost() { return host; }
  public void setHost(String host) { this.host = host; }

  public int getPort() { return port; }
  public void setPort(int port) { this.port = port; }
}`,
    explain: {
      concept: '@ConfigurationProperties는 설정 파일의 값을 자바 객체에 자동으로 채워주는 자동완성 기능이에요. 양식에 맞춰 데이터를 넣어요.',
      terms: [
        { t: '@ConfigurationProperties', d: '설정 값을 객체로 바인딩' },
        { t: 'prefix', d: '어떤 설정 그룹을 읽을지 접두어. "mail"이면 mail.host, mail.port 를 읽어요.' },
        { t: '@Component', d: '이 클래스를 스프링 빈으로 등록. 없으면 바인딩이 전혀 발생하지 않아요.' },
        { t: 'host', d: '메일 서버 주소' },
        { t: 'port', d: '메일 서버 포트' },
      ],
      why: '설정 값을 타입 안전하게 자바 코드에서 쓰려고요.',
      pitfall: '@Component 없이 @ConfigurationProperties만 붙이면 빈 등록이 안 돼 값이 주입되지 않아요. @EnableConfigurationProperties(MailProperties.class)로 대신 등록할 수도 있어요.',
    },
  },
  {
    id: 'sc-profile',
    lang: 'java',
    title: '@Profile 환경 분기',
    file: 'PaymentConfig.java',
    code: `@Configuration
public class PaymentConfig {

  @Bean
  @Profile("dev")
  public PaymentGateway mockGateway() {
    return new MockGateway();
  }

  @Bean
  @Profile("prod")
  public PaymentGateway realGateway() {
    return new RealGateway();
  }
}`,
    explain: {
      concept: '@Profile은 환경마다 다른 빈을 켜고 끄는 스위치예요. 개발용 가짜 결제, 운영용 진짜 결제를 상황에 맞게 선택해요.',
      terms: [
        { t: '@Profile', d: '활성 프로파일에 따라 빈 등록' },
        { t: 'dev', d: '개발 환경' },
        { t: 'prod', d: '운영 환경' },
        { t: 'MockGateway', d: '가짜 결제 구현체' },
      ],
      why: '환경마다 다른 구현체를 안전하게 바꾸려고요.',
      pitfall: 'spring.profiles.active 설정 없으면 두 빈 모두 등록되지 않아요.',
    },
  },
  {
    id: 'sc-aspect',
    lang: 'java',
    title: '@Aspect + @Around 로깅',
    file: 'LoggingAspect.java',
    code: `@Aspect
@Component
public class LoggingAspect {

  @Around("execution(* com.example.service.*.*(..))")
  public Object log(ProceedingJoinPoint pjp) throws Throwable {
    long start = System.currentTimeMillis();
    Object result = pjp.proceed();
    System.out.println(pjp.getSignature() + " " + (System.currentTimeMillis() - start) + "ms");
    return result;
  }
}`,
    explain: {
      concept: '@Aspect는 여러 메서드에 공통 작업을 끼워 넣는 투명 필름이에요. @Around로 메서드 실행 전후를 감싸 로깅을 끼워 넣어요.',
      terms: [
        { t: '@Aspect', d: '공통 관심사 모듈 표시 (여러 메서드에 끼워 넣을 공통 코드)' },
        { t: '@Around', d: '대상 메서드 실행 전후를 감쌈' },
        { t: 'execution(...)', d: '어디에 끼워넣을지 지정하는 표현식 (포인트컷)' },
        { t: 'proceed()', d: '원래 메서드 실행' },
        { t: 'getSignature()', d: '실행된 메서드 정보' },
      ],
      why: '로깅·트랜잭션 등 공통 코드를 비즈니스 코드에서 분리하려고요.',
      pitfall: '포인트컷 표현식 오타는 런타임에 아무것도 적용되지 않아요. 에러도 안 나서 찾기 힘들어요.',
    },
  },
  {
    id: 'sc-pointcut',
    lang: 'java',
    title: '@Pointcut 재사용',
    file: 'CommonPointcuts.java',
    code: `@Aspect
@Component
public class CommonPointcuts {

  @Pointcut("execution(* com.example.service..*(..))")
  public void serviceLayer() {}

  @Pointcut("@annotation(org.springframework.transaction.annotation.Transactional)")
  public void transactionalMethods() {}
}`,
    explain: {
      concept: '@Pointcut은 "어디에 적용할지"를 변수처럼 정의해 두는 거예요. 자주 쓰는 조건을 한 번 정의하고 여러 곳에서 불러 써요.',
      terms: [
        { t: '@Pointcut', d: '"어디에 적용할지"를 이름 붙여 정의' },
        { t: 'serviceLayer()', d: '서비스 계층 전체를 가리키는 이름' },
        { t: 'transactionalMethods()', d: '@Transactional이 붙은 메서드' },
        { t: '..', d: '하위 패키지 모두 포함' },
      ],
      why: '포인트컷 표현식을 반복 작성하지 않으려고요.',
      pitfall: '메서드 본문은 비워야 하고, 이름만 의미가 있어요.',
    },
  },
  {
    id: 'sc-qualifier',
    lang: 'java',
    title: '@Qualifier 빈 선택',
    file: 'NotificationService.java',
    code: `@Service
public class NotificationService {

  private final Sender sender;

  public NotificationService(@Qualifier("emailSender") Sender sender) {
    this.sender = sender;
  }

  public void notify(String msg) {
    sender.send(msg);
  }
}`,
    explain: {
      concept: '@Qualifier는 같은 타입의 빈이 여러 개일 때 "이 이름으로 된 걸로 주세요"라고 고르는 도구예요. 자판기에서 음료 이름을 고르는 것과 같아요.',
      terms: [
        { t: '@Qualifier', d: '주입할 빈의 이름을 지정' },
        { t: 'emailSender', d: '선택된 빈 이름' },
        { t: 'Sender', d: '공통 인터페이스 타입' },
      ],
      why: '같은 타입의 후보가 여러 개일 때 충돌을 피하려고요.',
      pitfall: '빈 이름은 소문자로 시작하는 클래스명이 기본이에요.',
    },
  },
  {
    id: 'sc-primary',
    lang: 'java',
    title: '@Primary 기본 빈',
    file: 'PrimaryDataSourceConfig.java',
    code: `@Configuration
public class PrimaryDataSourceConfig {

  @Bean
  @Primary
  public DataSource mainDataSource() {
    return new HikariDataSource();
  }

  @Bean
  public DataSource replicaDataSource() {
    return new HikariDataSource();
  }
}`,
    explain: {
      concept: '@Primary는 같은 타입 빈이 여러 개일 때 "이걸 기본으로 줘"라고 정하는 표시예요. 메뉴판의 추천 요리 같은 역할이에요.',
      terms: [
        { t: '@Primary', d: '기본 빈으로 지정' },
        { t: 'mainDataSource', d: '주 데이터베이스 연결' },
        { t: 'replicaDataSource', d: '복제 데이터베이스 연결' },
      ],
      why: '@Qualifier 없이도 주입 대상을 자동으로 고르려고요.',
      pitfall: '@Primary가 여러 개면 여전히 충돌이 발생해요.',
    },
  },
  {
    id: 'sc-constructor-injection',
    lang: 'java',
    title: '생성자 주입 권장 패턴',
    file: 'OrderService.java',
    code: `@Service
public class OrderService {

  private final OrderRepository repo;
  private final PaymentClient client;

  public OrderService(OrderRepository repo, PaymentClient client) {
    this.repo = repo;
    this.client = client;
  }
}`,
    explain: {
      concept: '생성자 주입은 객체를 만들 때 필요한 재료를 모두 받는 방식이에요. 조립 시점에 의존성이 확정돼 안전해요.',
      terms: [
        { t: 'final', d: '주입 후 변경 불가 표시. 재할당을 막아 안전하게 유지해요.' },
        { t: '생성자', d: '의존성을 한 번에 주입' },
        { t: 'this.repo', d: '필드에 주입된 의존성 저장' },
      ],
      why: '순환 참조를 컴파일 타임에 잡고 불변성을 보장하려고요.',
      pitfall: '필드 주입보다 코드가 길지만 테스트와 안전성이 훨씬 좋아요.',
    },
  },
  {
    id: 'sc-autowired-field',
    lang: 'java',
    title: '@Autowired 필드 주입',
    file: 'LegacyService.java',
    code: `@Service
public class LegacyService {

  @Autowired
  private UserRepository repo;

  public User find(Long id) {
    return repo.findById(id);
  }
}`,
    explain: {
      concept: '@Autowired는 "이 자리에 알맞은 빈을 꽂아 줘"라고 요청하는 표시예요. 필드에 직접 주입할 수 있어요.',
      terms: [
        { t: '@Autowired', d: '타입으로 빈을 찾아 주입' },
        { t: 'private', d: '외부에서 직접 접근 금지 표시' },
        { t: '필드 주입의 단점', d: 'final을 쓸 수 없어 불변성이 깨지고, 순환 참조를 런타임에야 발견해요. 테스트 시 목(mock) 주입도 어려워요.' },
      ],
      why: '간단하게 의존성을 주입하려고요.',
      pitfall: '권장하지 않아요. final을 못 쓰고 순환 참조를 런타임에 발견해요.',
    },
  },
  {
    id: 'sc-before-after',
    lang: 'java',
    title: '@Before / @After 어드바이스',
    file: 'SecurityAspect.java',
    code: `@Aspect
@Component
public class SecurityAspect {

  @Before("execution(* com.example.service.*.*(..))")
  public void checkLogin(JoinPoint jp) {
    System.out.println("권한 확인: " + jp.getSignature().getName());
  }

  @After("execution(* com.example.service.*.*(..))")
  public void audit(JoinPoint jp) {
    System.out.println("감사 로그: " + jp.getSignature().getName());
  }
}`,
    explain: {
      concept: '@Before는 메서드 실행 전, @After는 실행 후에 끼워 넣는 어드바이스예요. @Around와 달리 원래 메서드 호출 흐름을 가로막을 수 없어요.',
      terms: [
        { t: '@Before', d: '대상 메서드 실행 직전에 호출되는 어드바이스' },
        { t: '@After', d: '대상 메서드 실행 후(정상·예외 모두) 호출되는 어드바이스' },
        { t: 'JoinPoint', d: '실행 중인 메서드의 정보(이름·파라미터 등)를 담는 객체' },
      ],
      why: '권한 확인이나 감사 로그처럼 실행 결과와 무관한 공통 작업을 분리하려고요.',
      pitfall: '@After는 예외가 발생해도 항상 실행돼요. 예외가 발생했을 때만 실행하려면 @AfterThrowing을 써요.',
    },
  },
  {
    id: 'sc-enable-aspect',
    lang: 'java',
    title: '@EnableAspectJAutoProxy AOP 활성화',
    file: 'AopConfig.java',
    code: `@Configuration
@EnableAspectJAutoProxy
public class AopConfig {

  @Bean
  public LoggingAspect loggingAspect() {
    return new LoggingAspect();
  }
}`,
    explain: {
      concept: '@EnableAspectJAutoProxy는 스프링에게 "AOP 기능을 켜줘"라고 알려주는 스위치예요. 이 설정이 있어야 @Aspect가 동작해요. Spring Boot 환경에서는 spring-boot-starter-aop 의존성이 있으면 자동으로 켜져요.',
      terms: [
        { t: '@EnableAspectJAutoProxy', d: 'AspectJ 스타일 AOP를 활성화하는 설정 어노테이션' },
        { t: 'proxyTargetClass', d: 'true 설정 시 인터페이스가 없는 클래스도 CGLIB 프록시로 감싸요 (기본값 false)' },
        { t: 'LoggingAspect', d: '@Aspect가 붙은 어드바이스 클래스를 빈으로 등록' },
      ],
      why: '@Aspect 클래스를 스프링이 인식하게 하려면 AOP 프록시 처리를 활성화해야 해요.',
      pitfall: 'Spring Boot를 쓰면 별도 설정 없이 자동 활성화돼요. 순수 Spring 프로젝트에서는 이 어노테이션이 필요해요.',
    },
  },
  {
    id: 'sc-qualifier-custom',
    lang: 'java',
    title: '커스텀 @Qualifier 어노테이션',
    file: 'SmsSender.java',
    code: `@Qualifier
@Target({ElementType.FIELD, ElementType.PARAMETER, ElementType.TYPE})
@Retention(RetentionPolicy.RUNTIME)
public @interface Sms {}

@Component
@Sms
public class SmsSenderImpl implements Sender {
  public void send(String msg) {
    System.out.println("SMS: " + msg);
  }
}

@Service
public class AlertService {
  private final Sender sender;
  public AlertService(@Sms Sender sender) {
    this.sender = sender;
  }
}`,
    explain: {
      concept: '커스텀 @Qualifier는 이름 문자열 대신 어노테이션 타입으로 빈을 고르는 방법이에요. 오타 없이 컴파일 타임에 확인돼요.',
      terms: [
        { t: '@Qualifier (메타 어노테이션)', d: '새 어노테이션을 Qualifier로 동작하게 만드는 표시' },
        { t: '@Retention(RUNTIME)', d: '어노테이션 정보를 런타임에도 유지해 스프링이 읽을 수 있게 함' },
        { t: '@Sms', d: '직접 만든 Qualifier — 타입 안전하게 SmsSenderImpl을 선택' },
      ],
      why: '문자열 빈 이름에 의존하면 오타가 나도 런타임에 발견돼요. 어노테이션 타입은 컴파일러가 검사해줘요.',
      pitfall: '@Target에 FIELD와 PARAMETER를 모두 포함해야 생성자·필드 주입 양쪽에서 쓸 수 있어요.',
    },
  },
  {
    id: 'sc-profile-active',
    lang: 'java',
    title: 'SpringApplication으로 프로파일 활성화',
    file: 'AppLauncher.java',
    code: `public class AppLauncher {

  public static void main(String[] args) {
    new SpringApplicationBuilder(AppLauncher.class)
        .profiles("dev")
        .run(args);
  }
}`,
    explain: {
      concept: '코드에서 직접 활성 프로파일을 지정할 수 있어요. 보통은 application.properties에서 spring.profiles.active=dev 로 설정하지만, SpringApplicationBuilder를 이용한 프로그래밍 방식도 가능해요.',
      terms: [
        { t: 'SpringApplicationBuilder', d: 'Spring Boot 애플리케이션을 빌더 패턴으로 구성하고 시작하는 클래스' },
        { t: '.profiles("dev")', d: '활성 프로파일을 지정. 기존 프로파일에 덧붙여요.' },
        { t: '.run(args)', d: '설정을 적용하고 애플리케이션을 시작' },
      ],
      why: '환경 변수나 설정 파일 없이 테스트 코드나 도구에서 프로파일을 동적으로 바꾸려고요.',
      pitfall: 'Spring Boot 3.0부터 SpringApplication.setAdditionalProfiles()는 제거됐어요. SpringApplicationBuilder.profiles()를 사용하세요. 완전히 덮어쓰려면 spring.profiles.active 환경 변수를 사용하세요.',
    },
  },
  {
    id: 'sc-after-returning',
    lang: 'java',
    title: '@AfterReturning 반환값 활용',
    file: 'AuditAspect.java',
    code: `@Aspect
@Component
public class AuditAspect {

  @AfterReturning(
    pointcut = "execution(* com.example.service.UserService.find(..))",
    returning = "result"
  )
  public void afterFind(JoinPoint jp, Object result) {
    if (result != null) {
      System.out.println("조회된 사용자: " + result);
    }
  }
}`,
    explain: {
      concept: '@AfterReturning은 메서드가 정상적으로 값을 반환한 뒤에만 실행돼요. 반환값을 파라미터로 받아 검사하거나 기록할 수 있어요.',
      terms: [
        { t: '@AfterReturning', d: '메서드가 예외 없이 정상 반환한 뒤에 실행되는 어드바이스' },
        { t: 'returning = "result"', d: '반환값을 어드바이스 파라미터에 바인딩하는 속성' },
        { t: 'Object result', d: '원래 메서드가 반환한 값을 받는 파라미터' },
      ],
      why: '조회 결과를 로깅하거나 감사 기록을 남길 때 비즈니스 코드를 건드리지 않으려고요.',
      pitfall: 'returning 속성 이름과 파라미터 이름이 정확히 같아야 해요. 다르면 IllegalArgumentException이 발생해요.',
    },
  },
  {
    id: 'sc-ioc-container',
    lang: 'java',
    title: 'ApplicationContext로 빈 직접 조회',
    file: 'ContextDemo.java',
    code: `@Component
public class ContextDemo implements ApplicationContextAware {

  private ApplicationContext ctx;

  @Override
  public void setApplicationContext(ApplicationContext ctx) {
    this.ctx = ctx;
  }

  public void showBeans() {
    EmailValidator validator = ctx.getBean(EmailValidator.class);
    System.out.println("빈 조회: " + validator);
  }
}`,
    explain: {
      concept: 'ApplicationContext는 스프링의 빈 창고예요. 이 창고에서 원하는 빈을 이름이나 타입으로 꺼낼 수 있어요. ApplicationContextAware를 구현하면 스프링이 창고 객체를 자동으로 넘겨줘요.',
      terms: [
        { t: 'ApplicationContext', d: '스프링 빈 컨테이너. 모든 빈의 생성·관리·제공을 담당해요.' },
        { t: 'ApplicationContextAware', d: 'ApplicationContext를 주입받기 위한 인터페이스' },
        { t: 'ctx.getBean(Class)', d: '타입으로 빈을 꺼내는 메서드. 빈이 없으면 예외 발생.' },
      ],
      why: '일부 레거시 코드나 유틸리티 클래스에서 DI를 쓸 수 없을 때 컨텍스트로 직접 빈을 가져오려고요.',
      pitfall: 'getBean을 남용하면 DI의 장점(테스트 용이성·결합도 감소)이 사라져요. 가능하면 생성자 주입을 쓰세요.',
    },
  },
  {
    id: 'sc-bean-lifecycle',
    lang: 'java',
    title: '빈 생명주기 콜백',
    file: 'ConnectionPool.java',
    code: `@Component
public class ConnectionPool {

  @PostConstruct
  public void init() {
    System.out.println("커넥션 풀 초기화");
  }

  @PreDestroy
  public void close() {
    System.out.println("커넥션 풀 종료");
  }
}`,
    explain: {
      concept: '@PostConstruct는 빈이 만들어진 직후, @PreDestroy는 빈이 사라지기 직전에 자동으로 호출되는 메서드예요. 자원을 열고 닫는 타이밍을 스프링에 맡길 수 있어요.',
      terms: [
        { t: '@PostConstruct', d: '빈 생성 및 의존성 주입 완료 직후에 한 번 실행되는 초기화 메서드' },
        { t: '@PreDestroy', d: '스프링 컨테이너가 빈을 제거하기 직전에 실행되는 정리 메서드' },
        { t: '생명주기', d: '빈이 생성(new)→초기화→사용→소멸되는 전 과정' },
      ],
      why: 'DB 커넥션·파일 핸들 등 자원을 생성 시 열고 종료 시 반드시 닫으려고요.',
      pitfall: 'prototype 스코프 빈은 @PreDestroy가 호출되지 않아요. 직접 close()를 관리해야 해요.',
    },
  },
];
