package com.example.accountservice.dto.request;


import com.example.accountservice.dto.response.RoleResponse;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.*;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.Date;
import java.util.Set;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CreateUserRequest {
    @NotNull
    private String fullName;

    @Email(message = "EMAIL_INVALID")
    private String email;

    private String phone;
    private String address;

    private boolean lock;

    private boolean activate;
    private MultipartFile file;

    @DateTimeFormat(pattern = "dd/MM/yyyy")
    private LocalDate startedDate;
    private String role;
}
