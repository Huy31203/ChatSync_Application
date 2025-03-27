package vn.nphuy.chatapp.controller;

import java.util.HashMap;
import java.util.List;

import org.modelmapper.ModelMapper;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import vn.nphuy.chatapp.domain.Channel;
import vn.nphuy.chatapp.domain.Conversation;
import vn.nphuy.chatapp.domain.Member;
import vn.nphuy.chatapp.domain.Profile;
import vn.nphuy.chatapp.domain.Server;
import vn.nphuy.chatapp.domain.request.ReqChannelDTO;
import vn.nphuy.chatapp.domain.request.ReqConversationDTO;
import vn.nphuy.chatapp.domain.request.ReqServerDTO;
import vn.nphuy.chatapp.domain.request.ReqUpdateMemberDTO;
import vn.nphuy.chatapp.domain.response.ResChannelDTO;
import vn.nphuy.chatapp.domain.response.ResConversationDTO;
import vn.nphuy.chatapp.domain.response.ResServerDTO;
import vn.nphuy.chatapp.domain.response.ResultPaginationDTO;
import vn.nphuy.chatapp.service.ChannelService;
import vn.nphuy.chatapp.service.ConversationService;
import vn.nphuy.chatapp.service.MemberService;
import vn.nphuy.chatapp.service.ServerService;
import vn.nphuy.chatapp.util.SecurityUtil;
import vn.nphuy.chatapp.util.annotation.ApiMessage;
import vn.nphuy.chatapp.util.constant.MemberRoleEnum;
import vn.nphuy.chatapp.util.error.BadRequestException;
import vn.nphuy.chatapp.util.error.NotAllowedException;
import vn.nphuy.chatapp.util.error.ResourceNotFoundException;
import vn.nphuy.chatapp.util.error.ServerErrorException;

@RestController
@RequiredArgsConstructor
@RequestMapping("/v1")
@Slf4j
public class ServerController {
  private final ServerService serverService;
  private final ChannelService channelService;
  private final MemberService memberService;
  private final ConversationService conversationService;
  private final ModelMapper modelMapper;
  private final SecurityUtil securityUtil;
  // private final RateLimitService rateLimitService;

  // @GetMapping("/servers")
  // @ApiMessage(message = "Fetch all servers")
  // public ResponseEntity<Object> getAllServers(@Filter Specification<Server>
  // spec,
  // Pageable pageable) {

  // ResultPaginationDTO results = serverService.getAllServers(spec, pageable);

  // // Map Server entities to ResServerDTO objects
  // if (results.getData() != null) {
  // @SuppressWarnings("unchecked")
  // List<Server> servers = (List<Server>) results.getData();

  // List<ResServerDTO> serverDTOs = servers.stream()
  // .map(server -> modelMapper.map(server, ResServerDTO.class))
  // .toList();

  // results.setData(serverDTOs);
  // }

  // return ResponseEntity.ok(results);
  // }

  @GetMapping("/servers/current-profile")
  @ApiMessage(message = "Fetch all servers by current profile")
  public ResponseEntity<Object> getAllServersByProfile(Pageable pageable) {

    String profileId = securityUtil.getCurrentProfile().getId();

    ResultPaginationDTO results = serverService.getAllServersByProfileId(pageable, profileId);

    // Map Server entities to ResServerDTO objects
    if (results.getData() != null) {
      @SuppressWarnings("unchecked")
      List<Server> servers = (List<Server>) results.getData();

      List<ResServerDTO> serverDTOs = servers.stream()
          .map(server -> modelMapper.map(server, ResServerDTO.class))
          .toList();

      results.setData(serverDTOs);
    }

    return ResponseEntity.ok(results);
  }

  @GetMapping("/servers/{id}")
  @ApiMessage(message = "Fetch server by id")
  public ResponseEntity<Object> getServerById(@PathVariable("id") String id) {

    Server result = serverService.getServerById(id);

    if (result == null) {
      throw new ResourceNotFoundException("Server not found with id: " + id);
    }

    String profileId = securityUtil.getCurrentProfile().getId();
    Member member = memberService.getMemberByProfileIdAndServerId(profileId, id);

    if (member == null) {
      throw new NotAllowedException("You are not a member of that server");
    }

    ResServerDTO resServer = modelMapper.map(result, ResServerDTO.class);

    return ResponseEntity.ok(resServer);
  }

  @GetMapping("/servers/{serverId}/conversations/{receiverId}")
  @ApiMessage(message = "Get all conversations by memberId")
  public ResponseEntity<Object> getConversationByMemberId(@PathVariable("serverId") String serverId,
      @PathVariable("receiverId") String receiverId, Pageable pageable) {

    String profileId = securityUtil.getCurrentProfile().getId();
    Member member = memberService.getMemberByProfileIdAndServerId(profileId, serverId);

    if (member == null) {
      throw new NotAllowedException("You are not a member of that server");
    }

    Conversation result = conversationService.getConversationBySenderIdAndReceiverId(member.getId(), receiverId);

    if (result == null) {
      return ResponseEntity.ok().body(new HashMap<>());
    }

    ResConversationDTO resConversation = modelMapper.map(result, ResConversationDTO.class);

    return ResponseEntity.ok().body(resConversation);
  }

  @PostMapping("/servers")
  @ApiMessage(message = "Create new server")
  public ResponseEntity<Object> createNewServer(@Valid @RequestBody ReqServerDTO reqServer) {

    Server server = modelMapper.map(reqServer, Server.class);
    Profile profile = securityUtil.getCurrentProfile();

    Server result = serverService.createServer(server, profile);

    if (result == null) {
      throw new ServerErrorException("Failed to create server");
    }

    ResServerDTO resServer = modelMapper.map(result, ResServerDTO.class);

    return ResponseEntity.status(201).body(resServer);
  }

  @PostMapping("/servers/{id}/channels")
  @ApiMessage(message = "Create new channel in server")
  @Transactional
  public ResponseEntity<Object> createNewChannel(@PathVariable("id") String id,
      @Valid @RequestBody ReqChannelDTO reqChannel) {
    Server server = serverService.getServerById(id);

    String profileId = securityUtil.getCurrentProfile().getId();
    Member member = memberService.getMemberByProfileIdAndServerId(profileId, id);

    if (member == null || member.getMemberRole().equals(MemberRoleEnum.GUEST)) {
      throw new NotAllowedException("You are not allowed to create channel in this server");
    }

    if (channelService.getChannelByName(id, reqChannel.getName()) != null) {
      throw new BadRequestException("Channel name already exists");
    }

    Channel channel = modelMapper.map(reqChannel, Channel.class);
    channel.setServer(server);

    Channel result = channelService.createChannel(channel);

    if (result == null) {
      throw new ServerErrorException("Failed to create channel");
    }

    ResChannelDTO resChannel = modelMapper.map(result, ResChannelDTO.class);

    return ResponseEntity.status(201).body(resChannel);
  }

  @PostMapping("/servers/{id}/conversations")
  @ApiMessage(message = "Create new conversation in server")
  @Transactional
  public ResponseEntity<Object> createNewConversation(@PathVariable("id") String id,
      @Valid @RequestBody ReqConversationDTO reqConversation) {
    String profileId = securityUtil.getCurrentProfile().getId();

    Member sender = memberService.getMemberByProfileIdAndServerId(profileId, id);
    Member receiver = memberService.getMemberById(reqConversation.getReceiverId());

    Conversation conversation = new Conversation();
    conversation.setSender(sender);
    conversation.setReceiver(receiver);

    Conversation result = conversationService.createConversation(conversation);

    if (result == null) {
      throw new ServerErrorException("Failed to create conversation");
    }

    ResConversationDTO resConversation = modelMapper.map(result, ResConversationDTO.class);

    return ResponseEntity.ok(resConversation);
  }

  @PatchMapping("/servers/{id}")
  @ApiMessage(message = "Update server by id")
  public ResponseEntity<Object> updateServer(@PathVariable("id") String id, @RequestBody ReqServerDTO reqServer) {

    String profileId = securityUtil.getCurrentProfile().getId();
    Member member = memberService.getMemberByProfileIdAndServerId(profileId, id);

    if (member == null || !member.getMemberRole().equals(MemberRoleEnum.ADMIN)) {
      throw new NotAllowedException("You are not the owner of this server");
    }

    Server server = modelMapper.map(reqServer, Server.class);

    server.setId(id);
    Server result = serverService.updateServer(server);

    if (result == null) {
      throw new ResourceNotFoundException("Server not found with id: " + id);
    }

    ResServerDTO resServer = modelMapper.map(result, ResServerDTO.class);

    return ResponseEntity.ok(resServer);
  }

  @PatchMapping("/servers/{id}/invite-code")
  @ApiMessage(message = "Update server invite code by id")
  public ResponseEntity<Object> updateInviteCode(@PathVariable("id") String id) {

    String profileId = securityUtil.getCurrentProfile().getId();
    Member member = memberService.getMemberByProfileIdAndServerId(profileId, id);

    if (member == null || !member.getMemberRole().equals(MemberRoleEnum.ADMIN)) {
      throw new NotAllowedException("You are not the owner of this server");
    }

    Server server = serverService.updateNewInviteCode(id);
    ResServerDTO resServer = modelMapper.map(server, ResServerDTO.class);

    if (resServer == null) {
      throw new ResourceNotFoundException("Server not found with id: " + id);
    }

    return ResponseEntity.ok(resServer);
  }

  @PatchMapping("/servers/{serverId}/channels/{channelId}")
  @ApiMessage(message = "Update channel by id")
  public ResponseEntity<Object> updateChannel(@PathVariable("serverId") String serverId,
      @PathVariable("channelId") String channelId, @RequestBody ReqChannelDTO reqChannel) {

    String profileId = securityUtil.getCurrentProfile().getId();
    Member member = memberService.getMemberByProfileIdAndServerId(profileId, serverId);

    if (member == null || member.getMemberRole().equals(MemberRoleEnum.GUEST)) {
      throw new NotAllowedException("You are not allowed to update channel in this server");
    }

    Channel currentChannel = channelService.getChannelById(channelId);

    if (!currentChannel.getName().equals(reqChannel.getName())
        && channelService.getChannelByName(serverId, reqChannel.getName()) != null) {
      throw new BadRequestException("Channel name already exists");
    }

    currentChannel.setName(reqChannel.getName());
    currentChannel.setType(reqChannel.getType());

    Channel result = channelService.updateChannel(currentChannel);

    if (result == null) {
      throw new ResourceNotFoundException("Channel not found with id: " + channelId);
    }

    ResChannelDTO resChannel = modelMapper.map(result, ResChannelDTO.class);

    return ResponseEntity.ok(resChannel);
  }

  @PatchMapping("/servers/{serverId}/members/{memberId}")
  @ApiMessage(message = "Update member by id")
  public ResponseEntity<Object> updateMember(@PathVariable("serverId") String serverId,
      @PathVariable("memberId") String memberId, @RequestBody ReqUpdateMemberDTO reqMember) {

    String profileId = securityUtil.getCurrentProfile().getId();
    Member currentMember = memberService.getMemberByProfileIdAndServerId(profileId, serverId);

    if (currentMember == null || !currentMember.getMemberRole().equals(MemberRoleEnum.ADMIN)) {
      throw new NotAllowedException("You are not allowed to update member in this server");
    }

    Member targetMember = modelMapper.map(reqMember, Member.class);
    targetMember.setId(memberId);

    memberService.updateMember(targetMember);

    Server server = serverService.getServerById(serverId);
    ResServerDTO resServer = modelMapper.map(server, ResServerDTO.class);

    return ResponseEntity.ok().body(resServer);
  }

  @PatchMapping("servers/join/{inviteCode}")
  @ApiMessage(message = "Join server by invite code")
  public ResponseEntity<Object> joinServerByInviteCode(@PathVariable("inviteCode") String inviteCode) {

    Profile profile = securityUtil.getCurrentProfile();
    Server server = serverService.addNewMemberViaInvCode(inviteCode, profile);

    if (server == null) {
      throw new ResourceNotFoundException("Server not found with invite code: " + inviteCode);
    }

    ResServerDTO resServer = modelMapper.map(server, ResServerDTO.class);

    return ResponseEntity.ok(resServer);
  }

  @DeleteMapping("servers/{id}/leave")
  @ApiMessage(message = "Leave server by id")
  public ResponseEntity<Object> leaveServer(@PathVariable("id") String id) {

    String profileId = securityUtil.getCurrentProfile().getId();
    Member member = memberService.getMemberByProfileIdAndServerId(profileId, id);

    if (member == null) {
      throw new NotAllowedException("You are not a member of this server");
    }

    if (member.getMemberRole().equals(MemberRoleEnum.ADMIN)) {
      throw new NotAllowedException("Admin are not allowed to leave server");
    }

    boolean result = memberService.deleteMember(member.getId());

    if (!result) {
      throw new ResourceNotFoundException("Member not found with id: " + member.getId());
    }

    return ResponseEntity.ok().body(null);
  }

  @DeleteMapping("/servers/{id}")
  @ApiMessage(message = "Delete server by id")
  public ResponseEntity<Void> deleteServer(@PathVariable("id") String id) {

    boolean result = serverService.deleteServer(id);
    if (!result) {
      throw new ResourceNotFoundException("Server not found with id: " + id);
    }

    return ResponseEntity.ok().body(null);
  }

  @DeleteMapping("/servers/{serverId}/channels/{channelId}")
  @ApiMessage(message = "Delete channel by id")
  public ResponseEntity<Void> deleteChannel(@PathVariable("serverId") String serverId,
      @PathVariable("channelId") String channelId) {

    String profileId = securityUtil.getCurrentProfile().getId();
    Member member = memberService.getMemberByProfileIdAndServerId(profileId, serverId);

    if (member == null || !member.getMemberRole().equals(MemberRoleEnum.ADMIN)) {
      throw new NotAllowedException("You are not allowed to delete channel in this server");
    }

    boolean result = channelService.deleteChannel(channelId);
    if (!result) {
      throw new ResourceNotFoundException("Channel not found with id: " + channelId);
    }

    return ResponseEntity.ok().body(null);
  }

  @DeleteMapping("/servers/{serverId}/members/{memberId}")
  @ApiMessage(message = "Delete member by id")
  public ResponseEntity<Object> deleteMember(@PathVariable("serverId") String serverId,
      @PathVariable("memberId") String memberId) {

    String profileId = securityUtil.getCurrentProfile().getId();
    Member currentMember = memberService.getMemberByProfileIdAndServerId(profileId, serverId);
    Member targetMember = memberService.getMemberById(memberId);

    if (currentMember == null || currentMember.getMemberRole().equals(MemberRoleEnum.GUEST)) {
      throw new NotAllowedException("You are not allowed to delete member in this server");
    }

    if (targetMember == null) {
      throw new ResourceNotFoundException("Member not found with id: " + memberId);
    }

    if (targetMember.getMemberRole().equals(MemberRoleEnum.ADMIN)) {
      throw new NotAllowedException("You are not allowed to delete admin member");
    }

    memberService.deleteMember(memberId);

    Server server = serverService.getServerById(serverId);

    ResServerDTO resServer = modelMapper.map(server, ResServerDTO.class);

    return ResponseEntity.ok().body(resServer);
  }
}
