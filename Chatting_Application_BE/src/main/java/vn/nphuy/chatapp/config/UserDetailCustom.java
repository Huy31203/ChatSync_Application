package vn.nphuy.chatapp.config;

// import vn.nphuy.chatapp.service.UserService;

// @Component("userDetailsService")
// @RequiredArgsConstructor
// public class UserDetailCustom implements UserDetailsService {
// private final UserService userService;

// public UserDetailCustom(UserService userService) {
// this.userService = userService;
// }

// @Override
// public UserDetails loadUserByUsername(String username) throws
// UsernameNotFoundException {
// vn.nphuy.chatapp.domain.User user = userService.getUserByUserName(username);
// if (user == null) {
// throw new UsernameNotFoundException("Bad credentials");
// }

// return new User(user.getEmail(), user.getPassword(),
// Collections.singletonList(new SimpleGrantedAuthority("USER_ROLE")));
// }

// }
