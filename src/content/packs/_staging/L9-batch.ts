import type { Snippet } from '../../types';

export const batch: Snippet[] = [
  {
    id: 'batch-job-basic',
    lang: 'java',
    title: 'JobBuilder로 Job 만들기',
    file: 'HelloJobConfig.java',
    code: `import org.springframework.batch.core.Job;
import org.springframework.batch.core.Step;
import org.springframework.batch.core.job.builder.JobBuilder;
import org.springframework.batch.core.repository.JobRepository;
import org.springframework.context.annotation.Bean;

@Bean
public Job helloJob(JobRepository repo, Step step) {
  System.out.println("[설정] Job 생성 — helloJob");
  return new JobBuilder("helloJob", repo)
    .start(step)
    .build();
}`,
    explain: {
      concept:
        'Job은 Spring Batch에서 한 번에 실행되는 배치 작업의 가장 큰 단위예요. ' +
        '요리 레시피처럼 여러 Step을 순서대로 담아서, 한 번에 실행할 전체 작업 흐름을 정의해요. ' +
        'JobBuilder는 Job을 조립하는 빌더 도구로, start(step)으로 첫 번째 Step을 지정하고 build()로 완성해요. ' +
        'JobRepository는 Job의 실행 이력(언제 시작했고, 성공/실패 여부, Step 진행 상황)을 DB에 저장하는 저장소예요. ' +
        '스프링 배치의 모든 상태 관리는 JobRepository를 통해 이뤄지기 때문에, 재시작 시 어디서부터 다시 시작할지 판단할 수 있어요.',
      terms: [
        { t: 'JobBuilder', d: 'Job의 이름과 실행 이력을 지정하고 Step을 순서대로 추가해서 Job을 조립하는 빌더 클래스예요.' },
        { t: 'JobRepository', d: 'Job과 Step의 실행 상태(성공/실패/진행중)를 데이터베이스에 저장하고 조회하는 저장소 인터페이스예요.' },
        { t: 'start(step)', d: 'Job의 첫 번째 Step을 지정해요. 이후 .next()로 다음 Step을 이어붙일 수 있어요.' },
        { t: 'build()', d: '설정된 Step 흐름을 바탕으로 최종 Job 객체를 생성해요. 이 Job을 JobLauncher로 실행할 수 있어요.' },
      ],
      why:
        '일련의 처리 절차를 하나의 논리적 단위로 묶어서 실행하고, 실행 이력을 DB로 관리하려고 해요. 재시작, 재처리, 모니터링이 가능해져요.',
      expectedOutput:
        '[설정] Job 생성 — helloJob',
      realWorldUsage:
        '실제 프로젝트에서 매일 밤 실행되는 정산 Job, 사용자 등급 갱신 Job, 대용량 데이터 마이그레이션 Job 등 정기적인 대량 처리 작업을 Spring Batch Job으로 정의해요. ' +
        '은행의 일일 마감 처리, 전자상거래의 매출 집계가 대표적인 배치 Job이에요.',
      pitfall:
        'Job의 이름은 스프링 배치 메타 테이블에서 실행 이력을 구분하는 키로 사용되므로, 반드시 유일해야 해요. 같은 이름의 Job을 여러 개 만들면 이력이 섞여서 재시작이 꼬일 수 있어요.',
    },
  },
  {
    id: 'batch-step-tasklet',
    lang: 'java',
    title: 'StepBuilder로 Tasklet Step 만들기',
    file: 'HelloStepConfig.java',
    code: `import org.springframework.batch.core.Step;
import org.springframework.batch.core.repository.JobRepository;
import org.springframework.batch.core.step.builder.StepBuilder;
import org.springframework.batch.repeat.RepeatStatus;
import org.springframework.context.annotation.Bean;
import org.springframework.transaction.PlatformTransactionManager;

@Bean
public Step helloStep(JobRepository repo, PlatformTransactionManager tx) {
  System.out.println("[설정] Step 생성 — helloStep");
  return new StepBuilder("helloStep", repo)
    .tasklet((contribution, chunkContext) -> {
      System.out.println("[실행] hello batch");
      return RepeatStatus.FINISHED;
    }, tx)
    .build();
}`,
    explain: {
      concept:
        'Step은 Job 안의 한 단계 작업이고, Tasklet은 그 단계에서 실행할 구체적인 작업 내용을 정의하는 함수예요. ' +
        '요리 레시피에서 "재료 썰기" 같은 개별 동작 하나에 해당해요. ' +
        'Tasklet은 단 한 번 실행되거나, RepeatStatus.CONTINUABLE을 반환하면 반복 실행할 수도 있어요. ' +
        'PlatformTransactionManager는 Step 내에서 트랜잭션을 관리하는 매니저로, 청크 단위 커밋/롤백을 처리해요. ' +
        'Tasklet은 간단한 작업(파일 삭제, 캐시 초기화, 저장 프로시저 호출 등)에 적합하고, 대량 데이터 처리는 Chunk 기반이 더 효율적이에요.',
      terms: [
        { t: 'StepBuilder', d: 'Step의 이름, 트랜잭션 매니저, Tasklet/Chunk를 설정해서 Step을 조립하는 빌더 클래스예요.' },
        { t: 'tasklet((contribution, ctx) -> {...})', d: '단일 실행 작업을 람다로 정의해요. RepeatStatus.FINISHED를 반환하면 작업이 종료돼요.' },
        { t: 'RepeatStatus.FINISHED', d: '이 Tasklet의 작업이 완료됐음을 알리는 신호예요. CONTINUABLE을 반환하면 작업을 반복해요.' },
        { t: 'PlatformTransactionManager', d: '스프링의 트랜잭션 추상화 인터페이스예요. JDBC, JPA, JTA 등 실제 구현체와 관계없이 트랜잭션을 관리해요.' },
      ],
      why:
        '간단한 일회성 작업(파일 전처리, 초기화, 알림 발송 등)을 Chunk 프로세싱의 복잡함 없이 빠르게 구현하려고 해요.',
      expectedOutput:
        '[설정] Step 생성 — helloStep\n' +
        '[실행] hello batch',
      realWorldUsage:
        '실제 프로젝트에서 배치 시작 전 임시 파일 정리, 배치 완료 후 알림 메일 발송, DB 저장 프로시저 호출 등 부수 작업을 Tasklet Step으로 구현해요. ' +
        '데이터 처리의 앞뒤에 전처리·후처리용 Tasklet을 배치하는 게 일반적인 패턴이에요.',
      pitfall:
        'CONTINUABLE을 실수로 반환하면 Tasklet이 무한히 반복 실행돼요. 횟수를 제한하지 않으면 배치가 끝나지 않는 문제가 발생해요. ' +
        '일반적인 일회성 작업에서는 항상 FINISHED를 반환해야 해요.',
    },
  },
  {
    id: 'batch-chunk-step',
    lang: 'java',
    title: '청크 단위 Step 정의',
    file: 'ChunkStepConfig.java',
    code: `import org.springframework.batch.core.Step;
import org.springframework.batch.core.repository.JobRepository;
import org.springframework.batch.core.step.builder.StepBuilder;
import org.springframework.batch.item.ItemReader;
import org.springframework.batch.item.ItemWriter;
import org.springframework.context.annotation.Bean;
import org.springframework.transaction.PlatformTransactionManager;

@Bean
public Step chunkStep(JobRepository repo, PlatformTransactionManager tx,
                     ItemReader<String> reader, ItemWriter<String> writer) {
  System.out.println("[설정] Chunk Step 생성 — 청크크기 10");
  return new StepBuilder("chunkStep", repo)
    .chunk(10, tx)
    .reader(reader)
    .writer(writer)
    .build();
}`,
    explain: {
      concept:
        'Chunk 기반 Step은 데이터를 정해진 묶음(청크) 단위로 읽고→처리하고→쓰는 반복 작업이에요. ' +
        '배달 기사가 한 번에 10개씩 상자를 나르는 것과 같아요. ItemReader가 데이터를 하나씩 읽어오면, 청크 크기(10)만큼 모인 시점에 ItemWriter로 한꺼번에 저장해요. ' +
        '청크 단위로 트랜잭션이 커밋되기 때문에, 중간에 실패해도 마지막 커밋 이후부터 재시작할 수 있어요. ' +
        '대량 데이터를 한 번에 메모리에 올리지 않고 나눠서 처리하므로, 메모리 사용량이 일정하게 유지돼요.',
      terms: [
        { t: 'chunk(10, tx)', d: '데이터를 10개씩 묶어서 하나의 트랜잭션으로 처리해요. 청크 크기가 클수록 DB 커밋 횟수가 줄어서 성능이 올라가요.' },
        { t: 'reader (ItemReader)', d: '데이터를 하나씩 읽어오는 컴포넌트예요. 파일, DB, API 등 다양한 소스에서 데이터를 공급해요.' },
        { t: 'writer (ItemWriter)', d: '청크 단위로 모인 데이터를 한 번에 저장하는 컴포넌트예요. DB INSERT, 파일 쓰기, API 호출 등을 수행해요.' },
        { t: '트랜잭션 커밋', d: '매 청크마다 tx를 통해 트랜잭션이 커밋돼요. 청크 내에서 오류가 나면 해당 청크만 롤백되고 이전 청크는 유지돼요.' },
      ],
      why:
        '수백만 건의 데이터를 한 번에 처리하면 메모리가 턱없이 부족해져요. 청크 단위로 쪼개서 메모리를 일정하게 유지하면서 처리하려고 해요.',
      expectedOutput:
        '[설정] Chunk Step 생성 — 청크크기 10',
      realWorldUsage:
        '실제 프로젝트에서 CSV 파일 100만 줄을 DB로 이관하거나, 사용자 데이터를 일괄 갱신하는 대부분의 배치 작업이 Chunk Step으로 구현돼요. ' +
        '청크 크기는 보통 10~1000 사이에서 DB 커밋 비용과 메모리 사용량을 고려해 튜닝해요.',
      pitfall:
        '청크 크기를 너무 크게 설정하면(예: 10000) 한 트랜잭션이 너무 오래 지속돼서 DB 락 경합이 심해지고, 실패 시 롤백 범위도 커져요. ' +
        '너무 작게 설정하면(예: 1) 트랜잭션 커밋 오버헤드가 커져서 전체 성능이 현저히 떨어져요.',
    },
  },
  {
    id: 'batch-item-reader-list',
    lang: 'java',
    title: 'ListItemReader로 리스트 읽기',
    file: 'ListReaderConfig.java',
    code: `import java.util.List;
import org.springframework.batch.item.ItemReader;
import org.springframework.batch.item.support.ListItemReader;
import org.springframework.context.annotation.Bean;

@Bean
public ItemReader<String> nameReader() {
  List<String> names = List.of("kim", "lee", "park");
  System.out.println("[설정] ListItemReader 생성 — 데이터 " + names.size() + "건");
  return new ListItemReader<>(names);
}`,
    explain: {
      concept:
        'ListItemReader는 미리 준비된 리스트에서 데이터를 하나씩 꺼내 읽어주는 가장 단순한 ItemReader예요. ' +
        '상자에서 물건을 하나씩 빼내는 것과 정확히 같아요. read()를 호출할 때마다 리스트의 다음 요소를 반환하고, 다 읽으면 null을 반환해요. ' +
        '전체 데이터를 미리 메모리에 올려두기 때문에, 테스트 용도나 소량 데이터 처리에만 적합해요. ' +
        '실무에서는 대신 FlatFileItemReader(파일) 또는 JdbcCursorItemReader(DB)처럼 스트리밍 방식의 Reader를 사용해요.',
      terms: [
        { t: 'ListItemReader<T>', d: 'List의 요소를 순서대로 하나씩 읽어주는 간단한 Reader예요. read() 호출마다 다음 요소를 반환해요.' },
        { t: 'List.of(...)', d: '불변 리스트를 생성하는 팩토리 메서드예요. Java 9부터 추가된 간결한 리스트 생성 방식이에요.' },
        { t: 'names.size() + "건"', d: '리스트에 담긴 데이터 개수를 확인해요. 이 개수만큼 read()가 성공적으로 호출돼요.' },
      ],
      why:
        '간단한 데모나 단위 테스트에서 Reader 역할을 빠르게 준비하려고 해요. 별도 파일이나 DB 설정 없이 즉시 데이터를 공급할 수 있어요.',
      expectedOutput:
        '[설정] ListItemReader 생성 — 데이터 3건',
      realWorldUsage:
        '실제 프로젝트에서 테스트 코드 작성 시, 테스트용 데이터를 List.of(...)로 준비해서 ListItemReader로 배치 Step을 단위 테스트해요. ' +
        '프로토타입 단계에서 실제 DB 연동 전에 배치 로직을 먼저 검증할 때도 유용해요.',
      pitfall:
        '배치가 재시작될 때 같은 ListItemReader 인스턴스를 재사용하면 이미 모든 데이터를 다 읽은 상태라서 아무것도 처리되지 않아요. ' +
        '@StepScope를 붙여서 Step 실행마다 새 인스턴스가 생성되게 하거나, 재시작 가능한 Reader를 사용해야 해요.',
    },
  },
  {
    id: 'batch-item-processor',
    lang: 'java',
    title: 'ItemProcessor로 값 변환',
    file: 'UpperProcessor.java',
    code: `import org.springframework.batch.item.ItemProcessor;
import org.springframework.context.annotation.Bean;

@Bean
public ItemProcessor<String, String> upperProcessor() {
  System.out.println("[설정] ItemProcessor 생성 — 대문자 변환");
  return item -> item.toUpperCase();
}`,
    explain: {
      concept:
        'ItemProcessor는 읽기(ItemReader)와 쓰기(ItemWriter) 사이에서 데이터를 변환하거나 필터링하는 가공기예요. ' +
        '사과를 씻고 깎아서 포장하는 중간 가공 단계와 같아요. 입력 타입(String)을 받아서 출력 타입(String)으로 변환해서 반환해요. ' +
        'null을 반환하면 해당 아이템을 건너뛰어요. 예를 들어 유효하지 않은 데이터만 null로 반환하면 필터 역할을 할 수 있어요. ' +
        'ItemProcessor는 선택 사항이에요. 변환 없이 읽은 그대로 저장하려면 Reader→Writer로 바로 연결할 수 있어요.',
      terms: [
        { t: 'ItemProcessor<I, O>', d: '입력 타입 I를 받아서 출력 타입 O로 변환하는 함수형 인터페이스예요. process() 메서드 하나만 구현하면 돼요.' },
        { t: 'String, String', d: '제너릭 타입 파라미터예요. 첫 번째 String은 입력(Reader가 넘겨주는 타입), 두 번째는 출력(Writer로 넘어가는 타입)이에요.' },
        { t: 'toUpperCase()', d: '문자열의 모든 알파벳을 대문자로 변환해요. "kim" → "KIM"으로 바뀌어요.' },
        { t: 'null 반환', d: 'ItemProcessor가 null을 반환하면 해당 아이템은 Writer로 전달되지 않고 건너뛰어져요. 필터링에 활용할 수 있어요.' },
      ],
      why:
        '원본 데이터를 그대로 저장하기 전에 정제(trim, 대소문자 변환), 보강(외부 API 조회로 데이터 추가), 검증(유효성 확인), 필터링(불량 데이터 제거)이 필요할 때 써요.',
      expectedOutput:
        '[설정] ItemProcessor 생성 — 대문자 변환',
      realWorldUsage:
        '실제 프로젝트에서 CSV로 읽은 고객명을 대문자로 정규화하거나, 주소 데이터에 우편번호 API 조회 결과를 추가해서 Writer에 넘겨요. ' +
        '이메일 형식 검증에 실패한 데이터는 null을 반환해서 DB에 저장되지 않게 필터링하는 패턴이 일반적이에요.',
      pitfall:
        'ItemProcessor는 각 아이템마다 한 번씩 호출돼요. 100만 건이면 100만 번 호출되므로, 내부에서 무거운 작업(외부 API 호출, 정규식 복잡한 처리)을 하면 배치 전체 성능이 크게 저하돼요.',
    },
  },
  {
    id: 'batch-item-writer',
    lang: 'java',
    title: 'ItemWriter로 리스트 쓰기',
    file: 'PrintWriterConfig.java',
    code: `import java.util.List;
import org.springframework.batch.item.Chunk;
import org.springframework.batch.item.ItemWriter;
import org.springframework.context.annotation.Bean;

@Bean
public ItemWriter<String> printWriter() {
  System.out.println("[설정] ItemWriter 생성 — 콘솔 출력");
  return chunk -> {
    for (String item : chunk) {
      System.out.println("[쓰기] " + item);
    }
  };
}`,
    explain: {
      concept:
        'ItemWriter는 가공된 데이터 묶음(청크)을 최종 목적지에 저장하는 담당자예요. ' +
        'chunk 파라미터로 청크 크기만큼 모인 데이터 리스트를 한 번에 받아서, DB에 배치 INSERT하거나 파일에 쓰거나 API를 호출해요. ' +
        'ItemWriter가 받는 데이터는 이미 ItemProcessor를 통과한 후라서, 원하는 형태로 가공된 최종 데이터예요. ' +
        '람다로 간단히 구현할 수 있고, 스프링 배치가 제공하는 JdbcBatchItemWriter나 FlatFileItemWriter 같은 내장 구현체를 쓸 수도 있어요.',
      terms: [
        { t: 'ItemWriter<T>', d: '청크 단위로 모인 데이터 리스트를 받아서 최종 저장하는 함수형 인터페이스예요. write() 메서드 하나만 구현해요.' },
        { t: 'chunk (List<T>)', d: '청크 크기만큼 모인 데이터 리스트예요. chunk(10)이면 이 리스트의 크기는 보통 10이에요.' },
        { t: 'for-each 처리', d: '리스트의 각 아이템을 순회하며 저장해요. ItemWriter는 리스트를 통째로 받으므로 모든 아이템을 처리해야 해요.' },
      ],
      why:
        '가공된 데이터를 DB, 파일, 메시지 큐, 외부 API 등 최종 목적지에 저장하려고 해요. Writer가 없으면 배치 결과가 휘발돼 버려요.',
      expectedOutput:
        '[설정] ItemWriter 생성 — 콘솔 출력\n' +
        '[쓰기] KIM\n' +
        '[쓰기] LEE\n' +
        '[쓰기] PARK',
      realWorldUsage:
        '실제 프로젝트에서 JdbcBatchItemWriter로 DB에 벌크 INSERT 하거나, FlatFileItemWriter로 결과 CSV를 생성하고, ' +
        'KafkaItemWriter로 처리 결과를 메시지 큐에 발행하는 등 다양한 Writer 구현체를 사용해요.',
      pitfall:
        'ItemWriter가 받는 리스트의 모든 요소를 처리해야 해요. 일부만 처리하면 데이터 손실이 발생해요. ' +
        '또한 Writer 내에서 예외가 발생하면 청크 전체가 롤백되므로, 개별 아이템 실패를 허용하려면 try-catch로 감싸야 해요.',
    },
  },
  {
    id: 'batch-job-parameters',
    lang: 'java',
    title: 'JobParameters로 실행 인자 받기',
    file: 'ParamTasklet.java',
    code: `import org.springframework.batch.core.Step;
import org.springframework.batch.core.configuration.annotation.JobScope;
import org.springframework.batch.core.repository.JobRepository;
import org.springframework.batch.core.step.builder.StepBuilder;
import org.springframework.batch.repeat.RepeatStatus;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.transaction.PlatformTransactionManager;

@Bean
@JobScope
public Step paramStep(JobRepository repo, PlatformTransactionManager tx,
                     @Value("#{jobParameters['date']}") String date) {
  System.out.println("[설정] 파라미터 기반 Step — date=" + date);
  return new StepBuilder("paramStep", repo)
    .tasklet((contribution, ctx) -> {
      System.out.println("[실행] 기준 날짜: " + date);
      return RepeatStatus.FINISHED;
    }, tx)
    .build();
}`,
    explain: {
      concept:
        'JobParameters는 배치를 실행할 때마다 외부에서 전달하는 인자예요. 매 실행마다 다른 날짜·파일 경로·조건을 넣을 수 있어서, ' +
        '같은 Job이라도 "2026-07-01 데이터 처리", "2026-07-02 데이터 처리"처럼 매일 다른 값으로 돌릴 수 있어요. ' +
        '@JobScope를 Step 빈에 붙이면, Step이 생성되는 시점(Job 실행 시)에 파라미터가 주입돼요. ' +
        "@Value + SpEL 표현식 #{jobParameters['date']}으로 파라미터 값을 꺼내서 Step 안에서 사용할 수 있어요.",
      terms: [
        { t: '@JobScope', d: 'Job이 실행될 때마다 빈을 새로 생성하고, 그 시점에 JobParameters를 주입받게 해주는 스코프 어노테이션이에요.' },
        { t: "@Value(\"#{jobParameters['date']}\")", d: 'SpEL로 Job 실행 시 전달된 "date" 파라미터 값을 주입받아요. 문자열 형태로 전달돼요.' },
        { t: 'JobParameters', d: 'Job 실행 시 전달되는 키-값 쌍의 인자 묶음이에요. 동일 파라미터로 두 번 실행하면 중복 예외가 발생할 수 있어요.' },
        { t: 'SpEL', d: 'Spring Expression Language로, #{...} 구문 안에서 빈 속성이나 JobParameter에 접근할 수 있는 표현식 언어예요.' },
      ],
      why:
        '같은 배치 Job을 매일 다른 날짜로 실행하거나, 파일 경로를 동적으로 바꿔가며 실행하려고 해요. 파라미터 없으면 하드코딩된 값만 쓸 수 있어요.',
      expectedOutput:
        '[설정] 파라미터 기반 Step — date=2026-07-01\n' +
        '[실행] 기준 날짜: 2026-07-01',
      realWorldUsage:
        '실제 프로젝트에서 매일 새벽 2시에 "어제 날짜"를 파라미터로 받아서 전일 데이터를 집계하는 배치, 파일명을 파라미터로 받아서 특정 파일을 처리하는 배치 등 거의 모든 배치가 JobParameters를 사용해요.',
      pitfall:
        '@JobScope 없이 Step 빈에서 #{jobParameters}를 참조하면, 애플리케이션 시작 시점에 파라미터가 없어서 BeanCreationException이 발생해요. ' +
        '또한 @JobScope, @StepScope 빈은 프록시로 생성되므로, 반환 타입을 인터페이스가 아닌 구체 클래스로 하면 CGLIB 프록시 문제가 발생할 수 있어요.',
    },
  },
  {
    id: 'batch-job-launcher',
    lang: 'java',
    title: 'JobLauncher로 Job 실행',
    file: 'RunJob.java',
    code: `import org.springframework.batch.core.Job;
import org.springframework.batch.core.JobParametersBuilder;
import org.springframework.batch.core.launch.JobLauncher;
import org.springframework.stereotype.Component;

@Component
public class RunJob {

  private final JobLauncher launcher;
  private final Job helloJob;

  public RunJob(JobLauncher launcher, Job helloJob) {
    this.launcher = launcher;
    this.helloJob = helloJob;
  }

  public void run() throws Exception {
    System.out.println("[실행] JobLauncher로 helloJob 실행");
    launcher.run(helloJob, new JobParametersBuilder()
        .addString("date", "2026-07-01")
        .toJobParameters());
    System.out.println("[완료] Job 실행 완료");
  }
}`,
    explain: {
      concept:
        'JobLauncher는 정의된 Job을 실제로 실행하는 방아쇠(트리거)예요. ' +
        'Job은 설계도일 뿐이고, JobLauncher.run()을 호출해야 실제 처리가 시작돼요. ' +
        'JobParametersBuilder는 실행 시 넘길 파라미터를 만들고, toJobParameters()로 최종 파라미터 객체를 생성해요. ' +
        'run()의 반환값인 JobExecution에는 실행 ID, 시작/종료 시간, 상태(성공/실패), Step 진행 정보가 담겨 있어서 모니터링에 활용해요. ' +
        'JobLauncher는 스케줄러(@Scheduled), REST 컨트롤러, 커맨드라인 러너 등 다양한 트리거에서 호출할 수 있어요.',
      terms: [
        { t: 'JobLauncher', d: 'Job을 실행하는 진입점 인터페이스예요. run(job, params)으로 Job을 실행하고 JobExecution을 반환해요.' },
        { t: 'JobParametersBuilder', d: 'Job 실행 시 넘길 파라미터를 빌더 패턴으로 조립하는 도구예요. addString, addLong 등으로 값을 추가해요.' },
        { t: 'toJobParameters()', d: '빌더에 설정된 파라미터들을 묶어서 최종 JobParameters 객체로 변환해요.' },
        { t: 'JobExecution', d: 'Job의 실행 결과를 담는 객체예요. 실행 ID, 상태(BatchStatus), 시작/종료 시간, 실패 예외 정보를 포함해요.' },
      ],
      why:
        '정의된 Job을 스케줄러나 컨트롤러, CLI 등 다양한 트리거에서 호출할 수 있게 하려고 해요. JobLauncher가 없으면 Job은 그냥 빈으로만 존재해요.',
      expectedOutput:
        '[실행] JobLauncher로 helloJob 실행\n' +
        '[완료] Job 실행 완료',
      realWorldUsage:
        '실제 프로젝트에서 @Scheduled로 매일 새벽 2시에 정산 Job을 실행하거나, 관리자 대시보드에서 "수동 실행" 버튼을 누르면 컨트롤러가 JobLauncher를 호출해요. ' +
        'Spring Cloud Data Flow도 내부적으로 JobLauncher를 사용해 분산 배치를 오케스트레이션해요.',
      pitfall:
        '동일한 JobParameters로 Job을 두 번 실행하면 JobInstanceAlreadyCompleteException이 발생해요. ' +
        '스프링 배치는 같은 파라미터의 Job이 이미 성공적으로 완료됐으면 재실행을 막아서 중복 처리를 방지해요. 매 실행 시 유일한 값(타임스탬프 등)을 파라미터에 포함시키는 게 관례예요.',
    },
  },
  {
    id: 'batch-job-scope',
    lang: 'java',
    title: '@JobScope로 빈 지연 생성',
    file: 'ScopedStepConfig.java',
    code: `import org.springframework.batch.core.Step;
import org.springframework.batch.core.configuration.annotation.JobScope;
import org.springframework.batch.core.repository.JobRepository;
import org.springframework.batch.core.step.builder.StepBuilder;
import org.springframework.batch.repeat.RepeatStatus;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.transaction.PlatformTransactionManager;

@Bean
@JobScope
public Step scopedStep(JobRepository repo, PlatformTransactionManager tx,
                       @Value("#{jobParameters['date']}") String date) {
  System.out.println("[생성] @JobScope Step — date=" + date);
  return new StepBuilder("scopedStep", repo)
    .tasklet((c, ctx) -> {
      System.out.println("[실행] 처리 날짜: " + date);
      return RepeatStatus.FINISHED;
    }, tx)
    .build();
}`,
    explain: {
      concept:
        '@JobScope는 빈이 애플리케이션 시작 시가 아니라, Job이 실행될 때마다 새로 생성되게 해주는 스코프예요. ' +
        '이 지연 생성 덕분에, 실행 시점에만 알 수 있는 값(JobParameters)을 빈 생성자나 @Value로 주입받을 수 있어요. ' +
        '@JobScope가 없으면 모든 빈이 앱 시작 시 한 번만 생성되기 때문에, 아직 존재하지 않는 JobParameters를 참조할 수 없어요. ' +
        '@StepScope는 한 단계 더 세분화된 스코프로, Step이 실행될 때마다 새로 생성돼요.',
      terms: [
        { t: '@JobScope', d: 'Job 실행 시점에 빈을 지연 생성하는 스코프예요. 동일 Job 내에서는 같은 빈이 재사용돼요.' },
        { t: '@StepScope', d: 'Step 실행 시점에 빈을 지연 생성하는 스코프예요. @JobScope보다 더 세밀한 생명주기를 가져요.' },
        { t: "@Value(\"#{jobParameters['date']}\")", d: 'SpEL로 JobParameters에서 date 값을 꺼내 주입받아요. @JobScope/@StepScope 빈에서만 유효해요.' },
        { t: '지연 생성 (lazy)', d: '빈이 미리 만들어지지 않고, 실제로 필요할 때(Job/Step 실행 시) 생성되는 방식이에요.' },
      ],
      why:
        'Job 실행 시마다 다른 파라미터를 빈에 주입하려고 해요. 같은 Job이라도 "2026-07-01", "2026-07-02" 처럼 매일 다른 값으로 동작해야 할 때 필수예요.',
      expectedOutput:
        '[생성] @JobScope Step — date=2026-07-01\n' +
        '[실행] 처리 날짜: 2026-07-01',
      realWorldUsage:
        '실제 프로젝트에서 날짜별 데이터를 읽는 Reader나 파일 경로를 동적으로 받는 Writer를 @JobScope/@StepScope로 정의해서, ' +
        '실행 시점에 전달된 파라미터에 따라 다른 동작을 하게 해요. 거의 모든 파라미터 기반 배치 빈이 @JobScope나 @StepScope로 정의돼요.',
      pitfall:
        '@JobScope/@StepScope 빈은 프록시(AOP)로 감싸져서 생성되므로, private 메서드나 같은 클래스 내 호출에는 스코프 프록시가 적용되지 않아요. ' +
        '또한 반환 타입을 구체 클래스로 선언하면 CGLIB 프록시 경고가 발생할 수 있으니, 가능하면 인터페이스 타입(Step)으로 반환하는 게 좋아요.',
    },
  },
  {
    id: 'batch-step-scope',
    lang: 'java',
    title: '@StepScope로 Step마다 빈 생성',
    file: 'StepScopeReader.java',
    code: `import java.util.List;
import org.springframework.batch.core.configuration.annotation.StepScope;
import org.springframework.batch.item.support.ListItemReader;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;

@Bean
@StepScope
public ListItemReader<String> stepReader(
    @Value("#{jobParameters['date']}") String date) {
  List<String> data = List.of(date + "-item1", date + "-item2");
  System.out.println("[생성] @StepScope Reader — date=" + date
      + ", data=" + data);
  return new ListItemReader<>(data);
}`,
    explain: {
      concept:
        '@StepScope는 @JobScope보다 더 세밀한 스코프로, Step이 실행될 때마다 빈이 새로 생성돼요. ' +
        '같은 Job 안에서 여러 Step이 순차 실행될 때, 각 Step 실행 시점에 파라미터를 주입받을 수 있어서 Step마다 다른 데이터를 처리할 수 있어요. ' +
        '예를 들어 Step1은 "2026-07-01" 파일을 처리하고, Step2는 파라미터를 바꿔서 다른 파일을 처리하는 식이에요. ' +
        'Reader를 @StepScope로 정의하면 매 Step 실행마다 새로운 ListItemReader가 생성돼서, 이전 실행에서 이미 읽은 상태로 남아있는 문제를 방지해줘요.',
      terms: [
        { t: '@StepScope', d: 'Step 실행 시점마다 빈을 새로 생성하는 스코프예요. Step이 두 번 실행되면 빈도 두 번 생성돼요.' },
        { t: 'List.of(date + "-item1")', d: '파라미터로 받은 날짜를 데이터 생성에 활용해요. 매 실행마다 다른 데이터 세트가 만들어져요.' },
        { t: "@Value(\"#{jobParameters['date']}\")", d: '@StepScope 내에서도 @JobScope와 동일하게 JobParameters를 주입받을 수 있어요.' },
        { t: 'Reader 재사용 방지', d: '@StepScope가 없으면 Reader가 한 번만 생성되고, 재실행 시 이미 다 읽은 상태라 빈 result가 발생해요.' },
      ],
      why:
        'Step마다, 또는 같은 Step의 재실행마다 Reader를 새로 만들어서 데이터를 처음부터 다시 읽게 하려고 해요. 배치의 재시작 안정성을 높여줘요.',
      expectedOutput:
        '[생성] @StepScope Reader — date=2026-07-01, data=[2026-07-01-item1, 2026-07-01-item2]',
      realWorldUsage:
        '실제 프로젝트에서 FlatFileItemReader나 JdbcCursorItemReader를 @StepScope로 정의해서, Step 실행 시 지정된 파일 경로나 날짜 조건으로 데이터를 읽어요. ' +
        '배치가 실패 후 재시작될 때도 Reader가 새로 생성돼서 처음부터 정상적으로 데이터를 읽을 수 있어요.',
      pitfall:
        '@StepScope를 빼먹으면 Reader가 한 번만 생성되고 모든 Step 실행에서 같은 인스턴스를 재사용해요. ' +
        '첫 실행에서 이미 데이터를 다 읽었으면, 두 번째 실행에서는 읽을 데이터가 없어서 배치가 빈 상태로 완료돼요.',
    },
  },
  {
    id: 'batch-flat-file-reader',
    lang: 'java',
    title: 'FlatFileItemReader로 파일 읽기',
    file: 'CsvReaderConfig.java',
    code: `import org.springframework.batch.core.configuration.annotation.StepScope;
import org.springframework.batch.item.file.FlatFileItemReader;
import org.springframework.batch.item.file.builder.FlatFileItemReaderBuilder;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.core.io.FileSystemResource;

@Bean
@StepScope
public FlatFileItemReader<String> csvReader(
    @Value("#{jobParameters['file']}") String path) {
  System.out.println("[설정] FlatFileReader — file=" + path);
  return new FlatFileItemReaderBuilder<String>()
    .name("csvReader")
    .resource(new FileSystemResource(path))
    .lineMapper((line, num) -> line)
    .build();
}`,
    explain: {
      concept:
        'FlatFileItemReader는 텍스트 파일(CSV, 로그 등)을 한 줄씩 읽어서 객체로 변환해주는 Reader예요. ' +
        '파일의 각 줄을 lineMapper로 가공해서 원하는 타입으로 바꿔요. 예제에서는 줄 번호(line number)도 받을 수 있어서 헤더 줄 건너뛰기 등에 활용할 수 있어요. ' +
        'FlatFileItemReaderBuilder를 사용하면 파일 인코딩, 구분자(delimited), 고정 길이(fixed length) 등 다양한 형식을 선언적으로 설정할 수 있어요. ' +
        '@StepScope를 붙여서 실행 시점에 파일 경로를 동적으로 받아올 수 있어요.',
      terms: [
        { t: 'FlatFileItemReaderBuilder', d: '플랫 파일(텍스트)을 읽는 Reader를 빌더 패턴으로 생성하는 도구예요. CSV, 고정길이 등 다양한 형식을 지원해요.' },
        { t: 'FileSystemResource', d: '파일 시스템의 실제 경로로 리소스를 참조하는 객체예요. classpath: 접두사를 쓰면 ClassPathResource도 가능해요.' },
        { t: 'lineMapper((line, num) -> line)', d: '각 줄(line)과 줄 번호(num)를 받아서 원하는 객체로 변환하는 함수예요. CSV 파싱 로직을 여기에 넣어요.' },
        { t: '@StepScope + @Value', d: '실행 시 파라미터로 파일 경로를 받아서 Reader가 동적으로 다른 파일을 읽을 수 있게 해줘요.' },
      ],
      why:
        'CSV나 로그 파일을 한 줄씩 읽어서 DB에 저장하는 배치를 만들려고 해요. 파일 전체를 한 번에 메모리에 올리지 않고 스트리밍 방식으로 처리해요.',
      expectedOutput:
        '[설정] FlatFileReader — file=/data/users.csv',
      realWorldUsage:
        '실제 프로젝트에서 은행의 거래 내역 CSV를 DB로 이관하는 배치, FTP로 받은 주문 파일을 처리하는 배치, 로그 파일을 분석해서 Elasticsearch에 색인하는 배치 등에 FlatFileItemReader를 사용해요.',
      pitfall:
        '지정한 파일이 없으면 Job 실행 시점에 FileNotFoundException이 발생해서 배치가 바로 실패해요. 파일 존재 여부를 Tasklet으로 미리 확인하는 전처리 Step을 배치 체인 앞에 두는 게 안전해요. ' +
        '또한 대용량 파일은 lineMapper에서 무거운 작업을 하면 병목이 되므로, 복잡한 변환은 ItemProcessor로 분리하는 게 좋아요.',
    },
  },
  {
    id: 'batch-jdbc-cursor-reader',
    lang: 'java',
    title: 'JdbcCursorItemReader로 DB 읽기',
    file: 'UserReaderConfig.java',
    code: `import javax.sql.DataSource;
import org.springframework.batch.core.configuration.annotation.StepScope;
import org.springframework.batch.item.database.JdbcCursorItemReader;
import org.springframework.batch.item.database.builder.JdbcCursorItemReaderBuilder;
import org.springframework.context.annotation.Bean;

@Bean
@StepScope
public JdbcCursorItemReader<User> jdbcUserReader(DataSource dataSource) {
  System.out.println("[설정] JdbcCursorReader — SELECT id, name FROM users");
  return new JdbcCursorItemReaderBuilder<User>()
    .name("jdbcUserReader")
    .dataSource(dataSource)
    .sql("SELECT id, name FROM users")
    .rowMapper((rs, i) -> new User(rs.getLong("id"), rs.getString("name")))
    .build();
}`,
    explain: {
      concept:
        'JdbcCursorItemReader는 데이터베이스 커서(Cursor)로 SELECT 결과를 한 줄씩 스트리밍 방식으로 읽어요. ' +
        'ResultSet 전체를 메모리에 올리지 않고, DB 커서가 한 행씩 가져오기 때문에 수백만 건도 메모리를 거의 쓰지 않고 읽을 수 있어요. ' +
        'rowMapper는 ResultSet의 각 행(row)을 User 같은 도메인 객체로 변환하는 함수예요. ' +
        '커서 방식의 단점은 ResultSet이 열려 있는 동안 DB 연결을 계속 점유한다는 거예요. 오래 걸리는 배치에서는 연결 타임아웃에 주의해야 해요.',
      terms: [
        { t: 'JdbcCursorItemReaderBuilder', d: 'JDBC 커서 기반 Reader를 빌더 패턴으로 생성하는 도구예요. sql, rowMapper, dataSource를 설정해요.' },
        { t: 'DataSource', d: 'DB 연결 풀(HikariCP 등)을 추상화한 인터페이스예요. 스프링 부트가 자동으로 설정해줘요.' },
        { t: 'sql("SELECT ...")', d: '읽어올 데이터를 정의하는 SQL 쿼리예요. ORDER BY를 포함해야 청크 재시작 시 순서가 보장돼요.' },
        { t: 'rowMapper((rs, i) -> ...)', d: 'ResultSet의 현재 행을 User 객체로 변환하는 함수예요. i는 현재 행 번호(0부터 시작)예요.' },
      ],
      why:
        'DB에 있는 대량의 데이터를 메모리 부담 없이 스트리밍으로 읽어서 가공하려고 해요. 전체 SELECT 결과를 한 번에 메모리에 올리지 않아도 돼요.',
      expectedOutput:
        '[설정] JdbcCursorReader — SELECT id, name FROM users',
      realWorldUsage:
        '실제 프로젝트에서 회원 데이터 전체를 대상으로 등급 재계산 배치를 돌리거나, 거래 내역을 집계하는 배치에서 JdbcCursorItemReader로 원천 데이터를 읽어와요. ' +
        'PagingReader와 달리 정렬된 데이터를 순서대로 안정적으로 읽을 수 있어서, 재시작 시 정합성이 중요한 경우에 선호돼요.',
      pitfall:
        '커서가 열려 있는 동안 DB 연결을 계속 점유해요. 배치 처리 시간이 길어지면 DB 커넥션 타임아웃이 발생할 수 있어서, 청크 크기와 fetchSize를 적절히 튜닝해야 해요. ' +
        '또한 ORDER BY를 생략하면 재시작 시 데이터 정합성이 깨질 수 있어요.',
    },
  },
  {
    id: 'batch-jpa-paging-reader',
    lang: 'java',
    title: 'JpaPagingItemReader로 페이지 읽기',
    file: 'PagingReaderConfig.java',
    code: `import jakarta.persistence.EntityManagerFactory;
import org.springframework.batch.core.configuration.annotation.StepScope;
import org.springframework.batch.item.database.JpaPagingItemReader;
import org.springframework.batch.item.database.builder.JpaPagingItemReaderBuilder;
import org.springframework.context.annotation.Bean;

@Bean
@StepScope
public JpaPagingItemReader<User> userReader(EntityManagerFactory emf) {
  System.out.println("[설정] JpaPagingReader — pageSize=100");
  return new JpaPagingItemReaderBuilder<User>()
    .name("userReader")
    .entityManagerFactory(emf)
    .queryString("SELECT u FROM User u WHERE u.active = true")
    .pageSize(100)
    .build();
}`,
    explain: {
      concept:
        'JpaPagingItemReader는 JPA(JPQL)로 데이터를 페이지(pageSize) 단위로 나눠서 읽어요. ' +
        '책을 한 장씩(한 페이지씩) 넘겨가며 읽는 것과 똑같아요. JdbcCursorItemReader와 달리, 각 페이지를 읽은 후에는 DB 연결을 반환해요. ' +
        '페이지 단위라서 커서보다 DB 커넥션 점유 시간이 짧지만, 페이지 사이에 데이터가 추가·삭제되면 정합성 문제가 발생할 수 있어요. ' +
        'JPA를 사용하는 프로젝트에서 엔티티 객체로 직접 데이터를 읽고 싶을 때 자연스럽게 선택해요.',
      terms: [
        { t: 'JpaPagingItemReaderBuilder', d: 'JPA JPQL 기반의 페이지 Reader를 빌더 패턴으로 생성하는 도구예요. pageSize 단위로 데이터를 읽어요.' },
        { t: 'queryString (JPQL)', d: 'JPA 엔티티 대상으로 실행할 JPQL 쿼리예요. SQL이 아니라 엔티티와 필드명을 기준으로 작성해요.' },
        { t: 'entityManagerFactory', d: 'JPA의 핵심 팩토리 인터페이스예요. EntityManager를 생성하고 DB와의 세션을 관리해요.' },
        { t: 'pageSize(100)', d: '한 번에 읽어올 페이지 크기예요. 100개씩 나눠서 읽고, 각 페이지마다 별도 트랜잭션으로 처리해요.' },
      ],
      why:
        'JPA 기반 프로젝트에서 엔티티로 데이터를 다루면서도, 전체 결과를 한 번에 메모리에 올리지 않고 안전하게 페이지 단위로 처리하려고 해요.',
      expectedOutput:
        '[설정] JpaPagingReader — pageSize=100',
      realWorldUsage:
        '실제 프로젝트에서 JPA를 주 ORM으로 쓰는 경우, 사용자 데이터를 엔티티로 읽어서 가공한 뒤 JpaItemWriter로 저장하는 전 과정을 JPA로 통일해요. ' +
        'Spring Data JPA와의 호환성이 좋아서, Repository 기반 프로젝트에서 자연스럽게 통합돼요.',
      pitfall:
        '같은 트랜잭션 안에서 읽은 엔티티를 수정하면 JPA의 더티 체킹(dirty checking)이 작동해서 의도치 않게 DB가 변경될 수 있어요. ' +
        '읽기 전용으로 사용할 때는 EntityManager.clear()를 주기적으로 호출해 영속성 컨텍스트를 비워주는 게 안전해요.',
    },
  },
  {
    id: 'batch-jdbc-batch-writer',
    lang: 'java',
    title: 'JdbcBatchItemWriter로 DB 쓰기',
    file: 'InsertWriterConfig.java',
    code: `import javax.sql.DataSource;
import org.springframework.batch.item.database.JdbcBatchItemWriter;
import org.springframework.batch.item.database.builder.JdbcBatchItemWriterBuilder;
import org.springframework.context.annotation.Bean;

@Bean
public JdbcBatchItemWriter<User> userWriter(DataSource dataSource) {
  String sql = "INSERT INTO audit (id, name) VALUES (:id, :name)";
  System.out.println("[설정] JdbcBatchWriter — " + sql);
  return new JdbcBatchItemWriterBuilder<User>()
    .dataSource(dataSource)
    .sql(sql)
    .beanMapped()
    .build();
}`,
    explain: {
      concept:
        'JdbcBatchItemWriter는 모아둔 데이터 목록을 JDBC 배치 INSERT로 한 번에 DB에 저장하는 Writer예요. ' +
        'SQL 문의 :id, :name은 명명된 파라미터(named parameter)로, User 객체의 getId(), getName()과 자동으로 매핑돼요. ' +
        'beanMapped()를 설정하면 객체의 필드명과 SQL 파라미터명을 자동으로 연결해줘요. ' +
        '일반 INSERT를 건별로 실행하는 것보다 배치 INSERT가 수십 배 빠르기 때문에, 대량 데이터 저장에 필수적인 최적화 방법이에요.',
      terms: [
        { t: 'JdbcBatchItemWriterBuilder', d: 'JDBC 배치 INSERT Writer를 빌더 패턴으로 생성하는 도구예요. sql, dataSource를 필수로 지정해요.' },
        { t: ':id, :name (명명된 파라미터)', d: 'SQL 내에서 :변수명 형태로 파라미터를 지정해요. 객체의 getter 또는 필드명과 자동 매핑돼요.' },
        { t: 'beanMapped()', d: 'JavaBean 규약(getter/setter)을 따라 객체 필드와 SQL 파라미터를 자동으로 매핑해줘요.' },
        { t: 'JDBC 배치 (batch update)', d: '여러 INSERT 문을 한 번에 DB로 전송해서 실행하는 방식이에요. 개별 실행보다 네트워크 왕복이 줄어 빨라요.' },
      ],
      why:
        '대량의 데이터를 DB에 빠르게 저장하려고 해요. 건별 INSERT는 100만 건 처리에 수 시간 걸리지만, 배치 INSERT는 수 분으로 단축돼요.',
      expectedOutput:
        '[설정] JdbcBatchWriter — INSERT INTO audit (id, name) VALUES (:id, :name)',
      realWorldUsage:
        '실제 프로젝트에서 로그 데이터를 배치로 집계해 통계 테이블에 저장하거나, 외부에서 받은 주문 데이터를 대량으로 DB에 이관할 때 JdbcBatchItemWriter를 사용해요. ' +
        'Spring Batch의 가장 흔한 Writer 구현체 중 하나예요.',
      pitfall:
        'beanMapped()를 사용하려면 객체의 getter 이름과 SQL의 파라미터명이 정확히 일치해야 해요. ' +
        '예를 들어 getName()이면 :name, getUserId()면 :userId처럼 자바빈 규약을 따라야 해요. 일치하지 않으면 해당 파라미터가 null로 채워져요.',
    },
  },
  {
    id: 'batch-jpa-item-writer',
    lang: 'java',
    title: 'JpaItemWriter로 JPA 쓰기',
    file: 'JpaWriterConfig.java',
    code: `import jakarta.persistence.EntityManagerFactory;
import org.springframework.batch.item.database.JpaItemWriter;
import org.springframework.context.annotation.Bean;

@Bean
public JpaItemWriter<User> jpaWriter(EntityManagerFactory emf) {
  System.out.println("[설정] JpaItemWriter 생성");
  JpaItemWriter<User> writer = new JpaItemWriter<>();
  writer.setEntityManagerFactory(emf);
  return writer;
}`,
    explain: {
      concept:
        'JpaItemWriter는 JPA의 EntityManager.persist()/merge()를 이용해서 엔티티 객체를 DB에 저장하는 Writer예요. ' +
        'JPA를 통해 읽은 엔티티를 다시 JPA로 저장할 때 자연스럽게 연결돼요. ' +
        'setEntityManagerFactory()로 JPA의 핵심 팩토리를 주입해주면, Writer가 내부적으로 EntityManager를 생성해서 청크 단위로 엔티티를 저장해요. ' +
        'Builder 패턴이 없어서 setter로 설정을 주입하는 점이 다른 Writer와 다른데, 이는 Spring Batch 5.x에서 개선될 예정이에요.',
      terms: [
        { t: 'JpaItemWriter<T>', d: 'JPA 엔티티를 청크 단위로 DB에 저장하는 Writer예요. persist 또는 merge 방식으로 저장해요.' },
        { t: 'setEntityManagerFactory', d: 'JPA EntityManager를 생성할 수 있는 팩토리를 주입해요. DB 연결과 영속성 컨텍스트 관리의 출발점이에요.' },
        { t: 'persist vs merge', d: 'persist는 새 엔티티를 저장하고, merge는 기존 엔티티를 갱신해요. JpaItemWriter는 기본적으로 merge를 사용해요.' },
      ],
      why:
        'JPA 기반 프로젝트에서 Reader로 읽은 엔티티를 그대로(또는 가공 후) JPA를 통해 DB에 저장하려고 해요. JDBC Writer보다 JPA 캐싱·지연 로딩 이점을 활용할 수 있어요.',
      expectedOutput:
        '[설정] JpaItemWriter 생성',
      realWorldUsage:
        '실제 프로젝트에서 JPA 엔티티로 구성된 도메인 모델을 배치 처리할 때, Reader→Processor→JpaItemWriter로 이어지는 완전한 JPA 기반 파이프라인을 구성해요. ' +
        'Spring Data JPA를 주력으로 사용하는 프로젝트에서 가장 자연스러운 선택이에요.',
      pitfall:
        'JpaItemWriter는 JPA 엔티티만 저장할 수 있어요. 일반 DTO나 record는 JPA가 관리하지 않으므로 쓸 수 없어요. ' +
        '또한 persist 모드를 쓰려면 엔티티에 @Id가 할당되지 않은 새 객체여야 하고, merge는 ID가 이미 있는 기존 객체를 대상으로 해요.',
    },
  },
  {
    id: 'batch-composite-processor',
    lang: 'java',
    title: 'CompositeItemProcessor로 변환 이어붙이기',
    file: 'CompositeProcessorConfig.java',
    code: `import java.util.List;
import org.springframework.batch.item.ItemProcessor;
import org.springframework.batch.item.support.CompositeItemProcessor;
import org.springframework.context.annotation.Bean;

@Bean
public CompositeItemProcessor<String, String> compositeProcessor(
    ItemProcessor<String, String> trim,
    ItemProcessor<String, String> upper) {
  System.out.println("[설정] CompositeProcessor — trim -> upper 순서");
  CompositeItemProcessor<String, String> p = new CompositeItemProcessor<>();
  p.setDelegates(List.of(trim, upper));
  return p;
}`,
    explain: {
      concept:
        'CompositeItemProcessor는 여러 ItemProcessor를 한 줄로 이어붙이는 합성 도구예요. ' +
        '컨베이어 벨트 위에 "세척기 → 껍질깎기 → 포장기"가 순서대로 서 있는 것과 같아요. ' +
        '첫 번째 Processor의 출력이 두 번째 Processor의 입력으로 들어가면서 데이터가 차례로 변환돼요. ' +
        'trim(String) → upper(String) 순서라면, "  hello  " → trim → "hello" → upper → "HELLO" 식으로 변환돼요. ' +
        '각 Processor의 입출력 타입이 연결 가능해야 해요. A→B Processor와 B→C Processor를 이어붙이면 A→C로 합성할 수 있어요.',
      terms: [
        { t: 'CompositeItemProcessor', d: '여러 Processor를 리스트로 받아서 순차적으로 실행하는 합성 Processor예요.' },
        { t: 'setDelegates(List)', d: '실행할 Processor 목록을 순서대로 설정해요. delegates.get(0)부터 delegates.get(n-1) 순서로 실행돼요.' },
        { t: 'List.of(trim, upper)', d: '두 Processor의 실행 순서를 지정해요. trim이 먼저 실행되고, 그 결과가 upper의 입력으로 들어가요.' },
        { t: '타입 연결 (A→B→C)', d: '앞 Processor의 출력 타입과 다음 Processor의 입력 타입이 일치해야 연결할 수 있어요.' },
      ],
      why:
        '가공 단계가 여러 개일 때 하나의 Processor에 욱여넣지 않고, 단계별로 분리해서 재사용·조립할 수 있게 하려고 해요.',
      expectedOutput:
        '[설정] CompositeProcessor — trim -> upper 순서',
      realWorldUsage:
        '실제 프로젝트에서 CSV 데이터 정제 파이프라인: trim(공백 제거) → validate(형식 검증) → enrich(외부 API로 정보 보강) → transform(최종 변환) 순서로 Processor를 합성해요. ' +
        '각 Processor를 독립적으로 단위 테스트할 수 있어서 유지보수성이 크게 향상돼요.',
      pitfall:
        'delegates 목록에 등록된 순서가 곧 실행 순서예요. 순서를 바꾸면 결과가 완전히 달라져요. ' +
        '또한 앞 Processor의 출력 타입과 뒤 Processor의 입력 타입이 일치해야 해요. 타입 불일치는 컴파일 에러가 발생해요.',
    },
  },
  {
    id: 'batch-chunk-listener',
    lang: 'java',
    title: 'ChunkListener로 청크마다 로그',
    file: 'LogChunkListener.java',
    code: `import org.springframework.batch.core.ChunkListener;
import org.springframework.batch.core.Step;
import org.springframework.batch.core.repository.JobRepository;
import org.springframework.batch.core.scope.context.ChunkContext;
import org.springframework.batch.core.step.builder.StepBuilder;
import org.springframework.batch.item.ItemReader;
import org.springframework.batch.item.ItemWriter;
import org.springframework.context.annotation.Bean;
import org.springframework.transaction.PlatformTransactionManager;

@Bean
public Step listeningStep(JobRepository repo, PlatformTransactionManager tx,
                         ItemReader<String> reader, ItemWriter<String> writer) {
  System.out.println("[설정] ChunkListener 등록 Step");
  return new StepBuilder("listeningStep", repo)
    .chunk(10, tx)
    .reader(reader)
    .writer(writer)
    .listener(new ChunkListener() {
      @Override
      public void afterChunk(ChunkContext context) {
        System.out.println("[청크] 처리 완료 — 청크 #"
            + context.getStepContext().getStepExecution().getCommitCount());
      }
    })
    .build();
}`,
    explain: {
      concept:
        'ChunkListener는 청크가 시작되거나 끝날 때 자동으로 호출되는 이벤트 리스너예요. ' +
        '한 박스(청크)를 실을 때마다 확인 도장을 찍는 것과 같은 역할이에요. ' +
        'afterChunk()는 청크의 쓰기(write)와 커밋이 완료된 직후에 호출돼서, 처리된 건수나 진행률을 로깅하기에 좋아요. ' +
        'ChunkContext에서 현재 Step의 Execution 정보를 꺼내면, 몇 번째 청크인지, 지금까지 몇 건을 처리했는지 알 수 있어요. ' +
        '이 정보를 바탕으로 진행률(%)을 계산해서 로깅하거나 메트릭을 발행할 수 있어요.',
      terms: [
        { t: 'ChunkListener', d: '청크의 beforeChunk(시작 전), afterChunk(완료 후), afterChunkError(실패 시)를 수신하는 리스너 인터페이스예요.' },
        { t: 'afterChunk(ChunkContext)', d: '청크 처리(reader→processor→writer)가 완료되고 커밋된 후에 호출돼요.' },
        { t: 'ChunkContext', d: '현재 청크의 실행 컨텍스트 정보를 담는 객체예요. StepExecution에 접근할 수 있어요.' },
        { t: 'getCommitCount()', d: '현재까지 완료된 청크(커밋) 개수를 반환해요. 1이면 첫 번째 청크 처리 완료를 의미해요.' },
      ],
      why:
        '대량 배치에서 진행 상황을 실시간으로 모니터링하려고 해요. "현재 30% 처리 중" 같은 정보를 로그나 대시보드에 표시할 수 있어요.',
      expectedOutput:
        '[설정] ChunkListener 등록 Step\n' +
        '[청크] 처리 완료 — 청크 #1\n' +
        '[청크] 처리 완료 — 청크 #2',
      realWorldUsage:
        '실제 프로젝트에서 1000만 건 데이터 처리 배치에 ChunkListener를 붙여서, 매 청크마다 "35% 완료 (3,500,000/10,000,000)" 같은 진행 로그를 남겨요. ' +
        '이 정보를 Micrometer로 Prometheus에 전송해서 Grafana 대시보드로 실시간 모니터링하는 게 일반적인 운영 패턴이에요.',
      pitfall:
        'beforeChunk(청크 시작 전)와 afterChunk(청크 완료 후)를 혼동하지 마세요. before는 데이터를 읽기 전이라 아직 처리 건수를 알 수 없어요. ' +
        '또한 afterChunk는 예외 발생 시 호출되지 않고, 대신 afterChunkError가 호출되므로 에러 처리 로직을 분리해야 해요.',
    },
  },
  {
    id: 'batch-job-execution-listener',
    lang: 'java',
    title: 'JobExecutionListener로 시작/끝 로그',
    file: 'LogJobConfig.java',
    code: `import org.springframework.batch.core.Job;
import org.springframework.batch.core.JobExecution;
import org.springframework.batch.core.JobExecutionListener;
import org.springframework.batch.core.Step;
import org.springframework.batch.core.job.builder.JobBuilder;
import org.springframework.batch.core.repository.JobRepository;
import org.springframework.context.annotation.Bean;

@Bean
public Job loggingJob(JobRepository repo, Step step) {
  System.out.println("[설정] JobExecutionListener 등록");
  return new JobBuilder("loggingJob", repo)
    .listener(new JobExecutionListener() {
      @Override
      public void beforeJob(JobExecution exec) {
        System.out.println("[시작] Job 시작 — " + exec.getJobInstance().getJobName());
      }
      @Override
      public void afterJob(JobExecution exec) {
        System.out.println("[종료] Job 종료 — 상태: " + exec.getStatus());
      }
    })
    .start(step)
    .build();
}`,
    explain: {
      concept:
        'JobExecutionListener는 Job 전체의 시작과 종료 시점에 호출되는 리스너예요. ' +
        '공연의 개막과 폐막을 알리는 진행자와 같은 역할이에요. ' +
        'beforeJob()은 Job이 시작되기 직전에 호출돼서 리소스 초기화나 알림 발송에, afterJob()은 성공/실패 여부와 관계없이 Job이 끝난 후에 호출돼서 결과 로깅·알림·정리 작업에 써요. ' +
        'JobExecution에서 getStatus()로 최종 상태(COMPLETED, FAILED 등)와 상세 정보를 확인할 수 있어요.',
      terms: [
        { t: 'JobExecutionListener', d: 'Job의 시작(beforeJob)과 종료(afterJob) 시점에 콜백을 받는 리스너 인터페이스예요.' },
        { t: 'beforeJob(JobExecution)', d: 'Job이 첫 Step을 실행하기 직전에 호출돼요. 리소스 준비, 알림 발송에 사용해요.' },
        { t: 'afterJob(JobExecution)', d: 'Job 종료 후(성공·실패 무관)에 호출돼요. 정리 작업이나 결과 알림에 사용해요.' },
        { t: 'JobExecution', d: '현재 Job 실행의 모든 정보(상태, 시작/종료 시간, Step 실행 목록, 실패 예외)를 담는 객체예요.' },
      ],
      why:
        'Job의 시작과 종료 시점에 로깅·알림·리소스 정리 같은 공통 작업을 넣으려고 해요. 실패했을 때 관리자에게 알림을 보내는 것도 여기서 처리해요.',
      expectedOutput:
        '[설정] JobExecutionListener 등록\n' +
        '[시작] Job 시작 — loggingJob\n' +
        '[종료] Job 종료 — 상태: COMPLETED',
      realWorldUsage:
        '실제 프로젝트에서 Job 시작 시 Slack으로 "정산 배치 시작합니다" 알림을 보내고, 종료 시 성공/실패 여부와 처리 건수를 함께 보고해요. ' +
        '실패 시에는 담당자에게 PagerDuty로 장애 알림을 발송하는 패턴이 일반적이에요.',
      pitfall:
        'afterJob()은 Job이 실패(FAILED)한 경우에도 호출돼요. exec.getStatus()로 성공/실패를 반드시 확인하고 분기 처리해야 해요. ' +
        '또한 afterJob() 내에서 예외가 발생하면 Job의 최종 상태가 영향을 받을 수 있으니 try-catch로 방어하는 게 안전해요.',
    },
  },
  {
    id: 'batch-flow-decision',
    lang: 'java',
    title: 'Flow로 분기 Step 결정',
    file: 'FlowJobConfig.java',
    code: `import org.springframework.batch.core.Job;
import org.springframework.batch.core.Step;
import org.springframework.batch.core.job.builder.JobBuilder;
import org.springframework.batch.core.repository.JobRepository;
import org.springframework.context.annotation.Bean;

@Bean
public Job flowJob(JobRepository repo, Step ok, Step fallback) {
  System.out.println("[설정] Flow 분기 Job");
  return new JobBuilder("flowJob", repo)
    .start(ok)
    .on("FAILED").to(fallback)
    .from(ok).on("*").end()
    .build();
}`,
    explain: {
      concept:
        'Flow는 Step의 실행 결과(ExitStatus)에 따라 다음에 실행할 Step을 분기하는 제어 흐름이에요. ' +
        '길을 가다가 표지판을 보고 갈림길을 선택하는 것과 같아요. ' +
        'ok Step이 실패(FAILED)하면 fallback Step으로 이동하고, 성공(*)이면 Job을 종료해요. ' +
        'on()에는 ExitStatus 코드(문자열)를 지정해서 세밀한 분기를 만들 수 있어요. ' +
        '"성공 시 A→B 순서로, 실패 시 C로 이동" 같은 if-else 흐름을 배치 안에서 선언적으로 구성할 수 있어요.',
      terms: [
        { t: 'on("FAILED")', d: '이전 Step의 ExitStatus가 "FAILED"일 때 매칭되는 조건이에요. 실패 시 대체 경로를 지정할 수 있어요.' },
        { t: 'to(fallback)', d: 'on 조건이 만족됐을 때 이동할 Step을 지정해요. 성공 경로와 실패 경로를 분리할 수 있어요.' },
        { t: 'from(ok).on("*")', d: '특정 Step(ok)의 다른 ExitStatus("*"=전체)에 대한 조건을 정의하는 새로운 분기점이에요.' },
        { t: 'end()', d: '현재 Flow 분기를 종료하고 Job을 완료해요. 더 이상 Step이 실행되지 않아요.' },
      ],
      why:
        '배치 처리 중 실패 시 재시도/보상/알림 같은 후속 처리를 하거나, 조건에 따라 데이터 처리 방식을 다르게 가져가려고 해요.',
      expectedOutput:
        '[설정] Flow 분기 Job',
      realWorldUsage:
        '실제 프로젝트에서 파일 처리 배치에서 파일이 없으면 skip Step으로 건너뛰고, ' +
        '파일이 있으면 정상 처리 후 알림 발송 Step을 실행하는 흐름을 Flow로 구성해요. ' +
        '실패 시 관리자 알림 + 실패 데이터 별도 저장 같은 보상 흐름도 Flow로 표현해요.',
      pitfall:
        'ExitStatus 코드는 대소문자를 구분해요. "failed"와 "FAILED"는 다른 값으로 취급돼서 on("failed")가 매칭되지 않을 수 있어요. ' +
        '스프링 배치가 사용하는 표준 ExitStatus 값(COMPLETED, FAILED, STOPPED 등)의 정확한 철자를 확인하고 사용하세요.',
    },
  },
  {
    id: 'batch-decider',
    lang: 'java',
    title: 'JobExecutionDecider로 분기',
    file: 'DeciderJobConfig.java',
    code: `import org.springframework.batch.core.Job;
import org.springframework.batch.core.JobExecutionDecider;
import org.springframework.batch.core.Step;
import org.springframework.batch.core.job.builder.JobBuilder;
import org.springframework.batch.core.repository.JobRepository;
import org.springframework.context.annotation.Bean;

@Bean
public Job deciderJob(JobRepository repo, Step work, Step skip,
                     JobExecutionDecider decider) {
  System.out.println("[설정] Decider 기반 분기 Job");
  return new JobBuilder("deciderJob", repo)
    .start(work)
    .on("*").to(decider)
    .on("CONTINUE").end()
    .on("SKIP").to(skip)
    .end()
    .build();
}`,
    explain: {
      concept:
        'JobExecutionDecider는 Step 밖에서 독립적으로 다음 흐름을 결정하는 의사결정자예요. ' +
        '교차로의 신호등처럼, Step 실행 결과가 아니라 외부 조건(DB 조회, API 호출, 현재 시간 등)을 바탕으로 분기할 수 있어요. ' +
        'decider가 "CONTINUE"를 반환하면 Job을 종료하고, "SKIP"을 반환하면 skip Step으로 이동해요. ' +
        'Step의 ExitStatus 기반 분기(on("FAILED").to(...))와 달리, Decider는 완전히 자유로운 조건 판단이 가능해요.',
      terms: [
        { t: 'JobExecutionDecider', d: 'Job의 흐름 제어를 담당하는 인터페이스예요. decide()에서 FlowExecutionStatus를 반환해 분기를 결정해요.' },
        { t: '.on("*").to(decider)', d: 'work Step의 모든 결과(*)를 decider에게 넘겨서, decider가 다음 흐름을 결정하게 해요.' },
        { t: 'on("CONTINUE")', d: 'decider가 CONTINUE 상태를 반환하면 매칭되는 조건이에요. Job을 종료시켜요.' },
        { t: 'FlowExecutionStatus', d: 'Decider가 반환하는 흐름 제어용 상태값이에요. Step의 ExitStatus와는 별개예요.' },
      ],
      why:
        'Step 실행 결과만으로 결정할 수 없는 복잡한 분기 조건(외부 API 응답, DB에 저장된 설정값, 시간 조건)이 필요할 때 써요.',
      expectedOutput:
        '[설정] Decider 기반 분기 Job',
      realWorldUsage:
        '실제 프로젝트에서 배치 실행 시점에 "오늘이 월말이면 정산 Step으로, 아니면 건너뛰기" 같은 달력 기반 분기나, ' +
        '"DB에 저장된 배치 설정값을 읽어서 처리 방식을 결정"하는 동적 구성에 JobExecutionDecider를 사용해요.',
      pitfall:
        'decider가 반환하는 FlowExecutionStatus 문자열이 on()에 지정한 문자열과 정확히 일치해야 해요. ' +
        '대소문자, 공백까지 완전히 같아야 매칭돼요. 오타가 있으면 영원히 매칭되지 않는 분기 조건이 만들어져요.',
    },
  },
];
