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

print(f"[생성] a (리스트 변환): {a}")
print(f"[생성] b (0으로 채움): {b}")
print(f"[생성] c (1로 채움, 2x3):\n{c}")`,
    explain: {
      concept:
        '텐서(Tensor)는 PyTorch에서 모든 데이터를 담는 기본 컨테이너예요. NumPy의 ndarray와 아주 유사하지만, GPU에서도 동작할 수 있다는 점이 가장 큰 차이예요. ' +
        'torch.tensor()로 파이썬 리스트를 텐서로 변환하고, zeros()로 0으로 채워진 텐서, ones()로 1로 채워진 텐서를 만들 수 있어요. ' +
        '딥러닝의 모든 입력 데이터(이미지, 텍스트, 음성)와 모델 가중치는 텐서 형태로 표현돼요. ' +
        '텐서를 이해하는 것이 PyTorch 딥러닝의 첫걸음이에요.',
      terms: [
        { t: 'torch.tensor([1, 2, 3])', d: '파이썬 리스트를 1차원 텐서로 변환해요. dtype은 자동 추론돼요.' },
        { t: 'torch.zeros(3)', d: '0으로 채워진 크기 3의 1차원 텐서를 생성해요.' },
        { t: 'torch.ones(2, 3)', d: '1로 채워진 2행 3열의 2차원 텐서를 생성해요.' },
        { t: 'torch', d: 'PyTorch 라이브러리의 최상위 모듈이에요. import torch로 가져와요.' },
      ],
      why:
        '실무에서 딥러닝 모델의 가중치 초기화나 입력 데이터 배치를 만들 때, zeros/ones/tensor로 텐서를 생성해서 GPU 메모리에 올려요.',
      expectedOutput:
        '실행 시:\n' +
        '[생성] a (리스트 변환): tensor([1, 2, 3])\n' +
        '[생성] b (0으로 채움): tensor([0., 0., 0.])\n' +
        '[생성] c (1로 채움, 2x3):\n' +
        'tensor([[1., 1., 1.],\n' +
        '        [1., 1., 1.]])',
      realWorldUsage:
        '실제 이미지 분류 프로젝트에서 모델의 첫 번째 Linear 층 가중치를 torch.zeros로 초기화하거나, 입력 이미지 배치를 torch.tensor로 변환해서 GPU에 전달해요.',
      pitfall: '기본 dtype이 float32인 경우가 많아요. 정수 텐서가 필요하면 dtype=torch.long을 명시해야 해요.',
    },
  },
  {
    id: 'pdl-tensor-shape',
    lang: 'python',
    title: '텐서 모양 확인·변경',
    file: 'tensor_shape.py',
    code: `import torch

x = torch.arange(6)
print(f"[원본] shape: {x.shape}, 값: {x}")

y = x.reshape(2, 3)
print(f"[변환] reshape(2,3):\n{y}")

z = y.view(3, 2)
print(f"[변환] view(3,2):\n{z}")`,
    explain: {
      concept:
        '텐서의 shape은 데이터가 몇 차원으로, 각 차원에 원소가 몇 개씩 있는지를 알려줘요. ' +
        'reshape과 view는 원소의 개수와 순서를 유지하면서 텐서의 모양만 바꾸는 함수예요. ' +
        '둘의 가장 큰 차이는 view는 원본 텐서와 메모리를 공유해서 하나를 바꾸면 다른 것도 바뀌지만, reshape은 필요시 복사본을 만들어 더 안전해요. ' +
        '딥러닝에서는 (배치크기, 채널, 높이, 너비) 같은 특정 모양으로 데이터를 맞춰야 레이어를 통과할 수 있어서 shape 조작이 아주 자주 등장해요.',
      terms: [
        { t: 'x.shape', d: '텐서의 각 차원별 크기를 튜플로 보여주는 속성이에요. 예: (2, 3)은 2행 3열.' },
        { t: 'x.reshape(2, 3)', d: '텐서의 모양을 2행 3열로 재구성해요. 총 원소 수(6)는 변하지 않아요.' },
        { t: 'y.view(3, 2)', d: 'reshape과 유사하게 모양을 변경하지만, 원본과 메모리를 공유해요.' },
        { t: 'torch.arange(6)', d: '0부터 5까지의 정수로 채워진 1차원 텐서를 생성해요.' },
      ],
      why:
        '실무에서 CNN에 이미지를 입력할 때 (H, W, C) -> (C, H, W) 순서로 채널 차원을 재배치하거나, 평탄화(Flatten)할 때 reshape으로 모양을 바꿔요.',
      expectedOutput:
        '실행 시:\n' +
        '[원본] shape: torch.Size([6]), 값: tensor([0, 1, 2, 3, 4, 5])\n' +
        '[변환] reshape(2,3):\n' +
        'tensor([[0, 1, 2],\n' +
        '        [3, 4, 5]])\n' +
        '[변환] view(3,2):\n' +
        'tensor([[0, 1],\n' +
        '        [2, 3],\n' +
        '        [4, 5]])',
      realWorldUsage:
        '실제 NLP 프로젝트에서 (시퀀스길이, 배치, 은닉차원) -> (배치, 시퀀스길이, 은닉차원)으로 reshape해서 RNN 레이어에 입력해요.',
      pitfall: 'reshape과 view 모두 전체 원소 수가 정확히 일치해야 해요. 6개 원소를 2x4(8칸)로 바꾸려고 하면 RuntimeError가 발생해요.',
    },
  },
  {
    id: 'pdl-tensor-dtype',
    lang: 'python',
    title: '자료형 변환',
    file: 'tensor_dtype.py',
    code: `import torch

x = torch.tensor([1, 2, 3])
print(f"[정보] 원본 dtype: {x.dtype}")

f = x.float()
print(f"[변환] float() -> dtype: {f.dtype}, 값: {f}")

l = x.long()
print(f"[변환] long() -> dtype: {l.dtype}, 값: {l}")`,
    explain: {
      concept:
        '텐서의 dtype은 각 원소가 어떤 자료형(정수, 실수)으로 저장되는지를 결정해요. ' +
        '딥러닝의 가중치와 연산은 대부분 float32로 이뤄지고, 분류 문제의 정답 라벨은 long(int64)으로 표현해요. ' +
        'dtype이 서로 다르면 연산이 안 되거나 오류가 발생하므로, 모델에 데이터를 넣기 전에 자료형을 맞춰주는 게 중요해요. ' +
        'nn.Module의 가중치는 기본이 float32라서, float64나 int를 그대로 넣으면 에러가 나는 경우가 많아요.',
      terms: [
        { t: 'x.dtype', d: '텐서의 자료형을 알려주는 속성이에요. torch.int64, torch.float32 등으로 표시돼요.' },
        { t: 'x.float()', d: '텐서를 32비트 실수형(float32)으로 변환해요. 신경망 연산의 표준 타입이에요.' },
        { t: 'x.long()', d: '텐서를 64비트 정수형(int64)으로 변환해요. 주로 정답 라벨에 써요.' },
        { t: 'torch.tensor([1,2,3])', d: '파이썬 int 리스트를 받아 기본적으로 int64 텐서를 생성해요.' },
      ],
      why:
        '실무에서 CrossEntropyLoss는 정답 라벨로 long 타입을 요구하고, 모델 출력은 float으로 계산돼요. dtype 불일치는 가장 흔한 디버깅 이슈 중 하나예요.',
      expectedOutput:
        '실행 시:\n' +
        '[정보] 원본 dtype: torch.int64\n' +
        '[변환] float() -> dtype: torch.float32, 값: tensor([1., 2., 3.])\n' +
        '[변환] long() -> dtype: torch.int64, 값: tensor([1, 2, 3])',
      realWorldUsage:
        '실제 분류 모델 학습 루프에서 "모델 출력(logits)은 float32, 정답 라벨은 long"으로 dtype을 맞춰서 손실 함수에 전달하지 않으면 RuntimeError가 발생해요.',
      pitfall: 'PyTorch의 기본 dtype은 float32지만, NumPy에서 불러온 데이터는 float64인 경우가 많아서 dtype 불일치로 연산 오류가 발생할 수 있어요.',
    },
  },
  {
    id: 'pdl-tensor-ops',
    lang: 'python',
    title: '원소별 연산',
    file: 'tensor_ops.py',
    code: `import torch

a = torch.tensor([1.0, 2.0, 3.0])
b = torch.tensor([4.0, 5.0, 6.0])

print(f"[연산] a + b = {a + b}")
print(f"[연산] a * b = {a * b}")
print(f"[연산] a.sum() = {a.sum()}")`,
    explain: {
      concept:
        '텐서의 기본 연산(+, *, /)은 같은 위치의 원소끼리 개별적으로 계산하는 원소별 연산이에요. ' +
        '마치 두 개의 계란판에서 같은 칸의 달걀끼리 더하고 곱하는 것과 같아요. ' +
        'sum()을 포함한 많은 집계 연산은 텐서의 모든 원소를 하나의 값으로 축소해줘요. ' +
        '이런 연산들은 GPU에서 병렬로 처리되기 때문에, 수백만 개의 원소도 한 번에 빠르게 계산할 수 있어요.',
      terms: [
        { t: 'a + b', d: '같은 인덱스의 원소끼리 더해요. [1+4, 2+5, 3+6] = [5, 7, 9]가 돼요.' },
        { t: 'a * b', d: '같은 인덱스의 원소끼리 곱해요. [1*4, 2*5, 3*6] = [4, 10, 18]이 돼요.' },
        { t: 'a.sum()', d: '텐서의 모든 원소를 더해서 하나의 스칼라 값으로 만들어요.' },
        { t: 'tensor([1.0, 2.0, 3.0])', d: '소수점을 붙여서 float32 텐서를 의도적으로 생성해요.' },
      ],
      why:
        '실무에서 손실 함수의 계산, 배치 정규화, 활성 함수 적용 등 거의 모든 신경망 연산은 원소별 연산과 축소 연산의 조합으로 이뤄져요.',
      expectedOutput:
        '실행 시:\n' +
        '[연산] a + b = tensor([5., 7., 9.])\n' +
        '[연산] a * b = tensor([ 4., 10., 18.])\n' +
        '[연산] a.sum() = 6.0',
      realWorldUsage:
        '실제 학습 루프에서 loss.item()으로 스칼라 값을 꺼내기 전까지, 모든 연산은 텐서 간의 원소별 연산과 sum() 등의 축소 연산으로 이뤄져요.',
      pitfall: 'PyTorch에서 a * b는 행렬 곱이 아니라 원소별 곱이에요. 행렬 곱은 a @ b 또는 torch.matmul(a, b)로 해야 해요.',
    },
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
print(f"[원본] a (2x2):\n{a}")
print(f"[원본] b (2x2):\n{b}")
print(f"[곱셈] a @ b:\n{c}")
print(f"[정보] 결과 shape: {c.shape}")`,
    explain: {
      concept:
        '@ 연산자(또는 torch.matmul)는 행렬 곱셈을 수행해요. 신경망의 핵심 연산으로, 데이터 행렬에 가중치 행렬을 곱하는 nn.Linear의 내부 구현이 바로 이 행렬 곱셈이에요. ' +
        '일반적으로 (m × n) 행렬과 (n × p) 행렬을 곱하면 (m × p) 결과가 나와요. ' +
        '딥러닝에서는 입력 데이터 (batch × in_features)에 가중치 행렬 (in_features × out_features)을 곱해서 (batch × out_features) 출력을 만들어요. ' +
        'GPU는 이 행렬 곱셈을 수천 개의 코어로 병렬 처리해서, CPU 대비 수십~수백 배 빠른 속도를 보여줘요.',
      terms: [
        { t: 'a @ b', d: '파이썬 3.5+에서 도입된 행렬 곱셈 연산자예요. torch.matmul(a, b)와 같아요.' },
        { t: 'torch.matmul(a, b)', d: '@ 연산자와 동일한 기능의 함수 버전이에요. 가독성에 따라 선택해요.' },
        { t: 'c.shape', d: '행렬 곱셈 결과의 모양이에요. (2,2) @ (2,2) -> (2,2)가 돼요.' },
        { t: '[[1.0, 2.0], [3.0, 4.0]]', d: '2행 2열의 2차원 텐서(행렬)를 직접 생성하는 구문이에요.' },
      ],
      why:
        '딥러닝에서 모델의 추론 한 번은 수백 번의 행렬 곱셈으로 이뤄져요. GPU의 성능은 초당 수행 가능한 행렬 곱셈 횟수(FLOPS)로 측정돼요.',
      expectedOutput:
        '실행 시:\n' +
        '[원본] a (2x2):\n' +
        'tensor([[1., 2.],\n' +
        '        [3., 4.]])\n' +
        '[원본] b (2x2):\n' +
        'tensor([[5., 6.],\n' +
        '        [7., 8.]])\n' +
        '[곱셈] a @ b:\n' +
        'tensor([[19., 22.],\n' +
        '        [43., 50.]])\n' +
        '[정보] 결과 shape: torch.Size([2, 2])',
      realWorldUsage:
        '실제 GPT 모델의 셀프 어텐션(Self-Attention) 연산은 Q, K, V 행렬 간의 대규모 행렬 곱셈으로 구현되고, GPU의 Tensor Core를 활용해서 병렬 처리해요.',
      pitfall: '행렬 곱셈은 앞 행렬의 열 수와 뒤 행렬의 행 수가 반드시 같아야 해요. (m,n) @ (p,q)에서 n == p가 아니면 RuntimeError가 발생해요.',
    },
  },
  {
    id: 'pdl-autograd',
    lang: 'python',
    title: '자동 미분',
    file: 'autograd.py',
    code: `import torch

x = torch.tensor(2.0, requires_grad=True)
print(f"[설정] x = {x.item()}, requires_grad=True")
y = x ** 2 + 3 * x + 1
print(f"[순전파] y = x² + 3x + 1 = {y.item()}")

y.backward()
print(f"[역전파] 미분 결과 dy/dx = 2x + 3 = {x.grad.item()}")`,
    explain: {
      concept:
        'PyTorch의 autograd(자동 미분)는 연산 그래프를 자동으로 기록해뒀다가, backward() 호출 시 미분(기울기)을 자동으로 계산해주는 핵심 엔진이에요. ' +
        'requires_grad=True로 설정된 텐서를 포함한 모든 연산은 그래프에 기록돼서, 나중에 backward() 한 번으로 연쇄 법칙(Chain Rule)을 적용한 기울기를 구할 수 있어요. ' +
        '이게 없다면 매번 손으로 미분 공식을 유도하고 코드로 구현해야 하는데, PyTorch가 대신 해줘요. ' +
        'y = x² + 3x + 1을 미분하면 dy/dx = 2x + 3이므로, x=2.0일 때 기울기는 7.0이 돼요.',
      terms: [
        { t: 'requires_grad=True', d: '이 텐서에 대한 연산을 추적해서 기울기를 계산할 수 있게 설정해요.' },
        { t: 'y.backward()', d: 'y에서 시작해서 연산 그래프를 거꾸로 타고가며 모든 기울기를 자동 계산해요.' },
        { t: 'x.grad', d: 'backward() 실행 후 x에 누적된 기울기 값이에요. dy/dx의 값이 담겨 있어요.' },
        { t: '.item()', d: '단일 원소 텐서에서 파이썬 숫자(scalar)를 꺼내는 메서드예요.' },
      ],
      why:
        '딥러닝의 학습은 손실 함수의 기울기를 구해서 가중치를 갱신하는 과정인데, autograd가 수백만 개 파라미터의 기울기를 자동으로 계산해줘서 사람이 직접 유도할 필요가 없어요.',
      expectedOutput:
        '실행 시:\n' +
        '[설정] x = 2.0, requires_grad=True\n' +
        '[순전파] y = x² + 3x + 1 = 11.0\n' +
        '[역전파] 미분 결과 dy/dx = 2x + 3 = 7.0',
      realWorldUsage:
        '실제 GPT-4 같은 거대 언어 모델에는 수천억 개의 파라미터가 있지만, PyTorch의 autograd가 모든 파라미터의 기울기를 backward() 한 번으로 정확히 계산해줘요.',
      pitfall: 'grad는 backward()를 호출할 때마다 기존 값에 누적돼요. opt.zero_grad()로 매 학습 스텝마다 초기화해야 해요.',
    },
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
print(f"[실행] nn.Linear(3->2) 순전파")
print(f"[입력] x: {x}")
print(f"[출력] out: {out}")
print(f"[정보] 출력 shape: {out.shape}")
print(f"[정보] 가중치 shape: {layer.weight.shape}, 편향 shape: {layer.bias.shape}")`,
    explain: {
      concept:
        'nn.Linear는 입력을 출력으로 변환하는 신경망의 가장 기본적인 층(layer)이에요. ' +
        '내부적으로 입력 벡터에 가중치 행렬(weight)을 곱하고 편향(bias)을 더해서 출력을 만들어요. ' +
        '수식으로는 output = input @ weight^T + bias 예요. ' +
        'nn.Linear(3, 2)는 3차원 입력을 받아 2차원 출력을 내는 층으로, weight는 (2, 3) 모양, bias는 (2,) 모양을 가져요. ' +
        '모든 신경망은 이 Linear 층과 활성 함수를 번갈아 쌓아 올린 구조예요.',
      terms: [
        { t: 'nn.Linear(3, 2)', d: '입력 3개 -> 출력 2개로 변환하는 선형 변환 층을 생성해요.' },
        { t: 'layer(x)', d: 'nn.Module을 함수처럼 호출하면 내부의 forward()가 실행돼요.' },
        { t: 'layer.weight', d: '학습 가능한 가중치 행렬이에요. shape=(out_features, in_features).' },
        { t: 'layer.bias', d: '학습 가능한 편향 벡터예요. shape=(out_features,).' },
      ],
      why:
        '실무에서 완전연결 신경망(Fully Connected Network)은 nn.Linear를 여러 겹 쌓고, 사이사이에 ReLU 같은 활성 함수를 넣어서 구성해요.',
      expectedOutput:
        '실행 시:\n' +
        '[실행] nn.Linear(3->2) 순전파\n' +
        '[입력] x: tensor([1., 2., 3.])\n' +
        '[출력] out: tensor([-0.5234,  0.8912], grad_fn=<AddBackward0>)\n' +
        '[정보] 출력 shape: torch.Size([2])\n' +
        '[정보] 가중치 shape: torch.Size([2, 3]), 편향 shape: torch.Size([2])',
      realWorldUsage:
        '실제 영화 리뷰 감정 분석 모델에서 300차원 단어 임베딩을 nn.Linear(300, 1)로 변환해서 긍정/부정 점수 하나를 출력해요.',
      pitfall: 'nn.Linear(3, 2)의 weight shape은 (2, 3)이고, x shape은 (3,)이에요. PyTorch 내부에서 행렬 곱셈을 위해 자동으로 전치(transpose)해줘서 신경 안 써도 돼요.',
    },
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
    print("[생성] Net.__init__ - 레이어 초기화")
    self.fc = nn.Linear(3, 1)

  def forward(self, x):
    return self.fc(x)

model = Net()
print(f"[정보] 모델 생성 완료: {model}")
print(f"[정보] 모델 구조:\n{model}")`,
    explain: {
      concept:
        'nn.Module은 모든 신경망 구성 요소의 기본 클래스예요. 이를 상속받아 __init__에서 레이어(부품)를 준비하고, forward()에서 데이터가 레이어를 통과하는 흐름을 정의해요. ' +
        'PyTorch가 Module을 상속받은 클래스를 자동으로 추적해서, model.parameters()로 모든 가중치를 한 번에 가져올 수 있고, model.to(device)로 GPU로 옮길 수도 있어요. ' +
        '사용자 정의 모델은 반드시 nn.Module을 상속받고 super().__init__()을 호출해야 해요. 이 초기화 호출이 빠지면 파라미터 추적이 안 돼서 학습이 불가능해요.',
      terms: [
        { t: 'class Net(nn.Module)', d: 'nn.Module을 상속받아 나만의 신경망 클래스를 정의해요.' },
        { t: 'super().__init__()', d: '부모 클래스 nn.Module의 초기화를 호출해요. 생략하면 파라미터 추적이 안 돼요.' },
        { t: 'self.fc = nn.Linear(3, 1)', d: '속도(self.fc)에 Linear 층 객체를 등록해요. 자동으로 파라미터로 인식돼요.' },
        { t: 'def forward(self, x)', d: '입력 x가 모델을 통과하는 순전파 경로를 정의해요.' },
      ],
      why:
        '실무에서 ResNet, Transformer 같은 복잡한 모델도 결국 nn.Module을 상속받고, __init__에 nn.Conv2d, nn.MultiheadAttention 등을 조립해서 구성해요.',
      expectedOutput:
        '실행 시:\n' +
        '[생성] Net.__init__ - 레이어 초기화\n' +
        '[정보] 모델 생성 완료: Net(\n' +
        '  (fc): Linear(in_features=3, out_features=1, bias=True)\n' +
        ')\n' +
        '[정보] 모델 구조:\n' +
        'Net(\n' +
        '  (fc): Linear(in_features=3, out_features=1, bias=True)\n' +
        ')',
      realWorldUsage:
        '실제 프로젝트에서 HuggingFace의 모든 모델(BERT, GPT-2, T5)은 nn.Module을 상속받아 만들어졌어요. 그래서 model.to("cuda"), model.eval() 같은 공통 API를 쓸 수 있어요.',
      pitfall: 'super().__init__()을 호출하지 않으면 self.fc의 파라미터가 model.parameters()에 등록되지 않아서, 옵티마이저가 가중치를 찾지 못하고 학습이 전혀 안 돼요.',
    },
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
x = torch.randn(4)
out = model(x)
print(f"[입력] x shape: {x.shape}")
print(f"[순전파] fc1(4->8) -> ReLU -> fc2(8->1)")
print(f"[출력] out: {out}")
print(f"[정보] 출력 shape: {out.shape}")`,
    explain: {
      concept:
        'forward()는 입력 데이터가 모델의 모든 레이어를 순서대로 통과하면서 최종 출력을 만들어내는 경로를 정의해요. ' +
        'model(x)처럼 모델 객체를 직접 호출하면 PyTorch가 자동으로 forward()를 실행해줘요. ' +
        '여기서는 fc1(4->8) -> ReLU -> fc2(8->1) 순서로 데이터가 흘러가요. ReLU는 음수를 0으로 만드는 활성 함수로, 층 사이에 비선형성을 추가해줘요. ' +
        '실제 딥러닝 모델의 forward()는 수십 개의 레이어와 스킵 커넥션, 정규화 층 등이 복잡하게 얽혀 있어요.',
      terms: [
        { t: 'def forward(self, x)', d: '데이터가 흘러가는 순전파 경로를 정의하는 메서드예요.' },
        { t: 'torch.relu(self.fc1(x))', d: 'fc1을 통과한 결과의 음수를 0으로 만드는 활성 함수를 적용해요.' },
        { t: 'model(x)', d: '모델 객체를 직접 호출하면 forward()가 자동 실행돼요. __call__이 내부적으로 호출해줘요.' },
        { t: 'torch.randn(4)', d: '표준정규분포에서 무작위로 4개의 값을 생성해 더미 입력 데이터로 써요.' },
      ],
      why:
        '실무에서 CNN의 forward()는 Conv -> BN -> ReLU -> Pool을 여러 번 반복하고, Transformer의 forward()는 Self-Attention -> FFN을 여러 번 쌓아요. forward를 이해하는 게 모델 설계의 핵심이에요.',
      expectedOutput:
        '실행 시:\n' +
        '[입력] x shape: torch.Size([4])\n' +
        '[순전파] fc1(4->8) -> ReLU -> fc2(8->1)\n' +
        '[출력] out: tensor([-0.2341], grad_fn=<AddBackward0>)\n' +
        '[정보] 출력 shape: torch.Size([1])',
      realWorldUsage:
        '실제 이미지 분류 모델(ResNet-50)에서 forward()는 입력 이미지(3x224x224)를 50개의 Conv 층과 스킵 커넥션으로 통과시켜 1000개 클래스 로짓을 출력해요.',
      pitfall: 'model.forward(x) 대신 model(x)로 호출해야 forward 전/후에 PyTorch가 등록한 훅(hook)들이 정상 동작해요.',
    },
  },
  {
    id: 'pdl-activation',
    lang: 'python',
    title: '활성 함수',
    file: 'activation.py',
    code: `import torch
import torch.nn.functional as F

x = torch.tensor([-2.0, -1.0, 0.0, 1.0, 2.0])
print(f"[입력] x: {x}")

r = F.relu(x)
s = torch.sigmoid(x)
t = torch.tanh(x)

print(f"[ReLU] 음수->0: {r}")
print(f"[Sigmoid] 0~1: {s}")
print(f"[Tanh] -1~1: {t}")`,
    explain: {
      concept:
        '활성 함수(Activation Function)는 신경망 층 사이에 비선형성을 주입하는 함수예요. ' +
        '활성 함수가 없으면 아무리 많은 층을 쌓아도 결국 하나의 선형 변환과 같아져서, 복잡한 패턴을 전혀 배울 수 없어요. ' +
        'ReLU는 음수를 0으로 만들어서 계산이 빠르고 기울기 소실 문제를 완화해요. Sigmoid는 출력을 0~1 범위로 제한해서 확률로 해석할 수 있어요. ' +
        'Tanh는 -1~1 범위로 제한하며 0을 중심으로 분포해서 Sigmoid보다 학습이 잘 되는 편이에요. ' +
        '요즘은 은닉층에 거의 항상 ReLU를 쓰고, 이진 분류 출력층에만 Sigmoid를 쓰는 게 일반적이에요.',
      terms: [
        { t: 'F.relu(x)', d: 'torch.nn.functional의 ReLU 함수예요. max(0, x)를 각 원소에 적용해요.' },
        { t: 'torch.sigmoid(x)', d: '각 값을 0~1 사이로 압축해요. 이진 분류 출력층에 자주 써요.' },
        { t: 'torch.tanh(x)', d: '각 값을 -1~1 사이로 압축해요. 0 중심 분포로 ReLU 이전에 많이 썼어요.' },
        { t: 'F.relu vs nn.ReLU', d: 'F.relu는 순수 함수, nn.ReLU는 상태를 가진 모듈이에요. forward 안에서는 F.relu가 더 간결해요.' },
      ],
      why:
        '실무에서 깊은 신경망 학습 시 ReLU 계열(ReLU, GELU, Swish)을 쓰지 않으면 기울기 소실로 인해 앞쪽 층이 전혀 학습되지 않는 문제가 발생해요.',
      expectedOutput:
        '실행 시:\n' +
        '[입력] x: tensor([-2., -1.,  0.,  1.,  2.])\n' +
        '[ReLU] 음수->0: tensor([0., 0., 0., 1., 2.])\n' +
        '[Sigmoid] 0~1: tensor([0.1192, 0.2689, 0.5000, 0.7311, 0.8808])\n' +
        '[Tanh] -1~1: tensor([-0.9640, -0.7616,  0.0000,  0.7616,  0.9640])',
      realWorldUsage:
        '실제 이미지 분류 모델(ResNet)은 모든 Conv 층 뒤에 ReLU를 붙이고, 최종 출력에만 클래스 수에 맞춰 Softmax(Sigmoid의 다중 클래스 버전)를 써서 확률 분포를 출력해요.',
      pitfall: 'nn.ReLU()는 모듈이라서 model.to(device)로 GPU에 올릴 수 있지만, F.relu()는 함수라서 따로 올릴 필요 없이 입력이 GPU에 있으면 자동으로 GPU에서 실행돼요.',
    },
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
print(f"[예측] pred: {pred}")
print(f"[정답] target: {target}")
print(f"[손실] MSE: {loss.item():.4f}")
print(f"[정보] 손실이 작을수록 예측이 정답에 가까워요")`,
    explain: {
      concept:
        '손실 함수(Loss Function)는 모델의 예측이 정답과 얼마나 차이나는지 하나의 숫자로 점수를 매기는 함수예요. ' +
        'MSE(Mean Squared Error)는 (예측 - 정답)²의 평균으로, 회귀 문제에서 가장 기본이 되는 손실 함수예요. ' +
        '손실 값이 클수록 "지금 모델이 많이 틀리고 있다"는 뜻이고, 학습 과정에서 이 손실을 줄이는 방향으로 가중치를 갱신해요. ' +
        '분류 문제에서는 CrossEntropyLoss를, 회귀 문제에서는 MSE를 주로 써요. ' +
        'loss.item()은 텐서 안의 단일 숫자를 파이썬 float으로 꺼내서 로깅이나 출력에 사용해요.',
      terms: [
        { t: 'nn.MSELoss()', d: '예측값과 정답값의 차이의 제곱 평균을 계산하는 손실 함수예요.' },
        { t: 'mse(pred, target)', d: '손실 함수에 예측과 정답을 넣어서 스칼라 손실 값을 계산해요.' },
        { t: 'loss.item()', d: '텐서 안의 스칼라 값을 파이썬 float 숫자로 꺼내는 메서드예요.' },
        { t: 'pred / target', d: 'pred는 모델의 예측값, target은 실제 정답이에요. 모양이 같아야 해요.' },
      ],
      why:
        '실무에서 학습이 잘 되고 있는지 모니터링할 때 loss 값의 추이를 보면서 판단해요. loss가 꾸준히 감소하면 학습이 잘 되고 있다는 신호예요.',
      expectedOutput:
        '실행 시:\n' +
        '[예측] pred: tensor([0.2000, 0.7000, 0.9000])\n' +
        '[정답] target: tensor([0., 1., 1.])\n' +
        '[손실] MSE: 0.0467\n' +
        '[정보] 손실이 작을수록 예측이 정답에 가까워요',
      realWorldUsage:
        '실제 이미지 생성 모델(GAN)에서는 Generator와 Discriminator가 서로 반대 목표의 손실 함수를 최적화하면서 경쟁적으로 학습해요.',
      pitfall: 'loss.backward()를 호출하기 전에 loss.item()으로 값을 확인하면 텐서의 연산 그래프가 유지돼서 괜찮지만, backward 후에는 호출해도 문제없어요.',
    },
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
print(f"[순전파] loss: {loss.item():.4f}")
loss.backward()
print(f"[역전파] backward() 실행 완료")
opt.step()
print(f"[갱신] step() - 가중치 업데이트 완료")`,
    explain: {
      concept:
        '옵티마이저(Optimizer)는 손실을 줄이는 방향으로 모델의 가중치를 조금씩 갱신하는 알고리즘이에요. ' +
        'SGD(확률적 경사 하강법)는 가장 기본적인 옵티마이저로, 현재 위치에서 손실이 가장 가파르게 감소하는 방향(기울기의 반대 방향)으로 lr(학습률)만큼 이동해요. ' +
        '한 번의 학습 단계는 zero_grad(기울기 초기화) -> 순전파 -> loss 계산 -> backward(기울기 계산) -> step(가중치 갱신) 순서로 이뤄져요. ' +
        'zero_grad를 먼저 호출하지 않으면 이전 배치의 기울기가 누적돼서 학습이 엉망이 돼요.',
      terms: [
        { t: 'torch.optim.SGD(model.parameters(), lr=0.01)', d: 'SGD 옵티마이저를 생성하고 학습률 0.01로 설정해요.' },
        { t: 'lr=0.01', d: '학습률(learning rate)이에요. 한 번에 얼마나 가중치를 움직일지 결정하는 보폭이에요.' },
        { t: 'opt.zero_grad()', d: '이전 배치의 기울기를 모두 0으로 초기화해요. 누적을 막기 위해 필수예요.' },
        { t: 'opt.step()', d: '계산된 기울기를 바탕으로 모델의 모든 가중치를 한 번 갱신해요.' },
      ],
      why:
        '실무에서는 SGD보다 Adam(AdamW)을 훨씬 더 많이 써요. Adam은 학습률을 파라미터마다 자동으로 조절해줘서 SGD보다 빠르고 안정적으로 학습돼요.',
      expectedOutput:
        '실행 시:\n' +
        '[순전파] loss: 1.2345\n' +
        '[역전파] backward() 실행 완료\n' +
        '[갱신] step() - 가중치 업데이트 완료',
      realWorldUsage:
        '실제 GPT 모델 학습 시 AdamW 옵티마이저를 사용하고, 학습률 스케줄러와 함께 수천억 파라미터의 가중치를 수개월에 걸쳐 조금씩 갱신해요.',
      pitfall: 'zero_grad()를 backward() 직전이 아닌, 이미 backward() 이후에 호출하면 방금 계산한 기울기가 지워져서 step()이 아무 일도 안 하게 돼요. 올바른 순서: 순전파 -> loss -> zero_grad -> backward -> step.',
    },
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
print(f"[시작] 학습 - 50 epoch, {len(X)}개 샘플")

for epoch in range(50):
  pred = model(X)
  loss = loss_fn(pred, Y)
  opt.zero_grad()
  loss.backward()
  opt.step()
  if epoch % 10 == 0:
    print(f"  epoch {epoch:3d} - loss: {loss.item():.4f}")

print(f"[완료] 최종 loss: {loss.item():.4f}")`,
    explain: {
      concept:
        '학습 반복문(Training Loop)은 한 번의 학습이 아니라, 여러 epoch에 걸쳐 예측->손실->기울기->갱신을 반복해서 모델을 점진적으로 개선하는 과정이에요. ' +
        '매 epoch마다 모든 훈련 데이터를 한 번씩 모델에 통과시켜서 예측을 만들고, 손실을 계산하고, 기울기를 구해서 가중치를 갱신해요. ' +
        'epoch가 진행될수록 loss가 감소하는 모습을 볼 수 있는데, 이게 바로 "모델이 배우고 있다"는 증거예요. ' +
        '실무에서는 전체 데이터를 한 번에 넣지 않고 DataLoader로 배치 단위로 나눠서 넣고, 수백~수천 epoch를 반복해요.',
      terms: [
        { t: 'for epoch in range(50)', d: '전체 데이터를 50번 반복해서 학습해요. 50 epoch 학습이에요.' },
        { t: 'loss_fn(pred, Y)', d: '현재 모델의 예측과 실제 정답의 차이(손실)를 계산해요.' },
        { t: 'opt.step()', d: 'backward()로 구한 기울기로 모델 가중치를 한 번 갱신해요.' },
        { t: 'loss.item():.4f', d: '손실 값을 소수점 4자리까지 출력해서 학습 진행 상황을 모니터링해요.' },
      ],
      why:
        '실무에서 딥러닝 학습은 수천~수만 번의 epoch가 필요할 수 있어서, 로깅과 체크포인트 저장이 포함된 정교한 학습 루프를 구축해요.',
      expectedOutput:
        '예시:\n' +
        '[시작] 학습 - 50 epoch, 20개 샘플\n' +
        '  epoch   0 - loss: 2.3456\n' +
        '  epoch  10 - loss: 0.8765\n' +
        '  epoch  20 - loss: 0.4321\n' +
        '  epoch  30 - loss: 0.2345\n' +
        '  epoch  40 - loss: 0.1234\n' +
        '[완료] 최종 loss: 0.0987',
      realWorldUsage:
        '실제 언어 모델 학습 스크립트에서 학습 루프는 "for epoch -> for batch -> forward -> loss -> backward -> step -> log -> checkpoint" 패턴으로 구성돼요.',
      pitfall: '손실이 처음부터 줄어들지 않고 진동하거나 NaN이 나오면, 학습률(lr)이 너무 크다는 신호예요. lr을 1/10씩 낮춰보는 게 첫 번째 대응이에요.',
    },
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
print(f"[모드] model.eval() - 평가 모드로 전환")

x = torch.randn(4, 3)
with torch.no_grad():
  out = model(x)
  print(f"[예측] no_grad 구간 내 예측 완료")
print(f"[결과] out:\n{out}")
print(f"[정보] 기울기 기록 비활성화됨 (grad_fn 없음)")`,
    explain: {
      concept:
        '모델을 평가할 때는 eval() 모드로 전환하고 torch.no_grad() 구간 안에서 예측해야 해요. ' +
        'eval()은 Dropout이나 BatchNorm 같이 학습 때와 평가 때 동작이 다른 레이어를 평가 모드로 전환해줘요. ' +
        'no_grad()는 기울기 계산과 연산 그래프 기록을 완전히 꺼서, 메모리 사용량을 대폭 줄이고 예측 속도를 높여줘요. ' +
        '평가가 끝나면 model.train()을 호출해서 다시 학습 모드로 복귀해야 해요. ' +
        '실무에서는 모델 추론(서빙) 시 이 두 가지가 항상 함께 쓰여요.',
      terms: [
        { t: 'model.eval()', d: '모델을 평가 모드로 전환해요. Dropout이 꺼지고 BatchNorm이 고정돼요.' },
        { t: 'torch.no_grad()', d: '이 구간 안에서는 연산 그래프를 기록하지 않고 기울기를 계산하지 않아요.' },
        { t: 'with torch.no_grad()', d: '컨텍스트 매니저로 특정 코드 블록에서만 기울기 계산을 비활성화해요.' },
        { t: 'model.train()', d: '평가 후 학습을 재개하기 전에 호출해서 학습 모드로 복귀해요.' },
      ],
      why:
        '실무에서 모델 서빙 시 수천 건의 예측 요청을 처리하면서 매번 기울기를 기록하면 메모리가 순식간에 고갈되고 속도도 크게 느려져요. no_grad가 필수예요.',
      expectedOutput:
        '실행 시:\n' +
        '[모드] model.eval() - 평가 모드로 전환\n' +
        '[예측] no_grad 구간 내 예측 완료\n' +
        '[결과] out:\n' +
        'tensor([[ 0.2341],\n' +
        '        [-0.5672],\n' +
        '        [ 0.8912],\n' +
        '        [-0.1234]])\n' +
        '[정보] 기울기 기록 비활성화됨 (grad_fn 없음)',
      realWorldUsage:
        '실제 배포된 모델 서버에서 REST API 요청을 처리할 때, 모든 예측 로직은 with torch.no_grad() 안에서 model(x)를 호출해서 최소한의 메모리로 최대한 빠르게 응답해요.',
      pitfall: 'eval() 후에 model.train()을 호출하지 않으면 Dropout이 계속 꺼진 상태로 학습하게 돼서, 정규화 효과를 전혀 못 보고 과적합된 모델이 만들어져요.',
    },
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
    print("[생성] MyData - 데이터셋 초기화")
    self.x = torch.randn(100, 3)
    self.y = torch.randint(0, 2, (100,))

  def __len__(self):
    return len(self.y)

  def __getitem__(self, i):
    return self.x[i], self.y[i]

ds = MyData()
print(f"[정보] 데이터셋 크기: {len(ds)}")
print(f"[정보] 첫 번째 샘플: x={ds[0][0][:3]}, y={ds[0][1]}")`,
    explain: {
      concept:
        'Dataset은 데이터를 한 조각씩 꺼낼 수 있게 해주는 PyTorch의 데이터 추상화 클래스예요. ' +
        '반드시 __len__으로 데이터 총 개수를, __getitem__으로 i번째 데이터를 반환하는 메서드를 구현해야 해요. ' +
        '이 두 메서드만 구현하면 DataLoader가 자동으로 데이터를 배치 단위로 묶고, 셔플하고, 병렬로 불러올 수 있어요. ' +
        '실무에서는 이미지 파일 경로 목록, CSV 데이터, 데이터베이스 쿼리 결과 등 어떤 소스든 Dataset으로 감싸서 PyTorch의 학습 파이프라인에 연결할 수 있어요.',
      terms: [
        { t: 'class MyData(Dataset)', d: 'torch.utils.data.Dataset을 상속받아 나만의 데이터셋을 정의해요.' },
        { t: '__len__(self)', d: '데이터의 총 개수를 반환하는 메서드예요. len(ds)로 호출할 수 있어요.' },
        { t: '__getitem__(self, i)', d: 'i번째 (입력, 라벨) 쌍을 반환하는 메서드예요. ds[i]로 접근해요.' },
        { t: 'torch.randint(0, 2, (100,))', d: '0 또는 1의 무작위 정수 100개로 이진 분류 라벨을 생성해요.' },
      ],
      why:
        '실무에서 CSV, JSON, 이미지 파일, 오디오 클립 등 어떤 형식이든 Dataset으로 감싸서 DataLoader와 연결하면 자동 배치, 셔플, 병렬 로딩이 가능해져요.',
      expectedOutput:
        '실행 시:\n' +
        '[생성] MyData - 데이터셋 초기화\n' +
        '[정보] 데이터셋 크기: 100\n' +
        '[정보] 첫 번째 샘플: x=tensor([0.5234, -1.2345, 0.8912]), y=1',
      realWorldUsage:
        '실제 이미지 분류 프로젝트에서 torchvision.datasets.ImageFolder는 디렉터리 구조를 읽어 자동으로 Dataset을 생성해줘요. 사용자 정의 Dataset은 의료 이미지(DICOM 형식) 같은 표준 라이브러리가 지원하지 않는 형식을 다룰 때 직접 만들어요.',
      pitfall: '__getitem__의 반환값은 반드시 텐서여야 해요. NumPy 배열이나 PIL Image를 반환하면 DataLoader의 collate_fn에서 에러가 나요. ToTensor 변환을 적용해야 해요.',
    },
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
print(f"[실행] DataLoader - batch_size=16, shuffle=True")

for batch_idx, (xb, yb) in enumerate(loader):
  print(f"  batch {batch_idx}: x shape={tuple(xb.shape)}, y shape={tuple(yb.shape)}")
  if batch_idx >= 2:
    print(f"  ... (생략)")
    break
print(f"[정보] 총 배치 수: {len(loader)}")`,
    explain: {
      concept:
        'DataLoader는 Dataset에서 데이터를 배치(batch) 단위로 잘라서 가져와주는 반복자(Iterator)예요. ' +
        'batch_size=16이면 한 번에 16개씩 묶어서 모델에 전달할 수 있는 형태로 만들어줘요. ' +
        'shuffle=True를 주면 매 epoch마다 데이터 순서를 랜덤하게 섞어서, 모델이 순서를 외우지 못하게 해줘요. ' +
        '실무에서는 DataLoader가 자동으로 여러 워커 프로세스를 띄워서 데이터를 병렬로 로딩해, GPU가 데이터를 기다리지 않고 계속 연산할 수 있게 해줘요.',
      terms: [
        { t: 'DataLoader(ds, batch_size=16, shuffle=True)', d: 'Dataset을 배치 단위로 묶어주는 데이터 로더를 생성해요.' },
        { t: 'batch_size=16', d: '한 번에 모델에 전달할 샘플 개수예요. GPU 메모리에 맞춰 조절해요.' },
        { t: 'shuffle=True', d: '매 epoch마다 데이터 순서를 무작위로 섞어요. 학습 시 필수, 평가 시 False.' },
        { t: 'TensorDataset(x, y)', d: '텐서로 바로 Dataset을 만드는 편의 클래스예요.' },
      ],
      why:
        '실무에서 GPU 학습 시 batch_size는 GPU 메모리에 맞춰 최대한 크게 잡아요. 작으면 GPU 활용도가 낮고, 너무 크면 Out of Memory 오류가 발생해요.',
      expectedOutput:
        '예시:\n' +
        '[실행] DataLoader - batch_size=16, shuffle=True\n' +
        '  batch 0: x shape=(16, 3), y shape=(16,)\n' +
        '  batch 1: x shape=(16, 3), y shape=(16,)\n' +
        '  batch 2: x shape=(16, 3), y shape=(16,)\n' +
        '  ... (생략)\n' +
        '[정보] 총 배치 수: 7',
      realWorldUsage:
        '실제 대규모 학습에서 num_workers=8로 설정하면 8개의 별도 프로세스가 데이터를 미리 배치로 준비해둬서, GPU가 데이터를 기다리지 않고 연속적으로 학습할 수 있어요.',
      pitfall: '마지막 배치는 batch_size보다 작을 수 있어요(drop_last=True로 버릴 수도 있어요). BatchNorm 같은 레이어는 배치 크기에 민감해서 주의가 필요해요.',
    },
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

model.summary()
print(f"[정보] 총 레이어 수: {len(model.layers)}")`,
    explain: {
      concept:
        'Keras의 Sequential은 레이어를 순서대로 쌓아 올리는 가장 단순한 모델 구성 방식이에요. ' +
        '리스트 안에 레이어를 위에서부터 아래로 순서대로 나열하면, 그 순서로 데이터가 흘러가요. ' +
        '첫 번째 Dense(16, input_shape=(4,))는 4개 특성을 받아 16개 뉴런으로 확장하는 입력층이에요. ' +
        '마지막 Dense(1, activation="sigmoid")는 0~1 사이의 값을 출력하는 이진 분류 출력층이에요. ' +
        'model.summary()는 레이어별 출력 shape과 파라미터 수를 표로 보여줘서 모델 구조를 한눈에 파악할 수 있어요.',
      terms: [
        { t: 'Sequential([...])', d: '레이어를 순서대로 쌓아서 만드는 Keras의 가장 단순한 모델 방식이에요.' },
        { t: 'Dense(16, activation="relu")', d: '16개 뉴런의 완전연결층에 ReLU 활성 함수를 적용해요.' },
        { t: 'input_shape=(4,)', d: '입력 데이터의 특성 개수를 첫 번째 레이어에만 지정해요.' },
        { t: 'model.summary()', d: '레이어별 구조, 파라미터 개수, 출력 shape을 표로 출력해줘요.' },
      ],
      why:
        '실무에서 간단한 피드포워드 신경망이면 Sequential로 충분하고, ResNet이나 Inception처럼 분기·병합이 있는 복잡한 구조는 Functional API를 써요.',
      expectedOutput:
        '실행 시:\n' +
        'Model: "sequential"\n' +
        '┌──────────┬────────┬──────────┬───────────┐\n' +
        '│ Layer    │ Output │ Param #  │\n' +
        '├──────────┼────────┼──────────┼───────────┤\n' +
        '│ dense    │ (N,16) │       80 │\n' +
        '│ dense_1  │ (N,8)  │      136 │\n' +
        '│ dense_2  │ (N,1)  │        9 │\n' +
        '└──────────┴────────┴──────────┴───────────┘\n' +
        '[정보] 총 레이어 수: 3',
      realWorldUsage:
        '실제 프로토타입 개발 시 Sequential로 빠르게 모델을 만들고 실험한 뒤, 성능이 확인되면 Functional API로 리팩토링해서 Skip Connection 같은 고급 기능을 추가해요.',
      pitfall: 'Sequential은 단일 입력 -> 단일 출력의 직선 흐름만 지원해요. 다중 입력, 다중 출력, 레이어 간 분기·병합이 필요하면 Functional API를 써야 해요.',
    },
  },
  {
    id: 'pdl-keras-compile',
    lang: 'python',
    title: 'Keras 컴파일과 학습',
    file: 'keras_compile.py',
    code: `from tensorflow.keras import Sequential
from tensorflow.keras.layers import Dense
import numpy as np

model = Sequential([Dense(1, input_shape=(3,))])
model.compile(optimizer="adam", loss="mse")
print(f"[컴파일] optimizer=adam, loss=mse")

x = np.random.randn(50, 3).astype(np.float32)
y = np.random.randn(50, 1).astype(np.float32)
history = model.fit(x, y, epochs=10, batch_size=8, verbose=0)
print(f"[학습] 10 epoch 완료")
print(f"[결과] 최종 loss: {history.history['loss'][-1]:.4f}")`,
    explain: {
      concept:
        'Keras에서 compile()은 모델에 "어떻게 학습할지"에 대한 설정(옵티마이저, 손실 함수)을 장착하는 단계예요. ' +
        'optimizer="adam"은 가장 널리 쓰이는 옵티마이저로, SGD보다 빠르고 안정적으로 수렴해요. ' +
        'fit()은 실제 학습을 실행하는 메서드로, epochs=10은 전체 데이터를 10번 반복해서 보여준다는 뜻이에요. ' +
        'PyTorch는 학습 루프를 직접 작성해야 하지만, Keras는 compile() + fit() 두 줄로 학습이 진행되는 게 가장 큰 차이예요.',
      terms: [
        { t: 'model.compile(optimizer="adam", loss="mse")', d: '옵티마이저와 손실 함수를 설정해서 학습 준비를 해요.' },
        { t: 'model.fit(x, y, epochs=10, batch_size=8)', d: '데이터로 10 epoch 학습을 실행해요. batch_size=8씩 나눠 넣어요.' },
        { t: 'verbose=0', d: '학습 중 진행 막대(progress bar) 출력을 끄는 옵션이에요. 0=끔, 1=막대, 2=epoch당 한 줄.' },
        { t: 'history.history["loss"]', d: '각 epoch의 loss 값을 담은 리스트예요. 학습 경과를 그래프로 그릴 때 써요.' },
      ],
      why:
        '실무에서 빠른 프로토타이핑이 필요할 때 Keras의 compile+fit 패턴이 PyTorch보다 훨씬 적은 코드로 동일한 학습을 수행할 수 있어서 생산성이 높아요.',
      expectedOutput:
        '예시:\n' +
        '[컴파일] optimizer=adam, loss=mse\n' +
        '[학습] 10 epoch 완료\n' +
        '[결과] 최종 loss: 0.2345',
      realWorldUsage:
        '실제 연구 환경에서 새로운 아이디어를 빠르게 실험할 때, Keras로 5분 만에 모델을 만들고 학습해보고, 성능이 나오면 PyTorch로 프로덕션 코드를 다시 작성하는 워크플로우를 쓰기도 해요.',
      pitfall: 'fit()은 기본적으로 이전 학습 상태에서 이어서 학습하지 않고 매번 새로 시작해요. 이미 학습된 모델에 추가 학습하려면 처음부터 다시 만들어야 해요.',
    },
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
print(f"[저장] 모델 가중치 저장 -> model.pt")

new = nn.Linear(3, 1)
new.load_state_dict(torch.load("model.pt", weights_only=True))
new.eval()
print(f"[로드] 가중치 불러오기 완료")
print(f"[검증] 동일 구조 모델에 가중치 이식 성공")`,
    explain: {
      concept:
        'PyTorch에서 모델을 저장할 때는 모델 전체가 아니라 state_dict(가중치 딕셔너리)를 저장하는 게 표준 방식이에요. ' +
        'state_dict는 OrderedDict 형태로, 각 레이어의 가중치와 편향을 이름-값 쌍으로 담고 있어요. ' +
        '불러올 때는 반드시 같은 구조의 모델을 먼저 생성한 뒤, load_state_dict()로 가중치만 이식해야 해요. ' +
        'weights_only=True는 보안 옵션으로, 악의적인 pickle 코드 실행을 막아줘서 PyTorch 2.x부터 권장돼요.',
      terms: [
        { t: 'model.state_dict()', d: '모델의 모든 가중치를 이름-텐서 쌍으로 담은 OrderedDict를 반환해요.' },
        { t: 'torch.save(model.state_dict(), "model.pt")', d: '가중치 딕셔너리를 .pt 파일로 저장해요.' },
        { t: 'torch.load("model.pt", weights_only=True)', d: '저장된 가중치를 불러와요. weights_only=True는 보안 옵션이에요.' },
        { t: 'new.load_state_dict(...)', d: '불러온 가중치를 동일 구조의 새 모델에 이식해요.' },
      ],
      why:
        '실무에서는 수주 동안 학습한 모델의 가중치를 state_dict로 저장하고, 예측 서버에서 동일한 모델 구조를 생성한 뒤 load_state_dict로 가중치만 불러와서 서빙해요.',
      expectedOutput:
        '실행 시:\n' +
        '[저장] 모델 가중치 저장 -> model.pt\n' +
        '[로드] 가중치 불러오기 완료\n' +
        '[검증] 동일 구조 모델에 가중치 이식 성공',
      realWorldUsage:
        '실제 HuggingFace의 from_pretrained("bert-base-uncased")는 내부적으로 저장된 state_dict를 다운로드해서 BERT 모델 구조에 load_state_dict로 이식해요.',
      pitfall: 'weights_only=True를 쓰지 않으면 pickle 역직렬화 중 악의적인 코드가 실행될 수 있는 보안 위험이 있어요. PyTorch 2.x의 기본값은 True로 변경될 예정이에요.',
    },
  },
  {
    id: 'pdl-device',
    lang: 'python',
    title: 'GPU 디바이스 이동',
    file: 'device.py',
    code: `import torch
import torch.nn as nn

device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
print(f"[정보] 사용 디바이스: {device}")

model = nn.Linear(3, 1).to(device)
x = torch.randn(5, 3).to(device)

out = model(x)
print(f"[순전파] GPU에서 연산 수행")
print(f"[결과] out: {out}")
print(f"[정보] 출력 디바이스: {out.device}")`,
    explain: {
      concept:
        'GPU(CUDA)는 행렬 연산을 수천 개의 코어로 병렬 처리해서 CPU보다 딥러닝 연산을 수십~수백 배 빠르게 수행해요. ' +
        '.to(device)를 호출하면 텐서나 모델이 GPU 메모리로 이동하고, 이후 모든 연산이 GPU에서 실행돼요. ' +
        'torch.cuda.is_available()로 GPU 사용 가능 여부를 확인해서, GPU가 있으면 cuda를, 없으면 cpu를 사용하는 코드는 어디서든 동작하는 이식성이 좋은 패턴이에요. ' +
        '모델과 데이터가 반드시 같은 device에 있어야 연산이 가능해요. 하나라도 device가 다르면 RuntimeError가 발생해요.',
      terms: [
        { t: 'torch.device("cuda" if ... else "cpu")', d: 'GPU가 있으면 cuda, 없으면 cpu를 자동 선택하는 패턴이에요.' },
        { t: 'torch.cuda.is_available()', d: '현재 시스템에 CUDA(NVIDIA GPU)가 사용 가능한지 bool로 반환해요.' },
        { t: '.to(device)', d: '모델이나 텐서를 지정한 디바이스로 이동시켜요. GPU 텐서만 GPU 연산에 참여할 수 있어요.' },
        { t: 'out.device', d: '텐서가 현재 어느 디바이스에 존재하는지 알려주는 속성이에요.' },
      ],
      why:
        '실무에서 모델 학습 시 GPU 없이는 수백만 파라미터의 학습이 거의 불가능해요. CPU로 1주일 걸리는 학습이 GPU로는 몇 시간이면 끝나요.',
      expectedOutput:
        'GPU 환경:\n' +
        '[정보] 사용 디바이스: cuda\n' +
        '[순전파] GPU에서 연산 수행\n' +
        '[결과] out: tensor([[-0.1234], [0.5678], [0.9012], [-0.3456], [0.7890]], device=\'cuda:0\')\n' +
        '[정보] 출력 디바이스: cuda:0\n\n' +
        'CPU 환경:\n' +
        '[정보] 사용 디바이스: cpu\n' +
        '[순전파] GPU에서 연산 수행\n' +
        '[결과] out: tensor([...])\n' +
        '[정보] 출력 디바이스: cpu',
      realWorldUsage:
        '실제 프로젝트에서 model.to(device) 한 줄만 추가하면, Colab의 무료 T4 GPU부터 AWS의 A100 클러스터까지 동일한 코드로 학습할 수 있어요.',
      pitfall: '모델과 데이터 중 하나만 GPU에 올리고 다른 하나는 CPU에 남겨두면, 연산 시 "Expected all tensors to be on the same device" RuntimeError가 발생해요.',
    },
  },
];
