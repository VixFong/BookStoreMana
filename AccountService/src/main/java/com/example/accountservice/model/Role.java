package com.example.accountservice.model;

import jakarta.persistence.Entity;
import jakarta.persistence.ManyToMany;
import lombok.*;
import jakarta.persistence.Id;


import java.util.Set;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Entity
public class Role {
    @Id
    private String name;

    @ManyToMany
    private Set<Permission> permissions;
}
