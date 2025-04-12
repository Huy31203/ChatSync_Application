package vn.nphuy.chatsync.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

import vn.nphuy.chatsync.domain.Member;

public interface MemberRepository extends JpaRepository<Member, String>, JpaSpecificationExecutor<Member> {

  Optional<Member> findOneById(String id);

  List<Member> findByIdIn(List<String> id);

  Optional<Member> findOneByProfileIdAndServerIdAndDeletedFalse(String profileId, String serverId);
}
