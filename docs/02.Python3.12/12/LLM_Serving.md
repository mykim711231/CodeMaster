# LLM Serving
## Official Documentation
- [vLLM 공식 문서](https://docs.vllm.ai/en/latest/)
- [Ollama](https://github.com/ollama/ollama)
- [TGI (Text Generation Inference)](https://huggingface.co/docs/text-generation-inference/index)

## 핵심 개념
> LLM 서빙은 대규모 언어 모델을 프로덕션 환경에서 효율적으로 추론하기 위한 기술이다. vLLM은 PagedAttention으로 KV Cache 메모리를 최적화하고 연속 배칭(Continuous Batching)을 지원한다. Ollama는 로컬에서 GGUF 양자화 모델을 쉽게 실행할 수 있게 해준다. TGI는 Hugging Face의 프로덕션급 서빙 프레임워크이며, SSE(Server-Sent Events)를 통해 토큰 단위 스트리밍을 제공한다.

## 학습 목표
- vLLM으로 OpenAI 호환 API 서버 구축 및 배치 추론 설정하기
- Ollama로 GGUF/AWQ 양자화 모델 로컬 실행하기
- SSE 스트리밍을 통한 토큰 단위 실시간 응답 구현하기
- KV Cache 메모리 관리 전략과 PagedAttention 원리 이해하기
- 배치 추론 시 동적 배칭과 연속 배칭의 차이 이해하기

## 예제 코드
```python
# vLLM 서버 실행 (CLI)
# python -m vllm.entrypoints.openai.api_server --model mistralai/Mistral-7B-Instruct-v0.2
```
```python
# vLLM 클라이언트 - OpenAI 호환 API
from openai import OpenAI

client = OpenAI(
    base_url="http://localhost:8000/v1",
    api_key="not-needed",
)

response = client.chat.completions.create(
    model="mistralai/Mistral-7B-Instruct-v0.2",
    messages=[{"role": "user", "content": "Hello!"}],
    max_tokens=256,
    temperature=0.7,
    stream=True,
)
for chunk in response:
    if chunk.choices[0].delta.content:
        print(chunk.choices[0].delta.content, end="", flush=True)
```
```python
# Ollama Python 클라이언트
import ollama

response = ollama.chat(
    model="llama3",
    messages=[{"role": "user", "content": "Explain quantum computing"}],
    stream=True,
)
for chunk in response:
    print(chunk["message"]["content"], end="", flush=True)
```
```python
# Ollama GGUF 모델 import
# Modelfile 내용:
# FROM ./model.Q4_K_M.gguf
# TEMPLATE """<|system|>{{ .System }}<|user|>{{ .Prompt }}<|assistant|>"""
# $ ollama create my-model -f Modelfile
```
```python
# SSE 스트리밍 서버 직접 구현
from fastapi import FastAPI
from fastapi.responses import StreamingResponse
import asyncio

app = FastAPI()

async def generate_tokens(prompt: str):
    tokens = ["안녕", "하세요", "!", "저는", "AI", "입니다"]
    for token in tokens:
        yield f"data: {token}\n\n"
        await asyncio.sleep(0.5)
    yield "data: [DONE]\n\n"

@app.get("/stream")
async def stream(prompt: str = "hello"):
    return StreamingResponse(
        generate_tokens(prompt),
        media_type="text/event-stream",
    )
```

## 주요 패턴
- PagedAttention: KV Cache를 페이지 단위로 관리하여 메모리 단편화 해결
- 연속 배칭(Continuous Batching): 요청별로 다른 길이의 시퀀스를 동적으로 배치
- GGUF 양자화: 4-bit, 8-bit 등 다양한 비트 양자화로 모델 크기 대폭 축소
- AWQ(Activation-aware Weight Quantization): 활성화 중요도 기반 가중치 양자화로 품질 손실 최소화
- OpenAI 호환 API: vLLM/Ollama를 표준 API로 래핑하여 클라이언트 호환성 확보

## 주의사항
- AWQ 모델은 양자화에 사용된 calibration 데이터와 배포 환경이 크게 다르면 품질 저하
- vLLM은 일부 모델 아키텍처에서 지원되지 않을 수 있음 (호환성 확인 필수)
- SSE 스트리밍 시 네트워크 중단에 대비한 재연결 로직 필요
- GPU 메모리가 부족하면 배치 크기를 줄이거나 양자화 모델을 사용해야 함
