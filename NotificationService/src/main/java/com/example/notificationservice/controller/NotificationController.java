package com.example.notificationservice.controller;


import com.example.notificationservice.dto.response.ApiResponse;
import com.example.notificationservice.model.Notification;
import com.example.notificationservice.service.NotificationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/notifications")
public class NotificationController {
    @Autowired
    private NotificationService notificationService;

    @GetMapping
    public ApiResponse<List<Notification>> getAllNotifications() {
        return ApiResponse.<List<Notification>>builder()
                .data(notificationService.getAllNotifications())
                .build();
    }

    @PutMapping("/mark-as-read/{id}")
    public ApiResponse<Notification> markAsRead(@PathVariable String id) {
        return ApiResponse.<Notification>builder()
                .data(notificationService.markAsRead(id))
                .build();
    }

    @GetMapping("/latest")
    public ApiResponse<List<Notification>> getLatestNotifications() {
        return ApiResponse.<List<Notification>>builder()
                .data(notificationService.getLatestNotifications())
                .build();
    }
}
