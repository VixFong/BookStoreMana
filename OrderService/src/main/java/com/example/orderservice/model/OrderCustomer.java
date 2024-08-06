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
@Table(name = "order_customers")
public class OrderCustomer {
    public static final String STATUS_PROCESSING = "PROCESSING";
    public static final String STATUS_CONFIRM = "CONFIRM";
    public static final String STATUS_DELIVERING = "DELIVERING";
    public static final String STATUS_INCOMPLETE = "INCOMPLETE";
    public static final String STATUS_CANCEL = "CANCEL";
    public static final String STATUS_COMPLETE = "COMPLETE";

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;

    private String orderCode;

    private String email;
    private String address;
    private Integer numItems;
    private Double shipFee;
    private Double totalPrice;

    private String note;

    @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME)
    private LocalDateTime dateCreated;

    @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME)
    private LocalDateTime dateUpdated;

    private String status;

    @OneToMany(cascade = CascadeType.ALL, orphanRemoval = true)
    @JoinColumn(name = "order_id")
    private List<OrderCustomerItem> orderItems;

}
