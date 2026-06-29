# Production AI
## Official Documentation
- [FastAPI Tutorial](https://fastapi.tiangolo.com/tutorial/)
## 핵심 개념
> FastAPI는 고성능 비동기 Python 웹 프레임워크로 `@app.get` 데코레이터와 `async def`로 엔드포인트를 정의한다. Pydantic의 `BaseModel`과 `Field`로 요청/응답 데이터 검증·직렬화를 수행하며, SQLAlchemy로 DB ORM을, Celery+Redis로 비동기 작업 큐를 구성한다. pytest·mypy·ruff로 테스트·타입 체크·린팅을 통해 프로덕션 품질을 확보한다.
## 학습 목표
- FastAPI로 REST API 엔드포인트 정의 및 `async/await` 비동기 핸들러 구현
- Pydantic BaseModel, Field로 데이터 스키마 정의 및 유효성 검증
- SQLAlchemy ORM으로 CRUD 레포지토리 및 DB 마이그레이션 관리
- Celery + Redis로 장시간 실행 작업을 비동기 Task Queue로 처리
- BackgroundTasks로 간단한 비동기 작업을 FastAPI 내에서 처리
- pytest fixtures, mocking, TestClient로 API 통합 테스트 작성
- mypy로 정적 타입 검사, ruff로 린팅·포매팅을 통한 코드 품질 관리
## 예제 코드
```python
import asyncio
from fastapi import FastAPI, BackgroundTasks, Depends, HTTPException
from pydantic import BaseModel, Field
from sqlalchemy import create_engine, Column, Integer, String
from sqlalchemy.orm import declarative_base, sessionmaker, Session
from celery import Celery

app = FastAPI()
celery_app = Celery("tasks", broker="redis://localhost:6379/0")

# Pydantic 스키마
class ItemCreate(BaseModel):
    name: str = Field(..., min_length=1, max_length=100)
    price: float = Field(..., gt=0)

class ItemResponse(ItemCreate):
    id: int
    class Config:
        from_attributes = True

# SQLAlchemy 모델
engine = create_engine("sqlite:///./items.db")
Base = declarative_base()
SessionLocal = sessionmaker(bind=engine)

class ItemModel(Base):
    __tablename__ = "items"
    id = Column(Integer, primary_key=True)
    name = Column(String(100))
    price = Column(Integer)

Base.metadata.create_all(bind=engine)

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# FastAPI 엔드포인트
@app.get("/items/{item_id}", response_model=ItemResponse)
async def get_item(item_id: int, db: Session = Depends(get_db)):
    item = db.query(ItemModel).filter(ItemModel.id == item_id).first()
    if not item:
        raise HTTPException(status_code=404, detail="Item not found")
    return item

# Celery Task
@celery_app.task
def process_item_async(item_id: int):
    import time
    time.sleep(5)  # 실제로는 AI 추론 등 무거운 작업
    return {"status": "completed", "item_id": item_id}

@app.post("/items/process/{item_id}")
async def trigger_processing(item_id: int):
    task = process_item_async.delay(item_id)
    return {"task_id": task.id, "status": "queued"}

# BackgroundTasks
@app.post("/items/", response_model=ItemResponse)
async def create_item(
    item: ItemCreate,
    background_tasks: BackgroundTasks,
    db: Session = Depends(get_db)
):
    db_item = ItemModel(**item.model_dump())
    db.add(db_item)
    db.commit()
    db.refresh(db_item)
    background_tasks.add_task(process_item_async.delay, db_item.id)
    return db_item
```

```python
# pytest 테스트 예제
from fastapi.testclient import TestClient
from main import app

client = TestClient(app)

def test_get_item():
    response = client.get("/items/1")
    assert response.status_code in (200, 404)

def test_create_item():
    response = client.post("/items/", json={"name": "Test", "price": 9.99})
    assert response.status_code == 200
    data = response.json()
    assert data["name"] == "Test"
```
## 주요 패턴
- Depends(): 의존성 주입으로 DB 세션, 인증, 권한 등을 엔드포인트에 주입
- Pydantic v2: `model_dump()`, `model_validate()`, `TypeAdapter`로 직렬화 및 검증
- Async/Sync DB: `asyncpg` + `SQLAlchemy[asyncio]`로 비동기 DB 접근
- Alembic: SQLAlchemy 모델 변경을 DB 마이그레이션으로 버전 관리
- Celery Task Group/Chain: `group()`, `chain()`으로 병렬/순차 작업 워크플로우
- Request/Response Header/Path/Query Validation: `Header()`, `Path()`, `Query()` 유효성 검증
- pytest fixture + factory: 테스트 DB 초기화와 Fixture factory로 반복 테스트 효율화
- ruff: `ruff check --fix . && ruff format .`으로 린트 오류 자동 수정 및 포매팅
## 주의사항
- `async def`에서 동기 I/O 호출(`time.sleep()`, blocking ORM) 시 이벤트 루프 블로킹 발생 → `run_in_executor()` 사용
- Celery worker가 Redis 브로커 연결을 유지하지 못하면 작업 손실 → `acks_late=True`로 신뢰성 확보
- Pydantic v1 → v2 마이그레이션 시 `from_orm` → `from_attributes`, `dict()` → `model_dump()`로 변경
- SQLAlchemy 2.0+에서는 `DeclarativeBase`로 모델 정의 방식 변경 → `Mapped[]` 타입 어노테이션 권장
- FastAPI TestClient는 `lifespan` 이벤트와 실제 이벤트 루프를 사용 → @pytest.mark.anyio로 비동기 테스트 분리
- Production 배포 시 `uvicorn` 단독이 아닌 `gunicorn + uvicorn workers`로 프로세스 관리
- `.env` 파일과 `pydantic-settings`로 시크릿/환경변수를 안전하게 관리
