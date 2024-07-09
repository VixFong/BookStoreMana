package com.example.notificationservice.model;

import jakarta.persistence.*;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import lombok.*;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Entity
public class Notification {
    public static final String STATUS_UNREAD = "UNREAD";
    public static final String STATUS_READ = "READ";
//    public static final String STATUS_INCOMPLETE = "INCOMPLETE";

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;

    private String title;
    private String message;
    private LocalDateTime timestamp;
    private String status;
    public Notification(String title, String message) {
        this.title = title;
        this.message = message;
    }
}
