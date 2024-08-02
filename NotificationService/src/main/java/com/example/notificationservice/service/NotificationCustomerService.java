package com.example.notificationservice.service;


import com.example.notificationservice.dto.request.SendOrder_NotificationCustomerRequest;
import com.example.notificationservice.exception.AppException;
import com.example.notificationservice.exception.ErrorCode;
import com.example.notificationservice.model.Notification;
import com.example.notificationservice.model.NotificationCustomer;
import com.example.notificationservice.repo.NotificationCustomerRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class NotificationCustomerService {

    @Autowired
    private NotificationCustomerRepository notificationCustomerRepository;

    public NotificationCustomer create(SendOrder_NotificationCustomerRequest request) {
        String message;
        if ("NEW_ORDER_CUSTOMER".equals(request.getMessageType())) {
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

        var notification = NotificationCustomer.builder()
                .title("Order Customer")
                .email(request.getEmail())
                .message(message)
                .timestamp(LocalDateTime.now())
                .status(Notification.STATUS_UNREAD)
                .build();


        return notificationCustomerRepository.save(notification);
    }

    public List<NotificationCustomer> getAllNotifications() {
        return notificationCustomerRepository.findAllByTimestampDesc();
    }


    public List<NotificationCustomer> getLatestNotifications() {
        return notificationCustomerRepository.findAllByStatusOrderByTimestampDesc(Notification.STATUS_UNREAD);
    }

    public NotificationCustomer markAsRead(String id) {
        NotificationCustomer notification = notificationCustomerRepository.findById(id)
                .orElseThrow(() -> new AppException(ErrorCode.NOTIFICATION_NOT_FOUND));
        notification.setStatus(Notification.STATUS_READ);
        return notificationCustomerRepository.save(notification);
    }
}
