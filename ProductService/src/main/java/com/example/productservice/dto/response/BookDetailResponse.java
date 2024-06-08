package com.example.productservice.dto.response;

import lombok.*;

import java.util.Set;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class BookDetailResponse {
    private String author;
    private String publisher;
    private Set<String> genre;
    private String description;
    private double price;
}
