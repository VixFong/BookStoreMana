package com.example.accountservice.model;

import jakarta.persistence.ManyToMany;
import lombok.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.Set;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Document(collection="roles")
public class Role {
    @Id
    private String name;

    @ManyToMany
    private Set<Permission> permissions;
}
