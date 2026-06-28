import type { Snippet } from '../../types';

export const springMvc: Snippet[] = [
  {
    id: 'mvc-rest-controller',
    lang: 'java',
    title: '@RestController 기본',
    file: 'HelloController.java',
    code: `@RestController
public class HelloController {

  @GetMapping("/hello")
  public String hello() {
    return "hello";
  }
}`,
    explain: {
      concept: '@RestController는 반환값을 HTTP 응답 본문으로 직접 써주는 API 전용 컨트롤러예요. 객체를 반환하면 JSON으로, String을 반환하면 텍스트로 변환돼요. @Controller + @ResponseBody가 합쳐진 거예요.',
      terms: [
        { t: '@RestController', d: '반환값을 HTTP 응답 본문으로 직렬화하는 컨트롤러 (@Controller + @ResponseBody 결합)' },
        { t: '@GetMapping', d: 'GET 요청을 메서드로 연결' },
        { t: 'return', d: '반환 값이 뷰 이름이 아니라 응답 본문이 됨 (String이면 text/plain, 객체면 JSON)' },
      ],
      why: 'JSON API를 만들 때 가장 간단한 방법이에요.',
      pitfall: '문자열이 뷰 이름이 아니라 응답 본문이 돼요.',
    },
  },
  {
    id: 'mvc-request-mapping',
    lang: 'java',
    title: '@RequestMapping 클래스 단위 경로',
    file: 'UserController.java',
    code: `@RestController
@RequestMapping("/api/users")
public class UserController {

  @GetMapping
  public List<User> list() {
    return List.of();
  }

  @PostMapping
  public User create(@RequestBody User user) {
    return user;
  }
}`,
    explain: {
      concept: '@RequestMapping은 컨트롤러 전체에 공통 경로를 붙이는 거예요. "/api/users"라는 간판을 달면 안의 메서드들은 모두 그 아래로 연결돼요.',
      terms: [
        { t: '@RequestMapping', d: '클래스 단위 경로 지정' },
        { t: '/api/users', d: '공통 URL 접두어' },
        { t: '@GetMapping', d: 'GET /api/users' },
        { t: '@PostMapping', d: 'POST /api/users' },
      ],
      why: '반복되는 경로를 한 번에 묶어 관리하려고요.',
      pitfall: '메서드 단위 매핑이 없으면 클래스 경로만으로 동작해요.',
    },
  },
  {
    id: 'mvc-get-mapping',
    lang: 'java',
    title: '@GetMapping 조회',
    file: 'ProductController.java',
    code: `@RestController
@RequestMapping("/products")
public class ProductController {

  @GetMapping("/{id}")
  public Product get(@PathVariable Long id) {
    return productService.find(id);
  }
}`,
    explain: {
      concept: '@GetMapping은 데이터를 "가져다 줘"라는 GET 요청을 처리해요. URL에서 id를 뽑아 쓸 수 있어요. 책장에서 책 번호로 책을 꺼내는 것과 같아요.',
      terms: [
        { t: '@GetMapping', d: 'GET 요청을 메서드로 연결' },
        { t: '/{id}', d: 'URL 경로 변수 자리' },
        { t: '@PathVariable', d: '경로 변수를 파라미터로 받음 ({id}의 값을 꺼냄)' },
      ],
      why: '리소스를 조회할 때 GET 방식을 써요.',
      pitfall: 'GET은 본문이 없으니 파라미터는 URL로만 전달해요.',
    },
  },
  {
    id: 'mvc-post-mapping',
    lang: 'java',
    title: '@PostMapping 생성',
    file: 'OrderController.java',
    code: `@RestController
@RequestMapping("/orders")
public class OrderController {

  @PostMapping
  public Order create(@RequestBody OrderRequest req) {
    return orderService.create(req);
  }
}`,
    explain: {
      concept: '@PostMapping은 "새로 만들어 줘"라는 POST 요청을 처리해요. 요청 본문(JSON)을 자바 객체로 변환해 줘요.',
      terms: [
        { t: '@PostMapping', d: 'POST 요청을 메서드로 연결' },
        { t: '@RequestBody', d: 'JSON 본문을 자바 객체로 변환' },
        { t: 'OrderRequest', d: '요청 데이터를 담는 객체' },
      ],
      why: '리소스를 생성할 때 POST 방식을 써요.',
      pitfall: '본문이 없으면 400 Bad Request가 발생해요.',
    },
  },
  {
    id: 'mvc-put-mapping',
    lang: 'java',
    title: '@PutMapping 전체 수정',
    file: 'BookController.java',
    code: `@RestController
@RequestMapping("/books")
public class BookController {

  @PutMapping("/{id}")
  public Book update(@PathVariable Long id, @RequestBody BookRequest req) {
    return bookService.update(id, req);
  }
}`,
    explain: {
      concept: '@PutMapping은 "이거로 바꿔 줘"라는 PUT 요청을 처리해요. 전체를 덮어쓰는 느낌이에요.',
      terms: [
        { t: '@PutMapping', d: 'PUT 요청을 메서드로 연결' },
        { t: '@PathVariable', d: '경로에서 id 값 추출' },
        { t: '@RequestBody', d: '요청 본문 JSON을 객체로 변환' },
      ],
      why: '리소스 전체를 교체할 때 PUT 방식을 써요.',
      pitfall: '멱등성이 있어 같은 요청을 반복해도 결과가 같아요.',
    },
  },
  {
    id: 'mvc-delete-mapping',
    lang: 'java',
    title: '@DeleteMapping 삭제',
    file: 'TaskController.java',
    code: `@RestController
@RequestMapping("/tasks")
public class TaskController {

  @DeleteMapping("/{id}")
  public void delete(@PathVariable Long id) {
    taskService.delete(id);
  }
}`,
    explain: {
      concept: '@DeleteMapping은 "이거 지워 줘"라는 DELETE 요청을 처리해요. 휴지통 버튼과 같아요.',
      terms: [
        { t: '@DeleteMapping', d: 'DELETE 요청을 메서드로 연결' },
        { t: '@PathVariable', d: '경로에서 삭제할 id 추출' },
        { t: 'void', d: '본문 없이 상태 코드만 응답' },
      ],
      why: '리소스를 삭제할 때 DELETE 방식을 써요.',
      pitfall: '반환을 void로 하면 200 OK가 기본이에요.',
    },
  },
  {
    id: 'mvc-request-body',
    lang: 'java',
    title: '@RequestBody JSON → 객체',
    file: 'SignupController.java',
    code: `@RestController
public class SignupController {

  @PostMapping("/signup")
  public ResponseEntity<String> signup(@RequestBody SignupRequest req) {
    return ResponseEntity.ok("가입: " + req.getEmail());
  }
}`,
    explain: {
      concept: '@RequestBody는 JSON 본문을 자바 객체로 자동 번역해 줘요. 우편물을 풀어 상자에 정리하는 것과 같아요.',
      terms: [
        { t: '@RequestBody', d: '요청 본문을 객체로 변환' },
        { t: 'SignupRequest', d: '가입 요청 DTO' },
        { t: 'ResponseEntity', d: '상태 코드와 본문을 함께 반환' },
      ],
      why: 'JSON을 자바 코드로 다루려고요.',
      pitfall: 'JSON 키와 객체 필드명이 다르면 매핑이 안 돼요.',
    },
  },
  {
    id: 'mvc-path-variable',
    lang: 'java',
    title: '@PathVariable 경로 변수',
    file: 'PostController.java',
    code: `@RestController
@RequestMapping("/posts")
public class PostController {

  @GetMapping("/{postId}/comments/{commentId}")
  public Comment find(@PathVariable Long postId, @PathVariable Long commentId) {
    return commentService.find(postId, commentId);
  }
}`,
    explain: {
      concept: '@PathVariable은 URL 경로에 들어있는 값을 파라미터로 꺼내는 거예요. "/posts/3"에서 3을 뽑아 써요.',
      terms: [
        { t: '@PathVariable', d: '경로 변수 추출' },
        { t: '{postId}', d: '경로 변수 자리 표시' },
        { t: 'Long', d: '숫자 타입으로 자동 변환' },
      ],
      why: 'URL 안에 리소스 식별자를 표현하려고요.',
      pitfall: '변수명과 경로명이 같아야 하고, 다르면 이름을 명시해야 해요.',
    },
  },
  {
    id: 'mvc-request-param',
    lang: 'java',
    title: '@RequestParam 쿼리 파라미터',
    file: 'SearchController.java',
    code: `@RestController
public class SearchController {

  @GetMapping("/search")
  public List<Item> search(
      @RequestParam String q,
      @RequestParam(defaultValue = "1") int page) {
    return searchService.search(q, page);
  }
}`,
    explain: {
      concept: '@RequestParam은 URL의 ? 뒤에 붙은 값을 꺼내는 거예요. 검색창에 친 단어를 자바로 받아요. "?q=coffee&page=2"에서 q와 page를 뽑아 써요.',
      terms: [
        { t: '@RequestParam', d: '쿼리 파라미터(URL의 ? 뒤 값) 추출' },
        { t: 'q', d: '검색어 파라미터' },
        { t: 'defaultValue', d: '값이 없을 때 기본값' },
      ],
      why: '필터/검색 조건을 URL로 전달하려고요.',
      pitfall: '필수 파라미터가 빠지면 400 에러가 나요.',
    },
  },
  {
    id: 'mvc-valid',
    lang: 'java',
    title: '@Valid 검증',
    file: 'MemberController.java',
    code: `@RestController
public class MemberController {

  @PostMapping("/members")
  public Member join(@Valid @RequestBody MemberRequest req) {
    return memberService.join(req);
  }
}`,
    explain: {
      concept: '@Valid는 요청 객체의 필드에 붙은 검증 규칙을 자동으로 확인해 줘요. 보안 검색대를 통과시키는 것과 같아요.',
      terms: [
        { t: '@Valid', d: '객체의 검증 어노테이션 실행' },
        { t: '@RequestBody', d: 'JSON을 객체로 변환' },
        { t: 'MemberRequest', d: '검증 규칙이 붙은 DTO' },
      ],
      why: '잘못된 입력을 비즈니스 로직 전에 차단하려고요.',
      pitfall: '검증 실패 시 400 에러가 자동 발생해요.',
    },
  },
  {
    id: 'mvc-binding-result',
    lang: 'java',
    title: 'BindingResult 수동 처리',
    file: 'ReviewController.java',
    code: `@RestController
public class ReviewController {

  @PostMapping("/reviews")
  public ResponseEntity<String> write(@Valid @RequestBody ReviewRequest req, BindingResult result) {
    if (result.hasErrors()) {
      return ResponseEntity.badRequest().body("검증 실패");
    }
    return ResponseEntity.ok("작성 완료");
  }
}`,
    explain: {
      concept: 'BindingResult는 검증 결과를 담는 상자예요. 이게 있으면 에러를 자동으로 던지지 않고 직접 처리할 수 있어요.',
      terms: [
        { t: 'BindingResult', d: '검증 결과를 담음' },
        { t: 'hasErrors()', d: '오류가 있는지 확인' },
        { t: 'badRequest()', d: '400 상태 응답 생성' },
      ],
      why: '검증 실패 시 응답 형식을 직접 제어하려고요.',
      pitfall: 'BindingResult는 반드시 검증 대상 바로 다음 파라미터여야 해요.',
    },
  },
  {
    id: 'mvc-exception-handler',
    lang: 'java',
    title: '@ExceptionHandler 예외 처리',
    file: 'ProductController.java',
    code: `@RestController
public class ProductController {

  @GetMapping("/products/{id}")
  public Product find(@PathVariable Long id) {
    return productService.find(id);
  }

  @ExceptionHandler(NotFoundException.class)
  public ResponseEntity<String> notFound(NotFoundException e) {
    return ResponseEntity.status(404).body(e.getMessage());
  }
}`,
    explain: {
      concept: '@ExceptionHandler는 컨트롤러 안에서 에러가 나면 가로채서 처리하는 거예요. 응급실 담당자가 환자를 바로 진료하는 것과 같아요.',
      terms: [
        { t: '@ExceptionHandler', d: '특정 예외를 가로채 처리' },
        { t: 'NotFoundException', d: '리소스 없음 예외' },
        { t: 'status(404)', d: '404 상태 코드' },
      ],
      why: '에러 응답을 통일된 형식으로 만들려고요.',
      pitfall: '컨트롤러 안에서만 동작해요. 다른 컨트롤러에서 같은 에러를 처리하려면 @RestControllerAdvice로 빼야 해요.',
    },
  },
  {
    id: 'mvc-rest-controller-advice',
    lang: 'java',
    title: '@RestControllerAdvice 전역 처리',
    file: 'GlobalExceptionHandler.java',
    code: `@RestControllerAdvice
public class GlobalExceptionHandler {

  @ExceptionHandler(IllegalArgumentException.class)
  public ResponseEntity<String> handle(IllegalArgumentException e) {
    return ResponseEntity.badRequest().body(e.getMessage());
  }
}`,
    explain: {
      concept: '@RestControllerAdvice는 모든 컨트롤러의 에러를 한 곳에서 처리하는 종합 상담소예요. 각 컨트롤러에 같은 코드를 반복하지 않아도 돼요.',
      terms: [
        { t: '@RestControllerAdvice', d: '전역 예외 처리 + 응답 본문' },
        { t: '@ExceptionHandler', d: '처리할 예외 지정' },
        { t: 'badRequest()', d: '400 응답 생성' },
      ],
      why: '에러 처리를 한 곳에서 통일하려고요.',
      pitfall: '컨트롤러 단위 @ExceptionHandler가 더 우선이에요.',
    },
  },
  {
    id: 'mvc-problem-detail',
    lang: 'java',
    title: 'ProblemDetail RFC7807',
    file: 'ApiExceptionHandler.java',
    code: `@RestControllerAdvice
public class ApiExceptionHandler {

  @ExceptionHandler(NotFoundException.class)
  public ProblemDetail handle(NotFoundException e) {
    ProblemDetail problem = ProblemDetail.forStatusAndDetail(HttpStatus.NOT_FOUND, e.getMessage());
    problem.setTitle("리소스 없음");
    return problem;
  }
}`,
    explain: {
      concept: 'ProblemDetail은 에러 응답을 표준 양식(RFC 7807)으로 만들어 주는 도구예요. 모든 API가 같은 형식의 에러 메시지를 보내 클라이언트가 일관되게 해석할 수 있어요.',
      terms: [
        { t: 'ProblemDetail', d: '표준 에러 응답 객체 — 상태 코드, 제목, 상세 메시지를 포함해요' },
        { t: 'forStatusAndDetail(HttpStatus, String)', d: 'HttpStatusCode 타입과 상세 메시지를 받아 ProblemDetail 생성. int 리터럴은 받지 않아요' },
        { t: 'setTitle', d: '에러 제목 문자열을 추가해 응답 JSON의 title 필드에 실려요' },
      ],
      why: '클라이언트가 에러를 일관된 형식으로 해석하게 하려고요.',
      pitfall: 'forStatusAndDetail()은 int 리터럴(예: 404)을 받는 오버로드가 없어요. 반드시 HttpStatus.NOT_FOUND처럼 HttpStatusCode 타입을 넘겨야 컴파일이 돼요.',
    },
  },
  {
    id: 'mvc-response-entity',
    lang: 'java',
    title: 'ResponseEntity 상태+본문',
    file: 'AuthController.java',
    code: `@RestController
public class AuthController {

  @PostMapping("/login")
  public ResponseEntity<Token> login(@RequestBody LoginRequest req) {
    Token token = authService.login(req);
    return ResponseEntity.created(URI.create("/tokens/" + token.id)).body(token);
  }
}`,
    explain: {
      concept: 'ResponseEntity는 상태 코드, 헤더, 본문을 한 번에 담는 응답 상자예요. 선물 상자에 카드와 내용물을 함께 담아요.',
      terms: [
        { t: 'ResponseEntity', d: '응답 상태+헤더+본문을 한 번에 담는 상자' },
        { t: 'created', d: '201 Created 응답 생성' },
        { t: 'body', d: '응답 본문 설정' },
        { t: 'URI', d: 'Location 헤더용 경로' },
      ],
      why: '상태 코드와 헤더를 정확히 제어하려고요.',
      pitfall: '201 응답에는 Location 헤더를 함께 주는 게 좋아요.',
    },
  },
  {
    id: 'mvc-response-status',
    lang: 'java',
    title: '@ResponseStatus 상태 코드',
    file: 'CartController.java',
    code: `@RestController
public class CartController {

  @PostMapping("/carts")
  @ResponseStatus(HttpStatus.CREATED)
  public Cart create(@RequestBody CartRequest req) {
    return cartService.create(req);
  }
}`,
    explain: {
      concept: '@ResponseStatus는 메서드가 반환할 상태 코드를 정해두는 거예요. "이 일은 201로 보고해 줘"라고 정하는 것과 같아요.',
      terms: [
        { t: '@ResponseStatus', d: '응답 상태 코드 지정' },
        { t: 'HttpStatus.CREATED', d: '201 상태 코드' },
      ],
      why: 'ResponseEntity 없이 상태 코드만 바꾸려고요.',
      pitfall: '예외 발생 시엔 적용되지 않을 수 있어요.',
    },
  },
  {
    id: 'mvc-cross-origin',
    lang: 'java',
    title: '@CrossOrigin CORS 허용',
    file: 'PublicController.java',
    code: `@RestController
@CrossOrigin(origins = "https://example.com")
public class PublicController {

  @GetMapping("/public")
  public String info() {
    return "ok";
  }
}`,
    explain: {
      concept: '@CrossOrigin은 다른 도메인에서 이 API를 부를 수 있게 허락하는 표시예요. 브라우저가 다른 사이트의 API 호출을 막는 CORS 규칙을 풀어주는 출입증이에요.',
      terms: [
        { t: '@CrossOrigin', d: 'CORS(다른 도메인 요청) 허용 설정' },
        { t: 'origins', d: '허용할 출처 도메인' },
      ],
      why: '브라우저가 다른 도메인의 API를 안전하게 호출하려고요.',
      pitfall: '운영에서는 허용 도메인을 최소한으로 유지해야 해요.',
    },
  },
  {
    id: 'mvc-bean-validation-dto',
    lang: 'java',
    title: 'Bean Validation DTO — @NotBlank/@Min',
    file: 'ProductRequest.java',
    code: `public record ProductRequest(
    @NotBlank(message = "이름은 필수예요")
    String name,

    @Min(value = 0, message = "가격은 0 이상이어야 해요")
    int price,

    @Size(max = 500, message = "설명은 500자 이하예요")
    String description
) {}`,
    explain: {
      concept: 'DTO 필드에 검증 어노테이션(@NotBlank, @Min 등)을 붙이면 @Valid와 함께 요청이 들어올 때 자동으로 규칙을 확인해요. 입력값이 규칙을 어기면 컨트롤러 메서드 진입 전에 400 에러를 돌려줘요.',
      terms: [
        { t: '@NotBlank', d: '문자열이 null이거나 공백만 있으면 검증 실패 — 이름 같은 필수 텍스트에 써요' },
        { t: '@Min(value)', d: '숫자가 지정한 최솟값보다 작으면 검증 실패' },
        { t: '@Size(max)', d: '문자열 길이가 max를 초과하면 검증 실패' },
        { t: 'message', d: '검증 실패 시 클라이언트로 보낼 에러 메시지' },
      ],
      why: 'record DTO에 검증 규칙을 선언해 두면 컨트롤러 코드가 깔끔해지고 잘못된 입력이 비즈니스 로직에 도달하지 않아요.',
      pitfall: 'spring-boot-starter-validation 의존성이 없으면 어노테이션을 붙여도 아무것도 검증하지 않아요. build.gradle에 추가하는 걸 잊지 마세요.',
    },
  },
  {
    id: 'mvc-rest-client',
    lang: 'java',
    title: 'RestClient 외부 API 호출 (Spring Boot 3.2+)',
    file: 'PaymentClient.java',
    code: `@Component
public class PaymentClient {

  private final RestClient restClient;

  public PaymentClient(RestClient.Builder builder) {
    this.restClient = builder
        .baseUrl("https://pay.example.com")
        .build();
  }

  public PaymentResponse charge(PaymentRequest req) {
    return restClient.post()
        .uri("/charge")
        .contentType(MediaType.APPLICATION_JSON)
        .body(req)
        .retrieve()
        .body(PaymentResponse.class);
  }
}`,
    explain: {
      concept: 'RestClient는 Spring Boot 3.2에서 추가된 동기 HTTP 클라이언트예요. 외부 API를 호출할 때 코드를 메서드 체인으로 읽기 쉽게 작성할 수 있어요. 예전의 RestTemplate을 대신하는 최신 방식이에요.',
      terms: [
        { t: 'RestClient.Builder', d: 'baseUrl, 기본 헤더 등을 미리 설정하고 RestClient를 생성하는 빌더' },
        { t: '.retrieve()', d: '응답을 가져올 준비를 하는 단계 — 상태 코드 검사 포함' },
        { t: '.body(Class)', d: '응답 본문을 지정한 타입으로 변환해서 반환' },
        { t: 'contentType', d: '요청 본문의 미디어 타입 지정 (여기서는 JSON)' },
      ],
      why: 'Spring Boot 기본 의존성만으로 외부 HTTP 호출을 간결하게 작성하려고요. 별도 라이브러리 없이 사용할 수 있어요.',
      pitfall: '4xx/5xx 응답을 받으면 기본적으로 HttpClientErrorException/HttpServerErrorException을 던져요. 직접 처리하려면 .onStatus()로 핸들러를 등록하세요.',
    },
  },
  {
    id: 'mvc-path-variable-vs-param',
    lang: 'java',
    title: 'PathVariable + RequestParam 혼합',
    file: 'CommentController.java',
    code: `@RestController
@RequestMapping("/posts/{postId}/comments")
public class CommentController {

  @GetMapping
  public List<Comment> list(
      @PathVariable Long postId,
      @RequestParam(required = false) String filter) {
    return commentService.list(postId, filter);
  }
}`,
    explain: {
      concept: '경로 변수와 쿼리 파라미터를 한 메서드에서 같이 쓸 수 있어요. 책장 번호는 경로로, 검색어는 쿼리로 전달해요.',
      terms: [
        { t: '@PathVariable', d: '경로의 postId 추출' },
        { t: '@RequestParam', d: '쿼리 파라미터 filter 추출' },
        { t: 'required = false', d: '필수 아님 (없어도 됨)' },
      ],
      why: '리소스 식별은 경로로, 옵션은 쿼리로 구분하려고요.',
      pitfall: '필수 여부를 명확히 정하지 않으면 400이 자주 발생해요.',
    },
  },
];
