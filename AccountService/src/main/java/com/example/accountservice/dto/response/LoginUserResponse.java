package com.example.accountservice.dto.response;

import lombok.*;

import java.util.Set;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class LoginUserResponse {
    private String token;
    private boolean authenticated;
    private Set<String> roles;
}
