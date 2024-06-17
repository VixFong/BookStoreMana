package com.example.accountservice.model;

import jakarta.persistence.*;
import lombok.*;
import org.springframework.format.annotation.DateTimeFormat;
import java.time.LocalDate;
import jakarta.persistence.Id;

import java.util.List;
import java.util.Set;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Entity
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
    private boolean isLock;
    private boolean activate;

    @DateTimeFormat(pattern = "dd/MM/yyyy")
    private LocalDate startedDate;

    @ManyToMany
    private Set<Role> roles;
}
