# RAG
## Official Documentation
- [LangChain Introduction](https://python.langchain.com/docs/get_started/introduction.html)
## 핵심 개념
> RAG(Retrieval-Augmented Generation)는 LLM의 응답 생성을 외부 지식 베이스 검색으로 보강하는 패러다임이다. 문서를 청킹한 후 임베딩으로 변환하여 VectorStore에 저장하고, 쿼리와 유사한 청크를 검색해 프롬프트에 주입한다. Retriever로 초기 후보를 얻고 Reranker로 정밀도를 높이며, Hybrid Search로 키워드+벡터 검색을 결합해 정확도를 극대화한다.
## 학습 목표
- 문서를 의미 있는 청크로 분할하는 RecursiveCharacterTextSplitter 등 청킹 전략
- 청크를 임베딩 벡터로 변환해 Chroma, FAISS 등 VectorStore에 저장
- 쿼리 임베딩과 유사도 검색으로 관련 청크 Retrieval 파이프라인 구축
- Reranker를 적용해 1차 검색 결과의 관련성 재정렬
- Hybrid Search로 키워드 기반(BM25) + 의미 기반(벡터) 검색 통합
- 검색된 컨텍스트와 사용자 질문을 결합한 최종 프롬프트 조립 및 생성
## 예제 코드
```python
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain_community.vectorstores import Chroma
from langchain_community.embeddings import HuggingFaceEmbeddings
from langchain.retrievers import ContextualCompressionRetriever
from langchain.retrievers.document_compressors import CrossEncoderReranker
from langchain_community.cross_encoders import HuggingFaceCrossEncoder

# 1. 문서 청킹
text_splitter = RecursiveCharacterTextSplitter(
    chunk_size=500,
    chunk_overlap=50,
    separators=["\n\n", "\n", ".", " ", ""]
)
chunks = text_splitter.split_documents(documents)

# 2. 임베딩 및 VectorStore 저장
embeddings = HuggingFaceEmbeddings(model_name="BAAI/bge-base-en-v1.5")
vectorstore = Chroma.from_documents(chunks, embeddings, persist_directory="./chroma_db")

# 3. Retriever로 검색
retriever = vectorstore.as_retriever(search_kwargs={"k": 10})
docs = retriever.invoke("What is RAG?")

# 4. Reranker로 재정렬
model = HuggingFaceCrossEncoder(model_name="BAAI/bge-reranker-base")
compressor = CrossEncoderReranker(model=model, top_n=3)
compression_retriever = ContextualCompressionRetriever(
    base_compressor=compressor, base_retriever=retriever
)
reranked_docs = compression_retriever.invoke("What is RAG?")

# 5. Hybrid Search (BM25 + 벡터)
from langchain.retrievers.ensemble import EnsembleRetriever
from langchain_community.retrievers import BM25Retriever

bm25_retriever = BM25Retriever.from_documents(chunks)
bm25_retriever.k = 5

ensemble_retriever = EnsembleRetriever(
    retrievers=[bm25_retriever, vectorstore.as_retriever(k=5)],
    weights=[0.4, 0.6]
)
hybrid_docs = ensemble_retriever.invoke("What is RAG?")
```
## 주요 패턴
- 청킹: 시맨틱(구분자 기반) vs 고정 길이 vs 문장 단위 분할, 오버랩으로 문맥 유지
- 불변/가변 필터: `metadata` 기반 필터로 날짜, 출처 등 특정 문서만 검색
- Reranker: Bi-Encoder(임베딩) → Cross-Encoder(재정렬) 2단계 파이프라인
- Hybrid Search: BM25(키워드) + Dense Retriever(벡터) → Ensemble/Fusion
- 컨텍스트 윈도우: 검색된 청크 수(`top_k`)와 모델의 최대 컨텍스트 길이 간 균형
- VectorStore 선택: Chroma(경량/로컬), FAISS(고속), Pinecone/Weaviate(관리형)
- 프롬프트 템플릿: 질문 + 검색 컨텍스트 + 지시사항을 구조화된 프롬프트로 조립
## 주의사항
- 청크 크기가 너무 작으면 문맥 손실, 너무 크면 관련 없는 정보 포함 → 256~1024 토큰이 일반적
- 임베딩 모델과 검색 쿼리에 적합한지 확인 (비대칭 질문-문서 검색 시 instruction prefix 필요)
- VectorStore 인덱스를 사전 빌드하고 재사용하지 않으면 초기화 시간이 오래 걸림
- Reranker는 Cross-Encoder 기반이므로 모든 쿼리-문서 쌍을 비교해 속도 비용이 큼
- Hybrid Search에서 BM25는 형태소 분석 기반이므로 한국어 등 언어에 맞는 토크나이저 설정 필요
- 프롬프트에 컨텍스트를 주입할 때 모델 최대 토큰을 초과하지 않도록 `total_tokens ≤ max_tokens` 검증
