# Reactive
## Official Documentation
- [WebFlux (Reactive Web)](https://docs.spring.io/spring-boot/docs/current/reference/htmlsingle/#webflux)
## 핵심 개념
> Spring WebFlux는 Reactive Streams 기반의 논블로킹 웹 프레임워크로, Netty 또는 Undertow를 기본 런타임으로 사용한다. `Mono`(0..1)와 `Flux`(0..N) 타입을 통해 비동기 데이터 스트림을 선언적으로 조합하며, 함수형 라우터와 애너테이션 기반 컨트롤러 두 가지 스타일을 모두 지원한다. 적은 스레드로 높은 동시성을 처리할 수 있어 I/O 집약적 워크로드에 적합하다.
## 학습 목표
- `Mono`와 `Flux`의 생성, 변환(map/flatMap/filter), 구독 이해하기
- 애너테이션 기반 `@RestController` + `Mono/Flux`로 Reactive API 구현하기
- 함수형 라우터(`RouterFunction` + `HandlerFunction`)로 엔드포인트 정의하기
- `WebClient`로 논블로킹 HTTP 클라이언트 구현하기
- R2DBC로 리액티브 데이터베이스 액세스 구현하기
## 예제 코드
```java
// 애너테이션 기반 Reactive Controller
@RestController
@RequestMapping("/users")
public class UserController {

    private final UserRepository userRepository;

    public UserController(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @GetMapping
    public Flux<User> getAll() {
        return userRepository.findAll();
    }

    @GetMapping("/{id}")
    public Mono<ResponseEntity<User>> getById(@PathVariable String id) {
        return userRepository.findById(id)
            .map(ResponseEntity::ok)
            .defaultIfEmpty(ResponseEntity.notFound().build());
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public Mono<User> create(@RequestBody User user) {
        return userRepository.save(user);
    }
}
```

```java
// 함수형 라우터
@Configuration
public class RouterConfig {

    @Bean
    public RouterFunction<ServerResponse> userRoutes(UserHandler handler) {
        return RouterFunctions.route()
            .GET("/api/users", handler::getAll)
            .GET("/api/users/{id}", handler::getById)
            .POST("/api/users", handler::create)
            .build();
    }
}

@Component
public class UserHandler {

    private final UserRepository repository;

    public UserHandler(UserRepository repository) {
        this.repository = repository;
    }

    public Mono<ServerResponse> getAll(ServerRequest request) {
        return ServerResponse.ok().body(repository.findAll(), User.class);
    }

    public Mono<ServerResponse> getById(ServerRequest request) {
        return repository.findById(request.pathVariable("id"))
            .flatMap(user -> ServerResponse.ok().bodyValue(user))
            .switchIfEmpty(ServerResponse.notFound().build());
    }

    public Mono<ServerResponse> create(ServerRequest request) {
        return request.bodyToMono(User.class)
            .flatMap(repository::save)
            .flatMap(user -> ServerResponse.created(URI.create("/api/users/" + user.getId())).bodyValue(user));
    }
}
```

```java
// WebClient - 논블로킹 HTTP 호출
@Service
public class UserService {

    private final WebClient webClient;

    public UserService(WebClient.Builder builder) {
        this.webClient = builder.baseUrl("http://localhost:8080").build();
    }

    public Flux<User> getUsers() {
        return webClient.get()
            .uri("/api/users")
            .retrieve()
            .bodyToFlux(User.class);
    }
}
```
## 주요 패턴
- Operator Chaining: `map` → `flatMap` → `filter` → `switchIfEmpty`의 선언적 파이프라인
- Backpressure: `limitRate()`로 스트림 소비 속도를 조절하여 생산자-소비자 속도 불일치 해결
- Scheduler: `subscribeOn()`/`publishOn()`으로 스레드 전환 제어
- Reactive Repository: R2DBC `ReactiveCrudRepository`로 논블로킹 DB 액세스
## 주의사항
- Blocking API(`block()`, `blockFirst()`)를 WebFlux 핸들러 내에서 호출하면 논블로킹의 이점이 사라진다
- Spring MVC와 WebFlux는 동시에 사용할 수 없으며, WebFlux 스타터를 선택하면 Netty가 기본 서버로 설정된다
- `flatMap`은 순서를 보장하지 않으므로 순서 보장이 필요하면 `flatMapSequential` 또는 `concatMap` 사용
- R2DBC 사용 시 JPA(`@Entity` + Hibernate)는 사용할 수 없고, `@Table` 기반의 Spring Data R2DBC 매핑을 사용해야 한다
