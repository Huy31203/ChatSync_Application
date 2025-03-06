package vn.nphuy.chatapp.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.InterceptorRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

import lombok.RequiredArgsConstructor;
import vn.nphuy.chatapp.util.SecurityUtil;

@Configuration
@RequiredArgsConstructor
public class PermissionInterceptorConfiguration implements WebMvcConfigurer {

  private final SecurityUtil securityUtil;

  @Bean
  PermissionInterceptor getPermissionInterceptor(SecurityUtil securityUtil) {
    PermissionInterceptor interceptor = new PermissionInterceptor(securityUtil);
    // Configure GET-only paths
    interceptor.addGetOnlyPath("/companies");
    interceptor.addGetOnlyPath("/jobs");
    interceptor.addGetOnlyPath("/skills");
    return interceptor;
  }

  @Override
  public void addInterceptors(InterceptorRegistry registry) {
    String[] whiteList = {
        "/",
        "/auth/login",
        "/auth/register",
        "/auth/forgot-password",
        "/auth/reset-password",
        "/auth/refresh",
        "/storage/**",
        "/v3/api-docs/**",
        "/swagger-ui/**",
        "/swagger-ui.html",
        "/companies",
        "/jobs",
        "/skills"
    };
    registry.addInterceptor(getPermissionInterceptor(securityUtil))
        .excludePathPatterns(whiteList);
  }
}