# Monitoring
## Official Documentation
- [Actuator Metrics & Monitoring](https://docs.spring.io/spring-boot/docs/current/reference/htmlsingle/#actuator)
## 핵심 개념
> Spring Boot Actuator는 운영 환경에서 애플리케이션을 모니터링하고 관리할 수 있는 프로덕션 레디 기능을 제공한다. `/actuator/health`, `/actuator/metrics`, `/actuator/env` 등 다양한 빌트인 엔드포인트를 통해 애플리케이션 상태, 메트릭, 환경 정보를 HTTP 또는 JMX로 노출한다. Micrometer 라이브러리를 통해 Prometheus, Grafana, Datadog 등 외부 모니터링 시스템과 쉽게 통합된다.
## 학습 목표
- Actuator 의존성을 추가하고 `management.endpoints.web.exposure.include`로 엔드포인트를 제어할 수 있다.
- `/health`, `/health/liveness`, `/health/readiness`로 헬스 체크와 쿠버네티스 프로브를 구성할 수 있다.
- `/metrics`와 `/metrics/{metric.name}`으로 JVM 메모리, HTTP 요청, 데이터소스 메트릭을 조회할 수 있다.
- 커스텀 `HealthIndicator`를 구현하여 외부 서비스 의존성 상태를 헬스 체크에 추가할 수 있다.
- `@Timed`, `@Counted` 어노테이션을 통해 비즈니스 로직에 커스텀 메트릭을 추가할 수 있다.
- Prometheus 엔드포인트(`/actuator/prometheus`)를 활성화하여 Grafana 대시보드와 연동할 수 있다.
- `management.endpoint.health.show-details`, `management.endpoint.health.show-components`로 헬스 정보 노출 수준을 제어할 수 있다.
## 예제 코드
```java
@Component
public class DatabaseHealthIndicator implements HealthIndicator {

    @Autowired
    private DataSource dataSource;

    @Override
    public Health health() {
        try (Connection conn = dataSource.getConnection()) {
            if (conn.isValid(1)) {
                return Health.up()
                        .withDetail("database", "MySQL")
                        .withDetail("status", "connected")
                        .build();
            }
        } catch (SQLException e) {
            return Health.down()
                    .withDetail("error", e.getMessage())
                    .build();
        }
        return Health.down().build();
    }
}
```
```java
@Service
public class OrderService {

    @Timed(value = "orders.place", description = "Time taken to place an order")
    @Counted(value = "orders.place.count", description = "Number of orders placed")
    public Order placeOrder(OrderRequest request) {
        return orderRepository.save(new Order(request));
    }
}
```
```yaml
management:
  endpoints:
    web:
      exposure:
        include: health,metrics,prometheus,env,loggers
  endpoint:
    health:
      show-details: always
      show-components: always
      probes:
        enabled: true
  metrics:
    tags:
      application: ${spring.application.name}
```
## 주요 패턴
- Health Check 패턴: `/health`로 Liveness Probe, `/health/readiness`로 Readiness Probe를 분리하여 쿠버네티스 오케스트레이션과 연동
- Micrometer Facade 패턴: Prometheus, Datadog, CloudWatch 등 다양한 백엔드를 통일된 API로 추상화
- Info Contributor 패턴: `InfoContributor`를 구현하여 `/info` 엔드포인트에 빌드 버전, Git 커밋 등 커스텀 정보 제공
## 주의사항
- 프로덕션에서 `/actuator/env`나 `/actuator/configprops`는 민감 정보(비밀번호, API 키)가 노출될 수 있으므로 반드시 Spring Security와 함께 보호해야 한다.
- Actuator 엔드포인트를 별도 포트(`management.server.port`)로 분리하여 보안을 강화할 수 있다.
- `spring-boot-starter-actuator` 없이 Micrometer만 직접 사용하면 자동 설정된 메트릭(JVM, Tomcat 등)이 누락된다.
- `/health/readiness`는 `AvailabilityState`를 기반으로 하므로, 외부 의존성이 준비되지 않은 상태에서 트래픽이 유입되지 않도록 `ReadinessStateHealthIndicator`를 활용해야 한다.
