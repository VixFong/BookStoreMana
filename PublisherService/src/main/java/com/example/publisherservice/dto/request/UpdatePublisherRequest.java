package com.example.publisherservice.dto.request;


import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UpdatePublisherRequest {
    private String name;

    private String address;

    private String publisher_id;

}
