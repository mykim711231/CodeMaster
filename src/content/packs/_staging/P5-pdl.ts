import type { Snippet } from '../../types';

export const pythonDL: Snippet[] = [
  {
    id: 'pdl-tensor-create',
    lang: 'python',
    title: '텐서 만들기',
    file: 'tensor_create.py',
    code: `import torch

a = torch.tensor([1, 2, 3])
b = torch.zeros(3)
c = torch.ones(2, 3)

print(a)
print(b)
print(c)`,

    explain: {
      concept: '텐서(tensor)는 숫자들이 담긴 상자예요. 리스트로 직접 만들거나 0·1로 채운 상자를 만들 수 있어요. PyTorch에서 가장 기본이 되는 데이터 그릇이에요.',
      terms: [
        { t: 'torch.tensor', d: '리스트를 텐서로 바꿔주는 함수예요.' },
        { t: 'torch.zeros', d: '0으로 가득 찬 텐서를 만들어요.' },
        { t: 'torch.ones', d: '1로 가득 찬 텐서를 만들어요.' }
      ],
      why: '신경망의 모든 데이터는 텐서로 표현되기 때문이에요.'
    }
  },
  {
    id: 'pdl-tensor-shape',
    lang: 'python',
    title: '텐서 모양 확인·변경',
    file: 'tensor_shape.py',
    code: `import torch

x = torch.arange(6)
print(x.shape)

y = x.reshape(2, 3)
print(y.shape)

z = y.view(3, 2)
print(z.shape)`,

    explain: {
      concept: '텐서의 모양(shape)은 상자가 몇 행 몇 열인지 알려줘요. reshape은 상자의 모양을 다시 포장하는 것과 같아요. 안의 숫자는 그대로예요.',
      terms: [
        { t: 'shape', d: '텐서의 행·열 크기를 알려주는 속성이에요.' },
        { t: 'reshape', d: '텐서 모양을 원하는 크기로 바꿔요.' },
        { t: 'view', d: 'reshape과 비슷하게 모양을 바꿔요.' }
      ],
      why: '모델 층에 맞는 모양으로 데이터를 맞춰야 계산이 돼요.',
      pitfall: '전체 원소 수가 같아야만 모양을 바꿀 수 있어요.'
    }
  },
  {
    id: 'pdl-tensor-dtype',
    lang: 'python',
    title: '자료형 변환',
    file: 'tensor_dtype.py',
    code: `import torch

x = torch.tensor([1, 2, 3])
print(x.dtype)

f = x.float()
print(f.dtype)

l = x.long()
print(l.dtype)`,

    explain: {
      concept: '텐서는 정수냐 실수냐 같은 자료형(dtype)을 가져요. 신경망은 보통 실수(float)로 계산하고, 정답 라벨은 정수(long)로 써요. 자료형을 맞춰줘야 계산이 돼요.',
      terms: [
        { t: 'dtype', d: '텐서가 담는 숫자의 종류(정수·실수)예요.' },
        { t: 'float()', d: '실수형으로 바꿔요.' },
        { t: 'long()', d: '64비트 정수형으로 바꿔요.' }
      ],
      why: '모델과 텐서의 자료형이 다르면 오류가 나기 때문이에요.'
    }
  },
  {
    id: 'pdl-tensor-ops',
    lang: 'python',
    title: '원소별 연산',
    file: 'tensor_ops.py',
    code: `import torch

a = torch.tensor([1.0, 2.0, 3.0])
b = torch.tensor([4.0, 5.0, 6.0])

print(a + b)
print(a * b)
print(a.sum())`,

    explain: {
      concept: '같은 모양의 텐서끼리 더하고 곱하면 같은 자리의 숫자끼리 계산돼요. 마치 두 계란판의 같은 칸끼리 더하는 것 같아요.',
      terms: [
        { t: '+', d: '같은 자리끼리 더해요.' },
        { t: '*', d: '같은 자리끼리 곱해요.' },
        { t: 'sum()', d: '모든 원소를 더해 하나의 값으로 만들어요.' }
      ],
      why: '여러 데이터를 한 번에 같은 방식으로 계산하려고 써요.'
    }
  },
  {
    id: 'pdl-tensor-matmul',
    lang: 'python',
    title: '행렬 곱셈',
    file: 'tensor_matmul.py',
    code: `import torch

a = torch.tensor([[1.0, 2.0], [3.0, 4.0]])
b = torch.tensor([[5.0, 6.0], [7.0, 8.0]])

c = a @ b
print(c)
print(c.shape)`,

    explain: {
      concept: '@ 기호는 행렬 곱셈(matrix multiplication)이에요. 신경망에서 가중치(weight)를 데이터에 곱할 때 쓰는 핵심 연산이에요. 행과 열을 엮어 새로운 표를 만드는 것과 같아요.',
      terms: [
        { t: '@', d: '행렬 곱셈 기호예요.' },
        { t: 'matmul', d: '@와 같은 역할을 하는 함수예요.' },
        { t: 'shape', d: '결과 텐서의 크기예요.' }
      ],
      why: '신경망은 데이터에 가중치를 곱할 때 행렬 곱셈을 쓰기 때문이에요.',
      pitfall: '앞 텐서의 열 수와 뒤 텐서의 행 수가 같아야 해요.'
    }
  },
  {
    id: 'pdl-autograd',
    lang: 'python',
    title: '자동 미분',
    file: 'autograd.py',
    code: `import torch

x = torch.tensor(2.0, requires_grad=True)
y = x ** 2 + 3 * x + 1

y.backward()
print(x.grad)`,

    explain: {
      concept: 'PyTorch는 계산 과정을 기억해서 자동으로 미분(기울기)을 구해줘요. requires_grad=True로 켜두면 되요. backward()를 부르면 거꾸로 돌아가며 기울기를 채워요.',
      terms: [
        { t: 'requires_grad', d: '기울기를 구할지 켜는 스위치예요.' },
        { t: 'backward', d: '거꾸로 계산하며 기울기를 채워요.' },
        { t: 'grad', d: '구해진 기울기가 들어 있어요.' }
      ],
      why: '가중치를 어떻게 바꿀지 방향을 알아야 학습할 수 있어서예요.'
    }
  },
  {
    id: 'pdl-nn-linear',
    lang: 'python',
    title: '선형 층 만들기',
    file: 'nn_linear.py',
    code: `import torch
import torch.nn as nn

layer = nn.Linear(3, 2)
x = torch.tensor([1.0, 2.0, 3.0])

out = layer(x)
print(out)
print(out.shape)`,

    explain: {
      concept: 'nn.Linear는 입력 3개를 받아 출력 2개로 바꿔주는 층(layer)이에요. 데이터에 가중치를 곱하고 편향(bias)을 더하는 자동판매기 같아요.',
      terms: [
        { t: 'nn.Linear', d: '입력을 출력으로 선형 변환하는 층이에요.' },
        { t: 'weight', d: '곱해지는 가중치예요.' },
        { t: 'bias', d: '마지막에 더해지는 값이에요.' }
      ],
      why: '신경망의 가장 기본 계산 단위로 데이터를 다음 표현으로 바꿔줘요.'
    }
  },
  {
    id: 'pdl-nn-module',
    lang: 'python',
    title: '모델 클래스 정의',
    file: 'nn_module.py',
    code: `import torch
import torch.nn as nn

class Net(nn.Module):
  def __init__(self):
    super().__init__()
    self.fc = nn.Linear(3, 1)

  def forward(self, x):
    return self.fc(x)

model = Net()`,

    explain: {
      concept: 'nn.Module을 상속받아 모델(신경망)을 한 단위로 포장해요. __init__에서 부품을 준비하고 forward에서 데이터 흐름을 정해요. 레고 블록을 조립하는 것과 같아요.',
      terms: [
        { t: 'nn.Module', d: '신경망 부품의 기본 틀이에요.' },
        { t: '__init__', d: '부품을 만들어 두는 곳이에요.' },
        { t: 'forward', d: '데이터가 어떻게 흐르는지 정해요.' }
      ],
      why: '여러 층을 하나로 묶어 관리하려고 해요.'
    }
  },
  {
    id: 'pdl-forward',
    lang: 'python',
    title: '순전파 호출',
    file: 'forward.py',
    code: `import torch
import torch.nn as nn

class Net(nn.Module):
  def __init__(self):
    super().__init__()
    self.fc1 = nn.Linear(4, 8)
    self.fc2 = nn.Linear(8, 1)

  def forward(self, x):
    h = torch.relu(self.fc1(x))
    return self.fc2(h)

model = Net()
out = model(torch.randn(4))`,

    explain: {
      concept: 'forward는 데이터를 모델에 통과시키는 길이에요. 층들을 차례로 지나가며 최종 결과를 내보내요. model(x)처럼 부르면 자동으로 forward가 실행돼요.',
      terms: [
        { t: 'forward', d: '데이터가 지나가는 길을 정의해요.' },
        { t: 'torch.relu', d: '음수를 0으로 만드는 활성함수예요.' },
        { t: 'model(x)', d: 'forward를 자동으로 실행해요.' }
      ],
      why: '데이터가 층들을 차례로 통과해 최종 예측을 만들어야 해서 써요.'
    }
  },
  {
    id: 'pdl-activation',
    lang: 'python',
    title: '활성 함수',
    file: 'activation.py',
    code: `import torch
import torch.nn.functional as F

x = torch.tensor([-2.0, -1.0, 0.0, 1.0, 2.0])

r = F.relu(x)
s = torch.sigmoid(x)
t = torch.tanh(x)

print(r)
print(s)
print(t)`,

    explain: {
      concept: '활성 함수(activation)는 층 사이에 비선형 틀을 넣어 모델이 복잡한 패턴을 배울 수 있게 해줘요. relu는 음수를 0으로, sigmoid는 0~1로, tanh는 -1~1로 값을 눌러요.',
      terms: [
        { t: 'F.relu', d: '음수는 0, 양수는 그대로 두어요. torch.nn.functional의 relu예요.' },
        { t: 'sigmoid', d: '값을 0~1 사이로 눌러요.' },
        { t: 'tanh', d: '값을 -1~1 사이로 눌러요.' }
      ],
      why: '선형만 쌓으면 선형이 돼 복잡한 것을 배우지 못해서예요.'
    }
  },
  {
    id: 'pdl-loss',
    lang: 'python',
    title: '손실 함수',
    file: 'loss.py',
    code: `import torch
import torch.nn as nn

pred = torch.tensor([0.2, 0.7, 0.9])
target = torch.tensor([0.0, 1.0, 1.0])

mse = nn.MSELoss()
loss = mse(pred, target)
print(loss.item())`,

    explain: {
      concept: '손실 함수(loss)는 모델의 예측이 정답과 얼마나 틀렸는지 점수를 매겨요. MSELoss는 차이를 제곱해 평균을 내고, 점수가 작을수록 잘한 거예요.',
      terms: [
        { t: 'nn.MSELoss', d: '오차의 제곱 평균을 구해요.' },
        { t: 'pred', d: '모델이 예측한 값이에요.' },
        { t: 'item', d: '텐서에서 파이썬 숫자 하나를 꺼내요.' }
      ],
      why: '얼마나 틀렸는지 알아야 가중치를 어떻게 고칠지 정할 수 있어요.'
    }
  },
  {
    id: 'pdl-optimizer',
    lang: 'python',
    title: '옵티마이저 만들기',
    file: 'optimizer.py',
    code: `import torch
import torch.nn as nn

model = nn.Linear(3, 1)
opt = torch.optim.SGD(model.parameters(), lr=0.01)

x = torch.randn(5, 3)
y = torch.randn(5, 1)

opt.zero_grad()
pred = model(x)
loss = nn.functional.mse_loss(pred, y)
loss.backward()
opt.step()`,

    explain: {
      concept: '옵티마이저(optimizer)는 가중치를 조금씩 고쳐 손실을 줄이는 조련사예요. lr(학습률)은 한 번에 얼마나 움직일지 보폭이에요.',
      terms: [
        { t: 'optim.SGD', d: '기울기 방향으로 조금씩 가는 옵티마이저예요.' },
        { t: 'lr', d: '한 번에 움직이는 보폭이에요.' },
        { t: 'step', d: '기울기로 가중치를 한 번 갱신해요.' }
      ],
      why: '손실을 줄이는 방향으로 가중치를 자동으로 조금씩 고쳐줘서 사람이 직접 계산할 필요가 없어요.',
      pitfall: 'zero_grad로 이전 기울기를 지우지 않으면 기울기가 누적돼요. zero_grad는 반드시 backward() 직전에 호출해야 해요. 순전파·손실 계산 후에 호출해도 되지만, backward() 이후에 쓰면 기울기가 이미 누적된 뒤라 효과가 없어요. 올바른 흐름: 순전파 → 손실 → zero_grad → backward → step'
    }
  },
  {
    id: 'pdl-training-loop',
    lang: 'python',
    title: '학습 반복문',
    file: 'training_loop.py',
    code: `import torch
import torch.nn as nn

model = nn.Linear(2, 1)
opt = torch.optim.SGD(model.parameters(), lr=0.1)
loss_fn = nn.MSELoss()

X = torch.randn(20, 2)
Y = torch.randn(20, 1)

for epoch in range(50):
  pred = model(X)
  loss = loss_fn(pred, Y)
  opt.zero_grad()
  loss.backward()
  opt.step()`,

    explain: {
      concept: '학습은 예측-오차-수정을 여러 번(epoch) 반복하는 거예요. 매번 기울기를 구해 가중치를 조금씩 고쳐요. 마치 문제를 풀고 답을 맞춰가며 실력을 키우는 것 같아요.',
      terms: [
        { t: 'epoch', d: '전체 데이터를 한 번 다 보는 횟수예요.' },
        { t: 'zero_grad', d: '이전 기울기를 지워요.' },
        { t: 'step', d: '가중치를 한 번 갱신해요.' }
      ],
      why: '한 번으로는 부족해서 여러 번 반복해야 모델이 나아져요.'
    }
  },
  {
    id: 'pdl-eval',
    lang: 'python',
    title: '평가 모드와 no_grad',
    file: 'eval.py',
    code: `import torch
import torch.nn as nn

model = nn.Linear(3, 1)
model.eval()

x = torch.randn(4, 3)
with torch.no_grad():
  out = model(x)
print(out)

# model.train()  # 평가가 끝나면 학습 모드로 돌아올 때 써요`,

    explain: {
      concept: '평가할 때는 모델을 eval 모드로 바꾸고 no_grad로 감싸요. 기울기를 기록하지 않아 메모리를 아끼고 속도가 빨라요. 시험 볼 때 메모장 덮는 것과 같아요.',
      terms: [
        { t: 'eval()', d: '평가용 모드로 전환해요. Dropout·BatchNorm 동작이 달라져요.' },
        { t: 'no_grad', d: '기울기 기록을 끄는 구간이에요.' },
        { t: 'train()', d: '평가가 끝난 뒤 다시 학습 모드로 돌아갈 때 써요.' }
      ],
      why: '학습 때 쓰는 기울기 계산은 평가에선 필요 없어서 끄면 빠르고 메모리를 아껴요.',
      pitfall: 'no_grad 안에서는 backward를 쓸 수 없어요. eval() 후에는 반드시 train()으로 복귀해야 해요.'
    }
  },
  {
    id: 'pdl-dataset',
    lang: 'python',
    title: 'Dataset 클래스',
    file: 'dataset.py',
    code: `import torch
from torch.utils.data import Dataset

class MyData(Dataset):
  def __init__(self):
    self.x = torch.randn(100, 3)
    self.y = torch.randint(0, 2, (100,))

  def __len__(self):
    return len(self.y)

  def __getitem__(self, i):
    return self.x[i], self.y[i]`,

    explain: {
      concept: 'Dataset은 데이터를 한 줄씩 꺼내는 창고예요. __len__으로 개수, __getitem__으로 i번째를 가져오는 방법을 정해요. 도서관에서 책을 번호로 찾는 것과 같아요.',
      terms: [
        { t: 'Dataset', d: '데이터 창고의 기본 틀이에요.' },
        { t: '__len__', d: '데이터가 몇 개인지 알려줘요.' },
        { t: '__getitem__', d: 'i번째 데이터를 꺼내요.' }
      ],
      why: 'DataLoader가 데이터를 꺼내갈 규칙이 필요해서예요.'
    }
  },
  {
    id: 'pdl-dataloader',
    lang: 'python',
    title: 'DataLoader 사용',
    file: 'dataloader.py',
    code: `import torch
from torch.utils.data import DataLoader, TensorDataset

x = torch.randn(100, 3)
y = torch.randint(0, 2, (100,))
ds = TensorDataset(x, y)

loader = DataLoader(ds, batch_size=16, shuffle=True)

for xb, yb in loader:
  print(xb.shape, yb.shape)`,

    explain: {
      concept: 'DataLoader는 데이터를 batch(묶음) 단위로 잘라서 가져와요. shuffle로 순서를 섞을 수 있어요. 큰 상자를 작은 상자로 나눠 배달하는 것 같아요.',
      terms: [
        { t: 'DataLoader', d: '데이터를 묶음으로 가져오는 도구예요.' },
        { t: 'batch_size', d: '한 묶음에 들어갈 데이터 수예요.' },
        { t: 'shuffle', d: '데이터 순서를 섞을지 정해요.' }
      ],
      why: '전체 데이터를 한 번에 올리면 메모리가 부족하니 묶음 단위로 나눠 학습해야 해요.',
      pitfall: '마지막 묶음은 batch_size보다 작을 수 있어요.'
    }
  },
  {
    id: 'pdl-keras-sequential',
    lang: 'python',
    title: 'Keras Sequential 모델',
    file: 'keras_sequential.py',
    code: `from tensorflow.keras import Sequential
from tensorflow.keras.layers import Dense

model = Sequential([
  Dense(16, activation="relu", input_shape=(4,)),
  Dense(8, activation="relu"),
  Dense(1, activation="sigmoid")
])

model.summary()`,

    explain: {
      concept: 'Keras의 Sequential은 층(layer)을 순서대로 쌓는 모델이에요. 리스트 안에 층을 차례로 적으면 그 순서로 데이터가 흘러가요. 블록을 위에서 아래로 쌓는 것과 같아요.',
      terms: [
        { t: 'Sequential', d: '층을 순서대로 쌓는 모델이에요.' },
        { t: 'Dense', d: '모든 입력과 출력을 이어주는 층이에요.' },
        { t: 'activation', d: '층 끝에 붙는 활성 함수예요.' }
      ],
      why: '층을 순서대로 쌓는 간단한 모델을 빠르게 만들려고 써요.'
    }
  },
  {
    id: 'pdl-keras-compile',
    lang: 'python',
    title: 'Keras 컴파일과 학습',
    file: 'keras_compile.py',
    code: `from tensorflow.keras import Sequential
from tensorflow.keras.layers import Dense

model = Sequential([Dense(1, input_shape=(3,))])
model.compile(optimizer="adam", loss="mse")

import numpy as np
x = np.random.randn(50, 3)
y = np.random.randn(50, 1)
model.fit(x, y, epochs=10, batch_size=8)`,

    explain: {
      concept: 'compile은 모델에 optimizer와 loss를 장착해요. fit으로 데이터를 넣고 학습해요. 자전거를 탈 때 기어와 브레이크를 맞추고 출발하는 것과 같아요.',
      terms: [
        { t: 'compile', d: '옵티마이저와 손실을 정해요.' },
        { t: 'fit', d: '데이터로 학습을 시작해요.' },
        { t: 'epochs', d: '전체 데이터를 몇 번 볼지 정해요.' }
      ],
      why: '학습 방법을 먼저 정해야 fit이 어떻게 학습할지 알 수 있어요.'
    }
  },
  {
    id: 'pdl-save-load',
    lang: 'python',
    title: '모델 저장·불러오기',
    file: 'save_load.py',
    code: `import torch
import torch.nn as nn

model = nn.Linear(3, 1)
torch.save(model.state_dict(), "model.pt")

new = nn.Linear(3, 1)
new.load_state_dict(torch.load("model.pt", weights_only=True))
new.eval()`,

    explain: {
      concept: 'state_dict는 모델의 가중치들이 담긴 이름표 상자예요. save로 상자를 파일에, load로 다시 꺼내올 수 있어요. 학습 결과를 보관했다가 다시 쓰는 것과 같아요.',
      terms: [
        { t: 'state_dict', d: '가중치들이 담긴 상자예요.' },
        { t: 'torch.save', d: '상자를 파일로 저장해요.' },
        { t: 'load_state_dict', d: '저장된 가중치를 모델에 넣어요.' }
      ],
      why: '학습이 오래 걸리니 결과를 파일로 남겨 나중에 다시 쓸 수 있어야 해요.',
      pitfall: 'weights_only=True를 꼭 써요. PyTorch 2.x에서는 이 옵션이 없으면 경고가 나고, 나중 버전에서는 기본값이 바뀌어요. 불러올 때는 같은 구조의 모델을 먼저 만들어야 해요.'
    }
  },
  {
    id: 'pdl-device',
    lang: 'python',
    title: 'GPU 디바이스 이동',
    file: 'device.py',
    code: `import torch
import torch.nn as nn

device = torch.device("cuda" if torch.cuda.is_available() else "cpu")

model = nn.Linear(3, 1).to(device)
x = torch.randn(5, 3).to(device)

out = model(x)
print(out.device)`,

    explain: {
      concept: 'GPU(cuda)는 CPU보다 빠르게 큰 계산을 해요. to(device)로 모델과 데이터를 같은 곳으로 옮겨야 해요. 부품과 자재를 같은 공장에 두어야 작업이 돼요.',
      terms: [
        { t: 'cuda', d: 'NVIDIA GPU를 뜻하는 이름이에요.' },
        { t: 'device', d: '계산이 일어나는 장소예요.' },
        { t: 'to', d: '모델이나 텐서를 장소로 옮겨요.' }
      ],
      why: 'GPU는 행렬 연산을 병렬로 처리해 학습 속도를 크게 높여줘요.',
      pitfall: '모델과 데이터의 장소가 다르면 계산할 때 오류가 나요.'
    }
  }
];
