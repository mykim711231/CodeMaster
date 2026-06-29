# Machine Learning

## Official Documentation
- [Scikit-Learn Tutorial](https://scikit-learn.org/stable/tutorial/)

## 핵심 개념
> Scikit-Learn은 일관된 `.fit()`/`.predict()` API로 분류, 회귀, 클러스터링 등 고전 머신러닝을 제공한다. `Pipeline`으로 전처리 + 모델을 하나의 객체로 연결하고, `train_test_split()`으로 데이터를 분할한다. XGBoost와 LightGBM은 Gradient Boosting 프레임워크로 테이블 데이터에서 최고 성능을 내며, `cross_val_score`로 교차검증해 과적합을 방지한다.

## 학습 목표
- Scikit-Learn의 `fit()`/`predict()` 패턴으로 분류/회귀 모델을 훈련할 수 있다.
- `Pipeline`으로 전처리와 모델 학습을 통합할 수 있다.
- `train_test_split()`과 교차검증으로 모델을 평가할 수 있다.
- XGBoost와 LightGBM을 사용한 Gradient Boosting 모델을 구성할 수 있다.

## 예제 코드
```python
import numpy as np
from sklearn.datasets import make_classification
from sklearn.model_selection import train_test_split, cross_val_score
from sklearn.preprocessing import StandardScaler
from sklearn.pipeline import Pipeline
from sklearn.linear_model import LogisticRegression
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import accuracy_score, classification_report
import xgboost as xgb
import lightgbm as lgb

# --- 데이터 생성 ---
X, y = make_classification(
    n_samples=1000, n_features=20, n_informative=10,
    n_redundant=5, random_state=42
)

# --- train_test_split ---
X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, random_state=42, stratify=y
)

# --- Pipeline (Scaler + LogisticRegression) ---
pipe = Pipeline([
    ("scaler", StandardScaler()),
    ("clf", LogisticRegression(max_iter=1000)),
])
pipe.fit(X_train, y_train)
print(f"Pipeline Accuracy: {pipe.score(X_test, y_test):.4f}")

# --- 교차검증 (RandomForest) ---
rf = RandomForestClassifier(n_estimators=100, random_state=42)
cv_scores = cross_val_score(rf, X, y, cv=5, scoring="accuracy")
print(f"RF CV Scores: {cv_scores}")
print(f"RF CV Mean: {cv_scores.mean():.4f} (+/- {cv_scores.std():.4f})")

# --- 전체 평가 ---
rf.fit(X_train, y_train)
y_pred = rf.predict(X_test)
print(f"\nRF Test Accuracy: {accuracy_score(y_test, y_pred):.4f}")
print(classification_report(y_test, y_pred, target_names=["Class 0", "Class 1"]))

# --- XGBoost ---
xgb_clf = xgb.XGBClassifier(
    n_estimators=100, learning_rate=0.1, max_depth=5, random_state=42
)
xgb_clf.fit(X_train, y_train)
print(f"XGBoost Accuracy: {accuracy_score(y_test, xgb_clf.predict(X_test)):.4f}")

# --- LightGBM ---
lgb_clf = lgb.LGBMClassifier(
    n_estimators=100, learning_rate=0.1, max_depth=5,
    random_state=42, verbose=-1
)
lgb_clf.fit(X_train, y_train)
print(f"LightGBM Accuracy: {accuracy_score(y_test, lgb_clf.predict(X_test)):.4f}")
```

## 주요 패턴
- `Pipeline`: `(name, transformer/estimator)` 튜플 리스트로 구성하여 전처리 누수를 방지하고 재사용성을 높인다.
- `train_test_split(stratify=y)`: 클래스 불균형 데이터에서 타겟 분포를 유지하며 분할한다.
- `cross_val_score`: K-Fold 교차검증으로 단일 train/test보다 안정적인 성능 추정을 제공한다.
- XGBoost/LightGBM: `early_stopping_rounds`로 과적합 직전에서 학습을 중단한다.
- `classification_report`: 정밀도, 재현율, F1-score를 한눈에 보여준다.

## 주의사항
- 학습 전에 반드시 `train_test_split`으로 데이터를 분리하고, 테스트 셋 정보가 훈련에 유입되지 않도록 한다.
- `Pipeline` 내에서 `StandardScaler`는 `fit()` 시 테스트 데이터를 보지 않으므로 data leakage를 방지한다.
- XGBoost/LightGBM은 `categorical_feature` 파라미터를 명시하지 않으면 범주형 변수를 자동 감지하지 못할 수 있다.
- `cross_val_score`의 기본 scoring은 분류기일 때 `accuracy`이므로, 불균형 데이터에서는 `f1`이나 `roc_auc`를 지정한다.
- LightGBM의 `verbose=-1`로 과도한 훈련 로그 출력을 억제할 수 있다.
