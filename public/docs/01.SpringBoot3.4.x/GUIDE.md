# Spring Boot 3.4.x Learning Guide

이 문서는 **PLAN.md** 에 정의된 각 레벨/주제에 대해 공식 Spring Boot 문서를 기반으로 핵심 학습 포인트와 예시 코드를 제공합니다. 각 섹션은 공식 문서 링크와 함께 간략한 설명, 실습 아이디어를 포함합니다.

---

## 1. Java Core
- **공식 문서**: https://docs.oracle.com/javase/tutorial/
- **핵심 내용**: Java 언어 기초, 기본 문법, 자료형, 제어 흐름.
- **학습 팁**: `javac` 로 컴파일하고 `java` 로 실행하는 기본 예제 작성.

## 2. Spring Core – Getting Started / Using Spring Boot
- **공식 문서**: https://docs.spring.io/spring-boot/docs/current/reference/htmlsingle/#using.spring-boot
- **핵심 내용**: Spring Boot 프로젝트 초기화, `@SpringBootApplication`, 자동 설정, `application.yml`.
- **예제**: `spring init --dependencies=web myapp` 로 프로젝트 생성 후 `@RestController` 구현.

## 3. Spring MVC
- **공식 문서**: https://docs.spring.io/spring-boot/docs/current/reference/htmlsingle/#web.servlet.spring-mvc
- **핵심 내용**: `@Controller`, `@RequestMapping`, 뷰 템플릿(Thymeleaf).
- **실습**: CRUD 엔드포인트와 Thymeleaf 템플릿 연동.

## 4. Database – JPA / MyBatis
- **공식 문서**: https://docs.spring.io/spring-boot/docs/current/reference/htmlsingle/#data.sql
- **핵심 내용**: Spring Data JPA 설정, `Entity`, `Repository`, 트랜잭션 관리. MyBatis 매퍼 설정도 포함.
- **예제**: H2 인메모리 DB와 `User` 엔터티를 이용한 기본 CRUD 구현.

## 5. Concurrency – Async Execution
- **공식 문서**: https://docs.spring.io/spring-boot/docs/current/reference/htmlsingle/#io.executors
- **핵심 내용**: `@Async`, `TaskExecutor`, `CompletableFuture`.
- **실습**: 비동기 서비스 메서드 작성 후 `Future` 결과 확인.

## 6. Network – WebClient / RestTemplate
- **공식 문서**: https://docs.spring.io/spring-boot/docs/current/reference/htmlsingle/#io.resttemplate
- **핵심 내용**: `RestTemplate`(동기)와 `WebClient`(반응형) 사용법.
- **예제**: 외부 API 호출, JSON 파싱, 에러 처리.

## 7. Gateway – Spring Cloud Gateway
- **공식 문서**: https://docs.spring.io/spring-cloud-gateway/reference/index.html
- **핵심 내용**: 라우팅, 필터, 리액티브 스트림.
- **실습**: 간단한 라우팅 규칙과 커스텀 필터 구현.

## 8. Messaging – JMS / AMQP / RabbitMQ
- **공식 문서**: https://docs.spring.io/spring-boot/docs/current/reference/htmlsingle/#messaging
- **핵심 내용**: `@JmsListener`, `RabbitTemplate`, 메시지 변환.
- **예제**: RabbitMQ 브로커에 메시지 발행·구독.

## 9. Batch – Spring Batch
- **공식 문서**: https://docs.spring.io/spring-boot/docs/current/reference/htmlsingle/#batch
- **핵심 내용**: `Job`, `Step`, `ItemReader/Writer`, 트랜잭션 관리.
- **실습**: CSV 파일을 읽어 DB에 쓰는 배치 잡 작성.

## 10. Security – Spring Security
- **공식 문서**: https://docs.spring.io/spring-boot/docs/current/reference/htmlsingle/#security
- **핵심 내용**: 기본 인증·권한, JWT, OAuth2.
- **예제**: `WebSecurityConfigurerAdapter` 없이 `SecurityFilterChain` 설정.

## 11. Cache – Caching
- **공식 문서**: https://docs.spring.io/spring-boot/docs/current/reference/htmlsingle/#caching
- **핵심 내용**: `@Cacheable`, `CacheManager`, 다양한 캐시 구현( caffeine, Redis ).
- **실습**: 메서드 결과를 캐시하고 캐시 무효화 테스트.

## 12. Monitoring – Actuator Metrics & Monitoring
- **공식 문서**: https://docs.spring.io/spring-boot/docs/current/reference/htmlsingle/#actuator
- **핵심 내용**: `/actuator` 엔드포인트, 메트릭 수집, 헬스 체크.
- **예제**: Prometheus와 Grafana 연동.

## 13. Testing – Testing
- **공식 문서**: https://docs.spring.io/spring-boot/docs/current/reference/htmlsingle/#testing.boot-application
- **핵심 내용**: `@SpringBootTest`, MockMvc, Testcontainers.
- **실습**: 웹 레이어 테스트와 DB 통합 테스트 작성.

## 14. Architecture – Microservices (Spring Cloud)
- **공식 문서**: https://spring.io/projects/spring-cloud
- **핵심 내용**: 서비스 레지스트리(Eureka), Config Server, Circuit Breaker.
- **예제**: 두 개의 마이크로서비스 간 REST 통신 구현.

## 15. Design Pattern – Java Design Patterns
- **공식 문서**: https://refactoring.guru/design-patterns/java
- **핵심 내용**: 주요 디자인 패턴(싱글톤, 팩토리, 전략 등) 설명 및 Java 구현 예시.
- **실습**: 전략 패턴을 이용한 다국어 메시지 처리.

## 16. Build & DevOps – Container Images & Buildpacks
- **공식 문서**: https://docs.spring.io/spring-boot/docs/current/reference/htmlsingle/#build.buildpacks
- **핵심 내용**: Spring Boot Maven/Gradle 플러그인, Cloud Native Buildpacks.
- **예제**: `./mvnw spring-boot:build-image` 로 Docker 이미지 생성.

## 17. Observability – Logging, Tracing, Metrics
- **공식 문서**: https://docs.spring.io/spring-boot/docs/current/reference/htmlsingle/#logging
- **핵심 내용**: Logback 설정, Sleuth와 Zipkin 연동, Micrometer.
- **실습**: 스프링 부트 앱에 OpenTelemetry 로깅 적용.

## 18. Data – General Data Access (SQL, NoSQL)
- **공식 문서**: https://docs.spring.io/spring-boot/docs/current/reference/htmlsingle/#data
- **핵심 내용**: Spring Data JPA, MongoDB, Redis, Cassandra.
- **예제**: Spring Data MongoDB 로 간단한 문서 저장·조회.

## 19. Resilience & Cloud‑Native – Resilience4j Integration
- **공식 문서**: https://docs.spring.io/spring-boot/docs/current/reference/htmlsingle/#resilience4j.circuitbreaker
- **핵심 내용**: CircuitBreaker, RateLimiter, Retry.
- **실습**: 외부 API 호출에 Resilience4j 적용하여 폴백 메서드 구현.

## 20. Reactive – WebFlux (Reactive Web)
- **공식 문서**: https://docs.spring.io/spring-boot/docs/current/reference/htmlsingle/#webflux
- **핵심 내용**: `Flux`, `Mono`, 비동기 스트림, 함수형 라우팅.
- **예제**: Reactive CRUD API 구현 및 WebClient 로 호출.

---

**학습 팁**
- 각 섹션을 완료하면 `PLAN.md` 에서 체크박스를 `[x]` 로 바꾸세요.
- 공식 문서의 “Getting Started” 가이드를 먼저 따라하고, 직접 코드를 작성해 보세요.
- `verify-plan-urls.ps1` 로 URL 유효성을 주기적으로 검증할 수 있습니다.
