package vn.nphuy.chatapp.domain.response;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ResProfileConnectedAccountDTO {
	private String id;

	private String provider;

	private String providerId;

	@JsonIgnoreProperties("connectedAccount")
	private ResProfileDTO profile;
}
