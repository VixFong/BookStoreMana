package com.example.notificationservice.controller;


import com.example.notificationservice.dto.response.ApiResponse;
import com.example.notificationservice.model.Notification;
import com.example.notificationservice.service.NotificationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

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
    @GetMapping("/latest")
    public ApiResponse<List<Notification>> getLatestNotifications() {
        return ApiResponse.<List<Notification>>builder()
                .data(notificationService.getLatestNotifications())
                .build();
    }
}
