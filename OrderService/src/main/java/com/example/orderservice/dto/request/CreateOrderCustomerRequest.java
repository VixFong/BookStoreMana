package com.example.orderservice.dto.request;

import com.example.orderservice.model.OrderItem;
import lombok.*;

import java.time.LocalDate;
import java.util.List;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class CreateOrderCustomerRequest {
    private String address;
    private Integer numItems;

    private Double shipFee;
    private Double totalPrice;
    private String note;

    private List<OrderItem> orderItems;
}
