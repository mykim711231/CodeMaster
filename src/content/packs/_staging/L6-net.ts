import type { Snippet } from '../../types';

export const network: Snippet[] = [
  {
    id: 'net-socket-client',
    lang: 'java',
    title: 'Socket으로 서버에 연결',
    file: 'EchoClient.java',
    code: `try (Socket socket = new Socket("localhost", 8080)) {
  OutputStream out = socket.getOutputStream();
  out.write("hello\\n".getBytes());
  out.flush();
}`,
    explain: {
      concept: 'Socket은 내 컴퓨터가 다른 컴퓨터(서버)에 전화를 걸어 연결하는 도구예요. 전화번호 대신 주소와 포트 번호를 써요.',
      terms: [
        { t: 'Socket', d: '서버로 연결을 만드는 전화기' },
        { t: 'new Socket("localhost", 8080)', d: '내 컴퓨터의 8080번 문으로 연결해요.' },
        { t: 'getOutputStream()', d: '서버로 데이터를 보내는 파이프' },
        { t: 'flush()', d: '파이프에 남은 데이터를 밀어내 보내요.' },
      ],
      why: 'TCP로 데이터가 순서대로 안전하게 가야 할 때 써요.',
      pitfall: '연결이 안 되면 connect에서 멈추므로 timeout을 설정하는 게 좋아요.',
    },
  },
  {
    id: 'net-serversocket',
    lang: 'java',
    title: 'ServerSocket으로 문 열기',
    file: 'EchoServer.java',
    code: `try (ServerSocket server = new ServerSocket(8080)) {
  Socket client = server.accept();
  System.out.println("connected");
}`,
    explain: {
      concept: 'ServerSocket은 문을 열고 손님(클라이언트)이 오기를 기다리는 안내데스크예요. 손님이 오면 연결을 하나 만들어줘요.',
      terms: [
        { t: 'ServerSocket', d: '손님을 기다리는 안내데스크' },
        { t: 'new ServerSocket(8080)', d: '8080번 문을 열어요.' },
        { t: 'accept()', d: '다음 손님이 올 때까지 기다렸다 연결을 받아요.' },
      ],
      why: '서버가 클라이언트 연결을 받아들이려면 필수예요.',
      pitfall: 'accept()는 손님이 올 때까지 멈춰 있어요.',
    },
  },
  {
    id: 'net-read-write',
    lang: 'java',
    title: 'Socket으로 글자 주고받기',
    file: 'LineClient.java',
    code: `try (Socket socket = new Socket("localhost", 8080);
    BufferedReader in = new BufferedReader(
        new InputStreamReader(socket.getInputStream()));
    PrintWriter out = new PrintWriter(socket.getOutputStream(), true)) {
  out.println("ping");
  String reply = in.readLine();
}`,
    explain: {
      concept: '소켓 파이프에 Reader/Writer를 끼우면 글자를 줄 단위로 주고받기 쉬워요. 전화선에 번역기를 붙이는 것과 같아요.',
      terms: [
        { t: 'BufferedReader', d: '글자를 한 줄씩 읽어주는 도우미' },
        { t: 'InputStreamReader', d: '바이트를 글자로 바꿔주는 변환기' },
        { t: 'PrintWriter', d: '글자를 편하게 써주는 도우미' },
        { t: 'println', d: '한 줄을 쓰고 줄바꿈을 붙여요.' },
        { t: 'readLine()', d: '한 줄을 통째로 읽어와요.' },
      ],
      why: '줄 단위로 통신하면 메시지 경계를 알기 쉬워요.',
      pitfall: 'PrintWriter의 auto-flush를 켜지 않으면 상대방이 데이터를 못 받아요.',
    },
  },
  {
    id: 'net-socket-timeout',
    lang: 'java',
    title: 'Socket 연결/읽기 타임아웃',
    file: 'TimeoutClient.java',
    code: `Socket socket = new Socket();
socket.connect(new InetSocketAddress("localhost", 8080), 3000);
socket.setSoTimeout(5000);
InputStream in = socket.getInputStream();
int b = in.read();`,
    explain: {
      concept: '타임아웃은 "이 시간이 지나면 그만 기다려라"라는 알람이에요. 무한 대기로 멈추는 걸 막아줘요.',
      terms: [
        { t: 'connect(addr, 3000)', d: '3초 안에 연결이 안 되면 포기해요.' },
        { t: 'InetSocketAddress', d: '주소+포트를 묶은 목적지' },
        { t: 'setSoTimeout(5000)', d: '읽을 데이터가 5초 안에 안 오면 포기해요.' },
      ],
      why: '서버가 느리거나 죽었을 때 프로그램이 멈추지 않게 해요.',
      pitfall: 'setSoTimeout을 안 걸면 read()가 영원히 멈춰 있을 수 있어요.',
    },
  },
  {
    id: 'net-multithread-server',
    lang: 'java',
    title: '손님마다 스레드 배정 서버',
    file: 'ThreadServer.java',
    code: `try (ServerSocket server = new ServerSocket(8080)) {
  while (true) {
    Socket client = server.accept();
    new Thread(() -> {
      try (InputStream in = client.getInputStream()) {
        in.transferTo(client.getOutputStream());
      } catch (IOException e) {
        e.printStackTrace();
      }
    }).start();
  }
}`,
    explain: {
      concept: '손님이 올 때마다 직원(스레드)을 한 명씩 붙여주는 식이에요. 한 손님이 오래 걸려도 다른 손님은 기다리지 않아요.',
      terms: [
        { t: 'while (true)', d: '서버가 켜져 있는 동안 계속 손님을 받아요.' },
        { t: 'accept()', d: '한 손님을 받아요.' },
        { t: 'new Thread(...)', d: '새 직원을 뽑아요.' },
        { t: 'start()', d: '직원을 일하러 보내요.' },
      ],
      why: '여러 클라이언트를 동시에 처리할 수 있어요.',
      pitfall: '손님 수가 많으면 스레드가 너무 늘어 메모리가 부족해져요.',
    },
  },
  {
    id: 'net-socket-options',
    lang: 'java',
    title: '소켓 옵션 설정',
    file: 'TunedSocket.java',
    code: `Socket socket = new Socket("localhost", 8080);
socket.setTcpNoDelay(true);
socket.setKeepAlive(true);
socket.setSendBufferSize(8192);
socket.setReceiveBufferSize(8192);`,
    explain: {
      concept: '소켓 옵션은 전화기의 통화 품질 설정 같은 거예요. 지연을 줄이거나 연결을 살아있게 유지할 수 있어요.',
      terms: [
        { t: 'setTcpNoDelay(true)', d: '작은 데이터도 바로 보내게 해요.' },
        { t: 'setKeepAlive(true)', d: '연결이 끊겼는지 검사하고 유지해요.' },
        { t: 'setSendBufferSize', d: '보내는 통의 크기를 정해요.' },
        { t: 'setReceiveBufferSize', d: '받는 통의 크기를 정해요.' },
      ],
      why: '통신 속도와 안정성을 조절하려고 해요.',
      pitfall: '버퍼 크기를 너무 키우면 메모리만 많이 써요.',
    },
  },
  {
    id: 'net-udp-send',
    lang: 'java',
    title: 'UDP로 데이터 보내기',
    file: 'UdpSender.java',
    code: `try (DatagramSocket socket = new DatagramSocket()) {
  byte[] data = "ping".getBytes();
  InetAddress addr = InetAddress.getByName("localhost");
  DatagramPacket packet = new DatagramPacket(data, data.length, addr, 9090);
  socket.send(packet);
}`,
    explain: {
      concept: 'UDP는 우편 엽서 같아요. 받는 사람이 받았는지 확인하지 않고 그냥 보내요. 빠르지만 유실될 수 있어요.',
      terms: [
        { t: 'DatagramSocket', d: 'UDP로 보내고 받는 우체통' },
        { t: 'InetAddress', d: '목적지 주소' },
        { t: 'DatagramPacket', d: '데이터를 담는 우편 엽서' },
        { t: 'send(packet)', d: '엽서를 우체통에 넣어요.' },
      ],
      why: '속도가 중요하고 일부 유실은 괜찮은 경우(영상/게임)에 써요.',
      pitfall: 'UDP는 도착 순서나 유실을 보장하지 않아요.',
    },
  },
  {
    id: 'net-udp-receive',
    lang: 'java',
    title: 'UDP로 데이터 받기',
    file: 'UdpReceiver.java',
    code: `try (DatagramSocket socket = new DatagramSocket(9090)) {
  byte[] buf = new byte[1024];
  DatagramPacket packet = new DatagramPacket(buf, buf.length);
  socket.receive(packet);
  String msg = new String(packet.getData(), 0, packet.getLength());
}`,
    explain: {
      concept: 'UDP 받는 쪽은 빈 상자를 준비해두고 우편 엽서가 들어오기를 기다려요. 엽서가 오면 상자에 담아요.',
      terms: [
        { t: 'new DatagramSocket(9090)', d: '9090번 우체통을 열어요.' },
        { t: 'byte[1024]', d: '받을 상자 크기' },
        { t: 'receive(packet)', d: '엽서가 올 때까지 기다려요.' },
        { t: 'getLength()', d: '실제 받은 바이트 수' },
      ],
      why: 'UDP 메시지를 받으려면 이렇게 받아야 해요.',
      pitfall: '상자가 너무 작으면 메시지가 잘려요.',
    },
  },
  {
    id: 'net-nio-bytebuffer',
    lang: 'java',
    title: 'NIO ByteBuffer 읽고 쓰기',
    file: 'BufferDemo.java',
    code: `ByteBuffer buf = ByteBuffer.allocate(16);
buf.putInt(42);
buf.putChar('A');
buf.flip();
int n = buf.getInt();
char c = buf.getChar();`,
    explain: {
      concept: 'ByteBuffer는 데이터를 담는 그릇이에요. 쓰기와 읽기 모드를 flip으로 바꿔요. 테이프를 녹음/재생으로 전환하는 것과 같아요.',
      terms: [
        { t: 'allocate(16)', d: '16바이트짜리 그릇을 만들어요.' },
        { t: 'putInt(42)', d: '정수를 그릇에 담아요.' },
        { t: 'flip()', d: '쓰기에서 읽기 모드로 바꿔요.' },
        { t: 'getInt()', d: '정수를 꺼내 읽어요.' },
      ],
      why: 'NIO에서 데이터를 주고받을 때 기본 단위예요.',
      pitfall: 'flip 없이 읽으면 아무것도 안 나와요.',
    },
  },
  {
    id: 'net-nio-filechannel',
    lang: 'java',
    title: 'NIO FileChannel로 파일 복사',
    file: 'FileCopy.java',
    code: `try (FileChannel in = FileChannel.open(Path.of("a.txt"));
    FileChannel out = FileChannel.open(Path.of("b.txt"),
        StandardOpenOption.CREATE,
        StandardOpenOption.WRITE,
        StandardOpenOption.TRUNCATE_EXISTING)) {
  in.transferTo(0, in.size(), out);
}`,
    explain: {
      concept: 'FileChannel은 파일과 연결된 파이프예요. transferTo로 한쪽에서 다른 쪽으로 흘려보낼 수 있어요.',
      terms: [
        { t: 'FileChannel.open', d: '파일로 통로를 열어요.' },
        { t: 'Path.of("a.txt")', d: '파일 위치' },
        { t: 'StandardOpenOption.CREATE', d: '파일이 없으면 새로 만들어요.' },
        { t: 'TRUNCATE_EXISTING', d: '이미 있는 파일 내용을 비우고 처음부터 써요. 기존 내용이 남지 않아요.' },
        { t: 'transferTo', d: '통로에서 통로로 흘려보내요.' },
      ],
      why: '큰 파일도 빠르게 복사할 수 있어요.',
      pitfall: 'TRUNCATE_EXISTING이 없으면 b.txt가 a.txt보다 클 때 기존 바이트가 뒤에 남아 파일이 깨져요.',
    },
  },
  {
    id: 'net-nio-selector',
    lang: 'java',
    title: 'NIO Selector로 여러 채널 감시',
    file: 'SelectorDemo.java',
    code: `Selector selector = Selector.open();
ServerSocketChannel server = ServerSocketChannel.open();
server.configureBlocking(false);
server.bind(new InetSocketAddress(8080));
server.register(selector, SelectionKey.OP_ACCEPT);
while (true) {
  selector.select();
  for (SelectionKey key : selector.selectedKeys()) {
    if (key.isAcceptable()) {
      ServerSocketChannel srv = (ServerSocketChannel) key.channel();
      SocketChannel ch = srv.accept();
      if (ch != null) {
        ch.configureBlocking(false);
        ch.register(selector, SelectionKey.OP_READ);
      }
    }
  }
  selector.selectedKeys().clear();
}`,
    explain: {
      concept: 'Selector는 한 명의 경비원이 여러 문을 동시에 감시하는 도구예요. 한 스레드로 많은 연결을 처리할 수 있어요.',
      terms: [
        { t: 'Selector.open()', d: '경비원을 뽑아요.' },
        { t: 'configureBlocking(false)', d: '문을 기다리지 않게 해요.' },
        { t: 'register(selector, OP_ACCEPT)', d: '이 문을 감시 대상에 등록해요.' },
        { t: 'select()', d: '무언가 일어날 때까지 기다려요.' },
        { t: 'selectedKeys()', d: '이벤트가 발생한 문 목록' },
      ],
      why: '스레드를 적게 쓰면서 많은 클라이언트를 처리하려고 해요.',
      pitfall: '처리한 키를 selectedKeys에서 지우지 않으면 계속 반복 처리돼요.',
    },
  },
  {
    id: 'net-nio-socketchannel',
    lang: 'java',
    title: 'NIO SocketChannel 비동기 클라이언트',
    file: 'NioClient.java',
    code: `SocketChannel ch = SocketChannel.open();
ch.configureBlocking(false);
ch.connect(new InetSocketAddress("localhost", 8080));
while (!ch.finishConnect()) {
  try {
    Thread.sleep(10);
  } catch (InterruptedException e) {
    Thread.currentThread().interrupt();
    break;
  }
}
ByteBuffer buf = ByteBuffer.wrap("hi".getBytes());
ch.write(buf);`,
    explain: {
      concept: 'SocketChannel은 비동기로 연결할 수 있는 파이프예요. 연결이 완료될 때까지 다른 일을 할 수 있어요.',
      terms: [
        { t: 'configureBlocking(false)', d: '기다리지 않는 모드예요.' },
        { t: 'finishConnect()', d: '연결이 끝났는지 확인해요.' },
        { t: 'ByteBuffer.wrap', d: '바이트 배열을 그릇으로 감싸요.' },
        { t: 'write(buf)', d: '그릇의 내용을 보내요.' },
      ],
      why: '연결 대기를 줄이고 동시에 여러 작업을 하려고 해요.',
      pitfall: 'finishConnect가 false인 동안은 아직 데이터를 보낼 수 없어요.',
    },
  },
  {
    id: 'net-twr-socket',
    lang: 'java',
    title: 'try-with-resources로 자동 닫기',
    file: 'SafeClient.java',
    code: `try (Socket socket = new Socket("localhost", 8080);
    DataOutputStream out = new DataOutputStream(socket.getOutputStream())) {
  out.writeUTF("hello");
  out.flush();
}`,
    explain: {
      concept: 'try-with-resources는 다 쓴 도구를 자동으로 정리해주는 기능이에요. 전화기를 직접 끊지 않아도 알아서 끊어줘요.',
      terms: [
        { t: 'try (...)', d: '괄호 안 도구가 다 쓰면 자동으로 닫혀요.' },
        { t: 'DataOutputStream', d: '데이터를 형식에 맞춰 보내는 도구' },
        { t: 'writeUTF', d: '문자열을 길이와 함께 보내요.' },
      ],
      why: '소켓/스트림을 닫지 않아 자원이 새는 걸 막아요.',
      pitfall: 'try 밖에서 소켓을 만들면 자동 닫기가 안 돼요.',
    },
  },
  {
    id: 'net-serversocket-reuse',
    lang: 'java',
    title: '포트 재사용 설정',
    file: 'ReuseServer.java',
    code: `ServerSocket server = new ServerSocket();
server.setReuseAddress(true);
server.bind(new InetSocketAddress(8080));
Socket client = server.accept();`,
    explain: {
      concept: '서버를 껐다 켤 때 "방금 쓰던 포트 아직 안 풀렸어"라며 거절당할 수 있어요. 재사용을 켜면 이걸 무시하고 다시 쓸 수 있어요.',
      terms: [
        { t: 'setReuseAddress(true)', d: '포트를 바로 다시 쓰게 해요.' },
        { t: 'bind(addr)', d: '문을 실제로 열어요.' },
      ],
      why: '서버 재시작을 빠르게 하려고 해요.',
      pitfall: 'bind 이후에 설정하면 효과가 없어요.',
    },
  },
  {
    id: 'net-netty-serverbootstrap',
    lang: 'java',
    title: 'Netty 서버 부트스트랩',
    file: 'NettyServer.java',
    code: `NioEventLoopGroup bossGroup = new NioEventLoopGroup(1);
NioEventLoopGroup workerGroup = new NioEventLoopGroup();
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
      .bind(8080).sync().channel().closeFuture().sync();
} finally {
  bossGroup.shutdownGracefully();
  workerGroup.shutdownGracefully();
}`,
    explain: {
      concept: 'Netty는 이벤트 기반 네트워크 엔진이에요. ServerBootstrap은 Netty 서버를 조립하는 키트예요. 연결을 받는 boss 그룹과 실제 작업을 처리하는 worker 그룹을 분리해서 사용해요.',
      terms: [
        { t: 'ServerBootstrap', d: '서버를 조립하는 키트' },
        { t: 'bossGroup', d: '연결 요청(accept)만 담당하는 일꾼 무리' },
        { t: 'workerGroup', d: '실제 데이터 읽기/쓰기를 처리하는 일꾼 무리' },
        { t: 'group(boss, worker)', d: 'boss와 worker 그룹을 분리해 등록해요.' },
        { t: 'NioServerSocketChannel.class', d: '문을 열 채널 종류' },
        { t: 'childHandler', d: '들어온 연결을 처리할 담당자' },
        { t: 'ChannelInitializer', d: '파이프라인을 세팅하는 도우미' },
        { t: 'shutdownGracefully()', d: '서버 종료 시 일꾼들을 정상 종료해요.' },
      ],
      why: '비동기 네트워크 서버를 짧은 코드로 만들 수 있어요. boss/worker 분리가 Netty 권장 패턴이에요.',
      pitfall: 'bind().sync() 없으면 서버가 뜨지 않고, 종료 시 shutdownGracefully를 호출해야 리소스가 정리돼요.',
    },
  },
  {
    id: 'net-netty-inbound-handler',
    lang: 'java',
    title: 'Netty 인바운드 핸들러',
    file: 'EchoHandler.java',
    code: `public class EchoHandler extends ChannelInboundHandlerAdapter {
  @Override
  public void channelRead(ChannelHandlerContext ctx, Object msg) {
    ctx.write(msg);
    ctx.flush();
  }

  @Override
  public void exceptionCaught(ChannelHandlerContext ctx, Throwable cause) {
    ctx.close();
  }
}`,
    explain: {
      concept: '핸들러는 들어온 데이터를 처리하는 직원이에요. 읽은 데이터를 다시 보내면 에코 서버가 돼요.',
      terms: [
        { t: 'ChannelInboundHandlerAdapter', d: '들어오는 이벤트를 받는 직원 기본형' },
        { t: 'channelRead', d: '데이터가 들어오면 불려요.' },
        { t: 'ChannelHandlerContext', d: '파이프라인과 통신하는 손잡이' },
        { t: 'write(msg)', d: '응답을 보낼 준비를 해요.' },
        { t: 'flush()', d: '준비한 데이터를 밀어내 보내요.' },
      ],
      why: '들어온 데이터를 가공하거나 응답하려면 핸들러가 필요해요.',
      pitfall: 'write만 하고 flush를 안 하면 데이터가 안 나가요.',
    },
  },
  {
    id: 'net-netty-decoder',
    lang: 'java',
    title: 'Netty 줄 단위 디코더',
    file: 'LineServer.java',
    code: `class LineHandler extends ChannelInboundHandlerAdapter {
  @Override
  public void channelRead(ChannelHandlerContext ctx, Object msg) {
    String line = (String) msg;
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
    .bind(8080).sync();`,
    explain: {
      concept: '파이프라인에 디코더를 끼우면 바이트를 줄 단위로 잘라서 다음 직원에게 넘겨요. 썰어놓은 과일을 다음 사람에게 주는 것과 같아요.',
      terms: [
        { t: 'pipeline', d: '직원들이 일렬로 서 있는 줄' },
        { t: 'addLast', d: '줄 뒤에 직원을 추가해요.' },
        { t: 'LineBasedFrameDecoder(8192)', d: '줄바꿈 문자로 바이트를 잘라주는 Netty 내장 디코더예요. 8192는 한 줄의 최대 바이트 수예요.' },
        { t: 'StringDecoder', d: '잘린 바이트를 String으로 변환해줘요.' },
      ],
      why: '바이트 덩어리를 의미 있는 메시지로 바꾸려고 해요.',
      pitfall: 'LineDecoder는 Netty에 없는 클래스예요. 반드시 LineBasedFrameDecoder를 써야 해요. 최대 길이를 넘으면 TooLongFrameException이 발생해요.',
    },
  },
  {
    id: 'net-datainput-output',
    lang: 'java',
    title: 'DataInputStream으로 형식 읽기',
    file: 'BinaryClient.java',
    code: `try (Socket socket = new Socket("localhost", 8080);
    DataInputStream in = new DataInputStream(socket.getInputStream())) {
  int age = in.readInt();
  double score = in.readDouble();
  String name = in.readUTF();
}`,
    explain: {
      concept: 'DataInputStream은 정해진 형식(int, double, UTF 등)대로 데이터를 읽는 도구예요. 상자에 라벨이 붙어있어 종류별로 꺼내기 쉬워요.',
      terms: [
        { t: 'DataInputStream', d: '형식대로 읽는 도구' },
        { t: 'readInt()', d: '정수 한 개를 읽어요.' },
        { t: 'readDouble()', d: '실수 한 개를 읽어요.' },
        { t: 'readUTF()', d: '문자열을 읽어요.' },
      ],
      why: '보낸 순서와 형식을 맞춰 정확히 읽으려고 해요.',
      pitfall: '쓴 순서와 다르게 읽으면 값이 깨져요.',
    },
  },
  {
    id: 'net-socket-health-check',
    lang: 'java',
    title: '소켓 연결 상태 검사',
    file: 'HealthSocket.java',
    code: `Socket socket = new Socket("localhost", 8080);
socket.setKeepAlive(true);
boolean connected = !socket.isClosed() && socket.isConnected();
OutputStream out = socket.getOutputStream();
out.write(1);
out.flush();`,
    explain: {
      concept: '연결이 살아있는지 검사하려면 상태를 물어보거나 작은 데이터를 보내봐요. 전화기가 연결된 상태인지 확인하는 것과 같아요.',
      terms: [
        { t: 'isClosed()', d: '소켓이 닫혔는지 알려줘요.' },
        { t: 'isConnected()', d: '한 번이라도 연결됐는지 알려줘요.' },
        { t: 'setKeepAlive', d: '운영체제가 연결 검사를 하게 해요.' },
      ],
      why: '연결이 끊겼는지 알아내려고 해요.',
      pitfall: 'isConnected는 닫힌 뒤에도 true일 수 있어요.',
    },
  },
  {
    id: 'net-netty-client-bootstrap',
    lang: 'java',
    title: 'Netty 클라이언트 부트스트랩',
    file: 'NettyClient.java',
    code: `class ClientHandler extends ChannelInboundHandlerAdapter {
  @Override
  public void channelRead(ChannelHandlerContext ctx, Object msg) {
    System.out.println("received: " + msg);
  }
}

Bootstrap b = new Bootstrap();
b.group(new NioEventLoopGroup())
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
ch.writeAndFlush("hello\\n");`,
    explain: {
      concept: 'Bootstrap은 Netty 클라이언트를 조립하는 키트예요. 서버 접속용 부품들을 붙이고 연결해요.',
      terms: [
        { t: 'Bootstrap', d: '클라이언트 조립 키트' },
        { t: 'NioSocketChannel.class', d: '연결용 채널 종류' },
        { t: 'handler', d: '연결을 처리할 담당자' },
        { t: 'connect(host, port)', d: '서버로 연결해요.' },
        { t: 'writeAndFlush', d: '데이터를 보내고 바로 밀어내요.' },
      ],
      why: 'Netty 기반으로 클라이언트를 만들려고 해요.',
      pitfall: 'handler를 안 넣으면 연결은 되지만 아무 일도 안 일어나요.',
    },
  },
];
