package com.example.publisherservice.dto.response;


import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PublisherResponse {
    private String id;
    private String name;

    private String address;

    private String email;

}
