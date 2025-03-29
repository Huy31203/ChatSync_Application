package vn.nphuy.chatapp.domain.response;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class ResLoginDTO {
    private ProfileLogin profile;

    private String accessToken;

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
