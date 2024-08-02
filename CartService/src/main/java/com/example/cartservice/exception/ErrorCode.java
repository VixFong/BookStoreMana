package com.example.cartservice.exception;

import lombok.AllArgsConstructor;
import lombok.Getter;
import org.springframework.http.HttpStatus;
import org.springframework.http.HttpStatusCode;

@Getter
@AllArgsConstructor
public enum ErrorCode {
//    FAIL_READING_EXCEL(201,"Internal server error while reading the Excel file", HttpStatus.INTERNAL_SERVER_ERROR),
//    NO_DATA(202,"Unauthenticated",HttpStatus.BAD_REQUEST),
//    FAIL_PARSE_EXCEL(203,"Failed to parse Excel file",HttpStatus.BAD_REQUEST),
    CART_NOT_FOUND(201, "Cart not found", HttpStatus.NOT_FOUND),
    CART_ITEM_NOT_FOUND(202, "Cart item not found", HttpStatus.NOT_FOUND),
    UNAUTHENTICATED(205,"Unauthenticated",HttpStatus.UNAUTHORIZED),
    UNAUTHORIZED(206, "You do not have permission",HttpStatus.FORBIDDEN),
    INVALID_TOKEN(302, "Invalid token",HttpStatus.BAD_REQUEST),

    EXCEPTION(400,"Exception error", HttpStatus.INTERNAL_SERVER_ERROR)

    ;

    private int code;
    private String message;
    private HttpStatusCode statusCode;
}
