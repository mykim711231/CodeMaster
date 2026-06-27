import type { Level, Pack, Snippet } from '../types';

// Spring Boot 3.4.x · Java 21 (LTS) 기준 — PRD §7 / §8.1
const entity: Snippet = {
  id: 'jpa-entity',
  lang: 'java',
  title: 'JPA Entity',
  file: 'UserEntity.java',
  code: `@Entity
@Table(name = "users")
public class UserEntity implements Serializable {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String username;
}`,
};

const repository: Snippet = {
  id: 'jpa-repository',
  lang: 'java',
  title: 'JPA Repository',
  file: 'UserRepository.java',
  code: `public interface UserRepository extends JpaRepository<UserEntity, Long> {

    Optional<UserEntity> findByUsername(String username);

    boolean existsByUsername(String username);
}`,
};

const service: Snippet = {
  id: 'service',
  lang: 'java',
  title: '@Service DI',
  file: 'UserService.java',
  code: `@Service
public class UserService {

    private final UserRepository repository;

    public UserService(UserRepository repository) {
        this.repository = repository;
    }

    @Transactional(readOnly = true)
    public UserEntity findById(Long id) {
        return repository.findById(id)
            .orElseThrow(() -> new EntityNotFoundException("user not found"));
    }
}`,
};

const controller: Snippet = {
  id: 'controller',
  lang: 'java',
  title: 'REST Controller',
  file: 'UserController.java',
  code: `@RestController
@RequestMapping("/api/users")
public class UserController {

    private final UserService service;

    public UserController(UserService service) {
        this.service = service;
    }

    @GetMapping("/{id}")
    public UserResponse getUser(@PathVariable Long id) {
        return UserResponse.from(service.findById(id));
    }
}`,
};

const recordDto: Snippet = {
  id: 'record-dto',
  lang: 'java',
  title: 'Record DTO',
  file: 'UserResponse.java',
  code: `public record UserResponse(Long id, String username) {

    public static UserResponse from(UserEntity entity) {
        return new UserResponse(entity.getId(), entity.getUsername());
    }
}`,
};

const L = (no: number, name: string, snippets: Snippet[] = []): Level => ({ no, name, snippets });

export const springBootPack: Pack = {
  id: 'spring-boot',
  name: 'Spring Boot',
  lang: 'java',
  levels: [
    L(1, 'Java Core', [recordDto]),
    L(2, 'Spring Core', [service]),
    L(3, 'Spring Boot MVC', [controller]),
    L(4, 'Database — JPA', [entity, repository]),
    L(5, 'Concurrency'),
    L(6, 'Network'),
    L(7, 'Gateway'),
    L(8, 'Messaging'),
    L(9, 'Batch'),
    L(10, 'Security'),
    L(11, 'Cache'),
    L(12, 'Monitoring'),
    L(13, 'Testing'),
    L(14, 'Architecture'),
    L(15, 'Design Pattern'),
    L(16, 'Build & DevOps'),
    L(17, 'Observability'),
    L(18, 'Data 심화'),
    L(19, 'Resilience & Cloud-Native'),
    L(20, 'Reactive'),
  ],
};
