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

print("[실행] 250자를 100자씩 분할")
doc = 'a' * 250
print(f"[결과] 청크 개수: {len(char_split(doc))}")`,
    explain: {
      concept:
        '문자 길이 분할은 긴 문서를 일정한 글자 수 단위로 자르는 가장 단순한 청크(chunk) 분할 방식이에요. ' +
        '마치 두꺼운 책을 페이지별로 나누듯, 정해진 길이만큼 앞에서부터 차례로 잘라요. ' +
        'range의 세 번째 인자인 step(size)을 이용하면 매 반복마다 size만큼 건너뛰며 시작 위치를 잡을 수 있어요. ' +
        '실무 RAG에서는 가장 기본적인 분할 방식이지만, 단어 중간에서 잘릴 수 있어서 복잡한 문서에는 잘 안 써요. ' +
        '그래도 구현이 간단해서 프로토타입이나 간단한 텍스트 처리에는 여전히 유용해요.',
      terms: [
        { t: 'size: int = 100', d: '한 청크당 최대 글자 수를 정하는 매개변수예요. 기본값 100자로 설정돼 있어요.' },
        { t: 'range(0, len(text), size)', d: '0부터 텍스트 끝까지 size 간격으로 시작 인덱스를 만들어내는 반복문이에요.' },
        { t: 'text[i:i + size]', d: 'i번째 글자부터 size개 글자만큼 슬라이싱해서 한 청크로 떼어내는 문법이에요.' },
        { t: 'chunks.append()', d: '잘라낸 청크 조각을 리스트에 차곡차곡 쌓아 모아요.' },
      ],
      why:
        'RAG 시스템의 첫 단계는 문서를 작은 청크로 나누는 거예요. 모델 입력 길이 제한도 있고, 너무 큰 덩어리는 검색 정확도가 떨어지기 때문이에요.',
      expectedOutput:
        '[실행] 250자를 100자씩 분할\n' +
        '[결과] 청크 개수: 3',
      realWorldUsage:
        '사용자 매뉴얼 같은 단순 텍스트 문서를 RAG용으로 인덱싱할 때, 한 문단이나 한 섹션의 평균 길이가 100~200자라면 ' +
        '이 방식으로 빠르게 분할해서 벡터 DB에 저장해요. 빠른 PoC(Proof of Concept)에 특히 적합해요.',
      pitfall: '단어 중간이 잘리면 의미가 깨져요. "안녕하세요"가 "안녕하"와 "세요"로 나뉘면 검색 품질이 떨어지니, 문장이나 문단 단위로 자르는 후속 기법을 함께 고려해야 해요.',
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

print("[실행] 빈 줄 기준 분할")
doc = 'a\\n\\nb\\n\\nc'
print(f"[결과] {sep_split(doc)}")`,
    explain: {
      concept:
        '구분자 기반 분할은 빈 줄, 마침표, 특정 문자열 같은 구분자를 기준으로 텍스트를 자르는 방식이에요. ' +
        '특히 문단이 바뀌는 곳을 기준으로 자르면 한 청크에 하나의 주제만 들어가게 돼서 검색 품질이 좋아져요. ' +
        'split() 메서드로 구분자마다 문자열을 나누고, strip()으로 각 조각의 앞뒤 공백을 정리해요. ' +
        '빈 조각은 if p.strip() 조건으로 걸러내서 불필요한 빈 청크가 생기지 않게 방지해요. ' +
        '실무에서는 마크다운 문서의 헤더(##), 코드 블록(```), 빈 줄 등 구조화된 문서를 나눌 때 아주 효과적이에요.',
      terms: [
        { t: "sep: str = '\\n\\n'", d: '문단을 구분하는 빈 줄(연속된 두 줄바꿈)을 기본 구분자로 사용해요.' },
        { t: 'text.split(sep)', d: '문자열을 구분자마다 잘라서 리스트로 만드는 파이썬 문자열 메서드예요.' },
        { t: 'p.strip()', d: '각 청크 앞뒤의 공백과 줄바꿈 문자를 제거해서 깔끔하게 정리해요.' },
        { t: 'if p.strip()', d: '내용이 없는 빈 문자열은 리스트에서 제외하는 필터 조건이에요. 빈 문자열은 False로 평가돼요.' },
      ],
      why:
        '문단 단위로 자르면 각 청크가 하나의 주제를 온전히 담게 돼서 검색 정확도가 올라가요. ' +
        '문자 길이로만 자르면 애매하게 잘리지만, 문단 구분자는 자연스러운 경계를 제공해요.',
      expectedOutput:
        "[실행] 빈 줄 기준 분할\n[결과] ['a', 'b', 'c']",
      realWorldUsage:
        '위키피디아 문서를 RAG 지식 베이스로 구축할 때, 각 섹션(== 제목 ==)과 문단(\\n\\n)을 기준으로 분할해서 ' +
        '같은 주제의 내용이 한 청크에 담기도록 해요. 그래야 "파이썬 역사"라고 검색했을 때 관련 문단만 정확히 나와요.',
      pitfall: '구분자가 문서에 전혀 없으면 전체 문서가 하나의 청크가 돼서 너무 길어져요. 구분자가 없는 경우 폴백(fallback) 로직으로 문자 길이 분할을 함께 쓰는 게 좋아요.',
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

print("[실행] 재귀 분할 시작")
print(f"[결과] {rec_split('aa. bb. cc')}")`,
    explain: {
      concept:
        '재귀적 분할(recursive split)은 큰 구분자부터 시작해서, 청크가 여전히 너무 길면 더 작은 구분자로 재귀적으로 다시 자르는 스마트한 방식이에요. ' +
        '마치 이삿짐을 큰 상자에 넣고, 넘치면 중간 상자로, 그래도 넘치면 작은 상자로 옮기는 것과 같아요. ' +
        '구분자 우선순위를 빈 줄(\\n\\n) → 줄바꿈(\\n) → 문장(. ) → 공백( ) 순으로 정해두면, 문맥이 최대한 보존되는 단위로 나눠져요. ' +
        'LangChain의 RecursiveCharacterTextSplitter가 바로 이 알고리즘을 기반으로 동작해요. ' +
        'head, *tail 구문은 파이썬의 확장 언패킹으로, 리스트의 첫 요소는 head에, 나머지는 tail 리스트에 담아요.',
      terms: [
        { t: 'seps', d: '큰 단위부터 작은 단위 순서로 나열된 구분자 리스트예요. 순서가 결과 품질을 크게 좌우해요.' },
        { t: 'head, *tail = seps', d: '첫 구분자는 head, 나머지는 tail로 분리하는 파이썬 확장 언패킹이에요.' },
        { t: 'if len(p) > 80', d: '청크가 80자보다 길면 더 작은 구분자로 재귀 호출해서 추가 분할해요.' },
        { t: 'rec_split(p, tail)', d: '남은 구분자(tail)로 다시 자신을 호출하는 재귀 부분이에요. 청크가 충분히 작아질 때까지 반복해요.' },
      ],
      why:
        'RAG 시스템의 품질은 청크 품질에 크게 좌우돼요. 재귀 분할은 "문서 구조 보존"과 "적절한 크기" 사이의 균형을 자동으로 맞춰줘서, ' +
        '가장 실용적인 분할 전략으로 평가받고 있어요.',
      expectedOutput:
        "[실행] 재귀 분할 시작\n[결과] ['aa.', 'bb.', 'cc.']",
      realWorldUsage:
        '기술 문서, API 레퍼런스, 마크다운 파일 등 계층 구조가 있는 문서를 RAG용 청크로 만들 때 사용해요. ' +
        'LangChain에서 PDF, 웹페이지, 코드 저장소 등 다양한 소스를 인덱싱할 때 기본 분할기로 이 재귀 방식을 채택하고 있어요.',
      pitfall: '구분자 순서를 잘못 정하면(예: 공백이 빈 줄보다 앞에 오면) 지나치게 잘게 쪼개져서 의미 있는 문맥이 사라질 수 있어요. 큰 구조 → 작은 구조 순서를 반드시 지켜야 해요.',
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

print("[실행] 20자 오버랩 분할")
print(f"[결과] 청크 개수: {len(overlap_split('x' * 260))}")`,
    explain: {
      concept:
        '오버랩(overlap) 분할은 청크 사이에 겹치는 부분을 의도적으로 남겨서 문맥이 잘리지 않게 하는 기법이에요. ' +
        '책에서 다음 페이지로 넘어갈 때 윗부분을 살짝 다시 보여주는 것처럼, 청크 경계 부분의 정보 손실을 막아줘요. ' +
        'step을 size보다 작게(over만큼 빼서) 설정하면, 다음 청크가 이전 청크의 끝 부분을 일부 포함하게 돼요. ' +
        '마지막 청크가 step보다 짧으면 의미 있는 청크가 아니라고 보고 버려요. ' +
        '실무에서는 오버랩 크기를 청크 크기의 10~20%로 설정하는 게 일반적이에요. 너무 작으면 문맥 보존 효과가 약하고, 너무 크면 중복이 심해져요.',
      terms: [
        { t: 'over: int = 20', d: '인접 청크와 겹칠 글자 수예요. 기본 20자로, size의 20% 수준이에요.' },
        { t: 'step = size - over', d: '다음 청크의 시작 위치까지 이동 거리예요. size보다 작아야 오버랩이 생겨요.' },
        { t: 'range(0, len(text), step)', d: 'step 간격으로 시작 인덱스를 생성해요. 0, 80, 160, ... 식으로 움직여요.' },
        { t: 'if len(chunk) < step', d: '마지막에 남은 찌꺼기 청크를 걸러내는 조건이에요. 너무 짧으면 버려요.' },
        { t: "text[i:i + size]", d: '현재 위치에서 size만큼 슬라이싱해요. 다음 청크와 over만큼 겹쳐요.' },
      ],
      why:
        '문서의 의미 단위(문장, 문단)가 청크 경계에 걸려서 잘리면 검색 시 중요한 정보를 놓칠 수 있어요. ' +
        '오버랩은 이런 경계 효과를 줄여서 검색 재현율(recall)을 높여줘요.',
      expectedOutput:
        '[실행] 20자 오버랩 분할\n' +
        '[결과] 청크 개수: 3',
      realWorldUsage:
        '법률 문서 검색 시스템에서 "제3조 계약 해지 조건" 같은 조항이 청크 경계에 걸리면 검색이 안 될 수 있어요. ' +
        '오버랩을 주면 조항 전체가 최소 한 청크에 온전히 포함돼서 검색 누락을 방지할 수 있어요.',
      pitfall: '오버랩을 너무 크게 하면 중복 저장된 데이터가 검색 결과에 여러 번 등장해 사용자 경험이 나빠져요. 또 저장 공간도 그만큼 늘어나니 적절한 비율(10~20%)을 유지하는 게 중요해요.',
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

print("[실행] 토큰 단위 분할 (120개 단어)")
print(f"[결과] 청크 개수: {len(token_split('a ' * 120))}")`,
    explain: {
      concept:
        '토큰 단위 분할은 글자가 아니라 단어(토큰) 개수를 기준으로 문서를 자르는 방식이에요. ' +
        'RAG에서 모델이 실제로 보는 것은 글자 수가 아니라 토큰 수이기 때문에, 토큰 단위로 청크 크기를 관리하는 게 더 정확해요. ' +
        '예를 들어 GPT-3.5는 최대 4096토큰, GPT-4는 128K토큰까지 한 번에 처리할 수 있어요. ' +
        'LLM API 비용도 토큰 수로 책정되기 때문에, 청크 크기를 토큰 단위로 맞추면 비용 예측과 제어가 훨씬 쉬워져요. ' +
        '다만 이 코드는 공백 기준으로만 단어를 세기 때문에, 한국어처럼 띄어쓰기가 없는 언어에는 바로 적용하기 어려워요.',
      terms: [
        { t: 'max_tok: int = 50', d: '한 청크에 포함될 최대 단어 수 상한이에요. LLM 입력 길이에 맞춰 설정해요.' },
        { t: "text.split(' ')", d: '공백을 기준으로 텍스트를 단어 리스트로 분리해요. 영어에는 잘 맞지만 한국어에는 부적합해요.' },
        { t: "' '.join(cur)", d: '리스트에 모인 단어들을 공백으로 이어서 하나의 청크 문자열로 합쳐요.' },
        { t: 'if cur: chunks.append(...)', d: '반복문이 끝난 후 남은 단어들을 마지막 청크로 추가하는 마무리 처리예요.' },
      ],
      why:
        'LLM이 한 번에 읽을 수 있는 양은 토큰 수로 제한돼요. 글자 수는 언어마다 토큰화 방식이 달라서 예측이 어렵지만, ' +
        '토큰 수는 직접적이고 일관된 단위예요. 또한 API 비용도 토큰당 부과돼서 예산 관리에 필수예요.',
      expectedOutput:
        '[실행] 토큰 단위 분할 (120개 단어)\n' +
        '[결과] 청크 개수: 3',
      realWorldUsage:
        'OpenAI API를 호출하는 RAG 파이프라인에서, 각 청크가 500토큰을 넘지 않도록 토큰 분할을 적용해요. ' +
        '이렇게 하면 한 번의 API 호출 비용을 예측 가능하게 유지하면서도 의미 덩어리를 보존할 수 있어요.',
      pitfall: '공백 기준 분할은 한국어, 중국어, 일본어처럼 띄어쓰기가 없거나 규칙이 다른 언어에는 맞지 않아요. 실제 프로젝트에서는 SentencePiece나 형태소 분석기를 활용한 토큰 분할을 고려해야 해요.',
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

print("[실행] 메타데이터 부착")
print(f"[결과] {with_meta(['a', 'b'], 'doc1.txt')}")`,
    explain: {
      concept:
        '메타데이터 부착은 각 청크에 원본 문서 정보, 위치 정보, 생성 시간 같은 부가 정보를 태그로 붙이는 작업이에요. ' +
        '택배 상자에 송장을 붙이는 것처럼, 나중에 검색 결과가 어느 문서의 어느 부분에서 왔는지 추적할 수 있게 해줘요. ' +
        'RAG 시스템에서 검색 결과를 사용자에게 보여줄 때 "이 정보는 어느 문서에서 왔습니다"라고 출처를 표시하려면 메타데이터가 반드시 필요해요. ' +
        'enumerate(chunks)로 청크에 0부터 시작하는 순번을 자동으로 부여할 수 있어요. ' +
        '실무에서는 문서 제목, 작성일, 부서, 버전, 페이지 번호 등을 함께 기록해서 필터링과 출처 추적에 활용해요.',
      terms: [
        { t: 'src: str', d: '청크가 추출된 원본 문서의 이름이나 파일 경로를 담는 매개변수예요.' },
        { t: 'enumerate(chunks)', d: '리스트 요소와 인덱스를 동시에 반복문에서 꺼내주는 파이썬 내장 함수예요.' },
        { t: "'text': c", d: '실제 문서 내용(청크 텍스트)을 담는 키예요.' },
        { t: "'index': i", d: '문서 내에서 청크의 순서 번호예요. 0부터 시작하며, 앞뒤 청크를 찾을 때 활용해요.' },
      ],
      why:
        '검색 결과가 어디서 왔는지 알려줘야 사용자가 신뢰할 수 있어요. 또 PDF 파일명이나 URL을 함께 보여주면 ' +
        '사용자가 원본을 직접 확인할 수도 있고, 법적·규제 목적으로 출처 추적이 필수인 분야(의료, 법률, 금융)에서도 꼭 필요해요.',
      expectedOutput:
        "[실행] 메타데이터 부착\n" +
        "[결과] [{'text': 'a', 'source': 'doc1.txt', 'index': 0}, {'text': 'b', 'source': 'doc1.txt', 'index': 1}]",
      realWorldUsage:
        '기업 내부 문서 검색에서 직원이 "2025년 마케팅 예산"을 검색하면, "budget_2025.pdf 3페이지에서 발췌" 같은 출처 정보가 함께 표시돼요. ' +
        '나중에 감사(audit) 시에도 어떤 문서에서 어떤 정보를 가져왔는지 추적할 수 있어 컴플라이언스 요구사항을 충족할 수 있어요.',
      pitfall: '메타데이터의 키 이름(source, index, text 등)을 중간에 바꾸면 기존에 저장된 인덱스와 호환되지 않아 검색이 안 될 수 있어요. 스키마를 한 번 정하면 되도록 변경하지 않는 게 좋아요.',
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

print("[실행] 텍스트 임베딩")
print(f"[결과] {embed('hello')}")`,
    explain: {
      concept:
        '임베딩(embedding)은 텍스트의 의미를 여러 숫자로 된 벡터로 변환하는 핵심 기술이에요. ' +
        '이 예제 코드는 실제 모델 대신 각 글자의 ASCII 코드를 8로 나눈 나머지 칸에 카운트를 쌓아 간단한 벡터를 만들어요. ' +
        '실무에서는 SentenceTransformer나 OpenAI Embeddings API로 수백~수천 차원의 고품질 벡터를 얻지만, 원리는 이 코드와 똑같아요. ' +
        'norm으로 벡터 길이를 구한 뒤 각 성분을 나누는 정규화(normalization)를 거치면, 모든 벡터가 길이 1인 단위 벡터가 돼요. ' +
        '이렇게 정규화된 벡터끼리는 내적(dot product)만으로도 코사인 유사도를 계산할 수 있어서 검색이 빨라져요.',
      terms: [
        { t: 'vec = [0.0] * 8', d: '8개 축을 가진 0으로 초기화된 벡터를 만들어요. 벡터 차원 수를 정하는 부분이에요.' },
        { t: 'ord(ch) % 8', d: '각 글자의 ASCII 번호를 8로 나눈 나머지로 0~7 사이의 칸을 정해요. 간단한 해시 함수 역할이에요.' },
        { t: 'sum(v * v for v in vec) ** 0.5', d: '벡터의 유클리드 길이(L2 노름)를 계산하는 제너레이터 표현식이에요.' },
        { t: 'v / norm', d: '각 성분을 벡터 길이로 나눠 길이가 1인 단위 벡터로 정규화해요. 이러면 방향만 보존되고 크기는 통일돼요.' },
      ],
      why:
        '비슷한 단어는 비슷한 패턴을 가질 가능성이 높고, 벡터화하면 "얼마나 비슷한가"를 수학적으로 계산할 수 있어요. ' +
        '이 원리가 바로 구글 검색, 유튜브 추천, 넷플릭스의 "비슷한 콘텐츠" 기능의 근간이에요.',
      expectedOutput:
        '[실행] 텍스트 임베딩\n' +
        '[결과] [0.0, 0.577..., 0.0, 0.577..., 0.0, 0.577..., 0.0, 0.0]',
      realWorldUsage:
        '실제 서비스에서는 이 함수 자리에 OpenAI text-embedding-3-small 모델을 호출하는 API가 들어가요. ' +
        '사용자 검색어를 1536차원 벡터로 변환한 뒤, 미리 저장된 수백만 문서 벡터 중 가장 가까운 것을 코사인 유사도로 찾아 반환해요.',
      pitfall: '이 코드의 해시 기반 벡터는 의미를 전혀 반영하지 못해요. "cat"과 "kitten"의 벡터가 완전히 다르게 나올 수 있어서, 실제 프로젝트에서는 반드시 사전 학습된 임베딩 모델을 사용해야 해요.',
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

print("[실행] 배치 임베딩")
print(f"[결과] {embed_batch(['cat', 'aaa'])}")`,
    explain: {
      concept:
        '배치(batch) 임베딩은 여러 텍스트를 한 번에 모아서 임베딩 벡터로 변환하는 방식이예요. ' +
        'for 루프로 하나씩 처리하는 것보다, 리스트 컴프리헨션으로 모아서 처리하면 코드도 깔끔하고 속도도 빨라져요. ' +
        '이 예제에서는 텍스트 길이와 \'a\' 글자 개수만으로 2차원 벡터를 만들지만, 실무에서는 GPU로 수백 개를 동시에 인코딩해요. ' +
        '임베딩 API도 배치 호출을 지원해서, 네트워크 왕복 시간을 아끼면서 처리량을 극대화할 수 있어요. ' +
        '대규모 데이터셋을 벡터 DB에 인덱싱할 때는 반드시 배치 처리를 사용하는 게 정석이에요.',
      terms: [
        { t: 'embed_one()', d: '단일 텍스트를 2차원 벡터로 변환하는 기본 임베딩 함수예요.' },
        { t: 'texts: list', d: '여러 텍스트를 담은 입력 리스트예요. 배치 단위로 처리할 데이터 묶음이에요.' },
        { t: '[embed_one(t) for t in texts]', d: '리스트 컴프리헨션으로 각 텍스트를 순차 임베딩해요. 실무에서는 GPU 병렬 처리로 대체돼요.' },
        { t: 'n = ... ** 0.5 or 1', d: '벡터 길이를 구하는 피타고라스 정리예요. or 1은 길이가 0일 때 ZeroDivisionError를 막는 방어 코드예요.' },
      ],
      why:
        '데이터가 수천~수만 건이면 하나씩 API를 호출하는 건 비효율적이에요. ' +
        '배치로 묶어 호출하면 네트워크 오버헤드가 줄고, GPU 병렬 처리로 인코딩 속도도 최대 100배까지 빨라져요.',
      expectedOutput:
        '[실행] 배치 임베딩\n' +
        '[결과] [[0.707..., 0.707...], [0.0, 1.0]]',
      realWorldUsage:
        '챗봇 지식 베이스 구축 시 10만 개 FAQ를 임베딩할 때, 배치 크기 256으로 나누어 처리해요. ' +
        '이렇게 하면 10분 걸릴 작업이 5초 만에 끝나고, API 비용도 배치 할인이 적용돼서 더 저렴해지는 경우가 많아요.',
      pitfall: '배치 크기가 너무 크면 메모리 부족으로 프로세스가 중단될 수 있어요. GPU 메모리에 맞는 적절한 배치 크기(보통 32~128)를 벤치마크로 찾아야 해요.',
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

print("[실행] 코사인 유사도 계산")
print(f"[결과] {cosine([1, 0], [1, 1]):.3f}")`,
    explain: {
      concept:
        '코사인 유사도는 두 벡터 사이의 각도가 얼마나 작은지를 -1에서 1 사이의 값으로 측정하는 방법이에요. ' +
        '화살표 두 개가 같은 방향을 가리키면 1, 직각이면 0, 정반대면 -1이 나와요. ' +
        '벡터의 길이(크기)가 아니라 방향만 보기 때문에, 긴 문서와 짧은 문서도 공평하게 비교할 수 있어요. ' +
        '분자(내적)를 분모(두 벡터 길이의 곱)로 나누는 것이 핵심 공식이에요. na==0 같은 조건으로 0 벡터 예외 처리를 해서 안전하게 계산해요. ' +
        'na와 nb는 각각 벡터 a, b의 유클리드 길이(L2 노름)를 의미하고, 피타고라스 정리로 제곱합의 제곱근을 구해 계산해요.',
      terms: [
        { t: 'sum(x * y for x, y in zip(a, b))', d: '같은 위치의 성분끼리 곱한 뒤 모두 더하는 내적(dot product) 계산이에요.' },
        { t: 'na, nb', d: '각 벡터의 유클리드 길이예요. 제곱합의 제곱근(피타고라스 정리)으로 구해요.' },
        { t: 'dot / (na * nb)', d: '내적을 두 길이의 곱으로 나누면 코사인 값이 나와요. 수학적으로 cos(θ)와 같아요.' },
        { t: 'if na == 0 or nb == 0', d: '0 벡터가 들어오면 나눗셈 오류를 막기 위해 0.0을 반환하는 예외 처리예요.' },
        { t: 'zip(a, b)', d: '두 리스트를 같은 인덱스끼리 묶어서 반복문에서 동시에 꺼내주는 내장 함수예요.' },
      ],
      why:
        '검색·추천·중복 탐지에서 "의미가 비슷한 것"을 찾을 때 가장 널리 쓰이는 척도예요. ' +
        '키워드 일치로는 "car"와 "automobile"이 다른 문서라고 판단하지만, 임베딩 + 코사인 유사도는 같은 의미라고 정확히 판단해요.',
      expectedOutput:
        '[실행] 코사인 유사도 계산\n' +
        '[결과] 0.707',
      realWorldUsage:
        '문서 표절 검사 시스템에서 한 문서의 각 문장을 다른 모든 문서와 코사인 유사도로 비교해, ' +
        '0.85 이상이면 유사 문장으로 표시하고 원본 출처를 함께 보여줘요. 논문·특허·계약서 검토에 실제로 사용되는 방식이에요.',
      pitfall: '수학적으로 코사인 유사도 범위는 -1~1이지만, 실제 NLP 임베딩은 대부분 양수 방향에 몰려 있어 0~1 사이 값이 대부분이에요. 0.5 이하는 관련 없음, 0.7 이상은 관련 있음 정도로 해석하는 게 실무 기준이에요.',
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

print("[실행] 내적 유사도 Top-2")
print(f"[결과] {dot_top([1, 2], [[1, 0], [0, 2], [1, 1]])}")`,
    explain: {
      concept:
        '내적(dot product) 유사도는 코사인 유사도에서 길이로 나누는 정규화 단계를 생략한 더 빠른 비교 방식이에요. ' +
        '두 벡터의 같은 위치 값들을 곱해서 전부 더하기만 하면 점수가 나오니까 계산이 정말 빨라요. ' +
        'len()과 ** 0.5 연산이 빠져서 대규모 검색에서 속도 차이가 꽤 크게 나지만, 벡터 길이가 제각각이면 긴 문서가 유리해지는 단점이 있어요. ' +
        'scored.sort(reverse=True)로 점수가 큰 순서대로 내림차순 정렬하고, [:k]로 상위 k개만 잘라내는 게 Top-K 검색의 핵심이에요. ' +
        '실무에서는 모든 벡터를 미리 정규화해두면 내적만으로도 코사인 유사도와 동일한 결과를 얻을 수 있어서 성능 최적화에 많이 활용해요.',
      terms: [
        { t: 'sum(q * v for q, v in zip(query, d))', d: '질문 벡터와 문서 벡터의 같은 자리끼리 곱해 더하는 내적 계산이에요.' },
        { t: 'scored.append((i, score))', d: '(문서 인덱스, 점수) 튜플을 리스트에 쌓아서 나중에 정렬할 재료를 모아요.' },
        { t: 'scored.sort(reverse=True)', d: '점수 큰 순서(내림차순)로 정렬해요. lambda로 튜플의 두 번째 요소(점수)를 정렬 키로 지정해요.' },
        { t: '[:k]', d: '정렬된 리스트에서 앞에서 k개만 슬라이싱해서 가져와요. Top-K 결과 추출이에요.' },
      ],
      why:
        '실시간 검색에서는 속도가 생명이에요. 벡터 정규화를 미리 해두면 내적만으로 코사인 유사도와 동일한 순위를 얻을 수 있어서, ' +
        '대규모 검색에서 필수적인 최적화 기법이에요.',
      expectedOutput:
        '[실행] 내적 유사도 Top-2\n' +
        '[결과] [(2, 3), (1, 4)]',
      realWorldUsage:
        '실시간 추천 시스템에서 수백만 개 상품 중 사용자 벡터와 내적이 가장 높은 상위 20개를 10ms 이내에 찾아야 해요. ' +
        '모든 벡터를 정규화해두고 FAISS 같은 GPU 가속 라이브러리로 내적 기반 검색을 하면 수십억 건도 밀리초 단위로 검색할 수 있어요.',
      pitfall: '벡터 길이가 제각각이면 긴 벡터가 무조건 높은 점수를 받게 돼서 공정한 비교가 안 돼요. 벡터를 미리 정규화하거나, 정확도가 더 중요하면 코사인 유사도를 대신 사용하는 게 맞아요.',
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

print("[실행] 인메모리 벡터 검색")
s = InMemStore()
s.add('cat', [1, 0])
print(f"[결과] {s.search([1, 0])}")`,
    explain: {
      concept:
        '인메모리 벡터 저장소(InMemStore)는 문서 텍스트와 임베딩 벡터를 메모리 안에 나란히 저장하고 내적으로 검색하는 작은 데이터베이스예요. ' +
        '실제 벡터DB(Chroma, Pinecone, Weaviate 등)의 핵심 개념을 클래스 하나로 단순화한 버전이에요. ' +
        'add()로 텍스트·벡터 쌍을 추가하고, search()로 질문 벡터를 받아 가장 비슷한 k개의 문서를 찾아요. ' +
        '프로그램을 종료하면 데이터가 사라지는 휘발성 저장소라서, 프로토타입이나 학습용으로 적합해요. ' +
        'zip(self.docs, self.vecs)로 텍스트와 벡터를 같은 인덱스끼리 쌍으로 묶어서 정렬·검색해요.',
      terms: [
        { t: 'self.docs, self.vecs', d: '문서 텍스트와 벡터를 같은 인덱스에 저장하는 병렬 리스트 구조예요.' },
        { t: 'add(text, vec)', d: '텍스트와 벡터 한 쌍을 저장소에 추가하는 메서드예요. append로 리스트 끝에 붙여요.' },
        { t: 'zip(self.docs, self.vecs)', d: '두 리스트를 같은 인덱스끼리 묶어서 (텍스트, 벡터) 튜플의 반복자로 만들어요.' },
        { t: 'search(q, k)', d: '질문 벡터 q와 내적이 가장 큰 k개의 문서 텍스트를 반환하는 검색 메서드예요.' },
      ],
      why:
        'RAG 시스템을 처음 실험할 때 외부 DB 설정 없이 바로 개념을 테스트할 수 있어요. ' +
        '작동 방식을 이해하고 나면 같은 인터페이스로 Pinecone이나 Weaviate 같은 영속적 벡터DB로 교체할 수 있어요.',
      expectedOutput:
        '[실행] 인메모리 벡터 검색\n' +
        "[결과] ['cat']",
      realWorldUsage:
        '프로토타입 단계에서 "이 RAG 아이디어가 동작할까?"를 확인할 때, 외부 서버 설정 없이 InMemStore로 빠르게 실험해요. ' +
        '검증이 끝나면 add()와 search() 인터페이스를 유지한 채 Pinecone 클라이언트로 교체하는 식으로 점진적으로 발전시켜요.',
      pitfall: '프로세스가 종료되면 모든 데이터가 사라져요. 서비스에 배포할 때는 반드시 Pinecone, Chroma, Weaviate 같은 영속적 벡터DB로 교체하거나, 최소한 pickle/json으로 주기적으로 저장하는 로직을 추가해야 해요.',
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

print("[실행] NumPy 행렬 검색")
mat = np.array([[1, 0], [0, 2], [1, 1]])
print(f"[결과] top 인덱스: {search([1, 1], mat)}")`,
    explain: {
      concept:
        'NumPy를 활용한 벡터 검색은 반복문 없이 행렬 연산 한 번으로 질문과 모든 문서의 유사도를 동시에 계산하는 방식이에요. ' +
        'mat.dot(q)는 (N×D) 모양의 문서 행렬과 (D,) 모양의 질문 벡터를 곱해서 N개의 점수를 한 번에 만들어내요. ' +
        'np.argsort(-scores)로 점수가 큰 순서대로 인덱스를 정렬하고, [:k]로 상위 k개만 추출하는 게 핵심이에요. ' +
        'NumPy는 C로 구현된 BLAS 라이브러리를 사용해서, 파이썬 for 루프보다 수십~수백 배 빠르게 대량의 벡터 연산을 처리해요. ' +
        '실무에서는 이 NumPy 기반 방식을 FAISS, ScaNN 같은 전용 벡터 검색 라이브러리로 한 단계 더 고도화해서 사용해요.',
      terms: [
        { t: 'np.array(query)', d: '파이썬 리스트를 NumPy 배열로 변환해서 벡터 연산이 가능하게 만들어요.' },
        { t: 'mat.dot(q)', d: '문서 행렬(N×D)과 질문 벡터(D)를 내적해서 N개의 유사도 점수를 한 번에 계산하는 행렬 곱이에요.' },
        { t: 'np.argsort(-scores)', d: '음수를 취해 내림차순으로 정렬한 뒤 원본 인덱스를 반환하는 함수예요.' },
        { t: 'idx.tolist()', d: 'NumPy 배열을 파이썬 리스트로 변환해 출력이나 후속 처리를 편하게 해줘요.' },
        { t: 'mat: np.ndarray', d: '여러 문서 벡터를 행으로 쌓아 만든 2차원 NumPy 배열이에요. 행렬 연산의 기반이 돼요.' },
      ],
      why:
        '검색 대상이 수천 건만 되어도 파이썬 for 루프로는 너무 느려져요. ' +
        'NumPy의 벡터화 연산은 C 수준의 속도로 처리해서, CPU만으로도 수만 건까지는 충분히 실시간 검색이 가능해요.',
      expectedOutput:
        '[실행] NumPy 행렬 검색\n' +
        '[결과] top 인덱스: [2, 1]',
      realWorldUsage:
        '소규모 RAG 시스템(문서 5만 건 이하)에서는 별도 벡터DB 없이 NumPy로 전체 문서를 메모리에 올려서 검색해요. ' +
        '상품 추천, 유사 뉴스 검색, FAQ 매칭 등에 충분히 실용적이고, 인프라 비용도 들지 않아서 스타트업에서 많이 채택해요.',
      pitfall: '문서가 수십만 건을 넘어가면 NumPy 행렬이 메모리를 너무 많이 차지해서 검색이 불가능해져요. 이때부터는 FAISS 같은 근사 검색(ANN) 라이브러리나 Pinecone 같은 관리형 벡터DB로 전환해야 해요.',
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

print("[실행] Retriever Top-2 검색")
r = Retriever(Store(['cat', 'dog', 'fish'], [[1, 0], [0, 1], [1, 1]]))
print(f"[결과] {r.top_k([1, 0], k=2)}")`,
    explain: {
      concept:
        'Retriever(검색기)는 벡터 저장소(Store)를 감싸서 질문 벡터와 가장 유사한 상위 K개의 문서를 찾아주는 역할을 해요. ' +
        '마치 사서에게 "이 주제에 관한 책 상위 3권만 주세요"라고 부탁하는 것과 같아요. ' +
        'Store는 데이터 보관만 책임지고, Retriever는 검색과 결과 정제를 책임지는 관심사 분리(separation of concerns) 디자인이에요. ' +
        '각 검색 결과에 rank(순위)를 함께 부여해서, 나중에 LLM에 전달할 때 어떤 문서가 더 관련 있는지 알려줄 수 있어요. ' +
        '실무 RAG 파이프라인에서는 Retriever → Reranker → LLM 순서로 결과가 흘러가면서 점점 정교해져요.',
      terms: [
        { t: 'Store', d: '문서 텍스트와 벡터를 보관하고 내적 기반 검색을 제공하는 데이터 계층 클래스예요.' },
        { t: 'Retriever', d: 'Store를 감싸서 검색 결과에 순위를 매기고 정제된 형태로 반환하는 상위 계층 클래스예요.' },
        { t: 'top_k(q_vec, k)', d: '질문 벡터로 가장 유사한 k개의 문서를 순위와 함께 반환하는 메서드예요.' },
        { t: "'rank': i", d: '검색 결과의 순위를 0부터 매겨서 출력에 포함해요. LLM에 컨텍스트 중요도를 전달할 때 써요.' },
      ],
      why:
        'LLM에 관련 없는 문서까지 다 보내면 답변 품질이 떨어지고 비용만 늘어나요. Top-K로 관련성 높은 것만 선별해서 보내면, ' +
        'LLM이 더 정확한 답을 적은 비용으로 생성할 수 있어요.',
      expectedOutput:
        '[실행] Retriever Top-2 검색\n' +
        "[결과] [{'text': 'cat', 'rank': 0}, {'text': 'fish', 'rank': 1}]",
      realWorldUsage:
        '고객 지원 챗봇에서 "환불 정책 알려줘"라는 질문이 들어오면, Retriever가 내부 지식 베이스에서 가장 관련된 정책 문서 3개를 찾아 LLM에 전달하고, ' +
        'LLM은 그 문서들을 참고해서 정확한 환불 절차를 답변으로 생성해요. top_k=3이면 보통 충분한 컨텍스트를 제공할 수 있어요.',
      pitfall: 'k를 너무 작게 하면 정말 필요한 문서가 결과에서 빠질 수 있어요(k=1이면 오답 확률 급증). 반대로 k를 너무 크게 하면 관련 없는 문서까지 LLM에 전달돼서 답변이 흐려지고 토큰 비용도 증가해요. 보통 3~10 사이가 적절해요.',
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

print("[실행] 임계값 0.5로 필터링")
hits = [
  {'text': 'a', 'score': 0.8},
  {'text': 'b', 'score': 0.3},
]
print(f"[결과] {filter_hits(hits)}")`,
    explain: {
      concept:
        '유사도 임계값 필터는 검색 결과 중에서 점수가 일정 수준 미만인 것들을 걸러내서 관련 없는 문서가 답변에 섞이지 않게 하는 안전장치예요. ' +
        '시험 커트라인처럼 기준 이하는 과감히 버려서, LLM이 혼란스러운 정보를 참고하지 않도록 보호해줘요. ' +
        '임계값을 0.5로 설정하면 "반반 이상은 관련 있어야 해"라는 의미이고, 0.7로 높이면 좀 더 엄격해져요. ' +
        'RAG에서 검색된 문서가 실제로 질문과 전혀 관계없을 때, 그냥 LLM에 넘기면 환각(hallucination)이 발생할 수 있어서 이 필터가 중요해요. ' +
        '실무에서는 서비스 성격에 따라 임계값을 튜닝하는데, 정확도가 중요한 의료·법률 분야는 0.7 이상, 일반 검색은 0.3~0.5 정도를 써요.',
      terms: [
        { t: 'min_score: float = 0.5', d: '통과시키는 최소 유사도 점수예요. 이 값 미만이면 결과에서 제외돼요.' },
        { t: "h['score']", d: '각 검색 결과의 유사도 점수예요. 코사인 유사도나 내적 점수를 담는 키예요.' },
        { t: '>= min_score', d: '점수가 임계값 이상인지 비교하는 조건이에요. >= 기호는 "크거나 같다"를 의미해요.' },
        { t: 'out.append(h)', d: '조건을 통과한 결과만 out 리스트에 모아서 최종 결과로 반환해요.' },
      ],
      why:
        '검색 시스템은 질문과 전혀 관계없는 문서도 낮은 점수로 반환할 수 있어요. ' +
        '이걸 그대로 LLM에 보내면 엉뚱한 답변이 나오거나, "문서에 해당 정보가 없습니다"라고 말해야 할 상황에서 억지로 답을 만들어내요.',
      expectedOutput:
        '[실행] 임계값 0.5로 필터링\n' +
        "[결과] [{'text': 'a', 'score': 0.8}]",
      realWorldUsage:
        '기업 내부 규정 검색 챗봇에서 "연차 사용 규정"을 물었을 때, 검색된 문서 중 유사도 0.4 이하는 "이건 연차랑 상관없는 문서"로 판단하고 LLM에 전달하지 않아요. ' +
        '그래야 "연차 규정은 다음과 같습니다"라는 정확한 답변이 나오고, 회식 규정이 답변에 섞이는 일을 막을 수 있어요.',
      pitfall: '임계값을 너무 높게 잡으면 검색 결과가 하나도 없을 수 있어요. 이 경우 "관련 정보를 찾지 못했습니다" 같은 폴백 응답을 준비해 두는 게 좋은 UX 설계예요.',
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

print("[실행] 리랭킹")
print(f"[결과] {rerank('red car', ['a red car', 'blue bus', 'red bus'])}")`,
    explain: {
      concept:
        '리랭킹(reranking)은 1차 검색(내적·코사인 등)으로 찾은 후보 문서들의 순서를 더 정교한 기준으로 다시 매기는 2차 정렬 단계예요. ' +
        '마치 서류 전형 합격자를 면접으로 재평가하는 것처럼, 간단한 1차 필터 후 정밀한 2차 심사를 거치는 거예요. ' +
        '이 예제에서는 질문의 단어가 문서에 몇 개나 들어있는지(keyword match)로 다시 점수를 매겨서 정렬해요. ' +
        '실무에서는 BM25, Cross-Encoder, ColBERT 같은 정교한 리랭커를 사용해서 검색 정확도를 크게 올려요. ' +
        '1차 검색은 속도에 집중하고, 2차 리랭킹은 정확도에 집중하는 2단계 아키텍처가 실무 RAG의 표준이에요.',
      terms: [
        { t: 'query.split(" ")', d: '질문을 공백으로 나눠 단어 리스트로 만들어요. 각 단어가 문서에 있는지 확인하려는 준비예요.' },
        { t: 'if w in doc', d: '질문의 단어가 문서에 포함돼 있으면 점수를 1 올려요. 단순 키워드 매칭이에요.' },
        { t: 'key=score', d: 'sorted의 정렬 기준으로 점수 함수를 지정해요. 점수가 높은 순서로 정렬돼요.' },
        { t: 'reverse=True', d: '내림차순 정렬을 지시하는 옵션이에요. 점수가 높은 문서가 리스트 앞에 오게 해요.' },
      ],
      why:
        '벡터 검색은 속도는 빠르지만 정확도가 떨어지는 경우가 많아요. 리랭킹으로 상위 후보들을 정밀 재평가하면, ' +
        '속도와 정확도를 둘 다 잡는 하이브리드 검색이 가능해져요.',
      expectedOutput:
        '[실행] 리랭킹\n' +
        "[결과] ['a red car', 'red bus', 'blue bus']",
      realWorldUsage:
        '법률 문서 검색 플랫폼에서 1차로 벡터 검색으로 100개 후보를 빠르게 추리고, ' +
        '2차로 Cross-Encoder 리랭커(BERT 기반)가 질문과 각 문서를 정밀 비교해서 최종 상위 5개를 LLM에 전달해요. ' +
        '이렇게 하면 100만 문서 중에서도 0.5초 안에 정확한 조항을 찾을 수 있어요.',
      pitfall: '리랭커가 너무 무거우면(예: 대형 Cross-Encoder) 2차 정렬에 시간이 오래 걸려서 전체 응답 속도가 느려져요. 리랭킹 대상 문서 수를 20~50개로 제한하고, 빠른 리랭커를 선택하는 게 중요해요.',
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

print("[실행] MMR 다양성 재정렬")
print(f"[결과] {mmr([1, 0], ['a', 'b', 'c'], [[1, 0], [1, 0], [0, 1]])}")`,
    explain: {
      concept:
        'MMR(Maximal Marginal Relevance)은 검색 결과가 서로 너무 비슷하지 않도록 다양성까지 고려해서 순서를 정하는 알고리즘이에요. ' +
        '사진첩에서 비슷한 사진만 잔뜩 보여주는 대신 다양한 구도의 사진을 골라주는 것과 같아요. ' +
        '점수 = 관련도(rel) - 가중치(0.5) × 기존 선택과의 최대 유사도(div) 공식으로 계산해요. ' +
        '관련도는 높을수록 좋고, 중복도(div)는 낮을수록 좋아서, 둘 사이의 균형을 가중치로 조절해요. ' +
        '실무에서는 사용자에게 다양한 관점의 정보를 제공해야 할 때(뉴스 추천, 연구 문헌 검색 등) MMR을 적극 활용해요.',
      terms: [
        { t: 'rel', d: '질문 벡터와 후보 문서 벡터의 내적 점수예요. 질문과 얼마나 관련 있는지 나타내요.' },
        { t: 'div', d: '이미 선택된 문서들 중 가장 높은 내적 점수예요. 새 문서가 기존 선택과 얼마나 겹치는지 나타내요.' },
        { t: 'score = rel - 0.5 * div', d: '관련도에서 중복도를 빼는 MMR 공식이에요. 0.5는 다양성 가중치로, 높을수록 덜 겹치는 결과를 선호해요.' },
        { t: 'pool.remove(best_i)', d: '선택된 문서를 후보 풀에서 제거해서 중복 선택을 방지해요.' },
        { t: 'picked.append(best_i)', d: '최고 점수 문서의 인덱스를 선택 목록에 추가해요.' },
      ],
      why:
        '일반 Top-K 검색은 질문과 관련됐지만 서로 비슷한 문서만 잔뜩 보여줘요. ' +
        'MMR은 관련도는 유지하면서도 결과의 다양성을 확보해서 사용자에게 더 풍부한 정보를 제공할 수 있어요.',
      expectedOutput:
        '[실행] MMR 다양성 재정렬\n' +
        "[결과] ['a', 'c']",
      realWorldUsage:
        '뉴스 추천 시스템에서 "AI"를 검색하면, 기본 검색은 ChatGPT 관련 기사만 10개 보여줄 수 있어요. ' +
        'MMR을 적용하면 ChatGPT, 로봇공학, AI 윤리, AI 의료 등 다양한 각도의 AI 기사를 골고루 보여줘서 사용자가 더 넓은 시야를 얻을 수 있어요.',
      pitfall: '가중치(0.5)를 너무 크게 설정하면 관련도가 낮은데 안 겹친다는 이유로 엉뚱한 문서가 상위에 올라올 수 있어요. 서비스 성격에 따라 0.3~0.7 사이에서 A/B 테스트로 최적값을 찾는 게 일반적이에요.',
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

print("[실행] 하이브리드 검색")
print(f"[결과] {hybrid({'a': 0.9, 'b': 0.1}, {'a': 0.2, 'b': 0.8})}")`,
    explain: {
      concept:
        '하이브리드 검색은 키워드 기반 검색(lex)과 의미 기반 검색(sem)의 점수를 가중치로 섞어서 최종 순위를 매기는 방법이에요. ' +
        '마치 식당을 고를 때 "맛 점수"와 "가성비 점수"를 가중 평균 내서 최종 순위를 정하는 것과 같아요. ' +
        'set(lex) | set(sem)으로 두 소스의 문서 ID 합집합을 구해서, 한쪽에만 있는 문서도 놓치지 않아요. ' +
        'w=0.5면 키워드와 의미 점수를 반반 섞고, w=0.7이면 키워드에 더 무게를 둬요. ' +
        '실무에서는 키워드 검색(BM25)의 정확한 매칭 능력과 벡터 검색의 의미적 유연성을 결합해서 서로의 약점을 보완해요.',
      terms: [
        { t: 'lex, sem', d: 'lex는 키워드 매칭 점수, sem은 임베딩 벡터 유사도 점수를 담은 딕셔너리예요.' },
        { t: 'w * lex + (1 - w) * sem', d: '두 점수를 가중치 w와 (1-w)로 가중 평균 내는 하이브리드 공식이에요.' },
        { t: 'set(lex) | set(sem)', d: '두 딕셔너리 키의 합집합을 구해서 모든 후보 문서를 빠짐없이 포함해요.' },
        { t: 'lex.get(i, 0.0)', d: '키가 없으면 기본값 0.0을 반환해서 한쪽에만 있는 문서도 안전하게 처리해요.' },
        { t: 'scored.sort(reverse=True)', d: '최종 점수 내림차순으로 통합 순위를 정렬해요.' },
      ],
      why:
        '키워드 검색은 정확한 단어 매칭에 강하지만 동의어에 약하고, 벡터 검색은 의미 파악에 강하지만 고유명사·약어에 약해요. ' +
        '둘을 섞으면 서로의 약점을 보완한 더 강력한 검색이 가능해져요.',
      expectedOutput:
        '[실행] 하이브리드 검색\n' +
        "[결과] [('a', 0.55), ('b', 0.45)]",
      realWorldUsage:
        '전자상거래 검색에서 "노트북"(키워드)과 "랩톱"(의미적 동의어)을 모두 잡아내야 해요. ' +
        'BM25로 "노트북" 상품을 잡고, 벡터 검색으로 "랩톱" 상품까지 추가로 잡은 뒤, 하이브리드 점수로 통합 순위를 매겨서 빠짐없는 검색 결과를 제공해요.',
      pitfall: '두 점수의 분포와 단위가 다르면(예: 키워드 점수는 0~1, 벡터 점수는 0~100), 한쪽이 완전히 지배해버려요. 가중 평균 전에 Min-Max 정규화나 Z-점수 정규화로 점수 분포를 맞추는 게 거의 필수예요.',
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

print("[실행] RRF 순위 병합")
print(f"[결과] {rrf([['a', 'b', 'c'], ['b', 'a', 'd']])}")`,
    explain: {
      concept:
        'RRF(Reciprocal Rank Fusion)는 서로 다른 검색 시스템의 결과를 점수가 아닌 순위만 보고 합치는 방법이에요. ' +
        '마치 여러 심사위원의 등수를 합산해서 최종 순위를 매기는 올림픽 채점 방식과 똑같아요. ' +
        '1/(c + pos) 공식으로 순위를 점수로 변환하는데, pos가 작을수록(1등에 가까울수록) 더 큰 점수를 받아요. ' +
        'c=60은 논문에서 검증된 표준 상수로, 이 값을 쓰면 여러 실험에서 안정적인 성능을 보여줘요. ' +
        '점수 단위가 완전히 다른 검색기(예: BM25는 0~100, 벡터 검색은 0~1)도 순위만 있으면 공정하게 합칠 수 있다는 게 RRF의 가장 큰 장점이에요.',
      terms: [
        { t: 'rankings', d: '여러 검색 결과의 순위 리스트예요. 각각의 내부 순서가 중요해요.' },
        { t: 'enumerate(ranking, start=1)', d: '1부터 시작하는 순위(pos)를 각 문서 ID와 함께 꺼내요. RRF는 1-indexed 순위를 사용해요.' },
        { t: '1.0 / (c + pos)', d: 'RRF 핵심 공식이에요. 순위가 낮을수록(pos 작을수록) 점수가 커지는 역수 관계예요.' },
        { t: "scores.get(doc_id, 0.0)", d: '기존 누적 점수에 새 점수를 더하는 누적 합산 로직이에요. 처음 보는 ID면 0.0에서 시작해요.' },
        { t: 'c: int = 60', d: '순위 점수의 감쇠 속도를 조절하는 상수예요. 작으면 1등 보너스가 커지고, 크면 순위 간 차이가 줄어요.' },
      ],
      why:
        '정규화 없이도 다른 점수 체계의 결과를 공정하게 통합할 수 있어요. ' +
        'BM25 + 벡터 검색 + PageRank 점수를 RRF로 합치면, 각 시스템의 장점을 살린 강력한 통합 검색이 가능해져요.',
      expectedOutput:
        "[실행] RRF 순위 병합\n[결과] ['a', 'b', 'd', 'c']",
      realWorldUsage:
        '대형 검색 포털에서 키워드 검색 결과, 벡터 검색 결과, 최신성 점수를 RRF로 통합해서 최종 랭킹을 만들어요. ' +
        '각 검색기를 독립적으로 개선해도 통합 점수 체계를 건드릴 필요가 없어서 유지보수가 쉬워져요.',
      pitfall: 'c값이 너무 작으면(예: 1~10) 1등 문서에 과도한 가중치가 부여돼서 다양한 관점이 사라져요. 논문에서 검증된 c=60을 기본값으로 쓰는 것을 권장해요.',
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

print("[실행] BM25 점수 계산")
corpus = ['red car fast', 'blue car slow', 'red bus big']
print(f"[결과] {bm25_score('red', corpus[0], corpus):.3f}")`,
    explain: {
      concept:
        'BM25는 TF-IDF를 개선한 키워드 검색 점수 알고리즘으로, 단어 빈도(tf)와 문서 내 희귀도(idf)를 조합해 문서 관련도를 점수로 나타내요. ' +
        'TF-IDF와 달리 단어가 반복해서 나올 때 점수가 무한정 올라가지 않도록 감쇠 곡선을 적용하는 게 핵심 차이예요. ' +
        'k1=1.5는 단어 반복 효과를 얼마나 빨리 포화시킬지 결정하고, b=0.75는 긴 문서에 대한 길이 페널티 강도예요. ' +
        'idf 계산에 log 안에 +1을 더해서, 모든 문서에 나오는 단어라도 점수가 0이 아니라 작은 양수로 나오게 해요. ' +
        '실무에서는 Elasticsearch, Lucene 같은 검색 엔진의 기본 스코어링 알고리즘이 바로 이 BM25예요.',
      terms: [
        { t: 'k1, b', d: 'k1은 단어 반복에 대한 포화 속도(보통 1.2~2.0), b는 문서 길이 정규화 강도(보통 0.75)예요.' },
        { t: 'tf = tf_raw * (k1 + 1) / (...)', d: '원본 빈도를 BM25 특유의 감쇠 곡선으로 변환해요. 반복이 많아도 점수가 급격히 커지지 않아요.' },
        { t: 'idf', d: 'Inverse Document Frequency. 많은 문서에 나오면 점수가 낮고, 희귀하면 높아지는 단어 특이도 점수예요.' },
        { t: 'tf * idf', d: '빈도 점수와 희귀도 점수를 곱해서 최종 BM25 점수를 만들어요.' },
      ],
      why:
        'RAG의 하이브리드 검색에서 키워드 매칭 점수를 구할 때 TF-IDF보다 BM25가 훨씬 정확해요. ' +
        '특히 긴 문서에서 키워드가 여러 번 나와도 점수가 과도하게 올라가지 않아서 더 공정한 검색이 가능해요.',
      expectedOutput:
        '[실행] BM25 점수 계산\n' +
        '[결과] 0.507',
      realWorldUsage:
        '회사 위키 검색 시스템에서 "API 문서"를 검색하면, BM25가 단순 TF-IDF 대비 더 지능적으로 동작해요. ' +
        '100번 "API"가 나온 초장문 문서보다, 3번 나왔지만 전체가 API에 집중된 문서를 더 높게 평가해줘서 검색 품질이 훨씬 좋아져요.',
      pitfall: 'BM25는 단어의 형태만 보고 의미는 보지 못해요. "run"과 "running"을 완전히 다른 단어로 취급하기 때문에, 검색 품질을 높이려면 형태소 분석(stemming)이나 Lemmatization 전처리를 함께 적용해야 해요.',
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

print("[실행] 벡터 저장소 저장 후 불러오기")
save_store(['고양이', '강아지'], [[1.0, 0.0], [0.0, 1.0]], 'store.json')
docs, vecs = load_store('store.json')
print(f"[결과] {docs}")`,
    explain: {
      concept:
        '벡터 저장소 영속화(persistence)는 메모리에 있는 임베딩 벡터와 문서를 파일로 저장하고 나중에 다시 불러오는 방법이에요. ' +
        '숙제를 파일로 저장해두고 다음 날 이어서 하는 것처럼, 프로그램을 재시작해도 임베딩을 다시 계산할 필요가 없어져요. ' +
        'JSON 형식으로 저장하면 사람이 읽을 수 있고 다양한 언어에서 쉽게 불러올 수 있어요. ' +
        'ensure_ascii=False 옵션은 한글·일본어·이모지 같은 비ASCII 문자를 유니코드 이스케이프(\\uXXXX) 없이 그대로 저장해줘요. ' +
        '다만 JSON은 대용량 벡터(수만 건 이상)에 적합하지 않아서, 규모가 커지면 SQLite, Chroma, Pinecone 등 전용 저장소로 전환해야 해요.',
      terms: [
        { t: 'json.dump(obj, f)', d: '파이썬 딕셔너리·리스트 객체를 JSON 문자열로 변환해 파일에 쓰는 함수예요.' },
        { t: 'ensure_ascii=False', d: '한글 같은 유니코드 문자를 \\uXXXX 이스케이프 없이 원래 글자 그대로 저장하는 옵션이에요.' },
        { t: 'json.load(f)', d: 'JSON 파일을 읽어서 파이썬 딕셔너리·리스트 객체로 복원하는 함수예요.' },
        { t: "data['docs'], data['vecs']", d: 'JSON에서 로드한 딕셔너리에서 문서 리스트와 벡터 리스트를 각각 추출해요.' },
        { t: 'with open(...) as f', d: '파일을 안전하게 열고 작업 후 자동으로 닫아주는 컨텍스트 매니저 문법이에요.' },
      ],
      why:
        '임베딩 계산은 시간과 비용이 많이 들어요. 한 번 계산한 벡터를 파일로 저장해두면, ' +
        '서버 재시작이나 코드 수정 후에도 다시 계산하지 않고 바로 불러와서 쓸 수 있어 시간과 비용을 아껴요.',
      expectedOutput:
        '[실행] 벡터 저장소 저장 후 불러오기\n' +
        "[결과] ['고양이', '강아지']",
      realWorldUsage:
        '개인 프로젝트나 소규모 PoC에서 소량의 임베딩(수천 건)을 저장할 때 JSON을 써요. ' +
        '예를 들어 블로그 포스트 500개의 임베딩을 precompute해서 JSON으로 저장해두면, 검색 기능을 빠르게 프로토타입할 수 있어요.',
      pitfall: '벡터가 수만 건을 넘어가면 JSON 파일이 수백 MB로 커져서 로딩에 수 초~수십 초가 걸리고 메모리도 많이 차지해요. 대용량 데이터에는 반드시 SQLite + numpy 저장이나 Chroma 같은 전용 벡터DB로 이전해야 해요.',
    },
  },
];
