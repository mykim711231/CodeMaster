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
  return "알 수 없는 도구"`,

    explain: {
      concept: 'AI가 직접 할 수 없는 일을 외부 도구(함수)에게 맡기는 방식이에요. 마치 요리사가 재료를 손에 넣기 위해 심부름꾼에게 부탁하는 것과 같아요.',
      terms: [
        { t: 'TOOLS', d: '도구 이름과 실제 함수를 연결한 사전(딕셔너리)이에요.' },
        { t: 'call_tool', d: '이름을 받아 알맞은 함수를 실행해 주는 연결 통로예요.' },
        { t: '**args', d: '딕셔너리의 키를 함수 매개변수 이름으로 풀어주는 문법이에요.' }
      ],
      why: 'AI는 계산은 잘하지만 실시간 정보는 못 가져오기 때문에 도구가 필요해요.',
      pitfall: '없는 도구 이름을 넘기면 에러가 나지 않고 그냥 안내 문구로 끝낼 수 있어요.'
    }
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
  return f"결과: {query}"`,

    explain: {
      concept: '도구가 어떤 입력을 받는지 미리 약속(스키마)을 정해 두는 거예요. 식당 메뉴판에 "이 요리는 이런 재료가 필요해요"라고 적어두는 것과 같아요.',
      terms: [
        { t: 'SEARCH_SCHEMA', d: '도구의 이름, 설명, 매개변수 형태를 적어둔 설명서예요.' },
        { t: 'parameters', d: '도구가 받을 값들의 형태를 정의하는 부분이에요.' },
        { t: 'required', d: '반드시 넣어야 하는 필수 값 목록이에요.' }
      ],
      why: 'AI가 도구를 쓸 때 어떤 값을 넣어야 할지 알아야 올바르게 호출할 수 있어요.',
      pitfall: 'required에 넣은 값은 호출 시 반드시 포함해야 해요.'
    }
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

steps = []
question = "서울 오늘 날씨"
for i in range(3):
  thought = f"{question}를 풀기 위해 도구 호출"
  action = "get_weather"
  observation = call_tool(action, {"city": "서울"})
  steps.append((thought, action, observation))
  if "맑음" in observation:
    break`,

    explain: {
      concept: '생각(Thought)하고 행동(Action)하고 관찰(Observation)하는 과정을 반복해 답을 찾는 방식이에요. 길을 찾을 때 한 블록 가보고 다시 지도를 보는 것과 같아요.',
      terms: [
        { t: 'thought', d: '지금 무엇을 해야 할지 AI가 스스로 짚는 생각이에요.' },
        { t: 'action', d: '생각을 바탕으로 고른 도구 이름이에요.' },
        { t: 'observation', d: '도구를 실행하고 돌려받은 결과예요.' }
      ],
      why: '한 번에 정답을 몰라도 점진적으로 정보를 채워가면 답을 찾을 수 있어요.',
      pitfall: '반복 횟수를 정하지 않으면 무한히 도느라 멈추지 않을 수 있어요.'
    }
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
  return list(memory)`,

    explain: {
      concept: '최근 대화를 잠깐 기억해 두는 거예요. 마치 가게 카운터에 방금 받은 주문서 몇 장만 올려두는 것과 같아요.',
      terms: [
        { t: 'memory', d: '최근 대화를 담아두는 리스트예요.' },
        { t: 'remember', d: '새로운 내용을 메모리에 추가하는 함수예요.' },
        { t: 'pop(0)', d: '가장 오래된 항목을 앞에서부터 빼내는 동작이에요.' }
      ],
      why: '최근 문맥을 잃지 않으면서도 메모리가 너무 커지는 걸 막을 수 있어요.',
      pitfall: '오래된 중요 정보도 함께 사라질 수 있어요.'
    }
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

save("사용자_이름", "지훈")
print(load("사용자_이름"))`,

    explain: {
      concept: '중요한 정보를 키-값 형태로 오래 보관하는 거예요. 전화번호부에 이름과 번호를 짝지어 적어두는 것과 같아요.',
      terms: [
        { t: 'store', d: '키와 값을 짝지어 보관하는 사전이에요.' },
        { t: 'save', d: '키와 값을 함께 저장하는 함수예요.' },
        { t: 'get', d: '키가 있으면 값을, 없으면 기본값을 돌려주는 메서드예요.' }
      ],
      why: '이전 대화가 끝나도 사용자 정보를 다음에 다시 쓸 수 있어요.',
      pitfall: '같은 키에 저장하면 이전 값이 덮여 써져요.'
    }
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
  return "완료"`,

    explain: {
      concept: '큰 목표를 작은 단계로 쪼개 순서대로 진행하는 거예요. 책 한 권을 챕터별로 나눠 읽는 것과 같아요.',
      terms: [
        { t: 'goal', d: '최종적으로 이루고 싶은 큰 목표예요.' },
        { t: 'plan', d: '목표를 쪼갤 작은 단계들의 순서 목록이에요.' },
        { t: 'next_step', d: '지금까지 끝낸 개수를 받아 다음 할 일을 알려줘요.' }
      ],
      why: '한 번에 다 하려고 하면 막막하지만 작게 쪼개면 하나씩 해낼 수 있어요.',
      pitfall: '단계 순서가 잘못되면 뒷단계가 앞단계 결과를 못 써요.'
    }
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
  return done / len(plan)`,

    explain: {
      concept: '어떤 단계를 끝냈는지 기록하고 진행률을 보여주는 거예요. 체크리스트에 체크해 가며 완성도를 보는 것과 같아요.',
      terms: [
        { t: 'status', d: '각 단계의 완료 상태를 담은 기록이에요.' },
        { t: 'execute', d: '단계를 실행하고 완료 표시를 남기는 함수예요.' },
        { t: 'progress', d: '끝낸 단계 수로 진행률을 0~1로 계산해 줘요.' }
      ],
      why: '진행 상황을 보면 남은 일을 한눈에 알 수 있어요.',
      pitfall: '같은 단계를 두 번 실행해도 중복으로 표시되지 않아요.'
    }
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
  return "통과"`,

    explain: {
      concept: '자기 답이 목표에 맞는지 스스로 점검하는 거예요. 숙제를 다 한 뒤 다시 읽어보며 틀린 곳을 찾는 것과 같아요.',
      terms: [
        { t: 'reflect', d: '답과 목표를 비교해 문제를 찾아내는 함수예요.' },
        { t: 'issues', d: '발견된 문제점들을 모아둔 리스트예요.' },
        { t: 'join', d: '여러 문자열을 하나로 이어 붙이는 메서드예요.' }
      ],
      why: '스스로 점검하면 한 번에 틀린 답을 그대로 쓰는 일을 줄일 수 있어요.',
      pitfall: '검사 기준이 너무 느슨하면 문제를 못 잡아내요.'
    }
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

result = "답"
result = improve(result, "짧음")`,

    explain: {
      concept: '반성에서 찾은 문제를 바탕으로 답을 고쳐 다시 만드는 거예요. 선생님의 피드백을 듣고 글을 고쳐 쓰는 것과 같아요.',
      terms: [
        { t: 'improve', d: '피드백을 받아 답을 더 나은 형태로 고치는 함수예요.' },
        { t: 'feedback', d: '반성 단계에서 얻은 문제점 설명이에요.' },
        { t: 'result', d: '개선된 결과를 담는 변수예요.' }
      ],
      why: '한 번에 완벽한 답이 안 나와도 점진적으로 좋아질 수 있어요.',
      pitfall: '피드백 없이 무한히 고치려 하면 끝이 없어요.'
    }
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

flow = editor(writer(researcher("AI")))`,

    explain: {
      concept: '각자 맡은 일만 하는 에이전트 여럿이 순서대로 일하는 거예요. 공장에서 부품마다 담당 기사가 다른 조립 라인과 같아요.',
      terms: [
        { t: 'researcher', d: '자료를 찾아오는 역할의 에이전트예요.' },
        { t: 'writer', d: '자료를 바탕으로 글을 쓰는 에이전트예요.' },
        { t: 'editor', d: '쓴 글을 다듬어 최종 결과를 내는 에이전트예요.' },
        { t: 'flow', d: '여러 에이전트를 거쳐 완성된 결과예요.' }
      ],
      why: '각자 전문 영역에 집중하면 전체 품질이 올라가요.',
      pitfall: '앞 에이전트 결과가 나빠도 뒤에서 그대로 이어받아요.'
    }
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

agent = route("오늘 날씨 어때?")
print(agent)`,

    explain: {
      concept: '질문 내용을 보고 알맞은 전문 에이전트에게 길을 안내하는 거예요. 병원 안내 데스크에서 환자를 알맞은 진료과로 보내는 것과 같아요.',
      terms: [
        { t: 'route', d: '질문을 보고 담당 에이전트 이름을 골라주는 함수예요.' },
        { t: 'agent', d: '선택된 담당 에이전트의 이름이에요.' },
        { t: 'general', d: '특별히 맞는 에이전트가 없을 때 사용하는 기본 에이전트예요.' }
      ],
      why: '모든 에이전트가 모든 일을 다 하려 하면 비효율적이에요.',
      pitfall: '키워드가 겹치면 의도와 다른 곳으로 보낼 수 있어요.'
    }
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

results = {}
for name, fn in [("news", fetch_news), ("price", fetch_price)]:
  results[name] = fn()

print(results)`,

    explain: {
      concept: '여러 에이전트를 차례로 호출해 각각의 결과를 한 곳에 모으는 거예요. 여러 심부름꾼에게 다른 일을 맡기고 돌아온 결과를 모으는 것과 같아요. 실제로 동시에 실행하려면 asyncio나 threading을 써야 해요.',
      terms: [
        { t: 'fetch_news', d: '뉴스를 가져오는 에이전트 함수예요.' },
        { t: 'fetch_price', d: '가격을 가져오는 에이전트 함수예요.' },
        { t: 'results', d: '각 에이전트 결과를 모아둔 사전이에요.' }
      ],
      why: '여러 종류의 정보를 각기 다른 에이전트가 담당하면 역할이 명확해져요.',
      pitfall: '이 코드는 순차 실행이에요. 진짜 병렬 실행이 필요하면 asyncio.gather()를 사용하세요.'
    }
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

result = format_result("search", "파이썬 문서")
print(result["output"])`,

    explain: {
      concept: '도구가 돌려주는 결과를 정해진 틀에 담아 일관되게 만드는 거예요. 심부름 결과를 똑같은 모양 봉투에 담아오는 것과 같아요.',
      terms: [
        { t: 'format_result', d: '결과를 표준 형태의 사전으로 감싸는 함수예요.' },
        { t: 'tool', d: '실행한 도구의 이름이에요.' },
        { t: 'output', d: '도구가 만들어낸 실제 결과예요.' },
        { t: 'ok', d: '성공 여부를 표시하는 표식이에요.' }
      ],
      why: '결과 형태가 같으면 다루는 쪽에서 일관되게 처리할 수 있어요.',
      pitfall: '실패한 결과도 ok가 True로 나오면 안 돼요.'
    }
  },
  {
    id: 'pagent-llm-decide',
    lang: 'python',
    title: 'LLM 도구 선택',
    file: 'llm_decide.py',
    code: `def decide_tool(question: str) -> str:
  prompt = f"질문: {question}\n도구 선택:"
  # 실제 서비스에서는 LLM이 아래와 같은 형태로 응답
  reply = "도구: search"
  return reply.split(":")[-1].strip()

choice = decide_tool("최신 뉴스 알려줘")
print(choice)`,

    explain: {
      concept: 'AI(LLM)가 질문을 읽고 어떤 도구를 쓸지 스스로 정하는 거예요. 의사가 환자 말을 듣고 어떤 검사를 할지 고르는 것과 같아요.',
      terms: [
        { t: 'decide_tool', d: '질문을 받아 도구 이름을 골라주는 함수예요.' },
        { t: 'prompt', d: 'AI에게 주는 지시 문장이에요. 줄바꿈(\\n)으로 질문과 선택 지시를 구분해요.' },
        { t: 'reply', d: 'AI가 돌려준 응답이에요. "도구: search" 형태에서 콜론 뒤를 잘라 도구 이름을 얻어요.' }
      ],
      why: '사람이 일일이 도구를 지정하지 않아도 AI가 판단할 수 있어요.',
      pitfall: 'AI가 없는 도구 이름을 부르면 실행이 안 돼요.'
    }
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

print(step(""))`,

    explain: {
      concept: '에이전트의 현재 상태에 따라 다음 행동이 달라지게 만드는 거예요. 신호등이 색깔에 따라 다음 색이 정해지는 것과 같아요.',
      terms: [
        { t: 'state', d: '에이전트의 현재 상태를 담는 변수예요.' },
        { t: 'step', d: '입력을 받아 상태를 다음 단계로 바꾸는 함수예요.' },
        { t: 'global', d: '함수 밖 변수를 함수 안에서 바꾸게 해주는 키워드예요.' }
      ],
      why: '상태를 두면 복잡한 흐름도 단계별로 깔끔하게 관리할 수 있어요.',
      pitfall: '상태 전환 조건이 꼬이면 엉뚱한 행동을 해요.'
    }
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

observe("A")
observe("B")
print(summary())`,

    explain: {
      concept: '여러 번 관찰한 결과를 차곡차곡 쌓아 두는 거예요. 탐정이 단서를 노트에 차례로 적어두는 것과 같아요.',
      terms: [
        { t: 'observations', d: '관찰 결과를 순서대로 담는 리스트예요.' },
        { t: 'observe', d: '새 관찰 결과를 버퍼에 추가하는 함수예요.' },
        { t: 'summary', d: '최근 결과 몇 개를 이어붙인 요약이에요.' }
      ],
      why: '지금까지 본 것을 모아두면 다음 결정에 참고할 수 있어요.',
      pitfall: '너무 많이 쌓으면 요약이 길어져 비용이 커요.'
    }
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

ok = validate_args({"query": "x"}, {"required": ["query"]})
print(ok)`,

    explain: {
      concept: '도구를 실행하기 전에 필요한 값이 다 들어왔는지 확인하는 거예요. 요리 전에 냉장고에 재료가 다 있는지 세어보는 것과 같아요.',
      terms: [
        { t: 'validate_args', d: '받은 값과 스키마를 비교해 검사하는 함수예요.' },
        { t: 'required', d: '반드시 있어야 하는 값 목록이에요.' },
        { t: 'ok', d: '검사 통과 여부를 담는 변수예요.' }
      ],
      why: '값이 빠진 채로 도구를 실행하면 에러가 나기 때문이에요.',
      pitfall: '값이 있어도 형식이 틀리면 잡아내지 못해요.'
    }
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

points = critique("아마 그럴 거예요")
print(points)`,

    explain: {
      concept: '자신이 만든 결과를 비판적으로 살펴 약점을 찾는 거예요. 작가가 초고를 읽으며 어색한 부분에 밑줄을 긋는 것과 같아요.',
      terms: [
        { t: 'critique', d: '결과에서 약점을 찾아내는 함수예요.' },
        { t: 'notes', d: '찾아낸 비평점들을 담은 리스트예요.' },
        { t: 'points', d: '비평 결과를 담는 변수예요.' }
      ],
      why: '스스로 약점을 알면 더 나은 답으로 고칠 수 있어요.',
      pitfall: '비평이 너무 가혹하면 답을 못 내놓게 돼요.'
    }
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

print(orchestrate("AI"))`,

    explain: {
      concept: '여러 에이전트의 흐름을 한 곳에서 조율하는 거예요. 지휘자가 악기별 연주자를 순서대로 이끄는 것과 같아요.',
      terms: [
        { t: 'agents', d: '이름과 에이전트 함수를 짝지은 사전이에요.' },
        { t: 'orchestrate', d: '여러 에이전트를 차례로 불러 결과를 만드는 함수예요.' },
        { t: 'out', d: '이전 결과를 이어받아 다음 에이전트에 전하는 값이에요.' }
      ],
      why: '누가 먼저 할지 정해 두면 흐름이 어지럽지 않아요.',
      pitfall: '순서를 잘못 정하면 결과가 꼬여요.'
    }
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

ctx = agent_b(agent_a({}))
print(ctx["from_b"])`,

    explain: {
      concept: '한 에이전트가 작업 중인 상황(문맥)을 다음 에이전트에게 넘겨주는 거예요. 이어 달리기에서 바통을 다음 주자에게 건네는 것과 같아요.',
      terms: [
        { t: 'context', d: '지금까지 진행된 정보를 담은 상자예요.' },
        { t: 'agent_a', d: '첫 번째 에이전트로 자료를 추가해요.' },
        { t: 'agent_b', d: '받은 문맥에 분석을 덧붙이는 에이전트예요.' }
      ],
      why: '문맥을 넘기면 다음 에이전트가 처음부터 다시 알 필요가 없어요.',
      pitfall: '문맥 키가 서로 달라지면 다음 에이전트가 못 읽어요.'
    }
  }
];
