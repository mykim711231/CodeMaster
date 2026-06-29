# Data

## Official Documentation
- [NumPy documentation](https://numpy.org/doc/stable/)

## 핵심 개념
> NumPy의 `ndarray`는 고정 타입의 다차원 배열로, 브로드캐스팅 규칙을 통해 형태가 다른 배열 간 연산을 벡터화한다. Pandas의 `DataFrame`은 라벨링된 2차원 테이블로, `groupby()`로 집계하고 `merge()`로 SQL 스타일 조인을 수행한다. Matplotlib으로 데이터를 시각화하며, Polars는 Rust 기반의 빠른 DataFrame 라이브러리로 지연 평가(LazyFrame)를 지원한다.

## 학습 목표
- NumPy `ndarray`를 생성하고 브로드캐스팅 규칙을 이해할 수 있다.
- Pandas `DataFrame`으로 데이터를 로드하고 `groupby()`와 `merge()`로 분석할 수 있다.
- Matplotlib으로 기본적인 차트를 생성할 수 있다.
- Polars의 기본 DataFrame API를 사용할 수 있다.

## 예제 코드
```python
import numpy as np
import pandas as pd
import matplotlib.pyplot as plt
import polars as pl

# --- NumPy ---
arr1 = np.array([[1, 2, 3], [4, 5, 6]])
arr2 = np.array([10, 20, 30])

# broadcast: (2,3) + (3,) -> (2,3)
broadcasted = arr1 + arr2

# universal functions
sqrt_arr = np.sqrt(broadcasted)

print("NumPy broadcast result:\n", broadcasted)
print("NumPy sqrt:\n", sqrt_arr)

# --- Pandas ---
df = pd.DataFrame({
    "category": ["A", "A", "B", "B", "C"],
    "value":   [10, 20, 30, 40, 50],
})
df_extra = pd.DataFrame({
    "category": ["A", "B", "D"],
    "name":     ["Alpha", "Beta", "Delta"],
})

# groupby
grouped = df.groupby("category")["value"].agg(["sum", "mean"])

# merge (inner join)
merged = df.merge(df_extra, on="category", how="inner")

print("\nPandas groupby:\n", grouped)
print("\nPandas merge:\n", merged)

# --- Matplotlib ---
x = np.linspace(0, 2 * np.pi, 100)
y_sin = np.sin(x)
y_cos = np.cos(x)

plt.figure(figsize=(8, 4))
plt.plot(x, y_sin, label="sin(x)")
plt.plot(x, y_cos, label="cos(x)")
plt.title("Sine and Cosine")
plt.xlabel("x")
plt.ylabel("y")
plt.legend()
plt.grid(True)
plt.tight_layout()
plt.savefig("sine_cosine.png")

# --- Polars ---
df_pl = pl.DataFrame({
    "name": ["Alice", "Bob", "Charlie"],
    "age":  [25, 30, 35],
    "score":[88.5, 92.0, 79.5],
})

# filter + select
filtered = df_pl.filter(pl.col("age") > 28).select(["name", "score"])

# lazy evaluation
lazy_result = (
    df_pl.lazy()
    .filter(pl.col("score") > 80)
    .group_by("age")
    .agg(pl.col("score").mean())
    .collect()
)

print("\nPolars filtered:\n", filtered)
print("\nPolars lazy result:\n", lazy_result)
```

## 주요 패턴
- NumPy broadcast: 배열 차원을 우측 정렬하여 호환 가능한 차원이면 자동 확장된다.
- Pandas groupby-agg: `split-apply-combine` 전략으로 카테고리별 통계를 계산한다.
- Pandas merge: `on`, `how`(inner/left/right/outer) 파라미터로 SQL 조인과 유사하게 결합한다.
- Matplotlib OOP API: `fig, ax = plt.subplots()`로 서브플롯을 객체 지향적으로 다룬다.
- Polars lazy: `.lazy().pipe1().pipe2().collect()`로 실행 계획을 최적화한 후 한 번에 실행한다.

## 주의사항
- NumPy에서 `shape`가 다른 배열을 연산할 때 브로드캐스팅이 의도치 않게 발생할 수 있으므로 `arr.shape`을 항상 확인한다.
- Pandas DataFrame에서 `inplace=True`는 권장되지 않으며(deprecated 예정), 항상 새 객체를 반환하는 체이닝을 사용한다.
- Matplotlib은 기본적으로 GUI 백엔드를 사용하므로, 서버 환경에서는 `matplotlib.use("Agg")`를 먼저 호출한다.
- Polars는 Pandas와 API가 유사하지만 미묘하게 다르므로(예: `select` vs `loc`) 공식 문서를 참조한다.
- 대용량 데이터를 Pandas `merge()` 할 때 카테시안 곱이 발생하지 않도록 키의 유니크 여부를 확인한다.
