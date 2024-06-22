package com.example.productservice.dto.response;


import lombok.*;

import java.util.Set;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class Book_InventoryResponse {
    private String title;
    private String image;
    private Set<String> publishers;

}
