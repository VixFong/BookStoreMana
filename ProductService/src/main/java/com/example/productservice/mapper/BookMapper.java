package com.example.productservice.mapper;

import com.example.productservice.dto.request.CreateBookRequest;
import com.example.productservice.dto.request.UpdateBookRequest;
import com.example.productservice.dto.response.BookDetailResponse;
import com.example.productservice.dto.response.BookInfoResponse;
import com.example.productservice.dto.response.BookResponse;
import com.example.productservice.model.Book;
import com.example.productservice.model.BookDetail;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;

@Mapper(componentModel = "spring")
public interface BookMapper {
    Book toBook(CreateBookRequest request);

    BookResponse toBookResponse(Book book);


    BookDetail toBookDetail(CreateBookRequest request);

    BookDetailResponse toBookDetailResponse(BookDetail bookDetail);

    @Mapping(source = "book.bookId", target = "bookId")
    @Mapping(source = "book.title", target = "title")
    @Mapping(source = "book.categories", target = "categories")
    @Mapping(source = "book.discount", target = "discount")
    @Mapping(source = "book.flashSale", target = "flashSale")
    @Mapping(source = "book.lock", target = "lock")
    @Mapping(source = "book.image", target = "image")
    @Mapping(source = "bookDetail.author", target = "author")
    @Mapping(source = "bookDetail.publisher", target = "publisher")
    @Mapping(source = "bookDetail.genre", target = "genre")
    @Mapping(source = "bookDetail.description", target = "description")
    @Mapping(source = "bookDetail.price", target = "price")
    BookInfoResponse toBookInfoResponse(Book book, BookDetail bookDetail);

    @Mapping(target = "bookId", ignore = true)
    @Mapping(target = "status", ignore = true)
    @Mapping(target = "image", ignore = true )
    void updateBookFromRequest(@MappingTarget Book book, UpdateBookRequest request);

    @Mapping(target = "bookDetailId", ignore = true)
    void updateBookDetailFromRequest( @MappingTarget BookDetail bookDetail, UpdateBookRequest request);
}
