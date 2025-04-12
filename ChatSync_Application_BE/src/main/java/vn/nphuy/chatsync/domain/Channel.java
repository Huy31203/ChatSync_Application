package vn.nphuy.chatsync.domain;

import java.util.List;

import org.hibernate.annotations.Filter;
import org.hibernate.annotations.FilterDef;
import org.hibernate.annotations.SQLDelete;

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
import vn.nphuy.chatsync.util.constant.ChannelTypeEnum;

@Entity
@Table(name = "channels")
@SQLDelete(sql = "UPDATE channels SET deleted = true WHERE id=?")
@FilterDef(name = "deletedChannelsFilter")
@Filter(name = "deletedChannelsFilter", condition = "deleted = false")
@Getter
@Setter
public class Channel extends AbstractEntity {

  private String name;

  @Enumerated(EnumType.STRING)
  private ChannelTypeEnum type = ChannelTypeEnum.TEXT;

  @ManyToOne(fetch = FetchType.LAZY)
  @JoinColumn(name = "server_id")
  private Server server;

  @OneToMany(mappedBy = "channel", fetch = FetchType.LAZY, cascade = CascadeType.ALL)
  private List<Message> messages;

  public Server getServer() {
    return server != null && !server.isDeleted() ? server : null;
  }

  public List<Message> getMessages() {
    return messages != null
        ? messages.stream().filter(message -> !message.isDeleted()).toList()
        : List.of();
  }
}
