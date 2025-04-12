package vn.nphuy.chatsync.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

import vn.nphuy.chatsync.domain.Channel;

public interface ChannelRepository extends JpaRepository<Channel, String>, JpaSpecificationExecutor<Channel> {

  Optional<Channel> findOneById(String id);

  Optional<Channel> findOneByServerIdAndNameAndDeletedFalse(String serverId, String name);

  List<Channel> findByIdIn(List<String> id);

}