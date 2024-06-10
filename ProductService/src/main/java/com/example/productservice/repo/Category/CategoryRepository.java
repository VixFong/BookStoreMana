package com.example.productservice.repo.Category;

import com.example.productservice.model.Author;
import com.example.productservice.model.Category;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface CategoryRepository extends MongoRepository<Category,String> {
    boolean existsCategoriesByCategory(String category);

    Optional<Category> findByCategory(String category);


}
