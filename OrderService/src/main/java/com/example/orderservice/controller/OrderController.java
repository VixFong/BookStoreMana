package com.example.orderservice.controller;

import com.example.orderservice.dto.request.CreateOrderRequest;
import com.example.orderservice.dto.response.ApiResponse;
import com.example.orderservice.dto.response.OrderResponse;
import com.example.orderservice.service.OrderService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/orders")
public class OrderController {
    @Autowired
    private OrderService orderService;

    @PostMapping
    public ApiResponse<OrderResponse> createOrder(@RequestBody CreateOrderRequest request) {
        return ApiResponse.<OrderResponse>builder()
                .data(orderService.create(request))
                .build();
    }


    @GetMapping("/search")
    public ApiResponse<Page<OrderResponse>> searchOrder(
            @RequestParam String keyword,
            @RequestParam String status,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "4") int size) {
        return ApiResponse.<Page<OrderResponse>>builder()
                .data(orderService.searchOrders(keyword, status, page, size))
                .build();
    }
}
