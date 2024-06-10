package com.example.productservice.repo.Author;

import com.example.productservice.model.Author;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;

@Repository
public interface AuthorRepository extends MongoRepository<Author,String> {
    boolean existsAuthorByAuthorName(String name);


}
