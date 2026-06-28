import type { Snippet } from '../../types';

export const pythonProduction: Snippet[] = [
  {
    id: 'pprod-fastapi-get',
    lang: 'python',
    title: 'FastAPI GET 엔드포인트',
    file: 'main.py',
    code: `from fastapi import FastAPI

app = FastAPI()

@app.get("/hello")
async def hello():
  return {"message": "world"}`,

    explain: {
      concept: 'FastAPI는 웹 주소(엔드포인트)를 만들어주는 도구예요. @app.get은 "이 주소로 오면 이 함수를 실행해"라는 표지판 같은 역할이에요.',
      terms: [
        { t: 'FastAPI', d: '웹 서버를 쉽게 만들게 해주는 프레임워크예요' },
        { t: '@app.get', d: 'GET 방식 요청을 받겠다는 표지판이에요' },
        { t: 'async def', d: '여러 일을 동시에 처리하는 함수라는 뜻이에요' },
        { t: 'return', d: '요청한 사람에게 돌려줄 결과예요' }
      ],
      why: '웹 브라우저가 특정 주소를 요청할 때 응답을 주려면 엔드포인트가 필요해요.'
    }
  },
  {
    id: 'pprod-fastapi-path-param',
    lang: 'python',
    title: 'FastAPI 경로 매개변수',
    file: 'main.py',
    code: `from fastapi import FastAPI

app = FastAPI()

@app.get("/users/{user_id}")
async def get_user(user_id: int):
  return {"user_id": user_id}`,

    explain: {
      concept: '주소 안에 중괄호로 변수를 넣으면, 그 자리를 함수가 받아 써요. 마치 우편물 주소의 동호수처럼 주소 자체에 데이터를 실어 보내는 거예요.',
      terms: [
        { t: '{user_id}', d: '주소 안의 변수 자리예요' },
        { t: 'user_id: int', d: '정수(int) 타입으로 받겠다는 의미예요' },
        { t: 'async def', d: '동시 처리 함수예요' }
      ],
      why: '주소만 보고도 어떤 자료를 원하는지 알 수 있어서 깔끔해요.',
      pitfall: '타입을 int로 적었는데 문자열이 오면 FastAPI가 오류를 내줘요.'
    }
  },
  {
    id: 'pprod-fastapi-query-param',
    lang: 'python',
    title: 'FastAPI 쿼리 매개변수',
    file: 'main.py',
    code: `from fastapi import FastAPI

app = FastAPI()

@app.get("/search")
async def search(q: str, limit: int = 10):
  return {"q": q, "limit": limit}`,

    explain: {
      concept: '주소 끝에 ?q=값 형태로 데이터를 붙여 보내는 방식이에요. 함수 매개변수로 적으면 FastAPI가 알아서 읽어와요. limit처럼 기본값을 주면 생략 가능해요.',
      terms: [
        { t: 'q: str', d: '필수로 받는 검색어예요' },
        { t: 'limit: int = 10', d: '기본값이 10인 선택 매개변수예요' },
        { t: '@app.get', d: 'GET 방식 요청을 받는 표지판이에요' }
      ],
      why: '주소 자체는 바꾸지 않으면서 추가 정보를 전달할 수 있어요.'
    }
  },
  {
    id: 'pprod-pydantic-basemodel',
    lang: 'python',
    title: 'Pydantic BaseModel 정의',
    file: 'models.py',
    code: `from pydantic import BaseModel

class User(BaseModel):
  name: str
  age: int`,

    explain: {
      concept: 'Pydantic의 BaseModel은 데이터의 "틀"을 만들어줘요. 장난감 빵 틀처럼 들어오는 값이 알맞은 모양인지 검사해요.',
      terms: [
        { t: 'BaseModel', d: '데이터 틀을 만드는 기본 클래스예요' },
        { t: 'name: str', d: '문자열 필드예요' },
        { t: 'age: int', d: '정수 필드예요' }
      ],
      why: '잘못된 데이터가 들어와도 틀이 맞는지 확인할 수 있어요.'
    }
  },
  {
    id: 'pprod-pydantic-field',
    lang: 'python',
    title: 'Pydantic Field 검증',
    file: 'models.py',
    code: `from pydantic import BaseModel, Field

class Item(BaseModel):
  name: str = Field(min_length=1, max_length=50)
  price: float = Field(gt=0)`,

    explain: {
      concept: 'Field는 각 칸의 규칙을 정해줘요. 이름 길이나 가격이 0보다 커야 한다는 식으로 문을 지키는 경비원 같아요.',
      terms: [
        { t: 'Field', d: '필드 규칙을 정하는 도구예요' },
        { t: 'min_length', d: '최소 글자 수예요' },
        { t: 'max_length', d: '최대 글자 수예요' },
        { t: 'gt=0', d: '0보다 큰(greater than) 값만 허용해요' }
      ],
      why: '규칙을 미리 정하면 나쁜 데이터가 들어오는 걸 막을 수 있어요.',
      pitfall: 'gt와 ge(이상)를 헷갈리면 0이 허용되거나 안 되는 차이가 생겨요.'
    }
  },
  {
    id: 'pprod-pydantic-validate',
    lang: 'python',
    title: 'Pydantic 모델 인스턴스 생성과 검증',
    file: 'models.py',
    code: `from pydantic import BaseModel, ValidationError

class User(BaseModel):
  name: str
  age: int

user = User(name="kim", age=20)
print(user.name)   # kim

try:
  User(name="lee", age="스물")
except ValidationError as e:
  print(e)`,

    explain: {
      concept: '틀을 만든 뒤 값을 넣으면 실제 객체가 만들어지고, 자동으로 검사도 돼요. 빵 틀에 반죽을 부으면 진짜 빵이 나오는 것과 같아요. 잘못된 값을 넣으면 ValidationError가 발생해요.',
      terms: [
        { t: 'User(...)', d: '틀에 값을 넣어 객체를 만드는 부분이에요' },
        { t: 'user.name', d: '만들어진 객체의 필드예요' },
        { t: 'ValidationError', d: '값이 틀에 맞지 않을 때 Pydantic이 발생시키는 오류예요' }
      ],
      why: '틀을 쓰면 데이터가 안전하게 만들어지고, 잘못된 값은 즉시 오류로 알 수 있어요.'
    }
  },
  {
    id: 'pprod-fastapi-pydantic-body',
    lang: 'python',
    title: 'FastAPI 요청 본문 검증',
    file: 'main.py',
    code: `from fastapi import FastAPI
from pydantic import BaseModel

app = FastAPI()

class User(BaseModel):
  name: str
  age: int

@app.post("/users")
async def create_user(user: User):
  return {"created": user.name}`,

    explain: {
      concept: 'POST 요청은 요청 본문(body)에 데이터를 담아 보내요. Pydantic 모델을 매개변수로 적으면 FastAPI가 자동으로 검사하고 파이썬 객체로 바꿔줘요.',
      terms: [
        { t: '@app.post', d: 'POST 방식 요청 표지판이에요' },
        { t: 'user: User', d: '본문을 User 틀로 검사하겠다는 뜻이에요' },
        { t: 'User', d: 'Pydantic으로 만든 데이터 틀이에요' }
      ],
      why: '본문 데이터를 직접 검증 코드 없이 안전하게 받을 수 있어요.',
      pitfall: '틀에 맞지 않으면 자동으로 422 오류가 돌아가요.'
    }
  },
  {
    id: 'pprod-fastapi-response-model',
    lang: 'python',
    title: 'FastAPI 응답 모델',
    file: 'main.py',
    code: `from fastapi import FastAPI
from pydantic import BaseModel

app = FastAPI()

class UserOut(BaseModel):
  name: str
  age: int

@app.get("/me", response_model=UserOut)
async def me():
  return {"name": "lee", "age": 30, "password": "secret"}`,

    explain: {
      concept: 'response_model은 돌려줄 데이터의 틀을 정해줘요. 틀에 없는 칸(예: 비밀번호)은 자동으로 잘려 나가요. 보안에 좋아요.',
      terms: [
        { t: 'response_model', d: '응답 결과의 틀이에요' },
        { t: 'UserOut', d: '밖으로 내보낼 데이터 틀이에요' },
        { t: '@app.get', d: 'GET 방식 요청을 받는 표지판이에요' }
      ],
      why: '민감한 정보가 응답에 섞여 나가는 걸 막을 수 있어요.'
    }
  },
  {
    id: 'pprod-sqlalchemy-engine',
    lang: 'python',
    title: 'SQLAlchemy 엔진 생성',
    file: 'db.py',
    code: `from sqlalchemy import create_engine

engine = create_engine("sqlite:///app.db")
conn = engine.connect()
print(conn)`,

    explain: {
      concept: 'create_engine은 데이터베이스와 연결하는 통로를 만들어요. 데이터베이스 주소만 넣으면 SQLAlchemy가 알아서 맞춰 작동해요.',
      terms: [
        { t: 'create_engine', d: 'DB 연결 통로를 만드는 함수예요' },
        { t: 'sqlite:///app.db', d: 'SQLite 파일 주소예요' },
        { t: 'engine.connect()', d: '실제 연결을 여는 동작이에요' }
      ],
      why: 'SQL을 직접 안 쓰고도 DB에 연결할 수 있어요.'
    }
  },
  {
    id: 'pprod-sqlalchemy-model',
    lang: 'python',
    title: 'SQLAlchemy 모델 정의',
    file: 'models.py',
    code: `from sqlalchemy.orm import declarative_base
from sqlalchemy import Column, Integer, String

Base = declarative_base()

class User(Base):
  __tablename__ = "users"
  id = Column(Integer, primary_key=True)
  name = Column(String(50))`,

    explain: {
      concept: 'SQLAlchemy 모델은 데이터베이스 표(table)를 파이썬 클래스로 표현해요. 클래스 하나가 표 하나, 속성이 칸(column)이 되는 셈이에요.',
      terms: [
        { t: 'declarative_base', d: '모델 클래스의 뼈대가 되는 Base예요' },
        { t: '__tablename__', d: 'DB에 만들 표 이름이에요' },
        { t: 'Column', d: '표의 칸을 정의해요' },
        { t: 'primary_key', d: '각 줄을 구분하는 기본키예요' }
      ],
      why: '클래스로 표를 정의하면 SQL을 직접 안 써도 돼요.'
    }
  },
  {
    id: 'pprod-sqlalchemy-session',
    lang: 'python',
    title: 'SQLAlchemy 세션 사용',
    file: 'db.py',
    code: `from sqlalchemy import create_engine, Column, Integer, String
from sqlalchemy.orm import declarative_base, sessionmaker

Base = declarative_base()

class User(Base):
  __tablename__ = "users"
  id = Column(Integer, primary_key=True)
  name = Column(String(50))

engine = create_engine("sqlite:///app.db")
Base.metadata.create_all(engine)

# SQLAlchemy 2.0 권장 방식: sessionmaker(engine)
Session = sessionmaker(engine)
session = Session()

user = User(name="park")
session.add(user)
session.commit()`,

    explain: {
      concept: '세션은 DB와 주고받는 작업 단위예요. add로 넣고 commit으로 확정하면 표에 저장돼요. 마치 장바구니에 담고 결제하는 것과 같아요.',
      terms: [
        { t: 'sessionmaker', d: '세션을 만드는 공장이에요. sessionmaker(engine) 형태로 사용해요' },
        { t: 'session.add', d: '데이터를 저장 대기열에 넣어요' },
        { t: 'session.commit', d: '대기 중인 변경을 DB에 확정해요' }
      ],
      why: '여러 변경을 한 번에 확정하면 안전하게 저장할 수 있어요.',
      pitfall: 'commit을 안 하면 데이터가 실제로 저장되지 않아요. SQLAlchemy 2.0부터 sessionmaker(bind=engine) 대신 sessionmaker(engine)을 사용해야 해요.'
    }
  },
  {
    id: 'pprod-sqlalchemy-query',
    lang: 'python',
    title: 'SQLAlchemy 쿼리 조회',
    file: 'db.py',
    code: `from sqlalchemy import create_engine, Column, Integer, String
from sqlalchemy.orm import declarative_base, sessionmaker

Base = declarative_base()

class User(Base):
  __tablename__ = "users"
  id = Column(Integer, primary_key=True)
  name = Column(String(50))

engine = create_engine("sqlite:///app.db")
Base.metadata.create_all(engine)
session = sessionmaker(engine)()

users = session.query(User).filter(User.name == "park").all()
for u in users:
  print(u.id, u.name)`,

    explain: {
      concept: 'query는 DB에서 자료를 찾아달라고 부탁하는 부분이에요. filter로 조건을 붙이고 all로 전부 가져와요. SQL을 몰라도 파이썬으로 표현할 수 있어요.',
      terms: [
        { t: 'session.query', d: 'DB에 조회를 요청하는 부분이에요' },
        { t: 'filter', d: '조건을 거는 함수예요' },
        { t: '.all()', d: '조건에 맞는 모든 결과를 가져와요' }
      ],
      why: '파이썬 코드로 안전하게 DB를 검색할 수 있어요.'
    }
  },
  {
    id: 'pprod-celery-task',
    lang: 'python',
    title: 'Celery 작업 정의',
    file: 'tasks.py',
    code: `from celery import Celery

app = Celery("app", broker="redis://localhost:6379/0")

@app.task
def add(x: int, y: int) -> int:
  return x + y`,

    explain: {
      concept: 'Celery는 오래 걸리는 일을 뒤에서 처리하게 해주는 도구예요. @app.task를 붙이면 그 함수가 "할 일"로 등록돼요. 택배 접수처 같아요.',
      terms: [
        { t: 'Celery', d: '백그라운드 작업 도구예요' },
        { t: 'broker', d: '할 일을 전달하는 중간역이에요' },
        { t: '@app.task', d: '이 함수를 작업으로 등록하는 표지예요' }
      ],
      why: '느린 작업을 뒤로 미루면 응답이 빨라져요.'
    }
  },
  {
    id: 'pprod-celery-delay',
    lang: 'python',
    title: 'Celery 작업 예약',
    file: 'main.py',
    code: `from tasks import add

result = add.delay(3, 4)
print(result.id)`,

    explain: {
      concept: 'delay는 등록한 작업을 "지금 당장 실행 큐에 넣어"라고 부르는 거예요. 실제로는 워커가 가져가서 처리하고 결과는 나중에 확인해요.',
      terms: [
        { t: 'add.delay', d: '작업을 큐에 넣는 호출이에요' },
        { t: 'result.id', d: '작업의 고유 번호예요' },
        { t: 'add', d: '이전에 @app.task로 등록한 작업 함수예요' }
      ],
      why: '작업을 즉시 실행하지 않고 나중에 처리하게 미룰 수 있어요.',
      pitfall: '워커가 켜져 있지 않으면 작업이 처리되지 않아요.'
    }
  },
  {
    id: 'pprod-redis-set-get',
    lang: 'python',
    title: 'Redis 값 저장/조회',
    file: 'cache.py',
    code: `import redis

r = redis.Redis(host="localhost", port=6379, db=0)
r.set("count", 1)
print(r.get("count"))`,

    explain: {
      concept: 'Redis는 빠른 메모리 저장소예요. set으로 값을 넣고 get으로 꺼내요. 메모장처럼 키-값으로 저장해요.',
      terms: [
        { t: 'redis.Redis', d: 'Redis 연결을 만드는 객체예요' },
        { t: 'r.set', d: '값을 저장하는 함수예요' },
        { t: 'r.get', d: '저장한 값을 꺼내는 함수예요' }
      ],
      why: '빠르게 읽고 쓸 수 있어서 임시 저장이나 캐시에 좋아요.',
      pitfall: 'r.get()은 문자열이 아닌 bytes를 반환해요. 문자열로 쓰려면 r.get("count").decode() 또는 Redis(decode_responses=True) 옵션을 사용해요.'
    }
  },
  {
    id: 'pprod-redis-ttl',
    lang: 'python',
    title: 'Redis 만료 시간 설정',
    file: 'cache.py',
    code: `import redis

r = redis.Redis(host="localhost", port=6379, db=0)
r.set("token", "abc", ex=60)
print(r.ttl("token"))`,

    explain: {
      concept: 'ex로 초 단위 만료 시간을 정하면 그 시간 뒤에 값이 사라져요. 유통기한을 단 음식처럼 자동으로 버려져요.',
      terms: [
        { t: 'ex=60', d: '60초 뒤 자동 삭제예요' },
        { t: 'r.ttl', d: '남은 수명(초)을 알려줘요' },
        { t: 'r.set', d: '값을 저장하는 함수예요' }
      ],
      why: '오래된 임시 데이터가 계속 쌓이는 걸 막을 수 있어요.'
    }
  },
  {
    id: 'pprod-pytest-basic',
    lang: 'python',
    title: 'pytest 기본 테스트',
    file: 'test_calc.py',
    code: `def add(a: int, b: int) -> int:
  return a + b

def test_add():
  assert add(2, 3) == 5`,

    explain: {
      concept: 'pytest는 함수가 예상대로 동작하는지 검사하는 도구예요. assert로 "이 결과가 맞아야 해"라고 단언하면, 틀릴 때 알려줘요.',
      terms: [
        { t: 'test_add', d: 'test로 시작하는 검사 함수예요' },
        { t: 'assert', d: '참이라고 단언하는 문장이에요' },
        { t: 'add(2, 3)', d: '검사하려고 부르는 함수 호출이에요' }
      ],
      why: '코드가 고장 났는지 자동으로 확인할 수 있어요.'
    }
  },
  {
    id: 'pprod-pytest-fixture',
    lang: 'python',
    title: 'pytest fixture 재사용',
    file: 'test_user.py',
    code: `import pytest

@pytest.fixture
def sample_user():
  return {"name": "kim", "age": 20}

def test_name(sample_user):
  assert sample_user["name"] == "kim"`,

    explain: {
      concept: 'fixture는 테스트마다 필요한 준비물을 재사용하게 해줘요. 마치 요리할 때 미리 손질해 둔 재료를 꺼내 쓰는 것과 같아요.',
      terms: [
        { t: '@pytest.fixture', d: '재사용할 준비물로 표시해요' },
        { t: 'sample_user', d: '테스트에 주입되는 준비 데이터예요' },
        { t: 'test_name', d: '준비물을 인자로 받아 쓰는 검사 함수예요' }
      ],
      why: '같은 준비 코드를 여러 테스트에서 반복하지 않아도 돼요.'
    }
  },
  {
    id: 'pprod-mypy-type-check',
    lang: 'python',
    title: 'mypy 타입 힌트 검사',
    file: 'main.py',
    code: `def greet(name: str) -> str:
  return "hi " + name

greet("kim")
greet(123)`,

    explain: {
      concept: 'mypy는 타입 힌트를 보고 틀린 사용을 찾아주는 정적 검사기예요. 코드를 실행하지 않고도 "여기 숫자 넣으면 안 돼"라고 알려줘요.',
      terms: [
        { t: 'name: str', d: '문자열만 받겠다는 힌트예요' },
        { t: '-> str', d: '문자열을 돌려준다는 힌트예요' },
        { t: 'greet(123)', d: 'mypy가 정수 사용을 오류로 표시해요' }
      ],
      why: '실행 전에 타입 실수를 미리 발견할 수 있어요.',
      pitfall: '이 코드를 그대로 실행하면 런타임에서도 TypeError가 발생해요. mypy는 실행 전에 이 문제를 미리 잡아준다는 점이 핵심이에요. 힌트가 없는 코드는 mypy가 검사하지 못해요.'
    }
  },
  {
    id: 'pprod-ruff-lint',
    lang: 'python',
    title: 'ruff 스타일 검사 대상',
    file: 'main.py',
    code: `import os, sys   # E401: 한 줄에 여러 모듈 import

def calculate(x):
  return x*2       # E226: 연산자 주변 공백 없음

# E741: 시각적으로 혼동되는 이름 (l, O, I)
l = 1
O = 2`,

    explain: {
      concept: 'ruff는 코드 스타일과 자주 틀리는 부분을 빠르게 찾아주는 도구예요. import 방식, 연산자 공백, 혼동되는 변수 이름 등을 지적해요.',
      terms: [
        { t: 'import os, sys', d: 'E401: 한 줄에 여러 모듈을 import하면 ruff가 경고해요' },
        { t: 'x*2', d: 'E226: 산술 연산자(*) 주위 공백이 없어요. ruff에서는 기본적으로 비활성화되어 있어 select=["E226"]을 추가해야 경고가 나타나요. x * 2 로 써야 해요' },
        { t: 'l = 1', d: 'E741: 소문자 l은 숫자 1과 헷갈려서 ruff가 금지해요' }
      ],
      why: '일관된 스타일로 코드를 읽기 쉽게 만들 수 있어요.',
      pitfall: 'ruff는 스타일만 검사하고 논리 오류는 잡지 않아요.'
    }
  }
];
