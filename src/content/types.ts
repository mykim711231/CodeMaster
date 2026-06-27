export type Lang = 'java' | 'python';

export interface Snippet {
  id: string;
  lang: Lang;
  title: string; // 연습 제목 접미사 (예: "JPA Entity")
  file: string; // 파일 탭 이름 (예: "UserEntity.java")
  code: string; // 따라칠 목표 코드
}

export interface Pack {
  id: string;
  name: string; // 제목 접두사 (예: "Spring Boot")
  lang: Lang;
  snippets: Snippet[];
}
