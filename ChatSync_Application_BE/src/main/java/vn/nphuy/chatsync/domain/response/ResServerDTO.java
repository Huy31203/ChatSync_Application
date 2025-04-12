package vn.nphuy.chatsync.domain.response;

import java.time.Instant;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ResServerDTO {
    private String id;

    private String name;

    private String imageUrl;

    private String inviteCode;

    @JsonIgnoreProperties("server")
    private List<ResMemberDTO> members;

    @JsonIgnoreProperties({ "server", "messages" })
    private List<ResChannelDTO> channels;

    private Instant createdAt;

    private Instant updatedAt;
}
