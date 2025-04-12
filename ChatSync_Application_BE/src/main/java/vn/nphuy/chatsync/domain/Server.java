package vn.nphuy.chatsync.domain;

import java.util.List;

import org.hibernate.annotations.Filter;
import org.hibernate.annotations.FilterDef;
import org.hibernate.annotations.SQLDelete;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;

@Entity
@Table(name = "servers")
@SQLDelete(sql = "UPDATE servers SET deleted = true WHERE id=?")
@FilterDef(name = "deletedServersFilter")
@Filter(name = "deletedServersFilter", condition = "deleted = false")
@Getter
@Setter
public class Server extends AbstractEntity {
    @NotBlank(message = "Name is required")
    private String name;

    private String imageUrl;

    @Column(unique = true)
    private String inviteCode;

    @OneToMany(mappedBy = "server", fetch = FetchType.LAZY, cascade = CascadeType.ALL)
    private List<Member> members;

    @OneToMany(mappedBy = "server", fetch = FetchType.LAZY, cascade = CascadeType.ALL)
    private List<Channel> channels;

    public List<Member> getMembers() {
        return members != null
                ? members.stream().filter(member -> !member.isDeleted()).toList()
                : List.of();
    }

    public List<Channel> getChannels() {
        return channels != null
                ? channels.stream().filter(channel -> !channel.isDeleted()).toList()
                : List.of();
    }
}
