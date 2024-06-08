package com.example.productservice.repo;

import com.example.productservice.model.Book;
import com.example.productservice.model.BookDetail;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface BookDetailRepository extends MongoRepository<BookDetail, String> {
}
