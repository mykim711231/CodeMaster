import type { Snippet } from '../../types';

export const javaCore: Snippet[] = [
  {
    id: 'jc-class',
    lang: 'java',
    title: 'Class',
    file: 'Point.java',
    code: `public class Point {
    private final int x;
    private final int y;

    public Point(int x, int y) {
        this.x = x;
        this.y = y;
    }
}`,
    explain: {
      concept:
        '클래스(class)는 데이터(필드)와 동작을 하나로 묶는 "설계도"예요. 이 설계도로 점(객체)을 여러 개 찍어낼 수 있어요. 여기 Point는 x, y 좌표를 가집니다.',
      terms: [
        { t: 'public', d: '어디서나 사용할 수 있게 공개' },
        { t: 'class Point', d: 'Point 라는 이름의 설계도 정의' },
        { t: 'private', d: '클래스 밖에서 직접 못 건드리게 보호' },
        { t: 'final', d: '한 번 정해지면 못 바꿈(상수처럼)' },
        { t: 'Point(int x, int y)', d: '객체를 만들 때 호출되는 생성자' },
        { t: 'this.x = x', d: 'this=이 객체 자신. 필드 x에 받은 값을 저장' },
      ],
      why: '관련된 데이터를 묶어서 관리하고, 외부에서 함부로 바꾸지 못하게 보호하려고 써요.',
      pitfall: '필드를 public 으로 열어두면 아무나 값을 바꿀 수 있어 위험해요.',
    },
  },
  {
    id: 'jc-interface',
    lang: 'java',
    title: 'Interface',
    file: 'Shape.java',
    code: `public interface Shape {

    double area();

    default String describe() {
        return "area = " + area();
    }
}`,
    explain: {
      concept:
        '인터페이스는 "이런 동작을 할 수 있다"는 약속(계약)만 정하고, 실제 방법은 구현하는 클래스가 채워 넣어요.',
      terms: [
        { t: 'interface', d: '동작의 약속만 모아둔 틀' },
        { t: 'double area();', d: '몸체가 없는 추상 메서드 — 구현 클래스가 작성' },
        { t: 'default', d: '인터페이스가 직접 제공하는 기본 구현' },
      ],
      why: '여러 클래스가 같은 방식으로 동작하도록 공통 규격을 정하려고 써요.',
    },
  },
  {
    id: 'jc-enum',
    lang: 'java',
    title: 'Enum',
    file: 'Status.java',
    code: `public enum Status {
    ACTIVE,
    INACTIVE,
    DELETED
}`,
    explain: {
      concept: '정해진 값들 중에서만 고르게 하는 타입이에요. 상태처럼 종류가 한정된 값에 씁니다.',
      terms: [
        { t: 'enum', d: '상수(고정값)들의 집합 타입' },
        { t: 'ACTIVE, INACTIVE, DELETED', d: '가능한 값 목록' },
      ],
      why: '"active" 같은 문자열 오타를 막고, 정해진 값만 쓰게 안전장치를 두려고요.',
    },
  },
  {
    id: 'jc-record',
    lang: 'java',
    title: 'Record',
    file: 'Money.java',
    code: `public record Money(long amount, String currency) {

    public Money {
        if (amount < 0) throw new IllegalArgumentException("negative");
    }
}`,
    explain: {
      concept:
        '레코드(record)는 데이터만 담는 "간단한 상자"를 한 줄로 만들어 줘요. 한 번 만들면 값을 못 바꾸는(불변) 게 특징이에요.',
      terms: [
        { t: 'record', d: '불변 데이터 객체를 자동으로 만들어 줌' },
        { t: '(long amount, String currency)', d: '상자에 담을 데이터 목록' },
        { t: 'public Money { ... }', d: 'compact 생성자 — 값이 올바른지 검사' },
      ],
      why: 'DTO·값 객체를 짧고 안전하게 만들 때 써요(equals·toString 자동 생성).',
      pitfall: 'record 의 필드는 생성 후 바꿀 수 없어요.',
    },
  },
  {
    id: 'jc-generic-class',
    lang: 'java',
    title: 'Generic Class',
    file: 'Box.java',
    code: `public class Box<T> {
    private T value;

    public T get() {
        return value;
    }

    public void set(T value) {
        this.value = value;
    }
}`,
    explain: {
      concept:
        'T는 "아무 타입이나 들어갈 빈칸"이에요. Box<String>으로 쓰면 문자열 상자, Box<Integer>면 정수 상자가 됩니다.',
      terms: [
        { t: '<T>', d: '타입 자리표시자 — 쓸 때 실제 타입으로 정해짐' },
        { t: 'Box<String>', d: 'String 전용 상자로 사용' },
      ],
      why: '타입마다 똑같은 코드를 반복해 만들지 않으려고요.',
    },
  },
  {
    id: 'jc-generic-method',
    lang: 'java',
    title: 'Generic Method',
    file: 'Util.java',
    code: `public class Util {

    public static <T> T firstOrNull(List<T> list) {
        return list.isEmpty() ? null : list.get(0);
    }
}`,
    explain: {
      concept: '메서드 하나에만 "아무 타입이나" 빈칸 T를 붙이는 방식이에요.',
      terms: [
        { t: '<T>', d: '반환형 바로 앞에 둬서 이 메서드의 타입 선언' },
        { t: 'static', d: '객체를 만들지 않고 클래스로 바로 호출' },
        { t: 'cond ? a : b', d: '삼항 연산자 — 조건이 참이면 a, 아니면 b' },
      ],
    },
  },
  {
    id: 'jc-sealed',
    lang: 'java',
    title: 'Sealed Interface',
    file: 'Result.java',
    code: `public sealed interface Result permits Ok, Err {
}

record Ok(String value) implements Result {}

record Err(String message) implements Result {}`,
    explain: {
      concept:
        '이 인터페이스를 구현할 수 있는 타입을 딱 정해두는 거예요(여기선 Ok, Err 둘만). 성공/실패처럼 경우가 정해진 곳에 좋아요.',
      terms: [
        { t: 'sealed', d: '봉인 — 허락된 타입만 구현 가능' },
        { t: 'permits Ok, Err', d: '구현할 수 있는 타입 목록' },
        { t: 'implements Result', d: 'Result 인터페이스를 구현' },
      ],
      why: '경우의 수를 제한해, switch에서 빠뜨림 없이 처리하도록 도와줘요.',
    },
  },
  {
    id: 'jc-list',
    lang: 'java',
    title: 'List + Stream',
    file: 'Lists.java',
    code: `List<String> names = List.of("kim", "lee", "park");
List<String> upper = names.stream()
    .map(String::toUpperCase)
    .toList();`,
    explain: {
      concept:
        '여러 값을 순서대로 담는 목록(List)을 만들고, 스트림(stream)으로 한 번에 변환해요. 여기선 모두 대문자로 바꿉니다.',
      terms: [
        { t: 'List.of(...)', d: '고정(불변) 목록 만들기' },
        { t: '.stream()', d: '값들을 하나씩 흐르게 만듦' },
        { t: '.map(String::toUpperCase)', d: '각 값을 대문자로 변환' },
        { t: '.toList()', d: '결과를 다시 목록으로 모음' },
      ],
      pitfall: 'List.of 로 만든 목록에 add/remove 하면 오류가 나요(불변).',
    },
  },
  {
    id: 'jc-map',
    lang: 'java',
    title: 'Map',
    file: 'Maps.java',
    code: `Map<String, Integer> scores = new HashMap<>();
scores.put("math", 90);
scores.merge("math", 5, Integer::sum);
scores.forEach((k, v) -> System.out.println(k + "=" + v));`,
    explain: {
      concept: '이름표(키)에 값을 붙여 저장하는 사전 같은 자료구조예요.',
      terms: [
        { t: 'Map<String, Integer>', d: '문자열 키 → 정수 값' },
        { t: 'put("math", 90)', d: '키에 값 넣기' },
        { t: 'merge(key, 5, sum)', d: '있으면 합치고 없으면 새로 넣기' },
        { t: 'forEach((k, v) -> ...)', d: '키·값을 하나씩 순회' },
      ],
    },
  },
  {
    id: 'jc-try',
    lang: 'java',
    title: 'Try-with-resources',
    file: 'Io.java',
    code: `try (var reader = Files.newBufferedReader(path)) {
    return reader.readLine();
} catch (IOException e) {
    throw new UncheckedIOException(e);
}`,
    explain: {
      concept: '파일 같은 자원을 다 쓰고 나면 자동으로 닫아주는 안전한 처리 방식이에요.',
      terms: [
        { t: 'try (var reader = ...)', d: '여기서 연 자원은 끝나면 자동으로 close' },
        { t: 'catch (IOException e)', d: '입출력 오류가 나면 잡아서 처리' },
        { t: 'throw', d: '예외를 다시 던져 위로 알림' },
      ],
    },
  },
  {
    id: 'jc-exception',
    lang: 'java',
    title: 'Custom Exception',
    file: 'NotFoundException.java',
    code: `public class NotFoundException extends RuntimeException {

    public NotFoundException(String message) {
        super(message);
    }
}`,
    explain: {
      concept: '내 상황에 맞는 오류 종류를 직접 만들어 쓰는 거예요("찾을 수 없음" 같은).',
      terms: [
        { t: 'extends RuntimeException', d: '예외를 상속 — throws 선언 없이 던질 수 있음' },
        { t: 'super(message)', d: '부모(예외)에게 오류 메시지를 전달' },
      ],
    },
  },
  {
    id: 'jc-lambda',
    lang: 'java',
    title: 'Lambda',
    file: 'Lambdas.java',
    code: `Function<Integer, Integer> square = n -> n * n;
Supplier<String> hello = () -> "hello";
Runnable task = () -> System.out.println("run");`,
    explain: {
      concept:
        '람다는 이름 없는 짧은 함수예요. "입력 -> 결과" 형태로 동작 자체를 값처럼 담아 전달해요.',
      terms: [
        { t: 'n -> n * n', d: '입력 n을 받아 n*n을 반환' },
        { t: '() -> "hello"', d: '입력 없이 "hello"를 반환' },
        { t: 'Function / Supplier / Runnable', d: '함수의 종류(입력·출력 유무로 구분)' },
      ],
    },
  },
  {
    id: 'jc-stream-filter',
    lang: 'java',
    title: 'Stream Filter',
    file: 'Streams.java',
    code: `List<Integer> evens = numbers.stream()
    .filter(n -> n % 2 == 0)
    .sorted()
    .toList();`,
    explain: {
      concept:
        '조건에 맞는 값만 걸러내고, 정렬해서 모으는 흐름이에요. 여기선 짝수만 골라 정렬합니다.',
      terms: [
        { t: '.filter(n -> n % 2 == 0)', d: '짝수만 통과시킴 (% 는 나머지)' },
        { t: '.sorted()', d: '오름차순 정렬' },
        { t: '.toList()', d: '결과를 목록으로' },
      ],
    },
  },
  {
    id: 'jc-stream-collect',
    lang: 'java',
    title: 'Collectors',
    file: 'Grouping.java',
    code: `Map<Boolean, List<Integer>> parts = numbers.stream()
    .collect(Collectors.partitioningBy(n -> n > 0));`,
    explain: {
      concept:
        '스트림의 결과를 그룹으로 나눠 모으는 도구예요. 여기선 양수/음수 두 그룹으로 나눕니다.',
      terms: [
        { t: 'collect(...)', d: '흐른 값들을 하나로 모음' },
        { t: 'partitioningBy(n -> n > 0)', d: '조건 참(true)/거짓(false) 두 그룹으로 분할' },
      ],
    },
  },
  {
    id: 'jc-optional',
    lang: 'java',
    title: 'Optional',
    file: 'Optionals.java',
    code: `String name = Optional.ofNullable(user)
    .map(User::name)
    .orElse("guest");`,
    explain: {
      concept:
        '값이 없을 수도 있다는 걸 안전하게 표현해, 그 무서운 NullPointerException(널 오류)을 막아줘요.',
      terms: [
        { t: 'ofNullable(user)', d: 'null 일 수 있는 값을 감쌈' },
        { t: '.map(User::name)', d: '값이 있으면 이름으로 변환' },
        { t: '.orElse("guest")', d: '값이 없으면 기본값 "guest"' },
      ],
      pitfall: 'Optional 은 반환값에만 쓰는 게 좋아요(필드·파라미터 남용 금지).',
    },
  },
  {
    id: 'jc-future',
    lang: 'java',
    title: 'CompletableFuture',
    file: 'Async.java',
    code: `CompletableFuture
    .supplyAsync(() -> fetch())
    .thenApply(String::trim)
    .thenAccept(System.out::println);`,
    explain: {
      concept:
        '오래 걸리는 일을 백그라운드에서 처리하고, 끝나면 이어서 다음 작업을 하는 비동기 방식이에요.',
      terms: [
        { t: 'supplyAsync(() -> fetch())', d: '백그라운드에서 실행해 결과를 만듦' },
        { t: 'thenApply(String::trim)', d: '결과가 오면 변환' },
        { t: 'thenAccept(println)', d: '최종 결과를 사용(출력)' },
      ],
    },
  },
  {
    id: 'jc-switch-expr',
    lang: 'java',
    title: 'Switch Expression',
    file: 'Days.java',
    code: `int days = switch (month) {
    case FEB -> 28;
    case APR, JUN, SEP, NOV -> 30;
    default -> 31;
};`,
    explain: {
      concept: '조건에 따라 "값을 돌려주는" switch예요. 화살표(->)로 짧고 안전하게 씁니다.',
      terms: [
        { t: 'case FEB -> 28', d: 'FEB이면 28을 결과로' },
        { t: '->', d: 'break 없이 바로 그 값을 돌려줌' },
        { t: 'default', d: '나머지 모든 경우' },
      ],
      pitfall: '값을 돌려주는 switch는 모든 경우를 다뤄야 해요(보통 default 필요).',
    },
  },
  {
    id: 'jc-pattern-switch',
    lang: 'java',
    title: 'Pattern Matching',
    file: 'Shapes.java',
    code: `String desc = switch (shape) {
    case Circle c -> "circle " + c.radius();
    case Square s -> "square " + s.side();
    default -> "unknown";
};`,
    explain: {
      concept:
        '값의 타입을 보고 분기하면서, 그 타입으로 바로 변수까지 받아 쓰는 기능이에요(Java 21).',
      terms: [
        { t: 'case Circle c', d: 'Circle 타입이면 c로 바로 사용(형변환 자동)' },
        { t: 'c.radius()', d: 'Circle의 메서드 호출' },
      ],
      why: 'instanceof 로 확인하고 다시 형변환하던 반복을 없애줘요.',
    },
  },
  {
    id: 'jc-text-block',
    lang: 'java',
    title: 'Text Block',
    file: 'Json.java',
    code: `String json = """
    {
      "name": "kim",
      "age": 30
    }
    """;`,
    explain: {
      concept: '여러 줄 문자열을 줄바꿈·따옴표 신경 안 쓰고 그대로 쓰는 방법이에요(Java 15+).',
      terms: [
        { t: '"""', d: '여러 줄 문자열의 시작과 끝' },
        { t: '들여쓰기', d: '공통 들여쓰기는 자동으로 정리됨' },
      ],
    },
  },
  {
    id: 'jc-enhanced-for',
    lang: 'java',
    title: 'Enhanced For',
    file: 'Loop.java',
    code: `var total = 0;
for (var n : numbers) {
    total += n;
}`,
    explain: {
      concept: '목록의 값을 하나씩 꺼내 반복해요. 인덱스(i) 없이 간단합니다.',
      terms: [
        { t: 'for (var n : numbers)', d: 'numbers의 각 값을 차례로 n에' },
        { t: 'var', d: '타입을 자동으로 추론' },
        { t: 'total += n', d: 'total 에 n 을 더해 누적' },
      ],
    },
  },
];
