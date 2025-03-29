package vn.nphuy.chatapp.domain.request;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ReqConversationDTO {
  @NotBlank(message = "Sender ID is required")
  private String senderId;

  @NotBlank(message = "Receiver ID is required")
  private String receiverId;
}
