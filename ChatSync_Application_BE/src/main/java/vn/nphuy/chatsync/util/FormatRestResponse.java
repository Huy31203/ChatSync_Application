package vn.nphuy.chatsync.util;

import java.util.Optional;

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
import lombok.extern.slf4j.Slf4j;
import vn.nphuy.chatsync.domain.response.RestResponse;
import vn.nphuy.chatsync.util.annotation.ApiMessage;

@ControllerAdvice
@Slf4j
public class FormatRestResponse implements ResponseBodyAdvice<Object> {

    @Value("${server.servlet.context-path}")
    private String contextPath;

    @Override
    public boolean supports(MethodParameter returnType, Class converterType) {
        return true;
    }

    @Override
    public Object beforeBodyWrite(
            Object body,
            MethodParameter returnType,
            MediaType selectedContentType,
            Class selectedConverterType,
            ServerHttpRequest request,
            ServerHttpResponse response) {

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
        if (path.startsWith(contextPath + "/v3/api-docs")
                || path.startsWith(contextPath + "/swagger-ui")) {
            return body;
        }

        if (status >= 400) {
            // case error
            return body;
        } else {
            // case success
            if (body == Optional.empty()) {
                res.setResult(null);
            }
            res.setResult(body);
            ApiMessage apiMessage = returnType.getMethodAnnotation(ApiMessage.class);
            res.setMessage(
                    apiMessage != null
                            ? apiMessage.message() + " successfully"
                            : "Call API successfully");
        }

        return res;
    }
}
