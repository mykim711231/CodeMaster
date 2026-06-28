import type { Snippet } from '../../types';

export const security: Snippet[] = [
  {
    id: 'sec-security-filter-chain',
    lang: 'java',
    title: 'SecurityFilterChain 기본',
    file: 'SecurityConfig.java',
    code: `import org.springframework.context.annotation.Bean;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.Customizer;
import org.springframework.security.web.SecurityFilterChain;

@Bean
public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
  System.out.println("[설정] SecurityFilterChain 구성 — /public 허용, 나머지 인증");
  http
    .authorizeHttpRequests(auth -> auth
      .requestMatchers("/public/**").permitAll()
      .anyRequest().authenticated()
    )
    .formLogin(Customizer.withDefaults());
  return http.build();
}`,
    explain: {
      concept:
        'SecurityFilterChain은 건물 출입구의 보안 검색대처럼, 모든 HTTP 요청이 통과하는 검문소예요. ' +
        'authorizeHttpRequests()로 URL 패턴별 접근 권한을 정의해요. /public/** 경로는 누구나(permitAll) 통과할 수 있고, 그 외 모든 요청(anyRequest)은 로그인한 사용자만(authenticated) 통과할 수 있어요. ' +
        'formLogin()을 추가하면 스프링 시큐리티가 기본 로그인 폼을 자동으로 생성해줘요. ' +
        '규칙은 위에서 아래로 평가되므로, 구체적인 패턴(/public/**)을 먼저 정의하고 포괄적인 anyRequest()를 마지막에 두는 순서가 중요해요. ' +
        'http.build()로 최종 SecurityFilterChain을 완성하면, 이 체인이 모든 요청의 앞단에서 작동해요.',
      terms: [
        { t: 'SecurityFilterChain', d: '보안 필터들의 연결 고리로, 모든 HTTP 요청이 이 체인을 통과하면서 인증·인가 검사를 받아요.' },
        { t: 'authorizeHttpRequests', d: 'URL 패턴별로 접근 권한을 설정하는 DSL 블록이에요. 람다 auth 안에서 규칙을 정의해요.' },
        { t: 'requestMatchers("/public/**")', d: '특정 URL 패턴을 지정해서 해당 경로에 권한 규칙을 적용해요. Ant 스타일 패턴(**=하위 모두)을 사용해요.' },
        { t: 'permitAll()', d: '인증 여부와 관계없이 모든 요청을 허용해요. 로그인하지 않은 사용자도 통과할 수 있어요.' },
        { t: 'anyRequest().authenticated()', d: '앞에서 명시하지 않은 모든 요청은 로그인된 사용자만 접근할 수 있어요. 가장 마지막에 위치해야 해요.' },
      ],
      why:
        '애플리케이션의 모든 HTTP 요청을 한 곳에서 통제하려고 해요. URL별로 다른 권한 정책을 적용하고, 비인가 접근을 원천 차단해요.',
      expectedOutput:
        '[설정] SecurityFilterChain 구성 — /public 허용, 나머지 인증',
      realWorldUsage:
        '실제 프로젝트에서 로그인 없이 접근 가능한 페이지(메인, 공지사항, /public)와 로그인이 필요한 페이지(마이페이지, 관리자)를 구분할 때 이 설정을 사용해요. ' +
        'REST API에서는 .formLogin() 대신 .httpBasic()이나 JWT 필터를 사용하는 게 일반적이에요.',
      pitfall:
        'permitAll()을 anyRequest() 뒤에 두면 이미 anyRequest().authenticated()가 모든 요청을 잡아서 permitAll이 무시돼요. ' +
        '항상 더 구체적인 패턴을 먼저, 포괄적인 패턴을 나중에 배치하는 순서를 지켜야 해요.',
    },
  },
  {
    id: 'sec-enable-web-security',
    lang: 'java',
    title: '@EnableWebSecurity',
    file: 'SecurityConfig.java',
    code: `import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

  @Bean
  public PasswordEncoder passwordEncoder() {
    System.out.println("[설정] BCryptPasswordEncoder 등록");
    return new BCryptPasswordEncoder();
  }
}`,
    explain: {
      concept:
        '@EnableWebSecurity는 "이제부터 스프링 시큐리티의 보안 시스템을 켭니다"라고 선언하는 스위치예요. ' +
        '이 어노테이션이 있으면 스프링 시큐리티가 SecurityFilterChain을 찾아서 필터 체인을 구성해요. ' +
        'PasswordEncoder 빈을 함께 등록하면 비밀번호를 BCrypt로 안전하게 암호화할 수 있어요. ' +
        'BCryptPasswordEncoder는 현재 가장 널리 쓰이는 비밀번호 해시 알고리즘으로, 같은 비밀번호라도 매번 다른 해시값(Salt 포함)을 생성해서 레인보우 테이블 공격을 방어해요. ' +
        'Spring Boot에서는 자동 설정으로 @EnableWebSecurity가 없어도 기본 보안이 켜지지만, 커스텀 설정을 할 때는 명시적으로 붙이는 게 안전해요.',
      terms: [
        { t: '@Configuration', d: '이 클래스가 스프링 빈 설정 클래스임을 나타내요. @Bean 메서드들이 여기에 정의돼요.' },
        { t: '@EnableWebSecurity', d: '스프링 시큐리티의 웹 보안 기능을 활성화하는 스위치예요. SecurityFilterChain 빈을 찾아 적용해요.' },
        { t: 'PasswordEncoder', d: '비밀번호를 단방향 암호화(해시)하고, 로그인 시 원본 비밀번호와 해시를 비교하는 인터페이스예요.' },
        { t: 'BCryptPasswordEncoder', d: 'BCrypt 알고리즘으로 비밀번호를 해시하는 인코더예요. 자동으로 Salt를 생성해서 동일 비밀번호도 다른 해시를 만들어요.' },
      ],
      why:
        '애플리케이션의 모든 엔드포인트에 보안을 적용하고, 비밀번호를 평문으로 저장하는 위험을 없애려고 해요.',
      expectedOutput:
        '[설정] BCryptPasswordEncoder 등록',
      realWorldUsage:
        '실제 프로젝트에서 SecurityConfig 클래스는 모든 보안 설정의 진입점이에요. 여기에 PasswordEncoder, SecurityFilterChain, UserDetailsService, CORS 설정 등을 모두 모아서 관리해요.',
      pitfall:
        'Spring Boot 2.7+에서는 @EnableWebSecurity를 생략해도 자동 설정되지만, SecurityFilterChain 빈을 커스텀하게 정의할 때는 명시적으로 붙이는 게 의도를 명확히 하고 예상치 못한 자동 설정 충돌을 막아줘요.',
    },
  },
  {
    id: 'sec-user-details-service',
    lang: 'java',
    title: 'UserDetailsService 구현',
    file: 'CustomUserDetailsService.java',
    code: `import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.stereotype.Service;

@Service
public class CustomUserDetailsService implements UserDetailsService {

  @Override
  public UserDetails loadUserByUsername(String username) {
    System.out.println("[조회] 사용자 검색: " + username);
    return User.builder()
      .username(username)
      .password("{noop}1234")
      .roles("USER")
      .build();
  }
}`,
    explain: {
      concept:
        'UserDetailsService는 도서관 사서님처럼, "누구세요?"라고 물으면 이름으로 사용자 정보를 찾아주는 역할이에요. ' +
        '스프링 시큐리티가 로그인 요청을 받으면 loadUserByUsername()을 호출해서 사용자 정보(비밀번호, 권한)를 DB나 인메모리에서 가져와요. ' +
        'User.builder()로 UserDetails 객체를 간편하게 만들 수 있어요. {noop} 접두사는 "비밀번호를 암호화하지 않고 그대로 비교해요"라는 의미예요. ' +
        '실무에서는 {noop} 대신 BCryptPasswordEncoder로 해시된 비밀번호를 사용해야 해요. ' +
        "roles(\"USER\")는 이 사용자에게 \"ROLE_USER\" 권한을 부여해서, @PreAuthorize(\"hasRole('USER')\")가 통과할 수 있게 해줘요.",
      terms: [
        { t: 'UserDetailsService', d: '사용자명(username)으로 사용자 정보를 조회하는 인터페이스예요. loadUserByUsername() 하나만 구현하면 돼요.' },
        { t: 'loadUserByUsername(String)', d: '로그인 시 입력된 사용자명으로 DB에서 사용자를 찾아 반환해요. 없으면 UsernameNotFoundException을 던져요.' },
        { t: 'UserDetails', d: '사용자의 이름·비밀번호·권한·계정 상태(잠김·만료)를 담는 정보 상자예요. User.builder()로 편리하게 생성해요.' },
        { t: '{noop}', d: 'NoOp 인코딩 접두사로, 암호화 없이 평문 비밀번호를 그대로 비교해요. 학습 용도로만 쓰고 실무에서는 BCrypt를 써요.' },
        { t: 'roles("USER")', d: '"ROLE_USER" 권한을 부여해요. hasRole("USER")로 접근 제어할 때 이 권한이 검사돼요.' },
      ],
      why:
        '사용자 인증 정보를 DB나 외부 시스템에서 가져와서 스프링 시큐리티의 인증 체계와 연결하려고 해요.',
      expectedOutput:
        '[조회] 사용자 검색: user1',
      realWorldUsage:
        '실제 프로젝트에서 UserDetailsService는 보통 JPA Repository나 MyBatis Mapper를 주입받아 DB에서 사용자 정보를 조회해요. ' +
        '소셜 로그인(Google, GitHub)을 쓸 때는 OAuth2UserService가 비슷한 역할을 해요.',
      pitfall:
        '실무에서는 {noop} 대신 반드시 BCryptPasswordEncoder로 암호화된 비밀번호를 저장하고 사용해야 해요. 평문 비밀번호 저장은 DB 유출 시 모든 사용자 계정이 털리는 심각한 보안 사고로 이어져요.',
    },
  },
  {
    id: 'sec-password-encoder',
    lang: 'java',
    title: 'PasswordEncoder 비밀번호 검증',
    file: 'UserService.java',
    code: `import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class UserService {

  private final PasswordEncoder encoder;

  public UserService(PasswordEncoder encoder) {
    this.encoder = encoder;
  }

  public boolean login(String rawPassword, String storedHash) {
    System.out.println("[검증] 비밀번호 비교 수행");
    boolean matched = encoder.matches(rawPassword, storedHash);
    System.out.println("[결과] 비밀번호 일치: " + matched);
    return matched;
  }
}`,
    explain: {
      concept:
        'PasswordEncoder는 비밀번호를 안전하게 암호화(해시)하고, 로그인 시 입력된 비밀번호와 저장된 해시를 비교하는 도구예요. ' +
        'encode(raw)로 비밀번호를 해시해서 DB에 저장하고, matches(raw, hash)로 입력 비밀번호가 저장된 해시와 일치하는지 확인해요. ' +
        'matches() 내부에서는 입력값을 같은 알고리즘+Salt로 해시한 뒤 저장된 해시와 비교해요. ' +
        '절대로 encode() 결과끼리 equals()로 비교하면 안 돼요. BCrypt는 호출할 때마다 다른 Salt를 생성해서 다른 해시값이 나오기 때문이에요. ' +
        '이런 단방향 해시 덕분에 DB가 털려도 원본 비밀번호를 복원할 수 없어서 사용자 피해를 최소화할 수 있어요.',
      terms: [
        { t: 'PasswordEncoder', d: '비밀번호의 단방향 암호화와 검증을 담당하는 인터페이스예요. encode()와 matches() 두 핵심 메서드가 있어요.' },
        { t: 'matches(rawPassword, hash)', d: '입력된 원본 비밀번호가 저장된 해시와 일치하는지 확인해요. BCrypt는 내부적으로 Salt를 추출해 비교해요.' },
        { t: 'rawPassword', d: '사용자가 로그인 폼에 입력한 평문 비밀번호예요. 절대 로그에 찍거나 저장하면 안 돼요.' },
        { t: 'storedHash', d: 'DB에 저장된 암호화된 비밀번호 해시예요. BCrypt는 $2a$10$... 같은 형식으로 Salt와 해시가 함께 저장돼요.' },
      ],
      why:
        '비밀번호를 평문으로 저장하는 건 치명적인 보안 위험이에요. 단방향 해시로 저장하면 DB 유출 사고에도 원본 비밀번호가 노출되지 않아요.',
      expectedOutput:
        '[검증] 비밀번호 비교 수행\n' +
        '[결과] 비밀번호 일치: true',
      realWorldUsage:
        '실제 프로젝트에서 회원가입 시 encoder.encode(rawPw)로 해시를 만들어 DB에 저장하고, 로그인 시 encoder.matches(rawPw, storedHash)로 검증해요. ' +
        '스프링 시큐리티의 AuthenticationManager가 내부적으로 이 matches()를 호출해서 로그인을 처리해요.',
      pitfall:
        'encode() 결과끼리 equals()로 직접 비교하지 마세요. BCrypt는 매번 다른 Salt를 생성해서 같은 비밀번호라도 다른 해시가 나와요. ' +
        '비밀번호 비교는 반드시 matches() 메서드를 통해서만 해야 해요.',
    },
  },
  {
    id: 'sec-jwt-generate',
    lang: 'java',
    title: 'JWT 토큰 생성',
    file: 'JwtTokenProvider.java',
    code: `import io.jsonwebtoken.Jwts;
import javax.crypto.SecretKey;
import java.util.Date;

public String generateToken(String username) {
  System.out.println("[발급] JWT 생성 — subject: " + username);
  String token = Jwts.builder()
    .subject(username)
    .issuedAt(new Date())
    .expiration(new Date(System.currentTimeMillis() + 3600_000))
    .signWith(secretKey)
    .compact();
  System.out.println("[완료] 토큰 생성 완료");
  return token;
}`,
    explain: {
      concept:
        'JWT(Json Web Token)는 놀이공원 입장 팔찌와 같아요. 한 번 로그인해서 발급받으면, 이후 요청마다 팔찌만 보여주면 다시 로그인하지 않아도 인증돼요. ' +
        'Jwts.builder()로 토큰을 조립하는데, subject(토큰 주인), issuedAt(발급 시간), expiration(만료 시간)을 설정하고 signWith(비밀 키)로 서명해요. ' +
        'compact()가 최종 토큰 문자열(header.payload.signature)을 생성해요. ' +
        '서버는 세션을 유지할 필요 없이, 매 요청마다 이 토큰의 서명을 검증해서 사용자를 식별해요. 그래서 서버를 여러 대로 늘려도(scale-out) 인증 상태를 공유할 필요가 없어져요.',
      terms: [
        { t: 'Jwts.builder()', d: 'JWT를 단계별로 조립하는 빌더예요. subject, expiration, signWith 등을 체이닝해서 설정해요.' },
        { t: 'subject(username)', d: '토큰의 주인을 식별하는 값이에요. 보통 사용자 ID나 이메일을 넣어요.' },
        { t: 'expiration(...)', d: '토큰 만료 시점을 설정해요. 예제는 현재 시간 + 1시간(3600_000밀리초)으로 설정해요.' },
        { t: 'signWith(secretKey)', d: '비밀 키로 토큰에 서명해요. 이 서명으로 토큰이 위조됐는지 검증할 수 있어요.' },
        { t: 'compact()', d: '모든 설정을 모아서 최종 JWT 문자열(eyJhbGci...)로 직렬화해요.' },
      ],
      why:
        '서버가 세션을 저장하지 않고도 사용자 인증을 유지하려고 해요. 서버 증설이 자유롭고, 마이크로서비스 간 인증 전파도 쉬워져요.',
      expectedOutput:
        '[발급] JWT 생성 — subject: user1\n' +
        '[완료] 토큰 생성 완료',
      realWorldUsage:
        '실제 프로젝트에서 로그인 API가 성공하면 JWT를 발급해서 클라이언트(웹·앱)에 전달하고, 클라이언트는 이후 모든 요청의 Authorization 헤더에 이 토큰을 담아 보내요. ' +
        'REST API + SPA(React, Vue) 구조에서 세션 대신 JWT가 사실상 표준이에요.',
      pitfall:
        '비밀 키(secretKey)는 절대 코드에 하드코딩하면 안 돼요. GitHub에 올라가면 토큰을 누구나 위조할 수 있어서 모든 계정이 털려요. ' +
        '환경변수, Vault, AWS Secrets Manager 등으로 안전하게 관리해야 해요.',
    },
  },
  {
    id: 'sec-jwt-validate',
    lang: 'java',
    title: 'JWT 토큰 검증',
    file: 'JwtTokenProvider.java',
    code: `import io.jsonwebtoken.JwtException;
import io.jsonwebtoken.Jwts;
import javax.crypto.SecretKey;

public boolean validateToken(String token) {
  System.out.println("[검증] JWT 유효성 확인");
  try {
    Jwts.parser()
      .verifyWith(secretKey)
      .build()
      .parseSignedClaims(token);
    System.out.println("[성공] 토큰 유효함");
    return true;
  } catch (JwtException e) {
    System.out.println("[실패] 토큰 무효: " + e.getMessage());
    return false;
  }
}`,
    explain: {
      concept:
        '토큰 검증은 입장 팔찌가 진짜인지, 만료되지 않았는지 확인하는 보안 검사예요. ' +
        'Jwts.parser()로 토큰을 해석할 준비를 하고, verifyWith(secretKey)로 서명을 검증할 비밀 키를 설정해요. ' +
        'parseSignedClaims(token)가 토큰을 파싱하면서 서명 검증과 만료 시간 확인을 동시에 수행해요. ' +
        '서명이 다르면(위조된 토큰), 만료됐으면, 형식이 잘못됐으면 JwtException이 발생해요. ' +
        '이 검증을 통과해야만 토큰 안의 클레임(사용자 정보)을 신뢰할 수 있어요. 검증 없이 클레임을 꺼내면 위조된 토큰으로도 인증을 통과할 수 있어서 매우 위험해요.',
      terms: [
        { t: 'Jwts.parser()', d: 'JWT 문자열을 해석(파싱)하는 빌더예요. verifyWith로 서명 키를 설정하고 parseSignedClaims로 검증해요.' },
        { t: 'verifyWith(secretKey)', d: '토큰 생성 시 사용한 것과 동일한 비밀 키로 서명을 검증해요. 다르면 JwtException이 발생해요.' },
        { t: 'parseSignedClaims(token)', d: '토큰을 파싱하고 서명·만료 시간을 검증한 뒤, 성공하면 클레임 정보를 반환해요.' },
        { t: 'JwtException', d: '토큰 위조, 만료, 형식 오류 등 JWT 관련 모든 예외의 상위 클래스예요. 구체 예외로 ExpiredJwtException 등이 있어요.' },
      ],
      why:
        '클라이언트가 보낸 토큰이 진짜인지, 만료되지 않았는지 확인해서 위조된 토큰으로 위장 접근하는 공격을 막으려고 해요.',
      expectedOutput:
        '[검증] JWT 유효성 확인\n' +
        '[성공] 토큰 유효함',
      realWorldUsage:
        '실제 프로젝트에서 JwtAuthenticationFilter의 doFilterInternal()에서 매 요청마다 이 validateToken()을 호출해서, 유효한 토큰만 SecurityContext에 등록해요. ' +
        '만료된 토큰은 401 응답을 보내고 클라이언트가 refresh token으로 재발급 받도록 유도해요.',
      pitfall:
        '예외를 삼키고 무조건 true를 반환하면 위조된 토큰도 통과돼요. JwtException을 반드시 catch해서 false를 반환하고, 요청을 401로 거절해야 해요. ' +
        '또한 검증 없이 payload만 파싱하면 서명을 확인하지 않으므로, 누구나 임의의 사용자 정보를 담은 토큰을 만들어 침투할 수 있어요.',
    },
  },
  {
    id: 'sec-jwt-auth-filter',
    lang: 'java',
    title: 'JWT 인증 필터',
    file: 'JwtAuthenticationFilter.java',
    code: `import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.filter.OncePerRequestFilter;
import java.io.IOException;

public class JwtAuthenticationFilter extends OncePerRequestFilter {

  @Override
  protected void doFilterInternal(HttpServletRequest req,
      HttpServletResponse res, FilterChain chain)
      throws ServletException, IOException {
    String token = resolveToken(req);
    System.out.println("[인증] 토큰 확인: " + (token != null ? "있음" : "없음"));
    if (token != null && provider.validateToken(token)) {
      UsernamePasswordAuthenticationToken auth = buildAuth(token);
      SecurityContextHolder.getContext().setAuthentication(auth);
      System.out.println("[인증] 인증 등록 완료");
    }
    chain.doFilter(req, res);
  }

  private String resolveToken(HttpServletRequest req) {
    String bearer = req.getHeader("Authorization");
    if (bearer != null && bearer.startsWith("Bearer ")) {
      return bearer.substring(7);
    }
    return null;
  }

  private UsernamePasswordAuthenticationToken buildAuth(String token) {
    String username = provider.getUsername(token);
    return new UsernamePasswordAuthenticationToken(
        username, null, List.of(new SimpleGrantedAuthority("ROLE_USER")));
  }
}`,
    explain: {
      concept:
        '이 필터는 매 HTTP 요청마다 실행돼서, Authorization 헤더에서 JWT 토큰을 꺼내 검증하고 통과시키는 검문소예요. ' +
        'OncePerRequestFilter를 상속하면 요청당 한 번만 실행됨이 보장돼요(필터 체인 내 중복 호출 방지). ' +
        'resolveToken()이 "Bearer eyJhbG..." 형식의 헤더에서 "Bearer " 접두사를 떼고 토큰만 추출해요. ' +
        '토큰이 유효하면 buildAuth()로 UsernamePasswordAuthenticationToken을 만들어서 SecurityContextHolder에 등록해요. ' +
        '이 등록으로 스프링 시큐리티가 "이 요청은 인증된 사용자"라고 인식하게 돼요. ' +
        '마지막에 chain.doFilter()를 호출해서 요청이 다음 필터와 컨트롤러로 이어지게 해줘요.',
      terms: [
        { t: 'OncePerRequestFilter', d: '요청당 한 번만 실행되는 필터 기반 클래스예요. 필터 체인에서 중복 호출을 방지해줘요.' },
        { t: 'doFilterInternal', d: '필터의 실제 동작을 구현하는 메서드예요. 요청·응답·필터 체인을 매개변수로 받아요.' },
        { t: 'SecurityContextHolder', d: '현재 스레드에 인증된 사용자 정보를 담아두는 보관함이에요. getContext()로 꺼내서 조작해요.' },
        { t: 'setAuthentication(auth)', d: '인증 정보를 SecurityContext에 등록해서, 이후 컨트롤러에서 현재 사용자 정보를 조회할 수 있게 해요.' },
        { t: 'chain.doFilter(req, res)', d: '다음 필터로 요청을 전달해요. 호출하지 않으면 요청이 멈춰서 컨트롤러까지 도달하지 않아요.' },
      ],
      why:
        '세션 없이도 매 요청마다 JWT로 사용자를 식별하고 인증 상태를 유지하려고 해요. REST API의 무상태(stateless) 인증을 구현하는 핵심이에요.',
      expectedOutput:
        '[인증] 토큰 확인: 있음\n' +
        '[인증] 인증 등록 완료',
      realWorldUsage:
        '실제 프로젝트에서 Spring Security + JWT 조합의 표준 패턴이에요. SecurityConfig에서 addFilterBefore()로 이 필터를 UsernamePasswordAuthenticationFilter 앞에 끼워서, 모든 요청이 컨트롤러 도달 전에 JWT 인증을 거치게 해요.',
      pitfall:
        'chain.doFilter()를 빼먹으면 요청이 거기서 멈춰서 컨트롤러에 도달하지 않아요. 반드시 마지막에 호출하세요. ' +
        '또한 유효하지 않은 토큰일 때도 chain.doFilter()는 호출해야, 다음 필터(익명 인증 등)가 정상 처리할 수 있어요.',
    },
  },
  {
    id: 'sec-oauth2-login',
    lang: 'java',
    title: 'OAuth2 로그인 설정',
    file: 'SecurityConfig.java',
    code: `import org.springframework.context.annotation.Bean;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.web.SecurityFilterChain;

@Bean
public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
  System.out.println("[설정] OAuth2 로그인 활성화");
  http
    .authorizeHttpRequests(auth -> auth
      .anyRequest().authenticated()
    )
    .oauth2Login(Customizer.withDefaults());
  return http.build();
}`,
    explain: {
      concept:
        'OAuth2 로그인은 "구글이나 깃허브에 대신 물어볼게요" 방식의 위임 인증이에요. 우리 서비스가 직접 비밀번호를 받지 않고, 신뢰할 수 있는 제공자(Google, GitHub, Kakao 등)에게 인증을 맡겨요. ' +
        '사용자는 구글 아이디로 로그인 버튼을 누르면 구글 로그인 페이지로 이동하고, 로그인 성공 후 Authorization Code를 받아서 우리 서버가 토큰으로 교환해요. ' +
        'Customizer.withDefaults()는 스프링 시큐리티의 기본 OAuth2 설정을 그대로 사용하겠다는 의미예요. ' +
        '이 방식의 장점은 사용자가 또 다른 비밀번호를 만들 필요가 없고, 우리 서비스 DB에 비밀번호를 저장하지 않아도 돼서 보안 부담이 줄어든다는 점이에요.',
      terms: [
        { t: 'oauth2Login(Customizer.withDefaults())', d: 'OAuth2 로그인을 기본 설정으로 활성화해요. /oauth2/authorization/{provider} 경로가 자동 생성돼요.' },
        { t: 'Authorization Code Flow', d: 'OAuth2의 가장 안전한 흐름이에요. 코드를 먼저 받고 서버 측에서 토큰으로 교환해서 토큰이 브라우저에 노출되지 않아요.' },
        { t: 'clientId / clientSecret', d: 'OAuth2 제공자(구글 등)가 발급하는 우리 앱의 식별자와 비밀번호예요. application.yml에 설정해야 해요.' },
        { t: 'redirect-uri', d: '인증 완료 후 OAuth2 제공자가 사용자를 되돌려 보낼 우리 앱의 주소예요. 제공자 콘솔에 미리 등록해야 해요.' },
      ],
      why:
        '사용자에게 편리한 소셜 로그인을 제공하고, 동시에 비밀번호 관리 책임을 신뢰할 수 있는 대형 제공자에게 위임하려고 해요.',
      expectedOutput:
        '[설정] OAuth2 로그인 활성화',
      realWorldUsage:
        '실제 프로젝트에서 "Google로 로그인", "GitHub로 로그인" 버튼이 있는 거의 모든 서비스가 Spring Security OAuth2 Client를 사용해요. ' +
        '기업 내부 시스템에서는 Azure AD나 Okta 같은 SSO(Single Sign-On) 제공자와 연동할 때도 OAuth2/OIDC를 써요.',
      pitfall:
        'application.yml에 spring.security.oauth2.client.registration.{provider}.client-id와 client-secret을 반드시 등록해야 해요. ' +
        '또한 redirect-uri가 제공자 콘솔에 등록된 값과 정확히 일치해야 해요. 불일치 시 "redirect_uri_mismatch" 에러가 발생해요.',
    },
  },
  {
    id: 'sec-pre-authorize',
    lang: 'java',
    title: '@PreAuthorize 역할 제한',
    file: 'AdminController.java',
    code: `import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import java.util.List;

@RestController
@RequestMapping("/admin")
public class AdminController {

  @PreAuthorize("hasRole('ADMIN')")
  @GetMapping("/users")
  public List<User> listUsers() {
    System.out.println("[실행] 관리자 전용 — 사용자 목록 조회");
    return userService.findAll();
  }
}`,
    explain: {
      concept:
        '@PreAuthorize는 메서드 입구에 "관리자 전용" 팻말을 세우는 것과 같아요. ' +
        'hasRole("ADMIN")은 현재 로그인한 사용자가 ROLE_ADMIN 권한을 가지고 있는지 검사하는 SpEL 표현식이에요. ' +
        '권한이 없으면 AccessDeniedException이 발생하고 403 Forbidden 응답이 반환돼요. ' +
        'URL 레벨의 보안(SecurityFilterChain)보다 더 세밀하게, 메서드 단위로 권한을 통제할 수 있어요. ' +
        '컨트롤러뿐 아니라 서비스 레이어에도 붙일 수 있어서, "이 메서드는 관리자만 호출 가능"이라는 비즈니스 규칙을 코드에 직접 표현할 수 있어요.',
      terms: [
        { t: '@PreAuthorize', d: '메서드 실행 전에 SpEL 조건을 평가해서, false면 실행을 막고 403을 반환해요.' },
        { t: 'hasRole("ADMIN")', d: '현재 사용자가 ROLE_ADMIN 권한을 가지고 있는지 검사하는 SpEL 함수예요. 내부적으로 ROLE_ADMIN으로 변환해 비교해요.' },
        { t: '@RestController', d: '이 클래스의 모든 메서드 반환값이 JSON으로 직렬화돼서 HTTP 응답 본문에 담겨요.' },
        { t: '@RequestMapping("/admin")', d: '클래스 레벨의 URL 접두사를 정의해요. 이 컨트롤러의 모든 경로가 /admin으로 시작해요.' },
      ],
      why:
        'URL 패턴만으로는 표현할 수 없는 세밀한 권한 제어(관리자만, VIP만, 본인의 데이터만)를 메서드 단위로 적용하려고 해요.',
      expectedOutput:
        '[실행] 관리자 전용 — 사용자 목록 조회',
      realWorldUsage:
        '실제 프로젝트에서 관리자 API, 사용자 개인정보 API, 결제 취소 API 등 민감한 작업에 @PreAuthorize를 붙여서 권한을 검증해요. ' +
        'hasPermission()으로 객체 레벨의 ACL(접근 제어 목록)도 표현할 수 있어요.',
      pitfall:
        '@PreAuthorize를 동작시키려면 @Configuration 클래스에 @EnableMethodSecurity를 반드시 추가해야 해요. ' +
        '이 어노테이션이 없으면 @PreAuthorize가 완전히 무시되고 권한 검사 없이 메서드가 실행돼서 심각한 보안 구멍이 생겨요.',
    },
  },
  {
    id: 'sec-enable-method-security',
    lang: 'java',
    title: '@EnableMethodSecurity',
    file: 'SecurityConfig.java',
    code: `import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
@EnableMethodSecurity
public class SecurityConfig {

  @Bean
  public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
    System.out.println("[설정] Method Security 활성화");
    return http.build();
  }
}`,
    explain: {
      concept:
        '@EnableMethodSecurity는 메서드 단위 권한 검사(@PreAuthorize, @PostAuthorize, @Secured 등)를 활성화하는 스위치예요. ' +
        '이 어노테이션이 있어야 스프링이 AOP 프록시를 생성해서 @PreAuthorize가 붙은 메서드 호출을 가로채 권한을 검사해요. ' +
        'Spring Security 6+에서는 @EnableGlobalMethodSecurity가 deprecated 되고 @EnableMethodSecurity로 대체됐어요. ' +
        '메서드 보안과 웹 보안(SecurityFilterChain)은 별개로 동작해서, 둘 다 각자 활성화가 필요해요. ' +
        '웹 보안은 URL 기반으로 요청을 필터링하고, 메서드 보안은 메서드 호출 시점에 권한을 검사하는 2중 방어 체계예요.',
      terms: [
        { t: '@EnableMethodSecurity', d: '메서드 레벨의 보안 어노테이션(@PreAuthorize 등)을 활성화하는 스위치예요. AOP 프록시 기반으로 동작해요.' },
        { t: '@Configuration', d: '이 클래스가 스프링 설정 클래스임을 나타내요. @Bean 메서드들이 스프링 컨테이너에 등록돼요.' },
        { t: 'AOP 프록시', d: '원본 빈을 프록시로 감싸서, 메서드 호출 전/후에 권한 검사 같은 부가 작업을 끼워 넣는 기술이에요.' },
        { t: '@PreAuthorize vs @Secured', d: '@PreAuthorize는 SpEL로 복잡한 조건을 쓸 수 있고, @Secured는 단순 역할 목록만 검사해요.' },
      ],
      why:
        '컨트롤러와 서비스 레이어에서 @PreAuthorize가 실제로 동작하게 하려고 해요. 이 스위치가 꺼져 있으면 모든 어노테이션이 무시돼요.',
      expectedOutput:
        '[설정] Method Security 활성화',
      realWorldUsage:
        '실제 프로젝트에서 @EnableMethodSecurity + @PreAuthorize 조합으로 관리자 API만 ADMIN 권한으로 제한하고, 사용자 API는 본인 데이터만 접근 가능하게 ACL을 적용해요. ' +
        '서비스 레이어에 붙이면 컨트롤러를 우회한 내부 호출도 권한 검사를 통과해야 해서 더 안전해요.',
      pitfall:
        '스위치를 켜지 않으면 @PreAuthorize가 완전히 무시돼요. 컴파일 에러도, 경고도 없이 그냥 지나가기 때문에 배포 전에 반드시 확인해야 해요.',
    },
  },
  {
    id: 'sec-cors-config',
    lang: 'java',
    title: 'CORS 설정',
    file: 'SecurityConfig.java',
    code: `import java.util.List;
import org.springframework.context.annotation.Bean;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.web.cors.CorsConfiguration;

@Bean
public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
  System.out.println("[설정] CORS — https://example.com 허용");
  http.cors(cors -> cors.configurationSource(req -> {
    CorsConfiguration cfg = new CorsConfiguration();
    cfg.setAllowedOrigins(List.of("https://example.com"));
    cfg.setAllowedMethods(List.of("GET", "POST"));
    return cfg;
  }));
  return http.build();
}`,
    explain: {
      concept:
        'CORS(Cross-Origin Resource Sharing)는 "다른 동네(도메인)에서 온 요청을 받아줄까?"를 결정하는 규칙이에요. ' +
        '브라우저는 기본적으로 다른 출처(origin)로의 요청을 차단하는데, CORS 설정으로 특정 출처의 요청을 허용할 수 있어요. ' +
        'setAllowedOrigins()로 허용할 도메인 목록을, setAllowedMethods()로 허용할 HTTP 메서드를 지정해요. ' +
        'REST API 서버(api.example.com)와 프론트엔드(www.example.com)의 도메인이 다를 때 이 설정이 없으면 브라우저가 요청을 막아버려요.',
      terms: [
        { t: 'cors(cors -> ...)', d: 'HttpSecurity의 CORS 설정 블록이에요. configurationSource로 허용 규칙을 커스텀하게 정의해요.' },
        { t: 'configurationSource', d: '요청마다 CORS 규칙을 제공하는 함수예요. 동적으로 출처를 허용/거부할 수 있어요.' },
        { t: 'CorsConfiguration', d: '허용할 출처·메서드·헤더·인증 정보 포함 여부 등을 담는 CORS 규칙 상자예요.' },
        { t: 'setAllowedOrigins(List.of(...))', d: '요청을 허용할 출처(origin) 도메인 목록이에요. 프로토콜+호스트+포트까지 정확히 일치해야 해요.' },
        { t: 'setAllowedMethods(List.of(...))', d: '허용할 HTTP 메서드(GET, POST, PUT 등) 목록이에요. OPTIONS는 preflight 요청에 필요해요.' },
      ],
      why:
        '프론트엔드(React, Vue 등)와 백엔드 API 서버가 서로 다른 도메인에서 운영될 때, 브라우저의 Same-Origin Policy 차단을 해제하려고 해요.',
      expectedOutput:
        '[설정] CORS — https://example.com 허용',
      realWorldUsage:
        '실제 프로젝트에서 프론트엔드는 https://app.example.com, API 서버는 https://api.example.com으로 분리 배포할 때 CORS 설정이 필수예요. ' +
        '모바일 앱은 브라우저의 CORS 제한을 받지 않아서 CORS 설정이 영향을 주지 않고, 웹 브라우저에서만 작동해요.',
      pitfall:
        'allowedOrigins에 "*"(와일드카드)를 사용하면 allowCredentials(true)와 함께 쓸 수 없어요. 인증 정보(쿠키, Authorization 헤더)를 포함한 요청은 와일드카드로 허용할 수 없어서, 반드시 명시적 도메인을 지정해야 해요.',
    },
  },
  {
    id: 'sec-csrf-disable',
    lang: 'java',
    title: 'REST API에서 CSRF 비활성화',
    file: 'SecurityConfig.java',
    code: `import org.springframework.context.annotation.Bean;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;

@Bean
public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
  System.out.println("[설정] CSRF 비활성화, 세션 STATELESS");
  http
    .csrf(AbstractHttpConfigurer::disable)
    .sessionManagement(s -> s
        .sessionCreationPolicy(SessionCreationPolicy.STATELESS));
  return http.build();
}`,
    explain: {
      concept:
        'CSRF(Cross-Site Request Forgery)는 공격자가 사용자의 브라우저를 통해 몰래 악의적 요청을 보내는 공격이에요. ' +
        '일반 웹에서는 세션 쿠키를 이용하므로 CSRF 토큰으로 방어하지만, JWT같은 무상태(stateless) 인증을 쓰는 REST API는 세션을 만들지 않아서 CSRF 공격이 통하지 않아요. ' +
        'SessionCreationPolicy.STATELESS는 "절대 세션을 만들지 마라"는 지시로, 매 요청이 독립적으로 인증돼야 함을 뜻해요. ' +
        'REST API + JWT 조합에서는 CSRF 방어를 과감히 끄는 게 표준이에요.',
      terms: [
        { t: 'csrf(AbstractHttpConfigurer::disable)', d: 'CSRF 방어 기능을 완전히 비활성화해요. REST API 등 무상태 환경에서 사용해요.' },
        { t: 'sessionManagement', d: '세션 생성 정책을 설정하는 블록이에요. STATELESS로 설정하면 세션을 전혀 만들지 않아요.' },
        { t: 'SessionCreationPolicy.STATELESS', d: 'HTTP 세션을 생성하지 않고, 매 요청을 독립적으로 처리해요. JWT 인증의 핵심 설정이에요.' },
        { t: 'STATELESS vs STATEFUL', d: 'STATELESS는 서버가 클라이언트 상태를 저장하지 않고, STATEFUL은 세션으로 상태를 유지해요.' },
      ],
      why:
        'JWT 같은 토큰 기반 인증에서는 세션을 안 쓰므로 CSRF 공격 위험이 없어요. 불필요한 CSRF 검증을 꺼서 요청 처리를 단순화하려고 해요.',
      expectedOutput:
        '[설정] CSRF 비활성화, 세션 STATELESS',
      realWorldUsage:
        '실제 프로젝트에서 React + Spring Boot REST API 구조에서는 표준적으로 CSRF를 비활성화하고 STATELESS 세션 정책을 사용해요. ' +
        '모바일 앱 백엔드, 마이크로서비스 간 통신에서도 마찬가지예요.',
      pitfall:
        '일반 웹 애플리케이션(Thymeleaf, JSP 등 서버 사이드 렌더링 + 세션 쿠키)에서는 절대 CSRF를 끄면 안 돼요. ' +
        'CSRF 방어를 끄는 건 순수 REST API + 토큰 인증 환경으로 한정해야 해요.',
    },
  },
  {
    id: 'sec-authority-list',
    lang: 'java',
    title: 'UserDetails 권한 목록',
    file: 'CustomUserDetails.java',
    code: `import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import java.util.Collection;
import java.util.List;

public class CustomUserDetails implements UserDetails {

  private final String username;
  private final String password;

  public CustomUserDetails(String username, String password) {
    this.username = username;
    this.password = password;
    System.out.println("[생성] UserDetails — " + username);
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
      concept:
        'UserDetails는 사용자의 신원 정보와 권한(명찰)을 담는 표준 인터페이스예요. 이 인터페이스의 7개 메서드를 모두 구현해야 컴파일이 돼요. ' +
        'getAuthorities()는 이 사용자가 가진 권한(명찰) 목록을 반환해요. "ROLE_USER"와 "ROLE_ADMIN"을 둘 다 가지면, USER와 ADMIN 권한이 모두 필요한 작업을 할 수 있어요. ' +
        'SimpleGrantedAuthority는 "ROLE_" 접두사로 역할을 구분하는 가장 단순한 구현체예요. ' +
        '나머지 5개 boolean 메서드(isEnabled, isAccountNonLocked 등)는 계정의 활성 상태를 표현해요. 하나라도 false면 로그인이 거부돼요.',
      terms: [
        { t: 'UserDetails', d: '사용자 인증 정보를 표현하는 인터페이스예요. getAuthorities 등 7개 메서드의 구현을 강제하는 계약이에요.' },
        { t: 'GrantedAuthority', d: '사용자의 권한(역할)을 표현하는 객체예요. hasRole, hasAuthority로 이 권한을 검사해요.' },
        { t: 'SimpleGrantedAuthority', d: '문자열(예: "ROLE_USER")로 권한을 표현하는 가장 기본적인 GrantedAuthority 구현체예요.' },
        { t: 'ROLE_ 접두사', d: 'hasRole("USER")는 내부에서 "ROLE_USER"로 변환해 비교해요. hasAuthority는 "ROLE_USER" 그대로 비교해요.' },
        { t: 'isEnabled()', d: '계정 활성화 여부예요. false면 "비활성화된 계정입니다"라는 메시지와 함께 로그인이 거부돼요.' },
      ],
      why:
        '스프링 시큐리티가 인증된 사용자의 권한을 알아야 접근 제어(@PreAuthorize, .hasRole())를 할 수 있어요.',
      expectedOutput:
        '[생성] UserDetails — user1',
      realWorldUsage:
        '실제 프로젝트에서 JPA 엔티티(User)가 UserDetails를 직접 구현해서, DB의 사용자 테이블과 스프링 시큐리티의 인증 체계를 연결해요. ' +
        'isEnabled 필드를 DB 컬럼과 매핑해서 관리자가 계정을 잠그거나 활성화할 수 있게 해요.',
      pitfall:
        'hasRole("ADMIN")은 자동으로 ROLE_ 접두사를 붙여서 ROLE_ADMIN을 찾지만, hasAuthority("ROLE_ADMIN")은 접두사를 붙이지 않아요. ' +
        '둘을 혼용할 때 접두사 차이로 권한 검사가 실패할 수 있으니 주의하세요.',
    },
  },
  {
    id: 'sec-jwt-extract-claims',
    lang: 'java',
    title: 'JWT 클레임 추출',
    file: 'JwtTokenProvider.java',
    code: `import io.jsonwebtoken.Jwts;
import javax.crypto.SecretKey;

public String getUsername(String token) {
  System.out.println("[추출] JWT에서 subject 클레임 추출");
  String username = Jwts.parser()
    .verifyWith(secretKey)
    .build()
    .parseSignedClaims(token)
    .getPayload()
    .getSubject();
  System.out.println("[결과] subject: " + username);
  return username;
}`,
    explain: {
      concept:
        'JWT 안에는 사용자 정보가 담긴 클레임(Claims)이 들어 있어요. 입장 팔찌를 풀어서 그 안의 이름표를 꺼내는 작업이에요. ' +
        'parseSignedClaims()를 호출하면 서명 검증과 동시에 클레임을 파싱한 결과(Jws<Claims>)를 반환해요. ' +
        'getPayload()로 클레임 본문을 얻고, getSubject()로 토큰 생성 시 설정한 subject(사용자명)를 추출해요. ' +
        '그 외에도 getIssuedAt()(발급 시간), getExpiration()(만료 시간), get("customKey")로 커스텀 클레임도 꺼낼 수 있어요. ' +
        '이 메서드는 보통 JwtAuthenticationFilter에서 토큰 검증 후 SecurityContext에 사용자 정보를 등록할 때 호출돼요.',
      terms: [
        { t: 'parseSignedClaims(token)', d: '토큰을 파싱하고 서명을 검증한 뒤, 클레임 정보를 반환해요. 검증 실패 시 JwtException이 발생해요.' },
        { t: 'getPayload()', d: 'JWT의 페이로드(클레임 본문)를 반환해요. subject, issuedAt, expiration과 커스텀 클레임이 담겨 있어요.' },
        { t: 'getSubject()', d: '토큰 생성 시 subject()로 설정한 값(보통 사용자명)을 반환해요. 사용자 식별에 가장 많이 쓰여요.' },
        { t: 'verifyWith(secretKey)', d: '토큰 생성 시 사용된 것과 동일한 비밀 키로 서명을 검증해요. 키가 다르면 JwtException이 발생해요.' },
        { t: '커스텀 클레임', d: 'payload.get("role", String.class)처럼 subject 외에 직접 추가한 클레임도 타입 안전하게 꺼낼 수 있어요.' },
      ],
      why:
        'JWT 토큰에서 사용자 식별 정보(사용자명, 역할, 이메일 등)를 안전하게 꺼내서 인증 객체를 만들려고 해요.',
      expectedOutput:
        '[추출] JWT에서 subject 클레임 추출\n' +
        '[결과] subject: user1',
      realWorldUsage:
        '실제 프로젝트에서 JwtAuthenticationFilter가 이 메서드를 호출해서 username을 얻고, UserDetailsService로 전체 사용자 정보를 조회한 뒤 SecurityContext에 등록해요. ' +
        'JWT 하나로 사용자 식별부터 권한 확인까지 한 번에 처리하는 게 일반적인 패턴이에요.',
      pitfall:
        '서명 검증 없이 getPayload()를 호출하면 위조된 토큰의 내용을 믿게 될 수도 있어요. ' +
        '예를 들어 Jwts.parser().build().parseUnsecuredClaims(token) 같은 미검증 파싱은 절대 쓰면 안 돼요. 반드시 verifyWith를 먼저 호출해야 해요.',
    },
  },
  {
    id: 'sec-logout-handler',
    lang: 'java',
    title: '로그아웃 설정',
    file: 'SecurityConfig.java',
    code: `import org.springframework.context.annotation.Bean;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.web.SecurityFilterChain;

@Bean
public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
  System.out.println("[설정] 로그아웃 — /logout, 성공 시 /login");
  http.logout(logout -> logout
    .logoutUrl("/logout")
    .logoutSuccessUrl("/login")
    .deleteCookies("JSESSIONID")
  );
  return http.build();
}`,
    explain: {
      concept:
        '로그아웃 설정은 사용자가 명시적으로 퇴실할 수 있는 출구를 만드는 거예요. ' +
        '.logoutUrl("/logout")으로 로그아웃 요청을 받을 URL을 지정하고(기본값도 /logout), 로그아웃 성공 후에는 /login 페이지로 리다이렉트해요. ' +
        'deleteCookies("JSESSIONID")로 세션 쿠키를 삭제해서 브라우저에 남은 세션 흔적을 지워요. ' +
        '세션 기반 인증에서는 이걸로 충분하지만, JWT 환경에서는 서버가 토큰을 무효화할 수 없어서 클라이언트가 토큰을 직접 삭제해야 해요.',
      terms: [
        { t: 'logout(...)', d: '로그아웃 동작을 커스텀하게 설정하는 DSL 블록이에요.' },
        { t: 'logoutUrl("/logout")', d: 'POST /logout 요청을 받으면 로그아웃을 처리해요. CSRF 방어가 켜져 있으면 POST만 허용돼요.' },
        { t: 'logoutSuccessUrl("/login")', d: '로그아웃 성공 후 리다이렉트할 URL이에요. 보통 로그인 페이지로 보내요.' },
        { t: 'deleteCookies("JSESSIONID")', d: '지정된 이름의 쿠키를 응답에서 삭제해요. JSESSIONID는 톰캣의 기본 세션 쿠키 이름이에요.' },
      ],
      why:
        '사용자가 안전하게 세션을 종료하고, 방치된 세션으로 인한 보안 사고(공용 PC에서 로그인 유지 등)를 막으려고 해요.',
      expectedOutput:
        '[설정] 로그아웃 — /logout, 성공 시 /login',
      realWorldUsage:
        '실제 프로젝트에서 세션 기반 웹 애플리케이션(관리자 콘솔, 사내 시스템)의 로그아웃에 이 설정을 사용해요. ' +
        'JWT 환경에서는 서버 측 로그아웃으로 토큰을 무효화할 수 없기 때문에, Redis에 블랙리스트를 관리하거나 Access Token의 만료 시간을 짧게 가져가는 전략을 함께 써요.',
      pitfall:
        'JWT 환경에서는 서버가 토큰을 무효화할 수 없으므로, 이 로그아웃 설정만으로는 충분하지 않아요. ' +
        '클라이언트가 토큰을 삭제해도 그 토큰이 만료되기 전까지는 누구든 사용할 수 있어요. Redis에 토큰 블랙리스트를 관리하는 게 일반적인 보완책이에요.',
    },
  },
  {
    id: 'sec-security-context',
    lang: 'java',
    title: 'SecurityContextHolder로 사용자 조회',
    file: 'CurrentUserResolver.java',
    code: `import org.springframework.security.authentication.AnonymousAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;

public String getCurrentUsername() {
  Authentication auth = SecurityContextHolder.getContext()
      .getAuthentication();
  System.out.println("[조회] 현재 인증 정보 확인");
  if (auth == null || !auth.isAuthenticated()
      || auth instanceof AnonymousAuthenticationToken) {
    System.out.println("[실패] 인증되지 않은 사용자");
    throw new IllegalStateException("인증되지 않았어요");
  }
  String username = auth.getName();
  System.out.println("[성공] 현재 사용자: " + username);
  return username;
}`,
    explain: {
      concept:
        'SecurityContextHolder는 현재 요청을 보낸 사용자의 인증 정보를 담아두는 스레드 로컬 보관함이에요. ' +
        'getContext().getAuthentication()으로 현재 인증 정보를 꺼내서 사용자명이나 권한을 확인할 수 있어요. ' +
        '그런데 미인증 요청에도 AnonymousAuthenticationToken이 자동으로 주입되어 있어서, isAuthenticated()가 true를 반환할 수 있어요. ' +
        '그래서 진짜 로그인 여부를 확인하려면 AnonymousAuthenticationToken 인스턴스 여부까지 검사해야 해요. ' +
        '이 보관함은 ThreadLocal 기반이라서, 비동기 환경(@Async, WebFlux)에서는 자동으로 전파되지 않아요.',
      terms: [
        { t: 'SecurityContextHolder', d: '현재 스레드의 인증된 사용자 정보를 ThreadLocal에 저장하는 정적 접근점이에요.' },
        { t: 'getContext().getAuthentication()', d: '현재 요청의 인증 객체를 가져와요. 로그인 안 했으면 AnonymousAuthenticationToken이 들어 있어요.' },
        { t: 'isAuthenticated()', d: '인증된 사용자면 true를 반환해요. 단, 익명 토큰도 true를 반환할 수 있어서 단독으로는 불충분해요.' },
        { t: 'AnonymousAuthenticationToken', d: '로그인하지 않은 사용자를 대표하는 인증 객체예요. instanceof 체크로 진짜 로그인과 구별해요.' },
        { t: 'getName()', d: '인증된 사용자의 이름(보통 username)을 반환해요. UserDetails 구현체에 정의된 값이 나와요.' },
      ],
      why:
        '컨트롤러나 서비스 어디서든 현재 로그인한 사용자 정보를 조회하려고 해요. Principal 주입 없이 정적 메서드로 접근할 수 있어서 편리해요.',
      expectedOutput:
        '[조회] 현재 인증 정보 확인\n' +
        '[성공] 현재 사용자: user1',
      realWorldUsage:
        '실제 프로젝트에서 감사(audit) 테이블에 created_by를 자동으로 채우거나, 사용자별 데이터 필터링(본인 주문만 보기)을 할 때 SecurityContextHolder로 현재 사용자 ID를 가져와요. ' +
        'Spring Data JPA의 AuditorAware 인터페이스도 내부적으로 SecurityContextHolder를 사용해 @CreatedBy를 자동 주입해요.',
      pitfall:
        'ThreadLocal 기반이므로 @Async 메서드나 CompletableFuture 안에서는 SecurityContext가 자동으로 전파되지 않아요. ' +
        '비동기 작업에 전달하려면 SecurityContextHolder.setStrategyName(MODE_INHERITABLETHREADLOCAL)을 설정하거나, 명시적으로 컨텍스트를 복사해야 해요.',
    },
  },
  {
    id: 'sec-exception-handling',
    lang: 'java',
    title: '인증 실패 처리',
    file: 'SecurityConfig.java',
    code: `import org.springframework.context.annotation.Bean;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.web.SecurityFilterChain;

@Bean
public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
  System.out.println("[설정] 401 인증 실패 JSON 응답");
  http.exceptionHandling(ex -> ex
    .authenticationEntryPoint((req, res, e) -> {
      res.setStatus(401);
      res.setContentType("application/json");
      res.getWriter().write("{ \\"message\\": \\"인증이 필요해요\\" }");
      System.out.println("[401] 미인증 접근 차단");
    })
  );
  return http.build();
}`,
    explain: {
      concept:
        'authenticationEntryPoint는 로그인하지 않은 사용자가 보호된 자원에 접근했을 때 보여주는 안내문이에요. ' +
        '기본 동작은 로그인 페이지로 리다이렉트하는 거지만, REST API에서는 리다이렉트 대신 401 상태 코드와 JSON 응답을 반환하는 게 표준이에요. ' +
        '응답의 Content-Type을 application/json으로 설정하고, 상태 코드 401(Unauthorized — 인증 필요)을 설정해서 클라이언트(프론트엔드)가 이해할 수 있게 해줘요. ' +
        '이런 커스텀 처리가 필요한 이유는, REST API 클라이언트(React 모바일 앱 등)는 로그인 페이지로 리다이렉트되는 걸 처리할 수 없기 때문이에요.',
      terms: [
        { t: 'exceptionHandling(ex -> ...)', d: '보안 예외(인증 실패, 권한 부족)에 대한 처리 방법을 설정하는 블록이에요.' },
        { t: 'authenticationEntryPoint', d: '미인증 사용자가 보호된 자원에 접근했을 때 실행되는 진입점이에요. 401 응답을 생성해요.' },
        { t: 'setStatus(401)', d: 'HTTP 응답 상태 코드를 401(Unauthorized)로 설정해요. "인증이 필요합니다"를 의미해요.' },
        { t: 'setContentType("application/json")', d: '응답의 Content-Type 헤더를 application/json으로 설정해요. 클라이언트가 JSON으로 파싱하게 해요.' },
      ],
      why:
        'REST API에서 인증 실패 시 로그인 페이지로 리다이렉트하는 기본 동작 대신, 클라이언트가 처리할 수 있는 JSON 응답을 보내려고 해요.',
      expectedOutput:
        '[설정] 401 인증 실패 JSON 응답\n' +
        '[401] 미인증 접근 차단',
      realWorldUsage:
        '실제 프로젝트에서 모든 REST API의 인증 실패 응답을 {"code": "UNAUTHORIZED", "message": "로그인이 필요합니다"} 같은 일관된 JSON 형식으로 통일해서, ' +
        '프론트엔드 axios 인터셉터가 이 응답을 감지하고 로그인 페이지로 이동시키는 패턴이 표준이에요.',
      pitfall:
        'Content-Type을 application/json으로 설정했으면 응답 본문도 반드시 유효한 JSON이어야 해요. 순수 문자열 "인증 필요"는 JSON이 아니라서 클라이언트의 JSON 파서가 실패해요.',
    },
  },
  {
    id: 'sec-access-denied',
    lang: 'java',
    title: '권한 부족 처리',
    file: 'SecurityConfig.java',
    code: `import org.springframework.context.annotation.Bean;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.web.SecurityFilterChain;

@Bean
public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
  System.out.println("[설정] 403 권한 부족 JSON 응답");
  http.exceptionHandling(ex -> ex
    .accessDeniedHandler((req, res, e) -> {
      res.setStatus(403);
      res.setContentType("application/json");
      res.getWriter().write("{ \\"message\\": \\"권한이 없어요\\" }");
      System.out.println("[403] 권한 부족 접근 차단");
    })
  );
  return http.build();
}`,
    explain: {
      concept:
        'accessDeniedHandler는 로그인은 했지만 권한이 부족할 때 실행되는 처리기예요. ' +
        '인증은 통과했으나(로그인은 함), ADMIN 권한이 필요한 페이지에 USER 권한으로 접근했을 때 403 Forbidden 응답을 보내줘요. ' +
        '401(미인증)과 403(권한 부족)은 완전히 다른 의미예요. 401은 "누군지도 몰라요"이고, 403은 "누군지는 알지만 권한이 없어요"예요. ' +
        '이 둘을 구분해서 처리하는 게 보안 UX(사용자 경험)의 기본이에요. 미인증이면 로그인 페이지로 안내하고, 권한 부족이면 "접근 권한이 없습니다"라고 알려줘요.',
      terms: [
        { t: 'accessDeniedHandler', d: '로그인은 했으나 권한이 부족할 때 실행되는 처리기예요. 403 응답을 생성해요.' },
        { t: 'setStatus(403)', d: 'HTTP 응답 상태 코드를 403(Forbidden)으로 설정해요. "권한이 없습니다"를 의미해요.' },
        { t: '401 vs 403', d: '401 = 인증 안 됨(로그인 필요), 403 = 인증은 됐지만 권한 부족(역할이 맞지 않음). 구분해서 처리해야 해요.' },
        { t: 'setContentType("application/json")', d: '응답 형식을 JSON으로 지정해서 클라이언트가 일관되게 처리할 수 있게 해요.' },
      ],
      why:
        '인증 실패와 권한 부족을 구분해서 사용자에게 적절한 안내를 주려고 해요. 같은 "안 돼요"라도 이유가 다르면 대처 방법도 달라져요.',
      expectedOutput:
        '[설정] 403 권한 부족 JSON 응답\n' +
        '[403] 권한 부족 접근 차단',
      realWorldUsage:
        '실제 프로젝트에서 관리자 페이지에 일반 사용자가 접근했을 때 {"code": "FORBIDDEN", "message": "관리자 권한이 필요합니다"} 같은 응답을 보내고, ' +
        '프론트엔드는 이 응답을 받아 "관리자만 접근할 수 있는 페이지입니다"라는 토스트 메시지를 보여줘요.',
      pitfall:
        '401(인증 안 됨)과 403(권한 부족)을 혼동하지 마세요. ' +
        '인증되지 않은 사용자에게 403을 보내면 "왜 로그인도 안 시키고 권한 없다고 하지?"라는 혼란을 줄 수 있어요. 반드시 상황에 맞는 상태 코드를 사용해야 해요.',
    },
  },
  {
    id: 'sec-hmac-key-jwt',
    lang: 'java',
    title: 'HMAC 키로 JWT 서명',
    file: 'JwtKeyConfig.java',
    code: `import io.jsonwebtoken.security.Keys;
import javax.crypto.SecretKey;
import org.springframework.context.annotation.Bean;

@Bean
SecretKey secretKey() {
  System.out.println("[생성] HMAC-SHA SecretKey 생성");
  SecretKey key = Keys.hmacShaKeyFor(
    "very-secret-key-please-change-me-32bytes!".getBytes()
  );
  System.out.println("[완료] 키 알고리즘: " + key.getAlgorithm());
  return key;
}`,
    explain: {
      concept:
        'JWT에 서명(도장)을 찍으려면 비밀 키가 필요해요. HMAC-SHA 방식은 하나의 비밀 키로 서명하고 검증하는 대칭키 방식이에요. ' +
        'Keys.hmacShaKeyFor()로 바이트 배열을 HMAC 서명용 SecretKey 객체로 만들어요. 생성 시점에 키 알고리즘과 길이 검증이 수행돼요. ' +
        'RSA(비대칭) 방식과 달리, HMAC은 키를 하나만 관리하면 돼서 소규모 서비스나 내부 시스템 간 통신에 적합해요. ' +
        '최소 256비트(32바이트) 이상의 키 길이가 권장되고, 더 짧으면 JJWT 라이브러리가 약한 키 경고를 출력해요.',
      terms: [
        { t: 'SecretKey', d: 'javax.crypto 패키지의 대칭키 인터페이스예요. JWT 서명과 검증에 사용돼요.' },
        { t: 'Keys.hmacShaKeyFor(bytes)', d: '바이트 배열을 HMAC-SHA 알고리즘용 SecretKey로 변환해요. 최소 256비트(32바이트)를 권장해요.' },
        { t: 'HMAC (대칭키) vs RSA (비대칭키)', d: 'HMAC은 키 하나로 서명+검증을 하고(대칭), RSA는 개인키로 서명하고 공개키로 검증해요(비대칭).' },
        { t: '32bytes (256비트)', d: 'HMAC-SHA256에 필요한 최소 키 길이예요. 이보다 짧으면 JJWT가 경고를 출력하고 보안 강도가 약해져요.' },
      ],
      why:
        '토큰 위조를 막기 위해 서명 키가 필요해요. 서명이 있어야 토큰이 변조됐는지 검증할 수 있어요.',
      expectedOutput:
        '[생성] HMAC-SHA SecretKey 생성\n' +
        '[완료] 키 알고리즘: HmacSHA256',
      realWorldUsage:
        '실제 프로젝트에서 마이크로서비스 간 내부 JWT 통신에는 HMAC 대칭키를 사용하고, 외부에 공개되는 토큰(OpenID Connect)은 RSA 비대칭키를 사용해요. ' +
        '키는 절대 코드에 하드코딩하지 않고 환경변수, Kubernetes Secret, AWS Secrets Manager 등에서 주입받아요.',
      pitfall:
        '키가 32바이트보다 짧으면 "The specified key byte array is 16 bits ..." 같은 약한 키 경고가 떠요. ' +
        '실무에서는 더 긴 키를 사용하세요. 또한 이 키가 유출되면 누구나 JWT를 위조할 수 있으므로, 환경변수나 Secret Manager로 안전하게 관리하세요.',
    },
  },
  {
    id: 'sec-security-ignored-paths',
    lang: 'java',
    title: '정적 리소스 보안 제외',
    file: 'SecurityConfig.java',
    code: `import org.springframework.context.annotation.Bean;
import org.springframework.security.config.annotation.web.builders.WebSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityCustomizer;

@Bean
public WebSecurityCustomizer webSecurityCustomizer() {
  System.out.println("[설정] 정적 리소스 보안 필터 제외");
  return web -> web.ignoring().requestMatchers(
    "/static/**", "/css/**", "/js/**"
  );
}`,
    explain: {
      concept:
        'CSS, JS, 이미지 같은 정적 파일은 보안 검문소를 거칠 필요가 전혀 없어요. 오히려 거치면 매 요청마다 불필요한 필터 체인을 통과하느라 성능이 떨어져요. ' +
        'ignoring()으로 지정된 경로는 SecurityFilterChain 자체를 완전히 건너뛰기 때문에, 인증·인가뿐 아니라 모든 보안 헤더·로깅도 적용되지 않아요. ' +
        'permitAll()과의 차이점이 여기에 있어요. permitAll()은 필터 체인을 통과하되 인증만 건너뛰지만, ignoring()은 필터 체인 자체를 통과하지 않아요. ' +
        '그래서 동적 API에는 절대 ignoring()을 쓰면 안 되고, 진짜 정적 리소스에만 사용해야 해요.',
      terms: [
        { t: 'WebSecurityCustomizer', d: '웹 보안의 필터 체인 자체를 커스터마이징하는 함수형 인터페이스예요. ignoring()으로 필터를 완전히 건너뛰게 해요.' },
        { t: 'ignoring()', d: '지정된 경로를 SecurityFilterChain에서 완전히 제외해요. 인증·인가·보안 헤더·로깅이 전혀 적용되지 않아요.' },
        { t: 'requestMatchers(...)', d: '보안 필터에서 제외할 URL 패턴을 지정해요. Ant 스타일 패턴을 사용해요.' },
        { t: 'permitAll() vs ignoring()', d: 'permitAll은 필터를 통과하지만 인증만 건너뛰고, ignoring은 필터 체인 자체를 통째로 건너뛰어요.' },
      ],
      why:
        '정적 리소스가 매 요청마다 불필요한 보안 검사를 받지 않게 해서 성능을 향상시키려고 해요.',
      expectedOutput:
        '[설정] 정적 리소스 보안 필터 제외',
      realWorldUsage:
        '실제 프로젝트에서 /static, /assets, /favicon.ico, /robots.txt 같은 완전히 공개된 정적 파일들을 ignoring()으로 제외해요. ' +
        'React/Vue 빌드 결과물이 /static에 위치할 때 특히 유용해요.',
      pitfall:
        'ignoring()은 보안 헤더(X-Frame-Options, CSP 등)도 적용되지 않아요. 동적 API 엔드포인트에 ignoring()을 쓰면 인증 없이 접근할 수 있는 심각한 보안 구멍이 생겨요. ' +
        '인증이 필요 없는 API 엔드포인트는 반드시 permitAll()을 사용하세요.',
    },
  },
];
