package vn.nphuy.chatapp.domain.request;

import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;
import vn.nphuy.chatapp.util.constant.ChannelTypeEnum;

@Getter
@Setter
public class ReqChannelDTO {
  @NotBlank(message = "Channel name is required")
  private String name;

  @Enumerated(EnumType.STRING)
  private ChannelTypeEnum type;
}
