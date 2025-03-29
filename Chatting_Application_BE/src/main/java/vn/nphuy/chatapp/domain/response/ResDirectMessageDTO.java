package vn.nphuy.chatapp.domain.response;

import java.time.Instant;
import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class ResDirectMessageDTO {
  private String id;

  private String content;

  private List<String> fileUrls;

  private Instant createdAt;

  private Instant updatedAt;
}
