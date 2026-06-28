import type { Snippet } from '../../types';

export const pythonFineTuning: Snippet[] = [
  {
    id: 'pft-lora-config',
    lang: 'python',
    title: 'LoRA 어댑터 설정 만들기',
    file: 'lora_config.py',
    code: `from peft import LoraConfig


config = LoraConfig(
    r=8,
    lora_alpha=16,
    lora_dropout=0.05,
    task_type="CAUSAL_LM",
)
print(f"[실행] LoRA 설정 - r={config.r}, alpha={config.lora_alpha}, dropout={config.lora_dropout}")
print(f"[정보] task_type={config.task_type}")`,
    explain: {
      concept:
        'LoRA(Low-Rank Adaptation)는 거대한 LLM 전체를 재학습하지 않고, 작은 추가 행렬(어댑터)만 붙여서 미세조정하는 효율적인 기법이에요. ' +
        '두꺼운 교과서 내용 전체를 다시 쓰지 않고, 중요한 부분에만 포스트잇을 붙여 수정하는 것과 같은 원리예요. ' +
        '원본 모델의 가중치는 그대로 두고(r=8 같은 작은 행렬만 학습하기 때문에), GPU 메모리 사용량이 1/10 이하로 줄고 학습 속도도 수 배 빨라져요. ' +
        'LoRA 덕분에 개인 노트북 GPU로도 7B 규모의 LLM을 파인튜닝할 수 있게 되었어요.',
      terms: [
        { t: 'LoraConfig', d: 'LoRA 어댑터의 구조와 학습 방식을 정의하는 설정 클래스예요.' },
        { t: 'r=8', d: '저차원 행렬의 랭크(rank)로, 값이 작을수록 적은 파라미터만 학습하고 메모리를 아껴요. 보통 4~64 사이로 설정해요.' },
        { t: 'lora_alpha=16', d: '어댑터의 출력을 원본에 얼마나 강하게 반영할지 조절하는 스케일 팩터예요. r과 함께 튜닝해요.' },
        { t: 'lora_dropout=0.05', d: '과적합(overfitting)을 막기 위해 학습 시 5%의 연결을 무작위로 끄는 정규화 기법이에요.' },
        { t: 'task_type="CAUSAL_LM"', d: '이 모델이 "다음 단어 예측(텍스트 생성)" 용도임을 PEFT에 알려줘요. 번역·분류 등은 다른 task_type을 써요.' },
      ],
      why:
        '전체 파인튜닝은 GPU 메모리를 엄청나게 잡아먹지만, LoRA는 원본 모델을 얼려두고 아주 적은 파라미터만 학습해서 비용과 시간을 획기적으로 줄여줘요. 실무에서 LLM 커스터마이징의 표준 방식이에요.',
      expectedOutput:
        '[실행] LoRA 설정 - r=8, alpha=16, dropout=0.05\n[정보] task_type=CAUSAL_LM',
      realWorldUsage:
        '스타트업에서 오픈소스 Llama-3 모델을 LoRA로 자사 제품 매뉴얼 데이터로 파인튜닝해서, GPU 1대로 하루 만에 기술 지원 챗봇을 만들어 배포해요.',
      pitfall:
        'r 값을 너무 크게 설정하면 어댑터가 커져서 LoRA의 메모리 절감 효과가 사라지고, 너무 작게 설정하면 학습 능력이 부족해서 원하는 성능이 안 나와요.',
    },
  },
  {
    id: 'pft-lora-target-modules',
    lang: 'python',
    title: 'LoRA 적용할 층 고르기',
    file: 'lora_target.py',
    code: `from peft import LoraConfig


config = LoraConfig(
    r=8,
    lora_alpha=16,
    target_modules=["q_proj", "v_proj"],
    task_type="CAUSAL_LM",
)
print(f"[실행] target_modules={config.target_modules}")
print(f"[정보] r={config.r}, alpha={config.lora_alpha}")`,
    explain: {
      concept:
        'LLM 내부에는 수많은 레이어(층)가 있는데, LoRA 어댑터를 모든 층에 붙일 필요는 없어요. ' +
        'target_modules로 특정 층만 지정해서 어댑터를 붙이면, 학습할 파라미터 수를 더 줄이면서도 효과는 유지할 수 있어요. ' +
        'q_proj(Query 투영층)와 v_proj(Value 투영층)는 Attention 메커니즘의 핵심 부분으로, 이 두 곳에만 LoRA를 적용해도 모델의 출력 스타일을 효과적으로 바꿀 수 있어요. ' +
        '모델마다 레이어 이름이 다르므로, 먼저 model.named_modules()로 레이어 목록을 확인한 뒤 target_modules를 결정해야 해요.',
      terms: [
        { t: 'target_modules', d: 'LoRA 어댑터를 붙일 레이어 이름을 담은 리스트예요. 이 리스트에 없는 층은 원본 그대로 유지돼요.' },
        { t: '"q_proj"', d: 'Transformer의 Query를 생성하는 선형 레이어예요. Attention의 "무엇을 찾을까"를 결정해요.' },
        { t: '"v_proj"', d: 'Transformer의 Value를 생성하는 선형 레이어예요. Attention의 "무슨 정보를 가져올까"를 결정해요.' },
      ],
      why:
        '일부 핵심 층에만 LoRA를 적용하면 학습 속도가 더 빨라지고, 과적합 위험도 줄어들어요. 실무에서는 q_proj, v_proj만으로도 대부분의 파인튜닝 목표를 달성할 수 있어요.',
      expectedOutput:
        '[실행] target_modules=[\'q_proj\', \'v_proj\']\n[정보] r=8, alpha=16',
      realWorldUsage:
        'Llama-3-8B 파인튜닝 시 target_modules=["q_proj", "v_proj", "k_proj", "o_proj"]로 4개 Attention 층에만 LoRA를 적용해서, 전체 파라미터의 0.3%만 학습하면서도 채팅 스타일을 자연스럽게 바꿨어요.',
      pitfall:
        '존재하지 않는 레이어 이름을 target_modules에 넣으면 PEFT가 조용히 무시해버려서, LoRA가 하나도 적용되지 않은 채 학습이 진행될 수 있어요. 반드시 print(model)으로 실제 레이어명을 확인하고 설정해야 해요.',
    },
  },
  {
    id: 'pft-peft-get-model',
    lang: 'python',
    title: '모델에 PEFT 어댑터 붙이기',
    file: 'get_peft_model.py',
    code: `from peft import LoraConfig, get_peft_model


config = LoraConfig(r=8, lora_alpha=16, task_type="CAUSAL_LM")
model = load_base_model()
model = get_peft_model(model, config)
print(f"[실행] PEFT 어댑터 부착 완료 - 모델 타입: {type(model).__name__}")
print(f"[정보] 모델이 PeftModel인가? {hasattr(model, 'peft_config')}")`,
    explain: {
      concept:
        'get_peft_model()은 준비된 LoraConfig 설정을 실제 모델에 적용해서 어댑터를 붙여주는 "접착제" 역할을 해요. ' +
        '이 함수가 호출되면 원본 모델의 가중치가 모두 freeze(동결)되고, target_modules로 지정된 층에만 작은 학습 가능한 행렬이 추가돼요. ' +
        '반환되는 모델은 PeftModel 타입으로, 원본 모델의 인터페이스는 그대로 유지하면서 내부적으로 어댑터 연산이 추가된 상태예요. ' +
        '이 시점부터는 model.forward() 호출 시 자동으로 LoRA 가중치가 원본 가중치에 더해져서 계산돼요.',
      terms: [
        { t: 'get_peft_model(model, config)', d: '원본 모델에 LoRA 설정을 적용해 PeftModel로 래핑하는 함수예요.' },
        { t: 'model', d: '원래의 사전학습된 LLM 모델 객체예요. get_peft_model 이후에는 타입이 PeftModel로 바뀌어요.' },
        { t: 'config', d: 'LoraConfig로 정의한 어댑터 설정이에요. r, alpha, target_modules 등이 포함돼 있어요.' },
        { t: "hasattr(model, 'peft_config')", d: '모델이 PeftModel 타입인지 확인하는 방법이에요. PeftModel은 peft_config 속성을 가져요.' },
      ],
      why:
        'get_peft_model 호출 한 줄로 모델 전체 파라미터의 99% 이상을 동결하고 소수만 학습 가능하게 만들어줘서, GPU 메모리를 획기적으로 절약할 수 있어요.',
      expectedOutput:
        '[실행] PEFT 어댑터 부착 완료 - 모델 타입: PeftModelForCausalLM\n[정보] 모델이 PeftModel인가? True',
      realWorldUsage:
        '파인튜닝 스크립트의 진입점에서 model = AutoModelForCausalLM.from_pretrained(...) 직후에 바로 get_peft_model()을 호출해서, 이후의 모든 학습이 LoRA 어댑터에만 적용되도록 설정해요.',
      pitfall:
        'get_peft_model()을 호출하기 전에 모델이 CPU에 있으면 경고가 나고, GPU에 올린 뒤 호출하는 게 성능상 좋아요. 또한 이미 PeftModel인 모델에 다시 호출하면 이중 래핑이 되어 오류가 발생할 수 있어요.',
    },
  },
  {
    id: 'pft-peft-print-trainable',
    lang: 'python',
    title: '학습되는 파라미터 수 확인',
    file: 'print_trainable.py',
    code: `from peft import LoraConfig, get_peft_model


config = LoraConfig(r=8, lora_alpha=16, task_type="CAUSAL_LM")
model = get_peft_model(load_base_model(), config)
model.print_trainable_parameters()`,
    explain: {
      concept:
        'print_trainable_parameters()는 전체 모델 파라미터 중 실제로 학습되는(값이 업데이트되는) 파라미터의 수와 비율을 출력해줘요. ' +
        '큰 가방에서 "실제로 꺼내서 쓸 물건"만 세어보는 것처럼, 수십억 개 중 진짜 학습에 참여하는 게 몇 개인지 한눈에 확인할 수 있어요. ' +
        '일반적으로 전체 파라미터의 0.1%~1%만 학습 가능한 상태로 나오는데, 이게 정상이에요. ' +
        '만약 이 비율이 100%에 가깝게 나온다면 LoRA가 제대로 적용되지 않은 거라서, target_modules나 task_type 설정을 확인해야 해요.',
      terms: [
        { t: 'print_trainable_parameters()', d: '전체 파라미터 수, 학습 가능한 파라미터 수, 그 비율을 콘솔에 출력하는 메서드예요.' },
        { t: 'trainable params', d: 'LoRA 어댑터에 포함되어 실제로 경사하강법으로 업데이트되는 파라미터 개수예요.' },
        { t: 'all params', d: '원본 모델 + 어댑터를 포함한 전체 파라미터 개수예요. 대부분 동결(frozen) 상태예요.' },
      ],
      why:
        '학습 가능 파라미터 수를 확인하면 LoRA 설정이 의도대로 적용됐는지 빠르게 검증할 수 있어요. 10억 파라미터 모델에 학습 가능 100만 개면 정상, 10억 개면 설정 오류예요.',
      expectedOutput:
        'trainable params: 262,144 || all params: 131,815,424 || trainable%: 0.1989',
      realWorldUsage:
        '파인튜닝 디버깅 시 가장 먼저 확인하는 게 print_trainable_parameters()의 출력이에요. trainable%가 0.1% 미만이면 LoRA가 너무 적게 적용된 거고, 5% 이상이면 r 값을 낮춰서 메모리를 더 줄일 수 있어요.',
      pitfall:
        '이 메서드는 PeftModel에서만 사용 가능해요. 일반 transformers 모델에 호출하면 AttributeError가 발생하니, get_peft_model() 이후에 호출해야 해요.',
    },
  },
  {
    id: 'pft-lora-save',
    lang: 'python',
    title: '어댑터만 따로 저장하기',
    file: 'lora_save.py',
    code: `from peft import LoraConfig, get_peft_model


config = LoraConfig(r=8, lora_alpha=16, task_type="CAUSAL_LM")
model = get_peft_model(load_base_model(), config)
model.save_pretrained("./my_adapter")
print("[완료] 어댑터 저장 완료 - ./my_adapter")`,
    explain: {
      concept:
        'save_pretrained()는 원본 모델이 아닌 LoRA 어댑터 가중치만 별도 폴더에 저장해요. ' +
        '전체 모델(여러 GB) 대신 어댑터만(몇 MB) 저장하니까 디스크 공간이 크게 절약되고, 공유도 훨씬 쉬워져요. ' +
        '두꺼운 교과서는 원본을 그대로 두고, 내가 붙인 포스트잇만 따로 모아두는 것과 같아요. ' +
        '나중에 다른 사람이 같은 베이스 모델만 가지고 있으면, 내 어댑터 파일만 받아서 바로 동일한 파인튜닝 효과를 재현할 수 있어요.',
      terms: [
        { t: 'save_pretrained("./my_adapter")', d: 'LoRA 어댑터 가중치와 설정 파일을 지정한 폴더에 저장해요.' },
        { t: '"./my_adapter"', d: '어댑터 파일들이 저장될 폴더 경로예요. adapter_config.json과 adapter_model.bin이 생성돼요.' },
        { t: 'model', d: 'get_peft_model()로 생성된 PeftModel 인스턴스예요. 원본이 아닌 어댑터만 저장해요.' },
      ],
      why:
        '어댑터 파일은 보통 수 MB ~ 수십 MB로 가벼워서, HuggingFace Hub에 업로드하거나 팀원과 이메일로 공유하기도 쉬워요. 원본 모델(GB 단위)을 매번 주고받을 필요가 없어요.',
      expectedOutput:
        '[완료] 어댑터 저장 완료 - ./my_adapter',
      realWorldUsage:
        'HuggingFace Hub에 "my-llama3-korean-chat"이라는 이름으로 LoRA 어댑터만 업로드해서, Llama-3 원본 모델 소유자라면 누구나 한 줄로 한국어 채팅 기능을 추가할 수 있게 공유해요.',
      pitfall:
        'save_pretrained()는 어댑터 가중치만 저장해요. 추론 시 원본 베이스 모델이 반드시 필요하니, 베이스 모델 정보(이름, 버전)를 별도로 기록해두는 게 좋아요.',
    },
  },
  {
    id: 'pft-lora-load',
    lang: 'python',
    title: '저장한 어댑터 불러오기',
    file: 'lora_load.py',
    code: `from peft import PeftModel


base = load_base_model()
model = PeftModel.from_pretrained(base, "./my_adapter")
print(f"[실행] 어댑터 로드 완료 - PeftModel: {isinstance(model, PeftModel)}")
print(f"[정보] 로드된 어댑터 목록: {list(model.peft_config.keys())}")`,
    explain: {
      concept:
        'PeftModel.from_pretrained()는 저장된 LoRA 어댑터 파일을 읽어서 원본 베이스 모델 위에 다시 얹어주는 메서드예요. ' +
        '포스트잇을 다시 교과서에 붙이는 것처럼, 언제든 베이스 모델만 있으면 저장된 어댑터를 재활용할 수 있어요. ' +
        '여러 개의 서로 다른 어댑터를 번갈아 로드해서 하나의 베이스 모델을 다양한 용도로 전환할 수 있는 게 LoRA의 큰 장점이에요. ' +
        'model.peft_config에는 현재 로드된 어댑터의 설정 정보가 딕셔너리로 들어 있어서, 어떤 설정으로 학습됐는지 확인할 수 있어요.',
      terms: [
        { t: 'PeftModel.from_pretrained(base, "./my_adapter")', d: '베이스 모델과 어댑터 경로를 받아 PeftModel로 재구성해요.' },
        { t: 'base', d: '어댑터를 얹을 원본 사전학습 모델이에요. 학습 당시와 동일한 모델이어야 해요.' },
        { t: 'isinstance(model, PeftModel)', d: '로드된 모델이 PeftModel 타입인지 확인해요. True면 어댑터가 정상 적용된 거예요.' },
        { t: 'model.peft_config', d: '현재 로드된 어댑터들의 설정 정보를 담은 딕셔너리예요. 여러 어댑터를 동시에 로드할 수도 있어요.' },
      ],
      why:
        '하나의 베이스 모델에 여러 도메인별 어댑터(의료용, 법률용, 코딩용)를 번갈아 로드하면, GPU 메모리는 하나의 모델만 차지하면서 여러 용도로 쓸 수 있어서 비용 효율이 극대화돼요.',
      expectedOutput:
        '[실행] 어댑터 로드 완료 - PeftModel: True\n[정보] 로드된 어댑터 목록: [\'default\']',
      realWorldUsage:
        '멀티테넌트 SaaS 서비스에서 각 고객사별로 별도 LoRA 어댑터를 학습해두고, 요청이 들어올 때마다 해당 고객사의 어댑터를 동적으로 로드해서 커스터마이즈된 응답을 제공해요.',
      pitfall:
        '베이스 모델이 어댑터 학습 당시와 다르면(예: 다른 버전, 다른 양자화 설정) from_pretrained() 시점에 오류가 발생하거나 추론 결과가 엉망이 될 수 있어요.',
    },
  },
  {
    id: 'pft-lora-merge',
    lang: 'python',
    title: '어댑터를 모델에 합치기',
    file: 'lora_merge.py',
    code: `from peft import PeftModel


base = load_base_model()
model = PeftModel.from_pretrained(base, "./my_adapter")
merged = model.merge_and_unload()
print(f"[실행] merge_and_unload() 완료 - 모델 타입: {type(merged).__name__}")
print(f"[정보] PeftModel인가? {isinstance(merged, PeftModel)}")`,
    explain: {
      concept:
        'merge_and_unload()는 LoRA 어댑터 가중치를 원본 모델 가중치에 영구적으로 더해서 하나로 합친 뒤, 어댑터 레이어를 제거하는 메서드예요. ' +
        '포스트잇 내용을 교과서에 볼펜으로 정식 기재하고 포스트잇을 떼어내는 것과 같아요. ' +
        '합친 뒤에는 더 이상 PeftModel이 아닌 일반 transformers 모델이 되어서, 추론 시 어댑터 연산 오버헤드가 사라지고 속도가 약간 빨라져요. ' +
        '배포용으로 모델을 내보낼 때는 merge_and_unload()로 합친 상태로 저장하는 게 일반적이에요.',
      terms: [
        { t: 'merge_and_unload()', d: 'LoRA 가중치를 베이스 모델에 영구 합산하고 어댑터 레이어를 제거하는 메서드예요.' },
        { t: 'merged', d: '합쳐진 단일 모델이에요. 더 이상 PeftModel이 아니고 일반 transformers 모델로 돌아가요.' },
        { t: 'isinstance(merged, PeftModel)', d: '병합 후 PeftModel이 아닌지 확인해요. False여야 정상적으로 병합된 거예요.' },
        { t: "type(merged).__name__", d: '병합된 모델의 실제 클래스 이름을 확인해요. 원본과 동일한 타입이어야 해요.' },
      ],
      why:
        '배포 시에는 어댑터를 별도로 로드할 필요 없이 단일 모델로 만드는 게 운영이 간편하고 추론 속도도 빠르며, GGUF 변환 등 후속 작업과도 호환성이 좋아요.',
      expectedOutput:
        '[실행] merge_and_unload() 완료 - 모델 타입: LlamaForCausalLM\n[정보] PeftModel인가? False',
      realWorldUsage:
        '파인튜닝 완료 후 merge_and_unload() → save_pretrained()로 단일 모델을 저장하고, 이를 GGUF로 양자화해서 엣지 디바이스에 배포해요. 병합하지 않으면 GGUF 변환기가 LoRA 구조를 이해하지 못해요.',
      pitfall:
        '한 번 병합하면 어댑터를 다시 분리할 수 없어요. 원본 베이스 모델과 어댑터 파일을 별도로 백업해둔 뒤에 병합해야, 나중에 다른 어댑터로 교체할 수 있어요.',
    },
  },
  {
    id: 'pft-qlora-4bit',
    lang: 'python',
    title: '모델을 4비트로 불러오기',
    file: 'qlora_4bit.py',
    code: `import torch
from transformers import BitsAndBytesConfig


bnb = BitsAndBytesConfig(
    load_in_4bit=True,
    bnb_4bit_quant_type="nf4",
    bnb_4bit_compute_dtype=torch.float16,
)
print(f"[실행] 4비트 양자화 설정 - quant_type={bnb.bnb_4bit_quant_type}")
print(f"[정보] compute_dtype={bnb.bnb_4bit_compute_dtype}")`,
    explain: {
      concept:
        'QLoRA는 LoRA에 양자화(Quantization)를 결합해서, 베이스 모델조차도 4비트로 압축해 GPU 메모리 사용량을 극한으로 줄이는 기법이에요. ' +
        'LoRA만 써도 메모리가 아껴지는데, QLoRA는 여기에 더해 베이스 모델 자체를 4비트로 압축해서 불러와요. ' +
        'BitsAndBytesConfig로 압축 설정을 정의하고, 모델을 로드할 때 quantization_config 인자로 전달하면 자동으로 양자화가 적용돼요. ' +
        'QLoRA 덕분에 16GB VRAM GPU에서도 7B 모델이 아니라 13B, 심지어 34B 모델까지 파인튜닝할 수 있게 되었어요.',
      terms: [
        { t: 'BitsAndBytesConfig', d: '모델 양자화 방식을 정의하는 설정 클래스예요. 4비트/8비트를 선택하고 세부 옵션을 지정해요.' },
        { t: 'load_in_4bit=True', d: '베이스 모델을 4비트 정밀도로 압축해서 GPU 메모리에 올리는 스위치예요.' },
        { t: 'bnb_4bit_quant_type="nf4"', d: '4비트 양자화 알고리즘을 "Normal Float 4"로 지정해요. 신경망 가중치에 최적화된 방식이에요.' },
        { t: 'bnb_4bit_compute_dtype', d: '저장은 4비트로 하되, 실제 연산 시 사용할 정밀도예요. float16을 주로 써요.' },
      ],
      why:
        '일반 LoRA는 GPU 메모리 문제로 큰 모델을 파인튜닝하지 못하는 경우가 많은데, QLoRA는 4비트 압축으로 이 한계를 획기적으로 낮춰줘요. 개인 GPU로도 대형 모델 파인튜닝이 가능해졌어요.',
      expectedOutput:
        '[실행] 4비트 양자화 설정 - quant_type=nf4\n[정보] compute_dtype=torch.float16',
      realWorldUsage:
        'RTX 3090(24GB)에서 Llama-3-70B 같은 초대형 모델을 QLoRA로 파인튜닝해요. 원본을 4비트로 압축하면 70B 모델도 약 40GB → 10GB로 줄어서 소비자 GPU로 학습이 가능해져요.',
      pitfall:
        '4비트 양자화는 8비트보다 약간의 품질 손실이 있을 수 있어요. 정밀도가 중요한 태스크라면 load_in_8bit=True로 8비트를 먼저 시도해보고, 메모리가 부족할 때만 4비트로 내려가는 게 안전해요.',
    },
  },
  {
    id: 'pft-qlora-nf4',
    lang: 'python',
    title: 'nf4 양자화 방식 선택',
    file: 'qlora_nf4.py',
    code: `from transformers import BitsAndBytesConfig


bnb = BitsAndBytesConfig(
    load_in_4bit=True,
    bnb_4bit_quant_type="nf4",
    bnb_4bit_use_double_quant=True,
)
print(f"[실행] nf4 + 이중 양자화 설정")
print(f"[정보] quant_type={bnb.bnb_4bit_quant_type}, double_quant={bnb.bnb_4bit_use_double_quant}")`,
    explain: {
      concept:
        'nf4(Normal Float 4)는 신경망 가중치의 통계적 분포(정규분포)에 최적화된 4비트 양자화 방식이에요. ' +
        '일반적인 선형 양자화와 달리, 가중치가 자주 등장하는 구간을 더 촘촘하게 나누고 드문 구간은 듬성듬성 나눠서 정보 손실을 최소화해요. ' +
        'bnb_4bit_use_double_quant=True를 추가하면 양자화에 사용되는 스케일 팩터까지 다시 양자화해서, 메모리를 추가로 약 0.4GB 더 절약할 수 있어요. ' +
        'nf4는 QLoRA 논문에서 제안된 방식으로, 4비트 중에서는 실질적인 품질이 가장 우수하다고 평가돼요.',
      terms: [
        { t: '"nf4"', d: 'Normal Float 4의 약자로, 정규분포에 맞춰 구간을 나누는 4비트 양자화 알고리즘이에요.' },
        { t: 'bnb_4bit_use_double_quant=True', d: '양자화의 스케일 팩터 자체도 한 번 더 압축해서 메모리를 추가 절약하는 옵션이에요.' },
        { t: 'BitsAndBytesConfig', d: 'bitsandbytes 라이브러리의 양자화 설정을 담는 클래스예요.' },
      ],
      why:
        'nf4는 동일한 4비트에서도 일반 선형 양자화(fp4)보다 훨씬 높은 품질을 보여줘서, QLoRA를 쓸 때 사실상 표준 선택지예요.',
      expectedOutput:
        '[실행] nf4 + 이중 양자화 설정\n[정보] quant_type=nf4, double_quant=True',
      realWorldUsage:
        'QLoRA 파인튜닝 레시피의 기본값으로 nf4 + double_quant가 자리잡았어요. HuggingFace의 PEFT 공식 예제도 이 조합을 권장하고, 대부분의 오픈소스 파인튜닝 스크립트가 이 설정을 기본으로 써요.',
      pitfall:
        'bnb_4bit_use_double_quant=True는 메모리를 더 아껴주지만, 일부 구형 GPU에서는 연산 호환성 문제가 있을 수 있어요. CUDA 버전과 bitsandbytes 라이브러리 호환성을 먼저 확인해야 해요.',
    },
  },
  {
    id: 'pft-qlora-compute-dtype',
    lang: 'python',
    title: '4비트 모델 로드 후 dtype 확인',
    file: 'qlora_compute.py',
    code: `import torch
from transformers import AutoModelForCausalLM, BitsAndBytesConfig


bnb = BitsAndBytesConfig(
    load_in_4bit=True,
    bnb_4bit_quant_type="nf4",
    bnb_4bit_compute_dtype=torch.bfloat16,
)
model = AutoModelForCausalLM.from_pretrained(
    "facebook/opt-125m",
    quantization_config=bnb,
    device_map="auto",
)
print("[실행] 4비트 양자화 모델 로드 완료")
for name, param in list(model.named_parameters())[:3]:
    print(f"  {name}: dtype={param.dtype}")
print(f"[정보] device_map: auto → GPU 자동 배치")`,
    explain: {
      concept:
        'QLoRA에서 중요한 점은 "저장은 4비트로 하되, 계산은 더 정밀한 dtype(float16/bfloat16)으로 한다"는 거예요. ' +
        'bnb_4bit_compute_dtype로 연산 시 사용할 정밀도를 지정하면, bitsandbytes가 순방향 연산 시 자동으로 가중치를 지정된 dtype으로 변환해 계산하고 결과만 4비트로 다시 저장해요. ' +
        'bfloat16은 float16보다 표현 범위가 넓어서(지수부 8비트), 대형 모델 학습 시 오버플로우 문제가 적고 더 안정적이에요. ' +
        'device_map="auto"는 사용 가능한 GPU에 모델 레이어를 자동 분산 배치해서, 단일 GPU 용량을 초과하는 모델도 여러 GPU에 나눠 올릴 수 있게 해줘요.',
      terms: [
        { t: 'bnb_4bit_compute_dtype=torch.bfloat16', d: '순방향 계산 시 가중치를 bfloat16으로 변환해 연산해요. bfloat16이 float16보다 안정적이에요.' },
        { t: 'quantization_config=bnb', d: '모델을 로드할 때 BitsAndBytesConfig 양자화 설정을 적용해요.' },
        { t: 'device_map="auto"', d: 'accelerate 라이브러리로 모델을 사용 가능한 GPU에 자동 분산 배치해요.' },
        { t: 'named_parameters()', d: '모델의 모든 파라미터를 (이름, 텐서) 튜플로 순회하는 제너레이터예요.' },
      ],
      why:
        '저장 정밀도와 계산 정밀도를 분리하면, 메모리는 4비트로 아끼면서도 계산 품질은 16비트 수준을 유지할 수 있어서 파인튜닝 결과 품질이 크게 올라가요.',
      expectedOutput:
        '[실행] 4비트 양자화 모델 로드 완료\n  model.decoder.embed_tokens.weight: dtype=torch.bfloat16\n  model.decoder.embed_positions.weight: dtype=torch.bfloat16\n  model.decoder.layers.0.self_attn.k_proj.weight: dtype=torch.bfloat16\n[정보] device_map: auto → GPU 자동 배치',
      realWorldUsage:
        '파인튜닝 스크립트 시작 부분에서 모델 로드 시 quantization_config와 device_map="auto"를 항상 함께 설정해서, GPU 메모리를 자동으로 최적 활용하면서 학습을 진행해요.',
      pitfall:
        'compute_dtype을 지정하지 않으면 기본 float16이 사용되는데, 일부 GPU(A100 이전 세대)에서는 float16 연산이 불안정할 수 있어요. 가능하면 bfloat16을 명시적으로 지정하는 게 안전해요.',
    },
  },
  {
    id: 'pft-peft-tasktype',
    lang: 'python',
    title: '작업 종류(TaskType) 지정',
    file: 'peft_tasktype.py',
    code: `from peft import LoraConfig, TaskType


config = LoraConfig(
    r=8,
    lora_alpha=16,
    task_type=TaskType.CAUSAL_LM,
)
print(f"[실행] TaskType 설정 - {config.task_type}")
print(f"[정보] 가능한 TaskType: {[t.name for t in TaskType if 'LM' in t.name]}")`,
    explain: {
      concept:
        'TaskType은 모델이 어떤 종류의 작업을 수행하는지 PEFT에게 알려주는 열거형(enum)이에요. ' +
        'CAUSAL_LM은 "다음 단어 예측(텍스트 생성)" 작업, SEQ_CLS는 "문장 분류" 작업, SEQ_2_SEQ_LM은 "번역/요약" 작업을 의미해요. ' +
        '작업 종류에 따라 PEFT가 내부적으로 어댑터를 붙이는 위치와 방식을 자동으로 조정해줘서, 작업에 최적화된 구조로 학습이 이루어져요. ' +
        '잘못된 TaskType을 지정하면 어댑터가 엉뚱한 위치에 붙어서 학습이 제대로 안 되거나 오류가 발생할 수 있어요.',
      terms: [
        { t: 'TaskType', d: 'PEFT가 지원하는 작업 유형을 모아둔 열거형(enum)이에요. CAUSAL_LM, SEQ_CLS 등이 있어요.' },
        { t: 'TaskType.CAUSAL_LM', d: '"Causal Language Modeling"의 약자로, 자동회귀적 텍스트 생성 작업을 의미해요.' },
        { t: 'config.task_type', d: 'LoraConfig에 설정된 작업 유형을 확인할 수 있는 속성이에요.' },
      ],
      why:
        '작업 유형에 따라 적절한 모델 구조가 달라져요. 텍스트 생성용 어댑터를 분류용 모델에 붙이면 차원 불일치로 오류가 발생하니, 항상 모델의 용도에 맞는 TaskType을 지정해야 해요.',
      expectedOutput:
        '[실행] TaskType 설정 - CAUSAL_LM\n[정보] 가능한 TaskType: [\'CAUSAL_LM\', \'SEQ_2_SEQ_LM\']',
      realWorldUsage:
        '챗봇 모델 파인튜닝 시 TaskType.CAUSAL_LM을 사용하고, 리뷰 감정 분석 모델 파인튜닝 시 TaskType.SEQ_CLS를 사용해요. 동일한 LoRA 설정이라도 TaskType에 따라 내부 적용 방식이 완전히 달라져요.',
      pitfall:
        'TaskType을 문자열로 "CAUSAL_LM"이라고 써도 동작하지만, 오타 위험이 있어요. TaskType.CAUSAL_LM처럼 enum 상수를 사용하면 IDE 자동완성도 지원되고 오타도 방지할 수 있어요.',
    },
  },
  {
    id: 'pft-sft-trainer',
    lang: 'python',
    title: 'SFTTrainer로 미세조정',
    file: 'sft_trainer.py',
    code: `from transformers import TrainingArguments
from trl import SFTTrainer


args = TrainingArguments(output_dir="./out", num_train_epochs=1)
print(f"[실행] TrainingArguments - output_dir={args.output_dir}, epochs={args.num_train_epochs}")
trainer = SFTTrainer(
    model=model,
    train_dataset=data,
    args=args,
)
print("[실행] 학습 시작...")
trainer.train()
print("[완료] 파인튜닝 종료")`,
    explain: {
      concept:
        'SFTTrainer(Supervised Fine-Tuning Trainer)는 TRL 라이브러리에서 제공하는 파인튜닝 전용 트레이너로, 복잡한 학습 루프 코드 없이 몇 줄로 미세조정을 실행할 수 있어요. ' +
        '밥솥에 재료(모델, 데이터셋, 설정)를 넣고 취사 버튼(train())만 누르면 알아서 밥이 되는 것처럼, 모델과 데이터만 전달하면 학습이 자동으로 진행돼요. ' +
        'TrainingArguments로 출력 폴더, 학습 횟수(epoch), 배치 크기, 학습률 등을 설정하고, SFTTrainer에 전달하면 나머지는 다 알아서 처리돼요. ' +
        'SFTTrainer는 내부적으로 데이터 포맷팅, 패딩, 그래디언트 누적 등 번거로운 작업을 자동화해줘서, 학습 코드 작성 시간이 90% 이상 줄어요.',
      terms: [
        { t: 'SFTTrainer', d: 'TRL 라이브러리의 지도학습 파인튜닝 전용 트레이너예요. 모델·데이터·설정만 전달하면 학습을 실행해요.' },
        { t: 'TrainingArguments', d: '학습 관련 모든 하이퍼파라미터(epoch, 배치 크기, 출력 경로 등)를 담는 설정이에요.' },
        { t: 'num_train_epochs=1', d: '전체 데이터셋을 몇 번 반복해서 학습할지 정하는 값이에요. 1이면 한 바퀴만 학습해요.' },
        { t: 'trainer.train()', d: '실제 학습을 시작하는 메서드예요. 호출하면 GPU가 돌아가기 시작해요.' },
      ],
      why:
        'PyTorch로 직접 학습 루프를 작성하면 100줄 이상 필요하지만, SFTTrainer로는 5줄이면 끝나요. 학습 코드의 버그 가능성도 크게 줄어서 실무에서 거의 항상 Trainer 계열을 써요.',
      expectedOutput:
        '[실행] TrainingArguments - output_dir=./out, epochs=1\n[실행] 학습 시작...\n[완료] 파인튜닝 종료',
      realWorldUsage:
        '기업에서 사내 데이터로 Llama-3-8B를 파인튜닝할 때, 데이터만 포맷팅해서 Dataset으로 만들고 SFTTrainer에 전달하면 주니어 개발자도 하루 만에 파인튜닝 파이프라인을 구축할 수 있어요.',
      pitfall:
        'SFTTrainer는 TRL 라이브러리에 포함되어 있어서 pip install trl이 필요해요. 또한 데이터셋에 "text" 또는 "messages" 필드가 올바른 형식으로 있어야 하고, 없으면 에러가 나요.',
    },
  },
  {
    id: 'pft-mlflow-run',
    lang: 'python',
    title: 'MLflow 실행 시작하기',
    file: 'mlflow_run.py',
    code: `import mlflow


with mlflow.start_run(run_name="lora-test"):
    mlflow.log_param("r", 8)
    mlflow.log_metric("loss", 0.42)
    print("[실행] MLflow run 'lora-test' 기록 중...")
print("[완료] run 종료됨")`,
    explain: {
      concept:
        'MLflow는 머신러닝 실험의 설정값, 중간 지표, 최종 결과를 자동으로 기록해주는 실험 관리 도구예요. ' +
        'start_run()으로 실험 기록을 열면, 그 안에서 log_param(설정값 기록)과 log_metric(지표 기록)으로 원하는 값을 차곡차곡 쌓을 수 있어요. ' +
        'with 문을 사용하면 블록이 끝날 때 자동으로 run이 종료돼서, 깜빡하고 end_run()을 호출하지 않아도 안전하게 기록이 마무리돼요. ' +
        '여러 실험을 체계적으로 비교하려면 반드시 실험 관리 도구가 필요하고, MLflow가 업계 표준으로 가장 널리 쓰여요.',
      terms: [
        { t: 'mlflow.start_run(run_name="...")', d: '한 번의 실험 기록 세션을 열어요. run_name으로 구분 가능한 이름표를 붙여요.' },
        { t: 'mlflow.log_param("r", 8)', d: '실험 설정값(파라미터)을 기록해요. 나중에 어떤 설정으로 좋은 결과가 나왔는지 비교할 수 있어요.' },
        { t: 'mlflow.log_metric("loss", 0.42)', d: '학습 중간 지표(메트릭)를 기록해요. step별로 여러 번 호출하면 추세 그래프가 그려져요.' },
        { t: 'with ...:', d: '컨텍스트 매니저로, 블록 종료 시 자동으로 mlflow.end_run()이 호출돼요.' },
      ],
      why:
        '파라미터 튜닝은 보통 수십~수백 번의 실험이 필요해요. MLflow가 없으면 엑셀에 수동으로 기록해야 하고, 실수로 기록을 놓치면 모든 실험을 다시 해야 할 수도 있어요.',
      expectedOutput:
        '[실행] MLflow run \'lora-test\' 기록 중...\n[완료] run 종료됨',
      realWorldUsage:
        '파인튜닝 시 r=4/8/16, lr=1e-4/2e-4/5e-4 등 여러 조합으로 실험하면서, 각 실험을 run_name으로 구분하고 MLflow UI에서 loss 그래프를 비교해 최적 조합을 찾아요.',
      pitfall:
        'MLflow Tracking URI를 설정하지 않으면 기본값으로 로컬 ./mlruns 폴더에 저장되어서, 여러 명이 공유할 수 없어요. 팀 단위라면 원격 Tracking Server를 설정해야 해요.',
    },
  },
  {
    id: 'pft-mlflow-log-metric',
    lang: 'python',
    title: '학습 지표(metric) 기록',
    file: 'mlflow_metric.py',
    code: `import mlflow


mlflow.start_run(run_name="lora-epoch")
print("[실행] step별 loss 기록 중...")
for step, loss in enumerate([0.9, 0.7, 0.5, 0.3]):
    mlflow.log_metric("loss", loss, step=step)
    print(f"  step={step}, loss={loss}")
mlflow.end_run()
print("[완료] run 종료")`,
    explain: {
      concept:
        'log_metric()에 step 인자를 함께 전달하면, 같은 이름의 지표를 여러 번 기록해도 MLflow가 시간 순서대로 연결해서 추세 그래프를 자동으로 그려줘요. ' +
        '매일 체중을 기록하면 추세선이 그려지는 것처럼, 학습이 진행될수록 loss가 감소하는 추세를 한눈에 볼 수 있어서 학습이 정상적으로 진행되는지 빠르게 판단할 수 있어요. ' +
        'end_run()을 명시적으로 호출해야 하는 경우엔 깜빡하지 않도록 주의해야 하고, 가능하면 with 문을 사용하는 게 더 안전해요.',
      terms: [
        { t: 'log_metric("loss", loss, step=step)', d: '특정 step의 지표 값을 기록해요. step으로 순서를 부여하면 MLflow UI에서 선 그래프로 표시돼요.' },
        { t: 'step', d: '몇 번째 학습 단계인지 나타내는 번호예요. 0부터 시작해서 배치/에폭마다 증가시켜요.' },
        { t: 'loss', d: '모델의 오차를 나타내는 값이에요. 학습이 잘 될수록 점점 작아져요.' },
        { t: 'mlflow.end_run()', d: '수동으로 run을 종료하는 메서드예요. with 문을 안 썼으면 반드시 호출해야 해요.' },
      ],
      why:
        'step을 기록하지 않으면 MLflow가 값의 순서를 알 수 없어서, 그래프가 아닌 산점도로만 표시되고 추세를 파악하기 어려워져요.',
      expectedOutput:
        '[실행] step별 loss 기록 중...\n  step=0, loss=0.9\n  step=1, loss=0.7\n  step=2, loss=0.5\n  step=3, loss=0.3\n[완료] run 종료',
      realWorldUsage:
        '학습 루프 안에서 100스텝마다 log_metric("train_loss", loss, step=global_step)을 호출해서, MLflow 대시보드에서 학습이 수렴하는지 실시간으로 모니터링해요. loss가 안 떨어지면 조기 종료해요.',
      pitfall:
        'log_metric을 매 스텝마다 호출하면 기록 I/O가 병목이 되어 학습 속도가 느려질 수 있어요. 보통 50~100스텝마다 한 번씩 기록하는 게 적당해요.',
    },
  },
  {
    id: 'pft-mlflow-log-params',
    lang: 'python',
    title: '여러 설정 한 번에 기록',
    file: 'mlflow_params.py',
    code: `import mlflow


params = {"r": 8, "alpha": 16, "lr": 1e-4}
with mlflow.start_run(run_name="lora-params"):
    mlflow.log_params(params)
    print(f"[실행] {len(params)}개 파라미터 일괄 기록")
for k, v in params.items():
    print(f"  {k}={v}")
print("[완료] run 종료")`,
    explain: {
      concept:
        'log_params()는 딕셔너리 하나로 여러 설정값을 한 번에 기록할 수 있는 편리한 메서드예요. ' +
        '쇼핑 목록 전체를 한 번에 적어서 제출하는 것처럼, 파인튜닝에 사용된 모든 하이퍼파라미터(r, alpha, learning_rate, epochs 등)를 한 번에 기록해서 어떤 실험인지 완전히 재현할 수 있게 해줘요. ' +
        'log_param()을 키마다 일일이 호출하는 것보다 코드도 깔끔하고, 파라미터 추가/제거 시에도 딕셔너리만 수정하면 돼서 유지보수가 쉬워요.',
      terms: [
        { t: 'mlflow.log_params(params)', d: '딕셔너리에 담긴 모든 키-값 쌍을 한 번에 실험 파라미터로 기록하는 메서드예요.' },
        { t: 'params', d: '기록할 설정값을 이름과 값의 쌍으로 담은 딕셔너리예요.' },
        { t: 'with mlflow.start_run(...)', d: '컨텍스트 매니저로 실험 기록을 시작하고, 블록 종료 시 자동으로 닫아요.' },
      ],
      why:
        '실험 재현성을 확보하려면 모든 설정값이 빠짐없이 기록되어야 해요. 딕셔너리 방식은 누락 위험을 줄이고, 나중에 동일한 파라미터로 실험을 다시 실행할 때도 이 딕셔너리를 그대로 재활용할 수 있어요.',
      expectedOutput:
        '[실행] 3개 파라미터 일괄 기록\n  r=8\n  alpha=16\n  lr=0.0001\n[완료] run 종료',
      realWorldUsage:
        '파인튜닝 스크립트에서 LoraConfig와 TrainingArguments의 모든 설정을 하나의 dict로 모아서 log_params()로 기록해요. 실험 100번 중 최고 성능이 나온 설정을 찾으면, 해당 run의 params를 그대로 복사해서 배포용 학습을 재현해요.',
      pitfall:
        'log_params()에 전달한 딕셔너리의 모든 값은 문자열로 변환되어 저장돼요. 복잡한 객체(클래스 인스턴스, 함수 등)는 저장되지 않으니, 기본 타입(str, int, float)만 포함시켜야 해요.',
    },
  },
  {
    id: 'pft-mlflow-autolog',
    lang: 'python',
    title: 'Transformers 학습 자동 기록',
    file: 'mlflow_autolog.py',
    code: `import mlflow
from transformers import TrainingArguments, Trainer


mlflow.autolog()
print("[실행] MLflow autolog 활성화")

training_args = TrainingArguments(
    output_dir="./out",
    num_train_epochs=1,
    report_to="none",
)
trainer = Trainer(
    model=model,
    args=training_args,
    train_dataset=train_dataset,
)
with mlflow.start_run(run_name="auto-hf"):
    trainer.train()
    print("[실행] Trainer 학습 중 - MLflow가 자동 기록 중")
print("[완료] auto-logged")`,
    explain: {
      concept:
        'mlflow.autolog()는 Transformers의 Trainer가 학습하는 동안 발생하는 loss, learning rate, epoch 등 모든 지표를 자동으로 MLflow에 기록해주는 마법 스위치예요. ' +
        '비서에게 "앞으로 일어나는 모든 일을 기록해줘"라고 지시하는 것처럼, autolog() 한 줄이면 더 이상 수동으로 log_metric()을 호출할 필요가 없어져요. ' +
        'report_to="none"으로 설정해서 Trainer 내장 로거를 끄고 MLflow만 사용하도록 하면, 로그 중복 없이 깔끔하게 MLflow에만 기록이 남아요. ' +
        'PEFT 학습(SFTTrainer 등)에서도 autolog()가 동작하지만, Transformers Trainer 기반일 때 가장 완벽하게 지원돼요.',
      terms: [
        { t: 'mlflow.autolog()', d: '지원 라이브러리(Transformers, PyTorch Lightning 등)의 학습 지표를 자동 기록하는 만능 스위치예요.' },
        { t: 'report_to="none"', d: 'Trainer의 내장 WandB/MLflow 로거를 비활성화해서 중복 기록을 방지해요.' },
        { t: 'Trainer', d: 'Transformers의 기본 학습 관리자예요. SFTTrainer도 내부적으로 이걸 상속해요.' },
      ],
      why:
        '수동으로 log_metric()을 일일이 호출하지 않아도 모든 학습 지표가 자동 기록되니, 기록 누락 걱정이 사라지고 코드도 훨씬 간결해져요.',
      expectedOutput:
        '[실행] MLflow autolog 활성화\n[실행] Trainer 학습 중 - MLflow가 자동 기록 중\n[완료] auto-logged',
      realWorldUsage:
        '실험 초기 단계에서 autolog()를 켜두고 여러 하이퍼파라미터 조합을 빠르게 돌려본 뒤, MLflow UI에서 모든 run을 비교해 최적 조합을 찾고, 최종 학습 시에는 autolog + 커스텀 메트릭을 함께 기록해요.',
      pitfall:
        'autolog()는 sklearn, PyTorch Lightning, XGBoost 등 여러 라이브러리를 지원하지만, 일부 커스텀 트레이너에서는 모든 지표가 기록되지 않을 수 있어요. autolog만 믿지 말고 중요한 지표는 수동으로도 기록하는 게 안전해요.',
    },
  },
  {
    id: 'pft-mlflow-log-model',
    lang: 'python',
    title: '모델 통째로 기록하기',
    file: 'mlflow_model.py',
    code: `import mlflow
import mlflow.pytorch


with mlflow.start_run(run_name="model-artifact"):
    mlflow.pytorch.log_model(model, "model")
    mlflow.log_metric("acc", 0.88)
    print("[실행] PyTorch 모델과 acc=0.88 기록")
print("[완료] 모델 아티팩트 저장 완료")`,
    explain: {
      concept:
        'mlflow.pytorch.log_model()은 지표(숫자)뿐 아니라 학습 완료된 모델 파일 자체를 MLflow에 함께 보관하는 기능이에요. ' +
        '레시피와 완성된 요리를 함께 냉장고에 넣어두는 것처럼, 어떤 파라미터로 학습했는지와 그 결과물인 모델을 한 곳에서 관리할 수 있어요. ' +
        '프레임워크별로 전용 log_model 함수가 따로 있어요(pytorch, sklearn, transformers 등). ' +
        '저장된 모델은 MLflow Model Registry에 등록해서 버전 관리와 배포까지 연계할 수 있어요.',
      terms: [
        { t: 'mlflow.pytorch.log_model(model, "model")', d: 'PyTorch 모델을 MLflow에 아티팩트로 저장해요. 두 번째 인자는 저장 폴더명이에요.' },
        { t: 'model', d: '저장할 학습 완료된 PyTorch 모델 객체예요.' },
        { t: '"model"', d: 'MLflow run 내부에서 모델 파일이 저장될 하위 디렉토리 이름이에요.' },
        { t: 'mlflow.log_metric("acc", 0.88)', d: '모델의 정확도(accuracy)를 함께 기록해서, 나중에 모델과 성능을 같이 평가할 수 있어요.' },
      ],
      why:
        '학습된 모델과 그 모델을 만든 설정·성능 지표가 함께 저장되어야, 몇 달 뒤에도 어떤 모델이 왜 좋았는지 추적하고 재현할 수 있어요. 모델만 따로 있으면 아무 의미가 없어요.',
      expectedOutput:
        '[실행] PyTorch 모델과 acc=0.88 기록\n[완료] 모델 아티팩트 저장 완료',
      realWorldUsage:
        'MLflow Model Registry에 등록된 모델은 "Staging" → "Production" 단계로 승격할 수 있고, 운영 서버에서는 mlflow.pyfunc.load_model()로 바로 불러와서 추론에 사용할 수 있어요.',
      pitfall:
        'sklearn 모델일 경우 mlflow.sklearn.log_model()을, PyTorch면 mlflow.pytorch.log_model()을 써야 해요. 잘못된 log_model 함수를 사용하면 로드 시 호환성 문제가 발생해요.',
    },
  },
  {
    id: 'pft-wb-init',
    lang: 'python',
    title: 'W&B 실험 시작하기',
    file: 'wb_init.py',
    code: `import wandb


wandb.init(
    project="lora-finetune",
    name="run-1",
    config={"r": 8, "lr": 1e-4},
)
print(f"[실행] W&B run 시작 - project={wandb.run.project}, name={wandb.run.name}")
print(f"[정보] config={dict(wandb.config)}")`,
    explain: {
      concept:
        'Weights & Biases(W&B)는 실험 기록을 아름다운 대시보드로 시각화해주는 클라우드 기반 실험 관리 도구예요. ' +
        'init()으로 실험 세션을 열면, 이후에 기록되는 모든 지표가 자동으로 그래프로 만들어지고 팀원들과 실시간으로 공유할 수 있어요. ' +
        'project는 여러 실험을 하나의 프로젝트로 묶는 최상위 폴더 개념이고, name은 각 실험의 별칭이에요. ' +
        'config에 딕셔너리로 설정값을 전달하면, W&B가 실험의 하이퍼파라미터로 자동 저장하고 대시보드에 표시해줘요.',
      terms: [
        { t: 'wandb.init(...)', d: 'W&B 실험 세션을 시작하고 서버와 연결을 설정하는 함수예요.' },
        { t: 'project="lora-finetune"', d: '여러 실험을 하나로 묶는 프로젝트 이름이에요. W&B 대시보드에서 이 이름으로 조회해요.' },
        { t: 'name="run-1"', d: '이번 실험의 별칭이에요. 동일 프로젝트 내에서 각 run을 구분하는 레이블이에요.' },
        { t: 'config={"r": 8, "lr": 1e-4}', d: '학습에 사용된 하이퍼파라미터를 담은 딕셔너리예요. W&B UI에 자동으로 테이블로 표시돼요.' },
      ],
      why:
        'MLflow가 로컬 중심이라면 W&B는 클라우드 기반이라서, 팀원들과 실시간으로 실험 결과를 공유하고 원격에서도 대시보드를 볼 수 있어요.',
      expectedOutput:
        '[실행] W&B run 시작 - project=lora-finetune, name=run-1\n[정보] config={\'r\': 8, \'lr\': 0.0001}',
      realWorldUsage:
        '연구실에서 4명이 동시에 각자 GPU로 파인튜닝 실험을 돌리면서, W&B dashboard로 서로의 loss 그래프를 실시간 비교하고 Slack 알림까지 연동해서 학습 완료 여부를 자동으로 공유해요.',
      pitfall:
        'wandb.init()은 호출 시 W&B 서버와 통신을 시도해요. 인터넷 연결이 없으면 로그인 페이지로 리다이렉트되거나 오류가 나니, 오프라인 모드(wandb offline)로 먼저 설정할 수 있어요.',
    },
  },
  {
    id: 'pft-wb-log-step',
    lang: 'python',
    title: 'W&B에 단계별 값 기록',
    file: 'wb_log.py',
    code: `import wandb


wandb.init(project="lora-finetune", name="run-2")
print("[실행] step별 loss 기록 중...")
for step, loss in enumerate([0.8, 0.6, 0.4]):
    wandb.log({"loss": loss}, step=step)
    print(f"  step={step}, loss={loss}")
wandb.finish()
print("[완료] W&B run 종료")`,
    explain: {
      concept:
        'wandb.log()는 step별 지표를 W&B 서버로 전송하고, 서버에서는 이 값을 받아 자동으로 시계열 그래프를 그려줘요. ' +
        '딕셔너리 형태로 전달하기 때문에 loss, accuracy, learning_rate 등 여러 지표를 한 번에 기록할 수 있어요. ' +
        'finish()를 호출하지 않으면 W&B run이 백그라운드에 계속 남아 있어서, 다음 run과 섞이거나 리소스 누수가 발생할 수 있어요. ' +
        '매일 점수를 기록하면 달력에 선 그래프가 그려지듯이, step별 loss를 기록하면 W&B에서 아름다운 수렴 곡선을 볼 수 있어요.',
      terms: [
        { t: 'wandb.log({"loss": loss}, step=step)', d: '딕셔너리로 여러 지표를 step 번호와 함께 기록해요. W&B가 자동으로 그래프를 생성해요.' },
        { t: 'step', d: '학습 진행도를 나타내는 전역 스텝 번호예요. W&B가 이걸 X축으로 사용해 그래프를 그려요.' },
        { t: 'wandb.finish()', d: '실험 세션을 정상 종료하고 서버와의 연결을 닫아요.' },
      ],
      why:
        'W&B 대시보드에서 실시간 loss 그래프를 보면, 학습 발산 여부를 즉시 확인하고 불필요한 학습을 조기 중단할 수 있어 GPU 비용을 절약할 수 있어요.',
      expectedOutput:
        '[실행] step별 loss 기록 중...\n  step=0, loss=0.8\n  step=1, loss=0.6\n  step=2, loss=0.4\n[완료] W&B run 종료',
      realWorldUsage:
        'SFTTrainer에 WandbCallback을 추가하면 wandb.log()를 수동 호출하지 않아도 매 스텝 loss가 자동 기록돼요. 연구자들은 W&B 대시보드를 항상 켜두고 실시간 loss 곡선을 보며 학습 상태를 모니터링해요.',
      pitfall:
        'finish()를 빼먹으면 W&B run이 종료되지 않고 백그라운드에서 대기 상태로 남아 있어요. Jupyter notebook에서는 특히 자주 발생하는 실수예요.',
    },
  },
  {
    id: 'pft-dvc-api-read',
    lang: 'python',
    title: 'DVC로 버전별 데이터 읽기',
    file: 'dvc_read.py',
    code: `import dvc.api


with dvc.api.open("data.csv", rev="v1.0") as f:
    content = f.read()
    print(f"[실행] v1.0 버전 데이터 읽기 완료")
    print(f"[정보] 데이터 크기: {len(content)} bytes")`,
    explain: {
      concept:
        'DVC(Data Version Control)는 데이터 파일의 버전을 Git처럼 관리해주는 도구예요. ' +
        'dvc.api.open()에 rev 인자로 버전 태그를 지정하면, 과거 특정 시점의 데이터를 파일 시스템에서 직접 읽는 것처럼 가져올 수 있어요. ' +
        '사진 앨범에서 "2023년 1월 사진"을 골라 보는 것처럼, "v1.0 태그가 붙은 시점의 data.csv"를 현재 시점과 완전히 동일하게 재현할 수 있어요. ' +
        'ML 실험에서 "데이터가 바뀌어서 결과가 달라진 건지, 모델이 달라져서 그런 건지"를 정확히 분리하려면 이런 데이터 버전 관리가 필수예요.',
      terms: [
        { t: 'dvc.api.open("data.csv", rev="v1.0")', d: 'v1.0 태그 시점의 data.csv 파일을 읽기 모드로 열어요.' },
        { t: 'rev="v1.0"', d: '조회할 데이터의 버전 태그예요. Git의 태그와 연동해서 특정 커밋 시점의 데이터를 가리켜요.' },
        { t: 'f.read()', d: '파일 전체 내용을 한 번에 읽어 문자열로 반환해요.' },
        { t: 'content', d: '읽어온 데이터 내용이에요. 현재 시점의 파일이 아니라 과거 버전의 데이터예요.' },
      ],
      why:
        'ML 모델의 성능이 갑자기 떨어졌을 때, "데이터가 변경된 탓"인지 "모델 코드가 변경된 탓"인지 버전별로 비교하지 못하면 원인 파악에 며칠이 걸려요. DVC로 데이터 버전을 관리하면 즉시 확인 가능해요.',
      expectedOutput:
        '[실행] v1.0 버전 데이터 읽기 완료\n[정보] 데이터 크기: 1234 bytes',
      realWorldUsage:
        '파인튜닝용 데이터셋을 S3에 저장하고 DVC로 버전 관리해요. 실험 재현이 필요할 때 dvc.api.open(rev="v1.0")으로 정확히 그 시점의 데이터를 가져와서 동일한 실험을 돌릴 수 있어요.',
      pitfall:
        'dvc.api.open()을 사용하려면 먼저 dvc init과 dvc push로 데이터가 원격 저장소에 올라가 있어야 해요. DVC 설정이 안 된 상태에서 호출하면 FileNotFoundError가 발생해요.',
    },
  },
];
