package vn.nphuy.chatsync.util.error;

public class NotAuthorizedException extends RuntimeException {
  public NotAuthorizedException(String message) {
    super(message);
  }
}
