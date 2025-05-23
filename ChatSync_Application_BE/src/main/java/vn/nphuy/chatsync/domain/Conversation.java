package vn.nphuy.chatsync.domain;

import java.util.List;

import org.hibernate.annotations.Filter;
import org.hibernate.annotations.FilterDef;
import org.hibernate.annotations.SQLDelete;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;
import jakarta.persistence.UniqueConstraint;
import lombok.Setter;

@Entity
@Table(name = "conversations", uniqueConstraints = {
    @UniqueConstraint(columnNames = { "sender_id", "receiver_id" })
})
@SQLDelete(sql = "UPDATE conversations SET deleted = true WHERE id=?")
@FilterDef(name = "deletedConversationsFilter")
@Filter(name = "deletedConversationsFilter", condition = "deleted = false")
@Setter
public class Conversation extends AbstractEntity {

  @ManyToOne(fetch = FetchType.LAZY)
  @JoinColumn(name = "sender_id")
  private Member sender;

  @ManyToOne(fetch = FetchType.LAZY)
  @JoinColumn(name = "receiver_id")
  private Member receiver;

  @OneToMany(mappedBy = "conversation", fetch = FetchType.LAZY, cascade = CascadeType.ALL)
  private List<DirectMessage> directMessages;

  // This is the owning side of the relationship
  @OneToOne(fetch = FetchType.LAZY, cascade = CascadeType.ALL)
  @JoinColumn(name = "related_conversation_id")
  private Conversation relatedConversation;

  // This is the inverse side of the relationship
  @OneToOne(mappedBy = "relatedConversation", fetch = FetchType.LAZY)
  private Conversation inverseConversation;

  public Member getSender() {
    return sender != null && !sender.isDeleted() ? sender : null;
  }

  public Member getReceiver() {
    return receiver != null && !receiver.isDeleted() ? receiver : null;
  }

  public Conversation getRelatedConversation() {
    return relatedConversation != null && !relatedConversation.isDeleted()
        ? relatedConversation
        : null;
  }

  public Conversation getInverseConversation() {
    return inverseConversation != null && !inverseConversation.isDeleted()
        ? inverseConversation
        : null;
  }

}
