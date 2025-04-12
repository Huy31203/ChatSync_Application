package vn.nphuy.chatsync.domain;

import java.util.List;

import org.hibernate.annotations.Filter;
import org.hibernate.annotations.FilterDef;
import org.hibernate.annotations.SQLDelete;

import com.fasterxml.jackson.annotation.JsonBackReference;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.Setter;
import vn.nphuy.chatsync.util.constant.MemberRoleEnum;

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

    @OneToMany(mappedBy = "sender", fetch = FetchType.LAZY, cascade = CascadeType.ALL)
    @JsonBackReference("member-message")
    private List<Message> messages;

    @OneToMany(mappedBy = "sender", fetch = FetchType.LAZY, cascade = CascadeType.ALL)
    private List<Conversation> conversationSended;

    @OneToMany(mappedBy = "receiver", fetch = FetchType.LAZY, cascade = CascadeType.ALL)
    private List<Conversation> conversationReceived;

    public Profile getProfile() {
        return profile != null && !profile.isDeleted() ? profile : null;
    }

    public Server getServer() {
        return server != null && !server.isDeleted() ? server : null;
    }

    public List<Message> getMessages() {
        return messages != null
                ? messages.stream().filter(message -> !message.isDeleted()).toList()
                : List.of();
    }

    public List<Conversation> getConversationSended() {
        return conversationSended != null
                ? conversationSended.stream().filter(conversation -> !conversation.isDeleted()).toList()
                : List.of();
    }

    public List<Conversation> getConversationReceived() {
        return conversationReceived != null
                ? conversationReceived.stream().filter(conversation -> !conversation.isDeleted()).toList()
                : List.of();
    }
}
