package com.example.orderservice.dto.response;

import com.example.orderservice.model.OrderItem;
import jakarta.persistence.CascadeType;
import jakarta.persistence.OneToMany;
import lombok.*;
import org.springframework.format.annotation.DateTimeFormat;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class OrderResponse {
    private String id;

    private String orderCode;

    private LocalDate estimatedArrivalDate;

    private String publisher;

//    private String currency;
    private Integer numItems;

    private Double shipFee;

    private Double taxFee;

    private Integer otherFee;

    private LocalDateTime dateCreated;

    private LocalDateTime dateUpdated;

    private String note;

    private String status;
//    @OneToMany(mappedBy = "order", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<OrderItem> orderItems;
}
