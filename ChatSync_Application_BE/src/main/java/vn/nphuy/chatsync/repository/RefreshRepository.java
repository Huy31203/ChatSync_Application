package vn.nphuy.chatsync.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import vn.nphuy.chatsync.domain.Refresh;

public interface RefreshRepository extends JpaRepository<Refresh, String> {
  Optional<Refresh> findOneByRefreshTokenAndProfile_Email(String refreshToken, String email);

  Refresh findByRefreshTokenAndProfile_Email(String refreshToken, String email);

  void deleteByRefreshTokenAndProfile_Email(String refreshToken, String email);
}
