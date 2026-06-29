# Data
## Official Documentation
- [Data Access (SQL, NoSQL)](https://docs.spring.io/spring-boot/docs/current/reference/htmlsingle/#data)
## 핵심 개념
> Spring Boot Data 모듈은 관계형 DB(JDBC, JPA)와 NoSQL(MongoDB, Redis, Cassandra, Neo4j) 등 다양한 데이터 저장소에 대해 일관된 접근 추상화를 제공한다. 자동 설정을 통해 커넥션 풀(HikariCP), 트랜잭션 관리, Repository 인터페이스 생성을 지원하므로 데이터 액세스 계층을 빠르게 구축할 수 있다.
## 학습 목표
- Spring Data JPA로 `JpaRepository` 인터페이스 기반 CRUD 구현하기
- `@Entity`, `@Table`, `@Column`으로 엔터티 매핑하기
- MongoDB, Redis, Cassandra 스타터로 NoSQL 데이터소스 구성하기
- `DataSource`와 HikariCP 커넥션 풀 설정 이해하기
- 쿼리 메서드, `@Query`, QueryDSL로 복잡한 조회 구현하기
## 예제 코드
```java
// JPA 엔터티
@Entity
@Table(name = "products")
public class Product {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 100)
    private String name;

    @Column(nullable = false)
    private BigDecimal price;
    // getters, setters
}

// JPA Repository
public interface ProductRepository extends JpaRepository<Product, Long> {
    List<Product> findByPriceBetween(BigDecimal min, BigDecimal max);

    @Query("SELECT p FROM Product p WHERE p.name LIKE %:keyword%")
    List<Product> searchByName(@Param("keyword") String keyword);
}
```

```yaml
# application.yml - JPA + H2 설정
spring:
  datasource:
    url: jdbc:h2:mem:testdb
    driver-class-name: org.h2.Driver
    hikari:
      maximum-pool-size: 10
  jpa:
    hibernate:
      ddl-auto: update
    show-sql: true
    properties:
      hibernate:
        format_sql: true
```

```java
// MongoDB Repository
@Document(collection = "products")
public class ProductDocument {
    @Id
    private String id;
    private String name;
    private BigDecimal price;
}

public interface ProductMongoRepository extends MongoRepository<ProductDocument, String> {
    List<ProductDocument> findByPriceGreaterThan(BigDecimal price);
}
```
## 주요 패턴
- Repository 추상화: 동일한 인터페이스 패턴으로 JPA/MongoDB/Cassandra 모두 지원
- 자동 설정(DataSourceAutoConfiguration): 클래스패스 기반 데이터소스 자동 구성
- DTO Projection: 엔터티 일부 필드만 조회하는 인터페이스/클래스 프로젝션
- Flyway/Liquibase: 데이터베이스 마이그레이션 자동 실행
## 주의사항
- `spring.jpa.hibernate.ddl-auto=update`는 프로덕션에서 사용하지 말 것 (데이터 손실 위험)
- `@Transactional`은 public 메서드에만 적용되며 AOP 프록시 내부 호출은 무시된다
- MongoDB는 ID 필드에 `@Id`를 반드시 지정해야 하며, String 타입이면 ObjectId 자동 생성
- Redis를 세션 저장소로 사용할 때 `@EnableRedisHttpSession` 설정 누락에 주의
