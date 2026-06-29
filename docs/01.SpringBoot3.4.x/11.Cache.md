# Cache
## Official Documentation
- [Caching](https://docs.spring.io/spring-boot/docs/current/reference/htmlsingle/#caching)
## 핵심 개념
> Spring Boot는 `@Cacheable`, `@CacheEvict`, `@CachePut` 등 선언적 캐시 추상화를 제공하며, 내부적으로 `CacheManager` 인터페이스를 통해 캐시 구현체(Caffeine, Redis, EhCache 등)와 연동된다. `spring-boot-starter-cache` 의존성만 추가하면 자동 설정이 동작하며, 별도 CacheManager 빈이 없으면 기본 ConcurrentMap 기반 캐시를 사용한다.
## 학습 목표
- `@Cacheable`로 메서드 결과를 캐시하고 캐시 키를 커스터마이징할 수 있다.
- `@CacheEvict`로 캐시 무효화 전략(beforeInvocation, allEntries)을 이해한다.
- `@CachePut`으로 캐시 갱신과 메서드 실행을 함께 처리한다.
- `CacheManager` 추상화를 이해하고 Caffeine / Redis 등으로 전환할 수 있다.
- `@Caching`으로 여러 캐시 어노테이션을 조합할 수 있다.
- `application.yml`을 통해 `spring.cache.type` 및 `spring.cache.cache-names`를 설정할 수 있다.
## 예제 코드
```java
@Service
public class UserService {

    @Cacheable(value = "users", key = "#id")
    public User findById(Long id) {
        simulateSlowService();
        return new User(id, "User" + id);
    }

    @CachePut(value = "users", key = "#user.id")
    public User update(User user) {
        return userRepository.save(user);
    }

    @CacheEvict(value = "users", key = "#id")
    public void delete(Long id) {
        userRepository.deleteById(id);
    }

    @Caching(evict = {
        @CacheEvict("users"),
        @CacheEvict(value = "userDetails", key = "#user.id")
    })
    public void clearAll(User user) {
    }

    private void simulateSlowService() {
        try { Thread.sleep(3000); } catch (InterruptedException e) { Thread.currentThread().interrupt(); }
    }
}
```
```java
@Configuration
@EnableCaching
public class CacheConfig {

    @Bean
    public CacheManager cacheManager() {
        CaffeineCacheManager cacheManager = new CaffeineCacheManager("users", "userDetails");
        cacheManager.setCaffeine(Caffeine.newBuilder()
                .expireAfterWrite(10, TimeUnit.MINUTES)
                .maximumSize(100));
        return cacheManager;
    }
}
```
## 주요 패턴
- Cache-Aside: 애플리케이션이 직접 캐시를 제어하며 `@Cacheable`로 읽고 `@CacheEvict`로 무효화하는 전통적 패턴
- Read-Through / Write-Through: `CacheManager` 구현체가 데이터 소스와 자동 동기화(Spring Cache는 기본적으로 이 모델을 부분 지원)
- 계층형 캐시(Layered Cache): L1(로컬 Caffeine) + L2(분산 Redis)로 구성하여 성능과 확장성을 모두 확보
## 주의사항
- 프록시 기반 AOP이므로 동일 클래스 내부 호출(self-invocation) 시 캐시 어드바이스가 적용되지 않는다.
- `@Cacheable` 메서드의 반환 타입이 `Optional`인 경우 null 캐싱 이슈에 주의해야 한다.
- 기본 `SimpleCacheManager`는 프로덕션에 부적합하므로 반드시 `spring.cache.type`을 명시적으로 설정한다.
- Redis를 사용할 경우 직렬화 방식(Jackson2JsonRedisSerializer 등)을 명시적으로 구성하지 않으면 기본 JDK 직렬화로 인한 문제가 발생할 수 있다.
