package com.example.inventoryservice.dto.request;

import lombok.*;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class UpdateStockRequest {

    private String title;
    private String bookId;
    private int purchaseQty;
}
