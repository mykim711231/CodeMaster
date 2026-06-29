# Architecture
## Official Documentation
- [Spring Cloud](https://spring.io/projects/spring-cloud)
## 핵심 개념
> Spring Cloud는 마이크로서비스 아키텍처에서 필수적인 서비스 디스커버리(Eureka), 구성 관리(Config Server), API 게이트웨이(Gateway), 서킷 브레이커(Resilience4j), 분산 트레이싱(Micrometer Tracing) 등 분산 시스템 패턴을 통합 제공한다. Spring Boot의 자동 설정과 결합되어 최소한의 구성으로 클라우드 네이티브 애플리케이션을 구축할 수 있으며, Netflix OSS 스택에서 Spring 자체 구현체로 점진적으로 전환되고 있다.
## 학습 목표
- Spring Cloud Netflix Eureka를 이용한 서비스 레지스트리 및 디스커버리를 구성할 수 있다.
- Spring Cloud Config Server로 중앙 집중식 외부 구성을 관리하고 `@RefreshScope`로 런타임 갱신을 처리할 수 있다.
- Spring Cloud Gateway로 라우팅, 필터, 로드밸런싱을 구현할 수 있다.
- Spring Cloud OpenFeign으로 선언적 HTTP 클라이언트를 작성하고 서비스 간 통신을 간소화할 수 있다.
- Resilience4j CircuitBreaker + Retry로 장애 전파를 방지하고 폴백(fallback) 메서드를 구성할 수 있다.
- Spring Cloud LoadBalancer로 클라이언트 사이드 로드밸런싱을 적용할 수 있다.
- Spring Cloud Bus + RabbitMQ/Kafka로 구성 변경 이벤트를 브로드캐스트할 수 있다.
## 예제 코드
```java
@SpringBootApplication
@EnableEurekaServer
public class DiscoveryServerApplication {
    public static void main(String[] args) {
        SpringApplication.run(DiscoveryServerApplication.class, args);
    }
}
```
```java
@FeignClient(name = "order-service", fallbackFactory = OrderClientFallbackFactory.class)
public interface OrderClient {

    @GetMapping("/orders/{id}")
    Order getOrder(@PathVariable Long id);

    @PostMapping("/orders")
    Order createOrder(@RequestBody OrderRequest request);
}

@Component
class OrderClientFallbackFactory implements FallbackFactory<OrderClient> {
    @Override
    public OrderClient create(Throwable cause) {
        return new OrderClient() {
            @Override
            public Order getOrder(Long id) {
                return Order.fallback(id);
            }

            @Override
            public Order createOrder(OrderRequest request) {
                throw new ServiceUnavailableException("Order service is unavailable");
            }
        };
    }
}
```
```yaml
# Gateway routes
spring:
  cloud:
    gateway:
      routes:
        - id: user-service
          uri: lb://user-service
          predicates:
            - Path=/api/users/**
          filters:
            - StripPrefix=1
            - name: CircuitBreaker
              args:
                name: userServiceCB
                fallbackUri: forward:/fallback/users
        - id: order-service
          uri: lb://order-service
          predicates:
            - Path=/api/orders/**
          filters:
            - StripPrefix=1
            - name: Retry
              args:
                retries: 3
                statuses: BAD_GATEWAY, SERVICE_UNAVAILABLE

resilience4j:
  circuitbreaker:
    instances:
      userServiceCB:
        slidingWindowSize: 10
        failureRateThreshold: 50
        waitDurationInOpenState: 10s
```
## 주요 패턴
- Service Discovery: Eureka 서버에 서비스가 등록되고, 클라이언트는 `lb://service-name`으로 논리적 이름을 통해 호출
- API Gateway: 모든 외부 요청의 단일 진입점으로 라우팅, 인증, 로드밸런싱, 서킷 브레이커를 중앙에서 처리
- Centralized Configuration: Config Server + Git 저장소로 모든 마이크로서비스의 설정을 외부화하고 `@RefreshScope`로 재시작 없이 갱신
- Circuit Breaker + Fallback: 장애 서비스에 대한 연쇄 실패를 차단하고, 폴백 응답으로 graceful degradation 구현
- Saga Pattern (분산 트랜잭션): Choreography 또는 Orchestration 방식으로 여러 서비스에 걸친 데이터 일관성 보장
## 주의사항
- Spring Cloud 2022.0.x부터 `spring-cloud-starter-netflix-ribbon`이 제거되었고, Spring Cloud LoadBalancer로 대체되었다.
- Spring Cloud 2023.0.x부터 `spring-cloud-sleuth`가 Micrometer Tracing으로 대체되었으므로 Sleuth 의존성은 더 이상 사용하지 않는다.
- Eureka 서버 자체가 SPOF(Single Point of Failure)가 되지 않도록 피어 인식(peer awareness) 클러스터로 구성해야 한다.
- Config Server의 Git 저장소 접근을 위해 개인 리포지토리 사용 시 SSH 키나 Personal Access Token을 안전하게 관리해야 한다.
- 서킷 브레이커의 `waitDurationInOpenState`(반개방 전환 대기 시간)를 너무 짧게 설정하면 장애가 지속되어도 계속 재시도하게 되어 시스템 부하가 증가할 수 있다.
