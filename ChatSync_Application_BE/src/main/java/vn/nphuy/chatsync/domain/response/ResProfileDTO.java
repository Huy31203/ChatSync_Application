package vn.nphuy.chatsync.domain.response;

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

    private boolean havePassword;

    @JsonIgnoreProperties({ "profile", "messages", "conversationSended", "conversationReceived" })
    private List<ResMemberDTO> members;

    @JsonIgnoreProperties("profile")
    private ResProfileConnectedAccountDTO connectedAccount;

    private Instant createdAt;

    private Instant updatedAt;
}
