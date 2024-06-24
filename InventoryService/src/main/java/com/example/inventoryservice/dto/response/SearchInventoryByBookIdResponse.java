package com.example.inventoryservice.dto.response;

import lombok.*;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class SearchInventoryByBookIdResponse {
    private String bookId;
}