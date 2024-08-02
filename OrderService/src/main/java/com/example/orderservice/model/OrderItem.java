package com.example.orderservice.model;


import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Entity
@Table(name = "order_items")
public class OrderItem {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String itemId;

    private String bookId;
    private String image;
    private String title;
    private int purchaseQty;
    private int receiveQty;
    private Double price;



}
