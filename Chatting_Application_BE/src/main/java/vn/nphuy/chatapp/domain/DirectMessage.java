package vn.nphuy.chatapp.domain;

import org.hibernate.annotations.Filter;
import org.hibernate.annotations.FilterDef;
import org.hibernate.annotations.SQLDelete;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.Setter;

@Entity
@Table(name = "direct_messages")
@SQLDelete(sql = "UPDATE direct_messages SET deleted = true WHERE id=?")
@FilterDef(name = "deletedDirectMessagesFilter")
@Filter(name = "deletedDirectMessagesFilter", condition = "deleted = false")
@Getter
@Setter
public class DirectMessage extends AbstractEntity {

  @Column(columnDefinition = "MEDIUMTEXT")
  private String content;

  private String fileUrl;

  @ManyToOne(fetch = FetchType.LAZY)
  @JoinColumn(name = "conversation_id")
  private Conversation conversation;

  public Conversation getConversation() {
    return conversation != null && !conversation.isDeleted() ? conversation : null;
  }
}
