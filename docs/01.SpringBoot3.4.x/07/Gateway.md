# Gateway — Spring Cloud Gateway
## Official Documentation
- [Spring Cloud Gateway Reference Documentation](https://docs.spring.io/spring-cloud-gateway/reference/index.html)
- [Spring Boot + Spring Cloud Gateway Compatibility](https://docs.spring.io/spring-cloud-gateway/reference/spring-cloud-gateway/compatibility-matrix.html)
## 핵심 개념
> Spring Cloud Gateway는 Spring 6 / Spring Boot 3 기반의 리액티브 API 게이트웨이로, Netty 런타임 위에서 동작하며 논블로킹으로 라우팅·필터링을 수행한다. 경로 조건에 따라 요청을 적절한 백엔드 서비스로 전달하고, 인증·로깅·속도 제한 등 공통 관심사를 GatewayFilter로 처리한다. 전통적인 Servlet 기반 Zuul을 대체하는 MSA 진입점이다.
## 학습 목표
- Spring Initializr에서 Gateway 의존성 추가하고 프로젝트 초기화하기
- `RouteLocator` 빈으로 자바 코드 기반의 라우팅 규칙 정의하기
- `application.yml`에 `spring.cloud.gateway.routes` 로 선언적 라우팅 설정하기
- `GatewayFilter`와 `GlobalFilter` 로 인증·로깅·요청/응답 변조 구현하기
- Spring Cloud CircuitBreaker + Resilience4j 연동하여 장애 전파 방지하기
- `RateLimiter`(RequestRateLimiter)로 트래픽 제한 정책 적용하기
## 예제 코드
```java
@SpringBootApplication
public class GatewayApplication {
    public static void main(String[] args) {
        SpringApplication.run(GatewayApplication.class, args);
    }

    @Bean
    public RouteLocator customRoutes(RouteLocatorBuilder builder) {
        return builder.routes()
            .route("user-service", r -> r
                .path("/users/**")
                .filters(f -> f
                    .addRequestHeader("X-Gateway-Source", "cloud-gw")
                    .circuitBreaker(c -> c
                        .setName("userCircuit")
                        .setFallbackUri("forward:/fallback/users")))
                .uri("lb://USER-SERVICE"))
            .route("order-service", r -> r
                .path("/orders/**")
                .filters(f -> f
                    .retry(config -> config
                        .setRetries(3)
                        .setStatuses(HttpStatus.SERVICE_UNAVAILABLE)))
                .uri("lb://ORDER-SERVICE"))
            .build();
    }
}

@Component
public class CustomGatewayFilter implements GlobalFilter, Ordered {
    @Override
    public Mono<Void> filter(ServerWebExchange exchange, GatewayFilterChain chain) {
        ServerHttpRequest request = exchange.getRequest();
        log.info("Incoming request: {} {}", request.getMethod(), request.getURI());
        return chain.filter(exchange)
            .then(Mono.fromRunnable(() -> {
                ServerHttpResponse response = exchange.getResponse();
                log.info("Response status: {}", response.getStatusCode());
            }));
    }

    @Override
    public int getOrder() {
        return -1;
    }
}
```
## 주요 패턴
- 선언적 라우트: YAML/properties 로 라우트 정의, 빠른 설정 변경과 외부화에 유리
- 프로그래밍 라우트: `RouteLocatorBuilder` 로 동적·복잡한 라우팅 로직 구현
- 로드밸런싱: `lb://서비스명` URI 스킴으로 Discovery Service와 통합
- Filter Chain: 요청 전(Prefilter)과 응답 후(Postfilter)에 로직 삽입, Global vs Route-level 구분
## 주의사항
- Spring Cloud Gateway는 **WebFlux 기반**이므로 Spring MVC 의존성과 혼용하면 오작동 (반드시 제외)
- Spring Cloud와 Spring Boot 버전 호환성 매트릭스를 반드시 확인할 것 (버전 불일치 시 런타임 오류)
- `lb://` 스킴 사용 시 Service Discovery (Eureka, Consul 등) 설정이 선행되어야 함
- Gateway를 단독 서비스로 배포할 때 보안 필터(인증·인가)를 가장 우선순위 높게 설정할 것
