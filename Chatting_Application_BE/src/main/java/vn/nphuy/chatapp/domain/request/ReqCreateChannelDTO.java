package vn.nphuy.chatapp.domain.request;

import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import vn.nphuy.chatapp.domain.Server;
import vn.nphuy.chatapp.util.constant.ChannelTypeEnum;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ReqCreateChannelDTO {
  @NotBlank(message = "Name is required")
  private String name;

  @Enumerated(EnumType.STRING)
  private ChannelTypeEnum type;

  private Server server;
}
