package vn.nphuy.chatapp.service;

import org.hibernate.Session;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;

import jakarta.persistence.EntityManager;
import lombok.RequiredArgsConstructor;
import vn.nphuy.chatapp.domain.DirectMessage;
import vn.nphuy.chatapp.domain.response.Meta;
import vn.nphuy.chatapp.domain.response.ResultPaginationDTO;
import vn.nphuy.chatapp.repository.DirectMessageRepository;
import vn.nphuy.chatapp.util.specification.DirectMessageSpecifications;

@Service
@RequiredArgsConstructor
public class DirectMessageService {
  private final DirectMessageRepository directMessageRepository;
  private final EntityManager entityManager;

  public ResultPaginationDTO getAllDirectMessagesByConversationId(Pageable pageable, String conversationId) {
    Session session = entityManager.unwrap(Session.class);
    session.enableFilter("deletedDirectMessagesFilter");

    Specification<DirectMessage> spec = DirectMessageSpecifications.hasConversationId(conversationId);

    Page<DirectMessage> directMessages = directMessageRepository.findAll(spec, pageable);

    session.disableFilter("deletedDirectMessagesFilter");

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
