package com.example.orderservice.service;

import com.example.orderservice.dto.request.CreateOrderRequest;
import com.example.orderservice.dto.response.OrderResponse;
import com.example.orderservice.mapper.OrderMapper;
import com.example.orderservice.model.Order;
import com.example.orderservice.repo.OrderItemRepository;
import com.example.orderservice.repo.OrderRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Random;

@Service
public class OrderService {
    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private OrderItemService orderItemService;


    @Autowired
    private OrderMapper orderMapper;


    public OrderResponse create(CreateOrderRequest request){
        Order order = orderMapper.toOrder(request);

        order.setDateCreated(LocalDateTime.now());

        order.setOrderCode(generateOrderCode());

        order.setStatus(Order.STATUS_PENDING);
        return orderMapper.toOrderResponse(orderRepository.save(order));

    }

    private String generateOrderCode(){
        Random random = new Random();
        int number = random.nextInt(900000) + 100000; // Generates a 6-digit number
        return String.valueOf("ORD"+number);
    }

    
    public Page<OrderResponse> searchOrders(String keyword, String status, int page, int size){
        Pageable pageable = PageRequest.of(page, size);

        Page<Order> ordersPage = orderRepository.findByOrderCodeOrPublisherAndStatus(keyword, status, pageable);

        return ordersPage.map(orderMapper::toOrderResponse);
    }
}
