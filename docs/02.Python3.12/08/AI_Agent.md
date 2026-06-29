# AI Agent
## Official Documentation
- [LangGraph](https://langchain-ai.github.io/langgraph/)
## 핵심 개념
> AI Agent는 LLM이 스스로 사고하고, 도구를 호출하며, 계획을 세우고 행동하는 자율 시스템이다. Tool/Function Calling으로 외부 API·계산기를 호출하고, Memory로 대화 맥락을 유지하며, Planning으로 복잡한 작업을 분해한다. ReAct(Reasoning+Acting)는 생각→행동→관찰 순환을, Reflection은 자신의 출력을 평가·개선하는 패턴을 의미한다. Multi-Agent는 여러 에이전트가 협업하는 구조다.
## 학습 목표
- Tool/Function Calling으로 LLM이 외부 함수를 호출하는 파이프라인 구현
- Memory 기법으로 대화 이력 관리 및 컨텍스트 유지
- Planning 전략으로 작업 분해 및 Plan-and-Execute 사이클 설계
- ReAct 패턴(Thought → Action → Observation)으로 추론-행동 루프 구성
- Reflection 및 Self-Critique를 통한 출력 품질 개선
- LangGraph를 활용한 Multi-Agent 협업 및 상태 기반 워크플로우 설계
## 예제 코드
```python
from langgraph.graph import StateGraph, END
from typing import TypedDict, Annotated
import operator

# 1. Tool 정의 (Function Calling)
from langchain.tools import tool

@tool
def calculator(expression: str) -> float:
    """Evaluate a mathematical expression."""
    return eval(expression)

tools = [calculator]

# 2. LangGraph로 ReAct Agent
class AgentState(TypedDict):
    messages: Annotated[list, operator.add]
    next_action: str

def agent(state: AgentState):
    # LLM이 Tool 호출 또는 최종 응답 결정
    response = llm_with_tools.invoke(state["messages"])
    return {"messages": [response], "next_action": "continue"}

def tool_executor(state: AgentState):
    last_message = state["messages"][-1]
    for tool_call in last_message.tool_calls:
        result = execute_tool(tool_call)
        state["messages"].append(result)
    return {"messages": state["messages"], "next_action": "agent"}

def should_continue(state: AgentState) -> str:
    last_message = state["messages"][-1]
    if hasattr(last_message, "tool_calls") and last_message.tool_calls:
        return "tools"
    return END

graph = StateGraph(AgentState)
graph.add_node("agent", agent)
graph.add_node("tools", tool_executor)
graph.set_entry_point("agent")
graph.add_conditional_edges("agent", should_continue, {"tools": "tools", END: END})
graph.add_edge("tools", "agent")
agent_app = graph.compile()

result = agent_app.invoke({"messages": ["Calculate 15 * 25 + 100"]})
print(result)

# 3. Reflection 패턴
def reflect(state: AgentState):
    reflection_prompt = f"""
    Review the previous output and identify any errors or improvements:
    {state['messages'][-1]}
    Provide a refined response.
    """
    refined = llm.invoke(reflection_prompt)
    return {"messages": [refined], "next_action": "continue"}
```
## 주요 패턴
- Tool Calling: OpenAI function calling, Anthropic tool use 등으로 모델이 도구 선택
- Memory: ConversationBufferMemory, ConversationSummaryMemory, ConversationKGMemory
- ReAct 루프: Thought → Action → Observation → (반복) → Final Answer
- Plan-and-Execute: Plan(계획 수립) → Execute(단계별 실행) → Replan(필요시 재계획)
- Self-Reflection: Self-Critique, Reflexion, LLM-as-Judge로 출력 평가 및 반복 개선
- Multi-Agent: Supervisor-Worker, Debate, Collaborative로 역할 분담 및 협업
- Conditional Edges: 에이전트 상태에 따라 다음 노드를 동적으로 결정 (라우팅)
- Human-in-the-Loop: `interrupt()`로 특정 노드에서 사람 승인 대기
## 주의사항
- 무한 Tool 호출 루프 방지를 위해 최대 반복 횟수(`recursion_limit`) 설정
- Tool 설명과 파라미터 타입 힌트가 부정확하면 LLM이 잘못된 인자로 함수 호출
- Function Calling은 토큰 소비가 크므로 불필요한 도구 호출을 피하도록 프롬프트 설계
- Memory 저장소가 커질수록 컨텍스트 윈도우 초과 위험 → 요약 및 오래된 메시지 삭제 전략 필요
- Reflection 과정에서 거짓 정보를 보강할 수 있으므로 최종 검증 단계 추가
- Multi-Agent에서 통신 오버헤드와 비용이 Agent 수에 비례해 증가 → 필요 최소한으로 설계
