import type { Snippet } from '../../types';

export const testing: Snippet[] = [
  {
    id: 'test-junit-basic',
    lang: 'java',
    title: 'JUnit5 기본 테스트',
    file: 'CalculatorTest.java',
    code: `class CalculatorTest {
  @Test
  void shouldAddTwoNumbers() {
    Calculator calc = new Calculator();
    int result = calc.add(2, 3);
    assertThat(result).isEqualTo(5);
  }
}`,
    explain: {
      concept: 'JUnit5는 자바 테스트 도구예요. @Test를 붙인 메서드가 하나의 테스트 케이스가 돼요.',
      terms: [
        { t: '@Test', d: '테스트 메서드 표시' },
        { t: 'Calculator', d: '테스트 대상 클래스' },
        { t: 'assertThat', d: 'AssertJ의 검증 도구' },
        { t: 'isEqualTo', d: '같은지 검증' },
      ],
      why: '코드가 의도대로 동작하는지 자동으로 확인하려고요.',
      pitfall: '메서드가 private이면 실행되지 않아요. package-private 이상으로 두세요.',
    },
  },
  {
    id: 'test-before-each',
    lang: 'java',
    title: '@BeforeEach로 사전 준비',
    file: 'UserServiceTest.java',
    code: `class UserServiceTest {
  private UserService service;

  @BeforeEach
  void setUp() {
    service = new UserService();
  }

  @Test
  void shouldCreateUser() {
    assertThat(service.create("kim")).isNotNull();
  }
}`,
    explain: {
      concept: '@BeforeEach는 매 테스트 시작 전에 실행되는 준비 단계예요. 테스트마다 새 객체를 만들어 독립시켜요.',
      terms: [
        { t: '@BeforeEach', d: '각 테스트 전 실행' },
        { t: 'setUp', d: '준비 메서드 이름(관례)' },
        { t: 'new UserService', d: '매번 새 객체 생성' },
        { t: 'isNotNull', d: 'null이 아님을 검증' },
      ],
      why: '테스트 간 상태 공유로 인한 오염을 막으려고요.',
      pitfall: 'static 필드에 상태를 두면 테스트 순서에 영향을 받아요.',
    },
  },
  {
    id: 'test-assertj-chain',
    lang: 'java',
    title: 'AssertJ 체인 검증',
    file: 'UserTest.java',
    code: `@Test
void shouldHaveValidFields() {
  User user = new User("kim", 25);
  assertThat(user)
    .isNotNull()
    .extracting(User::name, User::age)
    .containsExactly("kim", 25);
}`,
    explain: {
      concept: 'AssertJ는 검증을 사슬처럼 이어 쓸 수 있어요. 읽기 쉽고 실패 메시지도 친절해요.',
      terms: [
        { t: 'assertThat', d: 'AssertJ 시작' },
        { t: 'isNotNull', d: 'null 아님 검증' },
        { t: 'extracting', d: '특정 필드만 추출' },
        { t: 'containsExactly', d: '순서대로 정확히 포함' },
        { t: 'User::name', d: '메서드 참조로 필드 가리킴' },
      ],
      why: '복잡한 검증을 읽기 좋게 작성하려고요.',
      pitfall: 'extracting 순서와 containsExactly 순서가 같아야 해요.',
    },
  },
  {
    id: 'test-mockito-mock',
    lang: 'java',
    title: 'Mockito @Mock',
    file: 'OrderServiceTest.java',
    code: `@ExtendWith(MockitoExtension.class)
class OrderServiceTest {
  @Mock
  OrderRepository repo;
  @InjectMocks
  OrderService service;

  @Test
  void shouldReturnOrder() {
    when(repo.findById(1L)).thenReturn(Optional.of(new Order(1L)));
    assertThat(service.find(1L)).isPresent();
  }
}`,
    explain: {
      concept: '@Mock은 가짜 객체를 만드는 도구예요. 진짜 DB 없이도 테스트할 수 있게 해줘요. @InjectMocks로 가짜를 주입해요.',
      terms: [
        { t: '@ExtendWith', d: '테스트 확장 선언' },
        { t: '@Mock', d: '가짜 객체 생성' },
        { t: '@InjectMocks', d: '가짜 객체를 주입받는 대상' },
        { t: 'when', d: '특정 호출 시 동작 정의' },
        { t: 'thenReturn', d: '반환값 지정' },
      ],
      why: '의존성 없이 단위 테스트를 빠르게 하려고요.',
      pitfall: 'lenient 모드가 아니면 unused stub이 경고돼요.',
    },
  },
  {
    id: 'test-mockito-verify',
    lang: 'java',
    title: 'Mockito verify 검증',
    file: 'EmailServiceTest.java',
    code: `@ExtendWith(MockitoExtension.class)
class EmailServiceTest {
  @Mock
  MailSender sender;
  @InjectMocks
  EmailService service;

  @Test
  void shouldSendEmailOnce() {
    service.welcome("kim");
    verify(sender).send("kim", "환영해요");
  }
}`,
    explain: {
      concept: 'verify는 "이 메서드가 이 인자로 호출됐는가?"를 검사해요. 호출 자체를 확인하는 도구예요.',
      terms: [
        { t: 'verify', d: '호출 여부 검증' },
        { t: 'send', d: '검증 대상 메서드' },
        { t: '@Mock', d: '가짜 객체' },
        { t: 'welcome', d: '테스트가 호출한 메서드' },
      ],
      why: '결과뿐 아니라 행위(어떻게 호출했는지)를 검증하려고요.',
      pitfall: '인자가 다르면 호출로 인정 안 돼요. ArgumentCaptor를 쓰면 유연해요.',
    },
  },
  {
    id: 'test-spring-boot-test',
    lang: 'java',
    title: '@SpringBootTest 통합 테스트',
    file: 'ApplicationIntegrationTest.java',
    code: `@SpringBootTest
class ApplicationIntegrationTest {
  @Autowired
  UserService userService;

  @Test
  void contextLoads() {
    assertThat(userService).isNotNull();
  }
}`,
    explain: {
      concept: '@SpringBootTest는 실제 스프링 컨텍스트를 띄워 통째로 검사하는 거예요. 모든 빈이 잘 연결되는지 확인해요.',
      terms: [
        { t: '@SpringBootTest', d: '통합 테스트 선언' },
        { t: '@Autowired', d: '스프링이 빈 주입' },
        { t: 'contextLoads', d: '컨텍스트 로딩 검사 (관례 이름)' },
      ],
      why: '전체 앱이 조립되어 동작하는지 검증하려고요.',
      pitfall: '실행이 느려요. 단위 테스트와 분리해 관리하세요.',
    },
  },
  {
    id: 'test-web-mvc-test',
    lang: 'java',
    title: '@WebMvcTest 슬라이스 테스트',
    file: 'UserControllerTest.java',
    code: `@WebMvcTest(UserController.class)
class UserControllerTest {
  @Autowired
  MockMvc mockMvc;
  @MockBean
  UserService userService;

  @Test
  void shouldReturnUser() throws Exception {
    mockMvc.perform(get("/users/1"))
      .andExpect(status().isOk());
  }
}`,
    explain: {
      concept: '@WebMvcTest는 웹 계층만 검사하는 거예요. MockMvc로 가상 HTTP 요청을 보내 응답을 확인해요.',
      terms: [
        { t: '@WebMvcTest', d: '웹 계층만 로드' },
        { t: 'MockMvc', d: '가짜 HTTP 클라이언트' },
        { t: '@MockBean', d: '서비스 빈을 가짜로 대체' },
        { t: 'perform(get)', d: 'GET 요청 수행' },
        { t: 'andExpect', d: '응답 검증' },
        { t: 'status().isOk', d: '200 OK 검증' },
      ],
      why: '컨트롤러 매핑과 응답을 빠르게 검증하려고요.',
      pitfall: '서비스 계층은 로드되지 않아요. @MockBean으로 의존성을 반드시 채워야 컨텍스트가 정상 기동돼요.',
    },
  },
  {
    id: 'test-data-jpa-test',
    lang: 'java',
    title: '@DataJpaTest',
    file: 'UserRepositoryTest.java',
    code: `@DataJpaTest
class UserRepositoryTest {
  @Autowired
  UserRepository repo;

  @Test
  void shouldSaveAndFind() {
    User u = repo.save(new User("kim"));
    assertThat(repo.findById(u.id())).isPresent();
  }
}`,
    explain: {
      concept: '@DataJpaTest는 JPA 계층만 검사해요. 실제 DB 대신 인메모리 DB를 써서 빠르게 돌아가요.',
      terms: [
        { t: '@DataJpaTest', d: 'JPA 슬라이스 테스트' },
        { t: 'UserRepository', d: '테스트 대상 리포지토리' },
        { t: 'save', d: '엔티티 저장' },
        { t: 'findById', d: 'ID로 조회' },
        { t: 'isPresent', d: '값이 있음 검증' },
      ],
      why: '쿼리와 매핑이 제대로 동작하는지 확인하려고요.',
      pitfall: '기본 트랜잭션이 롤백돼요. @Rollback(false)로 바꿀 수 있어요.',
    },
  },
  {
    id: 'test-testcontainers',
    lang: 'java',
    title: 'Testcontainers PostgreSQL',
    file: 'ContainerTest.java',
    code: `@SpringBootTest
@Testcontainers
class ContainerTest {
  @Container
  static PostgreSQLContainer<?> postgres = new PostgreSQLContainer<>("postgres:16");

  @DynamicPropertySource
  static void props(DynamicPropertyRegistry r) {
    r.add("spring.datasource.url", postgres::getJdbcUrl);
  }

  @Test
  void containerIsRunning() {
    assertThat(postgres.isRunning()).isTrue();
  }
}`,
    explain: {
      concept: 'Testcontainers는 도커로 진짜 DB를 띄워 테스트하는 도구예요. 인메모리 DB와 달리 실제 환경과 비슷해요.',
      terms: [
        { t: '@Testcontainers', d: '컨테이너 테스트 활성화' },
        { t: '@Container', d: '컨테이너 선언' },
        { t: 'PostgreSQLContainer', d: 'PostgreSQL 도커 컨테이너' },
        { t: '@DynamicPropertySource', d: '런타임 프로퍼티 주입' },
        { t: 'DynamicPropertyRegistry', d: '프로퍼티 등록기' },
        { t: 'isRunning', d: '컨테이너 기동 여부 확인' },
      ],
      why: '실제 DB와 동일한 환경에서 테스트하려고요.',
      pitfall: '도커가 설치돼 있어야 해요. CI 환경 설정을 확인하세요.',
    },
  },
  {
    id: 'test-mock-bean',
    lang: 'java',
    title: '@MockBean으로 서비스 교체',
    file: 'UserControllerTest.java',
    code: `@WebMvcTest(UserController.class)
class UserControllerTest {
  @Autowired
  MockMvc mockMvc;
  @MockBean
  UserService userService;

  @Test
  void shouldReturnUser() throws Exception {
    when(userService.find(1L)).thenReturn(new User(1L, "kim"));
    mockMvc.perform(get("/users/1"))
      .andExpect(jsonPath("$.name").value("kim"));
  }
}`,
    explain: {
      concept: '@MockBean은 스프링 컨텍스트 안의 빈을 가짜로 바꿔요. 컨트롤러 테스트에서 서비스를 가짜로 둘 수 있어요.',
      terms: [
        { t: '@MockBean', d: '스프링 빈을 가짜로 교체' },
        { t: 'when', d: '가짜 동작 정의' },
        { t: 'jsonPath', d: 'JSON 응답 필드 검증' },
        { t: 'value', d: '예상 값' },
      ],
      why: '컨트롤러만 검사하고 서비스는 가짜로 두려고요.',
      pitfall: '@MockBean은 컨텍스트를 다시 로드해요. 남용하면 느려요.',
    },
  },
  {
    id: 'test-parameterized',
    lang: 'java',
    title: '@ParameterizedTest',
    file: 'CalculatorTest.java',
    code: `@ParameterizedTest
@ValueSource(ints = {1, 2, 3, 4})
void shouldSquare(int n) {
  Calculator calc = new Calculator();
  assertThat(calc.square(n)).isEqualTo(n * n);
}`,
    explain: {
      concept: '@ParameterizedTest는 같은 테스트를 여러 값으로 반복해요. 한 번 작성으로 4가지 입력을 검사해요.',
      terms: [
        { t: '@ParameterizedTest', d: '매개변수 기반 반복 테스트' },
        { t: '@ValueSource', d: '입력 값 목록' },
        { t: 'ints', d: '정수 배열' },
        { t: 'square', d: '제곱 메서드' },
      ],
      why: '여러 케이스를 간결하게 작성하려고요.',
      pitfall: '매개변수 타입과 값 타입이 같아야 해요.',
    },
  },
  {
    id: 'test-display-name',
    lang: 'java',
    title: '@DisplayName',
    file: 'UserValidatorTest.java',
    code: `@DisplayName("사용자 검증기 테스트")
class UserValidatorTest {
  @Test
  @DisplayName("이름이 비어있으면 예외를 던진다")
  void shouldThrowWhenNameEmpty() {
    assertThatThrownBy(() -> new User(""))
      .isInstanceOf(IllegalArgumentException.class);
  }
}`,
    explain: {
      concept: '@DisplayName은 테스트에 사람이 읽기 좋은 이름을 붙여요. 테스트 결과 보고서가 친절해져요.',
      terms: [
        { t: '@DisplayName', d: '테스트 이름 지정' },
        { t: 'assertThatThrownBy', d: '예외 발생 검증' },
        { t: 'isInstanceOf', d: '예외 타입 검증' },
      ],
      why: '테스트 의도를 명확히 전달하려고요.',
      pitfall: '한국어 이름은 인코딩 문제가 생길 수 있어요. UTF-8을 확인하세요.',
    },
  },
  {
    id: 'test-nested',
    lang: 'java',
    title: '@Nested 중첩 테스트',
    file: 'StackTest.java',
    code: `class StackTest {
  @Nested
  @DisplayName("비어있을 때")
  class WhenEmpty {
    @Test
    void shouldThrowOnPop() {
      assertThatThrownBy(() -> new Stack<>().pop())
        .isInstanceOf(EmptyStackException.class);
    }
  }
}`,
    explain: {
      concept: '@Nested는 관련 테스트를 그룹으로 묶어요. 상황별로 테스트를 정리하면 읽기 좋아요.',
      terms: [
        { t: '@Nested', d: '중첩 테스트 클래스' },
        { t: '@DisplayName', d: '그룹 이름' },
        { t: 'assertThatThrownBy', d: '예외 검증' },
        { t: 'EmptyStackException', d: '빈 스택 예외' },
      ],
      why: '상황별로 테스트를 정리해 가독성을 높이려고요.',
      pitfall: '중첩 클래스는 static이 아니어야 해요.',
    },
  },
  {
    id: 'test-mockito-argument-captor',
    lang: 'java',
    title: 'ArgumentCaptor',
    file: 'OrderServiceTest.java',
    code: `@ExtendWith(MockitoExtension.class)
class OrderServiceTest {
  @Mock
  OrderRepo repo;
  @InjectMocks
  OrderService service;

  @Test
  void shouldPersistOrder() {
    service.create("kim", 1000);
    ArgumentCaptor<Order> captor = ArgumentCaptor.forClass(Order.class);
    verify(repo).save(captor.capture());
    assertThat(captor.getValue().buyer()).isEqualTo("kim");
  }
}`,
    explain: {
      concept: 'ArgumentCaptor는 호출 시 넘긴 인자를 잡아두는 도구예요. 저장된 인자의 값을 나중에 검사할 수 있어요.',
      terms: [
        { t: 'ArgumentCaptor', d: '인자 캡처 도구' },
        { t: 'forClass', d: '캡처할 타입 지정' },
        { t: 'capture', d: '호출 인자 잡기' },
        { t: 'getValue', d: '잡은 인자 꺼내기' },
      ],
      why: '정확히 어떤 인자로 호출했는지 검증하려고요.',
      pitfall: 'verify 없이 capture만 부르면 아무것도 잡히지 않아요.',
    },
  },
  {
    id: 'test-mockito-throw',
    lang: 'java',
    title: 'Mockito 예외 던지기',
    file: 'PaymentServiceTest.java',
    code: `@ExtendWith(MockitoExtension.class)
class PaymentServiceTest {
  @Mock
  PaymentGateway gateway;
  @InjectMocks
  PaymentService service;

  @Test
  void shouldHandleGatewayError() {
    when(gateway.charge(any())).thenThrow(new RuntimeException("결제 실패"));
    assertThatThrownBy(() -> service.pay(1000))
      .hasMessageContaining("결제 실패");
  }
}`,
    explain: {
      concept: 'thenThrow는 가짜 객체가 예외를 던지게 해요. 에러 상황을 흉내 내 대상 코드가 어떻게 반응하는지 봐요.',
      terms: [
        { t: 'thenThrow', d: '예외 던지도록 설정' },
        { t: 'any()', d: '임의의 인자 매칭' },
        { t: 'hasMessageContaining', d: '예외 메시지 부분 일치 검증' },
        { t: '@InjectMocks', d: '가짜 주입 대상' },
      ],
      why: '예외 상황에서의 동작을 검증하려고요.',
      pitfall: 'checked 예외는 메서드 시그니처에 선언돼야 던질 수 있어요.',
    },
  },
  {
    id: 'test-mock-mvc-json',
    lang: 'java',
    title: 'MockMvc JSON POST',
    file: 'UserControllerTest.java',
    code: `@WebMvcTest(UserController.class)
class UserControllerTest {
  @Autowired
  MockMvc mockMvc;
  @MockBean
  UserService userService;

  @Test
  void shouldCreateUser() throws Exception {
    mockMvc.perform(post("/users")
        .contentType(MediaType.APPLICATION_JSON)
        .content("{\"name\":\"kim\"}"))
      .andExpect(status().isCreated());
  }
}`,
    explain: {
      concept: 'MockMvc로 POST 요청을 보내요. JSON 본문을 같이 실어서 컨트롤러가 잘 받는지 검사해요.',
      terms: [
        { t: 'post', d: 'POST 요청 생성' },
        { t: 'contentType', d: 'Content-Type 헤더' },
        { t: 'MediaType.APPLICATION_JSON', d: 'JSON 타입' },
        { t: 'content', d: '요청 본문' },
        { t: 'isCreated', d: '201 응답 검증' },
      ],
      why: 'POST/PUT 같은 쓰기 작업을 검증하려고요.',
      pitfall: '본문 JSON이 잘못되면 400이 떠요. @Valid 오류를 확인하세요.',
    },
  },
  {
    id: 'test-test-instance',
    lang: 'java',
    title: '@TestInstance',
    file: 'SharedStateTest.java',
    code: `@TestInstance(TestInstance.Lifecycle.PER_CLASS)
class SharedStateTest {
  private int counter = 0;

  @Test
  void first() { counter++; }
  @Test
  void second() { assertThat(counter).isLessThan(100); }
}`,
    explain: {
      concept: '@TestInstance(PER_CLASS)는 테스트 인스턴스를 하나만 만들어요. 인스턴스 필드를 테스트 간 공유해요.',
      terms: [
        { t: '@TestInstance', d: '인스턴스 생명주기 지정' },
        { t: 'PER_CLASS', d: '클래스당 1개 인스턴스' },
        { t: 'counter', d: '공유되는 필드' },
      ],
      why: '무거운 사전 작업을 한 번만 하려고요.',
      pitfall: '테스트 순서 의존이 생기기 쉬워요. @TestMethodOrder와 함께 쓰세요.',
    },
  },
  {
    id: 'test-disabled',
    lang: 'java',
    title: '@Disabled로 테스트 건너뛰기',
    file: 'FlakyTest.java',
    code: `@ExtendWith(MockitoExtension.class)
class FlakyTest {
  @Mock
  ExternalApi externalApi;

  @Disabled("외부 API가 안정될 때까지")
  @Test
  void shouldCallExternalApi() {
    assertThat(externalApi.status()).isEqualTo("OK");
  }
}`,
    explain: {
      concept: '@Disabled는 테스트를 잠시 쉬게 해요. 이유를 적어두면 나중에 알아보기 쉬워요.',
      terms: [
        { t: '@Disabled', d: '테스트 비활성화' },
        { t: '@Test', d: '테스트 메서드' },
        { t: 'status', d: '외부 API 상태 메서드' },
      ],
      why: '일시적으로 깨지는 테스트를 건너뛰려고요.',
      pitfall: '장기 방치하면 잊혀요. 정기적으로 검토하세요.',
    },
  },
  {
    id: 'test-assert-all',
    lang: 'java',
    title: 'AssertJ SoftAssertions',
    file: 'UserValidationTest.java',
    code: `@Test
void shouldValidateAllFields() {
  User user = new User("kim", 25);
  SoftAssertions.assertSoftly(soft -> {
    soft.assertThat(user.name()).isEqualTo("kim");
    soft.assertThat(user.age()).isEqualTo(25);
    soft.assertThat(user.isActive()).isTrue();
  });
}`,
    explain: {
      concept: 'assertSoftly는 여러 검증을 한 번에 묶어요. 하나가 실패해도 나머지도 다 검사해서 한눈에 봐요.',
      terms: [
        { t: 'SoftAssertions', d: '부드러운 단언 모음' },
        { t: 'assertSoftly', d: '여러 검증을 한 번에' },
        { t: 'soft.assertThat', d: '개별 검증' },
        { t: 'isTrue', d: '참임을 검증' },
      ],
      why: '한 테스트에서 모든 실패 지점을 보려고요.',
      pitfall: '일반 assertThat 체인은 첫 실패에서 멈춰요.',
    },
  },
  {
    id: 'test-transactional-rollback',
    lang: 'java',
    title: '테스트 트랜잭션 롤백',
    file: 'TransactionalTest.java',
    code: `@SpringBootTest
class TransactionalTest {
  @Autowired
  UserRepository repo;

  @Test
  @Transactional
  void shouldInsertThenRollback() {
    repo.save(new User("temp"));
    assertThat(repo.count()).isGreaterThan(0);
  }
}`,
    explain: {
      concept: '@Transactional을 테스트에 붙이면 메서드 끝에서 자동 롤백돼요. 테스트 데이터가 DB에 남지 않아요.',
      terms: [
        { t: '@Transactional', d: '트랜잭션 경계' },
        { t: 'save', d: '엔티티 저장' },
        { t: 'count', d: '전체 개수 조회' },
        { t: 'isGreaterThan', d: '이 값보다 큰지 검증' },
      ],
      why: '테스트 데이터가 다른 테스트를 오염시키지 않게 하려고요.',
      pitfall: '롤백 안 하려면 @Rollback(false) 또는 @Commit을 붙이세요.',
    },
  },
];
