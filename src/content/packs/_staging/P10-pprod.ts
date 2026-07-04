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
  return {"message": "world"}

print("[실행] FastAPI 앱 생성 완료 - GET /hello")`,
    explain: {
      concept:
        'FastAPI는 파이썬으로 웹 API 서버를 가장 빠르게 만들 수 있는 현대적인 프레임워크예요. ' +
        '@app.get("/hello")은 "누군가 /hello 주소로 GET 요청을 보내면 이 함수를 실행해줘"라고 등록하는 표지판이에요. ' +
        'async def는 이 함수가 비동기(async)로 실행된다는 뜻으로, 여러 요청을 동시에 처리할 수 있게 해줘요. ' +
        'return에 딕셔너리를 반환하면 FastAPI가 자동으로 JSON으로 변환해서 응답을 보내줘요. ' +
        '실무에서는 REST API의 모든 엔드포인트를 이런 방식으로 정의하고, 자동 생성된 Swagger 문서(/docs)에서 바로 테스트할 수 있어요.',
      terms: [
        { t: 'FastAPI()', d: 'FastAPI 앱 객체를 생성해요. 모든 엔드포인트와 설정이 이 객체에 등록돼요.' },
        { t: '@app.get("/hello")', d: 'GET 방식으로 /hello 경로에 접근할 때 실행할 함수를 등록하는 데코레이터예요.' },
        { t: 'async def hello()', d: '비동기 핸들러 함수로, 여러 요청을 동시에 처리할 수 있게 해줘요.' },
        { t: 'return {"message": "world"}', d: 'JSON 응답으로 변환돼 클라이언트에 반환돼요. FastAPI가 자동 직렬화해요.' },
      ],
      why:
        'Flask보다 2~3배 빠르고, 자동 API 문서화와 입력 검증이 내장돼 있어서 현대적인 API 서버의 사실상 표준이 되고 있어요.',
      expectedOutput:
        '[실행] FastAPI 앱 생성 완료 - GET /hello\n' +
        '(서버 실행 시) uvicorn main:app --reload',
      realWorldUsage:
        '마이크로서비스 아키텍처에서 각 서비스(사용자·주문·결제)의 REST API 진입점을 FastAPI로 구성해요. ' +
        'GET /health 같은 헬스체크 엔드포인트도 이런 식으로 만들어서, 쿠버네티스가 서비스 상태를 주기적으로 확인하게 해요.',
      pitfall: '@app.get 데코레이터 아래 함수가 async def면 비동기로, 그냥 def면 동기로 실행돼요. DB 호출이나 외부 API 호출이 있는 함수는 반드시 async def + await를 사용해야 다른 요청을 막지 않아요.',
    },
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
  return {"user_id": user_id}

print("[실행] 경로 매개변수 등록 - /users/{user_id}")`,
    explain: {
      concept:
        '경로 매개변수(path parameter)는 URL 경로의 일부를 변수로 받아서 동적으로 처리하는 방식이에요. ' +
        '/users/123으로 요청이 오면 {user_id} 자리에 123이 들어가고, 함수의 user_id 매개변수로 전달돼요. ' +
        'user_id: int처럼 타입 힌트를 붙이면, FastAPI가 자동으로 문자열 "123"을 정수 123으로 변환해줘요. ' +
        '만약 /users/abc처럼 정수로 변환할 수 없는 값이 오면, FastAPI가 자동으로 422 Validation Error를 반환해요. ' +
        '실무에서는 리소스 ID로 특정 데이터를 조회할 때(예: GET /products/42, GET /orders/789) 가장 흔하게 쓰는 패턴이에요.',
      terms: [
        { t: '{user_id}', d: 'URL 경로에서 동적으로 변하는 부분을 중괄호로 표시해요. 함수 매개변수 이름과 일치해야 해요.' },
        { t: 'user_id: int', d: '타입 힌트를 붙여서 FastAPI가 자동 형변환과 검증을 하게 해요. int, str, uuid.UUID 등 가능해요.' },
        { t: 'async def get_user(user_id)', d: '경로 변수를 함수 매개변수로 받아 처리하는 비동기 핸들러예요.' },
        { t: '@app.get', d: 'GET 요청을 처리하는 엔드포인트를 등록하는 데코레이터예요.' },
      ],
      why:
        'RESTful API 설계에서 리소스 식별은 URL로 하는 게 원칙이에요. ' +
        '/users/123 같은 URL은 "123번 사용자"라는 의미를 URL 자체에 담아서 직관적이고 캐싱도 쉬워져요.',
      expectedOutput:
        '[실행] 경로 매개변수 등록 - /users/{user_id}\n' +
        '(GET /users/42 요청 시) {"user_id": 42}',
      realWorldUsage:
        '이커머스 API에서 GET /products/{product_id}로 상품 상세 정보를, GET /orders/{order_id}로 주문 상태를 조회해요. ' +
        '프론트엔드(React/Vue)가 상품 페이지에 들어갈 때 product_id를 URL에서 추출해 API를 호출하는 식이에요.',
      pitfall: '타입이 int인 경로에 /users/abc 같은 문자열이 들어오면 FastAPI가 422 오류를 자동 반환해요. 이건 FastAPI의 장점이지만, 클라이언트에게 명확한 오류 메시지가 전달되도록 커스텀 예외 핸들러를 등록하는 게 좋은 UX예요.',
    },
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
  return {"q": q, "limit": limit}

print("[실행] 쿼리 매개변수 등록 - /search?q=...&limit=...")`,
    explain: {
      concept:
        '쿼리 매개변수(query parameter)는 URL 끝에 ?key=value 형태로 추가 정보를 전달하는 방식이에요. ' +
        '경로 매개변수와 달리, 함수 시그니처의 매개변수 중 URL 경로({})에 포함되지 않은 것들은 자동으로 쿼리 매개변수로 인식돼요. ' +
        'limit: int = 10처럼 기본값을 지정하면 선택적(optional) 매개변수가 돼서, 클라이언트가 생략해도 기본값 10이 사용돼요. ' +
        '기본값이 없는 q: str는 필수 매개변수라서, /search?limit=5처럼 q를 빼먹으면 FastAPI가 422 오류를 반환해요. ' +
        '실무에서는 검색·필터링·페이지네이션·정렬 등 부가적인 요청 옵션을 전달할 때 쿼리 매개변수를 사용해요.',
      terms: [
        { t: 'q: str', d: '기본값이 없어서 필수로 받아야 하는 검색어 매개변수예요. ?q=검색어 형식으로 전달돼요.' },
        { t: 'limit: int = 10', d: '기본값이 10으로 설정된 선택적 매개변수예요. 클라이언트가 생략하면 10이 자동 적용돼요.' },
        { t: '@app.get("/search")', d: '경로에 쿼리 매개변수는 포함하지 않아요. 쿼리는 함수 시그니처로만 정의돼요.' },
        { t: 'async def search(q, limit)', d: 'URL 경로에 없는 매개변수는 자동으로 쿼리 매개변수로 인식되는 함수예요.' },
      ],
      why:
        '리소스의 정체성은 URL 경로로, 조회 옵션은 쿼리로 분리하는 게 REST 설계 원칙이에요. ' +
        '/search?q=파이썬&limit=20은 "검색 리소스에서 파이썬을 20개만 조회"라는 의미를 깔끔하게 표현해요.',
      expectedOutput:
        '[실행] 쿼리 매개변수 등록 - /search?q=...&limit=...\n' +
        '(GET /search?q=파이썬&limit=5 요청 시) {"q": "파이썬", "limit": 5}',
      realWorldUsage:
        '쇼핑몰 API에서 GET /products?category=전자제품&sort=price&page=2&size=20 같은 방식으로 ' +
        '카테고리 필터, 가격순 정렬, 페이지네이션을 쿼리 매개변수로 조합해서 다양한 조회 조건을 하나의 엔드포인트로 처리해요.',
      pitfall: '기본값이 없는 매개변수는 필수가 돼요. 필수 쿼리 매개변수가 빠진 요청은 422 오류를 내기 때문에, API 문서에 required 여부를 명확히 표시하고 클라이언트와 협의된 스펙을 유지해야 해요.',
    },
  },
  {
    id: 'pprod-pydantic-basemodel',
    lang: 'python',
    title: 'Pydantic BaseModel 정의',
    file: 'models.py',
    code: `from pydantic import BaseModel

class User(BaseModel):
  name: str
  age: int

print("[실행] Pydantic 모델 정의 완료")
print(f"[결과] 필드: {list(User.model_fields.keys())}")`,
    explain: {
      concept:
        'Pydantic의 BaseModel은 데이터의 구조와 타입을 파이썬 클래스로 선언하면 자동으로 검증·직렬화·문서화까지 해주는 데이터 모델링 도구예요. ' +
        '빵 굽는 틀처럼, 들어오는 데이터가 정해진 모양(name은 str, age는 int)에 맞는지 자동으로 확인해줘요. ' +
        'User(name="kim", age=20)처럼 값을 넣으면 age="스물" 같은 잘못된 타입은 즉시 ValidationError로 거부돼요. ' +
        'FastAPI와 함께 사용하면 요청 본문·응답 데이터의 검증을 자동화할 수 있어서, 별도의 if문 없이도 타입 안전성을 확보할 수 있어요. ' +
        '실무에서는 API 요청/응답 모델, DB 모델, 설정 파일 등 데이터가 흐르는 모든 지점에 Pydantic을 적용해서 타입 버그를 원천 차단해요.',
      terms: [
        { t: 'BaseModel', d: 'Pydantic 데이터 모델의 기본 클래스예요. 이걸 상속하면 자동 검증·직렬화 기능을 얻어요.' },
        { t: 'name: str', d: '문자열 타입으로 선언된 필드예요. int가 들어오면 ValidationError가 발생해요.' },
        { t: 'age: int', d: '정수 타입으로 선언된 필드예요. Pydantic이 문자열 "20"을 정수로 자동 변환도 해줘요(가능한 경우).' },
        { t: 'model_fields', d: '모델에 정의된 모든 필드 정보를 담고 있는 내장 속성이에요. 필드명, 타입, 기본값 등을 조회할 수 있어요.' },
      ],
      why:
        '파이썬은 동적 타입 언어라서 실행 전에는 타입 오류를 잡기 어려워요. Pydantic을 데이터 입구에 배치하면, ' +
        '잘못된 데이터가 시스템 깊숙이 들어가기 전에 걸러내서 디버깅 시간을 크게 줄일 수 있어요.',
      expectedOutput:
        '[실행] Pydantic 모델 정의 완료\n' +
        "[결과] 필드: ['name', 'age']",
      realWorldUsage:
        'FastAPI 프로젝트에서 모든 API의 Request Body와 Response를 Pydantic 모델로 정의해요. ' +
        'POST /users 요청이 {"name": 123, "age": "스물"}로 잘못 들어와도, Pydantic이 자동으로 422 Validation Error를 반환해서 잘못된 데이터가 DB에 저장되는 걸 막아줘요.',
      pitfall: 'Pydantic V1과 V2의 API 차이에 주의해야 해요. 예를 들어 V1의 .dict()는 V2에서 .model_dump()로 변경됐어요. 프로젝트에서 사용 중인 Pydantic 버전의 문서를 확인하고 코드를 작성하는 게 중요해요.',
    },
  },
  {
    id: 'pprod-pydantic-field',
    lang: 'python',
    title: 'Pydantic Field 검증',
    file: 'models.py',
    code: `from pydantic import BaseModel, Field

class Item(BaseModel):
  name: str = Field(min_length=1, max_length=50)
  price: float = Field(gt=0)

print("[실행] Field 제약조건 정의")
print(f"[결과] name: min={Item.model_fields['name'].metadata[0].min_length}")`,
    explain: {
      concept:
        'Field()는 Pydantic 모델의 각 필드에 검증 규칙(제약조건)을 추가하는 함수예요. ' +
        '빵 틀에 "이름은 1~50글자, 가격은 0보다 커야 한다"라는 규칙을 새겨두는 것과 같아요. ' +
        'min_length=1, max_length=50은 문자열 길이를 제한하고, gt=0은 0보다 큰 값(greater than)만 허용해요. ' +
        '이 규칙들은 단순히 검증뿐 아니라, FastAPI의 자동 문서(/docs)에도 반영돼서 API 사용자에게 제약조건을 명시적으로 알려줘요. ' +
        '실무에서는 이메일 형식(EmailStr), URL, 최소/최대값, 정규표현식 패턴 등 다양한 Field 제약조건으로 입력 데이터의 무결성을 보장해요.',
      terms: [
        { t: 'Field(...)', d: '필드에 제약조건과 메타데이터를 추가하는 Pydantic 함수예요. 기본값 설정도 여기서 해요.' },
        { t: 'min_length=1, max_length=50', d: '문자열 길이를 1~50자로 제한하는 제약조건이에요. 빈 문자열은 거부돼요.' },
        { t: 'gt=0', d: 'Greater Than - 0보다 큰 값만 허용해요. 0이나 음수는 거부되고 ValidationError가 발생해요.' },
        { t: 'Item.model_fields', d: '모델의 모든 필드 정의 정보를 조회할 수 있는 속성이에요. 제약조건 메타데이터도 포함돼요.' },
      ],
      why:
        'API로 들어오는 데이터를 신뢰할 수 없어요. 악의적인 사용자가 name=""나 price=-1000 같은 값을 보낼 수 있기 때문에, ' +
        '입구에서 제약조건으로 걸러내지 않으면 DB에 잘못된 데이터가 쌓이거나 비즈니스 로직이 깨질 수 있어요.',
      expectedOutput:
        '[실행] Field 제약조건 정의\n' +
        '[결과] name: min=1',
      realWorldUsage:
        '회원가입 API에서 username: str = Field(min_length=2, max_length=20, pattern=r"^[a-zA-Z0-9_]+$")처럼 정의하면, ' +
        '한 글자짜리 아이디나 특수문자가 포함된 아이디는 자동으로 거부되고, API 문서에도 제약조건이 자동 표시돼요.',
      pitfall: 'gt(초과)와 ge(이상)를 헷갈리지 않도록 주의해야 해요. gt=0은 0을 허용하지 않고, ge=0은 0을 허용해요. 무료 상품(price=0)을 허용할지 말지 같은 비즈니스 요구사항에 따라 정확한 조건을 선택해야 해요.',
    },
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

print("[실행] 모델 생성 - 정상 케이스")
user = User(name="kim", age=20)
print(f"[결과] name={user.name}, age={user.age}")

print("[실행] 모델 생성 - 오류 케이스")
try:
  User(name="lee", age="스물")
except ValidationError as e:
  print(f"[결과] 오류: {e}")`,
    explain: {
      concept:
        'Pydantic 모델 인스턴스 생성과 검증은 틀(BaseModel)에 값을 넣어 실제 객체를 만드는 순간 자동으로 일어나요. ' +
        'User(name="kim", age=20)라고 생성하면 Pydantic이 내부적으로 name은 str인지, age는 int인지 확인한 뒤 객체를 만들어줘요. ' +
        'age="스물"처럼 타입이 틀린 값이 들어오면 객체 생성 자체가 실패하고 ValidationError 예외가 발생해요. ' +
        '이 예외를 try/except로 잡아서 사용자에게 친절한 오류 메시지를 보여주거나 로그로 남길 수 있어요. ' +
        '실무에서는 API 요청 본문을 Pydantic 모델로 받아서, 잘못된 데이터가 들어오면 422 응답과 함께 어떤 필드가 왜 틀렸는지 상세히 알려줘요.',
      terms: [
        { t: 'User(name="kim", age=20)', d: '모델 생성자에 값을 넣으면 자동 검증 후 객체가 생성돼요. 틀에 값을 부어 객체를 찍어내는 과정이에요.' },
        { t: 'user.name', d: '생성된 객체의 필드에 접근해요. Pydantic이 보장한 타입으로 안전하게 사용할 수 있어요.' },
        { t: 'ValidationError', d: 'Pydantic 검증 실패 시 발생하는 예외예요. 어떤 필드가 왜 틀렸는지 상세 정보를 담고 있어요.' },
        { t: 'try/except ValidationError', d: '검증 실패를 우아하게 처리하는 예외 처리 패턴이에요. 422 응답으로 변환할 때 써요.' },
      ],
      why:
        '잘못된 데이터를 조기에 발견하지 못하면, DB에 엉뚱한 값이 저장되거나 비즈니스 로직이 중간에 터져서 ' +
        '디버깅이 훨씬 더 어려워져요. Pydantic이 입구에서 걸러주면 안전한 데이터만 시스템 내부로 흘러들어가요.',
      expectedOutput:
        '[실행] 모델 생성 - 정상 케이스\n' +
        '[결과] name=kim, age=20\n' +
        '[실행] 모델 생성 - 오류 케이스\n' +
        "[결과] 오류: 1 validation error for User\nage\n  Input should be a valid integer...",
      realWorldUsage:
        'FastAPI에서 POST /users 요청이 {"name": "kim", "age": "스물"}로 들어오면, FastAPI가 내부에서 User(**body)를 시도하다가 ValidationError를 잡아서 ' +
        '자동으로 HTTP 422 응답으로 변환해줘요. 개발자는 별도의 if문 없이도 완벽한 입력 검증이 가능해져요.',
      pitfall: 'Pydantic은 기본적으로 "가능하면 형변환을 시도"해요. age="20"은 int로 자동 변환돼서 통과하지만, age="스물"은 변환 불가로 오류가 나요. 자동 변환에 의존하기보다는 strict 모드나 Field(strict=True)로 엄격한 타입 검사를 적용하는 게 더 안전할 수 있어요.',
    },
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
  return {"created": user.name}

print("[실행] POST /users - Pydantic 본문 검증 등록")`,
    explain: {
      concept:
        'FastAPI와 Pydantic을 조합하면, POST 요청의 JSON 본문을 Pydantic 모델로 자동 검증하고 파이썬 객체로 변환할 수 있어요. ' +
        '매개변수에 user: User라고 타입 힌트를 적기만 해도, FastAPI가 요청 본문을 읽어서 User 모델로 변환하고 검증까지 해줘요. ' +
        '본문이 {"name": "kim", "age": 20}이면 깔끔하게 통과하고, {"name": 123}처럼 타입이 틀리면 자동으로 422 응답이 반환돼요. ' +
        '별도의 if-else 검증 코드가 전혀 필요 없어서, 컨트롤러 로직이 비즈니스 로직에만 집중할 수 있게 단순해져요. ' +
        '실무에서는 회원가입·주문·결제 등 데이터가 생성되는 모든 POST/PUT/PATCH 엔드포인트에 이 패턴을 적용해요.',
      terms: [
        { t: '@app.post("/users")', d: 'POST 방식 요청을 받는 엔드포인트를 등록하는 데코레이터예요. 리소스 생성에 사용돼요.' },
        { t: 'user: User', d: 'FastAPI가 요청 본문 JSON을 User 모델로 자동 변환·검증하도록 지시하는 타입 힌트예요.' },
        { t: 'User(BaseModel)', d: '요청 본문의 구조와 타입을 정의한 Pydantic 모델예요. name과 age가 필수 필드예요.' },
        { t: 'return {"created": user.name}', d: '검증 완료된 user 객체에서 name을 추출해 응답을 만들어요.' },
      ],
      why:
        '수동으로 request.json() 파싱하고 if type(x) != str 검사를 하는 건 지루하고 오류가 나기 쉬워요. ' +
        'FastAPI+Pydantic 조합이 이 모든 검증을 선언적으로 처리해줘서, 코드량이 70% 이상 줄고 버그도 크게 감소해요.',
      expectedOutput:
        '[실행] POST /users - Pydantic 본문 검증 등록\n' +
        '(POST /users body={"name":"kim","age":20}) -> {"created":"kim"}',
      realWorldUsage:
        '이커머스 주문 API에서 OrderCreate 모델에 상품ID, 수량, 배송지 주소를 Pydantic 필드로 정의해두면, ' +
        '프론트엔드가 잘못된 형식으로 보낸 주문 요청이 DB에 저장되기 전에 자동으로 차단돼서 데이터 무결성이 보장돼요.',
      pitfall: '요청 본문이 Pydantic 모델과 일치하지 않으면 FastAPI가 자동으로 422 응답을 보내요. 클라이언트가 이 응답을 제대로 처리할 수 있도록, 오류 응답 형식과 필드명을 문서화하고 공유하는 게 중요해요.',
    },
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
  return {"name": "lee", "age": 30, "password": "secret"}

print("[실행] GET /me - response_model 필터링 등록")`,
    explain: {
      concept:
        'response_model은 API가 클라이언트에 반환하는 응답 데이터의 틀을 정해주는 FastAPI 기능이에요. ' +
        '함수가 반환한 딕셔너리에 password 같은 필드가 있어도, response_model에 정의된 필드(name, age)만 응답에 포함되고 나머지는 자동으로 제외돼요. ' +
        '이게 특히 중요한 이유는 실수로 비밀번호·토큰·내부ID 같은 민감 정보가 응답에 섞여 나가는 것을 방지해주기 때문이에요. ' +
        '뿐만 아니라 응답 데이터를 Pydantic으로 다시 한 번 검증해서, 잘못된 타입의 데이터가 클라이언트에 전달되는 것도 막아줘요. ' +
        '실무에서는 UserIn(요청용)과 UserOut(응답용)을 분리해서, 같은 엔티티라도 노출할 필드와 숨길 필드를 모델 수준에서 통제해요.',
      terms: [
        { t: 'response_model=UserOut', d: '응답 데이터를 이 Pydantic 모델로 필터링·검증해서 반환하는 옵션이에요.' },
        { t: 'UserOut(BaseModel)', d: '외부에 노출할 필드만 정의한 응답 전용 모델이에요. password 같은 민감 필드는 제외돼요.' },
        { t: '"password": "secret"', d: '내부적으로 존재하지만 UserOut에 정의되지 않아 응답에서 자동 제외되는 민감 필드예요.' },
        { t: '@app.get("/me")', d: 'response_model이 적용된 GET 엔드포인트예요. 응답 자동 필터링이 동작해요.' },
      ],
      why:
        '보안 사고의 가장 흔한 원인 중 하나가 "의도치 않은 필드 노출"이에요. ORM 객체를 그대로 반환하다가 password_hash가 노출되는 사례가 많아요. ' +
        'response_model로 명시적으로 허용할 필드만 지정하는 화이트리스트(whitelist) 방식이 훨씬 안전해요.',
      expectedOutput:
        '[실행] GET /me - response_model 필터링 등록\n' +
        '(GET /me 응답) {"name": "lee", "age": 30}',
      realWorldUsage:
        '사용자 프로필 API에서 DB에는 password_hash, internal_id, is_admin 등이 있어도, ' +
        'UserOut에는 name, age, email 같은 공개 필드만 정의해서 응답을 보내요. ' +
        '실수로 ORM 객체 전체를 반환해도 Pydantic이 정의된 필드만 잘라내서 전송하기 때문에 보안 사고를 예방할 수 있어요.',
      pitfall: 'response_model을 지정하지 않으면 함수가 반환한 모든 데이터가 그대로 클라이언트에 노출돼요. ORM 객체를 그대로 return하면 password_hash, salt 등이 응답에 포함될 수 있어서, response_model은 항상 지정하는 습관을 들이는 게 좋아요.',
    },
  },
  {
    id: 'pprod-sqlalchemy-engine',
    lang: 'python',
    title: 'SQLAlchemy 엔진 생성',
    file: 'db.py',
    code: `from sqlalchemy import create_engine

print("[실행] SQLAlchemy 엔진 생성")
engine = create_engine("sqlite:///app.db")
conn = engine.connect()
print(f"[결과] 연결 객체: {conn}")`,
    explain: {
      concept:
        'SQLAlchemy 엔진(Engine)은 데이터베이스와의 모든 통신을 관리하는 핵심 연결 통로예요. ' +
        'create_engine()에 DB 주소(URL)만 넣으면, SQLAlchemy가 해당 DB 종류(SQLite·PostgreSQL·MySQL 등)에 맞는 드라이버를 자동으로 선택하고 연결 풀(pool)까지 설정해줘요. ' +
        '"sqlite:///app.db"는 현재 디렉토리에 app.db라는 파일 기반 SQLite DB를 사용한다는 의미예요. ' +
        'engine.connect()로 실제 연결 객체를 얻고, 이걸로 SQL을 실행하거나 세션을 생성할 수 있어요. ' +
        '실무에서는 PostgreSQL("postgresql://user:pass@host/dbname")이나 MySQL 같은 서버급 DB를 주로 사용하지만, 개발·테스트 단계에서는 SQLite를 많이 써요.',
      terms: [
        { t: 'create_engine()', d: 'DB 주소를 받아 연결 엔진 객체를 생성하는 함수예요. DB 종류를 자동 감지해서 드라이버를 설정해요.' },
        { t: '"sqlite:///app.db"', d: 'SQLite 데이터베이스 파일 URL이에요. /// 다음에 파일 경로를 지정해요.' },
        { t: 'engine.connect()', d: '실제 DB 연결을 열고 Connection 객체를 반환하는 메서드예요. 사용 후 close()가 필요해요.' },
        { t: 'conn', d: 'DB와 직접 통신하는 Connection 객체예요. SQL 실행, 트랜잭션 관리 등이 가능해요.' },
      ],
      why:
        'raw DB 드라이버(psycopg2, sqlite3 등)를 직접 쓰면 연결 관리, 풀링, 트랜잭션 처리를 수동으로 해야 해요. ' +
        'SQLAlchemy 엔진이 이 모든 걸 추상화해서, 어떤 DB를 쓰든 동일한 코드로 작업할 수 있어요.',
      expectedOutput:
        '[실행] SQLAlchemy 엔진 생성\n' +
        '[결과] 연결 객체: <sqlalchemy.engine.base.Connection object at 0x...>',
      realWorldUsage:
        'FastAPI 앱 시작 시점에 create_engine()으로 DB 엔진을 한 번만 생성하고, ' +
        '모든 요청에서 이 엔진을 재사용하면서 세션을 만들어 DB 작업을 처리해요. 엔진은 애플리케이션 생명주기 동안 단 하나만 유지하는 게 모범 사례예요.',
      pitfall: 'SQLite는 파일 기반이라 동시에 여러 프로세스가 쓰면 충돌이 날 수 있어요. 프로덕션 환경에서는 PostgreSQL이나 MySQL 같은 서버형 DB를 사용하고, SQLite는 개발·테스트 용도로만 제한하는 게 안전해요.',
    },
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
  name = Column(String(50))

print("[실행] SQLAlchemy 모델 정의")
print(f"[결과] 테이블명: {User.__tablename__}, 컬럼: id, name")`,
    explain: {
      concept:
        'SQLAlchemy 모델(ORM 모델)은 데이터베이스 테이블을 파이썬 클래스로 매핑(mapping)해주는 ORM(Object-Relational Mapping) 방식이에요. ' +
        '클래스 하나가 테이블 하나에 대응되고, 클래스 속성이 테이블 컬럼이 되며, 인스턴스가 테이블의 한 행(row)이 돼요. ' +
        'declarative_base()로 ORM의 뼈대가 되는 Base 클래스를 만들고, 이 Base를 상속한 클래스가 자동으로 테이블과 매핑돼요. ' +
        '__tablename__에 실제 DB에 생성될 테이블 이름을 문자열로 지정해요. ' +
        'primary_key=True는 이 컬럼이 각 행을 고유하게 식별하는 기본키임을 의미하며, DB가 자동으로 인덱스를 생성해요.',
      terms: [
        { t: 'declarative_base()', d: 'ORM 매핑을 위한 베이스 클래스를 생성하는 함수예요. 모든 모델이 이 Base를 상속해요.' },
        { t: '__tablename__', d: 'DB에 실제로 생성될 테이블의 이름을 지정하는 클래스 변수예요.' },
        { t: 'Column(Integer, primary_key=True)', d: '정수형 컬럼이면서 기본키(각 행의 고유 식별자)임을 정의해요. autoincrement가 기본 적용돼요.' },
        { t: 'Column(String(50))', d: '최대 50자까지 저장할 수 있는 문자열 컬럼을 정의해요. VARCHAR(50)에 해당해요.' },
      ],
      why:
        'SQL을 직접 문자열로 작성하면 오타·인젝션·DB 종속성 문제가 생겨요. ORM으로 클래스 기반 정의를 하면, ' +
        '파이썬 코드로 테이블을 안전하게 관리할 수 있고 DB 마이그레이션(Alembic)도 자동화할 수 있어요.',
      expectedOutput:
        '[실행] SQLAlchemy 모델 정의\n' +
        '[결과] 테이블명: users, 컬럼: id, name',
      realWorldUsage:
        '웹 서비스에서 사용자·주문·상품·결제 등 모든 도메인 엔티티를 SQLAlchemy 모델로 정의해요. ' +
        '이후 session.add(User(name="kim")) 같은 파이썬 코드로 DB에 데이터를 저장하고, SQL은 SQLAlchemy가 자동 생성해줘요.',
      pitfall: '__tablename__을 생략하거나 중복되게 지으면 테이블 생성/조회 시 오류가 발생해요. 대부분의 프로젝트에서는 테이블명을 복수형(users, orders)으로 하고, 클래스명은 단수형(User, Order)으로 하는 컨벤션을 따라요.',
    },
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

print("[실행] 세션 생성 및 데이터 추가")
Session = sessionmaker(engine)
session = Session()
user = User(name="park")
session.add(user)
session.commit()
print(f"[결과] 저장 완료 - User(id={user.id}, name={user.name})")`,
    explain: {
      concept:
        '세션(Session)은 데이터베이스와의 모든 작업(조회·추가·수정·삭제)을 하나의 작업 단위로 묶어 관리하는 핵심 객체예요. ' +
        '마치 장바구니처럼, add로 상품(데이터)을 담고 commit으로 결제(저장)를 확정하며, 문제가 있으면 rollback으로 취소할 수 있어요. ' +
        'sessionmaker(engine)는 세션을 찍어내는 공장(factory) 함수로, engine을 인자로 받아 Session 클래스를 반환해요. ' +
        'Base.metadata.create_all(engine)은 정의된 모든 모델 클래스에 해당하는 테이블을 DB에 실제로 생성하는 DDL 실행이에요. ' +
        'commit() 하기 전까지는 변경사항이 DB에 반영되지 않기 때문에, 여러 작업을 원자적으로 묶어서 처리할 수 있어요.',
      terms: [
        { t: 'sessionmaker(engine)', d: 'engine을 사용하는 Session 팩토리를 생성해요. SQLAlchemy 2.0 권장 문법이에요.' },
        { t: 'session = Session()', d: '실제 세션 인스턴스를 생성해요. 이 객체로 모든 DB 작업을 수행해요.' },
        { t: 'session.add(user)', d: '새 User 객체를 세션의 "저장 대기열"에 추가해요. 아직 DB에 저장되지는 않아요.' },
        { t: 'session.commit()', d: '대기열의 모든 변경사항을 DB에 영구 저장(커밋)해요. 이 순간 INSERT SQL이 실행돼요.' },
        { t: 'Base.metadata.create_all(engine)', d: '모델 정의를 읽고 실제 CREATE TABLE SQL을 실행해 테이블을 생성해요.' },
      ],
      why:
        'add만 하고 commit을 안 하면 데이터가 DB에 저장되지 않아요. 반대로, commit 없이 프로그램이 종료되면 변경사항이 모두 사라져요. ' +
        '세션의 commit/rollback을 명시적으로 관리하는 게 데이터 무결성의 핵심이에요.',
      expectedOutput:
        '[실행] 세션 생성 및 데이터 추가\n' +
        '[결과] 저장 완료 - User(id=1, name=park)',
      realWorldUsage:
        'FastAPI 요청마다 세션을 생성하고, 요청 처리 완료 후 commit, 오류 발생 시 rollback하는 패턴으로 DB 트랜잭션을 관리해요. ' +
        '주문 처리 API에서 재고 차감과 결제 기록을 한 세션에서 add하고, 둘 다 성공해야 commit하는 식으로 데이터 일관성을 보장해요.',
      pitfall: 'commit()을 호출하지 않으면 데이터가 DB에 영구 저장되지 않아요. 특히 try/except에서 오류 발생 시 rollback()을 호출하지 않으면, 실패한 작업이 세션에 남아 다음 commit() 때 같이 저장될 위험이 있어요.',
    },
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

print("[실행] 사용자 조회")
users = session.query(User).filter(User.name == "park").all()
for u in users:
  print(f"[결과] id={u.id}, name={u.name}")`,
    explain: {
      concept:
        'SQLAlchemy 쿼리(query)는 DB에서 데이터를 조회할 때 SQL 대신 파이썬 객체 지향 문법으로 조건을 표현할 수 있게 해줘요. ' +
        'session.query(User)는 "users 테이블에서 조회할게"라는 뜻이고, .filter(User.name == "park")는 "name이 park인 행만"이라는 WHERE 조건이에요. ' +
        '.all()은 조건에 맞는 모든 행을 User 객체 리스트로 반환하고, .first()는 첫 번째 행만, .one()은 정확히 하나일 때만 반환해요. ' +
        'SQL을 문자열로 작성하지 않아도 돼서, 오타나 SQL 인젝션 위험이 없고, IDE의 자동 완성과 타입 체크도 받을 수 있어요. ' +
        '실무에서는 복잡한 join, subquery, aggregate도 이 Query API로 표현할 수 있고, 안 되면 raw SQL도 함께 쓸 수 있어요.',
      terms: [
        { t: 'session.query(User)', d: 'User 모델에 매핑된 users 테이블을 대상으로 조회를 시작하는 구문이에요.' },
        { t: '.filter(User.name == "park")', d: 'WHERE name = "park" 조건을 객체 문법으로 표현한 부분이에요. SQL이 자동 생성돼요.' },
        { t: '.all()', d: '조건에 맞는 모든 결과를 리스트로 반환하는 메서드예요. 결과가 없으면 빈 리스트예요.' },
        { t: 'for u in users', d: '조회 결과(User 객체)를 하나씩 순회하면서 id와 name 속성에 접근해요.' },
      ],
      why:
        'SQL을 직접 문자열로 작성하면 컬럼명 오타가 런타임에 발견되고, DB 종류에 따라 SQL 문법이 달라져서 이식성이 떨어져요. ' +
        'ORM 쿼리 API는 컴파일 시점에 문법 오류를 잡고, DB 방언(dialect)에 맞는 SQL을 자동 생성해줘서 생산성이 크게 올라가요.',
      expectedOutput:
        '[실행] 사용자 조회\n' +
        '[결과] id=1, name=park',
      realWorldUsage:
        '관리자 대시보드에서 "최근 7일간 가입한 사용자 중 이메일 인증 안 한 사람"을 조회할 때, ' +
        'filter(User.created_at >= week_ago, User.email_verified == False) 같은 복합 조건을 파이썬으로 깔끔하게 표현하고, 페이징(.limit(20).offset(40))도 쉽게 추가할 수 있어요.',
      pitfall: '.filter()는 조건을 AND로 결합하고, 여러 번 호출해도 누적돼요. OR 조건은 or_()를, 복잡한 조건은 and_(), not_() 등 SQLAlchemy의 표현식 함수를 import해서 사용해야 해요.',
    },
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
  return x + y

print("[실행] Celery 작업 등록 완료")
print(f"[결과] 등록된 작업: {list(app.tasks.keys())}")`,
    explain: {
      concept:
        'Celery는 오래 걸리는 작업을 백그라운드에서 비동기로 처리할 수 있게 해주는 분산 작업 큐 시스템이에요. ' +
        '@app.task 데코레이터만 함수 위에 붙이면, 그 함수가 Celery 작업자(worker)가 처리할 "할 일"로 등록돼요. ' +
        'broker 파라미터는 작업을 전달하는 중간 매개자(메시지 브로커)의 주소로, Redis나 RabbitMQ를 주로 사용해요. ' +
        '호출자가 add(3, 4) 대신 add.delay(3, 4)로 호출하면, 작업이 즉시 실행되지 않고 브로커 큐에 들어가서 worker가 나중에 가져가 처리해요. ' +
        '실무에서는 이메일 발송, 이미지 처리, 데이터 집계, 외부 API 호출 등 응답 시간이 오래 걸리는 모든 작업에 Celery를 적용해요.',
      terms: [
        { t: 'Celery("app", broker=...)', d: 'Celery 앱 인스턴스를 생성해요. 첫 인자는 앱 이름, broker는 메시지 브로커 URL이에요.' },
        { t: 'broker', d: '작업을 큐에 넣고 worker가 가져갈 수 있게 중계하는 메시지 브로커예요. Redis, RabbitMQ가 대표적이에요.' },
        { t: '@app.task', d: '일반 함수를 Celery 작업으로 등록하는 데코레이터예요. 등록된 함수는 .delay()로 비동기 호출할 수 있어요.' },
        { t: 'add(x: int, y: int) -> int', d: '일반적인 타입 힌트가 있는 함수예요. @app.task가 붙으면 비동기 작업이 돼요.' },
      ],
      why:
        'HTTP 요청 안에서 5초 걸리는 이메일 발송을 동기로 처리하면, 사용자는 5초 동안 응답을 기다려야 하고 서버 자원도 낭비돼요. ' +
        'Celery로 백그라운드 처리하면 API는 즉시 응답하고, 무거운 작업은 worker가 비동기로 처리해요.',
      expectedOutput:
        '[실행] Celery 작업 등록 완료\n' +
        "[결과] 등록된 작업: ['celery.chord_unlock', 'tasks.add', ...]",
      realWorldUsage:
        'SNS 서비스에서 사진 업로드 시, API는 "업로드 접수 완료"로 즉시 응답하고, Celery worker가 백그라운드에서 ' +
        '이미지 리사이징(3종 사이즈), 워터마크 삽입, CDN 업로드를 순차 처리해요. 사용자는 업로드 후 바로 다른 작업을 할 수 있어요.',
      pitfall: 'Celery worker가 실행 중이지 않으면 작업이 큐에 쌓이기만 하고 실제로 처리되지 않아요. 서버 재시작 시 worker 자동 시작을 systemd나 supervisor로 설정하고, Flower 같은 모니터링 도구로 큐 상태를 상시 확인하는 게 필수예요.',
    },
  },
  {
    id: 'pprod-celery-delay',
    lang: 'python',
    title: 'Celery 작업 예약',
    file: 'main.py',
    code: `from tasks import add

print("[실행] Celery 작업 예약")
result = add.delay(3, 4)
print(f"[결과] 작업 ID: {result.id}")`,
    explain: {
      concept:
        'delay()는 Celery 작업을 동기 실행하지 않고, 브로커 큐에 밀어 넣어서 worker가 나중에 처리하게 하는 비동기 호출 방식이에요. ' +
        'add(3, 4)는 일반 함수처럼 즉시 실행·결과 반환하지만, add.delay(3, 4)는 작업을 큐에 등록하고 즉시 AsyncResult 객체를 반환해요. ' +
        'AsyncResult에는 작업의 고유 ID가 들어있어서, 이 ID로 나중에 작업 완료 여부나 결과를 조회할 수 있어요. ' +
        'API 요청 핸들러 안에서 delay()로 무거운 작업을 큐에 던지고 즉시 응답을 반환하는 패턴이 가장 흔한 사용 방식이에요. ' +
        '실무에서는 delay() 대신 apply_async()로 실행 시간 예약(countdown), 우선순위, 큐 지정 등 더 세밀한 제어를 할 수 있어요.',
      terms: [
        { t: 'add.delay(3, 4)', d: '작업을 브로커 큐에 비동기로 등록하는 메서드예요. 즉시 AsyncResult를 반환하고 논블로킹이에요.' },
        { t: 'result', d: 'AsyncResult 객체로, 작업 추적에 사용되는 ID와 상태 확인 메서드를 가지고 있어요.' },
        { t: 'result.id', d: '등록된 작업의 고유 식별자(UUID)예요. 이걸로 작업 상태를 추적하거나 결과를 나중에 조회할 수 있어요.' },
        { t: 'from tasks import add', d: '이전 예제에서 @app.task로 등록한 add 함수를 임포트해요.' },
      ],
      why:
        '사용자에게 빠른 응답을 주려면, API 요청 처리 시간을 최소화해야 해요. delay()로 시간이 오래 걸리는 작업을 응답 이후로 미루면, ' +
        '사용자는 "처리 중입니다"라는 즉시 응답을 받고, 실제 작업은 뒤에서 조용히 처리돼요.',
      expectedOutput:
        '[실행] Celery 작업 예약\n' +
        '[결과] 작업 ID: a1b2c3d4-e5f6-7890-abcd-ef1234567890',
      realWorldUsage:
        '보고서 생성 API에서 사용자가 "월간 매출 보고서 생성"을 요청하면, API는 report.generate.delay(user_id, month)로 작업을 큐에 던지고 ' +
        '즉시 {"status": "processing", "task_id": "xxx"}를 반환해요. 프론트엔드는 이 task_id로 폴링하면서 완료 여부를 확인하고, 완료되면 다운로드 링크를 표시해요.',
      pitfall: 'worker가 실행 중이어야 작업이 처리돼요. worker 없이 delay()만 호출하면 작업이 큐에 무한히 쌓이기만 하고, 사용자는 결과를 영원히 받지 못해요. worker 프로세스가 정상 동작 중인지 모니터링하는 체계가 반드시 필요해요.',
    },
  },
  {
    id: 'pprod-redis-set-get',
    lang: 'python',
    title: 'Redis 값 저장/조회',
    file: 'cache.py',
    code: `import redis

print("[실행] Redis set/get")
r = redis.Redis(host="localhost", port=6379, db=0)
r.set("count", 1)
val = r.get("count")
print(f"[결과] count={val}")`,
    explain: {
      concept:
        'Redis는 모든 데이터를 메모리에 저장하는 초고속 키-값 저장소로, set()으로 값을 저장하고 get()으로 값을 꺼내요. ' +
        '디스크 기반 DB보다 수백 배 빠른 읽기/쓰기 속도를 제공해서, 캐시·세션 저장소·실시간 랭킹·메시지 큐 등에 널리 사용돼요. ' +
        'redis.Redis()로 Redis 서버에 연결하고, db=0은 Redis의 논리적 데이터베이스 0번을 사용한다는 의미예요(Redis는 0~15번 DB를 지원해요). ' +
        'r.set("count", 1)로 count 키에 1을 저장하면, 이후 r.get("count")로 즉시 값을 가져올 수 있어요. ' +
        '실무에서는 API 응답 캐싱, 사용자 세션 저장, 속도 제한(rate limiting) 카운터, 실시간 순위표(leaderboard) 등 시간이 중요한 기능에 Redis를 사용해요.',
      terms: [
        { t: 'redis.Redis(host=..., port=..., db=0)', d: 'Redis 서버에 연결하는 클라이언트 객체를 생성해요. 기본 포트는 6379예요.' },
        { t: 'r.set("count", 1)', d: 'count라는 키에 값 1을 저장해요. 기존 값이 있으면 덮어쓰고, 모든 값을 바이트로 직렬화해요.' },
        { t: 'r.get("count")', d: 'count 키의 값을 가져와요. 반환값은 bytes 타입이라 디코딩이 필요할 수 있어요.' },
        { t: 'db=0', d: '사용할 Redis 논리 DB 번호예요. 0~15까지 있어서 환경별/목적별로 분리할 수 있어요.' },
      ],
      why:
        'DB에서 매번 조회하면 느리고 DB에 부하가 집중돼요. Redis에 한 번 조회한 결과를 캐싱해두면, ' +
        '동일한 요청은 1ms 이내에 응답할 수 있고 DB 부하도 수십 배 줄일 수 있어요.',
      expectedOutput:
        '[실행] Redis set/get\n' +
        '[결과] count=b\'1\'',
      realWorldUsage:
        '뉴스 사이트에서 "오늘의 인기 기사 TOP 10"을 매 요청마다 DB에서 COUNT(*) ORDER BY로 계산하면 DB 부하가 엄청나요. ' +
        '대신 1분마다 Redis에 결과를 캐싱해두면, 수백만 사용자가 접속해도 1ms 안에 응답할 수 있어요.',
      pitfall: 'r.get()은 bytes 타입을 반환해요. 문자열로 쓰려면 r.get("count").decode() 또는 Redis(decode_responses=True) 옵션을 연결 생성 시 적용해야 해요. 그렇지 않으면 b\'1\'처럼 bytes로 표시돼요.',
    },
  },
  {
    id: 'pprod-redis-ttl',
    lang: 'python',
    title: 'Redis 만료 시간 설정',
    file: 'cache.py',
    code: `import redis

print("[실행] Redis TTL 설정")
r = redis.Redis(host="localhost", port=6379, db=0)
r.set("token", "abc", ex=60)
remain = r.ttl("token")
print(f"[결과] 남은 TTL: {remain}초")`,
    explain: {
      concept:
        'Redis의 TTL(Time To Live)은 키에 유통기한을 설정해서, 지정된 시간이 지나면 자동으로 데이터가 삭제되게 하는 기능이에요. ' +
        '우유에 유통기한이 지나면 자동으로 버려지는 것처럼, ex=60으로 설정한 키는 60초 후 Redis가 알아서 메모리에서 제거해요. ' +
        'r.ttl("token")은 해당 키의 남은 수명을 초 단위로 반환하고, -1이면 만료 시간 없음, -2면 이미 삭제됐음을 의미해요. ' +
        'TTL은 로그인 세션·인증 토큰·일회용 인증번호(OTP)·캐시 데이터처럼 일정 시간 후 자동 폐기가 필요한 데이터에 필수예요. ' +
        '메모리는 한정돼 있어서, TTL 없이 모든 데이터를 무기한 저장하면 Redis 메모리가 가득 차서 장애가 발생할 수 있어요.',
      terms: [
        { t: 'ex=60', d: '키의 만료 시간을 60초로 설정해요. 60초 후 Redis가 이 키를 자동으로 삭제해요.' },
        { t: 'r.ttl("token")', d: 'token 키의 남은 수명을 초 단위로 반환해요. -1은 만료 없음, -2는 이미 만료됨을 의미해요.' },
        { t: 'r.set("token", "abc")', d: 'TTL과 함께 값을 저장하는 set 호출이에요. ex 외에 px(밀리초)도 사용할 수 있어요.' },
        { t: 'remain', d: 'ttl()이 반환한 남은 시간(초)을 저장하는 변수예요. 매 순간 줄어들어요.' },
      ],
      why:
        'Redis는 메모리 저장소라서 용량이 한정돼 있고 비용이 비싸요. TTL로 불필요한 데이터를 자동 청소하면, ' +
        '메모리를 효율적으로 사용할 수 있고 수동으로 삭제하는 코드도 필요 없어져요.',
      expectedOutput:
        '[실행] Redis TTL 설정\n' +
        '[결과] 남은 TTL: 60초',
      realWorldUsage:
        '사용자 로그인 세션을 Redis에 저장할 때 ex=3600(1시간)으로 설정하면, 사용자가 1시간 동안 활동이 없으면 자동 로그아웃돼요. ' +
        '비밀번호 재설정 링크도 ex=600(10분)으로 설정해서, 10분 지나면 링크가 만료되게 할 수 있어요.',
      pitfall: 'TTL이 이미 만료된 키에 ttl()을 호출하면 -2를 반환하고, 만료 시간이 설정되지 않은 키는 -1을 반환해요. 이 반환값을 0이나 None으로 착각하면 "만료된 키를 아직 살아있다"고 판단하는 버그가 생길 수 있어요.',
    },
  },
  {
    id: 'pprod-pytest-basic',
    lang: 'python',
    title: 'pytest 기본 테스트',
    file: 'test_calc.py',
    code: `def add(a: int, b: int) -> int:
  return a + b

print("[실행] add 함수 테스트")
assert add(2, 3) == 5
print(f"[결과] add(2, 3) == 5 통과")`,
    explain: {
      concept:
        'pytest는 파이썬에서 가장 널리 쓰이는 테스트 프레임워크로, assert 문장으로 "이 결과는 반드시 이 값이어야 해"라고 검증해요. ' +
        '함수 이름이 test_로 시작하면 pytest가 자동으로 테스트 함수로 인식하고 실행해줘요. ' +
        'assert 뒤의 조건이 True면 조용히 통과하고, False면 AssertionError와 함께 어떤 값이 기대와 달랐는지 상세히 보여줘요. ' +
        '별도의 TestCase 클래스 상속 없이 일반 함수로 테스트를 작성할 수 있어서 진입 장벽이 매우 낮아요. ' +
        '실무에서는 CI/CD 파이프라인(GitHub Actions 등)에서 pytest를 실행해서, 코드 변경이 기존 기능을 망가뜨리지 않았는지 자동으로 확인해요.',
      terms: [
        { t: 'def add(a, b)', d: '두 수를 더하는 간단한 함수예요. 테스트 대상이 되는 코드예요.' },
        { t: 'assert add(2, 3) == 5', d: 'add(2, 3)의 결과가 5인지 검증하는 단언문이에요. 틀리면 AssertionError가 발생해요.' },
        { t: 'def test_', d: 'test_로 시작하는 함수는 pytest가 자동으로 테스트 함수로 인식하는 명명 규칙이에요.' },
        { t: '== 5', d: '기대값(expected)을 명시해요. add()의 반환값이 이 값과 일치해야 테스트가 통과해요.' },
      ],
      why:
        '기능을 수정할 때마다 사람이 수동으로 모든 기능을 다시 확인하는 건 불가능해요. ' +
        '자동화된 테스트가 있으면 1분 만에 수백 개의 기능을 검증하고, 버그를 배포 전에 잡아낼 수 있어요.',
      expectedOutput:
        '[실행] add 함수 테스트\n' +
        '[결과] add(2, 3) == 5 통과',
      realWorldUsage:
        '결제 모듈을 수정할 때마다 "add(1000, 500) == 1500" 같은 기본 연산 테스트부터 "apply_discount(10000, "VIP") == 8000" 같은 비즈니스 로직 테스트까지 자동 실행돼서, ' +
        '할인율 계산 버그가 프로덕션에 배포되기 전에 CI 단계에서 발견돼요.',
      pitfall: '테스트 함수 이름은 반드시 test_로 시작해야 pytest가 인식해요. test_add()처럼 짓지 않으면 그냥 일반 함수로 취급돼서 테스트 실행 시 건너뛰어져요. 또한 테스트 파일명도 test_*.py 형식이어야 해요.',
    },
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

print("[실행] fixture 데이터 테스트")
def test_name(sample_user):
  assert sample_user["name"] == "kim"
print(f"[결과] sample_user['name'] == 'kim' 통과")`,
    explain: {
      concept:
        'pytest fixture는 여러 테스트에서 공통으로 필요한 준비 데이터나 객체를 재사용할 수 있게 해주는 의존성 주입(DI) 메커니즘이에요. ' +
        '요리할 때 미리 손질해둔 재료를 여러 요리에 꺼내 쓰는 것과 같아요. ' +
        '@pytest.fixture 데코레이터로 fixture 함수를 정의하고, 테스트 함수의 매개변수에 fixture 이름을 적으면 pytest가 자동으로 주입해줘요. ' +
        '매 테스트마다 fixture가 새로 실행돼서(기본 scope=function), 테스트 간 데이터 오염 없이 독립적인 실행이 보장돼요. ' +
        '실무에서는 DB 연결, API 클라이언트, 목(mock) 객체, 테스트용 설정 등 준비 코드를 fixture로 만들어 여러 테스트에서 재사용해요.',
      terms: [
        { t: '@pytest.fixture', d: '이 함수를 테스트에서 재사용 가능한 fixture로 등록하는 데코레이터예요.' },
        { t: 'def sample_user()', d: '테스트용 샘플 데이터를 생성하는 fixture 함수예요. {"name": "kim", "age": 20} 딕셔너리를 반환해요.' },
        { t: 'def test_name(sample_user)', d: 'fixture 이름(sample_user)을 매개변수로 받아 자동으로 주입받는 테스트 함수예요.' },
        { t: 'assert sample_user["name"] == "kim"', d: '주입된 fixture 데이터를 검증하는 단언문이에요.' },
      ],
      why:
        '공통 준비 코드를 여러 테스트에 복사·붙여넣기하면, 데이터 구조가 바뀔 때 수정할 곳이 너무 많아져요. ' +
        'fixture로 한 곳에 정의해두면, 수정도 한 번이면 되고 테스트 코드도 간결해져요.',
      expectedOutput:
        '[실행] fixture 데이터 테스트\n' +
        "[결과] sample_user['name'] == 'kim' 통과",
      realWorldUsage:
        '사용자 API 테스트 스위트에서 db_session fixture로 테스트용 DB 연결을, client fixture로 FastAPI TestClient를, auth_token fixture로 인증 토큰을 준비해두고, ' +
        '여러 테스트 함수에서 이 fixture들을 조합해서 "인증된 사용자가 프로필을 수정하는" 시나리오를 간결하게 검증해요.',
      pitfall: 'fixture 이름이 테스트 함수의 매개변수 이름과 정확히 일치해야 자동 주입이 동작해요. 오타가 나면 pytest가 "fixture를 찾을 수 없습니다"라는 오류를 내면서 fixture명 목록을 제안해줘요.',
    },
  },
  {
    id: 'pprod-mypy-type-check',
    lang: 'python',
    title: 'mypy 타입 힌트 검사',
    file: 'main.py',
    code: `def greet(name: str) -> str:
  return "hi " + name

print("[실행] greet 함수 호출")
greet("kim")
print(f"[결과] greet('kim') = 'hi kim'")
# greet(123)  # mypy가 이 라인에서 오류를 잡아줘요`,
    explain: {
      concept:
        'mypy는 파이썬 코드의 타입 힌트를 읽고 코드를 실행하지 않은 상태에서 타입 오류를 찾아주는 정적 타입 검사기예요. ' +
        'name: str은 "name은 반드시 문자열이어야 해"라는 힌트고, -> str은 "이 함수는 문자열을 반환해"라는 힌트예요. ' +
        'greet("kim")은 정상이지만, greet(123)에 mypy를 돌리면 "Argument 1 to greet has incompatible type int; expected str" 같은 오류를 실행 전에 알려줘요. ' +
        '자바스크립트의 TypeScript, 자바의 컴파일러처럼, 실행 전에 타입 관련 버그를 잡아내는 게 목적이에요. ' +
        '실무에서는 CI 파이프라인에 mypy를 포함시켜서, 타입 오류가 있는 코드는 아예 병합(merge)되지 않도록 설정해요.',
      terms: [
        { t: 'name: str', d: '매개변수 name이 문자열만 받아야 함을 나타내는 타입 힌트예요. mypy가 이걸 보고 검사해요.' },
        { t: '-> str', d: '함수가 문자열을 반환한다는 반환 타입 힌트예요. 반환값이 다르면 mypy가 경고해요.' },
        { t: 'greet("kim")', d: '타입이 일치하는 정상 호출이에요. mypy가 통과시켜요.' },
        { t: '# greet(123)', d: '주석 처리된 잘못된 호출이에요. 주석을 풀고 mypy를 돌리면 타입 오류가 발생해요.' },
      ],
      why:
        '파이썬은 동적 타입 언어라서, greet(None) 같은 실수가 런타임에 TypeError로 터지기 전까지는 알 수 없어요. ' +
        'mypy가 이런 실수를 코드 리뷰 단계에서 미리 잡아줘서, 프로덕션 오류를 20~30% 줄여준다는 연구 결과도 있어요.',
      expectedOutput:
        '[실행] greet 함수 호출\n' +
        "[결과] greet('kim') = 'hi kim'",
      realWorldUsage:
        'FastAPI 프로젝트에서 모든 함수에 타입 힌트를 작성하고, CI에서 mypy --strict로 검사해요. ' +
        '특히 ORM 모델, API 스키마, 서비스 레이어 간에 주고받는 데이터 타입이 정확한지 검증해서, None 참조 오류나 타입 불일치 버그를 사전에 차단해요.',
      pitfall: 'mypy는 타입 힌트가 없는 코드는 전혀 검사하지 않아요. 점진적으로 도입하려면 mypy.ini에서 check_untyped_defs = True를 설정해서 힌트가 없는 함수도 최소한의 검사를 하게 할 수 있어요.',
    },
  },
  {
    id: 'pprod-ruff-lint',
    lang: 'python',
    title: 'ruff 스타일 검사 대상',
    file: 'main.py',
    code: `import os, sys

def calculate(x):
  return x*2

l = 1
O = 2

print("[실행] ruff 스타일 검사 대상 코드")
print("이 코드는 ruff에게 지적받는 여러 스타일 위반을 포함하고 있어요")`,
    explain: {
      concept:
        'ruff는 파이썬 코드의 스타일과 잠재적 오류를 초고속으로 검사해주는 Rust 기반 린터(linter)예요. ' +
        'import os, sys는 E401(여러 모듈을 한 줄에 import)로 지적돼요 - import는 한 줄에 하나씩 써야 해요. ' +
        'x*2는 연산자 주변에 공백이 없어서 권장 스타일(x * 2)과 달라요. ' +
        'l = 1, O = 2는 각각 숫자 1/I, 숫자 0과 시각적으로 혼동되는 변수명이라 ruff가 E741로 금지해요. ' +
        '실무에서는 ruff check을 CI에 통합해서, 스타일 규칙을 위반한 코드가 main 브랜치에 들어오지 못하게 막아요.',
      terms: [
        { t: 'import os, sys', d: 'E401 위반이에요. ruff는 여러 모듈을 한 줄에 import하는 것을 금지해요. import os 후 newline import sys로 나눠야 해요.' },
        { t: 'x*2', d: '연산자(*) 주위에 공백이 없는 스타일 위반이에요. ruff의 E226 규칙이 x * 2로 수정하도록 지시해요.' },
        { t: 'l = 1, O = 2', d: 'E741 위반이에요. 소문자 l은 숫자 1과, 대문자 O는 숫자 0과 혼동되기 쉬워서 변수명으로 금지돼요.' },
        { t: 'ruff', d: 'Rust로 작성된 초고속 파이썬 린터예요. Flake8보다 10~100배 빠르고, 자동 수정(--fix)도 지원해요.' },
      ],
      why:
        '팀에서 코드 스타일이 제각각이면 코드 리뷰가 스타일 논쟁에 시간을 빼앗기고, 가독성도 떨어져요. ' +
        'ruff로 스타일을 강제하면 코드 리뷰는 로직에만 집중할 수 있고, 새로운 팀원도 일관된 스타일로 자연스럽게 적응해요.',
      expectedOutput:
        '[실행] ruff 스타일 검사 대상 코드\n' +
        '이 코드는 ruff에게 지적받는 여러 스타일 위반을 포함하고 있어요\n' +
        '(ruff check 실행 시: E401, E226, E741 위반 감지)',
      realWorldUsage:
        '모든 PR(Pull Request)에 ruff check이 자동 실행되는 GitHub Actions 워크플로우를 설정해두면, ' +
        '스타일 위반이 있는 PR은 CI가 빨간 불을 켜서 머지할 수 없게 막아줘요. 팀원 모두가 자연스럽게 일관된 코드 스타일을 유지하게 돼요.',
      pitfall: 'ruff는 스타일과 기본적인 오류 패턴만 검사하고, 논리 오류나 비즈니스 로직 버그는 찾지 못해요. ruff 통과 ≠ 버그 없음을 의미하지 않으니, pytest 같은 테스트 프레임워크와 함께 사용해야 완전한 품질 검증이 가능해요.',
    },
  },
];
