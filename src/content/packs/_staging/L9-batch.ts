import type { Snippet } from '../../types';

export const batch: Snippet[] = [
  {
    id: 'batch-job-basic',
    lang: 'java',
    title: 'JobBuilder로 Job 만들기',
    file: 'HelloJobConfig.java',
    code: `@Bean
public Job helloJob(JobRepository repo, Step step) {
  return new JobBuilder("helloJob", repo)
    .start(step)
    .build();
}`,
    explain: {
      concept: 'Job은 한 번에 실행되는 일의 큰 단위예요. 요리 레시피처럼 여러 단계(Step)를 차례로 담아요.',
      terms: [
        { t: 'JobBuilder', d: 'Job을 조립하는 도구' },
        { t: 'JobRepository', d: 'Job 실행 이력을 저장하는 창고' },
        { t: 'start(step)', d: '첫 단계를 정해요.' },
        { t: 'build()', d: 'Job을 완성해요.' },
      ],
      why: '일련의 처리 절차를 하나로 묶어 실행하려고 해요.',
      pitfall: 'Job 이름은 고유해야 이력을 구별할 수 있어요.',
    },
  },
  {
    id: 'batch-step-tasklet',
    lang: 'java',
    title: 'StepBuilder로 Tasklet Step 만들기',
    file: 'HelloStepConfig.java',
    code: `@Bean
public Step helloStep(JobRepository repo, PlatformTransactionManager tx) {
  return new StepBuilder("helloStep", repo)
    .tasklet((contribution, chunkContext) -> {
      System.out.println("hello batch");
      return RepeatStatus.FINISHED;
    }, tx)
    .build();
}`,
    explain: {
      concept: 'Step은 Job 안의 한 단계예요. Tasklet은 그 단계가 할 일을 짧게 적는 함수예요. 레시피의 한 조리 동작과 같아요.',
      terms: [
        { t: 'StepBuilder', d: 'Step을 조립하는 도구' },
        { t: 'tasklet(...)', d: '한 번 실행할 동작' },
        { t: 'RepeatStatus.FINISHED', d: '이 단계 끝났어요.' },
        { t: 'PlatformTransactionManager', d: '트랜잭션 담당' },
      ],
      why: '간단한 일회성 작업을 만들려고 해요.',
      pitfall: 'CONTINUABLE을 리턴하면 무한 반복해요.',
    },
  },
  {
    id: 'batch-chunk-step',
    lang: 'java',
    title: '청크 단위 Step 정의',
    file: 'ChunkStepConfig.java',
    code: `@Bean
public Step chunkStep(JobRepository repo, PlatformTransactionManager tx,
                     ItemReader<String> reader, ItemWriter<String> writer) {
  return new StepBuilder("chunkStep", repo)
    .chunk(10, tx)
    .reader(reader)
    .writer(writer)
    .build();
}`,
    explain: {
      concept: 'chunk는 데이터를 한 묶음씩 처리하는 단위예요. 배달 기사가 한 번에 10개씩 나르는 것과 같아요.',
      terms: [
        { t: 'chunk(10, tx)', d: '10개씩 한 묶음으로 처리해요.' },
        { t: 'reader', d: '데이터를 읽어오는 담당' },
        { t: 'writer', d: '처리한 데이터를 써요.' },
      ],
      why: '대량 데이터를 일정 단위로 끊어 메모리를 절약해요.',
      pitfall: '청크 크기가 너무 크면 메모리가 턱 질려요.',
    },
  },
  {
    id: 'batch-item-reader-list',
    lang: 'java',
    title: 'ListItemReader로 리스트 읽기',
    file: 'ListReaderConfig.java',
    code: `@Bean
public ItemReader<String> nameReader() {
  List<String> names = List.of("kim", "lee", "park");
  return new ListItemReader<>(names);
}`,
    explain: {
      concept: 'ListItemReader는 미리 만들어둔 리스트에서 한 개씩 꺼내 읽어요. 상자에서 물건을 하나씩 빼는 것과 같아요.',
      terms: [
        { t: 'ListItemReader', d: '리스트에서 읽는 리더' },
        { t: 'List.of(...)', d: '읽을 데이터 묶음' },
      ],
      why: '간단한 테스트나 작은 데이터를 처리할 때 써요.',
      pitfall: '재시작 시 같은 인스턴스를 재사용하면 이미 다 읽은 상태예요.',
    },
  },
  {
    id: 'batch-item-processor',
    lang: 'java',
    title: 'ItemProcessor로 값 변환',
    file: 'UpperProcessor.java',
    code: `@Bean
public ItemProcessor<String, String> upperProcessor() {
  return item -> item.toUpperCase();
}`,
    explain: {
      concept: 'ItemProcessor는 읽은 데이터를 가공하는 가공기예요. 사과를 깎아 손질하는 것과 같아요.',
      terms: [
        { t: 'ItemProcessor', d: '데이터를 가공하는 함수' },
        { t: 'String, String', d: '입력 타입, 출력 타입' },
        { t: 'toUpperCase()', d: '대문자로 바꿔요.' },
      ],
      why: '읽기와 쓰기 사이에 변환/필터링을 넣으려고 해요.',
      pitfall: 'null을 리턴하면 그 항목은 건너뛰어요.',
    },
  },
  {
    id: 'batch-item-writer',
    lang: 'java',
    title: 'ItemWriter로 리스트 쓰기',
    file: 'PrintWriterConfig.java',
    code: `@Bean
public ItemWriter<String> printWriter() {
  return chunk -> {
    for (String item : chunk) {
      System.out.println("write: " + item);
    }
  };
}`,
    explain: {
      concept: 'ItemWriter는 가공된 데이터 묶음을 어딘가에 써요. 포장한 물건을 창고에 넣는 것과 같아요.',
      terms: [
        { t: 'ItemWriter', d: '데이터를 쓰는 담당' },
        { t: 'chunk', d: '한 묶음 데이터' },
      ],
      why: 'DB나 파일 등에 배치 결과를 저장하려고 해요.',
      pitfall: '한 번에 여러 건을 받으므로 for로 모두 처리해야 해요.',
    },
  },
  {
    id: 'batch-job-parameters',
    lang: 'java',
    title: 'JobParameters로 실행 인자 받기',
    file: 'ParamTasklet.java',
    code: `@Bean
@JobScope
public Step paramStep(JobRepository repo, PlatformTransactionManager tx,
                     @Value("#{jobParameters['date']}") String date) {
  return new StepBuilder("paramStep", repo)
    .tasklet((contribution, ctx) -> {
      System.out.println("run date: " + date);
      return RepeatStatus.FINISHED;
    }, tx)
    .build();
}`,
    explain: {
      concept: 'JobParameters는 실행할 때마다 외부에서 주는 인자예요. 요리할 때마다 다른 재료를 넣는 것과 같아요.',
      terms: [
        { t: '@JobScope', d: 'Job 실행 시점에 Step 빈을 만들어 파라미터를 주입 받아요.' },
        { t: '@Value', d: '잡 파라미터를 SpEL로 주입해요.' },
        { t: 'date', d: '실행 시 넘겨받은 날짜' },
      ],
      why: '같은 Job이라도 실행마다 다른 값으로 돌릴 수 있어요.',
      pitfall: '@JobScope 없이 Step 빈에서 #{jobParameters}를 참조하면 앱 시작 시 BeanCreationException이 발생해요.',
    },
  },
  {
    id: 'batch-job-launcher',
    lang: 'java',
    title: 'JobLauncher로 Job 실행',
    file: 'RunJob.java',
    code: `@Component
public class RunJob {

  private final JobLauncher launcher;
  private final Job helloJob;

  public RunJob(JobLauncher launcher, Job helloJob) {
    this.launcher = launcher;
    this.helloJob = helloJob;
  }

  public void run() throws Exception {
    launcher.run(helloJob, new JobParametersBuilder()
        .addString("date", "2026-07-01")
        .toJobParameters());
  }
}`,
    explain: {
      concept: 'JobLauncher는 만들어둔 Job을 실제로 출발시키는 버튼이에요. 파라미터와 함께 실행해요.',
      terms: [
        { t: 'JobLauncher', d: 'Job을 실행하는 버튼' },
        { t: 'JobParametersBuilder', d: '파라미터를 만드는 도구' },
        { t: 'toJobParameters()', d: '파라미터 묶음으로 완성해요.' },
      ],
      why: '스케줄러/컨트롤러에서 Job을 실행하려고 해요.',
      pitfall: '같은 파라미터로 재실행하면 중복 실행 오류가 떠요.',
    },
  },
  {
    id: 'batch-job-scope',
    lang: 'java',
    title: '@JobScope로 빈 지연 생성',
    file: 'ScopedStepConfig.java',
    code: `@Bean
@JobScope
public Step scopedStep(JobRepository repo, PlatformTransactionManager tx,
                       @Value("#{jobParameters['date']}") String date) {
  return new StepBuilder("scopedStep", repo)
    .tasklet((c, ctx) -> {
      System.out.println(date);
      return RepeatStatus.FINISHED;
    }, tx)
    .build();
}`,
    explain: {
      concept: '@JobScope는 Job이 실행될 때마다 빈을 새로 만드는 표시예요. 실행 시점에 파라미터를 끌어다 쓸 수 있어요.',
      terms: [
        { t: '@JobScope', d: 'Job 실행마다 빈을 새로 만들어요.' },
        { t: '@Value', d: '실행 파라미터를 SpEL로 주입해요.' },
      ],
      why: '실행 파라미터를 빈에 주입하려고 해요.',
      pitfall: '@JobScope 없으면 빈이 앱 시작 시 만들어져 파라미터가 없어요.',
    },
  },
  {
    id: 'batch-step-scope',
    lang: 'java',
    title: '@StepScope로 Step마다 빈 생성',
    file: 'StepScopeReader.java',
    code: `@Bean
@StepScope
public ListItemReader<String> stepReader(
    @Value("#{jobParameters['date']}") String date) {
  List<String> data = /* 날짜별 데이터 로드 */ List.of(date + "-item1", date + "-item2");
  return new ListItemReader<>(data);
}`,
    explain: {
      concept: '@StepScope는 Step이 실행될 때 빈을 새로 만들어요. 각 Step 실행마다 다른 파라미터를 받아 쓸 수 있어요.',
      terms: [
        { t: '@StepScope', d: 'Step 실행마다 빈을 새로 만들어요.' },
        { t: 'loadByDate(date)', d: '날짜별로 데이터를 불러와요.' },
      ],
      why: '파라미터에 따라 Step 안 데이터를 바꾸려고 해요.',
      pitfall: '@StepScope를 안 붙이면 한 번 만든 리더가 재사용돼요.',
    },
  },
  {
    id: 'batch-flat-file-reader',
    lang: 'java',
    title: 'FlatFileItemReader로 파일 읽기',
    file: 'CsvReaderConfig.java',
    code: `@Bean
@StepScope
public FlatFileItemReader<String> csvReader(
    @Value("#{jobParameters['file']}") String path) {
  return new FlatFileItemReaderBuilder<String>()
    .name("csvReader")
    .resource(new FileSystemResource(path))
    .lineMapper((line, num) -> line)
    .build();
}`,
    explain: {
      concept: 'FlatFileItemReader는 한 줄씩 텍스트 파일을 읽어요. 줄마다 객체로 바꿔주는 lineMapper를 써요.',
      terms: [
        { t: 'FlatFileItemReaderBuilder', d: '텍스트 파일 리더 빌더' },
        { t: 'FileSystemResource', d: '파일 위치' },
        { t: 'lineMapper', d: '한 줄을 객체로 바꿔요.' },
      ],
      why: 'CSV/로그 파일을 읽어 배치를 돌리려고 해요.',
      pitfall: '파일이 없으면 시작부터 실패해요.',
    },
  },
  {
    id: 'batch-jdbc-cursor-reader',
    lang: 'java',
    title: 'JdbcCursorItemReader로 DB 읽기',
    file: 'UserReaderConfig.java',
    code: `@Bean
@StepScope
public JdbcCursorItemReader<User> jdbcUserReader(DataSource dataSource) {
  return new JdbcCursorItemReaderBuilder<User>()
    .name("jdbcUserReader")
    .dataSource(dataSource)
    .sql("SELECT id, name FROM users")
    .rowMapper((rs, i) -> new User(rs.getLong("id"), rs.getString("name")))
    .build();
}`,
    explain: {
      concept: 'JdbcCursorItemReader는 DB 커서로 한 줄씩 읽어요. 데이터 전체를 한 번에 올리지 않아 메모리에 좋아요.',
      terms: [
        { t: 'JdbcCursorItemReaderBuilder', d: 'DB 커서 리더 빌더' },
        { t: 'dataSource', d: 'DB 연결 통로' },
        { t: 'sql', d: '실행할 SELECT' },
        { t: 'rowMapper', d: '한 줄을 객체로 바꿔요.' },
      ],
      why: '대량 데이터를 메모리 절약하며 읽으려고 해요.',
      pitfall: '커서가 열린 동안 연결을 잡고 있어요.',
    },
  },
  {
    id: 'batch-jpa-paging-reader',
    lang: 'java',
    title: 'JpaPagingItemReader로 페이지 읽기',
    file: 'PagingReaderConfig.java',
    code: `@Bean
@StepScope
public JpaPagingItemReader<User> userReader(EntityManagerFactory emf) {
  return new JpaPagingItemReaderBuilder<User>()
    .name("userReader")
    .entityManagerFactory(emf)
    .queryString("SELECT u FROM User u WHERE u.active = true")
    .pageSize(100)
    .build();
}`,
    explain: {
      concept: 'JpaPagingItemReader는 한 페이지씩 JPA로 읽어요. 책장을 한 장씩 넘겨 읽는 것과 같아요.',
      terms: [
        { t: 'JpaPagingItemReaderBuilder', d: 'JPA 페이징 리더 빌더' },
        { t: 'queryString', d: 'JPQL 질의' },
        { t: 'pageSize(100)', d: '100개씩 한 페이지로 읽어요.' },
      ],
      why: 'JPA를 쓰는 앱에서 페이지별로 안전하게 읽으려고 해요.',
      pitfall: '한 트랜잭션 안에서 읽은 엔티티를 수정하면 더러워져요.',
    },
  },
  {
    id: 'batch-jdbc-batch-writer',
    lang: 'java',
    title: 'JdbcBatchItemWriter로 DB 쓰기',
    file: 'InsertWriterConfig.java',
    code: `@Bean
public JdbcBatchItemWriter<User> userWriter(DataSource dataSource) {
  String sql = "INSERT INTO audit (id, name) VALUES (:id, :name)";
  return new JdbcBatchItemWriterBuilder<User>()
    .dataSource(dataSource)
    .sql(sql)
    .beanMapped()
    .build();
}`,
    explain: {
      concept: 'JdbcBatchItemWriter는 여러 건을 한 번에 INSERT해요. 상자에 담아 한 번에 보내는 것과 같아요.',
      terms: [
        { t: 'JdbcBatchItemWriterBuilder', d: 'JDBC 배치 쓰기 빌더' },
        { t: 'sql', d: '실행할 INSERT' },
        { t: ':id, :name', d: '객체 필드를 파라미터로 써요.' },
        { t: 'beanMapped()', d: '빈 필드를 자동 매핑해요.' },
      ],
      why: '대량 INSERT를 빠르게 하려고 해요.',
      pitfall: '필드 이름과 파라미터 이름이 같아야 해요.',
    },
  },
  {
    id: 'batch-jpa-item-writer',
    lang: 'java',
    title: 'JpaItemWriter로 JPA 쓰기',
    file: 'JpaWriterConfig.java',
    code: `@Bean
public JpaItemWriter<User> jpaWriter(EntityManagerFactory emf) {
  JpaItemWriter<User> writer = new JpaItemWriter<>();
  writer.setEntityManagerFactory(emf);
  return writer;
}`,
    explain: {
      concept: 'JpaItemWriter는 리스트의 엔티티를 JPA로 저장해요. 창고 담당이 박스를 그대로 선반에 올리는 것과 같아요.',
      terms: [
        { t: 'JpaItemWriter', d: 'JPA로 저장하는 라이터' },
        { t: 'setEntityManagerFactory', d: '저장에 쓸 JPA 공장' },
      ],
      why: 'JPA 엔티티를 그대로 저장하려고 해요.',
      pitfall: '엔티티가 아니면 쓸 수 없어요.',
    },
  },
  {
    id: 'batch-composite-processor',
    lang: 'java',
    title: 'CompositeItemProcessor로 변환 이어붙이기',
    file: 'CompositeProcessorConfig.java',
    code: `@Bean
public CompositeItemProcessor<String, String> compositeProcessor(
    ItemProcessor<String, String> trim,
    ItemProcessor<String, String> upper) {
  CompositeItemProcessor<String, String> p = new CompositeItemProcessor<>();
  p.setDelegates(List.of(trim, upper));
  return p;
}`,
    explain: {
      concept: 'CompositeItemProcessor는 여러 변환기를 한 줄로 이어붙여요. 첫 변환 → 다음 변환 순서로 데이터가 흘러가요.',
      terms: [
        { t: 'CompositeItemProcessor', d: '프로세서들을 이어붙이는 도구' },
        { t: 'setDelegates', d: '차례로 실행할 프로세서 목록' },
        { t: 'List.of(trim, upper)', d: '순서대로 실행돼요.' },
      ],
      why: '여러 가공 단계를 깔끔하게 묶으려고 해요.',
      pitfall: '타입이 맞아야 이어져요 (A→B, B→C).',
    },
  },
  {
    id: 'batch-chunk-listener',
    lang: 'java',
    title: 'ChunkListener로 청크마다 로그',
    file: 'LogChunkListener.java',
    code: `@Bean
public Step listeningStep(JobRepository repo, PlatformTransactionManager tx,
                         ItemReader<String> reader, ItemWriter<String> writer) {
  return new StepBuilder("listeningStep", repo)
    .chunk(10, tx)
    .reader(reader)
    .writer(writer)
    .listener(new ChunkListener() {
      @Override
      public void afterChunk(ChunkContext context) {
        System.out.println("chunk done");
      }
    })
    .build();
}`,
    explain: {
      concept: 'ChunkListener는 청크가 끝날 때마다 불려요. 한 박스를 실을 때마다 확인 도장을 찍는 것과 같아요.',
      terms: [
        { t: 'listener', d: '이벤트를 듣는 담당자' },
        { t: 'afterChunk', d: '청크 처리 뒤에 불려요.' },
        { t: 'ChunkContext', d: '이 청크의 정보 상자' },
      ],
      why: '진행 상황을 모니터링하려고 해요.',
      pitfall: 'before/after를 헷갈리지 마세요.',
    },
  },
  {
    id: 'batch-job-execution-listener',
    lang: 'java',
    title: 'JobExecutionListener로 시작/끝 로그',
    file: 'LogJobConfig.java',
    code: `@Bean
public Job loggingJob(JobRepository repo, Step step) {
  return new JobBuilder("loggingJob", repo)
    .listener(new JobExecutionListener() {
      @Override
      public void beforeJob(JobExecution exec) {
        System.out.println("start");
      }
      @Override
      public void afterJob(JobExecution exec) {
        System.out.println("done");
      }
    })
    .start(step)
    .build();
}`,
    explain: {
      concept: 'JobExecutionListener는 Job이 시작할 때와 끝날 때 불려요. 공연 시작과 끝에 장면을 알리는 것과 같아요.',
      terms: [
        { t: 'JobExecutionListener', d: 'Job 시작/끝을 듣는 담당' },
        { t: 'beforeJob', d: '시작 직전에 불려요.' },
        { t: 'afterJob', d: '끝난 직후에 불려요.' },
        { t: 'JobExecution', d: '이번 실행의 이력 상자' },
      ],
      why: 'Job 시작/종료 공통 작업을 넣으려고 해요.',
      pitfall: 'afterJob은 실패한 경우에도 불려요.',
    },
  },
  {
    id: 'batch-flow-decision',
    lang: 'java',
    title: 'Flow로 분기 Step 결정',
    file: 'FlowJobConfig.java',
    code: `@Bean
public Job flowJob(JobRepository repo, Step ok, Step fallback) {
  return new JobBuilder("flowJob", repo)
    .start(ok)
    .on("FAILED").to(fallback)
    .from(ok).on("*").end()
    .build();
}`,
    explain: {
      concept: 'Flow는 Step 결과에 따라 다음 Step을 골라요. 길에서 표지판을 보고 갈림길을 정하는 것과 같아요.',
      terms: [
        { t: 'on("FAILED")', d: '이전 Step이 실패면' },
        { t: 'to(fallback)', d: '이 Step으로 가요.' },
        { t: 'from(ok).on("*")', d: '모든 결과에 대해' },
        { t: 'end()', d: '흐름을 끝내요.' },
      ],
      why: '실패 시 복구 Step 등 조건부 흐름을 만들려고 해요.',
      pitfall: '상태 코드는 대소문자를 가려요.',
    },
  },
  {
    id: 'batch-decider',
    lang: 'java',
    title: 'JobExecutionDecider로 분기',
    file: 'DeciderJobConfig.java',
    code: `@Bean
public Job deciderJob(JobRepository repo, Step work, Step skip,
                     JobExecutionDecider decider) {
  return new JobBuilder("deciderJob", repo)
    .start(work)
    .on("*").to(decider)
    .on("CONTINUE").end()
    .on("SKIP").to(skip)
    .end()
    .build();
}`,
    explain: {
      concept: 'JobExecutionDecider는 별도 객체로 다음 갈림길을 결정해요. 교차로의 신호등처럼 독립적으로 판단해요.',
      terms: [
        { t: 'JobExecutionDecider', d: '흐름을 결정하는 객체' },
        { t: '.on("*").to(decider)', d: 'work 이후 모든 결과를 decider로 넘겨요.' },
        { t: 'on("CONTINUE")', d: 'decider가 CONTINUE를 반환하면 Job을 끝내요.' },
        { t: 'on("SKIP")', d: 'decider가 SKIP을 반환하면 skip Step으로 가요.' },
      ],
      why: '복잡한 조건 판단을 Step과 분리하려고 해요.',
      pitfall: 'decider가 돌려주는 값은 on과 정확히 일치해야 해요.',
    },
  },
];
