package com.example.productservice.repo;

import com.example.productservice.dto.response.BookIdsFromFilterResponse;
import com.example.productservice.model.Book;
import com.example.productservice.model.BookDetail;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Set;

@Repository
public interface BookDetailRepository extends MongoRepository<BookDetail, String> {

    @Query(value = "{ '_id': ?0 }", fields = "{ 'publishers': 1}")
    BookDetail findBookDetailById(String id);
    boolean existsByCategoriesContains(String categoryId);

    boolean existsBookDetailByAuthor(String authorId);

//    Integer countByCategoriesContaining(String category);
    Integer countByCategoriesContaining(String categoryId);

    Integer countByAuthorContaining(String authorId);

    @Query(value = "{ 'categories': { $in: ?0 }, 'authors': { $in: ?1 }, 'publishers': { $in: ?2 } }", fields = "{ 'bookDetailId': 1 }")
    List<BookIdsFromFilterResponse> findBookDetailIdsByFilters(Set<String> categories, Set<String> authors, Set<String> publishers);

    @Query(value = "{ 'categories': { $in: ?0 } }", fields = "{ 'bookDetailId': 1 }")
    List<BookIdsFromFilterResponse> findBookDetailIdsByCategories(Set<String> categories);

    @Query(value = "{ 'author': { $in: ?0 } }", fields = "{ 'bookDetailId': 1 }")
    List<BookIdsFromFilterResponse> findBookDetailIdsByAuthors(Set<String> authors);

    @Query(value = "{ 'publishers': { $in: ?0 } }", fields = "{ 'bookDetailId': 1 }")
    List<BookIdsFromFilterResponse> findBookDetailIdsByPublishers(Set<String> publishers);
}
