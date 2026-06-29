# Batch — Spring Batch
## Official Documentation
- [Spring Batch on Spring Boot](https://docs.spring.io/spring-boot/docs/current/reference/htmlsingle/#batch)
- [Spring Batch Reference Documentation](https://docs.spring.io/spring-batch/reference/)
## 핵심 개념
> Spring Batch는 대용량 데이터를 신뢰성 있게 처리하기 위한 배치 프레임워크로, `Job` → `Step` → `ItemReader`/`ItemProcessor`/`ItemWriter` 구조로 청크 단위 트랜잭션을 관리한다. Spring Boot 자동 설정으로 `JobLauncher`, `JobRepository`(메타데이터 DB), `TaskExecutor` 등을 기본 제공한다. 재시작·건너뛰기·다중 처리 등 엔터프라이즈 배치 처리의 핵심 관심사를 지원한다.
## 학습 목표
- `spring.batch.jdbc.initialize-schema` 로 메타데이터 테이블 자동 생성 이해하기
- `@EnableBatchProcessing` 없이도 동작하는 Spring Boot 3.x 배치 자동 설정 파악하기
- `Job` 과 `Step` 을 구성하고 `JobLauncher` 로 실행하기
- `FlatFileItemReader`, `JdbcBatchItemWriter` 등 주요 Reader/Writer 사용하기
- `ItemProcessor` 로 데이터 변환·필터링·유효성 검증 적용하기
- 청크 사이즈, 스킵·리트라이 정책, 리스너로 장애 처리 구현하기
## 예제 코드
```java
@Configuration
public class UserImportJobConfig {
    private static final int CHUNK_SIZE = 100;

    @Bean
    public Job importUserJob(JobRepository jobRepository, Step importUserStep) {
        return new JobBuilder("importUserJob", jobRepository)
            .start(importUserStep)
            .build();
    }

    @Bean
    public Step importUserStep(JobRepository jobRepository,
                               PlatformTransactionManager txManager,
                               FlatFileItemReader<User> reader,
                               UserItemProcessor processor,
                               JdbcBatchItemWriter<User> writer) {
        return new StepBuilder("importUserStep", jobRepository)
            .<User, User>chunk(CHUNK_SIZE, txManager)
            .reader(reader)
            .processor(processor)
            .writer(writer)
            .faultTolerant()
            .skip(DataIntegrityViolationException.class)
            .skipLimit(10)
            .retry(DeadlockLoserDataAccessException.class)
            .retryLimit(3)
            .listener(new StepExecutionListener() {
                public ExitStatus afterStep(StepExecution se) {
                    System.out.println("처리 건수: " + se.getWriteCount());
                    return ExitStatus.COMPLETED;
                }
            })
            .build();
    }

    @Bean
    public FlatFileItemReader<User> reader() {
        return new FlatFileItemReaderBuilder<User>()
            .name("userItemReader")
            .resource(new FileSystemResource("input/users.csv"))
            .delimited()
            .names("name", "email", "age")
            .targetType(User.class)
            .build();
    }

    @Bean
    public UserItemProcessor processor() {
        return new UserItemProcessor();
    }

    @Bean
    public JdbcBatchItemWriter<User> writer(DataSource dataSource) {
        return new JdbcBatchItemWriterBuilder<User>()
            .sql("INSERT INTO users (name, email, age) VALUES (:name, :email, :age)")
            .dataSource(dataSource)
            .beanMapped()
            .build();
    }
}
```
## 주요 패턴
- Chunk-Oriented Processing: Reader→Processor→Writer 사이클을 청크 단위로 트랜잭션 관리
- Tasklet Step: 단순 작업(파일 삭제, API 호출)은 Tasklet으로 처리
- Multi-threaded Step: `TaskExecutor` 로 Step 내에서 쓰레드 풀 기반 병렬 청크 처리
- Partitioning: Partitioner가 데이터를 논리적 파티션으로 나누고 `PartitionHandler`가 워커 Step에서 병렬 처리
- Job Parameter: 동일한 Job을 파라미터를 달리해 반복 실행, JobInstance 식별
## 주의사항
- Spring Boot 배치 자동 설정을 사용하려면 `spring.batch.job.enabled=false` 로 애플리케이션 기동 시 자동 실행을 막거나, 운영 배치 전용 프로파일에서만 `true`로 설정할 것
- ItemReader의 `saveState` 기본값이 `true`이므로 재시작 시 이미 읽은 데이터를 스킵하려면 반드시 유지할 것
- `@JobScope` / `@StepScope` 빈은 프록시 기반으로 지연 생성되므로 클래스에 `final`을 붙이면 안 됨
- `JobRepository`의 기본 격리 수준 `SERIALIZABLE`이 성능 저하를 유발할 수 있음 (운영환경 튜닝 필요)
