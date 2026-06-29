# LLM
## Official Documentation
- [Transformers](https://huggingface.co/docs/transformers/index)
## 핵심 개념
> Hugging Face Transformers는 사전 학습된 최신 NLP/AI 모델을 쉽게 로드하고 사용할 수 있게 해주는 라이브러리다. AutoModel과 AutoTokenizer로 모델과 토크나이저를 자동 매핑하며, pipeline()으로 추론을 단순화한다. Embedding을 통해 텍스트를 벡터로 변환하고, SentenceTransformer로 문장 단위 임베딩을 생성한다. 토큰화는 텍스트를 모델이 이해할 수 있는 정수 ID 시퀀스로 변환하는 핵심 전처리 과정이다.
## 학습 목표
- AutoModel, AutoTokenizer, AutoConfig로 사전 학습 모델 자동 로드
- pipeline()을 이용한 감정 분석, 텍스트 생성, NER 등 태스크 수행
- 입력 텍스트의 토큰화, 패딩, 어텐션 마스크 처리 이해
- SentenceTransformer로 문장/문서 임베딩 벡터 생성
- GPU/CPU 장치 간 모델 이동 및 추론 최적화
## 예제 코드
```python
from transformers import AutoTokenizer, AutoModel, pipeline

# pipeline으로 감정 분석
classifier = pipeline("sentiment-analysis")
result = classifier("I love using Hugging Face Transformers!")
print(result)

# AutoTokenizer + AutoModel로 임베딩 추출
tokenizer = AutoTokenizer.from_pretrained("bert-base-uncased")
model = AutoModel.from_pretrained("bert-base-uncased")

texts = ["Hello, world!", "Transformers are powerful."]
inputs = tokenizer(texts, padding=True, truncation=True, return_tensors="pt")
outputs = model(**inputs)
embeddings = outputs.last_hidden_state[:, 0, :]  # [CLS] 토큰 임베딩
print(embeddings.shape)

# SentenceTransformer로 문장 임베딩
from sentence_transformers import SentenceTransformer

model = SentenceTransformer("all-MiniLM-L6-v2")
sentences = ["This is an example sentence", "Each sentence is converted"]
sentence_embeddings = model.encode(sentences)
print(sentence_embeddings.shape)
```
## 주요 패턴
- Model/Task별 pipeline: `pipeline("text-generation")`, `pipeline("ner")` 등으로 즉시 추론
- 토크나이저 공통 인터페이스: `encode()`, `decode()`, `batch_encode_plus()`로 배치 처리
- Auto Classes: `AutoModel`, `AutoTokenizer`, `AutoConfig`로 체크포인트 이름만으로 자동 로드
- from_pretrained: 로컬 또는 Hugging Face Hub에서 사전 학습 가중치 다운로드
- 임베딩 추출: `outputs.last_hidden_state`에서 [CLS] 토큰 또는 평균 풀링으로 벡터 생성
- model.eval() + torch.no_grad(): 추론 시 그래디언트 비활성화로 메모리 최적화
- 저장/로드: `model.save_pretrained()`, `tokenizer.save_pretrained()`로 로컬 저장
## 주의사항
- 모델 다운로드 크기가 수 GB에 달할 수 있어 디스크 공간 확인 필요
- 토크나이저와 모델의 최대 입력 길이(`max_length`)를 초과하면 `truncation=True` 필요
- pipeline은 편리하지만 세밀한 제어가 필요한 경우 AutoModel을 직접 사용
- `return_tensors="pt"`는 PyTorch, `"tf"`는 TensorFlow 텐서 반환
- SentenceTransformer과 Transformers의 임베딩 품질/속도가 다르므로 용도에 맞게 선택
- 모델 재현성 확보 시 `seed` 고정 및 `torch.backends.cudnn.deterministic = True` 설정
