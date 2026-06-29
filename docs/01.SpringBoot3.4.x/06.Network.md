# Network — WebClient / RestTemplate
## Official Documentation
- [Spring Boot: Calling REST Services with RestTemplate](https://docs.spring.io/spring-boot/docs/current/reference/htmlsingle/#io.resttemplate)
- [Spring Framework: WebClient (Reactive)](https://docs.spring.io/spring-framework/reference/web/webflux-webclient.html)
## 핵심 개념
> Spring Boot에서 외부 REST API를 호출하는 두 가지 주요 방식: 동기식 `RestTemplate`과 반응형 `WebClient`. RestTemplate은 스레드당 하나의 요청을 블로킹 처리하며, WebClient는 논블로킹 이벤트 루프 모델로 적은 스레드로도 고처리량을 달성한다. Spring Boot 3.x에서는 RestTemplate이 자동 설정되지 않으므로 명시적으로 빈을 등록해야 한다.
## 학습 목표
- `RestTemplate` 을 명시적 빈으로 등록하고 GET/POST 요청 보내기
- `RestClient`(Spring 6.1+의 신규 동기 HTTP 클라이언트) 사용법 익히기
- `WebClient` 빌더로 논블로킹 요청 구성하고 `Mono`/`Flux` 로 응답 처리하기
- Connection pool, Timeout 등 HTTP Client 설정 (HttpComponentsClientHttpRequestFactory)
- 에러 핸들링: `DefaultResponseErrorHandler`, `onStatus()` 로 상태 코드별 처리
## 예제 코드
```java
@Configuration
public class HttpClientConfig {
    @Bean
    public RestClient restClient(RestClient.Builder builder) {
        return builder
            .baseUrl("https://jsonplaceholder.typicode.com")
            .defaultHeader("Accept", "application/json")
            .requestFactory(new JdkClientHttpRequestFactory())
            .build();
    }

    @Bean
    public WebClient webClient(WebClient.Builder builder) {
        return builder
            .baseUrl("https://jsonplaceholder.typicode.com")
            .defaultHeader("Accept", "application/json")
            .build();
    }
}

@RestController
public class PostController {

    private final RestClient restClient;
    private final WebClient webClient;

    public PostController(RestClient restClient, WebClient webClient) {
        this.restClient = restClient;
        this.webClient = webClient;
    }

    // 동기 호출 (RestClient)
    @GetMapping("/api/sync/post/{id}")
    public Post getPostSync(@PathVariable Long id) {
        return restClient.get()
            .uri("/posts/{id}", id)
            .retrieve()
            .body(Post.class);
    }

    // 비동기 호출 (WebClient)
    @GetMapping("/api/async/post/{id}")
    public Mono<Post> getPostAsync(@PathVariable Long id) {
        return webClient.get()
            .uri("/posts/{id}", id)
            .retrieve()
            .onStatus(HttpStatusCode::is4xxClientError,
                res -> Mono.error(new RuntimeException("Not found")))
            .bodyToMono(Post.class);
    }
}
```
## 주요 패턴
- RestClient (Spring 6.1+): 모던한 동기 HTTP 클라이언트, `RestTemplate` 의 후속으로 권장됨
- WebClient: 논블로킹 반응형 HTTP 클라이언트, WebFlux 스택에서 필수
- ExchangeFilterFunction: WebClient 인터셉터 역할, 로깅/인증 토큰 주입 등 공통 관심사 처리
- RequestFactory 선택: JDK HttpClient, Apache HttpComponents, Netty 중 상황에 맞게 선택
## 주의사항
- `RestTemplate` 은 Spring Boot 3.x 부터 자동 설정되지 않으므로 반드시 수동 빈 등록 필요
- WebClient 응답은 `subscribe()` 하지 않으면 요청 자체가 발생하지 않음 (Cold Publisher)
- 무거운 요청 처리에는 반드시 Connection Pool 설정을 통해 리소스 고갈 방지
- REST API 호출 시 응답 본문 누수 방지를 위해 `finally` 블록에서 리소스 해제 또는 `try-with-resources` 사용
