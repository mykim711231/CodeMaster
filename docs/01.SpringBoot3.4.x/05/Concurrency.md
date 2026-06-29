# Concurrency

## Official Documentation
- [Async Execution / Task Execution](https://docs.spring.io/spring-boot/docs/current/reference/htmlsingle/#io.executors)

## 핵심 개념
> Spring Boot는 `@EnableAsync`와 `@Async`로 메서드를 별도 스레드에서 비동기 실행할 수 있습니다. `TaskExecutor`를 통해 스레드 풀을 제어하고, `CompletableFuture`로 비동기 작업 결과를 조합 및 처리합니다.

## 학습 목표
- `@EnableAsync`와 `@Async`를 이용한 비동기 메서드 작성
- `TaskExecutor`를 커스터마이징하여 스레드 풀 설정
- `CompletableFuture`로 비동기 결과 처리 및 체이닝

## 예제 코드
```java
// ConcurrencyApplication.java
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.scheduling.annotation.EnableAsync;
import org.springframework.scheduling.concurrent.ThreadPoolTaskExecutor;

import java.util.concurrent.Executor;

@SpringBootApplication
@EnableAsync
public class ConcurrencyApplication {

    public static void main(String[] args) {
        SpringApplication.run(ConcurrencyApplication.class, args);
    }

    @Bean(name = "taskExecutor")
    public Executor taskExecutor() {
        ThreadPoolTaskExecutor executor = new ThreadPoolTaskExecutor();
        executor.setCorePoolSize(2);
        executor.setMaxPoolSize(5);
        executor.setQueueCapacity(100);
        executor.setThreadNamePrefix("async-");
        executor.initialize();
        return executor;
    }
}
```

```java
// AsyncService.java
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

import java.util.concurrent.CompletableFuture;

@Service
public class AsyncService {

    @Async("taskExecutor")
    public CompletableFuture<String> fetchData(String source) {
        // 실제 데이터 조회 시뮬레이션
        try {
            Thread.sleep(2000);
        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
        }
        return CompletableFuture.completedFuture("Data from " + source);
    }
}
```

```java
// UserController.java
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.concurrent.CompletableFuture;

@RestController
public class UserController {

    private final AsyncService asyncService;

    public UserController(AsyncService asyncService) {
        this.asyncService = asyncService;
    }

    @GetMapping("/fetch")
    public CompletableFuture<String> fetch() {
        return asyncService.fetchData("DB-01")
                .thenApply(result -> "Result: " + result);
    }
}
```

## 주요 패턴
- `thenApply()`로 비동기 결과를 변환하고 체이닝
- `CompletableFuture.allOf()`로 여러 비동기 작업을 병렬로 실행하고 결과 취합

## 주의사항
- `@Async` 메서드는 반드시 public이어야 하며, 같은 클래스 내에서 직접 호출하면 AOP 프록시가 동작하지 않음
- 반환 타입이 `void`인 `@Async` 메서드는 예외가 호출자에게 전달되지 않으므로 로깅 필수
- `ThreadLocal` 값은 비동기 스레드로 전파되지 않음 (별도 설정 필요)
