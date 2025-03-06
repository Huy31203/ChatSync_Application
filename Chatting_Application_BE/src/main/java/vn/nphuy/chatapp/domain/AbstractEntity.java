package vn.nphuy.chatapp.domain;

import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.Instant;

@MappedSuperclass
@Getter
@Setter
public abstract class AbstractEntity {
	@Id
	@GeneratedValue(strategy = GenerationType.UUID)
	private String id;

	private Instant createdAt;

	private Instant updatedAt;

	@JsonProperty(access = JsonProperty.Access.WRITE_ONLY)
	private boolean deleted = false;

	@PrePersist
	public void handleBeforeCreate() {
		this.createdAt = Instant.now();
	}

	@PreUpdate
	public void handleBeforeUpdate() {
		this.updatedAt = Instant.now();
	}
}
