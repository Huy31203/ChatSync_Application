package vn.nphuy.chatapp.domain.request;

import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ReqServerDTO {
    @NotBlank(message = "Server name is required")
    private String name;

    private String imageUrl;
}
