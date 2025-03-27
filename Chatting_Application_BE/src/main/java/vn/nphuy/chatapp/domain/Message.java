package vn.nphuy.chatapp.domain;

import org.hibernate.annotations.Filter;
import org.hibernate.annotations.FilterDef;
import org.hibernate.annotations.SQLDelete;

import com.fasterxml.jackson.annotation.JsonManagedReference;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.Setter;

@Entity
@Table(name = "messages")
@SQLDelete(sql = "UPDATE messages SET deleted = true WHERE id=?")
@FilterDef(name = "deletedMessagesFilter")
@Filter(name = "deletedMessagesFilter", condition = "deleted = false")
@Getter
@Setter
public class Message extends AbstractEntity {

  @Column(columnDefinition = "MEDIUMTEXT")
  private String content;

  private String fileUrl;

  @ManyToOne(fetch = FetchType.LAZY)
  @JoinColumn(name = "member_id")
  @JsonManagedReference("member-message")
  private Member member;

  @ManyToOne(fetch = FetchType.LAZY)
  @JoinColumn(name = "channel_id")
  private Channel channel;

  public Member getMember() {
    return member != null && !member.isDeleted() ? member : null;
  }
}