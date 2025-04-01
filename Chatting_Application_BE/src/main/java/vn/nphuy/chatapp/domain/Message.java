package vn.nphuy.chatapp.domain;

import java.util.List;

import org.hibernate.annotations.SQLDelete;

import com.fasterxml.jackson.annotation.JsonManagedReference;

import jakarta.persistence.CollectionTable;
import jakarta.persistence.Column;
import jakarta.persistence.ElementCollection;
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
@Getter
@Setter
public class Message extends AbstractEntity {

  @Column(columnDefinition = "MEDIUMTEXT")
  private String content;

  @ElementCollection
  @CollectionTable(name = "message_file_urls", joinColumns = @JoinColumn(name = "message_id"))
  @Column(name = "file_url")
  private List<String> fileUrls;

  @ManyToOne(fetch = FetchType.LAZY)
  @JoinColumn(name = "sender_id")
  @JsonManagedReference("member-message")
  private Member sender;

  @ManyToOne(fetch = FetchType.LAZY)
  @JoinColumn(name = "channel_id")
  private Channel channel;

  public Member getSender() {
    return sender != null && !sender.isDeleted() ? sender : null;
  }

  public Channel getChannel() {
    return channel != null && !channel.isDeleted() ? channel : null;
  }
}