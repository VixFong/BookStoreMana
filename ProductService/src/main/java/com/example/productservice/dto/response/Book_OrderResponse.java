package com.example.productservice.dto.response;


import lombok.*;

import java.util.Set;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class Book_OrderResponse {
    private String title;
    private String image;
    private double price;


}
