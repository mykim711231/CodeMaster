# AI Quality & Safety
## Official Documentation
- [SHAP 공식 문서](https://shap.readthedocs.io/en/latest/)
- [RAGAS](https://docs.ragas.io/)
- [Langfuse](https://langfuse.com/docs)
- [LangSmith](https://docs.smith.langchain.com/)
- [Guardrails AI](https://www.guardrailsai.com/docs)

## 핵심 개념
> AI 시스템의 품질과 안전성은 프로덕션 배포의 핵심 요소다. RAGAS는 RAG 시스템의 faithfulness, relevancy 등을 정량 평가하고, Langfuse/LangSmith는 LLM 트레이싱과 평가를 위한 관측 가능성 플랫폼이다. Guardrails는 출력을 구조화된 규칙으로 검증하며, Prompt Injection 방어와 PII 마스킹은 보안의 필수 요소다.

## 학습 목표
- RAGAS로 RAG 파이프라인의 faithfulness, answer_relevancy 등 평가하기
- Langfuse로 LLM 호출 트레이싱 및 비용 모니터링 구축하기
- LangSmith로 체인 디버깅 및 평가 데이터셋 관리하기
- Prompt Injection 공격 유형을 이해하고 방어 로직 구현하기
- PII(개인정보) 마스킹으로 로그와 출력에서 민감정보 보호하기

## 예제 코드
```python
# RAGAS 평가
from ragas import evaluate
from ragas.metrics import faithfulness, answer_relevancy, context_recall
from datasets import Dataset

eval_dataset = Dataset.from_dict({
    "question": ["Python이란 무엇인가?"],
    "answer": ["Python은 고수준 프로그래밍 언어입니다."],
    "contexts": [["Python은 인터프리터 방식의 언어로..."/ ]],
    "ground_truth": ["Python은 범용 고수준 프로그래밍 언어이다."],
})

result = evaluate(
    eval_dataset,
    metrics=[faithfulness, answer_relevancy, context_recall],
)
print(result)
# {'faithfulness': 0.85, 'answer_relevancy': 0.92, 'context_recall': 0.78}
```
```python
# Langfuse 트레이싱
from langfuse import Langfuse

langfuse = Langfuse(
    public_key="pk-xxx",
    secret_key="sk-xxx",
)

trace = langfuse.trace(name="rag-query")
span = trace.span(name="retrieval")
span.end(input="query", output={"chunks": 5})

generation = trace.generation(
    name="llm-answer",
    model="gpt-4",
    input={"prompt": "..."},
    output={"answer": "..."},
    usage={"prompt_tokens": 100, "completion_tokens": 50},
)
generation.end()
langfuse.flush()
```
```python
# Prompt Injection 방어
import re

def sanitize_input(user_input: str) -> str:
    injection_patterns = [
        r"ignore (all )?previous (instructions|prompt)",
        r"you are now DAN",
        r"system:\s*",
        r"<\|im_start\|>system",
        r"\[INST\].*\[/INST\]",
    ]
    for pattern in injection_patterns:
        if re.search(pattern, user_input, re.IGNORECASE):
            raise ValueError("Potential prompt injection detected")
    return user_input

def validate_role(messages: list) -> list:
    for i, msg in enumerate(messages):
        if i == 0 and msg["role"] != "system":
            messages.insert(0, {"role": "system", "content": "You are a helpful assistant."})
        if msg["role"] == "user" and "system" in msg["content"].lower():
            msg["content"] = msg["content"].replace("[SYSTEM]", "[SANITIZED]")
    return messages
```
```python
# PII 마스킹
import re
from typing import Dict

PII_PATTERNS = {
    "email": r"[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}",
    "phone": r"\b01[016789]-\d{3,4}-\d{4}\b",
    "resident_id": r"\b\d{6}-[1-4]\d{6}\b",
    "credit_card": r"\b\d{4}[\s-]\d{4}[\s-]\d{4}[\s-]\d{4}\b",
}

def mask_pii(text: str) -> Dict[str, str]:
    masked = text
    for pii_type, pattern in PII_PATTERNS.items():
        masked = re.sub(pattern, f"[{pii_type.upper()}]", masked)
    return {"original": text, "masked": masked}

result = mask_pii("Contact: hong@example.com, 010-1234-5678")
print(result["masked"])
# Contact: [EMAIL], [PHONE]
```
```python
# Guardrails 출력 검증
from guardrails import Guard
from guardrails.hub import ToxicLanguage, ProfanityFree

guard = Guard().use_many(
    ToxicLanguage(threshold=0.5),
    ProfanityFree(),
)

try:
    result = guard.validate("This output is clean and safe.")
    print(result.validated_output)
except Exception as e:
    print(f"Validation failed: {e}")
```

## 주요 패턴
- RAGAS 평가 루프: RAG 응답 → 평가 메트릭 측정 → 낮은 점수 영역 개선 → 재평가
- Langfuse 관측: Trace(전체 흐름) → Span(세부 단계) → Generation(LLM 호출) 계층 구조
- Defense in Depth: 입력 sanitization + system prompt 고정 + 출력 검증 3중 방어
- PII 파이프라인: 로깅 전 PII 마스킹 → 허용된 환경에서만 원본 복원
- Guardrails RAIL: XML 기반 규칙으로 LLM 출력의 구조, 타입, 품질 검증

## 주의사항
- RAGAS 메트릭은 LLM 기반 평가이므로 평가용 LLM의 품질에 따라 신뢰도가 달라짐
- Prompt Injection 방어는 완전하지 않으며 지속적인 패턴 업데이트가 필요함
- PII 마스킹이 지나치면 문맥이 손상되어 후속 LLM 응답 품질이 저하될 수 있음
- Langfuse/LangSmith에 API 키나 모델 출력을 전송할 때 데이터 프라이버시 정책 확인 필수
