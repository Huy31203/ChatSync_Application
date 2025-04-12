package vn.nphuy.chatsync.domain.request;

import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ReqChangePasswordDTO {
  private String oldPassword;

  @NotBlank(message = "New password is required")
  private String newPassword;
}
