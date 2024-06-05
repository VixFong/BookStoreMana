package com.example.accountservice.dto.response;


import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotNull;
import lombok.*;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDate;
import java.util.Set;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class GetUserResponse {
    @NotNull
    private String fullName;

    @Email(message = "EMAIL_INVALID")
    private String email;

    private String phone;
    private String address;

    private boolean lock;

    private boolean activate;
    private String profilePicture;

    @DateTimeFormat(pattern = "dd/MM/yyyy")
    private LocalDate startedDate;

    private Set<RoleResponse> roles;
}
