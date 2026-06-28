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
print(config)`,
    explain: {
      concept: 'LoRA는 거대 모델 전체를 고치지 않고, 작은 추가 조각(어댑터)만 붙여 학습하는 방식이에요. 마치 두꺼운 교과서에 얇은 메모지를 덧붙여 필요한 부분만 고치는 것과 같아요.',
      terms: [
        { t: 'LoraConfig', d: '어댑터 모양을 정하는 설정 상자예요' },
        { t: 'r', d: '얼마나 작은 조각으로 줄일지 정하는 숫자예요' },
        { t: 'lora_alpha', d: '어댑터 출력이 원본에 미치는 힘의 크기예요' },
        { t: 'lora_dropout', d: '학습 중 일부 연결을 꺼서 과적합을 막아요' }
      ],
      why: '전체 모델을 고치면 비용이 크지만, 작은 어댑터만 배우면 훨씬 가벼워요.'
    }
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
print(config.target_modules)`,
    explain: {
      concept: '모델에는 여러 층이 있는데, 어댑터를 모든 층이 아닌 특정 층(예: 질문/값 층)에만 붙일 수 있어요. 아파트 전체가 아닌 자주 쓰는 방만 수리하는 것과 비슷해요.',
      terms: [
        { t: 'target_modules', d: '어댑터를 붙일 층 이름 목록이에요' },
        { t: 'q_proj', d: '질문을 만드는 부분의 층 이름이에요' },
        { t: 'v_proj', d: '값(정보)을 뽑는 부분의 층 이름이에요' }
      ],
      why: '중요한 층에만 집중하면 적은 메모리로도 효과가 좋아요.'
    }
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
print(type(model))`,
    explain: {
      concept: '설정 상자를 만들었으면, 실제 모델에 어댑터를 붙여야 해요. get_peft_model이 접착제 역할을 하여 모델과 어댑터를 하나로 이어줘요.',
      terms: [
        { t: 'get_peft_model', d: '모델에 어댑터를 붙여주는 함수예요' },
        { t: 'model', d: '원래 거대 모델이 담긴 변수예요' },
        { t: 'config', d: '어댑터 모양을 정한 설정 상자예요' }
      ],
      why: '붙인 뒤부터는 모델 전체가 아닌 어댑터만 학습돼요.',
      pitfall: '붙이기 전에 모델이 이미 GPU에 올라와 있어야 메모리 배치가 맞아요.'
    }
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
      concept: '어댑터를 붙이면 전체 매개변수 중 진짜로 학습하는 비율이 얼마나 줄었는지 확인할 수 있어요. 큰 가방에서 실제로 꺼내 쓰는 물건만 세어보는 것과 같아요.',
      terms: [
        { t: 'print_trainable_parameters', d: '학습 가능한 매개변수 수를 출력해요' },
        { t: 'trainable params', d: '실제로 값이 바뀌는 매개변수예요' },
        { t: 'all params', d: '모델 전체 매개변수예요' }
      ],
      why: '얼마나 효율적으로 줄였는지 한눈에 볼 수 있어요.'
    }
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
print("saved")`,
    explain: {
      concept: '거대 모델 전체를 저장하면 용량이 크지만, 어댑터만 저장하면 아주 가벼워요. 두꺼운 교과서는 두고 메모지만 따로 챙기는 것과 같아요.',
      terms: [
        { t: 'save_pretrained', d: '어댑터를 폴더에 저장하는 명령이에요' },
        { t: './my_adapter', d: '저장할 폴더 경로예요' },
        { t: 'model', d: '어댑터가 붙은 모델이에요' }
      ],
      why: '가벼운 파일로 어댑터를 나눠 다른 사람과 공유할 수 있어요.'
    }
  },
  {
    id: 'pft-lora-load',
    lang: 'python',
    title: '저장한 어댑터 불러오기',
    file: 'lora_load.py',
    code: `from peft import PeftModel

base = load_base_model()
model = PeftModel.from_pretrained(base, "./my_adapter")
print(isinstance(model, PeftModel))
print(list(model.peft_config.keys()))`,
    explain: {
      concept: '저장해둔 어댑터를 원래 모델 위에 다시 얹어 쓸 수 있어요. 메모지를 다시 교과서 위에 붙이는 것과 같아요.',
      terms: [
        { t: 'PeftModel', d: '어댑터를 다룰 수 있게 해 주는 모델 종류예요' },
        { t: 'from_pretrained', d: '저장된 폴더에서 어댑터를 가져오는 명령이에요' },
        { t: 'isinstance', d: '변수가 특정 종류인지 확인하는 내장 함수예요' },
        { t: 'peft_config', d: '붙어있는 어댑터 설정을 이름별로 담은 딕셔너리예요' }
      ],
      why: '여러 어댑터를 번갈아 끼워 쓸 수 있어 활용도가 높아요.'
    }
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
print(type(merged))`,
    explain: {
      concept: '배포할 때는 어댑터를 원래 모델에 녹여 넣으면 하나로 합쳐져요. 메모지 내용을 교과서에 정식으로 옮겨 적는 것과 같아요.',
      terms: [
        { t: 'merge_and_unload', d: '어댑터를 모델에 합치고 분리하는 명령이에요' },
        { t: 'merged', d: '합쳐진 단일 모델이 담긴 변수예요' },
        { t: 'PeftModel', d: '어댑터를 다룰 수 있게 해 주는 모델 종류예요' }
      ],
      why: '합치면 실행할 때 어댑터를 따로 안 챙겨도 돼서 편해요.',
      pitfall: '한 번 합치면 다시 어댑터만 떼기 어려우니 원본은 따로 보관해요.'
    }
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
print(bnb)`,
    explain: {
      concept: 'QLoRA는 모델을 작은 단위(4비트)로 압축해서 불러와 메모리를 아껴요. 큰 가방을 접어서 작게 만드는 것과 같아요.',
      terms: [
        { t: 'BitsAndBytesConfig', d: '압축 방식을 정하는 설정 상자예요' },
        { t: 'load_in_4bit', d: '4비트로 압축해 불러오는 스위치예요' },
        { t: 'bnb_4bit_quant_type', d: '압축에 쓸 방식 이름이에요' }
      ],
      why: '메모리가 부족한 컴퓨터에서도 큰 모델을 돌릴 수 있어요.'
    }
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
print(bnb.bnb_4bit_quant_type)`,
    explain: {
      concept: 'nf4는 신경망 값에 맞춘 압축 방식이라 일반 압축보다 손실이 적어요. 그릇 크기에 맞춰 음식을 담듯 값의 모양에 맞춰 압축해요.',
      terms: [
        { t: 'nf4', d: '신경망에 적합한 4비트 압축 방식 이름이에요' },
        { t: 'bnb_4bit_use_double_quant', d: '압축값마저 다시 압축해 더 줄여요' },
        { t: 'BitsAndBytesConfig', d: '압축 방식을 정하는 설정 상자예요' }
      ],
      why: '정확도를 거의 잃지 않으면서 메모리를 아껴요.'
    }
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
# 실제 계산 dtype 확인
for name, param in list(model.named_parameters())[:3]:
    print(name, param.dtype)`,
    explain: {
      concept: '저장은 작게(4비트) 하되, 실제 계산은 조금 더 정밀하게(16비트)해서 품질을 지켜요. 책은 작게 접어두고 펼쳐 읽을 땐 크게 보는 것과 같아요.',
      terms: [
        { t: 'bnb_4bit_compute_dtype', d: '계산할 때 쓸 정밀도 자료형이에요. bfloat16이 float16보다 안정적이에요' },
        { t: 'quantization_config', d: '압축 설정을 모델 로드에 전달하는 인자예요' },
        { t: 'device_map="auto"', d: 'GPU가 있으면 자동으로 GPU에 올려줘요' },
        { t: 'named_parameters', d: '모델의 모든 매개변수 이름과 값을 차례로 돌려줘요' }
      ],
      why: '저장은 작게 하되 계산 정확도는 유지하고, 실제 dtype도 확인할 수 있어요.'
    }
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
print(config.task_type)`,
    explain: {
      concept: '어댑터가 붙을 자리는 작업 종류에 따라 달라요. 글쓰기, 번역, 분류처럼 용도가 다르면 붙이는 방식도 달라져요. 용도에 맞는 도구를 고르는 것과 같아요.',
      terms: [
        { t: 'TaskType', d: '작업 종류를 모아둔 선택지 목록이에요' },
        { t: 'CAUSAL_LM', d: '이어서 글을 쓰는 작업 종류예요' },
        { t: 'task_type', d: '설정에서 작업 종류를 정하는 칸이에요' }
      ],
      why: '작업에 맞춰 어댑터 구조를 자동으로 맞춰주기 때문이에요.'
    }
  },
  {
    id: 'pft-sft-trainer',
    lang: 'python',
    title: 'SFTTrainer로 미세조정',
    file: 'sft_trainer.py',
    code: `from transformers import TrainingArguments
from trl import SFTTrainer

args = TrainingArguments(output_dir="./out", num_train_epochs=1)
trainer = SFTTrainer(
    model=model,
    train_dataset=data,
    args=args,
)
trainer.train()`,
    explain: {
      concept: 'SFTTrainer는 미세조정(파인튜닝)을 간편하게 해주는 학습 도구예요. 레시피가 정해진 밥솥처럼 재료만 넣으면 학습을 알아서 진행해요.',
      terms: [
        { t: 'SFTTrainer', d: '미세조정 학습을 이끄는 도우미예요' },
        { t: 'TrainingArguments', d: '학습 방식(폴더, 반복 수 등)을 정하는 상자예요' },
        { t: 'train', d: '학습을 시작하는 명령이에요' }
      ],
      why: '복잡한 학습 코드를 직접 짜지 않아도 돼요.'
    }
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
print("done")`,
    explain: {
      concept: 'MLflow는 실험을 기록장에 차곡차곡 적어주는 도구예요. start_run으로 한 페이지를 열면 그 안에 조건과 결과를 차례로 적어요.',
      terms: [
        { t: 'mlflow.start_run', d: '한 번의 실험 기록을 시작해요' },
        { t: 'run_name', d: '이번 실험에 붙인 이름이에요' },
        { t: 'with', d: '들여쓰기가 끝나면 자동으로 페이지를 닫아요' }
      ],
      why: '여러 실험을 비교할 수 있게 한 번의 실행 단위로 묶어요.'
    }
  },
  {
    id: 'pft-mlflow-log-metric',
    lang: 'python',
    title: '학습 지표(metric) 기록',
    file: 'mlflow_metric.py',
    code: `import mlflow

mlflow.start_run(run_name="lora-epoch")
for step, loss in enumerate([0.9, 0.7, 0.5, 0.3]):
    mlflow.log_metric("loss", loss, step=step)
mlflow.end_run()`,
    explain: {
      concept: '학습이 진행될 때마다 값(loss)이 어떻게 변하는지 기록장에 적어요. 매일 몸무게를 적어 추세를 보는 것과 같아요.',
      terms: [
        { t: 'log_metric', d: '값 하나를 기록장에 적어요' },
        { t: 'step', d: '몇 번째 학습 단계인지 번호예요' },
        { t: 'loss', d: '틀린 정도를 숫자로 나타낸 값이에요' }
      ],
      why: '나중에 그래프로 추세를 보고 학습이 잘 되는지 확인해요.'
    }
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
print("logged")`,
    explain: {
      concept: '설정값이 여러 개면 딕셔너리로 묶어 한 번에 기록할 수 있어요. 쇼핑 목록을 한 번에 적어 가게에 가져가는 것과 같아요.',
      terms: [
        { t: 'log_params', d: '설정값 여러 개를 한꺼번에 적어요' },
        { t: 'params', d: '설정값을 이름과 값 짝으로 담은 상자예요' },
        { t: 'mlflow.start_run', d: '한 번의 실험 기록을 시작해요' }
      ],
      why: '어떤 설정으로 실험했는지 한눈에 남겨 비교하기 쉬워요.'
    }
  },
  {
    id: 'pft-mlflow-autolog',
    lang: 'python',
    title: 'Transformers 학습 자동 기록',
    file: 'mlflow_autolog.py',
    code: `import mlflow
from transformers import TrainingArguments, Trainer

mlflow.autolog()

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
print("auto-logged")`,
    explain: {
      concept: 'autolog를 켜면 Transformers Trainer가 학습하면서 생기는 값들을 MLflow가 알아서 기록해요. 메모장을 펴놓으면 비서가 대신 적어주는 것과 같아요.',
      terms: [
        { t: 'mlflow.autolog', d: 'Transformers 등 지원 라이브러리의 값을 자동으로 기록하는 스위치예요' },
        { t: 'report_to="none"', d: 'Trainer 내장 로거를 끄고 mlflow만 쓰도록 설정해요' },
        { t: 'Trainer', d: 'Transformers 학습을 관리하는 도우미예요' }
      ],
      why: '일일이 기록 코드를 짜지 않아도 Trainer 학습 지표가 자동으로 남아요.',
      pitfall: 'PEFT 학습에서 mlflow.autolog()는 Transformers Trainer 기반일 때만 동작해요. sklearn의 model.fit()과는 다른 맥락이에요.'
    }
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
print("model logged")`,
    explain: {
      concept: '값뿐 아니라 학습된 모델 자체를 기록장에 보관할 수 있어요. 레시피와 완성된 음식을 함께 냉장고에 넣어두는 것과 같아요.',
      terms: [
        { t: 'mlflow.pytorch.log_model', d: 'PyTorch 모델을 MLflow 기록장에 보관하는 함수예요. 프레임워크마다 별도 함수가 있어요' },
        { t: 'model', d: '저장할 학습된 PyTorch 모델이에요' },
        { t: '"model"', d: '기록장 안에서 모델을 찾을 폴더 이름이에요' }
      ],
      why: '나중에 누구나 같은 모델을 꺼내 쓸 수 있어요.',
      pitfall: 'sklearn 모델이면 mlflow.sklearn.log_model을, PyTorch 모델이면 mlflow.pytorch.log_model을 써야 해요. 최상위 mlflow.log_model()은 지원 범위가 제한적이에요.'
    }
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
print(wandb.run.name)`,
    explain: {
      concept: 'W&B는 실험을 그림으로 보여주는 기록 도구예요. init으로 새 노트를 열면 그 안에 설정과 결과를 시각화해 줘요.',
      terms: [
        { t: 'wandb.init', d: '새 실험 노트를 여는 명령이에요' },
        { t: 'project', d: '여러 실험을 묶는 큰 이름이에요' },
        { t: 'config', d: '이번 실험의 설정값 상자예요' }
      ],
      why: '프로젝트별로 실험을 묶어 비교하기 편해요.'
    }
  },
  {
    id: 'pft-wb-log-step',
    lang: 'python',
    title: 'W&B에 단계별 값 기록',
    file: 'wb_log.py',
    code: `import wandb

wandb.init(project="lora-finetune", name="run-2")
for step, loss in enumerate([0.8, 0.6, 0.4]):
    wandb.log({"loss": loss}, step=step)
wandb.finish()`,
    explain: {
      concept: '학습이 진행될 때마다 값을 W&B에 적으면 그래프가 자동으로 그려져요. 매일 점수를 적으면 달력에 선이 그어지는 것과 같아요.',
      terms: [
        { t: 'wandb.log', d: '값을 기록하며 그래프를 그려요' },
        { t: 'step', d: '몇 번째 단계인지 번호예요' },
        { t: 'finish', d: '실험 노트를 닫는 명령이에요' }
      ],
      why: '실시간 그래프로 학습 추세를 바로 확인해요.',
      pitfall: 'finish를 안 부르면 노트가 닫히지 않아 결과가 어긋날 수 있어요.'
    }
  },
  {
    id: 'pft-dvc-api-read',
    lang: 'python',
    title: 'DVC로 버전별 데이터 읽기',
    file: 'dvc_read.py',
    code: `import dvc.api

with dvc.api.open("data.csv", rev="v1.0") as f:
    content = f.read()
print(len(content))`,
    explain: {
      concept: 'DVC는 데이터를 버전별로 보관해서, 원하는 시점의 데이터를 꺼내 읽게 해줘요. 사진 앨범에서 날짜별로 옛날 사진을 찾는 것과 같아요.',
      terms: [
        { t: 'dvc.api.open', d: '지정한 버전의 데이터를 여는 함수예요' },
        { t: 'data.csv', d: '불러올 데이터 파일 이름이에요' },
        { t: 'rev', d: '어떤 버전(시점)을 볼지 표시예요' }
      ],
      why: '데이터가 바뀌어도 과거 버전을 그대로 재현할 수 있어요.'
    }
  }
];
