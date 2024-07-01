package com.example.productservice.repo;

import com.example.productservice.dto.response.BookIdsFromFilterResponse;
import com.example.productservice.dto.response.Book_OrderResponse;
import com.example.productservice.dto.response.SearchBook_InventoryResponse;
import com.example.productservice.model.Book;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Set;

@Repository
public interface BookRepository extends MongoRepository<Book, String> {
    @Query("{ 'title': { $regex: ?0, $options: 'i' } }")
    Page<Book> findBookByTitle(String keyword, Pageable pageable);


    @Query(value = "{ '_id': { $in: ?0 } }")
    Page<Book> findBooksByIdIn(Set<String> ids, Pageable pageable);


//    List<Book> findBooksByIdIn(Set<String> ids);
    @Query(value = "{ '_id': ?0 }", fields = "{ 'title': 1, 'images': 1 }")
    Book findBookById(String id);


    @Query(value = "{ '_id': ?0 }", fields = "{ 'title': 1, 'images': 1, 'price': 1 }")
    Book findBookById2(String id);

//  Lấy ra danh sách id của book
    @Query(value = "{ 'title': { $regex: ?0, $options: 'i' } }", fields = "{ '_id': 1 }")
    List<SearchBook_InventoryResponse> findBookIdsByTitle(String keyword);

    @Query("{ '_id': { $in: ?0 }, 'price': { $gte: ?1, $lte: ?2 } }")
    List<SearchBook_InventoryResponse> findByIdsAndPriceRange(Set<String> ids, double minPrice, double maxPrice);
}
