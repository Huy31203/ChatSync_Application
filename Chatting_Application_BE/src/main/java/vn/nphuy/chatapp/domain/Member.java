package vn.nphuy.chatapp.domain;

import org.hibernate.annotations.Filter;
import org.hibernate.annotations.FilterDef;
import org.hibernate.annotations.SQLDelete;

import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.Setter;
import vn.nphuy.chatapp.util.constant.MemberRoleEnum;

@Entity
@Table(name = "members")
@SQLDelete(sql = "UPDATE members SET deleted = true WHERE id=?")
@FilterDef(name = "deletedMembersFilter")
@Filter(name = "deletedMembersFilter", condition = "deleted = false")
@Getter
@Setter
public class Member extends AbstractEntity {

    @Enumerated(EnumType.STRING)
    private MemberRoleEnum memberRole = MemberRoleEnum.GUEST;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "profile_id")
    private Profile profile;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "server_id")
    private Server server;

    public Profile getProfile() {
        return profile != null && !profile.isDeleted() ? profile : null;
    }

    public Server getServer() {
        return server != null && !server.isDeleted() ? server : null;
    }
}
