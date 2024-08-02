package com.example.cartservice.dto.response;

import jakarta.persistence.Entity;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder

public class CartItemResponse {
    private String itemId;
    private String bookId;
    private String image;
    private String title;
    private Double price;
    private int quantity;
}
