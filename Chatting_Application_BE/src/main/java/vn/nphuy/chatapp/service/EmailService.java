package vn.nphuy.chatapp.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Service
@RequiredArgsConstructor
@Slf4j
public class EmailService {
  private final JavaMailSender emailSender;

  @Value("${nphuy.frontend.url}")
  private String feUrl;

  @Async
  public void sendPasswordResetEmail(String email, String token) {
    try {
      String resetLink = feUrl + "/reset-password?token=" + token + "&email=" + email;
      SimpleMailMessage message = new SimpleMailMessage();
      message.setTo(email);
      message.setSubject("Password Reset Request");
      message.setText("Click here to reset your password: " + resetLink);
      emailSender.send(message);
    } catch (Exception e) {
      log.error("Error sending password reset email: {}", e.getMessage());
    }
  }
}