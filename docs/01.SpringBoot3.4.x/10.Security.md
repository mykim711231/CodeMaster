# Security — Spring Security
## Official Documentation
- [Spring Security on Spring Boot](https://docs.spring.io/spring-boot/docs/current/reference/htmlsingle/#security)
- [Spring Security Reference (Servlet)](https://docs.spring.io/spring-security/reference/servlet/index.html)
## 핵심 개념
> Spring Security는 Servlet Filter 체인을 기반으로 인증(Authentication)과 인가(Authorization)를 처리하는 보안 프레임워크다. Spring Boot 3.x에서는 `SecurityFilterChain` 빈을 통해 모든 보안 설정을 Java DSL로 구성하며, `WebSecurityConfigurerAdapter` 는 완전히 제거되었다. 기본적으로 CSRF 활성화, `/login` Form 로그인, Basic Auth 헤더 인증이 자동 설정된다.
## 학습 목표
- `SecurityFilterChain` 빈으로 인증·인가 규칙을 Java DSL로 정의하기
- `PasswordEncoder` (BCryptPasswordEncoder) 빈 등록과 비밀번호 해싱 이해하기
- JWT 토큰 기반 Stateless 인증 필터 직접 구현하기
- `@PreAuthorize`, `@PostAuthorize` 로 메서드 수준 권한 제어하기
- `MethodSecurityConfiguration` 으로 `@EnableMethodSecurity` 활성화하기
- OAuth2 Resource Server 설정으로 JWT 검증과 클레임 기반 권한 매핑하기
## 예제 코드
```java
@Configuration
@EnableMethodSecurity
public class SecurityConfig {
    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
            .authorizeHttpRequests(auth -> auth
                .requestMatchers("/api/public/**").permitAll()
                .requestMatchers("/api/admin/**").hasRole("ADMIN")
                .anyRequest().authenticated())
            .sessionManagement(session ->
                session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
            .csrf(AbstractHttpConfigurer::disable)
            .addFilterBefore(
                new JwtAuthenticationFilter(jwtTokenProvider),
                UsernamePasswordAuthenticationFilter.class);
        return http.build();
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
}

// JWT Authentication Filter 예시
public class JwtAuthenticationFilter extends OncePerRequestFilter {
    private final JwtTokenProvider tokenProvider;

    @Override
    protected void doFilterInternal(HttpServletRequest request,
                                     HttpServletResponse response,
                                     FilterChain filterChain)
            throws ServletException, IOException {
        String token = resolveToken(request);
        if (token != null && tokenProvider.validateToken(token)) {
            Authentication auth = tokenProvider.getAuthentication(token);
            SecurityContextHolder.getContext().setAuthentication(auth);
        }
        filterChain.doFilter(request, response);
    }

    private String resolveToken(HttpServletRequest request) {
        String bearer = request.getHeader("Authorization");
        return (bearer != null && bearer.startsWith("Bearer "))
            ? bearer.substring(7) : null;
    }
}

// Method-level Authorization
@RestController
@RequestMapping("/api/admin")
public class AdminController {
    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping("/users")
    public List<User> getAllUsers() {
        return userService.findAll();
    }
}
```
## 주요 패턴
- Filter Chain: `UsernamePasswordAuthenticationFilter` → `BasicAuthenticationFilter` → ... 순서로 인증 위임
- AuthenticationProvider Chain: DaoAuthenticationProvider, LDAP, OAuth2 등 다양한 인증 방식 지원
- GrantedAuthority / Role: `ROLE_` 접두어로 Role 기반 접근 제어, `hasAuthority` vs `hasRole` 구분
- Security Context: 성공 시 `SecurityContextHolder`에 저장, Stateless에서는 매 요청마다 새로 생성
- Vulnerability Protection: CSRF, CORS, X-Frame-Options, HSTS 등 헤더 기반 기본 방어 활성화
## 주의사항
- `antMatchers()`는 Spring Security 6에서 제거, `requestMatchers()` 사용 필수
- `UserDetailsService` 구현 클래스는 반드시 `NotFoundException`이 아닌 `UsernameNotFoundException`을 던져야 함
- BCryptPasswordEncoder의 강도(Strength)는 최소 10 이상 권장하나, 성능을 고려해 적절한 값 선택
- OAuth2 Resource Server 연동 시 `spring.security.oauth2.resourceserver.jwt.issuer-uri` 설정과 실제 토큰 발급자 일치 확인 필수
