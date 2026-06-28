import type { Snippet } from '../../types';

export const concurrency: Snippet[] = [
  {
    id: 'conc-thread',
    lang: 'java',
    title: 'Thread 직접 생성',
    file: 'HelloThread.java',
    code: `public class HelloThread {

  public static void main(String[] args) {
    Thread t = new Thread(() -> System.out.println("안녕!"));
    t.start();
  }
}`,
    explain: {
      concept: 'Thread는 프로그램 안에서 동시에 돌아가는 작업 단위예요. 한 손으로 책을 읽고 다른 손으로 밥을 먹는 것과 같아요.',
      terms: [
        { t: 'Thread', d: '실행 흐름 단위' },
        { t: 'Runnable', d: '실행할 작업 (람다)' },
        { t: 'start()', d: '새 스레드를 만들어 실행 시작' },
      ],
      why: '한 번에 여러 작업을 동시에 진행하려고요.',
      pitfall: 'run()이 아니라 start()를 써야 새 스레드에서 실행돼요.',
    },
  },
  {
    id: 'conc-runnable',
    lang: 'java',
    title: 'Runnable 인터페이스',
    file: 'Worker.java',
    code: `public class Worker implements Runnable {

  @Override
  public void run() {
    System.out.println("일하는 중");
  }

  public static void main(String[] args) {
    new Thread(new Worker()).start();
  }
}`,
    explain: {
      concept: 'Runnable은 "할 일"을 담는 인터페이스예요. 실행 흐름과 작업을 분리해서 재사용하기 쉬워요.',
      terms: [
        { t: 'implements Runnable', d: '실행 가능한 작업으로 구현' },
        { t: 'run()', d: '실제 작업 내용' },
        { t: '@Override', d: '부모 메서드 재정의 표시' },
      ],
      why: '작업을 객체로 만들어 여러 스레드에서 재사용하려고요.',
      pitfall: 'run()을 직접 부르면 일반 메서드 호출이 돼요.',
    },
  },
  {
    id: 'conc-callable-future',
    lang: 'java',
    title: 'Callable + Future 결과 받기',
    file: 'Calculator.java',
    code: `ExecutorService exec = Executors.newSingleThreadExecutor();
Future<Integer> future = exec.submit(() -> 1 + 2);

try {
  Integer result = future.get();
} catch (InterruptedException e) {
  Thread.currentThread().interrupt();
} catch (ExecutionException e) {
  throw new RuntimeException(e);
}
exec.shutdown();`,
    explain: {
      concept: 'Callable은 결과를 돌려주는 작업이고, Future는 그 결과를 나중에 받을 수 있는 표(영수증)예요. 음식 주문 후 진동벨을 받는 것과 같아요.',
      terms: [
        { t: 'Callable', d: '결과를 반환하는 작업' },
        { t: 'Future', d: '결과를 나중에 받는 객체' },
        { t: 'submit()', d: '작업을 풀에 제출하고 Future 반환' },
        { t: 'get()', d: '결과가 준비될 때까지 블로킹 후 반환' },
      ],
      why: '작업을 미리 제출(submit)해 두고, 결과가 필요한 시점에 get()으로 받으려고요. 제출 이후 get() 호출 전까지 다른 일을 할 수 있어요.',
      pitfall: 'get()은 InterruptedException·ExecutionException을 던지므로 반드시 처리해야 해요. 또한 결과가 나올 때까지 블로킹돼요.',
    },
  },
  {
    id: 'conc-completable',
    lang: 'java',
    title: 'CompletableFuture 비동기',
    file: 'AsyncService.java',
    code: `CompletableFuture<String> cf = CompletableFuture.supplyAsync(() -> "데이터");
cf.thenAccept(s -> System.out.println("결과: " + s));`,
    explain: {
      concept: 'CompletableFuture는 작업이 끝나면 다음 일을 자동으로 이어주는 비동기 파이프라인이에요. 컨베이어 벨트처럼 다음 공정으로 넘겨요.',
      terms: [
        { t: 'supplyAsync', d: '비동기로 공급 작업 실행' },
        { t: 'thenAccept', d: '결과를 소비하는 다음 단계' },
        { t: 's', d: '이전 단계의 결과' },
      ],
      why: '비동기 작업을 콜백으로 연결해 깔끔하게 만들려고요.',
      pitfall: '예외 처리를 안 하면 조용히 실패해요.',
    },
  },
  {
    id: 'conc-then-compose',
    lang: 'java',
    title: 'thenCompose 체인',
    file: 'Pipeline.java',
    code: `CompletableFuture<String> result =
    CompletableFuture.supplyAsync(() -> "1")
        .thenCompose(s -> CompletableFuture.supplyAsync(() -> s + "2"));`,
    explain: {
      concept: 'thenCompose는 앞 작업 결과로 새 비동기 작업을 이어 붙이는 거예요. 다음 단계가 또 다른 벨트인 경우에 써요.',
      terms: [
        { t: 'thenCompose', d: '다음 비동기 작업을 연결' },
        { t: 'supplyAsync', d: '비동기 작업 생성' },
        { t: 's', d: '앞 단계 결과' },
      ],
      why: '비동기 작업을 순서대로 연결하려고요.',
      pitfall: 'thenApply는 동기 변환, thenCompose는 비동기 연결이에요.',
    },
  },
  {
    id: 'conc-all-of',
    lang: 'java',
    title: 'allOf 전부 완료 대기',
    file: 'BatchRunner.java',
    code: `CompletableFuture<Void> all = CompletableFuture.allOf(
    task1, task2, task3);
all.join();`,
    explain: {
      concept: 'allOf는 여러 비동기 작업이 모두 끝날 때까지 기다려요. 모든 선수가 결승선을 통과할 때까지 기다리는 심판 같아요.',
      terms: [
        { t: 'allOf', d: '모든 작업 완료 대기' },
        { t: 'task1,2,3', d: '개별 비동기 작업' },
        { t: 'join()', d: '완료까지 대기 (체크 예외 없음)' },
      ],
      why: '여러 작업을 병렬로 돌리고 모두 끝난 뒤 진행하려고요.',
      pitfall: 'allOf 자체는 결과를 주지 않아요. 각 future에서 직접 가져와요.',
    },
  },
  {
    id: 'conc-executors',
    lang: 'java',
    title: 'Executors 스레드풀',
    file: 'PoolService.java',
    code: `ExecutorService exec = Executors.newFixedThreadPool(4);
exec.submit(() -> System.out.println("작업"));
exec.shutdown();`,
    explain: {
      concept: 'Executors는 스레드를 미리 여러 개 만들어 두고 돌려 쓰는 풀이에요. 택시 대기 큐처럼 스레드를 재사용해요.',
      terms: [
        { t: 'newFixedThreadPool', d: '고정 크기 스레드풀' },
        { t: '4', d: '스레드 개수' },
        { t: 'submit', d: '작업 제출' },
        { t: 'shutdown', d: '풀 종료' },
      ],
      why: '스레드 생성 비용을 줄이고 안정적으로 작업을 처리하려고요.',
      pitfall: 'shutdown을 안 하면 프로그램이 종료되지 않아요.',
    },
  },
  {
    id: 'conc-thread-pool-executor',
    lang: 'java',
    title: 'ThreadPoolExecutor 커스텀',
    file: 'CustomPool.java',
    code: `ThreadPoolExecutor pool = new ThreadPoolExecutor(
    2, 4, 60L, TimeUnit.SECONDS,
    new LinkedBlockingQueue<>());
pool.execute(() -> work());
pool.shutdown();`,
    explain: {
      concept: 'ThreadPoolExecutor는 풀의 크기와 대기열을 직접 정할 수 있는 도구예요. 직원 수와 대기 줄 길이를 모두 조절해요.',
      terms: [
        { t: 'corePoolSize', d: '기본 스레드 수' },
        { t: 'maxPoolSize', d: '최대 스레드 수' },
        { t: 'keepAlive', d: '유휴 스레드 유지 시간' },
        { t: 'LinkedBlockingQueue', d: '작업 대기열' },
      ],
      why: '부하에 맞춰 풀을 세밀하게 조절하려고요.',
      pitfall: '큐가 꽉 차고 최대 스레드까지 찼을 때 거부 정책이 실행돼요.',
    },
  },
  {
    id: 'conc-fork-join',
    lang: 'java',
    title: 'ForkJoinPool 분할 정복',
    file: 'SumTask.java',
    code: `class SumTask extends RecursiveTask<Long> {
  private final long[] arr;
  private final int from, to;

  SumTask(long[] arr, int from, int to) {
    this.arr = arr;
    this.from = from;
    this.to = to;
  }

  @Override
  protected Long compute() {
    if (to - from < 100) {
      long sum = 0;
      for (int i = from; i < to; i++) sum += arr[i];
      return sum;
    }
    int mid = (from + to) / 2;
    SumTask left  = new SumTask(arr, from, mid);
    SumTask right = new SumTask(arr, mid, to);
    left.fork();
    return right.compute() + left.join();
  }
}`,
    explain: {
      concept: 'ForkJoinPool은 큰 작업을 작게 쪼개(fork) 동시에 처리하고 결과를 합치는(join) 방식이에요. 큰 빵을 여러 조각으로 잘라 나눠 굽는 것과 같아요.',
      terms: [
        { t: 'RecursiveTask', d: '결과를 반환하는 분할 작업' },
        { t: 'fork()', d: '왼쪽 절반을 비동기로 실행' },
        { t: 'join()', d: '포크된 작업의 결과를 기다림' },
        { t: 'compute()', d: '실제 작업 로직 — 작으면 직접 계산, 크면 분할' },
      ],
      why: '재귀적으로 쪼갤 수 있는 큰 작업을 빠르게 처리하려고요.',
      pitfall: '작업 단위가 너무 작으면 분할 비용이 더 커져요.',
    },
  },
  {
    id: 'conc-scheduled',
    lang: 'java',
    title: 'ScheduledExecutor 예약 실행',
    file: 'Scheduler.java',
    code: `ScheduledExecutorService sched = Executors.newScheduledThreadPool(1);
sched.scheduleAtFixedRate(() -> System.out.println("틱"), 0, 1, TimeUnit.SECONDS);`,
    explain: {
      concept: 'ScheduledExecutor는 작업을 나중에 또는 주기적으로 실행해 주는 타이머예요. 알람 시계처럼 정해진 시간에 울려요.',
      terms: [
        { t: 'newScheduledThreadPool', d: '예약 실행 풀' },
        { t: 'scheduleAtFixedRate', d: '고정 주기 반복' },
        { t: 'TimeUnit.SECONDS', d: '시간 단위' },
      ],
      why: '주기적인 작업을 안전하게 실행하려고요.',
      pitfall: '작업에서 예외가 나면 반복이 멈춰요.',
    },
  },
  {
    id: 'conc-concurrent-map',
    lang: 'java',
    title: 'ConcurrentHashMap 동시 맵',
    file: 'Counter.java',
    code: `ConcurrentMap<String, Integer> counts = new ConcurrentHashMap<>();
counts.merge("apple", 1, Integer::sum);
System.out.println(counts.get("apple"));`,
    explain: {
      concept: 'ConcurrentHashMap은 여러 스레드가 동시에 안전하게 쓸 수 있는 맵이에요. 사물함 여러 칸에 각자 동시에 접근하는 것과 같아요.',
      terms: [
        { t: 'ConcurrentHashMap', d: '스레드 안전 맵' },
        { t: 'merge', d: '키가 있으면 합치고 없으면 넣기' },
        { t: 'Integer::sum', d: '값을 더하는 함수' },
      ],
      why: '여러 스레드가 같은 맵을 안전하게 공유하려고요.',
      pitfall: '전체 순회 중 수정이 가능해 일관성에 주의해요.',
    },
  },
  {
    id: 'conc-blocking-queue',
    lang: 'java',
    title: 'BlockingQueue 생산-소비',
    file: 'PipelineQueue.java',
    code: `BlockingQueue<String> queue = new ArrayBlockingQueue<>(10);

new Thread(() -> {
  try {
    queue.put("작업");
  } catch (InterruptedException e) {
    Thread.currentThread().interrupt();
  }
}).start();

new Thread(() -> {
  try {
    String item = queue.take();
    System.out.println("소비: " + item);
  } catch (InterruptedException e) {
    Thread.currentThread().interrupt();
  }
}).start();`,
    explain: {
      concept: 'BlockingQueue는 꽉 차거나 비어 있을 때 자동으로 기다려 주는 대기열이에요. 컨베이어 벨트가 비면 기다리고, 꽉 차면 멈춰요.',
      terms: [
        { t: 'BlockingQueue', d: '블로킹 대기열' },
        { t: 'put()', d: '꽉 차면 대기하며 넣기 — InterruptedException 발생 가능' },
        { t: 'take()', d: '비어 있으면 대기하며 꺼내기 — InterruptedException 발생 가능' },
        { t: 'ArrayBlockingQueue', d: '고정 크기 배열 기반 대기열' },
      ],
      why: '생산자와 소비자를 안전하게 연결하려고요.',
      pitfall: '생산자가 소비자보다 훨씬 빠르면 큐가 꽉 차 put이 블로킹돼요. 소비자 스레드가 종료되면 생산자가 영원히 대기할 수 있어요.',
    },
  },
  {
    id: 'conc-atomic-integer',
    lang: 'java',
    title: 'AtomicInteger 원자 카운터',
    file: 'AtomicCounter.java',
    code: `AtomicInteger counter = new AtomicInteger(0);
counter.incrementAndGet();
System.out.println(counter.get());`,
    explain: {
      concept: 'AtomicInteger는 여러 스레드가 동시에 더해도 안전하게 값이 바뀌는 숫자 상자예요. 한 번에 하나씩만 바뀌게 잠금 없이 처리해요.',
      terms: [
        { t: 'AtomicInteger', d: '원자적 정수' },
        { t: 'incrementAndGet', d: '1 증가 후 값 반환' },
        { t: 'get', d: '현재 값 조회' },
      ],
      why: 'synchronized 없이 안전하게 카운터를 올리려고요.',
      pitfall: '여러 변수를 같이 바꿀 땐 원자성이 보장되지 않아요.',
    },
  },
  {
    id: 'conc-reentrant-lock',
    lang: 'java',
    title: 'ReentrantLock 명시적 잠금',
    file: 'LockService.java',
    code: `ReentrantLock lock = new ReentrantLock();
lock.lock();
try {
  count++;
} finally {
  lock.unlock();
}`,
    explain: {
      concept: 'ReentrantLock은 화장실 문을 직접 잠그고 여는 잠금이에요. 같은 스레드면 여러 번 잠글 수 있어요.',
      terms: [
        { t: 'ReentrantLock', d: '재진입 가능 잠금' },
        { t: 'lock()', d: '잠금 획득' },
        { t: 'unlock()', d: '잠금 해제' },
        { t: 'finally', d: '예외 여부와 관계없이 실행' },
      ],
      why: 'synchronized보다 유연한 잠금이 필요할 때 써요.',
      pitfall: 'unlock을 빼면 교착 상태가 발생해요. 반드시 finally에 넣어요.',
    },
  },
  {
    id: 'conc-semaphore',
    lang: 'java',
    title: 'Semaphore 동시 접속 제한',
    file: 'GateService.java',
    code: `Semaphore sem = new Semaphore(3);
try {
  sem.acquire();
  try {
    accessResource();
  } finally {
    sem.release();
  }
} catch (InterruptedException e) {
  Thread.currentThread().interrupt();
}`,
    explain: {
      concept: 'Semaphore는 동시에 들어갈 수 있는 인원을 정해 두는 입장권이에요. 식당 자리가 3개라 3명만 동시에 들어가요.',
      terms: [
        { t: 'Semaphore', d: '허가권 관리 도구' },
        { t: '3', d: '동시 허용 개수' },
        { t: 'acquire', d: '허가권 획득 — InterruptedException 발생 가능' },
        { t: 'release', d: '허가권 반납' },
      ],
      why: '동시에 사용할 수 있는 자원 수를 제한하려고요.',
      pitfall: 'acquire()는 InterruptedException을 던지므로 반드시 처리해야 해요. release를 안 하면 허가권이 고갈돼요.',
    },
  },
  {
    id: 'conc-count-down-latch',
    lang: 'java',
    title: 'CountDownLatch 시작 신호',
    file: 'StartGate.java',
    code: `CountDownLatch latch = new CountDownLatch(1);
new Thread(() -> {
  try {
    latch.await();
    System.out.println("출발!");
  } catch (InterruptedException e) {
    Thread.currentThread().interrupt();
  }
}).start();
latch.countDown();`,
    explain: {
      concept: 'CountDownLatch는 카운트가 0이 될 때까지 기다리는 신호탄이에요. 출발 총성이 울릴 때까지 모두 대기해요.',
      terms: [
        { t: 'CountDownLatch', d: '카운트다운 대기' },
        { t: 'await()', d: '0이 될 때까지 대기 — InterruptedException 발생 가능' },
        { t: 'countDown()', d: '카운트 1 감소' },
      ],
      why: '여러 스레드의 시작을 한 번에 맞추려고요.',
      pitfall: '카운트가 0이 되면 재사용할 수 없어요.',
    },
  },
  {
    id: 'conc-volatile',
    lang: 'java',
    title: 'volatile 가시성',
    file: 'FlagHolder.java',
    code: `public class FlagHolder {
  private volatile boolean running = true;

  public void stop() {
    running = false;
  }
}`,
    explain: {
      concept: 'volatile은 변수 값을 여러 스레드가 항상 최신으로 보게 하는 표시예요. 게시판의 공지를 항상 최신으로 보는 것과 같아요.',
      terms: [
        { t: 'volatile', d: '메모리 가시성 보장' },
        { t: 'boolean', d: '참/거짓 플래그' },
        { t: 'running', d: '실행 여부' },
      ],
      why: '한 스레드가 바꾼 값을 다른 스레드가 바로 보게 하려고요.',
      pitfall: '읽기/쓰기만 보장하고 복합 연산은 안전하지 않아요.',
    },
  },
  {
    id: 'conc-synchronized',
    lang: 'java',
    title: 'synchronized 블록',
    file: 'SyncCounter.java',
    code: `public class SyncCounter {
  private int count = 0;

  public void inc() {
    synchronized (this) {
      count++;
    }
  }
}`,
    explain: {
      concept: 'synchronized는 한 스레드만 들어갈 수 있는 단방 문이에요. 안에 있는 동안 다른 스레드는 밖에서 기다려요.',
      terms: [
        { t: 'synchronized', d: '한 스레드만 진입 허용' },
        { t: 'this', d: '잠금 대상 객체' },
        { t: 'count++', d: '임계 영역 안의 증가' },
      ],
      why: '공유 변수를 여러 스레드가 동시에 바꾸지 않으려고요.',
      pitfall: '잠금 범위가 크면 성능이 떨어져요.',
    },
  },
  {
    id: 'conc-run-async',
    lang: 'java',
    title: 'runAsync 불반환 비동기',
    file: 'FireAndForget.java',
    code: `CompletableFuture<Void> fire = CompletableFuture.runAsync(() -> {
  sendEmail();
});
fire.join();`,
    explain: {
      concept: 'runAsync는 결과를 돌려주지 않는 비동기 작업이에요. 결과 없이 실행만 하면 되는 "쏘고 잊기" 작업에 써요.',
      terms: [
        { t: 'runAsync', d: '반환값 없는 비동기 실행' },
        { t: 'Void', d: '결과 없음 표시' },
        { t: 'join()', d: '완료까지 대기' },
      ],
      why: '결과가 필요 없는 작업을 백그라운드에서 돌리려고요.',
      pitfall: '예외를 따로 처리하지 않으면 join에서 던져져요.',
    },
  },
  {
    id: 'conc-exceptionally',
    lang: 'java',
    title: 'exceptionally 예외 처리',
    file: 'SafeRunner.java',
    code: `CompletableFuture<String> safe = CompletableFuture
    .supplyAsync(() -> riskyCall())
    .exceptionally(ex -> "fallback");`,
    explain: {
      concept: 'exceptionally는 앞 단계에서 예외가 나면 대신 실행되는 복구 단계예요. 넘어지면 대신 일어서 주는 보조자 같아요.',
      terms: [
        { t: 'exceptionally', d: '예외 시 대체 작업' },
        { t: 'supplyAsync', d: '비동기 작업' },
        { t: 'ex', d: '발생한 예외' },
        { t: 'fallback', d: '대체 결과' },
      ],
      why: '비동기 파이프라인에서 실패를 부드럽게 복구하려고요.',
      pitfall: '예외를 잡아도 체인은 계속 진행돼요.',
    },
  },
];
