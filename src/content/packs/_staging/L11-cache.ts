import type { Snippet } from '../../types';

export const cache: Snippet[] = [
  {
    id: 'cache-enable-caching',
    lang: 'java',
    title: '@EnableCaching',
    file: 'CacheConfig.java',
    code: `import org.springframework.cache.CacheManager;
import org.springframework.cache.annotation.EnableCaching;
import org.springframework.cache.concurrent.ConcurrentMapCacheManager;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
@EnableCaching
public class CacheConfig {
  @Bean
  public CacheManager cacheManager() {
    System.out.println("[실행] 캐시 매니저 생성 - 보관함: users, products");
    CacheManager cm = new ConcurrentMapCacheManager("users", "products");
    System.out.println("[결과] ConcurrentMapCacheManager 등록 완료");
    return cm;
  }
}`,
    explain: {
      concept:
        '@EnableCaching은 애플리케이션에 "이제부터 캐시 기능을 쓸 거예요"라고 알려주는 설정 스위치예요. ' +
        '이 어노테이션이 없으면 @Cacheable 같은 캐시 어노테이션이 전부 무시돼요. ' +
        'ConcurrentMapCacheManager는 스프링이 기본으로 제공하는 인메모리 보관함 관리자예요 - 별도 설치 없이 바로 쓸 수 있어요. ' +
        '"users"와 "products"는 보관함의 이름이에요. 같은 앱 안에서도 데이터 종류별로 서로 다른 보관함을 두고 독립적으로 관리할 수 있어요. ' +
        '실제 프로젝트에서는 개발 환경에서 이 기본 보관함으로 빠르게 확인하고, 운영 환경에서는 Redis로 교체하는 식으로 활용해요.',
      terms: [
        { t: '@EnableCaching', d: '캐시 기능을 활성화하는 스위치예요. 없으면 @Cacheable이 동작하지 않아요.' },
        { t: '@Configuration', d: '스프링 설정 클래스임을 알려줘요. 이 클래스 안의 @Bean 메서드가 빈으로 등록돼요.' },
        { t: '@Bean', d: '메서드가 반환하는 객체를 스프링 빈으로 등록해줘요. 여기서는 CacheManager를 등록하고 있어요.' },
        { t: 'ConcurrentMapCacheManager', d: '메모리 기반 캐시 보관함 관리자예요. ConcurrentHashMap을 내부에 두고 데이터를 저장해요.' },
        { t: '"users", "products"', d: '보관함 이름이에요. @Cacheable("users")라고 쓰면 users 보관함을 사용하는 거예요.' },
      ],
      expectedOutput:
        '앱 시작 시 콘솔 출력:\n' +
        '[실행] 캐시 매니저 생성 - 보관함: users, products\n' +
        '[결과] ConcurrentMapCacheManager 등록 완료',
      realWorldUsage:
        '실제 프로젝트의 CacheConfig 클래스에 이 코드가 있어요. @Cacheable("users")가 붙은 모든 메서드의 결과가 자동으로 이 보관함을 통해 메모리에 저장되고, 두 번째 호출부터는 메서드 본문을 실행하지 않고 캐시된 값을 바로 반환해요.',
      why: '반복적인 계산이나 DB 조회 결과를 메모리에 저장해 응답 속도를 높이려고요. 같은 데이터를 여러 번 요청할 때 DB 부하를 획기적으로 줄일 수 있어요.',
      pitfall: 'ConcurrentMapCacheManager는 앱을 재시작하면 모든 캐시 데이터가 사라져요. 영속성이 필요하면 Redis나 EhCache 같은 외부 저장소를 캐시로 쓰세요.',
    },
  },
  {
    id: 'cache-cacheable',
    lang: 'java',
    title: '@Cacheable 기본',
    file: 'UserService.java',
    code: `import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;

@Service
public class UserService {
  private final UserRepository userRepository;

  public UserService(UserRepository userRepository) {
    this.userRepository = userRepository;
  }

  @Cacheable("users")
  public User getUser(Long id) {
    System.out.println("[실행] DB 조회 - userId: " + id);
    User user = userRepository.findById(id).orElseThrow();
    System.out.println("[결과] 조회된 사용자: " + user.getName());
    return user;
  }
}`,
    explain: {
      concept:
        '@Cacheable은 "처음엔 계산하고, 두 번째부터는 보관함에서 꺼내줘요"라는 캐시 읽기 도구예요. ' +
        '같은 키로 메서드가 호출되면 스프링이 메서드 본문을 건너뛰고 캐시에서 값을 반환해줘요. ' +
        '여러분이 자주 조회하는 사용자 정보가 있다고 생각해보세요 - 매번 DB까지 갔다 오는 대신 메모리에서 1ms 만에 가져오는 거예요. ' +
        '여기서는 메서드 파라미터인 id가 자동으로 캐시 키로 사용돼요. id=1로 첫 호출 시 DB를 조회하고, 두 번째 id=1 호출부터는 DB 없이 캐시에서 바로 반환해요. ' +
        '캐시 적중률이 높을수록 DB 커넥션 비용을 아끼고 응답 시간이 극적으로 빨라져요.',
      terms: [
        { t: '@Cacheable("users")', d: '이 메서드의 결과를 "users" 보관함에 저장하고, 같은 키면 캐시에서 반환해요.' },
        { t: 'cache key (id)', d: '메서드 파라미터 id가 캐시 키로 사용돼요. 같은 id로 부르면 캐시된 결과를 돌려줘요.' },
        { t: 'findById(id)', d: 'JPA 리포지토리로 DB에서 데이터를 찾는 메서드예요. 캐시에 없을 때만 실행돼요.' },
        { t: 'orElseThrow()', d: 'Optional 값이 없으면 NoSuchElementException을 던져요. null-safe 캐싱을 보장해요.' },
      ],
      expectedOutput:
        'getUser(1L) 첫 호출 시:\n' +
        '[실행] DB 조회 - userId: 1\n' +
        '[결과] 조회된 사용자: kim\n\n' +
        'getUser(1L) 두 번째 호출 시: (콘솔 출력 없음 - 캐시에서 반환)',
      realWorldUsage:
        '실제 프로젝트에서 사용자 프로필 조회 API가 @Cacheable("users")로 캐싱돼 있어요. 하루에 수백만 번 조회되는 인기 사용자 프로필은 DB를 한 번만 조회하고 나머지는 캐시에서 응답해요. 서비스 응답 시간이 DB 조회 50ms에서 캐시 조회 1ms로 줄어들어요.',
      why: '같은 데이터를 반복 조회할 때 DB 부하를 줄이고 응답 속도를 극적으로 개선하려고요.',
      pitfall: 'null을 반환하는 메서드에 @Cacheable을 쓰면 null도 캐싱돼서 의도하지 않은 동작이 생길 수 있어요. null 가능성이 있으면 unless="#result == null"을 추가하거나, 이 예시처럼 orElseThrow()로 null을 반환하지 않게 하세요.',
    },
  },
  {
    id: 'cache-cacheable-key',
    lang: 'java',
    title: '@Cacheable 키 지정',
    file: 'ProductService.java',
    code: `import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;

@Service
public class ProductService {
  private final ProductRepository productRepository;

  public ProductService(ProductRepository productRepository) {
    this.productRepository = productRepository;
  }

  @Cacheable(value = "products", key = "#id")
  public Product getProduct(Long id) {
    System.out.println("[실행] DB 조회 - productId: " + id);
    Product product = productRepository.findById(id).orElseThrow();
    System.out.println("[결과] 조회된 상품: " + product.getName());
    return product;
  }
}`,
    explain: {
      concept:
        '캐시 키는 보관함 안의 서랍 번호예요. key 속성으로 어떤 파라미터를 키로 쓸지 명시적으로 지정해요. ' +
        '기본적으로 @Cacheable은 모든 파라미터를 조합해 키를 만들지만, 파라미터가 여러 개일 때 특정 파라미터만 키로 쓰고 싶은 경우에 key 속성을 써요. ' +
        '여기서 #id는 메서드 파라미터 id를 가리키는 SpEL(스프링 표현 언어) 표현식이에요. ' +
        '키 생성기를 명시적으로 지정해두면 나중에 다른 개발자가 코드를 볼 때도 "아, 이 메서드는 id로 캐시를 식별하는구나"를 바로 알 수 있어서 좋아요.',
      terms: [
        { t: 'value = "products"', d: '캐시 보관함 이름을 지정해요. products 보관함에 결과를 저장해요.' },
        { t: 'key = "#id"', d: '캐시 키를 메서드 파라미터 id로 지정하는 SpEL 표현식이에요.' },
        { t: 'SpEL (#)', d: '#으로 시작하는 스프링 표현 언어예요. #id는 메서드 인자 id를 가리켜요.' },
        { t: 'ProductRepository', d: '상품 데이터 저장소예요. DB에서 Product 엔티티를 찾아 반환해요.' },
      ],
      expectedOutput:
        'getProduct(100L) 첫 호출 시:\n' +
        '[실행] DB 조회 - productId: 100\n' +
        '[결과] 조회된 상품: 노트북\n\n' +
        'getProduct(200L) 첫 호출 시:\n' +
        '[실행] DB 조회 - productId: 200\n' +
        '[결과] 조회된 상품: 키보드',
      realWorldUsage:
        '실제 쇼핑몰 프로젝트에서 상품 상세 페이지 API가 이 패턴으로 캐싱돼요. 복수 인자를 받는 검색 메서드라도 key="#productId"로 명시하면 검색 조건과 무관하게 상품 ID만으로 캐시를 식별할 수 있어요.',
      why: '복수 인자일 때 어떤 값을 키로 쓸지 명확히 해서 캐시 히트율을 높이려고요. 기본 키 생성 전략은 모든 인자를 조합하기 때문에 의도치 않은 캐시 미스가 발생할 수 있어요.',
      pitfall: 'SpEL 문법이 틀리면 런타임에 캐시 관련 예외가 발생해요. 파라미터 이름과 # 뒤의 이름이 일치하는지 반드시 확인하세요. 자바 바이트코드에 파라미터 이름이 보존되도록 -parameters 옵션을 켜야 해요.',
    },
  },
  {
    id: 'cache-cacheable-condition',
    lang: 'java',
    title: '@Cacheable 조건부 캐싱',
    file: 'UserService.java',
    code: `import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;

@Service
public class UserService {
  private final UserRepository userRepository;

  public UserService(UserRepository userRepository) {
    this.userRepository = userRepository;
  }

  @Cacheable(value = "users", condition = "#id > 100")
  public User getUser(Long id) {
    System.out.println("[실행] DB 조회 - userId: " + id);
    User user = userRepository.findById(id).orElseThrow();
    System.out.println("[결과] 조회된 사용자: " + user.getName());
    return user;
  }
}`,
    explain: {
      concept:
        'condition은 "이 조건이 참일 때만 보관함에 넣어주세요"라는 필터예요. ' +
        '여기서는 id가 100보다 클 때만 캐시에 저장하고, id가 100 이하인 조회는 매번 DB까지 다녀와요. ' +
        '왜 이런 조건이 필요할까요? VIP 사용자(id가 큰 번호)는 조회가 많으니 캐시하고, 일반 사용자는 캐시 메모리를 아끼기 위해서예요. ' +
        'condition은 메서드 인자 기준으로 판단하고, 반대 개념인 unless는 메서드 반환값 기준으로 판단해요 - 둘을 헷갈리지 않는 게 중요해요.',
      terms: [
        { t: 'condition', d: '메서드 인자 기준으로 캐싱 여부를 결정하는 조건이에요. SpEL로 표현해요.' },
        { t: '#id > 100', d: 'id가 100을 초과할 때만 true가 되어 캐싱이 동작해요. 이하일 땐 캐싱하지 않아요.' },
        { t: 'unless (vs condition)', d: 'unless는 반환값 기준으로 캐싱을 제외하는 조건이에요. condition은 인자 기준이에요.' },
        { t: 'UserRepository', d: '사용자 데이터를 DB에서 조회하는 저장소예요. 캐시 조건이 false면 매번 호출돼요.' },
      ],
      expectedOutput:
        'getUser(50L) 호출 시 (매번):\n' +
        '[실행] DB 조회 - userId: 50\n' +
        '[결과] 조회된 사용자: guest\n\n' +
        'getUser(200L) 첫 호출:\n' +
        '[실행] DB 조회 - userId: 200\n' +
        '[결과] 조회된 사용자: admin\n' +
        'getUser(200L) 두 번째 호출: (콘솔 출력 없음)',
      realWorldUsage:
        '실제 프로젝트에서 대용량 데이터를 다룰 때 condition으로 캐시 대상을 필터링해요. 예를 들어 인기 상품만 캐싱하고 비인기 상품은 매번 DB에서 조회하도록 하면, 제한된 캐시 메모리를 효율적으로 쓸 수 있어요.',
      why: '무분별한 캐싱은 제한된 메모리를 낭비하고, 오히려 잘못된 데이터를 오래 간직하게 만들어요. 조건부 캐싱으로 진짜 필요한 데이터만 메모리에 유지하려고요.',
      pitfall: 'condition은 메서드가 실행되기 전에 인자만 보고 판단해요. 실행해봐야 알 수 있는 조건은 unless를 써야 해요. 예: "결과가 null이면 캐싱하지 말라"는 condition으로 표현할 수 없어요.',
    },
  },
  {
    id: 'cache-cacheevict',
    lang: 'java',
    title: '@CacheEvict로 캐시 삭제',
    file: 'UserService.java',
    code: `import org.springframework.cache.annotation.CacheEvict;
import org.springframework.stereotype.Service;

@Service
public class UserService {
  private final UserRepository userRepository;

  public UserService(UserRepository userRepository) {
    this.userRepository = userRepository;
  }

  @CacheEvict(value = "users", key = "#id")
  public void deleteUser(Long id) {
    System.out.println("[실행] 사용자 삭제 + 캐시 제거 - userId: " + id);
    userRepository.deleteById(id);
    System.out.println("[결과] userId=" + id + " 삭제 완료, 캐시도 비워짐");
  }
}`,
    explain: {
      concept:
        '@CacheEvict는 데이터가 변경되거나 삭제됐을 때 캐시의 옛날 값을 지우는 청소부예요. ' +
        '사용자를 DB에서 지웠는데 캐시에는 남아 있으면, 클라이언트는 삭제된 사용자 정보를 계속 보게 되는 불일치가 발생해요. ' +
        '이 어노테이션이 메서드 실행 후 자동으로 캐시에서 해당 키의 데이터를 제거해줘요. ' +
        '실제 프로젝트에서는 update·delete 메서드에 거의 항상 @CacheEvict를 붙여서 캐시와 DB의 동기화를 유지해요.',
      terms: [
        { t: '@CacheEvict', d: '메서드 실행 후 캐시에서 지정된 키의 데이터를 제거해요. 데이터 변경 시 불일치를 막아줘요.' },
        { t: 'key = "#id"', d: '제거할 캐시 항목의 키를 지정해요. DB에서 삭제한 id와 같은 값이에요.' },
        { t: 'value = "users"', d: '어떤 보관함에서 지울지 지정해요. @Cacheable의 value와 일치해야 해요.' },
        { t: 'deleteById(id)', d: 'JPA가 제공하는 삭제 메서드예요. id에 해당하는 엔티티를 DB에서 제거해요.' },
      ],
      expectedOutput:
        'deleteUser(1L) 호출 시:\n' +
        '[실행] 사용자 삭제 + 캐시 제거 - userId: 1\n' +
        '[결과] userId=1 삭제 완료, 캐시도 비워짐',
      realWorldUsage:
        '실제 프로젝트에서 사용자 정보 수정 API나 회원 탈퇴 API가 이 패턴을 써요. 탈퇴한 사용자의 캐시가 남아 있으면 보안 문제로 이어질 수 있기 때문에 더욱 중요해요. 삭제·수정 시에는 반드시 @CacheEvict로 캐시를 정리하는 게 실무 관행이에요.',
      why: '데이터 변경이나 삭제 후 캐시와 DB 간의 불일치를 막으려고요. 캐시에 오래된 데이터가 남아 있으면 사용자에게 잘못된 정보가 노출될 수 있어요.',
      pitfall: 'key를 생략하면 스프링이 기본 키 생성 전략을 쓰지만, 복수 파라미터 상황에서는 의도와 다른 키가 생성될 수 있어요. @Cacheable과 같은 key가 정리되도록 명시적으로 지정하는 게 안전해요.',
    },
  },
  {
    id: 'cache-cacheevict-all',
    lang: 'java',
    title: '@CacheEvict 전체 비우기',
    file: 'UserService.java',
    code: `import org.springframework.cache.annotation.CacheEvict;
import org.springframework.stereotype.Service;

@Service
public class UserService {
  private final UserRepository userRepository;

  public UserService(UserRepository userRepository) {
    this.userRepository = userRepository;
  }

  @CacheEvict(value = "users", allEntries = true)
  public void clearAllUsers() {
    System.out.println("[실행] users 보관함 전체 초기화");
    userRepository.deleteAll();
    System.out.println("[결과] 모든 사용자 삭제 + 캐시 전체 비우기 완료");
  }
}`,
    explain: {
      concept:
        'allEntries=true는 보관함 전체를 한 번에 비우는 대청소 모드예요. ' +
        '일괄 작업으로 여러 데이터가 한꺼번에 변경됐을 때, 어떤 키들이 영향을 받았는지 일일이 추적하기 어려운 경우에 써요. ' +
        '예를 들어 사용자 등급이 일괄 변경되거나 대규모 데이터 이전이 발생했을 때, 캐시 전체를 날리고 새로 채우는 전략이에요. ' +
        '다만 너무 자주 쓰면 캐시 효율이 떨어지니, 진짜 전체 초기화가 필요한 상황에서만 신중하게 써야 해요.',
      terms: [
        { t: 'allEntries = true', d: '보관함 안의 모든 캐시 항목을 한 번에 제거해요. 개별 키를 일일이 지정하지 않아도 돼요.' },
        { t: 'deleteAll()', d: 'DB 테이블의 모든 데이터를 삭제하는 메서드예요. 캐시도 함께 비워서 동기화해요.' },
        { t: '@CacheEvict', d: '캐시 제거를 선언하는 어노테이션이에요. allEntries와 함께 쓰면 전체 삭제로 동작해요.' },
        { t: 'value = "users"', d: '비울 보관함의 이름이에요. 이 보관함에 저장된 모든 데이터가 삭제돼요.' },
      ],
      expectedOutput:
        'clearAllUsers() 호출 시:\n' +
        '[실행] users 보관함 전체 초기화\n' +
        '[결과] 모든 사용자 삭제 + 캐시 전체 비우기 완료',
      realWorldUsage:
        '실제 프로젝트에서 배치 작업으로 대량 데이터를 갱신한 후 캐시를 초기화할 때 이 패턴을 써요. 예를 들어 매일 새벽 사용자 등급을 재계산하는 배치가 끝난 뒤, users 캐시 전체를 비워서 다음 조회 시 최신 등급이 반영되게 해요.',
      why: '어떤 키들이 영향을 받았는지 일일이 추적하기 어려운 대규모 변경 작업 후에 캐시를 깔끔하게 초기화하려고요.',
      pitfall: '자주 호출하면 캐시가 계속 비워져서 캐시 도입 효과가 사라져요. 트래픽이 많은 시간대에 호출하면 DB 부하가 갑자기 몰릴 수 있어요.',
    },
  },
  {
    id: 'cache-cacheput',
    lang: 'java',
    title: '@CachePut으로 캐시 갱신',
    file: 'UserService.java',
    code: `import org.springframework.cache.annotation.CachePut;
import org.springframework.stereotype.Service;

@Service
public class UserService {
  private final UserRepository userRepository;

  public UserService(UserRepository userRepository) {
    this.userRepository = userRepository;
  }

  @CachePut(value = "users", key = "#user.id")
  public User updateUser(User user) {
    System.out.println("[실행] 사용자 수정 + 캐시 갱신 - userId: " + user.getId());
    User updated = userRepository.save(user);
    System.out.println("[결과] 캐시 갱신 완료 - userId: " + updated.getId());
    return updated;
  }
}`,
    explain: {
      concept:
        '@CachePut은 메서드를 무조건 실행하고, 그 결과로 캐시를 덮어써요. ' +
        '@Cacheable이 "캐시에 있으면 메서드 건너뛰기"라면, @CachePut은 "무조건 실행하고 캐시 갱신"이에요. ' +
        '사용자 정보를 수정하는 상황을 생각해보세요 - DB에 새 값을 저장하고, 캐시에도 새 값을 반영해야 다음 조회에서 최신 데이터를 보여줘요. ' +
        '이 어노테이션은 메서드의 반환값으로 캐시를 갱신하기 때문에, 업데이트된 엔티티를 그대로 반환하는 패턴과 잘 맞아요.',
      terms: [
        { t: '@CachePut', d: '메서드를 항상 실행하고 그 반환값으로 캐시를 갱신해요. 캐시에 있든 없든 무조건 실행하고 덮어써요.' },
        { t: 'key = "#user.id"', d: 'User 객체의 id 필드를 캐시 키로 사용해요. 객체 내부 필드에 접근하는 SpEL이에요.' },
        { t: 'save(user)', d: 'JPA의 save 메서드예요. 기존 엔티티가 있으면 UPDATE, 없으면 INSERT를 실행해요.' },
        { t: 'return updated', d: '저장된 최신 엔티티를 반환해요. 이 반환값이 그대로 캐시에 저장돼요.' },
      ],
      expectedOutput:
        'updateUser(user) 호출 시:\n' +
        '[실행] 사용자 수정 + 캐시 갱신 - userId: 1\n' +
        '[결과] 캐시 갱신 완료 - userId: 1',
      realWorldUsage:
        '실제 프로젝트의 사용자 정보 수정 API에서 이 패턴을 써요. 이름이나 이메일을 변경했을 때 @CachePut이 캐시를 갱신해서, 바로 이어지는 프로필 조회에서 최신 정보를 보여줘요. @Cacheable로 조회하는 메서드와 key 값을 동일하게 맞추는 게 핵심이에요.',
      why: '데이터가 수정됐을 때 캐시에도 즉시 반영해 다음 조회에서 오래된 데이터가 반환되지 않게 하려고요.',
      pitfall: '@Cacheable과 @CachePut의 key 생성 전략을 동일하게 맞추지 않으면, 서로 다른 키로 저장/조회가 되어 캐시가 엇갈려요. 같은 엔티티에 대해 두 어노테이션의 value와 key가 일치하는지 반드시 확인하세요.',
    },
  },
  {
    id: 'cache-redis-template',
    lang: 'java',
    title: 'RedisTemplate 설정',
    file: 'RedisConfig.java',
    code: `import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.redis.connection.RedisConnectionFactory;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.data.redis.serializer.GenericJackson2JsonRedisSerializer;
import org.springframework.data.redis.serializer.StringRedisSerializer;

@Configuration
public class RedisConfig {
  @Bean
  public RedisTemplate<String, Object> redisTemplate(RedisConnectionFactory factory) {
    System.out.println("[실행] RedisTemplate 생성 시작");
    RedisTemplate<String, Object> template = new RedisTemplate<>();
    template.setConnectionFactory(factory);
    template.setKeySerializer(new StringRedisSerializer());
    template.setValueSerializer(new GenericJackson2JsonRedisSerializer());
    System.out.println("[결과] RedisTemplate 설정 완료 - 키: String, 값: JSON");
    return template;
  }
}`,
    explain: {
      concept:
        'RedisTemplate은 스프링에서 Redis라는 외부 메모리 저장소와 대화하는 통역사예요. ' +
        '여러 서버가 같은 캐시를 공유해야 할 때 Redis 같은 외부 저장소를 쓰면, 서버마다 각자 메모리를 갖는 ConcurrentMapCacheManager보다 훨씬 유용해요. ' +
        '여기서 setKeySerializer는 키를 문자열로, setValueSerializer는 값을 JSON으로 주고받도록 설정하고 있어요. ' +
        '직렬화 방식을 설정하지 않으면 Redis에 저장된 데이터가 사람이 읽을 수 없는 바이트로 깨져 보여서 디버깅이 어려워져요.',
      terms: [
        { t: 'RedisTemplate', d: 'Redis에 데이터를 저장하고 조회하는 스프링의 핵심 도구예요. 모든 Redis 연산의 시작점이에요.' },
        { t: 'RedisConnectionFactory', d: 'Redis 서버와의 물리적 연결을 만들어주는 공장이에요. 호스트·포트·비밀번호 정보를 담고 있어요.' },
        { t: 'StringRedisSerializer', d: '키를 사람이 읽을 수 있는 문자열로 직렬화해요. Redis CLI에서 키를 바로 확인할 수 있어요.' },
        { t: 'GenericJackson2JsonRedisSerializer', d: '값을 JSON 형식으로 직렬화해요. 객체를 Redis에 저장하고 다시 객체로 복원할 수 있어요.' },
        { t: 'setConnectionFactory', d: 'RedisTemplate에 연결 정보를 주입해요. 이게 없으면 Redis와 통신할 수 없어요.' },
      ],
      expectedOutput:
        '앱 시작 시:\n' +
        '[실행] RedisTemplate 생성 시작\n' +
        '[결과] RedisTemplate 설정 완료 - 키: String, 값: JSON',
      realWorldUsage:
        '실제 프로젝트에서 마이크로서비스 간 세션 공유나 분산 캐시가 필요할 때 RedisTemplate을 설정해요. 예를 들어 서버 A가 저장한 로그인 토큰을 서버 B에서도 Redis를 통해 조회할 수 있어요. 로드밸런서 뒤의 여러 서버가 동일한 캐시 데이터를 바라보게 되는 거예요.',
      why: '여러 서버가 동일한 캐시 데이터를 공유해야 하는 분산 환경에서, 각 서버의 로컬 메모리가 아닌 중앙 Redis에 데이터를 저장하려고요.',
      pitfall: '직렬화 설정을 하지 않으면 기본값으로 JdkSerializationRedisSerializer가 사용돼요. 이 직렬화기는 사람이 읽을 수 없는 바이너리를 만들어 Redis CLI에서 디버깅이 어려워지고, 클래스 버전이 바뀌면 역직렬화 오류가 발생할 수 있어요.',
    },
  },
  {
    id: 'cache-redis-ops-value',
    lang: 'java',
    title: 'Redis ValueOperations',
    file: 'TokenService.java',
    code: `import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.stereotype.Service;

import java.time.Duration;

@Service
public class TokenService {
  private final StringRedisTemplate redis;

  public TokenService(StringRedisTemplate redis) {
    this.redis = redis;
  }

  public void saveToken(String userId, String token) {
    System.out.println("[실행] 토큰 저장 - userId: " + userId);
    redis.opsForValue().set("token:" + userId, token, Duration.ofMinutes(30));
    System.out.println("[결과] 토큰 저장 완료 - 만료 30분 후");
  }
}`,
    explain: {
      concept:
        'opsForValue는 Redis에서 가장 단순한 "키 하나에 값 하나" 방식이에요. ' +
        '로그인 토큰처럼 간단한 문자열을 저장할 때 가장 적합하고, Duration 파라미터로 만료 시간을 함께 설정할 수 있어요. ' +
        '여기서는 토큰을 userId별로 구분해서 저장하고 30분 후 자동 삭제되도록 했어요. ' +
        '만료 시간을 지정하지 않으면 데이터가 영구히 남아서 Redis 메모리가 점점 가득 차게 되니, 임시 데이터에는 반드시 TTL(만료 시간)을 함께 설정하는 게 실무 규칙이에요.',
      terms: [
        { t: 'StringRedisTemplate', d: '문자열 전용 Redis 도구예요. 키와 값이 모두 String이라 타입 변환 걱정 없이 쓸 수 있어요.' },
        { t: 'opsForValue()', d: 'Redis의 키-값 연산을 담당하는 객체를 반환해요. 가장 기본적인 Redis 연산 방식이에요.' },
        { t: 'set(key, value, duration)', d: '키에 값을 저장하고 지정된 시간 후 자동으로 삭제되게 해요. TTL을 한 번에 설정해 안전해요.' },
        { t: 'Duration.ofMinutes(30)', d: '30분이라는 시간을 나타내요. time 패키지의 불변 시간 객체예요.' },
        { t: '"token:" + userId', d: 'userId를 키의 일부로 만들어 사용자별로 토큰을 구분해요. 접두사로 용도를 표시해요.' },
      ],
      expectedOutput:
        'saveToken("user123", "abc-xyz-token") 호출 시:\n' +
        '[실행] 토큰 저장 - userId: user123\n' +
        '[결과] 토큰 저장 완료 - 만료 30분 후',
      realWorldUsage:
        '실제 프로젝트의 로그인 기능에서 JWT 리프레시 토큰을 Redis에 저장할 때 이 패턴을 써요. 로그인하면 서버가 토큰을 Redis에 30분 TTL로 저장하고, 이후 요청에서 토큰을 검증할 때 Redis에서 조회해요. 만료된 토큰은 Redis가 자동으로 삭제하니 별도 스케줄러가 필요 없어요.',
      why: '로그인 토큰이나 인증 코드처럼 일정 시간 후 자동 폐기돼야 하는 임시 데이터를 안전하게 관리하려고요.',
      pitfall: 'set과 expire를 따로따로 호출하면 첫 번째 호출과 두 번째 호출 사이에 네트워크 장애가 발생했을 때 만료 시간이 설정되지 않은 데이터가 영구히 남을 수 있어요. 만료 시간은 항상 set 호출 시 한 번에 지정하세요.',
    },
  },
  {
    id: 'cache-redis-ops-hash',
    lang: 'java',
    title: 'Redis HashOperations',
    file: 'CartService.java',
    code: `import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.stereotype.Service;

@Service
public class CartService {
  private final StringRedisTemplate redis;

  public CartService(StringRedisTemplate redis) {
    this.redis = redis;
  }

  public void addItem(String userId, String itemId, int qty) {
    System.out.println("[실행] 장바구니 추가 - userId: " + userId + ", itemId: " + itemId + ", qty: " + qty);
    redis.opsForHash().put("cart:" + userId, itemId, String.valueOf(qty));
    System.out.println("[결과] 장바구니 저장 완료");
  }
}`,
    explain: {
      concept:
        'opsForHash는 큰 보관함 안에 작은 서랍을 여러 개 둔 것 같은 구조예요. ' +
        '한 사용자의 장바구니(cart:userId)라는 큰 보관함 안에 여러 상품(itemId)을 각각의 서랍에 보관할 수 있어요. ' +
        'opsForValue는 키 하나에 값 하나였지만, Hash는 키 하나 아래 여러 필드-값 쌍을 저장할 수 있어서 구조화된 데이터를 다루기에 적합해요. ' +
        'StringRedisTemplate은 값을 String만 허용하기 때문에, 수량 같은 정수도 String.valueOf()로 변환해서 저장해야 해요.',
      terms: [
        { t: 'opsForHash()', d: 'Redis Hash 자료구조 연산을 담당하는 객체를 반환해요. 하나의 키 아래 여러 필드를 관리할 수 있어요.' },
        { t: 'put(key, field, value)', d: 'Hash 키 아래 field에 value를 저장해요. 맵 안에 또 맵을 두는 구조예요.' },
        { t: '"cart:" + userId', d: '사용자별 장바구니를 구분하는 키예요. userId로 각자 다른 장바구니를 가져요.' },
        { t: 'String.valueOf(qty)', d: 'int 타입 수량을 String으로 변환해요. StringRedisTemplate은 문자열만 저장할 수 있어서 필요해요.' },
      ],
      expectedOutput:
        'addItem("user1", "item-99", 3) 호출 시:\n' +
        '[실행] 장바구니 추가 - userId: user1, itemId: item-99, qty: 3\n' +
        '[결과] 장바구니 저장 완료',
      realWorldUsage:
        '실제 쇼핑몰 프로젝트의 장바구니 기능에서 이 패턴을 써요. userId로 구분된 Hash에 각 상품을 필드로 저장하고, 장바구니 페이지를 열면 hgetAll로 모든 상품을 한 번에 가져와요. 로그인하지 않은 사용자의 장바구니도 Redis에 임시로 저장할 수 있어서 세션보다 유연해요.',
      why: '한 사용자에 속한 여러 데이터를 하나의 키 아래 그룹으로 묶어 관리하려고요. Hash는 개별 필드만 수정할 수 있어서 전체를 덮어쓰지 않아도 돼요.',
      pitfall: 'StringRedisTemplate은 값을 String으로만 저장할 수 있어요. int나 객체를 그대로 put하면 ClassCastException이나 런타임 오류가 발생할 수 있어요. 반드시 String.valueOf()나 toString()으로 변환해서 저장하세요.',
    },
  },
  {
    id: 'cache-caffeine-config',
    lang: 'java',
    title: 'Caffeine 캐시 매니저',
    file: 'CacheConfig.java',
    code: `import com.github.benmanes.caffeine.cache.Caffeine;
import org.springframework.cache.CacheManager;
import org.springframework.cache.caffeine.CaffeineCacheManager;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.concurrent.TimeUnit;

@Configuration
public class CacheConfig {
  @Bean
  public CacheManager cacheManager() {
    System.out.println("[실행] Caffeine 캐시 매니저 생성");
    CaffeineCacheManager manager = new CaffeineCacheManager("users");
    manager.setCaffeine(Caffeine.newBuilder()
      .expireAfterWrite(10, TimeUnit.MINUTES)
      .maximumSize(1000));
    System.out.println("[결과] Caffeine 설정 완료 - max 1000개, TTL 10분");
    return manager;
  }
}`,
    explain: {
      concept:
        'Caffeine은 자바 생태계에서 가장 빠른 인메모리 캐시 라이브러리예요. ' +
        'ConcurrentMapCacheManager보다 훨씬 정교한 설정을 제공해요 - 최대 저장 개수, 쓰기 후 만료 시간, 접근 후 만료 시간 등을 세밀하게 제어할 수 있어요. ' +
        '여기서는 users 보관함에 최대 1000개까지 저장하고, 저장한 지 10분이 지나면 자동 삭제되도록 했어요. ' +
        '최대 크기를 정해두지 않으면 메모리가 무한정 늘어날 위험이 있어서, 실무에서는 항상 maximumSize와 만료 정책을 함께 설정해요.',
      terms: [
        { t: 'CaffeineCacheManager', d: 'Caffeine 라이브러리로 캐시를 관리하는 스프링의 CacheManager 구현체예요.' },
        { t: 'Caffeine.newBuilder()', d: '캐시 설정을 빌더 패턴으로 구성하는 시작점이에요. 여기에 만료·크기 정책을 체이닝해요.' },
        { t: 'expireAfterWrite(10, MINUTES)', d: '데이터를 저장한 후 10분이 지나면 자동 삭제돼요. 쓰기 시점 기준이에요.' },
        { t: 'maximumSize(1000)', d: '보관함에 최대 1000개의 항목만 유지해요. 초과하면 오래된 항목부터 자동 제거돼요.' },
        { t: 'TimeUnit.MINUTES', d: '시간 단위를 분으로 지정해요. SECONDS, HOURS 등으로 바꿀 수 있어요.' },
      ],
      expectedOutput:
        '앱 시작 시:\n' +
        '[실행] Caffeine 캐시 매니저 생성\n' +
        '[결과] Caffeine 설정 완료 - max 1000개, TTL 10분',
      realWorldUsage:
        '실제 프로젝트에서 단일 서버 애플리케이션의 로컬 캐시로 Caffeine을 많이 써요. 예를 들어 카테고리 목록처럼 자주 조회되지만 자주 바뀌지 않는 데이터를 10분 TTL로 캐싱하면, DB 조회를 99% 이상 줄이면서 메모리 사용량은 1000개로 제한할 수 있어요.',
      why: '단일 서버 환경에서 가장 빠른 인메모리 캐시를 쓰면서도, 메모리 사용량과 데이터 신선도를 정밀하게 제어하려고요.',
      pitfall: '여러 서버가 각자 Caffeine 캐시를 가지면 서버마다 데이터가 달라지는 불일치가 발생해요. 분산 환경에서는 Redis 같은 중앙 캐시를 쓰거나, Caffeine과 Redis를 조합한 2단계 캐시 전략이 필요해요.',
    },
  },
  {
    id: 'cache-caffeine-custom-cache',
    lang: 'java',
    title: 'Caffeine 보관함별 개별 설정',
    file: 'CacheConfig.java',
    code: `import com.github.benmanes.caffeine.cache.Caffeine;
import org.springframework.cache.caffeine.CaffeineCacheManager;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.concurrent.TimeUnit;

@Configuration
public class CacheConfig {
  @Bean
  public CaffeineCacheManager cacheManager() {
    System.out.println("[실행] Caffeine 멀티 캐시 매니저 생성");
    CaffeineCacheManager manager = new CaffeineCacheManager();
    manager.registerCustomCache("hotItems",
      Caffeine.newBuilder()
        .maximumSize(500)
        .expireAfterWrite(5, TimeUnit.MINUTES)
        .build());
    manager.registerCustomCache("searchResults",
      Caffeine.newBuilder()
        .maximumSize(200)
        .expireAfterWrite(1, TimeUnit.MINUTES)
        .build());
    System.out.println("[결과] 개별 캐시 등록 완료 - hotItems(500개/5분), searchResults(200개/1분)");
    return manager;
  }
}`,
    explain: {
      concept:
        '모든 데이터가 같은 수명과 크기를 갖는 건 아니에요. 인기 상품 목록은 자주 바뀌지 않으니 5분 보관하고, 검색 결과는 금방 낡으니 1분만 보관하는 게 합리적이에요. ' +
        'registerCustomCache를 쓰면 보관함마다 독립적인 설정을 적용할 수 있어서, 각 데이터 특성에 맞는 최적의 캐시 전략을 세울 수 있어요. ' +
        'CaffeineCacheManager에 캐시 이름을 미리 알려주지 않고 빈 생성자로 시작한 뒤 registerCustomCache로 필요한 보관함만 등록하고 있어요.',
      terms: [
        { t: 'registerCustomCache', d: '이름별로 개별 Caffeine 설정을 등록하는 메서드예요. 보관함마다 다른 크기·만료 정책을 적용할 수 있어요.' },
        { t: 'maximumSize(500)', d: 'hotItems 보관함은 최대 500개까지만 저장해요. 초과하면 가장 오래된 항목부터 제거돼요.' },
        { t: 'expireAfterWrite(5, MINUTES)', d: 'hotItems는 저장 후 5분이 지나면 자동 삭제돼요. 인기 상품이라 데이터가 좀 오래돼도 괜찮아서예요.' },
        { t: 'expireAfterWrite(1, MINUTES)', d: 'searchResults는 저장 후 1분 만에 삭제돼요. 검색 결과는 금방 낡기 때문에 빠르게 갱신돼야 해요.' },
        { t: 'build()', d: '빌더 설정을 마무리하고 실제 Cache 객체를 생성해요. 이 객체가 registerCustomCache에 전달돼요.' },
      ],
      expectedOutput:
        '앱 시작 시:\n' +
        '[실행] Caffeine 멀티 캐시 매니저 생성\n' +
        '[결과] 개별 캐시 등록 완료 - hotItems(500개/5분), searchResults(200개/1분)',
      realWorldUsage:
        '실제 전자상거래 프로젝트에서 hotItems는 메인 페이지의 인기 상품 섹션에, searchResults는 검색 결과 페이지에 사용되는 캐시예요. 인기 상품은 5분에 한 번 갱신해도 사용자가 체감하지 못하고, 검색 결과는 1분만 지나도 재고 변동으로 정보가 부정확해질 수 있어서 더 짧은 TTL을 적용해요.',
      why: '데이터 특성(신선도 요구사항, 크기)에 따라 보관함별로 최적의 만료 정책과 용량을 다르게 적용하려고요. 일률적인 설정은 어떤 데이터에는 과하고 어떤 데이터에는 부족해요.',
      pitfall: 'Caffeine은 순수 메모리 캐시라 디스크 저장을 지원하지 않아요. 앱 재시작 시 모든 데이터가 사라집니다. 디스크 오프로드가 필요하면 EhCache를 검토하세요.',
    },
  },
  {
    id: 'cache-ttl-redis',
    lang: 'java',
    title: 'Redis TTL 설정',
    file: 'CodeService.java',
    code: `import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.stereotype.Service;

import java.time.Duration;

@Service
public class CodeService {
  private final StringRedisTemplate redis;

  public CodeService(StringRedisTemplate redis) {
    this.redis = redis;
  }

  public void saveCode(String key, String code) {
    System.out.println("[실행] 인증 코드 저장 - key: " + key);
    redis.opsForValue().set(key, code, Duration.ofSeconds(60));
    System.out.println("[결과] 인증 코드 저장 완료 - TTL 60초");
  }
}`,
    explain: {
      concept:
        'TTL(Time To Live)은 데이터가 얼마나 살아있을지 정하는 만료 타이머예요. ' +
        '인증 코드 같은 데이터는 오래 남아 있으면 보안 위험이 커지기 때문에, 반드시 짧은 TTL을 설정해요. ' +
        'Redis의 set 명령에 Duration을 함께 전달하면 저장과 만료 설정이 원자적으로 처리돼서, 중간에 장애가 나도 데이터가 만료 없이 영구 저장되는 불상사를 막을 수 있어요. ' +
        'Duration.ofSeconds(60)은 60초, 즉 1분 뒤에 이 데이터가 Redis에서 자동으로 사라지게 해요.',
      terms: [
        { t: 'TTL (Time To Live)', d: '데이터의 수명이에요. 지정된 시간이 지나면 Redis가 자동으로 해당 데이터를 삭제해요.' },
        { t: 'Duration.ofSeconds(60)', d: '60초를 나타내는 Duration 객체예요. ofMinutes, ofHours 등으로 단위를 바꿀 수 있어요.' },
        { t: 'opsForValue().set', d: '키-값 저장과 TTL 설정을 한 번에 수행해요. 따로 expire를 호출하지 않아서 원자적이에요.' },
        { t: 'StringRedisTemplate', d: '문자열 전용 Redis 통신 도구예요. 키와 값 모두 String으로 주고받아요.' },
      ],
      expectedOutput:
        'saveCode("email:user@test.com", "123456") 호출 시:\n' +
        '[실행] 인증 코드 저장 - key: email:user@test.com\n' +
        '[결과] 인증 코드 저장 완료 - TTL 60초',
      realWorldUsage:
        '실제 프로젝트의 이메일 인증이나 SMS 인증 기능에서 이 패턴을 써요. 사용자가 인증 코드를 요청하면 60초 TTL로 Redis에 저장하고, 사용자가 입력한 코드와 Redis의 코드를 비교해 인증을 완료해요. 60초가 지나면 코드가 자동 삭제돼서 보안이 강화되고, 만료된 코드를 별도로 정리할 필요도 없어져요.',
      why: '인증 코드나 일회용 토큰처럼 짧은 시간만 유효해야 하는 민감 데이터를 안전하게 자동 폐기하려고요.',
      pitfall: 'set()과 expire()를 별도로 호출하는 것은 위험해요. 두 호출 사이에 네트워크 장애나 서버 크래시가 발생하면 TTL이 설정되지 않은 데이터가 영구 저장될 수 있어요. 항상 set(key, value, duration) 오버로드를 사용하세요.',
    },
  },
  {
    id: 'cache-redis-cache-manager',
    lang: 'java',
    title: 'RedisCacheManager 사용',
    file: 'CacheConfig.java',
    code: `import org.springframework.cache.CacheManager;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.redis.cache.RedisCacheConfiguration;
import org.springframework.data.redis.cache.RedisCacheManager;
import org.springframework.data.redis.connection.RedisConnectionFactory;

import java.time.Duration;

@Configuration
public class CacheConfig {
  @Bean
  public CacheManager cacheManager(RedisConnectionFactory factory) {
    System.out.println("[실행] RedisCacheManager 생성");
    RedisCacheConfiguration cfg = RedisCacheConfiguration.defaultCacheConfig()
      .entryTtl(Duration.ofMinutes(10))
      .disableCachingNullValues();
    CacheManager cm = RedisCacheManager.builder(factory)
      .cacheDefaults(cfg)
      .build();
    System.out.println("[결과] RedisCacheManager 등록 완료 - 기본 TTL 10분, null 캐싱 비활성");
    return cm;
  }
}`,
    explain: {
      concept:
        'RedisCacheManager는 스프링의 @Cacheable 같은 캐시 어노테이션이 내부적으로 Redis를 쓰도록 연결해주는 다리예요. ' +
        '이 설정 하나로 앱 전체의 캐시 저장소가 메모리에서 Redis로 바뀌어요 - @Cacheable("users")는 그대로 두고, 설정만 바꾸면 돼요. ' +
        'entryTtl로 모든 캐시의 기본 만료 시간을 10분으로 정하고, disableCachingNullValues로 null 값을 캐싱하지 않게 했어요. ' +
        'null이 캐싱되면 "데이터가 없음"이라는 결과가 계속 반환돼서 캐시 침투라는 보안·성능 문제가 생길 수 있어서, 실무에서는 항상 이 설정을 켜둬요.',
      terms: [
        { t: 'RedisCacheManager.builder(factory)', d: 'Redis를 캐시 저장소로 사용하는 CacheManager를 만드는 빌더예요.' },
        { t: 'entryTtl(Duration.ofMinutes(10))', d: '모든 캐시 항목의 기본 만료 시간을 10분으로 설정해요. 개별 캐시에서 덮어쓸 수 있어요.' },
        { t: 'disableCachingNullValues()', d: 'null 값을 캐시에 저장하지 않도록 해요. null 캐싱으로 인한 혼란을 방지해요.' },
        { t: 'cacheDefaults(cfg)', d: '이 설정을 모든 캐시의 기본값으로 적용해요. 개별 설정이 없으면 이 값을 따라요.' },
        { t: 'RedisConnectionFactory', d: 'Redis 서버 연결 정보를 담은 객체예요. application.yml의 spring.data.redis 설정에서 자동 구성돼요.' },
      ],
      expectedOutput:
        '앱 시작 시:\n' +
        '[실행] RedisCacheManager 생성\n' +
        '[결과] RedisCacheManager 등록 완료 - 기본 TTL 10분, null 캐싱 비활성',
      realWorldUsage:
        '실제 프로젝트에서 로컬 개발 환경은 ConcurrentMapCacheManager로, 운영 환경은 RedisCacheManager로 전환하는 패턴을 자주 써요. application.yml의 spring.cache.type=redis 설정 하나로 전체 캐시 인프라를 바꿀 수 있어요. 캐시 관련 코드는 하나도 안 고치고 말이에요.',
      why: '스프링의 캐시 추상화(@Cacheable 등)를 Redis로 구현하고, null 캐싱 방지·기본 TTL 등 운영에 필요한 최소한의 안전장치를 설정하려고요.',
      pitfall: 'disableCachingNullValues()를 호출하지 않으면 null도 캐싱돼요. 이렇게 되면 DB에 없는 데이터를 계속 조회할 때마다 캐시에서 null을 반환해 캐시 관통(cache penetration)이 발생하고, 의도치 않게 없는 데이터로 응답할 수 있어요.',
    },
  },
  {
    id: 'cache-caching-vs-cacheput',
    lang: 'java',
    title: '@Cacheable vs @CachePut 비교',
    file: 'ProductService.java',
    code: `import org.springframework.cache.annotation.CachePut;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;

@Service
public class ProductService {
  private final ProductRepository repo;

  public ProductService(ProductRepository repo) {
    this.repo = repo;
  }

  @Cacheable("products")
  public Product get(Long id) {
    System.out.println("[실행] DB에서 상품 조회 - id: " + id);
    return repo.findById(id).orElseThrow();
  }

  @CachePut(value = "products", key = "#result.id")
  public Product save(Product p) {
    System.out.println("[실행] 상품 저장 + 캐시 갱신 - id: " + p.getId());
    Product saved = repo.save(p);
    System.out.println("[결과] 저장 완료, 캐시에 새 값 반영됨");
    return saved;
  }
}`,
    explain: {
      concept:
        '이 코드는 @Cacheable과 @CachePut의 용도 차이를 한 클래스에서 보여주는 예제예요. ' +
        'get() 메서드는 @Cacheable을 써서 읽기 전용이에요 - 처음엔 DB 조회하고, 두 번째부터는 캐시에서 즉시 반환해요. ' +
        'save() 메서드는 @CachePut을 써서 쓰기 전용이에요 - 항상 DB에 저장하고 그 결과로 캐시를 덮어써요. ' +
        '읽기(get)와 쓰기(save)에 서로 다른 어노테이션을 쓰는 게 핵심이에요. 쓰기 작업에 @Cacheable을 써버리면, 한 번 저장한 후에는 다시 저장해도 캐시된 옛날 값만 반환되는 버그가 생겨요.',
      terms: [
        { t: '@Cacheable', d: '읽기 작업에 사용해요. 캐시에 값이 있으면 메서드를 건너뛰고 캐시 값을 바로 반환해요.' },
        { t: '@CachePut', d: '쓰기 작업에 사용해요. 항상 메서드를 실행하고 그 결과로 캐시를 갱신해요.' },
        { t: 'key = "#result.id"', d: 'save 메서드의 반환값(#result)에서 id 필드를 캐시 키로 사용해요. get과 동일한 키 체계를 유지해요.' },
        { t: 'repo.save(p)', d: 'JPA의 save 메서드로 엔티티를 저장하거나 수정해요. 반환값이 캐시에 반영돼요.' },
      ],
      expectedOutput:
        'save(p1) 호출 시:\n' +
        '[실행] 상품 저장 + 캐시 갱신 - id: 1\n' +
        '[결과] 저장 완료, 캐시에 새 값 반영됨\n' +
        'get(1L) 호출 시: (콘솔 출력 없음 - 캐시에서 반환, save로 갱신된 최신 값)',
      realWorldUsage:
        '실제 프로젝트의 상품 관리 시스템에서 get()은 상품 상세 페이지 API가 호출하고, save()는 관리자의 상품 수정 API가 호출해요. 관리자가 상품 가격을 수정하면 @CachePut이 캐시를 갱신하고, 이후 고객이 상세 페이지를 열면 @Cacheable이 최신 가격을 캐시에서 바로 보여줘요.',
      why: '읽기와 쓰기 작업을 분리해 각각에 최적화된 캐시 전략을 적용하고, 저장 후에도 캐시 일관성을 유지하려고요.',
      pitfall: 'save에서 캐시 키를 get과 다르게 지정하면, 저장된 데이터를 get에서 찾을 수 없어요. 두 어노테이션의 value와 key 전략을 동일하게 유지하는 게 핵심이에요.',
    },
  },
  {
    id: 'cache-multiple-caches',
    lang: 'java',
    title: '한 메서드 여러 캐시',
    file: 'UserService.java',
    code: `import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;

@Service
public class UserService {
  private final UserRepository userRepository;

  public UserService(UserRepository userRepository) {
    this.userRepository = userRepository;
  }

  @Cacheable({"users", "dashboard"})
  public User getUser(Long id) {
    System.out.println("[실행] DB 조회 - userId: " + id + " (캐시: users, dashboard)");
    User user = userRepository.findById(id).orElseThrow();
    System.out.println("[결과] 조회 완료, 두 보관함에 동시 저장됨");
    return user;
  }
}`,
    explain: {
      concept:
        '하나의 메서드 결과를 여러 보관함에 동시에 저장할 수 있어요. ' +
        '사용자 정보가 대시보드와 프로필 페이지 양쪽에서 필요하다면, 각각 다른 캐시 설정(예: 대시보드는 30초 TTL, 프로필은 10분 TTL)을 적용할 수 있어요. ' +
        '배열로 보관함 이름을 나열하면 스프링이 메서드 결과를 모든 보관함에 저장하고, 이후 조회에서 해당 보관함이 있으면 빠르게 반환해줘요. ' +
        '다만 여러 보관함을 쓸 때는 삭제(@CacheEvict)도 모든 보관함에 대해 일관성 있게 해줘야 한다는 점을 꼭 기억해야 해요.',
      terms: [
        { t: '@Cacheable({"users", "dashboard"})', d: '중괄호로 여러 보관함 이름을 나열해요. 결과가 users와 dashboard 두 곳에 동시 저장돼요.' },
        { t: '"users"', d: '사용자 정보 전용 보관함이에요. 프로필 페이지 등에서 이 보관함을 조회해요.' },
        { t: '"dashboard"', d: '대시보드 전용 보관함이에요. 대시보드 위젯이 이 보관함을 조회해요.' },
        { t: '배열 문법 {...}', d: '자바에서 여러 값을 {} 안에 쉼표로 나열하는 배열 표현이에요. value 속성은 String[] 타입이에요.' },
      ],
      expectedOutput:
        'getUser(1L) 첫 호출 시:\n' +
        '[실행] DB 조회 - userId: 1 (캐시: users, dashboard)\n' +
        '[결과] 조회 완료, 두 보관함에 동시 저장됨\n' +
        'getUser(1L) 두 번째 호출 시: (콘솔 출력 없음 - users 또는 dashboard 캐시에서 반환)',
      realWorldUsage:
        '실제 대시보드 프로젝트에서 사용자 프로필 정보는 여러 위젯이 각자 다른 캐시 보관함을 바라봐요. users 보관함은 10분 TTL로 운영되고, dashboard 보관함은 2분 TTL로 더 자주 갱신돼요. 한 번의 DB 조회 결과가 두 보관함에 동시에 저장되니 불필요한 중복 쿼리를 방지할 수 있어요.',
      why: '같은 데이터를 여러 화면이나 용도에서 빠르게 꺼내 쓸 수 있도록, 각 용도에 맞는 별도 보관함에 동시 저장하려고요.',
      pitfall: '데이터를 수정하거나 삭제할 때 모든 보관함에서 해당 키를 제거해야 해요. 하나만 지우고 다른 보관함에 옛날 데이터가 남아 있으면 화면마다 다른 정보를 보여주는 불일치가 발생해요.',
    },
  },
  {
    id: 'cache-cacheconfig-custom',
    lang: 'java',
    title: '캐시 이름별 다른 TTL',
    file: 'CacheConfig.java',
    code: `import org.springframework.cache.CacheManager;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.redis.cache.RedisCacheConfiguration;
import org.springframework.data.redis.cache.RedisCacheManager;
import org.springframework.data.redis.connection.RedisConnectionFactory;

import java.time.Duration;
import java.util.Map;

@Configuration
public class CacheConfig {
  @Bean
  public CacheManager cacheManager(RedisConnectionFactory factory) {
    System.out.println("[실행] RedisCacheManager 생성 - 보관함별 TTL 설정");
    RedisCacheConfiguration defaultCfg = RedisCacheConfiguration
      .defaultCacheConfig().entryTtl(Duration.ofMinutes(5));
    Map<String, RedisCacheConfiguration> perCache = Map.of(
      "tokens", RedisCacheConfiguration.defaultCacheConfig().entryTtl(Duration.ofSeconds(60)),
      "users", RedisCacheConfiguration.defaultCacheConfig().entryTtl(Duration.ofHours(1))
    );
    CacheManager cm = RedisCacheManager.builder(factory)
      .cacheDefaults(defaultCfg)
      .withInitialCacheConfigurations(perCache)
      .build();
    System.out.println("[결과] 설정 완료 - 기본 5분, tokens 60초, users 1시간");
    return cm;
  }
}`,
    explain: {
      concept:
        '데이터마다 적절한 수명이 다르다는 점을 캐시 설정에 반영한 코드예요. ' +
        '기본 TTL은 5분으로 두고, 토큰은 보안상 60초로 짧게, 사용자 정보는 1시간으로 길게 설정했어요. ' +
        'withInitialCacheConfigurations에 Map으로 보관함 이름과 설정을 매핑해서, 일괄 등록할 수 있어요. ' +
        'Map.of()로 생성한 불변 Map은 설정이 런타임에 우연히 변경되는 걸 막아줘서 안전해요.',
      terms: [
        { t: 'cacheDefaults(defaultCfg)', d: '이름이 명시되지 않은 모든 보관함에 적용될 기본 설정이에요. 여기서는 5분 TTL이에요.' },
        { t: 'withInitialCacheConfigurations', d: '보관함 이름별로 다른 설정을 Map 형태로 등록하는 메서드예요.' },
        { t: 'Map.of(key1, val1, key2, val2)', d: 'Java 9+의 불변 Map 생성 메서드예요. 최대 10쌍까지 간결하게 만들 수 있어요.' },
        { t: 'entryTtl(Duration.ofHours(1))', d: 'users 보관함의 만료 시간을 1시간으로 설정해요. 사용자 정보는 자주 바뀌지 않으니까 길게 가져가요.' },
        { t: 'entryTtl(Duration.ofSeconds(60))', d: 'tokens 보관함의 만료 시간을 60초로 설정해요. 보안 토큰은 짧게 유지하는 게 원칙이에요.' },
      ],
      expectedOutput:
        '앱 시작 시:\n' +
        '[실행] RedisCacheManager 생성 - 보관함별 TTL 설정\n' +
        '[결과] 설정 완료 - 기본 5분, tokens 60초, users 1시간',
      realWorldUsage:
        '실제 프로젝트에서 JWT 액세스 토큰은 tokens 보관함에 60초 TTL로 캐싱하고, 사용자 프로필은 users 보관함에 1시간 TTL로 캐싱해요. 관리자 페이지에서 조회하는 통계 데이터는 별도 stats 보관함에 10분 TTL로 설정하는 식으로, 데이터 성격에 맞는 최적의 만료 전략을 캐시 이름별로 설계할 수 있어요.',
      why: '데이터의 특성(보안 민감도, 변경 빈도, 용량)에 따라 수명을 다르게 관리해서, 캐시 효율과 데이터 신선도 사이의 균형을 맞추려고요.',
      pitfall: '기본 TTL을 너무 짧게 설정하면 대부분의 데이터가 만료돼서 캐시 효과가 거의 사라져요. 반대로 너무 길면 오래된 데이터가 계속 반환돼요. 데이터 특성을 잘 파악하고 적절한 중간값을 찾는 게 중요해요.',
    },
  },
  {
    id: 'cache-conditional-unless',
    lang: 'java',
    title: '@Cacheable unless 조건',
    file: 'UserService.java',
    code: `import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;

@Service
public class UserService {
  private final UserRepository userRepository;

  public UserService(UserRepository userRepository) {
    this.userRepository = userRepository;
  }

  @Cacheable(value = "users", unless = "#result == null")
  public User findOptional(Long id) {
    System.out.println("[실행] DB 조회 - userId: " + id);
    User user = userRepository.findById(id).orElse(null);
    if (user == null) {
      System.out.println("[결과] 사용자 없음 - 캐시 저장 안 함 (unless)");
    } else {
      System.out.println("[결과] 조회된 사용자: " + user.getName());
    }
    return user;
  }
}`,
    explain: {
      concept:
        'unless는 "반환값이 이 조건에 맞으면 캐시에 저장하지 말아요"라는 배제 규칙이에요. ' +
        '여기서는 조회 결과가 null이면 캐싱하지 않도록 설정했어요 - 없는 사용자를 계속 조회할 때마다 매번 DB까지 가서 확인하는 게 맞으니까요. ' +
        'condition이 인자 기준이라면, unless는 메서드 실행 결과 기준으로 판단하는 게 가장 큰 차이예요. ' +
        'null을 캐싱해버리면 "이 ID는 사용자가 없어요"라는 정보가 캐시에 남아서, 나중에 진짜 그 사용자가 등록돼도 한동안 없다고 응답하는 버그가 생겨요.',
      terms: [
        { t: 'unless = "#result == null"', d: '메서드 반환값이 null일 때는 캐시에 저장하지 않아요. 없는 데이터는 매번 DB에 물어봐요.' },
        { t: '#result', d: 'SpEL에서 메서드의 반환값을 가리키는 특별한 변수예요. 메서드 실행 후에야 값이 결정돼요.' },
        { t: 'orElse(null)', d: 'Optional이 비어있으면 null을 반환해요. 이 null을 unless가 감지하고 캐싱을 막아요.' },
        { t: 'condition vs unless', d: 'condition은 실행 전 인자로 판단, unless는 실행 후 결과로 판단해요. 용도가 완전히 달라요.' },
      ],
      expectedOutput:
        'findOptional(999L) - 없는 사용자:\n' +
        '[실행] DB 조회 - userId: 999\n' +
        '[결과] 사용자 없음 - 캐시 저장 안 함 (unless)\n\n' +
        'findOptional(1L) - 있는 사용자:\n' +
        '[실행] DB 조회 - userId: 1\n' +
        '[결과] 조회된 사용자: kim',
      realWorldUsage:
        '실제 프로젝트에서 탈퇴한 사용자나 존재하지 않는 ID로 프로필 조회 요청이 들어올 때, unless로 null 캐싱을 막아요. 만약 null을 캐싱했다면, 탈퇴 후 재가입한 사용자의 프로필이 캐시 만료 전까지 "없음"으로 표시되는 심각한 버그가 발생할 거예요.',
      why: '존재하지 않는 데이터를 캐싱해서 발생하는 오탐을 방지하려고요. null 캐싱은 "데이터가 없음"을 일시적인 현상이 아니라 영구적인 사실로 만들어버려요.',
      pitfall: 'condition과 unless를 헷갈리기 쉬워요. condition은 인자만 봐서 빠르게 판단하고, unless는 메서드를 실제로 실행한 후 결과를 봐서 판단해요. "결과가 null이면 캐싱 금지"는 무조건 unless로만 표현할 수 있어요.',
    },
  },
  {
    id: 'cache-redis-template-find',
    lang: 'java',
    title: 'Redis에서 값 조회',
    file: 'TokenService.java',
    code: `import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.stereotype.Service;

@Service
public class TokenService {
  private final StringRedisTemplate redis;

  public TokenService(StringRedisTemplate redis) {
    this.redis = redis;
  }

  public String getToken(String userId) {
    System.out.println("[실행] 토큰 조회 - userId: " + userId);
    String token = redis.opsForValue().get("token:" + userId);
    if (token == null) {
      System.out.println("[결과] 토큰 만료 또는 없음 - 예외 발생");
      throw new IllegalStateException("토큰이 만료됐어요");
    }
    System.out.println("[결과] 토큰 조회 성공");
    return token;
  }
}`,
    explain: {
      concept:
        'opsForValue().get()은 Redis에서 키로 값을 조회하는 가장 기본적인 읽기 메서드예요. ' +
        '키가 없거나 TTL이 만료됐으면 null이 반환돼서, null 체크를 통해 만료 여부를 판단할 수 있어요. ' +
        '여기서는 토큰이 null이면 만료된 것으로 간주하고 예외를 던져서 호출자에게 명확히 알려주고 있어요. ' +
        'Redis는 TTL이 지나면 자동 삭제하지만, 그 사이에 접근 타이밍이 엇갈릴 수 있어서 null 체크는 필수예요.',
      terms: [
        { t: 'opsForValue().get(key)', d: 'Redis에서 key로 값을 조회해요. 없거나 만료됐으면 null을 반환해요.' },
        { t: '"token:" + userId', d: 'userId로 구분된 토큰 키를 만들어요. saveToken에서 사용한 키와 정확히 일치해야 찾을 수 있어요.' },
        { t: 'IllegalStateException', d: '객체의 현재 상태가 메서드 호출에 적합하지 않을 때 던지는 예외예요. 만료·미인증에 자주 써요.' },
        { t: 'null 체크', d: 'Redis 조회 결과는 null일 수 있어서 반드시 확인해야 해요. 안 하면 NPE가 발생할 수 있어요.' },
      ],
      expectedOutput:
        'getToken("user1") - 토큰 존재 시:\n' +
        '[실행] 토큰 조회 - userId: user1\n' +
        '[결과] 토큰 조회 성공\n\n' +
        'getToken("user1") - 토큰 만료 시:\n' +
        '[실행] 토큰 조회 - userId: user1\n' +
        '[결과] 토큰 만료 또는 없음 - 예외 발생',
      realWorldUsage:
        '실제 프로젝트의 API 인증 필터에서 이 패턴으로 Redis에 저장된 토큰을 검증해요. 매 요청마다 Authorization 헤더에서 토큰을 추출하고 Redis에서 조회해서 유효성을 확인하고, null이면 401 Unauthorized를 반환해요. TTL 덕분에 로그아웃 기능을 구현하지 않아도 일정 시간 후 자동 로그아웃이 돼요.',
      why: '저장된 토큰을 조회하고 만료 여부를 판단해 인증 흐름을 제어하려고요. null 체크로 만료와 부재를 동시에 처리할 수 있어요.',
      pitfall: 'get()의 반환값이 null인지 항상 체크해야 해요. null 체크 없이 바로 사용하면 NullPointerException이 발생하고, 이걸 try-catch로만 처리하면 만료와 실제 에러를 구분할 수 없어져요.',
    },
  },
  {
    id: 'cache-evict-before-invocation',
    lang: 'java',
    title: '@CacheEvict 실행 전 삭제',
    file: 'UserService.java',
    code: `import org.springframework.cache.annotation.CacheEvict;
import org.springframework.stereotype.Service;

@Service
public class UserService {
  private final UserRepository userRepository;

  public UserService(UserRepository userRepository) {
    this.userRepository = userRepository;
  }

  @CacheEvict(value = "users", key = "#id", beforeInvocation = true)
  public void deleteUser(Long id) {
    System.out.println("[실행] 캐시 먼저 제거 후 삭제 시도 - userId: " + id);
    if (!userRepository.existsById(id)) {
      System.out.println("[결과] 존재하지 않는 사용자 - 캐시는 이미 제거됨");
      throw new IllegalArgumentException("없는 사용자예요");
    }
    userRepository.deleteById(id);
    System.out.println("[결과] 사용자 삭제 완료");
  }
}`,
    explain: {
      concept:
        'beforeInvocation=true는 "메서드 실행 전에 캐시를 먼저 지워주세요"라는 설정이에요. ' +
        '기본적으로 @CacheEvict는 메서드가 성공적으로 완료된 후에 캐시를 지우는데, 이 속성을 켜면 순서가 뒤집혀요. ' +
        '여기서는 existsById로 존재 여부를 먼저 확인하는 로직인데, 확인 전에 캐시를 먼저 지워서 "없는 사용자" 예외가 발생해도 캐시가 이미 제거된 상태예요. ' +
        '실패 가능성이 높은 작업에서 캐시를 미리 정리하고 싶을 때 유용하지만, 실패 후 캐시가 빈 상태로 남으니 신중하게 결정해야 해요.',
      terms: [
        { t: 'beforeInvocation = true', d: '메서드 본문 실행 전에 캐시 삭제를 먼저 수행해요. 기본값은 false(실행 후 삭제)예요.' },
        { t: 'existsById(id)', d: 'DB에 해당 id의 데이터가 있는지 확인하는 메서드예요. 없으면 false를 반환해요.' },
        { t: 'IllegalArgumentException', d: '메서드에 부적절한 인자가 전달됐을 때 던지는 예외예요. 없는 사용자 ID는 부적절한 인자로 간주해요.' },
        { t: 'deleteById', d: 'JPA가 제공하는 단일 엔티티 삭제 메서드예요. 내부적으로 DELETE SQL을 실행해요.' },
      ],
      expectedOutput:
        'deleteUser(1L) - 존재하는 사용자:\n' +
        '[실행] 캐시 먼저 제거 후 삭제 시도 - userId: 1\n' +
        '[결과] 사용자 삭제 완료\n\n' +
        'deleteUser(999L) - 없는 사용자:\n' +
        '[실행] 캐시 먼저 제거 후 삭제 시도 - userId: 999\n' +
        '[결과] 존재하지 않는 사용자 - 캐시는 이미 제거됨',
      realWorldUsage:
        '실제 프로젝트에서 대량 삭제 배치 작업이나 외부 API 연동 삭제처럼 실패 가능성이 있는 작업에서 이 설정을 써요. 삭제 작업 자체가 실패하더라도, 적어도 캐시의 오래된 데이터는 지워서 다음 조회에서 DB의 최신 상태를 반영하게 하는 전략이에요.',
      why: '메서드가 실패하더라도 캐시를 먼저 비워서, 다음 조회 시 최신 DB 상태를 반영하게 하려고요.',
      pitfall: '메서드가 실패했을 때 캐시만 먼저 비워진 상태가 되면, 이후 해당 데이터를 조회할 때 캐시 미스로 인해 DB 부하가 일시적으로 증가할 수 있어요. 자주 실패하는 메서드에 beforeInvocation을 쓰면 캐시가 무용지물이 돼요.',
    },
  },
];
