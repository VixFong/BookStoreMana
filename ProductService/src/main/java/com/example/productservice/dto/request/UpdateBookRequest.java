package com.example.productservice.dto.request;

import lombok.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.Set;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UpdateBookRequest {

    private String bookId;
    private String bookDetailId;

    private String title;
    private Set<String> categories;
    private int discount;
    private boolean flashSale;
    private boolean lock;
    private MultipartFile file;

    private String author;
    private String publisher;
    private Set<String> genre;
    private String description;
    private double price;
}
