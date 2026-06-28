import type { Snippet } from '../../types';

export const pythonServing: Snippet[] = [
  {
    id: 'pserve-vllm-basic',
    lang: 'python',
    title: 'vLLM 기본 추론',
    file: 'vllm_basic.py',
    code: `from vllm import LLM


llm = LLM(model='facebook/opt-125m')
print("[실행] LLM 모델 로드 완료 — facebook/opt-125m")
out = llm.generate(['안녕하세요, '])
print(f"[결과] 생성된 텍스트: {out[0].outputs[0].text}")`,
    explain: {
      concept:
        'vLLM은 LLM(대규모 언어 모델)을 GPU에서 빠르게 실행시켜 주는 추론 엔진이에요. ' +
        'PagedAttention이라는 메모리 관리 기술로 GPU 메모리를 알뜰하게 써서, 일반 transformers 라이브러리로 실행할 때보다 수 배 빠른 처리 속도를 보여줘요. ' +
        'LLM 클래스 하나로 모델 로드부터 텍스트 생성까지 한 번에 처리할 수 있어서, 코드가 매우 간결해요. ' +
        '여러분이 로컬 GPU 서버에 LLM을 올려서 API 서비스를 만들 때 이 vLLM이 가장 널리 쓰이는 엔진이에요.',
      terms: [
        { t: 'LLM', d: 'vLLM에서 모델을 GPU에 올리고 추론을 실행하는 핵심 클래스예요.' },
        { t: "model='facebook/opt-125m'", d: 'HuggingFace 허브에서 다운로드할 모델 이름이에요. 작은 모델로 빠르게 테스트할 수 있어요.' },
        { t: 'llm.generate([...])', d: '문자열 리스트를 받아 각각에 대한 텍스트 생성을 한 번에 실행해요(배치 처리).' },
        { t: 'out[0].outputs[0].text', d: '첫 번째 입력의 첫 번째 생성 결과에서 실제 텍스트 부분만 꺼내요.' },
      ],
      why:
        'GPU 메모리를 효율적으로 관리해서 throughput(처리량)이 크게 늘어나고, 여러 사용자의 요청을 동시에 처리하는 서버 환경에서 비용 대비 성능이 가장 뛰어나요.',
      expectedOutput:
        '[실행] LLM 모델 로드 완료 — facebook/opt-125m\n[결과] 생성된 텍스트: 안녕하세요, 저는 오늘 처음으로 이곳에 왔습니다.',
      realWorldUsage:
        '실제 LLM 서빙 서버에서 vLLM을 백엔드로 띄워두고, FastAPI나 OpenAI 호환 엔드포인트로 클라이언트 요청을 받아 처리해요. GPU 서버 한 대로 동시에 수백 명의 사용자 요청을 소화할 수 있어요.',
      pitfall:
        '모델 크기에 비해 GPU VRAM이 부족하면 "CUDA out of memory" 오류가 발생해요. 모델 크기를 확인하고 충분한 GPU 메모리가 있는지 먼저 체크해야 해요.',
    },
  },
  {
    id: 'pserve-vllm-sampling',
    lang: 'python',
    title: 'vLLM 샘플링 파라미터',
    file: 'vllm_sampling.py',
    code: `from vllm import LLM, SamplingParams


llm = LLM(model='facebook/opt-125m')
sp = SamplingParams(temperature=0.7, top_p=0.9, max_tokens=64)
print(f"[실행] SamplingParams — temperature={sp.temperature}, top_p={sp.top_p}, max_tokens={sp.max_tokens}")
out = llm.generate(['이야기를 시작해 줘'], sp)
print(f"[결과] 생성된 텍스트: {out[0].outputs[0].text}")`,
    explain: {
      concept:
        'SamplingParams는 모델이 텍스트를 생성할 때의 "성격"을 결정하는 다이얼이에요. ' +
        'temperature(온도)는 창의성의 정도를 조절하는데, 0에 가까우면 항상 비슷한 답변을 내고 1 이상이면 예측 불가능한 다양한 답변이 나와요. ' +
        'top_p는 확률이 높은 단어들만 누적 확률 p까지 후보로 삼아 샘플링하는 방식으로, 너무 엉뚱한 단어가 선택되는 걸 막아줘요. ' +
        'max_tokens는 한 번에 생성할 최대 토큰 수로, 이 길이를 넘으면 답변이 잘려요.',
      terms: [
        { t: 'SamplingParams', d: '텍스트 생성의 창의성·길이·반복 억제 등을 담은 설정 객체예요.' },
        { t: 'temperature=0.7', d: '0~2 사이 값으로, 높을수록 다양한 단어를 고르고 낮을수록 보수적으로 선택해요.' },
        { t: 'top_p=0.9', d: '누적 확률이 90%가 되는 단어들 안에서만 다음 단어를 선택해요. 엉뚱한 단어를 걸러줘요.' },
        { t: 'max_tokens=64', d: '생성할 최대 토큰 수예요. 이 값을 넘으면 텍스트가 중간에 잘려요.' },
      ],
      why:
        '같은 모델이라도 이 파라미터에 따라 "사실 위주 보수적 답변"에서 "창의적 스토리텔링"까지 완전히 다른 결과가 나와요. 상황에 맞는 파라미터 튜닝이 필수예요.',
      expectedOutput:
        '[실행] SamplingParams — temperature=0.7, top_p=0.9, max_tokens=64\n[결과] 생성된 텍스트: 이야기를 시작해 줘.\n\n옛날 옛적에, 작은 마을에 한 소녀가 살고 있었어요...',
      realWorldUsage:
        '챗봇 서비스에서 "정보 검색" 모드일 때는 temperature=0.1로 정확한 답변을 유도하고, "창의적 글쓰기 도우미" 모드일 때는 temperature=0.9로 전환하는 식으로 파라미터를 동적으로 조정해요.',
      pitfall:
        'temperature=0으로 설정하면 항상 같은 입력에 같은 답변만 나와요. 창의성이 전혀 없어지기 때문에, 대화형 서비스에서는 보통 0.3~0.8 사이 값을 사용해요.',
    },
  },
  {
    id: 'pserve-vllm-batch',
    lang: 'python',
    title: 'vLLM 오프라인 배치 추론',
    file: 'vllm_batch.py',
    code: `from vllm import LLM


llm = LLM(model='facebook/opt-125m')
prompts = ['봄이 오면', '여름이 오면', '가을이 오면']
print(f"[실행] 배치 추론 — {len(prompts)}개 프롬프트")
outs = llm.generate(prompts)
for i, o in enumerate(outs):
    print(f"[결과 {i+1}] {prompts[i]}{o.outputs[0].text}")`,
    explain: {
      concept:
        '배치(batch) 추론은 여러 개의 입력을 GPU에 한 번에 올려서 동시에 처리하는 방식이에요. ' +
        '전자레인지에 여러 그릇을 한 번에 데우면 시간이 절약되듯이, GPU도 여러 입력을 동시에 처리하면 개별 처리할 때보다 전체 시간이 훨씬 단축돼요. ' +
        '오프라인 배치는 서비스 요청을 실시간으로 받는 게 아니라, 미리 준비된 데이터셋 전체를 한 번에 처리할 때 사용해요. ' +
        '대량의 문서를 요약하거나, 학습 데이터를 생성하는 등의 배치 작업에 적합해요.',
      terms: [
        { t: 'prompts', d: '한 번에 처리할 입력 문자열 리스트예요. GPU 메모리가 허용하는 만큼 담을 수 있어요.' },
        { t: 'llm.generate(prompts)', d: '리스트 전체를 GPU에 올려 병렬로 추론을 실행해요.' },
        { t: 'outs', d: '입력 순서와 동일한 순서로 생성 결과가 담긴 리스트예요.' },
        { t: 'o.outputs[0].text', d: '각 입력에 대한 첫 번째 생성 결과의 텍스트를 꺼내요.' },
      ],
      why:
        'GPU는 병렬 연산에 특화되어 있어서, 입력을 하나씩 처리하면 GPU 자원이 남아돌아요. 배치로 묶어서 한 번에 넣으면 GPU 활용률이 90% 이상으로 올라가고 처리 속도도 비약적으로 빨라져요.',
      expectedOutput:
        '[실행] 배치 추론 — 3개 프롬프트\n[결과 1] 봄이 오면 꽃이 피고 따뜻한 날씨가 시작됩니다.\n[결과 2] 여름이 오면 해변이 사람들로 북적입니다.\n[결과 3] 가을이 오면 나뭇잎이 붉게 물듭니다.',
      realWorldUsage:
        '전자상거래에서 10만 개의 상품 설명을 밤새 배치 추론으로 한국어 번역하거나 요약하는 작업에 사용해요. 실시간 응답이 필요 없고 대량 처리가 중요한 야간 배치 작업에서 필수예요.',
      pitfall:
        'prompts 리스트가 너무 길어서 GPU 메모리를 초과하면 OOM(Out of Memory) 오류가 발생해요. 이럴 때는 prompts를 더 작은 배치로 나눠서 여러 번 generate를 호출해야 해요.',
    },
  },
  {
    id: 'pserve-vllm-async',
    lang: 'python',
    title: 'vLLM 비동기 엔진',
    file: 'vllm_async.py',
    code: `import asyncio
from vllm import AsyncEngineArgs, AsyncLLMEngine, SamplingParams


async def main():
    engine = AsyncLLMEngine.from_engine_args(
        AsyncEngineArgs(model='facebook/opt-125m')
    )
    print("[실행] AsyncLLMEngine 생성 완료")
    sp = SamplingParams(max_tokens=64)
    async for out in engine.generate('안녕', sp, request_id='1'):
        text = out.outputs[0].text
        print(f"[스트리밍] {text}", end='', flush=True)
    print()


asyncio.run(main())
print("[완료]")`,
    explain: {
      concept:
        '비동기 엔진(AsyncLLMEngine)은 한 요청의 응답을 기다리는 동안 다른 요청을 동시에 처리할 수 있는 방식이에요. ' +
        '동기 방식이 하나의 계산대라면, 비동기 방식은 여러 계산대를 동시에 운영하는 것과 같아요. ' +
        'async for 문법을 통해 모델이 토큰을 생성할 때마다 즉시 받아볼 수 있어서(스트리밍), 사용자 경험이 훨씬 좋아져요. ' +
        '실제 서버 환경에서는 여러 사용자의 요청이 동시에 들어오기 때문에, 비동기 엔진이 사실상 필수예요. ' +
        'FastAPI 같은 비동기 웹 프레임워크와 궁합이 특히 좋아요.',
      terms: [
        { t: 'AsyncLLMEngine', d: '여러 요청을 동시에 비동기로 처리하는 vLLM 엔진 클래스예요.' },
        { t: 'AsyncEngineArgs', d: '비동기 엔진을 생성할 때 필요한 모델 경로·GPU 설정 등을 담는 설정 객체예요.' },
        { t: 'SamplingParams(max_tokens=64)', d: '최대 생성 토큰 수를 64로 제한하는 샘플링 설정이에요. generate()의 두 번째 인자로 필수 전달해요.' },
        { t: "request_id='1'", d: '각 요청을 구분하는 고유 식별자예요. 서로 다른 요청은 다른 ID를 써야 해요.' },
        { t: 'async for out in engine.generate(...)', d: '비동기 스트리밍으로 토큰이 생성될 때마다 받아 처리하는 반복문이에요.' },
      ],
      why:
        '실제 서비스에서는 동시에 수십~수백 명이 LLM을 사용해요. 동기 방식으로는 앞 사람의 요청이 끝날 때까지 다음 사람이 무한정 기다려야 해서 서비스가 불가능해요.',
      expectedOutput:
        '[실행] AsyncLLMEngine 생성 완료\n[스트리밍] 안녕하세요! 무엇을 도와드릴까요?\n[완료]',
      realWorldUsage:
        '챗봇 서비스의 FastAPI 서버에서 각 사용자 요청을 asyncio.create_task()로 비동기 태스크로 만들어 AsyncLLMEngine에 전달해요. 수백 명이 동시에 질문해도 각자 자기 응답을 스트리밍으로 받을 수 있어요.',
      pitfall:
        'SamplingParams를 generate() 호출 시 빠뜨리면 TypeError가 발생해요. 또한 request_id를 여러 요청에서 동일하게 쓰면 엔진이 요청을 혼동해서 오류가 나요.',
    },
  },
  {
    id: 'pserve-vllm-chat',
    lang: 'python',
    title: 'vLLM 채팅 API',
    file: 'vllm_chat.py',
    code: `from vllm import LLM


llm = LLM(model='Qwen/Qwen2-0.5B-Instruct')
print("[실행] 채팅 모델 로드 완료 — Qwen2-0.5B-Instruct")
msgs = [{'role': 'user', 'content': '안녕!'}]
out = llm.chat(msgs)
print(f"[결과] 어시스턴트 응답: {out[0].outputs[0].text}")`,
    explain: {
      concept:
        '채팅 API(llm.chat)는 역할(role)이 붙은 메시지 리스트를 입력으로 받아 대화 맥락을 이해하고 답변을 생성하는 방식이에요. ' +
        'user(사용자), assistant(모델 응답), system(시스템 지시) 같은 역할 태그가 각 말풍선에 붙어서, 모델이 "누가 한 말인지"를 구분할 수 있어요. ' +
        '일반 generate()가 단순 텍스트 입력이라면, chat()은 멀티턴 대화에 최적화된 인터페이스예요. ' +
        'Qwen2, Llama3, GPT 같은 채팅 전용 모델은 이 역할 구조가 있을 때 훨씬 자연스럽게 응답해요.',
      terms: [
        { t: 'llm.chat(msgs)', d: '역할이 붙은 메시지 리스트를 입력으로 받아 대화 응답을 생성해요.' },
        { t: "role: 'user'", d: '이 메시지의 발신자가 사용자임을 나타내는 역할 태그예요.' },
        { t: "content: '안녕!'", d: '각 역할이 실제로 전달하는 텍스트 내용이에요.' },
        { t: 'Qwen/Qwen2-0.5B-Instruct', d: '채팅에 최적화된 instruct(지시 이행) 모델이에요. 작은 크기로 테스트하기 좋아요.' },
      ],
      why:
        '멀티턴 대화에서는 이전 대화 내역을 messages 리스트에 누적해 계속 전달해야 맥락을 유지할 수 있어요. chat()은 이 구조를 그대로 받아서 편리하게 처리해줘요.',
      expectedOutput:
        '[실행] 채팅 모델 로드 완료 — Qwen2-0.5B-Instruct\n[결과] 어시스턴트 응답: 안녕하세요! 무엇을 도와드릴까요?',
      realWorldUsage:
        '실제 챗봇 애플리케이션에서 사용자가 "오늘 날씨 알려줘"라고 한 뒤 이어서 "내일은?"이라고 물으면, messages 리스트에 이전 assistant 응답까지 포함시켜서 전달해 맥락을 이해시켜요.',
      pitfall:
        '비채팅 모델(예: 기본 GPT-2)에 chat()을 사용하면 역할 태그가 텍스트로 그대로 노출되어 이상한 출력이 나와요. 반드시 Instruct 또는 Chat 계열 모델을 사용해야 해요.',
    },
  },
  {
    id: 'pserve-vllm-template',
    lang: 'python',
    title: 'vLLM 채팅 템플릿 적용',
    file: 'vllm_template.py',
    code: `from vllm import LLM


llm = LLM(model='Qwen/Qwen2-0.5B-Instruct')
msgs = [{'role': 'user', 'content': '안녕!'}]
prompt = llm.get_tokenizer().apply_chat_template(
    msgs, tokenize=False, add_generation_prompt=True
)
print(f"[결과] 템플릿 적용된 프롬프트:\\n{prompt}")`,
    explain: {
      concept:
        '채팅 템플릿은 역할이 붙은 메시지들을 모델이 학습 시 봤던 실제 입력 형식(특수 토큰 포함)으로 변환해주는 포맷터예요. ' +
        '모델마다 "user: ... assistant: ..." 같은 형식이 다르기 때문에, 각 모델에 맞는 전용 템플릿을 적용해야 모델이 입력을 제대로 이해해요. ' +
        'apply_chat_template()은 이 변환을 자동으로 해주는 메서드로, tokenize=False로 설정하면 사람이 읽을 수 있는 문자열로 결과를 확인할 수 있어요. ' +
        'add_generation_prompt=True는 "이제 모델이 답할 차례"라는 끝 표시를 추가해서, 모델이 어디서부터 이어서 답변을 생성할지 알려줘요.',
      terms: [
        { t: 'get_tokenizer()', d: '모델에 연결된 토크나이저(텍스트↔토큰 변환기)를 가져오는 메서드예요.' },
        { t: 'apply_chat_template(msgs, tokenize=False)', d: '메시지 리스트를 모델 형식 문자열로 변환해요. tokenize=False면 문자열로 반환해요.' },
        { t: 'add_generation_prompt=True', d: '모델이 응답을 시작하도록 어시스턴트 역할의 시작 토큰을 끝에 추가해요.' },
        { t: 'prompt', d: '변환된 최종 입력 문자열로, 모델이 학습 시 본 것과 동일한 형식이에요.' },
      ],
      why:
        '모델마다 채팅 형식이 모두 달라서, 템플릿 없이 직접 문자열을 조합하면 형식 오류로 인해 모델이 엉뚱한 답변을 해요. 템플릿을 쓰면 이런 문제를 원천 차단할 수 있어요.',
      expectedOutput:
        '[결과] 템플릿 적용된 프롬프트:\n<|im_start|>user\n안녕!<|im_end|>\n<|im_start|>assistant\n',
      realWorldUsage:
        '여러 오픈소스 모델을 바꿔가며 실험할 때, 각 모델별로 템플릿을 수동으로 작성할 필요 없이 apply_chat_template() 하나로 자동 변환할 수 있어서 실험 속도가 크게 빨라져요.',
      pitfall:
        'add_generation_prompt=False로 두면 모델이 어디서 답을 시작해야 할지 몰라서 "user: 안녕! assistant: user: 안녕!..."처럼 자기 혼자 대화를 반복하는 현상이 생겨요.',
    },
  },
  {
    id: 'pserve-ollama-pull',
    lang: 'python',
    title: 'Ollama 모델 다운로드',
    file: 'ollama_pull.py',
    code: `import ollama


print("[실행] llama3.2:1b 모델 다운로드 중...")
ollama.pull('llama3.2:1b')
print("[완료] 모델 다운로드 완료")`,
    explain: {
      concept:
        'Ollama는 로컬 컴퓨터에서 LLM을 가장 쉽게 실행할 수 있게 해주는 도구예요. ' +
        '앱스토어에서 앱을 다운로드하듯, pull() 명령 한 줄로 원하는 모델을 내 컴퓨터로 가져올 수 있어요. ' +
        '모델 이름 뒤에 :1b, :8b 같은 크기 태그를 붙여서 원하는 크기의 모델을 선택할 수 있고, 한 번 다운로드해두면 인터넷 연결 없이도 계속 사용할 수 있어요. ' +
        'GPU가 없는 노트북에서도 작은 모델(1b~3b)은 무리 없이 실행돼서, LLM 학습과 실험의 진입 장벽을 크게 낮춰줘요.',
      terms: [
        { t: 'ollama.pull(...)', d: 'HuggingFace나 Ollama 레지스트리에서 모델 파일을 로컬로 다운로드하는 함수예요.' },
        { t: "'llama3.2:1b'", d: '다운로드할 모델 이름과 크기 태그예요. 1b는 10억 파라미터 모델을 뜻해요.' },
        { t: 'ollama', d: '로컬 LLM 실행을 간편하게 해주는 파이썬 라이브러리예요.' },
      ],
      why:
        '클라우드 API 비용을 들이지 않고 로컬에서 무료로 LLM을 실험할 수 있어서, 학습과 프로토타이핑 비용이 0원이에요. 오프라인 환경에서도 동작해서 보안이 중요한 기업 환경에서도 쓸 수 있어요.',
      expectedOutput:
        '[실행] llama3.2:1b 모델 다운로드 중...\n[완료] 모델 다운로드 완료',
      realWorldUsage:
        '개인 PC에서 Ollama로 llama3.2를 pull 받아서, VS Code의 Continue 플러그인과 연동해 로컬 AI 코딩 어시스턴트로 사용해요. API 키 없이 무료로 동작하는 개인 비서가 생기는 셈이에요.',
      pitfall:
        '태그(:1b)를 생략하면 기본 크기 버전이 다운로드되는데, 이게 내 컴퓨터의 RAM/VRAM 용량을 초과할 수 있어요. 다운로드 전에 모델 크기를 꼭 확인해야 해요.',
    },
  },
  {
    id: 'pserve-ollama-generate',
    lang: 'python',
    title: 'Ollama 단문 생성',
    file: 'ollama_generate.py',
    code: `import ollama


res = ollama.generate(model='llama3.2:1b', prompt='인사말을 적어줘')
print(f"[결과] 생성된 응답: {res['response']}")`,
    explain: {
      concept:
        'generate()는 한 번의 질문에 한 번의 답변을 받는 가장 단순한 Ollama 호출 방식이에요. ' +
        '이전 대화 맥락 없이 독립적인 질문-답변을 주고받을 때 적합하고, 코드가 가장 짧아서 Ollama 입문용으로 좋아요. ' +
        '내부적으로는 전체 응답이 완성될 때까지 기다렸다가 한 번에 결과를 반환하기 때문에, 긴 응답의 경우 사용자가 기다리는 시간이 길어질 수 있어요. ' +
        '대화 맥락이 필요한 경우에는 generate() 대신 chat()을 사용해야 해요.',
      terms: [
        { t: 'ollama.generate(...)', d: '프롬프트 하나를 넣어 전체 응답을 한 번에 받는 함수예요.' },
        { t: "model='llama3.2:1b'", d: '추론에 사용할 로컬 모델을 지정해요. pull()로 미리 다운로드해둔 모델이어야 해요.' },
        { t: "prompt='인사말을 적어줘'", d: '모델에게 전달할 지시문이에요. 채팅 역할 없이 순수 텍스트로 전달돼요.' },
        { t: "res['response']", d: '응답 딕셔너리에서 모델이 생성한 텍스트를 꺼내요.' },
      ],
      why:
        '번역, 요약, 감정 분석처럼 맥락이 필요 없는 단발성 작업에서는 generate()로 충분하고 코드도 가장 짧아서 생산성이 높아요.',
      expectedOutput:
        '[결과] 생성된 응답: 안녕하세요! 만나서 반갑습니다. 오늘은 어떤 도움이 필요하신가요?',
      realWorldUsage:
        '데이터 파이프라인에서 수천 개의 제품 리뷰를 한 줄씩 generate()로 감정 분석(긍정/부정)하는 배치 작업에 사용해요. 각 리뷰가 독립적이므로 맥락 관리가 필요 없어요.',
      pitfall:
        'generate()는 이전 대화를 기억하지 못해요. "내일 날씨는?"이라고 물어본 뒤 "모레는?"이라고 이어 물으면, 모델은 "내일 날씨"를 모른 채 엉뚱한 답을 해요. 대화가 필요하면 chat()을 쓰세요.',
    },
  },
  {
    id: 'pserve-ollama-chat',
    lang: 'python',
    title: 'Ollama 채팅',
    file: 'ollama_chat.py',
    code: `import ollama


msgs = [{'role': 'user', 'content': '안녕!'}]
res = ollama.chat(model='llama3.2:1b', messages=msgs)
print(f"[결과] 어시스턴트: {res['message']['content']}")`,
    explain: {
      concept:
        'chat()은 roles(역할)이 붙은 메시지 리스트로 대화를 주고받는 인터페이스예요. ' +
        '대화가 진행될수록 messages 리스트에 이전 assistant 응답과 새 user 메시지를 누적해서 계속 전달하면, 모델이 전체 대화 맥락을 이해하고 자연스럽게 응답해요. ' +
        'generate()와 달리 대화의 흐름을 유지할 수 있어서, 멀티턴 챗봇을 만들 때 반드시 chat()을 써야 해요. ' +
        '응답은 res["message"]["content"] 경로로 접근하며, message 객체 안에 role과 content가 함께 담겨 있어요.',
      terms: [
        { t: 'ollama.chat(...)', d: '역할이 있는 메시지 리스트로 대화를 주고받는 함수예요.' },
        { t: "messages=msgs", d: '대화 내역이 담긴 메시지 리스트를 전달해요. 이전 assistant 응답도 포함시켜야 해요.' },
        { t: "res['message']['content']", d: 'Ollama 응답 딕셔너리에서 모델의 텍스트 응답을 꺼내는 경로예요.' },
        { t: "role: 'user'", d: '이 메시지가 사용자의 말임을 나타내요. assistant나 system 역할도 쓸 수 있어요.' },
      ],
      why:
        '사용자가 여러 번 주고받는 대화형 AI를 만들 때는 매번 대화 전체 맥락을 전달해야 자연스러운 응답이 나와요. chat()이 이 구조를 깔끔하게 처리해줘요.',
      expectedOutput:
        '[결과] 어시스턴트: 안녕하세요! 반갑습니다. 무엇을 도와드릴까요?',
      realWorldUsage:
        '슬랙 봇이나 카카오톡 챗봇에서 사용자와의 대화 세션마다 messages 리스트를 유지하면서, 새 메시지가 올 때마다 누적된 messages로 chat()을 호출해 자연스러운 대화 흐름을 만들어요.',
      pitfall:
        '이전 assistant 응답을 messages에 추가하지 않고 user 메시지만 계속 보내면, 모델이 "매번 처음 보는 대화"라고 생각해서 맥락 없는 답변을 해요.',
    },
  },
  {
    id: 'pserve-ollama-stream',
    lang: 'python',
    title: 'Ollama 스트리밍 답변',
    file: 'ollama_stream.py',
    code: `import ollama


print("[실행] 스트리밍 시작")
for chunk in ollama.chat(
    model='llama3.2:1b',
    messages=[{'role': 'user', 'content': '긴 이야기를 해줘'}],
    stream=True,
):
    print(chunk['message']['content'], end='', flush=True)
print()
print("[완료] 스트리밍 종료")`,
    explain: {
      concept:
        '스트리밍(stream=True)은 모델이 전체 응답을 다 만들 때까지 기다리지 않고, 토큰이 생성될 때마다 조금씩 클라이언트에 전송하는 방식이에요. ' +
        '사용자 입장에서는 첫 글자가 0.2초 만에 나타나기 시작해서, 마치 실시간으로 AI가 타이핑하는 듯한 경험을 줘요. ' +
        'flush=True는 파이썬의 출력 버퍼를 강제로 비워서 글자가 버퍼에 쌓이지 않고 즉시 화면에 나타나게 해줘요. ' +
        '실제 웹 서비스에서는 이 스트리밍 응답을 SSE(Server-Sent Events)나 WebSocket을 통해 브라우저에 전달해요.',
      terms: [
        { t: 'stream=True', d: 'Ollama에 응답을 토큰 단위로 스트리밍하라고 지시하는 플래그예요.' },
        { t: 'chunk', d: '스트리밍의 각 조각으로, chunk["message"]["content"]에 새로 생성된 텍스트가 담겨요.' },
        { t: "end=''", d: 'print()의 기본 줄바꿈을 빈 문자열로 바꿔서 연속 출력되게 해요.' },
        { t: 'flush=True', d: '출력 버퍼를 강제로 비워서 글자가 지연 없이 즉시 콘솔에 보이도록 해요.' },
      ],
      why:
        '사용자가 10초 동안 빈 화면을 보고 기다리는 것과, 첫 글자가 바로 나타나는 것은 체감 품질에서 하늘과 땅 차이예요. 스트리밍은 LLM 서비스 UX의 기본이에요.',
      expectedOutput:
        '[실행] 스트리밍 시작\n옛날 옛적에, 깊은 숲속에 작은 마을이 있었습니다...[완료] 스트리밍 종료',
      realWorldUsage:
        'ChatGPT의 웹 인터페이스에서 답변이 한 글자씩 타이핑되며 나타나는 기능이 바로 이 스트리밍 방식이에요. Ollama로 로컬에서도 동일한 UX를 구현할 수 있어요.',
      pitfall:
        'flush=True를 빼먹으면 글자가 파이썬 출력 버퍼에 쌓여 있다가 한꺼번에 출력돼서, 스트리밍 효과가 전혀 나타나지 않아요.',
    },
  },
  {
    id: 'pserve-tgi-client',
    lang: 'python',
    title: 'TGI 클라이언트 호출',
    file: 'tgi_client.py',
    code: `from huggingface_hub import InferenceClient


client = InferenceClient(model='meta-llama/Llama-3.2-1B-Instruct')
print("[실행] TGI InferenceClient 생성 — Llama-3.2-1B-Instruct")
ans = client.text_generation(prompt='안녕!', max_new_tokens=32)
print(f"[결과] 생성된 텍스트: {ans}")`,
    explain: {
      concept:
        'TGI(Text Generation Inference)는 HuggingFace가 만든 LLM 서빙 서버예요. ' +
        'InferenceClient를 사용하면 직접 모델을 GPU에 올리지 않고도, 원격 TGI 서버에 요청을 보내 추론 결과를 받을 수 있어요. ' +
        '마치 음식 배달 앱으로 주문하면 주방에서 요리해서 가져다주는 것처럼, 무거운 모델 관리는 서버가 하고 우리는 가벼운 클라이언트 코드만 작성하면 돼요. ' +
        '서버 주소를 따로 지정하지 않으면 HuggingFace의 무료 추론 API로 요청이 전송돼서, 당장 GPU가 없어도 테스트할 수 있어요.',
      terms: [
        { t: 'InferenceClient', d: 'TGI 서버에 텍스트 생성 요청을 보내는 경량 클라이언트예요.' },
        { t: "model='meta-llama/Llama-3.2-1B-Instruct'", d: '서버에서 추론에 사용할 모델 식별자예요.' },
        { t: "prompt='안녕!'", d: '모델에게 전달할 입력 텍스트예요.' },
        { t: 'max_new_tokens=32', d: '새로 생성할 최대 토큰(단어 조각) 수예요. 입력 토큰은 포함되지 않아요.' },
      ],
      why:
        '직접 GPU 서버를 관리하지 않고도 최신 LLM을 쓸 수 있어서 인프라 비용이 절감되고, 여러 모델을 쉽게 바꿔가며 실험할 수 있어요.',
      expectedOutput:
        '[실행] TGI InferenceClient 생성 — Llama-3.2-1B-Instruct\n[결과] 생성된 텍스트: 안녕하세요! 무엇을 도와드릴까요?',
      realWorldUsage:
        '스타트업에서 자체 GPU 서버 구축 대신 HuggingFace Inference Endpoint를 구독하고, InferenceClient로 회원가입 이메일 자동 생성 기능을 구현해요. 월 구독료만 내면 바로 서비스 가능해요.',
      pitfall:
        '서버 주소를 명시적으로 지정하지 않으면 무료 HuggingFace API로 라우팅돼서, 호출 제한(rate limit)에 걸리거나 응답 지연이 발생할 수 있어요.',
    },
  },
  {
    id: 'pserve-tgi-stream',
    lang: 'python',
    title: 'TGI 스트리밍',
    file: 'tgi_stream.py',
    code: `from huggingface_hub import InferenceClient


client = InferenceClient(model='meta-llama/Llama-3.2-1B-Instruct')
print("[실행] TGI 스트리밍 시작")
for token in client.text_generation(
    prompt='이야기를 해줘', max_new_tokens=64, stream=True
):
    print(token, end='', flush=True)
print()
print("[완료] 스트리밍 종료")`,
    explain: {
      concept:
        'TGI도 stream=True 옵션을 켜면 응답을 한 토큰씩 스트리밍으로 받을 수 있어요. ' +
        'Ollama의 스트리밍과 원리는 같지만, TGI는 토큰 문자열을 바로 yield 하기 때문에 chunk["message"]["content"] 같은 중첩 접근 없이 바로 print할 수 있어서 코드가 더 깔끔해요. ' +
        'max_new_tokens로 응답 길이를 제한하지 않으면 모델이 끝없이 텍스트를 생성할 수 있으니, 항상 적절한 제한을 걸어두는 게 좋아요.',
      terms: [
        { t: 'stream=True', d: 'TGI 서버에 응답을 토큰 단위로 스트리밍하도록 지시하는 플래그예요.' },
        { t: 'token', d: '스트리밍으로 받은 각 텍스트 조각이에요. TGI는 토큰을 문자열로 직접 반환해요.' },
        { t: "end='', flush=True", d: '줄바꿈 없이 즉시 콘솔에 출력해서 스트리밍 효과를 구현해요.' },
        { t: 'max_new_tokens=64', d: '최대 64개 토큰까지만 생성하고 스트리밍을 멈춰요.' },
      ],
      why:
        '스트리밍이 없으면 사용자는 전체 응답이 올 때까지 빈 화면을 봐야 해서 이탈률이 높아져요. 0.5초 만에 첫 글자를 보여주는 것만으로도 사용자 유지율이 크게 올라요.',
      expectedOutput:
        '[실행] TGI 스트리밍 시작\n옛날 옛적에, 깊은 숲속 마을에...[완료] 스트리밍 종료',
      realWorldUsage:
        'HuggingFace의 Inference Endpoint를 백엔드로 사용하는 웹 서비스에서, text_generation(stream=True)의 결과를 SSE로 래핑해서 프론트엔드에 실시간 타이핑 효과를 제공해요.',
      pitfall:
        'stream=False(기본값)로 호출하면 서버가 전체 응답을 다 만든 후에야 한 번에 반환해요. 긴 응답일수록 HTTP 타임아웃에 걸릴 위험이 커지니, 길이 100 토큰 이상이면 stream=True가 안전해요.',
    },
  },
  {
    id: 'pserve-gguf-load',
    lang: 'python',
    title: 'GGUF 모델 로드',
    file: 'gguf_load.py',
    code: `from llama_cpp import Llama


llm = Llama(model_path='llama-3.2-1b-q4_k_m.gguf', n_ctx=2048)
print("[실행] GGUF 모델 로드 완료 — n_ctx=2048")
out = llm('안녕하세요', max_tokens=32, stop=['</s>'])
print(f"[결과] 생성된 텍스트: {out['choices'][0]['text']}")`,
    explain: {
      concept:
        'GGUF는 대형 언어 모델을 양자화(압축)해서 CPU에서도 실행 가능하게 만든 파일 형식이에요. ' +
        '원래 모델이 GPU 전용이었다면, GGUF로 변환된 버전은 일반 노트북 CPU에서도 무리 없이 돌아가요. ' +
        'llama_cpp 라이브러리는 이 GGUF 파일을 읽어서 C++ 수준의 속도로 추론을 실행해줘요. ' +
        'n_ctx는 모델이 한 번에 "기억"할 수 있는 컨텍스트 창 크기(토큰 수)로, 이 값을 넘는 대화는 앞부분이 잘려요. ' +
        '그래픽카드 없이도 LLM을 경험할 수 있게 해주는, 접근성 측면에서 아주 중요한 기술이에요.',
      terms: [
        { t: 'Llama', d: 'llama_cpp 라이브러리에서 GGUF 모델 파일을 로드하고 추론하는 핵심 클래스예요.' },
        { t: "model_path='...q4_k_m.gguf'", d: 'GGUF 형식으로 압축된 모델 파일 경로예요. q4는 4비트 양자화를 의미해요.' },
        { t: 'n_ctx=2048', d: '컨텍스트 창 크기를 2048 토큰으로 설정해요. 이 범위를 넘는 이전 대화는 기억하지 못해요.' },
        { t: "stop=['</s>']", d: '모델이 이 문자열을 생성하면 즉시 생성을 멈추도록 하는 정지 토큰이에요.' },
        { t: "out['choices'][0]['text']", d: 'OpenAI API와 유사한 응답 구조에서 생성된 텍스트를 꺼내요.' },
      ],
      why:
        'GPU가 없는 환경(저사양 노트북, 라즈베리파이 등)에서도 LLM을 구동할 수 있어서, AI 접근성과 오프라인 사용 가능성이 크게 좋아져요.',
      expectedOutput:
        '[실행] GGUF 모델 로드 완료 — n_ctx=2048\n[결과] 생성된 텍스트: 안녕하세요! 저는 오늘 처음으로 이곳에 왔습니다.',
      realWorldUsage:
        '인터넷이 제한된 병원이나 법률 사무소에서 민감한 문서를 외부 API로 전송하지 않고, GGUF 모델을 로컬에서 실행해 문서 요약·분류를 처리하는 온프레미스 AI 솔루션에 사용해요.',
      pitfall:
        'n_ctx가 너무 작으면(예: 512) 긴 문서를 한 번에 처리하지 못하고 잘려서, 요약이나 번역 품질이 급격히 떨어져요. 반대로 너무 크면 RAM 사용량이 폭증해서 시스템이 느려져요.',
    },
  },
  {
    id: 'pserve-gguf-quant',
    lang: 'python',
    title: 'GGUF 양자화 수준 선택',
    file: 'gguf_quant.py',
    code: `from llama_cpp import Llama


llm = Llama(
    model_path='llama-3.2-1b-q4_k_m.gguf',
    n_gpu_layers=0,
    verbose=False,
)
ctx = llm.n_ctx()
print(f"[결과] 컨텍스트 창 크기: {ctx}")
print(f"[정보] n_gpu_layers=0 → CPU 전용 모드")`,
    explain: {
      concept:
        '양자화(Quantization)는 모델의 가중치(숫자들)를 더 적은 비트로 표현해서 파일 크기와 메모리 사용량을 줄이는 기법이에요. ' +
        'q4_k_m 같은 표기는 "4비트로 양자화했고, k_m 방식의 중간 품질"을 의미해요. ' +
        'n_gpu_layers=0으로 설정하면 모든 연산을 CPU에서만 수행해서, GPU가 없는 환경에서도 동작해요. ' +
        '양자화 수준이 낮을수록(q2, q3) 파일은 작아지지만 모델 품질이 떨어지고, 높을수록(q5, q8) 원본에 가까운 품질을 유지해요. ' +
        '평소에는 q4_k_m 정도가 품질과 속도의 균형이 가장 좋다고 알려져 있어요.',
      terms: [
        { t: 'q4_k_m', d: '4비트 양자화 + k-quant medium 품질을 의미하는 GGUF 파일 태그예요.' },
        { t: 'n_gpu_layers=0', d: 'GPU로 오프로드할 레이어 수를 0으로 설정해 CPU만 사용하는 모드예요.' },
        { t: 'verbose=False', d: 'llama_cpp의 상세 로그 출력을 억제해서 콘솔을 깔끔하게 유지해요.' },
        { t: 'llm.n_ctx()', d: '현재 로드된 모델의 컨텍스트 창 크기를 반환하는 메서드예요.' },
      ],
      why:
        '적절한 양자화 수준을 선택하면 품질 손실을 최소화하면서도 메모리 사용량을 1/4로 줄일 수 있어서, 제한된 하드웨어에서 최대 성능을 뽑을 수 있어요.',
      expectedOutput:
        '[결과] 컨텍스트 창 크기: 2048\n[정보] n_gpu_layers=0 → CPU 전용 모드',
      realWorldUsage:
        '엣지 디바이스(스마트폰, IoT 기기)에 탑재할 온디바이스 AI 모델을 선정할 때, q4_k_m → q2_k로 점점 압축률을 높여가며 "허용 가능한 품질下限"을 찾는 실험을 해요.',
      pitfall:
        'q2_k 같은 극단적 압축은 모델 품질이 현저히 떨어져서 말이 어색해지거나 사실을 왜곡할 수 있어요. 서비스 용도라면 q4_k_m 이상을 권장해요.',
    },
  },
  {
    id: 'pserve-awq-load',
    lang: 'python',
    title: 'AWQ 양자화 모델 로드',
    file: 'awq_load.py',
    code: `from awq import AutoAWQForCausalLM
from transformers import AutoTokenizer


model = AutoAWQForCausalLM.from_quantized(
    'TheBloke/Llama-2-7B-Chat-AWQ', fuse_layers=True
)
print("[실행] AWQ 양자화 모델 로드 완료")
tok = AutoTokenizer.from_pretrained('TheBloke/Llama-2-7B-Chat-AWQ')
print(f"[정보] 토크나이저 로드 완료 — vocab_size={tok.vocab_size}")
print(f"[정보] 모델 타입: {type(model).__name__}")`,
    explain: {
      concept:
        'AWQ(Activation-aware Weight Quantization)는 중요한 가중치는 정밀하게 보존하고 덜 중요한 가중치만 압축하는 똑똑한 양자화 방식이에요. ' +
        '요리에서 주재료(중요 가중치)는 정확히 계량하고 양념(덜 중요한 가중치)은 대충 넣는 것과 같은 원리예요. ' +
        '기존 방식들은 모든 가중치를 일률적으로 압축해서 중요한 정보까지 손실되는 문제가 있었는데, AWQ는 활성화(activation) 분포를 분석해 중요한 채널을 자동으로 식별해 보호해요. ' +
        'fuse_layers=True로 설정하면 여러 연산 레이어를 하나로 합쳐서 추론 속도를 더 높일 수 있어요.',
      terms: [
        { t: 'AutoAWQForCausalLM', d: 'AWQ 방식으로 양자화된 모델을 로드하고 추론하는 클래스예요.' },
        { t: 'from_quantized(...)', d: '이미 양자화된 모델을 HuggingFace 허브나 로컬 경로에서 불러오는 메서드예요.' },
        { t: 'fuse_layers=True', d: '인접한 레이어들을 하나로 합쳐서 연산 효율을 높이는 최적화 옵션이에요.' },
        { t: 'AutoTokenizer.from_pretrained(...)', d: '모델과 동일한 경로에서 토크나이저를 자동으로 찾아 로드해요.' },
      ],
      why:
        'AWQ는 품질 저하를 거의 체감할 수 없으면서도 메모리를 절반 가까이 줄일 수 있어서, GPU 메모리가 부족한 환경에서도 큰 모델을 돌릴 수 있게 해줘요.',
      expectedOutput:
        '[실행] AWQ 양자화 모델 로드 완료\n[정보] 토크나이저 로드 완료 — vocab_size=32000\n[정보] 모델 타입: AutoAWQForCausalLM',
      realWorldUsage:
        'Llama-2-7B 원본 모델은 GPU 메모리가 14GB 필요하지만, AWQ로 양자화된 버전은 4GB로 줄어들어서 RTX 3070(8GB) 같은 중급 GPU에서도 무리 없이 실행할 수 있어요.',
      pitfall:
        'fuse_layers=True는 모든 모델 아키텍처에서 지원되지 않아요. 지원되지 않는 모델에 적용하면 로드 시점에 오류가 발생하니, 해당 옵션을 False로 바꾸고 다시 시도해야 해요.',
    },
  },
  {
    id: 'pserve-awq-config',
    lang: 'python',
    title: 'AWQ 양자화 설정',
    file: 'awq_config.py',
    code: `from awq import AutoAWQForCausalLM
from transformers import AutoTokenizer


model = AutoAWQForCausalLM.from_pretrained('meta-llama/Llama-2-7b-hf')
tok = AutoTokenizer.from_pretrained('meta-llama/Llama-2-7b-hf')
print("[실행] 베이스 모델 로드 완료")

calib_data = [
    '파이썬은 쉽고 강력한 언어입니다.',
    '딥러닝 모델을 압축하면 속도가 빨라집니다.',
    '양자화는 가중치의 자릿수를 줄이는 기술입니다.',
]
qcfg = {'w_bit': 4, 'q_group_size': 128, 'zero_point': True}
model.quantize(tok, quant_config=qcfg, calib_data=calib_data)
print("[실행] 양자화 완료")

model.save_quantized('llama2-7b-awq')
print("[완료] 양자화된 모델 저장 완료 — llama2-7b-awq")`,
    explain: {
      concept:
        '직접 AWQ 양자화를 수행할 때는 비트 수(w_bit), 그룹 크기(q_group_size), 영점 보정(zero_point)을 설정해요. ' +
        'calib_data(캘리브레이션 데이터)는 모델이 "어떤 값이 중요한지" 판단하는 기준으로 사용하는 샘플 문장들이에요. ' +
        '이 데이터를 모델에 통과시켜서 각 레이어의 활성화 분포를 측정한 뒤, 중요한 채널은 정밀하게 보존하고 나머지만 압축해요. ' +
        'quantize()의 첫 번째 인자는 반드시 tokenizer여야 하며, calib_data는 quant_config 뒤에 키워드 인자로 전달해야 해요. ' +
        'save_quantized()로 압축된 모델을 저장해두면 다음부터는 from_quantized()로 바로 불러올 수 있어요.',
      terms: [
        { t: "from_pretrained('meta-llama/Llama-2-7b-hf')", d: '양자화할 원본 모델을 HuggingFace에서 로드해요.' },
        { t: 'calib_data', d: '활성화 분포를 측정할 때 사용하는 대표 문장 샘플이에요. 도메인에 맞는 데이터를 넣으면 품질이 좋아져요.' },
        { t: "w_bit: 4", d: '가중치를 4비트로 압축하겠다는 설정이에요. 4가 일반적으로 품질/속도 균형이 가장 좋아요.' },
        { t: "q_group_size: 128", d: '128개 가중치를 한 그룹으로 묶어 압축해요. 작을수록 정밀하지만 파일이 커져요.' },
        { t: "zero_point: True", d: '0점을 별도로 저장해서 양자화 오차를 줄이는 옵션이에요.' },
        { t: "save_quantized('llama2-7b-awq')", d: '압축된 모델을 지정한 디렉토리에 저장해요.' },
      ],
      why:
        '도메인 특화 데이터로 직접 양자화하면 일반 양자화보다 해당 도메인에서 더 높은 품질의 모델을 얻을 수 있어요. 예를 들어 의료 텍스트로 캘리브레이션하면 의료 QA에 더 강한 압축 모델이 만들어져요.',
      expectedOutput:
        '[실행] 베이스 모델 로드 완료\n[실행] 양자화 완료\n[완료] 양자화된 모델 저장 완료 — llama2-7b-awq',
      realWorldUsage:
        '금융권에서 Llama-2-7B를 금융 상담 데이터로 캘리브레이션해 AWQ 양자화한 뒤, 보안이 중요한 온프레미스 서버에 배포해 고객 상담 챗봇으로 활용해요.',
      pitfall:
        'quantize()의 첫 번째 인자는 반드시 tokenizer예요. calib_data를 첫 번째 인자로 넣으면 TypeError가 발생해요. calib_data는 quant_config 뒤에 키워드 인자(calib_data=...)로 전달해야 해요.',
    },
  },
  {
    id: 'pserve-sse-fastapi',
    lang: 'python',
    title: 'FastAPI + vLLM SSE 스트리밍 서버',
    file: 'sse_vllm_server.py',
    code: `from fastapi import FastAPI
from fastapi.responses import StreamingResponse
from vllm import AsyncEngineArgs, AsyncLLMEngine, SamplingParams

app = FastAPI()
engine = AsyncLLMEngine.from_engine_args(
    AsyncEngineArgs(model='facebook/opt-125m')
)
print("[실행] FastAPI + vLLM 서버 준비 완료")


async def token_stream(prompt: str):
    sp = SamplingParams(max_tokens=64)
    async for out in engine.generate(prompt, sp, request_id='req-1'):
        token = out.outputs[0].text
        yield f'data: {token}\\n\\n'


@app.get('/stream')
async def stream(prompt: str = '안녕하세요'):
    return StreamingResponse(
        token_stream(prompt), media_type='text/event-stream'
    )`,
    explain: {
      concept:
        '이 코드는 FastAPI 웹 서버와 vLLM 비동기 엔진을 연결해서, LLM이 생성하는 텍스트를 SSE(Server-Sent Events) 방식으로 클라이언트에 스트리밍하는 완전한 서버 예제예요. ' +
        'SSE는 서버가 클라이언트에게 지속적으로 데이터를 밀어 넣는 단방향 프로토콜로, 브라우저의 EventSource API가 기본 지원해서 별도 라이브러리 없이도 실시간 스트리밍이 가능해요. ' +
        'token_stream 제너레이터가 비동기로 토큰을 하나씩 생산하면, FastAPI의 StreamingResponse가 이를 SSE 형식(data: ...\n\n)으로 포장해서 클라이언트에 전달해요. ' +
        '이 구조를 기반으로 하면 채팅 인터페이스, 실시간 번역기, 코드 생성기 등 다양한 스트리밍 AI 서비스를 빠르게 구축할 수 있어요.',
      terms: [
        { t: 'FastAPI', d: '비동기 Python 웹 프레임워크로, vLLM의 비동기 엔진과 궁합이 가장 좋아요.' },
        { t: 'StreamingResponse', d: '제너레이터에서 나오는 데이터를 HTTP 응답으로 실시간 스트리밍해주는 FastAPI 응답 클래스예요.' },
        { t: 'token_stream(prompt)', d: 'LLM 토큰을 하나씩 yield 하는 비동기 제너레이터 함수예요.' },
        { t: "media_type='text/event-stream'", d: '응답 Content-Type을 SSE로 설정해서 브라우저가 스트리밍으로 인식하게 해요.' },
        { t: "f'data: {token}\\n\\n'", d: 'SSE 프로토콜의 표준 형식으로, data: 뒤에 내용을 쓰고 빈 줄(\\n\\n)로 구분해요.' },
      ],
      why:
        'ChatGPT 같은 실시간 타이핑 UX를 구현하려면 SSE가 가장 간단하고 안정적인 방법이에요. WebSocket보다 구현이 단순하고 프록시/방화벽과의 호환성도 좋아요.',
      expectedOutput:
        '[실행] FastAPI + vLLM 서버 준비 완료',
      realWorldUsage:
        '실제 서비스에서는 이 FastAPI 앱을 uvicorn으로 실행하고, Nginx를 앞단에 두어 HTTPS와 로드밸런싱을 처리해요. 프론트엔드는 EventSource("/stream?prompt=안녕")로 SSE를 구독해 실시간 응답을 렌더링해요.',
      pitfall:
        'request_id를 하드코딩("req-1")으로 고정하면 동시 요청 시 모든 클라이언트가 같은 ID를 공유해서 엔진 충돌이 발생해요. 실제 서비스에서는 uuid4() 등으로 매 요청마다 고유 ID를 생성해야 해요.',
    },
  },
  {
    id: 'pserve-sse-client',
    lang: 'python',
    title: 'OpenAI 호환 스트리밍 클라이언트',
    file: 'openai_stream_client.py',
    code: `from openai import OpenAI


client = OpenAI(
    base_url='http://localhost:8000/v1',
    api_key='dummy',
)
print("[실행] OpenAI 호환 클라이언트 생성 — localhost:8000")

stream = client.chat.completions.create(
    model='facebook/opt-125m',
    messages=[{'role': 'user', 'content': '안녕!'}],
    stream=True,
)
print("[스트리밍 시작]")
for chunk in stream:
    delta = chunk.choices[0].delta.content or ''
    print(delta, end='', flush=True)
print()
print("[완료]")`,
    explain: {
      concept:
        'vLLM은 OpenAI API와 완전히 동일한 형식의 엔드포인트(/v1)를 기본 제공해요. ' +
        '이 말은 OpenAI의 공식 openai 파이썬 패키지를 그대로 사용해서, base_url만 로컬 vLLM 서버 주소로 바꾸면 모든 기능을 로컬 모델로 쓸 수 있다는 뜻이에요. ' +
        '스트리밍 응답은 chunk.choices[0].delta.content에서 새로 생성된 텍스트 조각을 꺼내면 돼요. ' +
        '이 호환성 덕분에 OpenAI API로 개발된 기존 애플리케이션을 코드 한 줄만 바꿔서 자체 서버로 마이그레이션할 수 있어요.',
      terms: [
        { t: "base_url='http://localhost:8000/v1'", d: 'OpenAI API 대신 로컬 vLLM 서버를 가리키도록 기본 URL을 변경해요.' },
        { t: "api_key='dummy'", d: '로컬 서버는 인증이 필요 없지만, OpenAI 클라이언트가 api_key를 필수로 요구해서 더미 값을 넣어요.' },
        { t: "stream=True", d: '응답을 토큰 단위로 스트리밍하도록 요청해요.' },
        { t: 'chunk.choices[0].delta.content', d: '스트리밍 청크에서 새로 추가된 텍스트 조각을 꺼내요. 첫 청크에는 None일 수 있어 or "" 처리해요.' },
        { t: "flush=True", d: '출력 버퍼를 비워서 각 토큰이 지연 없이 즉시 표시되게 해요.' },
      ],
      why:
        'OpenAI 호환 인터페이스 덕분에 vLLM, TGI, Ollama 등 서로 다른 백엔드 서버를 코드 변경 없이 자유롭게 교체할 수 있어요. 벤더 종속성에서 벗어나는 핵심 전략이에요.',
      expectedOutput:
        '[실행] OpenAI 호환 클라이언트 생성 — localhost:8000\n[스트리밍 시작]\n안녕하세요! 무엇을 도와드릴까요?\n[완료]',
      realWorldUsage:
        'OpenAI API로 개발된 SaaS 제품을 온프레미스로 전환할 때, 기존 코드에서 base_url과 api_key만 바꾸고 vLLM 서버를 띄우면 모든 기능이 그대로 동작해요. 수천 줄의 코드를 전혀 고치지 않아도 돼요.',
      pitfall:
        'vLLM 서버가 실행 중이지 않은 상태에서 클라이언트를 실행하면 ConnectionError가 발생해요. 서버가 먼저 실행 중인지 확인하고, 방화벽이 8000번 포트를 막고 있지 않은지도 체크해야 해요.',
    },
  },
  {
    id: 'pserve-kvcache-enable',
    lang: 'python',
    title: 'KV Cache 사용 설정',
    file: 'kv_cache.py',
    code: `import torch
from transformers import AutoModelForCausalLM, AutoTokenizer

model = AutoModelForCausalLM.from_pretrained('gpt2', use_cache=True)
tok = AutoTokenizer.from_pretrained('gpt2')
print(f"[실행] use_cache={model.config.use_cache}")

ids = tok('안녕하세요', return_tensors='pt')['input_ids']
with torch.no_grad():
    out = model(ids)
cached = out.past_key_values is not None
print(f"[결과] KV Cache 활성화: {cached}")`,
    explain: {
      concept:
        'KV Cache(Key-Value Cache)는 모델이 이전 토큰들의 중간 계산 결과를 저장해두고, 다음 토큰을 생성할 때 재사용하는 메모장 같은 기술이에요. ' +
        '한 글자씩 텍스트를 생성할 때 매번 처음부터 전체 문장을 다시 계산하면 비효율적이기 때문에, 이미 계산한 부분의 결과를 캐시해서 새 토큰만 계산해요. ' +
        'use_cache=True로 설정하면 transformers가 자동으로 이 캐시를 관리해주고, past_key_values에 이전 계산 결과가 저장돼요. ' +
        'torch.no_grad()는 추론 시 불필요한 기울기(gradient) 계산을 비활성화해 메모리를 절약해요. 학습이 아닌 추론에서는 항상 켜두는 게 좋아요.',
      terms: [
        { t: 'use_cache=True', d: 'KV Cache를 활성화하는 스위치예요. False면 매번 전체를 다시 계산해서 매우 느려져요.' },
        { t: 'past_key_values', d: '이전 토큰들의 Key-Value 계산 결과가 저장된 객체예요. None이 아니면 캐시가 동작 중이에요.' },
        { t: "return_tensors='pt'", d: '토크나이저 출력을 PyTorch 텐서로 반환하게 해서 모델에 바로 입력할 수 있어요.' },
        { t: 'torch.no_grad()', d: '추론 시 불필요한 gradient 추적을 비활성화해서 메모리를 절약해요.' },
      ],
      why:
        'KV Cache가 없으면 긴 텍스트를 생성할 때 토큰이 하나 추가될 때마다 전체를 다시 계산해서 O(n²) 시간이 걸려요. 캐시를 쓰면 O(n)으로 줄어서 실시간 서비스가 가능해져요.',
      expectedOutput:
        '[실행] use_cache=True\n[결과] KV Cache 활성화: True',
      realWorldUsage:
        '실제 추론 서버에서 응답 속도가 느리면 use_cache=False로 설정되어 있지 않은지 가장 먼저 확인해요. 캐시가 꺼져 있으면 아무리 GPU가 좋아도 응답이 수십 배 느려져요.',
      pitfall:
        '학습(training) 모드에서 use_cache=True로 두면 backward() 시 gradient가 꼬여서 오류가 발생해요. 학습할 때는 반드시 use_cache=False로 설정해야 해요.',
    },
  },
  {
    id: 'pserve-batch-padding',
    lang: 'python',
    title: '배치 추론 패딩',
    file: 'batch_pad.py',
    code: `from transformers import AutoTokenizer


tok = AutoTokenizer.from_pretrained('gpt2')
batch = tok(
    ['짧은 문장', '조금 더 긴 문장입니다'],
    padding=True,
    return_tensors='pt',
)
shape = batch['input_ids'].shape
print(f"[결과] 배치 텐서 shape: {shape}  (batch_size={shape[0]}, seq_len={shape[1]})")
print(f"[정보] padding 토큰 id: {tok.pad_token_id if tok.pad_token_id else 'gpt2는 기본 pad_token 없음 → eos_token 사용'}")`,
    explain: {
      concept:
        '배치 추론에서 여러 문장을 한 번에 GPU에 넣으려면, 모든 문장의 길이가 같아야 해요. ' +
        'padding=True는 짧은 문장 끝에 특수 토큰(pad_token)을 채워서 가장 긴 문장과 길이를 맞춰주는 기능이에요. ' +
        '이렇게 하면 2D 텐서(배치×길이)로 GPU에 한 번에 올릴 수 있어서 병렬 처리가 가능해져요. ' +
        '다만 GPT-2 같은 일부 모델은 기본 pad_token이 없어서 eos_token을 대신 사용하거나 별도로 지정해줘야 해요.',
      terms: [
        { t: 'padding=True', d: '짧은 문장에 pad 토큰을 채워서 배치 내 모든 문장의 길이를 동일하게 맞추는 옵션이에요.' },
        { t: "return_tensors='pt'", d: '결과를 PyTorch 텐서(다차원 배열) 형식으로 반환해요.' },
        { t: "batch['input_ids']", d: '각 문장이 토큰 ID로 변환된 2D 배열이에요. shape은 (문장 수, 최대 길이)예요.' },
        { t: 'shape', d: '텐서의 차원별 크기를 튜플로 보여줘요. torch.Size([2, 8])이면 2문장 × 최대 8토큰이에요.' },
      ],
      why:
        'GPU는 병렬 연산에 최적화되어 있어서, 텐서 모양이 깔끔한 직사각형일 때 가장 효율적으로 동작해요. 패딩으로 모양을 맞추면 GPU 활용률이 극대화돼요.',
      expectedOutput:
        '[결과] 배치 텐서 shape: torch.Size([2, 8])  (batch_size=2, seq_len=8)\n[정보] padding 토큰 id: gpt2는 기본 pad_token 없음 → eos_token 사용',
      realWorldUsage:
        '리뷰 감정 분석 API에서 100개의 리뷰를 한 배치로 묶어 처리할 때, 트위터 길이 리뷰와 블로그 길이 리뷰가 섞여 있으면 padding으로 길이를 맞춰야 합니다. 안 그러면 shape mismatch 오류가 발생해요.',
      pitfall:
        '가장 긴 문장을 기준으로 패딩하기 때문에, 1개만 엄청 길고 나머지가 짧으면 패딩 토큰이 낭비돼요. 이럴 때는 비슷한 길이끼리 묶는 bucketing 전략을 쓰는 게 좋아요.',
    },
  },
];
