import type { Snippet } from '../../types';

export const gateway: Snippet[] = [
  {
    id: 'gw-route-basic',
    lang: 'java',
    title: 'RouteLocator 기본 라우트',
    file: 'RouteConfig.java',
    code: `import org.springframework.cloud.gateway.route.RouteLocator;
import org.springframework.cloud.gateway.route.builder.RouteLocatorBuilder;
import org.springframework.context.annotation.Bean;

@Bean
public RouteLocator routes(RouteLocatorBuilder b) {
  System.out.println("[설정] 게이트웨이 라우트 등록 - /user/** -> localhost:9000");
  return b.routes()
    .route("to-user", r -> r.path("/user/**")
        .uri("http://localhost:9000"))
    .build();
}`,
    explain: {
      concept:
        '게이트웨이는 건물 출입구에서 "어디로 가실 건가요?" 하고 길을 안내해주는 안내원이에요. ' +
        'RouteLocatorBuilder로 라우트(길 안내 규칙)를 만들고, path()로 어떤 경로로 들어온 요청을 잡을지 정해요. ' +
        '"to-user"는 이 라우트의 이름(식별자)이고, /user/** 패턴에 매칭되는 모든 요청을 http://localhost:9000으로 보내줘요. ' +
        'build()를 호출하면 정의한 라우트들이 모여서 RouteLocator 객체가 완성돼요. ' +
        'Spring Cloud Gateway는 이 라우트 정보를 바탕으로 요청을 적절한 마이크로서비스로 분배해요. ' +
        '@Bean으로 등록하면 스프링이 자동으로 라우트를 게이트웨이에 적용해요.',
      terms: [
        { t: 'RouteLocatorBuilder', d: '라우트 규칙을 정의하는 빌더예요. .routes()로 시작해서 .route()로 개별 규칙을 추가해요.' },
        { t: 'route("to-user", r -> ...)', d: '"to-user"라는 이름으로 새 라우트를 정의해요. 람다 안에서 조건과 목적지를 설정해요.' },
        { t: 'path("/user/**")', d: '요청 경로가 /user/로 시작하면 이 라우트에 매칭돼요. **는 하위 경로까지 모두 포함해요.' },
        { t: 'uri("http://localhost:9000")', d: '매칭된 요청을 이 주소로 전달해요. lb://로 시작하면 로드밸런싱이 적용돼요.' },
        { t: 'build()', d: '지금까지 정의한 모든 라우트를 묶어 최종 RouteLocator 객체로 생성해요.' },
      ],
      why:
        '마이크로서비스 아키텍처에서 모든 입구 요청을 한 곳에서 받아 적절한 서비스로 분배하려고 해요. 클라이언트는 여러 서비스 주소를 알 필요가 없어져요.',
      expectedOutput:
        '[설정] 게이트웨이 라우트 등록 - /user/** -> localhost:9000',
      realWorldUsage:
        '실제 프로젝트에서 API Gateway의 가장 기본적인 역할이에요. /api/users로 오면 user-service로, /api/orders로 오면 order-service로 라우팅해요. ' +
        '넷플릭스 Zuul, Spring Cloud Gateway, Kong 등 모든 API Gateway가 이 라우팅 개념을 기반으로 동작해요.',
      pitfall:
        '라우트 순서가 중요해요. 더 구체적인 경로(예: /user/admin)를 먼저 정의하지 않으면 포괄적인 경로(/user/**)가 모든 요청을 가로챌 수 있어요.',
    },
  },
  {
    id: 'gw-route-multi',
    lang: 'java',
    title: '여러 라우트 한 번에 정의',
    file: 'MultiRouteConfig.java',
    code: `import org.springframework.cloud.gateway.route.RouteLocator;
import org.springframework.cloud.gateway.route.builder.RouteLocatorBuilder;
import org.springframework.context.annotation.Bean;

@Bean
public RouteLocator routes(RouteLocatorBuilder b) {
  System.out.println("[설정] 멀티 라우트 등록 - user + order");
  return b.routes()
    .route("user", r -> r.path("/user/**").uri("lb://user-service"))
    .route("order", r -> r.path("/order/**").uri("lb://order-service"))
    .build();
}`,
    explain: {
      concept:
        '한 설정 메서드에서 여러 라우트를 체이닝으로 이어서 정의할 수 있어요. ' +
        '각 route() 호출은 독립적인 라우트를 하나씩 추가하고, build()에서 한 번에 묶어요. ' +
        'lb://는 로드밸런서(LoadBalancer) 프로토콜로, 서비스 디스커버리(Eureka 등)에 등록된 user-service라는 이름의 인스턴스 목록에서 하나를 골라 요청을 보내요. ' +
        '이렇게 중앙에서 라우트를 모아 관리하면, 서비스가 추가되거나 주소가 바뀌어도 게이트웨이 설정만 수정하면 되고 클라이언트는 변경할 필요가 없어져요.',
      terms: [
        { t: 'lb://user-service', d: '로드밸런서로 등록된 user-service 인스턴스 중 하나로 요청을 보내요. 서비스 디스커버리와 연동돼요.' },
        { t: '.route(...).route(...)', d: '메서드 체이닝으로 여러 라우트를 연속해서 정의해요. 각 route()가 한 개의 라우트 규칙이에요.' },
        { t: 'build()', d: '정의된 모든 라우트를 묶어서 RouteLocator 객체로 완성해요. 이 객체가 실제 라우팅 엔진에 등록돼요.' },
        { t: '.route("user", r -> ...)', d: '"user"는 라우트 식별자(ID)예요. 로그나 디버깅에서 이 이름으로 어떤 라우트가 처리했는지 확인할 수 있어요.' },
      ],
      why:
        '여러 마이크로서비스를 한 게이트웨이에서 통합 관리하려고 해요. 서비스별로 게이트웨이를 따로 두지 않아도 되고, 공통 정책을 적용하기도 쉬워져요.',
      expectedOutput:
        '[설정] 멀티 라우트 등록 - user + order',
      realWorldUsage:
        '실제 프로젝트에서 수십 개의 마이크로서비스(user, order, payment, notification 등)를 하나의 API Gateway에서 라우팅해요. ' +
        '넷플릭스는 Zuul로 수백 개의 마이크로서비스를 라우팅하고, 각 라우트에 인증·로깅·속도 제한 필터를 붙여서 공통으로 적용해요.',
      pitfall:
        'lb://를 쓰려면 서비스 디스커버리(Eureka, Consul, Nacos 등)가 반드시 필요해요. 디스커버리 서버가 없으면 user-service의 실제 주소를 찾을 수 없어서 503 에러가 발생해요.',
    },
  },
  {
    id: 'gw-predicate-host',
    lang: 'java',
    title: 'Host Predicate로 호스트 매칭',
    file: 'HostRouteConfig.java',
    code: `import org.springframework.cloud.gateway.route.RouteLocator;
import org.springframework.cloud.gateway.route.builder.RouteLocatorBuilder;
import org.springframework.context.annotation.Bean;

@Bean
public RouteLocator routes(RouteLocatorBuilder b) {
  System.out.println("[설정] Host 기반 라우트 - api.example.com");
  return b.routes()
    .route("by-host", r -> r.host("api.example.com")
        .uri("lb://api-service"))
    .build();
}`,
    explain: {
      concept:
        'host Predicate는 요청 헤더의 Host 값(도메인 이름)을 보고 어느 서비스로 보낼지 결정해요. ' +
        '한 서버(IP)에 여러 도메인이 연결되어 있을 때 "api.example.com으로 온 요청은 A 서비스로, www.example.com은 B 서비스로"처럼 도메인별로 분기할 수 있어요. ' +
        '이는 Nginx의 server_name 지시어와 똑같은 역할을 Spring Cloud Gateway의 Java DSL로 구현한 것이에요. ' +
        '호스트 기반 라우팅을 쓰면 클라이언트는 같은 게이트웨이 주소라도 다른 도메인으로 접근해서 각기 다른 백엔드 서비스를 호출할 수 있어요.',
      terms: [
        { t: 'host("api.example.com")', d: '요청의 Host 헤더가 정확히 api.example.com일 때 매칭돼요. 패턴(** 등)도 사용할 수 있어요.' },
        { t: 'predicate (술어)', d: '요청이 이 라우트의 조건에 맞는지 true/false로 판단하는 규칙이에요. path, host, method 등 여러 종류가 있어요.' },
        { t: 'uri("lb://api-service")', d: '조건에 매칭된 요청을 api-service로 로드밸런싱해서 전달해요. 실제 대상 인스턴스는 디스커버리에서 찾아요.' },
      ],
      why:
        '한 게이트웨이로 여러 도메인의 트래픽을 받아서 각각 다른 마이크로서비스로 분배하려고 해요. 도메인별로 별도 게이트웨이를 둘 필요가 없어져요.',
      expectedOutput:
        '[설정] Host 기반 라우트 - api.example.com',
      realWorldUsage:
        '실제 프로젝트에서 SaaS(Software as a Service) 플랫폼이 tenant-a.example.com, tenant-b.example.com 같은 멀티테넌트 도메인을 각기 다른 서비스나 DB로 라우팅할 때 host predicate를 써요. ' +
        'Kubernetes Ingress도 동일한 Host 기반 라우팅을 사용해요.',
      pitfall:
        'host는 요청 헤더의 Host 값을 그대로 비교해요. 프록시나 로드밸런서를 거치면 Host 헤더가 변조될 수 있어서, 실제 요청이 어디서 왔는지 정확히 파악해야 해요. ' +
        '또한 host()의 값은 대소문자를 구분하지 않아요.',
    },
  },
  {
    id: 'gw-predicate-method',
    lang: 'java',
    title: 'Method Predicate로 HTTP 메서드 매칭',
    file: 'MethodRouteConfig.java',
    code: `import org.springframework.cloud.gateway.route.RouteLocator;
import org.springframework.cloud.gateway.route.builder.RouteLocatorBuilder;
import org.springframework.context.annotation.Bean;

@Bean
public RouteLocator routes(RouteLocatorBuilder b) {
  System.out.println("[설정] Method 기반 라우트 - GET /items/**");
  return b.routes()
    .route("get-only", r -> r.method("GET")
        .and().path("/items/**")
        .uri("lb://item-service"))
    .build();
}`,
    explain: {
      concept:
        'method Predicate는 HTTP 메서드(GET, POST, PUT, DELETE 등)를 기준으로 라우트를 구분해요. ' +
        '"읽기(GET)는 조회 전용 서비스로, 쓰기(POST)는 명령 전용 서비스로"처럼 CQRS(명령·조회 책임 분리) 패턴을 구현할 수 있어요. ' +
        'and()로 다른 조건과 연결할 수 있는데, 이때 주의할 점은 method()가 반환하는 타입이 BooleanSpec이기 때문에 and()로 PredicateSpec으로 돌아온 뒤에 path()를 추가해야 해요. ' +
        '이런 메서드 체이닝의 타입 흐름을 이해하면 컴파일 에러 없이 조건을 조합할 수 있어요.',
      terms: [
        { t: 'method("GET")', d: '요청의 HTTP 메서드가 GET일 때만 매칭해요. POST, PUT, DELETE 등으로도 지정할 수 있어요.' },
        { t: 'and()', d: 'PredicateSpec에서 BooleanSpec으로 전환된 타입을 다시 PredicateSpec으로 되돌려서 조건을 추가할 수 있게 해줘요.' },
        { t: 'path("/items/**")', d: '앞의 method 조건과 AND로 결합돼요. GET이면서 경로가 /items/로 시작하는 요청만 매칭돼요.' },
        { t: 'lb://item-service', d: '두 조건을 모두 만족하는 요청을 item-service로 로드밸런싱해서 전달해요.' },
      ],
      why:
        'HTTP 메서드별로 요청을 다른 서비스로 분리해서 보내려고 해요. 읽기와 쓰기의 부하를 분산하거나, 서로 다른 스케일링 정책을 적용할 수 있어요.',
      expectedOutput:
        '[설정] Method 기반 라우트 - GET /items/**',
      realWorldUsage:
        '실제 프로젝트에서 CQRS 아키텍처에서 GET 요청은 읽기 최적화된 Query Service로, POST/PUT/DELETE 요청은 Command Service로 라우팅해요. ' +
        '또한 인증이 필요 없는 GET 요청과 인증이 필수인 POST 요청을 다른 필터 체인으로 처리할 때도 method predicate를 사용해요.',
      pitfall:
        'and() 없이 method() 뒤에 바로 path()를 호출하면 컴파일 에러가 발생해요. BooleanSpec에는 path() 메서드가 없어서, 반드시 .and()로 PredicateSpec으로 돌아온 뒤 다음 조건을 추가해야 해요.',
    },
  },
  {
    id: 'gw-filter-add-header',
    lang: 'java',
    title: 'AddRequestHeader 필터',
    file: 'HeaderFilterConfig.java',
    code: `import org.springframework.cloud.gateway.route.RouteLocator;
import org.springframework.cloud.gateway.route.builder.RouteLocatorBuilder;
import org.springframework.context.annotation.Bean;

@Bean
public RouteLocator routes(RouteLocatorBuilder b) {
  System.out.println("[설정] 헤더 추가 필터 - X-Trace: gw");
  return b.routes()
    .route("add-header", r -> r.path("/secure/**")
        .filters(f -> f.addRequestHeader("X-Trace", "gw"))
        .uri("lb://service"))
    .build();
}`,
    explain: {
      concept:
        '필터는 요청이 라우트를 통과할 때 추가 작업을 수행하는 검문소예요. ' +
        'addRequestHeader는 요청이 백엔드 서비스로 전달되기 전에 HTTP 헤더를 하나 추가해줘요. ' +
        '예제에서는 X-Trace: gw 헤더를 붙여서 백엔드 서비스가 "이 요청은 게이트웨이를 거쳤구나"라고 알 수 있게 해줘요. ' +
        '이런 필터 체인을 통해 인증 토큰 주입, 요청 추적 ID 부여, CORS 헤더 설정 같은 공통 작업을 각 서비스 코드에 넣지 않고 게이트웨이 한 곳에서 처리할 수 있어요.',
      terms: [
        { t: 'filters(f -> ...)', d: '이 라우트에 적용할 필터 목록을 정의하는 블록이에요. 람다 안에서 여러 필터를 체이닝할 수 있어요.' },
        { t: 'addRequestHeader', d: '백엔드로 전달되는 요청에 새 HTTP 헤더를 추가해요. 키와 값 쌍으로 지정해요.' },
        { t: '"X-Trace", "gw"', d: '추가할 헤더의 이름과 값이에요. X- 접두사는 커스텀 헤더임을 나타내는 관례예요.' },
        { t: 'uri("lb://service")', d: '필터가 적용된 후 최종적으로 요청이 전달될 서비스를 지정해요.' },
      ],
      why:
        '백엔드 서비스에서 추적 ID나 인증 정보 같은 공통 헤더를 받을 수 있게 하려고 해요. 각 서비스가 헤더 생성 로직을 중복 구현하지 않아도 돼요.',
      expectedOutput:
        '[설정] 헤더 추가 필터 - X-Trace: gw',
      realWorldUsage:
        '실제 프로젝트에서 분산 추적 시스템(Zipkin, Jaeger)의 traceId를 모든 요청에 주입하거나, 게이트웨이에서 JWT 토큰을 파싱해서 userId 헤더로 변환해 백엔드에 전달할 때 사용해요. ' +
        '이렇게 하면 각 마이크로서비스가 JWT 라이브러리를 일일이 의존하지 않아도 돼요.',
      pitfall:
        '같은 이름의 헤더를 여러 필터가 추가하면 값이 덮어쓰기 돼요. 필터 순서에 따라 최종 값이 달라질 수 있어서 헤더 충돌에 주의해야 해요.',
    },
  },
  {
    id: 'gw-filter-rewrite-path',
    lang: 'java',
    title: 'RewritePath 필터',
    file: 'RewriteConfig.java',
    code: `import org.springframework.cloud.gateway.route.RouteLocator;
import org.springframework.cloud.gateway.route.builder.RouteLocatorBuilder;
import org.springframework.context.annotation.Bean;

@Bean
public RouteLocator routes(RouteLocatorBuilder b) {
  System.out.println("[설정] 경로 재작성 필터 - /api/** -> /**");
  return b.routes()
    .route("rewrite", r -> r.path("/api/**")
        .filters(f -> f.rewritePath("/api/(.*)", "/$1"))
        .uri("lb://service"))
    .build();
}`,
    explain: {
      concept:
        'RewritePath는 요청 경로를 정규식으로 변환해서 백엔드 서비스에 전달하는 필터예요. ' +
        '"프론트에서는 /api/users로 요청하지만, 실제 user-service는 /users로 받아야 한다" 같은 상황에서 써요. ' +
        '첫 번째 인자는 잡아낼 정규식 패턴, 두 번째 인자는 대체할 문자열이에요. (.*)는 캡처 그룹으로 /api/ 뒤의 모든 문자열을 잡아서 $1로 참조해요. ' +
        '/api/users/123 -> /users/123 으로 변환돼서 백엔드에 전달돼요. 이렇게 하면 백엔드 서비스는 게이트웨이 접두사(/api)를 전혀 신경 쓰지 않아도 돼요.',
      terms: [
        { t: 'rewritePath(regexp, replacement)', d: '첫 인자(정규식)로 경로를 매칭하고, 두 번째 인자로 변환된 경로를 만들어요.' },
        { t: '/api/(.*)', d: '/api/ 뒤에 오는 모든 문자를 첫 번째 캡처 그룹으로 잡아요. (.*)는 0개 이상의 모든 문자를 의미해요.' },
        { t: '/$1', d: '첫 번째 캡처 그룹의 내용으로 경로를 대체해요. $1은 (.*)에 매칭된 부분을 참조하는 치환 변수예요.' },
        { t: 'filters(f -> ...)', d: '각 라우트별로 적용할 필터를 람다로 정의해요. 여러 필터를 체이닝해서 순차 적용할 수 있어요.' },
      ],
      why:
        'API 버저닝(/api/v1, /api/v2)이나 게이트웨이 경로 구조와 백엔드 경로 구조가 다를 때 둘 사이를 연결해주는 다리 역할을 해요.',
      expectedOutput:
        '[설정] 경로 재작성 필터 - /api/** -> /**',
      realWorldUsage:
        '실제 프로젝트에서 레거시 모놀리스 앞에 API Gateway를 두고 점진적으로 마이크로서비스를 추출할 때, 기존 클라이언트가 보내는 /api/users 경로를 새로운 user-service의 /users로 변환해서 전달해요. ' +
        '프론트엔드 코드를 수정하지 않고 백엔드만 마이그레이션할 수 있게 해줘요.',
      pitfall:
        '정규식의 캡처 그룹을 지정하지 않으면 $1로 치환할 내용이 없어요. 예를 들어 /api가 정규식에 그룹 없이 있으면 $1이 빈 문자열로 대체돼요. ' +
        '또한 정규식 패턴은 요청 경로 전체에 매칭되므로, 좁은 범위의 라우트가 먼저 정의되도록 순서에 주의해야 해요.',
    },
  },
  {
    id: 'gw-filter-prefix-path',
    lang: 'java',
    title: 'PrefixPath 필터',
    file: 'PrefixConfig.java',
    code: `import org.springframework.cloud.gateway.route.RouteLocator;
import org.springframework.cloud.gateway.route.builder.RouteLocatorBuilder;
import org.springframework.context.annotation.Bean;

@Bean
public RouteLocator routes(RouteLocatorBuilder b) {
  System.out.println("[설정] 접두어 추가 필터 - +/api/v1");
  return b.routes()
    .route("prefix", r -> r.path("/user/**")
        .filters(f -> f.prefixPath("/api/v1"))
        .uri("lb://user-service"))
    .build();
}`,
    explain: {
      concept:
        'PrefixPath는 모든 요청 경로 앞에 공통 접두어를 붙여주는 필터예요. ' +
        '클라이언트가 /user/profile 로 요청하면, 게이트웨이가 /api/v1/user/profile 로 변환해서 백엔드에 전달해요. ' +
        '백엔드 서비스가 /api/v1/user 라는 경로 구조로 API를 제공할 때, 클라이언트는 짧은 경로만 알면 돼요. ' +
        'RewritePath와 반대 방향의 변환이라고 볼 수 있어요. RewritePath는 경로를 줄이는 쪽이고, PrefixPath는 경로를 늘이는 쪽이에요.',
      terms: [
        { t: 'prefixPath("/api/v1")', d: '매칭된 요청의 경로 앞에 /api/v1을 붙여서 백엔드로 전달해요. 원본 경로는 그 뒤에 그대로 붙어요.' },
        { t: 'GatewayFilter', d: '라우트별로 적용되는 필터 인터페이스예요. prefixPath, rewritePath 등은 내장 GatewayFilter 구현체예요.' },
        { t: 'path("/user/**")', d: '이 라우트가 매칭할 경로 패턴이에요. /user/로 시작하는 모든 요청을 잡아요.' },
        { t: 'uri("lb://user-service")', d: '접두어가 추가된 경로로 변환된 요청이 최종적으로 전달될 서비스예요.' },
      ],
      why:
        '클라이언트가 알기 쉬운 짧은 경로를 사용하면서도, 백엔드는 일관된 API 경로 구조(/api/v1/*)를 유지하려고 해요.',
      expectedOutput:
        '[설정] 접두어 추가 필터 - +/api/v1',
      realWorldUsage:
        '실제 프로젝트에서 BFF(Backend for Frontend) 패턴 구현 시, 모바일 앱은 /m/user로 요청하고 웹은 /web/user로 요청할 때, ' +
        '게이트웨이에서 prefixPath로 각각 /api/mobile/user, /api/web/user로 변환해서 동일한 user-service의 다른 컨트롤러로 라우팅해요.',
      pitfall:
        '이미 경로에 /api가 포함되어 있으면 /api/api/v1처럼 접두어가 중복될 수 있어요. prefixPath를 적용하기 전에 경로 구조를 정확히 파악해야 해요. ' +
        '또한 stripPrefix와 혼합해서 쓰면 경로가 예상과 다르게 변환될 수 있으니 둘의 상호작용을 주의해야 해요.',
    },
  },
  {
    id: 'gw-filter-stripprefix',
    lang: 'java',
    title: 'StripPrefix 필터',
    file: 'StripConfig.java',
    code: `import org.springframework.cloud.gateway.route.RouteLocator;
import org.springframework.cloud.gateway.route.builder.RouteLocatorBuilder;
import org.springframework.context.annotation.Bean;

@Bean
public RouteLocator routes(RouteLocatorBuilder b) {
  System.out.println("[설정] 경로 앞부분 제거 필터 - 2칸 제거");
  return b.routes()
    .route("strip", r -> r.path("/api/user/**")
        .filters(f -> f.stripPrefix(2))
        .uri("lb://user-service"))
    .build();
}`,
    explain: {
      concept:
        'StripPrefix는 경로 앞의 몇 칸(세그먼트)을 잘라내고 백엔드에 전달해요. ' +
        '경로 세그먼트는 /로 구분된 각 구간이에요. /api/user/1 은 api, user, 1 의 세 칸(3개 세그먼트)으로 구성돼 있어요. ' +
        'stripPrefix(2)는 앞의 두 세그먼트(api, user)를 잘라내서 /1만 백엔드로 보내요. ' +
        '게이트웨이에서만 쓰는 경로 접두어(/api/user)를 백엔드 서비스가 몰라도 되게 해줘요. ' +
        'PrefixPath와는 정반대 역할을 하며, 둘 중 어떤 게 필요한지는 클라이언트-게이트웨이-백엔드 간 경로 규약에 따라 결정돼요.',
      terms: [
        { t: 'stripPrefix(2)', d: '경로의 앞쪽에서 슬래시(/)로 구분된 세그먼트를 2개 잘라내요. /a/b/c -> /c 로 변환돼요.' },
        { t: '경로 세그먼트', d: 'URL 경로에서 /로 구분된 각 구간이에요. /api/user/1은 3개의 세그먼트(api, user, 1)로 구성돼요.' },
        { t: 'filters(f -> ...)', d: '이 라우트에만 적용할 필터를 람다 표현식으로 정의하는 블록이에요.' },
        { t: 'uri("lb://user-service")', d: '경로가 잘린 후 요청이 전달될 대상 서비스예요.' },
      ],
      why:
        '게이트웨이 전용 경로 구조(/api/user 같은 접두어)를 백엔드에 노출하지 않고 깨끗한 경로만 전달하려고 해요.',
      expectedOutput:
        '[설정] 경로 앞부분 제거 필터 - 2칸 제거',
      realWorldUsage:
        '실제 프로젝트에서 Spring Cloud Gateway를 API Gateway로 사용할 때, /api/user-service/users/123 -> stripPrefix(2) -> /users/123 으로 변환해서 user-service에 전달해요. ' +
        '마이크로서비스마다 다른 서비스 이름을 경로에 포함하지만, 실제 서비스 내부에서는 짧은 경로만 사용하는 구조가 일반적이에요.',
      pitfall:
        '잘라낼 세그먼트 수를 잘못 지정하면 경로가 완전히 엉켜요. 예를 들어 stripPrefix(3)으로 /api/user/1을 처리하면 빈 경로(/)가 돼서 백엔드가 예상치 못한 엔드포인트로 요청을 받을 수 있어요.',
    },
  },
  {
    id: 'gw-global-filter',
    lang: 'java',
    title: 'GlobalFilter 구현',
    file: 'LoggingFilter.java',
    code: `import org.springframework.cloud.gateway.filter.GatewayFilterChain;
import org.springframework.cloud.gateway.filter.GlobalFilter;
import org.springframework.stereotype.Component;
import org.springframework.web.server.ServerWebExchange;
import reactor.core.publisher.Mono;

@Component
public class LoggingFilter implements GlobalFilter {
  @Override
  public Mono<Void> filter(ServerWebExchange exchange, GatewayFilterChain chain) {
    System.out.println("[로깅] request: " + exchange.getRequest().getPath());
    return chain.filter(exchange);
  }
}`,
    explain: {
      concept:
        'GlobalFilter는 모든 라우트에 무조건 적용되는 공통 필터예요. ' +
        '개별 라우트 필터(AddRequestHeader 등)와 달리, @Component로 등록만 하면 게이트웨이를 통과하는 모든 요청에 자동으로 적용돼요. ' +
        'filter() 메서드는 요청 정보(ServerWebExchange)를 받아서 로깅·인증·메트릭 수집 등을 수행하고, chain.filter(exchange)로 다음 필터에게 요청을 넘겨줘요. ' +
        '반환 타입이 Mono<Void>인 것은 Spring WebFlux(Reactor) 기반이라 비동기·논블로킹으로 동작하기 때문이에요. ' +
        'chain.filter()를 호출하지 않으면 요청이 거기서 멈춰서 백엔드 서비스까지 도달하지 못해요.',
      terms: [
        { t: '@Component', d: '스프링이 이 클래스를 감지해서 자동으로 빈을 생성하고, 게이트웨이 필터 체인에 등록해줘요.' },
        { t: 'GlobalFilter', d: '모든 라우트에 전역으로 적용되는 필터 인터페이스예요. 라우트별 GatewayFilter와 구분돼요.' },
        { t: 'ServerWebExchange', d: '현재 HTTP 요청과 응답을 묶은 컨텍스트 객체예요. WebFlux의 ServerHttpRequest/Response를 담고 있어요.' },
        { t: 'GatewayFilterChain', d: '필터 체인에서 다음 필터로 요청을 전달하는 고리예요. chain.filter()를 호출해야 다음 단계로 진행돼요.' },
        { t: 'Mono<Void>', d: 'Reactor의 비동기 타입이에요. 결과값 없이 완료 신호만 전달하는 비동기 처리를 나타내요.' },
      ],
      why:
        '로깅, 인증, 요청 추적, CORS 설정 같은 모든 라우트에 공통으로 필요한 작업을 한 곳에서 처리하려고 해요. 코드 중복을 없애고 일관된 정책을 적용할 수 있어요.',
      expectedOutput:
        '[로깅] request: /users/123',
      realWorldUsage:
        '실제 프로젝트에서 모든 요청의 access log를 남기거나, 분산 추적의 traceId를 생성해서 MDC에 넣는 작업을 GlobalFilter로 구현해요. ' +
        'API 사용량 측정(MeterRegistry), 요청 본문 로깅, 응답 시간 측정 등 인프라 관심사를 게이트웨이에서 통합 처리해요.',
      pitfall:
        'chain.filter(exchange)를 호출하지 않으면 요청이 거기서 멈춰서 백엔드 서비스까지 도달하지 않아요. ' +
        '또한 filter() 내에서 블로킹 작업(Thread.sleep, JDBC 호출 등)을 하면 전체 이벤트 루프가 멈출 수 있어서, 반드시 논블로킹 방식으로 구현해야 해요.',
    },
  },
  {
    id: 'gw-global-filter-ordered',
    lang: 'java',
    title: 'GlobalFilter 순서 지정',
    file: 'AuthFilter.java',
    code: `import org.springframework.cloud.gateway.filter.GatewayFilterChain;
import org.springframework.cloud.gateway.filter.GlobalFilter;
import org.springframework.core.Ordered;
import org.springframework.stereotype.Component;
import org.springframework.web.server.ServerWebExchange;
import reactor.core.publisher.Mono;

@Component
public class AuthFilter implements GlobalFilter, Ordered {
  @Override
  public Mono<Void> filter(ServerWebExchange exchange, GatewayFilterChain chain) {
    String token = exchange.getRequest().getHeaders().getFirst("X-Token");
    System.out.println("[인증] token 존재 여부: " + (token != null));
    if (token == null) {
      return Mono.error(new RuntimeException("인증 토큰이 없어요"));
    }
    return chain.filter(exchange);
  }

  @Override
  public int getOrder() {
    return -100;
  }
}`,
    explain: {
      concept:
        'GlobalFilter가 여러 개일 때 실행 순서를 정하는 게 중요해요. Ordered 인터페이스를 구현하면 숫자로 순서를 지정할 수 있어요. ' +
        '숫자가 작을수록 먼저 실행돼요. 인증 필터는 모든 필터 중 가장 먼저 실행되어야 하므로 아주 작은 음수(-100)를 반환해요. ' +
        '인증에 실패하면 Mono.error()로 요청을 중단시키고, 성공하면 chain.filter()로 다음 필터에 넘겨줘요. ' +
        '일반적으로 인증(-100) -> 로깅(0) -> 라우팅(Ordered.LOWEST_PRECEDENCE) 순서가 돼요. ' +
        'getOrder()를 구현하지 않으면 기본값(0)이 적용돼서 필터 간 순서가 예측 불가능해질 수 있어요.',
      terms: [
        { t: 'Ordered', d: '스프링이 관리하는 컴포넌트의 실행 순서를 정하는 인터페이스예요. getOrder()로 우선순위를 반환해요.' },
        { t: 'getOrder()', d: '실행 우선순위 숫자를 반환해요. 작을수록 먼저 실행돼요. Integer.MIN_VALUE가 가장 먼저예요.' },
        { t: 'Mono.error(e)', d: '에러 신호를 발생시키는 Reactor 연산자예요. 이걸 반환하면 이후 필터와 백엔드 호출이 모두 건너뛰어져요.' },
        { t: 'getFirst("X-Token")', d: '요청 헤더에서 X-Token 헤더의 첫 번째 값을 가져와요. 없으면 null을 반환해요.' },
      ],
      why:
        '필터 간 순서가 중요해요. 예를 들어 인증이 로깅보다 먼저 실행되지 않으면, 인증 실패 로그가 누락되거나 인증 전에 민감한 정보가 로깅될 수 있어요.',
      expectedOutput:
        '[인증] token 존재 여부: true',
      realWorldUsage:
        '실제 프로젝트에서 인증 필터(Order=-100), 속도 제한 필터(Order=-90), 요청 로깅 필터(Order=0), 라우트 필터(Order=MAX) 순서로 체인을 구성해요. ' +
        'Spring Security도 내부적으로 FilterChainProxy에서 비슷한 Ordered 기반 체인을 관리해요.',
      pitfall:
        'getOrder()를 오버라이드하지 않으면 기본값 0이 적용돼서, 다른 필터(로깅 등)와 같은 순서가 되면 실행 순서가 불안정해져요. ' +
        '또한 Mono.error()를 반환해도 try-catch로 잡히지 않고 WebExceptionHandler가 별도로 처리하므로, 에러 응답을 커스터마이징하려면 별도 핸들러가 필요해요.',
    },
  },
  {
    id: 'gw-loadbalancer',
    lang: 'java',
    title: 'LoadBalancer로 서비스 선택',
    file: 'LbConfig.java',
    code: `import org.springframework.cloud.gateway.route.RouteLocator;
import org.springframework.cloud.gateway.route.builder.RouteLocatorBuilder;
import org.springframework.context.annotation.Bean;

@Bean
public RouteLocator routes(RouteLocatorBuilder b) {
  System.out.println("[설정] 로드밸런서 라우트 - lb://user-service");
  return b.routes()
    .route("lb", r -> r.path("/user/**")
        .uri("lb://user-service"))
    .build();
}`,
    explain: {
      concept:
        'lb:// 프로토콜은 게이트웨이가 서비스 디스커버리(Eureka 등)에 등록된 여러 인스턴스 중 하나를 골라 요청을 분산해줘요. ' +
        '마치 식당 안내원이 빈 자리를 찾아서 손님을 안내하는 것과 같아요. user-service가 3개의 인스턴스(포트 9001, 9002, 9003)로 떠 있다면, ' +
        '게이트웨이가 각 요청을 번갈아가며(Round Robin) 다른 인스턴스로 분배해요. ' +
        '로드밸런싱 덕분에 한 인스턴스에 부하가 몰리지 않고, 인스턴스 하나가 죽어도 다른 인스턴스가 요청을 처리할 수 있어서 고가용성이 확보돼요.',
      terms: [
        { t: 'lb://user-service', d: '서비스 디스커버리에 등록된 user-service라는 논리적 이름으로 등록된 실제 인스턴스 중 하나를 선택해요.' },
        { t: 'lb://', d: 'Spring Cloud LoadBalancer를 사용하겠다는 프로토콜 표시예요. http://localhost:9000처럼 고정 URL과 대비돼요.' },
        { t: '서비스 디스커버리', d: 'Eureka, Consul, Nacos처럼 어떤 서비스가 어느 주소에 떠 있는지 동적으로 관리하는 레지스트리예요.' },
        { t: 'Round Robin', d: '기본 로드밸런싱 알고리즘으로, 요청을 인스턴스 목록에 순서대로 하나씩 분배해요.' },
      ],
      why:
        '서비스의 인스턴스가 여러 개일 때 부하를 고르게 분산하고, 장애가 발생한 인스턴스를 자동으로 제외하려고 해요.',
      expectedOutput:
        '[설정] 로드밸런서 라우트 - lb://user-service',
      realWorldUsage:
        '실제 프로젝트에서 user-service가 Kubernetes에서 5개의 Pod로 운영될 때, 게이트웨이가 lb://user-service로 요청을 5개 Pod에 고르게 분배해요. ' +
        '오토스케일링으로 Pod가 늘어나거나 줄어들면 디스커버리에서 자동으로 반영돼요.',
      pitfall:
        '서비스 디스커버리에 등록된 인스턴스가 하나도 없으면 503 Service Unavailable 에러가 발생해요. ' +
        '또한 인스턴스가 죽은 후 디스커버리에서 제거되기까지 시간 차(하트비트 간격)가 있어서, 그 사이에 죽은 인스턴스로 요청이 전달될 수 있어요.',
    },
  },
  {
    id: 'gw-circuitbreaker',
    lang: 'java',
    title: 'CircuitBreaker 필터',
    file: 'CircuitConfig.java',
    code: `import org.springframework.cloud.gateway.route.RouteLocator;
import org.springframework.cloud.gateway.route.builder.RouteLocatorBuilder;
import org.springframework.context.annotation.Bean;

@Bean
public RouteLocator routes(RouteLocatorBuilder b) {
  System.out.println("[설정] 서킷 브레이커 필터 - order-service");
  return b.routes()
    .route("cb", r -> r.path("/order/**")
        .filters(f -> f.circuitBreaker(c -> c.name("orderCB")
            .fallbackUri("forward:/fallback")))
        .uri("lb://order-service"))
    .build();
}`,
    explain: {
      concept:
        'CircuitBreaker(서킷 브레이커)는 전기 회로의 차단기처럼, 백엔드 서비스에 장애가 감지되면 자동으로 요청을 차단하고 대체 응답(fallback)을 보내주는 필터예요. ' +
        'order-service가 연속해서 실패하면, 일정 시간 동안 요청을 보내지 않고(OPEN 상태) 바로 fallback 경로로 전달해요. ' +
        '시간이 지나면 반쯤 열어서(HALF_OPEN) 몇 개 요청을 보내보고, 성공하면 다시 정상(CLOSED)으로 돌아와요. ' +
        '이 패턴 덕분에 장애가 다른 서비스로 전파되는 걸 막고, 전체 시스템이 마비되는 최악의 상황을 피할 수 있어요. ' +
        'name()은 각 서킷 브레이커를 식별하는 이름으로, 메트릭 수집이나 설정에서 이 이름으로 참조해요.',
      terms: [
        { t: 'circuitBreaker(c -> ...)', d: 'Resilience4j 서킷 브레이커를 게이트웨이 필터로 적용해요. 람다로 상세 설정을 정의해요.' },
        { t: 'name("orderCB")', d: '서킷 브레이커의 식별자예요. 이 이름으로 장애율, 상태(OPEN/CLOSED) 등을 모니터링할 수 있어요.' },
        { t: 'fallbackUri("forward:/fallback")', d: '서킷이 열렸을 때 대신 보여줄 경로예요. 게이트웨이 내부의 /fallback 엔드포인트로 전달해요.' },
        { t: 'OPEN / HALF_OPEN / CLOSED', d: '서킷 브레이커의 3가지 상태예요. CLOSED=정상, OPEN=차단, HALF_OPEN=테스트 중이에요.' },
      ],
      why:
        '분산 시스템에서 한 서비스의 장애가 연쇄 실패로 번지는 걸 막으려고 해요. 장애를 격리해서 나머지 서비스는 정상 동작하게 유지해요.',
      expectedOutput:
        '[설정] 서킷 브레이커 필터 - order-service',
      realWorldUsage:
        '실제 프로젝트에서 결제 게이트웨이 연동이나 외부 API 호출처럼 불안정한 서비스 앞에 서킷 브레이커를 둬서, 장애 시 "잠시 후 다시 시도해주세요" 같은 fallback 응답을 보내줘요. ' +
        '넷플릭스가 Hystrix(현재 Resilience4j)를 모든 마이크로서비스 간 통신에 적용해서 시스템 탄력성을 확보한 것으로 유명해요.',
      pitfall:
        'fallbackUri를 지정하지 않으면 서킷이 열렸을 때 503 에러가 그대로 클라이언트에 전달돼요. 사용자 경험을 위해 적절한 fallback 응답을 구성해야 해요. ' +
        '또한 서킷 브레이커 임계값(실패율, 슬라이딩 윈도우 등)을 서비스 특성에 맞게 튜닝하지 않으면 민감하게 열리거나 너무 늦게 열릴 수 있어요.',
    },
  },
  {
    id: 'gw-retry-filter',
    lang: 'java',
    title: 'Retry 필터',
    file: 'RetryConfig.java',
    code: `import org.springframework.cloud.gateway.route.RouteLocator;
import org.springframework.cloud.gateway.route.builder.RouteLocatorBuilder;
import org.springframework.context.annotation.Bean;
import org.springframework.http.HttpStatus;

@Bean
public RouteLocator routes(RouteLocatorBuilder b) {
  System.out.println("[설정] 재시도 필터 - 최대 3회, 500/502 대상");
  return b.routes()
    .route("retry", r -> r.path("/flaky/**")
        .filters(f -> f.retry(r2 -> r2.retries(3)
            .statuses(HttpStatus.INTERNAL_SERVER_ERROR, HttpStatus.BAD_GATEWAY)))
        .uri("lb://service"))
    .build();
}`,
    explain: {
      concept:
        'Retry 필터는 백엔드 서비스가 일시적인 오류(500, 502 등)로 실패했을 때 자동으로 다시 시도해주는 안전망이에요. ' +
        '네트워크가 잠깐 불안정하거나, 서비스가 재시작 중일 때 첫 요청은 실패해도 두 번째 요청은 성공할 수 있어요. ' +
        'retries(3)은 최대 3번까지 재시도하고, statuses()로 어떤 HTTP 상태 코드일 때만 재시도할지 지정해요. ' +
        '500(Internal Server Error)이나 502(Bad Gateway) 같은 서버 측 오류에만 재시도하고, 400(Bad Request) 같은 클라이언트 오류는 재시도하지 않는 게 올바른 전략이에요.',
      terms: [
        { t: 'retry(r2 -> ...)', d: '재시도 필터를 설정하는 빌더예요. retries()로 횟수, statuses()로 대상 상태 코드를 지정해요.' },
        { t: 'retries(3)', d: '실패 시 최대 3번까지 재시도해요. 총 1(원본) + 3(재시도) = 최대 4회 호출이 발생할 수 있어요.' },
        { t: 'statuses(HttpStatus...)', d: '재시도할 HTTP 상태 코드를 지정해요. INTERNAL_SERVER_ERROR(500), BAD_GATEWAY(502) 등을 열거해요.' },
        { t: 'HttpStatus 열거형', d: 'HTTP 상태 코드를 이름으로 표현한 스프링 열거형(enum)이에요. 숫자(500) 대신 의미 있는 이름으로 써요.' },
      ],
      why:
        '분산 시스템에서는 일시적 네트워크 오류나 서비스 재시작 중인 순간이 항상 존재해요. 재시도로 이런 순간적 오류를 자동 복구해서 가용성을 높여요.',
      expectedOutput:
        '[설정] 재시도 필터 - 최대 3회, 500/502 대상',
      realWorldUsage:
        '실제 프로젝트에서 클라우드 환경(Kubernetes)의 Pod 재시작 중 잠깐 실패하는 요청들을 Retry로 흡수해요. ' +
        '외부 결제 API 호출도 일시적 오류에 2~3회 재시도하고, 그래도 실패하면 서킷 브레이커가 열리는 2단계 방어 전략이 일반적이에요.',
      pitfall:
        'POST 요청처럼 멱등성이 보장되지 않는 작업에 무제한 재시도를 걸면 위험해요. 결제가 중복으로 처리될 수 있어요. ' +
        '반드시 멱등성이 보장되는 GET 요청이나, 멱등 키를 사용하는 POST에만 재시도를 적용해야 해요.',
    },
  },
  {
    id: 'gw-custom-filter',
    lang: 'java',
    title: '커스텀 GatewayFilter',
    file: 'AuditGatewayFilter.java',
    code: `import org.springframework.cloud.gateway.filter.GatewayFilter;
import org.springframework.cloud.gateway.filter.GatewayFilterChain;
import org.springframework.web.server.ServerWebExchange;
import reactor.core.publisher.Mono;

public class AuditFilter implements GatewayFilter {
  @Override
  public Mono<Void> filter(ServerWebExchange exchange, GatewayFilterChain chain) {
    String user = exchange.getRequest().getQueryParams().getFirst("user");
    System.out.println("[감사] 요청자: " + user);
    return chain.filter(exchange);
  }
}`,
    explain: {
      concept:
        'GatewayFilter는 GlobalFilter와 달리 특정 라우트에만 선택적으로 적용하는 필터예요. ' +
        '클래스를 직접 구현해서 라우트 설정에 new AuditFilter()로 끼워 넣을 수 있어요. ' +
        '예제에서는 쿼리 파라미터에서 user 값을 읽어서 감사(audit) 로그를 남기고 있어요. ' +
        'GlobalFilter가 모든 라우트에 적용되는 전역 검문소라면, GatewayFilter는 특정 라우트에만 설치하는 개별 검문소예요. ' +
        '라우트마다 다른 필터가 필요할 때(예: 결제 라우트만 추가 검증, 관리자 라우트만 IP 제한) GatewayFilter를 구현해서 필요한 라우트에만 붙여요.',
      terms: [
        { t: 'GatewayFilter', d: '특정 라우트에만 적용되는 필터 인터페이스예요. filter() 메서드 하나만 구현하면 돼요.' },
        { t: 'getQueryParams()', d: '요청 URL의 쿼리 파라미터(?user=kim 같은)를 Map 형태로 가져와요.' },
        { t: 'getFirst("user")', d: '쿼리 파라미터 중 user 키의 첫 번째 값을 반환해요. 없으면 null이에요.' },
        { t: 'chain.filter(exchange)', d: '필터 작업을 마친 후 다음 필터로 요청을 넘겨줘요. 호출하지 않으면 파이프라인이 멈춰요.' },
      ],
      why:
        'GlobalFilter로는 라우트별로 다른 동작을 할 수 없어요. 특정 라우트에서만 감사 로그를 남기거나, 특정 라우트에만 IP 제한을 걸 때 써요.',
      expectedOutput:
        '[감사] 요청자: kim',
      realWorldUsage:
        '실제 프로젝트에서 결제 라우트에만 금액 제한 검증 필터를 붙이거나, 파일 업로드 라우트에만 파일 크기 검증 필터를 적용해요. ' +
        'Spring Security의 URL별 권한 설정도 내부적으로는 유사한 필터 체인 패턴으로 동작해요.',
      pitfall:
        'GatewayFilter와 GlobalFilter를 혼동하지 마세요. GlobalFilter는 @Component로 등록만 하면 자동 적용되지만, GatewayFilter는 각 라우트 설정에 명시적으로 추가해야 해요. ' +
        '또한 GatewayFilter를 라우트마다 new로 생성하면 매 요청마다 새 객체가 생성될 수 있어서, 무거운 초기화 로직이 있다면 빈으로 등록해서 재사용하는 게 좋아요.',
    },
  },
  {
    id: 'gw-direct-uri',
    lang: 'java',
    title: '직접 URL로 라우팅',
    file: 'DirectRouteConfig.java',
    code: `import org.springframework.cloud.gateway.route.RouteLocator;
import org.springframework.cloud.gateway.route.builder.RouteLocatorBuilder;
import org.springframework.context.annotation.Bean;

@Bean
public RouteLocator routes(RouteLocatorBuilder b) {
  System.out.println("[설정] 외부 직접 라우트 - legacy.example.com");
  return b.routes()
    .route("legacy", r -> r.path("/legacy/**")
        .uri("https://legacy.example.com"))
    .build();
}`,
    explain: {
      concept:
        'lb:// 대신 실제 URL을 uri()에 직접 넣으면, 서비스 디스커버리 없이도 해당 주소로 곧장 요청을 전달해요. ' +
        '레거시 시스템이나 외부 서드파티 API처럼 서비스 디스커버리에 등록되지 않은 대상과 통신할 때 유용해요. ' +
        'https://로 시작하면 TLS 암호화 통신이 적용되고, 인증서 검증을 수행해요. ' +
        'lb://와 http(s)://의 가장 큰 차이는, lb://는 동적으로 인스턴스를 찾지만 https://는 항상 정해진 주소로만 요청을 보낸다는 점이에요. ' +
        '직접 URL을 사용하면 서비스 디스커버리 의존성 없이도 간단하게 게이트웨이를 구성할 수 있어요.',
      terms: [
        { t: 'https://legacy.example.com', d: '서비스 디스커버리를 거치지 않고 이 고정 URL로 직접 요청을 전달해요.' },
        { t: 'https:// vs lb://', d: 'https://는 고정 URL로 항상 같은 곳에 요청을 보내고, lb://는 디스커버리에서 인스턴스 목록을 받아 분산해요.' },
        { t: 'path("/legacy/**")', d: '/legacy 경로로 들어오는 요청을 잡는 Predicate(술어)예요. **는 모든 하위 경로를 포함해요.' },
        { t: 'TLS/SSL', d: 'https://를 쓰면 전송 계층 암호화(TLS)가 적용돼서, 요청 내용이 네트워크에서 도청되지 않도록 보호해요.' },
      ],
      why:
        '모든 서비스가 디스커버리에 등록돼 있지 않은 경우(레거시, 외부 API)에도 게이트웨이를 통해 통합 라우팅하려고 해요.',
      expectedOutput:
        '[설정] 외부 직접 라우트 - legacy.example.com',
      realWorldUsage:
        '실제 프로젝트에서 모놀리스 -> 마이크로서비스 전환 과정에서, 아직 분리되지 않은 레거시 시스템으로의 요청을 게이트웨이가 직접 URL로 전달해요. ' +
        '또한 외부 결제사(PG), SMS 발송 서비스, 지도 API 등 서드파티 서비스와의 통합 지점을 게이트웨이로 중앙화할 때도 직접 URL을 사용해요.',
      pitfall:
        'https://를 사용할 때 대상 서버의 SSL 인증서가 유효하지 않으면 TLS 핸드셰이크가 실패해서 요청이 전달되지 않아요. 테스트 환경에서는 자체 서명 인증서로 인한 문제가 자주 발생해요. ' +
        '또한 DNS 변경이나 IP 변경 시 게이트웨이 재시작 없이도 반영되도록, 가능하면 도메인 이름을 사용해야 해요.',
    },
  },
  {
    id: 'gw-after-predicate',
    lang: 'java',
    title: 'After Predicate로 시간 매칭',
    file: 'AfterRouteConfig.java',
    code: `import java.time.ZonedDateTime;
import org.springframework.cloud.gateway.route.RouteLocator;
import org.springframework.cloud.gateway.route.builder.RouteLocatorBuilder;
import org.springframework.context.annotation.Bean;

@Bean
public RouteLocator routes(RouteLocatorBuilder b) {
  ZonedDateTime releaseTime = ZonedDateTime.parse(
      "2026-07-01T00:00:00+09:00[Asia/Seoul]");
  System.out.println("[설정] 시간 기반 라우트 - 2026-07-01 이후 활성화");
  return b.routes()
    .route("after-release", r -> r.after(releaseTime)
        .and().path("/v2/**")
        .uri("lb://v2-service"))
    .build();
}`,
    explain: {
      concept:
        'after Predicate는 지정한 시점 이후에만 라우트를 활성화하는 시간 조건이에요. ' +
        '"7월 1일 0시부터 새 버전의 서비스로 트래픽을 보내라" 같은 점진적 배포(카나리 릴리스)에 활용할 수 있어요. ' +
        'ZonedDateTime으로 타임존(Asia/Seoul)까지 명시해서 해석 오차를 방지해요. ' +
        '특정 시점을 기준으로 조건이 자동으로 true로 바뀌기 때문에, 배포 시점에 수동으로 설정을 바꿀 필요가 없어요. ' +
        '이런 시간 기반 라우팅은 서비스 점검 시간, 마케팅 이벤트 기간 등에도 유용하게 쓸 수 있어요.',
      terms: [
        { t: 'after(releaseTime)', d: '지정된 ZonedDateTime 이후의 요청만 매칭해요. 그 이전에는 이 라우트가 동작하지 않아요.' },
        { t: 'ZonedDateTime.parse(...)', d: 'ISO-8601 형식의 날짜/시간 문자열을 타임존이 포함된 날짜/시간 객체로 변환해요.' },
        { t: '+09:00[Asia/Seoul]', d: 'UTC+9 타임존의 서울 시간대를 의미해요. 서버 설정과 관계없이 정확한 로컬 시간을 지정할 수 있어요.' },
        { t: '.and().path("/v2/**")', d: '시간 조건과 경로 조건을 모두 만족해야 하는 AND 조건이에요. 방법은 method().and().path()와 동일해요.' },
      ],
      why:
        '릴리스 일정에 맞춰 트래픽을 자동으로 전환하려고 해요. 사람이 수동으로 배포하는 대신, 미리 라우트를 설정해두고 시간이 되면 자동으로 새 서비스로 전환돼요.',
      expectedOutput:
        '[설정] 시간 기반 라우트 - 2026-07-01 이후 활성화',
      realWorldUsage:
        '실제 프로젝트에서 새 버전의 API를 배포할 때, 특정 날짜에 자동으로 트래픽이 새 서비스로 흐르도록 설정해요. ' +
        '마케팅 프로모션 페이지도 프로모션 기간에만 활성화되는 라우트로 구성할 수 있어요. ' +
        '대규모 서비스에서는 카나리 배포의 첫 단계로 시간 기반 조건을 사용해요.',
      pitfall:
        '타임존을 명시하지 않으면 서버의 기본 타임존(보통 UTC)으로 해석돼서 예상 시간과 9시간 차이가 날 수 있어요. ' +
        '또한 ZonedDateTime.parse()의 형식이 조금이라도 틀리면 DateTimeParseException이 발생하므로 문자열 형식에 주의해야 해요.',
    },
  },
  {
    id: 'gw-between-predicate',
    lang: 'java',
    title: 'Between Predicate로 기간 매칭',
    file: 'BetweenRouteConfig.java',
    code: `import java.time.ZonedDateTime;
import org.springframework.cloud.gateway.route.RouteLocator;
import org.springframework.cloud.gateway.route.builder.RouteLocatorBuilder;
import org.springframework.context.annotation.Bean;

@Bean
public RouteLocator routes(RouteLocatorBuilder b) {
  ZonedDateTime start = ZonedDateTime.parse(
      "2026-07-01T00:00:00+09:00[Asia/Seoul]");
  ZonedDateTime end = ZonedDateTime.parse(
      "2026-07-03T00:00:00+09:00[Asia/Seoul]");
  System.out.println("[설정] 기간 한정 라우트 - 7/1~7/3");
  return b.routes()
    .route("event", r -> r.between(start, end)
        .and().path("/event/**")
        .uri("lb://event-service"))
    .build();
}`,
    explain: {
      concept:
        'between Predicate는 두 시점 사이(기간)에만 라우트를 활성화해요. after와 달리 종료 시점도 지정할 수 있어서 기간 한정 기능에 적합해요. ' +
        '이벤트나 프로모션이 3일 동안만 진행될 때, 시작 시점에 자동으로 켜지고 종료 시점에 자동으로 꺼지는 라우트를 만들 수 있어요. ' +
        'between은 포괄 구간이라 start와 end 모두 포함돼요. start 시점부터 end 시점까지 모든 요청이 매칭돼요. ' +
        'ZonedDateTime 변수를 미리 선언해두면 가독성이 좋아지고, 여러 라우트에서 같은 시간을 재사용하기도 쉬워져요.',
      terms: [
        { t: 'between(start, end)', d: 'start 시점 이상 end 시점 이하의 기간에만 라우트를 활성화해요. 양 끝점을 모두 포함해요.' },
        { t: 'ZonedDateTime.parse(...)', d: 'ISO-8601 형식의 날짜/시간 문자열을 타임존 포함 객체로 변환해요. 형식이 정확히 맞아야 해요.' },
        { t: '.and().path("/event/**")', d: '기간 조건에 경로 조건을 추가한 AND 결합이에요. 두 조건을 모두 만족하는 요청만 라우팅돼요.' },
        { t: 'uri("lb://event-service")', d: '기간 조건을 만족하는 요청만 이벤트 전용 서비스로 전달돼요. 기간이 지나면 자동으로 무시돼요.' },
      ],
      why:
        '기간 한정으로 운영되는 서비스(이벤트, 프로모션)를 배포 없이 게이트웨이 설정만으로 자동으로 켜고 끄려고 해요.',
      expectedOutput:
        '[설정] 기간 한정 라우트 - 7/1~7/3',
      realWorldUsage:
        '실제 프로젝트에서 블랙프라이데이 세일 페이지, 신년 이벤트 API, 한정판 상품预售 페이지 등 기간 한정 기능을 between Predicate로 구현해요. ' +
        '배포 일정에 구애받지 않고 마케팅 일정에 맞춰 자동으로 서비스를 활성화/비활성화할 수 있어요.',
      pitfall:
        'start와 end의 순서를 바꾸면(end가 start보다 앞서면) 어떤 요청도 매칭되지 않아요. 시작 시점이 종료 시점보다 반드시 과거여야 해요. ' +
        '또한 시간대를 서로 다르게 지정하면 의도하지 않은 기간이 설정될 수 있어서, 하나의 라우트 안에서는 같은 타임존을 사용해야 해요.',
    },
  },
  {
    id: 'gw-header-predicate',
    lang: 'java',
    title: 'Header Predicate로 헤더 매칭',
    file: 'HeaderRouteConfig.java',
    code: `import org.springframework.cloud.gateway.route.RouteLocator;
import org.springframework.cloud.gateway.route.builder.RouteLocatorBuilder;
import org.springframework.context.annotation.Bean;

@Bean
public RouteLocator routes(RouteLocatorBuilder b) {
  System.out.println("[설정] 헤더 기반 라우트 - X-Client: mobile");
  return b.routes()
    .route("by-header", r -> r.header("X-Client", "mobile")
        .and().path("/m/**")
        .uri("lb://m-service"))
    .build();
}`,
    explain: {
      concept:
        'header Predicate는 요청 헤더의 특정 값에 따라 라우트를 결정해요. ' +
        '"X-Client 헤더가 mobile이면 모바일 전용 경량 서비스로, web이면 일반 서비스로"처럼 클라이언트 유형별로 다른 백엔드를 연결할 수 있어요. ' +
        '두 번째 인자(mobile)는 정규식으로도 쓸 수 있어서 "mob.*"처럼 패턴 매칭도 가능해요. ' +
        '모바일 앱과 웹 브라우저가 같은 API 엔드포인트(/api/items)를 호출하더라도, 헤더를 보고 각각 다른 응답(경량 JSON vs 풀 데이터)을 주는 백엔드로 라우팅할 수 있어요.',
      terms: [
        { t: 'header("X-Client", "mobile")', d: '요청 헤더 X-Client의 값이 정확히 "mobile"인지 검사해요. 대소문자를 구분해요.' },
        { t: 'and().path("/m/**")', d: '헤더 조건과 경로 /m/ 조건을 모두 만족해야 하는 AND 결합이에요.' },
        { t: '정규식 헤더 매칭', d: '두 번째 인자로 정규식을 넘기면 값이 패턴에 매칭되는지 검사해요. header("X-Client", "mob.*") 처럼 써요.' },
        { t: 'uri("lb://m-service")', d: '모바일 클라이언트 요청만 전용 경량 서비스인 m-service로 전달돼요.' },
      ],
      why:
        '같은 URL 경로라도 요청을 보낸 클라이언트 종류(모바일·웹·IoT)나 API 버전에 따라 다른 서비스로 분기하려고 해요.',
      expectedOutput:
        '[설정] 헤더 기반 라우트 - X-Client: mobile',
      realWorldUsage:
        '실제 프로젝트에서 API 버저닝을 헤더로 구현해요. Accept-Version: v1 헤더가 있으면 구버전 서비스로, v2면 신버전 서비스로 라우팅해요. ' +
        'BFF 패턴에서 모바일 앱의 요청(경량 응답)과 웹 요청(풀 데이터)을 같은 엔드포인트에서 헤더로 구분해 다른 BFF로 라우팅하는 방식도 흔해요.',
      pitfall:
        '헤더 이름은 대소문자를 구분하지 않지만, 헤더 값은 구분해요. "Mobile"과 "mobile"은 다른 값으로 처리돼요. ' +
        '또한 header("X-Client", "mobile")일 때 X-Client 헤더 자체가 없으면 매칭되지 않아요. 헤더 존재 여부만 검사하려면 regexp 인자를 생략하세요.',
    },
  },
  {
    id: 'gw-remoteaddr-predicate',
    lang: 'java',
    title: 'RemoteAddr predicate로 IP 매칭',
    file: 'IpRouteConfig.java',
    code: `import org.springframework.cloud.gateway.route.RouteLocator;
import org.springframework.cloud.gateway.route.builder.RouteLocatorBuilder;
import org.springframework.context.annotation.Bean;

@Bean
public RouteLocator routes(RouteLocatorBuilder b) {
  System.out.println("[설정] IP 기반 라우트 - 10.0.0.0/8 내부망");
  return b.routes()
    .route("internal", r -> r.remoteAddr("10.0.0.0/8")
        .and().path("/internal/**")
        .uri("lb://internal-service"))
    .build();
}`,
    explain: {
      concept:
        'remoteAddr Predicate는 요청을 보낸 클라이언트의 IP 주소를 보고 라우트 여부를 결정해요. ' +
        '"내부망(10.x.x.x)에서만 접근 가능한 관리자 API"나 "특정 파트너사 IP만 호출 가능한 전용 API"를 구현할 때 써요. ' +
        'CIDR 표기법을 사용해서 IP 대역을 지정해요. 10.0.0.0/8은 10.0.0.0 ~ 10.255.255.255 사이의 모든 IP를 포함해요. ' +
        '/24는 앞 24비트(처음 3자리)가 같은 IP, 즉 10.0.0.0/24는 10.0.0.1~10.0.0.254 범위예요.',
      terms: [
        { t: 'remoteAddr("10.0.0.0/8")', d: '클라이언트 IP가 10.x.x.x 대역인 경우에만 매칭해요. CIDR 표기법으로 IP 범위를 지정해요.' },
        { t: 'CIDR (/8, /24 등)', d: '슬래시 뒤 숫자는 네트워크 접두사의 비트 수예요. /8이면 앞 8비트가 같은 IP 범위를 의미해요.' },
        { t: '.and().path("/internal/**")', d: 'IP 조건과 경로 조건을 모두 만족해야 하는 AND 결합이에요.' },
        { t: 'lb://internal-service', d: '내부망에서 접근하는 요청만 전달되는 서비스예요. 외부 IP는 이 라우트에 매칭되지 않아요.' },
      ],
      why:
        '보안상 내부망에서만 접근 가능해야 하는 관리자 API나, 특정 파트너사 IP만 허용하는 전용 API를 게이트웨이 레벨에서 막으려고 해요.',
      expectedOutput:
        '[설정] IP 기반 라우트 - 10.0.0.0/8 내부망',
      realWorldUsage:
        '실제 프로젝트에서 관리자 대시보드 API(/admin/**), 서버 헬스체크(/actuator/**), 내부 배치 트리거 API 같은 민감한 엔드포인트를 IP 기반으로 제한해요. ' +
        'AWS Security Group이나 방화벽을 대체할 순 없지만, 애플리케이션 레벨의 추가 방어 계층으로 유용해요.',
      pitfall:
        '프록시나 로드밸런서(nginx, AWS ALB) 뒤에 게이트웨이가 있으면 remoteAddr가 실제 클라이언트 IP가 아니라 프록시의 IP로 보여요. ' +
        '이 경우 X-Forwarded-For 헤더로 원본 IP를 확인하도록 별도 설정이 필요해요.',
    },
  },
  {
    id: 'gw-custom-predicate',
    lang: 'java',
    title: '람다로 커스텀 Predicate 만들기',
    file: 'CustomPredicateConfig.java',
    code: `import java.time.LocalDateTime;
import org.springframework.cloud.gateway.route.RouteLocator;
import org.springframework.cloud.gateway.route.builder.RouteLocatorBuilder;
import org.springframework.context.annotation.Bean;

@Bean
public RouteLocator routes(RouteLocatorBuilder b) {
  System.out.println("[설정] 커스텀 Predicate - 짝수 분에만 활성화");
  return b.routes()
    .route("even-minute", r -> r.path("/roll/**")
        .and().predicate(exchange -> {
          int minute = LocalDateTime.now().getMinute();
          boolean even = minute % 2 == 0;
          System.out.println("[판단] 현재 분=" + minute + ", 짝수=" + even);
          return even;
        })
        .uri("lb://roll-service"))
    .build();
}`,
    explain: {
      concept:
        'predicate() 메서드를 쓰면 내장 Predicate(host, path, method 등)로 표현할 수 없는 복잡한 조건을 직접 람다로 구현할 수 있어요. ' +
        '람다는 ServerWebExchange를 받아서 boolean을 반환하기만 하면 돼요. true면 라우트 매칭, false면 다른 라우트로 넘어가요. ' +
        '예제는 현재 시간의 분(minute)이 짝수일 때만 true를 반환하는 재미있는 조건이지만, 실무에서는 요청 본문 내용 검사, ' +
        '데이터베이스 조회 결과에 따른 조건 분기, 외부 API 호출 결과 기반 라우팅 등 훨씬 복잡한 조건을 구현할 수 있어요.',
      terms: [
        { t: 'predicate(exchange -> ...)', d: '사용자 정의 boolean 조건을 람다로 구현해요. ServerWebExchange에서 요청 정보를 꺼내 쓸 수 있어요.' },
        { t: 'and().predicate(...)', d: '이전 조건들(path 등)과 AND로 결합되는 커스텀 Predicate예요. 모두 true여야 매칭돼요.' },
        { t: 'ServerWebExchange exchange', d: '람다의 인자로 요청·응답 컨텍스트를 받아요. 헤더, 파라미터, 본문 등 모든 요청 정보에 접근할 수 있어요.' },
        { t: 'LocalDateTime.now()', d: '현재 날짜와 시간을 반환해요. getMinute()로 현재 분(0~59)을 추출해요.' },
      ],
      why:
        '기본 제공되는 Predicate로는 커버할 수 없는 비즈니스 로직 기반의 라우팅 조건이 필요할 때 써요. 거의 무제한의 커스텀 조건을 구현할 수 있어요.',
      expectedOutput:
        '[설정] 커스텀 Predicate - 짝수 분에만 활성화\n' +
        '[판단] 현재 분=34, 짝수=true',
      realWorldUsage:
        '실제 프로젝트에서 A/B 테스트를 할 때 요청의 사용자 ID를 해시해서 50%는 A 서비스, 50%는 B 서비스로 라우팅하는 커스텀 Predicate를 구현해요. ' +
        '또한 특정 IP 블랙리스트를 DB에서 조회해서 동적으로 차단하는 조건도 predicate로 구현할 수 있어요.',
      pitfall:
        '.uri()를 지정하지 않으면 게이트웨이 기동 시 IllegalArgumentException이 발생해요. 모든 라우트는 반드시 목적지 uri()가 있어야 해요. ' +
        '또한 predicate 람다 안에서 블로킹 작업(DB 조회, 네트워크 호출)을 하면 이벤트 루프가 멈출 수 있어서, 논블로킹 방식으로 구현해야 해요.',
    },
  },
];
