package vn.nphuy.chatapp.domain.response;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import java.time.Instant;
import lombok.Getter;
import lombok.Setter;
import vn.nphuy.chatapp.util.constant.MemberRoleEnum;

@Getter
@Setter
public class ResMemberDTO {
    private Long id;

    @Enumerated(EnumType.STRING)
    private MemberRoleEnum memberRole;

    @JsonIgnoreProperties("members")
    private ResServerDTO server;

    @JsonIgnoreProperties("members")
    private ResProfileDTO profile;

    private Instant createdAt;

    private Instant updatedAt;
}
