import type { Snippet } from '../../types';

export const dataAdvanced: Snippet[] = [
  {
    id: 'data-querydsl-boolean',
    lang: 'java',
    title: 'QueryDSL BooleanBuilder',
    file: 'UserRepositoryImpl.java',
    code: `public List<UserEntity> search(String name) {
  QUserEntity user = QUserEntity.userEntity;
  BooleanBuilder builder = new BooleanBuilder();
  if (name != null) builder.and(user.name.contains(name));
  return queryFactory.selectFrom(user).where(builder).fetch();
}`,
    explain: {
      concept: 'BooleanBuilder는 조건을 레고 블록처럼 조립하는 도구예요. 이름이 있을 때만 조건을 추가해요.',
      terms: [
        { t: 'QUserEntity', d: 'QueryDSL이 자동으로 만든 엔티티 메타모델' },
        { t: 'BooleanBuilder', d: '조건들을 AND/OR로 이어주는 빌더' },
        { t: 'contains(name)', d: 'name이 포함된 조건 (LIKE)' },
        { t: 'fetch()', d: '결과 리스트를 가져오는 메서드' },
      ],
      why: '검색 조건이 상황마다 다를 때 안전하게 쿼리를 조립하려고요.',
      pitfall: 'Q클래스가 없으면 컴파일 에러가 나요. gradle compileJava 로 먼저 생성하세요.',
    },
  },
  {
    id: 'data-querydsl-qclass',
    lang: 'java',
    title: 'QueryDSL Q클래스 기본 조회',
    file: 'OrderRepositoryImpl.java',
    code: `public List<OrderEntity> findAllByStatus(String status) {
  QOrderEntity order = QOrderEntity.orderEntity;
  return queryFactory
    .selectFrom(order)
    .where(order.status.eq(status))
    .orderBy(order.createdAt.desc())
    .fetch();
}`,
    explain: {
      concept: 'Q클래스는 엔티티의 필드를 타입 안전하게 가리키는 거울이에요. SQL을 자바 코드로 표현할 수 있어요.',
      terms: [
        { t: 'selectFrom(order)', d: 'order 테이블의 모든 컬럼을 선택' },
        { t: 'eq(status)', d: 'status 와 같은 값 (=)' },
        { t: 'desc()', d: '내림차순 정렬' },
        { t: 'createdAt', d: '생성 시간 필드를 가리키는 Q필드' },
      ],
      why: '문자열 SQL 없이 타입 안전하게 쿼리를 작성하려고요.',
      pitfall: '문자열 오타를 컴파일 타임에 잡아줘요. Q클래스를 먼저 생성해야 해요.',
    },
  },
  {
    id: 'data-fetch-join',
    lang: 'java',
    title: 'Fetch Join으로 N+1 해결',
    file: 'PostRepositoryImpl.java',
    code: `public List<PostEntity> findWithComments() {
  QPostEntity post = QPostEntity.postEntity;
  QCommentEntity comment = QCommentEntity.commentEntity;
  return queryFactory
    .selectFrom(post)
    .join(post.comments, comment).fetchJoin()
    .distinct()
    .fetch();
}`,
    explain: {
      concept: 'fetchJoin은 연관된 데이터를 한 번의 쿼리로 함께 가져와요. 게시글마다 댓글을 따로 물어보는 N+1 문제를 한 방에 없애줘요.',
      terms: [
        { t: 'join(post.comments, comment)', d: '게시글의 댓글 조인' },
        { t: 'fetchJoin()', d: '연관 데이터를 즉시 함께 로딩' },
        { t: 'distinct()', d: '중복된 부모 행 제거' },
        { t: 'N+1', d: '부모 1번 + 자식 N번 = 쿼리 폭발' },
      ],
      why: '여러 부모-자식 관계를 한 쿼리로 로딩해 통신 횟수를 줄이려고요.',
      pitfall: '페이징과 같이 쓰면 메모리에서 잘라내기 때문에 경고가 나요. OneToOne·ManyToMany는 카테시안 곱에 주의하세요.',
    },
  },
  {
    id: 'data-n-plus-one',
    lang: 'java',
    title: 'N+1 발생 코드 (LAZY)',
    file: 'MemberService.java',
    code: `public void printTeams(Long memberId) {
  MemberEntity m = em.find(MemberEntity.class, memberId);
  for (TeamEntity t : m.getTeams()) {
    System.out.println(t.getName());
  }
}`,
    explain: {
      concept: '지연 로딩(LAZY)은 팀을 처음엔 가짜(프록시)로 두고, 실제로 접근할 때 마다 쿼리를 날려요. 반복문 안에서 접근하면 팀 수만큼 쿼리가 폭발해요.',
      terms: [
        { t: 'em.find()', d: '엔티티 매니저로 1차 조회' },
        { t: 'getTeams()', d: '연관된 팀 컬렉션 접근 → 쿼리 발생' },
        { t: 'LAZY', d: '처음엔 안가져오고 쓸 때 가져오는 방식' },
        { t: '프록시', d: '실제 엔티티 대신 참조를 대리하는 가짜 객체' },
      ],
      why: '처음 로딩을 빠르게 하려고 지연 로딩을 쓰지만, 루프에서 접근하면 쿼리가 폭발해요.',
      pitfall: '해결은 fetch join 이나 @EntityGraph 를 사용하세요.',
    },
  },
  {
    id: 'data-pageable',
    lang: 'java',
    title: 'Pageable 페이징',
    file: 'ProductService.java',
    code: `public Page<ProductEntity> list(int page, int size) {
  Pageable pageable = PageRequest.of(page, size, Sort.by("price").ascending());
  return productRepository.findAll(pageable);
}`,
    explain: {
      concept: 'Pageable은 책의 페이지를 넘기듯 결과를 잘라서 가져오는 도구예요. 한 번에 다 불러오면 메모리가 터지니까요.',
      terms: [
        { t: 'PageRequest.of(page, size)', d: '페이지 번호와 크기로 페이징 요청' },
        { t: 'Sort.by("price")', d: 'price 컬럼 기준 정렬' },
        { t: 'ascending()', d: '오름차순' },
        { t: 'Page<T>', d: '콘텐츠와 전체 페이지 정보를 담은 결과' },
      ],
      why: '대량 데이터를 브라우저에 한 번에 보내지 않고 조금씩 나누어 주려고요.',
      pitfall: 'page 는 0부터 시작해요. 1부터로 착각하면 한 페이지가 밀려요.',
    },
  },
  {
    id: 'data-pageable-sort',
    lang: 'java',
    title: 'Pageable 다중 정렬',
    file: 'OrderService.java',
    code: `public Page<OrderEntity> recent(int page) {
  Sort sort = Sort.by(
    Sort.Order.desc("priority"),
    Sort.Order.asc("createdAt")
  );
  return orderRepository.findAll(PageRequest.of(page, 20, sort));
}`,
    explain: {
      concept: 'Sort는 여러 컬럼을 순서대로 나누어 정렬해요. 중요도는 내림차순으로 먼저, 같으면 만들어진 시간 오름차순으로 나열해요.',
      terms: [
        { t: 'Sort.by(...)', d: '여러 Order 로 다중 정렬' },
        { t: 'Sort.Order.desc', d: '내림차순 한 컬럼' },
        { t: 'Sort.Order.asc', d: '오름차순 한 컬럼' },
        { t: 'findAll(Pageable)', d: '스프링 데이터가 자동으로 paged 쿼리 실행' },
      ],
      why: '1차 컬럼이 같을 때 2차 컬럼으로 순서를 확정지려고요.',
      pitfall: '정렬 컬럼이 인덱스에 없으면 전체 정렬로 느려져요.',
    },
  },
  {
    id: 'data-slice-cursor',
    lang: 'java',
    title: 'Slice (커서 페이징)',
    file: 'FeedService.java',
    code: `@Service
@RequiredArgsConstructor
public class FeedService {
  private final FeedRepository feedRepository;

  public Slice<FeedEntity> olderThan(Long lastId, int size) {
    Pageable pageable = PageRequest.of(0, size + 1);
    List<FeedEntity> rows =
        feedRepository.findByIdLessThanOrderByIdDesc(lastId, pageable);
    boolean hasNext = rows.size() > size;
    if (hasNext) rows.remove(size);
    return new SliceImpl<>(rows, pageable, hasNext);
  }
}`,
    explain: {
      concept: 'Slice는 "다음이 있나요?"만 알려주는 가벼운 페이징이에요. 마지막 본 ID 보다 작은 것만 가져와 무한 스크롤에 잘 맞아요.',
      terms: [
        { t: 'findByIdLessThan', d: 'ID 가 lastId 보다 작은 것 — 커서' },
        { t: 'size + 1', d: '하나 더 가져와 다음 여부 판단' },
        { t: 'SliceImpl', d: '콘텐츠와 hasNext 만 담는 결과' },
        { t: 'remove(size)', d: '초과분 1개 잘라내기' },
      ],
      why: '전체 카운트 쿼리를 없애고 최신 것부터 무한 스크롤을 빠르게 하려고요.',
      pitfall: 'Page 와 달리 전체 페이지 수를 몰라요. UI 에서 "더보기"만 표시하세요.',
    },
  },
  {
    id: 'data-querydsl-projection',
    lang: 'java',
    title: 'QueryDSL DTO 프로젝션',
    file: 'UserRepositoryImpl.java',
    code: `public List<UserSummary> summaries() {
  QUserEntity user = QUserEntity.userEntity;
  return queryFactory
    .select(Projections.constructor(UserSummary.class, user.id, user.name))
    .from(user)
    .fetch();
}`,
    explain: {
      concept: 'Projections는 컬럼 몇 개만 뽑아서 곧바로 DTO 로 담아줘요. 전체 엔티티를 불러오지 않아 메모리가 가벼워요.',
      terms: [
        { t: 'Projections.constructor', d: '생성자로 DTO 를 만드는 프로젝션' },
        { t: 'UserSummary.class', d: '담을 대상 DTO 클래스' },
        { t: 'user.id, user.name', d: '선택할 컬럼들' },
        { t: 'select(...).from(user)', d: 'selectFrom 와 달리 컬럼만 선택' },
      ],
      why: '필요한 컬럼만 골라 네트워크와 메모리를 아껴요.',
      pitfall: 'DTO 생성자 순서와 컬럼 순서가 같아야 해요. 어긋나면 값이 뒤바뀌어요.',
    },
  },
  {
    id: 'data-querydsl-subquery',
    lang: 'java',
    title: 'QueryDSL 서브쿼리',
    file: 'OrderRepositoryImpl.java',
    code: `public List<OrderEntity> expensiveOrders() {
  QOrderEntity order = QOrderEntity.orderEntity;
  QOrderEntity orderSub = new QOrderEntity("orderSub");
  return queryFactory
    .selectFrom(order)
    .where(order.amount.gt(
        JPAExpressions
          .select(orderSub.amount.avg())
          .from(orderSub)
    ))
    .fetch();
}`,
    explain: {
      concept: '서브쿼리는 쿼리 안에 든 작은 쿼리예요. "평균보다 큰 금액"을 찾을 때 평균을 먼저 구하고 그것과 비교해요.',
      terms: [
        { t: 'JPAExpressions', d: '서브쿼리를 만드는 진입점' },
        { t: 'orderSub', d: '외부 쿼리와 별칭 충돌을 피하는 서브쿼리 전용 Q객체' },
        { t: 'gt(...)', d: '보다 크다 (>)' },
        { t: 'avg()', d: '평균 금액 계산' },
      ],
      why: '비교 기준을 그 자리에서 계산해 한 쿼리로 끝내려고요.',
      pitfall: '외부 쿼리와 서브쿼리에서 같은 Q객체를 재사용하면 일부 JPA 구현체에서 별칭 충돌이 생길 수 있어요. 서브쿼리용 별칭은 항상 따로 만드세요.',
    },
  },
  {
    id: 'data-querydsl-aggregate',
    lang: 'java',
    title: 'QueryDSL 그룹 집계',
    file: 'SalesRepositoryImpl.java',
    code: `public List<Tuple> salesByCategory() {
  QSalesEntity s = QSalesEntity.salesEntity;
  return queryFactory
    .select(s.category, s.amount.sum(), s.count())
    .from(s)
    .groupBy(s.category)
    .fetch();
}`,
    explain: {
      concept: 'groupBy 는 같은 그룹끼리 모아 요리해요. 카테고리별로 매출 합계와 건수를 한 줄로 보여줘요.',
      terms: [
        { t: 's.amount.sum()', d: '그룹 안 매출 합계' },
        { t: 's.count()', d: '그룹 안 행 수' },
        { t: 'groupBy(category)', d: '같은 카테고리끼리 모으기' },
        { t: 'Tuple', d: '여러 컬럼을 담는 가벼운 행' },
      ],
      why: '카테고리별 통계를 한 쿼리로 얻으려고요.',
      pitfall: 'select 컬럼 중 groupBy 에 없는 것은 집계함수로 감싸야 해요.',
    },
  },
  {
    id: 'data-querydsl-order',
    lang: 'java',
    title: 'QueryDSL 동적 정렬 (OrderSpecifier)',
    file: 'UserRepositoryImpl.java',
    code: `public List<UserEntity> sorted(boolean asc) {
  QUserEntity user = QUserEntity.userEntity;
  OrderSpecifier<String> spec = asc
    ? user.name.asc()
    : user.name.desc();
  return queryFactory.selectFrom(user).orderBy(spec).fetch();
}`,
    explain: {
      concept: 'OrderSpecifier 는 정렬 토글을 레고 스위치처럼 켜요. 오름/내림을 코드로 골라 한 쿼리로 처리해요.',
      terms: [
        { t: 'OrderSpecifier<String>', d: '정렬 조건을 담는 타입 안전 객체' },
        { t: 'asc()', d: '오름차순 Q필드 메서드' },
        { t: 'desc()', d: '내림차순 Q필드 메서드' },
        { t: 'orderBy(spec)', d: '정렬 조건 적용' },
      ],
      why: '사용자가 정렬 방향을 고를 때마다 쿼리를 새로 만들지 않으려고요.',
      pitfall: '정렬 컬럼을 동적으로 바꾸고 싶다면 Map으로 Q필드를 매핑해 선택하세요. 문자열 컬럼명을 그대로 넣으면 타입 안전성이 사라져요.',
    },
  },
  {
    id: 'data-hikari-config',
    lang: 'java',
    title: 'HikariCP 설정 (application.properties)',
    file: 'application.properties',
    // 아래 코드는 application.properties 파일 형식입니다 (lang은 팩 기본값 java 유지)
    code: `spring.datasource.hikari.maximum-pool-size=20
spring.datasource.hikari.minimum-idle=10
spring.datasource.hikari.connection-timeout=30000
spring.datasource.hikari.idle-timeout=600000
spring.datasource.hikari.max-lifetime=1800000`,
    explain: {
      concept: 'HikariCP 는 커넥션 수영장이에요. 미리 만들어둔 연결을 빌려쓰고 돌려주어 손님을 빠르게 모셔요.',
      terms: [
        { t: 'maximum-pool-size', d: '최대로 만들 연결 수' },
        { t: 'minimum-idle', d: '대기로 둘 최소 연결 수' },
        { t: 'connection-timeout', d: '연결 빌리기 대기 시간(ms)' },
        { t: 'idle-timeout', d: '쉬는 연결을 닫기까지의 시간' },
        { t: 'max-lifetime', d: '연결 한 개의 최대 수명' },
      ],
      why: '매번 연결을 새로 만드는 비용을 없애 응답을 빠르게 하려고요.',
      pitfall: 'maximum-pool-size 를 DB 가 견디는 수로 두지 않으면 DB 가 다운될 수 있어요.',
    },
  },
  {
    id: 'data-hikari-bean',
    lang: 'java',
    title: 'HikariCP 커스텀 Bean',
    file: 'DataSourceConfig.java',
    code: `@Bean
public DataSource dataSource() {
  HikariConfig cfg = new HikariConfig();
  cfg.setJdbcUrl("jdbc:postgresql://localhost:5432/shop");
  cfg.setUsername("postgres");
  cfg.setPassword("postgres");
  cfg.setMaximumPoolSize(20);
  cfg.setPoolName("shop-pool");
  return new HikariDataSource(cfg);
}`,
    explain: {
      concept: 'HikariConfig 는 수영장의 설계도예요. 주소·비번·수영장 크기를 정하고 HikariDataSource 로 실제 수영장을 만들어요.',
      terms: [
        { t: '@Bean', d: '스프링이 관리하는 객체로 등록' },
        { t: 'setJdbcUrl', d: '데이터베이스 주소' },
        { t: 'setMaximumPoolSize', d: '최대 연결 수' },
        { t: 'setPoolName', d: '수영장 이름 — 로그에서 구분' },
        { t: 'HikariDataSource', d: '설정으로 만든 실제 커넥션 풀' },
      ],
      why: 'application.properties 로 표현하기 어려운 고급 설정을 코드로 정밀 제어하려고요.',
      pitfall: '비번을 코드에 직접 적지 말고 환경변수로 주입하세요.',
    },
  },
  {
    id: 'data-flyway-sql',
    lang: 'java',
    title: 'Flyway SQL 마이그레이션',
    file: 'V1__create_user.sql',
    // 아래 코드는 SQL 파일 형식입니다 (lang은 팩 기본값 java 유지)
    code: `CREATE TABLE users (
  id BIGSERIAL PRIMARY KEY,
  email VARCHAR(255) NOT NULL UNIQUE,
  created_at TIMESTAMP NOT NULL DEFAULT now()
);

CREATE INDEX idx_users_email ON users(email);`,
    explain: {
      concept: 'Flyway 는 버전 붙인 SQL 파일로 데이터베이스 구조를 업그레이드해요. 파일 이름이 곧 버전 번호가 되어 순서대로 실행돼요.',
      terms: [
        { t: 'V1__', d: '버전 1 — V는 버전 표시' },
        { t: 'BIGSERIAL', d: 'PostgreSQL 자동 증가 큰 정수' },
        { t: 'PRIMARY KEY', d: '행을 고유하게 식별하는 기본 키' },
        { t: 'UNIQUE', d: '같은 값이 두 번 들어가지 못함' },
        { t: 'CREATE INDEX', d: '빠른 찾기를 위한 인덱스 생성' },
      ],
      why: '배포마다 스키마를 사람이 직접 고치지 않고 코드로 버전 관리하려고요.',
      pitfall: '한 번 실행된 V 파일은 수정하면 안돼요. 변경은 새 V 파일로 추가하세요.',
    },
  },
  {
    id: 'data-flyway-java',
    lang: 'java',
    title: 'Flyway Java 마이그레이션',
    file: 'V2__seed_admin.java',
    code: `public class V2__seed_admin extends BaseJavaMigration {
  @Override
  public void migrate(Context context) throws SQLException {
    try (PreparedStatement ps = context.getConnection()
        .prepareStatement("INSERT INTO users(email) VALUES(?)")) {
      ps.setString(1, "admin@shop.com");
      ps.executeUpdate();
    }
  }
}`,
    explain: {
      concept: 'Java 마이그레이션은 SQL 로 하기 어려운 복잡한 초기 데이터를 코드로 채워요. 버전 규칙은 SQL 과 같아요.',
      terms: [
        { t: 'BaseJavaMigration', d: 'Java 마이그레이션 부모 클래스' },
        { t: 'Context', d: '현재 마이그레이션의 실행 환경' },
        { t: 'getConnection', d: 'DB 연결 가져오기' },
        { t: 'prepareStatement', d: '인자를 ? 로 받는 안전한 쿼리' },
        { t: 'setString', d: '? 자리에 문자열 주입' },
      ],
      why: '반복문이나 조건으로 초기 데이터를 계산해 넣으려고요.',
      pitfall: 'DB 연결을 직접 닫지 말고 try-with-resources 로 PreparedStatement 만 닫아요.',
    },
  },
  {
    id: 'data-liquibase-changelog',
    lang: 'java',
    title: 'Liquibase changelog YAML',
    file: 'db.changelog.yaml',
    // 아래 코드는 YAML 파일 형식입니다 (lang은 팩 기본값 java 유지)
    code: `databaseChangeLog:
  - changeSet:
      id: create-users
      author: alice
      changes:
        - createTable:
            tableName: users
            columns:
              - column:
                  name: id
                  type: bigint
                  constraints:
                    primaryKey: true
              - column:
                  name: email
                  type: varchar(255)`,
    explain: {
      concept: 'Liquibase 는 changeset 이라는 작은 단위로 DB 변경을 쌓아요. YAML 로 테이블 만들기를 선언해요.',
      terms: [
        { t: 'databaseChangeLog', d: '변경 로그의 루트' },
        { t: 'changeSet', d: '한 단위의 변경 — id 와 author 필수' },
        { t: 'createTable', d: '테이블 만들기 액션' },
        { t: 'column', d: '컬럼 정의' },
        { t: 'constraints', d: '기본 키·유니크 등 제약' },
      ],
      why: 'DB 벤더가 바뀌어도 같은 변경 사항이 실행되도록 추상화하려고요.',
      pitfall: 'id 와 author 가 없으면 changeset 이 무시되거나 중복 실행돼요.',
    },
  },
  {
    id: 'data-liquibase-sql',
    lang: 'java',
    title: 'Liquibase raw SQL changeset',
    file: 'db.changelog.yaml',
    // 아래 코드는 YAML 파일 형식입니다 (lang은 팩 기본값 java 유지)
    code: `databaseChangeLog:
  - changeSet:
      id: add-index
      author: bob
      changes:
        - sql:
            splitStatements: true
            stripComments: true
            sql: |
              CREATE INDEX idx_users_email
              ON users(email);`,
    explain: {
      concept: 'Liquibase 도 직접 SQL 을 쓸 수 있어요. YAML 안에 SQL 을 그대로 적어 한 번에 여러 문을 실행해요.',
      terms: [
        { t: 'sql', d: '직접 SQL 실행 액션' },
        { t: 'splitStatements', d: '여러 문을 ; 로 나누어 실행' },
        { t: 'stripComments', d: '주석 제거' },
        { t: 'CREATE INDEX', d: '인덱스 만들기 SQL' },
      ],
      why: 'Liquibase 액션으로 표현하기 어려운 벤더 전용 SQL 을 그대로 쓰려고요.',
      pitfall: 'splitStatements 를 끄면 여러 문이 한 개로 붙어 에러가 나요.',
    },
  },
  {
    id: 'data-index-create',
    lang: 'java',
    title: '복합 인덱스 생성',
    file: 'V3__add_order_index.sql',
    // 아래 코드는 SQL 파일 형식입니다 (lang은 팩 기본값 java 유지)
    code: `CREATE INDEX idx_order_status_created
  ON orders(status, created_at);

CREATE UNIQUE INDEX idx_orders_number
  ON orders(order_number);`,
    explain: {
      concept: '복합 인덱스는 두 컬럼을 한 꾸러미로 묶은 색인이에요. 책의 색인이 "성+이름"으로 만들어지면 그 순서로 찾기 빨라요.',
      terms: [
        { t: 'idx_order_status_created', d: '인덱스 이름' },
        { t: '(status, created_at)', d: '복합 컬럼 — 정해진 순서' },
        { t: 'UNIQUE INDEX', d: '같은 값이 하나만 — 고유 강제' },
        { t: 'order_number', d: '주문 번호 — 고유' },
      ],
      why: 'WHERE status=? ORDER BY created_at 같은 쿼리가 인덱스만으로 끝나게 하려고요.',
      pitfall: '컬럼 순서가 쿼리 순서와 다르면 인덱스를 못 타요. 자주 쓰는 선행 컬럼을 앞으로 하세요.',
    },
  },
  {
    id: 'data-explain',
    lang: 'java',
    title: 'EXPLAIN 으로 실행 계획',
    file: 'SlowQuery.java',
    code: `public void explain() {
  String sql = "EXPLAIN SELECT * FROM orders WHERE status = 'PAID'";
  em.createNativeQuery(sql).getResultList().forEach(row -> {
    System.out.println(row);
  });
}`,
    explain: {
      concept: 'EXPLAIN 은 쿼리를 실제로는 안 실행하고 "어떻게 돌아갈지" 설계도만 보여줘요. 이 정보로 쿼리가 인덱스를 타는지 한눈에 알 수 있어요.',
      terms: [
        { t: 'EXPLAIN', d: '실행 계획만 보는 명령' },
        { t: 'createNativeQuery', d: '원시 SQL 실행 JPA 쿼리' },
        { t: 'getResultList', d: '결과 행 리스트 가져오기' },
        { t: 'forEach', d: '각 행마다 출력' },
      ],
      why: '느린 쿼리가 인덱스를 쓰는지, 풀 스캔인지 확인하려고요.',
      pitfall: 'EXPLAIN 은 행수를 추정치로 보여줘요. 실제 측정은 EXPLAIN ANALYZE 를 쓰세요.',
    },
  },
  {
    id: 'data-entity-graph',
    lang: 'java',
    title: '@EntityGraph 로 N+1 해결',
    file: 'PostRepository.java',
    code: `public interface PostRepository extends JpaRepository<PostEntity, Long> {

  @EntityGraph(attributePaths = "comments")
  List<PostEntity> findAllByAuthor(String author);
}`,
    explain: {
      concept: '@EntityGraph 는 fetch join 을 어노테이션으로 쓰는 단축이에요. 메서드를 부를 때 댓글을 한 번에 가져와 N+1 을 막아요.',
      terms: [
        { t: 'JpaRepository', d: '스프링 데이터 기본 레포지토리' },
        { t: '@EntityGraph', d: '연관 로딩 그래프를 선언' },
        { t: 'attributePaths', d: '함께 로딩할 연관 필드' },
        { t: 'findAllByAuthor', d: 'author 로 찾는 파생 쿼리' },
      ],
      why: 'JPQL 의 join fetch 을 직접 쓰지 않고 메서드만으로 N+1 을 막으려고요.',
      pitfall: 'attributePaths 이름은 필드명과 정확히 같아야 해요. 오타면 런타임 에러가 나요.',
    },
  },
];
