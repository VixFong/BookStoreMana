package com.example.inventoryservice.repo;

import com.example.inventoryservice.model.Inventory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface InventoryRepository extends MongoRepository<Inventory, String> {
    Page<Inventory> findByBookIdIn(List<String> bookIds, Pageable pageable);
}
