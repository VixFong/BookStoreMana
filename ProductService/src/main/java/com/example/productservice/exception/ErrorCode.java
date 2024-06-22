package com.example.productservice.exception;

import lombok.AllArgsConstructor;
import lombok.Getter;
import org.springframework.http.HttpStatus;
import org.springframework.http.HttpStatusCode;

@Getter
@AllArgsConstructor
public enum ErrorCode {


    AUTHOR_EXISTED(201,"Author has existed", HttpStatus.BAD_REQUEST),
    AUTHOR_NOT_FOUND(202, "Author not found", HttpStatus.NOT_FOUND),
    CATEGORY_EXISTED(203,"Category has existed", HttpStatus.BAD_REQUEST),
    CATEGORY_NOT_FOUND(204, "Category not found", HttpStatus.NOT_FOUND),
    PUBLISHER_EXISTED(205,"Publisher has existed", HttpStatus.BAD_REQUEST),
    PUBLISHER_NOT_FOUND(206, "Publisher not found", HttpStatus.NOT_FOUND),
    BOOK_EXISTED(207,"Book has existed", HttpStatus.BAD_REQUEST),
    BOOK_NOT_FOUND(208, "Book not found", HttpStatus.NOT_FOUND),
    CATEGORY_CONTAINS_BOOKS(209,"Can not delete! Exist book have thís category.",HttpStatus.BAD_REQUEST),
    AUTHOR_CONTAINS_BOOKS(210,"Can not delete! Exist book have thís author.",HttpStatus.BAD_REQUEST),
    FAIL_PARSE_EXCEL(211,"Failed to parse Excel file",HttpStatus.BAD_REQUEST),

    FAIL_UPLOAD_IMAGE(300, "Failed to upload image",HttpStatus.BAD_REQUEST),

    UNAUTHENTICATED(301,"Unauthenticated",HttpStatus.UNAUTHORIZED),
    INVALID_TOKEN(302, "Invalid token",HttpStatus.BAD_REQUEST),

    EXCEPTION(400,"Exception error", HttpStatus.INTERNAL_SERVER_ERROR)

    ;

    private int code;
    private String message;
    private HttpStatusCode statusCode;
}
