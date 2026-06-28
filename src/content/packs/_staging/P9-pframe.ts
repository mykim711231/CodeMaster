import type { Snippet } from '../../types';

export const pythonFramework: Snippet[] = [
  {
    id: 'pframe-chain-basic',
    lang: 'python',
    title: 'LCEL 기본 체인',
    file: 'chain_basic.py',
    code: `from langchain_core.prompts import PromptTemplate
from langchain_core.output_parsers import StrOutputParser
from langchain_openai import ChatOpenAI

print("[실행] LCEL 체인 구성")
llm = ChatOpenAI(model="gpt-4o-mini")
prompt = PromptTemplate.from_template("{topic}에 대해 한 줄로 설명해 줘")
chain = prompt | llm | StrOutputParser()
result = chain.invoke({"topic": "파이썬"})
print(f"[결과] {result}")`,
    explain: {
      concept:
        'LCEL(LangChain Expression Language) 체인은 프롬프트 → 모델 → 출력 파서를 |(파이프) 기호로 연결해 데이터가 순차적으로 흘러가는 파이프라인을 만드는 방식이에요. ' +
        '리눅스에서 ls | grep | wc 하듯이, 각 단계의 출력이 다음 단계의 입력으로 자동 전달돼요. ' +
        'PromptTemplate으로 빈칸({topic})이 있는 프롬프트 틀을 만들고, 그 결과를 ChatOpenAI가 받아 LLM 추론을 하고, 마지막으로 StrOutputParser가 모델 응답에서 텍스트만 추출해요. ' +
        'chain.invoke()는 이 전체 파이프라인을 한 번에 실행하는 메서드로, 딕셔너리 형태로 프롬프트 변수들을 전달해요. ' +
        '실무에서는 이 LCEL 체인을 RAG, 챗봇, 요약 등 거의 모든 LangChain 워크플로우의 기본 구성 요소로 사용해요.',
      terms: [
        { t: 'PromptTemplate.from_template()', d: '중괄호로 변수 자리를 표시한 템플릿 문자열로 프롬프트 객체를 생성하는 팩토리 메서드예요.' },
        { t: 'ChatOpenAI', d: 'OpenAI의 채팅 모델(gpt-4o-mini 등)을 LangChain에서 호출할 수 있게 감싼 클래스예요.' },
        { t: 'StrOutputParser', d: 'LLM의 응답 객체(AIMessage)에서 텍스트 문자열만 추출해주는 파서예요.' },
        { t: 'chain.invoke({"topic": "파이썬"})', d: '체인에 입력 딕셔너리를 넣어 전체 파이프라인을 실행하고 최종 결과를 반환해요.' },
        { t: '|', d: 'LCEL 파이프 연산자예요. 왼쪽 Runnable의 출력을 오른쪽 Runnable의 입력으로 연결해줘요.' },
      ],
      why:
        '프롬프트 준비, LLM 호출, 결과 파싱을 각각 따로 호출하는 대신 | 기호로 한 줄로 연결하면, ' +
        '코드가 간결해지고 재사용 가능한 모듈형 파이프라인을 만들 수 있어요. 동일한 체인을 배치, 스트리밍으로도 쉽게 확장할 수 있어요.',
      expectedOutput:
        '[실행] LCEL 체인 구성\n' +
        '[결과] 파이썬은 배우기 쉽고 다양한 분야에서 활용되는 프로그래밍 언어입니다.',
      realWorldUsage:
        '고객 문의 분류 챗봇에서 "이 문의가 환불/교환/기술지원 중 어디에 해당하는지 분류해줘"라는 프롬프트 체인을 만들어서, ' +
        '수천 건의 문의를 자동으로 카테고리별로 라우팅하는 데 사용해요.',
      pitfall: 'invoke에 전달하는 딕셔너리 키가 프롬프트 템플릿의 변수 이름({topic})과 정확히 일치해야 해요. 키가 다르면 KeyError가 발생하거나 빈칸이 채워지지 않은 채로 LLM에 전달돼요.',
    },
  },
  {
    id: 'pframe-lcel-pipe',
    lang: 'python',
    title: 'LCEL 파이프 연결',
    file: 'lcel_pipe.py',
    code: `from langchain_core.prompts import PromptTemplate
from langchain_core.output_parsers import StrOutputParser
from langchain_openai import ChatOpenAI

print("[실행] LCEL 파이프라인")
llm = ChatOpenAI(model="gpt-4o-mini")
prompt = PromptTemplate.from_template("{q}를 요약해 줘")
chain = prompt | llm | StrOutputParser()
out = chain.invoke({"q": "LangChain"})
print(f"[결과] {out}")`,
    explain: {
      concept:
        'LCEL 파이프는 | 연산자를 사용해 여러 Runnable(실행 가능한 구성 요소)을 순차적으로 연결하는 선언적 방식이에요. ' +
        '리눅스 셸 파이프(|)와 똑같은 철학으로, "데이터가 왼쪽에서 오른쪽으로 흐른다"는 직관적인 설계를 제공해요. ' +
        'prompt | llm | parser 순서로 연결하면, (1) 입력 → 템플릿 채우기 → (2) LLM 추론 → (3) 텍스트 추출 순서로 데이터가 흐르는 거예요. ' +
        '각 구성 요소는 Runnable 인터페이스를 구현해서, invoke, stream, batch 등 공통 메서드를 제공해요. ' +
        '이런 표준화 덕분에 어떤 Runnable이든 자유롭게 조합할 수 있고, LangSmith로 각 단계의 실행을 추적·디버깅할 수 있어요.',
      terms: [
        { t: '|', d: 'LCEL의 핵심 연산자예요. 왼쪽 Runnable의 출력 타입이 오른쪽 Runnable의 입력 타입과 맞아야 연결돼요.' },
        { t: 'from_template()', d: '문자열에서 중괄호 {}로 변수 위치를 표시한 프롬프트 틀을 만드는 메서드예요.' },
        { t: 'StrOutputParser()', d: 'LLM 출력 객체(AIMessage)에서 .content 문자열만 추출하는 파서예요.' },
        { t: 'invoke({"q": "LangChain"})', d: '체인 전체를 한 번 실행하는 메서드예요. 배치는 batch(), 스트리밍은 stream()을 써요.' },
      ],
      why:
        'LCEL을 쓰면 복잡한 ML 파이프라인도 2~3줄로 명확하게 표현할 수 있어요. 개별 구성 요소를 독립적으로 테스트·교체할 수 있고, 병렬 처리, 폴백, 재시도 같은 고급 패턴도 Runnable 메서드로 쉽게 추가할 수 있어요.',
      expectedOutput:
        '[실행] LCEL 파이프라인\n' +
        '[결과] LangChain은 대규모 언어 모델(LLM)을 활용한 애플리케이션을 구축하기 위한 프레임워크입니다.',
      realWorldUsage:
        'RAG 챗봇에서 "retriever | prompt | llm | parser" 형태로 검색 결과가 자동으로 프롬프트에 주입되고 LLM 추론을 거쳐 최종 답변이 나오는 전체 파이프라인을 한 줄로 표현해요.',
      pitfall: '파이프 순서가 바뀌면(예: llm | prompt | parser) 타입 불일치 오류가 발생해요. 프롬프트 템플릿은 문자열을, LLM은 프롬프트를, 파서는 LLM 응답을 기대하기 때문에 순서를 반드시 지켜야 해요.',
    },
  },
  {
    id: 'pframe-runnable-passthrough',
    lang: 'python',
    title: 'RunnablePassthrough 전달',
    file: 'runnable_passthrough.py',
    code: `from langchain_core.runnables import RunnablePassthrough
from langchain_openai import ChatOpenAI

print("[실행] RunnablePassthrough")
llm = ChatOpenAI(model="gpt-4o-mini")
chain = RunnablePassthrough() | llm
out = chain.invoke("안녕")
print(f"[결과] {out}")`,
    explain: {
      concept:
        'RunnablePassthrough는 받은 입력을 아무 가공 없이 그대로 다음 단계로 전달하는 투명한 통로예요. ' +
        '겉모습은 Runnable이라서 파이프(|)로 연결할 수 있지만, 실제로는 아무 변환도 하지 않아요. ' +
        '주 용도는 RunnableParallel과 함께 사용할 때 원본 입력값을 보존하면서 다른 변환 결과와 병렬로 합치는 거예요. ' +
        '이 예제처럼 단독으로 쓰면 llm에 입력을 직접 전달하는 역할을 해서, 프롬프트 템플릿 없이도 LLM을 호출할 수 있어요. ' +
        '실무에서는 {"original": RunnablePassthrough(), "summary": summary_chain} 같은 패턴으로 원본과 가공본을 동시에 유지할 때 자주 써요.',
      terms: [
        { t: 'RunnablePassthrough()', d: '입력을 변환하지 않고 그대로 통과시키는 Runnable 구현체예요.' },
        { t: 'Runnable', d: 'LCEL에서 invoke/stream/batch를 지원하는 모든 객체의 기본 인터페이스예요.' },
        { t: 'invoke("안녕")', d: 'Runnable을 실행하는 표준 메서드예요. RunnablePassthrough는 입력을 그대로 llm에 전달해요.' },
        { t: 'ChatOpenAI', d: 'OpenAI 채팅 모델을 Runnable 인터페이스로 감싼 클래스예요. invoke()로 직접 호출할 수 있어요.' },
      ],
      why:
        'RunnableParallel에서 원본 입력을 보존하려면, 한 브랜치에서는 입력을 가공하고 다른 브랜치에서는 그대로 보관해야 해요. ' +
        'RunnablePassthrough는 이 "그대로 보관" 역할을 깔끔하게 해줘서, 멀티 브랜치 파이프라인의 필수 도구예요.',
      expectedOutput:
        '[실행] RunnablePassthrough\n' +
        '[결과] AIMessage(content="안녕하세요! ...")',
      realWorldUsage:
        'RAG 체인에서 검색된 문서(context)와 원본 질문(question)을 함께 LLM에 전달할 때, ' +
        '{"context": retriever, "question": RunnablePassthrough()} 형태로 질문은 그대로 보존하고 문서만 검색 결과로 교체해요.',
      pitfall: 'RunnablePassthrough는 입력 타입을 전혀 검사하지 않아서, 뒤에 오는 Runnable이 기대하는 타입과 다르면 런타임 오류가 발생해요. 연결 전에 입출력 타입이 맞는지 반드시 확인해야 해요.',
    },
  },
  {
    id: 'pframe-runnable-parallel',
    lang: 'python',
    title: 'RunnableParallel 병렬 실행',
    file: 'runnable_parallel.py',
    code: `from langchain_core.runnables import RunnableParallel, RunnablePassthrough

print("[실행] RunnableParallel")
chain = RunnableParallel(
  origin=RunnablePassthrough(),
  upper=lambda x: x.upper(),
)
out = chain.invoke("hi")
print(f"[결과] {out}")`,
    explain: {
      concept:
        'RunnableParallel은 하나의 입력을 여러 개의 병렬 브랜치로 동시에 보내고, 각 브랜치의 결과를 딕셔너리로 모아서 반환하는 분기 실행기예요. ' +
        '도시락 여러 칸에 반찬을 동시에 담는 것처럼, 같은 입력으로 여러 변환을 한 번에 수행해요. ' +
        '각 브랜치의 키(origin, upper)가 결과 딕셔너리의 키가 돼서, 어떤 변환 결과인지 식별할 수 있어요. ' +
        'origin 브랜치는 RunnablePassthrough로 원본을 보존하고, upper 브랜치는 lambda로 대문자 변환을 해요. ' +
        '실무에서는 {"context": retriever, "question": RunnablePassthrough()} 같은 패턴으로 RAG의 검색과 질문 보존을 동시에 처리해요.',
      terms: [
        { t: 'RunnableParallel(...)', d: '여러 Runnable을 딕셔너리로 받아 동시 실행하고 결과를 같은 키의 딕셔너리로 반환해요.' },
        { t: 'origin=RunnablePassthrough()', d: '입력을 그대로 보존하는 브랜치예요. 결과에 "origin" 키로 포함돼요.' },
        { t: 'upper=lambda x: x.upper()', d: '입력을 대문자로 변환하는 브랜치예요. lambda로 간단한 함수를 Runnable로 만들어요.' },
        { t: 'chain.invoke("hi")', d: '전체 병렬 체인을 실행해서 {"origin": "hi", "upper": "HI"} 같은 결과를 얻어요.' },
      ],
      why:
        'LLM 체인에서 원본 질문과 검색 결과를 동시에 프롬프트에 넣어야 할 때, 순차적으로 처리하면 불필요한 대기 시간이 생겨요. ' +
        '병렬로 처리하면 원본 보존과 가공을 한 호출로 해결할 수 있어요.',
      expectedOutput:
        '[실행] RunnableParallel\n' +
        "[결과] {'origin': 'hi', 'upper': 'HI'}",
      realWorldUsage:
        'RAG 파이프라인에서 {"context": retriever_chain, "question": RunnablePassthrough()}로 병렬 구성을 하면, ' +
        '검색기(retriever)가 문서를 찾는 동안 원본 질문도 함께 보존돼서, 최종 프롬프트에 두 정보가 모두 자동 주입돼요.',
      pitfall: '결과 딕셔너리의 키 이름은 고정돼 있어요. 다음 단계에서 특정 키를 기대한다면(예: 프롬프트 템플릿의 변수명), RunnableParallel의 키와 정확히 일치해야 해요.',
    },
  },
  {
    id: 'pframe-prompt-template',
    lang: 'python',
    title: 'PromptTemplate 빈칸 채우기',
    file: 'prompt_template.py',
    code: `from langchain_core.prompts import PromptTemplate

print("[실행] PromptTemplate")
p = PromptTemplate(
  input_variables=["name"],
  template="{name}님, 환영합니다!",
)
text = p.format(name="지훈")
print(f"[결과] {text}")`,
    explain: {
      concept:
        'PromptTemplate은 LLM에 보낼 프롬프트의 틀(템플릿)을 만들고, 나중에 변수 값을 채워 넣어 완성된 프롬프트를 생성하는 도구예요. ' +
        '초대장에 "___님, 환영합니다!"라고 틀만 만들어두고, 나중에 이름만 채워 넣는 것과 같아요. ' +
        'input_variables로 어떤 변수가 템플릿에 사용될지 명시하고, template에 중괄호 {}로 변수 자리를 표시해요. ' +
        'format() 메서드에 키워드 인자로 실제 값을 전달하면, 중괄호 부분이 값으로 대체된 완성된 문자열이 반환돼요. ' +
        'LLM마다 프롬프트 형식이 조금씩 달라도, PromptTemplate이 알아서 해당 모델 포맷으로 변환해줘서 일관된 코드를 유지할 수 있어요.',
      terms: [
        { t: 'input_variables=["name"]', d: '템플릿에서 채워야 할 변수 이름 리스트예요. format() 호출 시 이 이름들을 키워드로 전달해야 해요.' },
        { t: 'template="{name}님, 환영합니다!"', d: '중괄호 {}로 변수 자리를 표시한 프롬프트 문자열이에요. format()으로 치환돼요.' },
        { t: 'format(name="지훈")', d: '템플릿의 {name} 자리를 "지훈"으로 채워 완성된 문자열을 반환하는 메서드예요.' },
        { t: 'PromptTemplate', d: '가장 기본적인 프롬프트 템플릿 클래스예요. 단일 문자열 프롬프트를 만들 때 써요.' },
      ],
      why:
        '같은 구조의 프롬프트에 변수만 바꿔서 수백 번 LLM을 호출할 때, 매번 문자열을 조합하면 실수하기 쉬워요. ' +
        '템플릿으로 분리하면 프롬프트 구조와 데이터가 분리돼서 유지보수가 훨씬 쉬워지고, 프롬프트 버전 관리도 가능해져요.',
      expectedOutput:
        '[실행] PromptTemplate\n' +
        '[결과] 지훈님, 환영합니다!',
      realWorldUsage:
        '고객 응대 챗봇에서 "고객명: {name}, 문의 유형: {type}, 내용: {content}" 같은 템플릿을 만들어두고, ' +
        '각 고객 문의마다 format()으로 구체적인 정보를 채워 LLM에 전달해 일관된 응대 품질을 유지해요.',
      pitfall: 'format()에 전달한 키워드 이름이 input_variables와 일치하지 않으면 KeyError가 발생해요. 또한 템플릿에 중괄호를 문자 그대로 쓰고 싶으면 {{ }}로 이스케이프해야 해요.',
    },
  },
  {
    id: 'pframe-chat-prompt',
    lang: 'python',
    title: 'ChatPromptTemplate 대화 틀',
    file: 'chat_prompt.py',
    code: `from langchain_core.prompts import ChatPromptTemplate

print("[실행] ChatPromptTemplate")
tpl = ChatPromptTemplate.from_messages([
  ("system", "너는 친절한 비서야."),
  ("user", "{question}"),
])
msgs = tpl.format_messages(question="안녕?")
print(f"[결과] {msgs}")`,
    explain: {
      concept:
        'ChatPromptTemplate은 대화형 LLM을 위해 시스템 메시지와 사용자 메시지 등 역할별 대화 줄을 미리 틀로 만들어두는 도구예요. ' +
        '연극 대본에 배역별 대사를 미리 써두는 것처럼, system(지시사항), user(사용자 질문), assistant(AI 응답 예시) 등 역할을 정해둬요. ' +
        'from_messages()로 (역할, 내용) 튜플 리스트를 받아 템플릿을 만들고, 내용에 중괄호 변수를 포함할 수 있어요. ' +
        'format_messages()가 변수를 채워 실제 LLM에 보낼 메시지 리스트(Message 객체들)를 반환해요. ' +
        '실무에서는 페르소나 설정(system), 대화 예시(assistant), 실제 질문(user)을 조합한 복합 템플릿을 자주 사용해요.',
      terms: [
        { t: 'from_messages()', d: '(역할, 내용) 튜플 리스트로 채팅 템플릿을 생성하는 팩토리 메서드예요.' },
        { t: '"system"', d: 'AI의 성격과 행동 규칙을 정하는 역할이에요. 대화 전체에 영향을 미치는 지시사항을 여기에 넣어요.' },
        { t: '"user"', d: '사용자의 발언을 나타내는 역할이에요. 여기에 중괄호 변수를 넣어 실제 질문을 동적으로 삽입해요.' },
        { t: 'format_messages(question="안녕?")', d: '변수를 채워 실제 LLM 입력용 메시지 객체 리스트를 생성하는 메서드예요.' },
      ],
      why:
        '채팅 모델(gpt-4, claude 등)은 단순 문자열이 아니라 역할 태그가 붙은 메시지 배열을 입력으로 받아요. ' +
        'ChatPromptTemplate이 이 복잡한 형식을 깔끔하게 관리해줘서, 시스템 프롬프트 엔지니어링이 훨씬 쉬워져요.',
      expectedOutput:
        '[실행] ChatPromptTemplate\n' +
        '[결과] [SystemMessage(content="너는 친절한 비서야."), HumanMessage(content="안녕?")]',
      realWorldUsage:
        'AI 법률 상담 서비스에서 system 메시지에 "너는 한국 변호사야. 민법과 상법을 정확히 인용해야 해"라고 설정하고, ' +
        'user 메시지에 실제 상담 내용을 동적으로 삽입해서 전문적인 법률 응답을 유도해요.',
      pitfall: '역할 이름은 반드시 system, user, assistant, function, tool 중 하나여야 해요. 잘못된 역할 이름은 LLM이 무시하거나 오류를 낼 수 있어요.',
    },
  },
  {
    id: 'pframe-output-parser',
    lang: 'python',
    title: 'Pydantic 출력 파서',
    file: 'pydantic_parser.py',
    code: `from langchain_core.output_parsers import PydanticOutputParser
from pydantic import BaseModel

class Info(BaseModel):
  name: str
  age: int

print("[실행] Pydantic 출력 파서")
parser = PydanticOutputParser(pydantic_object=Info)
data = parser.parse('{"name": "김철수", "age": 25}')
print(f"[결과] {data}")`,
    explain: {
      concept:
        'Pydantic 출력 파서는 LLM이 생성한 자유 형식 텍스트를 Pydantic 모델로 정의된 구조화된 객체로 변환해주는 도구예요. ' +
        'LLM에게 "JSON 형식으로 답해줘"라고 부탁하고, 그 JSON을 Info(name=str, age=int) 같은 타입 안전한 파이썬 객체로 바꿔줘요. ' +
        'BaseModel로 데이터의 각 필드 타입을 선언하면, parse() 시 자동으로 타입 변환과 검증이 이뤄져요. ' +
        '나이 필드에 "스물다섯" 같은 문자열이 오면 ValidationError가 발생해서, 프로그램이 잘못된 데이터를 그대로 사용하는 걸 막아줘요. ' +
        '실무에서는 LLM 응답을 DB에 저장하거나 다른 API로 전달할 때, 반드시 이렇게 파싱과 검증을 거쳐서 데이터 무결성을 확보해요.',
      terms: [
        { t: 'BaseModel', d: 'Pydantic에서 데이터의 구조와 타입을 정의하는 기본 클래스예요. 필드의 타입 힌트를 보고 자동 검증해요.' },
        { t: 'name: str, age: int', d: '데이터 모델의 필드와 타입을 선언하는 부분이에요. LLM 응답이 이 형식에 맞아야 해요.' },
        { t: 'PydanticOutputParser', d: 'LLM 출력을 Pydantic 모델 객체로 변환하고 검증하는 파서예요.' },
        { t: "parse('{\"name\": ...}')", d: 'JSON 문자열을 받아 Info 객체로 변환하는 메서드예요. 실패 시 ValidationError 발생해요.' },
      ],
      why:
        'LLM은 가끔 JSON 형식을 깨거나, 숫자 필드에 문자열을 넣거나, 필수 필드를 빠뜨려요. ' +
        'Pydantic 파서가 이런 문제를 자동으로 감지하고 깔끔한 오류 메시지를 제공해서, 안정적인 데이터 파이프라인을 구축할 수 있어요.',
      expectedOutput:
        '[실행] Pydantic 출력 파서\n' +
        "[결과] name='김철수' age=25",
      realWorldUsage:
        '이력서 파싱 서비스에서 LLM이 이력서 PDF에서 이름, 경력, 학력, 기술 스택을 추출한 뒤, ' +
        'PydanticOutputParser로 구조화된 객체로 변환해서 DB에 저장해요. 잘못된 형식의 응답은 자동으로 폐기되고 재시도돼요.',
      pitfall: 'LLM이 JSON 형식을 완전히 지키지 않거나(후행 쉼표, 주석 포함 등), 필드가 누락되면 parse()가 실패해요. 이럴 때를 대비해 retry 로직이나 OutputFixingParser 같은 자가 수정 파서를 함께 사용하는 게 좋아요.',
    },
  },
  {
    id: 'pframe-streaming',
    lang: 'python',
    title: 'LCEL 스트리밍 출력',
    file: 'streaming.py',
    code: `from langchain_core.prompts import PromptTemplate
from langchain_core.output_parsers import StrOutputParser
from langchain_openai import ChatOpenAI

print("[실행] 스트리밍 시작")
llm = ChatOpenAI(model="gpt-4o-mini")
prompt = PromptTemplate.from_template("{q}를 설명해 줘")
chain = prompt | llm | StrOutputParser()
for chunk in chain.stream({"q": "파이썬"}):
  print(chunk, end="")
print()`,
    explain: {
      concept:
        '스트리밍(streaming)은 LLM 응답이 한 번에 완성될 때까지 기다리지 않고, 토큰이 생성되는 즉시 조금씩 흘려보내는 방식이에요. ' +
        '수도꼭지에서 물이 한꺼번에 나오는 게 아니라 조금씩 흐르는 것처럼, 사용자가 첫 응답을 더 빨리 볼 수 있어요. ' +
        'stream() 메서드는 제너레이터(generator)를 반환해서 for chunk in chain.stream() 형태로 하나씩 받아올 수 있어요. ' +
        'end=""는 print()가 자동으로 줄바꿈하지 않게 해서, 청크들이 같은 줄에 이어서 출력되도록 해줘요. ' +
        '실무에서는 채팅 UI에 타이핑 효과를 주거나, 긴 보고서 생성 시 중간 결과를 미리 보여줄 때 스트리밍이 사실상 필수예요.',
      terms: [
        { t: 'stream()', d: 'invoke()와 달리 결과를 제너레이터로 반환해서 데이터가 준비되는 대로 하나씩 소비할 수 있어요.' },
        { t: 'chunk', d: '스트리밍으로 전달되는 응답의 작은 조각이에요. 보통 한 토큰이나 몇 글자 단위예요.' },
        { t: 'end=""', d: 'print() 후 자동 줄바꿈을 막는 옵션이에요. 청크들이 이어서 출력되게 해줘요.' },
        { t: 'StrOutputParser', d: '스트리밍 모드에서도 각 청크를 실시간으로 파싱해서 전달해요. 청크 단위로 텍스트가 나와요.' },
      ],
      why:
        '사용자가 30초짜리 전체 응답을 기다리면 이탈률이 높아져요. 스트리밍으로 0.5초 만에 첫 글자를 보여주면, 사용자는 "응답이 오고 있구나"라고 인지하고 더 편하게 기다릴 수 있어요.',
      expectedOutput:
        '[실행] 스트리밍 시작\n' +
        '파이썬은... (이후 텍스트가 조금씩 이어서 출력됨)',
      realWorldUsage:
        'ChatGPT의 타이핑 애니메이션이 바로 이 스트리밍 기술을 사용한 UX예요. 사용자 경험 측면에서 스트리밍은 응답 지연을 심리적으로 단축시키는 효과가 있어서, 거의 모든 LLM 서비스가 채택하고 있어요.',
      pitfall: 'chunk 경계가 항상 글자나 단어 단위가 아니라, 토큰 경계일 수 있어요. 한글은 특히 토큰이 음절 단위로 쪼개질 수 있어서, UI에 렌더링할 때 글자가 깨지지 않도록 처리해야 해요.',
    },
  },
  {
    id: 'pframe-memory-buffer',
    lang: 'python',
    title: 'ConversationBufferMemory',
    file: 'memory_buffer.py',
    code: `from langchain.memory import ConversationBufferMemory

print("[실행] 대화 메모리")
mem = ConversationBufferMemory()
mem.save_context({"input": "안녕"}, {"output": "반가워"})
history = mem.load_memory_variables({})
print(f"[결과] {history}")`,
    explain: {
      concept:
        'ConversationBufferMemory는 대화의 모든 주고받음을 통째로 기억하는 가장 단순한 메모리 구현체예요. ' +
        '채팅앱의 대화 스크롤을 끝까지 저장하는 것처럼, 전체 대화 히스토리를 하나의 변수에 다 담아둬요. ' +
        'save_context()로 (사용자 입력, AI 응답) 쌍을 저장하고, load_memory_variables()로 저장된 대화 기록을 한 번에 불러와요. ' +
        '간단해서 프로토타입에 적합하지만, 대화가 길어지면 토큰 수가 계속 증가해서 API 비용이 늘고 LLM 컨텍스트를 초과할 위험이 있어요. ' +
        '실무에서는 ConversationSummaryMemory(요약 기억)나 ConversationTokenBufferMemory(토큰 제한) 같은 고급 메모리로 대체돼요.',
      terms: [
        { t: 'ConversationBufferMemory()', d: '모든 대화를 순서대로 저장하는 메모리 객체예요. 가장 기본적인 메모리 타입이에요.' },
        { t: 'save_context({"input": ...}, {"output": ...})', d: '사용자 입력과 AI 응답 한 쌍을 메모리에 추가하는 메서드예요.' },
        { t: 'load_memory_variables({})', d: '메모리에 저장된 전체 대화 기록을 딕셔너리로 반환하는 메서드예요.' },
        { t: '"input"/"output"', d: 'LangChain 메모리에서 사용자 메시지와 AI 응답을 구분하는 표준 키 이름이에요.' },
      ],
      why:
        '대화형 AI는 이전 대화를 기억해야 "아까 말씀하신 그 영화" 같은 문맥 의존적 표현을 이해할 수 있어요. ' +
        '메모리 없이는 매 질문이 독립적으로 처리돼서 대화 연결성이 완전히 사라져요.',
      expectedOutput:
        '[실행] 대화 메모리\n' +
        "[결과] {'history': 'Human: 안녕\\nAI: 반가워'}",
      realWorldUsage:
        '프로토타입 챗봇에서 대화 컨텍스트 유지를 위해 가장 먼저 도입하는 메모리예요. ' +
        '구현이 3줄로 끝나니까 "일단 메모리 붙여서 대화가 이어지는지 확인"하는 용도로 최적이에요.',
      pitfall: '대화가 10턴, 20턴 길어지면 history 문자열이 너무 길어져서 LLM 토큰 한도를 초과하거나, API 비용이 급증해요. 프로덕션에는 반드시 토큰 제한이 있는 ConversationTokenBufferMemory나 요약 기반 메모리로 전환해야 해요.',
    },
  },
  {
    id: 'pframe-llamaindex-doc',
    lang: 'python',
    title: 'LlamaIndex 문서 로드',
    file: 'llama_doc.py',
    code: `from llama_index.core import Document, VectorStoreIndex

print("[실행] LlamaIndex 문서 인덱싱")
doc = Document(text="파이썬은 쉬운 언어입니다.")
index = VectorStoreIndex.from_documents([doc])
engine = index.as_query_engine()
answer = engine.query("파이썬이 뭐야?")
print(f"[결과] {answer}")`,
    explain: {
      concept:
        'LlamaIndex는 문서를 읽어서 벡터 인덱스를 만들고, 질문이 들어오면 인덱스에서 관련 부분을 찾아 LLM이 답변하게 하는 RAG 프레임워크예요. ' +
        '책 뒤에 붙은 찾아보기(색인) 표를 만들어두고, 원하는 주제를 빠르게 찾는 것과 같은 원리예요. ' +
        'Document로 한 조각의 텍스트를 감싸고, VectorStoreIndex.from_documents()로 그 텍스트의 임베딩 벡터를 계산해서 인덱스를 생성해요. ' +
        'as_query_engine()으로 인덱스를 질문-답변 엔진으로 변환하고, query()로 자연어 질문을 보내면 관련 텍스트를 찾아 답변을 생성해요. ' +
        'LangChain과 달리 LlamaIndex는 문서 인덱싱과 검색에 특화된 프레임워크라서, 대규모 문서 기반 QA에 특히 강점이 있어요.',
      terms: [
        { t: 'Document(text=...)', d: '검색 대상이 되는 텍스트 한 조각을 감싸는 데이터 객체예요. 여러 개를 리스트로 모아 인덱싱해요.' },
        { t: 'VectorStoreIndex', d: '문서의 임베딩 벡터를 생성하고 저장해서 의미 기반 검색을 가능하게 하는 인덱스 클래스예요.' },
        { t: 'from_documents([doc])', d: '문서 리스트로부터 직접 인덱스를 생성하는 클래스 메서드예요. 내부적으로 임베딩을 계산해요.' },
        { t: 'as_query_engine()', d: '인덱스를 자연어 질문을 받아 답변하는 쿼리 엔진으로 변환하는 메서드예요.' },
      ],
      why:
        '긴 문서에서 원하는 정보를 찾으려면 모든 텍스트를 LLM에 넣을 수 없으니, 검색 기반 접근(RAG)이 필수예요. ' +
        'LlamaIndex는 이 RAG 파이프라인을 단 4줄로 구현할 수 있게 해줘서, 문서 QA 프로토타입을 가장 빠르게 만들 수 있어요.',
      expectedOutput:
        '[실행] LlamaIndex 문서 인덱싱\n' +
        '[결과] 파이썬은 배우기 쉬운 프로그래밍 언어입니다.',
      realWorldUsage:
        '기업 내부 위키(Confluence, Notion)의 모든 페이지를 LlamaIndex로 인덱싱해서, 직원들이 "연차 신청 방법"이라고 물으면 관련 페이지를 찾아 요약해서 알려주는 사내 AI 검색 시스템을 구축할 수 있어요.',
      pitfall: '문서에 답이 없는 질문을 하면 LLM이 없는 정보를 지어내는 환각(hallucination)이 발생할 수 있어요. 답변 신뢰도를 함께 확인하거나 "문서에서 답을 찾을 수 없습니다" 같은 폴백 처리를 구현해야 해요.',
    },
  },
  {
    id: 'pframe-llamaindex-nodes',
    lang: 'python',
    title: 'LlamaIndex 노드 분할',
    file: 'llama_nodes.py',
    code: `from llama_index.core import Document
from llama_index.core.node_parser import SentenceSplitter

print("[실행] LlamaIndex 노드 분할")
doc = Document(text="긴 글입니다. " * 50)
parser = SentenceSplitter(chunk_size=100)
nodes = parser.get_nodes_from_documents([doc])
print(f"[결과] 노드 개수: {len(nodes)}")`,
    explain: {
      concept:
        '노드(Node)는 LlamaIndex에서 긴 문서를 작은 청크로 쪼갠 최소 검색 단위예요. ' +
        '두꺼운 책을 페이지 단위로 나누듯이, 모델이 한 번에 처리할 수 있는 크기로 문서를 분할해요. ' +
        'SentenceSplitter는 문장 경계를 인식해서 자연스럽게 자르는 스마트한 분할기로, chunk_size=100이면 약 100자 단위로 노드를 만들어요. ' +
        'get_nodes_from_documents()는 Document 객체 리스트를 받아서 Node 객체 리스트로 변환해요. ' +
        '실무에서는 chunk_size와 chunk_overlap(겹침)을 문서 성격에 맞게 튜닝하는 게 검색 품질의 핵심이에요.',
      terms: [
        { t: 'SentenceSplitter', d: '문장 경계를 파악해서 자연스럽게 텍스트를 분할하는 노드 파서예요.' },
        { t: 'chunk_size=100', d: '한 노드의 최대 글자 수를 지정하는 매개변수예요. 실제로는 512~1024 정도로 더 크게 설정해요.' },
        { t: 'get_nodes_from_documents()', d: 'Document 객체들을 Node 객체 리스트로 변환하는 메서드예요. 분할이 여기서 일어나요.' },
        { t: 'len(nodes)', d: '생성된 노드 개수를 확인해요. 원본이 길수록 노드 수가 많아져요.' },
      ],
      why:
        '긴 문서를 통째로 임베딩하면 의미가 뭉개지고, 검색 시 관련 없는 부분이 포함돼 정확도가 떨어져요. ' +
        '적절한 크기의 노드로 나누면 검색이 정확해지고, 필요한 부분만 LLM 컨텍스트로 전달해서 비용도 절감돼요.',
      expectedOutput:
        '[실행] LlamaIndex 노드 분할\n' +
        '[결과] 노드 개수: 9',
      realWorldUsage:
        'PDF 논문 1000편을 RAG로 검색할 때, 각 논문을 chunk_size=1024, chunk_overlap=128로 분할해서 수백만 개의 노드로 인덱싱해요. ' +
        '사용자가 특정 방법론을 검색하면, 논문의 해당 섹션만 정확히 찾아서 보여줄 수 있어요.',
      pitfall: 'chunk_size를 너무 작게 하면(예: 50자) 한 문장도 채 완성되지 않은 채 잘려서 문맥이 끊기고 검색 품질이 나빠져요. chunk_overlap으로 경계 부분의 문맥을 보존하는 것도 함께 고려해야 해요.',
    },
  },
  {
    id: 'pframe-llamaindex-chat',
    lang: 'python',
    title: 'LlamaIndex 챗 엔진',
    file: 'llama_chat.py',
    code: `from llama_index.core import VectorStoreIndex, Document

print("[실행] LlamaIndex 챗 엔진")
index = VectorStoreIndex.from_documents([
  Document(text="파이썬은 쉽고 강력한 프로그래밍 언어입니다.")
])
engine = index.as_chat_engine(chat_mode="context")
resp = engine.chat("한 줄로 설명해 줘")
print(f"[답변1] {resp}")
follow = engine.chat("더 자세히")
print(f"[답변2] {follow}")`,
    explain: {
      concept:
        '챗 엔진(Chat Engine)은 LlamaIndex의 인덱스 위에서 대화를 이어갈 수 있게 해주는 대화형 인터페이스예요. ' +
        '일반 쿼리 엔진이 질문 하나에 답 하나로 끝나는 반면, 챗 엔진은 이전 질문의 문맥을 기억하고 꼬리 질문을 이어갈 수 있어요. ' +
        'chat_mode="context"는 대화 이력을 컨텍스트로 유지하면서 검색하는 모드로, "더 자세히" 같은 축약된 후속 질문도 이전 질문과 연결해서 이해해요. ' +
        'engine.chat()은 각 호출마다 대화를 한 턴 진행하고, 내부적으로 이전 대화를 기억해서 축약 표현을 처리해요. ' +
        '실무에서는 채팅 인터페이스에 LlamaIndex 챗 엔진을 붙여서 문서 기반 AI 어시스턴트를 빠르게 구축할 수 있어요.',
      terms: [
        { t: 'as_chat_engine(chat_mode="context")', d: '인덱스를 대화형으로 변환하는 메서드예요. context 모드는 대화 이력을 컨텍스트에 포함해요.' },
        { t: 'chat_mode', d: '대화 컨텍스트를 어떻게 관리할지 결정하는 옵션이에요. context, condense_plus_context 등이 있어요.' },
        { t: 'engine.chat()', d: '한 번의 대화 턴을 실행하는 메서드예요. 이전 대화를 기억하고 있어서 축약된 질문도 이해해요.' },
        { t: 'follow', d: '첫 번째 답변에 이은 후속 질문의 응답이에요. 챗 엔진이 "더 자세히"가 무엇을 가리키는지 문맥으로 파악해요.' },
      ],
      why:
        '사용자는 보통 한 번에 완벽한 질문을 하지 않고, "알려줘" → "더 자세히" → "예시도"처럼 점진적으로 파고들어요. ' +
        '챗 엔진이 이 대화 흐름을 기억하지 못하면 매번 처음부터 다시 질문해야 해서 UX가 크게 나빠져요.',
      expectedOutput:
        '[실행] LlamaIndex 챗 엔진\n' +
        '[답변1] 파이썬은 배우기 쉽고 다양한 분야에서 사용되는 강력한 프로그래밍 언어입니다.\n' +
        '[답변2] 특히 데이터 과학, 웹 개발, 자동화 등에서 널리 사용되며, 풍부한 라이브러리 생태계를 갖추고 있습니다.',
      realWorldUsage:
        '기업 매뉴얼 Q&A 봇에서 직원이 "퇴직금 규정 알려줘" → "중간정산 조건은?" → "서류는 어디서 다운받아?" 같은 꼬리 질문을 자연스럽게 이어갈 수 있어요. ' +
        '챗 엔진이 "중간정산"이 "퇴직금 규정"의 하위 주제임을 문맥으로 이해하기 때문이에요.',
      pitfall: '대화가 길어지면 이전 대화가 컨텍스트에서 밀려나서, "아까 말한 그거" 같은 표현을 이해하지 못할 수 있어요. chat_mode를 condense_plus_context로 설정하면 이전 대화를 요약해 보관해서 더 긴 대화도 처리할 수 있어요.',
    },
  },
  {
    id: 'pframe-crew-role',
    lang: 'python',
    title: 'CrewAI 역할 정의',
    file: 'crew_role.py',
    code: `from crewai import Agent

print("[실행] CrewAI Agent 역할 정의")
researcher = Agent(
  role="연구원",
  goal="주제를 조사해 요약",
  backstory="10년차 연구자야.",
)
print(f"[결과] role={researcher.role}, goal={researcher.goal}")`,
    explain: {
      concept:
        'CrewAI의 Agent는 특정 역할(role)과 목표(goal), 배경 스토리(backstory)를 가진 AI 일꾼이에요. ' +
        '연극에서 배우에게 캐릭터를 부여하는 것처럼, role은 직함, goal은 달성 목표, backstory는 행동 스타일과 성격을 결정해요. ' +
        '예를 들어 연구원 역할은 깊이 파고들고, 작가 역할은 창의적으로 표현하고, 비평가 역할은 날카롭게 검토하는 식으로 각자 다른 성향을 가져요. ' +
        'backstory를 구체적으로 쓸수록 LLM이 더 일관된 톤과 스타일로 행동해서, 전체 팀워크 품질이 올라가요. ' +
        '실무에서는 마케터, 개발자, QA 담당자 등 실제 조직의 역할을 그대로 반영한 멀티 에이전트 팀을 구성해요.',
      terms: [
        { t: 'Agent(...)', d: '역할·목표·배경을 가진 CrewAI 에이전트를 생성하는 클래스예요.' },
        { t: 'role="연구원"', d: '에이전트의 직함을 정하는 매개변수예요. 팀 내에서 어떤 포지션인지 나타내요.' },
        { t: 'goal="..."', d: '에이전트가 달성해야 할 구체적인 목표예요. 이 목표에 맞춰 행동을 결정해요.' },
        { t: 'backstory="10년차 연구자야."', d: '에이전트의 페르소나와 행동 스타일을 결정하는 배경 설명이에요.' },
      ],
      why:
        '역할과 목표가 명확하지 않으면 여러 에이전트가 서로 겹치는 일을 하거나 책임을 회피해요. ' +
        'CrewAI의 role/goal/backstory 체계는 자연어로 에이전트의 책임 범위를 명확히 구분해줘서 협업 품질을 높여줘요.',
      expectedOutput:
        '[실행] CrewAI Agent 역할 정의\n' +
        '[결과] role=연구원, goal=주제를 조사해 요약',
      realWorldUsage:
        '콘텐츠 마케팅 팀을 CrewAI로 구성할 때, "시장 분석가"(트렌드 데이터 수집), "카피라이터"(매력적인 문구 작성), "에디터"(톤앤매너 검수)로 역할을 나눠서, 사람 마케팅팀과 유사한 협업 프로세스를 AI로 구현해요.',
      pitfall: 'backstory가 너무 모호하면(예: "열심히 일하는 사람") 에이전트 행동이 일관되지 않아요. 구체적인 전문 분야, 경험 연차, 작업 스타일을 포함해서 써야 LLM이 그에 맞는 톤으로 일관되게 응답해요.',
    },
  },
  {
    id: 'pframe-crew-task',
    lang: 'python',
    title: 'CrewAI 작업 정의',
    file: 'crew_task.py',
    code: `from crewai import Agent, Task

print("[실행] CrewAI Task 정의")
researcher = Agent(
  role="연구원",
  goal="주제를 조사해 요약",
  backstory="10년차 연구자야.",
)
task = Task(
  description="파이썬 기초를 3줄로 요약",
  expected_output="3줄 요약문",
  agent=researcher,
)
print(f"[결과] task: {task.description} → {task.agent.role}")`,
    explain: {
      concept:
        'Task(태스크)는 CrewAI에서 특정 에이전트에게 맡기는 구체적인 작업 지시서예요. ' +
        '상사가 직원에게 "이 일을 이런 형식으로 해줘"라고 업무 지시를 내리는 것과 같아요. ' +
        'description으로 구체적인 작업 내용을, expected_output으로 원하는 결과물 형식을, agent로 담당자를 지정해요. ' +
        '여러 Task를 순서대로 배치하면 각 Task가 이전 Task의 출력을 컨텍스트로 받아서 작업을 이어가는 파이프라인이 구성돼요. ' +
        '실무에서는 expected_output을 명확히 정의할수록 LLM이 요구사항에 맞는 출력을 만들어내기 때문에, "반드시 JSON 형식으로", "반드시 3문장 이내로" 같은 구체적인 지시가 효과적이에요.',
      terms: [
        { t: 'Task(...)', d: '에이전트에게 할당할 구체적인 작업을 정의하는 클래스예요.' },
        { t: 'description', d: '에이전트가 수행해야 할 작업의 구체적인 내용이에요. 프롬프트의 핵심 부분이 돼요.' },
        { t: 'expected_output', d: '원하는 결과물의 형태나 기준이에요. "3줄 요약문", "JSON 객체" 등으로 구체화해요.' },
        { t: 'agent=researcher', d: '이 작업을 수행할 담당 에이전트를 지정하는 매개변수예요.' },
      ],
      why:
        '세부 지시 없이 "알아서 해줘"라고 하면 LLM이 엉뚱한 방향으로 작업할 수 있어요. ' +
        'description과 expected_output을 구체적으로 쓰면 에이전트가 무엇을 어떤 형태로 만들어야 하는지 명확히 알고 행동해요.',
      expectedOutput:
        '[실행] CrewAI Task 정의\n' +
        '[결과] task: 파이썬 기초를 3줄로 요약 → 연구원',
      realWorldUsage:
        '보고서 자동 생성 시스템에서 "시장 조사" Task를 분석가 Agent에, "보고서 초안 작성" Task를 작가 Agent에 할당해서, ' +
        '각 Task의 expected_output을 "표와 수치 포함", "경영진 용어 사용" 등으로 차별화하면 품질 높은 보고서가 자동 생성돼요.',
      pitfall: 'agent를 지정하지 않으면 Task가 어떤 에이전트에게도 할당되지 않아서 실행되지 않아요. 모든 Task는 반드시 agent 매개변수에 유효한 Agent 객체를 전달해야 해요.',
    },
  },
  {
    id: 'pframe-crew-flow',
    lang: 'python',
    title: 'CrewAI 크루 실행',
    file: 'crew_flow.py',
    code: `from crewai import Agent, Task, Crew

print("[실행] CrewAI Crew 실행")
researcher = Agent(role="연구원", goal="주제 조사", backstory="연구자")
writer = Agent(role="작가", goal="글 작성", backstory="작가")
task1 = Task(description="파이썬 조사", expected_output="요약", agent=researcher)
task2 = Task(description="보고서 작성", expected_output="보고서", agent=writer)

crew = Crew(
  agents=[researcher, writer],
  tasks=[task1, task2],
  process="sequential",
)
result = crew.kickoff()
print(f"[결과] {result}")`,
    explain: {
      concept:
        'Crew(크루)는 여러 에이전트와 작업을 한 팀으로 묶어서 순차적(sequential) 또는 계층적(hierarchical)으로 실행하게 하는 CrewAI의 최상위 실행 단위예요. ' +
        '프로젝트 팀을 꾸리고 업무를 순서대로 분배하는 PM(프로젝트 매니저)처럼, agents와 tasks를 받아 협업 워크플로우를 구성해요. ' +
        'process="sequential"이면 tasks 리스트 순서대로 하나씩 실행되고, 앞 Task의 출력이 다음 Task의 컨텍스트로 자동 전달돼요. ' +
        'kickoff()는 이 모든 작업을 실제로 시작하는 메서드로, 전체 워크플로우가 끝날 때까지 블로킹(기다림) 실행돼요. ' +
        '실무에서는 여러 전문 LLM 에이전트를 하나의 Crew로 묶어서, 복잡한 다단계 작업을 자동화하는 데 사용해요.',
      terms: [
        { t: 'Crew(...)', d: '여러 Agent와 Task를 하나의 협업 팀으로 구성하는 클래스예요.' },
        { t: 'agents', d: '팀에 소속된 에이전트 리스트예요. 각 Task가 어떤 agent를 가리키는지와 일치해야 해요.' },
        { t: 'tasks', d: '팀이 실행할 Task 리스트예요. process="sequential"이면 이 순서대로 실행돼요.' },
        { t: 'kickoff()', d: 'Crew의 모든 작업을 시작하고 완료될 때까지 기다리는 실행 메서드예요. 최종 결과를 반환해요.' },
        { t: 'process="sequential"', d: '작업 실행 모드예요. sequential은 순차, hierarchical은 관리자 에이전트가 동적 할당해요.' },
      ],
      why:
        '한 에이전트가 복잡한 전체 작업을 혼자 다 하려면 프롬프트가 너무 길어지고 품질도 떨어져요. ' +
        '여러 역할로 나누고 협업하게 하면, 각자 전문 영역에서 더 높은 품질의 결과를 내고 서로 보완할 수 있어요.',
      expectedOutput:
        '[실행] CrewAI Crew 실행\n' +
        '[결과] 파이썬 조사 결과를 바탕으로 작성된 보고서...',
      realWorldUsage:
        '스타트업의 콘텐츠 마케팅 자동화에서 "트렌드 분석 → 아티클 작성 → SEO 최적화 → 이미지 생성 → 최종 검수"까지 5개 Agent를 하나의 Crew로 묶어서, ' +
        '매주 블로그 포스트 한 편이 완전 자동으로 생산되게 할 수 있어요.',
      pitfall: 'Task 순서와 agent 배정이 논리적으로 꼬이면(예: 보고서 작성이 조사보다 먼저 실행) 아무 정보 없이 빈 보고서가 만들어질 수 있어요. Task 간 의존성과 순서를 먼저 설계하고 Crew에 반영해야 해요.',
    },
  },
  {
    id: 'pframe-autogen-conversable',
    lang: 'python',
    title: 'AutoGen 대화형 에이전트',
    file: 'autogen_conversable.py',
    code: `from autogen import ConversableAgent

print("[실행] AutoGen 대화형 에이전트")
assistant = ConversableAgent(
  name="helper",
  system_message="친절하게 답해.",
  llm_config={"config_list": [{"model": "gpt-4o"}]},
)
reply = assistant.generate_reply(messages=[{"role":"user","content":"안녕"}])
print(f"[결과] {reply}")`,
    explain: {
      concept:
        'ConversableAgent는 AutoGen에서 대화에 참여할 수 있는 가장 기본적인 에이전트 단위예요. ' +
        '각 에이전트는 name(식별자), system_message(행동 지침), llm_config(사용할 LLM 설정)를 가지고 있어요. ' +
        'generate_reply()로 메시지를 받아 답변을 생성하고, 이 메시지들은 표준 ChatCompletion 형식({"role": "...", "content": "..."})을 따르기 때문에 어떤 LLM과도 호환돼요. ' +
        'AutoGen은 두 개 이상의 ConversableAgent가 서로 대화하면서 복잡한 문제를 협력적으로 해결하는 패턴을 지향해요. ' +
        '실무에서는 사용자 프록시(UserProxyAgent)와 어시스턴트(AssistantAgent)를 짝지어서, 사람의 승인이 필요한 작업과 자동화할 작업을 조율하는 데 사용해요.',
      terms: [
        { t: 'ConversableAgent', d: '대화할 수 있는 AutoGen 에이전트의 기본 클래스예요. name, system_message, llm_config가 필수예요.' },
        { t: 'name="helper"', d: '에이전트의 고유 식별자예요. 다른 에이전트가 이 이름으로 호출하거나 참조해요.' },
        { t: 'system_message', d: '에이전트 행동의 기본 지침을 담은 프롬프트예요. 역할과 톤을 결정하는 핵심 설정이에요.' },
        { t: 'generate_reply(messages=...)', d: '채팅 메시지 리스트를 받아 LLM이 답변을 생성하게 하는 메서드예요.' },
        { t: 'llm_config', d: '사용할 LLM 모델, API 키, 온도 등 모델 설정을 담은 딕셔너리예요. config_list는 사용 가능한 모델 리스트예요.' },
      ],
      why:
        '단일 LLM 응답과 달리, 여러 에이전트가 대화를 주고받으면 서로 다른 관점을 제시하거나, 한 에이전트의 실수를 다른 에이전트가 수정하는 상호 검증이 가능해져요.',
      expectedOutput:
        '[실행] AutoGen 대화형 에이전트\n' +
        '[결과] 안녕하세요! 무엇을 도와드릴까요?',
      realWorldUsage:
        '코드 리뷰 시스템에서 "코드 작성자" 에이전트가 코드를 생성하면, "리뷰어" 에이전트가 코드를 검토하고 피드백을 주고, ' +
        '"작성자"가 그 피드백을 반영해서 코드를 수정하는 식으로 여러 에이전트가 협업하면서 코드 품질을 높여요.',
      pitfall: 'llm_config를 제공하지 않거나 config_list가 비어 있으면, 에이전트가 LLM 없이 응답하려고 시도해서 빈 응답이나 오류가 발생해요. 최소한 하나의 모델 설정은 반드시 제공해야 해요.',
    },
  },
  {
    id: 'pframe-autogen-groupchat',
    lang: 'python',
    title: 'AutoGen 그룹 채팅',
    file: 'autogen_groupchat.py',
    code: `from autogen import ConversableAgent, GroupChat, GroupChatManager

print("[실행] AutoGen 그룹 채팅 구성")
cfg = {"config_list": [{"model": "gpt-4o"}]}
a1 = ConversableAgent(name="기획자", system_message="기획을 담당해.", llm_config=cfg)
a2 = ConversableAgent(name="개발자", system_message="개발을 담당해.", llm_config=cfg)
a3 = ConversableAgent(name="검토자", system_message="결과를 검토해.", llm_config=cfg)

group = GroupChat(
  agents=[a1, a2, a3],
  messages=[],
  max_round=4,
  speaker_selection_method="round_robin",
)
manager = GroupChatManager(groupchat=group, llm_config=cfg)
print(f"[결과] 참여자: {len(group.agents)}명, 최대 라운드: {group.max_round}")`,
    explain: {
      concept:
        'GroupChat은 여러 ConversableAgent가 한 회의실에서 돌아가며 발언하는 멀티 에이전트 토론 환경이에요. ' +
        '실제 회의처럼 기획자→개발자→검토자 순서로 발언권이 넘어가고, 각자 전문 분야에서 의견을 내요. ' +
        'GroupChatManager는 발언 순서를 조정하는 사회자 역할로, speaker_selection_method에 따라 발언 방식을 결정해요. ' +
        'round_robin은 차례대로 돌아가며 발언하고, auto는 LLM이 대화 내용을 보고 다음 발언자를 동적으로 선택해요. ' +
        'max_round로 전체 대화 라운드를 제한해서 무한 대화와 비용 폭증을 방지해요.',
      terms: [
        { t: 'GroupChat', d: '여러 에이전트가 함께 대화하는 공간을 정의하는 클래스예요.' },
        { t: 'GroupChatManager', d: 'GroupChat의 진행자 역할을 하는 특수 에이전트예요. 발언 순서와 종료 시점을 관리해요.' },
        { t: 'max_round=4', d: '전체 그룹 대화의 최대 발언 횟수를 제한하는 파라미터예요. 4명이 한 번씩 발언하면 종료돼요.' },
        { t: 'speaker_selection_method', d: '다음 발언자를 선택하는 방식을 지정해요. round_robin, auto, manual 중 선택해요.' },
        { t: 'messages=[]', d: '그룹 채팅의 대화 기록을 저장할 리스트예요. initiate_chat() 이후에 대화가 쌓여요.' },
      ],
      why:
        '한 에이전트의 독백보다 여러 관점의 토론이 더 나은 결과를 만들어요. ' +
        'GroupChat은 각자 다른 system_message를 가진 에이전트들이 서로 보완하고 검증하면서, 단일 에이전트보다 훨씬 견고한 결과를 도출할 수 있게 해줘요.',
      expectedOutput:
        '[실행] AutoGen 그룹 채팅 구성\n' +
        '[결과] 참여자: 3명, 최대 라운드: 4',
      realWorldUsage:
        '소프트웨어 설계 검토에서 아키텍트, 시니어 개발자, 보안 전문가, QA 담당자 에이전트가 GroupChat으로 모여서, ' +
        '새로운 기능의 설계 문서를 다각도로 검토하고 잠재적 문제점을 사전에 발견해요. 실제로 사람 회의 전에 AI가 1차 검토를 마쳐서 회의 시간을 단축할 수 있어요.',
      pitfall: 'max_round를 너무 크게 설정하면(예: 100) 대화가 길어지면서 API 비용이 급증하고, 대화가 산으로 갈 위험도 커져요. 주제에 따라 적절한 라운드 수(보통 3~10)로 제한하고, 필요하면 종료 조건을 추가하세요.',
    },
  },
  {
    id: 'pframe-dspy-signature',
    lang: 'python',
    title: 'DSPy 서명 정의',
    file: 'dspy_signature.py',
    code: `import dspy

class QA(dspy.Signature):
  question = dspy.InputField()
  answer = dspy.OutputField()

print("[실행] DSPy 서명 기반 예측")
predict = dspy.Predict(QA)
out = predict(question="파이썬이 뭐야?")
print(f"[결과] {out.answer}")`,
    explain: {
      concept:
        'DSPy의 Signature(서명)는 모듈이 무엇을 입력받고 무엇을 출력할지 선언하는 인터페이스 정의예요. ' +
        '함수의 타입 시그니처처럼 question → answer 형태로 입출력 구조만 명시하면, DSPy가 자동으로 LLM 프롬프트를 구성해줘요. ' +
        'InputField는 모듈이 받을 입력 필드, OutputField는 모듈이 생성할 출력 필드를 나타내요. ' +
        'dspy.Predict(QA)는 서명을 실행 가능한 기본 예측기로 변환하는 팩토리 함수예요. ' +
        '실무에서는 프롬프트 엔지니어링을 직접 하는 대신, Signature만 정의하고 DSPy가 자동으로 최적의 프롬프트를 찾아주는 Declarative Programming 방식을 지향해요.',
      terms: [
        { t: 'dspy.Signature', d: '모듈의 입출력 형태를 선언하는 기반 클래스예요. 어떠한 문제를 풀 것인지 구조만 정의해요.' },
        { t: 'InputField()', d: '모듈이 받을 입력 데이터의 필드를 선언하는 마커예요. 질문·문서·명령 등이 여기에 해당해요.' },
        { t: 'OutputField()', d: '모듈이 생성할 출력 데이터의 필드를 선언하는 마커예요. 답변·요약·분류 결과 등이 여기에 해당해요.' },
        { t: 'dspy.Predict(QA)', d: 'Signature를 받아 실제 LLM 호출 가능한 Predictor 객체로 변환하는 함수예요.' },
        { t: 'predict(question=...)', d: '정의된 서명의 입력 필드명으로 인자를 전달해 예측을 실행해요.' },
      ],
      why:
        '전통적인 방식은 작업마다 프롬프트를 수동으로 작성해야 하는데, 이건 시간도 많이 들고 LLM마다 동작이 달라져요. ' +
        'DSPy는 선언적 시그니처만으로 자동 프롬프트 생성과 최적화를 해줘서, 프롬프트 엔지니어링 부담을 획기적으로 줄여줘요.',
      expectedOutput:
        '[실행] DSPy 서명 기반 예측\n' +
        '[결과] 파이썬은 고수준의 범용 프로그래밍 언어로, 간결하고 읽기 쉬운 문법이 특징입니다.',
      realWorldUsage:
        '감성 분류기 제작 시, "text -> sentiment"라는 시그니처만 정의하면 DSPy가 내부적으로 최적의 프롬프트를 찾아서 분류 정확도를 자동으로 높여줘요. ' +
        '데이터셋만 제공하면 사람이 프롬프트를 수정하지 않아도 성능이 계속 개선돼요.',
      pitfall: '필드 이름이 모호하면(예: stuff → result) LLM이 의도를 제대로 파악하지 못해 출력 품질이 떨어져요. question, context, answer 등 일반적으로 통용되는 명확한 이름을 사용하는 게 좋아요.',
    },
  },
  {
    id: 'pframe-dspy-module',
    lang: 'python',
    title: 'DSPy 모듈 조합',
    file: 'dspy_module.py',
    code: `import dspy

class Summarizer(dspy.Module):
  def __init__(self):
    self.sum = dspy.ChainOfThought("text -> summary")
  def forward(self, text):
    return self.sum(text=text)

print("[실행] DSPy 모듈 실행")
m = Summarizer()
out = m(text="긴 본문...")
print(f"[결과] {out.summary}")`,
    explain: {
      concept:
        'DSPy의 Module은 여러 추론 단계를 하나의 컴포넌트로 캡슐화하는 컨테이너 역할을 해요. ' +
        'PyTorch의 nn.Module과 같은 철학으로, __init__()에서 하위 컴포넌트를 정의하고 forward()에서 실제 실행 흐름을 기술해요. ' +
        'ChainOfThought("text -> summary")는 "text를 입력받아 단계적 사고를 거쳐 summary를 출력하라"는 지시를 내장한 모듈이에요. ' +
        'forward() 메서드는 모듈 호출 시 실제로 실행되는 진입점으로, DSPy가 이 메서드를 통해 학습·컴파일·최적화를 수행해요. ' +
        '실무에서는 여러 모듈을 조립해서 복잡한 NLP 파이프라인을 레고 블록처럼 구성하고, DSPy 컴파일러로 자동 최적화할 수 있어요.',
      terms: [
        { t: 'dspy.Module', d: '여러 추론 단계를 하나의 재사용 가능한 컴포넌트로 묶는 기본 클래스예요.' },
        { t: 'ChainOfThought', d: '단계적 추론(Chain-of-Thought)을 내장한 모듈로, 생각 과정을 거친 후 최종 답변을 생성해요.' },
        { t: '"text -> summary"', d: '화살표(->)로 입력 필드와 출력 필드를 표현하는 간략한 시그니처 문법이에요.' },
        { t: 'forward(self, text)', d: 'DSPy 모듈의 실행 진입점이에요. 반드시 forward라는 이름을 사용해야 해요.' },
        { t: 'out.summary', d: '모듈 출력의 summary 필드에 접근해요. 출력 필드명은 시그니처(-> 뒤 부분)에서 정의돼요.' },
      ],
      why:
        '복잡한 NLP 작업(예: 검색 → 읽기 → 요약 → 평가)을 하나의 큰 함수로 구현하면 재사용과 최적화가 어려워요. ' +
        'DSPy Module로 각 단계를 분리하면, 단계별 독립적 개선, 컴파일 최적화, 단위 테스트가 모두 가능해져요.',
      expectedOutput:
        '[실행] DSPy 모듈 실행\n' +
        '[결과] 본문의 핵심 내용을 간략히 요약한 결과...',
      realWorldUsage:
        '논문 리뷰 시스템에서 "검색 모듈 → 필터 모듈 → 요약 모듈 → 평가 모듈"을 DSPy Module로 조합해서, ' +
        '새 논문이 들어오면 자동으로 관련 문헌 검색, 중복 필터링, 핵심 요약, 품질 평가까지 일괄 처리하는 파이프라인을 구축할 수 있어요.',
      pitfall: 'forward() 메서드 이름을 바꾸면 DSPy가 모듈의 진입점을 찾지 못해서 실행이 안 돼요. 반드시 forward라는 이름을 유지해야 하고, 시그니처도 부모 클래스 생성자에서 선언한 필드명과 일치해야 해요.',
    },
  },
  {
    id: 'pframe-dspy-teleprompter',
    lang: 'python',
    title: 'DSPy 자동 최적화',
    file: 'dspy_teleprompter.py',
    code: `import dspy
from dspy.teleprompt import BootstrapFewShot

print("[실행] DSPy 텔레프롬프터 최적화")

class Summarizer(dspy.Module):
  def __init__(self):
    self.sum = dspy.ChainOfThought("text -> summary")
  def forward(self, text):
    return self.sum(text=text)

train = [dspy.Example(text="2 더하기 2는 수학 연산입니다.", summary="2+2=4").with_inputs("text")]
tele = BootstrapFewShot(metric=lambda x, y, trace=None: y.summary == x.summary)
compiled = tele.compile(Summarizer(), trainset=train)
print(f"[결과] 최적화 완료")`,
    explain: {
      concept:
        '텔레프롬프터(Teleprompter)는 DSPy에서 모듈의 성능을 자동으로 개선해주는 최적화 엔진이예요. ' +
        '마치 요리사가 맛을 보며 양념을 조절하듯, 학습 데이터와 평가 기준(metric)을 보고 최적의 프롬프트와 예시를 찾아줘요. ' +
        "BootstrapFewShot은 DSPy 컴파일러가 제공하는 기본 옵티마이저로, 학습 데이터에서 효과적인 few-shot 예시를 자동으로 선별해 프롬프트에 포함시켜요. " +
        'metric 함수는 모듈의 출력이 얼마나 좋은지 점수를 매기며, True/False로 정확히 일치하는지 검사하는 예시예요. ' +
        'compile()은 원본 Summarizer 모듈을 trainset과 metric을 바탕으로 최적화된 새 모듈(compiled)로 변환하는 과정이에요.',
      terms: [
        { t: 'BootstrapFewShot', d: '효과적인 few-shot 예시를 자동으로 찾아 프롬프트를 개선하는 DSPy 옵티마이저예요.' },
        { t: 'Example(...)', d: '입력(text)과 기대 출력(summary)의 쌍을 담은 학습 데이터 단위예요.' },
        { t: 'with_inputs("text")', d: 'Example에서 어느 필드가 입력인지 지정해요. DSPy 컴파일러가 이 정보로 학습 방향을 결정해요.' },
        { t: 'metric', d: '예측 품질을 평가하는 함수예요. True/False를 반환하거나 0~1 사이 점수를 반환할 수 있어요.' },
        { t: 'tele.compile(...)', d: '모듈과 학습 데이터, 평가 기준을 받아 최적화된 새 모듈을 생성하는 메서드예요.' },
        { t: 'trainset', d: '훈련에 사용할 Example 리스트예요. 이 데이터를 보고 최적의 프롬프트를 탐색해요.' },
      ],
      why:
        '프롬프트를 수동으로 튜닝하는 건 시간이 많이 들고 객관적이지 않아요. DSPy 텔레프롬프터는 데이터 기반 자동 최적화로, ' +
        '수동 튜닝보다 더 높은 성능을 체계적으로 달성할 수 있어요.',
      expectedOutput:
        '[실행] DSPy 텔레프롬프터 최적화\n' +
        '[결과] 최적화 완료',
      realWorldUsage:
        '고객 문의 분류 시스템에서 "이 문의는 환불/교환/기술지원 중 어디에 해당하는가?"라는 분류기를 DSPy로 구현하고, ' +
        '과거 1000건의 상담 데이터로 BootstrapFewShot을 돌리면, 수동으로 프롬프트를 다듬는 것보다 분류 정확도가 5~10%p 더 높아져요.',
      pitfall: 'metric이 부정확하면(예: 항상 True 반환, 엉뚱한 조건 비교) DSPy가 잘못된 방향으로 최적화해요. metric은 실제 비즈니스 요구사항과 정확히 일치해야 하고, 충분한 대표성을 가진 trainset으로 평가해야 해요.',
    },
  },
];
