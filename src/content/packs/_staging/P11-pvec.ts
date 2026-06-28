import type { Snippet } from '../../types';

export const pythonVector: Snippet[] = [
  {
    id: 'pvec-cosine',
    lang: 'python',
    title: '코사인 유사도',
    file: 'cosine.py',
    code: `import math


def cosine(a, b):
  dot_v = sum(x * y for x, y in zip(a, b))
  na = math.sqrt(sum(x * x for x in a))
  nb = math.sqrt(sum(y * y for y in b))
  return dot_v / (na * nb)


result = cosine([1, 0, 1], [1, 1, 1])
print(f"[실행] cosine([1,0,1], [1,1,1]) = {result:.3f}")`,
    explain: {
      concept:
        '코사인 유사도는 두 벡터(방향 화살표)가 얼마나 같은 방향을 바라보는지 0~1 사이 값으로 나타내는 점수예요. ' +
        '검색 엔진에서 "사용자 질문"과 "저장된 문서"의 의미 방향이 얼마나 비슷한지 판단할 때 이 공식을 써요. ' +
        '벡터의 길이가 아닌 방향만 비교하기 때문에, 짧은 질문과 긴 문서도 공정하게 비교할 수 있어요. ' +
        '자연어 처리(NLP)에서 임베딩 벡터를 다룰 때 가장 기본이 되는 유사도 측정 방식이에요. ' +
        'cosine 값이 1에 가까울수록 두 문장의 의미가 거의 같다고 볼 수 있어요.',
      terms: [
        { t: 'sum(x * y for x, y in zip(a, b))', d: '같은 자리끼리 곱한 뒤 모두 더해 내적(dot product)을 구해요.' },
        { t: 'math.sqrt(sum(x * x for x in a))', d: '벡터 a의 각 값을 제곱해 더한 뒤 루트를 씌워 길이를 구해요.' },
        { t: 'na * nb', d: '두 벡터의 길이를 곱해 내적 값을 0~1 범위로 정규화해요.' },
        { t: 'zip(a, b)', d: '두 리스트의 같은 위치 값을 하나씩 짝지어 주는 반복자예요.' },
        { t: 'return dot_v / (na * nb)', d: '최종 코사인 점수를 계산해 돌려줘요.' },
      ],
      why:
        '두 문장의 의미가 비슷한지 비교할 때 길이보다 방향이 중요해요. ' +
        '짧은 검색어와 긴 문서도 같은 기준으로 점수를 낼 수 있어 실무에서 가장 널리 쓰여요.',
      expectedOutput:
        '[실행] cosine([1,0,1], [1,1,1]) = 0.816',
      realWorldUsage:
        '실제 RAG(검색증강생성) 시스템에서 사용자 질문과 벡터DB에 저장된 문서들의 코사인 유사도를 계산해 가장 관련성 높은 문서를 찾을 때 이 공식이 동작해요.',
      pitfall:
        '벡터 길이가 0이면 na * nb가 0이 되어 ZeroDivisionError가 발생해요. 빈 벡터가 입력되지 않도록 미리 검사해야 해요.',
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


dist = l2([1, 2], [4, 6])
print(f"[실행] l2([1,2], [4,6]) = {dist:.2f}")`,
    explain: {
      concept:
        'L2 거리는 두 점 사이의 직선 거리(유클리드 거리)를 재는 방식이에요. 지도에서 두 지점을 자로 잰 최단 거리와 같아요. ' +
        '각 자리의 차이를 제곱해 모두 더한 뒤 루트를 씌워 실제 거리로 환산해요. ' +
        '이미지 검색처럼 "비슷한 그림 찾기"에서 특징 벡터 간 거리를 잴 때 자주 써요. ' +
        '값이 작을수록 두 벡터가 서로 가깝다고 판단하며, 0이면 완전히 같다는 의미예요.',
      terms: [
        { t: '(x - y) ** 2', d: '두 값의 차이를 제곱해 부호(+, -)를 없애고 거리로 만들어요.' },
        { t: 'sum(...)', d: '모든 자리별 제곱 차이를 하나로 합쳐요.' },
        { t: 'math.sqrt(...)', d: '합산한 값에 루트를 씌워 실제 기하학적 거리로 변환해요.' },
        { t: 'zip(a, b)', d: '두 리스트의 같은 위치 값을 짝지어 주는 반복자예요.' },
      ],
      why:
        '거리 기반 검색은 직관적이고 설명하기 쉬워요. ' +
        '추천 시스템에서 "이 상품과 비슷한 상품"을 찾거나, 이미지 중복 검사에 활용해요.',
      expectedOutput:
        '[실행] l2([1,2], [4,6]) = 5.00',
      realWorldUsage:
        '전자상거래 추천 엔진에서 "지금 보고 있는 상품과 가장 가까운 상품 5개"를 L2 거리로 찾아 추천 목록에 띄울 때 사용해요.',
      pitfall:
        '벡터 차원이 커질수록 거리 값이 기하급수적으로 커져서, 차원이 다른 데이터끼리 비교하기 어려워져요. 정규화나 차원 축소를 먼저 적용하는 게 좋아요.',
    },
  },
  {
    id: 'pvec-dot',
    lang: 'python',
    title: '내적 유사도',
    file: 'dot.py',
    code: `def dot(a, b):
  return sum(x * y for x, y in zip(a, b))


score = dot([1, 2, 3], [4, 5, 6])
print(f"[실행] dot([1,2,3], [4,5,6]) = {score}")`,
    explain: {
      concept:
        '내적(dot product) 유사도는 두 벡터의 같은 자리 값을 곱해 모두 더하는 가장 단순한 점수 계산 방식이에요. ' +
        '계산이 매우 가벼워서 수백만 개 벡터를 빠르게 비교해야 하는 대규모 검색 시스템에서 기초 연산으로 써요. ' +
        '코사인 유사도와 달리 길이와 방향을 모두 반영하기 때문에, 벡터 길이가 비슷하게 정규화된 상황에서 특히 효과적이에요. ' +
        '내적 값이 클수록 두 벡터가 비슷하다고 해석해요.',
      terms: [
        { t: 'x * y', d: '같은 자리의 두 값을 곱해요. 두 값이 모두 크면 결과도 커져요.' },
        { t: 'sum(...)', d: '곱한 값들을 모두 더해 하나의 점수로 만들어요.' },
        { t: 'zip(a, b)', d: '두 리스트를 같은 위치끼리 짝지어 주는 반복자예요.' },
        { t: 'def dot(a, b)', d: '두 벡터를 받아 내적 점수를 돌려주는 함수예요.' },
      ],
      why:
        '계산 비용이 가장 낮아 속도가 중요한 실시간 검색에서 유리해요. ' +
        '벡터가 이미 정규화돼 있다면 내적만으로도 코사인과 동일한 순위를 얻을 수 있어요.',
      expectedOutput:
        '[실행] dot([1,2,3], [4,5,6]) = 32',
      realWorldUsage:
        'FAISS 같은 벡터 검색 라이브러리는 내부적으로 내적 연산을 기본 거리 함수로 제공해요. 임베딩이 정규화된 상태에서는 내적 검색만으로도 빠르게 유사 문서를 찾을 수 있어요.',
      pitfall:
        '벡터 길이가 서로 다르면 점수가 왜곡돼요. 긴 벡터일수록 내적 값이 무조건 커져서 짧은 벡터가 불리해지니, 미리 정규화하고 사용하는 게 안전해요.',
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
result = normalize(a)
norm_val = np.linalg.norm(result)
print(f"[실행] normalize([3, 4]) = {result}")
print(f"[결과] 정규화 후 길이 = {norm_val:.3f}")`,
    explain: {
      concept:
        '벡터 정규화는 모든 벡터의 길이를 1로 맞추는 작업이에요. ' +
        '길이가 다른 벡터들도 공정하게 비교할 수 있게 통일된 기준을 만드는 거죠. ' +
        '실제로는 벡터의 각 값을 전체 길이로 나누기만 하면 되는데, numpy의 linalg.norm이 이 길이를 구해줘요. ' +
        '정규화를 해두면 내적(dot)만으로 코사인 유사도를 대신할 수 있어서, 대규모 검색에서 연산량을 크게 줄일 수 있어요. ' +
        '머신러닝에서 특성(feature) 스케일이 다를 때도 정규화를 먼저 적용해야 모델이 안정적으로 학습돼요.',
      terms: [
        { t: 'np.array([3.0, 4.0])', d: '파이썬 리스트를 넘파이 배열로 바꿔서 벡터 연산을 가능하게 해요.' },
        { t: 'np.linalg.norm(v)', d: '벡터의 유클리드 길이(L2 노름)를 계산해요.' },
        { t: 'v / ...', d: '벡터 전체를 길이로 나눠 모든 성분의 크기를 비율에 맞게 조정해요.' },
        { t: 'def normalize(v)', d: '벡터를 받아 길이 1인 단위 벡터로 변환해 돌려주는 함수예요.' },
      ],
      why:
        '정규화된 벡터끼리는 내적값이 곧 코사인 유사도가 되어, 매번 나누기 연산을 생략할 수 있어 대규모 검색이 빨라져요.',
      expectedOutput:
        '[실행] normalize([3, 4]) = [0.6 0.8]\n[결과] 정규화 후 길이 = 1.000',
      realWorldUsage:
        'OpenAI 임베딩 API에서 반환된 벡터는 이미 정규화돼 있어서, 별도 정규화 없이 바로 내적 검색에 쓸 수 있어요. 서비스 배포 시 전처리 파이프라인에서 이 함수가 항상 호출돼요.',
      pitfall:
        '0벡터(모든 값이 0)를 정규화하려고 하면 길이가 0이라 나누기 오류가 발생해요. normalize() 호출 전에 벡터가 0인지 먼저 확인해야 해요.',
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
print(f"[실행] IndexFlatL2(8) 생성 — 데이터 {data.shape[0]}개 추가 완료")


d, i = idx.search(data[:1], 3)
print(f"[결과] 가장 가까운 3개 인덱스: {i}")
print(f"[결과] 각 거리: {d}")`,
    explain: {
      concept:
        'FAISS IndexFlatL2는 모든 벡터를 있는 그대로 저장하고, 검색할 때마다 전체를 일일이 비교하는 가장 정직한 인덱스예요. ' +
        '압축이나 근사 없이 정확한 L2 거리를 계산하기 때문에, 작은 데이터셋(수만 건 이하)에서는 최고의 정확도를 보여줘요. ' +
        'FAISS는 메타에서 만든 대규모 벡터 검색 라이브러리로, 수십억 개 벡터도 초 단위로 검색할 수 있게 해줘요. ' +
        'Flat 인덱스는 그 중에서도 "아무 최적화 없이 전수 검사"하는 가장 단순한 방식이에요. ' +
        '데이터가 적은 프로토타입 단계에서 기준선(baseline)으로 삼기에 아주 좋아요.',
      terms: [
        { t: 'IndexFlatL2(8)', d: '8차원 벡터를 L2 거리로 전수 비교하는 평면 인덱스를 만들어요.' },
        { t: 'astype("float32")', d: 'FAISS가 내부적으로 float32만 처리하므로 데이터 타입을 맞춰줘요.' },
        { t: 'idx.add(data)', d: '준비된 벡터 데이터를 인덱스에 등록해 검색 가능한 상태로 만들어요.' },
        { t: 'idx.search(data[:1], 3)', d: '질문 벡터 1개로 가장 가까운 3개를 찾아 거리(d)와 인덱스(i)를 돌려줘요.' },
        { t: 'd', d: '찾은 이웃까지의 L2 거리 배열이에요. 값이 작을수록 가깝다는 뜻이에요.' },
      ],
      why:
        '오차 없는 정확한 검색 결과를 얻을 수 있어서, 데이터가 적을 때 정답 기준으로 삼기에 좋아요. ' +
        '실무에서는 Flat 결과와 근사 인덱스 결과를 비교해 근사 방식의 품질을 평가해요.',
      expectedOutput:
        '[실행] IndexFlatL2(8) 생성 — 데이터 100개 추가 완료\n[결과] 가장 가까운 3개 인덱스: [[0 42 77]]\n[결과] 각 거리: [[0.   1.23 1.45]]',
      realWorldUsage:
        '프로토타입 RAG 시스템에서 문서 임베딩 5,000건을 Flat 인덱스에 올려두고, 사용자 질문과 가장 가까운 문서 3개를 찾는 용도로 먼저 써봐요. 이후 데이터가 10만 건을 넘으면 IVF나 HNSW로 전환하는 게 일반적이에요.',
      pitfall:
        '데이터가 수십만 건 이상으로 늘면 검색 속도가 급격히 느려져요. 실서비스에서는 반드시 근사 인덱스(IVF, HNSW)로 전환해야 해요.',
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
print(f"[실행] IndexIVFFlat(10 clusters) — 데이터 {data.shape[0]}개 추가 완료")


idx.nprobe = 2
d, i = idx.search(data[:1], 3)
print(f"[결과] nprobe=2일 때 가장 가까운 3개 인덱스: {i}")
print(f"[결과] 각 거리: {d}")`,
    explain: {
      concept:
        'IVF(Inverted File) 인덱스는 전체 데이터를 여러 묶음(클러스터)으로 나눠서, 검색할 때 일부 묶음만 비교해 속도를 높이는 방식이에요. ' +
        '도서관에서 책을 주제별로 분류해두고, 원하는 주제의 책장만 살펴보는 것과 같은 원리예요. ' +
        '먼저 train() 단계에서 K-means로 데이터를 묶을 중심점을 학습하고, add() 단계에서 각 벡터를 가장 가까운 중심점의 묶음에 배정해요. ' +
        '검색 시에는 nprobe 개수만큼의 묶음만 열어보기 때문에, Flat 인덱스보다 수십 배 빠르면서도 정확도를 크게 잃지 않아요. ' +
        '대규모 벡터 검색이 필요한 실서비스에서 가장 널리 쓰이는 구조예요.',
      terms: [
        { t: 'IndexFlatL2(16)', d: '각 클러스터 내부에서 실제 거리 비교를 담당하는 베이스 양자화기예요.' },
        { t: 'IndexIVFFlat(quan, 16, 10)', d: '16차원 벡터를 10개 클러스터로 나누는 IVF 인덱스를 만들어요.' },
        { t: 'idx.train(data)', d: 'K-means 알고리즘으로 클러스터의 중심점 위치를 학습해요. add보다 먼저 호출해야 해요.' },
        { t: 'idx.nprobe = 2', d: '검색 시 열어볼 클러스터 개수를 2로 설정해요. 클수록 정확하지만 느려져요.' },
        { t: 'idx.add(data)', d: '학습된 중심점을 기준으로 각 벡터를 적절한 클러스터에 배정해 저장해요.' },
      ],
      why:
        '백만 건 이상의 벡터에서도 초 단위로 검색이 가능해 실시간 추천·검색 서비스의 핵심 인덱스로 쓰여요. ' +
        'nprobe로 정확도와 속도의 트레이드오프를 상황에 맞게 조절할 수 있어요.',
      expectedOutput:
        '[실행] IndexIVFFlat(10 clusters) — 데이터 1000개 추가 완료\n[결과] nprobe=2일 때 가장 가까운 3개 인덱스: [[0 543 278]]\n[결과] 각 거리: [[0.   2.11 2.34]]',
      realWorldUsage:
        '쇼핑몰 상품 추천 시스템에서 500만 개 상품 이미지의 특징 벡터를 IVF 인덱스로 구축해, 사용자가 클릭한 상품과 가장 비슷한 상품 10개를 100ms 이내에 찾아내는 데 사용해요.',
      pitfall:
        'train() 없이 add()부터 호출하면 "인덱스가 학습되지 않았다"는 오류가 발생해요. 또한 nprobe가 너무 작으면 정확도가 급격히 떨어질 수 있으니 실험을 통해 적정값을 찾아야 해요.',
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
print(f"[실행] IndexHNSWFlat(12, M=16) — 데이터 {data.shape[0]}개 추가 완료")


idx.hnsw.efSearch = 8
d, i = idx.search(data[:1], 3)
print(f"[결과] 가장 가까운 3개 인덱스: {i}")
print(f"[결과] 각 거리: {d}")`,
    explain: {
      concept:
        'HNSW(Hierarchical Navigable Small World)는 벡터들을 여러 층의 이웃 그래프로 연결해 빠르게 탐색하는 인덱스예요. ' +
        '위층은 듬성듬성한 고속도로, 아래층은 촘촘한 지역 도로처럼 구성되어 있어서 먼 거리를 빠르게 이동하면서도 가까운 이웃은 정확히 찾을 수 있어요. ' +
        'FAISS에서는 IndexHNSWFlat으로 제공되며, IVF와 달리 train() 단계가 필요 없어서 바로 데이터를 추가할 수 있어요. ' +
        '정확도와 속도의 균형이 뛰어나서 최근 대부분의 벡터 데이터베이스(pgvector, Qdrant, Weaviate 등)가 HNSW를 기본 인덱스로 채택하고 있어요.',
      terms: [
        { t: 'IndexHNSWFlat(12, 16)', d: '12차원 벡터를 저장하며, 각 노드가 최대 16개 이웃과 연결되는 HNSW 인덱스를 만들어요.' },
        { t: 'efConstruction = 40', d: '인덱스를 구축할 때 각 노드 삽입 시 살펴볼 후보 수예요. 클수록 품질이 좋아지지만 구축이 느려져요.' },
        { t: 'idx.add(data)', d: '각 벡터를 그래프의 적절한 위치에 삽입해 인덱스를 구축해요.' },
        { t: 'efSearch = 8', d: '검색 시 탐색할 후보 수예요. 클수록 정확도가 올라가지만 검색이 느려져요.' },
        { t: 'd', d: '검색 결과 각 이웃까지의 거리 배열이에요.' },
      ],
      why:
        'HNSW는 삽입과 검색이 모두 빠르고, 정확도도 높아 대부분의 벡터DB에서 기본 옵션이에요. ' +
        '데이터를 추가할 때마다 재학습이 필요 없는 점도 실시간 갱신이 필요한 서비스에 큰 장점이에요.',
      expectedOutput:
        '[실행] IndexHNSWFlat(12, M=16) — 데이터 500개 추가 완료\n[결과] 가장 가까운 3개 인덱스: [[0 312 89]]\n[결과] 각 거리: [[0.   1.87 2.05]]',
      realWorldUsage:
        'pgvector의 HNSW 인덱스를 만들 때 내부적으로 바로 이 FAISS의 HNSW 구현이 사용돼요. 실시간 채팅 검색 서비스에서 새 메시지가 들어올 때마다 인덱스에 추가하면서도 검색 지연 없이 동작할 수 있어요.',
      pitfall:
        'HNSW는 IVF보다 메모리를 더 많이 사용해요. M 값을 너무 크게 설정하면 RAM 사용량이 급증해서 서버에 무리가 갈 수 있으니, 데이터 규모에 맞춰 적절히 조정해야 해요.',
    },
  },
  {
    id: 'pvec-hnsw-build',
    lang: 'python',
    title: 'HNSW 직접 구현',
    file: 'hnsw_basic.py',
    code: `import heapq


def search_layer(q, nodes, edges, ep, k):
  seen = {ep}
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
res = search_layer([1, 1], nodes, edges, 0, 2)
print(f"[결과] 가까운 순서: {res}")`,
    explain: {
      concept:
        '이 코드는 HNSW의 핵심인 "한 층에서 가장 가까운 이웃 k개를 찾는" 과정을 직접 구현한 거예요. ' +
        '우선순위 큐(heapq)를 써서 시작점에서 가까운 순서대로 노드를 방문하고, 방문한 노드의 이웃을 다시 큐에 넣어 탐색 범위를 넓혀가요. ' +
        '"친구의 친구를 따라가며 가까운 사람 찾기"와 똑같은 원리로 동작해요. ' +
        'FAISS나 pgvector 같은 라이브러리의 내부에서 바로 이 알고리즘이 돌아가고 있다고 생각하면 돼요. ' +
        '직접 구현해보면 그래프 기반 검색이 어떻게 동작하는지 깊이 이해할 수 있어요.',
      terms: [
        { t: 'seen = {ep}', d: '이미 방문한 노드를 저장하는 집합(set)이에요. 중복 방문을 막아 무한 루프를 방지해요.' },
        { t: 'heapq.heappop(front)', d: '우선순위 큐에서 가장 거리가 짧은 후보를 꺼내 다음 방문 노드로 삼아요.' },
        { t: 'edges.get(cur, [])', d: '현재 노드에 연결된 이웃 목록을 가져와요. 없으면 빈 리스트를 반환해요.' },
        { t: 'sum((a-b)**2 for a,b in zip(q, nodes[nxt]))', d: '질문 벡터 q와 후보 노드 nxt 간의 L2 거리 제곱을 계산해요.' },
        { t: 'heapq.heappush(front, (d, nxt))', d: '새 후보 노드를 거리값과 함께 우선순위 큐에 삽입해요.' },
      ],
      why:
        '그래프 탐색은 전체 데이터를 전수 검사하지 않고도 가까운 이웃을 빠르게 찾을 수 있어서, 대규모 벡터 검색의 핵심 알고리즘이에요. ' +
        '직접 구현해보면 벡터DB의 동작 원리를 깊이 이해할 수 있고, 성능 최적화 포인트도 찾을 수 있어요.',
      expectedOutput:
        '[결과] 가까운 순서: [0, 1]',
      realWorldUsage:
        '실제 벡터DB 엔진들은 이 search_layer() 함수를 다중 레벨로 확장한 HNSW 알고리즘을 C++로 구현해 초고속으로 실행해요. 파이썬으로 원리를 익힌 뒤 최적화된 라이브러리로 전환하는 학습 경로가 일반적이에요.',
      pitfall:
        '시작점(ep)이 질문 벡터와 너무 멀면 탐색이 길어지고, 연결된 그래프가 끊겨 있으면 모든 노드를 방문하지 못해 결과 품질이 떨어져요.',
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
print(f"[실행] pick_level() 10회 결과: {levels}")
print(f"[결과] 최대 레벨: {max(levels)}, 0 레벨 개수: {levels.count(0)}")`,
    explain: {
      concept:
        'HNSW의 "다층 구조"는 각 벡터가 어느 층(레벨)까지 배치될지를 확률적으로 결정하는 방식이에요. ' +
        'pick_level() 함수는 지수 분포를 따라 "이 벡터가 몇 층까지 올라갈지"를 랜덤하게 정해줘요. ' +
        '높은 층일수록 배치될 확률이 낮아져서, 위층은 듬성듬성한 고속도로, 아래층은 촘촘한 지역 도로가 자연스럽게 형성돼요. ' +
        '대부분의 벡터는 0레벨(가장 아래층)에만 머무르고, 극소수만이 높은 층까지 올라가 탐색의 "지름길" 역할을 해줘요. ' +
        '이 구조 덕분에 먼 거리를 빠르게 이동하면서도 가까운 이웃은 정확히 찾을 수 있어요.',
      terms: [
        { t: 'random.random()', d: '0 이상 1 미만의 난수를 생성해요. 이 값으로 층을 확률적으로 결정해요.' },
        { t: 'math.log(...)', d: '난수에 자연로그를 취해 지수 분포를 따르는 층 번호 분포를 만들어요.' },
        { t: 'mL', d: '층 분포의 기울기를 조절하는 상수예요. 값이 클수록 평균적으로 더 높은 층이 선택돼요.' },
        { t: 'int(...)', d: '실수 층 번호를 정수로 변환해요. 0레벨이 가장 아래층이에요.' },
        { t: '1.0 / math.log(2)', d: '일반적으로 사용되는 mL 값으로, 0레벨에 약 50%가 배치돼요.' },
      ],
      why:
        '층 구조가 자연스럽게 계층적 탐색을 가능하게 해서, 적은 메모리로도 높은 정확도를 달성할 수 있어요.',
      expectedOutput:
        '[실행] pick_level() 10회 결과: [0, 1, 0, 0, 2, 0, 0, 1, 0, 0]\n[결과] 최대 레벨: 2, 0 레벨 개수: 7',
      realWorldUsage:
        'pgvector에 HNSW 인덱스를 생성할 때 내부적으로 이 pick_level()과 동일한 알고리즘이 실행돼요. 사용자는 m과 ef_construction 파라미터만 조정하면 되고, 층 배정은 라이브러리가 자동으로 처리해요.',
      pitfall:
        'mL 값을 너무 크게 하면 모든 벡터가 높은 층까지 올라가서 메모리 사용량이 급증하고 그래프가 너무 복잡해져요. 너무 작게 하면 층이 거의 생기지 않아 탐색 효율이 떨어져요.',
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
  print("[실행] docs 테이블 생성 완료")

  conn.execute(
    "INSERT INTO docs VALUES (%s, %s)",
    ('a', '[1,2,3]'),
  )
  print('[실행] 데이터 삽입 완료')

  rows = conn.execute(
    "SELECT id FROM docs ORDER BY emb <-> '[3,2,1]' LIMIT 2"
  ).fetchall()
  print(f"[결과] 검색 결과: {rows}")`,
    explain: {
      concept:
        'pgvector는 PostgreSQL에 벡터 데이터 타입을 추가해 주는 확장(extension)이에요. ' +
        '일반 테이블에 vector 타입 칼럼을 하나 추가하는 것만으로 벡터 검색이 가능해져서, 별도의 벡터 전용 DB를 설치할 필요가 없어요. ' +
        '기존 SQL 쿼리에 거리 연산자(<->)를 붙여서 벡터 유사도 검색을 실행할 수 있어, 애플리케이션 코드를 최소한으로 변경하고도 의미 검색 기능을 도입할 수 있어요. ' +
        '트랜잭션, 백업, 접근 제어 같은 PostgreSQL의 성숙한 기능을 그대로 활용할 수 있다는 점이 가장 큰 장점이에요.',
      terms: [
        { t: 'vector(3)', d: '3차원 벡터를 저장하는 컬럼 타입이에요. 최대 16,000차원까지 지원해요.' },
        { t: '<->', d: 'pgvector의 L2 거리 연산자예요. 두 벡터의 유클리드 거리를 계산해줘요.' },
        { t: 'ORDER BY emb <-> ...', d: '질문 벡터와 각 행의 emb 벡터 간 거리로 오름차순 정렬해요.' },
        { t: 'LIMIT 2', d: '가장 가까운 상위 2개 행만 결과로 가져와요.' },
        { t: '%s', d: '파라미터화된 쿼리를 위한 자리표시자예요. SQL 인젝션을 방지해줘요.' },
      ],
      why:
        '애플리케이션 데이터와 벡터를 한 DB에서 함께 관리할 수 있어서, 별도 벡터DB 운영 비용을 줄이고 데이터 정합성을 유지하기 쉬워져요.',
      expectedOutput:
        '[실행] docs 테이블 생성 완료\n[실행] 데이터 삽입 완료\n[결과] 검색 결과: [(\'a\',)]',
      realWorldUsage:
        '스타트업에서 PostgreSQL만으로 프로토타입 RAG 시스템을 구축할 때, pgvector 확장을 설치하고 기존 게시글 테이블에 embedding 컬럼을 추가하는 것만으로 의미 기반 검색을 바로 적용할 수 있어요.',
      pitfall:
        '인덱스 없이 전체 테이블을 스캔하면 데이터가 많아질수록 검색이 느려져요. 반드시 HNSW나 IVFFlat 인덱스를 생성해줘야 실서비스 수준의 성능이 나와요.',
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
  print("[실행] HNSW 인덱스 생성 완료")

  conn.execute(
    "SET hnsw.ef_search = 20"
  )
  print("[실행] ef_search = 20 설정")

  rows = conn.execute(
    "SELECT id FROM docs ORDER BY emb <-> '[1,1,1]' LIMIT 5"
  ).fetchall()
  print(f"[결과] 검색 결과: {rows}")`,
    explain: {
      concept:
        'pgvector에서 HNSW 인덱스를 만들면 전체 테이블을 일일이 훑지 않고도 벡터 검색을 빠르게 수행할 수 있어요. ' +
        '책 뒤쪽의 "찾아보기" 페이지를 만드는 것처럼, 미리 벡터들의 연결 그래프를 구축해두는 거예요. ' +
        'ef_search는 검색 시 몇 개의 후보 노드를 탐색할지 정하는 값으로, 클수록 정확도가 올라가지만 검색이 느려져요. ' +
        '인덱스를 만들 때 사용한 거리 연산자(vector_l2_ops)와 검색 시 거리 연산자(<->)가 일치해야 인덱스가 제대로 사용돼요.',
      terms: [
        { t: 'USING hnsw', d: 'HNSW 그래프 방식으로 인덱스를 구축하겠다는 선언이에요.' },
        { t: 'vector_l2_ops', d: '어떤 거리 방식으로 인덱스를 만들지 정하는 연산자 클래스예요.' },
        { t: 'hnsw.ef_search = 20', d: '검색 시 탐색할 후보 노드 수를 20으로 설정해요. 기본값은 40이에요.' },
        { t: '<->', d: 'L2 거리로 정렬하겠다는 연산자예요. 인덱스 생성 시의 vector_l2_ops와 일치해야 해요.' },
      ],
      why:
        '수백만 건의 벡터에서도 인덱스가 있으면 밀리초 단위로 검색이 가능해져요. ' +
        '인덱스 없이는 전체 테이블 순차 검색(Seq Scan)이 발생해서 서비스 응답 시간이 급격히 늘어나요.',
      expectedOutput:
        '[실행] HNSW 인덱스 생성 완료\n[실행] ef_search = 20 설정\n[결과] 검색 결과: [(\'a\',)]',
      realWorldUsage:
        '실서비스에서 pgvector를 사용할 때, 테이블 생성 직후 바로 HNSW 인덱스를 생성하는 스크립트가 배포 파이프라인에 포함돼요. 데이터가 쌓인 뒤에 인덱스를 만들면 생성 시간이 오래 걸리므로 미리 만들어두는 게 좋아요.',
      pitfall:
        '거리 연산자가 인덱스 생성 시와 검색 시 서로 다르면(예: vector_l2_ops로 만들고 vector_cosine_ops로 검색), PostgreSQL이 인덱스를 무시하고 전체 테이블 스캔을 수행해버려요.',
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
  print(f"[결과] tag=news 필터 + 벡터 검색 결과: {rows}")`,
    explain: {
      concept:
        '벡터 검색에 일반 WHERE 조건을 더하면 "의미는 비슷하지만 특정 카테고리에 속하는" 결과만 골라낼 수 있어요. ' +
        '예를 들어 "뉴스" 카테고리 안에서만 사용자 질문과 의미가 가까운 문서를 찾을 수 있게 되는 거예요. ' +
        '실제 서비스에서는 "이 사용자가 볼 수 있는 문서"만 검색하도록 권한 필터를 결합하는 경우도 많아요. ' +
        'pgvector는 네이티브 PostgreSQL 기능이기 때문에, 일반 SQL의 WHERE, JOIN, AND/OR 등을 벡터 검색과 자연스럽게 섞어 쓸 수 있어요. ' +
        '이 점이 외부 벡터DB 대비 pgvector의 가장 큰 강점이에요.',
      terms: [
        { t: 'WHERE tag = %s', d: '벡터 거리와 무관하게 tag 컬럼 값이 일치하는 행만 먼저 걸러내는 조건이에요.' },
        { t: 'ORDER BY emb <-> %s', d: '필터를 통과한 행들만을 대상으로 벡터 거리순으로 정렬해요.' },
        { t: 'LIMIT 5', d: '상위 5개 결과만 반환하도록 제한해요.' },
        { t: '(%s, %s)', d: '두 개의 파라미터를 튜플로 전달해 SQL 인젝션을 방지해요.' },
      ],
      why:
        '사용자에게 보여줄 수 있는 문서만 검색하려면 권한 필터가 필수예요. ' +
        'SQL 한 문장으로 벡터 유사도 + 메타데이터 필터를 동시에 처리할 수 있어 애플리케이션 코드가 훨씬 간결해져요.',
      expectedOutput:
        '[결과] tag=news 필터 + 벡터 검색 결과: [(\'a\',)]',
      realWorldUsage:
        '기업 내부 문서 검색 시스템에서 "사용자가 접근 권한이 있는 부서 문서"로만 검색 범위를 제한할 때, WHERE department_id = ? 조건을 벡터 검색과 함께 사용해요.',
      pitfall:
        '필터 조건이 너무 엄격하면 벡터 검색 결과가 하나도 안 나올 수 있어요. 이럴 때는 필터를 느슨하게 하거나, 필터 없이 순수 벡터 검색으로 폴백하는 로직을 추가하는 게 좋아요.',
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
print("[실행] docs 컬렉션 생성 완료 (size=4, COSINE)")

client.upsert('docs', points=[
  models.PointStruct(id=1, vector=[0.1, 0.2, 0.3, 0.4], payload={'tag': 'news'}),
])
print("[실행] 점 1개 upsert 완료")

hits = client.search('docs', query_vector=[0.1, 0.2, 0.3, 0.4], limit=2)
print(f"[결과] 검색 결과 개수: {len(hits)}, 첫 번째 id: {hits[0].id if hits else '없음'}")`,
    explain: {
      concept:
        'Qdrant는 벡터 검색에 특화된 전용 데이터베이스로, 벡터와 함께 메타데이터(payload)를 한 번에 저장하고 검색할 수 있어요. ' +
        'REST API와 gRPC를 모두 지원해서 다양한 언어에서 쉽게 연동할 수 있고, 메모리 기반 모드도 있어 테스트가 간편해요. ' +
        '컬렉션(collection)이라는 저장 단위 안에 벡터를 PointStruct 객체로 저장하며, 각 점(point)마다 고유 ID, 벡터, 그리고 부가 정보(payload)를 함께 보관해요. ' +
        'upsert는 "없으면 새로 넣고, 있으면 덮어쓴다"는 의미로, 동일 ID로 다시 호출하면 기존 벡터가 새 값으로 갱신돼요. ' +
        'Qdrant는 필터링과 벡터 검색의 조합이 강력해서, 전자상거래 검색이나 추천 시스템에서 많이 써요.',
      terms: [
        { t: 'QdrantClient(":memory:")', d: '디스크 없이 메모리에만 저장하는 임시 클라이언트를 만들어요. 테스트용으로 유용해요.' },
        { t: 'create_collection', d: '벡터를 저장할 컬렉션(논리적 저장 공간)을 새로 만들어요.' },
        { t: 'VectorParams(size=4, distance=COSINE)', d: '4차원 벡터를 코사인 유사도로 비교하도록 컬렉션 설정을 정의해요.' },
        { t: 'PointStruct', d: 'id, vector, payload(메타데이터)를 하나로 묶은 점 객체예요.' },
        { t: 'upsert', d: '점을 삽입하거나(신규) 덮어써요(기존). INSERT OR UPDATE와 같은 동작이에요.' },
        { t: 'query_vector', d: '검색 기준이 되는 질문 벡터예요. 이 벡터와 가장 가까운 점들을 찾아줘요.' },
      ],
      why:
        'RAG 시스템에서 문서 청크의 임베딩과 원본 텍스트·출처 URL을 함께 저장해두면, 검색 결과에 바로 메타데이터를 포함시켜 사용자에게 출처를 표시할 수 있어요.',
      expectedOutput:
        '[실행] docs 컬렉션 생성 완료 (size=4, COSINE)\n[실행] 점 1개 upsert 완료\n[결과] 검색 결과 개수: 1, 첫 번째 id: 1',
      realWorldUsage:
        '실제 RAG 챗봇에서 PDF 문서를 청크로 나눈 뒤 각 청크의 임베딩 벡터와 원문 텍스트·페이지 번호를 Qdrant에 upsert해요. 사용자가 질문하면 검색된 청크에서 출처 페이지를 함께 보여줄 수 있어요.',
      pitfall:
        '컬렉션을 먼저 create_collection()으로 생성하지 않고 upsert()부터 호출하면 오류가 발생해요. 또한 distance 설정을 COSINE으로 해놓고 정규화되지 않은 벡터를 넣으면 결과가 왜곡될 수 있어요.',
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
print("[실행] 데이터 준비 완료")

hits = client.search(
  'docs',
  query_vector=[0.1, 0.2, 0.3, 0.4],
  query_filter=models.Filter(
    must=[models.FieldCondition(key='tag', match=models.MatchValue(value='news'))],
  ),
  limit=2,
)
print(f"[결과] tag=news 필터 검색 결과 개수: {len(hits)}")`,
    explain: {
      concept:
        'Qdrant의 필터 기능은 벡터 검색과 동시에 payload 조건을 걸어 검색 범위를 좁히는 강력한 도구예요. ' +
        'must(반드시 만족), should(선호), must_not(제외) 같은 복합 조건을 중첩해서 정교한 검색 규칙을 만들 수 있어요. ' +
        '예를 들어 "뉴스이면서 한국어인 문서"만 검색하거나, "2024년 이후에 작성된 문서"로 시간 범위를 제한하는 식이에요. ' +
        'Qdrant는 필터 조건에 인덱스를 자동으로 생성해서, 대규모 데이터에서도 필터링 + 벡터 검색이 빠르게 동작해요.',
      terms: [
        { t: 'query_filter', d: '벡터 검색과 함께 적용할 payload 필터 조건이에요.' },
        { t: 'models.Filter(must=[...])', d: 'must 조건을 사용하는 필터 객체를 만들어요. 모든 must 조건을 만족해야 해요.' },
        { t: 'FieldCondition(key="tag", ...)', d: 'payload의 tag 필드에 대한 조건을 정의해요.' },
        { t: 'MatchValue(value="news")', d: 'tag 값이 정확히 "news"인 점만 매칭해요.' },
        { t: 'limit=2', d: '결과를 최대 2개로 제한해요.' },
      ],
      why:
        '검색 결과의 정확도를 높이려면 의미적 유사도뿐 아니라 메타데이터 조건도 함께 평가해야 해요. ' +
        '예를 들어 "2023년 논문"을 검색하는데 2020년 논문이 의미만 비슷하다고 나오면 곤란하겠죠.',
      expectedOutput:
        '[실행] 데이터 준비 완료\n[결과] tag=news 필터 검색 결과 개수: 1',
      realWorldUsage:
        '전자상거래 검색에서 "카테고리=전자제품 AND 브랜드=삼성" 같은 필터를 Qdrant 검색에 결합해, 의미적으로 유사하면서도 원하는 조건의 상품만 보여줄 때 사용해요.',
      pitfall:
        '필터 조건 문자열의 필드명(key)이 payload에 실제로 존재하지 않으면 결과가 비어서 나와요. 필드명 오타에 주의해야 하고, 디버깅 시에는 필터 없이 검색해보는 게 좋아요.',
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
print("[실행] 객체 삽입 완료")

res = col.query.near_vector(
  near_vector=[0.1, 0.2, 0.3],
  limit=3,
)
props = [o.properties for o in res.objects]
print(f"[결과] 검색 결과: {props}")
client.close()
print("[완료] 클라이언트 종료")`,
    explain: {
      concept:
        'Weaviate는 객체(Object)와 벡터를 하나의 단위로 저장하는 벡터 데이터베이스예요. ' +
        '도서관 카드에 책 제목뿐 아니라 책의 위치 정보까지 함께 적어두는 것처럼, 각 데이터에 텍스트 속성과 벡터를 동시에 보관해요. ' +
        '특히 properties에 텍스트를 넣어두면 Weaviate가 자동으로 벡터를 생성해 주는 기능도 있어서, 임베딩 모델을 따로 호출하지 않아도 되는 편리함이 있어요. ' +
        'near_vector로 검색하면 벡터 거리 기반으로 가장 유사한 객체들을 빠르게 찾아줘요. ' +
        '하이브리드 검색(BM25 + 벡터)을 기본 제공하는 점이 Weaviate의 차별화된 강점이에요.',
      terms: [
        { t: 'connect_to_local()', d: '로컬에서 실행 중인 Weaviate 서버에 연결하는 함수예요.' },
        { t: 'collections.get("Doc")', d: '이미 생성된 "Doc" 컬렉션 객체를 가져와서 조작할 준비를 해요.' },
        { t: 'data.insert(properties=..., vector=...)', d: '텍스트 속성과 벡터를 함께 저장해요. vector는 properties와 별도 키워드 인자로 전달해요.' },
        { t: 'near_vector(near_vector=..., limit=3)', d: '질문 벡터와 가장 가까운 객체를 최대 3개까지 찾아요.' },
        { t: 'o.properties', d: '검색된 객체의 텍스트 속성에 접근해요. 여기에 원본 문서 내용이 들어 있어요.' },
      ],
      why:
        '별도 임베딩 파이프라인 없이 Weaviate 하나로 저장부터 검색까지 해결할 수 있어, 소규모 팀에서 빠르게 의미 검색을 도입할 때 생산성이 높아요.',
      expectedOutput:
        '[실행] 객체 삽입 완료\n[결과] 검색 결과: [{\'text\': \'hello world\', \'tag\': \'news\'}]\n[완료] 클라이언트 종료',
      realWorldUsage:
        '스타트업의 지식창고(Knowledge Base) 서비스에서 FAQ 문서를 Weaviate에 저장해두고, 사용자 질문을 near_vector로 검색해 가장 관련성 높은 FAQ를 자동으로 보여줄 때 사용해요.',
      pitfall:
        'vector= 인자를 properties 딕셔너리 안에 넣으면 일반 속성으로 취급되어 임베딩으로 등록되지 않아요. 반드시 data.insert()의 별도 키워드 인자로 전달해야 검색이 정상 동작해요.',
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
props = [o.properties for o in res.objects]
print(f"[결과] 하이브리드(alpha=0.5) 검색 결과: {props}")
client.close()
print("[완료] 클라이언트 종료")`,
    explain: {
      concept:
        '하이브리드 검색은 전통적인 키워드 검색(BM25)과 벡터 의미 검색의 결과를 하나로 섞어서 반환하는 방식이에요. ' +
        'alpha 값으로 두 검색의 비중을 조절하는데, 0이면 순수 키워드 검색, 1이면 순수 벡터 검색이 돼요. ' +
        '예를 들어 "사과"를 검색할 때, 키워드로는 "사과"라는 단어가 정확히 있는 문서를 찾고, 벡터로는 "과일", "애플" 같은 의미적으로 유사한 문서까지 찾아줘요. ' +
        '키워드 검색만 쓰면 동의어를 놓치고, 벡터 검색만 쓰면 정확한 용어 일치가 필요한 경우에 약해요. 두 방식을 섞으면 서로의 단점을 보완할 수 있어요.',
      terms: [
        { t: 'query="hello"', d: '키워드 검색(BM25)에 사용할 질의 문자열이에요.' },
        { t: 'vector=[0.1, 0.2, 0.3]', d: '의미 검색에 사용할 질문 벡터예요.' },
        { t: 'alpha=0.5', d: '두 검색 결과의 혼합 비율이에요. 0.5면 키워드와 벡터를 동등하게 섞어요.' },
        { t: 'hybrid(...)', d: '키워드 검색과 벡터 검색을 동시에 수행해 결과를 하나로 합치는 메서드예요.' },
      ],
      why:
        '순수 벡터 검색은 동의어나 유사 표현에 강하지만 고유명사나 정확한 코드 검색에 약해요. 하이브리드 검색은 두 방식의 장점을 모두 취할 수 있어 검색 품질이 크게 올라요.',
      expectedOutput:
        '[결과] 하이브리드(alpha=0.5) 검색 결과: [{\'text\': \'hello world\', \'tag\': \'news\'}]\n[완료] 클라이언트 종료',
      realWorldUsage:
        '기업 내부 문서 검색에서 "계약서 템플릿"을 검색할 때, 키워드로 "계약서"를 정확히 포함한 문서를 찾으면서도, 벡터로 "협약서", "MOU 양식" 같은 유사 문서도 함께 보여주는 검색에 사용해요.',
      pitfall:
        'alpha=0이면 벡터 검색 결과가 완전히 무시돼서 의미 검색의 장점이 사라져요. 반대로 alpha=1이면 키워드 일치를 전혀 보지 않아요. 도메인에 맞는 alpha 값을 A/B 테스트로 찾는 게 중요해요.',
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
print("[실행] docs 컬렉션 생성 완료 (dimension=8)")

client.insert('docs', [
  {'id': 1, 'vector': [0.1] * 8, 'text': 'hello'},
])
print("[실행] 데이터 삽입 완료")

hits = client.search('docs', data=[[0.1] * 8], limit=2)
print(f"[결과] 검색 결과: {hits}")
client.close()
print("[완료] 클라이언트 종료")`,
    explain: {
      concept:
        'Milvus는 수십억 개의 대규모 벡터를 처리할 수 있도록 설계된 벡터 전용 데이터베이스예요. ' +
        '거대한 물류 창고에 상자를 빈틈없이 보관하고 빠르게 찾아내는 것처럼, 초대규모 벡터 검색에 특화된 분산 아키텍처를 갖추고 있어요. ' +
        'create_collection 시에 벡터의 차원 수(dimension)를 반드시 지정해야 하며, 여기에 맞지 않는 벡터를 insert하면 오류가 나요. ' +
        '경량 모드(MilvusClient)를 사용하면 SQLite 기반으로 파일 하나로 전체 벡터DB를 관리할 수 있어서, 소규모 프로젝트나 임베디드 환경에서도 간편하게 쓸 수 있어요.',
      terms: [
        { t: 'MilvusClient("./milvus.db")', d: '로컬 파일 기반 경량 Milvus 클라이언트를 생성해요. 별도 서버 설치 없이 쓸 수 있어요.' },
        { t: 'create_collection("docs", dimension=8)', d: '8차원 벡터를 저장할 docs 컬렉션을 만들어요. 차원 수는 필수 지정이에요.' },
        { t: "insert('docs', [...])", d: '컬렉션에 벡터와 함께 딕셔너리 형태의 데이터를 삽입해요.' },
        { t: 'data=[[0.1] * 8]', d: '검색에 사용할 질문 벡터예요. 리스트 안에 리스트 형태로 전달해요(배치 검색 지원).' },
        { t: 'limit=2', d: '가장 가까운 2개의 결과만 반환해요.' },
      ],
      why:
        '일일 수억 건의 검색 요청을 처리해야 하는 대규모 서비스에서도 안정적으로 동작하도록 설계되어 있어, 엔터프라이즈 환경의 AI 서비스에서 핵심 인프라로 쓰여요.',
      expectedOutput:
        '[실행] docs 컬렉션 생성 완료 (dimension=8)\n[실행] 데이터 삽입 완료\n[결과] 검색 결과: [[{\'id\': 1, \'distance\': 0.0, \'entity\': {}}]]\n[완료] 클라이언트 종료',
      realWorldUsage:
        '대규모 이미지 검색 서비스에서 수억 장의 이미지 특징 벡터를 Milvus에 저장해두고, 사용자가 업로드한 이미지와 가장 비슷한 이미지를 실시간으로 찾아내는 데 사용돼요.',
      pitfall:
        'dimension 값을 실제 벡터 길이와 다르게 설정하면 insert 단계에서 오류가 발생해요. 벡터의 float 타입도 float32로 맞춰주는 것이 좋아요.',
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
print("[실행] 데이터 준비 완료")

hits = client.search('docs',
  data=[[0.1] * 8],
  filter='tag == "news"',
  limit=2)
print(f"[결과] tag=news 필터 검색 결과: {hits}")
client.close()
print("[완료] 클라이언트 종료")`,
    explain: {
      concept:
        'Milvus에서는 SQL과 비슷한 문자열 표현식으로 검색에 필터 조건을 걸 수 있어요. ' +
        '벡터 검색과 메타데이터 필터를 한 번의 search() 호출로 동시에 처리해서, 원하는 조건의 문서만 빠르게 찾아낼 수 있어요. ' +
        '필터 표현식에는 ==, !=, >, <, and, or, not 같은 연산자를 자유롭게 쓸 수 있어 복잡한 조건도 표현 가능해요. ' +
        '대규모 데이터에서도 스칼라 필드에 자동 인덱싱이 적용되어 필터링 성능이 떨어지지 않아요.',
      terms: [
        { t: 'filter=\'tag == "news"\'', d: '검색 결과를 tag 필드 값이 "news"인 행으로만 제한하는 조건 식이에요.' },
        { t: "data=[[0.1] * 8]", d: '질문 벡터로, 필터를 통과한 행들 중 이 벡터와 가장 가까운 것을 찾아요.' },
        { t: 'limit=2', d: '필터링 + 유사도 검색 후 상위 2개만 반환해요.' },
        { t: 'MilvusClient("./milvus.db")', d: '로컬 파일 기반 Milvus 클라이언트예요.' },
      ],
      why:
        '의미 검색과 조건 검색을 분리하지 않고 한 번에 처리하면 왕복 네트워크 호출을 줄일 수 있고, 애플리케이션 코드도 훨씬 단순해져요.',
      expectedOutput:
        '[실행] 데이터 준비 완료\n[결과] tag=news 필터 검색 결과: [[{\'id\': 1, \'distance\': 0.0, \'entity\': {}}]]\n[완료] 클라이언트 종료',
      realWorldUsage:
        '실시간 추천 서비스에서 "사용자가 최근 7일간 조회한 상품 제외" 같은 시간 기반 필터를 filter=\'last_viewed < 7\' 형태로 벡터 검색과 함께 적용해요.',
      pitfall:
        '필터 표현식의 필드명이 insert 시 사용한 필드명과 정확히 일치해야 해요. 또한 문자열 값은 반드시 큰따옴표로 감싸야 하고, 필터 문법 오류는 런타임에만 발견되므로 주의가 필요해요.',
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
print("[실행] 문서·벡터·메타데이터 추가 완료")

res = col.query(query_embeddings=[[0.1, 0.2, 0.3]], n_results=2)
print(f"[결과] 검색된 id 목록: {res['ids']}")
print(f"[결과] 검색 거리: {res['distances']}")`,
    explain: {
      concept:
        'Chroma는 설치와 사용이 가장 간단한 벡터 저장소로, 별도 서버 없이 파이썬 코드 몇 줄로 바로 벡터 검색을 시작할 수 있어요. ' +
        'EphemeralClient는 메모리에만 데이터를 저장해서 프로그램 종료 시 모든 데이터가 사라지는 임시 저장소예요. ' +
        '하나의 add() 호출에 문서 텍스트(documents), 임베딩 벡터(embeddings), 메타데이터(metadatas)를 한 번에 묶어 저장할 수 있어서 코드가 직관적이에요. ' +
        '소규모 실험이나 교육용 프로토타입을 빠르게 만들어볼 때 가장 먼저 선택되는 도구예요. ' +
        '실서비스에서는 PersistentClient로 전환해 데이터를 디스크에 영구 보존할 수 있어요.',
      terms: [
        { t: 'EphemeralClient()', d: '메모리 기반 임시 클라이언트를 생성해요. 프로그램 종료 시 모든 데이터가 사라져요.' },
        { t: 'get_or_create_collection("docs")', d: 'docs 컬렉션이 있으면 가져오고, 없으면 새로 만들어요.' },
        { t: "ids=['1']", d: '저장할 각 문서의 고유 식별자예요. 리스트로 전달해 한 번에 여러 문서를 추가할 수 있어요.' },
        { t: 'embeddings=[[0.1, 0.2, 0.3]]', d: '각 문서의 임베딩 벡터를 리스트로 전달해요. 바깥 리스트가 문서 개수만큼이에요.' },
        { t: 'metadatas=[{"tag": "news"}]', d: '각 문서에 붙일 부가 정보예요. 필터 검색 시 이 값을 기준으로 걸러요.' },
        { t: "query(query_embeddings=..., n_results=2)", d: '질문 벡터로 가장 가까운 문서를 최대 2개 찾아요.' },
      ],
      why:
        '벡터DB 개념을 처음 배울 때 복잡한 설정 없이 바로 실습할 수 있어 학습 진입 장벽이 가장 낮아요. 프로토타입 개발 속도도 매우 빨라요.',
      expectedOutput:
        '[실행] 문서·벡터·메타데이터 추가 완료\n[결과] 검색된 id 목록: [[\'1\']]\n[결과] 검색 거리: [[0.0]]',
      realWorldUsage:
        'AI 해커톤에서 RAG 챗봇 프로토타입을 하루 만에 만들 때, Chroma의 EphemeralClient로 문서 임베딩을 저장하고 검색하는 파이프라인을 구성해 빠르게 데모를 시연해요.',
      pitfall:
        'EphemeralClient는 데이터가 메모리에만 있어 프로그램이 종료되면 모두 사라져요. 실제 서비스용이라면 PersistentClient(path="./chroma_db")로 전환해 디스크에 저장해야 해요. 대용량에서는 검색 속도가 느려질 수 있어요.',
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


total = batch_upsert(S(), list(enumerate([[0.1]] * 250)), 100)
print(f"[실행] batch_upsert() 완료 — 처리된 항목: {total}")
print(f"[결과] store 크기: {len(store)}")`,
    explain: {
      concept:
        '배치(batch) 처리는 대량의 데이터를 한 번에 전송하지 않고 정해진 크기만큼 나눠서 보내는 기법이에요. ' +
        '벡터DB에 100만 개의 임베딩을 저장할 때 한 번에 1,000개씩 나눠서 넣으면, 메모리 초과나 네트워크 타임아웃을 피할 수 있어요. ' +
        '대부분의 벡터DB 클라이언트는 내부적으로 배치 처리를 지원하지만, 직접 배치 루프를 작성하면 재시도 로직이나 진행률 표시 같은 세밀한 제어가 가능해져요. ' +
        'range(start, stop, step)으로 시작 인덱스를 건너뛰며 각 배치의 슬라이스를 만들어 처리하는 패턴이 기본이에요. ' +
        '실제 운영 환경에서는 배치 크기를 서버 사양과 데이터 크기에 맞춰 실험적으로 결정해야 해요.',
      terms: [
        { t: 'size=100', d: '한 번에 처리할 배치 크기예요. 기본값 100은 서버 과부하를 막는 안전한 값이에요.' },
        { t: 'range(0, len(items), size)', d: '0부터 시작해 size 간격으로 인덱스를 생성하는 반복자예요.' },
        { t: 'items[i:i + size]', d: '리스트 슬라이싱으로 현재 배치에 해당하는 항목들만 잘라내요.' },
        { t: 'store.upsert(...)', d: '잘라낸 배치를 저장소에 삽입하거나 갱신해요.' },
      ],
      why:
        '대량 데이터를 한 번에 전송하면 네트워크 패킷이 끊기거나 서버 메모리가 터질 수 있어요. 배치로 나누면 장애가 발생해도 마지막 성공 지점부터 이어서 재개할 수 있어요.',
      expectedOutput:
        '[실행] batch_upsert() 완료 — 처리된 항목: 250\n[결과] store 크기: 250',
      realWorldUsage:
        '데이터 마이그레이션 스크립트에서 500만 건의 임베딩을 Qdrant로 옮길 때, 2,000개씩 배치로 나눠 upsert 하면서 진행률을 tqdm으로 표시하고, 실패한 배치는 3회 재시도하는 패턴으로 구현해요.',
      pitfall:
        '배치 크기를 너무 크게 설정하면 서버에서 요청을 거부하거나 타임아웃이 발생해요. 반대로 너무 작게 하면 네트워크 왕복 횟수가 많아져 전체 처리 시간이 길어져요.',
    },
  },
];
