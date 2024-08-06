package com.example.orderservice.controller;

import com.example.orderservice.dto.response.ApiResponse;
import com.example.orderservice.dto.response.SaleDateResponse;
import com.example.orderservice.service.RevenueService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("orders/revenue")
public class RevenueController {
    @Autowired
    private RevenueService revenueService;

    @GetMapping("/{year}")
    public ApiResponse<SaleDateResponse> getSaleData(@PathVariable int year){
        return ApiResponse.<SaleDateResponse>builder()
                .data(revenueService.getMonthlyRevenue(year))
                .build();
    }
}
