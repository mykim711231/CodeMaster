# Python 3.12 Learning Guide

이 가이드는 **PLAN.md** 에 정의된 각 레벨·주제에 대해 공식 Python(및 주요 라이브러리) 문서를 기반으로 핵심 학습 포인트와 실습 예제를 제공합니다. 각 섹션은 공식 문서 링크와 함께 간단한 설명, 실습 아이디어를 포함합니다.

---

## 1 – Python Core
### 1.1 Syntax, Data Types, Control Flow
- **공식 문서**: https://docs.python.org/3/tutorial/
- **핵심 내용**: 변수, 기본 자료형, `if/elif/else`, `for/while` 루프, 예외 처리.
- **실습**: 간단한 계산기 프로그램 구현.

### 1.2 Data Structures (Lists, Tuples, Sets, Dictionaries)
- **공식 문서**: https://docs.python.org/3/tutorial/datastructures.html
- **핵심 내용**: 리스트·딕션·셋·튜플 연산, 리스트 컴프리헨션.
- **예제**: 중복 제거와 정렬을 위한 셋 활용.

### 1.3 Functions & Modules
- **공식 문서**: https://docs.python.org/3/tutorial/modules.html
- **핵심 내용**: 함수 정의, 인자 기본값·키워드·가변인자, 모듈 및 패키지 구조.
- **실습**: `utils.py` 모듈에 헬퍼 함수 작성 후 import.

### 1.4 File I/O
- **공식 문서**: https://docs.python.org/3/tutorial/inputoutput.html#reading-and-writing-files
- **핵심 내용**: `with open(...) as f`, 텍스트·바이너리 모드, `json`·`csv` 처리.
- **예제**: CSV 파일을 읽어 데이터 집계.

### 1.5 OOP – Classes, Inheritance, Polymorphism
- **공식 문서**: https://docs.python.org/3/tutorial/classes.html
- **핵심 내용**: 클래스 정의, 속성·메서드, 다중 상속, 특수 메서드(`__str__`, `__repr__`).
- **실습**: Shape 계층 구조 구현 및 면적 계산.

### 1.6 Standard Library Overview
- **공식 문서**: https://docs.python.org/3/library/
- **핵심 내용**: `os`, `sys`, `json`, `csv`, `datetime` 등 핵심 모듈 소개.
- **예제**: 파일 시스템 탐색 스크립트 작성.

---

## 2 – Async (asyncio)
- **Event Loop, Coroutines, Tasks**: https://docs.python.org/3/library/asyncio.html
- **Async/Await Syntax**: https://docs.python.org/3/reference/expressions.html#await
- **Streams**: https://docs.python.org/3/library/asyncio-stream.html
- **Sync Primitives**: https://docs.python.org/3/library/asyncio-sync.html
- **Subprocess**: https://docs.python.org/3/library/asyncio-subprocess.html
- **실습**: 비동기 TCP 에코 서버와 클라이언트 구현.

---

## 3 – Data (NumPy, Pandas, Visualization)
### 3.1 NumPy Basics
- **문서**: https://numpy.org/doc/stable/
- **핵심**: 배열 생성, 인덱싱, 브로드캐스팅.
- **예제**: 행렬 곱셈 및 선형 대수 연산.

### 3.2 Pandas Essentials & IO
- **문서**: https://pandas.pydata.org/docs/
- **핵심**: `DataFrame`, `Series`, `groupby`, 시계열 처리.
- **IO**: https://pandas.pydata.org/docs/user_guide/io.html
- **실습**: CSV 파일 로드·전처리·통계 요약.

### 3.3 Data Visualization
- **Matplotlib**: https://matplotlib.org/stable/tutorials/introductory/pyplot.html
- **Seaborn**: https://seaborn.pydata.org/
- **Plotly**: https://plotly.com/python/
- **예제**: `matplotlib` 로 신경망 학습 손실 그래프 그리기.

---

## 4 – Machine Learning (scikit‑learn)
- **Overview**: https://scikit-learn.org/stable/tutorial/
- **Supervised**: https://scikit-learn.org/stable/supervised_learning.html
- **Unsupervised**: https://scikit-learn.org/stable/unsupervised_learning.html
- **Persistence**: https://scikit-learn.org/stable/model_persistence.html
- **예제**: Iris 데이터셋을 사용한 로지스틱 회귀와 모델 저장/로드.

---

## 5 – Deep Learning (TensorFlow, PyTorch)
### 5.1 TensorFlow 2.x Basics & Keras API
- **Guide**: https://www.tensorflow.org/guide
- **Keras**: https://www.tensorflow.org/guide/keras
- **실습**: MNIST 분류 모델 구현·훈련·평가.

### 5.2 PyTorch Basics & nn.Module
- **Tutorial**: https://pytorch.org/tutorials/beginner/deep_learning_60min_blitz.html
- **nn.Module**: https://pytorch.org/tutorials/beginner/nn_tutorial.html
- **예제**: CIFAR‑10 이미지 분류 CNN 구현.

---

## 6 – LLM (Transformers, Prompt Engineering, OpenAI API)
- **Transformers**: https://huggingface.co/docs/transformers/index
- **Prompt Guide**: https://www.promptingguide.ai/
- **OpenAI API**: https://platform.openai.com/docs/api-reference
- **실습**: HuggingFace `pipeline` 으로 텍스트 요약 수행, OpenAI `ChatCompletion` 호출.

---

## 7 – Retrieval‑Augmented Generation (RAG)
- **Vector Stores**: https://www.pinecone.io/learn/vector-database/
- **ANN Benchmarks**: https://github.com/erikbern/ann-benchmarks
- **LangChain**: https://python.langchain.com/docs/get_started/introduction.html
- **예제**: Pinecone 로 임베딩 저장·검색, LangChain 으로 RAG 파이프라인 구성.

---

## 8 – AI Agent (ReAct, LangGraph, AutoGPT)
- **Survey**: https://www.philschmid.de/ai-agents-survey
- **LangGraph**: https://langchain-ai.github.io/langgraph/
- **AutoGPT**: https://github.com/Significant-Gravitas/AutoGPT
- **실습**: LangGraph 로 간단한 상태 머신 기반 에이전트 만들기.

---

## 9 – Web Frameworks (FastAPI, Django, Flask)
- **FastAPI**: https://fastapi.tiangolo.com/tutorial/
- **Background Tasks**: https://fastapi.tiangolo.com/tutorial/background-tasks/
- **Django**: https://docs.djangoproject.com/en/4.2/intro/tutorial01/
- **Flask**: https://flask.palletsprojects.com/
- **예제**: FastAPI 로 CRUD API 구현 후 배포, Django 기본 프로젝트 생성, Flask 로 간단한 템플릿 렌더링.

---

## 10 – Production AI (Model Serving, MLflow, Experiment Tracking, Containerization)
- **Triton Inference Server**: https://github.com/triton-inference-server/server
- **MLflow**: https://mlflow.org/docs/latest/index.html
- **Weights & Biases**: https://wandb.ai/site
- **Docker**: https://docs.docker.com/get-started/
- **실습**: Dockerfile 로 FastAPI 앱 컨테이너화, MLflow 로 실험 로그 기록.

---

## 11 – Vector Stores (FAISS, Annoy, Milvus, Pinecone)
- **FAISS**: https://faiss.ai/index.html
- **Annoy**: https://github.com/spotify/annoy
- **Milvus**: https://milvus.io/docs/
- **Pinecone**: https://www.pinecone.io/learn/series/pinecone-101/
- **예제**: FAISS 로 대용량 이미지 임베딩 인덱스 구축.

---

## 12 – LLM Serving / Optimization (vLLM, HuggingFace TGI, TensorRT‑LLM)
- **vLLM**: https://docs.vllm.ai/en/latest/
- **TGI**: https://huggingface.co/docs/text-generation-inference/index
- **TensorRT‑LLM**: https://developer.nvidia.com/blog/tensorrt-llm/
- **실습**: vLLM 로 GPT‑2 모델 서빙, TGI 로 배치 요청 테스트.

---

## 13 – Prompt & Structured Output (Guidance, Outlines, LMQL)
- **Guidance**: https://guidance.ai/
- **Outlines**: https://outlines-dev.github.io/outlines/
- **LMQL**: https://lmql.ai/
- **예제**: Guidance 로 함수 호출 스타일 프롬프트 구현.

---

## 14 – Fine‑tuning & MLOps (PEFT, Quantization, Kubeflow, DVC)
- **PEFT**: https://huggingface.co/docs/peft/index
- **Quantization**: https://huggingface.co/docs/transformers/main_classes/quantization
- **Kubeflow Pipelines**: https://www.kubeflow.org/docs/components/pipelines/introduction/
- **DVC**: https://dvc.org/doc
- **실습**: LoRA 로 Llama‑2 파인튜닝, DVC 로 데이터 버전 관리.

---

## 15 – AI Quality / Monitoring / Security (WhyLabs, SHAP, AI‑360, Prompt Injection, Differential Privacy)
- **WhyLabs**: https://www.whylabs.ai/
- **SHAP**: https://shap.readthedocs.io/en/latest/
- **AI 360**: https://aif360.mybluemix.net/
- **Prompt Injection**: https://learnprompting.org/docs/prompt_hacking/injection
- **Differential Privacy**: https://www.tensorflow.org/research/privacy
- **예제**: SHAP 로 모델 설명 시각화, WhyLabs 로 데이터 드리프트 감시.

---

### 학습 팁
- 각 섹션을 완료하면 **PLAN.md** 에서 체크박스를 `[x]` 로 표시하세요.
- 공식 문서의 “Getting Started” 가이드를 먼저 실행하고, 직접 코드를 작성해 보세요.
- URL 검증 스크립트(`verify-plan-urls.ps1`) 로 모든 링크가 정상인지 주기적으로 확인할 수 있습니다.
