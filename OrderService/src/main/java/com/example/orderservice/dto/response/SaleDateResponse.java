package com.example.orderservice.dto.response;

import lombok.*;

import java.util.List;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class SaleDateResponse {
    private List<MonthlyRevenueResponse> orderRevenue;
    private List<MonthlyRevenueResponse> orderCustomerRevenue;
}
