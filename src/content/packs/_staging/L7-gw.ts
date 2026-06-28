import type { Snippet } from '../../types';

export const gateway: Snippet[] = [
  {
    id: 'gw-route-basic',
    lang: 'java',
    title: 'RouteLocator 기본 라우트',
    file: 'RouteConfig.java',
    code: `@Bean
public RouteLocator routes(RouteLocatorBuilder b) {
  return b.routes()
    .route("to-user", r -> r.path("/user/**")
        .uri("http://localhost:9000"))
    .build();
}`,
    explain: {
      concept: '게이트웨이는 출입구에서 요청이 갈 길을 정해줘요. "/user로 오면 9000번으로 보내라" 같은 규칙을 만드는 거예요.',
      terms: [
        { t: 'RouteLocatorBuilder', d: '라우트 규칙을 만드는 도구' },
        { t: 'route("to-user", ...)', d: '이 라우트의 이름과 내용' },
        { t: 'path("/user/**")', d: '이 경로로 오는 요청을 잡아요.' },
        { t: 'uri(...)', d: '이쪽으로 보내요.' },
      ],
      why: '여러 서비스로 요청을 분산시키려고 해요.',
      pitfall: 'path의 **는 하위 경로까지 포함이에요.',
    },
  },
  {
    id: 'gw-route-multi',
    lang: 'java',
    title: '여러 라우트 한 번에 정의',
    file: 'MultiRouteConfig.java',
    code: `@Bean
public RouteLocator routes(RouteLocatorBuilder b) {
  return b.routes()
    .route("user", r -> r.path("/user/**").uri("lb://user-service"))
    .route("order", r -> r.path("/order/**").uri("lb://order-service"))
    .build();
}`,
    explain: {
      concept: '한 곳에서 여러 라우트를 이어서 쓸 수 있어요. 여러 출구를 한 번에 만드는 것과 같아요.',
      terms: [
        { t: 'lb://user-service', d: '로드밸런서로 등록된 user-service로 보내요.' },
        { t: '.route(...).route(...)', d: '라우트를 메서드 체이닝으로 여러 개 이어서 정의해요.' },
        { t: '.build()', d: '지금까지 정의한 라우트를 묶어 RouteLocator 객체로 만들어요.' },
      ],
      why: '여러 마이크로서비스를 한 게이트웨이에서 관리하려고 해요.',
      pitfall: 'lb를 쓰려면 서비스 디스커버리(예: 유레카)가 필요해요.',
    },
  },
  {
    id: 'gw-predicate-host',
    lang: 'java',
    title: 'Host Predicate로 호스트 매칭',
    file: 'HostRouteConfig.java',
    code: `@Bean
public RouteLocator routes(RouteLocatorBuilder b) {
  return b.routes()
    .route("by-host", r -> r.host("api.example.com")
        .uri("lb://api-service"))
    .build();
}`,
    explain: {
      concept: 'host Predicate는 요청의 도메인 이름을 보고 길을 정해요. "api.example.com으로 오면 여기로" 식이에요.',
      terms: [
        { t: 'host("api.example.com")', d: '이 호스트로 오면 잡아요.' },
        { t: 'Predicate', d: '요청이 조건에 맞는지 검사하는 규칙' },
        { t: 'uri("lb://api-service")', d: '조건에 맞으면 이 서비스로 보내요.' },
      ],
      why: '한 IP에 여러 도메인이 있을 때 각각 다른 서비스로 보내려고 해요.',
      pitfall: 'host는 요청 헤더의 Host 값을 보는 거예요.',
    },
  },
  {
    id: 'gw-predicate-method',
    lang: 'java',
    title: 'Method Predicate로 HTTP 메서드 매칭',
    file: 'MethodRouteConfig.java',
    code: `@Bean
public RouteLocator routes(RouteLocatorBuilder b) {
  return b.routes()
    .route("get-only", r -> r.method("GET")
        .and().path("/items/**")
        .uri("lb://item-service"))
    .build();
}`,
    explain: {
      concept: 'method Predicate는 HTTP 메서드(GET, POST 등)를 보고 길을 정해요. "GET 요청만 이리로" 식이에요.',
      terms: [
        { t: 'method("GET")', d: 'GET 요청만 잡아요.' },
        { t: 'and()', d: '조건 두 개를 둘 다 맞아야 한다고 엮어요.' },
        { t: 'path("/items/**")', d: '/items/ 하위 경로를 추가 조건으로 지정해요.' },
      ],
      why: '읽기와 쓰기를 다른 서비스로 보낼 수 있어요.',
      pitfall: 'and() 없이 method() 뒤에 바로 path()를 호출하면 컴파일 에러가 발생해요. BooleanSpec에는 path()가 없으므로, 반드시 .and()로 PredicateSpec으로 돌아온 뒤 다음 조건을 추가해야 해요.',
    },
  },
  {
    id: 'gw-filter-add-header',
    lang: 'java',
    title: 'AddRequestHeader 필터',
    file: 'HeaderFilterConfig.java',
    code: `@Bean
public RouteLocator routes(RouteLocatorBuilder b) {
  return b.routes()
    .route("add-header", r -> r.path("/secure/**")
        .filters(f -> f.addRequestHeader("X-Trace", "gw"))
        .uri("lb://service"))
    .build();
}`,
    explain: {
      concept: '필터는 요청이 지나가면서 추가 작업을 하는 검색대 같아요. 출입구에서 표를 붙여주는 거예요.',
      terms: [
        { t: 'filters(f -> ...)', d: '필터 목록을 정해요.' },
        { t: 'addRequestHeader', d: '요청에 헤더를 하나 추가해요.' },
        { t: '"X-Trace", "gw"', d: '추가할 헤더 이름과 값이에요.' },
      ],
      why: '하위 서비스에서 추적/인증 정보를 받을 수 있어요.',
      pitfall: '필터 순서에 따라 값이 덮일 수 있어요.',
    },
  },
  {
    id: 'gw-filter-rewrite-path',
    lang: 'java',
    title: 'RewritePath 필터',
    file: 'RewriteConfig.java',
    code: `@Bean
public RouteLocator routes(RouteLocatorBuilder b) {
  return b.routes()
    .route("rewrite", r -> r.path("/api/**")
        .filters(f -> f.rewritePath("/api/(.*)", "/$1"))
        .uri("lb://service"))
    .build();
}`,
    explain: {
      concept: 'RewritePath는 요청 경로를 고쳐서 보내요. "앞의 /api를 떼고 보내라"처럼 길을 다시 쓰는 거예요.',
      terms: [
        { t: 'rewritePath(regexp, replacement)', d: '첫 인자는 잡을 패턴, 두 번째는 바꿀 형태예요.' },
        { t: '/api/(.*)', d: '/api/ 뒤의 모든 부분을 첫 번째 그룹으로 잡아요.' },
        { t: '/$1', d: '첫 번째 캡처 그룹 내용으로 경로를 대체해요.' },
      ],
      why: '프론트는 /api로 보내고 서비스는 /로 받도록 맞출 수 있어요.',
      pitfall: '정규식 그룹을 쓰지 않으면 $1로 치환할 내용이 없어요.',
    },
  },
  {
    id: 'gw-filter-prefix-path',
    lang: 'java',
    title: 'PrefixPath 필터',
    file: 'PrefixConfig.java',
    code: `@Bean
public RouteLocator routes(RouteLocatorBuilder b) {
  return b.routes()
    .route("prefix", r -> r.path("/user/**")
        .filters(f -> f.prefixPath("/api/v1"))
        .uri("lb://user-service"))
    .build();
}`,
    explain: {
      concept: 'PrefixPath는 경로 앞에 공통 접두를 붙여요. 모든 요청에 "/api/v1"을 앞에 붙이는 거예요.',
      terms: [
        { t: 'prefixPath("/api/v1")', d: '경로 앞에 /api/v1을 붙여요.' },
        { t: 'filters(f -> ...)', d: '이 라우트에 적용할 필터 목록을 람다로 정의해요.' },
        { t: 'GatewayFilter', d: 'prefixPath 같은 내장 필터가 구현하는 인터페이스예요.' },
      ],
      why: '하위 서비스의 URL 구조를 그대로 유지하면서 게이트웨이에서 보정할 수 있어요.',
      pitfall: '이미 /api가 있으면 이중으로 붙어요.',
    },
  },
  {
    id: 'gw-filter-stripprefix',
    lang: 'java',
    title: 'StripPrefix 필터',
    file: 'StripConfig.java',
    code: `@Bean
public RouteLocator routes(RouteLocatorBuilder b) {
  return b.routes()
    .route("strip", r -> r.path("/api/user/**")
        .filters(f -> f.stripPrefix(2))
        .uri("lb://user-service"))
    .build();
}`,
    explain: {
      concept: 'StripPrefix는 경로 앞의 몇 칸을 잘라 버려요. "/api/user/1"에서 2칸을 자르면 "/1"만 남아요.',
      terms: [
        { t: 'stripPrefix(2)', d: '경로 앞 2칸을 잘라버려요.' },
        { t: '경로 세그먼트', d: '슬래시(/)로 구분된 경로 조각 하나예요. /api/user/1은 세 칸이에요.' },
        { t: 'filters(f -> ...)', d: '이 라우트에만 적용할 필터를 정의해요.' },
      ],
      why: '하위 서비스는 게이트웨이 전용 접두 없이 깨끗한 경로를 받을 수 있어요.',
      pitfall: '잘라낼 칸수를 잘못 주면 경로가 엉켜요.',
    },
  },
  {
    id: 'gw-global-filter',
    lang: 'java',
    title: 'GlobalFilter 구현',
    file: 'LoggingFilter.java',
    code: `@Component
public class LoggingFilter implements GlobalFilter {
  @Override
  public Mono<Void> filter(ServerWebExchange exchange, GatewayFilterChain chain) {
    System.out.println("request: " + exchange.getRequest().getPath());
    return chain.filter(exchange);
  }
}`,
    explain: {
      concept: 'GlobalFilter는 모든 라우트에 공통으로 끼워지는 검문소예요. 어느 출구로 가든 무조건 지나쳐요.',
      terms: [
        { t: '@Component', d: '스프링이 알아서 만들어 쓰게 해요.' },
        { t: 'GlobalFilter', d: '모든 라우트에 공통으로 끼는 필터' },
        { t: 'ServerWebExchange', d: '요청과 응답을 묶은 교환 상자' },
        { t: 'GatewayFilterChain', d: '다음 필터로 넘기는 고리' },
        { t: 'chain.filter(exchange)', d: '다음 검문소로 넘어가요.' },
      ],
      why: '로깅·인증 같은 공통 작업을 한 곳에서 처리하려고 해요.',
      pitfall: 'chain.filter를 안 부르면 요청이 멈춰요.',
    },
  },
  {
    id: 'gw-global-filter-ordered',
    lang: 'java',
    title: 'GlobalFilter 순서 지정',
    file: 'AuthFilter.java',
    code: `@Component
public class AuthFilter implements GlobalFilter, Ordered {
  @Override
  public Mono<Void> filter(ServerWebExchange exchange, GatewayFilterChain chain) {
    String token = exchange.getRequest().getHeaders().getFirst("X-Token");
    if (token == null) {
      return Mono.error(new RuntimeException("no token"));
    }
    return chain.filter(exchange);
  }

  @Override
  public int getOrder() {
    return -100;
  }
}`,
    explain: {
      concept: 'Ordered는 검문소들의 줄 순서를 정해요. 작은 번호가 먼저 일해요. 인증은 가장 먼저 해야 하니 아주 작은 번호예요.',
      terms: [
        { t: 'Ordered', d: '순서를 정하는 인터페이스' },
        { t: 'getOrder()', d: '실행 순서 번호' },
        { t: 'Mono.error', d: '에러로 끝내요.' },
      ],
      why: '인증 같은 선작업이 로깅보다 먼저 실행돼야 해요.',
      pitfall: '순서를 안 정하면 기본값이 들어가 예측이 안 돼요.',
    },
  },
  {
    id: 'gw-loadbalancer',
    lang: 'java',
    title: 'LoadBalancer로 서비스 선택',
    file: 'LbConfig.java',
    code: `@Bean
public RouteLocator routes(RouteLocatorBuilder b) {
  return b.routes()
    .route("lb", r -> r.path("/user/**")
        .uri("lb://user-service"))
    .build();
}`,
    explain: {
      concept: 'lb://는 게이트웨이가 등록된 여러 서버 중 한 대를 골라 보내요. 식당 자리 안내원이 빈 자리로 안내하는 것과 같아요.',
      terms: [
        { t: 'lb://user-service', d: 'user-service라는 이름의 인스턴스 중 하나로 보내요.' },
        { t: 'lb://', d: '로드밸런싱 프로토콜 표시' },
      ],
      why: '여러 서버에 부하를 나눠요.',
      pitfall: '서비스가 한 건도 등록 안 되어 있으면 503 에러가 떠요.',
    },
  },
  {
    id: 'gw-circuitbreaker',
    lang: 'java',
    title: 'CircuitBreaker 필터',
    file: 'CircuitConfig.java',
    code: `@Bean
public RouteLocator routes(RouteLocatorBuilder b) {
  return b.routes()
    .route("cb", r -> r.path("/order/**")
        .filters(f -> f.circuitBreaker(c -> c.name("orderCB")
            .fallbackUri("forward:/fallback")))
        .uri("lb://order-service"))
    .build();
}`,
    explain: {
      concept: 'CircuitBreaker는 서버가 아플 때 자동으로 전류를 끊어요. 요청이 계속 실패하면 잠시 멈추고 대체 응답으로 보내요.',
      terms: [
        { t: 'circuitBreaker', d: '회로 차단기 필터' },
        { t: 'name("orderCB")', d: '차단기 이름' },
        { t: 'fallbackUri', d: '문제 생기면 이리로 보내요.' },
      ],
      why: '한 서비스가 다운되어도 전체가 멈추지 않게 해요.',
      pitfall: 'fallback 경로가 없으면 503이 그대로 나가요.',
    },
  },
  {
    id: 'gw-retry-filter',
    lang: 'java',
    title: 'Retry 필터',
    file: 'RetryConfig.java',
    code: `import org.springframework.http.HttpStatus;

@Bean
public RouteLocator routes(RouteLocatorBuilder b) {
  return b.routes()
    .route("retry", r -> r.path("/flaky/**")
        .filters(f -> f.retry(r2 -> r2.retries(3)
            .statuses(HttpStatus.INTERNAL_SERVER_ERROR, HttpStatus.BAD_GATEWAY)))
        .uri("lb://service"))
    .build();
}`,
    explain: {
      concept: 'Retry는 일시적 실패 시 다시 시도하는 필터예요. "실패하면 3번까지 다시 해봐라"라고 정해요.',
      terms: [
        { t: 'retry', d: '재시도 필터' },
        { t: 'retries(3)', d: '최대 3번 다시 시도해요.' },
        { t: 'statuses(HttpStatus...)', d: 'HttpStatus 열거형으로 재시도할 상태 코드를 지정해요.' },
        { t: 'HttpStatus.INTERNAL_SERVER_ERROR', d: 'HTTP 500 상태를 나타내는 열거 상수예요.' },
      ],
      why: '잠깐 네트워크 오류를 자동으로 넘길 수 있어요.',
      pitfall: 'POST 요청에 무한 재시도는 위험해요.',
    },
  },
  {
    id: 'gw-custom-filter',
    lang: 'java',
    title: '커스텀 GatewayFilter',
    file: 'AuditGatewayFilter.java',
    code: `public class AuditFilter implements GatewayFilter {
  @Override
  public Mono<Void> filter(ServerWebExchange exchange, GatewayFilterChain chain) {
    String user = exchange.getRequest().getQueryParams().getFirst("user");
    System.out.println("audit user=" + user);
    return chain.filter(exchange);
  }
}`,
    explain: {
      concept: 'GatewayFilter는 특정 라우트에만 끼는 검문소예요. GlobalFilter와 달리 라우트마다 골라 붙여요.',
      terms: [
        { t: 'GatewayFilter', d: '특정 라우트에 끼는 필터' },
        { t: 'getQueryParams', d: '쿼리 매개변수를 꺼내요.' },
        { t: 'chain.filter(exchange)', d: '처리를 마친 뒤 다음 필터로 넘겨요.' },
      ],
      why: '특정 라우트에서만 작업을 넣으려고 해요.',
      pitfall: 'GatewayFilter와 GlobalFilter를 헷갈리지 마세요.',
    },
  },
  {
    id: 'gw-direct-uri',
    lang: 'java',
    title: '직접 URL로 라우팅',
    file: 'DirectRouteConfig.java',
    code: `@Bean
public RouteLocator routes(RouteLocatorBuilder b) {
  return b.routes()
    .route("legacy", r -> r.path("/legacy/**")
        .uri("https://legacy.example.com"))
    .build();
}`,
    explain: {
      concept: 'lb 대신 실제 URL을 쓰면 그 주소로 곧장 보내요. 외부 서비스로 곧바로 전환할 때 유용해요.',
      terms: [
        { t: 'https://legacy.example.com', d: '이 주소로 곧장 보내요.' },
        { t: 'https:// vs lb://', d: 'https://는 고정 URL, lb://는 서비스 이름으로 동적 조회해요.' },
        { t: 'path("/legacy/**")', d: '/legacy 경로로 오는 요청을 잡는 술어예요.' },
      ],
      why: '서비스 디스커버리 없이 외부 주소로 바로 연결할 수 있어요.',
      pitfall: 'https를 쓰면 인증서 검증이 필요해요.',
    },
  },
  {
    id: 'gw-after-predicate',
    lang: 'java',
    title: 'After Predicate로 시간 매칭',
    file: 'AfterRouteConfig.java',
    code: `@Bean
public RouteLocator routes(RouteLocatorBuilder b) {
  return b.routes()
    .route("after-release", r -> r.after(ZonedDateTime.parse("2026-07-01T00:00:00+09:00[Asia/Seoul]"))
        .and().path("/v2/**")
        .uri("lb://v2-service"))
    .build();
}`,
    explain: {
      concept: 'after Predicate는 지정한 시간 이후에만 라우트를 활성화해요. "이 날 이후부터 새 서비스로 보내라" 식이에요.',
      terms: [
        { t: 'after(...)', d: '이 시간 이후에만 잡아요.' },
        { t: 'ZonedDateTime', d: '시간대를 포함한 날짜/시간' },
        { t: '.and().path("/v2/**")', d: '시간 조건에 경로 조건을 추가로 엮어요.' },
      ],
      why: '점검 시간이나 릴리즈 시점에 자동으로 길을 바꿀 수 있어요.',
      pitfall: '시간대를 안 쓰면 서버 기본 시간대로 해석돼요.',
    },
  },
  {
    id: 'gw-between-predicate',
    lang: 'java',
    title: 'Between Predicate로 기간 매칭',
    file: 'BetweenRouteConfig.java',
    code: `@Bean
public RouteLocator routes(RouteLocatorBuilder b) {
  ZonedDateTime start = ZonedDateTime.parse("2026-07-01T00:00:00+09:00[Asia/Seoul]");
  ZonedDateTime end = ZonedDateTime.parse("2026-07-03T00:00:00+09:00[Asia/Seoul]");
  return b.routes()
    .route("event", r -> r.between(start, end)
        .and().path("/event/**")
        .uri("lb://event-service"))
    .build();
}`,
    explain: {
      concept: 'between은 두 시간 사이에만 활성화돼요. 이벤트 기간에만 전용 서비스로 보내는 것과 같아요.',
      terms: [
        { t: 'between(start, end)', d: '이 기간 안에만 잡아요.' },
        { t: 'ZonedDateTime.parse(...)', d: 'ISO-8601 문자열을 시간대 포함 날짜/시간으로 변환해요.' },
        { t: '.and().path("/event/**")', d: '기간 조건에 경로 조건을 추가로 엮어요.' },
      ],
      why: '기간 한정 서비스를 자동으로 켜고 끌 수 있어요.',
      pitfall: '시작/종료 순서를 바꾸면 안 잡혀요.',
    },
  },
  {
    id: 'gw-header-predicate',
    lang: 'java',
    title: 'Header Predicate로 헤더 매칭',
    file: 'HeaderRouteConfig.java',
    code: `@Bean
public RouteLocator routes(RouteLocatorBuilder b) {
  return b.routes()
    .route("by-header", r -> r.header("X-Client", "mobile")
        .and().path("/m/**")
        .uri("lb://m-service"))
    .build();
}`,
    explain: {
      concept: 'header Predicate는 요청 헤더의 값을 보고 길을 정해요. "모바일 헤더가 있으면 모바일 서비스로" 식이에요.',
      terms: [
        { t: 'header("X-Client", "mobile")', d: '헤더 X-Client 값이 mobile인지 검사해요.' },
        { t: 'and().path("/m/**")', d: '헤더 조건에 경로 조건을 추가로 엮어요.' },
        { t: '두 번째 인자(정규식)', d: '헤더 값은 정규식으로도 비교할 수 있어요. "mob.*" 처럼 쓸 수 있어요.' },
      ],
      why: '같은 경로라도 헤더에 따라 다른 서비스로 보낼 수 있어요.',
      pitfall: '헤더 이름은 대소문자를 안 가려요.',
    },
  },
  {
    id: 'gw-remoteaddr-predicate',
    lang: 'java',
    title: 'RemoteAddr predicate로 IP 매칭',
    file: 'IpRouteConfig.java',
    code: `@Bean
public RouteLocator routes(RouteLocatorBuilder b) {
  return b.routes()
    .route("internal", r -> r.remoteAddr("10.0.0.0/8")
        .and().path("/internal/**")
        .uri("lb://internal-service"))
    .build();
}`,
    explain: {
      concept: 'remoteAddr는 요청한 클라이언트의 IP를 보고 길을 정해요. "내부망(10.0.0.x)에서만 이리로" 식이에요.',
      terms: [
        { t: 'remoteAddr("10.0.0.0/8")', d: '10.x.x.x 대역에서만 잡아요.' },
        { t: 'CIDR 표기 (/8)', d: '슬래시 뒤 숫자는 앞에서 몇 비트가 같아야 하는지 나타내요.' },
        { t: '.and().path("/internal/**")', d: 'IP 조건에 경로 조건을 추가로 엮어요.' },
      ],
      why: '내부망 전용 서비스를 외부에서 막을 수 있어요.',
      pitfall: '프록시 뒤에 있으면 원 IP가 바뀌어요.',
    },
  },
  {
    id: 'gw-custom-predicate',
    lang: 'java',
    title: '람다로 커스텀 Predicate 만들기',
    file: 'CustomPredicateConfig.java',
    code: `@Bean
public RouteLocator routes(RouteLocatorBuilder b) {
  return b.routes()
    .route("even-minute", r -> r.path("/roll/**")
        .and().predicate(exchange -> {
          int minute = LocalDateTime.now().getMinute();
          return minute % 2 == 0;
        })
        .uri("lb://roll-service"))
    .build();
}`,
    explain: {
      concept: 'predicate 메서드는 직접 true/false를 돌려주는 규칙을 만들 수 있어요. 짝수 분에만 열리는 문을 만드는 것과 같아요.',
      terms: [
        { t: 'predicate(exchange -> ...)', d: '직접 true/false를 돌려주는 규칙' },
        { t: 'and().predicate', d: '앞 조건과 이 조건을 둘 다 만족해야 해요.' },
        { t: 'ServerWebExchange exchange', d: '람다 안에서 요청 정보를 꺼낼 수 있어요.' },
      ],
      why: '복잡한 사용자 규칙으로 라우트를 골라요.',
      pitfall: '.uri()를 빠뜨리면 기동 시 IllegalArgumentException이 발생해요.',
    },
  },
];
