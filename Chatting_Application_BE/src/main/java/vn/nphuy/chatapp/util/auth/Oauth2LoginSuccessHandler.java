package vn.nphuy.chatapp.util.auth;

import java.io.IOException;

import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.client.authentication.OAuth2AuthenticationToken;
import org.springframework.security.web.authentication.AuthenticationSuccessHandler;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import vn.nphuy.chatapp.domain.Profile;
import vn.nphuy.chatapp.domain.ProfileConnectedAccount;
import vn.nphuy.chatapp.repository.ProfileConnectedAccountRepository;
import vn.nphuy.chatapp.repository.ProfileRepository;

@Component
@RequiredArgsConstructor
public class Oauth2LoginSuccessHandler implements AuthenticationSuccessHandler {

	private final ProfileConnectedAccountRepository connectedAccountRepository;
	private final ProfileRepository profileRepository;

	@Override
	@Transactional
	public void onAuthenticationSuccess(HttpServletRequest request, HttpServletResponse response,
			Authentication authentication) throws IOException {
		OAuth2AuthenticationToken token = (OAuth2AuthenticationToken) authentication;

		String provider = token.getAuthorizedClientRegistrationId();
		String providerId = authentication.getName();
		String email = token.getPrincipal().getAttribute("email");

		// First check if profile exists based on connected account
		ProfileConnectedAccount connectedAccount = connectedAccountRepository.findOneByProviderAndProviderId(provider,
				providerId).orElse(null);

		if (connectedAccount != null) {
			// User exists, authenticate
			authenticate(connectedAccount.getProfile(), response);
			return;
		}

		// at this point, connected account does not exist, so we find profile by email,
		// or create new profile
		Profile existingProfile = profileRepository.findOneByEmail(email).orElse(null);

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

		ProfileConnectedAccount newConnectedAccount = new ProfileConnectedAccount(provider, providerId, newProfile);
		newProfile.setConnectedAccount(newConnectedAccount);

		profileRepository.save(newProfile);
		connectedAccountRepository.save(newConnectedAccount);

		authenticate(newProfile, response);
	}

	private void authenticate(Profile profile, HttpServletResponse response) throws IOException {
		// final AppAuthenticationToken token = new AppAuthenticationToken(account);
		// SecurityContextHolder.getContext().setAuthentication(token);
		// response.sendRedirect(configService.getFrontendUrl());
	}
}
