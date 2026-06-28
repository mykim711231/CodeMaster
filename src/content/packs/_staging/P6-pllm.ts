import type { Snippet } from '../../types';

export const pythonLLM: Snippet[] = [
  {
    id: 'pllm-autotokenizer-load',
    lang: 'python',
    title: 'AutoTokenizer 불러오기',
    file: 'tokenizer_load.py',
    code: `from transformers import AutoTokenizer

print("[실행] AutoTokenizer 로딩 시작")
tok = AutoTokenizer.from_pretrained('bert-base-uncased')
print(f"[결과] vocab_size: {tok.vocab_size}")`,
    explain: {
      concept:
        'AutoTokenizer는 모델 이름만 넣으면 그 모델에 딱 맞는 토큰화 방식을 알아서 골라주는 도구예요. ' +
        '사전을 통째로 가져오는 것처럼, BERT가 쓰는 단어 사전 3만여 개를 한 번에 다운로드해요. ' +
        '모델마다 글자를 쪼개는 규칙이 다르기 때문에, 이 기능이 없으면 여러분이 직접 모델별 규칙을 찾아서 설정해야 해요. ' +
        '실무에서는 from_pretrained 하나로 허깅페이스 허브에 올라온 수천 개의 토크나이저를 바로 사용할 수 있어서 정말 편리해요. ' +
        'vocab_size를 찍어보면 모델이 얼마나 많은 단어를 아는지 한눈에 알 수 있어요.',
      terms: [
        { t: 'from transformers import AutoTokenizer', d: '허깅페이스 라이브러리에서 토크나이저 자동 선택 클래스를 가져와요.' },
        { t: 'AutoTokenizer', d: '모델 이름만 넣으면 알맞은 토크나이저를 골라주는 지능형 클래스예요.' },
        { t: 'from_pretrained()', d: '인터넷에서 미리 학습된 토크나이저 설정과 사전을 한꺼번에 가져오는 메서드예요.' },
        { t: "'bert-base-uncased'", d: '허깅페이스 허브에 등록된 BERT 기본 모델의 이름이에요. 대소문자를 구분하지 않는(uncased) 버전이에요.' },
        { t: 'vocab_size', d: '이 토크나이저가 알고 있는 전체 토큰 개수예요. BERT uncased는 보통 30,522개예요.' },
      ],
      why:
        'LLM을 실무에 도입할 때 가장 먼저 하는 일이 토크나이저 로딩이에요. ' +
        '챗봇, 문서 분석, 번역 등 어떤 NLP 작업이든 시작은 토크나이저 불러오기부터예요.',
      expectedOutput:
        '[실행] AutoTokenizer 로딩 시작\n' +
        '[결과] vocab_size: 30522',
      realWorldUsage:
        '실제 서비스에서는 사용자 입력을 토큰으로 분해한 뒤 LLM에 전달해요. ' +
        '가령 고객센터 챗봇에서 "환불해줘"라는 문장이 들어오면, 이 토크나이저가 숫자로 바꿔서 모델에게 넘기는 식이에요.',
      pitfall: '모델 이름을 잘못 적으면(from_pretrained에 없는 이름을 주면) 인터넷에서 찾지 못해 OSError가 발생해요.',
    },
  },
  {
    id: 'pllm-tokenize-text',
    lang: 'python',
    title: '텍스트 토큰화',
    file: 'tokenize.py',
    code: `from transformers import AutoTokenizer

print("[실행] 토크나이저 준비 후 토큰화")
tok = AutoTokenizer.from_pretrained('bert-base-uncased')
enc = tok('hello world')
print(f"[결과] input_ids: {enc['input_ids']}")`,
    explain: {
      concept:
        '토큰화(tokenization)는 사람이 읽는 문장을 모델이 이해할 수 있는 숫자로 바꾸는 작업이에요. ' +
        '"hello world"라는 문장을 넣으면, 각 단어(또는 부분 단어)를 사전에서 찾아 번호로 매겨줘요. ' +
        '모델은 글자를 직접 읽지 못하고 오직 숫자만 이해할 수 있기 때문에 이 과정이 반드시 필요해요. ' +
        '실무에서는 사용자 입력, 학습 데이터, API 요청 등 모델에 들어가는 모든 텍스트가 이 토큰화 단계를 거쳐요. ' +
        'input_ids는 이렇게 바뀐 토큰 번호들의 리스트로, 바로 모델에 넣을 수 있는 형태예요.',
      terms: [
        { t: 'enc = tok(\'hello world\')', d: '문자열을 넣어 토큰 번호 묶음으로 변환해요. 결과는 딕셔너리 형태로 돌아와요.' },
        { t: 'input_ids', d: '변환된 각 토큰의 사전 번호가 담긴 리스트예요. 모델이 실제로 읽는 입력값이에요.' },
        { t: "enc['input_ids']", d: '딕셔너리에서 input_ids 키로 토큰 번호 리스트를 꺼내는 문법이에요.' },
        { t: 'AutoTokenizer', d: '모델 이름으로 알맞은 토크나이저를 자동 선택하는 클래스예요.' },
      ],
      why:
        '모델은 글자를 그대로 못 읽고 숫자만 읽을 수 있어서 이 변환이 필수예요. ' +
        'OpenAI API를 호출할 때도 내부에서는 이런 토큰화가 일어나고 있어요.',
      expectedOutput:
        '[실행] 토크나이저 준비 후 토큰화\n' +
        '[결과] input_ids: [101, 7592, 2088, 102]',
      realWorldUsage:
        '챗봇 서비스에서 사용자가 "오늘 날씨 어때?"라고 입력하면, 이 함수를 거쳐 [101, ...] 같은 숫자 배열로 바뀌고, ' +
        '그 숫자 배열이 LLM의 입력으로 들어가요. 여러분이 ChatGPT에 글을 입력할 때도 내부에서는 이런 일이 일어나고 있어요.',
      pitfall: "tok() 호출 결과는 딕셔너리예요. 그냥 print(tok('hello')) 하면 객체 정보가 나오니까, 반드시 ['input_ids']로 값을 꺼내야 해요.",
    },
  },
  {
    id: 'pllm-detokenize',
    lang: 'python',
    title: '토큰을 글자로 복원',
    file: 'decode.py',
    code: `from transformers import AutoTokenizer

print("[실행] 토큰화 후 decode 복원")
tok = AutoTokenizer.from_pretrained('bert-base-uncased')
ids = tok('hello world')['input_ids']
print(f"[결과] decode: {tok.decode(ids)}")`,
    explain: {
      concept:
        'decode는 숫자로 된 토큰 번호들을 다시 사람이 읽을 수 있는 글자로 되돌리는 작업이에요. ' +
        '암호문을 원래 문장으로 해독하는 것과 똑같아요. 모델이 예측한 결과가 토큰 번호로 나오는데, ' +
        '그걸 그대로 두면 무슨 뜻인지 알 수 없잖아요? 그래서 decode로 다시 문자열로 복원해야 해요. ' +
        '실무에서는 LLM이 생성한 텍스트를 최종 사용자에게 보여주기 전에 반드시 decode 과정을 거쳐요. ' +
        '챗봇의 답변, 번역 결과, 요약문 등 모든 출력이 이 decode를 통해 사람이 읽는 형태가 돼요.',
      terms: [
        { t: 'tok.decode(ids)', d: '토큰 번호 리스트를 받아 원래 문자열로 합쳐주는 메서드예요.' },
        { t: 'ids', d: '앞서 tok()으로 얻은 input_ids 리스트를 담은 변수예요.' },
        { t: "tok('hello world')['input_ids']", d: '문장 → 토큰 번호 리스트로 변환하는 한 줄짜리 파이프라인이에요.' },
        { t: 'AutoTokenizer.from_pretrained', d: '모델에 맞는 토크나이저를 불러오는 정적 메서드예요.' },
      ],
      why:
        'LLM이 출력한 토큰 번호는 그냥 숫자 덩어리라서 사용자에게 보여주려면 decode가 필수예요. ' +
        'GPT가 문장을 생성할 때도 내부적으로는 토큰 ID를 만들고 decode로 바꿔서 화면에 표시해요.',
      expectedOutput:
        '[실행] 토큰화 후 decode 복원\n' +
        '[결과] decode: hello world',
      realWorldUsage:
        '번역 서비스에서 "good morning"을 프랑스어로 번역하면, 모델 내부에서 토큰 ID가 생성되고 ' +
        '이 decode 과정을 거쳐 "bonjour"라는 문자열이 최종 출력돼요. 번역·요약·챗봇 모두 decode 없이는 동작하지 않아요.',
      pitfall: '기본 decode는 [CLS], [SEP] 같은 특수 토큰까지 복원해요. 깔끔한 출력을 원하면 decode(ids, skip_special_tokens=True)를 사용하세요.',
    },
  },
  {
    id: 'pllm-special-tokens',
    lang: 'python',
    title: '특수 토큰 확인',
    file: 'special_tokens.py',
    code: `from transformers import AutoTokenizer

print("[실행] 특수 토큰 포함하여 토큰화")
tok = AutoTokenizer.from_pretrained('bert-base-uncased')
enc = tok('hello', add_special_tokens=True)
tokens = tok.convert_ids_to_tokens(enc['input_ids'])
print(f"[결과] tokens: {tokens}")`,
    explain: {
      concept:
        '특수 토큰(special token)은 문장의 시작과 끝, 구분을 표시하는 약속된 표지판이에요. ' +
        'BERT 계열 모델은 [CLS]로 문장 시작을, [SEP]로 문장 끝이나 구분을 나타내요. ' +
        '책의 표지와 목차처럼 모델이 "여기서 문장이 시작되고 여기서 끝나"라고 인식하게 도와줘요. ' +
        '실무에서는 add_special_tokens=True가 기본값이며, 이 특수 토큰이 있어야 모델이 문장 구조를 제대로 이해해요. ' +
        'convert_ids_to_tokens로 번호를 실제 토큰 글자로 바꿔보면 [CLS], [SEP] 같은 표지가 보여서 이해하기 쉬워요.',
      terms: [
        { t: 'add_special_tokens=True', d: '문장 앞뒤에 [CLS], [SEP] 같은 특수 토큰을 자동으로 추가해요. 기본값이 True예요.' },
        { t: 'convert_ids_to_tokens', d: '토큰 번호 리스트를 실제 토큰 문자열 리스트로 바꿔주는 메서드예요.' },
        { t: "enc['input_ids']", d: '문장을 토큰화한 번호 리스트예요. 특수 토큰이 포함된 상태예요.' },
        { t: "'bert-base-uncased'", d: '대소문자 구분 없는 BERT 기본 모델이에요. 대문자를 소문자로 바꿔 처리해요.' },
      ],
      why:
        'BERT 같은 양방향 모델은 [CLS] 토큰의 출력 벡터로 문장 전체 의미를 표현해요. ' +
        '이걸 빼면 분류 정확도가 10% 이상 떨어질 수 있어요.',
      expectedOutput:
        '[실행] 특수 토큰 포함하여 토큰화\n' +
        "[결과] tokens: ['[CLS]', 'hello', '[SEP]']",
      realWorldUsage:
        '감성 분석 서비스에서 "이 영화 재미있어요"라는 리뷰를 분류할 때, ' +
        '내부적으로 [CLS] 토큰의 벡터를 뽑아서 긍정/부정을 판별해요. [CLS]가 없으면 분류 성능이 크게 떨어져요.',
      pitfall: '특수 토큰을 생략하면(add_special_tokens=False) 모델 학습 때와 입력 형태가 달라져 결과가 이상하게 나올 수 있어요. 학습과 추론은 같은 토큰화 방식을 써야 해요.',
    },
  },
  {
    id: 'pllm-padding',
    lang: 'python',
    title: '패딩으로 길이 맞추기',
    file: 'padding.py',
    code: `from transformers import AutoTokenizer

print("[실행] 두 문장 패딩 처리")
tok = AutoTokenizer.from_pretrained('bert-base-uncased')
batch = tok(['hi', 'hello world'], padding=True)
print(f"[결과] padded ids: {batch['input_ids']}")`,
    explain: {
      concept:
        '패딩(padding)은 길이가 다른 여러 문장을 한 번에 처리할 수 있도록 가장 긴 문장 길이에 맞춰 짧은 문장 뒤에 0을 채우는 작업이에요. ' +
        '줄을 설 때 키가 다른 사람들에게 발판을 깔아 높이를 맞추는 것과 같은 원리예요. ' +
        '딥러닝 모델은 배치(batch) 단위로 한 번에 처리하기 때문에, 배치 안의 모든 문장 길이가 같아야 계산이 가능해요. ' +
        '실무에서는 수천 개의 댓글을 한 번에 감성 분석할 때 이 padding이 반드시 필요하고, 안 그러면 텐서 크기가 달라 오류가 발생해요.',
      terms: [
        { t: 'padding=True', d: '가장 긴 문장에 맞춰 짧은 문장 뒤를 0으로 채워주는 옵션이에요. 배치 처리를 가능하게 해줘요.' },
        { t: "['hi', 'hello world']", d: '길이가 다른 두 문장을 리스트로 묶어 한 번에 토큰화하는 예시예요.' },
        { t: "batch['input_ids']", d: '패딩이 적용된 토큰 번호 리스트예요. 짧은 문장은 뒤쪽이 0으로 채워져 있어요.' },
        { t: 'tok()', d: '문자열을 토큰화하는 AutoTokenizer의 호출이에요. 리스트를 넘기면 배치 처리도 해줘요.' },
      ],
      why:
        'GPU는 병렬 연산에 강하지만, 입력 텐서의 모든 축 크기가 같아야 해요. ' +
        'padding으로 길이를 통일하지 않으면 배치 처리가 불가능해지고, 한 문장씩 처리해야 해서 수백 배 느려져요.',
      expectedOutput:
        '[실행] 두 문장 패딩 처리\n' +
        '[결과] padded ids: [[101, 7632, 102, 0, 0], [101, 7592, 2088, 102, 0]]',
      realWorldUsage:
        '전자상거래 리뷰 10만 건의 감성을 분류할 때, 모든 리뷰를 padding으로 길이를 맞춘 뒤 GPU 배치로 한 번에 추론해요. ' +
        '이때 배치 크기를 64로 설정하면 한 번에 64개씩 병렬 처리되면서 수천 배 빨라져요.',
      pitfall: '패딩으로 채워진 0도 모델이 함께 계산하기 때문에, 필요 이상으로 긴 패딩은 GPU 메모리와 시간을 낭비해요. attention_mask를 함께 사용해 패딩 부분을 무시하는 게 정석이에요.',
    },
  },
  {
    id: 'pllm-truncation',
    lang: 'python',
    title: '잘라내기(truncation)',
    file: 'truncation.py',
    code: `from transformers import AutoTokenizer

print("[실행] 긴 문장 truncation 적용")
tok = AutoTokenizer.from_pretrained('bert-base-uncased')
enc = tok('a ' * 1000, truncation=True, max_length=10)
print(f"[결과] 토큰 개수: {len(enc['input_ids'])}")`,
    explain: {
      concept:
        'truncation(잘라내기)은 모델이 처리할 수 있는 최대 토큰 수를 넘는 긴 입력을 정해진 길이에서 자르는 기능이에요. ' +
        'BERT는 최대 512토큰까지만 처리할 수 있는데, 그보다 긴 글은 뒤를 잘라 버려요. ' +
        '긴 소설을 요약할 때 첫 장만 읽는 것과 비슷해요 - 전체를 다 볼 수 없으니 제한된 분량만 보는 거죠. ' +
        '실무에서는 뉴스 기사, 사용자 리뷰, 법률 문서처럼 길이가 제각각인 데이터를 다룰 때 항상 truncation을 걸어줘요.',
      terms: [
        { t: 'truncation=True', d: 'max_length를 초과하는 입력을 지정된 길이에서 잘라내는 옵션이에요.' },
        { t: 'max_length=10', d: '최대로 허용할 토큰 개수예요. 여기선 설명을 위해 작게 잡았지만, BERT는 보통 512까지 설정해요.' },
        { t: "'a ' * 1000", d: '문자열을 1000번 반복해 인위적으로 긴 입력을 만드는 파이썬 문법이에요.' },
        { t: 'len(enc[\'input_ids\'])', d: '잘라낸 후 실제 토큰 개수를 확인해요. 특수 토큰이 포함돼 max_length보다 살짝 많을 수 있어요.' },
      ],
      why:
        '모든 트랜스포머 모델은 최대 입력 길이(context window)가 정해져 있어요. ' +
        'GPT-4는 128K, BERT는 512토큰 등 모델마다 다르고, 넘으면 무조건 잘라야 해요.',
      expectedOutput:
        '[실행] 긴 문장 truncation 적용\n' +
        '[결과] 토큰 개수: 10',
      realWorldUsage:
        '법률 계약서 같은 100페이지짜리 문서를 분석할 때, 전체를 한 번에 넣을 수 없으니 ' +
        '문서를 청크로 나누고 각 청크마다 truncation을 걸어 모델에 넣어요. 이를 위해 RAG(검색 증강 생성) 기법을 함께 사용해요.',
      pitfall: 'truncation은 기본적으로 앞쪽을 남기고 뒤를 잘라요. 중요한 정보가 문서 뒤쪽에 있다면 잘려나갈 수 있어서, 청크 분할 전략을 먼저 세우는 게 좋아요.',
    },
  },
  {
    id: 'pllm-return-tensors',
    lang: 'python',
    title: '텐서로 변환',
    file: 'tensors.py',
    code: `from transformers import AutoTokenizer

print("[실행] PyTorch 텐서로 변환")
tok = AutoTokenizer.from_pretrained('bert-base-uncased')
enc = tok('hello world', return_tensors='pt')
print(f"[결과] 텐서 모양: {enc['input_ids'].shape}")`,
    explain: {
      concept:
        'return_tensors는 토크나이저 결과를 단순 리스트 대신 딥러닝 프레임워크가 바로 계산할 수 있는 텐서로 만들어줘요. ' +
        '텐서(tensor)는 모델이 실제 연산하는 다차원 숫자 배열이에요 - 리스트는 그냥 데이터지만, 텐서는 GPU에서 병렬로 계산할 수 있어요. ' +
        "실무에서는 거의 항상 return_tensors='pt'(PyTorch)나 'tf'(TensorFlow)를 지정해서 곧바로 모델에 넣어요. " +
        '.shape를 찍어보면 (배치 크기, 토큰 수) 형태의 모양을 확인할 수 있어서 디버깅에 큰 도움이 돼요.',
      terms: [
        { t: "return_tensors='pt'", d: '결과를 PyTorch 텐서로 변환해요. \'tf\'를 쓰면 TensorFlow 텐서가 반환돼요.' },
        { t: '.shape', d: '텐서의 각 차원 크기를 튜플로 보여줘요. 예: (1, 5)는 1문장, 5토큰을 의미해요.' },
        { t: "enc['input_ids']", d: '텐서 형태로 변환된 토큰 번호예요. 모델에 바로 넣을 수 있는 상태예요.' },
        { t: 'from_pretrained', d: '사전 학습된 토크나이저 설정과 사전을 불러오는 메서드예요.' },
      ],
      why:
        '모델은 파이썬 리스트를 직접 계산하지 못해요. PyTorch나 TensorFlow 텐서로 입력을 받아 GPU에서 행렬 연산을 수행해요. ' +
        'return_tensors는 이 변환을 자동으로 해주는 편의 기능이에요.',
      expectedOutput:
        '[실행] PyTorch 텐서로 변환\n' +
        '[결과] 텐서 모양: torch.Size([1, 5])',
      realWorldUsage:
        '실제 LLM 추론 서버에서는 API 요청으로 들어온 텍스트를 토큰화하고 즉시 GPU 텐서로 변환해서 모델에 밀어 넣어요. ' +
        '이 변환 과정이 한 번이라도 빠지면 CUDA 오류가 발생하면서 서비스가 중단돼요.',
      pitfall: "'pt'는 PyTorch, 'tf'는 TensorFlow 전용이에요. 모델과 프레임워크가 일치하지 않으면 타입 오류가 발생하니까 주의하세요.",
    },
  },
  {
    id: 'pllm-automodel-load',
    lang: 'python',
    title: 'AutoModel 불러오기',
    file: 'model_load.py',
    code: `from transformers import AutoModel

print("[실행] AutoModel 로딩 시작")
model = AutoModel.from_pretrained('bert-base-uncased')
print(f"[결과] hidden_size: {model.config.hidden_size}")`,
    explain: {
      concept:
        'AutoModel은 AutoTokenizer처럼 모델 이름만 넣으면 알맞은 신경망 구조를 자동으로 찾아서 만들어주는 클래스예요. ' +
        'BERT, GPT, RoBERTa 등 수백 가지 모델이 각자 다른 구조를 가지고 있지만, AutoModel 하나로 전부 불러올 수 있어요. ' +
        '뼈대를 통째로 가져오는 것이라서, 모델의 가중치(weight)도 모두 다운로드돼요. ' +
        'model.config를 통해 은닉층 크기(hidden_size), 레이어 수, 어텐션 헤드 수 같은 구조 정보를 확인할 수 있어요. ' +
        '실무에서는 이 모델의 출력 벡터를 가져와서 문장 분류, 개체명 인식 등 다양한 다운스트림 작업에 사용해요.',
      terms: [
        { t: 'AutoModel', d: '모델 이름만으로 알맞은 신경망 구조를 자동 선택하는 클래스예요.' },
        { t: 'model.config', d: '모델의 각종 설정값(은닉층 크기, 레이어 수, 어휘 크기 등)을 모아둔 객체예요.' },
        { t: 'hidden_size', d: '모델이 한 토큰을 표현하는 벡터의 차원 수예요. BERT base는 768이에요.' },
        { t: 'from_pretrained', d: '허깅페이스 허브에서 사전 학습된 가중치와 설정을 한 번에 불러오는 메서드예요.' },
      ],
      why:
        '직접 모델 구조를 코딩하지 않아도 검증된 사전 학습 모델을 한 줄로 쓸 수 있어요. ' +
        '특히 BERT, GPT-2 등은 재현하려면 수백 GPU·시간이 필요한데, from_pretrained로 1분 만에 불러올 수 있어요.',
      expectedOutput:
        '[실행] AutoModel 로딩 시작\n' +
        '[결과] hidden_size: 768',
      realWorldUsage:
        '질의응답 서비스를 구축할 때, AutoModel로 BERT를 불러와서 질문과 문서의 벡터 표현을 얻고, ' +
        '그 벡터를 비교해 정답 위치를 찾아내요. QA, 검색, 추천 시스템의 핵심 구성 요소예요.',
      pitfall: 'AutoModel은 분류 헤드(예: 감성 분류용 출력층)가 포함되지 않은 순수 은닉층만 가져와요. 분류 작업이 필요하면 AutoModelForSequenceClassification을 대신 사용해야 해요.',
    },
  },
  {
    id: 'pllm-model-forward',
    lang: 'python',
    title: '모델에 입력 넣기',
    file: 'forward.py',
    code: `from transformers import AutoTokenizer, AutoModel

print("[실행] 모델 추론 시작")
tok = AutoTokenizer.from_pretrained('bert-base-uncased')
model = AutoModel.from_pretrained('bert-base-uncased')
enc = tok('hello world', return_tensors='pt')
out = model(**enc)
print(f"[결과] 출력 텐서 모양: {out.last_hidden_state.shape}")`,
    explain: {
      concept:
        '모델에 입력을 넣는 순전파(forward pass)는 토큰 번호를 신경망에 통과시켜 각 토큰의 의미 벡터를 얻는 과정이에요. ' +
        '재료를 믹서기에 넣으면 반죽이 나오듯, 토큰을 넣으면 768차원(또는 모델별 지정 차원)의 의미 벡터가 나와요. ' +
        '**enc 문법은 딕셔너리의 키-값 쌍을 모델의 매개변수로 풀어서 전달하는 파이썬 언패킹이에요. ' +
        'last_hidden_state는 모델의 마지막 은닉층 출력으로, 각 토큰 위치마다 하나의 벡터를 담고 있어요. ' +
        '이 벡터들이 바로 "문장의 의미를 수학적으로 표현한 것"으로, 이후 분류기나 유사도 계산에 활용돼요.',
      terms: [
        { t: '**enc', d: '딕셔너리 enc의 모든 키-값 쌍을 모델 호출의 키워드 인자로 풀어 전달하는 파이썬 언패킹 문법이에요.' },
        { t: 'model(**enc)', d: '모델에 토큰화된 입력을 넣고 순전파 계산을 실행하는 호출이에요.' },
        { t: 'last_hidden_state', d: '트랜스포머 마지막 층의 출력으로, (배치, 토큰 수, hidden_size) 형태의 텐서예요.' },
        { t: '.shape', d: '출력 텐서의 차원 정보를 확인해요. (1, 토큰 수, 768) 같은 형태로 나와요.' },
      ],
      why:
        '모델이 문장을 이해한 벡터 표현을 얻는 게 모든 NLP 작업의 핵심이에요. ' +
        '이 벡터로 분류, 검색, 클러스터링 등 모든 다운스트림 작업을 수행할 수 있어요.',
      expectedOutput:
        '[실행] 모델 추론 시작\n' +
        '[결과] 출력 텐서 모양: torch.Size([1, 5, 768])',
      realWorldUsage:
        '문서 검색 엔진에서는 수백만 문서의 BERT 벡터를 미리 계산해 벡터 DB에 저장하고, ' +
        '검색어가 들어오면 쿼리 벡터와 가장 유사한 문서 벡터를 찾아 반환해요. 구글 검색도 비슷한 원리로 동작해요.',
      pitfall: '모델과 입력 텐서가 같은 장치에 있어야 해요. 모델이 GPU(cuda)로 올라가 있는데 입력이 CPU에 있으면 RuntimeError가 발생해요. model.to("cuda")와 enc.to("cuda")를 맞춰주세요.',
    },
  },
  {
    id: 'pllm-pipeline-classify',
    lang: 'python',
    title: 'pipeline 감성 분류',
    file: 'pipeline_cls.py',
    code: `from transformers import pipeline

print("[실행] 감성 분류 파이프라인 실행")
clf = pipeline('text-classification')
result = clf('I love this!')
print(f"[결과] {result}")`,
    explain: {
      concept:
        'pipeline은 토큰화 → 모델 추론 → 결과 해석까지 한 번에 해주는 만능 도구예요. ' +
        '버튼 하나 누르면 커피가 나오는 자판기처럼, 텍스트만 넣으면 분류 결과를 바로 받을 수 있어요. ' +
        '내부적으로는 AutoTokenizer, AutoModelForSequenceClassification, 후처리까지 자동으로 실행돼요. ' +
        '실무에서는 빠른 프로토타입이나 간단한 분류 작업에 pipeline을 쓰고, 성능이 중요한 서비스는 각 단계를 분리해서 최적화해요. ' +
        '처음 실행할 때 모델을 다운로드하느라 시간이 좀 걸리지만, 이후에는 빠르게 동작해요.',
      terms: [
        { t: "pipeline('text-classification')", d: '문장의 감성(긍정/부정)을 분류하는 파이프라인을 생성해요.' },
        { t: 'clf(...)', d: '분석할 문장을 파이프라인에 넣으면 라벨과 신뢰도 점수를 함께 반환해요.' },
        { t: 'result', d: '분류 결과가 담긴 리스트예요. 각 항목은 label과 score 키를 가진 딕셔너리예요.' },
        { t: "'I love this!'", d: '테스트할 입력 문장이에요. 긍정적인 표현이므로 POSITIVE 라벨이 예상돼요.' },
      ],
      why:
        '감성 분류는 고객 리뷰 분석, SNS 모니터링, VOC(고객의 소리) 분류 등에서 가장 기본이 되는 작업이에요. ' +
        'pipeline 한 줄이면 복잡한 설정 없이 바로 결과를 볼 수 있어요.',
      expectedOutput:
        '[실행] 감성 분류 파이프라인 실행\n' +
        "[결과] [{'label': 'POSITIVE', 'score': 0.999}]",
      realWorldUsage:
        '이커머스 회사에서 하루 5만 건의 상품 리뷰를 자동으로 긍정/부정 분류해서 ' +
        '불만 리뷰는 즉시 CS팀에 알림을 보내는 자동화 파이프라인에 사용돼요.',
      pitfall: 'pipeline 첫 호출 시 인터넷에서 모델을 다운로드하느라 몇 초에서 몇 분이 걸려요. 실제 서비스에서는 모델을 미리 로드해 두는 웜업(warm-up) 전략이 필요해요.',
    },
  },
  {
    id: 'pllm-pipeline-ner',
    lang: 'python',
    title: 'pipeline 개체명 인식',
    file: 'pipeline_ner.py',
    code: `from transformers import pipeline

print("[실행] 개체명 인식 파이프라인 실행")
ner = pipeline('ner', aggregation_strategy='simple')
result = ner('Apple is in California')
print(f"[결과] {result}")`,
    explain: {
      concept:
        '개체명 인식(NER, Named Entity Recognition)은 문장에서 사람·장소·회사·날짜 같은 고유명사를 찾아 이름표를 달아주는 기술이에요. ' +
        '마치 문서에 형광펜으로 중요한 단어에만 표시하는 것과 같아요. ' +
        "aggregation_strategy='simple'을 지정하지 않으면 California가 Cal·##i·##for·##nia처럼 서브워드로 쪼개져서 결과가 지저분해져요. " +
        '실무에서는 계약서에서 당사자 정보를 추출하거나, 뉴스 기사에서 사건·장소·인물을 자동 분류할 때 필수적으로 사용해요.',
      terms: [
        { t: "pipeline('ner')", d: '개체명을 인식하는 파이프라인을 생성해요. 기본 모델로 BERT 기반 NER을 사용해요.' },
        { t: "aggregation_strategy='simple'", d: '서브워드로 쪼개진 토큰들을 같은 단어로 합쳐서 깔끔하게 보여주는 옵션이에요.' },
        { t: 'ner(...)', d: '분석할 문장을 넣으면 개체명, 종류(ORG/LOC/PER), 신뢰도 점수를 리스트로 반환해요.' },
        { t: "'Apple is in California'", d: 'Apple은 조직(ORG), California는 위치(LOC)로 인식되는 예시 문장이에요.' },
      ],
      why:
        '비정형 텍스트에서 구조화된 정보를 자동으로 추출하려면 NER이 필수예요. ' +
        '법률·의료·금융 문서에서 핵심 개체를 뽑아 DB에 저장하는 자동화 파이프라인의 첫 단계로 사용돼요.',
      expectedOutput:
        '[실행] 개체명 인식 파이프라인 실행\n' +
        "[결과] [{'entity_group': 'ORG', 'word': 'Apple', ...}, {'entity_group': 'LOC', 'word': 'California', ...}]",
      realWorldUsage:
        '보험사에서 사고 접수 문서 10만 건을 분석할 때, NER로 사고 장소(LOC), 관련자(PER), 차량 모델(MISC)을 자동 추출해서 ' +
        '데이터베이스 필드에 채워 넣어요. 수작업으로 하면 수백 시간이 걸리지만, NER로는 몇 분이면 끝나요.',
      pitfall: 'aggregation_strategy를 지정하지 않으면 서브워드 토큰(예: ##nia)이 낱낱이 분리돼 결과가 알아보기 힘들어져요. aggregation_strategy="simple"을 꼭 넣어주세요.',
    },
  },
  {
    id: 'pllm-pipeline-generation',
    lang: 'python',
    title: 'pipeline 텍스트 생성',
    file: 'pipeline_gen.py',
    code: `from transformers import pipeline

print("[실행] 텍스트 생성 파이프라인 시작")
gen = pipeline('text-generation')
result = gen('Once upon a time', max_new_tokens=10)
print(f"[결과] {result[0]['generated_text']}")`,
    explain: {
      concept:
        '텍스트 생성(text generation)은 시작 문장을 힌트로 주면 모델이 다음에 올 단어를 하나씩 예측해서 이어 쓰는 기능이에요. ' +
        '동화의 첫 문장을 주면 AI가 뒷이야기를 상상해서 써내려가는 것과 같아요. ' +
        'max_new_tokens는 새로 생성할 최대 토큰 수를 정하는데, 너무 작으면 문장이 끝나기 전에 잘리고, 너무 크면 같은 말을 반복할 수 있어요. ' +
        '실무에서는 챗봇 응답 생성, 코드 자동 완성, 마케팅 카피 작성 등에 널리 사용되고 있어요.',
      terms: [
        { t: "pipeline('text-generation')", d: '입력 텍스트를 이어서 새로운 텍스트를 생성하는 파이프라인이에요.' },
        { t: 'max_new_tokens=10', d: '입력은 제외하고 새로 생성할 토큰의 최대 개수예요. 10이면 약 7~8단어 정도 생성해요.' },
        { t: "result[0]['generated_text']", d: '첫 번째 결과에서 생성된 전체 텍스트(입력 + 새로 생성된 부분)를 추출해요.' },
        { t: "'Once upon a time'", d: '생성의 시작점이 되는 프롬프트예요. 동화 시작부를 흉내낸 입력이에요.' },
      ],
      why:
        'LLM의 가장 대표적인 활용처로, 사용자 프롬프트에 대한 자연스러운 응답을 만드는 모든 서비스의 근간이에요. ' +
        'ChatGPT, Claude, Gemini 같은 서비스가 모두 텍스트 생성 기술을 기반으로 동작해요.',
      expectedOutput:
        '[실행] 텍스트 생성 파이프라인 시작\n' +
        '[결과] Once upon a time, there was a young girl named Lily who lived in a small',
      realWorldUsage:
        '이커머스에서 상품 설명을 자동 생성하는 시스템을 생각해봐요. ' +
        '"청바지, 슬림핏, 3만원" 같은 키워드를 프롬프트로 주면, 생성 모델이 "편안한 착용감의 슬림핏 청바지입니다..." 같은 자연스러운 상품 설명을 자동으로 써줘요.',
      pitfall: 'max_new_tokens을 너무 크게 하면 응답이 길어지는 데다 같은 내용이 반복(repetition)될 수 있어요. 적절한 길이로 제한하고 temperature, top_p 같은 파라미터로 다양성을 조절해야 해요.',
    },
  },
  {
    id: 'pllm-pipeline-qa',
    lang: 'python',
    title: 'pipeline 질의응답',
    file: 'pipeline_qa.py',
    code: `from transformers import pipeline

print("[실행] 질의응답 파이프라인 실행")
qa = pipeline('question-answering')
r = qa(question='Where is Paris', context='Paris is in France')
print(f"[결과] answer: {r['answer']}")`,
    explain: {
      concept:
        '질의응답(QA, Question Answering)은 주어진 본문(context) 안에서 질문의 답이 되는 부분을 찾아서 정확히 뽑아내는 기술이에요. ' +
        '사서에게 책 한 권을 주고 "이 책에서 파리에 대한 내용이 어디 있어?"라고 물으면 정확한 문장을 찾아주는 것과 같아요. ' +
        'QA는 생성형이 아니라 추출형(extractive)으로, 본문에 있는 문장을 그대로 답으로 반환하기 때문에 환각(hallucination) 문제에서 비교적 자유로워요. ' +
        '하지만 본문에 답이 없으면 엉뚱한 부분을 억지로 답으로 내놓을 수 있어서, 신뢰도 점수(score)를 함께 확인하는 게 중요해요.',
      terms: [
        { t: "pipeline('question-answering')", d: '본문에서 질문의 답을 찾아주는 QA 파이프라인을 생성해요.' },
        { t: 'question', d: '찾고 싶은 정보를 자연어로 적은 질문이에요.' },
        { t: 'context', d: '답이 들어있는 근거 본문이에요. QA 모델은 이 안에서만 답을 찾아요.' },
        { t: "r['answer']", d: '모델이 context에서 추출한 정답 문구예요. score 키로 신뢰도도 함께 확인할 수 있어요.' },
      ],
      why:
        '긴 문서에서 원하는 정보만 빠르게 찾을 때 아주 유용해요. ' +
        '고객 문의에 대한 FAQ 검색, 의료 논문에서 특정 정보 추출, 계약서 조항 검색 등에 활용돼요.',
      expectedOutput:
        '[실행] 질의응답 파이프라인 실행\n' +
        '[결과] answer: France',
      realWorldUsage:
        '기업 내부 문서 검색 시스템에서 "2025년 마케팅 예산은 얼마야?"라고 물으면, ' +
        'QA 모델이 수백 페이지의 내부 보고서에서 해당 문장을 찾아 바로 보여줘요. 직원이 일일이 PDF를 뒤질 필요가 없어져요.',
      pitfall: '본문(context)에 정답이 없으면 모델이 관련 없는 부분을 강제로 답으로 내놓을 수 있어요. score가 0.01 이하로 낮으면 답이 없다고 판단하는 게 안전해요.',
    },
  },
  {
    id: 'pllm-pipeline-summarize',
    lang: 'python',
    title: 'pipeline 요약',
    file: 'pipeline_summ.py',
    code: `from transformers import pipeline

print("[실행] 요약 파이프라인 시작")
summ = pipeline('summarization')
text = (
    'Python is a versatile programming language created by Guido van Rossum. '
    'It emphasizes code readability and simplicity. '
    'Python is widely used in web development, data science, and automation.'
)
r = summ(text, max_length=60, min_length=10)
print(f"[결과] {r[0]['summary_text']}")`,
    explain: {
      concept:
        '요약(summarization)은 긴 글을 핵심만 남기고 짧게 압축하는 기능이에요. ' +
        '영화를 2분짜리 예고편으로 만드는 것처럼, 긴 문서의 핵심 정보를 추려서 전달해줘요. ' +
        'max_length는 요약 결과의 최대 토큰 길이, min_length는 최소 토큰 길이를 정하는데, max가 min보다 반드시 커야 해요. ' +
        '실무에서는 뉴스 기사 요약, 회의록 정리, 고객 리뷰 핵심 키워드 추출 등에 다양하게 쓰여요. ' +
        '최근에는 추출 요약(extractive)보다 생성 요약(abstractive)이 주로 사용되며, pipeline도 기본적으로 생성 요약 방식이에요.',
      terms: [
        { t: "pipeline('summarization')", d: '긴 텍스트를 짧게 요약해주는 파이프라인이에요. 기본 모델은 BART나 T5 계열이에요.' },
        { t: 'max_length=60', d: '생성할 요약문의 최대 토큰 수예요. min_length보다 반드시 커야 해요.' },
        { t: 'min_length=10', d: '생성할 요약문의 최소 토큰 수예요. 너무 짧게 요약되는 걸 방지해요.' },
        { t: "r[0]['summary_text']", d: '첫 번째(유일한) 결과에서 요약된 텍스트를 추출해요.' },
      ],
      why:
        '하루 수천 건의 보고서, 뉴스, 문서를 사람이 일일이 읽을 수 없으니 AI가 요약해주는 게 필수예요. ' +
        '특히 뉴스레터, 브리핑 자동화, 문서 검색 요약 등 시간 절약 효과가 커요.',
      expectedOutput:
        '[실행] 요약 파이프라인 시작\n' +
        '[결과] Python is a versatile programming language. It is widely used in web development, data science, and automation.',
      realWorldUsage:
        '증권사 리서치 팀에서 하루 200개 기업 보고서를 분석할 때, 각 보고서를 요약 파이프라인에 통과시켜 ' +
        '3줄 요약만 먼저 읽고, 중요한 보고서만 전체를 검토하는 식으로 업무 효율을 높여요.',
      pitfall: 'max_length가 min_length보다 작으면 ValueError가 발생해요. 또한 max_length를 모델의 기본 min_length(56)보다 작게 설정해도 오류가 날 수 있어요. 충분히 여유 있게 설정하세요.',
    },
  },
  {
    id: 'pllm-pipeline-zeroshot',
    lang: 'python',
    title: 'pipeline 제로샷 분류',
    file: 'pipeline_zero.py',
    code: `from transformers import pipeline

print("[실행] 제로샷 분류 실행")
clf = pipeline('zero-shot-classification')
r = clf('I love sunny days', candidate_labels=['weather', 'food'])
print(f"[결과] labels: {r['labels']}")`,
    explain: {
      concept:
        '제로샷 분류(zero-shot classification)는 한 번도 학습하지 않은 새로운 분류 기준으로도 텍스트를 분류할 수 있는 기술이에요. ' +
        '보기만 주면 정답을 추론하는 시험처럼, candidate_labels에 원하는 라벨만 넣으면 알아서 가장 잘 맞는 것을 골라줘요. ' +
        '기존 분류 모델이 "날씨·음식·스포츠" 중 하나로만 분류할 수 있는 반면, 제로샷은 매번 다른 라벨로도 분류가 가능해요. ' +
        '실무에서는 고객 문의를 매번 새로운 카테고리로 분류해야 하는 VOC 분석이나, 빠르게 변하는 토픽 태깅에 아주 유용해요.',
      terms: [
        { t: "pipeline('zero-shot-classification')", d: '사전 학습 없이 후보 라벨 중 가장 알맞은 것을 선택하는 파이프라인이에요.' },
        { t: 'candidate_labels', d: '분류 기준으로 사용할 후보 라벨 리스트예요. 모델은 이 중에서 하나를 골라요.' },
        { t: "r['labels']", d: '신뢰도 점수 내림차순으로 정렬된 라벨 리스트예요. 첫 번째가 가장 확실한 분류 결과예요.' },
        { t: "'I love sunny days'", d: '분류할 입력 문장이에요. 날씨(weather)와 연관되어 있어 weather가 1순위로 나와요.' },
      ],
      why:
        '전통적인 분류 모델은 학습한 라벨만 분류할 수 있어서 새로운 카테고리가 생기면 다시 학습해야 해요. ' +
        '제로샷 방식은 라벨만 바꾸면 되니 변화가 빠른 비즈니스 환경에 딱 맞아요.',
      expectedOutput:
        '[실행] 제로샷 분류 실행\n' +
        "[결과] labels: ['weather', 'food']",
      realWorldUsage:
        '스타트업에서 사용자 피드백 1만 건을 분석할 때, 매주 새로운 이슈(예: "결제 오류", "배송 지연", "앱 버그")가 생기는데, ' +
        '제로샷 분류로 candidate_labels만 변경하면 재학습 없이 즉시 새 카테고리로 분류할 수 있어요.',
      pitfall: 'candidate_labels의 단어가 애매하거나 서로 겹치는 의미를 가지면 분류 정확도가 크게 흔들려요. 예를 들어 "sport"와 "game"이 같이 있으면 혼동할 수 있어요.',
    },
  },
  {
    id: 'pllm-pipeline-translate',
    lang: 'python',
    title: 'pipeline 번역',
    file: 'pipeline_tr.py',
    code: `from transformers import pipeline

print("[실행] en→fr 번역 시작")
tr = pipeline('translation_en_to_fr')
r = tr('good morning')
print(f"[결과] {r[0]['translation_text']}")`,
    explain: {
      concept:
        '번역(translation) 파이프라인은 한 언어의 텍스트를 다른 언어로 자동 변환해줘요. ' +
        '사전을 찾아가며 직접 번역할 필요 없이, 신경망 기반 모델이 문맥까지 고려한 자연스러운 번역을 생성해요. ' +
        '파이프라인 이름에 번역 방향(en_to_fr: 영어→프랑스어)이 포함되어 있어서, 원하는 언어쌍에 맞는 파이프라인을 선택해야 해요. ' +
        '실무에서는 다국어 고객 지원, 글로벌 콘텐츠 현지화, 실시간 채팅 번역 등에 사용되고 있어요.',
      terms: [
        { t: "pipeline('translation_en_to_fr')", d: '영어에서 프랑스어로 번역하는 파이프라인이에요. 언어 방향이 이름에 포함돼 있어요.' },
        { t: "r[0]['translation_text']", d: '번역된 결과 문자열을 추출해요. 첫 번째(유일한) 결과의 번역문이에요.' },
        { t: "tr('good morning')", d: '번역할 영어 문장을 파이프라인에 넣는 호출이에요.' },
        { t: "'good morning'", d: '번역 대상 영어 입력이에요. 프랑스어 "bonjour" 정도로 번역될 거예요.' },
      ],
      why:
        '글로벌 서비스를 운영하려면 다국어 지원이 필수예요. ' +
        '사람 번역가는 비용이 크고 느리지만, 기계 번역은 실시간에 가깝고 비용이 거의 들지 않아요.',
      expectedOutput:
        '[실행] en→fr 번역 시작\n' +
        '[결과] bonjour',
      realWorldUsage:
        '해외 쇼핑몰에서 한국 소비자가 영어 상품 설명을 볼 때, 실시간으로 번역 파이프라인이 한글로 바꿔서 보여줘요. ' +
        '또한 글로벌 고객센터에서 영어 문의를 한국어로 자동 번역해 상담사에게 전달하는 용도로도 쓰여요.',
      pitfall: '지원하지 않는 언어 방향(예: en_to_ko)을 입력하면 해당 모델이 허브에 없어 OSError가 발생해요. 허깅페이스에서 사용 가능한 번역 모델 목록을 먼저 확인하세요.',
    },
  },
  {
    id: 'pllm-sentence-encode',
    lang: 'python',
    title: 'SentenceTransformer 임베딩',
    file: 'sentence_encode.py',
    code: `from sentence_transformers import SentenceTransformer

print("[실행] 문장 임베딩 시작")
model = SentenceTransformer('all-MiniLM-L6-v2')
vec = model.encode('hello world')
print(f"[결과] 벡터 차원: {vec.shape}")`,
    explain: {
      concept:
        '임베딩(embedding)은 문장의 의미를 숫자 벡터로 바꿔서, 컴퓨터가 문장 간 의미적 유사성을 수학적으로 계산할 수 있게 해주는 기술이에요. ' +
        '문장을 N차원 공간의 한 점으로 옮기는 셈이에요 - 비슷한 의미의 문장은 공간에서 가까운 점에 위치하게 돼요. ' +
        'SentenceTransformer는 BERT를 문장 임베딩에 특화되도록 학습한 모델로, 한 줄로 문장을 벡터로 바꿀 수 있어요. ' +
        'all-MiniLM-L6-v2는 속도와 품질의 균형이 좋아서 가장 많이 쓰이는 모델이며, 384차원 벡터를 생성해요. ' +
        '실무에서는 의미 검색, 중복 문서 탐지, 추천 시스템 등에 이 임베딩 벡터를 핵심 재료로 사용해요.',
      terms: [
        { t: 'SentenceTransformer', d: '문장 전체를 하나의 고정된 길이의 벡터로 변환해주는 전문 모델 클래스예요.' },
        { t: "'all-MiniLM-L6-v2'", d: '가장 널리 쓰이는 경량 문장 임베딩 모델이에요. 속도가 빠르고 384차원 벡터를 생성해요.' },
        { t: 'model.encode()', d: '문장을 받아 의미 벡터(numpy 배열)로 변환하는 메서드예요.' },
        { t: 'vec.shape', d: '생성된 벡터의 차원 수를 확인해요. all-MiniLM-L6-v2는 (384,)가 출력돼요.' },
      ],
      why:
        '문장 간 의미 비교는 텍스트끼리 단순 문자열 비교로는 불가능해요. ' +
        '"배고파"와 "밥 먹고 싶어"는 완전히 다른 문자열이지만, 임베딩 벡터는 이 둘의 의미가 가깝다는 걸 수치로 알려줘요.',
      expectedOutput:
        '[실행] 문장 임베딩 시작\n' +
        '[결과] 벡터 차원: (384,)',
      realWorldUsage:
        '챗봇이 사용자 질문에 가장 잘 맞는 FAQ를 찾을 때, 미리 모든 FAQ의 임베딩을 계산해두고 ' +
        '사용자 질문의 임베딩과 가장 유사한(코사인 유사도 높은) FAQ를 골라 답변해요. 수천 개 FAQ 중 0.01초 만에 가장 비슷한 항목을 찾아요.',
      pitfall: '임베딩 모델마다 벡터 차원이 달라요. all-MiniLM-L6-v2(384차원)와 all-mpnet-base-v2(768차원)의 벡터는 서로 직접 비교할 수 없어요. 같은 모델로 생성한 벡터끼리만 비교해야 해요.',
    },
  },
  {
    id: 'pllm-cosine-sim',
    lang: 'python',
    title: '코사인 유사도',
    file: 'cosine_sim.py',
    code: `from sentence_transformers import SentenceTransformer, util

print("[실행] 두 문장 유사도 계산")
model = SentenceTransformer('all-MiniLM-L6-v2')
a = model.encode('cat')
b = model.encode('kitten')
sim = util.cos_sim(a, b)
print(f"[결과] cat↔kitten 유사도: {sim.item():.3f}")`,
    explain: {
      concept:
        '코사인 유사도(cosine similarity)는 두 벡터가 가리키는 방향이 얼마나 비슷한지를 -1에서 1 사이 숫자로 측정하는 방법이에요. ' +
        '1이면 완전히 같은 방향(의미가 같음), 0이면 직각(무관), -1이면 정반대 방향이에요. ' +
        '벡터의 절대적 크기(길이)가 아니라 방향만 보기 때문에, 문장 길이 차이에 영향을 받지 않고 의미적 유사성만 측정할 수 있어요. ' +
        '"cat"과 "kitten"의 코사인 유사도는 0.7~0.9 정도로 높게 나오는데, 이는 두 단어가 비슷한 의미를 가지기 때문이에요. ' +
        '실무에서는 검색 엔진, 추천 시스템, 문서 클러스터링, 표절 검사 등 의미적 유사성이 필요한 거의 모든 곳에서 사용돼요.',
      terms: [
        { t: 'util.cos_sim(a, b)', d: '두 벡터의 코사인 유사도를 계산해 0~1 범위의 텐서로 반환하는 sentence_transformers 유틸리티 함수예요.' },
        { t: 'model.encode()', d: '각 문장을 의미 벡터로 변환해요. 벡터가 있어야 유사도를 계산할 수 있어요.' },
        { t: 'sim.item()', d: '텐서에서 실제 숫자(float) 값을 꺼내는 메서드예요. print로 보기 좋게 출력하려고 써요.' },
        { t: 'a, b', d: '비교할 두 문장의 임베딩 벡터를 담은 변수예요. 같은 모델로 생성해야 해요.' },
      ],
      why:
        '의미 기반 검색의 핵심 연산이에요. 키워드 검색으로는 "차"(car)와 "자동차"(automobile)가 전혀 다른 결과로 나오지만, ' +
        '임베딩 + 코사인 유사도 방식이면 의미가 같으니 높은 유사도로 잡아낼 수 있어요.',
      expectedOutput:
        '[실행] 두 문장 유사도 계산\n' +
        '[결과] cat↔kitten 유사도: 0.785',
      realWorldUsage:
        '챗봇의 의도 분류에서 "환불해줘", "돈 돌려줘", "결제 취소할래" 같은 다양한 표현이 모두 같은 의도(환불)임을 ' +
        '코사인 유사도로 판별해서 하나의 처리 로직으로 연결해요. 사용자가 어떻게 말하든 같은 의도로 인식할 수 있어요.',
      pitfall: '임베딩 벡터는 대부분 양수 방향에 몰려 있어서 실제 코사인 유사도는 보통 0~1 사이에 분포해요. 0.3 이하면 관련 없는 문장, 0.7 이상이면 매우 유사한 문장이라고 보는 게 일반적이에요.',
    },
  },
  {
    id: 'pllm-mean-pooling',
    lang: 'python',
    title: '평균 풀링으로 임베딩',
    file: 'mean_pooling.py',
    code: `from transformers import AutoTokenizer, AutoModel

print("[실행] 평균 풀링 임베딩")
tok = AutoTokenizer.from_pretrained('bert-base-uncased')
model = AutoModel.from_pretrained('bert-base-uncased')
enc = tok('hello world', return_tensors='pt')
out = model(**enc)
pooled = out.last_hidden_state.mean(dim=1)
print(f"[결과] 문장 벡터 차원: {pooled.shape}")`,
    explain: {
      concept:
        '평균 풀링(mean pooling)은 BERT가 토큰별로 출력한 여러 벡터들을 평균 내어 문장 전체를 대표하는 하나의 벡터로 만드는 방법이에요. ' +
        '각 토큰의 벡터에는 "그 위치에서의 문맥 정보"가 담겨 있는데, 이걸 전부 평균 내면 "문장 전체의 의미"를 담은 벡터가 얻어져요. ' +
        '여러 사람의 의견을 한 장의 표로 요약하는 것과 비슷해요. ' +
        'SentenceTransformer가 이 평균 풀링을 내부에서 자동으로 처리해주지만, AutoModel로 직접 구현할 때는 명시적으로 mean()을 호출해야 해요. ' +
        '실무에서는 SentenceTransformer를 쓰는 게 편리하지만, 커스텀 임베딩 로직이 필요할 때는 이렇게 수동으로 구현해요.',
      terms: [
        { t: 'last_hidden_state', d: '모델 마지막 층에서 각 토큰 위치별로 출력된 벡터 묶음이에요. shape은 (1, 토큰수, 768)이에요.' },
        { t: '.mean(dim=1)', d: '토큰 차원(dim=1)을 따라 평균을 내서 문장당 하나의 벡터로 만드는 PyTorch 연산이에요.' },
        { t: 'pooled', d: '평균 풀링 결과로 얻은 문장 임베딩 벡터예요. shape은 (1, 768)이 돼요.' },
        { t: 'model(**enc)', d: '토큰화된 입력을 모델에 넣어 순전파하는 호출이에요. 언패킹(**)으로 딕셔너리 키워드를 전달해요.' },
      ],
      why:
        '문장 단위 비교를 하려면 토큰 여러 개의 벡터를 하나로 압축해야 해요. ' +
        '평균 풀링은 가장 단순하면서도 꽤 효과적인 방법이라, SentenceTransformer도 내부적으로 이 방식을 사용해요.',
      expectedOutput:
        '[실행] 평균 풀링 임베딩\n' +
        '[결과] 문장 벡터 차원: torch.Size([1, 768])',
      realWorldUsage:
        '문서 클러스터링 파이프라인에서 수천 개 문서를 주제별로 묶을 때, 각 문서의 평균 풀링 벡터를 구하고 ' +
        'K-means 같은 군집화 알고리즘으로 비슷한 문서끼리 자동 분류해요. 뉴스 기사 자동 카테고리 분류에 실제로 쓰이는 방식이에요.',
      pitfall: '이 코드는 단일 문장이라 문제없지만, 여러 문장을 배치로 처리할 때는 패딩 위치를 attention_mask로 제외하고 평균을 내야 해요. 그렇지 않으면 0으로 채워진 패딩까지 평균에 포함돼 임베딩 품질이 떨어져요.',
    },
  },
  {
    id: 'pllm-batch-encode',
    lang: 'python',
    title: '문장 묶음 임베딩',
    file: 'batch_encode.py',
    code: `from sentence_transformers import SentenceTransformer

print("[실행] 배치 임베딩 시작")
model = SentenceTransformer('all-MiniLM-L6-v2')
vecs = model.encode(['cat', 'dog', 'fish'])
print(f"[결과] 배치 텐서 모양: {vecs.shape}")`,
    explain: {
      concept:
        'encode에 문장 리스트를 한 번에 넣으면 여러 문장을 동시에 벡터로 변환해줘요. ' +
        '복합기에 여러 장의 문서를 한 번에 스캔하는 것처럼, 리스트로 전달하면 내부에서 자동으로 배치 처리를 수행해요. ' +
        'SentenceTransformer는 GPU를 활용해 여러 문장을 병렬로 인코딩하기 때문에, for 루프로 하나씩 처리하는 것보다 수십 배 빠를 수 있어요. ' +
        '실무에서는 수만~수백만 개의 문서를 벡터 DB에 저장할 때 반드시 배치 인코딩을 사용해요.',
      terms: [
        { t: "['cat', 'dog', 'fish']", d: '임베딩할 문장들을 리스트로 묶어 전달해요. 한 번의 호출로 전부 처리돼요.' },
        { t: 'vecs.shape', d: '(문장_수, 벡터_차원) 형태의 튜플이에요. 여기서는 (3, 384)가 나와요.' },
        { t: 'model.encode()', d: '단일 문장도, 리스트도 받을 수 있는 유연한 메서드예요. 입력 형태에 따라 출력 차원이 달라져요.' },
        { t: "'all-MiniLM-L6-v2'", d: '384차원의 경량 문장 임베딩 모델이에요. 배치 처리 속도가 특히 빨라요.' },
      ],
      why:
        '한 번에 하나씩 처리하면 GPU의 병렬 처리 능력을 전혀 활용하지 못해요. ' +
        '1만 건을 개별로 처리하면 수 분이 걸리지만, 배치로 처리하면 수 초면 완료돼요.',
      expectedOutput:
        '[실행] 배치 임베딩 시작\n' +
        '[결과] 배치 텐서 모양: (3, 384)',
      realWorldUsage:
        '전자상거래 검색 엔진에서 100만 개 상품 설명을 임베딩할 때, 배치 크기 256으로 인코딩하면 ' +
        '몇 분 만에 전체 상품 DB를 벡터화할 수 있어요. 이후 검색어와 코사인 유사도를 계산해 가장 비슷한 상품을 추천해요.',
      pitfall: '배치 크기가 너무 크면 GPU 메모리가 부족해져서 CUDA Out of Memory 오류가 발생해요. 전체 데이터를 batch_size=32~128 단위로 나눠서 처리하는 게 안전해요.',
    },
  },
];
