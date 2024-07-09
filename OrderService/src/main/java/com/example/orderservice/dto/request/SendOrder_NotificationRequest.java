package com.example.orderservice.dto.request;

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
public class SendOrder_NotificationRequest {

    private String orderCode;
    private Integer numItems;
    private LocalDateTime dateCreated;
    private String messageType;
}
