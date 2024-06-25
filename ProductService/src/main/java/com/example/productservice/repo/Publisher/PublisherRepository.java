package com.example.productservice.repo.Publisher;

import com.example.productservice.model.Author;
import com.example.productservice.model.BookDetail;
import com.example.productservice.model.Category;
import com.example.productservice.model.Publisher;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface PublisherRepository extends MongoRepository<Publisher,String> {
    boolean existsPublisherByName(String name);

    Optional<Publisher> findByName(String name);

    @Query(value = "{ }", fields = "{ '_id': 1, 'name': 1 }")
    List<Publisher> findAllIdAndName();



}
