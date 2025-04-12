package vn.nphuy.chatsync.util;

import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.Optional;

import javax.crypto.SecretKey;
import javax.crypto.spec.SecretKeySpec;

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
import lombok.extern.slf4j.Slf4j;
import vn.nphuy.chatsync.domain.Profile;
import vn.nphuy.chatsync.domain.response.ResLoginDTO;
import vn.nphuy.chatsync.service.ProfileService;

@Service
@RequiredArgsConstructor
@Slf4j
public class SecurityUtil {

    public static final MacAlgorithm JWT_ALGORITHM = MacAlgorithm.HS256;
    public final JwtEncoder jwtEncoder;
    private final ProfileService profileService;

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
        JwtClaimsSet claims =
                JwtClaimsSet.builder()
                        .issuedAt(now)
                        .expiresAt(validity)
                        .subject(email)
                        .claim("user", dto.getProfile())
                        .build();

        JwsHeader jwsHeader = JwsHeader.with(JWT_ALGORITHM).build();
        return jwtEncoder.encode(JwtEncoderParameters.from(jwsHeader, claims)).getTokenValue();
    }

    public String createRefreshToken(String email, ResLoginDTO dto) {
        Instant now = Instant.now();
        Instant validity = now.plus(jwtRefreshExpiration, ChronoUnit.SECONDS);

        // @formatter:off
        JwtClaimsSet claims =
                JwtClaimsSet.builder()
                        .issuedAt(now)
                        .expiresAt(validity)
                        .subject(email)
                        .claim("user", dto.getProfile())
                        .build();

        JwsHeader jwsHeader = JwsHeader.with(JWT_ALGORITHM).build();
        return jwtEncoder.encode(JwtEncoderParameters.from(jwsHeader, claims)).getTokenValue();
    }

    public String createResetToken(String email, Profile profile) {
        Instant now = Instant.now();
        Instant validity = now.plus(jwtResetExpiration, ChronoUnit.SECONDS);

      // @formatter:off
        JwtClaimsSet claims = JwtClaimsSet.builder()
            .issuedAt(now)
            .expiresAt(validity)
            .subject(email)
            .claim("profile", profile.getEmail())
            .build();

        JwsHeader jwsHeader = JwsHeader.with(JWT_ALGORITHM).build();
        return jwtEncoder.encode(JwtEncoderParameters.from(jwsHeader, claims)).getTokenValue();
    }

    public Profile getCurrentProfile() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        return profileService.getProfileByEmail(authentication.getName());
    }

    public static Optional<String> getCurrentProfileLogin() {
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
        return new SecretKeySpec(
                keyBytes, 0, keyBytes.length, SecurityUtil.JWT_ALGORITHM.getName());
    }

    public Jwt checkValidToken(String token) {
        NimbusJwtDecoder jwtDecoder =
                NimbusJwtDecoder.withSecretKey(getSecretKey())
                        .macAlgorithm(SecurityUtil.JWT_ALGORITHM)
                        .build();
        try {
            return jwtDecoder.decode(token);
        } catch (Exception e) {
            log.error((">>> token error: " + e.getMessage()));
            throw e;
        }
    }
}
