package vn.nphuy.chatapp.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

import vn.nphuy.chatapp.domain.Member;

public interface MemberRepository extends JpaRepository<Member, String>, JpaSpecificationExecutor<Member> {

  Optional<Member> findOneById(String id);

  List<Member> findByIdIn(List<String> id);
}
