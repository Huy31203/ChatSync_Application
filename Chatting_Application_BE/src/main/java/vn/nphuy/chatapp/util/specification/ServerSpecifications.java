package vn.nphuy.chatapp.util.specification;

import java.lang.reflect.Member;

import org.springframework.data.jpa.domain.Specification;

import jakarta.persistence.criteria.Join;
import vn.nphuy.chatapp.domain.Profile;
import vn.nphuy.chatapp.domain.Server;

public class ServerSpecifications {

    // Private constructor to hide the implicit public one
    private ServerSpecifications() {
        throw new UnsupportedOperationException("This is a utility class and cannot be instantiated");
    }

    public static Specification<Server> hasProfileId(String profileId) {
        return (root, query, criteriaBuilder) -> {
            // Avoid duplicate results in pagination
            query.distinct(true);

            // Join with members
            Join<Server, Member> memberJoin = root.join("members");

            // Join with profile
            Join<Member, Profile> profileJoin = memberJoin.join("profile");

            // Build the where conditions
            return criteriaBuilder.and(
                    criteriaBuilder.equal(profileJoin.get("id"), profileId),
                    criteriaBuilder.equal(memberJoin.get("deleted"), false));
        };
    }
}