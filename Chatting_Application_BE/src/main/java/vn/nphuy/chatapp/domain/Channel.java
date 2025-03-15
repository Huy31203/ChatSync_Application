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
import vn.nphuy.chatapp.util.constant.ChannelTypeEnum;

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

  public Server getServer() {
    return server != null && !server.isDeleted() ? server : null;
  }

}
