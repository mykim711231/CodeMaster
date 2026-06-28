import type { Snippet } from '../../types';

export const pythonML: Snippet[] = [
  {
    id: 'pml-train-test-split',
    lang: 'python',
    title: '데이터 나누기: train_test_split',
    file: 'split.py',
    code: `from sklearn.model_selection import train_test_split

X_train, X_test, y_train, y_test = train_test_split(
  X, y, test_size=0.2, random_state=42, stratify=y
)
print(X_train.shape, X_test.shape)`,
    explain: {
      concept: '전체 데이터를 학습용(훈련)과 시험용(테스트) 두 몫으로 나눠요. 시험용은 시험 볼 때까지 감춰뒀다가 실력(성능)을 공정하게 측정할 때 써요.',
      terms: [
        { t: 'train_test_split', d: '데이터를 학습용/시험용으로 쪼개는 함수' },
        { t: 'test_size=0.2', d: '전체의 20%를 시험용으로 떼어냄' },
        { t: 'random_state=42', d: '나누는 난수의 씨앗값(고정하면 매번 같게 나뉨)' },
        { t: 'stratify=y', d: '정답 비율이 양쪽에 같게 유지되도록 층화' },
      ],
      why: '학습에 쓴 데이터로 다시 평가하면 점수가 부풀려지기 때문에 평가용 데이터를 따로 떼어놓아요.',
      pitfall: 'stratify를 빼먹으면 희귀 클래스가 한쪽에 몰려 성능 측정이 틀릴 수 있어요.',
    },
  },
  {
    id: 'pml-fit-predict',
    lang: 'python',
    title: '모델 학습과 예측: fit / predict',
    file: 'fit_predict.py',
    code: `from sklearn.linear_model import LogisticRegression

model = LogisticRegression(max_iter=1000)
model.fit(X_train, y_train)
pred = model.predict(X_test)
print(model.score(X_test, y_test))`,
    explain: {
      concept: '모델을 한 명의 학생처럼 생각해요. fit으로 문제와 정답을 보여주고 가르치고, predict로 처음 보는 문제를 풀게 해요.',
      terms: [
        { t: 'LogisticRegression', d: '예/아니오 확률을 곡선으로 나타내는 분류 모델' },
        { t: 'fit', d: '학습 데이터를 보고 규칙(가중치)을 찾는 단계' },
        { t: 'predict', d: '학습한 규칙을 새 데이터에 적용해 정답을 추정함' },
        { t: 'score', d: '맞힌 비율(정확도)을 바로 계산해 주는 메서드' },
      ],
      why: '대부분의 사이킷런 모델이 fit/predict라는 같은 인터페이스를 써서 모델을 쉽게 바꿀 수 있어요.',
      pitfall: 'fit은 학습 데이터에만, predict/score는 시험 데이터에만 써야 공정해요.',
    },
  },
  {
    id: 'pml-standardscaler',
    lang: 'python',
    title: '표준화 전처리: StandardScaler',
    file: 'scaler.py',
    code: `from sklearn.preprocessing import StandardScaler

scaler = StandardScaler()
X_train_scaled = scaler.fit_transform(X_train)
X_test_scaled = scaler.transform(X_test)
print(X_train_scaled.mean(axis=0))`,
    explain: {
      concept: '숫자들의 단위(키는 cm, 몸무게는 kg)를 평균 0, 표준편차 1로 맞춰요. 모든 과목을 같은 척도로 환산해 비교하는 것과 같아요.',
      terms: [
        { t: 'StandardScaler', d: '평균 0, 표준편차 1로 변환하는 도구' },
        { t: 'fit_transform', d: '학습 데이터로 기준을 정하고 바로 변환' },
        { t: 'transform', d: '정해진 기준으로 시험 데이터도 변환' },
        { t: 'mean(axis=0)', d: '열(특성)별 평균 — 0에 가까워야 성공' },
      ],
      why: '거리 기반 모델(SVM, KNN)은 단위가 큰 특성에 끌려다니기 때문에 표준화가 필요해요.',
      pitfall: '시험 데이터에는 transform만 써야 해요. fit_transform을 다시 쓰면 기준이 바뀌어 정보 새기(데이터 누수)가 생겨요.',
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
print(pipe.score(X_test, y_test))`,
    explain: {
      concept: '전처리와 모델을 한 줄로 엮은 작업 순서표예요. 레시피대로 재료 손질 → 조리 → 평가까지 한 번에 돌아가요.',
      terms: [
        { t: 'Pipeline', d: '여러 처리 단계를 순서대로 묶는 컨테이너' },
        { t: "('scaler', ...)", d: '단계 이름과 변환기를 짝지어 등록' },
        { t: 'clf', d: '마지막 단계인 분류기(classifier)의 이름' },
        { t: 'pipe.fit', d: '파이프라인 안 모든 단계가 차례로 학습' },
      ],
      why: '단계를 묶으면 시험 데이터에 전처리 기준을 다시 맞추는 실수를 막을 수 있어요.',
      pitfall: '마지막 단계를 제외한 중간 단계는 transform 메서드가 있어야 해요.',
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
print(pre.fit_transform(X_train).shape)`,
    explain: {
      concept: '숫자 열과 글자 열을 각각 다르게 손질해요. 숫자는 표준화, 글자는 원핫(0/1 표시)으로 바꿔 한 테이블로 합쳐요.',
      terms: [
        { t: 'ColumnTransformer', d: '열별로 다른 변환기를 적용하는 도구' },
        { t: 'num_cols', d: '숫자형 특성 이름 목록' },
        { t: 'OneHotEncoder', d: '글자 범주를 0/1 가변수로 펼치는 도구' },
        { t: 'handle_unknown', d: '시험용에 새 범주가 나와도 무시하라는 옵션' },
      ],
      why: '현실 데이터는 숫자와 범주가 섞여 있어 한 가지 방법으로는 못 다뤄요.',
      pitfall: '열 이름 대신 열 번호를 쓰면 Pipeline을 거치면서 이름이 사라져 에러가 날 수 있어요.',
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
print(gs.best_params_, gs.best_score_)`,
    explain: {
      concept: '여러 설정값(예: 트리 개수, 깊이)을 한 격자에 놓고 다 돌려보며 가장 좋은 조합을 골라요. 시험을 여러 번 쳐서 평균으로 비교해요.',
      terms: [
        { t: 'GridSearchCV', d: '설정 격자를 모두 시도하며 교차검증하는 도구' },
        { t: 'param', d: '후보 설정값을 담은 딕셔너리' },
        { t: 'cv=5', d: '데이터를 5등분해 5번 검증' },
        { t: 'best_params_', d: '가장 성능이 좋았던 설정값 결과' },
      ],
      why: '사람이 감으로 설정을 고르기보다 여러 후보를 자동으로 비교하려고 해요.',
      pitfall: '후보가 많으면 시간이 폭발해요. 적당히 좁혀서 돌려야 해요.',
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
print(scores, scores.mean())`,
    explain: {
      concept: '데이터를 여러 조로 나눠 번갈아가며 시험을 치러요. 한 번의 시험 운을 없애고 평균으로 실력을 편하게 재요.',
      terms: [
        { t: 'cross_val_score', d: '교차검증 점수를 배열로 돌려주는 함수' },
        { t: 'cv=5', d: '5-겹 교차검증(5-fold)' },
        { t: "scoring='accuracy'", d: '평가 지표로 정확도 사용' },
        { t: 'scores.mean()', d: '5번 점수의 평균 — 모델의 대표 점수' },
      ],
      why: 'train_test_split 한 번의 결과는 우연이 섞여 있어서 더 안정된 평균이 필요해요.',
      pitfall: 'cv 함수 안에서 다시 모델을 복제해 쓰므로 fit된 상태가 바깥에 남지 않아요.',
    },
  },
  {
    id: 'pml-stratified-kfold',
    lang: 'python',
    title: '비율 유지 검증: StratifiedKFold',
    file: 'stratified.py',
    code: `from sklearn.model_selection import StratifiedKFold

skf = StratifiedKFold(n_splits=5, shuffle=True, random_state=42)
for fold, (tr_idx, va_idx) in enumerate(skf.split(X, y)):
  print(fold, len(tr_idx), len(va_idx))`,
    explain: {
      concept: '각 조마다 정답 비율이 원본과 같게 유지돼요. 반반 사탕을 여러 봉지에 나눌 때 봉지마다 비율이 같게 담는 것과 같아요.',
      terms: [
        { t: 'StratifiedKFold', d: '정답 비율을 유지하며 데이터를 나누는 도구' },
        { t: 'n_splits=5', d: '5개 조로 나눔' },
        { t: 'shuffle=True', d: '나누기 전에 데이터를 섞음' },
        { t: 'tr_idx, va_idx', d: '각 폴드의 학습/검증 행 인덱스' },
      ],
      why: '불균형 데이터(한 클래스가 적을 때)에서 일반 KFold를 쓰면 어떤 조엔 아예 그 클래스가 없을 수 있어요.',
      pitfall: 'StratifiedKFold는 분류용이에요. 회귀에는 KFold나 회귀용 분할기를 써야 해요.',
    },
  },
  {
    id: 'pml-classification-report',
    lang: 'python',
    title: '분류 평가표: classification_report',
    file: 'report.py',
    code: `from sklearn.metrics import classification_report

pred = model.predict(X_test)
print(classification_report(y_test, pred, target_names=labels))`,
    explain: {
      concept: '정밀도와 재현율, F1을 한 표로 보여줘요. 시험에서 맞힌 것 중 진짜 정답 비율, 놓치지 않은 비율을 같이 보는 거예요.',
      terms: [
        { t: 'classification_report', d: '클래스별 평가 지표를 표로 출력하는 함수' },
        { t: 'precision', d: '정답이라 한 것 중 실제 정답인 비율' },
        { t: 'recall', d: '실제 정답 중 잡아낸 비율' },
        { t: 'f1-score', d: '정밀도와 재현율의 조화평균' },
        { t: 'target_names', d: '클래스 번호 대신 보여줄 이름 목록' },
      ],
      why: '정확도만 보면 희귀 클래스를 무시하는 모델도 점수가 높아 보여서 더 세밀한 지표가 필요해요.',
      pitfall: 'labels 순서가 실제 클래스 번호와 안 맞으면 이름이 잘못 붙어요.',
    },
  },
  {
    id: 'pml-confusion-matrix',
    lang: 'python',
    title: '헷갈림 표: confusion_matrix',
    file: 'confusion.py',
    code: `from sklearn.metrics import confusion_matrix, ConfusionMatrixDisplay

cm = confusion_matrix(y_test, pred)
print(cm)
disp = ConfusionMatrixDisplay(cm)
disp.plot()`,
    explain: {
      concept: '정답과 예측을 만난 자리표처럼 표시해요. 정답/오답이 어디에 몰려 있는지 한눈에 봐요.',
      terms: [
        { t: 'confusion_matrix', d: '정답 vs 예측의 교차표를 만드는 함수' },
        { t: 'cm', d: '2차원 배열 행=정답, 열=예측' },
        { t: 'ConfusionMatrixDisplay', d: '표를 그림으로 그려주는 도구' },
        { t: 'disp.plot', d: '혼동행렬 그림을 화면에 그림' },
      ],
      why: '어떤 클래스끼리 헷갈리는지 패턴을 봐야 모델을 개선할 수 있어요.',
      pitfall: '행/열이 정답/예측인지 순서를 헷갈리면 해석이 반대로 돼요.',
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
print(rf.score(X_test, y_test))`,
    explain: {
      concept: '여러 결정 트리(상자도형으로 묻는 20질문 게임)를 모아 다수결로 정해요. 한 명의 의견이 틀려도 의회 투표로 안정되는 것과 같아요.',
      terms: [
        { t: 'RandomForestClassifier', d: '여러 트리의 투표로 분류하는 모델' },
        { t: 'n_estimators', d: '트리 개수(의원 수)' },
        { t: 'n_jobs=-1', d: '모든 CPU 코어를 사용' },
        { t: 'max_depth=None', d: '트리를 끝까지 가도록 허용' },
      ],
      why: '단일 트리는 쉽게 과적합되지만 트리를 모으면 예측이 안정돼요.',
      pitfall: 'n_estimators를 너무 적게 하면 투표 수가 부족해 불안정해요.',
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
print(pipe.score(X_test, y_test))`,
    explain: {
      concept: '표준화와 SVM 분류기를 Pipeline으로 묶어요. SVM은 클래스 사이 가장 넓은 여백의 경계선을 그리는데, 반드시 표준화가 먼저 이루어져야 해요.',
      terms: [
        { t: 'Pipeline', d: '전처리와 모델을 순서대로 묶는 컨테이너' },
        { t: 'StandardScaler', d: '특성 값을 평균 0, 표준편차 1로 맞추는 도구' },
        { t: 'SVC', d: '분류용 서포트 벡터 머신 — 가장 넓은 여백의 경계를 찾음' },
        { t: "kernel='rbf'", d: '방사형 기저 함수로 곡면 경계를 만드는 커널' },
        { t: 'C=1.0', d: '오류 허용도(크면 엄격, 작으면 유연)' },
      ],
      why: 'Pipeline으로 묶으면 표준화 기준이 학습 데이터에서만 계산되어 데이터 누수를 막을 수 있어요.',
      pitfall: '표준화 없이 SVC를 쓰면 단위가 큰 특성에 경계가 쏠려 제대로 학습이 안 돼요.',
    },
  },
  {
    id: 'pml-feature-importance',
    lang: 'python',
    title: '특성 중요도 보기',
    file: 'importance.py',
    code: `import pandas as pd

rf.fit(X_train, y_train)
imp = pd.Series(rf.feature_importances_, index=X_train.columns)
print(imp.sort_values(ascending=False).head(10))`,
    explain: {
      concept: '모델이 어떤 특성을 판단에 많이 썼는지 점수를 매겨요. 요리에서 어떤 재료가 맛을 더 좌우했는지 보는 것과 같아요.',
      terms: [
        { t: 'feature_importances_', d: '각 특성의 기여도 점수 배열' },
        { t: 'pd.Series', d: '이름(인덱스)이 있는 1차원 데이터' },
        { t: 'index', d: '각 점수에 특성 이름을 붙임' },
        { t: 'sort_values', d: '값 기준으로 정렬' },
      ],
      why: '중요 특성만 남기면 모델이 단순해지고 성능도 오를 수 있어요.',
      pitfall: '상관성 높은 특성이 여러 개면 중요도가 쪼개져서 하나가 작아 보일 수 있어요.',
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
print(accuracy_score(y_test, pred))`,
    explain: {
      concept: '트리를 차례로 만들되 이전 트리의 틀린 부분을 다음 트리가 보완해요. 선생님이 틀린 문제만 모아 다시 가르치는 것과 같아요.',
      terms: [
        { t: 'XGBClassifier', d: '그래디언트 부스팅 분류 모델' },
        { t: 'n_estimators', d: '트리 개수(가르치는 횟수)' },
        { t: 'learning_rate', d: '한 번에 얼마나 보폭을 줄여 학습할지' },
        { t: 'max_depth', d: '개별 트리의 최대 깊이' },
        { t: 'accuracy_score', d: '정확도를 계산하는 함수' },
      ],
      why: '정형 데이터에서 흔히 가장 높은 정확도를 내는 강한 모델이에요.',
      pitfall: 'learning_rate가 너무 크면 튕겨 지나치고, 너무 작으면 트리가 많이 필요해요.',
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
print(model.best_iteration)`,
    explain: {
      concept: '점수가 더 안 좋아지면 학습을 멈춰요. 학생이 더 이상 실력이 안 오르면 복습을 멈추는 것과 같아요.',
      terms: [
        { t: 'early_stopping_rounds=20', d: '20번 연속 향상이 없으면 멈춤' },
        { t: 'X_val', d: '학습 종료 시점을 감시하는 별도 검증 세트' },
        { t: 'eval_set', d: '성능을 감시할 데이터 세트 목록' },
        { t: 'verbose=False', d: '중간 로그를 끔' },
        { t: 'best_iteration', d: '가장 좋았던 트리 개수 시점' },
      ],
      why: '트리를 너무 많이 만들면 과적합되므로 별도 검증 세트로 감시하며 알아서 멈추게 해요.',
      pitfall: 'eval_set에 최종 테스트 데이터(X_test)를 넣으면 테스트 정보가 학습 결정에 새어 들어가는 데이터 누수가 발생해요. 반드시 별도의 검증 세트(X_val)를 써야 해요.',
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
print(accuracy_score(y_test, model.predict(X_test)))`,
    explain: {
      concept: 'XGBoost와 비슷하지만 잎 단위로 트리를 만들어 더 빨라요. 큰 데이터에서 속도가 중요할 때 좋아요.',
      terms: [
        { t: 'LGBMClassifier', d: 'LightGBM 분류 모델' },
        { t: 'num_leaves', d: '한 트리의 최대 잎(끝마디) 수' },
        { t: 'n_estimators', d: '트리 개수' },
        { t: 'learning_rate', d: '학습 보폭' },
      ],
      why: '빠르면서도 정확도가 높아 대회와 실무에서 자주 쓰여요.',
      pitfall: 'num_leaves를 너무 크게 하면 트리가 복잡해져 과적합돼요.',
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
print(model.score(X_test, y_test))`,
    explain: {
      concept: '글자 범주를 그대로 범주형으로 알려주면 모델이 순서 없는 이름끼리 묶어 처리해요. 원핫으로 펼치지 않아도 돼요.',
      terms: [
        { t: "astype('category')", d: '열을 범주형 자료형으로 변환' },
        { t: 'categorical_feature', d: '범주형 열 목록을 모델에 알림' },
        { t: 'cat_cols', d: '범주형 특성 이름 목록' },
        { t: 'score', d: '분류 정확도를 바로 반환' },
      ],
      why: '원핫을 안 쓰면 열이 적게 늘어나서 속도와 메모리가 좋아져요.',
      pitfall: '학습 데이터(X_train)뿐만 아니라 테스트 데이터(X_test)도 반드시 같은 category 자료형으로 바꿔야 해요. dtype이 다르면 잘못된 예측 또는 오류가 발생해요.',
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
print(reg.coef_, reg.intercept_)
print(reg.score(X_test, y_test))`,
    explain: {
      concept: '여러 특성에 가중치를 곱해 더해 정답을 맞추는 직선을 그려요. 요리 레시피의 재료 비중을 정하는 것과 같아요.',
      terms: [
        { t: 'LinearRegression', d: '직선(초평면)으로 예측하는 회귀 모델' },
        { t: 'coef_', d: '각 특성의 가중치(기울기) 배열' },
        { t: 'intercept_', d: 'y절편(편향)' },
        { t: 'score', d: '회귀에서는 R^2 결정계수를 반환' },
      ],
      why: '해석이 쉽고 빠르며, 특성 영향력을 가중치로 바로 볼 수 있어요.',
      pitfall: '특성끼리 강하게 겹치면(다중공선성) 가중치가 불안정해져요.',
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
print(mse, r2)`,
    explain: {
      concept: '예측이 정답에서 얼마나 빗겼는지를 점수로 매겨요. MSE는 오차의 면적, R2는 모델이 평균보다 얼마나 나은지 비율로 보여줘요.',
      terms: [
        { t: 'mean_squared_error', d: '오차 제곱의 평균(MSE)' },
        { t: 'r2_score', d: '평균 대비 설명력 비율(1에 가까울수록 좋음)' },
        { t: 'pred', d: '회귀 모델의 예측값 배열' },
        { t: 'y_test', d: '시험용 정답 배열' },
      ],
      why: '회귀는 정확도를 못 쓰므로 연속값 전용 지표가 따로 필요해요.',
      pitfall: 'MSE는 단위가 제곱이라 스케일을 직관적으로 보기 어려워요. 같은 단위의 RMSE를 따로 계산하기도 해요.',
    },
  },
  {
    id: 'pml-joblib-save-load',
    lang: 'python',
    title: '모델 저장/불러오기: joblib',
    file: 'persist.py',
    code: `import joblib

joblib.dump(model, 'model.pkl')
loaded = joblib.load('model.pkl')
print(loaded.score(X_test, y_test))`,
    explain: {
      concept: '학습한 모델을 파일로 저장해 두고 나중에 다시 불러와요. 요리 레시피를 노트에 적어두고 다음에 바로 쓰는 것과 같아요.',
      terms: [
        { t: 'joblib', d: '파이썬 객체를 빠르게 저장/불러오는 도구' },
        { t: 'dump', d: '객체를 파일로 저장' },
        { t: 'load', d: '파일에서 객체를 복원' },
        { t: 'model.pkl', d: '저장 파일 이름(.pkl)' },
      ],
      why: '학습은 느리지만 예측은 빨라야 해서, 학습 결과를 저장하고 서비스에 올려요.',
      pitfall: '불러올 때 사이킷런 버전이 달라지면 호환 에러가 날 수 있어요.',
    },
  },
];
