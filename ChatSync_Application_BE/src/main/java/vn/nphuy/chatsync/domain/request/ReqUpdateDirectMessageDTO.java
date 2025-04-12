package vn.nphuy.chatsync.domain.request;

import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ReqUpdateDirectMessageDTO {
  @NotBlank(message = "content is required")
  private String content;
}
