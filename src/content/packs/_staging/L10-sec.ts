import type { Snippet } from '../../types';

export const security: Snippet[] = [
  {
    id: 'sec-security-filter-chain',
    lang: 'java',
    title: 'SecurityFilterChain 기본',
    file: 'SecurityConfig.java',
    code: `@Bean
public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
  http
    .authorizeHttpRequests(auth -> auth
      .requestMatchers("/public/**").permitAll()
      .anyRequest().authenticated()
    )
    .formLogin(Customizer.withDefaults());
  return http.build();
}`,
    explain: {
      concept: 'SecurityFilterChain은 건물 출입처럼 모든 요청이 통과하는 검문소예요. /public 경로는 누구나 통과시키고 나머지는 로그인한 사람만 들여보내요.',
      terms: [
        { t: 'SecurityFilterChain', d: '필터들의 연결 고리, 요청 검문소' },
        { t: 'authorizeHttpRequests', d: 'URL별 접근 권한을 정하는 블록' },
        { t: 'requestMatchers', d: '특정 URL 패턴을 가리키는 도구' },
        { t: 'permitAll', d: '모두 허용 (검문 없음)' },
        { t: 'authenticated', d: '로그인한 사람만 허용' },
      ],
      why: '애플리케이션의 모든 입구를 한 곳에서 안전하게 통제하려고요.',
      pitfall: 'permitAll을 anyRequest 뒤에 두면 의미가 없어요. 순서가 중요해요.',
    },
  },
  {
    id: 'sec-enable-web-security',
    lang: 'java',
    title: '@EnableWebSecurity',
    file: 'SecurityConfig.java',
    code: `@Configuration
@EnableWebSecurity
public class SecurityConfig {
  @Bean
  public PasswordEncoder passwordEncoder() {
    return new BCryptPasswordEncoder();
  }
}`,
    explain: {
      concept: '@EnableWebSecurity는 "이제부터 보안 시스템을 켜겠다"는 스위치예요. 비밀번호를 안전하게 암호화하는 도구도 함께 켤 수 있어요.',
      terms: [
        { t: '@Configuration', d: '설정 클래스임을 알리는 표시' },
        { t: '@EnableWebSecurity', d: '웹 보안 기능을 활성화하는 스위치' },
        { t: 'PasswordEncoder', d: '비밀번호를 암호화·검증하는 도구' },
        { t: 'BCryptPasswordEncoder', d: '가장 많이 쓰는 강력한 암호화 방식' },
      ],
      why: '스프링 시큐리티의 모든 보안 기능을 끌어오기 위해서예요.',
      pitfall: '스프링 부트에서는 자동 설정되지만, 커스텀 설정이 꼬일 땐 명시적으로 선언해요.',
    },
  },
  {
    id: 'sec-user-details-service',
    lang: 'java',
    title: 'UserDetailsService 구현',
    file: 'CustomUserDetailsService.java',
    code: `@Service
public class CustomUserDetailsService implements UserDetailsService {
  @Override
  public UserDetails loadUserByUsername(String username) {
    return User.builder()
      .username(username)
      .password("{noop}1234")
      .roles("USER")
      .build();
  }
}`,
    explain: {
      concept: 'UserDetailsService는 도서관 사서님 같아요. 이름을 말하면 그 사람의 정보를 찾아오죠. 스프링 시큐리티가 로그인할 때 이 사서님에게 물어봐요.',
      terms: [
        { t: 'UserDetailsService', d: '사용자 정보를 가져오는 사서 역할' },
        { t: 'loadUserByUsername', d: '이름으로 사용자를 찾는 메서드' },
        { t: 'UserDetails', d: '사용자 정보를 담는 상자' },
        { t: '{noop}', d: '암호화 없이 그대로 저장한다는 표시 (학습용)' },
        { t: 'roles', d: '사용자의 역할 (USER, ADMIN 등)' },
      ],
      why: '스프링 시큐리티가 데이터베이스의 사용자와 연결하려고요.',
      pitfall: '실무에서는 {noop} 대신 반드시 BCrypt로 암호화해야 해요.',
    },
  },
  {
    id: 'sec-password-encoder',
    lang: 'java',
    title: 'PasswordEncoder 비밀번호 검증',
    file: 'UserService.java',
    code: `@Service
public class UserService {
  private final PasswordEncoder encoder;

  public boolean login(String rawPassword, String storedHash) {
    return encoder.matches(rawPassword, storedHash);
  }
}`,
    explain: {
      concept: 'PasswordEncoder는 비밀번호를 안전하게 갈아만드는 주머니예요. 저장할 땐 암호화하고, 로그인 땐 원본과 비교해요.',
      terms: [
        { t: 'PasswordEncoder', d: '비밀번호 암호화·검증 도구' },
        { t: 'matches', d: '원본 비번과 해시가 같은지 확인' },
        { t: 'rawPassword', d: '사용자가 입력한 원본 비번' },
        { t: 'storedHash', d: '저장된 암호화된 비번' },
      ],
      why: '비밀번호를 가공해서 저장하면 해킹당해도 원본을 알 수 없어요.',
      pitfall: 'encode 결과를 직접 equals로 비교하면 안 돼요. 무조건 matches를 써야 해요.',
    },
  },
  {
    id: 'sec-jwt-generate',
    lang: 'java',
    title: 'JWT 토큰 생성',
    file: 'JwtTokenProvider.java',
    code: `public String generateToken(String username) {
  return Jwts.builder()
    .subject(username)
    .issuedAt(new Date())
    .expiration(new Date(System.currentTimeMillis() + 3600_000))
    .signWith(secretKey)
    .compact();
}`,
    explain: {
      concept: 'JWT는 입장 팔찌 같아요. 한 번 발급받으면 다시 로그인하지 않아도 팔찌만 보여주면 입장할 수 있어요.',
      terms: [
        { t: 'Jwts.builder()', d: 'JWT를 조립하는 빌더' },
        { t: 'subject', d: '토큰의 주인 이름 (사용자)' },
        { t: 'issuedAt', d: '발급 시간' },
        { t: 'expiration', d: '만료 시간' },
        { t: 'signWith', d: '서명 키로 도장찍기' },
        { t: 'compact()', d: '최종 문자열로 완성' },
      ],
      why: '세션 없이도 인증을 유지할 수 있어 분산 환경에 좋아요.',
      pitfall: '비밀 키는 절대 코드에 하드코딩하면 안 돼요. 환경변수로 관리하세요.',
    },
  },
  {
    id: 'sec-jwt-validate',
    lang: 'java',
    title: 'JWT 토큰 검증',
    file: 'JwtTokenProvider.java',
    code: `public boolean validateToken(String token) {
  try {
    Jwts.parser()
      .verifyWith(secretKey)
      .build()
      .parseSignedClaims(token);
    return true;
  } catch (JwtException e) {
    return false;
  }
}`,
    explain: {
      concept: '토큰 검증은 팔찌가 진짜인지 확인하는 작업이에요. 서명과 만료 시간을 점검해 위조된 팔찌를 걸러내요.',
      terms: [
        { t: 'Jwts.parser()', d: '토큰을 해석하는 도구' },
        { t: 'verifyWith', d: '서명 키로 진위 확인' },
        { t: 'parseSignedClaims', d: '토큰을 풀어 내용 확인' },
        { t: 'JwtException', d: '위조나 만료 시 던지는 예외' },
      ],
      why: '위조된 토큰으로 접근하는 것을 막으려고요.',
      pitfall: '예외를 무시하면 안 돼요. false 처리 후 요청을 끊어야 해요.',
    },
  },
  {
    id: 'sec-jwt-auth-filter',
    lang: 'java',
    title: 'JWT 인증 필터',
    file: 'JwtAuthenticationFilter.java',
    code: `public class JwtAuthenticationFilter extends OncePerRequestFilter {
  @Override
  protected void doFilterInternal(HttpServletRequest req,
      HttpServletResponse res, FilterChain chain)
      throws ServletException, IOException {
    String token = resolveToken(req);
    if (token != null && provider.validateToken(token)) {
      UsernamePasswordAuthenticationToken auth = buildAuth(token);
      SecurityContextHolder.getContext().setAuthentication(auth);
    }
    chain.doFilter(req, res);
  }
}`,
    explain: {
      concept: '이 필터는 매 요청마다 팔찌(JWT)를 확인하고, 유효하면 로그인된 것으로 처리해요. 검문소 다음 단계로 통과시키는 느낌이에요.',
      terms: [
        { t: 'OncePerRequestFilter', d: '요청당 한 번만 실행되는 필터' },
        { t: 'doFilterInternal', d: '필터의 실제 동작 메서드' },
        { t: 'SecurityContextHolder', d: '현재 로그인된 사용자 보관함' },
        { t: 'setAuthentication', d: '인증 정보를 보관함에 넣기' },
        { t: 'chain.doFilter', d: '다음 필터로 요청 전달' },
      ],
      why: '세션 없이도 매 요청마다 인증을 유지하려고요.',
      pitfall: 'chain.doFilter를 빼먹으면 요청이 멈춰요. 반드시 마지막에 호출하세요.',
    },
  },
  {
    id: 'sec-oauth2-login',
    lang: 'java',
    title: 'OAuth2 로그인 설정',
    file: 'SecurityConfig.java',
    code: `@Bean
public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
  http
    .authorizeHttpRequests(auth -> auth
      .anyRequest().authenticated()
    )
    .oauth2Login(Customizer.withDefaults());
  return http.build();
}`,
    explain: {
      concept: 'OAuth2 로그인은 구글이나 깃허브에 "이 사람 우리 사이트 회원이 맞아요?" 하고 물어보는 위임 방식이에요. 우리가 직접 비밀번호를 받지 않아요.',
      terms: [
        { t: 'oauth2Login', d: '외부 서비스로 로그인하는 기능' },
        { t: 'Customizer.withDefaults', d: '기본 설정 그대로 사용' },
        { t: 'anyRequest().authenticated', d: '모든 요청에 로그인 필요' },
        { t: 'clientId/clientSecret', d: '구글·깃허브에서 발급받는 앱 식별 키 쌍' },
        { t: 'Authorization Code Flow', d: '코드를 먼저 받고 서버에서 토큰으로 교환하는 안전한 절차' },
        { t: 'redirect-uri', d: '외부 서비스가 인증 후 되돌아올 우리 앱 주소' },
      ],
      why: '사용자가 새 비밀번호를 만들지 않아도 안전하게 로그인할 수 있어요.',
      pitfall: 'application.yml에 clientId와 clientSecret을 반드시 등록해야 해요.',
    },
  },
  {
    id: 'sec-pre-authorize',
    lang: 'java',
    title: '@PreAuthorize 역할 제한',
    file: 'AdminController.java',
    code: `@RestController
@RequestMapping("/admin")
public class AdminController {
  @PreAuthorize("hasRole('ADMIN')")
  @GetMapping("/users")
  public List<User> listUsers() {
    return userService.findAll();
  }
}`,
    explain: {
      concept: '@PreAuthorize는 메서드 입구에 "관리자 전용" 팻말을 세우는 거예요. ADMIN 역할을 가진 사람만 호출할 수 있어요.',
      terms: [
        { t: '@PreAuthorize', d: '메서드 실행 전 권한 검사' },
        { t: 'hasRole', d: '특정 역할이 있는지 확인' },
        { t: '@RestController', d: 'JSON을 반환하는 컨트롤러' },
        { t: '@RequestMapping', d: '클래스 기준 URL' },
      ],
      why: 'URL뿐 아니라 메서드 단위로도 권한을 통제하려고요.',
      pitfall: '@EnableMethodSecurity를 설정 클래스에 추가해야 동작해요.',
    },
  },
  {
    id: 'sec-enable-method-security',
    lang: 'java',
    title: '@EnableMethodSecurity',
    file: 'SecurityConfig.java',
    code: `@Configuration
@EnableMethodSecurity
public class SecurityConfig {
  @Bean
  public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
    return http.build();
  }
}`,
    explain: {
      concept: '@EnableMethodSecurity는 메서드 단위 권한 검사를 켜는 스위치예요. 이걸 켜야 @PreAuthorize가 동작해요.',
      terms: [
        { t: '@EnableMethodSecurity', d: '메서드 보안 검사 활성화' },
        { t: '@Configuration', d: '설정 클래스 표시' },
        { t: 'SecurityFilterChain', d: '필터 체인 빈' },
      ],
      why: '메서드에 건 권한 어노테이션을 실제로 검사하려고요.',
      pitfall: '스위치를 안 켜면 @PreAuthorize가 무시돼요.',
    },
  },
  {
    id: 'sec-cors-config',
    lang: 'java',
    title: 'CORS 설정',
    file: 'SecurityConfig.java',
    code: `@Bean
public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
  http.cors(cors -> cors.configurationSource(req -> {
    CorsConfiguration cfg = new CorsConfiguration();
    cfg.setAllowedOrigins(List.of("https://example.com"));
    cfg.setAllowedMethods(List.of("GET", "POST"));
    return cfg;
  }));
  return http.build();
}`,
    explain: {
      concept: 'CORS는 "다른 동네(도메인)에서 온 요청은 받을까?" 정하는 규칙이에요. 허용된 출처만 통과시켜요.',
      terms: [
        { t: 'cors', d: '교차 출처 요청 허용 설정' },
        { t: 'configurationSource', d: 'CORS 규칙을 제공하는 함수' },
        { t: 'CorsConfiguration', d: '허용 규칙 상자' },
        { t: 'setAllowedOrigins', d: '허용할 출처 목록' },
        { t: 'setAllowedMethods', d: '허용할 HTTP 메서드' },
      ],
      why: '프론트엔드가 다른 도메인에 있어도 안전하게 통신하려고요.',
      pitfall: 'allowedOrigins에 "*"를 쓰면 credentials와 함께 쓸 수 없어요.',
    },
  },
  {
    id: 'sec-csrf-disable',
    lang: 'java',
    title: 'REST API에서 CSRF 비활성화',
    file: 'SecurityConfig.java',
    code: `@Bean
public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
  http
    .csrf(csrf -> csrf.disable())
    .sessionManagement(s -> s.sessionCreationPolicy(SessionCreationPolicy.STATELESS));
  return http.build();
}`,
    explain: {
      concept: 'CSRF는 공격자가 사용자 몰래 요청을 보내는 공격이에요. REST API는 상태가 없어서 CSRF 방어를 꺼도 돼요.',
      terms: [
        { t: 'csrf', d: '사이트 간 요청 위조 방어' },
        { t: 'disable', d: '기능 끄기' },
        { t: 'sessionManagement', d: '세션 정책 설정' },
        { t: 'SessionCreationPolicy.STATELESS', d: '세션을 만들지 않음 (JWT용)' },
      ],
      why: 'JWT 같은 무상태 인증에서는 세션을 안 쓰기 때문에 CSRF도 필요 없어요.',
      pitfall: '일반 웹(쿠키 세션)에서는 절대 CSRF를 끄면 안 돼요.',
    },
  },
  {
    id: 'sec-authority-list',
    lang: 'java',
    title: 'UserDetails 권한 목록',
    file: 'CustomUserDetails.java',
    code: `public class CustomUserDetails implements UserDetails {
  private final String username;
  private final String password;

  public CustomUserDetails(String username, String password) {
    this.username = username;
    this.password = password;
  }

  @Override
  public Collection<? extends GrantedAuthority> getAuthorities() {
    return List.of(
      new SimpleGrantedAuthority("ROLE_USER"),
      new SimpleGrantedAuthority("ROLE_ADMIN")
    );
  }

  @Override public String getUsername()            { return username; }
  @Override public String getPassword()            { return password; }
  @Override public boolean isAccountNonExpired()   { return true; }
  @Override public boolean isAccountNonLocked()    { return true; }
  @Override public boolean isCredentialsNonExpired(){ return true; }
  @Override public boolean isEnabled()             { return true; }
}`,
    explain: {
      concept: 'getAuthorities는 사용자의 "명찰 목록"이에요. 사용자가 어떤 역할들을 가지는지 보여줘요. UserDetails 인터페이스는 7개 메서드를 모두 구현해야 컴파일돼요.',
      terms: [
        { t: 'UserDetails', d: '사용자 정보 인터페이스 (7개 메서드 계약)' },
        { t: 'GrantedAuthority', d: '권한(역할)을 표현하는 명찰' },
        { t: 'SimpleGrantedAuthority', d: '문자열로 권한을 만드는 도구' },
        { t: 'ROLE_', d: '역할 표시 규칙의 접두사' },
        { t: 'isEnabled', d: '계정 활성화 여부 (false면 로그인 거부)' },
      ],
      why: '스프링 시큐리티가 사용자의 권한을 알아야 검문을 할 수 있어요.',
      pitfall: 'hasRole은 자동으로 ROLE_ 접두사를 붙여요. hasAuthority는 안 붙여요.',
    },
  },
  {
    id: 'sec-jwt-extract-claims',
    lang: 'java',
    title: 'JWT 클레임 추출',
    file: 'JwtTokenProvider.java',
    code: `public String getUsername(String token) {
  return Jwts.parser()
    .verifyWith(secretKey)
    .build()
    .parseSignedClaims(token)
    .getPayload()
    .getSubject();
}`,
    explain: {
      concept: 'JWT 안에는 사용자 정보가 담겨 있어요. 팔찌를 풀어서 그 안의 이름표를 꺼내는 작업이에요.',
      terms: [
        { t: 'Jwts.parser()', d: '토큰 해석 도구' },
        { t: 'verifyWith', d: '서명 키로 검증' },
        { t: 'parseSignedClaims', d: '서명된 토큰 해석' },
        { t: 'getPayload', d: '토큰의 본문 (클레임)' },
        { t: 'getSubject', d: 'subject에 담긴 값 (사용자명)' },
      ],
      why: '토큰에서 사용자 정보를 꺼내 인증을 만들려고요.',
      pitfall: '검증 없이 payload를 풀면 위조 가능해요. 반드시 verifyWith를 거치세요.',
    },
  },
  {
    id: 'sec-logout-handler',
    lang: 'java',
    title: '로그아웃 설정',
    file: 'SecurityConfig.java',
    code: `@Bean
public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
  http.logout(logout -> logout
    .logoutUrl("/logout")
    .logoutSuccessUrl("/login")
    .deleteCookies("JSESSIONID")
  );
  return http.build();
}`,
    explain: {
      concept: '로그아웃은 퇴실 처리예요. 세션을 지우고 쿠키도 없애서 다시 로그인하도록 만들어요.',
      terms: [
        { t: 'logout', d: '로그아웃 설정 블록' },
        { t: 'logoutUrl', d: '로그아웃을 호출할 URL' },
        { t: 'logoutSuccessUrl', d: '로그아웃 후 이동할 페이지' },
        { t: 'deleteCookies', d: '지울 쿠키 이름' },
      ],
      why: '사용자가 명시적으로 퇴장할 수 있게 하려고요.',
      pitfall: 'JWT 환경에서는 쿠키 대신 토큰 블랙리스트를 고려해야 해요.',
    },
  },
  {
    id: 'sec-security-context',
    lang: 'java',
    title: 'SecurityContextHolder로 사용자 조회',
    file: 'CurrentUserResolver.java',
    code: `public String getCurrentUsername() {
  Authentication auth = SecurityContextHolder.getContext().getAuthentication();
  if (auth == null || !auth.isAuthenticated()
      || auth instanceof AnonymousAuthenticationToken) {
    throw new IllegalStateException("인증되지 않았어요");
  }
  return auth.getName();
}`,
    explain: {
      concept: 'SecurityContextHolder는 현재 로그인된 사용자를 담아두는 보관함이에요. 여기서 이름을 꺼내면 "지금 로그인한 사람"을 알 수 있어요. 단, 미인증 요청에도 AnonymousAuthenticationToken이 주입되어 isAuthenticated()가 true를 반환하므로, 익명 인증 토큰까지 확인해야 진짜 로그인 여부를 알 수 있어요.',
      terms: [
        { t: 'SecurityContextHolder', d: '현재 인증된 사용자 보관함' },
        { t: 'getContext', d: '보안 컨텍스트 가져오기' },
        { t: 'getAuthentication', d: '인증 정보 가져오기' },
        { t: 'isAuthenticated', d: '인증되었는지 여부' },
        { t: 'getName', d: '사용자 이름 반환' },
      ],
      why: '컨트롤러 어디서든 현재 사용자를 알아내려고요.',
      pitfall: '스레드 로컬 기반이라 비동기에서는 사라질 수 있어요. @Async 전에 복사하세요.',
    },
  },
  {
    id: 'sec-exception-handling',
    lang: 'java',
    title: '인증 실패 처리',
    file: 'SecurityConfig.java',
    code: `@Bean
public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
  http.exceptionHandling(ex -> ex
    .authenticationEntryPoint((req, res, e) -> {
      res.setStatus(401);
      res.setContentType("application/json");
      res.getWriter().write("{\\"message\\":\\"인증이 필요해요\\"}");
    })
  );
  return http.build();
}`,
    explain: {
      concept: 'authenticationEntryPoint는 로그인 안 한 사람이 들어왔을 때 보여주는 안내문이에요. 401 상태로 "로그인 해주세요"라고 JSON 형식으로 알려줘요.',
      terms: [
        { t: 'exceptionHandling', d: '보안 예외 처리 블록' },
        { t: 'authenticationEntryPoint', d: '미인증 시 실행되는 진입점' },
        { t: 'setStatus', d: 'HTTP 상태 코드 지정' },
        { t: '401', d: '인증되지 않음을 뜻하는 상태' },
        { t: 'setContentType', d: '응답 형식 지정 (JSON)' },
      ],
      why: '인증 실패를 사용자에게 알리고 안내하려고요.',
      pitfall: 'Content-Type을 application/json으로 선언했으면 본문도 JSON 형식으로 써야 해요. 순수 문자열은 클라이언트가 파싱에 실패해요.',
    },
  },
  {
    id: 'sec-access-denied',
    lang: 'java',
    title: '권한 부족 처리',
    file: 'SecurityConfig.java',
    code: `@Bean
public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
  http.exceptionHandling(ex -> ex
    .accessDeniedHandler((req, res, e) -> {
      res.setStatus(403);
      res.setContentType("application/json");
      res.getWriter().write("{\\"message\\":\\"권한이 없어요\\"}");
    })
  );
  return http.build();
}`,
    explain: {
      concept: 'accessDeniedHandler는 로그인은 했지만 권한이 부족할 때 보여주는 안내문이에요. "관리자 전용이에요"라고 알려줘요.',
      terms: [
        { t: 'accessDeniedHandler', d: '권한 부족 시 실행되는 처리기' },
        { t: '403', d: '금지됨을 뜻하는 상태 코드' },
        { t: 'setContentType', d: '응답 형식을 JSON으로 지정' },
      ],
      why: '로그인 사용자와 미인증 사용자를 구분해 안내하려고요.',
      pitfall: '401(미인증 — 로그인 자체를 안 함)과 403(권한 부족 — 로그인은 했지만 접근 불가)을 헷갈리지 마세요.',
    },
  },
  {
    id: 'sec-hmac-key-jwt',
    lang: 'java',
    title: 'HMAC 키로 JWT 서명',
    file: 'JwtKeyConfig.java',
    code: `@Bean
SecretKey secretKey() {
  return Keys.hmacShaKeyFor(
    "very-secret-key-please-change-me-32bytes!".getBytes()
  );
}`,
    explain: {
      concept: 'JWT에 도장을 찍으려면 비밀 키가 필요해요. HMAC-SHA 방식은 같은 비밀 키로 서명하고 검증해요. RSA(공개키/개인키 쌍)와 달리 키를 하나만 관리해요.',
      terms: [
        { t: 'SecretKey', d: '서명에 쓰는 비밀 키' },
        { t: 'Keys.hmacShaKeyFor', d: '바이트 배열로 HMAC-SHA 키 생성' },
        { t: '32bytes', d: '최소 256비트 길이 권장 (짧으면 경고)' },
        { t: 'HMAC vs RSA', d: 'HMAC은 대칭(키 하나), RSA는 비대칭(공개·개인 키 쌍)' },
      ],
      why: '토큰 위조를 막기 위해 서명 키를 안전하게 보관하려고요.',
      pitfall: '키가 짧으면 약한 서명 경고가 떠요. 최소 32바이트 이상 쓰세요. 실무에서는 환경변수로 주입하세요.',
    },
  },
  {
    id: 'sec-security-ignored-paths',
    lang: 'java',
    title: '정적 리소스 보안 제외',
    file: 'SecurityConfig.java',
    code: `@Bean
public WebSecurityCustomizer webSecurityCustomizer() {
  return web -> web.ignoring().requestMatchers(
    "/static/**", "/css/**", "/js/**"
  );
}`,
    explain: {
      concept: '정적 파일(이미지, CSS)은 검문소를 거칠 필요가 없어요. ignoring으로 "이 경로는 필터 체인 자체를 건너뛰어도 돼"라고 알려줘요.',
      terms: [
        { t: 'WebSecurityCustomizer', d: '웹 보안 전체를 커스터마이징하는 도구' },
        { t: 'ignoring', d: '필터 체인 자체에서 완전히 제외' },
        { t: 'requestMatchers', d: '제외할 URL 패턴' },
      ],
      why: '정적 리소스는 보안 필터를 거치면 오히려 성능이 떨어져요.',
      pitfall: 'permitAll과 달리 ignoring은 필터 자체를 건너뛰어 보안 헤더·로깅도 적용되지 않아요. 동적 API에는 절대 쓰지 마세요. 인증이 필요 없는 API 엔드포인트는 permitAll을 사용하는 게 더 안전해요.',
    },
  },
];
