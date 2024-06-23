package com.example.inventoryservice.model;

import lombok.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.format.annotation.DateTimeFormat;

import java.time.LocalDateTime;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
@Document(collection = "inventories")
public class Inventory {
    @Id
    private String id;

    @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME)
    private LocalDateTime dateCreated;

    @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME)
    private LocalDateTime dateUpdated;

    private int orderedQuantity;
    private int receivedQuantity;

    private double totalPrice;
    private String status;
    private String bookId;

    public static final String STATUS_NEW = "NEW BOOK";
    public static final String STATUS_IN_STOCK = "IN STOCK";

    public static final String STATUS_OUT_OF_STOCK = "OUT OF STOCK";
    public static final String STATUS_NEED_REORDER = "NEED REORDER";

}
