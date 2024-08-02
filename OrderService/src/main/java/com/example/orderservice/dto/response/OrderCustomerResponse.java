package com.example.orderservice.dto.response;

import lombok.*;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.function.DoubleBinaryOperator;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class OrderCustomerResponse {
    private String id;

    private String orderCode;
    private String email;
    private String address;

    private Integer numItems;

    private Double shipFee;
    private Double totalPrice;

    private LocalDateTime dateCreated;

    private LocalDateTime dateUpdated;

    private String note;

    private String status;

    private List<OrderItemResponse> orderItems;

//    private List<OrderItem> orderItems;
}
