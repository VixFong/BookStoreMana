package com.example.accountservice.dto.request;


import jakarta.validation.constraints.Size;
import lombok.*;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ResetPasswordRequest {

    @Size(min = 6, message = "PASSWORD_INVALID")
    private String password;

    private String confirmPassword;
}
