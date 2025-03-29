package vn.nphuy.chatapp.domain.request;

import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import vn.nphuy.chatapp.util.annotation.AtLeastOneNotEmpty;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@AtLeastOneNotEmpty(fields = { "content",
    "fileUrl" }, message = "Message must have either content or a file attachment")
public class ReqDirectMessage {
  private String content;

  private List<String> fileUrls = List.of();

}
