package vn.nphuy.chatsync.util.specification;

import org.springframework.data.jpa.domain.Specification;

import vn.nphuy.chatsync.domain.Member;

public class MemberSpecifications {
  // Private constructor to hide the implicit public one
  private MemberSpecifications() {
    throw new UnsupportedOperationException("This is a utility class and cannot be instantiated");
  }

  public static Specification<Member> hasProfileId(String profileId) {
    return (root, query, criteriaBuilder) ->
    // Build the where condition to get all channels in a profile by profileId
    criteriaBuilder.and(
        criteriaBuilder.equal(root.get("profile").get("id"), profileId),
        criteriaBuilder.equal(root.get("deleted"), false) // Ensure the member is not deleted
    );
  }
}
