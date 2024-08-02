package com.example.cartservice.repo;

import com.example.cartservice.model.Cart;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository

public interface CartRepository extends JpaRepository<Cart, String> {
    Optional<Cart> findByCustomerEmail(String customerEmail);

}
