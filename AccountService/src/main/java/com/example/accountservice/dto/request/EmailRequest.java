package com.example.accountservice.dto.request;

import jakarta.validation.constraints.Email;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class EmailRequest {
    @Email(message = "EMAIL_INVALID")
    private String email;

}
