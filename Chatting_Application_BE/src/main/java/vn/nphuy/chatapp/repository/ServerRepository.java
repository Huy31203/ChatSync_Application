package vn.nphuy.chatapp.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import vn.nphuy.chatapp.domain.Server;

public interface ServerRepository extends JpaRepository<Server, String>, JpaSpecificationExecutor<Server> {

  Optional<Server> findOneById(String id);

  List<Server> findByIdIn(List<String> id);

  @Query("SELECT s FROM Server s JOIN s.members m WHERE m.profile.id = :profileId AND m.deleted = false")
  Page<Server> findServersByProfileId(Pageable pageable, @Param("profileId") String profileId);
}
