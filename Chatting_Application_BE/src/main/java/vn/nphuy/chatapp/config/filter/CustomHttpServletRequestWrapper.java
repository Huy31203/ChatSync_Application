package vn.nphuy.chatapp.config.filter;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletRequestWrapper;

public class CustomHttpServletRequestWrapper extends HttpServletRequestWrapper {

  public CustomHttpServletRequestWrapper(HttpServletRequest request) {
    super(request);
  }
}