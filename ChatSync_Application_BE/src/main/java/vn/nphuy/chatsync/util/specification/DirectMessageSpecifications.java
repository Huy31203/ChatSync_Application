package vn.nphuy.chatsync.util.specification;

import org.springframework.data.jpa.domain.Specification;

import vn.nphuy.chatsync.domain.DirectMessage;

public class DirectMessageSpecifications {
  // Private constructor to hide the implicit public one
  private DirectMessageSpecifications() {
    throw new UnsupportedOperationException("This is a utility class and cannot be instantiated");
  }

  public static Specification<DirectMessage> hasConversationId(String conversationId) {
    return (root, query, criteriaBuilder) ->
    // Build the where condition to get all channels in a profile by conversationId
    criteriaBuilder.equal(root.join("conversation").get("id"), conversationId);
  }

}
