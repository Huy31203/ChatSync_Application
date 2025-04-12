package vn.nphuy.chatsync.config;

import javax.crypto.SecretKey;
import javax.crypto.spec.SecretKeySpec;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.oauth2.jwt.JwtDecoder;
import org.springframework.security.oauth2.jwt.JwtEncoder;
import org.springframework.security.oauth2.jwt.NimbusJwtDecoder;
import org.springframework.security.oauth2.jwt.NimbusJwtEncoder;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationConverter;
import org.springframework.security.oauth2.server.resource.authentication.JwtGrantedAuthoritiesConverter;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

import com.nimbusds.jose.jwk.source.ImmutableSecret;
import com.nimbusds.jose.util.Base64;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import vn.nphuy.chatsync.auth.Oauth2LoginSuccessHandler;
import vn.nphuy.chatsync.config.filter.CookieToHeaderFilter;
import vn.nphuy.chatsync.util.SecurityUtil;
import vn.nphuy.chatsync.util.constant.GlobalUtil;

@Configuration
@RequiredArgsConstructor
@EnableMethodSecurity(securedEnabled = true)
@Slf4j
class SecurityConfiguration {

    private final Oauth2LoginSuccessHandler oauth2LoginSuccessHandler;

    @Value("${nphuy.jwt.base64-secret}")
    private String jwtKey;

    @Bean
    PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    private SecretKey getSecretKey() {
        byte[] keyBytes = Base64.from(jwtKey).decode();
        return new SecretKeySpec(
                keyBytes, 0, keyBytes.length, SecurityUtil.JWT_ALGORITHM.getName());
    }

    @Bean
    JwtEncoder jwtEncoder() {
        return new NimbusJwtEncoder(new ImmutableSecret<>(getSecretKey()));
    }

    @Bean
    JwtDecoder jwtDecoder() {
        NimbusJwtDecoder jwtDecoder = NimbusJwtDecoder.withSecretKey(getSecretKey())
                .macAlgorithm(SecurityUtil.JWT_ALGORITHM)
                .build();
        return token -> {
            try {
                return jwtDecoder.decode(token);
            } catch (Exception e) {
                log.error((">>> Access token error: " + e.getMessage()));
                throw e;
            }
        };
    }

    @Bean
    JwtAuthenticationConverter jwtAuthenticationConverter() {
        JwtGrantedAuthoritiesConverter grantedAuthoritiesConverter = new JwtGrantedAuthoritiesConverter();
        grantedAuthoritiesConverter.setAuthorityPrefix("");
        grantedAuthoritiesConverter.setAuthoritiesClaimName("permissions");
        JwtAuthenticationConverter jwtAuthenticationConverter = new JwtAuthenticationConverter();

        jwtAuthenticationConverter.setJwtGrantedAuthoritiesConverter(grantedAuthoritiesConverter);
        return jwtAuthenticationConverter;
    }

    @Bean
    SecurityFilterChain filterChain(
            HttpSecurity http, CustomAuthenticationEntryPoint customAuthenticationEntryPoint,
            CookieToHeaderFilter cookieToHeaderFilter)
            throws Exception {
        http.cors(Customizer.withDefaults())
                .csrf(c -> c.disable())
                .authorizeHttpRequests(
                        authz -> authz.requestMatchers(GlobalUtil.AUTH_WHITELISTS)
                                .permitAll()
                                .requestMatchers(HttpMethod.GET, GlobalUtil.GET_WHITELISTS)
                                .permitAll()
                                .anyRequest()
                                .authenticated())
                .oauth2ResourceServer(
                        oauth2 -> oauth2.jwt(Customizer.withDefaults())
                                .authenticationEntryPoint(customAuthenticationEntryPoint))
                .oauth2Login(customizer -> customizer.successHandler(oauth2LoginSuccessHandler))
                .sessionManagement(
                        session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .addFilterBefore(cookieToHeaderFilter, UsernamePasswordAuthenticationFilter.class)
                .exceptionHandling(exceptionHandlingConfigurer -> exceptionHandlingConfigurer.authenticationEntryPoint(
                        new Oauth2AuthenticationEntrypoint()));

        return http.build();
    }
}
