# Spring MVC

## Official Documentation
- [Spring MVC](https://docs.spring.io/spring-boot/docs/current/reference/htmlsingle/#web.servlet.spring-mvc)

## 핵심 개념
> Spring MVC는 DispatcherServlet을 중심으로 클라이언트 요청을 처리하는 웹 프레임워크입니다. `@Controller`/`@RestController`로 엔드포인트를 정의하고, `@RequestMapping` 계열 어노테이션으로 URL 매핑을 구성하며, Thymeleaf와 같은 뷰 템플릿과 연동할 수 있습니다.

## 학습 목표
- `@RequestMapping`, `@GetMapping`, `@PostMapping`으로 REST API 작성
- `@PathVariable`, `@RequestParam`, `@RequestBody`로 요청 파라미터 처리
- Thymeleaf 템플릿을 이용한 서버 사이드 렌더링

## 예제 코드
```java
// UserController.java
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;

@Controller
@RequestMapping("/users")
public class UserController {

    private final List<User> users = new ArrayList<>();

    @GetMapping
    public String listUsers(Model model) {
        model.addAttribute("users", users);
        return "users"; // templates/users.html
    }

    @PostMapping
    public String createUser(@RequestParam String name, @RequestParam String email) {
        users.add(new User(name, email));
        return "redirect:/users";
    }

    // REST API 엔드포인트
    @ResponseBody
    @GetMapping("/api")
    public List<User> getUsersJson() {
        return users;
    }
}

record User(String name, String email) {}
```

```html
<!-- src/main/resources/templates/users.html -->
<!DOCTYPE html>
<html xmlns:th="http://www.thymeleaf.org">
<head><title>Users</title></head>
<body>
  <h1>User List</h1>
  <ul>
    <li th:each="user : ${users}" th:text="${user.name} + ' (' + ${user.email} + ')'"></li>
  </ul>
  <form method="post" action="/users">
    <input type="text" name="name" placeholder="Name" />
    <input type="email" name="email" placeholder="Email" />
    <button type="submit">Add</button>
  </form>
</body>
</html>
```

## 주요 패턴
- RESTful 설계: HTTP 메서드(GET, POST, PUT, DELETE)에 맞는 어노테이션 사용
- `@Controller` + `@ResponseBody` 또는 `@RestController` 조합으로 API와 뷰 분리

## 주의사항
- `@RequestParam`의 required 기본값이 true이므로 필수 파라미터 누락 시 400 에러 발생
- Thymeleaf 템플릿 경로와 리턴 문자열이 일치하지 않으면 404 에러 발생
