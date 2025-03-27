package vn.nphuy.chatapp.service;

import java.util.List;
import java.util.UUID;

import org.hibernate.Session;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import jakarta.persistence.EntityManager;
import lombok.RequiredArgsConstructor;
import vn.nphuy.chatapp.domain.Channel;
import vn.nphuy.chatapp.domain.Member;
import vn.nphuy.chatapp.domain.Profile;
import vn.nphuy.chatapp.domain.Server;
import vn.nphuy.chatapp.domain.response.Meta;
import vn.nphuy.chatapp.domain.response.ResultPaginationDTO;
import vn.nphuy.chatapp.repository.ChannelRepository;
import vn.nphuy.chatapp.repository.MemberRepository;
import vn.nphuy.chatapp.repository.ServerRepository;
import vn.nphuy.chatapp.util.constant.GlobalUtil;
import vn.nphuy.chatapp.util.constant.MemberRoleEnum;
import vn.nphuy.chatapp.util.specification.ServerSpecifications;

@Service
@RequiredArgsConstructor
public class ServerService {

  private final ServerRepository serverRepository;
  private final MemberRepository memberRepository;
  private final ChannelRepository channelRepository;
  private final EntityManager entityManager;

  public ResultPaginationDTO getAllServers(Specification<Server> spec, Pageable pageable) {
    Session session = entityManager.unwrap(Session.class);
    session.enableFilter("deletedServersFilter");

    Page<Server> servers = serverRepository.findAll(spec, pageable);

    session.disableFilter("deletedServersFilter");

    ResultPaginationDTO result = new ResultPaginationDTO();
    Meta meta = new Meta();

    meta.setPage(servers.getNumber() + 1);
    meta.setPageSize(servers.getSize());

    meta.setTotalPages(servers.getTotalPages());
    meta.setTotalElements(servers.getTotalElements());

    result.setMeta(meta);
    result.setData(servers.getContent());

    return result;
  }

  public ResultPaginationDTO getAllServersByProfileId(Pageable pageable, String profileId) {
    Session session = entityManager.unwrap(Session.class);
    session.enableFilter("deletedServersFilter");

    Specification<Server> spec = ServerSpecifications.hasProfileId(profileId);

    Page<Server> servers = serverRepository.findAll(spec, pageable);

    session.disableFilter("deletedServersFilter");

    ResultPaginationDTO result = new ResultPaginationDTO();
    Meta meta = new Meta();

    meta.setPage(servers.getNumber() + 1);
    meta.setPageSize(servers.getSize());

    meta.setTotalPages(servers.getTotalPages());
    meta.setTotalElements(servers.getTotalElements());

    result.setMeta(meta);
    result.setData(servers.getContent());

    return result;
  }

  public Server getServerById(String id) {
    Session session = entityManager.unwrap(Session.class);
    session.enableFilter("deletedServersFilter");

    Server server = serverRepository.findOneById(id).orElse(null);

    session.disableFilter("deletedServersFilter");

    return server;
  }

  @Transactional
  public Server createServer(Server server, Profile profile) {
    // Generate a random invite code for the server
    server.setInviteCode(UUID.randomUUID().toString());

    // Create and save the server first
    Server newServer = serverRepository.save(server);

    // Add the creator as an admin
    Member newAdmin = new Member();
    newAdmin.setMemberRole(MemberRoleEnum.ADMIN);
    newAdmin.setProfile(profile);
    newAdmin.setServer(newServer);

    // Add the default text channel with name is "general"
    Channel defaultChannel = new Channel();
    defaultChannel.setName("general");
    defaultChannel.setServer(newServer);

    // Save the member and channel
    Member savedMember = memberRepository.save(newAdmin);
    Channel savedChannel = channelRepository.save(defaultChannel);

    newServer.setMembers(List.of(savedMember));
    newServer.setChannels(List.of(savedChannel));

    // return the updated server
    return newServer;
  }

  public Server updateServer(Server server) {
    Server existingServer = this.getServerById(server.getId());
    if (existingServer != null) {

      existingServer.setName(null != server.getName() ? server.getName() : existingServer.getName());
      existingServer.setImageUrl(null != server.getImageUrl() ? server.getImageUrl() : existingServer.getImageUrl());

      return serverRepository.save(existingServer);
    } else {
      return null;
    }
  }

  public Server updateNewInviteCode(String id) {
    Server server = this.getServerById(id);
    if (server != null) {
      server.setInviteCode(UUID.randomUUID().toString());
      return serverRepository.save(server);
    } else {
      return null;
    }
  }

  @Transactional
  public Server addNewMemberViaInvCode(String inviteCode, Profile profile) {
    Server server = serverRepository.findOneByInviteCode(inviteCode).orElse(null);

    if (server == null) {
      return null;
    }

    boolean isMemberExist = server.getMembers().stream()
        .anyMatch(member -> member.getProfile().getId().equals(profile.getId()));

    if (isMemberExist) {
      return server;
    }

    Member newMember = new Member();
    newMember.setProfile(profile);
    newMember.setServer(server);

    Member savedMember = memberRepository.save(newMember);
    List<Member> newMembers = GlobalUtil.appendElements(server.getMembers(), savedMember);
    server.setMembers(newMembers);

    return server;
  }

  public boolean deleteServer(String id) {
    if (serverRepository.existsById(id)) {
      serverRepository.deleteById(id);
      return true;
    } else {
      return false;
    }
  }
}
