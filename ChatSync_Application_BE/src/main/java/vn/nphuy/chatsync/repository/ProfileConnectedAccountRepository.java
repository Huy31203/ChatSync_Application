package vn.nphuy.chatsync.repository;

import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

import vn.nphuy.chatsync.domain.ProfileConnectedAccount;

public interface ProfileConnectedAccountRepository
        extends JpaRepository<ProfileConnectedAccount, String>,
                JpaSpecificationExecutor<ProfileConnectedAccount> {
    Optional<ProfileConnectedAccount> findOneById(String id);

    Optional<ProfileConnectedAccount> findOneByProviderAndProviderId(
            String provider, String providerId);
}
