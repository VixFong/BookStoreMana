package com.example.accountservice.model;

import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import lombok.*;
import org.springframework.format.annotation.DateTimeFormat;

import java.util.Date;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;

    private String fullName;


    private String email;
    private String password;

    private String phone;
    private String address;

    private String profilePicture;
    private boolean lock;

    private boolean activate;

    @DateTimeFormat(pattern = "dd/MM/yyyy")
    private Date startedDate;
}
