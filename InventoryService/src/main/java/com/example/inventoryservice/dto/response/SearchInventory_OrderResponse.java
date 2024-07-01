package com.example.inventoryservice.dto.response;

import lombok.*;
import org.springframework.format.annotation.DateTimeFormat;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SearchInventory_OrderResponse {
    private int receivedQuantity;
    private String status;
    private String bookId;
}
