package vn.nphuy.chatsync.service;

import org.hibernate.Session;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;

import jakarta.persistence.EntityManager;
import lombok.RequiredArgsConstructor;
import vn.nphuy.chatsync.domain.Member;
import vn.nphuy.chatsync.domain.Profile;
import vn.nphuy.chatsync.domain.Server;
import vn.nphuy.chatsync.domain.response.Meta;
import vn.nphuy.chatsync.domain.response.ResultPaginationDTO;
import vn.nphuy.chatsync.repository.MemberRepository;
import vn.nphuy.chatsync.repository.ProfileRepository;
import vn.nphuy.chatsync.repository.ServerRepository;
import vn.nphuy.chatsync.util.specification.MemberSpecifications;

@Service
@RequiredArgsConstructor
public class MemberService {
  private final MemberRepository memberRepository;
  private final ServerRepository serverRepository;
  private final ProfileRepository profileRepository;
  private final EntityManager entityManager;

  public ResultPaginationDTO getAllMembersByProfileId(Pageable pageable, String profileId) {
    Session session = entityManager.unwrap(Session.class);
    session.enableFilter("deletedMembersFilter");

    Specification<Member> spec = MemberSpecifications.hasProfileId(profileId);

    Page<Member> members = memberRepository.findAll(spec, pageable);

    session.disableFilter("deletedMembersFilter");

    ResultPaginationDTO result = new ResultPaginationDTO();
    Meta meta = new Meta();

    meta.setPage(members.getNumber() + 1);
    meta.setPageSize(members.getSize());

    meta.setTotalPages(members.getTotalPages());
    meta.setTotalElements(members.getTotalElements());

    result.setMeta(meta);
    result.setData(members.getContent());

    return result;
  }

  public Member getMemberById(String memberId) {
    return memberRepository.findById(memberId).orElse(null);
  }

  public Member getMemberByProfileIdAndServerId(String profileId, String serverId) {
    return memberRepository.findOneByProfileIdAndServerIdAndDeletedFalse(profileId, serverId).orElse(null);
  }

  public Member createMember(Member member) {
    if (member.getProfile() != null) {
      Profile profile = profileRepository.findById(member.getProfile().getId()).orElse(null);
      member.setProfile(profile);
    }

    if (member.getServer() != null) {
      Server server = serverRepository.findById(member.getServer().getId()).orElse(null);
      member.setServer(server);
    }

    return memberRepository.save(member);
  }

  public Member updateMember(Member member) {
    Member existingMember = memberRepository.findById(member.getId()).orElse(null);
    if (existingMember == null) {
      return null;
    }

    existingMember.setMemberRole(member.getMemberRole());

    return memberRepository.save(existingMember);
  }

  public boolean deleteMember(String memberId) {
    if (memberRepository.existsById(memberId)) {
      memberRepository.deleteById(memberId);
      return true;
    } else {
      return false;
    }
  }
}
