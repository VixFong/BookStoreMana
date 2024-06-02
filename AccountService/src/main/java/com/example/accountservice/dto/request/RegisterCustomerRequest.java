package com.example.accountservice.dto.request;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.Size;
import lombok.*;
import org.springframework.format.annotation.DateTimeFormat;

import java.time.LocalDate;
import java.util.Date;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class RegisterCustomerRequest {
    private String fullName;

    @Email(message = "EMAIL_INVALID")
    private String email;

    @Size(min = 6, message = "PASSWORD_INVALID")
    private String password;
    private boolean lock;
    private boolean activate;
    @DateTimeFormat(pattern = "dd/MM/yyyy")
    private LocalDate startedDate;
}