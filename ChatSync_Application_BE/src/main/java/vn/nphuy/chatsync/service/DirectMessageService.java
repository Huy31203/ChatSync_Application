package vn.nphuy.chatsync.service;

import java.util.ArrayList;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;

import jakarta.persistence.EntityManager;
import lombok.RequiredArgsConstructor;
import vn.nphuy.chatsync.domain.Conversation;
import vn.nphuy.chatsync.domain.DirectMessage;
import vn.nphuy.chatsync.domain.response.Meta;
import vn.nphuy.chatsync.domain.response.ResultPaginationDTO;
import vn.nphuy.chatsync.repository.DirectMessageRepository;
import vn.nphuy.chatsync.util.specification.DirectMessageSpecifications;

@Service
@RequiredArgsConstructor
public class DirectMessageService {
  private final ConversationService conversationService;
  private final DirectMessageRepository directMessageRepository;
  private final EntityManager entityManager;

  public ResultPaginationDTO getAllDirectMessagesByConversation(Specification<DirectMessage> spec, Pageable pageable,
      Conversation conversation) {

    Specification<DirectMessage> combinedSpec = spec
        .and(DirectMessageSpecifications.hasConversationId(conversation.getId()))
        .or(DirectMessageSpecifications.hasConversationId(conversation.getRelatedConversation().getId()));

    Page<DirectMessage> directMessages = directMessageRepository.findAll(combinedSpec, pageable);

    ResultPaginationDTO result = new ResultPaginationDTO();
    Meta meta = new Meta();

    meta.setPage(directMessages.getNumber() + 1);
    meta.setPageSize(directMessages.getSize());

    meta.setTotalPages(directMessages.getTotalPages());
    meta.setTotalElements(directMessages.getTotalElements());

    result.setMeta(meta);
    result.setData(directMessages.getContent());

    return result;
  }

  public DirectMessage getDirectMessageById(String directMessageId) {
    return directMessageRepository.findOneById(directMessageId).orElse(null);
  }

  public DirectMessage createDirectMessage(DirectMessage directMessage) {
    return directMessageRepository.save(directMessage);
  }

  public DirectMessage updateDirectMessage(DirectMessage directMessage) {
    DirectMessage existingDirectMessage = directMessageRepository.findById(directMessage.getId()).orElse(null);
    if (existingDirectMessage == null) {
      return null;
    }

    existingDirectMessage.setContent(
        null != directMessage.getContent() ? directMessage.getContent() : existingDirectMessage.getContent());

    return directMessageRepository.save(existingDirectMessage);
  }

  public boolean deleteDirectMessage(String directMessageId) {
    DirectMessage existingDirectMessage = directMessageRepository.findOneById(directMessageId).orElse(null);
    if (existingDirectMessage == null) {
      return false;
    }

    existingDirectMessage.setContent("This message was deleted");
    existingDirectMessage.setFileUrls(new ArrayList<>());
    existingDirectMessage.setDeleted(true);

    directMessageRepository.save(existingDirectMessage);
    return true;
  }
}
