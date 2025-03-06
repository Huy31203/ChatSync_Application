package vn.nphuy.chatapp.domain.request;

import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import lombok.Getter;
import lombok.Setter;
import vn.nphuy.chatapp.util.constant.MemberRoleEnum;

@Getter
@Setter
public class ReqMemberDTO {
	private String serverId;

	private String profileId;

	@Enumerated(EnumType.STRING)
	private MemberRoleEnum memberRole;
}
