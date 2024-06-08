package com.example.productservice.exception;

import lombok.AllArgsConstructor;
import lombok.Getter;
import org.springframework.http.HttpStatus;
import org.springframework.http.HttpStatusCode;

@Getter
@AllArgsConstructor
public enum ErrorCode {


    FAIL_UPLOAD_IMAGE(301, "Failed to upload image",HttpStatus.BAD_REQUEST),
    AUTHOR_EXISTED(201,"Author has existed", HttpStatus.BAD_REQUEST),
    AUTHOR_NOT_FOUND(202, "Author not found", HttpStatus.NOT_FOUND),
    CATEGORY_EXISTED(203,"Category has existed", HttpStatus.BAD_REQUEST),
    CATEGORY_NOT_FOUND(204, "Category not found", HttpStatus.NOT_FOUND),
    GENRE_EXISTED(204,"Genre has existed", HttpStatus.BAD_REQUEST),
    GENRE_NOT_FOUND(205, "Genre not found", HttpStatus.NOT_FOUND),
    BOOK_EXISTED(205,"Book has existed", HttpStatus.BAD_REQUEST),
    BOOK_NOT_FOUND(206, "Book not found", HttpStatus.NOT_FOUND),
//
//
//    EMAIL_INVALID(203,"Invalid email",HttpStatus.BAD_REQUEST),
//    PASSWORD_INVALID(204,"Password must be at least 6 characters",HttpStatus.BAD_REQUEST),
//    UNAUTHENTICATED(205,"Unauthenticated",HttpStatus.UNAUTHORIZED),
//    UNAUTHORIZED(206, "You do not have permission",HttpStatus.FORBIDDEN),
//    INVALID_TOKEN(207, "Invalid token",HttpStatus.BAD_REQUEST),
//    EXPIRED_TOKEN(208, "Token has been expired",HttpStatus.BAD_REQUEST),
//    ACCOUNT_LOCKED(210, "Your account has been locked",HttpStatus.BAD_REQUEST),
//    ACCOUNT_UNACTIVATED(211, "Your account is not activate",HttpStatus.BAD_REQUEST),
//    NOT_MATCH_PASSWORD(212, "Your confirm password is not match with password",HttpStatus.BAD_REQUEST),


    EXCEPTION(400,"Exception error", HttpStatus.INTERNAL_SERVER_ERROR)

    ;

    private int code;
    private String message;
    private HttpStatusCode statusCode;
}
