package vn.nphuy.chatapp.domain.request;

import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ReqUpdateDirectMessage {
  @NotBlank(message = "content is required")
  private String content;
}
