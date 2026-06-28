import type { Snippet } from '../../types';

export const concurrency: Snippet[] = [
  {
    id: 'conc-thread',
    lang: 'java',
    title: 'Thread 직접 생성',
    file: 'HelloThread.java',
    code: `public class HelloThread {

  public static void main(String[] args) {
    System.out.println("[실행] 메인 스레드 시작");
    Thread t = new Thread(() -> System.out.println("[실행] 새 스레드: 안녕!"));
    t.start();
    System.out.println("[실행] 메인 스레드 종료 (새 스레드는 별도 실행 중)");
  }
}`,
    explain: {
      concept:
        'Thread는 프로그램 안에서 동시에 실행되는 독립적인 작업 흐름이에요. 한 사람이 책을 읽으면서 동시에 음악을 듣는 것처럼, 하나의 프로그램이 여러 일을 동시에 처리할 수 있게 해줘요. ' +
        '람다(() -> ...)로 실행할 작업을 정의하고, start()로 새 스레드를 만들어 실행을 시작해요 - 이 순간부터 메인 스레드와 새 스레드가 각자 독립적으로 동작해요. ' +
        '실무에서는 웹 서버가 여러 사용자 요청을 동시에 처리하거나, 대용량 파일을 백그라운드에서 처리할 때 스레드를 써요.',
      terms: [
        { t: 'Thread', d: '동시에 실행되는 독립적인 작업 단위예요 - 여러 개가 동시에 돌아갈 수 있어요' },
        { t: '() -> System.out.println(...)', d: '람다로 스레드가 실행할 작업을 정의해요 - Runnable 인터페이스의 구현체예요' },
        { t: 'start()', d: 'JVM에게 새 스레드를 생성해서 이 작업을 실행하라고 지시해요 - 호출 즉시 반환되고 실제 실행은 비동기로 진행돼요' },
        { t: 'main', d: '프로그램이 시작되는 메인 스레드예요 - main()이 끝나도 다른 스레드가 살아있으면 프로그램은 종료되지 않아요' },
      ],
      why:
        '시간이 오래 걸리는 작업(파일 다운로드, 대량 데이터 처리 등)을 메인 스레드와 분리해서, 사용자에게 응답이 멈춘 것처럼 보이지 않게 하려고 써요. ' +
        '실무에서는 웹 서버가 각 요청마다 새 스레드를 할당해서 동시에 여러 클라이언트를 처리해요.',
      expectedOutput:
        'java HelloThread\n' +
        '[실행] 메인 스레드 시작\n' +
        '[실행] 메인 스레드 종료 (새 스레드는 별도 실행 중)\n' +
        '[실행] 새 스레드: 안녕!',
      realWorldUsage:
        '실제로 안드로이드 앱에서 네트워크 요청은 메인 스레드(UI 스레드)가 아닌 별도 스레드에서 처리해야 해요. 메인 스레드에서 네트워크를 기다리면 앱이 멈춰버려요.',
      pitfall: 'start() 대신 run()을 직접 호출하면 새 스레드가 생성되지 않고, 현재 스레드에서 run()이 일반 메서드처럼 실행돼요. 반드시 start()를 써야 비동기 실행이 돼요.',
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
    System.out.println("[실행] 작업 시작");
    System.out.println("[실행] 일하는 중");
  }

  public static void main(String[] args) {
    System.out.println("[실행] Worker 생성 및 실행");
    new Thread(new Worker()).start();
    System.out.println("[실행] 메인은 계속 진행");
  }
}`,
    explain: {
      concept:
        'Runnable은 "실행할 작업"을 나타내는 함수형 인터페이스예요. Thread와 작업을 분리해서, 같은 작업 객체를 여러 스레드에서 재사용할 수 있게 해줘요. ' +
        'implements Runnable로 직접 클래스를 만들어서, run() 메서드에 실행할 로직을 작성해요 - Thread 생성자에 이 Worker를 넘기면, start() 호출 시 run()이 새 스레드에서 실행돼요. ' +
        '@Override는 "부모(인터페이스)의 메서드를 재정의하고 있어요"라는 표시로, 오타로 인한 실수를 컴파일 시점에 잡아줘요.',
      terms: [
        { t: 'implements Runnable', d: '이 클래스가 Runnable 타입으로 동작할 수 있다고 약속해요 - Thread에 넘길 수 있어요' },
        { t: 'run()', d: '스레드가 실제로 실행할 작업 내용이에요 - start() 호출 시 새 스레드에서 이 메서드가 실행돼요' },
        { t: '@Override', d: '인터페이스의 메서드를 재정의한다고 표시해요 - 철자가 틀리면 컴파일 에러가 나서 실수를 방지해줘요' },
        { t: 'new Thread(new Worker())', d: 'Worker 객체를 Thread 생성자에 넘겨서 스레드와 작업을 연결해요' },
      ],
      why:
        '작업을 객체로 분리해서, 하나의 Runnable을 여러 스레드에서 재사용하거나 스레드 풀에 제출(submit)하려고 써요. ' +
        '실무에서는 ExecutorService.submit(new Worker()) 형태로 스레드 풀에 작업을 제출하는 패턴이 표준이에요.',
      expectedOutput:
        'java Worker\n' +
        '[실행] Worker 생성 및 실행\n' +
        '[실행] 메인은 계속 진행\n' +
        '[실행] 작업 시작\n' +
        '[실행] 일하는 중',
      realWorldUsage:
        '실제로 배치 처리에서 10만 건의 데이터를 4개 스레드가 나눠 처리할 때, 각 스레드에 동일한 Runnable을 할당해서 병렬 처리해요.',
      pitfall: 'run()을 직접 호출하면 새 스레드가 아니라 현재 스레드에서 일반 메서드처럼 실행돼요. 반드시 Thread.start()나 ExecutorService.submit()을 통해 실행해야 해요.',
    },
  },
  {
    id: 'conc-callable-future',
    lang: 'java',
    title: 'Callable + Future 결과 받기',
    file: 'Calculator.java',
    code: `import java.util.concurrent.Callable;
import java.util.concurrent.ExecutionException;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;
import java.util.concurrent.Future;

public class Calculator {
  public static void main(String[] args) {
    ExecutorService exec = Executors.newSingleThreadExecutor();
    System.out.println("[실행] Callable 작업 제출");
    Future<Integer> future = exec.submit((Callable<Integer>) () -> {
      System.out.println("[실행] 계산 중...");
      return 1 + 2;
    });

    try {
      Integer result = future.get();
      System.out.println("[결과] 계산 결과: " + result);
    } catch (InterruptedException e) {
      Thread.currentThread().interrupt();
      System.out.println("[오류] 작업이 인터럽트됨");
    } catch (ExecutionException e) {
      System.out.println("[오류] 작업 실행 중 예외: " + e.getCause());
      throw new RuntimeException(e);
    }
    exec.shutdown();
    System.out.println("[실행] Executor 종료");
  }
}`,
    explain: {
      concept:
        'Callable은 Runnable과 비슷하지만 결과를 반환할 수 있는 작업이고, Future는 그 결과를 나중에 받을 수 있는 "영수증"이에요. ' +
        'submit()으로 작업을 스레드 풀에 제출하면 즉시 Future가 반환되고, 메인 스레드는 다른 일을 하다가 결과가 필요할 때 get()을 호출해서 기다려요. ' +
        '음식을 주문하고 받은 진동벨(Future)을 들고 있다가, 음식이 준비되면(get()이 반환되면) 받으러 가는 것과 같아요. ' +
        'get()은 체크 예외 2개(InterruptedException, ExecutionException)를 던질 수 있어서 반드시 try-catch로 처리해야 해요.',
      terms: [
        { t: 'Callable<Integer>', d: 'Integer 타입의 결과를 반환하는 비동기 작업이에요 - Runnable은 void지만 Callable은 값을 돌려줘요' },
        { t: 'Future<Integer>', d: '비동기 작업의 결과를 나중에 받을 수 있는 핸들이에요 - get()으로 결과를 기다려요' },
        { t: 'submit()', d: '작업을 ExecutorService에 제출하고 즉시 Future를 반환해요 - 블로킹되지 않아요' },
        { t: 'get()', d: '결과가 준비될 때까지 현재 스레드를 블로킹하고 기다려요 - InterruptedException과 ExecutionException을 던져요' },
        { t: 'shutdown()', d: 'ExecutorService를 안전하게 종료해요 - 호출하지 않으면 프로그램이 종료되지 않아요' },
      ],
      why:
        '작업을 미리 제출(submit)해 두고, 결과가 필요할 때만 get()으로 가져오려고 써요. ' +
        '제출 후 get() 전까지 다른 일을 할 수 있어서, 전체 처리 시간을 줄일 수 있어요.',
      expectedOutput:
        'java Calculator\n' +
        '[실행] Callable 작업 제출\n' +
        '[실행] 계산 중...\n' +
        '[결과] 계산 결과: 3\n' +
        '[실행] Executor 종료',
      realWorldUsage:
        '실제로 여러 외부 API를 동시에 호출해서 결과를 모아야 할 때, 각 API 호출을 Callable로 만들어 submit()하고, 모든 Future.get()으로 결과를 수집해요.',
      pitfall: 'get()은 결과가 준비될 때까지 블로킹되므로, 메인 스레드에서 너무 오래 기다리면 응답이 멈춘 것처럼 보여요. timeout을 지정하는 get(long, TimeUnit)을 고려하세요.',
    },
  },
  {
    id: 'conc-completable',
    lang: 'java',
    title: 'CompletableFuture 비동기',
    file: 'AsyncService.java',
    code: `import java.util.concurrent.CompletableFuture;

public class AsyncService {
  public static void main(String[] args) {
    System.out.println("[실행] 비동기 파이프라인 시작");
    CompletableFuture<String> cf = CompletableFuture.supplyAsync(() -> {
      System.out.println("[실행] 데이터 생성 중...");
      return "데이터";
    });
    cf.thenAccept(s -> System.out.println("[결과] 받은 데이터: " + s));
    cf.join();
    System.out.println("[실행] 파이프라인 완료");
  }
}`,
    explain: {
      concept:
        'CompletableFuture는 작업이 끝나면 다음 작업을 자동으로 이어주는 비동기 파이프라인을 만들어줘요. ' +
        'supplyAsync로 백그라운드에서 데이터를 생성하고, thenAccept로 그 결과를 받아 소비하는 두 단계를 컨베이어 벨트처럼 연결해요. ' +
        'Future와 가장 큰 차이점은, get()으로 수동으로 기다리지 않아도 "다 끝나면 이걸 해줘"라고 미리 등록(thenAccept)해둘 수 있다는 점이에요. ' +
        '실무에서는 외부 API 호출 후 DB 저장, 이메일 발송 후 로그 기록 같은 연쇄 작업에 CompletableFuture를 써요.',
      terms: [
        { t: 'supplyAsync(() -> ...)', d: '백그라운드(ForkJoinPool.commonPool())에서 실행할 비동기 작업을 생성해요 - 결과를 반환해요' },
        { t: 'thenAccept(s -> ...)', d: '앞 작업이 완료되면 그 결과(s)를 받아서 소비만 해요 - 반환값 없이 끝나요' },
        { t: 'join()', d: '완료될 때까지 현재 스레드를 블로킹해요 - get()과 달리 체크 예외를 던지지 않아요' },
        { t: 'CompletableFuture<String>', d: '비동기 파이프라인의 결과 타입이 String이라는 의미예요' },
      ],
      why:
        '비동기 작업을 콜백으로 연결해서, "A 끝나면 B, B 끝나면 C" 같은 흐름을 중첩 콜백 없이 평평하게 작성하려고 써요. ' +
        'JavaScript의 Promise.then()과 같은 개념이에요.',
      expectedOutput:
        'java AsyncService\n' +
        '[실행] 비동기 파이프라인 시작\n' +
        '[실행] 데이터 생성 중...\n' +
        '[결과] 받은 데이터: 데이터\n' +
        '[실행] 파이프라인 완료',
      realWorldUsage:
        '실제로 결제 API 호출(supplyAsync) → 결과 로깅(thenAccept) → 사용자에게 알림 발송(thenAccept)처럼 여러 단계로 이어지는 비동기 워크플로우에 써요.',
      pitfall: '예외 처리를 따로 하지 않으면 비동기 작업에서 예외가 발생해도 조용히 실패해요. exceptionally()나 whenComplete()로 예외 처리를 꼭 추가하세요.',
    },
  },
  {
    id: 'conc-then-compose',
    lang: 'java',
    title: 'thenCompose 체인',
    file: 'Pipeline.java',
    code: `import java.util.concurrent.CompletableFuture;

public class Pipeline {
  public static void main(String[] args) {
    System.out.println("[실행] 비동기 체인 시작");
    CompletableFuture<String> result =
        CompletableFuture.supplyAsync(() -> {
          System.out.println("[실행] 1단계: '1' 생성");
          return "1";
        })
        .thenCompose(s -> {
          System.out.println("[실행] 2단계: '" + s + "'에 '2' 추가");
          return CompletableFuture.supplyAsync(() -> s + "2");
        });
    System.out.println("[결과] 최종: " + result.join());
  }
}`,
    explain: {
      concept:
        'thenCompose는 앞 작업의 결과를 받아 "새로운 비동기 작업"을 이어 붙이는 메서드예요 - thenApply와의 차이가 중요해요. ' +
        'thenApply는 결과를 동기적으로 변환(sync map)하고, thenCompose는 결과로 또 다른 비동기 작업(CompletableFuture)을 반환하는 거예요 - 평평하게 펴주는(flatMap) 역할이에요. ' +
        '1단계에서 "1"을 생성하고, 2단계에서 그 "1"에 "2"를 추가하는 새 비동기 작업을 시작해요 - 두 작업이 순차적으로 실행되지만 각각 별도 스레드에서 돌아갈 수 있어요. ' +
        '실무에서는 "DB 조회 결과로 외부 API 호출"처럼, 이전 결과에 의존하는 다음 비동기 호출을 연결할 때 thenCompose를 써요.',
      terms: [
        { t: 'thenCompose(s -> CompletableFuture...)', d: '앞 결과 s로 새 비동기 작업을 만들어 평평하게 연결해요 - 중첩 CompletableFuture를 방지해요' },
        { t: 'supplyAsync(() -> s + "2")', d: '앞 단계 결과 s를 받아 "s2"를 반환하는 새 비동기 작업을 생성해요' },
        { t: 'result.join()', d: '파이프라인이 끝날 때까지 메인 스레드를 기다리게 해요' },
      ],
      why:
        '비동기 작업을 순서대로 연결하려고 thenCompose를 써요. ' +
        'thenApply를 쓰면 CompletableFuture<CompletableFuture<String>> 같은 중첩 타입이 생기지만, thenCompose는 평평한 CompletableFuture<String>을 유지해줘요.',
      expectedOutput:
        'java Pipeline\n' +
        '[실행] 비동기 체인 시작\n' +
        '[실행] 1단계: \'1\' 생성\n' +
        '[실행] 2단계: \'1\'에 \'2\' 추가\n' +
        '[결과] 최종: 12',
      realWorldUsage:
        '실제로 "사용자 조회(비동기 DB 호출) → 조회 결과로 권한 확인(비동기 API 호출)"처럼, 이전 결과가 필요한 연쇄 비동기 호출에 thenCompose를 써요.',
      pitfall: 'thenApply는 동기 변환(Function<T,U>), thenCompose는 비동기 연결(Function<T, CompletableFuture<U>>)이에요. 헷갈리면 "thenApply = map, thenCompose = flatMap"이라고 기억하세요.',
    },
  },
  {
    id: 'conc-all-of',
    lang: 'java',
    title: 'allOf 전부 완료 대기',
    file: 'BatchRunner.java',
    code: `import java.util.concurrent.CompletableFuture;

public class BatchRunner {
  public static void main(String[] args) {
    System.out.println("[실행] 병렬 작업 시작");
    CompletableFuture<String> t1 = CompletableFuture.supplyAsync(() -> {
      System.out.println("[실행] 작업1 실행");
      return "작업1";
    });
    CompletableFuture<String> t2 = CompletableFuture.supplyAsync(() -> {
      System.out.println("[실행] 작업2 실행");
      return "작업2";
    });

    CompletableFuture<Void> all = CompletableFuture.allOf(t1, t2);
    all.join();
    System.out.println("[결과] 모든 작업 완료 - t1: " + t1.join() + ", t2: " + t2.join());
  }
}`,
    explain: {
      concept:
        'allOf는 여러 비동기 작업을 동시에 실행하고, "모든 작업이 끝날 때까지" 기다리는 조율 도구예요. ' +
        't1, t2, t3을 병렬로 실행하고 allOf(t1, t2, t3).join()으로 세 작업이 모두 완료될 때까지 기다려요 - 마치 모든 선수가 결승선을 통과할 때까지 기다리는 심판이에요. ' +
        'allOf 자체는 Void를 반환해서 개별 결과를 주지 않아요 - 각 CompletableFuture에서 join()이나 get()으로 직접 결과를 가져와야 해요. ' +
        '실무에서는 여러 API를 동시에 호출해서 응답을 모을 때, 한 작업의 결과가 다른 작업에 의존하지 않을 때 allOf를 써요.',
      terms: [
        { t: 'allOf(t1, t2)', d: '모든 CompletableFuture가 완료될 때까지 기다리는 새 CompletableFuture를 반환해요' },
        { t: 'Void', d: 'allOf는 개별 결과를 반환하지 않아요 - 결과는 각각 따로 가져와야 해요' },
        { t: 'all.join()', d: '모든 작업이 완료될 때까지 현재 스레드를 블로킹해요' },
        { t: 't1.join()', d: 'allOf 완료 후에는 join()이 즉시 반환돼요 - 이미 작업이 끝났으니까요' },
      ],
      why:
        '서로 독립적인 여러 작업을 병렬로 실행하고, 모든 결과를 모아서 다음 처리를 하려고 써요. ' +
        '순차 실행(3초+2초=5초) 대신 병렬 실행(max(3초,2초)=3초)으로 전체 시간을 단축할 수 있어요.',
      expectedOutput:
        'java BatchRunner\n' +
        '[실행] 병렬 작업 시작\n' +
        '[실행] 작업1 실행\n' +
        '[실행] 작업2 실행\n' +
        '[결과] 모든 작업 완료 - t1: 작업1, t2: 작업2',
      realWorldUsage:
        '실제로 상품 상세 페이지에서 상품 정보, 리뷰 목록, 연관 상품을 3개 API에서 동시에 가져올 때 allOf로 병렬 호출해요. 순차 호출보다 응답 시간이 3배 빨라져요.',
      pitfall: 'allOf 자체는 결과를 반환하지 않아요. 모든 작업 완료 후 개별 CompletableFuture에서 join()으로 결과를 가져와야 하는데, 이미 완료됐으므로 블로킹 없이 즉시 반환돼요.',
    },
  },
  {
    id: 'conc-executors',
    lang: 'java',
    title: 'Executors 스레드풀',
    file: 'PoolService.java',
    code: `import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;

public class PoolService {
  public static void main(String[] args) {
    System.out.println("[실행] 스레드 풀 생성 (4개)");
    ExecutorService exec = Executors.newFixedThreadPool(4);
    exec.submit(() -> System.out.println("[실행] 작업1 실행"));
    exec.submit(() -> System.out.println("[실행] 작업2 실행"));
    exec.shutdown();
    System.out.println("[실행] 풀 종료 요청됨");
  }
}`,
    explain: {
      concept:
        'Executors는 스레드를 미리 만들어 두고 재사용하는 스레드 풀을 생성해 주는 팩토리 클래스예요. ' +
        'newFixedThreadPool(4)는 고정 크기 4개의 스레드를 가진 풀을 만들어서, 새 작업이 들어오면 대기 중인 스레드에 할당해줘요 - 스레드를 매번 생성/삭제하는 비용을 없애 성능을 크게 높여줘요. ' +
        'shutdown()은 풀을 안전하게 종료하는 명령이에요 - 이미 제출된 작업은 끝까지 처리하고, 새 작업은 거부해요. 이걸 호출하지 않으면 스레드 풀이 영원히 살아있어서 프로그램이 종료되지 않아요.',
      terms: [
        { t: 'newFixedThreadPool(4)', d: '4개의 스레드를 가진 고정 크기 풀을 생성해요 - 동시에 최대 4개 작업까지 실행해요' },
        { t: 'submit(() -> ...)', d: '스레드 풀에 작업을 제출해요 - 사용 가능한 스레드가 있으면 즉시 실행, 없으면 큐에서 대기해요' },
        { t: 'shutdown()', d: '풀을 단계적으로 종료해요 - 새 작업 거부 + 기존 작업 완료 후 종료' },
      ],
      why:
        '스레드 생성 비용을 줄이고, 동시 실행 가능한 스레드 수를 제한해서 시스템 과부하를 방지하려고 써요. ' +
        '매 요청마다 new Thread() 하면 스레드 생성 비용이 누적돼서 성능이 급격히 떨어져요.',
      expectedOutput:
        'java PoolService\n' +
        '[실행] 스레드 풀 생성 (4개)\n' +
        '[실행] 작업1 실행\n' +
        '[실행] 작업2 실행\n' +
        '[실행] 풀 종료 요청됨',
      realWorldUsage:
        '실제로 웹 애플리케이션에서 외부 API를 병렬 호출할 때, ExecutorService로 스레드 수를 제한해서 API 서버에 너무 많은 요청이 한꺼번에 가는 걸 방지해요.',
      pitfall: 'shutdown()을 호출하지 않으면 데몬 스레드가 아닌 경우 프로그램이 종료되지 않아요. try-finally로 반드시 shutdown()을 보장하거나, try-with-resources에서 ExecutorService를 닫는 게 좋아요.',
    },
  },
  {
    id: 'conc-thread-pool-executor',
    lang: 'java',
    title: 'ThreadPoolExecutor 커스텀',
    file: 'CustomPool.java',
    code: `import java.util.concurrent.LinkedBlockingQueue;
import java.util.concurrent.ThreadPoolExecutor;
import java.util.concurrent.TimeUnit;

public class CustomPool {
  public static void main(String[] args) {
    ThreadPoolExecutor pool = new ThreadPoolExecutor(
        2, 4, 60L, TimeUnit.SECONDS,
        new LinkedBlockingQueue<>());
    System.out.println("[실행] 커스텀 풀 생성 - core:2, max:4, queue:무제한");
    pool.execute(() -> System.out.println("[실행] 작업 실행"));
    pool.shutdown();
  }
}`,
    explain: {
      concept:
        'ThreadPoolExecutor는 스레드 풀의 동작을 세밀하게 제어할 수 있는 핵심 클래스예요. Executors 팩토리 메서드도 내부적으로는 이 클래스를 쓰고 있어요. ' +
        'corePoolSize(2)는 평소에 유지할 기본 스레드 수, maximumPoolSize(4)는 큐가 가득 찼을 때 늘릴 수 있는 최대 스레드 수, keepAliveTime(60초)은 초과 스레드가 유휴 상태일 때 유지할 시간이에요. ' +
        'LinkedBlockingQueue는 작업 대기열로, 여기선 용량 제한이 없어서 큐가 절대 꽉 차지 않아요 - 즉 maximumPoolSize까지 스레드가 늘어나는 일은 없어요. ' +
        '실무에서는 부하 특성에 맞춰 core/max 크기와 큐 크기를 튜닝하는 게 중요해요.',
      terms: [
        { t: 'corePoolSize = 2', d: '기본으로 유지하는 스레드 수예요 - 유휴 상태여도 이만큼은 유지해요' },
        { t: 'maxPoolSize = 4', d: '큐가 꽉 찼을 때 확장할 수 있는 최대 스레드 수예요' },
        { t: 'keepAliveTime = 60L', d: 'core 초과 스레드가 60초 동안 할 일이 없으면 제거돼요' },
        { t: 'LinkedBlockingQueue', d: '작업 대기열이에요 - 용량 제한을 지정하지 않으면 무제한(약 Integer.MAX_VALUE)이에요' },
      ],
      why:
        '시스템 부하에 맞춰 스레드 수, 큐 크기, 거부 정책을 세밀하게 튜닝하려고 ThreadPoolExecutor를 직접 생성해요. ' +
        'CPU 집약 작업, I/O 집약 작업에 따라 최적의 스레드 수가 달라져요.',
      expectedOutput:
        'java CustomPool\n' +
        '[실행] 커스텀 풀 생성 - core:2, max:4, queue:무제한\n' +
        '[실행] 작업 실행',
      realWorldUsage:
        '실제로 서버의 CPU 코어 수와 작업 특성(CPU vs I/O)에 따라 스레드 풀을 튜닝할 때 ThreadPoolExecutor를 직접 구성해요.',
      pitfall: 'LinkedBlockingQueue에 용량 제한을 안 두면, 작업이 폭주할 때 큐가 무한정 커지면서 OutOfMemoryError로 서버가 다운될 수 있어요. 실무에서는 항상 큐 크기를 제한하는 게 안전해요.',
    },
  },
  {
    id: 'conc-fork-join',
    lang: 'java',
    title: 'ForkJoinPool 분할 정복',
    file: 'SumTask.java',
    code: `import java.util.concurrent.RecursiveTask;

class SumTask extends RecursiveTask<Long> {
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
      System.out.println("[실행] 직접 계산 - 범위: [" + from + ", " + to + "), 합: " + sum);
      return sum;
    }
    int mid = (from + to) / 2;
    System.out.println("[실행] 분할 - [" + from + ", " + mid + ") + [" + mid + ", " + to + ")");
    SumTask left  = new SumTask(arr, from, mid);
    SumTask right = new SumTask(arr, mid, to);
    left.fork();
    long rightResult = right.compute();
    long leftResult = left.join();
    return leftResult + rightResult;
  }
}`,
    explain: {
      concept:
        'ForkJoinPool은 큰 작업을 재귀적으로 작게 쪼개서(fork) 여러 스레드로 병렬 처리하고, 결과를 합치는(join) 분할 정복 프레임워크예요. ' +
        'SumTask는 배열의 합을 구하는데, 범위가 100개 이상이면 절반으로 쪼개서 왼쪽은 fork()로 비동기 실행, 오른쪽은 compute()로 현재 스레드에서 직접 처리해요. ' +
        '왼쪽이 끝나길 join()으로 기다린 후 두 결과를 더해서 반환해요 - 큰 빵을 여러 조각으로 나눠 동시에 굽는 것과 같아요. ' +
        'ForkJoinPool.commonPool()이 기본 풀로 사용되며, 스레드가 유휴 상태일 때 다른 스레드의 작업을 "훔쳐오는(work-stealing)" 특별한 알고리즘으로 효율을 극대화해요.',
      terms: [
        { t: 'RecursiveTask<Long>', d: '결과(Long)를 반환하는 분할 정복 작업이에요 - RecursiveAction은 반환값 없는 버전이에요' },
        { t: 'fork()', d: '이 작업을 ForkJoinPool에 비동기로 제출해요 - 다른 스레드에서 병렬로 실행돼요' },
        { t: 'join()', d: 'fork된 작업이 완료될 때까지 기다리고 결과를 반환해요' },
        { t: 'compute()', d: '실제 계산 로직이에요 - 작으면 직접 계산, 크면 분할해요' },
      ],
      why:
        '재귀적으로 쪼갤 수 있는 큰 작업(정렬, 검색, 집계 등)을 병렬로 빠르게 처리하려고 써요. ' +
        '일반 ExecutorService보다 재귀적 분할 작업에 특화돼 있고, work-stealing으로 스레드 활용도가 높아요.',
      expectedOutput:
        '(1000개 배열 기준, 1000/100=10 조각으로 분할)\n' +
        '[실행] 분할 - [0, 500) + [500, 1000)\n' +
        '[실행] 분할 - [0, 250) + [250, 500)\n' +
        '... (여러 분할 로그)\n' +
        '[실행] 직접 계산 - 범위: [0, 100), 합: 4950\n' +
        '... (각 조각 계산 로그)',
      realWorldUsage:
        '실제로 Java의 parallelStream()이 내부적으로 ForkJoinPool을 써서 구현돼 있어요. 대량 데이터 정렬·집계·검색에 활용돼요.',
      pitfall: '작업 단위가 너무 작으면 분할하고 합치는 오버헤드가 직접 계산하는 비용보다 커져서 오히려 느려져요. 적절한 임계값(여기선 100) 설정이 중요해요.',
    },
  },
  {
    id: 'conc-scheduled',
    lang: 'java',
    title: 'ScheduledExecutor 예약 실행',
    file: 'Scheduler.java',
    code: `import java.util.concurrent.Executors;
import java.util.concurrent.ScheduledExecutorService;
import java.util.concurrent.TimeUnit;

public class Scheduler {
  public static void main(String[] args) throws Exception {
    ScheduledExecutorService sched = Executors.newScheduledThreadPool(1);
    System.out.println("[실행] 1초 간격 반복 작업 시작");
    sched.scheduleAtFixedRate(
      () -> System.out.println("[실행] 틱"),
      0, 1, TimeUnit.SECONDS);
    Thread.sleep(3000);
    sched.shutdown();
    System.out.println("[실행] 스케줄러 종료");
  }
}`,
    explain: {
      concept:
        'ScheduledExecutorService는 작업을 "언제 실행할지"를 시간으로 지정할 수 있는 스레드 풀이에요. ' +
        'scheduleAtFixedRate는 첫 실행을 0초 후에 시작하고, 이후 1초마다 반복해서 실행해요 - 알람 시계처럼 정해진 간격으로 작업을 울려줘요. ' +
        'scheduleWithFixedDelay는 "작업 종료 후 N초 후에 다시 시작"하는 방식이고, scheduleAtFixedRate는 "작업 시작 시간 기준으로 N초마다" 방식이에요 - 작업 시간이 길면 후자가 작업이 겹칠 수 있어요. ' +
        '실무에서는 캐시 갱신, 임시 파일 정리, 건강 체크(health check) 같은 주기적 작업에 써요.',
      terms: [
        { t: 'newScheduledThreadPool(1)', d: '예약 실행 전용 스레드 풀을 생성해요 - 1개 스레드로 순차 예약 실행해요' },
        { t: 'scheduleAtFixedRate', d: '시작 시간 기준 고정 간격으로 반복 실행해요 - 0초 후 첫 실행, 이후 1초마다' },
        { t: '0, 1, TimeUnit.SECONDS', d: '초기 지연 0초, 주기 1초를 의미해요' },
        { t: 'Thread.sleep(3000)', d: '3초 동안 메인 스레드를 재워서 반복 작업이 몇 번 실행되는지 볼 수 있게 해요' },
      ],
      why:
        '주기적인 작업을 안전하게 실행하려고 써요. ' +
        'Thread.sleep()으로 반복문을 직접 만드는 것보다 정확하고, 예외가 발생해도 스레드가 죽지 않고 다음 주기를 이어가요.',
      expectedOutput:
        'java Scheduler\n' +
        '[실행] 1초 간격 반복 작업 시작\n' +
        '[실행] 틱\n' +
        '[실행] 틱\n' +
        '[실행] 틱\n' +
        '[실행] 스케줄러 종료',
      realWorldUsage:
        '실제로 @Scheduled(fixedRate = 60000) 어노테이션도 내부적으로 ScheduledExecutorService를 써요. ' +
        '1분마다 캐시를 갱신하거나, 10분마다 만료된 세션을 정리하는 배치 작업에 활용돼요.',
      pitfall: 'scheduleAtFixedRate에서 작업 실행 시간이 주기(1초)보다 길어지면 다음 작업이 바로 이어서 실행돼요. 작업이 겹치는 걸 막으려면 scheduleWithFixedDelay를 고려하세요.',
    },
  },
  {
    id: 'conc-concurrent-map',
    lang: 'java',
    title: 'ConcurrentHashMap 동시 맵',
    file: 'Counter.java',
    code: `import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.ConcurrentMap;

public class Counter {
  public static void main(String[] args) {
    ConcurrentMap<String, Integer> counts = new ConcurrentHashMap<>();
    counts.merge("apple", 1, Integer::sum);
    System.out.println("[실행] apple +1, 현재: " + counts.get("apple"));
    counts.merge("apple", 2, Integer::sum);
    System.out.println("[실행] apple +2, 현재: " + counts.get("apple"));
    counts.merge("banana", 1, Integer::sum);
    System.out.println("[결과] 최종: " + counts);
  }
}`,
    explain: {
      concept:
        'ConcurrentHashMap은 여러 스레드가 동시에 읽고 써도 안전한 Map이에요. 일반 HashMap을 여러 스레드에서 동시에 쓰면 데이터가 깨지거나 무한 루프에 빠질 수 있지만, ConcurrentHashMap은 내부적으로 세밀한 락을 써서 이런 문제를 방지해요. ' +
        'merge()는 "키가 있으면 값을 함수로 합치고, 없으면 새로 넣는" 원자적(atomic) 연산이에요 - "apple"이 없을 땐 1을 넣고, 있을 땐 기존 값에 2를 더하는 식이에요. 이 모든 게 락 없이도 스레드 안전하게 동작해요. ' +
        'Collections.synchronizedMap()으로 HashMap을 감싸는 것보다 ConcurrentHashMap이 성능이 훨씬 좋아요 - 전체 맵에 락을 거는 대신 내부 버킷 단위로 세밀하게 락을 걸기 때문이에요.',
      terms: [
        { t: 'ConcurrentHashMap', d: '여러 스레드가 동시에 안전하게 읽고 쓸 수 있는 해시맵이에요 - 버킷 단위 락으로 성능이 좋아요' },
        { t: 'merge(key, value, Integer::sum)', d: '키가 있으면 기존 값에 value를 더하고, 없으면 value를 저장해요 - 원자적 연산이에요' },
        { t: 'Integer::sum', d: '두 정수를 더하는 메서드 참조예요 - (a, b) -> a + b와 같은 의미예요' },
        { t: 'ConcurrentMap', d: 'ConcurrentHashMap의 인터페이스예요 - putIfAbsent, merge 같은 원자적 메서드를 추가로 제공해요' },
      ],
      why:
        '여러 스레드가 동시에 안전하게 데이터를 읽고 쓸 수 있는 공유 맵이 필요할 때 써요. ' +
        '실무에서는 방문자 카운터, 세션 저장소, 요청 통계 집계 등에 ConcurrentHashMap을 써요.',
      expectedOutput:
        'java Counter\n' +
        '[실행] apple +1, 현재: 1\n' +
        '[실행] apple +2, 현재: 3\n' +
        '[결과] 최종: {apple=3, banana=1}',
      realWorldUsage:
        '실제로 API 호출 횟수를 집계할 때, 각 사용자별로 ConcurrentHashMap에 merge(userId, 1, Integer::sum)로 카운트를 쌓아요.',
      pitfall: '전체 순회 중에 다른 스레드가 데이터를 수정해도 ConcurrentHashMap은 ConcurrentModificationException을 던지지 않아요. 대신 순회 결과에 수정 사항이 반영될 수도, 안 될 수도 있어서 약한 일관성(weakly consistent)을 가져요.',
    },
  },
  {
    id: 'conc-blocking-queue',
    lang: 'java',
    title: 'BlockingQueue 생산-소비',
    file: 'PipelineQueue.java',
    code: `import java.util.concurrent.ArrayBlockingQueue;
import java.util.concurrent.BlockingQueue;

public class PipelineQueue {
  public static void main(String[] args) throws InterruptedException {
    BlockingQueue<String> queue = new ArrayBlockingQueue<>(10);
    System.out.println("[실행] 생산-소비 큐 시작 (용량: 10)");

    new Thread(() -> {
      try {
        System.out.println("[실행] 생산자: 작업 넣는 중...");
        queue.put("작업");
        System.out.println("[실행] 생산자: '작업' 넣음");
      } catch (InterruptedException e) {
        Thread.currentThread().interrupt();
      }
    }).start();

    Thread.sleep(100);
    String item = queue.take();
    System.out.println("[결과] 소비자: '" + item + "' 꺼냄");
  }
}`,
    explain: {
      concept:
        'BlockingQueue는 생산자-소비자 패턴을 스레드 안전하게 구현해주는 특별한 큐예요. ' +
        'put()은 큐가 꽉 차면 빈 자리가 생길 때까지 자동으로 기다리고, take()는 큐가 비어 있으면 새 데이터가 들어올 때까지 자동으로 기다려요 - 이 "기다림"이 핵심이에요. ' +
        '컨베이어 벨트에 비유하면, 벨트가 꽉 차면 생산자가 자동으로 기다리고, 벨트가 비면 소비자가 자동으로 기다리는 거예요. ' +
        'ArrayBlockingQueue는 고정 크기 배열로 구현돼서 큐의 최대 용량을 제한할 수 있어요.',
      terms: [
        { t: 'BlockingQueue<String>', d: '블로킹(대기) 기능이 있는 스레드 안전 큐예요 - put/take가 자동으로 기다려줘요' },
        { t: 'put("작업")', d: '큐에 데이터를 넣어요 - 꽉 차면 빌 때까지 블로킹되고 InterruptedException을 던져요' },
        { t: 'take()', d: '큐에서 데이터를 꺼내요 - 비어 있으면 데이터가 들어올 때까지 블로킹돼요' },
        { t: 'ArrayBlockingQueue<>(10)', d: '최대 10개까지 담을 수 있는 고정 크기 큐를 생성해요' },
      ],
      why:
        '생산자(데이터 생성)와 소비자(데이터 처리)의 속도 차이를 큐로 완충해서, 서로 블로킹 없이 안정적으로 동작하게 하려고 써요. ' +
        '실무에서는 주문 처리 큐, 로그 수집 파이프라인, 작업 분배기 등에 BlockingQueue를 써요.',
      expectedOutput:
        'java PipelineQueue\n' +
        '[실행] 생산-소비 큐 시작 (용량: 10)\n' +
        '[실행] 생산자: 작업 넣는 중...\n' +
        '[실행] 생산자: \'작업\' 넣음\n' +
        '[결과] 소비자: \'작업\' 꺼냄',
      realWorldUsage:
        '실제로 주문 처리 시스템에서 "주문 접수(생산자)"와 "주문 처리(소비자)" 사이에 BlockingQueue를 두면, 주문이 폭주해도 소비자가 처리할 수 있는 속도로 안정적으로 흘려보낼 수 있어요.',
      pitfall: '생산자가 소비자보다 훨씬 빠르면 큐가 금방 꽉 차서 put()이 계속 블로킹돼요. 소비자 스레드가 죽으면 생산자가 영원히 대기하는 교착 상태가 발생할 수 있어요.',
    },
  },
  {
    id: 'conc-atomic-integer',
    lang: 'java',
    title: 'AtomicInteger 원자 카운터',
    file: 'AtomicCounter.java',
    code: `import java.util.concurrent.atomic.AtomicInteger;

public class AtomicCounter {
  public static void main(String[] args) {
    AtomicInteger counter = new AtomicInteger(0);
    System.out.println("[실행] 초기값: " + counter.get());
    int newVal = counter.incrementAndGet();
    System.out.println("[실행] 증가 후: " + newVal);
    counter.addAndGet(5);
    System.out.println("[결과] 5 추가 후: " + counter.get());
  }
}`,
    explain: {
      concept:
        'AtomicInteger는 여러 스레드가 동시에 값을 변경해도 안전하게 동작하는 정수 래퍼예요. ' +
        '일반 int count를 count++ 하면 실제로는 읽기-증가-쓰기 3단계라서, 두 스레드가 동시에 실행하면 값이 1만 증가하는 버그가 생겨요. ' +
        'AtomicInteger.incrementAndGet()은 이 읽기-증가-쓰기를 CPU 수준에서 하나로 묶어서(원자적, atomic), 다른 스레드가 끼어들 틈을 주지 않아요 - synchronized 같은 무거운 락 없이도 안전한 거예요. ' +
        'CAS(Compare-And-Swap)라는 하드웨어 명령어 덕분에 가능한데, "현재 값이 X면 Y로 바꾸고, 아니면 다시 시도해"를 무한 반복하는 방식이에요.',
      terms: [
        { t: 'AtomicInteger', d: '락 없이도 여러 스레드가 안전하게 값을 변경할 수 있는 정수 타입이에요' },
        { t: 'incrementAndGet()', d: '값을 1 증가시키고 증가된 새 값을 반환해요 - 읽기·증가·쓰기가 한 번에 일어나요' },
        { t: 'addAndGet(5)', d: '값에 5를 더하고 결과를 반환해요 - incrementAndGet의 일반화된 버전이에요' },
        { t: 'get()', d: '현재 값을 조회만 해요 - 다른 스레드가 동시에 변경해도 안전하게 읽어요' },
      ],
      why:
        'synchronized 블록 없이도 가볍고 빠르게 공유 카운터를 안전하게 관리하려고 써요. ' +
        '실무에서는 요청 카운터, 시퀀스 번호 생성, 통계 집계 등에 AtomicInteger를 써요.',
      expectedOutput:
        'java AtomicCounter\n' +
        '[실행] 초기값: 0\n' +
        '[실행] 증가 후: 1\n' +
        '[결과] 5 추가 후: 6',
      realWorldUsage:
        '실제로 서버의 요청 처리 횟수, 현재 접속자 수, 주문 번호 채번 등에 AtomicInteger를 써요.',
      pitfall: 'AtomicInteger는 단일 변수의 원자성만 보장해요. 여러 AtomicInteger를 동시에 바꾸는 작업(counter1++, counter2--)은 원자적이지 않아서, 그 사이에 다른 스레드가 값을 읽어갈 수 있어요.',
    },
  },
  {
    id: 'conc-reentrant-lock',
    lang: 'java',
    title: 'ReentrantLock 명시적 잠금',
    file: 'LockService.java',
    code: `import java.util.concurrent.locks.ReentrantLock;

public class LockService {
  private final ReentrantLock lock = new ReentrantLock();

  public void increment() {
    lock.lock();
    try {
      System.out.println("[실행] 락 획득 - 작업 수행");
    } finally {
      lock.unlock();
      System.out.println("[실행] 락 해제");
    }
  }

  public static void main(String[] args) {
    LockService service = new LockService();
    service.increment();
  }
}`,
    explain: {
      concept:
        'ReentrantLock은 synchronized보다 더 유연한 명시적 락(Lock)이에요. lock()으로 잠그고 unlock()으로 풀어주며, try-finally로 반드시 해제를 보장해요. ' +
        '"재진입 가능(Reentrant)"이란 이름은 같은 스레드가 이미 획득한 락을 다시 요청해도 데드락이 걸리지 않는다는 뜻이에요 - synchronized도 이 특성을 가지고 있어요. ' +
        'synchronized와 달리 tryLock()으로 "락을 시도해보고 실패하면 다른 일을 할게", lockInterruptibly()로 "대기 중에 인터럽트 받을 수 있어" 같은 고급 기능을 쓸 수 있어요.',
      terms: [
        { t: 'ReentrantLock', d: '재진입 가능한 명시적 락 객체예요 - synchronized보다 유연한 락 제어를 제공해요' },
        { t: 'lock()', d: '락을 획득해요 - 이미 다른 스레드가 잠그고 있으면 락이 풀릴 때까지 블로킹돼요' },
        { t: 'unlock()', d: '락을 해제해요 - 반드시 finally 블록에서 호출해 예외 발생 시에도 풀리도록 해요' },
        { t: 'finally', d: '예외 발생 여부와 관계없이 lock.unlock()을 반드시 실행하기 위한 블록이에요' },
      ],
      why:
        'synchronized보다 유연한 락이 필요할 때 ReentrantLock을 써요. ' +
        '특히 tryLock()으로 타임아웃을 걸거나, 공정성(fair) 모드를 설정해서 오래 기다린 스레드부터 락을 주는 기능이 필요할 때 유용해요.',
      expectedOutput:
        'java LockService\n' +
        '[실행] 락 획득 - 작업 수행\n' +
        '[실행] 락 해제',
      realWorldUsage:
        '실제로 동시성 컬렉션 내부 구현(ConcurrentHashMap 등)에서 synchronized 대신 ReentrantLock을 써서 세밀한 락 제어를 해요.',
      pitfall: 'unlock()을 finally에 넣지 않으면, 작업 중 예외가 발생했을 때 락이 영원히 풀리지 않는 교착 상태가 발생해요. lock() 바로 다음 줄에 try-finally를 배치하는 게 관례예요.',
    },
  },
  {
    id: 'conc-semaphore',
    lang: 'java',
    title: 'Semaphore 동시 접속 제한',
    file: 'GateService.java',
    code: `import java.util.concurrent.Semaphore;

public class GateService {
  private final Semaphore sem = new Semaphore(3);

  public void access() {
    try {
      sem.acquire();
      System.out.println("[실행] 허가 획득 - 사용 가능 허가 수: " + sem.availablePermits());
      try {
        System.out.println("[실행] 리소스 접근 중...");
        Thread.sleep(100);
      } finally {
        sem.release();
        System.out.println("[실행] 허가 반납 - 사용 가능 허가 수: " + sem.availablePermits());
      }
    } catch (InterruptedException e) {
      Thread.currentThread().interrupt();
    }
  }

  public static void main(String[] args) {
    GateService gate = new GateService();
    gate.access();
  }
}`,
    explain: {
      concept:
        'Semaphore는 동시에 접근할 수 있는 스레드 수를 제한하는 "허가증 카운터"예요. ' +
        'new Semaphore(3)이면 동시에 최대 3개 스레드까지만 접근을 허용하고, 4번째 스레드는 앞선 스레드가 release()로 허가증을 반납할 때까지 acquire()에서 블로킹돼요. ' +
        '식당에 좌석이 3개뿐일 때, 3명까지는 바로 입장하고 4번째 손님은 누군가 나올 때까지 기다리는 것과 같아요. ' +
        '세마포어의 허가 수를 1로 하면 ReentrantLock과 비슷하게 동작하지만, 락과 달리 "락을 획득한 스레드가 아니어도" release()를 호출할 수 있어서 더 유연해요.',
      terms: [
        { t: 'Semaphore(3)', d: '동시에 3개까지 접근을 허용하는 세마포어를 생성해요' },
        { t: 'acquire()', d: '허가를 하나 요청해요 - 허가가 남아 있으면 즉시 반환, 없으면 블로킹돼요 (InterruptedException 던짐)' },
        { t: 'release()', d: '허가를 하나 반납해요 - 대기 중인 스레드가 있으면 하나가 깨어나요' },
        { t: 'availablePermits()', d: '현재 사용 가능한 허가 개수를 반환해요 - 디버깅과 모니터링에 유용해요' },
      ],
      why:
        '동시에 사용할 수 있는 자원(DB 커넥션, 파일 핸들, 외부 API 호출 등)의 수를 제한해서 시스템 과부하를 방지하려고 써요. ' +
        '실무에서는 API rate limiter(호출 횟수 제한)나 DB 커넥션 풀에서 최대 동시 접속 수를 제어할 때 활용돼요.',
      expectedOutput:
        'java GateService\n' +
        '[실행] 허가 획득 - 사용 가능 허가 수: 2\n' +
        '[실행] 리소스 접근 중...\n' +
        '[실행] 허가 반납 - 사용 가능 허가 수: 3',
      realWorldUsage:
        '실제로 외부 API의 초당 호출 횟수(rate limit)를 준수하기 위해 Semaphore로 동시 호출 수를 제한해요.',
      pitfall: 'acquire()는 InterruptedException을 던지므로 try-catch로 처리해야 해요. release()를 finally에 넣지 않으면 허가가 고갈돼서 다른 스레드가 영원히 대기하게 돼요.',
    },
  },
  {
    id: 'conc-count-down-latch',
    lang: 'java',
    title: 'CountDownLatch 시작 신호',
    file: 'StartGate.java',
    code: `import java.util.concurrent.CountDownLatch;

public class StartGate {
  public static void main(String[] args) throws InterruptedException {
    CountDownLatch latch = new CountDownLatch(1);
    System.out.println("[실행] 출발 신호 대기 (카운트: 1)");

    new Thread(() -> {
      try {
        System.out.println("[실행] 선수 대기 중...");
        latch.await();
        System.out.println("[실행] 출발! (신호 받음)");
      } catch (InterruptedException e) {
        Thread.currentThread().interrupt();
      }
    }).start();

    Thread.sleep(500);
    System.out.println("[실행] 출발 총성!");
    latch.countDown();
    System.out.println("[실행] 카운트: " + latch.getCount());
  }
}`,
    explain: {
      concept:
        'CountDownLatch는 특정 횟수만큼 countDown()이 호출될 때까지 다른 스레드들을 await()에서 기다리게 하는 동기화 도구예요. ' +
        'new CountDownLatch(1)은 "딱 한 번의 신호가 올 때까지 기다려"라는 뜻이에요 - 출발 총성이 울릴 때까지 모든 선수가 대기하는 것과 같아요. ' +
        '생성자에 3을 넣으면 countDown()이 세 번 호출돼야 await()이 풀려서, "3명의 작업자가 모두 준비 완료해야 시작" 같은 패턴을 구현할 수 있어요. ' +
        '한 번 카운트가 0이 되면 재사용할 수 없어요 - 일회용 동기화 도구예요.',
      terms: [
        { t: 'CountDownLatch(1)', d: 'countDown()이 1번 호출될 때까지 await()을 블로킹해요' },
        { t: 'await()', d: '카운트가 0이 될 때까지 현재 스레드를 블로킹해요 - InterruptedException을 던져요' },
        { t: 'countDown()', d: '카운트를 1 감소시켜요 - 0이 되는 순간 await()에서 대기 중인 모든 스레드가 깨어나요' },
        { t: 'getCount()', d: '현재 남은 카운트를 반환해요 - 디버깅에 유용해요' },
      ],
      why:
        '여러 스레드의 시작을 한 번에 맞추거나, 모든 작업이 완료되길 기다리려고 써요. ' +
        '실무에서는 "DB 연결, 캐시 로딩, 설정 파싱이 모두 완료돼야 서버가 요청을 받기 시작" 같은 초기화 동기화에 써요.',
      expectedOutput:
        'java StartGate\n' +
        '[실행] 출발 신호 대기 (카운트: 1)\n' +
        '[실행] 선수 대기 중...\n' +
        '[실행] 출발 총성!\n' +
        '[실행] 출발! (신호 받음)\n' +
        '[실행] 카운트: 0',
      realWorldUsage:
        '실제로 서버 시작 시 "DB 커넥션 풀 준비 완료 + Redis 연결 완료 + Kafka 컨슈머 구독 완료"를 CountDownLatch로 조율해서, 모든 준비가 끝나야 실제 요청을 받기 시작해요.',
      pitfall: '카운트가 한 번 0이 되면 재사용이 불가능해요. 반복 사용이 필요하면 CyclicBarrier를 고려하세요. 또한 await()에서 InterruptedException이 발생하면 카운트가 감소하지 않았더라도 스레드가 깨어나요.',
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
    System.out.println("[실행] stop() 호출 - running: " + running);
  }

  public boolean isRunning() {
    return running;
  }

  public static void main(String[] args) throws InterruptedException {
    FlagHolder holder = new FlagHolder();
    System.out.println("[실행] 초기 상태: " + holder.isRunning());
    holder.stop();
    System.out.println("[결과] 최종 상태: " + holder.isRunning());
  }
}`,
    explain: {
      concept:
        'volatile은 "이 변수의 값은 항상 메인 메모리에서 직접 읽고 써라"라고 JVM에게 지시하는 키워드예요. ' +
        '일반 변수는 성능 향상을 위해 각 스레드가 CPU 캐시에 복사본을 두고 작업하는데, 이러면 한 스레드가 값을 바꿨는데 다른 스레드는 옛날 캐시 값을 계속 볼 수 있는 "가시성 문제"가 생겨요. ' +
        'volatile을 붙이면 한 스레드가 running = false로 바꾸는 순간, 다른 모든 스레드가 즉시 변경된 값을 볼 수 있어요 - 게시판에 공지를 붙이면 모든 사람이 바로 보는 것과 같아요. ' +
        '하지만 읽기·쓰기 한 번의 원자성만 보장하고, running = !running 같은 복합 연산(읽고→뒤집고→쓰기)은 원자적이지 않아요.',
      terms: [
        { t: 'volatile', d: '변수의 값을 항상 메인 메모리에서 읽고 쓰게 해줘요 - CPU 캐시로 인한 가시성 문제를 막아요' },
        { t: 'boolean running', d: '스레드의 실행 여부를 제어하는 플래그 변수예요 - volatile이 없으면 다른 스레드가 false로 바꾼 걸 못 볼 수 있어요' },
        { t: 'stop()', d: '다른 스레드에서 호출해서 running을 false로 바꿔 실행을 멈추라고 신호를 줘요' },
        { t: 'isRunning()', d: '현재 running 값을 조회해요 - volatile이라 항상 최신 값을 읽어요' },
      ],
      why:
        '한 스레드가 변경한 플래그를 다른 스레드가 즉시 볼 수 있게 하려고 써요. ' +
        '실무에서는 "작업 중단 요청", "서버 종료 신호" 같은 플래그 변수에 volatile을 붙여요.',
      expectedOutput:
        'java FlagHolder\n' +
        '[실행] 초기 상태: true\n' +
        '[실행] stop() 호출 - running: false\n' +
        '[결과] 최종 상태: false',
      realWorldUsage:
        '실제로 백그라운드 작업 스레드에 while (running) { ... } 패턴으로 루프를 돌리고, 외부에서 stop()을 호출해 running = false로 만들어 스레드를 안전하게 종료할 때 volatile을 꼭 써요.',
      pitfall: 'volatile은 단일 변수의 읽기/쓰기 가시성만 보장하고, count++ 같은 복합 연산은 원자성을 보장하지 않아요. 복합 연산엔 AtomicInteger나 synchronized를 써야 해요.',
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
      System.out.println("[실행] count 증가 - 현재: " + count);
    }
  }

  public int get() {
    return count;
  }

  public static void main(String[] args) {
    SyncCounter c = new SyncCounter();
    c.inc();
    c.inc();
    System.out.println("[결과] 최종 count: " + c.get());
  }
}`,
    explain: {
      concept:
        'synchronized는 "이 블록 안에는 한 번에 한 스레드만 들어올 수 있어"라고 정하는 Java의 기본 동기화 문법이에요. ' +
        'synchronized(this)는 "이 객체(this)를 열쇠로 써서, 같은 열쇠를 기다리는 다른 스레드는 이 블록이 끝날 때까지 대기해"라는 뜻이에요. ' +
        'count++는 실제로 읽기→증가→쓰기 3단계로 이뤄져서, synchronized 없이 여러 스레드가 동시에 실행하면 값이 정확히 증가하지 않을 수 있어요. ' +
        'synchronized는 가장 오래된 동기화 방식이지만, 요즘은 Lock 인터페이스나 AtomicXxx 클래스를 더 많이 써요.',
      terms: [
        { t: 'synchronized (this)', d: 'this 객체를 락으로 써서 한 스레드만 블록 내부에 들어올 수 있게 해요' },
        { t: 'count++', d: '락 안에서 실행되므로 여러 스레드가 동시에 실행해도 값이 안전하게 증가해요' },
        { t: 'this', d: '락으로 사용할 객체예요 - 같은 객체로 동기화된 모든 블록이 동일한 락을 공유해요' },
        { t: 'private int count', d: '공유 변수예요 - 락으로 보호하지 않으면 동시 수정 시 데이터가 깨질 수 있어요' },
      ],
      why:
        '공유 변수를 여러 스레드가 동시에 변경할 때, 데이터 정합성을 보장하려고 synchronized를 써요. ' +
        'Java에서 가장 기본적인 동기화 방법으로, 메서드 자체에 붙일 수도 있어요 (public synchronized void inc()).',
      expectedOutput:
        'java SyncCounter\n' +
        '[실행] count 증가 - 현재: 1\n' +
        '[실행] count 증가 - 현재: 2\n' +
        '[결과] 최종 count: 2',
      realWorldUsage:
        '실제로 멀티스레드 환경에서 공유 자원(컬렉션, 카운터, 파일 등)을 보호할 때 synchronized를 써요.',
      pitfall: 'synchronized 블록이 너무 크면 락 경합이 심해져서 성능이 크게 떨어져요. 꼭 필요한 최소한의 코드만 synchronized로 감싸는 게 중요해요. 또한 데드락을 유발하지 않도록 락 획득 순서에 주의해야 해요.',
    },
  },
  {
    id: 'conc-run-async',
    lang: 'java',
    title: 'runAsync 불반환 비동기',
    file: 'FireAndForget.java',
    code: `import java.util.concurrent.CompletableFuture;

public class FireAndForget {
  public static void main(String[] args) {
    System.out.println("[실행] 결과 없는 비동기 작업 시작");
    CompletableFuture<Void> fire = CompletableFuture.runAsync(() -> {
      System.out.println("[실행] 이메일 발송 중...");
    });
    fire.join();
    System.out.println("[결과] 작업 완료 (결과 없음)");
  }
}`,
    explain: {
      concept:
        'runAsync는 결과를 반환하지 않는 비동기 작업을 실행하는 메서드예요. supplyAsync가 값을 반환하는 반면, runAsync는 Runnable처럼 실행만 하고 끝나요. ' +
        '"쏘고 잊기(fire-and-forget)" 패턴에 딱 맞는 방식으로, 이메일 발송, 로그 기록, 푸시 알림처럼 "실행만 하면 되고 결과는 필요 없는" 작업에 써요. ' +
        '반환 타입이 CompletableFuture<Void>여서, Void는 "결과가 없음"을 의미해요. ' +
        '실무에서는 사용자에게 응답은 이미 보내고, 후처리(알림 발송, 통계 기록)를 runAsync로 백그라운드에서 처리해요.',
      terms: [
        { t: 'runAsync(() -> ...)', d: '반환값 없는 비동기 작업을 실행해요 - Runnable을 받아서 처리해요' },
        { t: 'Void', d: '결과가 없음을 나타내는 타입이에요 - runAsync의 제네릭 타입이에요' },
        { t: 'join()', d: '작업이 끝날 때까지 현재 스레드를 대기시켜요 - 예제에서는 결과를 보기 위해 호출해요' },
      ],
      why:
        '결과가 필요 없는 작업을 메인 흐름에서 분리해서, 응답 시간을 단축하려고 써요. ' +
        '실무에서는 "주문 완료 응답은 이미 보내고, 알림 발송은 runAsync로 나중에" 같은 패턴이에요.',
      expectedOutput:
        'java FireAndForget\n' +
        '[실행] 결과 없는 비동기 작업 시작\n' +
        '[실행] 이메일 발송 중...\n' +
        '[결과] 작업 완료 (결과 없음)',
      realWorldUsage:
        '실제로 회원가입 API에서 "회원가입 완료" 응답을 먼저 보내고, 환영 이메일 발송은 runAsync로 비동기 처리해서 응답 속도를 개선해요.',
      pitfall: 'runAsync 안에서 발생한 예외는 별도 처리하지 않으면 조용히 무시돼요. join()이나 get()을 호출해야 예외가 전파되거나, exceptionally()로 복구 로직을 등록해야 해요.',
    },
  },
  {
    id: 'conc-exceptionally',
    lang: 'java',
    title: 'exceptionally 예외 처리',
    file: 'SafeRunner.java',
    code: `import java.util.concurrent.CompletableFuture;

public class SafeRunner {
  public static void main(String[] args) {
    System.out.println("[실행] 예외 복구 체인 시작");
    CompletableFuture<String> safe = CompletableFuture
        .supplyAsync(() -> {
          System.out.println("[실행] 위험한 작업 시도...");
          throw new RuntimeException("작업 실패!");
        })
        .exceptionally(ex -> {
          System.out.println("[실행] 예외 복구 - 원인: " + ex.getMessage());
          return "fallback";
        });
    System.out.println("[결과] 최종: " + safe.join());
  }
}`,
    explain: {
      concept:
        'exceptionally는 비동기 파이프라인에서 예외가 발생했을 때 대신 실행되는 복구 단계예요. ' +
        '앞 단계(supplyAsync)에서 RuntimeException이 발생했지만, exceptionally에서 이를 가로채서 "fallback"이라는 기본값을 반환해요. ' +
        '이렇게 하면 파이프라인이 예외로 멈추지 않고, 안전한 기본값으로 이어서 진행할 수 있어요 - 넘어지면 대신 일어나서 걸어주는 보조자 같아요. ' +
        '원래 예외 정보는 ex 매개변수로 받을 수 있어서, 어떤 오류였는지 로그를 남기거나 특정 예외만 복구하는 분기 처리도 가능해요.',
      terms: [
        { t: 'exceptionally(ex -> ...)', d: '앞 단계에서 예외가 발생하면 대신 실행되는 복구 콜백이에요 - 정상 완료 시에는 호출되지 않아요' },
        { t: 'ex', d: '발생한 예외(Throwable) 객체예요 - getMessage()로 원인을 확인할 수 있어요' },
        { t: 'return "fallback"', d: '예외가 발생했을 때 대신 반환할 기본값이에요 - 파이프라인이 계속 이어질 수 있어요' },
        { t: 'safe.join()', d: '복구된 값 "fallback"이 반환돼요 - 예외가 아닌 정상 흐름으로 끝나요' },
      ],
      why:
        '비동기 파이프라인에서 발생한 예외를 조용히 무시하지 않고, 안전한 기본값으로 복구하거나 다른 흐름으로 전환하려고 써요. ' +
        '실무에서는 외부 API 호출 실패 시 캐시된 데이터를 반환하는 fallback 패턴에 써요.',
      expectedOutput:
        'java SafeRunner\n' +
        '[실행] 예외 복구 체인 시작\n' +
        '[실행] 위험한 작업 시도...\n' +
        '[실행] 예외 복구 - 원인: 작업 실패!\n' +
        '[결과] 최종: fallback',
      realWorldUsage:
        '실제로 상품 추천 API 호출이 실패했을 때, exceptionally로 기본 추천 목록("인기 상품")을 반환해서 사용자에게 빈 화면이 보이지 않게 해요.',
      pitfall: 'exceptionally는 예외가 발생했을 때만 호출돼요. 정상 흐름의 값을 변환하고 싶다면 thenApply나 handle()을 쓰세요. handle()은 정상·예외 양쪽을 모두 처리할 수 있어서 더 유연해요.',
    },
  },
];
