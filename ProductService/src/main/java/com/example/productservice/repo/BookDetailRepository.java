package com.example.productservice.repo;

import com.example.productservice.model.Book;
import com.example.productservice.model.BookDetail;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;

@Repository
public interface BookDetailRepository extends MongoRepository<BookDetail, String> {

    @Query(value = "{ '_id': ?0 }", fields = "{ 'publishers': 1}")
    BookDetail findBookDetailById(String id);
    boolean existsByCategoriesContains(String categoryId);

    boolean existsBookDetailByAuthor(String authorId);

//    Integer countByCategoriesContaining(String category);
    Integer countByCategoriesContaining(String categoryId);

    Integer countByAuthorContaining(String authorId);

}
