import type { Snippet } from '../../types';

export const messaging: Snippet[] = [
  {
    id: 'msg-kafka-producer-send',
    lang: 'java',
    title: 'KafkaProducer로 메시지 보내기',
    file: 'HelloProducer.java',
    code: `Properties props = new Properties();
props.put("bootstrap.servers", "localhost:9092");
props.put("key.serializer", StringSerializer.class.getName());
props.put("value.serializer", StringSerializer.class.getName());
try (KafkaProducer<String, String> producer = new KafkaProducer<>(props)) {
  producer.send(new ProducerRecord<>("hello", "k1", "안녕"));
}`,
    explain: {
      concept: 'KafkaProducer는 Kafka라는 우체국에 메시지를 보내는 도구예요. 메시지는 토픽이라는 우편함에 넣어져요.',
      terms: [
        { t: 'bootstrap.servers', d: 'Kafka 우체국 주소' },
        { t: 'KafkaProducer', d: '메시지 보내는 우편 배달부' },
        { t: 'ProducerRecord', d: '보낼 한 통의 편지' },
        { t: 'send', d: '편지를 우편함에 넣어요.' },
      ],
      why: '여러 시스템에 메시지를 비동기로 전달하려고 해요.',
      pitfall: 'serializer 설정을 빠뜨리면 전송이 안 돼요.',
    },
  },
  {
    id: 'msg-kafka-producer-callback',
    lang: 'java',
    title: 'KafkaProducer 콜백으로 성공 확인',
    file: 'CallbackProducer.java',
    code: `try (KafkaProducer<String, String> producer = new KafkaProducer<>(props)) {
  producer.send(new ProducerRecord<>("hello", "k1", "안녕"), (meta, e) -> {
    if (e != null) {
      e.printStackTrace();
      return;
    }
    System.out.println(meta.offset());
  });
}`,
    explain: {
      concept: '콜백은 "다 보냈어"라고 알려주는 전화예요. 보내고 나서 성공인지 실패인지 알 수 있어요.',
      terms: [
        { t: '(meta, e) -> ...', d: '보낸 뒤 결과를 알려주는 함수' },
        { t: 'meta', d: '보낸 위치 정보 (파티션, 오프셋)' },
        { t: 'meta.offset()', d: '이 메시지의 순서 번호' },
      ],
      why: '전송 실패를 그 자리에서 처리할 수 있어요.',
      pitfall: '콜백 안에서 예외를 삼키면 실패를 못 알아채요.',
    },
  },
  {
    id: 'msg-kafka-listener-basic',
    lang: 'java',
    title: '@KafkaListener 기본 수신',
    file: 'HelloListener.java',
    code: `@Component
public class HelloListener {

  @KafkaListener(topics = "hello", groupId = "g1")
  public void listen(String message) {
    System.out.println("received: " + message);
  }
}`,
    explain: {
      concept: '@KafkaListener는 우편함에 편지가 도착하면 자동으로 꺼내 읽어주는 우편함 담당자예요. 토픽을 지정하면 알아서 받아요.',
      terms: [
        { t: '@KafkaListener', d: '토픽을 구독하는 우편함 담당자' },
        { t: 'topics = "hello"', d: 'hello라는 우편함을 봐요.' },
        { t: 'groupId = "g1"', d: 'g1 그룹에 속한 소비자예요.' },
        { t: 'listen(message)', d: '편지가 오면 불려요.' },
      ],
      why: '메시지가 오면 자동으로 반응하는 코드를 만들 수 있어요.',
      pitfall: 'groupId를 안 정하면 자동으로 새 그룹이 생겨요.',
    },
  },
  {
    id: 'msg-kafka-listener-record',
    lang: 'java',
    title: '@KafkaListener로 레코드 통째로 받기',
    file: 'RecordListener.java',
    code: `@KafkaListener(topics = "hello", groupId = "g1")
public void listen(ConsumerRecord<String, String> record) {
  System.out.println(record.key());
  System.out.println(record.value());
  System.out.println(record.partition());
}`,
    explain: {
      concept: 'ConsumerRecord는 편지봉투 통째로 받는 거예요. 내용(value)뿐 아니라 키와 파티션 정보까지 볼 수 있어요.',
      terms: [
        { t: 'ConsumerRecord', d: '편지 봉투 통째로 받는 형태' },
        { t: 'record.key()', d: '이 편지의 키' },
        { t: 'record.value()', d: '이 편지의 내용' },
        { t: 'record.partition()', d: '어느 칸에 들어갔는지' },
      ],
      why: '키나 파티션 같은 메타 정보가 필요할 때 써요.',
      pitfall: 'value만 받는 것보다 코드가 길어져요.',
    },
  },
  {
    id: 'msg-kafka-listener-header',
    lang: 'java',
    title: '@KafkaListener로 헤더 읽기',
    file: 'HeaderListener.java',
    code: `@KafkaListener(topics = "orders", groupId = "g1")
public void listen(
    String payload,
    @Header("traceId") String traceId) {
  System.out.println(traceId + " " + payload);
}`,
    explain: {
      concept: '@Header는 편지 봉투 겉면의 메모를 꺼내는 거예요. 추적 ID 같은 부가 정보를 메시지와 함께 받을 수 있어요.',
      terms: [
        { t: '@Header', d: '헤더 값을 꺼내 주입해요.' },
        { t: 'traceId', d: '이 요청을 추적하는 표' },
        { t: 'payload', d: '편지의 본문' },
      ],
      why: '추적/인증 정보를 본문과 분리해 보낼 수 있어요.',
      pitfall: '헤더가 없으면 예외가 발생해요. null을 허용하려면 @Header(required = false)를 붙이세요.',
    },
  },
  {
    id: 'msg-kafka-template',
    lang: 'java',
    title: 'KafkaTemplate으로 보내기',
    file: 'TemplateProducer.java',
    code: `@Service
public class HelloService {

  private final KafkaTemplate<String, String> template;

  public HelloService(KafkaTemplate<String, String> template) {
    this.template = template;
  }

  public void send(String msg) {
    template.send("hello", msg);
  }
}`,
    explain: {
      concept: 'KafkaTemplate은 스프링이 쓰기 쉽게 만든 KafkaProducer 래퍼예요. 설정은 application.yml에서 하고 코드는 짧아져요.',
      terms: [
        { t: 'KafkaTemplate', d: '스프링용 카프카 발송기' },
        { t: 'template.send', d: '토픽에 메시지를 보내요.' },
        { t: 'CompletableFuture<SendResult>', d: 'send() 반환값 — 비동기 전송 결과' },
      ],
      why: '스프링 환경에서 프로듀서를 편하게 쓰려고 해요.',
      pitfall: '동기 전송이 필요하면 .get()을 붙여야 해요.',
    },
  },
  {
    id: 'msg-rabbit-template',
    lang: 'java',
    title: 'RabbitTemplate로 메시지 보내기',
    file: 'RabbitProducer.java',
    code: `@Service
public class NotifyService {

  private final RabbitTemplate rabbit;

  public NotifyService(RabbitTemplate rabbit) {
    this.rabbit = rabbit;
  }

  public void publish(String msg) {
    rabbit.convertAndSend("orders", "new", msg);
  }
}`,
    explain: {
      concept: 'RabbitTemplate은 토끼(RabbitMQ) 우체국에 메시지를 보내는 도구예요. exchange와 routingKey로 보낼 곳을 정해요.',
      terms: [
        { t: 'RabbitTemplate', d: 'RabbitMQ 발송기' },
        { t: 'convertAndSend', d: '객체를 변환해 보내요.' },
        { t: '"orders"', d: 'exchange 이름' },
        { t: '"new"', d: 'routing key (분류 표)' },
      ],
      why: '작업 큐나 알림을 비동기로 뿌리려고 해요.',
      pitfall: 'routing key를 잘못 쓰면 메시지가 안 가요.',
    },
  },
  {
    id: 'msg-rabbit-listener',
    lang: 'java',
    title: '@RabbitListener 기본 수신',
    file: 'OrderListener.java',
    code: `@Component
public class OrderListener {

  @RabbitListener(queues = "orders.queue")
  public void onMessage(String order) {
    System.out.println("processed: " + order);
  }
}`,
    explain: {
      concept: '@RabbitListener는 RabbitMQ 큐에서 메시지를 자동으로 꺼내 읽어요. 큐를 지정하면 편지가 오면 알아서 불려요.',
      terms: [
        { t: '@RabbitListener', d: '큐를 구독하는 우편함 담당자' },
        { t: 'queues = "orders.queue"', d: '이 큐를 봐요.' },
        { t: 'onMessage(order)', d: '편지가 오면 불려요.' },
      ],
      why: '주문/알림 같은 작업을 비동기로 처리하려고 해요.',
      pitfall: '큐가 없으면 시작부터 에러가 떠요.',
    },
  },
  {
    id: 'msg-rabbit-listener-binding',
    lang: 'java',
    title: '@RabbitListener로 exchange·binding 지정',
    file: 'FanoutListener.java',
    code: `@RabbitListener(bindings = @QueueBinding(
    value = @Queue(value = "alert.q", durable = "true"),
    exchange = @Exchange(value = "alerts", type = "fanout"),
    key = ""))
public void onAlert(String msg) {
  System.out.println("alert: " + msg);
}`,
    explain: {
      concept: '큐가 없으면 자동으로 만들게 할 수 있어요. exchange와 큐를 묶어(binding) 선언까지 한 번에 해요.',
      terms: [
        { t: '@QueueBinding', d: '큐와 exchange를 묶어 선언해요.' },
        { t: '@Queue', d: '큐를 만들어요.' },
        { t: '@Exchange(type = "fanout")', d: '모든 구독자에게 뿌리는 exchange예요.' },
        { t: 'key = ""', d: '라우팅 키 (fanout이라 안 써요).' },
      ],
      why: '배포만 하면 큐와 exchange가 자동으로 만들어져요.',
      pitfall: 'type을 안 정하면 direct로 만들어져요.',
    },
  },
  {
    id: 'msg-jms-template',
    lang: 'java',
    title: 'JmsTemplate로 큐에 보내기',
    file: 'JmsProducer.java',
    code: `@Service
public class JmsProducer {

  private final JmsTemplate jms;

  public JmsProducer(JmsTemplate jms) {
    this.jms = jms;
  }

  public void send(String text) {
    jms.convertAndSend("mailbox", text);
  }
}`,
    explain: {
      concept: 'JmsTemplate는 JMS 호환 큐에 메시지를 보내는 도구예요. JMS는 자바 진영 표준 메시지 규격이에요.',
      terms: [
        { t: 'JmsTemplate', d: 'JMS 발송기' },
        { t: 'convertAndSend', d: '객체를 변환해 보내요.' },
        { t: '"mailbox"', d: '목적지(큐) 이름' },
      ],
      why: 'ActiveMQ 같은 JMS 브로커와 통신하려고 해요.',
      pitfall: '브로커 연결 설정이 없으면 에러가 떠요.',
    },
  },
  {
    id: 'msg-jms-listener',
    lang: 'java',
    title: '@JmsListener로 수신',
    file: 'JmsConsumer.java',
    code: `@Component
public class JmsConsumer {

  @JmsListener(destination = "mailbox")
  public void onMessage(String text) {
    System.out.println("got: " + text);
  }
}`,
    explain: {
      concept: '@JmsListener는 JMS 큐를 구독하는 우편함 담당자예요. destination으로 큐 이름을 지정해요.',
      terms: [
        { t: '@JmsListener', d: 'JMS 큐를 구독하는 담당자' },
        { t: 'destination = "mailbox"', d: 'mailbox라는 큐를 봐요.' },
      ],
      why: 'JMS 큐에서 자동으로 메시지를 받으려고 해요.',
      pitfall: 'Spring Boot 없이 순수 Spring을 쓸 때는 @EnableJms를 직접 붙여야 해요. Spring Boot에서는 JMS 스타터가 자동 설정해줘요.',
    },
  },
  {
    id: 'msg-event-publisher',
    lang: 'java',
    title: 'ApplicationEventPublisher로 이벤트 발행',
    file: 'OrderService.java',
    code: `@Service
public class OrderService {

  private final ApplicationEventPublisher publisher;

  public OrderService(ApplicationEventPublisher publisher) {
    this.publisher = publisher;
  }

  public void place(String id) {
    publisher.publishEvent(new OrderPlaced(id, false));
  }
}`,
    explain: {
      concept: 'ApplicationEventPublisher는 같은 앱 안에서 "일 났어!"라고 방송하는 도구예요. 외부 큐 없이도 느슨하게 연결돼요.',
      terms: [
        { t: 'ApplicationEventPublisher', d: '앱 안 방송기' },
        { t: 'publishEvent', d: '이벤트를 방송해요.' },
        { t: 'OrderPlaced', d: '방송할 이벤트 (데이터)' },
      ],
      why: '한 일을 다른 곳에서 반응하게 만들되 강하게 묶지 않으려고 해요.',
      pitfall: '이벤트는 기본적으로 동기로 처리돼요.',
    },
  },
  {
    id: 'msg-event-listener',
    lang: 'java',
    title: '@EventListener로 이벤트 받기',
    file: 'OrderEventListener.java',
    code: `@Component
public class OrderEventListener {

  @EventListener
  public void onOrderPlaced(OrderPlaced event) {
    System.out.println("send mail for " + event.id());
  }
}`,
    explain: {
      concept: '@EventListener는 방송을 듣는 청취자예요. 이벤트가 발행되면 매개변수 타입을 보고 알맞은 리스너를 불러요.',
      terms: [
        { t: '@EventListener', d: '이벤트를 듣는 어노테이션' },
        { t: 'onOrderPlaced(event)', d: 'OrderPlaced 이벤트가 오면 불려요.' },
      ],
      why: '주문 후처리(메일/알림)를 주 로직과 분리할 수 있어요.',
      pitfall: '여러 리스너가 같은 이벤트를 받을 수 있어요.',
    },
  },
  {
    id: 'msg-event-conditional',
    lang: 'java',
    title: '@EventListener 조건부',
    file: 'VipListener.java',
    code: `@EventListener(condition = "#event.vip")
public void onVip(OrderPlaced event) {
  System.out.println("VIP reward for " + event.id());
}`,
    explain: {
      concept: 'condition은 이벤트의 일부 값만 골라 듣는 거예요. "VIP 주문일 때만 반응해라"처럼 조건을 달아요.',
      terms: [
        { t: 'condition = "#event.vip"', d: '이벤트의 vip가 true일 때만 불려요.' },
        { t: '#event', d: '이벤트 객체를 가리키는 표현' },
      ],
      why: '조건별로 다른 처리를 이벤트 하나로 처리할 수 있어요.',
      pitfall: '필드 이름이 다르면 조건이 안 먹혀요.',
    },
  },
  {
    id: 'msg-event-async',
    lang: 'java',
    title: '@Async로 이벤트 비동기 처리',
    file: 'AsyncListener.java',
    code: `@Component
public class AsyncListener {

  @Async
  @EventListener
  public void onOrderPlaced(OrderPlaced event) {
    System.out.println("async mail for " + event.id());
  }
}`,
    explain: {
      concept: '@Async를 붙이면 리스너가 다른 스레드에서 일해요. 주문 흐름을 막지 않고 느린 작업을 뒤로 미뤄요.',
      terms: [
        { t: '@Async', d: '다른 스레드에서 실행해요.' },
        { t: '@EventListener', d: '이벤트를 받아요.' },
      ],
      why: '메일/SMS처럼 느린 후처리를 논블로킹으로 돌리려고 해요.',
      pitfall: '@EnableAsync를 안 붙이면 그냥 동기로 돌아가요.',
    },
  },
  {
    id: 'msg-event-record',
    lang: 'java',
    title: '레코드로 이벤트 클래스 만들기',
    file: 'OrderPlaced.java',
    code: `public record OrderPlaced(String id, boolean vip) {
}`,
    explain: {
      concept: 'record는 데이터만 담는 짧은 클래스예요. 이벤트처럼 값만 전달할 때 아주 간결해요.',
      terms: [
        { t: 'record', d: '데이터 중심 클래스' },
        { t: 'id', d: '주문 ID' },
        { t: 'vip', d: 'VIP 여부' },
      ],
      why: '이벤트 데이터를 적은 코드로 표현할 수 있어요.',
      pitfall: '레코드는 불변이라 값을 바꿀 수 없어요.',
    },
  },
  {
    id: 'msg-kafka-listener-greeting',
    lang: 'java',
    title: 'Greeting 객체로 받는 리스너',
    file: 'GreetingListener.java',
    code: `@KafkaListener(topics = "greetings", groupId = "g1")
public void listen(Greeting greeting) {
  System.out.println(greeting.name() + " " + greeting.message());
}`,
    explain: {
      concept: '문자열 대신 객체로 바로 받을 수 있어요. 직렬화/역직렬화 설정이 맞으면 자동 변환돼요.',
      terms: [
        { t: 'Greeting', d: '받을 메시지 객체' },
        { t: 'greeting.name()', d: '레코드의 필드' },
      ],
      why: '문자열 파싱 없이 객체 그대로 다룰 수 있어요.',
      pitfall: '역직렬화 설정이 안 맞으면 에러가 떠요.',
    },
  },
  {
    id: 'msg-rabbit-reply',
    lang: 'java',
    title: '@RabbitListener로 응답 돌려주기',
    file: 'RpcServer.java',
    code: `@RabbitListener(queues = "calc.q")
public String square(int n) {
  return String.valueOf(n * n);
}`,
    explain: {
      concept: '리스너가 값을 돌려주면 보낸 쪽이 응답을 받아요. 전화를 걸고 답을 듣는 것과 같아요.',
      terms: [
        { t: 'square(int n)', d: '입력을 받아 제곱을 돌려줘요.' },
        { t: 'return String', d: '돌려주는 값이 응답이 돼요.' },
      ],
      why: 'RPC 형태로 요청/응답을 주고받을 수 있어요.',
      pitfall: '입력 메시지를 int로 변환할 수 없거나 응답을 직렬화할 수 없으면 에러가 발생해요. RPC 양쪽의 타입과 MessageConverter 설정이 일치해야 해요.',
    },
  },
  {
    id: 'msg-kafka-manual-ack',
    lang: 'java',
    title: '수동 커밋으로 메시지 처리',
    file: 'ManualAckListener.java',
    code: `@KafkaListener(topics = "orders", groupId = "g1")
public void listen(ConsumerRecord<String, String> record, Acknowledgment ack) {
  try {
    process(record.value());
    ack.acknowledge();
  } catch (Exception e) {
    // 재시도 또는 DLQ 전송 처리
    e.printStackTrace();
  }
}`,
    explain: {
      concept: '수동 커밋은 "이 편지 다 읽었어"라고 직접 확인 보내는 거예요. 처리가 끝난 뒤에만 커밋해 안전해요.',
      terms: [
        { t: 'Acknowledgment', d: '확인 도구' },
        { t: 'ack.acknowledge()', d: '처리 끝났다고 알려요.' },
      ],
      why: '메시지 손실을 막고 재처리를 확실히 하려고 해요.',
      pitfall: 'ack.acknowledge()를 finally 블록에 두면 처리 실패 시에도 커밋되어 메시지가 영구 손실돼요. 반드시 성공 경로에서만 호출하세요.',
    },
  },
  {
    id: 'msg-spring-listener-transactional',
    lang: 'java',
    title: '@TransactionalEventListener로 트랜잭션 후 처리',
    file: 'TxEventListener.java',
    code: `@Component
public class TxEventListener {

  @TransactionalEventListener(phase = TransactionPhase.AFTER_COMMIT)
  public void onCompleted(OrderPlaced event) {
    System.out.println("after commit: " + event.id());
  }
}`,
    explain: {
      concept: '@TransactionalEventListener는 트랜잭션이 안전하게 끝난 뒤에만 불려요. "결제 확정된 뒤에 메일 보내라"처럼 쓸 수 있어요.',
      terms: [
        { t: '@TransactionalEventListener', d: '트랜잭션 이후에만 듣는 리스너' },
        { t: 'phase = AFTER_COMMIT', d: '커밋 성공 뒤에 실행해요.' },
      ],
      why: '롤백된 작업에 대해 부작용(메일 발송 등)을 막으려고 해요.',
      pitfall: '이벤트 발행 코드가 트랜잭션 밖이면 불리지 않아요.',
    },
  },
];
