# Prompt & Structured Output
## Official Documentation
- [Prompt Engineering Guide](https://www.promptingguide.ai/)
- [OpenAI Function Calling](https://platform.openai.com/docs/guides/function-calling)
- [Pydantic](https://docs.pydantic.dev/latest/)

## 핵심 개념
> 프롬프트 엔지니어링은 LLM의 출력 품질을 높이기 위해 입력을 설계하는 기법이다. Few-shot은 예시를 제공하여 모델이 패턴을 학습하게 하고, Chain-of-Thought(CoT)는 단계적 추론을 유도한다. Function Calling은 모델이 정해진 JSON Schema에 따라 호출할 함수와 인자를 선택하게 하며, Pydantic과 결합하여 구조화된 출력을 타입 안전하게 파싱하고 검증할 수 있다.

## 학습 목표
- Few-shot 프롬프트로 출력 형식 제어하기
- Chain-of-Thought 프롬프트로 복잡한 추론 작업 정확도 향상시키기
- Function Calling을 통해 LLM과 외부 API 연동 구현하기
- JSON Schema로 출력 구조를 정의하고 응답 검증하기
- Pydantic 모델로 구조화된 LLM 응답 파싱 및 엄격한 타입 검증하기

## 예제 코드
```python
# Few-shot + Chain-of-Thought
from openai import OpenAI

client = OpenAI()

prompt = """Q: 철수가 사과 5개를 가지고 있었고, 영희가 3개를 더 줬다. 몇 개인가?
단계별로 생각해보자:
1. 철수가 처음 가진 사과: 5개
2. 영희가 준 사과: 3개
3. 더하면: 5 + 3 = 8개
답: 8

Q: 가방에 책 12권이 있었는데 4권을 꺼냈다. 몇 권인가?
"""

response = client.chat.completions.create(
    model="gpt-4",
    messages=[{"role": "user", "content": prompt}],
    temperature=0,
)
print(response.choices[0].message.content)
```
```python
# Function Calling
tools = [{
    "type": "function",
    "function": {
        "name": "get_weather",
        "description": "현재 날씨 조회",
        "parameters": {
            "type": "object",
            "properties": {
                "city": {"type": "string", "description": "도시명"},
                "unit": {"type": "string", "enum": ["celsius", "fahrenheit"]}
            },
            "required": ["city"]
        }
    }
}]

response = client.chat.completions.create(
    model="gpt-4",
    messages=[{"role": "user", "content": "서울 날씨 어때?"}],
    tools=tools,
    tool_choice="auto",
)
tool_call = response.choices[0].message.tool_calls[0]
print(tool_call.function.name)     # get_weather
print(tool_call.function.arguments) # {"city": "서울"}
```
```python
# Pydantic 구조화 출력
from pydantic import BaseModel, Field
from typing import List
import json

class SentimentResult(BaseModel):
    sentiment: str = Field(description="긍정/부정/중립")
    score: float = Field(ge=0, le=1, description="확신도 점수")
    keywords: List[str] = Field(description="핵심 키워드")

response = client.chat.completions.create(
    model="gpt-4",
    messages=[{
        "role": "user",
        "content": "이 리뷰 분석: '배송 빠르고 품질 좋아요'",
    }],
    response_format={"type": "json_object"},
)
result = SentimentResult.model_validate_json(
    response.choices[0].message.content
)
print(result.model_dump())

# 출력 검증
if result.score < 0.5:
    raise ValueError("낮은 확신도")
```
```python
# instructor 라이브러리로 더 간결하게
import instructor

client = instructor.from_openai(OpenAI())

response = client.chat.completions.create(
    model="gpt-4",
    response_model=SentimentResult,
    messages=[{"role": "user", "content": "배송이 너무 느려요"}],
)
print(response.sentiment, response.score)
```

## 주요 패턴
- Few-shot 예시 제공: 2~4개의 예시로 원하는 출력 포맷을 학습시킴
- Chain-of-Thought: "단계별로 생각해보자" 유도문으로 추론 과정을 명시적으로 드러냄
- Function Calling + Pydantic: 함수 파라미터를 Pydantic 모델로 정의하고 자동 검증
- JSON Schema 강제: `response_format={type: "json_object"}`으로 JSON 출력을 보장
- 출력 재시도 루프: 파싱 실패 시 피드백을 포함해 재요청하는 패턴

## 주의사항
- JSON 스키마가 너무 복잡하면 모델이 스키마를 무시하고 자유 형식으로 응답할 수 있음
- Few-shot 예시가 편향되면 출력이 예시 방향으로 쏠리는 현상 발생
- Function Calling 시 tool_choice="auto"가 예상치 못한 도구를 호출할 수 있음
- Pydantic 검증이 실패할 경우를 대비한 재시도 로직이 반드시 필요함
