package vn.nphuy.chatapp.domain.request;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Setter
@Getter
@NoArgsConstructor
@AllArgsConstructor
public class ReqCreateMemberDTO {
    private String serverId;
    private String profileId;
}
