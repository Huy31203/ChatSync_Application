package vn.nphuy.chatapp.controller;

import org.modelmapper.ModelMapper;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import vn.nphuy.chatapp.domain.Profile;
import vn.nphuy.chatapp.domain.request.ReqProfileDTO;
import vn.nphuy.chatapp.domain.response.ResProfileDTO;
import vn.nphuy.chatapp.service.ProfileService;
import vn.nphuy.chatapp.util.SecurityUtil;
import vn.nphuy.chatapp.util.annotation.ApiMessage;
import vn.nphuy.chatapp.util.error.ServerErrorException;

@RestController
@RequiredArgsConstructor
@RequestMapping("/v1")
@Slf4j
public class ProfileController {
  private final ProfileService profileService;
  private final ModelMapper modelMapper;
  private final SecurityUtil securityUtil;

  @PatchMapping("/profile/{id}")
  @ApiMessage(message = "Update profile by id")
  public ResponseEntity<Object> updateServer(@PathVariable("id") String id, @RequestBody ReqProfileDTO reqProfile) {

    Profile profile = modelMapper.map(reqProfile, Profile.class);
    profile.setId(id);
    Profile result = profileService.updateProfile(profile);
    if (result == null) {
      throw new ServerErrorException("Profile not found with id: " + id);
    }

    ResProfileDTO resProfile = modelMapper.map(result, ResProfileDTO.class);

    return ResponseEntity.ok(resProfile);
  }
}
