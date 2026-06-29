# Design Pattern
## Official Documentation
- [Design Patterns (Java)](https://refactoring.guru/design-patterns/java)
## 핵심 개념
> 디자인 패턴은 소프트웨어 설계에서 반복적으로 발생하는 문제에 대한 검증된 해결책을 제공하며, 생성(Creational), 구조(Structural), 행위(Behavioral)의 세 가지 범주로 분류된다. Spring 프레임워크 자체도 싱글톤(Bean Scope), 프록시(AOP), 템플릿 메서드(JdbcTemplate), 전략(ResourceResolver) 등 다수의 GoF 패턴을 내부적으로 활용한다. 패턴을 이해하면 Spring Boot의 동작 원리를 더 깊이 파악할 수 있고, 유지보수성과 확장성이 높은 코드를 작성할 수 있다.
## 학습 목표
- 싱글톤 패턴과 Spring의 기본 Bean Scope(싱글톤)의 관계를 이해할 수 있다.
- 팩토리 메서드 / 추상 팩토리 패턴으로 객체 생성 로직을 캡슐화할 수 있다.
- 빌더 패턴으로 복잡한 객체를 단계적으로 구성하고 Lombok `@Builder`와 연계할 수 있다.
- 전략 패턴으로 런타임에 알고리즘을 교체하고 `@Service` + 인터페이스로 Spring DI와 결합할 수 있다.
- 옵저버 패턴을 Spring의 `ApplicationEvent` / `@EventListener`로 구현할 수 있다.
- 템플릿 메서드 패턴이 `JdbcTemplate`, `RestTemplate`, `KafkaTemplate` 등에서 어떻게 적용되었는지 이해할 수 있다.
- 데코레이터 / 프록시 패턴과 Spring AOP(@Transactional, @Cacheable)의 관계를 설명할 수 있다.
- 어댑터 패턴으로 외부 API 응답을 도메인 모델로 변환하는 레이어(Port-Adapter)를 구현할 수 있다.
## 예제 코드
```java
// 전략 패턴 - 결제 방식에 따라 전략 교체
public interface PaymentStrategy {
    PayResult pay(PayRequest request);
}

@Component("CREDIT_CARD")
class CreditCardPayment implements PaymentStrategy {
    public PayResult pay(PayRequest request) {
        return new PayResult("CARD", request.amount(), "approved");
    }
}

@Component("KAKAO_PAY")
class KakaoPayPayment implements PaymentStrategy {
    public PayResult pay(PayRequest request) {
        return new PayResult("KAKAO", request.amount(), "approved");
    }
}

@Service
class PaymentService {
    private final Map<String, PaymentStrategy> strategies;

    public PaymentService(List<PaymentStrategy> strategyList) {
        this.strategies = strategyList.stream()
                .collect(Collectors.toMap(
                        s -> s.getClass().getAnnotation(Component.class).value(),
                        Function.identity()));
    }

    public PayResult process(PayRequest request) {
        PaymentStrategy strategy = strategies.get(request.method());
        if (strategy == null) throw new IllegalArgumentException("Unknown method");
        return strategy.pay(request);
    }
}
```
```java
// 옵저버 패턴 - Spring Events
@Data
public class OrderPlacedEvent {
    private final Long orderId;
    private final String userId;
}

@Component
class EmailNotificationListener {
    @EventListener
    @Async
    public void handle(OrderPlacedEvent event) {
        emailService.send(event.getUserId(), "Your order #" + event.getOrderId() + " is placed");
    }
}

@Component
class InventoryUpdateListener {
    @EventListener
    @Order(1)
    public void handle(OrderPlacedEvent event) {
        inventoryService.deduct(event.getOrderId());
    }
}

@Service
class OrderService {
    private final ApplicationEventPublisher publisher;

    @Transactional
    public Order placeOrder(OrderRequest request) {
        Order order = orderRepository.save(new Order(request));
        publisher.publishEvent(new OrderPlacedEvent(order.getId(), request.getUserId()));
        return order;
    }
}
```
```java
// 빌더 패턴 - Lombok @Builder + 도메인 객체
@Builder
@Getter
public class User {
    private final Long id;
    private final String name;
    private final String email;
    private final Integer age;
    private final LocalDateTime createdAt;

    public static User createDefault(String name, String email) {
        return User.builder()
                .name(name)
                .email(email)
                .createdAt(LocalDateTime.now())
                .build();
    }
}
```
## 주요 패턴
- 싱글톤: Spring IoC 컨테이너의 기본 Bean Scope — 하나의 빈 인스턴스가 컨테이너 내에서 공유됨
- 팩토리 메서드: Spring의 `@Bean` 메서드, `FactoryBean<T>` 인터페이스로 객체 생성 로직을 추상화
- 전략: 인터페이스 + 여러 `@Component` 구현체를 주입받아 런타임에 알고리즘 분기 제거
- 옵저버: `ApplicationEvent` + `@EventListener`로 모듈 간 느슨한 결합을 유지하며 이벤트 기반 통신
- 템플릿 메서드: `JdbcTemplate`, `RedisTemplate`, `RestTemplate` 등에서 반복적인 보일러플레이트(연결, 해제, 예외 처리)를 숨기고 핵심 로직만 노출
- 프록시: Spring AOP — `@Transactional`, `@Cacheable`, `@Async` 등이 프록시 객체를 통해 횡단 관심사를 주입
- 데코레이터: BeanPostProcessor, `@Decorated` 어노테이션 등으로 기존 빈에 부가 기능을 동적으로 추가
- 어댑터: 외부 API DTO ↔ 도메인 모델 변환 계층을 분리하여 외부 의존성 변화가 도메인으로 전파되는 것을 방지
## 주의사항
- 싱글톤 빈에 상태(멤버 변수)를 저장하면 동시성 문제가 발생하므로, 상태는 메서드 파라미터나 프로토타입 빈으로 분리해야 한다.
- 전략 패턴의 구현체를 `List<>`로 주입받을 때 주입 순서가 보장되지 않으므로, 순서가 필요하면 `@Order`나 명시적 Map 키 전략을 사용한다.
- Spring AOP는 프록시 기반이므로 `private` 메서드에는 `@Transactional`, `@Async` 등이 적용되지 않는다.
- 디자인 패턴을 과도하게 적용하면 오히려 코드 복잡도가 증가하므로, 실제로 해결해야 할 문제가 있을 때만 적용한다.
- `ApplicationEvent`는 기본적으로 동기 실행되므로, 시간이 오래 걸리는 리스너는 `@Async`로 비동기 처리해야 한다.
