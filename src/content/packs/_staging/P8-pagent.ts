import type { Snippet } from '../../types';

export const pythonAgent: Snippet[] = [
  {
    id: 'pagent-toolcall-basic',
    lang: 'python',
    title: '도구 호출 기본 구조',
    file: 'tool_call_basic.py',
    code: `def get_weather(city: str) -> str:
  return f"{city} 날씨 맑음"

TOOLS = {
  "get_weather": get_weather,
}

def call_tool(name: str, args: dict):
  if name in TOOLS:
    return TOOLS[name](**args)
  return "알 수 없는 도구"

print("[실행] 도구 호출")
print(f"[결과] {call_tool('get_weather', {'city': '서울'})}")`,
    explain: {
      concept:
        '도구 호출(tool call)은 AI가 직접 할 수 없는 일(날씨 조회, 계산, 검색 등)을 외부 함수에 맡기는 구조예요. ' +
        'AI가 추론만으로는 실시간 날씨나 최신 뉴스를 알 수 없으니, 대신 도구를 통해 외부 세계와 연결돼요. ' +
        'TOOLS 딕셔너리에 도구 이름과 실제 함수를 연결해두고, call_tool이 이름을 받아 해당 함수를 실행해줘요. ' +
        '**args 문법은 딕셔너리의 키워드를 함수 매개변수로 풀어서 전달하는 파이썬 언패킹이에요. ' +
        '실무에서는 OpenAI Function Calling이나 Anthropic Tool Use와 정확히 같은 개념으로, AI가 "날씨 알려줘"라는 사용자 말을 듣고 스스로 get_weather 도구를 선택해 실행해요.',
      terms: [
        { t: 'TOOLS', d: '도구 이름(str)과 실행할 함수를 매핑한 딕셔너리예요. 에이전트의 "사용 가능한 도구 목록"이에요.' },
        { t: 'call_tool(name, args)', d: '도구 이름과 인자를 받아 실제 함수를 실행하는 디스패처 함수예요.' },
        { t: '**args', d: '딕셔너리를 풀어서 함수의 키워드 인자로 전달하는 파이썬 언패킹 문법이에요.' },
        { t: "'알 수 없는 도구'", d: '등록되지 않은 도구 이름이 들어왔을 때 반환하는 기본 응답이에요. graceful degradation을 위한 폴백이에요.' },
      ],
      why:
        'LLM은 학습 데이터에 없는 정보(실시간 날씨, 주식 가격, 사용자 개인 일정 등)를 알 수 없어요. ' +
        '도구 호출로 외부 API·DB와 연결해야 비로소 실제 쓸모 있는 AI 에이전트가 완성돼요.',
      expectedOutput:
        '[실행] 도구 호출\n' +
        '[결과] 서울 날씨 맑음',
      realWorldUsage:
        'ChatGPT 플러그인도 내부적으로 똑같은 구조로 동작해요. 사용자가 "내일 서울 날씨 어때?"라고 물으면, ' +
        'ChatGPT가 날씨 API를 호출할 도구를 선택하고, 그 결과를 바탕으로 "내일 서울은 맑고 25도입니다"라고 자연어 답변을 만들어요.',
      pitfall: '없는 도구 이름을 call_tool에 넘기면 KeyError 대신 "알 수 없는 도구" 문자열이 반환돼요. AI가 이걸 실제 결과로 착각할 수 있으니, 오류 응답과 실제 결과를 구분할 수 있는 구조(예: {"ok": False, "error": "..."})로 설계해야 해요.',
    },
  },
  {
    id: 'pagent-tool-schema',
    lang: 'python',
    title: '도구 스키마 정의',
    file: 'tool_schema.py',
    code: `SEARCH_SCHEMA = {
  "name": "search",
  "description": "웹에서 정보 검색",
  "parameters": {
    "type": "object",
    "properties": {
      "query": {"type": "string"}
    },
    "required": ["query"]
  }
}

def search(query: str) -> str:
  return f"결과: {query}"

print("[실행] 도구 스키마 확인")
print(f"[결과] 필수 파라미터: {SEARCH_SCHEMA['parameters']['required']}")`,
    explain: {
      concept:
        '도구 스키마(tool schema)는 AI가 도구를 올바르게 호출할 수 있도록, 도구가 어떤 입력을 받는지 미리 약속해둔 설명서예요. ' +
        '마치 식당 메뉴판에 "이 요리에는 이런 재료(매개변수)가 필요합니다"라고 적어두는 것과 같아요. ' +
        'OpenAI Function Calling API도 정확히 이 JSON Schema 형식으로 도구 정보를 전달받아요. ' +
        'name은 도구 식별자, description은 AI가 언제 이 도구를 써야 하는지 판단하는 근거, parameters는 필수/선택 인자를 정의해요. ' +
        'required 배열에 적힌 필드는 호출 시 반드시 포함해야 하고, 빠지면 AI가 잘못된 호출을 하게 돼요.',
      terms: [
        { t: 'SEARCH_SCHEMA', d: '도구의 이름, 설명, 입력 형태를 JSON Schema 형식으로 정의한 딕셔너리예요.' },
        { t: 'parameters', d: '도구가 받을 입력값의 타입, 필드명, 제약조건을 정의하는 스키마의 핵심 부분이에요.' },
        { t: 'required', d: '호출 시 반드시 포함해야 하는 필수 파라미터 이름 리스트예요.' },
        { t: "'type': 'object'", d: '파라미터의 최상위 타입이 객체(딕셔너리)임을 나타내요. OpenAI API 호환 형식이에요.' },
      ],
      why:
        '스키마가 없으면 AI는 어떤 값을 어떤 형식으로 넣어야 할지 몰라요. 스키마를 주면 AI가 "아, 이 도구는 query라는 문자열을 필수로 받는구나"라고 이해하고 정확한 호출을 할 수 있어요.',
      expectedOutput:
        '[실행] 도구 스키마 확인\n' +
        "[결과] ['query']",
      realWorldUsage:
        'OpenAI의 GPT-4에 도구를 등록할 때, SEARCH_SCHEMA 같은 JSON 객체를 tools 파라미터로 전달해요. ' +
        '그러면 사용자가 "최신 AI 뉴스 찾아줘"라고 말했을 때, GPT-4가 스스로 search 도구를 골라 query="최신 AI 뉴스"로 호출할 수 있어요.',
      pitfall: 'required에 포함된 파라미터는 호출 시 무조건 존재해야 하고 타입도 맞아야 해요. 그렇지 않으면 도구 실행이 실패하거나 AI가 오류 메시지를 받고 당황해서 엉뚱한 답변을 할 수 있어요.',
    },
  },
  {
    id: 'pagent-react-loop',
    lang: 'python',
    title: 'ReAct 사고-행동 반복',
    file: 'react_loop.py',
    code: `def get_weather(city: str) -> str:
  return f"{city} 날씨 맑음"

TOOLS = {"get_weather": get_weather}

def call_tool(name: str, args: dict):
  if name in TOOLS:
    return TOOLS[name](**args)
  return "알 수 없는 도구"

print("[실행] ReAct 루프 시작")
steps = []
question = "서울 오늘 날씨"
for i in range(3):
  thought = f"step {i}: {question}를 풀기 위해 도구 호출"
  action = "get_weather"
  observation = call_tool(action, {"city": "서울"})
  steps.append((thought, action, observation))
  if "맑음" in observation:
    print(f"[결과] step {i}에서 답 찾음: {observation}")
    break`,
    explain: {
      concept:
        'ReAct(Reasoning + Acting)는 생각(Thought) -> 행동(Action) -> 관찰(Observation) 세 단계를 반복하면서 문제를 해결하는 AI 에이전트 패턴이에요. ' +
        '길을 찾을 때 "아마 왼쪽일 거야(생각)" -> 걸어가 보고(행동) -> "여기가 맞네/아니네(관찰)"을 반복하는 것과 똑같아요. ' +
        '한 번에 정답을 몰라도, 점진적으로 정보를 쌓아가면서 답에 도달하는 게 핵심 아이디어예요. ' +
        '관찰 결과가 만족스러우면(여기서는 "맑음" 확인) 루프를 break로 탈출해서 불필요한 반복을 막아요. ' +
        '실무에서는 LangChain의 AgentExecutor, AutoGen, CrewAI 같은 주요 에이전트 프레임워크가 모두 이 ReAct 패턴을 기반으로 동작해요.',
      terms: [
        { t: 'thought', d: '지금 무엇을 해야 할지 AI가 스스로 추론한 생각이에요. ReAct의 첫 번째 R(Reasoning) 단계예요.' },
        { t: 'action', d: '생각을 바탕으로 선택한 도구 이름이에요. get_weather 같은 구체적인 행동으로 이어져요.' },
        { t: 'observation', d: '도구를 실행하고 받은 결과예요. 이 관찰을 바탕으로 다음 생각을 결정해요.' },
        { t: 'range(3)', d: '최대 반복 횟수를 3회로 제한하는 안전장치예요. 무한 루프 방지를 위해 반드시 필요해요.' },
      ],
      why:
        '복잡한 질문(예: "서울보다 더운 도시 중 인구 100만 이상인 곳의 관광명소는?")은 한 번의 도구 호출로 답할 수 없어요. ' +
        'ReAct로 여러 도구를 단계적으로 호출하면서 정보를 조합해야 비로소 답을 만들 수 있어요.',
      expectedOutput:
        '[실행] ReAct 루프 시작\n' +
        '[결과] step 0에서 답 찾음: 서울 날씨 맑음',
      realWorldUsage:
        '연구 보조 AI가 "2025년 Nature에 발표된 mRNA 백신 관련 논문 중 피인용 수 top 3 요약해줘"라는 질문을 받으면, ' +
        '1) 검색 도구로 논문 목록 찾기(Thought->Action->Obs) -> 2) 피인용 수 조회 도구로 순위 매기기 -> 3) 요약 도구로 각 논문 요약하기 식으로 ReAct 루프를 돌며 순차 해결해요.',
      pitfall: '반복 횟수 제한(max_iter)이 없으면 무한 루프에 빠질 수 있어요. 실제 LLM 기반 ReAct에서는 토큰 비용도 고려해서 보통 5~10회로 제한하고, 그래도 답을 못 찾으면 "답을 찾지 못했습니다"라고 포기하게 설계해요.',
    },
  },
  {
    id: 'pagent-memory-short',
    lang: 'python',
    title: '단기 메모리 저장',
    file: 'memory_short.py',
    code: `memory = []

def remember(text: str):
  memory.append(text)
  if len(memory) > 5:
    memory.pop(0)

def recall() -> list:
  return list(memory)

print("[실행] 단기 메모리 테스트")
remember("첫 대화")
remember("둘째 대화")
print(f"[결과] 기억 중: {recall()}")`,
    explain: {
      concept:
        '단기 메모리(short-term memory)는 최근 대화 내용만 제한된 개수만큼 잠깐 기억해두는 버퍼예요. ' +
        '마치 계산대에 방금 받은 주문서 몇 장만 올려두는 것처럼, 최근 문맥만 유지하고 오래된 건 버려요. ' +
        'LLM은 한 번에 처리할 수 있는 컨텍스트 길이가 제한돼 있어서, 계속 쌓이는 대화를 전부 기억할 수 없어요. ' +
        'pop(0)로 가장 오래된 항목을 앞에서 빼내면서, 항상 최근 5개만 유지하는 슬라이딩 윈도우 방식이에요. ' +
        'recall()에서 list(memory)로 복사본을 반환하는 이유는 외부에서 원본 리스트를 실수로 수정하는 걸 방지하기 위해서예요.',
      terms: [
        { t: 'memory', d: '최근 대화 내용을 순서대로 저장하는 리스트예요. 모듈 레벨 변수로 선언돼 있어요.' },
        { t: 'remember(text)', d: '새 대화 내용을 메모리 끝에 추가하고, 5개 초과 시 가장 오래된 항목을 제거하는 함수예요.' },
        { t: 'pop(0)', d: '리스트의 첫 번째 요소(가장 오래된 항목)를 제거하는 메서드예요. FIFO(선입선출) 방식이에요.' },
        { t: 'list(memory)', d: '원본 memory 리스트의 복사본을 만들어 반환해요. 외부 변조로부터 보호하는 방어적 복사예요.' },
      ],
      why:
        '대화형 AI는 이전 대화 내용을 알아야 맥락에 맞는 답변을 할 수 있어요. 하지만 모든 대화를 영원히 기억하면 토큰 한도를 초과해서 비용이 급증하거나, 모델이 오래된 정보에 혼란을 일으킬 수 있어요.',
      expectedOutput:
        '[실행] 단기 메모리 테스트\n' +
        "[결과] 기억 중: ['첫 대화', '둘째 대화']",
      realWorldUsage:
        '챗봇이 사용자와 대화할 때, 직전 5턴까지의 대화를 단기 메모리에 저장해서 "아까 말씀하신 그 영화" 같은 문맥 의존적 표현을 이해해요. ' +
        '슬라이딩 윈도우 방식이라, 대화가 길어져도 메모리 사용량과 API 비용이 일정하게 유지돼요.',
      pitfall: '오래된 항목을 무조건 버리기 때문에, 초반에 언급된 중요한 정보(예: "내 이름은 지훈이야")도 사라질 수 있어요. 장기적으로 중요한 정보는 장기 메모리(별도 저장소)에 따로 보관하는 구조가 필요해요.',
    },
  },
  {
    id: 'pagent-memory-long',
    lang: 'python',
    title: '장기 메모리 저장소',
    file: 'memory_long.py',
    code: `store = {}

def save(key: str, value: str):
  store[key] = value

def load(key: str) -> str:
  return store.get(key, "기억 없음")

print("[실행] 장기 메모리 저장")
save("사용자_이름", "지훈")
print(f"[결과] {load('사용자_이름')}")`,
    explain: {
      concept:
        '장기 메모리(long-term memory)는 여러 대화 세션을 걸쳐 보존해야 할 중요한 정보를 키-값 형태로 영구 보관하는 저장소예요. ' +
        '전화번호부에 이름과 전화번호를 적어두는 것처럼, 사용자의 이름·선호도·중요 사실 등을 저장해둬요. ' +
        'dict.get(key, default)를 사용하면 키가 없을 때도 "기억 없음"이라는 안전한 기본값을 반환해서 KeyError를 방지해요. ' +
        '단기 메모리와 달리 세션이 끝나도 정보가 보존되는 게 핵심 차이예요. ' +
        '실무에서는 이 딕셔너리를 SQLite, Redis, 또는 벡터DB로 대체해서 대규모·영속적 장기 메모리를 구현해요.',
      terms: [
        { t: 'store', d: '키와 값을 쌍으로 보관하는 딕셔너리예요. 장기 보관이 필요한 정보를 담아요.' },
        { t: 'save(key, value)', d: '키와 값을 딕셔너리에 저장하는 함수예요. 같은 키면 덮어쓰기로 갱신돼요.' },
        { t: 'load(key)', d: '키에 해당하는 값을 반환하는 함수예요. get()으로 키가 없을 때 기본값을 안전하게 처리해요.' },
        { t: 'dict.get(key, "기억 없음")', d: '키가 존재하면 그 값을, 없으면 "기억 없음"을 반환하는 안전한 딕셔너리 조회 방식이에요.' },
      ],
      why:
        '사용자가 어제 "내 이름은 지훈이야"라고 말했는데 오늘 다시 "처음 뵙겠습니다"라고 하면 나쁜 UX예요. ' +
        '장기 메모리로 사용자 정보를 저장해두면 더 자연스럽고 개인화된 대화가 가능해져요.',
      expectedOutput:
        '[실행] 장기 메모리 저장\n' +
        '[결과] 지훈',
      realWorldUsage:
        'AI 비서 서비스에서 사용자의 생일, 주소, 선호 장르, 주요 일정 등을 장기 메모리에 저장해요. ' +
        '나중에 "내 생일에 가까운 영화관에서 상영 중인 SF 영화 추천해줘"라고 하면, 저장된 정보를 바탕으로 맞춤형 추천을 할 수 있어요.',
      pitfall: '같은 키에 save()를 다시 호출하면 이전 값이 조용히 덮어써져요(upsert). 덮어쓰기 전에 확인이 필요하면 해당 키 존재 여부를 먼저 체크하는 로직을 추가하는 게 안전해요.',
    },
  },
  {
    id: 'pagent-plan-decompose',
    lang: 'python',
    title: '작업 분해 계획',
    file: 'plan_decompose.py',
    code: `goal = "여행 계획 세우기"
plan = [
  "날짜 정하기",
  "목적지 선정",
  "숙소 예약",
  "일정 작성"
]

def next_step(done: int) -> str:
  if done < len(plan):
    return plan[done]
  return "완료"

print("[실행] 작업 분해")
print(f"[결과] 첫 단계: {next_step(0)}")`,
    explain: {
      concept:
        '작업 분해(plan decomposition)는 큰 목표 하나를 작은 하위 작업들로 쪼개서 순차적으로 해결하는 전략이에요. ' +
        '책 한 권을 챕터별로 나눠 읽는 것처럼, 복잡한 목표를 한 번에 해결하려고 덤비지 않고 단계별로 접근해요. ' +
        'plan 리스트에 미리 정해진 순서대로 하위 작업을 나열해두고, next_step(done)으로 현재 몇 개나 끝냈는지에 따라 다음 작업을 알려줘요. ' +
        '실무에서는 LLM이 스스로 plan을 동적으로 생성하고, 각 단계를 ReAct 루프로 실행하는 구조로 확장돼요. ' +
        '계획 기반 에이전트(Plan-and-Execute)는 복잡한 멀티스텝 작업에서 ReAct보다 더 체계적으로 동작하는 최신 패턴이에요.',
      terms: [
        { t: 'goal', d: '최종적으로 달성하려는 큰 목표를 담은 변수예요. 에이전트가 무엇을 위해 일하는지 정의해요.' },
        { t: 'plan', d: '목표를 달성하기 위한 작은 단계들의 순서 있는 리스트예요. 각 단계는 하나의 구체적인 행동이에요.' },
        { t: 'next_step(done)', d: '현재까지 완료한 단계 수를 인자로 받아, 다음에 실행할 단계 문자열을 반환하는 함수예요.' },
        { t: 'done < len(plan)', d: '아직 처리할 단계가 남았는지 확인하는 조건이에요. 모든 단계가 끝나면 "완료"를 반환해요.' },
      ],
      why:
        '"여행 계획 세우기"처럼 큰 작업을 한 번에 처리하려면 무엇부터 해야 할지 막막해요. 작게 쪼개면 각 단계를 독립적으로 실행하고, 중간에 실패해도 해당 단계만 다시 하면 돼요.',
      expectedOutput:
        '[실행] 작업 분해\n' +
        '[결과] 첫 단계: 날짜 정하기',
      realWorldUsage:
        '코드 생성 AI가 "사용자 인증 기능 만들어줘"라는 요청을 받으면, 내부적으로 1) DB 스키마 설계 -> 2) 회원가입 API -> 3) 로그인 API -> 4) JWT 토큰 발급 -> 5) 테스트 코드 순서로 plan을 세우고 하나씩 실행해요.',
      pitfall: '단계 순서가 잘못되면(예: 숙소 예약이 목적지 선정보다 앞에 오면) 뒷단계가 앞단계의 결과를 필요로 할 때 문제가 생겨요. 작업 간 의존성(dependency)을 고려한 순서 배치가 핵심이에요.',
    },
  },
  {
    id: 'pagent-plan-execute',
    lang: 'python',
    title: '계획 실행 추적',
    file: 'plan_execute.py',
    code: `plan = ["조사", "요약", "보고"]
status = {}

def execute(index: int):
  task = plan[index]
  status[task] = "done"
  return task

def progress() -> float:
  done = sum(1 for v in status.values() if v == "done")
  return done / len(plan)

print("[실행] 계획 실행")
execute(0)
print(f"[결과] 진행률: {progress():.0%}")`,
    explain: {
      concept:
        '계획 실행 추적은 각 하위 작업의 완료 여부를 기록하고 전체 진행률을 계산해서 보여주는 기능이에요. ' +
        '체크리스트에 완료 표시해가며 진척도를 한눈에 파악하는 것과 같아요. ' +
        'status 딕셔너리에 작업마다 "done" 상태를 기록하고, progress()가 done 개수를 세서 0~1 사이 진행률로 변환해요. ' +
        'sum(1 for v in status.values() if v == "done")은 제너레이터 표현식으로 조건부 카운팅을 깔끔하게 구현한 예시예요. ' +
        '실무 에이전트 시스템에서는 이 진행률을 사용자에게 실시간으로 보여주거나, 100% 도달 시 다음 페이즈로 넘어가는 트리거로 사용해요.',
      terms: [
        { t: 'status', d: '각 작업(task)을 키로, 완료 상태("done")를 값으로 저장하는 추적용 딕셔너리예요.' },
        { t: 'execute(index)', d: 'plan의 index번째 작업을 실행하고 status에 완료로 기록하는 함수예요.' },
        { t: 'progress()', d: '실행 완료된 작업 수를 전체 작업 수로 나눠 0~1 사이 진행률을 반환하는 함수예요.' },
        { t: "sum(1 for v in status.values() if v == 'done')", d: 'done 상태인 값의 개수를 세는 제너레이터 표현식이에요.' },
      ],
      why:
        '진행률을 알면 사용자에게 "현재 3/5 단계 완료(60%)" 같은 피드백을 줄 수 있고, ' +
        '에이전트 자신도 얼마나 더 일해야 하는지 판단할 수 있어요. 특히 오래 걸리는 배치 작업에서 UX가 크게 좋아져요.',
      expectedOutput:
        '[실행] 계획 실행\n' +
        '[결과] 진행률: 33%',
      realWorldUsage:
        '자동 보고서 생성 에이전트가 "데이터 수집 -> 분석 -> 시각화 -> PDF 생성" 단계를 실행할 때, ' +
        '각 단계 완료 시 진행률을 대시보드에 표시해서 사용자가 기다리는 동안 진행 상황을 확인할 수 있어요.',
      pitfall: '같은 단계를 두 번 execute() 해도 status는 덮어쓰기라서 중복 카운팅은 안 되지만, 이미 완료된 단계를 다시 실행하는 낭비가 발생할 수 있어요. 실행 전 status 확인 로직을 추가하는 게 좋아요.',
    },
  },
  {
    id: 'pagent-reflection-check',
    lang: 'python',
    title: '결과 반성 검토',
    file: 'reflection_check.py',
    code: `def reflect(answer: str, goal: str) -> str:
  issues = []
  if len(answer) < 5:
    issues.append("너무 짧음")
  if goal not in answer:
    issues.append("목표 누락")
  if issues:
    return "다시 시도: " + ", ".join(issues)
  return "통과"

print("[실행] 답변 검토")
print(f"[결과] {reflect('짧은 답', '완벽한 설명')}")`,
    explain: {
      concept:
        '반성(reflection)은 AI가 스스로 생성한 답변이 목표에 부합하는지 스스로 점검하고 문제점을 찾아내는 메타인지 단계예요. ' +
        '숙제를 다 쓴 뒤 다시 읽어보며 틀린 곳에 밑줄을 긋는 것과 같아요. ' +
        '검사 항목(길이, 목표 포함 여부 등)을 미리 정해두고, 통과하지 못하면 어떤 문제가 있었는지 구체적인 피드백을 반환해요. ' +
        '" , ".join(issues)로 여러 문제점을 하나의 문자열로 합쳐서 반환해요. ' +
        '실무에서는 LLM에게 "너의 답변을 비판적으로 평가해줘"라는 프롬프트를 줘서 더 정교한 자기 반성을 유도하고, Reflection Agent 패턴으로 발전시켜요.',
      terms: [
        { t: 'reflect(answer, goal)', d: '답변과 목표를 비교해 문제점을 찾아내는 평가 함수예요.' },
        { t: 'issues', d: '발견된 문제점 문자열들을 모아두는 리스트예요. 비어 있으면 통과를 의미해요.' },
        { t: "' , '.join(issues)", d: '문제점 리스트를 쉼표로 연결해 하나의 피드백 문자열로 만들어요.' },
        { t: 'len(answer) < 5', d: '답변이 너무 짧으면 불충분하다고 판단하는 기준이에요. 실무에서는 더 다양한 척도를 써요.' },
      ],
      why:
        'LLM은 때때로 자신감 있게 틀린 답을 말해요(환각). 출력 전에 한 번 더 스스로 검토하게 하면, ' +
        '오답이나 불완전한 답변이 그대로 사용자에게 전달되는 걸 상당히 줄일 수 있어요.',
      expectedOutput:
        '[실행] 답변 검토\n' +
        '[결과] 다시 시도: 너무 짧음, 목표 누락',
      realWorldUsage:
        '고객 응대 챗봇이 답변을 생성한 후, reflect 단계에서 "회사 정책에 부합하는가?", "불친절한 표현은 없는가?"를 자체 점검해요. ' +
        '문제가 발견되면 다시 생성을 시도하거나, 심각하면 사람 상담사에게 에스컬레이션해요.',
      pitfall: '검사 기준이 너무 느슨하면 문제를 전혀 못 잡고, 너무 엄격하면 아무 답변도 통과하지 못해 무한 재시도 루프에 빠질 수 있어요. 적절한 기준은 실제 서비스 데이터로 튜닝해야 해요.',
    },
  },
  {
    id: 'pagent-reflection-retry',
    lang: 'python',
    title: '반성 후 재시도',
    file: 'reflection_retry.py',
    code: `def improve(answer: str, feedback: str) -> str:
  if "짧음" in feedback:
    answer = answer + " 자세히 덧붙임"
  if "목표 누락" in feedback:
    answer = answer + " (목표 반영)"
  return answer

print("[실행] 피드백 기반 개선")
result = "답"
result = improve(result, "짧음")
print(f"[결과] {result}")`,
    explain: {
      concept:
        '반성 후 재시도(reflection + retry)는 앞서 찾은 문제점을 바탕으로 답변을 구체적으로 개선하는 단계예요. ' +
        '선생님의 첨삭 피드백을 받고 글을 고쳐 쓰는 것처럼, 피드백 내용을 분석해서 답변의 약점을 보강해요. ' +
        '이 예제에서는 "짧음" 피드백이 오면 내용을 덧붙이고, "목표 누락"이 오면 목표를 반영하는 식으로 조건부 개선을 해요. ' +
        '실무에서는 re-prompting(다시 LLM에 "이런 문제가 있으니 고쳐줘"라고 요청)을 통해 더 강력한 자가 수정을 구현해요. ' +
        'reflection + improve 사이클을 여러 번 돌면서 점진적으로 답변 품질을 높이는 게 Self-Refine 패턴의 핵심이에요.',
      terms: [
        { t: 'improve(answer, feedback)', d: '기존 답변과 피드백을 받아 개선된 답변을 반환하는 함수예요.' },
        { t: 'feedback', d: 'reflection 단계에서 생성된 문제점 설명이에요. "짧음", "목표 누락" 같은 구체적인 피드백이에요.' },
        { t: 'answer + " 자세히 덧붙임"', d: '불충분했던 답변에 내용을 보강하는 개선 전략이에요.' },
        { t: 'result', d: '개선 과정을 거쳐 최종적으로 완성된 답변을 담는 변수예요.' },
      ],
      why:
        '한 번에 완벽한 답을 만드는 건 사실상 불가능해요. iterate(반복 개선) 방식은 초안 -> 피드백 -> 개선 -> 재검토 사이클을 통해, ' +
        '수십 번의 단순 시도보다 더 높은 품질에 도달할 수 있어요.',
      expectedOutput:
        '[실행] 피드백 기반 개선\n' +
        '[결과] 답 자세히 덧붙임',
      realWorldUsage:
        '문서 생성 AI가 초안을 작성한 후, "전문 용어가 너무 많음"이라는 피드백을 받으면 같은 내용을 더 쉬운 말로 다시 쓰고, ' +
        '"통계 데이터 빠짐" 피드백을 받으면 관련 수치를 추가해서 최종 문서를 완성해요. 이터레이션마다 품질이 눈에 띄게 좋아져요.',
      pitfall: '개선을 무한히 반복하면 비용만 늘고 품질은 더 이상 안 올라가는 수렴 지점이 와요. 보통 2~3회 개선 후에는 더 이상 변화가 없으면 종료하는 early stopping 조건을 두는 게 실용적이에요.',
    },
  },
  {
    id: 'pagent-multiagent-role',
    lang: 'python',
    title: '역할별 에이전트',
    file: 'multiagent_role.py',
    code: `def researcher(topic: str) -> str:
  return f"{topic} 자료 수집"

def writer(notes: str) -> str:
  return f"초안: {notes}"

def editor(draft: str) -> str:
  return f"최종: {draft}"

print("[실행] 역할별 에이전트 파이프라인")
flow = editor(writer(researcher("AI")))
print(f"[결과] {flow}")`,
    explain: {
      concept:
        '역할별 멀티 에이전트(multi-agent)는 각자 전문 분야만 담당하는 여러 에이전트가 순서대로 협력해서 하나의 결과를 만드는 아키텍처예요. ' +
        '공장 조립 라인에서 부품마다 전담 기술자가 다른 것과 같아요 - 연구원은 자료 수집만, 작가는 초안 작성만, 편집자는 다듬기만 해요. ' +
        'editor(writer(researcher("AI")))처럼 함수 합성을 통해 에이전트들의 파이프라인을 표현해요. ' +
        '각 에이전트가 협소한 전문 영역에 집중하면 전체 품질이 올라가고, 개별 개선도 독립적으로 할 수 있어요. ' +
        '실무에서는 CrewAI, AutoGen, LangGraph 같은 프레임워크로 더 복잡한 멀티 에이전트 협업을 구현해요.',
      terms: [
        { t: 'researcher(topic)', d: '주제를 받아 자료를 수집하는 전문 에이전트 함수예요. 출력은 다음 에이전트의 입력이 돼요.' },
        { t: 'writer(notes)', d: '수집된 자료를 바탕으로 초안을 작성하는 에이전트예요.' },
        { t: 'editor(draft)', d: '초안을 검토하고 최종 형태로 다듬는 마지막 에이전트예요.' },
        { t: 'flow', d: 'researcher -> writer -> editor 순서로 이어지는 전체 작업 흐름의 최종 결과예요.' },
      ],
      why:
        '하나의 범용 에이전트가 모든 걸 다 하려 하면 어중간해지기 쉬워요. 전문 에이전트 여럿이 협업하면, ' +
        '각 단계에서 더 높은 품질을 낼 수 있고 병목이 되는 에이전트만 선택적으로 개선할 수 있어요.',
      expectedOutput:
        '[실행] 역할별 에이전트 파이프라인\n' +
        '[결과] 최종: 초안: AI 자료 수집',
      realWorldUsage:
        '콘텐츠 제작 파이프라인에서 주제 발굴 에이전트 -> 자료 조사 에이전트 -> 초안 작성 에이전트 -> SEO 최적화 에이전트 -> 교정 에이전트 순서로 블로그 포스트를 자동 생산해요. ' +
        '각 에이전트를 전문 LLM 프롬프트로 구성하면, 범용 프롬프트 대비 품질이 훨씬 좋아져요.',
      pitfall: '앞 에이전트의 출력 품질이 낮으면 뒤 에이전트가 그대로 이어받아서 최종 결과도 나빠져요. 각 단계마다 검증(validation)이나 reflection을 추가해서 불량품이 다음 단계로 넘어가지 않게 하는 게 중요해요.',
    },
  },
  {
    id: 'pagent-router',
    lang: 'python',
    title: '라우터 에이전트',
    file: 'router_agent.py',
    code: `def route(question: str) -> str:
  if "날씨" in question:
    return "weather"
  if "계산" in question:
    return "calc"
  return "general"

print("[실행] 질문 라우팅")
agent = route("오늘 날씨 어때?")
print(f"[결과] 선택된 에이전트: {agent}")`,
    explain: {
      concept:
        '라우터(router)는 사용자 질문을 보고 가장 적합한 전문 에이전트를 골라주는 일종의 교통 정리 역할을 해요. ' +
        '병원 접수처에서 환자 증상을 듣고 내과/정형외과/피부과로 안내하는 것과 똑같아요. ' +
        '키워드 기반 if-elif 체인으로 간단히 구현했지만, 실무에서는 LLM이 질문 의도를 분류해서 동적으로 라우팅해요. ' +
        '맞는 전문가가 없으면 "general" 같은 기본 에이전트로 보내는 폴백(fallback) 처리가 중요해요. ' +
        '라우터 패턴은 멀티 에이전트 시스템의 첫 관문으로, 질문을 잘못 분류하면 아무리 전문 에이전트가 뛰어나도 엉뚱한 답이 나와요.',
      terms: [
        { t: 'route(question)', d: '질문 내용을 분석해 가장 적합한 전문 에이전트 이름을 반환하는 라우팅 함수예요.' },
        { t: 'agent', d: 'route가 선택한 담당 에이전트의 식별자(문자열)예요. 이걸로 실제 에이전트를 호출해요.' },
        { t: "'general'", d: '어느 전문 에이전트에도 해당하지 않을 때 사용하는 기본 범용 에이전트 식별자예요.' },
        { t: 'if "날씨" in question', d: '질문에 특정 키워드가 포함됐는지 확인하는 단순 문자열 매칭 조건이에요.' },
      ],
      why:
        '모든 질문을 하나의 범용 에이전트가 처리하면, 전문성이 떨어져 답변 품질이 낮아져요. ' +
        '라우터로 질문을 성격에 맞게 분배하면, 각 전문 에이전트가 더 정확하고 깊이 있는 답변을 할 수 있어요.',
      expectedOutput:
        '[실행] 질문 라우팅\n' +
        '[결과] 선택된 에이전트: weather',
      realWorldUsage:
        '기업 AI 어시스턴트에서 "연차 며칠 남았어?"는 HR 에이전트로, "이번 분기 매출 추이 보여줘"는 분석 에이전트로, ' +
        '"서버 점검 일정 알려줘"는 IT 에이전트로 라우팅해서 각 부서 전문 지식을 갖춘 에이전트가 답변해요.',
      pitfall: '키워드 매칭으로 라우팅하면 "날씨 좋은 날 계산해줘" 같은 애매한 질문에서 잘못된 에이전트를 선택할 수 있어요. 실무에서는 LLM 기반 의도 분류나 임베딩 유사도 기반 시맨틱 라우터를 사용하는 게 더 안전해요.',
    },
  },
  {
    id: 'pagent-parallel',
    lang: 'python',
    title: '에이전트 순차 실행 후 결과 합산',
    file: 'parallel_agent.py',
    code: `def fetch_news() -> str:
  return "뉴스"

def fetch_price() -> str:
  return "가격"

print("[실행] 여러 에이전트 결과 수집")
results = {}
for name, fn in [("news", fetch_news), ("price", fetch_price)]:
  results[name] = fn()
print(f"[결과] {results}")`,
    explain: {
      concept:
        '순차 실행 후 결과 합산은 독립적인 작업을 수행하는 여러 에이전트를 차례로 호출하고 결과를 한곳에 모으는 패턴이에요. ' +
        '비서에게 뉴스 찾아오기, 가격 조사하기 등 여러 심부름을 순서대로 시키고 돌아온 결과를 취합하는 것과 같아요. ' +
        'for 루프로 (이름, 함수) 튜플을 순회하면서 각 에이전트를 호출하고, 결과 딕셔너리에 이름을 키로 저장해요. ' +
        '주의할 점은 이 코드는 진짜 병렬이 아니라 순차 실행(sequential)이라는 거예요. ' +
        '실무에서는 asyncio.gather()나 threading으로 실제 병렬 실행을 구현해서, 독립적인 여러 API 호출을 동시에 처리해 전체 응답 시간을 단축해요.',
      terms: [
        { t: 'fetch_news()', d: '뉴스를 가져오는 에이전트 함수예요. 실제로는 외부 API를 호출하는 로직이 들어가요.' },
        { t: 'fetch_price()', d: '가격 정보를 가져오는 에이전트 함수예요. 뉴스와는 독립적이라 병렬 실행이 가능해요.' },
        { t: 'results', d: '에이전트별 결과를 {이름: 결과} 형태로 모아둔 딕셔너리예요.' },
        { t: 'for name, fn in [...]', d: '에이전트 이름과 함수를 튜플 리스트로 정의하고 순차적으로 반복 실행하는 구문이에요.' },
      ],
      why:
        '사용자 질문 하나에 답하려면 뉴스 API, 날씨 API, 검색 API 등 여러 곳에서 정보를 가져와야 하는 경우가 많아요. ' +
        '순서대로 호출하면 전체 응답이 느려지지만, 병렬로 동시 호출하면 가장 느린 API 시간만큼만 기다리면 돼요.',
      expectedOutput:
        '[실행] 여러 에이전트 결과 수집\n' +
        "[결과] {'news': '뉴스', 'price': '가격'}",
      realWorldUsage:
        '여행 추천 서비스에서 사용자가 "도쿄 여행 추천"을 검색하면, 항공권 API, 호텔 API, 날씨 API, 관광지 API를 동시에 호출해서 결과를 취합한 후 LLM이 하나의 추천 메시지로 포장해요.',
      pitfall: '이 코드는 순차 실행이라, fetch_news()가 3초 걸리고 fetch_price()가 3초 걸리면 총 6초가 걸려요. 진짜 동시 실행이 필요하면 asyncio.gather()나 concurrent.futures.ThreadPoolExecutor를 사용해야 해요.',
    },
  },
  {
    id: 'pagent-tool-result-format',
    lang: 'python',
    title: '도구 결과 포장',
    file: 'tool_result_format.py',
    code: `def format_result(name: str, output: str) -> dict:
  return {
    "tool": name,
    "output": output,
    "ok": True
  }

print("[실행] 결과 포장")
result = format_result("search", "파이썬 문서")
print(f"[결과] {result['output']}")`,
    explain: {
      concept:
        '도구 결과 포장(formatting)은 다양한 도구가 제각각 다른 형태로 반환하는 결과를 표준화된 형식으로 감싸서 일관된 처리를 가능하게 하는 패턴이에요. ' +
        '택배를 보낼 때 어떤 내용물이든 똑같은 규격 상자에 포장하는 것과 같아요. ' +
        'tool 필드로 어느 도구의 결과인지 추적하고, output에 실제 결과를, ok로 성공 여부를 명시해요. ' +
        '모든 도구 결과가 이 구조로 통일되면, 호출부에서 어떤 도구 결과든 tool.result["output"]로 동일하게 접근할 수 있어요. ' +
        '실무에서는 ok=False로 실패 케이스도 표준화해서, 에이전트가 오류를 일관된 방식으로 처리할 수 있게 해줘요.',
      terms: [
        { t: 'format_result(name, output)', d: '도구 이름과 실제 출력을 받아 표준 형식의 딕셔너리로 감싸는 함수예요.' },
        { t: '"tool": name', d: '실행된 도구의 식별자로, 결과의 출처를 추적할 수 있게 해줘요.' },
        { t: '"output": output', d: '도구가 생성한 실제 결과값이에요. 이 부분만 사용자에게 보여주면 돼요.' },
        { t: '"ok": True', d: '도구 실행 성공 여부 플래그예요. False로 설정하면 오류 상황을 나타낼 수 있어요.' },
      ],
      why:
        '결과 형태가 제각각이면 호출부에서 if-else로 매번 타입을 확인해야 해요. ' +
        '표준 포맷을 정하면 어떤 도구든 동일한 방식으로 결과를 처리할 수 있어서 코드가 단순해지고 버그도 줄어요.',
      expectedOutput:
        '[실행] 결과 포장\n' +
        '[결과] 파이썬 문서',
      realWorldUsage:
        'OpenAI의 Function Calling API도 비슷한 표준 응답 형식을 사용해요. ' +
        '도구 호출 결과를 JSON으로 감싸서 GPT-4에 다시 주입할 때 매번 같은 구조라서, GPT-4가 결과를 안정적으로 이해하고 다음 행동을 결정할 수 있어요.',
      pitfall: '실패한 결과도 ok=True로 포장하면 에이전트가 실패를 성공으로 오해해서 엉뚱한 답변을 만들어요. try/except로 오류를 잡아서 format_result(name, error_msg, ok=False)로 구분하는 게 안전해요.',
    },
  },
  {
    id: 'pagent-llm-decide',
    lang: 'python',
    title: 'LLM 도구 선택',
    file: 'llm_decide.py',
    code: `def decide_tool(question: str) -> str:
  prompt = f"질문: {question}\\n도구 선택:"
  reply = "도구: search"
  return reply.split(":")[-1].strip()

print("[실행] LLM 도구 선택")
choice = decide_tool("최신 뉴스 알려줘")
print(f"[결과] 선택된 도구: {choice}")`,
    explain: {
      concept:
        'LLM 도구 선택은 AI가 사용자 질문을 읽고 어떤 도구를 사용할지 스스로 판단하는 지능형 라우팅 방식이에요. ' +
        '의사가 환자 증상을 듣고 "이건 혈액 검사가 필요하겠다"라고 판단하는 것과 같아요. ' +
        '이 예제에서는 LLM 호출을 생략하고 하드코딩된 응답을 split(":")[-1]로 파싱하지만, 실제로는 LLM API가 f-string 프롬프트를 받아 도구 이름을 반환해요. ' +
        '실무에서는 OpenAI의 Function Calling이나 Tool Use API가 이 로직을 내부적으로 처리해서, 개발자가 직접 파싱할 필요 없이 구조화된 응답을 받을 수 있어요.',
      terms: [
        { t: 'decide_tool(question)', d: '질문을 받아 가장 적합한 도구 이름을 반환하는 의사결정 함수예요.' },
        { t: 'prompt', d: 'LLM에게 보낼 지시문(프롬프트)이에요. f-string으로 질문을 자연어 템플릿에 삽입해요.' },
        { t: 'reply', d: 'LLM이 반환한 응답이에요. 여기서는 "도구: search" 같은 형식으로 가정해요.' },
        { t: 'reply.split(":")[-1].strip()', d: '콜론(:)을 기준으로 응답을 분리하고 마지막 부분(도구 이름)의 앞뒤 공백을 제거해요.' },
      ],
      why:
        '질문마다 어떤 도구를 쓸지 사람이 if-else로 일일이 정의하는 건 확장성이 없어요. ' +
        'LLM이 스스로 판단하게 하면 새로운 유형의 질문에도 유연하게 대응하고, 도구가 추가돼도 코드 수정이 필요 없어요.',
      expectedOutput:
        '[실행] LLM 도구 선택\n' +
        '[결과] 선택된 도구: search',
      realWorldUsage:
        'OpenAI의 GPT-4에 tools 파라미터로 여러 도구를 등록하면, 사용자 질문마다 GPT-4가 어떤 도구를 호출할지 자동으로 결정해요. ' +
        '사용자가 "내일 서울 날씨"라고 하면 get_weather, "최신 뉴스"라고 하면 search를 자동 선택해서 개발자는 라우팅 로직을 전혀 작성하지 않아도 돼요.',
      pitfall: 'LLM이 존재하지 않는 도구 이름을 반환하거나(환각), 응답 형식이 달라져서 split/파싱이 실패할 수 있어요. Function Calling API로 구조화된 응답을 받거나, 출력을 Pydantic으로 검증하는 게 훨씬 안전해요.',
    },
  },
  {
    id: 'pagent-state-machine',
    lang: 'python',
    title: '상태 기반 에이전트',
    file: 'state_machine.py',
    code: `state = "idle"

def step(input_text: str) -> str:
  global state
  if state == "idle":
    state = "thinking"
  elif state == "thinking":
    state = "acting"
  elif state == "acting":
    state = "done"
  return state

print("[실행] 상태 기계")
print(f"[결과] idle -> {step('')} -> {step('')} -> {step('')}")`,
    explain: {
      concept:
        '상태 기계(state machine)는 에이전트가 가질 수 있는 상태를 미리 정의하고, 현재 상태에 따라 다음 행동과 상태 전환이 결정되는 구조예요. ' +
        '신호등이 빨강->녹색->노랑 순서로 바뀌듯이, idle(대기)->thinking(생각)->acting(행동)->done(완료) 순서로 상태가 전환돼요. ' +
        'global 키워드로 함수 밖에 선언된 state 변수를 함수 안에서 수정할 수 있게 해요. ' +
        '각 상태에서 수행할 작업을 분리하면, 복잡한 워크플로우도 단계별로 깔끔하게 관리할 수 있어요. ' +
        '실무에서는 LangGraph의 StateGraph로 이 개념을 확장해서, 수십 개 상태가 있는 복잡한 에이전트 워크플로우를 그래프 기반으로 설계해요.',
      terms: [
        { t: 'state', d: '에이전트의 현재 상태를 나타내는 문자열 변수예요. 이 값에 따라 step()의 동작이 달라져요.' },
        { t: 'step(input_text)', d: '입력을 받아 현재 상태에 따라 다른 동작을 하고 다음 상태로 전환하는 함수예요.' },
        { t: 'global state', d: '함수 스코프 바깥의 전역 변수 state를 함수 안에서 수정할 수 있게 선언하는 키워드예요.' },
        { t: '"idle" -> "thinking" -> "acting" -> "done"', d: '에이전트의 상태 전환 순서예요. 각 호출마다 한 단계씩 진행돼요.' },
      ],
      why:
        '복잡한 에이전트 동작을 하나의 거대한 if-else로 구현하면 유지보수가 불가능해져요. 상태 기계로 분리하면 각 상태별 동작을 독립적으로 개발·테스트할 수 있고, 새로운 상태 추가도 쉬워져요.',
      expectedOutput:
        '[실행] 상태 기계\n' +
        '[결과] idle -> thinking -> acting -> done',
      realWorldUsage:
        '대화형 챗봇에서 상태를 "인사" -> "요청 파악" -> "정보 조회" -> "답변 생성" -> "피드백 수집"으로 정의해서, ' +
        '각 상태에서 적절한 프롬프트와 도구만 사용하게 해요. 잘못된 상태 전환을 막을 수 있어서 대화 흐름이 자연스러워져요.',
      pitfall: '상태 전환 조건이 꼬이면(예: thinking에서 idle로 돌아가는 엣지를 추가 안 함) 특정 상황에서 에이전트가 멈추거나 엉뚱한 상태로 빠질 수 있어요. 상태 전이도를 먼저 그리고 시작하는 게 좋은 습관이에요.',
    },
  },
  {
    id: 'pagent-observation-buffer',
    lang: 'python',
    title: '관찰 결과 버퍼',
    file: 'observation_buffer.py',
    code: `observations = []

def observe(result: str):
  observations.append(result)

def summary() -> str:
  return " | ".join(observations[-3:])

print("[실행] 관찰 버퍼")
observe("A")
observe("B")
observe("C")
print(f"[결과] 최근 관찰: {summary()}")`,
    explain: {
      concept:
        '관찰 버퍼(observation buffer)는 여러 번의 도구 실행 결과를 순서대로 쌓아두고, 최근 결과들을 요약해서 다음 의사결정에 참고하는 기록 보관소예요. ' +
        '탐정이 단서를 수첩에 차례로 적어두는 것과 같아요. ' +
        'observations[-3:] 슬라이싱으로 최근 3개 결과만 잘라내서 " | ".join()으로 하나의 요약 문자열로 합쳐요. ' +
        '전체 기록을 다 보관하면 토큰 비용이 너무 커지니까, 최근 N개만 요약해서 전달하는 게 실용적인 전략이에요. ' +
        '실무에서는 ReAct 루프 안에서 observation history를 누적하고, 각 루프마다 요약을 LLM 컨텍스트에 포함시켜요.',
      terms: [
        { t: 'observations', d: '도구 호출 결과를 시간순으로 저장하는 리스트예요. 관찰 히스토리의 전체 기록이에요.' },
        { t: 'observe(result)', d: '새로운 도구 실행 결과를 버퍼의 끝에 추가하는 함수예요.' },
        { t: 'observations[-3:]', d: '리스트의 뒤에서부터 3개 항목을 슬라이싱해요. 음수 인덱스는 뒤에서부터 세는 의미예요.' },
        { t: "' | '.join(...)", d: '여러 관찰 결과를 " | " 구분자로 연결해 하나의 요약 문자열로 만들어요.' },
      ],
      why:
        '에이전트는 과거 관찰 결과를 알아야 다음 행동을 결정할 수 있어요. 하지만 모든 history를 LLM에 보내면 토큰 한도를 초과하거나 비용이 폭증해요. 최근 N개만 보내는 게 비용 대비 효과적이에요.',
      expectedOutput:
        '[실행] 관찰 버퍼\n' +
        '[결과] 최근 관찰: A | B | C',
      realWorldUsage:
        '데이터 분석 에이전트가 SQL 쿼리 결과를 여러 번 조회할 때, 각 결과를 버퍼에 쌓아두고 최근 5개 결과의 요약을 유지해요. ' +
        '다음 쿼리를 작성할 때 "아까 조회한 결과는 이랬으니, 이제는 이런 조건으로 좁혀볼까" 하면서 점진적으로 분석을 구체화해요.',
      pitfall: '요약에 포함되는 관찰 개수를 너무 많이 설정하면 토큰 비용이 기하급수적으로 늘어나요. 보통 3~5개 정도로 제한하고, 필요하면 오래된 기록은 장기 메모리로 이관하는 계층적 기억 구조를 고려하세요.',
    },
  },
  {
    id: 'pagent-tool-validation',
    lang: 'python',
    title: '도구 입력 검증',
    file: 'tool_validation.py',
    code: `def validate_args(args: dict, schema: dict) -> bool:
  for req in schema.get("required", []):
    if req not in args:
      return False
  return True

print("[실행] 도구 입력 검증")
ok = validate_args({"query": "x"}, {"required": ["query"]})
print(f"[결과] 검증 통과: {ok}")`,
    explain: {
      concept:
        '도구 입력 검증(input validation)은 AI가 도구를 호출하기 전에 필수 파라미터가 모두 들어왔는지 확인하는 안전장치예요. ' +
        '요리하기 전에 냉장고에 재료가 다 있는지 확인하는 것처럼, 빠진 재료가 있으면 도구 실행을 막아요. ' +
        'schema.get("required", [])로 required 키가 없는 스키마도 안전하게 처리하고, for 루프로 각 필수 필드가 args에 존재하는지 하나씩 확인해요. ' +
        '여기서는 존재 여부만 검사하지만, 실무에서는 타입 검증(type=int인데 문자열이 왔는지), 범위 검증(음수면 안 되는 값에 -1이 왔는지)도 함께 수행해요. ' +
        'Pydantic을 도구 스키마 검증에 도입하면, 더 강력하고 선언적인 검증 로직을 구현할 수 있어요.',
      terms: [
        { t: 'validate_args(args, schema)', d: '실제 입력 args가 스키마의 required 필드를 모두 포함하는지 검사하는 함수예요.' },
        { t: 'schema.get("required", [])', d: '스키마에서 required 리스트를 안전하게 가져와요. 없으면 빈 리스트를 반환해요.' },
        { t: 'req not in args', d: '필수 파라미터가 입력 딕셔너리에 존재하지 않으면 False를 반환하는 조건이에요.' },
        { t: 'ok', d: '검증 결과를 담는 변수예요. True면 호출 가능, False면 호출을 막아야 해요.' },
      ],
      why:
        'LLM은 때때로 필수 파라미터를 빠뜨리거나, 잘못된 타입의 값을 도구에 전달할 수 있어요. ' +
        '검증 없이 실행하면 런타임 오류가 발생하거나, 더 심하게는 잘못된 결과가 진짜인 것처럼 사용자에게 전달될 수 있어요.',
      expectedOutput:
        '[실행] 도구 입력 검증\n' +
        '[결과] 검증 통과: True',
      realWorldUsage:
        '은행 거래 챗봇에서 "100만원 이체해줘"라고 하면, AI가 transfer 도구를 호출하려고 해요. ' +
        '검증 로직이 "받는 사람 계좌번호"와 "금액"이 모두 있는지 확인하고, 금액이 0원 이상인지, 하루 한도 내인지까지 검증한 뒤에야 실제 이체 API를 호출해요.',
      pitfall: '존재 여부만 검사하고 타입이나 값 범위를 검사하지 않으면, 문자열이 들어와야 할 자리에 숫자가 들어가거나 음수가 들어와도 통과할 수 있어요. 실무에서는 Pydantic BaseModel로 스키마를 정의해서 타입·범위·형식까지 자동 검증하는 게 표준이에요.',
    },
  },
  {
    id: 'pagent-self-critique',
    lang: 'python',
    title: '자기 비평',
    file: 'self_critique.py',
    code: `def critique(text: str) -> list:
  notes = []
  if "아마" in text:
    notes.append("불확실한 표현")
  if "?" not in text:
    notes.append("질문 부족")
  return notes

print("[실행] 자기 비평")
points = critique("아마 그럴 거예요")
print(f"[결과] 발견된 문제: {points}")`,
    explain: {
      concept:
        '자기 비평(self-critique)은 AI가 자신의 출력을 메타인지적으로 검토하고 개선점을 스스로 찾아내는 고급 기법이에요. ' +
        '작가가 초고를 읽으며 어색한 문장에 밑줄을 긋는 것과 같아요. ' +
        '불확실한 표현("아마", "아마도")이 있으면 더 확실한 정보를 찾아보라고 피드백하고, 질문이 빠진 답변은 더 깊이 파고들 기회를 놓친 거라고 지적해요. ' +
        '이런 자기 비평을 통과한 뒤에만 최종 답변을 내놓게 하면, 품질이 확연히 좋아져요. ' +
        '실무에서는 LLM에게 "너의 답변에서 개선할 점을 3가지 찾아줘"라고 프롬프팅해서 더 깊은 self-critique을 유도하는 Reflection Agent 패턴을 써요.',
      terms: [
        { t: 'critique(text)', d: '텍스트에서 개선할 점을 찾아 리스트로 반환하는 평가 함수예요.' },
        { t: 'notes', d: '발견된 비평점(문제점)을 문자열로 모아두는 리스트예요.' },
        { t: '"아마" in text', d: '불확실한 표현이 포함돼 있는지 확인하는 규칙 기반 검사예요.' },
        { t: "'?' not in text", d: '질문이 빠진 답변을 찾아내는 휴리스틱이에요. 완전한 답변은 보완 질문을 포함해야 해요.' },
      ],
      why:
        'LLM은 자신 있게 틀린 답을 할 때가 많아요. 출력 후 바로 사용자에게 보여주는 대신, self-critique 단계를 거치면 ' +
        '명백한 오류나 부족한 부분을 먼저 걸러낼 수 있어서 답변 신뢰도가 크게 올라가요.',
      expectedOutput:
        '[실행] 자기 비평\n' +
        "[결과] 발견된 문제: ['불확실한 표현', '질문 부족']",
      realWorldUsage:
        '의료 상담 AI가 "두통이 있으면 타이레놀을 드세요"라고 답변하기 전에, self-critique으로 "복용량이 빠졌다", "부작용 언급이 없다", "임산부 주의사항이 없다" 등의 문제를 발견하고 답변을 보강한 뒤 최종 출력해요.',
      pitfall: '비평 기준이 너무 가혹하면 아무 답변도 통과하지 못해서 "답변을 생성할 수 없습니다"만 반복하게 돼요. 비평 기준은 필수 안전 요건에 집중하고, 부가적인 품질 개선은 별도로 적용하는 게 실용적이에요.',
    },
  },
  {
    id: 'pagent-orchestrator',
    lang: 'python',
    title: '오케스트레이터',
    file: 'orchestrator.py',
    code: `agents = {
  "research": lambda t: f"조사:{t}",
  "summary": lambda t: f"요약:{t}"
}

def orchestrate(task: str) -> str:
  out = task
  for name in ["research", "summary"]:
    out = agents[name](out)
  return out

print("[실행] 오케스트레이터 실행")
print(f"[결과] {orchestrate('AI')}")`,
    explain: {
      concept:
        '오케스트레이터(orchestrator)는 여러 에이전트의 실행 순서를 중앙에서 통제하고 조율하는 지휘자 역할을 해요. ' +
        '오케스트라 지휘자가 악기별 연주 순서를 지시하는 것처럼, 어떤 에이전트가 언제 실행될지 결정해요. ' +
        'agents 딕셔너리에 이름과 실행 함수(lambda)를 등록하고, orchestrate()가 미리 정해진 순서대로 차례로 호출해요. ' +
        'out 변수로 이전 에이전트의 출력을 다음 에이전트의 입력으로 전달하는 파이프라인을 구성해요. ' +
        '실무에서는 CrewAI의 Crew, LangGraph의 StateGraph가 이런 오케스트레이션을 더 정교하게 구현한 프레임워크예요.',
      terms: [
        { t: 'agents', d: '에이전트 이름과 실행 함수(lambda)를 매핑한 딕셔너리예요. 등록된 에이전트 목록이에요.' },
        { t: 'orchestrate(task)', d: '여러 에이전트를 정해진 순서대로 호출해서 최종 결과를 만드는 지휘 함수예요.' },
        { t: 'out', d: '각 단계의 결과를 누적하는 변수예요. 이전 에이전트의 출력이 다음 에이전트의 입력으로 전달돼요.' },
        { t: 'lambda t: f"조사:{t}"', d: '간단한 변환을 한 줄로 정의하는 익명 함수예요. 실무에서는 LLM 호출 함수로 대체돼요.' },
      ],
      why:
        '여러 에이전트가 협력할 때 누가 먼저 실행돼야 하는지, 각자의 출력을 어떻게 다음 단계에 전달할지 중앙에서 통제하지 않으면 혼란이 생겨요. ' +
        '오케스트레이터가 이 흐름을 체계적으로 관리해줘요.',
      expectedOutput:
        '[실행] 오케스트레이터 실행\n' +
        '[결과] 요약:조사:AI',
      realWorldUsage:
        '보고서 자동 생성 시스템에서 오케스트레이터가 "데이터 수집 -> 분석 -> 차트 생성 -> 보고서 작성 -> 교정" 순서로 여러 전문 에이전트를 순차 호출해요. ' +
        '중간에 실패하면 해당 단계만 재시도하도록 제어할 수 있어서 안정성이 높아져요.',
      pitfall: '에이전트 실행 순서가 논리적으로 잘못되면(예: 보고서 작성 후 데이터 수집) 파이프라인 전체가 망가져요. 작업 간 의존성 그래프를 먼저 그리고, DAG(Directed Acyclic Graph) 기반 오케스트레이션을 설계하는 게 좋아요.',
    },
  },
  {
    id: 'pagent-handoff',
    lang: 'python',
    title: '에이전트 인수인계',
    file: 'handoff.py',
    code: `def agent_a(context: dict) -> dict:
  context["from_a"] = "자료"
  return context

def agent_b(context: dict) -> dict:
  context["from_b"] = context["from_a"] + " + 분석"
  return context

print("[실행] 에이전트 간 인수인계")
ctx = agent_b(agent_a({}))
print(f"[결과] {ctx['from_b']}")`,
    explain: {
      concept:
        '인수인계(handoff)는 한 에이전트가 작업 중 축적한 컨텍스트를 다음 에이전트에게 딕셔너리로 넘겨주는 정보 전달 패턴이에요. ' +
        '계주 경기에서 바통을 다음 주자에게 건네듯, 앞 에이전트가 수집한 정보를 그대로 다음 에이전트가 활용할 수 있어요. ' +
        'context 딕셔너리에 각 에이전트가 자신의 결과를 키-값으로 추가하면서 점점 풍부한 컨텍스트가 만들어져요. ' +
        'agent_a({})의 결과가 agent_b()의 입력으로 합성(composition)되는 구조라서, 별도의 중간 변수 없이 깔끔하게 표현할 수 있어요. ' +
        '실무에서는 이 컨텍스트를 JSON으로 직렬화해서 다른 서비스나 DB로 전달하는 방식으로 확장돼요.',
      terms: [
        { t: 'context', d: '에이전트 간 공유되는 정보를 담는 딕셔너리예요. 각 에이전트가 자신의 작업 결과를 추가해요.' },
        { t: 'agent_a(context)', d: '자료를 수집하고 context에 "from_a" 키로 결과를 저장하는 첫 번째 에이전트예요.' },
        { t: 'agent_b(context)', d: 'agent_a의 결과(context["from_a"])를 읽어서 분석을 추가하는 두 번째 에이전트예요.' },
        { t: 'agent_b(agent_a({}))', d: '빈 컨텍스트로 agent_a를 먼저 실행하고, 그 결과를 agent_b의 입력으로 전달하는 합성 호출이에요.' },
      ],
      why:
        '각 에이전트가 매번 처음부터 정보를 다시 수집하면 중복 작업과 시간 낭비가 생겨요. 컨텍스트를 넘기면 앞서 한 작업의 결과를 그대로 활용해서 효율이 올라가고, 일관성도 유지할 수 있어요.',
      expectedOutput:
        '[실행] 에이전트 간 인수인계\n' +
        '[결과] 자료 + 분석',
      realWorldUsage:
        '고객 지원 시스템에서 분류 에이전트가 "환불 요청"으로 분류하고 context["category"]="refund"를 설정하면, ' +
        '다음 환불 처리 에이전트가 context["category"]를 확인하고 환불 정책에 따라 처리해요. 이후 응대 에이전트가 context["result"]를 바탕으로 답변 메시지를 만들어요.',
      pitfall: '컨텍스트 키 이름이 에이전트마다 달라지면(agent_a는 "data", agent_b는 "from_a"를 기대), 다음 에이전트가 필요한 정보를 못 찾아 KeyError가 발생하거나 빈 값으로 처리할 수 있어요. 컨텍스트 키는 팀 전체가 공유하는 명세로 관리해야 해요.',
    },
  },
];
