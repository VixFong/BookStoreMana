package com.example.publisherservice.dto.request;


import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CreatePublisherRequest {

    private String name;

    private String address;

    private String email;

}
