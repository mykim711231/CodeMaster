# Framework
## Official Documentation
- [FastAPI Tutorial](https://fastapi.tiangolo.com/tutorial/)
## 핵심 개념
> LangChain은 Chain, Runnable, LCEL(LangChain Expression Language)을 통해 LLM 워크플로우를 조립하는 프레임워크다. LlamaIndex는 데이터 수집·색인·질의에 특화되어 있고, CrewAI는 역할 기반 Multi-Agent 협업을, AutoGen은 대화형 Multi-Agent를, DSPy는 프롬프트를 최적화·컴파일하는 고수준 프레임워크다.
## 학습 목표
- LangChain Chain과 LCEL(`|` 파이프 연산자)로 재사용 가능한 워크플로우 구성
- RunnablePassthrough, RunnableLambda, RunnableParallel로 데이터 흐름 제어
- LlamaIndex로 문서 로드, 인덱스 생성, 쿼리 엔진 구축
- CrewAI로 역할·목표를 가진 Agent 팀 구성 및 순차/계층적 작업 실행
- AutoGen으로 GroupChat, ConversableAgent를 통한 대화형 협업 구현
- DSPy로 시그니처, 모듈, 옵티마이저를 활용한 프로그래매틱 프롬프트 엔지니어링
## 예제 코드
```python
# 1. LangChain LCEL + Runnable
from langchain_core.runnables import RunnablePassthrough, RunnableParallel
from langchain_core.prompts import ChatPromptTemplate
from langchain_openai import ChatOpenAI

prompt = ChatPromptTemplate.from_template("Summarize: {text}")
llm = ChatOpenAI(model="gpt-4o-mini")

chain = (
    {"text": RunnablePassthrough()}
    | prompt
    | llm
    | (lambda x: x.content)
)
result = chain.invoke("LangChain makes LLM development modular.")
print(result)

# RunnableParallel로 병렬 실행
parallel_chain = RunnableParallel(
    summary=chain,
    length=RunnablePassthrough() | (lambda x: len(x))
)
output = parallel_chain.invoke("LangChain is a framework for LLM applications.")
print(output)  # {'summary': '...', 'length': 52}

# 2. LlamaIndex 쿼리 엔진
from llama_index.core import VectorStoreIndex, SimpleDirectoryReader

documents = SimpleDirectoryReader("./data").load_data()
index = VectorStoreIndex.from_documents(documents)
query_engine = index.as_query_engine()
response = query_engine.query("What is RAG?")

# 3. CrewAI Multi-Agent
from crewai import Agent, Task, Crew

researcher = Agent(role="Researcher", goal="Find latest AI trends", llm=llm)
writer = Agent(role="Writer", goal="Write concise summaries", llm=llm)

research_task = Task(description="Research top 3 AI trends in 2025.", agent=researcher)
write_task = Task(description="Summarize the findings in 3 bullet points.", agent=writer)

crew = Crew(agents=[researcher, writer], tasks=[research_task, write_task])
result = crew.kickoff()
```
## 주요 패턴
- LCEL 파이핑: `Runnable | Runnable | Runnable`으로 체인을 선언적으로 구성
- RunnableLambda: 일반 Python 함수를 Runnable로 래핑해 체인에 통합
- RunnableBranch: 조건에 따라 다른 Runnable 실행 (라우팅)
- LangChain Hub: `hub.pull("rlm/rag-prompt")`로 커뮤니티 프롬프트 재사용
- LlamaIndex Router: 여러 인덱스 중 쿼리 의도에 따라 최적 인덱스 자동 선택
- CrewAI Process: Sequential(순차), Hierarchical(관리자-작업자) 프로세스로 작업 배분
- AutoGen GroupChat: `GroupChatManager`로 여러 에이전트가 자유롭게 대화
- DSPy Optimizer: BootstrapFewShot, MIPROv2 등으로 프롬프트와 예제 자동 최적화
## 주의사항
- LCEL 체인은 디버깅이 까다로우므로 `.with_retry()`, `.with_fallbacks()`로 장애 대비
- CrewAI에서 Agent마다 LLM 인스턴스를 생성하면 API 비용이 배로 증가 → 공유 전략 고려
- LlamaIndex 인덱스는 데이터 변경 시 재빌드 필요, 비용이 큰 경우 Incremental Indexing 검토
- AutoGen 대화가 길어질수록 컨텍스트 토큰 급증 → `max_consecutive_auto_reply`로 제한
- DSPy는 "프롬프트를 작성하는" 대신 "프롬프트를 프로그래밍"하는 패러다임 전환 필요
- 각 프레임워크는 서로 의존성이 겹칠 수 있으므로 가상환경 분리 또는 의존성 충돌 확인
