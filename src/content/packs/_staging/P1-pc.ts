import type { Snippet } from '../../types';

export const pythonCore: Snippet[] = [
  {
    id: 'pc-def-basic',
    lang: 'python',
    title: '함수 정의',
    file: 'greet.py',
    code: `def greet(name: str) -> str:
  return 'hello, ' + name


msg = greet('jimin')
print(msg)`,
    explain: {
      concept: '함수(def)는 코드를 묶어 이름을 붙인 상자예요. 한 번 만들어두면 필요할 때마다 꺼내 쓸 수 있어요.',
      terms: [
        { t: 'def', d: '함수를 새로 만들 때 쓰는 예약어예요.' },
        { t: 'name: str', d: '입력값 name이 글자(str) 타입이라는 표시예요.' },
        { t: '-> str', d: '이 함수가 글자(str)를 돌려준다는 표시예요.' },
        { t: 'return', d: '함수가 결과값을 밖으로 내보낼 때 써요.' },
      ],
      why: '같은 코드를 여러 번 안 써도 되니까 코드가 짧아지고 고치기 쉬워져요.',
      pitfall: 'return을 빼먹으면 함수가 None을 돌려줘요.',
    },
  },
  {
    id: 'pc-default-param',
    lang: 'python',
    title: '기본값 매개변수',
    file: 'order.py',
    code: `def order(item: str, qty: int = 1) -> str:
  return item + ' x' + str(qty)


print(order('coffee'))
print(order('tea', 3))`,
    explain: {
      concept: '매개변수에 기본값을 주면, 값을 안 넣었을 때 그 기본값을 알아서 써요. 마치 식당에서 사이즈 안 말하면 기본 사이즈가 오는 것과 같아요.',
      terms: [
        { t: 'qty: int = 1', d: 'qty를 안 받으면 1을 쓰겠다는 뜻이에요.' },
        { t: 'str(qty)', d: '숫자를 글자로 바꿔서 이어붙이는 함수예요.' },
        { t: "order('tea', 3)", d: '기본값을 안 쓰고 직접 값을 넣어 부르는 예예요.' },
      ],
      why: '자주 쓰는 값을 매번 안 넘겨도 돼서 편해요.',
      pitfall: '기본값 매개변수는 기본값 없는 매개변수 뒤에 와야 해요.',
    },
  },
  {
    id: 'pc-args',
    lang: 'python',
    title: '*args 가변 인수',
    file: 'total.py',
    code: `def total(*nums: int) -> int:
  return sum(nums)


print(total(1, 2, 3))
print(total(10, 20))`,
    explain: {
      concept: '*args는 몇 개가 될지 모르는 여러 값을 한 번에 받을 때 써요. 상자에 물건을 몇 개든 담을 수 있는 것과 같아요.',
      terms: [
        { t: '*nums', d: '여러 값을 튜플(묶음)로 모아서 받아요.' },
        { t: 'sum(nums)', d: '묶음 안의 숫자들을 모두 더해요.' },
        { t: '-> int', d: '정수 하나를 돌려준다는 표시예요.' },
      ],
      why: '개수를 미리 정하지 않아도 값을 받을 수 있어요.',
      pitfall: '*args로 모인 값은 튜플이라 고칠 수 없어요.',
    },
  },
  {
    id: 'pc-kwargs',
    lang: 'python',
    title: '**kwargs 키워드 가변 인수',
    file: 'profile.py',
    code: `def profile(name: str, **info: str) -> None:
  print(name)
  for k, v in info.items():
    print(k, v)


profile('jimin', role='dev', city='seoul')`,
    explain: {
      concept: '**kwargs는 이름표(키)와 값을 여러 개 받을 때 써요. 사전(딕셔너리)처럼 키-값 쌍으로 모아져요.',
      terms: [
        { t: '**info', d: '키=값 형태로 여러 개를 받아 딕셔너리로 모아요.' },
        { t: 'info.items()', d: '딕셔너리의 키와 값을 짝지어 꺼내요.' },
        { t: "role='dev'", d: "키=값 형태로 인수를 넘기는 호출이에요. 값에는 따옴표를 써야 해요." },
      ],
      why: '어떤 정보가 들어올지 모를 때 유연하게 받을 수 있어요.',
      pitfall: '딕셔너리를 **d로 넘길 때 키가 문자열이 아니면 TypeError가 나요.',
    },
  },
  {
    id: 'pc-class-basic',
    lang: 'python',
    title: '클래스 정의',
    file: 'dog.py',
    code: `class Dog:
  def __init__(self, name: str) -> None:
    self.name = name

  def bark(self) -> str:
    return self.name + '! woof'


d = Dog('bori')
print(d.bark())`,
    explain: {
      concept: '클래스(class)는 붕어빵 틀 같아요. 틀에서 찍어낸 각각의 붕어빵을 인스턴스(객체)라고 불러요.',
      terms: [
        { t: 'class', d: '새로운 타입(틀)을 만드는 예약어예요.' },
        { t: 'bark(self)', d: '인스턴스가 할 수 있는 행동(메서드)이에요.' },
        { t: 'self', d: '자기 자신(인스턴스)을 가리키는 단어예요.' },
        { t: 'self.name', d: '이 인스턴스에 name값을 저장하고 불러와요.' },
      ],
      why: '데이터와 행동을 하나로 묶어 관리하기 쉬워져요.',
      pitfall: '메서드의 첫 매개변수는 반드시 self여야 해요.',
    },
  },
  {
    id: 'pc-init-init',
    lang: 'python',
    title: '__init__ 초기화',
    file: 'account.py',
    code: `class Account:
  def __init__(self, owner: str, balance: int = 0) -> None:
    self.owner = owner
    self.balance = balance


a = Account('jimin', 1000)
b = Account('soyi')
print(a.owner, a.balance)
print(b.owner, b.balance)`,
    explain: {
      concept: '__init__은 인스턴스가 태어날 때 처음 설정해주는 준비 단계예요. 새 전화기를 샀을 때 처음 한 번만 세팅하는 것과 같아요.',
      terms: [
        { t: '__init__', d: '인스턴스 생성 시 자동 실행되는 초기화 함수예요.' },
        { t: 'balance: int = 0', d: '잔액을 안 주면 0으로 시작하는 기본값 매개변수예요.' },
        { t: 'a.owner', d: '인스턴스 a의 owner 속성 값을 꺼내요.' },
      ],
      why: '객체가 만들어지자마자 올바른 상태를 갖게 해요.',
      pitfall: '__init__은 값을 돌려주면 안 돼요 (반환 타입은 None이어야 해요).',
    },
  },
  {
    id: 'pc-classmethod',
    lang: 'python',
    title: '@classmethod',
    file: 'book.py',
    code: `class Book:
  count = 0

  @classmethod
  def make(cls, title: str) -> 'Book':
    cls.count += 1
    return cls(title)

  def __init__(self, title: str) -> None:
    self.title = title


b = Book.make('python')
print(Book.count)`,
    explain: {
      concept: '@classmethod는 인스턴스가 아니라 클래스 자체에 달린 함수예요. 붕어빵 틀 자체에서 무언가를 하는 것과 같아요.',
      terms: [
        { t: '@classmethod', d: '이 함수를 클래스 단위 함수로 만드는 꾸밈표(decorator)예요.' },
        { t: 'cls', d: 'self 대신 클래스 자신을 가리키는 단어예요.' },
        { t: 'count = 0', d: '모든 인스턴스가 공유하는 클래스 변수예요.' },
      ],
      why: '인스턴스 없이도 클래스 차원의 일을 할 수 있어요.',
      pitfall: '첫 매개변수는 cls여야 해요.',
    },
  },
  {
    id: 'pc-dataclass',
    lang: 'python',
    title: '@dataclass',
    file: 'point.py',
    code: `from dataclasses import dataclass


@dataclass
class Point:
  x: int
  y: int = 0


p = Point(3, 4)
print(p)`,
    explain: {
      concept: '@dataclass는 데이터를 담는 클래스를 짧게 만들어주는 도구예요. __init__을 알아서 만들어줘요.',
      terms: [
        { t: '@dataclass', d: '초기화 함수 등을 자동으로 만들어주는 꾸밈표예요.' },
        { t: 'x: int', d: '필드(데이터 칸) x는 정수예요.' },
        { t: 'y: int = 0', d: 'y는 안 주면 0이 되는 필드예요.' },
      ],
      why: '보일러플레이트(반복 코드)를 줄여줘요.',
      pitfall: '기본값 있는 필드는 기본값 없는 필드 뒤에 와야 해요.',
    },
  },
  {
    id: 'pc-dataclass-method',
    lang: 'python',
    title: '@dataclass 메서드',
    file: 'rect.py',
    code: `from dataclasses import dataclass


@dataclass
class Rect:
  w: int
  h: int

  def area(self) -> int:
    return self.w * self.h


r = Rect(5, 3)
print(r.area())`,
    explain: {
      concept: '@dataclass에도 일반 클래스처럼 메서드를 넣을 수 있어요. 데이터만 담는 게 아니라 행동도 함께 쓸 수 있어요.',
      terms: [
        { t: 'def area(self)', d: '이 인스턴스의 넓이를 구하는 함수예요.' },
        { t: 'self.w', d: '이 사각형의 가로 길이를 가져와요.' },
        { t: '@dataclass', d: '초기화 함수 등을 자동으로 만들어주는 꾸밈표예요.' },
      ],
      why: '데이터와 관련된 계산을 데이터 옆에 두어 깔끔해요.',
    },
  },
  {
    id: 'pc-type-list',
    lang: 'python',
    title: 'list 타입 힌트',
    file: 'nums.py',
    code: `def first(nums: list[int]) -> int:
  if not nums:
    return 0
  return nums[0]


print(first([10, 20, 30]))`,
    explain: {
      concept: 'list[int]는 정수만 담긴 리스트(줄 세운 상자)를 뜻해요. 함수가 어떤 값을 받는지 한눈에 알 수 있어요.',
      terms: [
        { t: 'list[int]', d: '정수를 여러 개 담는 리스트 타입이에요.' },
        { t: '-> int', d: '결과로 정수 하나를 돌려줘요.' },
        { t: 'nums[0]', d: '리스트의 첫 번째 값을 가져와요.' },
      ],
      why: '다른 사람이 코드를 읽을 때 어떤 값이 들어오는지 알 수 있어요.',
      pitfall: '빈 리스트일 수 있으니 항상 검사해야 해요.',
    },
  },
  {
    id: 'pc-type-dict',
    lang: 'python',
    title: 'dict 타입 힌트',
    file: 'scores.py',
    code: `def top(scores: dict[str, int]) -> str:
  best = max(scores, key=scores.get)
  return best


print(top({'jimin': 90, 'soyi': 95}))`,
    explain: {
      concept: 'dict[str, int]는 이름표(문자열)로 숫자를 찾는 사전 같은 자료구조예요. 키로 값을 빠르게 찾을 수 있어요.',
      terms: [
        { t: 'dict[str, int]', d: '키는 문자열, 값은 정수인 사전 타입이에요.' },
        { t: 'max(scores, key=scores.get)', d: '값이 가장 큰 키를 찾아요.' },
        { t: 'scores.get', d: '키로 값을 꺼내는 함수예요.' },
      ],
      why: '키-값 구조로 의미 있는 데이터를 표현하기 쉬워요.',
    },
  },
  {
    id: 'pc-optional',
    lang: 'python',
    title: 'Optional 타입',
    file: 'find.py',
    code: `from typing import Optional


def find(items: list[int], target: int) -> Optional[int]:
  for i, v in enumerate(items):
    if v == target:
      return i
  return None


print(find([1, 2, 3], 2))`,
    explain: {
      concept: 'Optional[int]는 값이 있거나 없을(None) 수 있다는 뜻이에요. 빈 칸이 될 수도 있는 상자라고 생각해요.',
      terms: [
        { t: 'Optional[int]', d: '정수이거나 None일 수 있는 타입이에요.' },
        { t: 'None', d: '값이 없다는 뜻의 특별한 값이에요.' },
        { t: 'enumerate', d: '리스트에서 위치(인덱스)와 값을 같이 꺼내요.' },
      ],
      why: '찾지 못할 수도 있는 상황을 명확히 표현해요.',
      pitfall: 'Optional 결과를 쓸 때는 None인지 먼저 확인해야 해요.',
    },
  },
  {
    id: 'pc-list-comp',
    lang: 'python',
    title: '리스트 컴프리헨션',
    file: 'squares.py',
    code: `nums = [1, 2, 3, 4, 5]
squares = [n * n for n in nums]
print(squares)`,
    explain: {
      concept: '리스트 컴프리헨션은 한 줄로 새 리스트를 만드는 짧은 문법이에요. for문을 줄여 쓰는 간단한 표현이라 생각해요.',
      terms: [
        { t: '[... for n in nums]', d: 'nums에서 하나씩 꺼내 새 값을 모아 리스트를 만들어요.' },
        { t: 'n * n', d: '각 값에 적용할 계산이에요.' },
        { t: 'squares', d: '새로 만들어진 결과 리스트를 담는 변수예요.' },
      ],
      why: '짧고 읽기 쉬운 코드로 리스트를 만들 수 있어요.',
      pitfall: '너무 복잡하게 한 줄에 몰아넣으면 오히려 읽기 어려워요.',
    },
  },
  {
    id: 'pc-list-comp-if',
    lang: 'python',
    title: '컴프리헨션 조건',
    file: 'evens.py',
    code: `nums = [1, 2, 3, 4, 5, 6]
evens = [n for n in nums if n % 2 == 0]
print(evens)`,
    explain: {
      concept: '컴프리헨션 끝에 if를 붙이면 조건에 맞는 값만 골라 새 리스트를 만들어요. 필터로 걸러내는 것과 같아요.',
      terms: [
        { t: 'if n % 2 == 0', d: '짝수인 값만 남기라는 조건이에요.' },
        { t: 'n % 2', d: 'n을 2로 나눈 나머지예요.' },
        { t: 'for n in nums', d: 'nums에서 하나씩 값을 꺼내 반복해요.' },
      ],
      why: '반복+조건을 한 줄로 깔끔하게 표현해요.',
    },
  },
  {
    id: 'pc-dict-comp',
    lang: 'python',
    title: '딕셔너리 컴프리헨션',
    file: 'pairs.py',
    code: `names = ['jimin', 'soyi', 'tae']
pairs = {name: len(name) for name in names}
print(pairs)`,
    explain: {
      concept: '딕셔너리 컴프리헨션은 한 줄로 키-값 쌍을 만드는 문법이에요. 리스트 컴프리헨션의 사전 버전이라 생각해요.',
      terms: [
        { t: '{name: len(name) ...}', d: '키는 name, 값은 그 길이인 사전을 만들어요.' },
        { t: 'len(name)', d: '이름의 글자 수를 세는 함수예요.' },
        { t: 'names', d: '반복할 원본 리스트예요.' },
      ],
      why: '키-값 매핑을 짧고 명확하게 만들 수 있어요.',
    },
  },
  {
    id: 'pc-with-open',
    lang: 'python',
    title: 'with 파일 열기',
    file: 'reader.py',
    code: `import io


def count_lines(fileobj: io.IOBase) -> int:
  return sum(1 for _ in fileobj)


# io.StringIO로 메모리 안에 가짜 파일을 만들어 테스트해요
sample = io.StringIO('line1\nline2\nline3\n')
print(count_lines(sample))

# 실제 파일을 쓸 때는 아래처럼 open을 사용해요
# with open('note.txt', encoding='utf-8') as f:
#     print(count_lines(f))`,
    explain: {
      concept: 'with문은 파일을 쓰고 나서 자동으로 닫아주는 안전장치예요. 냉장고 문을 열면 알아서 닫히는 것과 같아요.',
      terms: [
        { t: 'with', d: '끝나면 자동으로 정리(close)해주는 문법이에요.' },
        { t: 'open(path)', d: '경로의 파일을 여는 함수예요.' },
        { t: 'as f', d: '열린 파일을 f라는 이름으로 써요.' },
        { t: 'encoding', d: '글자를 어떻게 읽을지 정하는 옵션이에요.' },
      ],
      why: '파일을 닫지 않는 실수를 막아줘요.',
      pitfall: 'encoding을 안 주면 운영체제마다 글자가 깨질 수 있어요.',
    },
  },
  {
    id: 'pc-with-context',
    lang: 'python',
    title: '커스텀 컨텍스트 매니저',
    file: 'timer.py',
    code: `class Timer:
  def __enter__(self):
    return self

  def __exit__(self, *exc):
    print('done')


with Timer():
  print('working')`,
    explain: {
      concept: '__enter__와 __exit__을 정의하면 with문에서 쓸 수 있는 객체를 만들 수 있어요. 시작과 끝에 할 일을 정해두는 거예요.',
      terms: [
        { t: '__enter__', d: 'with 블록에 들어갈 때 실행되는 함수예요.' },
        { t: '__exit__', d: 'with 블록이 끝날 때 실행되는 함수예요.' },
        { t: '*exc', d: '에러 정보를 모아 받는 매개변수예요.' },
      ],
      why: '시작/끝 처리를 한 곳에 묶어 안전하게 관리해요.',
    },
  },
  {
    id: 'pc-decorator-basic',
    lang: 'python',
    title: '데코레이터',
    file: 'log.py',
    code: `def log(fn):
  def wrapper(*a, **k):
    print('call', fn.__name__)
    return fn(*a, **k)
  return wrapper


@log
def hi(name: str) -> str:
  return 'hi ' + name


print(hi('jimin'))`,
    explain: {
      concept: '데코레이터는 함수를 감싸서 기능을 덧붙이는 도구예요. 선물을 예쁜 포장지로 감싸는 것과 같아요.',
      terms: [
        { t: '@log', d: '아래 함수를 log로 감싸겠다는 표시예요.' },
        { t: 'wrapper', d: '원래 함수를 감싸는 겉 함수예요.' },
        { t: 'fn.__name__', d: '원래 함수의 이름을 가져와요.' },
        { t: '*a, **k', d: '어떤 인수든 그대로 넘기겠다는 뜻이에요.' },
      ],
      why: '원래 코드를 안 바꾸고도 기능을 추가할 수 있어요.',
      pitfall: 'wrapper가 인수를 안 넘기면 원래 함수가 값을 못 받아요.',
    },
  },
  {
    id: 'pc-decorator-functools',
    lang: 'python',
    title: 'functools.wraps',
    file: 'memo.py',
    code: `from functools import wraps


def memo(fn):
  cache = {}

  @wraps(fn)
  def wrapper(*a, **k):
    key = str(a) + str(k)
    if key not in cache:
      cache[key] = fn(*a, **k)
    return cache[key]

  return wrapper


@memo
def add(a: int, b: int) -> int:
  return a + b


print(add(1, 2), add.__name__)`,
    explain: {
      concept: '@wraps를 쓰면 감싸진 함수가 원래 함수의 이름과 정보를 유지해요. 포장지를 씌워도 안에 뭔지 보이게 표시하는 거예요.',
      terms: [
        { t: '@wraps(fn)', d: 'wrapper가 원래 함수의 정보를 물려받게 해요.' },
        { t: 'cache', d: '결과를 저장해두는 사전이에요.' },
        { t: 'add.__name__', d: '함수의 원래 이름이에요.' },
      ],
      why: '디버깅할 때 원래 함수 이름이 보여요.',
      pitfall: '@wraps를 안 쓰면 wrapper 이름만 보여 원인 추적이 어려워요.',
    },
  },
  {
    id: 'pc-inheritance',
    lang: 'python',
    title: '클래스 상속',
    file: 'animal.py',
    code: `class Animal:
  def __init__(self, name: str) -> None:
    self.name = name

  def speak(self) -> str:
    return self.name + ' ...'


class Cat(Animal):
  def speak(self) -> str:
    return self.name + ' meow'


a = Animal('beast')
c = Cat('nabi')
print(a.speak())
print(c.speak())`,
    explain: {
      concept: '상속은 부모 클래스의 특성을 물려받아 새 클래스를 만드는 방법이에요. 부모의 기능을 그대로 쓰거나 바꿀 수 있어요.',
      terms: [
        { t: 'class Cat(Animal)', d: 'Cat이 Animal을 상속받는다는 표시예요.' },
        { t: 'speak(self)', d: '자식 클래스에서 부모 메서드를 새로 정의(오버라이드)해요.' },
        { t: 'Animal', d: '공통 기능을 갖는 부모(기반) 클래스예요.' },
      ],
      why: '공통 코드를 한 번만 쓰고, 차이만 추가로 정의할 수 있어요.',
      pitfall: '오버라이드할 때 메서드 이름·매개변수 타입을 맞춰야 해요.',
    },
  },
];
