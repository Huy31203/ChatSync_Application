package vn.nphuy.chatapp.service;

import org.hibernate.Session;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;

import jakarta.persistence.EntityManager;
import lombok.RequiredArgsConstructor;
import vn.nphuy.chatapp.domain.Channel;
import vn.nphuy.chatapp.domain.Member;
import vn.nphuy.chatapp.domain.Server;
import vn.nphuy.chatapp.domain.response.Meta;
import vn.nphuy.chatapp.domain.response.ResultPaginationDTO;
import vn.nphuy.chatapp.repository.ChannelRepository;
import vn.nphuy.chatapp.repository.ServerRepository;
import vn.nphuy.chatapp.util.specification.ChannelSpecifications;

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
    return channelRepository.findById(channelId).orElse(null);
  }

  public Channel createChannel(Channel channel) {
    if (channel.getServer() != null) {
      Server server = serverRepository.findById(channel.getServer().getId()).orElse(null);
      channel.setServer(server);
    }

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
