package vn.nphuy.chatsync.controller;

import java.util.Base64;

import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseCookie;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.CookieValue;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.fasterxml.jackson.databind.ObjectMapper;

import io.github.bucket4j.Bucket;
import jakarta.transaction.Transactional;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import vn.nphuy.chatsync.domain.Profile;
import vn.nphuy.chatsync.domain.request.ReqChangePasswordDTO;
import vn.nphuy.chatsync.domain.request.ReqForgotPasswordDTO;
import vn.nphuy.chatsync.domain.request.ReqLoginDTO;
import vn.nphuy.chatsync.domain.request.ReqRegisterDTO;
import vn.nphuy.chatsync.domain.request.ReqResetPasswordDTO;
import vn.nphuy.chatsync.domain.response.ResLoginDTO;
import vn.nphuy.chatsync.domain.response.ResProfileDTO;
import vn.nphuy.chatsync.domain.response.ResRegisterDTO;
import vn.nphuy.chatsync.service.EmailService;
import vn.nphuy.chatsync.service.ProfileService;
import vn.nphuy.chatsync.service.RateLimitService;
import vn.nphuy.chatsync.service.RefreshService;
import vn.nphuy.chatsync.util.SecurityUtil;
import vn.nphuy.chatsync.util.annotation.ApiMessage;
import vn.nphuy.chatsync.util.constant.GlobalUtil;
import vn.nphuy.chatsync.util.error.BadRequestException;
import vn.nphuy.chatsync.util.error.ServerErrorException;
import vn.nphuy.chatsync.util.error.TokenInvalidException;
import vn.nphuy.chatsync.util.error.TooManyRequestsException;

@RestController
@RequiredArgsConstructor
@RequestMapping("/v1/auth")
@Slf4j
public class AuthController {
  private final AuthenticationManagerBuilder authenticationManagerBuilder;
  private final PasswordEncoder passwordEncoder;
  private final SecurityUtil securityUtil;
  private final ProfileService profileService;
  private final RefreshService refreshService;
  private final ModelMapper modelMapper;
  private final RateLimitService rateLimitService;
  private final EmailService emailService;

  @Value("${nphuy.jwt.access-token-validity-in-seconds}")
  private long accessTokenValidity;

  @Value("${nphuy.jwt.refresh-token-validity-in-seconds}")
  private long refreshTokenValidity;

  @Value("${spring.profiles.active}")
  private String activeProfile;

  @PostMapping("login")
  @ApiMessage(message = "Login")
  public ResponseEntity<Object> login(@Valid @RequestBody ReqLoginDTO loginCred) {

    // Apply rate limit based on email
    String email = loginCred.getEmail();
    Bucket bucket = rateLimitService.resolveBucket(email);

    log.info(">> Start login with email: {}", email);

    if (!bucket.tryConsume(1)) {
      throw new TooManyRequestsException("Too many login attempts for this email, please try again later");
    }

    // Authenticate
    UsernamePasswordAuthenticationToken authenticationToken = new UsernamePasswordAuthenticationToken(
        loginCred.getEmail(), loginCred.getPassword());

    authenticationManagerBuilder.getObject().authenticate(authenticationToken);

    ResLoginDTO resLogin = new ResLoginDTO();

    Profile profile = profileService.getProfileByEmail(loginCred.getEmail());
    ResLoginDTO.ProfileLogin profileLogin = new ResLoginDTO.ProfileLogin(
        profile.getId(),
        profile.getEmail(),
        profile.getName());
    resLogin.setProfile(profileLogin);

    String accessToken = securityUtil.createAccessToken(loginCred.getEmail(), resLogin);

    // Create refresh token
    String refreshToken = securityUtil.createRefreshToken(loginCred.getEmail(), resLogin);
    refreshService.createRefreshToken(profile, refreshToken);

    // Set cookies
    ResponseCookie resAccessCookie = ResponseCookie.from("accessToken", accessToken)
        .httpOnly(true)
        .sameSite("None")
        .path("/")
        .secure(activeProfile.equals("prod"))
        .maxAge(accessTokenValidity)
        .build();

    ResponseCookie resRefreshCookie = ResponseCookie.from("refreshToken", refreshToken)
        .httpOnly(true)
        .sameSite("None")
        .path("/")
        .secure(activeProfile.equals("prod"))
        .maxAge(refreshTokenValidity)
        .build();

    log.info(">> End login with email: {}", email);

    return ResponseEntity.ok()
        .header(HttpHeaders.SET_COOKIE, resAccessCookie.toString())
        .header(HttpHeaders.SET_COOKIE, resRefreshCookie.toString())
        .body(resLogin);
  }

  @PostMapping("register")
  @ApiMessage(message = "Register")
  public ResponseEntity<Object> register(@Valid @RequestBody ReqRegisterDTO reqRegister) {
    if (profileService.isEmailExist(reqRegister.getEmail())) {
      throw new BadRequestException("Email already registered");
    }

    log.info(">> Start register with email: {}", reqRegister.getEmail());

    String hashPassword = passwordEncoder.encode(reqRegister.getPassword());
    reqRegister.setPassword(hashPassword);

    Profile newProfile = modelMapper.map(reqRegister, Profile.class);

    Profile result = profileService.createProfile(newProfile);
    if (result == null) {
      throw new ServerErrorException("Failed to register");
    }

    ResRegisterDTO res = modelMapper.map(result, ResRegisterDTO.class);

    log.info(">> End register with email: {}", reqRegister.getEmail());

    return ResponseEntity.status(201).body(res);
  }

  @PostMapping("forgot-password")
  @ApiMessage(message = "Request to reset password")
  public ResponseEntity<Void> forgotPassword(@RequestBody @Valid ReqForgotPasswordDTO reqForgotPassword) {
    // check valid email by regex
    String email = reqForgotPassword.getEmail();

    boolean valid = GlobalUtil.checkValidEmail(email);
    if (!valid) {
      throw new BadRequestException("Email is invalid");
    }

    log.info(">> Start forgot password for user: {}", email);

    Bucket bucket = rateLimitService.resolveBucket(email);
    if (!bucket.tryConsume(1)) {
      throw new TooManyRequestsException("Too many refresh attempts, please try again later");
    }

    Profile profile = profileService.getProfileByEmail(email);
    if (profile != null) {
      // Create reset token
      String resetToken = securityUtil.createResetToken(email, profile);
      profileService.updateProfileResetToken(email, resetToken);

      // Send email
      emailService.sendPasswordResetEmail(email, resetToken);
    }

    log.info(">> End forgot password for user: {}", email);

    return ResponseEntity.ok().body(null);
  }

  @PostMapping("reset-password")
  @ApiMessage(message = "Reset password")
  @Transactional(rollbackOn = Exception.class)
  public ResponseEntity<Void> resetPassword(@RequestBody ReqResetPasswordDTO resetCred) {
    // Check valid email
    String email = resetCred.getEmail();
    String token = resetCred.getToken();
    String newPassword = resetCred.getNewPassword();

    log.info(">> Start resetting password for user: {}", email);

    Bucket bucket = rateLimitService.resolveResetBucket(email);
    if (!bucket.tryConsume(1)) {
      throw new TooManyRequestsException("Too many refresh attempts, please try again later");
    }

    boolean valid = GlobalUtil.checkValidEmail(email);
    if (!valid) {
      throw new BadRequestException("Email is invalid");
    }

    // Check valid reset token
    securityUtil.checkValidToken(token);
    Profile profile = profileService.getProfileByResetTokenAndEmail(token, email);
    if (profile == null) {
      throw new TokenInvalidException("Refresh token is invalid");
    }

    String hashPassword = passwordEncoder.encode(newPassword);
    profileService.updateProfilePassword(email, hashPassword);
    profileService.updateProfileResetToken(email, null);

    log.info(">> End resetting password for user: {}", email);

    return ResponseEntity.ok().body(null);
  }

  @PostMapping("change-password")
  @ApiMessage(message = "Change current profille password")
  public ResponseEntity<Void> changePassword(@RequestBody ReqChangePasswordDTO changeCred) {
    String oldPassword = changeCred.getOldPassword();
    String newPassword = changeCred.getNewPassword();

    Profile profile = securityUtil.getCurrentProfile();

    log.info(">> Start changing password for user: ", profile.getEmail());

    Bucket bucket = rateLimitService.resolveBucket(profile.getEmail());
    if (!bucket.tryConsume(1)) {
      throw new TooManyRequestsException("Too many change password attempts, please try again later");
    }

    // If profile not have password, set new password
    if (!profile.isHavePassword()) {
      String hashPassword = passwordEncoder.encode(newPassword);
      profileService.updateProfilePassword(profile.getEmail(), hashPassword);

      profile.setHavePassword(true);
      profileService.updateProfile(profile);

      return ResponseEntity.ok().body(null);
    }

    // Check valid old password
    boolean valid = passwordEncoder.matches(oldPassword, profile.getPassword());

    if (!valid) {
      throw new BadCredentialsException("Old password is incorrect");
    }

    String hashPassword = passwordEncoder.encode(newPassword);
    profileService.updateProfilePassword(profile.getEmail(), hashPassword);

    log.info(">> End changing password for user: ", profile.getEmail());

    return ResponseEntity.ok().body(null);
  }

  @GetMapping("current-profile")
  @ApiMessage(message = "Fetch current profile")
  public ResponseEntity<Object> fetchCurrentProfile() {
    Profile profile = securityUtil.getCurrentProfile();
    ResProfileDTO resProfile = modelMapper.map(profile, ResProfileDTO.class);

    log.info(">> Start fetching current profile: {}", resProfile.getEmail());

    String profileJson;
    try {
      ObjectMapper objectMapper = new ObjectMapper();
      // Register the Java 8 date/time module
      objectMapper.registerModule(new com.fasterxml.jackson.datatype.jsr310.JavaTimeModule());
      objectMapper.disable(com.fasterxml.jackson.databind.SerializationFeature.WRITE_DATES_AS_TIMESTAMPS);
      profileJson = objectMapper.writeValueAsString(resProfile);
    } catch (Exception e) {
      log.error("Error converting profile to JSON", e);
      throw new ServerErrorException("Failed to convert profile to JSON");
    }

    String encodedProfileJson = Base64.getEncoder().encodeToString(profileJson.getBytes());

    ResponseCookie resProfileCookie = ResponseCookie.from("profile", encodedProfileJson)
        .httpOnly(true)
        .sameSite("None")
        .path("/")
        .secure(activeProfile.equals("prod"))
        .build();

    log.info(">> End fetching current profile: {}", resProfile.getEmail());

    return ResponseEntity
        .ok()
        .header(HttpHeaders.SET_COOKIE, resProfileCookie.toString())
        .body(resProfile);
  }

  @GetMapping("refresh")
  @ApiMessage(message = "Refresh tokens")
  public ResponseEntity<Object> refreshToken(@CookieValue(name = "refreshToken") String refreshToken) {
    log.info(">> Start refresh token with: {}", refreshToken);
    // Check valid and decode refresh token
    Jwt decodedToken = securityUtil.checkValidToken(refreshToken);
    String email = decodedToken.getSubject();

    log.info(">> Start refresh token for user: {}", email);

    Bucket bucket = rateLimitService.resolveRefreshBucket(email);
    if (!bucket.tryConsume(1)) {
      throw new TooManyRequestsException("Too many refresh attempts, please try again later");
    }

    // Check profile by email + refresh token
    Profile profile = refreshService.getProfileByRefreshTokenAndEmail(refreshToken, email);

    if (profile == null) {
      throw new TokenInvalidException("Refresh token is invalid");
    }

    ResLoginDTO resLogin = new ResLoginDTO();
    ResLoginDTO.ProfileLogin profileLogin = new ResLoginDTO.ProfileLogin(
        profile.getId(),
        profile.getEmail(),
        profile.getName());
    resLogin.setProfile(profileLogin);

    String newAccessToken = securityUtil.createAccessToken(profile.getEmail(), resLogin);

    String newRefreshToken = securityUtil.createRefreshToken(profile.getEmail(), resLogin);

    refreshService.updateRefreshTokenByEmail(profile.getEmail(), refreshToken, newRefreshToken);

    // Set cookies
    ResponseCookie resAccessCookie = ResponseCookie.from("accessToken", newAccessToken)
        .httpOnly(true)
        .sameSite("None")
        .path("/")
        .secure(activeProfile.equals("prod"))
        .maxAge(accessTokenValidity)
        .build();

    ResponseCookie resRefreshCookie = ResponseCookie.from("refreshToken", newRefreshToken)
        .httpOnly(true)
        .sameSite("None")
        .path("/")
        .secure(activeProfile.equals("prod"))
        .maxAge(refreshTokenValidity)
        .build();

    log.info(">> End refresh token for user: {}", email);

    return ResponseEntity.ok()
        .header(HttpHeaders.SET_COOKIE, resAccessCookie.toString())
        .header(HttpHeaders.SET_COOKIE, resRefreshCookie.toString())
        .body(resLogin);
  }

  @GetMapping("logout")
  @ApiMessage(message = "Logout")
  public ResponseEntity<Void> logout(@CookieValue(name = "refreshToken") String refreshToken) {
    Profile profile = securityUtil.getCurrentProfile();
    if (profile != null) {
      refreshService.deleteByRefreshTokenAndEmail(refreshToken, profile.getEmail());
    }

    log.info(">> Start logout with user: {}", profile.getEmail());

    // Set cookies
    ResponseCookie resAccessCookie = ResponseCookie.from("accessToken", "")
        .httpOnly(true)
        .sameSite("None")
        .path("/")
        .secure(activeProfile.equals("prod"))
        .build();

    ResponseCookie resRefreshCookie = ResponseCookie.from("refreshToken", "")
        .httpOnly(true)
        .sameSite("None")
        .path("/")
        .secure(activeProfile.equals("prod"))
        .build();

    // Clear profile cookie
    ResponseCookie resProfileCookie = ResponseCookie.from("profile", "")
        .httpOnly(true)
        .sameSite("None")
        .path("/")
        .secure(activeProfile.equals("prod"))
        .build();

    log.info(">> End logout with user: {}", profile.getEmail());

    return ResponseEntity.ok()
        .header(HttpHeaders.SET_COOKIE, resAccessCookie.toString())
        .header(HttpHeaders.SET_COOKIE, resRefreshCookie.toString())
        .header(HttpHeaders.SET_COOKIE, resProfileCookie.toString())
        .body(null);
  }
}
