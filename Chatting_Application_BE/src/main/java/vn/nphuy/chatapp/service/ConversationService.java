package vn.nphuy.chatapp.service;

import org.hibernate.Session;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;

import jakarta.persistence.EntityManager;
import lombok.RequiredArgsConstructor;
import vn.nphuy.chatapp.domain.Conversation;
import vn.nphuy.chatapp.domain.response.Meta;
import vn.nphuy.chatapp.domain.response.ResultPaginationDTO;
import vn.nphuy.chatapp.repository.ConversationRepository;
import vn.nphuy.chatapp.util.specification.ConversationSpecifications;

@Service
@RequiredArgsConstructor
public class ConversationService {
  private final ConversationRepository conversationRepository;
  private final EntityManager entityManager;

  public ResultPaginationDTO getAllConversationsSendedByMemberId(Pageable pageable, String memberId) {
    Session session = entityManager.unwrap(Session.class);
    session.enableFilter("deletedConversationsFilter");

    Specification<Conversation> spec = ConversationSpecifications.hasSenderId(memberId);

    Page<Conversation> conversations = conversationRepository.findAll(spec, pageable);

    session.disableFilter("deletedConversationsFilter");

    ResultPaginationDTO result = new ResultPaginationDTO();
    Meta meta = new Meta();

    meta.setPage(conversations.getNumber() + 1);
    meta.setPageSize(conversations.getSize());

    meta.setTotalPages(conversations.getTotalPages());
    meta.setTotalElements(conversations.getTotalElements());

    result.setMeta(meta);
    result.setData(conversations.getContent());

    return result;
  }

  public ResultPaginationDTO getAllConversationsReceivedByMemberId(Pageable pageable, String memberId) {
    Session session = entityManager.unwrap(Session.class);
    session.enableFilter("deletedConversationsFilter");

    Specification<Conversation> spec = ConversationSpecifications.hasReceiverId(memberId);

    Page<Conversation> conversations = conversationRepository.findAll(spec, pageable);

    session.disableFilter("deletedConversationsFilter");

    ResultPaginationDTO result = new ResultPaginationDTO();
    Meta meta = new Meta();

    meta.setPage(conversations.getNumber() + 1);
    meta.setPageSize(conversations.getSize());

    meta.setTotalPages(conversations.getTotalPages());
    meta.setTotalElements(conversations.getTotalElements());

    result.setMeta(meta);
    result.setData(conversations.getContent());

    return result;
  }

  public Conversation getConversationById(String conversationId) {
    return conversationRepository.findOneById(conversationId).orElse(null);
  }

  public Conversation getConversationBySenderIdAndReceiverId(String senderId, String receiverId) {
    return conversationRepository.findOneBySenderIdAndReceiverId(senderId, receiverId).orElse(null);
  }

  public Conversation createConversation(Conversation conversation) {
    return conversationRepository.save(conversation);
  }
}
