package vn.nphuy.chatsync.service;

import java.util.ArrayList;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;

import jakarta.persistence.EntityManager;
import lombok.RequiredArgsConstructor;
import vn.nphuy.chatsync.domain.Message;
import vn.nphuy.chatsync.domain.response.Meta;
import vn.nphuy.chatsync.domain.response.ResultPaginationDTO;
import vn.nphuy.chatsync.repository.MessageRepository;
import vn.nphuy.chatsync.util.specification.MessageSpecifications;

@Service
@RequiredArgsConstructor
public class MessageService {
  private final MessageRepository messageRepository;
  private final EntityManager entityManager;

  public ResultPaginationDTO getAllMessagesByMemberId(Specification<Message> spec, Pageable pageable,
      String memberId) {
    Specification<Message> compinedSpec = spec.and(MessageSpecifications.hasMemberId(memberId));

    Page<Message> messages = messageRepository.findAll(compinedSpec, pageable);

    ResultPaginationDTO result = new ResultPaginationDTO();
    Meta meta = new Meta();

    meta.setPage(messages.getNumber() + 1);
    meta.setPageSize(messages.getSize());

    meta.setTotalPages(messages.getTotalPages());
    meta.setTotalElements(messages.getTotalElements());

    result.setMeta(meta);
    result.setData(messages.getContent());

    return result;
  }

  public ResultPaginationDTO getAllMessagesByChannelId(Specification<Message> spec, Pageable pageable,
      String channelId) {
    Specification<Message> compinedSpec = spec.and(MessageSpecifications.hasChannelId(channelId));

    Page<Message> messages = messageRepository.findAll(compinedSpec, pageable);

    ResultPaginationDTO result = new ResultPaginationDTO();
    Meta meta = new Meta();

    meta.setPage(messages.getNumber() + 1);
    meta.setPageSize(messages.getSize());

    meta.setTotalPages(messages.getTotalPages());
    meta.setTotalElements(messages.getTotalElements());

    result.setMeta(meta);
    result.setData(messages.getContent());

    return result;
  }

  public Message getMessageById(String messageId) {
    return messageRepository.findOneById(messageId).orElse(null);
  }

  public Message createMessage(Message message) {
    return messageRepository.save(message);
  }

  public Message updateMessage(Message message) {
    Message existingMessage = messageRepository.findById(message.getId()).orElse(null);
    if (existingMessage == null) {
      return null;
    }

    existingMessage.setContent(null != message.getContent() ? message.getContent() : existingMessage.getContent());

    return messageRepository.save(existingMessage);
  }

  public boolean deleteMessage(String messageId) {
    Message existingMessage = messageRepository.findOneById(messageId).orElse(null);
    if (existingMessage == null) {
      return false;
    }

    existingMessage.setContent("This message was deleted");
    existingMessage.setFileUrls(new ArrayList<>());
    existingMessage.setDeleted(true);

    messageRepository.save(existingMessage);
    return true;
  }
}
