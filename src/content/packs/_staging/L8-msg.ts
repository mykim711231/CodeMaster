import type { Snippet } from '../../types';

export const messaging: Snippet[] = [
  {
    id: 'msg-kafka-producer-send',
    lang: 'java',
    title: 'KafkaProducer로 메시지 보내기',
    file: 'HelloProducer.java',
    code: `import java.util.Properties;
import org.apache.kafka.clients.producer.KafkaProducer;
import org.apache.kafka.clients.producer.ProducerRecord;
import org.apache.kafka.common.serialization.StringSerializer;

Properties props = new Properties();
props.put("bootstrap.servers", "localhost:9092");
props.put("key.serializer", StringSerializer.class.getName());
props.put("value.serializer", StringSerializer.class.getName());
try (KafkaProducer<String, String> producer = new KafkaProducer<>(props)) {
  System.out.println("[실행] KafkaProducer 생성 - broker: localhost:9092");
  producer.send(new ProducerRecord<>("hello", "k1", "안녕"));
  System.out.println("[전송] 토픽=hello, key=k1, value=안녕");
}`,
    explain: {
      concept:
        'KafkaProducer는 Apache Kafka라는 분산 메시지 우체국에 메시지를 발송하는 도구예요. ' +
        '메시지는 "토픽(Topic)"이라는 우편함에 분류돼서 저장되고, 여러 소비자(Consumer)가 읽어갈 수 있어요. ' +
        'bootstrap.servers로 Kafka 브로커의 주소를 알려주고, key.serializer/value.serializer로 메시지를 직렬화(바이트로 변환)하는 방식을 정해요. ' +
        'ProducerRecord는 한 통의 편지(메시지)로, 토픽 이름·키·값을 담아 send()로 전송해요. ' +
        '비동기 전송이라 send()는 즉시 반환되고, 실제 전송은 내부 버퍼와 네트워크 스레드가 처리해요. ' +
        '이런 비동기 방식 덕분에 초당 수백만 건의 메시지도 처리할 수 있는 고성능을 자랑해요.',
      terms: [
        { t: 'bootstrap.servers', d: 'Kafka 클러스터의 브로커 주소 목록이에요. 최소 하나만 알려줘도 클러스터 전체 정보를 얻어와요.' },
        { t: 'KafkaProducer', d: 'Kafka 토픽에 메시지를 발행하는 발신자(Producer) 클라이언트예요. 스레드 안전해서 여러 스레드가 공유해도 돼요.' },
        { t: 'ProducerRecord', d: '보낼 메시지 한 통을 표현하는 객체예요. 토픽, 키(파티셔닝용), 값(실제 데이터), 헤더를 담아요.' },
        { t: 'StringSerializer', d: 'Java String 객체를 바이트 배열로 변환하는 직렬화기예요. Kafka는 데이터를 바이트로 저장하고 전송해요.' },
      ],
      why:
        '마이크로서비스 간 비동기 통신, 로그 수집, 이벤트 소싱 등에서 데이터를 안정적으로 전달하고 싶을 때 Kafka를 써요. 디스크에 저장돼서 데이터 손실이 거의 없어요.',
      expectedOutput:
        '[실행] KafkaProducer 생성 - broker: localhost:9092\n' +
        '[전송] 토픽=hello, key=k1, value=안녕',
      realWorldUsage:
        '실제 프로젝트에서 사용자 가입 → Kafka "user-registered" 토픽 발행 → 알림 서비스·마케팅 서비스·분석 서비스가 각각 소비하는 이벤트 기반 아키텍처를 구성해요. ' +
        '우버는 Kafka로 하루 수조 개의 메시지를 처리해요.',
      pitfall:
        'serializer 설정을 빠뜨리면 "No serializer found" 예외가 발생해요. key와 value 모두 serializer를 지정해야 해요. ' +
        '또한 Producer는 AutoCloseable이라 try-with-resources로 감싸야 종료 시 내부 버퍼를 비우고 안전하게 닫혀요.',
    },
  },
  {
    id: 'msg-kafka-producer-callback',
    lang: 'java',
    title: 'KafkaProducer 콜백으로 성공 확인',
    file: 'CallbackProducer.java',
    code: `import java.util.Properties;
import org.apache.kafka.clients.producer.KafkaProducer;
import org.apache.kafka.clients.producer.ProducerRecord;
import org.apache.kafka.common.serialization.StringSerializer;

Properties props = new Properties();
props.put("bootstrap.servers", "localhost:9092");
props.put("key.serializer", StringSerializer.class.getName());
props.put("value.serializer", StringSerializer.class.getName());
try (KafkaProducer<String, String> producer = new KafkaProducer<>(props)) {
  System.out.println("[실행] 콜백 방식 전송");
  producer.send(new ProducerRecord<>("hello", "k1", "안녕"), (meta, e) -> {
    if (e != null) {
      System.out.println("[실패] " + e.getMessage());
      return;
    }
    System.out.println("[성공] offset=" + meta.offset()
        + ", partition=" + meta.partition());
  });
}`,
    explain: {
      concept:
        'send()에 두 번째 인자로 콜백 함수를 넘기면, Kafka가 메시지 전송 성공/실패 여부를 알려줘요. ' +
        '콜백의 첫 번째 인자(meta)는 전송 성공 시 메시지가 저장된 위치 정보(토픽, 파티션, 오프셋)를 담고 있고, 두 번째 인자(e)는 실패 시 예외를 담아요. ' +
        'offset은 Kafka 파티션 안에서 이 메시지의 일련번호로, 소비자가 "어디까지 읽었는지" 관리하는 기준이 돼요. ' +
        '콜백을 쓰면 전송 성공을 확실히 알 수 있어서, 결제·주문처럼 손실되면 안 되는 중요한 메시지에 적합해요.',
      terms: [
        { t: '(meta, e) -> {...}', d: '전송 완료 후 호출되는 콜백 람다예요. meta=성공 정보(RecordMetadata), e=실패 예외를 담아요.' },
        { t: 'meta.offset()', d: 'Kafka 파티션에서 이 메시지가 저장된 위치(오프셋)를 반환해요. 파티션 내에서 유일한 번호예요.' },
        { t: 'meta.partition()', d: '메시지가 저장된 파티션 번호를 반환해요. 키를 기준으로 해시 파티셔닝된 결과예요.' },
        { t: 'e != null 확인', d: '실패 시에만 e가 non-null이에요. 항상 null 체크를 먼저 해서 성공/실패를 구분해야 해요.' },
      ],
      why:
        '비동기 전송의 성공/실패를 그 자리에서 처리하려고 해요. 실패 시 재시도하거나 별도 저장소에 기록해둘 수 있어요.',
      expectedOutput:
        '[실행] 콜백 방식 전송\n' +
        '[성공] offset=15, partition=0',
      realWorldUsage:
        '실제 프로젝트에서 결제 완료 이벤트를 Kafka로 발행할 때 콜백으로 성공 여부를 확인하고, 실패하면 즉시 데이터베이스에 outbox 테이블로 저장해서 나중에 재처리해요. ' +
        '은행처럼 메시지 손실이 절대 허용되지 않는 업무에서 필수 패턴이에요.',
      pitfall:
        '콜백 안에서 예외(e)를 null 체크 없이 무시하거나 삼키면, 메시지가 손실돼도 전혀 알 수 없어요. 항상 e != null을 먼저 확인하세요. ' +
        '또한 콜백은 Kafka의 네트워크 스레드에서 호출되므로, 무거운 작업(DB 저장 등)은 별도 스레드 풀로 넘겨야 해요.',
    },
  },
  {
    id: 'msg-kafka-listener-basic',
    lang: 'java',
    title: '@KafkaListener 기본 수신',
    file: 'HelloListener.java',
    code: `import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Component;

@Component
public class HelloListener {

  @KafkaListener(topics = "hello", groupId = "g1")
  public void listen(String message) {
    System.out.println("[수신] 받은 메시지: " + message);
  }
}`,
    explain: {
      concept:
        '@KafkaListener는 Kafka 토픽에 새 메시지가 도착하면 자동으로 호출되는 메서드를 만들어주는 어노테이션이에요. ' +
        'topics로 구독할 토픽을 지정하고, groupId로 소비자 그룹을 정해요. ' +
        '소비자 그룹이 같으면 한 메시지를 그룹 내 한 소비자만 처리하지만, 그룹이 다르면 같은 메시지를 각 그룹이 모두 받아요. ' +
        '메서드 매개변수 타입이 String이면 메시지 값(value)만 전달돼요. 스프링이 Kafka 메시지를 알아서 역직렬화해서 넘겨줘요. ' +
        '이 한 줄의 어노테이션으로 폴링 루프, 커밋, 리밸런싱 처리를 스프링 Kafka가 모두 대신해줘서 코드가 아주 간결해져요.',
      terms: [
        { t: '@KafkaListener', d: '지정된 Kafka 토픽을 구독하고 메시지가 도착하면 자동으로 이 메서드를 호출해줘요.' },
        { t: 'topics = "hello"', d: '"hello"라는 토픽의 메시지를 받아요. 여러 토픽을 배열로 지정할 수도 있어요.' },
        { t: 'groupId = "g1"', d: '소비자 그룹 식별자예요. 같은 그룹의 소비자끼리 파티션을 나눠서 병렬 처리해요.' },
        { t: 'listen(String message)', d: '메시지 값이 String으로 자동 변환되어 전달돼요. 타입은 설정된 deserializer에 따라 달라져요.' },
      ],
      why:
        '메시지가 오면 자동으로 반응하는 이벤트 주도 구조를 아주 적은 코드로 구현하려고 해요.',
      expectedOutput:
        '[수신] 받은 메시지: 안녕',
      realWorldUsage:
        '실제 프로젝트에서 주문 생성 이벤트를 수신해서 재고를 감소시키거나, 로그 메시지를 받아서 Elasticsearch에 색인하는 등 대부분의 Kafka 소비 로직이 @KafkaListener로 시작해요.',
      pitfall:
        'groupId를 지정하지 않으면 스프링이 자동으로 랜덤한 그룹 ID를 생성해요. 애플리케이션 재시작 시 그룹이 달라져서 이전 오프셋 정보를 잃고 처음부터 다시 읽게 될 수 있어요.',
    },
  },
  {
    id: 'msg-kafka-listener-record',
    lang: 'java',
    title: '@KafkaListener로 레코드 통째로 받기',
    file: 'RecordListener.java',
    code: `import org.apache.kafka.clients.consumer.ConsumerRecord;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Component;

@Component
public class RecordListener {

  @KafkaListener(topics = "hello", groupId = "g1")
  public void listen(ConsumerRecord<String, String> record) {
    System.out.println("[수신] key=" + record.key()
        + ", value=" + record.value()
        + ", partition=" + record.partition()
        + ", offset=" + record.offset());
  }
}`,
    explain: {
      concept:
        'ConsumerRecord 타입으로 매개변수를 받으면 값뿐 아니라 메타정보(키, 파티션, 오프셋, 타임스탬프, 헤더)까지 통째로 받아요. ' +
        'key()는 메시지 키로, 같은 키는 항상 같은 파티션에 저장돼서 순서가 보장돼요. partition()과 offset()은 메시지의 정확한 위치를 알려줘요. ' +
        '이 정보들은 감사 로그, 중복 감지, 디버깅 등에 유용하게 써요. ' +
        '예를 들어 "파티션 2, 오프셋 15번 메시지까지 처리했어요"라고 기록해두면 장애 복구 시 어디부터 다시 읽을지 정확히 알 수 있어요.',
      terms: [
        { t: 'ConsumerRecord<K, V>', d: 'Kafka 메시지의 값뿐 아니라 키·파티션·오프셋·헤더 등 전체 정보를 담는 레코드 객체예요.' },
        { t: 'record.key()', d: '메시지 키를 반환해요. 같은 키의 메시지는 항상 같은 파티션으로 보내져서 순서 처리가 보장돼요.' },
        { t: 'record.partition()', d: '메시지가 저장된 파티션 번호(0부터 시작)를 알려줘요. Kafka의 병렬 처리 단위예요.' },
        { t: 'record.offset()', d: '파티션 안에서 이 메시지의 순서 번호예요. 소비자가 어디까지 읽었는지 추적하는 기준이에요.' },
      ],
      why:
        '메시지 값만으로는 부족하고, 어떤 파티션에서 왔는지, 몇 번째 메시지인지, 헤더에 뭐가 들었는지 같은 메타정보가 필요할 때 써요.',
      expectedOutput:
        '[수신] key=k1, value=안녕, partition=0, offset=15',
      realWorldUsage:
        '실제 프로젝트에서 주문 이벤트를 처리할 때, orderId를 키로 해서 같은 주문의 모든 이벤트가 순서대로 처리되도록 보장해요. ' +
        'partition과 offset 정보는 데이터 파이프라인의 중복 제거와 모니터링 대시보드에 사용돼요.',
      pitfall:
        'ConsumerRecord로 받으면 value만 받을 때보다 불필요한 메타정보까지 역직렬화되지는 않지만, 코드가 다소 길어져요. ' +
        '필요한 정보만 골라서 받는 게 좋은 관례예요.',
    },
  },
  {
    id: 'msg-kafka-listener-header',
    lang: 'java',
    title: '@KafkaListener로 헤더 읽기',
    file: 'HeaderListener.java',
    code: `import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.messaging.handler.annotation.Header;
import org.springframework.stereotype.Component;

@Component
public class HeaderListener {

  @KafkaListener(topics = "orders", groupId = "g1")
  public void listen(
      String payload,
      @Header("traceId") String traceId) {
    System.out.println("[수신] payload=" + payload
        + ", traceId=" + traceId);
  }
}`,
    explain: {
      concept:
        'Kafka 메시지의 헤더(Header)는 편지 봉투에 붙은 메모지 같은 존재예요. ' +
        '메시지 본문(payload)과 별도로 부가 정보를 담을 수 있어서, 본문을 파싱하지 않고도 원하는 정보만 꺼낼 수 있어요. ' +
        '@Header 어노테이션으로 원하는 헤더의 값을 메서드 매개변수에 직접 주입받을 수 있어요. ' +
        '예제의 traceId는 분산 추적을 위한 식별자로, 이벤트가 어디서 시작됐는지 추적하는 데 써요. ' +
        '헤더는 메시지마다 독립적이어서, 같은 토픽에서도 서로 다른 헤더를 가진 메시지를 섞어서 보낼 수 있어요.',
      terms: [
        { t: '@Header("traceId")', d: '메시지 헤더에서 "traceId"라는 키의 값을 꺼내서 매개변수 traceId에 주입해줘요.' },
        { t: 'payload', d: '메시지의 실제 본문(값)이에요. 헤더와 분리되어 전달돼요.' },
        { t: '필수 헤더 vs 선택 헤더', d: '기본적으로 @Header는 필수(required=true)예요. 없으면 예외가 발생해요.' },
        { t: '@Header(required = false)', d: '헤더가 없어도 예외 없이 null을 받으려면 required=false 옵션을 붙여요.' },
      ],
      why:
        '추적 ID, 인증 토큰, 메시지 유형 같은 메타정보를 본문과 섞지 않고 분리해서 전달하려고 해요. 관심사의 분리가 명확해져요.',
      expectedOutput:
        '[수신] payload=주문생성, traceId=abc-123-def',
      realWorldUsage:
        '실제 프로젝트에서 분산 추적 시스템(Zipkin, Jaeger)의 traceId를 Kafka 헤더에 담아서, 마이크로서비스 간 이벤트 흐름을 하나의 트랜잭션처럼 추적해요. ' +
        '메시지 유형(type) 헤더로 각기 다른 이벤트(OrderCreated, OrderCancelled)를 같은 토픽에서 구분해 처리할 수 있어요.',
      pitfall:
        '헤더가 없으면 기본적으로 @Header는 예외를 발생시켜요. 헤더가 선택 사항이라면 반드시 @Header(name = "traceId", required = false)로 지정하세요. ' +
        '또한 Kafka 헤더 값은 byte[]로 저장되므로, 복잡한 객체는 직렬화 설정이 필요해요.',
    },
  },
  {
    id: 'msg-kafka-template',
    lang: 'java',
    title: 'KafkaTemplate으로 보내기',
    file: 'TemplateProducer.java',
    code: `import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Service;

@Service
public class HelloService {

  private final KafkaTemplate<String, String> template;

  public HelloService(KafkaTemplate<String, String> template) {
    this.template = template;
  }

  public void send(String msg) {
    System.out.println("[실행] KafkaTemplate send - msg: " + msg);
    template.send("hello", msg);
    System.out.println("[전송] 토픽=hello, 비동기 발행 완료");
  }
}`,
    explain: {
      concept:
        'KafkaTemplate은 스프링이 감싸둔 KafkaProducer 래퍼예요. ' +
        '직렬화, 브로커 주소, ProducerFactory 같은 번거로운 설정은 application.yml에서 끝내고, 코드는 template.send() 한 줄로 메시지를 보낼 수 있어요. ' +
        'send()의 반환 타입은 ListenableFuture(또는 CompletableFuture)라서, 콜백을 붙이거나 .get()으로 동기 대기하는 것도 가능해요. ' +
        '스프링 부트의 자동 설정 덕분에 KafkaTemplate 빈이 이미 생성돼 있어서, 생성자 주입만 하면 바로 쓸 수 있어요.',
      terms: [
        { t: 'KafkaTemplate<K, V>', d: '스프링이 제공하는 Kafka 발송기 템플릿이에요. 설정은 자동 주입되고 send()만 호출하면 돼요.' },
        { t: 'template.send("hello", msg)', d: '"hello" 토픽에 msg를 값으로 전송해요. 키 없이 값만 보낼 수 있어요.' },
        { t: '생성자 주입', d: 'KafkaTemplate을 생성자로 받아서 final 필드에 저장하는 전형적인 스프링 DI 패턴이에요.' },
        { t: 'ListenableFuture/CompletableFuture', d: 'send()의 반환 타입으로, 비동기 결과를 다루는 표준 API예요. 콜백이나 thenApply로 후속 처리를 붙여요.' },
      ],
      why:
        '스프링 환경에서 Kafka를 최소한의 코드로 사용하려고 해요. Producer의 수명 주기(생성→사용→종료)를 스프링이 모두 관리해줘요.',
      expectedOutput:
        '[실행] KafkaTemplate send - msg: 안녕하세요\n' +
        '[전송] 토픽=hello, 비동기 발행 완료',
      realWorldUsage:
        '실제 프로젝트에서 컨트롤러→서비스→KafkaTemplate 흐름으로 사용자 요청을 이벤트로 변환해서 발행해요. ' +
        '주문 컨트롤러에서 POST /orders 요청을 받으면 OrderService가 KafkaTemplate.send("orders", orderEvent)로 발행하는 식이에요.',
      pitfall:
        'send()는 기본적으로 비동기로 동작해요. 전송이 확실히 성공했는지 확인하려면 .addCallback()으로 콜백을 붙이거나, .get(timeout)으로 동기 대기하세요. ' +
        '또한 KafkaTemplate의 제너릭 타입(K, V)이 직렬화 설정과 일치해야 직렬화 에러를 피할 수 있어요.',
    },
  },
  {
    id: 'msg-rabbit-template',
    lang: 'java',
    title: 'RabbitTemplate로 메시지 보내기',
    file: 'RabbitProducer.java',
    code: `import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.stereotype.Service;

@Service
public class NotifyService {

  private final RabbitTemplate rabbit;

  public NotifyService(RabbitTemplate rabbit) {
    this.rabbit = rabbit;
  }

  public void publish(String msg) {
    System.out.println("[실행] RabbitMQ 발행 - exchange=orders, key=new");
    rabbit.convertAndSend("orders", "new", msg);
    System.out.println("[전송] 발행 완료: " + msg);
  }
}`,
    explain: {
      concept:
        'RabbitTemplate은 RabbitMQ라는 AMQP 메시지 브로커에 메시지를 보내는 스프링의 템플릿 도구예요. ' +
        'convertAndSend(exchange, routingKey, message) 세 가지 인자로 목적지를 정해요. ' +
        'exchange는 우체국의 분류 센터 같은 존재로, routingKey를 보고 어떤 큐로 배달할지 결정해요. ' +
        'Kafka의 토픽과 가장 큰 차이는 RabbitMQ가 "exchange → binding → queue"라는 3단계 라우팅 구조를 가진다는 점이에요. ' +
        'RabbitMQ는 메시지가 소비자에게 전달되면 삭제되는 휘발성 구조라서, 이벤트보다는 작업 명령이나 알림에 더 적합해요.',
      terms: [
        { t: 'RabbitTemplate', d: '스프링 AMQP가 제공하는 RabbitMQ 발송 템플릿이에요. convertAndSend로 객체를 자동 직렬화해서 전송해요.' },
        { t: 'convertAndSend', d: 'Java 객체를 Message로 자동 변환(직렬화)해서 전송해요. String, JSON, byte[] 모두 처리할 수 있어요.' },
        { t: '"orders" (exchange)', d: '라우팅의 첫 관문인 exchange 이름이에요. 메시지를 어떤 큐로 보낼지 결정하는 분류기 역할을 해요.' },
        { t: '"new" (routing key)', d: 'exchange에서 큐로 가는 길을 결정하는 키예요. binding에서 정의한 패턴과 매칭돼요.' },
      ],
      why:
        '비동기 작업 큐(주문 처리, 이미지 리사이징), 실시간 알림 발송, 마이크로서비스 간 명령 전달에 RabbitMQ를 써요.',
      expectedOutput:
        '[실행] RabbitMQ 발행 - exchange=orders, key=new\n' +
        '[전송] 발행 완료: 새 주문이 도착했어요',
      realWorldUsage:
        '실제 프로젝트에서 사용자가 주문을 넣으면 "orders" exchange에 "new" 라우팅 키로 메시지를 보내고, ' +
        '재고 서비스·배송 서비스·알림 서비스의 각 큐가 이 메시지를 받아서 각자 할 일을 처리해요. ' +
        'Celery(Python) 같은 작업 큐와도 유사한 패턴이에요.',
      pitfall:
        'routing key가 exchange에 정의된 어떤 binding과도 매칭되지 않으면 메시지가 어느 큐에도 도달하지 못하고 소멸돼요. ' +
        '실무에서는 발행 전에 exchange와 binding이 제대로 설정됐는지 반드시 확인해야 해요.',
    },
  },
  {
    id: 'msg-rabbit-listener',
    lang: 'java',
    title: '@RabbitListener 기본 수신',
    file: 'OrderListener.java',
    code: `import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.stereotype.Component;

@Component
public class OrderListener {

  @RabbitListener(queues = "orders.queue")
  public void onMessage(String order) {
    System.out.println("[처리] 주문 수신: " + order);
  }
}`,
    explain: {
      concept:
        '@RabbitListener는 RabbitMQ 큐를 구독하고 메시지가 도착하면 자동으로 메서드를 호출해주는 어노테이션이에요. ' +
        'queues 속성에 큐 이름을 지정하면, 스프링이 해당 큐에 리스너를 연결하고 메시지를 폴링해서 가져와요. ' +
        '@KafkaListener와 사용법이 거의 같아서, 메시지 브로커를 바꿔도 코드 구조가 비슷하게 유지돼요. ' +
        '메시지가 큐에 도착하는 즉시 리스너가 호출되므로, 실시간에 가까운 반응성을 제공해요.',
      terms: [
        { t: '@RabbitListener', d: 'RabbitMQ 큐의 메시지를 자동으로 수신하는 스프링 어노테이션이에요. 폴링·커넥션 관리를 대신해요.' },
        { t: 'queues = "orders.queue"', d: '구독할 큐의 이름이에요. 이 큐에 메시지가 들어오면 onMessage()가 호출돼요.' },
        { t: 'onMessage(String order)', d: '큐에서 꺼낸 메시지를 String으로 변환해서 매개변수로 전달해요. MessageConverter가 변환해요.' },
      ],
      why:
        '주문 처리, 알림 발송, 이메일 전송 같은 비동기 작업을 큐 기반으로 구현하려고 해요. 생산자와 소비자를 시간적으로 분리할 수 있어요.',
      expectedOutput:
        '[처리] 주문 수신: 주문번호-12345',
      realWorldUsage:
        '실제 프로젝트에서 전자상거래의 주문 처리 파이프라인, 은행의 거래 승인 프로세스, 게임의 아이템 지급 시스템 등에서 @RabbitListener가 널리 쓰여요.',
      pitfall:
        '지정한 큐가 RabbitMQ에 존재하지 않으면 애플리케이션 시작 시 에러가 발생해요. 큐가 미리 생성돼 있는지 확인하거나, bindings 속성으로 자동 생성 설정을 함께 해야 해요.',
    },
  },
  {
    id: 'msg-rabbit-listener-binding',
    lang: 'java',
    title: '@RabbitListener로 exchange·binding 지정',
    file: 'FanoutListener.java',
    code: `import org.springframework.amqp.rabbit.annotation.Exchange;
import org.springframework.amqp.rabbit.annotation.Queue;
import org.springframework.amqp.rabbit.annotation.QueueBinding;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.stereotype.Component;

@Component
public class FanoutListener {

  @RabbitListener(bindings = @QueueBinding(
      value = @Queue(value = "alert.q", durable = "true"),
      exchange = @Exchange(value = "alerts", type = "fanout"),
      key = ""))
  public void onAlert(String msg) {
    System.out.println("[경보] 수신: " + msg);
  }
}`,
    explain: {
      concept:
        'bindings 속성을 사용하면 큐, exchange, binding을 코드로 선언해서 애플리케이션 시작 시 RabbitMQ에 자동으로 생성해요. ' +
        '큐가 미리 없어도 애플리케이션이 알아서 만들기 때문에, 인프라 수동 설정이 필요 없어요. ' +
        'fanout 타입의 exchange는 routing key와 관계없이 연결된 모든 큐에 메시지를 뿌려요(브로드캐스트). ' +
        'direct는 routing key가 정확히 일치하는 큐에만, topic은 패턴(routing.key.*)으로 매칭되는 큐에 전달해요. ' +
        'durable = "true"는 브로커가 재시작돼도 큐가 사라지지 않고 유지되게 해요.',
      terms: [
        { t: '@QueueBinding', d: '큐와 exchange를 연결(binding)하는 선언이에요. value=큐, exchange=연결할 exchange, key=라우팅 키를 지정해요.' },
        { t: '@Queue(value, durable)', d: '큐 선언이에요. durable=true면 브로커 재시작 후에도 큐가 유지돼요. false면 재시작 시 삭제돼요.' },
        { t: '@Exchange(type = "fanout")', d: 'exchange 선언이에요. fanout은 모든 큐에 브로드캐스트, direct는 라우팅 키 일치, topic은 패턴 매칭이에요.' },
        { t: 'key = ""', d: 'fanout exchange는 라우팅 키를 무시하므로 빈 문자열을 써요. direct/topic이면 실제 값을 넣어요.' },
      ],
      why:
        '배포만 하면 필요한 큐와 exchange가 자동으로 생성돼서, 수동으로 RabbitMQ 관리 콘솔에서 설정할 필요가 없어져요.',
      expectedOutput:
        '[경보] 수신: 서버 CPU 90% 초과',
      realWorldUsage:
        '실제 프로젝트에서 마이크로서비스 배포 시 RabbitMQ 큐 구성을 자동으로 생성해서, 개발·스테이징·운영 환경별로 일관된 설정을 유지해요. ' +
        '특히 Kubernetes 환경에서 새 Pod가 뜰 때 큐가 자동 생성되도록 하는 패턴이 일반적이에요.',
      pitfall:
        'type을 명시하지 않으면 기본값 "direct"로 생성돼요. fanout으로 의도했는데 direct로 생성되면 일부 소비자만 메시지를 받게 될 수 있어요. ' +
        '또한 durable=true로 생성한 큐는 수동으로 삭제하지 않으면 브로커에 계속 남아서 관리 부담이 늘어나요.',
    },
  },
  {
    id: 'msg-jms-template',
    lang: 'java',
    title: 'JmsTemplate로 큐에 보내기',
    file: 'JmsProducer.java',
    code: `import org.springframework.jms.core.JmsTemplate;
import org.springframework.stereotype.Service;

@Service
public class JmsProducer {

  private final JmsTemplate jms;

  public JmsProducer(JmsTemplate jms) {
    this.jms = jms;
  }

  public void send(String text) {
    System.out.println("[실행] JMS 발송 - mailbox");
    jms.convertAndSend("mailbox", text);
    System.out.println("[전송] 발송 완료: " + text);
  }
}`,
    explain: {
      concept:
        'JmsTemplate은 JMS(Java Message Service) 호환 메시지 브로커에 메시지를 보내는 스프링의 템플릿이에요. ' +
        'JMS는 자바 진영의 표준 메시지 규격(API)이어서, ActiveMQ, IBM MQ, Amazon SQS 등 다양한 브로커와 호환돼요. ' +
        'RabbitMQ(AMQP)나 Kafka와 달리, JMS는 자바 표준(Jakarta EE)이라서 Spring Boot가 아니어도 javax.jms 패키지만 있으면 쓸 수 있어요. ' +
        'convertAndSend("mailbox", text)는 text를 JMS Message로 변환해서 "mailbox"라는 목적지(큐)로 전송해요.',
      terms: [
        { t: 'JmsTemplate', d: '스프링이 제공하는 JMS 발송 템플릿이에요. 연결·세션 관리를 대신하고, convertAndSend로 객체 전송을 간편하게 해요.' },
        { t: 'convertAndSend', d: 'Java 객체를 JMS Message로 자동 변환해서 전송해요. MessageConverter가 직렬화를 담당해요.' },
        { t: '"mailbox" (destination)', d: 'JMS 목적지(destination) 이름이에요. 큐(Queue)나 토픽(Topic)일 수 있어요.' },
        { t: 'JMS vs AMQP vs Kafka', d: 'JMS는 자바 표준 API, AMQP는 와이어 프로토콜, Kafka는 분산 로그 저장소예요. 각자 다른 설계 철학을 가져요.' },
      ],
      why:
        'ActiveMQ 같은 전통적인 JMS 브로커와 통합해야 하거나, 자바 진영 표준을 준수해야 하는 기업 환경에서 써요.',
      expectedOutput:
        '[실행] JMS 발송 - mailbox\n' +
        '[전송] 발송 완료: 새 메일이 도착했어요',
      realWorldUsage:
        '실제 프로젝트에서 은행·보험·공공기관처럼 JMS 기반의 레거시 메시징 인프라(IBM MQ, ActiveMQ)와 통합할 때 JmsTemplate을 써요. ' +
        'Spring Boot + ActiveMQ 조합은 엔터프라이즈 환경에서 가장 흔한 메시징 구성 중 하나예요.',
      pitfall:
        '브로커 연결 설정(spring.activemq.broker-url 등)이 없으면 JmsTemplate을 주입받을 수 없어서 NoSuchBeanDefinitionException이 발생해요. ' +
        'Spring Boot에서는 자동 설정이 있지만, 순수 Spring에서는 ConnectionFactory 빈을 직접 등록해야 해요.',
    },
  },
  {
    id: 'msg-jms-listener',
    lang: 'java',
    title: '@JmsListener로 수신',
    file: 'JmsConsumer.java',
    code: `import org.springframework.jms.annotation.JmsListener;
import org.springframework.stereotype.Component;

@Component
public class JmsConsumer {

  @JmsListener(destination = "mailbox")
  public void onMessage(String text) {
    System.out.println("[수신] 메시지 도착: " + text);
  }
}`,
    explain: {
      concept:
        '@JmsListener는 JMS 목적지(큐/토픽)를 구독하고 메시지가 도착하면 자동으로 호출되는 메서드를 만들어줘요. ' +
        'destination으로 큐 이름을 지정하면, 스프링이 백그라운드에서 MessageListenerContainer를 생성해서 폴링 방식으로 메시지를 가져와요. ' +
        '@KafkaListener, @RabbitListener와 동일한 사용 패턴이라서, 어떤 메시지 브로커를 쓰든 코드 구조가 거의 같아요. ' +
        'Converter가 JMS Message → Java 객체 변환을 자동으로 처리해줘서, 비즈니스 로직에만 집중할 수 있어요.',
      terms: [
        { t: '@JmsListener', d: 'JMS 큐/토픽에서 메시지를 수신하는 리스너 어노테이션이에요. destination으로 구독할 목적지를 지정해요.' },
        { t: 'destination = "mailbox"', d: '"mailbox"라는 이름의 큐에서 메시지를 받아요. 큐 이름은 브로커에 이미 존재해야 해요.' },
        { t: 'MessageListenerContainer', d: '@JmsListener 내부에서 사용하는 스프링 컴포넌트로, JMS 연결과 폴링 스레드를 관리해요.' },
        { t: '@EnableJms', d: '순수 Spring에서 JMS 리스너를 활성화하려면 설정 클래스에 추가해야 해요. Spring Boot에서는 자동 설정돼요.' },
      ],
      why:
        'JMS 기반 메시지 큐에서 자동으로 메시지를 받아서 처리하려고 해요. 폴링 루프를 직접 작성할 필요가 없어지고 코드가 아주 간결해져요.',
      expectedOutput:
        '[수신] 메시지 도착: 새 메일이 도착했어요',
      realWorldUsage:
        '실제 프로젝트에서 은행 시스템 간 전문(텔레그램) 메시지 교환, ERP 연동, 공공기관 데이터 연계 등에 JMS 리스너가 사용돼요.',
      pitfall:
        'Spring Boot 없이 순수 Spring을 쓸 때는 @Configuration 클래스에 @EnableJms를 반드시 붙여야 JMS 리스너가 활성화돼요. ' +
        'Spring Boot에서는 spring-boot-starter-activemq 같은 스타터가 자동으로 활성화해줘요.',
    },
  },
  {
    id: 'msg-event-publisher',
    lang: 'java',
    title: 'ApplicationEventPublisher로 이벤트 발행',
    file: 'OrderService.java',
    code: `import org.springframework.context.ApplicationEventPublisher;
import org.springframework.stereotype.Service;

@Service
public class OrderService {

  private final ApplicationEventPublisher publisher;

  public OrderService(ApplicationEventPublisher publisher) {
    this.publisher = publisher;
  }

  public void place(String id) {
    System.out.println("[실행] 주문 생성 - id: " + id);
    publisher.publishEvent(new OrderPlaced(id, false));
    System.out.println("[발행] OrderPlaced 이벤트 발행 완료");
  }
}`,
    explain: {
      concept:
        'ApplicationEventPublisher는 스프링 컨테이너 안에서 "이런 일이 있었어요!"라고 이벤트를 방송하는 도구예요. ' +
        'Kafka나 RabbitMQ 같은 외부 메시지 브로커 없이도, 같은 JVM 안에서 서비스 간 느슨한 결합(loose coupling)을 만들 수 있어요. ' +
        'publishEvent()로 이벤트 객체를 던지면, @EventListener가 붙은 메서드들이 자동으로 호출돼요. ' +
        '기본적으로는 동기적으로 실행돼서 이벤트 발행자와 리스너가 같은 스레드에서 처리돼요. ' +
        '이 방식은 외부 인프라 없이도 모듈 간 통신을 할 수 있어서, 간단한 알림·로깅·감사에 적합해요.',
      terms: [
        { t: 'ApplicationEventPublisher', d: '스프링 컨테이너 내에서 이벤트를 발행하는 인터페이스예요. @Autowired나 생성자 주입으로 받아 써요.' },
        { t: 'publishEvent(event)', d: '이벤트 객체를 발행해요. 스프링이 이벤트 타입을 보고 알맞은 @EventListener 메서드를 찾아 호출해요.' },
        { t: 'OrderPlaced', d: '발행할 이벤트 데이터를 담는 객체예요. Java 17+에서는 record로 간결하게 정의할 수 있어요.' },
        { t: '느슨한 결합', d: '발행자가 리스너의 존재를 몰라도 이벤트가 전달돼요. 리스너를 추가/제거해도 발행자 코드를 수정하지 않아도 돼요.' },
      ],
      why:
        '한 서비스의 동작(주문 생성)에 대해 다른 서비스(알림, 감사, 통계)가 반응해야 하지만, 서로 직접 의존하기 싫을 때 써요.',
      expectedOutput:
        '[실행] 주문 생성 - id: 12345\n' +
        '[발행] OrderPlaced 이벤트 발행 완료',
      realWorldUsage:
        '실제 프로젝트에서 주문 생성 후 이메일 발송, 포인트 적립, 감사 로그 기록, 캐시 무효화 같은 후처리 작업을 이벤트로 분리해요. ' +
        '도메인 이벤트(Domain Events) 패턴의 가장 기본적인 구현체예요.',
      pitfall:
        '기본적으로 publishEvent()는 동기로 실행돼서, 리스너가 느리면 발행자 스레드까지 블로킹돼요. ' +
        '리스너에 @Async를 붙이거나, 별도 EventBus(Kafka 등)로 전환해서 비동기로 처리할 수 있어요.',
    },
  },
  {
    id: 'msg-event-listener',
    lang: 'java',
    title: '@EventListener로 이벤트 받기',
    file: 'OrderEventListener.java',
    code: `import org.springframework.context.event.EventListener;
import org.springframework.stereotype.Component;

@Component
public class OrderEventListener {

  @EventListener
  public void onOrderPlaced(OrderPlaced event) {
    System.out.println("[메일] 발송 대상 주문: " + event.id());
  }
}`,
    explain: {
      concept:
        '@EventListener는 스프링 이벤트 방송을 듣는 수신기예요. ' +
        '메서드의 매개변수 타입을 보고 어떤 이벤트를 받을지 자동으로 결정해요. OrderPlaced 타입이면 OrderPlaced 이벤트만 받아요. ' +
        'publishEvent()가 호출되면, 해당 타입을 처리하는 모든 @EventListener 메서드가 실행돼요. ' +
        '하나의 이벤트에 여러 리스너가 반응할 수 있어서, 주문 생성 하나로 메일 발송·푸시 알림·통계 기록 등 여러 작업을 동시에 트리거할 수 있어요.',
      terms: [
        { t: '@EventListener', d: '매개변수 타입과 일치하는 이벤트가 발행되면 자동으로 이 메서드를 호출해줘요.' },
        { t: 'onOrderPlaced(OrderPlaced event)', d: 'OrderPlaced 타입의 이벤트만 매칭돼요. event 매개변수로 이벤트 데이터에 접근해요.' },
        { t: 'event.id()', d: 'record 타입의 컴포넌트(필드)에 접근해요. getId() 대신 id()가 record의 표준 접근 방식이에요.' },
      ],
      why:
        '주문 생성 로직과 후처리(메일, 알림, 감사)를 코드 수준에서 분리하려고 해요. 주문 서비스가 메일 서비스를 직접 의존하지 않아도 돼요.',
      expectedOutput:
        '[메일] 발송 대상 주문: 12345',
      realWorldUsage:
        '실제 프로젝트에서 DDD(도메인 주도 설계)의 도메인 이벤트 패턴을 구현할 때 @EventListener를 사용해요. ' +
        '주문 완료 → 포인트 적립·쿠폰 발급·통계 업데이트 같은 여러 액션을 각각의 리스너로 분리해서 관리해요.',
      pitfall:
        '기본적으로 @EventListener도 동기로 실행돼요. 여러 리스너가 같은 이벤트를 받으면 순차 실행되며, 하나가 느리면 나머지도 지연돼요. ' +
        '또한 리스너에서 예외가 발생하면 발행자에게 전파돼서 주 로직까지 실패할 수 있어요. try-catch로 방어하는 게 좋아요.',
    },
  },
  {
    id: 'msg-event-conditional',
    lang: 'java',
    title: '@EventListener 조건부',
    file: 'VipListener.java',
    code: `import org.springframework.context.event.EventListener;
import org.springframework.stereotype.Component;

@Component
public class VipListener {

  @EventListener(condition = "#event.vip")
  public void onVip(OrderPlaced event) {
    System.out.println("[VIP] 특별 보상 대상: " + event.id());
  }
}`,
    explain: {
      concept:
        'condition 속성으로 이벤트를 필터링할 수 있어요. SpEL(Spring Expression Language) 표현식으로 이벤트 객체의 필드 값을 검사해서, 조건이 true일 때만 리스너가 호출돼요. ' +
        '#event는 매개변수 이벤트 객체를 가리키고, .vip는 event.vip()를 호출한 결과예요. ' +
        '"VIP 주문에만 반응해라"처럼 같은 이벤트 타입이어도 특정 조건을 가진 것만 골라서 처리할 수 있어요. ' +
        '조건이 false면 리스너는 완전히 무시되므로 불필요한 호출을 막을 수 있어요.',
      terms: [
        { t: 'condition = "#event.vip"', d: 'SpEL 표현식으로 이벤트 필터링 조건을 지정해요. #event는 매개변수 객체를 참조해요.' },
        { t: '#event', d: 'SpEL에서 이벤트 객체를 참조하는 변수명이에요. 메서드 매개변수 이름이 아니라 #event로 접근해요.' },
        { t: 'SpEL', d: 'Spring Expression Language의 약자로, 런타임에 객체 그래프를 탐색하고 조건을 평가하는 표현식 언어예요.' },
      ],
      why:
        '이벤트 타입으로만 구분하기 어려운 세분화된 조건 처리(예: VIP만, 금액 10만원 이상만)를 리스너 내부 if문 없이 깔끔하게 분리하려고 해요.',
      expectedOutput:
        '[VIP] 특별 보상 대상: 12345',
      realWorldUsage:
        '실제 프로젝트에서 이벤트 조건을 이용해 대량 주문과 소액 주문을 다른 리스너로 처리하거나, ' +
        '해외 주문과 국내 주문의 처리 로직을 분기해요. 조건이 거짓이면 리스너 자체가 호출되지 않아 성능상 이점도 있어요.',
      pitfall:
        'SpEL 표현식에서 참조하는 필드명이 실제 record/클래스의 필드명과 정확히 일치해야 해요. 오타가 있으면 항상 false로 평가돼서 리스너가 절대 호출되지 않아요.',
    },
  },
  {
    id: 'msg-event-async',
    lang: 'java',
    title: '@Async로 이벤트 비동기 처리',
    file: 'AsyncListener.java',
    code: `import org.springframework.context.event.EventListener;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Component;

@Component
public class AsyncListener {

  @Async
  @EventListener
  public void onOrderPlaced(OrderPlaced event) {
    System.out.println("[비동기] 주문 처리 시작: " + event.id());
  }
}`,
    explain: {
      concept:
        '@Async를 @EventListener와 함께 쓰면 리스너가 별도 스레드 풀에서 비동기로 실행돼요. ' +
        '이벤트 발행자(publishEvent)는 리스너 완료를 기다리지 않고 바로 다음 코드로 진행해요. ' +
        '메일 발송이나 푸시 알림처럼 느린 I/O 작업을 주문 생성 스레드와 분리해서 전체 응답 속도를 향상시켜요. ' +
        '단, @Async는 스프링의 프록시 기반 AOP로 동작하므로 같은 클래스 내부 호출에는 적용되지 않아요.',
      terms: [
        { t: '@Async', d: '메서드를 별도 스레드에서 비동기로 실행해줘요. 기본적으로 SimpleAsyncTaskExecutor를 사용해요.' },
        { t: '@EventListener', d: '이벤트를 동기로 받되, @Async가 붙으면 리스너 실행만 비동기로 분리돼요.' },
        { t: 'TaskExecutor', d: '@Async가 사용하는 스레드 풀이에요. 별도 설정이 없으면 매번 새 스레드를 생성하는 기본 구현체가 쓰여요.' },
        { t: '@EnableAsync', d: '@Async를 활성화하려면 @Configuration 클래스에 붙여야 하는 스위치예요. 없으면 @Async가 무시돼요.' },
      ],
      why:
        '메일·SMS·푸시 알림 같은 느린 작업이 주문 생성 같은 중요한 흐름을 지연시키지 않게 하려고 해요.',
      expectedOutput:
        '[비동기] 주문 처리 시작: 12345',
      realWorldUsage:
        '실제 프로젝트에서 주문 완료 후 메일 발송이나 푸시 알림을 @Async로 비동기 처리해요. ' +
        '사용자는 주문 완료 페이지를 바로 볼 수 있고, 메일은 백그라운드에서 발송돼요. ' +
        '대량 메일 발송(마케팅)처럼 수 분 이상 걸리는 작업도 @Async + 전용 스레드 풀로 처리해요.',
      pitfall:
        '@EnableAsync를 설정 클래스에 추가하지 않으면 @Async가 완전히 무시되고 동기로 실행돼요. ' +
        '또한 기본 TaskExecutor는 매번 새 스레드를 생성해서 성능이 낮으므로, 실무에서는 ThreadPoolTaskExecutor 빈을 직접 정의해서 써야 해요.',
    },
  },
  {
    id: 'msg-event-record',
    lang: 'java',
    title: '레코드로 이벤트 클래스 만들기',
    file: 'OrderPlaced.java',
    code: `public record OrderPlaced(String id, boolean vip) {
}

// 사용 예
OrderPlaced event = new OrderPlaced("order-1", true);
System.out.println("[이벤트] id=" + event.id() + ", vip=" + event.vip());`,
    explain: {
      concept:
        'record는 Java 14+에서 도입된 데이터 전용 클래스예요. 생성자, getter(id()/vip()), equals(), hashCode(), toString()을 자동으로 만들어줘요. ' +
        '이벤트처럼 값을 담아서 전달하기만 하는 객체에 최적화돼 있어서, 보일러플레이트 코드를 획기적으로 줄여줘요. ' +
        '불변(immutable)이라서 생성 후에는 값을 바꿀 수 없어요. 이벤트가 발행된 후 의도치 않게 값이 변경되는 위험을 원천 차단해줘요. ' +
        '스프링 이벤트와 궁합이 좋아서, 대부분의 이벤트 클래스는 record로 정의하는 게 현대 자바의 관례예요.',
      terms: [
        { t: 'record', d: '불변 데이터 객체를 간결하게 만드는 Java 키워드예요. 모든 필드는 private final이고 자동으로 getter가 생성돼요.' },
        { t: 'id()', d: 'record의 접근자(accessor)예요. getId() 대신 필드명 그대로 메서드명이 정해져요.' },
        { t: '불변(immutable)', d: '한 번 생성하면 값을 바꿀 수 없는 객체 특성이에요. 멀티스레드 환경에서 안전하게 공유할 수 있어요.' },
        { t: '컴팩트 생성자', d: 'record는 본문에 유효성 검사 로직을 넣을 수 있는 컴팩트 생성자를 지원해요. if (id == null) throw... 같은 검증을 넣어요.' },
      ],
      why:
        '이벤트 데이터를 담는 클래스를 최소한의 코드로 정의하려고 해요. record 한 줄이 일반 클래스 50줄을 대체할 수 있어요.',
      expectedOutput:
        '[이벤트] id=order-1, vip=true',
      realWorldUsage:
        '실제 프로젝트에서 모든 DTO, 이벤트, 값 객체(Value Object)를 record로 정의해요. ' +
        'Lombok(@Data, @Value)을 대체하는 표준 방식으로 자리잡고 있어서, 최신 Spring 프로젝트에서는 record가 기본이에요.',
      pitfall:
        'record는 상속이 불가능하고, 모든 필드가 final이라 JPA 엔티티로는 사용할 수 없어요. ' +
        '또한 Jackson이 record를 직렬화/역직렬화할 때 기본 생성자가 필요 없어서 기존 POJO와 동작이 다를 수 있어요.',
    },
  },
  {
    id: 'msg-kafka-listener-greeting',
    lang: 'java',
    title: 'Greeting 객체로 받는 리스너',
    file: 'GreetingListener.java',
    code: `import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Component;

@Component
public class GreetingListener {

  @KafkaListener(topics = "greetings", groupId = "g1")
  public void listen(Greeting greeting) {
    System.out.println("[인사] name=" + greeting.name()
        + ", message=" + greeting.message());
  }
}

record Greeting(String name, String message) {}`,
    explain: {
      concept:
        '문자열 대신 사용자 정의 객체(Greeting)로 메시지를 직접 받을 수 있어요. ' +
        '스프링 Kafka의 JsonDeserializer가 JSON 문자열을 자동으로 객체로 변환해줘요. ' +
        'Greeting 같은 record를 DTO로 쓰면 타입 안전성이 높아지고, 필드 접근 시 오타 걱정이 없어져요. ' +
        '다만 이 기능을 쓰려면 deserializer 설정을 JsonDeserializer로 바꾸고, 신뢰할 수 있는 패키지(trusted packages)를 지정해야 해요.',
      terms: [
        { t: 'Greeting greeting', d: 'Kafka 메시지 JSON이 자동으로 Greeting 객체로 역직렬화돼서 전달돼요. 타입 안전하게 필드에 접근할 수 있어요.' },
        { t: 'JsonDeserializer', d: 'JSON 문자열을 Java 객체로 변환하는 Kafka 역직렬화기예요. 기본 StringDeserializer 대신 사용해요.' },
        { t: 'trusted packages', d: '역직렬화를 허용할 패키지 목록이에요. 보안상 신뢰할 수 있는 패키지만 지정해야 악성 JSON 공격을 막을 수 있어요.' },
        { t: 'record Greeting', d: 'Kafka 메시지 DTO로 사용되는 record예요. Jackson이 자동으로 JSON ↔ record 변환을 처리해줘요.' },
      ],
      why:
        '문자열을 수동으로 파싱하는 번거로움 없이, 타입 안전하게 메시지를 객체로 바로 다루려고 해요.',
      expectedOutput:
        '[인사] name=홍길동, message=안녕하세요',
      realWorldUsage:
        '실제 프로젝트에서 Kafka 이벤트를 Avro, Protobuf, JSON 등으로 직렬화할 때, 스프링 Kafka가 자동으로 POJO/record로 변환해줘요. ' +
        'Confluent Schema Registry와 연동하면 스키마 버전 관리까지 자동화할 수 있어요.',
      pitfall:
        '역직렬화 설정이 맞지 않으면 에러가 발생해요. application.yml에 spring.kafka.consumer.value-deserializer를 org.springframework.kafka.support.serializer.JsonDeserializer로 지정하고, spring.kafka.consumer.properties.spring.json.trusted.packages를 설정해야 해요.',
    },
  },
  {
    id: 'msg-rabbit-reply',
    lang: 'java',
    title: '@RabbitListener로 응답 돌려주기',
    file: 'RpcServer.java',
    code: `import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.stereotype.Component;

@Component
public class RpcServer {

  @RabbitListener(queues = "calc.q")
  public String square(int n) {
    int result = n * n;
    System.out.println("[계산] " + n + " * " + n + " = " + result);
    return String.valueOf(result);
  }
}`,
    explain: {
      concept:
        '리스너가 값을 반환(return)하면, RabbitMQ가 그 값을 요청한 쪽으로 자동으로 응답해줘요. ' +
        '비동기 메시징을 RPC(원격 프로시저 호출)처럼 요청-응답 패턴으로 쓸 수 있게 해줘요. ' +
        '보낸 쪽은 RabbitTemplate.convertSendAndReceive()로 요청을 보내고 응답을 동기적으로 기다릴 수 있어요. ' +
        'REST API 호출과 달리 메시지 큐를 거치므로, 서버가 일시적으로 다운돼도 큐에 쌓인 요청이 유실되지 않는 장점이 있어요. ' +
        '이 패턴은 작업 분배(높은 계산 부하를 워커로 분산)나, 요청-응답이 필요한 마이크로서비스 간 통신에 적합해요.',
      terms: [
        { t: 'return String.valueOf(result)', d: '리스너가 반환한 값이 응답 메시지로 변환돼서 발신자에게 전달돼요. void면 응답 없이 처리만 해요.' },
        { t: 'int n (매개변수)', d: '메시지 본문이 int로 자동 변환돼서 전달돼요. MessageConverter가 타입 변환을 처리해요.' },
        { t: 'convertSendAndReceive', d: '발신 측에서 응답을 기다리는 RPC 스타일의 전송 메서드예요. 동기식으로 결과를 받을 수 있어요.' },
        { t: 'RPC over Messaging', d: '메시지 큐를 통해 요청-응답 패턴을 구현하는 방식이에요. RabbitMQ의 reply-to 속성을 활용해요.' },
      ],
      why:
        '비동기 메시징이지만 요청-응답 형태의 동기식 호출이 필요할 때 써요. 무거운 계산 작업을 별도 워커에 분산하면서도 결과는 받아야 할 때 유용해요.',
      expectedOutput:
        '[계산] 5 * 5 = 25',
      realWorldUsage:
        '실제 프로젝트에서 이미지 리사이징, PDF 생성, 복잡한 금융 계산처럼 무거운 작업을 RabbitMQ 큐로 보내고 결과를 기다리는 패턴으로 사용해요. ' +
        '마이크로서비스 간 동기 통신이 필요하지만 HTTP보다 안정성을 원할 때 선택해요.',
      pitfall:
        '발신자와 수신자의 직렬화/역직렬화 설정이 일치해야 해요. 한쪽은 JSON으로 보내고 다른 쪽은 String으로 받으려 하면 변환 에러가 발생해요. ' +
        '또한 응답이 너무 오래 걸리면 발신자가 타임아웃될 수 있으니, 장시간 작업에는 비동기 콜백 패턴을 고려하세요.',
    },
  },
  {
    id: 'msg-kafka-manual-ack',
    lang: 'java',
    title: '수동 커밋으로 메시지 처리',
    file: 'ManualAckListener.java',
    code: `import org.apache.kafka.clients.consumer.ConsumerRecord;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.kafka.support.Acknowledgment;
import org.springframework.stereotype.Component;

@Component
public class ManualAckListener {

  @KafkaListener(topics = "orders", groupId = "g1")
  public void listen(ConsumerRecord<String, String> record,
                     Acknowledgment ack) {
    System.out.println("[수신] offset=" + record.offset()
        + ", value=" + record.value());
    try {
      process(record.value());
      ack.acknowledge();
      System.out.println("[커밋] 오프셋 커밋 완료");
    } catch (Exception e) {
      System.out.println("[실패] 처리 중 오류: " + e.getMessage());
    }
  }

  private void process(String value) {
    System.out.println("[처리] 비즈니스 로직 실행: " + value);
  }
}`,
    explain: {
      concept:
        '기본적으로 @KafkaListener는 메시지를 받으면 자동으로 오프셋을 커밋(읽음 확인)해요. ' +
        '하지만 처리가 끝나기 전에 커밋되면, 처리 중 크래시가 발생했을 때 해당 메시지가 손실될 위험이 있어요. ' +
        'Acknowledgment를 매개변수로 받으면 수동 커밋 모드로 전환돼서, 비즈니스 로직이 완전히 성공한 후에만 ack.acknowledge()로 오프셋을 커밋할 수 있어요. ' +
        '이렇게 하면 메시지 손실을 방지할 수 있어요(AckMode.MANUAL). 실패 시에는 ack를 호출하지 않아서, 재시작 후 같은 오프셋부터 다시 읽을 수 있어요.',
      terms: [
        { t: 'Acknowledgment', d: 'Kafka 소비자의 오프셋 수동 커밋을 제어하는 스프링 인터페이스예요. acknowledge()로 커밋을 수행해요.' },
        { t: 'ack.acknowledge()', d: '현재 오프셋까지 성공적으로 처리했음을 Kafka에 알려줘요. 이 메시지까지는 다시 읽지 않아요.' },
        { t: '수동 커밋 (MANUAL)', d: 'ack.acknowledge()를 호출할 때만 오프셋을 커밋하는 모드예요. 애플리케이션이 커밋 시점을 완전히 통제해요.' },
        { t: '메시지 재처리', d: 'ack를 호출하지 않고 예외가 발생하면, 컨슈머 재시작 시 같은 메시지를 다시 읽어서 처리할 수 있어요.' },
      ],
      why:
        '금융 거래, 주문 처리처럼 메시지가 절대 손실되면 안 되는 경우에 써요. 처리 완료를 보장한 후에만 커밋해서 데이터 무결성을 지켜요.',
      expectedOutput:
        '[수신] offset=42, value=주문데이터\n' +
        '[처리] 비즈니스 로직 실행: 주문데이터\n' +
        '[커밋] 오프셋 커밋 완료',
      realWorldUsage:
        '실제 프로젝트에서 은행의 계좌 이체 이벤트, 전자상거래의 결제 완료 이벤트처럼 한 번만 정확히 처리돼야 하는 Exactly-Once 시맨틱을 구현할 때 수동 커밋을 사용해요.',
      pitfall:
        'ack.acknowledge()를 finally 블록에 두면 처리 실패 시에도 커밋되어 메시지가 손실돼요. 반드시 성공 경로(try 블록)에서만 호출해야 해요. ' +
        '또한 수동 커밋을 사용하려면 application.yml에서 spring.kafka.consumer.enable-auto-commit: false 와 AckMode.MANUAL을 설정해야 해요.',
    },
  },
  {
    id: 'msg-spring-listener-transactional',
    lang: 'java',
    title: '@TransactionalEventListener로 트랜잭션 후 처리',
    file: 'TxEventListener.java',
    code: `import org.springframework.stereotype.Component;
import org.springframework.transaction.event.TransactionPhase;
import org.springframework.transaction.event.TransactionalEventListener;

@Component
public class TxEventListener {

  @TransactionalEventListener(phase = TransactionPhase.AFTER_COMMIT)
  public void onCompleted(OrderPlaced event) {
    System.out.println("[커밋후] 트랜잭션 확정 완료: " + event.id());
  }
}`,
    explain: {
      concept:
        '@TransactionalEventListener는 @EventListener의 트랜잭션 안전 버전이에요. ' +
        'AFTER_COMMIT 단계에서 실행되므로, 이벤트를 발행한 트랜잭션이 완전히 커밋된 후에만 리스너가 호출돼요. ' +
        '만약 트랜잭션이 롤백되면 리스너는 아예 호출되지 않아요. 이건 "DB에는 저장됐는데 메일은 발송 안 됨" 같은 불일치를 막아줘요. ' +
        'AFTER_ROLLBACK 단계도 있어서, 실패 시 보상 작업을 할 수도 있어요. ' +
        '이 어노테이션이 필요한 이유는, 일반 @EventListener는 트랜잭션이 커밋되기 전에 실행돼서 DB 반영 전에 외부 시스템(메일, SMS)이 호출될 위험이 있기 때문이에요.',
      terms: [
        { t: '@TransactionalEventListener', d: '트랜잭션 상태에 따라 실행 시점을 제어하는 이벤트 리스너예요. 트랜잭션 커밋/롤백 후에 실행돼요.' },
        { t: 'phase = AFTER_COMMIT', d: '트랜잭션이 성공적으로 커밋된 직후에 실행돼요. DB에 데이터가 확실히 저장된 상태에서 후처리를 해요.' },
        { t: 'AFTER_ROLLBACK', d: '트랜잭션이 롤백된 후에 실행돼요. 실패 시 보상(알림, 로깅, 사후 처리)에 사용해요.' },
        { t: 'BEFORE_COMMIT', d: '트랜잭션 커밋 직전에 실행돼요. 커밋 전 마지막 검증이나 추가 데이터 저장에 사용할 수 있어요.' },
      ],
      why:
        '데이터베이스에 저장이 확실히 완료된 후에만 외부 시스템(메일, SMS, 푸시 알림)을 호출하려고 해요. 롤백된 가짜 데이터로 인한 사이드 이펙트를 원천 차단해요.',
      expectedOutput:
        '[커밋후] 트랜잭션 확정 완료: 12345',
      realWorldUsage:
        '실제 프로젝트에서 주문 생성 트랜잭션이 커밋된 후에만 메일 발송·푸시 알림·재고 시스템 연동을 하는 패턴에 사용해요. ' +
        'Outbox Pattern과 함께 쓰면 메시지 발행과 DB 저장을 원자적으로 처리할 수 있어서 데이터 일관성이 더욱 강력해져요.',
      pitfall:
        '이벤트를 publishEvent()로 발행하는 코드가 @Transactional 범위 밖에 있으면, 리스너가 절대 호출되지 않아요. ' +
        '트랜잭션 안에서 이벤트를 발행해야 AFTER_COMMIT 단계가 동작해요. 또한 기본 phase는 AFTER_COMMIT이라, 별도 지정이 없으면 커밋 후에만 실행돼요.',
    },
  },
];
