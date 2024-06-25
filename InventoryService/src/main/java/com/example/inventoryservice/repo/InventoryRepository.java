package com.example.inventoryservice.repo;

import com.example.inventoryservice.dto.response.InventoryStatusResponse;
import com.example.inventoryservice.model.Inventory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.repository.Aggregation;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface InventoryRepository extends MongoRepository<Inventory, String> {
    Page<Inventory> findByBookIdIn(List<String> bookIds, Pageable pageable);

    Optional<Inventory> findInventoriesByBookId(String bookId);

    @Aggregation(pipeline = {
            "{ '$match': { 'bookId': { '$in': ?0 } } }",
            "{ '$project': { 'bookId': 1, 'status': 1 } }"
    })
    List<InventoryStatusResponse> findBookIdAndStatusByBookIds(List<String> bookIds);

    void deleteInventoriesByBookId(String bookId);
}
