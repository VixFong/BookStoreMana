package com.example.orderservice.dto.response;

import lombok.*;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class OrderCustomerItemResponse {

    private String itemId;
    private String bookId;
    private String image;
    private String title;
    private int purchaseQty;
    private int receiveQty;
    private Double price;
}
