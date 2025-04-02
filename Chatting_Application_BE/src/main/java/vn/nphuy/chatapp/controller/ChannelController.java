package vn.nphuy.chatapp.controller;

import org.modelmapper.ModelMapper;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import jakarta.transaction.Transactional;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import vn.nphuy.chatapp.domain.Channel;
import vn.nphuy.chatapp.domain.Member;
import vn.nphuy.chatapp.domain.Message;
import vn.nphuy.chatapp.domain.SignalMessage;
import vn.nphuy.chatapp.domain.request.ReqMessageDTO;
import vn.nphuy.chatapp.domain.response.ResMessageDTO;
import vn.nphuy.chatapp.service.ChannelService;
import vn.nphuy.chatapp.service.MemberService;
import vn.nphuy.chatapp.service.MessageService;
import vn.nphuy.chatapp.util.annotation.ApiMessage;
import vn.nphuy.chatapp.util.error.ResourceNotFoundException;

@RestController
@RequiredArgsConstructor
@Slf4j
public class ChannelController {
  private final ChannelService channelService;
  private final MessageService messageService;
  private final MemberService memberService;
  private final ModelMapper modelMapper;

  @MessageMapping("/channels/{id}")
  @SendTo("/topic/channels/{id}")
  @ApiMessage(message = "Send message to channel")
  @Transactional
  public ResMessageDTO sendMessage(@DestinationVariable("id") String channelid,
      @RequestBody @Valid ReqMessageDTO reqMessage) {
    log.info("Sending message to Conversation Id: {}", channelid);

    Channel channel = channelService.getChannelById(channelid);

    if (channel == null) {
      throw new ResourceNotFoundException("Channel not found with id: " + channelid);
    }

    Member member = memberService.getMemberById(reqMessage.getSenderId());

    if (member == null) {
      throw new ResourceNotFoundException("Member not found with id: " + reqMessage.getSenderId());
    }

    Message message = new Message();
    message.setContent(reqMessage.getContent());
    message.setFileUrls(reqMessage.getFileUrls());
    message.setChannel(channel);
    message.setSender(member);

    Message result = messageService.createMessage(message);
    return modelMapper.map(result, ResMessageDTO.class);
  }

  @MessageMapping("/channels/{channelId}/messages/{messageId}/Get")
  @SendTo("/topic/channels/{channelId}")
  @ApiMessage(message = "Send Get message to channel")
  @Transactional
  public ResMessageDTO sendEditMessage(@DestinationVariable("channelId") String channelid,
      @DestinationVariable("messageId") String messageId) {
    log.info("Sending Get message to Channel Id: {}", channelid);

    Channel channel = channelService.getChannelById(channelid);

    if (channel == null) {
      throw new ResourceNotFoundException("Channel not found with id: " + channelid);
    }

    Message message = messageService.getMessageById(messageId);

    if (message == null) {
      throw new ResourceNotFoundException("Message not found with id: " + messageId);
    }

    return modelMapper.map(message, ResMessageDTO.class);
  }

  @MessageMapping("/channels/{channelId}/signal")
  @SendTo("/topic/channels/{channelId}/signal")
  public SignalMessage processGroupSignal(@DestinationVariable("channelId") String channelid,
      @Payload SignalMessage message) {
    Channel channel = channelService.getChannelById(channelid);

    if (channel == null) {
      throw new ResourceNotFoundException("Channel not found with id: " + channelid);
    }

    // and handle joining/leaving logic if needed.
    return message;
  }
}
