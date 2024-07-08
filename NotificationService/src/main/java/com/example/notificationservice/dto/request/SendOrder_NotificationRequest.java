package com.example.notificationservice.dto.request;

import lombok.*;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@ToString
public class SendOrder_NotificationRequest {
    private String orderCode;
    private Integer numItems;
    private LocalDateTime dateCreated;

}
