package vn.nphuy.chatapp.util;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.MethodParameter;
import org.springframework.core.io.Resource;
import org.springframework.http.MediaType;
import org.springframework.http.server.ServerHttpRequest;
import org.springframework.http.server.ServerHttpResponse;
import org.springframework.http.server.ServletServerHttpResponse;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.servlet.mvc.method.annotation.ResponseBodyAdvice;

import jakarta.servlet.http.HttpServletResponse;
import vn.nphuy.chatapp.domain.response.RestResponse;
import vn.nphuy.chatapp.util.annotation.ApiMessage;

@ControllerAdvice
public class FormatRestResponse implements ResponseBodyAdvice<Object> {

  @Value("${server.servlet.context-path}")
  private String contextPath;

  @Override
  public boolean supports(MethodParameter returnType, Class converterType) {
    return true;
  }

  @Override
  public Object beforeBodyWrite(Object body, MethodParameter returnType, MediaType selectedContentType,
      Class selectedConverterType, ServerHttpRequest request, ServerHttpResponse response) {
    HttpServletResponse servletResponse = ((ServletServerHttpResponse) response).getServletResponse();
    int status = servletResponse.getStatus();

    RestResponse<Object> res = new RestResponse<>();
    res.setStatusCode(status);

    if (body instanceof Resource) {
      // case download file
      return body;
    }

    // case swagger
    String path = request.getURI().getPath();
    if (path.startsWith(contextPath + "/v3/api-docs") || path.startsWith(contextPath + "/swagger-ui")) {
      return body;
    }

    if (status >= 400) {
      // case error
      return body;
    } else {
      // case success
      res.setResult(body);
      ApiMessage apiMessage = returnType.getMethodAnnotation(ApiMessage.class);
      res.setMessage(apiMessage != null ? apiMessage.message() + " successfully" : "Call API successfully");
    }

    return res;
  }
}