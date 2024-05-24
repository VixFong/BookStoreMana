package com.example.accountservice.dto.response;

import lombok.*;
import org.springframework.format.annotation.DateTimeFormat;

import java.util.Date;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UserResponse {
    private String fullName;

    private String email;
    private String password;
    private boolean lock;

    private boolean activate;

    @DateTimeFormat(pattern = "dd/MM/yyyy")
    private Date startedDate;
}
