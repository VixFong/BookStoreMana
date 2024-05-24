package com.example.accountservice.dto.response;

import lombok.*;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class LoginUserResponse {
    private String token;
    private boolean authenticated;
}
