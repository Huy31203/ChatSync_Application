package vn.nphuy.chatsync.domain.response;

import java.time.Instant;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import vn.nphuy.chatsync.util.constant.ChannelTypeEnum;

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

  @JsonIgnoreProperties("channel")
  private List<ResMessageDTO> messages;

  private Instant createdAt;

  private Instant updatedAt;
}
