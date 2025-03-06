package vn.nphuy.chatapp.domain.response;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import lombok.Getter;
import lombok.Setter;

import java.time.Instant;
import java.util.List;

@Getter
@Setter
public class ResProfileDTO {
	private Long id;

	private String email;

	private String name;

	private String avatarUrl;

	@JsonIgnoreProperties("profile")
	private List<ResMemberDTO> members;

	@JsonIgnoreProperties("profile")
	private ResProfileConnectedAccountDTO connectedAccount;

	private Instant createdAt;

	private Instant updatedAt;
}

