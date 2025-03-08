package vn.nphuy.chatapp.util.error;

public class TooManyRequestsException extends RuntimeException {
  public TooManyRequestsException(String message) {
    super(message);
  }

}
