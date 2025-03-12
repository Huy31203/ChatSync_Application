package vn.nphuy.chatapp.controller;

import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseCookie;
import org.springframework.http.ResponseEntity;
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

import io.github.bucket4j.Bucket;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import vn.nphuy.chatapp.domain.Profile;
import vn.nphuy.chatapp.domain.request.ReqLoginDTO;
import vn.nphuy.chatapp.domain.request.ReqRegisterDTO;
import vn.nphuy.chatapp.domain.response.ResLoginDTO;
import vn.nphuy.chatapp.domain.response.ResProfileDTO;
import vn.nphuy.chatapp.domain.response.ResRegisterDTO;
import vn.nphuy.chatapp.service.ProfileService;
import vn.nphuy.chatapp.service.RateLimitService;
import vn.nphuy.chatapp.util.SecurityUtil;
import vn.nphuy.chatapp.util.annotation.ApiMessage;
import vn.nphuy.chatapp.util.error.BadRequestException;
import vn.nphuy.chatapp.util.error.ServerErrorException;
import vn.nphuy.chatapp.util.error.TokenInvalidException;
import vn.nphuy.chatapp.util.error.TooManyRequestsException;

@RestController
@RequiredArgsConstructor
@RequestMapping("/v1/auth")
@Slf4j
public class AuthController {
  private final AuthenticationManagerBuilder authenticationManagerBuilder;
  private final PasswordEncoder passwordEncoder;
  private final SecurityUtil securityUtil;
  private final ProfileService profileService;
  private final ModelMapper modelMapper;
  private final RateLimitService rateLimitService;
  // private final EmailService emailService;

  @Value("${nphuy.jwt.access-token-validity-in-seconds}")
  private long accessTokenValidity;

  @Value("${nphuy.jwt.refresh-token-validity-in-seconds}")
  private long refreshTokenValidity;

  @PostMapping("login")
  @ApiMessage(message = "Login")
  public ResponseEntity<Object> login(@Valid @RequestBody ReqLoginDTO loginCred) {

    // Apply rate limit based on email
    String key = loginCred.getEmail();
    Bucket bucket = rateLimitService.resolveBucket(key);

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
    profileService.updateProfileRefreshToken(loginCred.getEmail(), refreshToken);

    // Set cookies
    ResponseCookie resAccessCookie = ResponseCookie.from("accessToken", accessToken)
        .httpOnly(true)
        .path("/")
        .secure(true)
        .maxAge(accessTokenValidity)
        .build();

    ResponseCookie resRefreshCookie = ResponseCookie.from("refreshToken", refreshToken)
        .httpOnly(true)
        .path("/")
        .secure(true)
        .maxAge(refreshTokenValidity)
        .build();

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

    String hashPassword = passwordEncoder.encode(reqRegister.getPassword());
    reqRegister.setPassword(hashPassword);

    Profile newProfile = modelMapper.map(reqRegister, Profile.class);

    Profile result = profileService.createProfile(newProfile);
    if (result == null) {
      throw new ServerErrorException("Failed to register");
    }

    ResRegisterDTO res = modelMapper.map(result, ResRegisterDTO.class);

    return ResponseEntity.status(201).body(res);
  }

  // @PostMapping("forgot-password")
  // @ApiMessage(message = "Request to reset password")
  // public ResponseEntity<Void> forgotPassword(@RequestParam(name = "email")
  // String email) {
  // // check valid email by regex
  // boolean valid = GlobalUtil.checkValidEmail(email);
  // if (!valid) {
  // throw new BadRequestException("Email is invalid");
  // }

  // User profile = profileService.getUserByUserName(email);
  // if (profile != null) {
  // // Create reset token
  // String resetToken = securityUtil.createResetToken(email, profile);
  // profileService.updateUserResetToken(email, resetToken);

  // // Send email
  // emailService.sendPasswordResetEmail(email, resetToken);
  // }

  // return ResponseEntity.ok().body(null);
  // }

  // @PostMapping("reset-password")
  // @ApiMessage(message = "Reset password")
  // public ResponseEntity<Void> resetPassword(@RequestBody ReqResetPasswordDTO
  // resetCred) {
  // // Check valid email
  // String email = resetCred.getEmail();
  // String token = resetCred.getToken();
  // String newPassword = resetCred.getNewPassword();

  // boolean valid = GlobalUtil.checkValidEmail(email);
  // if (!valid) {
  // throw new BadRequestException("Email is invalid");
  // }

  // // Check valid reset token
  // securityUtil.checkValidResetToken(token);
  // User profile = profileService.getUserByResetTokenAndEmail(token, email);
  // if (profile == null) {
  // throw new TokenInvalidException("Refresh token is invalid");
  // }

  // String hashPassword = passwordEncoder.encode(newPassword);
  // profileService.updateUserPassword(email, hashPassword);
  // profileService.updateUserResetToken(email, null);

  // return ResponseEntity.ok().body(null);
  // }

  // @PostMapping("change-password")
  // @ApiMessage(message = "Change password")
  // public ResponseEntity<Void> changePassword(@RequestBody ReqChangePasswordDTO
  // changeCred) {
  // String oldPassword = changeCred.getOldPassword();
  // String newPassword = changeCred.getNewPassword();

  // // Check valid old password
  // User profile = securityUtil.getCurrentUser();
  // boolean valid = passwordEncoder.matches(oldPassword, profile.getPassword());

  // if (!valid) {
  // throw new BadCredentialsException("Old password is incorrect");
  // }

  // String hashPassword = passwordEncoder.encode(newPassword);
  // profileService.updateUserPassword(profile.getEmail(), hashPassword);

  // return ResponseEntity.ok().body(null);
  // }

  @GetMapping("current-profile")
  @ApiMessage(message = "Fetch current profile")
  public ResponseEntity<Object> fetchCurrentProfile() {
    Profile profile = securityUtil.getCurrentProfile();
    ResProfileDTO resProfile = modelMapper.map(profile, ResProfileDTO.class);

    return ResponseEntity.ok().body(resProfile);
  }

  @GetMapping("refresh")
  @ApiMessage(message = "Refresh tokens")
  public ResponseEntity<Object> refreshToken(@CookieValue(name = "refreshToken") String refreshToken) {
    log.info(">> Start refresh token with: {}", refreshToken);
    // Check valid and decode refresh token
    Jwt decodedToken = securityUtil.checkValidRefreshToken(refreshToken);
    String email = decodedToken.getSubject();

    log.info(">> token: {}", refreshToken);

    Bucket bucket = rateLimitService.resolveRefreshBucket(email);
    if (!bucket.tryConsume(1)) {
      throw new TooManyRequestsException("Too many refresh attempts, please try again later");
    }

    // Check profile by email + refresh token
    Profile profile = profileService.getProfileByRefreshTokenAndEmail(refreshToken, decodedToken.getSubject());

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

    profileService.updateProfileRefreshToken(profile.getEmail(), newRefreshToken);

    // Set cookies
    ResponseCookie resAccessCookie = ResponseCookie.from("accessToken", newAccessToken)
        .httpOnly(true)
        .path("/")
        .secure(true)
        .maxAge(accessTokenValidity)
        .build();

    ResponseCookie resRefreshCookie = ResponseCookie.from("refreshToken", newRefreshToken)
        .httpOnly(true)
        .path("/")
        .secure(true)
        .maxAge(refreshTokenValidity)
        .build();

    log.info(">> End refresh token");

    return ResponseEntity.ok()
        .header(HttpHeaders.SET_COOKIE, resAccessCookie.toString())
        .header(HttpHeaders.SET_COOKIE, resRefreshCookie.toString())
        .body(resLogin);
  }

  @GetMapping("logout")
  @ApiMessage(message = "Logout")
  public ResponseEntity<Void> logout() {
    Profile profile = securityUtil.getCurrentProfile();
    if (profile != null) {
      profileService.updateProfileRefreshToken(profile.getEmail(), null);
    }

    // Set cookies
    ResponseCookie resAccessCookie = ResponseCookie.from("accessToken", "")
        .httpOnly(true)
        .path("/")
        .secure(true)
        .build();

    ResponseCookie resRefreshCookie = ResponseCookie.from("refreshToken", "")
        .httpOnly(true)
        .path("/")
        .secure(true)
        .build();

    return ResponseEntity.ok()
        .header(HttpHeaders.SET_COOKIE, resAccessCookie.toString())
        .header(HttpHeaders.SET_COOKIE, resRefreshCookie.toString())
        .body(null);
  }
}
