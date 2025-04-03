package vn.nphuy.chatapp.domain.request;

import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ReqForgotPasswordDTO {
  @NotBlank(message = "Email is required")
  private String email;
}
