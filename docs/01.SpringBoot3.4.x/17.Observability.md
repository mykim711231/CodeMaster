# Observability
## Official Documentation
- [Logging, Tracing, Metrics](https://docs.spring.io/spring-boot/docs/current/reference/htmlsingle/#logging)
## 핵심 개념
> Spring Boot는 Logback을 기본 로깅 프레임워크로 사용하며, Micrometer를 통해 다양한 모니터링 백엔드에 메트릭을 전송할 수 있다. Spring Boot Actuator와 OpenTelemetry 연동으로 분산 트레이싱까지 통합 관측 가능성(Observability)을 구축할 수 있으며, `application.yml`만으로 로그 레벨, 형식, 출력 대상을 세밀하게 제어할 수 있다.
## 학습 목표
- `application.yml`에서 로그 레벨, 패턴, 파일 출력 설정하기
- Logback-spring.xml로 고급 로깅 커스터마이징하기
- Actuator 엔드포인트(/health, /metrics, /info) 활성화 및 이해하기
- Micrometer로 Prometheus, Grafana 연동하기
- OpenTelemetry와 Zipkin으로 분산 트레이싱 구성하기
## 예제 코드
```java
// application.yml - 로깅 및 Actuator 설정
logging:
  level:
    root: INFO
    com.example: DEBUG
  pattern:
    console: "%d{yyyy-MM-dd HH:mm:ss} [%thread] %-5level %logger{36} - %msg%n"
  file:
    name: logs/application.log

management:
  endpoints:
    web:
      exposure:
        include: health,info,metrics,prometheus
  metrics:
    export:
      prometheus:
        enabled: true
  tracing:
    sampling:
      probability: 1.0
  zipkin:
    tracing:
      endpoint: http://localhost:9411/api/v2/spans
```

```java
// Controller에서 커스텀 메트릭 등록
import io.micrometer.core.instrument.MeterRegistry;
import org.springframework.web.bind.annotation.*;

@RestController
public class OrderController {

    private final MeterRegistry meterRegistry;

    public OrderController(MeterRegistry meterRegistry) {
        this.meterRegistry = meterRegistry;
    }

    @GetMapping("/orders/{id}")
    public String getOrder(@PathVariable String id) {
        meterRegistry.counter("orders.requests", "endpoint", "getOrder").increment();
        return "Order: " + id;
    }
}
```
## 주요 패턴
- 구조화 로깅(JSON): ELK 스택 연동을 위한 `logstash-logback-encoder` 사용
- SLF4J 파라미터화: `log.info("User {} logged in", userId)`로 성능 최적화
- 로그 그룹핑: `logging.group`으로 패키지별 일괄 로그 레벨 설정
- 스팬/트레이스 전파: HTTP 헤더를 통한 `traceId`/`spanId` 자동 전달
## 주의사항
- 프로덕션에서는 `sampling.probability`를 0.1 이하로 설정해 트레이싱 오버헤드 최소화
- Actuator 엔드포인트는 반드시 Spring Security로 보호하거나 `exposure.exclude`로 제한
- `@Timed` 어노테이션은 AOP 프록시 내부 호출에서는 동작하지 않는다
- OTel 에이전트와 Micrometer 양쪽에서 동일 메트릭을 중복 수집하지 않도록 주의
