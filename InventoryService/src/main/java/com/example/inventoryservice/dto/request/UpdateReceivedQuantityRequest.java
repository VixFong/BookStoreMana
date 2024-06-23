package com.example.inventoryservice.dto.request;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UpdateReceivedQuantityRequest {
    private int receivedQuantity;

}
