import type { Snippet } from '../../types';

export const designPattern: Snippet[] = [
  {
    id: 'dp-singleton',
    lang: 'java',
    title: 'Singleton - 단일 인스턴스',
    file: 'ConfigManager.java',
    code: `public class ConfigManager {
  private static volatile ConfigManager instance;

  private ConfigManager() {}

  public static ConfigManager getInstance() {
    if (instance == null) {
      synchronized (ConfigManager.class) {
        if (instance == null) {
          System.out.println("[실행] ConfigManager 최초 생성");
          instance = new ConfigManager();
        }
      }
    }
    System.out.println("[반환] 기존 인스턴스 반환");
    return instance;
  }
}`,
    explain: {
      concept:
        '싱글톤(Singleton) 패턴은 나라에 대통령이 한 명뿐인 것처럼, 클래스의 인스턴스를 딱 하나만 만들고 어디서 요청해도 같은 객체를 돌려주는 패턴이에요. ' +
        '설정 정보·커넥션 풀·로거처럼 앱 전체에서 하나만 있으면 되는 객체에 써요. ' +
        '이 코드에서 private 생성자는 외부에서 new ConfigManager()를 못 하게 막고, getInstance()만이 유일한 접근로예요. ' +
        'synchronized 블록과 volatile 키워드로 멀티스레드 환경에서도 안전하게 하나의 인스턴스만 생성되는 걸 보장해요. 이걸 Double-Checked Locking이라고 불러요.',
      terms: [
        { t: 'private 생성자', d: '외부에서 new로 인스턴스를 만들지 못하게 막는 역할이에요. getInstance()만 허용해요.' },
        { t: 'volatile', d: '변수 값을 CPU 캐시가 아닌 메인 메모리에서 읽게 해서, 모든 스레드가 항상 최신 값을 보게 해줘요.' },
        { t: 'synchronized', d: '한 번에 하나의 스레드만 이 블록에 진입하게 잠금을 걸어요. 동시 생성 충돌을 막아줘요.' },
        { t: 'Double-Checked Locking', d: 'synchronized 전후로 두 번 null 체크해서, 불필요한 잠금을 피하면서도 안전하게 생성해요.' },
        { t: 'getInstance()', d: '클래스 인스턴스를 얻는 유일한 진입점이에요. 항상 같은 객체를 반환해요.' },
      ],
      expectedOutput:
        '첫 getInstance() 호출 시:\n' +
        '[실행] ConfigManager 최초 생성\n\n' +
        '이후 getInstance() 호출 시:\n' +
        '[반환] 기존 인스턴스 반환',
      realWorldUsage:
        '실제 프로젝트에서 설정 관리자(Configuration Manager), 데이터베이스 커넥션 풀, 로깅 프레임워크의 Logger가 싱글톤으로 구현돼요. 로그 출력을 담당하는 Logger가 인스턴스를 여러 개 만들면, 서로 다른 설정으로 로그가 찍혀서 디버깅이 혼란스러워져요. 그래서 반드시 하나만 존재하게 만들어요.',
      why: '앱 전체에서 단 하나만 존재해야 하는 자원(설정·연결·캐시)을 공유하고, 불필요한 중복 생성을 막으려고요.',
      pitfall: '스프링을 쓴다면 @Bean의 기본 스코프가 이미 싱글톤이에요. 직접 싱글톤을 구현할 필요 없이 스프링에게 맡기는 게 더 안전하고 간단해요.',
    },
  },
  {
    id: 'dp-factory-method',
    lang: 'java',
    title: 'Simple Factory - 정적 팩터리',
    file: 'NotificationFactory.java',
    code: `public interface NotificationSender {
  void send(String to, String msg);
}

public class EmailSender implements NotificationSender {
  public void send(String to, String msg) {
    System.out.println("[전송] 이메일 — to: " + to + ", msg: " + msg);
  }
}

public class SmsSender implements NotificationSender {
  public void send(String to, String msg) {
    System.out.println("[전송] SMS — to: " + to + ", msg: " + msg);
  }
}

public class NotificationFactory {
  public static NotificationSender of(String type) {
    System.out.println("[실행] 팩터리 생성 요청 — type: " + type);
    return switch (type) {
      case "email" -> new EmailSender();
      case "sms"   -> new SmsSender();
      default -> throw new IllegalArgumentException("알 수 없는 타입: " + type);
    };
  }
}`,
    explain: {
      concept:
        '정적 팩터리(Simple Factory)는 주문서만 내면 공장이 알맞은 제품을 만들어주는 패턴이에요. ' +
        '호출자는 "어떤 클래스가 만들어지는지" 전혀 몰라도 돼요 — notiFactory.send("email")이라고만 하면 EmailSender가 생성되는 거예요. ' +
        'Java 14+의 switch 표현식(-> 화살표)을 써서 if-else보다 훨씬 간결하게 타입 분기를 처리하고 있어요. ' +
        'GoF의 Factory Method(서브클래스가 생성 결정)와는 다른, 가장 단순한 생성 분리 방법이에요. 새 타입을 추가하려면 case를 하나 더 넣으면 돼요.',
      terms: [
        { t: 'NotificationSender', d: '공통 인터페이스예요. 팩터리가 만드는 모든 객체가 이 타입을 구현해요.' },
        { t: 'EmailSender / SmsSender', d: '팩터리가 만들어내는 구체적인 제품 클래스예요. 호출자는 이 클래스 이름을 몰라도 돼요.' },
        { t: 'of(type)', d: '타입 문자열을 받아 맞는 객체를 생성하는 정적 메서드예요. 생성 로직이 한 곳에 집중돼 있어요.' },
        { t: 'switch 표현식 (->)', d: 'Java 14+의 화살표 switch예요. case마다 값을 반환할 수 있어서 return switch 형태로 간결하게 써요.' },
        { t: 'IllegalArgumentException', d: '알 수 없는 타입이 들어왔을 때 명확한 메시지와 함께 예외를 던져요.' },
      ],
      expectedOutput:
        'NotificationFactory.of("email"):\n' +
        '[실행] 팩터리 생성 요청 — type: email\n' +
        'NotificationFactory.of("sms"):\n' +
        '[실행] 팩터리 생성 요청 — type: sms\n' +
        'NotificationFactory.of("push"):\n' +
        '→ IllegalArgumentException: 알 수 없는 타입: push',
      realWorldUsage:
        '실제 프로젝트에서 결제 수단(카드·계좌이체·간편결제), 알림 채널(이메일·SMS·푸시), 파일 형식(PDF·Excel·CSV)별로 서로 다른 처리기를 생성할 때 Simple Factory를 써요. 신규 결제 수단이 추가되면 case 하나만 추가하면 되고, 기존 코드는 전혀 건드리지 않아서 안전해요.',
      why: '객체 생성 코드를 한 곳에 모아서, 생성할 타입이 늘어나도 호출 코드는 변경되지 않게 하려고요.',
      pitfall: '새 타입이 자주 추가된다면, 팩터리 코드를 계속 수정해야 하는 문제(개방-폐쇄 원칙 위반)가 생겨요. 확장이 잦으면 GoF Factory Method나 전략 패턴(Strategy) + 스프링 DI 조합을 고려하세요.',
    },
  },
  {
    id: 'dp-builder',
    lang: 'java',
    title: 'Builder - 단계적 조립',
    file: 'UserBuilder.java',
    code: `public class User {
  private final String name;
  private final String email;
  private final int age;

  private User(Builder b) {
    this.name  = b.name;
    this.email = b.email;
    this.age   = b.age;
  }

  public static Builder builder() {
    return new Builder();
  }

  public static class Builder {
    private String name;
    private String email;
    private int    age;

    public Builder name(String n)  { this.name  = n; return this; }
    public Builder email(String e) { this.email = e; return this; }
    public Builder age(int a)      { this.age   = a; return this; }

    public User build() {
      System.out.println("[실행] User 빌드 — name: " + name + ", email: " + email + ", age: " + age);
      if (name == null || name.isBlank()) {
        throw new IllegalStateException("name은 필수값이에요");
      }
      return new User(this);
    }
  }

  @Override
  public String toString() {
    return "User{name='" + name + "', email='" + email + "', age=" + age + "}";
  }
}`,
    explain: {
      concept:
        '빌더(Builder) 패턴은 햄버거 세트를 하나씩 골라 조립하듯 객체를 만드는 패턴이에요. ' +
        '생성자에 파라미터가 많으면 순서가 헷갈리고, new User(null, "email", -1) 같은 실수가 런타임까지 발견되지 않아요. ' +
        '빌더는 각 필드에 의미 있는 이름을 붙이고(name(), email(), age()), build() 호출 시점에 필수값 검증을 한 번에 수행해줘요. ' +
        'return this로 메서드 체이닝을 구현해서, User.builder().name("kim").email("k@t.com").age(25).build()처럼 읽기 쉽게 작성할 수 있어요.',
      terms: [
        { t: 'Builder (inner class)', d: '객체 조립을 단계별로 수행하는 내부 클래스예요. 각 setter가 자기 자신을 반환해 체이닝을 구현해요.' },
        { t: 'return this', d: '메서드가 자기 자신을 반환해서 연속 호출을 가능하게 해요. builder.name().email().age().build() 식으로 이어 써요.' },
        { t: 'build()', d: '최종 객체를 생성하고 필수값 검증을 수행해요. 여기서 오류를 내서 잘못된 객체가 생기지 않게 해요.' },
        { t: 'private User(Builder b)', d: '생성자를 private으로 숨겨서 빌더를 통해서만 객체를 만들 수 있게 해요.' },
        { t: 'IllegalStateException', d: '필수값이 누락된 상태에서 build()를 호출하면 예외를 던져서 즉시 알려줘요.' },
      ],
      expectedOutput:
        'User.builder().name("kim").email("kim@test.com").age(25).build():\n' +
        '[실행] User 빌드 — name: kim, email: kim@test.com, age: 25\n' +
        '→ User{name="kim", email="kim@test.com", age=25}\n\n' +
        'User.builder().email("test").build() (name 누락):\n' +
        '→ IllegalStateException: name은 필수값이에요',
      realWorldUsage:
        '실제 프로젝트에서 엔티티·DTO·요청 객체처럼 필드가 5개 이상인 객체는 거의 모두 빌더로 만들어요. 특히 필수값과 선택값이 섞여 있는 경우, 빌더가 없으면 생성자 오버로딩이 수십 개 필요해지는 조합 폭발 문제가 생겨요. Lombok의 @Builder를 쓰면 이 코드 전체가 한 줄로 대체돼요.',
      why: '파라미터가 많은 객체 생성을 가독성 좋게 하고, 필수값 검증을 생성 시점에 강제하려고요.',
      pitfall: 'Lombok @Builder를 쓰면 보일러플레이트 코드를 90% 이상 줄일 수 있어요. 다만 Lombok이 제공하는 toBuilder, @Builder.Default 같은 고급 옵션의 동작 방식을 이해하고 써야 예상치 못한 동작을 방지할 수 있어요.',
    },
  },
  {
    id: 'dp-strategy',
    lang: 'java',
    title: 'Strategy - 알고리즘 교체',
    file: 'DiscountStrategy.java',
    code: `public interface DiscountStrategy {
  long apply(long originalPrice);
}

public class PercentDiscount implements DiscountStrategy {
  private final int percent;
  public PercentDiscount(int percent) { this.percent = percent; }
  public long apply(long price) {
    long result = price - (price * percent / 100);
    System.out.println("[실행] " + percent + "% 할인 — " + price + " -> " + result);
    return result;
  }
}

public class FixedDiscount implements DiscountStrategy {
  private final long amount;
  public FixedDiscount(long amount) { this.amount = amount; }
  public long apply(long price) {
    long result = Math.max(0, price - amount);
    System.out.println("[실행] " + amount + "원 할인 — " + price + " -> " + result);
    return result;
  }
}

public class OrderService {
  private DiscountStrategy strategy;
  public void setStrategy(DiscountStrategy s) {
    System.out.println("[전략] 할인 전략 교체: " + s.getClass().getSimpleName());
    this.strategy = s;
  }
  public long calculatePrice(long original) { return strategy.apply(original); }
}`,
    explain: {
      concept:
        '전략(Strategy) 패턴은 렌터카에서 필요에 따라 차를 갈아타듯, 알고리즘을 실행 중에 자유롭게 교체할 수 있게 해주는 패턴이에요. ' +
        'DiscountStrategy 인터페이스로 "할인"이라는 공통 약속을 정의하고, PercentDiscount(퍼센트 할인)와 FixedDiscount(정액 할인)라는 서로 다른 전략을 구현체로 제공해요. ' +
        'OrderService는 DiscountStrategy 타입만 바라보고, setStrategy()로 실행 중에도 전략을 바꿀 수 있어요. ' +
        '새로운 할인 방식(예: 등급별 차등 할인)이 필요해도 OrderService 코드는 한 줄도 고치지 않고 새 구현체만 추가하면 돼요.',
      terms: [
        { t: 'DiscountStrategy (인터페이스)', d: '할인 알고리즘의 공통 약속이에요. apply()라는 메서드 시그니처만 정의하고 구현은 각 전략에 맡겨요.' },
        { t: 'PercentDiscount', d: '원가의 특정 퍼센트만큼 할인하는 전략이에요. 생성자에서 할인율을 받아 설정해요.' },
        { t: 'FixedDiscount', d: '원가에서 정해진 금액만큼 할인하는 전략이에요. Math.max(0, ...)로 음수 방지 처리를 해요.' },
        { t: 'setStrategy()', d: '실행 중에 전략을 교체할 수 있게 해줘요. 특정 조건(회원 등급·쿠폰 보유)에 따라 다른 전략을 선택할 수 있어요.' },
        { t: 'Math.max(0, price - amount)', d: '할인액이 원가보다 크면 0원이 반환돼요. 마이너스 금액을 방지하는 방어 로직이에요.' },
      ],
      expectedOutput:
        'setStrategy(new PercentDiscount(10)) → calculatePrice(10000):\n' +
        '[전략] 할인 전략 교체: PercentDiscount\n' +
        '[실행] 10% 할인 — 10000 -> 9000\n\n' +
        'setStrategy(new FixedDiscount(2000)) → calculatePrice(10000):\n' +
        '[전략] 할인 전략 교체: FixedDiscount\n' +
        '[실행] 2000원 할인 — 10000 -> 8000',
      realWorldUsage:
        '실제 전자상거래 프로젝트에서 할인 정책(회원 등급 할인·쿠폰 할인·시즌 할인·적립금 사용)이 전략 패턴으로 구현돼요. 사용자가 쿠폰을 적용하면 CouponDiscountStrategy로 교체되고, 적립금을 사용하면 PointDiscountStrategy로 교체돼요. 두 할인을 동시에 적용하려면 전략들을 리스트로 묶어 순차적으로 apply()할 수도 있어요.',
      why: '알고리즘을 실행 코드에서 분리해서, 런타임에 유연하게 교체할 수 있고 새 전략 추가가 기존 코드를 변경하지 않게 하려고요(OCP).',
      pitfall: '전략 클래스가 너무 많아지면 어떤 전략이 있는지 파악하기 어려워지고 선택 로직이 복잡해져요. 전략 선택을 팩터리나 DI 컨테이너에 위임해서 관리하는 게 좋아요.',
    },
  },
  {
    id: 'dp-observer',
    lang: 'java',
    title: 'Observer - 이벤트 구독',
    file: 'NewsPublisher.java',
    code: `import java.util.ArrayList;
import java.util.List;

public interface Subscriber {
  void update(String article);
}

public class NewsPublisher {
  private final List<Subscriber> subscribers = new ArrayList<>();

  public void subscribe(Subscriber s) {
    System.out.println("[구독] 새 구독자 등록");
    subscribers.add(s);
  }

  public void unsubscribe(Subscriber s) {
    System.out.println("[해지] 구독자 제거");
    subscribers.remove(s);
  }

  public void publish(String article) {
    System.out.println("[발행] 새 기사: " + article);
    for (Subscriber s : subscribers) {
      s.update(article);
    }
  }
}`,
    explain: {
      concept:
        '옵저버(Observer) 패턴은 신문 구독과 똑같이 동작해요. 구독자(Observer)가 출판사(Subject)에 "새 기사 나오면 알려줘"라고 등록해 두면, 기사가 나올 때마다 자동으로 통보를 받아요. ' +
        '출판사는 구독자가 몇 명인지, 누군지, 알림을 받고 무슨 일을 하는지 전혀 몰라요 — 그냥 등록된 모든 구독자에게 update()를 호출할 뿐이에요. ' +
        '이게 느슨한 결합(Loose Coupling)의 핵심이에요. 새 구독자를 추가할 때 출판사 코드를 전혀 수정하지 않아도 돼요. ' +
        '실제로 스프링의 ApplicationEvent, 자바의 Observable/PropertyChangeListener, 메시지 큐의 Pub/Sub 모두 이 패턴을 기반으로 해요.',
      terms: [
        { t: 'Subscriber (인터페이스)', d: '구독자가 반드시 구현해야 하는 약속이에요. update()로 알림을 받아요.' },
        { t: 'NewsPublisher', d: '출판사(주체)예요. 구독자 목록을 관리하고 새 소식을 모두에게 전파해요.' },
        { t: 'subscribe(s)', d: '구독자를 목록에 추가해요. 이후 publish() 호출 시 이 구독자도 알림을 받아요.' },
        { t: 'unsubscribe(s)', d: '구독자를 목록에서 제거해요. 더 이상 알림을 받지 않아요.' },
        { t: 'publish(article)', d: '모든 구독자에게 기사를 전파하는 메서드예요. for 루프로 순회하며 update()를 호출해요.' },
      ],
      expectedOutput:
        'subscribe(user1) → publish("속보: ..."):\n' +
        '[구독] 새 구독자 등록\n' +
        '[발행] 새 기사: 속보: ...\n' +
        '(구독자 user1.update("속보: ...") 호출)\n\n' +
        'unsubscribe(user1) → publish("두 번째 기사"):\n' +
        '[해지] 구독자 제거\n' +
        '[발행] 새 기사: 두 번째 기사\n' +
        '(구독자 없음 — 알림 전파 안 됨)',
      realWorldUsage:
        '실제 프로젝트에서 주문 완료 → 이메일 발송 + 포인트 적립 + 재고 감소 + 통계 업데이트처럼 하나의 이벤트에 여러 후속 작업이 연결될 때 옵저버 패턴을 써요. 주문 로직은 "주문 완료"만 신경 쓰고, 나머지는 각 구독자가 알아서 처리해요. 주문 코드에 이메일·포인트·재고 코드가 전혀 없어서, 새 후속 작업이 추가돼도 주문 코드를 수정하지 않아도 돼요.',
      why: '주체(Subject)와 구독자(Observer)를 느슨하게 연결해서, 한쪽 변경이 다른 쪽으로 전파되지 않게 하고 새 구독자를 자유롭게 추가하려고요.',
      pitfall: '구독 해제를 안 하면 구독자 객체가 가비지 컬렉션되지 않고 계속 메모리에 남는 누수(leak)가 발생할 수 있어요. 생명주기가 끝나는 컴포넌트는 반드시 unsubscribe()를 호출해야 해요.',
    },
  },
  {
    id: 'dp-template-method',
    lang: 'java',
    title: 'Template Method - 뼈대 고정',
    file: 'AbstractReport.java',
    code: `public abstract class AbstractReport {
  public final void generate() {
    System.out.println("[실행] 리포트 생성 시작");
    prepare();
    collect();
    format();
    deliver();
    System.out.println("[결과] 리포트 생성 완료");
  }

  protected void prepare() { System.out.println("[단계] 준비"); }
  protected abstract void collect();
  protected abstract void format();
  protected void deliver() { System.out.println("[단계] 이메일 전송"); }
}

public class SalesReport extends AbstractReport {
  protected void collect() { System.out.println("[단계] 매출 데이터 수집"); }
  protected void format()  { System.out.println("[단계] 표 형식으로 포맷팅"); }
}`,
    explain: {
      concept:
        '템플릿 메서드(Template Method) 패턴은 요리 레시피처럼 "전체 흐름은 내가 정할게, 세부 단계는 네가 알아서 해"라고 하는 패턴이에요. ' +
        'AbstractReport의 generate()가 final로 선언돼서, 자식 클래스가 전체 흐름(준비→수집→포맷→전송)을 절대 바꿀 수 없어요. ' +
        'collect()와 format()은 abstract라서 자식이 반드시 구현해야 하고, prepare()와 deliver()는 기본 구현을 제공하면서도 protected라서 자식이 필요하면 오버라이드할 수 있어요. ' +
        'SalesReport는 collect()와 format()만 자신의 방식으로 구현하고, 흐름은 부모가 정한 대로 그대로 따라가요.',
      terms: [
        { t: 'abstract class', d: '뼈대만 가진 추상 클래스예요. 공통 흐름을 정의하고 일부 메서드는 자식에게 구현을 맡겨요.' },
        { t: 'final generate()', d: '전체 실행 순서가 고정된 템플릿 메서드예요. final이라 자식이 오버라이드할 수 없어요.' },
        { t: 'abstract void collect()', d: '자식 클래스가 반드시 구현해야 하는 추상 단계예요. 구현하지 않으면 컴파일 에러가 나요.' },
        { t: 'protected', d: '자식 클래스만 접근 가능한 접근 제한자예요. 외부에서는 이 메서드를 직접 호출할 수 없어요.' },
        { t: 'SalesReport', d: '템플릿의 세부 단계를 구체적으로 구현한 자식 클래스예요. 매출 데이터 수집과 표 형식 포맷팅을 담당해요.' },
      ],
      expectedOutput:
        'new SalesReport().generate():\n' +
        '[실행] 리포트 생성 시작\n' +
        '[단계] 준비\n' +
        '[단계] 매출 데이터 수집\n' +
        '[단계] 표 형식으로 포맷팅\n' +
        '[단계] 이메일 전송\n' +
        '[결과] 리포트 생성 완료',
      realWorldUsage:
        '실제 프로젝트에서 스프링의 JdbcTemplate, RestTemplate, TransactionTemplate 모두 템플릿 메서드 패턴의 실전 예예요. "커넥션 열기 → SQL 실행 → 결과 매핑 → 커넥션 닫기"에서 SQL 실행과 결과 매핑만 우리가 채우고, 커넥션 관리라는 뼈대는 JdbcTemplate이 알아서 해줘요. 에러 처리와 자원 해제 코드를 매번 반복 작성하지 않아도 돼요.',
      why: '공통 흐름을 한 곳에 모으고, 변경이 필요한 부분만 자식 클래스에서 구현해서 코드 중복을 제거하려고요.',
      pitfall: 'generate()에 붙은 final을 빼먹으면 자식 클래스가 순서를 마음대로 바꿀 수 있어요. 템플릿 메서드는 반드시 final로 고정해서 흐름의 무결성을 보장해야 해요.',
    },
  },
  {
    id: 'dp-decorator',
    lang: 'java',
    title: 'Decorator - 기능 덧입히기',
    file: 'CoffeeDecorator.java',
    code: `public interface Coffee {
  String description();
  int cost();
}

public class BasicCoffee implements Coffee {
  public String description() { return "커피"; }
  public int cost()           { return 2000; }
}

public class MilkDecorator implements Coffee {
  private final Coffee inner;
  public MilkDecorator(Coffee c) { this.inner = c; }
  public String description() { return inner.description() + " + 우유"; }
  public int cost()           { return inner.cost() + 500; }
}

public class SugarDecorator implements Coffee {
  private final Coffee inner;
  public SugarDecorator(Coffee c) { this.inner = c; }
  public String description() { return inner.description() + " + 설탕"; }
  public int cost()           { return inner.cost() + 200; }
}`,
    explain: {
      concept:
        '데코레이터(Decorator) 패턴은 옷을 겹쳐 입듯, 객체에 새 기능을 덧입히는 패턴이에요. ' +
        'BasicCoffee(기본 커피)를 MilkDecorator로 감싸면 우유가 추가되고, 다시 SugarDecorator로 감싸면 설탕까지 추가돼요. ' +
        '상속 없이도 기능을 유연하게 조합할 수 있는 게 가장 큰 장점이에요. 상속으로 MilkCoffee, SugarCoffee, MilkSugarCoffee를 각각 만들 필요 없이, 데코레이터를 원하는 순서로 중첩하기만 하면 모든 조합을 표현할 수 있어요. ' +
        'Coffee 인터페이스를 구현해서 감싸는 객체와 똑같은 타입을 유지하므로, 데코레이터의 존재를 클라이언트가 전혀 몰라도 돼요.',
      terms: [
        { t: 'Coffee (인터페이스)', d: '커피의 공통 타입이에요. 데코레이터도 이 인터페이스를 구현해서 원본과 같은 타입을 유지해요.' },
        { t: 'BasicCoffee', d: '가장 기본이 되는 원본 객체예요. 아무런 추가 재료 없이 2000원의 커피만 있어요.' },
        { t: 'MilkDecorator', d: '커피에 우유를 추가하는 데코레이터예요. description()에 " + 우유"를 덧붙이고 cost()에 500원을 더해요.' },
        { t: 'SugarDecorator', d: '커피에 설탕을 추가하는 데코레이터예요. description()에 " + 설탕"을 덧붙이고 cost()에 200원을 더해요.' },
        { t: 'inner', d: '데코레이터가 감싸고 있는 내부 객체예요. 중첩된 데코레이터라면 안쪽 데코레이터 또는 원본 BasicCoffee예요.' },
      ],
      expectedOutput:
        'new SugarDecorator(new MilkDecorator(new BasicCoffee())):\n' +
        'description() → "커피 + 우유 + 설탕"\n' +
        'cost() → 2000 + 500 + 200 = 2700\n\n' +
        'new MilkDecorator(new BasicCoffee()):\n' +
        'description() → "커피 + 우유"\n' +
        'cost() → 2000 + 500 = 2500',
      realWorldUsage:
        '실제 프로젝트에서 스프링의 Servlet Filter Chain, InputStream/OutputStream 래퍼(BufferedInputStream, GZIPOutputStream), HTTP 요청 인터셉터가 모두 데코레이터 패턴이에요. 요청이 들어오면 인증 필터 → 로깅 필터 → 압축 필터 → 실제 서블릿 순으로 데코레이터가 중첩돼서 실행돼요.',
      why: '상속 없이도 런타임에 객체의 기능을 유연하게 조합하고 확장하려고요. 상속은 컴파일 타임에 고정되지만 데코레이터는 런타임에 자유롭게 조립할 수 있어요.',
      pitfall: '데코레이터가 많이 중첩되면 디버깅이 어려워져요. 어느 데코레이터에서 문제가 생겼는지 콜스택을 따라가기 힘들 수 있어서, 지나친 중첩은 피하는 게 좋아요.',
    },
  },
  {
    id: 'dp-adapter',
    lang: 'java',
    title: 'Adapter - 호환 안 맞는 인터페이스',
    file: 'LegacyPrinterAdapter.java',
    code: `public interface Printer {
  void print(String text);
}

public class LegacyPrinter {
  public void writeLine(String s) {
    System.out.println("[레거시] " + s);
  }
}

public class LegacyPrinterAdapter implements Printer {
  private final LegacyPrinter legacy;

  public LegacyPrinterAdapter(LegacyPrinter l) {
    System.out.println("[어댑터] LegacyPrinter 래핑");
    this.legacy = l;
  }

  public void print(String text) {
    System.out.println("[변환] print() -> writeLine()");
    legacy.writeLine(text);
  }
}`,
    explain: {
      concept:
        '어댑터(Adapter) 패턴은 해외여행용 전원 플러그 변환기처럼, 규격이 달라서 직접 연결할 수 없는 두 인터페이스를 연결해줘요. ' +
        'LegacyPrinter는 우리가 원하는 Printer 인터페이스(print)가 아니라 자기만의 writeLine 메서드를 가지고 있어요 — 이걸 우리가 바꿀 수도 없어요(레거시 코드니까요). ' +
        'LegacyPrinterAdapter가 Printer를 구현하고 내부에서 LegacyPrinter의 writeLine을 호출해줘서, 우리 새 코드는 Printer 인터페이스만 보고 작업할 수 있게 돼요. ' +
        '레거시 코드를 전혀 수정하지 않고도 새 시스템에 통합할 수 있는 게 어댑터의 가장 큰 장점이에요.',
      terms: [
        { t: 'Printer', d: '우리 새 시스템이 기대하는 표준 인터페이스예요. print(String) 메서드를 요구해요.' },
        { t: 'LegacyPrinter', d: '수정할 수 없는 낡은 클래스예요. 우리 인터페이스와 다른 writeLine() 메서드만 있어요.' },
        { t: 'LegacyPrinterAdapter', d: '두 인터페이스를 연결해주는 어댑터예요. Printer를 구현하고 내부에서 LegacyPrinter를 호출해요.' },
        { t: 'implements Printer', d: '우리 표준 인터페이스를 구현해서, 새 코드가 어댑터를 Printer로 인식하게 해요.' },
        { t: 'writeLine(text)', d: '레거시 클래스의 원래 메서드예요. 어댑터가 print() 요청을 이 메서드로 변환해서 전달해요.' },
      ],
      expectedOutput:
        'new LegacyPrinterAdapter(new LegacyPrinter()):\n' +
        '[어댑터] LegacyPrinter 래핑\n' +
        'printer.print("Hello"):\n' +
        '[변환] print() -> writeLine()\n' +
        '[레거시] Hello',
      realWorldUsage:
        '실제 프로젝트에서 외부 결제 모듈·문자 발송 API·구버전 라이브러리 통합 시 어댑터 패턴이 필수예요. 각기 다른 결제사의 API(PG사 A는 pay(), B는 charge(), C는 transact())를 통일된 PaymentGateway 인터페이스로 맞춰주고, 비즈니스 코드는 PaymentGateway만 보고 작업할 수 있어요. 새 PG사 추가 시 어댑터 하나만 만들면 끝이에요.',
      why: '수정할 수 없는 기존 코드를 우리 시스템의 표준 인터페이스에 맞춰 재사용하려고요.',
      pitfall: '어댑터가 너무 많아지면 시스템 구조가 복잡해지고, 어떤 어댑터가 어떤 레거시를 감싸는지 추적하기 어려워져요. 어댑터의 용도를 문서화하거나 패키지 구조로 명확히 구분하는 게 좋아요.',
    },
  },
  {
    id: 'dp-proxy',
    lang: 'java',
    title: 'Proxy - 대리인',
    file: 'LazyImageProxy.java',
    code: `public interface Image {
  void display();
}

public class RealImage implements Image {
  private final String path;
  public RealImage(String p) {
    this.path = p;
    loadFromDisk();
  }
  private void loadFromDisk() { System.out.println("[로드] 디스크에서 읽는 중: " + path); }
  public void display()       { System.out.println("[표시] " + path); }
}

public class LazyImageProxy implements Image {
  private RealImage real;
  private final String path;
  public LazyImageProxy(String p) { this.path = p; }
  public void display() {
    if (real == null) {
      System.out.println("[프록시] 최초 호출 — RealImage 생성");
      real = new RealImage(path);
    } else {
      System.out.println("[프록시] 캐시된 RealImage 재사용");
    }
    real.display();
  }
}`,
    explain: {
      concept:
        '프록시(Proxy) 패턴은 본인이 직접 일하지 않고 대리인을 내세우는 패턴이에요. ' +
        'LazyImageProxy는 RealImage의 대리인이에요 — display()가 처음 호출될 때까지 진짜 RealImage를 만들지 않고 기다리다가, 꼭 필요할 때만 생성해요. ' +
        'RealImage는 생성 시 loadFromDisk()로 디스크에서 이미지를 로드하는데, 이 작업이 무겁고 느려요. 하지만 프록시 덕분에 display()가 호출되기 전까지는 디스크 로딩이 전혀 일어나지 않아요. ' +
        '이걸 지연 로딩(Lazy Loading)이라고 하고, 자원을 꼭 필요한 순간까지 아끼는 전략이에요. 두 번째 호출부터는 이미 생성된 RealImage를 바로 재사용해요.',
      terms: [
        { t: 'Image (인터페이스)', d: '본인(RealImage)과 대리인(Proxy)이 공유하는 공통 타입이에요. 클라이언트는 누가 본인인지 몰라요.' },
        { t: 'RealImage', d: '실제로 무거운 작업(디스크 로딩)을 하는 본인 클래스예요. 생성 즉시 loadFromDisk()로 이미지를 읽어요.' },
        { t: 'LazyImageProxy', d: '대리인 클래스예요. display()가 호출될 때까지 RealImage 생성을 미뤄서 자원을 아껴요.' },
        { t: 'real == null 체크', d: '프록시의 핵심 로직이에요. 첫 호출 때만 RealImage를 생성하고, 이후엔 캐시된 객체를 재사용해요.' },
        { t: 'loadFromDisk()', d: '디스크에서 이미지 파일을 읽어 메모리에 로드하는 무거운 작업이에요. 생성자에서만 실행돼요.' },
      ],
      expectedOutput:
        'new LazyImageProxy("photo.jpg").display() 첫 호출:\n' +
        '[프록시] 최초 호출 — RealImage 생성\n' +
        '[로드] 디스크에서 읽는 중: photo.jpg\n' +
        '[표시] photo.jpg\n\n' +
        '두 번째 display() 호출:\n' +
        '[프록시] 캐시된 RealImage 재사용\n' +
        '[표시] photo.jpg',
      realWorldUsage:
        '실제 프로젝트에서 Hibernate의 지연 로딩(Lazy Loading)이 프록시 패턴의 대표적 예예요. Order.getCustomer()를 호출하기 전까지는 Customer 데이터를 DB에서 가져오지 않고, 실제로 getCustomer()를 호출하는 순간에야 SELECT 쿼리를 실행해요. 스프링 AOP도 @Transactional, @Cacheable 같은 어노테이션을 처리할 때 프록시 객체로 원본을 감싸서 부가 기능을 주입해요.',
      why: '무거운 객체(대용량 이미지·DB 엔티티·네트워크 리소스)의 생성을 꼭 필요한 시점까지 지연시켜서 메모리와 로딩 시간을 절약하려고요.',
      pitfall: '프록시와 본인의 인터페이스가 다르면 대리인 역할을 할 수 없어요. 반드시 같은 인터페이스를 구현하거나 같은 클래스를 상속해야 해요.',
    },
  },
  {
    id: 'dp-facade',
    lang: 'java',
    title: 'Facade - 단순한 출입구',
    file: 'OrderFacade.java',
    code: `import org.springframework.stereotype.Service;

@Service
public class OrderFacade {
  private final InventoryService inventory;
  private final PaymentService   payment;
  private final ShippingService  shipping;

  public OrderFacade(InventoryService i, PaymentService p, ShippingService s) {
    this.inventory = i;
    this.payment   = p;
    this.shipping  = s;
  }

  public void placeOrder(Order order) {
    System.out.println("[실행] 주문 접수 시작");
    inventory.reserve(order);
    System.out.println("[완료] 재고 확보");
    payment.charge(order);
    System.out.println("[완료] 결제 완료");
    shipping.dispatch(order);
    System.out.println("[결과] 주문 처리 완료 — 배송 지시까지 완료");
  }
}`,
    explain: {
      concept:
        '퍼사드(Facade) 패턴은 복잡한 내부를 감추고 단순한 출입구 하나만 제공하는 건물 관리인 같은 패턴이에요. ' +
        '주문 처리 하나를 하려면 재고 확인 → 결제 → 배송 지시라는 3개 서비스와 협력해야 하는데, 클라이언트가 이걸 하나하나 순서대로 호출하는 건 실수의 여지가 많아요. ' +
        'OrderFacade가 placeOrder()라는 단 하나의 메서드로 이 모든 과정을 대신 처리해줘서, 클라이언트는 "주문해줘"라고만 하면 돼요. ' +
        '내부 서비스(Inventory·Payment·Shipping)의 복잡한 상호작용을 퍼사드 뒤에 숨기니까, 내부 로직이 바뀌어도 클라이언트 코드는 전혀 수정하지 않아도 돼요.',
      terms: [
        { t: 'OrderFacade', d: '복잡한 여러 서비스를 하나의 간단한 메서드로 묶어 제공하는 출입구예요. 클라이언트는 이 하나만 알면 돼요.' },
        { t: 'InventoryService', d: '재고 확인과 확보를 담당하는 서비스예요. 상품이 충분한지 확인하고 재고를 차감해요.' },
        { t: 'PaymentService', d: '결제 처리를 담당하는 서비스예요. 실제 결제 게이트웨이 연동은 이 서비스 안에 숨겨져 있어요.' },
        { t: 'ShippingService', d: '배송 지시를 담당하는 서비스예요. 물류 시스템과의 연동을 추상화해요.' },
        { t: 'placeOrder(order)', d: '주문의 전 과정을 한 번에 처리하는 퍼사드 메서드예요. reserve → charge → dispatch 순서를 보장해요.' },
      ],
      expectedOutput:
        'placeOrder(order) 호출 시:\n' +
        '[실행] 주문 접수 시작\n' +
        '[완료] 재고 확보\n' +
        '[완료] 결제 완료\n' +
        '[결과] 주문 처리 완료 — 배송 지시까지 완료',
      realWorldUsage:
        '실제 프로젝트의 컨트롤러가 주문 접수를 처리할 때, OrderFacade.placeOrder() 하나만 호출해요. 컨트롤러는 재고 서비스가 따로 있고 결제 서비스가 따로 있다는 사실을 몰라요. 덕분에 내부 서비스 구조가 마이크로서비스로 분리돼도, 퍼사드만 수정하면 컨트롤러 코드는 그대로 유지할 수 있어요.',
      why: '복잡한 서비스 간 상호작용을 하나의 단순한 인터페이스 뒤로 숨겨서, 클라이언트의 부담을 줄이고 내부 변경의 영향을 최소화하려고요.',
      pitfall: '퍼사드 안에 비즈니스 로직이 직접 들어가면 다시 뚱뚱한 클래스가 되어버려요. 퍼사드는 조율(어떤 서비스를 어떤 순서로 호출할지)만 하고, 실제 로직은 각 서비스에 위임해야 해요.',
    },
  },
  {
    id: 'dp-singleton-enum',
    lang: 'java',
    title: 'Singleton (Enum) - 직렬화·리플렉션 안전',
    file: 'AppConfig.java',
    code: `public enum AppConfig {
  INSTANCE;

  private String dbUrl = "jdbc:postgresql://localhost:5432/app";
  private int    maxPool = 10;

  public String getDbUrl()  {
    System.out.println("[조회] dbUrl: " + dbUrl);
    return dbUrl;
  }

  public int getMaxPool() {
    System.out.println("[조회] maxPool: " + maxPool);
    return maxPool;
  }

  public void setDbUrl(String url) {
    System.out.println("[변경] dbUrl: " + dbUrl + " -> " + url);
    this.dbUrl = url;
  }

  public void setMaxPool(int n) {
    System.out.println("[변경] maxPool: " + maxPool + " -> " + n);
    this.maxPool = n;
  }
}`,
    explain: {
      concept:
        'Enum 싱글톤은 JVM이 enum 값을 딱 하나만 만든다는 보장을 활용한, 가장 안전한 싱글톤 구현 방식이에요. ' +
        'double-checked locking 방식은 직렬화(Serialization) 역직렬화 시 새 인스턴스가 생기거나, 리플렉션(Reflection) 공격으로 private 생성자가 뚫릴 위험이 있어요. ' +
        'Enum은 JVM이 클래스 로딩 시 INSTANCE를 딱 한 번만 생성하고, 자바 언어 명세가 enum의 리플렉션 생성을 금지해서 이런 공격으로부터 완벽히 안전해요. ' +
        'Joshua Bloch가 Effective Java에서 "싱글톤을 만들 가장 좋은 방법"이라고 권장한 접근법이에요.',
      terms: [
        { t: 'enum', d: '열거형 타입이에요. JVM이 각 enum 상수를 딱 하나만 만들도록 보장해줘요.' },
        { t: 'INSTANCE', d: '유일한 싱글톤 인스턴스예요. AppConfig.INSTANCE로 접근해요.' },
        { t: '직렬화 안전', d: '역직렬화해도 새 인스턴스가 생기지 않아요. JVM이 기존 INSTANCE를 반환해요.' },
        { t: '리플렉션 안전', d: 'Constructor.newInstance()로 enum 생성자를 호출하려고 하면 IllegalArgumentException이 발생해요.' },
        { t: 'Effective Java', d: 'Joshua Bloch의 자바 베스트 프랙티스 책이에요. 이 enum 싱글톤 방식을 가장 권장해요.' },
      ],
      expectedOutput:
        'AppConfig.INSTANCE.getDbUrl():\n' +
        '[조회] dbUrl: jdbc:postgresql://localhost:5432/app\n' +
        'AppConfig.INSTANCE.setMaxPool(20):\n' +
        '[변경] maxPool: 10 -> 20',
      realWorldUsage:
        '실제 프로젝트에서 애플리케이션 설정·시스템 상수·전역 레지스트리를 Enum 싱글톤으로 구현해요. 직렬화가 필요한 캐시 데이터나 세션 저장소에서 역직렬화 후에도 싱글톤이 유지돼야 하는 경우, 일반 클래스 싱글톤은 깨질 위험이 있어서 Enum을 선택해요.',
      why: 'double-checked locking의 복잡성 없이, JVM의 언어 명세 보장만으로 스레드 안전 + 직렬화 안전 + 리플렉션 안전을 동시에 얻으려고요.',
      pitfall: 'Enum은 상속이 불가능해요(모든 enum은 암묵적으로 java.lang.Enum을 상속). 다형성이 필요하면 volatile+synchronized 방식의 일반 클래스를 써야 해요.',
    },
  },
  {
    id: 'dp-factory-gof',
    lang: 'java',
    title: 'Factory Method (GoF) - 서브클래스가 결정',
    file: 'DocumentCreator.java',
    code: `public abstract class DocumentCreator {
  public final void newDocument() {
    System.out.println("[실행] 문서 생성 시작");
    Document doc = createDocument();
    doc.open();
    doc.edit();
    doc.save();
    System.out.println("[결과] 문서 생성 완료");
  }
  protected abstract Document createDocument();
}

public interface Document {
  void open();
  void edit();
  void save();
}

public class PdfCreator extends DocumentCreator {
  protected Document createDocument() {
    System.out.println("[팩터리] PDF 문서 생성");
    return new PdfDocument();
  }
}

public class WordCreator extends DocumentCreator {
  protected Document createDocument() {
    System.out.println("[팩터리] Word 문서 생성");
    return new WordDocument();
  }
}

public class PdfDocument implements Document {
  public void open() { System.out.println("[PDF] 열기"); }
  public void edit() { System.out.println("[PDF] 편집"); }
  public void save() { System.out.println("[PDF] 저장"); }
}

public class WordDocument implements Document {
  public void open() { System.out.println("[Word] 열기"); }
  public void edit() { System.out.println("[Word] 편집"); }
  public void save() { System.out.println("[Word] 저장"); }
}`,
    explain: {
      concept:
        'GoF Factory Method는 부모 클래스가 "어떤 객체를 만들지"는 서브클래스에게 결정권을 넘기는 패턴이에요. ' +
        'DocumentCreator는 문서를 열고→편집하고→저장하는 전체 흐름(템플릿 메서드)을 정의하고, createDocument()라는 팩터리 메서드는 abstract로 비워둬서 "어떤 문서를 만들지는 자식이 결정해"라고 해요. ' +
        'PdfCreator는 PdfDocument를, WordCreator는 WordDocument를 생성해서, 같은 newDocument() 메서드라도 서브클래스에 따라 전혀 다른 타입의 문서가 생성돼요. ' +
        'Simple Factory와 달리, 새 문서 타입을 추가하려면 Creator 서브클래스 하나만 새로 만들면 되고, 기존 Creator 코드는 전혀 건드리지 않아도 돼요(OCP).',
      terms: [
        { t: 'createDocument()', d: '추상 팩터리 메서드예요. 서브클래스가 반드시 구현해야 하고, 실제 생성할 객체 타입을 결정해요.' },
        { t: 'DocumentCreator', d: '공통 흐름을 정의하는 추상 Creator 클래스예요. 템플릿 메서드와 팩터리 메서드를 함께 사용해요.' },
        { t: 'PdfCreator / WordCreator', d: '구체적인 제품을 결정하는 ConcreteCreator 서브클래스예요. createDocument()를 구현해요.' },
        { t: 'Document (인터페이스)', d: '생성 대상 제품의 공통 타입이에요. PdfDocument와 WordDocument가 이걸 구현해요.' },
        { t: 'final newDocument()', d: '템플릿 메서드예요. 생성→열기→편집→저장 흐름을 고정하고, 생성만 서브클래스에 위임해요.' },
      ],
      expectedOutput:
        'new PdfCreator().newDocument():\n' +
        '[실행] 문서 생성 시작\n' +
        '[팩터리] PDF 문서 생성\n' +
        '[PDF] 열기 → [PDF] 편집 → [PDF] 저장\n' +
        '[결과] 문서 생성 완료\n\n' +
        'new WordCreator().newDocument():\n' +
        '[실행] 문서 생성 시작\n' +
        '[팩터리] Word 문서 생성\n' +
        '[Word] 열기 → [Word] 편집 → [Word] 저장\n' +
        '[결과] 문서 생성 완료',
      realWorldUsage:
        '실제 프로젝트에서 파일 변환기(PDF 변환·Excel 변환·CSV 변환), 결제 수단(카드·계좌이체·간편결제), 리포트 생성기 등이 GoF Factory Method로 구현돼요. "어떤 포맷으로 변환할지", "어떤 결제 수단으로 처리할지" 같은 결정을 서브클래스에 맡기고, 공통 실행 흐름은 부모 클래스가 관리해요.',
      why: '객체 생성 로직을 상위 클래스에서 분리해서, 새 제품 타입을 추가할 때 기존 코드를 전혀 수정하지 않으려고요(개방-폐쇄 원칙).',
      pitfall: '제품 타입이 하나 추가될 때마다 Creator 서브클래스도 하나씩 추가해야 해서, 타입이 많아지면 클래스 폭발(class explosion)이 생길 수 있어요. 이럴 땐 정적 팩터리나 전략 패턴을 검토하세요.',
    },
  },
  {
    id: 'dp-builder-lombok',
    lang: 'java',
    title: 'Builder (Lombok) - 보일러플레이트 제거',
    file: 'ProductDto.java',
    code: `import lombok.Builder;
import lombok.Value;

@Value
@Builder(toBuilder = true)
public class ProductDto {
  String  name;
  int     price;
  boolean inStock;

  @Builder.Default
  int quantity = 1;
}

class Example {
  public static void main(String[] args) {
    System.out.println("[실행] Lombok Builder 예제");

    ProductDto dto = ProductDto.builder()
        .name("자바 책")
        .price(30000)
        .inStock(true)
        .build();
    System.out.println("[결과] " + dto);

    ProductDto cheaper = dto.toBuilder().price(25000).build();
    System.out.println("[복사] " + cheaper);
  }
}`,
    explain: {
      concept:
        'Lombok @Builder는 빌더 패턴의 모든 반복 코드를 컴파일 타임에 자동 생성해주는 마법 같은 도구예요. ' +
        '수동으로 Builder 클래스를 20줄 이상 작성하는 대신, 필드 선언만 하면 Lombok이 Builder 클래스·builder() 메서드·build() 메서드를 자동으로 만들어줘요. ' +
        '@Value는 모든 필드를 final로 만들고 getter만 생성해서 불변 객체로 만들어요. @Builder와 함께 쓰면 불변 객체 + 빌더의 조합이 단 몇 줄로 완성돼요. ' +
        'toBuilder=true는 기존 객체에서 일부 필드만 바꾼 복사본을 만들 수 있게 해줘요. dto.toBuilder().price(25000).build()는 name과 inStock은 그대로 두고 price만 25000으로 변경한 새 객체를 반환해요.',
      terms: [
        { t: '@Builder', d: 'Lombok이 빌더 클래스와 builder() 정적 메서드를 자동 생성하게 해줘요.' },
        { t: '@Value', d: '모든 필드를 final로, getter만 생성하고 setter는 만들지 않아요. 불변 클래스가 완성돼요.' },
        { t: 'toBuilder = true', d: '기존 객체에서 시작해서 일부 필드만 바꾼 새 객체를 만들 수 있어요. 복사+변경에 유용해요.' },
        { t: '@Builder.Default', d: '빌더에서 이 필드의 기본값을 지정해요. 명시하지 않으면 1로 설정돼요.' },
        { t: '.build()', d: '빌더가 수집한 값들로 최종 ProductDto 객체를 생성해요. Lombok이 자동 생성한 메서드예요.' },
      ],
      expectedOutput:
        'main() 실행:\n' +
        '[실행] Lombok Builder 예제\n' +
        '[결과] ProductDto(name=자바 책, price=30000, inStock=true, quantity=1)\n' +
        '[복사] ProductDto(name=자바 책, price=25000, inStock=true, quantity=1)',
      realWorldUsage:
        '실제 프로젝트에서 Request DTO, Response DTO, Entity, Configuration 클래스 등 필드가 많은 클래스는 거의 모두 Lombok @Builder를 써요. 수백 개의 DTO가 있는 프로젝트에서 빌더를 수동으로 작성하면 엄청난 양의 반복 코드고, 필드 하나 추가할 때마다 빌더 메서드도 추가해야 하는 실수하기 쉬운 작업이 돼요. Lombok이 이 모든 걸 자동화해줘요.',
      why: '빌더 패턴의 보일러플레이트 코드를 제거하고, 필드 선언만으로 완전한 빌더를 갖추려고요.',
      pitfall: 'Lombok은 컴파일 타임 코드 생성기라서, IDE에 Lombok 플러그인이 설치돼 있어야 코드 완성·오류 검사가 정상 동작해요. 플러그인 없으면 IDE가 빌더 메서드를 인식하지 못하고 빨간 줄로 표시할 수 있어요.',
    },
  },
  {
    id: 'dp-strategy-spring',
    lang: 'java',
    title: 'Strategy + Spring - 빈으로 전략 주입',
    file: 'PaymentService.java',
    code: `import org.springframework.stereotype.Component;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

public interface PaymentStrategy {
  String type();
  void pay(long amount);
}

@Component
public class CardPayment implements PaymentStrategy {
  public String type() { return "card"; }
  public void pay(long amount) { System.out.println("[결제] 카드: " + amount + "원"); }
}

@Component
public class KakaoPayment implements PaymentStrategy {
  public String type() { return "kakao"; }
  public void pay(long amount) { System.out.println("[결제] 카카오페이: " + amount + "원"); }
}

@Service
public class PaymentService {
  private final Map<String, PaymentStrategy> strategies;

  public PaymentService(List<PaymentStrategy> list) {
    System.out.println("[실행] 전략 Map 생성 — 전략 수: " + list.size());
    this.strategies = list.stream()
        .collect(Collectors.toMap(PaymentStrategy::type, s -> s));
    strategies.forEach((k, v) ->
        System.out.println("  - " + k + " -> " + v.getClass().getSimpleName()));
  }

  public void pay(String type, long amount) {
    PaymentStrategy strategy = strategies.get(type);
    if (strategy == null) {
      throw new IllegalArgumentException("미지원 결제 수단: " + type);
    }
    strategy.pay(amount);
  }
}`,
    explain: {
      concept:
        '스프링의 DI(의존성 주입)와 전략 패턴을 조합하면, 새 전략을 추가할 때 기존 코드를 전혀 건드리지 않는 개방-폐쇄 원칙(OCP)의 완벽한 예가 만들어져요. ' +
        'PaymentStrategy를 구현한 모든 @Component 빈이 자동으로 List<PaymentStrategy>에 주입되고, 생성자에서 type() 값을 키로 하는 Map이 만들어져요. ' +
        'pay()는 Map에서 type으로 전략을 조회해서 실행만 하면 돼요 — if(type=="card") else if(type=="kakao")... 같은 긴 조건문이 사라져요. ' +
        '새로운 NaverPay 전략을 추가하고 싶다면, NaverPayment 클래스를 만들고 @Component만 붙이면 자동으로 Map에 등록돼요. PaymentService 코드는 완전히 그대로예요.',
      terms: [
        { t: 'List<PaymentStrategy> 주입', d: '스프링이 PaymentStrategy 타입의 모든 빈을 찾아 리스트로 자동 주입해줘요.' },
        { t: 'Collectors.toMap(type, s -> s)', d: 'type() 값을 키로, 전략 객체를 값으로 하는 Map을 생성해요. O(1) 조회가 가능해져요.' },
        { t: '@Component', d: '각 전략 구현체를 스프링 빈으로 등록해요. 등록만 하면 자동으로 주입 리스트에 포함돼요.' },
        { t: 'type()', d: '각 전략이 자신을 식별하는 키를 반환해요. 카드면 "card", 카카오페이면 "kakao"예요.' },
        { t: '개방-폐쇄 원칙(OCP)', d: '기존 코드는 수정하지 않고(폐쇄), 새 전략 추가만으로 기능을 확장(개방)할 수 있어요.' },
      ],
      expectedOutput:
        '앱 시작 시:\n' +
        '[실행] 전략 Map 생성 — 전략 수: 2\n' +
        '  - card -> CardPayment\n' +
        '  - kakao -> KakaoPayment\n' +
        'pay("card", 10000):\n' +
        '[결제] 카드: 10000원\n' +
        'pay("kakao", 5000):\n' +
        '[결제] 카카오페이: 5000원',
      realWorldUsage:
        '실제 프로젝트에서 결제·알림·파일 업로드·인증 방식처럼 다양한 구현체가 필요한 곳에 이 패턴을 써요. PG사가 5개라면 각각 @Component로 등록하고, 클라이언트가 선택한 결제 수단에 따라 Map 조회로 즉시 실행해요. if-else 체인이 5단계로 늘어나는 대신 깔끔한 Map 한 번의 get()으로 끝나요.',
      why: '전략 선택 로직을 Map 조회로 단순화하고, 새 전략 추가 시 기존 코드를 전혀 수정하지 않는 OCP를 달성하려고요.',
      pitfall: '두 전략이 같은 type() 값을 반환하면 Collectors.toMap이 IllegalStateException을 던져요. type() 값은 전략마다 고유해야 해요. 중복 검사를 미리 하는 게 좋아요.',
    },
  },
  {
    id: 'dp-observer-spring',
    lang: 'java',
    title: 'Observer - Spring 이벤트',
    file: 'OrderEventPublisher.java',
    code: `import org.springframework.context.ApplicationEventPublisher;
import org.springframework.context.event.EventListener;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Component;
import org.springframework.stereotype.Service;

public record OrderPlacedEvent(Long orderId, String email) {}

@Service
public class OrderService {
  private final ApplicationEventPublisher eventPublisher;

  public OrderService(ApplicationEventPublisher ep) { this.eventPublisher = ep; }

  public void place(Long orderId, String email) {
    System.out.println("[실행] 주문 생성 — orderId: " + orderId);
    eventPublisher.publishEvent(new OrderPlacedEvent(orderId, email));
    System.out.println("[결과] 이벤트 발행 완료");
  }
}

@Component
public class EmailNotifier {
  @EventListener
  public void onOrderPlaced(OrderPlacedEvent e) {
    System.out.println("[이메일] 발송 -> " + e.email());
  }
}

@Component
public class PointAccumulator {
  @Async
  @EventListener
  public void onOrderPlaced(OrderPlacedEvent e) {
    System.out.println("[포인트] 적립 -> 주문 " + e.orderId());
  }
}`,
    explain: {
      concept:
        '스프링의 ApplicationEvent는 옵저버 패턴을 스프링 생태계에 완벽하게 통합한 구현이에요. ' +
        'OrderService는 ApplicationEventPublisher를 통해 OrderPlacedEvent라는 불변 이벤트 객체를 발행하고, EmailNotifier와 PointAccumulator는 @EventListener로 해당 이벤트를 자동으로 구독해요. ' +
        '발행자(OrderService)는 구독자가 누구인지 전혀 몰라요 — 이메일을 보내는지, 포인트를 적립하는지, 통계를 업데이트하는지 발행자 코드에는 단 한 줄의 흔적도 없어요. ' +
        '@Async가 붙은 PointAccumulator는 별도 스레드에서 비동기로 실행돼서, 주문 생성의 응답 시간에 영향을 전혀 주지 않아요.',
      terms: [
        { t: 'ApplicationEventPublisher', d: '스프링이 제공하는 이벤트 발행기예요. publishEvent()로 이벤트를 모든 구독자에게 전파해요.' },
        { t: 'publishEvent()', d: '이벤트 객체를 발행해요. 스프링이 자동으로 호출 시점·구독자 탐색·호출을 관리해줘요.' },
        { t: '@EventListener', d: '이 메서드가 특정 이벤트의 구독자임을 표시해요. 파라미터 타입과 일치하는 이벤트에 자동 반응해요.' },
        { t: '@Async', d: '이벤트 처리를 별도 스레드에서 비동기로 실행해요. 주문 처리를 지연시키지 않고 포인트 적립을 병렬 처리해요.' },
        { t: 'record OrderPlacedEvent', d: 'Java record로 불변 이벤트 객체를 정의해요. 이벤트 데이터는 절대 수정되지 않아요.' },
      ],
      expectedOutput:
        'place(1L, "kim@test.com") 호출 시:\n' +
        '[실행] 주문 생성 — orderId: 1\n' +
        '[결과] 이벤트 발행 완료\n' +
        '[이메일] 발송 -> kim@test.com\n' +
        '[포인트] 적립 -> 주문 1 (비동기, 다른 스레드에서 실행)',
      realWorldUsage:
        '실제 프로젝트에서 "주문 완료 시 이메일 발송 + 포인트 적립 + 통계 업데이트 + 검색 인덱스 갱신" 같은 1:N 후속 처리를 이 패턴으로 구현해요. 발행자(OrderService)는 @EventListener만 기다리고 있는 수신자들에게 단순히 신호를 보내기만 하고, 각 수신자는 자기 책임만 처리해요. 새 후속 작업이 추가돼도 OrderService 코드는 변하지 않으니 배포 위험이 크게 줄어요.',
      why: '비즈니스 이벤트를 발행-구독으로 분리해서, 핵심 로직과 부수 효과의 결합도를 낮추고 새 구독자를 자유롭게 추가하려고요.',
      pitfall: '@Async를 쓸 때는 @EnableAsync 어노테이션으로 비동기 기능을 활성화해야 해요. 활성화하지 않으면 @Async가 무시되고 동일 스레드에서 동기적으로 실행돼요.',
    },
  },
  {
    id: 'dp-template-jdbc',
    lang: 'java',
    title: 'Template Method - JdbcTemplate',
    file: 'UserDao.java',
    code: `import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public class UserDao {
  private final JdbcTemplate jdbc;

  public UserDao(JdbcTemplate jdbc) { this.jdbc = jdbc; }

  public List<String> findAllNames() {
    System.out.println("[실행] 모든 사용자 이름 조회");
    List<String> names = jdbc.query(
        "SELECT name FROM users ORDER BY name",
        (rs, rowNum) -> rs.getString("name")
    );
    System.out.println("[결과] 조회된 이름 수: " + names.size());
    return names;
  }

  public int countByActive(boolean active) {
    System.out.println("[실행] 활성 사용자 수 조회 — active: " + active);
    int count = jdbc.queryForObject(
        "SELECT COUNT(*) FROM users WHERE active = ?",
        Integer.class,
        active
    );
    System.out.println("[결과] 활성 사용자 수: " + count);
    return count;
  }

  public void save(String name, String email) {
    System.out.println("[실행] 사용자 저장 — name: " + name);
    jdbc.update("INSERT INTO users (name, email) VALUES (?, ?)", name, email);
    System.out.println("[결과] 저장 완료");
  }
}`,
    explain: {
      concept:
        'JdbcTemplate은 템플릿 메서드 패턴의 실전 사례로, 스프링에서 가장 성공적인 패턴 적용 중 하나예요. ' +
        '"커넥션 열기 → PreparedStatement 생성 → SQL 실행 → ResultSet 순회 → 자원 닫기 + 예외 변환"이라는 복잡한 뼈대는 JdbcTemplate이 알아서 처리하고, 우리는 SQL 문자열과 결과 매핑 로직만 딱 채워 넣으면 돼요. ' +
        'query()에 전달된 람다 (rs, rowNum) -> rs.getString("name")는 RowMapper라고 부르는 콜백이에요 — JdbcTemplate이 ResultSet의 각 행에 이 람다를 호출해서 결과 리스트를 만들어줘요. ' +
        'JDBC에서 직접 Connection·PreparedStatement·ResultSet을 try-catch-finally로 관리하던 지저분한 코드가 모두 사라지는 이유가 바로 템플릿 메서드 패턴 덕분이에요.',
      terms: [
        { t: 'JdbcTemplate', d: 'JDBC의 반복 작업을 추상화한 스프링 클래스예요. 커넥션·예외·자원 관리를 모두 처리해줘요.' },
        { t: 'query(sql, RowMapper)', d: 'SELECT 결과를 리스트로 반환해요. RowMapper 람다가 각 행을 원하는 타입으로 변환해요.' },
        { t: 'RowMapper (람다)', d: 'ResultSet 한 행을 읽어 객체로 변환하는 콜백이에요. (rs, rowNum) -> ... 형태로 간결하게 표현해요.' },
        { t: 'queryForObject()', d: '단일 값(COUNT, MAX, 단일 컬럼) 조회에 써요. 빈 결과면 EmptyResultDataAccessException을 던져요.' },
        { t: 'update()', d: 'INSERT·UPDATE·DELETE 실행에 써요. 영향받은 행 수를 반환해요.' },
      ],
      expectedOutput:
        'findAllNames() 호출 시:\n' +
        '[실행] 모든 사용자 이름 조회\n' +
        '[결과] 조회된 이름 수: 3\n' +
        'countByActive(true) 호출 시:\n' +
        '[실행] 활성 사용자 수 조회 — active: true\n' +
        '[결과] 활성 사용자 수: 150',
      realWorldUsage:
        '실제 프로젝트에서 JPA만으로는 처리하기 어려운 복잡한 네이티브 SQL이나 대량 배치 쿼리에 JdbcTemplate을 써요. JPA가 자동 생성하는 쿼리보다 수동으로 튜닝한 SQL이 훨씬 빠를 때, 템플릿 메서드 덕분에 복잡한 JDBC 코드 없이 몇 줄로 최적화 쿼리를 실행할 수 있어요.',
      why: 'JDBC의 반복되는 try-catch-finally 자원 관리·예외 변환 코드를 제거하고, SQL과 결과 매핑이라는 핵심 로직에만 집중하려고요.',
      pitfall: 'queryForObject()는 결과가 0건이면 EmptyResultDataAccessException을 던져요. 결과가 있을 수도 없을 수도 있으면 query()로 List를 받아 isEmpty() 체크하는 게 더 안전해요.',
    },
  },
  {
    id: 'dp-proxy-aop',
    lang: 'java',
    title: 'Proxy - Spring AOP 캐시',
    file: 'ProductQueryService.java',
    code: `import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.CachePut;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;

@Service
public class ProductQueryService {

  @Cacheable(value = "products", key = "#id")
  public ProductDto findById(Long id) {
    System.out.println("[실행] DB 조회 — productId: " + id);
    return new ProductDto("상품" + id, 10000, true, 1);
  }

  @CacheEvict(value = "products", key = "#id")
  public void evict(Long id) {
    System.out.println("[실행] 캐시 제거 — productId: " + id);
  }

  @CachePut(value = "products", key = "#dto.name")
  public ProductDto update(ProductDto dto) {
    System.out.println("[실행] 캐시 갱신 — " + dto);
    return dto;
  }
}

record ProductDto(String name, int price, boolean inStock, int quantity) {}`,
    explain: {
      concept:
        '스프링 AOP는 프록시 패턴을 내부 동작 원리로 사용해서, @Cacheable 같은 선언적 기능을 코드에 끼워 넣어줘요. ' +
        'ProductQueryService에 @Cacheable이 붙으면, 스프링이 이 클래스를 감싸는 프록시 객체를 자동 생성해요. ' +
        'findById(1L)이 처음 호출되면 프록시가 "아직 캐시에 없네"라고 판단하고 실제 메서드를 호출해 DB를 조회하지만, 두 번째 동일한 id 호출부턴 "어, 이 결과 이미 캐시에 있네"라며 실제 메서드를 건너뛰고 캐시 값을 바로 반환해요. ' +
        '@CacheEvict는 캐시에서 데이터를 제거하고, @CachePut은 항상 메서드를 실행한 뒤 그 결과로 캐시를 갱신해요.',
      terms: [
        { t: '@Cacheable', d: '프록시가 메서드 결과를 캐시에 저장하고, 같은 key 호출 시 메서드를 건너뛰고 캐시 값을 반환해요.' },
        { t: '@CacheEvict', d: '프록시가 메서드 실행 후 캐시에서 해당 key의 데이터를 제거해요. 데이터 변경 시 불일치를 방지해요.' },
        { t: '@CachePut', d: '프록시가 항상 메서드를 실행하고 그 결과로 캐시를 덮어써요. 데이터 갱신과 캐시 반영을 동시에 해요.' },
        { t: 'key = "#id" (SpEL)', d: '스프링 표현 언어로 캐시 키를 지정해요. #id는 메서드 파라미터 id를 참조해요.' },
        { t: 'AOP 프록시', d: '스프링이 런타임에 생성하는 래퍼 객체예요. 원본 객체 대신 프록시가 호출을 가로채서 부가 기능을 실행해요.' },
      ],
      expectedOutput:
        'findById(1L) 첫 호출:\n' +
        '[실행] DB 조회 — productId: 1\n' +
        'findById(1L) 두 번째 호출:\n' +
        '(콘솔 출력 없음 — 프록시가 캐시 반환)\n' +
        'evict(1L) 호출:\n' +
        '[실행] 캐시 제거 — productId: 1',
      realWorldUsage:
        '실제 프로젝트에서 @Transactional·@Cacheable·@Secured 같은 선언적 기능이 모두 스프링 AOP 프록시로 구현돼요. ProductService에 @Transactional을 붙이면, 스프링이 프록시를 만들고 메서드 호출 전후로 트랜잭션을 시작·커밋·롤백해줘요. 비즈니스 코드에는 트랜잭션 관리 코드가 한 줄도 없어도 되는 이유가 바로 프록시 덕분이에요.',
      why: '반복적인 DB 조회를 프록시 기반 캐시로 줄여 응답 속도를 높이고, 비즈니스 코드에서 캐시 관리 코드를 완전히 분리하려고요.',
      pitfall: '같은 클래스 안에서 @Cacheable이 붙은 메서드를 self 호출(this.findById())하면 프록시를 거치지 않아요. 캐시가 완전히 무시되고 매번 DB를 조회하는 함정에 빠질 수 있어요.',
    },
  },
  {
    id: 'dp-decorator-filter',
    lang: 'java',
    title: 'Decorator - 서블릿 필터 체인',
    file: 'LoggingFilter.java',
    code: `import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.core.annotation.Order;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

@Component
@Order(1)
public class LoggingFilter extends OncePerRequestFilter {

  @Override
  protected void doFilterInternal(
      HttpServletRequest  request,
      HttpServletResponse response,
      FilterChain         chain
  ) throws ServletException, IOException {

    long start = System.currentTimeMillis();
    System.out.println("[필터] 요청 시작 — " + request.getMethod() + " " + request.getRequestURI());
    try {
      chain.doFilter(request, response);
    } finally {
      long elapsed = System.currentTimeMillis() - start;
      System.out.printf("[필터] 요청 완료 — %s %s %dms%n",
          request.getMethod(), request.getRequestURI(), elapsed);
    }
  }
}`,
    explain: {
      concept:
        '서블릿 필터 체인은 데코레이터 패턴을 HTTP 요청-응답 처리에 적용한 실전 예예요. ' +
        '각 필터가 데코레이터 역할을 해서, 요청-응답 흐름에 로깅·인증·인코딩·압축 같은 횡단 관심사(cross-cutting concern)를 켜켜이 덧입혀요. ' +
        'chain.doFilter()는 "내 일은 끝났으니 다음 데코레이터(또는 실제 서블릿)에게 넘길게"라는 신호예요. ' +
        '@Order(1)로 실행 순서를 정하고, finally 블록으로 예외 발생 여부와 관계없이 응답 시간을 로깅해요. OncePerRequestFilter는 한 요청이 여러 필터 체인을 거쳐도 딱 한 번만 실행되게 보장해줘요.',
      terms: [
        { t: 'OncePerRequestFilter', d: '요청당 정확히 한 번만 실행되는 스프링 필터 기반 클래스예요. 중복 실행을 방지해줘요.' },
        { t: 'FilterChain', d: '다음 필터(또는 최종 서블릿)로 요청-응답을 전달하는 체인 객체예요. 체인의 연결 고리 역할이에요.' },
        { t: 'chain.doFilter(request, response)', d: '다음 단계로 제어를 넘겨요. 모든 필터가 이걸 호출해야 요청이 서블릿까지 도달해요.' },
        { t: '@Order(1)', d: '필터 실행 순서를 지정해요. 1이 가장 먼저 실행되고, 숫자가 클수록 나중에 실행돼요.' },
        { t: 'finally 블록', d: '예외 발생 여부와 관계없이 로깅을 실행해요. 응답 시간은 정상·에러 관계없이 기록해야 의미가 있어요.' },
      ],
      expectedOutput:
        'GET /api/users 요청 시:\n' +
        '[필터] 요청 시작 — GET /api/users\n' +
        '[필터] 요청 완료 — GET /api/users 42ms',
      realWorldUsage:
        '실제 프로젝트에서 모든 HTTP 요청-응답을 로깅·인증·CORS·CSRF·XSS 방어·요청 압축 해제·응답 압축·트레이싱 ID 주입까지, 필터 체인에 여러 데코레이터를 연결해서 처리해요. 비즈니스 로직(컨트롤러·서비스)에는 이런 횡단 관심사가 단 한 줄도 없어서 깔끔하게 유지되고, 필터 순서만 조정하면 기능을 자유롭게 조합할 수 있어요.',
      why: '비즈니스 로직을 전혀 건드리지 않고 HTTP 요청-응답 흐름에 로깅·보안·압축 같은 공통 기능을 투명하게 덧붙이려고요.',
      pitfall: '@Component로 등록한 필터는 스프링 시큐리티 필터 체인이 아니라 서블릿 필터 체인에 추가돼서 스프링 시큐리티 인증 전에 실행될 수 있어요. 시큐리티 체인 뒤에 실행하려면 addFilterBefore/After로 순서를 명시하세요.',
    },
  },
  {
    id: 'dp-facade-transactional',
    lang: 'java',
    title: 'Facade - 트랜잭션 퍼사드',
    file: 'CheckoutFacade.java',
    code: `import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional
public class CheckoutFacade {
  private final CartService    cart;
  private final CouponService  coupon;
  private final OrderService   order;
  private final PointService   point;

  public CheckoutFacade(CartService c, CouponService co, OrderService o, PointService p) {
    this.cart   = c;
    this.coupon = co;
    this.order  = o;
    this.point  = p;
  }

  public Long checkout(Long userId, String couponCode) {
    System.out.println("[실행] 체크아웃 시작 — userId: " + userId);
    List<CartItem> items    = cart.getItems(userId);
    long           discount = coupon.apply(couponCode, userId);
    Long           orderId  = order.create(userId, items, discount);
    point.earn(userId, orderId);
    cart.clear(userId);
    System.out.println("[결과] 체크아웃 완료 — orderId: " + orderId);
    return orderId;
  }
}`,
    explain: {
      concept:
        '트랜잭션 퍼사드는 퍼사드 패턴과 @Transactional을 조합해서, 여러 서비스에 걸친 복잡한 작업을 하나의 원자적 단위로 묶는 고급 패턴이에요. ' +
        '체크아웃은 (1)장바구니 조회 → (2)쿠폰 적용 → (3)주문 생성 → (4)포인트 적립 → (5)장바구니 비우기라는 5개 서비스의 협력이 필요한데, 이 중 하나라도 실패하면 전체가 롤백돼야 데이터 정합성이 보장돼요. ' +
        'CheckoutFacade에 @Transactional을 선언하면, checkout() 메서드의 모든 DB 작업이 하나의 트랜잭션으로 묶여서 "전부 성공 또는 전부 실패"가 자동 보장돼요. ' +
        '클라이언트(컨트롤러)는 그냥 facade.checkout()만 호출하면 되고, 내부의 복잡한 5단계 흐름은 퍼사드 뒤에 완전히 숨겨져 있어요.',
      terms: [
        { t: 'CheckoutFacade', d: '여러 서비스를 조율하는 트랜잭션 퍼사드예요. 클라이언트는 이 하나의 진입점만 알면 돼요.' },
        { t: '@Transactional (클래스 레벨)', d: '클래스의 모든 public 메서드에 트랜잭션을 적용해요. 하나라도 실패하면 전부 롤백이에요.' },
        { t: 'cart.getItems(userId)', d: '장바구니에서 사용자의 상품 목록을 조회해요. 이 시점부터 트랜잭션이 시작돼요.' },
        { t: 'order.create(...)', d: '실제 주문을 생성하고 DB에 저장해요. 트랜잭션 안에서 실행돼서 실패 시 롤백돼요.' },
        { t: 'point.earn(userId, orderId)', d: '포인트를 적립해요. 주문 생성이 실패하면 이 단계는 아예 실행되지 않아요.' },
      ],
      expectedOutput:
        'checkout(1L, "WELCOME10") 호출 시:\n' +
        '[실행] 체크아웃 시작 — userId: 1\n' +
        '[결과] 체크아웃 완료 — orderId: 123\n\n' +
        '중간에 예외 발생 시:\n' +
        '(트랜잭션 전체 롤백 — 장바구니·주문·포인트 모두 원상복구)',
      realWorldUsage:
        '실제 전자상거래 프로젝트에서 체크아웃·주문 취소·반품 처리·정산처럼 여러 서비스가 협력하는 작업은 모두 트랜잭션 퍼사드로 구현해요. PG사 결제는 성공했는데 주문 저장이 실패하는 최악의 시나리오를 트랜잭션 하나로 방지해요. 장바구니 비우기와 포인트 적립 같은 부수 작업도 트랜잭션에 포함시켜서, 부분 실패로 인한 데이터 불일치가 절대 발생하지 않게 해요.',
      why: '여러 서비스에 걸친 복잡한 비즈니스 흐름을 하나의 원자적 트랜잭션으로 묶어서, 데이터 정합성을 완벽하게 보장하려고요.',
      pitfall: '@Transactional의 기본 설정은 RuntimeException과 Error만 롤백해요. Checked Exception(IOException, SQLException 등)이 발생해도 커밋돼요. checked 예외도 롤백하려면 @Transactional(rollbackFor = Exception.class)을 명시적으로 지정하세요.',
    },
  },
];
