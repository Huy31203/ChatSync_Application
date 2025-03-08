package vn.nphuy.chatapp.config.filter;

import java.io.IOException;
import java.util.Arrays;
import java.util.Collections;
import java.util.Enumeration;
import java.util.List;
import java.util.Optional;

import org.springframework.core.Ordered;
import org.springframework.core.annotation.Order;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletRequestWrapper;
import jakarta.servlet.http.HttpServletResponse;
import lombok.extern.slf4j.Slf4j;

@Component
@Order(Ordered.HIGHEST_PRECEDENCE)
@Slf4j
public class CookieToHeaderFilter extends OncePerRequestFilter {

  @Override
  protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
      throws ServletException, IOException {

    // log.info("Request URL: {}", request.getRequestURL());
    // log.info("Request URI: {}", request.getRequestURI());
    // log.info("Request Method: {}", request.getMethod());
    // log.info("Authorization Header: {}", request.getHeader("Authorization"));

    // Skip if Authorization header is already present
    if (request.getHeader("Authorization") != null) {
      filterChain.doFilter(request, response);
      return;
    }

    // Extract access token from cookie
    Cookie[] cookies = request.getCookies();

    if (cookies != null) {
      Optional<Cookie> accessTokenCookie = Arrays.stream(cookies)
          .filter(cookie -> "accessToken".equals(cookie.getName()))
          .findFirst();

      // If access token cookie exists, set it as Authorization header
      if (accessTokenCookie.isPresent() && !accessTokenCookie.get().getValue().isEmpty()) {
        String accessToken = accessTokenCookie.get().getValue();

        // Wrap the request with custom implementation that overrides getHeader
        HttpServletRequest wrappedRequest = new HttpServletRequestWrapper(request) {
          @Override
          public String getHeader(String name) {
            if ("Authorization".equalsIgnoreCase(name)) {
              return "Bearer " + accessToken;
            }
            return super.getHeader(name);
          }

          @Override
          public Enumeration<String> getHeaders(String name) {
            if ("Authorization".equalsIgnoreCase(name)) {
              return Collections.enumeration(Collections.singletonList("Bearer " + accessToken));
            }
            return super.getHeaders(name);
          }

          @Override
          public Enumeration<String> getHeaderNames() {
            List<String> names = Collections.list(super.getHeaderNames());
            if (!names.contains("Authorization")) {
              names.add("Authorization");
            }
            return Collections.enumeration(names);
          }
        };

        filterChain.doFilter(wrappedRequest, response);
        return;
      }
    }

    // Continue the filter chain without modification if no access token cookie
    filterChain.doFilter(request, response);
  }
}
