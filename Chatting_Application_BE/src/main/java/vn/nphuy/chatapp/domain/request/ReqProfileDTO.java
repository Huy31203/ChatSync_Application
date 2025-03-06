package vn.nphuy.chatapp.domain.request;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ReqProfileDTO {
	private String name;

	private String avatarUrl;

	private String connectedAccountId;
}
