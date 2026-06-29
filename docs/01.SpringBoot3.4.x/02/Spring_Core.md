# Spring Core

## Official Documentation
- [Getting Started / Using Spring Boot](https://docs.spring.io/spring-boot/docs/current/reference/htmlsingle/#using.spring-boot)

## 핵심 개념
> Spring Boot는 `@SpringBootApplication` 어노테이션 하나로 자동 설정(auto-configuration)과 컴포넌트 스캔을 활성화합니다. `application.yml`을 통해 외부 설정을 주입하며, 내장 Tomcat으로 독립 실행 가능한 JAR를 생성합니다.

## 학습 목표
- `@SpringBootApplication`, `@RestController` 어노테이션 이해
- `application.yml`을 이용한 외부 설정 주입
- Spring Initializr 또는 CLI로 프로젝트 생성

## 예제 코드
```java
// MyApplication.java
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@SpringBootApplication
@RestController
public class MyApplication {

    private final AppProperties appProperties;

    public MyApplication(AppProperties appProperties) {
        this.appProperties = appProperties;
    }

    public static void main(String[] args) {
        SpringApplication.run(MyApplication.class, args);
    }

    @GetMapping("/hello")
    public String hello() {
        return appProperties.getGreeting() + ", World!";
    }
}
```

```java
// AppProperties.java
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.stereotype.Component;

@Component
@ConfigurationProperties(prefix = "app")
public class AppProperties {
    private String greeting = "Hello";

    public String getGreeting() { return greeting; }
    public void setGreeting(String greeting) { this.greeting = greeting; }
}
```

```yaml
# application.yml
app:
  greeting: 안녕하세요
```

## 주요 패턴
- 의존성 주입(DI): 생성자 주입을 사용하여 의존성을 주입
- 외부 설정: `@ConfigurationProperties`로 타입-세이프하게 프로퍼티 바인딩

## 주의사항
- `@SpringBootApplication`이 있는 클래스는 최상위 패키지에 위치해야 컴포넌트 스캔이 정상 동작
- `@RestController`만 붙이고 `@SpringBootApplication` 없이 실행하면 컨텍스트가 초기화되지 않음
