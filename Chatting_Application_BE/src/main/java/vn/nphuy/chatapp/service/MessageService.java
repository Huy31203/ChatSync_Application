package vn.nphuy.chatapp.service;

import org.hibernate.Session;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;

import jakarta.persistence.EntityManager;
import lombok.RequiredArgsConstructor;
import vn.nphuy.chatapp.domain.Message;
import vn.nphuy.chatapp.domain.response.Meta;
import vn.nphuy.chatapp.domain.response.ResultPaginationDTO;
import vn.nphuy.chatapp.repository.MessageRepository;
import vn.nphuy.chatapp.util.specification.MessageSpecifications;

@Service
@RequiredArgsConstructor
public class MessageService {
  private final MessageRepository messageRepository;
  private final EntityManager entityManager;

  public ResultPaginationDTO getAllMessagesByMemberId(Pageable pageable, String memberId) {
    Session session = entityManager.unwrap(Session.class);
    session.enableFilter("deletedMessagesFilter");

    Specification<Message> spec = MessageSpecifications.hasMemberId(memberId);

    Page<Message> messages = messageRepository.findAll(spec, pageable);

    session.disableFilter("deletedMessagesFilter");

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

  public ResultPaginationDTO getAllMessagesByChannelId(Pageable pageable, String channelId) {
    Session session = entityManager.unwrap(Session.class);
    session.enableFilter("deletedMessagesFilter");

    Specification<Message> spec = MessageSpecifications.hasChannelId(channelId);

    Page<Message> messages = messageRepository.findAll(spec, pageable);

    session.disableFilter("deletedMessagesFilter");

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
    return messageRepository.findById(messageId).orElse(null);
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
    existingMessage.setFileUrl(null != message.getFileUrl() ? message.getFileUrl() : existingMessage.getFileUrl());

    return messageRepository.save(existingMessage);
  }

  public boolean deleteMessage(String messageId) {
    if (messageRepository.existsById(messageId)) {
      messageRepository.deleteById(messageId);
      return true;
    } else {
      return false;
    }
  }
}
