package vn.nphuy.chatapp.controller;

import org.modelmapper.ModelMapper;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import vn.nphuy.chatapp.domain.Channel;
import vn.nphuy.chatapp.domain.response.ResChannelDTO;
import vn.nphuy.chatapp.service.ChannelService;
import vn.nphuy.chatapp.util.SecurityUtil;
import vn.nphuy.chatapp.util.annotation.ApiMessage;
import vn.nphuy.chatapp.util.error.ResourceNotFoundException;

@RestController
@RequiredArgsConstructor
@RequestMapping("/v1")
@Slf4j
public class ChannelController {
  private final ChannelService channelService;
  private final ModelMapper modelMapper;
  private final SecurityUtil securityUtil;
  // private final RateLimitService rateLimitService;

  @GetMapping("/channels/{id}")
  @ApiMessage(message = "Fetch channel by id")
  public ResponseEntity<Object> getChannelById(@PathVariable("id") String id) {

    Channel result = channelService.getChannelById(id);

    if (result == null) {
      throw new ResourceNotFoundException("Channel not found with id: " + id);
    }

    ResChannelDTO resChannel = modelMapper.map(result, ResChannelDTO.class);

    return ResponseEntity.ok(resChannel);
  }
}
