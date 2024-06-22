package com.example.productservice.dto.response;

import lombok.*;

import java.util.HashMap;
import java.util.Set;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class BookDetailResponse {
    private String author;
    private Set<String> publishers;
    private Set<String> categories;

    private String description;
    private HashMap<String, String> info;

}
