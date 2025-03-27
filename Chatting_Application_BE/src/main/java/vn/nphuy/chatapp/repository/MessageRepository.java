package vn.nphuy.chatapp.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

import vn.nphuy.chatapp.domain.Message;

public interface MessageRepository extends JpaRepository<Message, String>, JpaSpecificationExecutor<Message> {

  Optional<Message> findOneById(String id);

  List<Message> findByIdIn(List<String> id);
}
