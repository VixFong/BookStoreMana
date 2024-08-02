package com.example.notificationservice.service;


import com.example.notificationservice.dto.request.SendOrder_NotificationRequest;
import com.example.notificationservice.exception.AppException;
import com.example.notificationservice.exception.ErrorCode;
import com.example.notificationservice.model.Notification;
import com.example.notificationservice.repo.NotificationRepository;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.List;
import java.util.stream.Collectors;

import static com.example.notificationservice.config.RabbitMQConfig.ORDER_QUEUE;

@Service
public class NotificationService {

    @Autowired
    private NotificationRepository notificationRepository;

    public Notification create(SendOrder_NotificationRequest request) {
        String message;
        if ("NEW_ORDER".equals(request.getMessageType())) {
            message = "New order created: " + request.getOrderCode() + ", " + request.getNumItems() + ", " + request.getDateCreated();
        }
        else if ("NEW_ORDER_CUSTOMER".equals(request.getMessageType())) {
            message = "New order customer: " + request.getOrderCode() + ", " + request.getNumItems() + ", " + request.getDateCreated();
        }
        else if ("DELETE_ORDER".equals(request.getMessageType())) {
            message = "Delete order: " + request.getOrderCode() + ", " + request.getNumItems() + ", " + request.getDateCreated();
        }else if ("ARRIVAL_DATE_REACHED".equals(request.getMessageType())) {
            message = "Order arrival date reached: " + request.getOrderCode() + ", " + request.getNumItems() + ", " + request.getDateCreated();
        }
        else if ("UPDATE_STATUS".equals(request.getMessageType())) {
            message = "Order is delivering: " + request.getOrderCode() + ", " + request.getNumItems() + ", " + request.getDateCreated();
        } else {
            message = "Order event: " + request.getOrderCode() + ", " + request.getNumItems() + ", " + request.getDateCreated();
        }

        Notification notification = Notification.builder()
                .title("Order")
                .message(message)
                .timestamp(LocalDateTime.now())
                .status(Notification.STATUS_UNREAD)
                .build();


        return notificationRepository.save(notification);
    }

    public List<Notification> getAllNotifications() {
        return notificationRepository.findAllByTimestampDesc();
    }


    public List<Notification> getLatestNotifications() {

        return notificationRepository.findAllByStatusOrderByTimestampDesc(Notification.STATUS_UNREAD);
    }

    public Notification markAsRead(String id) {
        Notification notification = notificationRepository.findById(id)
                .orElseThrow(() -> new AppException(ErrorCode.NOTIFICATION_NOT_FOUND));
        notification.setStatus(Notification.STATUS_READ);
        return notificationRepository.save(notification);
    }
}
