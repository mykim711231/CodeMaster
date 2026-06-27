export type Lang = 'java' | 'python';

// 코드 요소(키워드·기호) 설명 — 입문자용 "코드 뜯어보기"
export interface Term {
  t: string; // 코드 요소 (예: "@Entity", "final", "->")
  d: string; // 쉬운 설명
}

// 문제 설명 — 우패널에 표시(입문자 언어 습득용)
export interface Explain {
  concept: string; // 쉬운 말·비유로 개념 설명
  terms?: Term[]; // 코드 뜯어보기 (요소별)
  why?: string; // 왜/언제 쓰나
  pitfall?: string; // 입문자가 자주 틀리는 부분
}

export interface Snippet {
  id: string;
  lang: Lang;
  title: string; // 문제 제목 (예: "JPA Entity")
  file: string; // 파일 탭 이름 (예: "UserEntity.java")
  code: string; // 따라칠 목표 코드
  explain?: Explain; // 문제 설명 (선택)
}

export interface Level {
  no: number; // 레벨 번호
  name: string; // 레벨 이름 (예: "Database — JPA")
  snippets: Snippet[]; // 해당 레벨의 문제 목록 (비어 있으면 준비중)
}

export interface Pack {
  id: string;
  name: string; // 학습팩 이름 (예: "Spring Boot")
  lang: Lang;
  levels: Level[];
}
