import type { Snippet } from '../../types';

export const springMvc: Snippet[] = [
  {
    id: 'mvc-rest-controller',
    lang: 'java',
    title: '@RestController 기본',
    file: 'HelloController.java',
    code: `import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class HelloController {

  @GetMapping("/hello")
  public String hello() {
    System.out.println("[실행] GET /hello 요청 수신");
    return "hello";
  }
}`,
    explain: {
      concept:
        '@RestController는 반환값을 HTTP 응답 본문으로 직접 써주는 API 전용 컨트롤러예요. ' +
        '@Controller + @ResponseBody가 합쳐진 형태로, 메서드가 반환하는 문자열 "hello"가 뷰(HTML) 이름이 아니라 그대로 HTTP 응답 본문에 담겨서 클라이언트에게 전송돼요. ' +
        '객체를 반환하면 스프링이 자동으로 JSON으로 직렬화(직렬화: 객체를 전송 가능한 문자열 형태로 변환)해서 보내주고, String을 반환하면 text/plain으로 보내줘요. ' +
        '실무에서 REST API를 만들 때는 모든 컨트롤러를 @RestController로 시작한다고 보면 돼요 - 요즘 웹 개발의 표준이에요.',
      terms: [
        { t: '@RestController', d: 'HTTP 응답 본문으로 직접 쓰는 REST API용 컨트롤러예요 - @Controller + @ResponseBody를 합친 거예요' },
        { t: '@GetMapping("/hello")', d: 'GET /hello 요청이 오면 이 메서드를 실행하도록 연결해줘요' },
        { t: 'return "hello"', d: '반환된 문자열이 뷰 이름이 아니라 HTTP 응답 본문이 돼요' },
        { t: 'System.out.println', d: '요청이 들어왔을 때 콘솔에 로그를 남겨 디버깅을 도와줘요' },
      ],
      why:
        'JSON API를 만들 때 가장 간단하고 표준적인 방법이에요. ' +
        '실무에서는 대부분의 컨트롤러가 @RestController로 시작하고, 프론트엔드(React, Vue 등)가 이 API를 호출해서 데이터를 주고받아요.',
      expectedOutput:
        'GET /hello 요청 시 콘솔:\n' +
        '[실행] GET /hello 요청 수신\n' +
        'HTTP 응답 (200 OK):\n' +
        'hello',
      realWorldUsage:
        '실제로 프론트엔드에서 fetch("/hello")로 호출하면 "hello"라는 텍스트가 응답으로 와요. ' +
        '이걸 List<User>로 반환하면 [{id:1, name:"kim"}, ...] 같은 JSON 배열이 자동으로 만들어져요.',
      pitfall: '@Controller + return "hello" 하면 "hello"라는 이름의 뷰(HTML 템플릿)를 찾으려고 해서 404가 나요. 반드시 @RestController나 @ResponseBody를 붙이세요.',
    },
  },
  {
    id: 'mvc-request-mapping',
    lang: 'java',
    title: '@RequestMapping 클래스 단위 경로',
    file: 'UserController.java',
    code: `import java.util.List;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/users")
public class UserController {

  @GetMapping
  public List<User> list() {
    System.out.println("[실행] GET /api/users - 목록 조회");
    return List.of();
  }

  @PostMapping
  public User create(@RequestBody User user) {
    System.out.println("[실행] POST /api/users - 생성: " + user);
    return user;
  }
}`,
    explain: {
      concept:
        '@RequestMapping("/api/users")를 클래스에 붙이면 이 컨트롤러의 모든 메서드가 "/api/users" 아래에 자동으로 매핑돼요. ' +
        '@GetMapping에 경로를 생략하면 GET /api/users에 매핑되고, @PostMapping에 경로를 생략하면 POST /api/users에 매핑돼요. ' +
        '간판 역할이라고 생각하면 쉬워요 - 컨트롤러 입구에 "/api/users"라는 간판을 달아두면 안에 있는 모든 방(메서드)이 그 아래 주소로 연결되는 거예요. ' +
        '실무에서는 도메인별로 컨트롤러를 만들고(UsersController, OrdersController, ProductsController), 클래스 레벨에 공통 prefix를 붙여서 URL 구조를 깔끔하게 정리해요.',
      terms: [
        { t: '@RequestMapping("/api/users")', d: '이 컨트롤러 내 모든 메서드의 기본 URL 경로를 설정해요 - 반복되는 경로를 한 번에 관리해요' },
        { t: '@GetMapping', d: '클래스 경로만 사용해 GET /api/users에 매핑돼요 - 메서드 단위 경로를 생략할 수 있어요' },
        { t: '@PostMapping', d: '클래스 경로만 사용해 POST /api/users에 매핑돼요' },
        { t: '@RequestBody', d: 'HTTP 요청 본문의 JSON을 User 객체로 자동 변환해줘요' },
      ],
      why:
        '반복되는 URL prefix를 한 번에 관리해서 코드 중복을 없애고, 나중에 경로를 바꿀 때도 클래스 선언부 한 줄만 수정하면 돼요. ' +
        '실무에서는 /api/v1/users, /api/v2/users처럼 버전도 prefix로 관리해요.',
      expectedOutput:
        'GET /api/users 호출 시:\n' +
        '[실행] GET /api/users - 목록 조회\n' +
        'POST /api/users 호출 시:\n' +
        '[실행] POST /api/users - 생성: User{name=\'kim\'}',
      realWorldUsage:
        '실제로 모든 컨트롤러에 @RequestMapping("/api/v1/...")를 붙여서 API 버전을 URL에 포함시켜요. ' +
        'v2에서는 경로만 /api/v2/users로 바꾸면 하위 호환성을 유지하면서 새 API를 제공할 수 있어요.',
      pitfall: '메서드 단위 매핑이 없으면 클래스 경로만으로도 요청을 받을 수 있어요. GET /api/users가 list()를 실행하는 건 의도된 동작이지만, 다른 HTTP 메서드(GET, POST, PUT, DELETE)를 구분하지 않으면 같은 URL에 여러 메서드가 충돌할 수 있어요.',
    },
  },
  {
    id: 'mvc-get-mapping',
    lang: 'java',
    title: '@GetMapping 조회',
    file: 'ProductController.java',
    code: `import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/products")
public class ProductController {

  @GetMapping("/{id}")
  public Product get(@PathVariable Long id) {
    System.out.println("[실행] GET /products/" + id + " - 상품 조회");
    return productService.find(id);
  }
}`,
    explain: {
      concept:
        '@GetMapping은 "데이터를 가져다 줘"라는 GET 요청을 처리하는 메서드에 붙여요. ' +
        '/{id}라는 경로 패턴을 쓰면 URL 자체에 값이 포함돼서, /products/5로 요청이 오면 {id} 자리에 5가 들어가고 @PathVariable로 그 값을 꺼낼 수 있어요. ' +
        'GET 메서드는 HTTP 명세상 요청 본문(body)이 없고, 필요한 정보는 URL 경로와 쿼리 파라미터로만 전달하는 게 원칙이에요. ' +
        '실무에서 조회 API는 거의 다 @GetMapping으로 만드는데, 리소스를 조회할 뿐 서버 상태를 바꾸지 않는 안전한 요청이에요.',
      terms: [
        { t: '@GetMapping("/{id}")', d: 'GET /products/{id} 요청을 이 메서드로 연결해요 - {id}는 동적 경로 변수 자리예요' },
        { t: '@PathVariable Long id', d: 'URL 경로의 {id} 값을 꺼내서 Long 타입으로 변환해줘요 - 자동 타입 변환도 해줘요' },
        { t: 'productService.find(id)', d: '서비스 계층에 실제 조회를 위임해요 - 컨트롤러는 요청 라우팅만 담당해요' },
      ],
      why:
        '리소스 조회는 GET 방식이 HTTP 표준이고, 캐싱·북마크·링크 공유가 가능해서 사용자 경험에도 좋아요. ' +
        'POST로 조회하면 브라우저 뒤로가기 시 "폼을 다시 제출하시겠습니까?" 같은 경고가 떠서 불편해요.',
      expectedOutput:
        'GET /products/5 호출 시:\n' +
        '[실행] GET /products/5 - 상품 조회',
      realWorldUsage:
        '실제 쇼핑몰에서 /products/123 페이지를 열면, 브라우저가 GET /api/v1/products/123을 호출하고 서버가 상품 정보를 JSON으로 반환해요. ' +
        'URL만 봐도 "123번 상품을 조회하는구나"라고 알 수 있어서 RESTful 설계의 핵심이에요.',
      pitfall: 'GET 요청은 본문이 없으므로 파라미터는 URL로만 전달해요. 많은 데이터를 보내야 하면 POST를 고려하되, 조회라면 쿼리 파라미터를 활용하세요.',
    },
  },
  {
    id: 'mvc-post-mapping',
    lang: 'java',
    title: '@PostMapping 생성',
    file: 'OrderController.java',
    code: `import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/orders")
public class OrderController {

  @PostMapping
  public Order create(@RequestBody OrderRequest req) {
    System.out.println("[실행] POST /orders - 주문 생성: " + req);
    return orderService.create(req);
  }
}`,
    explain: {
      concept:
        '@PostMapping은 "새 리소스를 만들어 줘"라는 POST 요청을 처리해요. ' +
        '클라이언트가 요청 본문에 JSON으로 데이터를 담아 보내면, @RequestBody가 그 JSON을 OrderRequest라는 자바 객체로 자동 변환해줘요. ' +
        'POST는 서버의 상태를 변경하고(새 데이터를 만드는) 요청이므로, 여러 번 반복 호출하면 같은 주문이 중복 생성될 수 있어요 - 이걸 비멱등(멱등: 같은 요청을 여러 번 해도 결과가 같음)이라고 해요. ' +
        '실무에서는 회원가입, 주문 생성, 게시글 작성처럼 "새로 만드는" 모든 작업을 @PostMapping으로 처리해요.',
      terms: [
        { t: '@PostMapping', d: 'POST 요청을 메서드로 연결해요 - 주로 새 리소스 생성에 써요' },
        { t: '@RequestBody OrderRequest req', d: 'HTTP 본문의 JSON 데이터를 OrderRequest 객체로 변환해줘요' },
        { t: 'orderService.create(req)', d: '실제 생성 로직은 서비스 계층에 위임해요 - 컨트롤러는 입력만 받아 넘겨요' },
        { t: 'OrderRequest', d: '클라이언트가 보낸 요청 데이터를 담는 DTO(Data Transfer Object)예요' },
      ],
      why:
        '리소스를 생성할 때는 HTTP 표준상 POST를 쓰는 게 정석이에요. ' +
        'GET으로 생성하면 브라우저가 URL만 보고도 요청을 보낼 수 있어서, 검색엔진 크롤러가 실수로 데이터를 생성해버리는 사고가 날 수 있어요.',
      expectedOutput:
        'POST /orders 호출 시 (본문: {"item":"book","qty":2}):\n' +
        '[실행] POST /orders - 주문 생성: OrderRequest[item=book, qty=2]',
      realWorldUsage:
        '실제로 결제 페이지에서 "결제하기" 버튼을 클릭하면 POST /api/v1/orders가 호출되고, 요청 본문에 상품ID, 수량, 배송지 등이 JSON으로 담겨서 전송돼요.',
      pitfall: '요청 본문이 없거나 JSON 파싱에 실패하면 HttpMessageNotReadableException이 발생하고 400 Bad Request가 응답돼요. 클라이언트가 Content-Type: application/json을 헤더에 꼭 넣어야 해요.',
    },
  },
  {
    id: 'mvc-put-mapping',
    lang: 'java',
    title: '@PutMapping 전체 수정',
    file: 'BookController.java',
    code: `import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/books")
public class BookController {

  @PutMapping("/{id}")
  public Book update(@PathVariable Long id, @RequestBody BookRequest req) {
    System.out.println("[실행] PUT /books/" + id + " - 도서 정보 갱신: " + req);
    return bookService.update(id, req);
  }
}`,
    explain: {
      concept:
        '@PutMapping은 "이 리소스를 지금 보내는 데이터로 완전히 대체해 줘"라는 PUT 요청을 처리해요. ' +
        'id로 대상 리소스를 특정하고, 요청 본문으로 새 데이터를 전달해서 해당 리소스의 모든 필드를 덮어써요 - 부분 수정이 아니라 전체 교체가 기본이에요. ' +
        'PUT은 멱등성(여러 번 호출해도 결과가 같음)이 있어서, 같은 요청을 실수로 2번 보내도 결과는 동일해요 - POST와 가장 큰 차이점이에요. ' +
        '실무에서는 회원 정보 전체 수정, 상품 정보 전체 갱신, 설정 전체 변경처럼 "완전히 바꾸는" 작업에 써요. 부분만 바꾸고 싶다면 PATCH를 써요.',
      terms: [
        { t: '@PutMapping("/{id}")', d: 'PUT /books/{id} 요청을 이 메서드로 연결해요 - 수정할 대상의 ID를 경로에서 받아요' },
        { t: '@PathVariable Long id', d: 'URL에서 수정 대상의 ID를 숫자로 추출해요' },
        { t: '@RequestBody BookRequest req', d: '새로 덮어쓸 데이터를 JSON에서 객체로 변환해 받아요' },
        { t: 'bookService.update(id, req)', d: '실제 업데이트 로직은 서비스에 위임해요' },
      ],
      why:
        '리소스 전체를 교체할 때는 HTTP 표준상 PUT이 적합해요. ' +
        '멱등성이 보장돼서 네트워크 오류로 클라이언트가 같은 요청을 재시도해도 안전해요.',
      expectedOutput:
        'PUT /books/10 호출 시 (본문: {"title":"New Title","author":"kim"}):\n' +
        '[실행] PUT /books/10 - 도서 정보 갱신: BookRequest[title=New Title, author=kim]',
      realWorldUsage:
        '실제로 "회원정보수정" 페이지에서 모든 필드를 한 번에 보내는 경우 PUT을, "비밀번호만 변경"처럼 일부만 보내는 경우 PATCH를 써요. ' +
        'RESTful API 설계 가이드라인에서 가장 흔히 논의되는 주제 중 하나예요.',
      pitfall: 'PUT은 부분 수정이 아니라 전체 대체라는 점을 잊지 마세요. 보내지 않은 필드는 null로 덮어써질 수 있어요. 부분 수정이 목적이면 PATCH 메서드를 쓰거나, PUT에서도 모든 필드를 보내도록 강제해야 해요.',
    },
  },
  {
    id: 'mvc-delete-mapping',
    lang: 'java',
    title: '@DeleteMapping 삭제',
    file: 'TaskController.java',
    code: `import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/tasks")
public class TaskController {

  @DeleteMapping("/{id}")
  public void delete(@PathVariable Long id) {
    System.out.println("[실행] DELETE /tasks/" + id + " - 작업 삭제");
    taskService.delete(id);
  }
}`,
    explain: {
      concept:
        '@DeleteMapping은 "이 리소스를 지워 줘"라는 DELETE 요청을 처리해요. ' +
        '휴지통 버튼을 누르는 것과 정확히 같은 개념이에요 - /tasks/5로 DELETE 요청이 오면 5번 작업을 삭제해요. ' +
        '반환 타입을 void로 하면 스프링이 자동으로 200 OK 상태 코드를 반환해요. 응답 본문 없이 삭제 성공만 알리면 충분한 경우에 딱 맞아요. ' +
        'DELETE도 멱등성이 있어서, 이미 삭제된 리소스를 다시 삭제 요청해도 같은 결과(삭제됨 또는 없음)예요.',
      terms: [
        { t: '@DeleteMapping("/{id}")', d: 'DELETE /tasks/{id} 요청을 이 메서드로 연결해요' },
        { t: '@PathVariable Long id', d: 'URL에서 삭제할 대상의 ID를 추출해요' },
        { t: 'void', d: '반환값이 없으면 스프링이 자동으로 200 OK를 응답해요 - 삭제 성공을 의미해요' },
        { t: 'taskService.delete(id)', d: '삭제 로직을 서비스 계층에 위임해요' },
      ],
      why:
        '리소스 삭제는 HTTP 표준상 DELETE를 쓰는 게 RESTful 설계 원칙이에요. ' +
        'POST로 삭제해도 동작은 하지만, URL만 봐서는 "조회인지 삭제인지" 알 수 없어서 API 문서를 매번 확인해야 해요.',
      expectedOutput:
        'DELETE /tasks/7 호출 시:\n' +
        '[실행] DELETE /tasks/7 - 작업 삭제\n' +
        'HTTP 응답: 200 OK (본문 없음)',
      realWorldUsage:
        '실제로 ToDo 앱에서 할 일 삭제 버튼을 누르면 DELETE /api/v1/tasks/42가 호출돼요. ' +
        '관리자 페이지에서 회원 탈퇴 처리도 DELETE /api/v1/users/5 같은 패턴이에요.',
      pitfall: 'void 반환 시 상태 코드는 200 OK가 기본이에요. 삭제 성공을 204 No Content로 더 명확하게 표현하려면 ResponseEntity.noContent().build()를 반환하세요.',
    },
  },
  {
    id: 'mvc-request-body',
    lang: 'java',
    title: '@RequestBody JSON -> 객체',
    file: 'SignupController.java',
    code: `import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class SignupController {

  @PostMapping("/signup")
  public ResponseEntity<String> signup(@RequestBody SignupRequest req) {
    System.out.println("[실행] POST /signup - 가입 요청: " + req.getEmail());
    return ResponseEntity.ok("가입: " + req.getEmail());
  }
}`,
    explain: {
      concept:
        '@RequestBody는 클라이언트가 보낸 HTTP 요청 본문(주로 JSON)을 자바 객체로 자동 변환해주는 어노테이션이에요. ' +
        '스프링이 내부적으로 HttpMessageConverter(기본은 MappingJackson2HttpMessageConverter, Jackson 라이브러리 기반)를 사용해서 JSON 키-값을 자바 객체의 필드에 매핑해줘요. ' +
        '우편물을 뜯어서 내용물을 정해진 상자 칸칸에 정리하는 것과 같아요 - JSON의 "email" 키가 SignupRequest의 email 필드에 자동으로 들어가요. ' +
        'ResponseEntity는 "상태 코드 + 응답 본문"을 함께 반환할 수 있는 응답 상자예요 - ok()는 200 상태 코드를 만들어줘요.',
      terms: [
        { t: '@RequestBody', d: 'HTTP 요청 본문(JSON)을 자바 객체로 변환해줘요 - Jackson이 내부적으로 동작해요' },
        { t: 'SignupRequest', d: '회원가입 요청 데이터를 담는 DTO 예요 - JSON 필드명과 일치하는 필드를 가져요' },
        { t: 'ResponseEntity<String>', d: '상태 코드와 응답 본문을 함께 제어할 수 있는 래퍼 객체예요' },
        { t: 'ResponseEntity.ok(...)', d: '200 OK 상태 코드에 본문을 담아 반환해요' },
      ],
      why:
        'JSON 문자열을 수동으로 파싱하지 않고, 타입 안전한 자바 객체로 바로 받으려고 써요. ' +
        'JSON 파싱 코드를 일일이 작성하면 실수하기도 쉽고, 필드가 추가될 때마다 코드를 바꿔야 해서 유지보수가 어려워져요.',
      expectedOutput:
        'POST /signup 호출 시 (본문: {"email":"kim@test.com","password":"1234"}):\n' +
        '[실행] POST /signup - 가입 요청: kim@test.com\n' +
        'HTTP 응답 (200 OK):\n' +
        '가입: kim@test.com',
      realWorldUsage:
        '실제로 회원가입 폼에서 사용자가 정보를 입력하고 "가입" 버튼을 클릭하면, 프론트엔드가 JSON으로 변환해 POST /signup으로 전송해요. ' +
        '컨트롤러에서 @RequestBody로 받아 서비스에 넘기고, DB에 저장하는 흐름이에요.',
      pitfall: 'JSON 키 이름과 DTO 필드명이 다르면 매핑이 안 돼서 필드가 null로 남아요. Jackson의 @JsonProperty("user_name") 어노테이션으로 다른 이름을 연결할 수 있어요.',
    },
  },
  {
    id: 'mvc-path-variable',
    lang: 'java',
    title: '@PathVariable 경로 변수',
    file: 'PostController.java',
    code: `import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/posts")
public class PostController {

  @GetMapping("/{postId}/comments/{commentId}")
  public Comment find(@PathVariable Long postId, @PathVariable Long commentId) {
    System.out.println("[실행] GET /posts/" + postId + "/comments/" + commentId);
    return commentService.find(postId, commentId);
  }
}`,
    explain: {
      concept:
        '@PathVariable은 URL 경로의 동적 부분(경로 변수)을 꺼내서 메서드 파라미터로 받는 어노테이션이에요. ' +
        '중첩 리소스(postId 안의 commentId)를 표현할 때 특히 강력한데, /posts/42/comments/7처럼 URL에 계층 구조를 그대로 담을 수 있어요. ' +
        '경로 변수명({postId})과 파라미터명(postId)이 같으면 값을 자동으로 매핑해주고, 다르면 @PathVariable("postId")처럼 명시적으로 이름을 지정해야 해요. ' +
        'String 타입으로 받을 수도 있지만, Long으로 선언하면 스프링이 자동으로 숫자 변환까지 해줘요 - 변환에 실패하면 400 Bad Request가 나요.',
      terms: [
        { t: '@PathVariable Long postId', d: 'URL의 {postId} 부분을 Long 타입으로 변환해 파라미터에 담아줘요' },
        { t: '{postId}', d: '경로 변수 자리표시자예요 - 이 위치에 실제 ID 값이 들어와요' },
        { t: '{commentId}', d: '두 번째 경로 변수예요 - 여러 변수를 한 URL에 중첩해서 쓸 수 있어요' },
        { t: 'Long', d: '숫자 타입으로 자동 변환돼요 - "abc"가 오면 400 Bad Request가 나요' },
      ],
      why:
        'URL 자체에 리소스 식별자를 포함시켜 RESTful한 계층 구조를 표현하려고 써요. ' +
        '/posts/42/comments/7만 봐도 "42번 게시글의 7번 댓글"이라는 의미가 직관적으로 읽혀요.',
      expectedOutput:
        'GET /posts/42/comments/7 호출 시:\n' +
        '[실행] GET /posts/42/comments/7',
      realWorldUsage:
        '실제로 블로그 API에서 /posts/{postId}/comments, /posts/{postId}/likes, /users/{userId}/posts처럼 소속 관계를 URL 계층으로 표현해요.',
      pitfall: '파라미터명과 경로 변수명이 다르면 @PathVariable("postId")처럼 이름을 반드시 명시해야 해요. 안 그러면 IllegalArgumentException이 발생해요.',
    },
  },
  {
    id: 'mvc-request-param',
    lang: 'java',
    title: '@RequestParam 쿼리 파라미터',
    file: 'SearchController.java',
    code: `import java.util.List;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class SearchController {

  @GetMapping("/search")
  public List<Item> search(
      @RequestParam String q,
      @RequestParam(defaultValue = "1") int page) {
    System.out.println("[실행] GET /search?q=" + q + "&page=" + page);
    return searchService.search(q, page);
  }
}`,
    explain: {
      concept:
        '@RequestParam은 URL의 ? 뒤에 붙은 쿼리 파라미터 값을 꺼내는 어노테이션이에요. ' +
        '/search?q=coffee&page=2라는 URL이 오면, q에는 "coffee", page에는 2가 들어가요. ' +
        'defaultValue를 설정하면 해당 파라미터가 생략됐을 때 기본값을 사용해요 - page 파라미터 없이 /search?q=coffee만 보내도 page는 1로 설정돼서 400 에러를 피할 수 있어요. ' +
        '필수 파라미터(defaultValue 없는 값)가 URL에 없으면 400 Bad Request가 발생해요.',
      terms: [
        { t: '@RequestParam String q', d: '?q=검색어 값을 문자열로 꺼내요 - 이 파라미터는 필수예요 (defaultValue 없음)' },
        { t: '@RequestParam(defaultValue = "1") int page', d: 'page가 없으면 기본값 1을 사용해요 - 필수 파라미터가 아니어도 안전해요' },
        { t: 'searchService.search(q, page)', d: '추출한 검색어와 페이지 번호를 서비스 계층에 전달해요' },
      ],
      why:
        '검색 조건, 필터, 페이지네이션 정보 등 부가적인 요청 정보를 URL로 전달하려고 써요. ' +
        '이런 부가 정보까지 URL 경로에 넣으면 /search/coffee/page/2처럼 경로가 지저분해져서, RESTful 관례상 쿼리 파라미터로 분리해요.',
      expectedOutput:
        'GET /search?q=coffee&page=2 호출 시:\n' +
        '[실행] GET /search?q=coffee&page=2\n' +
        'GET /search?q=coffee 호출 시 (page 생략):\n' +
        '[실행] GET /search?q=coffee&page=1',
      realWorldUsage:
        '실제로 쇼핑몰 검색에서 /products?category=electronics&minPrice=1000&sort=price_desc처럼 여러 필터 조건을 조합할 때 @RequestParam을 써요.',
      pitfall: 'defaultValue가 없는 파라미터가 요청에 없으면 400 Bad Request가 발생해요. 선택적 파라미터는 defaultValue를 설정하거나 required = false로 명시하세요.',
    },
  },
  {
    id: 'mvc-valid',
    lang: 'java',
    title: '@Valid 검증',
    file: 'MemberController.java',
    code: `import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class MemberController {

  @PostMapping("/members")
  public Member join(@Valid @RequestBody MemberRequest req) {
    System.out.println("[실행] POST /members - 검증 통과 후 가입: " + req);
    return memberService.join(req);
  }
}`,
    explain: {
      concept:
        '@Valid는 요청 객체의 필드에 붙은 검증 어노테이션(@NotBlank, @Email, @Min 등)을 자동으로 실행해서, 데이터가 규칙에 맞는지 확인해줘요. ' +
        '컨트롤러 메서드에 진입하기 전에 검증이 먼저 실행되고, 실패하면 400 Bad Request와 함께 MethodArgumentNotValidException이 발생해요 - 비즈니스 로직이 오염된 데이터를 받을 일이 없어져요. ' +
        '보안 검색대를 통과하는 것과 같아요 - 유효하지 않은 데이터는 컨트롤러에 도달하기도 전에 걸러져요.',
      terms: [
        { t: '@Valid', d: '객체에 붙은 Bean Validation 어노테이션을 실행해 입력값을 검증해요 - 실패 시 400 응답' },
        { t: '@RequestBody', d: 'JSON을 자바 객체로 변환해요 - @Valid보다 먼저 실행돼요' },
        { t: 'MemberRequest', d: '검증 규칙(예: @NotBlank name)이 붙은 DTO예요' },
        { t: 'memberService.join(req)', d: '검증을 통과한 안전한 데이터만 서비스 계층에 전달돼요' },
      ],
      why:
        '잘못된 입력을 서비스 계층까지 들여보내지 않고, 컨트롤러 진입 전에 차단하려고 써요. ' +
        '서비스에서 일일이 if (name == null) 체크를 하지 않아도 돼서 비즈니스 로직이 깔끔해져요.',
      expectedOutput:
        '유효한 요청 (POST /members, 본문: {"name":"kim","email":"kim@test.com"}):\n' +
        '[실행] POST /members - 검증 통과 후 가입: MemberRequest[name=kim, email=kim@test.com]\n\n' +
        '유효하지 않은 요청 (name 없음):\n' +
        'HTTP 응답: 400 Bad Request',
      realWorldUsage:
        '실제로 회원가입 API에서 "이름은 필수", "이메일 형식 확인", "비밀번호 8자 이상" 같은 규칙을 DTO에 미리 선언해두고, @Valid만 붙이면 모든 검증이 자동으로 실행돼요.',
      pitfall: '@Valid만으로는 계층형 검증(중첩 객체의 필드 검증)이 안 돼요. MemberRequest 안에 Address 객체가 있다면, Address 필드에도 @Valid를 붙여야 내부 필드까지 검증해요.',
    },
  },
  {
    id: 'mvc-binding-result',
    lang: 'java',
    title: 'BindingResult 수동 처리',
    file: 'ReviewController.java',
    code: `import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class ReviewController {

  @PostMapping("/reviews")
  public ResponseEntity<String> write(@Valid @RequestBody ReviewRequest req, BindingResult result) {
    if (result.hasErrors()) {
      System.out.println("[실행] 검증 실패 - 오류 수: " + result.getErrorCount());
      return ResponseEntity.badRequest().body("검증 실패");
    }
    System.out.println("[실행] POST /reviews - 작성 완료: " + req);
    return ResponseEntity.ok("작성 완료");
  }
}`,
    explain: {
      concept:
        'BindingResult는 @Valid 검증의 결과를 담는 상자예요. 이 파라미터를 추가하면 검증 실패 시 자동으로 400 예외가 발생하지 않고, 결과를 직접 확인하고 내 방식대로 응답할 수 있어요. ' +
        'hasErrors()로 오류 여부를 확인하고, getFieldErrors()로 어떤 필드가 왜 실패했는지 상세 정보를 얻을 수 있어요 - 단순히 "실패"만 알리는 게 아니라 "이름이 비어 있습니다"처럼 구체적인 메시지를 클라이언트에게 줄 수 있어요. ' +
        'BindingResult는 반드시 검증 대상(@RequestBody) 바로 다음 파라미터에 와야 해요 - 순서가 바뀌면 스프링이 BindingResult를 못 찾고 예외를 던져요.',
      terms: [
        { t: 'BindingResult', d: '검증 결과를 담는 객체예요 - @Valid 검증 후 오류 정보가 여기에 들어와요' },
        { t: 'hasErrors()', d: '검증 오류가 하나라도 있는지 boolean으로 확인해요' },
        { t: 'getErrorCount()', d: '몇 개의 검증 오류가 발생했는지 개수를 반환해요' },
        { t: 'badRequest().body("검증 실패")', d: '400 상태 코드와 함께 직접 작성한 에러 메시지를 응답해요' },
      ],
      why:
        '검증 실패 시 자동으로 발생하는 400 에러를 그대로 내보내지 않고, 응답 형식을 프론트엔드가 이해하기 좋은 형태로 직접 제어하려고 써요. ' +
        '실무에서는 {"status":400, "errors":[{"field":"name","message":"이름은 필수예요"}]} 같은 구조화된 에러 응답을 커스텀해서 보내요.',
      expectedOutput:
        '유효하지 않은 요청 (name 없음):\n' +
        '[실행] 검증 실패 - 오류 수: 1\n' +
        'HTTP 응답: 400 Bad Request\n' +
        '검증 실패\n\n' +
        '유효한 요청:\n' +
        '[실행] POST /reviews - 작성 완료: ReviewRequest[...]',
      realWorldUsage:
        '실제로 글로벌 ExceptionHandler에서 MethodArgumentNotValidException을 잡아서, ' +
        '각 필드의 에러 메시지를 JSON 배열로 구조화해 응답하는 패턴이 표준이에요.',
      pitfall: 'BindingResult 파라미터는 반드시 @Valid가 붙은 파라미터 바로 다음에 와야 해요. 순서가 바뀌면 "BindingResult is not present" 예외가 발생해요.',
    },
  },
  {
    id: 'mvc-exception-handler',
    lang: 'java',
    title: '@ExceptionHandler 예외 처리',
    file: 'ProductController.java',
    code: `import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class ProductController {

  @GetMapping("/products/{id}")
  public Product find(@PathVariable Long id) {
    System.out.println("[실행] GET /products/" + id);
    return productService.find(id);
  }

  @ExceptionHandler(NotFoundException.class)
  public ResponseEntity<String> notFound(NotFoundException e) {
    System.out.println("[실행] NotFoundException 처리됨: " + e.getMessage());
    return ResponseEntity.status(404).body(e.getMessage());
  }
}`,
    explain: {
      concept:
        '@ExceptionHandler는 이 컨트롤러 안에서 특정 예외가 발생하면 가로채서 처리하는 로컬 예외 처리기예요. ' +
        'find() 메서드에서 NotFoundException이 발생하면, 스프링이 자동으로 notFound() 메서드를 호출해서 404 응답을 만들어줘요. ' +
        '응급실 전담 의사와 같아요 - 이 컨트롤러에서 발생한 NotFoundException이라는 특정 병만 전문적으로 치료해요. ' +
        '하지만 이 컨트롤러 안에서만 동작하기 때문에, 다른 10개 컨트롤러에 같은 코드를 복사해야 하는 한계가 있어요 - 이럴 땐 @RestControllerAdvice로 전역 처리하는 게 좋아요.',
      terms: [
        { t: '@ExceptionHandler(NotFoundException.class)', d: '이 컨트롤러에서 NotFoundException이 발생하면 이 메서드가 대신 처리해요' },
        { t: 'NotFoundException', d: '리소스를 찾을 수 없을 때 발생하는 커스텀 예외예요' },
        { t: 'ResponseEntity.status(404)', d: '404 Not Found 상태 코드의 응답을 만들어요' },
        { t: 'e.getMessage()', d: '예외가 생성될 때 넣은 메시지를 응답 본문으로 보내요' },
      ],
      why:
        '컨트롤러에서 발생하는 예외를 try-catch 없이 깔끔하게 처리하려고 써요. ' +
        '에러 응답 형식을 404, 400, 500 등 HTTP 상태 코드와 함께 일관되게 만들 수 있어요.',
      expectedOutput:
        'GET /products/999 호출 시 (존재하지 않는 상품):\n' +
        '[실행] GET /products/999\n' +
        '[실행] NotFoundException 처리됨: 상품을 찾을 수 없음\n' +
        'HTTP 응답: 404 Not Found\n' +
        '상품을 찾을 수 없음',
      realWorldUsage:
        '실제로 특정 컨트롤러에만 특별한 에러 처리 로직이 필요할 때 @ExceptionHandler를 컨트롤러 내부에 둬요. ' +
        '공통 처리는 @RestControllerAdvice로 빼고, 개별 컨트롤러 특수 처리는 여기서 하는 전략이에요.',
      pitfall: '이 @ExceptionHandler는 선언된 컨트롤러 안에서만 동작해요. 다른 컨트롤러에서 같은 예외가 발생하면 처리되지 않고 500 에러가 나요. 전역 처리가 필요하면 @RestControllerAdvice로 분리하세요.',
    },
  },
  {
    id: 'mvc-rest-controller-advice',
    lang: 'java',
    title: '@RestControllerAdvice 전역 처리',
    file: 'GlobalExceptionHandler.java',
    code: `import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

@RestControllerAdvice
public class GlobalExceptionHandler {

  @ExceptionHandler(IllegalArgumentException.class)
  public ResponseEntity<String> handle(IllegalArgumentException e) {
    System.out.println("[실행] 전역 예외 처리 - IllegalArgumentException: " + e.getMessage());
    return ResponseEntity.badRequest().body(e.getMessage());
  }
}`,
    explain: {
      concept:
        '@RestControllerAdvice는 애플리케이션 전체의 모든 컨트롤러에서 발생하는 예외를 한 곳에서 통일되게 처리하는 전역 예외 처리기예요. ' +
        '각 컨트롤러마다 @ExceptionHandler를 복사할 필요 없이, IllegalArgumentExeption이 어디서 발생하든 이 클래스로 모여서 처리돼요. ' +
        '회사 안내 데스크와 같아요 - 어떤 부서(컨트롤러)에서 문제(예외)가 생겨도 안내 데스크(Advice)가 일관된 방식으로 응대해줘요. ' +
        '실무에서는 NotFoundException -> 404, IllegalArgumentException -> 400, RuntimeException -> 500 같은 매핑 테이블을 여기에 작성해요.',
      terms: [
        { t: '@RestControllerAdvice', d: '모든 @RestController에서 발생하는 예외를 가로채 처리하는 전역 AOP 설정이에요' },
        { t: '@ExceptionHandler', d: '처리할 예외 타입을 하나씩 등록해요 - 여러 메서드로 다양한 예외를 처리할 수 있어요' },
        { t: 'badRequest()', d: '400 Bad Request 상태 코드의 응답을 생성해요' },
        { t: 'e.getMessage()', d: '예외 메시지를 응답 본문으로 클라이언트에게 전달해요' },
      ],
      why:
        '에러 응답 형식을 프로젝트 전체에서 통일하고, 같은 예외 처리 코드를 반복 작성하지 않으려고 써요. ' +
        '실무에서 API 에러 응답이 제각각이면 클라이언트 개발자가 처리하기 너무 힘들어져요.',
      expectedOutput:
        '어느 컨트롤러에서든 IllegalArgumentException 발생 시:\n' +
        '[실행] 전역 예외 처리 - IllegalArgumentException: 잘못된 요청입니다\n' +
        'HTTP 응답: 400 Bad Request\n' +
        '잘못된 요청입니다',
      realWorldUsage:
        '실제로 모든 API의 에러 응답을 { "error": { "code": "NOT_FOUND", "message": "..." } } 형태로 통일하는 역할을 해요. ' +
        '프론트엔드팀과 "에러 응답은 이 형식으로 간다"라고 약속하고 여기에 구현하는 거예요.',
      pitfall: '컨트롤러 내부의 @ExceptionHandler가 @RestControllerAdvice보다 우선순위가 높아요. 특정 컨트롤러에서만 다르게 처리하고 싶으면 컨트롤러 안에 @ExceptionHandler를 둬요.',
    },
  },
  {
    id: 'mvc-problem-detail',
    lang: 'java',
    title: 'ProblemDetail RFC7807',
    file: 'ApiExceptionHandler.java',
    code: `import org.springframework.http.HttpStatus;
import org.springframework.http.ProblemDetail;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

@RestControllerAdvice
public class ApiExceptionHandler {

  @ExceptionHandler(NotFoundException.class)
  public ProblemDetail handle(NotFoundException e) {
    ProblemDetail problem = ProblemDetail.forStatusAndDetail(HttpStatus.NOT_FOUND, e.getMessage());
    problem.setTitle("리소스 없음");
    System.out.println("[실행] ProblemDetail 생성 - " + e.getMessage());
    return problem;
  }
}`,
    explain: {
      concept:
        'ProblemDetail은 RFC 7807이라는 국제 표준 규약에 따라 에러 응답을 만들어주는 스프링 제공 클래스예요. ' +
        '일반 텍스트나 제각각인 JSON 대신, { "type": "...", "title": "리소스 없음", "status": 404, "detail": "..." } 같은 표준화된 형식으로 응답이 나가요. ' +
        '이 형식을 쓰면 클라이언트가 어떤 API를 호출하든 같은 구조로 에러를 해석할 수 있어서, 에러 처리 코드를 일관되게 작성할 수 있어요. ' +
        'forStatusAndDetail()은 HttpStatusCode 타입을 받기 때문에 HttpStatus.NOT_FOUND처럼 enum을 넘겨야 하고, int 리터럴(404)은 받지 않아요 - 이게 흔한 컴파일 실수예요.',
      terms: [
        { t: 'ProblemDetail', d: 'RFC 7807 표준을 따르는 에러 응답 객체예요 - type, title, status, detail 필드를 포함해요' },
        { t: 'forStatusAndDetail(HttpStatus, String)', d: '상태 코드와 상세 메시지를 받아 ProblemDetail을 생성해요 - int가 아닌 HttpStatusCode 타입을 넘겨야 해요' },
        { t: 'setTitle("리소스 없음")', d: '에러의 짧은 제목을 설정해요 - 응답 JSON의 title 필드에 들어가요' },
        { t: 'HttpStatus.NOT_FOUND', d: '404 상태 코드를 나타내는 enum 값이에요 - int 리터럴 404 대신 이걸 써야 해요' },
      ],
      why:
        'API 에러 응답을 국제 표준 형식으로 통일해서, 클라이언트가 일관되게 에러를 해석하게 하려고 써요. ' +
        '프론트엔드가 여러 마이크로서비스의 API를 호출할 때, 모두 같은 ProblemDetail 형식이면 파싱 로직을 한 번만 작성하면 돼요.',
      expectedOutput:
        'NotFoundException 발생 시:\n' +
        '[실행] ProblemDetail 생성 - 사용자 42를 찾을 수 없음\n' +
        'HTTP 응답 (404):\n' +
        '{ "type": "about:blank", "title": "리소스 없음", "status": 404, "detail": "사용자 42를 찾을 수 없음" }',
      realWorldUsage:
        '실제로 마이크로서비스 간 통신이나 공개 API(OpenAPI)에서 RFC 7807 ProblemDetail이 사실상 표준이에요. ' +
        '스프링 공식 문서도 ProblemDetail 사용을 강력히 권장해요.',
      pitfall: 'forStatusAndDetail()에 int 리터럴(404)을 넣으면 컴파일 에러가 나요. 반드시 HttpStatus.NOT_FOUND 같은 HttpStatusCode enum을 넘겨야 해요.',
    },
  },
  {
    id: 'mvc-response-entity',
    lang: 'java',
    title: 'ResponseEntity 상태+본문',
    file: 'AuthController.java',
    code: `import java.net.URI;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class AuthController {

  @PostMapping("/login")
  public ResponseEntity<Token> login(@RequestBody LoginRequest req) {
    System.out.println("[실행] POST /login - 로그인 시도: " + req.getEmail());
    Token token = authService.login(req);
    URI location = URI.create("/tokens/" + token.id);
    System.out.println("[결과] 토큰 발급: " + token + ", Location: " + location);
    return ResponseEntity.created(location).body(token);
  }
}`,
    explain: {
      concept:
        'ResponseEntity는 HTTP 응답의 상태 코드, 헤더, 본문을 한 번에 세밀하게 제어할 수 있는 응답 상자예요. ' +
        'created()는 201 Created 상태 코드와 함께 Location 헤더를 설정하는 특별한 빌더인데, "리소스가 생성됐고 여기서 확인할 수 있어요"라는 의미를 담아요. ' +
        '선물 상자를 보내면서 "안에 뭐가 들었고, 어디서 찾을 수 있는지" 카드에 적어주는 것과 같아요. ' +
        '단순히 return token만 하면 상태 코드를 바꿀 수 없지만, ResponseEntity를 쓰면 200, 201, 204 등 원하는 상태 코드를 자유롭게 선택할 수 있어요.',
      terms: [
        { t: 'ResponseEntity<Token>', d: 'Token 타입의 본문과 함께 상태 코드를 제어할 수 있는 응답 래퍼예요' },
        { t: 'created(location)', d: '201 Created 상태 코드를 설정하고 Location 헤더를 추가해요' },
        { t: '.body(token)', d: '응답 본문에 Token 객체를 담아요 - JSON으로 변환돼요' },
        { t: 'URI.create(...)', d: '문자열을 URI 객체로 변환해요 - Location 헤더의 값으로 쓰여요' },
      ],
      why:
        '상태 코드(201/204/301 등)를 정확히 지정하고, 헤더(Location, Cache-Control 등)를 제어하려고 써요. ' +
        'RESTful API에서 "생성됨"을 표현할 때 200보다 201 + Location 헤더가 더 정확한 의미를 전달해요.',
      expectedOutput:
        'POST /login 호출 시:\n' +
        '[실행] POST /login - 로그인 시도: kim@test.com\n' +
        '[결과] 토큰 발급: Token[id=abc123], Location: /tokens/abc123\n' +
        'HTTP 응답: 201 Created\n' +
        'Location: /tokens/abc123\n' +
        '{ "id": "abc123", ... }',
      realWorldUsage:
        '실제로 회원가입 성공 시 201 + Location: /api/v1/users/42를, 주문 생성 시 201 + Location: /api/v1/orders/100을 반환해요. ' +
        '클라이언트는 Location 헤더로 새 리소스의 URL을 바로 알 수 있어요.',
      pitfall: '201 Created 응답을 보낼 때는 Location 헤더를 함께 주는 게 RESTful 관례예요. Location 없이 201만 보내면 클라이언트가 새 리소스를 어떻게 찾을지 알 수 없어요.',
    },
  },
  {
    id: 'mvc-response-status',
    lang: 'java',
    title: '@ResponseStatus 상태 코드',
    file: 'CartController.java',
    code: `import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class CartController {

  @PostMapping("/carts")
  @ResponseStatus(HttpStatus.CREATED)
  public Cart create(@RequestBody CartRequest req) {
    System.out.println("[실행] POST /carts - 201 Created 응답: " + req);
    return cartService.create(req);
  }
}`,
    explain: {
      concept:
        '@ResponseStatus는 메서드의 기본 응답 상태 코드를 변경하는 어노테이션이에요. ' +
        '기본적으로 @RestController 메서드는 성공 시 200 OK를 반환하는데, @ResponseStatus(HttpStatus.CREATED)를 붙이면 201 Created로 바뀌어요. ' +
        'ResponseEntity를 쓰지 않고도 상태 코드를 바꿀 수 있어서 코드가 간결해지지만, 헤더를 조작할 수는 없어요. ' +
        '간단한 API에 적합하고, 상태 코드와 헤더 모두 세밀하게 제어해야 할 때는 ResponseEntity를 써요.',
      terms: [
        { t: '@ResponseStatus(HttpStatus.CREATED)', d: '이 메서드가 성공했을 때 반환할 HTTP 상태 코드를 201로 지정해요' },
        { t: 'HttpStatus.CREATED', d: '201 Created 상태 코드를 나타내는 enum 값이에요' },
        { t: 'return cartService.create(req)', d: '반환된 Cart 객체가 응답 본문이 되고, 상태 코드는 201이 돼요' },
      ],
      why:
        'ResponseEntity 없이 상태 코드만 간단히 바꾸려고 써요. ' +
        '201 Created, 204 No Content처럼 특별한 상태 코드가 필요하지만 헤더 조작은 필요 없을 때 딱 맞아요.',
      expectedOutput:
        'POST /carts 호출 시:\n' +
        '[실행] POST /carts - 201 Created 응답: CartRequest[...]\n' +
        'HTTP 응답: 201 Created',
      realWorldUsage:
        '실제로 DELETE /tasks/{id}에 @ResponseStatus(HttpStatus.NO_CONTENT)를 붙여서 삭제 성공을 더 의미 있게 표현해요.',
      pitfall: '예외가 발생하면 @ResponseStatus는 적용되지 않고, @ExceptionHandler나 @ResponseStatus를 예외 클래스에 직접 붙인 설정이 우선돼요.',
    },
  },
  {
    id: 'mvc-cross-origin',
    lang: 'java',
    title: '@CrossOrigin CORS 허용',
    file: 'PublicController.java',
    code: `import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@CrossOrigin(origins = "https://example.com")
public class PublicController {

  @GetMapping("/public")
  public String info() {
    System.out.println("[실행] GET /public - CORS 허용 요청");
    return "ok";
  }
}`,
    explain: {
      concept:
        '@CrossOrigin은 브라우저의 CORS(Cross-Origin Resource Sharing, 교차 출처 리소스 공유) 보안 정책을 풀어주는 허가증이에요. ' +
        '브라우저는 보안을 위해 example.com에서 요청한 자바스크립트가 api.other.com의 데이터를 함부로 못 읽게 막는데, 서버가 @CrossOrigin으로 "이 도메인은 허락했어요"라고 명시하면 브라우저가 요청을 허용해요. ' +
        'origins 속성으로 허용할 출처(도메인)를 지정하고, 생략하면 모든 도메인을 허용해서 보안에 취약해질 수 있어요.',
      terms: [
        { t: '@CrossOrigin', d: '다른 도메인(origin)에서의 HTTP 요청을 허용해요 - 브라우저의 CORS 제한을 풀어줘요' },
        { t: 'origins = "https://example.com"', d: '이 도메인에서 오는 요청만 허용해요 - 와일드카드(*)보다 안전해요' },
        { t: '/public', d: '누구나 접근 가능한 공개 API 경로예요 - 인증 없이 접근할 수 있어요' },
      ],
      why:
        '프론트엔드(React 등)가 다른 도메인의 API를 안전하게 호출할 수 있도록 허용하려고 써요. ' +
        '개발 중에는 localhost:3000 -> localhost:8080처럼 포트가 달라도 CORS가 막아서 이 설정이 필수예요.',
      expectedOutput:
        'GET /public 호출 시:\n' +
        '[실행] GET /public - CORS 허용 요청\n' +
        'HTTP 응답 (200 OK + CORS 헤더):\n' +
        'ok',
      realWorldUsage:
        '실제로 프론트엔드 앱(React, Vue)을 별도 도메인(cdn.example.com)에서 서빙하고, API 서버(api.example.com)를 분리하는 구조에서 필수예요.',
      pitfall: '운영 환경에서는 origins를 와일드카드(*)로 열지 말고, 실제 프론트엔드 도메인만 명시해야 해요. *는 쿠키를 포함한 인증 요청과 함께 쓸 수 없어요.',
    },
  },
  {
    id: 'mvc-bean-validation-dto',
    lang: 'java',
    title: 'Bean Validation DTO - @NotBlank/@Min',
    file: 'ProductRequest.java',
    code: `import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record ProductRequest(
    @NotBlank(message = "이름은 필수예요")
    String name,

    @Min(value = 0, message = "가격은 0 이상이어야 해요")
    int price,

    @Size(max = 500, message = "설명은 500자 이하예요")
    String description
) {
  public ProductRequest {
    System.out.println("[실행] ProductRequest 생성 - name: " + name + ", price: " + price);
  }
}`,
    explain: {
      concept:
        'Bean Validation 어노테이션은 DTO 필드에 직접 검증 규칙을 선언하는 방식이에요. @NotBlank는 문자열이 null이거나 공백이면 실패, @Min은 숫자가 최솟값 미만이면 실패, @Size는 문자열 길이 제한을 검사해요. ' +
        '레코드(record)의 Compact 생성자에서 검증 전에 값을 한 번 출력해서 디버깅을 도와주고 있어요 - 실제 검증 자체는 생성자 호출 후 @Valid를 통해 이뤄져요. ' +
        'message 속성으로 검증 실패 시 클라이언트에게 보여줄 한글 메시지를 직접 지정할 수 있어서, 별도의 에러 메시지 파일 없이도 친절한 안내를 만들 수 있어요.',
      terms: [
        { t: '@NotBlank', d: '문자열이 null, 빈 문자열(""), 공백(" ")이면 검증 실패예요 - 이름 같은 필수 입력에 써요' },
        { t: '@Min(value = 0)', d: '숫자가 0보다 작으면 검증 실패예요 - 음수 가격을 막아줘요' },
        { t: '@Size(max = 500)', d: '문자열 길이가 500자를 초과하면 검증 실패예요' },
        { t: 'message = "..."', d: '검증 실패 시 클라이언트에게 전달할 에러 메시지예요 - 한글로 친절하게 작성해요' },
      ],
      why:
        'DTO에 검증 규칙을 선언해 두면 컨트롤러 코드가 깔끔해지고, 잘못된 입력이 서비스 계층까지 도달하지 않아요. ' +
        '실무에서는 이런 검증 어노테이션을 DTO에 빼곡히 작성해서 입력값 안전망을 구축해요.',
      expectedOutput:
        'new ProductRequest("노트북", -1000, "상세") 호출 시:\n' +
        '[실행] ProductRequest 생성 - name: 노트북, price: -1000\n' +
        '이후 @Valid 검증 시 @Min 오류 발생',
      realWorldUsage:
        '실제로 모든 Request DTO에 @NotBlank, @Email, @Pattern, @Min, @Max 같은 검증 어노테이션을 달아서, ' +
        '형식이 잘못된 데이터가 DB까지 내려가는 걸 원천 차단해요.',
      pitfall: 'spring-boot-starter-validation 의존성이 없으면 @NotBlank를 붙여도 아무런 검증이 실행되지 않아요. build.gradle에 의존성 추가를 잊지 마세요.',
    },
  },
  {
    id: 'mvc-rest-client',
    lang: 'java',
    title: 'RestClient 외부 API 호출 (Spring Boot 3.2+)',
    file: 'PaymentClient.java',
    code: `import org.springframework.http.MediaType;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestClient;

@Component
public class PaymentClient {

  private final RestClient restClient;

  public PaymentClient(RestClient.Builder builder) {
    this.restClient = builder
        .baseUrl("https://pay.example.com")
        .build();
    System.out.println("[실행] PaymentClient 생성 - baseUrl: https://pay.example.com");
  }

  public PaymentResponse charge(PaymentRequest req) {
    System.out.println("[실행] POST /charge - 결제 요청: " + req);
    return restClient.post()
        .uri("/charge")
        .contentType(MediaType.APPLICATION_JSON)
        .body(req)
        .retrieve()
        .body(PaymentResponse.class);
  }
}`,
    explain: {
      concept:
        'RestClient는 Spring Boot 3.2부터 추가된 동기 HTTP 클라이언트로, RestTemplate의 현대적인 대체재예요. ' +
        'Builder로 기본 URL과 헤더를 미리 설정해두고, post().uri().body().retrieve().body()를 메서드 체인으로 이어서 외부 API 호출을 간결하게 작성할 수 있어요. ' +
        '비동기가 필요하면 WebClient를 쓰지만, 동기 호출로 충분한 대부분의 서버 간 통신에서는 RestClient가 가장 적합해요. ' +
        '실무에서는 결제 게이트웨이, 문자 발송, 지도 API, 소셜 로그인 등 외부 서비스 연동에 써요.',
      terms: [
        { t: 'RestClient.Builder', d: 'baseUrl, 기본 헤더 등을 미리 설정하고 RestClient 객체를 만드는 빌더예요' },
        { t: '.post()', d: 'HTTP POST 요청을 시작해요 - get(), put(), delete()도 사용 가능해요' },
        { t: '.retrieve()', d: '응답을 가져올 준비 단계예요 - 상태 코드가 4xx/5xx이면 예외를 던져요' },
        { t: '.body(PaymentResponse.class)', d: '응답 본문을 PaymentResponse 타입으로 변환해 반환해요' },
      ],
      why:
        '외부 HTTP 호출을 별도 라이브러리(Feign, Retrofit) 없이 스프링 기본 기능으로 깔끔하게 작성하려고 써요. ' +
        'Spring Boot 3.2 이상이면 의존성 추가 없이 바로 사용할 수 있어요.',
      expectedOutput:
        'charge(req) 호출 시:\n' +
        '[실행] PaymentClient 생성 - baseUrl: https://pay.example.com\n' +
        '[실행] POST /charge - 결제 요청: PaymentRequest[...]\n' +
        '(이후 외부 API 응답을 PaymentResponse로 변환)',
      realWorldUsage:
        '실제로 토스페이먼츠, 카카오페이 같은 PG사 API를 호출하거나, 슬랙 웹훅으로 알림을 보낼 때 RestClient를 써요.',
      pitfall: '4xx/5xx 응답은 기본적으로 HttpClientErrorException/HttpServerErrorException을 던져요. try-catch로 처리하거나 .onStatus()로 특정 상태 코드에 대한 핸들러를 등록하세요.',
    },
  },
  {
    id: 'mvc-path-variable-vs-param',
    lang: 'java',
    title: 'PathVariable + RequestParam 혼합',
    file: 'CommentController.java',
    code: `import java.util.List;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/posts/{postId}/comments")
public class CommentController {

  @GetMapping
  public List<Comment> list(
      @PathVariable Long postId,
      @RequestParam(required = false) String filter) {
    System.out.println("[실행] GET /posts/" + postId + "/comments?filter=" + filter);
    return commentService.list(postId, filter);
  }
}`,
    explain: {
      concept:
        '경로 변수(@PathVariable)와 쿼리 파라미터(@RequestParam)는 한 메서드에서 같이 쓸 수 있어요. ' +
        '경로 변수는 "어떤 리소스"를 대상으로 할지(여기서는 postId) 식별자로 쓰고, 쿼리 파라미터는 "어떻게 필터링할지"(여기서는 filter) 옵션 정보로 써요. ' +
        '둘의 역할 분담이 명확해요 - 리소스 식별은 경로에, 검색/필터/정렬 조건은 쿼리에 담는 게 RESTful 설계의 기본이에요. ' +
        'required = false로 설정하면 filter가 없는 요청도 정상 처리돼서, 필수 정보만 경로에 담고 나머지는 선택적으로 받을 수 있어요.',
      terms: [
        { t: '@PathVariable Long postId', d: 'URL 경로에서 게시글 ID를 추출해요 - "어떤 게시글의 댓글인지" 식별자 역할이에요' },
        { t: '@RequestParam(required = false) String filter', d: '쿼리 파라미터 filter를 선택적으로 받아요 - 없으면 null이 들어와요' },
        { t: 'required = false', d: '이 파라미터가 없어도 400 에러가 발생하지 않아요 - 선택적 옵션에 써요' },
        { t: 'commentService.list(postId, filter)', d: '추출한 ID와 필터를 서비스에 전달해요' },
      ],
      why:
        '리소스 식별은 URL 경로로, 필터/검색 조건은 쿼리 파라미터로 구분해서 의미를 명확히 하려고 써요. ' +
        'URL만 봐도 "/posts/42/comments?filter=spam"이 "42번 게시글의 스팸 댓글"이라는 걸 직관적으로 알 수 있어요.',
      expectedOutput:
        'GET /posts/42/comments?filter=spam 호출 시:\n' +
        '[실행] GET /posts/42/comments?filter=spam\n' +
        'GET /posts/42/comments 호출 시 (filter 생략):\n' +
        '[실행] GET /posts/42/comments?filter=null',
      realWorldUsage:
        '실제로 /products/{categoryId}?minPrice=1000&maxPrice=5000&sort=price_asc처럼 카테고리는 경로로, 가격범위·정렬은 쿼리로 구분해서 써요.',
      pitfall: 'required = false로 설정하지 않은 @RequestParam은 기본값이 필수예요. 선택적 파라미터라면 required = false를 명시해서 400 에러를 방지하세요.',
    },
  },
];
