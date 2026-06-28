import type { Snippet } from '../../types';

export const pythonAsync: Snippet[] = [
  {
    id: 'pasync-await-basic',
    lang: 'python',
    title: 'async/await 기본',
    file: 'await_basic.py',
    code: `import asyncio

async def fetch_data():
  print("[실행] fetch_data() — 데이터 가져오는 중...")
  await asyncio.sleep(0.1)
  print("[결과] fetch_data() — 완료")
  return '결과'

async def main():
  print("[실행] main() — 시작")
  data = await fetch_data()
  print(f"[결과] 받은 데이터: {data}")

asyncio.run(main())`,
    explain: {
      concept:
        'async/await는 하나의 스레드에서 여러 작업을 번갈아가며 처리하는 비동기 프로그래밍의 핵심 문법이에요. ' +
        'async 함수는 "나중에 결과를 줄게"라고 약속하는 코루틴(coroutine)을 만들어요. ' +
        'await는 그 약속이 지켜질 때까지 기다리면서 다른 작업에 순서를 양보해줘요. ' +
        '레스토랑에서 웨이터가 테이블 하나의 음식만 기다리지 않고 여러 테이블을 동시에 서빙하는 것과 같은 원리예요. ' +
        '실무에서는 웹 서버가 수천 개의 요청을 동시에 처리할 때, 각 요청을 async 함수로 만들어 블로킹 없이 처리해요.',
      terms: [
        { t: 'async def', d: '비동기 코루틴 함수를 정의하는 구문이에요. 안에서 await를 쓸 수 있어요.' },
        { t: 'await', d: '다른 비동기 함수의 완료를 기다리는 지점이에요. 기다리는 동안 다른 작업이 실행돼요.' },
        { t: 'asyncio.sleep(0.1)', d: '0.1초 동안 대기하면서 다른 코루틴에 실행 순서를 양보해요.' },
        { t: 'asyncio.run(main())', d: '비동기 프로그램의 출발점이에요. 코루틴을 실행하고 완료를 기다려요.' },
      ],
      why:
        '실무에서 FastAPI 같은 비동기 웹 프레임워크는 모든 요청 핸들러가 async로 작성돼요. ' +
        '데이터베이스 조회나 외부 API 호출을 기다리는 동안 다른 요청을 처리해서 서버 처리량을 극대화해요.',
      expectedOutput:
        '실행 시:\n' +
        '[실행] main() — 시작\n' +
        '[실행] fetch_data() — 데이터 가져오는 중...\n' +
        '[결과] fetch_data() — 완료\n' +
        '[결과] 받은 데이터: 결과',
      realWorldUsage:
        '실제 서비스에서 사용자 프로필 조회 API를 async로 만들면, 프로필 이미지를 CDN에서 가져오는 동안 다른 사용자의 요청을 처리할 수 있어서 초당 처리량이 수십 배 늘어나요.',
      pitfall: 'async 함수를 await 없이 그냥 호출하면 코루틴 객체만 반환되고 실제 실행은 안 돼요. 반드시 await를 붙여야 해요.',
    },
  },
  {
    id: 'pasync-run-entry',
    lang: 'python',
    title: 'asyncio.run 진입점',
    file: 'run_entry.py',
    code: `import asyncio

async def greet():
  print("[실행] greet() — 비동기 함수 실행 중")

if __name__ == '__main__':
  print("[시작] 프로그램 시작")
  asyncio.run(greet())
  print("[완료] 프로그램 종료")`,
    explain: {
      concept:
        'asyncio.run()은 일반 동기 코드 세계에서 비동기 세계로 진입하는 유일한 정문이에요. ' +
        '비동기 함수(async def)는 일반 함수처럼 직접 호출할 수 없고, 반드시 asyncio.run()이나 await 체인을 통해 실행해야 해요. ' +
        '프로그램의 최상위 진입점에서 딱 한 번만 호출하는 게 권장돼요. ' +
        '내부적으로 이벤트 루프를 생성하고, 주어진 코루틴을 실행한 뒤 이벤트 루프를 정리하는 모든 과정을 자동으로 처리해줘요.',
      terms: [
        { t: 'asyncio.run(greet())', d: '비동기 함수를 실행하고 완료될 때까지 기다리는 진입점 함수예요.' },
        { t: "__name__ == '__main__'", d: '이 파일이 직접 실행될 때만 코드를 실행하는 파이썬의 관용적 가드예요.' },
        { t: 'greet()', d: 'async 함수를 호출한 순간 "실행 대기 중인 코루틴 객체"가 만들어져요.' },
      ],
      why:
        '실무에서 비동기 애플리케이션의 main() 함수에서 asyncio.run()을 호출해 전체 프로그램을 시작해요. ' +
        '이 진입점이 없으면 비동기 코드는 절대 실행되지 않아요.',
      expectedOutput:
        '실행 시:\n' +
        '[시작] 프로그램 시작\n' +
        '[실행] greet() — 비동기 함수 실행 중\n' +
        '[완료] 프로그램 종료',
      realWorldUsage:
        '실제 FastAPI 서버는 uvicorn.run() 내부에서 asyncio.run()과 유사한 방식으로 이벤트 루프를 시작하고, 모든 API 핸들러가 이 루프 위에서 비동기로 실행돼요.',
      pitfall: '하나의 스레드에서 asyncio.run()을 두 번 이상 호출하면 이미 이벤트 루프가 실행 중이라며 RuntimeError가 발생해요.',
    },
  },
  {
    id: 'pasync-gather-concurrent',
    lang: 'python',
    title: 'gather 동시 실행',
    file: 'gather_concurrent.py',
    code: `import asyncio

async def work(name, delay):
  print(f"[실행] work('{name}') 시작 — {delay}초 대기")
  await asyncio.sleep(delay)
  print(f"[완료] work('{name}') 종료")
  return name

async def main():
  print("[실행] gather — 모든 작업 동시 시작")
  results = await asyncio.gather(work('A', 1), work('B', 2))
  print(f"[결과] 모인 결과: {results}")

asyncio.run(main())`,
    explain: {
      concept:
        'asyncio.gather는 여러 비동기 작업을 동시에 출발시키고, 모두 완료될 때까지 기다렸다가 결과를 순서대로 모아주는 함수예요. ' +
        '작업 A가 1초, 작업 B가 2초 걸릴 때 차례로 실행하면 총 3초지만, gather로 동시에 실행하면 2초 만에 완료돼요. ' +
        '실무에서는 여러 외부 API를 동시에 호출해서 응답을 한 번에 모을 때 써요. ' +
        '예를 들어 상품 상세 페이지에서 "상품 정보, 리뷰, 재고"를 각각 다른 API에서 가져올 때 gather로 동시에 요청하면 페이지 로딩 시간을 크게 줄일 수 있어요.',
      terms: [
        { t: 'asyncio.gather(*tasks)', d: '여러 코루틴을 동시에 실행하고 결과를 리스트로 모아 반환해요.' },
        { t: 'asyncio.sleep(delay)', d: '지정한 초만큼 대기하면서 다른 코루틴에 순서를 양보해요.' },
        { t: 'results', d: '각 코루틴의 return 값이 호출 순서대로 담긴 리스트예요.' },
        { t: 'await asyncio.gather(...)', d: 'gather 자체도 코루틴이라 await로 완료를 기다려야 해요.' },
      ],
      why:
        '실무에서 마이크로서비스 간 병렬 호출 시 gather를 쓰면 전체 응답 시간이 가장 느린 서비스 하나의 시간으로 줄어들어요. 순차 호출 대비 응답 속도가 수 배 빨라져요.',
      expectedOutput:
        '실행 시:\n' +
        '[실행] gather — 모든 작업 동시 시작\n' +
        "[실행] work('A') 시작 — 1초 대기\n" +
        "[실행] work('B') 시작 — 2초 대기\n" +
        "[완료] work('A') 종료\n" +
        "[완료] work('B') 종료\n" +
        "[결과] 모인 결과: ['A', 'B']",
      realWorldUsage:
        '실제 이커머스 상품 페이지에서 "상품 정보 API, 리뷰 API, 재고 API"를 gather로 동시 호출하면, 순차 호출 대비 페이지 로딩 시간이 3배 이상 빨라져요.',
      pitfall: '결과는 호출한 순서 그대로 배열돼요. 작업 B가 먼저 끝나도 결과 리스트에서는 두 번째 자리에 담겨요.',
    },
  },
  {
    id: 'pasync-taskgroup-structured',
    lang: 'python',
    title: 'TaskGroup 구조화 동시성',
    file: 'taskgroup_structured.py',
    code: `import asyncio

async def task(n):
  print(f"[실행] task({n}) 시작")
  await asyncio.sleep(n * 0.5)
  print(f"[완료] task({n}) 종료 → 결과: {n * 2}")
  return n * 2

async def main():
  async with asyncio.TaskGroup() as tg:
    t1 = tg.create_task(task(1))
    t2 = tg.create_task(task(2))
    print("[실행] TaskGroup — 두 작업 동시 시작")
  print(f"[결과] t1={t1.result()}, t2={t2.result()}")

asyncio.run(main())`,
    explain: {
      concept:
        'TaskGroup은 여러 비동기 작업을 하나의 그룹으로 묶어 안전하게 관리하는 Python 3.11 이상의 최신 방식이에요. ' +
        '그룹 안의 모든 작업은 with 블록을 빠져나올 때까지 완료돼야 하고, 하나라도 예외가 발생하면 나머지 작업들도 자동으로 취소돼요. ' +
        'gather보다 안전한 이유는, 한 작업이 실패했을 때 나머지 작업도 함께 정리되므로 방치되는 좀비 작업이 생기지 않아요. ' +
        '입문자에게는 async with라는 새로운 패턴이 등장해서 조금 낯설지만, 한 번 익숙해지면 훨씬 안전한 동시성 코드를 작성할 수 있어요.',
      terms: [
        { t: 'async with asyncio.TaskGroup() as tg', d: '작업 그룹을 열고 tg로 접근해요. 블록을 나가면 모든 작업이 완료돼요.' },
        { t: 'tg.create_task(task(1))', d: '그룹 안에 새 비동기 작업을 추가하고 즉시 실행을 시작해요.' },
        { t: 't1.result()', d: '작업이 완료된 후에만 호출할 수 있는 결과 반환 메서드예요.' },
        { t: 'task(n * 0.5)', d: '인자가 클수록 더 오래 대기하는 작업으로, 실행 순서를 확인하기 좋아요.' },
      ],
      why:
        '실무에서는 여러 마이크로서비스를 동시에 호출할 때 TaskGroup을 쓰면, 하나의 서비스가 실패했을 때 나머지도 깔끔하게 취소돼서 자원 낭비와 부분 실패 상태를 막을 수 있어요.',
      expectedOutput:
        '실행 시:\n' +
        '[실행] TaskGroup — 두 작업 동시 시작\n' +
        '[실행] task(1) 시작\n' +
        '[실행] task(2) 시작\n' +
        '[완료] task(1) 종료 → 결과: 2\n' +
        '[완료] task(2) 종료 → 결과: 4\n' +
        '[결과] t1=2, t2=4',
      realWorldUsage:
        '실제 결제 시스템에서 "잔액 확인, 사기 검증, 포인트 적립"을 TaskGroup으로 묶어서, 하나라도 실패하면 전체 결제를 취소하고 롤백하는 패턴으로 구현해요.',
      pitfall: 'TaskGroup을 빠져나올 때 모든 작업이 완료되기 전에는 다음 코드로 진행되지 않아요. 하나가 실패하면 나머지도 모두 취소되니 주의해야 해요.',
    },
  },
  {
    id: 'pasync-queue-producer-consumer',
    lang: 'python',
    title: 'Queue 생산자-소비자',
    file: 'queue_producer_consumer.py',
    code: `import asyncio

async def producer(q):
  for i in range(3):
    print(f"[생산] 아이템 {i} 생성")
    await q.put(i)
    await asyncio.sleep(0.1)
  await q.put(None)
  print("[생산] 종료 신호(None) 전송")

async def consumer(q):
  while True:
    item = await q.get()
    if item is None:
      print("[소비] 종료 신호 감지 — 중단")
      break
    print(f"[소비] 아이템 {item} 처리 완료")

async def main():
  q = asyncio.Queue()
  print("[실행] 생산자-소비자 시작")
  await asyncio.gather(producer(q), consumer(q))

asyncio.run(main())`,
    explain: {
      concept:
        'Queue는 생산자와 소비자 사이에 놓인 비동기 버퍼(완충 공간)예요. 생산자는 아이템을 큐에 넣고, 소비자는 큐에서 꺼내 처리해요. ' +
        '생산자가 너무 빠르면 큐가 가득 차서 넣을 때 잠시 기다리고, 소비자가 너무 빠르면 큐가 비어서 꺼낼 때 잠시 기다려요. ' +
        '이렇게 속도 차이를 큐가 완충해주기 때문에, 생산자와 소비자의 속도가 달라도 안정적으로 동작해요. ' +
        '실무에서는 웹 크롤링, 로그 처리, 메시지 큐 시스템 등에서 이 패턴을 써요. ' +
        '여기서는 None을 "더 이상 보낼 게 없다"는 종료 신호(sentinel)로 활용했어요.',
      terms: [
        { t: 'asyncio.Queue()', d: '비동기 환경에서 안전하게 데이터를 주고받는 FIFO 큐예요.' },
        { t: 'await q.put(i)', d: '큐에 아이템을 넣어요. 큐가 가득 차면 공간이 날 때까지 기다려요.' },
        { t: 'await q.get()', d: '큐에서 아이템을 꺼내요. 큐가 비어 있으면 아이템이 들어올 때까지 기다려요.' },
        { t: 'None (종료 신호)', d: '"더 이상 없음"을 알리는 특별한 표식(sentinel) 값이에요.' },
      ],
      why:
        '실무에서 웹 크롤러를 만들 때, URL을 생산하는 작업과 실제 크롤링하는 작업을 분리해서 Queue로 연결하면 ' +
        '크롤링 속도를 조절하면서도 CPU와 네트워크 자원을 효율적으로 쓸 수 있어요.',
      expectedOutput:
        '실행 시:\n' +
        '[실행] 생산자-소비자 시작\n' +
        '[생산] 아이템 0 생성\n' +
        '[소비] 아이템 0 처리 완료\n' +
        '[생산] 아이템 1 생성\n' +
        '[소비] 아이템 1 처리 완료\n' +
        '[생산] 아이템 2 생성\n' +
        '[소비] 아이템 2 처리 완료\n' +
        '[생산] 종료 신호(None) 전송\n' +
        '[소비] 종료 신호 감지 — 중단',
      realWorldUsage:
        '실제 로그 수집 시스템에서 여러 서버가 생성하는 로그를 Queue로 받아서, 별도 소비자가 데이터베이스에 배치로 저장해요. 생산 속도가 갑자기 폭증해도 큐가 버퍼 역할을 해서 시스템이 안정적으로 유지돼요.',
      pitfall: 'put과 get에 await를 빠뜨리면 코루틴이 아닌 일반 호출로 처리돼서 교착 상태(deadlock)가 발생할 수 있어요.',
    },
  },
  {
    id: 'pasync-queue-maxsize',
    lang: 'python',
    title: 'Queue 용량 제한',
    file: 'queue_maxsize.py',
    code: `import asyncio

async def producer(q):
  for i in range(5):
    await q.put(i)
    print(f"[생산] 넣음: {i}")

async def consumer(q):
  for _ in range(5):
    item = await q.get()
    print(f"[소비] 꺼냄: {item}")
    await asyncio.sleep(0.3)

async def main():
  q = asyncio.Queue(maxsize=2)
  print(f"[실행] Queue(maxsize=2) — 생산자-소비자 시작")
  await asyncio.gather(producer(q), consumer(q))

asyncio.run(main())`,
    explain: {
      concept:
        'maxsize는 큐가 동시에 담을 수 있는 아이템의 최대 개수를 제한하는 파라미터예요. ' +
        'maxsize=2면 큐에 2개까지만 담을 수 있고, 큐가 가득 찬 상태에서 put을 호출하면 소비자가 하나 꺼낼 때까지 생산자가 자동으로 대기해요. ' +
        '이게 바로 배압(backpressure) 메커니즘이에요. 빠른 생산자가 느린 소비자를 기다리게 해서 메모리 폭발을 막아줘요. ' +
        '실무에서는 대량의 데이터를 처리할 때 메모리 사용량을 제한하기 위해 반드시 써야 하는 기능이에요.',
      terms: [
        { t: 'maxsize=2', d: '큐에 동시에 담을 수 있는 최대 아이템 개수예요. 초과 시 put이 대기해요.' },
        { t: 'await q.put(i)', d: '큐가 가득 차면 공간이 날 때까지 자동으로 기다리는 비동기 put이에요.' },
        { t: 'await q.get()', d: '큐가 비어 있으면 아이템이 들어올 때까지 자동으로 기다리는 비동기 get이에요.' },
        { t: 'asyncio.gather', d: '생산자와 소비자를 동시에 시작해서 서로 주고받으며 진행돼요.' },
      ],
      why:
        '실무에서 수백만 건의 데이터를 스트림 처리할 때 maxsize 없는 큐를 쓰면 메모리가 터져서 서버가 다운돼요. ' +
        'maxsize로 배압을 걸어서 소비자의 처리 속도에 맞춰 생산 속도를 자동으로 조절해요.',
      expectedOutput:
        '실행 시:\n' +
        '[실행] Queue(maxsize=2) — 생산자-소비자 시작\n' +
        '[생산] 넣음: 0\n' +
        '[생산] 넣음: 1\n' +
        '[소비] 꺼냄: 0\n' +
        '[생산] 넣음: 2\n' +
        '[소비] 꺼냄: 1\n' +
        '[생산] 넣음: 3\n' +
        '[소비] 꺼냄: 2\n' +
        '[생산] 넣음: 4\n' +
        '[소비] 꺼냄: 3\n' +
        '[소비] 꺼냄: 4',
      realWorldUsage:
        '실제 로그 수집 파이프라인에서 maxsize=1000으로 제한해서, 로그 발생량이 일시적으로 폭증해도 메모리 사용량이 일정하게 유지돼서 OOM(Out of Memory) 장애를 방지해요.',
      pitfall: '소비자를 실행하지 않거나 소비자가 멈추면, 큐가 가득 찬 순간 생산자가 영원히 대기하는 교착 상태(deadlock)에 빠져요.',
    },
  },
  {
    id: 'pasync-lock-critical',
    lang: 'python',
    title: 'asyncio.Lock 임계 구역',
    file: 'lock_critical.py',
    code: `import asyncio

async def add(balance, lock):
  async with lock:
    print(f"[진입] 임계 구역 — 현재 잔액: {balance[0]}")
    balance[0] += 1
    print(f"[종료] 임계 구역 — 갱신 잔액: {balance[0]}")
  return balance[0]

async def main():
  balance = [0]
  lock = asyncio.Lock()
  print("[실행] Lock 동시성 보호 시작")
  await asyncio.gather(*(add(balance, lock) for _ in range(3)))
  print(f"[결과] 최종 잔액: {balance[0]}")

asyncio.run(main())`,
    explain: {
      concept:
        'Lock은 한 번에 하나의 코루틴만 특정 코드 블록(임계 구역)에 들어갈 수 있게 통제하는 장치예요. ' +
        '여러 코루틴이 같은 변수를 동시에 수정하려고 하면 데이터가 꼬일 수 있는데, Lock이 "한 명만 들어와"라고 제한해서 안전하게 보호해줘요. ' +
        '일반적인 += 연산은 짧아서 안전해 보이지만, 읽고-계산하고-쓰는 사이에 다른 코루틴이 끼어들면 값이 소실될 수 있어요. ' +
        '비동기 프로그래밍에서는 await 사이사이에 다른 코루틴이 끼어들 수 있어서, 스레드보다 더 세심한 Lock 관리가 필요해요.',
      terms: [
        { t: 'asyncio.Lock()', d: '비동기용 잠금 장치예요. threading.Lock과 달리 await와 함께 써요.' },
        { t: 'async with lock', d: '임계 구역 진입 시 lock을 획득하고, 빠져나올 때 자동으로 해제해줘요.' },
        { t: 'balance[0]', d: '리스트로 감싸서 여러 코루틴이 같은 객체를 참조(공유)할 수 있게 했어요.' },
        { t: 'gather(*(...for _ in range(3)))', d: '같은 add 코루틴을 3개 동시에 생성해 실행해요.' },
      ],
      why:
        '실무에서 여러 사용자가 동시에 같은 상품의 재고를 감소시킬 때, Lock 없이 처리하면 마지막 하나 남은 재고를 두 명이 동시에 구매할 수도 있어요. Lock으로 한 번에 한 명만 처리하게 해서 정합성을 보호해요.',
      expectedOutput:
        '실행 시:\n' +
        '[실행] Lock 동시성 보호 시작\n' +
        '[진입] 임계 구역 — 현재 잔액: 0\n' +
        '[종료] 임계 구역 — 갱신 잔액: 1\n' +
        '[진입] 임계 구역 — 현재 잔액: 1\n' +
        '[종료] 임계 구역 — 갱신 잔액: 2\n' +
        '[진입] 임계 구역 — 현재 잔액: 2\n' +
        '[종료] 임계 구역 — 갱신 잔액: 3\n' +
        '[결과] 최종 잔액: 3',
      realWorldUsage:
        '실제 티켓 예매 시스템에서 "마지막 1석"을 여러 사용자가 동시에 예매하려 할 때, Lock으로 임계 구역을 보호해서 정확히 한 명만 성공하게 처리해요.',
      pitfall: 'async with를 쓰지 않고 수동으로 acquire()/release()를 호출하면, 예외 발생 시 release가 누락돼서 영원히 잠기는 버그가 생겨요.',
    },
  },
  {
    id: 'pasync-event-signal',
    lang: 'python',
    title: 'Event 신호 대기',
    file: 'event_signal.py',
    code: `import asyncio

async def waiter(event):
  print("[대기] 신호 기다리는 중...")
  await event.wait()
  print("[출발] 신호 받음 — 작업 시작!")

async def main():
  event = asyncio.Event()
  print("[실행] Event 생성 — 1초 후 set() 호출 예정")
  w = asyncio.create_task(waiter(event))
  await asyncio.sleep(1)
  print("[신호] event.set() 호출")
  event.set()
  await w

asyncio.run(main())`,
    explain: {
      concept:
        'Event는 여러 코루틴을 한 번에 깨우는 방아쇠 신호 장치예요. ' +
        'event.wait()로 대기 중인 코루틴들은 event.set()이 호출되는 순간 일제히 깨어나서 실행을 재개해요. ' +
        '마치 육상 경기에서 출발 총성이 울리면 모든 선수가 동시에 출발하는 것과 같아요. ' +
        '실무에서는 "초기화가 완료될 때까지 기다려라" 또는 "모든 서비스가 준비되면 시작해라" 같은 동기화 포인트를 만들 때 써요. ' +
        '이벤트는 한 번 set()이 호출되면 계속 깨어 있는 상태로 남아서, 이후에 wait()를 호출하는 코루틴도 즉시 통과해요.',
      terms: [
        { t: 'asyncio.Event()', d: '신호 대기/발신을 위한 간단한 on/off 스위치 객체예요.' },
        { t: 'await event.wait()', d: '신호(set)가 올 때까지 코루틴을 일시 정지해요.' },
        { t: 'event.set()', d: '신호를 켜서 wait() 중인 모든 코루틴을 동시에 깨워줘요.' },
        { t: 'asyncio.create_task(waiter(event))', d: 'waiter 코루틴을 백그라운드 작업으로 즉시 실행해요.' },
      ],
      why:
        '실무에서 서버 시작 시 "DB 연결이 완료되면 HTTP 서버를 시작해라" 또는 "설정 파일 로드가 끝나면 요청 처리를 시작해라" 같은 의존 관계가 있는 초기화 순서를 Event로 제어해요.',
      expectedOutput:
        '실행 시:\n' +
        '[실행] Event 생성 — 1초 후 set() 호출 예정\n' +
        '[대기] 신호 기다리는 중...\n' +
        '[신호] event.set() 호출\n' +
        '[출발] 신호 받음 — 작업 시작!',
      realWorldUsage:
        '실제 게임 서버에서 "모든 플레이어가 로딩 완료되면 게임을 시작한다"를 구현할 때, 각 플레이어의 로딩 완료 이벤트를 기다리는 패턴으로 써요.',
      pitfall: 'set()을 호출하지 않으면 wait()에서 영원히 멈춰 있어요. 타임아웃 기능이 없으니, 반드시 set()을 호출할 코드 경로를 확인해야 해요.',
    },
  },
  {
    id: 'pasync-sleep-yield',
    lang: 'python',
    title: 'asyncio.sleep 양보',
    file: 'sleep_yield.py',
    code: `import asyncio

async def slow():
  print("[시작] slow() — 0.5초 대기 진입")
  await asyncio.sleep(0.5)
  print("[완료] slow() — 대기 종료")

async def fast():
  print("[실행] fast() — 즉시 실행")

async def main():
  print("[실행] gather — slow + fast 동시 시작")
  await asyncio.gather(slow(), fast())

asyncio.run(main())`,
    explain: {
      concept:
        'asyncio.sleep은 단순히 시간을 보내는 게 아니라, 현재 코루틴이 "지금은 할 일이 없으니 다른 코루틴에게 순서를 양보할게요"라고 선언하는 지점이에요. ' +
        'sleep(0.5) 동안 slow()는 대기 상태로 빠지고, 그 사이 fast()가 즉시 실행돼요. ' +
        '이게 비동기 프로그래밍의 핵심 원리예요. time.sleep()과 달리 CPU를 붙잡지 않고 기다리기 때문에, 기다리는 동안 다른 유용한 작업이 실행될 수 있어요. ' +
        'CPU를 사용하지 않는 I/O 대기 시간을 활용해서 전체 처리량을 높이는 게 비동기의 목표예요.',
      terms: [
        { t: 'asyncio.sleep(0.5)', d: '0.5초 동안 대기하면서 다른 코루틴에 실행 순서를 양보해요.' },
        { t: 'await asyncio.gather(slow(), fast())', d: '두 코루틴을 동시에 시작해요. slow는 대기 중 fast가 실행돼요.' },
        { t: 'fast()', d: '대기 없이 바로 실행되는 코루틴으로, slow의 대기 중간에 끼어들어 실행돼요.' },
      ],
      why:
        '실무에서 API 서버가 외부 결제 시스템의 응답을 기다리는 동안, 다른 사용자의 요청을 처리할 수 있는 건 모두 asyncio.sleep과 같은 양보 지점 덕분이에요.',
      expectedOutput:
        '실행 시:\n' +
        '[실행] gather — slow + fast 동시 시작\n' +
        '[시작] slow() — 0.5초 대기 진입\n' +
        '[실행] fast() — 즉시 실행\n' +
        '[완료] slow() — 대기 종료',
      realWorldUsage:
        '실제 실시간 채팅 서버에서 한 사용자의 메시지 저장을 기다리는 동안(sleep), 다른 사용자의 새로운 메시지를 받아서 처리하는 식으로 CPU를 놀리지 않고 계속 활용해요.',
      pitfall: 'time.sleep()을 쓰면 CPU를 놓지 않고 진짜로 멈춰버려서, 다른 모든 코루틴도 함께 멈춰요. 비동기 함수 안에서는 반드시 asyncio.sleep()을 써야 해요.',
    },
  },
  {
    id: 'pasync-create-task-bg',
    lang: 'python',
    title: 'create_task 백그라운드',
    file: 'create_task_bg.py',
    code: `import asyncio

async def tick():
  for i in range(3):
    print(f"[틱] tick {i}")
    await asyncio.sleep(0.1)

async def main():
  print("[실행] 백그라운드 작업 시작")
  t = asyncio.create_task(tick())
  print("[메인] tick 작업이 백그라운드에서 실행 중...")
  await t
  print("[종료] 백그라운드 작업 완료")

asyncio.run(main())`,
    explain: {
      concept:
        'create_task는 코루틴을 "당장 실행하되, 내가 기다리지 않을게"라는 백그라운드 작업으로 만들어줘요. ' +
        '일반적인 await는 작업이 끝날 때까지 현재 코루틴을 멈추지만, create_task로 작업을 생성한 뒤에는 다른 일을 먼저 처리할 수 있어요. ' +
        '나중에 await t로 백그라운드 작업의 완료를 확인하고 결과를 받으면 돼요. ' +
        '실무에서는 "서버가 요청을 처리하는 동안 백그라운드에서 알림을 발송한다"처럼 독립적인 보조 작업을 띄워둘 때 써요.',
      terms: [
        { t: 'asyncio.create_task(tick())', d: '코루틴을 백그라운드 작업으로 만들어 즉시 스케줄에 등록해요.' },
        { t: 'await t', d: '백그라운드 작업이 완료될 때까지 현재 코루틴을 기다리게 해요.' },
        { t: 'asyncio.sleep(0.1)', d: 'tick 사이에 짧은 대기를 넣어 다른 작업이 실행될 틈을 줘요.' },
      ],
      why:
        '실무에서 웹 요청을 처리하면서 "응답은 바로 주고, 이메일 발송은 백그라운드에서 천천히 처리해라" 같은 비동기 패턴을 구현할 때 create_task를 써요.',
      expectedOutput:
        '실행 시:\n' +
        '[실행] 백그라운드 작업 시작\n' +
        '[메인] tick 작업이 백그라운드에서 실행 중...\n' +
        '[틱] tick 0\n' +
        '[틱] tick 1\n' +
        '[틱] tick 2\n' +
        '[종료] 백그라운드 작업 완료',
      realWorldUsage:
        '실제 주문 시스템에서 "주문 완료 응답은 즉시 반환하고, 영수증 이메일 발송과 재고 업데이트는 create_task로 백그라운드 처리"하는 패턴이 흔히 쓰여요.',
      pitfall: 'create_task로 만든 작업을 await로 기다리지 않으면 작업이 완료됐는지 알 수 없고, 예외가 발생해도 감지하지 못해요.',
    },
  },
  {
    id: 'pasync-timeout-guard',
    lang: 'python',
    title: 'timeout 보호',
    file: 'timeout_guard.py',
    code: `import asyncio

async def slow():
  print("[실행] slow() — 긴 작업 시작 (10초)")
  await asyncio.sleep(10)
  return '완료'

async def main():
  print("[실행] wait_for — 타임아웃 0.1초 설정")
  try:
    result = await asyncio.wait_for(slow(), timeout=0.1)
    print(f"[결과] {result}")
  except asyncio.TimeoutError:
    print("[타임아웃] 0.1초 초과 — 작업 취소됨")

asyncio.run(main())`,
    explain: {
      concept:
        'asyncio.wait_for는 비동기 작업에 시간 제한을 거는 보호 장치예요. ' +
        '설정한 timeout 시간 안에 작업이 완료되지 않으면, 자동으로 해당 작업을 취소하고 TimeoutError 예외를 발생시켜요. ' +
        '실무에서는 외부 API 호출, 데이터베이스 쿼리, 파일 다운로드 등 응답 시간을 예측할 수 없는 작업에 반드시 타임아웃을 걸어요. ' +
        '타임아웃이 없으면 느린 외부 서비스 하나 때문에 전체 서버의 응답이 지연되는 연쇄 장애가 발생할 수 있어요.',
      terms: [
        { t: 'asyncio.wait_for(slow(), timeout=0.1)', d: 'slow() 작업에 0.1초의 제한 시간을 설정해요.' },
        { t: 'timeout=0.1', d: '최대 기다릴 시간(초)이에요. 이 시간이 지나면 TimeoutError가 발생해요.' },
        { t: 'asyncio.TimeoutError', d: '지정된 시간 안에 작업이 완료되지 않았을 때 발생하는 예외예요.' },
        { t: 'try/except', d: '예상되는 예외를 잡아서 프로그램이 멈추지 않게 처리하는 구문이에요.' },
      ],
      why:
        '실무에서 모든 외부 API 호출에는 반드시 타임아웃을 설정해야 해요. 안 그러면 하나의 느린 API가 전체 서비스의 응답 지연을 유발하는 폭포수 장애로 이어져요.',
      expectedOutput:
        '실행 시:\n' +
        '[실행] wait_for — 타임아웃 0.1초 설정\n' +
        '[실행] slow() — 긴 작업 시작 (10초)\n' +
        '[타임아웃] 0.1초 초과 — 작업 취소됨',
      realWorldUsage:
        '실제 결제 게이트웨이 연동에서 PG사 API 호출에 5초 타임아웃을 걸어서, PG사 서버가 느려져도 사용자에게 "결제 진행 중" 상태를 빠르게 알려주고 재시도하게 할 수 있어요.',
      pitfall: '타임아웃을 0에 가깝게 설정하면 정상적인 작업도 취소될 수 있어요. 서비스 상황에 맞는 적절한 값을 설정해야 해요.',
    },
  },
  {
    id: 'pasync-to-thread-blocking',
    lang: 'python',
    title: 'to_thread 블로킹 회피',
    file: 'to_thread_blocking.py',
    code: `import asyncio
import time

def blocking():
  print("[실행] blocking() — 일반 동기 함수 진입 (2초 작업)")
  time.sleep(2)
  print("[완료] blocking() — 작업 종료")
  return '완료'

async def main():
  print("[실행] main() — to_thread로 블로킹 함수를 별도 스레드로 위임")
  result = await asyncio.to_thread(blocking)
  print(f"[결과] 반환값: {result}")

asyncio.run(main())`,
    explain: {
      concept:
        'asyncio.to_thread는 일반 동기 함수(예: time.sleep을 쓰는 함수)를 별도의 스레드로 옮겨서 실행해줘요. ' +
        '동기 함수 안에서 CPU를 붙잡고 멈추는 작업을 하면 비동기 이벤트 루프 전체가 얼어붙는데, ' +
        'to_thread로 "이 작업은 옆 방(별도 스레드)에서 처리해 주세요"라고 위임하면 이벤트 루프가 계속 돌아가요. ' +
        '결과는 비동기적으로 await로 받을 수 있어서, 기존의 동기 라이브러리(파일 I/O, DB 드라이버 등)를 비동기 프로그램 안에서 안전하게 쓸 수 있어요.',
      terms: [
        { t: 'asyncio.to_thread(blocking)', d: '일반 함수를 별도 스레드에서 실행하고, 결과를 비동기로 기다려요.' },
        { t: 'time.sleep(2)', d: '스레드에서 실행되므로 이벤트 루프를 멈추지 않아요. 스레드 안에서는 안전해요.' },
        { t: 'def blocking()', d: 'async가 아닌 일반 동기 함수예요. 내부에 블로킹 코드(time.sleep)가 있어도 돼요.' },
      ],
      why:
        '실무에서 동기 전용인 기존 라이브러리(예: 일부 DB 드라이버, PDF 생성 라이브러리)를 비동기 웹 서버에서 써야 할 때, ' +
        'to_thread로 감싸면 이벤트 루프를 막지 않고 안전하게 호출할 수 있어요.',
      expectedOutput:
        '실행 시:\n' +
        '[실행] main() — to_thread로 블로킹 함수를 별도 스레드로 위임\n' +
        '[실행] blocking() — 일반 동기 함수 진입 (2초 작업)\n' +
        '[완료] blocking() — 작업 종료\n' +
        '[결과] 반환값: 완료',
      realWorldUsage:
        '실제 FastAPI 서버에서 오래된 동기 PDF 생성 라이브러리를 써야 할 때, to_thread로 감싸서 PDF 생성 중에도 서버가 다른 요청을 계속 처리할 수 있게 해요.',
      pitfall: 'CPU를 많이 쓰는 작업을 to_thread로 보내도 GIL(Global Interpreter Lock) 때문에 실제 병렬 성능 향상은 거의 없어요. I/O 대기에만 효과적이에요.',
    },
  },
  {
    id: 'pasync-threading-cpu',
    lang: 'python',
    title: 'Threading 동시 실행',
    file: 'threading_cpu.py',
    code: `import time
from threading import Thread

def download(name):
  print(f"[실행] download({name}) — 시작")
  time.sleep(1)
  print(f"[완료] download({name}) — 종료")

print("[시작] Threading — 두 개의 다운로드 동시 실행")
t1 = Thread(target=download, args=('파일A',))
t2 = Thread(target=download, args=('파일B',))
t1.start()
t2.start()
t1.join()
t2.join()
print("[결과] 모든 다운로드 완료")`,
    explain: {
      concept:
        'Threading은 하나의 프로세스 안에서 여러 실행 흐름을 만들어 동시에 작업을 진행하는 기법이에요. ' +
        '마치 한 사무실에 직원 두 명이 동시에 각자의 업무를 처리하는 것과 같아요. ' +
        '파일 다운로드나 웹 요청처럼 I/O 대기 시간이 긴 작업에 효과적이에요. ' +
        'start()로 스레드를 시작하고, join()으로 해당 스레드가 끝날 때까지 기다려요. ' +
        'join()을 호출하지 않으면 메인 프로그램이 먼저 종료될 수 있으니 주의해야 해요.',
      terms: [
        { t: 'Thread(target=download, args=("파일A",))', d: 'download 함수를 "파일A" 인수로 실행할 스레드를 생성해요.' },
        { t: 't1.start()', d: '스레드를 실제로 실행 시작하는 메서드예요.' },
        { t: 't1.join()', d: '해당 스레드가 종료될 때까지 현재(메인) 스레드가 기다려요.' },
        { t: 'args=(...)', d: '스레드에서 실행할 함수에 전달할 인수를 튜플 형태로 지정해요.' },
      ],
      why:
        '실무에서 대량의 파일 압축 해제나 여러 웹페이지 동시 크롤링처럼 I/O 대기가 많은 작업을 Threading으로 병렬화해 전체 소요 시간을 줄여요.',
      expectedOutput:
        '실행 시:\n' +
        '[시작] Threading — 두 개의 다운로드 동시 실행\n' +
        '[실행] download(파일A) — 시작\n' +
        '[실행] download(파일B) — 시작\n' +
        '[완료] download(파일A) — 종료\n' +
        '[완료] download(파일B) — 종료\n' +
        '[결과] 모든 다운로드 완료',
      realWorldUsage:
        '실제 데이터 수집기에서 100개의 웹 페이지를 크롤링할 때 ThreadPool로 10개씩 동시에 요청해서, 순차 호출 대비 10배 이상 빠르게 데이터를 수집해요.',
      pitfall: 'GIL 때문에 CPU를 많이 쓰는 순수 계산 작업에는 Threading이 성능 향상을 거의 주지 못해요. CPU 작업에는 Multiprocessing이 필요해요.',
    },
  },
  {
    id: 'pasync-multiprocessing-cpu',
    lang: 'python',
    title: 'Multiprocessing CPU 병렬',
    file: 'multiprocessing_cpu.py',
    code: `from multiprocessing import Process

def square(n):
  result = n * n
  print(f"[결과] square({n}) = {result}")

if __name__ == '__main__':
  print("[실행] Multiprocessing — CPU 코어 병렬 활용")
  ps = []
  for n in range(4):
    p = Process(target=square, args=(n,))
    p.start()
    ps.append(p)
  for p in ps:
    p.join()
  print("[완료] 모든 프로세스 종료")`,
    explain: {
      concept:
        'Multiprocessing은 GIL의 제약을 우회해서 진정한 병렬 처리를 할 수 있게 해주는 기법이에요. ' +
        'Threading과 달리 Process는 각자 독립적인 파이썬 인터프리터와 메모리 공간을 가져요. ' +
        '덕분에 CPU 코어 여러 개를 동시에 활용해서 무거운 계산 작업을 병렬로 처리할 수 있어요. ' +
        '실무에서는 이미지 처리, 데이터 분석, 머신러닝 피처 엔지니어링 등 CPU를 많이 쓰는 작업에 써요. ' +
        'Windows에서는 반드시 if __name__ == \'__main__\' 가드 안에서 Process를 생성해야 해요.',
      terms: [
        { t: 'Process(target=square, args=(n,))', d: '독립된 프로세스에서 square 함수를 실행할 준비를 해요.' },
        { t: 'p.start()', d: '새로운 프로세스를 실제로 생성하고 함수 실행을 시작해요.' },
        { t: 'p.join()', d: '자식 프로세스가 완전히 종료될 때까지 부모 프로세스가 기다려요.' },
        { t: "__name__ == '__main__'", d: 'Windows에서 프로세스 무한 생성(재귀 fork)을 막는 필수 가드예요.' },
      ],
      why:
        '실무에서 대규모 데이터 전처리나 모델 학습 시 병목인 CPU 작업을 여러 프로세스로 분산해서, 8코어 CPU면 이론적으로 8배까지 속도를 높일 수 있어요.',
      expectedOutput:
        '실행 시:\n' +
        '[실행] Multiprocessing — CPU 코어 병렬 활용\n' +
        '[결과] square(0) = 0\n' +
        '[결과] square(1) = 1\n' +
        '[결과] square(2) = 4\n' +
        '[결과] square(3) = 9\n' +
        '[완료] 모든 프로세스 종료',
      realWorldUsage:
        '실제 데이터 분석 시스템에서 수백만 행의 CSV 파일을 읽어들일 때, 파일을 4등분해서 4개 프로세스로 동시에 처리하면 단일 프로세스 대비 3~4배 빠르게 완료돼요.',
      pitfall: 'Windows에서는 __main__ 가드가 없으면 각 자식 프로세스가 다시 자신을 복제하는 무한 루프에 빠져 시스템이 마비돼요.',
    },
  },
  {
    id: 'pasync-pool-map',
    lang: 'python',
    title: 'Pool.map 자동 분배',
    file: 'pool_map.py',
    code: `from multiprocessing import Pool

def double(n):
  result = n * 2
  print(f"[실행] double({n}) = {result}")
  return result

if __name__ == '__main__':
  print("[실행] Pool.map — 2개 프로세서로 자동 분배")
  with Pool(processes=2) as pool:
    result = pool.map(double, range(5))
  print(f"[결과] 최종 결과: {result}")`,
    explain: {
      concept:
        'Pool.map은 데이터를 여러 프로세스에 자동으로 골고루 분배해 처리하는 편리한 도구예요. ' +
        '일꾼 수(processes)만 지정하면, 작업 목록을 알아서 나눠서 병렬 처리하고 결과를 순서대로 모아줘요. ' +
        '직접 Process 객체를 여러 개 만들고 관리하는 것보다 훨씬 간결하고, 프로세스 재사용 덕분에 오버헤드도 적어요. ' +
        'with문을 쓰면 블록을 빠져나올 때 프로세스 풀이 자동으로 정리돼서 리소스 누수를 막을 수 있어요. ' +
        '실무에서는 데이터 변환, 파일 처리, 모델 추론 등 "같은 작업을 여러 데이터에 적용"하는 패턴에 가장 많이 써요.',
      terms: [
        { t: 'Pool(processes=2)', d: '2개의 작업 프로세스를 미리 띄워두고 작업을 분배할 준비를 해요.' },
        { t: 'pool.map(double, range(5))', d: '0~4까지 각 값에 double 함수를 적용하고 결과를 리스트로 모아줘요.' },
        { t: 'with Pool() as pool', d: '블록 종료 시 프로세스들이 자동으로 정리돼요.' },
        { t: 'processes=2', d: '동시에 실행할 최대 프로세스 개수예요. 보통 CPU 코어 수로 지정해요.' },
      ],
      why:
        '실무에서 100만 개의 이미지에 필터를 적용할 때, Pool.map으로 8코어 CPU에서 8개 프로세스로 분산 처리하면 실행 시간이 거의 1/8로 단축돼요.',
      expectedOutput:
        '실행 시:\n' +
        '[실행] Pool.map — 2개 프로세서로 자동 분배\n' +
        '[실행] double(0) = 0\n' +
        '[실행] double(1) = 2\n' +
        '[실행] double(2) = 4\n' +
        '[실행] double(3) = 6\n' +
        '[실행] double(4) = 8\n' +
        '[결과] 최종 결과: [0, 2, 4, 6, 8]',
      realWorldUsage:
        '실제 ETL 파이프라인에서 원본 로그 파일 수천 개를 Pool.map으로 분산 처리해 데이터 웨어하우스에 적재할 때, 병렬 처리로 시간을 수십 분의 일로 단축해요.',
      pitfall: 'Pool.map에 전달하는 함수가 람다식이면 프로세스 간 직렬화(pickle)가 안 돼서 AttributeError가 발생해요. 일반 함수(def)로 정의해야 해요.',
    },
  },
  {
    id: 'pasync-as-completed',
    lang: 'python',
    title: 'as_completed 순서 무관',
    file: 'as_completed.py',
    code: `import asyncio

async def job(n):
  await asyncio.sleep(n * 0.5)
  print(f"[완료] job({n}) — {n}초 대기 후 종료")
  return n

async def main():
  print("[실행] as_completed — 끝나는 순서대로 결과 수집")
  tasks = [asyncio.create_task(job(i)) for i in range(3)]
  for t in asyncio.as_completed(tasks):
    r = await t
    print(f"[수집] 결과: {r}")

asyncio.run(main())`,
    explain: {
      concept:
        'as_completed는 여러 비동기 작업 중 먼저 끝난 것부터 순서대로 결과를 받아볼 수 있게 해줘요. ' +
        'gather가 "모두 끝날 때까지 기다렸다가 순서대로" 모아준다면, as_completed는 "하나라도 끝나면 바로 알려줘" 모드예요. ' +
        '실무에서는 검색 결과를 여러 API에 동시에 요청하고 가장 빠르게 응답한 결과를 먼저 사용자에게 보여줄 때 써요. ' +
        '또는 진행률을 표시할 때 "3개 중 1개 완료"처럼 실시간으로 피드백을 줄 때도 유용해요.',
      terms: [
        { t: 'asyncio.as_completed(tasks)', d: '작업 리스트를 완료 순서로 하나씩 반환하는 이터레이터예요.' },
        { t: 'asyncio.create_task(job(i))', d: '미리 작업을 생성해둬야 as_completed로 완료 순서를 감지할 수 있어요.' },
        { t: 'await t', d: '이미 완료된 작업의 결과를 즉시 가져오거나, 아직이면 완료를 기다려요.' },
        { t: 'for t in as_completed(...)', d: '작업이 완료될 때마다 루프가 한 번씩 돌아요.' },
      ],
      why:
        '실무에서 검색 엔진에 "이미지 검색, 텍스트 검색, 동영상 검색"을 동시에 요청하고, 가장 먼저 나온 결과부터 사용자에게 노출할 때 as_completed를 써요.',
      expectedOutput:
        '실행 시:\n' +
        '[실행] as_completed — 끝나는 순서대로 결과 수집\n' +
        '[완료] job(0) — 0초 대기 후 종료\n' +
        '[수집] 결과: 0\n' +
        '[완료] job(1) — 1초 대기 후 종료\n' +
        '[수집] 결과: 1\n' +
        '[완료] job(2) — 2초 대기 후 종료\n' +
        '[수집] 결과: 2',
      realWorldUsage:
        '실제 통합 검색 시스템에서 "캐시 서버, 메인 DB, 외부 검색 엔진"에 동시에 쿼리하고, 캐시 결과를 가장 먼저 보여주는 식으로 사용자 체감 속도를 극대화해요.',
      pitfall: 'gather는 결과 순서가 호출 순서와 같지만, as_completed는 완료 순서예요. 결과 순서가 중요한 상황에서는 gather를 써야 해요.',
    },
  },
  {
    id: 'pasync-cancel-task',
    lang: 'python',
    title: '작업 취소',
    file: 'cancel_task.py',
    code: `import asyncio

async def loop():
  while True:
    print("[동작] 루프 실행 중...")
    await asyncio.sleep(0.5)

async def main():
  print("[실행] 무한 루프 작업 시작")
  t = asyncio.create_task(loop())
  await asyncio.sleep(1.5)
  print("[취소] 작업 취소 요청")
  t.cancel()
  try:
    await t
  except asyncio.CancelledError:
    print("[결과] 작업이 정상적으로 취소됨")

asyncio.run(main())`,
    explain: {
      concept:
        'cancel()은 실행 중인 비동기 작업에 "그만해"라는 정지 요청을 보내는 메서드예요. ' +
        '취소 요청을 받은 작업은 현재 await 지점에서 CancelledError 예외가 발생하면서 멈춰요. ' +
        '무한 루프처럼 끝나지 않을 작업이나, 사용자가 요청을 중단했을 때 안전하게 작업을 종료할 때 써요. ' +
        '취소된 작업을 await로 기다리면 CancelledError가 전파되므로, try/except로 잡아서 처리해야 해요. ' +
        '실무에서는 검색이나 파일 업로드 같은 작업을 사용자가 중간에 취소했을 때 자원을 깔끔하게 정리하는 용도로 써요.',
      terms: [
        { t: 't.cancel()', d: '작업에 취소 요청을 보내요. 즉시 멈추는 게 아니라 다음 await 지점에서 취소돼요.' },
        { t: 'asyncio.CancelledError', d: '작업이 취소될 때 발생하는 예외예요. BaseException의 하위 클래스예요.' },
        { t: 'while True', d: '무한히 반복되는 루프로, 외부에서 cancel()로 멈춰야 종료할 수 있어요.' },
        { t: 'try/except CancelledError', d: '취소 예외를 잡아서 정상적인 종료로 처리하는 구문이에요.' },
      ],
      why:
        '실무에서 파일 업로드 중 사용자가 취소 버튼을 누르면, cancel()로 백그라운드 업로드 작업을 중단하고 임시 파일을 정리하는 패턴으로 써요.',
      expectedOutput:
        '실행 시:\n' +
        '[실행] 무한 루프 작업 시작\n' +
        '[동작] 루프 실행 중...\n' +
        '[동작] 루프 실행 중...\n' +
        '[동작] 루프 실행 중...\n' +
        '[취소] 작업 취소 요청\n' +
        '[결과] 작업이 정상적으로 취소됨',
      realWorldUsage:
        '실제 웹 애플리케이션에서 사용자가 긴 검색을 중간에 취소하면, 백그라운드에서 실행 중인 데이터베이스 쿼리나 외부 API 호출을 cancel()로 정리해서 자원 낭비를 막아요.',
      pitfall: 'CancelledError를 except에서 잡은 뒤 아무것도 안 하면 취소가 무시돼요. 정리 로직을 수행한 후 다시 raise 하거나 정상 종료해야 해요.',
    },
  },
  {
    id: 'pasync-sleep-0-yield',
    lang: 'python',
    title: 'sleep(0) 순서 양보',
    file: 'sleep_zero_yield.py',
    code: `import asyncio

async def step(name):
  print(f"[시작] step({name})")
  await asyncio.sleep(0)
  print(f"[이어] step({name}) — 양보 후 재개")

async def main():
  print("[실행] sleep(0)으로 순서 양보")
  await asyncio.gather(step('A'), step('B'))

asyncio.run(main())`,
    explain: {
      concept:
        'asyncio.sleep(0)은 시간 지연 없이 "지금 바로 다른 코루틴에게 순서를 양보할게요"라고 선언하는 특별한 패턴이에요. ' +
        '실제로 잠들지는 않지만, 이 지점에서 이벤트 루프가 다른 대기 중인 코루틴에게 실행 기회를 줘요. ' +
        'CPU를 오래 붙잡는 무거운 루프 안에 주기적으로 sleep(0)을 넣어주면, 하나의 코루틴이 이벤트 루프를 독점하는 걸 막을 수 있어요. ' +
        '실무에서는 협력적 멀티태스킹(cooperative multitasking)을 구현할 때 의도적으로 삽입하는 양보 지점이에요.',
      terms: [
        { t: 'asyncio.sleep(0)', d: '시간 지연 없이 다른 코루틴에 실행 기회를 양보하는 지점이에요.' },
        { t: 'await', d: '이 지점에서 이벤트 루프가 다른 코루틴으로 전환할 수 있어요.' },
        { t: 'gather(step(\'A\'), step(\'B\'))', d: '두 코루틴을 동시에 시작해요. sleep(0)에서 서로 교대해요.' },
      ],
      why:
        '실무에서 CPU를 많이 쓰는 비동기 작업이 이벤트 루프를 독점하지 않도록, 중간중간 sleep(0)을 넣어서 I/O 바운드 작업이 굶지 않게 해줘요.',
      expectedOutput:
        '실행 시:\n' +
        '[실행] sleep(0)으로 순서 양보\n' +
        '[시작] step(A)\n' +
        '[시작] step(B)\n' +
        '[이어] step(A) — 양보 후 재개\n' +
        '[이어] step(B) — 양보 후 재개',
      realWorldUsage:
        '실제 대규모 데이터를 비동기로 청크 단위 처리할 때, 각 청크 처리 사이에 sleep(0)을 넣어서 HTTP 요청 처리 같은 I/O 작업이 중간에 끼어들 수 있게 해줘요.',
      pitfall: '양보 지점이 전혀 없으면 하나의 코루틴이 끝날 때까지 다른 코루틴이 전혀 실행되지 못하는 기아 상태(starvation)가 발생해요.',
    },
  },
  {
    id: 'pasync-future-explicit',
    lang: 'python',
    title: 'Future 명시적 결과',
    file: 'future_explicit.py',
    code: `import asyncio

async def main():
  print("[실행] Future 생성 — 빈 결과 자리")
  fut = asyncio.Future()
  fut.set_result('값')
  result = await fut
  print(f"[결과] Future에서 꺼낸 값: {result}")

asyncio.run(main())`,
    explain: {
      concept:
        'Future는 "나중에 결과가 채워질 자리"를 미리 확보해두는 객체예요. ' +
        'Task와 달리 Future 자체는 스스로 실행되지 않고, 누군가 set_result()로 결과를 채워줘야 해요. ' +
        '일반적인 비동기 코드에서는 직접 Future를 만들 일이 거의 없고, Task와 gather가 내부적으로 Future를 사용해요. ' +
        '저수준 라이브러리나 콜백 기반 API를 async/await 세계와 연결하는 글루 코드를 작성할 때 필요해요.',
      terms: [
        { t: 'asyncio.Future()', d: '아직 결과가 없는 빈 자리를 만드는 생성자예요. 보통 직접 쓰지 않아요.' },
        { t: 'fut.set_result(\'값\')', d: 'Future에 결과값을 채워넣어요. 이후 await로 꺼낼 수 있어요.' },
        { t: 'await fut', d: 'Future에 결과가 채워질 때까지 기다렸다가 값을 꺼내요.' },
      ],
      why:
        '실무에서 콜백 기반의 오래된 라이브러리(예: 일부 DB 드라이버)를 async/await과 함께 쓰려면, ' +
        '콜백에서 set_result()를 호출하고 비동기 코드에서는 await로 받는 방식으로 연결해야 해요.',
      expectedOutput:
        '실행 시:\n' +
        '[실행] Future 생성 — 빈 결과 자리\n' +
        '[결과] Future에서 꺼낸 값: 값',
      realWorldUsage:
        '실제 메시지 큐 라이브러리를 비동기로 감쌀 때, on_message 콜백에서 Future의 set_result()를 호출하고, 소비자는 await future로 기다리는 패턴으로 동기-비동기 다리를 놓아요.',
      pitfall: 'set_result()는 한 번만 호출할 수 있어요. 두 번 호출하면 InvalidStateError가 발생해요.',
    },
  },
  {
    id: 'pasync-semaphore-limit',
    lang: 'python',
    title: 'Semaphore 동시 제한',
    file: 'semaphore_limit.py',
    code: `import asyncio

async def fetch(i, sem):
  async with sem:
    print(f"[진입] fetch({i}) — 동시 실행 중")
    await asyncio.sleep(0.1)
  print(f"[종료] fetch({i}) — 완료, 세마포어 반납")

async def main():
  sem = asyncio.Semaphore(2)
  print(f"[실행] Semaphore(2) — 최대 2개 동시 실행")
  await asyncio.gather(*(fetch(i, sem) for i in range(6)))

asyncio.run(main())`,
    explain: {
      concept:
        'Semaphore는 동시에 실행 가능한 작업 수를 제한하는 카운터 장치예요. ' +
        'Semaphore(2)면 딱 2개의 작업만 동시에 임계 구역에 들어갈 수 있고, 나머지는 자리가 날 때까지 대기해요. ' +
        '마치 화장실 칸 수를 정해두고 빈 칸이 생기면 다음 사람이 들어가는 방식과 같아요. ' +
        '실무에서는 외부 API의 호출 제한(rate limit)을 지키거나, 데이터베이스 커넥션 풀을 초과하지 않도록 제어할 때 써요. ' +
        'Semaphore는 비동기 코드에서 가장 널리 쓰이는 동시성 제어 도구 중 하나예요.',
      terms: [
        { t: 'asyncio.Semaphore(2)', d: '최대 2개까지 동시에 접근할 수 있는 제한 장치를 만들어요.' },
        { t: 'async with sem', d: '세마포어를 획득하고 블록을 나가면 자동으로 반납해요.' },
        { t: 'gather(*(fetch(i,sem) for i in range(6)))', d: '6개 작업을 동시에 시작하지만 sem에 의해 최대 2개만 실행돼요.' },
        { t: 'sem', d: '동시 실행 제한을 적용할 세마포어 객체예요. 모든 작업이 공유해요.' },
      ],
      why:
        '실무에서 외부 API가 초당 10건까지만 허용할 때, Semaphore(10)으로 제한을 걸어서 rate limit 초과로 차단당하는 것을 막을 수 있어요.',
      expectedOutput:
        '실행 시:\n' +
        '[실행] Semaphore(2) — 최대 2개 동시 실행\n' +
        '[진입] fetch(0) — 동시 실행 중\n' +
        '[진입] fetch(1) — 동시 실행 중\n' +
        '[종료] fetch(0) — 완료, 세마포어 반납\n' +
        '[종료] fetch(1) — 완료, 세마포어 반납\n' +
        '[진입] fetch(2) — 동시 실행 중\n' +
        '[진입] fetch(3) — 동시 실행 중\n' +
        '[종료] fetch(2) — 완료, 세마포어 반납\n' +
        '[종료] fetch(3) — 완료, 세마포어 반납\n' +
        '[진입] fetch(4) — 동시 실행 중\n' +
        '[진입] fetch(5) — 동시 실행 중\n' +
        '[종료] fetch(4) — 완료, 세마포어 반납\n' +
        '[종료] fetch(5) — 완료, 세마포어 반납',
      realWorldUsage:
        '실제 크롤링 시스템에서 대상 사이트의 robots.txt와 초당 요청 제한을 지키기 위해 Semaphore로 동시 요청 수를 제어해요.',
      pitfall: '세마포어 값을 너무 높게 설정하면 제한 효과가 사라지고, 너무 낮게 하면 작업 처리량이 불필요하게 느려져요.',
    },
  },
];
