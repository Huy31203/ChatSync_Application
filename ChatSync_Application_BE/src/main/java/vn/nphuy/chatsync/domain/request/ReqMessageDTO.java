package vn.nphuy.chatsync.domain.request;

import java.util.ArrayList;
import java.util.List;

import jakarta.validation.constraints.AssertTrue;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ReqMessageDTO {
  private String content;

  private List<String> fileUrls = new ArrayList<>();

  @NotBlank(message = "Sender ID cannot be blank")
  private String senderId;

  @NotBlank(message = "Channel ID cannot be blank")
  private String channelId;

  @AssertTrue(message = "Message must have either content or a file attachment")
  public boolean isValid() {
    boolean hasContent = content != null && !content.trim().isEmpty();
    boolean hasFiles = fileUrls != null && !fileUrls.isEmpty();
    return hasContent || hasFiles;
  }
}