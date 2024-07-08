package com.example.notificationservice.listener;

import com.example.notificationservice.dto.request.SendOrder_NotificationRequest;
import com.example.notificationservice.model.Notification;
import com.example.notificationservice.service.NotificationService;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import static com.example.notificationservice.config.RabbitMQConfig.ORDER_QUEUE;

@Component
public class NotificationListener {

    @Autowired
    private NotificationService notificationService;

    @RabbitListener(queues = ORDER_QUEUE)
    public void receiveOrderEvent(SendOrder_NotificationRequest request) {
//        Notification notification = new Notification("Order event", "Order event received: " + request.toString());
        notificationService.create(request);
    }
}
