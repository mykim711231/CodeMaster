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
      concept: 'plugins는 빌드에 쓸 도구를 고르는 곳이에요. 스프링 부트 도구를 켜면 실행 가능한 JAR과 의존성 관리가 편해져요.',
      terms: [
        { t: "id 'java'", d: '자바 빌드 지원 플러그인' },
        { t: 'org.springframework.boot', d: '스프링 부트 빌드 도구' },
        { t: 'io.spring.dependency-management', d: '버전 관리(BOM) 도구' },
        { t: 'group', d: '조직/패키지 그룹명' },
        { t: 'JavaLanguageVersion.of(21)', d: '자바 21 툴체인 지정' },
      ],
      why: '스프링 부트 앱을 표준 방식으로 빌드·실행하려고요.',
      pitfall: '플러그인 버전은 명시하세요. 안 하면 구버전이 잡힐 수 있어요.',
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
      concept: 'dependencies는 요리 재료 목록이에요. 역할별로 implementation, runtimeOnly, testImplementation 등을 구분해 담아요.',
      terms: [
        { t: 'implementation', d: '컴파일+런타임에 쓰는 의존성' },
        { t: 'runtimeOnly', d: '런타임에만 필요 (예: DB 드라이버)' },
        { t: 'compileOnly', d: '컴파일에만 필요 (예: Lombok)' },
        { t: 'annotationProcessor', d: '어노테이션 처리기 등록' },
        { t: 'testImplementation', d: '테스트 전용 의존성' },
      ],
      why: '필요한 만큼만 노출해 빌드와 보안을 깔끔하게 하려고요.',
      pitfall: 'Lombok은 annotationProcessor도 같이 넣어야 동작해요.',
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
      concept: 'settings.gradle은 큰 프로젝트를 여러 방으로 나누는 설계도예요. 어떤 모듈이 있는지 알려주고, 이름도 바꿀 수 있어요.',
      terms: [
        { t: 'rootProject.name', d: '전체 프로젝트 이름' },
        { t: 'include', d: '하위 모듈 포함 선언' },
        { t: "include 'core-domain'", d: '도메인 모듈 포함' },
        { t: "project(':web-api').name", d: '모듈 표시 이름만 변경 (경로는 :web-api 유지)' },
        { t: ':', d: '모듈 경로 구분자' },
      ],
      why: '관심사별로 모듈을 나눠 빌드·협업을 쉽게 하려고요.',
      pitfall: 'project(경로).name은 표시 이름만 바꿔요. 의존성 참조 경로(:web-api)는 그대로예요.',
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
      concept: '한 모듈이 다른 모듈을 쓸 때 project 경로로 연결해요. 마치 집 안의 방들이 복도로 이어지는 것 같아요.',
      terms: [
        { t: "project(':core-domain')", d: '다른 모듈 의존성 — 경로는 settings.gradle의 include명과 일치' },
        { t: 'implementation project()', d: '런타임+컴파일 의존' },
        { t: 'sourceSets.test.output', d: '테스트 픽스처 공유' },
        { t: 'web-api/build.gradle', d: '하위 모듈 빌드 파일' },
        { t: "':persistence-jpa'", d: 'settings.gradle의 include 경로와 정확히 일치시켜야 빌드 에러 없음' },
      ],
      why: '모듈끼리 재사용 가능하게 만들고 순환 의존을 막으려고요.',
      pitfall: "project 경로는 settings.gradle의 include 이름과 정확히 일치해야 해요. ':persistence'가 아니라 ':persistence-jpa'예요.",
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
      concept: '멀티스테이지는 공장에서 조립한 뒤 포장만 배송하듯, 빌드 단계에서 만든 결과물만 작은 런타임 이미지로 옮겨요.',
      terms: [
        { t: 'FROM ... AS build', d: '빌드 단계 이름 지정' },
        { t: 'RUN gradle bootJar', d: 'JAR 빌드 명령' },
        { t: 'eclipse-temurin:21-jre', d: '가벼운 자바 런타임 이미지' },
        { t: 'COPY --from=build', d: '이전 단계 결과 복사' },
        { t: 'ENTRYPOINT ["java", "-jar", "app.jar"]', d: 'exec form — 큰따옴표 JSON 배열만 유효한 exec form이에요' },
      ],
      why: '최종 이미지 크기를 줄이고 보안을 강화하려고요.',
      pitfall: "ENTRYPOINT에 작은따옴표 배열([ 'java',...])을 쓰면 exec form이 아니라 셸 문자열로 처리돼 컨테이너가 시작 실패해요.",
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
      concept: 'ARG는 빌드 시, ENV는 실행 시 사용하는 값이에요. 메모리 옵션과 시간대처럼 환경마다 바꾸는 값을 밖에서 주입해요.',
      terms: [
        { t: 'ARG', d: '빌드 시점 변수' },
        { t: 'ENV', d: '컨테이너 환경 변수' },
        { t: 'JAVA_OPTS', d: 'JVM 옵션을 담은 변수' },
        { t: 'EXPOSE', d: '사용 포트 안내' },
        { t: 'CMD ["sh", "-c", "..."]', d: '셸을 거쳐 환경변수 $JAVA_OPTS 를 확장한 뒤 실행 — 큰따옴표 JSON 배열 필수' },
      ],
      why: '이미지를 다시 빌드하지 않고 설정만 바꾸려고요.',
      pitfall: "CMD/ENTRYPOINT에 작은따옴표 배열을 쓰면 exec form이 아니에요. 반드시 큰따옴표 JSON 배열로 작성하세요.",
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
      concept: 'compose는 여러 컨테이너를 한 번에 띄우는 지휘자예요. 앱과 DB를 함께 실행하고, DB가 건강할 때까지 앱을 기다려요.',
      terms: [
        { t: 'services', d: '실행할 컨테이너 목록' },
        { t: 'depends_on', d: '의존 컨테이너와 시작 조건' },
        { t: 'condition: service_healthy', d: '헬스체크 통과까지 대기 — db에 healthcheck가 없으면 영원히 대기해요' },
        { t: 'healthcheck', d: 'DB 가동 여부를 주기적으로 확인하는 검사 설정' },
        { t: 'pg_isready', d: 'PostgreSQL 접속 가능 여부 확인 명령' },
      ],
      why: '로컬/테스트 환경을 한 명령(docker compose up)으로 띄우려고요.',
      pitfall: 'DB 비번을 그대로 두면 위험해요. 실제론 .env나 secret을 쓰세요.',
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
      concept: '네트워크를 나누면 사무실 동별 출입 통제처럼 외부에 노출되는 구간과 내부 전용 구간을 분리할 수 있어요.',
      terms: [
        { t: 'networks', d: '컨테이너가 참여할 네트워크 목록' },
        { t: 'frontend', d: '외부 노출 네트워크' },
        { t: 'backend', d: '내부 전용 네트워크' },
        { t: 'internal: true', d: '외부 연결 차단' },
        { t: 'ports', d: '호스트:컨테이너 포트 매핑' },
      ],
      why: 'DB를 외부에서 못 보게 하여 보안을 강화하려고요.',
      pitfall: '같은 네트워크에 있어야 서비스 이름으로 통신 가능해요.',
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
      concept: 'Deployment는 몇 개의 복제본을 유지할지 정하는 작전서예요. 3개로 설정하면 쿠버네티스가 항상 3개를 유지해요.',
      terms: [
        { t: 'apiVersion: apps/v1', d: 'API 그룹과 버전' },
        { t: 'kind: Deployment', d: '리소스 종류' },
        { t: 'replicas: 3', d: '유지할 파드 개수' },
        { t: 'selector.matchLabels', d: '관리할 파드 선택 기준' },
        { t: 'resources.limits', d: '파드 자원 상한' },
      ],
      why: '장애가 나도 자동으로 복구되는 서비스를 만들려고요.',
      pitfall: 'labels가 selector와 안 맞으면 파드가 안 달라붙어요.',
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
      concept: 'Service는 파드들 앞의 안내소예요. 파드는 죽고 살아나 IP가 바뀌어도, 서비스 이름으로 항상 같은 곳으로 인입해요.',
      terms: [
        { t: 'kind: Service', d: '서비스 리소스' },
        { t: 'type: ClusterIP', d: '클러스터 내부 전용 IP' },
        { t: 'selector', d: '연결할 파드 라벨' },
        { t: 'port: 80', d: '서비스가 받는 포트' },
        { t: 'targetPort: 8080', d: '파드가 듣는 포트' },
      ],
      why: '파드 IP 변동에 흔들리지 않고 안정적으로 라우팅하려고요.',
      pitfall: 'type을 생략하면 ClusterIP라 외부에서 못 봐요.',
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
      concept: 'Ingress는 건물 정문 안내데스크예요. 도메인과 경로를 보고 어느 서비스(층)로 안내할지 정해요.',
      terms: [
        { t: 'ingressClassName', d: '사용할 인그레스 컨트롤러' },
        { t: 'rules', d: '라우팅 규칙 목록' },
        { t: 'host', d: '도메인 이름' },
        { t: 'pathType: Prefix', d: '경로 접두사 매칭' },
        { t: 'backend.service', d: '연결할 서비스' },
      ],
      why: '여러 서비스를 하나의 도메인+경로로 깔끔하게 나누려고요.',
      pitfall: 'rewrite-target을 안 맞추면 경로가 중복 붙어요.',
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
      concept: 'ConfigMap은 일반 설정, Secret은 비밀번호 같은 민감값을 담아요. 코드와 설정을 분리해 같은 이미지로 여러 환경을 돌려요.',
      terms: [
        { t: 'ConfigMap', d: '설정값 저장 객체' },
        { t: 'data', d: '키-값 설정 데이터' },
        { t: 'Secret', d: '민감값 저장 객체' },
        { t: 'type: Opaque', d: '일반 비밀 타입' },
        { t: 'stringData', d: '평문을 그대로 넣는 필드 — k8s가 base64로 변환해 저장해요 (data: 필드는 직접 base64 값을 넣어야 해요)' },
      ],
      why: '비밀을 이미지에 굽지 않고 런타임에 주입하려고요.',
      pitfall: 'stringData는 평문, data는 base64 값을 써야 해요. Secret은 etcd 암호화를 켜지 않으면 실제로는 암호화되지 않아요. RBAC로 접근을 잠가요.',
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
      concept: 'Probe는 의사가 환자를 주기적으로 진찰하는 것 같아요. 살아있는지(liveness), 손님 받을 준비가 됐는지(readiness) 검사해요.',
      terms: [
        { t: 'livenessProbe', d: '파드가 살아있는지 검사' },
        { t: 'readinessProbe', d: '트래픽 받을 준비가 됐는지 검사' },
        { t: 'httpGet', d: 'HTTP 요청으로 검사' },
        { t: 'initialDelaySeconds', d: '검사 시작 전 대기 시간' },
        { t: 'periodSeconds', d: '검사 반복 주기' },
      ],
      why: '죽은 파드는 재시작하고 준비 안 된 파드는 트래픽에서 빼려고요.',
      pitfall: 'initialDelay를 너무 짧게 두면 앱이 뜨기도 전에 실패로 몰아요.',
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
      concept: 'HPA는 식당 대기 인원이 많아지면 직원을 늘리고, 적어지면 줄이는 매니저예요. CPU 사용량 같은 지표로 파드 수를 자동 조절해요.',
      terms: [
        { t: 'HorizontalPodAutoscaler', d: '파드 수 자동 스케일 리소스' },
        { t: 'scaleTargetRef', d: '조절 대상 Deployment' },
        { t: 'minReplicas', d: '최소 파드 수' },
        { t: 'maxReplicas', d: '최대 파드 수' },
        { t: 'averageUtilization: 70', d: '평균 CPU 70% 목표' },
      ],
      why: '트래픽 변화에 맞춰 자원을 자동으로 늘리거나 줄이려고요.',
      pitfall: '리소스 limits가 없으면 HPA가 측정을 못 해요.',
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
      concept: 'Helm Chart는 쿠버네티스 YAML들을 하나의 패키지로 묶은 레시피예요. 버전과 의존 서비스까지 한 번에 관리해요.',
      terms: [
        { t: 'apiVersion: v2', d: '차트 API 버전' },
        { t: 'name', d: '차트 이름' },
        { t: 'version', d: '차트 버전' },
        { t: 'appVersion', d: '앱 자체 버전' },
        { t: "version: '^15.0.0'", d: 'semver 범위 — Helm은 ^, ~, >= < 형식을 사용해요. x.x 형식은 무효예요.' },
      ],
      why: '복잡한 배포 YAML을 버전 관리하고 재사용하려고요.',
      pitfall: "차트 버전과 appVersion은 다른 의미예요. 의존성 version에 '15.x.x' 같은 형식은 Helm이 인식하지 못해요.",
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
      concept: 'values.yaml은 차트의 설정 다이얼이에요. 같은 차트를 환경마다 다른 값(dev/prod)으로 찍어낼 수 있어요.',
      terms: [
        { t: 'replicaCount', d: '복제본 수 값' },
        { t: 'image.repository', d: '이미지 저장소 경로' },
        { t: 'pullPolicy', d: '이미지 가져오기 정책' },
        { t: 'service.type', d: '서비스 타입' },
        { t: 'postgresql.enabled', d: '의존 차트 활성 여부' },
      ],
      why: '하나의 차트로 여러 환경을 값만 바꿔 배포하려고요.',
      pitfall: '운영 비밀값은 values에 두지 말고 외부 secret을 쓰세요.',
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
      concept: '템플릿은 values.yaml의 값을 채워 넣는 빈칸 채우기 시트예요. 렌더링하면 일반 쿠버네티스 YAML이 돼요.',
      terms: [
        { t: '{{ .Values }}', d: 'values.yaml에 접근' },
        { t: '.Values.replicaCount', d: '복제본 수 읽기' },
        { t: 'replace', d: '문자열 치환 함수' },
        { t: '|', d: '파이프라인(값 전달)' },
        { t: '.Values.image.tag', d: '이미지 태그' },
      ],
      why: '설정과 매니페스트를 분리해 반복 작성을 줄이려고요.',
      pitfall: '값에 슬래시가 있으면 리소스 이름 규칙에 어긋나요. replace로 다듬으세요.',
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
      concept: 'GitHub Actions는 코드를 push하면 로봇이 알아서 빌드·테스트하는 자동화 도구예요. main 브랜치에 변화가 생기면 실행돼요.',
      terms: [
        { t: 'name', d: '워크플로우 이름' },
        { t: 'on.push', d: 'push 시 트리거' },
        { t: 'branches: [main]', d: '대상 브랜치' },
        { t: 'actions/checkout@v4', d: '코드 체크아웃 액션' },
        { t: 'setup-java', d: '자바 설치 액션' },
      ],
      why: '변경 사항을 항상 빌드·테스트해 안전을 보장하려고요.',
      pitfall: './gradlew build는 이미 테스트를 포함해요. 별도 ./gradlew test 스텝을 추가하면 테스트가 두 번 실행돼요.',
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
      concept: '태그를 붙여 push하면 자동으로 이미지를 빌드해 레지스트리에 올려요. 배송 센터에 상품을 자동 적재하는 것과 같아요.',
      terms: [
        { t: "on.push.tags: ['v*']", d: 'v로 시작하는 태그 push 시 실행' },
        { t: 'docker/login-action', d: '레지스트리 로그인 액션' },
        { t: 'secrets', d: 'GitHub 비밀 저장소' },
        { t: 'build-push-action', d: '이미지 빌드+푸시 액션' },
        { t: 'tags: codemaster/api:latest', d: '이미지 태그' },
      ],
      why: '릴리스 태그만 붙이면 자동으로 배포 가능한 이미지가 만들어지게 하려고요.',
      pitfall: '비밀번호를 yml에 직접 쓰면 위험해요. 반드시 secrets를 쓰세요.',
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
      concept: '캐시는 다운로드한 의존성을 다음 실행에서 재사용하는 것 같아요. 빌드 시간이 확 줄어요.',
      terms: [
        { t: 'actions/cache@v4', d: '캐시 저장·복원 액션' },
        { t: 'path', d: '캐시할 경로 목록' },
        { t: 'key', d: '캐시 식별 키' },
        { t: 'hashFiles', d: '파일 해시로 키 생성' },
        { t: 'runner.os', d: '실행 환경 OS' },
      ],
      why: '매번 의존성을 다시 받지 않아 빌드를 빠르게 하려고요.',
      pitfall: '키가 너무 세밀하면 캐시 적중률이 떨어져요.',
    },
  },
];
