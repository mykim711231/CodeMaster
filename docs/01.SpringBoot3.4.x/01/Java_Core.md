# Java Core

## Official Documentation
- [The Java Tutorials](https://docs.oracle.com/javase/tutorial/)

## 핵심 개념
> Java는 플랫폼 독립적인 객체지향 프로그래밍 언어로, JVM 위에서 동작하며 강타입(type-safe) 언어입니다. 기본 문법, 자료형, 제어 흐름을 익히는 것이 Spring Boot 학습의 기초가 됩니다.

## 학습 목표
- 기본 자료형(primitive)과 참조형(reference type)의 차이 이해
- 클래스, 상속, 인터페이스를 활용한 객체지향 프로그래밍 작성
- javac/javac 도구를 이용한 컴파일 및 실행

## 예제 코드
```java
// Main.java
public class Main {
    public static void main(String[] args) {
        Calculator calc = new Calculator();
        System.out.println("10 + 5 = " + calc.add(10, 5));
        System.out.println("10 - 5 = " + calc.subtract(10, 5));
    }
}

interface Operation {
    int operate(int a, int b);
}

class Calculator implements Operation {
    public int add(int a, int b) {
        return a + b;
    }

    public int subtract(int a, int b) {
        return a - b;
    }

    @Override
    public int operate(int a, int b) {
        return add(a, b);
    }
}
```

## 주요 패턴
- 캡슐화(Encapsulation): 필드를 private으로 선언하고 public getter/setter 제공
- 불변 객체(Immutable Object): 모든 필드를 final로 선언하고 생성자로만 초기화

## 주의사항
- `==`은 참조 비교, `equals()`는 값 비교임을 혼동하지 말 것
- null 참조로 메서드 호출 시 NullPointerException 발생에 주의할 것
