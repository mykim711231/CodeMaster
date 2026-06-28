import type { Snippet } from '../../types';

export const pythonVector: Snippet[] = [
  {
    id: 'pvec-cosine',
    lang: 'python',
    title: '코사인 유사도',
    file: 'cosine.py',
    code: `import math


def cosine(a, b):
  dot = sum(x * y for x, y in zip(a, b))
  na = math.sqrt(sum(x * x for x in a))
  nb = math.sqrt(sum(y * y for y in b))
  return dot / (na * nb)


print(cosine([1, 0, 1], [1, 1, 1]))`,
    explain: {
      concept: '두 벡터(방향을 가진 화살표)가 얼마나 같은 방향을 향하는지 재는 점수예요. 화살표 사이 각도가 작을수록 1에 가까워요.',
      terms: [
        { t: 'dot', d: '같은 자리끼리 곱한 뒤 모두 더한 값이에요.' },
        { t: 'na, nb', d: '각 벡터의 길이를 구해요.' },
        { t: 'na * nb', d: '두 길이를 곱해 점수를 0~1로 정규화해요.' },
        { t: 'math.sqrt', d: '제곱근(루트)을 구해요.' },
      ],
      why: '길이가 달라도 방향만 비교할 수 있어 글의 의미 비교에 적합해요.',
      pitfall: '벡터 길이가 0이면 나누기 오류가 나요.',
    },
  },
  {
    id: 'pvec-l2',
    lang: 'python',
    title: 'L2 거리',
    file: 'l2.py',
    code: `import math


def l2(a, b):
  return math.sqrt(sum((x - y) ** 2 for x, y in zip(a, b)))


print(l2([1, 2], [4, 6]))`,
    explain: {
      concept: '두 점 사이의 직선 거리를 재는 방식이에요. 지도에서 두 지점 사이를 자로 잰 것과 같아요.',
      terms: [
        { t: '(x - y) ** 2', d: '각 자리 차이를 제곱해 부호를 없애요.' },
        { t: 'sum', d: '제곱한 차이를 모두 더해요.' },
        { t: 'math.sqrt', d: '더한 값을 루트 씌워 실제 거리로 만들어요.' },
      ],
      why: '위치 기반 비교에서 직관적인 거리 점수를 줘요.',
      pitfall: '벡터 크기가 크면 거리도 커져 정규화가 따로 필요할 수 있어요.',
    },
  },
  {
    id: 'pvec-dot',
    lang: 'python',
    title: '내적 유사도',
    file: 'dot.py',
    code: `def dot(a, b):
  return sum(x * y for x, y in zip(a, b))


print(dot([1, 2, 3], [4, 5, 6]))`,
    explain: {
      concept: '두 벡터의 같은 자리끼리 곱해 더하는 가장 단순한 점수예요. 길이와 방향을 모두 반영해요.',
      terms: [
        { t: 'x * y', d: '같은 자리 값을 곱해요.' },
        { t: 'sum', d: '곱한 값을 모두 더해 점수를 내요.' },
        { t: 'zip(a, b)', d: '두 리스트를 짝지어 줘요.' },
      ],
      why: '계산이 가벼워 속도가 중요할 때 자주 써요.',
      pitfall: '벡터 길이가 다르면 점수가 왜곡돼요.',
    },
  },
  {
    id: 'pvec-numpy-norm',
    lang: 'python',
    title: '넘파이 정규화',
    file: 'normalize.py',
    code: `import numpy as np


def normalize(v):
  return v / np.linalg.norm(v)


a = np.array([3.0, 4.0])
print(normalize(a))`,
    explain: {
      concept: '벡터를 길이 1짜리로 맞추는 작업이에요. 자를 길이로 통일해 비교하기 쉽게 만드는 것과 같아요.',
      terms: [
        { t: 'np.array', d: '리스트를 넘파이 배열로 바꿔요.' },
        { t: 'np.linalg.norm', d: '벡터의 길이를 구해요.' },
        { t: 'v / ...', d: '전체를 길이로 나눠 크기를 1로 만들어요.' },
      ],
      why: '정규화해두면 내적만으로 코사인 점수를 구할 수 있어 빨라요.',
      pitfall: '0벡터는 나누기 오류가 나요.',
    },
  },
  {
    id: 'pvec-faiss-flat',
    lang: 'python',
    title: 'FAISS 평면 인덱스',
    file: 'faiss_flat.py',
    code: `import faiss
import numpy as np


data = np.random.rand(100, 8).astype('float32')
idx = faiss.IndexFlatL2(8)
idx.add(data)


d, i = idx.search(data[:1], 3)
print(i)`,
    explain: {
      concept: 'FAISS에서 가장 단순한 색인(인덱스)이에요. 모든 점을 한 줄로 펴놓고 거리를 일일이 비교해요.',
      terms: [
        { t: 'IndexFlatL2', d: 'L2 거리로 평면 비교하는 색인이에요.' },
        { t: '8', d: '벡터 한 개의 차원 수예요.' },
        { t: 'idx.add', d: '데이터를 색인에 넣어요.' },
        { t: 'idx.search', d: '가까운 이웃 k개를 찾아요.' },
        { t: 'i', d: '가장 가까운 데이터 번호 목록이에요.' },
      ],
      why: '정확도가 가장 높아 작은 데이터에 적합해요.',
      pitfall: '데이터가 많아지면 속도가 느려요.',
    },
  },
  {
    id: 'pvec-faiss-ivf',
    lang: 'python',
    title: 'FAISS IVF 인덱스',
    file: 'faiss_ivf.py',
    code: `import faiss
import numpy as np


data = np.random.rand(1000, 16).astype('float32')
quan = faiss.IndexFlatL2(16)
idx = faiss.IndexIVFFlat(quan, 16, 10)
idx.train(data)
idx.add(data)


idx.nprobe = 2
d, i = idx.search(data[:1], 3)
print(i)`,
    explain: {
      concept: '데이터를 여러 묶음(클러스터)으로 나눠 비교 범위를 줄여요. 도서관에서 책장별로 책을 분류해두는 것과 같아요.',
      terms: [
        { t: 'IndexFlatL2', d: '묶음 중심을 재는 바탕 색인이에요.' },
        { t: 'IndexIVFFlat', d: '묶음 단위로 나눠 검색하는 색인이에요.' },
        { t: '16', d: '벡터 차원 수예요.' },
        { t: '10', d: '묶음 개수예요.' },
        { t: 'idx.train', d: '묶음 중심을 학습해요.' },
        { t: 'nprobe', d: '검색할 때 뒤질 묶음 수예요.' },
      ],
      why: '전체를 안 뒤져도 돼 큰 데이터에서 빨라요.',
      pitfall: 'train 없이 add하면 오류가 나요.',
    },
  },
  {
    id: 'pvec-faiss-hnsw',
    lang: 'python',
    title: 'FAISS HNSW 인덱스',
    file: 'faiss_hnsw.py',
    code: `import faiss
import numpy as np


data = np.random.rand(500, 12).astype('float32')
idx = faiss.IndexHNSWFlat(12, 16)
idx.hnsw.efConstruction = 40
idx.add(data)


idx.hnsw.efSearch = 8
d, i = idx.search(data[:1], 3)
print(i)`,
    explain: {
      concept: '벡터를 이웃과 연결한 그래프로 저장해 빠르게 탐색해요. 지하철 노선도를 타고 가까운 역을 찾는 것과 같아요.',
      terms: [
        { t: 'IndexHNSWFlat', d: '그래프 기반 빠른 색인이에요.' },
        { t: '12', d: '벡터 차원 수예요.' },
        { t: '16', d: '각 점이 연결할 이웃 수예요.' },
        { t: 'efConstruction', d: '색인 만들 때 살펴볼 후보 수예요.' },
        { t: 'efSearch', d: '검색할 때 살펴볼 후보 수예요.' },
      ],
      why: '정확도와 속도 균형이 좋아 대용량에 자주 써요.',
      pitfall: '메모리를 많이 써요.',
    },
  },
  {
    id: 'pvec-hnsw-build',
    lang: 'python',
    title: 'HNSW 직접 구현',
    file: 'hnsw_basic.py',
    code: `import heapq


def search_layer(q, nodes, edges, ep, k):
  seen = set([ep])
  front = [(0, ep)]
  result = []
  while front and len(result) < k:
    _, cur = heapq.heappop(front)
    result.append(cur)
    for nxt in edges.get(cur, []):
      if nxt in seen:
        continue
      seen.add(nxt)
      d = sum((a - b) ** 2 for a, b in zip(q, nodes[nxt]))
      heapq.heappush(front, (d, nxt))
  return result


nodes = {0: [1.0, 0.0], 1: [0.0, 1.0]}
edges = {0: [1], 1: [0]}
print(search_layer([1, 1], nodes, edges, 0, 2))`,
    explain: {
      concept: 'HNSW의 한 층에서 가장 가까운 이웃 k개를 찾는 핵심 과정이에요. 친구의 친구를 따라가며 가까운 사람을 찾는 것과 같아요.',
      terms: [
        { t: 'q', d: '질문 벡터예요.' },
        { t: 'ep', d: '탐색 시작점이에요.' },
        { t: 'front', d: '살펴볼 후보를 점수순으로 담는 대기열이에요.' },
        { t: 'heapq.heappop', d: '가장 가까운 후보를 꺼내요.' },
        { t: 'seen', d: '이미 살펴본 점을 기억해요.' },
      ],
      why: '전체를 다 안 보고 그래프를 타서 빨라요.',
      pitfall: '시작점이 멀면 결과 품질이 떨어질 수 있어요.',
    },
  },
  {
    id: 'pvec-hnsw-level',
    lang: 'python',
    title: 'HNSW 다층 구조',
    file: 'hnsw_layer.py',
    code: `import math
import random


def pick_level(mL):
  return int(-math.log(random.random()) * mL)


levels = [pick_level(1.0 / math.log(2)) for _ in range(10)]
print(levels)`,
    explain: {
      concept: 'HNSW는 층(레벨)을 여러 개 두어 위쪽 층은 듬성듬성, 아래는 촘촘히 연결해요. 고속도로로 먼저 이동 후 지역 도로로 내려오는 것과 같아요.',
      terms: [
        { t: 'mL', d: '층 분포를 조절하는 모수예요.' },
        { t: 'math.log', d: '확률을 층 번호로 바꾸는 로그 계산이에요.' },
        { t: 'random.random', d: '0~1 난수를 뽑아요.' },
        { t: 'int(...)', d: '층 번호를 정수로 만들어요.' },
      ],
      why: '윗층에서 빠르게 이동해 탐색 시간을 줄여요.',
      pitfall: '층이 너무 높으면 메모리 낭비가 커요.',
    },
  },
  {
    id: 'pvec-pgvector',
    lang: 'python',
    title: 'pgvector 기본 사용',
    file: 'pgvector_basic.py',
    code: `import psycopg


with psycopg.connect('dbname=test') as conn:
  cur = conn.execute(
    "CREATE TABLE IF NOT EXISTS docs (id text, emb vector(3))"
  )
  conn.execute(
    "INSERT INTO docs VALUES (%s, %s)",
    ('a', '[1,2,3]'),
  )
  rows = conn.execute(
    "SELECT id FROM docs ORDER BY emb <-> '[3,2,1]' LIMIT 2"
  ).fetchall()
  print(rows)`,
    explain: {
      concept: 'PostgreSQL 데이터베이스에 벡터를 저장하고 거리 순으로 찾아요. 사전에 뜻옆에 번호를 적어두고 가까운 뜻을 찾는 것과 같아요.',
      terms: [
        { t: 'vector(3)', d: '3차원 벡터 칸을 선언해요.' },
        { t: '%s', d: '값을 안전하게 끼워 넣는 자리표시자예요.' },
        { t: '<->', d: '두 벡터의 거리를 구하는 연산자예요.' },
        { t: 'ORDER BY emb <->', d: '거리순으로 줄을 세워요.' },
        { t: 'LIMIT 2', d: '상위 2개만 가져와요.' },
      ],
      why: '데이터베이스 한 곳에서 벡터와 일반 자료를 같이 쓸 수 있어요.',
      pitfall: '색인 없으면 느려요.',
    },
  },
  {
    id: 'pvec-pgvector-index',
    lang: 'python',
    title: 'pgvector HNSW 색인',
    file: 'pgvector_index.py',
    code: `import psycopg


with psycopg.connect('dbname=test') as conn:
  conn.execute(
    "CREATE INDEX ON docs USING hnsw (emb vector_l2_ops)"
  )
  conn.execute(
    "SET hnsw.ef_search = 20"
  )
  rows = conn.execute(
    "SELECT id FROM docs ORDER BY emb <-> '[1,1,1]' LIMIT 5"
  ).fetchall()
  print(rows)`,
    explain: {
      concept: 'pgvector에 HNSW 색인을 만들어 거리 검색을 빠르게 해요. 책 뒤쪽에 찾아보기 페이지를 만드는 것과 같아요.',
      terms: [
        { t: 'USING hnsw', d: 'HNSW 방식으로 색인을 만들어요.' },
        { t: 'vector_l2_ops', d: 'L2 거리를 쓴다고 알려줘요.' },
        { t: 'ef_search', d: '검색할 때 살펴볼 이웃 수예요.' },
        { t: '<->', d: '거리순 정렬 연산자예요.' },
      ],
      why: '색인이 있으면 전체 훑기 없이 빨리 찾아요.',
      pitfall: '거리 연산자와 색인 연산자가 달라야 색인이 안 써요.',
    },
  },
  {
    id: 'pvec-pgvector-filter',
    lang: 'python',
    title: 'pgvector 메타데이터 필터',
    file: 'pgvector_filter.py',
    code: `import psycopg


with psycopg.connect('dbname=test') as conn:
  rows = conn.execute(
    "SELECT id FROM docs WHERE tag = %s "
    "ORDER BY emb <-> %s LIMIT 5",
    ('news', '[1,2,3]'),
  ).fetchall()
  print(rows)`,
    explain: {
      concept: '벡터 검색에 일반 조건(WHERE)을 더해 원하는 그룹만 뒤져요. 사전에서 명사만 골라 찾는 것과 같아요.',
      terms: [
        { t: 'WHERE tag = %s', d: '태그가 일치하는 자료만 고르는 조건이에요.' },
        { t: 'ORDER BY emb <-> %s', d: '거리순으로 정렬해요.' },
        { t: 'LIMIT 5', d: '상위 5개만 가져와요.' },
      ],
      why: '의미가 가까워도 다른 주제면 빼야 자연스러워요.',
      pitfall: '필터가 너무 빡빡하면 결과가 없을 수 있어요.',
    },
  },
  {
    id: 'pvec-qdrant-upsert',
    lang: 'python',
    title: 'Qdrant 점 저장',
    file: 'qdrant_upsert.py',
    code: `from qdrant_client import QdrantClient, models


client = QdrantClient(':memory:')
client.create_collection(
  'docs',
  vectors_config=models.VectorParams(size=4, distance=models.Distance.COSINE),
)
client.upsert('docs', points=[
  models.PointStruct(id=1, vector=[0.1, 0.2, 0.3, 0.4], payload={'tag': 'news'}),
])
hits = client.search('docs', query_vector=[0.1, 0.2, 0.3, 0.4], limit=2)
print(hits)`,
    explain: {
      concept: 'Qdrant에 벡터와 메타데이터(payload)를 함께 넣고 검색해요. 상자에 물건과 메모를 같이 담아두는 것과 같아요.',
      terms: [
        { t: 'create_collection', d: '저장할 묶음(컬렉션)을 새로 만들어요.' },
        { t: 'VectorParams', d: '벡터 크기와 거리 방식을 정하는 설정 객체예요.' },
        { t: 'PointStruct', d: '저장할 점 하나를 표현하는 객체예요.' },
        { t: 'upsert', d: '점을 넣거나 덮어써요.' },
        { t: 'payload', d: '벡터에 붙이는 부가 정보예요.' },
        { t: 'query_vector', d: '질문 벡터예요.' },
      ],
      why: '벡터와 메타데이터를 한 번에 다루기 편해요.',
      pitfall: '컬렉션 없이 upsert하면 오류가 나요.',
    },
  },
  {
    id: 'pvec-qdrant-filter',
    lang: 'python',
    title: 'Qdrant 메타데이터 필터',
    file: 'qdrant_filter.py',
    code: `from qdrant_client import QdrantClient, models


client = QdrantClient(':memory:')
client.create_collection(
  'docs',
  vectors_config=models.VectorParams(size=4, distance=models.Distance.COSINE),
)
client.upsert('docs', points=[
  models.PointStruct(id=1, vector=[0.1, 0.2, 0.3, 0.4], payload={'tag': 'news', 'lang': 'ko'}),
])
hits = client.search(
  'docs',
  query_vector=[0.1, 0.2, 0.3, 0.4],
  query_filter=models.Filter(
    must=[models.FieldCondition(key='tag', match=models.MatchValue(value='news'))],
  ),
  limit=2,
)
print(hits)`,
    explain: {
      concept: 'Qdrant에서 벡터 검색과 동시에 payload 조건을 걸어요. 서랍에서 색깔이 빨간 물건만 찾는 것과 같아요.',
      terms: [
        { t: 'payload', d: '각 점의 부가 정보예요.' },
        { t: 'query_filter', d: '검색에 붙이는 조건이에요.' },
        { t: 'models.Filter', d: '조건들을 담는 필터 객체예요.' },
        { t: 'FieldCondition', d: '특정 필드 값을 비교하는 조건이에요.' },
        { t: 'MatchValue', d: '값이 같은지 비교하는 조건이에요.' },
      ],
      why: '의미 비교와 조건 검색을 한 번에 할 수 있어요.',
      pitfall: '필터 문법이 틀리면 결과가 비어요.',
    },
  },
  {
    id: 'pvec-weaviate',
    lang: 'python',
    title: 'Weaviate 객체 저장',
    file: 'weaviate_obj.py',
    code: `import weaviate


client = weaviate.connect_to_local()
col = client.collections.get('Doc')
col.data.insert(
  properties={'text': 'hello world', 'tag': 'news'},
  vector=[0.1, 0.2, 0.3],
)
res = col.query.near_vector(
  near_vector=[0.1, 0.2, 0.3],
  limit=3,
)
print([o.properties for o in res.objects])
client.close()`,
    explain: {
      concept: 'Weaviate는 객체와 벡터를 한 덩어리로 저장해요. 도서관 카드에 책 내용과 위치를 같이 적는 것과 같아요.',
      terms: [
        { t: 'collections.get', d: '저장할 묶음을 가져와요.' },
        { t: 'data.insert', d: '객체와 벡터를 함께 넣어요.' },
        { t: 'vector=', d: 'properties와 분리된 키워드 인자로 임베딩 벡터를 전달해요.' },
        { t: 'near_vector', d: '주어진 벡터 근처를 찾는 검색이에요.' },
        { t: 'properties', d: '저장한 부가 정보 모음이에요.' },
      ],
      why: '벡터와 텍스트를 분리하지 않아 다루기 쉬워요.',
      pitfall: 'vector=를 properties 딕셔너리 안에 넣으면 임베딩이 저장되지 않아 검색이 동작하지 않아요.',
    },
  },
  {
    id: 'pvec-weaviate-hybrid',
    lang: 'python',
    title: 'Weaviate 하이브리드 검색',
    file: 'weaviate_hybrid.py',
    code: `import weaviate


client = weaviate.connect_to_local()
col = client.collections.get('Doc')
res = col.query.hybrid(
  query='hello',
  vector=[0.1, 0.2, 0.3],
  alpha=0.5,
  limit=3,
)
print([o.properties for o in res.objects])
client.close()`,
    explain: {
      concept: '단어 검색(BM25)과 벡터 검색을 한 번에 섞어요. 제목으로 찾기와 내용으로 찾기를 동시에 하는 것과 같아요.',
      terms: [
        { t: 'query', d: '단어 검색용 질문이에요.' },
        { t: 'vector', d: '벡터 검색용 질문이에요.' },
        { t: 'alpha', d: '벡터 비중을 0~1로 정해요.' },
        { t: 'hybrid', d: '두 검색을 섞는 방식이에요.' },
      ],
      why: '키워드가 정확히 안 맞아도 의미로 보완해요.',
      pitfall: 'alpha가 0이면 순수 단어 검색이 돼요.',
    },
  },
  {
    id: 'pvec-milvus',
    lang: 'python',
    title: 'Milvus 컬렉션 만들기',
    file: 'milvus_col.py',
    code: `from pymilvus import MilvusClient


client = MilvusClient('./milvus.db')
client.create_collection('docs', dimension=8)
client.insert('docs', [
  {'id': 1, 'vector': [0.1] * 8, 'text': 'hello'},
])
hits = client.search('docs', data=[[0.1] * 8], limit=2)
print(hits)
client.close()`,
    explain: {
      concept: 'Milvus는 대규모 벡터 전용 저장소예요. 거대한 창고에 상자를 번호표와 넣어두는 것과 같아요.',
      terms: [
        { t: 'create_collection', d: '저장 묶음을 만들어요.' },
        { t: 'dimension', d: '벡터 한 개의 차원 수예요.' },
        { t: 'insert', d: '벡터와 자료를 넣어요.' },
        { t: 'data', d: '질문 벡터 목록이에요.' },
        { t: 'limit', d: '가져올 개수예요.' },
      ],
      why: '수억 개 벡터도 빠르게 검색할 수 있어요.',
      pitfall: 'dimension과 실제 벡터 길이가 같아야 해요.',
    },
  },
  {
    id: 'pvec-milvus-filter',
    lang: 'python',
    title: 'Milvus 메타데이터 필터',
    file: 'milvus_filter.py',
    code: `from pymilvus import MilvusClient


client = MilvusClient('./milvus.db')
client.create_collection('docs', dimension=8)
client.insert('docs', [{'id': 1, 'vector': [0.1] * 8, 'tag': 'news'}])
hits = client.search('docs',
  data=[[0.1] * 8],
  filter='tag == "news"',
  limit=2)
print(hits)
client.close()`,
    explain: {
      concept: 'Milvus에서 벡터 검색과 함께 조건식(filter)을 걸어요. 창고에서 특정 색 상자만 꺼내는 것과 같아요.',
      terms: [
        { t: 'filter', d: '검색에 붙이는 조건 문자열이에요.' },
        { t: 'tag == "news"', d: 'tag가 news인 자료만 골라요.' },
        { t: 'data', d: '질문 벡터 목록이에요.' },
        { t: 'limit', d: '가져올 개수예요.' },
      ],
      why: '의미와 조건을 같이 검사해 정확해요.',
      pitfall: '필터 문법이 틀리면 검색이 실패해요.',
    },
  },
  {
    id: 'pvec-chroma',
    lang: 'python',
    title: 'Chroma 기본 사용',
    file: 'chroma_basic.py',
    code: `import chromadb


client = chromadb.EphemeralClient()
col = client.get_or_create_collection('docs')
col.add(
  ids=['1'],
  embeddings=[[0.1, 0.2, 0.3]],
  metadatas=[{'tag': 'news'}],
  documents=['hello world'],
)
res = col.query(query_embeddings=[[0.1, 0.2, 0.3]], n_results=2)
print(res['ids'])`,
    explain: {
      concept: 'Chroma는 가벼운 벡터 저장소예요. 작은 상자에 자료와 메모를 넣고 바로 꺼내는 것과 같아요.',
      terms: [
        { t: 'EphemeralClient', d: '메모리에만 저장하는 인메모리 클라이언트예요. 프로그램 종료 시 데이터가 사라져요.' },
        { t: 'get_or_create_collection', d: '묶음이 없으면 만들어 가져와요.' },
        { t: 'ids', d: '각 자료의 고유 번호예요.' },
        { t: 'embeddings', d: '벡터 목록이에요.' },
        { t: 'metadatas', d: '각 자료의 부가 정보예요.' },
        { t: 'query', d: '가장 가까운 자료를 찾아요.' },
      ],
      why: '설정 없이 바로 써 소규모 실험에 좋아요.',
      pitfall: '대용량에서는 속도가 느려요. 영구 저장이 필요하면 PersistentClient를 사용해요.',
    },
  },
  {
    id: 'pvec-batch-insert',
    lang: 'python',
    title: '배치 단위 저장',
    file: 'batch_insert.py',
    code: `def batch_upsert(store, items, size=100):
  for i in range(0, len(items), size):
    chunk = items[i:i + size]
    store.upsert([(j, v) for j, v in chunk])
  return len(items)


store = {}
class S:
  @staticmethod
  def upsert(rows):
    for k, v in rows:
      store[k] = v


batch_upsert(S(), list(enumerate([[0.1]] * 250)), 100)
print(len(store))`,
    explain: {
      concept: '자료를 한 번에 넣지 않고 정해진 크기(batch)로 나눠 넣어요. 큰 짐을 여러 박스에 나눠 담아 옮기는 것과 같아요.',
      terms: [
        { t: 'size=100', d: '한 번에 넣을 개수예요.' },
        { t: 'range(0, len, size)', d: 'size 간격으로 시작 위치를 만들어요.' },
        { t: 'chunk', d: '이번에 넣을 한 묶음이에요.' },
        { t: 'upsert', d: '묶음을 저장소에 넣어요.' },
      ],
      why: '한 번에 너무 많이 넣으면 메모리나 시간 초과가 나요.',
      pitfall: '배치 크기가 너무 크면 서버가 거부해요.',
    },
  },
];
