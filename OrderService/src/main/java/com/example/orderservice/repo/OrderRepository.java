package com.example.orderservice.repo;

import com.example.orderservice.model.Order;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface OrderRepository extends JpaRepository<Order, String> {

    @Query("SELECT o FROM Order o WHERE LOWER(o.orderCode) LIKE LOWER(CONCAT('%', :keyword, '%'))OR LOWER(o.publisher) LIKE LOWER(CONCAT('%', :keyword, '%')) AND o.status = :status")
    Page<Order> findByOrderCodeOrPublisherAndStatus(String keyword, String status, Pageable pageable);

}
