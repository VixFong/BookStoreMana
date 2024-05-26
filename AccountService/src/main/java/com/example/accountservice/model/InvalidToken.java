package com.example.accountservice.model;

import lombok.*;
import org.springframework.data.annotation.Id;

import java.util.Date;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class InvalidToken {
    @Id
    private String id;
    private Date expireTime;
}
