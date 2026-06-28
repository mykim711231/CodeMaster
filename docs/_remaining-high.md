# 2차 재검토 — 잔존 High 이슈 (파일별)

### D:\_Git_PWA\CodeMaster\src\content\packs\_staging\L2-sc.ts
- [sc-qualifier-custom] 문제: @Sms 어노테이션의 @Target이 {FIELD, PARAMETER}만 포함하는데, 39번 줄에서 클래스(SmsSenderImpl)에 @Sms를 붙이고 있어 ElementType.TYPE이 없어 컴파일 오류가 발생한다. `@Component @Sms public class SmsSenderImpl`에서 @Sms는 TYPE 위치에 사용되므로 @Target에 TYPE이 없으면 javac가 거부한다.
  수정안: @Target 선언에 ElementType.TYPE을 추가한다: `@Target({ElementType.FIELD, ElementType.PARAMETER, ElementType.TYPE})`
- [sc-profile-active] 문제: `SpringApplication.setAdditionalProfiles(String... profiles)`는 Spring Boot 2.4에서 deprecated 되었고 Spring Boot 3.0에서 완전히 제거된 메서드다. Spring Boot 3.4 기준으로 이 메서드는 존재하지 않아 컴파일 오류가 발생한다. 스니펫 제목과 설명은 Spring Boot 3.4를 대상으로 하는 콘텐츠 기준에 맞지 않는 제거된 API다.
  수정안: `setAdditionalProfiles` 대신 `SpringApplicationBuilder.profiles("dev")` 또는 `app.setDefaultProperties(Map.of("spring.profiles.active", "dev"))`를 사용하거나, 코드를 `SpringApplication.run(AppLauncher.class, args)` 후 환경 변수·properties 방식으로 교체한다.

### D:\_Git_PWA\CodeMaster\src\content\packs\_staging\L3-mvc.ts
- [mvc-rest-controller] 문제: terms 항목에서 `return`을 '응답 본문(JSON)이 됨'으로 설명하고 concept에서도 '반환값을 JSON으로 바꿔주는'이라고 하지만, String 반환은 StringHttpMessageConverter를 통해 text/plain으로 직렬화되며 JSON이 아닙니다. JSON 응답은 객체(POJO/record)를 반환할 때만 MappingJackson2HttpMessageConverter가 동작합니다. 입문자에게 'String return = JSON'이라는 잘못된 지식을 심어줍니다.
  수정안: concept를 '@RestController는 반환값을 HTTP 응답 본문으로 직접 써주는 API 전용 컨트롤러예요. 객체를 반환하면 JSON으로, String을 반환하면 텍스트로 변환돼요.'로 수정하고, terms의 return 항목을 '반환 값이 뷰 이름이 아니라 응답 본문이 됨 (String이면 text/plain, 객체면 JSON)'으로 수정하세요.

### D:\_Git_PWA\CodeMaster\src\content\packs\_staging\L5-conc.ts
- [conc-callable-future] 문제: future.get()는 InterruptedException과 ExecutionException 두 개의 checked 예외를 던집니다. 코드 어디에도 try-catch나 throws 선언이 없어 컴파일 불가입니다. 동일 파일의 conc-blocking-queue·conc-count-down-latch는 InterruptedException을 try-catch로 올바르게 처리하는데, 이 스니펫만 처리를 누락했습니다. 입문자에게 Future.get() 사용 시 예외 처리가 선택적인 것처럼 잘못된 지식을 심어줍니다.
  수정안: future.get() 호출을 try { Integer result = future.get(); } catch (InterruptedException e) { Thread.currentThread().interrupt(); } catch (ExecutionException e) { throw new RuntimeException(e); } 로 감싸세요. pitfall 텍스트에도 'get()은 InterruptedException·ExecutionException을 던지므로 반드시 처리해야 해요'를 추가하세요.
- [conc-semaphore] 문제: Semaphore.acquire()는 InterruptedException(checked 예외)을 던집니다. 코드에 try-catch가 전혀 없어 컴파일 불가입니다. conc-blocking-queue·conc-count-down-latch는 동일한 checked 예외를 try-catch로 처리하는데 이 스니펫만 누락되었습니다. 입문자에게 acquire()가 예외를 던지지 않는 것처럼 오해시킵니다.
  수정안: sem.acquire(); 를 try { sem.acquire(); } catch (InterruptedException e) { Thread.currentThread().interrupt(); } 로 교체하고, try 블록 안에 accessResource()를 넣은 뒤 finally { sem.release(); } 로 구성하세요.

### D:\_Git_PWA\CodeMaster\src\content\packs\_staging\L6-net.ts
- [net-nio-socketchannel] 문제: Thread.sleep(10) 은 checked 예외 InterruptedException 을 던지므로 try/catch 없이는 Java 어느 컨텍스트에서도 컴파일 불가. 이 코드는 독립 스니펫 수준이 아니라 문법 자체가 위반이다.
  수정안: while 루프 본문을 try { Thread.sleep(10); } catch (InterruptedException e) { Thread.currentThread().interrupt(); break; } 로 감싸거나, sleep 대신 Selector 기반 대기로 교체하라.
- [net-multithread-server] 문제: handle(client) 메서드가 이 스니펫 어디에도 정의되지 않아 독립 스니펫 기준 컴파일 불가. 파일 전체에도 handle 메서드 정의가 없다.
  수정안: 스니펫 안에 private static void handle(Socket client) { ... } 스텁을 추가하거나, 람다 본문을 인라인 코드(try (InputStream in = client.getInputStream()) { ... })로 교체하라.
- [net-nio-selector] 문제: handleAccept(key) 메서드가 이 스니펫 및 파일 전체에 정의되지 않아 독립 스니펫 기준 컴파일 불가.
  수정안: 스니펫 안에 private static void handleAccept(SelectionKey key) throws IOException { ... } 스텁을 추가하거나, 인라인으로 accept 처리 코드를 직접 작성하라.
- [net-netty-decoder] 문제: LineHandler 클래스가 이 스니펫 및 파일 전체 어디에도 정의되지 않아 독립 스니펫 기준 컴파일 불가.
  수정안: 파일에 LineHandler를 정의하는 별도 스니펫을 추가하거나, childHandler 안에 LineHandler 스텁 클래스를 인라인으로 넣어라.
- [net-netty-client-bootstrap] 문제: ClientHandler 클래스가 이 스니펫 및 파일 전체 어디에도 정의되지 않아 독립 스니펫 기준 컴파일 불가. 추가로 ch.writeAndFlush("hello\n") 은 파이프라인에 StringEncoder 가 없는 상태에서 String 을 직접 쓰므로 런타임에 io.netty.handler.codec.EncoderException 이 발생한다.
  수정안: ClientHandler 스텁을 정의하라. writeAndFlush 앞 파이프라인에 .addLast(new StringEncoder()) 를 추가하거나, ByteBuffer/ByteBuf 로 변환해서 보내라.

### D:\_Git_PWA\CodeMaster\src\content\packs\_staging\L7-gw.ts
- [gw-predicate-method] 문제: pitfall 설명이 명백히 틀렸습니다. 'method와 path를 and()로 엮지 않으면 or로 해석될 수 있어요'라고 하지만, Spring Cloud Gateway Java DSL에서 method("GET")은 BooleanSpec을 반환하며 BooleanSpec에는 path() 메서드가 없습니다. 따라서 and() 없이 .path()를 직접 호출하면 OR로 해석되는 게 아니라 컴파일 에러(no such method)가 발생합니다. SCG DSL에는 암묵적 OR 해석이 존재하지 않으며, 모든 체인은 명시적 .and()/.or() 로만 구성됩니다. 입문자에게 잘못된 동작 모델(OR 해석)을 심어주는 High 수준 개념 오류입니다.
  수정안: pitfall을 다음과 같이 수정하세요: 'and() 없이 method() 뒤에 바로 path()를 호출하면 컴파일 에러가 발생해요. BooleanSpec에는 path()가 없으므로, 반드시 .and()로 PredicateSpec으로 돌아온 뒤 다음 조건을 추가해야 해요.'

### D:\_Git_PWA\CodeMaster\src\content\packs\_staging\L8-msg.ts
- [msg-event-publisher] 문제: publisher.publishEvent(new OrderPlaced(id)) 가 OrderPlaced 를 단일 String 인수로 생성하지만, 동일 팩의 msg-event-record 에서 정의된 레코드는 public record OrderPlaced(String id, boolean vip) 로 두 개의 컴포넌트를 요구한다. 이 스니펫은 @Service 완성 클래스이므로 독립 컴파일 기준이 적용되며, 생성자 아리티 불일치로 컴파일 에러가 발생한다. msg-event-conditional 의 #event.vip 참조도 vip 필드가 존재함을 전제하므로, 팩 전체에서 OrderPlaced 는 2-필드 레코드로 일관되어야 한다.
  수정안: new OrderPlaced(id) 를 new OrderPlaced(id, false) (또는 의미상 적절한 boolean 리터럴)로 수정한다. 예: publisher.publishEvent(new OrderPlaced(id, false)); — 또는 place() 메서드 시그니처를 place(String id, boolean vip) 로 바꿔 vip 를 인수로 전달한다.

### D:\_Git_PWA\CodeMaster\src\content\packs\_staging\L9-batch.ts
- [batch-job-parameters] 문제: @StepScope를 Step 빈 자체에 붙이는 것은 잘못된 사용이다. Spring Batch 5에서 @StepScope는 Step이 사용하는 컴포넌트(Reader·Writer·Processor·Tasklet 빈)에 붙이는 것이며, Step 빈 자체에 붙이면 Spring이 Step 객체 주변에 스코프 프록시를 생성해 StepLocator/JobRepository가 Step을 정상적으로 참조하지 못하고 ScopeNotActiveException 또는 프록시 해석 오류가 발생한다. jobParameters를 Step 팩토리 메서드에 주입하려면 @JobScope를 사용해야 한다. 입문자에게 잘못된 스코프 사용법을 가르친다.
  수정안: @StepScope를 @JobScope로 교체한다. 즉 '@Bean\n@StepScope\npublic Step paramStep(...)' → '@Bean\n@JobScope\npublic Step paramStep(...)'
- [batch-step-scope] 문제: @Bean 메서드 본문에서 loadByDate(date)를 호출하지만 해당 메서드가 스니펫 어디에도 정의되어 있지 않다. 독립 스니펫 기준으로 미정의 메서드 참조이므로 컴파일 오류가 발생한다.
  수정안: loadByDate(date) 호출을 스니펫 안에서 해소해야 한다. 예를 들어 인라인 플레이스홀더로 'List<String> data = /* 날짜별 데이터 로드 */ List.of("2026-06-28");' 처럼 대체하거나, 클래스 외부에 private static List<String> loadByDate(String date) { ... } 헬퍼를 포함하는 전체 클래스 형식으로 스니펫을 확장해야 한다.

### D:\_Git_PWA\CodeMaster\src\content\packs\_staging\L10-sec.ts
- [sec-security-context] 문제: isAuthenticated() 가드가 익명 사용자를 걸러내지 못함. Spring Security는 미인증 요청에도 AnonymousAuthenticationToken을 SecurityContext에 주입하고, AnonymousAuthenticationToken.isAuthenticated()는 true를 반환한다. 따라서 auth == null || !auth.isAuthenticated() 조건은 익명 사용자에서 절대 true가 되지 않으며 IllegalStateException이 던져지지 않는다. auth.getName()은 'anonymousUser'를 반환하고, 이를 실제 로그인 사용자로 오인하게 된다. 입문자에게 잘못된 보안 패턴을 가르치는 개념 오류.
  수정안: 가드 조건에 instanceof AnonymousAuthenticationToken 검사를 추가해야 한다. 올바른 코드: if (auth == null || !auth.isAuthenticated() || auth instanceof AnonymousAuthenticationToken) { throw new IllegalStateException(...); } 또는 principal instanceof UserDetails 여부로 판별. explain.concept에도 '익명 인증 토큰까지 확인해야 진짜 로그인 여부를 알 수 있어요'라는 설명을 보완해야 한다.

### D:\_Git_PWA\CodeMaster\src\content\packs\_staging\L11-cache.ts
- [cache-cacheevict] 문제: pitfall 설명이 사실과 다릅니다. '`key`를 빼먹으면 의도한 항목이 안 지워져요'라고 했지만, Spring Cache의 기본 키 생성 전략은 메서드 인자를 그대로 키로 사용합니다. `deleteUser(Long id)`처럼 인자가 `id` 하나뿐일 때 `key`를 생략하면 `id` 값이 기본 키로 사용되어 의도한 항목이 정상적으로 삭제됩니다. 즉 이 pitfall은 입문자에게 실제로는 문제가 없는 상황을 위험한 것처럼 잘못 가르칩니다.
  수정안: pitfall을 사실에 맞게 수정하세요. 예: 'key를 생략하면 Spring이 메서드 인자(여기서는 id)를 기본 키로 씁니다. 단, 인자가 여러 개이거나 키 생성 규칙이 @Cacheable과 다를 때는 key를 명시적으로 지정해야 일관성이 유지돼요.'

### D:\_Git_PWA\CodeMaster\src\content\packs\_staging\L13-test.ts
- [test-disabled] 문제: @Mock ExternalApi externalApi를 선언했지만 클래스에 @ExtendWith(MockitoExtension.class)가 없다. JUnit5에서 Mockito 애노테이션(@Mock 등)은 MockitoExtension이 없으면 처리되지 않아 externalApi는 null로 남는다. @Disabled라서 지금은 실행이 안 되지만, 주석 해제 시 externalApi.status() 호출에서 NullPointerException이 발생한다. 입문자에게 @Mock만으로 충분하다는 잘못된 패턴을 가르치는 개념 오류다.
  수정안: class FlakyTest 선언 위에 @ExtendWith(MockitoExtension.class)를 추가해야 한다. 예: @ExtendWith(MockitoExtension.class) class FlakyTest { @Mock ExternalApi externalApi; ... }

### D:\_Git_PWA\CodeMaster\src\content\packs\_staging\L14-arch.ts
- [arch-dto-request-response] 문제: 파일명 UserDto.java 하나에 `public record UserRequest`와 `public record UserResponse` 두 개의 public 타입이 선언되어 있습니다. Java에서는 .java 파일 하나에 public 최상위 타입이 최대 1개여야 하며, 그 이름은 파일명과 일치해야 합니다. 이 코드를 UserDto.java로 저장하면 `error: class UserRequest is public, should be declared in a file named UserRequest.java` 컴파일 에러가 발생합니다.
  수정안: 두 record를 각각 UserRequest.java, UserResponse.java로 분리하거나, 한 파일에 보여줄 경우 하나를 package-private(`public` 제거)으로 바꾸거나 파일명을 복수형 주석으로 분명히 표시해야 합니다.
- [arch-hexagonal-port] 문제: 파일명 LoadUserPort.java 하나에 `public interface LoadUserPort`와 `public interface SaveUserPort` 두 개의 public 인터페이스가 선언되어 있습니다. Java 규칙상 파일 하나에 public 최상위 타입은 1개만 허용됩니다. SaveUserPort는 별도 파일이 아닌 이상 public으로 선언할 수 없어 컴파일 에러가 발생합니다.
  수정안: LoadUserPort.java와 SaveUserPort.java로 파일을 분리하거나, SaveUserPort에서 public 접근 제어자를 제거(package-private)해야 합니다. 교육용이라면 // File: SaveUserPort.java 주석으로 파일 경계를 명확히 표시하세요.
- [arch-event-sourcing-store] 문제: 3가지 컴파일 에러가 있습니다. (1) 파일명 EventStore.java에 `public interface EventStore`와 `public class JpaEventStore` 두 public 타입이 공존해 컴파일 에러. (2) JpaEventStore가 EventStore를 구현한다고 선언했으나 `load(OrderId)` 와 `loadFrom(OrderId, long)` 메서드를 구현하지 않아 abstract class 에러 발생. (3) JpaEventStore 내부에서 `eventRepository`(필드)와 `loadVersion(id)`(메서드)를 참조하지만 해당 클래스 내에 선언이 없어 컴파일 에러.
  수정안: EventStore.java와 JpaEventStore.java로 분리. JpaEventStore에 load()와 loadFrom() 구현 추가. eventRepository 필드와 loadVersion() 메서드(또는 파라미터)를 클래스 내에 선언해야 합니다. 교육용 축약이라면 // ... 생략 주석과 함께 implements 선언을 제거하거나 abstract class로 표시하세요.
- [arch-event-sourcing-replay] 문제: 파일명 Order.java 하나에 `public class OrderFactory`와 `public class Order` 두 개의 public 클래스가 선언되어 있습니다. Java에서는 파일명과 일치하는 public 타입만 1개 허용됩니다. OrderFactory는 public이므로 반드시 OrderFactory.java에 있어야 하며, 현재 상태는 컴파일 에러입니다.
  수정안: OrderFactory.java와 Order.java로 파일을 분리하거나, OrderFactory에서 public 접근 제어자를 제거(package-private)해야 합니다. 교육용이라면 // File: OrderFactory.java / // File: Order.java 형태의 주석으로 파일 경계를 명시하세요.

### D:\_Git_PWA\CodeMaster\src\content\packs\_staging\L15-dp.ts
- [dp-builder-lombok] 문제: ProductDto 클래스 닫힘 } 이후에 실행 가능한 Java 문(ProductDto dto = ProductDto.builder()...build(); 및 ProductDto cheaper = dto.toBuilder().price(25000).build();)이 클래스·메서드 밖에 위치한다. Java에서 최상위 레벨에는 선언(클래스·인터페이스 등)만 허용되며 실행 문은 반드시 메서드 안에 있어야 한다. 이 코드는 컴파일 불가(top-level statement).
  수정안: 사용 예시를 클래스 외부에 두지 말고, // 사용 예 블록 전체를 주석으로 처리(/* ... */)하거나, 별도 main() 메서드 또는 static 블록 안으로 이동시켜야 한다. 예: public class Example { public static void main(String[] args) { ProductDto dto = ProductDto.builder().name("자바 책").price(30000).inStock(true).build(); ProductDto cheaper = dto.toBuilder().price(25000).build(); } }

### D:\_Git_PWA\CodeMaster\src\content\packs\_staging\L16-devops.ts
- [devops-dockerfile-multistage] 문제: FROM gradle:8.10-jdk21 AS build — 이 Docker 이미지 태그는 Docker Hub에 존재하지 않는다. 공식 gradle 이미지는 패치 버전까지 포함한 태그만 제공한다(gradle:8.10.0-jdk21, gradle:8.10.1-jdk21). gradle:8.10-jdk21 은 'manifest unknown' 오류로 docker build 자체가 실패한다.
  수정안: FROM gradle:8.10.1-jdk21 AS build 로 교체. 또는 gradle:8-jdk21 (최신 8.x 유동 태그)을 쓸 수도 있으나, 재현성을 위해 패치 버전까지 고정하는 8.10.1-jdk21 을 권장.

### D:\_Git_PWA\CodeMaster\src\content\packs\_staging\L17-obs.ts
- [obs-mdc-context] 문제: doFilterInternal() 메서드 선언에 'throws ServletException, IOException'이 없음. chain.doFilter(req, res)는 IOException과 ServletException(둘 다 checked 예외)을 선언하는데, try-finally만으로는 이 예외들이 처리되지 않는다. @Override 대상인 OncePerRequestFilter.doFilterInternal()은 'throws ServletException, IOException'을 선언하므로 재정의 메서드에서도 선언이 필요하다. 이 상태로는 컴파일 에러가 발생한다. 추가로 HttpServletRequest, HttpServletResponse, FilterChain(jakarta.servlet.*), UUID(java.util.UUID) 등 4개 타입에 대한 import가 없어 독립 스니펫 기준 undefined type 참조 에러도 발생한다.
  수정안: 메서드 시그니처를 'protected void doFilterInternal(HttpServletRequest req, HttpServletResponse res, FilterChain chain) throws ServletException, IOException {'으로 수정하고, 누락된 import 4개를 추가: import jakarta.servlet.FilterChain; import jakarta.servlet.ServletException; import jakarta.servlet.http.HttpServletRequest; import jakarta.servlet.http.HttpServletResponse; import java.util.UUID;

### D:\_Git_PWA\CodeMaster\src\content\packs\_staging\L18-data.ts
- [data-querydsl-order] 문제: 메서드 시그니처에 String field 파라미터가 선언됐지만 메서드 본문에서 단 한 번도 사용되지 않는다. 정렬 컬럼은 항상 user.name으로 고정되어 있다. 제목('동적 정렬')과 pitfall 설명('동적 필드명을 직접 문자열로 넣으면 인젝션 위험')은 field 파라미터가 동적 컬럼 선택에 쓰여야 함을 암시하지만, 실제 코드는 이를 구현하지 않는다. 학습자가 이 코드를 복사하면 'field' 인자가 완전히 무시되는 버그를 그대로 갖게 된다.
  수정안: 방향 토글만 보여주는 예제라면 field 파라미터를 제거하고 메서드 시그니처를 'sorted(boolean asc)'로 단순화하라. 동적 필드+방향 선택을 보여주는 예제라면, 예를 들어 Map<String, ComparableExpressionBase<?>> fieldMap을 만들어 field 값으로 Q필드를 매핑한 뒤 OrderSpecifier를 생성하는 코드를 추가하라. pitfall도 그에 맞게 수정하라.

### D:\_Git_PWA\CodeMaster\src\content\packs\_staging\L19-resil.ts
- [resil-combo] 문제: concept, terms, pitfall 모두 Bulkhead가 가장 바깥(outermost), Retry가 가장 안쪽(innermost)이라고 설명하지만, Resilience4j 공식 문서(getting-started-3)의 기본 aspect 순서는 정반대입니다. 기본값은 Retry(outermost) → CircuitBreaker → RateLimiter → TimeLimiter → Bulkhead(innermost)입니다. terms에서 '@Retry — 가장 안쪽', '@Bulkhead — 가장 바깥'이라 표기하고, pitfall에서 '보통 Bulkhead → CircuitBreaker → Retry 순이에요'라고 명시한 것은 입문자에게 틀린 지식을 전달합니다.
  수정안: terms를 '@Retry — 가장 바깥(outermost)', '@CircuitBreaker — 중간', '@Bulkhead — 가장 안쪽(innermost)'으로 수정하고, pitfall을 '기본 순서는 Retry → CircuitBreaker → Bulkhead 예요(Retry가 가장 바깥). 순서를 바꾸려면 각 aspect의 aspectOrder 프로퍼티를 명시적으로 설정하세요'로 수정해야 합니다.

### D:\_Git_PWA\CodeMaster\src\content\packs\_staging\P2-pasync.ts
- [pasync-lock-critical] 문제: why 설명이 명백히 틀린 개념을 전달함. '여러 코루틴이 같은 값을 동시에 만지면 한 번 더해도 안 더해진 것처럼 보여요'는 asyncio에서 사실이 아님. asyncio는 단일 스레드 협력형 모델이라 await 없이는 컨텍스트 전환이 일어나지 않고, balance[0] += 1처럼 await가 없는 단순 연산은 락 없이도 항상 안전함(경쟁 조건 불가). 실제 실험으로도 100개 코루틴이 락 없이 += 1을 해도 항상 100이 나옴. 이 설명은 asyncio를 threading과 동일한 race condition 모델로 오해시켜 입문자에게 잘못된 지식을 심음.
  수정안: why를 다음과 같이 수정: '코루틴이 await를 사이에 두고 여러 단계로 공유 자원을 바꿀 때, 중간에 다른 코루틴이 끼어들어 값이 꼬일 수 있어요. await 없는 단순 += 은 자동으로 안전하지만, 읽기-수정-쓰기 사이에 await가 있는 경우에는 Lock이 필요해요.' 또한 코드 예시도 lock이 실제로 필요한 시나리오(critical section 안에 await 포함)로 교체하는 것이 이상적.

### D:\_Git_PWA\CodeMaster\src\content\packs\_staging\P5-pdl.ts
- [pdl-optimizer] 문제: pitfall 설명이 명백히 틀린 개념을 가르친다. '반드시 zero_grad → 순전파 → 손실 → backward → step 순서로 써요'라고 적혔으나, zero_grad()는 backward() 이전이면 충분하고 순전파(forward) 이전일 필요가 없다. 실제로 같은 파일의 pdl-training-loop 스니펫은 pred → loss → zero_grad → backward → step 순서로 작성돼 있으며 정상 동작한다. 이 pitfall 텍스트를 읽은 입문자는 'zero_grad를 forward 전에 반드시 써야 한다'는 잘못된 규칙을 학습하게 된다.
  수정안: pitfall을 '반드시 zero_grad는 backward() 직전에 호출해야 해요. 순전파·손실 계산 후에 호출해도 되지만, backward() 이후에 쓰면 기울기가 이미 누적된 뒤라 효과가 없어요. 올바른 흐름: 순전파 → 손실 → zero_grad → backward → step'으로 수정한다.

### D:\_Git_PWA\CodeMaster\src\content\packs\_staging\P7-prag.ts
- [prag-recursive-split] 문제: `seps = seps or [...]` 패턴이 빈 리스트 `[]`를 falsy로 처리해 기저 조건(base case)에 절대 도달하지 못함. 내부 재귀 호출 `rec_split(p, tail)`에서 tail=[]이 전달되면 `seps = [] or [default]`가 다시 기본 리스트로 교체되고, `if not seps` 분기는 영원히 False → RecursionError(스택 오버플로우) 발생. 80자를 넘고 구분자를 전혀 포함하지 않는 텍스트(예: `'A'*85`)로 호출하면 재현됨.
  수정안: `seps = seps or [...]` 한 줄을 `if seps is None: seps = ['\n\n', '\n', '. ', ' ']` 로 교체해야 함. 빈 리스트가 의도적으로 전달됐을 때 기본값으로 덮어쓰지 않아야 기저 조건이 정상 동작함.

### D:\_Git_PWA\CodeMaster\src\content\packs\_staging\P9-pframe.ts
- [pframe-memory-buffer] 문제: 잘못된 import 경로: `from langchain_community.memory import ConversationBufferMemory` — langchain_community 패키지에는 `memory` 서브모듈이 존재하지 않아 ImportError 발생. ConversationBufferMemory는 langchain 패키지(langchain.memory)에 있음.
  수정안: `from langchain_community.memory import ConversationBufferMemory` → `from langchain.memory import ConversationBufferMemory`
- [pframe-crew-role] 문제: 미정의 변수 참조: `Agent(... llm=llm)` 에서 `llm`이 해당 스니펫 내 어디에도 정의되지 않음. 독립 실행 시 `NameError: name 'llm' is not defined` 발생. 다른 스니펫과 달리 앞 예제 참조 주석도 없음.
  수정안: `llm=llm` 인자를 제거하거나 스니펫 상단에 `from langchain_openai import ChatOpenAI; llm = ChatOpenAI(model='gpt-4o-mini')` 추가
- [pframe-autogen-groupchat] 문제: 미정의 변수 참조: `agents=[a1, a2, a3]` 및 `a1.initiate_chat(...)` 에서 a1, a2, a3가 스니펫 내 정의되지 않음. 앞 예제(pframe-autogen-conversable)는 `assistant`만 정의하므로 연결도 불가. NameError 발생.
  수정안: 스니펫 상단에 `# 앞 예제에서 정의된 a1, a2, a3 에이전트 사용` 주석 추가 및 a1, a2, a3를 ConversableAgent로 정의하거나, 실제 에이전트 생성 코드를 포함
- [pframe-dspy-teleprompter] 문제: 필드 이름 불일치로 인한 런타임 오류: Summarizer 모듈은 `text->summary` 서명(forward(self, text))을 사용하는데, trainset은 `dspy.Example(question=..., answer=...)` 으로 `question/answer` 필드를 사용. compile 시 Summarizer에 `text` 대신 `question`이 전달되어 TypeError/KeyError 발생, metric이 `y.answer`를 참조하지만 예측 결과는 `.summary` 속성을 가져 AttributeError 발생.
  수정안: trainset을 `dspy.Example(text='짧은 글...', summary='요약').with_inputs('text')`로 수정하고, metric을 `lambda x, y, t: y.summary == x.summary`로 변경

### D:\_Git_PWA\CodeMaster\src\content\packs\_staging\P10-pprod.ts
- [pprod-ruff-lint] 문제: x*2 에 붙인 ruff 규칙 번호가 틀렸다. 코드 내 주석 '# E225: 연산자 주변 공백 없음'과 terms 설명 모두 E225를 언급하지만, 산술 연산자(*, +, -, /) 주위 공백 누락은 pycodestyle/ruff 기준으로 E226(Missing whitespace around arithmetic operator)이다. E225는 대입·비교·어노테이션 연산자(=, ==, !=, : 등) 주위 공백 누락에 적용된다. 게다가 ruff의 기본 선택 규칙 집합에서 E226은 비활성화 상태이므로, 기본 ruff 실행 시 x*2 는 아무 경고도 발생하지 않는다. 입문자가 E225를 학습한 뒤 실제 ruff를 실행하면 결과가 설명과 달라 혼란을 일으킨다.
  수정안: 코드 주석을 '# E226: 연산자 주변 공백 없음'으로 수정하고, terms 항목도 { t: 'x*2', d: 'E226: 산술 연산자(*) 주위 공백이 없어요. ruff에서는 기본적으로 비활성화되어 있어 select=["E226"]을 추가해야 경고가 나타나요. x * 2 로 써야 해요' }로 교체한다. 또는 E225 규칙에 실제로 해당하는 예시(예: a ==b 또는 x= 1)로 교체하는 것도 올바른 대안이다.

### D:\_Git_PWA\CodeMaster\src\content\packs\_staging\P12-pserve.ts
- [pserve-awq-config] 문제: AutoAWQ quantize() 의 첫 번째 필수 인자는 tokenizer인데, 코드에서 tokenizer를 완전히 생략하고 calib_data를 첫 번째 위치 인자로 넘기고 있음. 실제 시그니처: model.quantize(tokenizer, quant_config={}, calib_data='pileval', ...). 현재 코드 model.quantize(calib_data, quant_config=qcfg)는 calib_data(문자열 리스트)가 tokenizer 자리에 들어가므로 런타임 TypeError 발생. tokenizer를 별도로 로드하는 코드도 없음.
  수정안: tok = AutoTokenizer.from_pretrained('meta-llama/Llama-2-7b-hf') 를 추가한 뒤, model.quantize(calib_data, quant_config=qcfg) 를 model.quantize(tok, quant_config=qcfg, calib_data=calib_data) 로 수정해야 함.

### D:\_Git_PWA\CodeMaster\src\content\packs\_staging\P15-pqual.ts
- [pqual-llmeval-criteria] 문제: CriteriaEvalChain.from_llm(criteria="도움됨") 실행 시 ValueError 발생. langchain 내부에서 criteria 문자열을 Criteria enum으로 변환할 때 Criteria("도움됨")를 호출하는데, Criteria enum에는 'helpfulness', 'correctness', 'relevance' 등 영어 값만 존재하며 '도움됨'은 유효하지 않아 ValueError: '도움됨' is not a valid Criteria 가 발생함. 사용자 정의 기준을 쓰려면 dict 형태(예: {"도움됨": "답이 사용자에게 도움이 되는가"})로 전달해야 함.
  수정안: criteria="도움됨" → criteria={"도움됨": "답이 사용자의 질문에 도움이 되는가"} 또는 영어 predefined string criteria="helpfulness" 로 교체.
- [pqual-llmeval-binary] 문제: CriteriaEvalChain.from_llm(criteria="정확성") 실행 시 ValueError 발생. 위와 동일하게 '정확성'은 Criteria enum에 없으므로 Criteria("정확성")가 ValueError를 던짐. 이 스니펫은 '합격/불합격 이진 평가'임에도 실행 자체가 불가능한 코드임.
  수정안: criteria="정확성" → criteria={"정확성": "답이 사실에 부합하는가"} 또는 predefined string criteria="correctness" 로 교체.
