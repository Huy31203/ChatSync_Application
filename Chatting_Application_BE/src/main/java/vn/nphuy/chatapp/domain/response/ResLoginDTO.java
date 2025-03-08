package vn.nphuy.chatapp.domain.response;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
public class ResLoginDTO {
    private String accessToken;

    private ProfileLogin profile;

    @Getter
    @Setter
    @AllArgsConstructor
    @NoArgsConstructor
    public static class ProfileLogin {
        private String id;
        private String email;
        private String name;
    }
}
