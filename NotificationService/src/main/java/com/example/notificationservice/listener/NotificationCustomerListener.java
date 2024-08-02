package com.example.notificationservice.listener;

import com.example.notificationservice.dto.request.SendOrder_NotificationCustomerRequest;
import com.example.notificationservice.dto.request.SendOrder_NotificationRequest;
import com.example.notificationservice.service.NotificationCustomerService;
import com.example.notificationservice.service.NotificationService;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import static com.example.notificationservice.config.RabbitMQConfig.ORDER_CUSTOMER_QUEUE;
import static com.example.notificationservice.config.RabbitMQConfig.ORDER_QUEUE;

@Component
public class NotificationCustomerListener {

    @Autowired
    private NotificationCustomerService notificationCustomerService;

    @RabbitListener(queues = ORDER_CUSTOMER_QUEUE)
    public void receiveOrderEvent(SendOrder_NotificationCustomerRequest request) {
        notificationCustomerService.create(request);
    }


}
