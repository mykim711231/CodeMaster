import type { Snippet } from '../../types';

export const cache: Snippet[] = [
  {
    id: 'cache-enable-caching',
    lang: 'java',
    title: '@EnableCaching',
    file: 'CacheConfig.java',
    code: `@Configuration
@EnableCaching
public class CacheConfig {
  @Bean
  public CacheManager cacheManager() {
    return new ConcurrentMapCacheManager("users", "products");
  }
}`,
    explain: {
      concept: '@EnableCaching은 "이제부터 캐시(임시 보관함)를 쓸 거야"라는 스위치예요. ConcurrentMapCacheManager는 메모리에 간단히 보관하는 기본 보관함이에요.',
      terms: [
        { t: '@EnableCaching', d: '캐시 기능 활성화 스위치' },
        { t: 'CacheManager', d: '캐시 보관함 관리자' },
        { t: 'ConcurrentMapCacheManager', d: '메모리 기반 기본 보관함' },
        { t: '"users", "products"', d: '보관함 이름(구역)' },
      ],
      why: '반복적인 계산이나 DB 조회를 줄이려고요.',
      pitfall: '이 보관함은 앱을 재시작하면 사라져요. 영속성이 필요하면 Redis를 쓰세요.',
    },
  },
  {
    id: 'cache-cacheable',
    lang: 'java',
    title: '@Cacheable 기본',
    file: 'UserService.java',
    code: `@Service
public class UserService {
  @Cacheable("users")
  public User getUser(Long id) {
    return userRepository.findById(id).orElseThrow();
  }
}`,
    explain: {
      concept: '@Cacheable은 "처음엔 계산하고, 두 번째부턴 결과를 보관함에서 꺼내줘요"라는 도구예요. 같은 질문은 두 번 계산하지 않아요.',
      terms: [
        { t: '@Cacheable', d: '결과를 캐시에 보관' },
        { t: '"users"', d: '캐시 보관함 이름' },
        { t: 'id', d: '캐시 키로 사용되는 인자' },
        { t: 'orElseThrow', d: '값이 없으면 예외 던지기' },
      ],
      why: '같은 데이터를 반복 조회할 때 DB 부하를 줄이려고요.',
      pitfall: 'null을 반환하는 메서드에 @Cacheable을 쓸 경우 unless="#result == null"을 추가해 null이 캐싱되지 않도록 하세요. 이 예시는 orElseThrow()로 null을 반환하지 않아요.',
    },
  },
  {
    id: 'cache-cacheable-key',
    lang: 'java',
    title: '@Cacheable 키 지정',
    file: 'ProductService.java',
    code: `@Cacheable(value = "products", key = "#id")
public Product getProduct(Long id) {
  return productRepository.findById(id).orElseThrow();
}`,
    explain: {
      concept: '캐시 키는 보관함 서랍의 번호예요. 인자를 직접 지정해서 정확히 그 서랍에서 꺼내도록 해요.',
      terms: [
        { t: 'value', d: '캐시 보관함 이름' },
        { t: 'key', d: '보관함 안의 키(서랍 번호)' },
        { t: '#id', d: '메서드 인자 id를 가리키는 SpEL 표현식' },
      ],
      why: '복수 인자일 때 어떤 값을 키로 쓸지 명확히 하려고요.',
      pitfall: 'SpEL 문법이 틀리면 런타임 에러가 나요. 인자 이름과 # 뒤를 일치시키세요.',
    },
  },
  {
    id: 'cache-cacheable-condition',
    lang: 'java',
    title: '@Cacheable 조건부 캐싱',
    file: 'UserService.java',
    code: `@Cacheable(value = "users", condition = "#id > 100")
public User getUser(Long id) {
  return userRepository.findById(id).orElseThrow();
}`,
    explain: {
      concept: 'condition은 "조건이 맞을 때만 보관함에 넣어요"라는 거예요. id가 100보다 큰 경우만 캐싱해요.',
      terms: [
        { t: 'condition', d: '캐시 저장 조건' },
        { t: '#id > 100', d: 'id가 100 초과일 때만 저장' },
        { t: 'unless', d: '반환값 기반 제외 조건 (반대 개념)' },
      ],
      why: '모든 데이터를 캐싱하면 메모리가 부족해질 수 있어요.',
      pitfall: 'condition은 인자 기준, unless는 결과 기준이에요. 헷갈리지 마세요.',
    },
  },
  {
    id: 'cache-cacheevict',
    lang: 'java',
    title: '@CacheEvict로 캐시 삭제',
    file: 'UserService.java',
    code: `@CacheEvict(value = "users", key = "#id")
public void deleteUser(Long id) {
  userRepository.deleteById(id);
}`,
    explain: {
      concept: '@CacheEvict는 데이터가 바뀌었을 때 보관함의 옛날 값을 지워요. 안 그러면 삭제된 데이터가 계속 보여요.',
      terms: [
        { t: '@CacheEvict', d: '캐시에서 항목 제거' },
        { t: 'value', d: '캐시 보관함 이름' },
        { t: 'key', d: '삭제할 키' },
        { t: 'deleteById', d: 'DB에서 삭제' },
      ],
      why: '데이터 변경 후 캐시와 DB 불일치를 막으려고요.',
      pitfall: 'key를 생략하면 Spring이 메서드 인자(여기서는 id)를 기본 키로 씁니다. 단, 인자가 여러 개이거나 키 생성 규칙이 @Cacheable과 다를 때는 key를 명시적으로 지정해야 일관성이 유지돼요.',
    },
  },
  {
    id: 'cache-cacheevict-all',
    lang: 'java',
    title: '@CacheEvict 전체 비우기',
    file: 'UserService.java',
    code: `@CacheEvict(value = "users", allEntries = true)
public void clearAllUsers() {
  userRepository.deleteAll();
}`,
    explain: {
      concept: 'allEntries=true는 보관함 전체를 비워요. 한꺼번에 초기화할 때 써요.',
      terms: [
        { t: 'allEntries', d: '전체 항목 삭제 여부' },
        { t: '@CacheEvict', d: '캐시 제거 어노테이션' },
        { t: 'deleteAll', d: 'DB의 모든 데이터 삭제' },
      ],
      why: '개별 키를 일일이 지우기 어려울 때 한 번에 정리하려고요.',
      pitfall: '자주 쓰면 캐시 효과가 떨어져요. 진짜 필요할 때만 쓰세요.',
    },
  },
  {
    id: 'cache-cacheput',
    lang: 'java',
    title: '@CachePut으로 캐시 갱신',
    file: 'UserService.java',
    code: `@CachePut(value = "users", key = "#user.id")
public User updateUser(User user) {
  return userRepository.save(user);
}`,
    explain: {
      concept: '@CachePut은 메서드를 무조건 실행하고 그 결과로 보관함을 덮어써요. 옛날 값을 새 값으로 바꾸는 거예요.',
      terms: [
        { t: '@CachePut', d: '실행 후 결과로 캐시 갱신' },
        { t: '#user.id', d: '객체 user의 id 필드' },
        { t: 'save', d: 'DB에 저장(있으면 수정)' },
      ],
      why: '수정된 데이터를 캐시에도 반영하려고요.',
      pitfall: '@Cacheable과 다르게 무조건 실행돼요. 헷갈리지 마세요.',
    },
  },
  {
    id: 'cache-redis-template',
    lang: 'java',
    title: 'RedisTemplate 설정',
    file: 'RedisConfig.java',
    code: `@Bean
public RedisTemplate<String, Object> redisTemplate(RedisConnectionFactory factory) {
  RedisTemplate<String, Object> template = new RedisTemplate<>();
  template.setConnectionFactory(factory);
  template.setKeySerializer(new StringRedisSerializer());
  template.setValueSerializer(new GenericJackson2JsonRedisSerializer());
  return template;
}`,
    explain: {
      concept: 'RedisTemplate는 Redis(외부 보관창고)에 데이터를 넣고 빼는 도구예요. 직렬화 방식을 정해 문자열과 JSON으로 주고받아요.',
      terms: [
        { t: 'RedisTemplate', d: 'Redis 접근 도구' },
        { t: 'RedisConnectionFactory', d: 'Redis 연결 공장' },
        { t: 'setKeySerializer', d: '키를 문자열로 직렬화' },
        { t: 'StringRedisSerializer', d: '문자열 직렬화 도구' },
        { t: 'GenericJackson2JsonRedisSerializer', d: '값을 JSON으로 직렬화' },
      ],
      why: '여러 서버가 같은 캐시를 공유하려고 Redis를 써요.',
      pitfall: '직렬화를 설정하지 않으면 깨진 문자가 들어가요.',
    },
  },
  {
    id: 'cache-redis-ops-value',
    lang: 'java',
    title: 'Redis ValueOperations',
    file: 'TokenService.java',
    code: `@Service
public class TokenService {
  private final StringRedisTemplate redis;

  public void saveToken(String userId, String token) {
    redis.opsForValue().set("token:" + userId, token, Duration.ofMinutes(30));
  }
}`,
    explain: {
      concept: 'opsForValue는 Redis에서 가장 단순한 "키-값" 보관 방식이에요. 만료 시간도 함께 정할 수 있어요.',
      terms: [
        { t: 'StringRedisTemplate', d: '문자열 전용 Redis 도구' },
        { t: 'opsForValue', d: '키-값 연산 도구' },
        { t: 'set', d: '값 저장' },
        { t: 'Duration.ofMinutes', d: '30분짜리 시간' },
      ],
      why: '로그인 토큰 같은 임시 데이터를 자동 만료시키려고요.',
      pitfall: 'TTL을 안 주면 영구 저장돼서 메모리가 찰 수 있어요.',
    },
  },
  {
    id: 'cache-redis-ops-hash',
    lang: 'java',
    title: 'Redis HashOperations',
    file: 'CartService.java',
    code: `@Service
public class CartService {
  private final StringRedisTemplate redis;

  public void addItem(String userId, String itemId, int qty) {
    redis.opsForHash().put("cart:" + userId, itemId, String.valueOf(qty));
  }
}`,
    explain: {
      concept: 'opsForHash는 보관함 안에 또 작은 서랍을 둔 것 같아요. 한 사용자의 장바구니 안에 여러 상품을 따로 보관해요.',
      terms: [
        { t: 'opsForHash', d: '해시(서랍형) 연산 도구' },
        { t: 'put', d: '필드에 값 저장' },
        { t: '"cart:" + userId', d: '사용자별 장바구니 키' },
        { t: 'String.valueOf(qty)', d: 'int를 String으로 변환 — StringRedisTemplate은 문자열만 허용' },
      ],
      why: '한 사용자의 여러 값을 그룹으로 묶어 보관하려고요.',
      pitfall: 'StringRedisTemplate은 값을 String으로만 저장해요. int나 Object를 그대로 넣으면 런타임에 IllegalArgumentException이 나요. 반드시 String.valueOf()로 변환하세요.',
    },
  },
  {
    id: 'cache-caffeine-config',
    lang: 'java',
    title: 'Caffeine 캐시 매니저',
    file: 'CacheConfig.java',
    code: `@Bean
public CaffeineCacheManager cacheManager() {
  CaffeineCacheManager manager = new CaffeineCacheManager("users");
  manager.setCaffeine(Caffeine.newBuilder()
    .expireAfterWrite(10, TimeUnit.MINUTES)
    .maximumSize(1000));
  return manager;
}`,
    explain: {
      concept: 'Caffeine은 매우 빠른 인메모리 캐시 라이브러리예요. 쓰고 나서 10분 뒤 자동 만료, 최대 1000개까지만 보관해요.',
      terms: [
        { t: 'CaffeineCacheManager', d: 'Caffeine 기반 보관함 관리자' },
        { t: 'Caffeine.newBuilder', d: '캐시 설정 빌더' },
        { t: 'expireAfterWrite', d: '쓰고 N분 뒤 만료' },
        { t: 'maximumSize', d: '최대 항목 수' },
        { t: 'TimeUnit.MINUTES', d: '시간 단위(분)' },
      ],
      why: '인메모리라 매우 빠르고 단일 서버에 적합해요.',
      pitfall: '여러 서버에서는 각자 캐시를 가져서 불일치가 생겨요.',
    },
  },
  {
    id: 'cache-caffeine-custom-cache',
    lang: 'java',
    title: 'Caffeine 보관함별 개별 설정',
    file: 'CacheConfig.java',
    code: `@Bean
public CaffeineCacheManager cacheManager() {
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
  return manager;
}`,
    explain: {
      concept: 'Caffeine은 순수 인메모리 캐시예요. registerCustomCache로 보관함마다 크기와 만료 시간을 다르게 설정할 수 있어요. 디스크 저장은 지원하지 않아요.',
      terms: [
        { t: 'registerCustomCache', d: '보관함에 개별 Caffeine 설정 등록' },
        { t: 'maximumSize', d: '보관함 최대 항목 수' },
        { t: 'expireAfterWrite', d: '쓰기 후 만료 시간' },
        { t: 'Caffeine.newBuilder().build()', d: '개별 캐시 인스턴스 생성' },
      ],
      why: '보관함마다 크기나 수명이 다를 때 각각 맞게 설정하려고요.',
      pitfall: 'Caffeine은 디스크 저장을 지원하지 않아요. 디스크 오프로드가 필요하면 EhCache나 Redis를 쓰세요.',
    },
  },
  {
    id: 'cache-ttl-redis',
    lang: 'java',
    title: 'Redis TTL 설정',
    file: 'CodeService.java',
    code: `@Service
public class CodeService {
  private final StringRedisTemplate redis;

  public void saveCode(String key, String code) {
    redis.opsForValue().set(key, code, Duration.ofSeconds(60));
  }
}`,
    explain: {
      concept: 'set에 Duration을 함께 주면 데이터가 60초 뒤 자동으로 사라져요. 인증 코드처럼 짧게 살아야 하는 데이터에 써요.',
      terms: [
        { t: 'Duration.ofSeconds', d: '초 단위 시간' },
        { t: 'opsForValue().set', d: '값과 TTL을 한 번에 저장' },
        { t: 'TTL', d: '만료 시간(Time To Live)' },
      ],
      why: '오래된 데이터가 계속 남아 위험해지는 걸 막으려고요.',
      pitfall: 'set과 expire를 따로 호출하면 두 호출 사이에 장애가 날 때 영구 저장될 수 있어요. TTL은 set 호출 시 한 번에 지정하세요.',
    },
  },
  {
    id: 'cache-redis-cache-manager',
    lang: 'java',
    title: 'RedisCacheManager 사용',
    file: 'CacheConfig.java',
    code: `@Bean
public CacheManager cacheManager(RedisConnectionFactory factory) {
  RedisCacheConfiguration cfg = RedisCacheConfiguration.defaultCacheConfig()
    .entryTtl(Duration.ofMinutes(10))
    .disableCachingNullValues();
  return RedisCacheManager.builder(factory)
    .cacheDefaults(cfg)
    .build();
}`,
    explain: {
      concept: 'RedisCacheManager는 @Cacheable 같은 어노테이션이 Redis를 쓰도록 연결해줘요. 기본 TTL을 10분으로 정해요.',
      terms: [
        { t: 'RedisCacheConfiguration', d: 'Redis 캐시 설정 상자' },
        { t: 'entryTtl', d: '항목 기본 만료 시간' },
        { t: 'disableCachingNullValues', d: 'null 값 캐싱 금지' },
        { t: 'RedisCacheManager.builder', d: 'Redis 매니저 빌더' },
      ],
      why: '스프링 캐시 추상화를 Redis로 구현하려고요.',
      pitfall: 'null 캐싱을 끄지 않으면 캐시 침투가 생길 수 있어요.',
    },
  },
  {
    id: 'cache-caching-vs-cacheput',
    lang: 'java',
    title: '@Cacheable vs @CachePut 비교',
    file: 'ProductService.java',
    code: `@Cacheable("products")
public Product get(Long id) { return repo.findById(id).orElseThrow(); }

@CachePut(value = "products", key = "#result.id")
public Product save(Product p) { return repo.save(p); }`,
    explain: {
      concept: '@Cacheable은 결과가 있으면 메서드 생략, @CachePut은 무조건 실행하고 결과로 갱신해요. 읽기 vs 쓰기 용도 차이예요.',
      terms: [
        { t: '@Cacheable', d: '조회 시 캐시 사용' },
        { t: '@CachePut', d: '저장/수정 후 캐시 갱신' },
        { t: '#result', d: '반환값을 가리키는 SpEL' },
        { t: '#result.id', d: '반환값의 id 필드를 키로' },
      ],
      why: '읽기와 쓰기를 분리해 일관성을 유지하려고요.',
      pitfall: 'save에서 키를 잘못 지정하면 조회할 때 못 찾아요.',
    },
  },
  {
    id: 'cache-multiple-caches',
    lang: 'java',
    title: '한 메서드 여러 캐시',
    file: 'UserService.java',
    code: `@Cacheable({"users", "dashboard"})
public User getUser(Long id) {
  return userRepository.findById(id).orElseThrow();
}`,
    explain: {
      concept: '배열로 여러 보관함 이름을 주면 같은 결과를 여러 보관함에 동시에 보관해요. 화면마다 다른 보관함을 쓸 때 편해요.',
      terms: [
        { t: '@Cacheable({...})', d: '여러 캐시에 동시 저장' },
        { t: '"users"', d: '사용자 보관함' },
        { t: '"dashboard"', d: '대시보드 보관함' },
      ],
      why: '한 데이터를 여러 용도로 빠르게 꺼내 쓰려고요.',
      pitfall: '수정 시 모든 보관함에서 지워야 일관성이 유지돼요.',
    },
  },
  {
    id: 'cache-cacheconfig-custom',
    lang: 'java',
    title: '캐시 이름별 다른 TTL',
    file: 'CacheConfig.java',
    code: `@Bean
public CacheManager cacheManager(RedisConnectionFactory factory) {
  RedisCacheConfiguration defaultCfg = RedisCacheConfiguration
    .defaultCacheConfig().entryTtl(Duration.ofMinutes(5));
  Map<String, RedisCacheConfiguration> perCache = Map.of(
    "tokens", RedisCacheConfiguration.defaultCacheConfig().entryTtl(Duration.ofSeconds(60)),
    "users", RedisCacheConfiguration.defaultCacheConfig().entryTtl(Duration.ofHours(1))
  );
  return RedisCacheManager.builder(factory)
    .cacheDefaults(defaultCfg)
    .withInitialCacheConfigurations(perCache)
    .build();
}`,
    explain: {
      concept: '보관함마다 다른 만료 시간을 정할 수 있어요. 토큰은 짧게, 사용자는 길게 보관하는 식이에요.',
      terms: [
        { t: 'RedisCacheConfiguration', d: 'Redis 캐시 설정' },
        { t: 'entryTtl', d: '만료 시간' },
        { t: 'withInitialCacheConfigurations', d: '보관함별 설정' },
        { t: 'Map.of', d: '불변 맵 생성' },
      ],
      why: '데이터 특성에 따라 수명을 다르게 관리하려고요.',
      pitfall: '기본 TTL을 너무 짧게 하면 캐시 효과가 떨어져요.',
    },
  },
  {
    id: 'cache-conditional-unless',
    lang: 'java',
    title: '@Cacheable unless 조건',
    file: 'UserService.java',
    code: `@Cacheable(value = "users", unless = "#result == null")
public User findOptional(Long id) {
  return userRepository.findById(id).orElse(null);
}`,
    explain: {
      concept: 'unless는 "결과가 이럴 땐 보관하지 마요"라는 조건이에요. null인 결과는 보관하지 않아요.',
      terms: [
        { t: 'unless', d: '결과 기반 캐시 제외 조건' },
        { t: '#result', d: '반환값' },
        { t: 'orElse(null)', d: '없으면 null 반환' },
      ],
      why: '빈 결과를 캐싱하면 잘못된 캐시가 오래 남아요.',
      pitfall: 'null을 캐싱하면 다른 사용자에게도 없는 데이터로 응답할 수 있어요.',
    },
  },
  {
    id: 'cache-redis-template-find',
    lang: 'java',
    title: 'Redis에서 값 조회',
    file: 'TokenService.java',
    code: `public String getToken(String userId) {
  String token = redis.opsForValue().get("token:" + userId);
  if (token == null) {
    throw new IllegalStateException("토큰이 만료됐어요");
  }
  return token;
}`,
    explain: {
      concept: 'get은 보관함에서 값을 꺼내요. 없으면 만료된 것으로 보고 예외를 던져요.',
      terms: [
        { t: 'opsForValue().get', d: '키로 값 조회' },
        { t: '"token:" + userId', d: '조회할 키' },
        { t: 'IllegalStateException', d: '잘못된 상태일 때 던지는 예외' },
      ],
      why: '만료된 토큰은 사용하면 안 되기 때문이에요.',
      pitfall: 'null 체크 없이 쓰면 NPE가 나요. 반드시 확인하세요.',
    },
  },
  {
    id: 'cache-evict-before-invocation',
    lang: 'java',
    title: '@CacheEvict 실행 전 삭제',
    file: 'UserService.java',
    code: `@CacheEvict(value = "users", key = "#id", beforeInvocation = true)
public void deleteUser(Long id) {
  if (!userRepository.existsById(id)) {
    throw new IllegalArgumentException("없는 사용자예요");
  }
  userRepository.deleteById(id);
}`,
    explain: {
      concept: 'beforeInvocation=true는 메서드가 실행되기 전에 캐시를 먼저 지워요. 예외가 나도 이미 지워진 상태가 돼요.',
      terms: [
        { t: 'beforeInvocation', d: '실행 전 캐시 삭제 여부' },
        { t: '@CacheEvict', d: '캐시 제거 어노테이션' },
        { t: 'existsById', d: '존재 여부 확인' },
      ],
      why: '실패 가능성이 높은 작업에서 미리 캐시를 비우려고요.',
      pitfall: '실패 후에도 캐시가 비워져서 재조회 시 DB 부하가 생길 수 있어요.',
    },
  },
];
