package vn.nphuy.chatapp.domain.request;

import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import vn.nphuy.chatapp.util.constant.ChannelTypeEnum;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ReqChannelDTO {
  private String name;

  @Enumerated(EnumType.STRING)
  private ChannelTypeEnum type;
}
