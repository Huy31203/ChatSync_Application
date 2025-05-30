package vn.nphuy.chatsync.domain.response;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ResRegisterDTO {
  private String email;
  private String name;
  private String avatarUrl;
}
