package com.example.cartservice.repo;

import com.example.cartservice.model.CartItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;


@Repository
public interface CartItemRepository extends JpaRepository<CartItem, String> {
    @Query("SELECT ci FROM CartItem ci JOIN ci.cart c WHERE c.customerEmail = :email")
    List<CartItem> findAllByCustomerEmail(String email);
}
