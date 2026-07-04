import type { Snippet } from '../../types';

export const pythonML: Snippet[] = [
  {
    id: 'pml-train-test-split',
    lang: 'python',
    title: '데이터 나누기: train_test_split',
    file: 'split.py',
    code: `from sklearn.model_selection import train_test_split

# X, y는 미리 정의된 특성 데이터와 라벨이라고 가정해요
X_train, X_test, y_train, y_test = train_test_split(
  X, y, test_size=0.2, random_state=42, stratify=y
)
print(f"[결과] 훈련용 shape: {X_train.shape}, 테스트용 shape: {X_test.shape}")
print(f"[정보] test_size=0.2, stratify=y 적용")`,
    explain: {
      concept:
        'train_test_split은 전체 데이터를 "공부할 문제집(훈련)"과 "시험지(테스트)" 두 묶음으로 나누는 함수예요. ' +
        '테스트 데이터는 모델 학습에 절대 사용하지 않고, 학습이 끝난 뒤 최종 성능 평가용으로만 써요. ' +
        '마치 학교에서 공부할 때 시험에 나올 문제를 미리 보지 않는 것과 같은 원리예요. ' +
        'test_size=0.2는 전체의 20%를 시험지로 떼어내겠다는 뜻이에요. ' +
        'stratify=y는 정답(y)의 클래스 비율이 훈련/테스트 양쪽에 동일하게 유지되도록 층화 추출해줘요.',
      terms: [
        { t: 'train_test_split(X, y, ...)', d: '특성 X와 라벨 y를 훈련용과 테스트용으로 분할해요.' },
        { t: 'test_size=0.2', d: '전체 데이터의 20%를 테스트 세트로 분리해요.' },
        { t: 'random_state=42', d: '데이터를 나누는 난수 시드를 고정해서 매번 같은 분할 결과를 얻어요.' },
        { t: 'stratify=y', d: '각 클래스 비율이 훈련/테스트 양쪽에 동일하게 유지되게 층화 추출해요.' },
        { t: 'X_train.shape', d: '훈련 데이터의 (행 개수, 특성 개수)를 튜플로 반환해요.' },
      ],
      why:
        '실무에서 모델을 학습한 데이터로 다시 평가하면 점수가 100%에 가깝게 나오지만, 실제 서비스에서는 형편없는 성능을 보여요. ' +
        '반드시 보지 않은 테스트 데이터로만 평가해서 진짜 성능을 측정해야 해요.',
      expectedOutput:
        '예시 (100개 샘플, 5개 특성):\n' +
        '[결과] 훈련용 shape: (80, 5), 테스트용 shape: (20, 5)\n' +
        '[정보] test_size=0.2, stratify=y 적용',
      realWorldUsage:
        '실제 신용카드 사기 탐지 모델을 만들 때, 사기 건수(소수 클래스)가 극히 적으므로 stratify를 반드시 써서 훈련/테스트 양쪽에 사기 데이터가 골고루 포함되게 해요.',
      pitfall: 'stratify를 빼먹으면 희귀 클래스가 한쪽에 몰릴 수 있어요. 분류 문제에서는 거의 항상 stratify를 쓰는 게 좋아요.',
    },
  },
  {
    id: 'pml-fit-predict',
    lang: 'python',
    title: '모델 학습과 예측: fit / predict',
    file: 'fit_predict.py',
    code: `from sklearn.linear_model import LogisticRegression

# X_train, X_test, y_train, y_test는 train_test_split으로 준비됐다고 가정해요
model = LogisticRegression(max_iter=1000)
model.fit(X_train, y_train)
print(f"[학습] LogisticRegression fit 완료")
pred = model.predict(X_test)
print(f"[예측] 테스트 데이터 예측 완료 - {len(pred)}건")
score = model.score(X_test, y_test)
print(f"[결과] 정확도: {score:.4f}")`,
    explain: {
      concept:
        '사이킷런의 모든 모델은 fit() -> predict() -> score()라는 공통 인터페이스를 따라요. ' +
        'fit()은 "이 데이터를 보고 규칙을 찾아라"는 학습 명령이고, predict()는 "새 데이터에 대해 답을 맞혀봐"라는 예측 명령이에요. ' +
        '이 단순한 인터페이스 덕분에 모델을 바꾸려면 LogisticRegression을 RandomForestClassifier로 한 줄만 바꾸면 돼요. ' +
        'max_iter=1000은 학습 반복 횟수의 상한으로, 기본값(100)으로는 수렴하지 못할 때 늘려줘요.',
      terms: [
        { t: 'LogisticRegression(max_iter=1000)', d: '예/아니오를 확률로 분류하는 선형 모델을 생성해요.' },
        { t: 'model.fit(X_train, y_train)', d: '훈련 데이터로 모델의 가중치(규칙)를 학습해요.' },
        { t: 'model.predict(X_test)', d: '학습된 규칙을 새 데이터에 적용해 라벨을 예측해요.' },
        { t: 'model.score(X_test, y_test)', d: '예측 결과와 실제 정답을 비교해 정확도를 자동 계산해요.' },
        { t: 'max_iter', d: '최적화 알고리즘의 최대 반복 횟수예요. 수렴 경고가 뜨면 늘려줘요.' },
      ],
      why:
        '실무에서는 fit/predict 인터페이스 덕분에 수십 종류의 모델을 같은 방식으로 실험하고 비교할 수 있어요. 모델 교체 비용이 거의 없어요.',
      expectedOutput:
        '예시 (80개 훈련, 20개 테스트):\n' +
        '[학습] LogisticRegression fit 완료\n' +
        '[예측] 테스트 데이터 예측 완료 - 20건\n' +
        '[결과] 정확도: 0.9500',
      realWorldUsage:
        '실제 스팸 메일 분류기에서 fit()으로 수만 건의 메일을 학습하고, predict()로 새 메일이 스팸인지 아닌지를 밀리초 안에 예측해서 자동 분류함에 넣어요.',
      pitfall: 'fit()은 반드시 훈련 데이터에만, predict()와 score()는 반드시 테스트 데이터에만 써야 해요. 테스트 데이터로 fit()을 하면 정보 누수가 발생해요.',
    },
  },
  {
    id: 'pml-standardscaler',
    lang: 'python',
    title: '표준화 전처리: StandardScaler',
    file: 'scaler.py',
    code: `from sklearn.preprocessing import StandardScaler

# X_train, X_test는 미리 분할된 데이터라고 가정해요
scaler = StandardScaler()
X_train_scaled = scaler.fit_transform(X_train)
X_test_scaled = scaler.transform(X_test)
means = X_train_scaled.mean(axis=0)
print(f"[검증] 훈련 데이터 평균 (0에 가까워야 함): {means[:3]}")
print(f"[정보] StandardScaler 적용 완료")`,
    explain: {
      concept:
        'StandardScaler는 각 특성(컬럼)의 값을 평균이 0, 표준편차가 1이 되도록 변환해줘요. ' +
        '서로 다른 단위의 특성들(키:cm, 몸무게:kg, 나이:세)을 같은 척도로 맞춰서, 단위가 큰 특성에 모델이 끌려다니는 걸 막아줘요. ' +
        'fit_transform()은 "훈련 데이터의 평균과 표준편차를 구하고(학습), 바로 그 기준으로 변환까지 해줘"라는 의미예요. ' +
        '테스트 데이터에는 절대 fit을 다시 하면 안 되고, 훈련 데이터로 구한 기준을 그대로 transform()만 적용해야 해요.',
      terms: [
        { t: 'StandardScaler()', d: '평균 0, 표준편차 1로 표준화하는 변환기를 생성해요.' },
        { t: 'fit_transform(X_train)', d: '훈련 데이터로 평균/표준편차 기준을 학습하고 바로 변환해요.' },
        { t: 'transform(X_test)', d: '훈련 데이터로 학습된 기준을 테스트 데이터에도 적용해요. fit은 하지 않아요.' },
        { t: '.mean(axis=0)', d: '변환 후 각 특성의 평균을 구해요. 0에 가까워야 표준화가 잘 된 거예요.' },
      ],
      why:
        'SVM, KNN, 신경망 같은 거리 기반 모델은 특성의 단위 차이에 매우 민감해요. 표준화를 하지 않으면 큰 단위의 특성 하나가 모델의 결정을 좌우해버려요.',
      expectedOutput:
        '예시:\n' +
        '[검증] 훈련 데이터 평균 (0에 가까워야 함): [ 1.23e-16 -3.45e-17  8.90e-17]\n' +
        '[정보] StandardScaler 적용 완료',
      realWorldUsage:
        '실제 의료 데이터 분석에서 "혈압(mmHg, 최대200) vs 나이(세, 최대100) vs 콜레스테롤(mg/dL, 최대300)"처럼 단위와 범위가 완전히 다른 특성들을 같은 척도로 맞춰서 모델이 공정하게 판단하게 해요.',
      pitfall: '테스트 데이터에 fit_transform()을 다시 쓰면 테스트의 평균과 표준편차를 새로 계산하게 돼서, 훈련 때와 다른 기준이 적용되는 데이터 누수가 발생해요. 반드시 transform()만 써야 해요.',
    },
  },
  {
    id: 'pml-pipeline-basic',
    lang: 'python',
    title: '파이프라인 묶기: Pipeline',
    file: 'pipeline.py',
    code: `from sklearn.pipeline import Pipeline
from sklearn.preprocessing import StandardScaler
from sklearn.linear_model import LogisticRegression

pipe = Pipeline([
  ('scaler', StandardScaler()),
  ('clf', LogisticRegression(max_iter=1000)),
])
pipe.fit(X_train, y_train)
score = pipe.score(X_test, y_test)
print(f"[결과] Pipeline 정확도: {score:.4f}")
print(f"[정보] Pipeline 단계: scaler -> clf")`,
    explain: {
      concept:
        'Pipeline은 전처리 단계와 모델을 하나의 작업 흐름으로 묶어주는 도구예요. ' +
        '리스트에 (이름, 변환기) 튜플을 순서대로 등록하면, fit() 한 번의 호출로 모든 단계가 차례로 실행돼요. ' +
        '파이프라인의 진짜 가치는 "테스트 데이터에 fit_transform 실수를 막아준다"는 점이에요. ' +
        'pipe.fit()을 호출하면 각 변환기는 fit_transform()을, 마지막 모델은 fit()을 실행해요. ' +
        'pipe.score()를 호출하면 모든 변환기는 transform()만, 모델은 predict()를 실행해서 데이터 누수를 원천 차단해요.',
      terms: [
        { t: 'Pipeline([(...), (...)])', d: '전처리+모델을 순서대로 묶은 작업 흐름을 생성해요.' },
        { t: "('scaler', StandardScaler())", d: 'scaler라는 이름으로 표준화 단계를 등록해요.' },
        { t: "('clf', LogisticRegression(...))", d: 'clf(classifier)라는 이름으로 분류 모델을 마지막에 등록해요.' },
        { t: 'pipe.fit(X_train, y_train)', d: '파이프라인의 모든 단계를 학습해요. scaler는 fit_transform, clf는 fit.' },
      ],
      why:
        '실무에서 실제 프로젝트는 전처리가 최소 5~6단계인데, Pipeline으로 묶으면 각 단계의 fit/transform 호출을 사람이 일일이 관리하지 않아도 돼요.',
      expectedOutput:
        '예시:\n' +
        '[결과] Pipeline 정확도: 0.9500\n' +
        '[정보] Pipeline 단계: scaler -> clf',
      realWorldUsage:
        '실제 신용 평가 모델에서 "결측치 처리 -> 표준화 -> 특성 선택 -> 로지스틱 회귀"의 4단계를 Pipeline으로 묶어서, 운영 환경에 배포할 때도 동일한 파이프라인으로 예측해요.',
      pitfall: '마지막 단계를 제외한 모든 중간 단계는 반드시 transform() 메서드가 있어야 해요. fit()만 있고 transform()이 없으면 Pipeline 구성이 안 돼요.',
    },
  },
  {
    id: 'pml-columntransformer',
    lang: 'python',
    title: '열마다 다르게 처리: ColumnTransformer',
    file: 'col_transform.py',
    code: `from sklearn.compose import ColumnTransformer
from sklearn.preprocessing import StandardScaler, OneHotEncoder

num_cols = ['age', 'income']
cat_cols = ['city']
pre = ColumnTransformer([
  ('num', StandardScaler(), num_cols),
  ('cat', OneHotEncoder(handle_unknown='ignore'), cat_cols),
])
# X_train은 숫자+범주형 열이 섞인 DataFrame이라고 가정해요
transformed = pre.fit_transform(X_train)
print(f"[결과] 변환 후 shape: {transformed.shape}")
print(f"[정보] 숫자열={num_cols}, 범주열={cat_cols}")`,
    explain: {
      concept:
        'ColumnTransformer는 숫자형 열과 범주형(문자) 열을 각각 다른 방식으로 전처리한 뒤 하나의 배열로 합쳐주는 도구예요. ' +
        '숫자 열에는 StandardScaler로 표준화를, 범주 열에는 OneHotEncoder로 가변수(0/1)로 변환해요. ' +
        '현실 데이터는 항상 숫자와 범주가 섞여 있어서, 한 가지 전처리 방식으로는 모든 열을 처리할 수 없어요. ' +
        'ColumnTransformer로 열마다 다른 전략을 적용하고, 결과를 하나의 ndarray로 합쳐서 모델에 넣을 수 있어요. ' +
        'handle_unknown="ignore"는 테스트 데이터에 훈련 때 없던 새로운 범주가 나와도 무시하고 넘어가게 해줘요.',
      terms: [
        { t: 'ColumnTransformer([...])', d: '열 그룹별로 다른 변환기를 지정할 수 있는 전처리 조합기예요.' },
        { t: '("num", StandardScaler(), num_cols)', d: 'num_cols 목록의 열에 StandardScaler를 적용해요.' },
        { t: 'OneHotEncoder(handle_unknown=\'ignore\')', d: '범주 값을 0/1 벡터로 변환하고, 모르는 범주는 무시해요.' },
        { t: 'handle_unknown', d: '훈련 시 못 본 새 범주가 테스트에 나왔을 때의 처리 방식을 지정해요.' },
      ],
      why:
        '실무에서는 고객 데이터에 "나이(숫자), 성별(범주), 주소(범주), 구매액(숫자)"이 섞여 있어서, ColumnTransformer 없이는 각 열 타입별로 따로 처리하고 수동으로 합쳐야 해요.',
      expectedOutput:
        '예시 (3개 숫자열, 2개 고유 도시):\n' +
        '[결과] 변환 후 shape: (100, 5)\n' +
        "[정보] 숫자열=['age', 'income'], 범주열=['city']",
      realWorldUsage:
        '실제 고객 이탈 예측 모델에서 "나이·사용기간(숫자)은 표준화, 가입경로·상품유형(문자)은 원핫인코딩"으로 나눠 처리한 뒤 하나의 특성 배열로 합쳐서 모델에 입력해요.',
      pitfall: '열 이름 대신 열 번호(인덱스)를 쓰면, Pipeline 중간에 열 순서가 바뀌었을 때 엉뚱한 열이 변환될 수 있어요. 가능하면 이름으로 지정하는 게 안전해요.',
    },
  },
  {
    id: 'pml-gridsearchcv',
    lang: 'python',
    title: '최적 설정 찾기: GridSearchCV',
    file: 'grid.py',
    code: `from sklearn.model_selection import GridSearchCV
from sklearn.ensemble import RandomForestClassifier

param = {'n_estimators': [50, 100], 'max_depth': [3, 5, None]}
gs = GridSearchCV(RandomForestClassifier(random_state=42), param, cv=5)
gs.fit(X_train, y_train)
print(f"[결과] 최적 파라미터: {gs.best_params_}")
print(f"[결과] 최고 교차검증 점수: {gs.best_score_:.4f}")`,
    explain: {
      concept:
        'GridSearchCV는 모델의 하이퍼파라미터(사용자가 직접 설정하는 값) 후보들을 격자(grid)처럼 조합해서 모두 실험해보고, 가장 성능이 좋은 조합을 찾아주는 자동 튜닝 도구예요. ' +
        'cv=5는 데이터를 5등분해서 5번 교차검증한다는 뜻이에요. 각 조합마다 5번의 검증 점수를 내고 평균으로 비교해요. ' +
        '실무에서는 모델 성능을 1~2%라도 올리기 위해 GridSearchCV로 최적 설정을 찾고, 그 설정으로 최종 모델을 다시 학습해요. ' +
        '다만 후보가 많으면 조합 수가 폭발적으로 늘어나니, 후보를 잘 좁히는 게 중요해요.',
      terms: [
        { t: 'GridSearchCV(모델, param, cv=5)', d: '모델의 파라미터 조합을 격자 탐색하며 교차검증하는 객체예요.' },
        { t: "param = {'n_estimators': [50,100], ...}", d: '탐색할 파라미터 후보를 딕셔너리로 정의해요.' },
        { t: 'cv=5', d: '데이터를 5개로 나눠 5-겹 교차검증을 수행해요.' },
        { t: 'best_params_', d: '가장 높은 교차검증 점수를 기록한 파라미터 조합이에요. 학습 완료 후 언더스코어(_)로 접근해요.' },
      ],
      why:
        '실무에서 "트리 개수는 100이 좋을까, 200이 좋을까"를 사람이 하나씩 바꿔가며 실험하는 대신, GridSearchCV가 밤새 자동으로 수백 조합을 실험하고 아침에 최적값을 알려줘요.',
      expectedOutput:
        '예시:\n' +
        "[결과] 최적 파라미터: {'max_depth': 5, 'n_estimators': 100}\n" +
        '[결과] 최고 교차검증 점수: 0.9525',
      realWorldUsage:
        '실제 경진대회(Kaggle)에서 상위권을 노리려면 GridSearchCV로 수십 개의 하이퍼파라미터 조합을 자동 탐색해서 단 0.001이라도 점수를 올리는 게 핵심 전략이에요.',
      pitfall: '파라미터 후보가 많으면 탐색 시간이 기하급수적으로 늘어나요. 예를 들어 5개 파라미터가 각각 5개 후보면 3125조합. RandomizedSearchCV를 대안으로 고려해야 해요.',
    },
  },
  {
    id: 'pml-cross-val-score',
    lang: 'python',
    title: '교차검증 점수: cross_val_score',
    file: 'cv.py',
    code: `from sklearn.model_selection import cross_val_score
from sklearn.tree import DecisionTreeClassifier

model = DecisionTreeClassifier(random_state=42)
scores = cross_val_score(model, X, y, cv=5, scoring='accuracy')
print(f"[결과] 폴드별 점수: {scores}")
print(f"[결과] 평균 정확도: {scores.mean():.4f} (+/- {scores.std():.4f})")`,
    explain: {
      concept:
        'cross_val_score는 데이터를 여러 조각(fold)으로 나눠서 번갈아가며 모델을 평가하고, 각 조각의 점수를 배열로 돌려줘요. ' +
        'train_test_split 한 번만 하면 우연히 쉬운 문제만 테스트에 들어갔을 때 점수가 높게 나올 수 있어요. ' +
        '교차검증은 여러 번의 시험을 평균 내서 이런 우연을 줄이고, 더 안정적인 성능 추정치를 얻을 수 있어요. ' +
        'scores.mean()으로 평균 성능을, scores.std()로 점수가 얼마나 흔들리는지(분산)도 함께 확인하는 게 실무의 표준 방식이에요.',
      terms: [
        { t: 'cross_val_score(model, X, y, cv=5)', d: '모델을 5-겹 교차검증으로 평가하고 점수 배열을 반환해요.' },
        { t: "scoring='accuracy'", d: '평가 지표로 정확도(맞춘 비율)를 사용해요.' },
        { t: 'cv=5', d: '데이터를 5등분해서 5번의 검증을 수행해요. 각 폴드는 한 번씩 테스트 역할을 해요.' },
        { t: 'scores.std()', d: '점수의 표준편차로, 모델 성능이 데이터 분할에 얼마나 민감한지 보여줘요.' },
      ],
      why:
        '실무에서 "이 모델의 진짜 성능은 얼마인가?"를 답하려면 단일 분할 점수 대신 교차검증 평균을 보고해야 해요. 논문과 보고서의 표준 방식이에요.',
      expectedOutput:
        '예시:\n' +
        '[결과] 폴드별 점수: [0.95 0.93 0.94 0.96 0.92]\n' +
        '[결과] 평균 정확도: 0.9400 (+/- 0.0141)',
      realWorldUsage:
        '실제 의료 진단 모델을 평가할 때, 환자 데이터를 5-겹 교차검증해서 "민감도 평균 94% ± 2%"라고 보고하면, 단일 분할 점수보다 훨씬 신뢰할 수 있는 평가가 돼요.',
      pitfall: 'cross_val_score 내부에서 모델을 복제해서 쓰므로, 바깥에서 먼저 fit()한 상태는 남지 않아요. 최종 모델을 만들려면 교차검증 후 따로 fit()해야 해요.',
    },
  },
  {
    id: 'pml-stratified-kfold',
    lang: 'python',
    title: '비율 유지 검증: StratifiedKFold',
    file: 'stratified.py',
    code: `from sklearn.model_selection import StratifiedKFold

skf = StratifiedKFold(n_splits=5, shuffle=True, random_state=42)
print(f"[실행] StratifiedKFold - 5겹, 클래스 비율 유지")
for fold, (tr_idx, va_idx) in enumerate(skf.split(X, y)):
  print(f"  폴드 {fold}: 훈련={len(tr_idx)}, 검증={len(va_idx)}")
print(f"[정보] shuffle=True, random_state=42")`,
    explain: {
      concept:
        'StratifiedKFold는 일반 KFold와 달리 각 폴드마다 정답(y)의 클래스 비율이 원본과 동일하게 유지돼요. ' +
        '예를 들어 스팸:일반 = 1:9인 데이터를 5등분하면, 일반 KFold는 어느 한 폴드에 스팸이 하나도 없을 수 있어요. ' +
        'StratifiedKFold는 각 폴드마다 스팸이 약 10%씩 포함되도록 강제해서, 불균형 데이터에서도 공정한 평가가 가능해요. ' +
        'shuffle=True로 나누기 전에 데이터를 무작위로 섞으면 순서 편향을 방지할 수 있어요.',
      terms: [
        { t: 'StratifiedKFold(n_splits=5, ...)', d: '클래스 비율을 유지하며 데이터를 5개 폴드로 나누는 분할기예요.' },
        { t: 'shuffle=True', d: '분할 전에 데이터를 무작위로 섞어서 순서 편향을 방지해요.' },
        { t: 'skf.split(X, y)', d: '각 폴드의 (훈련 인덱스, 검증 인덱스) 튜플을 순서대로 반환해요.' },
        { t: 'tr_idx, va_idx', d: '각각 훈련 데이터의 행 번호, 검증 데이터의 행 번호 리스트예요.' },
      ],
      why:
        '실무에서 사기 탐지(사기:0.1%) 같은 극단적 불균형 데이터를 일반 KFold로 나누면, 어떤 폴드엔 사기 데이터가 하나도 없어서 평가가 무의미해져요. StratifiedKFold가 필수예요.',
      expectedOutput:
        '예시 (100개 샘플, 5겹):\n' +
        '[실행] StratifiedKFold - 5겹, 클래스 비율 유지\n' +
        '  폴드 0: 훈련=80, 검증=20\n' +
        '  폴드 1: 훈련=80, 검증=20\n' +
        '  폴드 2: 훈련=80, 검증=20\n' +
        '  폴드 3: 훈련=80, 검증=20\n' +
        '  폴드 4: 훈련=80, 검증=20\n' +
        '[정보] shuffle=True, random_state=42',
      realWorldUsage:
        '실제 질병 진단 모델에서 1000명 중 환자가 10명뿐일 때, StratifiedKFold로 각 폴드마다 2명의 환자가 포함되게 해서 모든 폴드에서 유의미한 평가가 가능하게 해요.',
      pitfall: 'StratifiedKFold는 분류(classification) 전용이에요. 회귀(regression)에는 사용할 수 없으니 KFold나 TimeSeriesSplit을 써야 해요.',
    },
  },
  {
    id: 'pml-classification-report',
    lang: 'python',
    title: '분류 평가표: classification_report',
    file: 'report.py',
    code: `from sklearn.metrics import classification_report

# model은 이미 학습된 분류기, X_test와 y_test는 테스트 데이터라고 가정해요
pred = model.predict(X_test)
report = classification_report(y_test, pred, target_names=labels)
print(f"[평가] 분류 리포트:")
print(report)`,
    explain: {
      concept:
        'classification_report는 각 클래스별로 정밀도(precision), 재현율(recall), F1-score를 한 표로 보여줘요. ' +
        '정밀도는 "A라고 예측한 것 중에 진짜 A인 비율", 재현율은 "진짜 A 중에 A라고 잡아낸 비율"이에요. ' +
        'F1-score는 이 둘의 조화평균으로, 한쪽만 높고 다른 쪽이 낮은 걸 걸러내는 균형 지표예요. ' +
        '정확도(accuracy)만 보면 희귀 클래스를 전부 틀려도 점수가 높아 보일 수 있어서, 불균형 데이터에서는 이 리포트가 훨씬 중요해요.',
      terms: [
        { t: 'classification_report(y_test, pred)', d: '실제 정답과 예측값을 비교해 클래스별 평가 지표를 표로 출력해요.' },
        { t: 'target_names=labels', d: '클래스 번호(0,1,2...) 대신 사람이 읽을 수 있는 이름을 표시해요.' },
        { t: 'precision(정밀도)', d: '모델이 Positive라고 예측한 것 중 실제 Positive의 비율이에요.' },
        { t: 'recall(재현율)', d: '실제 Positive 중에서 모델이 Positive라고 잡아낸 비율이에요.' },
        { t: 'f1-score', d: 'Precision과 Recall의 조화평균이에요. 둘 다 높아야 F1도 높아요.' },
      ],
      why:
        '실무에서 암 진단 모델의 정확도가 99%여도, 실제 암 환자를 모두 놓친다면(recall=0) 그 모델은 무가치해요. F1으로 균형을 봐야 해요.',
      expectedOutput:
        '예시 (스팸/일반 분류):\n' +
        '[평가] 분류 리포트:\n' +
        '              precision    recall  f1-score   support\n' +
        '       normal       0.96      0.98      0.97       100\n' +
        '         spam       0.90      0.85      0.87        20\n' +
        '    accuracy                           0.95       120\n' +
        '   macro avg       0.93      0.91      0.92       120\n' +
        'weighted avg       0.95      0.95      0.95       120',
      realWorldUsage:
        '실제 금융 사기 탐지 시스템에서 "사기 거래의 recall이 95% 이상이어야 한다"는 비즈니스 요구사항을 classification_report로 검증하고, 기준을 통과할 때까지 모델을 개선해요.',
      pitfall: 'labels 목록의 순서가 모델의 classes_ 순서와 일치하지 않으면 target_names가 엉뚱한 클래스에 붙어서 리포트가 잘못된 정보를 보여줘요.',
    },
  },
  {
    id: 'pml-confusion-matrix',
    lang: 'python',
    title: '혼동 행렬: confusion_matrix',
    file: 'confusion.py',
    code: `from sklearn.metrics import confusion_matrix, ConfusionMatrixDisplay

pred = model.predict(X_test)
cm = confusion_matrix(y_test, pred)
print(f"[결과] 혼동 행렬:")
print(cm)
disp = ConfusionMatrixDisplay(cm)
disp.plot()
print(f"[정보] 행=실제, 열=예측")`,
    explain: {
      concept:
        '혼동 행렬(Confusion Matrix)은 "어떤 클래스를 어떤 클래스로 착각했는지"를 표로 보여줘요. ' +
        '행은 실제 정답, 열은 모델의 예측이에요. 대각선은 맞춘 경우, 대각선 밖은 틀린 경우예요. ' +
        '정확도만 봤을 때 95%라고 해도, 특정 클래스만 집중적으로 틀리고 있다면 혼동 행렬에서 바로 드러나요. ' +
        'ConfusionMatrixDisplay로 행렬을 시각화하면 패턴을 더 직관적으로 파악할 수 있어요.',
      terms: [
        { t: 'confusion_matrix(y_test, pred)', d: '실제 정답과 예측값을 비교해 혼동 행렬(2D 배열)을 생성해요.' },
        { t: 'cm[i][j]', d: '실제 클래스 i인데 모델이 클래스 j로 예측한 개수예요.' },
        { t: 'ConfusionMatrixDisplay(cm)', d: '혼동 행렬을 히트맵 이미지로 시각화하는 도구예요.' },
        { t: 'disp.plot()', d: '행렬 시각화를 화면에 그려줘요.' },
      ],
      why:
        '실무에서 "개 vs 고양이 분류기"의 정확도가 95%여도, 혼동 행렬을 보면 "모든 고양이를 개로 착각하고 있다"는 심각한 문제를 발견할 수 있어요.',
      expectedOutput:
        '예시 (2클래스):\n' +
        '[결과] 혼동 행렬:\n' +
        '[[95  5]\n' +
        ' [ 8 92]]\n' +
        '[정보] 행=실제, 열=예측\n' +
        '(ConfusionMatrixDisplay가 히트맵 그래프를 화면에 그림)',
      realWorldUsage:
        '실제 품질 검사 자동화에서 "정상품을 불량으로 판정(과잉 검출) vs 불량을 정상으로 판정(미검출)"의 비용이 완전히 다르기 때문에, 혼동 행렬로 두 오류를 분리해서 분석해요.',
      pitfall: '행/열 중 어느 쪽이 실제(Actual)이고 어느 쪽이 예측(Predicted)인지 헷갈리면 해석이 완전히 반대가 돼요. 행=실제, 열=예측이 표준이에요.',
    },
  },
  {
    id: 'pml-random-forest',
    lang: 'python',
    title: '랜덤 포레스트 분류',
    file: 'rf.py',
    code: `from sklearn.ensemble import RandomForestClassifier

rf = RandomForestClassifier(
  n_estimators=200, max_depth=None, n_jobs=-1, random_state=42
)
rf.fit(X_train, y_train)
score = rf.score(X_test, y_test)
print(f"[결과] RandomForest 정확도: {score:.4f}")
print(f"[정보] 트리 개수=200, 병렬(n_jobs=-1)")`,
    explain: {
      concept:
        '랜덤 포레스트는 여러 개의 결정 트리(Decision Tree)를 만들고, 각 트리의 예측을 다수결로 합쳐서 최종 결정을 내리는 앙상블 모델이에요. ' +
        '한 명의 전문가보다 여러 명이 투표하는 게 더 정확한 것과 같은 원리예요. ' +
        '각 트리는 데이터의 일부만 보고, 특성의 일부만 사용해서 서로 다른 관점을 배우도록 설계돼요. ' +
        'n_estimators=200은 200개의 트리를 만든다는 뜻이고, n_jobs=-1은 모든 CPU 코어를 병렬로 사용해서 학습을 빨리 해줘요. ' +
        '정형 데이터(테이블 형태)에서는 XGBoost와 함께 가장 먼저 시도하는 강력한 베이스라인 모델이에요.',
      terms: [
        { t: 'RandomForestClassifier(n_estimators=200)', d: '200개 트리의 투표로 분류하는 앙상블 모델을 생성해요.' },
        { t: 'n_estimators', d: '생성할 결정 트리의 개수예요. 많을수록 안정적이지만 학습 시간이 늘어나요.' },
        { t: 'n_jobs=-1', d: '사용 가능한 모든 CPU 코어로 병렬 학습해요. -1은 "전부 사용"이에요.' },
        { t: 'max_depth=None', d: '각 트리가 과적합될 때까지 끝까지 자라도록 허용해요. None이면 제한 없음.' },
      ],
      why:
        '실무에서 정형 데이터 분류 문제의 첫 번째 시도는 거의 항상 랜덤 포레스트예요. 튜닝 없이도 준수한 성능이 나오고, 특성 중요도를 바로 볼 수 있어서 해석도 쉬워요.',
      expectedOutput:
        '예시:\n' +
        '[결과] RandomForest 정확도: 0.9625\n' +
        '[정보] 트리 개수=200, 병렬(n_jobs=-1)',
      realWorldUsage:
        '실제 은행 대출 심사 시스템에서 "신청자의 소득, 신용등급, 직업, 나이" 등을 보고 대출 승인 여부를 랜덤 포레스트로 예측해요. 특성 중요도로 "신용등급이 가장 중요하다" 같은 해석을 바로 제공할 수 있어요.',
      pitfall: 'n_estimators를 너무 적게(기본값 100 이하) 하면 투표 수가 부족해 예측이 불안정해질 수 있어요. 보통 200~500을 추천해요.',
    },
  },
  {
    id: 'pml-svm-classifier',
    lang: 'python',
    title: 'Pipeline 안에서 SVC 쓰기',
    file: 'svm_pipeline.py',
    code: `from sklearn.pipeline import Pipeline
from sklearn.preprocessing import StandardScaler
from sklearn.svm import SVC

pipe = Pipeline([
  ('scaler', StandardScaler()),
  ('clf', SVC(kernel='rbf', C=1.0, random_state=42)),
])
pipe.fit(X_train, y_train)
score = pipe.score(X_test, y_test)
print(f"[결과] SVC 정확도: {score:.4f}")
print(f"[정보] kernel=rbf, C=1.0, StandardScaler 선행")`,
    explain: {
      concept:
        'SVM(Support Vector Machine)은 클래스 사이에 가장 넓은 여백(margin)을 만드는 결정 경계를 찾는 모델이에요. ' +
        'kernel="rbf"는 직선으로 분리되지 않는 데이터를 고차원 공간으로 보내서 구부러진 경계를 만들 수 있게 해줘요. ' +
        'SVM은 특성의 단위 차이에 극도로 민감해서, 반드시 표준화(StandardScaler)를 먼저 적용해야 해요. ' +
        'Pipeline으로 둘을 묶으면 "표준화 -> SVM"이 한 세트로 관리돼서, 테스트 시에도 자동으로 표준화가 먼저 적용돼요. ' +
        'C=1.0은 허용 오차를 조절하는 파라미터로, 클수록 훈련 데이터에 엄격히 맞추고(과적합 위험), 작을수록 여유를 둬요.',
      terms: [
        { t: 'SVC(kernel=\'rbf\', C=1.0)', d: 'RBF 커널을 사용하는 SVM 분류기를 생성해요. C는 오차 허용도예요.' },
        { t: "kernel='rbf'", d: '방사형 기저 함수 커널로, 비선형 결정 경계를 만들 수 있게 해줘요.' },
        { t: 'C=1.0', d: '오분류 허용도예요. 클수록 훈련 데이터에 딱 맞추고(과적합 위험), 작을수록 일반화를 추구해요.' },
        { t: 'Pipeline([scaler, svc])', d: '표준화 후 SVM을 적용하는 순서를 보장하고 데이터 누수를 막아줘요.' },
        { t: 'random_state=42', d: 'SVM의 내부 난수 요소를 고정해서 재현 가능하게 해요.' },
      ],
      why:
        '실무에서 "이미지 분류"나 "텍스트 분류"처럼 특성 수가 샘플 수보다 많은 고차원 문제에서 SVM이 강력한 성능을 보여줘요. 표준화와 함께 Pipeline으로 묶는 것이 표준 방식이에요.',
      expectedOutput:
        '예시:\n' +
        '[결과] SVC 정확도: 0.9750\n' +
        '[정보] kernel=rbf, C=1.0, StandardScaler 선행',
      realWorldUsage:
        '실제 손글씨 숫자 인식(MNIST)에서 SVM을 쓸 때, 픽셀 값(0~255)을 StandardScaler로 표준화한 뒤 rbf 커널로 분류하는 파이프라인이 높은 정확도를 보여줘요.',
      pitfall: '표준화 없이 SVM을 바로 쓰면, 값이 큰 특성 하나가 결정 경계를 완전히 지배해버려서 모델 성능이 급격히 떨어져요.',
    },
  },
  {
    id: 'pml-feature-importance',
    lang: 'python',
    title: '특성 중요도 보기',
    file: 'importance.py',
    code: `import pandas as pd

# rf는 이미 학습된 RandomForestClassifier라고 가정해요
rf.fit(X_train, y_train)
imp = pd.Series(rf.feature_importances_, index=X_train.columns)
top5 = imp.sort_values(ascending=False).head(5)
print(f"[결과] 상위 5개 특성 중요도:")
print(top5)`,
    explain: {
      concept:
        'feature_importances_는 랜덤 포레스트가 각 특성을 판단에 얼마나 사용했는지 0~1 사이의 점수로 수치화한 값이에요. ' +
        '트리가 분기할 때 어떤 특성이 불순도를 가장 많이 줄였는지 누적해 계산해요. ' +
        '모든 중요도를 합치면 1.0이 돼요. 0.3이면 "이 특성이 결정의 30%를 좌우했다"는 의미예요. ' +
        '실무에서는 중요도가 낮은 특성을 제거해서 모델을 단순화하거나, 비즈니스 담당자에게 "무엇이 결과에 가장 큰 영향을 주는지" 설명할 때 써요.',
      terms: [
        { t: 'rf.feature_importances_', d: '각 특성의 중요도 점수(0~1)를 담은 NumPy 배열이에요. 학습 후에만 접근 가능해요.' },
        { t: 'pd.Series(..., index=X_train.columns)', d: '중요도 점수에 특성 이름을 인덱스로 붙여서 Series로 만들어요.' },
        { t: 'sort_values(ascending=False)', d: '중요도가 높은 순서로 정렬해요.' },
        { t: '.head(5)', d: '상위 5개 특성만 간추려서 보여줘요.' },
      ],
      why:
        '실무에서 "이 고객이 이탈할 가능성을 가장 크게 높이는 요인은 무엇인가?"라는 질문에 답하려면 특성 중요도를 분석해서 "최근 30일 접속 횟수" 같은 핵심 특성을 찾아내요.',
      expectedOutput:
        '예시:\n' +
        '[결과] 상위 5개 특성 중요도:\n' +
        'recent_login_count    0.285\n' +
        'subscription_months   0.210\n' +
        'avg_session_time      0.155\n' +
        'support_tickets       0.128\n' +
        'age                   0.092\n' +
        'dtype: float64',
      realWorldUsage:
        '실제 마케팅팀에 "고객 이탈에 가장 큰 영향을 주는 3가지 요인은 무엇인가요?"라고 질문받았을 때, 특성 중요도로 상위 3개를 추출해서 리포트로 제공해요.',
      pitfall: '서로 강한 상관관계가 있는 특성이 여러 개면 중요도가 그들 사이에 쪼개져서 각각은 작아 보일 수 있어요. 특성 그룹 단위로 해석해야 정확해요.',
    },
  },
  {
    id: 'pml-xgboost-basic',
    lang: 'python',
    title: 'XGBoost 기본 분류',
    file: 'xgb.py',
    code: `from xgboost import XGBClassifier
from sklearn.metrics import accuracy_score

model = XGBClassifier(n_estimators=300, learning_rate=0.1, max_depth=4, random_state=42)
model.fit(X_train, y_train)
pred = model.predict(X_test)
acc = accuracy_score(y_test, pred)
print(f"[결과] XGBoost 정확도: {acc:.4f}")
print(f"[정보] 트리=300, 학습률=0.1, 깊이=4")`,
    explain: {
      concept:
        'XGBoost는 랜덤 포레스트와 달리 트리를 순차적으로 만들면서, 이전 트리가 틀린 부분을 다음 트리가 집중적으로 보완하는 부스팅(Boosting) 알고리즘이에요. ' +
        '마치 선생님이 "틀린 문제만 다시 풀어봐"라고 하는 것과 같아요. learning_rate=0.1은 한 번에 10%씩만 보정해서 천천히, 하지만 정확하게 배우는 방식이에요. ' +
        '정형 데이터에서 가장 높은 정확도를 보여주는 경우가 많아서, Kaggle 대회와 실무 모두에서 가장 널리 쓰이는 모델이에요.',
      terms: [
        { t: 'XGBClassifier(n_estimators=300)', d: '300개의 트리를 순차적으로 학습하는 부스팅 모델이에요.' },
        { t: 'learning_rate=0.1', d: '각 트리가 보정하는 강도예요. 작을수록 천천히 배우지만 정밀해져요.' },
        { t: 'max_depth=4', d: '각 트리의 최대 깊이예요. 3~6 사이가 일반적이며, 너무 깊으면 과적합돼요.' },
        { t: 'accuracy_score(y_test, pred)', d: '실제 정답과 예측값을 비교해 정확도를 계산해요.' },
      ],
      why:
        '실무에서 정형 데이터 분류 문제의 최종 성능을 끌어올릴 때 XGBoost가 가장 자주 선택돼요. 기본 설정만으로도 랜덤 포레스트를 보통 1~3% 이상 능가해요.',
      expectedOutput:
        '예시:\n' +
        '[결과] XGBoost 정확도: 0.9785\n' +
        '[정보] 트리=300, 학습률=0.1, 깊이=4',
      realWorldUsage:
        '실제 Kaggle 대회에서 상위권 솔루션의 70% 이상이 XGBoost나 그 변형(LightGBM, CatBoost)을 사용해요. 금융, 마케팅, 의료 등 거의 모든 정형 데이터 도메인에서 최상위 성능을 보여줘요.',
      pitfall: 'learning_rate가 너무 크면(>0.3) 보폭이 커서 최적점을 지나쳐버리고, 너무 작으면(<0.01) 수천 개의 트리가 필요해서 학습이 느려져요.',
    },
  },
  {
    id: 'pml-xgboost-early-stopping',
    lang: 'python',
    title: 'XGBoost 조기 종료',
    file: 'xgb_early.py',
    code: `from xgboost import XGBClassifier
from sklearn.model_selection import train_test_split

X_train2, X_val, y_train2, y_val = train_test_split(
  X_train, y_train, test_size=0.1, random_state=42
)
model = XGBClassifier(n_estimators=1000, learning_rate=0.05, early_stopping_rounds=20)
model.fit(X_train2, y_train2, eval_set=[(X_val, y_val)], verbose=False)
print(f"[결과] 최적 트리 수 (best_iteration): {model.best_iteration}")
print(f"[정보] early_stopping_rounds=20 - 20번 연속 미개선 시 중단")`,
    explain: {
      concept:
        '조기 종료(Early Stopping)는 검증 데이터에 대한 성능이 더 이상 향상되지 않으면 알아서 학습을 멈추는 장치예요. ' +
        'n_estimators=1000으로 넉넉하게 설정해두고, eval_set으로 검증 데이터의 성능을 지켜봐요. ' +
        '20번 연속으로 성능이 좋아지지 않으면 "여기까지가 최선이야"라고 판단하고 학습을 중단해요. ' +
        '이렇게 하면 과적합되기 전에 알아서 멈추고, best_iteration으로 최적의 트리 개수를 알 수 있어요. ' +
        '검증 세트는 반드시 훈련 데이터에서 따로 떼어낸 것이어야 하며, 절대 테스트 데이터를 eval_set에 넣으면 안 돼요.',
      terms: [
        { t: 'early_stopping_rounds=20', d: '20번 연속으로 검증 점수가 개선되지 않으면 학습을 중단해요.' },
        { t: 'eval_set=[(X_val, y_val)]', d: '에폭마다 성능을 평가할 검증 데이터 세트예요.' },
        { t: 'X_val, y_val', d: '훈련 데이터에서 10%를 따로 떼어낸 검증 세트예요. 테스트 세트와는 별개예요.' },
        { t: 'best_iteration', d: '가장 검증 점수가 높았을 때의 트리 개수예요. 학습 완료 후 확인할 수 있어요.' },
        { t: 'verbose=False', d: '학습 중간의 상세 로그 출력을 끄는 옵션이에요.' },
      ],
      why:
        '실무에서 트리를 무턱대고 많이 만들면 과적합돼서 오히려 테스트 성능이 떨어져요. early_stopping으로 모델이 스스로 "여기까지!" 하고 멈추게 해서 최적 상태를 찾아요.',
      expectedOutput:
        '예시:\n' +
        '[결과] 최적 트리 수 (best_iteration): 247\n' +
        '[정보] early_stopping_rounds=20 - 20번 연속 미개선 시 중단',
      realWorldUsage:
        '실제 프로덕션 모델 학습 파이프라인에서 early_stopping을 쓰면, 매번 트리 개수를 수동으로 튜닝하지 않아도 데이터 특성에 맞는 최적의 복잡도를 자동으로 찾아줘요.',
      pitfall: 'eval_set에 최종 테스트 데이터(X_test)를 넣으면, 테스트 데이터 정보가 학습 결정에 유입되는 치명적 데이터 누수가 발생해요. 반드시 훈련 데이터에서 분리한 별도 검증 세트를 써야 해요.',
    },
  },
  {
    id: 'pml-lightgbm-basic',
    lang: 'python',
    title: 'LightGBM 분류',
    file: 'lgbm.py',
    code: `from lightgbm import LGBMClassifier
from sklearn.metrics import accuracy_score

model = LGBMClassifier(
  n_estimators=300, learning_rate=0.1, num_leaves=31, random_state=42
)
model.fit(X_train, y_train)
pred = model.predict(X_test)
acc = accuracy_score(y_test, pred)
print(f"[결과] LightGBM 정확도: {acc:.4f}")
print(f"[정보] 트리=300, 잎=31, 학습률=0.1")`,
    explain: {
      concept:
        'LightGBM은 Microsoft에서 개발한 그래디언트 부스팅 프레임워크로, XGBoost와 같은 부스팅 계열이지만 훨씬 빠르고 메모리를 적게 써요. ' +
        '가장 큰 차이는 트리를 "잎 단위(leaf-wise)"로 확장한다는 점이에요. XGBoost가 레벨 전체를 균일하게 확장하는 반면, LightGBM은 손실을 가장 많이 줄이는 잎 하나만 골라서 깊게 확장해요. ' +
        '이 방식 덕분에 같은 성능을 훨씬 적은 연산으로 달성할 수 있고, 대용량 데이터에서 특히 빛을 발해요.',
      terms: [
        { t: 'LGBMClassifier(n_estimators=300)', d: '300개 트리를 순차 학습하는 LightGBM 분류기예요.' },
        { t: 'num_leaves=31', d: '하나의 트리가 가질 수 있는 최대 잎(끝마디) 개수예요. 복잡도를 결정해요.' },
        { t: 'learning_rate=0.1', d: '한 번에 학습하는 보폭이에요. 작을수록 정밀하지만 더 많은 트리가 필요해요.' },
        { t: 'accuracy_score(y_test, pred)', d: '예측값과 실제 정답을 비교해 정확도를 계산하는 함수예요.' },
      ],
      why:
        '실무에서 수백만 건 이상의 대용량 데이터를 다룰 때, LightGBM은 XGBoost보다 학습 속도가 수 배 빠르면서도 비슷한 정확도를 보여줘서 대규모 프로젝트에서 선호돼요.',
      expectedOutput:
        '예시:\n' +
        '[결과] LightGBM 정확도: 0.9790\n' +
        '[정보] 트리=300, 잎=31, 학습률=0.1',
      realWorldUsage:
        '실제 대규모 광고 클릭 예측(CTR) 시스템에서 하루 수억 건의 로그 데이터로 LightGBM을 학습시킬 때, 학습 속도가 XGBoost 대비 3~5배 빨라서 짧은 주기로 모델을 업데이트할 수 있어요.',
      pitfall: 'num_leaves를 너무 크게(>100) 설정하면 트리가 과도하게 복잡해져서 과적합될 위험이 커져요. 보통 31~63 사이로 시작하는 게 안전해요.',
    },
  },
  {
    id: 'pml-lightgbm-categorical',
    lang: 'python',
    title: 'LightGBM 범주형 특성',
    file: 'lgbm_cat.py',
    code: `from lightgbm import LGBMClassifier

cat_cols = ['city', 'job']
X_train[cat_cols] = X_train[cat_cols].astype('category')
X_test[cat_cols] = X_test[cat_cols].astype('category')
model = LGBMClassifier(random_state=42)
model.fit(X_train, y_train, categorical_feature=cat_cols)
score = model.score(X_test, y_test)
print(f"[결과] LightGBM 정확도 (범주형 직접 사용): {score:.4f}")
print(f"[정보] 범주형 열: {cat_cols}")`,
    explain: {
      concept:
        'LightGBM은 범주형 특성을 원핫인코딩 없이 직접 처리할 수 있는 특별한 기능이 있어요. ' +
        'Pandas의 category 타입으로 변환한 열을 categorical_feature로 지정해주면, ' +
        'LightGBM이 내부적으로 범주 값들을 비슷한 것끼리 자동으로 묶어서 최적의 분기점을 찾아요. ' +
        '원핫인코딩을 하면 범주 개수만큼 열이 늘어나서 메모리 사용량이 폭증하는데, 이 기능을 쓰면 열 개수가 그대로라서 메모리와 속도 모두에서 큰 이점이 있어요. ' +
        '고유 값이 많은 범주(예: 우편번호, 상품ID)를 다룰 때 특히 효과적이에요.',
      terms: [
        { t: "astype('category')", d: 'Pandas 열을 범주형 데이터 타입으로 변환해요. 메모리를 절약해줘요.' },
        { t: 'categorical_feature=cat_cols', d: 'LightGBM에 "이 열들은 범주형이니 직접 처리해줘"라고 알려줘요.' },
        { t: 'cat_cols', d: '범주형으로 처리할 열 이름들의 리스트예요.' },
        { t: 'model.score(X_test, y_test)', d: 'LightGBM 모델의 score()는 분류에서 기본적으로 정확도를 반환해요.' },
      ],
      why:
        '실무에서 "상품 카테고리(수천 개)", "지역 코드(수백 개)" 같은 고유값이 많은 범주를 원핫인코딩하면 열이 수천 개로 폭증해 학습이 불가능해져요. LightGBM의 범주형 직접 처리가 필수예요.',
      expectedOutput:
        '예시:\n' +
        '[결과] LightGBM 정확도 (범주형 직접 사용): 0.9650\n' +
        "[정보] 범주형 열: ['city', 'job']",
      realWorldUsage:
        '실제 추천 시스템에서 "사용자 ID(수백만 개)"를 범주형 특성으로 직접 LightGBM에 넣어서, 원핫인코딩 대비 메모리를 1/1000로 줄이고 학습 속도를 수십 배 높여요.',
      pitfall: 'X_train과 X_test 모두 같은 category 타입으로 변환해야 해요. 한쪽만 변환하면 dtype 불일치로 예측 오류가 발생할 수 있어요.',
    },
  },
  {
    id: 'pml-linear-regression',
    lang: 'python',
    title: '선형 회귀: LinearRegression',
    file: 'linreg.py',
    code: `from sklearn.linear_model import LinearRegression

reg = LinearRegression()
reg.fit(X_train, y_train)
print(f"[결과] 회귀 계수: {reg.coef_[:3]}")
print(f"[결과] 절편: {reg.intercept_:.4f}")
r2 = reg.score(X_test, y_test)
print(f"[결과] R² 결정계수: {r2:.4f}")`,
    explain: {
      concept:
        '선형 회귀는 여러 특성(입력)에 각각 가중치를 곱하고 더해서 하나의 연속 값(출력)을 예측하는 가장 단순한 회귀 모델이에요. ' +
        'coef_는 각 특성의 가중치(기울기)로, "이 특성이 1단위 증가하면 예측값이 이만큼 변한다"고 해석할 수 있어서 투명한 설명이 가능해요. ' +
        'intercept_는 모든 특성이 0일 때의 기본 예측값(편향)이에요. ' +
        'R²는 0~1 사이 값으로, 1에 가까울수록 모델이 데이터 변동을 잘 설명한다는 뜻이에요. R²=0.8은 "데이터 변동의 80%를 모델이 설명한다"는 의미예요.',
      terms: [
        { t: 'LinearRegression()', d: '최소제곱법으로 가중치를 학습하는 선형 회귀 모델을 생성해요.' },
        { t: 'reg.coef_', d: '각 특성의 가중치(기울기) 배열이에요. 특성별 영향력의 방향과 크기를 보여줘요.' },
        { t: 'reg.intercept_', d: 'y절편(편향) 값이에요. 모든 특성이 0일 때의 기본 예측값이에요.' },
        { t: 'reg.score(X_test, y_test)', d: '회귀에서는 R²(결정계수)를 반환해요. 분류의 accuracy와는 완전히 다른 지표예요.' },
      ],
      why:
        '실무에서 "왜 이런 예측이 나왔는지 설명해야 하는" 규제 산업(금융, 의료)에서는 해석 불가능한 블랙박스 모델 대신 선형 회귀를 의도적으로 선택해요.',
      expectedOutput:
        '예시 (3개 특성):\n' +
        '[결과] 회귀 계수: [ 2.34 -1.57  0.89]\n' +
        '[결과] 절편: 10.5234\n' +
        '[결과] R² 결정계수: 0.8720',
      realWorldUsage:
        '실제 보험사에서 "나이, 운전 경력, 차종" 등으로 보험료를 산정할 때 선형 회귀를 써요. "운전 경력 1년 증가 = 보험료 5만원 감소"처럼 각 요인의 영향력을 투명하게 설명할 수 있어야 해서예요.',
      pitfall: '특성 간에 강한 상관관계(다중공선성)가 있으면 회귀 계수가 불안정해져서, 작은 데이터 변화에도 가중치가 크게 튀어요. VIF(분산팽창계수)로 진단할 수 있어요.',
    },
  },
  {
    id: 'pml-regression-metrics',
    lang: 'python',
    title: '회귀 평가 지표: MSE / R2',
    file: 'reg_metrics.py',
    code: `from sklearn.metrics import mean_squared_error, r2_score

pred = reg.predict(X_test)
mse = mean_squared_error(y_test, pred)
r2 = r2_score(y_test, pred)
print(f"[결과] MSE (평균제곱오차): {mse:.4f}")
print(f"[결과] R² (결정계수): {r2:.4f}")
print(f"[정보] MSE가 작을수록, R²가 1에 가까울수록 좋아요")`,
    explain: {
      concept:
        '회귀 문제에서는 분류의 정확도(accuracy)를 쓸 수 없어서, 예측값과 실제값의 차이를 측정하는 전용 지표들이 필요해요. ' +
        'MSE(Mean Squared Error)는 (실제값 - 예측값)²의 평균으로, 0에 가까울수록 예측이 정확하다는 뜻이에요. ' +
        '제곱을 하기 때문에 큰 오차에 더 큰 페널티를 줘서 이상치에 민감해요. ' +
        'R²는 "그냥 평균값으로 예측하는 모델"보다 얼마나 설명력이 좋은지를 0~1 사이로 보여줘요. R²=0이면 평균 예측과 동일한 수준, 1이면 완벽한 예측이에요.',
      terms: [
        { t: 'mean_squared_error(y_test, pred)', d: '실제값과 예측값의 차이를 제곱해 평균낸 MSE를 계산해요.' },
        { t: 'r2_score(y_test, pred)', d: '평균 대비 모델의 설명력을 0~1로 표현한 R² 점수를 계산해요.' },
        { t: 'y_test', d: '실제 정답 값이에요. 예측값과 얼마나 차이나는지 비교하는 기준이에요.' },
        { t: 'pred', d: '모델이 예측한 값이에요. 실제값과 비교해서 오차를 계산해요.' },
      ],
      why:
        '실무에서 "이 모델의 예측 오차가 평균적으로 얼마나 되나요?"라는 질문에 MSE로 답하고, "기존 방식보다 얼마나 나아졌나요?"에는 R²로 답해요.',
      expectedOutput:
        '예시:\n' +
        '[결과] MSE (평균제곱오차): 245.6789\n' +
        '[결과] R² (결정계수): 0.8720\n' +
        '[정보] MSE가 작을수록, R²가 1에 가까울수록 좋아요',
      realWorldUsage:
        '실제 부동산 가격 예측 모델을 평가할 때 "MSE=250"이면 "평균적으로 약 15.8(√250)만큼의 오차가 있다"고 해석해서, 비즈니스 담당자에게 모델의 실용성을 판단하는 기준을 제공해요.',
      pitfall: 'MSE는 오차를 제곱해서 단위도 제곱이 돼요(가격 예측이면 "원²"이 돼요). 직관적인 해석을 위해 RMSE(√MSE)를 함께 계산해서 원래 단위로 복원하는 경우가 많아요.',
    },
  },
  {
    id: 'pml-joblib-save-load',
    lang: 'python',
    title: '모델 저장/불러오기: joblib',
    file: 'persist.py',
    code: `import joblib

joblib.dump(model, 'model.pkl')
print(f"[저장] 모델 저장 완료 -> model.pkl")
loaded = joblib.load('model.pkl')
score = loaded.score(X_test, y_test)
print(f"[로드] 모델 불러오기 완료")
print(f"[검증] 불러온 모델 정확도: {score:.4f}")`,
    explain: {
      concept:
        'joblib은 학습된 사이킷런 모델을 파일로 저장하고 다시 불러올 수 있게 해주는 직렬화 도구예요. ' +
        '모델 학습은 몇 시간씩 걸릴 수 있지만, 예측은 밀리초 단위로 끝나요. ' +
        '그래서 학습은 오프라인에서 천천히 하고, 학습된 모델을 파일로 저장한 뒤 운영 서버에 올려서 빠르게 서빙(serving)하는 게 표준 방식이에요. ' +
        'joblib은 대용량 NumPy 배열을 효율적으로 압축 저장해서 pickle보다 더 빠르고 적은 용량으로 저장할 수 있어요.',
      terms: [
        { t: 'joblib.dump(model, \'model.pkl\')', d: '학습된 모델 객체를 .pkl 파일로 압축 저장해요.' },
        { t: 'joblib.load(\'model.pkl\')', d: '저장된 파일에서 모델 객체를 복원해요.' },
        { t: 'model.pkl', d: '모델 저장 파일의 관례적 확장자예요. .pkl은 pickle 기반 포맷이에요.' },
        { t: 'loaded.score(X_test, y_test)', d: '불러온 모델로 테스트 데이터에 대해 예측 정확도를 확인해요.' },
      ],
      why:
        '실무에서 모델 학습 파이프라인과 예측 서빙 서버는 완전히 분리돼 있어요. 학습된 모델을 joblib으로 저장해서 예측 서버에 배포하는 게 표준 MLOps 패턴이에요.',
      expectedOutput:
        '예시:\n' +
        '[저장] 모델 저장 완료 -> model.pkl\n' +
        '[로드] 모델 불러오기 완료\n' +
        '[검증] 불러온 모델 정확도: 0.9725',
      realWorldUsage:
        '실제 프로덕션 환경에서는 CI/CD 파이프라인이 nightly로 모델을 학습하고 joblib으로 저장한 뒤, Flask·FastAPI 예측 서버가 이를 불러와서 REST API로 예측 결과를 제공해요.',
      pitfall: '사이킷런 버전이 다르면 저장된 모델을 불러올 때 호환성 오류가 발생할 수 있어요. 모델 배포 시 학습 환경과 동일한 라이브러리 버전을 사용해야 해요.',
    },
  },
];
