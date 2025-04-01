package vn.nphuy.chatapp.domain.request;

import java.util.List;
import java.util.Objects;

import jakarta.validation.constraints.AssertTrue;
import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ReqMessageDTO {
  private String content;

  private List<String> fileUrls = List.of();

  @NotBlank(message = "Sender ID cannot be blank")
  private String senderId;

  @NotBlank(message = "Channel ID cannot be blank")
  private String channelId;

  @AssertTrue(message = "Message must have either content or a file attachment")
  public boolean isValid() {
    return !(Objects.nonNull(content) && content.isEmpty()) || Objects.nonNull(fileUrls) && !fileUrls.isEmpty();
  }
}