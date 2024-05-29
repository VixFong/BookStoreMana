package com.example.accountservice.dto.response;

import lombok.*;
import org.springframework.format.annotation.DateTimeFormat;

import java.time.LocalDateTime;
import java.util.Date;
import java.util.Set;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UserResponse {
    private String id;
    private String fullName;

    private String email;
//    private String password;
    private boolean lock;

    private boolean activate;
//    private String profilePicture;
//    private String address;

    @DateTimeFormat(pattern = "dd/MM/yyyy")
    private Date startedDate;
    private Set<RoleResponse> roles;
}
