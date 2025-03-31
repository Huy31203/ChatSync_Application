package vn.nphuy.chatapp.domain.request;

import lombok.Getter;
import lombok.Setter;
import vn.nphuy.chatapp.util.annotation.AtLeastOneNotEmpty;

@Getter
@Setter
@AtLeastOneNotEmpty(fields = { "content",
    "fileUrl" }, message = "Message must have either content or a file attachment")
public class ReqMessageDTO {
  private String content;

  private String fileUrl = "";

  private String senderId;

  private String channelId;
}