package vn.nphuy.chatapp.domain.response;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.time.Instant;
import java.util.List;
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

    private Instant createdAt;

    private Instant updatedAt;
}
