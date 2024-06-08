package com.example.productservice.repo.Publisher;

import com.example.productservice.model.Author;
import com.example.productservice.model.Publisher;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface PublisherRepository extends MongoRepository<Publisher,String> {
}
