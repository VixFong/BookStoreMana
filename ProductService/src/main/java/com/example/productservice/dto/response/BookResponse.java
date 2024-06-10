package com.example.productservice.dto.response;

import com.example.productservice.model.Category;
import lombok.*;

import java.util.List;
import java.util.Set;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class BookResponse {
    private String bookId;
    private String title;
    private int discount;
    private boolean flashSale;
    private boolean lock;
    private List<String> images;
    private double price;
    private double priceDiscount;



}
