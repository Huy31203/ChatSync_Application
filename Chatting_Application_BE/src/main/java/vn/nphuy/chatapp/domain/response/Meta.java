package vn.nphuy.chatapp.domain.response;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class Meta {
    private int page;
    private int pageSize;
    private int totalPages;
    private long totalElements;
}
