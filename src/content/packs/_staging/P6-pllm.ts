import type { Snippet } from '../../types';

export const pythonLLM: Snippet[] = [
  {
    id: 'pllm-autotokenizer-load',
    lang: 'python',
    title: 'AutoTokenizer 불러오기',
    file: 'tokenizer_load.py',
    code: `from transformers import AutoTokenizer


tok = AutoTokenizer.from_pretrained('bert-base-uncased')
print(tok.vocab_size)`,
    explain: {
      concept: 'AutoTokenizer는 모델이 글자를 쪼개는 방식(토큰화)을 알아서 찾아주는 도구예요. 사전을 통째로 가져오는 것과 같아요.',
      terms: [
        { t: 'AutoTokenizer', d: '모델 이름만 넣으면 알맞은 토크나이저를 골라주는 클래스예요.' },
        { t: 'from_pretrained', d: '인터넷에서 미리 학습된 모델(사전)을 가져오는 메서드예요.' },
        { t: 'vocab_size', d: '이 토크나이저가 아는 단어(토큰)의 총 개수예요.' }
      ],
      why: '모델마다 글자를 쪼개는 규칙이 달라서 전용 토크나이저가 필요해요.',
      pitfall: '모델 이름을 잘못 적으면 인터넷에서 찾지 못해 에러가 나요.'
    }
  },
  {
    id: 'pllm-tokenize-text',
    lang: 'python',
    title: '텍스트 토큰화',
    file: 'tokenize.py',
    code: `from transformers import AutoTokenizer


tok = AutoTokenizer.from_pretrained('bert-base-uncased')
enc = tok('hello world')
print(enc['input_ids'])`,
    explain: {
      concept: '토큰화는 문장을 모델이 이해하는 작은 조각(토큰)으로 자르고 각 조각에 번호를 매기는 일이에요. 글자를 주판 알갱이로 바꾸는 것과 같아요.',
      terms: [
        { t: "tok('...')", d: '문장을 넣으면 토큰 번호 묶음으로 바꿔요.' },
        { t: 'input_ids', d: '각 토큰에 해당하는 사전 속 번호예요.' },
        { t: "enc['input_ids']", d: '딕셔너리에서 토큰 번호 묶음을 꺼내요.' }
      ],
      why: '모델은 글자를 그대로 못 읽고 숫자만 읽을 수 있어서 번호로 바꿔요.',
      pitfall: "괄호 호출 결과는 딕셔너리처럼 키로 꺼내야 해요, 그냥 출력하면 객체가 나와요."
    }
  },
  {
    id: 'pllm-detokenize',
    lang: 'python',
    title: '토큰을 글자로 복원',
    file: 'decode.py',
    code: `from transformers import AutoTokenizer


tok = AutoTokenizer.from_pretrained('bert-base-uncased')
ids = tok('hello world')['input_ids']
print(tok.decode(ids))`,
    explain: {
      concept: 'decode는 번호를 다시 글자로 되돌리는 기능이에요. 암호를 풀어 원래 문장으로 보여주는 거예요.',
      terms: [
        { t: 'tok.decode', d: '토큰 번호들을 다시 사람 글자로 합쳐줘요.' },
        { t: 'ids', d: '앞에서 만든 토큰 번호 묶음이에요.' },
        { t: "tok('hello world')", d: '문장을 토큰 번호로 바꾸는 호출이에요.' }
      ],
      why: '모델 출력 번호가 무슨 글자인지 확인하려고 써요.',
      pitfall: '특수 토큰 번호([CLS] 등)도 같이 복원돼요, 빼려면 skip_special_tokens 옵션을 써요.'
    }
  },
  {
    id: 'pllm-special-tokens',
    lang: 'python',
    title: '특수 토큰 확인',
    file: 'special_tokens.py',
    code: `from transformers import AutoTokenizer


tok = AutoTokenizer.from_pretrained('bert-base-uncased')
enc = tok('hello', add_special_tokens=True)
print(tok.convert_ids_to_tokens(enc['input_ids']))`,
    explain: {
      concept: '특수 토큰은 문장의 처음과 끝을 알려주는 표지판이에요. 책의 표지처럼 모델이 시작과 끝을 알게 해줘요.',
      terms: [
        { t: 'add_special_tokens', d: '문장 앞뒤에 [CLS], [SEP] 같은 표지를 넣을지 정해요.' },
        { t: 'convert_ids_to_tokens', d: '번호를 토큰 글자로 바꿔줘요.' },
        { t: "enc['input_ids']", d: '문장을 토큰화한 번호 묶음이에요.' }
      ],
      why: 'BERT 같은 모델은 특수 토큰이 있어야 문장 구조를 올바르게 이해해요.',
      pitfall: '특수 토큰을 빼면 모델 학습 때와 입력 형태가 달라 결과가 이상해져요.'
    }
  },
  {
    id: 'pllm-padding',
    lang: 'python',
    title: '패딩으로 길이 맞추기',
    file: 'padding.py',
    code: `from transformers import AutoTokenizer


tok = AutoTokenizer.from_pretrained('bert-base-uncased')
batch = tok(['hi', 'hello world'], padding=True)
print(batch['input_ids'])`,
    explain: {
      concept: '패딩은 짧은 문장 뒤에 빈 칸(0번 토큰)을 채워 길이를 맞추는 거예요. 줄 세울 때 키가 다르면 발판을 깔아주는 것과 같아요.',
      terms: [
        { t: 'padding=True', d: '가장 긴 문장에 맞춰 짧은 문장 뒤를 빈 칸으로 채워요.' },
        { t: "['hi', 'hello world']", d: '여러 문장을 리스트로 넣어 한꺼번에 처리해요.' },
        { t: "batch['input_ids']", d: '패딩된 토큰 번호 묶음을 꺼내요.' }
      ],
      why: '모델은 한 묶음(batch) 안에서는 길이가 같아야 계산할 수 있어요.',
      pitfall: '패딩된 빈 칸도 모델이 계산하므로 너무 긴 문장 하나 때문에 전체가 느려져요.'
    }
  },
  {
    id: 'pllm-truncation',
    lang: 'python',
    title: '잘라내기(truncation)',
    file: 'truncation.py',
    code: `from transformers import AutoTokenizer


tok = AutoTokenizer.from_pretrained('bert-base-uncased')
enc = tok('a ' * 1000, truncation=True, max_length=10)
print(len(enc['input_ids']))`,
    explain: {
      concept: 'truncation은 너무 긴 문장을 정해진 길이에서 잘라버리는 기능이에요. 긴 소설을 요약분량만큼 자르는 것과 같아요.',
      terms: [
        { t: 'truncation=True', d: '최대 길이를 넘으면 뒤를 잘라요.' },
        { t: 'max_length', d: '최대로 허용할 토큰 개수예요.' },
        { t: "'a ' * 1000", d: '매우 긴 문장을 만드는 예시 문자열이에요.' }
      ],
      why: '모델이 한 번에 받을 수 있는 토큰 수에 한계가 있어서 넘치면 잘라야 해요.',
      pitfall: '중요한 내용이 뒤에 있으면 잘려서 정보가 사라질 수 있어요.'
    }
  },
  {
    id: 'pllm-return-tensors',
    lang: 'python',
    title: '텐서로 변환',
    file: 'tensors.py',
    code: `from transformers import AutoTokenizer


tok = AutoTokenizer.from_pretrained('bert-base-uncased')
enc = tok('hello world', return_tensors='pt')
print(enc['input_ids'].shape)`,
    explain: {
      concept: 'return_tensors는 결과를 그냥 리스트가 아니라 계산용 배열(텐서)로 만들어줘요. 재료를 모델이 바로 쓸 수 있는 상자에 담는 거예요.',
      terms: [
        { t: "return_tensors='pt'", d: '파이토치(PyTorch) 텐서로 만들어줘요.' },
        { t: '.shape', d: '텐서의 모양(행/열 크기)을 알려줘요.' },
        { t: "enc['input_ids']", d: '변환된 토큰 번호 텐서를 꺼내요.' }
      ],
      why: '모델에 넣을 때는 텐서 형태여야 계산이 돼요.',
      pitfall: "'pt'는 파이토치, 'tf'는 텐서플로라서 모델과 안 맞으면 에러나요."
    }
  },
  {
    id: 'pllm-automodel-load',
    lang: 'python',
    title: 'AutoModel 불러오기',
    file: 'model_load.py',
    code: `from transformers import AutoModel


model = AutoModel.from_pretrained('bert-base-uncased')
print(model.config.hidden_size)`,
    explain: {
      concept: 'AutoModel은 모델 이름만 넣으면 알맞은 신경망(모델) 구조를 찾아 만들어줘요. 뼈대를 통째로 가져오는 것과 같아요.',
      terms: [
        { t: 'AutoModel', d: '모델 종류를 자동으로 골라주는 클래스예요.' },
        { t: 'model.config', d: '모델의 설정값(크기, 층 수 등)을 담은 주머니예요.' },
        { t: 'hidden_size', d: '모델이 한 토큰을 표현하는 벡터의 길이예요.' }
      ],
      why: '직접 구조를 지정하지 않아도 모델별 올바른 구조를 쓸 수 있어요.',
      pitfall: 'AutoModel은 숨김층까지만 가져오고, 분류용 머리(head)는 없어요.'
    }
  },
  {
    id: 'pllm-model-forward',
    lang: 'python',
    title: '모델에 입력 넣기',
    file: 'forward.py',
    code: `from transformers import AutoTokenizer, AutoModel


tok = AutoTokenizer.from_pretrained('bert-base-uncased')
model = AutoModel.from_pretrained('bert-base-uncased')
enc = tok('hello world', return_tensors='pt')
out = model(**enc)
print(out.last_hidden_state.shape)`,
    explain: {
      concept: '토큰을 모델에 넣으면 각 토큰마다 의미를 담은 숫자 묶음(벡터)을 내뱉어요. 재료를 넣으면 반죽이 나오는 기계 같아요.',
      terms: [
        { t: '**enc', d: '딕셔너리의 키-값을 모델 매개변수에 풀어서 넣어요.' },
        { t: 'model(...)', d: '모델에 입력을 넣어 계산(순전파)하는 호출이에요.' },
        { t: 'last_hidden_state', d: '마지막 층에서 나온 토큰별 벡터 묶음이에요.' }
      ],
      why: '모델이 문장을 이해한 결과(표현)를 얻으려고 해요.',
      pitfall: '입력 텐서와 모델이 같은 장치(CPU/GPU)에 있어야 해요.'
    }
  },
  {
    id: 'pllm-pipeline-classify',
    lang: 'python',
    title: 'pipeline 감성 분류',
    file: 'pipeline_cls.py',
    code: `from transformers import pipeline


clf = pipeline('text-classification')
result = clf('I love this!')
print(result)`,
    explain: {
      concept: 'pipeline은 토큰화→모델→결과 해석까지 한 번에 해주는 자동 기계예요. 버튼 하나 누르면 음료가 나오는 자판기 같아요.',
      terms: [
        { t: "pipeline('text-classification')", d: '문장의 긍/부정을 판별하는 파이프라인을 만들어요.' },
        { t: 'clf(...)', d: '문장을 넣으면 라벨과 점수를 묶어 돌려줘요.' },
        { t: 'result', d: '모델이 판별한 결과가 담긴 변수예요.' }
      ],
      why: '복잡한 단계를 몰라도 한 줄로 모델을 쓸 수 있어요.',
      pitfall: '처음 호출하면 모델을 다운로드해 시간이 걸려요.'
    }
  },
  {
    id: 'pllm-pipeline-ner',
    lang: 'python',
    title: 'pipeline 개체명 인식',
    file: 'pipeline_ner.py',
    code: `from transformers import pipeline


ner = pipeline('ner', aggregation_strategy='simple')
result = ner('Apple is in California')
print(result)`,
    explain: {
      concept: '개체명 인식(NER)은 문장에서 사람, 장소, 회사 같은 이름표를 달아주는 일이에요. 문장을 읽으며 중요한 단어에 형광펜 치는 것과 같아요.',
      terms: [
        { t: "pipeline('ner')", d: '개체명 인식 파이프라인을 만들어요.' },
        { t: "aggregation_strategy='simple'", d: '서브워드로 쪼개진 토큰들을 같은 단어끼리 합쳐서 깔끔하게 보여줘요.' },
        { t: 'result', d: '인식된 엔티티 이름·종류·점수가 담긴 리스트예요.' }
      ],
      why: '문서에서 중요한 단어만 뽑아 정리할 때 써요.',
      pitfall: 'aggregation_strategy를 지정하지 않으면 서브워드 토큰(예: ##nia)이 낱낱이 쪼개져 결과가 지저분하게 나와요. aggregation_strategy="simple"을 꼭 넣어주세요.'
    }
  },
  {
    id: 'pllm-pipeline-generation',
    lang: 'python',
    title: 'pipeline 텍스트 생성',
    file: 'pipeline_gen.py',
    code: `from transformers import pipeline


gen = pipeline('text-generation')
result = gen('Once upon a time', max_new_tokens=10)
print(result[0]['generated_text'])`,
    explain: {
      concept: '텍스트 생성은 문장의 시작을 주면 이어서 다음 단어들을 만들어주는 기능이에요. 동화의 첫 문장을 주면 뒤를 이어 써주는 것과 같아요.',
      terms: [
        { t: "pipeline('text-generation')", d: '이어서 글을 써주는 파이프라인이에요.' },
        { t: 'max_new_tokens', d: '새로 만들 단어의 최대 개수예요.' },
        { t: "result[0]['generated_text']", d: '생성된 전체 글을 꺼내요.' }
      ],
      why: '자동 작문, 챗봇 같은 곳에 쓰여요.',
      pitfall: 'max_new_tokens을 너무 크게 하면 오래 걸리고 같은 말이 반복될 수 있어요.'
    }
  },
  {
    id: 'pllm-pipeline-qa',
    lang: 'python',
    title: 'pipeline 질의응답',
    file: 'pipeline_qa.py',
    code: `from transformers import pipeline


qa = pipeline('question-answering')
r = qa(question='Where is Paris', context='Paris is in France')
print(r['answer'])`,
    explain: {
      concept: '질의응답(QA)은 본문(context) 속에서 질문의 답을 찾아 발췌해주는 기능이에요. 사서에게 책을 주고 답을 찾아달라 부탁하는 것과 같아요.',
      terms: [
        { t: "pipeline('question-answering')", d: '질문과 본문을 받아 답을 찾는 파이프라인이에요.' },
        { t: 'context', d: '답이 들어있는 본문(근거)이에요.' },
        { t: "r['answer']", d: '모델이 발췌한 정답 문구예요.' }
      ],
      why: '긴 문서에서 원하는 정보만 빠르게 찾을 수 있어요.',
      pitfall: '본문에 답이 없으면 엉뚱한 부분을 답으로 내놓을 수 있어요.'
    }
  },
  {
    id: 'pllm-pipeline-summarize',
    lang: 'python',
    title: 'pipeline 요약',
    file: 'pipeline_summ.py',
    code: `from transformers import pipeline


summ = pipeline('summarization')
text = (
    'Python is a versatile programming language created by Guido van Rossum. '
    'It emphasizes code readability and simplicity. '
    'Python is widely used in web development, data science, and automation. '
    'Many large companies such as Google and Netflix rely on Python for their systems.'
)
r = summ(text, max_length=60, min_length=10)
print(r[0]['summary_text'])`,
    explain: {
      concept: '요약(summarization)은 긴 글을 짧게 줄여 핵심만 남기는 기능이에요. 긴 영화를 예고편으로 압축하는 것과 같아요.',
      terms: [
        { t: "pipeline('summarization')", d: '본문을 짧게 줄여주는 파이프라인이에요.' },
        { t: 'max_length', d: '요약 결과의 최대 토큰 길이예요. min_length보다 반드시 커야 해요.' },
        { t: "r[0]['summary_text']", d: '요약된 글을 꺼내요.' }
      ],
      why: '긴 기사나 문서를 빠르게 훑어보려고 써요.',
      pitfall: 'max_length가 모델 기본 min_length(56)보다 작으면 ValueError가 나요. max_length는 충분히 크게, min_length는 명시적으로 작게 설정해야 해요.'
    }
  },
  {
    id: 'pllm-pipeline-zeroshot',
    lang: 'python',
    title: 'pipeline 제로샷 분류',
    file: 'pipeline_zero.py',
    code: `from transformers import pipeline


clf = pipeline('zero-shot-classification')
r = clf('I love sunny days', candidate_labels=['weather', 'food'])
print(r['labels'])`,
    explain: {
      concept: '제로샷 분류는 미리 안 가르쳐준 라벨들 중에서 가장 알맞은 것을 골라줘요. 보기만 주면 정답을 찍는 학생 같아요.',
      terms: [
        { t: "pipeline('zero-shot-classification')", d: '보기만 주고 분류하는 파이프라인이에요.' },
        { t: 'candidate_labels', d: '고를 수 있는 정답 보기들이에요.' },
        { t: "r['labels']", d: '점수 높은 순으로 정렬된 라벨들이에요.' }
      ],
      why: '새로운 주제를 매번 학습 안 시켜도 분류할 수 있어요.',
      pitfall: '보기 단어가 애매하거나 겹치면 분류가 흔들려요.'
    }
  },
  {
    id: 'pllm-pipeline-translate',
    lang: 'python',
    title: 'pipeline 번역',
    file: 'pipeline_tr.py',
    code: `from transformers import pipeline


tr = pipeline('translation_en_to_fr')
r = tr('good morning')
print(r[0]['translation_text'])`,
    explain: {
      concept: '번역(translation) 파이프라인은 한 언어 글을 다른 언어로 바꿔줘요. 영한사전처럼 말이에요.',
      terms: [
        { t: "pipeline('translation_en_to_fr')", d: '영어를 프랑스어로 옮기는 파이프라인이에요.' },
        { t: "r[0]['translation_text']", d: '번역된 결과 글을 꺼내요.' },
        { t: 'tr(...)', d: '번역할 문장을 넣는 호출이에요.' }
      ],
      why: '언어 장벽 없이 글을 옮길 수 있어요.',
      pitfall: '방향(en_to_fr)을 잘못 적으면 엉뚱한 언어 모델을 불러 에러가 나요.'
    }
  },
  {
    id: 'pllm-sentence-encode',
    lang: 'python',
    title: 'SentenceTransformer 임베딩',
    file: 'sentence_encode.py',
    code: `from sentence_transformers import SentenceTransformer


model = SentenceTransformer('all-MiniLM-L6-v2')
vec = model.encode('hello world')
print(vec.shape)`,
    explain: {
      concept: '임베딩(embedding)은 문장의 의미를 숫자 벡터로 바꿔주는 거예요. 문장을 수많은 숫자 좌표의 한 점으로 옮기는 것과 같아요.',
      terms: [
        { t: 'SentenceTransformer', d: '문장을 곧장 벡터로 만들어주는 편한 모델 클래스예요.' },
        { t: 'model.encode', d: '문장을 넣으면 의미 벡터를 돌려줘요.' },
        { t: 'vec.shape', d: '벡터의 길이(차원 수)를 알려줘요.' }
      ],
      why: '문장끼리 의미가 비슷한지 수학(거리)으로 비교하려면 벡터가 필요해요.',
      pitfall: '모델마다 벡터 길이가 달라서 서로 다른 모델의 벡터는 직접 비교하면 안 돼요.'
    }
  },
  {
    id: 'pllm-cosine-sim',
    lang: 'python',
    title: '코사인 유사도',
    file: 'cosine_sim.py',
    code: `from sentence_transformers import SentenceTransformer, util


model = SentenceTransformer('all-MiniLM-L6-v2')
a = model.encode('cat')
b = model.encode('kitten')
print(util.cos_sim(a, b))`,
    explain: {
      concept: '코사인 유사도는 두 벡터가 같은 방향을 가리키는지 -1~1로 재는 척도예요. 1이면 완전히 같은 방향(의미가 같음), -1이면 정반대 방향이에요.',
      terms: [
        { t: 'util.cos_sim', d: '두 벡터의 방향 일치도를 -1~1 범위의 텐서로 반환하는 함수예요.' },
        { t: 'model.encode', d: '각 문장을 의미 벡터로 바꿔요.' },
        { t: 'a, b', d: '비교할 두 문장의 벡터예요.' }
      ],
      why: '의미가 비슷한 문장을 자동으로 찾아내려고 써요.',
      pitfall: '코사인 유사도의 정확한 범위는 -1~1이에요. 언어 임베딩 벡터는 보통 양수 방향이라 실제로는 0~1 사이 값이 자주 나오지만, -1이 가능하다는 점을 기억해야 해요.'
    }
  },
  {
    id: 'pllm-mean-pooling',
    lang: 'python',
    title: '평균 풀링으로 임베딩',
    file: 'mean_pooling.py',
    code: `from transformers import AutoTokenizer, AutoModel


tok = AutoTokenizer.from_pretrained('bert-base-uncased')
model = AutoModel.from_pretrained('bert-base-uncased')
enc = tok('hello world', return_tensors='pt')
out = model(**enc)
pooled = out.last_hidden_state.mean(dim=1)
print(pooled.shape)`,
    explain: {
      concept: '평균 풀링(mean pooling)은 각 토큰의 벡터들을 평균 내어 문장 하나의 벡터로 만드는 방법이에요. 여러 사람의 의견을 한 표로 요약하는 것과 같아요.',
      terms: [
        { t: 'last_hidden_state', d: '토큰마다 하나씩 나온 벡터 묶음이에요.' },
        { t: '.mean(dim=1)', d: '토큰 차원을 따라 평균을 내요.' },
        { t: 'pooled', d: '문장 전체를 대표하는 하나의 벡터예요.' }
      ],
      why: '문장 단위 비교를 하려면 토큰 묶음을 하나로 줄여야 해요.',
      pitfall: '단일 문장에는 패딩이 없어서 이 코드는 괜찮아요. 하지만 여러 문장을 배치로 처리할 때는 패딩된 위치를 attention_mask로 제외하고 평균을 내야 올바른 임베딩이 나와요.'
    }
  },
  {
    id: 'pllm-batch-encode',
    lang: 'python',
    title: '문장 묶음 임베딩',
    file: 'batch_encode.py',
    code: `from sentence_transformers import SentenceTransformer


model = SentenceTransformer('all-MiniLM-L6-v2')
vecs = model.encode(['cat', 'dog', 'fish'])
print(vecs.shape)`,
    explain: {
      concept: 'encode에 문장 리스트를 넣으면 여러 문장을 한 번에 벡터로 만들어줘요. 한 번에 여러 장 복사하는 복합기 같아요.',
      terms: [
        { t: "['cat', 'dog', 'fish']", d: '여러 문장을 리스트로 넣어요.' },
        { t: 'vecs.shape', d: '(문장 수, 벡터 길이) 모양이 나와요.' },
        { t: 'model.encode', d: '문장들을 한 번에 벡터로 바꿔요.' }
      ],
      why: '한 번에 묶어 처리하면 한 문장씩 부르는 것보다 훨씬 빨라요.',
      pitfall: '한 번에 너무 많이 넣으면 메모리가 부족해질 수 있어요.'
    }
  }
];
