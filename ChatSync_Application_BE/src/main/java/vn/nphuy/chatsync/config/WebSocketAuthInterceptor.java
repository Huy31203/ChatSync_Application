package vn.nphuy.chatsync.config;

import java.util.List;

import org.springframework.messaging.Message;
import org.springframework.messaging.MessageChannel;
import org.springframework.messaging.simp.stomp.StompCommand;
import org.springframework.messaging.simp.stomp.StompHeaderAccessor;
import org.springframework.messaging.support.ChannelInterceptor;
import org.springframework.messaging.support.MessageHeaderAccessor;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.stereotype.Component;

import lombok.RequiredArgsConstructor;
import vn.nphuy.chatsync.util.SecurityUtil;

@Component
@RequiredArgsConstructor
public class WebSocketAuthInterceptor implements ChannelInterceptor {

  private final SecurityUtil securityUtil;

  @Override
  public Message<?> preSend(Message<?> message, MessageChannel channel) {
    StompHeaderAccessor accessor = MessageHeaderAccessor.getAccessor(message, StompHeaderAccessor.class);

    if (accessor != null && StompCommand.CONNECT.equals(accessor.getCommand())) {
      // Extract authentication token from headers
      List<String> authorization = accessor.getNativeHeader("Authorization");

      if (authorization != null && !authorization.isEmpty()) {
        String token = authorization.get(0);
        if (token.startsWith("Bearer ")) {
          token = token.substring(7);
        }

        // Validate token
        Jwt decodedToken = securityUtil.checkValidToken(token);
        String email = decodedToken.getSubject();
        // Set authentication
        UsernamePasswordAuthenticationToken auth = new UsernamePasswordAuthenticationToken(email, null, null);
        SecurityContextHolder.getContext().setAuthentication(auth);
        accessor.setUser(auth);
      }
    }
    return message;
  }
}