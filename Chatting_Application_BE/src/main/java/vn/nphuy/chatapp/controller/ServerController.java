package vn.nphuy.chatapp.controller;

import java.util.List;

import org.modelmapper.ModelMapper;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.turkraft.springfilter.boot.Filter;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import vn.nphuy.chatapp.domain.Profile;
import vn.nphuy.chatapp.domain.Server;
import vn.nphuy.chatapp.domain.request.ReqServerDTO;
import vn.nphuy.chatapp.domain.response.ResServerDTO;
import vn.nphuy.chatapp.domain.response.ResultPaginationDTO;
import vn.nphuy.chatapp.service.ServerService;
import vn.nphuy.chatapp.util.SecurityUtil;
import vn.nphuy.chatapp.util.annotation.ApiMessage;
import vn.nphuy.chatapp.util.error.ResourceNotFoundException;
import vn.nphuy.chatapp.util.error.ServerErrorException;

@RestController
@RequiredArgsConstructor
@RequestMapping("/v1")
@Slf4j
public class ServerController {
  private final ServerService serverService;
  private final ModelMapper modelMapper;
  private final SecurityUtil securityUtil;
  // private final RateLimitService rateLimitService;

  @GetMapping("/servers")
  @ApiMessage(message = "Fetch all servers")
  public ResponseEntity<Object> getAllServer(@Filter Specification<Server> spec,
      Pageable pageable) {

    ResultPaginationDTO results = serverService.getAllServer(spec, pageable);

    // Map Server entities to ResServerDTO objects
    if (results.getData() != null) {
      @SuppressWarnings("unchecked")
      List<Server> servers = (List<Server>) results.getData();

      List<ResServerDTO> serverDTOs = servers.stream()
          .map(server -> modelMapper.map(server, ResServerDTO.class))
          .toList();

      results.setData(serverDTOs);
    }

    return ResponseEntity.ok(results);
  }

  @GetMapping("/servers/current-profile")
  @ApiMessage(message = "Fetch all servers by current profile")
  public ResponseEntity<Object> getAllServersByProfile(Pageable pageable) {

    String profileId = securityUtil.getCurrentProfile().getId();

    ResultPaginationDTO results = serverService.getAllServersByProfileId(pageable, profileId);

    // Map Server entities to ResServerDTO objects
    if (results.getData() != null) {
      @SuppressWarnings("unchecked")
      List<Server> servers = (List<Server>) results.getData();

      List<ResServerDTO> serverDTOs = servers.stream()
          .map(server -> modelMapper.map(server, ResServerDTO.class))
          .toList();

      results.setData(serverDTOs);
    }

    return ResponseEntity.ok(results);
  }

  @GetMapping("/servers/{id}")
  @ApiMessage(message = "Fetch server by id")
  public ResponseEntity<Object> getServerById(@PathVariable("id") String id) {

    Server result = serverService.getServerById(id);

    if (result == null) {
      throw new ResourceNotFoundException("Server not found with id: " + id);
    }

    ResServerDTO resServer = modelMapper.map(result, ResServerDTO.class);

    return ResponseEntity.ok(resServer);
  }

  @PostMapping("/servers")
  @ApiMessage(message = "Create new server")
  public ResponseEntity<Object> createNewServer(@Valid @RequestBody ReqServerDTO reqServer) {

    Server server = modelMapper.map(reqServer, Server.class);
    Profile profile = securityUtil.getCurrentProfile();

    Server result = serverService.createServer(server, profile);

    if (result == null) {
      throw new ServerErrorException("Failed to create server");
    }

    ResServerDTO resServer = modelMapper.map(result, ResServerDTO.class);

    return ResponseEntity.status(201).body(resServer);
  }

  @PatchMapping("/servers/{id}")
  @ApiMessage(message = "Update server by id")
  public ResponseEntity<Object> updateServer(@PathVariable("id") String id, @RequestBody ReqServerDTO reqServer) {

    Server server = modelMapper.map(reqServer, Server.class);

    server.setId(id);
    Server result = serverService.updateServer(server);

    if (result == null) {
      throw new ResourceNotFoundException("Server not found with id: " + id);
    }

    ResServerDTO resServer = modelMapper.map(result, ResServerDTO.class);

    return ResponseEntity.ok(resServer);
  }

  @DeleteMapping("/servers/{id}")
  @ApiMessage(message = "Delete server by id")
  public ResponseEntity<Void> deleteServer(@PathVariable("id") String id) {

    boolean result = serverService.deleteServer(id);
    if (!result) {
      throw new ResourceNotFoundException("Server not found with id: " + id);
    }

    return ResponseEntity.ok().body(null);
  }
}
