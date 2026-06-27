import type { Pack } from '../types';

// Spring Boot 3.4.x · Java 21 (LTS) 기준 — PRD §8.1
export const springBootPack: Pack = {
  id: 'spring-boot',
  name: 'Spring Boot',
  lang: 'java',
  snippets: [
    {
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
    },
    {
      id: 'jpa-repository',
      lang: 'java',
      title: 'JPA Repository',
      file: 'UserRepository.java',
      code: `public interface UserRepository extends JpaRepository<UserEntity, Long> {

    Optional<UserEntity> findByUsername(String username);

    boolean existsByUsername(String username);
}`,
    },
    {
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
    },
    {
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
    },
    {
      id: 'record-dto',
      lang: 'java',
      title: 'Record DTO',
      file: 'UserResponse.java',
      code: `public record UserResponse(Long id, String username) {

    public static UserResponse from(UserEntity entity) {
        return new UserResponse(entity.getId(), entity.getUsername());
    }
}`,
    },
  ],
};
