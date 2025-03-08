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
        // interceptor.addGetOnlyPath("/companies");
        // interceptor.addGetOnlyPath("/jobs");
        // interceptor.addGetOnlyPath("/skills");
        return interceptor;
    }

    @Override
    public void addInterceptors(InterceptorRegistry registry) {
        String[] whiteList = {
                "/v1/auth/login",
                "/v1/auth/register",
                "/v1/auth/forgot-password",
                "/v1/auth/reset-password",
                "/v1/auth/refresh",
                "/v1/storage/**",
                "/v1/v3/api-docs/**",
                "/v1/swagger-ui/**",
                "/v1/swagger-ui.html",
        };
        registry.addInterceptor(getPermissionInterceptor(securityUtil))
                .excludePathPatterns(whiteList);
    }
}
