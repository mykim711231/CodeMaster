# Async

## Official Documentation
- [asyncio — Asynchronous I/O](https://docs.python.org/3/library/asyncio.html)

## 핵심 개념
> `asyncio`는 단일 스레드에서 협력적 멀티태스킹을 구현하는 비동기 I/O 라이브러리다. `async`/`await` 문법으로 코루틴을 정의하고, `asyncio.run()`으로 이벤트 루프를 실행한다. `gather()`와 `TaskGroup`(3.11+)으로 여러 코루틴을 동시에 실행하며, `asyncio.Queue`로 생산자-소비자 패턴을 구현한다. CPU 바운드 작업은 `Threading`(GIL 우회용 I/O)이나 `Multiprocessing`(병렬 연산)으로 처리하고, 공유 자원 접근은 `Lock`으로 동기화한다.

## 학습 목표
- `async`/`await`로 비동기 함수를 작성하고 `asyncio.run()`으로 실행할 수 있다.
- `gather()`와 `TaskGroup`으로 여러 비동기 작업을 동시에 처리할 수 있다.
- `asyncio.Queue`를 활용한 생산자-소비자 패턴을 구현할 수 있다.
- `Threading`, `Multiprocessing`, `Lock`으로 동시성 이슈를 해결할 수 있다.

## 예제 코드
```python
import asyncio
import time
import threading
import multiprocessing
from typing import AsyncIterator

# --- async/await + gather ---
async def fetch(id: int, delay: float) -> str:
    await asyncio.sleep(delay)
    return f"Data-{id}"

async def gather_example():
    results = await asyncio.gather(
        fetch(1, 1.0),
        fetch(2, 0.5),
        fetch(3, 0.2),
    )
    print(f"gather results: {results}")

# --- TaskGroup (Python 3.11+) ---
async def taskgroup_example():
    async with asyncio.TaskGroup() as tg:
        t1 = tg.create_task(fetch(10, 0.3))
        t2 = tg.create_task(fetch(11, 0.1))
    print(f"TaskGroup results: {t1.result()}, {t2.result()}")

# --- Queue (producer-consumer) ---
async def producer(q: asyncio.Queue[int], n: int):
    for i in range(n):
        await asyncio.sleep(0.1)
        await q.put(i)
        print(f"  Produced: {i}")

async def consumer(q: asyncio.Queue[int], name: str):
    while True:
        item = await q.get()
        if item is None:
            q.task_done()
            break
        print(f"  [{name}] Consumed: {item}")
        await asyncio.sleep(0.2)
        q.task_done()

async def queue_example():
    q: asyncio.Queue[int] = asyncio.Queue()
    async with asyncio.TaskGroup() as tg:
        tg.create_task(producer(q, 5))
        tg.create_task(consumer(q, "A"))
        tg.create_task(consumer(q, "B"))
        tg.create_task(asyncio.sleep(1.1))
        for _ in range(2):
            await q.put(None)

# --- Threading ---
lock = threading.Lock()
shared_counter = 0

def thread_task():
    global shared_counter
    with lock:
        local = shared_counter
        time.sleep(0.01)
        shared_counter = local + 1

def threading_example():
    threads = [threading.Thread(target=thread_task) for _ in range(10)]
    for t in threads:
        t.start()
    for t in threads:
        t.join()
    print(f"Threading counter: {shared_counter}")

# --- Multiprocessing ---
def cpu_task(n: int) -> int:
    return sum(i * i for i in range(n))

def multiprocessing_example():
    with multiprocessing.Pool(processes=4) as pool:
        results = pool.map(cpu_task, [10_000, 20_000, 30_000])
    print(f"Multiprocessing results: {results}")

# --- 메인 ---
async def main():
    await gather_example()
    await taskgroup_example()
    await queue_example()
    threading_example()
    multiprocessing_example()

if __name__ == "__main__":
    asyncio.run(main())
```

## 주요 패턴
- `asyncio.gather(*coros)`: 여러 코루틴을 동시에 실행하고 모든 결과를 리스트로 반환한다.
- `TaskGroup`: 예외 발생 시 나머지 태스크를 자동 취소하여 리소스 누수를 방지한다.
- `asyncio.Queue`: `put()`/`get()`이 모두 awaitable이므로 논블로킹 생산자-소비자 구현이 가능하다.
- Threading + Lock: I/O 바운드 작업에 유용하며 `threading.Lock()`으로 경쟁 상태를 방지한다.
- Multiprocessing Pool: CPU 바운드 병렬 작업에 적합하며 GIL 제약 없이 멀티코어를 활용한다.

## 주의사항
- `async` 함수 내에서 `time.sleep()` 대신 `await asyncio.sleep()`을 사용해야 이벤트 루프가 블로킹되지 않는다.
- `asyncio.run()`으로 생성된 이벤트 루프는 모든 태스크 완료 후 종료되며, 중첩 호출할 수 없다.
- `threading.Lock()`은 코루틴과 호환되지 않으므로 비동기 컨텍스트에서는 `asyncio.Lock()`을 사용한다.
- Multiprocessing에서 공유 객체는 pickle 직렬화 가능해야 하며, 람다나 클로저 전달에 주의한다.
- `TaskGroup` 사용 시 `tg.create_task()`로 생성한 태스크만 취소 보호를 받는다.
