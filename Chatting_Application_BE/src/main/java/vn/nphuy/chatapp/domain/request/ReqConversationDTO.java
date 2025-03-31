package vn.nphuy.chatapp.domain.request;

import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ReqConversationDTO {
  @NotBlank(message = "Sender ID is required")
  private String senderId;

  @NotBlank(message = "Receiver ID is required")
  private String receiverId;
}
