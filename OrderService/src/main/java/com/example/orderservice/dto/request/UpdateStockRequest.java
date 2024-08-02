package com.example.orderservice.dto.request;

import com.example.orderservice.model.OrderItem;
import lombok.*;

import java.time.LocalDate;
import java.util.List;

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
