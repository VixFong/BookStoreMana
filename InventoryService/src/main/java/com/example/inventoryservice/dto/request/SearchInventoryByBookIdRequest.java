package com.example.inventoryservice.dto.request;

import lombok.*;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class SearchInventoryByBookIdRequest {
    private String bookId;
}