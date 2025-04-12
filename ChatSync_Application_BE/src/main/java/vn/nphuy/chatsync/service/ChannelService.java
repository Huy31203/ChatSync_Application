package vn.nphuy.chatsync.service;

import org.hibernate.Session;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;

import jakarta.persistence.EntityManager;
import lombok.RequiredArgsConstructor;
import vn.nphuy.chatsync.domain.Channel;
import vn.nphuy.chatsync.domain.response.Meta;
import vn.nphuy.chatsync.domain.response.ResultPaginationDTO;
import vn.nphuy.chatsync.repository.ChannelRepository;
import vn.nphuy.chatsync.repository.ServerRepository;
import vn.nphuy.chatsync.util.specification.ChannelSpecifications;

@Service
@RequiredArgsConstructor
public class ChannelService {
  private final ChannelRepository channelRepository;
  private final ServerRepository serverRepository;
  private final EntityManager entityManager;

  public ResultPaginationDTO getAllChannels(Specification<Channel> spec, Pageable pageable, String serverId) {
    Session session = entityManager.unwrap(Session.class);
    session.enableFilter("deletedChannelsFilter");

    // Combine the provided specification with the server ID specification
    Specification<Channel> combinedSpec = spec.and(ChannelSpecifications.hasServerId(serverId));
    Page<Channel> channels = channelRepository.findAll(combinedSpec, pageable);

    session.disableFilter("deletedChannelsFilter");

    ResultPaginationDTO result = new ResultPaginationDTO();
    Meta meta = new Meta();

    meta.setPage(channels.getNumber() + 1);
    meta.setPageSize(channels.getSize());

    meta.setTotalPages(channels.getTotalPages());
    meta.setTotalElements(channels.getTotalElements());

    result.setMeta(meta);
    result.setData(channels.getContent());

    return result;
  }

  public Channel getChannelById(String channelId) {
    Session session = entityManager.unwrap(Session.class);
    session.enableFilter("deletedChannelsFilter");

    Channel channel = channelRepository.findById(channelId).orElse(null);

    session.disableFilter("deletedChannelsFilter");

    return channel;
  }

  public Channel getChannelByName(String serverId, String name) {
    return channelRepository.findOneByServerIdAndNameAndDeletedFalse(serverId, name).orElse(null);
  }

  public Channel createChannel(Channel channel) {
    return channelRepository.save(channel);
  }

  public Channel updateChannel(Channel channel) {
    return channelRepository.save(channel);
  }

  public boolean deleteChannel(String channelId) {
    if (channelRepository.existsById(channelId)) {
      channelRepository.deleteById(channelId);
      return true;
    } else {
      return false;
    }
  }
}
