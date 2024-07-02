package com.example.orderservice.dto.response;

import com.example.orderservice.model.OrderItem;
import lombok.*;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class OrderItemResponse {
    private String image;
    private String title;
    private int purchaseQty;
    private Double price;
}
