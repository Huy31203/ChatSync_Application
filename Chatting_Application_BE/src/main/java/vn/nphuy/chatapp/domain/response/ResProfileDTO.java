package vn.nphuy.chatapp.domain.response;

import java.time.Instant;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
public class ResProfileDTO {
    private String id;

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
