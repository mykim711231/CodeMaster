# Resilience & Cloud-Native
## Official Documentation
- [Resilience4j Integration (Circuit Breaker, Rate Limiter, Retry)](https://docs.spring.io/spring-boot/docs/current/reference/htmlsingle/#resilience4j.circuitbreaker)
## 핵심 개념
> Spring Boot는 Resilience4j와의 통합을 통해 Circuit Breaker, Rate Limiter, Retry, Bulkhead, Time Limiter와 같은 탄력성 패턴을 선언적 또는 프로그래밍 방식으로 적용할 수 있다. `application.yml` 설정만으로 Circuit Breaker의 임계값, 슬라이딩 윈도우, 폴백 메서드를 구성할 수 있어 마이크로서비스의 장애 전파를 효과적으로 방지한다.
## 학습 목표
- Circuit Breaker 패턴의 상태(CLOSED, OPEN, HALF_OPEN) 이해하기
- `@CircuitBreaker` 어노테이션으로 폴백 메서드 연결하기
- `@Retry`로 일시적 장애에 대한 재시도 정책 구성하기
- Rate Limiter, Bulkhead로 리소스 격리와 트래픽 제어하기
- Actuator를 통해 Circuit Breaker 상태 모니터링하기
## 예제 코드
```java
// Circuit Breaker + Retry 서비스
@Service
public class ExternalApiService {

    private final RestTemplate restTemplate;

    public ExternalApiService(RestTemplate restTemplate) {
        this.restTemplate = restTemplate;
    }

    @CircuitBreaker(name = "inventoryService", fallbackMethod = "inventoryFallback")
    @Retry(name = "inventoryService")
    public String getInventory(String productId) {
        return restTemplate.getForObject(
            "http://inventory-service/api/inventory/{productId}",
            String.class, productId
        );
    }

    public String inventoryFallback(String productId, Throwable t) {
        return "{\"stock\": \"UNAVAILABLE\", \"reason\": \"" + t.getMessage() + "\"}";
    }
}
```

```yaml
# application.yml - Resilience4j 설정
resilience4j:
  circuitbreaker:
    instances:
      inventoryService:
        sliding-window-size: 10
        minimum-number-of-calls: 5
        failure-rate-threshold: 50
        wait-duration-in-open-state: 10s
        permitted-number-of-calls-in-half-open-state: 3
  retry:
    instances:
      inventoryService:
        max-attempts: 3
        wait-duration: 500ms
  ratelimiter:
    instances:
      apiRateLimiter:
        limit-for-period: 10
        limit-refresh-period: 1s
  timelimiter:
    instances:
      inventoryService:
        timeout-duration: 3s
```
## 주요 패턴
- Fallback Method: 원본 메서드와 동일한 시그니처 + 마지막 파라미터로 `Throwable` 추가
- Chain of Resilience: `@CircuitBreaker` + `@Retry` + `@RateLimiter` 조합
- Event Publishing: `CircuitBreakerEvent`를 구독하여 상태 변경 감지
- Centralized Config: `resilience4j.configs`로 공통 설정을 정의하고 인스턴스에서 재사용
## 주의사항
- Circuit Breaker와 Retry를 함께 사용할 때 Retry가 Circuit Breaker보다 안쪽(먼저 실행)에 배치되어야 한다
- `fallbackMethod`는 반드시 동일한 클래스의 `public` 메서드여야 한다
- Rate Limiter의 `limit-for-period`는 `limit-refresh-period`와 함께 동작하므로 주기 설정이 일관되어야 한다
- Actuator `/health` 엔드포인트에 Circuit Breaker 상태가 포함되려면 `management.health.circuitbreakers.enabled=true` 설정 필요
