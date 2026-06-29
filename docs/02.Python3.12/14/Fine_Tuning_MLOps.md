# Fine-Tuning & MLOps
## Official Documentation
- [PEFT 공식 문서](https://huggingface.co/docs/peft/index)
- [MLflow](https://mlflow.org/docs/latest/)
- [DVC](https://dvc.org/doc)
- [Weights & Biases](https://docs.wandb.ai/)

## 핵심 개념
> Fine-tuning은 사전 학습된 LLM을 특정 태스크에 맞게 미세 조정하는 과정이다. LoRA(Low-Rank Adaptation)는 가중치 행렬에 저랭크 분해 행렬을 추가하여 전체 파라미터의 1% 미만만 학습하며, QLoRA는 4-bit 양자화와 결합해 메모리 사용량을 극적으로 줄인다. MLflow는 실험 추적과 모델 레지스트리를, DVC는 데이터 버전 관리를, W&B는 학습 메트릭 시각화를 담당한다.

## 학습 목표
- PEFT 라이브러리로 LoRA/QLoRA Fine-tuning 구현하기
- LoRA rank, alpha 등 하이퍼파라미터가 학습에 미치는 영향 이해하기
- MLflow로 실험 메트릭(log_metric)과 모델(log_model) 기록하기
- DVC로 학습 데이터셋 버전 관리 파이프라인 구축하기
- W&B로 학습 곡선 시각화 및 실험 비교하기

## 예제 코드
```python
# QLoRA Fine-tuning
import torch
from transformers import (
    AutoModelForCausalLM, AutoTokenizer, BitsAndBytesConfig,
    TrainingArguments
)
from peft import LoraConfig, get_peft_model, prepare_model_for_kbit_training
from trl import SFTTrainer
from datasets import load_dataset

# 4-bit 양자화 설정
bnb_config = BitsAndBytesConfig(
    load_in_4bit=True,
    bnb_4bit_quant_type="nf4",
    bnb_4bit_compute_dtype=torch.bfloat16,
)

model = AutoModelForCausalLM.from_pretrained(
    "mistralai/Mistral-7B-v0.1",
    quantization_config=bnb_config,
    device_map="auto",
)
model = prepare_model_for_kbit_training(model)

# LoRA 설정
lora_config = LoraConfig(
    r=16,                    # 저랭크 차원
    lora_alpha=32,           # 스케일링 팩터
    target_modules=["q_proj", "v_proj", "k_proj", "o_proj"],
    lora_dropout=0.05,
    bias="none",
    task_type="CAUSAL_LM",
)
model = get_peft_model(model, lora_config)
model.print_trainable_parameters()  # 0.2% 정도만 학습 가능

# 학습
trainer = SFTTrainer(
    model=model,
    args=TrainingArguments(
        output_dir="./qlora-output",
        per_device_train_batch_size=4,
        gradient_accumulation_steps=4,
        learning_rate=2e-4,
        logging_steps=10,
        save_steps=100,
        num_train_epochs=3,
    ),
    train_dataset=load_dataset("my_dataset", split="train"),
)
trainer.train()
model.save_pretrained("./qlora-adapter")
```
```python
# MLflow 실험 추적
import mlflow

mlflow.set_experiment("llm-finetuning")
mlflow.start_run(run_name="mistral-qlora-v1")

mlflow.log_param("model", "Mistral-7B-v0.1")
mlflow.log_param("lora_r", 16)
mlflow.log_param("lora_alpha", 32)
mlflow.log_param("learning_rate", 2e-4)

for epoch in range(3):
    train_loss = 0.5 / (epoch + 1)
    val_loss = 0.6 / (epoch + 1)
    mlflow.log_metric("train_loss", train_loss, step=epoch)
    mlflow.log_metric("val_loss", val_loss, step=epoch)

mlflow.log_model(model, "model")
mlflow.end_run()
```
```python
# W&B 연동
import wandb

wandb.init(project="llm-finetuning", config={
    "model": "Mistral-7B",
    "lora_r": 16,
    "epochs": 3,
})

for epoch in range(3):
    metrics = {"train/loss": 0.5/(epoch+1), "val/perplexity": 10+epoch}
    wandb.log(metrics)
wandb.finish()
```

## 주요 패턴
- LoRA 어댑터: 원본 모델은 동결하고 저랭크 행렬만 학습, 어댑터만 교체하여 다중 태스크 대응
- QLoRA 3종 세트: 4-bit NF4 양자화 + Double Quantization + Paged Optimizer로 단일 GPU 학습
- MLflow Tracking: `log_param`, `log_metric`, `log_model`로 재현 가능한 실험 기록
- DVC 파이프라인: `dvc run`으로 데이터 전처리→학습→평가 단계를 DAG로 정의
- W&B Sweep: 하이퍼파라미터 자동 탐색으로 최적 LoRA rank 찾기

## 주의사항
- LoRA target_modules를 잘못 지정하면 학습 효과가 거의 없음 (어텐션 레이어 위주)
- 4-bit 양자화 시 추론과 학습 간 dtype 불일치로 NaN 손실이 발생할 수 있음
- MLflow 서버 없이 로컬에서만 실험 추적 시 팀 공유 불가
- DVC 리모트 스토리지 설정 없으면 데이터 유실 위험
