package com.example.accountservice.model;

import jakarta.persistence.Entity;
import lombok.*;
import jakarta.persistence.Id;

//import org.springframework.data.mongodb.core.mapping.Document;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Entity
//@Document(collection="permissions")
public class Permission {
    @Id
    private String name;
}