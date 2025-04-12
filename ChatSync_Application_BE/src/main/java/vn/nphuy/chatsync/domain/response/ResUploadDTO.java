package vn.nphuy.chatsync.domain.response;

import java.time.Instant;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ResUploadDTO {
  private String fileUrl;
  private Instant uploadedAt;
}
