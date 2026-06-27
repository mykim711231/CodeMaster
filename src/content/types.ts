export type Lang = 'java' | 'python';

// 문제 설명 — 우패널에 표시(언어 습득용)
export interface Explain {
  concept: string; // 한 줄 개념
  points?: string[]; // 핵심 포인트
  pitfall?: string; // 자주 틀리는 부분
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
