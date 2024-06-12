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

    @Mapping(target = "priceDiscount", ignore = true)
    BookResponse toBookResponse(Book book);

    default BookResponse toBookResponseWithConditionalFields(Book book) {
        BookResponse response = toBookResponse(book);
        if (book.isFlashSale()) {
            response.setPriceDiscount(book.getPriceDiscount());
        } else {
            response.setPriceDiscount(0);
        }
        return response;
    }


    @Mapping(target = "info", expression = "java(request.getCustomFieldsMap())")
    BookDetail toBookDetail(CreateBookRequest request);

    BookDetailResponse toBookDetailResponse(BookDetail bookDetail);

    @Mapping(source = "book.bookId", target = "bookId")
    @Mapping(source = "book.title", target = "title")
    @Mapping(source = "book.discount", target = "discount")
    @Mapping(source = "book.flashSale", target = "flashSale")
    @Mapping(source = "book.lock", target = "lock")
    @Mapping(source = "book.images", target = "images")
    @Mapping(source = "book.price", target = "price")
    @Mapping(source = "bookDetail.author", target = "author")
    @Mapping(source = "bookDetail.publisher", target = "publisher")
    @Mapping(source = "bookDetail.categories", target = "categories")
    @Mapping(source = "bookDetail.description", target = "description")
    @Mapping(source = "bookDetail.info", target = "info")
    BookInfoResponse toBookInfoResponse(Book book, BookDetail bookDetail);

    @Mapping(target = "bookId", ignore = true)
    @Mapping(target = "images", ignore = true )
    @Mapping(target = "priceDiscount", ignore = true )
    void updateBookFromRequest(@MappingTarget Book book, UpdateBookRequest request);


    @Mapping(target = "info", expression = "java(request.getCustomFieldsMap())")
    @Mapping(target = "bookDetailId", ignore = true)
    void updateBookDetailFromRequest( @MappingTarget BookDetail bookDetail, UpdateBookRequest request);
}
