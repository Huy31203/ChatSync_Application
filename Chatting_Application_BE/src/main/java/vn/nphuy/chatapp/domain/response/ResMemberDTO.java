package vn.nphuy.chatapp.domain.response;

import java.time.Instant;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import lombok.Getter;
import lombok.Setter;
import vn.nphuy.chatapp.util.constant.MemberRoleEnum;

@Getter
@Setter
public class ResMemberDTO {
    private String id;

    @Enumerated(EnumType.STRING)
    private MemberRoleEnum memberRole;

    @JsonIgnoreProperties("members")
    private ResServerDTO server;

    @JsonIgnoreProperties("members")
    private ResProfileDTO profile;

    @JsonIgnoreProperties("sender")
    private List<ResConversationDTO> conversationSended;

    @JsonIgnoreProperties("receiver")
    private List<ResConversationDTO> conversationReceived;

    private Instant createdAt;

    private Instant updatedAt;
}
