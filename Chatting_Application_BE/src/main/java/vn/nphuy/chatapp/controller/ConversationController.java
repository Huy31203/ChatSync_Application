package vn.nphuy.chatapp.controller;

import org.modelmapper.ModelMapper;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import jakarta.transaction.Transactional;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import vn.nphuy.chatapp.domain.Conversation;
import vn.nphuy.chatapp.domain.DirectMessage;
import vn.nphuy.chatapp.domain.request.ReqDirectMessageDTO;
import vn.nphuy.chatapp.domain.response.ResDirectMessageDTO;
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
  @ApiMessage(message = "Send message to conversation")
  @Transactional
  public ResDirectMessageDTO sendMessage(@DestinationVariable("id") String conversationid,
      @RequestBody @Valid ReqDirectMessageDTO reqDirectMessage) {
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

  @MessageMapping("/conversations/{conversationId}/messages/{messageId}/Get")
  @SendTo("/topic/conversations/{conversationId}")
  @ApiMessage(message = "Send Get message to conversation")
  @Transactional
  public ResDirectMessageDTO sendEditMessage(@DestinationVariable("conversationId") String conversationid,
      @DestinationVariable("messageId") String messageId) {
    log.info("Sending Get message to Conversation Id: {}", conversationid);

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
}
