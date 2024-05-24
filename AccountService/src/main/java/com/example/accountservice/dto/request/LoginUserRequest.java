package com.example.accountservice.dto.request;


import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.Size;
import lombok.*;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class LoginUserRequest {
    @Email(message = "EMAIL_INVALID")
    private String email;

    @Size(min = 6, message = "PASSWORD_INVALID")
    private String password;
}
