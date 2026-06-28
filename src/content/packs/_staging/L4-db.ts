import type { Snippet } from '../../types';

export const springDb: Snippet[] = [
  {
    id: 'db-jpql-query',
    lang: 'java',
    title: 'JPQL 기본 조회',
    file: 'UserRepository.java',
    code: `import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {

  @Query("SELECT u FROM User u WHERE u.email = :email")
  User findByEmail(@Param("email") String email);

  default User findWithLog(String email) {
    System.out.println("[실행] JPQL 조회 — email: " + email);
    User user = findByEmail(email);
    System.out.println("[결과] 조회된 사용자: " + user);
    return user;
  }
}`,
    explain: {
      concept:
        'JPQL(Java Persistence Query Language)은 SQL과 비슷하지만 테이블이 아니라 엔티티(자바 객체)를 대상으로 작성하는 쿼리 언어예요. ' +
        'FROM User는 "users 테이블"이 아니라 "User 엔티티 클래스"를 가리키고, u.email은 "email 컬럼"이 아니라 "User 클래스의 email 필드"를 가리켜요. ' +
        ':email은 이름 붙인 파라미터 자리로, @Param("email")로 메서드 파라미터와 연결돼요 — 위치 기반(?)보다 훨씬 읽기 쉽고 순서를 신경 안 써도 돼요. ' +
        '실무에서는 복잡한 조건을 메서드 이름(findByEmailAndStatus)만으로 표현하기 어려울 때 @Query로 JPQL을 직접 작성해요.',
      terms: [
        { t: '@Query("SELECT u FROM User u WHERE ...")', d: '메서드에 실행할 JPQL 쿼리를 직접 작성해요 — SQL과 비슷하지만 엔티티를 대상으로 해요' },
        { t: 'SELECT u FROM User u', d: 'User 엔티티 전체를 조회해요 — User는 테이블명이 아니라 자바 클래스명이에요' },
        { t: ':email', d: '이름 붙인 바인딩 파라미터예요 — : 다음에 파라미터 이름을 적어요' },
        { t: '@Param("email")', d: '메서드 파라미터와 :email을 연결해줘요 — 이름이 정확히 일치해야 해요' },
      ],
      why:
        '메서드 이름(findByEmailAndStatusOrderByCreatedAtDesc)이 너무 길어지거나, 서브쿼리·조인 같은 복잡한 쿼리가 필요할 때 @Query로 JPQL을 직접 써요. ' +
        '실무에서 메서드 이름이 5개 이상의 조건을 연결하면 가독성이 떨어져서 JPQL로 전환해요.',
      expectedOutput:
        'findWithLog("kim@test.com") 호출 시:\n' +
        '[실행] JPQL 조회 — email: kim@test.com\n' +
        '[결과] 조회된 사용자: User{id=1, email=\'kim@test.com\', name=\'kim\'}',
      realWorldUsage:
        '실제로 "최근 7일간 주문량이 10건 이상인 상품 조회"처럼 복잡한 조건은 findTopProducts() 같은 메서드명으로 표현하기 어려워서 @Query로 JPQL을 써요.',
      pitfall: 'JPQL에서는 테이블명이 아니라 엔티티 클래스명을 써야 해요. @Entity(name = "users")로 이름을 지정하지 않았다면 클래스명(User)을 그대로 쓰세요.',
    },
  },
  {
    id: 'db-native-query',
    lang: 'java',
    title: 'Native Query',
    file: 'OrderRepository.java',
    code: `import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

@Repository
public interface OrderRepository extends JpaRepository<Order, Long> {

  @Query(value = "SELECT * FROM orders WHERE status = ?1", nativeQuery = true)
  List<Order> findByStatus(String status);

  default List<Order> findByStatusWithLog(String status) {
    System.out.println("[실행] Native Query — status: " + status);
    List<Order> result = findByStatus(status);
    System.out.println("[결과] 조회된 주문 수: " + result.size());
    return result;
  }
}`,
    explain: {
      concept:
        'Native Query는 JPQL이 아니라 데이터베이스에 직접 실행할 진짜 SQL을 작성하는 방식이에요. ' +
        'nativeQuery = true를 설정하면 JPA가 쿼리를 번역하지 않고 그대로 DB에 전달해요 — DB 전용 함수(Oracle의 NVL, MySQL의 DATE_FORMAT)나 벤더 특화 기능을 써야 할 때 필요해요. ' +
        '?1은 위치 기반 파라미터로, 첫 번째 메서드 파라미터가 ?1 자리에 들어가요 — JPQL과 달리 :이름 방식도 쓸 수 있어요. ' +
        '주의할 점은 Native Query는 DB 종류에 종속돼서, 나중에 MySQL에서 PostgreSQL로 바꾸면 쿼리가 동작하지 않을 수 있어요.',
      terms: [
        { t: 'nativeQuery = true', d: '이 쿼리는 JPQL이 아니라 실제 SQL이라고 JPA에게 알려줘요 — 번역 없이 DB로 바로 전달돼요' },
        { t: 'value = "SELECT * FROM orders ..."', d: '실제 SQL 문자열이에요 — DB에 직접 전달되는 쿼리예요' },
        { t: '?1', d: '위치 기반 파라미터예요 — 첫 번째 메서드 파라미터(status)가 이 자리에 들어가요' },
      ],
      why:
        'DB 전용 함수나 힌트, 계층형 쿼리(CONNECT BY) 등 JPQL이 지원하지 않는 데이터베이스 고유 기능을 써야 할 때 사용해요. ' +
        '가능하면 JPQL을 먼저 고려하고, 진짜 필요한 순간에만 Native Query를 쓰는 게 좋아요.',
      expectedOutput:
        'findByStatusWithLog("SHIPPED") 호출 시:\n' +
        '[실행] Native Query — status: SHIPPED\n' +
        '[결과] 조회된 주문 수: 5',
      realWorldUsage:
        '실제로 통계 쿼리에서 Oracle의 분석 함수(RANK() OVER)나 MySQL의 GROUP_CONCAT 같은 DB 전용 함수가 필요할 때 Native Query를 써요.',
      pitfall: 'Native Query는 DB가 바뀌면 쿼리도 바꿔야 해서 유지보수 비용이 커져요. 꼭 필요한 순간에만 제한적으로 사용하세요.',
    },
  },
  {
    id: 'db-modifying',
    lang: 'java',
    title: '@Modifying 벌크 수정',
    file: 'ProductRepository.java',
    code: `import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

@Repository
public interface ProductRepository extends JpaRepository<Product, Long> {

  @Modifying(clearAutomatically = true)
  @Transactional
  @Query("UPDATE Product p SET p.price = p.price * 1.1")
  int raiseAllPrices();

  default int raiseAllPricesWithLog() {
    System.out.println("[실행] 벌크 UPDATE — 모든 상품 가격 10% 인상");
    int updated = raiseAllPrices();
    System.out.println("[결과] 변경된 행 수: " + updated);
    return updated;
  }
}`,
    explain: {
      concept:
        '@Modifying은 SELECT가 아니라 UPDATE나 DELETE처럼 데이터를 변경하는 쿼리임을 JPA에게 알려주는 어노테이션이에요. ' +
        '한 번의 쿼리로 여러 행을 동시에 변경하는 벌크 연산(대량 작업)을 수행할 수 있어서, 모든 상품 가격을 10% 올리는 같은 작업을 for문 없이 처리할 수 있어요. ' +
        'clearAutomatically = true는 중요한 설정인데, JPA가 메모리에 보관한 엔티티(1차 캐시)를 DB 변경 후 자동으로 비워줘요 — 이게 없으면 DB 값은 바뀌었는데 메모리 값은 그대로인 불일치가 생겨요. ' +
        '@Transactional도 필수예요 — 트랜잭션 없이 @Modifying 쿼리를 실행하면 TransactionRequiredException이 발생해요.',
      terms: [
        { t: '@Modifying', d: '이 쿼리가 데이터 변경(UPDATE/DELETE)임을 표시해요 — 없으면 SELECT로 간주하고 쿼리를 실행해요' },
        { t: 'clearAutomatically = true', d: '쿼리 실행 후 JPA 1차 캐시를 자동 비워서 DB-메모리 불일치를 방지해요' },
        { t: '@Transactional', d: '@Modifying 메서드는 트랜잭션 없이 실행할 수 없어요 — 반드시 함께 붙여야 해요' },
        { t: 'int 반환', d: '변경된 행(row) 수를 반환해요 — 몇 건이 수정됐는지 확인할 수 있어요' },
      ],
      why:
        '루프로 한 건씩 update 하면 10만 건에 10만 번 쿼리가 나가지만, 벌크 연산은 단 한 번의 쿼리로 처리돼서 성능이 압도적으로 좋아요. ' +
        '실무에서는 "모든 미확인 알림을 읽음 처리" 같은 대량 상태 변경에 써요.',
      expectedOutput:
        'raiseAllPricesWithLog() 호출 시:\n' +
        '[실행] 벌크 UPDATE — 모든 상품 가격 10% 인상\n' +
        '[결과] 변경된 행 수: 150',
      realWorldUsage:
        '실제로 "30일 이상 미접속 회원 휴면 처리", "만료된 쿠폰 일괄 비활성화" 같은 배치 작업에서 벌크 연산을 써요.',
      pitfall: '@Transactional을 빼면 TransactionRequiredException이 발생하고, clearAutomatically를 빼면 1차 캐시와 DB가 불일치해서 엉뚱한 데이터가 조회될 수 있어요.',
    },
  },
  {
    id: 'db-many-to-one',
    lang: 'java',
    title: '@ManyToOne 다대일',
    file: 'Comment.java',
    code: `import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;

@Entity
public class Comment {

  @Id
  @GeneratedValue
  private Long id;

  @ManyToOne(fetch = FetchType.LAZY)
  @JoinColumn(name = "post_id")
  private Post post;

  public Post getPost() {
    System.out.println("[실행] 지연 로딩 — 게시글 정보 조회");
    return post;
  }
}`,
    explain: {
      concept:
        '@ManyToOne은 "여러 댓글이 하나의 게시글에 속한다"는 관계를 나타내요 — N:1 관계를 자바 객체로 매핑하는 어노테이션이에요. ' +
        '여러 댓글(Comment)이 하나의 게시글(Post)을 바라보는 구조로, DB 관점에서는 Comment 테이블에 post_id라는 외래키(Foreign Key)가 생겨요. ' +
        'fetch = FetchType.LAZY는 "댓글을 조회할 때 게시글 정보는 당장 가져오지 않고, 실제로 필요할 때만 DB에서 가져와"라는 뜻이에요 — 불필요한 조회를 줄여 성능을 최적화해요. ' +
        '@ManyToOne의 기본 페치 전략은 EAGER(즉시 로딩)라서, LAZY로 명시적으로 바꾸는 게 좋은 습관이에요.',
      terms: [
        { t: '@ManyToOne', d: '다대일 관계를 매핑해요 — 여러 Comment가 하나의 Post에 소속돼요' },
        { t: 'FetchType.LAZY', d: '실제로 post 필드에 접근할 때만 SELECT 쿼리가 나가요 — 불필요한 조인을 방지해요' },
        { t: '@JoinColumn(name = "post_id")', d: 'Comment 테이블에 post_id라는 외래키 컬럼이 생성돼요' },
        { t: 'getPost()', d: '이 메서드를 호출하는 순간 지연 로딩이 발생해 DB에서 Post를 조회해요' },
      ],
      why:
        '부모(Post)-자식(Comment) 관계를 객체 지향적으로 표현하려고 써요. ' +
        '실무에서 게시글-댓글, 주문-주문상품, 회원-게시글 등 1:N 관계의 N 쪽에 @ManyToOne을 붙여요.',
      expectedOutput:
        'comment.getPost() 호출 시:\n' +
        '[실행] 지연 로딩 — 게시글 정보 조회',
      realWorldUsage:
        '실제로 Comment, Like, OrderItem, CartItem 등 "누군가에게 소속된" 엔티티들은 모두 @ManyToOne으로 부모를 참조해요.',
      pitfall: '@ManyToOne의 기본 FetchType이 EAGER라서, 명시적으로 LAZY를 지정하지 않으면 불필요한 LEFT JOIN이 항상 발생하고 N+1 문제로 이어져요.',
    },
  },
  {
    id: 'db-one-to-many',
    lang: 'java',
    title: '@OneToMany 일대다',
    file: 'Post.java',
    code: `import jakarta.persistence.CascadeType;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import java.util.ArrayList;
import java.util.List;

@Entity
public class Post {

  @Id
  @GeneratedValue
  private Long id;

  @OneToMany(mappedBy = "post", cascade = CascadeType.ALL)
  private List<Comment> comments = new ArrayList<>();

  public void addComment(Comment comment) {
    comments.add(comment);
    System.out.println("[실행] 댓글 추가 — 총 댓글 수: " + comments.size());
  }
}`,
    explain: {
      concept:
        '@OneToMany는 "하나의 게시글이 여러 댓글을 가진다"는 관계를 나타내요 — 1:N 관계의 부모 쪽에 붙는 어노테이션이에요. ' +
        'mappedBy = "post"는 "나는 외래키를 안 가지고 있고, Comment 엔티티의 post 필드가 외래키를 관리해요"라고 알려주는 설정이에요 — 이게 없으면 양쪽이 외래키를 가져서 중복 업데이트가 발생해요. ' +
        'cascade = CascadeType.ALL은 "부모를 저장하면 자식도 자동 저장, 부모를 삭제하면 자식도 자동 삭제"라는 전파 설정이에요. ' +
        'comments 필드를 new ArrayList<>()로 초기화하는 건 NPE 방지 관례예요.',
      terms: [
        { t: '@OneToMany', d: '일대다 관계를 매핑해요 — 하나의 Post가 여러 Comment를 가져요' },
        { t: 'mappedBy = "post"', d: '반대편(Comment)의 post 필드가 외래키를 관리한다고 지정해요 — 안 하면 중간 테이블이 생겨요' },
        { t: 'cascade = CascadeType.ALL', d: '부모에 가해진 모든 작업(저장·삭제·병합)을 자식에도 전파해요' },
        { t: 'new ArrayList<>()', d: '컬렉션을 초기화해서 NullPointerException을 방지해요' },
      ],
      why:
        '부모 엔티티에서 자식 컬렉션을 객체 그래프로 탐색하려고 써요. ' +
        'post.getComments().size()를 바로 호출할 수 있어서 도메인 로직이 직관적으로 표현돼요.',
      expectedOutput:
        'post.addComment(comment) 호출 시:\n' +
        '[실행] 댓글 추가 — 총 댓글 수: 3',
      realWorldUsage:
        '실제로 Order(주문) 안에 List<OrderItem>(주문상품), Cart(장바구니) 안에 List<CartItem>(장바구니 항목) 등 1:N 관계는 거의 모든 도메인 모델에 등장해요.',
      pitfall: 'mappedBy를 빼면 JPA가 관계의 주인이 양쪽이라고 판단해서, post_comment라는 중간 연결 테이블을 자동으로 만들어요. 의도치 않은 스키마 변경을 유발해요.',
    },
  },
  {
    id: 'db-fetch-lazy',
    lang: 'java',
    title: '@OneToMany LAZY와 LazyInitializationException',
    file: 'PostService.java',
    code: `import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional(readOnly = true)
public class PostService {

  public int countComments(Long postId) {
    Post post = postRepo.findById(postId).orElseThrow();
    System.out.println("[실행] 댓글 수 조회 — postId: " + postId);
    int count = post.getComments().size();
    System.out.println("[결과] 댓글 수: " + count);
    return count;
  }
}`,
    explain: {
      concept:
        '@OneToMany의 기본 FetchType은 LAZY여서, post를 조회할 때 comments 컬렉션은 바로 가져오지 않고 실제로 접근하는 순간에 DB를 조회해요. ' +
        '이 지연 로딩이 동작하려면 반드시 트랜잭션 안에 있어야 해요 — @Transactional(readOnly = true)가 그 트랜잭션을 열어주고 있어요. ' +
        '트랜잭션이 끝난 뒤(예: 컨트롤러에서) comments에 접근하면 LazyInitializationException이 발생해요 — "이미 DB 연결이 닫혔는데 데이터를 달라고?" 하는 오류예요. ' +
        '실무에서 가장 자주 마주치는 JPA 예외 중 하나라서, 트랜잭션 범위를 항상 의식해야 해요.',
      terms: [
        { t: 'FetchType.LAZY', d: '@OneToMany의 기본값이에요 — 컬렉션에 실제 접근할 때 SELECT가 실행돼요' },
        { t: 'LazyInitializationException', d: '트랜잭션이 닫힌 후 LAZY 필드에 접근하면 발생하는 예외예요 — "no Session" 메시지가 포함돼요' },
        { t: '@Transactional(readOnly = true)', d: '읽기 전용 트랜잭션을 열어 LAZY 로딩이 동작하게 해줘요 — 쓰기 작업 없을 때 최적이에요' },
        { t: 'post.getComments().size()', d: '이 호출 순간에 DB에서 댓글 목록을 조회하는 SELECT가 실행돼요' },
      ],
      why:
        'LAZY 로딩이 언제 동작하고 언제 실패하는지 알면, 불필요한 데이터 조회를 막으면서도 필요한 순간에는 안전하게 가져올 수 있어요. ' +
        '실무에서는 트랜잭션을 서비스 계층에서 열고 닫는 "OSIV(Open Session In View) 비활성화" 패턴이 권장돼요.',
      expectedOutput:
        'countComments(1L) 호출 시:\n' +
        '[실행] 댓글 수 조회 — postId: 1\n' +
        '[결과] 댓글 수: 12',
      realWorldUsage:
        '실제로 컨트롤러에서 post.getComments()를 호출하면 LazyInitializationException이 발생하는 상황이 너무 흔해서, DTO로 변환해 반환하는 패턴이 정착됐어요.',
      pitfall: '트랜잭션 밖에서 LAZY 컬렉션에 접근하면 100% LazyInitializationException이 발생해요. 해결책은 @Transactional을 붙이거나, JPQL fetch join으로 미리 로딩하는 거예요.',
    },
  },
  {
    id: 'db-fetch-eager',
    lang: 'java',
    title: 'FetchType.EAGER 즉시 로딩',
    file: 'Item.java',
    code: `import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;
import jakarta.persistence.ManyToOne;

@Entity
public class Item {

  @Id
  @GeneratedValue
  private Long id;

  @ManyToOne(fetch = FetchType.EAGER)
  private Category category;

  public Category getCategory() {
    System.out.println("[실행] 즉시 로딩 — 이미 조회된 카테고리: " + category);
    return category;
  }
}`,
    explain: {
      concept:
        'EAGER(즉시 로딩)는 부모 엔티티를 조회할 때 연관 데이터도 함께 즉시 가져오는 전략이에요. ' +
        'Item을 조회하는 순간 Category도 함께 조회돼서, 나중에 item.getCategory()를 호출해도 추가 쿼리가 나가지 않아요 — 이미 메모리에 있으니까요. ' +
        '하지만 편한 만큼 위험도 커요 — Item만 필요해도 항상 Category까지 조회해서 불필요한 JOIN이 발생하고, @OneToMany가 EAGER면 N+1 문제의 주요 원인이 돼요. ' +
        '@ManyToOne도 기본이 EAGER라서 의식적으로 LAZY로 바꾸는 습관이 중요해요.',
      terms: [
        { t: 'FetchType.EAGER', d: '엔티티 조회 시 연관 데이터를 함께 즉시 가져와요 — 추가 쿼리 없이 바로 접근할 수 있어요' },
        { t: '@ManyToOne', d: '다대일 관계예요 — 이 어노테이션의 기본 FetchType은 EAGER예요' },
        { t: 'getCategory()', d: 'EAGER라서 호출 시점에 DB 조회가 발생하지 않고 이미 로딩된 값을 반환해요' },
      ],
      why:
        '항상 같이 사용하는 데이터(예: Item과 Category)를 매번 따로 조회하는 번거로움을 줄이려고 EAGER를 쓰지만, ' +
        '실무에서는 EAGER가 성능 문제의 주범이 되는 경우가 많아서 신중히 결정해야 해요.',
      expectedOutput:
        'item.getCategory() 호출 시:\n' +
        '[실행] 즉시 로딩 — 이미 조회된 카테고리: Category{name=\'전자제품\'}',
      realWorldUsage:
        '실제로 @ManyToOne은 기본 EAGER라서, LAZY로 명시적으로 변경하지 않은 레거시 코드에서 N+1 문제로 장애가 발생하는 경우가 많아요.',
      pitfall: 'EAGER가 설정된 관계가 여러 개면, Item 하나 조회에 3~4개의 LEFT JOIN이 발생해서 쿼리가 엄청 무거워져요. 실무에서는 LAZY를 기본으로 쓰고, 필요할 때 fetch join으로 가져오는 전략이 표준이에요.',
    },
  },
  {
    id: 'db-cascade',
    lang: 'java',
    title: 'CascadeType 전파',
    file: 'Invoice.java',
    code: `import jakarta.persistence.CascadeType;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import java.util.ArrayList;
import java.util.List;

@Entity
public class Invoice {

  @Id
  @GeneratedValue
  private Long id;

  @OneToMany(mappedBy = "invoice", cascade = CascadeType.REMOVE)
  private List<LineItem> items = new ArrayList<>();

  public void removeWithLog() {
    System.out.println("[실행] 청구서 삭제 — 항목 " + items.size() + "개도 함께 삭제됨");
  }
}`,
    explain: {
      concept:
        'CascadeType은 부모 엔티티에 가해진 작업(저장·삭제·병합 등)을 자식 엔티티에도 자동으로 전파할지 정하는 설정이에요. ' +
        'CascadeType.REMOVE는 부모 청구서(Invoice)를 삭제하면, 여기에 소속된 모든 항목(LineItem)도 함께 삭제돼요 — 청구서를 찢으면 거기 적힌 항목도 사라지는 거예요. ' +
        '반면 CascadeType.PERSIST는 부모를 저장할 때 자식도 자동 저장해줘서, 부모만 save() 호출해도 자식들이 한 번에 저장돼요. ' +
        'CascadeType.ALL은 PERSIST, MERGE, REMOVE, REFRESH, DETACH를 모두 포함한 가장 강력한 전파 설정이에요.',
      terms: [
        { t: 'CascadeType.REMOVE', d: '부모가 삭제될 때 자식 엔티티도 함께 삭제해요 — 부모 없이 존재할 수 없는 자식에 써요' },
        { t: 'mappedBy = "invoice"', d: 'LineItem이 외래키를 소유한다고 지정해요 — cascade가 제대로 동작하려면 필수예요' },
        { t: 'LineItem', d: '청구서의 각 품목을 나타내는 엔티티예요 — 청구서 없이는 존재 의미가 없어요' },
      ],
      why:
        '부모-자식 생명주기를 함께 관리해서, 부모만 조작해도 자식이 자동으로 따라오게 하려고 써요. ' +
        '실무에서는 게시글-댓글(게시글 삭제 시 댓글도 삭제), 주문-주문상품(주문 삭제 시 상품 목록도 삭제)처럼 "구성요소" 관계에 꼭 써요.',
      expectedOutput:
        'removeWithLog() 호출 시:\n' +
        '[실행] 청구서 삭제 — 항목 3개도 함께 삭제됨',
      realWorldUsage:
        '실제로 주문(Order) 삭제 시 주문상품(OrderItem)도 함께 삭제될 때 CascadeType.REMOVE를, 주문 저장 시 주문상품도 자동 저장될 때 CascadeType.PERSIST를 함께 써요.',
      pitfall: '다른 부모가 같은 자식을 참조하고 있으면, CascadeType.REMOVE 실행 시 참조 무결성 제약 조건 위반으로 DB 에러가 나요. 자식이 독립적으로 존재할 수 있다면 cascade를 신중하게 결정해야 해요.',
    },
  },
  {
    id: 'db-transactional',
    lang: 'java',
    title: '@Transactional 기본',
    file: 'TransferService.java',
    code: `import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class TransferService {

  @Transactional
  public void transfer(Long from, Long to, long amount) {
    System.out.println("[실행] 이체 시작 — from: " + from + ", to: " + to + ", amount: " + amount);
    accountRepo.withdraw(from, amount);
    System.out.println("[실행] 출금 완료: " + amount + "원");
    accountRepo.deposit(to, amount);
    System.out.println("[실행] 입금 완료: " + amount + "원");
    System.out.println("[결과] 이체 완료");
  }
}`,
    explain: {
      concept:
        '@Transactional은 메서드 안의 모든 DB 작업을 하나의 원자적 단위(트랜잭션)로 묶어주는 어노테이션이에요. ' +
        '은행 이체를 예로 들면, 출금과 입금 중 하나라도 실패하면 모든 작업이 처음으로 되돌려져요(롤백) — "돈만 빠져나가고 입금되지 않는" 사고를 원천 차단해줘요. ' +
        '기본적으로 RuntimeException이나 Error가 발생하면 롤백되지만, 체크 예외(IOException 등)는 롤백되지 않아요 — 이게 많은 초보자를 당황시키는 지점이에요. ' +
        '실무에서는 데이터 일관성이 중요한 모든 서비스 메서드에 @Transactional을 붙여요.',
      terms: [
        { t: '@Transactional', d: '메서드의 모든 DB 작업을 하나의 트랜잭션으로 묶어요 — 실패 시 자동 롤백해줘요' },
        { t: 'withdraw(from, amount)', d: 'from 계좌에서 amount 만큼 출금해요' },
        { t: 'deposit(to, amount)', d: 'to 계좌에 amount 만큼 입금해요' },
        { t: '롤백', d: '트랜잭션 내 작업을 모두 취소하고 처음 상태로 되돌리는 동작이에요' },
      ],
      why:
        '데이터 일관성을 보장하려고 트랜잭션을 써요. ' +
        '출금만 성공하고 입금이 실패하면 돈이 증발하는 셈이니까, 둘 다 성공하거나 둘 다 실패해야 해요.',
      expectedOutput:
        'transfer(1L, 2L, 5000) 호출 시:\n' +
        '[실행] 이체 시작 — from: 1, to: 2, amount: 5000\n' +
        '[실행] 출금 완료: 5000원\n' +
        '[실행] 입금 완료: 5000원\n' +
        '[결과] 이체 완료',
      realWorldUsage:
        '실제로 결제 처리(재고 차감 + 주문 생성 + 포인트 적립), 회원가입(회원 저장 + 기본 설정 저장 + 환영 쿠폰 발급)처럼 여러 DB 작업이 하나로 묶여야 하는 모든 곳에 @Transactional을 써요.',
      pitfall: 'RuntimeException만 롤백 대상이고, 체크 예외(IOException, SQLException 등)는 롤백되지 않아요. 체크 예외도 롤백하려면 @Transactional(rollbackFor = Exception.class)을 명시하세요.',
    },
  },
  {
    id: 'db-tx-propagation',
    lang: 'java',
    title: '전파 속성 REQUIRES_NEW',
    file: 'AuditService.java',
    code: `import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

@Service
public class AuditService {

  @Transactional(propagation = Propagation.REQUIRES_NEW)
  public void writeLog(String msg) {
    System.out.println("[실행] 감사 로그 기록 (새 트랜잭션): " + msg);
    auditRepo.save(new Audit(msg));
  }
}`,
    explain: {
      concept:
        'propagation(전파 속성)은 이미 진행 중인 트랜잭션이 있을 때, 새로 호출된 @Transactional 메서드가 어떻게 행동할지 결정하는 설정이에요. ' +
        'REQUIRES_NEW는 "현재 트랜잭션이 있든 말든 무조건 새 트랜잭션을 열어줘"라는 뜻이에요 — 기존 트랜잭션은 잠시 멈춰두고, 이 메서드는 독립적인 트랜잭션에서 실행돼요. ' +
        '왜 필요하냐면, 메인 작업이 실패해도 로그는 꼭 남겨야 할 때 독립 트랜잭션이 필요해요 — 메인 트랜잭션이 롤백돼도 로그 트랜잭션은 커밋되는 거예요.',
      terms: [
        { t: 'propagation', d: '트랜잭션이 이미 존재할 때 어떻게 행동할지 결정하는 옵션이에요' },
        { t: 'REQUIRES_NEW', d: '항상 새로운 독립 트랜잭션을 시작해요 — 기존 트랜잭션은 일시 중지돼요' },
        { t: '@Transactional', d: '트랜잭션을 선언하는 어노테이션이에요' },
        { t: 'auditRepo.save(...)', d: '감사 로그를 DB에 저장해요 — 새 트랜잭션으로 독립적으로 커밋돼요' },
      ],
      why:
        '메인 비즈니스 로직과 무관하게 반드시 기록돼야 하는 데이터(감사 로그, 알림 내역 등)를 독립 트랜잭션으로 처리하려고 써요. ' +
        '메인 트랜잭션이 롤백돼도 로그는 남아서, "왜 실패했는지" 원인 분석이 가능해져요.',
      expectedOutput:
        'writeLog("이체 시도 — from: 1, to: 2") 호출 시:\n' +
        '[실행] 감사 로그 기록 (새 트랜잭션): 이체 시도 — from: 1, to: 2',
      realWorldUsage:
        '실제로 결제 실패 시에도 "누가, 언제, 얼마를 결제 시도했다"는 로그를 남겨야 해서 AuditService에 REQUIRES_NEW를 걸어둬요.',
      pitfall: 'REQUIRES_NEW는 DB 커넥션을 하나 더 쓰기 때문에, 커넥션 풀이 부족한 환경에서는 데드락 위험이 있어요. 꼭 필요한 곳에만 제한적으로 쓰세요.',
    },
  },
  {
    id: 'db-tx-isolation',
    lang: 'java',
    title: '격리 수준 isolation',
    file: 'InventoryService.java',
    code: `import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Isolation;
import org.springframework.transaction.annotation.Transactional;

@Service
public class InventoryService {

  @Transactional(isolation = Isolation.READ_COMMITTED)
  public int stock(Long productId) {
    int qty = productRepo.findStock(productId);
    System.out.println("[실행] 재고 조회 (READ_COMMITTED) — productId: " + productId + ", stock: " + qty);
    return qty;
  }
}`,
    explain: {
      concept:
        'isolation(격리 수준)은 여러 트랜잭션이 동시에 같은 데이터를 읽고 쓸 때, 서로 얼마나 영향을 주고받을지 제어하는 설정이에요. ' +
        'READ_COMMITTED는 "다른 트랜잭션이 커밋한 데이터만 읽겠다"는 수준으로, 커밋되지 않은 중간 변경 내용(Dirty Read)은 읽지 않아요 — 가장 많이 사용하는 실용적인 수준이에요. ' +
        '격리가 강할수록(SERIALIZABLE) 데이터 일관성은 높아지지만 동시에 처리할 수 있는 트랜잭션 수가 줄어서 성능이 떨어지고, 격리가 약할수록(READ_UNCOMMITTED) 성능은 좋지만 잘못된 데이터를 읽을 위험이 커져요.',
      terms: [
        { t: 'isolation', d: '동시 트랜잭션 간의 데이터 가시성 수준을 정하는 설정이에요' },
        { t: 'READ_COMMITTED', d: '커밋 완료된 데이터만 읽는 수준이에요 — Dirty Read를 방지하고 실무에서 가장 기본으로 써요' },
        { t: '@Transactional', d: '트랜잭션을 선언하고 격리 수준을 함께 지정해요' },
        { t: 'findStock(productId)', d: 'DB에서 상품 재고 수량을 조회해요' },
      ],
      why:
        '동시성과 데이터 일관성 사이에서 균형을 맞추려고 격리 수준을 조정해요. ' +
        '결제·재고처럼 정확성이 중요한 작업은 격리 수준을 올리고, 단순 조회는 기본값(READ_COMMITTED)으로 충분해요.',
      expectedOutput:
        'stock(100L) 호출 시:\n' +
        '[실행] 재고 조회 (READ_COMMITTED) — productId: 100, stock: 42',
      realWorldUsage:
        '실제로 재고 차감 로직에서는 REPEATABLE_READ나 SERIALIZABLE로 격리 수준을 올려서, 동시 주문으로 재고가 마이너스가 되는 걸 방지해요.',
      pitfall: '격리 수준을 올릴수록 DB의 락(잠금) 경합이 심해져서 성능이 급격히 저하될 수 있어요. 진짜 필요한 곳에만 적용하고, 대부분은 기본값으로 충분해요.',
    },
  },
  {
    id: 'db-tx-rollback',
    lang: 'java',
    title: 'rollbackFor 지정',
    file: 'OrderService.java',
    code: `import java.io.IOException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class OrderService {

  @Transactional(rollbackFor = IOException.class)
  public void place(OrderRequest req) throws IOException {
    System.out.println("[실행] 주문 처리 — req: " + req);
    orderRepo.save(req.toOrder());
  }
}`,
    explain: {
      concept:
        'rollbackFor는 "이 예외가 발생했을 때도 트랜잭션을 롤백해 줘"라고 지정하는 설정이에요. ' +
        '@Transactional은 기본적으로 RuntimeException만 롤백 대상인데, 체크 예외(IOException, SQLException 등)는 롤백되지 않아요. ' +
        'rollbackFor = IOException.class를 지정하면, IOException이 발생해도 트랜잭션이 롤백돼서 DB에 저장된 데이터가 취소돼요. ' +
        '반대로 noRollbackFor는 "이 예외는 롤백하지 마"라고 지정할 때 써요.',
      terms: [
        { t: 'rollbackFor = IOException.class', d: 'IOException이 발생해도 트랜잭션을 롤백하라고 명시해요 — 체크 예외는 기본 롤백 대상이 아니라서 필요해요' },
        { t: 'IOException', d: '입출력 작업 중 발생하는 체크 예외예요 — 파일 저장, 네트워크 통신 등에서 발생해요' },
        { t: 'throws IOException', d: '체크 예외를 던질 수 있다고 메서드 시그니처에 선언해요' },
        { t: 'orderRepo.save(...)', d: '주문 데이터를 DB에 저장해요 — 예외 발생 시 롤백돼요' },
      ],
      why:
        '체크 예외가 발생해도 데이터 일관성을 지키려고 rollbackFor를 지정해요. ' +
        '실무에서는 RuntimeException만으로는 표현하기 어려운 비즈니스 예외를 체크 예외로 만들 때 rollbackFor로 롤백을 보장해요.',
      expectedOutput:
        'place(req) 호출 시:\n' +
        '[실행] 주문 처리 — req: OrderRequest[...]\n' +
        '(IOException 발생 시 DB 작업이 롤백됨)',
      realWorldUsage:
        '실제로 파일 업로드 + DB 저장을 함께 처리할 때, 파일 저장(IOException 가능)이 실패하면 이미 저장된 DB 데이터도 함께 롤백되도록 rollbackFor를 써요.',
      pitfall: 'rollbackFor를 명시하지 않으면 체크 예외 발생 시 "예외는 났는데 DB 데이터는 저장됨"이라는 더 무서운 버그가 생겨요.',
    },
  },
  {
    id: 'db-specification',
    lang: 'java',
    title: 'Specification 동적 쿼리',
    file: 'UserSpecs.java',
    code: `import jakarta.persistence.criteria.CriteriaBuilder;
import jakarta.persistence.criteria.CriteriaQuery;
import jakarta.persistence.criteria.Root;
import org.springframework.data.jpa.domain.Specification;

public class UserSpecs {

  public static Specification<User> nameContains(String keyword) {
    if (keyword == null) {
      return (root, query, cb) -> cb.conjunction();
    }
    return (root, query, cb) -> {
      String pattern = "%" + keyword + "%";
      System.out.println("[실행] LIKE 조건 — 패턴: " + pattern);
      return cb.like(root.get("name"), pattern);
    };
  }

  public static Specification<User> ageOver(int age) {
    return (root, query, cb) -> {
      System.out.println("[실행] 나이 조건 — age > " + age);
      return cb.greaterThan(root.get("age"), age);
    };
  }
}`,
    explain: {
      concept:
        'Specification은 검색 조건을 객체로 만들어서, 여러 조건을 AND/OR로 조립할 수 있게 해주는 JPA 도구예요. ' +
        '정적 쿼리(findByName)와 달리, 사용자가 이름만 입력했을 땐 이름 검색만, 나이까지 입력했을 땐 두 조건을 합쳐서 동적으로 쿼리를 만들어요. ' +
        'root는 엔티티의 루트(시작점)로 root.get("name")처럼 필드에 접근할 수 있고, cb(CriteriaBuilder)는 like, greaterThan, equal 같은 조건식을 만드는 팩토리예요. ' +
        'cb.conjunction()은 "항상 참(true)"인 조건을 반환해서, null인 조건을 안전하게 무시하는 트릭이에요.',
      terms: [
        { t: 'Specification<User>', d: 'User 엔티티에 대한 동적 쿼리 조건을 표현하는 타입이에요' },
        { t: 'root.get("name")', d: 'User 엔티티의 name 필드를 참조해요 — 문자열로 필드명을 지정해요' },
        { t: 'cb.like(root.get("name"), pattern)', d: 'name LIKE \'%keyword%\' 조건을 만들어요' },
        { t: 'cb.conjunction()', d: '항상 참인 조건이에요 — 조건이 null일 때 "조건 없음"을 표현해요' },
      ],
      why:
        '검색 조건이 사용자 입력에 따라 동적으로 바뀔 때(이름만 검색, 이름+나이 검색, 나이만 검색 등), if-else 연쇄 없이 깔끔하게 쿼리를 조립하려고 써요.',
      expectedOutput:
        'nameContains("kim") 호출 시:\n' +
        '[실행] LIKE 조건 — 패턴: %kim%\n' +
        'ageOver(20) 호출 시:\n' +
        '[실행] 나이 조건 — age > 20',
      realWorldUsage:
        '실제로 관리자 페이지의 회원 검색에서 이름, 이메일, 가입일, 상태 등 10가지 조건을 선택적으로 조합할 때 Specification으로 깔끔하게 구현해요.',
      pitfall: 'keyword가 null이면 cb.like에 null이 전달돼서 NPE가 발생해요. 반드시 null 체크를 하고 null이면 conjunction()을 반환하도록 방어해야 해요.',
    },
  },
  {
    id: 'db-spec-where',
    lang: 'java',
    title: 'Specification 조합',
    file: 'UserRepository.java',
    code: `import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;
import static com.example.UserSpecs.nameContains;
import static com.example.UserSpecs.ageOver;
import static org.springframework.data.jpa.domain.Specification.where;

@Repository
public interface UserRepository
    extends JpaRepository<User, Long>, JpaSpecificationExecutor<User> {

  default List<User> search(String name, int age) {
    System.out.println("[실행] Specification 조합 검색 — name: " + name + ", age: " + age);
    List<User> result = findAll(where(nameContains(name)).and(ageOver(age)));
    System.out.println("[결과] 검색 결과 수: " + result.size());
    return result;
  }
}`,
    explain: {
      concept:
        'Specification.where()로 시작해서 .and()와 .or()로 여러 Specification을 조립할 수 있어요 — 레고 블록을 연결하듯 조건을 합치는 거예요. ' +
        'where(nameContains(name)).and(ageOver(age))는 "이름에 name이 포함되고, 나이가 age를 초과하는" 두 조건을 AND로 결합한 Specification을 만들어요. ' +
        'JpaSpecificationExecutor 인터페이스를 상속받아야 findAll(Specification) 같은 메서드를 쓸 수 있어요. ' +
        'static import를 쓰면 where() 같은 팩토리 메서드를 클래스명 없이 바로 호출할 수 있어서 코드가 더 읽기 쉬워져요.',
      terms: [
        { t: 'JpaSpecificationExecutor<User>', d: 'Specification을 실행할 수 있는 메서드(findAll 등)를 제공하는 인터페이스예요' },
        { t: 'where(nameContains(name))', d: 'Specification 조합의 시작점이에요 — where()는 빈 Specification을 감싸요' },
        { t: '.and(ageOver(age))', d: '앞 조건과 ageOver 조건을 AND로 결합해요 — .or()도 사용 가능해요' },
        { t: 'static import', d: '클래스명 없이 메서드를 바로 호출하게 해줘요 — where()를 바로 쓸 수 있어요' },
      ],
      why:
        '여러 개별 조건을 조립해서 복잡한 검색을 만들고, 각 조건을 독립적으로 재사용하려고 써요. ' +
        '"이름만 검색", "이름+나이 검색", "상태+날짜 검색"처럼 모든 조합을 일일이 메서드로 만들지 않아도 돼요.',
      expectedOutput:
        'search("kim", 20) 호출 시:\n' +
        '[실행] Specification 조합 검색 — name: kim, age: 20\n' +
        '(내부적으로 UserSpecs.nameContains, ageOver 각각 실행)\n' +
        '[결과] 검색 결과 수: 3',
      realWorldUsage:
        '실제로 관리자 페이지의 고급 검색에서 5개 조건(이름, 이메일, 가입일 범위, 상태, 등급)을 동적으로 조합하는 검색 API에 Specification이 기본 솔루션이에요.',
      pitfall: 'nameContains 같은 조건 메서드 안에서 keyword가 null인지 확인하지 않으면, cb.like()에 null이 전달돼서 SQL 오류가 발생해요.',
    },
  },
  {
    id: 'db-query-by-example',
    lang: 'java',
    title: 'QueryByExample 탐색기',
    file: 'ProductService.java',
    code: `import org.springframework.data.domain.Example;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class ProductService {

  public List<Product> findActive() {
    Product probe = new Product();
    probe.setActive(true);
    System.out.println("[실행] QueryByExample — 활성 상품 조회");
    List<Product> result = productRepo.findAll(Example.of(probe));
    System.out.println("[결과] 조회된 상품 수: " + result.size());
    return result;
  }
}`,
    explain: {
      concept:
        'QueryByExample(QBE)은 샘플 객체(probe)를 하나 만들어서, "이 객체랑 필드값이 같은 데이터만 찾아줘"라고 요청하는 방식이에요. ' +
        'probe.setActive(true)로 샘플 객체를 만들고 Example.of(probe)로 검색 조건을 생성하면, active = true인 모든 Product를 찾아줘요. ' +
        '스케치 한 장을 보여주고 "이런 물건 찾아줘"라고 하는 것과 같아요 — 메서드 이름이나 JPQL을 작성할 필요 없이 객체만 던지면 돼요. ' +
        '하지만 동등 비교(=)만 지원하고, 범위 검색(>=", "<" 등), LIKE, IN 같은 복잡한 조건은 표현할 수 없어서 단순한 검색에만 써요.',
      terms: [
        { t: 'Example.of(probe)', d: '샘플 객체로 검색 조건을 생성해요 — probe에 설정된 필드값으로 동등 비교를 해요' },
        { t: 'probe', d: '검색 조건으로 사용할 샘플 객체예요 — null이 아닌 필드만 검색 조건에 포함돼요' },
        { t: 'findAll(Example)', d: 'JpaRepository가 제공하는 메서드로, Example 조건에 맞는 모든 데이터를 조회해요' },
      ],
      why:
        '간단한 동등(=) 조건 검색을 빠르게 만들려고 써요. ' +
        '메서드 이름(findByActiveTrue)을 만드는 것보다 객체 하나로 조건을 표현하는 게 더 직관적일 때도 있어요.',
      expectedOutput:
        'findActive() 호출 시:\n' +
        '[실행] QueryByExample — 활성 상품 조회\n' +
        '[결과] 조회된 상품 수: 25',
      realWorldUsage:
        '실제로 간단한 필터(카테고리=전자제품, 상태=판매중) 같은 단순 동등 검색에 QueryByExample을 쓰면, 별도의 쿼리 메서드 없이 빠르게 구현할 수 있어요.',
      pitfall: '동등(=) 조건만 가능하고 범위 검색(price > 10000)이나 LIKE 검색은 안 돼요. 복잡한 검색은 Specification이나 JPQL로 전환해야 해요.',
    },
  },
  {
    id: 'db-mapper',
    lang: 'java',
    title: '@Mapper MyBatis 인터페이스',
    file: 'UserMapper.java',
    code: `import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Select;

@Mapper
public interface UserMapper {

  @Select("SELECT id, name FROM users WHERE id = #{id}")
  User findById(Long id);

  default User findByIdWithLog(Long id) {
    System.out.println("[실행] MyBatis 조회 — id: " + id);
    User user = findById(id);
    System.out.println("[결과] 조회된 사용자: " + user);
    return user;
  }
}`,
    explain: {
      concept:
        '@Mapper는 MyBatis가 "이 인터페이스만 보고 구현체를 만들어줘"라는 표시예요. ' +
        'JPA의 @Repository와 비슷하지만, JPA처럼 자동으로 SQL을 생성하지 않고 @Select/@Insert/@Update/@Delete 어노테이션으로 SQL을 직접 작성해요. ' +
        '#{id}는 PreparedStatement의 ? 자리처럼 파라미터를 안전하게 바인딩하는 자리표시자로, SQL 인젝션 공격을 방지해줘요. ' +
        'MyBatis는 JPA보다 SQL을 직접 제어할 수 있어서, 복잡한 조인이나 레거시 DB 스키마를 다룰 때 선호돼요.',
      terms: [
        { t: '@Mapper', d: 'MyBatis가 이 인터페이스의 구현체를 프록시로 자동 생성하게 하는 어노테이션이에요' },
        { t: '@Select("SELECT ...")', d: '이 메서드가 실행할 SELECT SQL을 직접 작성해요' },
        { t: '#{id}', d: '파라미터를 PreparedStatement 방식으로 안전하게 바인딩해요 — SQL 인젝션을 방지해요' },
        { t: 'findByIdWithLog(Long id)', d: 'default 메서드로 실제 쿼리 전후에 로깅을 추가할 수 있어요' },
      ],
      why:
        '복잡한 SQL을 직접 제어하면서도, XML 파일 없이 인터페이스에 어노테이션으로 깔끔하게 작성하려고 써요. ' +
        '실무에서는 JPA로 처리하기 어려운 통계 쿼리나 복잡한 조인에 MyBatis를 병행해서 써요.',
      expectedOutput:
        'findByIdWithLog(1L) 호출 시:\n' +
        '[실행] MyBatis 조회 — id: 1\n' +
        '[결과] 조회된 사용자: User{id=1, name=\'kim\'}',
      realWorldUsage:
        '실제로 JPA와 MyBatis를 혼용해서, 기본 CRUD는 JPA로, 복잡한 통계·리포트 쿼리는 MyBatis로 처리하는 전략을 많이 써요.',
      pitfall: '@MapperScan이나 mybatis-spring-boot-starter 의존성이 없으면 @Mapper가 붙은 인터페이스를 MyBatis가 인식하지 못해요. 스프링 부트 스타터를 추가하면 자동으로 스캔돼요.',
    },
  },
  {
    id: 'db-resultmap',
    lang: 'java',
    title: 'MyBatis ResultMap 컬럼 매핑',
    file: 'UserMapper.java',
    code: `import java.util.List;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Result;
import org.apache.ibatis.annotations.ResultMap;
import org.apache.ibatis.annotations.Results;
import org.apache.ibatis.annotations.Select;

@Mapper
public interface UserMapper {

  @Results(id = "userMap", value = {
    @Result(property = "id",   column = "user_id", id = true),
    @Result(property = "name", column = "user_name")
  })
  @Select("SELECT user_id, user_name FROM users")
  List<User> findAll();

  @ResultMap("userMap")
  @Select("SELECT user_id, user_name FROM users WHERE user_id = #{id}")
  User findById(Long id);

  default List<User> findAllWithLog() {
    System.out.println("[실행] MyBatis ResultMap — 전체 조회");
    List<User> users = findAll();
    System.out.println("[결과] 조회된 사용자 수: " + users.size());
    return users;
  }
}`,
    explain: {
      concept:
        '@Results는 DB 컬럼명과 자바 필드명이 다를 때, "어느 컬럼이 어느 필드에 매핑되는지" 연결표를 정의하는 MyBatis 어노테이션이에요. ' +
        'DB의 user_id 컬럼을 자바의 id 필드에, user_name을 name 필드에 매핑하고 있어요 — 스네이크 케이스(user_id)와 카멜 케이스(id)를 연결하는 거예요. ' +
        '@ResultMap("userMap")는 이미 정의한 @Results를 id로 재사용하는 기능이에요 — 매핑 정의를 반복 작성하지 않고 공유할 수 있어요. ' +
        'id = true는 이 필드가 PK(기본키)임을 표시해서, MyBatis의 캐시나 비교 연산에 활용돼요.',
      terms: [
        { t: '@Results(id = "userMap")', d: '컬럼-필드 매핑 정의에 이름을 붙여 저장해요 — XML의 resultMap과 같아요' },
        { t: '@Result(property = "id", column = "user_id")', d: 'DB 컬럼 user_id를 자바 필드 id에 매핑해요' },
        { t: 'id = true', d: '해당 필드가 기본키라고 표시해요 — MyBatis 내부 최적화에 활용돼요' },
        { t: '@ResultMap("userMap")', d: 'id가 "userMap"인 @Results 정의를 재사용해요 — 반복 선언을 줄여줘요' },
      ],
      why:
        'DB 컬럼명과 자바 필드명이 다른 레거시 DB나, 스네이크 케이스가 혼용된 환경에서 정확한 매핑을 보장하려고 써요.',
      expectedOutput:
        'findAllWithLog() 호출 시:\n' +
        '[실행] MyBatis ResultMap — 전체 조회\n' +
        '[결과] 조회된 사용자 수: 10',
      realWorldUsage:
        '실제로 레거시 DB의 컬럼명이 REG_DATE, MOD_DATE 같은 약어로 돼 있어서 createdAt, modifiedAt과 매핑할 때 ResultMap이 필수예요.',
      pitfall: '매핑을 빠뜨리면 해당 필드는 null이나 기본값으로 남아요. 에러가 발생하지 않아서 조용히 데이터가 누락돼요.',
    },
  },
  {
    id: 'db-dynamic-if',
    lang: 'java',
    title: 'MyBatis 동적 SQL - 조건 조합',
    file: 'UserMapper.java',
    code: `import java.util.List;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;
import org.apache.ibatis.annotations.SelectProvider;
import org.apache.ibatis.jdbc.SQL;

@Mapper
public interface UserMapper {

  @SelectProvider(type = UserSqlProvider.class, method = "buildSearch")
  List<User> search(@Param("name") String name, @Param("age") Integer age);

  default List<User> searchWithLog(String name, Integer age) {
    System.out.println("[실행] 동적 SQL 검색 — name: " + name + ", age: " + age);
    List<User> result = search(name, age);
    System.out.println("[결과] 검색 결과 수: " + result.size());
    return result;
  }
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
      concept:
        '@SelectProvider는 SQL을 어노테이션에 직접 쓰는 대신, 별도 클래스의 메서드가 SQL 문자열을 동적으로 생성해서 반환하게 해줘요. ' +
        'UserSqlProvider의 SQL 빌더는 MyBatis가 제공하는 도구로, 조건이 있을 때만 WHERE 절을 추가하는 동적 SQL을 안전하게 조립해줘요. ' +
        'name이 null이 아니면 WHERE name = #{name}, age가 null이 아니면 AND age = #{age}가 추가되고, 둘 다 null이면 WHERE 없이 SELECT * FROM users만 나가요. ' +
        '문자열 직접 조립(SELECT * FROM users WHERE 1=1 + if ...)보다 훨씬 안전하고 가독성도 좋아요.',
      terms: [
        { t: '@SelectProvider', d: 'SQL 문자열을 동적으로 생성하는 별도 클래스의 메서드를 지정해요' },
        { t: 'SQL 빌더 ({ {...} })', d: 'MyBatis 제공 도구로 SELECT, FROM, WHERE 등을 메서드 체인으로 안전하게 조립해요' },
        { t: 'AND().WHERE()', d: '이전 절이 있을 때만 AND를 추가하고 WHERE 조건을 붙여요 — 첫 번째 조건이면 WHERE만 나가요' },
        { t: '@Param("name")', d: '파라미터에 이름을 붙여 SQL 빌더 메서드에서 참조할 수 있게 해요' },
      ],
      why:
        '검색 조건이 선택적일 때(null이면 무시) SQL을 안전하게 동적으로 생성하려고 써요. ' +
        '문자열 직접 이어붙이는 방식은 SQL 인젝션 위험도 있고 가독성도 나빠져요.',
      expectedOutput:
        'searchWithLog("kim", null) 호출 시:\n' +
        '[실행] 동적 SQL 검색 — name: kim, age: null\n' +
        '(SQL: SELECT * FROM users WHERE name = ?)\n' +
        '[결과] 검색 결과 수: 2',
      realWorldUsage:
        '실제로 관리자 검색 API에서 이름, 이메일, 상태, 날짜 범위 등 여러 선택 조건을 조합할 때 동적 SQL이 필수예요.',
      pitfall: 'SQL 빌더는 단순 조건 조합에는 좋지만, 복잡한 서브쿼리나 UNION은 표현하기 어려워요. 그런 경우 XML Mapper로 전환하는 게 더 깔끔해요.',
    },
  },
  {
    id: 'db-dynamic-foreach',
    lang: 'java',
    title: 'MyBatis IN 절 동적 SQL',
    file: 'UserMapper.java',
    code: `import java.util.List;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;
import org.apache.ibatis.annotations.SelectProvider;

@Mapper
public interface UserMapper {

  @SelectProvider(type = UserSqlProvider.class, method = "buildFindByIds")
  List<User> findByIds(@Param("ids") List<Long> ids);

  default List<User> findByIdsWithLog(List<Long> ids) {
    System.out.println("[실행] IN 절 조회 — ids: " + ids);
    List<User> result = findByIds(ids);
    System.out.println("[결과] 조회된 사용자 수: " + result.size());
    return result;
  }
}

class UserSqlProvider {

  public String buildFindByIds(@Param("ids") List<Long> ids) {
    StringBuilder sb = new StringBuilder("SELECT * FROM users WHERE id IN (");
    for (int i = 0; i < ids.size(); i++) {
      if (i > 0) sb.append(", ");
      sb.append("#{ids[").append(i).append("]}");
    }
    sb.append(")");
    System.out.println("[실행] 생성된 SQL: " + sb.toString());
    return sb.toString();
  }
}`,
    explain: {
      concept:
        'IN 절에 여러 개의 ID를 동적으로 넣을 때는 XML의 <foreach> 태그에 해당하는 기능을 자바 코드로 직접 구현해야 해요. ' +
        'ids 리스트의 크기만큼 #{ids[0]}, #{ids[1]}, ... 파라미터 자리를 생성해서 SELECT * FROM users WHERE id IN (#{ids[0]}, #{ids[1]}) 같은 SQL을 만들어줘요. ' +
        'MyBatis의 #{ids[i]} 문법은 List의 i번째 원소를 안전하게 PreparedStatement 방식으로 바인딩해요. ' +
        'XML Mapper를 쓰면 <foreach collection="ids" item="id" open="(" separator="," close=")"> #{id} </foreach>로 더 간단하게 표현할 수 있어요.',
      terms: [
        { t: '@SelectProvider', d: '자바 메서드로 동적 SQL을 생성하도록 위임해요' },
        { t: '#{ids[0]}', d: 'List 파라미터 ids의 첫 번째 원소를 안전하게 바인딩해요' },
        { t: 'StringBuilder', d: '문자열을 효율적으로 조립하는 도구예요 — +로 연결하는 것보다 성능이 좋아요' },
        { t: '@Param("ids")', d: '메서드 파라미터에 이름을 붙여 SQL 빌더에서 참조 가능하게 해요' },
      ],
      why:
        '여러 ID를 한 번의 쿼리로 조회하려고 IN 절을 써요. ' +
        'for문으로 findById를 여러 번 호출하면 N번의 쿼리가 나가지만, IN 절은 한 번에 처리돼요.',
      expectedOutput:
        'findByIdsWithLog([1L, 2L, 3L]) 호출 시:\n' +
        '[실행] IN 절 조회 — ids: [1, 2, 3]\n' +
        '[실행] 생성된 SQL: SELECT * FROM users WHERE id IN (#{ids[0]}, #{ids[1]}, #{ids[2]})\n' +
        '[결과] 조회된 사용자 수: 3',
      realWorldUsage:
        '실제로 "선택한 10개 주문의 상태를 일괄 변경"할 때 IN 절이 필수예요. WHERE id IN (?,?,...?)로 한 번에 처리해요.',
      pitfall: 'ids 리스트가 비어 있으면 WHERE id IN ()이 생성돼서 SQL 문법 오류가 나요. 호출 전에 if (ids.isEmpty()) return List.of(); 로 방어해야 해요.',
    },
  },
  {
    id: 'db-pageable',
    lang: 'java',
    title: 'Pageable 페이징',
    file: 'ProductRepository.java',
    code: `import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ProductRepository extends JpaRepository<Product, Long> {

  Page<Product> findByCategory(String category, Pageable pageable);

  default void searchWithLog(String category, Pageable pageable) {
    System.out.println("[실행] 페이징 조회 — category: " + category + ", page: " + pageable.getPageNumber() + ", size: " + pageable.getPageSize());
    Page<Product> page = findByCategory(category, pageable);
    System.out.println("[결과] 현재 페이지 요소 수: " + page.getNumberOfElements() + ", 전체: " + page.getTotalElements());
  }
}`,
    explain: {
      concept:
        'Pageable은 "몇 번째 페이지를, 한 페이지에 몇 개씩 가져올지"를 담는 페이징 요청 객체예요. ' +
        'Page는 조회 결과 + 전체 페이지 수 + 전체 데이터 수 같은 메타 정보를 함께 담아서, 프론트엔드가 페이지네이션 UI를 쉽게 만들 수 있게 해줘요. ' +
        'findByCategory에 Pageable을 추가하기만 하면 Spring Data JPA가 자동으로 LIMIT/OFFSET 쿼리를 추가해줘요. ' +
        'page 번호는 0부터 시작한다는 점이 가장 흔한 실수 포인트예요 — 1페이지가 page=0이에요.',
      terms: [
        { t: 'Pageable', d: '페이지 번호(0부터)와 페이지 크기를 담는 요청 객체예요 — Sort 객체로 정렬 조건도 함께 전달할 수 있어요' },
        { t: 'Page<Product>', d: '페이징 결과를 담는 객체예요 — getContent()로 실제 데이터, getTotalPages()로 전체 페이지 수를 얻어요' },
        { t: 'findByCategory', d: '카테고리별로 상품을 페이징 조회하는 메서드예요' },
        { t: 'getTotalElements()', d: '조건에 맞는 전체 데이터 개수를 반환해요 — UI의 "총 150건" 같은 표시에 써요' },
      ],
      why:
        '대량 데이터를 한 번에 가져오면 메모리가 터질 수 있어서 페이지 단위로 나눠 가져오려고 써요. ' +
        '실무에서는 모든 목록 조회 API에 페이징이 기본으로 들어가요 — "전체 조회" API는 거의 없어요.',
      expectedOutput:
        'searchWithLog("전자제품", PageRequest.of(0, 20)) 호출 시:\n' +
        '[실행] 페이징 조회 — category: 전자제품, page: 0, size: 20\n' +
        '[결과] 현재 페이지 요소 수: 20, 전체: 150',
      realWorldUsage:
        '실제로 쇼핑몰 상품 목록에서 한 페이지에 20개씩 보여주고, "1 2 3 ... 8" 페이지 버튼을 만들 때 Pageable과 Page가 중심이 돼요.',
      pitfall: 'page 번호는 0부터 시작해요. 프론트엔드에서 1페이지를 요청할 때 page=1로 보내면 실제로는 2페이지가 조회돼요.',
    },
  },
];
