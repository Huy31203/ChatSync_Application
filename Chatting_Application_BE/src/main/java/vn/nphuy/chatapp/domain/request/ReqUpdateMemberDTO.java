package vn.nphuy.chatapp.domain.request;

import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;
import vn.nphuy.chatapp.util.constant.MemberRoleEnum;

@Getter
@Setter
public class ReqUpdateMemberDTO {
  @NotBlank(message = "Member role is required")
  @Enumerated(EnumType.STRING)
  private MemberRoleEnum memberRole;
}
