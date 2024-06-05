package com.example.accountservice.dto.response;

import lombok.*;

import java.util.Set;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ProfileResponse {

    private String fullName;

    private String email;
    private String phone;
    private String address;
    private String profilePicture;
    private Set<RoleResponse> roles;
}
