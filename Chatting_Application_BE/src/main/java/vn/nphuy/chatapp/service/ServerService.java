package vn.nphuy.chatapp.service;

import java.util.ArrayList;

import org.hibernate.Session;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;

import jakarta.persistence.EntityManager;
import lombok.RequiredArgsConstructor;
import vn.nphuy.chatapp.domain.Member;
import vn.nphuy.chatapp.domain.Profile;
import vn.nphuy.chatapp.domain.Server;
import vn.nphuy.chatapp.domain.response.Meta;
import vn.nphuy.chatapp.domain.response.ResultPaginationDTO;
import vn.nphuy.chatapp.repository.MemberRepository;
import vn.nphuy.chatapp.repository.ServerRepository;
import vn.nphuy.chatapp.util.constant.MemberRoleEnum;

@Service
@RequiredArgsConstructor
public class ServerService {

  private final ServerRepository serverRepository;
  private final MemberRepository memberRepository;
  private final EntityManager entityManager;

  public ResultPaginationDTO getAllServer(Specification spec, Pageable pageable) {
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

    Page<Server> servers = serverRepository.findServersByProfileId(pageable, profileId);

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

  public Server createServer(Server server, Profile profile) {
    // Create and save the server first
    Server newServer = serverRepository.save(server);

    // Add the creator as an admin
    Member newAdmin = new Member();
    newAdmin.setMemberRole(MemberRoleEnum.ADMIN);
    newAdmin.setProfile(profile);
    newAdmin.setServer(newServer);

    // Save the member
    Member savedMember = memberRepository.save(newAdmin);

    // Create a new modifiable list with existing members (if any)
    ArrayList<Member> members = new ArrayList<>();
    members.add(savedMember);
    newServer.setMembers(members);

    // Save and return the updated server with its admin
    return serverRepository.save(newServer);
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

  public boolean deleteServer(String id) {
    if (serverRepository.existsById(id)) {
      serverRepository.deleteById(id);
      return true;
    } else {
      return false;
    }
  }
}
