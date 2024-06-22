package com.example.productservice.dto.request.Publisher;


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
