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
        else if ("DELETE_ORDER".equals(request.getMessageType())) {
            message = "Delete order: " + request.getOrderCode() + ", " + request.getNumItems() + ", " + request.getDateCreated();
        }else if ("ARRIVAL_DATE_REACHED".equals(request.getMessageType())) {
            message = "Order arrival date reached: " + request.getOrderCode() + ", " + request.getNumItems() + ", " + request.getDateCreated();
        }
        else if ("UPDATE_STATUS".equals(request.getMessageType())) {
            message = "Order status updated: " + request.getOrderCode() + ", " + request.getNumItems() + ", " + request.getDateCreated();
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

//    public Page<Notification> listNotifications( String dateRange, int page, int size){
//        Pageable pageable = PageRequest.of(page, size);
//        LocalDateTime startDate = LocalDateTime.MIN;
//        LocalDateTime endDate = LocalDateTime.MAX;
//        if (!"All".equalsIgnoreCase(dateRange)) {
//            switch (dateRange) {
//                case "Today":
//                    startDate = LocalDate.now().atStartOfDay();
//                    endDate = LocalDate.now().atTime(LocalTime.MAX);
//                    break;
//                case "Yesterday":
//                    startDate = LocalDate.now().minusDays(1).atStartOfDay();
//                    endDate = LocalDate.now().minusDays(1).atTime(LocalTime.MAX);
//                    break;
//                case "Last 7 days":
//                    startDate = LocalDate.now().minusDays(7).atStartOfDay();
//                    endDate = LocalDate.now().atTime(LocalTime.MAX);
//                    break;
//                case "Last 30 days":
//                    startDate = LocalDate.now().minusDays(30).atStartOfDay();
//                    endDate = LocalDate.now().atTime(LocalTime.MAX);
//                    break;
//                case "Custom Dates":
//                    // Implement custom date range logic based on additional parameters, if needed
//                    break;
//
//                default:
//                    startDate = LocalDateTime.MIN;
//                    endDate = LocalDateTime.MAX;
//                    break;
//
//
//            }
//        }
//        Page<Notification> notificationPage;
//        if("All".equalsIgnoreCase(dateRange)){
//            notificationPage = notificationRepository.findAll(pageable);
//
//        } else {
//            notificationPage = notificationRepository.findByFilter(startDate, endDate, pageable);
//        }
//        return notificationPage;
//    }

    public List<Notification> getLatestNotifications() {
//        return notificationRepository.findTop10ByOrderByTimestampDesc();

        return notificationRepository.findAllByStatusOrderByTimestampDesc(Notification.STATUS_UNREAD);
    }

    public Notification markAsRead(String id) {
        Notification notification = notificationRepository.findById(id)
                .orElseThrow(() -> new AppException(ErrorCode.NOTIFICATION_NOT_FOUND));
        notification.setStatus(Notification.STATUS_READ);
        return notificationRepository.save(notification);
    }
}
