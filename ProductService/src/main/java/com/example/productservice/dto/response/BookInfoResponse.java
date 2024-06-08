package com.example.productservice.dto.response;

import com.example.productservice.model.Category;
import lombok.*;

import java.awt.*;
import java.util.List;
import java.util.Set;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class BookInfoResponse {
    private String bookId;
    private String title;
    private Set<String> categories;
    private int discount;
    private boolean flashSale;
    private boolean lock;
    private String image;

    private String author;
    private String publisher;
    private Set<String> genre;
    private String description;
    private double price;
}
