package com.example.orderservice.model;


import jakarta.persistence.*;
import lombok.*;
import org.springframework.format.annotation.DateTimeFormat;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Entity
@Table(name = "orders")
public class Order {
    public static final String STATUS_PENDING = "PENDING";
    public static final String STATUS_DELIVERING = "DELIVERING";
    public static final String STATUS_CANCEL = "CANCEL";
    public static final String STATUS_COMPLETE = "COMPLETE";

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;

    private String orderCode;

    private LocalDate estimatedArrivalDate;

    private String publisher;

//    private String currency;
    private Integer numItems;
    private Double shipFee;

    private Integer taxFee;

    private Double otherFee;

    private String note;

    @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME)
    private LocalDateTime dateCreated;

    @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME)
    private LocalDateTime dateUpdated;

    private String status;

    @OneToMany(cascade = CascadeType.ALL, orphanRemoval = true)
    @JoinColumn(name = "order_id")
    private List<OrderItem> orderItems;

    public void addOrderItem(OrderItem item) {
        orderItems.add(item);
//        item.setOrder(this);
    }

}
