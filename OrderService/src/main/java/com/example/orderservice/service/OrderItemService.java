package com.example.orderservice.service;

import com.example.orderservice.repo.OrderItemRepository;
import com.example.orderservice.repo.OrderRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class OrderItemService {
    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private OrderItemRepository orderItemRepository;

    
}
