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
        System.out.println("[실행] Point 생성 — x: " + x + ", y: " + y);
    }

    public static void main(String[] args) {
        Point p = new Point(3, 5);
        System.out.println("[결과] Point 객체: (" + p.x + ", " + p.y + ")");
    }
}`,
    explain: {
      concept:
        '클래스(class)는 데이터(필드)와 동작을 하나로 묶는 "설계도"예요. 이 설계도로 원하는 만큼 객체를 찍어낼 수 있어요. ' +
        '여기 Point는 x, y 좌표를 가진 점을 표현하는데, 한 번 정해지면 바꿀 수 없도록 final로 보호하고 있어요. ' +
        '생성자(Point)는 객체를 만들 때 자동으로 호출되는 특별한 메서드로, 받은 값을 필드에 저장해줘요. ' +
        '실제 프로젝트에서는 DTO, Entity, VO 같은 데이터 객체를 만들 때 이런 클래스 구조가 기본 뼈대가 돼요. ' +
        '클래스 안에 필드와 메서드를 함께 두면 관련 코드가 한곳에 모여 유지보수가 훨씬 쉬워져요.',
      terms: [
        { t: 'public class Point', d: '누구나 쓸 수 있는 Point라는 설계도를 정의해요' },
        { t: 'private final int x', d: 'x 좌표를 외부에서 직접 못 바꾸게 보호하고, 한 번만 값이 정해져요' },
        { t: 'Point(int x, int y)', d: '객체를 만들 때 자동으로 실행되는 생성자예요 — 매개변수를 받아 필드를 채워줘요' },
        { t: 'this.x = x', d: 'this는 "지금 이 객체 자신"을 뜻해요 — 매개변수와 필드를 구분할 때 꼭 필요해요' },
        { t: 'main', d: '프로그램 실행을 시작하는 진입점이에요 — Java는 이 메서드로 시작해요' },
      ],
      why:
        '관련 데이터와 동작을 하나로 묶어서 코드 구조를 깔끔하게 관리하려고 써요. ' +
        '실무에서는 게시글(Post), 주문(Order) 같은 핵심 개념을 모두 클래스로 표현해요.',
      expectedOutput:
        'java Point\n' +
        '[실행] Point 생성 — x: 3, y: 5\n' +
        '[결과] Point 객체: (3, 5)',
      realWorldUsage:
        '실제 프로젝트에서 주문 정보를 담는 Order 클래스를 만들 때 똑같은 구조를 써요. ' +
        '주문번호, 금액, 상태 같은 필드를 private으로 보호하고 생성자로 값을 채우는 식이에요.',
      pitfall: '필드를 public으로 열어두면 아무데서나 값을 바꿀 수 있어 버그 찾기가 어려워져요. 꼭 private으로 보호하세요.',
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
        String result = "area = " + area();
        System.out.println("[결과] " + result);
        return result;
    }
}`,
    explain: {
      concept:
        '인터페이스는 "이런 동작을 할 수 있다"는 약속(계약)만 정하고, 실제 방법은 구현하는 클래스가 채워 넣어요. ' +
        '식당으로 치면 "요리사는 요리할 수 있다"는 계약이고, 한식 요리사·중식 요리사가 각자 자기 방식으로 구현하는 거예요. ' +
        'default 메서드가 추가되면서 인터페이스도 기본 구현을 제공할 수 있게 됐어요 — 텅 빈 계약서가 아니라 기본 양식도 줄 수 있는 거죠. ' +
        '실무에서는 Service 인터페이스를 먼저 정의하고, 실제 로직은 ServiceImpl 클래스가 구현하는 식으로 많이 써요. ' +
        '이렇게 하면 나중에 구현체를 바꿔도(예: 진짜 결제 → 가짜 결제) 인터페이스를 쓰는 쪽 코드는 전혀 안 바뀌어요.',
      terms: [
        { t: 'interface', d: '동작의 약속만 모아둔 틀이에요 — 몸체 없는 메서드 시그니처를 선언해요' },
        { t: 'double area();', d: '구현 클래스가 반드시 작성해야 하는 추상 메서드예요 — 세미콜론만 있고 몸체는 없어요' },
        { t: 'default', d: '인터페이스가 직접 기본 구현을 제공하는 키워드예요 — 모든 구현체가 공유하는 공통 코드를 넣어요' },
        { t: 'area() 호출', d: 'default 메서드 안에서도 추상 메서드를 호출할 수 있어요 — 구체적인 계산은 구현체가 해줘요' },
      ],
      why:
        '여러 클래스가 같은 방식으로 동작하도록 공통 규격을 정하려고 써요. ' +
        '실무에서는 Repository 인터페이스로 데이터 접근 규약을 정하고, 필요하면 구현체만 통째로 바꿔요 (JPA → MyBatis 등).',
      expectedOutput:
        'Circle 구현체 기준:\n' +
        '[결과] area = 78.53981633974483',
      realWorldUsage:
        '실제로 PaymentGateway 인터페이스를 정의해두면, 개발 환경에서는 MockPaymentGateway, 운영 환경에서는 RealPaymentGateway를 주입할 수 있어요. ' +
        '인터페이스 덕분에 Controller 코드는 한 줄도 안 바뀌고 환경만 바뀌는 거죠.',
      pitfall: '인터페이스만 봐서는 실제 구현 내용을 알 수 없어서, 구현체를 찾아 들어가야 이해되는 경우가 있어요. Javadoc을 잘 달아두는 게 중요해요.',
    },
  },
  {
    id: 'jc-enum',
    lang: 'java',
    title: 'Enum',
    file: 'Status.java',
    code: `public enum Status {
    ACTIVE("활성"),
    INACTIVE("비활성"),
    DELETED("삭제됨");

    private final String label;

    Status(String label) {
        this.label = label;
    }

    public String label() {
        return label;
    }

    public static void main(String[] args) {
        Status s = Status.ACTIVE;
        System.out.println("[결과] 상태: " + s + " (" + s.label() + ")");
    }
}`,
    explain: {
      concept:
        'Enum은 정해진 값들 중에서만 고르게 하는 특별한 타입이에요. ' +
        '"활성·비활성·삭제됨"처럼 선택지가 딱 정해져 있는 상태값을 표현할 때 써요. ' +
        'Enum 안에 필드와 메서드를 넣을 수 있어서 단순한 상수 목록을 넘어 풍부한 객체처럼 만들 수 있어요. ' +
        '문자열 "ACTIVE"를 직접 쓰면 오타가 나도 컴파일러가 못 잡지만, Status.ACTIVE처럼 쓰면 오타가 나자마자 빨간 줄이 떠서 바로 알 수 있어요.',
      terms: [
        { t: 'enum Status', d: 'Status라는 이름의 열거형 타입을 정의해요 — 정해진 값만 쓸 수 있어요' },
        { t: 'ACTIVE, INACTIVE, DELETED', d: 'Status가 가질 수 있는 고정된 값 목록이에요 — 이 외의 값은 절대 넣을 수 없어요' },
        { t: 'private final String label', d: '각 값에 붙일 부가 정보(한글 설명)를 저장하는 필드예요' },
        { t: 'Status(String label)', d: '각 열거 상수가 생성될 때 호출되는 비공개 생성자예요' },
        { t: 'main', d: '프로그램 진입점이에요 — ACTIVE 값을 꺼내서 라벨과 함께 출력해요' },
      ],
      why:
        '"active" 같은 문자열 오타를 막고, 정해진 값만 쓰게 안전장치를 두려고 써요. ' +
        '실무에서는 주문상태(ORDERED→PAID→SHIPPED→DELIVERED), 회원등급(BRONZE→SILVER→GOLD) 등을 Enum으로 관리해요.',
      expectedOutput:
        'java Status\n' +
        '[결과] 상태: ACTIVE (활성)',
      realWorldUsage:
        '실제 쇼핑몰에서 주문 상태를 OrderStatus.PAID, OrderStatus.SHIPPED처럼 Enum으로 관리해요. ' +
        'switch 문으로 상태별 로직을 분기할 때 모든 경우를 다 다뤘는지 컴파일러가 확인해줘서 누락을 막을 수 있어요.',
      pitfall: 'Enum에 새 값을 추가했는데 switch에서 그 값을 처리 안 하면 런타임에 예외가 날 수 있어요. sealed + switch와 조합하면 컴파일러가 놓친 부분을 잡아줘요.',
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
        System.out.println("[실행] Money 생성 — " + amount + " " + currency);
    }

    public static void main(String[] args) {
        Money m = new Money(5000, "KRW");
        System.out.println("[결과] 금액: " + m.amount() + " " + m.currency());
    }
}`,
    explain: {
      concept:
        '레코드(record)는 데이터만 담는 "불변 상자"를 한 줄로 만들어 주는 Java 16부터 추가된 특별한 클래스예요. ' +
        '클래스로 만들면 필드, 생성자, equals(), hashCode(), toString()을 일일이 작성해야 하지만, record는 선언 한 줄로 이 모든 게 자동 생성돼요. ' +
        '한 번 만들면 필드 값을 절대 바꿀 수 없는(불변) 게 특징인데, Compact 생성자로 값이 올바른지만 검증할 수 있어요. ' +
        '실무에서는 API 응답 객체(DTO), 설정 정보, 좌표·금액 같은 값 객체(VO)를 만들 때 가장 먼저 떠올리는 도구예요.',
      terms: [
        { t: 'record Money(long amount, String currency)', d: '불변 데이터 객체를 한 줄로 선언해요 — amount()와 currency() 접근자도 자동으로 생겨요' },
        { t: 'public Money { ... }', d: 'Compact 생성자예요 — 중괄호 안에서 값 검증만 하고 필드 할당은 자동으로 이뤄져요' },
        { t: 'IllegalArgumentException', d: '잘못된 인자가 들어왔을 때 던지는 예외예요 — 음수 금액을 막아줘요' },
        { t: 'm.amount()', d: '레코드는 getAmount() 대신 amount() 접근자를 자동으로 만들어줘요' },
      ],
      why:
        'DTO, 값 객체를 짧고 안전하게 만들 때 써요. equals()·hashCode()·toString()이 자동 생성돼서 버그 가능성이 줄고 코드량이 확 줄어요. ' +
        '실무에서는 API 응답·요청 DTO의 90% 이상을 record로 만들어요.',
      expectedOutput:
        'java Money\n' +
        '[실행] Money 생성 — 5000 KRW\n' +
        '[결과] 금액: 5000 KRW',
      realWorldUsage:
        '실제 REST API에서 클라이언트가 보낸 JSON을 받을 때, public record SignupRequest(String email, String password) {} 한 줄로 DTO를 정의해요. ' +
        'Controller의 @RequestBody SignupRequest req가 이 레코드 객체를 받아 쓰는 구조예요.',
      pitfall: 'record의 필드는 생성 후 절대 바꿀 수 없어요. 중간에 값을 바꿔야 하는 요구사항이면 record 대신 일반 클래스를 써야 해요.',
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
        System.out.println("[실행] 값 꺼내기: " + value);
        return value;
    }

    public void set(T value) {
        this.value = value;
        System.out.println("[실행] 값 넣기: " + value);
    }

    public static void main(String[] args) {
        Box<String> box = new Box<>();
        box.set("hello");
        System.out.println("[결과] 꺼낸 값: " + box.get());
    }
}`,
    explain: {
      concept:
        '제네릭(Generic)은 "타입을 나중에 정하는 빈칸"이에요. Box<T>라고 쓰면 T 자리에 나중에 String, Integer 등 실제 타입이 들어와요. ' +
        'Box<String>으로 쓰면 문자열 전용 상자가 되고, Box<Integer>면 정수 전용 상자가 되는 거예요 — 코드는 하나인데 타입만 바꿔 재사용할 수 있어서 코드 중복이 사라져요. ' +
        '컴파일 시점에 타입이 확정되기 때문에, 잘못된 타입을 넣으려고 하면 컴파일러가 바로 빨간 줄을 그어줘요. ' +
        '실무에서는 Repository<T, ID>, Optional<T>, List<T>처럼 거의 모든 곳에서 제네릭을 마주쳐요.',
      terms: [
        { t: '<T>', d: '타입 매개변수 자리표시자예요 — 나중에 String, Integer 등 실제 타입으로 바뀌어요' },
        { t: 'private T value', d: '아직 미정인 타입 T의 값을 저장하는 필드예요' },
        { t: 'Box<String>', d: 'T 자리에 String이 들어간 구체적인 타입이에요 — 컴파일 시점에 타입이 확정돼요' },
        { t: 'box.set("hello")', d: 'String 타입만 넣을 수 있어요 — Integer를 넣으면 컴파일 에러가 나요' },
      ],
      why:
        '타입마다 똑같은 코드를 반복해 만들지 않으려고 제네릭을 써요. ' +
        'BoxString, BoxInteger 같은 클래스를 10개 만들지 않고 Box<T> 하나로 10가지 타입을 모두 처리할 수 있어요.',
      expectedOutput:
        'java Box\n' +
        '[실행] 값 넣기: hello\n' +
        '[실행] 값 꺼내기: hello\n' +
        '[결과] 꺼낸 값: hello',
      realWorldUsage:
        '실제로 스프링의 JpaRepository<T, ID>가 이 제네릭 문법으로 만들어져 있어요. ' +
        'JpaRepository<User, Long>이라고 쓰면 User 엔티티와 Long ID에 맞춰진 리포지토리가 자동 구성돼요.',
      pitfall: 'Box와 Box<int>는 쓸 수 없어요 — 제네릭 타입 인자에는 참조 타입만 올 수 있어요. int 대신 Integer를 쓰세요.',
    },
  },
  {
    id: 'jc-generic-method',
    lang: 'java',
    title: 'Generic Method',
    file: 'Util.java',
    code: `import java.util.List;

public class Util {

    public static <T> T firstOrNull(List<T> list) {
        T result = list.isEmpty() ? null : list.get(0);
        System.out.println("[결과] 첫 번째 요소: " + result);
        return result;
    }

    public static void main(String[] args) {
        List<String> names = List.of("kim", "lee");
        String first = Util.firstOrNull(names);
        System.out.println("[실행] 반환된 값: " + first);
    }
}`,
    explain: {
      concept:
        '제네릭 메서드는 클래스 전체가 아니라 메서드 하나에만 "아무 타입이나"라는 빈칸 T를 붙이는 방식이에요. ' +
        '반환형 바로 앞에 <T>를 둬서 "이 메서드는 T라는 타입 매개변수를 써요"라고 선언하고, 매개변수나 반환형에 T를 써요. ' +
        '호출할 때 인자 타입을 보고 T가 자동으로 추론되기 때문에 Util.<String>firstOrNull처럼 명시하지 않아도 돼요. ' +
        '실무에서는 컬렉션 유틸리티 메서드나 변환기(Converter) 같은 곳에서 자주 등장해요.',
      terms: [
        { t: 'static <T> T firstOrNull', d: '<T>는 "이 메서드만의 타입 매개변수"를 선언하고, 반환형 T는 그 타입을 결과로 돌려줘요' },
        { t: 'List<T> list', d: '어떤 타입의 리스트든 받을 수 있어요 — 호출 시점에 타입이 결정돼요' },
        { t: 'list.isEmpty() ? null : list.get(0)', d: '삼항 연산자로 리스트가 비었으면 null, 아니면 첫 요소를 반환해요' },
        { t: 'Util.firstOrNull(names)', d: 'static 메서드니까 객체 없이 클래스명으로 바로 호출해요' },
      ],
      why:
        '하나의 유틸리티 메서드로 String 리스트, Integer 리스트, User 리스트 모두 처리하려고 써요. ' +
        '타입별로 메서드를 복제하지 않아도 되고, 반환 타입도 자동으로 맞춰져서 안전해요.',
      expectedOutput:
        'java Util\n' +
        '[결과] 첫 번째 요소: kim\n' +
        '[실행] 반환된 값: kim',
      realWorldUsage:
        '실제로 Collections.emptyList() 나 Optional.ofNullable() 같은 표준 라이브러리 메서드들이 모두 제네릭 메서드로 만들어져 있어요. ' +
        '빈 리스트를 반환하면서도 타입 안전성을 지킬 수 있는 이유가 바로 이 문법 덕분이에요.',
      pitfall: 'static 메서드는 클래스의 타입 매개변수 <T>를 쓸 수 없고, 반드시 자기만의 <T>를 따로 선언해야 해요. 클래스 수준의 T와 혼동하지 마세요.',
    },
  },
  {
    id: 'jc-sealed',
    lang: 'java',
    title: 'Sealed Interface',
    file: 'Result.java',
    code: `public sealed interface Result permits Ok, Err {
}

record Ok(String value) implements Result {
    public Ok {
        System.out.println("[실행] Ok 생성 — 값: " + value);
    }
}

record Err(String message) implements Result {
    public Err {
        System.out.println("[실행] Err 생성 — 메시지: " + message);
    }
}

class Demo {
    public static void main(String[] args) {
        Result r1 = new Ok("데이터");
        Result r2 = new Err("실패");
        System.out.println("[결과] Ok: " + r1 + ", Err: " + r2);
    }
}`,
    explain: {
      concept:
        'Sealed(봉인)는 "이 인터페이스를 구현할 수 있는 클래스를 딱 이 목록으로 제한한다"고 컴파일러에게 알려주는 문법이에요. ' +
        '성공(Ok)과 실패(Err)처럼 가능한 경우가 정해져 있는 상황에 딱 맞아요 — 제3의 상태가 끼어들지 못하게 원천 차단해요. ' +
        'Sealed와 switch를 같이 쓰면 컴파일러가 "모든 경우를 다 다뤘는지" 확인해줘서, 새 상태를 추가했는데 처리를 빼먹는 실수를 컴파일 시점에 잡아줘요. ' +
        'Java 21의 패턴 매칭과 결합하면 switch에서 타입별로 깔끔하게 분기할 수 있어서 코드가 훨씬 읽기 쉬워져요.',
      terms: [
        { t: 'sealed', d: '"봉인" — 허락된 구현체 목록 외에는 누구도 이 타입을 구현할 수 없어요' },
        { t: 'permits Ok, Err', d: '구현을 허용하는 타입 목록을 명시해요 — 이 목록에 없는 클래스는 컴파일 에러가 나요' },
        { t: 'record Ok(String value)', d: '성공 케이스를 담는 불변 데이터 객체예요 — implements Result로 계약을 이행해요' },
        { t: 'record Err(String message)', d: '실패 케이스를 담는 불변 데이터 객체예요 — 오류 메시지를 보관해요' },
      ],
      why:
        '경우의 수를 제한해 switch에서 빠뜨림 없이 처리하도록 컴파일러가 강제하게 하려고 써요. ' +
        '실무에서는 Result 타입(Ok/Err)이나 결제상태(Pending/Completed/Failed/Refunded) 등 "경우의 수가 고정된 도메인"에 써요.',
      expectedOutput:
        'java Demo\n' +
        '[실행] Ok 생성 — 값: 데이터\n' +
        '[실행] Err 생성 — 메시지: 실패\n' +
        '[결과] Ok: Ok[value=데이터], Err: Err[message=실패]',
      realWorldUsage:
        '실제로 API 응답을 통일할 때 sealed interface ApiResponse permits Success, Failure 를 정의해 써요. ' +
        '컨트롤러에서 switch로 Success면 200, Failure면 4xx로 응답을 분기할 수 있고, 새 응답 타입이 추가되면 컴파일 에러로 바로 알 수 있어요.',
      pitfall: 'sealed 타입과 그 구현체들은 같은 패키지나 같은 모듈 안에 있어야 해요. 다른 패키지에 흩어져 있으면 컴파일 에러가 나요.',
    },
  },
  {
    id: 'jc-list',
    lang: 'java',
    title: 'List + Stream',
    file: 'Lists.java',
    code: `import java.util.List;

public class Lists {
    public static void main(String[] args) {
        List<String> names = List.of("kim", "lee", "park");
        System.out.println("[실행] 원본 목록: " + names);

        List<String> upper = names.stream()
            .map(String::toUpperCase)
            .toList();
        System.out.println("[결과] 대문자 변환: " + upper);
    }
}`,
    explain: {
      concept:
        'List는 여러 값을 순서대로 담는 자료구조예요. List.of()로 고정된 목록을 간편하게 만들 수 있고, stream()을 열면 값들을 하나씩 흘려보내며 변환할 수 있어요. ' +
        'map()은 각 값을 다른 값으로 바꾸는 도구인데, String::toUpperCase라는 "메서드 참조" 문법으로 모든 문자열을 대문자로 한 번에 바꿔줘요. ' +
        'stream은 원본을 건드리지 않고 새 컬렉션을 만들어내기 때문에 원본 데이터가 안전하게 보호돼요. ' +
        '실무에서는 DB에서 꺼낸 엔티티 목록을 DTO 목록으로 변환할 때 이 stream-map 패턴을 가장 많이 써요.',
      terms: [
        { t: 'List.of("kim", "lee", "park")', d: '고정된(불변) 문자열 목록을 한 줄로 만들어요 — add/remove가 불가능해요' },
        { t: '.stream()', d: '컬렉션에서 값을 하나씩 흘려보내는 파이프라인을 열어요' },
        { t: '.map(String::toUpperCase)', d: '각 문자열을 대문자로 변환해요 — 메서드 참조(::)로 더 짧게 써요' },
        { t: '.toList()', d: '스트림 결과를 불변 List로 수집해요 (Java 16+)' },
      ],
      why:
        '여러 데이터를 한 번에 변환·필터링할 때 for문보다 stream-map이 더 읽기 쉽고 안전해요. ' +
        '실무에서 List<Entity>를 List<Dto>로 바꾸는 코드는 거의 .stream().map().toList() 패턴이에요.',
      expectedOutput:
        'java Lists\n' +
        '[실행] 원본 목록: [kim, lee, park]\n' +
        '[결과] 대문자 변환: [KIM, LEE, PARK]',
      realWorldUsage:
        '실제로 Controller에서 List<User>를 받아 List<UserResponse>로 변환할 때 userList.stream().map(UserResponse::from).toList()처럼 써요. ' +
        '엔티티의 비밀번호 같은 민감 필드를 DTO 변환 시 제거하는 데에도 쓰여요.',
      pitfall: 'List.of로 만든 목록에 add/remove 하면 UnsupportedOperationException이 발생해요. 원소 추가가 필요하면 new ArrayList<>()를 쓰세요.',
    },
  },
  {
    id: 'jc-map',
    lang: 'java',
    title: 'Map',
    file: 'Maps.java',
    code: `import java.util.HashMap;
import java.util.Map;

public class Maps {
    public static void main(String[] args) {
        Map<String, Integer> scores = new HashMap<>();
        scores.put("math", 90);
        System.out.println("[실행] 추가 — math: " + scores.get("math"));

        scores.merge("math", 5, Integer::sum);
        System.out.println("[실행] merge 후 math: " + scores.get("math"));

        scores.forEach((k, v) -> System.out.println("[결과] " + k + "=" + v));
    }
}`,
    explain: {
      concept:
        'Map은 키-값 쌍을 저장하는 사전 같은 자료구조예요. "math"라는 키로 점수 90을 저장하고, 나중에 "math"로 바로 찾을 수 있어요. ' +
        'merge()는 특별한 메서드인데, 키가 이미 있으면 기존 값에 새 값을 함수로 합치고, 없으면 그냥 넣어줘요 — 카운터나 누적 집계에 아주 편리해요. ' +
        'forEach로 모든 키-값 쌍을 하나씩 순회할 수 있어서, 결과 출력이나 집계 작업을 간결하게 작성할 수 있어요.',
      terms: [
        { t: 'Map<String, Integer>', d: '"문자열 키 → 정수 값" 구조의 사전을 만들어요 — 타입 안전하게 키와 값의 타입을 지정해요' },
        { t: 'put("math", 90)', d: 'math라는 키에 90을 저장해요 — 이미 있으면 값이 덮어써져요' },
        { t: 'merge(key, 5, Integer::sum)', d: '키가 있으면 기존 값에 5를 더하고, 없으면 5를 새로 넣어요' },
        { t: 'forEach((k, v) -> ...)', d: '모든 키-값 쌍을 하나씩 꺼내 람다로 처리해요' },
        { t: 'Integer::sum', d: '두 정수를 더하는 메서드 참조예요 — (a, b) -> a + b 와 같아요' },
      ],
      why:
        '이름표(키)로 값을 빠르게 찾거나, 키별로 집계할 때 Map을 써요. ' +
        '실무에서는 캐시 구현, 요청 파라미터 파싱, 카운터 집계 등 거의 모든 곳에 Map이 등장해요.',
      expectedOutput:
        'java Maps\n' +
        '[실행] 추가 — math: 90\n' +
        '[실행] merge 후 math: 95\n' +
        '[결과] math=95',
      realWorldUsage:
        '실제로 로그인 실패 횟수를 추적할 때 Map<String, Integer> failCounts에 merge(userId, 1, Integer::sum)로 카운트를 올려요. ' +
        '5회 초과면 계정 잠금을 거는 임계값 검사도 이 맵으로 해요.',
      pitfall: 'HashMap은 키 순서를 보장하지 않아요. 입력 순서가 중요하면 LinkedHashMap, 정렬이 필요하면 TreeMap을 쓰세요.',
    },
  },
  {
    id: 'jc-try',
    lang: 'java',
    title: 'Try-with-resources',
    file: 'Io.java',
    code: `import java.io.BufferedReader;
import java.io.IOException;
import java.io.UncheckedIOException;
import java.nio.file.Files;
import java.nio.file.Path;

public class Io {
    public static String readFirstLine(Path path) {
        System.out.println("[실행] 파일 읽기 — 경로: " + path);
        try (var reader = Files.newBufferedReader(path)) {
            String line = reader.readLine();
            System.out.println("[결과] 첫 줄: " + line);
            return line;
        } catch (IOException e) {
            System.out.println("[오류] " + e.getMessage());
            throw new UncheckedIOException(e);
        }
    }
}`,
    explain: {
      concept:
        'Try-with-resources는 파일, 네트워크 연결처럼 "쓰고 나면 반드시 닫아야 하는 자원"을 자동으로 닫아주는 문법이에요. ' +
        'try 괄호 안에서 연 자원은 코드가 끝나거나 예외가 발생해도 무조건 close()가 호출돼요 — 깜빡하고 close()를 안 불러서 메모리 누수가 생기는 사고를 원천 차단해줘요. ' +
        'IOException 같은 입출력 예외를 catch 블록에서 잡아서 UncheckedIOException이라는 언체크 예외로 감싸서 다시 던지고 있어요 — 이렇게 하면 호출하는 쪽에서 throws를 강제하지 않아도 돼요.',
      terms: [
        { t: 'try (var reader = ...)', d: '괄호 안에서 연 자원은 try 블록이 끝날 때 자동으로 close()가 호출돼요' },
        { t: 'Files.newBufferedReader(path)', d: '파일을 읽기 위한 BufferedReader를 열어요 — 한 줄씩 효율적으로 읽어요' },
        { t: 'catch (IOException e)', d: '파일이 없거나 읽기 권한이 없을 때 등 입출력 오류를 잡아 처리해요' },
        { t: 'UncheckedIOException', d: '체크 예외(IOException)를 언체크 예외로 감싸는 래퍼예요' },
      ],
      why:
        '파일·소켓·DB 커넥션 같은 자원을 안전하게 닫으려고 써요. ' +
        'finally 블록에 직접 close()를 쓰는 것보다 훨씬 간결하고, 실수로 close()를 빼먹을 위험이 없어요.',
      expectedOutput:
        'readFirstLine(test.txt) 호출 시:\n' +
        '[실행] 파일 읽기 — 경로: test.txt\n' +
        '[결과] 첫 줄: hello world',
      realWorldUsage:
        '실제로 설정 파일 읽기, 로그 파일 분석, HTTP 응답 본문 읽기 등 입출력이 있는 모든 곳에서 try-with-resources를 써요. ' +
        'JDBC의 Connection·Statement·ResultSet도 모두 AutoCloseable이라 똑같은 패턴으로 안전하게 닫을 수 있어요.',
      pitfall: 'try-with-resources로 닫히는 건 AutoCloseable을 구현한 객체뿐이에요. 일반 객체는 괄호 안에 넣어도 아무 일도 일어나지 않아요.',
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
        System.out.println("[실행] NotFoundException 생성 — 메시지: " + message);
    }

    public static void main(String[] args) {
        try {
            throw new NotFoundException("회원을 찾을 수 없음");
        } catch (NotFoundException e) {
            System.out.println("[결과] 예외 잡힘: " + e.getMessage());
        }
    }
}`,
    explain: {
      concept:
        '커스텀 예외는 내 도메인에 맞는 오류 종류를 직접 정의해서 쓰는 거예요. ' +
        'NotFoundException처럼 "찾을 수 없음"이라는 의미를 이름에 담으면, 코드를 읽는 사람도, 로그를 보는 운영자도 무슨 일이 일어났는지 바로 이해할 수 있어요. ' +
        'RuntimeException을 상속받으면 throws 선언 없이도 어디서든 던질 수 있어서 스프링의 예외 처리 구조와 잘 맞아요. ' +
        '실무에서는 각 도메인 패키지마다 커스텀 예외를 만들어서 예외 종류만 봐도 어느 영역에서 문제가 생겼는지 알 수 있게 해요.',
      terms: [
        { t: 'extends RuntimeException', d: '언체크 예외로 만들어요 — throws 없이 던질 수 있고, 스프링이 자동 롤백 처리해줘요' },
        { t: 'super(message)', d: '부모(Exception) 생성자를 호출해서 오류 메시지를 전달해요 — getMessage()로 꺼낼 수 있어요' },
        { t: 'throw new NotFoundException', d: '예외 객체를 만들어 던져요 — 실행 흐름이 즉시 catch 블록으로 점프해요' },
        { t: 'catch (NotFoundException e)', d: '특정 예외 타입만 골라 잡아요 — 여러 catch 블록으로 타입별 처리가 가능해요' },
      ],
      why:
        '표준 예외만으로는 비즈니스 의미를 표현하기 어려워서 커스텀 예외를 만들어요. ' +
        'IllegalArgumentException 하나로 모든 오류를 처리하면 로그에서 "도대체 무슨 오류지?" 하고 헤매게 돼요. ' +
        '실무에서는 @ExceptionHandler와 연결해 404나 400 같은 적절한 HTTP 상태 코드로 자동 변환되게 해요.',
      expectedOutput:
        'java NotFoundException\n' +
        '[실행] NotFoundException 생성 — 메시지: 회원을 찾을 수 없음\n' +
        '[결과] 예외 잡힘: 회원을 찾을 수 없음',
      realWorldUsage:
        '실제로 UserController.findUser()에서 DB에 사용자가 없으면 throw new NotFoundException("user " + id)를 던지고, ' +
        '@ExceptionHandler(NotFoundException.class)에서 404 응답으로 변환해요. 예외 이름 자체가 문서 역할을 해요.',
      pitfall: '예외 클래스 이름만 잘 짓고 메시지를 비워두면 디버깅이 어려워져요. 어떤 ID를 찾으려 했는지 등을 메시지에 꼭 포함하세요.',
    },
  },
  {
    id: 'jc-lambda',
    lang: 'java',
    title: 'Lambda',
    file: 'Lambdas.java',
    code: `import java.util.function.Function;
import java.util.function.Supplier;

public class Lambdas {
    public static void main(String[] args) {
        Function<Integer, Integer> square = n -> n * n;
        Supplier<String> hello = () -> "hello";
        Runnable task = () -> System.out.println("[실행] 비동기 작업 수행");

        System.out.println("[결과] square(5): " + square.apply(5));
        System.out.println("[결과] hello: " + hello.get());
        task.run();
    }
}`,
    explain: {
      concept:
        '람다(lambda)는 이름 없는 짧은 함수예요. "입력 -> 결과" 형태로 동작 자체를 값처럼 담아서 다른 메서드의 인자로 전달할 수 있어요. ' +
        '기존에는 인터페이스를 구현한 익명 클래스를 5~6줄 작성해야 했는데, 람다는 단 한 줄로 같은 일을 해요. ' +
        'Function은 입력 하나를 받아 결과를 반환하는 함수, Supplier는 입력 없이 결과만 공급하는 함수, Runnable은 입력도 결과도 없이 실행만 하는 함수예요. ' +
        '실무에서는 스트림의 map, filter, forEach에 람다를 넘기거나, 비동기 작업을 정의할 때 매일 써요.',
      terms: [
        { t: 'n -> n * n', d: '입력 n을 받아 n*n을 반환하는 함수예요 — Function<Integer, Integer>에 담겨요' },
        { t: '() -> "hello"', d: '입력 없이 "hello"를 반환하는 공급자(Supplier)예요' },
        { t: '() -> System.out.println(...)', d: '입력도 결과도 없이 실행만 하는 Runnable이에요' },
        { t: 'Function<Integer, Integer>', d: 'Integer를 받아 Integer를 반환하는 함수 타입이에요 — apply()로 실행해요' },
      ],
      why:
        '동작을 값처럼 전달해서 코드를 간결하게 만들려고 써요. ' +
        '스트림 API나 비동기 처리에서 람다가 없으면 익명 클래스 투성이가 돼서 코드 읽기가 어려워져요.',
      expectedOutput:
        'java Lambdas\n' +
        '[결과] square(5): 25\n' +
        '[결과] hello: hello\n' +
        '[실행] 비동기 작업 수행',
      realWorldUsage:
        '실제로 repository.findAll().stream().filter(u -> u.getAge() > 20).toList()처럼 DB에서 꺼낸 데이터를 걸러낼 때 람다를 써요. ' +
        '비동기로 이메일 발송할 때도 CompletableFuture.runAsync(() -> emailService.send(to, body)) 같이 써요.',
      pitfall: '람다 안에서 외부 지역 변수를 바꾸려고 하면 컴파일 에러가 나요. 람다에서 참조하는 지역 변수는 final처럼 동작해야 해요.',
    },
  },
  {
    id: 'jc-stream-filter',
    lang: 'java',
    title: 'Stream Filter',
    file: 'Streams.java',
    code: `import java.util.List;

public class Streams {
    public static void main(String[] args) {
        List<Integer> numbers = List.of(3, 1, 4, 1, 5, 9);
        System.out.println("[실행] 원본: " + numbers);

        List<Integer> evens = numbers.stream()
            .filter(n -> n % 2 == 0)
            .sorted()
            .toList();
        System.out.println("[결과] 짝수 정렬: " + evens);
    }
}`,
    explain: {
      concept:
        '스트림의 filter는 조건에 맞는 값만 통과시키는 "검문소"예요. 여기서는 n -> n % 2 == 0 (2로 나눈 나머지가 0, 즉 짝수) 조건으로 홀수를 걸러내고 있어요. ' +
        'sorted()로 걸러진 값들을 오름차순으로 정렬하고, toList()로 최종 결과를 새 리스트로 모아요. ' +
        '이 모든 과정은 원본 리스트를 건드리지 않고 새 리스트를 만들어내기 때문에, 원본 데이터가 안전하게 보호돼요. ' +
        '실무에서는 검색 결과 필터링, 유효하지 않은 데이터 제거, 조건부 집계 등에 filter-sorted 조합을 매일 써요.',
      terms: [
        { t: '.filter(n -> n % 2 == 0)', d: '각 요소에 대해 조건이 참인 것만 다음 단계로 보내요 — %는 나머지 연산자예요' },
        { t: '.sorted()', d: '스트림을 오름차순으로 정렬해요 — Comparator를 넘겨 내림차순 등 커스텀 정렬도 가능해요' },
        { t: '.toList()', d: '스트림을 불변 List로 수집해요 — 최종 연산이라 이걸 호출해야 실제로 데이터가 흘러요' },
        { t: 'n % 2', d: 'n을 2로 나눈 나머지를 구해요 — 0이면 짝수, 1이면 홀수예요' },
      ],
      why:
        '컬렉션에서 조건을 만족하는 요소만 골라내려고 filter를 써요. ' +
        'for문+if문으로 4줄 쓸 걸 filter+sorted+toList 세 단어로 표현할 수 있어서 코드 의도가 바로 읽혀요.',
      expectedOutput:
        'java Streams\n' +
        '[실행] 원본: [3, 1, 4, 1, 5, 9]\n' +
        '[결과] 짝수 정렬: [4]',
      realWorldUsage:
        '실제로 상품 목록에서 "재고가 있는 상품만" filter(p -> p.getStock() > 0), "가격순 정렬" sorted(byPrice), "DTO 변환" map으로 이어지는 체인이 전형적인 서비스 코드 패턴이에요.',
      pitfall: 'filter 같은 중간 연산만 쓰고 toList 같은 최종 연산을 안 부르면 아무 일도 일어나지 않아요. 스트림은 최종 연산이 호출될 때만 실행돼요.',
    },
  },
  {
    id: 'jc-stream-collect',
    lang: 'java',
    title: 'Collectors',
    file: 'Grouping.java',
    code: `import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

public class Grouping {
    public static void main(String[] args) {
        List<Integer> numbers = List.of(-3, 1, -4, 1, 5);
        System.out.println("[실행] 원본: " + numbers);

        Map<Boolean, List<Integer>> parts = numbers.stream()
            .collect(Collectors.partitioningBy(n -> n > 0));
        System.out.println("[결과] 양수: " + parts.get(true));
        System.out.println("[결과] 음수/0: " + parts.get(false));
    }
}`,
    explain: {
      concept:
        'Collectors는 스트림을 마무리할 때 결과를 다양한 형태로 수집하는 도구 모음이에요. ' +
        'partitioningBy는 조건이 참인 그룹과 거짓인 그룹, 딱 두 그룹으로 데이터를 나눠줘요 — 여기서는 양수(true)와 음수+0(false)로 분할하고 있어요. ' +
        'groupingBy를 쓰면 여러 그룹으로 나눌 수 있고, toMap을 쓰면 키-값 맵으로도 만들 수 있어요. ' +
        '실무에서는 통계 집계, 카테고리별 분류, 등급별 회원 분할 같은 작업에 이 Collectors 패밀리를 써요.',
      terms: [
        { t: '.collect(...)', d: '스트림의 최종 연산이에요 — 흘러온 모든 값을 하나의 결과로 모아줘요' },
        { t: 'partitioningBy(n -> n > 0)', d: '조건이 true인 그룹과 false인 그룹으로 나누는 Collectors예요' },
        { t: 'Map<Boolean, List<Integer>>', d: 'true 키에 양수 리스트, false 키에 나머지 리스트가 담겨요' },
        { t: 'parts.get(true)', d: 'true 키로 양수 그룹의 리스트를 꺼내요' },
      ],
      why:
        '데이터를 조건에 따라 그룹화하거나 통계를 낼 때 Collectors를 써요. ' +
        '직접 Map을 만들고 for문으로 분류하는 코드를 5~6줄 쓸 걸 한 줄로 해결해줘요.',
      expectedOutput:
        'java Grouping\n' +
        '[실행] 원본: [-3, 1, -4, 1, 5]\n' +
        '[결과] 양수: [1, 1, 5]\n' +
        '[결과] 음수/0: [-3, -4]',
      realWorldUsage:
        '실제로 주문 목록을 "결제완료/미결제"로 나누거나, 회원 목록을 "VIP/일반"으로 분할할 때 partitioningBy를 써요. ' +
        '여러 상태로 나누는 경우에는 groupingBy(Order::getStatus)로 상태별 그룹을 만들어요.',
      pitfall: 'partitioningBy는 딱 두 그룹으로만 나눠요. 3개 이상의 그룹이 필요하면 groupingBy를 쓰세요.',
    },
  },
  {
    id: 'jc-optional',
    lang: 'java',
    title: 'Optional',
    file: 'Optionals.java',
    code: `import java.util.Optional;

public class Optionals {
    record User(String name) {}

    public static void main(String[] args) {
        User user = new User("kim");
        System.out.println("[실행] 사용자: " + user);

        String name = Optional.ofNullable(user)
            .map(User::name)
            .orElse("guest");
        System.out.println("[결과] 이름: " + name);

        String nullName = Optional.ofNullable(null)
            .map(u -> ((User) u).name())
            .orElse("guest");
        System.out.println("[결과] null 입력 시: " + nullName);
    }
}`,
    explain: {
      concept:
        'Optional은 "값이 있을 수도, 없을 수도 있다"는 상황을 안전하게 표현하는 상자예요. ' +
        'Java에서 가장 무서운 NullPointerException을 근본적으로 막아주는 도구로, null일 수 있는 값을 ofNullable로 감싸면 값이 없을 때도 안전하게 처리할 수 있어요. ' +
        'map은 값이 있을 때만 변환을 적용하고, orElse는 값이 없을 때 기본값을 제공해요 — "값 있으면 처리, 없으면 기본값"이라는 흐름이 한 줄로 표현돼요. ' +
        '실무에서는 DB 조회 결과(findById가 Optional을 반환)를 처리하거나, 외부 API 응답의 null 가능 필드를 다룰 때 필수적으로 써요.',
      terms: [
        { t: 'Optional.ofNullable(user)', d: 'null일 수도 있는 값을 Optional 상자에 담아요 — null이면 빈 상자가 돼요' },
        { t: '.map(User::name)', d: '값이 있을 때만 name을 꺼내요 — 값이 없으면 아무것도 하지 않고 빈 Optional을 반환해요' },
        { t: '.orElse("guest")', d: '값이 있으면 그 값을, 없으면 "guest"를 반환해요 — 최종적으로 null이 절대 나오지 않아요' },
        { t: 'Optional.ofNullable(null)', d: 'null을 넣으면 Optional.empty()가 반환돼요 — NPE 대신 안전한 빈 상자예요' },
      ],
      why:
        'null 체크를 강제해서 NullPointerException을 컴파일 시점에 예방하려고 써요. ' +
        'if (x != null) 중첩을 Optional 체인으로 평평하게 만들어 가독성이 좋아져요.',
      expectedOutput:
        'java Optionals\n' +
        '[실행] 사용자: User[name=kim]\n' +
        '[결과] 이름: kim\n' +
        '[결과] null 입력 시: guest',
      realWorldUsage:
        '실제로 repository.findById(id)의 반환 타입이 Optional<User>예요. ' +
        'orElseThrow()로 값이 없으면 예외를 던지거나, map으로 DTO 변환 후 orElse로 기본 응답을 반환하는 패턴이 가장 흔해요.',
      pitfall: 'Optional을 필드나 메서드 파라미터로 쓰지 마세요. 반환값 전용으로 설계된 타입이에요. 필드에 Optional을 쓰면 직렬화 문제가 생겨요.',
    },
  },
  {
    id: 'jc-future',
    lang: 'java',
    title: 'CompletableFuture',
    file: 'Async.java',
    code: `import java.util.concurrent.CompletableFuture;

public class Async {
    public static void main(String[] args) {
        System.out.println("[실행] 비동기 파이프라인 시작");

        CompletableFuture
            .supplyAsync(() -> {
                System.out.println("[실행] 데이터 가져오는 중...");
                return "  hello  ";
            })
            .thenApply(s -> {
                System.out.println("[실행] trim 적용: '" + s + "'");
                return s.trim();
            })
            .thenAccept(s -> System.out.println("[결과] 최종: '" + s + "'"))
            .join();
    }
}`,
    explain: {
      concept:
        'CompletableFuture는 오래 걸리는 작업을 백그라운드에서 처리하고, 끝나면 이어서 다음 작업을 자동으로 수행하는 비동기 파이프라인이에요. ' +
        'supplyAsync로 백그라운드 작업을 시작하고, thenApply로 결과가 오면 변환하고, thenAccept로 최종 결과를 소비하는 식으로 컨베이어 벨트처럼 연결돼요. ' +
        '동기 코드처럼 순서대로 읽히는데 실제로는 별도 스레드에서 실행돼서, 메인 스레드가 블로킹되지 않아요. ' +
        '실무에서는 외부 API 호출, 파일 처리, 이메일 발송 등 시간이 걸리는 작업을 비동기로 전환할 때 써요.',
      terms: [
        { t: 'supplyAsync(() -> ...)', d: '백그라운드 스레드에서 작업을 실행하고 결과를 만들어내는 비동기 작업이에요' },
        { t: 'thenApply(String::trim)', d: '앞 작업 결과가 오면 trim()을 적용해 변환해요 — 동기 변환이에요' },
        { t: 'thenAccept(System.out::println)', d: '최종 결과를 받아서 소비만 해요 — 반환값 없이 끝나요' },
        { t: '.join()', d: '파이프라인이 끝날 때까지 메인 스레드를 대기시켜요 — 없으면 결과 출력 전에 프로그램이 종료돼요' },
      ],
      why:
        '시간이 오래 걸리는 I/O 작업을 비동기로 처리해서 메인 스레드가 다른 요청을 계속 처리할 수 있게 하려고 써요. ' +
        '스프링 WebFlux의 Mono/Flux도 내부적으로 CompletableFuture와 비슷한 개념이에요.',
      expectedOutput:
        'java Async\n' +
        '[실행] 비동기 파이프라인 시작\n' +
        '[실행] 데이터 가져오는 중...\n' +
        '[실행] trim 적용: \'  hello  \'\n' +
        '[결과] 최종: \'hello\'',
      realWorldUsage:
        '실제로 결제 API 호출 후 결과를 로깅하는 흐름에서 paymentClient.chargeAsync(req).thenAccept(result -> auditService.log(result))처럼 써요. ' +
        '메인 비즈니스 로직과 감사 기록을 분리해서 성능을 높이는 패턴이에요.',
      pitfall: 'join()이나 get()은 블로킹 호출이라 비동기의 장점을 없앨 수 있어요. 가능하면 thenAccept/thenApply로 체인을 이어서 논블로킹을 유지하세요.',
    },
  },
  {
    id: 'jc-switch-expr',
    lang: 'java',
    title: 'Switch Expression',
    file: 'Days.java',
    code: `public class Days {
    enum Month { JAN, FEB, MAR, APR, MAY, JUN, JUL, AUG, SEP, OCT, NOV, DEC }

    public static void main(String[] args) {
        Month month = Month.APR;
        System.out.println("[실행] 입력 월: " + month);

        int days = switch (month) {
            case FEB -> 28;
            case APR, JUN, SEP, NOV -> 30;
            default -> 31;
        };
        System.out.println("[결과] " + month + "의 일수: " + days);
    }
}`,
    explain: {
      concept:
        'Switch Expression은 조건에 따라 "값을 돌려주는" 새로운 switch 문법이에요 (Java 14+). ' +
        '전통적인 switch는 break를 빼먹으면 다음 case로 떨어지는(fall-through) 버그가 있었는데, 화살표(->) 문법은 break 없이 바로 값을 반환해서 이런 실수가 원천 차단돼요. ' +
        '여러 case를 콤마로 묶을 수 있어서 APR, JUN, SEP, NOV처럼 같은 결과를 내는 조건을 한 줄로 표현할 수 있어요. ' +
        '세미콜론이 case 라인 끝이 아니라 switch 블록 끝에 붙는다는 점에 주의하세요 — switch 전체가 "식을 평가해 값을 만든다"는 의미예요.',
      terms: [
        { t: 'case FEB -> 28', d: 'FEB가 매칭되면 28을 결과값으로 반환해요 — break가 필요 없어요' },
        { t: '->', d: '화살표 문법이에요 — case와 결과를 직관적으로 연결하고 fall-through 버그를 없애줘요' },
        { t: 'default -> 31', d: '위 case들에 매칭되지 않은 모든 경우를 처리해요 — 빠뜨리면 컴파일 에러가 나요' },
        { t: 'int days = switch (month) { ... };', d: 'switch 전체가 하나의 식(expression)으로 값을 반환해 변수에 할당돼요' },
      ],
      why:
        'if-else if 연쇄보다 읽기 쉽고, 모든 경우를 다뤘는지 컴파일러가 확인해줘서 안전해요. ' +
        '실무에서는 Enum 타입별 분기 처리에 가장 많이 써요 (상태별 처리, HTTP 상태 코드별 메시지 등).',
      expectedOutput:
        'java Days\n' +
        '[실행] 입력 월: APR\n' +
        '[결과] APR의 일수: 30',
      realWorldUsage:
        '실제로 주문 상태(OrderStatus)에 따라 다음 가능한 상태 목록을 반환하는 메서드에서 switch expression을 써요. ' +
        'case PAID -> List.of(SHIPPED, CANCELLED)처럼 값 자체를 반환하는 패턴이 깔끔해요.',
      pitfall: '값을 반환하는 switch expression은 모든 가능한 경우를 다루지 않으면 컴파일 에러가 나요. Enum과 sealed 타입과 함께 쓰면 컴파일러가 철저히 확인해줘요.',
    },
  },
  {
    id: 'jc-pattern-switch',
    lang: 'java',
    title: 'Pattern Matching',
    file: 'Shapes.java',
    code: `public class Shapes {
    sealed interface Shape permits Circle, Square {}
    record Circle(int radius) implements Shape {}
    record Square(int side) implements Shape {}

    public static void main(String[] args) {
        Shape shape = new Circle(5);
        System.out.println("[실행] 입력 도형: " + shape);

        String desc = switch (shape) {
            case Circle c -> "circle r=" + c.radius();
            case Square s -> "square s=" + s.side();
        };
        System.out.println("[결과] " + desc);
    }
}`,
    explain: {
      concept:
        '패턴 매칭(Pattern Matching for switch)은 Java 21에서 정식 도입된 기능으로, 타입을 검사하면서 동시에 그 타입의 변수로 바로 받아 쓸 수 있어요. ' +
        '예전에는 instanceof로 타입 확인 → (Circle)로 형변환 → 지역 변수 할당까지 3줄 필요했는데, 이제 case Circle c 한 줄로 끝나요. ' +
        'sealed 인터페이스와 조합하면 가능한 모든 하위 타입을 컴파일러가 알고 있어서 default 없이도 완벽한 분기 처리가 돼요. ' +
        '타입 안전성과 간결함을 동시에 잡은 문법이어서, 실무에서 다형성 분기 처리를 완전히 새로 쓰게 만드는 기능이에요.',
      terms: [
        { t: 'case Circle c', d: 'shape가 Circle 타입이면 c라는 변수에 담아 바로 써요 — instanceof + 형변환을 한 번에 처리해요' },
        { t: 'c.radius()', d: '패턴 매칭으로 얻은 변수 c에서 바로 Circle의 메서드를 호출할 수 있어요' },
        { t: 'sealed interface Shape', d: '가능한 하위 타입이 Circle, Square 뿐이라고 컴파일러에게 알려줘요 — default가 필요 없어요' },
      ],
      why:
        'instanceof로 타입 확인 후 형변환하던 반복 코드를 없애고, 새 타입 추가 시 누락된 처리를 컴파일 에러로 알 수 있게 하려고 써요. ' +
        '실무에서는 다형적 도메인 모델(결제 방식: 카드/계좌이체/포인트 등)에서 분기 처리를 안전하게 하려고 써요.',
      expectedOutput:
        'java Shapes\n' +
        '[실행] 입력 도형: Circle[radius=5]\n' +
        '[결과] circle r=5',
      realWorldUsage:
        '실제로 결제 처리에서 PaymentMethod라는 sealed interface를 만들고, 카드·계좌이체·포인트를 record로 구현한 뒤, ' +
        'switch로 각 결제 방식에 맞는 처리를 하는 코드에서 이 패턴을 써요. 새로운 결제 방식이 추가되면 컴파일 에러로 놓친 부분을 바로 알 수 있어요.',
      pitfall: 'Java 21 이전 버전에서는 이 문법이 preview 기능이에요. 프로젝트의 Java 버전을 반드시 21 이상으로 확인하세요.',
    },
  },
  {
    id: 'jc-text-block',
    lang: 'java',
    title: 'Text Block',
    file: 'Json.java',
    code: `public class Json {
    public static void main(String[] args) {
        String json = """
        {
          "name": "kim",
          "age": 30
        }
        """;
        System.out.println("[결과] JSON:\n" + json);
    }
}`,
    explain: {
      concept:
        'Text Block은 여러 줄 문자열을 줄바꿈이나 따옴표 이스케이프 없이 그대로 작성할 수 있는 Java 15+ 문법이에요. ' +
        '기존에는 "{\\n  \\"name\\": \\"kim\\"\\n}"처럼 백슬래시와 따옴표 투성이였는데, 이제 """ 사이에 그냥 쓰면 돼요. ' +
        '공통 들여쓰기는 자동으로 정리돼서, 코드 들여쓰기와 실제 문자열 내용이 분리돼요. ' +
        '실무에서는 SQL 쿼리, JSON 테스트 데이터, HTML 템플릿 등 여러 줄 문자열이 필요한 곳에서 가독성을 확 올려줘요.',
      terms: [
        { t: '"""', d: 'Text Block의 시작과 끝을 나타내는 구분자예요 — 세 개의 큰따옴표로 감싸요' },
        { t: '들여쓰기 자동 정리', d: '닫는 """의 위치를 기준으로 공통 공백이 제거돼요 — 코드 들여쓰기에 신경 안 써도 돼요' },
      ],
      why:
        'SQL, JSON, HTML 같은 여러 줄 문자열을 이스케이프 없이 사람이 읽기 좋게 작성하려고 써요. ' +
        '실무에서는 @Query 안에 JPQL을 Text Block으로 작성하면 쿼리 가독성이 크게 좋아져요.',
      expectedOutput:
        'java Json\n' +
        '[결과] JSON:\n' +
        '{\n' +
        '  "name": "kim",\n' +
        '  "age": 30\n' +
        '}',
      realWorldUsage:
        '실제로 스프링에서 @Query 어노테이션 안에 복잡한 JPQL을 작성할 때 Text Block으로 쓰면 SQL처럼 읽기 쉬워져요. ' +
        '테스트 코드에서 예상 JSON 응답을 작성할 때도 Text Block이 기본이 됐어요.',
      pitfall: '""" 다음에는 반드시 줄바꿈이 와야 해요. 같은 줄에 내용을 시작하면 컴파일 에러가 나요.',
    },
  },
  {
    id: 'jc-enhanced-for',
    lang: 'java',
    title: 'Enhanced For',
    file: 'Loop.java',
    code: `import java.util.List;

public class Loop {
    public static void main(String[] args) {
        var numbers = List.of(1, 2, 3, 4, 5);
        System.out.println("[실행] 목록: " + numbers);

        var total = 0;
        for (var n : numbers) {
            total += n;
            System.out.println("[실행] 현재 n: " + n + ", 누적합: " + total);
        }
        System.out.println("[결과] 총합: " + total);
    }
}`,
    explain: {
      concept:
        'Enhanced for(향상된 for문)는 배열이나 컬렉션의 모든 요소를 인덱스 없이 하나씩 꺼내 처리하는 반복문이에요. ' +
        '기존 for문처럼 int i = 0; i < list.size(); i++ 같은 인덱스 관리를 직접 할 필요가 없어서, "범위를 벗어났다"거나 "인덱스를 잘못 썼다"는 실수가 원천 차단돼요. ' +
        'var 키워드로 타입을 생략할 수 있어서 더 간결하게 쓸 수 있고, 읽을 때도 "numbers의 각 n에 대해"라고 자연스럽게 읽혀요. ' +
        '실무에서 가장 많이 보는 반복문 스타일이에요 — 컬렉션 순회할 때는 거의 항상 이 형태를 써요.',
      terms: [
        { t: 'for (var n : numbers)', d: 'numbers의 각 요소를 순서대로 n에 담아 반복해요 — 인덱스 없이 안전하게 순회해요' },
        { t: 'var', d: '타입을 자동으로 추론해요 — numbers가 List<Integer>니까 n은 int로 추론돼요' },
        { t: 'total += n', d: 'total에 n을 더한 값을 다시 total에 저장해요 — 복합 대입 연산자예요' },
        { t: 'var total = 0', d: '초기값 0으로 total을 선언해요 — 컴파일러가 int 타입으로 추론해요' },
      ],
      why:
        '컬렉션을 간결하고 안전하게 순회하려고 써요. ' +
        '인덱스를 직접 다루지 않아서 off-by-one 오류(인덱스 1 차이로 생기는 버그)를 피할 수 있어요.',
      expectedOutput:
        'java Loop\n' +
        '[실행] 목록: [1, 2, 3, 4, 5]\n' +
        '[실행] 현재 n: 1, 누적합: 1\n' +
        '[실행] 현재 n: 2, 누적합: 3\n' +
        '[실행] 현재 n: 3, 누적합: 6\n' +
        '[실행] 현재 n: 4, 누적합: 10\n' +
        '[실행] 현재 n: 5, 누적합: 15\n' +
        '[결과] 총합: 15',
      realWorldUsage:
        '실제로 DB에서 조회한 List<Order>를 for (var order : orders)로 순회하면서 order.getTotalAmount()를 누적해 일일 매출을 계산하는 코드에서 매일 써요.',
      pitfall: 'Enhanced for문에서는 현재 인덱스 값을 알 수 없어요. 인덱스가 필요하면 전통적인 for (int i = 0; ...)를 써야 해요.',
    },
  },
];
