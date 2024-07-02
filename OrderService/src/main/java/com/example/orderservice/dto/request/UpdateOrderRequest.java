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
public class UpdateOrderRequest {

    private LocalDate estimatedArrivalDate;

    private String publisher;

    private Integer numItems;

    private Double shipFee;

    private Integer taxFee;

    private Double otherFee;

    private String note;

    private List<OrderItem> orderItems;
}
