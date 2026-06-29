# Python Language Basics

## Official Documentation
- [The Python Tutorial](https://docs.python.org/3/tutorial/)

## 핵심 개념
> Python의 핵심 문법 요소들을 다룬다. `def`로 함수를 정의하고, `class`로 객체지향 설계를 하며, `@dataclass`로 데이터 컨테이너를 간결하게 만든다. `typing` 모듈로 타입 힌트를 제공하고, list/dict/set comprehension으로 컬렉션을 선언적으로 생성한다. `with` 문은 리소스 관리를 자동화하며, decorator는 함수/클래스의 동작을 재사용 가능하게 감싼다.

## 학습 목표
- `def`와 `class`로 기본적인 함수와 클래스를 정의할 수 있다.
- `dataclass`로 보일러플레이트 없는 데이터 클래스를 만들 수 있다.
- Comprehension으로 컬렉션을 간결하게 생성하고 `with`로 컨텍스트 관리자를 활용할 수 있다.
- Decorator를 직접 작성하고 `typing`으로 타입 힌트를 적용할 수 있다.

## 예제 코드
```python
from dataclasses import dataclass
from typing import TypeVar, Generic
from functools import wraps
from contextlib import contextmanager

# --- typing ---
T = TypeVar("T")

class Stack(Generic[T]):
    def __init__(self) -> None:
        self._items: list[T] = []

    def push(self, item: T) -> None:
        self._items.append(item)

    def pop(self) -> T:
        return self._items.pop()

# --- dataclass ---
@dataclass(frozen=True)
class Point:
    x: float
    y: float

    def distance_to_origin(self) -> float:
        return (self.x ** 2 + self.y ** 2) ** 0.5

# --- decorator ---
def log_call(func):
    @wraps(func)
    def wrapper(*args, **kwargs):
        print(f"[LOG] calling {func.__name__} with args={args}")
        result = func(*args, **kwargs)
        print(f"[LOG] {func.__name__} returned {result}")
        return result
    return wrapper

@log_call
def add(a: int, b: int) -> int:
    return a + b

# --- comprehension ---
squares = [x ** 2 for x in range(1, 6)]
evens = {x for x in range(10) if x % 2 == 0}
square_map = {x: x ** 2 for x in range(1, 6)}

# --- with ---
@contextmanager
def open_file(path: str, mode: str):
    f = open(path, mode)
    try:
        yield f
    finally:
        f.close()

with open_file("example.txt", "w") as f:
    f.write("Hello, Python!")

# --- 실행 ---
print(add(3, 5))
print(squares)
print(evens)
print(square_map)
print(Point(3.0, 4.0).distance_to_origin())
```

## 주요 패턴
- `@dataclass`: `__init__`, `__repr__`, `__eq__` 등을 자동 생성하여 데이터 모델링을 단순화한다.
- Comprehension: `[expr for item in iterable if cond]` 형태로 loop보다 간결하고 빠르다.
- `with` + contextmanager: `@contextmanager` 또는 `__enter__`/`__exit__`로 파일, 락 등의 자원 해제를 보장한다.
- Decorator 체이닝: `@wraps(func)`로 메타데이터를 보존하며 여러 decorator를 중첩할 수 있다.
- Generic typing: `TypeVar`와 `Generic`을 조합해 타입 안전한 제네릭 컨테이너를 정의한다.

## 주의사항
- `def` 내에서 mutable 객체(예: `[]`)를 기본 인자로 사용하면 호출 간 상태가 공유된다.
- Decorator를 사용할 때 `@wraps`를 생략하면 원본 함수의 `__name__`, `__doc__`이 손실된다.
- Dataclass에서 `frozen=True`로 설정하지 않으면 가변 필드가 예상치 못하게 변경될 수 있다.
- Comprehension 안에서 부작용(side effect)이 있는 함수를 호출하는 것은 지양한다.
- `typing`은 런타임에 강제되지 않으므로, 정적 분석 도구(mypy)와 함께 사용해야 효과적이다.
