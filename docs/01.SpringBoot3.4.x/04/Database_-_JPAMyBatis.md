# Database - JPA/MyBatis

## Official Documentation
- [SQL Data Access (JDBC, JPA, MyBatis)](https://docs.spring.io/spring-boot/docs/current/reference/htmlsingle/#data.sql)

## 핵심 개념
> Spring Boot는 Spring Data JPA와 MyBatis를 통해 데이터베이스 접근을 추상화합니다. JPA는 `@Entity` 클래스와 `Repository` 인터페이스만으로 CRUD를 자동 생성하며, MyBatis는 XML 또는 어노테이션 기반의 SQL 매핑을 제공합니다.

## 학습 목표
- `@Entity`, `@Id`, `@GeneratedValue`로 JPA 엔터티 정의
- `JpaRepository` 인터페이스를 상속하여 CRUD 메서드 자동 생성
- MyBatis `@Mapper`/`@Select`로 직접 SQL 매핑

## 예제 코드
```java
// JPA 방식
// User.java
import jakarta.persistence.*;

@Entity
@Table(name = "users")
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    @Column(unique = true)
    private String email;

    protected User() {}

    public User(String name, String email) {
        this.name = name;
        this.email = email;
    }

    public Long getId() { return id; }
    public String getName() { return name; }
    public String getEmail() { return email; }
}
```

```java
// UserRepository.java
import org.springframework.data.jpa.repository.JpaRepository;

public interface UserRepository extends JpaRepository<User, Long> {
    User findByEmail(String email);
}
```

```java
// MyBatis 방식
// UserMapper.java
import org.apache.ibatis.annotations.*;

@Mapper
public interface UserMapper {

    @Select("SELECT * FROM users WHERE id = #{id}")
    User findById(@Param("id") Long id);

    @Insert("INSERT INTO users(name, email) VALUES(#{name}, #{email})")
    @Options(useGeneratedKeys = true, keyProperty = "id")
    void insert(User user);
}
```

```yaml
# application.yml
spring:
  datasource:
    url: jdbc:h2:mem:testdb
    driver-class-name: org.h2.Driver
  jpa:
    hibernate:
      ddl-auto: update
```

## 주요 패턴
- Repository 패턴: `JpaRepository`를 상속한 인터페이스로 데이터 접근 계층 구현
- DTO 분리: 엔터티는 DB 매핑 전용으로 유지하고, 요청/응답용 DTO를 별도 정의

## 주의사항
- JPA 엔터티에는 기본 생성자(protected 이상)가 반드시 필요
- `@Transactional` 없이 Lazy Loading 시 LazyInitializationException 발생 가능
- MyBatis 매퍼 XML 경로와 `mybatis.mapper-locations` 설정 불일치 주의
