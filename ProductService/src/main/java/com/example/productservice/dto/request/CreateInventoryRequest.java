package com.example.productservice.dto.request;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CreateInventoryRequest {
    private String bookId;
    private int orderedQuantity;
    private double totalPrice;
}
