package com.example.orderservice.model;


import jakarta.persistence.*;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Entity
@Table(name = "order_customer_items")
public class OrderCustomerItem {

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
