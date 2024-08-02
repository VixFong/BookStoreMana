package com.example.orderservice.repo;

import com.example.orderservice.model.Order;
import com.example.orderservice.model.OrderCustomer;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

@Repository
public interface OrderCustomerRepository extends JpaRepository<OrderCustomer, String> {

    @Query("SELECT o FROM OrderCustomer o WHERE LOWER(o.orderCode) LIKE LOWER(CONCAT('%', :keyword, '%')) AND o.status = :status ")
    Page<OrderCustomer> findByOrderCode(String keyword, String status, Pageable pageable);
}
