package com.example.orderservice.dto.request;

import lombok.*;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class UpdateReceiveQtyRequest {
    private String itemId;
    private int receiveQty;
}
