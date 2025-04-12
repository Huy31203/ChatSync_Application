package vn.nphuy.chatsync.domain.request;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ReqProfileConnectedAccountDTO {
    private String provider;

    private String providerId;

    private String profileId;
}
