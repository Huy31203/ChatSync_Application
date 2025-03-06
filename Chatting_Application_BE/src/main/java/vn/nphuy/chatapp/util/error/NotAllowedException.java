package vn.nphuy.chatapp.util.error;

public class NotAllowedException extends RuntimeException {
  public NotAllowedException(String message) {
    super(message);
  }
}
