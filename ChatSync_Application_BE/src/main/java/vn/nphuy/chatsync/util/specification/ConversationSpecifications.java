package vn.nphuy.chatsync.util.specification;

import org.springframework.data.jpa.domain.Specification;

import vn.nphuy.chatsync.domain.Conversation;

public class ConversationSpecifications {
  // Private constructor to hide the implicit public one
  private ConversationSpecifications() {
    throw new UnsupportedOperationException("This is a utility class and cannot be instantiated");
  }

  public static Specification<Conversation> hasSenderId(String memberId) {
    return (root, query, criteriaBuilder) ->
    // Build the where condition to get all channels in a profile by memberId
    criteriaBuilder.and(
        criteriaBuilder.equal(root.get("sender").get("id"), memberId),
        criteriaBuilder.equal(root.get("deleted"), false));
  }

  public static Specification<Conversation> hasReceiverId(String memberId) {
    return (root, query, criteriaBuilder) ->
    // Build the where condition to get all channels in a profile by memberId
    criteriaBuilder.and(
        criteriaBuilder.equal(root.get("receiver").get("id"), memberId),
        criteriaBuilder.equal(root.get("deleted"), false));
  }
}
