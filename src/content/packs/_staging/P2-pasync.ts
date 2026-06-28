import type { Snippet } from '../../types';

export const pythonAsync: Snippet[] = [
  {
    id: 'pasync-await-basic',
    lang: 'python',
    title: 'async/await 기본',
    file: 'await_basic.py',
    code: `import asyncio

async def fetch_data():
  print('가져오는 중')
  return '결과'

async def main():
  data = await fetch_data()
  print(data)

asyncio.run(main())`,
    explain: {
      concept: 'async 함수는 "약속"을 만드는 함수예요. await는 그 약속이 끝날 때까지 잠깐 기다려주는 단어예요. 식당에서 주문하고 음식 나올 때까지 기다리는 것과 같아요.',
      terms: [
        { t: 'async def', d: '이 함수는 "비동기" 함수야 하고 안에서 await를 쓸 수 있어요.' },
        { t: 'await', d: '또 다른 async 함수가 끝날 때까지 여기서 잠깐 멈춰요.' },
        { t: 'return', d: '함수가 끝나면서 값을 밖으로 돌려보내요.' },
        { t: 'asyncio.run', d: '비동기 프로그램을 시작점에서 출발시켜 주는 진입점이에요.' }
      ],
      why: '오래 걸리는 일을 기다리는 동안 다른 일을 할 수 있게 하려고 써요.',
      pitfall: 'async 함수 안에서 await 없이 그냥 호출하면 결과가 아니라 "약속" 객체만 보여요.'
    }
  },
  {
    id: 'pasync-run-entry',
    lang: 'python',
    title: 'asyncio.run 진입점',
    file: 'run_entry.py',
    code: `import asyncio

async def greet():
  print('안녕하세요')

if __name__ == '__main__':
  asyncio.run(greet())`,
    explain: {
      concept: 'asyncio.run은 비동기 세계로 들어가는 출입구예요. 일반 코드 세계에서 "비동기 방"으로 통하는 문을 열어 주는 거예요.',
      terms: [
        { t: 'asyncio.run', d: '비동기 함수 하나를 실행하고 끝나면 문을 닫아요.' },
        { t: '__name__ == __main__', d: '이 파일을 직접 실행했을 때만 아래 코드를 돌아가요.' },
        { t: 'greet()', d: '괄호를 붙이면 아직 시작 안 한 "약속"을 만들어요.' }
      ],
      why: 'async 코드는 반드시 asyncio.run 같은 진입점이 있어야 돌아가요.',
      pitfall: 'asyncio.run을 프로그램 안에서 여러 번 호출하면 에러가 나요, 한 번만 써요.'
    }
  },
  {
    id: 'pasync-gather-concurrent',
    lang: 'python',
    title: 'gather 동시 실행',
    file: 'gather_concurrent.py',
    code: `import asyncio

async def work(name, delay):
  await asyncio.sleep(delay)
  return name

async def main():
  results = await asyncio.gather(work('A', 1), work('B', 2))
  print(results)

asyncio.run(main())`,
    explain: {
      concept: 'gather는 여러 일꾼에게 "한꺼번에 출발!" 하고 신호를 보내요. 모두 끝날 때까지 기다렸다가 결과를 순서대로 모아 주는 팀장 같아요.',
      terms: [
        { t: 'asyncio.gather', d: '여러 async 함수를 동시에 출발시키고 결과 리스트를 돌려줘요.' },
        { t: 'asyncio.sleep', d: 'time.sleep과 달라, 그 동안 다른 일을 할 수 있는 "기다림"이에요.' },
        { t: 'results', d: '모든 일꾼이 돌려보낸 값이 모인 리스트예요.' }
      ],
      why: '한꺼번에 돌리면 전체 시간이 가장 오래 걸리는 하나만큼 줄어들어요.',
      pitfall: '결과 순서는 호출한 순서 그대로예요, 끝나는 순서가 섞여도 상관없어요.'
    }
  },
  {
    id: 'pasync-taskgroup-structured',
    lang: 'python',
    title: 'TaskGroup 구조화 동시성',
    file: 'taskgroup_structured.py',
    code: `import asyncio

async def task(n):
  await asyncio.sleep(n)
  return n * 2

async def main():
  async with asyncio.TaskGroup() as tg:
    t1 = tg.create_task(task(1))
    t2 = tg.create_task(task(2))
  print(t1.result(), t2.result())

asyncio.run(main())`,
    explain: {
      concept: 'TaskGroup은 여러 일을 한 팀으로 묶어 주는 울타리예요. 한 아이가 아프면 울타리 문이 닫히면서 모두 안전하게 끝나요.',
      terms: [
        { t: 'async with', d: '들어갈 때 자원을 준비하고 나올 때 자동으로 정리해 줘요.' },
        { t: 'asyncio.TaskGroup', d: '작업 여러 개를 그룹으로 묶어 안전하게 실행해요.' },
        { t: 'tg.create_task', d: '그룹 안에 새 작업 하나를 추가해요.' },
        { t: 't1.result', d: '작업이 끝난 뒤 결과를 꺼내요.' }
      ],
      why: 'gather보다 안전해서 Python 3.11 부터 권장하는 방식이에요.',
      pitfall: 'with 블록을 빠져나올 때 모든 작업이 끝나야 하고, 하나가 실패하면 나머지도 취소돼요.'
    }
  },
  {
    id: 'pasync-queue-producer-consumer',
    lang: 'python',
    title: 'Queue 생산-소비',
    file: 'queue_producer_consumer.py',
    code: `import asyncio

async def producer(q):
  for i in range(3):
    await q.put(i)
  await q.put(None)

async def consumer(q):
  while True:
    item = await q.get()
    if item is None:
      break
    print(item)

async def main():
  q = asyncio.Queue()
  await asyncio.gather(producer(q), consumer(q))

asyncio.run(main())`,
    explain: {
      concept: 'Queue는 생산자와 소비자 사이에 놓인 택배 상자 같아요. 한 쪽은 넣고 한 쪽은 꺼내요. None을 보내 "그만" 신호로 써요.',
      terms: [
        { t: 'asyncio.Queue', d: '비동기로 안전하게 데이터를 주고받는 통로예요.' },
        { t: 'q.put', d: '큐에 아이템 하나를 넣어요. 가득 차면 잠깐 기다려요.' },
        { t: 'q.get', d: '큐에서 아이템 하나를 꺼내요. 비어 있으면 잠깐 기다려요.' },
        { t: 'None', d: '여기서는 "더 이상 없어"라는 끝 신호로 쓰여요.' }
      ],
      why: '한 쪽이 너무 빠르고 한 쪽이 느려도 큐가 완충해 주어 흐름이 안정해요.',
      pitfall: 'put과 get에 await를 안 붙이면 교착에 빠질 수 있어요.'
    }
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
    print('넣음', i)

async def consumer(q):
  for _ in range(5):
    item = await q.get()
    print('꺼냄', item)

async def main():
  q = asyncio.Queue(maxsize=2)
  await asyncio.gather(producer(q), consumer(q))

asyncio.run(main())`,
    explain: {
      concept: 'maxsize는 큐의 크기를 제한하는 바구니 한계예요. 바구니가 가득 차면 생산자가 잠깐 멈춰서 소비자가 빼 갈 때까지 기다려요.',
      terms: [
        { t: 'maxsize', d: '한꺼번에 넣을 수 있는 아이템 최대 개수예요.' },
        { t: 'q.put', d: '가득 차 있으면 자동으로 기다려요, 따로 sleep 안 써도 돼요.' },
        { t: 'asyncio.Queue', d: '비동기로 안전하게 데이터를 주고받는 통로예요.' },
        { t: 'asyncio.gather', d: '생산자와 소비자를 동시에 출발시켜 서로 맞물려 돌아가게 해요.' }
      ],
      why: '생산자가 너무 빨리 쏟아내 메모리가 터지는 걸 막아 줘요.',
      pitfall: '소비자가 없으면 put에서 영원히 멈춰 있는 교착 상태가 돼요. 반드시 소비자를 함께 실행해야 해요.'
    }
  },
  {
    id: 'pasync-lock-critical',
    lang: 'python',
    title: 'asyncio.Lock 임계 구역',
    file: 'lock_critical.py',
    code: `import asyncio

async def add(balance, lock):
  async with lock:
    balance[0] += 1
  return balance[0]

async def main():
  balance = [0]
  lock = asyncio.Lock()
  await asyncio.gather(*(add(balance, lock) for _ in range(3)))
  print(balance[0])

asyncio.run(main())`,
    explain: {
      concept: 'Lock은 한 번에 한 명만 들어갈 수 있는 작은 방이에요. 공유한 자원을 동시에 만지면 꼬이는 걸 막아요.',
      terms: [
        { t: 'asyncio.Lock', d: '비동기 전용 자물쇠예요, 일반 threading.Lock과 달라요.' },
        { t: 'async with lock', d: '들어갈 때 자물쇠를 잠그고 나올 때 풀어줘요.' },
        { t: 'balance[0]', d: '공유하는 통장에 든 돈을 한 번에 한 명만 더해요.' }
      ],
      why: '코루틴이 await를 사이에 두고 여러 단계로 공유 자원을 바꿀 때, 중간에 다른 코루틴이 끼어들어 값이 꼬일 수 있어요. await 없는 단순 += 은 자동으로 안전하지만, 읽기-수정-쓰기 사이에 await가 있는 경우에는 Lock이 필요해요.',
      pitfall: 'async with를 안 쓰고 lock.acquire 후 수동 풀면 버그가 생기기 쉬워요.'
    }
  },
  {
    id: 'pasync-event-signal',
    lang: 'python',
    title: 'Event 신호 대기',
    file: 'event_signal.py',
    code: `import asyncio

async def waiter(event):
  print('기다림')
  await event.wait()
  print('출발')

async def main():
  event = asyncio.Event()
  w = asyncio.create_task(waiter(event))
  await asyncio.sleep(1)
  event.set()
  await w

asyncio.run(main())`,
    explain: {
      concept: 'Event는 파란 불처럼 "이제 출발해도 돼" 신호를 보내요. 여러 아이가 신호 올 때까지 가만히 대기해요.',
      terms: [
        { t: 'asyncio.Event', d: '단순한 on/off 신호기예요.' },
        { t: 'event.wait', d: '신호가 켜질 때까지 여기서 멈춰요.' },
        { t: 'event.set', d: '신호를 켜서 대기 중인 아이들을 모두 깨워요.' },
        { t: 'asyncio.create_task', d: '코루틴을 백그라운드 작업으로 출발시켜요.' }
      ],
      why: '여러 작업을 한 신호로 동시에 깨워 출발시키기 쉬워요.',
      pitfall: 'set을 안 해주면 wait에서 영원히 멈춰 있어요.'
    }
  },
  {
    id: 'pasync-sleep-yield',
    lang: 'python',
    title: 'asyncio.sleep 양보',
    file: 'sleep_yield.py',
    code: `import asyncio

async def slow():
  await asyncio.sleep(0.5)
  print('느')

async def fast():
  print('빠')

async def main():
  await asyncio.gather(slow(), fast())

asyncio.run(main())`,
    explain: {
      concept: 'asyncio.sleep은 그냥 쉬는 게 아니라 "지금 다른 사람한테 순서를 양보해요" 장치예요. sleep 동안 빠른 쪽이 먼저 돌아가요.',
      terms: [
        { t: 'asyncio.sleep', d: '지정한 초 동안 다른 코루틴에 순서를 넘기는 대기예요.' },
        { t: 'gather', d: '동시에 출발시키는 명령이에요.' },
        { t: 'await', d: '작업이 끝날 때까지 잠깐 멈춰 기다려요.' }
      ],
      why: 'CPU를 오래 쓰지 않으면서 기다릴 때 다른 일을 할 수 있어요.',
      pitfall: 'time.sleep을 쓰면 진짜로 멈춰 버려 다른 코루틴도 다 같이 멈춰요.'
    }
  },
  {
    id: 'pasync-create-task-bg',
    lang: 'python',
    title: 'create_task 백그라운드',
    file: 'create_task_bg.py',
    code: `import asyncio

async def tick():
  for _ in range(3):
    print('틱')
    await asyncio.sleep(0.1)

async def main():
  t = asyncio.create_task(tick())
  print('시작')
  await t
  print('종료')

asyncio.run(main())`,
    explain: {
      concept: 'create_task는 코루틴을 백그라운드에서 출발시키는 명령이에요. await 안 하고 두고두고 돌아가게 해요.',
      terms: [
        { t: 'asyncio.create_task', d: '코루틴을 작업 객체로 만들어 즉시 스케줄에 넣어요.' },
        { t: 'await t', d: '작업이 끝날 때까지 여기서 기다려 주세요.' },
        { t: 'asyncio.sleep', d: '틱 사이에 다른 코루틴에 순서를 넘기는 짧은 대기예요.' }
      ],
      why: '함수 호출만 하면 코루틴이 안 돌아가요, 작업으로 만들어야 실행해요.',
      pitfall: '작업을 await나 gather로 잡지 않으면 완료를 못 보고 경고가 떠요.'
    }
  },
  {
    id: 'pasync-timeout-guard',
    lang: 'python',
    title: 'timeout 보호',
    file: 'timeout_guard.py',
    code: `import asyncio

async def slow():
  await asyncio.sleep(10)
  return '완료'

async def main():
  try:
    result = await asyncio.wait_for(slow(), timeout=0.1)
  except asyncio.TimeoutError:
    print('시간 초과')

asyncio.run(main())`,
    explain: {
      concept: 'wait_for은 "이 일은 1초까지만 기다릴 거야"라는 알람시계예요. 시간이 지나면 자동으로 취소하고 빠져나와요.',
      terms: [
        { t: 'asyncio.wait_for', d: '작업과 시간 한계를 짝지어 줘요.' },
        { t: 'timeout', d: '최대 기다릴 초 수예요.' },
        { t: 'asyncio.TimeoutError', d: '시간이 지나면 이 에러로 알려줘요.' }
      ],
      why: '외부 API가 영원히 걸리는 것을 막아 줘요.',
      pitfall: 'timeout이 0에 가까우면 정상 작업도 취소될 수 있어요.'
    }
  },
  {
    id: 'pasync-to-thread-blocking',
    lang: 'python',
    title: 'to_thread 블로킹 회피',
    file: 'to_thread_blocking.py',
    code: `import asyncio
import time

def blocking():
  time.sleep(2)
  return '완료'

async def main():
  result = await asyncio.to_thread(blocking)
  print(result)

asyncio.run(main())`,
    explain: {
      concept: 'to_thread는 느리고 멈추는 일을 "옆 방"으로 보내 비동기 세계가 멈추지 않게 해줘요. 멈추는 함수를 비동기로 포장해요.',
      terms: [
        { t: 'asyncio.to_thread', d: '일반 함수를 별도 스레드로 보내 비동기로 기다려요.' },
        { t: 'def blocking', d: 'async가 아닌 일반 함수, 안에 time.sleep이 있어도 돼요.' },
        { t: 'time.sleep', d: '진짜로 멈추는 일반 기다림이에요, 스레드 안에서는 안전해요.' }
      ],
      why: '오래 걸리는 동기 함수를 그냥 부르면 이벤트 루프가 얼어붙어요.',
      pitfall: 'CPU 많이 쓰는 일은 스레드로 보내봤자 GIL 때문에 큰 효과 없어요.'
    }
  },
  {
    id: 'pasync-threading-cpu',
    lang: 'python',
    title: 'Threading 동시 실행',
    file: 'threading_cpu.py',
    code: `import time
from threading import Thread

def download(name):
  print(name, '시작')
  time.sleep(1)
  print(name, '완료')

t1 = Thread(target=download, args=('파일A',))
t2 = Thread(target=download, args=('파일B',))
t1.start()
t2.start()
t1.join()
t2.join()`,
    explain: {
      concept: 'Threading은 한 프로그램 안에서 여러 일꾼이 동시에 일하는 것처럼 보이게 해요. OS 스레드를 여러 개 만들어 동시에 실행하는 것처럼 보이게 해요.',
      terms: [
        { t: 'Thread', d: '별도의 실행 흐름 하나를 만들어요.' },
        { t: 'target', d: '이 스레드가 돌릴 함수를 가르쳐요.' },
        { t: 'args', d: '함수에 넘겨 줄 인자를 튜플로 묶어요.' },
        { t: 't.join', d: '이 스레드가 끝날 때까지 주 스레드가 기다려요.' }
      ],
      why: '파일 읽기·네트워크 요청처럼 기다리는 시간이 있는 입출력 작업을 동시에 돌려 전체 시간을 줄여요.',
      pitfall: 'GIL 때문에 CPU를 많이 쓰는 계산에는 큰 속도 향상이 없어요.'
    }
  },
  {
    id: 'pasync-multiprocessing-cpu',
    lang: 'python',
    title: 'Multiprocessing CPU 병렬',
    file: 'multiprocessing_cpu.py',
    code: `from multiprocessing import Process

def square(n):
  print(n * n)

if __name__ == '__main__':
  ps = []
  for n in range(4):
    p = Process(target=square, args=(n,))
    p.start()
    ps.append(p)
  for p in ps:
    p.join()`,
    explain: {
      concept: 'Multiprocessing은 스레드가 아니라 별도의 "프로세스"를 여러 개 띄워 CPU 코어를 다 쓰는 방식이에요. 별도의 공간에서 일해요.',
      terms: [
        { t: 'Process', d: '완전히 독립된 프로세스를 만들어요.' },
        { t: 'target', d: '이 프로세스가 실행할 함수예요.' },
        { t: 'p.start', d: '자식 프로세스를 출발시켜요.' },
        { t: 'p.join', d: '자식 프로세스가 끝날 때까지 기다려요.' }
      ],
      why: 'GIL의 구속 없이 CPU 코어를 다 써서 빠르게 계산할 수 있어요.',
      pitfall: 'Windows에서는 반드시 __main__ 가드 없으면 무한 생성에 빠져요.'
    }
  },
  {
    id: 'pasync-pool-map',
    lang: 'python',
    title: 'Pool.map 자동 분배',
    file: 'pool_map.py',
    code: `from multiprocessing import Pool

def double(n):
  return n * 2

if __name__ == '__main__':
  with Pool(processes=2) as pool:
    result = pool.map(double, range(5))
  print(result)`,
    explain: {
      concept: 'Pool.map은 여러 일꾼에게 리스트를 한 개씩 나눠 주는 자동 분배 기계예요. 일꾼 수만 정하면 알아서 골고루 나눠요.',
      terms: [
        { t: 'Pool', d: '고정 수의 프로세스를 묶어 둔 일꾼 풀이에요.' },
        { t: 'pool.map', d: '리스트 각 원소에 함수를 적용해 결과를 모아 줘요.' },
        { t: 'processes', d: '얼마나 많은 일꾼을 둘지 정해요.' }
      ],
      why: '직접 Process 만들기보다 쉽고 자원 재사용도 돼 빨라요.',
      pitfall: '함수가 람다식이거나 글로벌 상태에 의존하면 프로세스 간 넘기기 어려워요.'
    }
  },
  {
    id: 'pasync-as-completed',
    lang: 'python',
    title: 'as_completed 순서 무관',
    file: 'as_completed.py',
    code: `import asyncio

async def job(n):
  await asyncio.sleep(n)
  return n

async def main():
  tasks = [asyncio.create_task(job(i)) for i in range(3)]
  for t in asyncio.as_completed(tasks):
    r = await t
    print('완료', r)

asyncio.run(main())`,
    explain: {
      concept: 'as_completed는 "끝나는 대로 바로 알아줘" 모드예요. 순서 상관 없이 먼저 끝난 일부터 결과를 보여줘요.',
      terms: [
        { t: 'asyncio.as_completed', d: '완료 순서대로 작업을 넘기는 이터레이터예요.' },
        { t: 'create_task', d: '미리 작업을 만들어 두어야 완료를 지켜 볼 수 있어요.' },
        { t: 'await t', d: '각 작업이 끝날 때까지 기다려 결과를 받아요.' }
      ],
      why: '빠른 결과부터 보여 주고 싶을 때 써요.',
      pitfall: 'gather는 순서대로, as_completed는 완료 순서대로라 차이가 커요.'
    }
  },
  {
    id: 'pasync-cancel-task',
    lang: 'python',
    title: '작업 취소',
    file: 'cancel_task.py',
    code: `import asyncio

async def loop():
  while True:
    print('돌아')
    await asyncio.sleep(0.5)

async def main():
  t = asyncio.create_task(loop())
  await asyncio.sleep(1.5)
  t.cancel()
  try:
    await t
  except asyncio.CancelledError:
    print('취소됨')

asyncio.run(main())`,
    explain: {
      concept: 'cancel은 "그 일 그만 해"라는 정지 신호예요. 작업 안에서 CancelledError가 나와 안전하게 멈춰요.',
      terms: [
        { t: 't.cancel', d: '작업에 취소 요청을 보내요. 즉시 멈추는 건 아니에요.' },
        { t: 'CancelledError', d: '취소 신호가 작업 안에서 발생하는 에러예요.' },
        { t: 'while True', d: '영원히 돌라는 무한 루프예요, 외부에서 멈춰야 해요.' }
      ],
      why: '무한 루프나 오래 걸리는 작업을 안전히 그만하고 싶을 때 써요.',
      pitfall: 'CancelledError를 잡아서 무시하면 취소가 안 통하는 버그가 생겨요.'
    }
  },
  {
    id: 'pasync-sleep-0-yield',
    lang: 'python',
    title: 'sleep(0) 순서 양보',
    file: 'sleep_zero_yield.py',
    code: `import asyncio

async def step(name):
  print(name, '시작')
  await asyncio.sleep(0)
  print(name, '이어')

async def main():
  await asyncio.gather(step('A'), step('B'))

asyncio.run(main())`,
    explain: {
      concept: 'sleep(0)은 실제로 자지 않고 "이제 다른 사람 차례"로 순서를 양보하는 마술 같은 코드예요.',
      terms: [
        { t: 'asyncio.sleep(0)', d: '시간은 0이지만 다른 코루틴에 순서를 넘기는 지점이에요.' },
        { t: 'await', d: '양보 지점에서 다른 코루틴에게 순서를 넘겨요.' },
        { t: 'gather', d: '두 코루틴을 동시에 출발시키는 명령이에요.' }
      ],
      why: '코루틴이 너무 오래 CPU를 잡고 있으면 다른 코루틴이 굶어 죽는 걸 막아요.',
      pitfall: '양보 지점이 없으면 같은 코루틴이 끝까지 돌아버려 다른 작업이 못 돌아요.'
    }
  },
  {
    id: 'pasync-future-explicit',
    lang: 'python',
    title: 'Future 명시적 결과',
    file: 'future_explicit.py',
    code: `import asyncio

async def main():
  fut = asyncio.Future()
  fut.set_result('값')
  print(await fut)

asyncio.run(main())`,
    explain: {
      concept: 'Future는 "나중에 결과 들어올 자리"만 만들어 두는 빈 봉투예요. 누가 결과를 채워 주면 그때 비로소 열어볼 수 있어요.',
      terms: [
        { t: 'asyncio.Future', d: '결과 자리를 미리 만들어 두는 객체예요, 보통 직접 안 써요.' },
        { t: 'set_result', d: '빈 봉투에 결과를 채워 넣어요.' },
        { t: 'await fut', d: '결과가 채워지면 그 값을 꺼내요.' }
      ],
      why: '직접 다루는 일은 드물지만, 콜백과 비동기 세계를 이어 줄 때 필요해요.',
      pitfall: '한 번 결과를 정하면 다시 바꿀 수 없어요, 두 번 set_result하면 에러나요.'
    }
  },
  {
    id: 'pasync-semaphore-limit',
    lang: 'python',
    title: 'Semaphore 동시 제한',
    file: 'semaphore_limit.py',
    code: `import asyncio

async def fetch(i, sem):
  async with sem:
    print('시작', i)
    await asyncio.sleep(0.1)

async def main():
  sem = asyncio.Semaphore(2)
  await asyncio.gather(*(fetch(i, sem) for i in range(6)))

asyncio.run(main())`,
    explain: {
      concept: 'Semaphore는 동시에 들어갈 수 있는 자리 수를 정하는 표 뽑기 기계예요. 자리가 2개면 2명만 들어가고 나머지는 밖에서 줄 서요.',
      terms: [
        { t: 'asyncio.Semaphore', d: '동시에 허용할 개수를 정하는 제한 장치예요.' },
        { t: 'async with sem', d: '자리가 나야 들어가고 나올 때 자리를 하나 돌려줘요.' },
        { t: 'gather', d: '여러 작업을 동시에 출발시키지만 sem이 속도 조절해 줘요.' }
      ],
      why: '외부 API를 한꺼번에 너무 많이 부르는 걸 막아 안전하게 해요.',
      pitfall: '한계를 너무 낮게 하면 속도가 느려지고, 너무 높으면 제한이 의미 없어요.'
    }
  }
];
