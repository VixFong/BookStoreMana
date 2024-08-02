package com.example.notificationservice.dto.request;

import lombok.*;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@ToString
public class SendOrder_NotificationCustomerRequest {
    private String orderCode;
    private String email;
    private Integer numItems;
    private LocalDateTime dateCreated;
    private String messageType;
}
