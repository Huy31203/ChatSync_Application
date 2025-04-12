package vn.nphuy.chatsync.domain.response;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class RestResponse<T> {
    private int statusCode;

    // message can be string or arraylist
    private Object message;
    private T result;
}
