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

llm = ChatOpenAI(model="gpt-4o-mini")
prompt = PromptTemplate.from_template("{topic}에 대해 한 줄로 설명해 줘")
chain = prompt | llm | StrOutputParser()
result = chain.invoke({"topic": "파이썬"})`,

    explain: {
      concept: '체인(Chain)은 프롬프트와 모델을 | 기호로 이어 붙여 하나의 흐름으로 만드는 거예요. 파이프 연결해 물을 보내듯 입력이 단계마다 흘러가요.',
      terms: [
        { t: 'PromptTemplate', d: '빈칸(변수)이 있는 글틀(프롬프트 틀)이에요.' },
        { t: 'ChatOpenAI', d: 'OpenAI 채팅 모델을 불러오는 클래스예요.' },
        { t: 'StrOutputParser', d: '모델 결과에서 글자만 뽑아내는 변환기예요.' },
        { t: 'chain.invoke', d: '값을 딕셔너리로 넣어 체인을 실행해요.' }
      ],
      why: '프롬프트·모델·파서를 따로 호출하지 않고 | 기호로 한 줄로 이어 재사용할 수 있어요.',
      pitfall: 'invoke에 빈칸 이름과 똑같은 키를 딕셔너리로 넘겨야 해요.'
    }
  },
  {
    id: 'pframe-lcel-pipe',
    lang: 'python',
    title: 'LCEL 파이프 연결',
    file: 'lcel_pipe.py',
    code: `from langchain_core.prompts import PromptTemplate
from langchain_core.output_parsers import StrOutputParser
from langchain_openai import ChatOpenAI

llm = ChatOpenAI(model="gpt-4o-mini")
prompt = PromptTemplate.from_template("{q}를 요약해 줘")
chain = prompt | llm | StrOutputParser()
out = chain.invoke({"q": "LangChain"})`,

    explain: {
      concept: 'LCEL은 | 기호로 요소들을 연결하는 방식이에요. 리눅스 파이프처럼 앞 결과가 뒤로 흘러들어가요.',
      terms: [
        { t: '|', d: '앞의 결과를 뒤로 보내는 연결 기호(파이프)예요.' },
        { t: 'from_template', d: '문장에서 중괄호 빈칸을 가진 틀을 만들어요.' },
        { t: 'StrOutputParser', d: '모델 결과에서 글자만 뽑아내는 변환기예요.' },
        { t: 'invoke', d: '체인에 값을 넣어 실행하는 메서드예요.' }
      ],
      why: '요소를 조립하듯 연결해서 복잡한 흐름도 한 줄로 표현할 수 있어요.',
      pitfall: '파이프 순서가 바뀌면 결과 형태가 안 맞아 에러가 나요.'
    }
  },
  {
    id: 'pframe-runnable-passthrough',
    lang: 'python',
    title: 'RunnablePassthrough 전달',
    file: 'runnable_passthrough.py',
    code: `from langchain_core.runnables import RunnablePassthrough
from langchain_openai import ChatOpenAI

llm = ChatOpenAI(model="gpt-4o-mini")
chain = RunnablePassthrough() | llm
out = chain.invoke("안녕")`,

    explain: {
      concept: 'RunnablePassthrough는 받은 값을 그대로 다음으로 넘기는 통로예요. 투명한 창문처럼 흐름을 끊지 않고 값을 통과시켜요.',
      terms: [
        { t: 'RunnablePassthrough', d: '입력값을 변환 없이 그대로 넘기는 실행 단위예요.' },
        { t: 'Runnable', d: 'LCEL에서 연결 가능한 기본 블록이에요.' },
        { t: 'invoke', d: '실행 단위에 값을 넣어 돌려요.' }
      ],
      why: '파이프 중간에 값을 가공하지 않고 그대로 전달해야 할 때 자리를 지켜줘요. RunnableParallel과 함께 원본 값을 보존할 때 자주 써요.',
      pitfall: '값을 가공하지 않으니 뒤에서 형태가 맞아야 해요.'
    }
  },
  {
    id: 'pframe-runnable-parallel',
    lang: 'python',
    title: 'RunnableParallel 병렬 실행',
    file: 'runnable_parallel.py',
    code: `from langchain_core.runnables import RunnableParallel, RunnablePassthrough

chain = RunnableParallel(
  origin=RunnablePassthrough(),
  upper=lambda x: x.upper(),
)
out = chain.invoke("hi")`,

    explain: {
      concept: 'RunnableParallel은 같은 입력을 여러 갈래로 동시에 보내요. 한 사람이 도시락을 여러 칸에 동시에 담는 것과 같아요.',
      terms: [
        { t: 'RunnableParallel', d: '여러 실행 단위를 동시에 돌리는 블록이에요.' },
        { t: 'origin', d: '병렬 결과 중 한 갈래의 이름이에요.' },
        { t: 'lambda x', d: '간단하게 한 줄로 만든 변환 함수예요.' }
      ],
      why: '한 번에 여러 변환이 필요할 때 갈래를 나눠 처리할 수 있어요.',
      pitfall: '각 갈래의 이름 키가 결과 딕셔너리의 키가 돼요.'
    }
  },
  {
    id: 'pframe-prompt-template',
    lang: 'python',
    title: 'PromptTemplate 빈칸 채우기',
    file: 'prompt_template.py',
    code: `from langchain_core.prompts import PromptTemplate

p = PromptTemplate(
  input_variables=["name"],
  template="{name}님, 환영합니다!",
)
text = p.format(name="지훈")`,

    explain: {
      concept: 'PromptTemplate은 빈칸이 있는 문장 틀이에요. 초대장에 이름만 나중에 적어 넣는 것과 같아요.',
      terms: [
        { t: 'input_variables', d: '빈칸으로 둘 단어 이름 목록이에요.' },
        { t: 'template', d: '중괄호 빈칸이 들어간 문장 틀이에요.' },
        { t: 'format', d: '빈칸을 실제 값으로 채워 완성된 글을 만들어요.' }
      ],
      why: '같은 틀에 다른 값만 넣어 여러 프롬프트를 만들 수 있어요.',
      pitfall: '빈칸 이름과 format에 넘긴 키가 달라서는 안 돼요.'
    }
  },
  {
    id: 'pframe-chat-prompt',
    lang: 'python',
    title: 'ChatPromptTemplate 대화 틀',
    file: 'chat_prompt.py',
    code: `from langchain_core.prompts import ChatPromptTemplate

tpl = ChatPromptTemplate.from_messages([
  ("system", "너는 친절한 비서야."),
  ("user", "{question}"),
])
msgs = tpl.format_messages(question="안녕?")`,

    explain: {
      concept: 'ChatPromptTemplate은 역할별(시스템, 사용자) 대화 줄을 틀로 만드는 거예요. 대본의 인물별 대사 칸을 미리 만들어두는 것과 같아요.',
      terms: [
        { t: 'from_messages', d: '역할과 내용 쌍으로 대화 틀을 만들어요.' },
        { t: 'system', d: 'AI의 기본 성격이나 규칙을 정하는 역할이에요.' },
        { t: 'user', d: '사용자가 묻는 역할이에요.' },
        { t: 'format_messages', d: '빈칸을 채워 대화 메시지 리스트로 완성해요.' }
      ],
      why: '대화형 모델은 역할이 있는 메시지를 받아서 틀이 필요해요.',
      pitfall: '역할 이름은 system, user, assistant 등 정해진 값만 써요.'
    }
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

parser = PydanticOutputParser(pydantic_object=Info)
data = parser.parse('{"name": "김철수", "age": 25}')`,

    explain: {
      concept: '출력 파서는 모델이 뱉은 글을 정해진 형태(객체)로 바꿔요. 주문서의 글을 양식에 맞춰 표로 옮기는 것과 같아요.',
      terms: [
        { t: 'BaseModel', d: 'Pydantic에서 데이터 형태를 정의하는 틀이에요.' },
        { t: 'name: str', d: '이름 필드가 글자여야 함을 정해요.' },
        { t: 'PydanticOutputParser', d: '모델 결과를 Pydantic 객체로 바꿔주는 변환기예요.' },
        { t: 'parse', d: '글을 받아 정해진 형태의 객체로 만들어요.' }
      ],
      why: '모델 결과를 프로그램에서 안전하게 다루려면 형태를 고정해야 해요.',
      pitfall: '모델이 형태를 안 지키면 파싱 에러가 나요.'
    }
  },
  {
    id: 'pframe-streaming',
    lang: 'python',
    title: 'LCEL 스트리밍 출력',
    file: 'streaming.py',
    code: `# 앞 예제에서 정의된 prompt, llm, StrOutputParser 사용
from langchain_core.prompts import PromptTemplate
from langchain_core.output_parsers import StrOutputParser
from langchain_openai import ChatOpenAI

llm = ChatOpenAI(model="gpt-4o-mini")
prompt = PromptTemplate.from_template("{q}를 설명해 줘")
chain = prompt | llm | StrOutputParser()
for chunk in chain.stream({"q": "파이썬"}):
  print(chunk, end="")`,

    explain: {
      concept: 'stream은 결과가 만들어지는 대로 조금씩 흘려 보내요. 물을 한 번에 받지 않고 호스로 흐르는 대로 받는 것과 같아요.',
      terms: [
        { t: 'stream', d: '결과를 조각(chunk) 단위로 나눠 보내는 메서드예요.' },
        { t: 'chunk', d: '결과의 작은 조각이에요.' },
        { t: 'end=""', d: 'print가 줄바꿈하지 않게 끝 문자를 빈 문자로 정해요.' }
      ],
      why: '전체가 끝날 때까지 기다리지 않고 빠르게 첫 글자를 볼 수 있어요.',
      pitfall: 'chunk는 글자 단위가 아닐 수 있어요.'
    }
  },
  {
    id: 'pframe-memory-buffer',
    lang: 'python',
    title: 'ConversationBufferMemory',
    file: 'memory_buffer.py',
    code: `from langchain.memory import ConversationBufferMemory

mem = ConversationBufferMemory()
mem.save_context({"input": "안녕"}, {"output": "반가워"})
history = mem.load_memory_variables({})`,

    explain: {
      concept: '대화 내용을 통째로 기억하는 메모리예요. 채팅창의 대화 기록을 그대로 저장해두는 것과 같아요.',
      terms: [
        { t: 'ConversationBufferMemory', d: '대화를 통째로 담아두는 기억 창고예요.' },
        { t: 'save_context', d: '입력과 출력 한 쌍을 기억에 추가해요.' },
        { t: 'load_memory_variables', d: '저장된 대화 기록을 꺼내 보여줘요.' }
      ],
      why: '이전 대화를 참고하면 문맥을 잃지 않고 답할 수 있어요.',
      pitfall: '대화가 길어지면 기억이 계속 커져 비용이 늘어요.'
    }
  },
  {
    id: 'pframe-llamaindex-doc',
    lang: 'python',
    title: 'LlamaIndex 문서 로드',
    file: 'llama_doc.py',
    code: `from llama_index.core import Document, VectorStoreIndex

doc = Document(text="파이썬은 쉬운 언어입니다.")
index = VectorStoreIndex.from_documents([doc])
engine = index.as_query_engine()
answer = engine.query("파이썬이 뭐야?")`,

    explain: {
      concept: 'LlamaIndex는 문서를 모아 색인(인덱스)을 만들고 질문하면 해당 부분을 찾아 답해요. 책 뒤의 찾아보기 표를 만들어두는 것과 같아요.',
      terms: [
        { t: 'Document', d: '한 덩어리의 글을 담는 자료 단위예요.' },
        { t: 'VectorStoreIndex', d: '문서를 벡터로 변환해 검색 가능하게 만든 색인이에요.' },
        { t: 'from_documents', d: '문서 목록으로 색인을 만들어요.' },
        { t: 'as_query_engine', d: '색인을 질문-답변 엔진으로 바꿔요.' }
      ],
      why: '긴 문서에서 필요한 부분만 빠르게 찾아 답할 수 있어요.',
      pitfall: '문서에 없는 내용은 답을 못 하거나 지어낼 수 있어요.'
    }
  },
  {
    id: 'pframe-llamaindex-nodes',
    lang: 'python',
    title: 'LlamaIndex 노드 분할',
    file: 'llama_nodes.py',
    code: `from llama_index.core import Document
from llama_index.core.node_parser import SentenceSplitter

doc = Document(text="긴 글입니다. " * 50)
parser = SentenceSplitter(chunk_size=100)
nodes = parser.get_nodes_from_documents([doc])`,

    explain: {
      concept: '노드(Node)는 문서를 작게 쪼갠 한 조각이에요. 큰 책을 페이지 단위로 나눠 읽기 쉽게 하는 것과 같아요.',
      terms: [
        { t: 'SentenceSplitter', d: '문서를 문장 기준으로 작은 노드로 쪼개는 도구예요.' },
        { t: 'chunk_size', d: '한 노드의 글자 수 기준이에요.' },
        { t: 'get_nodes_from_documents', d: '문서를 받아 노드 목록으로 만들어요.' }
      ],
      why: '작게 쪼개야 검색이 정확하고 모델이 처리하기 쉬워요.',
      pitfall: '너무 작게 자르면 문맥이 끊겨요.'
    }
  },
  {
    id: 'pframe-llamaindex-chat',
    lang: 'python',
    title: 'LlamaIndex 챗 엔진',
    file: 'llama_chat.py',
    code: `from llama_index.core import VectorStoreIndex, Document

# 색인 초기화 (앞 예제에서 이어지는 경우 생략 가능)
index = VectorStoreIndex.from_documents([
  Document(text="파이썬은 쉽고 강력한 프로그래밍 언어입니다.")
])

engine = index.as_chat_engine(chat_mode="context")
resp = engine.chat("한 줄로 설명해 줘")
follow = engine.chat("더 자세히")`,

    explain: {
      concept: '챗 엔진은 대화를 이어가며 문서를 참고해 답해요. 도서관 사서와 대화하듯 이어서 물을 수 있어요.',
      terms: [
        { t: 'as_chat_engine', d: '색인을 대화형 엔진으로 바꿔요.' },
        { t: 'chat_mode', d: '대화 방식(문맥 유지 등)을 정해요.' },
        { t: 'chat', d: '한 번의 대화를 보내고 답을 받아요.' }
      ],
      why: '한 번 질문으로 끝이 아니라 꼬리질문을 이어갈 수 있어요.',
      pitfall: '문맥이 길어지면 이전 발언이 밀려 사라질 수 있어요.'
    }
  },
  {
    id: 'pframe-crew-role',
    lang: 'python',
    title: 'CrewAI 역할 정의',
    file: 'crew_role.py',
    code: `from crewai import Agent

researcher = Agent(
  role="연구원",
  goal="주제를 조사해 요약",
  backstory="10년차 연구자야.",
)`,

    explain: {
      concept: 'CrewAI에서 에이전트는 하나의 역할(직책)을 가진 일꾼이에요. 극장 배우에게 대본과 성격을 정해주는 것과 같아요.',
      terms: [
        { t: 'Agent', d: '역할을 가진 AI 일꾼을 만드는 클래스예요.' },
        { t: 'role', d: '에이전트의 직함이에요.' },
        { t: 'goal', d: '에이전트가 이뤄야 할 목표예요.' },
        { t: 'backstory', d: '에이전트의 성격과 배경 설명이에요.' }
      ],
      why: '역할과 목표가 명확해야 행동이 일관돼요.',
      pitfall: 'backstory가 모호하면 행동 방향이 흔들려요.'
    }
  },
  {
    id: 'pframe-crew-task',
    lang: 'python',
    title: 'CrewAI 작업 정의',
    file: 'crew_task.py',
    code: `from crewai import Agent, Task

# 앞 예제에서 정의된 researcher 에이전트 사용
researcher = Agent(
  role="연구원",
  goal="주제를 조사해 요약",
  backstory="10년차 연구자야.",
)

task = Task(
  description="파이썬 기초를 3줄로 요약",
  expected_output="3줄 요약문",
  agent=researcher,
)`,

    explain: {
      concept: '태스크(Task)는 한 에이전트에게 맡기는 구체적 일거리예요. 작업 지시서에 담당자와 결과 형태를 적어 돌리는 것과 같아요.',
      terms: [
        { t: 'Task', d: '에이전트에게 맡길 일을 정의하는 단위예요.' },
        { t: 'description', d: '구체적으로 해야 할 일 설명이에요.' },
        { t: 'expected_output', d: '원하는 결과물의 형태를 정해요.' },
        { t: 'agent', d: '이 작업을 맡을 담당 에이전트예요.' }
      ],
      why: '일의 범위와 결과 형태를 정해두면 결과가 흐트러지지 않아요.',
      pitfall: '담당 에이전트를 안 정하면 일이 할당되지 않아요.'
    }
  },
  {
    id: 'pframe-crew-flow',
    lang: 'python',
    title: 'CrewAI 크루 실행',
    file: 'crew_flow.py',
    code: `from crewai import Agent, Task, Crew

# 앞 예제에서 이어지는 에이전트와 작업 정의
researcher = Agent(role="연구원", goal="주제 조사", backstory="연구자")
writer = Agent(role="작가", goal="글 작성", backstory="작가")
task1 = Task(description="파이썬 조사", expected_output="요약", agent=researcher)
task2 = Task(description="보고서 작성", expected_output="보고서", agent=writer)

crew = Crew(
  agents=[researcher, writer],
  tasks=[task1, task2],
  process="sequential",
)
result = crew.kickoff()`,

    explain: {
      concept: '크루(Crew)는 여러 에이전트와 작업을 묶어 한 팀으로 움직이게 해요. 프로젝트 팀을 꾸려 업무를 분담하는 것과 같아요.',
      terms: [
        { t: 'Crew', d: '에이전트와 작업을 한 팀으로 묶는 클래스예요.' },
        { t: 'agents', d: '팀에 속한 일꾼 목록이에요.' },
        { t: 'tasks', d: '팀이 처리할 작업 목록이에요.' },
        { t: 'kickoff', d: '팀의 일을 시작(실행)하는 메서드예요.' }
      ],
      why: '여러 역할이 협력하면 한 명이 못 하는 복잡한 일을 해낼 수 있어요.',
      pitfall: '작업 순서와 담당 연결이 어긋나면 결과가 꼬여요.'
    }
  },
  {
    id: 'pframe-autogen-conversable',
    lang: 'python',
    title: 'AutoGen 대화형 에이전트',
    file: 'autogen_conversable.py',
    code: `from autogen import ConversableAgent

assistant = ConversableAgent(
  name="helper",
  system_message="친절하게 답해.",
  llm_config={"config_list": [{"model": "gpt-4o"}]},
)
assistant.generate_reply(messages=[{"role":"user","content":"안녕"}])`,

    explain: {
      concept: 'ConversableAgent는 서로 대화할 수 있는 AI 일꾼이에요. 무전기로 대화하는 사람처럼 메시지를 주고받아요.',
      terms: [
        { t: 'ConversableAgent', d: '대화가 가능한 에이전트 클래스예요.' },
        { t: 'system_message', d: '에이전트의 행동 규칙을 정해요.' },
        { t: 'llm_config', d: '어떤 모델을 쓸지 설정하는 딕셔너리예요.' },
        { t: 'generate_reply', d: '메시지를 받아 답을 만들어요.' }
      ],
      why: '에이전트끼리 주고받으며 더 깊은 답을 만들 수 있어요.',
      pitfall: 'llm_config를 안 주면 모델 없이 답하려 해요.'
    }
  },
  {
    id: 'pframe-autogen-groupchat',
    lang: 'python',
    title: 'AutoGen 그룹 채팅',
    file: 'autogen_groupchat.py',
    code: `from autogen import ConversableAgent, GroupChat, GroupChatManager

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
a1.initiate_chat(manager, message="기획을 시작해")`,

    explain: {
      concept: 'GroupChat은 여러 에이전트가 한 방에서 돌아가며 말하는 거예요. 회의실에 참석자가 돌아가며 발언하는 것과 같아요.',
      terms: [
        { t: 'GroupChat', d: '여러 에이전트가 함께 대화하는 방이에요.' },
        { t: 'GroupChatManager', d: '발언 순서를 정해주는 진행자예요.' },
        { t: 'max_round', d: '최대 몇 번 주고받을지 한계예요.' },
        { t: 'speaker_selection_method', d: '발언 순서 방식을 정해요. round_robin은 차례대로 돌아가요.' }
      ],
      why: '여러 역할이 돌아가며 의견을 내어 더 나은 결과를 얻을 수 있어요.',
      pitfall: 'max_round를 너무 크게 하면 대화가 끝나지 않아요.'
    }
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

predict = dspy.Predict(QA)
out = predict(question="파이썬이 뭐야?")`,

    explain: {
      concept: '서명(Signature)은 입력과 출력의 형태만 선언하는 계약서예요. 함수의 시그니처처럼 무엇을 넣고 무엇을 받을지 정해요.',
      terms: [
        { t: 'dspy.Signature', d: '입출력 형태를 선언하는 틀이에요.' },
        { t: 'InputField', d: '입력으로 받을 필드를 정해요.' },
        { t: 'OutputField', d: '출력으로 낼 필드를 정해요.' },
        { t: 'dspy.Predict', d: '서명을 실행 가능한 예측기로 만들어요.' }
      ],
      why: '프롬프트를 직접 짜지 않고 입출력만 정의해도 동작해요.',
      pitfall: '필드 이름이 모호하면 모델이 의도를 헷갈려요.'
    }
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

m = Summarizer()
out = m(text="긴 본문...")`,

    explain: {
      concept: 'Module은 여러 단계를 한 덩어리로 묶은 파이프라인이에요. 레고 블록을 이어 하나의 장난감을 만드는 것과 같아요.',
      terms: [
        { t: 'dspy.Module', d: '여러 단계를 묶는 컨테이너 클래스예요.' },
        { t: 'ChainOfThought', d: '생각 과정을 거쳐 답을 내는 단계예요.' },
        { t: 'forward', d: '실행 시 실제로 일어나는 흐름을 정의해요.' },
        { t: 'text -> summary', d: '입력과 출력을 화살표로 적는 서명이에요.' }
      ],
      why: '복잡한 흐름을 한 단위로 재사용하고 최적화할 수 있어요.',
      pitfall: 'forward 이름을 바꾸면 DSPy가 실행을 못 해요.'
    }
  },
  {
    id: 'pframe-dspy-teleprompter',
    lang: 'python',
    title: 'DSPy 자동 최적화',
    file: 'dspy_teleprompter.py',
    code: `import dspy
from dspy.teleprompt import BootstrapFewShot

# 앞 예제의 Summarizer 클래스 사용
class Summarizer(dspy.Module):
  def __init__(self):
    self.sum = dspy.ChainOfThought("text -> summary")
  def forward(self, text):
    return self.sum(text=text)

train = [dspy.Example(text="2 더하기 2는 수학 연산입니다.", summary="2+2=4").with_inputs("text")]
tele = BootstrapFewShot(metric=lambda x, y, trace=None: y.summary == x.summary)
compiled = tele.compile(Summarizer(), trainset=train)`,

    explain: {
      concept: '텔레프롬프터(Teleprompter)는 예시와 평가 기준으로 프로그램을 자동 개선해요. 요리사가 맛보고 양념을 스스로 조절하듯 최적화해요.',
      terms: [
        { t: 'BootstrapFewShot', d: '좋은 예시를 뽑아 프로그램을 개선하는 도구예요.' },
        { t: 'Example', d: '입출력 한 쌍의 학습 예시예요.' },
        { t: 'with_inputs', d: '어느 필드가 입력인지 표시해요.' },
        { t: 'metric', d: '결과가 좋은지 점수 매기는 함수예요.' },
        { t: 'compile', d: '학습 데이터로 프로그램을 최적화해요.' }
      ],
      why: '직접 프롬프트를 손보지 않아도 성능이 올라가요.',
      pitfall: 'metric이 정확하지 않으면 잘못된 방향으로 개선돼요.'
    }
  }
];
