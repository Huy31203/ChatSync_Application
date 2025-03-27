package vn.nphuy.chatapp.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

import vn.nphuy.chatapp.domain.Conversation;

public interface ConversationRepository
    extends JpaRepository<Conversation, String>, JpaSpecificationExecutor<Conversation> {

  Optional<Conversation> findOneById(String id);

  Optional<Conversation> findOneBySenderIdAndReceiverId(String senderId, String receiverId);

  List<Conversation> findByIdIn(List<String> id);
}
