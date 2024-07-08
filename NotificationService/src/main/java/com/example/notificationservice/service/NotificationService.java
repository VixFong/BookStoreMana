package com.example.notificationservice.service;


import com.example.notificationservice.dto.request.SendOrder_NotificationRequest;
import com.example.notificationservice.model.Notification;
import com.example.notificationservice.repo.NotificationRepository;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

import static com.example.notificationservice.config.RabbitMQConfig.ORDER_QUEUE;

@Service
public class NotificationService {

    @Autowired
    private NotificationRepository notificationRepository;

    public Notification create(SendOrder_NotificationRequest request) {
        Notification notification = Notification.builder()
                .title("Order event")
                .message("Add new order: " + request.getOrderCode() + ", " + request.getNumItems() + ", " + request.getDateCreated())
                .timestamp(LocalDateTime.now())
                .build();


        return notificationRepository.save(notification);
    }

    public List<Notification> getAllNotifications() {
        return notificationRepository.findAll();
    }

    public List<Notification> getLatestNotifications() {
        return notificationRepository.findTop10ByOrderByTimestampDesc();
    }
}
