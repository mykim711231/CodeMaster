import type { Snippet } from '../../types';

export const designPattern: Snippet[] = [
  // ── 1. Singleton ──────────────────────────────────────────────────────────
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
          instance = new ConfigManager();
        }
      }
    }
    return instance;
  }
}`,
    explain: {
      concept: '싱글톤은 나라에 대통령이 한 명뿐인 것처럼, 인스턴스를 딱 하나만 만드는 패턴이에요. 어디서 요청해도 같은 객체를 돌려줘요.',
      terms: [
        { t: 'private 생성자', d: '외부에서 new 못 하게 막음' },
        { t: 'volatile', d: '여러 스레드에 보이는 가시성 보장' },
        { t: 'synchronized', d: '한 스레드만 들어가게 잠금' },
        { t: 'double-checked locking', d: '두 번 확인해서 성능과 안전 둘 다' },
        { t: 'getInstance()', d: '유일한 인스턴스를 반환' },
      ],
      why: '설정처럼 하나만 있으면 되는 객체를 공유하려고요.',
      pitfall: '스프링 빈은 기본이 싱글톤이라 직접 만들 필요 없어요.',
    },
  },

  // ── 2. Simple Factory (정적 팩터리) ──────────────────────────────────────
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
    System.out.println("이메일: " + to + " - " + msg);
  }
}

public class SmsSender implements NotificationSender {
  public void send(String to, String msg) {
    System.out.println("SMS: " + to + " - " + msg);
  }
}

public class NotificationFactory {
  public static NotificationSender of(String type) {
    return switch (type) {
      case "email" -> new EmailSender();
      case "sms"   -> new SmsSender();
      default -> throw new IllegalArgumentException("알 수 없는 타입: " + type);
    };
  }
}`,
    explain: {
      concept: '정적 팩터리(Simple Factory)는 주문서만 내면 공장이 알맞은 제품을 만들어주는 것 같아요. 호출자는 어떤 클래스가 만들어지는지 몰라도 돼요. GoF의 Factory Method 패턴(서브클래스가 생성 메서드를 오버라이드)과는 다른, 가장 단순한 생성 분리 방법이에요.',
      terms: [
        { t: 'NotificationSender', d: '공통 인터페이스' },
        { t: 'EmailSender / SmsSender', d: '이메일·SMS 두 가지 구현체' },
        { t: 'of(type)', d: '타입에 맞는 객체를 만드는 정적 메서드' },
        { t: 'switch 표현식', d: 'Java 14+ 표현식 switch로 분기' },
        { t: '->', d: '표현식 switch의 화살표' },
      ],
      why: '생성 코드를 한 곳에 모아 새 타입 추가를 쉽게 하려고요.',
      pitfall: '새 타입이 늘 때마다 팩터리 코드도 고쳐야 해요. 확장이 잦으면 GoF Factory Method 또는 추상 팩터리를 고려하세요.',
    },
  },

  // ── 3. Abstract Factory ───────────────────────────────────────────────────
  {
    id: 'dp-abstract-factory',
    lang: 'java',
    title: 'Abstract Factory - 관련 객체 군',
    file: 'UiFactory.java',
    code: `// 추상 제품
public interface Button    { void render(); }
public interface TextField { void focus();  }

// 밝은 테마 구현체
public class LightButton    implements Button    { public void render() { System.out.println("밝은 버튼"); } }
public class LightTextField implements TextField { public void focus()  { System.out.println("밝은 입력창"); } }

// 어두운 테마 구현체
public class DarkButton    implements Button    { public void render() { System.out.println("어두운 버튼"); } }
public class DarkTextField implements TextField { public void focus()  { System.out.println("어두운 입력창"); } }

// 추상 팩터리
public interface UiFactory {
  Button    createButton();
  TextField createTextField();
}

public class LightUiFactory implements UiFactory {
  public Button    createButton()    { return new LightButton(); }
  public TextField createTextField() { return new LightTextField(); }
}

public class DarkUiFactory implements UiFactory {
  public Button    createButton()    { return new DarkButton(); }
  public TextField createTextField() { return new DarkTextField(); }
}`,
    explain: {
      concept: '추상 팩터리는 가구 세트를 통째로 바꾸는 것 같아요. "밝은 테마 세트" 또는 "어두운 테마 세트"처럼 관련 객체들을 한 번에 만들어요.',
      terms: [
        { t: 'UiFactory', d: '관련 객체를 만드는 추상 팩터리 인터페이스' },
        { t: 'LightUiFactory / DarkUiFactory', d: '밝은·어두운 테마 공장' },
        { t: 'Button / TextField', d: '추상 제품 인터페이스' },
        { t: 'createButton()', d: '버튼 생성 메서드' },
        { t: '제품 구현체', d: 'LightButton, DarkButton 등 실제 클래스' },
      ],
      why: '관련된 객체들이 서로 어울리게 만들어지게 하려고요.',
      pitfall: '새 종류의 제품(예: Checkbox)이 추가되면 모든 공장을 고쳐야 해요.',
    },
  },

  // ── 4. Builder ───────────────────────────────────────────────────────────
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

  public static Builder builder() { return new Builder(); }

  public static class Builder {
    private String name;
    private String email;
    private int    age;

    public Builder name(String n)  { this.name  = n; return this; }
    public Builder email(String e) { this.email = e; return this; }
    public Builder age(int a)      { this.age   = a; return this; }
    public User build() {
      if (name == null || name.isBlank()) throw new IllegalStateException("name 필수");
      return new User(this);
    }
  }
}`,
    explain: {
      concept: '빌더는 햄버거 세트를 하나씩 골라 조립하듯 객체를 만드는 패턴이에요. 필수값과 선택값이 섞일 때 가독성이 좋아요.',
      terms: [
        { t: 'Builder', d: '조립을 담당하는 내부 클래스' },
        { t: 'name(n)', d: '필드를 설정하고 자기 자신을 반환' },
        { t: 'return this', d: '메서드 체이닝을 위한 자기 참조' },
        { t: 'build()', d: '최종 객체 생성(필수값 검증 포함)' },
        { t: 'private User(Builder)', d: '빌더로만 생성 가능' },
      ],
      why: '매개변수가 많을 때 순서와 의미를 헷갈리지 않게 하려고요.',
      pitfall: 'Lombok @Builder를 쓰면 보일러플레이트를 줄일 수 있어요.',
    },
  },

  // ── 5. Strategy ──────────────────────────────────────────────────────────
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
    return price - (price * percent / 100);
  }
}

public class FixedDiscount implements DiscountStrategy {
  private final long amount;
  public FixedDiscount(long amount) { this.amount = amount; }
  public long apply(long price) {
    return Math.max(0, price - amount);
  }
}

// 사용 예
public class OrderService {
  private DiscountStrategy strategy;
  public void setStrategy(DiscountStrategy s) { this.strategy = s; }
  public long calculatePrice(long original) { return strategy.apply(original); }
}`,
    explain: {
      concept: '전략 패턴은 렌터카에서 차를 갈아타듯 할인 방식을 바꿀 수 있어요. 같은 인터페이스로 여러 알고리즘을 자유롭게 교체해요.',
      terms: [
        { t: 'DiscountStrategy', d: '할인 알고리즘 공통 인터페이스' },
        { t: 'PercentDiscount', d: '퍼센트 할인 전략' },
        { t: 'FixedDiscount', d: '정액 할인 전략' },
        { t: 'apply(long)', d: '원래 가격을 받아 할인 후 가격 반환' },
        { t: 'setStrategy()', d: '실행 중에 전략을 교체하는 메서드' },
      ],
      why: '알고리즘을 실행 코드에서 분리해 실행 중에도 교체 가능하게 하려고요.',
      pitfall: '전략이 너무 많아지면 선택 로직이 복잡해져요.',
    },
  },

  // ── 6. Observer ──────────────────────────────────────────────────────────
  {
    id: 'dp-observer',
    lang: 'java',
    title: 'Observer - 이벤트 구독',
    file: 'NewsPublisher.java',
    code: `public interface Subscriber {
  void update(String article);
}

public class NewsPublisher {
  private final List<Subscriber> subscribers = new ArrayList<>();

  public void subscribe(Subscriber s)   { subscribers.add(s); }
  public void unsubscribe(Subscriber s) { subscribers.remove(s); }

  public void publish(String article) {
    for (Subscriber s : subscribers) {
      s.update(article);
    }
  }
}`,
    explain: {
      concept: '옵저버는 신문 구독 같아요. 구독자가 출판사에 등록해 두면, 새 기사가 나올 때마다 자동으로 받아요. 출판사는 누가 구독 중인지 세부 내용은 몰라도 돼요.',
      terms: [
        { t: 'Subscriber', d: '구독자 인터페이스' },
        { t: 'NewsPublisher', d: '출판사(주체)' },
        { t: 'subscribe()', d: '구독 등록' },
        { t: 'publish()', d: '기사를 모두에게 알림' },
        { t: 'update()', d: '구독자가 받는 알림' },
      ],
      why: '주체와 구독자를 느슨하게 연결해 변화를 자동 전파하려고요.',
      pitfall: '구독 해제를 안 하면 메모리 누수가 생길 수 있어요.',
    },
  },

  // ── 7. Template Method ───────────────────────────────────────────────────
  {
    id: 'dp-template-method',
    lang: 'java',
    title: 'Template Method - 뼈대 고정',
    file: 'AbstractReport.java',
    code: `public abstract class AbstractReport {
  public final void generate() {
    prepare();
    collect();
    format();
    deliver();
  }

  protected void prepare() { System.out.println("준비"); }
  protected abstract void collect();
  protected abstract void format();
  protected void deliver() { System.out.println("이메일 전송"); }
}

public class SalesReport extends AbstractReport {
  protected void collect() { System.out.println("매출 수집"); }
  protected void format()  { System.out.println("표 형식"); }
}`,
    explain: {
      concept: '템플릿 메서드는 요리 레시피의 뼈대를 정해두고, 일부 단계만 자식이 바꾸는 패턴이에요. 흐름은 고정되고 디테일만 달라져요.',
      terms: [
        { t: 'abstract class', d: '뼈대를 가진 추상 클래스' },
        { t: 'final generate()', d: '순서가 고정된 템플릿 메서드' },
        { t: 'abstract void collect()', d: '자식이 반드시 구현해야 할 단계' },
        { t: 'protected', d: '자식만 접근 가능' },
        { t: 'SalesReport', d: '구체적인 보고서 구현' },
      ],
      why: '공통 흐름을 한 곳에 두고 세부 단계만 다르게 하려고요.',
      pitfall: 'final을 안 붙이면 자식이 순서를 바꿀 수 있어요.',
    },
  },

  // ── 8. Decorator ─────────────────────────────────────────────────────────
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
      concept: '데코레이터는 옷을 겹쳐 입듯 기능을 덧입히는 패턴이에요. 원본 객체를 감싸면서 새 능력을 추가하고, 필요 없으면 벗겨요.',
      terms: [
        { t: 'Coffee', d: '공통 인터페이스(구성 요소)' },
        { t: 'BasicCoffee', d: '꾸미기 전 기본 객체' },
        { t: 'MilkDecorator / SugarDecorator', d: '기능을 덧입히는 장식 클래스' },
        { t: 'inner', d: '감싸고 있는 원본 객체' },
        { t: 'cost()', d: '가격에 추가 요금 더함' },
      ],
      why: '상속 없이 유연하게 기능을 조합하려고요.',
      pitfall: '데코레이터가 많이 겹치면 디버깅이 어려워요.',
    },
  },

  // ── 9. Adapter ───────────────────────────────────────────────────────────
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
    System.out.println(s);
  }
}

public class LegacyPrinterAdapter implements Printer {
  private final LegacyPrinter legacy;

  public LegacyPrinterAdapter(LegacyPrinter l) {
    this.legacy = l;
  }

  public void print(String text) {
    legacy.writeLine(text);
  }
}`,
    explain: {
      concept: '어댑터는 해외 여행용 플러그 변환기 같아요. 모양이 안 맞는 두 인터페이스 사이에서 호환을 맞춰줘요.',
      terms: [
        { t: 'Printer', d: '우리 시스템이 기대하는 인터페이스' },
        { t: 'LegacyPrinter', d: '기존 호환 안 맞는 클래스' },
        { t: 'LegacyPrinterAdapter', d: '사이에서 맞춰주는 어댑터' },
        { t: 'writeLine()', d: '레거시 메서드' },
        { t: 'implements Printer', d: '기대 인터페이스 구현' },
      ],
      why: '기존 코드를 수정하지 않고 재사용하려고요.',
      pitfall: '어댑터가 너무 많아지면 시스템 구조가 복잡해져요.',
    },
  },

  // ── 10. Proxy ────────────────────────────────────────────────────────────
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
  private void loadFromDisk() { System.out.println("디스크 로드: " + path); }
  public void display()       { System.out.println("표시: " + path); }
}

public class LazyImageProxy implements Image {
  private RealImage real;
  private final String path;
  public LazyImageProxy(String p) { this.path = p; }
  public void display() {
    if (real == null) real = new RealImage(path);
    real.display();
  }
}`,
    explain: {
      concept: '프록시는 대리인이에요. 본인이 바쁘면 대리인이 먼저 요청을 받고, 필요할 때 본인에게 일을 넘겨요. 지연 로딩·접근 제어에 써요.',
      terms: [
        { t: 'Image', d: '공통 인터페이스' },
        { t: 'RealImage', d: '실제 무거운 객체' },
        { t: 'LazyImageProxy', d: '지연 로딩용 대리인' },
        { t: 'display()', d: '표시 요청' },
        { t: 'real == null', d: '처음 호출 때만 실제 객체 생성' },
      ],
      why: '무거운 객체를 꼭 필요할 때만 만들어 자원을 아끼려고요.',
      pitfall: '프록시와 본인 인터페이스가 다르면 대리 역할이 안 돼요.',
    },
  },

  // ── 11. Facade ───────────────────────────────────────────────────────────
  {
    id: 'dp-facade',
    lang: 'java',
    title: 'Facade - 단순한 출입구',
    file: 'OrderFacade.java',
    code: `@Service
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
    inventory.reserve(order);
    payment.charge(order);
    shipping.dispatch(order);
  }
}`,
    explain: {
      concept: '퍼사드는 은행 창구 한 명이 모든 업무를 받아주는 것 같아요. 복잡한 여러 서비스를 한 곳에서 단순하게 호출해요.',
      terms: [
        { t: 'OrderFacade', d: '단순한 출입구 역할' },
        { t: 'InventoryService', d: '재고 서비스' },
        { t: 'PaymentService', d: '결제 서비스' },
        { t: 'ShippingService', d: '배송 서비스' },
        { t: 'placeOrder()', d: '하나의 메서드로 모든 절차를 수행' },
      ],
      why: '복잡한 내부 흐름을 숨기고 단순한 인터페이스를 주려고요.',
      pitfall: '퍼사드에 비즈니스 로직을 넣으면 다시 뚱뚱해져요.',
    },
  },

  // ── 12. Singleton with Enum (대안 구현) ──────────────────────────────────
  {
    id: 'dp-singleton-enum',
    lang: 'java',
    title: 'Singleton (Enum) - 직렬화·리플렉션 안전',
    file: 'AppConfig.java',
    code: `public enum AppConfig {
  INSTANCE;

  private String dbUrl = "jdbc:postgresql://localhost:5432/app";
  private int    maxPool = 10;

  public String getDbUrl()  { return dbUrl; }
  public int    getMaxPool(){ return maxPool; }

  public void setDbUrl(String url)   { this.dbUrl   = url; }
  public void setMaxPool(int n)      { this.maxPool = n;   }
}

// 사용
// AppConfig.INSTANCE.getDbUrl()`,
    explain: {
      concept: 'Enum 싱글톤은 JVM이 enum 값을 딱 하나만 만든다는 보장을 이용해요. 직렬화(Serialization)나 리플렉션 공격에도 인스턴스가 하나임을 보장하는 가장 안전한 싱글톤 방법이에요.',
      terms: [
        { t: 'enum INSTANCE', d: 'JVM이 클래스 로딩 시 딱 한 번만 생성하는 값' },
        { t: '직렬화 안전', d: '역직렬화해도 새 인스턴스가 생기지 않음' },
        { t: '리플렉션 안전', d: 'enum 생성자는 리플렉션으로 새로 호출 불가' },
        { t: 'AppConfig.INSTANCE', d: '싱글톤에 접근하는 유일한 방법' },
        { t: 'Effective Java', d: 'Joshua Bloch가 권장하는 싱글톤 구현 방식' },
      ],
      why: 'double-checked locking 없이 스레드 안전 + 직렬화 안전을 동시에 얻으려고요.',
      pitfall: 'Enum은 상속이 불가해요. 다형성이 필요하면 volatile+synchronized 방식을 쓰세요.',
    },
  },

  // ── 13. Factory Method (GoF) ─────────────────────────────────────────────
  {
    id: 'dp-factory-gof',
    lang: 'java',
    title: 'Factory Method (GoF) - 서브클래스가 결정',
    file: 'DocumentCreator.java',
    code: `// Creator: 팩터리 메서드를 선언하는 추상 클래스
public abstract class DocumentCreator {
  public final void newDocument() {
    Document doc = createDocument(); // 팩터리 메서드
    doc.open();
    doc.edit();
    doc.save();
  }
  protected abstract Document createDocument();
}

public interface Document {
  void open();
  void edit();
  void save();
}

// ConcreteCreator
public class PdfCreator extends DocumentCreator {
  protected Document createDocument() { return new PdfDocument(); }
}

public class WordCreator extends DocumentCreator {
  protected Document createDocument() { return new WordDocument(); }
}

public class PdfDocument implements Document {
  public void open() { System.out.println("PDF 열기"); }
  public void edit() { System.out.println("PDF 편집"); }
  public void save() { System.out.println("PDF 저장"); }
}

public class WordDocument implements Document {
  public void open() { System.out.println("Word 열기"); }
  public void edit() { System.out.println("Word 편집"); }
  public void save() { System.out.println("Word 저장"); }
}`,
    explain: {
      concept: 'GoF Factory Method는 부모 클래스가 "어떤 객체를 만들지"는 서브클래스에 맡기는 패턴이에요. 부모는 흐름(열기→편집→저장)만 정의하고, 실제 제품 결정은 자식이 해요.',
      terms: [
        { t: 'createDocument()', d: '서브클래스가 반드시 구현하는 팩터리 메서드' },
        { t: 'DocumentCreator', d: '공통 흐름을 정의하는 Creator 추상 클래스' },
        { t: 'PdfCreator / WordCreator', d: '구체적인 제품을 결정하는 ConcreteCreator' },
        { t: 'Document', d: '생성 대상 제품의 공통 인터페이스' },
        { t: 'final newDocument()', d: '제품 생성 후 공통 흐름을 실행하는 메서드' },
      ],
      why: '제품 생성 로직을 상위 클래스에서 분리해 확장 시 서브클래스만 추가하면 돼요.',
      pitfall: '클래스가 하나 늘 때마다 Creator 서브클래스도 늘어요.',
    },
  },

  // ── 14. Builder with Lombok ───────────────────────────────────────────────
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

// 사용 예
class Example {
  public static void main(String[] args) {
    ProductDto dto = ProductDto.builder()
        .name("자바 책")
        .price(30000)
        .inStock(true)
        .build();

    // 일부만 바꾼 복사본
    ProductDto cheaper = dto.toBuilder().price(25000).build();
  }
}`,
    explain: {
      concept: 'Lombok @Builder는 빌더 패턴 코드를 자동으로 만들어줘요. @Value와 함께 쓰면 불변 객체 + 빌더를 몇 줄로 끝낼 수 있어요.',
      terms: [
        { t: '@Builder', d: '빌더 클래스와 메서드를 자동 생성' },
        { t: '@Value', d: '모든 필드를 final + getter만 생성하는 불변 클래스' },
        { t: 'toBuilder = true', d: '기존 객체에서 일부만 바꾼 복사본 생성 허용' },
        { t: '@Builder.Default', d: '빌더에서 기본값을 지정하는 어노테이션' },
        { t: '.build()', d: '최종 객체 생성' },
      ],
      why: '반복적인 빌더 코드를 없애 핵심 필드 선언에 집중하려고요.',
      pitfall: 'Lombok은 컴파일 타임 코드 생성이라 IDE 플러그인 설치가 필요해요.',
    },
  },

  // ── 15. Strategy with Spring DI ──────────────────────────────────────────
  {
    id: 'dp-strategy-spring',
    lang: 'java',
    title: 'Strategy + Spring - 빈으로 전략 주입',
    file: 'PaymentService.java',
    code: `public interface PaymentStrategy {
  String type();
  void pay(long amount);
}

@Component
public class CardPayment implements PaymentStrategy {
  public String type() { return "card"; }
  public void pay(long amount) { System.out.println("카드 결제: " + amount); }
}

@Component
public class KakaoPayment implements PaymentStrategy {
  public String type() { return "kakao"; }
  public void pay(long amount) { System.out.println("카카오페이: " + amount); }
}

@Service
public class PaymentService {
  private final Map<String, PaymentStrategy> strategies;

  public PaymentService(List<PaymentStrategy> list) {
    this.strategies = list.stream()
        .collect(Collectors.toMap(PaymentStrategy::type, s -> s));
  }

  public void pay(String type, long amount) {
    PaymentStrategy strategy = strategies.get(type);
    if (strategy == null) throw new IllegalArgumentException("미지원 결제: " + type);
    strategy.pay(amount);
  }
}`,
    explain: {
      concept: '스프링에서는 전략 구현체를 @Component 빈으로 등록하고, 서비스가 List로 주입받아 Map을 만들어요. 새 결제 수단을 추가할 때 기존 코드를 전혀 안 건드려도 돼요(개방-폐쇄 원칙).',
      terms: [
        { t: 'PaymentStrategy', d: '전략 공통 인터페이스 (type + pay)' },
        { t: 'List 주입', d: '스프링이 같은 인터페이스 빈을 리스트로 모아 주입' },
        { t: 'Collectors.toMap', d: 'type() 키 기준으로 전략 맵 생성' },
        { t: '@Component', d: '전략 구현체를 스프링 빈으로 등록' },
        { t: '개방-폐쇄 원칙', d: '기존 코드 수정 없이 새 전략을 추가할 수 있음' },
      ],
      why: '전략 선택 로직을 Map 조회로 단순화하고 OCP를 지키려고요.',
      pitfall: 'type() 반환값이 중복되면 Collectors.toMap이 예외를 던져요.',
    },
  },

  // ── 16. Observer with Spring ApplicationEvent ─────────────────────────────
  {
    id: 'dp-observer-spring',
    lang: 'java',
    title: 'Observer - Spring 이벤트',
    file: 'OrderEventPublisher.java',
    code: `// 이벤트 (불변)
public record OrderPlacedEvent(Long orderId, String email) {}

// 발행자
@Service
public class OrderService {
  private final ApplicationEventPublisher eventPublisher;

  public OrderService(ApplicationEventPublisher ep) { this.eventPublisher = ep; }

  public void place(Long orderId, String email) {
    // ... 주문 저장 로직 ...
    eventPublisher.publishEvent(new OrderPlacedEvent(orderId, email));
  }
}

// 구독자 1
@Component
public class EmailNotifier {
  @EventListener
  public void onOrderPlaced(OrderPlacedEvent e) {
    System.out.println("이메일 발송 -> " + e.email());
  }
}

// 구독자 2 (비동기)
@Component
public class PointAccumulator {
  @Async
  @EventListener
  public void onOrderPlaced(OrderPlacedEvent e) {
    System.out.println("포인트 적립 -> 주문 " + e.orderId());
  }
}`,
    explain: {
      concept: '스프링 ApplicationEvent를 쓰면 코드를 직접 연결하지 않아도 이벤트를 통해 여러 구독자에게 알림을 보낼 수 있어요. 주문과 이메일 발송이 코드 레벨에서 분리돼요.',
      terms: [
        { t: 'ApplicationEventPublisher', d: '이벤트를 발행하는 스프링 인터페이스' },
        { t: 'publishEvent()', d: '이벤트를 모든 구독자에게 전파' },
        { t: '@EventListener', d: '이 메서드가 특정 이벤트를 수신함을 표시' },
        { t: '@Async', d: '별도 스레드에서 비동기로 이벤트 처리' },
        { t: 'record 이벤트', d: 'Java record로 불변 이벤트 객체 선언' },
      ],
      why: '발행자와 구독자를 완전히 분리해 새 구독자를 손쉽게 추가하려고요.',
      pitfall: '@Async를 쓰려면 @EnableAsync를 활성화해야 해요.',
    },
  },

  // ── 17. Template Method - Spring JdbcTemplate ─────────────────────────────
  {
    id: 'dp-template-jdbc',
    lang: 'java',
    title: 'Template Method - JdbcTemplate',
    file: 'UserDao.java',
    code: `@Repository
public class UserDao {
  private final JdbcTemplate jdbc;

  public UserDao(JdbcTemplate jdbc) { this.jdbc = jdbc; }

  public List<String> findAllNames() {
    return jdbc.query(
        "SELECT name FROM users ORDER BY name",
        (rs, rowNum) -> rs.getString("name")
    );
  }

  public int countByActive(boolean active) {
    return jdbc.queryForObject(
        "SELECT COUNT(*) FROM users WHERE active = ?",
        Integer.class,
        active
    );
  }

  public void save(String name, String email) {
    jdbc.update("INSERT INTO users (name, email) VALUES (?, ?)", name, email);
  }
}`,
    explain: {
      concept: 'JdbcTemplate는 템플릿 메서드 패턴의 실전 예예요. 커넥션 얻기·예외 변환·자원 해제라는 뼈대는 JdbcTemplate이 하고, 실제 SQL과 결과 매핑만 우리가 채워요.',
      terms: [
        { t: 'JdbcTemplate', d: 'JDBC 반복 코드를 추상화한 스프링 클래스' },
        { t: 'query()', d: 'SELECT 결과를 리스트로 반환하는 메서드' },
        { t: 'RowMapper', d: 'ResultSet 한 행을 객체로 변환하는 함수형 인터페이스' },
        { t: 'queryForObject()', d: '단일 값을 반환하는 쿼리 메서드' },
        { t: 'update()', d: 'INSERT·UPDATE·DELETE 실행' },
      ],
      why: '직접 Connection·PreparedStatement를 열고 닫는 반복 코드를 없애려고요.',
      pitfall: 'queryForObject()는 행이 없으면 EmptyResultDataAccessException을 던져요.',
    },
  },

  // ── 18. Proxy - Spring AOP (캐싱) ────────────────────────────────────────
  {
    id: 'dp-proxy-aop',
    lang: 'java',
    title: 'Proxy - Spring AOP 캐시',
    file: 'ProductQueryService.java',
    code: `@Service
public class ProductQueryService {

  @Cacheable(value = "products", key = "#id")
  public ProductDto findById(Long id) {
    // DB 조회 (느린 작업)
    System.out.println("DB 조회: " + id);
    return new ProductDto("상품" + id, 10000, true, 1);
  }

  @CacheEvict(value = "products", key = "#id")
  public void evict(Long id) {
    System.out.println("캐시 제거: " + id);
  }

  @CachePut(value = "products", key = "#dto.name")
  public ProductDto update(ProductDto dto) {
    System.out.println("캐시 갱신");
    return dto;
  }
}`,
    explain: {
      concept: '스프링 AOP는 프록시 패턴을 내부적으로 써요. @Cacheable을 붙이면 스프링이 이 클래스를 감싸는 프록시를 만들고, 같은 key로 두 번 호출하면 DB 대신 캐시에서 바로 반환해요.',
      terms: [
        { t: '@Cacheable', d: '결과를 캐시에 저장하고 같은 key면 캐시 반환' },
        { t: '@CacheEvict', d: '캐시에서 특정 항목 제거' },
        { t: '@CachePut', d: '항상 메서드를 실행하고 결과로 캐시 갱신' },
        { t: 'key = "#id"', d: 'SpEL로 캐시 키 지정' },
        { t: 'AOP 프록시', d: '스프링이 자동 생성하는 프록시 객체' },
      ],
      why: '반복적인 DB 조회를 줄여 응답 속도를 높이려고요.',
      pitfall: '같은 클래스 안에서 @Cacheable 메서드를 self 호출하면 프록시를 거치지 않아 캐시가 동작 안 해요.',
    },
  },

  // ── 19. Decorator - Spring Security FilterChain ────────────────────────────
  {
    id: 'dp-decorator-filter',
    lang: 'java',
    title: 'Decorator - 서블릿 필터 체인',
    file: 'LoggingFilter.java',
    code: `@Component
@Order(1)
public class LoggingFilter extends OncePerRequestFilter {

  @Override
  protected void doFilterInternal(
      HttpServletRequest  request,
      HttpServletResponse response,
      FilterChain         chain
  ) throws ServletException, IOException {

    long start = System.currentTimeMillis();
    try {
      chain.doFilter(request, response); // 다음 필터(또는 서블릿) 호출
    } finally {
      long elapsed = System.currentTimeMillis() - start;
      System.out.printf("[%s] %s %dms%n",
          request.getMethod(), request.getRequestURI(), elapsed);
    }
  }
}`,
    explain: {
      concept: '서블릿 필터 체인은 데코레이터 패턴의 실전 예예요. 각 필터가 다음 필터를 감싸고, chain.doFilter()로 안쪽을 호출해요. 로깅·인증·압축 등 횡단 관심사를 레이어로 쌓아요.',
      terms: [
        { t: 'OncePerRequestFilter', d: '요청당 정확히 한 번만 실행되는 스프링 필터 기반 클래스' },
        { t: 'FilterChain', d: '다음 필터로 요청을 전달하는 체인 객체' },
        { t: 'chain.doFilter()', d: '다음 단계(필터 또는 서블릿)를 호출하는 메서드' },
        { t: '@Order(1)', d: '필터 실행 순서 지정(숫자가 낮을수록 먼저)' },
        { t: 'finally 블록', d: '예외 발생 여부와 관계없이 로깅을 보장' },
      ],
      why: '비즈니스 로직을 건드리지 않고 요청·응답 흐름에 기능을 덧붙이려고요.',
      pitfall: '@Component로 등록한 필터는 스프링 시큐리티 체인보다 먼저 실행될 수 있어요.',
    },
  },

  // ── 20. Facade - Spring Service Layer ─────────────────────────────────────
  {
    id: 'dp-facade-transactional',
    lang: 'java',
    title: 'Facade - 트랜잭션 퍼사드',
    file: 'CheckoutFacade.java',
    code: `@Service
@Transactional
public class CheckoutFacade {
  private final CartService    cart;
  private final CouponService  coupon;
  private final OrderService   order;
  private final PointService   point;

  public CheckoutFacade(CartService c, CouponService co,
                        OrderService o, PointService p) {
    this.cart   = c;
    this.coupon = co;
    this.order  = o;
    this.point  = p;
  }

  public Long checkout(Long userId, String couponCode) {
    List<CartItem> items      = cart.getItems(userId);
    long           discount   = coupon.apply(couponCode, userId);
    Long           orderId    = order.create(userId, items, discount);
    point.earn(userId, orderId);
    cart.clear(userId);
    return orderId;
  }
}`,
    explain: {
      concept: '트랜잭션 퍼사드는 여러 서비스를 하나의 @Transactional 메서드로 묶어요. 카트·쿠폰·주문·포인트가 모두 성공하거나, 하나라도 실패하면 전부 롤백돼요.',
      terms: [
        { t: 'CheckoutFacade', d: '여러 서비스를 조율하는 퍼사드 서비스' },
        { t: '@Transactional', d: '메서드 전체를 하나의 DB 트랜잭션으로 묶음' },
        { t: 'cart / coupon / order / point', d: '각 도메인 서비스' },
        { t: 'checkout()', d: '결제 전 과정을 하나의 작업으로 실행' },
        { t: '롤백', d: '예외 발생 시 모든 변경이 자동 취소' },
      ],
      why: '여러 서비스에 걸친 복잡한 흐름을 원자적으로 처리하려고요.',
      pitfall: 'CheckoutFacade 안에서 checked 예외가 발생하면 기본 설정으로는 롤백 안 해요. rollbackFor = Exception.class 를 지정하세요.',
    },
  },
];
