import type { Snippet } from '../../types';

export const pythonServing: Snippet[] = [
  {
    id: 'pserve-vllm-basic',
    lang: 'python',
    title: 'vLLM 기본 추론',
    file: 'vllm_basic.py',
    code: `from vllm import LLM


llm = LLM(model='facebook/opt-125m')
out = llm.generate(['안녕하세요, '])
print(out[0].outputs[0].text)`,
    explain: {
      concept: 'vLLM은 그래픽카드(GPU) 메모리를 알뜰하게 써서 큰 모델을 빠르게 실행해 주는 엔진이에요. 자동차에 터보를 단 것과 같아요.',
      terms: [
        { t: 'LLM', d: 'vLLM에서 모델을 통째로 올려 실행하는 클래스예요.' },
        { t: 'model', d: '사용할 모델 이름이나 경로예요.' },
        { t: 'generate', d: '문장 여러 개를 받아 한 번에 답을 만들어요.' },
        { t: 'outputs[0].text', d: '첫 번째 결과에서 생성된 글자 부분이에요.' }
      ],
      why: 'vLLM은 메모리 재사용 기술로 일반 transformers보다 수 배 빨라요.',
      pitfall: '모델 크기에 비해 GPU 메모리가 부족하면 실행 직후 에러가 나요.'
    }
  },
  {
    id: 'pserve-vllm-sampling',
    lang: 'python',
    title: 'vLLM 샘플링 파라미터',
    file: 'vllm_sampling.py',
    code: `from vllm import LLM, SamplingParams


llm = LLM(model='facebook/opt-125m')
sp = SamplingParams(temperature=0.7, top_p=0.9, max_tokens=64)
out = llm.generate(['이야기를 시작해 줘'], sp)
print(out[0].outputs[0].text)`,
    explain: {
      concept: 'SamplingParams는 답변의 성격을 정하는 다이얼이에요. 온도를 높이면 창의적, 낮추면 안정적으로 나와요.',
      terms: [
        { t: 'SamplingParams', d: '창의성과 길이 등 답변 규칙을 담는 상자예요.' },
        { t: 'temperature', d: '높을수록 다양한 단어를 고르는 온도 다이얼이에요.' },
        { t: 'top_p', d: '확률이 높은 단어들만 상자에 담아 그 안에서 고르는 비율이에요.' },
        { t: 'max_tokens', d: '최대로 만들어 낼 단어(토큰) 수예요.' }
      ],
      why: '같은 모델이어도 다이얼에 따라 답이 크게 달라지기 때문이에요.',
      pitfall: 'temperature를 0으로 두면 같은 답만 나와 창의성이 사라져요.'
    }
  },
  {
    id: 'pserve-vllm-batch',
    lang: 'python',
    title: 'vLLM 오프라인 배치 추론',
    file: 'vllm_batch.py',
    code: `from vllm import LLM


llm = LLM(model='facebook/opt-125m')
prompts = ['봄이 오면', '여름이 오면', '가을이 오면']
outs = llm.generate(prompts)
for o in outs:
    print(o.outputs[0].text)`,
    explain: {
      concept: '배치 추론은 여러 질문을 한 번에 모아 처리하는 방식이에요. 한 번에 여러 그릇을 데우는 전자레인지 같아요.',
      terms: [
        { t: 'prompts', d: '한꺼번에 처리할 문장 묶음이에요.' },
        { t: 'outs', d: '각 문장별 결과가 순서대로 담긴 목록이에요.' },
        { t: 'o.outputs[0].text', d: '각 결과의 첫 번째 답 글자예요.' }
      ],
      why: '한 번에 묶으면 GPU 자원을 꽉 채워 속도가 훨씬 빨라요.',
      pitfall: '너무 많이 한 번에 넣으면 메모리가 모자라 실패해요.'
    }
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
    sp = SamplingParams(max_tokens=64)
    async for out in engine.generate('안녕', sp, request_id='1'):
        print(out.outputs[0].text)


asyncio.run(main())`,
    explain: {
      concept: '비동기 엔진은 한 요청을 기다리는 동안 다른 요청을 같이 처리해요. 식당에서 주문 여러 개를 동시에 받는 것과 같아요.',
      terms: [
        { t: 'AsyncLLMEngine', d: '여러 요청을 동시에 처리하는 엔진 클래스예요.' },
        { t: 'AsyncEngineArgs', d: '엔진을 만들 때 필요한 설정 묶음이에요.' },
        { t: 'SamplingParams', d: '생성 길이·온도 등 답변 규칙을 담는 상자예요. generate의 두 번째 인자로 반드시 전달해야 해요.' },
        { t: 'request_id', d: '각 요청을 구분하는 고유 이름표예요.' },
        { t: 'async for', d: '결과가 조금씩 나올 때마다 받는 반복문이에요.' }
      ],
      why: '서버에서 여러 사용자를 동시에 응대하려면 비동기가 필수예요.',
      pitfall: 'SamplingParams를 빠뜨리면 TypeError가 나요. request_id가 겹쳐도 에러가 발생해요.'
    }
  },
  {
    id: 'pserve-vllm-chat',
    lang: 'python',
    title: 'vLLM 채팅 API',
    file: 'vllm_chat.py',
    code: `from vllm import LLM


llm = LLM(model='Qwen/Qwen2-0.5B-Instruct')
msgs = [{'role': 'user', 'content': '안녕!'}]
out = llm.chat(msgs)
print(out[0].outputs[0].text)`,
    explain: {
      concept: '채팅 API는 역할(user, assistant)을 붙여 대화 형식으로 모델에게 건네요. 채팅방의 말풍선처럼 역할을 정해주는 거예요.',
      terms: [
        { t: 'llm.chat', d: '역할이 붙은 메시지 묶음을 넣어 답을 받는 메서드예요.' },
        { t: 'role', d: '말한 사람의 역할(user, assistant 등)이에요.' },
        { t: 'content', d: '각 말풍선에 담긴 글자예요.' }
      ],
      why: '채팅 모델은 역할 구조가 있는 입력을 받도록 학습돼서 더 자연스러워요.',
      pitfall: '비채팅 모델에 chat을 쓰면 역할 표시가 섞여 이상한 답이 나와요.'
    }
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
print(prompt)`,
    explain: {
      concept: '채팅 템플릿은 메시지들을 모델이 익숙한 한 줄 글자로 합쳐주는 양식이에요. 편지를 정해진 양식에 맞춰 쓰는 것과 같아요.',
      terms: [
        { t: 'get_tokenizer', d: '모델에 딸린 토크나이저를 꺼내는 메서드예요.' },
        { t: 'apply_chat_template', d: '메시지 묶음을 한 줄 글자로 합쳐줘요.' },
        { t: 'tokenize', d: 'False면 글자로, True면 번호로 돌려줘요.' },
        { t: 'add_generation_prompt', d: '모델이 답을 시작할 수 있게 끝표시를 붙여요.' }
      ],
      why: '모델마다 양식이 달라서 전용 템플릿을 써야 답 품질이 좋아요.',
      pitfall: 'add_generation_prompt를 빼면 모델이 어디서 답을 시작할지 몰라요.'
    }
  },
  {
    id: 'pserve-ollama-pull',
    lang: 'python',
    title: 'Ollama 모델 다운로드',
    file: 'ollama_pull.py',
    code: `import ollama


ollama.pull('llama3.2:1b')
print('다운로드 완료')`,
    explain: {
      concept: 'Ollama는 로컬 컴퓨터에서 가벼운 모델을 쉽게 실행하는 도구예요. 앱스토어에서 앱을 받듯 모델을 받아요.',
      terms: [
        { t: 'ollama', d: '로컬 모델 실행 파이썬 라이브러리예요.' },
        { t: 'pull', d: '지정한 모델을 컴퓨터로 다운로드하는 함수예요.' },
        { t: 'llama3.2:1b', d: '모델 이름과 크기 태그예요.' }
      ],
      why: '다운로드 한 번 해두면 인터넷 없이도 모델을 쓸 수 있어요.',
      pitfall: '태그를 안 붙이면 기본 크기 버전이 내려와요.'
    }
  },
  {
    id: 'pserve-ollama-generate',
    lang: 'python',
    title: 'Ollama 단문 생성',
    file: 'ollama_generate.py',
    code: `import ollama


res = ollama.generate(model='llama3.2:1b', prompt='인사말을 적어줘')
print(res['response'])`,
    explain: {
      concept: 'generate는 한 번의 질문에 한 번의 답을 받는 단순 방식이에요. 질문-답 end-to-end 편지 같아요.',
      terms: [
        { t: 'ollama.generate', d: '모델에 한 문장을 넣어 답을 받는 함수예요.' },
        { t: 'model', d: '어떤 모델로 답을 만들지 정해요.' },
        { t: 'prompt', d: '모델에게 주는 질문 문장이에요.' },
        { t: 'response', d: '모델이 만들어 낸 답 글자예요.' }
      ],
      why: '대화 맥락이 필요 없는 한 번 질문에 가장 단순해요.',
      pitfall: '이전 대화를 기억하지 못해 매번 새 질문처럼 써야 해요.'
    }
  },
  {
    id: 'pserve-ollama-chat',
    lang: 'python',
    title: 'Ollama 채팅',
    file: 'ollama_chat.py',
    code: `import ollama


msgs = [{'role': 'user', 'content': '안녕!'}]
res = ollama.chat(model='llama3.2:1b', messages=msgs)
print(res['message']['content'])`,
    explain: {
      concept: 'chat은 역할이 붙은 말풍선 묶음을 주고받는 방식이에요. 대화의 흐름을 이어갈 수 있어요.',
      terms: [
        { t: 'ollama.chat', d: '채팅 형식 메시지로 답을 받는 함수예요.' },
        { t: 'messages', d: '역할과 내용이 담긴 말풍선 목록이에요.' },
        { t: 'message', d: '모델이 보낸 답 말풍선이에요.' },
        { t: 'content', d: '답 말풍선의 글자예요.' }
      ],
      why: '이전 말을 이어가는 대화 앱을 만들려면 역할 구조가 필요해요.',
      pitfall: '이전 답을 messages에 안 넣으면 맥락이 끊겨요.'
    }
  },
  {
    id: 'pserve-ollama-stream',
    lang: 'python',
    title: 'Ollama 스트리밍 답변',
    file: 'ollama_stream.py',
    code: `import ollama


for chunk in ollama.chat(
    model='llama3.2:1b',
    messages=[{'role': 'user', 'content': '긴 이야기를 해줘'}],
    stream=True,
):
    print(chunk['message']['content'], end='', flush=True)`,
    explain: {
      concept: '스트리밍은 답이 완성되기를 기다리지 않고 조금씩 흘려 보내는 방식이에요. 호스에서 물이 한 방울씩 떨어지듯 나와요.',
      terms: [
        { t: 'stream', d: 'True로 두면 답을 조각조각 나눠 보내요.' },
        { t: 'chunk', d: '한 번에 떨어지는 답 조각이에요.' },
        { t: 'end', d: 'print의 줄바꿈을 없애는 옵션이에요.' },
        { t: 'flush', d: '버퍼에 쌓지 말고 곧바로 출력해요.' }
      ],
      why: '전체 답이 올 때까지 기다리면 첫 글자가 늦게 보여 사용자 경험이 떨어져요.',
      pitfall: 'flush를 안 쓰면 글자가 한꺼번에 뭉쳐서 나와요.'
    }
  },
  {
    id: 'pserve-tgi-client',
    lang: 'python',
    title: 'TGI 클라이언트 호출',
    file: 'tgi_client.py',
    code: `from huggingface_hub import InferenceClient


client = InferenceClient(model='meta-llama/Llama-3.2-1B-Instruct')
ans = client.text_generation(prompt='안녕!', max_new_tokens=32)
print(ans)`,
    explain: {
      concept: 'TGI는 허깅페이스에서 만든 빠른 서빙 서버예요. 클라이언트로 서버에 부탁해 답을 받아요. 음식 배달 앱으로 주문하는 것과 같아요.',
      terms: [
        { t: 'InferenceClient', d: 'TGI 서버에 요청을 보내는 파이썬 클래스예요.' },
        { t: 'model', d: '사용할 모델 이름이에요.' },
        { t: 'text_generation', d: '한 문장을 넣어 답을 받는 메서드예요.' },
        { t: 'max_new_tokens', d: '최대로 새로 만들 단어 수예요.' }
      ],
      why: '직접 모델을 올리지 않고 서버에 맡기면 가볍고 빨라요.',
      pitfall: '서버 주소를 안 정하면 기본 허깅페이스 서버로 가 느려질 수 있어요.'
    }
  },
  {
    id: 'pserve-tgi-stream',
    lang: 'python',
    title: 'TGI 스트리밍',
    file: 'tgi_stream.py',
    code: `from huggingface_hub import InferenceClient


client = InferenceClient(model='meta-llama/Llama-3.2-1B-Instruct')
for token in client.text_generation(
    prompt='이야기를 해줘', max_new_tokens=64, stream=True
):
    print(token, end='', flush=True)`,
    explain: {
      concept: 'TGI도 답을 한 글자씩 흘려 보낼 수 있어요. stream=True를 켜면 한 조각씩 받아요.',
      terms: [
        { t: 'stream', d: 'True면 답을 조각으로 나눠 보내요.' },
        { t: 'token', d: '한 번에 받는 답 조각 글자예요.' },
        { t: 'max_new_tokens', d: '최대로 만들 단어 수예요.' }
      ],
      why: '사용자가 첫 글자를 빨리 보게 하려면 조각 전송이 필수예요.',
      pitfall: 'stream 없이 받으면 끝날 때까지 빈 화면이 보여요.'
    }
  },
  {
    id: 'pserve-gguf-load',
    lang: 'python',
    title: 'GGUF 모델 로드',
    file: 'gguf_load.py',
    code: `from llama_cpp import Llama


llm = Llama(model_path='llama-3.2-1b-q4_k_m.gguf', n_ctx=2048)
out = llm('안녕하세요', max_tokens=32, stop=['</s>'])
print(out['choices'][0]['text'])`,
    explain: {
      concept: 'GGUF는 큰 모델을 작게 압축해 CPU에서도 실행되게 한 파일 형식이에요. 큰 가방을 접어 작게 만드는 것과 같아요.',
      terms: [
        { t: 'Llama', d: 'GGUF 파일을 읽어 실행하는 클래스예요.' },
        { t: 'model_path', d: 'GGUF 파일 경로예요.' },
        { t: 'n_ctx', d: '모델이 한 번에 기억할 글자 창 크기예요.' },
        { t: "choices[0]['text']", d: "첫 번째 답의 글자 부분이에요. 딕셔너리로 접근해요." }
      ],
      why: '그래픽카드 없이도 노트북에서 모델을 돌릴 수 있어요.',
      pitfall: 'n_ctx가 너무 작으면 긴 문장이 잘려요.'
    }
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
print(llm.n_ctx())`,
    explain: {
      concept: '양자화는 모델의 숫자를 더 적은 자리로 줄여 용량을 가볍게 하는 작업이에요. 사진을 고화질에서 압축 파일로 바꾸는 것과 같아요.',
      terms: [
        { t: 'q4_k_m', d: '4비트로 압축한 양자화 방식 이름이에요.' },
        { t: 'n_gpu_layers', d: 'GPU에 올릴 층 수, 0이면 CPU만 써요.' },
        { t: 'verbose', d: '자세한 로그를 끄는 스위치예요.' },
        { t: 'n_ctx()', d: '현재 설정된 글자 창 크기를 반환하는 메서드예요.' }
      ],
      why: '자릿수를 줄이면 메모리가 적게 들어 작은 기기에서도 돌아가요.',
      pitfall: '너무 강하게 압축하면(예: q2) 답 품질이 뚝 떨어져요.'
    }
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
tok = AutoTokenizer.from_pretrained('TheBloke/Llama-2-7B-Chat-AWQ')
print(model)`,
    explain: {
      concept: 'AWQ는 중요한 숫자만 정밀하게 두고 나머지를 압축하는 방식이에요. 요리에서 중심 재료는 그대로, 양념은 조금 덜 정밀하게 재는 것과 같아요.',
      terms: [
        { t: 'AutoAWQForCausalLM', d: 'AWQ로 압축된 모델을 올리는 클래스예요.' },
        { t: 'from_quantized', d: '이미 압축된 모델을 가져오는 메서드예요.' },
        { t: 'fuse_layers', d: '여러 층을 합쳐 속도를 높이는 옵션이에요.' },
        { t: 'AutoTokenizer', d: '모델에 맞는 토크나이저를 가져오는 클래스예요.' }
      ],
      why: '품질을 거의 유지하면서 메모리를 절반 가까이 줄일 수 있어요.',
      pitfall: 'fuse_layers는 일부 모델에서만 지원돼요, 에러나면 빼요.'
    }
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
calib_data = [
    '파이썬은 쉽고 강력한 언어입니다.',
    '딥러닝 모델을 압축하면 속도가 빨라집니다.',
    '양자화는 가중치의 자릿수를 줄이는 기술입니다.',
]
qcfg = {'w_bit': 4, 'q_group_size': 128, 'zero_point': True}
model.quantize(tok, quant_config=qcfg, calib_data=calib_data)
model.save_quantized('llama2-7b-awq')`,
    explain: {
      concept: '직접 양자화를 하려면 자릿수와 묶음 크기를 정해요. 쌀을 큰 자루에서 작은 봉지로 나누는 기준을 정하는 것과 같아요.',
      terms: [
        { t: 'tokenizer', d: 'quantize()의 첫 번째 필수 인자예요. 캘리브레이션 데이터를 토큰으로 바꾸는 데 사용해요.' },
        { t: 'calib_data', d: '압축 기준을 정하는 데 쓰는 문장 목록이에요. quant_config 뒤에 키워드 인자로 전달해요.' },
        { t: 'w_bit', d: '가중치를 몇 비트로 줄일지 정하는 숫자예요.' },
        { t: 'q_group_size', d: '한 번에 묶어 압축할 단위 크기예요.' },
        { t: 'zero_point', d: '0 위치를 따로 두어 오차를 줄이는 옵션이에요.' },
        { t: 'save_quantized', d: '압축된 모델을 저장하는 메서드예요.' }
      ],
      why: '자신만의 기준으로 모델을 압축하면 목적에 맞게 다듬을 수 있어요.',
      pitfall: 'quantize()의 첫 번째 인자는 반드시 tokenizer여야 해요. calib_data를 첫 자리에 넣으면 TypeError가 발생해요. calib_data는 quant_config 뒤에 키워드 인자로 전달하세요.'
    }
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
      concept: 'vLLM 비동기 엔진과 FastAPI를 이어 LLM 답변을 SSE로 흘려 보내는 서버예요. 라디오 방송처럼 생성되는 글자를 실시간으로 내보내요.',
      terms: [
        { t: 'AsyncLLMEngine', d: '여러 요청을 동시에 처리하는 vLLM 비동기 엔진이에요.' },
        { t: 'StreamingResponse', d: '조금씩 흘려 보내는 응답을 만드는 FastAPI 클래스예요.' },
        { t: 'token_stream', d: 'LLM 토큰을 SSE 형식으로 하나씩 내보내는 비동기 제너레이터예요.' },
        { t: 'media_type', d: 'text/event-stream으로 설정해야 브라우저가 SSE로 인식해요.' },
        { t: 'data:', d: 'SSE 한 줄의 시작을 알리는 표시예요. 뒤에 빈 줄이 두 개 와야 해요.' }
      ],
      why: '사용자가 전체 답을 기다리지 않고 첫 글자부터 바로 볼 수 있어 경험이 좋아요.',
      pitfall: 'request_id가 요청마다 달라야 해요. 같은 id를 재사용하면 엔진이 혼동해 오류가 나요.'
    }
  },
  {
    id: 'pserve-sse-client',
    lang: 'python',
    title: 'OpenAI 호환 스트리밍 클라이언트',
    file: 'openai_stream_client.py',
    code: `from openai import OpenAI

# vLLM 서버가 OpenAI 호환 엔드포인트를 제공할 때 사용
client = OpenAI(
    base_url='http://localhost:8000/v1',
    api_key='dummy',
)

stream = client.chat.completions.create(
    model='facebook/opt-125m',
    messages=[{'role': 'user', 'content': '안녕!'}],
    stream=True,
)
for chunk in stream:
    delta = chunk.choices[0].delta.content or ''
    print(delta, end='', flush=True)`,
    explain: {
      concept: 'vLLM 서버는 OpenAI API 형식으로도 요청을 받아요. openai 패키지로 서버 주소만 바꾸면 LLM 답변을 스트리밍으로 받을 수 있어요.',
      terms: [
        { t: 'base_url', d: 'vLLM 서버 주소로 교체해 로컬 모델에 접속해요.' },
        { t: 'stream', d: 'True면 답을 조각조각 나눠 받아요.' },
        { t: 'chunk.choices[0].delta.content', d: '스트리밍 조각에서 새로 추가된 글자를 꺼내요.' },
        { t: 'flush', d: '버퍼에 쌓지 않고 글자가 나오는 즉시 출력해요.' }
      ],
      why: 'OpenAI 호환 인터페이스를 쓰면 코드 변경 없이 vLLM·TGI 등 다양한 서버를 바꿔 쓸 수 있어요.',
      pitfall: 'vLLM 서버가 실행 중이지 않으면 ConnectionError가 나요. 서버를 먼저 시작하세요.'
    }
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
print('use_cache 설정값:', model.config.use_cache)

ids = tok('안녕하세요', return_tensors='pt')['input_ids']
with torch.no_grad():
    out = model(ids)
# past_key_values가 있으면 KV Cache가 활성화된 것
print('KV Cache 활성화:', out.past_key_values is not None)`,
    explain: {
      concept: 'KV Cache는 앞서 계산한 중간 결과를 두어 다음 글자를 빠르게 만드는 메모장이에요. 시험에서 푼 풀이를 지우지 않고 옆에 두는 것과 같아요.',
      terms: [
        { t: 'AutoModelForCausalLM', d: '문장 이어쓰기 모델을 올리는 클래스예요.' },
        { t: 'use_cache', d: 'KV 메모장을 쓸지 정하는 스위치예요.' },
        { t: 'past_key_values', d: '이전 토큰 계산 결과가 담긴 캐시 묶음이에요. None이 아니면 캐시가 동작 중이에요.' },
        { t: 'torch.no_grad()', d: '추론 시 불필요한 기울기 계산을 꺼서 메모리를 아껴요.' }
      ],
      why: '같은 앞부분을 다시 계산하지 않아 답이 훨씬 빨라요.',
      pitfall: '학습 모드에서는 켜두면 메모리가 꼬여 에러가 나요.'
    }
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
print(batch['input_ids'].shape)`,
    explain: {
      concept: '배치 추론은 짧은 문장을 가장 긴 문장 길이에 맞춰 빈 칸을 채워요. 서랍마다 같은 크기 상자를 맞추는 것과 같아요.',
      terms: [
        { t: 'padding', d: '짧은 문장에 빈 칸을 채워 길이를 맞추는 옵션이에요.' },
        { t: 'return_tensors', d: '결과를 어떤 형태(pytorch 텐서 등)로 돌려줄지 정해요.' },
        { t: 'input_ids', d: '각 문장의 토큰 번호 줄이에요.' },
        { t: 'shape', d: '결과 묶음의 행/열 크기예요.' }
      ],
      why: '한 묶음을 동시에 처리하려면 길이가 모두 같아야 해요.',
      pitfall: '가장 긴 문장 기준으로 채우므로 짧은 문장이 많으면 빈 칸이 낭비돼요.'
    }
  }
];
