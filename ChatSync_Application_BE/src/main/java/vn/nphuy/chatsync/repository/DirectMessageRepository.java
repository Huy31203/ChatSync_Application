package vn.nphuy.chatsync.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

import vn.nphuy.chatsync.domain.DirectMessage;

public interface DirectMessageRepository
    extends JpaRepository<DirectMessage, String>, JpaSpecificationExecutor<DirectMessage> {

  Optional<DirectMessage> findOneById(String id);

  List<DirectMessage> findByIdIn(List<String> id);
}
