package vn.nphuy.chatsync.controller;

import org.modelmapper.ModelMapper;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import vn.nphuy.chatsync.domain.Profile;
import vn.nphuy.chatsync.domain.request.ReqProfileDTO;
import vn.nphuy.chatsync.domain.response.ResProfileDTO;
import vn.nphuy.chatsync.service.ProfileService;
import vn.nphuy.chatsync.util.annotation.ApiMessage;
import vn.nphuy.chatsync.util.error.ServerErrorException;

@RestController
@RequiredArgsConstructor
@RequestMapping("/v1")
@Slf4j
public class ProfileController {
  private final ProfileService profileService;
  private final ModelMapper modelMapper;

  @PatchMapping("/profile/{id}")
  @ApiMessage(message = "Update profile by id")
  public ResponseEntity<Object> updateServer(@PathVariable("id") String id, @RequestBody ReqProfileDTO reqProfile) {

    log.info("Updating profile with id: {}", id);

    Profile profile = modelMapper.map(reqProfile, Profile.class);
    profile.setId(id);
    Profile result = profileService.updateProfile(profile);
    if (result == null) {
      throw new ServerErrorException("Profile not found with id: " + id);
    }

    ResProfileDTO resProfile = modelMapper.map(result, ResProfileDTO.class);

    log.info("Profile updated successfully with id: {}", id);

    return ResponseEntity.ok(resProfile);
  }
}
