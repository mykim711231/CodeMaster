export type Lang = 'java' | 'python';

export interface Snippet {
  id: string;
  lang: Lang;
  title: string; // 문제 제목 (예: "JPA Entity")
  file: string; // 파일 탭 이름 (예: "UserEntity.java")
  code: string; // 따라칠 목표 코드
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
