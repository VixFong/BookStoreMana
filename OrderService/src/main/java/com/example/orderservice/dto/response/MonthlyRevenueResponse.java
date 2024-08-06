package com.example.orderservice.dto.response;


import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@ToString
@Builder
public class MonthlyRevenueResponse {
    private int month;
    private double revenue;
}
