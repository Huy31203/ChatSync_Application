package vn.nphuy.chatapp.util.specification;

import org.springframework.data.jpa.domain.Specification;

import vn.nphuy.chatapp.domain.Message;

public class MessageSpecifications {
  // Private constructor to hide the implicit public one
  private MessageSpecifications() {
    throw new UnsupportedOperationException("This is a utility class and cannot be instantiated");
  }

  public static Specification<Message> hasMemberId(String memberId) {
    return (root, query, criteriaBuilder) ->
    // Build the where condition to get all channels in a profile by memberId
    criteriaBuilder.and(
        criteriaBuilder.equal(root.join("member").get("id"), memberId),
        criteriaBuilder.equal(root.get("deleted"), false));
  }

  public static Specification<Message> hasChannelId(String channelId) {
    return (root, query, criteriaBuilder) ->
    // Build the where condition to get all channels in a profile by channelId
    criteriaBuilder.and(
        criteriaBuilder.equal(root.join("channel").get("id"), channelId),
        criteriaBuilder.equal(root.get("deleted"), false));
  }
}
