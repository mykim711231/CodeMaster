import type { Snippet } from '../../types';

export const pythonCore: Snippet[] = [
  {
    id: 'pc-def-basic',
    lang: 'python',
    title: '함수 정의',
    file: 'greet.py',
    code: `def greet(name: str) -> str:
  print(f"[실행] greet() 호출 — name: {name}")
  result = 'hello, ' + name
  print(f"[결과] 인사말 생성: {result}")
  return result


msg = greet('jimin')
print(f"[완료] 최종 메시지: {msg}")`,
    explain: {
      concept:
        '함수(def)는 자주 쓰는 코드에 이름을 붙여서 재사용하는 도구예요. ' +
        '한 번 만들어두면 필요할 때마다 꺼내 쓸 수 있어서 코드 중복을 줄이고 수정도 한 곳에서만 하면 돼요. ' +
        '실무에서는 데이터베이스 조회, API 호출, 계산 로직 등 반복되는 작업을 함수로 묶어서 관리해요. ' +
        '함수를 잘게 쪼갤수록 테스트하기 쉬워지고, 코드 읽기도 편해져요. ' +
        '입문 단계에서는 "입력 → 처리 → 출력"의 흐름을 익히는 게 가장 중요해요.',
      terms: [
        { t: 'def', d: '함수를 새로 정의할 때 쓰는 예약어예요. def 다음에 함수 이름을 붙여요.' },
        { t: 'name: str', d: '매개변수 name이 문자열(str) 타입이라는 타입 힌트예요.' },
        { t: '-> str', d: '이 함수가 실행된 후 문자열(str)을 돌려준다는 반환 타입 표시예요.' },
        { t: 'return', d: '함수 안에서 계산한 결과를 밖으로 내보내는 키워드예요.' },
        { t: "greet('jimin')", d: '함수를 호출하고 인수로 "jimin"을 전달해요.' },
      ],
      why:
        '실무에서 같은 로직을 여러 곳에서 반복해서 쓰면, 한 곳에 함수로 정의하고 호출해요. ' +
        '예를 들어 사용자 인증, 금액 계산 같은 비즈니스 규칙을 함수로 만들어 재사용해요.',
      expectedOutput:
        "greet('jimin') 호출 시:\n" +
        '[실행] greet() 호출 — name: jimin\n' +
        '[결과] 인사말 생성: hello, jimin\n' +
        '[완료] 최종 메시지: hello, jimin',
      realWorldUsage:
        '실제 Flask·FastAPI 웹 서버에서 사용자 요청을 받으면, 요청 데이터를 인수로 넘겨 함수를 호출하고 그 결과를 JSON으로 응답해요.',
      pitfall:
        'return을 빼먹으면 함수가 암묵적으로 None을 돌려줘서, 호출한 쪽에서 None을 받고 당황할 수 있어요.',
    },
  },
  {
    id: 'pc-default-param',
    lang: 'python',
    title: '기본값 매개변수',
    file: 'order.py',
    code: `def order(item: str, qty: int = 1) -> str:
  print(f"[실행] order() 호출 — item: {item}, qty: {qty}")
  result = item + ' x' + str(qty)
  print(f"[결과] 주문 생성: {result}")
  return result


print(order('coffee'))
print(order('tea', 3))`,
    explain: {
      concept:
        '매개변수에 기본값을 미리 설정해두면, 함수를 호출할 때 해당 인수를 생략했을 때 기본값이 자동으로 들어가요. ' +
        '마치 식당에서 사이즈를 말하지 않으면 기본 사이즈로 주문이 들어가는 것과 같아요. ' +
        '실무에서는 설정값이나 옵션을 다룰 때 자주 써요. ' +
        '예를 들어 API 호출 시 제한 시간(timeout)을 기본 30초로 설정하고, 특별한 경우에만 60초로 바꾸는 식이에요. ' +
        '기본값을 잘 활용하면 함수 호출 코드가 간결해지고, 사용자가 신경 써야 할 인수 개수가 줄어들어 실수를 줄여줘요.',
      terms: [
        { t: 'qty: int = 1', d: 'qty를 전달하지 않으면 1을 기본값으로 써요. int는 타입 힌트예요.' },
        { t: 'str(qty)', d: '숫자(int)를 문자열(str)로 변환해서 다른 문자열과 이어붙이기 위해 써요.' },
        { t: "order('tea', 3)", d: '기본값 대신 직접 3을 넘겨서 호출하는 예시예요.' },
        { t: "order('coffee')", d: 'qty를 생략했으므로 기본값 1이 자동으로 들어가요.' },
      ],
      why:
        '실무에서 API 클라이언트를 만들 때 timeout, retry 횟수, 인코딩 등에 기본값을 설정해두면 ' +
        '대부분의 호출 코드가 짧아지고, 특별한 경우에만 값을 덮어쓰면 돼요.',
      expectedOutput:
        "order('coffee'), order('tea', 3) 호출 시:\n" +
        '[실행] order() 호출 — item: coffee, qty: 1\n' +
        '[결과] 주문 생성: coffee x1\n' +
        'coffee x1\n' +
        '[실행] order() 호출 — item: tea, qty: 3\n' +
        '[결과] 주문 생성: tea x3\n' +
        'tea x3',
      realWorldUsage:
        '실제 FastAPI 서버에서 GET /items?page=1 같은 요청을 받을 때, page 매개변수에 기본값 1을 설정해두면 클라이언트가 page를 생략해도 자동으로 첫 페이지를 반환해요.',
      pitfall:
        '기본값 있는 매개변수는 반드시 기본값 없는 매개변수 뒤에 와야 해요. 앞에 오면 문법 오류가 나요.',
    },
  },
  {
    id: 'pc-args',
    lang: 'python',
    title: '*args 가변 인수',
    file: 'total.py',
    code: `def total(*nums: int) -> int:
  print(f"[실행] total() 호출 — {len(nums)}개 인수 전달받음")
  result = sum(nums)
  print(f"[결과] 합계: {result}")
  return result


print(total(1, 2, 3))
print(total(10, 20))`,
    explain: {
      concept:
        '*args는 함수가 몇 개의 인수를 받을지 미리 정하지 않고, 호출할 때 원하는 만큼 인수를 전달할 수 있게 해줘요. ' +
        '전달된 값들은 함수 안에서 튜플 형태로 묶여서 하나씩 꺼내 쓸 수 있어요. ' +
        '실무에서는 여러 개의 조건문을 조합해 동적 쿼리를 만드는 ORM 헬퍼 함수나, 다중 필터를 처리하는 유틸리티 함수에서 자주 등장해요. ' +
        '예를 들어 데이터베이스에 "이름이 A이고, 나이가 B이고, 지역이 C인 사용자"처럼 조건 개수가 달라질 때 유용해요.',
      terms: [
        { t: '*nums', d: '여러 인수를 받아 튜플(순서 있는 묶음)로 모아주는 구문이에요.' },
        { t: 'sum(nums)', d: '묶음 안에 있는 모든 숫자의 합을 계산하는 내장 함수예요.' },
        { t: '-> int', d: '이 함수가 정수 하나를 결과로 돌려준다는 반환 타입 표시예요.' },
        { t: 'len(nums)', d: '전달받은 인수가 총 몇 개인지 세어주는 함수예요.' },
      ],
      why:
        '실무에서 로깅 함수를 만들 때 `log("error", "db", "timeout")`처럼 여러 정보를 한 번에 받아야 해서 써요. ' +
        '인수 개수가 상황에 따라 달라지는 유연한 함수를 만들 수 있어요.',
      expectedOutput:
        'total(1, 2, 3), total(10, 20) 호출 시:\n' +
        '[실행] total() 호출 — 3개 인수 전달받음\n' +
        '[결과] 합계: 6\n' +
        '6\n' +
        '[실행] total() 호출 — 2개 인수 전달받음\n' +
        '[결과] 합계: 30\n' +
        '30',
      realWorldUsage:
        '실제 Django·SQLAlchemy 프로젝트에서 검색 필터 함수를 만들 때, 검색 조건이 1개일 수도 5개일 수도 있어서 *args로 받아 동적으로 AND 조건을 조합해요.',
      pitfall:
        '*args로 모인 값은 튜플이라 값을 변경할 수 없어요. 수정이 필요하면 list()로 변환해서 써야 해요.',
    },
  },
  {
    id: 'pc-kwargs',
    lang: 'python',
    title: '**kwargs 키워드 가변 인수',
    file: 'profile.py',
    code: `def profile(name: str, **info: str) -> None:
  print(f"[실행] profile() 호출 — name: {name}, 추가 정보 {len(info)}개")
  print(f"[프로필] {name}")
  for k, v in info.items():
    print(f"  {k}: {v}")


profile('jimin', role='dev', city='seoul')`,
    explain: {
      concept:
        '**kwargs는 이름표(키)와 값을 쌍으로 여러 개 받을 때 써요. 함수 안에서는 딕셔너리(사전) 형태로 접근할 수 있어요. ' +
        '실무에서는 데이터를 생성하거나 업데이트할 때 어떤 필드가 들어올지 모르는 상황에서 유연하게 처리할 수 있어요. ' +
        '예를 들어 사용자 프로필을 업데이트할 때 "이름, 도시, 직업" 중 어떤 정보가 넘어올지 모르니, ' +
        '**kwargs로 모두 받아서 딕셔너리처럼 하나씩 처리하는 식으로 써요. ' +
        'REST API에서 클라이언트가 선택적으로 보내는 필드를 처리할 때 특히 유용해요.',
      terms: [
        { t: '**info', d: '키=값 형태로 여러 인수를 받아 딕셔너리로 모아주는 구문이에요.' },
        { t: 'info.items()', d: '딕셔너리의 키와 값을 한 쌍씩 꺼내주는 메서드예요.' },
        { t: "role='dev'", d: '키워드 인수로 role이라는 이름에 "dev" 값을 전달하는 호출 방식이에요.' },
        { t: 'for k, v in', d: '키(k)와 값(v)을 동시에 변수로 받아 반복문을 돌리는 구문이에요.' },
      ],
      why:
        '실무에서 REST API 엔드포인트가 선택적 쿼리 파라미터를 받을 때, ' +
        '또는 데이터베이스 업데이트 시 변경된 컬럼만 골라 처리할 때 **kwargs로 받아 동적으로 처리해요.',
      expectedOutput:
        "profile('jimin', role='dev', city='seoul') 호출 시:\n" +
        '[실행] profile() 호출 — name: jimin, 추가 정보 2개\n' +
        '[프로필] jimin\n' +
        '  role: dev\n' +
        '  city: seoul',
      realWorldUsage:
        '실제 프로젝트에서 사용자 정보 업데이트 API를 만들 때, 클라이언트가 {"role": "dev"}만 보낼 수도, {"city": "seoul", "role": "admin"}처럼 여러 개를 보낼 수도 있어서 **kwargs로 받아 처리해요.',
      pitfall:
        '딕셔너리를 **로 풀어서 넘길 때 키가 문자열이 아니면 TypeError가 발생해요. 키는 반드시 문자열이어야 해요.',
    },
  },
  {
    id: 'pc-class-basic',
    lang: 'python',
    title: '클래스 정의',
    file: 'dog.py',
    code: `class Dog:
  def __init__(self, name: str) -> None:
    print(f"[실행] Dog.__init__ — name: {name}")
    self.name = name

  def bark(self) -> str:
    print(f"[실행] bark() — {self.name}가 짖음")
    result = self.name + '! woof'
    print(f"[결과] 소리: {result}")
    return result


d = Dog('bori')
print(d.bark())`,
    explain: {
      concept:
        '클래스(class)는 현실 세계의 개념을 코드로 옮긴 설계도예요. 붕어빵 틀에 비유하면, 틀에서 찍어낸 각각의 붕어빵이 인스턴스(객체)예요. ' +
        '실무에서는 "사용자", "주문", "상품" 같은 개념을 클래스로 만들고, 각각의 데이터와 행동을 한 곳에 묶어 관리해요. ' +
        '이렇게 묶으면 관련된 코드가 한 클래스 안에 모여서 찾기 쉽고, 변경이 필요할 때도 그 클래스만 고치면 돼요. ' +
        '파이썬에서는 모든 것이 객체인 언어라서, 클래스를 이해하면 파이썬의 동작 원리를 더 깊이 이해할 수 있어요.',
      terms: [
        { t: 'class Dog', d: 'Dog라는 새로운 타입(설계도)을 정의하는 구문이에요.' },
        { t: '__init__(self, ...)', d: '인스턴스가 생성될 때 자동으로 호출되는 초기화 메서드예요.' },
        { t: 'self.name', d: '각 인스턴스마다 고유한 name 값을 저장하고 꺼내는 속성이에요.' },
        { t: 'bark(self)', d: '인스턴스가 수행할 수 있는 행동(메서드)을 정의해요. self는 자기 자신을 가리켜요.' },
        { t: "Dog('bori')", d: 'Dog 클래스의 인스턴스를 name="bori"로 생성하는 호출이에요.' },
      ],
      why:
        '실무에서 ORM 모델(User, Order)이나 서비스 객체(AuthService, PaymentService)를 클래스로 만들어 관리해요. ' +
        '데이터와 그 데이터를 처리하는 메서드를 한 곳에 묶으면 유지보수가 훨씬 쉬워져요.',
      expectedOutput:
        "Dog('bori').bark() 호출 시:\n" +
        '[실행] Dog.__init__ — name: bori\n' +
        '[실행] bark() — bori가 짖음\n' +
        '[결과] 소리: bori! woof\n' +
        'bori! woof',
      realWorldUsage:
        '실제 Flask·Django 프로젝트에서 User 클래스는 사용자 정보를 담고, 로그인·로그아웃 같은 메서드를 함께 묶어둬요. API 요청이 오면 User 인스턴스를 생성해서 처리해요.',
      pitfall:
        '메서드의 첫 번째 매개변수는 반드시 self여야 해요. 호출할 때는 self를 직접 넘기지 않아도 파이썬이 자동으로 채워줘요.',
    },
  },
  {
    id: 'pc-init-init',
    lang: 'python',
    title: '__init__ 초기화',
    file: 'account.py',
    code: `class Account:
  def __init__(self, owner: str, balance: int = 0) -> None:
    print(f"[실행] Account.__init__ — owner: {owner}, balance: {balance}")
    self.owner = owner
    self.balance = balance


a = Account('jimin', 1000)
b = Account('soyi')
print(f"[결과] a: owner={a.owner}, balance={a.balance}")
print(f"[결과] b: owner={b.owner}, balance={b.balance}")`,
    explain: {
      concept:
        '__init__은 인스턴스가 태어나는 순간에 자동으로 실행되는 초기화 함수예요. 새 스마트폰을 샀을 때 언어·Wi-Fi·계정을 처음 한 번만 설정하는 것과 같은 역할이에요. ' +
        '실무에서는 데이터베이스에서 읽어온 값으로 객체의 초기 상태를 설정하거나, API 응답 데이터를 파싱해서 객체를 만들 때 __init__에서 필드들을 채워줘요. ' +
        '기본값을 함께 지정해두면 필수 정보만 넘기고 나머지는 기본 상태로 시작할 수 있어서 편리해요. ' +
        '잘 설계된 __init__은 "이 객체를 만들려면 무엇이 필요한가"를 코드만 보고 바로 이해할 수 있게 해줘요.',
      terms: [
        { t: '__init__', d: '인스턴스가 생성될 때 딱 한 번 자동 호출되는 초기화 메서드예요.' },
        { t: 'balance: int = 0', d: '잔액을 전달하지 않으면 0으로 초기화되는 기본값 매개변수예요.' },
        { t: 'self.owner', d: '인스턴스의 owner 속성에 값을 저장하고, 나중에 a.owner로 꺼내 써요.' },
        { t: 'Account("jimin", 1000)', d: 'owner와 balance를 지정해 새 Account 인스턴스를 생성해요.' },
      ],
      why:
        '실무에서 ORM 모델의 생성자(__init__)는 데이터베이스에서 조회한 레코드의 컬럼 값들로 객체를 채울 때 호출돼요. ' +
        '초기 상태가 잘못되면 이후 모든 로직이 꼬이므로 __init__에서 철저히 검증하는 게 중요해요.',
      expectedOutput:
        'Account 두 개 생성 시:\n' +
        '[실행] Account.__init__ — owner: jimin, balance: 1000\n' +
        '[실행] Account.__init__ — owner: soyi, balance: 0\n' +
        '[결과] a: owner=jimin, balance=1000\n' +
        '[결과] b: owner=soyi, balance=0',
      realWorldUsage:
        '실제 프로젝트에서 User(id=123, name="jimin")처럼 생성자로 객체를 만들고, 이 객체를 서비스 계층에 넘겨 비즈니스 로직을 처리해요. 생성자에서 유효성 검사(이름이 비어있지 않은지 등)를 하면 잘못된 데이터가 시스템 안으로 들어오는 걸 막을 수 있어요.',
      pitfall:
        '__init__은 값을 돌려주면 안 돼요. 반환 타입은 None이어야 해요. return으로 어떤 값을 반환하면 TypeError가 발생해요.',
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
    print(f"[실행] Book.make() — title: {title}, 현재 count: {cls.count}")
    cls.count += 1
    print(f"[결과] count 증가 → {cls.count}")
    return cls(title)

  def __init__(self, title: str) -> None:
    self.title = title


b = Book.make('python')
print(f"[완료] Book.count = {Book.count}, b.title = {b.title}")`,
    explain: {
      concept:
        '@classmethod는 인스턴스가 아니라 클래스 자체에 소속된 메서드를 만들어요. 붕어빵 틀 자체에서 "지금까지 몇 개 만들었는지" 세는 것과 같아요. ' +
        '실무에서는 객체를 생성하는 팩토리 메서드나, 전체 인스턴스를 대상으로 하는 집계 작업에 자주 써요. ' +
        '예를 들어 데이터베이스에서 특정 조건의 레코드를 조회해 객체로 만들어주는 from_db() 같은 대체 생성자를 만들 때 유용해요. ' +
        '첫 번째 매개변수로 cls를 받아서 클래스 자체에 접근할 수 있어요.',
      terms: [
        { t: '@classmethod', d: '데코레이터로, 아래 함수가 클래스 단위로 동작하게 만들어줘요.' },
        { t: 'cls', d: 'self 대신 클래스 자신을 가리키는 첫 번째 매개변수예요.' },
        { t: 'count = 0', d: '모든 인스턴스가 공유하는 클래스 변수예요. 한 곳에서 바꾸면 모두에 반영돼요.' },
        { t: 'cls.count += 1', d: '클래스 변수의 값을 1 증가시켜요. cls를 통해 접근해요.' },
        { t: "return cls(title)", d: 'cls로 새 인스턴스를 만들어 반환하는 팩토리 패턴이에요.' },
      ],
      why:
        '실무에서 모델 클래스에 from_dict() 같은 대체 생성자를 만들 때 써요. ' +
        '데이터베이스에서 조회한 결과를 객체로 변환하거나, JSON 응답을 파싱해서 객체로 만들 때 @classmethod가 편리해요.',
      expectedOutput:
        "Book.make('python') 호출 시:\n" +
        '[실행] Book.make() — title: python, 현재 count: 0\n' +
        '[결과] count 증가 → 1\n' +
        '[완료] Book.count = 1, b.title = python',
      realWorldUsage:
        '실제 Django ORM에서 User.objects.create(name="jimin")를 호출하면, 내부적으로 @classmethod로 구현된 create()가 User 인스턴스를 만들어 반환해요.',
      pitfall:
        '클래스 메서드의 첫 번째 매개변수는 반드시 cls여야 해요. self를 쓰면 일반 인스턴스 메서드가 되어버려요.',
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
print(f"[결과] Point: x={p.x}, y={p.y}")
print(f"[정보] 타입: {type(p).__name__}, repr: {p}")`,
    explain: {
      concept:
        '@dataclass는 데이터를 담는 클래스를 간단하게 만들어주는 파이썬의 편의 문법이에요. ' +
        '일반 클래스에서는 __init__, __repr__, __eq__ 같은 메서드를 직접 작성해야 하지만, @dataclass를 붙이면 이 모든 걸 자동으로 생성해줘요. ' +
        '실무에서는 API 요청/응답 데이터, 데이터베이스 레코드, 설정값 같은 순수 데이터 객체를 만들 때 자주 써요. ' +
        '타입 힌트를 필수로 써야 해서, 다른 개발자가 데이터 구조를 한눈에 파악하기도 좋아요.',
      terms: [
        { t: '@dataclass', d: '__init__·__repr__·__eq__ 등을 자동으로 생성해주는 데코레이터예요.' },
        { t: 'x: int', d: '필드 x는 정수형 데이터를 담는다고 선언한 타입 힌트예요.' },
        { t: 'y: int = 0', d: 'y 필드는 값을 전달하지 않으면 기본값 0으로 초기화돼요.' },
        { t: 'Point(3, 4)', d: '필드 순서대로 값을 넘겨 새 데이터 인스턴스를 생성해요.' },
      ],
      why:
        '실무에서 수십 개의 DTO(Data Transfer Object)를 만들어야 할 때 @dataclass를 쓰면 ' +
        '보일러플레이트 코드를 수백 줄 줄일 수 있고, 실수로 __init__을 잘못 작성하는 버그도 막을 수 있어요.',
      expectedOutput:
        'Point(3, 4) 생성 시:\n' +
        '[결과] Point: x=3, y=4\n' +
        '[정보] 타입: Point, repr: Point(x=3, y=4)',
      realWorldUsage:
        '실제 FastAPI 프로젝트에서 요청 바디를 파싱하는 Pydantic 모델과 유사하게, @dataclass로 응답 데이터 구조를 정의해서 API 레이어와 서비스 레이어 사이에 주고받아요.',
      pitfall:
        '기본값이 있는 필드는 기본값 없는 필드 뒤에 와야 해요. x: int = 0, y: int처럼 앞에 기본값이 있으면 오류가 나요.',
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
    result = self.w * self.h
    print(f"[실행] area() — w={self.w}, h={self.h} → 넓이={result}")
    return result


r = Rect(5, 3)
print(f"[완료] 사각형 넓이: {r.area()}")`,
    explain: {
      concept:
        '@dataclass로 만든 클래스에도 일반 클래스처럼 메서드를 추가할 수 있어요. 데이터를 담는 것에 그치지 않고, 그 데이터를 계산하는 행동까지 함께 묶을 수 있어요. ' +
        '실무에서는 DTO(데이터 객체)에 단순 계산 로직을 붙이거나, 데이터 변환·직렬화 메서드를 함께 넣어서 응집도를 높일 때 써요. ' +
        '데이터와 그 데이터를 다루는 로직이 한 클래스에 모여 있으면, 코드를 찾아다니지 않아도 돼서 생산성이 올라가요.',
      terms: [
        { t: 'def area(self)', d: '데이터클래스 안에 정의한 일반 메서드예요. self로 필드에 접근해요.' },
        { t: 'self.w', d: '인스턴스의 w(너비) 필드 값을 가져와서 계산에 써요.' },
        { t: '@dataclass', d: '클래스 위에 붙여 __init__·__repr__을 자동 생성해주는 데코레이터예요.' },
        { t: 'self.w * self.h', d: '너비와 높이를 곱해 사각형의 넓이를 계산하는 식이에요.' },
      ],
      why:
        '실무에서 Order 클래스에 total_price() 메서드를 넣어서, 주문 데이터와 가격 계산 로직을 한 곳에서 관리해요. ' +
        '로직이 여기저기 퍼지지 않고 데이터 바로 옆에 있어 유지보수가 쉬워져요.',
      expectedOutput:
        'Rect(5, 3).area() 호출 시:\n' +
        '[실행] area() — w=5, h=3 → 넓이=15\n' +
        '[완료] 사각형 넓이: 15',
      realWorldUsage:
        '실제 결제 시스템에서 Payment 객체에 tax(), total_amount() 같은 계산 메서드를 붙여서, 결제 데이터와 계산 로직을 한 곳에 모아 관리해요.',
      pitfall:
        '메서드 안에서 필드 값을 직접 바꾸려면 dataclass의 frozen=True를 쓰지 않아야 해요. frozen=True면 모든 필드가 읽기 전용이 돼요.',
    },
  },
  {
    id: 'pc-type-list',
    lang: 'python',
    title: 'list 타입 힌트',
    file: 'nums.py',
    code: `def first(nums: list[int]) -> int:
  print(f"[실행] first() 호출 — 리스트: {nums}")
  if not nums:
    print(f"[결과] 빈 리스트 → 0 반환")
    return 0
  result = nums[0]
  print(f"[결과] 첫 번째 원소: {result}")
  return result


print(first([10, 20, 30]))
print(first([]))`,
    explain: {
      concept:
        'list[int]라는 타입 힌트는 "리스트인데 그 안에 정수만 들어 있어요"라고 코드 읽는 사람과 IDE에 알려주는 주석 역할을 해요. ' +
        '실제 실행에는 영향을 주지 않지만, 자동 완성과 타입 검사 도구(mypy, pyright)가 코드의 오류를 미리 잡아줘요. ' +
        '실무에서는 함수 시그니처만 보고도 어떤 데이터를 주고받는지 바로 파악할 수 있어서, 타입 힌트가 없는 코드보다 훨씬 읽기 쉬워요. ' +
        '특히 여러 명이 협업하는 프로젝트에서는 타입 힌트가 의사소통 도구 역할을 해요.',
      terms: [
        { t: 'list[int]', d: '정수(int)만 여러 개 담을 수 있는 리스트라는 타입 힌트예요.' },
        { t: '-> int', d: '이 함수가 정수 하나를 결과로 돌려준다는 반환 타입 표시예요.' },
        { t: 'nums[0]', d: '리스트의 첫 번째(인덱스 0) 원소를 가져오는 인덱싱 연산이에요.' },
        { t: 'if not nums', d: '리스트가 비어 있는지 검사하는 조건문이에요. 빈 리스트는 False로 평가돼요.' },
      ],
      why:
        '실무에서 API 응답 데이터를 파싱한 리스트를 함수에 넘길 때, 타입 힌트가 있으면 "여기엔 User 객체 리스트가 들어와야 한다"고 IDE가 알려줘서 잘못된 타입을 넘기는 실수를 막아줘요.',
      expectedOutput:
        'first([10, 20, 30]), first([]) 호출 시:\n' +
        '[실행] first() 호출 — 리스트: [10, 20, 30]\n' +
        '[결과] 첫 번째 원소: 10\n' +
        '10\n' +
        '[실행] first() 호출 — 리스트: []\n' +
        '[결과] 빈 리스트 → 0 반환\n' +
        '0',
      realWorldUsage:
        '실제 FastAPI 엔드포인트에서 GET /users 응답을 list[User]로 타입 힌트를 붙이면, 자동 생성된 OpenAPI 문서에도 반환 타입이 명시돼서 프론트엔드 개발자가 응답 형태를 정확히 알 수 있어요.',
      pitfall:
        '타입 힌트는 강제되지 않아요. 즉 list[int]라고 써놔도 문자열이 들어갈 수 있어요. 실행 시점에 보장하려면 Pydantic 같은 검증 라이브러리를 추가로 써야 해요.',
    },
  },
  {
    id: 'pc-type-dict',
    lang: 'python',
    title: 'dict 타입 힌트',
    file: 'scores.py',
    code: `def top(scores: dict[str, int]) -> str:
  print(f"[실행] top() 호출 — 점수표: {scores}")
  best = max(scores, key=scores.get)
  print(f"[결과] 최고점: {best} → {scores[best]}점")
  return best


print(top({'jimin': 90, 'soyi': 95}))`,
    explain: {
      concept:
        'dict[str, int]는 "키는 문자열, 값은 정수인 딕셔너리"라는 타입 힌트예요. 이름표로 빠르게 값을 찾는 사전과 같은 구조예요. ' +
        '실무에서는 사용자 이름과 점수, 상품 ID와 가격, 설정 키와 값 등 키-값 쌍으로 표현되는 모든 데이터를 다룰 때 써요. ' +
        '타입 힌트 덕분에 이 딕셔너리에 어떤 형태의 데이터가 들어있는지 코드를 읽는 사람이 바로 이해할 수 있어요. ' +
        'max() 함수에 key 매개변수를 활용하면 값(value)이 가장 큰 키(key)를 손쉽게 찾을 수 있어요.',
      terms: [
        { t: 'dict[str, int]', d: '키는 문자열(str), 값은 정수(int)인 딕셔너리 타입 힌트예요.' },
        { t: 'max(scores, key=scores.get)', d: 'scores의 값이 가장 큰 항목의 키를 찾아 반환해요.' },
        { t: 'scores.get', d: '딕셔너리에서 키에 해당하는 값을 꺼내는 메서드예요.' },
        { t: '-> str', d: '가장 높은 점수를 가진 사람의 이름(문자열)을 반환한다는 의미예요.' },
      ],
      why:
        '실무에서 API 응답 데이터를 JSON → dict[str, Any]로 파싱한 뒤, 특정 필드 중 최댓값을 찾거나 필터링할 때 써요. ' +
        '예를 들어 게임 리더보드에서 최고 점수 플레이어를 찾는 로직에 활용돼요.',
      expectedOutput:
        "top({'jimin': 90, 'soyi': 95}) 호출 시:\n" +
        "[실행] top() 호출 — 점수표: {'jimin': 90, 'soyi': 95}\n" +
        '[결과] 최고점: soyi → 95점\n' +
        'soyi',
      realWorldUsage:
        '실제 랭킹 시스템에서 수백만 플레이어의 점수를 dict로 관리하고, max()로 최고 득점자를 찾아 리더보드에 표시해요.',
      pitfall:
        'dict에 없는 키로 값을 꺼내려고 하면 KeyError가 발생해요. 안전하게 꺼내려면 scores.get("key", 기본값)을 써야 해요.',
    },
  },
  {
    id: 'pc-optional',
    lang: 'python',
    title: 'Optional 타입',
    file: 'find.py',
    code: `from typing import Optional


def find(items: list[int], target: int) -> Optional[int]:
  print(f"[실행] find() — 리스트: {items}, 찾는 값: {target}")
  for i, v in enumerate(items):
    if v == target:
      print(f"[결과] 인덱스 {i}에서 발견")
      return i
  print(f"[결과] 찾지 못함 → None 반환")
  return None


print(find([1, 2, 3], 2))
print(find([1, 2, 3], 5))`,
    explain: {
      concept:
        'Optional[int]는 "정수가 나올 수도 있지만, 찾지 못하면 None이 나올 수도 있어요"라고 명시하는 타입이에요. ' +
        '현실에서 물건을 찾는 것처럼, 있을 때는 그 위치를, 없을 때는 "없음"을 표현해야 할 때 써요. ' +
        '실무에서는 데이터베이스에서 ID로 사용자를 조회할 때 결과가 있을 수도 없을 수도 있어서 Optional 타입을 빈번하게 써요. ' +
        '함수를 사용하는 쪽에서 "이 값은 None일 가능성이 있다"고 인지하게 해서, None 체크를 강제하는 효과가 있어요.',
      terms: [
        { t: 'Optional[int]', d: '결과가 int일 수도 있고 None일 수도 있다는 타입 힌트예요.' },
        { t: 'None', d: '"값이 없음"을 나타내는 파이썬의 특별한 값이에요. null과 같은 의미예요.' },
        { t: 'enumerate(items)', d: '리스트의 (인덱스, 값) 쌍을 순서대로 꺼내주는 내장 함수예요.' },
        { t: 'i, v', d: 'enumerate가 반환한 인덱스(i)와 값(v)을 동시에 받는 변수 선언이에요.' },
      ],
      why:
        '실무에서 "사용자 ID 123번을 찾아줘"라는 함수가 있을 때, 해당 ID가 없으면 빈 값이 아니라 None을 반환해야 ' +
        '호출한 쪽에서 "찾은 경우"와 "못 찾은 경우"를 분기해서 처리할 수 있어요.',
      expectedOutput:
        'find([1, 2, 3], 2), find([1, 2, 3], 5) 호출 시:\n' +
        '[실행] find() — 리스트: [1, 2, 3], 찾는 값: 2\n' +
        '[결과] 인덱스 1에서 발견\n' +
        '1\n' +
        '[실행] find() — 리스트: [1, 2, 3], 찾는 값: 5\n' +
        '[결과] 찾지 못함 → None 반환\n' +
        'None',
      realWorldUsage:
        '실제 ORM에서 User.objects.filter(id=999).first()는 결과가 있으면 User 객체를, 없으면 None을 반환해요. 이때 반환 타입이 Optional[User]가 돼요.',
      pitfall:
        'Optional 결과를 쓸 때는 반드시 None인지 먼저 확인해야 해요. None 체크 없이 바로 속성에 접근하면 AttributeError가 발생해요.',
    },
  },
  {
    id: 'pc-list-comp',
    lang: 'python',
    title: '리스트 컴프리헨션',
    file: 'squares.py',
    code: `nums = [1, 2, 3, 4, 5]
print(f"[실행] 원본 리스트: {nums}")
squares = [n * n for n in nums]
print(f"[결과] 제곱 리스트: {squares}")`,
    explain: {
      concept:
        '리스트 컴프리헨션은 한 줄로 기존 리스트를 변환해 새 리스트를 만드는 간결한 문법이에요. ' +
        'for 반복문으로 하나씩 꺼내서 변환하고 다시 리스트에 담는 과정을 한 줄로 압축한 거예요. ' +
        '실무에서는 데이터를 빠르게 변환하거나, API 응답 리스트에서 특정 필드만 추출할 때 자주 써요. ' +
        '읽기 좋은 컴프리헨션은 코드의 의도를 "이 리스트에서 저 리스트를 만든다"고 바로 전달해줘요. ' +
        '하지만 너무 복잡한 변환을 한 줄에 욱여넣으면 오히려 가독성을 해치니, 2줄 이상이면 for문으로 풀어 쓰는 게 좋아요.',
      terms: [
        { t: '[n * n for n in nums]', d: 'nums의 각 원소 n을 꺼내 제곱(n*n)한 결과를 새 리스트로 모아요.' },
        { t: 'n * n', d: '각 원소에 적용할 변환 연산이에요. 여기서는 제곱을 계산해요.' },
        { t: 'squares', d: '컴프리헨션 결과인 새 리스트를 담는 변수예요.' },
        { t: 'for n in nums', d: '리스트 nums에서 원소를 하나씩 순서대로 꺼내는 반복 구문이에요.' },
      ],
      why:
        '실무에서 데이터 정제 파이프라인에서 "모든 금액에 세금 10%를 더한 리스트" 같은 변환을 리스트 컴프리헨션으로 한 줄로 처리해요.',
      expectedOutput:
        '실행 시:\n' +
        '[실행] 원본 리스트: [1, 2, 3, 4, 5]\n' +
        '[결과] 제곱 리스트: [1, 4, 9, 16, 25]',
      realWorldUsage:
        '실제 프로젝트에서 API 응답으로 받은 사용자 리스트에서 이름만 추출해 드롭다운 메뉴에 표시할 때, `[u.name for u in users]` 식으로 간단히 변환해요.',
      pitfall:
        '너무 복잡한 조건과 중첩을 한 줄에 몰아넣으면 오히려 읽기 어려워요. 길어지면 일반 for문으로 풀어 쓰는 게 가독성에 좋아요.',
    },
  },
  {
    id: 'pc-list-comp-if',
    lang: 'python',
    title: '컴프리헨션 조건',
    file: 'evens.py',
    code: `nums = [1, 2, 3, 4, 5, 6]
print(f"[실행] 원본 리스트: {nums}")
evens = [n for n in nums if n % 2 == 0]
print(f"[결과] 짝수만 필터링: {evens}")`,
    explain: {
      concept:
        '리스트 컴프리헨션 끝에 if 조건을 붙이면, 조건을 만족하는 원소만 골라서 새 리스트를 만들어요. ' +
        '필터(거름망)를 먼저 통과시킨 뒤 남은 원소들로 리스트를 구성하는 방식이에요. ' +
        '실무에서는 "주문 목록에서 취소되지 않은 것만", "사용자 중에 미성년자만"처럼 조건부 추출을 할 때 자주 써요. ' +
        'for문과 if문을 따로 쓰는 것보다 훨씬 간결하게 표현할 수 있어서 코드 리뷰 시 의도가 바로 읽혀요.',
      terms: [
        { t: 'if n % 2 == 0', d: '2로 나눈 나머지가 0인 값, 즉 짝수만 통과시키는 조건이에요.' },
        { t: 'n % 2', d: 'n을 2로 나누었을 때의 나머지를 구하는 모듈로 연산자예요.' },
        { t: 'for n in nums', d: '리스트 nums에서 원소를 하나씩 꺼내 n에 담아 반복해요.' },
        { t: '[n for n in nums if ...]', d: '조건을 통과한 원소만 모아 새 리스트를 만드는 컴프리헨션이에요.' },
      ],
      why:
        '실무에서 수백만 건의 로그 데이터 중 오류 로그만 추출하거나, 거래 목록에서 특정 금액 이상인 것만 필터링할 때 써요.',
      expectedOutput:
        '실행 시:\n' +
        '[실행] 원본 리스트: [1, 2, 3, 4, 5, 6]\n' +
        '[결과] 짝수만 필터링: [2, 4, 6]',
      realWorldUsage:
        '실제 대시보드 프로젝트에서 "전체 주문 중 오늘 들어온 주문만" 또는 "총 사용자 중 활성 상태인 사용자만" 추출해서 화면에 표시할 때 이 패턴을 써요.',
      pitfall:
        '조건이 너무 길어지면 읽기 어려워져요. 복잡한 조건은 미리 함수로 분리해서 `if is_valid(n)`처럼 쓰는 게 더 읽기 좋아요.',
    },
  },
  {
    id: 'pc-dict-comp',
    lang: 'python',
    title: '딕셔너리 컴프리헨션',
    file: 'pairs.py',
    code: `names = ['jimin', 'soyi', 'tae']
print(f"[실행] 이름 리스트: {names}")
pairs = {name: len(name) for name in names}
print(f"[결과] 이름 → 길이 매핑: {pairs}")`,
    explain: {
      concept:
        '딕셔너리 컴프리헨션은 한 줄로 키-값 쌍을 만들어 딕셔너리를 구성하는 문법이에요. 리스트 컴프리헨션의 사전 버전이라고 생각하면 돼요. ' +
        '실무에서는 리스트를 받아서 ID를 키로, 객체를 값으로 하는 룩업 테이블(조회용 사전)을 만들 때 자주 써요. ' +
        '예를 들어 사용자 ID 목록으로부터 {user_id: User 객체} 형태의 딕셔너리를 만들면, 이후 O(1) 시간으로 특정 사용자를 빠르게 찾을 수 있어요. ' +
        '대규모 데이터를 다룰 때 리스트에서 매번 선형 검색하는 것보다 딕셔너리 키 검색이 수백 배 빠를 수 있어요.',
      terms: [
        { t: '{name: len(name) ...}', d: '키는 name, 값은 len(name)인 딕셔너리를 생성하는 구문이에요.' },
        { t: 'len(name)', d: '문자열의 글자 수를 반환하는 내장 함수예요. 이름 길이를 값으로 써요.' },
        { t: 'for name in names', d: '리스트 names에서 이름을 하나씩 꺼내 반복해요.' },
        { t: 'pairs', d: '생성된 딕셔너리를 담는 변수예요. 타입은 dict[str, int]가 돼요.' },
      ],
      why:
        '실무에서 CSV 데이터를 읽어 ID를 키로 한 캐시 딕셔너리를 만들어 빠르게 조회하거나, ' +
        'REST API 응답 리스트를 딕셔너리로 변환해 키 기반 검색 성능을 높일 때 써요.',
      expectedOutput:
        '실행 시:\n' +
        "[실행] 이름 리스트: ['jimin', 'soyi', 'tae']\n" +
        "[결과] 이름 → 길이 매핑: {'jimin': 5, 'soyi': 4, 'tae': 3}",
      realWorldUsage:
        '실제 사용자 관리 시스템에서 "사용자 ID 리스트로 사용자 정보를 빠르게 찾아라"는 요구사항이 있을 때, 먼저 {id: user} 딕셔너리를 딕셔너리 컴프리헨션으로 만들고 키 검색으로 처리해요.',
      pitfall:
        '키가 중복되면 마지막 값으로 덮어써져요. ID처럼 고유해야 하는 키라면 원본 리스트에 중복이 없는지 먼저 확인해야 해요.',
    },
  },
  {
    id: 'pc-with-open',
    lang: 'python',
    title: 'with 파일 열기',
    file: 'reader.py',
    code: `import io


def count_lines(fileobj: io.IOBase) -> int:
  result = sum(1 for _ in fileobj)
  print(f"[결과] 줄 수: {result}")
  return result


sample = io.StringIO('line1\nline2\nline3\n')
print(f"[실행] 메모리 파일로 줄 수 세기")
print(count_lines(sample))

# 실제 파일을 쓸 때는 아래처럼 open을 사용해요
# with open('note.txt', encoding='utf-8') as f:
#     print(count_lines(f))`,
    explain: {
      concept:
        'with문은 파일이나 네트워크 연결처럼 쓰고 나서 반드시 닫아야 하는 자원을 안전하게 열고 닫아줘요. ' +
        'with 블록에 들어갈 때 자원을 열고, 블록을 빠져나올 때(심지어 예외가 발생해도) 자동으로 닫아줘요. ' +
        '실무에서는 파일 읽기·쓰기, 데이터베이스 트랜잭션, HTTP 세션 관리 등 자원 해제가 중요한 모든 곳에서 써요. ' +
        '수동으로 close()를 부르는 것보다 누락 위험이 없어서 훨씬 안전해요. ' +
        'io.StringIO는 메모리 안에 가짜 파일을 만들어서 실제 파일 없이도 with와 파일 처리 로직을 테스트할 수 있게 해줘요.',
      terms: [
        { t: 'with open(path) as f', d: '파일을 열고 f에 담으며, 블록이 끝나면 자동으로 닫아줘요.' },
        { t: "encoding='utf-8'", d: '파일을 읽거나 쓸 때 사용할 문자 인코딩을 지정하는 옵션이에요.' },
        { t: 'io.StringIO', d: '문자열 데이터를 파일처럼 읽고 쓸 수 있는 메모리 기반 가상 파일이에요.' },
        { t: 'as f', d: '열린 파일 객체를 f라는 변수 이름으로 블록 안에서 사용할 수 있게 해줘요.' },
      ],
      why:
        '실무에서 수천 개의 파일을 처리하거나 로그 파일을 읽을 때, with문을 쓰지 않으면 파일 디스크립터가 고갈돼서 ' +
        '시스템 리소스가 바닥나는 심각한 문제로 이어질 수 있어요.',
      expectedOutput:
        '실행 시:\n' +
        '[실행] 메모리 파일로 줄 수 세기\n' +
        '[결과] 줄 수: 3\n' +
        '3',
      realWorldUsage:
        '실제 데이터 파이프라인에서 하루에 수십만 개의 CSV 파일을 읽어 데이터베이스에 적재할 때, with문으로 각 파일을 안전하게 열고 처리 후 자동으로 닫아 리소스 누수를 막아요.',
      pitfall:
        'encoding을 생략하면 운영체제의 기본 인코딩을 따라가서, 다른 OS나 환경에서 글자가 깨질 수 있어요. 명시적으로 utf-8을 지정하는 습관을 들이는 게 좋아요.',
    },
  },
  {
    id: 'pc-with-context',
    lang: 'python',
    title: '커스텀 컨텍스트 매니저',
    file: 'timer.py',
    code: `class Timer:
  def __enter__(self):
    print("[실행] Timer 시작")
    return self

  def __exit__(self, *exc):
    print("[완료] Timer 종료")


with Timer():
  print("  작업 중...")`,
    explain: {
      concept:
        '__enter__와 __exit__을 구현하면 여러분만의 with용 객체, 즉 커스텀 컨텍스트 매니저를 만들 수 있어요. ' +
        '__enter__는 with 블록에 들어갈 때 실행되고, __exit__은 블록을 나갈 때(에러가 발생해도) 반드시 실행돼요. ' +
        '실무에서는 데이터베이스 트랜잭션이나 성능 측정 타이머, 임시 파일 정리 같은 패턴을 with문으로 깔끔하게 표현할 때 직접 만들어 써요. ' +
        '코드의 시작과 끝에 반드시 실행해야 하는 로직을 한 곳에 캡슐화해서, 사용하는 쪽에서 신경 쓰지 않아도 자동으로 처리되게 할 수 있어요.',
      terms: [
        { t: '__enter__', d: 'with 블록 진입 시 자동으로 호출되는 메서드예요. 보통 자원을 준비하는 코드를 넣어요.' },
        { t: '__exit__', d: 'with 블록 종료 시 자동으로 호출되는 메서드예요. 자원을 정리하는 코드를 넣어요.' },
        { t: '*exc', d: '블록 안에서 발생한 예외 정보를 받는 매개변수예요. 예외가 없으면 모두 None이에요.' },
        { t: 'return self', d: '__enter__에서 반환한 값이 as 뒤에 지정한 변수에 담겨요.' },
      ],
      why:
        '실무에서 "DB 트랜잭션 시작 → 비즈니스 로직 → 커밋 또는 롤백" 같은 패턴을 컨텍스트 매니저로 만들면, ' +
        '트랜잭션 처리 코드가 비즈니스 로직과 섞이지 않아 깔끔하게 분리돼요.',
      expectedOutput:
        '실행 시:\n' +
        '[실행] Timer 시작\n' +
        '  작업 중...\n' +
        '[완료] Timer 종료',
      realWorldUsage:
        '실제 프로젝트에서 "요청 처리 시간을 자동으로 기록하는 미들웨어"나 "임시 디렉터리를 만들고 종료 시 자동 삭제하는 기능"을 컨텍스트 매니저로 만들어서, 사용하는 쪽은 with 한 줄만 추가하면 돼요.',
      pitfall:
        '__exit__에서 True를 반환하면 예외가 발생해도 무시돼요. 특별한 의도가 없다면 False(또는 None)를 반환해서 예외가 전파되도록 하는 게 안전해요.',
    },
  },
  {
    id: 'pc-decorator-basic',
    lang: 'python',
    title: '데코레이터',
    file: 'log.py',
    code: `def log(fn):
  def wrapper(*a, **k):
    print(f"[실행] {fn.__name__}() 호출됨")
    result = fn(*a, **k)
    print(f"[결과] {fn.__name__}() → {result}")
    return result
  return wrapper


@log
def hi(name: str) -> str:
  return 'hi ' + name


print(hi('jimin'))`,
    explain: {
      concept:
        '데코레이터는 함수를 감싸서 원래 함수의 앞뒤에 추가 기능을 덧붙이는 문법이에요. 선물을 예쁜 포장지로 감싸는 것처럼, 원래 함수의 코드는 건드리지 않고 기능을 확장할 수 있어요. ' +
        '실무에서는 로깅, 성능 측정, 권한 확인, 캐싱, 재시도 같은 공통 기능을 여러 함수에 쉽게 적용할 때 써요. ' +
        '@log만 함수 위에 붙이면 모든 함수의 호출과 반환값이 자동으로 기록돼요. ' +
        '이는 관점 지향 프로그래밍(AOP)의 파이썬식 구현이라고 볼 수 있어요.',
      terms: [
        { t: '@log', d: '바로 아래 선언된 함수를 log 데코레이터로 감싸겠다는 적용 표시예요.' },
        { t: 'wrapper(*a, **k)', d: '원래 함수를 감싸는 래퍼 함수예요. 모든 인수를 그대로 전달해줘요.' },
        { t: 'fn.__name__', d: '함수 객체의 이름 속성으로, 데코레이터가 어떤 함수를 감쌌는지 알 수 있어요.' },
        { t: 'return wrapper', d: '데코레이터 함수는 감싼 래퍼 함수를 반환해야 해요.' },
      ],
      why:
        '실무에서 FastAPI의 @app.get(), @login_required 같은 형태로 공통 기능을 여러 엔드포인트에 일관되게 적용해요. ' +
        '권한 체크나 로깅 로직이 수십 군데 흩어지지 않고 데코레이터 하나에 모여 관리돼요.',
      expectedOutput:
        "hi('jimin') 호출 시:\n" +
        '[실행] hi() 호출됨\n' +
        '[결과] hi() → hi jimin\n' +
        'hi jimin',
      realWorldUsage:
        '실제 Flask·FastAPI 프로젝트에서 @login_required 데코레이터를 만들어서, 로그인한 사용자만 특정 API를 호출할 수 있게 제어해요. 데코레이터 하나가 수십 개 엔드포인트의 인증을 담당해요.',
      pitfall:
        'wrapper에서 원래 함수를 호출할 때 인수를 그대로 전달하지 않으면, 원래 함수가 필요한 인수를 받지 못해 TypeError가 발생해요.',
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
      print(f"[실행] {fn.__name__}{a} — 캐시 없음, 계산 수행")
      cache[key] = fn(*a, **k)
    else:
      print(f"[실행] {fn.__name__}{a} — 캐시 히트!")
    return cache[key]

  return wrapper


@memo
def add(a: int, b: int) -> int:
  return a + b


print(f"[결과] add(1,2) = {add(1, 2)}, 이름: {add.__name__}")
print(f"[결과] add(1,2) = {add(1, 2)}, 이름: {add.__name__}")`,
    explain: {
      concept:
        '@wraps(fn)은 데코레이터가 감싼 함수가 원래 함수의 이름, 독스트링 같은 메타데이터를 그대로 물려받게 해줘요. ' +
        '이게 없으면 감싸진 함수의 __name__이 "wrapper"로 나와서 디버깅이 아주 어려워져요. ' +
        '여기서는 메모이제이션(memoization)이라는 패턴을 구현했어요. 같은 인수로 함수를 여러 번 호출하면 캐시에서 바로 결과를 꺼내주는 거예요. ' +
        '실무에서는 무거운 계산이나 데이터베이스 쿼리 결과를 캐싱할 때 자주 쓰는 패턴이에요.',
      terms: [
        { t: '@wraps(fn)', d: '래퍼 함수가 원래 함수의 __name__·__doc__ 등을 물려받게 하는 데코레이터예요.' },
        { t: 'cache = {}', d: '계산 결과를 저장해두는 딕셔너리 캐시예요. 키는 인수, 값은 계산 결과예요.' },
        { t: 'add.__name__', d: '@wraps 덕분에 원래 함수명 "add"가 보존돼서 디버깅이 쉬워져요.' },
        { t: 'key = str(a) + str(k)', d: '인수들을 문자열로 합쳐서 캐시의 키로 만들어요.' },
      ],
      why:
        '실무에서 데코레이터를 만들 때 @wraps를 안 쓰면, 로그에 모든 함수가 "wrapper"로 찍혀서 어디서 호출됐는지 추적이 불가능해져요. ' +
        '반드시 붙여야 하는 습관성 장식이에요.',
      expectedOutput:
        'add(1,2) 두 번 호출 시:\n' +
        '[실행] add(1, 2) — 캐시 없음, 계산 수행\n' +
        '[결과] add(1,2) = 3, 이름: add\n' +
        '[실행] add(1, 2) — 캐시 히트!\n' +
        '[결과] add(1,2) = 3, 이름: add',
      realWorldUsage:
        '실제 프로젝트에서 Redis 같은 외부 캐시와 연동하는 데코레이터를 만들어서, 동일한 쿼리가 반복 호출될 때 데이터베이스 부하를 획기적으로 줄여요.',
      pitfall:
        '@wraps를 빼먹으면 wrapper의 __name__만 보여서, 스택 트레이스나 로그에서 어떤 함수가 문제인지 원인 추적이 아주 어려워져요.',
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
    print(f"[실행] Cat.speak() — {self.name}가 울음")
    result = self.name + ' meow'
    print(f"[결과] 소리: {result}")
    return result


a = Animal('beast')
c = Cat('nabi')
print(f"[Animal] {a.speak()}")
print(f"[Cat] {c.speak()}")`,
    explain: {
      concept:
        '상속은 부모 클래스의 모든 특징을 그대로 물려받으면서, 필요한 부분만 바꾸거나 추가해서 새 클래스를 만드는 기법이에요. ' +
        'Cat은 Animal의 __init__과 speak를 기본으로 가지면서, speak만 "meow"로 재정의(오버라이드)했어요. ' +
        '실무에서는 기본 기능을 가진 베이스 클래스를 만들고, 구체적인 동작이 다른 여러 하위 클래스가 이를 상속받는 패턴이 아주 흔해요. ' +
        '예를 들어 "결제"라는 베이스 클래스 아래에 신용카드 결제, 계좌이체 결제, 포인트 결제 같은 하위 클래스가 각각의 결제 방식을 구현하는 식이에요. ' +
        '공통 로직은 부모에서 한 번만 관리하고, 차이점만 자식에서 구현하니 유지보수가 훨씬 쉬워져요.',
      terms: [
        { t: 'class Cat(Animal)', d: '괄호 안에 부모 클래스를 지정해서 상속 관계를 선언해요.' },
        { t: 'def speak(self)', d: '부모의 메서드를 자식에서 다시 정의하는 오버라이드(재정의)예요.' },
        { t: 'super().__init__()', d: '부모 클래스의 __init__을 호출하는 메서드예요(이 예제에서는 생략됐지만 중요해요).' },
        { t: "a = Animal('beast')", d: '부모 클래스로 생성한 인스턴스는 부모의 speak()을 써요.' },
        { t: "c = Cat('nabi')", d: '자식 클래스로 생성한 인스턴스는 오버라이드된 speak()을 써요.' },
      ],
      why:
        '실무에서 Django의 제네릭 뷰, DRF의 제네릭 APIView처럼 프레임워크가 미리 만들어둔 베이스 클래스를 상속받아 ' +
        '필요한 메서드만 오버라이드해서 빠르게 기능을 구현해요.',
      expectedOutput:
        '실행 시:\n' +
        '[실행] Cat.speak() — nabi가 울음\n' +
        '[결과] 소리: nabi meow\n' +
        '[Animal] beast ...\n' +
        '[Cat] nabi meow',
      realWorldUsage:
        '실제 결제 시스템에서 PaymentProcessor 베이스 클래스를 만들고, CreditCardProcessor, BankTransferProcessor가 상속받아 각자 process() 메서드를 구현해요. 클라이언트 코드는 결제 수단과 무관하게 동일한 인터페이스로 결제를 호출할 수 있어요.',
      pitfall:
        '오버라이드할 때 메서드 이름을 한 글자라도 틀리면, 자식 클래스에 새 메서드가 하나 더 생겨난 것처럼 동작해서 버그를 찾기 어려워요.',
    },
  },
];
