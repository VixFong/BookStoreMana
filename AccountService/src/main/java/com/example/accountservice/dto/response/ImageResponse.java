package com.example.accountservice.dto.response;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ImageResponse {
    private String id;
    private String name;
    private String url;
}