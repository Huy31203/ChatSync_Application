package vn.nphuy.chatsync.domain.response;

import java.time.Instant;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class ResMessageDTO {
  private String id;

  private String content;

  private List<String> fileUrls;

  @JsonIgnoreProperties({ "messages", "server" })
  private ResChannelDTO channel;

  @JsonIgnoreProperties({ "messages", "server" })
  private ResMemberDTO sender;

  private Instant createdAt;

  private Instant updatedAt;

  private boolean deleted;
}
