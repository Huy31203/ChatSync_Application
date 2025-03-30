package vn.nphuy.chatapp.service;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;

import jakarta.persistence.EntityManager;
import lombok.RequiredArgsConstructor;
import vn.nphuy.chatapp.domain.Conversation;
import vn.nphuy.chatapp.domain.DirectMessage;
import vn.nphuy.chatapp.domain.response.Meta;
import vn.nphuy.chatapp.domain.response.ResultPaginationDTO;
import vn.nphuy.chatapp.repository.DirectMessageRepository;
import vn.nphuy.chatapp.util.specification.DirectMessageSpecifications;

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
    return directMessageRepository.findById(directMessageId).orElse(null);
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
    existingDirectMessage.setFileUrls(
        directMessage.getFileUrls().isEmpty() ? directMessage.getFileUrls() : existingDirectMessage.getFileUrls());

    return directMessageRepository.save(existingDirectMessage);
  }

  public boolean deleteDirectMessage(String directMessageId) {
    if (directMessageRepository.existsById(directMessageId)) {
      directMessageRepository.deleteById(directMessageId);
      return true;
    } else {
      return false;
    }
  }
}
