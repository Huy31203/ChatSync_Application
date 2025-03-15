package vn.nphuy.chatapp.domain.response;

import java.time.Instant;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import vn.nphuy.chatapp.util.constant.ChannelTypeEnum;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ResChannelDTO {
  private String id;

  private String name;

  private ChannelTypeEnum type;

  @JsonIgnoreProperties("channels")
  private ResServerDTO server;

  private Instant createdAt;

  private Instant updatedAt;
}
