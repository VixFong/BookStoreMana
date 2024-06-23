package com.example.productservice.repo;

import com.example.productservice.dto.response.SearchBook_InventoryResponse;
import com.example.productservice.model.Book;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;
import java.util.List;
@Repository
public interface BookRepository extends MongoRepository<Book, String> {
    @Query("{ 'title': { $regex: ?0, $options: 'i' } }")
    Page<Book> findBookByTitle(String keyword, Pageable pageable);

    @Query(value = "{ '_id': ?0 }", fields = "{ 'title': 1, 'images': 1 }")
    Book findBookById(String id);


//  Lấy ra danh sách id của book
//    @Query("{ 'title': { $regex: ?0, $options: 'i' } }", fields = "{ '_id': 1 }")
    @Query(value = "{ 'title': { $regex: ?0, $options: 'i' } }", fields = "{ '_id': 1 }")
    List<SearchBook_InventoryResponse> findBookIdsByTitle(String keyword);
}
