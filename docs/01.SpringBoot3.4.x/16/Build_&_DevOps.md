# Build & DevOps
## Official Documentation
- [Building Container Images & Buildpacks](https://docs.spring.io/spring-boot/docs/current/reference/htmlsingle/#build.buildpacks)
## 핵심 개념
> Spring Boot의 Maven/Gradle 플러그인을 통해 Cloud Native Buildpacks 기반으로 Docker 이미지를 자동 생성할 수 있다. 빌드 설정을 커스터마이징하여 Paketo 빌더, JVM 옵션, 이미지 네임 공간 등을 제어할 수 있으며, CI/CD 파이프라인과의 통합도 용이하다.
## 학습 목표
- Spring Boot Maven/Gradle 플러그인으로 `build-image` 태스크 실행하기
- Cloud Native Buildpacks(Paketo)의 동작 원리 이해하기
- Docker Hub/Private Registry에 이미지 푸시하기
- 빌드 이미지의 JVM 옵션, 환경 변수 커스터마이징하기
- CI/CD(GitHub Actions, Jenkins)와 연동하기
## 예제 코드
```java
// pom.xml - spring-boot-maven-plugin 설정
<plugin>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-maven-plugin</artifactId>
    <configuration>
        <image>
            <name>myregistry.azurecr.io/${project.artifactId}:${project.version}</name>
            <env>
                <BP_JVM_VERSION>21</BP_JVM_VERSION>
                <JAVA_TOOL_OPTIONS>-Xmx256m</JAVA_TOOL_OPTIONS>
            </env>
        </image>
    </configuration>
</plugin>
```

```bash
# Maven으로 Docker 이미지 빌드
./mvnw spring-boot:build-image

# Gradle로 Docker 이미지 빌드
./gradlew bootBuildImage

# 이미지 실행
docker run -p 8080:8080 myapp:0.0.1-SNAPSHOT
```
## 주요 패턴
- Layered JAR: 계층형 JAR 구조로 이미지 레이어 캐싱 최적화
- Binding volumes: Cloud Native Bindings를 통한 외부 설정 마운트
- Multi-stage build: Buildpacks가 내부적으로 빌더/런타임 이미지 분리
- 환경 변수 기반 설정: `BP_*` 접두사로 Buildpacks 동작 제어
## 주의사항
- `build-image`는 Docker 데몬이 실행 중이어야 동작한다
- JVM 버전은 `BP_JVM_VERSION`으로 명시하지 않으면 기본값(17)이 사용된다
- 사내 레지스트리 사용 시 인증 정보를 `~/.docker/config.json` 또는 환경 변수로 제공해야 한다
- 윈도우 환경에서는 Docker Desktop의 Linux 컨테이너 모드가 필요할 수 있다
