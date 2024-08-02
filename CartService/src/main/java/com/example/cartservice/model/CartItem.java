package com.example.cartservice.model;

import jakarta.persistence.*;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Entity
public class CartItem {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String itemId;
    private String bookId;

    private String image;
    private String title;
    private Double price;

    private int quantity;

    @ManyToOne
    @JoinColumn(name = "cart_id", nullable = false)
    private Cart cart;
}
