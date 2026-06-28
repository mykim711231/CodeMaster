import type { Snippet } from '../../types';

export const network: Snippet[] = [
  {
    id: 'net-socket-client',
    lang: 'java',
    title: 'Socket으로 서버에 연결',
    file: 'EchoClient.java',
    code: `import java.io.OutputStream;
import java.net.Socket;

try (Socket socket = new Socket("localhost", 8080)) {
  System.out.println("[실행] 서버 연결 시도 — localhost:8080");
  OutputStream out = socket.getOutputStream();
  out.write("hello\\n".getBytes());
  out.flush();
  System.out.println("[완료] 데이터 전송 완료");
}`,
    explain: {
      concept:
        'Socket은 내 컴퓨터가 다른 컴퓨터(서버)에 전화를 걸어 연결하는 도구예요. ' +
        '전화번호 대신 IP 주소와 포트 번호를 써서 상대방을 찾아가요. ' +
        '연결이 되면 getOutputStream()이라는 파이프를 통해 데이터를 바이트로 보내고, ' +
        'flush()로 파이프에 남은 데이터를 밀어내서 실제로 전송해요. ' +
        '실제 프로젝트에서는 DB 연결이나 외부 API 호출 전에 먼저 소켓 통신이 열리는 구조예요. ' +
        '네트워크 통신의 가장 밑바닥 개념이지만, 이걸 이해하면 HTTP 통신도 결국 소켓 위에서 도는 걸 알 수 있어요.',
      terms: [
        { t: 'Socket', d: '서버와의 연결을 만드는 전화기 역할을 해요. IP와 포트로 목적지를 지정해요.' },
        { t: 'new Socket("localhost", 8080)', d: '내 컴퓨터의 8080번 포트로 연결을 시도해요. 서버가 켜져 있어야 성공해요.' },
        { t: 'getOutputStream()', d: '서버로 데이터를 보내는 출력 파이프를 열어줘요. 여기에 바이트를 쓰면 전송돼요.' },
        { t: 'write() + flush()', d: 'write로 데이터를 버퍼에 담고, flush로 실제 네트워크로 밀어내서 보내요.' },
        { t: 'try-with-resources', d: 'try가 끝나면 소켓이 자동으로 닫혀요. 연결 종료 코드를 생략할 수 있어요.' },
      ],
      why:
        'TCP 기반 통신이 필요한 모든 곳에서 써요. HTTP 클라이언트 라이브러리들도 내부적으로는 Socket을 이용해 통신하고 있어요.',
      expectedOutput:
        '[실행] 서버 연결 시도 — localhost:8080\n' +
        '[완료] 데이터 전송 완료',
      realWorldUsage:
        '실제 프로젝트에서 레거시 TCP 서버와 통신하거나, 커스텀 프로토콜로 하드웨어 장비(센서, 프린터 등)에 명령을 보낼 때 Socket을 직접 생성해 연결해요. ' +
        '예를 들어 공장의 PLC 장비에 명령을 보내는 MES 시스템에서 이런 코드가 쓰여요.',
      pitfall:
        '연결이 안 되면 connect에서 무한정 멈출 수 있어요. Socket 생성 시 timeout을 함께 설정하는 게 좋아요. ' +
        '또한 flush()를 호출하지 않으면 데이터가 버퍼에 남아 상대방에게 전달되지 않아요.',
    },
  },
  {
    id: 'net-serversocket',
    lang: 'java',
    title: 'ServerSocket으로 문 열기',
    file: 'EchoServer.java',
    code: `import java.net.ServerSocket;
import java.net.Socket;

try (ServerSocket server = new ServerSocket(8080)) {
  System.out.println("[실행] 8080번 포트에서 대기 중...");
  Socket client = server.accept();
  System.out.println("[결과] 클라이언트 연결됨: " + client.getInetAddress());
}`,
    explain: {
      concept:
        'ServerSocket은 문을 열고 손님(클라이언트)이 오기를 기다리는 안내데스크예요. ' +
        '포트 번호 하나를 점유하고 앉아 있다가, 누군가 연결을 걸어오면 accept()가 그 연결을 받아서 Socket 객체로 돌려줘요. ' +
        '받은 Socket으로 데이터를 주고받을 수 있고, 그 사이 ServerSocket은 다시 다음 손님을 기다려요. ' +
        '이게 바로 모든 웹 서버(톰캣, Netty 등)의 가장 기초적인 동작 원리예요. ' +
        '실무에서는 이 ServerSocket을 직접 쓰는 대신 톰캣 같은 서블릿 컨테이너가 대신 관리해주지만, ' +
        '커스텀 TCP 서버를 만들 때는 여전히 직접 다뤄요.',
      terms: [
        { t: 'ServerSocket', d: '특정 포트를 열고 클라이언트 연결을 기다리는 서버 측 진입점이에요.' },
        { t: 'new ServerSocket(8080)', d: '8080번 포트를 열어요. 이미 사용 중이면 IOException이 발생해요.' },
        { t: 'accept()', d: '클라이언트가 연결될 때까지 블로킹하며 기다렸다가, 연결되면 Socket을 반환해요.' },
        { t: 'client.getInetAddress()', d: '연결된 클라이언트의 IP 주소를 확인할 수 있어요.' },
      ],
      why:
        '서버가 클라이언트의 연결을 받아들이는 출발점이에요. 모든 네트워크 서버는 이 accept() 패턴으로 시작해요.',
      expectedOutput:
        '[실행] 8080번 포트에서 대기 중...\n' +
        '[결과] 클라이언트 연결됨: /127.0.0.1',
      realWorldUsage:
        '실제 프로젝트에서 커스텀 TCP 프로토콜 서버(예: 게임 서버, IoT 장비 관제 서버)를 구축할 때 ServerSocket으로 기본 뼈대를 만들어요. ' +
        '게임 서버는 수천 명이 동시 접속하므로 accept() 후 각 클라이언트를 스레드에 할당해 처리해요.',
      pitfall:
        'accept()는 클라이언트가 올 때까지 현재 스레드를 블로킹해요. 단일 스레드에서 accept()만 호출하면 그동안 다른 일을 전혀 못 해요. ' +
        '또한 포트가 이미 사용 중이면 BindException이 발생해요.',
    },
  },
  {
    id: 'net-read-write',
    lang: 'java',
    title: 'Socket으로 글자 주고받기',
    file: 'LineClient.java',
    code: `import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.io.PrintWriter;
import java.net.Socket;

try (Socket socket = new Socket("localhost", 8080);
     BufferedReader in = new BufferedReader(
         new InputStreamReader(socket.getInputStream()));
     PrintWriter out = new PrintWriter(socket.getOutputStream(), true)) {
  System.out.println("[실행] ping 전송");
  out.println("ping");
  String reply = in.readLine();
  System.out.println("[결과] 서버 응답: " + reply);
}`,
    explain: {
      concept:
        '소켓 파이프에 Reader/Writer를 끼우면 바이트 대신 글자를 줄 단위로 주고받을 수 있어요. ' +
        '전화선에 번역기를 붙여서 한국어로 바로 대화하는 것과 같은 원리예요. ' +
        'BufferedReader는 버퍼를 두고 한 줄씩 읽어주는 도우미고, InputStreamReader는 바이트 스트림을 문자 스트림으로 변환해줘요. ' +
        'PrintWriter는 println()으로 줄 단위 쓰기를 편하게 해주고, 두 번째 인자 true를 주면 auto-flush가 켜져서 매 줄마다 자동으로 전송해요. ' +
        '이 패턴은 TCP 기반 텍스트 프로토콜(SMTP, POP3, Redis 등)의 기본 통신 방식이에요.',
      terms: [
        { t: 'BufferedReader', d: '내부 버퍼로 문자를 모아서 한 줄씩 읽어주는 도우미예요. readLine()으로 줄 단위 읽기가 가능해요.' },
        { t: 'InputStreamReader', d: '바이트 스트림을 문자 스트림으로 변환하는 다리 역할을 해요. 인코딩도 지정할 수 있어요.' },
        { t: 'PrintWriter(..., true)', d: '두 번째 인자 true는 auto-flush를 켜서 println 호출마다 자동으로 데이터를 전송해요.' },
        { t: 'readLine()', d: '줄바꿈 문자(\\n)까지 한 줄을 통째로 읽어와요. 데이터가 오지 않으면 블로킹돼요.' },
      ],
      why:
        '텍스트 기반 프로토콜에서는 줄 단위 통신이 가장 자연스러워요. HTTP도 요청 라인\\n헤더\\n\\n본문 구조로 되어 있어요.',
      expectedOutput:
        '[실행] ping 전송\n' +
        '[결과] 서버 응답: pong',
      realWorldUsage:
        '실제 프로젝트에서 SMTP 메일 서버에 명령을 보내거나, Redis 같은 key-value 저장소에 텍스트 명령을 전송할 때 이 패턴을 써요. ' +
        '레거시 시스템과 통합할 때도 줄 단위 텍스트 프로토콜이 많이 쓰여요.',
      pitfall:
        'PrintWriter의 auto-flush를 켜지 않으면 상대방이 데이터를 못 받아요. 반드시 생성자 두 번째 인자로 true를 전달하세요. ' +
        '또한 readLine()은 상대방이 줄바꿈을 보내지 않으면 영원히 블로킹돼요.',
    },
  },
  {
    id: 'net-socket-timeout',
    lang: 'java',
    title: 'Socket 연결/읽기 타임아웃',
    file: 'TimeoutClient.java',
    code: `import java.io.InputStream;
import java.net.InetSocketAddress;
import java.net.Socket;

Socket socket = new Socket();
System.out.println("[실행] connect 타임아웃 3초 설정");
socket.connect(new InetSocketAddress("localhost", 8080), 3000);
socket.setSoTimeout(5000);
System.out.println("[실행] read 타임아웃 5초 설정");
InputStream in = socket.getInputStream();
int b = in.read();
System.out.println("[결과] 읽은 바이트: " + b);`,
    explain: {
      concept:
        '타임아웃은 "이 시간이 지나면 그만 기다려"라는 알람 설정이에요. ' +
        '네트워크는 언제든 느려지거나 상대방이 응답하지 않을 수 있어서, 무한 대기로 프로그램이 멈추는 걸 막아줘요. ' +
        'connect()의 타임아웃은 연결 자체가 안 될 때를 대비한 것이고, setSoTimeout()은 연결은 됐지만 데이터가 안 올 때를 대비한 거예요. ' +
        '서로 다른 상황을 커버하기 때문에 둘 다 설정하는 게 안전해요. ' +
        '실무에서는 모든 네트워크 호출에 타임아웃을 거는 게 기본 방어 수칙이에요.',
      terms: [
        { t: 'connect(addr, 3000)', d: '3초(3000밀리초) 안에 연결이 완료되지 않으면 SocketTimeoutException을 던져요.' },
        { t: 'InetSocketAddress', d: 'IP 주소와 포트 번호를 하나로 묶은 목적지 객체예요. 호스트명+포트 조합으로 생성해요.' },
        { t: 'setSoTimeout(5000)', d: '데이터 읽기 대기 시간을 5초로 제한해요. 초과하면 SocketTimeoutException이 발생해요.' },
        { t: 'read()', d: '1바이트를 읽어와요. 타임아웃이 설정된 경우 지정된 시간 안에 데이터가 오지 않으면 예외가 발생해요.' },
      ],
      why:
        '서버가 느리거나 장애가 났을 때 클라이언트가 무한정 기다리지 않도록 하려고 해요. 사용자 경험과 시스템 안정성을 모두 지켜줘요.',
      expectedOutput:
        '[실행] connect 타임아웃 3초 설정\n' +
        '[실행] read 타임아웃 5초 설정\n' +
        '[결과] 읽은 바이트: 104',
      realWorldUsage:
        '실제 프로젝트에서 외부 결제 API나 타사 서비스와 통신할 때 반드시 연결 타임아웃과 읽기 타임아웃을 설정해요. ' +
        '장애가 전파되지 않도록 서킷 브레이커(resilience4j)와 함께 사용하는 게 일반적이에요.',
      pitfall:
        'setSoTimeout을 설정하지 않으면 read()가 영원히 블로킹될 수 있어요. 특히 상대방이 연결은 받았지만 데이터를 보내지 않는 "slowloris" 공격에 취약해져요.',
    },
  },
  {
    id: 'net-multithread-server',
    lang: 'java',
    title: '손님마다 스레드 배정 서버',
    file: 'ThreadServer.java',
    code: `import java.io.IOException;
import java.io.InputStream;
import java.net.ServerSocket;
import java.net.Socket;

try (ServerSocket server = new ServerSocket(8080)) {
  System.out.println("[실행] 멀티스레드 서버 시작 — port: 8080");
  while (true) {
    Socket client = server.accept();
    System.out.println("[연결] 클라이언트 접속: " + client.getInetAddress());
    new Thread(() -> {
      try (InputStream in = client.getInputStream()) {
        in.transferTo(client.getOutputStream());
        System.out.println("[완료] 에코 처리 완료");
      } catch (IOException e) {
        System.out.println("[에러] " + e.getMessage());
      }
    }).start();
  }
}`,
    explain: {
      concept:
        '손님이 올 때마다 직원(스레드)을 한 명씩 붙여주는 식당 서빙 방식이에요. ' +
        '한 손님이 오래 걸려도 다른 손님은 기다리지 않고 각자 전담 직원이 처리해줘요. ' +
        'accept()로 새 연결을 받을 때마다 new Thread()로 새 스레드를 생성하고, start()로 실행을 시작해요. ' +
        '스레드 안에서는 클라이언트가 보낸 데이터를 그대로 돌려주는 에코(echo) 역할을 해요. ' +
        '이 방식은 간단하지만, 손님이 수천 명이 되면 스레드가 너무 많이 생겨서 메모리가 고갈될 수 있어요. ' +
        '실무에서는 이 한계를 극복하기 위해 스레드풀이나 NIO(비동기) 방식을 사용해요.',
      terms: [
        { t: 'while (true)', d: '서버가 종료될 때까지 무한히 반복하며 새로운 클라이언트 연결을 기다려요.' },
        { t: 'accept()', d: '클라이언트 연결을 받아 Socket을 반환해요. 연결이 올 때까지 현재 스레드를 블로킹해요.' },
        { t: 'new Thread(() -> {...})', d: '람다로 작업 내용을 정의한 새 스레드를 생성해요. 각 클라이언트마다 하나씩 만들어져요.' },
        { t: 'start()', d: '생성된 스레드를 실제로 실행 시작해요. start()를 호출해야 run()이 새 스레드에서 동작해요.' },
        { t: 'transferTo()', d: 'InputStream의 내용을 OutputStream으로 그대로 복사해요. Java 9부터 추가된 메서드예요.' },
      ],
      why:
        '여러 클라이언트를 동시에 처리할 수 있어서 단일 스레드 서버의 한계(앞 손님이 끝날 때까지 뒷손님 대기)를 극복해요.',
      expectedOutput:
        '[실행] 멀티스레드 서버 시작 — port: 8080\n' +
        '[연결] 클라이언트 접속: /127.0.0.1\n' +
        '[완료] 에코 처리 완료',
      realWorldUsage:
        '실제 프로젝트에서 초기 버전의 톰캣도 이와 같은 Thread-per-Connection 모델로 동작했어요. ' +
        '지금은 NIO 커넥터로 진화했지만, 간단한 내부 도구나 테스트용 서버를 빠르게 만들 때는 여전히 유용한 패턴이에요.',
      pitfall:
        '클라이언트 수가 폭증하면 스레드도 그만큼 늘어나서 OutOfMemoryError가 발생할 수 있어요. ' +
        '실무에서는 ExecutorService로 스레드 수를 제한하거나 NIO(Java NIO, Netty)로 전환해야 해요.',
    },
  },
  {
    id: 'net-socket-options',
    lang: 'java',
    title: '소켓 옵션 설정',
    file: 'TunedSocket.java',
    code: `import java.net.Socket;

Socket socket = new Socket("localhost", 8080);
socket.setTcpNoDelay(true);
socket.setKeepAlive(true);
socket.setSendBufferSize(8192);
socket.setReceiveBufferSize(8192);
System.out.println("[설정] TCP_NODELAY=true, KeepAlive=true, 버퍼=8192");`,
    explain: {
      concept:
        '소켓 옵션은 전화기의 통화 품질 설정과 같아요. Nagle 알고리즘(TCP_NODELAY)을 끄면 작은 데이터도 지연 없이 바로 전송되고, ' +
        'KeepAlive를 켜면 연결이 살아있는지 주기적으로 확인해서 끊긴 연결을 감지해요. ' +
        '버퍼 크기(send/receive buffer)는 데이터를 담는 통의 크기를 조절해서 처리량을 최적화해요. ' +
        '이런 옵션들은 실시간성이 중요한 게임 서버나 금융 트레이딩 시스템에서 핵심적인 튜닝 포인트예요. ' +
        '기본값으로도 잘 동작하지만, 서비스 특성에 맞게 조절하면 응답 속도가 크게 개선될 수 있어요.',
      terms: [
        { t: 'setTcpNoDelay(true)', d: 'Nagle 알고리즘을 비활성화해서 작은 패킷도 버퍼링 없이 즉시 전송해요. 지연 시간이 줄어들어요.' },
        { t: 'setKeepAlive(true)', d: 'OS가 주기적으로 연결 상태를 확인해요. 일정 시간 데이터가 없으면 probe 패킷을 보내 끊김을 감지해요.' },
        { t: 'setSendBufferSize(8192)', d: '송신 버퍼 크기를 8KB로 설정해요. 크면 한 번에 많은 데이터를 보낼 수 있어 처리량이 올라가요.' },
        { t: 'setReceiveBufferSize(8192)', d: '수신 버퍼 크기를 8KB로 설정해요. 네트워크 상황에 맞게 TCP 윈도우 크기에도 영향을 줘요.' },
      ],
      why:
        '네트워크 통신의 지연 시간과 처리량을 서비스 특성에 맞게 조절하려고 해요. 기본 설정만으로는 최적의 성능을 내기 어려울 수 있어요.',
      expectedOutput:
        '[설정] TCP_NODELAY=true, KeepAlive=true, 버퍼=8192',
      realWorldUsage:
        '실제 프로젝트에서 게임 서버는 TCP_NODELAY를 켜서 입력 지연을 최소화하고, 금융 트레이딩 시스템은 버퍼 크기를 튜닝해 초당 수천 건의 주문을 처리해요. ' +
        'REST API 서버에서도 KeepAlive로 불량 커넥션을 정리해 커넥션 풀을 건강하게 유지해요.',
      pitfall:
        '버퍼 크기를 무작정 키운다고 성능이 좋아지지 않아요. 네트워크 대역폭과 시스템 메모리를 고려해 적절한 값을 설정해야 해요. ' +
        'TCP_NODELAY를 끄면(Nagle 활성화) 작은 패킷이 모일 때까지 지연되어 실시간성이 떨어질 수 있어요.',
    },
  },
  {
    id: 'net-udp-send',
    lang: 'java',
    title: 'UDP로 데이터 보내기',
    file: 'UdpSender.java',
    code: `import java.net.DatagramPacket;
import java.net.DatagramSocket;
import java.net.InetAddress;

try (DatagramSocket socket = new DatagramSocket()) {
  byte[] data = "ping".getBytes();
  InetAddress addr = InetAddress.getByName("localhost");
  DatagramPacket packet = new DatagramPacket(data, data.length, addr, 9090);
  System.out.println("[실행] UDP 패킷 전송 — 대상: 9090");
  socket.send(packet);
  System.out.println("[완료] 패킷 전송 완료");
}`,
    explain: {
      concept:
        'UDP는 우편 엽서처럼 "보내고 확인 안 하는" 방식이에요. 받는 사람이 실제로 받았는지 확인하지 않고 그냥 보내요. ' +
        'TCP와 달리 연결 설정 과정이 없어서 아주 빠르지만, 패킷이 유실되거나 순서가 뒤바뀔 수 있어요. ' +
        'DatagramSocket은 UDP 통신을 위한 우체통이고, DatagramPacket은 데이터를 담는 엽서 봉투예요. ' +
        '보낼 데이터, 길이, 목적지 주소, 포트를 봉투에 담아 send()로 전송해요. ' +
        '실시간 스트리밍(영상·음성), 온라인 게임의 위치 동기화처럼 "약간의 손실은 괜찮지만 속도가 중요"할 때 UDP를 써요.',
      terms: [
        { t: 'DatagramSocket', d: 'UDP 통신을 위한 소켓이에요. TCP와 달리 연결 수립 없이 바로 데이터를 주고받아요.' },
        { t: 'InetAddress.getByName()', d: '호스트명(예: localhost)을 IP 주소 객체로 변환해줘요. DNS 조회가 발생할 수 있어요.' },
        { t: 'DatagramPacket', d: '데이터, 길이, 목적지 주소, 포트를 묶어 담는 엽서 봉투 역할을 해요.' },
        { t: 'send(packet)', d: '엽서를 네트워크로 발송해요. 비동기로 동작하며, 성공 여부를 확인하지 않아요.' },
      ],
      why:
        '속도가 가장 중요하고 일부 데이터 유실을 허용할 수 있는 상황에서 써요. TCP의 3-way 핸드셰이크 오버헤드가 부담스러울 때 선택해요.',
      expectedOutput:
        '[실행] UDP 패킷 전송 — 대상: 9090\n' +
        '[완료] 패킷 전송 완료',
      realWorldUsage:
        '실제 프로젝트에서 화상 회의(Zoom, WebRTC)는 UDP로 영상 데이터를 전송해요. ' +
        '온라인 게임에서 플레이어 위치 동기화도 UDP로 수십 ms마다 전송하고, 중간에 한두 개 유실돼도 다음 패킷이 보정해줘요. ' +
        'DNS 조회도 기본적으로 UDP(53번 포트)로 동작해요.',
      pitfall:
        'UDP는 패킷 도착 순서와 유실을 전혀 보장하지 않아요. 파일 전송처럼 데이터 무결성이 중요한 경우에는 반드시 TCP를 써야 해요. ' +
        '또한 DatagramPacket의 크기가 MTU(보통 1500바이트)를 넘으면 단편화(fragmentation)가 발생해 유실 확률이 높아져요.',
    },
  },
  {
    id: 'net-udp-receive',
    lang: 'java',
    title: 'UDP로 데이터 받기',
    file: 'UdpReceiver.java',
    code: `import java.net.DatagramPacket;
import java.net.DatagramSocket;

try (DatagramSocket socket = new DatagramSocket(9090)) {
  byte[] buf = new byte[1024];
  DatagramPacket packet = new DatagramPacket(buf, buf.length);
  System.out.println("[실행] UDP 수신 대기 — port: 9090");
  socket.receive(packet);
  String msg = new String(packet.getData(), 0, packet.getLength());
  System.out.println("[결과] 수신 메시지: " + msg);
}`,
    explain: {
      concept:
        'UDP 받는 쪽은 빈 상자(buf)를 미리 준비해두고 엽서(DatagramPacket)가 도착하기를 기다려요. ' +
        'receive()는 데이터가 올 때까지 블로킹되며, 패킷이 도착하면 buf에 데이터를 채워줘요. ' +
        'packet.getData()로 받은 바이트 배열 전체를 읽고, getLength()로 실제로 받은 바이트 수를 확인해서 String으로 변환해요. ' +
        'getData()는 buf 전체(1024바이트)를 반환하지만, 실제 유효 데이터는 getLength()만큼이라는 점이 중요해요. ' +
        '수신 측은 미리 포트를 열고 대기해야 해서 보통 서버 역할을 해요.',
      terms: [
        { t: 'new DatagramSocket(9090)', d: '9090번 포트를 열고 UDP 패킷 수신을 대기해요. 보내는 쪽도 같은 포트로 지정해야 해요.' },
        { t: 'new byte[1024]', d: '데이터를 담을 버퍼를 1024바이트 크기로 준비해요. 보내는 패킷보다 작으면 데이터가 잘려요.' },
        { t: 'receive(packet)', d: '패킷이 도착할 때까지 블로킹하며 기다려요. 도착하면 packet의 버퍼에 데이터가 채워져요.' },
        { t: 'getLength()', d: '실제 수신된 바이트 수를 반환해요. buf 크기가 1024라도 실제 데이터는 더 작을 수 있어요.' },
      ],
      why:
        'UDP로 전송된 메시지를 받으려면 미리 포트를 열고 receive()로 대기해야 해요. 클라이언트가 보내기 전에 서버가 먼저 준비돼 있어야 해요.',
      expectedOutput:
        '[실행] UDP 수신 대기 — port: 9090\n' +
        '[결과] 수신 메시지: ping',
      realWorldUsage:
        '실제 프로젝트에서 IoT 센서가 주기적으로 온도·습도 데이터를 UDP로 뿌리면, 수집 서버가 이 코드로 받아서 DB에 저장해요. ' +
        '로그 수집기(예: syslog 서버)도 UDP 514번 포트에서 이와 같은 방식으로 로그를 받아요.',
      pitfall:
        '버퍼 크기가 보내는 패킷보다 작으면 데이터가 잘려서 손실돼요. ' +
        '또한 receive()는 영원히 블로킹될 수 있으므로 setSoTimeout()으로 타임아웃을 설정하는 게 안전해요.',
    },
  },
  {
    id: 'net-nio-bytebuffer',
    lang: 'java',
    title: 'NIO ByteBuffer 읽고 쓰기',
    file: 'BufferDemo.java',
    code: `import java.nio.ByteBuffer;

ByteBuffer buf = ByteBuffer.allocate(16);
System.out.println("[실행] ByteBuffer 16바이트 할당 — position: " + buf.position());
buf.putInt(42);
buf.putChar('A');
System.out.println("[실행] putInt(42), putChar('A') 완료 — position: " + buf.position());
buf.flip();
int n = buf.getInt();
char c = buf.getChar();
System.out.println("[결과] n=" + n + ", c=" + c);`,
    explain: {
      concept:
        'ByteBuffer는 데이터를 담는 그릇이에요. position, limit, capacity라는 세 개의 커서로 쓰기/읽기 위치를 관리해요. ' +
        'put 계열 메서드로 데이터를 쓰면 position이 앞으로 이동하고, flip()을 호출하면 쓰기 모드에서 읽기 모드로 전환돼요. ' +
        '이는 녹음 테이프를 다 녹음하고 되감은 뒤 재생 모드로 바꾸는 것과 똑같은 원리예요. ' +
        'ByteBuffer는 NIO(New I/O)의 핵심 클래스로, Channel을 통해 파일이나 네트워크로 데이터를 주고받을 때 기본 운반 단위가 돼요. ' +
        'allocate()는 JVM 힙 메모리에, allocateDirect()는 네이티브 메모리에 버퍼를 만들어요.',
      terms: [
        { t: 'ByteBuffer.allocate(16)', d: 'JVM 힙에 16바이트 크기의 버퍼를 생성해요. position=0, limit=capacity=16 상태로 시작해요.' },
        { t: 'putInt(42)', d: '현재 position에 4바이트 int 값을 쓰고 position을 4만큼 앞으로 이동시켜요.' },
        { t: 'flip()', d: '쓰기 모드를 읽기 모드로 전환해요. limit=position, position=0으로 재설정돼요.' },
        { t: 'getInt()', d: '현재 position에서 4바이트 int 값을 읽고 position을 4만큼 이동시켜요. flip 후에 호출해야 해요.' },
      ],
      why:
        'NIO 프로그래밍에서 데이터를 읽고 쓰는 기본 단위예요. Channel과 Selector를 사용할 때 ByteBuffer 없이는 아무것도 할 수 없어요.',
      expectedOutput:
        '[실행] ByteBuffer 16바이트 할당 — position: 0\n' +
        '[실행] putInt(42), putChar(\'A\') 완료 — position: 6\n' +
        '[결과] n=42, c=A',
      realWorldUsage:
        '실제 프로젝트에서 Netty, Vert.x 같은 NIO 기반 프레임워크의 내부 구현은 모두 ByteBuffer로 데이터를 주고받아요. ' +
        '고성능 네트워크 서버에서 메모리 할당을 최소화하기 위해 ByteBuffer 풀(pool)을 만들어 재사용하는 기법도 흔해요.',
      pitfall:
        'flip()을 호출하지 않고 get 계열 메서드를 호출하면 position이 limit을 넘어 BufferUnderflowException이 발생해요. ' +
        '또한 put한 만큼만 읽어야 하는데, get의 순서나 타입을 잘못 맞추면 데이터가 뒤틀려서 읽혀요.',
    },
  },
  {
    id: 'net-nio-filechannel',
    lang: 'java',
    title: 'NIO FileChannel로 파일 복사',
    file: 'FileCopy.java',
    code: `import java.nio.channels.FileChannel;
import java.nio.file.Path;
import java.nio.file.StandardOpenOption;

try (FileChannel in = FileChannel.open(Path.of("a.txt"));
     FileChannel out = FileChannel.open(Path.of("b.txt"),
         StandardOpenOption.CREATE,
         StandardOpenOption.WRITE,
         StandardOpenOption.TRUNCATE_EXISTING)) {
  long size = in.size();
  System.out.println("[실행] 파일 복사 시작 — 크기: " + size + " bytes");
  long transferred = in.transferTo(0, size, out);
  System.out.println("[완료] 복사된 바이트: " + transferred);
}`,
    explain: {
      concept:
        'FileChannel은 파일과 직접 연결된 고속 파이프예요. 기존 FileInputStream/FileOutputStream보다 훨씬 효율적으로 데이터를 전송할 수 있어요. ' +
        'transferTo()는 OS 레벨에서 데이터를 직접 복사해서 JVM 버퍼를 거치지 않아 대용량 파일도 빠르게 처리해요 (제로 카피). ' +
        'open()에 넘기는 옵션으로 CREATE(없으면 생성), WRITE(쓰기 권한), TRUNCATE_EXISTING(기존 내용 지우기)를 조합해요. ' +
        'Path.of()는 Java 11+에서 파일 경로를 표현하는 현대적인 방식이에요. ' +
        '파일을 통째로 복사할 때는 Files.copy()가 더 간단하지만, 파일의 특정 구간만 복사하거나 네트워크 채널과 조합할 때 FileChannel이 강력해요.',
      terms: [
        { t: 'FileChannel.open(Path.of(...))', d: '파일을 읽기 또는 쓰기 모드로 열어서 채널을 생성해요. 옵션으로 동작 방식을 제어해요.' },
        { t: 'StandardOpenOption.CREATE', d: '파일이 없으면 새로 만들어요. 있으면 그대로 열고, TRUNCATE_EXISTING과 함께 쓰면 내용을 지워요.' },
        { t: 'StandardOpenOption.TRUNCATE_EXISTING', d: '파일이 이미 존재하면 내용을 길이 0으로 비우고 처음부터 써요.' },
        { t: 'transferTo(0, size, out)', d: 'in 채널의 0번 위치부터 size만큼 out 채널로 직접 전송해요. OS의 sendfile() 시스템 콜을 활용해요.' },
      ],
      why:
        '대용량 파일을 빠르게 복사하거나, 파일의 특정 영역만 네트워크로 전송할 때 써요. 제로 카피 덕분에 CPU 사용량도 적어요.',
      expectedOutput:
        '[실행] 파일 복사 시작 — 크기: 4096 bytes\n' +
        '[완료] 복사된 바이트: 4096',
      realWorldUsage:
        '실제 프로젝트에서 정적 파일 서버(Nginx 유사)나 대용량 로그 파일 아카이브 시스템을 구현할 때 FileChannel.transferTo()를 써서 디스크 I/O를 최적화해요. ' +
        'Tomcat도 정적 리소스 서빙 시 내부적으로 FileChannel을 활용한 제로 카피 전송을 해요.',
      pitfall:
        'TRUNCATE_EXISTING이 없으면 대상 파일에 기존 데이터가 뒤에 남아서 파일이 손상될 수 있어요. 예를 들어 a.txt가 b.txt보다 작으면 b.txt의 뒷부분이 그대로 남아요. ' +
        '또한 transferTo()가 항상 전체 데이터를 한 번에 전송한다고 보장되지 않아서, 루프로 잔여 데이터를 처리해야 할 수도 있어요.',
    },
  },
  {
    id: 'net-nio-selector',
    lang: 'java',
    title: 'NIO Selector로 여러 채널 감시',
    file: 'SelectorDemo.java',
    code: `import java.net.InetSocketAddress;
import java.nio.channels.SelectionKey;
import java.nio.channels.Selector;
import java.nio.channels.ServerSocketChannel;
import java.nio.channels.SocketChannel;
import java.util.Iterator;

Selector selector = Selector.open();
ServerSocketChannel server = ServerSocketChannel.open();
server.configureBlocking(false);
server.bind(new InetSocketAddress(8080));
server.register(selector, SelectionKey.OP_ACCEPT);
System.out.println("[실행] Selector 서버 시작 — port: 8080");
while (true) {
  int ready = selector.select();
  if (ready == 0) continue;
  Iterator<SelectionKey> keys = selector.selectedKeys().iterator();
  while (keys.hasNext()) {
    SelectionKey key = keys.next();
    if (key.isAcceptable()) {
      ServerSocketChannel srv = (ServerSocketChannel) key.channel();
      SocketChannel ch = srv.accept();
      if (ch != null) {
        ch.configureBlocking(false);
        ch.register(selector, SelectionKey.OP_READ);
        System.out.println("[연결] 새 클라이언트 — " + ch.getRemoteAddress());
      }
    }
    keys.remove();
  }
}`,
    explain: {
      concept:
        'Selector는 한 명의 경비원이 여러 문을 동시에 감시하는 CCTV 관제실과 같아요. ' +
        '한 스레드에서 수백, 수천 개의 연결을 감시할 수 있어서 스레드 자원을 획기적으로 절약해요. ' +
        '채널을 논블로킹 모드로 설정하고 Selector에 등록하면, select()가 이벤트(연결 요청, 데이터 도착 등)가 발생할 때만 깨어나요. ' +
        'selectedKeys()로 이벤트가 발생한 채널 목록을 가져와서 반복 처리하고, 처리한 키는 반드시 remove()로 제거해야 해요. ' +
        '이 패턴이 Netty, Tomcat NIO 커넥터, 리액터 패턴의 근간이에요.',
      terms: [
        { t: 'Selector.open()', d: '다중 채널 감시자(Selector)를 생성해요. OS의 epoll/kqueue 기반으로 동작해요.' },
        { t: 'configureBlocking(false)', d: '채널을 논블로킹 모드로 설정해요. 블로킹 채널은 Selector에 등록할 수 없어요.' },
        { t: 'register(selector, OP_ACCEPT)', d: '채널을 Selector의 감시 대상으로 등록하고, 감시할 이벤트 종류를 지정해요.' },
        { t: 'select()', d: '등록된 채널 중 하나라도 이벤트가 발생할 때까지 블로킹하며 대기해요. 준비된 채널 수를 반환해요.' },
        { t: 'selectedKeys()', d: '이벤트가 발생한 채널들의 SelectionKey 집합을 반환해요. 처리 후 remove()로 정리해야 해요.' },
      ],
      why:
        '스레드를 적게 쓰면서도 많은 클라이언트를 동시에 처리하려고 해요. C10K 문제(1만 동시 접속)를 해결하는 핵심 기술이에요.',
      expectedOutput:
        '[실행] Selector 서버 시작 — port: 8080\n' +
        '[연결] 새 클라이언트 — /127.0.0.1:54321',
      realWorldUsage:
        '실제 프로젝트에서 모든 논블로킹 네트워크 프레임워크(Netty, Vert.x, Undertow)는 내부적으로 Java NIO Selector를 기반으로 동작해요. ' +
        'Tomcat의 NIO 커넥터도 Selector를 이용해 수천 개의 keep-alive 연결을 단 몇 개의 스레드로 관리해요.',
      pitfall:
        'selectedKeys()에서 꺼낸 SelectionKey를 처리한 후 반드시 remove()로 제거해야 해요. 제거하지 않으면 다음 select() 루프에서 같은 키가 계속 반복 처리돼서 무한 루프에 빠질 수 있어요. Iterator로 순회하면서 remove()하는 게 안전한 패턴이에요.',
    },
  },
  {
    id: 'net-nio-socketchannel',
    lang: 'java',
    title: 'NIO SocketChannel 비동기 클라이언트',
    file: 'NioClient.java',
    code: `import java.net.InetSocketAddress;
import java.nio.ByteBuffer;
import java.nio.channels.SocketChannel;

SocketChannel ch = SocketChannel.open();
ch.configureBlocking(false);
System.out.println("[실행] 논블로킹 연결 시도");
ch.connect(new InetSocketAddress("localhost", 8080));
while (!ch.finishConnect()) {
  System.out.println("[대기] 연결 중...");
  Thread.sleep(100);
}
System.out.println("[완료] 연결 성공");
ByteBuffer buf = ByteBuffer.wrap("hi".getBytes());
ch.write(buf);
System.out.println("[전송] 데이터 전송 완료");`,
    explain: {
      concept:
        'SocketChannel의 논블로킹 모드는 연결이 완료될 때까지 기다리지 않고 다른 일을 할 수 있게 해줘요. ' +
        'connect()를 호출하면 연결 시도만 하고 바로 반환되며, finishConnect()가 true를 반환할 때까지 폴링으로 확인해요. ' +
        '연결이 완료되면 ByteBuffer.wrap()으로 바이트 배열을 감싸서 write()로 데이터를 전송해요. ' +
        '이 패턴은 하나의 스레드로 여러 연결을 동시에 관리할 수 있게 해주며, Selector와 결합하면 진정한 비동기 I/O가 완성돼요. ' +
        '다만 단순한 연결 시나리오에서는 blocking 모드의 Socket이 더 코드가 간결해요.',
      terms: [
        { t: 'configureBlocking(false)', d: '논블로킹 모드로 설정해요. 이 모드에서 connect/read/write가 즉시 반환돼요.' },
        { t: 'finishConnect()', d: '연결 시도가 완료됐는지 확인해요. 완료되면 true를 반환하고, 그 전까지는 false예요.' },
        { t: 'ByteBuffer.wrap(byte[])', d: '기존 바이트 배열을 ByteBuffer로 감싸요. 별도 메모리 할당 없이 데이터를 전송할 수 있어요.' },
        { t: 'write(buf)', d: '버퍼의 내용을 채널로 전송해요. 논블로킹 모드에서는 일부만 전송될 수 있어서 반복 처리가 필요할 수 있어요.' },
      ],
      why:
        '연결 대기 시간이 긴 상황에서도 스레드를 낭비하지 않고 동시에 여러 연결을 관리하려고 해요. 클라이언트 풀을 논블로킹으로 운영할 때 써요.',
      expectedOutput:
        '[실행] 논블로킹 연결 시도\n' +
        '[대기] 연결 중...\n' +
        '[완료] 연결 성공\n' +
        '[전송] 데이터 전송 완료',
      realWorldUsage:
        '실제 프로젝트에서 API 게이트웨이가 수백 개의 백엔드 서비스에 동시에 요청을 보내야 할 때, 논블로킹 클라이언트로 스레드 풀 지수를 줄여요. ' +
        'Spring WebClient(Reactor Netty)도 내부적으로 이와 같은 NIO SocketChannel을 사용해요.',
      pitfall:
        'finishConnect()가 false인 동안 write()를 호출하면 NotYetConnectedException이 발생해요. 반드시 연결 완료를 먼저 확인해야 해요. ' +
        '또한 논블로킹 write()는 버퍼 전체를 한 번에 전송한다고 보장되지 않아서, 잔여 데이터를 루프로 처리해야 할 수 있어요.',
    },
  },
  {
    id: 'net-twr-socket',
    lang: 'java',
    title: 'try-with-resources로 자동 닫기',
    file: 'SafeClient.java',
    code: `import java.io.DataOutputStream;
import java.net.Socket;

try (Socket socket = new Socket("localhost", 8080);
     DataOutputStream out = new DataOutputStream(socket.getOutputStream())) {
  System.out.println("[실행] DataOutputStream으로 UTF 전송");
  out.writeUTF("hello");
  out.flush();
  System.out.println("[완료] 데이터 전송 완료");
}`,
    explain: {
      concept:
        'try-with-resources는 다 쓴 도구를 자동으로 정리해주는 기능이에요. ' +
        'try 괄호 안에 선언된 자원(AutoCloseable 구현체)은 try 블록이 끝날 때 자동으로 close()가 호출돼요. ' +
        '소켓, 스트림, DB 연결처럼 사용 후 반드시 닫아야 하는 자원을 안전하게 관리할 수 있어서 finally 블록에 명시적으로 close()를 쓰지 않아도 돼요. ' +
        '여러 자원을 세미콜론(;)으로 구분해서 나열할 수 있고, 선언 순서의 역순으로 닫혀요. ' +
        'DataOutputStream은 Java 기본형 데이터(int, long, UTF 문자열 등)를 이식성 있는 바이너리 형식으로 전송하는 도구예요.',
      terms: [
        { t: 'try (...)', d: '괄호 안의 AutoCloseable 자원들이 블록 종료 시 자동으로 close() 호출돼요.' },
        { t: 'DataOutputStream', d: 'int, double, UTF 문자열 등 Java 기본형을 바이너리로 직렬화해서 전송하는 출력 스트림이에요.' },
        { t: 'writeUTF(str)', d: '문자열을 UTF-8 변형 인코딩으로 길이 정보와 함께 전송해요. 받는 쪽은 readUTF()로 읽어요.' },
        { t: 'flush()', d: '버퍼에 남은 데이터를 강제로 출력 스트림으로 밀어내요. 없으면 데이터가 전송되지 않을 수 있어요.' },
      ],
      why:
        '소켓이나 스트림을 깜빡하고 닫지 않으면 파일 디스크립터나 포트 같은 OS 자원이 누수(leak)돼서 장시간 운영 시 시스템이 고갈돼요.',
      expectedOutput:
        '[실행] DataOutputStream으로 UTF 전송\n' +
        '[완료] 데이터 전송 완료',
      realWorldUsage:
        '실제 프로젝트에서 파일 업로드 처리, DB 연결, 네트워크 소켓 통신 등 모든 I/O 작업에서 try-with-resources가 표준 패턴이에요. ' +
        '자바 7 이상에서는 명시적인 finally.close() 패턴을 try-with-resources로 대체하는 게 모던 자바의 관용구예요.',
      pitfall:
        'try 괄호 밖에서 생성한 자원은 자동으로 닫히지 않아요. 자원은 반드시 try 괄호 안에서 선언 및 할당해야 해요. ' +
        '또한 close() 시 발생하는 예외는 숨겨질(suppressed) 수 있어서 주의가 필요해요.',
    },
  },
  {
    id: 'net-serversocket-reuse',
    lang: 'java',
    title: '포트 재사용 설정',
    file: 'ReuseServer.java',
    code: `import java.net.InetSocketAddress;
import java.net.ServerSocket;
import java.net.Socket;

ServerSocket server = new ServerSocket();
server.setReuseAddress(true);
System.out.println("[설정] SO_REUSEADDR 활성화");
server.bind(new InetSocketAddress(8080));
System.out.println("[실행] 8080번 포트에 바인딩 완료");
Socket client = server.accept();
System.out.println("[연결] 클라이언트 수락됨");`,
    explain: {
      concept:
        '서버를 껐다가 바로 다시 켤 때 OS가 "방금 쓰던 포트 아직 안 풀렸어요"라며 BindException으로 거절할 수 있어요. ' +
        'setReuseAddress(true)를 설정하면 TIME_WAIT 상태의 포트라도 즉시 다시 사용할 수 있게 해줘요. ' +
        '운영 중인 서버를 빠르게 재시작해야 하는 상황에서 꼭 필요한 설정이에요. ' +
        'bind()는 실제로 소켓을 특정 주소와 포트에 묶는(바인딩) 작업이에요. 무인자 생성자를 쓸 때는 bind()로 명시적으로 연결해요. ' +
        'ServerSocket을 new ServerSocket(port)로 생성하면 bind()가 자동 호출되지만, 옵션 설정을 먼저 하려면 이 패턴이 필요해요.',
      terms: [
        { t: 'setReuseAddress(true)', d: '소켓이 닫힌 후에도 같은 포트를 즉시 다시 바인딩할 수 있게 허용해요. TIME_WAIT를 무시해요.' },
        { t: 'bind(InetSocketAddress)', d: '소켓을 특정 IP 주소와 포트에 연결(바인딩)해요. bind 전까지는 포트를 점유하지 않아요.' },
        { t: 'new ServerSocket()', d: '바인딩되지 않은 빈 ServerSocket을 생성해요. 옵션을 먼저 설정한 뒤 bind()로 열어요.' },
      ],
      why:
        '개발/테스트 중 서버를 자주 껐다 켜야 할 때 포트 충돌을 피하려고 해요. 운영 배포 시 다운타임을 최소화하는 데도 도움돼요.',
      expectedOutput:
        '[설정] SO_REUSEADDR 활성화\n' +
        '[실행] 8080번 포트에 바인딩 완료\n' +
        '[연결] 클라이언트 수락됨',
      realWorldUsage:
        '실제 프로젝트에서 배포 파이프라인에서 서버 재시작 시 BindException으로 배포가 실패하는 것을 막기 위해 이 옵션을 켜요. ' +
        'Nginx, Tomcat 등 주요 서버도 기본적으로 SO_REUSEADDR을 활성화해요.',
      pitfall:
        'bind() 이후에 setReuseAddress()를 호출하면 아무 효과가 없어요. 반드시 bind() 전에 설정해야 해요. ' +
        '또한 SO_REUSEADDR이 모든 OS에서 동일하게 동작한다고 보장되지 않아요.',
    },
  },
  {
    id: 'net-netty-serverbootstrap',
    lang: 'java',
    title: 'Netty 서버 부트스트랩',
    file: 'NettyServer.java',
    code: `import io.netty.bootstrap.ServerBootstrap;
import io.netty.channel.ChannelInitializer;
import io.netty.channel.nio.NioEventLoopGroup;
import io.netty.channel.socket.SocketChannel;
import io.netty.channel.socket.nio.NioServerSocketChannel;

NioEventLoopGroup bossGroup = new NioEventLoopGroup(1);
NioEventLoopGroup workerGroup = new NioEventLoopGroup();
System.out.println("[실행] Netty 서버 기동 — boss: 1, worker: 기본");
try {
  new ServerBootstrap()
      .group(bossGroup, workerGroup)
      .channel(NioServerSocketChannel.class)
      .childHandler(new ChannelInitializer<SocketChannel>() {
        @Override
        protected void initChannel(SocketChannel ch) {
          ch.pipeline().addLast(new EchoHandler());
        }
      })
      .bind(8080).sync();
  System.out.println("[완료] 서버 바인딩 완료 — port: 8080");
  new ServerBootstrap().config().group().next().next()
      .closeFuture().sync();
} finally {
  System.out.println("[종료] 서버 셧다운");
  bossGroup.shutdownGracefully();
  workerGroup.shutdownGracefully();
}`,
    explain: {
      concept:
        'Netty는 이벤트 기반의 고성능 네트워크 엔진이에요. ServerBootstrap은 Netty 서버를 조립하는 키트(빌더)예요. ' +
        '연결을 받는 boss 그룹(보통 1개 스레드)과 실제 데이터를 읽고 쓰는 worker 그룹을 분리해서 사용하는 게 핵심 설계예요. ' +
        'bossGroup이 accept() 이벤트를 처리하고, 수락된 연결을 workerGroup에 분배해서 병렬로 데이터를 처리해요. ' +
        'channel()로 NIO 소켓 채널을 지정하고, childHandler()로 연결마다 실행될 파이프라인을 구성해요. ' +
        'sync()는 바인딩이나 종료가 완료될 때까지 현재 스레드를 블로킹하며 기다리게 해요. ' +
        '종료 시에는 shutdownGracefully()로 보류 중인 작업을 마무리한 뒤 스레드 풀을 안전하게 종료해요.',
      terms: [
        { t: 'ServerBootstrap', d: 'Netty 서버를 설정하고 기동하는 진입점이에요. group, channel, handler 순으로 설정을 조립해요.' },
        { t: 'bossGroup (NioEventLoopGroup)', d: '클라이언트 연결 수락(accept)만 전담하는 이벤트 루프 그룹이에요. 보통 스레드 1개면 충분해요.' },
        { t: 'workerGroup (NioEventLoopGroup)', d: '수락된 연결의 I/O(읽기/쓰기)를 실제로 처리하는 이벤트 루프 그룹이에요.' },
        { t: 'childHandler', d: 'accept된 각 연결(SocketChannel)의 파이프라인을 초기화하는 핸들러를 지정해요.' },
        { t: 'ChannelInitializer', d: '새 연결이 생성될 때 파이프라인에 인코더·디코더·비즈니스 핸들러를 조립해 넣어주는 초기화 도구예요.' },
        { t: 'sync()', d: 'bind/close 작업이 완료될 때까지 현재 스레드를 블로킹해요. 없으면 서버가 뜨기 전에 main이 종료될 수 있어요.' },
        { t: 'shutdownGracefully()', d: '작업 중인 스레드들을 안전하게 종료해요. 대기 중인 작업을 마무리한 뒤 풀을 닫아요.' },
      ],
      why:
        'Netty는 Tomcat보다 월등히 적은 리소스로 더 많은 동시 연결을 처리할 수 있어서, API Gateway, 프록시 서버, 게임 서버 등 고성능 네트워크 서버의 표준이에요.',
      expectedOutput:
        '[실행] Netty 서버 기동 — boss: 1, worker: 기본\n' +
        '[완료] 서버 바인딩 완료 — port: 8080\n' +
        '[종료] 서버 셧다운',
      realWorldUsage:
        '실제 프로젝트에서 Spring Cloud Gateway, gRPC 서버, Elasticsearch, Cassandra 같은 분산 시스템이 내부 통신에 Netty를 써요. ' +
        '마이크로서비스 아키텍처의 API Gateway를 구축할 때 이 코드가 기본 뼈대가 돼요.',
      pitfall:
        'bind().sync() 없으면 main 스레드가 바로 종료돼 서버가 금방 꺼져요. ' +
        'shutdownGracefully()를 finally 블록에 넣지 않으면 예외 발생 시에도 스레드 풀이 정리되지 않아 리소스 누수가 발생할 수 있어요.',
    },
  },
  {
    id: 'net-netty-inbound-handler',
    lang: 'java',
    title: 'Netty 인바운드 핸들러',
    file: 'EchoHandler.java',
    code: `import io.netty.channel.ChannelHandlerContext;
import io.netty.channel.ChannelInboundHandlerAdapter;

public class EchoHandler extends ChannelInboundHandlerAdapter {
  @Override
  public void channelRead(ChannelHandlerContext ctx, Object msg) {
    System.out.println("[수신] 데이터 도착 — " + msg);
    ctx.write(msg);
    ctx.flush();
    System.out.println("[응답] 에코 전송 완료");
  }

  @Override
  public void exceptionCaught(ChannelHandlerContext ctx, Throwable cause) {
    System.out.println("[에러] " + cause.getMessage());
    ctx.close();
  }
}`,
    explain: {
      concept:
        '핸들러는 파이프라인에서 들어온 데이터를 처리하는 일꾼이에요. channelRead()는 데이터(메시지)가 도착할 때마다 Netty가 불러주는 메서드예요. ' +
        'ctx.write(msg)로 받은 데이터를 그대로 응답 버퍼에 쓰고, flush()로 버퍼를 비워서 네트워크로 내보내요. ' +
        '받은 걸 그대로 돌려주기 때문에 "에코(Echo)" 핸들러라고 불러요. ' +
        'exceptionCaught()는 처리 중 예외가 발생했을 때 불리는 안전망이에요. 이걸 오버라이드하지 않으면 예외가 무시되거나 연결이 불안정해질 수 있어요. ' +
        '파이프라인에 여러 핸들러를 순서대로 등록하면, 데이터가 핸들러들을 차례로 통과하면서 변환·처리·응답돼요.',
      terms: [
        { t: 'ChannelInboundHandlerAdapter', d: '인바운드(들어오는) 이벤트를 처리하는 핸들러의 기본 구현체예요. 필요한 메서드만 오버라이드해요.' },
        { t: 'channelRead(ctx, msg)', d: '데이터가 수신될 때 호출돼요. msg는 파이프라인에서 디코딩된 후의 메시지 객체예요.' },
        { t: 'ChannelHandlerContext', d: '파이프라인 내 현재 핸들러의 위치 정보와, 이전/다음 핸들러와 통신할 수 있는 맥락을 제공해요.' },
        { t: 'ctx.write(msg)', d: '다음 아웃바운드 핸들러에게 메시지를 전달해요. 바로 전송되지 않고 버퍼에 쌓여 있어요.' },
        { t: 'ctx.flush()', d: '버퍼에 쌓인 데이터를 네트워크로 밀어내서 실제 전송해요. write와 flush는 항상 같이 써야 해요.' },
      ],
      why:
        '들어오는 데이터를 변환하거나 응답을 생성하려면 핸들러가 필수예요. Netty 파이프라인의 핵심 구성 요소예요.',
      expectedOutput:
        '[수신] 데이터 도착 — hello\n' +
        '[응답] 에코 전송 완료',
      realWorldUsage:
        '실제 프로젝트에서 HTTP 요청 핸들러, WebSocket 메시지 처리기, TCP 프로토콜 파서 등 Netty 기반 애플리케이션의 모든 비즈니스 로직은 ChannelInboundHandlerAdapter를 상속한 핸들러로 구현해요.',
      pitfall:
        'write()만 호출하고 flush()를 하지 않으면 데이터가 버퍼에만 머물러서 상대방에게 전달되지 않아요. writeAndFlush()로 한 번에 처리하는 게 실수를 줄여줘요. ' +
        '또한 채널에서 발생한 예외를 처리하지 않으면 Netty가 경고만 남기고 연결이 비정상 종료될 수 있어요. exceptionCaught()를 항상 오버라이드하는 게 좋은 습관이에요.',
    },
  },
  {
    id: 'net-netty-decoder',
    lang: 'java',
    title: 'Netty 줄 단위 디코더',
    file: 'LineServer.java',
    code: `import io.netty.bootstrap.ServerBootstrap;
import io.netty.channel.ChannelHandlerContext;
import io.netty.channel.ChannelInboundHandlerAdapter;
import io.netty.channel.ChannelInitializer;
import io.netty.channel.nio.NioEventLoopGroup;
import io.netty.channel.socket.SocketChannel;
import io.netty.channel.socket.nio.NioServerSocketChannel;
import io.netty.handler.codec.string.StringDecoder;
import io.netty.handler.codec.string.StringEncoder;
import io.netty.handler.codec.LineBasedFrameDecoder;

class LineHandler extends ChannelInboundHandlerAdapter {
  @Override
  public void channelRead(ChannelHandlerContext ctx, Object msg) {
    String line = (String) msg;
    System.out.println("[수신] 줄 단위 메시지: " + line);
    ctx.writeAndFlush(line + "\\n");
  }
}

new ServerBootstrap()
    .group(new NioEventLoopGroup(1), new NioEventLoopGroup())
    .channel(NioServerSocketChannel.class)
    .childHandler(new ChannelInitializer<SocketChannel>() {
      @Override
      protected void initChannel(SocketChannel ch) {
        ch.pipeline()
          .addLast(new LineBasedFrameDecoder(8192))
          .addLast(new StringDecoder())
          .addLast(new StringEncoder())
          .addLast(new LineHandler());
      }
    })
    .bind(8080).sync();
System.out.println("[실행] 라인 기반 서버 시작 — port: 8080");`,
    explain: {
      concept:
        '파이프라인에 디코더를 끼우면 바이트 덩어리를 의미 있는 메시지(문자열)로 변환해서 다음 핸들러에게 넘겨줘요. ' +
        '컨베이어 벨트 위에 "자르는 기계 → 포장 기계 → 검수 담당자"가 순서대로 서 있는 것과 같은 구조예요. ' +
        'LineBasedFrameDecoder가 바이트 스트림을 줄바꿈(\\n) 기준으로 잘라서 프레임을 만들고, StringDecoder가 그 프레임을 String으로 변환해요. ' +
        'StringEncoder는 반대 방향(응답)에서 String을 바이트로 인코딩해요. ' +
        '이렇게 프레임·인코딩을 파이프라인으로 분리해 놓으면 각 단계를 독립적으로 바꾸거나 조합할 수 있어서 유연성이 높아져요.',
      terms: [
        { t: 'LineBasedFrameDecoder(8192)', d: '\\n 또는 \\r\\n 기준으로 바이트 스트림을 잘라서 프레임으로 만들어요. 8192는 한 줄의 최대 길이예요.' },
        { t: 'StringDecoder', d: 'ByteBuf(Netty 바이트 컨테이너)를 String으로 변환하는 인바운드 디코더예요.' },
        { t: 'StringEncoder', d: 'String을 ByteBuf로 변환하는 아웃바운드 인코더예요. 응답 전송 방향에 사용돼요.' },
        { t: 'addLast(handler)', d: '파이프라인의 마지막에 핸들러를 추가해요. 데이터가 addLast 순서대로 각 핸들러를 통과해요.' },
        { t: 'writeAndFlush(msg)', d: '데이터를 아웃바운드 파이프라인에 쓰고 즉시 flush해서 전송해요. write() + flush()를 한 번에 처리해요.' },
      ],
      why:
        '바이트 스트림을 바로 다루면 메시지 경계 구분이 어려워요. 디코더로 프레임 단위 처리를 하면 상위 핸들러는 순수한 메시지 객체만 다루면 돼요.',
      expectedOutput:
        '[실행] 라인 기반 서버 시작 — port: 8080\n' +
        '[수신] 줄 단위 메시지: hello',
      realWorldUsage:
        '실제 프로젝트에서 Redis 프로토콜, STOMP 메시징, SMTP 명령어 등 줄 단위 텍스트 프로토콜을 구현할 때 LineBasedFrameDecoder를 기본 프레이머로 사용해요. ' +
        'HTTP는 더 복잡하지만 Netty의 HttpRequestDecoder도 같은 파이프라인 원리로 동작해요.',
      pitfall:
        'LineBasedFrameDecoder의 최대 길이를 넘는 줄이 들어오면 TooLongFrameException이 발생해요. ' +
        '또한 LineBasedFrameDecoder는 Netty 내장 클래스예요. "LineDecoder"라는 이름은 존재하지 않으니 주의하세요.',
    },
  },
  {
    id: 'net-datainput-output',
    lang: 'java',
    title: 'DataInputStream으로 형식 읽기',
    file: 'BinaryClient.java',
    code: `import java.io.DataInputStream;
import java.net.Socket;

try (Socket socket = new Socket("localhost", 8080);
     DataInputStream in = new DataInputStream(socket.getInputStream())) {
  int age = in.readInt();
  double score = in.readDouble();
  String name = in.readUTF();
  System.out.println("[결과] age=" + age + ", score=" + score + ", name=" + name);
}`,
    explain: {
      concept:
        'DataInputStream은 정해진 형식(int, double, UTF 문자열 등)대로 데이터를 읽는 도구예요. ' +
        '상자에 라벨이 붙어 있어서 종류별로 정확하게 꺼낼 수 있어요. 보낸 쪽이 DataOutputStream으로 쓴 순서와 똑같이 읽어야 해요. ' +
        'readInt()는 4바이트를 읽어 int로 변환하고, readDouble()은 8바이트를 읽어 double로 변환하며, readUTF()는 길이 정보와 함께 문자열을 복원해요. ' +
        '텍스트 프로토콜(줄 단위)과 달리 공간 효율이 좋고 파싱 비용이 적어서 고성능 바이너리 프로토콜에 적합해요.',
      terms: [
        { t: 'DataInputStream', d: 'Java 기본형 데이터를 바이너리 형식으로 읽어 복원하는 입력 스트림이에요.' },
        { t: 'readInt()', d: '4바이트를 읽어 int로 변환해요. 빅엔디언(네트워크 바이트 순서)으로 저장된 값을 복원해요.' },
        { t: 'readDouble()', d: '8바이트를 읽어 double로 변환해요. IEEE 754 표준 형식을 그대로 사용해요.' },
        { t: 'readUTF()', d: 'DataOutputStream.writeUTF()로 쓴 문자열을 읽어 복원해요. 2바이트 길이 + UTF-8 변형 인코딩을 사용해요.' },
      ],
      why:
        '보낸 순서와 타입을 맞춰 정확하게 데이터를 복원하려고 해요. 바이너리 프로토콜에서는 쓰기 순서가 곧 읽기 순서와 정확히 일치해야 해요.',
      expectedOutput:
        '[결과] age=25, score=98.5, name=홍길동',
      realWorldUsage:
        '실제 프로젝트에서 하둡의 RPC 프로토콜이나, 커스텀 바이너리 프로토콜로 게임 서버-클라이언트 간 통신을 할 때 DataInputStream/DataOutputStream 쌍을 사용해요. ' +
        'Thrift, Protocol Buffers 같은 직렬화 프레임워크도 내부적으로 유사한 원리를 사용해요.',
      pitfall:
        '쓴 순서와 읽는 순서가 다르면 값이 완전히 깨져요. 예를 들어 writeInt(25) → writeUTF("홍길동") 순으로 보냈다면, 읽을 때도 readInt() → readUTF() 순서를 반드시 지켜야 해요. ' +
        '또한 writeUTF로 쓴 데이터는 표준 UTF-8이 아닌 수정된 UTF-8을 사용하므로 다른 언어와 호환되지 않을 수 있어요.',
    },
  },
  {
    id: 'net-socket-health-check',
    lang: 'java',
    title: '소켓 연결 상태 검사',
    file: 'HealthSocket.java',
    code: `import java.io.OutputStream;
import java.net.Socket;

Socket socket = new Socket("localhost", 8080);
socket.setKeepAlive(true);
System.out.println("[점검] 연결 상태 확인");
boolean connected = !socket.isClosed() && socket.isConnected();
System.out.println("[결과] isConnected=" + connected);
OutputStream out = socket.getOutputStream();
out.write(1);
out.flush();
System.out.println("[완료] 헬스체크 바이트 전송");`,
    explain: {
      concept:
        '소켓 연결이 살아있는지 확인하려면 상태를 물어보거나, 작은 데이터(헬스체크 바이트)를 실제로 보내보는 게 가장 확실해요. ' +
        'isClosed()는 소켓이 명시적으로 닫혔는지를, isConnected()는 한 번이라도 연결된 적이 있는지를 알려줘요. ' +
        '하지만 isConnected()는 소켓 연결이 중간에 끊겨도 true를 반환할 수 있어서 단독으로는 신뢰할 수 없어요. ' +
        'setKeepAlive(true)로 OS 레벨의 TCP KeepAlive를 켜면, 일정 시간 데이터가 없을 때 OS가 probe 패킷을 보내서 연결을 확인해줘요. ' +
        '가장 확실한 방법은 작은 바이트(예: 1)를 보내보고 예외가 발생하는지 확인하는 거예요.',
      terms: [
        { t: 'isClosed()', d: '소켓이 명시적으로 close() 호출로 닫혔는지 확인해요. 네트워크 단절은 감지하지 못해요.' },
        { t: 'isConnected()', d: '소켓이 서버에 연결된 적이 있는지 확인해요. 중간에 끊겨도 true로 남을 수 있어서 주의가 필요해요.' },
        { t: 'setKeepAlive(true)', d: 'TCP KeepAlive를 활성화해서 OS가 주기적으로 연결을 점검하게 해요. 기본 간격은 보통 2시간이에요.' },
      ],
      why:
        '장시간 idle 상태의 커넥션이 중간에 방화벽이나 NAT에 의해 끊겼는지 알아내려고 해요. 커넥션 풀에서 불량 연결을 걸러내는 데 필수예요.',
      expectedOutput:
        '[점검] 연결 상태 확인\n' +
        '[결과] isConnected=true\n' +
        '[완료] 헬스체크 바이트 전송',
      realWorldUsage:
        '실제 프로젝트에서 DB 커넥션 풀(HikariCP)은 풀에서 커넥션을 꺼낼 때마다 isValid()로 유효성을 검사해요. ' +
        'HTTP 클라이언트 커넥션 풀도 오래된 연결을 주기적으로 헬스체크해서 만료시켜요.',
      pitfall:
        'isConnected()는 로컬 소켓의 상태만 알려줘서, 원격 서버가 죽었을 때도 true를 반환할 수 있어요. 실제로 데이터를 보내보는 게 유일하게 확실한 검증 방법이에요. ' +
        '또한 기본 TCP KeepAlive 간격은 너무 길어서(2시간), 실무에서는 OS 설정을 튜닝하거나 애플리케이션 레벨의 헬스체크를 따로 구현해요.',
    },
  },
  {
    id: 'net-netty-client-bootstrap',
    lang: 'java',
    title: 'Netty 클라이언트 부트스트랩',
    file: 'NettyClient.java',
    code: `import io.netty.bootstrap.Bootstrap;
import io.netty.channel.Channel;
import io.netty.channel.ChannelHandlerContext;
import io.netty.channel.ChannelInboundHandlerAdapter;
import io.netty.channel.ChannelInitializer;
import io.netty.channel.nio.NioEventLoopGroup;
import io.netty.channel.socket.SocketChannel;
import io.netty.channel.socket.nio.NioSocketChannel;
import io.netty.handler.codec.string.StringEncoder;

class ClientHandler extends ChannelInboundHandlerAdapter {
  @Override
  public void channelRead(ChannelHandlerContext ctx, Object msg) {
    System.out.println("[수신] 서버 응답: " + msg);
  }
}

NioEventLoopGroup group = new NioEventLoopGroup();
Bootstrap b = new Bootstrap();
b.group(group)
 .channel(NioSocketChannel.class)
 .handler(new ChannelInitializer<SocketChannel>() {
   @Override
   protected void initChannel(SocketChannel ch) {
     ch.pipeline()
       .addLast(new StringEncoder())
       .addLast(new ClientHandler());
   }
 });
Channel ch = b.connect("localhost", 8080).sync().channel();
System.out.println("[연결] 서버 연결 성공");
ch.writeAndFlush("hello\\n");
System.out.println("[전송] 메시지 전송 완료");`,
    explain: {
      concept:
        'Bootstrap은 Netty 클라이언트를 조립하는 키트예요. 서버의 ServerBootstrap과 짝을 이루는 클라이언트용 빌더예요. ' +
        'EventLoopGroup을 하나만 지정한다는 점이 ServerBootstrap(boss+worker 분리)과의 가장 큰 차이예요. ' +
        'connect()로 서버에 연결을 시도하고, sync()로 연결이 완료될 때까지 기다린 뒤 channel()로 활성 채널을 얻어와요. ' +
        '연결된 채널에 writeAndFlush()로 데이터를 보내면 파이프라인의 핸들러 체인을 통과하며 인코딩→전송돼요. ' +
        '비동기 특성상 실제 데이터는 이벤트 루프 스레드에서 송수신되고, 메인 스레드는 다른 작업을 할 수 있어요.',
      terms: [
        { t: 'Bootstrap', d: 'Netty 클라이언트를 설정하고 연결을 시작하는 빌더예요. ServerBootstrap의 클라이언트 버전이에요.' },
        { t: 'NioSocketChannel.class', d: 'NIO 기반의 클라이언트 소켓 채널 클래스예요. 서버 측 NioServerSocketChannel과 짝을 이뤄요.' },
        { t: 'connect(host, port).sync()', d: '서버에 연결을 시도하고 완료될 때까지 현재 스레드를 블로킹해요. 결과로 ChannelFuture를 반환해요.' },
        { t: 'channel()', d: 'sync() 후에 연결이 완료된 ChannelFuture에서 활성 Channel 객체를 가져와요.' },
        { t: 'writeAndFlush(msg)', d: '데이터를 아웃바운드 파이프라인에 쓰고 즉시 네트워크로 전송해요.' },
      ],
      why:
        'Netty 기반으로 고성능 클라이언트를 만들 때 써요. 비동기·논블로킹 특성 덕분에 하나의 EventLoopGroup으로 수천 개의 연결을 관리할 수 있어요.',
      expectedOutput:
        '[연결] 서버 연결 성공\n' +
        '[전송] 메시지 전송 완료\n' +
        '[수신] 서버 응답: hello',
      realWorldUsage:
        '실제 프로젝트에서 마이크로서비스 간 gRPC 통신, Redis/Memcached 클라이언트, 메시지 큐 프로듀서 등 고성능이 필요한 모든 클라이언트 연결에 Netty Bootstrap이 사용돼요.',
      pitfall:
        'handler()를 설정하지 않으면 연결은 되지만 데이터를 주고받을 파이프라인이 없어서 아무 일도 일어나지 않아요. ' +
        '또한 connect() 후 sync()를 호출하지 않으면 연결이 완료되기 전에 writeAndFlush()가 실행돼서 실패할 수 있어요.',
    },
  },
];
