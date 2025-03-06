package vn.nphuy.chatapp.util;

import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.Optional;

import javax.crypto.SecretKey;
import javax.crypto.spec.SecretKeySpec;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.oauth2.jose.jws.MacAlgorithm;
import org.springframework.security.oauth2.jwt.JwsHeader;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.security.oauth2.jwt.JwtClaimsSet;
import org.springframework.security.oauth2.jwt.JwtEncoder;
import org.springframework.security.oauth2.jwt.JwtEncoderParameters;
import org.springframework.security.oauth2.jwt.NimbusJwtDecoder;
import org.springframework.stereotype.Service;

import com.nimbusds.jose.util.Base64;

import lombok.RequiredArgsConstructor;
import vn.nphuy.chatapp.domain.response.ResLoginDTO;

@Service
@RequiredArgsConstructor
public class SecurityUtil {

  public static final MacAlgorithm JWT_ALGORITHM = MacAlgorithm.HS256;
  public final JwtEncoder jwtEncoder;
  private final Logger logger = LoggerFactory.getLogger(SecurityUtil.class);

  @Value("${nphuy.jwt.base64-secret}")
  private String jwtKey;

  @Value("${nphuy.jwt.access-token-validity-in-seconds}")
  private long jwtAccessExpiration;

  @Value("${nphuy.jwt.refresh-token-validity-in-seconds}")
  private long jwtRefreshExpiration;

  @Value("${nphuy.jwt.reset-token-validity-in-seconds}")
  private long jwtResetExpiration;

  public String createAccessToken(String email, ResLoginDTO dto) {
    Instant now = Instant.now();
    Instant validity = now.plus(jwtAccessExpiration, ChronoUnit.SECONDS);

    // @formatter:off
    JwtClaimsSet claims = JwtClaimsSet.builder()
        .issuedAt(now)
        .expiresAt(validity)
        .subject(email)
        .claim("user", dto.getUser())
        .build();

    JwsHeader jwsHeader = JwsHeader.with(JWT_ALGORITHM).build();
    return jwtEncoder.encode(JwtEncoderParameters.from(jwsHeader, claims)).getTokenValue();
  }

  public String createRefreshToken(String email, ResLoginDTO dto) {
    Instant now = Instant.now();
    Instant validity = now.plus(jwtRefreshExpiration, ChronoUnit.SECONDS);

    // @formatter:off
    JwtClaimsSet claims = JwtClaimsSet.builder()
        .issuedAt(now)
        .expiresAt(validity)
        .subject(email)
        .claim("user", dto.getUser())
        .build();

    JwsHeader jwsHeader = JwsHeader.with(JWT_ALGORITHM).build();
    return jwtEncoder.encode(JwtEncoderParameters.from(jwsHeader, claims)).getTokenValue();
  }

  // public String createResetToken(String email, User user) {
  //   Instant now = Instant.now();
  //   Instant validity = now.plus(jwtResetExpiration, ChronoUnit.SECONDS);

  //   // @formatter:off
  //   JwtClaimsSet claims = JwtClaimsSet.builder()
  //       .issuedAt(now)
  //       .expiresAt(validity)
  //       .subject(email)
  //       .claim("user", user.getName())
  //       .build();

  //   JwsHeader jwsHeader = JwsHeader.with(JWT_ALGORITHM).build();
  //   return jwtEncoder.encode(JwtEncoderParameters.from(jwsHeader, claims)).getTokenValue();
  // }

  // public User getCurrentUser() {
  //   Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
  //   return userService.getUserByUserName(authentication.getName());
  // }

  public static Optional<String> getCurrentUserLogin() {
    SecurityContext securityContext = SecurityContextHolder.getContext();
    return Optional.ofNullable(extractPrincipal(securityContext.getAuthentication()));
  }

  private static String extractPrincipal(Authentication authentication) {
    if (authentication == null) {
      return null;
    } else if (authentication.getPrincipal() instanceof UserDetails springSecurityUser) {
      return springSecurityUser.getUsername();
    } else if (authentication.getPrincipal() instanceof Jwt jwt) {
      return jwt.getSubject();
    } else if (authentication.getPrincipal() instanceof String username) {
      return username;
    }
    return null;
  }

  private SecretKey getSecretKey() {
    byte[] keyBytes = Base64.from(jwtKey).decode();
    return new SecretKeySpec(keyBytes, 0, keyBytes.length, SecurityUtil.JWT_ALGORITHM.getName());
  }

  public Jwt checkValidRefreshToken(String refreshToken) {
    NimbusJwtDecoder jwtDecoder = NimbusJwtDecoder.withSecretKey(
        getSecretKey()).macAlgorithm(SecurityUtil.JWT_ALGORITHM).build();
    try {
      return jwtDecoder.decode(refreshToken);
    } catch (Exception e) {
      logger.error((">>> Refresh token error: " + e.getMessage()));
      throw e;
    }
  }

  public void checkValidResetToken(String resetToken) {
    NimbusJwtDecoder jwtDecoder = NimbusJwtDecoder.withSecretKey(
        getSecretKey()).macAlgorithm(SecurityUtil.JWT_ALGORITHM).build();
    try {
      jwtDecoder.decode(resetToken);
    } catch (Exception e) {
      logger.error((">>> Reset token error: " + e.getMessage()));
      throw e;
    }
  }
}
