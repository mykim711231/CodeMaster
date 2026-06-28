import type { Snippet } from '../../types';

export const pythonRAG: Snippet[] = [
  {
    id: 'prag-char-split',
    lang: 'python',
    title: '문자 길이 청크 분할',
    file: 'char_split.py',
    code: `def char_split(text: str, size: int = 100) -> list:
  chunks = []
  for i in range(0, len(text), size):
    chunks.append(text[i:i + size])
  return chunks


doc = 'a' * 250
print(len(char_split(doc)))`,
    explain: {
      concept: '긴 글을 일정한 글자 수(문자) 단위로 자르는 방법이에요. 책을 페이지 크기에 맞춰 나누는 것과 같아요.',
      terms: [
        { t: 'size: int = 100', d: '한 조각당 글자 수를 정해요. 기본은 100자예요.' },
        { t: 'range(0, len(text), size)', d: 'size 간격으로 시작 위치를 만들어요.' },
        { t: 'text[i:i + size]', d: 'i부터 size 글자만큼 잘라 한 조각을 떼어요.' },
        { t: 'chunks.append', d: '잘라낸 조각을 리스트에 차곡차곡 넣어요.' },
      ],
      why: '길면 모델이 한 번에 못 보니까 작게 나눠두면 다루기 쉬워져요.',
      pitfall: '단어 중간이 잘릴 수 있어요.',
    },
  },
  {
    id: 'prag-sep-split',
    lang: 'python',
    title: '구분자 기반 분할',
    file: 'sep_split.py',
    code: `def sep_split(text: str, sep: str = '\\n\\n') -> list:
  parts = text.split(sep)
  return [p.strip() for p in parts if p.strip()]


doc = 'a\\n\\nb\\n\\nc'
print(sep_split(doc))`,
    explain: {
      concept: '빈 줄 같은 구분자를 기준으로 글을 자르는 방법이에요. 문단이 바뀌는 곳에서 가위로 자르는 것과 같아요.',
      terms: [
        { t: "sep: str = '\\n\\n'", d: '두 번 엔터 친 빈 줄을 자르는 기준으로 써요.' },
        { t: 'text.split(sep)', d: '문자열을 sep마다 잘라 리스트로 만들어요.' },
        { t: 'p.strip()', d: '조각 앞뒤의 공백을 깔끔하게 지워요.' },
        { t: 'if p.strip()', d: '내용이 없는 빈 조각은 빼요.' },
      ],
      why: '문단 단위로 자르면 한 조각에 하나의 주제가 들어가 더 자연스러워요.',
      pitfall: '구분자가 없으면 한 조각이 너무 길어질 수 있어요.',
    },
  },
  {
    id: 'prag-recursive-split',
    lang: 'python',
    title: '재귀적 분할',
    file: 'recursive_split.py',
    code: `def rec_split(text: str, seps: list = None) -> list:
  if seps is None:
    seps = ['\\n\\n', '\\n', '. ', ' ']
  if not seps:
    return [text] if text else []
  head, *tail = seps
  parts = text.split(head)
  out = []
  for p in parts:
    if len(p) > 80:
      out += rec_split(p, tail)
    else:
      out.append(p)
  return out


print(rec_split('aa. bb. cc'))`,
    explain: {
      concept: '큰 구분자부터 차례로 시도하며 너무 긴 조각을 더 잘게 쪼개요. 큰 상자에서 작은 상자로 옮기며 나누는 것과 같아요.',
      terms: [
        { t: 'seps', d: '자르는 기준을 큰 것부터 작은 것 순으로 나열해요.' },
        { t: 'head, *tail', d: '첫 기준은 head, 나머지는 tail 리스트에 담아요.' },
        { t: 'if len(p) > 80', d: '조각이 80자 넘으면 더 잘게 자르려 해요.' },
        { t: 'rec_split(p, tail)', d: '작은 기준으로 다시 자르는 재귀 호출이에요.' },
      ],
      why: '큰 단위부터 자르면 문맥이 최대한 보존돼요.',
      pitfall: '기준 순서가 잘못되면 너무 잘게 부서질 수 있어요.',
    },
  },
  {
    id: 'prag-overlap',
    lang: 'python',
    title: '청크 겹침(오버랩)',
    file: 'overlap.py',
    code: `def overlap_split(text: str, size: int = 100, over: int = 20) -> list:
  chunks = []
  step = size - over
  for i in range(0, len(text), step):
    chunk = text[i:i + size]
    if len(chunk) < step:
      break
    chunks.append(chunk)
  return chunks


print(len(overlap_split('x' * 260)))`,
    explain: {
      concept: '조각끼리 겹치는 부분을 두어 문맥이 끊기지 않게 해요. 책에서 다음 페이지에 윗부분을 조금 다시 보여주는 것과 같아요.',
      terms: [
        { t: 'over: int = 20', d: '겹칠 글자 수예요. 기본 20자예요.' },
        { t: 'step = size - over', d: '다음 조각으로 이동하는 칸 수예요.' },
        { t: 'range(0, len(text), step)', d: 'step만큼 건너뛰며 시작 위치를 정해요.' },
        { t: 'if len(chunk) < step', d: '남은 조각이 너무 작으면 멈춰요.' },
      ],
      why: '조각 경계 부분의 의미가 잘리지 않게 보호해요.',
      pitfall: '오버랩이 너무 크면 같은 내용이 중복돼 저장이 늘어요.',
    },
  },
  {
    id: 'prag-token-split',
    lang: 'python',
    title: '토큰 단위 분할',
    file: 'token_split.py',
    code: `def token_split(text: str, max_tok: int = 50) -> list:
  words = text.split(' ')
  chunks, cur, n = [], [], 0
  for w in words:
    cur.append(w)
    n += 1
    if n >= max_tok:
      chunks.append(' '.join(cur))
      cur, n = [], 0
  if cur:
    chunks.append(' '.join(cur))
  return chunks


print(len(token_split('a ' * 120)))`,
    explain: {
      concept: '글자가 아닌 단어(토큰) 개수로 글을 자르는 방법이에요. 단어별로 세어서 일정 수가 되면 잘라요.',
      terms: [
        { t: 'max_tok: int = 50', d: '한 조각당 단어 수 상한이에요.' },
        { t: "text.split(' ')", d: '공백 기준으로 단어 리스트를 만들어요.' },
        { t: 'cur.append(w)', d: '현재 조각에 단어를 하나 넣어요.' },
        { t: "' '.join(cur)", d: '단어 리스트를 다시 한 문장으로 이어요.' },
      ],
      why: '모델이 읽는 단위(토큰)에 맞추면 비용과 한계를 예측하기 쉬워요.',
      pitfall: '공백으로만 나누면 한국어처럼 띄어쓰기가 없는 글엔 안 맞아요.',
    },
  },
  {
    id: 'prag-metadata',
    lang: 'python',
    title: '청크 메타데이터 붙이기',
    file: 'metadata.py',
    code: `def with_meta(chunks: list, src: str) -> list:
  out = []
  for i, c in enumerate(chunks):
    out.append({
      'text': c,
      'source': src,
      'index': i,
    })
  return out


print(with_meta(['a', 'b'], 'doc1.txt'))`,
    explain: {
      concept: '각 조각에 어디서 온 글인지, 몇 번째인지 정보표를 붙여요. 짐에 주소표를 붙이는 것과 같아요.',
      terms: [
        { t: 'src: str', d: '원본 문서의 이름이나 경로예요.' },
        { t: 'enumerate(chunks)', d: '조각과 그 번호를 함께 꺼내요.' },
        { t: "'text': c", d: '실제 잘린 글 내용이 들어가요.' },
        { t: "'index': i", d: '몇 번째 조각인지 번호를 적어요.' },
      ],
      why: '검색 결과가 어디서 왔는지 알 수 있어 출처를 보여줄 수 있어요.',
      pitfall: '메타데이터 키 이름은 나중에 바꾸면 검색이 안 될 수 있어요.',
    },
  },
  {
    id: 'prag-embed-call',
    lang: 'python',
    title: '임베딩 값 얻기',
    file: 'embed.py',
    code: `def embed(text: str) -> list:
  vec = [0.0] * 8
  for ch in text:
    vec[ord(ch) % 8] += 1.0
  norm = sum(v * v for v in vec) ** 0.5 or 1
  return [v / norm for v in vec]


print(embed('hello'))`,
    explain: {
      concept: '글을 숫자 벡터(방향)로 바꾸는 작업이에요. 글의 의미를 여러 축의 숫자로 표현해요.',
      terms: [
        { t: 'vec = [0.0] * 8', d: '8개 축짜리 0 벡터를 만들어요.' },
        { t: 'ord(ch) % 8', d: '글자 하나를 0~7 칸으로 보내요.' },
        { t: 'sum(v * v for v in vec) ** 0.5', d: '벡터 길이(크기)를 구해요.' },
        { t: 'v / norm', d: '길이를 1로 맞추는 정규화예요.' },
      ],
      why: '비슷한 글은 비슷한 방향을 가리키게 돼 비교가 쉬워요.',
      pitfall: '간단한 해시는 의미를 잡지 못해 실제론 전문 모델을 써요.',
    },
  },
  {
    id: 'prag-embed-batch',
    lang: 'python',
    title: '임베딩 배치 처리',
    file: 'embed_batch.py',
    code: `def embed_one(text: str) -> list:
  v = [float(len(text)), float(text.count('a'))]
  n = (v[0] ** 2 + v[1] ** 2) ** 0.5 or 1
  return [x / n for x in v]


def embed_batch(texts: list) -> list:
  return [embed_one(t) for t in texts]


print(embed_batch(['cat', 'aaa']))`,
    explain: {
      concept: '여러 글을 한 번에 모아 임베딩하는 방법이에요. 짐을 한 번에 여러 개 옮기면 횟수가 줄어드는 것과 같아요.',
      terms: [
        { t: 'embed_one', d: '글 한 개를 벡터로 바꾸는 함수예요.' },
        { t: 'texts: list', d: '여러 글을 담은 리스트예요.' },
        { t: '[embed_one(t) for t in texts]', d: '각 글마다 임베딩을 구해요.' },
        { t: 'n = ... ** 0.5', d: '벡터 길이를 구해 정규화해요.' },
      ],
      why: '한 번에 처리하면 네트워크 호출 횟수가 줄어 빨라요.',
      pitfall: '한 번에 너무 많으면 메모리가 부족해져요.',
    },
  },
  {
    id: 'prag-cosine',
    lang: 'python',
    title: '코사인 유사도',
    file: 'cosine.py',
    code: `def cosine(a: list, b: list) -> float:
  dot = sum(x * y for x, y in zip(a, b))
  na = sum(x * x for x in a) ** 0.5
  nb = sum(y * y for y in b) ** 0.5
  if na == 0 or nb == 0:
    return 0.0
  return dot / (na * nb)


print(cosine([1, 0], [1, 1]))`,
    explain: {
      concept: '두 벡터가 얼마나 같은 방향을 향하는지 -1~1로 재는 방법이에요. 화살표가 같은 쪽을 향하면 가깝다고 보는 것과 같아요.',
      terms: [
        { t: 'sum(x * y ...)', d: '두 벡터의 같은 자리끼리 곱해 더해요(내적).' },
        { t: 'na, nb', d: '각 벡터의 길이예요.' },
        { t: 'dot / (na * nb)', d: '내적을 길이로 나눠 코사인 값(-1~1)을 구해요.' },
        { t: 'if na == 0', d: '0 벡터면 유사도를 0으로 해요.' },
      ],
      why: '길이가 아닌 방향(의미)을 보기 때문에 비슷한 글을 찾기 좋아요.',
      pitfall: '수학적 범위는 -1~1이에요. 임베딩 벡터는 보통 양수여서 0~1 사이가 많지만 반드시 그렇지는 않아요.',
    },
  },
  {
    id: 'prag-dot-sim',
    lang: 'python',
    title: '내적 유사도(빠른 비교)',
    file: 'dot_sim.py',
    code: `def dot_top(query: list, docs: list, k: int = 2) -> list:
  scored = []
  for i, d in enumerate(docs):
    score = sum(q * v for q, v in zip(query, d))
    scored.append((i, score))
  scored.sort(key=lambda x: x[1], reverse=True)
  return scored[:k]


print(dot_top([1, 2], [[1, 0], [0, 2], [1, 1]]))`,
    explain: {
      concept: '벡터의 같은 자리끼리 곱해 더한 값으로 비슷함을 재는 방법이에요. 정규화 안 하고 빠르게 점수만 매길 때 써요.',
      terms: [
        { t: 'sum(q * v ...)', d: '두 벡터를 자리별로 곱해 더해요(내적).' },
        { t: 'scored.append((i, score))', d: '문서 번호와 점수를 짝지어 넣어요.' },
        { t: 'sort(..., reverse=True)', d: '점수가 큰 것부터 내림차순 정렬해요.' },
        { t: '[:k]', d: '위에서 k개만 잘라 가져와요.' },
      ],
      why: '길이 계산을 생략해 코사인보다 빨라요.',
      pitfall: '벡터 길이가 다르면 긴 쪽이 유리해져요.',
    },
  },
  {
    id: 'prag-inmem-store',
    lang: 'python',
    title: '인메모리 벡터 저장소',
    file: 'inmem_store.py',
    code: `class InMemStore:
  def __init__(self):
    self.docs = []
    self.vecs = []

  def add(self, text: str, vec: list) -> None:
    self.docs.append(text)
    self.vecs.append(vec)

  def search(self, q: list, k: int = 2) -> list:
    pairs = list(zip(self.docs, self.vecs))
    pairs.sort(key=lambda dv: sum(a * b for a, b in zip(q, dv[1])), reverse=True)
    return [dv[0] for dv in pairs[:k]]


s = InMemStore()
s.add('cat', [1, 0])
print(s.search([1, 0]))`,
    explain: {
      concept: '글과 벡터를 메모리(기억공간)에 저장하고 검색하는 작은 창고예요. 메모장에 적어두고 찾아 쓰는 것과 같아요.',
      terms: [
        { t: 'self.docs, self.vecs', d: '글과 벡터를 나란히 저장하는 리스트예요.' },
        { t: 'add(text, vec)', d: '글과 벡터 한 쌍을 추가해요.' },
        { t: 'zip(self.docs, self.vecs)', d: '글과 벡터를 짝지어요.' },
        { t: 'search(q, k)', d: '질문 벡터와 가장 가까운 k개를 찾아요.' },
      ],
      why: '외부 서버 없이 빠르게 실험할 수 있어요.',
      pitfall: '프로그램을 끄면 사라져요.',
    },
  },
  {
    id: 'prag-numpy-search',
    lang: 'python',
    title: 'NumPy 행렬 검색',
    file: 'numpy_search.py',
    code: `import numpy as np


def search(query: list, mat: np.ndarray, k: int = 2) -> list:
  q = np.array(query)
  scores = mat.dot(q)
  idx = np.argsort(-scores)[:k]
  return idx.tolist()


mat = np.array([[1, 0], [0, 2], [1, 1]])
print(search([1, 1], mat))`,
    explain: {
      concept: '여러 벡터를 행렬로 묶어 한 번에 질문과 비교하는 방법이에요. 표 전체를 한꺼번에 훑어보는 것과 같아요.',
      terms: [
        { t: 'np.array(query)', d: '질문 벡터를 NumPy 배열로 바꿔요.' },
        { t: 'mat.dot(q)', d: '행렬 전체와 질문을 한 번에 곱해요.' },
        { t: 'np.argsort(-scores)', d: '점수가 큰 순으로 위치를 정렬해요.' },
        { t: '[:k]', d: '가장 비슷한 k개 위치를 잘라요.' },
      ],
      why: '반복문 없이 한 번에 계산해 속도가 빨라요.',
      pitfall: '행렬이 커지면 메모리를 많이 써요.',
    },
  },
  {
    id: 'prag-retriever-topk',
    lang: 'python',
    title: 'Top-K 검색기',
    file: 'topk.py',
    code: `class Store:
  def __init__(self, docs: list, vecs: list):
    self.docs = docs
    self.vecs = vecs

  def search(self, q: list, k: int) -> list:
    pairs = sorted(
      zip(self.docs, self.vecs),
      key=lambda dv: sum(a * b for a, b in zip(q, dv[1])),
      reverse=True,
    )
    return [d for d, _ in pairs[:k]]


class Retriever:
  def __init__(self, store: Store):
    self.store = store

  def top_k(self, q_vec: list, k: int = 3) -> list:
    hits = self.store.search(q_vec, k)
    return [{'text': h, 'rank': i} for i, h in enumerate(hits)]


r = Retriever(Store(['cat', 'dog', 'fish'], [[1, 0], [0, 1], [1, 1]]))
print(r.top_k([1, 0]))`,
    explain: {
      concept: '저장소에서 질문 벡터와 내적이 가장 높은 K개를 골라오는 역할이에요. 사서에게 "이 주제 책 3권만 주세요" 하는 것과 같아요.',
      terms: [
        { t: 'store', d: '글과 벡터를 가진 저장소예요.' },
        { t: 'top_k(q_vec, k)', d: '질문 벡터로 k개를 찾아요.' },
        { t: 'sum(a * b ...)', d: '질문 벡터와 각 문서 벡터의 내적으로 점수를 계산해요.' },
        { t: "'rank': i", d: '찾은 순서대로 순위를 매겨요.' },
      ],
      why: '너무 많은 결과 대신 정확한 몇 개만 쓰면 답이 또렷해요.',
      pitfall: 'k가 너무 작으면 정답이 빠질 수 있어요.',
    },
  },
  {
    id: 'prag-sim-threshold',
    lang: 'python',
    title: '유사도 임계값 필터',
    file: 'threshold.py',
    code: `def filter_hits(hits: list, min_score: float = 0.5) -> list:
  out = []
  for h in hits:
    if h['score'] >= min_score:
      out.append(h)
  return out


hits = [
  {'text': 'a', 'score': 0.8},
  {'text': 'b', 'score': 0.3},
]
print(filter_hits(hits))`,
    explain: {
      concept: '점수가 일정 수준 이상인 것만 남겨요. 시험 점수 커트라인처럼 기준 이하는 버리는 거예요.',
      terms: [
        { t: 'min_score: float = 0.5', d: '살려둘 최소 점수(커트라인)예요.' },
        { t: "h['score']", d: '각 결과의 유사도 점수예요.' },
        { t: '>= min_score', d: '기준보다 같거나 높으면 남겨요.' },
        { t: 'out.append(h)', d: '통과한 결과를 모아요.' },
      ],
      why: '관련 없는 결과를 빼면 답이 흐려지지 않아요.',
      pitfall: '기준이 너무 높으면 결과가 아예 없을 수 있어요.',
    },
  },
  {
    id: 'prag-rerank',
    lang: 'python',
    title: '재정렬(리랭커)',
    file: 'rerank.py',
    code: `def rerank(query: str, docs: list) -> list:
  def score(doc: str) -> int:
    hits = 0
    for w in query.split(' '):
      if w in doc:
        hits += 1
    return hits
  return sorted(docs, key=score, reverse=True)


print(rerank('red car', ['a red car', 'blue bus', 'red bus']))`,
    explain: {
      concept: '처음 찾은 결과를 더 정밀한 기준으로 다시 줄 세우는 단계예요. 1차 면접 합격자를 2차 면접으로 다시 세우는 것과 같아요.',
      terms: [
        { t: 'query.split(" ")', d: '질문을 단어 리스트로 나눠요.' },
        { t: 'if w in doc', d: '단어가 글에 들어있으면 횟수를 올려요.' },
        { t: 'key=score', d: '점수를 기준으로 정렬해요.' },
        { t: 'reverse=True', d: '점수가 큰 것부터 위로 오게 해요.' },
      ],
      why: '빠른 1차 검색 후 정밀 정렬로 정확도를 올릴 수 있어요.',
      pitfall: '리랭커가 느리면 전체 응답이 느려져요.',
    },
  },
  {
    id: 'prag-mmrrerank',
    lang: 'python',
    title: 'MMR 다양성 재정렬',
    file: 'mmr.py',
    code: `def mmr(q_vec: list, docs: list, doc_vecs: list, k: int = 2) -> list:
  picked = []
  pool = list(range(len(docs)))
  while pool and len(picked) < k:
    best, best_i = -1, pool[0]
    for i in pool:
      rel = sum(a * b for a, b in zip(q_vec, doc_vecs[i]))
      div = (
        0 if not picked
        else max(
          sum(a * b for a, b in zip(doc_vecs[i], doc_vecs[j]))
          for j in picked
        )
      )
      score = rel - 0.5 * div
      if score > best:
        best, best_i = score, i
    picked.append(best_i)
    pool.remove(best_i)
  return [docs[i] for i in picked]


print(mmr([1, 0], ['a', 'b', 'c'], [[1, 0], [1, 0], [0, 1]]))`,
    explain: {
      concept: '비슷한 결과가 여러 개 겹치지 않게 다양하게 고르는 방법이에요. 비슷한 사진만 잔뜩 보여주지 않고 여러 장을 고르는 것과 같아요.',
      terms: [
        { t: 'rel', d: '질문과 결과가 얼마나 가까운지(관련도)예요.' },
        { t: 'div', d: '이미 고른 결과 전체 중 가장 많이 겹치는 유사도(중복도)예요.' },
        { t: 'score = rel - 0.5 * div', d: '관련도는 높이고 중복은 낮춰요.' },
        { t: 'pool.remove(best_i)', d: '고른 것은 후보에서 빼요.' },
      ],
      why: '겹치는 답을 빼면 사용자가 더 다양한 정보를 봐요.',
      pitfall: '가중치(0.5)가 크면 관련도가 떨어지는 결과가 올라요.',
    },
  },
  {
    id: 'prag-hybrid',
    lang: 'python',
    title: '하이브리드 검색 점수 합치기',
    file: 'hybrid.py',
    code: `def hybrid(lex: dict, sem: dict, w: float = 0.5) -> list:
  ids = set(lex) | set(sem)
  scored = []
  for i in ids:
    s = w * lex.get(i, 0.0) + (1 - w) * sem.get(i, 0.0)
    scored.append((i, s))
  scored.sort(key=lambda x: x[1], reverse=True)
  return scored


print(hybrid({'a': 0.9, 'b': 0.1}, {'a': 0.2, 'b': 0.8}))`,
    explain: {
      concept: '단어 일치(키워드) 점수와 의미(벡터) 점수를 섞어 순위를 매기는 방법이에요. 맛과 가격 점수를 합쳐 식당을 고르는 것과 같아요.',
      terms: [
        { t: 'lex', d: '키워드 일치 기반 점수 딕셔너리예요.' },
        { t: 'sem', d: '의미(벡터) 기반 점수 딕셔너리예요.' },
        { t: 'w * lex + (1 - w) * sem', d: '두 점수를 가중치로 섞어요.' },
        { t: 'set(lex) | set(sem)', d: '두 결과의 아이디 합집합을 구해요.' },
      ],
      why: '키워드가 정확히 들어가면서도 의미가 비슷한 것을 같이 잡아요.',
      pitfall: '두 점수 단위가 다르면 한 쪽이 묻힐 수 있어요.',
    },
  },
  {
    id: 'prag-rrf',
    lang: 'python',
    title: 'RRF 순위 합치기',
    file: 'rrf.py',
    code: `def rrf(rankings: list, c: int = 60) -> list:
  scores = {}
  for ranking in rankings:
    for pos, doc_id in enumerate(ranking, start=1):
      scores[doc_id] = scores.get(doc_id, 0.0) + 1.0 / (c + pos)
  out = sorted(scores, key=lambda x: scores[x], reverse=True)
  return out


print(rrf([['a', 'b', 'c'], ['b', 'a', 'd']]))`,
    explain: {
      concept: '점수가 아닌 순위를 합쳐 최종 순서를 정하는 방법이에요. 여러 심사위원의 등수를 합쳐 최종 순위를 매기는 것과 같아요.',
      terms: [
        { t: 'rankings', d: '여러 검색 결과의 순위 목록이에요.' },
        { t: 'enumerate(ranking, start=1)', d: '1부터 시작하는 순위를 매겨요. 표준 RRF 공식과 일치해요.' },
        { t: '1.0 / (c + pos)', d: '순위가 높을수록(pos 작을수록) 더 큰 점수를 줘요.' },
        { t: 'sorted(..., reverse=True)', d: '합산 점수 큰 순으로 세워요.' },
      ],
      why: '점수 단위가 달라도 순위만 있으면 합칠 수 있어요.',
      pitfall: 'c값이 너무 작으면 1등만 너무 강조돼요.',
    },
  },
  {
    id: 'prag-bm25-score',
    lang: 'python',
    title: 'BM25 키워드 점수',
    file: 'bm25.py',
    code: `import math


def bm25_score(query: str, doc: str, corpus: list,
               k1: float = 1.5, b: float = 0.75) -> float:
  words = doc.split()
  avg_len = sum(len(d.split()) for d in corpus) / len(corpus)
  tf_raw = words.count(query)
  tf = tf_raw * (k1 + 1) / (tf_raw + k1 * (1 - b + b * len(words) / avg_len))
  df = sum(1 for d in corpus if query in d.split())
  idf = math.log((len(corpus) - df + 0.5) / (df + 0.5) + 1)
  return tf * idf


corpus = ['red car fast', 'blue car slow', 'red bus big']
print(bm25_score('red', corpus[0], corpus))`,
    explain: {
      concept: '단어 빈도와 희귀도를 함께 고려해 문서 관련도를 점수로 나타내는 키워드 검색 방법이에요. 드물게 나오는 중요한 단어에 더 높은 점수를 줘요.',
      terms: [
        { t: 'k1, b', d: 'k1은 단어 반복 효과 감쇠, b는 문서 길이 정규화 강도예요.' },
        { t: 'tf', d: '문서 안에서 단어가 얼마나 자주 나오는지(빈도)예요.' },
        { t: 'idf', d: '전체 문서 중 단어가 드물수록 커지는 희귀도 점수예요.' },
        { t: 'tf * idf', d: '빈도와 희귀도를 곱해 최종 BM25 점수를 내요.' },
      ],
      why: '하이브리드 검색에서 키워드 점수를 구할 때 TF-IDF보다 더 정확해요.',
      pitfall: '단어 형태가 다르면(run/running) 다른 단어로 취급해 점수가 낮아질 수 있어요.',
    },
  },
  {
    id: 'prag-vector-store-persist',
    lang: 'python',
    title: '벡터 저장소 파일 저장·불러오기',
    file: 'vec_persist.py',
    code: `import json


def save_store(docs: list, vecs: list, path: str) -> None:
  with open(path, 'w', encoding='utf-8') as f:
    json.dump({'docs': docs, 'vecs': vecs}, f, ensure_ascii=False)


def load_store(path: str) -> tuple:
  with open(path, encoding='utf-8') as f:
    data = json.load(f)
  return data['docs'], data['vecs']


save_store(['고양이', '강아지'], [[1.0, 0.0], [0.0, 1.0]], 'store.json')
docs, vecs = load_store('store.json')
print(docs)`,
    explain: {
      concept: '메모리에 있는 벡터 저장소를 파일로 저장하고 나중에 다시 불러오는 방법이에요. 숙제를 저장해두고 다음에 이어서 하는 것과 같아요.',
      terms: [
        { t: 'json.dump', d: '파이썬 객체를 JSON 파일로 써요.' },
        { t: 'ensure_ascii=False', d: '한글 같은 비ASCII 문자를 그대로 저장해요.' },
        { t: 'json.load', d: 'JSON 파일을 읽어 파이썬 객체로 돌려요.' },
        { t: "data['docs'], data['vecs']", d: '저장한 글 목록과 벡터 목록을 꺼내요.' },
      ],
      why: '프로그램을 끄고 켜도 임베딩을 다시 계산하지 않아도 돼요.',
      pitfall: '벡터가 많으면 JSON 파일이 매우 커져요. 대용량엔 전용 벡터DB를 쓰세요.',
    },
  },
];
