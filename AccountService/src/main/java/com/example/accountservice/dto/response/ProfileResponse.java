package com.example.accountservice.dto.response;

import lombok.*;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ProfileResponse {
    private String phone;
    private String address;
    private String profilePicture;
}
