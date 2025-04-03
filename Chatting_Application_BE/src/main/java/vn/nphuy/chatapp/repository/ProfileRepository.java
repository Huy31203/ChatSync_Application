package vn.nphuy.chatapp.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

import vn.nphuy.chatapp.domain.Profile;

public interface ProfileRepository extends JpaRepository<Profile, String>, JpaSpecificationExecutor<Profile> {
    Optional<Profile> findOneById(String id);

    Optional<Profile> findOneByEmailAndDeletedFalse(String email);

    Optional<Profile> findOneByResetTokenAndEmail(String resetToken, String email);

    boolean existsByEmail(String email);

    List<Profile> findByIdIn(List<String> id);
}
