package vn.nphuy.chatsync.util.specification;

import org.springframework.data.jpa.domain.Specification;

import vn.nphuy.chatsync.domain.Message;

public class MessageSpecifications {
  // Private constructor to hide the implicit public one
  private MessageSpecifications() {
    throw new UnsupportedOperationException("This is a utility class and cannot be instantiated");
  }

  public static Specification<Message> hasMemberId(String memberId) {
    return (root, query, criteriaBuilder) -> criteriaBuilder.equal(root.join("member").get("id"), memberId);
  }

  public static Specification<Message> hasChannelId(String channelId) {
    return (root, query, criteriaBuilder) -> criteriaBuilder.equal(root.join("channel").get("id"), channelId);
  }
}
