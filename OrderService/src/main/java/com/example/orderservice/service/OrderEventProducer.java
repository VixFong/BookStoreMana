package com.example.orderservice.service;

import com.example.orderservice.dto.request.SendOrder_NotificationRequest;
import com.example.orderservice.model.Order;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class OrderEventProducer {

    private final RabbitTemplate rabbitTemplate;
    private final String exchangeName = "order_exchange";

    @Autowired
    public OrderEventProducer(RabbitTemplate rabbitTemplate) {
        this.rabbitTemplate = rabbitTemplate;
    }

    public void sendOrderCreatedEvent(SendOrder_NotificationRequest request) {
        rabbitTemplate.convertAndSend(exchangeName, "order.created", request);
    }
}
