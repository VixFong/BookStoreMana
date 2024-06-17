package com.example.publisherservice.exception;

import lombok.AllArgsConstructor;
import lombok.Getter;
import org.springframework.http.HttpStatus;
import org.springframework.http.HttpStatusCode;

@Getter
@AllArgsConstructor
public enum ErrorCode {


    FAIL_UPLOAD_IMAGE(301, "Failed to upload image",HttpStatus.BAD_REQUEST),
    PUBLISHER_EXISTED(201,"Publisher has existed", HttpStatus.BAD_REQUEST),
    PUBLISHER_NOT_FOUND(202, "Publisher not found", HttpStatus.NOT_FOUND),
    CATEGORY_EXISTED(203,"Category has existed", HttpStatus.BAD_REQUEST),
    CATEGORY_NOT_FOUND(204, "Category not found", HttpStatus.NOT_FOUND),
    GENRE_EXISTED(204,"Genre has existed", HttpStatus.BAD_REQUEST),
    GENRE_NOT_FOUND(205, "Genre not found", HttpStatus.NOT_FOUND),
    BOOK_EXISTED(205,"Book has existed", HttpStatus.BAD_REQUEST),
    BOOK_NOT_FOUND(206, "Book not found", HttpStatus.NOT_FOUND),
    CATEGORY_CONTAINS_BOOKS(207,"Can not delete! Exist book have thís category.",HttpStatus.BAD_REQUEST),
    AUTHOR_CONTAINS_BOOKS(208,"Can not delete! Exist book have thís author.",HttpStatus.BAD_REQUEST),
    FAIL_PARSE_EXCEL(209,"Failed to parse Excel file",HttpStatus.BAD_REQUEST),



    EXCEPTION(400,"Exception error", HttpStatus.INTERNAL_SERVER_ERROR)

    ;

    private int code;
    private String message;
    private HttpStatusCode statusCode;
}
