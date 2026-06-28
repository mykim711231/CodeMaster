import type { Snippet } from '../../types';

export const reactive: Snippet[] = [
  {
    id: 'rx-mono-hello',
    lang: 'java',
    title: 'WebFlux Mono 한 건 반환',
    file: 'HelloController.java',
    code: `@GetMapping(path = "/hi")
public Mono<String> hi() {
  return Mono.just("Hello Reactor");
}`,
    explain: {
      concept: 'Mono는 0 또는 1개 결과를 담는 상자예요. 주문 한 건을 돌려줄 때 써요.',
      terms: [
        { t: '@GetMapping', d: 'HTTP GET 요청을 받는 문지기' },
        { t: 'Mono<String>', d: '문자열 0~1개를 담는 리액티브 상자' },
        { t: 'Mono.just', d: '값 하나를 상자에 담는 동작' },
      ],
      why: '한 건의 결과를 비동기로 돌려줄 때 쓴답니다.',
      pitfall: 'Mono를 리턴하고 체인을 바로 실행하지 않으면 아무것도 안 일어나요.',
    },
  },
  {
    id: 'rx-flux-stream',
    lang: 'java',
    title: 'Flux 여러 건 흘려보내기',
    file: 'CountController.java',
    code: `@GetMapping(path = "/nums", produces = "text/event-stream")
public Flux<Long> nums() {
  return Flux.interval(Duration.ofSeconds(1)).take(5);
}`,
    explain: {
      concept: 'Flux는 여러 건을 한 줄로 흘려보내는 호스예요. interval로 1초마다 숫자를 만들어요.',
      terms: [
        { t: 'Flux<Long>', d: '여러 개 숫자를 흘려보내는 호스' },
        { t: 'Flux.interval', d: '일정 시간마다 값을 만드는 시계' },
        { t: 'take(5)', d: '앞의 5개만 받고 호스를 끊어요' },
      ],
      why: '여러 건을 시간을 두고 보내야 할 때 써요.',
      pitfall: 'take 없이 interval을 그대로 두면 무한 호스가 되어 브라우저가 멈출 수 있어요.',
    },
  },
  {
    id: 'rx-map-upper',
    lang: 'java',
    title: 'map 값 변환',
    file: 'NameService.java',
    code: `public Mono<String> shout(String name) {
  return Mono.just(name)
    .map(s -> s.toUpperCase());
}`,
    explain: {
      concept: 'map은 상자 속 값을 다른 값으로 바꾸는 동사예요. 값은 1개, 상자는 그대로예요.',
      terms: [
        { t: 'map', d: '상자 속 값을 새 값으로 바꾸는 변환' },
        { t: 's -> s.toUpperCase()', d: '람다로 받은 s를 대문자로 바꿔요' },
        { t: 'Mono<String>', d: '변환 결과를 담는 1건짜리 리액티브 상자' },
      ],
      why: '값만 바꾸고 싶을 때, 다른 상자를 만들고 싶지 않을 때 써요.',
      pitfall: 'map 안에서 또 다른 Mono를 리턴하면 상자가 이중으로 겹쳐요. 그럴 땐 flatMap을 써야 해요.',
    },
  },
  {
    id: 'rx-flatmap-chain',
    lang: 'java',
    title: 'flatMap 비동기 줄 잇기',
    file: 'UserService.java',
    code: `public Mono<String> greeting(Long id) {
  return findById(id)
    .flatMap(u -> Mono.just("hi " + u.getName()));
}`,
    explain: {
      concept: 'flatMap은 앞 상자를 풀고 다음 상자를 이어주는 연결 도구예요. 비동기 호출을 이을 때 써요.',
      terms: [
        { t: 'flatMap', d: '앞 Mono를 풀어 다음 Mono를 이어주는 동사' },
        { t: 'findById(id)', d: '아이디로 회원을 찾는 비동기 호출' },
        { t: 'Mono.just', d: '결과 문자열을 상자에 담아요' },
      ],
      why: '비동기 작업을 순서대로 이어서 한 흐름으로 만들려고요.',
      pitfall: 'map을 쓰면 Mono 안에 Mono가 겹쳐요. 비동기 연쇄는 flatMap만 써요.',
    },
  },
  {
    id: 'rx-zip-pair',
    lang: 'java',
    title: 'zip 두 흐름 합치기',
    file: 'PairService.java',
    code: `public Mono<String> label(Long id) {
  return Mono.zip(
    findById(id),
    findStatus(id)
  ).map(t -> t.getT1().getName() + ":" + t.getT2());
}`,
    explain: {
      concept: 'zip은 두 호스가 모두 도착하면 한 상자로 합쳐주는 우체국이에요. 둘 다 끝나야 다음으로 넘어가요.',
      terms: [
        { t: 'Mono.zip', d: '두 Mono가 모두 끝나면 합쳐주는 동사' },
        { t: 't.getT1()', d: '첫 번째 결과를 꺼내요' },
        { t: 't.getT2()', d: '두 번째 결과를 꺼내요' },
      ],
      why: '두 비동기 작업을 병렬로 돌려서 둘 다 끝난 뒤에 한 개로 합치려고요.',
      pitfall: '한쪽이 비면 zip 전체가 비어요. 한쪽은 빌 수 없어요.',
    },
  },
  {
    id: 'rx-r2dbc-find',
    lang: 'java',
    title: 'R2DBC 반응형 조회',
    file: 'UserR2dbcDao.java',
    code: `public Flux<UserEntity> findAll() {
  return databaseClient
    .sql("select id, name from users")
    .map((row, meta) -> new UserEntity(row.get("id", Long.class), row.get("name", String.class)))
    .all();
}`,
    explain: {
      concept: 'R2DBC는 데이터베이스를 비동기로 다루는 호스예요. 한 줄을 받을 때마다 자바 객체로 바꿉니다.',
      terms: [
        { t: 'databaseClient', d: 'R2DBC를 다루는 클라이언트' },
        { t: 'sql(...)', d: '실행할 SQL 문장을 넘겨요' },
        { t: 'map((row, meta) -> ...)', d: '한 줄씩 객체로 바꾸는 변환' },
        { t: 'all()', d: '모든 줄을 Flux로 흘려보내요' },
      ],
      why: 'JPA처럼 블로킹 없이 DB를 읽으려고요.',
      pitfall: 'row.get에 클래스를 안 넘기면 타입 추측이 안 되어 컴파일 에러가 나요.',
    },
  },
  {
    id: 'rx-r2dbc-save',
    lang: 'java',
    title: 'R2DBC 반응형 삽입',
    file: 'UserR2dbcDao.java',
    code: `public Mono<Long> save(String name) {
  return databaseClient
    .sql("insert into users(name) values(:n)")
    .bind("n", name)
    .fetch()
    .rowsUpdated();
}`,
    explain: {
      concept: '반응형 삽입은 SQL을 실행하고 영향받은 줄 수만 상자에 담아 돌려줘요. 이름표(:n)로 값을 안전하게 끼워요.',
      terms: [
        { t: 'bind("n", name)', d: ':n 자리에 name 값을 끼워요' },
        { t: 'fetch()', d: '결과를 가져오기 시작해요' },
        { t: 'rowsUpdated()', d: '변경된 줄 수를 Mono로 돌려줘요' },
      ],
      why: '블로킹 없이 삽입하고 그 결과(줄 수)를 받아보려고요.',
      pitfall: '문자열 합치기로 SQL을 만들면 주입 위험(SQL Injection)이 있어요. bind를 써요.',
    },
  },
  {
    id: 'rx-sse-event',
    lang: 'java',
    title: 'SSE ServerSentEvent 보내기',
    file: 'SseController.java',
    code: `@GetMapping(path = "/tick", produces = "text/event-stream")
public Flux<ServerSentEvent<String>> tick() {
  return Flux.interval(Duration.ofSeconds(2))
    .map(i -> ServerSentEvent.<String>builder().event("tick").data("n=" + i).build());
}`,
    explain: {
      concept: 'SSE는 서버가 브라우저에게 한 쪽으로 계속 말을 걸어주는 호스예요. ServerSentEvent로 이름표를 달아 보내요.',
      terms: [
        { t: 'text/event-stream', d: 'SSE 전용 응답 타입' },
        { t: 'ServerSentEvent', d: '이벤트 이름과 데이터를 담은 봉투' },
        { t: 'builder()', d: '봉투를 만드는 빌더' },
        { t: 'event("tick")', d: '이벤트 이름을 "tick"으로 달아요' },
      ],
      why: '서버 푸시 알림을 브라우저에게 계속 보내려고요.',
      pitfall: 'produces를 text/event-stream으로 안 하면 일반 JSON으로 끝나버려요.',
    },
  },
  {
    id: 'rx-backpressure-limit',
    lang: 'java',
    title: 'Backpressure limitRate',
    file: 'FastSourceService.java',
    code: `public Flux<Integer> throttled() {
  return fastSource()
    .limitRate(100);
}`,
    explain: {
      concept: 'Backpressure는 호스가 너무 빨리면 받는 쪽이 조절하는 거예요. limitRate로 한 번에 100개까지만 받아요.',
      terms: [
        { t: 'fastSource()', d: '매우 빠른 호스 (값 쏟아내는 곳)' },
        { t: 'limitRate(100)', d: '한 번에 100개까지만 당겨오는 동사' },
      ],
      why: '받는 쪽이 느릴 때 호스가 넘쳐나는 걸 막으려고요.',
      pitfall: 'limitRate 없으면 받는 쪽이 압도당해 메모리가 터질 수 있어요.',
    },
  },
  {
    id: 'rx-webclient-get',
    lang: 'java',
    title: 'WebClient 비동기 HTTP GET',
    file: 'ApiService.java',
    code: `public Mono<String> fetchName(Long id) {
  return webClient
    .get()
    .uri("/users/{id}", id)
    .retrieve()
    .bodyToMono(String.class);
}`,
    explain: {
      concept: 'WebClient는 RestTemplate의 비동기 동생이에요. uri 안에 {id} 자리를 두고 값을 끼워요.',
      terms: [
        { t: 'webClient', d: '비동기 HTTP 클라이언트' },
        { t: 'get()', d: 'HTTP GET을 준비해요' },
        { t: 'uri("/users/{id}", id)', d: '{id} 자리에 id 값을 끼워요' },
        { t: 'bodyToMono', d: '응답 본문을 Mono로 바꿉니다' },
      ],
      why: '블로킹 없이 외부 API를 호출하려고요.',
      pitfall: 'exchangeToMono()로 바꾸면 응답 바디를 반드시 소비해야 해요. 소비하지 않으면 메모리 누수가 생겨요. 단순 상태 코드 처리는 retrieve()가 더 안전해요.',
    },
  },
  {
    id: 'rx-onerror-resume',
    lang: 'java',
    title: 'onErrorResume 대체값',
    file: 'SafeService.java',
    code: `public Mono<String> safeName(Long id) {
  return findById(id)
    .onErrorResume(e -> Mono.just("guest"));
}`,
    explain: {
      concept: 'onErrorResume은 앞에서 오류가 나면 대체 상자를 주는 안전망이에요. 문제가 생기면 예비 값으로 대신해요.',
      terms: [
        { t: 'onErrorResume', d: '오류가 나면 대체 Mono로 바꾸는 동사' },
        { t: 'e -> Mono.just("guest")', d: '에러 e를 받아 "guest" 상자로 대체해요' },
      ],
      why: '오류를 숨기지 말고 대체값을 주어 서비스가 멈추지 않게 하려고요.',
      pitfall: 'resume에서 다시 오류를 리턴하면 흐름이 그대로 끝나버려요.',
    },
  },
  {
    id: 'rx-filter-even',
    lang: 'java',
    title: 'Flux filter 걸러내기',
    file: 'NumberService.java',
    code: `public Flux<Integer> onlyEven() {
  return Flux.range(1, 10)
    .filter(n -> n % 2 == 0);
}`,
    explain: {
      concept: 'filter는 호스의 값마다 참/거짓을 물어보고 참인 값만 통과시키는 거르개예요.',
      terms: [
        { t: 'Flux.range(1, 10)', d: '1부터 10까지 숫자를 흘려보내요' },
        { t: 'filter', d: '조건이 참인 값만 남는 거르개' },
        { t: 'n % 2 == 0', d: '2로 나눈 나머지가 0이면 짝수' },
      ],
      why: '조건에 맞는 값만 남기고 싶을 때 써요.',
      pitfall: 'filter에서 람다가 무거우면 매 값마다 느려져 호스 전체가 느려져요.',
    },
  },
  {
    id: 'rx-reduce-sum',
    lang: 'java',
    title: 'Flux reduce 합치기',
    file: 'SumService.java',
    code: `public Mono<Integer> total() {
  return Flux.range(1, 100)
    .reduce(0, (acc, n) -> acc + n);
}`,
    explain: {
      concept: 'reduce는 여러 값을 하나로 접어주는 봉투예요. 시작값과 받아서 접는 동사를 줘요.',
      terms: [
        { t: 'reduce', d: '여러 값을 하나로 접어주는 동사' },
        { t: '0', d: '시작값 (초기 합)' },
        { t: '(acc, n) -> acc + n', d: '지금까지 합(acc)에 새 값 n을 더해요' },
      ],
      why: '숫자들의 합, 평균, 최댓값 등 하나의 결과로 접을 때 써요.',
      pitfall: '시작값을 안 주면 첫 값이 시작값이 되어 비어 있는 호스에선 빈 Mono가 나와요.',
    },
  },
  {
    id: 'rx-collect-list',
    lang: 'java',
    title: 'Flux collectList 한 상자로',
    file: 'BatchService.java',
    code: `public Mono<List<String>> allNames() {
  return findAllNames()
    .collectList();
}`,
    explain: {
      concept: 'collectList는 호스의 모든 값을 한 리스트 상자에 담아 1건으로 바꿉니다. 여러 건 → 한 건이에요.',
      terms: [
        { t: 'findAllNames()', d: '이름 여러 개를 흘려보내는 Flux' },
        { t: 'collectList()', d: '모든 값을 모아 List 하나로 담아요' },
        { t: 'Mono<List<String>>', d: '리스트 한 개를 담은 1건 상자' },
      ],
      why: 'Flux를 한 번에 받아 한 건으로 다루고 싶을 때 써요.',
      pitfall: '무한 호스에 collectList를 붙이면 영원히 끝나지 않아요.',
    },
  },
  {
    id: 'rx-delay-elements',
    lang: 'java',
    title: 'delayElements 시간 지연',
    file: 'SlowController.java',
    code: `@GetMapping(path = "/drip", produces = "text/event-stream")
public Flux<String> drip() {
  return Flux.fromIterable(List.of("a", "b", "c"))
    .delayElements(Duration.ofMillis(500));
}`,
    explain: {
      concept: 'delayElements는 호스의 값마다 정해진 시간만큼 기다렸다 보내는 온도조절기예요.',
      terms: [
        { t: 'Flux.fromIterable', d: '리스트를 호스로 바꿉니다' },
        { t: 'delayElements', d: '각 값마다 시간만큼 쉬었다 보내요' },
        { t: 'Duration.ofMillis(500)', d: '0.5초를 의미해요' },
      ],
      why: '값을 일정 간격으로 보내야 할 때 써요.',
      pitfall: 'delayElements는 publishOn이 묻어 있어 다른 스레드에서 돌아요. 스레드 안전을 신경 써요.',
    },
  },
  {
    id: 'rx-merge-interleave',
    lang: 'java',
    title: 'Flux.merge 두 호스 섞기',
    file: 'FanInService.java',
    code: `public Flux<String> both() {
  return Flux.merge(
    sourceA(),
    sourceB()
  );
}`,
    explain: {
      concept: 'merge는 두 호스의 값을 한 호스로 섞어주는 합수관이에요. 어느 쪽이 도착하든 그때마다 흘려보내요.',
      terms: [
        { t: 'Flux.merge', d: '여러 Flux를 한 줄로 섞어주는 동사' },
        { t: 'sourceA()', d: '첫 번째 입력 호스' },
        { t: 'sourceB()', d: '두 번째 입력 호스' },
      ],
      why: '여러 입력을 한 흐름으로 모아 동시에 처리하려고요.',
      pitfall: '한쪽이 오류가 나면 merge 전체가 끝나요. 오류를 격리하려면 각 소스에 onErrorResume을 붙이거나 Flux.mergeDelayError를 써요.',
    },
  },
  {
    id: 'rx-switchifempty',
    lang: 'java',
    title: 'switchIfEmpty 기본값',
    file: 'FallbackService.java',
    code: `public Mono<String> display(Long id) {
  return findById(id)
    .switchIfEmpty(Mono.just("default"));
}`,
    explain: {
      concept: 'switchIfEmpty는 앞 상자가 비어 있으면 대체 상자를 주는 예비 창고예요. 창고가 비면 기본 화물을 써요.',
      terms: [
        { t: 'switchIfEmpty', d: '앞 Mono가 비면 다른 Mono로 바꿉니다' },
        { t: 'Mono.just("default")', d: '기본값을 담은 상자' },
      ],
      why: '데이터가 없을 때 사용자에게 기본값을 보여주려고요.',
      pitfall: 'switchIfEmpty에 빈 Mono를 주면 아무것도 일어나지 않아요.',
    },
  },
  {
    id: 'rx-doonnext-log',
    lang: 'java',
    title: 'doOnNext 흐름에 끼어들기',
    file: 'LoggingService.java',
    code: `public Mono<String> load(Long id) {
  return findById(id)
    .doOnNext(u -> log.info("loaded " + u.getName()));
}`,
    explain: {
      concept: 'doOnNext는 값이 흐를 때 잠깐 끼어들어 부수 효과를 넣는 도구예요. 로그, 측정값을 매 값마다 기록해요.',
      terms: [
        { t: 'doOnNext', d: '값이 통과할 때 끼어드는 동사' },
        { t: 'u -> log.info(...)', d: 'u 한 개를 받아 로그를 남겨요' },
      ],
      why: '로직을 바꾸지 않고 로그나 측정만 끼워넣으려고요.',
      pitfall: 'doOnNext 안에서 무거운 작업을 하면 흐름이 느려지고 블록이 생겨요.',
    },
  },
  {
    id: 'rx-buffer-timeout',
    lang: 'java',
    title: 'Flux.buffer Timed 묶음',
    file: 'WindowService.java',
    code: `public Flux<List<String>> windows() {
  return events()
    .buffer(Duration.ofSeconds(3));
}`,
    explain: {
      concept: 'buffer는 3초마다 흐른 값을 한 봉투로 묶어 보내는 도구예요. 작은 값들을 한 묶음으로 모아요.',
      terms: [
        { t: 'buffer', d: '값을 일정 시간/개수마다 묶어 List로 보내요' },
        { t: 'Duration.ofSeconds(3)', d: '3초 기간을 의미해요' },
        { t: 'Flux<List<String>>', d: '리스트들이 흐르는 호스' },
      ],
      why: '작은 이벤트를 모아 한 번에 저장하거나 보내려고요.',
      pitfall: '시간을 너무 크게 잡으면 첫 묶음이 오래 걸려 반응이 느껴져요.',
    },
  },
  {
    id: 'rx-retry-backoff',
    lang: 'java',
    title: 'retryWhen 지수 백오프',
    file: 'ResilientService.java',
    code: `public Mono<String> callApi(Long id) {
  return fetch(id)
    .retryWhen(Retry.backoff(3, Duration.ofSeconds(1)));
}`,
    explain: {
      concept: 'retryWhen은 실패하면 잠깐 쉬었다 다시 시도하는 재시도 장치예요. backoff는 점점 더 길게 쉬는 규칙이에요.',
      terms: [
        { t: 'retryWhen', d: '오류가 나면 재시도 규칙을 적용하는 동사' },
        { t: 'Retry.backoff(3, ...)', d: '최대 3회, 첫 대기 1초로 점점 늘어나요' },
        { t: 'Duration.ofSeconds(1)', d: '첫 재시도 대기 시간' },
      ],
      why: '잠깐 네트워크 문제가 났을 때 자동으로 회복하려고요.',
      pitfall: '재시도 없이 무한히 반복하면 서버가 공격으로 착각할 수 있어요. 최대 횟수를 꼭 정해요.',
    },
  },
];
