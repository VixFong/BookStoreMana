package com.example.inventoryservice.dto.request;

import lombok.*;
import org.springframework.format.annotation.DateTimeFormat;

import java.awt.print.Book;
import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CreateInventoryRequest {


    private int orderedQuantity;
    private double totalPrice;

    private String bookId;
}
