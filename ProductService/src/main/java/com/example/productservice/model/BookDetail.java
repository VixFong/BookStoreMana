package com.example.productservice.model;

import lombok.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.HashMap;
import java.util.Set;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
@Document(collection = "book_details")
public class BookDetail {
    @Id
    private String bookDetailId;

    private String author;
    private Set<String> publishers;
    private Set<String> categories;

    private String description;

    private HashMap<String, String> info;
}
