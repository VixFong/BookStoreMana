package com.example.inventoryservice.dto.response;

import lombok.*;
import org.springframework.format.annotation.DateTimeFormat;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class InventoryQuantityResponse {

    private String bookId;
    private int receivedQuantity;

}
