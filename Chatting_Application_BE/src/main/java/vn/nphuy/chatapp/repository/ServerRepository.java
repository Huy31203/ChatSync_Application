package vn.nphuy.chatapp.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

import vn.nphuy.chatapp.domain.Server;

public interface ServerRepository extends JpaRepository<Server, String>, JpaSpecificationExecutor<Server> {

  Optional<Server> findOneById(String id);

  List<Server> findByIdIn(List<String> id);

  Optional<Server> findOneByInviteCode(String inviteCode);

}
