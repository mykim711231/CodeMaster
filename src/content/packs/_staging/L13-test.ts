import type { Snippet } from '../../types';

export const testing: Snippet[] = [
  {
    id: 'test-junit-basic',
    lang: 'java',
    title: 'JUnit5 기본 테스트',
    file: 'CalculatorTest.java',
    code: `import org.junit.jupiter.api.Test;

import static org.assertj.core.api.Assertions.assertThat;

class CalculatorTest {
  @Test
  void shouldAddTwoNumbers() {
    System.out.println("[실행] 계산기 add() 테스트 시작");
    Calculator calc = new Calculator();
    int result = calc.add(2, 3);
    assertThat(result).isEqualTo(5);
    System.out.println("[결과] add(2, 3) = " + result + " - 검증 통과");
  }
}`,
    explain: {
      concept:
        'JUnit5는 자바에서 가장 널리 쓰이는 테스트 프레임워크예요. ' +
        '@Test만 메서드에 붙이면 그 메서드가 하나의 테스트 케이스로 실행돼요. ' +
        '이 코드는 Calculator의 add() 메서드에 2와 3을 전달했을 때 결과가 5인지를 검증하고 있어요. ' +
        'AssertJ의 assertThat으로 시작해서 .isEqualTo()까지 체이닝하는 검증 방식은 읽기 쉽고, 실패했을 때 "expected 5 but was 6"처럼 친절한 메시지를 보여줘요. ' +
        'JUnit5는 클래스와 메서드에 public을 생략할 수 있어서 코드가 더 깔끔해진 것도 큰 장점이에요.',
      terms: [
        { t: '@Test', d: 'JUnit에게 "이 메서드는 테스트예요"라고 알려줘요. 없으면 일반 메서드로 취급돼 실행되지 않아요.' },
        { t: 'void', d: '테스트 메서드는 값을 반환하지 않아요. 검증은 assertThat 같은 단언(assertion)으로 해요.' },
        { t: 'assertThat(result)', d: 'AssertJ의 검증 시작점이에요. 이 뒤에 .isEqualTo() 등으로 검증 조건을 연결해요.' },
        { t: 'isEqualTo(5)', d: '결과가 5와 같은지 검증해요. 다르면 AssertionError로 테스트가 실패해요.' },
        { t: 'shouldAddTwoNumbers', d: '메서드 이름이 곧 테스트 설명이에요. should로 시작해서 "무엇을 해야 한다"를 표현하는 게 관례예요.' },
      ],
      expectedOutput:
        '테스트 실행 시 콘솔:\n' +
        '[실행] 계산기 add() 테스트 시작\n' +
        '[결과] add(2, 3) = 5 - 검증 통과\n' +
        '\nBUILD SUCCESSFUL',
      realWorldUsage:
        '실제 프로젝트에서 CI/CD 파이프라인이 코드를 푸시할 때마다 모든 @Test를 자동 실행해요. GitHub Actions나 Jenkins가 ./gradlew test를 실행하고, 하나라도 실패하면 빨간 불이 들어와서 머지를 막아줘요. 이 덕분에 "내 코드가 다른 기능을 망가뜨리진 않았나"를 자동으로 확인할 수 있어요.',
      why: '코드 변경이 기존 기능을 망가뜨리지 않았는지 자동으로 검증하려고요. 사람이 일일이 확인하는 건 실수하기 쉽고 시간도 많이 걸려요.',
      pitfall: '테스트 메서드가 private이면 JUnit이 리플렉션으로도 실행할 수 없어요. 테스트 메서드는 package-private(접근자 생략) 또는 public으로 선언해야 해요.',
    },
  },
  {
    id: 'test-before-each',
    lang: 'java',
    title: '@BeforeEach로 사전 준비',
    file: 'UserServiceTest.java',
    code: `import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import static org.assertj.core.api.Assertions.assertThat;

class UserServiceTest {
  private UserService service;

  @BeforeEach
  void setUp() {
    System.out.println("[준비] UserService 새 인스턴스 생성");
    service = new UserService();
  }

  @Test
  void shouldCreateUser() {
    System.out.println("[실행] create() 테스트");
    User result = service.create("kim");
    assertThat(result).isNotNull();
    System.out.println("[결과] 생성된 사용자: " + result + " - not null 검증 통과");
  }
}`,
    explain: {
      concept:
        '@BeforeEach는 매 테스트 메서드가 실행되기 직전에 호출되는 준비 단계예요. ' +
        '모든 테스트는 서로 독립적이어야 한다는 게 JUnit의 핵심 철학이에요 - test A의 결과가 test B에 영향을 주면 안 돼요. ' +
        '이 코드에서는 매 테스트마다 새 UserService 인스턴스를 만들어서, 이전 테스트에서 객체 상태가 오염되는 걸 방지하고 있어요. ' +
        'setUp()이라는 이름은 관례일 뿐이고, 메서드 이름은 무엇이든 상관없어요.',
      terms: [
        { t: '@BeforeEach', d: '각 @Test 메서드 실행 직전에 한 번씩 호출돼요. 테스트 준비 코드를 모아두는 곳이에요.' },
        { t: 'setUp()', d: '준비 메서드의 관례적 이름이에요. 데이터 초기화·객체 생성 등 반복되는 준비 코드를 넣어요.' },
        { t: 'new UserService()', d: '매번 새 객체를 생성해서 테스트 간 독립성을 보장해요. static 필드와 달리 테스트 순서에 영향받지 않아요.' },
        { t: 'isNotNull()', d: '결과가 null이 아님을 검증해요. create()가 정상적으로 객체를 반환했는지 확인하는 기본 검사예요.' },
      ],
      expectedOutput:
        '[준비] UserService 새 인스턴스 생성\n' +
        '[실행] create() 테스트\n' +
        '[결과] 생성된 사용자: User[name=kim] - not null 검증 통과',
      realWorldUsage:
        '실제 프로젝트에서 서비스 테스트를 작성할 때 @BeforeEach로 Mockito 가짜 객체들을 초기화하고 테스트 대상 객체에 주입해요. @BeforeEach가 매 테스트마다 실행되므로, 한 테스트에서 가짜 객체의 동작(when)을 다르게 정의해도 다른 테스트에 영향이 없어요. 이게 테스트 독립성의 핵심이에요.',
      why: '모든 테스트가 동일한 초기 상태에서 시작하게 해서, 테스트 간 순서 의존성과 상태 오염을 제거하려고요.',
      pitfall: '@BeforeEach는 인스턴스 메서드에만 적용돼요. static 메서드에 붙이면 실행되지 않아요. 모든 테스트 전에 한 번만 실행하려면 @BeforeAll을 쓰세요.',
    },
  },
  {
    id: 'test-assertj-chain',
    lang: 'java',
    title: 'AssertJ 체인 검증',
    file: 'UserTest.java',
    code: `import org.junit.jupiter.api.Test;

import static org.assertj.core.api.Assertions.assertThat;

class UserTest {
  @Test
  void shouldHaveValidFields() {
    System.out.println("[실행] User 필드 검증 테스트");
    User user = new User("kim", 25);
    assertThat(user)
      .isNotNull()
      .extracting(User::name, User::age)
      .containsExactly("kim", 25);
    System.out.println("[결과] name=kim, age=25 - 모든 필드 검증 통과");
  }
}`,
    explain: {
      concept:
        'AssertJ는 검증을 읽기 쉬운 문장처럼 이어 쓸 수 있는 검증 라이브러리예요. ' +
        'assertThat(user).isNotNull().extracting(...).containsExactly(...) 같은 체인은 왼쪽에서 오른쪽으로 자연스럽게 읽혀요. ' +
        'extracting은 객체에서 특정 필드만 뽑아내는 기능으로, User::name과 User::age라는 메서드 참조로 깔끔하게 필드를 지정하고 있어요. ' +
        'containsExactly는 "순서까지 정확히 이 값들이어야 한다"는 엄격한 검증이에요. 순서가 달라도 괜찮다면 containsExactlyInAnyOrder를 써요.',
      terms: [
        { t: 'assertThat(user)', d: '검증할 대상을 지정하는 AssertJ의 시작 메서드예요. 모든 검증 체인은 여기서 출발해요.' },
        { t: 'extracting(User::name, User::age)', d: '객체에서 name과 age 필드 값을 추출해서 Tuple로 만들어요. 여러 필드를 한 번에 검증할 때 써요.' },
        { t: 'containsExactly("kim", 25)', d: '추출된 값들이 순서대로 정확히 일치하는지 검증해요. ["kim", 25]와 정확히 같아야 통과예요.' },
        { t: 'User::name', d: '메서드 참조 표현식이에요. user.getName()을 호출하는 것과 동일한 의미예요.' },
      ],
      expectedOutput:
        '[실행] User 필드 검증 테스트\n' +
        '[결과] name=kim, age=25 - 모든 필드 검증 통과',
      realWorldUsage:
        '실제 프로젝트에서 DTO 매핑 테스트를 작성할 때 AssertJ 체인을 애용해요. API 응답 DTO의 모든 필드가 제대로 변환됐는지 extracting으로 한 번에 검증할 수 있어서, 필드가 10개인 DTO도 3줄로 깔끔하게 검증할 수 있어요. JUnit의 assertEquals를 필드마다 10번 호출하는 것보다 훨씬 가독성이 좋아요.',
      why: '복잡한 객체의 필드 검증을 읽기 좋고 간결하게 작성해서, 테스트 의도를 명확히 전달하려고요.',
      pitfall: 'extracting의 필드 순서와 containsExactly의 값 순서가 일치해야 해요. 순서가 틀리면 "expected "kim" but was 25" 같은 혼란스러운 메시지가 나와요.',
    },
  },
  {
    id: 'test-mockito-mock',
    lang: 'java',
    title: 'Mockito @Mock',
    file: 'OrderServiceTest.java',
    code: `import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class OrderServiceTest {
  @Mock
  OrderRepository repo;
  @InjectMocks
  OrderService service;

  @Test
  void shouldReturnOrder() {
    System.out.println("[실행] 주문 조회 Mock 테스트");
    when(repo.findById(1L)).thenReturn(Optional.of(new Order(1L)));
    Optional<Order> result = service.find(1L);
    assertThat(result).isPresent();
    System.out.println("[결과] repo.findById(1L) Mock 동작 - 가짜 주문 반환됨");
  }
}`,
    explain: {
      concept:
        'Mockito는 진짜 의존성 대신 가짜 객체(Mock)를 만들어서 테스트하는 도구예요. ' +
        '@Mock은 "이 객체는 진짜가 아니라 가짜예요"라고 표시하고, @InjectMocks는 "이 객체에 가짜들을 주입해 주세요"라는 표시예요. ' +
        '진짜 DB가 없어도, OrderRepository가 어떻게 동작할지 when-thenReturn으로 미리 약속해두면 서비스 로직만 깔끔하게 검증할 수 있어요. ' +
        '이 방식의 가장 큰 장점은 DB·외부 API·파일 시스템 같은 느리고 불안정한 의존성 없이 몇 ms 만에 테스트가 완료된다는 점이에요.',
      terms: [
        { t: '@ExtendWith(MockitoExtension)', d: 'Mockito를 JUnit5에서 쓸 수 있게 연결해줘요. @Mock·@InjectMocks를 처리해요.' },
        { t: '@Mock', d: '진짜 객체 대신 가짜(Mock)를 만들어줘요. 메서드 호출은 실제로 실행되지 않고 기본값(null, 0, false)을 반환해요.' },
        { t: '@InjectMocks', d: '@Mock으로 만든 가짜 객체들을 실제 객체에 주입해줘요. 생성자 주입·setter 주입을 자동으로 찾아 넣어줘요.' },
        { t: 'when(repo.findById(1L)).thenReturn(...)', d: '가짜 객체가 특정 인자로 호출됐을 때 반환할 값을 미리 약속해요. 스터빙(stubbing)이라고 해요.' },
        { t: 'isPresent()', d: 'Optional에 값이 들어있는지 검증해요. 값이 있으면 true를 반환해요.' },
      ],
      expectedOutput:
        '[실행] 주문 조회 Mock 테스트\n' +
        '[결과] repo.findById(1L) Mock 동작 - 가짜 주문 반환됨',
      realWorldUsage:
        '실제 프로젝트에서 서비스 레이어의 단위 테스트를 작성할 때 모든 의존성을 Mock으로 대체해요. UserService가 UserRepository, PasswordEncoder, MailSender에 의존한다면 세 개 모두 @Mock으로 만들고, 오직 UserService의 비즈니스 로직만 검증해요. CI에서 300개 테스트가 3초 안에 완료되는 건 이 Mock 테스트 덕분이에요.',
      why: 'DB·외부 API 등 느리고 불안정한 의존성을 제거해서, 빠르고 안정적인 단위 테스트를 작성하려고요.',
      pitfall: 'Mockito의 strict 모드(JUnit5 기본)에서는 when으로 정의했지만 실제로 호출되지 않은 스터빙이 있으면 UnnecessaryStubbingException이 발생해요. 필요 없는 스터빙은 제거하거나 lenient() 모드로 전환하세요.',
    },
  },
  {
    id: 'test-mockito-verify',
    lang: 'java',
    title: 'Mockito verify 검증',
    file: 'EmailServiceTest.java',
    code: `import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import static org.mockito.Mockito.verify;

@ExtendWith(MockitoExtension.class)
class EmailServiceTest {
  @Mock
  MailSender sender;
  @InjectMocks
  EmailService service;

  @Test
  void shouldSendEmailOnce() {
    System.out.println("[실행] 이메일 전송 검증 테스트");
    service.welcome("kim");
    verify(sender).send("kim", "환영해요");
    System.out.println("[결과] sender.send(kim, 환영해요) 호출 확인됨 - 검증 통과");
  }
}`,
    explain: {
      concept:
        'verify는 "이 메서드가 이 인자로 실제로 호출됐는가?"를 확인하는 Mockito의 행위 검증 도구예요. ' +
        'assertThat이 결과(값)를 검증한다면, verify는 과정(호출 여부)을 검증해요. ' +
        '여기서는 service.welcome("kim")을 호출했을 때, 내부적으로 sender.send("kim", "환영해요")가 정확히 한 번 호출됐는지 확인하고 있어요. ' +
        '값을 반환하지 않는 void 메서드는 assertThat으로 검증할 수 없기 때문에, verify가 유일한 검증 방법이에요.',
      terms: [
        { t: 'verify(sender)', d: 'Mock 객체 sender의 메서드 호출 이력을 확인해요. 특정 메서드가 호출됐는지 검증할 수 있어요.' },
        { t: 'verify(sender).send(...)', d: 'sender의 send() 메서드가 지정된 인자로 호출됐는지 검증해요. 인자가 하나라도 다르면 실패해요.' },
        { t: 'welcome("kim")', d: '테스트 대상 메서드예요. 이 메서드 내부에서 sender.send()를 호출할 것으로 기대하고 있어요.' },
        { t: 'MailSender (Mock)', d: '실제로 이메일을 보내지 않는 가짜 객체예요. 실제 발송을 막으면서 호출 여부만 확인해요.' },
      ],
      expectedOutput:
        '[실행] 이메일 전송 검증 테스트\n' +
        '[결과] sender.send(kim, 환영해요) 호출 확인됨 - 검증 통과',
      realWorldUsage:
        '실제 프로젝트에서 이벤트 발행이나 알림 전송처럼 부수 효과(side effect)가 있는 로직을 검증할 때 verify를 써요. 주문이 생성되면 "주문 생성 이벤트가 발행됐는가", 회원가입하면 "환영 이메일이 발송됐는가"를 값 검증 없이 행위로 확인해요. 부수 효과가 누락되면 실제 운영에서 "왜 이메일이 안 왔지?" 같은 버그로 이어지기 때문에 중요한 검증이에요.',
      why: '값을 반환하지 않는 void 메서드의 호출 여부를 검증하고, 비즈니스 로직이 의도한 부수 효과를 제대로 발생시키는지 확인하려고요.',
      pitfall: 'verify에 전달한 인자가 실제 호출 인자와 다르면 호출된 것으로 인정되지 않아요. 인자 값이 불확실하면 ArgumentMatchers.eq()나 any()로 유연하게 매칭하세요.',
    },
  },
  {
    id: 'test-spring-boot-test',
    lang: 'java',
    title: '@SpringBootTest 통합 테스트',
    file: 'ApplicationIntegrationTest.java',
    code: `import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import static org.assertj.core.api.Assertions.assertThat;

@SpringBootTest
class ApplicationIntegrationTest {
  @Autowired
  UserService userService;

  @Test
  void contextLoads() {
    System.out.println("[실행] 스프링 컨텍스트 로딩 확인");
    assertThat(userService).isNotNull();
    System.out.println("[결과] UserService 빈 정상 로딩 - 통합 테스트 통과");
  }
}`,
    explain: {
      concept:
        '@SpringBootTest는 실제 스프링 컨텍스트를 통째로 띄워서 애플리케이션 전체가 잘 조립되는지 검증하는 통합 테스트예요. ' +
        '단위 테스트가 개별 부품의 정상 동작을 확인한다면, 통합 테스트는 모든 부품이 연결됐을 때도 잘 작동하는지를 확인해요. ' +
        '@Autowired로 실제 스프링 빈을 주입받을 수 있어서, 서비스·리포지토리·컨트롤러가 실제로 연결돼 있는지 검증할 수 있어요. ' +
        'contextLoads라는 테스트는 관례적인 이름으로, "컨텍스트가 에러 없이 로딩되기만 해도 통과"라는 의미예요. 실제 프로젝트에서는 대부분 이 테스트부터 작성해요.',
      terms: [
        { t: '@SpringBootTest', d: '실제 스프링 컨텍스트를 띄워서 전체 애플리케이션을 테스트해요. 가장 무겁지만 가장 현실적인 테스트예요.' },
        { t: '@Autowired', d: '스프링이 관리하는 실제 빈을 테스트 클래스에 주입해줘요. 단위 테스트의 @Mock과 반대 개념이에요.' },
        { t: 'contextLoads()', d: '컨텍스트가 올바르게 로딩되기만 하면 통과하는 테스트예요. 모든 빈 설정이 정상임을 가장 기본적으로 확인해요.' },
        { t: 'isNotNull()', d: '주입된 빈이 null이 아님을 검증해요. @Autowired가 실패하면 테스트가 시작조차 못 하고 에러가 나요.' },
      ],
      expectedOutput:
        '[실행] 스프링 컨텍스트 로딩 확인\n' +
        '[결과] UserService 빈 정상 로딩 - 통합 테스트 통과',
      realWorldUsage:
        '실제 프로젝트에서 @SpringBootTest는 CI/CD 파이프라인의 최종 관문이에요. 단위 테스트가 모두 통과한 후 @SpringBootTest가 실행되고, 여기서 컨텍스트 로딩에 실패하면 "설정이 잘못돼서 앱이 아예 안 뜰 거예요"라는 신호로 받아들여져요. 새 의존성을 추가했는데 @SpringBootTest가 깨지면, 빈 충돌이나 설정 오류를 의심해요.',
      why: '전체 스프링 컨텍스트가 에러 없이 조립되는지 검증해서, 배포 후 "앱이 안 떠요"라는 최악의 상황을 방지하려고요.',
      pitfall: '@SpringBootTest는 실행이 매우 느려요(수 초~수십 초). 단위 테스트와 분리해서 별도 태스크로 관리하고, 자주 변경되지 않는 코드에만 사용하는 게 좋아요.',
    },
  },
  {
    id: 'test-web-mvc-test',
    lang: 'java',
    title: '@WebMvcTest 슬라이스 테스트',
    file: 'UserControllerTest.java',
    code: `import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.test.web.servlet.MockMvc;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(UserController.class)
class UserControllerTest {
  @Autowired
  MockMvc mockMvc;
  @MockBean
  UserService userService;

  @Test
  void shouldReturnUser() throws Exception {
    System.out.println("[실행] GET /users/1 MockMvc 요청");
    mockMvc.perform(get("/users/1"))
      .andExpect(status().isOk());
    System.out.println("[결과] HTTP 200 OK 응답 확인 - 검증 통과");
  }
}`,
    explain: {
      concept:
        '@WebMvcTest는 웹 계층(Controller)만 따로 떼어서 가볍게 테스트하는 슬라이스 테스트예요. ' +
        '전체 컨텍스트를 띄우는 @SpringBootTest와 달리, @Controller·@ControllerAdvice·Filter·Converter 등 웹 관련 빈만 로드해요. ' +
        'MockMvc는 실제 HTTP 서버를 띄우지 않고도 요청을 보내고 응답을 검증할 수 있는 가짜 HTTP 클라이언트예요. ' +
        '@MockBean은 스프링 컨텍스트 안의 실제 서비스를 가짜로 교체해줘요 - 컨트롤러만 검증하고 서비스는 가짜로 두는 전략이에요.',
      terms: [
        { t: '@WebMvcTest(UserController.class)', d: '지정한 컨트롤러만 로드해서 웹 계층만 테스트해요. @Service나 @Repository 빈은 로드되지 않아요.' },
        { t: 'MockMvc', d: '실제 HTTP 서버 없이 요청을 시뮬레이션하는 가짜 클라이언트예요. perform()으로 요청을 보내요.' },
        { t: '@MockBean', d: '스프링 컨텍스트에 등록된 빈을 가짜(Mock)로 교체해요. 서비스 로직을 실행하지 않고 컨트롤러만 테스트해요.' },
        { t: 'perform(get("/users/1"))', d: 'GET /users/1 요청을 시뮬레이션해요. 실제 네트워크 통신 없이 컨트롤러를 직접 호출해요.' },
        { t: 'andExpect(status().isOk())', d: '응답의 HTTP 상태 코드가 200 OK인지 검증해요. andExpect로 여러 조건을 체이닝할 수 있어요.' },
        { t: 'throws Exception', d: 'MockMvc의 perform()은 checked exception을 던질 수 있어서 throws 선언이 필요해요.' },
      ],
      expectedOutput:
        '[실행] GET /users/1 MockMvc 요청\n' +
        '[결과] HTTP 200 OK 응답 확인 - 검증 통과',
      realWorldUsage:
        '실제 프로젝트에서 컨트롤러 테스트는 @WebMvcTest로, 서비스 테스트는 Mockito 단위 테스트로 분리해서 작성해요. 컨트롤러는 "요청 매핑이 제대로 됐는가, 응답 상태 코드는 맞는가, JSON 본문 검증은 통과하는가"만 확인하고, 비즈니스 로직은 서비스 단위 테스트에서 별도로 검증해요.',
      why: '웹 계층만 빠르게 검증하려고요. @SpringBootTest는 수 초 걸리지만 @WebMvcTest는 1초 내로 완료돼서 개발 중에 자주 실행할 수 있어요.',
      pitfall: '@WebMvcTest는 서비스 계층을 로드하지 않아요. @MockBean으로 의존성을 반드시 채워줘야 컨텍스트가 정상 기동돼요. 하나라도 빈이 누락되면 테스트가 시작조차 못 해요.',
    },
  },
  {
    id: 'test-data-jpa-test',
    lang: 'java',
    title: '@DataJpaTest',
    file: 'UserRepositoryTest.java',
    code: `import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;

import static org.assertj.core.api.Assertions.assertThat;

@DataJpaTest
class UserRepositoryTest {
  @Autowired
  UserRepository repo;

  @Test
  void shouldSaveAndFind() {
    System.out.println("[실행] User 저장 후 조회 테스트");
    User u = repo.save(new User("kim"));
    User found = repo.findById(u.getId()).orElseThrow();
    assertThat(found).isNotNull();
    System.out.println("[결과] 저장된 사용자 조회 성공 - id: " + u.getId() + ", name: " + found.getName());
  }
}`,
    explain: {
      concept:
        '@DataJpaTest는 JPA 관련 빈만 로드해서 리포지토리 계층을 집중적으로 테스트하는 슬라이스 테스트예요. ' +
        '실제 DB 대신 H2 같은 인메모리 DB를 자동으로 띄워서, 외부 DB 설치 없이도 실제 SQL 쿼리가 생성되고 실행되는지 검증할 수 있어요. ' +
        '이 코드는 User를 저장한 후 다시 조회해서, 저장된 그대로 조회되는지 확인하는 기본적인 CRUD 테스트예요. ' +
        '직접 작성한 쿼리 메서드(findByEmail 등)가 제대로 동작하는지 확인할 때 특히 유용해요.',
      terms: [
        { t: '@DataJpaTest', d: 'JPA 레이어만 로드하는 슬라이스 테스트예요. @Repository·EntityManager 등 JPA 관련 빈만 생성돼요.' },
        { t: '@Autowired', d: '스프링이 생성한 실제 UserRepository 빈을 주입받아요. 인메모리 DB와 연결된 진짜 리포지토리예요.' },
        { t: 'save(new User(...))', d: 'User 엔티티를 DB에 저장해요. INSERT SQL이 생성되고 인메모리 DB에서 실행돼요.' },
        { t: 'findById(u.getId())', d: '방금 저장한 엔티티의 ID로 다시 조회해요. SELECT SQL이 생성돼요.' },
        { t: 'isNotNull()', d: '조회 결과가 null이 아님을 확인해요. 저장한 엔티티가 정상적으로 조회되는지 검증해요.' },
      ],
      expectedOutput:
        '[실행] User 저장 후 조회 테스트\n' +
        '[결과] 저장된 사용자 조회 성공 - id: 1, name: kim',
      realWorldUsage:
        '실제 프로젝트에서 커스텀 쿼리(@Query, 메서드 이름 기반 쿼리)를 작성할 때 @DataJpaTest로 검증해요. "이 복잡한 JPQL 쿼리가 의도한 대로 동작하는가"를 실제 SQL 로그를 보면서 확인할 수 있어요. 인메모리 DB라서 테스트 후 데이터가 자동으로 롤백돼서, 테스트 데이터가 남지 않아요.',
      why: 'JPA 쿼리와 엔티티 매핑이 실제 DB 수준에서 정상 동작하는지 빠르게 검증하려고요.',
      pitfall: '@DataJpaTest는 기본적으로 각 테스트 후 트랜잭션을 롤백해요. 롤백하지 않고 데이터를 유지하려면 @Rollback(false)나 @Commit을 붙이세요. 단, 이러면 테스트 간 데이터 간섭이 생길 수 있어 주의해야 해요.',
    },
  },
  {
    id: 'test-testcontainers',
    lang: 'java',
    title: 'Testcontainers PostgreSQL',
    file: 'ContainerTest.java',
    code: `import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.DynamicPropertyRegistry;
import org.springframework.test.context.DynamicPropertySource;
import org.testcontainers.containers.PostgreSQLContainer;
import org.testcontainers.junit.jupiter.Container;
import org.testcontainers.junit.jupiter.Testcontainers;

import static org.assertj.core.api.Assertions.assertThat;

@SpringBootTest
@Testcontainers
class ContainerTest {
  @Container
  static PostgreSQLContainer<?> postgres = new PostgreSQLContainer<>("postgres:16");

  @DynamicPropertySource
  static void props(DynamicPropertyRegistry r) {
    System.out.println("[준비] Testcontainers PostgreSQL 포트 매핑");
    r.add("spring.datasource.url", postgres::getJdbcUrl);
    r.add("spring.datasource.username", postgres::getUsername);
    r.add("spring.datasource.password", postgres::getPassword);
  }

  @Test
  void containerIsRunning() {
    System.out.println("[실행] PostgreSQL 컨테이너 상태 확인");
    assertThat(postgres.isRunning()).isTrue();
    System.out.println("[결과] PostgreSQL 16 컨테이너 실행 중 - " + postgres.getJdbcUrl());
  }
}`,
    explain: {
      concept:
        'Testcontainers는 도커를 이용해 테스트용으로 진짜 PostgreSQL·Redis·Kafka 같은 외부 서비스를 띄워주는 도구예요. ' +
        '인메모리 DB(H2)는 실제 PostgreSQL과 SQL 문법이 미묘하게 달라서, "테스트는 통과했는데 운영 DB에선 에러" 같은 불상사가 생길 수 있어요. ' +
        'Testcontainers는 Docker만 설치돼 있으면 PostgreSQL 16 이미지를 자동으로 다운로드하고 컨테이너로 실행해줘요. ' +
        '@DynamicPropertySource로 런타임에 스프링 설정을 동적으로 주입해서, 동적으로 할당된 컨테이너 포트와 연결 정보를 전달해요.',
      terms: [
        { t: '@Testcontainers', d: 'Testcontainers 확장을 활성화해요. @Container 필드를 감지하고 컨테이너 생명주기를 관리해요.' },
        { t: '@Container', d: '이 필드가 Testcontainers가 관리할 도커 컨테이너임을 표시해요. static 필드로 선언해야 모든 테스트가 공유해요.' },
        { t: 'PostgreSQLContainer("postgres:16")', d: 'PostgreSQL 16 이미지로 컨테이너를 생성해요. 로컬에 없으면 Docker Hub에서 자동으로 pull해요.' },
        { t: '@DynamicPropertySource', d: '스프링 환경 변수를 런타임에 동적으로 추가하는 메서드예요. 컨테이너 포트는 매번 달라져서 동적 설정이 필요해요.' },
        { t: 'postgres::getJdbcUrl', d: '메서드 참조로 컨테이너의 JDBC URL을 동적으로 가져와서 spring.datasource.url에 주입해요.' },
        { t: 'isRunning()', d: '컨테이너가 정상적으로 실행 중인지 확인하는 Testcontainers API예요.' },
      ],
      expectedOutput:
        '[준비] Testcontainers PostgreSQL 포트 매핑\n' +
        '[실행] PostgreSQL 컨테이너 상태 확인\n' +
        '[결과] PostgreSQL 16 컨테이너 실행 중 - jdbc:postgresql://localhost:54321/test',
      realWorldUsage:
        '실제 프로젝트에서 CI/CD 파이프라인에 Testcontainers를 도입하면, PR마다 진짜 PostgreSQL과 Redis를 띄워서 통합 테스트를 수행해요. "운영은 PostgreSQL인데 테스트는 H2" 같은 설정 차이로 인한 버그가 완전히 사라져요. GitHub Actions 러너에 Docker만 설치돼 있으면 추가 설정 없이 바로 동작해요.',
      why: '인메모리 DB와 실제 DB의 차이로 발생하는 "테스트는 통과, 운영은 실패" 문제를 원천적으로 막으려고요.',
      pitfall: '도커가 설치돼 있어야 Testcontainers가 동작해요. CI/CD 환경(GitHub Actions, Jenkins 등)에서 Docker 사용 가능 여부를 먼저 확인하세요. 로컬 개발 환경에도 Docker Desktop이 필요해요.',
    },
  },
  {
    id: 'test-mock-bean',
    lang: 'java',
    title: '@MockBean으로 서비스 교체',
    file: 'UserControllerTest.java',
    code: `import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.test.web.servlet.MockMvc;

import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(UserController.class)
class UserControllerTest {
  @Autowired
  MockMvc mockMvc;
  @MockBean
  UserService userService;

  @Test
  void shouldReturnUser() throws Exception {
    System.out.println("[실행] Mock 서비스 설정 + GET /users/1 요청");
    when(userService.find(1L)).thenReturn(new User(1L, "kim"));
    mockMvc.perform(get("/users/1"))
      .andExpect(status().isOk())
      .andExpect(jsonPath("$.name").value("kim"));
    System.out.println("[결과] 응답 JSON name=kim 확인 - 검증 통과");
  }
}`,
    explain: {
      concept:
        '@MockBean은 스프링 컨텍스트 안의 실제 빈을 Mockito 가짜 객체로 완전히 교체해줘요. ' +
        '@Mock(순수 Mockito)과 달리 @MockBean은 스프링이 관리하는 빈을 대체하기 때문에, @WebMvcTest·@SpringBootTest 같은 스프링 테스트에서 쓸 수 있어요. ' +
        'when으로 userService.find(1L)이 User(1L, "kim")을 반환하도록 설정하고, jsonPath로 실제 JSON 응답의 $.name 필드가 "kim"인지 검증해요. ' +
        'JSON 응답의 특정 필드 값까지 세밀하게 검증할 수 있어서, API 응답 형식이 기대와 일치하는지 완벽하게 확인할 수 있어요.',
      terms: [
        { t: '@MockBean', d: '스프링 컨텍스트의 빈을 Mockito 가짜로 교체해요. @Mock보다 강력하지만 컨텍스트 재로딩을 유발할 수 있어요.' },
        { t: 'when(service.find(1L)).thenReturn(...)', d: '가짜 서비스가 find(1L) 호출 시 특정 User를 반환하도록 미리 약속해요.' },
        { t: 'jsonPath("$.name")', d: 'JSON 응답 본문에서 name 필드를 추출하는 JsonPath 표현식이에요. $는 루트 객체를 의미해요.' },
        { t: 'value("kim")', d: '추출한 JSON 필드 값이 "kim"인지 검증해요. 정확한 값 비교예요.' },
      ],
      expectedOutput:
        '[실행] Mock 서비스 설정 + GET /users/1 요청\n' +
        '[결과] 응답 JSON name=kim 확인 - 검증 통과',
      realWorldUsage:
        '실제 프로젝트에서 컨트롤러 테스트 시 모든 서비스 의존성을 @MockBean으로 교체해요. 사용자 인증·권한 확인·외부 API 호출 등 실제로 실행하면 복잡한 의존성을 전부 가짜로 대체해서, 오직 컨트롤러의 요청-응답 흐름만 깔끔하게 집중해서 검증해요.',
      why: '컨트롤러의 요청 매핑·응답 형식·상태 코드를 서비스 로직과 분리해서 집중 검증하려고요.',
      pitfall: '@MockBean은 사용될 때마다 스프링 컨텍스트를 재로딩할 수 있어요. @MockBean이 여러 테스트 클래스에 흩어져 있으면 컨텍스트 캐싱이 무효화돼서 CI 시간이 급증해요. 가능하면 한 테스트 클래스 안에서 @MockBean을 재사용하세요.',
    },
  },
  {
    id: 'test-parameterized',
    lang: 'java',
    title: '@ParameterizedTest',
    file: 'CalculatorTest.java',
    code: `import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.ValueSource;

import static org.assertj.core.api.Assertions.assertThat;

class CalculatorTest {
  @ParameterizedTest
  @ValueSource(ints = {1, 2, 3, 4})
  void shouldSquare(int n) {
    System.out.println("[실행] square(" + n + ") = " + (n * n));
    Calculator calc = new Calculator();
    assertThat(calc.square(n)).isEqualTo(n * n);
  }
}`,
    explain: {
      concept:
        '@ParameterizedTest는 하나의 테스트 메서드를 여러 입력값으로 반복 실행해주는 강력한 도구예요. ' +
        '@ValueSource에 {1, 2, 3, 4}를 지정하면, shouldSquare가 1, 2, 3, 4 각각에 대해 한 번씩 총 4번 실행돼요. ' +
        "일반 @Test로 4개를 따로 작성하는 것보다 코드 양이 1/4로 줄고, 테스트 케이스를 추가하려면 배열에 숫자 하나만 더 넣으면 돼요. " +
        '경계값 분석(1, 0, -1, MAX_VALUE 등) 같은 테스트 기법을 적용할 때 특히 편리해요.',
      terms: [
        { t: '@ParameterizedTest', d: '여러 입력값으로 같은 테스트를 반복 실행해요. @Test 대신 사용해요.' },
        { t: '@ValueSource(ints = {1, 2, 3, 4})', d: '테스트에 전달할 정수 값 목록을 지정해요. ints 외에 strings, doubles 등 다양한 타입이 있어요.' },
        { t: 'int n', d: '@ValueSource의 각 값이 차례로 이 파라미터에 주입돼요. 4개의 값이면 4번 실행돼요.' },
        { t: 'n * n', d: '각 입력에 대한 기대값을 즉석에서 계산하고 있어요. 이렇게 하면 기대값을 또 나열할 필요가 없어요.' },
      ],
      expectedOutput:
        '[실행] square(1) = 1\n' +
        '[실행] square(2) = 4\n' +
        '[실행] square(3) = 9\n' +
        '[실행] square(4) = 16',
      realWorldUsage:
        '실제 프로젝트에서 입력값 검증(Validation) 테스트에 @ParameterizedTest를 많이 써요. @ValueSource로 유효한 값 5개, @EmptySource로 빈 문자열, @NullSource로 null을 각각 테스트해서, 검증 로직이 모든 경계 조건을 올바르게 처리하는지 한 번에 확인할 수 있어요.',
      why: '같은 로직을 여러 케이스로 검증해야 할 때 중복 코드를 제거하고, 새 케이스 추가를 쉽게 하려고요.',
      pitfall: '@ValueSource의 값 타입과 메서드 파라미터 타입이 정확히 일치해야 해요. ints인데 파라미터가 String이면 테스트가 실행조차 안 돼요. 타입 불일치는 컴파일 에러가 아니라 테스트 실패로 나타나서 찾기 어려울 수 있어요.',
    },
  },
  {
    id: 'test-display-name',
    lang: 'java',
    title: '@DisplayName',
    file: 'UserValidatorTest.java',
    code: `import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import static org.assertj.core.api.Assertions.assertThatThrownBy;

@DisplayName("사용자 검증기 테스트")
class UserValidatorTest {
  @Test
  @DisplayName("이름이 비어있으면 IllegalArgumentException 발생")
  void shouldThrowWhenNameEmpty() {
    System.out.println("[실행] 빈 이름으로 User 생성 시도");
    assertThatThrownBy(() -> new User(""))
      .isInstanceOf(IllegalArgumentException.class);
    System.out.println("[결과] IllegalArgumentException 발생 확인 - 검증 통과");
  }
}`,
    explain: {
      concept:
        '@DisplayName은 테스트에 사람이 읽기 좋은 설명을 붙여주는 어노테이션이에요. ' +
        '"shouldThrowWhenNameEmpty" 같은 메서드 이름은 개발자만 이해할 수 있지만, "이름이 비어있으면 IllegalArgumentException 발생"은 누구나 이해할 수 있어요. ' +
        'IDE의 테스트 러너나 CI 리포트에서 이 DisplayName이 표시돼서, 어떤 테스트가 실패했는지 한눈에 파악할 수 있어요. ' +
        'assertThatThrownBy는 람다 실행 중 예외가 발생하는지 검증하는 AssertJ 도구예요 - 예외를 던지는 게 정상 동작인 경우에 써요.',
      terms: [
        { t: '@DisplayName', d: '테스트 결과 리포트에 표시될 사람이 읽는 이름을 지정해요. 클래스와 메서드 모두에 붙일 수 있어요.' },
        { t: 'assertThatThrownBy(() -> ...)', d: '람다 실행 중 예외가 발생하는지 검증해요. 예외가 안 나면 테스트가 실패해요.' },
        { t: 'isInstanceOf(IllegalArgumentException)', d: '발생한 예외의 타입이 IllegalArgumentException인지 확인해요. 더 구체적인 하위 예외도 통과돼요.' },
        { t: '() -> new User("")', d: '람다 표현식으로 예외 발생이 기대되는 코드를 감싸요. 즉시 실행되지 않고 테스트 프레임워크가 실행해요.' },
      ],
      expectedOutput:
        '[실행] 빈 이름으로 User 생성 시도\n' +
        '[결과] IllegalArgumentException 발생 확인 - 검증 통과',
      realWorldUsage:
        '실제 프로젝트에서 DisplayName을 한국어로 작성하면 비개발자(기획자, QA)도 테스트 리포트를 이해할 수 있어요. CI/CD 대시보드에 "shouldThrowWhenNameEmpty FAILED"보다 "이름이 비어있으면 예외 발생 FAILED"가 훨씬 빨리 문제를 파악하게 해줘요. 팀 내 의사소통 비용을 줄이는 데 크게 기여해요.',
      why: '테스트 의도를 코드가 아닌 사람의 언어로 명확히 전달해서, 실패 시 원인 파악 시간을 단축하려고요.',
      pitfall: 'DisplayName에 한글을 쓰면 CI 환경의 콘솔 인코딩에 따라 글자가 깨질 수 있어요. 로그 설정과 빌드 도구(Gradle/Maven)의 인코딩이 UTF-8인지 확인하세요.',
    },
  },
  {
    id: 'test-nested',
    lang: 'java',
    title: '@Nested 중첩 테스트',
    file: 'StackTest.java',
    code: `import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;

import static org.assertj.core.api.Assertions.assertThatThrownBy;

class StackTest {
  @Nested
  @DisplayName("비어있는 스택일 때")
  class WhenEmpty {
    @Test
    @DisplayName("pop() 호출 시 EmptyStackException 발생")
    void shouldThrowOnPop() {
      System.out.println("[실행] 빈 스택에서 pop() 시도");
      assertThatThrownBy(() -> new Stack<>().pop())
        .isInstanceOf(EmptyStackException.class);
      System.out.println("[결과] EmptyStackException 발생 - 검증 통과");
    }
  }

  @Nested
  @DisplayName("원소가 있을 때")
  class WhenPushed {
    @Test
    @DisplayName("pop() 호출 시 마지막 원소 반환")
    void shouldReturnLast() {
      System.out.println("[실행] 원소 추가 후 pop() 시도");
      Stack<String> stack = new Stack<>();
      stack.push("a");
      stack.push("b");
      String result = stack.pop();
      System.out.println("[결과] pop() = " + result + " - 마지막 원소 b 반환 확인");
    }
  }
}`,
    explain: {
      concept:
        '@Nested는 관련된 테스트를 상황별로 그룹화해서 계층 구조로 만드는 도구예요. ' +
        '"비어있는 스택일 때", "원소가 있을 때"처럼 시나리오별로 inner class를 만들고, 각 시나리오 안에서 기대 동작을 세분화해서 검증해요. ' +
        'IDE에서 테스트 트리를 접고 펼칠 수 있어서, 30개짜리 테스트 클래스도 한눈에 구조를 파악할 수 있어요. ' +
        '외부 클래스의 @BeforeEach가 중첩 클래스에도 자동으로 적용돼서, 공통 준비 코드를 재사용할 수 있는 것도 큰 장점이에요.',
      terms: [
        { t: '@Nested', d: '이 클래스가 테스트 그룹임을 표시해요. inner class로 선언해야 하고 static이 아니어야 해요.' },
        { t: '@DisplayName("비어있는 스택일 때")', d: '중첩 테스트 그룹에도 설명을 붙일 수 있어요. 테스트 리포트에서 계층적으로 표시돼요.' },
        { t: 'WhenEmpty', d: '특정 상황을 나타내는 테스트 그룹이에요. 관례적으로 When...으로 시작하는 이름을 써요.' },
        { t: 'assertThatThrownBy(() -> ...)', d: '제네릭 Stack의 pop()이 예외를 던지는지 검증해요. 빈 스택에서는 예외가 기대되는 동작이에요.' },
      ],
      expectedOutput:
        'WhenEmpty > pop() 호출 시:\n' +
        '[실행] 빈 스택에서 pop() 시도\n' +
        '[결과] EmptyStackException 발생 - 검증 통과\n\n' +
        'WhenPushed > pop() 호출 시:\n' +
        '[실행] 원소 추가 후 pop() 시도\n' +
        '[결과] pop() = b - 마지막 원소 b 반환 확인',
      realWorldUsage:
        '실제 프로젝트에서 도메인 객체(Order, User, Cart)의 상태별 동작을 테스트할 때 @Nested를 써요. "주문이 DRAFT일 때", "주문이 CONFIRMED일 때", "주문이 CANCELLED일 때" 각각 addLine(), cancel(), confirm()의 기대 동작을 그룹으로 정리해요. BDD(Behavior-Driven Development) 스타일 테스트와 궁합이 아주 좋아요.',
      why: '상황별로 테스트를 계층적으로 정리해 가독성을 높이고, 관련 테스트를 한 곳에서 관리하려고요.',
      pitfall: '중첩 클래스는 static이 아니어야 @Nested가 인식돼요. static inner class에 @Nested를 붙이면 JUnit이 무시하고 테스트가 실행되지 않아요.',
    },
  },
  {
    id: 'test-mockito-argument-captor',
    lang: 'java',
    title: 'ArgumentCaptor',
    file: 'OrderServiceTest.java',
    code: `import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.verify;

@ExtendWith(MockitoExtension.class)
class OrderServiceTest {
  @Mock
  OrderRepo repo;
  @InjectMocks
  OrderService service;

  @Test
  void shouldPersistOrder() {
    System.out.println("[실행] 주문 생성 + ArgumentCaptor로 저장 객체 검증");
    service.create("kim", 1000);
    ArgumentCaptor<Order> captor = ArgumentCaptor.forClass(Order.class);
    verify(repo).save(captor.capture());
    assertThat(captor.getValue().buyer()).isEqualTo("kim");
    System.out.println("[결과] 저장된 주문의 buyer 확인 - kim");
  }
}`,
    explain: {
      concept:
        'ArgumentCaptor는 Mock 객체에 전달된 인자를 붙잡아서 나중에 꺼내볼 수 있는 도구예요. ' +
        'verify로 "save가 호출됐다"까지만 검증하는 대신, "save에 전달된 Order 객체의 buyer 필드가 kim인가"까지 깊이 검증할 수 있어요. ' +
        'forClass()로 어떤 타입의 인자를 캡처할지 지정하고, capture()로 인자를 잡아둔 뒤 getValue()로 꺼내서 세부 검증을 수행해요. ' +
        '생성된 객체의 내부 상태까지 완벽하게 확인해야 할 때 일반 verify보다 훨씬 강력해요.',
      terms: [
        { t: 'ArgumentCaptor<Order>', d: 'Order 타입의 인자를 캡처하는 도구예요. 제네릭으로 어떤 타입을 잡을지 지정해요.' },
        { t: 'forClass(Order.class)', d: '캡처할 인자의 클래스를 지정해요. Order.class로 Order 타입만 캡처하겠다는 의미예요.' },
        { t: 'capture()', d: '실제 호출에서 인자를 캡처해요. verify의 인자로 전달돼서 호출 시점에 인자가 저장돼요.' },
        { t: 'getValue()', d: '캡처된 인자를 꺼내서 검증해요. 여러 번 호출됐으면 getAllValues()로 리스트를 얻을 수 있어요.' },
      ],
      expectedOutput:
        '[실행] 주문 생성 + ArgumentCaptor로 저장 객체 검증\n' +
        '[결과] 저장된 주문의 buyer 확인 - kim',
      realWorldUsage:
        '실제 프로젝트에서 복잡한 도메인 객체를 생성하는 서비스 메서드를 검증할 때 ArgumentCaptor를 써요. "save()가 호출됐다" 대신 "save()에 전달된 Order의 buyer가 kim이고, totalAmount가 1000이고, status가 DRAFT인가"를 한 번에 검증해요. 생성된 객체의 모든 필수 필드가 올바르게 설정됐는지 완전히 확인할 수 있어요.',
      why: 'Mock 객체에 전달된 인자의 내부 상태까지 정밀하게 검증해서, 단순 호출 여부를 넘어 비즈니스 로직의 정확성을 확인하려고요.',
      pitfall: 'verify 없이 capture()만 호출하면 아무것도 캡처되지 않아요. capture()는 verify의 인자로 전달돼야 실제 호출을 가로챌 수 있어요.',
    },
  },
  {
    id: 'test-mockito-throw',
    lang: 'java',
    title: 'Mockito 예외 던지기',
    file: 'PaymentServiceTest.java',
    code: `import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class PaymentServiceTest {
  @Mock
  PaymentGateway gateway;
  @InjectMocks
  PaymentService service;

  @Test
  void shouldHandleGatewayError() {
    System.out.println("[실행] 결제 게이트웨이 에러 시뮬레이션");
    when(gateway.charge(any())).thenThrow(new RuntimeException("결제 실패"));
    assertThatThrownBy(() -> service.pay(1000))
      .hasMessageContaining("결제 실패");
    System.out.println("[결과] RuntimeException 감지 + 메시지 확인 - 검증 통과");
  }
}`,
    explain: {
      concept:
        'thenThrow는 가짜 객체가 정상 응답 대신 예외를 던지게 설정해서, 에러 상황을 시뮬레이션하는 도구예요. ' +
        '실제 결제 게이트웨이를 일부러 실패시키는 건 불가능하지만, Mockito로는 언제든지 실패를 재현할 수 있어요. ' +
        '여기서는 gateway.charge()가 RuntimeException을 던지도록 설정하고, service.pay()가 그 예외를 제대로 전파하는지 검증하고 있어요. ' +
        '해피 패스(정상 시나리오)만 테스트하고 예외 상황을 빼먹으면, 실제 장애 발생 시 "이렇게 터질 줄 몰랐다"로 이어지기 때문에 실무에서는 예외 케이스 테스트를 특히 중요하게 다뤄요.',
      terms: [
        { t: 'thenThrow(...)', d: '가짜 객체가 특정 호출에 대해 예외를 던지도록 설정해요. 정상 반환 대신 에러 상황을 시뮬레이션해요.' },
        { t: 'any()', d: '어떤 인자가 전달되든 이 스터빙을 적용해요. ArgumentMatchers의 범용 매처예요.' },
        { t: 'hasMessageContaining("결제 실패")', d: '발생한 예외의 메시지에 "결제 실패"가 포함돼 있는지 검증해요.' },
        { t: 'assertThatThrownBy(() -> service.pay(1000))', d: 'pay() 호출 시 예외가 발생하는지 검증해요. 람다가 예외를 던지면 통과예요.' },
      ],
      expectedOutput:
        '[실행] 결제 게이트웨이 에러 시뮬레이션\n' +
        '[결과] RuntimeException 감지 + 메시지 확인 - 검증 통과',
      realWorldUsage:
        '실제 프로젝트에서 외부 API 타임아웃·잔액 부족·인증 실패 등 다양한 장애 시나리오를 thenThrow로 시뮬레이션해요. "PG사가 5초 타임아웃을 내면 우리 서비스는 어떻게 반응하는가" 같은 복원력(resilience) 테스트를 외부 의존성 없이도 안전하게 수행할 수 있어요. Circuit Breaker 패턴 테스트도 이 방식으로 작성해요.',
      why: '예외 상황에서도 애플리케이션이 적절히 대응하는지(적절한 예외 변환·로깅·폴백) 검증하려고요.',
      pitfall: 'thenThrow에 checked exception을 지정하려면, 해당 예외가 실제 메서드 시그니처의 throws에 선언돼 있어야 해요. 선언되지 않은 checked exception을 thenThrow로 던지려고 하면 Mockito가 에러를 내요.',
    },
  },
  {
    id: 'test-mock-mvc-json',
    lang: 'java',
    title: 'MockMvc JSON POST',
    file: 'UserControllerTest.java',
    code: `import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(UserController.class)
class UserControllerTest {
  @Autowired
  MockMvc mockMvc;
  @MockBean
  UserService userService;

  @Test
  void shouldCreateUser() throws Exception {
    System.out.println("[실행] POST /users JSON 요청");
    mockMvc.perform(post("/users")
        .contentType(MediaType.APPLICATION_JSON)
        .content("{\"name\":\"kim\"}"))
      .andExpect(status().isCreated());
    System.out.println("[결과] HTTP 201 Created 확인 - 검증 통과");
  }
}`,
    explain: {
      concept:
        'MockMvc로 GET뿐 아니라 POST·PUT·DELETE 같은 쓰기 요청도 시뮬레이션할 수 있어요. ' +
        'contentType으로 요청의 Content-Type 헤더를 application/json으로 설정하고, content로 JSON 본문을 문자열로 전달하고 있어요. ' +
        'status().isCreated()는 응답 상태 코드가 201 Created인지 검증해요 - RESTful API에서는 리소스 생성 성공 시 201을 반환하는 게 관례예요. ' +
        '실제 서버를 띄우지 않고도 JSON 요청-응답 전체를 검증할 수 있어서, 컨트롤러의 요청 매핑과 응답 형식을 빠르게 확인할 수 있어요.',
      terms: [
        { t: 'post("/users")', d: 'POST /users 요청을 생성해요. get() 대신 post()를 쓰는 게 유일한 차이예요.' },
        { t: 'contentType(APPLICATION_JSON)', d: '요청의 Content-Type 헤더를 application/json으로 설정해요. 서버가 JSON 본문임을 인식하게 해요.' },
        { t: 'content(...)', d: '요청 본문에 JSON 문자열을 담아 보내요. 이스케이프 처리된 JSON 형식이에요.' },
        { t: 'isCreated()', d: 'HTTP 201 Created 상태 코드를 검증해요. 200 OK가 아니라 201인 게 포인트예요.' },
      ],
      expectedOutput:
        '[실행] POST /users JSON 요청\n' +
        '[결과] HTTP 201 Created 확인 - 검증 통과',
      realWorldUsage:
        '실제 프로젝트에서 POST API의 입력 검증(Validation) 테스트에 MockMvc를 많이 써요. 필수 필드 누락 시 400 Bad Request, 잘못된 형식 시 400, 정상 요청 시 201 Created를 각각 테스트해요. @Valid 어노테이션이 붙은 DTO의 검증 로직이 예상대로 응답 코드를 반환하는지 완전히 확인할 수 있어요.',
      why: 'POST/PUT/DELETE 같은 쓰기 요청의 매핑과 응답 상태 코드를 빠르게 검증하려고요.',
      pitfall: 'content()에 전달하는 JSON 문자열의 형식이 잘못되면 서버가 400을 반환해요. 작은 따옴표 쓰기, 필드명 오타, 중괄호 불일치 같은 사소한 JSON 오류가 테스트 실패의 가장 흔한 원인이에요.',
    },
  },
  {
    id: 'test-test-instance',
    lang: 'java',
    title: '@TestInstance',
    file: 'SharedStateTest.java',
    code: `import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.TestInstance;

import static org.assertj.core.api.Assertions.assertThat;

@TestInstance(TestInstance.Lifecycle.PER_CLASS)
class SharedStateTest {
  private int counter = 0;

  @Test
  void first() {
    counter++;
    System.out.println("[실행] first() - counter: " + counter);
  }

  @Test
  void second() {
    System.out.println("[실행] second() - counter: " + counter);
    assertThat(counter).isLessThan(100);
  }
}`,
    explain: {
      concept:
        '@TestInstance(PER_CLASS)는 테스트 클래스의 인스턴스를 딱 하나만 만들어서 모든 테스트가 공유하게 해요. ' +
        '기본 설정(PER_METHOD)에서는 각 @Test마다 새 인스턴스가 생성되지만, PER_CLASS로 바꾸면 counter 같은 인스턴스 필드가 테스트 간에 공유돼요. ' +
        '여기서 first()가 counter를 1로 올리면, second()가 그 값을 그대로 볼 수 있어요. ' +
        '무거운 리소스(DB 커넥션, 대용량 파일 로드)를 @BeforeAll에서 한 번만 준비하고 여러 테스트에서 재사용할 때 유용해요.',
      terms: [
        { t: '@TestInstance(PER_CLASS)', d: '모든 테스트가 하나의 클래스 인스턴스를 공유하게 해요. 필드 값이 테스트 간에 유지돼요.' },
        { t: 'PER_CLASS vs PER_METHOD', d: 'PER_CLASS는 인스턴스 1개 공유, PER_METHOD(기본값)는 매 테스트마다 새 인스턴스 생성이에요.' },
        { t: 'counter', d: '테스트 간 공유되는 인스턴스 필드예요. PER_CLASS 모드라서 first()의 증가가 second()에서 보여요.' },
        { t: 'isLessThan(100)', d: 'counter 값이 100보다 작은지 검증해요. 공유 상태를 확인하는 느슨한 검증이에요.' },
      ],
      expectedOutput:
        '[실행] first() - counter: 1\n' +
        '[실행] second() - counter: 1',
      realWorldUsage:
        '실제 프로젝트에서 @SpringBootTest + @TestInstance(PER_CLASS) 조합으로 컨텍스트 로딩 시간을 줄여요. 컨텍스트를 한 번만 띄우고(@BeforeAll) 모든 테스트가 공유하면, PER_METHOD로 매번 컨텍스트를 띄우는 것보다 CI 시간이 수십 초 단축돼요. 대신 테스트 간 상태 공유로 인한 부작용을 주의해야 해요.',
      why: '무거운 사전 작업을 한 번만 수행해 테스트 실행 시간을 단축하려고요. PER_METHOD는 안전하지만 느려요.',
      pitfall: '테스트 간 필드 공유는 순서 의존성을 만들기 쉬워요. second()가 first() 이후에 실행된다는 보장이 없으면(기본은 결정적이지만), counter 값이 0일 수도 있어요. @TestMethodOrder로 순서를 명시적으로 고정해야 안전해요.',
    },
  },
  {
    id: 'test-disabled',
    lang: 'java',
    title: '@Disabled로 테스트 건너뛰기',
    file: 'FlakyTest.java',
    code: `import org.junit.jupiter.api.Disabled;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import static org.assertj.core.api.Assertions.assertThat;

@ExtendWith(MockitoExtension.class)
class FlakyTest {
  @Mock
  ExternalApi externalApi;

  @Disabled("외부 API 복구 후 재활성화 (2025-06-29)")
  @Test
  void shouldCallExternalApi() {
    System.out.println("[실행] 외부 API 상태 확인");
    assertThat(externalApi.status()).isEqualTo("OK");
    System.out.println("[결과] 외부 API 정상 - 검증 통과");
  }
}`,
    explain: {
      concept:
        '@Disabled는 특정 테스트를 실행 대상에서 제외하는 어노테이션이에요. ' +
        '일시적으로 실패하는 테스트나, 아직 개발 중인 기능의 테스트를 전체 테스트 스위트에서 건너뛰고 싶을 때 써요. ' +
        '괄호 안에 문자열로 비활성화 이유와 재활성화 예정일을 적어두면, 나중에 다른 개발자가 봤을 때 왜 건너뛰었는지 바로 이해할 수 있어요. ' +
        'CI 리포트에는 @Disabled된 테스트가 "skipped"로 표시돼서, 실패와 구분돼요. 빌드는 통과되지만 건너뛴 테스트가 있다는 건 알 수 있어요.',
      terms: [
        { t: '@Disabled', d: '이 테스트를 실행하지 않고 건너뛰게 해요. 빌드 실패 없이 skipped로 표시돼요.' },
        { t: '"외부 API 복구 후..."', d: '비활성화 이유와 예정일을 기록해요. 없어도 되지만, 기록해두는 게 나중을 위해 좋아요.' },
        { t: '@ExtendWith(MockitoExtension)', d: 'Mockito 어노테이션을 처리하는 확장이에요. Mock 객체를 생성해줘요.' },
        { t: 'status()', d: '외부 API의 상태를 확인하는 메서드예요. 현재 비활성화된 상태라 호출되지 않아요.' },
      ],
      expectedOutput:
        '(테스트 실행 로그 없음 - @Disabled로 건너뜀)\n' +
        '테스트 리포트: shouldCallExternalApi SKIPPED',
      realWorldUsage:
        '실제 프로젝트에서 외부 API 장애나 아직 계약되지 않은 서비스의 테스트를 @Disabled로 관리해요. 매일 아침 스탠드업에서 "@Disabled된 테스트 목록"을 확인하고, 외부 API가 복구되면 바로 활성화해서 CI에 반영해요. 오래 방치되는 걸 막기 위해 Jira 티켓 번호를 이유에 함께 적는 팀도 많아요.',
      why: '일시적으로 깨지는 테스트 때문에 CI가 붉게 물드는 걸 막고, 건너뛴 이유를 기록해서 추후 대응을 용이하게 하려고요.',
      pitfall: '@Disabled를 임시 방편으로 쓰고 장기간 방치하면 "테스트는 통과하는데 기능은 망가진" 상황이 돼요. 스프린트마다 @Disabled된 테스트를 리뷰하는 프로세스를 팀에 도입하세요.',
    },
  },
  {
    id: 'test-assert-all',
    lang: 'java',
    title: 'AssertJ SoftAssertions',
    file: 'UserValidationTest.java',
    code: `import org.assertj.core.api.SoftAssertions;
import org.junit.jupiter.api.Test;

class UserValidationTest {
  @Test
  void shouldValidateAllFields() {
    System.out.println("[실행] SoftAssertions로 모든 필드 한 번에 검증");
    User user = new User("kim", 25);
    SoftAssertions.assertSoftly(soft -> {
      soft.assertThat(user.name()).isEqualTo("kim");
      soft.assertThat(user.age()).isEqualTo(25);
      soft.assertThat(user.isActive()).isTrue();
    });
    System.out.println("[결과] name=kim, age=25, active=true - 모두 검증 통과");
  }
}`,
    explain: {
      concept:
        'SoftAssertions는 여러 검증을 한 번에 실행하고, 중간에 실패해도 끝까지 나머지 검증을 계속 진행해줘요. ' +
        '일반 assertThat은 첫 번째 실패에서 즉시 테스트가 중단돼서, 나머지 필드가 맞는지 틀린지 알 수 없어요. ' +
        'assertSoftly로 람다 안에 여러 검증을 모아두면, 실패한 항목만 리스트로 모아서 한 번에 보여줘요. ' +
        '한 번의 테스트 실행으로 모든 문제를 발견할 수 있어서 디버깅 효율이 훨씬 올라가요.',
      terms: [
        { t: 'SoftAssertions', d: '여러 검증을 모아서 실행하고, 실패를 수집해 한 번에 보고해주는 AssertJ의 컬렉터예요.' },
        { t: 'assertSoftly(soft -> {...})', d: 'SoftAssertions의 실행 메서드예요. 람다 안의 모든 검증이 완료될 때까지 실행을 계속해요.' },
        { t: 'soft.assertThat(user.name())', d: 'SoftAssertions에 검증을 추가해요. 실패해도 즉시 중단되지 않고 계속 진행돼요.' },
        { t: 'isTrue()', d: 'boolean 값이 true인지 검증해요. isActive()가 true를 반환하면 통과예요.' },
      ],
      expectedOutput:
        '[실행] SoftAssertions로 모든 필드 한 번에 검증\n' +
        '[결과] name=kim, age=25, active=true - 모두 검증 통과',
      realWorldUsage:
        '실제 프로젝트에서 API 응답 DTO의 모든 필드를 한 번에 검증할 때 SoftAssertions를 써요. 10개 필드가 있는 DTO 검증에서 첫 번째 필드가 틀렸다고 테스트가 끝나버리면, 나머지 9개 필드는 코드를 고친 후 다시 실행해야 발견할 수 있어요. SoftAssertions면 한 번에 10개 중 3개가 틀렸다는 걸 바로 알 수 있어서, 수정 -> 실행 반복 횟수가 크게 줄어요.',
      why: '한 번의 테스트 실행으로 모든 실패 지점을 발견해서, 수정-재실행 사이클을 단축하려고요.',
      pitfall: '일반 assertThat 체인은 첫 실패에서 멈춰서, 나머지 문제를 숨겨버려요. 빠른 피드백이 장점이지만, 여러 필드를 검증할 땐 SoftAssertions가 더 생산적이에요.',
    },
  },
  {
    id: 'test-transactional-rollback',
    lang: 'java',
    title: '테스트 트랜잭션 롤백',
    file: 'TransactionalTest.java',
    code: `import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.transaction.annotation.Transactional;

import static org.assertj.core.api.Assertions.assertThat;

@SpringBootTest
class TransactionalTest {
  @Autowired
  UserRepository repo;

  @Test
  @Transactional
  void shouldInsertThenRollback() {
    System.out.println("[실행] User 저장 (트랜잭션 내)");
    repo.save(new User("temp"));
    long count = repo.count();
    assertThat(count).isGreaterThan(0);
    System.out.println("[결과] 현재 트랜잭션 내 count: " + count + " (테스트 종료 후 롤백)");
  }
}`,
    explain: {
      concept:
        '테스트 메서드에 @Transactional을 붙이면, 테스트가 끝난 후 트랜잭션이 자동으로 롤백돼요. ' +
        '이 코드에서 save()로 저장한 User는 테스트 실행 중에는 DB에 존재해서 count()가 증가하지만, 테스트가 종료되는 순간 롤백돼서 DB에 흔적이 남지 않아요. ' +
        '덕분에 매번 tearDown()에서 DELETE 쿼리를 실행할 필요 없이, 테스트 데이터가 다른 테스트를 오염시키는 걸 막을 수 있어요. ' +
        '스프링 테스트에서 @Transactional 롤백은 가장 기본적인 테스트 데이터 격리 전략이에요.',
      terms: [
        { t: '@Transactional', d: '테스트 메서드를 트랜잭션으로 감싸고, 종료 시 자동 롤백해요. 테스트 데이터 격리의 기본 전략이에요.' },
        { t: 'save(new User("temp"))', d: '테스트용 임시 데이터를 저장해요. INSERT SQL이 실행되지만, 롤백으로 DB에 남지 않아요.' },
        { t: 'count()', d: '현재 트랜잭션에서 보이는 전체 User 개수를 조회해요. 방금 저장한 temp도 포함돼요.' },
        { t: 'isGreaterThan(0)', d: 'count() 결과가 0보다 큰지 검증해요. 저장이 실행됐음을 확인하는 용도예요.' },
      ],
      expectedOutput:
        '[실행] User 저장 (트랜잭션 내)\n' +
        '[결과] 현재 트랜잭션 내 count: 1 (테스트 종료 후 롤백)',
      realWorldUsage:
        '실제 프로젝트에서 DB를 사용하는 통합 테스트는 거의 모두 @Transactional을 기본으로 써요. 100개의 테스트가 각각 INSERT를 실행해도, 모두 롤백되니 DB 상태가 항상 깨끗하게 유지돼요. 단, 롤백되지 않는 걸 확인해야 하는 테스트(예: 실제 DB 제약조건 검증)는 @Rollback(false)로 의도적으로 커밋해요.',
      why: '테스트 데이터가 DB에 남아 다른 테스트를 오염시키거나, 운영 DB를 실수로 더럽히는 걸 방지하려고요.',
      pitfall: '롤백을 원하지 않으면 @Rollback(false)나 @Commit을 테스트에 붙이세요. 단, 이 경우 테스트 간 데이터 간섭을 막기 위해 @BeforeEach에서 수동 정리 코드를 작성해야 해요.',
    },
  },
];
