import type { Snippet } from '../../types';

export const dataAdvanced: Snippet[] = [
  {
    id: 'data-querydsl-boolean',
    lang: 'java',
    title: 'QueryDSL BooleanBuilder',
    file: 'UserRepositoryImpl.java',
    code: `import com.querydsl.core.BooleanBuilder;
import java.util.List;

public List<UserEntity> search(String name) {
  QUserEntity user = QUserEntity.userEntity;
  BooleanBuilder builder = new BooleanBuilder();
  if (name != null) {
    builder.and(user.name.contains(name));
  }
  System.out.println("[실행] search — name: " + name + ", 조건: " + builder);
  return queryFactory.selectFrom(user).where(builder).fetch();
}`,
    explain: {
      concept:
        'BooleanBuilder는 검색 조건을 "레고 블록 조립"하듯 하나씩 조립해가는 빌더예요. ' +
        '사용자가 이름을 입력하지 않으면 name != null 체크에서 걸러져 조건 자체가 추가되지 않고, 입력했을 때만 contains(name) 조건을 AND로 붙여요. ' +
        '이렇게 동적으로 조건을 쌓아가면 "이름만 검색", "이름+이메일 검색" 같은 다양한 조합을 if문 하나씩 추가하는 것만으로 확장할 수 있어요. ' +
        '실무에서는 QueryDSL을 써서 검색 필터 화면(이름, 상태, 날짜 범위 등 10여 개 조건)을 이 BooleanBuilder 하나로 처리해요.',
      terms: [
        { t: 'QUserEntity', d: 'QueryDSL이 UserEntity로부터 자동 생성한 메타모델 클래스예요. 컴파일 시점에 타입 안전하게 필드에 접근해요' },
        { t: 'BooleanBuilder', d: '복수의 where 조건을 AND/OR로 연결해 하나의 동적 쿼리로 만드는 빌더예요' },
        { t: 'contains(name)', d: "SQL의 LIKE '%name%'에 해당하는 조건이에요. 대소문자 구분은 DB 설정에 따라 달라져요" },
        { t: 'fetch()', d: '쿼리를 실제 DB로 전송하고 결과 리스트를 반환하는 최종 실행 메서드예요' },
        { t: 'queryFactory.selectFrom(user)', d: 'QueryDSL의 쿼리 시작점이에요. selectFrom은 엔티티의 모든 컬럼을 선택해요' },
      ],
      why:
        '검색 조건이 사용자 입력에 따라 매번 달라지는 동적 쿼리를 만들 때, ' +
        '문자열 이어 붙이기(StringBuilder + SQL)보다 안전하고 읽기 쉽게 조립하려고요.',
      expectedOutput:
        '[실행] search — name: kim, 조건: contains(kim)\n' +
        'Hibernate: select ... from users where name like ? escape \'\\\'\n' +
        '(kim을 포함하는 UserEntity 리스트 반환)',
      realWorldUsage:
        '실제 관리자 화면의 "회원 검색" 기능에서 이름·이메일·가입일·상태 등 6가지 필터를 BooleanBuilder로 동적 조립해 구현해요. ' +
        '입력된 필드만 where에 추가되고, 빈 칸은 무시돼요.',
      pitfall:
        'QUserEntity 클래스가 아직 생성되지 않으면 컴파일 에러가 나요. ' +
        'QueryDSL APT가 동작하도록 gradle compileJava를 먼저 실행해 Q클래스를 생성해야 해요.',
    },
  },
  {
    id: 'data-querydsl-qclass',
    lang: 'java',
    title: 'QueryDSL Q클래스 기본 조회',
    file: 'OrderRepositoryImpl.java',
    code: `import java.util.List;

public List<OrderEntity> findAllByStatus(String status) {
  QOrderEntity order = QOrderEntity.orderEntity;
  System.out.println("[실행] findAllByStatus — status: " + status);
  return queryFactory
    .selectFrom(order)
    .where(order.status.eq(status))
    .orderBy(order.createdAt.desc())
    .fetch();
}`,
    explain: {
      concept:
        'Q클래스는 엔티티의 "타입 안전 거울"이에요. QOrderEntity.orderEntity를 통해 실제 엔티티 필드를 마치 자바 필드처럼 접근할 수 있어요. ' +
        '.eq(status)는 SQL의 = 연산자를, .desc()는 ORDER BY 컬럼 DESC를 자바 메서드 체인으로 표현한 거예요. ' +
        '이렇게 하면 "status" 같은 컬럼명을 문자열로 쓰지 않아서, 오타나 컬럼명 변경 시 런타임이 아닌 컴파일 타임에 잡을 수 있어요. ' +
        '실무에서는 JPQL보다 QueryDSL을 선호하는 가장 큰 이유가 바로 이 타입 안전성이에요.',
      terms: [
        { t: 'QOrderEntity.orderEntity', d: 'QueryDSL이 OrderEntity로부터 생성한 Q타입의 기본 인스턴스예요. static import로 더 짧게 쓸 수 있어요' },
        { t: 'selectFrom(order)', d: 'order 테이블에서 모든 컬럼(*)을 조회하는 쿼리 시작점이에요' },
        { t: 'eq(status)', d: 'order.status = ? 와 같은 동등 조건이에요. 인자로 받은 status 값이 자동으로 바인딩돼요' },
        { t: 'desc()', d: '내림차순 정렬이에요. asc()를 쓰면 오름차순으로 바뀌어요' },
        { t: 'createdAt', d: 'OrderEntity의 createdAt 필드를 Q타입으로 접근한 것이에요. 실제 DB 컬럼명이 아니라 엔티티 필드명이 기준이에요' },
      ],
      why:
        'SQL이나 JPQL을 문자열로 쓰는 대신 자바 코드로 쿼리를 작성해 ' +
        '컴파일 시점에 오타·타입 불일치를 모두 감지하려고요.',
      expectedOutput:
        '[실행] findAllByStatus — status: PAID\n' +
        'Hibernate: select ... from orders where status = ? order by created_at desc\n' +
        '(PAID 상태인 주문 리스트가 최신순으로 반환됨)',
      realWorldUsage:
        '실제 주문 관리 페이지에서 "상태 필터 + 최신순 정렬" 콤보 검색은 QueryDSL의 selectFrom+where+orderBy 조합 하나로 처리해요. ' +
        '컬럼명을 오타 내면 IDE가 바로 빨간 줄을 띄워줘서 배포 전에 실수를 발견할 수 있어요.',
      pitfall:
        'Q클래스는 빌드 시 APT(Annotation Processing Tool)가 생성해요. ' +
        '엔티티에 필드를 추가했는데 Q클래스가 갱신되지 않았다면 gradle compileJava를 다시 실행해 Q타입을 재생성하세요.',
    },
  },
  {
    id: 'data-fetch-join',
    lang: 'java',
    title: 'Fetch Join으로 N+1 해결',
    file: 'PostRepositoryImpl.java',
    code: `import java.util.List;

public List<PostEntity> findWithComments() {
  QPostEntity post = QPostEntity.postEntity;
  QCommentEntity comment = QCommentEntity.commentEntity;
  System.out.println("[실행] findWithComments — Fetch Join");
  return queryFactory
    .selectFrom(post)
    .join(post.comments, comment).fetchJoin()
    .distinct()
    .fetch();
}`,
    explain: {
      concept:
        'Fetch Join은 "게시글과 그 댓글을 한 번의 쿼리로 동시에 가져오는" 최적화 기법이에요. ' +
        'fetchJoin()을 안 쓰면 게시글 100개를 가져온 뒤 각 게시글마다 댓글을 또 쿼리로 조회해 총 101번의 쿼리가 발생하는 N+1 문제가 생겨요. ' +
        'fetchJoin()을 붙이면 JOIN FETCH SQL이 생성되어 게시글+댓글을 단 한 번의 쿼리로 모두 가져와요. ' +
        'distinct()는 JOIN으로 인해 게시글 행이 댓글 수만큼 중복 생성되는 것을 제거해줘요.',
      terms: [
        { t: 'join(post.comments, comment)', d: '게시글과 댓글을 연관관계 필드(comments)로 INNER JOIN해요' },
        { t: 'fetchJoin()', d: 'join한 연관 엔티티(댓글)까지 한 번에 영속화해 N+1 쿼리를 1회로 줄여요' },
        { t: 'distinct()', d: 'JOIN으로 인한 중복 행을 제거해 게시글 한 건씩만 반환해요' },
        { t: 'N+1', d: '부모 1번 쿼리 + 자식 N번 쿼리 = 총 N+1회 쿼리가 발생하는 성능 저하 현상이에요' },
        { t: 'QCommentEntity', d: 'CommentEntity의 Q타입이에요. join의 두 번째 인자로 별칭을 선언하는 용도로 써요' },
      ],
      why:
        '여러 개의 부모-자식 관계를 한 번에 로딩해 ' +
        'DB 통신 횟수를 1/N으로 줄이고 응답 속도를 획기적으로 개선하려고요.',
      expectedOutput:
        '[실행] findWithComments — Fetch Join\n' +
        'Hibernate: select ... from post join fetch post.comments\n' +
        '(PostEntity 리스트 반환, 각 Post의 comments 필드에 댓글 목록 이미 로딩됨)',
      realWorldUsage:
        '실제 게시판 목록 화면에서 "게시글 + 댓글 수"를 보여줄 때 fetchJoin()으로 게시글과 댓글을 한 번에 가져와 지연 로딩 쿼리 폭발을 막아요. ' +
        '댓글 수만 필요하면 fetchJoin 대신 @Formula나 count 쿼리를 따로 쓰는 게 더 효율적이에요.',
      pitfall:
        'Fetch Join에 페이징을 함께 쓰면 Hibernate가 메모리에서 페이징을 처리해 경고가 발생해요. ' +
        'OneToMany 관계에서 페이징이 필요하면 @BatchSize나 별도의 count 쿼리로 우회하세요.',
    },
  },
  {
    id: 'data-n-plus-one',
    lang: 'java',
    title: 'N+1 발생 코드 (LAZY)',
    file: 'MemberService.java',
    code: `import jakarta.persistence.EntityManager;
import java.util.List;

public class MemberService {

  private final EntityManager em;

  public MemberService(EntityManager em) {
    this.em = em;
  }

  public void printTeams(Long memberId) {
    MemberEntity m = em.find(MemberEntity.class, memberId);
    System.out.println("[실행] printTeams — memberId: " + memberId + ", name: " + m.getName());
    for (TeamEntity t : m.getTeams()) {
      System.out.println("[쿼리] getTeams() → " + t.getName());
    }
  }
}`,
    explain: {
      concept:
        '지연 로딩(LAZY)은 팀 정보를 "진짜 대신 가짜(프록시)"로 채워두고, getTeams()를 실제 호출하는 순간에야 DB에 쿼리를 보내요. ' +
        '문제는 for 루프 안에서 getTeams()를 호출하면 속한 팀이 5개면 5번의 추가 쿼리가 발생해요. 이게 바로 유명한 N+1 문제예요. ' +
        '의도는 처음 로딩을 가볍게 만들려는 건데, 루프와 만나면 오히려 쿼리 폭발로 성능이 급격히 나빠져요. ' +
        '실무에서 "API 응답이 느려요" 이슈를 분석해보면 대부분 이 N+1이 원인이에요.',
      terms: [
        { t: 'em.find(MemberEntity.class, memberId)', d: 'EntityManager로 멤버 한 건을 DB에서 조회해요. LAZY 연관관계는 프록시로 남아요' },
        { t: 'getTeams()', d: '프록시였던 컬렉션에 처음 접근하는 순간 DB에 쿼리가 나가 실제 팀 목록을 가져와요' },
        { t: 'LAZY', d: '연관된 엔티티를 DB에서 바로 로딩하지 않고, 실제 접근할 때까지 미루는 로딩 전략이에요' },
        { t: '프록시', d: '실제 엔티티 대신 자리를 차지하는 가짜 객체예요. 필드에 접근하는 순간 프록시가 DB에 쿼리를 보내 실제 값을 채워요' },
        { t: 'N+1', d: '부모 엔티티 1개 조회 후, 자식 엔티티 N개를 각각 별도 쿼리로 가져와 총 N+1회 쿼리가 발생하는 현상이에요' },
      ],
      why:
        'LAZY 로딩 자체는 초기 로딩을 가볍게 해주는 좋은 전략이지만, ' +
        '루프 안에서 컬렉션에 접근할 때 발생하는 N+1을 반드시 인지하고 회피하려고요.',
      expectedOutput:
        '[실행] printTeams — memberId: 1, name: Alice\n' +
        'Hibernate: select ... from member where id=?\n' +
        '[쿼리] getTeams() → TeamA\n' +
        'Hibernate: select ... from team where member_id=?\n' +
        '[쿼리] getTeams() → TeamB\n' +
        'Hibernate: select ... from team where member_id=?',
      realWorldUsage:
        '실제 "회원 상세 + 소속 팀 목록" API를 처음 구현할 때 LAZY 로딩만 믿고 개발했다가, ' +
        'QA에서 "회원 1000명 목록 조회 API가 30초나 걸려요"라는 버그 리포트로 이어지는 패턴이 흔해요.',
      pitfall:
        '반복문 내에서 프록시 컬렉션에 접근할 때마다 쿼리가 나가는 걸 모르고 성능 테스트를 건너뛰면, ' +
        '운영 배포 첫날 DB 커넥션 풀이 고갈돼 서비스 전체가 다운될 수 있어요. 해결은 fetch join이나 @EntityGraph로.',
    },
  },
  {
    id: 'data-pageable',
    lang: 'java',
    title: 'Pageable 페이징',
    file: 'ProductService.java',
    code: `import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;

public class ProductService {

  private final ProductRepository productRepository;

  public ProductService(ProductRepository productRepository) {
    this.productRepository = productRepository;
  }

  public Page<ProductEntity> list(int page, int size) {
    Pageable pageable = PageRequest.of(page, size, Sort.by("price").ascending());
    System.out.println("[실행] list — page: " + page + ", size: " + size + ", sort: price ASC");
    return productRepository.findAll(pageable);
  }
}`,
    explain: {
      concept:
        'Pageable은 "책을 페이지별로 잘라 읽는" 방식으로 대량 데이터를 소량씩 나누어 조회하는 도구예요. ' +
        'PageRequest.of(페이지번호, 크기, 정렬) 한 줄로 DB에 LIMIT-OFFSET 쿼리를 자동 생성하고, ' +
        '반환값인 Page<ProductEntity>는 실제 상품 목록 외에도 전체 페이지 수, 현재 페이지, 첫/마지막 페이지 여부 같은 페이지 정보를 함께 담아줘요. ' +
        '실무에서는 모든 목록 조회 API에 페이징을 기본 적용해, 한 번에 수만 건을 응답하는 참사를 방지해요.',
      terms: [
        { t: 'PageRequest.of(page, size, Sort.by("price").ascending())', d: 'page 번호와 size 크기, 정렬 기준을 담은 Pageable 객체를 생성해요' },
        { t: 'Sort.by("price").ascending()', d: 'price 컬럼 기준으로 오름차순 정렬을 지정해요' },
        { t: 'Page<ProductEntity>', d: '조회 결과와 페이지 메타데이터(총 페이지 수, 현재 페이지 등)를 함께 담는 래퍼예요' },
        { t: 'findAll(pageable)', d: 'Spring Data JPA가 Pageable을 보고 LIMIT-OFFSET 쿼리와 count 쿼리를 자동으로 2회 실행해요' },
        { t: 'page', d: '0부터 시작하는 페이지 번호예요. 0이 첫 페이지, 1이 두 번째 페이지를 뜻해요' },
      ],
      why:
        '대량 데이터를 브라우저에 한 번에 보내지 않고 조금씩 잘라서 전송해 ' +
        '메모리 사용량과 네트워크 전송 시간을 제어하려고요.',
      expectedOutput:
        '[실행] list — page: 0, size: 10, sort: price ASC\n' +
        'Hibernate: select ... from product order by price asc limit 10 offset 0\n' +
        'Hibernate: select count(*) from product\n' +
        'Page<ProductEntity>(content=10건, totalElements=42, totalPages=5)',
      realWorldUsage:
        '실제 쇼핑몰 "상품 목록" 화면에서 10개씩 보여주고 "1 2 3 ... 5" 페이지네이션을 그리는 게 이 Pageable 하나로 동작해요. ' +
        'page 파라미터는 보통 Controller에서 @PageableDefault로 기본값을 0, size=20 정도로 설정해요.',
      pitfall:
        'page는 0부터 시작해요. 프론트엔드에서 "1페이지=0" 매핑을 모르면 데이터가 한 페이지씩 밀려서 보일 수 있어요. ' +
        'Spring Data WebSupport의 one-indexed-parameters 설정으로 1부터 시작하게 바꿀 수도 있어요.',
    },
  },
  {
    id: 'data-pageable-sort',
    lang: 'java',
    title: 'Pageable 다중 정렬',
    file: 'OrderService.java',
    code: `import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;

public class OrderService {

  private final OrderRepository orderRepository;

  public OrderService(OrderRepository orderRepository) {
    this.orderRepository = orderRepository;
  }

  public Page<OrderEntity> recent(int page) {
    Sort sort = Sort.by(
      Sort.Order.desc("priority"),
      Sort.Order.asc("createdAt")
    );
    System.out.println("[실행] recent — page: " + page + ", sort: priority DESC, createdAt ASC");
    return orderRepository.findAll(PageRequest.of(page, 20, sort));
  }
}`,
    explain: {
      concept:
        '다중 정렬(Multi-Sort)은 "우선순위 내림차순으로 먼저 정렬하고, 우선순위가 같으면 생성일 오름차순으로 다시 정렬"하는 2단계 정렬이에요. ' +
        'Sort.Order.desc("priority")가 1차 정렬 키, Sort.Order.asc("createdAt")가 2차 정렬 키가 돼요. ' +
        '실무에서는 "중요 공지가 먼저 보이고, 같은 중요도 내에서는 최신순" 같은 UI 요구사항을 Order 조합으로 깔끔하게 처리해요.',
      terms: [
        { t: 'Sort.by(Order.desc("priority"), Order.asc("createdAt"))', d: '여러 정렬 기준을 쉼표로 나열한 복합 정렬 객체예요' },
        { t: 'Sort.Order.desc("priority")', d: 'priority 컬럼 내림차순이에요. 높은 우선순위(숫자가 큰)가 먼저 나와요' },
        { t: 'Sort.Order.asc("createdAt")', d: 'createdAt 컬럼 오름차순이에요. 가장 오래된 게 먼저 나와요' },
        { t: 'PageRequest.of(page, 20, sort)', d: '20건씩 페이징하면서 위의 복합 정렬을 적용해 쿼리를 생성해요' },
        { t: 'findAll(Pageable)', d: 'Spring Data가 ORDER BY priority DESC, created_at ASC LIMIT 20 쿼리를 자동 생성해요' },
      ],
      why:
        'UI에서 "정렬 기준을 여러 개 동시에 적용"해야 할 때, 단일 ORDER BY로는 표현할 수 없는 복합 정렬을 간결하게 만들려고요.',
      expectedOutput:
        '[실행] recent — page: 0, sort: priority DESC, createdAt ASC\n' +
        'Hibernate: select ... from orders order by priority desc, created_at asc limit 20 offset 0',
      realWorldUsage:
        '실제 대시보드 화면에서 "에러 로그는 심각도 내림차순, 같은 심각도면 발생 시간 오름차순" 정렬이 필요할 때 ' +
        'Sort.Order 2개를 조합해 한 줄로 요구사항을 충족해요.',
      pitfall:
        '정렬 컬럼이 DB 인덱스에 없으면 매 조회마다 전체 파일 정렬(filesort)이 발생해 페이지가 느려져요. ' +
        '자주 쓰는 복합 정렬 컬럼 조합은 DB 인덱스(priority, created_at)로 미리 생성해두세요.',
    },
  },
  {
    id: 'data-slice-cursor',
    lang: 'java',
    title: 'Slice (커서 페이징)',
    file: 'FeedService.java',
    code: `import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Slice;
import org.springframework.data.domain.SliceImpl;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
@RequiredArgsConstructor
public class FeedService {

  private final FeedRepository feedRepository;

  public Slice<FeedEntity> olderThan(Long lastId, int size) {
    Pageable pageable = PageRequest.of(0, size + 1);
    List<FeedEntity> rows =
        feedRepository.findByIdLessThanOrderByIdDesc(lastId, pageable);
    boolean hasNext = rows.size() > size;
    if (hasNext) {
      rows.remove(size);
    }
    System.out.println("[실행] olderThan — lastId: " + lastId + ", size: " + size + ", hasNext: " + hasNext);
    return new SliceImpl<>(rows, pageable, hasNext);
  }
}`,
    explain: {
      concept:
        'Slice는 "다음 페이지가 있나요?"만 알려주는 가벼운 커서 기반 페이징이에요. ' +
        'lastId(마지막으로 본 게시물 ID)를 기준으로 그보다 작은 ID를 가진 이전 데이터만 조회하는 방식이라, 중간에 새 데이터가 추가돼도 페이지가 밀리지 않아요. ' +
        'size + 1개를 가져와서 초과분 1개로 hasNext(다음 존재 여부)를 판단하는 게 핵심 아이디어예요. ' +
        '실무에서는 인스타그램·트위터 같은 무한 스크롤 피드에 이 커서 페이징이 거의 표준이에요.',
      terms: [
        { t: 'Slice<FeedEntity>', d: '콘텐츠 리스트와 hasNext(다음 페이지 존재 여부)만 담는 경량 페이징 결과예요. totalPages는 몰라요' },
        { t: 'findByIdLessThanOrderByIdDesc(lastId, pageable)', d: 'lastId보다 작은 ID 중 최신순으로 size+1개를 조회하는 커서 쿼리예요' },
        { t: 'size + 1', d: '의도보다 1개 더 가져와서 다음 데이터 존재 여부를 판단하는 기법이에요' },
        { t: 'SliceImpl', d: '콘텐츠, Pageable, hasNext를 받아 Slice 구현체를 만드는 생성자예요' },
        { t: 'remove(size)', d: 'N+1번째 초과분을 제거해 요청한 size만큼만 응답에 담아요' },
      ],
      why:
        'count(*) 쿼리를 없애 DB 부하를 줄이고, 무한 스크롤 UI에 최적화된 연속적 데이터 로딩을 하려고요.',
      expectedOutput:
        '[실행] olderThan — lastId: 100, size: 10, hasNext: true\n' +
        'Hibernate: select ... from feed where id < 100 order by id desc limit 11\n' +
        '(FeedEntity 10개 + hasNext=true인 Slice 반환)',
      realWorldUsage:
        '실제 SNS 앱의 "뉴스피드"에서 사용자가 스크롤을 맨 아래까지 내리면, 마지막 게시글 ID로 olderThan을 호출해 ' +
        '다음 10개를 추가로 불러와 무한 스크롤을 구현해요. 페이지네이션 숫자 버튼은 아예 없어요.',
      pitfall:
        'Page와 다르게 Slice는 전체 페이지 수(totalPages)와 전체 데이터 수(totalElements)를 알 수 없어요. ' +
        'UI에서 "1/10 페이지" 같은 표시가 필요하면 Slice로는 구현할 수 없고 Page를 써야 해요.',
    },
  },
  {
    id: 'data-querydsl-projection',
    lang: 'java',
    title: 'QueryDSL DTO 프로젝션',
    file: 'UserRepositoryImpl.java',
    code: `import com.querydsl.core.types.Projections;
import java.util.List;

public List<UserSummary> summaries() {
  QUserEntity user = QUserEntity.userEntity;
  System.out.println("[실행] summaries — id, name 프로젝션");
  return queryFactory
    .select(Projections.constructor(UserSummary.class, user.id, user.name))
    .from(user)
    .fetch();
}`,
    explain: {
      concept:
        'Projections.constructor는 "전체 엔티티 대신 필요한 컬럼만 골라서 DTO에 곧바로 담는" 최적화 기법이에요. ' +
        '모든 컬럼(*)을 조회하지 않고 id, name 두 컬럼만 select하면 네트워크 전송량이 줄고, 엔티티를 영속성 컨텍스트가 관리하지도 않아 메모리가 가벼워요. ' +
        'UserSummary DTO에 id, name 순서와 타입이 정확히 일치하는 생성자가 있어야 값이 올바르게 매핑돼요. ' +
        '실무에서는 대시보드·통계·목록 조회 같이 엔티티 전체가 필요 없는 읽기 전용 API에 프로젝션을 적극 써요.',
      terms: [
        { t: 'Projections.constructor', d: 'DTO의 생성자를 호출해 결과를 매핑하는 프로젝션 방식이에요. 생성자 파라미터 순서가 컬럼 순서와 일치해야 해요' },
        { t: 'UserSummary.class', d: '매핑 대상 DTO 클래스예요. 엔티티가 아니라 일반 POJO여도 괜찮아요' },
        { t: 'user.id, user.name', d: 'select할 컬럼들을 지정해요. Q타입으로 접근해 타입 안전하게 컬럼을 선택할 수 있어요' },
        { t: '.select(...).from(user)', d: 'from에 비해 select는 원하는 컬럼만 골라 쿼리를 만들어요' },
        { t: 'DTO', d: 'Data Transfer Object. 엔티티와 달리 영속성 컨텍스트 관리 대상이 아니에요' },
      ],
      why:
        '전체 엔티티 대신 필요한 컬럼만 조회해 네트워크·메모리·DB 부하를 한 번에 줄이려고요.',
      expectedOutput:
        '[실행] summaries — id, name 프로젝션\n' +
        'Hibernate: select id, name from users\n' +
        '(UserSummary(id=1, name="Alice"), UserSummary(id=2, name="Bob"), ...)',
      realWorldUsage:
        '실제 "회원 드롭다운(이름+ID만 필요)" API에서 전체 UserEntity 30개 컬럼을 다 조회하지 않고 ' +
        'id와 name 두 컬럼만 골라 DTO로 반환해 응답 크기를 1/10으로 줄여요.',
      pitfall:
        'DTO 생성자의 파라미터 순서와 Projections.constructor에 나열한 컬럼 순서가 다르면 ' +
        '컴파일은 성공하는데 name 필드에 id가 들어가는 식으로 값이 뒤바뀌어요. 순서를 반드시 확인하세요.',
    },
  },
  {
    id: 'data-querydsl-subquery',
    lang: 'java',
    title: 'QueryDSL 서브쿼리',
    file: 'OrderRepositoryImpl.java',
    code: `import com.querydsl.jpa.JPAExpressions;
import java.util.List;

public List<OrderEntity> expensiveOrders() {
  QOrderEntity order = QOrderEntity.orderEntity;
  QOrderEntity orderSub = new QOrderEntity("orderSub");
  System.out.println("[실행] expensiveOrders — 평균보다 높은 금액");
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
      concept:
        '서브쿼리는 "쿼리 안에 들어 있는 작은 쿼리"예요. 전체 주문의 평균 금액을 먼저 계산(avg)하고, 그 평균보다 높은(gt) 주문만 바깥 쿼리로 걸러내요. ' +
        'JPAExpressions는 QueryDSL에서 서브쿼리를 시작하는 진입점이에요. ' +
        '여기서 중요한 점은 외부 쿼리의 order와 서브쿼리의 orderSub를 별도 Q객체로 분리한 건데, 같은 Q객체를 재사용하면 일부 JPA 구현체에서 별칭 충돌이 날 수 있어요.',
      terms: [
        { t: 'JPAExpressions', d: '서브쿼리를 작성할 때 사용하는 QueryDSL의 유틸리티 클래스예요' },
        { t: 'new QOrderEntity("orderSub")', d: '서브쿼리용 별칭(orderSub)을 가진 독립적인 Q객체를 생성해요. 외부 쿼리와 충돌을 막아요' },
        { t: 'gt(...)', d: 'greater than (>). 왼쪽 값이 오른쪽 값보다 클 때 참이에요' },
        { t: 'avg()', d: '평균을 계산하는 집계 함수예요. orderSub.amount.avg()는 전체 주문 금액의 평균을 구해요' },
        { t: 'orderSub', d: '서브쿼리 전용 Q객체예요. 외부 쿼리의 order와 이름만 다를 뿐 같은 테이블을 가리켜요' },
      ],
      why:
        '비교 기준(전체 평균)을 한 번의 DB 왕복으로 계산해서, ' +
        '"평균 조회 API → 평균값으로 다시 필터 API"라는 두 번의 왕복을 없애려고요.',
      expectedOutput:
        '[실행] expensiveOrders — 평균보다 높은 금액\n' +
        'Hibernate: select ... from orders where amount > (select avg(amount) from orders)\n' +
        '(전체 평균보다 금액이 높은 OrderEntity 리스트 반환)',
      realWorldUsage:
        '실제 "상위 10% 고객", "평균보다 높은 매출 상품" 같은 분석 쿼리에 서브쿼리가 자주 등장해요. ' +
        '한 번의 쿼리로 비교군과 대상을 동시에 집계해서 서버 메모리에서 재가공할 필요가 없어요.',
      pitfall:
        '외부 쿼리와 서브쿼리에 같은 QUserEntity.userEntity 인스턴스를 공유하면 ' +
        'SQL 별칭 충돌로 "duplicate alias" 오류가 발생할 수 있어요. 서브쿼리용 Q객체는 항상 별도로 new로 생성하세요.',
    },
  },
  {
    id: 'data-querydsl-aggregate',
    lang: 'java',
    title: 'QueryDSL 그룹 집계',
    file: 'SalesRepositoryImpl.java',
    code: `import com.querydsl.core.Tuple;
import java.util.List;

public List<Tuple> salesByCategory() {
  QSalesEntity s = QSalesEntity.salesEntity;
  System.out.println("[실행] salesByCategory — 카테고리별 집계");
  return queryFactory
    .select(s.category, s.amount.sum(), s.count())
    .from(s)
    .groupBy(s.category)
    .fetch();
}`,
    explain: {
      concept:
        'groupBy는 "같은 카테고리끼리 모아서 통계를 내는" SQL GROUP BY의 QueryDSL 버전이에요. ' +
        's.amount.sum()은 각 카테고리 그룹 내 매출 합계, s.count()는 해당 그룹의 데이터 건수를 계산해요. ' +
        '결과는 Tuple에 담기는데, Tuple은 컬럼명이 아닌 인덱스(0=카테고리, 1=합계, 2=건수)로 접근하는 가벼운 행이에요. ' +
        '실무에서는 이 패턴을 카테고리별·월별·고객등급별 통계 대시보드 API에 광범위하게 써요.',
      terms: [
        { t: 's.amount.sum()', d: '그룹 내 모든 amount 값을 더한 합계를 구하는 집계 함수예요' },
        { t: 's.count()', d: '그룹에 속한 행의 개수를 세는 집계 함수예요. DB의 COUNT(*)와 같아요' },
        { t: 'groupBy(s.category)', d: 'category 값이 같은 행끼리 그룹으로 묶어 집계 함수를 적용해요' },
        { t: 'Tuple', d: '여러 타입의 컬럼 값을 인덱스로 접근하는 가벼운 결과 객체예요. DTO 프로젝션으로 대체하기도 해요' },
        { t: 'select(s.category, s.amount.sum(), s.count())', d: '그룹 기준 컬럼과 집계 결과를 함께 select해요' },
      ],
      why:
        '카테고리별 매출 합계·주문 건수 같은 통계를 ' +
        'DB에서 바로 집계해 애플리케이션에서 재계산하는 비용을 없애려고요.',
      expectedOutput:
        '[실행] salesByCategory — 카테고리별 집계\n' +
        'Hibernate: select category, sum(amount), count(*) from sales group by category\n' +
        'Tuple([전자기기, 5000000, 12]), Tuple([도서, 1200000, 45])',
      realWorldUsage:
        '실제 이커머스 관리자 대시보드의 "카테고리별 매출 현황" 차트 데이터는 이 groupBy 쿼리 하나로 실시간 집계돼요. ' +
        '일별·주별로도 groupBy 키만 바꿔서 재사용할 수 있어요.',
      pitfall:
        'select 절에 포함된 컬럼 중 groupBy에 없는 컬럼은 반드시 집계 함수(sum, count, avg 등)로 감싸야 해요. ' +
        "안 그러면 SQL 표준 위반으로 MySQL에서는 임의 값이, PostgreSQL에선 에러가 나요.",
    },
  },
  {
    id: 'data-querydsl-order',
    lang: 'java',
    title: 'QueryDSL 동적 정렬 (OrderSpecifier)',
    file: 'UserRepositoryImpl.java',
    code: `import com.querydsl.core.types.OrderSpecifier;
import java.util.List;

public List<UserEntity> sorted(boolean asc) {
  QUserEntity user = QUserEntity.userEntity;
  OrderSpecifier<String> spec = asc
    ? user.name.asc()
    : user.name.desc();
  System.out.println("[실행] sorted — asc: " + asc);
  return queryFactory.selectFrom(user).orderBy(spec).fetch();
}`,
    explain: {
      concept:
        'OrderSpecifier는 "정렬 토글 스위치"를 코드로 표현하는 타입 안전 객체예요. ' +
        '사용자가 "오름차순" 버튼을 누르면 user.name.asc()가, "내림차순"을 누르면 user.name.desc()가 OrderSpecifier로 만들어져요. ' +
        '삼항 연산자 ? :로 한 줄에 정렬 방향을 분기하면서도 컴파일러가 타입을 검증해줘요. ' +
        '실무에서는 여러 컬럼을 Map<String, OrderSpecifier>에 매핑해두고 사용자가 클릭한 컬럼에 따라 동적으로 정렬을 바꿔요.',
      terms: [
        { t: 'OrderSpecifier<String>', d: '정렬 조건(컬럼 + 방향)을 담는 QueryDSL 타입이에요. 제네릭 String은 name 컬럼의 타입이에요' },
        { t: 'user.name.asc()', d: 'name 컬럼 오름차순 정렬을 나타내는 OrderSpecifier를 반환해요' },
        { t: 'user.name.desc()', d: 'name 컬럼 내림차순 정렬을 나타내는 OrderSpecifier를 반환해요' },
        { t: 'orderBy(spec)', d: '만들어진 OrderSpecifier를 쿼리에 적용해 ORDER BY 절을 생성해요' },
        { t: 'asc ? ... : ...', d: 'boolean 값에 따라 동적으로 정렬 방향을 선택하는 삼항 연산자예요' },
      ],
      why:
        '사용자가 정렬 방향을 토글할 때마다 별도의 쿼리 메서드를 만들지 않고, ' +
        '하나의 쿼리 코드로 오름차순·내림차순을 동적으로 전환하려고요.',
      expectedOutput:
        '[실행] sorted — asc: true\n' +
        'Hibernate: select ... from users order by name asc\n' +
        '[실행] sorted — asc: false\n' +
        'Hibernate: select ... from users order by name desc',
      realWorldUsage:
        '실제 게시판 목록에서 "제목순↑/↓", "날짜순↑/↓" 토글 컬럼 헤더를 클릭할 때, ' +
        '클라이언트가 보낸 sort=name,asc 파라미터를 OrderSpecifier로 변환해 쿼리에 적용해요.',
      pitfall:
        '정렬 컬럼 자체를 동적으로 바꾸고 싶다면 OrderSpecifier만으로는 부족해요. ' +
        '문자열 컬럼명을 그대로 QueryDSL에 넘기면 타입 안전성이 깨져요. 대신 Map<String, OrderSpecifier>로 Q필드를 매핑해두고 선택하세요.',
    },
  },
  {
    id: 'data-hikari-config',
    lang: 'java',
    title: 'HikariCP 설정 (application.properties)',
    file: 'application.properties',
    code: `spring.datasource.hikari.maximum-pool-size=20
spring.datasource.hikari.minimum-idle=10
spring.datasource.hikari.connection-timeout=30000
spring.datasource.hikari.idle-timeout=600000
spring.datasource.hikari.max-lifetime=1800000`,
    explain: {
      concept:
        'HikariCP는 스프링 부트가 기본으로 사용하는 "데이터베이스 커넥션 수영장"이에요. ' +
        '미리 커넥션을 만들어두고(최대 20개) 필요할 때 빌려주고, 다 쓰면 반납하는 구조로 동작해요. ' +
        'connection-timeout 30초는 풀이 비어있을 때 최대 30초까지 대기한다는 뜻이고, max-lifetime 30분은 한 커넥션이 아무리 오래 살아도 30분 후엔 폐기하고 새로 만든다는 뜻이에요. ' +
        '실무에서는 maximum-pool-size를 DB가 허용하는 최대 연결 수의 60~70% 정도로 설정해 안전 마진을 남겨요.',
      terms: [
        { t: 'maximum-pool-size=20', d: '동시에 유지할 수 있는 최대 커넥션 수예요. 이보다 많은 요청은 connection-timeout까지 대기해요' },
        { t: 'minimum-idle=10', d: '사용되지 않아도 풀에 최소 10개는 상시 대기 상태로 유지해요' },
        { t: 'connection-timeout=30000', d: '풀이 가득 찼을 때 새 커넥션을 기다리는 최대 시간(ms)이에요. 30초 초과 시 예외 발생해요' },
        { t: 'idle-timeout=600000', d: '사용되지 않고 10분간 놀고 있는 커넥션을 정리해요. minimum-idle보다 적게는 안 줄여요' },
        { t: 'max-lifetime=1800000', d: '커넥션 한 개의 최대 수명이 30분이에요. DB의 wait_timeout보다 짧게 잡아야 해요' },
      ],
      why:
        '매 요청마다 DB 커넥션을 TCP 핸드셰이크부터 맺는 비용을 없애고, ' +
        '미리 생성된 커넥션을 재사용해 API 응답 속도를 획기적으로 높이려고요.',
      expectedOutput:
        '앱 시작 로그:\n' +
        'HikariPool-1 - Starting...\n' +
        'HikariPool-1 - Start completed. (pool size: 10)',
      realWorldUsage:
        '실제 스프링 부트 앱에서 커넥션 풀 설정이 잘못돼 maximum-pool-size가 기본값 10인 채로 ' +
        '동시 접속자 200명을 받으면 190명이 connection-timeout 시간 동안 대기하다 ConnectionTimeoutException이 쏟아져요.',
      pitfall:
        'maximum-pool-size를 DB max_connections보다 크게 잡으면 앱이 DB 연결을 독점해 다른 앱이 DB에 접속하지 못하는 "연결 고갈" 현상이 발생해요. ' +
        '항상 DB 한계의 60~70% 이하로 설정하세요.',
    },
  },
  {
    id: 'data-hikari-bean',
    lang: 'java',
    title: 'HikariCP 커스텀 Bean',
    file: 'DataSourceConfig.java',
    code: `import com.zaxxer.hikari.HikariConfig;
import com.zaxxer.hikari.HikariDataSource;
import javax.sql.DataSource;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class DataSourceConfig {

  @Bean
  public DataSource dataSource() {
    HikariConfig cfg = new HikariConfig();
    cfg.setJdbcUrl("jdbc:postgresql://localhost:5432/shop");
    cfg.setUsername("postgres");
    cfg.setPassword("postgres");
    cfg.setMaximumPoolSize(20);
    cfg.setPoolName("shop-pool");
    System.out.println("[생성] HikariCP 풀 생성 — poolName: shop-pool, maxSize: 20");
    return new HikariDataSource(cfg);
  }
}`,
    explain: {
      concept:
        'HikariConfig는 수영장의 "설계도"고, HikariDataSource는 그 설계도로 만든 "실제 수영장"이에요. ' +
        '@Configuration + @Bean 조합으로 스프링 컨테이너에 DataSource를 직접 등록하면, application.properties로는 표현하기 어려운 복잡한 설정(프로그래밍 방식의 조건 분기, 여러 DB 설정 등)을 자바 코드로 자유롭게 구성할 수 있어요. ' +
        'poolName은 로그와 JMX 모니터링에서 이 풀을 식별하는 이름표예요. ' +
        '실무에서는 Master/Slave DB 분기, 읽기 전용 DataSource와 쓰기 전용 DataSource를 분리할 때 @Bean으로 각각 생성해요.',
      terms: [
        { t: '@Configuration', d: '이 클래스가 스프링 설정 클래스임을 나타내요. 내부의 @Bean 메서드들이 스프링 컨테이너에 등록돼요' },
        { t: '@Bean', d: '이 메서드가 반환하는 객체를 스프링이 관리하는 빈으로 등록해요. 다른 곳에서 @Autowired로 주입받을 수 있어요' },
        { t: 'HikariConfig', d: 'HikariCP 풀의 모든 설정값을 담는 설정 객체예요. setter로 값을 하나씩 채워가요' },
        { t: 'setJdbcUrl(...)', d: 'DB 접속 URL이에요. jdbc:postgresql://호스트:포트/DB명 형식으로 써요' },
        { t: 'HikariDataSource', d: 'HikariConfig 설정으로 실제 커넥션 풀을 초기화하고 관리하는 핵심 객체예요' },
      ],
      why:
        'application.properties에서 표현하기 어려운 고급 설정(DB 읽기/쓰기 분리, SSL 인증서 경로, 조건 분기)을 ' +
        '자바 코드로 정밀하게 제어하려고요.',
      expectedOutput:
        '[생성] HikariCP 풀 생성 — poolName: shop-pool, maxSize: 20\n' +
        'HikariPool-shop-pool - Starting...\n' +
        'HikariPool-shop-pool - Start completed.',
      realWorldUsage:
        '실제 프로젝트에서 AWS RDS Writer/Reader 분기를 위해 @Primary DataSource(쓰기)와 @Qualifier DataSource(읽기)를 ' +
        '각각 다른 HikariConfig로 생성해 주입받는 패턴이 흔해요.',
      pitfall:
        '비밀번호를 코드에 하드코딩하지 말아야 해요. ' +
        '@Value("${db.password}")나 환경변수로 주입하고, application.yml에도 평문 대신 ${DB_PASSWORD} 같은 플레이스홀더를 쓰세요.',
    },
  },
  {
    id: 'data-flyway-sql',
    lang: 'java',
    title: 'Flyway SQL 마이그레이션',
    file: 'V1__create_user.sql',
    code: `CREATE TABLE users (
  id BIGSERIAL PRIMARY KEY,
  email VARCHAR(255) NOT NULL UNIQUE,
  created_at TIMESTAMP NOT NULL DEFAULT now()
);

CREATE INDEX idx_users_email ON users(email);`,
    explain: {
      concept:
        'Flyway는 "DB 스키마 버전 관리 도구"예요. V1__create_user.sql 같은 파일명 규칙(V{버전}__{설명}.sql)으로 SQL 파일의 실행 순서를 정해요. ' +
        '앱이 시작될 때 Flyway가 이미 실행된 마이그레이션을 추적(schema_history 테이블)하고, 실행되지 않은 새 버전만 순서대로 자동 적용해요. ' +
        'BIGSERIAL은 PostgreSQL에서 자동 증가하는 8바이트 정수를 만드는 데이터 타입이고, PRIMARY KEY로 이 컬럼이 각 행을 고유하게 식별한다고 선언해요.',
      terms: [
        { t: 'V1__create_user.sql', d: '버전 1 마이그레이션 파일이에요. V1이 버전 번호, __ 뒤는 설명이에요' },
        { t: 'BIGSERIAL', d: 'PostgreSQL 전용 자동 증가 정수 타입이에요. MySQL의 AUTO_INCREMENT와 같은 역할이에요' },
        { t: 'PRIMARY KEY', d: '테이블의 각 행을 고유하게 식별하는 키예요. NULL과 중복을 모두 금지해요' },
        { t: 'UNIQUE', d: '이메일 컬럼에 중복된 값이 들어가는 것을 DB 레벨에서 차단하는 제약이에요' },
        { t: 'CREATE INDEX idx_users_email', d: 'email 컬럼으로 빠르게 검색하기 위한 B-Tree 인덱스를 생성해요' },
      ],
      why:
        'DB 스키마 변경을 사람이 수동으로 하지 않고 버전 관리된 파일로 자동화해, ' +
        '배포 시 "어? 내 로컬에는 users 테이블이 없는데요?" 같은 팀원 간 스키마 불일치를 방지하려고요.',
      expectedOutput:
        '앱 시작 로그:\n' +
        'Flyway: Successfully applied 1 migration(s)\n' +
        '(schema_history 테이블에 V1__create_user.sql 실행 기록 저장)',
      realWorldUsage:
        '실제 배포 파이프라인에서 새 컬럼 추가는 V2__add_phone.sql 같은 새 파일로 추가하고, ' +
        '기존 V1 파일은 절대 수정하지 않아야 롤백도 Flyway undo 기능으로 안전하게 할 수 있어요.',
      pitfall:
        '이미 적용된 V1 마이그레이션 파일을 수정하면 Flyway가 체크섬 불일치 오류를 내고 앱 시작을 거부해요. ' +
        '스키마 변경은 반드시 새 V 파일(예: V2__add_column.sql)로만 추가하세요.',
    },
  },
  {
    id: 'data-flyway-java',
    lang: 'java',
    title: 'Flyway Java 마이그레이션',
    file: 'V2__seed_admin.java',
    code: `import java.sql.PreparedStatement;
import java.sql.SQLException;
import org.flywaydb.core.api.migration.BaseJavaMigration;
import org.flywaydb.core.api.migration.Context;

public class V2__seed_admin extends BaseJavaMigration {

  @Override
  public void migrate(Context context) throws SQLException {
    System.out.println("[실행] V2__seed_admin 마이그레이션 — admin 계정 생성");
    try (PreparedStatement ps = context.getConnection()
        .prepareStatement("INSERT INTO users(email) VALUES(?)")) {
      ps.setString(1, "admin@shop.com");
      ps.executeUpdate();
    }
  }
}`,
    explain: {
      concept:
        'Java 마이그레이션은 SQL 파일로 표현하기 어려운 "프로그래밍적 초기 데이터 셋업"을 자바 코드로 실행하는 방식이에요. ' +
        'BaseJavaMigration을 상속하고 migrate()를 오버라이드하면, 앱 시작 시 Flyway가 이 클래스를 찾아 실행 순서(V2)대로 호출해요. ' +
        'try-with-resources 구문으로 PreparedStatement를 감싸면 블록이 끝날 때 자동으로 close()가 호출돼 리소스 누수를 막아요. ' +
        '실무에서는 외부 API에서 초기 데이터를 받아오거나, CSV 파일을 파싱해 대량 시드 데이터를 넣을 때 Java 마이그레이션을 써요.',
      terms: [
        { t: 'BaseJavaMigration', d: 'Java 마이그레이션의 추상 베이스 클래스예요. migrate()만 구현하면 돼요' },
        { t: 'Context.getConnection()', d: '현재 마이그레이션 실행 시 사용할 DB 연결을 가져와요. Flyway가 트랜잭션도 관리해줘요' },
        { t: 'prepareStatement("...VALUES(?)")', d: '? 자리표시자로 SQL 인젝션을 방지하는 PreparedStatement를 생성해요' },
        { t: 'setString(1, "admin@shop.com")', d: '첫 번째 ? 자리에 문자열 값을 안전하게 바인딩해요' },
        { t: 'try-with-resources', d: 'try() 안에서 생성된 자원을 블록 종료 시 자동으로 close()하는 Java 문법이에요' },
      ],
      why:
        '초기 데이터 셋업에 반복문·조건·외부 API 호출이 필요할 때 SQL만으로는 표현하기 어려워, ' +
        '자바 코드로 자유롭게 마이그레이션 로직을 작성하려고요.',
      expectedOutput:
        '[실행] V2__seed_admin 마이그레이션 — admin 계정 생성\n' +
        'Flyway: Successfully applied 1 migration(s) to schema "public"',
      realWorldUsage:
        '실제 멀티테넌시 SaaS 앱에서 새 테넌트 생성 시, Java 마이그레이션으로 기본 역할·권한·초기 설정을 ' +
        '루프를 돌며 일괄 INSERT 하는 로직을 자주 구현해요.',
      pitfall:
        'DB 커넥션 자체는 Flyway가 관리하므로 직접 닫으면 안 돼요. ' +
        'PreparedStatement만 try-with-resources로 감싸서 자동 close되게 하세요. Connection.close()를 직접 부르면 이후 마이그레이션이 실패해요.',
    },
  },
  {
    id: 'data-liquibase-changelog',
    lang: 'java',
    title: 'Liquibase changelog YAML',
    file: 'db.changelog.yaml',
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
      concept:
        'Liquibase는 Flyway와 비슷한 DB 마이그레이션 도구지만, SQL 대신 YAML/XML/JSON 형식의 "선언적" 문법을 써요. ' +
        'changeSet은 하나의 변경 단위로, id와 author가 합쳐져서 고유 식별자가 돼요. 이미 적용된 changeSet은 실행되지 않고 건너뛰어져요. ' +
        'createTable 액션으로 테이블과 컬럼을 선언하고, constraints.primaryKey: true로 기본 키 제약을 설정해요. ' +
        '실무에서는 DBMS 벤더(PostgreSQL, MySQL, Oracle)가 바뀌어도 같은 changelog 파일이 그대로 동작하는 게 Liquibase의 가장 큰 장점이에요.',
      terms: [
        { t: 'databaseChangeLog', d: '모든 changeSet을 담는 루트 문서예요. changeSet들이 순서대로 나열돼요' },
        { t: 'changeSet.id: create-users', d: '이 변경의 고유 식별자예요. 같은 id와 author의 조합은 단 한 번만 실행돼요' },
        { t: 'createTable', d: '새 테이블을 만드는 Liquibase 변경 액션이에요. SQL 없이 선언만으로 DDL을 생성해요' },
        { t: 'column.type: bigint', d: '컬럼의 데이터 타입이에요. Liquibase가 DBMS에 맞춰 적절한 SQL 타입으로 변환해줘요' },
        { t: 'constraints.primaryKey: true', d: '이 컬럼이 기본 키임을 선언해요. NOT NULL + UNIQUE 제약이 자동 추가돼요' },
      ],
      why:
        'DB 종류가 달라져도 같은 스키마 변경 YAML로 DDL을 생성할 수 있어, ' +
        '멀티 DBMS를 지원하는 제품에서 마이그레이션 코드를 중복 작성하지 않으려고요.',
      expectedOutput:
        '앱 시작 로그:\n' +
        'Liquibase: Reading from databasechangelog\n' +
        'Liquibase: ChangeSet db.changelog.yaml::create-users::alice ran successfully',
      realWorldUsage:
        '실제 엔터프라이즈 제품에서는 로컬 개발(PostgreSQL), QA(Oracle), 고객사 온프레미스(MySQL)까지 ' +
        '모두 같은 Liquibase changelog로 스키마를 관리하는 전략을 써요.',
      pitfall:
        'id와 author가 둘 다 없거나 이미 존재하는 조합이면 changeSet이 무시되거나 중복 실행돼요. ' +
        'id는 반드시 유일하게, author는 팀원 식별자로 정해서 매 changeSet에 꼭 작성하세요.',
    },
  },
  {
    id: 'data-liquibase-sql',
    lang: 'java',
    title: 'Liquibase raw SQL changeset',
    file: 'db.changelog.yaml',
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
      concept:
        'Liquibase도 추상화된 액션만 쓰지 않고, 벤더 전용 DDL이 필요한 경우 raw SQL을 직접 적을 수 있어요. ' +
        'sql 액션 안에 | (YAML literal block scalar)를 쓰면 들여쓰기와 줄바꿈을 그대로 SQL로 처리해요. ' +
        'splitStatements: true는 세미콜론(;) 기준으로 여러 SQL 문을 개별 실행해주고, stripComments: true는 SQL 주석을 제거해요. ' +
        '실무에서는 일반 DDL은 선언적 액션으로, 복잡한 인덱스·파티션·저장 프로시저 생성은 raw SQL로 혼합해서 써요.',
      terms: [
        { t: 'sql', d: '직접 SQL을 실행하는 Liquibase 변경 액션이에요. 중괄호 없이 순수 SQL을 담아요' },
        { t: 'splitStatements: true', d: 'SQL 문자열을 세미콜론으로 분리해 여러 문장을 순차 실행해요. false면 전체가 한 문으로 처리돼요' },
        { t: 'stripComments: true', d: 'SQL에 포함된 주석(-- 또는 /* */)을 제거한 뒤 실행해요' },
        { t: 'sql: |', d: 'YAML 파이프(|)는 여러 줄 문자열을 그대로 보존하는 리터럴 블록 문법이에요' },
        { t: 'CREATE INDEX', d: '검색 속도를 높이기 위한 인덱스를 만드는 표준 DDL이에요' },
      ],
      why:
        'Liquibase의 선언적 액션으로 표현하기 까다로운 벤더 전용 DDL이나 복잡한 쿼리를 ' +
        'raw SQL로 그대로 담아 유연하게 마이그레이션하려고요.',
      expectedOutput:
        'Liquibase: ChangeSet db.changelog.yaml::add-index::bob ran successfully\n' +
        'Liquibase: (DB에 idx_users_email 인덱스 생성됨)',
      realWorldUsage:
        '실제 PostgreSQL 전용 기능(GIN 인덱스, BRIN 인덱스, PARTITION BY 등)을 Liquibase로 관리할 때 ' +
        '선언적 액션으로는 표현할 수 없어 raw SQL changeSet을 활용해요.',
      pitfall:
        'splitStatements: false로 두고 SQL 파일에 여러 문을 세미콜론으로 이어 적으면 ' +
        '전체가 한 덩어리로 실행돼 구문 오류가 나요. 여러 SQL 문이 있으면 반드시 splitStatements: true로 설정하세요.',
    },
  },
  {
    id: 'data-index-create',
    lang: 'java',
    title: '복합 인덱스 생성',
    file: 'V3__add_order_index.sql',
    code: `CREATE INDEX idx_order_status_created
  ON orders(status, created_at);

CREATE UNIQUE INDEX idx_orders_number
  ON orders(order_number);`,
    explain: {
      concept:
        '복합 인덱스(Composite Index)는 두 개 이상의 컬럼을 한 묶음으로 색인하는 전략이에요. ' +
        '(status, created_at) 순서로 인덱스를 만들면 "WHERE status=? ORDER BY created_at" 같은 쿼리에서 인덱스만으로 정렬까지 처리할 수 있어 빨라져요. ' +
        '컬럼 순서가 중요한데, 자주 where 조건에 단독으로 쓰이는 컬럼을 앞에, 정렬용 컬럼을 뒤에 배치하는 게 원칙이에요. ' +
        'UNIQUE INDEX는 값의 중복을 허용하지 않는 인덱스로, 주문 번호처럼 유일해야 하는 컬럼에 걸어 데이터 무결성을 강제해요.',
      terms: [
        { t: 'idx_order_status_created', d: '인덱스 이름이에요. idx_테이블_컬럼_컬럼 같은 명명 규칙을 쓰면 식별이 쉬워요' },
        { t: '(status, created_at)', d: '복합 인덱스의 컬럼 순서예요. 앞 컬럼으로 단독 조회도 인덱스를 타지만 뒤 컬럼만으로는 못 타요' },
        { t: 'UNIQUE INDEX', d: '중복 값을 허용하지 않는 인덱스예요. NULL은 중복으로 간주하지 않아 여러 개 허용돼요' },
        { t: 'order_number', d: '주문 번호 컬럼이에요. UNIQUE INDEX로 모든 주문이 서로 다른 번호를 갖도록 강제해요' },
        { t: 'created_at', d: '복합 인덱스의 두 번째 컬럼이에요. status로 먼저 필터링된 결과를 이 컬럼으로 정렬할 때 인덱스를 타요' },
      ],
      why:
        '자주 실행되는 쿼리의 WHERE 조건과 ORDER BY에 대응하는 복합 인덱스를 미리 만들어 ' +
        '테이블 전체를 스캔하지 않고 소량만 읽도록 하려고요.',
      expectedOutput:
        '(DB 콘솔에서 실행):\n' +
        'CREATE INDEX\n' +
        'CREATE INDEX\n' +
        'Query returned successfully',
      realWorldUsage:
        '실제 이커머스에서 "주문 상태별 최신순 목록"은 매일 수백만 번 호출되는 핵심 쿼리예요. ' +
        '(status, created_at) 복합 인덱스 하나로 풀 테이블 스캔을 피하고 응답을 100배 빠르게 할 수 있어요.',
      pitfall:
        '컬럼 순서가 쿼리와 다르면 인덱스를 못 타요. (created_at, status)로 만들면 ' +
        '"WHERE status=?" 쿼리에는 인덱스가 안 걸려요. 항상 WHERE의 = 조건 컬럼을 앞에 배치하세요.',
    },
  },
  {
    id: 'data-explain',
    lang: 'java',
    title: 'EXPLAIN 으로 실행 계획',
    file: 'SlowQuery.java',
    code: `import jakarta.persistence.EntityManager;

public class SlowQueryAnalyzer {

  private final EntityManager em;

  public SlowQueryAnalyzer(EntityManager em) {
    this.em = em;
  }

  public void explain() {
    String sql = "EXPLAIN SELECT * FROM orders WHERE status = 'PAID'";
    System.out.println("[실행] EXPLAIN 쿼리");
    em.createNativeQuery(sql).getResultList().forEach(row -> {
      System.out.println("[계획] " + row);
    });
  }
}`,
    explain: {
      concept:
        'EXPLAIN은 쿼리를 실제로 실행하지 않고 "DB가 이 쿼리를 어떻게 실행할지 계획서"만 보여주는 명령어예요. ' +
        'createNativeQuery로 EXPLAIN 쿼리를 실행하고 getResultList로 계획 행을 받아 forEach로 한 줄씩 출력해요. ' +
        '실행 계획을 보면 "Seq Scan"인지(전체 테이블을 처음부터 끝까지 읽음), "Index Scan"인지(인덱스를 타고 필요한 부분만 읽음) 한눈에 파악돼요. ' +
        '실무에서는 느린 API가 발견되면 먼저 해당 SQL에 EXPLAIN을 걸어 실행 계획을 확인하고 인덱스 추가를 결정해요.',
      terms: [
        { t: 'EXPLAIN', d: 'SQL 실행 계획만 조회하는 명령이에요. 실제 데이터는 읽지 않아 시간이 거의 안 들어요' },
        { t: 'createNativeQuery', d: 'JPQL이 아닌 원시 SQL을 실행하는 JPA EntityManager 메서드예요' },
        { t: 'getResultList', d: '쿼리 결과를 List<Object>로 반환해요. EXPLAIN 결과 행들이 Object[]로 담겨요' },
        { t: 'forEach(row -> ...)', d: '각 행을 람다로 순회하며 콘솔에 출력해요' },
        { t: 'Seq Scan / Index Scan', d: 'EXPLAIN 결과에 나오는 실행 방식이에요. Seq Scan은 느리고 Index Scan은 상대적으로 빨라요' },
      ],
      why:
        '느린 쿼리의 원인을 감으로 추측하지 않고 DB가 알려주는 실행 계획을 근거로 ' +
        '정확한 문제(인덱스 없음, 잘못된 조인 순서 등)를 진단하려고요.',
      expectedOutput:
        '[실행] EXPLAIN 쿼리\n' +
        '[계획] Seq Scan on orders  (cost=0.00..1200.00 rows=500 width=128)\n' +
        '[계획]   Filter: (status = \'PAID\'::text)',
      realWorldUsage:
        '실제 DBA와 개발자 간 협업에서 "이 API가 느린데요" 논의의 첫 단계가 EXPLAIN 결과 공유예요. ' +
        'Seq Scan이면 인덱스를 추가하고, Index Scan인데 느리면 다른 조건 튜닝으로 넘어가요.',
      pitfall:
        'EXPLAIN이 보여주는 예상 행 수(cost=... rows=...)는 추정치(통계 기반)예요. ' +
        '실제 실행 시간을 보려면 EXPLAIN ANALYZE를 써야 하는데, ANALYZE는 쿼리를 실제로 실행하므로 프로덕션에서는 주의해서 써야 해요.',
    },
  },
  {
    id: 'data-entity-graph',
    lang: 'java',
    title: '@EntityGraph 로 N+1 해결',
    file: 'PostRepository.java',
    code: `import java.util.List;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PostRepository extends JpaRepository<PostEntity, Long> {

  @EntityGraph(attributePaths = "comments")
  List<PostEntity> findAllByAuthor(String author);
}`,
    explain: {
      concept:
        '@EntityGraph는 "이 메서드가 실행될 때 comments도 함께 로딩해줘"라고 선언하는 어노테이션이에요. ' +
        '내부적으로는 JOIN FETCH SQL을 생성해주는 단축키라서, JPQL에 직접 join fetch을 쓰지 않아도 N+1을 해결할 수 있어요. ' +
        'JpaRepository 인터페이스에 메서드 시그니처만 선언하면 Spring Data가 구현체를 자동 생성하고, @EntityGraph가 붙은 메서드는 페치 조인이 적용된 쿼리로 만들어져요. ' +
        '실무에서는 "목록 조회인데 자식도 항상 같이 보여줘야 할 때" 간단한 @EntityGraph 한 줄로 fetch join을 대체해요.',
      terms: [
        { t: 'JpaRepository<PostEntity, Long>', d: '스프링 데이터 JPA의 기본 레포지토리 인터페이스예요. PostEntity를 Long 타입 ID로 관리해요' },
        { t: '@EntityGraph', d: '연관 필드를 함께 즉시 로딩하도록 지정하는 어노테이션이에요. JPQL의 join fetch를 대체해요' },
        { t: 'attributePaths = "comments"', d: '함께 로딩할 연관관계 필드명이에요. PostEntity에 정의된 comments 컬렉션이 대상이에요' },
        { t: 'findAllByAuthor', d: 'Spring Data가 메서드명을 분석해 WHERE author = ? 쿼리를 자동으로 만들어주는 파생 쿼리예요' },
        { t: 'List<PostEntity>', d: '결과 타입이에요. @EntityGraph 덕분에 각 PostEntity의 comments 컬렉션이 이미 로딩된 상태로 반환돼요' },
      ],
      why:
        '연관 엔티티를 항상 함께 조회해야 하는 메서드에 JPQL의 join fetch 없이 ' +
        '어노테이션 하나만으로 N+1을 간단히 해결하려고요.',
      expectedOutput:
        'Hibernate: select ... from post p left join fetch p.comments where p.author = ?\n' +
        '(PostEntity 리스트 반환, 각 PostEntity.comments 필드에 댓글 리스트 이미 채워짐)',
      realWorldUsage:
        '실제 "작가별 게시글 + 댓글" 조회 화면에서 @EntityGraph("comments")로 댓글까지 한 번에 가져오고, ' +
        '게시글 내부에서 또 @EntityGraph("tags")로 태그를 함께 가져오는 식으로 중첩해서도 쓸 수 있어요.',
      pitfall:
        'attributePaths에 적는 이름은 엔티티 필드명과 정확히 일치해야 해요. ' +
        '"comment"로 오타를 내면 컴파일은 되는데 런타임에 "Unable to locate Attribute with the given name" 에러가 발생해요.',
    },
  },
];
