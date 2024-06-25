package com.example.inventoryservice.dto.response;


import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class InventoryStatusResponse {
    private String bookId;
    private String status;
}
