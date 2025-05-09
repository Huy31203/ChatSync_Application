package vn.nphuy.chatsync.auth;

import java.io.IOException;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Lazy;
import org.springframework.http.ResponseCookie;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.client.authentication.OAuth2AuthenticationToken;
import org.springframework.security.web.authentication.AuthenticationSuccessHandler;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import vn.nphuy.chatsync.domain.Profile;
import vn.nphuy.chatsync.domain.ProfileConnectedAccount;
import vn.nphuy.chatsync.domain.Refresh;
import vn.nphuy.chatsync.domain.response.ResLoginDTO;
import vn.nphuy.chatsync.domain.response.ResLoginDTO.ProfileLogin;
import vn.nphuy.chatsync.repository.ProfileConnectedAccountRepository;
import vn.nphuy.chatsync.repository.ProfileRepository;
import vn.nphuy.chatsync.repository.RefreshRepository;
import vn.nphuy.chatsync.util.SecurityUtil;

@Component
public class Oauth2LoginSuccessHandler implements AuthenticationSuccessHandler {

    @Value("${nphuy.jwt.access-token-validity-in-seconds}")
    private long accessTokenValidity;

    @Value("${nphuy.jwt.refresh-token-validity-in-seconds}")
    private long refreshTokenValidity;

    @Value("${nphuy.frontend.url}")
    private String frontendUrl;

    @Value("${spring.profiles.active}")
    private String activeProfile;

    private final ProfileConnectedAccountRepository connectedAccountRepository;
    private final ProfileRepository profileRepository;
    private final RefreshRepository refreshRepository;
    private final SecurityUtil securityUtil;

    public Oauth2LoginSuccessHandler(
            ProfileConnectedAccountRepository connectedAccountRepository,
            ProfileRepository profileRepository,
            RefreshRepository refreshRepository,
            @Lazy SecurityUtil securityUtil) {
        this.connectedAccountRepository = connectedAccountRepository;
        this.profileRepository = profileRepository;
        this.refreshRepository = refreshRepository;
        this.securityUtil = securityUtil;
    }

    @Override
    @Transactional
    public void onAuthenticationSuccess(
            HttpServletRequest request, HttpServletResponse response, Authentication authentication)
            throws IOException {
        OAuth2AuthenticationToken token = (OAuth2AuthenticationToken) authentication;

        String provider = token.getAuthorizedClientRegistrationId();
        String providerId = authentication.getName();
        String email = token.getPrincipal().getAttribute("email");

        // First check if profile exists based on connected account
        ProfileConnectedAccount connectedAccount = connectedAccountRepository
                .findOneByProviderAndProviderId(provider, providerId)
                .orElse(null);

        if (connectedAccount != null) {
            // User exists, authenticate
            authenticate(connectedAccount.getProfile(), response);
            return;
        }

        // at this point, connected account does not exist, so we find profile by email,
        // or create new profile
        Profile existingProfile = profileRepository.findOneByEmailAndDeletedFalse(email).orElse(null);

        if (existingProfile != null) {
            ProfileConnectedAccount newConnectedAccount = new ProfileConnectedAccount(provider, providerId,
                    existingProfile);

            existingProfile.setConnectedAccount(newConnectedAccount);

            profileRepository.save(existingProfile);
            connectedAccountRepository.save(newConnectedAccount);

            authenticate(existingProfile, response);
            return;
        }

        Profile newProfile = new Profile();
        newProfile.setEmail(email);
        newProfile.setName(token.getPrincipal().getAttribute("name"));
        newProfile.setAvatarUrl(token.getPrincipal().getAttribute("picture"));
        newProfile.setHavePassword(false);

        ProfileConnectedAccount newConnectedAccount = new ProfileConnectedAccount(provider, providerId, newProfile);
        newProfile.setConnectedAccount(newConnectedAccount);

        profileRepository.save(newProfile);
        connectedAccountRepository.save(newConnectedAccount);

        authenticate(newProfile, response);
    }

    private void authenticate(Profile profile, HttpServletResponse response) throws IOException {
        String id = profile.getId();
        String email = profile.getEmail();
        String name = profile.getName();
        ResLoginDTO resLogin = new ResLoginDTO();

        ProfileLogin profileLogin = new ProfileLogin(id, email, name);
        resLogin.setProfile(profileLogin);

        // Create access token
        String accessToken = securityUtil.createAccessToken(email, resLogin);

        // Create refresh token
        String refreshToken = securityUtil.createRefreshToken(email, resLogin);

        Refresh refresh = new Refresh();
        refresh.setProfile(profile);
        refresh.setRefreshToken(refreshToken);
        refreshRepository.save(refresh);

        // Set cookies
        ResponseCookie resAccessCookie = ResponseCookie.from("accessToken", accessToken)
                .httpOnly(true)
                .sameSite("None")
                .path("/")
                .secure(activeProfile.equals("prod"))
                .maxAge(accessTokenValidity)
                .build();

        ResponseCookie resRefreshCookie = ResponseCookie.from("refreshToken", refreshToken)
                .httpOnly(true)
                .sameSite("None")
                .path("/")
                .secure(activeProfile.equals("prod"))
                .maxAge(refreshTokenValidity)
                .build();

        // Send response
        response.addHeader("Set-Cookie", resAccessCookie.toString());
        response.addHeader("Set-Cookie", resRefreshCookie.toString());
        response.sendRedirect(frontendUrl);
    }
}
