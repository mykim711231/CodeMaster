import type { Snippet } from '../../types';

export const pythonPrompt: Snippet[] = [
  {
    id: 'pprompt-fewshot-basic',
    lang: 'python',
    title: 'Few-shot 예시로 패턴 가르치기',
    file: 'fewshot_basic.py',
    code: `prompt = (
    "감정 분류 예시\\n"
    "문장: 오늘 너무 좋아! -> 긍정\\n"
    "문장: 기분이 최악이야. -> 부정\\n"
    "문장: 영화 재밌더라. -> "
)
print(prompt)`,
    explain: {
      concept: '모델에게 몇 개의 예시(정답 보기)를 먼저 보여주면, 모델이 그 패턴을 흉내 내어 다음 정답을 만들어요. 마치 선생님이 풀이 예시를 몇 개 보여준 뒤 비슷한 문제를 내주는 것과 같아요.',
      terms: [
        { t: 'prompt', d: '모델에게 보여주는 입력 글 전체예요' },
        { t: '예시', d: '정답이 같이 있는 보기 문장들이에요' },
        { t: '->', d: '문장과 정답을 이어주는 표시예요' }
      ],
      why: '예시가 있으면 모델이 원하는 출력 형식을 정확히 따라하기 쉬워요.'
    }
  },
  {
    id: 'pprompt-fewshot-list',
    lang: 'python',
    title: '리스트로 예시 묶어 넣기',
    file: 'fewshot_list.py',
    code: `examples = [
    ("비가 와서 우산 챙겼어", "날씨"),
    ("버스가 늦게 와서 지각했어", "교통"),
]
question = "스마트폰이 꺼졌어"
prompt = ""
for text, tag in examples:
    prompt += f"{text} -> {tag}\\n"
prompt += f"{question} -> "
print(prompt)`,
    explain: {
      concept: '예시를 리스트에 담아두면, 반복문으로 깔끔하게 이어 붙일 수 있어요. 레고 블록을 차례로 끼워 넣듯 예시를 쌓는 방식이에요.',
      terms: [
        { t: 'examples', d: '예시 문장과 정답을 짝지어 담은 목록이에요' },
        { t: 'for', d: '예시를 하나씩 꺼내 반복하는 명령이에요' },
        { t: 'f"{text}"', d: '변수 값을 글자 안에 끼워 넣는 표현이에요' }
      ],
      why: '예시가 많아져도 코드를 깔끔하게 유지할 수 있어요.'
    }
  },
  {
    id: 'pprompt-cot-basic',
    lang: 'python',
    title: 'Chain-of-Thought 단계 생각',
    file: 'cot_basic.py',
    code: `prompt = (
    "Q: 가게에 사과 20개가 있었어. 6개 팔고 3개 버렸어. 몇 개 남았을까?\\n"
    "생각: 먼저 20에서 6을 빼면 14야. 그다음 3을 빼면 11야.\\n"
    "A: 11\\n\\n"
    "Q: 빈 상자에 연필 5개 넣고 2개 꺼냈어. 몇 개 남았을까?\\n"
    "생각: "
)
print(prompt)`,
    explain: {
      concept: '모델이 답만 말하지 않고, 중간 생각(풀이 과정)을 먼저 적게 만드는 방식이에요. 수학 문제를 풀 때 풀이 과정을 거침과 같아요.',
      terms: [
        { t: '생각:', d: '중간 풀이 단계를 적는 자리예요' },
        { t: 'A:', d: '최종 정답을 적는 자리예요' },
        { t: '예시 풀이', d: '모델이 따라 할 풀이 방식이에요' }
      ],
      why: '중간 단계를 거치면 복잡한 계산에서 정답률이 올라가요.'
    }
  },
  {
    id: 'pprompt-cot-trigger',
    lang: 'python',
    title: '생각 유발 문구로 풀이 유도',
    file: 'cot_trigger.py',
    code: `question = "토끼 7마리가 당근을 3개씩 가졌어. 4마리가 도망가면 남은 당근은?"
prompt = question + "\\n단계별로 생각해 보자:\\n1. "
print(prompt)`,
    explain: {
      concept: '"단계별로 생각해 보자" 같은 문구를 붙이면 모델이 풀이 과정을 적기 시작해요. 친구에게 "하나씩 차근차근 설명해 봐"라고 부탁하는 것과 비슷해요.',
      terms: [
        { t: 'question', d: '모델에게 풀어줄 문제예요' },
        { t: '단계별로 생각해 보자', d: '풀이 과정을 유발하는 문구예요' },
        { t: '1.', d: '첫 번째 단계 번호예요' }
      ],
      why: '짧은 문구만으로도 모델이 풀이 과정을 쓰도록 유도할 수 있어요.'
    }
  },
  {
    id: 'pprompt-cot-self-consistency',
    lang: 'python',
    title: '여러 번 풀고 가장 많은 답 고르기',
    file: 'cot_self_consistency.py',
    code: `from collections import Counter

answers = [11, 11, 11, 12, 11]
counts = Counter(answers)
best = counts.most_common(1)[0][0]
print(best)`,
    explain: {
      concept: '같은 문제를 여러 번 풀어서 가장 많이 나온 답을 정답으로 삼아요. 친구들 여럿에게 물어보고 다수결로 정하는 것과 같아요.',
      terms: [
        { t: 'answers', d: '여러 번 얻은 답들을 모은 목록이에요' },
        { t: 'Counter', d: '값이 몇 번 나왔는지 세어 주는 도구예요' },
        { t: 'most_common', d: '가장 많이 나온 값을 찾아주는 기능이에요' }
      ],
      why: '한 번의 실수를 희석해서 더 안정적인 답을 얻을 수 있어요.'
    }
  },
  {
    id: 'pprompt-json-output',
    lang: 'python',
    title: 'JSON 형식으로 답 받기',
    file: 'json_output.py',
    code: `prompt = (
    "다음 문장의 감정을 JSON으로 답해.\\n"
    '문장: 오늘은 행복해.\\n'
    '형식: {"감정": "...", "점수": 0~100}\\n'
)
print(prompt)`,
    explain: {
      concept: '모델이 답을 JSON(키:값 구조)으로 만들어 주도록 형식을 정해주는 방식이에요. 양식을 주고 빈칸을 채우게 하는 것과 비슷해요.',
      terms: [
        { t: 'JSON', d: '키와 값으로 이루어진 글자 구조예요' },
        { t: '형식', d: '답이 어떤 모양이어야 하는지 보여주는 틀이에요' },
        { t: '키', d: '값의 이름표(예: 감정)예요' }
      ],
      why: '기계가 결과를 바로 읽고 쓸 수 있어요.'
    }
  },
  {
    id: 'pprompt-json-parsing',
    lang: 'python',
    title: '모델 답을 JSON으로 파싱',
    file: 'json_parse.py',
    code: `import json
reply = '{"감정": "슬픔", "점수": 80}'
data = json.loads(reply)
print(data["감정"])
print(data["점수"] + 10)`,
    explain: {
      concept: '모델이 보낸 글자를 JSON 구조(딕셔너리)로 바꿔주면, 키 이름으로 값을 꺼낼 수 있어요. 봉투 겉면의 주소를 보고 내용물을 꺼내는 것과 같아요.',
      terms: [
        { t: 'json.loads', d: '글자를 딕셔너리로 바꿔주는 함수예요' },
        { t: 'data', d: '바꾼 결과로 키로 값을 꺼낼 수 있어요' },
        { t: 'reply', d: '모델이 보낸 JSON 글자예요' }
      ],
      why: '글자인 답을 프로그램에서 바로 쓸 수 있게 만들어요.'
    }
  },
  {
    id: 'pprompt-json-schema',
    lang: 'python',
    title: 'JSON Schema로 답 구조 검증',
    file: 'json_schema.py',
    code: `schema = {
    "type": "object",
    "properties": {
        "이름": {"type": "string"},
        "나이": {"type": "integer", "minimum": 0}
    },
    "required": ["이름", "나이"]
}
print(schema)`,
    explain: {
      concept: 'JSON Schema는 "답이 어떤 키와 값으로 이루어져야 하는지" 적어둔 설계도예요. 건축 도면처럼 모양을 정해두면 검증하기 쉬워요.',
      terms: [
        { t: 'schema', d: '답의 구조를 정의한 설계도예요' },
        { t: 'type', d: '값이 글자인지 숫자인지 정하는 항목이에요' },
        { t: 'required', d: '반드시 있어야 하는 키 목록이에요' }
      ],
      why: '답이 규칙을 지키는지 기계로 검사할 수 있어요.'
    }
  },
  {
    id: 'pprompt-jsonschema-validate',
    lang: 'python',
    title: 'jsonschema로 답 검사하기',
    file: 'jsonschema_validate.py',
    code: `import jsonschema
schema = {"type": "object", "required": ["감정"]}
data = {"감정": "기쁨"}
try:
    jsonschema.validate(data, schema)
    print("검증 통과")
except jsonschema.ValidationError as e:
    print("오류:", e.message)`,
    explain: {
      concept: 'jsonschema 패키지로 답이 설계도(schema)에 맞는지 점검해요. 품질 검사원이 제품이 규격에 맞는지 확인하는 것과 비슷해요.',
      terms: [
        { t: 'validate', d: '답이 규칙에 맞는지 검사하는 함수예요' },
        { t: 'ValidationError', d: '규칙을 어겼을 때 나는 오류예요' },
        { t: 'try/except', d: '오류를 잡아서 처리하는 구조예요' }
      ],
      why: '잘못된 답이 다음 단계로 넘어가는 것을 막아요.',
      pitfall: 'jsonschema 패키지를 먼저 설치해야 해요.'
    }
  },
  {
    id: 'pprompt-pydantic-model',
    lang: 'python',
    title: 'Pydantic 모델로 답 구조 정의',
    file: 'pydantic_model.py',
    code: `from pydantic import BaseModel

class Feeling(BaseModel):
    감정: str
    점수: int

item = Feeling(감정="즐거움", 점수=90)
print(item.감정)
print(item.점수)`,
    explain: {
      concept: 'Pydantic 모델은 클래스로 답의 구조(키와 자료형)를 정의해요. 설계도대로 객체를 찍어내는 것처럼, 정해진 모양의 답을 만들 수 있어요.',
      terms: [
        { t: 'BaseModel', d: '구조 정의의 바탕이 되는 클래스예요' },
        { t: 'Feeling', d: '내가 만든 답 구조 모델이에요' },
        { t: '감정: str', d: '감정은 글자여야 한다는 규칙이에요' }
      ],
      why: '자료형을 자동으로 검사해서 안전한 답을 받을 수 있어요.'
    }
  },
  {
    id: 'pprompt-pydantic-validate',
    lang: 'python',
    title: 'Pydantic으로 자료형 검증',
    file: 'pydantic_validate.py',
    code: `from pydantic import BaseModel, ValidationError

class Feeling(BaseModel):
    점수: int

try:
    item = Feeling(점수="아흐흐")
except ValidationError as e:
    print("검증 실패")
    print(e.errors())`,
    explain: {
      concept: 'Pydantic은 값을 넣을 때 자료형을 자동으로 검사해요. 점수 자리에 글자를 넣으면 바로 오류로 알려줘요.',
      terms: [
        { t: 'ValidationError', d: '자료형이 틀렸을 때 나는 오류예요' },
        { t: 'errors', d: '무엇이 잘못됐는지 알려주는 목록이에요' },
        { t: '점수: int', d: '점수는 정수여야 한다는 규칙이에요' }
      ],
      why: '잘못된 자료형이 들어와도 프로그램이 안전하게 막아줘요.'
    }
  },
  {
    id: 'pprompt-pydantic-from-json',
    lang: 'python',
    title: 'JSON 글자를 Pydantic 객체로',
    file: 'pydantic_from_json.py',
    code: `from pydantic import BaseModel

class Feeling(BaseModel):
    감정: str
    점수: int

reply = '{"감정": "분노", "점수": 70}'
item = Feeling.model_validate_json(reply)
print(item.감정)`,
    explain: {
      concept: '모델이 보낸 JSON 글자를 바로 Pydantic 객체로 바꿔주는 방법이에요. 봉투째로 받은 물건을 꺼내 정리해 두는 것과 같아요.',
      terms: [
        { t: 'model_validate_json', d: 'JSON 글자를 객체로 바꿔주는 기능이에요' },
        { t: 'reply', d: '모델이 보낸 JSON 글자예요' },
        { t: 'item', d: '검증까지 끝난 객체예요' }
      ],
      why: '파싱과 검증을 한 번에 끝낼 수 있어요.'
    }
  },
  {
    id: 'pprompt-pydantic-to-json',
    lang: 'python',
    title: 'Pydantic 객체를 JSON으로 내보내기',
    file: 'pydantic_to_json.py',
    code: `from pydantic import BaseModel

class Feeling(BaseModel):
    감정: str
    점수: int

item = Feeling(감정="놀람", 점수=60)
text = item.model_dump_json()
print(text)`,
    explain: {
      concept: '만든 객체를 다시 JSON 글자로 바꿔주는 방법이에요. 정리한 물건을 다시 봉투에 넣어 보내는 것과 비슷해요.',
      terms: [
        { t: 'model_dump_json', d: '객체를 JSON 글자로 바꿔주는 기능이에요' },
        { t: 'item', d: '구조가 검증된 객체예요' },
        { t: 'text', d: '바뀐 JSON 글자예요' }
      ],
      why: '객체를 저장하거나 전송하기 좋은 글자로 만들어요.'
    }
  },
  {
    id: 'pprompt-pydantic-json-schema',
    lang: 'python',
    title: 'Pydantic에서 JSON Schema 자동 생성',
    file: 'pydantic_json_schema.py',
    code: `from pydantic import BaseModel
import json

class Feeling(BaseModel):
    감정: str
    점수: int

schema = Feeling.model_json_schema()
print(json.dumps(schema, ensure_ascii=False, indent=2))`,
    explain: {
      concept: 'Pydantic 모델에서 JSON Schema를 자동으로 만들어 낼 수 있어요. 설계도(클래스)를 한 번 작성하면 검증 규칙 문서도 자동으로 뽑혀 나오는 것과 같아요.',
      terms: [
        { t: 'model_json_schema', d: 'Pydantic 모델을 JSON Schema 딕셔너리로 변환해 주는 클래스 메서드예요' },
        { t: 'json.dumps', d: '딕셔너리를 보기 좋은 JSON 글자로 바꿔주는 함수예요' },
        { t: 'ensure_ascii=False', d: '한글 등 비ASCII 문자를 그대로 출력하도록 하는 옵션이에요' }
      ],
      why: 'API에 스키마를 넘길 때 클래스 하나로 코드와 규칙을 함께 관리할 수 있어요.'
    }
  },
  {
    id: 'pprompt-function-calling',
    lang: 'python',
    title: '함수 호출(Function Calling) 도구 정의',
    file: 'function_calling.py',
    code: `tools = [{
    "type": "function",
    "function": {
        "name": "get_weather",
        "description": "도시의 날씨를 알려줘요",
        "parameters": {
            "type": "object",
            "properties": {"도시": {"type": "string"}},
            "required": ["도시"]
        }
    }
}]
print(tools)`,
    explain: {
      concept: '모델이 쓸 수 있는 함수(도구)를 미리 정의해 두면, 필요할 때 모델이 함수를 선택해 불러요. 도구함에 도구를 넣어두고 쓸 도구를 고르는 것과 같아요.',
      terms: [
        { t: 'tools', d: '모델이 사용할 수 있는 함수 목록이에요' },
        { t: 'function', d: '하나의 함수 정보를 담는 항목이에요' },
        { t: 'parameters', d: '함수에 넘겨줄 값의 구조예요' }
      ],
      why: '모델이 직접 행동(함수 실행)을 유도할 수 있어요.'
    }
  },
  {
    id: 'pprompt-function-args',
    lang: 'python',
    title: '모델이 고른 함수 인자 꺼내기',
    file: 'function_args.py',
    code: `import json

# 실제 OpenAI 응답 구조를 단순화한 예시입니다.
# 실제 응답은 response.choices[0].message.tool_calls[0].function 으로 접근합니다.
func_call = {
    "name": "get_weather",
    "arguments": '{"도시": "서울"}'
}
name = func_call["name"]
args = json.loads(func_call["arguments"])
print(name, args["도시"])`,
    explain: {
      concept: '모델이 어떤 함수를 고르고 어떤 값을 넘길지 답으로 보내면, 그걸 꺼내서 실제 함수에 쓸 수 있어요. 주문서를 받아 요리를 시작하는 것과 비슷해요.',
      terms: [
        { t: 'func_call', d: '모델이 고른 함수와 인자 정보를 담은 딕셔너리예요' },
        { t: 'arguments', d: '함수에 넘길 값들이 담긴 JSON 글자예요' },
        { t: 'json.loads', d: '글자를 딕셔너리로 바꿔주는 함수예요' }
      ],
      why: '모델의 선택을 실제 동작으로 연결할 수 있어요.',
      pitfall: '이 코드는 실제 API 응답 구조를 단순화한 예시예요. 실제 OpenAI API 응답은 response.choices[0].message.tool_calls[0].function.name 형태로 접근해야 해요.'
    }
  },
  {
    id: 'pprompt-system-role',
    lang: 'python',
    title: '역할 부여로 Function Calling 맥락 잡기',
    file: 'system_role.py',
    code: `# Function Calling 호출 시 system 메시지로 도구 사용 맥락을 잡아줘요.
messages = [
    {
        "role": "system",
        "content": "너는 날씨 안내 도우미야. 날씨 질문은 반드시 get_weather 함수를 호출해."
    },
    {"role": "user", "content": "서울 날씨 알려줘."}
]
for m in messages:
    print(m["role"], ":", m["content"])`,
    explain: {
      concept: '메시지 목록 맨 앞에 system 역할을 두면 모델이 어떻게 행동해야 하는지 기준을 정해줘요. Function Calling에서도 system 메시지로 "어떤 도구를 언제 쓸지" 알려주면 정확한 함수 선택이 이루어져요.',
      terms: [
        { t: 'role: "system"', d: '모델에게 기본 행동 규칙을 전달하는 역할이에요' },
        { t: 'messages', d: '역할과 내용을 담은 대화 목록이에요' },
        { t: 'content', d: '해당 역할이 말하는 내용이에요' }
      ],
      why: 'system 메시지로 도구 사용 기준을 명확히 하면 Function Calling 정확도가 올라가요.'
    }
  },
  {
    id: 'pprompt-message-history',
    lang: 'python',
    title: 'Few-shot을 messages 형식으로 전달',
    file: 'message_history.py',
    code: `# Few-shot 예시를 user/assistant 메시지 쌍으로 구성해요.
messages = [
    {"role": "system", "content": "문장의 감정을 한 단어로 말해."},
    {"role": "user",      "content": "오늘 너무 좋아!"},
    {"role": "assistant", "content": "긍정"},
    {"role": "user",      "content": "기분이 최악이야."},
    {"role": "assistant", "content": "부정"},
    {"role": "user",      "content": "영화 재밌더라."}
]
for m in messages:
    print(f"[{m['role']}] {m['content']}")`,
    explain: {
      concept: 'Few-shot 예시를 단순 글자 대신 user/assistant 메시지 쌍으로 만들어 넣을 수 있어요. 대화 형식으로 예시를 주면 채팅 API에서 그대로 사용할 수 있어요.',
      terms: [
        { t: 'system', d: '모델에게 역할과 규칙을 알려주는 메시지 역할이에요' },
        { t: 'assistant', d: '모델의 답변을 나타내는 역할로, 여기서는 Few-shot 정답 예시예요' },
        { t: 'user', d: '사람이 보내는 질문 역할로, 여기서는 Few-shot 입력 예시예요' }
      ],
      why: 'messages 형식의 Few-shot은 OpenAI·Anthropic 등 모든 채팅 API에 바로 붙여 쓸 수 있어요.'
    }
  },
  {
    id: 'pprompt-delimiter',
    lang: 'python',
    title: '구분자로 JSON Schema 입력 구역 나누기',
    file: 'delimiter.py',
    code: `import json

schema = {"type": "object", "required": ["요약"]}
text = "오늘은 비가 와서 외출을 취소했어."
delimiter = "---"

prompt = (
    f"아래 JSON Schema를 따라 답해.\\n"
    f"Schema: {json.dumps(schema, ensure_ascii=False)}\\n"
    f"{delimiter}\\n"
    f"입력: {text}\\n"
    f"{delimiter}"
)
print(prompt)`,
    explain: {
      concept: '구분자(기호)로 프롬프트 영역을 나누면 모델이 JSON Schema 지시와 실제 입력 텍스트를 헷갈리지 않아요. 울타리로 밭을 둘러싸 구역을 표시하는 것과 같아요.',
      terms: [
        { t: 'delimiter', d: '지시문과 입력 구역을 나누는 기호예요' },
        { t: 'schema', d: '모델 답의 구조를 정해주는 JSON Schema예요' },
        { t: 'json.dumps', d: 'schema 딕셔너리를 JSON 글자로 바꿔주는 함수예요' }
      ],
      why: '구분자가 있으면 지시문·스키마·입력이 섞이지 않아 구조화 출력이 안정적으로 나와요.'
    }
  },
  {
    id: 'pprompt-instruction-format',
    lang: 'python',
    title: '지시문·Pydantic 스키마·입력 묶기',
    file: 'instruction_format.py',
    code: `from pydantic import BaseModel
import json

class Summary(BaseModel):
    요약: str
    감정: str

schema = Summary.model_json_schema()
input_text = "오늘은 비가 와서 외출을 취소하고 집에서 책을 읽었어."

prompt = (
    "아래 JSON Schema 형식으로 답해.\\n"
    f"Schema: {json.dumps(schema, ensure_ascii=False)}\\n"
    f"입력: {input_text}"
)
print(prompt)`,
    explain: {
      concept: '지시문(무엇을 할지)·Pydantic에서 뽑은 스키마(어떤 형태로)·입력(대상 글)을 하나로 묶어 프롬프트를 만들어요. 요리법 카드처럼 재료·방법·결과물 형태를 한 장에 적는 것과 같아요.',
      terms: [
        { t: 'model_json_schema', d: 'Pydantic 클래스에서 JSON Schema를 자동으로 만들어 주는 메서드예요' },
        { t: 'schema', d: '모델이 지켜야 할 출력 구조 설계도예요' },
        { t: 'input_text', d: '모델이 처리할 실제 입력 글이에요' }
      ],
      why: 'Pydantic 스키마를 프롬프트에 넣으면 JSON 파싱과 검증을 연이어 적용할 수 있어요.'
    }
  }
];
