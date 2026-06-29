# Vector Store
## Official Documentation
- [FAISS 공식 문서](https://faiss.ai/index.html)
- [pgvector](https://github.com/pgvector/pgvector)
- [Qdrant](https://qdrant.tech/documentation/)
- [Weaviate](https://weaviate.io/developers/weaviate)
- [Milvus](https://milvus.io/docs)

## 핵심 개념
> 벡터 저장소는 임베딩 벡터를 저장하고 유사도 검색을 수행하는 데이터베이스다. FAISS, Milvus, Qdrant, Weaviate 등 다양한 구현체가 존재하며, pgvector는 PostgreSQL 확장으로 벡터 연산을 지원한다. HNSW(Hierarchical Navigable Small World)는 근사 최근접 이웃(ANN) 검색을 위한 그래프 기반 인덱싱 알고리즘이다. 메타데이터 필터를 통해 벡터 검색과 메타데이터 조건을 결합한 하이브리드 검색이 가능하다.

## 학습 목표
- pgvector를 사용하여 PostgreSQL에서 벡터 검색 구현하기
- Qdrant, Weaviate, Milvus의 클라이언트 API 사용법 익히기
- FAISS 인덱스 구축 및 유사도 검색 수행하기
- HNSW 알고리즘의 동작 원리와 파라미터 튜닝 이해하기
- 메타데이터 필터를 활용한 하이브리드 검색 구현하기

## 예제 코드
```python
import faiss
import numpy as np

# 128차원 임베딩 벡터 1000개 생성
dimension = 128
num_vectors = 1000
vectors = np.random.random((num_vectors, dimension)).astype('float32')

# HNSW 인덱스 구축
M = 32  # 그래프 연결 수
index = faiss.IndexHNSWFlat(dimension, M)
index.hnsw.efConstruction = 200
index.add(vectors)

# 검색
query = np.random.random((1, dimension)).astype('float32')
index.hnsw.efSearch = 64
distances, indices = index.search(query, k=5)
print(f"가장 가까운 5개 인덱스: {indices[0]}")
print(f"거리: {distances[0]}")
```
```python
# pgvector 예제
import psycopg2

conn = psycopg2.connect("dbname=mydb user=user password=pass")
cur = conn.cursor()
cur.execute("CREATE EXTENSION IF NOT EXISTS vector")
cur.execute("""
    CREATE TABLE IF NOT EXISTS documents (
        id SERIAL PRIMARY KEY,
        content TEXT,
        embedding vector(1536)
    )
""")
cur.execute(
    "SELECT content FROM documents "
    "ORDER BY embedding <=> %s LIMIT 5",
    (query_embedding,)
)
```
```python
# Qdrant 예제
from qdrant_client import QdrantClient
from qdrant_client.models import Distance, VectorParams, Filter, FieldCondition, MatchValue

client = QdrantClient("localhost", port=6333)
client.create_collection(
    collection_name="my_collection",
    vectors_config=VectorParams(size=128, distance=Distance.COSINE),
)
client.upsert(
    collection_name="my_collection",
    points=[{"id": i, "vector": v.tolist(), "payload": {"source": "web"}} for i, v in enumerate(vectors)],
)
results = client.search(
    collection_name="my_collection",
    query_vector=query[0].tolist(),
    query_filter=Filter(
        must=[FieldCondition(key="source", match=MatchValue(value="web"))]
    ),
    limit=5,
)
```

## 주요 패턴
- HNSW 인덱싱: 고차원 벡터에서 로그 시간 근사 검색을 위한 그래프 계층 구조
- IVFPQ: 클러스터링으로 검색 범위를 줄이고 PQ(Product Quantization)로 메모리를 압축하는 조합
- 하이브리드 검색: 벡터 유사도와 메타데이터 필터를 결합하여 정밀도 향상
- 배치 임베딩 저장: 대량 임베딩을 청크 단위로 나누어 upsert하여 메모리 관리
- 인덱스 직렬화: 학습된 인덱스를 파일로 저장/로드하여 재학습 방지

## 주의사항
- 벡터 차원이 일치하지 않으면 인덱스 추가 시 오류 발생
- efSearch 값을 너무 낮게 설정하면 검색 정확도가 급격히 저하됨
- FAISS 인덱스는 메모리 기반이므로 프로세스 종료 시 휘발됨
- pgvector에서 대량 벡터에 대한 인덱스 생성 시 디스크 공간과 시간 소요가 큼
