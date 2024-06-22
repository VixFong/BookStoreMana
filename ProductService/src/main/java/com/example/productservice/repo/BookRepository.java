package com.example.productservice.repo;

import com.example.productservice.model.Book;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;

@Repository
public interface BookRepository extends MongoRepository<Book, String> {
    @Query("{ 'title': { $regex: ?0, $options: 'i' } }")
    Page<Book> findBookByTitle(String keyword, Pageable pageable);

    @Query(value = "{ '_id': ?0 }", fields = "{ 'title': 1, 'images': 1 }")
    Book findBookById(String id);

}
