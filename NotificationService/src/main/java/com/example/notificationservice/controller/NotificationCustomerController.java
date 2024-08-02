package com.example.notificationservice.controller;


import com.example.notificationservice.dto.response.ApiResponse;
import com.example.notificationservice.model.Notification;
import com.example.notificationservice.model.NotificationCustomer;
import com.example.notificationservice.service.NotificationCustomerService;
import com.example.notificationservice.service.NotificationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/notifications/customers")
public class NotificationCustomerController {
    @Autowired
    private NotificationCustomerService notificationCustomerService;

    @GetMapping
    public ApiResponse<List<NotificationCustomer>> getAllNotifications() {
        return ApiResponse.<List<NotificationCustomer>>builder()
                .data(notificationCustomerService.getAllNotifications())
                .build();
    }

    @PutMapping("/mark-as-read/{id}")
    public ApiResponse<NotificationCustomer> markAsRead(@PathVariable String id) {
        return ApiResponse.<NotificationCustomer>builder()
                .data(notificationCustomerService.markAsRead(id))
                .build();
    }

    @GetMapping("/latest")
    public ApiResponse<List<NotificationCustomer>> getLatestNotifications() {
        System.out.println("notify");
        return ApiResponse.<List<NotificationCustomer>>builder()
                .data(notificationCustomerService.getLatestNotifications())
                .build();
    }
}
