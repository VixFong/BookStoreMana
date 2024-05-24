package com.example.accountservice.dto.request;


import lombok.*;
import org.springframework.format.annotation.DateTimeFormat;

import java.util.Date;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CreateUserRequest {
    private String fullName;


    private String email;
    private String password;
    private boolean lock;

    private boolean activate;

    @DateTimeFormat(pattern = "dd/MM/yyyy")
    private Date startedDate;
}
