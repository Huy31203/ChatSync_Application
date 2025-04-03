package vn.nphuy.chatapp.controller;

import java.util.List;
import java.util.Optional;

import org.modelmapper.ModelMapper;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
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

import com.turkraft.springfilter.boot.Filter;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import vn.nphuy.chatapp.domain.Channel;
import vn.nphuy.chatapp.domain.Conversation;
import vn.nphuy.chatapp.domain.DirectMessage;
import vn.nphuy.chatapp.domain.Member;
import vn.nphuy.chatapp.domain.Message;
import vn.nphuy.chatapp.domain.Profile;
import vn.nphuy.chatapp.domain.Server;
import vn.nphuy.chatapp.domain.request.ReqChannelDTO;
import vn.nphuy.chatapp.domain.request.ReqConversationDTO;
import vn.nphuy.chatapp.domain.request.ReqServerDTO;
import vn.nphuy.chatapp.domain.request.ReqUpdateDirectMessageDTO;
import vn.nphuy.chatapp.domain.request.ReqUpdateMemberDTO;
import vn.nphuy.chatapp.domain.request.ReqUpdateMessageDTO;
import vn.nphuy.chatapp.domain.response.ResChannelDTO;
import vn.nphuy.chatapp.domain.response.ResConversationDTO;
import vn.nphuy.chatapp.domain.response.ResDirectMessageDTO;
import vn.nphuy.chatapp.domain.response.ResMemberDTO;
import vn.nphuy.chatapp.domain.response.ResMessageDTO;
import vn.nphuy.chatapp.domain.response.ResServerDTO;
import vn.nphuy.chatapp.domain.response.ResultPaginationDTO;
import vn.nphuy.chatapp.service.ChannelService;
import vn.nphuy.chatapp.service.ConversationService;
import vn.nphuy.chatapp.service.DirectMessageService;
import vn.nphuy.chatapp.service.MemberService;
import vn.nphuy.chatapp.service.MessageService;
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
  private final DirectMessageService directMessageService;
  private final MessageService messageService;
  private final ModelMapper modelMapper;
  private final SecurityUtil securityUtil;
  // private final RateLimitService rateLimitService;

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

  @GetMapping("/servers/{serverId}/channels/{channelId}")
  @ApiMessage(message = "Fetch channel by id")
  public ResponseEntity<Object> getChannelById(@PathVariable("serverId") String serverId,
      @PathVariable("channelId") String channelId) {

    String profileId = securityUtil.getCurrentProfile().getId();
    Member member = memberService.getMemberByProfileIdAndServerId(profileId, serverId);

    if (member == null) {
      throw new NotAllowedException("You are not a member of that server");
    }

    Channel result = channelService.getChannelById(channelId);

    if (result == null) {
      throw new ResourceNotFoundException("Channel not found with id: " + channelId);
    }

    ResChannelDTO resChannel = modelMapper.map(result, ResChannelDTO.class);

    return ResponseEntity.ok(resChannel);
  }

  @GetMapping("/servers/{serverId}/members/current-profile")
  @ApiMessage(message = "Fetch member by current profile")
  public ResponseEntity<Object> getMemberByCurrentProfile(@PathVariable("serverId") String serverId) {

    String profileId = securityUtil.getCurrentProfile().getId();
    Member member = memberService.getMemberByProfileIdAndServerId(profileId, serverId);

    if (member == null) {
      throw new NotAllowedException("You are not a member of that server");
    }

    ResMemberDTO resMember = modelMapper.map(member, ResMemberDTO.class);

    return ResponseEntity.ok(resMember);
  }

  @GetMapping("/servers/{serverId}/conversations/sender/{senderId}/receiver/{receiverId}")
  @ApiMessage(message = "Get all conversations by memberId")
  public ResponseEntity<Object> getConversationByMemberId(@PathVariable("serverId") String serverId,
      @PathVariable("senderId") String senderId, @PathVariable("receiverId") String receiverId, Pageable pageable) {

    Member sender = memberService.getMemberById(senderId);

    if (sender == null) {
      throw new NotAllowedException("You are not a member of that server");
    }

    Conversation result = conversationService.getConversationBySenderIdAndReceiverId(sender.getId(), receiverId);

    if (result == null) {
      return ResponseEntity.ok().body(Optional.empty());
    }

    ResConversationDTO resConversation = modelMapper.map(result, ResConversationDTO.class);

    return ResponseEntity.ok().body(resConversation);
  }

  @GetMapping("/servers/{serverId}/conversations/{conversationid}/messages")
  @ApiMessage(message = "Get all messages in a conversation")
  public ResponseEntity<Object> getAllConversationMessages(@PathVariable("serverId") String serverId,
      @PathVariable("conversationid") String conversationId,
      @Filter Specification<DirectMessage> spec,
      Pageable pageable) {
    log.info("Getting all messages in Conversation: {}", conversationId);

    String profileId = securityUtil.getCurrentProfile().getId();
    Member member = memberService.getMemberByProfileIdAndServerId(profileId, serverId);

    if (member == null) {
      throw new NotAllowedException("You are not a member of that server");
    }

    Conversation conversation = conversationService.getConversationById(conversationId);
    if (conversation == null) {
      throw new ResourceNotFoundException("Conversation not found with id: " + conversationId);
    }

    ResultPaginationDTO results = directMessageService.getAllDirectMessagesByConversation(spec, pageable, conversation);

    if (results == null) {
      throw new ResourceNotFoundException("Messages not found with id: " + conversationId);
    }

    // Map entities to Response objects
    if (results.getData() != null) {
      @SuppressWarnings("unchecked")
      List<DirectMessage> messages = (List<DirectMessage>) results.getData();

      List<ResDirectMessageDTO> directMessageDTOs = messages.stream()
          .map(directMessage -> modelMapper.map(directMessage, ResDirectMessageDTO.class))
          .toList();

      results.setData(directMessageDTOs);
    }

    return ResponseEntity.ok(results);
  }

  @GetMapping("/servers/{serverId}/channels/{channelId}/messages")
  @ApiMessage(message = "Get all messages in a channel")
  public ResponseEntity<Object> getAllChannelMessages(@PathVariable("serverId") String serverId,
      @PathVariable("channelId") String channelId,
      @Filter Specification<Message> spec,
      Pageable pageable) {
    log.info("Getting all messages in Channel: {}", channelId);

    String profileId = securityUtil.getCurrentProfile().getId();
    Member member = memberService.getMemberByProfileIdAndServerId(profileId, serverId);

    if (member == null) {
      throw new NotAllowedException("You are not a member of that server");
    }

    Channel channel = channelService.getChannelById(channelId);
    if (channel == null) {
      throw new ResourceNotFoundException("Channel not found with id: " + channelId);
    }

    ResultPaginationDTO results = messageService.getAllMessagesByChannelId(spec, pageable, channelId);

    if (results == null) {
      throw new ResourceNotFoundException("Messages not found with Channel: " + channelId);
    }

    // Map entities to Response objects
    if (results.getData() != null) {
      @SuppressWarnings("unchecked")
      List<Message> messages = (List<Message>) results.getData();

      List<ResMessageDTO> messageDTOs = messages.stream()
          .map(message -> modelMapper.map(message, ResMessageDTO.class))
          .toList();

      results.setData(messageDTOs);
    }

    return ResponseEntity.ok(results);
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
    Member sender = memberService.getMemberById(reqConversation.getSenderId());
    Member receiver = memberService.getMemberById(reqConversation.getReceiverId());

    if (sender.getServer().getId() != receiver.getServer().getId()) {
      throw new NotAllowedException("You're only allowed to create conversations in same server");
    }

    Conversation conversation = new Conversation();
    conversation.setSender(sender);
    conversation.setReceiver(receiver);

    Conversation result = conversationService.createConversation(conversation);

    if (result == null) {
      throw new ServerErrorException("Failed to create conversation");
    }

    Conversation reverseConversation = new Conversation();
    reverseConversation.setSender(receiver);
    reverseConversation.setReceiver(sender);

    // Set the bidirectional relationship using relatedConversation (owning side)
    reverseConversation.setRelatedConversation(result);

    Conversation reverseResult = conversationService.createConversation(reverseConversation);
    if (reverseResult == null) {
      throw new ServerErrorException("Failed to create conversation");
    }

    // Complete the bidirectional relationship
    result.setRelatedConversation(reverseResult);

    ResConversationDTO resConversation = modelMapper.map(result, ResConversationDTO.class);

    return ResponseEntity.status(201).body(resConversation);
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
      @PathVariable("memberId") String memberId, @Valid @RequestBody ReqUpdateMemberDTO reqMember) {

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

  @PatchMapping("servers/{serverId}/conversations/{conversationId}/messages/{messageId}")
  @ApiMessage(message = "Update direct message by id")
  public ResponseEntity<Object> updateConversationMessage(@PathVariable("serverId") String serverId,
      @PathVariable("conversationId") String conversationId,
      @PathVariable("messageId") String messageId, @RequestBody @Valid ReqUpdateDirectMessageDTO reqDirectMessage) {
    log.info("Updating message:{} in Conversation: {}", messageId, conversationId);

    String profileId = securityUtil.getCurrentProfile().getId();
    Member member = memberService.getMemberByProfileIdAndServerId(profileId, serverId);

    if (member == null) {
      throw new NotAllowedException("You are not a member of that server");
    }

    Conversation conversation = conversationService.getConversationById(conversationId);
    if (conversation == null) {
      throw new ResourceNotFoundException("Conversation not found with id: " + conversationId);
    }

    DirectMessage directMessage = directMessageService.getDirectMessageById(messageId);
    if (directMessage == null) {
      throw new ResourceNotFoundException("Direct message not found with id: " + messageId);
    }

    // Check if the member is the sender of the message
    if (!directMessage.getConversation().getSender().getId().equals(member.getId())) {
      throw new NotAllowedException("You are not allowed to edit this message");
    }

    // Check if the message has any file URLs
    if (!directMessage.getFileUrls().isEmpty()) {
      throw new NotAllowedException("You are not allowed to edit message with file attached");
    }

    // Check if the message is deleted
    if (directMessage.isDeleted()) {
      throw new NotAllowedException("You are not allowed to edit deleted message");
    }

    directMessage.setContent(reqDirectMessage.getContent());

    DirectMessage updatedDirectMessage = directMessageService.updateDirectMessage(directMessage);

    ResDirectMessageDTO resDirectMessage = modelMapper.map(updatedDirectMessage, ResDirectMessageDTO.class);

    return ResponseEntity.ok(resDirectMessage);
  }

  @PatchMapping("servers/{serverId}/channels/{channelId}/messages/{messageId}")
  @ApiMessage(message = "Update message by id")
  public ResponseEntity<Object> updateChannelMessage(@PathVariable("serverId") String serverId,
      @PathVariable("channelId") String channelId,
      @PathVariable("messageId") String messageId, @RequestBody @Valid ReqUpdateMessageDTO reqMessage) {
    log.info("Updating message: {} in Channel: {}", messageId, channelId);

    String profileId = securityUtil.getCurrentProfile().getId();
    Member member = memberService.getMemberByProfileIdAndServerId(profileId, serverId);

    if (member == null) {
      throw new NotAllowedException("You are not a member of that server");
    }

    Channel channel = channelService.getChannelById(channelId);
    if (channel == null) {
      throw new ResourceNotFoundException("Channel not found with id: " + channelId);
    }

    Message message = messageService.getMessageById(messageId);
    if (message == null) {
      throw new ResourceNotFoundException("Message not found with id: " + messageId);
    }

    // Check if the member is the sender of the message
    if (!message.getSender().getId().equals(member.getId())) {
      throw new NotAllowedException("You are not allowed to edit this message");
    }

    // Check if the message has any file URLs
    if (!message.getFileUrls().isEmpty()) {
      throw new NotAllowedException("You are not allowed to edit message with file attached");
    }

    // Check if the message is deleted
    if (message.isDeleted()) {
      throw new NotAllowedException("You are not allowed to edit deleted message");
    }

    message.setContent(reqMessage.getContent());

    Message updatedMessage = messageService.updateMessage(message);

    ResMessageDTO resMessage = modelMapper.map(updatedMessage, ResMessageDTO.class);

    return ResponseEntity.ok(resMessage);
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

    return ResponseEntity.ok().body(Optional.empty());
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
  public ResponseEntity<Object> deleteChannel(@PathVariable("serverId") String serverId,
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

    Server server = serverService.getServerById(serverId);

    ResServerDTO resServer = modelMapper.map(server, ResServerDTO.class);

    return ResponseEntity.ok().body(resServer);
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

  @DeleteMapping("servers/{serverId}/conversations/{conversationId}/messages/{messageId}")
  @ApiMessage(message = "Delete a message in a conversation")
  public ResponseEntity<Void> deleteConversationMessage(@PathVariable("serverId") String serverId,
      @PathVariable("conversationId") String conversationId,
      @PathVariable("messageId") String messageId) {
    log.info("Deleting message:{} in Conversation: {}", messageId, conversationId);

    String profileId = securityUtil.getCurrentProfile().getId();
    Member member = memberService.getMemberByProfileIdAndServerId(profileId, serverId);

    if (member == null) {
      throw new NotAllowedException("You are not a member of that server");
    }

    Conversation conversation = conversationService.getConversationById(conversationId);
    if (conversation == null) {
      throw new ResourceNotFoundException("Conversation not found with id: " + conversationId);
    }

    DirectMessage directMessage = directMessageService.getDirectMessageById(messageId);
    if (directMessage == null) {
      throw new ResourceNotFoundException("Direct message not found with id: " + messageId);
    }

    // Check if the member is the sender of the message or has admin role
    // or is a moderator and the sender is not admin
    if (!directMessage.getConversation().getSender().getId().equals(member.getId())
        && !member.getMemberRole().equals(MemberRoleEnum.ADMIN)
        && !(member.getMemberRole().equals(MemberRoleEnum.MODERATOR)
            && !directMessage.getConversation().getSender().getMemberRole().equals(MemberRoleEnum.ADMIN))) {
      throw new NotAllowedException("You are not allowed to delete this message");
    }

    boolean isDeleted = directMessageService.deleteDirectMessage(directMessage.getId());

    if (!isDeleted) {
      throw new ResourceNotFoundException("Failed to delete direct message with id: " + messageId);
    }

    return ResponseEntity.ok().body(null);
  }

  @DeleteMapping("servers/{serverId}/channels/{channelId}/messages/{messageId}")
  @ApiMessage(message = "Delete message by id")
  public ResponseEntity<Void> deleteMessage(@PathVariable("serverId") String serverId,
      @PathVariable("channelId") String channelId,
      @PathVariable("messageId") String messageId) {
    log.info("Deleting message: {} in Channel: {}", messageId, channelId);

    String profileId = securityUtil.getCurrentProfile().getId();
    Member member = memberService.getMemberByProfileIdAndServerId(profileId, serverId);

    if (member == null) {
      throw new NotAllowedException("You are not a member of that server");
    }

    Channel channel = channelService.getChannelById(channelId);
    if (channel == null) {
      throw new ResourceNotFoundException("Channel not found with id: " + channelId);
    }

    Message message = messageService.getMessageById(messageId);
    if (message == null) {
      throw new ResourceNotFoundException("Message not found with id: " + messageId);
    }

    // Check if the member is the sender of the message or has admin/moderator role
    if (!message.getSender().getId().equals(member.getId())
        && !member.getMemberRole().equals(MemberRoleEnum.ADMIN)
        && !member.getMemberRole().equals(MemberRoleEnum.MODERATOR)) {
      throw new NotAllowedException("You are not allowed to delete this message");
    }

    messageService.deleteMessage(message.getId());

    return ResponseEntity.ok().body(null);
  }
}
