# Testing
## Official Documentation
- [Testing Spring Boot Applications](https://docs.spring.io/spring-boot/docs/current/reference/htmlsingle/#testing.boot-application)
## 핵심 개념
> Spring Boot는 `@SpringBootTest`를 통해 통합 테스트 환경을 자동 구성하며, `@WebMvcTest`, `@DataJpaTest`, `@JsonTest` 등 슬라이스 테스트로 특정 레이어만 격리하여 빠르게 테스트할 수 있다. MockMvc는 서블릿 컨테이너 없이 웹 레이어를 테스트하고, `@MockBean` / `@SpyBean`으로 의존성을 교체할 수 있다. Testcontainers를 활용하면 실제 데이터베이스나 메시지 브로커를 도커 컨테이너로 실행하여 프로덕션과 유사한 환경에서 통합 테스트를 수행할 수 있다.
## 학습 목표
- `@SpringBootTest`로 전체 ApplicationContext를 로드하여 통합 테스트를 작성할 수 있다.
- `@WebMvcTest`로 컨트롤러 레이어만 로드하고 MockMvc로 HTTP 요청을 검증할 수 있다.
- `@DataJpaTest`로 JPA 리포지토리를 테스트하고 자동 롤백을 활용할 수 있다.
- `@MockBean`으로 서비스 의존성을 모킹하고 `@SpyBean`으로 부분 모킹할 수 있다.
- `TestRestTemplate`을 사용하여 실제 내장 서버에서 엔드투엔드 테스트를 수행할 수 있다.
- Testcontainers로 PostgreSQL, Redis, Kafka 등 실제 인프라와 통합 테스트를 구성할 수 있다.
- `@TestConfiguration`으로 테스트 전용 설정 빈을 추가할 수 있다.
- `@SpringBootTest(webEnvironment = WebEnvironment.RANDOM_PORT)`로 실제 포트로 구동하여 E2E 테스트를 수행할 수 있다.
## 예제 코드
```java
@WebMvcTest(UserController.class)
class UserControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private UserService userService;

    @Test
    void shouldReturnUser() throws Exception {
        User user = new User(1L, "Alice");
        given(userService.findById(1L)).willReturn(user);

        mockMvc.perform(get("/users/1")
                        .accept(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.name").value("Alice"));
    }

    @Test
    void shouldReturn404WhenUserNotFound() throws Exception {
        given(userService.findById(99L)).willThrow(new UserNotFoundException());

        mockMvc.perform(get("/users/99"))
                .andExpect(status().isNotFound());
    }
}
```
```java
@DataJpaTest
class UserRepositoryTest {

    @Autowired
    private TestEntityManager entityManager;

    @Autowired
    private UserRepository userRepository;

    @Test
    void shouldFindByEmail() {
        User user = new User("alice@example.com", "Alice");
        entityManager.persistAndFlush(user);

        Optional<User> found = userRepository.findByEmail("alice@example.com");

        assertThat(found).isPresent();
        assertThat(found.get().getName()).isEqualTo("Alice");
    }
}
```
```java
@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
@Testcontainers
class UserIntegrationTest {

    @Container
    static PostgreSQLContainer<?> postgres = new PostgreSQLContainer<>("postgres:16-alpine");

    @DynamicPropertySource
    static void configureProperties(DynamicPropertyRegistry registry) {
        registry.add("spring.datasource.url", postgres::getJdbcUrl);
        registry.add("spring.datasource.username", postgres::getUsername);
        registry.add("spring.datasource.password", postgres::getPassword);
    }

    @Autowired
    private TestRestTemplate restTemplate;

    @Test
    void shouldCreateAndRetrieveUser() {
        User newUser = new User("bob@example.com", "Bob");
        ResponseEntity<User> createResponse = restTemplate.postForEntity("/users", newUser, User.class);
        assertThat(createResponse.getStatusCode()).isEqualTo(HttpStatus.CREATED);

        ResponseEntity<User> getResponse = restTemplate.getForEntity(
                "/users/{id}", User.class, createResponse.getBody().getId());
        assertThat(getResponse.getBody().getName()).isEqualTo("Bob");
    }
}
```
## 주요 패턴
- Slice Testing: `@WebMvcTest`, `@DataJpaTest`, `@JsonTest`로 전체 컨텍스트 대신 특정 슬라이스만 빠르게 로드
- BDDMockito: `given().willReturn()` 스타일로 Given-When-Then 구조의 가독성 높은 테스트 코드 작성
- Test Fixture 재사용: `@TestConfiguration` + `@Import`로 여러 테스트 클래스에서 공통 목(mock) 빈과 픽스처 공유
- Testcontainers Singleton: `@Container`를 static 필드로 선언하여 테스트 클래스 간 컨테이너를 재사용
## 주의사항
- `@SpringBootTest`는 전체 컨텍스트를 로드하므로 테스트 실행이 느리다. 가능하면 슬라이스 테스트를 우선 사용한다.
- `@MockBean`은 ApplicationContext를 오염시켜 컨텍스트 캐싱을 무력화할 수 있으므로, 동일한 구성의 테스트 클래스끼리 그룹화해야 한다.
- `@DataJpaTest`는 기본적으로 H2 인메모리 DB를 사용하므로, 프로덕션 DB(PostgreSQL 등)와 SQL 문법 차이로 인해 테스트가 통과되더라도 런타임 오류가 발생할 수 있다.
- TestRestTemplate은 서버를 실제로 구동하므로 `webEnvironment = RANDOM_PORT` 또는 `DEFINED_PORT`를 설정해야 한다.
