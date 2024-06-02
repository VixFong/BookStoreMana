package com.example.accountservice.dto.request;


import lombok.*;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;

import java.util.Objects;

@Getter
@Setter

@Builder
public class PageUserRequest {
    private Integer pageNo = 0;
    private Integer pageSize = 10;


    public Pageable getPageable(PageUserRequest request){
        Integer page = Objects.nonNull(request.getPageNo()) ? request.getPageNo() : this.pageNo;
        Integer size = Objects.nonNull(request.getPageSize()) ? request.getPageSize() : this.pageSize;

        PageRequest pageRequest = PageRequest.of(page,size);

        return pageRequest;
    }
}
