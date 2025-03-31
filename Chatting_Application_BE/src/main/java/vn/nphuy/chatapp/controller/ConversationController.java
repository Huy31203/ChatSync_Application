package vn.nphuy.chatapp.controller;

import java.util.List;

import org.modelmapper.ModelMapper;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import com.turkraft.springfilter.boot.Filter;

import jakarta.transaction.Transactional;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import vn.nphuy.chatapp.domain.Conversation;
import vn.nphuy.chatapp.domain.DirectMessage;
import vn.nphuy.chatapp.domain.request.ReqDirectMessage;
import vn.nphuy.chatapp.domain.request.ReqUpdateDirectMessage;
import vn.nphuy.chatapp.domain.response.ResDirectMessageDTO;
import vn.nphuy.chatapp.domain.response.ResultPaginationDTO;
import vn.nphuy.chatapp.service.ConversationService;
import vn.nphuy.chatapp.service.DirectMessageService;
import vn.nphuy.chatapp.util.SecurityUtil;
import vn.nphuy.chatapp.util.annotation.ApiMessage;
import vn.nphuy.chatapp.util.error.ResourceNotFoundException;

@RestController
@RequiredArgsConstructor
@Slf4j
public class ConversationController {
  private final ConversationService conversationService;
  private final DirectMessageService directMessageService;
  private final ModelMapper modelMapper;
  private final SecurityUtil securityUtil;

  @MessageMapping("/conversations/{id}")
  @SendTo("/topic/conversations/{id}")
  @Transactional
  public ResDirectMessageDTO sendMessage(@DestinationVariable("id") String conversationid,
      @RequestBody @Valid ReqDirectMessage reqDirectMessage) {
    log.info("Sending message to Conversation Id: {}", conversationid);

    Conversation conversation = conversationService.getConversationById(conversationid);

    if (conversation == null) {
      throw new ResourceNotFoundException("Conversation not found with id: " + conversationid);
    }

    DirectMessage directMessage = new DirectMessage();
    directMessage.setContent(reqDirectMessage.getContent());
    directMessage.setFileUrls(reqDirectMessage.getFileUrls());
    directMessage.setConversation(conversation);

    DirectMessage result = directMessageService.createDirectMessage(directMessage);
    return modelMapper.map(result, ResDirectMessageDTO.class);
  }

  @MessageMapping("/conversations/{conversationId}/messages/{messageId}/Edit")
  @SendTo("/topic/conversations/{conversationId}")
  @Transactional
  public ResDirectMessageDTO sendEditMessage(@DestinationVariable("conversationId") String conversationid,
      @DestinationVariable("messageId") String messageId,
      @RequestBody @Valid ReqUpdateDirectMessage reqDirectMessage) {
    log.info("Sending message to Conversation Id: {}", conversationid);

    Conversation conversation = conversationService.getConversationById(conversationid);

    if (conversation == null) {
      throw new ResourceNotFoundException("Conversation not found with id: " + conversationid);
    }

    DirectMessage directMessage = directMessageService.getDirectMessageById(messageId);

    if (directMessage == null) {
      throw new ResourceNotFoundException("Message not found with id: " + conversationid);
    }

    return modelMapper.map(directMessage, ResDirectMessageDTO.class);
  }

  @GetMapping("/v1/conversations/{id}/messages")
  @ApiMessage(message = "Get all messages in a conversation")
  public ResponseEntity<Object> getAllMessages(@PathVariable("id") String id, @Filter Specification<DirectMessage> spec,
      Pageable pageable) {
    log.info("Getting all messages in Conversation Id: {}", id);

    Conversation conversation = conversationService.getConversationById(id);
    if (conversation == null) {
      throw new ResourceNotFoundException("Conversation not found with id: " + id);
    }

    ResultPaginationDTO results = directMessageService.getAllDirectMessagesByConversation(spec, pageable, conversation);

    if (results == null) {
      throw new ResourceNotFoundException("Conversation not found with id: " + id);
    }

    // Map entities to Response objects
    if (results.getData() != null) {
      @SuppressWarnings("unchecked")
      List<DirectMessage> messages = (List<DirectMessage>) results.getData();

      List<ResDirectMessageDTO> serverDTOs = messages.stream()
          .map(server -> modelMapper.map(server, ResDirectMessageDTO.class))
          .toList();

      results.setData(serverDTOs);
    }

    return ResponseEntity.ok(results);
  }

  @PatchMapping("/v1/conversations/{id}/messages/{messageId}")
  @ApiMessage(message = "Update a message in a conversation")
  public ResponseEntity<Object> updateMessage(@PathVariable("id") String id,
      @PathVariable("messageId") String messageId, @RequestBody @Valid ReqUpdateDirectMessage reqDirectMessage) {
    log.info("Updating message in Conversation Id: {}", id);

    Conversation conversation = conversationService.getConversationById(id);
    if (conversation == null) {
      throw new ResourceNotFoundException("Conversation not found with id: " + id);
    }

    DirectMessage directMessage = directMessageService.getDirectMessageById(messageId);
    if (directMessage == null) {
      throw new ResourceNotFoundException("Direct message not found with id: " + messageId);
    }

    directMessage.setContent(reqDirectMessage.getContent());

    DirectMessage updatedDirectMessage = directMessageService.updateDirectMessage(directMessage);

    ResDirectMessageDTO resDirectMessageDTO = modelMapper.map(updatedDirectMessage, ResDirectMessageDTO.class);

    return ResponseEntity.ok(resDirectMessageDTO);
  }

  @DeleteMapping("/v1/conversations/{id}/messages/{messageId}")
  @ApiMessage(message = "Delete a message in a conversation")
  public ResponseEntity<Void> deleteMessage(@PathVariable("id") String id,
      @PathVariable("messageId") String messageId) {
    log.info("Deleting message in Conversation Id: {}", id);

    Conversation conversation = conversationService.getConversationById(id);
    if (conversation == null) {
      throw new ResourceNotFoundException("Conversation not found with id: " + id);
    }

    DirectMessage directMessage = directMessageService.getDirectMessageById(messageId);
    if (directMessage == null) {
      throw new ResourceNotFoundException("Direct message not found with id: " + messageId);
    }

    boolean isDeleted = directMessageService.deleteDirectMessage(directMessage);

    if (!isDeleted) {
      throw new ResourceNotFoundException("Failed to delete direct message with id: " + messageId);
    }

    return ResponseEntity.ok().body(null);
  }
}
