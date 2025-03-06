package vn.nphuy.chatapp.domain;

import jakarta.persistence.Entity;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "profile_connected_accounts")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ProfileConnectedAccount extends AbstractEntity {

	@NotBlank(message = "Provider is required")
	private String provider;

	@NotBlank(message = "Provider ID is required")
	private String providerId;

	@OneToOne
	@JoinColumn(name = "profile_id")
	private Profile profile;

}
