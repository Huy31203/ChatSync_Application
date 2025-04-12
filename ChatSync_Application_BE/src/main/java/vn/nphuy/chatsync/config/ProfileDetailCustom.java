package vn.nphuy.chatsync.config;

import java.util.Collections;

import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Component;

import lombok.RequiredArgsConstructor;
import vn.nphuy.chatsync.domain.Profile;
import vn.nphuy.chatsync.service.ProfileService;
import vn.nphuy.chatsync.util.error.BadRequestException;

@Component("userDetailsService")
@RequiredArgsConstructor
public class ProfileDetailCustom implements UserDetailsService {
  private final ProfileService profileService;

  @Override
  public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
    Profile profile = profileService.getProfileByEmail(email);
    if (profile == null) {
      throw new UsernameNotFoundException("Bad credentials");
    }

    if (profile.getPassword() == null && profile.getConnectedAccount() != null) {
      throw new BadRequestException("Your account does not have a password. Please log in using your social account.");
    }

    return new User(profile.getEmail(), profile.getPassword(),
        Collections.singletonList(new SimpleGrantedAuthority("USER_ROLE")));
  }

}
