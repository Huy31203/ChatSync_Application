package vn.nphuy.chatsync.util.specification;

import org.springframework.data.jpa.domain.Specification;

import vn.nphuy.chatsync.domain.Channel;

public class ChannelSpecifications {

  private ChannelSpecifications() {
    throw new UnsupportedOperationException("This is a utility class and cannot be instantiated");
  }

  public static Specification<Channel> hasServerId(String serverId) {
    return (root, query, criteriaBuilder) ->
    // Build the where condition to get all channels in a server by serverId
    criteriaBuilder.and(
        criteriaBuilder.equal(root.get("server").get("id"), serverId),
        criteriaBuilder.equal(root.get("deleted"), false) // Ensure the channel is not deleted
    );
  }
}