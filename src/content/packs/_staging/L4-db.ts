import type { Snippet } from '../../types';

export const springDb: Snippet[] = [
  {
    id: 'db-jpql-query',
    lang: 'java',
    title: 'JPQL 기본 조회',
    file: 'UserRepository.java',
    code: `@Repository
public interface UserRepository extends JpaRepository<User, Long> {

  @Query("SELECT u FROM User u WHERE u.email = :email")
  User findByEmail(@Param("email") String email);
}`,
    explain: {
      concept: 'JPQL은 테이블이 아니라 엔티티 객체를 대상으로 쓰는 쿼리예요. SQL과 비슷하지만 테이블명 대신 자바 클래스 이름을 써요. 객체를 다루는 SQL 느낌이에요.',
      terms: [
        { t: '@Query', d: '메서드에 직접 JPQL/SQL 작성' },
        { t: 'SELECT u FROM User u', d: 'User 엔티티 전체 조회 (User는 자바 클래스명)' },
        { t: ':email', d: '이름 붙인 바인딩 파라미터 자리' },
        { t: '@Param', d: '파라미터 이름과 :email을 연결' },
      ],
      why: '복잡한 조건을 메서드 이름으로 표현하기 어려울 때 써요.',
      pitfall: '테이블명이 아니라 엔티티명을 써야 해요.',
    },
  },
  {
    id: 'db-native-query',
    lang: 'java',
    title: 'Native Query',
    file: 'OrderRepository.java',
    code: `@Repository
public interface OrderRepository extends JpaRepository<Order, Long> {

  @Query(value = "SELECT * FROM orders WHERE status = ?1", nativeQuery = true)
  List<Order> findByStatus(String status);
}`,
    explain: {
      concept: 'Native Query는 진짜 SQL을 그대로 쓰는 거예요. JPQL이 못 하는 데이터베이스 전용 기능을 쓸 수 있어요.',
      terms: [
        { t: 'nativeQuery = true', d: '일반 SQL로 실행하겠다는 표시' },
        { t: 'value', d: 'SQL 쿼리 문자열' },
        { t: '?1', d: '첫 번째 파라미터를 가리키는 자리표시자' },
      ],
      why: 'DB 전용 함수나 복잡한 SQL을 그대로 쓰려고요.',
      pitfall: 'DB가 바뀌면 쿼리가 안 통할 수 있어요.',
    },
  },
  {
    id: 'db-modifying',
    lang: 'java',
    title: '@Modifying 벌크 수정',
    file: 'ProductRepository.java',
    code: `@Repository
public interface ProductRepository extends JpaRepository<Product, Long> {

  @Modifying(clearAutomatically = true)
  @Transactional
  @Query("UPDATE Product p SET p.price = p.price * 1.1")
  int raiseAllPrices();
}`,
    explain: {
      concept: '@Modifying은 SELECT가 아니라 UPDATE/DELETE를 실행할 때 붙여요. 한 번에 여러 행을 바꾸는 대량 작업이에요. 한 번의 쿼리로 모든 상품 가격을 올리는 식이에요.',
      terms: [
        { t: '@Modifying', d: '변경 쿼리 표시' },
        { t: 'UPDATE Product', d: '엔티티 대상 수정' },
        { t: 'int 반환', d: '변경된 행 수를 반환' },
        { t: '@Transactional', d: '@Modifying 메서드는 반드시 트랜잭션 안에서 실행해야 해요. 없으면 TransactionRequiredException 발생' },
      ],
      why: '한 번에 많은 데이터를 수정하려고요.',
      pitfall: '@Transactional이 없으면 TransactionRequiredException이 발생해요. 또한 JPA 1차 캐시(영속성 컨텍스트)가 자동 갱신되지 않으므로 @Modifying(clearAutomatically = true)를 함께 써서 캐시와 DB를 일치시켜야 해요.',
    },
  },
  {
    id: 'db-many-to-one',
    lang: 'java',
    title: '@ManyToOne 다대일',
    file: 'Comment.java',
    code: `@Entity
public class Comment {

  @Id
  @GeneratedValue
  private Long id;

  @ManyToOne(fetch = FetchType.LAZY)
  @JoinColumn(name = "post_id")
  private Post post;
}`,
    explain: {
      concept: '@ManyToOne은 "여러 댓글이 하나의 게시글에 속한다"는 관계예요. 여러 명이 한 선생님을 모시는 것과 같아요.',
      terms: [
        { t: '@ManyToOne', d: '다대일 관계 매핑' },
        { t: 'FetchType.LAZY', d: '실제 쓸 때 데이터를 가져오는 방식' },
        { t: '@JoinColumn', d: '외래키 컬럼 이름 지정' },
      ],
      why: '부모-자식 관계를 자바 객체로 표현하려고요.',
      pitfall: '@ManyToOne 기본이 EAGER라 N+1 문제가 발생하기 쉬워요. N+1은 100명의 회원을 조회할 때 1번 + 100번의 쿼리가 나가는 현상이에요. LAZY를 권장해요.',
    },
  },
  {
    id: 'db-one-to-many',
    lang: 'java',
    title: '@OneToMany 일대다',
    file: 'Post.java',
    code: `@Entity
public class Post {

  @Id
  @GeneratedValue
  private Long id;

  @OneToMany(mappedBy = "post", cascade = CascadeType.ALL)
  private List<Comment> comments = new ArrayList<>();
}`,
    explain: {
      concept: '@OneToMany는 "한 게시글이 여러 댓글을 가진다"는 관계예요. 한 부모가 여러 자식을 거느리는 것과 같아요.',
      terms: [
        { t: '@OneToMany', d: '일대다 관계 매핑' },
        { t: 'mappedBy', d: '반대편 엔티티가 외래키를 소유함을 표시' },
        { t: 'cascade', d: '부모 작업(저장/삭제 등)이 자식에 전파됨' },
      ],
      why: '부모에서 자식 컬렉션을 다루려고요.',
      pitfall: 'mappedBy를 빼면 양쪽이 외래키를 가져 중복 업데이트가 생겨요.',
    },
  },
  {
    id: 'db-fetch-lazy',
    lang: 'java',
    title: '@OneToMany LAZY와 LazyInitializationException',
    file: 'PostService.java',
    code: `@Service
@Transactional(readOnly = true)
public class PostService {

  // 트랜잭션 안에서 호출 -> LAZY 로딩 정상 동작
  public int countComments(Long postId) {
    Post post = postRepo.findById(postId).orElseThrow();
    return post.getComments().size(); // 여기서 SELECT 실행
  }
}

// 주의: 트랜잭션 밖에서 LAZY 컬렉션 접근 시
// org.hibernate.LazyInitializationException 발생
// -> @Transactional 메서드 안에서 접근하거나
//    fetch join 쿼리로 미리 로딩해야 해요`,
    explain: {
      concept: '@OneToMany는 기본이 LAZY(지연 로딩)이에요. 게시글을 가져올 때 댓글 목록은 바로 읽지 않고, 실제로 댓글을 사용하는 순간에 DB를 조회해요. 트랜잭션이 끝난 뒤 접근하면 예외가 발생해요.',
      terms: [
        { t: 'FetchType.LAZY', d: '@OneToMany 기본값. 컬렉션을 실제로 사용할 때 SELECT 실행' },
        { t: 'LazyInitializationException', d: '트랜잭션 밖에서 LAZY 컬렉션에 접근하면 발생하는 예외' },
        { t: '@Transactional(readOnly = true)', d: '읽기 전용 트랜잭션. LAZY 로딩이 가능하고 성능상 유리' },
        { t: 'fetch join', d: 'LAZY 컬렉션을 JOIN으로 한 번에 가져오는 JPQL 기법. N+1 방지에 효과적' },
      ],
      why: 'LAZY 로딩의 범위와 예외를 알면 N+1 문제와 LazyInitializationException을 예방할 수 있어요.',
      pitfall: '트랜잭션 밖에서 LAZY 필드를 건드리면 반드시 LazyInitializationException이 나요. 서비스 메서드에 @Transactional을 붙이거나 fetch join으로 미리 조회해야 해요.',
    },
  },
  {
    id: 'db-fetch-eager',
    lang: 'java',
    title: 'FetchType.EAGER 즉시 로딩',
    file: 'Item.java',
    code: `@Entity
public class Item {

  @Id
  @GeneratedValue
  private Long id;

  @ManyToOne(fetch = FetchType.EAGER)
  private Category category;
}`,
    explain: {
      concept: 'EAGER는 부모를 가져올 때 연관 데이터도 즉시 함께 가져와요. 음식을 시키면 반찬도 같이 나오는 것과 같아요. 편하지만 안 쓸 수도 있는 데이터까지 조회돼요.',
      terms: [
        { t: 'FetchType.EAGER', d: '조회 시 연관 데이터를 즉시 로딩' },
        { t: '@ManyToOne', d: '다대일 관계' },
      ],
      why: '항상 같이 쓰는 데이터는 한 번에 가져오려고요.',
      pitfall: '불필요한 조인이 발생하고 N+1이 생기기 쉬워요.',
    },
  },
  {
    id: 'db-cascade',
    lang: 'java',
    title: 'CascadeType 전파',
    file: 'Invoice.java',
    code: `@Entity
public class Invoice {

  @Id
  @GeneratedValue
  private Long id;

  @OneToMany(mappedBy = "invoice", cascade = CascadeType.REMOVE)
  private List<LineItem> items = new ArrayList<>();
}`,
    explain: {
      concept: 'CascadeType은 부모의 작업이 자식에게도 전달되는 거예요. 부모 청구서를 지우면 항목도 함께 지워져요.',
      terms: [
        { t: 'CascadeType.REMOVE', d: '부모 삭제 시 자식도 함께 삭제' },
        { t: 'mappedBy', d: '자식 쪽이 외래키를 소유함을 표시' },
        { t: 'LineItem', d: '청구서 항목 엔티티' },
      ],
      why: '부모-자식 생명주기를 함께 관리하려고요.',
      pitfall: '다른 곳에서 자식을 참조하면 무결성 문제가 생겨요.',
    },
  },
  {
    id: 'db-transactional',
    lang: 'java',
    title: '@Transactional 기본',
    file: 'TransferService.java',
    code: `@Service
public class TransferService {

  @Transactional
  public void transfer(Long from, Long to, long amount) {
    accountRepo.withdraw(from, amount);
    accountRepo.deposit(to, amount);
  }
}`,
    explain: {
      concept: '@Transactional은 여러 작업을 하나의 거래로 묶는 거예요. 은행 이체처럼 출금과 입금이 한 묶음이어서 중간에 실패하면 처음으로 되돌려요.',
      terms: [
        { t: '@Transactional', d: '메서드를 하나의 트랜잭션으로 묶음' },
        { t: 'withdraw', d: '출금 메서드' },
        { t: 'deposit', d: '입금 메서드' },
      ],
      why: '데이터 일관성을 보장하려고요.',
      pitfall: 'RuntimeException이 아니면 롤백되지 않아요.',
    },
  },
  {
    id: 'db-tx-propagation',
    lang: 'java',
    title: '전파 속성 REQUIRES_NEW',
    file: 'AuditService.java',
    code: `@Service
public class AuditService {

  @Transactional(propagation = Propagation.REQUIRES_NEW)
  public void writeLog(String msg) {
    auditRepo.save(new Audit(msg));
  }
}`,
    explain: {
      concept: 'propagation은 이미 진행 중인 트랜잭션이 있을 때 어떻게 할지 정해요. REQUIRES_NEW는 기존을 잠시 멈추고 새 거래를 시작해요.',
      terms: [
        { t: 'propagation', d: '이미 트랜잭션이 있을 때 어떻게 처리할지 결정' },
        { t: 'REQUIRES_NEW', d: '기존 트랜잭션을 잠시 멈추고 새 트랜잭션 시작' },
        { t: '@Transactional', d: '트랜잭션 선언' },
      ],
      why: '메인 작업과 무관하게 로그를 남기려고요.',
      pitfall: '트랜잭션이 중첩돼 커넥션을 두 개 써요.',
    },
  },
  {
    id: 'db-tx-isolation',
    lang: 'java',
    title: '격리 수준 isolation',
    file: 'InventoryService.java',
    code: `@Service
public class InventoryService {

  @Transactional(isolation = Isolation.READ_COMMITTED)
  public int stock(Long productId) {
    return productRepo.findStock(productId);
  }
}`,
    explain: {
      concept: 'isolation은 여러 트랜잭션이 동시에 같은 데이터를 건드릴 때 어디까지 허용할지 정해요. 방음벽의 두께를 조절하는 것과 같아요.',
      terms: [
        { t: 'isolation', d: '여러 트랜잭션이 동시에 접근할 때 격리 수준' },
        { t: 'READ_COMMITTED', d: '커밋된 데이터만 읽는 수준' },
        { t: '@Transactional', d: '트랜잭션 선언' },
      ],
      why: '동시성과 일관성의 균형을 맞추려고요.',
      pitfall: '격리 수준이 낮으면 더러운 읽기, 높으면 성능이 떨어져요.',
    },
  },
  {
    id: 'db-tx-rollback',
    lang: 'java',
    title: 'rollbackFor 지정',
    file: 'OrderService.java',
    code: `@Service
public class OrderService {

  @Transactional(rollbackFor = IOException.class)
  public void place(OrderRequest req) throws IOException {
    orderRepo.save(req.toOrder());
  }
}`,
    explain: {
      concept: 'rollbackFor는 "이 예외가 나면 거래를 되돌려 줘"라고 정하는 거예요. 체크 예외는 기본적으로 롤백되지 않아서 명시해요.',
      terms: [
        { t: 'rollbackFor', d: '이 예외가 나면 트랜잭션을 롤백하라고 지정' },
        { t: 'IOException', d: '입출력 체크 예외 (기본 롤백 대상 아님)' },
        { t: '@Transactional', d: '트랜잭션 선언' },
      ],
      why: '체크 예외에서도 롤백을 보장하려고요.',
      pitfall: 'rollbackFor를 안 쓰면 IOException은 롤백되지 않아요.',
    },
  },
  {
    id: 'db-specification',
    lang: 'java',
    title: 'Specification 동적 쿼리',
    file: 'UserSpecs.java',
    code: `public class UserSpecs {

  public static Specification<User> nameContains(String keyword) {
    if (keyword == null) {
      return (root, query, cb) -> cb.conjunction();
    }
    return (root, query, cb) -> cb.like(root.get("name"), "%" + keyword + "%");
  }

  public static Specification<User> ageOver(int age) {
    return (root, query, cb) -> cb.greaterThan(root.get("age"), age);
  }
}`,
    explain: {
      concept: 'Specification은 조건을 조립식 블록으로 만드는 도구예요. 조건들을 AND/OR로 이어 동적 쿼리를 만들어요.',
      terms: [
        { t: 'Specification', d: '조건을 객체로 표현하는 도구' },
        { t: 'root', d: '엔티티의 필드에 접근하는 루트' },
        { t: 'cb', d: 'CriteriaBuilder - 조건식을 만드는 생성기' },
        { t: 'like', d: 'LIKE 조건을 생성' },
        { t: 'cb.conjunction()', d: 'null 조건 대신 반환하는 항상 참(true) 조건' },
      ],
      why: '상황에 따라 조건이 바뀌는 검색을 안전하게 만들려고요.',
      pitfall: 'JpaSpecificationExecutor를 상속해야 쓸 수 있어요.',
    },
  },
  {
    id: 'db-spec-where',
    lang: 'java',
    title: 'Specification 조합',
    file: 'UserRepository.java',
    code: `import static com.example.UserSpecs.nameContains;
import static com.example.UserSpecs.ageOver;
import static org.springframework.data.jpa.domain.Specification.where;

@Repository
public interface UserRepository
    extends JpaRepository<User, Long>, JpaSpecificationExecutor<User> {

  default List<User> search(String name, int age) {
    return findAll(where(nameContains(name)).and(ageOver(age)));
  }
}`,
    explain: {
      concept: 'where().and()로 여러 Specification을 이어 붙일 수 있어요. 레고 블록을 연결하듯 조건을 합쳐요.',
      terms: [
        { t: 'JpaSpecificationExecutor', d: 'Specification을 실행할 수 있는 인터페이스' },
        { t: 'where', d: 'Specification 조합의 시작점. static import 필요' },
        { t: 'and', d: '두 조건을 AND로 결합' },
      ],
      why: '재사용 가능한 조건을 조합해 복잡한 검색을 만들려고요.',
      pitfall: 'nameContains 같은 조건 메서드 안에서 keyword가 null이면 cb.like에 null이 전달돼 오류가 나요. 메서드 내부에서 null 여부를 확인하거나 null이면 cb.conjunction()을 반환하도록 처리해야 해요.',
    },
  },
  {
    id: 'db-query-by-example',
    lang: 'java',
    title: 'QueryByExample 탐색기',
    file: 'ProductService.java',
    code: `@Service
public class ProductService {

  public List<Product> findActive() {
    Product probe = new Product();
    probe.setActive(true);
    return productRepo.findAll(Example.of(probe));
  }
}`,
    explain: {
      concept: 'QueryByExample은 샘플 객체를 주면 그와 같은 데이터를 찾아주는 도구예요. 스케치 한 장을 보여주면 비슷한 사진을 찾아주는 거예요.',
      terms: [
        { t: 'Example.of', d: '샘플 객체로 검색 예제 생성' },
        { t: 'probe', d: '조건으로 사용할 샘플 객체' },
        { t: 'findAll', d: '조건에 맞는 모든 데이터 조회' },
      ],
      why: '간단한 동등 검색을 빠르게 만들려고요.',
      pitfall: '복잡한 조건이나 범위 검색에는 적합하지 않아요.',
    },
  },
  {
    id: 'db-mapper',
    lang: 'java',
    title: '@Mapper MyBatis 인터페이스',
    file: 'UserMapper.java',
    code: `@Mapper
public interface UserMapper {

  @Select("SELECT id, name FROM users WHERE id = #{id}")
  User findById(Long id);
}`,
    explain: {
      concept: '@Mapper는 MyBatis가 인터페이스만 보고 구현체를 만들어 주는 표시예요. 인터페이스만 쓰면 SQL 실행 코드가 자동 생성돼요.',
      terms: [
        { t: '@Mapper', d: 'MyBatis가 구현체를 자동 생성할 매퍼 인터페이스 표시' },
        { t: '@Select', d: 'SELECT SQL을 메서드에 직접 작성' },
        { t: '#{id}', d: '파라미터 값을 안전하게 바인딩하는 자리' },
      ],
      why: '간단한 SQL을 별도 XML 파일 없이 인터페이스에서 바로 실행하려고요.',
      pitfall: '@MapperScan이나 매퍼 스캔이 설정되어 있어야 해요.',
    },
  },
  {
    id: 'db-resultmap',
    lang: 'java',
    title: 'MyBatis ResultMap 컬럼 매핑',
    file: 'UserMapper.java',
    code: `@Mapper
public interface UserMapper {

  // @Results로 DB 컬럼 이름과 자바 필드 이름을 연결해요
  @Results(id = "userMap", value = {
    @Result(property = "id",   column = "user_id", id = true),
    @Result(property = "name", column = "user_name")
  })
  @Select("SELECT user_id, user_name FROM users")
  List<User> findAll();

  // 같은 매핑 재사용
  @ResultMap("userMap")
  @Select("SELECT user_id, user_name FROM users WHERE user_id = #{id}")
  User findById(Long id);
}`,
    explain: {
      concept: '@Results는 DB 컬럼 이름과 자바 필드 이름을 연결해 주는 표예요. 컬럼명이 user_id이고 자바 필드가 id일 때처럼 이름이 다를 때 써요.',
      terms: [
        { t: '@Results', d: '컬럼-필드 매핑을 정의하는 어노테이션 (XML의 resultMap과 동일)' },
        { t: '@Result', d: '컬럼 하나와 자바 필드 하나를 연결하는 매핑 항목' },
        { t: 'property', d: '자바 필드명' },
        { t: 'column', d: 'DB 컬럼명' },
        { t: '@ResultMap', d: '이미 정의한 @Results를 id로 재사용' },
      ],
      why: '컬럼명과 필드명이 달라도 매핑하게 하려고요.',
      pitfall: '매핑을 빠뜨리면 필드가 null로 채워져요.',
    },
  },
  {
    id: 'db-dynamic-if',
    lang: 'java',
    title: 'MyBatis 동적 SQL - 조건 조합',
    file: 'UserMapper.java',
    code: `@Mapper
public interface UserMapper {

  // @SelectProvider로 동적 SQL을 자바 코드로 생성해요
  @SelectProvider(type = UserSqlProvider.class, method = "buildSearch")
  List<User> search(@Param("name") String name, @Param("age") Integer age);
}

class UserSqlProvider {

  public String buildSearch(@Param("name") String name,
                            @Param("age") Integer age) {
    return new SQL() {{
      SELECT("*");
      FROM("users");
      if (name != null) AND().WHERE("name = #{name}");
      if (age  != null) AND().WHERE("age = #{age}");
    }}.toString();
  }
}`,
    explain: {
      concept: '@SelectProvider는 조건이 있을 때만 WHERE 절을 추가하는 동적 SQL을 자바 코드로 만드는 도구예요. 상황에 따라 SQL 모양이 달라져요.',
      terms: [
        { t: '@SelectProvider', d: '별도 클래스의 메서드가 SQL 문자열을 반환하도록 위임' },
        { t: 'SQL 빌더 클래스', d: 'MyBatis가 제공하는 SQL 문자열 조립 도구 (org.apache.ibatis.jdbc.SQL)' },
        { t: 'AND().WHERE()', d: '조건이 있을 때만 WHERE/AND 절을 안전하게 붙이는 메서드' },
      ],
      why: '검색 조건이 가변적일 때 SQL을 유연하게 만들려고요.',
      pitfall: 'SQL 빌더 클래스를 쓰면 직접 문자열을 이어 붙이는 것보다 안전하지만, 복잡한 서브쿼리는 표현하기 어려워요.',
    },
  },
  {
    id: 'db-dynamic-foreach',
    lang: 'java',
    title: 'MyBatis IN 절 동적 SQL',
    file: 'UserMapper.java',
    code: `@Mapper
public interface UserMapper {

  @SelectProvider(type = UserSqlProvider.class, method = "buildFindByIds")
  List<User> findByIds(@Param("ids") List<Long> ids);
}

class UserSqlProvider {

  public String buildFindByIds(@Param("ids") List<Long> ids) {
    StringBuilder sb = new StringBuilder("SELECT * FROM users WHERE id IN (");
    for (int i = 0; i < ids.size(); i++) {
      if (i > 0) sb.append(", ");
      sb.append("#{ids[").append(i).append("]}");
    }
    sb.append(")");
    return sb.toString();
  }
}`,
    explain: {
      concept: 'IN 절에 여러 id를 동적으로 넣을 때 @SelectProvider와 SQL 빌더를 써요. 리스트 크기에 맞게 자동으로 파라미터 자리를 만들어줘요.',
      terms: [
        { t: '@SelectProvider', d: '자바 메서드가 SQL 문자열을 동적으로 생성하도록 위임' },
        { t: '#{ids[i]}', d: 'List 파라미터의 i번째 원소를 안전하게 바인딩' },
        { t: '@Param("ids")', d: '메서드 파라미터에 이름을 붙여 SQL 빌더에서 참조 가능하게 함' },
      ],
      why: '여러 id를 한 번에 조회하려고요.',
      pitfall: 'ids 리스트가 비어 있으면 WHERE id IN () 이 생성돼 SQL 문법 오류가 나요. 호출 전에 빈 리스트를 확인해야 해요.',
    },
  },
  {
    id: 'db-pageable',
    lang: 'java',
    title: 'Pageable 페이징',
    file: 'ProductRepository.java',
    code: `@Repository
public interface ProductRepository extends JpaRepository<Product, Long> {

  Page<Product> findByCategory(String category, Pageable pageable);
}`,
    explain: {
      concept: 'Pageable은 "몇 번째 페이지, 몇 개씩"을 담는 객체예요. 책의 페이지를 넘기듯 데이터를 나눠 가져와요.',
      terms: [
        { t: 'Pageable', d: '몇 번째 페이지, 몇 개씩 가져올지 담은 요청 객체' },
        { t: 'Page', d: '페이지 결과 + 전체 페이지 수 등 정보' },
        { t: 'findByCategory', d: '카테고리별로 조회하는 메서드' },
      ],
      why: '대량 데이터를 한 번에 가져오지 않으려고요.',
      pitfall: 'page 번호는 0부터 시작해요.',
    },
  },
];
