package com.example.inventoryservice.dto.request;

import lombok.*;

import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ListBookClientRequest {
    private List<String> bookId;
}
