import type { Snippet } from '../../types';

export const pythonData: Snippet[] = [
  {
    id: 'pdata-numpy-create-array',
    lang: 'python',
    title: 'NumPy 배열(ndarray) 생성',
    file: 'numpy_create.py',
    code: `import numpy as np

arr = np.array([1, 2, 3, 4, 5])
print(f"[정보] 배열 모양: {arr.shape}")
print(f"[정보] 원소 타입: {arr.dtype}")
print(f"[결과] 모든 원소 x2: {arr * 2}")`,
    explain: {
      concept:
        'NumPy의 ndarray는 파이썬 리스트와 달리 모든 원소를 통째로 한 번에 계산하는 다차원 배열이에요. ' +
        'C 언어로 구현되어 있어서 리스트보다 수십 배 빠르고, 메모리도 훨씬 적게 써요. ' +
        'shape은 배열의 행렬 구조를, dtype은 내부 원소의 데이터 타입을 알려줘요. ' +
        '실무에서는 데이터 분석, 머신러닝, 과학 계산의 거의 모든 입력 데이터를 ndarray 형태로 다뤄요. ' +
        'arr * 2 같은 벡터 연산은 반복문 없이 전체 원소에 동시에 적용돼서 코드가 짧고 실행도 빨라요.',
      terms: [
        { t: 'np.array([1, 2, 3, 4, 5])', d: '파이썬 리스트를 NumPy의 1차원 배열(벡터)로 변환해요.' },
        { t: 'arr.shape', d: '각 차원의 크기를 튜플로 알려주는 속성이에요. 1차원이면 (5,)처럼 나와요.' },
        { t: 'arr.dtype', d: '배열 원소의 자료형(int32, float64 등)을 알려주는 속성이에요.' },
        { t: 'arr * 2', d: '모든 원소에 2를 곱하는 벡터 연산이에요. 반복문이 내부 C에서 실행돼 빠라요.' },
      ],
      why:
        '실무에서 수백만 건의 데이터를 파이썬 리스트로 계산하면 수 분 걸리지만, ndarray로 변환해서 처리하면 수 초 안에 끝나요.',
      expectedOutput:
        '실행 시:\n' +
        '[정보] 배열 모양: (5,)\n' +
        '[정보] 원소 타입: int32 (또는 int64)\n' +
        '[결과] 모든 원소 x2: [ 2  4  6  8 10]',
      realWorldUsage:
        '실제 데이터 분석 프로젝트에서 CSV 파일을 Pandas로 읽어들이면 내부적으로 NumPy ndarray로 저장돼서, 모든 집계 연산이 C 수준 속도로 실행돼요.',
      pitfall: 'dtype을 명시하지 않으면 입력 데이터를 보고 NumPy가 추론해요. 정수인 줄 알았는데 float로 추론될 수 있으니, dtype을 명시하는 습관이 좋아요.',
    },
  },
  {
    id: 'pdata-numpy-broadcast-scalar',
    lang: 'python',
    title: 'NumPy 브로드캐스트: 스칼라 더하기',
    file: 'numpy_broadcast.py',
    code: `import numpy as np

arr = np.array([[1, 2, 3], [4, 5, 6]])
print(f"[원본] 배열:\n{arr}")
result = arr + 10
print(f"[결과] 배열 + 10:\n{result}")`,
    explain: {
      concept:
        '브로드캐스트(Broadcast)는 모양이 다른 배열끼리도 자동으로 크기를 가상으로 맞춰서 연산할 수 있게 해주는 NumPy의 핵심 기능이에요. ' +
        '스칼라(하나의 숫자) 10을 2x3 배열에 더하면, NumPy가 "10이 2x3만큼 복사됐다고 가정"하고 각 칸에 더해줘요. ' +
        '이게 가능한 이유는 차원을 오른쪽부터 비교해서 크기가 1이면 상대방 크기로 자동 확장된다는 규칙 때문이에요. ' +
        '실무에서는 "전체 매출에 일괄 할증"처럼 같은 연산을 전체 데이터에 적용할 때 반복문 없이 한 줄로 처리해요.',
      terms: [
        { t: 'arr + 10', d: '2x3 배열의 모든 원소에 10을 더하는 브로드캐스트 연산이에요.' },
        { t: '브로드캐스트', d: '모양이 다른 배열을 자동으로 맞춰서 연산하는 NumPy의 규칙이에요.' },
        { t: '스칼라(10)', d: '차원이 없는 단일 숫자예요. 배열 연산 시 모든 칸으로 확장돼요.' },
      ],
      why:
        '실무에서 수백만 행의 데이터에 같은 가중치를 곱할 때, 브로드캐스트로 반복문 없이 한 번에 계산해서 수백 배 빠르게 처리해요.',
      expectedOutput:
        '실행 시:\n' +
        '[원본] 배열:\n' +
        '[[1 2 3]\n' +
        ' [4 5 6]]\n' +
        '[결과] 배열 + 10:\n' +
        '[[11 12 13]\n' +
        ' [14 15 16]]',
      realWorldUsage:
        '실제 이미지 처리에서 RGB 이미지(가로x세로x3)에 밝기 보정값을 모든 픽셀에 일괄 적용할 때 브로드캐스트로 한 줄에 처리해요.',
      pitfall: '두 배열의 차원을 오른쪽부터 비교했을 때, 크기가 1도 아니고 서로 다른 차원이 만나면 ValueError가 발생해요.',
    },
  },
  {
    id: 'pdata-numpy-broadcast-column',
    lang: 'python',
    title: 'NumPy 브로드캐스트: 열 벡터 더하기',
    file: 'numpy_broadcast_col.py',
    code: `import numpy as np

a = np.array([[1, 2, 3], [4, 5, 6]])
b = np.array([[10], [20]])
print(f"[원본] 배열 a (2x3):\n{a}")
print(f"[원본] 벡터 b (2x1):\n{b}")
print(f"[결과] a + b:\n{a + b}")`,
    explain: {
      concept:
        '2x3 행렬과 2x1 열 벡터를 더하면, NumPy는 열 벡터를 가로로 복사해서 2x3으로 자동 확장한 뒤 덧셈을 수행해요. ' +
        '첫 번째 행에는 10이, 두 번째 행에는 20이 모든 열에 더해져요. ' +
        '이게 브로드캐스트의 강력함이에요. 행마다 다른 가중치를 주거나, 열마다 다른 보정값을 적용할 때 반복문 없이 한 줄로 표현할 수 있어요. ' +
        '머신러닝에서 정규화나 배치 정규화를 구현할 때 이 원리가 핵심적으로 사용돼요.',
      terms: [
        { t: 'a (2x3)', d: '2행 3열짜리 2차원 배열이에요.' },
        { t: 'b (2x1)', d: '2행 1열짜리 열 벡터예요. 가로로 복사돼서 2x3으로 확장돼요.' },
        { t: 'a + b', d: 'b가 가로로 3열까지 복사된 뒤 각 칸에 더해져요.' },
        { t: '[[10], [20]]', d: '2x1 모양을 명시적으로 만드는 구문이에요. (2,) 벡터와 달라요.' },
      ],
      why:
        '실무에서 각 데이터 행에 다른 가중치를 적용하는 feature weighting을 구현할 때, 열 벡터를 브로드캐스트로 한 번에 곱하거나 더해요.',
      expectedOutput:
        '실행 시:\n' +
        '[원본] 배열 a (2x3):\n' +
        '[[1 2 3]\n' +
        ' [4 5 6]]\n' +
        '[원본] 벡터 b (2x1):\n' +
        '[[10]\n' +
        ' [20]]\n' +
        '[결과] a + b:\n' +
        '[[11 12 13]\n' +
        ' [24 25 26]]',
      realWorldUsage:
        '실제 추천 시스템에서 사용자별 평점 편향(bias)을 열 벡터로 정의하고, 모든 아이템에 브로드캐스트로 더해서 보정 전 평점을 계산해요.',
      pitfall: 'b를 [10, 20] (shape (2,))로 만들면, 2x3 배열의 끝 차원 3과 2가 맞지 않아 브로드캐스트 에러가 발생해요. 반드시 reshape(-1,1) 또는 [[10],[20]]로 2x1 모양을 만들어야 해요.',
    },
  },
  {
    id: 'pdata-numpy-reshape',
    lang: 'python',
    title: 'NumPy reshape으로 차원 바꾸기',
    file: 'numpy_reshape.py',
    code: `import numpy as np

flat = np.arange(12)
print(f"[원본] 1차원 (12,): {flat}")
grid = flat.reshape(3, 4)
print(f"[변환] 3x4:\n{grid}")
print(f"[전치] 4x3:\n{grid.T}")`,
    explain: {
      concept:
        'reshape은 배열의 총 원소 개수를 유지한 채로 행렬의 모양만 재구성하는 함수예요. ' +
        '데이터의 순서는 그대로고 담는 틀의 가로×세로만 바뀌는 거예요. ' +
        '머신러닝에서 1차원으로 평탄화된 이미지 데이터를 다시 2D로 풀어서 CNN에 넣거나, ' +
        '시계열 데이터를 (배치, 타임스텝, 특성) 형태로 재구성할 때 빈번하게 써요. ' +
        '.T는 행과 열을 뒤바꾸는 전치(transpose) 속성이에요.',
      terms: [
        { t: 'np.arange(12)', d: '0부터 11까지 12개의 숫자로 채운 1차원 배열을 생성해요.' },
        { t: '.reshape(3, 4)', d: '3행 4열의 2차원 배열로 모양을 재구성해요. 총 12개 원소는 변함없어요.' },
        { t: '.T', d: '행렬의 행과 열을 뒤바꾸는 전치(transpose) 속성이에요. 3x4 -> 4x3이 돼요.' },
        { t: '-1', d: 'reshape에서 -1을 쓰면 나머지 차원을 자동 계산해요. 예: reshape(-1, 4) === reshape(3, 4)' },
      ],
      why:
        '실무에서 딥러닝 입력 데이터는 (Batch, Channel, Height, Width) 같은 특정 차원 순서를 요구하는데, reshape으로 데이터 모양을 모델에 맞춰줘요.',
      expectedOutput:
        '실행 시:\n' +
        '[원본] 1차원 (12,): [ 0  1  2  3  4  5  6  7  8  9 10 11]\n' +
        '[변환] 3x4:\n' +
        '[[ 0  1  2  3]\n' +
        ' [ 4  5  6  7]\n' +
        ' [ 8  9 10 11]]\n' +
        '[전치] 4x3:\n' +
        '[[ 0  4  8]\n' +
        ' [ 1  5  9]\n' +
        ' [ 2  6 10]\n' +
        ' [ 3  7 11]]',
      realWorldUsage:
        '실제 이미지 분류 프로젝트에서 28x28 픽셀 이미지를 1x784 벡터로 펼쳐서 완전연결층(Fully Connected)에 입력할 때 reshape을 써요.',
      pitfall: '원소 총 개수가 딱 맞지 않으면 에러가 발생해요. 예를 들어 reshape(5, 5)은 12개 원소로 25칸을 채울 수 없어서 불가능해요.',
    },
  },
  {
    id: 'pdata-numpy-aggregate-axis',
    lang: 'python',
    title: 'NumPy 축(axis) 기준 집계',
    file: 'numpy_axis.py',
    code: `import numpy as np

arr = np.array([[1, 2, 3], [4, 5, 6]])
print(f"[원본] 2x3 배열:\n{arr}")
print(f"[axis=0] 열별 합계 (세로): {arr.sum(axis=0)}")
print(f"[axis=1] 행별 합계 (가로): {arr.sum(axis=1)}")`,
    explain: {
      concept:
        'axis는 다차원 배열에서 "어느 방향으로 집계할지" 정하는 축 번호예요. ' +
        'axis=0은 첫 번째 축(행 방향)을 없애는 방향, 즉 세로로 합쳐서 열별 결과를 내요. ' +
        'axis=1은 두 번째 축(열 방향)을 없애는 방향, 즉 가로로 합쳐서 행별 결과를 내요. ' +
        '기억법은 "axis=N은 N번째 차원이 사라지는 방향"이에요. ' +
        '실무에서는 날씨 데이터에서 도시별(axis=1) 평균 기온이나, 월별(axis=0) 총 강수량을 구할 때 써요.',
      terms: [
        { t: 'axis=0', d: '행(첫 번째 축) 방향으로 합쳐서 열 단위 결과를 얻어요. 결과 shape은 (3,)이 돼요.' },
        { t: 'axis=1', d: '열(두 번째 축) 방향으로 합쳐서 행 단위 결과를 얻어요. 결과 shape은 (2,)이 돼요.' },
        { t: '.sum()', d: '지정한 축을 따라 원소들의 합계를 구하는 집계 함수예요.' },
        { t: 'arr.sum(axis=0)', d: '[1+4, 2+5, 3+6] = [5, 7, 9]로 열별 합계예요.' },
      ],
      why:
        '실무에서 판매 데이터프레임에서 "월별 총매출(axis=1)" 또는 "상품별 총판매량(axis=0)"을 한 줄로 구할 때 써요.',
      expectedOutput:
        '실행 시:\n' +
        '[원본] 2x3 배열:\n' +
        '[[1 2 3]\n' +
        ' [4 5 6]]\n' +
        '[axis=0] 열별 합계 (세로): [5 7 9]\n' +
        '[axis=1] 행별 합계 (가로): [ 6 15]',
      realWorldUsage:
        '실제 대시보드 구축 시 판매 데이터에서 월별·지역별·품목별 KPI를 axis를 바꿔가며 집계해서 차트 데이터를 만들어요.',
      pitfall: 'axis 번호는 0부터 시작해요. 2D 배열에서는 axis=0(세로), axis=1(가로)만 가능하고, axis=2는 차원이 없어서 에러가 나요.',
    },
  },
  {
    id: 'pdata-numpy-boolean-index',
    lang: 'python',
    title: 'NumPy 불리언 인덱싱(조건 필터)',
    file: 'numpy_bool.py',
    code: `import numpy as np

arr = np.array([10, 25, 30, 45])
mask = arr > 20
print(f"[원본] 배열: {arr}")
print(f"[마스크] arr > 20: {mask}")
print(f"[결과] 조건 필터링: {arr[mask]}")`,
    explain: {
      concept:
        '불리언 인덱싱은 True/False를 담은 마스크 배열로 원하는 원소만 골라내는 필터링 기능이에요. ' +
        'arr > 20을 실행하면 [False, True, True, True] 같은 불리언 배열이 생성되고, ' +
        '이를 arr[...] 안에 넣으면 True 위치의 원소만 추출돼요. ' +
        '실무에서는 "매출이 100만 원 이상인 주문만", "온도가 30도를 넘는 날만" 같은 조건부 추출을 반복문 없이 한 줄로 처리해요. ' +
        '여러 조건을 &(AND)나 |(OR)로 결합해서 복합 필터도 만들 수 있어요.',
      terms: [
        { t: 'arr > 20', d: '각 원소가 20보다 큰지 비교한 True/False 배열을 반환해요.' },
        { t: 'mask', d: 'True/False로 이루어진 불리언 배열이에요. 필터로 써요.' },
        { t: 'arr[mask]', d: 'mask가 True인 위치의 원소만 골라서 새 배열로 반환해요.' },
        { t: '&, |', d: '여러 조건을 결합할 때 쓰는 논리 연산자예요. 예: (arr > 20) & (arr < 40)' },
      ],
      why:
        '실무에서 수백만 건의 데이터에서 이상치(outlier)만 추출하거나, 특정 조건을 만족하는 데이터만 골라서 통계를 낼 때 써요.',
      expectedOutput:
        '실행 시:\n' +
        '[원본] 배열: [10 25 30 45]\n' +
        '[마스크] arr > 20: [False  True  True  True]\n' +
        '[결과] 조건 필터링: [25 30 45]',
      realWorldUsage:
        '실제 이상 탐지 시스템에서 "정상 범위를 벗어난 센서 값만" 불리언 인덱싱으로 추출해서 알림을 발생시켜요.',
      pitfall: 'mask 길이가 arr 길이와 다르면 IndexError가 발생해요. 조건식은 항상 같은 길이의 배열을 반환해야 해요.',
    },
  },
  {
    id: 'pdata-numpy-random-seed',
    lang: 'python',
    title: 'NumPy 난수 시드 고정',
    file: 'numpy_seed.py',
    code: `import numpy as np

rng = np.random.default_rng(42)
a = rng.random(3)
b = rng.random(3)
print(f"[결과] 난수 생성: a={a}")
print(f"[결과] 난수 생성: b={b}")
print(f"[정보] 시드: 42 (재현 가능)")`,
    explain: {
      concept:
        'seed는 난수 발생기의 시작 상태를 결정하는 값이에요. 같은 시드를 사용하면 매번 똑같은 순서로 난수가 생성돼요. ' +
        '이걸 재현 가능성(reproducibility)이라고 해요. 과학 실험이나 머신러닝에서 "누가 실행해도 같은 결과가 나와야" 할 때 필수예요. ' +
        'default_rng(42)는 NumPy 1.17 이후 권장되는 새로운 방식이에요. ' +
        '예전의 np.random.seed(42) 방식은 전역 상태를 바꿔서 다른 코드에도 영향을 줬는데, default_rng는 독립적인 Generator 객체를 반환해서 부작용이 없어요.',
      terms: [
        { t: 'np.random.default_rng(42)', d: '시드 42로 고정된 난수 발생기(Generator) 객체를 생성해요.' },
        { t: 'rng.random(3)', d: '0에서 1 사이의 균일 분포 난수를 3개 생성해요. 실행할 때마다 같은 값이 나와요.' },
        { t: 'seed(42)', d: '42라는 숫자가 초기 상태를 결정해요. 같은 숫자면 같은 난수 시퀀스가 생성돼요.' },
        { t: '재현 가능성', d: '코드를 다시 실행해도 동일한 결과가 나오는 성질이에요. 논문·실험에 필수예요.' },
      ],
      why:
        '실무에서 머신러닝 모델의 train_test_split이나 가중치 초기화에 시드를 고정하지 않으면, 실행할 때마다 다른 결과가 나와서 디버깅과 성능 비교가 불가능해요.',
      expectedOutput:
        '실행 시:\n' +
        '[결과] 난수 생성: a=[0.37454012 0.95071431 0.73199394]\n' +
        '[결과] 난수 생성: b=[0.59865848 0.15601864 0.15599452]\n' +
        '[정보] 시드: 42 (재현 가능)',
      realWorldUsage:
        '실제 머신러닝 대회(Kaggle)에서 "이 노트북을 다시 실행하면 같은 결과가 나온다"고 보장하려면, 맨 위에서 default_rng(42)로 시드를 고정해요.',
      pitfall: '예전 방식인 np.random.seed(42)는 전역 난수 상태를 변경해요. 라이브러리 코드와 충돌할 수 있으니, 독립적인 default_rng를 쓰는 게 안전해요.',
    },
  },
  {
    id: 'pdata-pandas-create-df',
    lang: 'python',
    title: 'Pandas DataFrame 만들기',
    file: 'pandas_create.py',
    code: `import pandas as pd

df = pd.DataFrame({
  'name': ['kim', 'lee', 'park'],
  'age': [25, 30, 35],
})
print(f"[정보] DataFrame 생성 완료")
print(f"[미리보기]\n{df.head()}")`,
    explain: {
      concept:
        'DataFrame은 엑셀 시트처럼 행과 열로 구성된 2차원 데이터 구조예요. 각 열에는 이름(컬럼명)이 붙고, 열마다 다른 타입의 데이터를 담을 수 있어요. ' +
        '딕셔너리로 생성할 때는 키가 열 이름, 값이 열 데이터가 돼요. ' +
        '실무에서는 CSV, 데이터베이스, API 응답에서 불러온 모든 정형 데이터를 DataFrame으로 다뤄요. ' +
        'Pandas는 DataFrame을 통해 필터링, 집계, 병합, 시각화까지 데이터 분석의 전 과정을 지원해요.',
      terms: [
        { t: 'pd.DataFrame({...})', d: '딕셔너리로부터 DataFrame을 생성하는 생성자예요.' },
        { t: "'name': [...], 'age': [...]", d: '딕셔너리 키가 열 이름이 되고, 값 리스트가 해당 열의 데이터가 돼요.' },
        { t: 'df.head()', d: 'DataFrame의 처음 5행을 미리보기로 출력하는 메서드예요.' },
        { t: 'pd', d: 'pandas 라이브러리의 관례적 별칭(alias)이에요. import pandas as pd로 써요.' },
      ],
      why:
        '실무에서 모든 데이터 분석 작업은 "데이터를 DataFrame으로 읽어들이는 것"으로 시작해요. CSV, Excel, SQL, JSON 어떤 소스든 DataFrame으로 변환해서 다뤄요.',
      expectedOutput:
        '실행 시:\n' +
        '[정보] DataFrame 생성 완료\n' +
        '[미리보기]\n' +
        '  name  age\n' +
        '0   kim   25\n' +
        '1   lee   30\n' +
        '2  park   35',
      realWorldUsage:
        '실제 프로젝트에서 pd.read_csv("sales.csv")로 수백만 건의 판매 데이터를 DataFrame으로 읽어들인 후, 모든 분석과 시각화를 DataFrame 위에서 수행해요.',
      pitfall: '모든 열의 길이가 같아야 해요. 하나라도 길이가 다르면 ValueError가 발생해요.',
    },
  },
  {
    id: 'pdata-pandas-select-col',
    lang: 'python',
    title: 'Pandas 열 선택과 행 필터',
    file: 'pandas_select.py',
    code: `import pandas as pd

df = pd.DataFrame({'name': ['kim', 'lee'], 'age': [25, 30]})
print(f"[원본] DataFrame:\n{df}")
ages = df['age']
print(f"[열선택] age 열: {ages.tolist()}")
old = df[df['age'] > 26]
print(f"[필터] age > 26:\n{old}")`,
    explain: {
      concept:
        'df["age"]는 특정 열 하나를 Series(1차원 데이터) 형태로 추출하는 기본 인덱싱이에요. ' +
        'df[df["age"] > 26]은 조건을 만족하는 행만 골라내는 불리언 필터링이에요. ' +
        'NumPy의 불리언 인덱싱과 같은 원리로, 조건식이 True인 행의 모든 열 데이터가 추출돼요. ' +
        '실무에서는 "VIP 고객만 필터링"이나 "특정 날짜 이후의 데이터만 추출" 같은 작업을 이 패턴으로 처리해요. ' +
        '대괄호 안에 조건을 넣는 이 문법은 Pandas에서 가장 많이 쓰는 패턴 중 하나예요.',
      terms: [
        { t: "df['age']", d: 'age 열을 Series 형태로 추출해요. 결과는 1차원 데이터예요.' },
        { t: "df['age'] > 26", d: '각 행의 age 값이 26보다 큰지 비교한 True/False Series를 반환해요.' },
        { t: 'df[df["age"] > 26]', d: 'True인 행만 골라 새 DataFrame으로 반환하는 불리언 필터링이에요.' },
      ],
      why:
        '실무에서 "특정 지역의 주문만" 또는 "일정 금액 이상의 거래만" 추출할 때 이 패턴으로 한 줄에 조건 필터링을 해요.',
      expectedOutput:
        '실행 시:\n' +
        '[원본] DataFrame:\n' +
        '  name  age\n' +
        '0  kim   25\n' +
        '1  lee   30\n' +
        '[열선택] age 열: [25, 30]\n' +
        '[필터] age > 26:\n' +
        '  name  age\n' +
        '1  lee   30',
      realWorldUsage:
        '실제 사용자 분석에서 "등록일이 2024년 이후인 활성 사용자만" 추출해서 리텐션 분석을 할 때 이 패턴을 써요.',
      pitfall: "열 이름에 공백이 있으면 df['column name']처럼 대괄호로 접근해야 해요. df.column name은 문법 오류예요.",
    },
  },
  {
    id: 'pdata-pandas-loc-iloc',
    lang: 'python',
    title: 'Pandas loc vs iloc',
    file: 'pandas_loc.py',
    code: `import pandas as pd

df = pd.DataFrame({'age': [25, 30, 35]}, index=['kim', 'lee', 'park'])
print(f"[원본] DataFrame:\n{df}")
print(f"[loc] 이름 'lee' 조회:\n{df.loc['lee']}")
print(f"[iloc] 1번 인덱스 조회:\n{df.iloc[1]}")`,
    explain: {
      concept:
        'loc과 iloc은 DataFrame에서 특정 행을 선택하는 두 가지 방식이에요. ' +
        'loc은 라벨(이름)로 찾고, iloc은 정수 위치(순서)로 찾아요. ' +
        '사물함을 "A-3호" 같은 이름표로 찾는 게 loc, "왼쪽에서 3번째"로 찾는 게 iloc이에요. ' +
        '실무에서는 인덱스가 날짜나 사용자 ID 같은 의미 있는 값일 때 loc을 쓰고, 순수한 위치 기반 접근이 필요할 때 iloc을 써요. ' +
        '슬라이싱할 때 중요한 차이가 있는데, loc은 끝 라벨을 포함하고, iloc은 끝 번호를 포함하지 않아요.',
      terms: [
        { t: "df.loc['lee']", d: '인덱스 라벨이 "lee"인 행의 데이터를 Series로 반환해요.' },
        { t: 'df.iloc[1]', d: '0부터 시작하는 정수 위치상 두 번째(1번) 행의 데이터를 반환해요.' },
        { t: "index=['kim','lee','park']", d: '기본 0,1,2 대신 문자열 인덱스를 수동으로 지정해요.' },
        { t: 'loc[시작:끝]', d: 'loc 슬라이싱은 끝 라벨을 포함해요. iloc[0:2]는 2번 미포함이에요.' },
      ],
      why:
        '실무에서 시계열 데이터를 다룰 때 df.loc["2024-01":"2024-03"]처럼 날짜 인덱스로 범위 조회할 때 loc이 필수예요.',
      expectedOutput:
        '실행 시:\n' +
        '[원본] DataFrame:\n' +
        '      age\n' +
        'kim    25\n' +
        'lee    30\n' +
        'park   35\n' +
        '[loc] 이름 \'lee\' 조회:\n' +
        'age    30\n' +
        'Name: lee, dtype: int64\n' +
        '[iloc] 1번 인덱스 조회:\n' +
        'age    30\n' +
        'Name: lee, dtype: int64',
      realWorldUsage:
        '실제 주식 분석 시스템에서 df.loc["2024-01-15":"2024-02-15"]로 특정 기간의 주가 데이터를 조회해요. 날짜 라벨 덕분에 직관적으로 원하는 범위를 선택할 수 있어요.',
      pitfall: 'loc 슬라이싱은 끝 라벨을 "포함"하고, iloc 슬라이싱은 끝 번호를 "포함하지 않아요". 파이썬 기본 슬라이싱과 iloc은 같지만 loc은 달라요.',
    },
  },
  {
    id: 'pdata-pandas-groupby',
    lang: 'python',
    title: 'Pandas groupby 집계',
    file: 'pandas_groupby.py',
    code: `import pandas as pd

df = pd.DataFrame({
  'team': ['A', 'A', 'B', 'B'],
  'score': [10, 20, 15, 25],
})
print(f"[원본] 데이터:\n{df}")
result = df.groupby('team').sum()
print(f"[집계] 팀별 합계:\n{result}")`,
    explain: {
      concept:
        'groupby는 데이터를 특정 열을 기준으로 그룹으로 나눈 뒤, 각 그룹별로 통계를 집계하는 함수예요. ' +
        '"팀별 평균 점수", "지역별 총 매출", "월별 주문 건수"를 구할 때 이 한 줄이면 충분해요. ' +
        '내부적으로는 분할(split) -> 적용(apply) -> 결합(combine)의 3단계로 동작해요. ' +
        '실무에서는 모든 "~별" 통계 분석에 groupby가 들어간다고 봐도 과언이 아니에요. SQL의 GROUP BY에 해당해요.',
      terms: [
        { t: "df.groupby('team')", d: 'team 열의 값이 같은 행끼리 그룹으로 묶어요.' },
        { t: '.sum()', d: '각 그룹의 숫자 열을 모두 더해요. mean(), count(), max() 등 다양해요.' },
        { t: 'team', d: '그룹을 나누는 기준 열이에요. groupby의 결과에서 인덱스가 돼요.' },
        { t: 'split-apply-combine', d: 'groupby의 내부 동작 방식: 나누고 -> 적용하고 -> 합치는 3단계예요.' },
      ],
      why:
        '실무에서 주간 판매 리포트를 만들 때 "지역별·상품별 매출 합계"를 groupby로 구하고, 시각화 라이브러리로 차트를 그리는 게 전형적인 분석 워크플로우예요.',
      expectedOutput:
        '실행 시:\n' +
        '[원본] 데이터:\n' +
        '  team  score\n' +
        '0    A     10\n' +
        '1    A     20\n' +
        '2    B     15\n' +
        '3    B     25\n' +
        '[집계] 팀별 합계:\n' +
        '      score\n' +
        'team\n' +
        'A        30\n' +
        'B        40',
      realWorldUsage:
        '실제 대시보드에서 "월별·부서별 예산 집행률"을 구할 때, 날짜와 부서 두 컬럼으로 groupby를 한 뒤 sum()과 mean()으로 실적을 집계해요.',
      pitfall: 'groupby()만 호출하면 GroupBy 객체만 반환되고 실제 연산은 안 이뤄져요. .sum()이나 .mean() 등 집계 함수를 꼭 붙여야 해요.',
    },
  },
  {
    id: 'pdata-pandas-multi-agg',
    lang: 'python',
    title: 'Pandas 여러 집계 한 번에',
    file: 'pandas_agg.py',
    code: `import pandas as pd

df = pd.DataFrame({
  'team': ['A', 'A', 'B', 'B'],
  'score': [10, 20, 15, 25],
})
print(f"[원본] 데이터:\n{df}")
result = df.groupby('team').agg(['sum', 'mean', 'count'])
print(f"[집계] 팀별 통계:\n{result}")`,
    explain: {
      concept:
        'agg()는 여러 집계 함수를 한 번에 적용해서 다양한 통계를 동시에 얻을 수 있게 해줘요. ' +
        '리스트로 ["sum", "mean", "count"]를 넘기면, 각 열에 모든 함수가 적용돼서 멀티레벨 컬럼이 만들어져요. ' +
        '실무에서는 "평균, 최대, 최소, 표준편차, 합계"를 한 번에 보고자 할 때 agg()를 써서 groupby를 여러 번 호출하지 않아도 돼요. ' +
        'groupby 없이 DataFrame 자체에 agg()를 호출하면 전체 데이터의 통계를 한 번에 구할 수도 있어요.',
      terms: [
        { t: '.agg(["sum", "mean", "count"])', d: '지정한 여러 집계 함수를 모든 숫자 열에 동시에 적용해요.' },
        { t: "groupby('team')", d: 'team 열로 그룹을 나눈 뒤 각 그룹에 agg를 적용해요.' },
        { t: '멀티레벨 컬럼', d: '여러 집계 결과가 컬럼 계층 구조로 표현돼요. 상위=통계명, 하위=원래컬럼명.' },
      ],
      why:
        '실무에서 데이터 품질 리포트를 만들 때 df.agg(["count", "nunique", "min", "max", "mean", "std"]) 한 줄로 모든 열의 기초 통계를 한눈에 확인해요.',
      expectedOutput:
        '실행 시:\n' +
        '[원본] 데이터:\n' +
        '  team  score\n' +
        '0    A     10\n' +
        '1    A     20\n' +
        '2    B     15\n' +
        '3    B     25\n' +
        '[집계] 팀별 통계:\n' +
        '     score\n' +
        '       sum mean count\n' +
        'team\n' +
        'A       30  15.0     2\n' +
        'B       40  20.0     2',
      realWorldUsage:
        '실제 마케팅 분석에서 "채널별 CTR, 전환율, 평균 구매액"을 groupby+agg로 한 번에 집계해서 대시보드에 올려요.',
      pitfall: '리스트로 함수 이름을 주면 컬럼이 멀티레벨(다단) 인덱스가 돼서, 나중에 인덱싱이 복잡해져요. 필요하면 flatten해서 평탄화해야 해요.',
    },
  },
  {
    id: 'pdata-pandas-merge-inner',
    lang: 'python',
    title: 'Pandas merge: 공통 열 기준 조인',
    file: 'pandas_merge.py',
    code: `import pandas as pd

left = pd.DataFrame({'id': [1, 2], 'name': ['kim', 'lee']})
right = pd.DataFrame({'id': [1, 2], 'score': [90, 80]})
print(f"[원본] 왼쪽:\n{left}")
print(f"[원본] 오른쪽:\n{right}")
merged = pd.merge(left, right, on='id')
print(f"[병합] on='id':\n{merged}")`,
    explain: {
      concept:
        'merge는 SQL의 JOIN처럼 두 개의 DataFrame을 공통 열을 기준으로 가로로 합치는 함수예요. ' +
        'on="id"라고 지정하면 id 열이 같은 행끼리 연결돼서 하나의 넓은 표가 만들어져요. ' +
        '기본값은 inner join이라 양쪽 모두에 존재하는 키만 결과에 남고, 한쪽에만 있는 행은 제외돼요. ' +
        '실무에서는 "고객 마스터 + 주문 내역", "상품 정보 + 재고 현황"처럼 여러 출처에서 가져온 데이터를 하나로 통합할 때 merge가 필수예요.',
      terms: [
        { t: 'pd.merge(left, right, on=\'id\')', d: 'id 열을 기준으로 두 DataFrame을 가로로 병합해요.' },
        { t: "on='id'", d: '어떤 열을 기준으로 조인할지 지정하는 파라미터예요. SQL의 ON 절과 같아요.' },
        { t: 'inner join (기본값)', d: '양쪽 모두에 기준 키가 존재하는 행만 결과에 포함하는 조인 방식이에요.' },
        { t: "how='left'", d: '왼쪽 DataFrame의 모든 행을 유지하는 left outer join 방식이에요.' },
      ],
      why:
        '실무에서 "사용자 정보(마스터) + 구매 이력(트랜잭션)"을 merge로 합쳐서 사용자별 LTV(생애 가치)를 계산해요.',
      expectedOutput:
        '실행 시:\n' +
        '[원본] 왼쪽:\n' +
        '   id  name\n' +
        '0   1   kim\n' +
        '1   2   lee\n' +
        '[원본] 오른쪽:\n' +
        '   id  score\n' +
        '0   1     90\n' +
        '1   2     80\n' +
        '[병합] on=\'id\':\n' +
        '   id  name  score\n' +
        '0   1   kim     90\n' +
        '1   2   lee     80',
      realWorldUsage:
        '실제 CRM 시스템에서 "고객 프로필(id, name, 등급)"과 "구매 이력(id, 금액, 일시)"를 merge로 결합해서 VIP 고객의 구매 패턴을 분석해요.',
      pitfall: '기본 how="inner"이므로 기준 열 값이 한쪽에만 있으면 결과에서 사라져요. 모든 데이터를 유지하려면 how="outer"를 써야 해요.',
    },
  },
  {
    id: 'pdata-pandas-pivot',
    lang: 'python',
    title: 'Pandas pivot_table로 재구성',
    file: 'pandas_pivot.py',
    code: `import pandas as pd

df = pd.DataFrame({
  'team': ['A', 'A', 'B', 'B'],
  'round': [1, 2, 1, 2],
  'score': [10, 20, 15, 25],
})
print(f"[원본] 긴 형태:\n{df}")
pt = pd.pivot_table(df, index='team', columns='round', values='score')
print(f"[피벗] 교차표:\n{pt}")`,
    explain: {
      concept:
        'pivot_table은 세로로 길게 쌓인 데이터를 가로×세로 교차표(크로스탭) 형태로 재구성하는 함수예요. ' +
        'index로 행 기준을, columns로 열 기준을, values로 칸에 채울 값을 지정해요. ' +
        '실무에서는 "지역×월별 매출", "부서×직급별 평균 연봉"처럼 두 범주를 축으로 하는 교차 분석을 할 때 써요. ' +
        '같은 칸에 여러 값이 있으면 기본적으로 평균(mean)을 계산해 채워요. sum, count 등으로 변경할 수 있어요.',
      terms: [
        { t: 'pd.pivot_table(df, index=, columns=, values=)', d: '긴 데이터를 2차원 교차표로 변환하는 함수예요.' },
        { t: "index='team'", d: '교차표의 행(가로줄)에 배치할 열을 지정해요.' },
        { t: "columns='round'", d: '교차표의 열(세로줄)에 배치할 열을 지정해요.' },
        { t: "values='score'", d: '각 교차 칸에 채울 값을 가진 열을 지정해요.' },
      ],
      why:
        '실무에서 "월별 카테고리별 매출" 보고서를 만들 때, 거래 데이터를 pivot_table로 변환해서 엑셀과 유사한 형태로 경영진에 보여줘요.',
      expectedOutput:
        '실행 시:\n' +
        '[원본] 긴 형태:\n' +
        '  team  round  score\n' +
        '0    A      1     10\n' +
        '1    A      2     20\n' +
        '2    B      1     15\n' +
        '3    B      2     25\n' +
        '[피벗] 교차표:\n' +
        'round   1   2\n' +
        'team\n' +
        'A       10  20\n' +
        'B       15  25',
      realWorldUsage:
        '실제 영업 보고서에서 "영업사원×분기별 계약 건수"를 pivot_table로 피벗해 히트맵 시각화와 함께 성과 분석에 활용해요.',
      pitfall: '같은 칸에 여러 값이 있으면 기본적으로 mean()이 적용돼서, 개별 값을 놓칠 수 있어요. aggfunc="sum"으로 명시적으로 지정하는 게 안전해요.',
    },
  },
  {
    id: 'pdata-pandas-fillna',
    lang: 'python',
    title: 'Pandas 결측치 채우기(fillna)',
    file: 'pandas_fillna.py',
    code: `import pandas as pd
import numpy as np

df = pd.DataFrame({'age': [25, np.nan, 35]})
print(f"[원본] 결측치 포함:\n{df}")
filled = df.fillna(df['age'].mean())
print(f"[채움] 평균으로 대체:\n{filled}")`,
    explain: {
      concept:
        'fillna는 DataFrame에 있는 NaN(Not a Number, 결측치)을 지정한 값으로 채워주는 메서드예요. ' +
        '현실 데이터는 항상 빈칸이 섞여 있어서, 그대로 분석하면 오류가 나거나 결과가 왜곡돼요. ' +
        '여기서는 결측치를 해당 열의 평균값으로 채우는 가장 기본적인 결측치 처리 전략을 보여줘요. ' +
        '실무에서는 평균, 중앙값, 0, 앞 값으로 채우기(forward fill) 등 상황에 맞는 전략을 선택해서 써요.',
      terms: [
        { t: 'np.nan', d: 'Not a Number, 즉 "값이 없음"을 표현하는 NumPy의 결측치 상수예요.' },
        { t: 'df.fillna(...)', d: 'DataFrame의 모든 결측치를 지정한 값으로 채우는 메서드예요.' },
        { t: "df['age'].mean()", d: 'age 열의 평균값을 계산해서 결측치 대체값으로 활용해요.' },
        { t: 'inplace=True', d: '원본 DataFrame을 직접 수정하는 옵션이에요. 기본은 False(새 객체 반환).' },
      ],
      why:
        '실무에서 머신러닝 모델 학습 전에 결측치를 그대로 두면 모델이 에러를 내거나 무시해버려서, fillna로 적절한 값으로 채우는 전처리가 필수예요.',
      expectedOutput:
        '실행 시:\n' +
        '[원본] 결측치 포함:\n' +
        '    age\n' +
        '0  25.0\n' +
        '1   NaN\n' +
        '2  35.0\n' +
        '[채움] 평균으로 대체:\n' +
        '    age\n' +
        '0  25.0\n' +
        '1  30.0\n' +
        '2  35.0',
      realWorldUsage:
        '실제 고객 데이터 분석에서 나이 정보가 누락된 고객의 결측치를 "가입한 연도별 평균 나이"로 채워서, 결측 때문에 해당 고객이 분석에서 제외되는 것을 막아요.',
      pitfall: 'fillna는 기본적으로 원본을 변경하지 않고 새 DataFrame을 반환해요. 결과를 변수에 다시 담거나 inplace=True를 써야 반영돼요.',
    },
  },
  {
    id: 'pdata-matplotlib-line',
    lang: 'python',
    title: 'Matplotlib 선 그래프 그리기',
    file: 'mpl_line.py',
    code: `import matplotlib.pyplot as plt

x = [1, 2, 3, 4]
y = [2, 4, 1, 5]
print(f"[데이터] x={x}, y={y}")
plt.plot(x, y, marker='o')
plt.title('Trend')
plt.show()`,
    explain: {
      concept:
        'Matplotlib는 파이썬에서 가장 기본이 되는 시각화 라이브러리예요. ' +
        'plot()은 x좌표와 y좌표를 점으로 찍고 선으로 이어서 추세를 보여주는 선 그래프를 그려요. ' +
        'marker="o"를 주면 각 데이터 포인트에 동그라미 표시가 붙어서 가독성이 좋아져요. ' +
        '실무에서는 시계열 데이터의 추세나, 실험 결과의 변화를 시각적으로 보여줄 때 가장 먼저 사용하는 그래프예요. ' +
        'plt.show()를 호출해야 실제로 그래프 창이 화면에 표시돼요.',
      terms: [
        { t: 'plt.plot(x, y, marker=\'o\')', d: 'x-y 좌표로 선 그래프를 그리고 각 점에 동그라미 표시를 해줘요.' },
        { t: 'plt.title(\'Trend\')', d: '그래프 상단에 제목을 추가하는 메서드예요.' },
        { t: 'plt.show()', d: '그려진 그래프를 화면에 띄우는 함수예요. 호출하지 않으면 그래프가 안 보여요.' },
        { t: 'marker', d: '데이터 포인트의 표시 모양을 정하는 옵션이에요. o, s(사각형), ^(삼각형) 등이 있어요.' },
      ],
      why:
        '실무에서 분석 결과를 공유할 때, 숫자만 나열하는 것보다 그래프 한 장이 이해를 훨씬 빠르게 도와줘요. Matplotlib는 논문, 리포트, 대시보드 어디서나 써요.',
      expectedOutput:
        '실행 시:\n' +
        '[데이터] x=[1, 2, 3, 4], y=[2, 4, 1, 5]\n' +
        '( "Trend" 제목의 선 그래프 창이 열리고 점들이 선으로 연결되어 표시됨 )',
      realWorldUsage:
        '실제 주간 리포트에서 "일별 활성 사용자 수(DAU)"를 plot으로 그려서 경영진에게 추세를 직관적으로 전달해요.',
      pitfall: 'plt.show()를 호출하지 않으면 그래프가 화면에 나타나지 않아요. 스크립트 모드에서는 반드시 호출해야 해요.',
    },
  },
  {
    id: 'pdata-matplotlib-subplots',
    lang: 'python',
    title: 'Matplotlib 여러 그래프(subplots)',
    file: 'mpl_subplots.py',
    code: `import matplotlib.pyplot as plt

fig, axes = plt.subplots(1, 2)
print(f"[실행] subplots(1,2) - 1행 2열 레이아웃")
axes[0].plot([1, 2, 3], [1, 4, 9])
axes[1].bar(['a', 'b', 'c'], [3, 5, 2])
plt.show()`,
    explain: {
      concept:
        'subplots는 하나의 그림판(figure)을 여러 개의 작은 그래프 구역(axes)으로 나눠서, 한 화면에 여러 그래프를 나란히 배치할 수 있게 해줘요. ' +
        'subplots(1, 2)는 1행 2열 레이아웃으로 좌우에 그래프 두 개를 배치한다는 뜻이에요. ' +
        'axes[0]은 왼쪽, axes[1]은 오른쪽 구역이에요. 각 구역에 서로 다른 그래프(선, 막대)를 독립적으로 그릴 수 있어요. ' +
        '실무에서는 "매출 추이와 구성비"처럼 서로 다른 유형의 그래프를 나란히 보여줘야 할 때 써요.',
      terms: [
        { t: 'fig, axes = plt.subplots(1, 2)', d: '1행 2열 레이아웃을 만들고, fig(전체판)과 axes(각 구역 배열)를 반환해요.' },
        { t: 'axes[0].plot(...)', d: '첫 번째(왼쪽) 구역에 선 그래프를 그려요.' },
        { t: 'axes[1].bar(...)', d: '두 번째(오른쪽) 구역에 막대 그래프를 그려요.' },
        { t: 'bar([\'a\',\'b\',\'c\'], [3,5,2])', d: '각 범주(\'a\',\'b\',\'c\')에 해당하는 높이로 막대 그래프를 그려요.' },
      ],
      why:
        '실무에서 A/B 테스트 리포트를 만들 때 "대조군 vs 실험군"의 전환율 추이를 좌우에 나란히 배치해서 직관적으로 비교해요.',
      expectedOutput:
        '실행 시:\n' +
        '[실행] subplots(1,2) - 1행 2열 레이아웃\n' +
        '( 좌우 두 개의 그래프가 한 창에 표시됨: 왼쪽=선 그래프, 오른쪽=막대 그래프 )',
      realWorldUsage:
        '실제 마케팅 대시보드에서 "채널별 광고비(막대)"와 "전환율 추이(선)"를 subplots로 한 화면에 배치해서, 투자 대비 성과를 한눈에 파악할 수 있게 해요.',
      pitfall: 'subplots가 1행이면 axes는 1차원 배열, 2행 이상이면 2차원 배열로 반환돼요. 인덱싱 방식이 달라지니 shape을 확인해야 해요.',
    },
  },
  {
    id: 'pdata-polars-lazy',
    lang: 'python',
    title: 'Polars 지연(lazy) 실행',
    file: 'polars_lazy.py',
    code: `import polars as pl

df = pl.DataFrame({'age': [25, 30, 35], 'name': ['kim', 'lee', 'park']})
print(f"[원본] 데이터:\n{df}")
result = (
  df.lazy()
  .filter(pl.col('age') > 26)
  .select(['name', 'age'])
  .collect()
)
print(f"[결과] 필터 후 수집:\n{result}")`,
    explain: {
      concept:
        'Polars의 lazy() 모드는 연산을 즉시 실행하지 않고 실행 계획(쿼리 플랜)을 먼저 수립한 뒤, collect()로 한 번에 실행하는 방식이에요. ' +
        '실행 전에 여러 연산을 하나로 합치는 최적화를 자동으로 수행해서, 메모리 사용량과 실행 시간을 대폭 줄여줘요. ' +
        'Pandas와 달리 Rust로 구현돼서 기본 성능도 훨씬 빠르고, lazy 모드를 쓰면 추가 최적화까지 더해져서 대용량 데이터에 특히 강력해요. ' +
        'collect()를 호출하기 전까지는 아무 연산도 실행되지 않고 계획만 쌓여요.',
      terms: [
        { t: 'df.lazy()', d: '즉시 실행 모드(eager)에서 지연 실행 모드(lazy)로 전환해요.' },
        { t: 'pl.col(\'age\') > 26', d: 'age 열이 26보다 큰 행만 통과시키는 필터 표현식이에요.' },
        { t: '.filter(...)', d: '조건을 만족하는 행만 남기는 연산 단계예요.' },
        { t: '.collect()', d: '세워둔 실행 계획을 실제로 실행해서 DataFrame으로 결과를 모아줘요.' },
      ],
      why:
        '실무에서 수억 건의 로그 데이터를 처리할 때, lazy 모드는 중간 결과를 메모리에 쓰지 않고 한 번에 최적화된 파이프라인으로 실행해서 수십 배 빠르고 메모리도 적게 써요.',
      expectedOutput:
        '실행 시:\n' +
        '[원본] 데이터:\n' +
        'shape: (3, 2)\n' +
        '┌─────┬──────┐\n' +
        '│ age ┆ name │\n' +
        '│ --- ┆ ---  │\n' +
        '│ i64 ┆ str  │\n' +
        '╞═════╪══════╡\n' +
        '│ 25  ┆ kim  │\n' +
        '│ 30  ┆ lee  │\n' +
        '│ 35  ┆ park │\n' +
        '└─────┴──────┘\n' +
        '[결과] 필터 후 수집:\n' +
        'shape: (2, 2)\n' +
        '┌──────┬─────┐\n' +
        '│ name ┆ age │\n' +
        '│ ---  ┆ --- │\n' +
        '│ str  ┆ i64 │\n' +
        '╞══════╪═════╡\n' +
        '│ lee  ┆ 30  │\n' +
        '│ park ┆ 35  │\n' +
        '└──────┴─────┘',
      realWorldUsage:
        '실제 로그 분석 시스템에서 수억 줄의 서버 로그를 Polars lazy 모드로 읽어서, "오류 로그만 필터 -> 시간별 집계 -> 저장" 파이프라인을 한 번에 최적화 실행해요.',
      pitfall: 'collect()를 호출하지 않으면 결과는 LazyFrame(실행 계획) 상태로 남아 있어요. 실제 데이터를 보려면 반드시 collect()를 호출해야 해요.',
    },
  },
  {
    id: 'pdata-polars-groupby',
    lang: 'python',
    title: 'Polars 표현식 기반 group_by',
    file: 'polars_groupby.py',
    code: `import polars as pl

df = pl.DataFrame({
  'team': ['A', 'A', 'B', 'B'],
  'score': [10, 20, 15, 25],
})
print(f"[원본] 데이터:\n{df}")
result = df.group_by('team').agg(
  pl.col('score').sum().alias('total'),
  pl.col('score').mean().alias('avg'),
)
print(f"[집계] 팀별 통계:\n{result}")`,
    explain: {
      concept:
        'Polars의 group_by는 Pandas의 groupby와 비슷하지만, 표현식(expression) 기반으로 집계를 정의해요. ' +
        'pl.col("score").sum().alias("total")은 "score 열을 합계 내서 total이라는 이름으로 결과 열을 만들어줘"라는 의미예요. ' +
        'alias()로 결과 열에 명시적인 이름을 붙이는 게 핵심이에요. Pandas처럼 자동으로 이름이 생성되지 않고 프로그래머가 직접 결정해요. ' +
        'Polars의 표현식 시스템은 LazyFrame 최적화 엔진과 결합돼서 대용량 데이터에서 극적인 성능을 보여줘요.',
      terms: [
        { t: 'group_by(\'team\')', d: 'Polars 1.x 버전의 그룹화 메서드예요. 이전 버전은 groupby였어요.' },
        { t: 'pl.col(\'score\').sum()', d: 'score 열의 모든 값을 합계하는 표현식이에요.' },
        { t: '.alias(\'total\')', d: '표현식의 결과 열에 total이라는 명시적 이름을 붙이는 메서드예요.' },
        { t: '.agg(...)', d: '각 그룹에 적용할 표현식들을 인수로 받아 실행해요.' },
      ],
      why:
        '실무에서 Polars는 수천만 건 이상의 데이터를 Pandas보다 훨씬 빠르게 처리할 수 있어서, 빅데이터 ETL 파이프라인이나 실시간 분석 시스템에서 선호돼요.',
      expectedOutput:
        '실행 시:\n' +
        '[원본] 데이터:\n' +
        'shape: (4, 2)\n' +
        '┌──────┬───────┐\n' +
        '│ team ┆ score │\n' +
        '│ ---  ┆ ---   │\n' +
        '│ str  ┆ i64   │\n' +
        '╞══════╪═══════╡\n' +
        '│ A    ┆ 10    │\n' +
        '│ A    ┆ 20    │\n' +
        '│ B    ┆ 15    │\n' +
        '│ B    ┆ 25    │\n' +
        '└──────┴───────┘\n' +
        '[집계] 팀별 통계:\n' +
        'shape: (2, 3)\n' +
        '┌──────┬───────┬──────┐\n' +
        '│ team ┆ total ┆ avg  │\n' +
        '│ ---  ┆ ---   ┆ ---  │\n' +
        '│ str  ┆ i64   ┆ f64  │\n' +
        '╞══════╪═══════╪══════╡\n' +
        '│ A    ┆ 30    ┆ 15.0 │\n' +
        '│ B    ┆ 40    ┆ 20.0 │\n' +
        '└──────┴───────┴──────┘',
      realWorldUsage:
        '실제 금융 데이터 분석에서 "증권사별·일자별 체결량 합계와 평균 체결가"를 Polars group_by로 수억 건의 거래 데이터에서 수 초 안에 집계해요.',
      pitfall: 'Polars 1.x부터 groupby가 group_by(언더스코어)로 이름이 변경됐어요. 설치된 버전에 따라 올바른 메서드명을 확인해야 해요.',
    },
  },
  {
    id: 'pdata-apply',
    lang: 'python',
    title: 'Pandas apply로 파생 컬럼 만들기',
    file: 'pandas_apply.py',
    code: `import pandas as pd

df = pd.DataFrame({'price': [1000, 2500, 3000]})
print(f"[원본] 가격 데이터:\n{df}")
df['tax'] = df['price'].apply(lambda x: x * 0.1)
print(f"[결과] 세금 열 추가:\n{df}")`,
    explain: {
      concept:
        'apply는 DataFrame의 각 행이나 각 원소에 원하는 함수를 일괄 적용해서 새 컬럼을 만들 때 써요. ' +
        'lambda x: x * 0.1은 "가격의 10%를 세금으로 계산해줘"라는 익명 함수고, apply가 price 열의 모든 값에 이 함수를 적용해줘요. ' +
        '실무에서는 "주문 금액에 등급별 할인율 적용", "날짜 문자열을 datetime으로 변환"처럼 기존 컬럼을 가공해 파생 컬럼을 만들 때 자주 써요. ' +
        '다만 apply는 내부적으로 파이썬 루프를 돌기 때문에 대용량 데이터에서는 느릴 수 있어요. 단순 사칙연산은 벡터 연산을 우선 써야 해요.',
      terms: [
        { t: 'df[\'price\'].apply(lambda x: x * 0.1)', d: 'price 열의 각 값에 10%를 곱하는 함수를 적용해요.' },
        { t: 'lambda x: x * 0.1', d: '이름 없이 한 줄로 정의한 익명 함수예요. x를 받아 x*0.1을 반환해요.' },
        { t: "df['tax'] = ...", d: '계산 결과를 tax라는 새 열에 할당해서 DataFrame에 추가해요.' },
        { t: 'axis=1', d: '행 단위로 함수를 적용할 때 쓰는 옵션이에요. 기본 axis=0은 열 단위예요.' },
      ],
      why:
        '실무에서 "배송비 = 무게 * 단가 + 기본료" 같은 비즈니스 로직을 apply로 구현하면, 복잡한 계산을 한 줄로 각 행에 적용할 수 있어요.',
      expectedOutput:
        '실행 시:\n' +
        '[원본] 가격 데이터:\n' +
        '   price\n' +
        '0   1000\n' +
        '1   2500\n' +
        '2   3000\n' +
        '[결과] 세금 열 추가:\n' +
        '   price    tax\n' +
        '0   1000  100.0\n' +
        '1   2500  250.0\n' +
        '2   3000  300.0',
      realWorldUsage:
        '실제 물류 시스템에서 "주문 건별 배송 예정일 = 출고일 + (거리 / 평균 배송 속도)" 같은 계산을 apply로 각 행에 적용해 파생 컬럼을 만들어요.',
      pitfall: 'apply는 파이썬 for 루프 수준으로 느려서 대용량 데이터에선 병목이 돼요. 단순 사칙연산은 df["price"] * 0.1 같은 벡터 연산으로 써야 수십 배 빨라요.',
    },
  },
];
