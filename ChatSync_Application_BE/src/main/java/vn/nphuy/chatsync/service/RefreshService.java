package vn.nphuy.chatsync.service;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import lombok.RequiredArgsConstructor;
import vn.nphuy.chatsync.domain.Profile;
import vn.nphuy.chatsync.domain.Refresh;
import vn.nphuy.chatsync.repository.RefreshRepository;

@Service
@RequiredArgsConstructor
public class RefreshService {
  private final RefreshRepository refreshRepository;

  public Refresh createRefreshToken(Profile profile, String refreshToken) {
    Refresh refresh = new Refresh();
    refresh.setProfile(profile);
    refresh.setRefreshToken(refreshToken);

    return refreshRepository.save(refresh);
  }

  public Refresh updateRefreshTokenByEmail(String email, String oldRefreshToken, String newRefreshToken) {
    Refresh refresh = refreshRepository.findByRefreshTokenAndProfile_Email(oldRefreshToken, email);

    refresh.setRefreshToken(newRefreshToken);

    return refreshRepository.save(refresh);
  }

  @Transactional
  public Profile getProfileByRefreshTokenAndEmail(String refreshToken, String email) {
    return refreshRepository.findOneByRefreshTokenAndProfile_Email(refreshToken, email)
        .map(Refresh::getProfile)
        .orElse(null);
  }

  @Transactional
  public void deleteByRefreshTokenAndEmail(String refreshToken, String email) {
    refreshRepository.deleteByRefreshTokenAndProfile_Email(refreshToken, email);
  }
}
