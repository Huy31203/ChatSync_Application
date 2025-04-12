package vn.nphuy.chatsync.domain.request;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ReqResetPasswordDTO {
  private String email;
  private String token;
  private String newPassword;
}