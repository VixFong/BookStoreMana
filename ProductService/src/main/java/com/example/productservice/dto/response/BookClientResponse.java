package com.example.productservice.dto.response;

import lombok.*;

import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class BookClientResponse {
    private String bookId;
    private String title;
    private int discount;
    private String image;
    private double price;
    private double priceDiscount;
}
