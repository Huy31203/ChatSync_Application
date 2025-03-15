package vn.nphuy.chatapp.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

import vn.nphuy.chatapp.domain.Channel;

public interface ChannelRepository extends JpaRepository<Channel, String>, JpaSpecificationExecutor<Channel> {

  Optional<Channel> findOneById(String id);

  List<Channel> findByIdIn(List<String> id);

}