package com.example.cartservice.model;

import jakarta.persistence.*;
import lombok.*;

import java.util.ArrayList;
import java.util.List;


@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Entity
public class Cart {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;

    private String customerEmail;
    @OneToMany(mappedBy = "cart", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<CartItem> items  = new ArrayList<>();;

}
