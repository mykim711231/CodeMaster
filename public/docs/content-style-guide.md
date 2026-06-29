# CodeMaster 학습 콘텐츠 스타일 가이드 v2

> **작성일**: 2026-06-28
> **적용 대상**: `src/content/packs/_staging/` 35개 파일 (Spring Boot 20 + Python AI 15)
> **총 문제 수**: 707문제
> **목표**: 입문자가 타이핑 연습과 동시에 언어를 습득할 수 있는 설명 제공

---

## 1. 핵심 원칙

1. **실제 구동 가능한 코드** — import 포함, `javac --release 21` / `ruff check` 검증
2. **타이핑 + 언어 습득** — 단순 따라치기가 아닌, 코드 읽기 능력 향상
3. **입문자 가독성** — 개발 서적 스타일의 친절한 설명
4. **예상 결과 제시** — 코드 실행 시 콘솔 출력을 통해 동작 유추 가능

---

## 2. 코드 규칙

### 2.1 기본 규칙
- Java 21 · Spring Boot 3.4.x · Gradle 8 / Python 3.12
- 길이: 5~15줄. 한 문제 = 한 패턴에 집중
- **import 문 포함** (단독 컴파일 가능해야 함)
- 백틱(`)과 `${}`는 code 내에 절대 사용 금지

### 2.2 디버깅 출력 포함
- 모든 예제에 `System.out.println()` / `print()` 디버깅 출력 추가
- `[실행]`, `[결과]`, `[완료]` 등 태그로 구분
- 2~3줄 이내로 제한 (5~15줄 제한 초과 방지)

**Java 예시**:
```java
System.out.println("[실행] join() 호출 — name: " + name);
System.out.println("[결과] 생성된 ID: " + id);
```

**Python 예시**:
```python
print(f"[실행] connect() 호출 — host: {host}")
print(f"[결과] 연결 성공: {result}")
```

### 2.3 공식 소스 기반 (향후)
- Spring PetClinic, MyBatis Samples, FastAPI 등 공식 예제에서 발췌
- Apache 2.0 / MIT 라이선스 확인
- 출처(repo·sha·path) 메타데이터 필수

---

## 3. 설명 규칙 — 개발 서적 스타일

### 3.1 Explain 인터페이스 (신규 필드 포함)

```typescript
interface Explain {
  concept: string;            // 개념 설명 (개발 서적 스타일, 3~6문장)
  terms?: Term[];             // 코드 요소별 설명 (4~6개)
  why?: string;               // 왜/언제 쓰나 (실무 맥락)
  expectedOutput?: string;    // [신규] 콘솔 출력 예상 결과
  realWorldUsage?: string;    // [신규] 실무 연계 상황
  pitfall?: string;           // 입문자 주의사항
}
```

### 3.2 concept 작성법
- "무엇이다"가 아닌 "무엇 + 왜 + 배경 + 실무 연계"를 대화체로
- 3~6문장, 150~400자, "~해요" 체
- 전문용어는 괄호로 즉시 풀이
- "여러분이 ~하면" 같은 대화체 혼용

### 3.3 terms 작성법
- 키워드 사전이 아닌, "코드의 이 부분이 하는 역할"을 설명
- 20~50자, 대화체, "~해요" 체
- 최소 4개, 최대 6개

### 3.4 expectedOutput 작성법 (신규)
- 코드 실행 시 콘솔 출력을 보여줘 동작 유추 가능하게 함
- 코드의 `println`/`print` 출력과 1:1 대응
- 실제 실행 가능한 값으로 작성

### 3.5 realWorldUsage 작성법 (신규)
- 이 패턴이 실제 프로젝트에서 어떤 상황에 등장하는지 구체적 예시
- "실제 프로젝트에서 ~할 때 이 메서드가 호출돼요" 형식

### 3.6 어조 통일
- 모든 설명은 "~예요", "~해요" 체
- "~죠", "~네요" 같은 반말 금지

---

## 4. 완료 예시

```typescript
{
  id: 'sc-service',
  lang: 'java',
  title: '@Service 계층 표시',
  file: 'UserService.java',
  code: `package com.codemaster.user;

import org.springframework.stereotype.Service;

@Service
public class UserService {

    public Long join(String name) {
        System.out.println("[실행] join() 호출 — name: " + name);
        Long newId = System.currentTimeMillis();
        System.out.println("[결과] 생성된 ID: " + newId);
        return newId;
    }
}`,
  explain: {
    concept:
      '이 UserService 클래스는 "사용자 관련 비즈니스 로직"을 처리하는 곳이에요. ' +
      '@Service를 붙여두면 스프링이 이 클래스를 찾아서 객체로 만들어주고, ' +
      '다른 클래스에서 필요하다고 요청하면 그때그때 주입해줘요. ' +
      '@Service와 @Component는 기능이 똑같은데, @Service라고 쓰는 이유는 ' +
      '"이 클래스는 비즈니스 로직을 담당해요"라고 코드 읽는 사람에게 알려주기 위해서예요. ' +
      '식당으로 비유하면 주방장의 명찰 같은 거예요 — 같은 직원이지만 역할이 다르다는 걸 보여주죠.',
    terms: [
      { t: '@Service', d: '없으면 스프링이 이 클래스를 모르고 지나가요. 이걸 붙이면 스프링이 알아서 객체로 만들어줘요.' },
      { t: 'public Long join', d: '회원가입을 처리하는 메서드예요. String 이름을 받아서 Long 타입 ID를 반환해요.' },
      { t: 'System.out.println', d: '괄호 안의 내용을 콘솔에 출력해요. 디버깅할 때 가장 많이 쓰는 방법이에요.' },
      { t: 'System.currentTimeMillis()', d: '1970년 1월 1일부터 지금까지 흐른 시간을 밀리초로 반환해요.' },
      { t: 'Long', d: '아주 큰 정수를 담을 수 있는 타입이에요. int보다 훨씬 큰 범위를 표현할 수 있어요.' },
    ],
    why:
      'Controller → Service → Repository로 이어지는 3계층 구조에서 Service는 핵심 비즈니스 규칙을 ' +
      '담당해요. "회원가입 시 이름이 2글자 이상이어야 한다" 같은 규칙을 여기에 작성해요.',
    expectedOutput:
      'join("kim") 호출 시:\n' +
      '[실행] join() 호출 — name: kim\n' +
      '[결과] 생성된 ID: 1719552000000',
    realWorldUsage:
      '실제 프로젝트의 UserController에서 POST /users 요청을 받으면 이 join() 메서드가 호출돼요. ' +
      '회원가입 버튼 하나가 이 메서드까지 도달하는 거죠.',
    pitfall:
      '@Service 자체가 트랜잭션을 걸어주진 않아요. DB 저장이 필요하면 @Transactional을 별도로 붙여야 해요.',
  },
}
```

---

## 5. 작업 순서

### Phase 1: 기반 작업
1. `src/content/types.ts` 업데이트 (신규 필드 추가)
2. `src/trainer.ts` 우측 패널 렌더링 업데이트
3. 컴파일 + 빌드 검증

### Phase 2: 변환 작업 (병렬)
- Spring Boot L2~L5 (4파일) → 1차 변환 + 검토
- 나머지 31파일 → 2차 일괄 변환

### Phase 3: 검증
- `npx tsc --noEmit` + `npm run build`
- GitHub Pages 배포 확인
