import type { Snippet } from '../../types';

export const devops: Snippet[] = [
  {
    id: 'devops-gradle-plugins',
    lang: 'java',
    title: 'Gradle - plugins 블록',
    file: 'build.gradle',
    code: `plugins {
  id 'java'
  id 'org.springframework.boot' version '3.4.1'
  id 'io.spring.dependency-management' version '1.1.6'
}

group = 'com.codemaster'
version = '1.0.0'

java {
  toolchain {
    languageVersion = JavaLanguageVersion.of(21)
  }
}`,
    explain: {
      concept:
        'plugins 블록은 빌드 도구의 "공구함"을 여는 곳이에요. ' +
        '스프링 부트 플러그인을 등록하면 실행 가능한 JAR을 만들고, 의존성 버전도 BOM으로 묶어 깔끔하게 관리해줘요. ' +
        'toolchain 블록은 "이 프로젝트는 자바 21로 컴파일해주세요"라고 그레이들에게 알려주는 역할이에요. ' +
        '여러분이 협업하는 팀원마다 자바 버전이 다를 수 있으니, 버전을 명시해두면 누구의 PC에서도 같은 결과가 나와요. ' +
        '실무에서는 멀티모듈 최상위 build.gradle에 이 설정을 두고 하위 모듈들이 물려받게 하는 게 일반적이에요.',
      terms: [
        { t: "id 'java'", d: '자바 컴파일·테스트·JAR 생성까지 가능한 표준 Gradle 플러그인이에요' },
        { t: "'org.springframework.boot'", d: 'bootJar·bootRun 같은 스프링 부트 전용 태스크를 추가해요' },
        { t: "'io.spring.dependency-management' version '1.1.6'", d: '의존성 버전을 스프링 부트 BOM에 맞춰 한 번에 관리하는 도구예요' },
        { t: 'group', d: '메이븐 groupId와 같은 개념 - 보통 회사 도메인을 거꾸로 적어요' },
        { t: 'JavaLanguageVersion.of(21)', d: '자바 21 툴체인을 자동으로 다운로드받아 컴파일해요' },
      ],
      why:
        '스프링 부트 앱을 표준 빌드 방식으로 구성하려고요. 플러그인 버전을 명시하지 않으면 ' +
        '어느 날 갑자기 다른 버전으로 빌드되어 배포에 문제가 생길 수 있어요.',
      expectedOutput:
        './gradlew build 실행 시:\n' +
        'BUILD SUCCESSFUL in 3s\n' +
        '(build/libs/codemaster-1.0.0.jar 생성)',
      realWorldUsage:
        '실제 프로젝트의 최상위 build.gradle에 이 플러그인 블록을 먼저 선언하고, ' +
        '하위 모듈들은 plugins 대신 apply plugin:으로 물려받는 구조를 자주 볼 수 있어요.',
      pitfall:
        'spring-boot-gradle-plugin과 dependency-management의 버전이 안 맞으면 ' +
        'NoSuchMethodError 같은 런타임 에러가 발생해요. 둘 다 같은 스프링 부트 버전을 쓰세요.',
    },
  },
  {
    id: 'devops-gradle-dependencies',
    lang: 'java',
    title: 'Gradle - dependencies',
    file: 'build.gradle',
    code: `dependencies {
  implementation 'org.springframework.boot:spring-boot-starter-web'
  implementation 'org.springframework.boot:spring-boot-starter-data-jpa'
  runtimeOnly 'com.h2database:h2'
  compileOnly 'org.projectlombok:lombok'
  annotationProcessor 'org.projectlombok:lombok'
  testImplementation 'org.springframework.boot:spring-boot-starter-test'
}`,
    explain: {
      concept:
        'dependencies 블록은 요리의 "재료 목록"을 적는 곳이에요. ' +
        'implementation은 컴파일할 때도, 실행할 때도 필요한 필수 재료예요. ' +
        'runtimeOnly는 컴파일 타임에는 필요 없고 앱이 실제로 돌 때만 필요한 재료를 담아요 (예: DB 드라이버). ' +
        'compileOnly와 annotationProcessor는 롬복처럼 컴파일 단계에서만 잠깐 쓰고 버리는 도구예요. ' +
        '이렇게 역할별로 구분해두면 최종 빌드 파일이 불필요한 라이브러리로 비대해지지 않고 보안도 좋아져요.',
      terms: [
        { t: 'implementation', d: '컴파일과 런타임 모두에서 필요 - 가장 많이 쓰는 의존성 선언이에요' },
        { t: 'runtimeOnly', d: '실행 시에만 클래스패스에 올라가요. DB 드라이버에 주로 써요' },
        { t: 'compileOnly', d: '컴파일 때만 참조하고 최종 패키징에는 빠져요. 롬복이 대표적이에요' },
        { t: 'annotationProcessor', d: '컴파일 중 어노테이션을 읽어 코드를 생성하는 처리기를 등록해요' },
        { t: 'testImplementation', d: '테스트 코드를 컴파일하고 실행할 때만 필요한 의존성이에요' },
      ],
      why:
        '필요한 범위만큼만 의존성을 노출해 빌드 속도를 높이고, ' +
        '배포 파일이 불필요하게 커지는 걸 막으려고요.',
      expectedOutput:
        './gradlew dependencies --configuration compileClasspath 실행 시:\n' +
        'compileClasspath - 의존성 트리가 트리 형태로 출력됨',
      realWorldUsage:
        '실제 프로젝트에서 "어 왜 h2가 WAS 배포에도 포함되지?" 같은 문제가 생기면 ' +
        'runtimeOnly가 아니라 implementation으로 적은 건 아닌지 이 블록부터 확인해요.',
      pitfall:
        '롬복은 compileOnly와 annotationProcessor를 둘 다 선언해야 해요. 하나만 쓰면 ' +
        'gradle compileJava는 되는데 IDE에서 getter/setter를 못 찾는 이상한 현상이 생겨요.',
    },
  },
  {
    id: 'devops-gradle-multi-module-settings',
    lang: 'java',
    title: 'Gradle - 멀티모듈 settings.gradle',
    file: 'settings.gradle',
    code: `rootProject.name = 'codemaster'

include 'core-domain'
include 'application-service'
include 'web-api'
include 'persistence-jpa'

project(':web-api').name = 'api'`,
    explain: {
      concept:
        'settings.gradle은 큰 프로젝트를 여러 개의 작은 방(모듈)으로 나누는 "평면도"예요. ' +
        'include로 어떤 모듈이 있는지 그레이들에 알려주고, project().name으로 표시 이름도 바꿀 수 있어요. ' +
        '멀티모듈 구조 덕분에 팀마다 자기 모듈만 담당해 병렬로 개발할 수 있고, 빌드도 변경된 모듈만 다시 돌려요. ' +
        '실무에서는 "web-api는 컨트롤러만, core-domain은 엔티티만" 같은 식으로 관심사별로 모듈을 갈라요.',
      terms: [
        { t: 'rootProject.name', d: '전체 프로젝트의 이름을 정해요. settings.gradle 파일명처럼 "codemaster"가 돼요' },
        { t: "include 'core-domain'", d: '하위 디렉터리(core-domain/)를 하나의 빌드 모듈로 등록해요' },
        { t: "project(':web-api')", d: 'web-api 디렉터리에 해당하는 모듈을 가리키는 참조 경로예요' },
        { t: ".name = 'api'", d: '모듈의 표시 이름만 "api"로 바꿔요. 실제 디렉터리명은 그대로 web-api예요' },
        { t: ':', d: '모듈 경로를 구분하는 문자예요. :core-domain은 루트 바로 아래를 뜻해요' },
      ],
      why:
        '관심사별로 모듈을 나눠 팀 간 충돌을 줄이고, ' +
        '변경된 부분만 부분 빌드해 CI 시간을 단축하려고요.',
      expectedOutput:
        './gradlew projects 실행 시:\n' +
        'Root project \'codemaster\'\n' +
        '\\--- Project \':core-domain\'\n' +
        '\\--- Project \':application-service\'\n' +
        '\\--- Project \':api\'',
      realWorldUsage:
        '실제 대규모 스프링 프로젝트에서는 10~30개 모듈을 include로 등록하고, 각 모듈 안에 build.gradle을 둬요. ' +
        '결제팀은 payment 모듈만, 배송팀은 delivery 모듈만 열어 작업하는 구조예요.',
      pitfall:
        'project(경로).name은 표시 이름만 바꿔요. 의존성 선언할 때는 여전히 원래 경로(:web-api)를 써야 해요. ' +
        ':api로 쓰면 빌드 에러가 나요.',
    },
  },
  {
    id: 'devops-gradle-module-deps',
    lang: 'java',
    title: 'Gradle - 모듈 간 의존성',
    file: 'web-api/build.gradle',
    code: `dependencies {
  implementation project(':core-domain')
  implementation project(':application-service')
  implementation project(':persistence-jpa')

  implementation 'org.springframework.boot:spring-boot-starter-web'
  testImplementation project(':core-domain').sourceSets.test.output
}`,
    explain: {
      concept:
        '모듈이 다른 모듈을 의존할 때 project() 경로로 연결해요. 마치 사무실 방들이 복도로 이어진 것 같아요. ' +
        'testImplementation에 sourceSets.test.output을 지정하면 테스트용으로 만든 헬퍼 클래스나 픽스처를 다른 모듈의 테스트에서도 재사용할 수 있어요. ' +
        '실무에서는 공통 도메인 픽스처를 한 모듈에 모아두고 나머지 모듈들이 공유하는 패턴을 자주 써요.',
      terms: [
        { t: "implementation project(':core-domain')", d: 'core-domain 모듈의 컴파일 출력물을 런타임까지 포함해 의존해요' },
        { t: 'project()', d: 'Gradle 멀티모듈에서 다른 모듈을 참조할 때 쓰는 함수예요' },
        { t: 'sourceSets.test.output', d: '해당 모듈의 테스트 코드가 만든 클래스 파일을 가리켜요' },
        { t: "':persistence-jpa'", d: 'settings.gradle의 include 이름과 정확히 일치해야 빌드가 성공해요' },
        { t: "'spring-boot-starter-web'", d: '스프링 MVC·내장 톰캣 등을 포함하는 스타터 의존성이에요' },
      ],
      why:
        '모듈끼리 필요한 것만 골라 의존하게 해 재사용성을 높이고, ' +
        '순환 의존(circular dependency)을 Gradle이 미리 막아줘 설계를 단단하게 하려고요.',
      expectedOutput:
        './gradlew :web-api:dependencies 실행 시:\n' +
        'project :core-domain (의존성 트리에 포함됨)',
      realWorldUsage:
        '실제 헥사고날 아키텍처 프로젝트에서 application-service 모듈은 도메인 인터페이스만 알면 돼요. ' +
        'persistence-jpa 모듈을 직접 의존하지 않고 인터페이스를 통해 DB를 바꾸는 구조를 만들려고 이렇게 모듈을 나눠요.',
      pitfall:
        'project 경로는 settings.gradle의 include 문자열과 정확히 일치해야 해요. ' +
        "':persistence'라고 잘못 쓰면 Project with path ':persistence' could not be found 에러가 나요.",
    },
  },
  {
    id: 'devops-dockerfile-multistage',
    lang: 'java',
    title: 'Dockerfile - 멀티스테이지 빌드',
    file: 'Dockerfile',
    code: `FROM gradle:8.10.1-jdk21 AS build
WORKDIR /app
COPY . .
RUN gradle bootJar --no-daemon

FROM eclipse-temurin:21-jre AS runtime
WORKDIR /app
COPY --from=build /app/build/libs/*.jar app.jar
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar"]`,
    explain: {
      concept:
        '멀티스테이지 빌드는 "공장에서 조립한 뒤 완제품만 택배 박스에 담는" 전략이에요. ' +
        '첫 번째 스테이지(build)에서는 Gradle과 JDK라는 무거운 도구로 JAR을 빌드하고, 두 번째 스테이지(runtime)에서는 가벼운 JRE만 깔아 그 JAR만 복사해 넣어요. ' +
        '이렇게 하면 최종 이미지에 컴파일러·Gradle 캐시 같은 불필요한 파일이 포함되지 않아 용량이 확 줄어요. ' +
        '실무에서는 CI/CD 파이프라인에서 이 Dockerfile 하나로 빌드·배포를 동시에 처리하는 게 일반적이에요.',
      terms: [
        { t: 'FROM gradle:8.10.1-jdk21 AS build', d: '빌드용 스테이지에 "build"라는 별칭을 붙여요. JDK 21이 포함돼 있어요' },
        { t: 'RUN gradle bootJar --no-daemon', d: 'Gradle 데몬 없이 실행 가능한 Spring Boot JAR을 한 번에 빌드해요' },
        { t: 'FROM eclipse-temurin:21-jre AS runtime', d: 'JDK 대신 JRE만 들어 있는 가벼운 실행용 이미지예요' },
        { t: 'COPY --from=build /app/build/libs/*.jar app.jar', d: 'build 스테이지에서 만든 JAR만 runtime 스테이지로 복사해요' },
        { t: 'ENTRYPOINT ["java", "-jar", "app.jar"]', d: '컨테이너 시작 시 JAR을 실행해요. 큰따옴표 JSON 배열이 필수인 exec form이에요' },
      ],
      why:
        '최종 이미지 크기를 작게 유지해 푸시·풀 속도를 높이고, ' +
        '공격 표면을 줄여 보안을 강화하려고요.',
      expectedOutput:
        'docker build -t codemaster:latest . 실행 시:\n' +
        '(Gradle 빌드 로그)\n' +
        'Successfully tagged codemaster:latest\n' +
        '(최종 이미지 크기 약 250MB)',
      realWorldUsage:
        '실제 스프링 부트 프로젝트의 CI 환경에서 tag push 이벤트가 발생하면 ' +
        '이 Dockerfile로 docker build && docker push를 수행해 레지스트리에 이미지를 올려요.',
      pitfall:
        "ENTRYPOINT에 작은따옴표(['java', '-jar', 'app.jar'])를 쓰면 exec form이 아니라 셸 문자열로 처리돼요. " +
        "반드시 큰따옴표 JSON 배열로 작성해야 컨테이너가 정상적으로 시작돼요.",
    },
  },
  {
    id: 'devops-dockerfile-args',
    lang: 'java',
    title: 'Dockerfile - ARG와 환경 변수',
    file: 'Dockerfile',
    code: `FROM eclipse-temurin:21-jre
ARG JAR_FILE=app.jar
ENV JAVA_OPTS="-Xms256m -Xmx512m"
ENV TZ=Asia/Seoul
COPY build/libs/*.jar /app/app.jar
EXPOSE 8080
CMD ["sh", "-c", "java $JAVA_OPTS -jar /app/app.jar"]`,
    explain: {
      concept:
        'ARG는 빌드 시점에만 존재하는 변수이고, ENV는 실행되는 내내 유지되는 환경 변수예요. ' +
        'JVM 메모리 옵션(-Xms256m 등)은 이미지를 다시 빌드하지 않고 ENV로 주입해 실행 시점에 바꿀 수 있어요. ' +
        '실무에서는 환경별로 힙 크기를 다르게 주거나, K8s ConfigMap에서 주입한 값을 이 ENV가 받아 Runtime.exec() 까지 이어지게 해요.',
      terms: [
        { t: 'ARG JAR_FILE=app.jar', d: '빌드 시점에만 유효한 변수로, --build-arg JAR_FILE=xxx 로 덮어쓸 수 있어요' },
        { t: 'ENV JAVA_OPTS="-Xms256m -Xmx512m"', d: '컨테이너 실행 내내 JVM 옵션으로 확장될 환경 변수예요' },
        { t: 'ENV TZ=Asia/Seoul', d: '컨테이너의 시간대를 서울로 설정해 로그·스케줄러 시각을 맞춰요' },
        { t: 'EXPOSE 8080', d: '이 이미지가 8080 포트를 사용한다고 문서화해요. 실제 포트 매핑은 docker run -p로 해요' },
        { t: 'CMD ["sh", "-c", "java $JAVA_OPTS -jar /app/app.jar"]', d: '셸을 거쳐 $JAVA_OPTS를 실제 JVM 인자로 확장한 뒤 실행해요' },
      ],
      why:
        '이미지를 다시 빌드하지 않고도 JVM 힙 크기, 시간대, 프로파일 등 ' +
        '실행 환경에 따라 달라지는 설정을 외부에서 주입하려고요.',
      expectedOutput:
        'docker run -e JAVA_OPTS="-Xms128m -Xmx256m" codemaster:latest 실행 시:\n' +
        '(JVM이 128MB 힙으로 시작, stdout에 Spring Boot 배너 출력)',
      realWorldUsage:
        '운영 K8s Deployment의 env 필드에 JAVA_OPTS를 정의해두면, ' +
        'Pod가 죽지 않고도 ConfigMap 수정만으로 힙 크기를 조정할 수 있어요.',
      pitfall:
        'CMD/ENTRYPOINT에 작은따옴표 배열을 쓰면 exec form이 아니에요. ' +
        '반드시 큰따옴표 JSON 배열로 작성해야 SIGNAL 전달이나 graceful shutdown이 제대로 동작해요.',
    },
  },
  {
    id: 'devops-compose-spring-db',
    lang: 'java',
    title: 'docker-compose - 앱+DB',
    file: 'docker-compose.yml',
    code: `services:
  app:
    image: codemaster/api:latest
    ports:
      - '8080:8080'
    environment:
      SPRING_DATASOURCE_URL: jdbc:postgresql://db:5432/codemaster
      SPRING_DATASOURCE_USERNAME: cm
      SPRING_DATASOURCE_PASSWORD: secret
    depends_on:
      db:
        condition: service_healthy

  db:
    image: postgres:16
    environment:
      POSTGRES_DB: codemaster
      POSTGRES_USER: cm
      POSTGRES_PASSWORD: secret
    volumes:
      - pgdata:/var/lib/postgresql/data
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U cm -d codemaster"]
      interval: 10s
      timeout: 5s
      retries: 5

volumes:
  pgdata:`,
    explain: {
      concept:
        'docker-compose는 여러 컨테이너를 한 번에 띄우는 "오케스트라 지휘자"예요. ' +
        'app 서비스는 Spring Boot 앱이고, db 서비스는 PostgreSQL이에요. ' +
        'depends_on에 condition: service_healthy를 주면 DB가 pg_isready 검사를 통과할 때까지 앱이 기다려요. ' +
        '실무에서는 로컬 개발 환경을 docker compose up 한 줄로 띄워 신규 팀원도 쉽게 환경을 맞출 수 있게 해요.',
      terms: [
        { t: 'services', d: '실행할 컨테이너들을 이름과 설정으로 나열하는 최상위 항목이에요' },
        { t: 'depends_on.condition: service_healthy', d: '의존 컨테이너의 healthcheck가 성공할 때까지 대기해요. 없으면 영원히 멈춰요' },
        { t: 'healthcheck', d: 'DB의 가동 상태를 주기적으로 확인하는 진단 설정이에요' },
        { t: 'pg_isready -U cm -d codemaster', d: 'PostgreSQL에 cm 사용자가 codemaster DB로 접속 가능한지 검사해요' },
        { t: 'volumes: pgdata:', d: '컨테이너가 재시작돼도 데이터가 사라지지 않도록 호스트에 보관하는 공간이에요' },
      ],
      why:
        '앱과 DB를 한 명령으로 띄워 로컬/테스트 환경을 빠르게 구성하고, ' +
        '팀원 모두가 동일한 DB 버전과 설정으로 작업하려고요.',
      expectedOutput:
        'docker compose up 실행 시:\n' +
        'db-1  | database system is ready to accept connections\n' +
        'app-1 | Started ApiApplication in 4.5 seconds\n' +
        '(app이 8080 포트에서 서빙 시작)',
      realWorldUsage:
        '실제 프로젝트에서 docker compose up -d로 백그라운드에서 띄워두고, ' +
        'IDE에서 Application.main()을 돌리며 DB만 compose가 제공하는 구조로 개발해요.',
      pitfall:
        'DB 비밀번호를 yml에 평문으로 두는 건 위험해요. ' +
        '실제 프로젝트에서는 .env 파일이나 Docker secrets로 분리하세요.',
    },
  },
  {
    id: 'devops-compose-networks',
    lang: 'java',
    title: 'docker-compose - 네트워크 분리',
    file: 'docker-compose.yml',
    code: `services:
  app:
    image: codemaster/api:latest
    networks: [frontend, backend]
    ports: ['8080:8080']

  db:
    image: postgres:16
    networks: [backend]

  nginx:
    image: nginx:1.27
    networks: [frontend]
    ports: ['80:80']

networks:
  frontend:
  backend:
    internal: true`,
    explain: {
      concept:
        '네트워크 분리는 사무실 "출입 구역"을 나누는 것과 같아요. ' +
        'frontend 네트워크는 nginx처럼 외부에 노출되는 컨테이너가 속하고, backend는 DB처럼 내부에서만 통신하는 컨테이너가 속해요. ' +
        'internal: true가 붙은 backend 네트워크는 외부에서 절대 접근할 수 없어 보안이 강화돼요. ' +
        '실무에서는 프론트/백엔드/데이터베이스 네트워크를 나누고 방화벽을 추가해 보안 수준을 한층 더 올려요.',
      terms: [
        { t: 'networks: [frontend, backend]', d: 'app 컨테이너가 두 네트워크에 동시에 속해 양쪽과 통신할 수 있어요' },
        { t: 'frontend', d: '외부로 연결되는 네트워크예요. nginx가 여기서 80 포트를 받아요' },
        { t: 'backend', d: '내부 전용 네트워크예요. app과 db만 서로 볼 수 있어요' },
        { t: 'internal: true', d: '이 네트워크는 호스트 머신이나 외부 인터넷과 단절돼요' },
        { t: "'80:80'", d: '호스트 80번 포트로 들어온 요청을 컨테이너 80번 포트로 전달해요' },
      ],
      why:
        'DB같이 민감한 컨테이너를 외부에서 직접 접근하지 못하게 막아 ' +
        '공격 경로를 최소화하려고요.',
      expectedOutput:
        'docker compose up 실행 시:\n' +
        'Creating network "codemaster_frontend"\n' +
        'Creating network "codemaster_backend" (internal)\n' +
        '(app은 두 네트워크에 연결, db는 backend만, nginx는 frontend만 연결됨)',
      realWorldUsage:
        '실제 AWS ECS나 Docker Swarm에서도 동일한 네트워크 분리 개념을 사용해요. ' +
        'ALB→API→DB 순서로 트래픽이 흐르고, DB는 절대 공인 IP를 가지지 않아요.',
      pitfall:
        '서로 다른 네트워크에 속한 컨테이너들은 서비스 이름으로 통신할 수 없어요. ' +
        'app이 db와 통신하려면 둘 다 backend 네트워크에 속해야 해요.',
    },
  },
  {
    id: 'devops-k8s-deployment',
    lang: 'java',
    title: 'k8s - Deployment',
    file: 'deployment.yaml',
    code: `apiVersion: apps/v1
kind: Deployment
metadata:
  name: api
spec:
  replicas: 3
  selector:
    matchLabels:
      app: api
  template:
    metadata:
      labels:
        app: api
    spec:
      containers:
        - name: api
          image: codemaster/api:1.0.0
          ports:
            - containerPort: 8080
          resources:
            limits:
              memory: 512Mi
              cpu: 500m`,
    explain: {
      concept:
        'Deployment는 "몇 개의 복제본(Pod)을 항상 유지할지"를 쿠버네티스에게 알려주는 작전서예요. ' +
        'replicas: 3으로 설정하면 Pod 하나가 죽어도 쿠버네티스가 즉시 새 Pod를 띄워 항상 3개를 유지해요. ' +
        'selector.matchLabels는 이 Deployment가 어떤 Pod를 관리할지 결정하는 태그 매칭 규칙이에요. ' +
        '실무에서는 RollingUpdate 전략을 통해 Pod를 하나씩 교체하며 무중단 배포를 실현해요.',
      terms: [
        { t: 'apiVersion: apps/v1', d: 'Deployment 리소스가 속한 API 그룹과 버전이에요. apps/v1이 가장 안정적이에요' },
        { t: 'kind: Deployment', d: '이 YAML이 선언하는 리소스의 종류예요. k8s는 kind로 리소스를 구분해요' },
        { t: 'replicas: 3', d: '몇 개의 동일한 Pod 인스턴스를 항상 유지할지 지정해요' },
        { t: 'selector.matchLabels', d: 'template.metadata.labels가 이 조건과 일치해야 Deployment가 해당 Pod를 관리해요' },
        { t: 'resources.limits', d: 'Pod 하나가 사용할 수 있는 CPU·메모리 상한이에요. 초과하면 Pod가 죽을 수 있어요' },
      ],
      why:
        '장애가 발생해도 자동으로 복구되고, 트래픽 증가 시 replicas만 올려 스케일아웃하려고요.',
      expectedOutput:
        'kubectl apply -f deployment.yaml 실행 시:\n' +
        'deployment.apps/api created\n' +
        '[kubectl get pods] → api-xxxx-yyy1, api-xxxx-yyy2, api-xxxx-yyy3 (3개 Pod Running)',
      realWorldUsage:
        '실제 서비스에서 RollingUpdate 전략으로 배포 시, ' +
        '3개의 replicas 중 1개씩 새 버전으로 교체되며 기존 요청을 유실 없이 처리해요.',
      pitfall:
        'template.metadata.labels의 app: api가 selector.matchLabels의 app: api와 정확히 일치해야 해요. ' +
        '오타가 있으면 "selector does not match template labels" 에러가 나요.',
    },
  },
  {
    id: 'devops-k8s-service',
    lang: 'java',
    title: 'k8s - Service (ClusterIP)',
    file: 'service.yaml',
    code: `apiVersion: v1
kind: Service
metadata:
  name: api
spec:
  type: ClusterIP
  selector:
    app: api
  ports:
    - port: 80
      targetPort: 8080
      protocol: TCP
      name: http`,
    explain: {
      concept:
        'Service는 변덕스러운 Pod들의 "안내 데스크"예요. Pod는 수시로 죽고 살아나며 IP가 바뀌지만, ' +
        'Service는 고정된 클러스터 내부 IP와 DNS 이름(api)을 제공해 항상 같은 이름으로 Pod에 접근할 수 있어요. ' +
        'type: ClusterIP는 클러스터 내부에서만 접근 가능한 가상 IP를 부여해요. ' +
        'port: 80으로 들어온 요청을 Pod의 targetPort: 8080으로 자동 변환(port-forwarding)해줘요.',
      terms: [
        { t: 'kind: Service', d: 'Pod 집합에 안정적인 네트워크 진입점을 제공하는 k8s 리소스예요' },
        { t: 'type: ClusterIP', d: '클러스터 내부에서만 통신할 수 있는 가상 IP를 할당해요. 기본값이에요' },
        { t: 'selector.app: api', d: 'app=api 레이블이 붙은 Pod를 이 Service의 대상으로 묶어요' },
        { t: 'port: 80', d: 'Service 자체가 수신 대기하는 포트예요. 다른 Pod가 api:80으로 호출할 때 쓰여요' },
        { t: 'targetPort: 8080', d: 'Service가 Pod 내부로 트래픽을 보낼 때 사용하는 컨테이너 포트예요' },
      ],
      why:
        'Pod IP가 바뀌어도 서비스 간 통신 주소를 코드에 하드코딩하지 않고, ' +
        '안정적인 DNS 이름으로 라우팅하려고요.',
      expectedOutput:
        'kubectl get service api 실행 시:\n' +
        'NAME   TYPE        CLUSTER-IP      PORT(S)   AGE\n' +
        'api    ClusterIP   10.96.123.45   80/TCP    5m',
      realWorldUsage:
        '실제 마이크로서비스에서 order-service Pod가 payment-service를 호출할 때 ' +
        'http://payment-service:80/charge 같은 주소로 Service 이름을 사용해요.',
      pitfall:
        'type을 생략하면 기본값이 ClusterIP라 클러스터 외부에서 접근할 수 없어요. ' +
        '외부 노출이 필요하면 type: LoadBalancer나 type: NodePort를 쓰세요.',
    },
  },
  {
    id: 'devops-k8s-ingress',
    lang: 'java',
    title: 'k8s - Ingress (HTTP 라우팅)',
    file: 'ingress.yaml',
    code: `apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: api-ingress
  annotations:
    nginx.ingress.kubernetes.io/rewrite-target: /
spec:
  ingressClassName: nginx
  rules:
    - host: api.codemaster.com
      http:
        paths:
          - path: /
            pathType: Prefix
            backend:
              service:
                name: api
                port:
                  number: 80`,
    explain: {
      concept:
        'Ingress는 클러스터 정문의 "안내 데스크"예요. api.codemaster.com 도메인으로 들어온 HTTP 요청을 ' +
        '어떤 Service로 라우팅할지 결정하는 규칙을 담고 있어요. ' +
        'ingressClassName: nginx는 NGINX Ingress Controller가 이 규칙을 실제로 구현하게 해요. ' +
        '실무에서는 하나의 Ingress에 path 기반으로 /api → api-service, /front → web-service 같이 여러 서비스를 매핑해요.',
      terms: [
        { t: 'ingressClassName: nginx', d: '이 Ingress 규칙을 해석하고 실행할 Ingress Controller를 지정해요' },
        { t: 'host: api.codemaster.com', d: '이 도메인으로 들어온 요청만 아래 규칙을 적용해요' },
        { t: 'pathType: Prefix', d: '/로 시작하는 모든 경로를 매칭해요. Exact, Prefix, ImplementationSpecific이 있어요' },
        { t: 'backend.service.name: api', d: '매칭된 요청을 보낼 대상 Service의 이름이에요' },
        { t: 'port.number: 80', d: 'Service의 어떤 포트로 보낼지 지정해요' },
      ],
      why:
        '여러 개의 Service를 하나의 도메인과 경로로 깔끔하게 묶고, TLS 인증서도 Ingress 한 곳에서만 관리하려고요.',
      expectedOutput:
        'kubectl apply -f ingress.yaml 실행 시:\n' +
        'ingress.networking.k8s.io/api-ingress created\n' +
        '[curl -H "Host: api.codemaster.com" http://<INGRESS_IP>/] → (api Service가 응답)',
      realWorldUsage:
        '실제 프로덕션 환경에서 cert-manager와 함께 Ingress를 사용하면 ' +
        'api.codemaster.com에 대한 Let\'s Encrypt TLS 인증서가 자동 발급·갱신돼요.',
      pitfall:
        'rewrite-target 어노테이션을 올바르게 설정하지 않으면 경로가 중복으로 붙어요. ' +
        '예: /api/orders를 요청했는데 Service가 /api/api/orders로 받는 문제가 생겨요.',
    },
  },
  {
    id: 'devops-k8s-configmap-secret',
    lang: 'java',
    title: 'k8s - ConfigMap + Secret',
    file: 'config.yaml',
    code: `apiVersion: v1
kind: ConfigMap
metadata:
  name: api-config
data:
  LOG_LEVEL: INFO
  DB_HOST: postgres.database
---
apiVersion: v1
kind: Secret
metadata:
  name: api-secret
type: Opaque
stringData:
  DB_PASSWORD: secret
  JWT_SECRET: mysupersecret`,
    explain: {
      concept:
        'ConfigMap은 로그 레벨·DB 호스트명 같은 일반 설정을, Secret은 비밀번호·JWT 시크릿 같은 민감 정보를 분리해 담는 도구예요. ' +
        '이렇게 코드와 설정을 분리하면 같은 이미지로 dev/staging/prod 환경을 달리 돌릴 수 있어요. ' +
        'stringData는 평문으로 값을 적으면 k8s가 알아서 base64 인코딩해 etcd에 저장해줘요. ' +
        '실무에서는 CI/CD 파이프라인이나 External Secrets Operator로 AWS Secrets Manager에서 값을 동기화하는 식으로 더 안전하게 관리해요.',
      terms: [
        { t: 'ConfigMap', d: '앱이 사용할 키-값 설정을 담는 k8s 리소스예요. Pod에서 환경변수나 볼륨으로 주입해요' },
        { t: 'data', d: 'ConfigMap에 저장할 키-값 쌍들을 평문으로 적는 필드예요' },
        { t: 'Secret', d: '비밀번호·토큰·인증서 등 민감한 데이터를 담는 k8s 리소스예요' },
        { t: 'type: Opaque', d: '가장 일반적인 Secret 타입이에요. 임의의 키-값 쌍을 저장할 수 있어요' },
        { t: 'stringData', d: '평문으로 값을 적으면 k8s가 base64로 변환해 저장해줘요. data 필드는 직접 base64 값을 넣어야 해요' },
      ],
      why:
        '비밀번호를 Docker 이미지나 소스 코드에 하드코딩하지 않고 ' +
        '런타임에 외부에서 주입해 Git에 민감 정보가 올라가는 걸 막으려고요.',
      expectedOutput:
        'kubectl apply -f config.yaml 실행 시:\n' +
        'configmap/api-config created\n' +
        'secret/api-secret created\n' +
        '[kubectl get secret api-secret -o jsonpath="{.data.DB_PASSWORD}" | base64 -d] → secret',
      realWorldUsage:
        '실제 프로덕션 환경에서 Secret은 etcd 암호화를 켜고 RBAC로 접근을 제한해요. ' +
        'AWS EKS에서는 IRSA로 Pod가 Secret Manager에 직접 접근하는 패턴도 흔해요.',
      pitfall:
        'stringData는 평문 입력이 편리하지만, 한 번 생성된 Secret을 kubectl get -o yaml로 보면 base64로만 보여요. ' +
        'etcd에 encryption-at-rest를 활성화하지 않으면 Secret이 평문으로 저장될 수 있으니 주의가 필요해요.',
    },
  },
  {
    id: 'devops-k8s-probes',
    lang: 'java',
    title: 'k8s - Liveness/Readiness Probe',
    file: 'deployment-probe.yaml',
    code: `containers:
  - name: api
    image: codemaster/api:1.0.0
    livenessProbe:
      httpGet:
        path: /actuator/health/liveness
        port: 8080
      initialDelaySeconds: 30
      periodSeconds: 10
    readinessProbe:
      httpGet:
        path: /actuator/health/readiness
        port: 8080
      initialDelaySeconds: 10
      periodSeconds: 5`,
    explain: {
      concept:
        'Probe는 의사가 환자를 주기적으로 진찰하는 것 같아요. ' +
        'Liveness Probe는 "이 Pod가 여전히 살아있는가?"를 검사해, 응답이 없으면 kubelet이 Pod를 죽이고 재시작해요. ' +
        'Readiness Probe는 "이 Pod가 지금 트래픽을 받을 준비가 됐는가?"를 검사해, 실패하면 Service의 엔드포인트에서 임시로 빼줘요. ' +
        'initialDelaySeconds는 앱이 완전히 뜨기까지 기다리는 여유 시간이고, periodSeconds는 그 이후의 검사 주기예요.',
      terms: [
        { t: 'livenessProbe', d: 'Pod가 여전히 살아있는지 주기적으로 확인해요. 실패하면 컨테이너를 재시작해요' },
        { t: 'readinessProbe', d: 'Pod가 요청을 받을 준비가 됐는지 확인해요. 실패 시 Service에서 일시 제외돼요' },
        { t: 'httpGet', d: 'HTTP GET 요청으로 헬스체크를 수행해요. 200~399 응답이면 정상이에요' },
        { t: 'initialDelaySeconds: 30', d: '컨테이너 시작 후 첫 검사까지 30초를 기다려줘요' },
        { t: 'periodSeconds: 10', d: '첫 검사 이후 10초마다 반복 검사해요' },
      ],
      why:
        '죽은 Pod는 재시작하고, 아직 준비 안 된 Pod는 트래픽에서 빼서 ' +
        '무중단 배포와 자동 복구를 동시에 달성하려고요.',
      expectedOutput:
        'kubectl describe pod api-xxx 실행 시:\n' +
        'Liveness:  http-get http://:8080/actuator/health/liveness delay=30s timeout=1s period=10s\n' +
        'Readiness: http-get http://:8080/actuator/health/readiness delay=10s timeout=1s period=5s',
      realWorldUsage:
        '실제 운영 환경에서 Spring Boot Actuator의 health 그룹(liveness, readiness)과 연동해 ' +
        '기본 제공되는 /actuator/health/liveness와 /actuator/health/readiness를 Probe 경로로 써요.',
      pitfall:
        'initialDelaySeconds를 너무 짧게 두면 앱이 아직 초기화되기도 전에 Probe가 실패 판정을 내려 ' +
        'CrashLoopBackOff 상태에 빠질 수 있어요. JVM 앱은 보통 30~60초를 줘요.',
    },
  },
  {
    id: 'devops-k8s-hpa',
    lang: 'java',
    title: 'k8s - HorizontalPodAutoscaler',
    file: 'hpa.yaml',
    code: `apiVersion: autoscaling/v2
kind: HorizontalPodAutoscaler
metadata:
  name: api-hpa
spec:
  scaleTargetRef:
    apiVersion: apps/v1
    kind: Deployment
    name: api
  minReplicas: 2
  maxReplicas: 10
  metrics:
    - type: Resource
      resource:
        name: cpu
        target:
          type: Utilization
          averageUtilization: 70`,
    explain: {
      concept:
        'HPA는 식당의 "매니저" 같은 존재예요. 손님이 늘어나면 직원을 더 부르고, 한가해지면 돌려보내요. ' +
        '여기서는 평균 CPU 사용률이 70퍼센트를 넘으면 Pod를 maxReplicas까지 늘리고, 낮아지면 minReplicas까지 줄여요. ' +
        'scaleTargetRef는 어떤 Deployment의 복제본 수를 조절할지 지정해요. ' +
        '실무에서는 CPU와 Memory 메트릭을 함께 보고, 커스텀 메트릭(Prometheus 등)으로 요청 대기 큐 길이까지 반영하기도 해요.',
      terms: [
        { t: 'HorizontalPodAutoscaler', d: '지정된 메트릭에 따라 Pod 복제본 수를 자동으로 조절하는 k8s 리소스예요' },
        { t: 'scaleTargetRef', d: '어떤 Deployment의 replicas를 조절할지 가리키는 참조예요' },
        { t: 'minReplicas: 2', d: '아무리 부하가 낮아도 최소 2개의 Pod는 유지해요' },
        { t: 'maxReplicas: 10', d: '아무리 부하가 높아도 10개 넘게 늘리지 않아요' },
        { t: 'averageUtilization: 70', d: 'Pod들의 평균 CPU 사용률이 70%에 근접하도록 replicas를 조정해요' },
      ],
      why:
        '트래픽 변화에 따라 Pod 수를 자동으로 늘리거나 줄여서 ' +
        '비용 효율과 응답 속도 사이의 균형을 맞추려고요.',
      expectedOutput:
        'kubectl apply -f hpa.yaml 실행 시:\n' +
        'horizontalpodautoscaler.autoscaling/api-hpa created\n' +
        '[kubectl get hpa api-hpa] → TARGETS: 45%/70%, MINPODS: 2, MAXPODS: 10',
      realWorldUsage:
        '실제 블랙프라이데이 같은 트래픽 급증 이벤트에 대비해 HPA를 미리 설정해두고, ' +
        'maxReplicas만 충분히 잡아주면 사람이 새벽에 일어나 수동으로 스케일링할 필요가 없어요.',
      pitfall:
        'HPA가 동작하려면 대상 Deployment의 Pod에 resources.requests가 반드시 정의되어 있어야 해요. ' +
        'limits만 있고 requests가 없으면 Utilization 타입 메트릭을 계산할 수 없어요.',
    },
  },
  {
    id: 'devops-helm-chart',
    lang: 'java',
    title: 'Helm - Chart.yaml',
    file: 'Chart.yaml',
    code: `apiVersion: v2
name: codemaster-api
description: CodeMaster Spring Boot API chart
type: application
version: 0.1.0
appVersion: '1.0.0'
dependencies:
  - name: postgresql
    version: '^15.0.0'
    repository: https://charts.bitnami.com/bitnami
    condition: postgresql.enabled`,
    explain: {
      concept:
        'Chart.yaml은 Helm 차트의 "신분증"이에요. 차트 이름, 버전, 설명, 그리고 어떤 외부 차트를 의존하는지 기록해요. ' +
        'version은 차트 자체의 버전이고 appVersion은 실제 스프링 부트 앱의 버전이에요. 이 둘은 서로 다른 의미예요. ' +
        'dependencies 항목으로 PostgreSQL 같은 외부 차트를 함께 묶어 한 번에 설치할 수 있어요. ' +
        '실무에서는 내부 차트 저장소(chart museum, Harbor 등)에 push하고 CI/CD에서 pull해 배포해요.',
      terms: [
        { t: 'apiVersion: v2', d: 'Helm 3의 차트 API 버전이에요. v1은 Helm 2용이라 더 이상 쓰지 않아요' },
        { t: 'name: codemaster-api', d: '이 차트의 고유 이름이에요. helm install 시 릴리즈 이름과 별개로 사용돼요' },
        { t: 'version: 0.1.0', d: '차트 자체의 semver 버전이에요. 차트를 수정할 때마다 올려줘요' },
        { t: "appVersion: '1.0.0'", d: '이 차트로 배포되는 실제 애플리케이션의 Docker 이미지 태그예요' },
        { t: "version: '^15.0.0'", d: '의존 차트의 semver 범위예요. ^는 호환되는 최신 패치를 허용한다는 뜻이에요' },
      ],
      why:
        '복잡한 쿠버네티스 매니페스트 묶음을 하나의 패키지로 버전 관리하고, ' +
        '다른 팀에서도 helm install 한 줄로 똑같은 스택을 배포할 수 있게 하려고요.',
      expectedOutput:
        'helm install my-release . 실행 시:\n' +
        'NAME: my-release\n' +
        'LAST DEPLOYED: Mon Jun 29 10:00:00 2026\n' +
        'STATUS: deployed',
      realWorldUsage:
        '실제 GitOps 환경(ArgoCD)에서 Chart.yaml의 version을 올리면 ' +
        'ArgoCD가 변경을 감지해 자동으로 새 차트를 클러스터에 배포해요.',
      pitfall:
        "의존성 version에 '15.x.x' 같은 와일드카드 x를 쓰면 Helm이 인식하지 못해요. " +
        "반드시 semver(^15.0.0, ~15.0.0, >=15.0.0 <16.0.0) 형식을 쓰세요.",
    },
  },
  {
    id: 'devops-helm-values',
    lang: 'java',
    title: 'Helm - values.yaml',
    file: 'values.yaml',
    code: `replicaCount: 3
image:
  repository: codemaster/api
  tag: 1.0.0
  pullPolicy: IfNotPresent
service:
  type: ClusterIP
  port: 80
resources:
  limits:
    cpu: 500m
    memory: 512Mi
postgresql:
  enabled: true`,
    explain: {
      concept:
        'values.yaml은 차트의 "설정 다이얼판"이에요. 같은 차트라도 이 파일의 값만 바꾸면 dev/staging/prod 환경마다 ' +
        '다른 replicaCount, 다른 이미지 태그, 다른 리소스 제한으로 찍어낼 수 있어요. ' +
        'postgresql.enabled: true는 Chart.yaml에 등록된 PostgreSQL 의존 차트를 함께 설치하라는 스위치예요. ' +
        '실무에서는 values-dev.yaml, values-prod.yaml처럼 파일을 나누고 helm install -f values-prod.yaml로 선택해요.',
      terms: [
        { t: 'replicaCount: 3', d: '템플릿에서 {{ .Values.replicaCount }}로 참조돼 Deployment의 replicas가 돼요' },
        { t: 'image.repository: codemaster/api', d: 'Docker 이미지가 저장된 레지스트리 경로예요' },
        { t: 'pullPolicy: IfNotPresent', d: '로컬에 없으면 pull, 있으면 그대로 사용해요. Always는 항상 새로 받아요' },
        { t: 'resources.limits.cpu: 500m', d: 'Pod가 사용할 수 있는 최대 CPU는 0.5코어예요' },
        { t: 'postgresql.enabled: true', d: '의존 차트의 condition과 연결돼, 이 값이 true일 때만 PostgreSQL이 설치돼요' },
      ],
      why:
        '하나의 차트로 여러 환경을 값만 바꿔 배포할 수 있게 하려고요. ' +
        '환경별로 YAML 파일을 통째로 복사할 필요가 없어져요.',
      expectedOutput:
        'helm template . 실행 시 (values.yaml이 렌더링된 k8s YAML 출력):\n' +
        'replicas: 3\n' +
        'image: codemaster/api:1.0.0',
      realWorldUsage:
        '실제 운영 배포 시 CI/CD에서 빌드된 이미지 태그를 values-prod.yaml의 image.tag에 동적으로 주입해 ' +
        'helm upgrade --set image.tag=v1.2.3 같은 식으로 릴리즈를 갱신해요.',
      pitfall:
        '운영 DB 비밀번호 같은 민감한 값은 values.yaml에 평문으로 적으면 안 돼요. ' +
        '외부 Secret이나 helm install --set으로 주입하거나, Sealed Secrets를 쓰세요.',
    },
  },
  {
    id: 'devops-helm-template',
    lang: 'java',
    title: 'Helm - 템플릿에서 값 사용',
    file: 'templates/deployment.yaml',
    code: `apiVersion: apps/v1
kind: Deployment
metadata:
  name: {{ .Values.image.repository | replace "/" "-" }}
spec:
  replicas: {{ .Values.replicaCount }}
  template:
    spec:
      containers:
        - name: api
          image: "{{ .Values.image.repository }}:{{ .Values.image.tag }}"`,
    explain: {
      concept:
        '템플릿은 values.yaml의 값을 Go 템플릿 문법({{ }})으로 끼워 넣는 "빈칸 채우기" 시트예요. ' +
        '{{ .Values.replicaCount }}가 values.yaml의 replicaCount: 3으로 치환돼 최종 YAML이 완성돼요. ' +
        '파이프(|)로 값을 연결해 replace 같은 함수를 적용할 수 있어요. 슬래시(/)를 대시(-)로 바꿔 리소스 이름 규칙을 지키는 식이에요. ' +
        '실무에서는 if/else, range 반복문, include로 공통 템플릿을 재사용하는 방식까지 확장해 써요.',
      terms: [
        { t: '{{ .Values }}', d: 'values.yaml의 루트에 접근하는 Go 템플릿 표현식이에요' },
        { t: '.Values.replicaCount', d: 'values.yaml의 replicaCount 필드를 읽어와요' },
        { t: 'replace "/" "-"', d: '문자열 내 모든 슬래시(/)를 대시(-)로 치환하는 함수예요' },
        { t: '|', d: '왼쪽 템플릿 표현식의 결과를 오른쪽 함수에 전달하는 파이프라인이에요' },
        { t: '.Values.image.tag', d: 'image 아래 중첩된 tag 필드에 접근해요. 점(.)으로 경로를 이어가요' },
      ],
      why:
        '설정 값과 매니페스트 양식을 분리해, 반복적인 YAML 작성 없이 ' +
        '환경별로 값만 바꿔도 수백 줄의 매니페스트를 자동으로 생성하려고요.',
      expectedOutput:
        'helm template . 실행 시:\n' +
        '---\n' +
        'apiVersion: apps/v1\n' +
        'kind: Deployment\n' +
        'metadata:\n' +
        '  name: codemaster-api\n' +
        'spec:\n' +
        '  replicas: 3',
      realWorldUsage:
        '실제 프로젝트에서 공통 헬퍼 템플릿(_helpers.tpl)에 imagePullSecrets, ' +
        '공통 레이블 생성 로직을 정의해두고 50개 마이크로서비스 차트가 모두 참조하는 구조를 많이 써요.',
      pitfall:
        '리소스 이름에 슬래시가 포함되면 k8s 리소스 이름 규칙(DNS-1123)에 어긋나 에러가 나요. ' +
        'image.repository 값에서 슬래시를 replace로 반드시 치환하세요.',
    },
  },
  {
    id: 'devops-gh-actions-build',
    lang: 'java',
    title: 'GitHub Actions - 빌드 워크플로우',
    file: 'build.yml',
    code: `name: build
on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-java@v4
        with:
          distribution: temurin
          java-version: 21
      - name: Build and Test
        run: ./gradlew build --no-daemon`,
    explain: {
      concept:
        'GitHub Actions는 코드를 push하면 "로봇 비서"가 자동으로 빌드·테스트를 수행하는 CI 도구예요. ' +
        'main 브랜치에 push되거나 PR이 올라올 때마다 ubuntu-latest 가상머신에서 checkout → JDK 21 설치 → Gradle build를 차례로 실행해요. ' +
        '실무에서는 이 워크플로우가 통과해야만 PR을 머지할 수 있도록 Branch Protection Rule을 걸어 코드 품질을 지켜요.',
      terms: [
        { t: 'name: build', d: '이 워크플로우의 표시 이름이에요. GitHub Actions 탭에서 보여요' },
        { t: 'on.push.branches: [main]', d: 'main 브랜치에 push 이벤트가 발생할 때만 이 워크플로우를 실행해요' },
        { t: 'runs-on: ubuntu-latest', d: 'GitHub가 제공하는 최신 Ubuntu 가상 머신에서 작업을 실행해요' },
        { t: 'actions/checkout@v4', d: '현재 레포지토리의 소스 코드를 가상 머신으로 체크아웃하는 공식 액션이에요' },
        { t: 'setup-java@v4', d: 'Temurin(Eclipse Adoptium) 배포판의 JDK 21을 설치하는 공식 액션이에요' },
      ],
      why:
        '모든 변경 사항을 자동으로 빌드·테스트해 "내 PC에서는 잘 되는데" 문제를 조기에 차단하려고요.',
      expectedOutput:
        'Actions 탭 → build 워크플로우 로그:\n' +
        'Run ./gradlew build --no-daemon\n' +
        'BUILD SUCCESSFUL in 45s',
      realWorldUsage:
        '실제 오픈소스 프로젝트에서도 main 브랜치에 직접 push하는 대신 ' +
        'feature 브랜치 → PR 생성 → Actions 자동 빌드 → 리뷰 통과 후 merge 순서로 운영해요.',
      pitfall:
        './gradlew build 명령은 이미 test 태스크를 포함하고 있어요. ' +
        '별도로 ./gradlew test 스텝을 추가하면 테스트가 두 번 실행돼 CI 시간이 낭비돼요.',
    },
  },
  {
    id: 'devops-gh-actions-docker',
    lang: 'java',
    title: 'GitHub Actions - Docker 빌드/푸시',
    file: 'docker.yml',
    code: `name: docker
on:
  push:
    tags: ['v*']

jobs:
  docker:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: docker/login-action@v3
        with:
          username: \${{ secrets.DOCKER_USER }}
          password: \${{ secrets.DOCKER_TOKEN }}
      - uses: docker/build-push-action@v6
        with:
          context: .
          push: true
          tags: codemaster/api:latest`,
    explain: {
      concept:
        '이 워크플로우는 "v"로 시작하는 태그(v1.0.0 같은)를 push하면 자동으로 Docker 이미지를 빌드해서 레지스트리에 올려요. ' +
        'docker/login-action으로 Docker Hub(또는 사설 레지스트리)에 로그인한 후, build-push-action이 Dockerfile을 빌드하고 push: true 설정으로 바로 업로드해요. ' +
        'secrets 참조 문법을 통해 GitHub에 등록된 비밀값을 안전하게 주입해요. ' +
        '실무에서는 태그 기반 릴리즈와 Docker 푸시를 연계해 "태그 하나로 배포 시작" 워크플로우를 완성해요.',
      terms: [
        { t: "on.push.tags: ['v*']", d: 'v로 시작하는 Git 태그가 push될 때만 이 워크플로우를 실행해요' },
        { t: 'docker/login-action@v3', d: 'Docker 레지스트리에 로그인하는 공식 액션이에요' },
        { t: 'secrets.DOCKER_USER', d: 'GitHub Settings → Secrets에 등록된 민감 변수를 안전하게 읽어와요' },
        { t: 'docker/build-push-action@v6', d: 'Dockerfile을 빌드하고 지정된 레지스트리로 push하는 최신 액션이에요' },
        { t: 'tags: codemaster/api:latest', d: '빌드된 이미지에 붙일 태그를 지정해요. latest는 항상 최신 버전을 가리켜요' },
      ],
      why:
        '릴리스 태그를 붙이는 것만으로 Docker 이미지 빌드·푸시까지 ' +
        '완전 자동화해 사람의 실수 없는 배포 준비를 하려고요.',
      expectedOutput:
        'Actions 탭 → docker 워크플로우 로그:\n' +
        'Login Succeeded!\n' +
        'pushing codemaster/api:latest to docker.io',
      realWorldUsage:
        '실제 CI/CD 파이프라인에서 Docker 이미지 태그로 Git SHA와 버전을 동시에 붙이고, ' +
        'ArgoCD Image Updater가 새 태그를 감지해 자동으로 k8s에 배포하는 패턴이 일반적이에요.',
      pitfall:
        'Docker Hub 비밀번호를 YAML에 직접 적으면 GitHub 로그에 노출될 위험이 있어요. ' +
        '반드시 ${{ secrets.XXX }} 문법으로 GitHub Secrets에서 주입하세요.',
    },
  },
  {
    id: 'devops-gh-actions-cache',
    lang: 'java',
    title: 'GitHub Actions - Gradle 캐시',
    file: 'cache.yml',
    code: `jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-java@v4
        with:
          distribution: temurin
          java-version: 21
      - uses: actions/cache@v4
        with:
          path: |
            ~/.gradle/caches
            ~/.gradle/wrapper
          key: gradle-\${{ runner.os }}-\${{ hashFiles('**/*.gradle*', '**/gradle-wrapper.properties') }}
      - run: ./gradlew build`,
    explain: {
      concept:
        '캐시 액션은 "지난번 빌드 때 다운로드해둔 의존성을 재사용해서 빌드 시간을 확 줄이는" 장치예요. ' +
        'path에는 캐시할 디렉터리를 적고, key는 캐시를 식별하는 유일한 키예요. ' +
        'hashFiles로 build.gradle이나 gradle-wrapper.properties가 변경됐을 때만 새 캐시를 만들고, 아니면 기존 캐시를 복원해요. ' +
        '실무에서는 Gradle 의존성만 캐시해도 빌드 시간이 40~60% 단축되는 효과가 있어요.',
      terms: [
        { t: 'actions/cache@v4', d: '파일·디렉터리를 키로 저장하고 복원하는 GitHub 공식 캐시 액션이에요' },
        { t: '~/.gradle/caches', d: 'Gradle이 다운로드한 의존성 JAR들을 보관하는 디렉터리예요' },
        { t: 'key', d: '캐시를 식별하는 유일한 키예요. 이전 실행과 키가 일치해야 캐시를 복원해요' },
        { t: 'hashFiles', d: '지정한 파일들의 내용을 SHA-256 해시로 변환해 키에 포함시키는 함수예요' },
        { t: 'runner.os', d: '실행 중인 러너의 OS 이름(Linux, Windows, macOS)을 반환하는 컨텍스트 변수예요' },
      ],
      why:
        '매 빌드마다 Gradle 의존성을 처음부터 다시 다운로드하지 않아서 ' +
        'CI 대시 시간을 줄이고 GitHub Actions 분 사용량(과금)도 절약하려고요.',
      expectedOutput:
        'Actions 로그:\n' +
        'Cache restored from key: gradle-Linux-abc123def...\n' +
        'BUILD SUCCESSFUL in 12s (캐시 미적용 시 45s)',
      realWorldUsage:
        '실제 오픈소스 프로젝트(Spring Initializr 등)에서도 동일한 패턴을 써요. ' +
        '의존성만 캐시하는 대신 Gradle Build Cache를 활용하면 컴파일 결과까지 재사용할 수 있어요.',
      pitfall:
        '캐시 키가 너무 세밀하면(예: 모든 소스 파일의 해시를 포함) 매번 키가 바뀌어 캐시 적중률이 0%가 돼요. ' +
        '의존성 선언 파일만 hashFiles에 넣는 게 핵심이에요.',
    },
  },
];
