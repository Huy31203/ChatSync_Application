package vn.nphuy.chatapp.util.error;

import java.io.IOException;
import java.net.URISyntaxException;
import java.util.List;

import org.hibernate.exception.ConstraintViolationException;
import org.springframework.data.mapping.PropertyReferenceException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.http.converter.HttpMessageNotReadableException;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.InternalAuthenticationServiceException;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.oauth2.jwt.JwtException;
import org.springframework.web.HttpRequestMethodNotSupportedException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.MissingRequestCookieException;
import org.springframework.web.bind.MissingServletRequestParameterException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.multipart.support.MissingServletRequestPartException;
import org.springframework.web.servlet.resource.NoResourceFoundException;

import vn.nphuy.chatapp.domain.response.RestResponse;

@RestControllerAdvice
public class GlobalExceptionHandler {
    @ExceptionHandler(value = { ResourceNotFoundException.class, NoResourceFoundException.class })
    public ResponseEntity<RestResponse<Object>> handleResourceNotFoundException(Exception ex) {
        RestResponse<Object> res = new RestResponse<>();
        res.setStatusCode(HttpStatus.NOT_FOUND.value());
        res.setMessage(ex.getMessage());
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(res);
    }

    @ExceptionHandler(value = { TooManyRequestsException.class })
    public ResponseEntity<RestResponse<Object>> handleTooManyRequestException(Exception ex) {
        RestResponse<Object> res = new RestResponse<>();
        res.setStatusCode(HttpStatus.TOO_MANY_REQUESTS.value());
        res.setMessage(ex.getMessage());
        return ResponseEntity.status(HttpStatus.TOO_MANY_REQUESTS).body(res);
    }

    @ExceptionHandler(value = { NotAllowedException.class })
    public ResponseEntity<RestResponse<Object>> handleRNotAllowedException(Exception ex) {
        RestResponse<Object> res = new RestResponse<>();
        res.setStatusCode(HttpStatus.FORBIDDEN.value());
        res.setMessage(ex.getMessage());
        return ResponseEntity.status(HttpStatus.FORBIDDEN).body(res);
    }

    @ExceptionHandler(value = { NotAuthorizedException.class })
    public ResponseEntity<RestResponse<Object>> handleRNotAuthorizedException(Exception ex) {
        RestResponse<Object> res = new RestResponse<>();
        res.setStatusCode(HttpStatus.UNAUTHORIZED.value());
        res.setMessage(ex.getMessage());
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(res);
    }

    @ExceptionHandler(value = { ServerErrorException.class, Exception.class })
    public ResponseEntity<RestResponse<Object>> handleServerErrorException(Exception ex) {
        RestResponse<Object> res = new RestResponse<>();
        res.setStatusCode(HttpStatus.INTERNAL_SERVER_ERROR.value());
        res.setMessage(ex.getMessage());
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(res);
    }

    @ExceptionHandler(value = {
            UsernameNotFoundException.class,
            HttpRequestMethodNotSupportedException.class,
            BadCredentialsException.class,
            JwtException.class,
            HttpMessageNotReadableException.class,
            PropertyReferenceException.class,
            BadRequestException.class,
            InternalAuthenticationServiceException.class,
            NullPointerException.class,
            TokenInvalidException.class,
            MissingRequestCookieException.class,
            URISyntaxException.class,
            IOException.class,
            IllegalArgumentException.class,
            ConstraintViolationException.class,
            UploadException.class,
            MissingServletRequestPartException.class,
            MissingServletRequestParameterException.class,
            IOException.class
    })
    public ResponseEntity<RestResponse<Object>> handleCredentialException(Exception ex) {
        RestResponse<Object> res = new RestResponse<>();
        res.setStatusCode(HttpStatus.BAD_REQUEST.value());

        if (ex.getMessage().contains("java.util.List.size()")) {
            // Handle filter condition error
            res.setMessage("Invalid filter condition");
        } else {
            res.setMessage(ex.getMessage());
        }
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(res);
    }

    @ExceptionHandler(value = { MethodArgumentNotValidException.class })
    public ResponseEntity<RestResponse<Object>> handleMethodArgumentNotValidException(
            MethodArgumentNotValidException ex) {
        RestResponse<Object> res = new RestResponse<>();
        res.setStatusCode(HttpStatus.BAD_REQUEST.value());

        List<String> errors = ex.getBindingResult().getFieldErrors().stream()
                .map(error -> error.getDefaultMessage())
                .toList();
        res.setMessage(errors.size() > 1 ? errors : errors.get(0));
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(res);
    }
}
