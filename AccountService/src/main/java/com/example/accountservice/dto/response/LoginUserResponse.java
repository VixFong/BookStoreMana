package com.example.accountservice.dto.response;

import com.example.accountservice.model.User;
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
    private String fullName;
    private String profilePicture;
    private Set<String> roles;
}
