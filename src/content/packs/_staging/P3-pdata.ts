import type { Snippet } from '../../types';

export const pythonData: Snippet[] = [
  {
    id: 'pdata-numpy-create-array',
    lang: 'python',
    title: 'NumPy 배열(ndarray) 생성',
    file: 'numpy_create.py',
    code: `import numpy as np

arr = np.array([1, 2, 3, 4, 5])
print(arr.shape)
print(arr.dtype)
print(arr * 2)`,
    explain: {
      concept: 'ndarray는 리스트를 통째로 한 번에 계산해 주는 계산판이에요. 줄칸 수(shape)와 자료형(dtype)을 스스로 알아 가져요.',
      terms: [
        { t: 'np.array', d: '리스트를 배열로 바꾸는 함수' },
        { t: 'shape', d: '각 차원별 크기를 튜플로 알려주는 속성' },
        { t: 'dtype', d: '배열 원소의 자료형(예: int32, float64)' },
        { t: 'arr * 2', d: '모든 원소에 2를 곱하는 벡터 연산' },
      ],
      why: '파이썬 리스트는 원소마다 따로 계산해서 느리기 때문에 통째로 계산하는 배열이 필요해요.',
      pitfall: 'dtype을 안 적으면 입력 데이터를 보고 추론해서 예상과 다를 수 있어요.',
    },
  },
  {
    id: 'pdata-numpy-broadcast-scalar',
    lang: 'python',
    title: 'NumPy 브로드캐스트: 스칼라 더하기',
    file: 'numpy_broadcast.py',
    code: `import numpy as np

arr = np.array([[1, 2, 3], [4, 5, 6]])
result = arr + 10
print(result)`,
    explain: {
      concept: '브로드캐스트는 크기가 다른 배열끼리도 자동으로 맞춰 계산해 주는 기능이에요. 스칼라(한 개 숫자)를 더하면 모든 칸에 더해져요.',
      terms: [
        { t: 'arr + 10', d: '배열 전체에 10을 더하는 브로드캐스트' },
        { t: 'scalar', d: '배열이 아닌 단일 숫자 값' },
        { t: 'broadcast', d: '모양을 자동으로 맞춰 연산하는 규칙' },
      ],
      why: '반복문 없이 전체 배열에 같은 연산을 한 줄로 적용하려고요.',
      pitfall: '모양이 규칙에 안 맞으면 에러가 나요. 끝쪽 차원부터 비교해서 1이거나 같아야 해요.',
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
print(a + b)`,
    explain: {
      concept: '세로 벡터(2x1)와 가로 배열(2x3)을 더하면 가로로 복사돼 계산돼요. 마치 한 줄을 여러 줄에 반복 찍어주는 것 같아요.',
      terms: [
        { t: 'a (2x3)', d: '2행 3열짜리 배열' },
        { t: 'b (2x1)', d: '2행 1열짜리 세로 벡터' },
        { t: 'a + b', d: 'b가 가로로 늘어나 2x3으로 맞춰짐' },
      ],
      why: '행마다 다른 가중치를 한 번에 더하려고요.',
      pitfall: 'b를 [10, 20]으로 쓰면 shape이 (2,)이 돼서 끝 차원 3 vs 2가 불일치해 브로드캐스트 에러가 나요. 반드시 [[10],[20]] 모양(2x1)이어야 해요.',
    },
  },
  {
    id: 'pdata-numpy-reshape',
    lang: 'python',
    title: 'NumPy reshape으로 차원 바꾸기',
    file: 'numpy_reshape.py',
    code: `import numpy as np

flat = np.arange(12)
grid = flat.reshape(3, 4)
print(grid.shape)
print(grid.T.shape)`,
    explain: {
      concept: 'reshape은 원소 순서를 유지한 채 줄칸 모양을 바꿔주는 도구예요. 찍찍이 블록을 같은 개수로 다른 틀에 끼워 넣는 것과 같아요.',
      terms: [
        { t: 'arange(12)', d: '0부터 11까지 채운 1차원 배열 생성' },
        { t: 'reshape(3, 4)', d: '3행 4열 모양으로 재구성' },
        { t: 'T', d: '행과 열을 뒤바꾼 전치(transpose)' },
      ],
      why: '데이터 모양을 모델이나 그래프에 맞추려고 해요.',
      pitfall: '원소 개수가 딱 안 맞으면 에러가 나요. -1을 쓰면 남은 차원을 자동 계산해 줘요.',
    },
  },
  {
    id: 'pdata-numpy-aggregate-axis',
    lang: 'python',
    title: 'NumPy 축(axis) 기준 집계',
    file: 'numpy_axis.py',
    code: `import numpy as np

arr = np.array([[1, 2, 3], [4, 5, 6]])
print(arr.sum(axis=0))
print(arr.sum(axis=1))`,
    explain: {
      concept: 'axis는 어느 방향으로 모을지 정하는 축이에요. axis=0은 열(세로)끼리, axis=1은 행(가로)끼리 더해요.',
      terms: [
        { t: 'axis=0', d: '행을 따라 내려가며(세로) 합산' },
        { t: 'axis=1', d: '열을 따라 옆으로(가로) 합산' },
        { t: 'sum', d: '합계를 구하는 집계 함수' },
      ],
      why: '행별·열별 통계를 따로 구하려고 축을 지정해요.',
      pitfall: 'axis 방향이 헷갈리기 쉬워요. axis=0은 "행을 없애는" 방향으로 기억하면 편해요.',
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
print(arr[mask])`,
    explain: {
      concept: '불리언 인덱싱은 True/False 배열로 원소를 골라내는 거름망(필터)이에요. 조건에 맞는 값만 솎아낼 수 있어요.',
      terms: [
        { t: 'arr > 20', d: '각 원소에 대해 참/거짓 배열을 만드는 비교' },
        { t: 'mask', d: 'True/False로 이루어진 조건 배열' },
        { t: 'arr[mask]', d: 'mask가 True인 위치만 선택' },
      ],
      why: '반복문 없이 조건에 맞는 원소만 빠르게 뽑으려고요.',
      pitfall: 'mask 길이가 arr과 같아야 해요. 다르면 에러가 나요.',
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
print(a, b)`,
    explain: {
      concept: 'seed는 난수 발생기의 시작 값을 정해주는 옵션이에요. 시드를 고정하면 매번 같은 난수가 나와요.',
      terms: [
        { t: 'default_rng(42)', d: '시드 42를 고정한 최신 Generator 객체 생성' },
        { t: 'rng.random(3)', d: '0~1 사이 균일 난수 3개 생성' },
        { t: 'reproducible', d: '다시 실행해도 같은 결과가 나오는 성질' },
      ],
      why: '실험 결과를 다시 만들 수 있게(재현 가능하게) 하려고 해요.',
      pitfall: '예전 방식인 np.random.seed(42)는 전역 상태를 바꾸므로 권장하지 않아요. default_rng를 쓰면 독립적인 Generator를 만들 수 있어요.',
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
print(df.head())`,
    explain: {
      concept: 'DataFrame은 엑셀 시트처럼 열마다 이름이 있는 표예요. 딕셔너리(키-값 묶음)로 쉽게 만들 수 있어요.',
      terms: [
        { t: 'pd.DataFrame', d: '표 형태 데이터를 만드는 생성자' },
        { t: 'name/age', d: '열 이름(컬럼)' },
        { t: 'head()', d: '앞의 5행을 미리 보는 메서드' },
      ],
      why: '여러 열을 이름으로 다루려고 리스트 대신 DataFrame을 써요.',
      pitfall: '열마다 길이가 같아야 해요. 다르면 에러가 나요.',
    },
  },
  {
    id: 'pdata-pandas-select-col',
    lang: 'python',
    title: 'Pandas 열 선택과 행 필터',
    file: 'pandas_select.py',
    code: `import pandas as pd

df = pd.DataFrame({'name': ['kim', 'lee'], 'age': [25, 30]})
ages = df['age']
old = df[df['age'] > 26]
print(old)`,
    explain: {
      concept: 'df["col"]으로 한 열을 뽑고, 조건 배열을 대괄호에 넣으면 조건에 맞는 행만 골라져요. NumPy 불리언 마스크와 같은 원리예요.',
      terms: [
        { t: "df['age']", d: 'age 열 전체를 선택' },
        { t: "df['age'] > 26", d: '각 행에 대해 참/거짓 시리즈 생성' },
        { t: 'df[...]', d: '참인 행만 필터링' },
      ],
      why: '데이터에서 조건에 맞는 부분만 빠르게 보려고 해요.',
      pitfall: '따옴표를 섞어 쓰지 마세요. 작은따옴표를 통일해요.',
    },
  },
  {
    id: 'pdata-pandas-loc-iloc',
    lang: 'python',
    title: 'Pandas loc vs iloc',
    file: 'pandas_loc.py',
    code: `import pandas as pd

df = pd.DataFrame({'age': [25, 30, 35]}, index=['kim', 'lee', 'park'])
print(df.loc['lee'])
print(df.iloc[1])`,
    explain: {
      concept: 'loc은 라벨(이름)로 찾고, iloc은 번호(순서)로 찾아요. 이름표가 붙은 사물함 vs 몇 번째 칸인지로 여는 차이예요.',
      terms: [
        { t: "loc['lee']", d: '인덱스 이름이 lee인 행 선택' },
        { t: 'iloc[1]', d: '순서상 2번째(0부터) 행 선택' },
        { t: 'index', d: '행을 식별하는 라벨' },
      ],
      why: '이름으로 찾을지 순서로 찾을지 명확히 구분하려고 해요.',
      pitfall: 'loc은 끝 라벨을 포함하지만 iloc은 끝 번호를 포함하지 않아요.',
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
print(df.groupby('team').sum())`,
    explain: {
      concept: 'groupby는 같은 팀끼리 묶어서 통계를 내는 기능이에요. 반별로 점수 합계를 구하는 것과 같아요.',
      terms: [
        { t: "groupby('team')", d: 'team 열 기준으로 그룹을 나눔' },
        { t: 'sum()', d: '각 그룹의 합계를 계산' },
        { t: 'team', d: '그룹 기준이 되는 열' },
      ],
      why: '범주별로 통계를 따로 구하려고 해요.',
      pitfall: '집계 함수를 안 부르면 그룹 객체만 있고 결과는 안 나와요. .sum()이나 .mean()을 붙여야 해요.',
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
print(df.groupby('team').agg(['sum', 'mean', 'count']))`,
    explain: {
      concept: 'agg에 함수 이름들을 리스트로 주면 여러 통계를 한 번에 내줘요. 한 반의 합계·평균·인원수를 동시에 보는 것 같아요.',
      terms: [
        { t: 'agg', d: '여러 집계 함수를 동시에 적용하는 메서드' },
        { t: "'sum', 'mean', 'count'", d: '적용할 집계 함수 이름들' },
        { t: 'list', d: '함수 이름들을 묶은 배열' },
      ],
      why: '한 번에 여러 통계를 얻어 반복 호출을 줄이려고 해요.',
      pitfall: '리스트로 주면 열이 2단(멀티인덱스)으로 나와요. 평탄화하려면 나중에 이름을 다시 지정해야 해요.',
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
merged = pd.merge(left, right, on='id')
print(merged)`,
    explain: {
      concept: 'merge는 두 표를 공통 열을 기준으로 합치는 기능이에요. 학생번호로 명단과 점수표를 잇는 것과 같아요.',
      terms: [
        { t: 'merge', d: '두 DataFrame을 공통 열 기준으로 합치는 함수' },
        { t: "on='id'", d: '조인의 기준이 되는 열 이름' },
        { t: 'inner', d: '양쪽 모두 있는 키만 남기는 방식(기본값)' },
        { t: "how='left'/'outer'", d: '왼쪽 전체 유지/양쪽 모두 유지 옵션' },
      ],
      why: '흩어진 정보를 한 표로 합쳐 보려고 해요.',
      pitfall: '기준 열 이름이 다르면 left_on/right_on으로 따로 지정해야 해요. how 기본값은 inner라 한쪽에만 있는 행은 사라져요.',
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
print(pd.pivot_table(df, index='team', columns='round', values='score'))`,
    explain: {
      concept: 'pivot_table은 긴 표를 가로·세로 모양으로 펼쳐주는 도구예요. 팀별로 줄을 세우고 회차별로 가로 칸을 만드는 느낌이에요.',
      terms: [
        { t: 'index', d: '행(가로줄) 기준 열' },
        { t: 'columns', d: '열(세로줄) 기준 열' },
        { t: 'values', d: '칸에 채울 값 열' },
        { t: 'pivot_table', d: '긴 데이터를 2차원 표로 재구성하는 함수' },
      ],
      why: '범주 두 개를 축으로 교차표를 만들어 비교하려고 해요.',
      pitfall: '같은 칸에 값이 여러 개면 기본(mean)으로 평균을 채워요. sum 등을 따로 지정하세요.',
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
filled = df.fillna(df['age'].mean())
print(filled)`,
    explain: {
      concept: 'fillna는 빈칸(결측치)을 채우는 함수예요. 평균이나 0 등 정해진 값으로 빈 자리를 메우는 것과 같아요.',
      terms: [
        { t: 'NaN', d: '빈 값(Not a Number)을 나타내는 표시' },
        { t: 'fillna', d: '결측치를 지정한 값으로 채우는 메서드' },
        { t: "df['age'].mean()", d: 'age 열의 평균을 계산' },
      ],
      why: '빈 값이 있으면 계산이 안 되거나 결과가 왜곡돼서 채워야 해요.',
      pitfall: 'fillna는 원본을 바꾸지 않아요. 결과를 다시 담거나 inplace=True를 써야 반영돼요.',
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
plt.plot(x, y, marker='o')
plt.title('Trend')
plt.show()`,
    explain: {
      concept: 'plot은 점들을 선으로 이어 그래프를 그리는 함수예요. x좌표와 y좌표를 짝지어 화면에 찍어요.',
      terms: [
        { t: 'plt.plot', d: '선 그래프를 그리는 함수' },
        { t: "marker='o'", d: '각 점을 동그라미로 표시' },
        { t: 'title', d: '그래프 제목을 설정하는 메서드' },
        { t: 'show', d: '그래프를 화면에 띄우는 함수' },
      ],
      why: '숫자 데이터의 흐름을 눈으로 보려고 해요.',
      pitfall: 'show()를 안 부르면 화면에 안 나와요. 스크립트 환경에서는 꼭 호출하세요.',
    },
  },
  {
    id: 'pdata-matplotlib-subplots',
    lang: 'python',
    title: 'Matplotlib 여러 그래프(subplots)',
    file: 'mpl_subplots.py',
    code: `import matplotlib.pyplot as plt

fig, axes = plt.subplots(1, 2)
axes[0].plot([1, 2, 3], [1, 4, 9])
axes[1].bar(['a', 'b', 'c'], [3, 5, 2])
plt.show()`,
    explain: {
      concept: 'subplots는 하나의 그림판(fig)을 여러 칸으로 나눠 그리는 도구예요. 한 장에 여러 그래프를 나란히 볼 수 있어요.',
      terms: [
        { t: 'fig', d: '전체 그림판 객체' },
        { t: 'axes', d: '각 칸(축)을 담은 배열' },
        { t: 'bar', d: '막대 그래프를 그리는 함수' },
      ],
      why: '여러 그래프를 한눈에 비교하려고 한 판에 배치해요.',
      pitfall: 'axes가 1차원/2차원인지 행렬 모양에 따라 다르니 인덱스를 잘 확인하세요.',
    },
  },
  {
    id: 'pdata-polars-lazy',
    lang: 'python',
    title: 'Polars 지연(lazy) 실행',
    file: 'polars_lazy.py',
    code: `import polars as pl

df = pl.DataFrame({'age': [25, 30, 35], 'name': ['kim', 'lee', 'park']})
result = (
  df.lazy()
  .filter(pl.col('age') > 26)
  .select(['name', 'age'])
  .collect()
)
print(result)`,
    explain: {
      concept: 'lazy는 실행 계획을 미리 세우고 마지막에 collect()로 한 번에 실행하는 방식이에요. 요리 순서를 먼저 정하고 한 번에 요리하는 느낌이에요.',
      terms: [
        { t: 'lazy()', d: '즉시 실행 말고 계획만 세우는 모드 진입' },
        { t: 'pl.col', d: '열을 참조하는 함수' },
        { t: 'filter', d: '조건에 맞는 행만 남기는 단계' },
        { t: 'collect()', d: '계획을 실제로 실행해 결과를 가져옴' },
      ],
      why: '여러 연산을 하나로 합쳐 메모리와 시간을 아끼려고 해요.',
      pitfall: 'collect()를 안 부르면 결과가 아니라 계획(LazyFrame)만 있어요. 반드시 마지막에 호출하세요.',
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
result = df.group_by('team').agg(
  pl.col('score').sum().alias('total'),
  pl.col('score').mean().alias('avg'),
)
print(result)`,
    explain: {
      concept: 'Polars의 group_by는 표현식(expr)으로 집계해요. 한 번에 여러 통계를 alias로 이름 붙여 만들 수 있어요.',
      terms: [
        { t: 'group_by', d: 'team 기준으로 그룹을 나누는 메서드' },
        { t: 'pl.col', d: '열을 가리키는 표현식' },
        { t: 'alias', d: '결과 열의 새 이름을 지정' },
        { t: 'agg', d: '각 그룹에 적용할 표현식들을 받는 메서드' },
      ],
      why: '여러 집계를 한 번에, 빠르고 깔끔하게 구하려고 해요.',
      pitfall: '최신 버전에서는 groupby가 아니라 group_by(밑줄)로 써요. 버전에 따라 이름이 달라요.',
    },
  },
  {
    id: 'pdata-apply',
    lang: 'python',
    title: 'Pandas apply로 파생 컬럼 만들기',
    file: 'pandas_apply.py',
    code: `import pandas as pd

df = pd.DataFrame({'price': [1000, 2500, 3000]})
df['tax'] = df['price'].apply(lambda x: x * 0.1)
print(df)`,
    explain: {
      concept: 'apply는 각 값에 함수를 한 번씩 적용해 새 열을 만드는 도구예요. 한 줄의 주문으로 모든 칸에 같은 변신을 시키는 느낌이에요.',
      terms: [
        { t: 'apply', d: '각 값에 함수를 적용하는 메서드' },
        { t: 'lambda x', d: '이름 없이 한 줄로 만든 함수' },
        { t: "df['tax']", d: '계산 결과를 담을 새 열' },
      ],
      why: '행마다 따로 계산하지 않고 한 번에 파생 컬럼을 만들려고 해요.',
      pitfall: '큰 데이터에서는 느려요. 단순 사칙연산은 그냥 df["price"] * 0.1로 쓰는 게 더 빨라요.',
    },
  },
];
