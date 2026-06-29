# Deep Learning

## Official Documentation
- [PyTorch 60-min Blitz](https://pytorch.org/tutorials/beginner/deep_learning_60min_blitz.html)

## 핵심 개념
> PyTorch의 `Tensor`는 GPU 가속이 가능한 다차원 배열로, `nn.Module`을 상속해 신경망 레이어와 `forward()`를 정의한다. `optimizer`로 경사하강법을 수행하고, `DataLoader`로 미니배치를 반복하며 training loop를 구성한다. TensorFlow/Keras는 고수준 API(`Sequential`, `compile`, `fit`)로 빠른 프로토타이핑을 지원하며, PyTorch와 함께 딥러닝의 양대 프레임워크를 이룬다.

## 학습 목표
- PyTorch `Tensor`를 생성하고 GPU로 연산할 수 있다.
- `nn.Module`을 상속하여 신경망을 정의하고 `forward()`를 구현할 수 있다.
- `optimizer`, 손실 함수, training loop로 모델을 학습시킬 수 있다.
- `Dataset`/`DataLoader`로 커스텀 데이터를 로드하고 TensorFlow/Keras로 간단한 모델을 구성할 수 있다.

## 예제 코드
```python
import torch
import torch.nn as nn
import torch.optim as optim
from torch.utils.data import Dataset, DataLoader
import numpy as np

# --- Tensor + GPU ---
device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
x = torch.tensor([[1.0, 2.0], [3.0, 4.0]], device=device)
y = torch.randn(2, 3, device=device)
print("Tensor device:", x.device)
print("Matmul result:\n", x @ torch.ones(2, 3, device=device))

# --- nn.Module ---
class SimpleNN(nn.Module):
    def __init__(self, input_dim: int, hidden_dim: int, output_dim: int):
        super().__init__()
        self.fc1 = nn.Linear(input_dim, hidden_dim)
        self.relu = nn.ReLU()
        self.fc2 = nn.Linear(hidden_dim, output_dim)

    def forward(self, x: torch.Tensor) -> torch.Tensor:
        x = self.fc1(x)
        x = self.relu(x)
        x = self.fc2(x)
        return x

# --- Custom Dataset ---
class DummyDataset(Dataset):
    def __init__(self, n_samples: int, n_features: int, n_classes: int):
        self.X = torch.randn(n_samples, n_features)
        self.y = torch.randint(0, n_classes, (n_samples,))

    def __len__(self):
        return len(self.X)

    def __getitem__(self, idx: int):
        return self.X[idx], self.y[idx]

# --- DataLoader ---
dataset = DummyDataset(n_samples=500, n_features=10, n_classes=3)
dataloader = DataLoader(dataset, batch_size=32, shuffle=True)

# --- Training loop ---
model = SimpleNN(input_dim=10, hidden_dim=20, output_dim=3).to(device)
criterion = nn.CrossEntropyLoss()
optimizer = optim.Adam(model.parameters(), lr=0.001)

model.train()
for epoch in range(3):
    total_loss = 0.0
    for batch_X, batch_y in dataloader:
        batch_X, batch_y = batch_X.to(device), batch_y.to(device)

        optimizer.zero_grad()
        outputs = model(batch_X)
        loss = criterion(outputs, batch_y)
        loss.backward()
        optimizer.step()

        total_loss += loss.item()

    avg_loss = total_loss / len(dataloader)
    print(f"Epoch {epoch+1:2d}, Loss: {avg_loss:.4f}")

# --- TensorFlow/Keras (간단 예시) ---
# import tensorflow as tf
# model_tf = tf.keras.Sequential([
#     tf.keras.layers.Dense(20, activation="relu", input_shape=(10,)),
#     tf.keras.layers.Dense(3, activation="softmax"),
# ])
# model_tf.compile(optimizer="adam", loss="sparse_categorical_crossentropy", metrics=["accuracy"])
# model_tf.fit(X_np, y_np, epochs=5, batch_size=32, validation_split=0.2)
```

## 주요 패턴
- `nn.Module` + `forward()`: 레이어를 `__init__`에 정의하고 `forward()`에서 연결 순서를 기술한다.
- `optimizer.zero_grad()` → `loss.backward()` → `optimizer.step()`: 매 배치마다 이 3단계를 반복한다.
- `model.train()` vs `model.eval()`: Dropout, BatchNorm 등의 동작을 학습/추론 모드로 전환한다.
- `Dataset` + `DataLoader`: `__getitem__`으로 샘플을 반환하고 `DataLoader`가 배치, 셔플, 병렬 로딩을 처리한다.
- `to(device)`: 모델과 텐서를 동일한 장치로 전송하여 GPU 가속을 활용한다.

## 주의사항
- `forward()` 호출은 `model(x)`로 직접 하며, `model.forward(x)`는 호출하지 않는다 (Hook이 우회됨).
- 학습 전 `optimizer.zero_grad()`를 생략하면 기울기가 누적되어 학습이 불안정해진다.
- 추론 시 `torch.no_grad()` 컨텍스트 안에서 수행해야 메모리 사용량이 줄어든다.
- TensorFlow와 PyTorch의 기본 데이터 차원 순서가 다를 수 있다 (NHWC vs NCHW).
- CUDA 사용 시 텐서(`.to(device)`)와 모델(`model.to(device)`)을 별도로 전송해야 한다.
